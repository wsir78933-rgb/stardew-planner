import type {
  BuildingPlacementMetadataById,
  CatalogItem,
  CatalogPresentationChoice,
  CatalogTileSize,
} from "../catalog";
import { validateCatalogItemPresentationChoice } from "../catalog";
import type {
  MapPlacementGrid,
  MapTileCoordinates,
} from "../placement/map-placement-grids";
import {
  commitPlacementHistory,
  type PlacementHistory,
} from "../placement/placement-history";
import {
  applyWorkingPlacementSnapshotAction,
  commitWorkingPlacementSnapshot,
  createWorkingPlacementSnapshot,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import type { PlacementValidationResult } from "../placement/placement-validation";
import {
  evaluateEditorCursorPlacement,
  type EditorCursorPlacementEvaluation,
} from "./editor-placement-controller";

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
      reason: "invalid-held-item-target";
      targetReason: "long-table" | "occupied-table";
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>
  | Readonly<{
      applied: false;
      validation: Extract<PlacementValidationResult, { valid: false }>;
      placementHistory: PlacementHistory<PlacementSnapshot>;
    }>;

type InvalidHeldFillTarget = Readonly<{
  targetReason: "long-table" | "occupied-table";
  tile: MapTileCoordinates;
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

  // Wallpaper and indoor flooring stay application decor. They are not grid stamps.
  if (readInteriorDecorApplicationKind(selectedCatalogItem) !== null) {
    return {
      applied: false,
      reason: "unsupported-catalog-category",
      placementHistory,
    };
  }

  return applyValidatedGridStampFill(
    editorFillInput,
    selectedCatalogItem,
    requireCatalogPresentationChoice(editorFillInput),
  );
}

function applyValidatedGridStampFill(
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
  let workingSnapshot = createWorkingPlacementSnapshot(
    editorFillInput.placementHistory.currentState,
  );
  let firstRejectedValidation:
    | Extract<PlacementValidationResult, { valid: false }>
    | null = null;
  let firstInvalidHeldTarget: InvalidHeldFillTarget | null = null;
  let placedOriginCount = 0;

  for (const fillTile of fillTiles) {
    const placementEvaluation = evaluateEditorCursorPlacement({
      selectedCatalogItem,
      catalogPresentationChoice,
      cursorTile: fillTile,
      mapPlacementGrid: editorFillInput.mapPlacementGrid,
      buildingMetadataById: editorFillInput.buildingMetadataById,
      freePlacement: editorFillInput.freePlacement,
      placementSnapshot: workingSnapshot,
      randomFractionSource: editorFillInput.randomFractionSource,
    });

    if (!placementEvaluation.accepted) {
      const rejection = readUnacceptedFillEvaluation(
        placementEvaluation,
        selectedCatalogItem,
        fillTile,
      );

      if (rejection.kind === "validation") {
        firstRejectedValidation ??= rejection.validation;
        continue;
      }

      firstInvalidHeldTarget ??= {
        targetReason: rejection.targetReason,
        tile: fillTile,
      };
      continue;
    }

    workingSnapshot = applyWorkingPlacementSnapshotAction(
      workingSnapshot,
      placementEvaluation.action,
    );
    placedOriginCount += 1;
  }

  if (placedOriginCount === 0) {
    if (firstRejectedValidation !== null) {
      return {
        applied: false,
        validation: firstRejectedValidation,
        placementHistory: editorFillInput.placementHistory,
      };
    }

    if (firstInvalidHeldTarget !== null) {
      return {
        applied: false,
        reason: "invalid-held-item-target",
        targetReason: firstInvalidHeldTarget.targetReason,
        placementHistory: editorFillInput.placementHistory,
      };
    }

    return {
      applied: true,
      placedTileCount: 0,
      placementHistory: editorFillInput.placementHistory,
    };
  }

  return {
    applied: true,
    placedTileCount: placedOriginCount,
    placementHistory: commitPlacementHistory(
      editorFillInput.placementHistory,
      commitWorkingPlacementSnapshot(workingSnapshot),
    ),
  };
}

function readUnacceptedFillEvaluation(
  placementEvaluation: Extract<EditorCursorPlacementEvaluation, { accepted: false }>,
  selectedCatalogItem: CatalogItem,
  fillTile: MapTileCoordinates,
):
  | Readonly<{
      kind: "validation";
      validation: Extract<PlacementValidationResult, { valid: false }>;
    }>
  | Readonly<{
      kind: "invalid-held-item-target";
      targetReason: "long-table" | "occupied-table";
    }> {
  if ("validation" in placementEvaluation) {
    return { kind: "validation", validation: placementEvaluation.validation };
  }

  if (placementEvaluation.reason === "invalid-held-item-target") {
    return {
      kind: "invalid-held-item-target",
      targetReason: placementEvaluation.targetReason,
    };
  }

  throw new Error(
    `Editor fill received unexpected unapplied placement result for catalog item ${describeValue(selectedCatalogItem.id)} at tile ${describeTile(fillTile)}; received reason ${describeValue(placementEvaluation.reason)}.`,
  );
}

function createFillTiles(
  selectedCatalogItem: CatalogItem,
  catalogPresentationChoice: CatalogPresentationChoice,
  firstTile: MapTileCoordinates,
  secondTile: MapTileCoordinates,
): readonly MapTileCoordinates[] {
  const rectangle = createFillRectangle(firstTile, secondTile);

  // Fences keep the perimeter gesture. Every other stamp steps by its real footprint.
  if (selectedCatalogItem.category === "fence") {
    return createFencePerimeterTiles(rectangle);
  }

  return createFootprintTiledRectangleOrigins(
    rectangle,
    getFillFootprint(selectedCatalogItem, catalogPresentationChoice),
  );
}

function readInteriorDecorApplicationKind(
  catalogItem: CatalogItem,
): "wallpaper" | "flooring" | null {
  const interiorDecorKind = catalogItem.interiorDecorKind;

  if (interiorDecorKind === undefined) {
    return null;
  }

  if (interiorDecorKind === "wallpaper" || interiorDecorKind === "flooring") {
    return interiorDecorKind;
  }

  throw new TypeError(
    `Editor fill interiorDecorKind for catalog item ${describeValue(catalogItem.id)} must be "wallpaper", "flooring", or undefined; received ${describeValue(interiorDecorKind)}.`,
  );
}

function getFillFootprint(
  catalogItem: CatalogItem,
  catalogPresentationChoice: CatalogPresentationChoice,
): CatalogTileSize {
  const rotationCapability = catalogItem.presentationCapabilities?.rotation;
  const fillFootprint = rotationCapability === null || rotationCapability === undefined
    ? catalogItem.tileSize
    : rotationCapability.footprints[catalogPresentationChoice.rotation];

  if (fillFootprint === undefined) {
    throw new RangeError(
      `Editor fill catalog item ${describeValue(catalogItem.id)} has no footprint for rotation ${describeValue(catalogPresentationChoice.rotation)}; received ${describeValue(rotationCapability?.footprints)}.`,
    );
  }

  assertPositiveFillFootprint(
    catalogItem.id,
    catalogPresentationChoice.rotation,
    fillFootprint,
  );
  return fillFootprint;
}

function assertPositiveFillFootprint(
  catalogItemId: string,
  rotation: number,
  footprint: CatalogTileSize,
): void {
  if (typeof footprint !== "object" || footprint === null) {
    throw new TypeError(
      `Editor fill footprint for catalog item ${describeValue(catalogItemId)} rotation ${describeValue(rotation)} must be a non-null object; received ${describeValue(footprint)}.`,
    );
  }

  for (const dimensionName of ["width", "height"] as const) {
    const dimension = footprint[dimensionName];

    if (
      typeof dimension !== "number"
      || !Number.isSafeInteger(dimension)
      || dimension < 1
    ) {
      throw new RangeError(
        `Editor fill footprint ${dimensionName} for catalog item ${describeValue(catalogItemId)} rotation ${describeValue(rotation)} must be a positive safe integer; received ${describeValue(dimension)}.`,
      );
    }
  }
}

function createFootprintTiledRectangleOrigins(
  fillRectangle: FillRectangle,
  footprint: CatalogTileSize,
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
  return {
    minimumX: Math.min(firstTile.x, secondTile.x),
    minimumY: Math.min(firstTile.y, secondTile.y),
    maximumX: Math.max(firstTile.x, secondTile.x),
    maximumY: Math.max(firstTile.y, secondTile.y),
  };
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

function describeTile(tile: MapTileCoordinates): string {
  return `{ x: ${String(tile.x)}, y: ${String(tile.y)} }`;
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
