import type {
  BuildingPlacementMetadataById,
  CatalogItem,
  CatalogPresentationChoice,
} from "../catalog";
import { editorTools, type EditorTool } from "../editor/editor-view-state";
import {
  applyEditorErase,
  applyEditorEraseRectangle,
} from "../editor/editor-erase-controller";
import { applyEditorFill } from "../editor/editor-fill-controller";
import { applyEditorCursorPlacement } from "../editor/editor-placement-controller";
import {
  deleteSelectedPlacements,
  duplicateSelectedPlacementAtTile,
  moveSelectedPlacements,
  cycleSelectedPlacementAppearance,
  selectPlacementAtTile,
  selectPlacementsInRectangle,
  setSelectedPlacementBuildingPaint,
  setSelectedPlacementBuildingWaterColor,
  setSelectedPlacementItemTint,
  setSelectedPlacementNightLightState,
  type PlacementSelectionKey,
} from "../editor/editor-selection-controller";
import type {
  MapPlacementGrid,
  MapTileCoordinates,
} from "../placement/map-placement-grids";
import type { BuildingPaintColors } from "../paint/building-paint";
import type { PlacementHistory } from "../placement/placement-history";
import type { PlacementSnapshot } from "../placement/placement-snapshot";

export type PlannerWorkspaceEditingTransition = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type PlannerWorkspaceToolSelection = Readonly<{
  selectedCatalogItem: CatalogItem | null;
  selectedCatalogItemId: string | null;
}>;

type PlannerWorkspaceEditingContext = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  catalogPresentationChoice: CatalogPresentationChoice | null;
  freePlacement: boolean;
  mapPlacementGrid: MapPlacementGrid;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  resolvedCompositeVariant?: number;
  selectedCatalogItem: CatalogItem | null;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type PlannerWorkspaceMapTileClickInput =
  PlannerWorkspaceEditingContext &
    Readonly<{
      cursorTile: MapTileCoordinates;
      tool: EditorTool | null;
    }>;

export type PlannerWorkspaceMapTileRectangleInput =
  PlannerWorkspaceEditingContext &
    Readonly<{
      firstTile: MapTileCoordinates;
      secondTile: MapTileCoordinates;
      tool: EditorTool | null;
    }>;

export type PlannerWorkspaceMoveSelectionInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  catalogItems?: readonly CatalogItem[];
  freePlacement: boolean;
  mapPlacementGrid: MapPlacementGrid;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
  tileDelta: Readonly<{ x: number; y: number }>;
}>;

export type PlannerWorkspaceCycleSelectedAppearanceInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  catalogItems: readonly CatalogItem[];
  freePlacement: boolean;
  mapPlacementGrid: MapPlacementGrid;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type PlannerWorkspaceDuplicateSelectionInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  catalogItems?: readonly CatalogItem[];
  cursorTile: MapTileCoordinates;
  freePlacement: boolean;
  mapPlacementGrid: MapPlacementGrid;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type PlannerWorkspaceDeleteSelectionInput = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type PlannerWorkspaceSetSelectedItemTintInput = Readonly<{
  catalogItems: readonly CatalogItem[];
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
  tintColor: string;
}>;

