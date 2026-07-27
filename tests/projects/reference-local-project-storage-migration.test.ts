import { describe, expect, it } from "vitest";
import {
  localProjectV2StorageKey,
  type LocalProjectStorageAdapter,
} from "../../src/projects/local-project-store";
import {
  referenceLocalProjectStorageKey,
  ReferenceProjectMigrationError,
} from "../../src/projects/reference-local-project-migration";
import {
  migrateReferenceProjectsIfNeeded,
} from "../../src/projects/reference-local-project-storage-migration";

const validFrozenCollection = JSON.stringify({
  version: 1,
  projects: [{
    id: "farm-001",
    title: "Spring Farm",
    created_at: "2026-07-27T00:00:00.000Z",
    updated_at: "2026-07-27T00:00:00.000Z",
    project: {
      version: 4,
      gameVersion: "1.6.15",
      projectName: "Spring Farm",
      season: "spring",
      activeMapId: "12",
      maps: [{
        id: "12",
        mapFile: "Farm.tmx",
        label: "Standard Layout",
        season: "spring",
        state: {
          buildings: [],
          crops: [],
          items: [],
          nextBuildingId: 1,
          nextItemId: 1,
        },
        decor: { wallpapers: {}, floors: {} },
        renovations: [],
        thumbnail: "/api/projects/farm-001/maps/12/thumbnail",
      }],
    },
    thumbnailsByMapId: {},
  }],
});

class RecordingProjectStorage implements LocalProjectStorageAdapter {
  private readonly valuesByKey = new Map<string, string>();
  readonly readKeys: string[] = [];
  readonly writtenKeys: string[] = [];
  readonly removedKeys: string[] = [];
  writeError: Error | undefined;

  getItem(storageKey: string): string | null {
    this.readKeys.push(storageKey);
    return this.valuesByKey.get(storageKey) ?? null;
  }

  setItem(storageKey: string, serializedValue: string): void {
    this.writtenKeys.push(storageKey);
    if (this.writeError !== undefined) {
      throw this.writeError;
    }
    this.valuesByKey.set(storageKey, serializedValue);
  }

  removeItem(storageKey: string): void {
    this.removedKeys.push(storageKey);
    this.valuesByKey.delete(storageKey);
  }

  seed(storageKey: string, serializedValue: string): void {
    this.valuesByKey.set(storageKey, serializedValue);
  }

  read(storageKey: string): string | null {
    return this.valuesByKey.get(storageKey) ?? null;
  }
}

function createSourceWithInvalidSecondProject(): string {
  const collection = JSON.parse(validFrozenCollection) as {
    projects: Record<string, unknown>[];
  };
  const invalidSecondProject = structuredClone(collection.projects[0]!);
  invalidSecondProject.id = "farm-002";
  ((invalidSecondProject.project as Record<string, unknown>).maps as Record<string, unknown>[])[0]!.mapFile = "Unknown.tmx";
  collection.projects.push(invalidSecondProject);
  return JSON.stringify(collection);
}

