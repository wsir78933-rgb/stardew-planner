import { afterEach, describe, expect, it, vi } from "vitest";
import {
  browserPngToWebpEncodingPort,
  encodePngAsWebp,
} from "../../src/projects/browser-png-to-webp";

function createWebpBytes(
  firstChunkType = "VP8 ",
  firstChunkPayload = new Uint8Array([0]),
): Uint8Array {
  const firstChunkPaddingLength = firstChunkPayload.byteLength % 2;
  const webpBytes = new Uint8Array(20 + firstChunkPayload.byteLength + firstChunkPaddingLength);
  webpBytes.set([0x52, 0x49, 0x46, 0x46], 0);
  writeLittleEndianUint32(webpBytes, 4, webpBytes.byteLength - 8);
  webpBytes.set([0x57, 0x45, 0x42, 0x50], 8);
  webpBytes.set([...firstChunkType].map((character) => character.charCodeAt(0)), 12);
  writeLittleEndianUint32(webpBytes, 16, firstChunkPayload.byteLength);
  webpBytes.set(firstChunkPayload, 20);
  return webpBytes;
}

function writeLittleEndianUint32(
  targetBytes: Uint8Array,
  byteOffset: number,
  unsignedInteger: number,
): void {
  targetBytes[byteOffset] = unsignedInteger & 0xff;
  targetBytes[byteOffset + 1] = (unsignedInteger >>> 8) & 0xff;
  targetBytes[byteOffset + 2] = (unsignedInteger >>> 16) & 0xff;
  targetBytes[byteOffset + 3] = (unsignedInteger >>> 24) & 0xff;
}

function createWebpBlob(webpBytes = createWebpBytes()): Blob {
  const webpArrayBuffer = webpBytes.buffer.slice(
    webpBytes.byteOffset,
    webpBytes.byteOffset + webpBytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([webpArrayBuffer], { type: "image/webp" });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("browser PNG-to-WebP encoding", () => {
  it("uses the injected encoder only for a non-empty PNG and returns WebP bytes", async () => {
    const encodePngBlobAsWebp = vi.fn(async () => createWebpBlob());

    await expect(
      encodePngAsWebp(
        new Blob(["png"], { type: "image/png" }),
        { encodePngBlobAsWebp },
      ),
    ).resolves.toEqual(createWebpBytes());
  });

  it("fails for non-WebP output and does not relabel it", async () => {
    await expect(
      encodePngAsWebp(new Blob(["png"], { type: "image/png" }), {
        encodePngBlobAsWebp: async () => new Blob(["png"], { type: "image/png" }),
      }),
    ).rejects.toThrow("WebP output must be a non-empty image/webp Blob");
  });

  it("rejects empty or wrong-MIME input and empty or malformed WebP output", async () => {
    const validEncoder = { encodePngBlobAsWebp: async () => createWebpBlob() };

    await expect(
      encodePngAsWebp(new Blob([], { type: "image/png" }), validEncoder),
    ).rejects.toThrow("PNG input must be a non-empty image/png Blob");
    await expect(
      encodePngAsWebp(new Blob(["jpeg"], { type: "image/jpeg" }), validEncoder),
    ).rejects.toThrow("PNG input must be a non-empty image/png Blob");
    await expect(
      encodePngAsWebp(new Blob(["png"], { type: "image/png" }), {
        encodePngBlobAsWebp: async () => new Blob([], { type: "image/webp" }),
      }),
    ).rejects.toThrow("WebP output must be a non-empty image/webp Blob");
  });

  it("rejects malformed RIFF size, chunk type, chunk length, and chunk padding", async () => {
    const wrongRiffSize = createWebpBytes();
    writeLittleEndianUint32(wrongRiffSize, 4, 0);
    await expectEncodedBytesToFail(wrongRiffSize, "RIFF declared size");

    await expectEncodedBytesToFail(createWebpBytes("JUNK"), "first chunk must be VP8");

    const chunkLengthExceedsBytes = createWebpBytes();
    writeLittleEndianUint32(chunkLengthExceedsBytes, 16, 3);
    await expectEncodedBytesToFail(chunkLengthExceedsBytes, "chunk length exceeds");

    const chunkPaddingExceedsBytes = createWebpBytes().slice(0, 21);
    writeLittleEndianUint32(chunkPaddingExceedsBytes, 4, 13);
    writeLittleEndianUint32(chunkPaddingExceedsBytes, 16, 1);
    await expectEncodedBytesToFail(chunkPaddingExceedsBytes, "chunk padding exceeds");
  });

  it("closes the decoded browser bitmap after success and null canvas output", async () => {
    const close = vi.fn();
    vi.stubGlobal("createImageBitmap", async () => ({ width: 3, height: 2, close }));
    vi.stubGlobal("document", createBrowserDocument(() => createWebpBlob()));

    await expect(
      browserPngToWebpEncodingPort.encodePngBlobAsWebp(
        new Blob(["png"], { type: "image/png" }),
      ),
    ).resolves.toBeInstanceOf(Blob);
    expect(close).toHaveBeenCalledTimes(1);

    const closeAfterFailure = vi.fn();
    vi.stubGlobal(
      "createImageBitmap",
      async () => ({ width: 3, height: 2, close: closeAfterFailure }),
    );
    vi.stubGlobal("document", createBrowserDocument(() => null));
    await expect(
      browserPngToWebpEncodingPort.encodePngBlobAsWebp(
        new Blob(["png"], { type: "image/png" }),
      ),
    ).rejects.toThrow("canvas returned null WebP Blob");
    expect(closeAfterFailure).toHaveBeenCalledTimes(1);
  });

  it.each([[NaN, 1], [Infinity, 1], [1.5, 1], [0, 1]])(
    "rejects invalid decoded bitmap dimensions %s by %s",
    async (width, height) => {
      const close = vi.fn();
      vi.stubGlobal("createImageBitmap", async () => ({ width, height, close }));
      vi.stubGlobal("document", createBrowserDocument(() => createWebpBlob()));

      await expect(
        browserPngToWebpEncodingPort.encodePngBlobAsWebp(
          new Blob(["png"], { type: "image/png" }),
        ),
      ).rejects.toThrow("decoded bitmap dimensions must be positive safe integers");
      expect(close).toHaveBeenCalledTimes(1);
    },
  );
});

async function expectEncodedBytesToFail(
  webpBytes: Uint8Array,
  expectedErrorMessage: string,
): Promise<void> {
  await expect(
    encodePngAsWebp(new Blob(["png"], { type: "image/png" }), {
      encodePngBlobAsWebp: async () => createWebpBlob(webpBytes),
    }),
  ).rejects.toThrow(expectedErrorMessage);
}

function createBrowserDocument(createWebpOutput: () => Blob | null): object {
  return {
    createElement: () => ({
      width: 0,
      height: 0,
      getContext: () => ({ drawImage: vi.fn() }),
      toBlob: (callback: (webpBlob: Blob | null) => void) => callback(createWebpOutput()),
    }),
  };
}
