import { describe, expect, it } from "vitest";
import {
  createBrowserLocalProjectStore,
  createBrowserLocalProjectStoreV2,
  localProjectStorageKey,
  localProjectV2StorageKey,
  type LocalProjectStorageAdapter,
} from "../../src/projects/local-project-store";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

class MemoryProjectStorage implements LocalProjectStorageAdapter {
  private readonly valuesByKey = new Map<string, string>();

  getItem(storageKey: string): string | null {
    return this.valuesByKey.get(storageKey) ?? null;
  }

  setItem(storageKey: string, serializedValue: string): void {
    this.valuesByKey.set(storageKey, serializedValue);
  }

  removeItem(storageKey: string): void {
    this.valuesByKey.delete(storageKey);
  }

  read(storageKey: string): string | null {
    return this.getItem(storageKey);
  }
}

function createProjectIdSequence(...projectIds: readonly string[]): () => string {
  let projectIdIndex = 0;

  return () => {
    const generatedProjectId = projectIds[projectIdIndex];
    projectIdIndex += 1;

    if (generatedProjectId === undefined) {
      throw new Error(`No test project ID exists at index ${projectIdIndex - 1}.`);
    }

    return generatedProjectId;
  };
}

function createTimestampSequence(
  ...timestamps: readonly string[]
): () => string {
  let timestampIndex = 0;

  return () => {
    const generatedTimestamp = timestamps[timestampIndex];
    timestampIndex += 1;

    if (generatedTimestamp === undefined) {
      throw new Error(`No test timestamp exists at index ${timestampIndex - 1}.`);
    }

    return generatedTimestamp;
  };
}

function createMemoryProjectStore(
  projectIds: readonly string[],
  timestamps: readonly string[] = ["2026-07-26T00:00:00.000Z"],
) {
  const storage = new MemoryProjectStorage();
  const store = createBrowserLocalProjectStore({
    storage,
    createProjectId: createProjectIdSequence(...projectIds),
    now: createTimestampSequence(...timestamps),
  });

  return { storage, store };
}

function createMapInstanceIdSequence(
  ...mapInstanceIds: readonly string[]
): () => string {
  let mapInstanceIdIndex = 0;

  return () => {
    const generatedMapInstanceId = mapInstanceIds[mapInstanceIdIndex];
    mapInstanceIdIndex += 1;

    if (generatedMapInstanceId === undefined) {
      throw new Error(
        `No test map instance ID exists at index ${mapInstanceIdIndex - 1}.`,
      );
    }

    return generatedMapInstanceId;
  };
}

function createMemoryProjectStoreV2(input: Readonly<{
  projectIds: readonly string[];
  mapInstanceIds: readonly string[];
  timestamps?: readonly string[];
}>): Readonly<{
  storage: MemoryProjectStorage;
  store: ReturnType<typeof createBrowserLocalProjectStoreV2>;
}> {
  const storage = new MemoryProjectStorage();
  const timestamps =
    input.timestamps ??
    Array.from({ length: 20 }, () => "2026-07-27T00:00:00.000Z");
  const store = createBrowserLocalProjectStoreV2({
    storage,
    createProjectId: createProjectIdSequence(...input.projectIds),
    createMapInstanceId: createMapInstanceIdSequence(...input.mapInstanceIds),
    now: createTimestampSequence(...timestamps),
  });

  return { storage, store };
}

