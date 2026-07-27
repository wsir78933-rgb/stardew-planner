import type {
  BuildingPlacementMetadataById,
  CatalogItem,
} from "../catalog";
import { isResourceClumpCatalogItemId } from "../catalog/resource-clumps";
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
  type NewPlacementItem,
  type PlacementSnapshot,
  type PlacementSnapshotAction,
} from "../placement/placement-snapshot";
import {
  validatePlacement,
  type PlacementValidationCandidate,
  type PlacementValidationResult,
} from "../placement/placement-validation";

export type EditorCursorPlacementInput = Readonly<{
  selectedCatalogItem: CatalogItem | null;
  cursorTile: MapTileCoordinates;
  mapPlacementGrid: MapPlacementGrid;
  buildingMetadataById: BuildingPlacementMetadataById;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  freePlacement?: boolean;
}>;

export type EditorCursorPlacementResult =
  | Readonly<{
      applied: true;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      validation: Extract<PlacementValidationResult, { valid: true }>;
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      validation: Extract<PlacementValidationResult, { valid: false }>;
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      reason: "no-selected-catalog-item";
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      reason: "unsupported-catalog-category";
      category: "placeable";
    }>;

export function applyEditorCursorPlacement(
  editorCursorPlacementInput: EditorCursorPlacementInput,
): EditorCursorPlacementResult {
  assertEditorCursorPlacementInput(editorCursorPlacementInput);
  const { selectedCatalogItem, placementHistory } = editorCursorPlacementInput;

  if (selectedCatalogItem === null) {
    return {
      applied: false,
      reason: "no-selected-catalog-item",
      placementHistory,
    };
  }

  const candidate = createPlacementCandidate(
    selectedCatalogItem,
    editorCursorPlacementInput.cursorTile,
  );

  if (candidate === null) {
    if (selectedCatalogItem.category !== "placeable") {
      throw new Error(
        `Editor placement has no candidate implementation for catalog category ${describeValue(selectedCatalogItem.category)}.`,
      );
    }

    return {
      applied: false,
      reason: "unsupported-catalog-category",
      category: "placeable",
      placementHistory,
    };
  }

  assertCandidateBuildingMetadata(
    candidate,
    editorCursorPlacementInput.buildingMetadataById,
  );

  const validation = validatePlacement({
    mapPlacementGrid: editorCursorPlacementInput.mapPlacementGrid,
    placementSnapshot: placementHistory.currentState,
    buildingMetadataById: editorCursorPlacementInput.buildingMetadataById,
    candidate,
    freePlacement: editorCursorPlacementInput.freePlacement,
  });

  if (!validation.valid) {
    return { applied: false, validation, placementHistory };
  }

  const nextPlacementSnapshot = applyPlacementSnapshotAction(
    placementHistory.currentState,
    createPlacementSnapshotAction(candidate),
  );

  return {
    applied: true,
    validation,
    placementHistory: commitPlacementHistory(
      placementHistory,
      nextPlacementSnapshot,
    ),
  };
}

function assertCandidateBuildingMetadata(
  candidate: PlacementValidationCandidate,
  buildingMetadataById: BuildingPlacementMetadataById,
): void {
  if (candidate.kind !== "building") {
    return;
  }

  assertNonNullObject(buildingMetadataById, "buildingMetadataById");

  if (!Object.hasOwn(buildingMetadataById, candidate.building.buildingId)) {
    throw new Error(
      `Editor placement received unknown building metadata ID ${describeValue(candidate.building.buildingId)}.`,
    );
  }
}

