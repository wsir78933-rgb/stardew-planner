import type {
  BuildingPlacementMetadataById,
  CatalogItem,
  CatalogPresentationChoice,
} from "../catalog";
import {
  createRandomFurnitureCompositeVariant,
  gateCatalogItemId,
  getFloorCatalogPlacementRequirement,
  validateCatalogItemPresentationChoice,
} from "../catalog";
import { isResourceClumpCatalogItemId } from "../catalog/resource-clumps";
import {
  getCatalogItemPlacementRequirement,
  isMultiTileCropCatalogItem,
} from "../placement/catalog-item-placement-requirement";
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
  type PlacementItem,
  type PlacementSnapshot,
  type PlacementSnapshotAction,
} from "../placement/placement-snapshot";
import { getPlacementItemZIndex } from "../placement/placement-item-z-order";
import {
  validatePlacement,
  type PlacementValidationCandidate,
  type PlacementValidationResult,
} from "../placement/placement-validation";

export type EditorCursorPlacementInput = Readonly<{
  catalogPresentationChoice: CatalogPresentationChoice | null;
  selectedCatalogItem: CatalogItem | null;
  cursorTile: MapTileCoordinates;
  mapPlacementGrid: MapPlacementGrid;
  buildingMetadataById: BuildingPlacementMetadataById;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  freePlacement?: boolean;
  randomFractionSource?: () => number;
  resolvedCompositeVariant?: number;
}>;

export type EditorCursorPlacementPreviewInput = Readonly<{
  catalogPresentationChoice: CatalogPresentationChoice | null;
  selectedCatalogItem: CatalogItem | null;
  cursorTile: MapTileCoordinates;
  mapPlacementGrid: MapPlacementGrid;
  buildingMetadataById: BuildingPlacementMetadataById;
  placementSnapshot: PlacementSnapshot;
  freePlacement?: boolean;
  resolvedCompositeVariant?: number;
}>;

type EditorCursorPlacementCandidateConstruction =
  | Readonly<{
      kind: "candidate";
      candidate: PlacementValidationCandidate;
    }>
  | Readonly<{ kind: "no-selected-catalog-item" }>
  | Readonly<{
      kind: "unsupported-catalog-category";
      category: "placeable";
    }>;

export type EditorCursorPlacementPreviewResult =
  | Readonly<{
      previewable: true;
      candidate: PlacementValidationCandidate;
      previewAction: PlacementSnapshotAction;
      targetMode: "map" | "held-item" | "invalid-held-item-target";
      targetParentInstanceId?: number;
      targetReason?: "long-table" | "occupied-table";
      validation: PlacementValidationResult | Readonly<{ valid: false }>;
    }>
  | Readonly<{
      previewable: false;
      reason: "no-selected-catalog-item";
    }>
  | Readonly<{
      previewable: false;
      reason: "unsupported-catalog-category";
      category: "placeable";
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
    }>
  | Readonly<{
      applied: false;
      placementHistory: PlacementHistory<PlacementSnapshot>;
      reason: "invalid-held-item-target";
      targetReason: "long-table" | "occupied-table";
    }>;

type EditorCursorPlacementResolution =
  | Readonly<{
      kind: "resolved";
      candidate: PlacementValidationCandidate;
      action: PlacementSnapshotAction;
      targetMode: "map" | "held-item";
      targetParentInstanceId?: number;
      validation: PlacementValidationResult;
    }>
  | Readonly<{
      kind: "invalid-held-item-target";
      candidate: PlacementValidationCandidate;
      previewAction: PlacementSnapshotAction;
      targetMode: "invalid-held-item-target";
      targetParentInstanceId: number;
      targetReason: "long-table" | "occupied-table";
      validation: Readonly<{ valid: false }>;
    }>
  | Readonly<{ kind: "no-selected-catalog-item" }>
  | Readonly<{
      kind: "unsupported-catalog-category";
      category: "placeable";
    }>;

