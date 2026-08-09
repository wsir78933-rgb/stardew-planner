import {
  validateCatalogPresentationCapabilities,
  type BuildingPlacementMetadataById,
  type CatalogItem,
  type CatalogPresentationChoice,
} from "../catalog";
import { getCatalogItemPlacementRequirement } from "../placement/catalog-item-placement-requirement";
import type {
  MapPlacementGrid,
  MapTileCoordinates,
} from "../placement/map-placement-grids";
import {
  commitPlacementHistory,
  type PlacementHistory,
} from "../placement/placement-history";
import {
  applyPlacementSnapshotAction,
  createPersistentPlacementSnapshot,
  validatePlacementBuildingWaterColor,
  type PlacementBuilding,
  type PlacementCrop,
  type PlacementHeldItem,
  type PlacementItem,
  type PlacementSnapshot,
  type PlacementSnapshotAction,
} from "../placement/placement-snapshot";
import {
  createDefaultBuildingPaintColors,
  isBuildingPaintable,
  validateBuildingPaintColors,
  type BuildingPaintColors,
} from "../paint/building-paint";
import {
  validatePlacement,
  type PlacementValidationCandidate,
  type PlacementValidationResult,
} from "../placement/placement-validation";
import { getPlacementItemZIndex } from "../placement/placement-item-z-order";
import { isGardenPotAtTile } from "../placement/garden-pot-placement";
import {
  deletePlacementItemOrHeldItem,
  findPlacementItemOrHeldItem,
  replacePlacementItemOrHeldItem,
  type PlacementItemOrHeldItem,
} from "../placement/table-held-item-semantics";

export type PlacementSelectionKey = string;

export type PlacementSelectionBounds = Readonly<{
  maximumX: number;
  maximumY: number;
  minimumX: number;
  minimumY: number;
}>;

export type PlacementSelectionDetails =
  | Readonly<{
      catalogItemId: string;
      canCycleAppearance: boolean;
      canPaint: boolean;
      canSetWaterColor: boolean;
      kind: "building";
      paintColors?: BuildingPaintColors;
      selectedPlacementKey: PlacementSelectionKey;
      waterColor?: number;
    }>
  | Readonly<{
      catalogItemId: string;
      canCycleAppearance: false;
      kind: "crop";
      selectedPlacementKey: PlacementSelectionKey;
    }>
  | Readonly<{
      catalogItemId: string;
      canCycleAppearance: boolean;
      kind: "item";
      nightLightState: "off" | undefined;
      selectedPlacementKey: PlacementSelectionKey;
      tintColor: string;
    }>;

export type SelectPlacementsInRectangleInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  firstTile: MapTileCoordinates;
  placementSnapshot: PlacementSnapshot;
  secondTile: MapTileCoordinates;
}>;

export type SelectPlacementAtTileInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  cursorTile: MapTileCoordinates;
  currentSelectionKey?: PlacementSelectionKey | null;
  placementSnapshot: PlacementSnapshot;
}>;

export type SelectPlacementByKeyInput = Readonly<{
  placementSnapshot: PlacementSnapshot;
  selectedPlacementKey: PlacementSelectionKey | null;
}>;

export type SelectFirstSelectablePlacementKeyInput = Readonly<{
  placementSnapshot: PlacementSnapshot;
  placementSelectionKeys: readonly PlacementSelectionKey[];
}>;

export type DeleteSelectedPlacementsInput = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type GetPlacementSelectionBoundsInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  placementSnapshot: PlacementSnapshot;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type GetPlacementSelectionDetailsInput = Readonly<{
  catalogItems: readonly CatalogItem[];
  placementSnapshot: PlacementSnapshot;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type GetPlacementSelectionSummaryInput = Readonly<{
  placementSnapshot: PlacementSnapshot;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
}>;

export type PlacementSelectionSummary = Readonly<{
  count: number;
}>;

export type MoveSelectedPlacementsInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  catalogItems?: readonly CatalogItem[];
  freePlacement?: boolean;
  mapPlacementGrid: MapPlacementGrid;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
  tileDelta: Readonly<{ x: number; y: number }>;
}>;

export type CycleSelectedPlacementAppearanceInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  catalogItems: readonly CatalogItem[];
  freePlacement?: boolean;
  mapPlacementGrid: MapPlacementGrid;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type SetSelectedPlacementItemTintInput = Readonly<{
  catalogItems: readonly CatalogItem[];
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
  tintColor: string;
}>;

