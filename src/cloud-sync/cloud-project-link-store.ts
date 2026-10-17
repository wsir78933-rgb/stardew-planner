export type CloudProjectLink = Readonly<{
  localProjectId: string;
  cloudProjectId: string;
  revision: number;
  lastSyncedSnapshot: string;
}>;

export class CloudProjectLinkStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudProjectLinkStoreError";
  }
}

export function readCloudProjectLinks(
  userId: string,
): readonly CloudProjectLink[] {
  const storageKey = createStorageKey(userId);
  const localStorageArea = requireLocalStorage();
  let serializedLinks: string | null;
  try {
    serializedLinks = localStorageArea.getItem(storageKey);
  } catch (error) {
    throwStorageError(`read cloud project links for user ${JSON.stringify(userId)}`, error);
  }

  if (serializedLinks === null) {
    return [];
  }

  let rawLinks: unknown;
  try {
    rawLinks = JSON.parse(serializedLinks) as unknown;
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    throw new CloudProjectLinkStoreError(
      `Stored cloud project links for user ${JSON.stringify(userId)} contain invalid JSON: ${error.message}. Received ${String(serializedLinks.length)} characters.`,
    );
  }

  return parseCloudProjectLinks(rawLinks);
}

export function writeCloudProjectLinks(
  userId: string,
  cloudProjectLinks: readonly CloudProjectLink[],
): void {
  const storageKey = createStorageKey(userId);
  const validatedLinks = parseCloudProjectLinks(cloudProjectLinks);
  const serializedLinks = JSON.stringify(validatedLinks);
  if (typeof serializedLinks !== "string") {
    throw new CloudProjectLinkStoreError(
      `Cloud project links for user ${JSON.stringify(userId)} could not be serialized.`,
    );
  }

  const localStorageArea = requireLocalStorage();
  try {
    localStorageArea.setItem(storageKey, serializedLinks);
  } catch (error) {
    throwStorageError(`write cloud project links for user ${JSON.stringify(userId)}`, error);
  }
}

function parseCloudProjectLinks(
  rawLinks: unknown,
): readonly CloudProjectLink[] {
  if (!Array.isArray(rawLinks)) {
    throw new CloudProjectLinkStoreError(
      `Stored cloud project links must be an array. Received: ${describeValue(rawLinks)}.`,
    );
  }

  const localProjectIds = new Set<string>();
  const cloudProjectIds = new Set<string>();
  return rawLinks.map((rawLink, index) => {
    if (
      typeof rawLink !== "object" ||
      rawLink === null ||
      Array.isArray(rawLink)
    ) {
      throw new CloudProjectLinkStoreError(
        `Stored cloud project link at index ${String(index)} must be an object. Received: ${describeValue(rawLink)}.`,
      );
    }

    const linkRecord = rawLink as Record<string, unknown>;
    const localProjectId = requireIdentifier(
      linkRecord.localProjectId,
      `Stored cloud project link at index ${String(index)} localProjectId`,
    );
    const cloudProjectId = requireIdentifier(
      linkRecord.cloudProjectId,
      `Stored cloud project link at index ${String(index)} cloudProjectId`,
    );
    const revision = requireRevision(
      linkRecord.revision,
      `Stored cloud project link for local project ${JSON.stringify(localProjectId)} revision`,
    );
    const lastSyncedSnapshot = requireSnapshotFingerprint(
      linkRecord.lastSyncedSnapshot,
      localProjectId,
    );

    if (localProjectIds.has(localProjectId)) {
      throw new CloudProjectLinkStoreError(
        `Stored cloud project links contain duplicate local project ID ${JSON.stringify(localProjectId)}.`,
      );
    }
    if (cloudProjectIds.has(cloudProjectId)) {
      throw new CloudProjectLinkStoreError(
        `Stored cloud project links contain duplicate cloud project ID ${JSON.stringify(cloudProjectId)}.`,
      );
    }
    localProjectIds.add(localProjectId);
    cloudProjectIds.add(cloudProjectId);

    return { localProjectId, cloudProjectId, revision, lastSyncedSnapshot };
  });
}

function createStorageKey(userId: string): string {
  const validatedUserId = requireIdentifier(userId, "Cloud link storage user ID");
  return `stardew-planner:cloud-project-links:v1:${encodeURIComponent(validatedUserId)}`;
}

function requireLocalStorage(): Storage {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new CloudProjectLinkStoreError(
      "Cloud project link storage is unavailable because this operation requires browser localStorage.",
    );
  }
  return window.localStorage;
}

function requireIdentifier(rawValue: unknown, valueName: string): string {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    throw new CloudProjectLinkStoreError(
      `${valueName} must be a non-empty string. Received: ${describeValue(rawValue)}.`,
    );
  }
  return rawValue;
}

function requireRevision(rawValue: unknown, valueName: string): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isSafeInteger(rawValue) ||
    rawValue < 1
  ) {
    throw new CloudProjectLinkStoreError(
      `${valueName} must be a positive safe integer. Received: ${describeValue(rawValue)}.`,
    );
  }
  return rawValue;
}

function requireSnapshotFingerprint(
  rawValue: unknown,
  localProjectId: string,
): string {
  if (typeof rawValue !== "string" || !/^sha256:[a-f0-9]{64}$/.test(rawValue)) {
    throw new CloudProjectLinkStoreError(
      `Stored cloud project snapshot fingerprint for local project ${JSON.stringify(localProjectId)} must use sha256 plus 64 lowercase hexadecimal characters. Received: ${describeValue(rawValue)}.`,
    );
  }
  return rawValue;
}

function throwStorageError(action: string, error: unknown): never {
  if (error instanceof Error) {
    throw new CloudProjectLinkStoreError(
      `Could not ${action}: ${error.name}: ${error.message}.`,
    );
  }
  throw error;
}

function describeValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }
  if (rawValue === undefined) {
    return "undefined";
  }
  const serializedValue = JSON.stringify(rawValue);
  return serializedValue ?? String(rawValue);
}
