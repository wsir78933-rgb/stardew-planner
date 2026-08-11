import {
  closeEditorModal,
  collapseEditorMenuForModalOpen,
  createInitialEditorViewState,
  getNextEditorSeason,
  openEditorModal,
  selectCatalogCategory,
  selectEditorMap,
  selectEditorSeason,
  selectEditorTool,
  selectPanelPosition,
  toggleEditorMenuVisibility,
  type EditorCatalogCategory,
  type EditorMenuVisibility,
  type EditorModalId,
  type EditorPanelPosition,
  type EditorTool,
  type EditorViewState,
} from "../editor/editor-view-state";
import {
  createInitialEditorBehaviorOptions,
  editorBehaviorOptionKeys,
  setEditorBehaviorOption,
  type EditorBehaviorOptionKey,
  type EditorBehaviorOptions,
} from "../editor/editor-behavior-options";
import {
  createInitialEditorDisplayOptions,
  editorDisplayOptionKeys,
  toggleEditorDisplayOption,
  type EditorDisplayOptionKey,
  type EditorDisplayOptions,
} from "../editor/editor-display-options";
import type { EditorPreferences } from "../editor/browser-editor-preferences";
import {
  createInitialMapRenderOptions,
  restoreMapRenderOptions,
  type MapRenderOptions,
} from "../maps/map-render-options";
import {
  clonePlacementHistory,
  createPlacementHistory,
  redoPlacementHistory,
  type PlacementHistory,
  undoPlacementHistory,
} from "../placement/placement-history";
import {
  createPersistentPlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import { createInitialMapPlacementSnapshot } from "../maps/map-initial-composition";
import type { PlacementSelectionKey } from "../editor/editor-selection-controller";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

export type PlannerWorkspaceRuntimeState =
  | Readonly<{ resourceGeneration: number; status: "loading" }>
  | Readonly<{ resourceGeneration: number; status: "ready" }>
  | Readonly<{ resourceGeneration: number; status: "interactive" }>
  | Readonly<{ message: string; resourceGeneration: number; status: "error" }>;

export type PlannerWorkspaceState = Readonly<{
  activeMapId: string | null;
  activeProjectId: string | null;
  behaviorOptions: EditorBehaviorOptions;
  catalogCategory: EditorCatalogCategory;
  displayOptions: EditorDisplayOptions;
  editorMenuVisibility: EditorMenuVisibility;
  mapRenderOptions: MapRenderOptions;
  modalId: EditorModalId | null;
  panelPosition: EditorPanelPosition;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  runtimeState: PlannerWorkspaceRuntimeState;
  season: TilesheetSeason;
  selectedCatalogItemId: string | null;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
  selectedPlannerMapId: string;
  tool: EditorTool | null;
}>;

export type PlannerWorkspaceAction =
  | Readonly<{ resourceGeneration: number; type: "start-runtime-loading" }>
  | Readonly<{ resourceGeneration: number; type: "complete-runtime-ready" }>
  | Readonly<{
      resourceGeneration: number;
      type: "complete-runtime-interactive";
    }>
  | Readonly<{
      message: string;
      resourceGeneration: number;
      type: "complete-runtime-error";
    }>
  | Readonly<{
      activeMapId: string;
      activeProjectId: string;
      placementSnapshot: PlacementSnapshot;
      plannerMapId: string;
      season: TilesheetSeason;
      type: "open-canonical-map";
    }>
  | Readonly<{
      activeMapId: string;
      activeProjectId: string;
      placementSnapshot: PlacementSnapshot;
      plannerMapId: string;
      season: TilesheetSeason;
      type: "synchronize-smart-save-canonical-map";
    }>
  | Readonly<{
      placementSnapshot: PlacementSnapshot;
      plannerMapId: string;
      season: TilesheetSeason;
      type: "open-unsaved-imported-map";
    }>
  | Readonly<{
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKeys: readonly PlacementSelectionKey[];
      type: "apply-placement-edit-result";
    }>
  | Readonly<{
      preferences: EditorPreferences;
      type: "restore-prepared-preferences";
    }>
  | Readonly<{
      catalogItemId: string | null;
      type: "set-selected-catalog-item";
    }>
  | Readonly<{
      selectedPlacementKeys: readonly PlacementSelectionKey[];
      type: "set-selected-placement-keys";
    }>
  | Readonly<{ type: "close-modal" }>
  | Readonly<{ type: "cycle-season" }>
  | Readonly<{ type: "open-modal"; modalId: EditorModalId }>
  | Readonly<{
      placementSnapshot: PlacementSnapshot;
      type: "reset-placement-history";
    }>
  | Readonly<{
      type: "select-catalog-category";
      catalogCategory: EditorCatalogCategory;
    }>
  | Readonly<{ type: "select-map"; plannerMapId: string }>
  | Readonly<{ type: "select-season"; season: TilesheetSeason }>
  | Readonly<{ type: "select-tool"; tool: EditorTool | null }>
  | Readonly<{ type: "select-panel-position"; panelPosition: EditorPanelPosition }>
  | Readonly<{
      type: "set-behavior-option";
      option: EditorBehaviorOptionKey;
      value: boolean;
    }>
  | Readonly<{ type: "set-map-render-options"; mapRenderOptions: MapRenderOptions }>
  | Readonly<{ type: "toggle-display-option"; option: EditorDisplayOptionKey }>
  | Readonly<{ type: "toggle-menu" }>
  | Readonly<{ type: "undo-placement-history" }>
  | Readonly<{ type: "redo-placement-history" }>;

export const initialPlannerWorkspaceState: PlannerWorkspaceState =
  createInitialPlannerWorkspaceState();

export function createInitialPlannerWorkspaceState(
  initialPlannerMapId = "standard",
  viewportWidth?: number,
): PlannerWorkspaceState {
  const initialEditorViewState = selectEditorMap(
    createInitialEditorViewState(viewportWidth),
    initialPlannerMapId,
  );

  return {
    activeMapId: null,
    activeProjectId: null,
    behaviorOptions: createInitialEditorBehaviorOptions(),
    catalogCategory: initialEditorViewState.catalogCategory,
    displayOptions: createInitialEditorDisplayOptions(),
    editorMenuVisibility: "expanded",
    mapRenderOptions: createInitialMapRenderOptions(),
    modalId: initialEditorViewState.modalId,
    panelPosition: initialEditorViewState.panelPosition,
    placementHistory: createPlacementHistory(
      createInitialMapPlacementSnapshot(initialEditorViewState.mapId),
    ),
    runtimeState: { resourceGeneration: 0, status: "loading" },
    season: initialEditorViewState.season,
    selectedCatalogItemId: null,
    selectedPlacementKeys: [],
    selectedPlannerMapId: initialEditorViewState.mapId,
    tool: initialEditorViewState.tool,
  };
}

export function reducePlannerWorkspaceState(
  plannerWorkspaceState: PlannerWorkspaceState,
  plannerWorkspaceAction: PlannerWorkspaceAction,
): PlannerWorkspaceState {
  assertCanonicalIdentityInvariant(plannerWorkspaceState);

  switch (plannerWorkspaceAction.type) {
    case "start-runtime-loading":
      return startRuntimeLoading(
        plannerWorkspaceState,
        plannerWorkspaceAction.resourceGeneration,
      );
    case "complete-runtime-ready":
      return completeRuntimeState(
        plannerWorkspaceState,
        plannerWorkspaceAction.resourceGeneration,
        "loading",
        "ready",
      );
    case "complete-runtime-interactive":
      return completeRuntimeState(
        plannerWorkspaceState,
        plannerWorkspaceAction.resourceGeneration,
        "ready",
        "interactive",
      );
    case "complete-runtime-error":
      return completeRuntimeError(
        plannerWorkspaceState,
        plannerWorkspaceAction.resourceGeneration,
        plannerWorkspaceAction.message,
      );
    case "open-canonical-map":
      return openCanonicalMap(plannerWorkspaceState, plannerWorkspaceAction);
    case "synchronize-smart-save-canonical-map":
      return openCanonicalMap(plannerWorkspaceState, plannerWorkspaceAction);
    case "open-unsaved-imported-map":
      return openUnsavedImportedMap(plannerWorkspaceState, plannerWorkspaceAction);
    case "apply-placement-edit-result":
      return applyPlacementEditResult(
        plannerWorkspaceState,
        plannerWorkspaceAction,
      );
    case "restore-prepared-preferences":
      return restorePreparedPreferences(
        plannerWorkspaceState,
        plannerWorkspaceAction.preferences,
      );
    case "set-selected-catalog-item":
      return setSelectedCatalogItem(
        plannerWorkspaceState,
        plannerWorkspaceAction.catalogItemId,
      );
    case "set-selected-placement-keys":
      return setSelectedPlacementKeys(
        plannerWorkspaceState,
        plannerWorkspaceAction.selectedPlacementKeys,
      );
    case "select-map":
      return selectWorkspaceMap(
        plannerWorkspaceState,
        plannerWorkspaceAction.plannerMapId,
      );
    case "select-season":
      return selectWorkspaceSeason(
        plannerWorkspaceState,
        plannerWorkspaceAction.season,
      );
    case "cycle-season":
      return selectWorkspaceSeason(
        plannerWorkspaceState,
        getNextEditorSeason(plannerWorkspaceState.season),
      );
    case "select-tool":
      return selectWorkspaceTool(
        plannerWorkspaceState,
        plannerWorkspaceAction.tool,
      );
    case "select-catalog-category":
      return selectWorkspaceCatalogCategory(
        plannerWorkspaceState,
        plannerWorkspaceAction.catalogCategory,
      );
    case "select-panel-position":
      return selectWorkspacePanelPosition(
        plannerWorkspaceState,
        plannerWorkspaceAction.panelPosition,
      );
    case "open-modal":
      return openWorkspaceModal(
        plannerWorkspaceState,
        plannerWorkspaceAction.modalId,
      );
    case "close-modal":
      return closeWorkspaceModal(plannerWorkspaceState);
    case "toggle-display-option":
      return toggleWorkspaceDisplayOption(
        plannerWorkspaceState,
        plannerWorkspaceAction.option,
      );
    case "set-behavior-option":
      return setWorkspaceBehaviorOption(
        plannerWorkspaceState,
        plannerWorkspaceAction.option,
        plannerWorkspaceAction.value,
      );
    case "set-map-render-options":
      return setWorkspaceMapRenderOptions(
        plannerWorkspaceState,
        plannerWorkspaceAction.mapRenderOptions,
      );
    case "reset-placement-history":
      return resetWorkspacePlacementHistory(
        plannerWorkspaceState,
        plannerWorkspaceAction.placementSnapshot,
      );
    case "undo-placement-history":
      return changeWorkspaceHistory(plannerWorkspaceState, undoPlacementHistory);
    case "redo-placement-history":
      return changeWorkspaceHistory(plannerWorkspaceState, redoPlacementHistory);
    case "toggle-menu":
      return toggleWorkspaceMenu(plannerWorkspaceState);
    default:
      return assertUnreachablePlannerWorkspaceAction(plannerWorkspaceAction);
  }
}

function startRuntimeLoading(
  plannerWorkspaceState: PlannerWorkspaceState,
  resourceGeneration: number,
): PlannerWorkspaceState {
  assertResourceGeneration(resourceGeneration);

  return {
    ...plannerWorkspaceState,
    runtimeState: { resourceGeneration, status: "loading" },
  };
}

function completeRuntimeState(
  plannerWorkspaceState: PlannerWorkspaceState,
  resourceGeneration: number,
  requiredCurrentStatus: "loading" | "ready",
  nextStatus: "ready" | "interactive",
): PlannerWorkspaceState {
  assertResourceGeneration(resourceGeneration);

  if (
    resourceGeneration !== plannerWorkspaceState.runtimeState.resourceGeneration ||
    plannerWorkspaceState.runtimeState.status !== requiredCurrentStatus
  ) {
    return plannerWorkspaceState;
  }

  return {
    ...plannerWorkspaceState,
    runtimeState: { resourceGeneration, status: nextStatus },
  };
}

function completeRuntimeError(
  plannerWorkspaceState: PlannerWorkspaceState,
  resourceGeneration: number,
  message: string,
): PlannerWorkspaceState {
  assertResourceGeneration(resourceGeneration);

  if (
    resourceGeneration !== plannerWorkspaceState.runtimeState.resourceGeneration ||
    plannerWorkspaceState.runtimeState.status === "error"
  ) {
    return plannerWorkspaceState;
  }

  assertRuntimeErrorMessage(message);
  return {
    ...plannerWorkspaceState,
    runtimeState: { message, resourceGeneration, status: "error" },
  };
}

function openCanonicalMap(
  plannerWorkspaceState: PlannerWorkspaceState,
  action: Extract<
    PlannerWorkspaceAction,
    { type: "open-canonical-map" | "synchronize-smart-save-canonical-map" }
  >,
): PlannerWorkspaceState {
  assertCanonicalMapIdentity(action.activeProjectId, action.activeMapId);
  const selectedPlannerMapState = selectEditorMap(
    createEditorViewState(plannerWorkspaceState),
    action.plannerMapId,
  );
  const selectedSeasonState = selectEditorSeason(
    selectedPlannerMapState,
    action.season,
  );

  return {
    ...applyEditorViewState(plannerWorkspaceState, selectedSeasonState),
    activeMapId: action.activeMapId,
    activeProjectId: action.activeProjectId,
    modalId:
      action.type === "synchronize-smart-save-canonical-map"
      && plannerWorkspaceState.modalId === "save-panel"
        ? "save-panel"
        : selectedSeasonState.modalId,
    placementHistory: createPlacementHistory(
      createPersistentPlacementSnapshot(action.placementSnapshot),
    ),
    selectedPlacementKeys: [],
  };
}

function openUnsavedImportedMap(
  plannerWorkspaceState: PlannerWorkspaceState,
  action: Extract<PlannerWorkspaceAction, { type: "open-unsaved-imported-map" }>,
): PlannerWorkspaceState {
  const selectedPlannerMapState = selectEditorMap(
    createEditorViewState(plannerWorkspaceState),
    action.plannerMapId,
  );
  const selectedSeasonState = selectEditorSeason(
    selectedPlannerMapState,
    action.season,
  );
  return {
    ...applyEditorViewState(plannerWorkspaceState, selectedSeasonState),
    activeMapId: null,
    activeProjectId: null,
    placementHistory: createPlacementHistory(
      createPersistentPlacementSnapshot(action.placementSnapshot),
    ),
    selectedCatalogItemId: null,
    selectedPlacementKeys: [],
  };
}

function applyPlacementEditResult(
  plannerWorkspaceState: PlannerWorkspaceState,
  action: Extract<
    PlannerWorkspaceAction,
    { type: "apply-placement-edit-result" }
  >,
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    placementHistory: clonePlacementHistory(
      action.placementHistory,
      createPersistentPlacementSnapshot,
    ),
    selectedPlacementKeys: [...action.selectedPlacementKeys],
  };
}

