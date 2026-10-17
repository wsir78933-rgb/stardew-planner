export const localProjectFolderStorageKey =
  "stardew-planner.local-project-folders.v1";
export const myPlansFolderId = "my-plans";
export const maximumLocalProjectFolderNameLength = 40;

export type LocalProjectFolder = Readonly<{
  id: string;
  name: string;
}>;

export type LocalProjectFolderState = Readonly<{
  folders: readonly LocalProjectFolder[];
  folderIdByProjectId: Readonly<Record<string, string>>;
}>;

export type LocalProjectFolderStorage = Readonly<{
  getItem(storageKey: string): string | null;
  setItem(storageKey: string, serializedFolderState: string): void;
}>;

export type LocalProjectFolderStore = Readonly<{
  load(): LocalProjectFolderState;
  createFolder(requestedFolderName: string): LocalProjectFolderState;
  moveProject(projectId: string, targetFolderId: string): LocalProjectFolderState;
}>;

export type CreateLocalProjectFolderStoreOptions = Readonly<{
  storage?: LocalProjectFolderStorage;
  createFolderId?: () => string;
}>;

type StoredLocalProjectFolderState = Readonly<{
  formatVersion: 1;
  folders: readonly LocalProjectFolder[];
  folderIdByProjectId: Readonly<Record<string, string>>;
}>;

export function createLocalProjectFolderStore(
  options: CreateLocalProjectFolderStoreOptions = {},
): LocalProjectFolderStore {
  const storage = options.storage ?? getBrowserLocalProjectFolderStorage();
  const createFolderId = options.createFolderId ?? createCryptographicFolderId;

  assertLocalProjectFolderStorage(storage);

  return {
    load(): LocalProjectFolderState {
      return readLocalProjectFolderState(storage);
    },

    createFolder(requestedFolderName: string): LocalProjectFolderState {
      const folderName = validateLocalProjectFolderName(requestedFolderName);
      const currentFolderState = readLocalProjectFolderState(storage);

      if (
        currentFolderState.folders.some(
          (folder) => folder.name.toLocaleLowerCase() === folderName.toLocaleLowerCase(),
        )
        || folderName.toLocaleLowerCase() === "my plans"
      ) {
        throw new Error(
          `Cannot create local project folder because the name ${JSON.stringify(folderName)} already exists.`,
        );
      }

      const folderId = validateLocalProjectFolderId(createFolderId());
      if (
        folderId === myPlansFolderId
        || currentFolderState.folders.some((folder) => folder.id === folderId)
      ) {
        throw new Error(
          `Cannot create local project folder because the generated ID ${JSON.stringify(folderId)} already exists.`,
        );
      }

      return writeLocalProjectFolderState(storage, {
        folders: [...currentFolderState.folders, { id: folderId, name: folderName }],
        folderIdByProjectId: currentFolderState.folderIdByProjectId,
      });
    },

    moveProject(projectId: string, targetFolderId: string): LocalProjectFolderState {
      const validatedProjectId = validateProjectId(projectId);
      const validatedTargetFolderId = validateLocalProjectFolderId(targetFolderId);
      const currentFolderState = readLocalProjectFolderState(storage);
      const targetFolderExists =
        validatedTargetFolderId === myPlansFolderId
        || currentFolderState.folders.some(
          (folder) => folder.id === validatedTargetFolderId,
        );

      if (!targetFolderExists) {
        throw new Error(
          `Cannot move local project ${JSON.stringify(validatedProjectId)} because the target folder ID ${JSON.stringify(validatedTargetFolderId)} does not exist.`,
        );
      }

      const nextFolderIdByProjectId = {
        ...currentFolderState.folderIdByProjectId,
      };

      if (validatedTargetFolderId === myPlansFolderId) {
        delete nextFolderIdByProjectId[validatedProjectId];
      } else {
        nextFolderIdByProjectId[validatedProjectId] = validatedTargetFolderId;
      }

      return writeLocalProjectFolderState(storage, {
        folders: currentFolderState.folders,
        folderIdByProjectId: nextFolderIdByProjectId,
      });
    },
  };
}

export function getLocalProjectFolderId(
  folderState: LocalProjectFolderState,
  projectId: string,
): string {
  return folderState.folderIdByProjectId[validateProjectId(projectId)] ?? myPlansFolderId;
}

export function validateLocalProjectFolderName(
  requestedFolderName: unknown,
): string {
  if (typeof requestedFolderName !== "string") {
    throw new Error(
      `Local project folder name must be a string. Received: ${JSON.stringify(requestedFolderName)}.`,
    );
  }

  const folderName = requestedFolderName.trim();
  if (folderName.length === 0) {
    throw new Error(
      `Local project folder name must not be empty. Received: ${JSON.stringify(requestedFolderName)}.`,
    );
  }

  if (folderName.length > maximumLocalProjectFolderNameLength) {
    throw new Error(
      `Local project folder name must not exceed ${String(maximumLocalProjectFolderNameLength)} characters. Received: ${JSON.stringify(folderName)}.`,
    );
  }

  return folderName;
}

function readLocalProjectFolderState(
  storage: LocalProjectFolderStorage,
): LocalProjectFolderState {
  const serializedFolderState = storage.getItem(localProjectFolderStorageKey);
  if (serializedFolderState === null) {
    return { folders: [], folderIdByProjectId: {} };
  }

  let parsedFolderState: unknown;
  try {
    parsedFolderState = JSON.parse(serializedFolderState) as unknown;
  } catch (caughtError) {
    throw new Error(
      `Cannot read local project folders from storage key ${JSON.stringify(localProjectFolderStorageKey)} because its JSON is invalid: ${describeError(caughtError)}.`,
    );
  }

  return parseLocalProjectFolderState(parsedFolderState);
}

