import {
  createInitialEditorViewState,
  editorSeasons,
  selectEditorMap,
  selectEditorSeason,
  type EditorViewState,
} from "../editor/editor-view-state";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import {
  createEmptyPlacementSnapshot,
  createPersistentPlacementSnapshot,
  restorePlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import {
  createInitialMapRenderOptions,
  restoreMapRenderOptions,
  type MapRenderOptions,
} from "../maps/map-render-options";
import type { LocalProjectStoreV2 } from "./local-project-store";
import {
  assertKnownLocalMapId,
  assertLocalMapInstanceId,
  type JsonSafeValue,
  type LocalProjectMapInstanceV2,
  type LocalProjectV2,
} from "./project-schema";

export type EditorProjectMapState = Readonly<{
  baseMapId: string;
  season: TilesheetSeason;
  mapRenderOptions?: MapRenderOptions;
  placementSnapshot?: PlacementSnapshot;
}>;

export type LocalProjectExportFile = Readonly<{
  filename: string;
  mimeType: "application/json;charset=utf-8";
  serializedProject: string;
}>;

export function createProjectMapState(
  season: TilesheetSeason,
  placementSnapshot: PlacementSnapshot = createEmptyPlacementSnapshot(),
  mapRenderOptions?: MapRenderOptions,
): JsonSafeValue {
  assertTilesheetSeason(season);

  const projectMapState: Record<string, JsonSafeValue> = {
    season,
    placementSnapshot: createPersistentPlacementSnapshot(placementSnapshot),
  };

  if (mapRenderOptions !== undefined) {
    projectMapState.mapRenderOptions = restoreMapRenderOptions(mapRenderOptions);
  }

  return projectMapState;
}

export function createSavedLocalProject(
  projectStore: LocalProjectStoreV2,
  editorProjectMapState: EditorProjectMapState,
): LocalProjectV2 {
  assertEditorProjectMapState(editorProjectMapState);
  const createdProject = projectStore.createProject({
    initialBaseMapId: editorProjectMapState.baseMapId,
  });

  return saveEditorMapToLocalProject(
    projectStore,
    createdProject.id,
    createdProject.activeMapInstanceId,
    editorProjectMapState,
  );
}

export function saveEditorMapToLocalProject(
  projectStore: LocalProjectStoreV2,
  projectId: string,
  mapInstanceId: string,
  editorProjectMapState: EditorProjectMapState,
): LocalProjectV2 {
  assertEditorProjectMapState(editorProjectMapState);
  assertLocalMapInstanceId(mapInstanceId);

  return projectStore.saveMapInstanceState(
    projectId,
    mapInstanceId,
    createProjectMapState(
      editorProjectMapState.season,
      editorProjectMapState.placementSnapshot,
      editorProjectMapState.mapRenderOptions,
    ),
  );
}

export function getEditorViewStateForLocalProject(
  editorViewState: EditorViewState,
  localProject: LocalProjectV2,
): EditorViewState {
  const activeMapInstance = getLocalProjectMapInstance(
    localProject,
    localProject.activeMapInstanceId,
  );

  return selectEditorSeason(
    selectEditorMap(editorViewState, activeMapInstance.baseMapId),
    getProjectMapSeason(activeMapInstance.state),
  );
}

export function getPlacementSnapshotForLocalProjectMapInstance(
  localProject: LocalProjectV2,
  mapInstanceId: string,
): PlacementSnapshot {
  const mapInstance = getLocalProjectMapInstance(localProject, mapInstanceId);

  if (
    !isJsonSafeRecord(mapInstance.state) ||
    !Object.hasOwn(mapInstance.state, "placementSnapshot")
  ) {
    return createEmptyPlacementSnapshot();
  }

  return restorePlacementSnapshot(mapInstance.state.placementSnapshot);
}

export function getMapRenderOptionsForLocalProjectMapInstance(
  localProject: LocalProjectV2,
  mapInstanceId: string,
): MapRenderOptions {
  const mapInstance = getLocalProjectMapInstance(localProject, mapInstanceId);

  if (
    !isJsonSafeRecord(mapInstance.state) ||
    !Object.hasOwn(mapInstance.state, "mapRenderOptions")
  ) {
    return createInitialMapRenderOptions();
  }

  return restoreMapRenderOptions(mapInstance.state.mapRenderOptions);
}

export function createProjectExportFile(
  projectName: string,
  serializedProject: string,
): LocalProjectExportFile {
  if (typeof projectName !== "string" || projectName.trim().length === 0) {
    throw new Error(
      `Local project export requires a non-empty project name; received ${describeValue(projectName)}.`,
    );
  }

  if (typeof serializedProject !== "string") {
    throw new Error(
      `Local project export requires a serialized JSON string; received ${describeValue(serializedProject)}.`,
    );
  }

  const filenameStem = projectName
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  if (filenameStem.length === 0) {
    throw new Error(
      `Local project export filename is empty after sanitizing project name ${describeValue(projectName)}.`,
    );
  }

  return {
    filename: `${filenameStem}.json`,
    mimeType: "application/json;charset=utf-8",
    serializedProject,
  };
}

function getProjectMapSeason(
  projectMapState: JsonSafeValue,
): TilesheetSeason {
  if (
    !isJsonSafeRecord(projectMapState) ||
    !Object.hasOwn(projectMapState, "season")
  ) {
    return createInitialEditorViewState().season;
  }

  const storedSeason = projectMapState.season;
  assertTilesheetSeason(storedSeason);

  return storedSeason;
}

function isJsonSafeRecord(
  value: JsonSafeValue,
): value is Readonly<Record<string, JsonSafeValue>> {
  return value !== null && !Array.isArray(value) && typeof value === "object";
}

function assertEditorProjectMapState(
  editorProjectMapState: EditorProjectMapState,
): void {
  if (
    typeof editorProjectMapState !== "object" ||
    editorProjectMapState === null
  ) {
    throw new Error(
      `Editor project map state must be an object with baseMapId and season; received ${describeValue(editorProjectMapState)}.`,
    );
  }

  if (
    typeof editorProjectMapState.baseMapId !== "string" ||
    editorProjectMapState.baseMapId.length === 0
  ) {
    throw new Error(
      `Editor project map state baseMapId must be a non-empty string; received ${describeValue(editorProjectMapState.baseMapId)}.`,
    );
  }

  assertKnownLocalMapId(editorProjectMapState.baseMapId);

  assertTilesheetSeason(editorProjectMapState.season);

  if (editorProjectMapState.placementSnapshot !== undefined) {
    createPersistentPlacementSnapshot(editorProjectMapState.placementSnapshot);
  }

  if (editorProjectMapState.mapRenderOptions !== undefined) {
    restoreMapRenderOptions(editorProjectMapState.mapRenderOptions);
  }
}

function getLocalProjectMapInstance(
  localProject: LocalProjectV2,
  mapInstanceId: string,
): LocalProjectMapInstanceV2 {
  assertLocalMapInstanceId(mapInstanceId);
  const mapInstance = localProject.mapInstances[mapInstanceId];

  if (mapInstance === undefined) {
    throw new Error(
      `Local project ${JSON.stringify(localProject.id)} has no map instance ID ${JSON.stringify(mapInstanceId)}.`,
    );
  }

  return mapInstance;
}

function assertTilesheetSeason(value: unknown): asserts value is TilesheetSeason {
  if (!editorSeasons.includes(value as TilesheetSeason)) {
    throw new Error(
      `Local project season must be one of ${editorSeasons.join(", ")}; received ${describeValue(value)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}