function createPlacementCandidate(
  selectedCatalogItem: CatalogItem,
  cursorTile: MapTileCoordinates,
): PlacementValidationCandidate | null {
  switch (selectedCatalogItem.category) {
    case "building":
      return {
        kind: "building",
        building: {
          buildingId: readBuildingMetadataId(selectedCatalogItem.id),
          x: cursorTile.x,
          y: cursorTile.y,
        },
      };
    case "crop":
      assertCatalogItemIdPrefix(selectedCatalogItem, "crop:");
      return {
        kind: "crop",
        crop: { cropId: selectedCatalogItem.id, x: cursorTile.x, y: cursorTile.y },
      };
    case "floor":
      assertCatalogItemIdPrefix(selectedCatalogItem, "floor:");
      return {
        kind: "floor",
        item: createNewPlacementItem(
          selectedCatalogItem,
          "path",
          cursorTile,
        ),
      };
    case "fence":
      assertCatalogItemIdPrefix(selectedCatalogItem, "fence:");
      return {
        kind: "fence",
        item: createNewPlacementItem(
          selectedCatalogItem,
          "fence",
          cursorTile,
        ),
      };
    case "placeable":
      assertPlaceableCatalogItemId(selectedCatalogItem);
      return {
        kind: "item",
        item: createNewPlacementItem(
          selectedCatalogItem,
          "item",
          cursorTile,
        ),
      };
    case "decor":
      assertResourceClumpCatalogItem(selectedCatalogItem);
      return {
        kind: "item",
        item: createNewPlacementItem(
          selectedCatalogItem,
          "item",
          cursorTile,
        ),
      };
  }
}

function createNewPlacementItem(
  catalogItem: CatalogItem,
  layer: "item" | "path" | "fence",
  cursorTile: MapTileCoordinates,
): NewPlacementItem {
  const furnitureRenderingMetadata = getFurnitureRenderingMetadata(catalogItem);

  return {
    itemId: catalogItem.id,
    x: cursorTile.x,
    y: cursorTile.y,
    layer,
    rotation: 0,
    footprint: catalogItem.tileSize,
    variant: 0,
    tintColor: "#ffffff",
    locked: false,
    isRug: furnitureRenderingMetadata?.isRug ?? false,
    isGrass: false,
    isTable: furnitureRenderingMetadata?.isTable ?? false,
    isLongTable: furnitureRenderingMetadata?.isLongTable ?? false,
    flipped: false,
    bedType: furnitureRenderingMetadata?.bedType ?? null,
  };
}

function getFurnitureRenderingMetadata(
  catalogItem: CatalogItem,
): Extract<CatalogItem["renderingMetadata"], { kind: "furniture" }> | null {
  const renderingMetadata = catalogItem.renderingMetadata;

  return renderingMetadata?.kind === "furniture" ? renderingMetadata : null;
}

function createPlacementSnapshotAction(
  candidate: PlacementValidationCandidate,
): PlacementSnapshotAction {
  switch (candidate.kind) {
    case "building":
      return { type: "add-building", building: candidate.building };
    case "crop":
      return { type: "add-crop", crop: candidate.crop };
    case "item":
      return { type: "add-item", item: candidate.item };
    case "floor":
    case "fence":
      return { type: "add-item", item: candidate.item };
  }
}

function assertPlaceableCatalogItemId(catalogItem: CatalogItem): void {
  const validCatalogItemPrefixes = [
    "object:",
    "big-craftable:",
    "furniture_",
    "fruittree_",
    "wildtree_",
  ];

  if (
    !validCatalogItemPrefixes.some(
      (validCatalogItemPrefix) =>
        catalogItem.id.startsWith(validCatalogItemPrefix) &&
        catalogItem.id.length > validCatalogItemPrefix.length,
    )
  ) {
    throw new TypeError(
      `Editor placement placeable catalog ID must match an approved object, big-craftable, furniture_, fruittree_, or wildtree_ identifier; received ${describeValue(catalogItem.id)}.`,
    );
  }
}

function assertResourceClumpCatalogItem(catalogItem: CatalogItem): void {
  if (!isResourceClumpCatalogItemId(catalogItem.id)) {
    throw new TypeError(
      `Editor placement decor catalog ID must be one of clump_600, clump_602, clump_622, or clump_672; received ${describeValue(catalogItem.id)}.`,
    );
  }
}

function readBuildingMetadataId(catalogItemId: string): string {
  const buildingPrefix = "building:";

  if (!catalogItemId.startsWith(buildingPrefix)) {
    throw new TypeError(
      `Editor placement building catalog ID must match "building:<metadata ID>"; received ${describeValue(catalogItemId)}.`,
    );
  }

  const buildingMetadataId = catalogItemId.slice(buildingPrefix.length);

  if (buildingMetadataId.length === 0) {
    throw new TypeError(
      `Editor placement building catalog ID must match "building:<metadata ID>"; received ${describeValue(catalogItemId)}.`,
    );
  }

  return buildingMetadataId;
}