function restorePreparedPreferences(
  plannerWorkspaceState: PlannerWorkspaceState,
  preferences: EditorPreferences,
): PlannerWorkspaceState {
  assertPreparedPreferences(preferences);
  return {
    ...plannerWorkspaceState,
    behaviorOptions: restoreBehaviorOptions(preferences),
    displayOptions: restoreDisplayOptions(preferences),
  };
}

function restoreBehaviorOptions(preferences: EditorPreferences): EditorBehaviorOptions {
  let behaviorOptions = createInitialEditorBehaviorOptions();

  for (const behaviorOptionKey of editorBehaviorOptionKeys) {
    behaviorOptions = setEditorBehaviorOption(
      behaviorOptions,
      behaviorOptionKey,
      preferences.behaviorOptions[behaviorOptionKey],
    );
  }

  return behaviorOptions;
}

function restoreDisplayOptions(preferences: EditorPreferences): EditorDisplayOptions {
  let displayOptions = createInitialEditorDisplayOptions();

  for (const displayOptionKey of editorDisplayOptionKeys) {
    if (preferences.displayOptions[displayOptionKey]) {
      displayOptions = toggleEditorDisplayOption(displayOptions, displayOptionKey);
    }
  }

  return displayOptions;
}

function assertPreparedPreferences(
  preferences: EditorPreferences,
): void {
  if (typeof preferences !== "object" || preferences === null) {
    throw new TypeError(
      `Planner workspace prepared preferences must be an object; received ${JSON.stringify(preferences)}.`,
    );
  }
  if (
    typeof preferences.behaviorOptions !== "object" ||
    preferences.behaviorOptions === null ||
    typeof preferences.displayOptions !== "object" ||
    preferences.displayOptions === null
  ) {
    throw new TypeError(
      `Planner workspace prepared preferences must include behaviorOptions and displayOptions objects; received ${JSON.stringify(preferences)}.`,
    );
  }
  for (const displayOptionKey of editorDisplayOptionKeys) {
    const displayOptionValue = preferences.displayOptions[displayOptionKey];
    if (typeof displayOptionValue !== "boolean") {
      throw new TypeError(
        `Planner workspace prepared display option ${displayOptionKey} must be a boolean; received ${JSON.stringify(displayOptionValue)}.`,
      );
    }
  }
}

