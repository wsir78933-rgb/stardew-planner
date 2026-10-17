import { describe, expect, it } from "vitest";
import {
  createLocalProjectFolderStore,
  getLocalProjectFolderId,
  localProjectFolderStorageKey,
  myPlansFolderId,
  type LocalProjectFolderStorage,
} from "../../src/projects/local-project-folder-store";

function createMemoryFolderStorage(
  initialEntries: readonly (readonly [string, string])[] = [],
): LocalProjectFolderStorage {
  const storedValues = new Map<string, string>(initialEntries);

  return {
    getItem(storageKey) {
      return storedValues.get(storageKey) ?? null;
    },
    setItem(storageKey, serializedFolderState) {
      storedValues.set(storageKey, serializedFolderState);
    },
  };
}

describe("local project folder store", () => {
  it("persists created folders in browser storage and restores them", () => {
    const storage = createMemoryFolderStorage();
    const folderStore = createLocalProjectFolderStore({
      createFolderId: () => "folder-orchard",
      storage,
    });

    expect(folderStore.createFolder("  Orchard  ")).toEqual({
      folders: [{ id: "folder-orchard", name: "Orchard" }],
      folderIdByProjectId: {},
    });
    expect(storage.getItem(localProjectFolderStorageKey)).not.toBeNull();
    expect(createLocalProjectFolderStore({ storage }).load()).toEqual({
      folders: [{ id: "folder-orchard", name: "Orchard" }],
      folderIdByProjectId: {},
    });
  });

  it("moves projects between folders and back to My Plans", () => {
    const storage = createMemoryFolderStorage();
    const folderStore = createLocalProjectFolderStore({
      createFolderId: () => "folder-orchard",
      storage,
    });
    folderStore.createFolder("Orchard");

    const movedProjectState = folderStore.moveProject(
      "project-forest",
      "folder-orchard",
    );
    expect(getLocalProjectFolderId(movedProjectState, "project-forest")).toBe(
      "folder-orchard",
    );

    const returnedProjectState = folderStore.moveProject(
      "project-forest",
      myPlansFolderId,
    );
    expect(getLocalProjectFolderId(returnedProjectState, "project-forest")).toBe(
      myPlansFolderId,
    );
    expect(returnedProjectState.folderIdByProjectId).toEqual({});
  });

  it("rejects duplicate folder names and unknown target folders", () => {
    const folderStore = createLocalProjectFolderStore({
      createFolderId: () => "folder-orchard",
      storage: createMemoryFolderStorage(),
    });
    folderStore.createFolder("Orchard");

    expect(() => folderStore.createFolder(" orchard ")).toThrow(
      '"orchard" already exists',
    );
    expect(() =>
      folderStore.moveProject("project-forest", "folder-missing"),
    ).toThrow('"folder-missing" does not exist');
  });

  it("fails fast when stored folder JSON is malformed", () => {
    const folderStore = createLocalProjectFolderStore({
      storage: createMemoryFolderStorage([
        [localProjectFolderStorageKey, "{ invalid JSON"],
      ]),
    });

    expect(() => folderStore.load()).toThrow(/JSON is invalid/);
  });
});
