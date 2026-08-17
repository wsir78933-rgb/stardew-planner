import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { inflateSync } from "node:zlib";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { getBlogCopy } from "../../src/blog/blog-copy";
import { getAllBlogPosts } from "../../src/blog/blog-post-registry";
import { ArticleCard } from "../../src/components/blog/article-card";
import { BlogArticleContent } from "../../src/components/blog/blog-article-content";

const projectRoot = join(import.meta.dirname, "../..");
const pngSignature = "89504e470d0a1a0a";
const maximumCoverByteCount = 1.25 * 1024 * 1024;
const expectedCoverDimensions = { height: 941, width: 1672 } as const;
const robinArticleMediaExpectations = [
  {
    maximumByteCount: 400 * 1024,
    relativeImagePath: "blog/illustrations/robin-location-routes.webp",
    expectedDimensions: { height: 941, width: 1672 },
  },
  {
    maximumByteCount: 400 * 1024,
    relativeImagePath: "blog/illustrations/robin-schedule-states.webp",
    expectedDimensions: { height: 941, width: 1672 },
  },
  {
    maximumByteCount: 100 * 1024,
    relativeImagePath: "blog/video-posters/robin-location-guide.webp",
    expectedDimensions: { height: 720, width: 1280 },
  },
] as const;

type PngChunk = Readonly<{
  payload: Buffer;
  type: string;
}>;

type PngHeader = Readonly<{
  bitDepth: number;
  colorType: number;
  height: number;
  interlaceMethod: number;
  width: number;
}>;

function parsePngChunks(imagePath: string, imageBytes: Buffer): readonly PngChunk[] {
  const receivedSignature = imageBytes.subarray(0, 8).toString("hex");

  if (receivedSignature !== pngSignature) {
    throw new Error(`Invalid PNG signature at ${imagePath}. Received: ${receivedSignature}.`);
  }

  const chunks: PngChunk[] = [];
  let byteOffset = 8;
  let foundImageEnd = false;

  while (byteOffset < imageBytes.length) {
    if (byteOffset + 12 > imageBytes.length) {
      throw new Error(`Truncated PNG chunk header at ${imagePath}. Received offset: ${byteOffset}.`);
    }

    const payloadByteCount = imageBytes.readUInt32BE(byteOffset);
    const chunkType = imageBytes.subarray(byteOffset + 4, byteOffset + 8).toString("ascii");
    const chunkEnd = byteOffset + 12 + payloadByteCount;

    if (chunkEnd > imageBytes.length) {
      throw new Error(
        `Truncated PNG chunk at ${imagePath}. Received: ${chunkType} length ${payloadByteCount}.`,
      );
    }

    chunks.push({
      payload: imageBytes.subarray(byteOffset + 8, byteOffset + 8 + payloadByteCount),
      type: chunkType,
    });
    byteOffset = chunkEnd;

    if (chunkType === "IEND") {
      if (payloadByteCount !== 0 || byteOffset !== imageBytes.length) {
        throw new Error(
          `Invalid PNG IEND at ${imagePath}. Received length ${payloadByteCount}, end offset ${byteOffset}.`,
        );
      }
      foundImageEnd = true;
      break;
    }
  }

  if (!foundImageEnd) {
    throw new Error(`Missing PNG IEND at ${imagePath}. Received byte count: ${imageBytes.length}.`);
  }

  return chunks;
}

function readPngHeader(imagePath: string, chunks: readonly PngChunk[]): PngHeader {
  const headerChunk = chunks[0];

  if (headerChunk?.type !== "IHDR" || headerChunk.payload.length !== 13) {
    throw new Error(
      `Invalid PNG IHDR at ${imagePath}. Received: ${headerChunk?.type} length ${headerChunk?.payload.length}.`,
    );
  }

  return {
    bitDepth: headerChunk.payload[8],
    colorType: headerChunk.payload[9],
    height: headerChunk.payload.readUInt32BE(4),
    interlaceMethod: headerChunk.payload[12],
    width: headerChunk.payload.readUInt32BE(0),
  };
}

function getColorChannelCount(imagePath: string, colorType: number): number {
  const channelCounts = new Map([
    [0, 1],
    [2, 3],
    [3, 1],
    [4, 2],
    [6, 4],
  ]);
  const channelCount = channelCounts.get(colorType);

  if (channelCount === undefined) {
    throw new Error(`Unsupported PNG color type at ${imagePath}. Received: ${colorType}.`);
  }

  return channelCount;
}

