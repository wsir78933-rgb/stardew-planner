const browserStorageFailurePrefix = "Browser storage failed.";

function assertBrowserStorageKey(storageKey: string): void {
  if (storageKey.trim().length === 0) {
    throw new Error(
      `Browser storage key must be a non-empty string. Received: ${JSON.stringify(storageKey)}.`,
    );
  }
}

function throwBrowserStorageFailure(storageKey: string, action: "read" | "write" | "remove", error: unknown): never {
  const received = error instanceof Error ? error.message : JSON.stringify(error);
  throw new Error(
    `${browserStorageFailurePrefix} Could not ${action} ${JSON.stringify(storageKey)}. Received: ${received}.`,
  );
}

export function isBrowserStorageFailure(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith(browserStorageFailurePrefix);
}

export function readBrowserToolStorage(storageKey: string): string | null {
  assertBrowserStorageKey(storageKey);

  if (typeof window === "undefined" || window.localStorage === undefined) {
    throw new Error(
      `${browserStorageFailurePrefix} localStorage is unavailable. Received: ${JSON.stringify(storageKey)}.`,
    );
  }

  try {
    return window.localStorage.getItem(storageKey);
  } catch (error) {
    throwBrowserStorageFailure(storageKey, "read", error);
  }
}

export function writeBrowserToolStorage(storageKey: string, storageText: string): void {
  assertBrowserStorageKey(storageKey);

  if (typeof window === "undefined" || window.localStorage === undefined) {
    throw new Error(
      `${browserStorageFailurePrefix} localStorage is unavailable. Received: ${JSON.stringify(storageKey)}.`,
    );
  }

  try {
    window.localStorage.setItem(storageKey, storageText);
  } catch (error) {
    throwBrowserStorageFailure(storageKey, "write", error);
  }
}

export function removeBrowserToolStorage(storageKey: string): void {
  assertBrowserStorageKey(storageKey);

  if (typeof window === "undefined" || window.localStorage === undefined) {
    throw new Error(
      `${browserStorageFailurePrefix} localStorage is unavailable. Received: ${JSON.stringify(storageKey)}.`,
    );
  }

  try {
    window.localStorage.removeItem(storageKey);
  } catch (error) {
    throwBrowserStorageFailure(storageKey, "remove", error);
  }
}