function assertCatalogItemIdPrefix(
  catalogItem: CatalogItem,
  requiredPrefix: "crop:" | "floor:" | "fence:",
): void {
  if (
    !catalogItem.id.startsWith(requiredPrefix) ||
    catalogItem.id.length === requiredPrefix.length
  ) {
    throw new TypeError(
      `Editor placement ${catalogItem.category} catalog ID must match ${JSON.stringify(`${requiredPrefix}<ID>`)}; received ${describeValue(catalogItem.id)}.`,
    );
  }
}

function assertEditorCursorPlacementInput(
  editorCursorPlacementInput: EditorCursorPlacementInput,
): void {
  assertNonNullObject(editorCursorPlacementInput, "input");
  assertMapTileCoordinates(editorCursorPlacementInput.cursorTile);

  if (
    editorCursorPlacementInput.freePlacement !== undefined &&
    typeof editorCursorPlacementInput.freePlacement !== "boolean"
  ) {
    throw new TypeError(
      `Editor placement freePlacement must be a boolean or undefined; received ${describeValue(editorCursorPlacementInput.freePlacement)}.`,
    );
  }

  assertPlacementHistory(editorCursorPlacementInput.placementHistory);

  if (editorCursorPlacementInput.selectedCatalogItem !== null) {
    assertCatalogItem(editorCursorPlacementInput.selectedCatalogItem);
  }
}

function assertPlacementHistory(
  placementHistory: PlacementHistory<PlacementSnapshot>,
): void {
  assertNonNullObject(placementHistory, "placementHistory");

  if (!Array.isArray(placementHistory.undoStates)) {
    throw new TypeError(
      `Editor placement placementHistory.undoStates must be an array; received ${describeValue(placementHistory.undoStates)}.`,
    );
  }

  if (!Array.isArray(placementHistory.redoStates)) {
    throw new TypeError(
      `Editor placement placementHistory.redoStates must be an array; received ${describeValue(placementHistory.redoStates)}.`,
    );
  }

  createPersistentPlacementSnapshot(placementHistory.currentState);
  placementHistory.undoStates.forEach((placementSnapshot) => {
    createPersistentPlacementSnapshot(placementSnapshot);
  });
  placementHistory.redoStates.forEach((placementSnapshot) => {
    createPersistentPlacementSnapshot(placementSnapshot);
  });
}

function assertCatalogItem(catalogItem: CatalogItem): void {
  assertNonNullObject(catalogItem, "selectedCatalogItem");

  if (typeof catalogItem.id !== "string" || catalogItem.id.length === 0) {
    throw new TypeError(
      `Editor placement selected catalog item ID must be a non-empty string; received ${describeValue(catalogItem.id)}.`,
    );
  }

  if (
    catalogItem.category !== "building" &&
    catalogItem.category !== "crop" &&
    catalogItem.category !== "placeable" &&
    catalogItem.category !== "decor" &&
    catalogItem.category !== "floor" &&
    catalogItem.category !== "fence"
  ) {
    throw new TypeError(
      `Editor placement selected catalog item category must be one of building, crop, placeable, decor, floor, or fence; received ${describeValue(catalogItem.category)}.`,
    );
  }
}

function assertMapTileCoordinates(cursorTile: MapTileCoordinates): void {
  assertNonNullObject(cursorTile, "cursorTile");
  assertNonNegativeSafeInteger(cursorTile.x, "cursorTile.x");
  assertNonNegativeSafeInteger(cursorTile.y, "cursorTile.y");
}

function assertNonNegativeSafeInteger(value: unknown, fieldName: string): void {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new RangeError(
      `Editor placement ${fieldName} must be a non-negative safe integer; received ${describeValue(value)}.`,
    );
  }
}

function assertNonNullObject(value: unknown, fieldName: string): void {
  if (typeof value !== "object" || value === null) {
    throw new TypeError(
      `Editor placement ${fieldName} must be a non-null object; received ${describeValue(value)}.`,
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
