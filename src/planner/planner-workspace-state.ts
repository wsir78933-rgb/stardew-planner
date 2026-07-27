import {
  closeEditorModal,
  createInitialEditorViewState,
  openEditorModal,
  selectCatalogCategory,
  selectEditorMap,
  selectEditorSeason,
  selectEditorTool,
  selectPanelPosition,
  type EditorCatalogCategory,
  type EditorMenuVisibility,
  type EditorModalId,
  type EditorPanelPosition,
  type EditorTool,
  type EditorViewState,
} from "../editor/editor-view-state";
import {
  createInitialEditorBehaviorOptions,
  setEditorBehaviorOption,
  type EditorBehaviorOptionKey,
  type EditorBehaviorOptions,
} from "../editor/editor-behavior-options";
import {
  createInitialEditorDisplayOptions,
  toggleEditorDisplayOption,
  type EditorDisplayOptionKey,
  type EditorDisplayOptions,
} from "../editor/editor-display-options";
import {
  createInitialMapRenderOptions,
  restoreMapRenderOptions,
  type MapRenderOptions,
} from "../maps/map-render-options";
import {
  createPlacementHistory,
  type PlacementHistory,
} from "../placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import type { PlacementSelectionKey } from "../editor/editor-selection-controller";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

export type PlannerWorkspaceState = Readonly<{
  behaviorOptions: EditorBehaviorOptions;
  catalogCategory: EditorCatalogCategory;
  displayOptions: EditorDisplayOptions;
  editorMenuVisibility: EditorMenuVisibility;
  mapRenderOptions: MapRenderOptions;
  modalId: EditorModalId | null;
  panelPosition: EditorPanelPosition;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  season: TilesheetSeason;
  selectedCatalogItemId: string | null;
  selectedMapId: string;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
  tool: EditorTool;
}>;

export type PlannerWorkspaceAction =
  | Readonly<{ type: "close-modal" }>
  | Readonly<{ type: "open-modal"; modalId: EditorModalId }>
  | Readonly<{ type: "reset-placement-history"; placementSnapshot: PlacementSnapshot }>
  | Readonly<{ type: "select-catalog-category"; catalogCategory: EditorCatalogCategory }>
  | Readonly<{ type: "select-map"; mapId: string }>
  | Readonly<{ type: "select-season"; season: TilesheetSeason }>
  | Readonly<{ type: "select-tool"; tool: EditorTool }>
  | Readonly<{ type: "select-panel-position"; panelPosition: EditorPanelPosition }>
  | Readonly<{ type: "set-behavior-option"; option: EditorBehaviorOptionKey; value: boolean }>
  | Readonly<{ type: "set-map-render-options"; mapRenderOptions: MapRenderOptions }>
  | Readonly<{ type: "set-placement-history"; placementHistory: PlacementHistory<PlacementSnapshot> }>
  | Readonly<{ type: "set-selected-catalog-item"; catalogItemId: string | null }>
  | Readonly<{ type: "set-selected-placement-keys"; selectedPlacementKeys: readonly PlacementSelectionKey[] }>
  | Readonly<{ type: "toggle-display-option"; option: EditorDisplayOptionKey }>
  | Readonly<{ type: "toggle-menu" }>;

export const initialPlannerWorkspaceState: PlannerWorkspaceState =
  createInitialPlannerWorkspaceState();

export function createInitialPlannerWorkspaceState(
  initialMapId = "standard",
): PlannerWorkspaceState {
  const initialEditorViewState = selectEditorMap(
    createInitialEditorViewState(),
    initialMapId,
  );

  return {
    behaviorOptions: createInitialEditorBehaviorOptions(),
    catalogCategory: initialEditorViewState.catalogCategory,
    displayOptions: createInitialEditorDisplayOptions(),
    editorMenuVisibility: "expanded",
    mapRenderOptions: createInitialMapRenderOptions(),
    modalId: initialEditorViewState.modalId,
    panelPosition: initialEditorViewState.panelPosition,
    placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
    season: initialEditorViewState.season,
    selectedCatalogItemId: null,
    selectedMapId: initialEditorViewState.mapId,
    selectedPlacementKeys: [],
    tool: initialEditorViewState.tool,
  };
}

