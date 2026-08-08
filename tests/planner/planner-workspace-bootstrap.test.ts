import { describe, expect, it } from "vitest";
import {
  bootstrapPlannerWorkspace,
  createBrowserPlannerWorkspaceBootstrap,
} from "../../src/planner/planner-workspace-bootstrap";
import type { PlannerProjectState } from "../../src/planner/planner-workspace-bootstrap";
import { createPlannerResourceCoordinator } from "../../src/resources/planner-resource-coordinator";
import { createInitialEditorPreferences } from "../../src/editor/browser-editor-preferences";
import { createInitialMapRenderOptions } from "../../src/maps/map-render-options";
import type { PreparedDefaultMap } from "../../src/resources/planner-resource-coordinator";
import type { ReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import type { EditorPreferenceStore } from "../../src/editor/browser-editor-preferences";
import type { PlannerCanvasPreparedResources } from "../../src/components/planner-canvas";

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
  it("starts Pixi, map, project state, and preferences before awaiting any operation", async () => {
    const startedOperations: string[] = [];
    const pixi = createDeferred<typeof import("pixi.js")>();
    const map = createDeferred<PreparedDefaultMap>();
    const projectState = createDeferred<PlannerProjectState>();
    const preferences = createDeferred<ReturnType<typeof createInitialEditorPreferences>>();
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
    });

    expect(startedOperations).toEqual(["pixi", "map", "project", "preferences"]);
    pixi.resolve({} as typeof import("pixi.js"));
    map.resolve({ mapId: "standard", season: "spring", parsedMap: {} as PreparedDefaultMap["parsedMap"], renderingContract: {} as PreparedDefaultMap["renderingContract"] });
    projectState.resolve({ repository: testRepository, projects: [] });
    preferences.resolve(createInitialEditorPreferences());
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
      isGenerationCurrent: () => generationIsCurrent,
      onPreparedWorkspace: () => {
        generationIsCurrent = false;
      },
    })).resolves.toBeNull();
  });

  it("starts real browser-factory repository, preferences, Pixi, and map operations before awaiting", async () => {
    const startedOperations: string[] = [];
    const pixi = createDeferred<typeof import("pixi.js")>();
    const map = createDeferred<PreparedDefaultMap>();
    const projectRepository = {
      listProjects: () => {
        startedOperations.push("project");
        return [];
      },
    } as unknown as ReferenceProjectRepository;
    const preferenceStore = {
      load: () => {
        startedOperations.push("preferences");
        return createInitialEditorPreferences();
      },
    } as unknown as EditorPreferenceStore;
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
    });

    const bootstrapPromise = bootstrapBrowserWorkspace({
      resourceGeneration: 1,
      mapRequest: {
        mapId: "standard",
        season: "spring",
        mapRenderOptions: createInitialMapRenderOptions(),
      },
    });

    expect(startedOperations).toEqual(["pixi", "map", "project", "preferences"]);
    pixi.resolve({} as typeof import("pixi.js"));
    map.resolve({
      mapId: "standard",
      season: "spring",
      parsedMap: {} as PreparedDefaultMap["parsedMap"],
      renderingContract: {} as PreparedDefaultMap["renderingContract"],
    });
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
  });
});