export function applyEditorCursorPlacement(
  editorCursorPlacementInput: EditorCursorPlacementInput,
): EditorCursorPlacementResult {
  assertEditorCursorPlacementInput(editorCursorPlacementInput);
  const { placementHistory } = editorCursorPlacementInput;
  const placementResolution = resolveEditorCursorPlacement({
    ...editorCursorPlacementInput,
    placementSnapshot: placementHistory.currentState,
    randomFractionSource:
      editorCursorPlacementInput.resolvedCompositeVariant === undefined
        ? editorCursorPlacementInput.randomFractionSource ?? Math.random
        : editorCursorPlacementInput.randomFractionSource,
  });

  if (placementResolution.kind === "no-selected-catalog-item") {
    return {
      applied: false,
      reason: "no-selected-catalog-item",
      placementHistory,
    };
  }
  if (placementResolution.kind === "unsupported-catalog-category") {
    return {
      applied: false,
      reason: "unsupported-catalog-category",
      category: placementResolution.category,
      placementHistory,
    };
  }
  if (placementResolution.kind === "invalid-held-item-target") {
    return createInvalidHeldItemTargetResult(
      placementHistory,
      placementResolution.targetReason,
    );
  }
  if (!placementResolution.validation.valid) {
    return {
      applied: false,
      validation: placementResolution.validation,
      placementHistory,
    };
  }
  const nextPlacementSnapshot = applyPlacementSnapshotAction(
    placementHistory.currentState,
    placementResolution.action,
  );

  return {
    applied: true,
    validation: placementResolution.validation,
    placementHistory: commitPlacementHistory(
      placementHistory,
      nextPlacementSnapshot,
    ),
  };
}

export function evaluateEditorCursorPlacementPreview(
  editorCursorPlacementPreviewInput: EditorCursorPlacementPreviewInput,
): EditorCursorPlacementPreviewResult {
  assertEditorCursorPlacementPreviewInput(editorCursorPlacementPreviewInput);
  const placementResolution = resolveEditorCursorPlacement(
    editorCursorPlacementPreviewInput,
  );

  if (placementResolution.kind === "no-selected-catalog-item") {
    return { previewable: false, reason: "no-selected-catalog-item" };
  }
  if (placementResolution.kind === "unsupported-catalog-category") {
    return {
      previewable: false,
      reason: "unsupported-catalog-category",
      category: placementResolution.category,
    };
  }

  const isInvalidHeldItemTarget =
    placementResolution.kind === "invalid-held-item-target";

  return {
    previewable: true,
    candidate: placementResolution.candidate,
    previewAction: isInvalidHeldItemTarget
      ? placementResolution.previewAction
      : placementResolution.action,
    targetMode: placementResolution.targetMode,
    ...(placementResolution.targetParentInstanceId === undefined
      ? {}
      : { targetParentInstanceId: placementResolution.targetParentInstanceId }),
    ...(isInvalidHeldItemTarget
      ? { targetReason: placementResolution.targetReason }
      : {}),
    validation: placementResolution.validation,
  };
}