function setSelectedCatalogItem(
  plannerWorkspaceState: PlannerWorkspaceState,
  catalogItemId: string | null,
): PlannerWorkspaceState {
  return { ...plannerWorkspaceState, selectedCatalogItemId: catalogItemId };
}

function setSelectedPlacementKeys(
  plannerWorkspaceState: PlannerWorkspaceState,
  selectedPlacementKeys: readonly PlacementSelectionKey[],
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    selectedPlacementKeys: [...selectedPlacementKeys],
  };
}

function selectWorkspaceMap(
  plannerWorkspaceState: PlannerWorkspaceState,
  plannerMapId: string,
): PlannerWorkspaceState {
  const isSelectingCurrentMap =
    plannerMapId === plannerWorkspaceState.selectedPlannerMapId;
  const canonicalIdentity = isSelectingCurrentMap
    ? {}
    : { activeMapId: null, activeProjectId: null };
  const mapSwitchState = {
    ...plannerWorkspaceState,
    ...canonicalIdentity,
    placementHistory: isSelectingCurrentMap
      ? plannerWorkspaceState.placementHistory
      : createPlacementHistory(createInitialMapPlacementSnapshot(plannerMapId)),
    selectedPlacementKeys: [],
  };

  return applyEditorViewState(
    mapSwitchState,
    selectEditorMap(createEditorViewState(mapSwitchState), plannerMapId),
  );
}

