import type { BuildingPlacementMetadataById, CatalogItem } from "../catalog";
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
  type PlacementBuilding,
  type PlacementCrop,
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
      canRotate: false;
      canPaint: boolean;
      kind: "building";
      paintColors?: BuildingPaintColors;
      selectedPlacementKey: PlacementSelectionKey;
    }>
  | Readonly<{
      catalogItemId: string;
      canRotate: false;
      kind: "crop";
      selectedPlacementKey: PlacementSelectionKey;
    }>
  | Readonly<{
      catalogItemId: string;
      canRotate: boolean;
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
  freePlacement?: boolean;
  mapPlacementGrid: MapPlacementGrid;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKeys: readonly PlacementSelectionKey[];
  tileDelta: Readonly<{ x: number; y: number }>;
}>;

export type RotateSelectedPlacementInput = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type SetSelectedPlacementItemTintInput = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
  tintColor: string;
}>;

export type SetSelectedPlacementBuildingPaintInput = Readonly<{
  paintColors: BuildingPaintColors;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type SetSelectedPlacementNightLightStateInput = Readonly<{
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight">[];
  nightLightState: "off" | undefined;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type DuplicateSelectedPlacementAtTileInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
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

export type RotateSelectedPlacementResult =
  | Readonly<{
      applied: true;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      selectedPlacementKey: PlacementSelectionKey;
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      reason: "not-rotatable";
      selectedPlacementKey: PlacementSelectionKey;
  }>;

export type SetSelectedPlacementItemTintResult = Readonly<{
  placementHistory: PlacementHistory<PlacementSnapshot>;
  selectedPlacementKey: PlacementSelectionKey;
}>;

export type SetSelectedPlacementBuildingPaintResult = Readonly<{
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
  const selectedItemKeys = placementSnapshot.items.flatMap((placementItem) =>
    !placementItem.locked &&
    doesRectangleIntersectSelectionRectangle(
      selectionRectangle,
      placementItem.x,
      placementItem.y,
      placementItem.footprint.width,
      placementItem.footprint.height,
    )
      ? [createItemSelectionKey(placementItem.instanceId)]
      : [],
  );

  return [...selectedBuildingKeys, ...selectedCropKeys, ...selectedItemKeys];
}

export function selectPlacementAtTile(
  selectPlacementAtTileInput: SelectPlacementAtTileInput,
): PlacementSelectionKey | null {
  const placementSelectionKeys = selectPlacementsInRectangle(
    {
      buildingMetadataById: selectPlacementAtTileInput.buildingMetadataById,
      firstTile: selectPlacementAtTileInput.cursorTile,
      placementSnapshot: selectPlacementAtTileInput.placementSnapshot,
      secondTile: selectPlacementAtTileInput.cursorTile,
    },
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

    return {
      catalogItemId: `building:${placementBuilding.buildingId}`,
      canRotate: false,
      canPaint,
      kind: "building",
      ...(canPaint
        ? {
            paintColors:
              placementBuilding.paintColors ?? createDefaultBuildingPaintColors(),
          }
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
      canRotate: false,
      kind: "crop",
      selectedPlacementKey: getPlacementSelectionDetailsInput.selectedPlacementKey,
    };
  }

  const placementItem = getRequiredPlacementItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );

  return {
    catalogItemId: placementItem.itemId,
    canRotate: placementItem.layer === "item",
    kind: "item",
    nightLightState: placementItem.nightLightState,
    selectedPlacementKey: getPlacementSelectionDetailsInput.selectedPlacementKey,
    tintColor: placementItem.tintColor,
  };
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
  let validationSnapshot = deletePlacementSelectionKeys(
    placementSnapshot,
    parsedSelectionKeys,
  );

  for (const parsedSelectionKey of parsedSelectionKeys) {
    const placementCandidate = createMovedPlacementCandidate(
      placementSnapshot,
      parsedSelectionKey,
      tileDelta,
    );
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
    parsedSelectionKeys,
    tileDelta,
  );

  return {
    applied: true,
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
    selectedPlacementKeys: createMovedSelectionKeys(parsedSelectionKeys, tileDelta),
  };
}

export function rotateSelectedPlacement(
  rotateSelectedPlacementInput: RotateSelectedPlacementInput,
): RotateSelectedPlacementResult {
  assertRotateSelectedPlacementInput(rotateSelectedPlacementInput);
  const { placementHistory, selectedPlacementKey } = rotateSelectedPlacementInput;
  const placementSnapshot = createPersistentPlacementSnapshot(
    placementHistory.currentState,
  );
  const parsedSelectionKey = parsePlacementSelectionKey(selectedPlacementKey);
  assertSelectedPlacementKeysExist(placementSnapshot, [parsedSelectionKey]);

  if (parsedSelectionKey.kind !== "item") {
    return {
      applied: false,
      placementHistory,
      reason: "not-rotatable",
      selectedPlacementKey,
    };
  }

  const placementItem = getRequiredPlacementItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );

  if (placementItem.layer !== "item") {
    return {
      applied: false,
      placementHistory,
      reason: "not-rotatable",
      selectedPlacementKey,
    };
  }

  const nextPlacementSnapshot = applyPlacementSnapshotAction(placementSnapshot, {
    type: "replace-item",
    item: {
      ...placementItem,
      rotation: getNextQuarterTurn(placementItem.rotation),
    },
  });

  return {
    applied: true,
    placementHistory: commitPlacementHistory(placementHistory, nextPlacementSnapshot),
    selectedPlacementKey,
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
  const nextPlacementSnapshot = applyPlacementSnapshotAction(placementSnapshot, {
    type: "replace-item",
    item: { ...placementItem, tintColor },
  });

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
  assertCatalogItemIsNightLight(catalogItems, placementItem.itemId);

  if (placementItem.nightLightState === nightLightState) {
    return {
      applied: false,
      placementHistory,
      reason: "already-in-requested-state",
      selectedPlacementKey,
    };
  }

  const nextPlacementSnapshot = applyPlacementSnapshotAction(placementSnapshot, {
    type: "replace-item",
    item: createPlacementItemWithNightLightState(placementItem, nightLightState),
  });

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
  const placementCandidate = createDuplicatePlacementCandidate(
    placementSnapshot,
    parsedSelectionKey,
    cursorTile,
  );
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
        buildingId: placementBuilding.buildingId,
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

function getNextQuarterTurn(rotation: number): number {
  const normalizedRotation = ((rotation % 4) + 4) % 4;

  return (normalizedRotation + 1) % 4;
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
        buildingId: placementBuilding.buildingId,
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
  const { instanceId: _, ...newPlacementItem } = movedItem;

  if (placementItem.layer === "path") {
    return { kind: "floor", item: newPlacementItem };
  }

  if (placementItem.layer === "fence") {
    return { kind: "fence", item: newPlacementItem };
  }

  return { kind: "item", item: newPlacementItem };
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

  const placementItem = getRequiredPlacementItem(
    placementSnapshot,
    parsedSelectionKey.instanceId,
  );

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
        ? {
            ...placementItem,
            x: placementItem.x + tileDelta.x,
            y: placementItem.y + tileDelta.y,
          }
        : placementItem,
    ),
  });
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
  const placementItem = placementSnapshot.items.find(
    (candidatePlacementItem) => candidatePlacementItem.instanceId === instanceId,
  );

  if (placementItem === undefined) {
    throw new Error(
      `Editor selection could not find item instance ID ${describeValue(instanceId)} after validation.`,
    );
  }

  return placementItem;
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
      const placementItem = placementSnapshot.items.find(
        (candidatePlacementItem) =>
          candidatePlacementItem.instanceId === parsedSelectionKey.instanceId,
      );

      if (placementItem === undefined) {
        throw new Error(
          `Editor selection selected placement key ${describeValue(createItemSelectionKey(parsedSelectionKey.instanceId))} does not exist in the current placement snapshot.`,
        );
      }

      if (placementItem.locked) {
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

  for (const parsedSelectionKey of parsedSelectionKeys) {
    if (parsedSelectionKey.kind === "building") {
      nextPlacementSnapshot = applyPlacementSnapshotAction(nextPlacementSnapshot, {
        type: "delete-building",
        instanceId: parsedSelectionKey.instanceId,
      });
      continue;
    }

    if (parsedSelectionKey.kind === "item") {
      nextPlacementSnapshot = applyPlacementSnapshotAction(nextPlacementSnapshot, {
        type: "delete-item",
        instanceId: parsedSelectionKey.instanceId,
      });
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

function assertRotateSelectedPlacementInput(
  rotateSelectedPlacementInput: RotateSelectedPlacementInput,
): void {
  assertNonNullObject(rotateSelectedPlacementInput, "rotate input");
  assertNonNullObject(
    rotateSelectedPlacementInput.placementHistory,
    "placementHistory",
  );
  createPersistentPlacementSnapshot(
    rotateSelectedPlacementInput.placementHistory.currentState,
  );
  assertPlacementSelectionKey(
    rotateSelectedPlacementInput.selectedPlacementKey,
  );
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
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight">[],
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
  catalogItems: readonly Pick<CatalogItem, "id" | "nightLight">[],
  catalogItemId: string,
): void {
  const catalogItem = catalogItems.find(
    (candidateCatalogItem) => candidateCatalogItem.id === catalogItemId,
  );

  if (catalogItem?.nightLight === undefined) {
    throw new Error(
      `Editor selection catalog item ${describeValue(catalogItemId)} must be a catalog-derived night light; received ${describeValue(catalogItemId)}.`,
    );
  }
}

function createPlacementItemWithNightLightState(
  placementItem: PlacementItem,
  nightLightState: "off" | undefined,
): PlacementItem {
  if (nightLightState === "off") {
    return { ...placementItem, nightLightState };
  }

  const { nightLightState: ignoredNightLightState, ...litPlacementItem } =
    placementItem;

  return litPlacementItem;
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