function resolveEditorCursorPlacement(
  input: Readonly<{
    buildingMetadataById: BuildingPlacementMetadataById;
    catalogPresentationChoice: CatalogPresentationChoice | null;
    cursorTile: MapTileCoordinates;
    freePlacement?: boolean;
    mapPlacementGrid: MapPlacementGrid;
    placementSnapshot: PlacementSnapshot;
    randomFractionSource?: () => number;
    resolvedCompositeVariant?: number;
    selectedCatalogItem: CatalogItem | null;
  }>,
): EditorCursorPlacementResolution {
  const candidateConstruction = createEditorCursorPlacementCandidate(input);

  if (candidateConstruction.kind !== "candidate") {
    return candidateConstruction;
  }
  const selectedCatalogItem = input.selectedCatalogItem;
  if (selectedCatalogItem === null) {
    throw new Error("Editor placement candidate requires a selected catalog item.");
  }
  const candidate = candidateConstruction.candidate;

  if (isHeldItemAttachmentCandidate(candidate, selectedCatalogItem)) {
    const targetPlacementItem = findTopmostTableLikeItemAtTile(
      input.placementSnapshot.items,
      input.cursorTile,
    );
    if (targetPlacementItem !== null) {
      const invalidTargetReason = getInvalidHeldItemTargetReason(
        targetPlacementItem,
      );
      if (invalidTargetReason !== null) {
        return {
          kind: "invalid-held-item-target",
          candidate,
          previewAction: createPlacementSnapshotAction(candidate),
          targetMode: "invalid-held-item-target",
          targetParentInstanceId: targetPlacementItem.instanceId,
          targetReason: invalidTargetReason,
          validation: { valid: false },
        };
      }
      const resolvedCandidate = createRandomizedCompositeCandidate(
        candidate,
        selectedCatalogItem,
        input.randomFractionSource,
        input.resolvedCompositeVariant,
      );
      if (resolvedCandidate.kind !== "item") {
        throw new Error(
          `Editor placement attachment candidate changed from item to ${describeValue(resolvedCandidate.kind)}.`,
        );
      }
      return {
        kind: "resolved",
        candidate: resolvedCandidate,
        action: {
          type: "attach-held-item",
          parentInstanceId: targetPlacementItem.instanceId,
          item: { ...resolvedCandidate.item, layer: "item" },
        },
        targetMode: "held-item",
        targetParentInstanceId: targetPlacementItem.instanceId,
        validation: { valid: true },
      };
    }
  }

  const validation = validateEditorCursorPlacementCandidate({
    buildingMetadataById: input.buildingMetadataById,
    candidate,
    freePlacement: input.freePlacement,
    mapPlacementGrid: input.mapPlacementGrid,
    placementSnapshot: input.placementSnapshot,
  });
  const resolvedCandidate = createRandomizedCompositeCandidate(
    candidate,
    selectedCatalogItem,
    validation.valid ? input.randomFractionSource : undefined,
    input.resolvedCompositeVariant,
  );

  return {
    kind: "resolved",
    candidate: resolvedCandidate,
    action: createPlacementSnapshotAction(resolvedCandidate),
    targetMode: "map",
    validation,
  };
}

function createEditorCursorPlacementCandidate(
  input: Readonly<{
    catalogPresentationChoice: CatalogPresentationChoice | null;
    selectedCatalogItem: CatalogItem | null;
    cursorTile: MapTileCoordinates;
    buildingMetadataById: BuildingPlacementMetadataById;
  }>,
): EditorCursorPlacementCandidateConstruction {
  const { selectedCatalogItem } = input;

  if (selectedCatalogItem === null) {
    return { kind: "no-selected-catalog-item" };
  }

  const candidate = createPlacementCandidate(
    selectedCatalogItem,
    input.cursorTile,
    requireCatalogPresentationChoice(input),
  );

  if (candidate === null) {
    if (selectedCatalogItem.category !== "placeable") {
      throw new Error(
        `Editor placement has no candidate implementation for catalog category ${describeValue(selectedCatalogItem.category)}.`,
      );
    }

    return { kind: "unsupported-catalog-category", category: "placeable" };
  }

  assertCandidateBuildingMetadata(candidate, input.buildingMetadataById);
  return { kind: "candidate", candidate };
}

function validateEditorCursorPlacementCandidate(
  input: Readonly<{
    buildingMetadataById: BuildingPlacementMetadataById;
    candidate: PlacementValidationCandidate;
    freePlacement: boolean | undefined;
    mapPlacementGrid: MapPlacementGrid;
    placementSnapshot: PlacementSnapshot;
  }>,
): PlacementValidationResult {
  return validatePlacement({
    mapPlacementGrid: input.mapPlacementGrid,
    placementSnapshot: input.placementSnapshot,
    buildingMetadataById: input.buildingMetadataById,
    candidate: input.candidate,
    freePlacement: input.freePlacement,
  });
}