export type SetSelectedPlacementBuildingPaintInput = Readonly<{
  paintColors: BuildingPaintColors;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type SetSelectedPlacementBuildingWaterColorInput = Readonly<{
  catalogItems: readonly CatalogItem[];
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
  waterColor: number | undefined;
}>;

export type SetSelectedPlacementNightLightStateInput = Readonly<{
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight" | "furnitureFire">[];
  nightLightState: "off" | undefined;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type DuplicateSelectedPlacementAtTileInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  catalogItems?: readonly CatalogItem[];
  cursorTile: MapTileCoordinates;
  freePlacement?: boolean;
  mapPlacementGrid: MapPlacementGrid;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type DeleteSelectedPlacementsResult =
  | Readonly<{
      applied: true;
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>
  | Readonly<{
      applied: false;
      reason: "empty-selection";
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>;

export type MoveSelectedPlacementsResult =
  | Readonly<{
      applied: true;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKeys: readonly PlacementSelectionKey[];
    }>
  | Readonly<{
      applied: false;
      reason: "empty-selection" | "zero-delta";
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKeys: readonly PlacementSelectionKey[];
    }>
  | Readonly<{
      applied: false;
      validation: Extract<PlacementValidationResult, { valid: false }>;
      placementHistory: PlacementHistory<PlacementSnapshot>;
    selectedPlacementKeys: readonly PlacementSelectionKey[];
  }>;

export type CycleSelectedPlacementAppearanceResult =
  | Readonly<{
      applied: true;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKey: PlacementSelectionKey;
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      reason: "not-cycleable";
      selectedPlacementKey: PlacementSelectionKey;
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKey: PlacementSelectionKey;
      validation: Extract<PlacementValidationResult, { valid: false }>;
    }>;

export type SetSelectedPlacementItemTintResult = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type SetSelectedPlacementBuildingPaintResult = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type SetSelectedPlacementBuildingWaterColorResult = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type SetSelectedPlacementNightLightStateResult =
  | Readonly<{
      applied: true;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKey: PlacementSelectionKey;
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      reason: "already-in-requested-state";
      selectedPlacementKey: PlacementSelectionKey;
    }>;

export type DuplicateSelectedPlacementAtTileResult =
  | Readonly<{
      applied: true;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKey: PlacementSelectionKey;
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKey: PlacementSelectionKey;
      validation: Extract<PlacementValidationResult, { valid: false }>;
    }>;

type SelectionRectangle = Readonly<{
  maximumX: number;
  maximumY: number;
  minimumX: number;
  minimumY: number;
}>;

type ParsedPlacementSelectionKey =
  | Readonly<{ kind: "building"; instanceId: number }>
  | Readonly<{ kind: "crop"; coordinate: MapTileCoordinates }>
  | Readonly<{ kind: "item"; instanceId: number }>;

export function selectPlacementsInRectangle(
  selectPlacementsInRectangleInput: SelectPlacementsInRectangleInput,
): readonly PlacementSelectionKey[] {
  assertSelectPlacementsInRectangleInput(selectPlacementsInRectangleInput);
  const placementSnapshot = createPersistentPlacementSnapshot(
    selectPlacementsInRectangleInput.placementSnapshot,
  );
  const selectionRectangle = createSelectionRectangle(
    selectPlacementsInRectangleInput.firstTile,
    selectPlacementsInRectangleInput.secondTile,
  );
  const selectedBuildingKeys = selectBuildingKeys(
    placementSnapshot,
    selectionRectangle,
    selectPlacementsInRectangleInput.buildingMetadataById,
  );
  const selectedCropKeys = placementSnapshot.crops.flatMap((placementCrop) =>
    isCoordinateInsideSelectionRectangle(selectionRectangle, placementCrop)
      ? [createCropSelectionKey(placementCrop.x, placementCrop.y)]
      : [],
  );
  const selectedItemKeys = placementSnapshot.items.flatMap((placementItem) => {
    if (!doesRectangleIntersectSelectionRectangle(
      selectionRectangle,
      placementItem.x,
      placementItem.y,
      placementItem.footprint.width,
      placementItem.footprint.height,
    )) {
      return [];
    }

    return [
      ...(placementItem.locked
        ? []
        : [createItemSelectionKey(placementItem.instanceId)]),
      ...(placementItem.heldItem === undefined || placementItem.heldItem.locked
        ? []
        : [createItemSelectionKey(placementItem.heldItem.instanceId)]),
    ];
  });

  return [...selectedBuildingKeys, ...selectedCropKeys, ...selectedItemKeys];
}

export function selectPlacementAtTile(
  selectPlacementAtTileInput: SelectPlacementAtTileInput,
): PlacementSelectionKey | null {
  const placementSelectionKeys = orderSingleTileSelectionKeysByVisualZ(
    selectPlacementsInRectangle(
      {
        buildingMetadataById: selectPlacementAtTileInput.buildingMetadataById,
        firstTile: selectPlacementAtTileInput.cursorTile,
        placementSnapshot: selectPlacementAtTileInput.placementSnapshot,
        secondTile: selectPlacementAtTileInput.cursorTile,
      },
    ),
    selectPlacementAtTileInput.placementSnapshot,
  );

  const visuallyHighestSelectionKey = placementSelectionKeys.at(-1) ?? null;
  const currentSelectionKey = selectPlacementAtTileInput.currentSelectionKey;

  if (currentSelectionKey === undefined || currentSelectionKey === null) {
    return visuallyHighestSelectionKey;
  }

  if (typeof currentSelectionKey !== "string") {
    throw new TypeError(
      `Current selection key must be a string, null, or undefined. Received: ${describeValue(currentSelectionKey)}.`,
    );
  }

  const currentSelectionIndex = placementSelectionKeys.indexOf(currentSelectionKey);

  if (currentSelectionIndex === -1) {
    return visuallyHighestSelectionKey;
  }

  return placementSelectionKeys[
    (currentSelectionIndex - 1 + placementSelectionKeys.length) %
      placementSelectionKeys.length
  ] ?? null;
}

export function selectPlacementByKey(
  selectPlacementByKeyInput: SelectPlacementByKeyInput,
): PlacementSelectionKey | null {
  assertSelectPlacementByKeyInput(selectPlacementByKeyInput);

  if (selectPlacementByKeyInput.selectedPlacementKey === null) {
    return null;
  }

  const parsedSelectionKey = parsePlacementSelectionKey(
    selectPlacementByKeyInput.selectedPlacementKey,
  );

  if (parsedSelectionKey.kind === "item") {
    const resolvedItem = findPlacementItemOrHeldItem(
      selectPlacementByKeyInput.placementSnapshot,
      parsedSelectionKey.instanceId,
    );

    if (resolvedItem === null) {
      throw new Error(
        `Editor selection selected placement key ${describeValue(selectPlacementByKeyInput.selectedPlacementKey)} does not exist in the current placement snapshot.`,
      );
    }

    return resolvedItem.item.locked
      ? null
      : selectPlacementByKeyInput.selectedPlacementKey;
  }

  assertSelectedPlacementKeysExist(
    selectPlacementByKeyInput.placementSnapshot,
    [parsedSelectionKey],
  );
  return selectPlacementByKeyInput.selectedPlacementKey;
}

export function selectFirstSelectablePlacementKey(
  selectFirstSelectablePlacementKeyInput: SelectFirstSelectablePlacementKeyInput,
): PlacementSelectionKey | null {
  assertSelectFirstSelectablePlacementKeyInput(
    selectFirstSelectablePlacementKeyInput,
  );

  for (const placementSelectionKey of
    selectFirstSelectablePlacementKeyInput.placementSelectionKeys) {
    const selectedPlacementKey = selectPlacementByKey({
      placementSnapshot:
        selectFirstSelectablePlacementKeyInput.placementSnapshot,
      selectedPlacementKey: placementSelectionKey,
    });

    if (selectedPlacementKey !== null) {
      return selectedPlacementKey;
    }
  }

  return null;
}

function orderSingleTileSelectionKeysByVisualZ(
  placementSelectionKeys: readonly PlacementSelectionKey[],
  placementSnapshot: PlacementSnapshot,
): readonly PlacementSelectionKey[] {
  return placementSelectionKeys
    .map((placementSelectionKey, sourceIndex) => ({
      placementSelectionKey,
      sourceIndex,
      zIndex: getSelectionKeyZIndex(placementSelectionKey, placementSnapshot),
    }))
    .sort((firstSelection, secondSelection) => {
      if (firstSelection.zIndex === secondSelection.zIndex) {
        return firstSelection.sourceIndex - secondSelection.sourceIndex;
      }

      return firstSelection.zIndex - secondSelection.zIndex;
    })
    .map(({ placementSelectionKey }) => placementSelectionKey);
}

function getSelectionKeyZIndex(
  placementSelectionKey: PlacementSelectionKey,
  placementSnapshot: PlacementSnapshot,
): number {
  const parsedSelectionKey = parsePlacementSelectionKey(placementSelectionKey);

  if (parsedSelectionKey.kind === "crop") {
    const crop = placementSnapshot.crops.find(
      (placementCrop) =>
        placementCrop.x === parsedSelectionKey.coordinate.x
        && placementCrop.y === parsedSelectionKey.coordinate.y,
    );
    if (crop === undefined) {
      throw new Error(
        `Selection key crop at (${String(parsedSelectionKey.coordinate.x)}, ${String(parsedSelectionKey.coordinate.y)}) does not exist in the placement snapshot.`,
      );
    }

    if (!isGardenPotAtTile(placementSnapshot.items, crop)) {
      return Number.NEGATIVE_INFINITY;
    }

    return (crop.y + 1) * 2 - 0.5;
  }

  if (parsedSelectionKey.kind !== "item") {
    return Number.NEGATIVE_INFINITY;
  }

  const resolvedItem = getRequiredPlacementItemOrHeldItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  if (resolvedItem.kind === "item") {
    return getPlacementItemZIndex(resolvedItem.item);
  }

  return getPlacementItemZIndex(
    getRequiredPlacementItem(placementSnapshot, resolvedItem.parentInstanceId),
  ) + 0.001;
}

export function deleteSelectedPlacements(
  deleteSelectedPlacementsInput: DeleteSelectedPlacementsInput,
): DeleteSelectedPlacementsResult {
  assertDeleteSelectedPlacementsInput(deleteSelectedPlacementsInput);
  const { placementHistory, selectedPlacementKeys } = deleteSelectedPlacementsInput;

  if (selectedPlacementKeys.length === 0) {
    return {
      applied: false,
      reason: "empty-selection",
      placementHistory,
    };
  }

  const placementSnapshot = createPersistentPlacementSnapshot(
    placementHistory.currentState,
  );
  const parsedSelectionKeys = selectedPlacementKeys.map(parsePlacementSelectionKey);
  assertSelectedPlacementKeysExist(placementSnapshot, parsedSelectionKeys);
  const nextPlacementSnapshot = deletePlacementSelectionKeys(
    placementSnapshot,
    parsedSelectionKeys,
  );

  return {
    applied: true,
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
  };
}

export function getPlacementSelectionBounds(
  getPlacementSelectionBoundsInput: GetPlacementSelectionBoundsInput,
): PlacementSelectionBounds | null {
  assertGetPlacementSelectionBoundsInput(getPlacementSelectionBoundsInput);

  if (getPlacementSelectionBoundsInput.selectedPlacementKeys.length === 0) {
    return null;
  }

  const placementSnapshot = createPersistentPlacementSnapshot(
    getPlacementSelectionBoundsInput.placementSnapshot,
  );
  const parsedSelectionKeys = getPlacementSelectionBoundsInput.selectedPlacementKeys.map(
    parsePlacementSelectionKey,
  );
  assertSelectedPlacementKeysExist(placementSnapshot, parsedSelectionKeys);
  const selectedPlacementRectangles = parsedSelectionKeys.map(
    (parsedSelectionKey) =>
      createSelectedPlacementRectangle(
        placementSnapshot,
        parsedSelectionKey,
        getPlacementSelectionBoundsInput.buildingMetadataById,
      ),
  );

  return {
    maximumX: Math.max(
      ...selectedPlacementRectangles.map(
        (selectedPlacementRectangle) => selectedPlacementRectangle.maximumX,
      ),
    ),
    maximumY: Math.max(
      ...selectedPlacementRectangles.map(
        (selectedPlacementRectangle) => selectedPlacementRectangle.maximumY,
      ),
    ),
    minimumX: Math.min(
      ...selectedPlacementRectangles.map(
        (selectedPlacementRectangle) => selectedPlacementRectangle.minimumX,
      ),
    ),
    minimumY: Math.min(
      ...selectedPlacementRectangles.map(
        (selectedPlacementRectangle) => selectedPlacementRectangle.minimumY,
      ),
    ),
  };
}

export function getPlacementSelectionDetails(
  getPlacementSelectionDetailsInput: GetPlacementSelectionDetailsInput,
): PlacementSelectionDetails {
  assertGetPlacementSelectionDetailsInput(getPlacementSelectionDetailsInput);
  const placementSnapshot = createPersistentPlacementSnapshot(
    getPlacementSelectionDetailsInput.placementSnapshot,
  );
  const parsedSelectionKey = parsePlacementSelectionKey(
    getPlacementSelectionDetailsInput.selectedPlacementKey,
  );
  assertSelectedPlacementKeysExist(placementSnapshot, [parsedSelectionKey]);

  if (parsedSelectionKey.kind === "building") {
    const placementBuilding = getRequiredPlacementBuilding(
      placementSnapshot,
      parsedSelectionKey.instanceId,
    );

    const canPaint = isBuildingPaintable(placementBuilding.buildingId);
    const catalogItem = getRequiredExactCatalogItem(
      getPlacementSelectionDetailsInput.catalogItems,
      `building:${placementBuilding.buildingId}`,
    );
    const canCycleAppearance =
      catalogItem.presentationCapabilities?.variantCycle !== null &&
      catalogItem.presentationCapabilities?.variantCycle !== undefined;
    const canSetWaterColor =
      catalogItem.renderingMetadata?.kind === "building-multilayer" &&
      catalogItem.renderingMetadata.waterColors !== undefined;

    return {
      catalogItemId: `building:${placementBuilding.buildingId}`,
      canCycleAppearance,
      canPaint,
      canSetWaterColor,
      kind: "building",
      ...(canPaint
        ? {
            paintColors:
              placementBuilding.paintColors ?? createDefaultBuildingPaintColors(),
          }
        : {}),
      ...(canSetWaterColor
        ? { waterColor: placementBuilding.waterColor }
        : {}),
      selectedPlacementKey: getPlacementSelectionDetailsInput.selectedPlacementKey,
    };
  }

  if (parsedSelectionKey.kind === "crop") {
    const placementCrop = getRequiredPlacementCrop(
      placementSnapshot,
      parsedSelectionKey.coordinate,
    );

    return {
      catalogItemId: placementCrop.cropId,
      canCycleAppearance: false,
      kind: "crop",
      selectedPlacementKey: getPlacementSelectionDetailsInput.selectedPlacementKey,
    };
  }

  const resolvedItem = getRequiredPlacementItemOrHeldItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  const placementItem = resolvedItem.item;
  const selectedCatalogItem = getRequiredExactCatalogItem(
    getPlacementSelectionDetailsInput.catalogItems,
    placementItem.itemId,
  );
  const canCycleAppearance = canCyclePlacementItemAppearance(
    selectedCatalogItem,
    placementItem,
    resolvedItem.kind === "held-item",
  );

  return {
    catalogItemId: placementItem.itemId,
    canCycleAppearance,
    kind: "item",
    nightLightState: getInspectorNightLightState(
      placementItem,
      selectedCatalogItem,
    ),
    selectedPlacementKey: getPlacementSelectionDetailsInput.selectedPlacementKey,
    tintColor: placementItem.tintColor,
  };
}

function getInspectorNightLightState(
  placementItem: PlacementItem | PlacementHeldItem,
  catalogItem: CatalogItem,
): "off" | undefined {
  if (catalogItem.furnitureFire !== undefined) {
    assertNoConflictingFurnitureFireNightLightState(placementItem, catalogItem);
    return placementItem.variant === 1 ? "off" : undefined;
  }

  return placementItem.nightLightState;
}

export function getPlacementSelectionSummary(
  getPlacementSelectionSummaryInput: GetPlacementSelectionSummaryInput,
): PlacementSelectionSummary {
  assertGetPlacementSelectionSummaryInput(getPlacementSelectionSummaryInput);
  const placementSnapshot = createPersistentPlacementSnapshot(
    getPlacementSelectionSummaryInput.placementSnapshot,
  );
  const parsedSelectionKeys =
    getPlacementSelectionSummaryInput.selectedPlacementKeys.map(
      parsePlacementSelectionKey,
    );
  assertSelectedPlacementKeysExist(placementSnapshot, parsedSelectionKeys);

  return { count: parsedSelectionKeys.length };
}

export function moveSelectedPlacements(
  moveSelectedPlacementsInput: MoveSelectedPlacementsInput,
): MoveSelectedPlacementsResult {
  assertMoveSelectedPlacementsInput(moveSelectedPlacementsInput);
  const {
    freePlacement,
    placementHistory,
    selectedPlacementKeys,
    tileDelta,
  } = moveSelectedPlacementsInput;

  if (selectedPlacementKeys.length === 0) {
    return {
      applied: false,
      reason: "empty-selection",
      placementHistory,
      selectedPlacementKeys,
    };
  }

  if (tileDelta.x === 0 && tileDelta.y === 0) {
    return {
      applied: false,
      reason: "zero-delta",
      placementHistory,
      selectedPlacementKeys,
    };
  }

  const placementSnapshot = createPersistentPlacementSnapshot(
    placementHistory.currentState,
  );
  const parsedSelectionKeys = selectedPlacementKeys.map(parsePlacementSelectionKey);
  assertSelectedPlacementKeysExist(placementSnapshot, parsedSelectionKeys);
  const movementTargetSelectionKeys = createMovementTargetSelectionKeys(
    placementSnapshot,
    parsedSelectionKeys,
  );
  let validationSnapshot = deletePlacementSelectionKeys(
    placementSnapshot,
    movementTargetSelectionKeys,
  );

  for (const parsedSelectionKey of movementTargetSelectionKeys) {
    const placementCandidate = addCatalogPlacementRequirement(createMovedPlacementCandidate(
      placementSnapshot,
      parsedSelectionKey,
      tileDelta,
    ), moveSelectedPlacementsInput.catalogItems);
    const validation = validatePlacement({
      buildingMetadataById: moveSelectedPlacementsInput.buildingMetadataById,
      candidate: placementCandidate,
      freePlacement,
      mapPlacementGrid: moveSelectedPlacementsInput.mapPlacementGrid,
      placementSnapshot: validationSnapshot,
    });

    if (!validation.valid) {
      return {
        applied: false,
        validation,
        placementHistory,
        selectedPlacementKeys,
      };
    }

    validationSnapshot = applyPlacementSnapshotAction(
      validationSnapshot,
      createPlacementCandidateAction(placementCandidate),
    );
  }

  const nextPlacementSnapshot = moveSelectedPlacementRecords(
    placementSnapshot,
    movementTargetSelectionKeys,
    tileDelta,
  );

  return {
    applied: true,
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
    selectedPlacementKeys: createMovedSelectionKeys(parsedSelectionKeys, tileDelta),
  };
}

export function cycleSelectedPlacementAppearance(
  cycleSelectedPlacementAppearanceInput: CycleSelectedPlacementAppearanceInput,
): CycleSelectedPlacementAppearanceResult {
  assertCycleSelectedPlacementAppearanceInput(
    cycleSelectedPlacementAppearanceInput,
  );
  const { placementHistory, selectedPlacementKey } =
    cycleSelectedPlacementAppearanceInput;
  const placementSnapshot = createPersistentPlacementSnapshot(
    placementHistory.currentState,
  );
  const parsedSelectionKey = parsePlacementSelectionKey(selectedPlacementKey);
  assertSelectedPlacementKeysExist(placementSnapshot, [parsedSelectionKey]);

  if (parsedSelectionKey.kind === "building") {
    return cycleSelectedBuildingAppearance(
      cycleSelectedPlacementAppearanceInput,
      placementSnapshot,
      parsedSelectionKey.instanceId,
    );
  }

  if (parsedSelectionKey.kind !== "item") {
    return {
      applied: false,
      placementHistory,
      reason: "not-cycleable",
      selectedPlacementKey,
    };
  }

  const resolvedItem = getRequiredPlacementItemOrHeldItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  const placementItem = resolvedItem.item;

  const catalogItem = getRequiredExactCatalogItem(
    cycleSelectedPlacementAppearanceInput.catalogItems,
    placementItem.itemId,
  );
  const currentPresentationChoice = createPlacementItemPresentationChoice(
    placementItem,
  );
  const nextPresentationChoice = getNextPlacementItemPresentationChoice(
    catalogItem,
    currentPresentationChoice,
  );

  if (arePresentationChoicesEqual(
    currentPresentationChoice,
    nextPresentationChoice,
  )) {
    return {
      applied: false,
      placementHistory,
      reason: "not-cycleable",
      selectedPlacementKey,
    };
  }

  let nextPlacementItem = createPlacementItemWithPresentationChoice(
    catalogItem,
    placementItem,
    nextPresentationChoice,
  );

  if (resolvedItem.kind === "held-item") {
    if (
      nextPlacementItem.footprint.width !== 1 ||
      nextPlacementItem.footprint.height !== 1
    ) {
      return {
        applied: false,
        placementHistory,
        reason: "not-cycleable",
        selectedPlacementKey,
      };
    }

    const nextPlacementSnapshot = replacePlacementItemOrHeldItem(
      placementSnapshot,
      nextPlacementItem,
    );
    return {
      applied: true,
      placementHistory: commitPlacementHistory(
        placementHistory,
        nextPlacementSnapshot,
      ),
      selectedPlacementKey,
    };
  }

  nextPlacementItem = relinkHeldItemToParentOrigin(nextPlacementItem);

  if (nextPresentationChoice.rotation !== currentPresentationChoice.rotation) {
    const validationSnapshot = deletePlacementSelectionKeys(
      placementSnapshot,
      [parsedSelectionKey],
    );
    const validation = validatePlacement({
      buildingMetadataById:
        cycleSelectedPlacementAppearanceInput.buildingMetadataById,
      candidate: {
        kind: "item",
        item: nextPlacementItem,
        placementRequirement: getCatalogItemPlacementRequirement(catalogItem),
      },
      freePlacement: cycleSelectedPlacementAppearanceInput.freePlacement,
      mapPlacementGrid: cycleSelectedPlacementAppearanceInput.mapPlacementGrid,
      placementSnapshot: validationSnapshot,
    });

    if (!validation.valid) {
      return {
        applied: false,
        placementHistory,
        selectedPlacementKey,
        validation,
      };
    }
  }

  const nextPlacementSnapshot = replacePlacementItemOrHeldItem(
    placementSnapshot,
    nextPlacementItem,
  );

  return {
    applied: true,
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
    selectedPlacementKey,
  };
}

function cycleSelectedBuildingAppearance(
  cycleInput: CycleSelectedPlacementAppearanceInput,
  placementSnapshot: PlacementSnapshot,
  instanceId: number,
): CycleSelectedPlacementAppearanceResult {
  const placementBuilding = getRequiredPlacementBuilding(
    placementSnapshot,
    instanceId,
  );
  const catalogItem = getRequiredExactCatalogItem(
    cycleInput.catalogItems,
    `building:${placementBuilding.buildingId}`,
  );
  const presentationCapabilities = catalogItem.presentationCapabilities;
  if (presentationCapabilities?.variantCycle == null) {
    return {
      applied: false,
      placementHistory: cycleInput.placementHistory,
      reason: "not-cycleable",
      selectedPlacementKey: cycleInput.selectedPlacementKey,
    };
  }
  validateCatalogPresentationCapabilities(
    catalogItem.id,
    presentationCapabilities,
  );
  const variantCount = presentationCapabilities.variantCycle.count;
  const normalizedVariant = normalizeCycleVariant(
    placementBuilding.variant ?? 0,
    variantCount,
  );
  const nextPlacementSnapshot = applyPlacementSnapshotAction(
    placementSnapshot,
    {
      type: "replace-building",
      building: {
        ...placementBuilding,
        variant: (normalizedVariant + 1) % variantCount,
      },
    },
  );

  return {
    applied: true,
    placementHistory: commitPlacementHistory(
      cycleInput.placementHistory,
      nextPlacementSnapshot,
    ),
    selectedPlacementKey: cycleInput.selectedPlacementKey,
  };
}

function normalizeCycleVariant(variant: number, variantCount: number): number {
  return ((variant % variantCount) + variantCount) % variantCount;
}

function relinkHeldItemToParentOrigin(placementItem: PlacementItem): PlacementItem {
  if (placementItem.heldItem === undefined) return placementItem;

  return {
    ...placementItem,
    heldItem: {
      ...placementItem.heldItem,
      x: placementItem.x,
      y: placementItem.y,
    },
  };
}

export function setSelectedPlacementItemTint(
  setSelectedPlacementItemTintInput: SetSelectedPlacementItemTintInput,
): SetSelectedPlacementItemTintResult {
  assertSetSelectedPlacementItemTintInput(setSelectedPlacementItemTintInput);
  const { placementHistory, selectedPlacementKey, tintColor } =
    setSelectedPlacementItemTintInput;
  const placementSnapshot = createPersistentPlacementSnapshot(
    placementHistory.currentState,
  );
  const parsedSelectionKey = parsePlacementSelectionKey(selectedPlacementKey);
  assertSelectedPlacementKeysExist(placementSnapshot, [parsedSelectionKey]);

  if (parsedSelectionKey.kind !== "item") {
    throw new TypeError(
      `Editor selection selected placement key ${describeValue(selectedPlacementKey)} must refer to an item; received ${describeValue(selectedPlacementKey)}.`,
    );
  }

  const placementItem = getRequiredPlacementItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  const catalogItem = setSelectedPlacementItemTintInput.catalogItems.find(
    (candidateCatalogItem) => candidateCatalogItem.id === placementItem.itemId,
  );
  if (catalogItem?.paintableChest === undefined) {
    throw new Error(
      `Editor selection item ${describeValue(placementItem.itemId)} does not support chest paint; received catalog item ${describeValue(catalogItem)}.`,
    );
  }
  if (placementItem.tintColor === tintColor) {
    return { placementHistory, selectedPlacementKey };
  }
  const nextPlacementSnapshot = replacePlacementItemThroughSelectionBoundary(
    placementSnapshot,
    { ...placementItem, tintColor },
  );

  return {
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
    selectedPlacementKey,
  };
}

export function setSelectedPlacementBuildingPaint(
  setSelectedPlacementBuildingPaintInput: SetSelectedPlacementBuildingPaintInput,
): SetSelectedPlacementBuildingPaintResult {
  assertSetSelectedPlacementBuildingPaintInput(
    setSelectedPlacementBuildingPaintInput,
  );
  const { placementHistory, selectedPlacementKey } =
    setSelectedPlacementBuildingPaintInput;
  const paintColors = validateBuildingPaintColors(
    setSelectedPlacementBuildingPaintInput.paintColors,
  );
  const placementSnapshot = createPersistentPlacementSnapshot(
    placementHistory.currentState,
  );
  const parsedSelectionKey = parsePlacementSelectionKey(selectedPlacementKey);
  assertSelectedPlacementKeysExist(placementSnapshot, [parsedSelectionKey]);

  if (parsedSelectionKey.kind !== "building") {
    throw new TypeError(
      `Editor selection selected placement key ${describeValue(selectedPlacementKey)} must refer to a building; received ${describeValue(selectedPlacementKey)}.`,
    );
  }

  const placementBuilding = getRequiredPlacementBuilding(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );

  if (!isBuildingPaintable(placementBuilding.buildingId)) {
    throw new Error(
      `Editor selection building ${describeValue(placementBuilding.buildingId)} does not support painting.`,
    );
  }

  const nextPlacementSnapshot = applyPlacementSnapshotAction(placementSnapshot, {
    type: "replace-building",
    building: { ...placementBuilding, paintColors },
  });

  return {
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
    selectedPlacementKey,
  };
}

export function setSelectedPlacementBuildingWaterColor(
  setWaterColorInput: SetSelectedPlacementBuildingWaterColorInput,
): SetSelectedPlacementBuildingWaterColorResult {
  assertNonNullObject(setWaterColorInput, "set building water color input");
  assertNonNullObject(
    setWaterColorInput.placementHistory,
    "set building water color input.placementHistory",
  );
  assertPlacementSelectionKey(setWaterColorInput.selectedPlacementKey);
  assertCatalogItemsArray(setWaterColorInput.catalogItems);
  const placementSnapshot = createPersistentPlacementSnapshot(
    setWaterColorInput.placementHistory.currentState,
  );
  const parsedSelectionKey = parsePlacementSelectionKey(
    setWaterColorInput.selectedPlacementKey,
  );
  assertSelectedPlacementKeysExist(placementSnapshot, [parsedSelectionKey]);
  if (parsedSelectionKey.kind !== "building") {
    throw new TypeError(
      `Editor selection selected placement key ${describeValue(setWaterColorInput.selectedPlacementKey)} must refer to a building; received ${describeValue(setWaterColorInput.selectedPlacementKey)}.`,
    );
  }
  const placementBuilding = getRequiredPlacementBuilding(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  const catalogItem = getRequiredExactCatalogItem(
    setWaterColorInput.catalogItems,
    `building:${placementBuilding.buildingId}`,
  );
  if (
    catalogItem.renderingMetadata?.kind !== "building-multilayer" ||
    catalogItem.renderingMetadata.waterColors === undefined
  ) {
    throw new Error(
      `Editor selection building ${describeValue(placementBuilding.buildingId)} does not support water colors.`,
    );
  }
  const waterColor = setWaterColorInput.waterColor === undefined
    ? undefined
    : validatePlacementBuildingWaterColor(
        setWaterColorInput.waterColor,
        placementBuilding.buildingId,
        "waterColor",
      );
  const nextBuilding = { ...placementBuilding };
  if (waterColor === undefined) {
    delete nextBuilding.waterColor;
  } else {
    nextBuilding.waterColor = waterColor;
  }
  const nextPlacementSnapshot = applyPlacementSnapshotAction(
    placementSnapshot,
    { type: "replace-building", building: nextBuilding },
  );

  return {
    placementHistory: commitPlacementHistory(
      setWaterColorInput.placementHistory,
      nextPlacementSnapshot,
    ),
    selectedPlacementKey: setWaterColorInput.selectedPlacementKey,
  };
}

export function setSelectedPlacementNightLightState(
  setSelectedPlacementNightLightStateInput: SetSelectedPlacementNightLightStateInput,
): SetSelectedPlacementNightLightStateResult {
  assertSetSelectedPlacementNightLightStateInput(
    setSelectedPlacementNightLightStateInput,
  );
  const {
    catalogItems,
    nightLightState,
    placementHistory,
    selectedPlacementKey,
  } = setSelectedPlacementNightLightStateInput;
  const placementSnapshot = createPersistentPlacementSnapshot(
    placementHistory.currentState,
  );
  const parsedSelectionKey = parsePlacementSelectionKey(selectedPlacementKey);
  assertSelectedPlacementKeysExist(placementSnapshot, [parsedSelectionKey]);

  if (parsedSelectionKey.kind !== "item") {
    throw new TypeError(
      `Editor selection selected placement key ${describeValue(selectedPlacementKey)} must refer to an item; received ${describeValue(selectedPlacementKey)}.`,
    );
  }

  const placementItem = getRequiredPlacementItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  const catalogItem = assertCatalogItemIsNightLight(catalogItems, placementItem.itemId);
  assertNoConflictingFurnitureFireNightLightState(placementItem, catalogItem);

  if (
    catalogItem.furnitureFire === undefined
    && placementItem.nightLightState === nightLightState
  ) {
    return {
      applied: false,
      placementHistory,
      reason: "already-in-requested-state",
      selectedPlacementKey,
    };
  }

  const nextPlacementSnapshot = replacePlacementItemThroughSelectionBoundary(
    placementSnapshot,
    createPlacementItemWithNightLightState(
      placementItem,
      nightLightState,
      catalogItem.furnitureFire !== undefined,
    ),
  );

  return {
    applied: true,
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
    selectedPlacementKey,
  };
}

export function duplicateSelectedPlacementAtTile(
  duplicateSelectedPlacementAtTileInput: DuplicateSelectedPlacementAtTileInput,
): DuplicateSelectedPlacementAtTileResult {
  assertDuplicateSelectedPlacementAtTileInput(
    duplicateSelectedPlacementAtTileInput,
  );
  const {
    buildingMetadataById,
    cursorTile,
    freePlacement,
    mapPlacementGrid,
    placementHistory,
    selectedPlacementKey,
  } = duplicateSelectedPlacementAtTileInput;
  const placementSnapshot = createPersistentPlacementSnapshot(
    placementHistory.currentState,
  );
  const parsedSelectionKey = parsePlacementSelectionKey(selectedPlacementKey);
  assertSelectedPlacementKeysExist(placementSnapshot, [parsedSelectionKey]);
  const placementCandidate = addCatalogPlacementRequirement(createDuplicatePlacementCandidate(
    placementSnapshot,
    parsedSelectionKey,
    cursorTile,
  ), duplicateSelectedPlacementAtTileInput.catalogItems);
  const validation = validatePlacement({
    buildingMetadataById,
    candidate: placementCandidate,
    freePlacement,
    mapPlacementGrid,
    placementSnapshot,
  });

  if (!validation.valid) {
    return {
      applied: false,
      placementHistory,
      selectedPlacementKey,
      validation,
    };
  }

  const nextPlacementSnapshot = applyPlacementSnapshotAction(
    placementSnapshot,
    createPlacementCandidateAction(placementCandidate),
  );

  return {
    applied: true,
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
    selectedPlacementKey: createDuplicateSelectionKey(
      parsedSelectionKey,
      placementSnapshot,
      cursorTile,
    ),
  };
}

function createDuplicatePlacementCandidate(
  placementSnapshot: PlacementSnapshot,
  parsedSelectionKey: ParsedPlacementSelectionKey,
  cursorTile: MapTileCoordinates,
): PlacementValidationCandidate {
  if (parsedSelectionKey.kind === "building") {
    const placementBuilding = getRequiredPlacementBuilding(
      placementSnapshot,
      parsedSelectionKey.instanceId,
    );

    return {
      kind: "building",
      building: {
        ...copyNewPlacementBuildingFields(placementBuilding),
        x: cursorTile.x,
        y: cursorTile.y,
      },
    };
  }

  if (parsedSelectionKey.kind === "crop") {
    const placementCrop = getRequiredPlacementCrop(
      placementSnapshot,
      parsedSelectionKey.coordinate,
    );

    return {
      kind: "crop",
      crop: {
        cropId: placementCrop.cropId,
        x: cursorTile.x,
        y: cursorTile.y,
      },
    };
  }

  const placementItem = getRequiredPlacementItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  const duplicatedPlacementItem = {
    itemId: placementItem.itemId,
    x: cursorTile.x,
    y: cursorTile.y,
    layer: placementItem.layer,
    rotation: placementItem.rotation,
    footprint: { ...placementItem.footprint },
    variant: placementItem.variant,
    tintColor: placementItem.tintColor,
    locked: false,
    isRug: placementItem.isRug,
    isGrass: placementItem.isGrass,
    isTable: placementItem.isTable,
    isLongTable: placementItem.isLongTable,
    flipped: placementItem.flipped,
    bedType: placementItem.bedType,
    ...(placementItem.growthStage === undefined
      ? {}
      : { growthStage: placementItem.growthStage }),
    ...(placementItem.nightLightState === undefined
      ? {}
      : { nightLightState: placementItem.nightLightState }),
  };

  if (placementItem.layer === "path") {
    return { kind: "floor", item: duplicatedPlacementItem };
  }

  if (placementItem.layer === "fence") {
    return { kind: "fence", item: duplicatedPlacementItem };
  }

  return { kind: "item", item: duplicatedPlacementItem };
}

function createDuplicateSelectionKey(
  parsedSelectionKey: ParsedPlacementSelectionKey,
  placementSnapshot: PlacementSnapshot,
  cursorTile: MapTileCoordinates,
): PlacementSelectionKey {
  if (parsedSelectionKey.kind === "building") {
    return createBuildingSelectionKey(placementSnapshot.nextBuildingId);
  }

  if (parsedSelectionKey.kind === "crop") {
    return createCropSelectionKey(cursorTile.x, cursorTile.y);
  }

  return createItemSelectionKey(placementSnapshot.nextItemId);
}

function createPlacementItemPresentationChoice(
  placementItem: PlacementItem,
): CatalogPresentationChoice {
  return {
    flipped: placementItem.flipped,
    rotation: placementItem.rotation,
    variant: placementItem.variant,
  };
}

function getNextPlacementItemPresentationChoice(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
): CatalogPresentationChoice {
  if (catalogItem.presentationCapabilities === undefined) {
    return presentationChoice;
  }
  const presentationCapabilities = validateCatalogPresentationCapabilities(
    catalogItem.id,
    catalogItem.presentationCapabilities,
  );
  if (presentationCapabilities.variantCycle !== null) {
    assertActivePresentationChoiceIndex(
      catalogItem.id,
      "variant",
      presentationChoice.variant,
      presentationCapabilities.variantCycle.count,
    );
    return {
      ...presentationChoice,
      variant:
        (presentationChoice.variant + 1) %
        presentationCapabilities.variantCycle.count,
    };
  }
  if (
    presentationCapabilities.rotation !== null &&
    presentationCapabilities.rotation.count > 1
  ) {
    assertActivePresentationChoiceIndex(
      catalogItem.id,
      "rotation",
      presentationChoice.rotation,
      presentationCapabilities.rotation.count,
    );
    return {
      ...presentationChoice,
      rotation:
        (presentationChoice.rotation + 1) %
        presentationCapabilities.rotation.count,
    };
  }

  return presentationChoice;
}

function assertActivePresentationChoiceIndex(
  catalogItemId: string,
  axisName: "rotation" | "variant",
  axisValue: number,
  axisCount: number,
): void {
  if (
    !Number.isSafeInteger(axisValue) ||
    axisValue < 0 ||
    axisValue >= axisCount
  ) {
    throw new RangeError(
      `Editor selection catalog item ${describeValue(catalogItemId)} ${axisName} must be a safe integer from 0 through ${String(axisCount - 1)}; received ${describeValue(axisValue)}.`,
    );
  }
}

function canCyclePlacementItemAppearance(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  requiresOneByOneFootprint: boolean,
): boolean {
  const currentChoice = createPlacementItemPresentationChoice(placementItem);
  const nextChoice = getNextPlacementItemPresentationChoice(
    catalogItem,
    currentChoice,
  );

  if (arePresentationChoicesEqual(currentChoice, nextChoice)) return false;
  if (!requiresOneByOneFootprint) return true;

  const nextPlacementItem = createPlacementItemWithPresentationChoice(
    catalogItem,
    placementItem,
    nextChoice,
  );
  return nextPlacementItem.footprint.width === 1 &&
    nextPlacementItem.footprint.height === 1;
}

function arePresentationChoicesEqual(
  firstChoice: CatalogPresentationChoice,
  secondChoice: CatalogPresentationChoice,
): boolean {
  return firstChoice.flipped === secondChoice.flipped &&
    firstChoice.rotation === secondChoice.rotation &&
    firstChoice.variant === secondChoice.variant;
}

function createPlacementItemWithPresentationChoice(
  catalogItem: CatalogItem,
  placementItem: PlacementItem,
  presentationChoice: CatalogPresentationChoice,
): PlacementItem {
  if (presentationChoice.rotation === placementItem.rotation) {
    return {
      ...placementItem,
      flipped: presentationChoice.flipped,
      variant: presentationChoice.variant,
    };
  }

  const rotationFootprint =
    catalogItem.presentationCapabilities?.rotation?.footprints[
      presentationChoice.rotation
    ];
  if (rotationFootprint === undefined) {
    throw new Error(
      `Editor selection catalog item ${describeValue(catalogItem.id)} is missing footprint for rotation ${describeValue(presentationChoice.rotation)}; received ${describeValue(catalogItem.presentationCapabilities?.rotation?.footprints)}.`,
    );
  }

  return {
    ...placementItem,
    flipped: presentationChoice.flipped,
    footprint: rotationFootprint,
    rotation: presentationChoice.rotation,
    variant: presentationChoice.variant,
  };
}

function getRequiredExactCatalogItem(
  catalogItems: readonly CatalogItem[],
  catalogItemId: string,
): CatalogItem {
  const matchingCatalogItems = catalogItems.filter(
    (catalogItem) => catalogItem.id === catalogItemId,
  );

  if (matchingCatalogItems.length !== 1) {
    throw new Error(
      `Editor selection catalog item ${describeValue(catalogItemId)} must have exactly one match; received ${describeValue(matchingCatalogItems.length)} matches.`,
    );
  }

  const catalogItem = matchingCatalogItems[0];
  if (catalogItem === undefined) {
    throw new Error(
      `Editor selection catalog item ${describeValue(catalogItemId)} must have exactly one match; received 0 matches.`,
    );
  }

  return catalogItem;
}

function addCatalogPlacementRequirement(
  placementCandidate: PlacementValidationCandidate,
  catalogItems: readonly CatalogItem[] | undefined,
): PlacementValidationCandidate {
  if (placementCandidate.kind !== "item") {
    return placementCandidate;
  }

  if (catalogItems === undefined) {
    throw new Error(
      `Editor selection item ${describeValue(placementCandidate.item.itemId)} requires catalog items to resolve its placement requirement.`,
    );
  }

  const catalogItem = getRequiredExactCatalogItem(
    catalogItems,
    placementCandidate.item.itemId,
  );
  return {
    ...placementCandidate,
    placementRequirement: getCatalogItemPlacementRequirement(catalogItem),
  };
}

function createMovedPlacementCandidate(
  placementSnapshot: PlacementSnapshot,
  parsedSelectionKey: ParsedPlacementSelectionKey,
  tileDelta: Readonly<{ x: number; y: number }>,
): PlacementValidationCandidate {
  if (parsedSelectionKey.kind === "building") {
    const placementBuilding = getRequiredPlacementBuilding(
      placementSnapshot,
      parsedSelectionKey.instanceId,
    );

    return {
      kind: "building",
      building: {
        ...copyNewPlacementBuildingFields(placementBuilding),
        x: placementBuilding.x + tileDelta.x,
        y: placementBuilding.y + tileDelta.y,
      },
    };
  }

  if (parsedSelectionKey.kind === "crop") {
    const placementCrop = getRequiredPlacementCrop(
      placementSnapshot,
      parsedSelectionKey.coordinate,
    );

    return {
      kind: "crop",
      crop: {
        cropId: placementCrop.cropId,
        x: placementCrop.x + tileDelta.x,
        y: placementCrop.y + tileDelta.y,
      },
    };
  }

  const placementItem = getRequiredPlacementItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  const movedItem = {
    ...placementItem,
    x: placementItem.x + tileDelta.x,
    y: placementItem.y + tileDelta.y,
  };
  const {
    heldItem: _heldItem,
    heldItemId: _heldItemId,
    instanceId: _instanceId,
    ...newPlacementItem
  } = movedItem;

  if (placementItem.layer === "path") {
    return { kind: "floor", item: newPlacementItem };
  }

  if (placementItem.layer === "fence") {
    return { kind: "fence", item: newPlacementItem };
  }

  return { kind: "item", item: newPlacementItem };
}

function copyNewPlacementBuildingFields(
  placementBuilding: PlacementBuilding,
): Omit<PlacementBuilding, "instanceId" | "x" | "y"> {
  const { instanceId: _instanceId, x: _x, y: _y, ...buildingFields } =
    placementBuilding;

  return buildingFields;
}

function createSelectedPlacementRectangle(
  placementSnapshot: PlacementSnapshot,
  parsedSelectionKey: ParsedPlacementSelectionKey,
  buildingMetadataById: BuildingPlacementMetadataById,
): PlacementSelectionBounds {
  if (parsedSelectionKey.kind === "building") {
    const placementBuilding = getRequiredPlacementBuilding(
      placementSnapshot,
      parsedSelectionKey.instanceId,
    );
    const buildingMetadata = buildingMetadataById[placementBuilding.buildingId];

    if (buildingMetadata === undefined) {
      throw new Error(
        `Editor selection received unknown building metadata ID ${describeValue(placementBuilding.buildingId)}.`,
      );
    }

    return createPlacementBounds(
      placementBuilding.x,
      placementBuilding.y,
      buildingMetadata.size.width,
      buildingMetadata.size.height,
    );
  }

  if (parsedSelectionKey.kind === "crop") {
    return createPlacementBounds(
      parsedSelectionKey.coordinate.x,
      parsedSelectionKey.coordinate.y,
      1,
      1,
    );
  }

  const resolvedItem = getRequiredPlacementItemOrHeldItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  const placementItem = resolvedItem.item;

  if (resolvedItem.kind === "held-item") {
    const parentItem = getRequiredPlacementItem(
      placementSnapshot,
      resolvedItem.parentInstanceId,
    );
    return createPlacementBounds(
      parentItem.x,
      parentItem.y,
      parentItem.footprint.width,
      parentItem.footprint.height,
    );
  }

  return createPlacementBounds(
    placementItem.x,
    placementItem.y,
    placementItem.footprint.width,
    placementItem.footprint.height,
  );
}

function createPlacementBounds(
  x: number,
  y: number,
  width: number,
  height: number,
): PlacementSelectionBounds {
  return {
    maximumX: x + width - 1,
    maximumY: y + height - 1,
    minimumX: x,
    minimumY: y,
  };
}

function createPlacementCandidateAction(
  placementCandidate: PlacementValidationCandidate,
): PlacementSnapshotAction {
  if (placementCandidate.kind === "building") {
    return { type: "add-building", building: placementCandidate.building };
  }

  if (placementCandidate.kind === "crop") {
    return { type: "add-crop", crop: placementCandidate.crop };
  }

  return { type: "add-item", item: placementCandidate.item };
}

function moveSelectedPlacementRecords(
  placementSnapshot: PlacementSnapshot,
  parsedSelectionKeys: readonly ParsedPlacementSelectionKey[],
  tileDelta: Readonly<{ x: number; y: number }>,
): PlacementSnapshot {
  const selectedBuildingInstanceIds = new Set(
    parsedSelectionKeys.flatMap((parsedSelectionKey) =>
      parsedSelectionKey.kind === "building"
        ? [parsedSelectionKey.instanceId]
        : [],
    ),
  );
  const selectedCropCoordinateKeys = new Set(
    parsedSelectionKeys.flatMap((parsedSelectionKey) =>
      parsedSelectionKey.kind === "crop"
        ? [createCropSelectionKey(
            parsedSelectionKey.coordinate.x,
            parsedSelectionKey.coordinate.y,
          )]
        : [],
    ),
  );
  const selectedItemInstanceIds = new Set(
    parsedSelectionKeys.flatMap((parsedSelectionKey) =>
      parsedSelectionKey.kind === "item" ? [parsedSelectionKey.instanceId] : [],
    ),
  );

  return createPersistentPlacementSnapshot({
    ...placementSnapshot,
    buildings: placementSnapshot.buildings.map((placementBuilding) =>
      selectedBuildingInstanceIds.has(placementBuilding.instanceId)
        ? {
            ...placementBuilding,
            x: placementBuilding.x + tileDelta.x,
            y: placementBuilding.y + tileDelta.y,
          }
        : placementBuilding,
    ),
    crops: placementSnapshot.crops.map((placementCrop) =>
      selectedCropCoordinateKeys.has(
        createCropSelectionKey(placementCrop.x, placementCrop.y),
      )
        ? {
            ...placementCrop,
            x: placementCrop.x + tileDelta.x,
            y: placementCrop.y + tileDelta.y,
          }
        : placementCrop,
    ),
    items: placementSnapshot.items.map((placementItem) =>
      selectedItemInstanceIds.has(placementItem.instanceId)
        ? movePlacementItemAndHeldItem(placementItem, tileDelta)
        : placementItem,
    ),
  });
}

function createMovementTargetSelectionKeys(
  placementSnapshot: PlacementSnapshot,
  parsedSelectionKeys: readonly ParsedPlacementSelectionKey[],
): readonly ParsedPlacementSelectionKey[] {
  const movementTargetSelectionKeys: ParsedPlacementSelectionKey[] = [];
  const seenSelectionKeys = new Set<string>();

  for (const parsedSelectionKey of parsedSelectionKeys) {
    const movementTargetSelectionKey = parsedSelectionKey.kind !== "item"
      ? parsedSelectionKey
      : createParentItemSelectionTarget(placementSnapshot, parsedSelectionKey);
    const serializedSelectionKey = movementTargetSelectionKey.kind === "building"
      ? createBuildingSelectionKey(movementTargetSelectionKey.instanceId)
      : movementTargetSelectionKey.kind === "item"
        ? createItemSelectionKey(movementTargetSelectionKey.instanceId)
        : createCropSelectionKey(
            movementTargetSelectionKey.coordinate.x,
            movementTargetSelectionKey.coordinate.y,
          );

    if (!seenSelectionKeys.has(serializedSelectionKey)) {
      seenSelectionKeys.add(serializedSelectionKey);
      movementTargetSelectionKeys.push(movementTargetSelectionKey);
    }
  }

  return movementTargetSelectionKeys;
}

function createParentItemSelectionTarget(
  placementSnapshot: PlacementSnapshot,
  parsedSelectionKey: Extract<ParsedPlacementSelectionKey, { kind: "item" }>,
): Extract<ParsedPlacementSelectionKey, { kind: "item" }> {
  const resolvedItem = getRequiredPlacementItemOrHeldItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );
  return resolvedItem.kind === "held-item"
    ? { kind: "item", instanceId: resolvedItem.parentInstanceId }
    : parsedSelectionKey;
}

function movePlacementItemAndHeldItem(
  placementItem: PlacementItem,
  tileDelta: Readonly<{ x: number; y: number }>,
): PlacementItem {
  const x = placementItem.x + tileDelta.x;
  const y = placementItem.y + tileDelta.y;
  return {
    ...placementItem,
    x,
    y,
    ...(placementItem.heldItem === undefined
      ? {}
      : { heldItem: { ...placementItem.heldItem, x, y } }),
  };
}

function createMovedSelectionKeys(
  parsedSelectionKeys: readonly ParsedPlacementSelectionKey[],
  tileDelta: Readonly<{ x: number; y: number }>,
): readonly PlacementSelectionKey[] {
  return parsedSelectionKeys.map((parsedSelectionKey) => {
    if (parsedSelectionKey.kind === "building") {
      return createBuildingSelectionKey(parsedSelectionKey.instanceId);
    }

    if (parsedSelectionKey.kind === "item") {
      return createItemSelectionKey(parsedSelectionKey.instanceId);
    }

    return createCropSelectionKey(
      parsedSelectionKey.coordinate.x + tileDelta.x,
      parsedSelectionKey.coordinate.y + tileDelta.y,
    );
  });
}

function getRequiredPlacementBuilding(
  placementSnapshot: PlacementSnapshot,
  instanceId: number,
): PlacementBuilding {
  const placementBuilding = placementSnapshot.buildings.find(
    (candidatePlacementBuilding) =>
      candidatePlacementBuilding.instanceId === instanceId,
  );

  if (placementBuilding === undefined) {
    throw new Error(
      `Editor selection could not find building instance ID ${describeValue(instanceId)} after validation.`,
    );
  }

  return placementBuilding;
}

function getRequiredPlacementCrop(
  placementSnapshot: PlacementSnapshot,
  coordinate: MapTileCoordinates,
): PlacementCrop {
  const placementCrop = placementSnapshot.crops.find(
    (candidatePlacementCrop) =>
      candidatePlacementCrop.x === coordinate.x &&
      candidatePlacementCrop.y === coordinate.y,
  );

  if (placementCrop === undefined) {
    throw new Error(
      `Editor selection could not find crop at coordinate ${describeValue(coordinate)} after validation.`,
    );
  }

  return placementCrop;
}

function getRequiredPlacementItem(
  placementSnapshot: PlacementSnapshot,
  instanceId: number,
): PlacementItem {
  const resolvedItem = getRequiredPlacementItemOrHeldItem(
    placementSnapshot,
    instanceId,
  );
  return resolvedItem.item;
}

function getRequiredPlacementItemOrHeldItem(
  placementSnapshot: PlacementSnapshot,
  instanceId: number,
): PlacementItemOrHeldItem {
  const resolvedItem = findPlacementItemOrHeldItem(placementSnapshot, instanceId);

  if (resolvedItem === null) {
    throw new Error(
      `Editor selection could not find item instance ID ${describeValue(instanceId)} after validation.`,
    );
  }

  return resolvedItem;
}

function replacePlacementItemThroughSelectionBoundary(
  placementSnapshot: PlacementSnapshot,
  replacementItem: PlacementItem,
): PlacementSnapshot {
  const resolvedItem = getRequiredPlacementItemOrHeldItem(
    placementSnapshot,
    replacementItem.instanceId,
  );
  if (resolvedItem.kind === "held-item") {
    return replacePlacementItemOrHeldItem(placementSnapshot, replacementItem);
  }

  return applyPlacementSnapshotAction(placementSnapshot, {
    type: "replace-item",
    item: replacementItem,
  });
}

function createSelectionRectangle(
  firstTile: MapTileCoordinates,
  secondTile: MapTileCoordinates,
): SelectionRectangle {
  return {
    maximumX: Math.max(firstTile.x, secondTile.x),
    maximumY: Math.max(firstTile.y, secondTile.y),
    minimumX: Math.min(firstTile.x, secondTile.x),
    minimumY: Math.min(firstTile.y, secondTile.y),
  };
}

function selectBuildingKeys(
  placementSnapshot: PlacementSnapshot,
  selectionRectangle: SelectionRectangle,
  buildingMetadataById: BuildingPlacementMetadataById,
): readonly PlacementSelectionKey[] {
  return placementSnapshot.buildings.flatMap((placementBuilding) => {
    const buildingMetadata = buildingMetadataById[placementBuilding.buildingId];

    if (buildingMetadata === undefined) {
      throw new Error(
        `Editor selection received unknown building metadata ID ${describeValue(placementBuilding.buildingId)}.`,
      );
    }

    return doesRectangleIntersectSelectionRectangle(
      selectionRectangle,
      placementBuilding.x,
      placementBuilding.y,
      buildingMetadata.size.width,
      buildingMetadata.size.height,
    )
      ? [createBuildingSelectionKey(placementBuilding.instanceId)]
      : [];
  });
}

function doesRectangleIntersectSelectionRectangle(
  selectionRectangle: SelectionRectangle,
  placementX: number,
  placementY: number,
  placementWidth: number,
  placementHeight: number,
): boolean {
  return (
    placementX <= selectionRectangle.maximumX &&
    placementX + placementWidth > selectionRectangle.minimumX &&
    placementY <= selectionRectangle.maximumY &&
    placementY + placementHeight > selectionRectangle.minimumY
  );
}

function isCoordinateInsideSelectionRectangle(
  selectionRectangle: SelectionRectangle,
  placementCoordinate: MapTileCoordinates,
): boolean {
  return (
    placementCoordinate.x >= selectionRectangle.minimumX &&
    placementCoordinate.x <= selectionRectangle.maximumX &&
    placementCoordinate.y >= selectionRectangle.minimumY &&
    placementCoordinate.y <= selectionRectangle.maximumY
  );
}

function createBuildingSelectionKey(instanceId: number): PlacementSelectionKey {
  return `building:${String(instanceId)}`;
}

function createCropSelectionKey(x: number, y: number): PlacementSelectionKey {
  return `crop:${String(x)},${String(y)}`;
}

function createItemSelectionKey(instanceId: number): PlacementSelectionKey {
  return `item:${String(instanceId)}`;
}

function parsePlacementSelectionKey(
  placementSelectionKey: PlacementSelectionKey,
): ParsedPlacementSelectionKey {
  if (placementSelectionKey.startsWith("building:")) {
    return {
      kind: "building",
      instanceId: readPositiveSafeIntegerFromSelectionKey(
        placementSelectionKey,
        "building:",
      ),
    };
  }

  if (placementSelectionKey.startsWith("item:")) {
    return {
      kind: "item",
      instanceId: readPositiveSafeIntegerFromSelectionKey(
        placementSelectionKey,
        "item:",
      ),
    };
  }

  if (placementSelectionKey.startsWith("crop:")) {
    return {
      kind: "crop",
      coordinate: readCropCoordinateFromSelectionKey(placementSelectionKey),
    };
  }

  throw new TypeError(
    `Editor selection key must begin with "building:", "crop:", or "item:"; received ${describeValue(placementSelectionKey)}.`,
  );
}

function readPositiveSafeIntegerFromSelectionKey(
  placementSelectionKey: PlacementSelectionKey,
  prefix: "building:" | "item:",
): number {
  const identifierText = placementSelectionKey.slice(prefix.length);
  const instanceId = Number(identifierText);

  if (
    !Number.isSafeInteger(instanceId) ||
    instanceId <= 0 ||
    String(instanceId) !== identifierText
  ) {
    throw new TypeError(
      `Editor selection key ${describeValue(placementSelectionKey)} must contain a positive safe integer after ${describeValue(prefix)}.`,
    );
  }

  return instanceId;
}

function readCropCoordinateFromSelectionKey(
  placementSelectionKey: PlacementSelectionKey,
): MapTileCoordinates {
  const coordinateTexts = placementSelectionKey.slice("crop:".length).split(",");

  if (coordinateTexts.length !== 2) {
    throw new TypeError(
      `Editor selection crop key must contain exactly two comma-separated coordinates; received ${describeValue(placementSelectionKey)}.`,
    );
  }

  const [xText, yText] = coordinateTexts;
  const x = Number(xText);
  const y = Number(yText);

  if (
    xText === undefined ||
    yText === undefined ||
    !Number.isSafeInteger(x) ||
    !Number.isSafeInteger(y) ||
    x < 0 ||
    y < 0 ||
    String(x) !== xText ||
    String(y) !== yText
  ) {
    throw new TypeError(
      `Editor selection crop key must contain two non-negative safe integer coordinates; received ${describeValue(placementSelectionKey)}.`,
    );
  }

  return { x, y };
}

function assertSelectedPlacementKeysExist(
  placementSnapshot: PlacementSnapshot,
  parsedSelectionKeys: readonly ParsedPlacementSelectionKey[],
): void {
  for (const parsedSelectionKey of parsedSelectionKeys) {
    if (parsedSelectionKey.kind === "building") {
      if (
        !placementSnapshot.buildings.some(
          (placementBuilding) =>
            placementBuilding.instanceId === parsedSelectionKey.instanceId,
        )
      ) {
        throw new Error(
          `Editor selection selected placement key ${describeValue(createBuildingSelectionKey(parsedSelectionKey.instanceId))} does not exist in the current placement snapshot.`,
        );
      }
      continue;
    }

    if (parsedSelectionKey.kind === "item") {
      const resolvedItem = findPlacementItemOrHeldItem(
        placementSnapshot,
        parsedSelectionKey.instanceId,
      );

      if (resolvedItem === null) {
        throw new Error(
          `Editor selection selected placement key ${describeValue(createItemSelectionKey(parsedSelectionKey.instanceId))} does not exist in the current placement snapshot.`,
        );
      }

      if (resolvedItem.item.locked) {
        throw new Error(
          `Editor selection selected placement key ${describeValue(createItemSelectionKey(parsedSelectionKey.instanceId))} resolves to a locked item.`,
        );
      }
      continue;
    }

    if (
      !placementSnapshot.crops.some(
        (placementCrop) =>
          placementCrop.x === parsedSelectionKey.coordinate.x &&
          placementCrop.y === parsedSelectionKey.coordinate.y,
      )
    ) {
      throw new Error(
        `Editor selection selected placement key ${describeValue(createCropSelectionKey(parsedSelectionKey.coordinate.x, parsedSelectionKey.coordinate.y))} does not exist in the current placement snapshot.`,
      );
    }
  }
}

function deletePlacementSelectionKeys(
  placementSnapshot: PlacementSnapshot,
  parsedSelectionKeys: readonly ParsedPlacementSelectionKey[],
): PlacementSnapshot {
  let nextPlacementSnapshot = placementSnapshot;
  const selectedTopLevelItemInstanceIds = new Set(
    parsedSelectionKeys.flatMap((parsedSelectionKey) => {
      if (parsedSelectionKey.kind !== "item") return [];
      const resolvedItem = getRequiredPlacementItemOrHeldItem(
        placementSnapshot,
        parsedSelectionKey.instanceId,
      );
      return resolvedItem.kind === "item" ? [resolvedItem.item.instanceId] : [];
    }),
  );

  for (const parsedSelectionKey of parsedSelectionKeys) {
    if (parsedSelectionKey.kind === "building") {
      nextPlacementSnapshot = applyPlacementSnapshotAction(nextPlacementSnapshot, {
        type: "delete-building",
        instanceId: parsedSelectionKey.instanceId,
      });
      continue;
    }

    if (parsedSelectionKey.kind === "item") {
      const resolvedItem = getRequiredPlacementItemOrHeldItem(
        placementSnapshot,
        parsedSelectionKey.instanceId,
      );
      if (
        resolvedItem.kind === "held-item" &&
        selectedTopLevelItemInstanceIds.has(resolvedItem.parentInstanceId)
      ) {
        continue;
      }
      nextPlacementSnapshot = deletePlacementItemOrHeldItem(
        nextPlacementSnapshot,
        parsedSelectionKey.instanceId,
      );
      continue;
    }

    nextPlacementSnapshot = applyPlacementSnapshotAction(nextPlacementSnapshot, {
      type: "delete-crop",
      coordinate: parsedSelectionKey.coordinate,
    });
  }

  return nextPlacementSnapshot;
}

function assertSelectPlacementsInRectangleInput(
  selectPlacementsInRectangleInput: SelectPlacementsInRectangleInput,
): void {
  assertNonNullObject(selectPlacementsInRectangleInput, "rectangle input");
  assertMapTile(selectPlacementsInRectangleInput.firstTile, "firstTile");
  assertMapTile(selectPlacementsInRectangleInput.secondTile, "secondTile");
  assertNonNullObject(
    selectPlacementsInRectangleInput.buildingMetadataById,
    "buildingMetadataById",
  );
  createPersistentPlacementSnapshot(
    selectPlacementsInRectangleInput.placementSnapshot,
  );
}

function assertSelectPlacementByKeyInput(
  selectPlacementByKeyInput: SelectPlacementByKeyInput,
): void {
  assertNonNullObject(selectPlacementByKeyInput, "direct selection input");
  createPersistentPlacementSnapshot(selectPlacementByKeyInput.placementSnapshot);

  if (selectPlacementByKeyInput.selectedPlacementKey !== null) {
    assertPlacementSelectionKey(selectPlacementByKeyInput.selectedPlacementKey);
  }
}

function assertSelectFirstSelectablePlacementKeyInput(
  selectFirstSelectablePlacementKeyInput: SelectFirstSelectablePlacementKeyInput,
): void {
  assertNonNullObject(
    selectFirstSelectablePlacementKeyInput,
    "direct selection candidates input",
  );
  createPersistentPlacementSnapshot(
    selectFirstSelectablePlacementKeyInput.placementSnapshot,
  );

  if (!Array.isArray(selectFirstSelectablePlacementKeyInput.placementSelectionKeys)) {
    throw new TypeError(
      `Editor selection candidate keys must be an array; received ${describeValue(selectFirstSelectablePlacementKeyInput.placementSelectionKeys)}.`,
    );
  }

  for (const placementSelectionKey of
    selectFirstSelectablePlacementKeyInput.placementSelectionKeys) {
    assertPlacementSelectionKey(placementSelectionKey);
  }
}

function assertDeleteSelectedPlacementsInput(
  deleteSelectedPlacementsInput: DeleteSelectedPlacementsInput,
): void {
  assertNonNullObject(deleteSelectedPlacementsInput, "delete input");
  assertNonNullObject(
    deleteSelectedPlacementsInput.placementHistory,
    "placementHistory",
  );
  createPersistentPlacementSnapshot(
    deleteSelectedPlacementsInput.placementHistory.currentState,
  );
  assertUniqueSelectionKeys(deleteSelectedPlacementsInput.selectedPlacementKeys);
}

function assertGetPlacementSelectionSummaryInput(
  getPlacementSelectionSummaryInput: GetPlacementSelectionSummaryInput,
): void {
  assertNonNullObject(getPlacementSelectionSummaryInput, "selection summary input");
  createPersistentPlacementSnapshot(
    getPlacementSelectionSummaryInput.placementSnapshot,
  );
  assertUniqueSelectionKeys(getPlacementSelectionSummaryInput.selectedPlacementKeys);
}

function assertUniqueSelectionKeys(
  selectedPlacementKeys: readonly PlacementSelectionKey[],
): void {
  if (!Array.isArray(selectedPlacementKeys)) {
    throw new TypeError(
      `Editor selection selectedPlacementKeys must be an array; received ${describeValue(selectedPlacementKeys)}.`,
    );
  }

  const uniqueSelectionKeys = new Set(selectedPlacementKeys);

  if (uniqueSelectionKeys.size !== selectedPlacementKeys.length) {
    throw new Error(
      `Editor selection selectedPlacementKeys must not contain duplicates; received ${describeValue(selectedPlacementKeys)}.`,
    );
  }
}

function assertGetPlacementSelectionBoundsInput(
  getPlacementSelectionBoundsInput: GetPlacementSelectionBoundsInput,
): void {
  assertNonNullObject(getPlacementSelectionBoundsInput, "selection bounds input");
  assertNonNullObject(
    getPlacementSelectionBoundsInput.buildingMetadataById,
    "buildingMetadataById",
  );
  createPersistentPlacementSnapshot(
    getPlacementSelectionBoundsInput.placementSnapshot,
  );

  if (!Array.isArray(getPlacementSelectionBoundsInput.selectedPlacementKeys)) {
    throw new TypeError(
      `Editor selection selectedPlacementKeys must be an array; received ${describeValue(getPlacementSelectionBoundsInput.selectedPlacementKeys)}.`,
    );
  }
}

function assertGetPlacementSelectionDetailsInput(
  getPlacementSelectionDetailsInput: GetPlacementSelectionDetailsInput,
): void {
  assertNonNullObject(getPlacementSelectionDetailsInput, "selection details input");
  createPersistentPlacementSnapshot(
    getPlacementSelectionDetailsInput.placementSnapshot,
  );
  assertCatalogItemsArray(getPlacementSelectionDetailsInput.catalogItems);
  assertPlacementSelectionKey(
    getPlacementSelectionDetailsInput.selectedPlacementKey,
  );
}

function assertMoveSelectedPlacementsInput(
  moveSelectedPlacementsInput: MoveSelectedPlacementsInput,
): void {
  assertNonNullObject(moveSelectedPlacementsInput, "move input");
  assertDeleteSelectedPlacementsInput({
    placementHistory: moveSelectedPlacementsInput.placementHistory,
    selectedPlacementKeys: moveSelectedPlacementsInput.selectedPlacementKeys,
  });
  assertNonNullObject(
    moveSelectedPlacementsInput.buildingMetadataById,
    "buildingMetadataById",
  );
  assertNonNullObject(moveSelectedPlacementsInput.mapPlacementGrid, "mapPlacementGrid");
  assertNonNullObject(moveSelectedPlacementsInput.tileDelta, "tileDelta");
  assertSafeInteger(moveSelectedPlacementsInput.tileDelta.x, "tileDelta.x");
  assertSafeInteger(moveSelectedPlacementsInput.tileDelta.y, "tileDelta.y");

  if (
    moveSelectedPlacementsInput.freePlacement !== undefined &&
    typeof moveSelectedPlacementsInput.freePlacement !== "boolean"
  ) {
    throw new TypeError(
      `Editor selection freePlacement must be a boolean or undefined; received ${describeValue(moveSelectedPlacementsInput.freePlacement)}.`,
    );
  }
}

function assertCycleSelectedPlacementAppearanceInput(
  cycleSelectedPlacementAppearanceInput: CycleSelectedPlacementAppearanceInput,
): void {
  assertNonNullObject(
    cycleSelectedPlacementAppearanceInput,
    "appearance cycle input",
  );
  assertNonNullObject(
    cycleSelectedPlacementAppearanceInput.buildingMetadataById,
    "buildingMetadataById",
  );
  assertCatalogItemsArray(cycleSelectedPlacementAppearanceInput.catalogItems);
  assertNonNullObject(
    cycleSelectedPlacementAppearanceInput.mapPlacementGrid,
    "mapPlacementGrid",
  );
  assertNonNullObject(
    cycleSelectedPlacementAppearanceInput.placementHistory,
    "placementHistory",
  );
  createPersistentPlacementSnapshot(
    cycleSelectedPlacementAppearanceInput.placementHistory.currentState,
  );
  assertPlacementSelectionKey(
    cycleSelectedPlacementAppearanceInput.selectedPlacementKey,
  );
  if (
    cycleSelectedPlacementAppearanceInput.freePlacement !== undefined &&
    typeof cycleSelectedPlacementAppearanceInput.freePlacement !== "boolean"
  ) {
    throw new TypeError(
      `Editor selection freePlacement must be a boolean or undefined; received ${describeValue(cycleSelectedPlacementAppearanceInput.freePlacement)}.`,
    );
  }
}

function assertCatalogItemsArray(catalogItems: readonly CatalogItem[]): void {
  if (!Array.isArray(catalogItems)) {
    throw new TypeError(
      `Editor selection catalogItems must be an array; received ${describeValue(catalogItems)}.`,
    );
  }
}

function assertSetSelectedPlacementItemTintInput(
  setSelectedPlacementItemTintInput: SetSelectedPlacementItemTintInput,
): void {
  assertNonNullObject(setSelectedPlacementItemTintInput, "set tint input");
  assertNonNullObject(
    setSelectedPlacementItemTintInput.placementHistory,
    "set tint input.placementHistory",
  );
  createPersistentPlacementSnapshot(
    setSelectedPlacementItemTintInput.placementHistory.currentState,
  );
  assertPlacementSelectionKey(
    setSelectedPlacementItemTintInput.selectedPlacementKey,
  );
  assertCatalogItemsArray(setSelectedPlacementItemTintInput.catalogItems);
}

function assertSetSelectedPlacementBuildingPaintInput(
  setSelectedPlacementBuildingPaintInput: SetSelectedPlacementBuildingPaintInput,
): void {
  assertNonNullObject(setSelectedPlacementBuildingPaintInput, "set building paint input");
  assertNonNullObject(
    setSelectedPlacementBuildingPaintInput.placementHistory,
    "set building paint input.placementHistory",
  );
  createPersistentPlacementSnapshot(
    setSelectedPlacementBuildingPaintInput.placementHistory.currentState,
  );
  assertPlacementSelectionKey(
    setSelectedPlacementBuildingPaintInput.selectedPlacementKey,
  );
  validateBuildingPaintColors(setSelectedPlacementBuildingPaintInput.paintColors);
}

function assertSetSelectedPlacementNightLightStateInput(
  setSelectedPlacementNightLightStateInput: SetSelectedPlacementNightLightStateInput,
): void {
  assertNonNullObject(
    setSelectedPlacementNightLightStateInput,
    "set night light input",
  );
  assertNonNullObject(
    setSelectedPlacementNightLightStateInput.placementHistory,
    "set night light input.placementHistory",
  );
  createPersistentPlacementSnapshot(
    setSelectedPlacementNightLightStateInput.placementHistory.currentState,
  );
  assertPlacementSelectionKey(
    setSelectedPlacementNightLightStateInput.selectedPlacementKey,
  );
  assertNightLightCatalogItems(
    setSelectedPlacementNightLightStateInput.catalogItems,
  );

  if (
    setSelectedPlacementNightLightStateInput.nightLightState !== undefined &&
    setSelectedPlacementNightLightStateInput.nightLightState !== "off"
  ) {
    throw new TypeError(
      `Editor selection nightLightState must be "off" or undefined; received ${describeValue(setSelectedPlacementNightLightStateInput.nightLightState)}.`,
    );
  }
}

function assertNightLightCatalogItems(
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight" | "furnitureFire">[],
): void {
  if (!Array.isArray(catalogItems)) {
    throw new TypeError(
      `Editor selection catalogItems must be an array; received ${describeValue(catalogItems)}.`,
    );
  }

  const catalogItemIds = new Set<string>();

  for (const catalogItem of catalogItems) {
    if (typeof catalogItem !== "object" || catalogItem === null) {
      throw new TypeError(
        `Editor selection catalog item must be a non-null object; received ${describeValue(catalogItem)}.`,
      );
    }

    if (typeof catalogItem.id !== "string" || catalogItem.id.length === 0) {
      throw new TypeError(
        `Editor selection catalog item id must be a non-empty string; received ${describeValue(catalogItem.id)}.`,
      );
    }

    if (catalogItemIds.has(catalogItem.id)) {
      throw new Error(
        `Editor selection catalogItems must not contain duplicate id ${describeValue(catalogItem.id)}.`,
      );
    }

    catalogItemIds.add(catalogItem.id);
    assertCatalogItemNightLight(catalogItem);
  }
}

function assertCatalogItemNightLight(
  catalogItem: Pick<CatalogItem, "id" | "nightLight">,
): void {
  if (catalogItem.nightLight === undefined) {
    return;
  }

  if (
    typeof catalogItem.nightLight !== "object" ||
    catalogItem.nightLight === null
  ) {
    throw new TypeError(
      `Editor selection catalog item ${describeValue(catalogItem.id)} nightLight must be a non-null object; received ${describeValue(catalogItem.nightLight)}.`,
    );
  }

  if (
    typeof catalogItem.nightLight.radiusInTiles !== "number" ||
    !Number.isFinite(catalogItem.nightLight.radiusInTiles) ||
    catalogItem.nightLight.radiusInTiles <= 0
  ) {
    throw new TypeError(
      `Editor selection catalog item ${describeValue(catalogItem.id)} nightLight.radiusInTiles must be a positive finite number; received ${describeValue(catalogItem.nightLight.radiusInTiles)}.`,
    );
  }

  if (
    typeof catalogItem.nightLight.color !== "number" ||
    !Number.isInteger(catalogItem.nightLight.color) ||
    catalogItem.nightLight.color < 0 ||
    catalogItem.nightLight.color > 0xffffff
  ) {
    throw new TypeError(
      `Editor selection catalog item ${describeValue(catalogItem.id)} nightLight.color must be a 24-bit integer; received ${describeValue(catalogItem.nightLight.color)}.`,
    );
  }
}

function assertCatalogItemIsNightLight(
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight" | "furnitureFire">[],
  catalogItemId: string,
): Pick<CatalogItem, "id" | "nightLight" | "furnitureFire"> {
  const catalogItem = catalogItems.find(
    (candidateCatalogItem) => candidateCatalogItem.id === catalogItemId,
  );

  if (catalogItem?.nightLight === undefined) {
    throw new Error(
      `Editor selection catalog item ${describeValue(catalogItemId)} must be a catalog-derived night light; received ${describeValue(catalogItemId)}.`,
    );
  }

  return catalogItem;
}

function createPlacementItemWithNightLightState(
  placementItem: PlacementItem,
  nightLightState: "off" | undefined,
  isFurnitureFire: boolean,
): PlacementItem {
  if (isFurnitureFire) {
    const { nightLightState: ignoredNightLightState, ...placementItemWithoutLegacyState } = placementItem;
    return {
      ...placementItemWithoutLegacyState,
      variant: nightLightState === "off" ? 1 : 0,
    };
  }

  if (nightLightState === "off") {
    return { ...placementItem, nightLightState };
  }

  const { nightLightState: ignoredNightLightState, ...litPlacementItem } =
    placementItem;

  return litPlacementItem;
}

function assertNoConflictingFurnitureFireNightLightState(
  placementItem: PlacementItem,
  catalogItem: Pick<CatalogItem, "id" | "furnitureFire">,
): void {
  if (
    catalogItem.furnitureFire === undefined
    || placementItem.nightLightState === undefined
  ) {
    return;
  }

  const isVariantUnlit = placementItem.variant === 1;
  const isLegacyStateUnlit = placementItem.nightLightState === "off";
  if (isVariantUnlit !== isLegacyStateUnlit) {
    throw new Error(
      `Furniture fire item ${describeValue(placementItem.itemId)} has conflicting variant ${String(placementItem.variant)} and nightLightState ${describeValue(placementItem.nightLightState)}.`,
    );
  }
}

function assertDuplicateSelectedPlacementAtTileInput(
  duplicateSelectedPlacementAtTileInput: DuplicateSelectedPlacementAtTileInput,
): void {
  assertNonNullObject(duplicateSelectedPlacementAtTileInput, "duplicate input");
  assertNonNullObject(
    duplicateSelectedPlacementAtTileInput.buildingMetadataById,
    "buildingMetadataById",
  );
  assertMapTile(duplicateSelectedPlacementAtTileInput.cursorTile, "cursorTile");
  assertNonNullObject(
    duplicateSelectedPlacementAtTileInput.mapPlacementGrid,
    "mapPlacementGrid",
  );
  assertNonNullObject(
    duplicateSelectedPlacementAtTileInput.placementHistory,
    "placementHistory",
  );
  createPersistentPlacementSnapshot(
    duplicateSelectedPlacementAtTileInput.placementHistory.currentState,
  );
  assertPlacementSelectionKey(
    duplicateSelectedPlacementAtTileInput.selectedPlacementKey,
  );

  if (
    duplicateSelectedPlacementAtTileInput.freePlacement !== undefined &&
    typeof duplicateSelectedPlacementAtTileInput.freePlacement !== "boolean"
  ) {
    throw new TypeError(
      `Editor selection freePlacement must be a boolean or undefined; received ${describeValue(duplicateSelectedPlacementAtTileInput.freePlacement)}.`,
    );
  }
}

function assertPlacementSelectionKey(
  placementSelectionKey: PlacementSelectionKey,
): void {
  if (typeof placementSelectionKey !== "string") {
    throw new TypeError(
      `Editor selection key must be a string; received ${describeValue(placementSelectionKey)}.`,
    );
  }

  parsePlacementSelectionKey(placementSelectionKey);
}

function assertMapTile(mapTile: MapTileCoordinates, fieldName: string): void {
  assertNonNullObject(mapTile, fieldName);
  assertNonNegativeSafeInteger(mapTile.x, `${fieldName}.x`);
  assertNonNegativeSafeInteger(mapTile.y, `${fieldName}.y`);
}

function assertNonNegativeSafeInteger(value: unknown, fieldName: string): void {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new RangeError(
      `Editor selection ${fieldName} must be a non-negative safe integer; received ${describeValue(value)}.`,
    );
  }
}

function assertSafeInteger(value: unknown, fieldName: string): void {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new RangeError(
      `Editor selection ${fieldName} must be a safe integer; received ${describeValue(value)}.`,
    );
  }
}

function assertNonNullObject(value: unknown, fieldName: string): void {
  if (typeof value !== "object" || value === null) {
    throw new TypeError(
      `Editor selection ${fieldName} must be a non-null object; received ${describeValue(value)}.`,
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