function selectWorkspaceSeason(
  plannerWorkspaceState: PlannerWorkspaceState,
  season: TilesheetSeason,
): PlannerWorkspaceState {
  return applyEditorViewState(
    plannerWorkspaceState,
    selectEditorSeason(createEditorViewState(plannerWorkspaceState), season),
  );
}

function selectWorkspaceTool(
  plannerWorkspaceState: PlannerWorkspaceState,
  tool: EditorTool | null,
): PlannerWorkspaceState {
  return applyEditorViewState(
    plannerWorkspaceState,
    selectEditorTool(createEditorViewState(plannerWorkspaceState), tool),
  );
}

function selectWorkspaceCatalogCategory(
  plannerWorkspaceState: PlannerWorkspaceState,
  catalogCategory: EditorCatalogCategory,
): PlannerWorkspaceState {
  return applyEditorViewState(
    plannerWorkspaceState,
    selectCatalogCategory(
      createEditorViewState(plannerWorkspaceState),
      catalogCategory,
    ),
  );
}

function selectWorkspacePanelPosition(
  plannerWorkspaceState: PlannerWorkspaceState,
  panelPosition: EditorPanelPosition,
): PlannerWorkspaceState {
  return applyEditorViewState(
    plannerWorkspaceState,
    selectPanelPosition(
      createEditorViewState(plannerWorkspaceState),
      panelPosition,
    ),
  );
}