function inflatePngScanlines(
  imagePath: string,
  chunks: readonly PngChunk[],
  header: PngHeader,
): void {
  if (header.interlaceMethod !== 0) {
    throw new Error(
      `Unsupported PNG interlace method at ${imagePath}. Received: ${header.interlaceMethod}.`,
    );
  }

  const compressedPayloads = chunks
    .filter((chunk) => chunk.type === "IDAT")
    .map((chunk) => chunk.payload);

  if (compressedPayloads.length === 0) {
    throw new Error(`Missing PNG IDAT at ${imagePath}. Received chunk count: ${chunks.length}.`);
  }

  let scanlineBytes: Buffer;
  try {
    scanlineBytes = inflateSync(Buffer.concat(compressedPayloads));
  } catch (decodeError) {
    throw new Error(`Unable to inflate PNG scanlines at ${imagePath}.`, { cause: decodeError });
  }

  const channelCount = getColorChannelCount(imagePath, header.colorType);
  const scanlinePayloadByteCount = Math.ceil(
    (header.width * header.bitDepth * channelCount) / 8,
  );
  const scanlineByteCount = scanlinePayloadByteCount + 1;
  const expectedByteCount = scanlineByteCount * header.height;

  if (scanlineBytes.length !== expectedByteCount) {
    throw new Error(
      `Invalid inflated PNG length at ${imagePath}. Received: ${scanlineBytes.length}; expected: ${expectedByteCount}.`,
    );
  }

  for (let rowIndex = 0; rowIndex < header.height; rowIndex += 1) {
    const filterByte = scanlineBytes[rowIndex * scanlineByteCount];
    if (filterByte > 4) {
      throw new Error(
        `Invalid PNG filter byte at ${imagePath}. Received: ${filterByte} on row ${rowIndex}.`,
      );
    }
  }
}

function readDecodedPng(relativeImagePath: string): Readonly<{
  byteCount: number;
  height: number;
  width: number;
}> {
  const imagePath = join(projectRoot, "public", relativeImagePath);
  const imageBytes = readFileSync(imagePath);
  const chunks = parsePngChunks(imagePath, imageBytes);
  const header = readPngHeader(imagePath, chunks);

  inflatePngScanlines(imagePath, chunks, header);

  return { byteCount: imageBytes.length, height: header.height, width: header.width };
}

function readVp8WebpDimensions(imagePath: string, imageBytes: Buffer): Readonly<{
  byteCount: number;
  height: number;
  width: number;
}> {
  if (imageBytes.length < 20) {
    throw new Error(
      `Truncated VP8 WebP header at ${imagePath}. Received byte count: ${imageBytes.length}.`,
    );
  }

  if (
    imageBytes.subarray(0, 4).toString("ascii") !== "RIFF" ||
    imageBytes.subarray(8, 12).toString("ascii") !== "WEBP" ||
    imageBytes.subarray(12, 16).toString("ascii") !== "VP8 "
  ) {
    throw new Error(`Invalid VP8 WebP image at ${imagePath}.`);
  }

  const declaredRiffByteCount = imageBytes.readUInt32LE(4) + 8;
  const declaredPayloadByteCount = imageBytes.readUInt32LE(16);
  const payloadByteOffset = 20;
  const payloadEndByteOffset = payloadByteOffset + declaredPayloadByteCount;
  const paddedPayloadEndByteOffset = payloadEndByteOffset + (declaredPayloadByteCount % 2);

  if (declaredRiffByteCount !== imageBytes.length) {
    throw new Error(
      `Invalid RIFF byte count at ${imagePath}. Declared: ${declaredRiffByteCount}; received: ${imageBytes.length}.`,
    );
  }

  if (declaredPayloadByteCount <= 10) {
    throw new Error(
      `VP8 payload is too short at ${imagePath}. Declared byte count: ${declaredPayloadByteCount}.`,
    );
  }

  if (paddedPayloadEndByteOffset !== imageBytes.length) {
    throw new Error(
      `Invalid VP8 payload length at ${imagePath}. Declared: ${declaredPayloadByteCount}; received file byte count: ${imageBytes.length}.`,
    );
  }

  if (imageBytes.subarray(payloadByteOffset + 3, payloadByteOffset + 6).toString("hex") !== "9d012a") {
    throw new Error(`Invalid VP8 frame header at ${imagePath}.`);
  }

  const width = imageBytes.readUInt16LE(payloadByteOffset + 6) & 0x3fff;
  const height = imageBytes.readUInt16LE(payloadByteOffset + 8) & 0x3fff;

  if (width === 0 || height === 0) {
    throw new Error(`Invalid VP8 dimensions at ${imagePath}. Received: ${width}x${height}.`);
  }

  return {
    byteCount: imageBytes.length,
    height,
    width,
  };
}

