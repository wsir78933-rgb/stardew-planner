export type BrowserDownloadAnchor = {
  download: string;
  href: string;
  style: { display: string };
  click(): void;
  remove(): void;
};

export type BrowserFileDownloadPlatform = Readonly<{
  appendDownloadAnchor(anchor: BrowserDownloadAnchor): void;
  createDownloadAnchor(): BrowserDownloadAnchor;
  createObjectUrl(blob: Blob): string;
  revokeObjectUrl(objectUrl: string): void;
  schedule(callback: () => void): void;
}>;

export type BrowserFileDownload = Readonly<{
  blob: Blob;
  filename: string;
}>;

const browserFileDownloadErrorCode = "BROWSER_FILE_DOWNLOAD";
const noBrowserFileDownloadFailure = Symbol("no browser file download failure");

export type BrowserFileDownloadError = Error &
  Readonly<{
    code: typeof browserFileDownloadErrorCode;
  }>;

export function createBrowserFileDownloadPlatform(): BrowserFileDownloadPlatform {
  return resolveBrowserFileDownloadPlatform();
}

export function isBrowserFileDownloadError(
  value: unknown,
): value is BrowserFileDownloadError {
  return (
    value instanceof Error &&
    "code" in value &&
    value.code === browserFileDownloadErrorCode
  );
}

export function downloadBrowserFile(
  file: BrowserFileDownload,
  platform?: BrowserFileDownloadPlatform,
): void {
  assertBrowserFileDownload(file);

  const downloadPlatform =
    platform ?? resolveBrowserFileDownloadPlatform(file.filename);
  const objectUrl = downloadPlatform.createObjectUrl(file.blob);
  let objectUrlOwnerFailure: unknown = noBrowserFileDownloadFailure;

  try {
    const anchor = downloadPlatform.createDownloadAnchor();
    let anchorOwnerFailure: unknown = noBrowserFileDownloadFailure;

    try {
      configureDownloadAnchor(anchor, file.filename, objectUrl);
      downloadPlatform.appendDownloadAnchor(anchor);
      anchor.click();
    } catch (caughtError) {
      anchorOwnerFailure = caughtError;
      throw caughtError;
    } finally {
      try {
        anchor.remove();
      } catch (anchorRemovalError) {
        throw preserveBrowserFileDownloadFailures(
          anchorOwnerFailure,
          anchorRemovalError,
          "Browser file download and anchor removal both failed.",
        );
      }
    }
  } catch (caughtError) {
    objectUrlOwnerFailure = caughtError;
    throw caughtError;
  } finally {
    try {
      downloadPlatform.schedule(() =>
        downloadPlatform.revokeObjectUrl(objectUrl),
      );
    } catch (revocationSchedulingError) {
      throw preserveBrowserFileDownloadFailures(
        objectUrlOwnerFailure,
        revocationSchedulingError,
        "Browser file download and object URL revocation scheduling both failed.",
      );
    }
  }
}

function assertBrowserFileDownload(
  file: BrowserFileDownload,
): asserts file is BrowserFileDownload {
  if (typeof file.filename !== "string" || file.filename.trim().length === 0) {
    throw createBrowserFileDownloadError(
      `Browser file download filename must contain non-whitespace characters; received ${describeValue(file.filename)}.`,
    );
  }

  if (typeof Blob === "undefined" || !(file.blob instanceof Blob)) {
    throw createBrowserFileDownloadError(
      `Browser file download requires a Blob; received ${describeValue(file.blob)} for ${describeValue(file.filename)}.`,
    );
  }
}

function resolveBrowserFileDownloadPlatform(
  filename?: string,
): BrowserFileDownloadPlatform {
  const requestedFileDescription = filename === undefined
    ? ""
    : ` for ${describeValue(filename)}`;

  if (typeof document === "undefined") {
    throw createBrowserFileDownloadError(
      `Browser file download platform requires document${requestedFileDescription}.`,
    );
  }

  if (typeof document.createElement !== "function") {
    throw createBrowserFileDownloadError(
      `Browser file download platform requires document.createElement${requestedFileDescription}.`,
    );
  }

  if (
    document.body === null ||
    typeof document.body.appendChild !== "function"
  ) {
    throw createBrowserFileDownloadError(
      `Browser file download platform requires document.body.appendChild${requestedFileDescription}.`,
    );
  }

  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    throw createBrowserFileDownloadError(
      `Browser file download platform requires URL.createObjectURL${requestedFileDescription}.`,
    );
  }

  if (typeof URL.revokeObjectURL !== "function") {
    throw createBrowserFileDownloadError(
      `Browser file download platform requires URL.revokeObjectURL${requestedFileDescription}.`,
    );
  }

  if (typeof window === "undefined" || typeof window.setTimeout !== "function") {
    throw createBrowserFileDownloadError(
      `Browser file download platform requires window.setTimeout${requestedFileDescription}.`,
    );
  }

  return {
    appendDownloadAnchor(anchor: BrowserDownloadAnchor): void {
      document.body.appendChild(anchor as unknown as Node);
    },
    createDownloadAnchor(): BrowserDownloadAnchor {
      return document.createElement("a") as unknown as BrowserDownloadAnchor;
    },
    createObjectUrl(blob: Blob): string {
      return URL.createObjectURL(blob);
    },
    revokeObjectUrl(objectUrl: string): void {
      URL.revokeObjectURL(objectUrl);
    },
    schedule(callback: () => void): void {
      window.setTimeout(callback, 0);
    },
  };
}

function configureDownloadAnchor(
  anchor: BrowserDownloadAnchor,
  filename: string,
  objectUrl: string,
): void {
  anchor.download = filename;
  anchor.href = objectUrl;
  anchor.style.display = "none";
}

function preserveBrowserFileDownloadFailures(
  ownerFailure: unknown,
  cleanupFailure: unknown,
  aggregateMessage: string,
): unknown {
  if (ownerFailure === noBrowserFileDownloadFailure) {
    return cleanupFailure;
  }

  return new AggregateError([ownerFailure, cleanupFailure], aggregateMessage);
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value);
}

function createBrowserFileDownloadError(
  message: string,
): BrowserFileDownloadError {
  return Object.assign(new Error(message), {
    code: browserFileDownloadErrorCode as typeof browserFileDownloadErrorCode,
  });
}