export type PlannerWorkspaceSetSelectedBuildingPaintInput = Readonly<{
  paintColors: BuildingPaintColors;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type PlannerWorkspaceSetSelectedBuildingWaterColorInput = Readonly<{
  catalogItems: readonly CatalogItem[];
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
  waterColor: number | undefined;
}>;

export type PlannerWorkspaceSetSelectedNightLightStateInput = Readonly<{
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight">[];
  nightLightState: "off" | undefined;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export function applyPlannerWorkspaceMapTileClick(
  plannerWorkspaceMapTileClickInput: PlannerWorkspaceMapTileClickInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceMapTileClickInput(plannerWorkspaceMapTileClickInput);

  if (plannerWorkspaceMapTileClickInput.tool === "cursor") {
    return applyCursorTileClick(plannerWorkspaceMapTileClickInput);
  }

  if (plannerWorkspaceMapTileClickInput.tool === "erase") {
    return applyEraseTileClick(plannerWorkspaceMapTileClickInput);
  }

  return createUnchangedTransition(plannerWorkspaceMapTileClickInput);
}

export function getPlannerWorkspaceToolSelection(
  tool: EditorTool | null,
  selectedCatalogItem: CatalogItem | null,
): PlannerWorkspaceToolSelection {
  if (tool === "cursor") {
    return {
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    };
  }

  return {
    selectedCatalogItem,
    selectedCatalogItemId: selectedCatalogItem?.id ?? null,
  };
}

export function applyPlannerWorkspaceMapTileRectangle(
  plannerWorkspaceMapTileRectangleInput: PlannerWorkspaceMapTileRectangleInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceMapTileRectangleInput(
    plannerWorkspaceMapTileRectangleInput,
  );

  if (plannerWorkspaceMapTileRectangleInput.tool === "multi-select") {
    return {
      placementHistory: plannerWorkspaceMapTileRectangleInput.placementHistory,
      selectedPlacementKeys: selectPlacementsInRectangle({
        buildingMetadataById:
          plannerWorkspaceMapTileRectangleInput.buildingMetadataById,
        firstTile: plannerWorkspaceMapTileRectangleInput.firstTile,
        placementSnapshot:
          plannerWorkspaceMapTileRectangleInput.placementHistory.currentState,
        secondTile: plannerWorkspaceMapTileRectangleInput.secondTile,
      }),
    };
  }

  if (plannerWorkspaceMapTileRectangleInput.tool === "fill") {
    return applyFillRectangle(plannerWorkspaceMapTileRectangleInput);
  }

  if (plannerWorkspaceMapTileRectangleInput.tool === "erase") {
    return applyEraseRectangle(plannerWorkspaceMapTileRectangleInput);
  }

  return createUnchangedTransition(plannerWorkspaceMapTileRectangleInput);
}

export function movePlannerWorkspaceSelection(
  plannerWorkspaceMoveSelectionInput: PlannerWorkspaceMoveSelectionInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceMoveSelectionInput(plannerWorkspaceMoveSelectionInput);
  const moveResult = moveSelectedPlacements(plannerWorkspaceMoveSelectionInput);

  return {
    placementHistory: moveResult.placementHistory,
    selectedPlacementKeys: moveResult.selectedPlacementKeys,
  };
}

export function cyclePlannerWorkspaceSelectedAppearance(
  plannerWorkspaceCycleSelectedAppearanceInput: PlannerWorkspaceCycleSelectedAppearanceInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceCycleSelectedAppearanceInput(
    plannerWorkspaceCycleSelectedAppearanceInput,
  );
  const selectedPlacementKey = getSingleSelectedPlacementKey(
    plannerWorkspaceCycleSelectedAppearanceInput.selectedPlacementKeys,
  );

  if (selectedPlacementKey === null) {
    return createUnchangedTransition(plannerWorkspaceCycleSelectedAppearanceInput);
  }

  const appearanceCycleResult = cycleSelectedPlacementAppearance({
    buildingMetadataById:
      plannerWorkspaceCycleSelectedAppearanceInput.buildingMetadataById,
    catalogItems: plannerWorkspaceCycleSelectedAppearanceInput.catalogItems,
    freePlacement: plannerWorkspaceCycleSelectedAppearanceInput.freePlacement,
    mapPlacementGrid:
      plannerWorkspaceCycleSelectedAppearanceInput.mapPlacementGrid,
    placementHistory:
      plannerWorkspaceCycleSelectedAppearanceInput.placementHistory,
    selectedPlacementKey,
  });

  return {
    placementHistory: appearanceCycleResult.placementHistory,
    selectedPlacementKeys: [appearanceCycleResult.selectedPlacementKey],
  };
}

export function duplicatePlannerWorkspaceSelectionAtTile(
  plannerWorkspaceDuplicateSelectionInput: PlannerWorkspaceDuplicateSelectionInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceDuplicateSelectionInput(
    plannerWorkspaceDuplicateSelectionInput,
  );
  const selectedPlacementKey = getSingleSelectedPlacementKey(
    plannerWorkspaceDuplicateSelectionInput.selectedPlacementKeys,
  );

  if (selectedPlacementKey === null) {
    return createUnchangedTransition(plannerWorkspaceDuplicateSelectionInput);
  }

  const duplicateResult = duplicateSelectedPlacementAtTile({
    buildingMetadataById:
      plannerWorkspaceDuplicateSelectionInput.buildingMetadataById,
    catalogItems: plannerWorkspaceDuplicateSelectionInput.catalogItems,
    cursorTile: plannerWorkspaceDuplicateSelectionInput.cursorTile,
    freePlacement: plannerWorkspaceDuplicateSelectionInput.freePlacement,
    mapPlacementGrid: plannerWorkspaceDuplicateSelectionInput.mapPlacementGrid,
    placementHistory: plannerWorkspaceDuplicateSelectionInput.placementHistory,
    selectedPlacementKey,
  });

  return {
    placementHistory: duplicateResult.placementHistory,
    selectedPlacementKeys: duplicateResult.applied
      ? [duplicateResult.selectedPlacementKey]
      : plannerWorkspaceDuplicateSelectionInput.selectedPlacementKeys,
  };
}

export function deletePlannerWorkspaceSelection(
  plannerWorkspaceDeleteSelectionInput: PlannerWorkspaceDeleteSelectionInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceDeleteSelectionInput(
    plannerWorkspaceDeleteSelectionInput,
  );
  const deleteResult = deleteSelectedPlacements({
    placementHistory: plannerWorkspaceDeleteSelectionInput.placementHistory,
    selectedPlacementKeys:
      plannerWorkspaceDeleteSelectionInput.selectedPlacementKeys,
  });

  return {
    placementHistory: deleteResult.placementHistory,
    selectedPlacementKeys: deleteResult.applied
      ? []
      : plannerWorkspaceDeleteSelectionInput.selectedPlacementKeys,
  };
}

export function setPlannerWorkspaceSelectedItemTint(
  plannerWorkspaceSetSelectedItemTintInput: PlannerWorkspaceSetSelectedItemTintInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceSetSelectedItemTintInput(
    plannerWorkspaceSetSelectedItemTintInput,
  );
  const selectedPlacementKey = getSingleSelectedPlacementKey(
    plannerWorkspaceSetSelectedItemTintInput.selectedPlacementKeys,
  );

  if (selectedPlacementKey === null) {
    return createUnchangedTransition(plannerWorkspaceSetSelectedItemTintInput);
  }

  const tintResult = setSelectedPlacementItemTint({
    catalogItems: plannerWorkspaceSetSelectedItemTintInput.catalogItems,
    placementHistory: plannerWorkspaceSetSelectedItemTintInput.placementHistory,
    selectedPlacementKey,
    tintColor: plannerWorkspaceSetSelectedItemTintInput.tintColor,
  });

  return {
    placementHistory: tintResult.placementHistory,
    selectedPlacementKeys: [tintResult.selectedPlacementKey],
  };
}

export function setPlannerWorkspaceSelectedBuildingPaint(
  plannerWorkspaceSetSelectedBuildingPaintInput: PlannerWorkspaceSetSelectedBuildingPaintInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceSetSelectedBuildingPaintInput(
    plannerWorkspaceSetSelectedBuildingPaintInput,
  );
  const selectedPlacementKey = getSingleSelectedPlacementKey(
    plannerWorkspaceSetSelectedBuildingPaintInput.selectedPlacementKeys,
  );

  if (selectedPlacementKey === null) {
    return createUnchangedTransition(plannerWorkspaceSetSelectedBuildingPaintInput);
  }

  const paintResult = setSelectedPlacementBuildingPaint({
    paintColors: plannerWorkspaceSetSelectedBuildingPaintInput.paintColors,
    placementHistory:
      plannerWorkspaceSetSelectedBuildingPaintInput.placementHistory,
    selectedPlacementKey,
  });

  return {
    placementHistory: paintResult.placementHistory,
    selectedPlacementKeys: [paintResult.selectedPlacementKey],
  };
}

export function setPlannerWorkspaceSelectedBuildingWaterColor(
  plannerWorkspaceSetSelectedBuildingWaterColorInput: PlannerWorkspaceSetSelectedBuildingWaterColorInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceSetSelectedBuildingWaterColorInput(
    plannerWorkspaceSetSelectedBuildingWaterColorInput,
  );
  const selectedPlacementKey = getSingleSelectedPlacementKey(
    plannerWorkspaceSetSelectedBuildingWaterColorInput.selectedPlacementKeys,
  );

  if (selectedPlacementKey === null) {
    return createUnchangedTransition(
      plannerWorkspaceSetSelectedBuildingWaterColorInput,
    );
  }

  const waterColorResult = setSelectedPlacementBuildingWaterColor({
    catalogItems: plannerWorkspaceSetSelectedBuildingWaterColorInput.catalogItems,
    placementHistory:
      plannerWorkspaceSetSelectedBuildingWaterColorInput.placementHistory,
    selectedPlacementKey,
    waterColor: plannerWorkspaceSetSelectedBuildingWaterColorInput.waterColor,
  });

  return {
    placementHistory: waterColorResult.placementHistory,
    selectedPlacementKeys: [waterColorResult.selectedPlacementKey],
  };
}

export function setPlannerWorkspaceSelectedNightLightState(
  plannerWorkspaceSetSelectedNightLightStateInput: PlannerWorkspaceSetSelectedNightLightStateInput,
): PlannerWorkspaceEditingTransition {
  assertPlannerWorkspaceSetSelectedNightLightStateInput(
    plannerWorkspaceSetSelectedNightLightStateInput,
  );
  const selectedPlacementKey = getSingleSelectedPlacementKey(
    plannerWorkspaceSetSelectedNightLightStateInput.selectedPlacementKeys,
  );

  if (selectedPlacementKey === null) {
    return createUnchangedTransition(
      plannerWorkspaceSetSelectedNightLightStateInput,
    );
  }

  const nightLightResult = setSelectedPlacementNightLightState({
    catalogItems: plannerWorkspaceSetSelectedNightLightStateInput.catalogItems,
    nightLightState:
      plannerWorkspaceSetSelectedNightLightStateInput.nightLightState,
    placementHistory:
      plannerWorkspaceSetSelectedNightLightStateInput.placementHistory,
    selectedPlacementKey,
  });

  return {
    placementHistory: nightLightResult.placementHistory,
    selectedPlacementKeys: [nightLightResult.selectedPlacementKey],
  };
}

function applyCursorTileClick(
  plannerWorkspaceMapTileClickInput: PlannerWorkspaceMapTileClickInput,
): PlannerWorkspaceEditingTransition {
  if (plannerWorkspaceMapTileClickInput.selectedCatalogItem === null) {
    const selectedPlacementKey = selectPlacementAtTile({
      buildingMetadataById:
        plannerWorkspaceMapTileClickInput.buildingMetadataById,
      cursorTile: plannerWorkspaceMapTileClickInput.cursorTile,
      currentSelectionKey:
        plannerWorkspaceMapTileClickInput.selectedPlacementKeys.length === 1
          ? plannerWorkspaceMapTileClickInput.selectedPlacementKeys[0]
          : null,
      placementSnapshot:
        plannerWorkspaceMapTileClickInput.placementHistory.currentState,
    });

    return {
      placementHistory: plannerWorkspaceMapTileClickInput.placementHistory,
      selectedPlacementKeys:
        selectedPlacementKey === null ? [] : [selectedPlacementKey],
    };
  }

  const placementResult = applyEditorCursorPlacement({
    buildingMetadataById:
      plannerWorkspaceMapTileClickInput.buildingMetadataById,
    catalogPresentationChoice:
      plannerWorkspaceMapTileClickInput.catalogPresentationChoice,
    cursorTile: plannerWorkspaceMapTileClickInput.cursorTile,
    freePlacement: plannerWorkspaceMapTileClickInput.freePlacement,
    mapPlacementGrid: plannerWorkspaceMapTileClickInput.mapPlacementGrid,
    placementHistory: plannerWorkspaceMapTileClickInput.placementHistory,
    resolvedCompositeVariant:
      plannerWorkspaceMapTileClickInput.resolvedCompositeVariant,
    selectedCatalogItem: plannerWorkspaceMapTileClickInput.selectedCatalogItem,
  });

  return {
    placementHistory: placementResult.placementHistory,
    selectedPlacementKeys:
      placementResult.applied
        ? []
        : plannerWorkspaceMapTileClickInput.selectedPlacementKeys,
  };
}

function applyEraseTileClick(
  plannerWorkspaceMapTileClickInput: PlannerWorkspaceMapTileClickInput,
): PlannerWorkspaceEditingTransition {
  const eraseResult = applyEditorErase({
    buildingMetadataById:
      plannerWorkspaceMapTileClickInput.buildingMetadataById,
    cursorTile: plannerWorkspaceMapTileClickInput.cursorTile,
    placementHistory: plannerWorkspaceMapTileClickInput.placementHistory,
  });

  return {
    placementHistory: eraseResult.placementHistory,
    selectedPlacementKeys:
      eraseResult.applied
        ? []
        : plannerWorkspaceMapTileClickInput.selectedPlacementKeys,
  };
}

function applyFillRectangle(
  plannerWorkspaceMapTileRectangleInput: PlannerWorkspaceMapTileRectangleInput,
): PlannerWorkspaceEditingTransition {
  const fillResult = applyEditorFill({
    buildingMetadataById:
      plannerWorkspaceMapTileRectangleInput.buildingMetadataById,
    catalogPresentationChoice:
      plannerWorkspaceMapTileRectangleInput.catalogPresentationChoice,
    firstTile: plannerWorkspaceMapTileRectangleInput.firstTile,
    freePlacement: plannerWorkspaceMapTileRectangleInput.freePlacement,
    mapPlacementGrid: plannerWorkspaceMapTileRectangleInput.mapPlacementGrid,
    placementHistory: plannerWorkspaceMapTileRectangleInput.placementHistory,
    secondTile: plannerWorkspaceMapTileRectangleInput.secondTile,
    selectedCatalogItem:
      plannerWorkspaceMapTileRectangleInput.selectedCatalogItem,
  });

  return {
    placementHistory: fillResult.placementHistory,
    selectedPlacementKeys:
      fillResult.applied
        ? []
        : plannerWorkspaceMapTileRectangleInput.selectedPlacementKeys,
  };
}

function applyEraseRectangle(
  plannerWorkspaceMapTileRectangleInput: PlannerWorkspaceMapTileRectangleInput,
): PlannerWorkspaceEditingTransition {
  const eraseResult = applyEditorEraseRectangle({
    buildingMetadataById:
      plannerWorkspaceMapTileRectangleInput.buildingMetadataById,
    firstTile: plannerWorkspaceMapTileRectangleInput.firstTile,
    placementHistory: plannerWorkspaceMapTileRectangleInput.placementHistory,
    secondTile: plannerWorkspaceMapTileRectangleInput.secondTile,
  });

  return {
    placementHistory: eraseResult.placementHistory,
    selectedPlacementKeys:
      eraseResult.applied
        ? []
        : plannerWorkspaceMapTileRectangleInput.selectedPlacementKeys,
  };
}

function createUnchangedTransition(
  plannerWorkspaceEditingContext: Readonly<{
    placementHistory: PlacementHistory<PlacementSnapshot>;
    selectedPlacementKeys: readonly PlacementSelectionKey[];
  }>,
): PlannerWorkspaceEditingTransition {
  return {
    placementHistory: plannerWorkspaceEditingContext.placementHistory,
    selectedPlacementKeys: plannerWorkspaceEditingContext.selectedPlacementKeys,
  };
}

function assertPlannerWorkspaceMapTileClickInput(
  plannerWorkspaceMapTileClickInput: PlannerWorkspaceMapTileClickInput,
): void {
  assertPlannerWorkspaceTransitionInput(plannerWorkspaceMapTileClickInput);
  assertPlannerWorkspaceCatalogChoicePair(plannerWorkspaceMapTileClickInput);
  assertMapTileCoordinates(
    plannerWorkspaceMapTileClickInput.cursorTile,
    "cursorTile",
  );
  assertEditorToolSelection(plannerWorkspaceMapTileClickInput.tool);
}

function assertPlannerWorkspaceMapTileRectangleInput(
  plannerWorkspaceMapTileRectangleInput: PlannerWorkspaceMapTileRectangleInput,
): void {
  assertPlannerWorkspaceTransitionInput(
    plannerWorkspaceMapTileRectangleInput,
  );
  assertPlannerWorkspaceCatalogChoicePair(plannerWorkspaceMapTileRectangleInput);
  assertMapTileCoordinates(
    plannerWorkspaceMapTileRectangleInput.firstTile,
    "firstTile",
  );
  assertMapTileCoordinates(
    plannerWorkspaceMapTileRectangleInput.secondTile,
    "secondTile",
  );
  assertEditorToolSelection(plannerWorkspaceMapTileRectangleInput.tool);
}

function assertPlannerWorkspaceCatalogChoicePair(
  plannerWorkspaceCatalogChoiceInput: Readonly<{
    catalogPresentationChoice: CatalogPresentationChoice | null;
    selectedCatalogItem: CatalogItem | null;
  }>,
): void {
  const hasSelectedCatalogItem =
    plannerWorkspaceCatalogChoiceInput.selectedCatalogItem !== null;
  const hasCatalogPresentationChoice =
    plannerWorkspaceCatalogChoiceInput.catalogPresentationChoice !== null;
  if (hasSelectedCatalogItem === hasCatalogPresentationChoice) {
    return;
  }
  const selectedCatalogItemValue =
    plannerWorkspaceCatalogChoiceInput.selectedCatalogItem === null
      ? "null"
      : `item ID ${describeValue(plannerWorkspaceCatalogChoiceInput.selectedCatalogItem.id)}`;
  throw new TypeError(
    "Planner workspace editing selectedCatalogItem and catalogPresentationChoice " +
      "must both be null or both be non-null; received selectedCatalogItem " +
      `${selectedCatalogItemValue} and catalogPresentationChoice ` +
      `${describeValue(plannerWorkspaceCatalogChoiceInput.catalogPresentationChoice)}.`,
  );
}

function assertPlannerWorkspaceMoveSelectionInput(
  plannerWorkspaceMoveSelectionInput: PlannerWorkspaceMoveSelectionInput,
): void {
  assertPlannerWorkspaceTransitionInput(plannerWorkspaceMoveSelectionInput);
}

function assertPlannerWorkspaceCycleSelectedAppearanceInput(
  plannerWorkspaceCycleSelectedAppearanceInput: PlannerWorkspaceCycleSelectedAppearanceInput,
): void {
  assertPlannerWorkspaceTransitionInput(
    plannerWorkspaceCycleSelectedAppearanceInput,
  );
}

function assertPlannerWorkspaceDuplicateSelectionInput(
  plannerWorkspaceDuplicateSelectionInput: PlannerWorkspaceDuplicateSelectionInput,
): void {
  assertPlannerWorkspaceTransitionInput(
    plannerWorkspaceDuplicateSelectionInput,
  );
  assertMapTileCoordinates(
    plannerWorkspaceDuplicateSelectionInput.cursorTile,
    "cursorTile",
  );
}

function assertPlannerWorkspaceDeleteSelectionInput(
  plannerWorkspaceDeleteSelectionInput: PlannerWorkspaceDeleteSelectionInput,
): void {
  assertPlannerWorkspaceTransitionInput(plannerWorkspaceDeleteSelectionInput);
}

function assertPlannerWorkspaceSetSelectedItemTintInput(
  plannerWorkspaceSetSelectedItemTintInput: PlannerWorkspaceSetSelectedItemTintInput,
): void {
  assertPlannerWorkspaceTransitionInput(
    plannerWorkspaceSetSelectedItemTintInput,
  );
  if (
    typeof plannerWorkspaceSetSelectedItemTintInput.tintColor !== "string" ||
    plannerWorkspaceSetSelectedItemTintInput.tintColor.length === 0
  ) {
    throw new TypeError(
      `Planner workspace editing tintColor must be a non-empty string; received ${describeValue(plannerWorkspaceSetSelectedItemTintInput.tintColor)}.`,
    );
  }
  if (!Array.isArray(plannerWorkspaceSetSelectedItemTintInput.catalogItems)) {
    throw new TypeError(`Planner workspace editing catalogItems must be an array; received ${describeValue(plannerWorkspaceSetSelectedItemTintInput.catalogItems)}.`);
  }
}

function assertPlannerWorkspaceSetSelectedBuildingPaintInput(
  plannerWorkspaceSetSelectedBuildingPaintInput: PlannerWorkspaceSetSelectedBuildingPaintInput,
): void {
  assertPlannerWorkspaceTransitionInput(
    plannerWorkspaceSetSelectedBuildingPaintInput,
  );
}

function assertPlannerWorkspaceSetSelectedBuildingWaterColorInput(
  plannerWorkspaceSetSelectedBuildingWaterColorInput: PlannerWorkspaceSetSelectedBuildingWaterColorInput,
): void {
  assertPlannerWorkspaceTransitionInput(
    plannerWorkspaceSetSelectedBuildingWaterColorInput,
  );
  if (!Array.isArray(plannerWorkspaceSetSelectedBuildingWaterColorInput.catalogItems)) {
    throw new TypeError(
      `Planner workspace editing catalogItems must be an array; received ${describeValue(plannerWorkspaceSetSelectedBuildingWaterColorInput.catalogItems)}.`,
    );
  }
}

function assertPlannerWorkspaceSetSelectedNightLightStateInput(
  plannerWorkspaceSetSelectedNightLightStateInput: PlannerWorkspaceSetSelectedNightLightStateInput,
): void {
  assertPlannerWorkspaceTransitionInput(
    plannerWorkspaceSetSelectedNightLightStateInput,
  );
}

function getSingleSelectedPlacementKey(
  selectedPlacementKeys: readonly PlacementSelectionKey[],
): PlacementSelectionKey | null {
  return selectedPlacementKeys.length === 1
    ? selectedPlacementKeys[0] ?? null
    : null;
}

function assertPlannerWorkspaceTransitionInput(
  plannerWorkspaceTransitionInput: Readonly<{
    placementHistory: PlacementHistory<PlacementSnapshot>;
    selectedPlacementKeys: readonly PlacementSelectionKey[];
  }>,
): void {
  if (
    typeof plannerWorkspaceTransitionInput !== "object" ||
    plannerWorkspaceTransitionInput === null
  ) {
    throw new TypeError(
      `Planner workspace transition input must be an object; received ${describeValue(plannerWorkspaceTransitionInput)}.`,
    );
  }
  if (
    typeof plannerWorkspaceTransitionInput.placementHistory !== "object" ||
    plannerWorkspaceTransitionInput.placementHistory === null
  ) {
    throw new TypeError(
      `Planner workspace editing placementHistory must be an object; received ${describeValue(plannerWorkspaceTransitionInput.placementHistory)}.`,
    );
  }
  if (!Array.isArray(plannerWorkspaceTransitionInput.selectedPlacementKeys)) {
    throw new TypeError(
      `Planner workspace editing selectedPlacementKeys must be an array; received ${describeValue(plannerWorkspaceTransitionInput.selectedPlacementKeys)}.`,
    );
  }
  for (const [selectionIndex, selectedPlacementKey] of plannerWorkspaceTransitionInput.selectedPlacementKeys.entries()) {
    if (typeof selectedPlacementKey !== "string" || selectedPlacementKey.length === 0) {
      throw new TypeError(
        `Planner workspace editing selectedPlacementKeys[${selectionIndex}] must be a non-empty string; received ${describeValue(selectedPlacementKey)}.`,
      );
    }
  }
}

function assertMapTileCoordinates(
  mapTileCoordinates: MapTileCoordinates,
  fieldName: string,
): void {
  if (typeof mapTileCoordinates !== "object" || mapTileCoordinates === null) {
    throw new TypeError(
      `Planner workspace editing ${fieldName} must be an object; received ${describeValue(mapTileCoordinates)}.`,
    );
  }
  for (const coordinateName of ["x", "y"] as const) {
    const coordinate = mapTileCoordinates[coordinateName];
    if (!Number.isSafeInteger(coordinate) || coordinate < 0) {
      throw new RangeError(
        `Planner workspace editing ${fieldName}.${coordinateName} must be a non-negative safe integer; received ${describeValue(coordinate)}.`,
      );
    }
  }
}

function assertEditorToolSelection(editorTool: EditorTool | null): void {
  if (editorTool === null) {
    return;
  }

  if (!editorTools.includes(editorTool)) {
    throw new TypeError(
      `Planner workspace editing tool selection must be null or one of ${editorTools.join(", ")}; received ${describeValue(editorTool)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  return JSON.stringify(value);
}