describe("browser local project store", () => {
  it("creates incrementing empty local projects with a standard-map state", () => {
    const { store } = createMemoryProjectStore(
      ["project-first", "project-second"],
      ["2026-07-26T00:00:00.000Z", "2026-07-26T00:00:00.000Z"],
    );

    const firstProject = store.createProject();
    const secondProject = store.createProject();

    expect(firstProject).toMatchObject({
      formatVersion: 1,
      id: "project-first",
      name: "Untitled Project",
      activeMapId: "standard",
      maps: { standard: {} },
    });
    expect(secondProject.name).toBe("Untitled Project 2");
    expect(store.listProjects()).toEqual([
      {
        id: "project-first",
        name: "Untitled Project",
        createdAt: "2026-07-26T00:00:00.000Z",
        updatedAt: "2026-07-26T00:00:00.000Z",
        activeMapId: "standard",
      },
      {
        id: "project-second",
        name: "Untitled Project 2",
        createdAt: "2026-07-26T00:00:00.000Z",
        updatedAt: "2026-07-26T00:00:00.000Z",
        activeMapId: "standard",
      },
    ]);
  });

  it("trims an explicit name and rejects blank or overlong names", () => {
    const { store } = createMemoryProjectStore([
      "project-named",
      "project-blank",
      "project-long",
    ]);

    expect(store.createProject({ name: "  River Farm  " }).name).toBe(
      "River Farm",
    );
    expect(() => store.createProject({ name: "   " })).toThrow('"   "');
    expect(() => store.createProject({ name: "x".repeat(81) })).toThrow(
      '"'.concat("x".repeat(81), '"'),
    );
    expect(() => store.createProject(null as unknown as never)).toThrow(
      "Create local project input must be a plain object; received null.",
    );
  });

  it("saves JSON-safe current map state without leaking a mutable reference", () => {
    const { store } = createMemoryProjectStore(
      ["project-save"],
      ["2026-07-26T00:00:00.000Z", "2026-07-26T01:00:00.000Z"],
    );
    const createdProject = store.createProject();
    const mutableMapState = { placements: [{ x: 4, y: 9, itemId: "barn" }] };

    const savedProject = store.saveCurrentMapState(
      createdProject.id,
      "forest",
      mutableMapState,
    );
    mutableMapState.placements[0]!.x = 999;

    expect(savedProject).toMatchObject({
      activeMapId: "forest",
      updatedAt: "2026-07-26T01:00:00.000Z",
      maps: {
        forest: { placements: [{ x: 4, y: 9, itemId: "barn" }] },
        standard: {},
      },
    });
    expect(store.openProject(createdProject.id).maps.forest).toEqual({
      placements: [{ x: 4, y: 9, itemId: "barn" }],
    });
    expect(() =>
      store.saveCurrentMapState(
        createdProject.id,
        "forest",
        { invalid: undefined } as unknown as never,
      ),
    ).toThrow("undefined");
  });

  it("renames, duplicates, and deletes projects without modifying the source", () => {
    const { store } = createMemoryProjectStore(
      ["project-source", "project-copy"],
      [
        "2026-07-26T00:00:00.000Z",
        "2026-07-26T01:00:00.000Z",
        "2026-07-26T02:00:00.000Z",
        "2026-07-26T03:00:00.000Z",
      ],
    );
    const sourceProject = store.createProject({ name: "Source" });
    store.saveCurrentMapState(sourceProject.id, "beach", { tileCount: 12 });

    const renamedProject = store.renameProject(sourceProject.id, "  Renamed  ");
    const duplicateProject = store.duplicateProject(renamedProject.id);

    expect(renamedProject.name).toBe("Renamed");
    expect(duplicateProject).toMatchObject({
      id: "project-copy",
      name: "Renamed Copy",
      activeMapId: "beach",
      maps: { beach: { tileCount: 12 }, standard: {} },
    });
    expect(duplicateProject.createdAt).toBe("2026-07-26T03:00:00.000Z");

    store.deleteProject(sourceProject.id);

    expect(store.listProjects().map((project) => project.id)).toEqual([
      "project-copy",
    ]);
    expect(() => store.openProject(sourceProject.id)).toThrow('"project-source"');
  });

  it("exports a versioned project and imports it under a newly generated local ID", () => {
    const { store } = createMemoryProjectStore(
      ["project-source", "project-imported"],
      ["2026-07-26T00:00:00.000Z", "2026-07-26T01:00:00.000Z"],
    );
    const sourceProject = store.createProject({ name: "Exported Farm" });
    store.saveCurrentMapState(sourceProject.id, "hilltop", { objects: ["silo"] });

    const serializedProject = store.exportProject(sourceProject.id);
    const importedProject = store.importProject(serializedProject);

    expect(JSON.parse(serializedProject)).toMatchObject({
      formatVersion: 1,
      id: "project-source",
      name: "Exported Farm",
    });
    expect(importedProject).toMatchObject({
      id: "project-imported",
      name: "Exported Farm",
      activeMapId: "hilltop",
      maps: { hilltop: { objects: ["silo"] }, standard: {} },
    });
    expect(store.openProject(sourceProject.id).id).toBe("project-source");
  });

  it("retries a colliding generated import ID instead of overwriting a project", () => {
    const { store } = createMemoryProjectStore(
      ["project-existing", "project-existing", "project-fresh"],
      [
        "2026-07-26T00:00:00.000Z",
        "2026-07-26T01:00:00.000Z",
        "2026-07-26T02:00:00.000Z",
      ],
    );
    const existingProject = store.createProject({ name: "Existing" });
    const serializedProject = JSON.stringify({
      formatVersion: 1,
      id: "project-from-file",
      name: "Imported",
      createdAt: "2026-07-20T00:00:00.000Z",
      updatedAt: "2026-07-20T00:00:00.000Z",
      activeMapId: "standard",
      maps: { standard: {} },
    });

    const importedProject = store.importProject(serializedProject);

    expect(importedProject.id).toBe("project-fresh");
    expect(store.openProject(existingProject.id).name).toBe("Existing");
  });

  it("rejects an imported active map ID that is not in the planner map catalog", () => {
    const { store } = createMemoryProjectStore(["project-imported"]);

    expect(() =>
      store.importProject(
        JSON.stringify({
          formatVersion: 1,
          id: "project-from-file",
          name: "Imported",
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T00:00:00.000Z",
          activeMapId: "not-in-map-catalog",
          maps: { "not-in-map-catalog": {} },
        }),
      ),
    ).toThrow("not-in-map-catalog");
  });

  it("rejects an imported map record key that is not in the planner map catalog", () => {
    const { store } = createMemoryProjectStore(["project-imported"]);

    expect(() =>
      store.importProject(
        JSON.stringify({
          formatVersion: 1,
          id: "project-from-file",
          name: "Imported",
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T00:00:00.000Z",
          activeMapId: "standard",
          maps: { standard: {}, "not-in-map-catalog": {} },
        }),
      ),
    ).toThrow("not-in-map-catalog");
  });

  it("rejects a rename when the injected timestamp would regress updatedAt", () => {
    const { store } = createMemoryProjectStore(
      ["project-rename"],
      ["2026-07-26T00:00:00.000Z", "2026-07-26T03:00:00.000Z", "2026-07-26T02:30:00.000Z"],
    );
    const createdProject = store.createProject();
    store.saveCurrentMapState(createdProject.id, "forest", { placed: true });

    expect(() => store.renameProject(createdProject.id, "Renamed")).toThrow(
      '"2026-07-26T02:30:00.000Z"',
    );
  });

  it("rejects a save when the injected timestamp would regress updatedAt", () => {
    const { store } = createMemoryProjectStore(
      ["project-save"],
      ["2026-07-26T00:00:00.000Z", "2026-07-26T03:00:00.000Z", "2026-07-26T02:30:00.000Z"],
    );
    const createdProject = store.createProject();
    store.saveCurrentMapState(createdProject.id, "forest", { placed: true });

    expect(() =>
      store.saveCurrentMapState(createdProject.id, "beach", { placed: true }),
    ).toThrow('"2026-07-26T02:30:00.000Z"');
  });

  it("rejects a duplicate when the injected timestamp is earlier than the source updatedAt", () => {
    const { store } = createMemoryProjectStore(
      ["project-source", "project-copy"],
      ["2026-07-26T03:00:00.000Z", "2026-07-26T02:30:00.000Z"],
    );
    const sourceProject = store.createProject({ name: "Source" });

    expect(() => store.duplicateProject(sourceProject.id)).toThrow(
      '"2026-07-26T02:30:00.000Z"',
    );
  });

  it("rejects malformed imported JSON, unsupported fields, and invalid storage output", () => {
    const { storage, store } = createMemoryProjectStore(["project-import"]);

    expect(() => store.importProject("not json")).toThrow("not json");
    expect(() =>
      store.importProject(
        JSON.stringify({
          formatVersion: 1,
          id: "project-from-file",
          name: "Imported",
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T00:00:00.000Z",
          activeMapId: "standard",
          maps: { standard: {} },
          account: "not allowed",
        }),
      ),
    ).toThrow('"account"');

    storage.setItem("stardew-planner.local-projects.v1", "[]");
    expect(() => store.listProjects()).toThrow("[]");

    const invalidStorageOutputStore = createBrowserLocalProjectStore({
      storage: {
        getItem: () => undefined as unknown as string,
        setItem: () => undefined,
        removeItem: () => undefined,
      },
      createProjectId: createProjectIdSequence("project-invalid-storage"),
      now: createTimestampSequence("2026-07-26T00:00:00.000Z"),
    });
    expect(() => invalidStorageOutputStore.listProjects()).toThrow("undefined");
  });

  it("fails clearly when browser localStorage is unavailable", () => {
    expect(() => createBrowserLocalProjectStore()).toThrow("localStorage");
  });
});

