import { describe, expect, it } from "vitest";
import {
  bootstrapPlannerWorkspace,
  createBrowserPlannerWorkspaceBootstrap,
} from "../../src/planner/planner-workspace-bootstrap";
import type { PlannerProjectState } from "../../src/planner/planner-workspace-bootstrap";
import { createPlannerResourceCoordinator } from "../../src/resources/planner-resource-coordinator";
import {
  createBrowserEditorPreferenceStore,
  createInitialEditorPreferences,
} from "../../src/editor/browser-editor-preferences";
import { createInitialMapRenderOptions } from "../../src/maps/map-render-options";
import type { PreparedDefaultMap } from "../../src/resources/planner-resource-coordinator";
import type { ReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import type { EditorPreferenceStore } from "../../src/editor/browser-editor-preferences";
import type { PlannerCanvasPreparedResources } from "../../src/components/planner-canvas";
import type { Catalog } from "../../src/catalog";
import { createEditorPerformanceMarker } from "../../src/performance/editor-performance-marks";

const testRepository = {} as ReferenceProjectRepository;

function createPreparedMap(
  season: PreparedDefaultMap["season"],
): PreparedDefaultMap {
  return {
    mapId: "standard",
    season,
    parsedMap: {} as PreparedDefaultMap["parsedMap"],
    renderingContract: {} as PreparedDefaultMap["renderingContract"],
  };
}

function createDeferred<Value>() {
  let resolve: ((value: Value) => void) | undefined;
  const promise = new Promise<Value>((resolvePromise) => { resolve = resolvePromise; });
  return { promise, resolve: (value: Value) => resolve?.(value) };
}

describe("planner workspace bootstrap", () => {
  it("starts Pixi, map, project state, preferences, and Buildings before awaiting any operation", async () => {
    const startedOperations: string[] = [];
    const pixi = createDeferred<typeof import("pixi.js")>();
    const map = createDeferred<PreparedDefaultMap>();
    const projectState = createDeferred<PlannerProjectState>();
    const preferences = createDeferred<ReturnType<typeof createInitialEditorPreferences>>();
    const buildingsCatalog = createDeferred<Catalog>();
    const resourceCoordinator = createPlannerResourceCoordinator({
      importPixi: () => { startedOperations.push("pixi"); return pixi.promise; },
      loadDefaultMap: () => { startedOperations.push("map"); return map.promise; },
      readProjectState: () => { startedOperations.push("project"); return projectState.promise; },
    });
    const bootstrapPromise = bootstrapPlannerWorkspace({
      resourceGeneration: 7,
      mapRequest: { mapId: "standard", season: "spring", mapRenderOptions: createInitialMapRenderOptions() },
      resourceCoordinator,
      readPreferences: () => { startedOperations.push("preferences"); return preferences.promise; },
      loadInitialBuildingsCatalog: () => {
        startedOperations.push("buildings");
        return buildingsCatalog.promise;
      },
      savePreferences: () => undefined,
    });

    expect(startedOperations).toEqual(["pixi", "map", "project", "preferences", "buildings"]);
    pixi.resolve({} as typeof import("pixi.js"));
    map.resolve({ mapId: "standard", season: "spring", parsedMap: {} as PreparedDefaultMap["parsedMap"], renderingContract: {} as PreparedDefaultMap["renderingContract"] });
    projectState.resolve({ repository: testRepository, projects: [] });
    preferences.resolve(createInitialEditorPreferences());
    buildingsCatalog.resolve({ items: [] });
    await expect(bootstrapPromise).resolves.toMatchObject({ resourceGeneration: 7 });
  });

  it("does not commit a prepared workspace after its generation becomes stale", async () => {
    const deferredMap = createDeferred<PreparedDefaultMap>();
    let generationIsCurrent = true;
    const committedWorkspaces: unknown[] = [];
    const resourceCoordinator = createPlannerResourceCoordinator({
      importPixi: async () => ({} as typeof import("pixi.js")),
      loadDefaultMap: () => deferredMap.promise,
      readProjectState: async () => ({ repository: testRepository, projects: [] }),
    });
    const bootstrapPromise = bootstrapPlannerWorkspace({
      resourceGeneration: 3,
      isGenerationCurrent: () => generationIsCurrent,
      onPreparedWorkspace: (preparedWorkspace) => { committedWorkspaces.push(preparedWorkspace); },
      mapRequest: { mapId: "standard", season: "spring", mapRenderOptions: createInitialMapRenderOptions() },
      resourceCoordinator,
      readPreferences: async () => createInitialEditorPreferences(),
      loadInitialBuildingsCatalog: async () => ({ items: [] }),
      savePreferences: () => undefined,
    });
    generationIsCurrent = false;
    deferredMap.resolve({ mapId: "standard", season: "spring", parsedMap: {} as PreparedDefaultMap["parsedMap"], renderingContract: {} as PreparedDefaultMap["renderingContract"] });

    await expect(bootstrapPromise).resolves.toBeNull();
    expect(committedWorkspaces).toEqual([]);
  });

  it("does not return a workspace when its prepared callback stales the generation", async () => {
    let generationIsCurrent = true;
    const resourceCoordinator = createPlannerResourceCoordinator({
      importPixi: async () => ({} as typeof import("pixi.js")),
      loadDefaultMap: async () => createPreparedMap("spring"),
      readProjectState: async () => ({ repository: testRepository, projects: [] }),
    });

    await expect(bootstrapPlannerWorkspace({
      resourceGeneration: 4,
      mapRequest: {
        mapId: "standard",
        season: "spring",
        mapRenderOptions: createInitialMapRenderOptions(),
      },
      resourceCoordinator,
      readPreferences: async () => createInitialEditorPreferences(),
      loadInitialBuildingsCatalog: async () => ({ items: [] }),
      savePreferences: () => undefined,
      isGenerationCurrent: () => generationIsCurrent,
      onPreparedWorkspace: () => {
        generationIsCurrent = false;
      },
    })).resolves.toBeNull();
  });

  it("marks Buildings readiness before an unrelated bootstrap dependency resolves", async () => {
    const markedNames: string[] = [];
    const performanceMarker = createEditorPerformanceMarker({
      mark(markName) {
        markedNames.push(markName);
      },
    });
    performanceMarker.mark("editor:island-mounted");
    performanceMarker.mark("editor:workspace-module-ready");
    const deferredPreferences = createDeferred<ReturnType<typeof createInitialEditorPreferences>>();
    const deferredBuildingsCatalog = createDeferred<Catalog>();
    const resourceCoordinator = createPlannerResourceCoordinator({
      importPixi: async () => ({} as typeof import("pixi.js")),
      loadDefaultMap: async () => createPreparedMap("spring"),
      readProjectState: async () => ({ repository: testRepository, projects: [] }),
    });

    const bootstrapPromise = bootstrapPlannerWorkspace({
      resourceGeneration: 6,
      mapRequest: {
        mapId: "standard",
        season: "spring",
        mapRenderOptions: createInitialMapRenderOptions(),
      },
      resourceCoordinator,
      readPreferences: () => deferredPreferences.promise,
      loadInitialBuildingsCatalog: () => deferredBuildingsCatalog.promise,
      savePreferences: () => undefined,
      performanceMarker,
    });

    deferredBuildingsCatalog.resolve({ items: [] });
    await Promise.resolve();

    expect(markedNames).toEqual([
      "editor:island-mounted",
      "editor:workspace-module-ready",
      "editor:buildings-dataset-ready",
    ]);
    await expect(Promise.race([
      bootstrapPromise,
      Promise.resolve("preferences are still loading."),
    ])).resolves.toBe("preferences are still loading.");
    deferredPreferences.resolve(createInitialEditorPreferences());
    await expect(bootstrapPromise).resolves.toMatchObject({ resourceGeneration: 6 });
  });

  it("waits for the browser-factory Buildings catalog before preparing the workspace", async () => {
    const startedOperations: string[] = [];
    const pixi = createDeferred<typeof import("pixi.js")>();
    const map = createDeferred<PreparedDefaultMap>();
    const buildingsCatalog = createDeferred<Catalog>();
    const projectRepository = {
      listProjects: () => {
        startedOperations.push("project");
        return [];
      },
    } as unknown as ReferenceProjectRepository;
    let serializedPreferences: string | null = null;
    const persistentPreferenceStore = createBrowserEditorPreferenceStore({
      storage: {
        getItem: () => serializedPreferences,
        setItem: (_storageKey, nextSerializedPreferences) => {
          serializedPreferences = nextSerializedPreferences;
        },
      },
    });
    const preferenceStore: EditorPreferenceStore = {
      load: () => {
        startedOperations.push("preferences");
        return persistentPreferenceStore.load();
      },
      save: persistentPreferenceStore.save,
    };
    const bootstrapBrowserWorkspace = createBrowserPlannerWorkspaceBootstrap({
      createProjectRepository: () => projectRepository,
      createPreferenceStore: () => preferenceStore,
      importPixi: () => {
        startedOperations.push("pixi");
        return pixi.promise;
      },
      loadDefaultMap: (_mapRequest, progress) => {
        startedOperations.push("map");
        progress.onFetched();
        progress.onParsed();
        return map.promise;
      },
      loadInitialBuildingsCatalog: () => {
        startedOperations.push("buildings");
        return buildingsCatalog.promise;
      },
    });

    const bootstrapPromise = bootstrapBrowserWorkspace({
      resourceGeneration: 1,
      mapRequest: {
        mapId: "standard",
        season: "spring",
        mapRenderOptions: createInitialMapRenderOptions(),
      },
    });

    expect(startedOperations).toEqual(["pixi", "map", "project", "preferences", "buildings"]);
    pixi.resolve({} as typeof import("pixi.js"));
    map.resolve({
      mapId: "standard",
      season: "spring",
      parsedMap: {} as PreparedDefaultMap["parsedMap"],
      renderingContract: {} as PreparedDefaultMap["renderingContract"],
    });
    await expect(Promise.race([
      bootstrapPromise,
      Promise.resolve("Buildings catalog is still loading."),
    ])).resolves.toBe("Buildings catalog is still loading.");
    buildingsCatalog.resolve({ items: [] });
    const preparedWorkspace = await bootstrapPromise;
    expect(preparedWorkspace).toMatchObject({
      resourceGeneration: 1,
    });
    if (preparedWorkspace === null) {
      throw new Error("Expected browser bootstrap workspace to be prepared.");
    }
    const canvasResources: PlannerCanvasPreparedResources =
      preparedWorkspace.canvasResources;
    expect(canvasResources.resourceGeneration).toBe(1);
    preparedWorkspace.savePreferences({
      behaviorOptions: {
        ...createInitialEditorPreferences().behaviorOptions,
        leftHandMode: true,
      },
      displayOptions: {
        ...createInitialEditorPreferences().displayOptions,
        showGrid: true,
      },
    });
    expect(persistentPreferenceStore.load()).toEqual({
      behaviorOptions: {
        autoShowResourceClumps: true,
        freePlacement: false,
        gameCursors: true,
        leftHandMode: true,
        showJoystick: true,
        showToasts: true,
      },
      displayOptions: {
        showBeeHouseRadius: false,
        showBuildableTiles: false,
        showCropTiles: false,
        showGrid: true,
        showJunimoHutRadius: false,
        showNightMode: false,
        showNpcPaths: false,
        showScarecrowRadius: false,
        showSprinklerRadius: false,
        showTreeTiles: false,
      },
    });
  });

  it("rejects the browser bootstrap when its Buildings catalog loader fails", async () => {
    const bootstrapBrowserWorkspace = createBrowserPlannerWorkspaceBootstrap({
      createProjectRepository: () => ({
        listProjects: () => [],
      }) as unknown as ReferenceProjectRepository,
      createPreferenceStore: () => ({
        load: () => createInitialEditorPreferences(),
        save: () => undefined,
      }),
      importPixi: async () => ({} as typeof import("pixi.js")),
      loadDefaultMap: async () => createPreparedMap("spring"),
      loadInitialBuildingsCatalog: async () => {
        throw new Error("Buildings catalog unavailable.");
      },
    });

    await expect(bootstrapBrowserWorkspace({
      resourceGeneration: 1,
      mapRequest: {
        mapId: "standard",
        season: "spring",
        mapRenderOptions: createInitialMapRenderOptions(),
      },
    })).rejects.toThrow("Buildings catalog unavailable.");
  });
});