function parseLocalProjectFolderState(
  parsedFolderState: unknown,
): LocalProjectFolderState {
  if (!isRecord(parsedFolderState)) {
    throw new Error(
      `Local project folder storage must contain an object. Received: ${JSON.stringify(parsedFolderState)}.`,
    );
  }

  if (parsedFolderState.formatVersion !== 1) {
    throw new Error(
      `Local project folder storage formatVersion must be 1. Received: ${JSON.stringify(parsedFolderState.formatVersion)}.`,
    );
  }

  if (!Array.isArray(parsedFolderState.folders)) {
    throw new Error(
      `Local project folder storage folders must be an array. Received: ${JSON.stringify(parsedFolderState.folders)}.`,
    );
  }

  if (!isRecord(parsedFolderState.folderIdByProjectId)) {
    throw new Error(
      `Local project folder storage folderIdByProjectId must be an object. Received: ${JSON.stringify(parsedFolderState.folderIdByProjectId)}.`,
    );
  }

  const folders = parsedFolderState.folders.map(parseLocalProjectFolder);
  const folderIds = new Set<string>([myPlansFolderId]);
  const folderNames = new Set<string>(["my plans"]);

  for (const folder of folders) {
    if (folderIds.has(folder.id)) {
      throw new Error(
        `Local project folder IDs must be unique. Received duplicate ID ${JSON.stringify(folder.id)}.`,
      );
    }
    if (folderNames.has(folder.name.toLocaleLowerCase())) {
      throw new Error(
        `Local project folder names must be unique. Received duplicate name ${JSON.stringify(folder.name)}.`,
      );
    }
    folderIds.add(folder.id);
    folderNames.add(folder.name.toLocaleLowerCase());
  }

  const folderIdByProjectId: Record<string, string> = {};
  for (const [projectId, folderIdValue] of Object.entries(
    parsedFolderState.folderIdByProjectId,
  )) {
    const validatedProjectId = validateProjectId(projectId);
    const folderId = validateLocalProjectFolderId(folderIdValue);
    if (!folderIds.has(folderId)) {
      throw new Error(
        `Local project ${JSON.stringify(validatedProjectId)} references unknown folder ID ${JSON.stringify(folderId)}.`,
      );
    }
    folderIdByProjectId[validatedProjectId] = folderId;
  }

  return { folders, folderIdByProjectId };
}

function parseLocalProjectFolder(folderValue: unknown): LocalProjectFolder {
  if (!isRecord(folderValue)) {
    throw new Error(
      `Local project folder must be an object. Received: ${JSON.stringify(folderValue)}.`,
    );
  }

  return {
    id: validateLocalProjectFolderId(folderValue.id),
    name: validateLocalProjectFolderName(folderValue.name),
  };
}

function writeLocalProjectFolderState(
  storage: LocalProjectFolderStorage,
  folderState: LocalProjectFolderState,
): LocalProjectFolderState {
  const serializedFolderState = JSON.stringify({
    formatVersion: 1,
    folders: folderState.folders,
    folderIdByProjectId: folderState.folderIdByProjectId,
  } satisfies StoredLocalProjectFolderState);

  try {
    storage.setItem(localProjectFolderStorageKey, serializedFolderState);
  } catch (caughtError) {
    throw new Error(
      `Cannot save local project folders to storage key ${JSON.stringify(localProjectFolderStorageKey)}: ${describeError(caughtError)}.`,
    );
  }

  return parseLocalProjectFolderState(JSON.parse(serializedFolderState) as unknown);
}

function validateLocalProjectFolderId(folderId: unknown): string {
  if (typeof folderId !== "string" || folderId.trim().length === 0) {
    throw new Error(
      `Local project folder ID must be a non-empty string. Received: ${JSON.stringify(folderId)}.`,
    );
  }

  return folderId;
}

function validateProjectId(projectId: unknown): string {
  if (typeof projectId !== "string" || projectId.trim().length === 0) {
    throw new Error(
      `Local project ID must be a non-empty string. Received: ${JSON.stringify(projectId)}.`,
    );
  }

  return projectId;
}

function assertLocalProjectFolderStorage(
  storage: LocalProjectFolderStorage,
): void {
  if (
    typeof storage.getItem !== "function"
    || typeof storage.setItem !== "function"
  ) {
    throw new Error(
      "Local project folder storage must provide getItem and setItem functions.",
    );
  }
}

function getBrowserLocalProjectFolderStorage(): LocalProjectFolderStorage {
  if (typeof window === "undefined") {
    throw new Error(
      "Local project folder storage requires browser localStorage when no storage adapter is injected.",
    );
  }

  try {
    if (window.localStorage === undefined) {
      throw new Error("window.localStorage is undefined");
    }
    return window.localStorage;
  } catch (caughtError) {
    throw new Error(
      `Local project folder storage requires browser localStorage: ${describeError(caughtError)}.`,
    );
  }
}

function createCryptographicFolderId(): string {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new Error(
      "Cannot create a local project folder because crypto.randomUUID is unavailable.",
    );
  }

  return `folder-${crypto.randomUUID()}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describeError(caughtError: unknown): string {
  return caughtError instanceof Error ? caughtError.message : String(caughtError);
}