describe("browser local project store v2", () => {
  it("migrates every legacy project only after v2 storage writes successfully and preserves the v1 backup", () => {
    const legacyCollection = JSON.stringify({
      formatVersion: 1,
      projects: [
        {
          formatVersion: 1,
          id: "project-legacy",
          name: "Legacy Farm",
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T01:00:00.000Z",
          activeMapId: "forest",
          maps: {
            standard: { season: "spring", placements: ["silo"] },
            forest: { season: "winter", placements: ["barn"] },
          },
        },
      ],
    });
    const { storage, store } = createMemoryProjectStoreV2({
      projectIds: ["project-unused"],
      mapInstanceIds: ["map-unused"],
    });
    storage.setItem(localProjectStorageKey, legacyCollection);

    expect(store.openProject("project-legacy")).toMatchObject({
      formatVersion: 2,
      activeMapInstanceId: "map-forest",
      mapInstances: {
        "map-standard": {
          baseMapId: "standard",
          state: { season: "spring", placements: ["silo"] },
        },
        "map-forest": {
          baseMapId: "forest",
          state: { season: "winter", placements: ["barn"] },
        },
      },
    });
    expect(storage.read(localProjectStorageKey)).toBe(legacyCollection);
    expect(JSON.parse(storage.read(localProjectV2StorageKey) ?? "null")).toMatchObject({
      formatVersion: 2,
      projects: [{ id: "project-legacy", activeMapInstanceId: "map-forest" }],
    });
  });

  it("does not alter legacy storage when writing the migrated v2 collection fails", () => {
    const legacyCollection = JSON.stringify({
      formatVersion: 1,
      projects: [
        {
          formatVersion: 1,
          id: "project-legacy",
          name: "Legacy Farm",
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T00:00:00.000Z",
          activeMapId: "standard",
          maps: { standard: {} },
        },
      ],
    });
    const storedValues = new Map<string, string>([
      [localProjectStorageKey, legacyCollection],
    ]);
    const store = createBrowserLocalProjectStoreV2({
      storage: {
        getItem(storageKey) {
          return storedValues.get(storageKey) ?? null;
        },
        setItem(storageKey, serializedValue) {
          if (storageKey === localProjectV2StorageKey) {
            throw new Error(`Write rejected for ${storageKey}.`);
          }

          storedValues.set(storageKey, serializedValue);
        },
        removeItem(storageKey) {
          storedValues.delete(storageKey);
        },
      },
      createProjectId: createProjectIdSequence("project-unused"),
      createMapInstanceId: createMapInstanceIdSequence("map-unused"),
      now: createTimestampSequence("2026-07-27T00:00:00.000Z"),
    });

    expect(() => store.listProjects()).toThrow(localProjectV2StorageKey);
    expect(storedValues.get(localProjectStorageKey)).toBe(legacyCollection);
    expect(storedValues.has(localProjectV2StorageKey)).toBe(false);
  });

  it("does not restore a legacy backup after deleting the final v2 project", () => {
    const legacyCollection = JSON.stringify({
      formatVersion: 1,
      projects: [
        {
          formatVersion: 1,
          id: "project-legacy",
          name: "Legacy Farm",
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T00:00:00.000Z",
          activeMapId: "standard",
          maps: { standard: {} },
        },
      ],
    });
    const { storage, store } = createMemoryProjectStoreV2({
      projectIds: ["project-unused"],
      mapInstanceIds: ["map-unused"],
    });
    storage.setItem(localProjectStorageKey, legacyCollection);

    store.deleteProject("project-legacy");

    const reloadedStore = createBrowserLocalProjectStoreV2({
      storage,
      createProjectId: createProjectIdSequence("project-unused"),
      createMapInstanceId: createMapInstanceIdSequence("map-unused"),
      now: createTimestampSequence("2026-07-27T00:00:00.000Z"),
    });

    expect(reloadedStore.listProjects()).toEqual([]);
    expect(storage.read(localProjectStorageKey)).toBe(legacyCollection);
  });

  it("fails for corrupted v2 storage instead of falling back to a legacy backup", () => {
    const { storage, store } = createMemoryProjectStoreV2({
      projectIds: ["project-unused"],
      mapInstanceIds: ["map-unused"],
    });
    const legacyCollection = JSON.stringify({
      formatVersion: 1,
      projects: [
        {
          formatVersion: 1,
          id: "project-legacy",
          name: "Legacy Farm",
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T00:00:00.000Z",
          activeMapId: "standard",
          maps: { standard: {} },
        },
      ],
    });
    storage.setItem(localProjectStorageKey, legacyCollection);
    storage.setItem(localProjectV2StorageKey, "[]");

    expect(() => store.listProjects()).toThrow("[]");
    expect(storage.read(localProjectStorageKey)).toBe(legacyCollection);
  });

  it("isolates two instances of the same base map while saving, switching, renaming, duplicating, and deleting", () => {
    const { store } = createMemoryProjectStoreV2({
      projectIds: ["project-layouts"],
      mapInstanceIds: ["map-standard-a", "map-standard-b", "map-standard-copy"],
    });
    const createdProject = store.createProject();
    const secondInstanceProject = store.createMapInstance(createdProject.id, {
      baseMapId: "standard",
      name: "Second Standard",
    });

    const firstInstanceId = createdProject.activeMapInstanceId;
    const secondInstanceId = secondInstanceProject.activeMapInstanceId;
    store.saveMapInstanceState(createdProject.id, firstInstanceId, {
      placements: ["first-silo"],
    });
    store.saveMapInstanceState(createdProject.id, secondInstanceId, {
      placements: ["second-barn"],
    });
    const renamedProject = store.renameMapInstance(
      createdProject.id,
      secondInstanceId,
      "  Second Layout  ",
    );
    const duplicatedProject = store.duplicateMapInstance(
      createdProject.id,
      secondInstanceId,
    );
    const switchedProject = store.switchActiveMapInstance(
      createdProject.id,
      firstInstanceId,
    );
    const deletedProject = store.deleteMapInstance(
      createdProject.id,
      firstInstanceId,
    );

    expect(renamedProject.mapInstances[secondInstanceId]).toMatchObject({
      name: "Second Layout",
      baseMapId: "standard",
      state: { placements: ["second-barn"] },
    });
    expect(duplicatedProject.mapInstances["map-standard-copy"]).toMatchObject({
      baseMapId: "standard",
      name: "Second Layout Copy",
      state: { placements: ["second-barn"] },
    });
    expect(switchedProject.activeMapInstanceId).toBe(firstInstanceId);
    expect(deletedProject.activeMapInstanceId).toBe("map-standard-b");
    expect(deletedProject.mapInstances[firstInstanceId]).toBeUndefined();
    expect(deletedProject.mapInstances[secondInstanceId]?.state).toEqual({
      placements: ["second-barn"],
    });
    expect(store.openProject(createdProject.id)).toEqual(deletedProject);
  });

  it("copies and moves a map instance between distinct local projects without sharing mutable state", () => {
    const { store } = createMemoryProjectStoreV2({
      projectIds: ["project-source", "project-destination"],
      mapInstanceIds: [
        "map-source-primary",
        "map-source-secondary",
        "map-destination-primary",
        "map-destination-copy",
        "map-destination-move",
      ],
    });
    const sourceProject = store.createProject({ name: "Source" });
    const sourceWithSecondMap = store.createMapInstance(sourceProject.id, {
      baseMapId: "forest",
      name: "Forest Layout",
    });
    const destinationProject = store.createProject({ name: "Destination" });

    store.saveMapInstanceState(
      sourceProject.id,
      sourceProject.activeMapInstanceId,
      { placements: ["source-silo"] },
    );

    const copiedMapResult = store.copyMapInstance(
      sourceProject.id,
      sourceProject.activeMapInstanceId,
      destinationProject.id,
    );
    const movedMapResult = store.moveMapInstance(
      sourceProject.id,
      sourceProject.activeMapInstanceId,
      destinationProject.id,
    );

    expect(copiedMapResult.sourceProject.mapInstances).toHaveProperty(
      "map-source-primary",
    );
    expect(copiedMapResult.destinationProject.mapInstances["map-destination-copy"])
      .toMatchObject({
        baseMapId: "standard",
        name: "Standard Farm 2",
        state: { placements: ["source-silo"] },
      });
    expect(movedMapResult.sourceProject.mapInstances).not.toHaveProperty(
      "map-source-primary",
    );
    expect(movedMapResult.sourceProject.activeMapInstanceId).toBe(
      sourceWithSecondMap.activeMapInstanceId,
    );
    expect(movedMapResult.destinationProject.mapInstances["map-destination-move"])
      .toMatchObject({
        baseMapId: "standard",
        name: "Standard Farm 3",
        state: { placements: ["source-silo"] },
      });

    const persistedDestinationProject = store.openProject(destinationProject.id);
    expect(persistedDestinationProject.mapInstances["map-destination-copy"]?.state)
      .toEqual({ placements: ["source-silo"] });
    expect(persistedDestinationProject.mapInstances["map-destination-move"]?.state)
      .toEqual({ placements: ["source-silo"] });
  });

  it("rejects deleting the final map instance without writing a changed project", () => {
    const { store } = createMemoryProjectStoreV2({
      projectIds: ["project-single"],
      mapInstanceIds: ["map-single"],
    });
    const createdProject = store.createProject();

    expect(() =>
      store.deleteMapInstance(
        createdProject.id,
        createdProject.activeMapInstanceId,
      ),
    ).toThrow("must contain at least one");
    expect(store.openProject(createdProject.id)).toEqual(createdProject);
  });

  it("keeps project-level rename, duplication, and deletion available in v2 storage", () => {
    const { store } = createMemoryProjectStoreV2({
      projectIds: ["project-source", "project-copy"],
      mapInstanceIds: ["map-source"],
    });
    const sourceProject = store.createProject({ name: "Source" });
    const renamedProject = store.renameProject(sourceProject.id, "  Renamed  ");
    const duplicatedProject = store.duplicateProject(renamedProject.id);

    store.deleteProject(renamedProject.id);

    expect(duplicatedProject).toMatchObject({
      id: "project-copy",
      name: "Renamed Copy",
      activeMapInstanceId: sourceProject.activeMapInstanceId,
      mapInstances: sourceProject.mapInstances,
    });
    expect(store.listProjects().map((project) => project.id)).toEqual([
      "project-copy",
    ]);
  });

  it("retries a colliding generated map-instance ID instead of overwriting an existing instance", () => {
    const { store } = createMemoryProjectStoreV2({
      projectIds: ["project-collision"],
      mapInstanceIds: ["map-existing", "map-existing", "map-fresh"],
    });
    const createdProject = store.createProject();
    const projectWithSecondInstance = store.createMapInstance(createdProject.id, {
      baseMapId: "standard",
      name: "Second Standard",
    });

    expect(Object.keys(projectWithSecondInstance.mapInstances)).toEqual([
      "map-existing",
      "map-fresh",
    ]);
  });

  it("accepts a v1 import and exports only its migrated v2 representation", () => {
    const { store } = createMemoryProjectStoreV2({
      projectIds: ["project-imported"],
      mapInstanceIds: ["map-unused"],
    });
    const importedProject = store.importProject(
      JSON.stringify({
        formatVersion: 1,
        id: "project-from-file",
        name: "Imported Farm",
        createdAt: "2026-07-20T00:00:00.000Z",
        updatedAt: "2026-07-20T00:00:00.000Z",
        activeMapId: "standard",
        maps: { standard: { placements: ["silo"] } },
      }),
    );

    const exportedProject = JSON.parse(store.exportProject(importedProject.id));

    expect(importedProject).toMatchObject({
      formatVersion: 2,
      id: "project-imported",
      activeMapInstanceId: "map-standard",
      mapInstances: {
        "map-standard": {
          baseMapId: "standard",
          state: { placements: ["silo"] },
        },
      },
    });
    expect(exportedProject).toMatchObject({
      formatVersion: 2,
      id: "project-imported",
      activeMapInstanceId: "map-standard",
    });
    expect(exportedProject).not.toHaveProperty("maps");
  });

  it("preserves interior decor through v2 project export and JSON import", () => {
    const { store } = createMemoryProjectStoreV2({
      projectIds: ["project-source", "project-imported"],
      mapInstanceIds: ["map-farmhouse"],
    });
    const sourceProject = store.createProject({
      initialBaseMapId: "farmhouse-1",
    });
    const interiorDecorSnapshot = {
      ...createEmptyPlacementSnapshot(),
      interiorDecor: {
        wallpapers: { Bedroom: "17" },
        floors: { MainFloor: "MoreFloors:8" },
      },
    };

    store.saveMapInstanceState(
      sourceProject.id,
      sourceProject.activeMapInstanceId,
      {
        placementSnapshot: interiorDecorSnapshot,
        season: "summer",
      },
    );
    const importedProject = store.importProject(
      store.exportProject(sourceProject.id),
    );

    expect(
      importedProject.mapInstances[importedProject.activeMapInstanceId]?.state,
    ).toEqual({
      placementSnapshot: interiorDecorSnapshot,
      season: "summer",
    });
  });
});
