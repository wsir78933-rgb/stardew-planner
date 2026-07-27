import type {
  BuildingPlacementMetadataById,
  CatalogItem,
} from "../catalog";
import type {
  MapPlacementGrid,
  MapTileCoordinates,
} from "../placement/map-placement-grids";
import {
  commitPlacementHistory,
  createPlacementHistory,
  type PlacementHistory,
} from "../placement/placement-history";
import {
  createPersistentPlacementSnapshot,
  type PlacementCrop,
  type PlacementItem,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import type { PlacementValidationResult } from "../placement/placement-validation";
import { applyEditorCursorPlacement } from "./editor-placement-controller";

export type EditorFillInput = Readonly<{
  selectedCatalogItem: CatalogItem | null;
  firstTile: MapTileCoordinates;
  secondTile: MapTileCoordinates;
  freePlacement?: boolean;
  mapPlacementGrid: MapPlacementGrid;
  buildingMetadataById: BuildingPlacementMetadataById;
  placementHistory: PlacementHistory<PlacementSnapshot>;
}>;

export type EditorFillResult =
  | Readonly<{
      applied: true;
      placedTileCount: number;
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>
  | Readonly<{
      applied: false;
      reason: "no-selected-catalog-item" | "unsupported-catalog-category";
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>
  | Readonly<{
      applied: false;
      validation: Extract<PlacementValidationResult, { valid: false }>;
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>;

export function applyEditorFill(
  editorFillInput: EditorFillInput,
): EditorFillResult {
  assertEditorFillInput(editorFillInput);
  const { selectedCatalogItem, placementHistory } = editorFillInput;

  if (selectedCatalogItem === null) {
    return {
      applied: false,
      reason: "no-selected-catalog-item",
      placementHistory,
    };
  }

  if (!selectedCatalogItem.allowedTools.includes("fill")) {
    return {
      applied: false,
      reason: "unsupported-catalog-category",
      placementHistory,
    };
  }

  const fillTiles = createFillTiles(
    selectedCatalogItem,
    editorFillInput.firstTile,
    editorFillInput.secondTile,
  );
  const validatedPlacementHistory = createPlacementHistory(
    placementHistory.currentState,
  );
  const addedCrops: PlacementCrop[] = [];
  const addedItems: PlacementItem[] = [];

  for (const fillTile of fillTiles) {
    const placementResult = applyEditorCursorPlacement({
      selectedCatalogItem,
      cursorTile: fillTile,
      mapPlacementGrid: editorFillInput.mapPlacementGrid,
      buildingMetadataById: editorFillInput.buildingMetadataById,
      freePlacement: editorFillInput.freePlacement,
      placementHistory: validatedPlacementHistory,
    });

    if (!placementResult.applied) {
      if ("validation" in placementResult) {
        return {
          applied: false,
          validation: placementResult.validation,
          placementHistory,
        };
      }

      throw new Error(
        `Editor fill received unexpected unapplied placement result for catalog item ${describeValue(selectedCatalogItem.id)} at tile ${describeValue(fillTile)}.`,
      );
    }

    appendFillPlacementRecord(
      selectedCatalogItem.category,
      placementResult.placementHistory.currentState,
      addedCrops,
      addedItems,
    );
  }

  const nextPlacementSnapshot = createFillPlacementSnapshot(
    placementHistory.currentState,
    addedCrops,
    addedItems,
  );

  return {
    applied: true,
    placedTileCount: fillTiles.length,
    placementHistory: commitPlacementHistory(
      placementHistory,
      nextPlacementSnapshot,
    ),
  };
}

function appendFillPlacementRecord(
  category: CatalogItem["category"],
  placementSnapshot: PlacementSnapshot,
  addedCrops: PlacementCrop[],
  addedItems: PlacementItem[],
): void {
  if (category === "crop") {
    const addedCrop = placementSnapshot.crops.at(-1);

    if (addedCrop === undefined) {
      throw new Error(
        `Editor fill expected a crop placement record for category ${describeValue(category)} but none was added.`,
      );
    }

    addedCrops.push(addedCrop);
    return;
  }

  const addedItem = placementSnapshot.items.at(-1);

  if (addedItem === undefined) {
    throw new Error(
      `Editor fill expected an item placement record for category ${describeValue(category)} but none was added.`,
    );
  }

  addedItems.push({
    ...addedItem,
    instanceId: incrementPlacementItemIdentifier(
      addedItem.instanceId,
      addedItems.length,
    ),
  });
}

function createFillPlacementSnapshot(
  placementSnapshot: PlacementSnapshot,
  addedCrops: readonly PlacementCrop[],
  addedItems: readonly PlacementItem[],
): PlacementSnapshot {
  return createPersistentPlacementSnapshot({
    ...placementSnapshot,
    crops: [...placementSnapshot.crops, ...addedCrops],
    items: [...placementSnapshot.items, ...addedItems],
    nextItemId: incrementPlacementItemIdentifier(
      placementSnapshot.nextItemId,
      addedItems.length,
    ),
  });
}

function incrementPlacementItemIdentifier(
  startingIdentifier: number,
  addedItemCount: number,
): number {
  const nextFilledItemId = startingIdentifier + addedItemCount;

  if (!Number.isSafeInteger(nextFilledItemId)) {
    throw new RangeError(
      `Editor fill item identifier must remain a safe integer; received startingIdentifier ${describeValue(startingIdentifier)} and addedItemCount ${describeValue(addedItemCount)}.`,
    );
  }

  return nextFilledItemId;
}

function createFillTiles(
  selectedCatalogItem: CatalogItem,
  firstTile: MapTileCoordinates,
  secondTile: MapTileCoordinates,
): readonly MapTileCoordinates[] {
  if (
    selectedCatalogItem.category !== "crop" &&
    selectedCatalogItem.category !== "floor" &&
    selectedCatalogItem.category !== "fence"
  ) {
    throw new Error(
      `Editor fill does not support catalog category ${describeValue(selectedCatalogItem.category)} for item ${describeValue(selectedCatalogItem.id)}.`,
    );
  }

  const rectangle = createFillRectangle(firstTile, secondTile);

  if (selectedCatalogItem.category === "fence") {
    return createFencePerimeterTiles(rectangle);
  }

  return createRectangleTiles(rectangle);
}

type FillRectangle = Readonly<{
  minimumX: number;
  minimumY: number;
  maximumX: number;
  maximumY: number;
}>;

function createFillRectangle(
  firstTile: MapTileCoordinates,
  secondTile: MapTileCoordinates,
): FillRectangle {
  const rectangle = {
    minimumX: Math.min(firstTile.x, secondTile.x),
    minimumY: Math.min(firstTile.y, secondTile.y),
    maximumX: Math.max(firstTile.x, secondTile.x),
    maximumY: Math.max(firstTile.y, secondTile.y),
  };
  return rectangle;
}

function createRectangleTiles(
  fillRectangle: FillRectangle,
): readonly MapTileCoordinates[] {
  const fillTiles: MapTileCoordinates[] = [];

  for (let y = fillRectangle.minimumY; y <= fillRectangle.maximumY; y += 1) {
    for (let x = fillRectangle.minimumX; x <= fillRectangle.maximumX; x += 1) {
      fillTiles.push({ x, y });
    }
  }

  return fillTiles;
}

function createFencePerimeterTiles(
  fillRectangle: FillRectangle,
): readonly MapTileCoordinates[] {
  return createRectangleTiles(fillRectangle).filter(
    (fillTile) =>
      fillTile.x === fillRectangle.minimumX ||
      fillTile.x === fillRectangle.maximumX ||
      fillTile.y === fillRectangle.minimumY ||
      fillTile.y === fillRectangle.maximumY,
  );
}

function assertEditorFillInput(editorFillInput: EditorFillInput): void {
  assertNonNullObject(editorFillInput, "input");
  assertMapTile(editorFillInput.firstTile, "firstTile");
  assertMapTile(editorFillInput.secondTile, "secondTile");
  assertNonNullObject(editorFillInput.placementHistory, "placementHistory");

  if (
    editorFillInput.freePlacement !== undefined &&
    typeof editorFillInput.freePlacement !== "boolean"
  ) {
    throw new TypeError(
      `Editor fill freePlacement must be a boolean or undefined; received ${describeValue(editorFillInput.freePlacement)}.`,
    );
  }

  if (editorFillInput.selectedCatalogItem !== null) {
    assertNonNullObject(editorFillInput.selectedCatalogItem, "selectedCatalogItem");
  }
}

function assertMapTile(mapTile: MapTileCoordinates, fieldName: string): void {
  assertNonNullObject(mapTile, fieldName);

  for (const coordinateName of ["x", "y"] as const) {
    const coordinate = mapTile[coordinateName];

    if (
      typeof coordinate !== "number" ||
      !Number.isSafeInteger(coordinate) ||
      coordinate < 0
    ) {
      throw new RangeError(
        `Editor fill ${fieldName}.${coordinateName} must be a non-negative safe integer; received ${describeValue(coordinate)}.`,
      );
    }
  }
}

function assertNonNullObject(value: unknown, fieldName: string): void {
  if (typeof value !== "object" || value === null) {
    throw new TypeError(
      `Editor fill ${fieldName} must be a non-null object; received ${describeValue(value)}.`,
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