function createInvalidHeldItemTargetResult(
  placementHistory: PlacementHistory<PlacementSnapshot>,
  targetReason: "long-table" | "occupied-table",
): EditorCursorPlacementResult {
  return {
    applied: false,
    placementHistory,
    reason: "invalid-held-item-target",
    targetReason,
  };
}

function getInvalidHeldItemTargetReason(
  targetPlacementItem: PlacementItem,
): "long-table" | "occupied-table" | null {
  if (targetPlacementItem.isLongTable || !targetPlacementItem.isTable) {
    return "long-table";
  }
  if (
    targetPlacementItem.heldItem !== undefined
    || targetPlacementItem.heldItemId !== undefined
  ) {
    return "occupied-table";
  }
  return null;
}

function isHeldItemAttachmentCandidate(
  candidate: PlacementValidationCandidate,
  selectedCatalogItem: CatalogItem,
): candidate is Extract<PlacementValidationCandidate, { kind: "item" }> {
  const furnitureRenderingMetadata = getFurnitureRenderingMetadata(
    selectedCatalogItem,
  );

  return candidate.kind === "item"
    && candidate.item.layer === "item"
    && candidate.item.footprint.width === 1
    && candidate.item.footprint.height === 1
    && furnitureRenderingMetadata !== null
    && !furnitureRenderingMetadata.wallMounted;
}

function findTopmostTableLikeItemAtTile(
  placementItems: readonly PlacementItem[],
  cursorTile: MapTileCoordinates,
): PlacementItem | null {
  let topmostTableLikeItem: PlacementItem | null = null;
  let topmostZIndex = Number.NEGATIVE_INFINITY;

  for (const placementItem of placementItems) {
    if (
      (!placementItem.isTable && !placementItem.isLongTable)
      || !isTileInsidePlacementItem(cursorTile, placementItem)
    ) {
      continue;
    }
    const placementItemZIndex = getPlacementItemZIndex(placementItem);
    if (placementItemZIndex >= topmostZIndex) {
      topmostTableLikeItem = placementItem;
      topmostZIndex = placementItemZIndex;
    }
  }

  return topmostTableLikeItem;
}

function isTileInsidePlacementItem(
  cursorTile: MapTileCoordinates,
  placementItem: PlacementItem,
): boolean {
  return cursorTile.x >= placementItem.x
    && cursorTile.x < placementItem.x + placementItem.footprint.width
    && cursorTile.y >= placementItem.y
    && cursorTile.y < placementItem.y + placementItem.footprint.height;
}

