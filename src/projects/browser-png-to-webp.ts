export type PngToWebpEncodingPort = Readonly<{
  encodePngBlobAsWebp: (pngBlob: Blob) => Promise<Blob>;
}>;

export async function encodePngAsWebp(
  pngBlob: Blob,
  pngToWebpEncodingPort: PngToWebpEncodingPort = browserPngToWebpEncodingPort,
): Promise<Uint8Array> {
  assertNonEmptyBlobWithType(pngBlob, "image/png", "PNG input");
  assertPngToWebpEncodingPort(pngToWebpEncodingPort);
  const webpBlob = await pngToWebpEncodingPort.encodePngBlobAsWebp(pngBlob);
  assertNonEmptyBlobWithType(webpBlob, "image/webp", "WebP output");
  const webpBytes = new Uint8Array(await webpBlob.arrayBuffer());
  assertWebpBytes(webpBytes);
  return webpBytes;
}

export const browserPngToWebpEncodingPort: PngToWebpEncodingPort = {
  async encodePngBlobAsWebp(pngBlob: Blob): Promise<Blob> {
    if (typeof createImageBitmap !== "function") {
      throw new Error(
        `PNG-to-WebP encoding requires createImageBitmap; received ${JSON.stringify(typeof createImageBitmap)}.`,
      );
    }
    if (
      typeof document === "undefined"
      || typeof document.createElement !== "function"
    ) {
      throw new Error(
        "PNG-to-WebP encoding requires document.createElement; received "
          + `${JSON.stringify(typeof document === "undefined" ? "undefined" : typeof document.createElement)}.`,
      );
    }
    const decodedBitmap = await createImageBitmap(pngBlob);
    try {
      assertDecodedBitmapDimensions(decodedBitmap.width, decodedBitmap.height);
      const encodingCanvas = document.createElement("canvas");
      encodingCanvas.width = decodedBitmap.width;
      encodingCanvas.height = decodedBitmap.height;
      const encodingContext = encodingCanvas.getContext("2d");
      if (encodingContext === null) {
        throw new Error("PNG-to-WebP encoding cannot create a 2D canvas context; received null.");
      }
      encodingContext.drawImage(decodedBitmap, 0, 0);
      return await createWebpBlob(encodingCanvas);
    } finally {
      decodedBitmap.close();
    }
  },
};

function createWebpBlob(encodingCanvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    encodingCanvas.toBlob((webpBlob) => {
      if (webpBlob === null) {
        reject(new Error("PNG-to-WebP encoding canvas returned null WebP Blob."));
        return;
      }
      resolve(webpBlob);
    }, "image/webp");
  });
}

function assertPngToWebpEncodingPort(
  pngToWebpEncodingPort: PngToWebpEncodingPort,
): void {
  if (
    typeof pngToWebpEncodingPort !== "object"
    || pngToWebpEncodingPort === null
    || typeof pngToWebpEncodingPort.encodePngBlobAsWebp !== "function"
  ) {
    throw new TypeError(
      `PNG-to-WebP encoding port must expose encodePngBlobAsWebp; received ${JSON.stringify(pngToWebpEncodingPort)}.`,
    );
  }
}

function assertNonEmptyBlobWithType(
  imageBlob: Blob,
  expectedMimeType: "image/png" | "image/webp",
  blobDescription: string,
): void {
  if (!(imageBlob instanceof Blob)) {
    throw new TypeError(
      `${blobDescription} must be a Blob; received ${JSON.stringify(imageBlob)}.`,
    );
  }
  if (imageBlob.size === 0 || imageBlob.type !== expectedMimeType) {
    throw new TypeError(
      `${blobDescription} must be a non-empty ${expectedMimeType} Blob; received type `
        + `${JSON.stringify(imageBlob.type)} and size ${String(imageBlob.size)}.`,
    );
  }
}

function assertWebpBytes(webpBytes: Uint8Array): void {
  if (!hasWebpContainerSignature(webpBytes)) {
    throw new TypeError(
      "WebP output bytes must contain a RIFF/WEBP container signature; received bytes "
        + `${JSON.stringify([...webpBytes])}.`,
    );
  }
  const declaredRiffSize = readWebpUint32(webpBytes, 4);
  const expectedRiffSize = webpBytes.byteLength - 8;
  if (declaredRiffSize !== expectedRiffSize) {
    throw new TypeError(
      "WebP output RIFF declared size must equal byte length minus 8; received declared size "
        + `${String(declaredRiffSize)} and byte length ${String(webpBytes.byteLength)}.`,
    );
  }
  if (webpBytes.byteLength < 20) {
    throw new TypeError(
      `WebP output must contain a supported first image chunk; received byte length ${String(webpBytes.byteLength)}.`,
    );
  }
  const firstChunkType = readWebpFourCharacterCode(webpBytes, 12);
  if (firstChunkType !== "VP8 " && firstChunkType !== "VP8L" && firstChunkType !== "VP8X") {
    throw new TypeError(
      `WebP output first chunk must be VP8 , VP8L, or VP8X; received chunk type ${JSON.stringify(firstChunkType)}.`,
    );
  }
  const declaredFirstChunkSize = readWebpUint32(webpBytes, 16);
  const firstChunkPayloadEnd = 20 + declaredFirstChunkSize;
  if (firstChunkPayloadEnd > webpBytes.byteLength) {
    throw new TypeError(
      "WebP output first chunk length exceeds available bytes; received declared chunk size "
        + `${String(declaredFirstChunkSize)} and byte length ${String(webpBytes.byteLength)}.`,
    );
  }
  const firstChunkPaddedEnd = firstChunkPayloadEnd + (declaredFirstChunkSize % 2);
  if (firstChunkPaddedEnd > webpBytes.byteLength) {
    throw new TypeError(
      "WebP output first chunk padding exceeds available bytes; received declared chunk size "
        + `${String(declaredFirstChunkSize)} and byte length ${String(webpBytes.byteLength)}.`,
    );
  }
}

function assertDecodedBitmapDimensions(width: number, height: number): void {
  if (
    !Number.isSafeInteger(width)
    || width <= 0
    || !Number.isSafeInteger(height)
    || height <= 0
  ) {
    throw new Error(
      "PNG-to-WebP decoded bitmap dimensions must be positive safe integers; received width "
        + `${String(width)} and height ${String(height)}.`,
    );
  }
}

function hasWebpContainerSignature(webpBytes: Uint8Array): boolean {
  return webpBytes.byteLength >= 12
    && webpBytes[0] === 0x52
    && webpBytes[1] === 0x49
    && webpBytes[2] === 0x46
    && webpBytes[3] === 0x46
    && webpBytes[8] === 0x57
    && webpBytes[9] === 0x45
    && webpBytes[10] === 0x42
    && webpBytes[11] === 0x50;
}

function readWebpUint32(webpBytes: Uint8Array, byteOffset: number): number {
  return webpBytes[byteOffset]!
    + webpBytes[byteOffset + 1]! * 2 ** 8
    + webpBytes[byteOffset + 2]! * 2 ** 16
    + webpBytes[byteOffset + 3]! * 2 ** 24;
}

function readWebpFourCharacterCode(
  webpBytes: Uint8Array,
  byteOffset: number,
): string {
  return String.fromCharCode(
    webpBytes[byteOffset]!,
    webpBytes[byteOffset + 1]!,
    webpBytes[byteOffset + 2]!,
    webpBytes[byteOffset + 3]!,
  );
}
