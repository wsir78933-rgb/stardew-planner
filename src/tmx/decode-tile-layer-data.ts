export interface TileLayerDataInput {
  readonly layerName: string;
  readonly encoding: string | null;
  readonly compression: string | null;
  readonly payload: string;
}

export const tiledFlipFlags = {
  horizontal: 0x80000000,
  vertical: 0x40000000,
  diagonal: 0x20000000,
} as const;

const tiledFlipFlagMask =
  tiledFlipFlags.horizontal | tiledFlipFlags.vertical | tiledFlipFlags.diagonal;

const base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function getBaseTileGid(rawGid: number): number {
  if (!Number.isInteger(rawGid) || rawGid < 0 || rawGid > 0xffffffff) {
    throw new Error(`TMX raw GID must be an unsigned 32-bit integer; received "${rawGid}".`);
  }

  return (rawGid & ~tiledFlipFlagMask) >>> 0;
}

export async function decodeTileLayerData({
  layerName,
  encoding,
  compression,
  payload,
}: TileLayerDataInput): Promise<Uint32Array> {
  if (encoding === "csv") {
    if (compression !== null) {
      throw new Error(
        `TMX layer "${layerName}" uses unsupported CSV compression "${compression}".`,
      );
    }

    return decodeCsvGids(payload, layerName);
  }

  if (encoding === "base64") {
    if (compression !== "zlib") {
      throw new Error(
        `TMX layer "${layerName}" uses unsupported base64 compression "${compression}". Expected "zlib".`,
      );
    }

    const compressedBytes = decodeBase64Payload(payload, layerName);
    const uncompressedBytes = await decompressZlibPayload(compressedBytes, layerName, payload);

    return decodeLittleEndianGids(uncompressedBytes, layerName);
  }

  throw new Error(
    `TMX layer "${layerName}" uses unsupported data encoding "${encoding}". Expected "csv" or "base64".`,
  );
}

function decodeCsvGids(csvPayload: string, layerName: string): Uint32Array {
  const compactCsvPayload = csvPayload.replace(/\s+/g, "");

  if (compactCsvPayload.length === 0) {
    throw new Error(`TMX layer "${layerName}" has an empty CSV payload "${csvPayload}".`);
  }

  const csvValues = compactCsvPayload.split(",");
  const rawGids = new Uint32Array(csvValues.length);

  for (const [valueIndex, csvValue] of csvValues.entries()) {
    rawGids[valueIndex] = parseUnsignedGid(csvValue, layerName, valueIndex);
  }

  return rawGids;
}

function parseUnsignedGid(csvValue: string, layerName: string, valueIndex: number): number {
  if (!/^(0|[1-9]\d*)$/.test(csvValue)) {
    throw new Error(
      `TMX layer "${layerName}" has invalid CSV GID "${csvValue}" at index ${valueIndex}.`,
    );
  }

  const parsedGid = Number(csvValue);

  if (!Number.isSafeInteger(parsedGid) || parsedGid > 0xffffffff) {
    throw new Error(
      `TMX layer "${layerName}" has out-of-range CSV GID "${csvValue}" at index ${valueIndex}.`,
    );
  }

  return parsedGid;
}

function decodeBase64Payload(base64Payload: string, layerName: string): Uint8Array {
  const compactBase64Payload = base64Payload.replace(/\s+/g, "");

  if (compactBase64Payload.length === 0) {
    throw new Error(`TMX layer "${layerName}" has an empty base64 payload "${base64Payload}".`);
  }

  validateBase64Payload(compactBase64Payload, base64Payload, layerName);

  if (typeof atob !== "function") {
    throw new Error(
      `TMX layer "${layerName}" cannot decode base64 payload "${base64Payload}" because atob is unavailable.`,
    );
  }

  const decodedBinary = atob(compactBase64Payload);
  const decodedBytes = new Uint8Array(decodedBinary.length);

  for (let byteIndex = 0; byteIndex < decodedBinary.length; byteIndex += 1) {
    decodedBytes[byteIndex] = decodedBinary.charCodeAt(byteIndex);
  }

  return decodedBytes;
}

function validateBase64Payload(
  compactBase64Payload: string,
  originalBase64Payload: string,
  layerName: string,
): void {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compactBase64Payload)) {
    throw new Error(
      `TMX layer "${layerName}" has invalid base64 payload "${originalBase64Payload}".`,
    );
  }

  const firstPaddingIndex = compactBase64Payload.indexOf("=");

  if (compactBase64Payload.length % 4 !== 0) {
    if (firstPaddingIndex !== -1) {
      throw new Error(
        `TMX layer "${layerName}" has invalid base64 padding in payload "${originalBase64Payload}".`,
      );
    }

    throw new Error(
      `TMX layer "${layerName}" has invalid base64 payload length for "${originalBase64Payload}".`,
    );
  }

  if (firstPaddingIndex === -1) {
    return;
  }

  const paddingLength = compactBase64Payload.length - firstPaddingIndex;
  const lastContentCharacter = compactBase64Payload.charAt(firstPaddingIndex - 1);
  const lastContentValue = base64Alphabet.indexOf(lastContentCharacter);

  if (lastContentValue === -1) {
    throw new Error(
      `TMX layer "${layerName}" has invalid base64 padding in payload "${originalBase64Payload}".`,
    );
  }

  const hasNonZeroPaddingBits =
    (paddingLength === 1 && (lastContentValue & 0b11) !== 0) ||
    (paddingLength === 2 && (lastContentValue & 0b1111) !== 0);

  if (hasNonZeroPaddingBits) {
    throw new Error(
      `TMX layer "${layerName}" has invalid base64 padding in payload "${originalBase64Payload}".`,
    );
  }
}

async function decompressZlibPayload(
  compressedBytes: Uint8Array,
  layerName: string,
  rawPayload: string,
): Promise<Uint8Array> {
  if (typeof DecompressionStream !== "function") {
    throw new Error(
      `TMX layer "${layerName}" cannot decompress zlib payload "${rawPayload}" because DecompressionStream("deflate") is unavailable.`,
    );
  }

  try {
    const decompressionStream = new DecompressionStream("deflate");
    const browserBlobBytes = new Uint8Array(compressedBytes.byteLength);

    browserBlobBytes.set(compressedBytes);

    const decompressedStream = new Blob([browserBlobBytes.buffer])
      .stream()
      .pipeThrough(decompressionStream);
    const decompressedBuffer = await new Response(decompressedStream).arrayBuffer();

    return new Uint8Array(decompressedBuffer);
  } catch (decompressionError) {
    const decompressionMessage =
      decompressionError instanceof Error
        ? decompressionError.message
        : String(decompressionError);

    throw new Error(
      `TMX layer "${layerName}" cannot decompress zlib payload "${rawPayload}": ${decompressionMessage}`,
    );
  }
}

function decodeLittleEndianGids(binaryPayload: Uint8Array, layerName: string): Uint32Array {
  if (binaryPayload.byteLength % 4 !== 0) {
    throw new Error(
      `TMX layer "${layerName}" produced ${binaryPayload.byteLength} decompressed bytes, which is not divisible by 4.`,
    );
  }

  const rawGidCount = binaryPayload.byteLength / 4;
  const rawGids = new Uint32Array(rawGidCount);
  const binaryView = new DataView(
    binaryPayload.buffer,
    binaryPayload.byteOffset,
    binaryPayload.byteLength,
  );

  for (let gidIndex = 0; gidIndex < rawGidCount; gidIndex += 1) {
    rawGids[gidIndex] = binaryView.getUint32(gidIndex * 4, true);
  }

  return rawGids;
}