export function reducePlannerWorkspaceState(
  plannerWorkspaceState: PlannerWorkspaceState,
  plannerWorkspaceAction: PlannerWorkspaceAction,
): PlannerWorkspaceState {
  const editorViewState = createEditorViewState(plannerWorkspaceState);

  if (plannerWorkspaceAction.type === "select-map") {
    return applyEditorViewState(
      plannerWorkspaceState,
      selectEditorMap(editorViewState, plannerWorkspaceAction.mapId),
    );
  }

  if (plannerWorkspaceAction.type === "select-season") {
    return applyEditorViewState(
      plannerWorkspaceState,
      selectEditorSeason(editorViewState, plannerWorkspaceAction.season),
    );
  }

  if (plannerWorkspaceAction.type === "select-tool") {
    return applyEditorViewState(
      plannerWorkspaceState,
      selectEditorTool(editorViewState, plannerWorkspaceAction.tool),
    );
  }

  if (plannerWorkspaceAction.type === "select-catalog-category") {
    return applyEditorViewState(
      plannerWorkspaceState,
      selectCatalogCategory(editorViewState, plannerWorkspaceAction.catalogCategory),
    );
  }

  if (plannerWorkspaceAction.type === "select-panel-position") {
    return applyEditorViewState(
      plannerWorkspaceState,
      selectPanelPosition(editorViewState, plannerWorkspaceAction.panelPosition),
    );
  }

  if (plannerWorkspaceAction.type === "open-modal") {
    return applyEditorViewState(
      plannerWorkspaceState,
      openEditorModal(editorViewState, plannerWorkspaceAction.modalId),
    );
  }

  if (plannerWorkspaceAction.type === "close-modal") {
    return applyEditorViewState(plannerWorkspaceState, closeEditorModal(editorViewState));
  }

  if (plannerWorkspaceAction.type === "toggle-display-option") {
    return {
      ...plannerWorkspaceState,
      displayOptions: toggleEditorDisplayOption(
        plannerWorkspaceState.displayOptions,
        plannerWorkspaceAction.option,
      ),
    };
  }

  if (plannerWorkspaceAction.type === "set-behavior-option") {
    return {
      ...plannerWorkspaceState,
      behaviorOptions: setEditorBehaviorOption(
        plannerWorkspaceState.behaviorOptions,
        plannerWorkspaceAction.option,
        plannerWorkspaceAction.value,
      ),
    };
  }

  if (plannerWorkspaceAction.type === "set-map-render-options") {
    return {
      ...plannerWorkspaceState,
      mapRenderOptions: restoreMapRenderOptions(
        plannerWorkspaceAction.mapRenderOptions,
      ),
    };
  }

  if (plannerWorkspaceAction.type === "set-placement-history") {
    return {
      ...plannerWorkspaceState,
      placementHistory: plannerWorkspaceAction.placementHistory,
    };
  }

  if (plannerWorkspaceAction.type === "reset-placement-history") {
    return {
      ...plannerWorkspaceState,
      placementHistory: createPlacementHistory(
        plannerWorkspaceAction.placementSnapshot,
      ),
      selectedPlacementKeys: [],
    };
  }

  if (plannerWorkspaceAction.type === "set-selected-placement-keys") {
    return {
      ...plannerWorkspaceState,
      selectedPlacementKeys: [...plannerWorkspaceAction.selectedPlacementKeys],
    };
  }

  if (plannerWorkspaceAction.type === "set-selected-catalog-item") {
    return {
      ...plannerWorkspaceState,
      selectedCatalogItemId: plannerWorkspaceAction.catalogItemId,
    };
  }

  if (plannerWorkspaceAction.type === "toggle-menu") {
    return {
      ...plannerWorkspaceState,
      editorMenuVisibility:
        plannerWorkspaceState.editorMenuVisibility === "expanded"
          ? "collapsed"
          : "expanded",
    };
  }

  return assertUnreachablePlannerWorkspaceAction(plannerWorkspaceAction);
}

function createEditorViewState(
  plannerWorkspaceState: PlannerWorkspaceState,
): EditorViewState {
  return {
    catalogCategory: plannerWorkspaceState.catalogCategory,
    mapId: plannerWorkspaceState.selectedMapId,
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
    selectedMapId: editorViewState.mapId,
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
