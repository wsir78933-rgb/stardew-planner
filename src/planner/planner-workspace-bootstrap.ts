import {
  createBrowserEditorPreferenceStore,
  type EditorPreferenceStore,
  type EditorPreferences,
} from "../editor/browser-editor-preferences";
import { loadCatalogCategory, type Catalog } from "../catalog";
import type { PlannerCanvasPreparedResources } from "../components/planner-canvas";
import type { MapRenderOptions } from "../maps/map-render-options";
import type { EditorPerformanceMarker } from "../performance/editor-performance-marks";
import {
  createReferenceProjectRepository,
  type ReferenceProjectRepository,
} from "../reference-runtime/reference-project-repository";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { PreparedDefaultMap } from "../resources/default-map-resource";
import type {
  PlannerProjectState,
  PlannerDefaultMapLoader,
  PlannerResourceCoordinator,
} from "../resources/planner-resource-coordinator";
import { createPlannerResourceCoordinator } from "../resources/planner-resource-coordinator";

export type { PlannerProjectState } from "../resources/planner-resource-coordinator";
export type PlannerWorkspaceBootstrapInput = Readonly<{
  resourceGeneration: number;
  mapRequest: Readonly<{ mapId: string; season: TilesheetSeason; mapRenderOptions: MapRenderOptions }>;
  resourceCoordinator: PlannerResourceCoordinator;
  readPreferences: () => Promise<EditorPreferences>;
  loadInitialBuildingsCatalog: () => Promise<Catalog>;
  savePreferences: (editorPreferences: EditorPreferences) => void;
  performanceMarker?: EditorPerformanceMarker;
  isGenerationCurrent?: () => boolean;
  onPreparedWorkspace?: (preparedWorkspace: PreparedPlannerWorkspace) => void;
}>;
export type PreparedPlannerWorkspace = Readonly<{
  resourceGeneration: number;
  canvasResources: PlannerCanvasPreparedResources;
  projectState: PlannerProjectState;
  preferences: EditorPreferences;
  savePreferences: (editorPreferences: EditorPreferences) => void;
}>;

export type BrowserPlannerWorkspaceBootstrapOptions = Readonly<{
  performanceMarker?: EditorPerformanceMarker;
  importPixi?: () => Promise<typeof import("pixi.js")>;
  loadDefaultMap?: PlannerDefaultMapLoader;
  loadInitialBuildingsCatalog?: () => Promise<Catalog>;
  createProjectRepository?: () => ReferenceProjectRepository;
  createPreferenceStore?: () => EditorPreferenceStore;
}>;

export type BrowserPlannerWorkspaceBootstrapInput = Readonly<{
  resourceGeneration: number;
  mapRequest: PlannerWorkspaceBootstrapInput["mapRequest"];
  isGenerationCurrent?: () => boolean;
  onPreparedWorkspace?: (preparedWorkspace: PreparedPlannerWorkspace) => void;
}>;

export function createBrowserPlannerWorkspaceBootstrap(
  options: BrowserPlannerWorkspaceBootstrapOptions = {},
): (input: BrowserPlannerWorkspaceBootstrapInput) => Promise<PreparedPlannerWorkspace | null> {
  const projectRepository = (options.createProjectRepository ??
    createReferenceProjectRepository)();
  const preferenceStore = (options.createPreferenceStore ??
    createBrowserEditorPreferenceStore)();
  const resourceCoordinator = createPlannerResourceCoordinator({
    importPixi: options.importPixi ?? (() => import("pixi.js")),
    loadDefaultMap: options.loadDefaultMap,
    readProjectState: async () => ({
      repository: projectRepository,
      projects: projectRepository.listProjects(),
    }),
    performanceMarker: options.performanceMarker,
  });

  return (input) =>
    bootstrapPlannerWorkspace({
      ...input,
      resourceCoordinator,
      readPreferences: async () => preferenceStore.load(),
      loadInitialBuildingsCatalog: options.loadInitialBuildingsCatalog ??
        (() => loadCatalogCategory("buildings")),
      savePreferences: preferenceStore.save,
      performanceMarker: options.performanceMarker,
    });
}

export async function bootstrapPlannerWorkspace(
  input: PlannerWorkspaceBootstrapInput,
): Promise<PreparedPlannerWorkspace | null> {
  validateBootstrapInput(input);
  const pixiPromise = input.resourceCoordinator.importPixi();
  const mapPromise = input.resourceCoordinator.loadDefaultMap(input.mapRequest);
  const projectStatePromise = input.resourceCoordinator.readProjectState();
  const preferencesPromise = input.readPreferences();
  const buildingsCatalogPromise = input.loadInitialBuildingsCatalog().then(
    (buildingsCatalog) => {
      input.performanceMarker?.mark("editor:buildings-dataset-ready");
      return buildingsCatalog;
    },
  );
  const [pixi, preparedMap, projectState, preferences, buildingsCatalog] = await Promise.all([
    pixiPromise,
    mapPromise,
    projectStatePromise,
    preferencesPromise,
    buildingsCatalogPromise,
  ]);
  void buildingsCatalog;
  const preparedWorkspace: PreparedPlannerWorkspace = {
    resourceGeneration: input.resourceGeneration,
    canvasResources: {
      pixi,
      preparedMap,
      resourceGeneration: input.resourceGeneration,
    },
    projectState,
    preferences,
    savePreferences: input.savePreferences,
  };
  const isGenerationCurrent = input.isGenerationCurrent ?? (() => true);
  if (!isGenerationCurrent()) return null;
  input.onPreparedWorkspace?.(preparedWorkspace);
  if (!isGenerationCurrent()) return null;
  return preparedWorkspace;
}

function validateBootstrapInput(input: PlannerWorkspaceBootstrapInput): void {
  if (!Number.isInteger(input.resourceGeneration) || input.resourceGeneration < 0) {
    throw new TypeError(
      `Planner workspace resourceGeneration must be a non-negative integer; received ${JSON.stringify(input.resourceGeneration)}.`,
    );
  }
  for (const [name, operation] of Object.entries({
    readPreferences: input.readPreferences,
    loadInitialBuildingsCatalog: input.loadInitialBuildingsCatalog,
    savePreferences: input.savePreferences,
  })) {
    if (typeof operation !== "function") {
      throw new TypeError(
        `Planner workspace ${name} must be a function; received ${JSON.stringify(operation)}.`,
      );
    }
  }
  if (typeof input.resourceCoordinator !== "object" || input.resourceCoordinator === null) {
    throw new TypeError(
      `Planner workspace resourceCoordinator must be an object; received ${JSON.stringify(input.resourceCoordinator)}.`,
    );
  }
}
