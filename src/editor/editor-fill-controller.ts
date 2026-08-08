import type {
  BuildingPlacementMetadataById,
  CatalogItem,
  CatalogPresentationChoice,
} from "../catalog";
import { validateCatalogItemPresentationChoice } from "../catalog";
import { isMultiTileCropCatalogItem } from "../placement/catalog-item-placement-requirement";
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
  catalogPresentationChoice: CatalogPresentationChoice | null;
  selectedCatalogItem: CatalogItem | null;
  firstTile: MapTileCoordinates;
  secondTile: MapTileCoordinates;
  freePlacement?: boolean;
  mapPlacementGrid: MapPlacementGrid;
  buildingMetadataById: BuildingPlacementMetadataById;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  randomFractionSource?: () => number;
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
  const catalogPresentationChoice = requireCatalogPresentationChoice(
    editorFillInput,
  );

  if (isBedFillCatalogItem(selectedCatalogItem)) {
    return applyEditorBedFill(
      editorFillInput,
      selectedCatalogItem,
      catalogPresentationChoice,
    );
  }

  const fillTiles = createFillTiles(
    selectedCatalogItem,
    catalogPresentationChoice,
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
      catalogPresentationChoice,
      cursorTile: fillTile,
      mapPlacementGrid: editorFillInput.mapPlacementGrid,
      buildingMetadataById: editorFillInput.buildingMetadataById,
      freePlacement: editorFillInput.freePlacement,
      placementHistory: validatedPlacementHistory,
      randomFractionSource: editorFillInput.randomFractionSource,
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
      selectedCatalogItem,
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

function applyEditorBedFill(
  editorFillInput: EditorFillInput,
  selectedCatalogItem: CatalogItem,
  catalogPresentationChoice: CatalogPresentationChoice,
): EditorFillResult {
  const fillTiles = createFillTiles(
    selectedCatalogItem,
    catalogPresentationChoice,
    editorFillInput.firstTile,
    editorFillInput.secondTile,
  );
  let validatedPlacementHistory = createPlacementHistory(
    editorFillInput.placementHistory.currentState,
  );
  let firstRejectedValidation:
    | Extract<PlacementValidationResult, { valid: false }>
    | null = null;
  let placedBedCount = 0;

  for (const fillTile of fillTiles) {
    const placementResult = applyEditorCursorPlacement({
      selectedCatalogItem,
      catalogPresentationChoice,
      cursorTile: fillTile,
      mapPlacementGrid: editorFillInput.mapPlacementGrid,
      buildingMetadataById: editorFillInput.buildingMetadataById,
      freePlacement: editorFillInput.freePlacement,
      placementHistory: validatedPlacementHistory,
      randomFractionSource: editorFillInput.randomFractionSource,
    });

    if (!placementResult.applied) {
      if ("validation" in placementResult) {
        firstRejectedValidation ??= placementResult.validation;
        continue;
      }

      throw new Error(
        `Editor bed fill received unexpected unapplied placement result for catalog item ${describeValue(selectedCatalogItem.id)} at tile ${describeValue(fillTile)}.`,
      );
    }

    validatedPlacementHistory = placementResult.placementHistory;
    placedBedCount += 1;
  }

  if (placedBedCount === 0) {
    if (firstRejectedValidation === null) {
      return {
        applied: true,
        placedTileCount: 0,
        placementHistory: editorFillInput.placementHistory,
      };
    }

    return {
      applied: false,
      validation: firstRejectedValidation,
      placementHistory: editorFillInput.placementHistory,
    };
  }

  return {
    applied: true,
    placedTileCount: placedBedCount,
    placementHistory: commitPlacementHistory(
      editorFillInput.placementHistory,
      validatedPlacementHistory.currentState,
    ),
  };
}

function appendFillPlacementRecord(
  catalogItem: CatalogItem,
  placementSnapshot: PlacementSnapshot,
  addedCrops: PlacementCrop[],
  addedItems: PlacementItem[],
): void {
  if (
    catalogItem.category === "crop"
    && !isMultiTileCropCatalogItem(catalogItem)
  ) {
    const addedCrop = placementSnapshot.crops.at(-1);

    if (addedCrop === undefined) {
      throw new Error(
        `Editor fill expected a crop placement record for category ${describeValue(catalogItem.category)} but none was added.`,
      );
    }

    addedCrops.push(addedCrop);
    return;
  }

  const addedItem = placementSnapshot.items.at(-1);

  if (addedItem === undefined) {
    throw new Error(
      `Editor fill expected an item placement record for catalog item ${describeValue(catalogItem.id)} but none was added.`,
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
  catalogPresentationChoice: CatalogPresentationChoice,
  firstTile: MapTileCoordinates,
  secondTile: MapTileCoordinates,
): readonly MapTileCoordinates[] {
  const renderingMetadata = selectedCatalogItem.renderingMetadata;
  const isCompositeFurniture =
    selectedCatalogItem.category === "placeable"
    && renderingMetadata?.kind === "furniture"
    && renderingMetadata.compositeSprite !== null;
  const isBedFurniture =
    selectedCatalogItem.category === "placeable"
    && renderingMetadata?.kind === "furniture"
    && renderingMetadata.bedType !== null;

  if (
    selectedCatalogItem.category !== "crop" &&
    selectedCatalogItem.category !== "floor" &&
    selectedCatalogItem.category !== "fence" &&
    !isCompositeFurniture && !isBedFurniture
  ) {
    throw new Error(
      `Editor fill does not support catalog category ${describeValue(selectedCatalogItem.category)} for item ${describeValue(selectedCatalogItem.id)}.`,
    );
  }

  const rectangle = createFillRectangle(firstTile, secondTile);

  if (selectedCatalogItem.category === "fence") {
    return createFencePerimeterTiles(rectangle);
  }

  if (isBedFurniture || isMultiTileCropCatalogItem(selectedCatalogItem)) {
    return createFootprintTiledRectangleOrigins(
      rectangle,
      getFillFootprint(selectedCatalogItem, catalogPresentationChoice),
    );
  }

  return createRectangleTiles(rectangle);
}

function isBedFillCatalogItem(catalogItem: CatalogItem): boolean {
  return catalogItem.category === "placeable"
    && catalogItem.renderingMetadata?.kind === "furniture"
    && catalogItem.renderingMetadata.bedType !== null;
}

function getFillFootprint(
  catalogItem: CatalogItem,
  catalogPresentationChoice: CatalogPresentationChoice,
): CatalogItem["tileSize"] {
  const rotationFootprints =
    catalogItem.presentationCapabilities?.rotation?.footprints;
  const fillFootprint = rotationFootprints === undefined
    ? catalogItem.tileSize
    : rotationFootprints[catalogPresentationChoice.rotation];

  if (fillFootprint === undefined) {
    throw new RangeError(
      `Editor fill catalog item ${describeValue(catalogItem.id)} has no footprint for rotation ${describeValue(catalogPresentationChoice.rotation)}; received ${describeValue(rotationFootprints)}.`,
    );
  }

  return fillFootprint;
}

function createFootprintTiledRectangleOrigins(
  fillRectangle: FillRectangle,
  footprint: CatalogItem["tileSize"],
): readonly MapTileCoordinates[] {
  const fillTiles: MapTileCoordinates[] = [];
  const lastOriginX = fillRectangle.maximumX - footprint.width + 1;
  const lastOriginY = fillRectangle.maximumY - footprint.height + 1;

  for (
    let y = fillRectangle.minimumY;
    y <= lastOriginY;
    y += footprint.height
  ) {
    for (
      let x = fillRectangle.minimumX;
      x <= lastOriginX;
      x += footprint.width
    ) {
      fillTiles.push({ x, y });
    }
  }

  return fillTiles;
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

  if (
    editorFillInput.randomFractionSource !== undefined
    && typeof editorFillInput.randomFractionSource !== "function"
  ) {
    throw new TypeError(
      `Editor fill randomFractionSource must be a function or undefined; received ${describeValue(editorFillInput.randomFractionSource)}.`,
    );
  }

  if (editorFillInput.selectedCatalogItem !== null) {
    assertNonNullObject(editorFillInput.selectedCatalogItem, "selectedCatalogItem");
    validateCatalogItemPresentationChoice(
      editorFillInput.selectedCatalogItem,
      requireCatalogPresentationChoice(editorFillInput),
    );
  } else if (editorFillInput.catalogPresentationChoice !== null) {
    throw new TypeError(
      `Editor fill catalogPresentationChoice must be null without a selected catalog item; received ${describeValue(editorFillInput.catalogPresentationChoice)}.`,
    );
  }
}

function requireCatalogPresentationChoice(
  editorFillInput: EditorFillInput,
): CatalogPresentationChoice {
  if (editorFillInput.catalogPresentationChoice === null) {
    throw new TypeError(
      `Editor fill catalogPresentationChoice must be a non-null object for selected catalog item ${describeValue(editorFillInput.selectedCatalogItem?.id)}; received null.`,
    );
  }
  return editorFillInput.catalogPresentationChoice;
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