function openWorkspaceModal(
  plannerWorkspaceState: PlannerWorkspaceState,
  modalId: EditorModalId,
): PlannerWorkspaceState {
  return {
    ...applyEditorViewState(
      plannerWorkspaceState,
      openEditorModal(createEditorViewState(plannerWorkspaceState), modalId),
    ),
    editorMenuVisibility: collapseEditorMenuForModalOpen(
      plannerWorkspaceState.editorMenuVisibility,
    ),
  };
}

function closeWorkspaceModal(
  plannerWorkspaceState: PlannerWorkspaceState,
): PlannerWorkspaceState {
  return applyEditorViewState(
    plannerWorkspaceState,
    closeEditorModal(createEditorViewState(plannerWorkspaceState)),
  );
}

function toggleWorkspaceDisplayOption(
  plannerWorkspaceState: PlannerWorkspaceState,
  option: EditorDisplayOptionKey,
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    displayOptions: toggleEditorDisplayOption(
      plannerWorkspaceState.displayOptions,
      option,
    ),
  };
}

function setWorkspaceBehaviorOption(
  plannerWorkspaceState: PlannerWorkspaceState,
  option: EditorBehaviorOptionKey,
  value: boolean,
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    behaviorOptions: setEditorBehaviorOption(
      plannerWorkspaceState.behaviorOptions,
      option,
      value,
    ),
  };
}