function createRandomizedCompositeCandidate(
  candidate: PlacementValidationCandidate,
  selectedCatalogItem: CatalogItem,
  randomFractionSource: (() => number) | undefined,
  resolvedCompositeVariant: number | undefined,
): PlacementValidationCandidate {
  const renderingMetadata = selectedCatalogItem.renderingMetadata;

  if (
    candidate.kind !== "item"
    || renderingMetadata?.kind !== "furniture"
    || renderingMetadata.compositeSprite === null
  ) {
    if (resolvedCompositeVariant !== undefined) {
      throw new TypeError(
        `Editor placement resolvedCompositeVariant requires randomized composite furniture; received item ${describeValue(selectedCatalogItem.id)} with variant ${describeValue(resolvedCompositeVariant)}.`,
      );
    }
    return candidate;
  }

  if (
    resolvedCompositeVariant !== undefined
    && (!Number.isSafeInteger(resolvedCompositeVariant)
      || resolvedCompositeVariant < 0)
  ) {
    throw new RangeError(
      `Editor placement resolvedCompositeVariant must be a non-negative safe integer; received ${describeValue(resolvedCompositeVariant)}.`,
    );
  }

  const compositeVariant = resolvedCompositeVariant
    ?? (randomFractionSource === undefined
      ? candidate.item.variant
      : createRandomFurnitureCompositeVariant(
          renderingMetadata.compositeSprite,
          randomFractionSource,
        ));

  return {
    ...candidate,
    item: {
      ...candidate.item,
      variant: compositeVariant,
    },
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
  catalogPresentationChoice: CatalogPresentationChoice,
): PlacementValidationCandidate | null {
  switch (selectedCatalogItem.category) {
    case "building":
      return {
        kind: "building",
        building: {
          buildingId: readBuildingMetadataId(selectedCatalogItem.id),
          ...(catalogPresentationChoice.variant === 0
            ? {}
            : { variant: catalogPresentationChoice.variant }),
          x: cursorTile.x,
          y: cursorTile.y,
        },
      };
    case "crop":
      assertCatalogItemIdPrefix(selectedCatalogItem, "crop:");
      if (isMultiTileCropCatalogItem(selectedCatalogItem)) {
        return {
          kind: "item",
          placementRequirement: getCatalogItemPlacementRequirement(selectedCatalogItem),
          item: createNewPlacementItem(
            selectedCatalogItem,
            "item",
            cursorTile,
            catalogPresentationChoice,
          ),
        };
      }
      return {
        kind: "crop",
        crop: { cropId: selectedCatalogItem.id, x: cursorTile.x, y: cursorTile.y },
      };
    case "floor":
      if (getFloorCatalogPlacementRequirement(selectedCatalogItem) === "passable") {
        assertCatalogItemIdPrefix(selectedCatalogItem, "floor:");
      }
      return {
        kind: "floor",
        item: createNewPlacementItem(
          selectedCatalogItem,
          "path",
          cursorTile,
          catalogPresentationChoice,
        ),
      };
    case "fence":
      assertFenceCatalogItemId(selectedCatalogItem);
      return {
        kind: "fence",
        item: createNewPlacementItem(
          selectedCatalogItem,
          "fence",
          cursorTile,
          catalogPresentationChoice,
        ),
      };
    case "placeable":
      assertPlaceableCatalogItemId(selectedCatalogItem);
      return {
        kind: "item",
        placementRequirement: getCatalogItemPlacementRequirement(selectedCatalogItem),
        item: createNewPlacementItem(
          selectedCatalogItem,
          "item",
          cursorTile,
          catalogPresentationChoice,
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
          catalogPresentationChoice,
        ),
      };
  }
}

function createNewPlacementItem(
  catalogItem: CatalogItem,
  layer: "item" | "path" | "fence",
  cursorTile: MapTileCoordinates,
  catalogPresentationChoice: CatalogPresentationChoice,
): NewPlacementItem {
  const furnitureRenderingMetadata = getFurnitureRenderingMetadata(catalogItem);

  return {
    itemId: catalogItem.id,
    x: cursorTile.x,
    y: cursorTile.y,
    layer,
    rotation: catalogPresentationChoice.rotation,
    footprint: getCatalogItemPlacementFootprint(
      catalogItem,
      catalogPresentationChoice,
    ),
    variant: catalogPresentationChoice.variant,
    tintColor: "#ffffff",
    locked: false,
    isRug: furnitureRenderingMetadata?.isRug ?? false,
    isGrass: false,
    isTable: furnitureRenderingMetadata?.isTable ?? false,
    isLongTable: furnitureRenderingMetadata?.isLongTable ?? false,
    flipped: catalogPresentationChoice.flipped,
    bedType: furnitureRenderingMetadata?.bedType ?? null,
  };
}

function getCatalogItemPlacementFootprint(
  catalogItem: CatalogItem,
  catalogPresentationChoice: CatalogPresentationChoice,
): CatalogItem["tileSize"] {
  const rotationCapability = catalogItem.presentationCapabilities?.rotation;
  if (rotationCapability === null || rotationCapability === undefined) {
    return catalogItem.tileSize;
  }
  const rotationFootprint =
    rotationCapability.footprints[catalogPresentationChoice.rotation];
  if (rotationFootprint === undefined) {
    throw new RangeError(
      `Editor placement catalog item ${describeValue(catalogItem.id)} has no footprint for rotation ${describeValue(catalogPresentationChoice.rotation)}.`,
    );
  }
  return rotationFootprint;
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

function assertFenceCatalogItemId(catalogItem: CatalogItem): void {
  if (catalogItem.id === gateCatalogItemId) {
    return;
  }

  assertCatalogItemIdPrefix(catalogItem, "fence:");
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

  if (
    editorCursorPlacementInput.randomFractionSource !== undefined
    && typeof editorCursorPlacementInput.randomFractionSource !== "function"
  ) {
    throw new TypeError(
      `Editor placement randomFractionSource must be a function or undefined; received ${describeValue(editorCursorPlacementInput.randomFractionSource)}.`,
    );
  }

  assertPlacementHistory(editorCursorPlacementInput.placementHistory);

  if (editorCursorPlacementInput.selectedCatalogItem !== null) {
    assertCatalogItem(editorCursorPlacementInput.selectedCatalogItem);
    validateCatalogItemPresentationChoice(
      editorCursorPlacementInput.selectedCatalogItem,
      requireCatalogPresentationChoice(editorCursorPlacementInput),
    );
  } else if (editorCursorPlacementInput.catalogPresentationChoice !== null) {
    throw new TypeError(
      `Editor placement catalogPresentationChoice must be null without a selected catalog item; received ${describeValue(editorCursorPlacementInput.catalogPresentationChoice)}.`,
    );
  }
}

function assertEditorCursorPlacementPreviewInput(
  editorCursorPlacementPreviewInput: EditorCursorPlacementPreviewInput,
): void {
  assertNonNullObject(editorCursorPlacementPreviewInput, "input");
  assertMapTileCoordinates(editorCursorPlacementPreviewInput.cursorTile);

  if (
    editorCursorPlacementPreviewInput.freePlacement !== undefined &&
    typeof editorCursorPlacementPreviewInput.freePlacement !== "boolean"
  ) {
    throw new TypeError(
      `Editor placement preview freePlacement must be a boolean or undefined; received ${describeValue(editorCursorPlacementPreviewInput.freePlacement)}.`,
    );
  }

  createPersistentPlacementSnapshot(
    editorCursorPlacementPreviewInput.placementSnapshot,
  );

  if (editorCursorPlacementPreviewInput.selectedCatalogItem !== null) {
    assertCatalogItem(editorCursorPlacementPreviewInput.selectedCatalogItem);
    validateCatalogItemPresentationChoice(
      editorCursorPlacementPreviewInput.selectedCatalogItem,
      requireCatalogPresentationChoice(editorCursorPlacementPreviewInput),
    );
  } else if (editorCursorPlacementPreviewInput.catalogPresentationChoice !== null) {
    throw new TypeError(
      `Editor placement preview catalogPresentationChoice must be null without a selected catalog item; received ${describeValue(editorCursorPlacementPreviewInput.catalogPresentationChoice)}.`,
    );
  }
}

function requireCatalogPresentationChoice(
  editorCursorPlacementInput: Readonly<{
    catalogPresentationChoice: CatalogPresentationChoice | null;
    selectedCatalogItem: CatalogItem | null;
  }>,
): CatalogPresentationChoice {
  const catalogPresentationChoice =
    editorCursorPlacementInput.catalogPresentationChoice;
  if (catalogPresentationChoice === null) {
    throw new TypeError(
      `Editor placement catalogPresentationChoice must be a non-null object for selected catalog item ${describeValue(editorCursorPlacementInput.selectedCatalogItem?.id)}; received null.`,
    );
  }
  return catalogPresentationChoice;
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
