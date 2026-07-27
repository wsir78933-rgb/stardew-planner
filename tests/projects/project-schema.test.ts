import { describe, expect, it } from "vitest";
import * as projectSchema from "../../src/projects/project-schema";

type ProjectSchemaV2Interface = Readonly<{
  parseExportedLocalProjectV2(serializedProject: unknown): unknown;
  validateLocalProjectV2(rawProject: unknown): unknown;
  migrateLocalProjectV1ToV2(rawProject: unknown): unknown;
  migrateStoredLocalProjectCollectionV1ToV2(rawCollection: unknown): unknown;
}>;

const schemaV2 = projectSchema as unknown as ProjectSchemaV2Interface;

describe("local project v2 schema", () => {
  it("validates a map instance whose identity exists only in its record key", () => {
    const validatedProject = schemaV2.validateLocalProjectV2({
      formatVersion: 2,
      id: "project-farm",
      name: "My Farm",
      createdAt: "2026-07-27T00:00:00.000Z",
      updatedAt: "2026-07-27T00:00:00.000Z",
      activeMapInstanceId: "map-standard-1",
      mapInstances: {
        "map-standard-1": {
          baseMapId: "standard",
          name: "Spring Layout",
          state: { season: "spring" },
        },
      },
    });

    expect(validatedProject).toEqual({
      formatVersion: 2,
      id: "project-farm",
      name: "My Farm",
      createdAt: "2026-07-27T00:00:00.000Z",
      updatedAt: "2026-07-27T00:00:00.000Z",
      activeMapInstanceId: "map-standard-1",
      mapInstances: {
        "map-standard-1": {
          baseMapId: "standard",
          name: "Spring Layout",
          state: { season: "spring" },
        },
      },
    });
  });

  it("parses an exported v2 project without accepting a v1 shape", () => {
    expect(
      schemaV2.parseExportedLocalProjectV2(
        JSON.stringify({
          formatVersion: 2,
          id: "project-farm",
          name: "My Farm",
          createdAt: "2026-07-27T00:00:00.000Z",
          updatedAt: "2026-07-27T00:00:00.000Z",
          activeMapInstanceId: "map-standard-1",
          mapInstances: {
            "map-standard-1": {
              baseMapId: "standard",
              name: "Spring Layout",
              state: {},
            },
          },
        }),
      ),
    ).toMatchObject({
      formatVersion: 2,
      activeMapInstanceId: "map-standard-1",
    });

    expect(() =>
      schemaV2.parseExportedLocalProjectV2(
        JSON.stringify({
          formatVersion: 1,
          id: "project-farm",
          name: "My Farm",
          createdAt: "2026-07-27T00:00:00.000Z",
          updatedAt: "2026-07-27T00:00:00.000Z",
          activeMapId: "standard",
          maps: { standard: {} },
        }),
      ),
    ).toThrow("activeMapId");
  });

  it("rejects a second instance identity embedded inside a map instance value", () => {
    expect(() =>
      schemaV2.validateLocalProjectV2({
        formatVersion: 2,
        id: "project-farm",
        name: "My Farm",
        createdAt: "2026-07-27T00:00:00.000Z",
        updatedAt: "2026-07-27T00:00:00.000Z",
        activeMapInstanceId: "map-standard-1",
        mapInstances: {
          "map-standard-1": {
            id: "map-standard-1",
            baseMapId: "standard",
            name: "Spring Layout",
            state: {},
          },
        },
      }),
    ).toThrow('"id"');
  });

  it("rejects a map instance whose base map is absent from the locked catalog", () => {
    expect(() =>
      schemaV2.validateLocalProjectV2({
        formatVersion: 2,
        id: "project-farm",
        name: "My Farm",
        createdAt: "2026-07-27T00:00:00.000Z",
        updatedAt: "2026-07-27T00:00:00.000Z",
        activeMapInstanceId: "map-unknown",
        mapInstances: {
          "map-unknown": {
            baseMapId: "unknown-map",
            name: "Unknown Layout",
            state: {},
          },
        },
      }),
    ).toThrow("unknown-map");
  });

  it.each([
    ["   "],
    [" Spring Layout "],
  ])("rejects an empty or uncanonical map instance name %j", (name) => {
    expect(() =>
      schemaV2.validateLocalProjectV2({
        formatVersion: 2,
        id: "project-farm",
        name: "My Farm",
        createdAt: "2026-07-27T00:00:00.000Z",
        updatedAt: "2026-07-27T00:00:00.000Z",
        activeMapInstanceId: "map-standard-1",
        mapInstances: {
          "map-standard-1": {
            baseMapId: "standard",
            name,
            state: {},
          },
        },
      }),
    ).toThrow(name);
  });

  it("rejects a project without any map instances", () => {
    expect(() =>
      schemaV2.validateLocalProjectV2({
        formatVersion: 2,
        id: "project-farm",
        name: "My Farm",
        createdAt: "2026-07-27T00:00:00.000Z",
        updatedAt: "2026-07-27T00:00:00.000Z",
        activeMapInstanceId: "map-standard-1",
        mapInstances: {},
      }),
    ).toThrow("must contain at least one map instance");
  });

  it("rejects an active map instance ID that is absent from the project", () => {
    expect(() =>
      schemaV2.validateLocalProjectV2({
        formatVersion: 2,
        id: "project-farm",
        name: "My Farm",
        createdAt: "2026-07-27T00:00:00.000Z",
        updatedAt: "2026-07-27T00:00:00.000Z",
        activeMapInstanceId: "map-missing",
        mapInstances: {
          "map-standard-1": {
            baseMapId: "standard",
            name: "Spring Layout",
            state: {},
          },
        },
      }),
    ).toThrow("map-missing");
  });

  it("migrates a single v1 base map into a named v2 map instance", () => {
    const migratedProject = schemaV2.migrateLocalProjectV1ToV2({
      formatVersion: 1,
      id: "project-farm",
      name: "My Farm",
      createdAt: "2026-07-27T00:00:00.000Z",
      updatedAt: "2026-07-27T00:00:00.000Z",
      activeMapId: "standard",
      maps: {
        standard: { season: "summer" },
      },
    });

    expect(migratedProject).toEqual({
      formatVersion: 2,
      id: "project-farm",
      name: "My Farm",
      createdAt: "2026-07-27T00:00:00.000Z",
      updatedAt: "2026-07-27T00:00:00.000Z",
      activeMapInstanceId: "map-standard",
      mapInstances: {
        "map-standard": {
          baseMapId: "standard",
          name: "Standard Farm",
          state: { season: "summer" },
        },
      },
    });
  });

  it("migrates every v1 base map and preserves its active map selection", () => {
    const migratedProject = schemaV2.migrateLocalProjectV1ToV2({
      formatVersion: 1,
      id: "project-farm",
      name: "My Farm",
      createdAt: "2026-07-27T00:00:00.000Z",
      updatedAt: "2026-07-27T00:10:00.000Z",
      activeMapId: "forest",
      maps: {
        standard: { season: "spring" },
        forest: { season: "winter" },
      },
    });

    expect(migratedProject).toEqual({
      formatVersion: 2,
      id: "project-farm",
      name: "My Farm",
      createdAt: "2026-07-27T00:00:00.000Z",
      updatedAt: "2026-07-27T00:10:00.000Z",
      activeMapInstanceId: "map-forest",
      mapInstances: {
        "map-standard": {
          baseMapId: "standard",
          name: "Standard Farm",
          state: { season: "spring" },
        },
        "map-forest": {
          baseMapId: "forest",
          name: "Forest Farm",
          state: { season: "winter" },
        },
      },
    });
  });

  it("migrates each project in a v1 collection without changing their project IDs", () => {
    expect(
      schemaV2.migrateStoredLocalProjectCollectionV1ToV2({
        formatVersion: 1,
        projects: [
          {
            formatVersion: 1,
            id: "project-first",
            name: "First Farm",
            createdAt: "2026-07-27T00:00:00.000Z",
            updatedAt: "2026-07-27T00:00:00.000Z",
            activeMapId: "standard",
            maps: { standard: {} },
          },
          {
            formatVersion: 1,
            id: "project-second",
            name: "Second Farm",
            createdAt: "2026-07-27T00:01:00.000Z",
            updatedAt: "2026-07-27T00:01:00.000Z",
            activeMapId: "forest",
            maps: { forest: {} },
          },
        ],
      }),
    ).toEqual({
      formatVersion: 2,
      projects: [
        expect.objectContaining({
          id: "project-first",
          activeMapInstanceId: "map-standard",
        }),
        expect.objectContaining({
          id: "project-second",
          activeMapInstanceId: "map-forest",
        }),
      ],
    });
  });
});
