import { describe, expect, it } from "vitest";
import { createInitialEditorViewState } from "../../src/editor/editor-view-state";
import {
  createProjectExportFile,
  createProjectMapState,
  createSavedLocalProject,
  getEditorViewStateForLocalProject,
  getMapRenderOptionsForLocalProjectMapInstance,
  getPlacementSnapshotForLocalProjectMapInstance,
  saveEditorMapToLocalProject,
} from "../../src/projects/local-project-editor-actions";
import type { LocalProjectStoreV2 } from "../../src/projects/local-project-store";
import type { LocalProjectV2 } from "../../src/projects/project-schema";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import { createInitialMapRenderOptions } from "../../src/maps/map-render-options";

const createdLocalProject: LocalProjectV2 = {
  formatVersion: 2,
  id: "project-new",
  name: "Untitled Project",
  createdAt: "2026-07-27T00:00:00.000Z",
  updatedAt: "2026-07-27T00:00:00.000Z",
  activeMapInstanceId: "map-standard-primary",
  mapInstances: {
    "map-standard-primary": {
      baseMapId: "standard",
      name: "Standard Farm",
      state: {},
    },
  },
};

describe("local project editor actions", () => {
  it("creates an initial v2 project and saves its active map instance state", () => {
    const recordedCalls: unknown[][] = [];
    const projectStore = createProjectStoreMock({
      createProject(input) {
        recordedCalls.push(["createProject", input]);
        return createdLocalProject;
      },
      saveMapInstanceState(projectId, mapInstanceId, currentMapState) {
        recordedCalls.push([
          "saveMapInstanceState",
          projectId,
          mapInstanceId,
          currentMapState,
        ]);
        return {
          ...createdLocalProject,
          mapInstances: {
            "map-standard-primary": {
              baseMapId: "standard",
              name: "Standard Farm",
              state: { season: "winter" },
            },
          },
        };
      },
    });

    const savedLocalProject = createSavedLocalProject(projectStore, {
      baseMapId: "standard",
      season: "winter",
    });

    expect(recordedCalls).toEqual([
      ["createProject", { initialBaseMapId: "standard" }],
      [
        "saveMapInstanceState",
        "project-new",
        "map-standard-primary",
        {
          season: "winter",
          placementSnapshot: createEmptyPlacementSnapshot(),
        },
      ],
    ]);
    expect(
      savedLocalProject.mapInstances["map-standard-primary"]?.state,
    ).toEqual({ season: "winter" });
  });

  it("saves editor state to the explicit instance instead of to its base map ID", () => {
    const recordedCalls: unknown[][] = [];
    const projectStore = createProjectStoreMock({
      saveMapInstanceState(projectId, mapInstanceId, currentMapState) {
        recordedCalls.push([projectId, mapInstanceId, currentMapState]);
        return createdLocalProject;
      },
    });

    saveEditorMapToLocalProject(
      projectStore,
      "project-open",
      "map-forest-layout",
      {
        baseMapId: "forest",
        season: "fall",
        placementSnapshot: createEmptyPlacementSnapshot(),
      },
    );

    expect(recordedCalls).toEqual([
      [
        "project-open",
        "map-forest-layout",
        {
          season: "fall",
          placementSnapshot: createEmptyPlacementSnapshot(),
        },
      ],
    ]);
    expect(createProjectMapState("summer")).toEqual({
      season: "summer",
      placementSnapshot: createEmptyPlacementSnapshot(),
    });
  });

  it("restores the active instance base map and season for the renderer", () => {
    const restoredEditorViewState = getEditorViewStateForLocalProject(
      createInitialEditorViewState(),
      {
        ...createdLocalProject,
        activeMapInstanceId: "map-forest-layout",
        mapInstances: {
          "map-forest-layout": {
            baseMapId: "forest",
            name: "Forest Winter",
            state: { season: "winter" },
          },
        },
      },
    );

    expect(restoredEditorViewState).toMatchObject({
      mapId: "forest",
      season: "winter",
      modalId: null,
    });
  });

  it("keeps placement and render state isolated for two instances of the same base map", () => {
    const firstPlacementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 3, y: 4 }],
      nextBuildingId: 2,
    };
    const secondRenderOptions = {
      ...createInitialMapRenderOptions(),
      gingerIslandOverlayIds: ["restored", "obelisk"] as const,
    };
    const projectWithTwoStandardInstances: LocalProjectV2 = {
      ...createdLocalProject,
      activeMapInstanceId: "map-standard-first",
      mapInstances: {
        "map-standard-first": {
          baseMapId: "standard",
          name: "First Standard",
          state: { season: "spring", placementSnapshot: firstPlacementSnapshot },
        },
        "map-standard-second": {
          baseMapId: "standard",
          name: "Second Standard",
          state: { season: "winter", mapRenderOptions: secondRenderOptions },
        },
      },
    };

    expect(
      getPlacementSnapshotForLocalProjectMapInstance(
        projectWithTwoStandardInstances,
        "map-standard-first",
      ),
    ).toEqual(firstPlacementSnapshot);
    expect(
      getPlacementSnapshotForLocalProjectMapInstance(
        projectWithTwoStandardInstances,
        "map-standard-second",
      ),
    ).toEqual(createEmptyPlacementSnapshot());
    expect(
      getMapRenderOptionsForLocalProjectMapInstance(
        projectWithTwoStandardInstances,
        "map-standard-first",
      ),
    ).toEqual(createInitialMapRenderOptions());
    expect(
      getMapRenderOptionsForLocalProjectMapInstance(
        projectWithTwoStandardInstances,
        "map-standard-second",
      ),
    ).toEqual(secondRenderOptions);
  });

  it("restores selected interior decor from an explicit v2 map instance", () => {
    const interiorDecorSnapshot = {
      ...createEmptyPlacementSnapshot(),
      interiorDecor: {
        wallpapers: { Bedroom: "17" },
        floors: { MainFloor: "MoreFloors:8" },
      },
    };
    const projectWithInteriorDecor: LocalProjectV2 = {
      ...createdLocalProject,
      activeMapInstanceId: "map-farmhouse-interior",
      mapInstances: {
        "map-farmhouse-interior": {
          baseMapId: "farmhouse-1",
          name: "Decorated Farmhouse",
          state: createProjectMapState("summer", interiorDecorSnapshot),
        },
      },
    };

    expect(
      getPlacementSnapshotForLocalProjectMapInstance(
        projectWithInteriorDecor,
        "map-farmhouse-interior",
      ).interiorDecor,
    ).toEqual(interiorDecorSnapshot.interiorDecor);
  });

  it("keeps interior decor isolated between two local map instances", () => {
    const projectWithTwoFarmhouseInstances: LocalProjectV2 = {
      ...createdLocalProject,
      activeMapInstanceId: "map-farmhouse-first",
      mapInstances: {
        "map-farmhouse-first": {
          baseMapId: "farmhouse-0",
          name: "Wallpaper Layout",
          state: createProjectMapState("spring", {
            ...createEmptyPlacementSnapshot(),
            interiorDecor: {
              wallpapers: { Bedroom: "17" },
              floors: {},
            },
          }),
        },
        "map-farmhouse-second": {
          baseMapId: "farmhouse-0",
          name: "Flooring Layout",
          state: createProjectMapState("winter", {
            ...createEmptyPlacementSnapshot(),
            interiorDecor: {
              wallpapers: {},
              floors: { Bedroom: "MoreFloors:8" },
            },
          }),
        },
      },
    };

    expect(
      getPlacementSnapshotForLocalProjectMapInstance(
        projectWithTwoFarmhouseInstances,
        "map-farmhouse-first",
      ).interiorDecor,
    ).toEqual({
      wallpapers: { Bedroom: "17" },
      floors: {},
    });
    expect(
      getPlacementSnapshotForLocalProjectMapInstance(
        projectWithTwoFarmhouseInstances,
        "map-farmhouse-second",
      ).interiorDecor,
    ).toEqual({
      wallpapers: {},
      floors: { Bedroom: "MoreFloors:8" },
    });
  });

  it("rejects an active instance with an invalid stored season", () => {
    expect(() =>
      getEditorViewStateForLocalProject(createInitialEditorViewState(), {
        ...createdLocalProject,
        mapInstances: {
          "map-standard-primary": {
            baseMapId: "standard",
            name: "Standard Farm",
            state: { season: "monsoon" },
          },
        },
      }),
    ).toThrow('"monsoon"');
  });

  it("creates a predictable JSON export download description", () => {
    expect(
      createProjectExportFile("Forest / Summer", '{"formatVersion":2}'),
    ).toEqual({
      filename: "Forest - Summer.json",
      mimeType: "application/json;charset=utf-8",
      serializedProject: '{"formatVersion":2}',
    });
  });
});

function createProjectStoreMock(
  overrides: Partial<LocalProjectStoreV2>,
): LocalProjectStoreV2 {
  const unsupportedAction = (): never => {
    throw new Error("Unexpected local project store action in test.");
  };

  return {
    listProjects: unsupportedAction,
    createProject: unsupportedAction,
    openProject: unsupportedAction,
    saveMapInstanceState: unsupportedAction,
    createMapInstance: unsupportedAction,
    duplicateMapInstance: unsupportedAction,
    copyMapInstance: unsupportedAction,
    moveMapInstance: unsupportedAction,
    renameMapInstance: unsupportedAction,
    deleteMapInstance: unsupportedAction,
    switchActiveMapInstance: unsupportedAction,
    renameProject: unsupportedAction,
    duplicateProject: unsupportedAction,
    deleteProject: unsupportedAction,
    exportProject: unsupportedAction,
    importProject: unsupportedAction,
    ...overrides,
  };
}
