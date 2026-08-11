import { describe, expect, it, vi } from "vitest";
import {
  copyPngImageToClipboard,
  type BrowserImageClipboardPlatform,
} from "../../src/projects/browser-image-clipboard";

describe("browser image clipboard", () => {
  it("writes a PNG ClipboardItem through the provided browser platform", async () => {
    const pngBlob = new Blob(["png"], { type: "image/png" });
    const recording = createRecordingClipboardPlatform();

    await copyPngImageToClipboard(Promise.resolve(pngBlob), recording.platform);

    expect(recording.writeClipboardItem).toHaveBeenCalledWith(
      recording.clipboardItem,
    );
    await expect(recording.clipboardItem.pngImage).resolves.toBe(pngBlob);
  });

  it("starts the clipboard write before PNG encoding resolves", async () => {
    const pngImage = createDeferredPromise<Blob>();
    const recording = createCapturingClipboardPlatform();

    const copyPromise = copyPngImageToClipboard(pngImage.promise, recording.platform);

    expect(recording.writeClipboardItem).toHaveBeenCalledWith(
      recording.clipboardItem,
    );

    pngImage.resolve(new Blob(["png"], { type: "image/png" }));
    await expect(copyPromise).resolves.toBeUndefined();
    await expect(recording.clipboardItem.pngImage).resolves.toHaveProperty(
      "type",
      "image/png",
    );
  });

  it("rejects a non-PNG Blob before the clipboard write completes", async () => {
    const recording = createRecordingClipboardPlatform();

    await expect(
      copyPngImageToClipboard(
        Promise.resolve(new Blob(["bad"], { type: "text/plain" })),
        recording.platform,
      ),
    ).rejects.toThrow("must resolve to image/png; received text/plain");
  });

  it("keeps PNG MIME validation inside the ClipboardItem value promise", async () => {
    const pngImage = createDeferredPromise<Blob>();
    const recording = createCapturingClipboardPlatform();

    await expect(
      copyPngImageToClipboard(pngImage.promise, recording.platform),
    ).resolves.toBeUndefined();

    const capturedPngRejection = expect(
      recording.clipboardItem.pngImage,
    ).rejects.toThrow("must resolve to image/png; received text/plain");
    pngImage.resolve(new Blob(["bad"], { type: "text/plain" }));

    await capturedPngRejection;
  });

  it("reports navigator.clipboard.write when browser clipboard writing is unavailable", async () => {
    await withGlobalValue("navigator", undefined, async () => {
      await expect(
        copyPngImageToClipboard(
          Promise.resolve(new Blob(["png"], { type: "image/png" })),
        ),
      ).rejects.toThrow("navigator.clipboard.write");
    });
  });

  it("rejects when ClipboardItem is unavailable", async () => {
    await withGlobalValue(
      "navigator",
      { clipboard: { write: async () => undefined } },
      async () => {
        await withGlobalValue("ClipboardItem", undefined, async () => {
          await expect(
            copyPngImageToClipboard(
              Promise.resolve(new Blob(["png"], { type: "image/png" })),
            ),
          ).rejects.toThrow("ClipboardItem");
        });
      },
    );
  });

  it("rejects unsupported image/png clipboard items", async () => {
    const recording = createRecordingClipboardPlatform({ pngSupported: false });

    await expect(
      copyPngImageToClipboard(
        Promise.resolve(new Blob(["png"], { type: "image/png" })),
        recording.platform,
      ),
    ).rejects.toThrow("image/png");
    expect(recording.writeClipboardItem).not.toHaveBeenCalled();
  });

  it("propagates clipboard write rejection", async () => {
    const clipboardWriteError = new Error("Clipboard write was rejected.");
    const recording = createRecordingClipboardPlatform({ clipboardWriteError });

    await expect(
      copyPngImageToClipboard(
        Promise.resolve(new Blob(["png"], { type: "image/png" })),
        recording.platform,
      ),
    ).rejects.toBe(clipboardWriteError);
  });
});

function createRecordingClipboardPlatform(
  options: Readonly<{
    clipboardWriteError?: Error;
    pngSupported?: boolean;
  }> = {},
): {
  clipboardItem: { pngImage: Promise<Blob> };
  platform: BrowserImageClipboardPlatform;
  writeClipboardItem: ReturnType<typeof vi.fn>;
} {
  const clipboardItem = { pngImage: Promise.resolve(new Blob()) };
  const writeClipboardItem = vi.fn(async (item: unknown) => {
    await (item as { pngImage: Promise<Blob> }).pngImage;

    if (options.clipboardWriteError !== undefined) {
      throw options.clipboardWriteError;
    }
  });
  const platform: BrowserImageClipboardPlatform = {
    createClipboardItem(clipboardItemData) {
      clipboardItem.pngImage = clipboardItemData["image/png"];
      return clipboardItem;
    },
    isPngSupported() {
      return options.pngSupported ?? true;
    },
    writeClipboardItem,
  };

  return { clipboardItem, platform, writeClipboardItem };
}

function createCapturingClipboardPlatform(): {
  clipboardItem: { pngImage: Promise<Blob> };
  platform: BrowserImageClipboardPlatform;
  writeClipboardItem: ReturnType<typeof vi.fn>;
} {
  const clipboardItem = { pngImage: Promise.resolve(new Blob()) };
  const writeClipboardItem = vi.fn(async () => undefined);
  const platform: BrowserImageClipboardPlatform = {
    createClipboardItem(clipboardItemData) {
      clipboardItem.pngImage = clipboardItemData["image/png"];
      return clipboardItem;
    },
    isPngSupported() {
      return true;
    },
    writeClipboardItem,
  };

  return { clipboardItem, platform, writeClipboardItem };
}

function createDeferredPromise<Value>(): {
  promise: Promise<Value>;
  resolve(value: Value): void;
} {
  let resolvePromise: ((value: Value) => void) | undefined;
  const promise = new Promise<Value>((resolve) => {
    resolvePromise = resolve;
  });

  return {
    promise,
    resolve(value: Value): void {
      if (resolvePromise === undefined) {
        throw new Error("Deferred promise resolve function is unavailable.");
      }

      resolvePromise(value);
    },
  };
}

async function withGlobalValue(
  key: "ClipboardItem" | "navigator",
  value: unknown,
  action: () => Promise<void>,
): Promise<void> {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, key);
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value,
    writable: true,
  });

  try {
    await action();
  } finally {
    if (originalDescriptor === undefined) {
      Reflect.deleteProperty(globalThis, key);
    } else {
      Object.defineProperty(globalThis, key, originalDescriptor);
    }
  }
}