function setWorkspaceMapRenderOptions(
  plannerWorkspaceState: PlannerWorkspaceState,
  mapRenderOptions: MapRenderOptions,
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    mapRenderOptions: restoreMapRenderOptions(mapRenderOptions),
  };
}

function resetWorkspacePlacementHistory(
  plannerWorkspaceState: PlannerWorkspaceState,
  placementSnapshot: PlacementSnapshot,
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    placementHistory: createPlacementHistory(
      createPersistentPlacementSnapshot(placementSnapshot),
    ),
    selectedPlacementKeys: [],
  };
}

function changeWorkspaceHistory(
  plannerWorkspaceState: PlannerWorkspaceState,
  transitionPlacementHistory: <PlacementState>(
    placementHistory: PlacementHistory<PlacementState>,
  ) => PlacementHistory<PlacementState>,
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    placementHistory: transitionPlacementHistory(
      plannerWorkspaceState.placementHistory,
    ),
    selectedPlacementKeys: [],
  };
}

function toggleWorkspaceMenu(
  plannerWorkspaceState: PlannerWorkspaceState,
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    editorMenuVisibility: toggleEditorMenuVisibility(
      plannerWorkspaceState.editorMenuVisibility,
    ),
  };
}

function assertCanonicalIdentityInvariant(
  plannerWorkspaceState: PlannerWorkspaceState,
): void {
  const { activeProjectId, activeMapId } = plannerWorkspaceState;
  const bothCanonicalIdsAreNull =
    activeProjectId === null && activeMapId === null;
  const bothCanonicalIdsAreNonEmptyStrings =
    typeof activeProjectId === "string" &&
    activeProjectId.length > 0 &&
    typeof activeMapId === "string" &&
    activeMapId.length > 0;

  if (!bothCanonicalIdsAreNull && !bothCanonicalIdsAreNonEmptyStrings) {
    throw new TypeError(
      `Planner workspace canonical identities must be both null or non-empty strings; received activeProjectId ${JSON.stringify(activeProjectId)} and activeMapId ${JSON.stringify(activeMapId)}.`,
    );
  }
}

function assertCanonicalMapIdentity(
  activeProjectId: string,
  activeMapId: string,
): void {
  if (typeof activeProjectId !== "string" || activeProjectId.length === 0) {
    throw new TypeError(
      `Canonical map identity activeProjectId must be a non-empty string; received ${JSON.stringify(activeProjectId)}.`,
    );
  }

  if (typeof activeMapId !== "string" || activeMapId.length === 0) {
    throw new TypeError(
      `Canonical map identity activeMapId must be a non-empty string; received ${JSON.stringify(activeMapId)}.`,
    );
  }
}

function assertResourceGeneration(resourceGeneration: number): void {
  if (!Number.isInteger(resourceGeneration) || resourceGeneration < 0) {
    throw new TypeError(
      `Planner workspace resourceGeneration must be a non-negative integer; received ${JSON.stringify(resourceGeneration)}.`,
    );
  }
}

function assertRuntimeErrorMessage(message: string): void {
  if (typeof message !== "string" || message.trim().length === 0) {
    throw new TypeError(
      `Planner workspace runtime error message must be a non-empty string; received ${JSON.stringify(message)}.`,
    );
  }
}

function createEditorViewState(
  plannerWorkspaceState: PlannerWorkspaceState,
): EditorViewState {
  return {
    catalogCategory: plannerWorkspaceState.catalogCategory,
    mapId: plannerWorkspaceState.selectedPlannerMapId,
    modalId: plannerWorkspaceState.modalId,
    panelPosition: plannerWorkspaceState.panelPosition,
    season: plannerWorkspaceState.season,
    tool: plannerWorkspaceState.tool,
  };
}

function applyEditorViewState(
  plannerWorkspaceState: PlannerWorkspaceState,
  editorViewState: EditorViewState,
): PlannerWorkspaceState {
  return {
    ...plannerWorkspaceState,
    catalogCategory: editorViewState.catalogCategory,
    modalId: editorViewState.modalId,
    panelPosition: editorViewState.panelPosition,
    season: editorViewState.season,
    selectedPlannerMapId: editorViewState.mapId,
    tool: editorViewState.tool,
  };
}

function assertUnreachablePlannerWorkspaceAction(
  plannerWorkspaceAction: never,
): never {
  throw new Error(
    `Planner workspace action is unsupported: ${JSON.stringify(plannerWorkspaceAction)}.`,
  );
}