describe("reference local project storage migration", () => {
  it("returns existing-v2 after validating the stored V2 collection without reading or changing the frozen source", () => {
    const storage = new RecordingProjectStorage();
    storage.seed(localProjectV2StorageKey, JSON.stringify({ formatVersion: 2, projects: [] }));
    storage.seed(referenceLocalProjectStorageKey, validFrozenCollection);

    expect(migrateReferenceProjectsIfNeeded(storage)).toEqual({ status: "existing-v2" });
    expect(storage.read(referenceLocalProjectStorageKey)).toBe(validFrozenCollection);
    expect(storage.readKeys).toEqual([localProjectV2StorageKey]);
    expect(storage.writtenKeys).toEqual([]);
    expect(storage.removedKeys).toEqual([]);
  });

  it("rejects malformed existing V2 storage before reading the frozen source", () => {
    const storage = new RecordingProjectStorage();
    storage.seed(localProjectV2StorageKey, "[]");
    storage.seed(referenceLocalProjectStorageKey, validFrozenCollection);

    expect(() => migrateReferenceProjectsIfNeeded(storage)).toThrow("[]");
    expect(storage.readKeys).toEqual([localProjectV2StorageKey]);
    expect(storage.read(referenceLocalProjectStorageKey)).toBe(validFrozenCollection);
    expect(storage.writtenKeys).toEqual([]);
    expect(storage.removedKeys).toEqual([]);
  });

  it("returns no-source without writing when neither V2 nor the frozen source exists", () => {
    const storage = new RecordingProjectStorage();

    expect(migrateReferenceProjectsIfNeeded(storage)).toEqual({ status: "no-source" });
    expect(storage.readKeys).toEqual([
      localProjectV2StorageKey,
      referenceLocalProjectStorageKey,
    ]);
    expect(storage.writtenKeys).toEqual([]);
    expect(storage.removedKeys).toEqual([]);
  });

  it("writes one V2 collection only after the complete frozen source converts", () => {
    const storage = new RecordingProjectStorage();
    storage.seed(referenceLocalProjectStorageKey, validFrozenCollection);

    expect(migrateReferenceProjectsIfNeeded(storage)).toEqual({ status: "migrated" });
    expect(storage.read(referenceLocalProjectStorageKey)).toBe(validFrozenCollection);
    expect(storage.writtenKeys).toEqual([localProjectV2StorageKey]);
    expect(storage.removedKeys).toEqual([]);
    expect(JSON.parse(storage.read(localProjectV2StorageKey) ?? "null")).toMatchObject({
      formatVersion: 2,
      projects: [{ id: "farm-001", activeMapInstanceId: "12" }],
    });
  });

  it("does not write a partial V2 collection when the second frozen project is invalid", () => {
    const storage = new RecordingProjectStorage();
    const originalFrozenJson = createSourceWithInvalidSecondProject();
    storage.seed(referenceLocalProjectStorageKey, originalFrozenJson);

    expect(() => migrateReferenceProjectsIfNeeded(storage)).toThrow("projects[1]");
    expect(storage.read(localProjectV2StorageKey)).toBeNull();
    expect(storage.read(referenceLocalProjectStorageKey)).toBe(originalFrozenJson);
    expect(storage.writtenKeys).toEqual([]);
    expect(storage.removedKeys).toEqual([]);
  });

  it("leaves V1 intact and V2 absent when target decor validation rejects conversion", () => {
    const storage = new RecordingProjectStorage();
    const invalidDecorSource = JSON.parse(validFrozenCollection) as {
      projects: Record<string, unknown>[];
    };
    const sourceMap = ((invalidDecorSource.projects[0]!.project as Record<string, unknown>)
      .maps as Record<string, unknown>[])[0]!;
    sourceMap.decor = { wallpapers: { Bedroom: "MoreWalls:26" }, floors: {} };
    const originalFrozenJson = JSON.stringify(invalidDecorSource);
    storage.seed(referenceLocalProjectStorageKey, originalFrozenJson);

    expect(() => migrateReferenceProjectsIfNeeded(storage))
      .toThrow(ReferenceProjectMigrationError);
    expect(() => migrateReferenceProjectsIfNeeded(storage))
      .toThrow("projects[0].maps[0].decor");
    expect(storage.read(localProjectV2StorageKey)).toBeNull();
    expect(storage.read(referenceLocalProjectStorageKey)).toBe(originalFrozenJson);
    expect(storage.writtenKeys).toEqual([]);
    expect(storage.removedKeys).toEqual([]);
  });

  it("leaves storage unchanged when the frozen source JSON is malformed", () => {
    const storage = new RecordingProjectStorage();
    const originalFrozenJson = "{";
    storage.seed(referenceLocalProjectStorageKey, originalFrozenJson);

    expect(() => migrateReferenceProjectsIfNeeded(storage)).toThrow(
      referenceLocalProjectStorageKey,
    );
    expect(storage.read(localProjectV2StorageKey)).toBeNull();
    expect(storage.read(referenceLocalProjectStorageKey)).toBe(originalFrozenJson);
    expect(storage.writtenKeys).toEqual([]);
    expect(storage.removedKeys).toEqual([]);
  });

  it("rethrows a V2 write failure without changing the frozen source", () => {
    const storage = new RecordingProjectStorage();
    const writeError = new Error("V2 write rejected");
    storage.seed(referenceLocalProjectStorageKey, validFrozenCollection);
    storage.writeError = writeError;

    expect(() => migrateReferenceProjectsIfNeeded(storage)).toThrow(writeError);
    expect(storage.read(localProjectV2StorageKey)).toBeNull();
    expect(storage.read(referenceLocalProjectStorageKey)).toBe(validFrozenCollection);
    expect(storage.writtenKeys).toEqual([localProjectV2StorageKey]);
    expect(storage.removedKeys).toEqual([]);
  });

  it("is idempotent after a restart because the written V2 collection wins", () => {
    const storage = new RecordingProjectStorage();
    storage.seed(referenceLocalProjectStorageKey, validFrozenCollection);

    expect(migrateReferenceProjectsIfNeeded(storage)).toEqual({ status: "migrated" });
    expect(migrateReferenceProjectsIfNeeded(storage)).toEqual({ status: "existing-v2" });
    expect(storage.read(referenceLocalProjectStorageKey)).toBe(validFrozenCollection);
    expect(storage.writtenKeys).toEqual([localProjectV2StorageKey]);
    expect(storage.removedKeys).toEqual([]);
  });
});
