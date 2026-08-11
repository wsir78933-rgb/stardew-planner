export type BrowserImageClipboardItemData = Readonly<{
  "image/png": Promise<Blob>;
}>;

export type BrowserImageClipboardPlatform = Readonly<{
  createClipboardItem(clipboardItemData: BrowserImageClipboardItemData): unknown;
  isPngSupported(): boolean;
  writeClipboardItem(clipboardItem: unknown): Promise<void>;
}>;

export class BrowserImageClipboardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BrowserImageClipboardError";
  }
}

export async function copyPngImageToClipboard(
  pngImage: Promise<Blob>,
  platform = createBrowserImageClipboardPlatform(),
): Promise<void> {
  if (!platform.isPngSupported()) {
    throw new BrowserImageClipboardError(
      "Browser image clipboard does not support image/png.",
    );
  }

  const clipboardItem = platform.createClipboardItem({
    "image/png": pngImage.then(assertPngImage),
  });
  await platform.writeClipboardItem(clipboardItem);
}

export function createBrowserImageClipboardPlatform(): BrowserImageClipboardPlatform {
  if (
    typeof navigator === "undefined" ||
    navigator.clipboard === undefined ||
    typeof navigator.clipboard.write !== "function"
  ) {
    throw new BrowserImageClipboardError(
      "Browser image clipboard requires navigator.clipboard.write.",
    );
  }

  if (typeof ClipboardItem === "undefined") {
    throw new BrowserImageClipboardError(
      "Browser image clipboard requires ClipboardItem.",
    );
  }

  const browserClipboardItem = ClipboardItem as typeof ClipboardItem & {
    supports?: (mimeType: string) => boolean;
  };

  return {
    createClipboardItem(clipboardItemData): ClipboardItem {
      return new ClipboardItem(clipboardItemData);
    },
    isPngSupported(): boolean {
      return browserClipboardItem.supports?.("image/png") ?? true;
    },
    writeClipboardItem(clipboardItem): Promise<void> {
      return navigator.clipboard.write([clipboardItem as ClipboardItem]);
    },
  };
}

function assertPngImage(pngImage: Blob): Blob {
  if (pngImage.type !== "image/png") {
    throw new BrowserImageClipboardError(
      `Browser image clipboard PNG must resolve to image/png; received ${describeMimeType(pngImage.type)}.`,
    );
  }

  return pngImage;
}

function describeMimeType(mimeType: string): string {
  return mimeType.length === 0 ? "an empty MIME type" : mimeType;
}
