import type { MapRenderOptions } from "../maps/map-render-options";
import type { EditorPerformanceMarker } from "../performance/editor-performance-marks";
import type {
  ReferenceProjectRepository,
  ReferenceProjectSummary,
} from "../reference-runtime/reference-project-repository";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import {
  getDefaultMapRequestCacheKey,
  loadPreparedDefaultMap,
  type DefaultMapRequest,
  type PreparedDefaultMap,
} from "./default-map-resource";

export type { PreparedDefaultMap } from "./default-map-resource";

export type PlannerResourceCoordinatorOptions = Readonly<{
  importPixi: () => Promise<typeof import("pixi.js")>;
  readProjectState: () => Promise<PlannerProjectState>;
  loadDefaultMap?: PlannerDefaultMapLoader;
  performanceMarker?: EditorPerformanceMarker;
}>;

export type DefaultMapLoadProgress = Readonly<{
  onFetched(): void;
  onParsed(): void;
}>;

export type PlannerDefaultMapLoader = (
  request: DefaultMapRequest,
  progress: DefaultMapLoadProgress,
) => Promise<PreparedDefaultMap>;

export type PlannerMapResourceRequest = Readonly<{
  mapId: string;
  season: TilesheetSeason;
  mapRenderOptions: MapRenderOptions;
}>;

export type PlannerProjectState = Readonly<{
  repository: ReferenceProjectRepository;
  projects: readonly ReferenceProjectSummary[];
}>;

export type PlannerResourceCoordinator = Readonly<{
  importPixi(): Promise<typeof import("pixi.js")>;
  readProjectState(): Promise<PlannerProjectState>;
  loadDefaultMap(request: PlannerMapResourceRequest): Promise<PreparedDefaultMap>;
}>;

export function createPlannerResourceCoordinator(options: PlannerResourceCoordinatorOptions): PlannerResourceCoordinator {
  if (typeof options.importPixi !== "function") {
    throw new TypeError(`Planner resource coordinator importPixi must be a function; received ${describeValue(options.importPixi)}.`);
  }
  if (typeof options.readProjectState !== "function") {
    throw new TypeError(
      `Planner resource coordinator readProjectState must be a function; received ${describeValue(options.readProjectState)}.`,
    );
  }
  const loadDefaultMap = options.loadDefaultMap ?? ((request: DefaultMapRequest, progress: DefaultMapLoadProgress) =>
    loadPreparedDefaultMap(request, {
      onMapFetched: progress.onFetched,
      onMapParsed: progress.onParsed,
    }));
  if (typeof loadDefaultMap !== "function") {
    throw new TypeError(`Planner resource coordinator loadDefaultMap must be a function; received ${describeValue(loadDefaultMap)}.`);
  }
  let pixiPromise: Promise<typeof import("pixi.js")> | null = null;
  const mapPromisesByRequestKey = new Map<string, Promise<PreparedDefaultMap>>();

  function importPixi(): Promise<typeof import("pixi.js")> {
    if (pixiPromise === null) {
      pixiPromise = options.importPixi()
        .then((pixi) => {
          options.performanceMarker?.mark("editor:pixi-module-ready");
          return pixi;
        })
        .catch((caughtError: unknown) => {
          pixiPromise = null;
          throw caughtError;
        });
    }
    return pixiPromise;
  }

  function loadMap(request: PlannerMapResourceRequest): Promise<PreparedDefaultMap> {
    const requestKey = getDefaultMapRequestCacheKey(request);
    const existingPromise = mapPromisesByRequestKey.get(requestKey);
    if (existingPromise !== undefined) return existingPromise;
    const mapPromise = loadDefaultMap(request, {
      onFetched: () =>
        options.performanceMarker?.mark("editor:default-map-fetched"),
      onParsed: () =>
        options.performanceMarker?.mark("editor:default-map-parsed"),
    })
      .catch((caughtError: unknown) => {
        mapPromisesByRequestKey.delete(requestKey);
        throw caughtError;
      });
    mapPromisesByRequestKey.set(requestKey, mapPromise);
    return mapPromise;
  }

  function readProjectState(): Promise<PlannerProjectState> {
    return options.readProjectState().then((projectState) => {
      options.performanceMarker?.mark("editor:project-state-ready");
      return projectState;
    });
  }

  return { importPixi, readProjectState, loadDefaultMap: loadMap };
}

function describeValue(value: unknown): string {
  try { return JSON.stringify(value) ?? String(value); } catch { return Object.prototype.toString.call(value); }
}