function readWebpDimensions(relativeImagePath: string): Readonly<{
  byteCount: number;
  height: number;
  width: number;
}> {
  const imagePath = join(projectRoot, "public", relativeImagePath);
  const imageBytes = readFileSync(imagePath);

  return readVp8WebpDimensions(imagePath, imageBytes);
}

function readFirstImageMarkup(markup: string): string {
  const imageMarkup = markup.match(/<img\b[^>]*>/)?.[0];

  if (imageMarkup === undefined) {
    throw new Error(`Missing rendered blog image. Received markup length: ${markup.length}.`);
  }

  return imageMarkup;
}

it("ships budget-compliant WebP covers for both blog identities", () => {
  const carpenterImage = readWebpDimensions("blog/carpenter-stardew-cover.webp");
  const robinImage = readWebpDimensions("blog/where-is-robin-stardew-valley-cover.webp");

  expect(carpenterImage).toMatchObject(expectedCoverDimensions);
  expect(robinImage).toMatchObject(expectedCoverDimensions);
  expect(carpenterImage.width / carpenterImage.height).toBeCloseTo(16 / 9, 2);
  expect(carpenterImage.byteCount).toBeLessThanOrEqual(maximumCoverByteCount);
  expect(robinImage.byteCount).toBeLessThanOrEqual(maximumCoverByteCount);
});

it("rejects a VP8 WebP whose declared frame payload is only a header", () => {
  const truncatedWebp = Buffer.alloc(30);
  truncatedWebp.write("RIFF", 0, "ascii");
  truncatedWebp.writeUInt32LE(22, 4);
  truncatedWebp.write("WEBP", 8, "ascii");
  truncatedWebp.write("VP8 ", 12, "ascii");
  truncatedWebp.writeUInt32LE(10, 16);
  truncatedWebp.write("\x00\x00\x00\x9d\x01\x2a\x88\x06\xad\x03", 20, "binary");

  expect(() => readVp8WebpDimensions("truncated.webp", truncatedWebp)).toThrow(
    "VP8 payload",
  );
});

it("ships budget-compliant WebP media for the Robin location guide", () => {
  for (const mediaExpectation of robinArticleMediaExpectations) {
    const image = readWebpDimensions(mediaExpectation.relativeImagePath);

    expect(image).toMatchObject(mediaExpectation.expectedDimensions);
    expect(image.width / image.height).toBeCloseTo(16 / 9, 2);
    expect(image.byteCount).toBeLessThanOrEqual(mediaExpectation.maximumByteCount);
  }

  expect(
    existsSync(join(projectRoot, "public/blog/where-is-robin-stardew-valley-cover.png")),
  ).toBe(false);
});

it("renders intrinsic cover dimensions and lazily loads only article-card images", () => {
  const post = getAllBlogPosts("en")[0];
  const copy = getBlogCopy("en");
  const cardImageMarkup = readFirstImageMarkup(
    renderToStaticMarkup(createElement(ArticleCard, { copy, locale: "en", post })),
  );
  const detailImageMarkup = readFirstImageMarkup(
    renderToStaticMarkup(createElement(BlogArticleContent, { copy, locale: "en", post })),
  );

  expect(cardImageMarkup).toContain('width="1672"');
  expect(cardImageMarkup).toContain('height="941"');
  expect(cardImageMarkup).toContain('loading="lazy"');
  expect(detailImageMarkup).toContain('width="1672"');
  expect(detailImageMarkup).toContain('height="941"');
  expect(detailImageMarkup).not.toContain('loading="lazy"');
});
