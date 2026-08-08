import type {
  BuildingPlacementMetadata,
  BuildingPlacementMetadataById,
} from "../catalog/building-placement-metadata";
import { getPathItemPlacementRequirement } from "../catalog/hoe-dirt";
import { crabPotCatalogItemId } from "../catalog/crab-pot";
import {
  gardenPotCatalogItemId,
  isGardenPotAtTile,
} from "./garden-pot-placement";
import {
  getMapPlacementCapabilities,
  type MapPlacementCapabilities,
  type MapPlacementGrid,
  type MapTileCoordinates,
} from "./map-placement-grids";
import {
  createPersistentPlacementSnapshot,
  type NewPlacementBuilding,
  type NewPlacementItem,
  type PlacementCrop,
  type PlacementItem,
  type PlacementSnapshot,
} from "./placement-snapshot";
import {
  assertPlacementBedType,
  getBedPlacementSemantics,
  type BedPlacementSemantics,
} from "./bed-placement-semantics";
import type { CatalogItemPlacementRequirement } from "./catalog-item-placement-requirement";

export type PlacementValidationRejectionReason =
  | "outside-map"
  | "not-buildable"
  | "not-diggable"
  | "not-passable"
  | "not-wall"
  | "not-crab-pot-tile"
  | "occupied-by-building"
  | "occupied-by-crop"
  | "occupied-by-item"
  | "occupied-by-fence"
  | "occupied-by-path"
  | "occupied-by-tree-or-grass";

export type PlacementValidationResult =
  | Readonly<{ valid: true }>
  | Readonly<{
      valid: false;
      reason: PlacementValidationRejectionReason;
      tile: MapTileCoordinates;
    }>;

export type BuildingPlacementValidationCandidate = Readonly<{
  kind: "building";
  building: NewPlacementBuilding;
}>;

export type CropPlacementValidationCandidate = Readonly<{
  kind: "crop";
  crop: PlacementCrop;
}>;

export type ItemPlacementValidationCandidate = Readonly<{
  kind: "item";
  item: NewPlacementItem;
  placementRequirement?: CatalogItemPlacementRequirement;
}>;

export type FloorPlacementValidationCandidate = Readonly<{
  kind: "floor";
  item: NewPlacementItem;
}>;

export type FencePlacementValidationCandidate = Readonly<{
  kind: "fence";
  item: NewPlacementItem;
}>;

export type PlacementValidationCandidate =
  | BuildingPlacementValidationCandidate
  | CropPlacementValidationCandidate
  | ItemPlacementValidationCandidate
  | FloorPlacementValidationCandidate
  | FencePlacementValidationCandidate;

export type PlacementItemPredicates = Readonly<{
  isTree?: (item: PlacementItem) => boolean;
  isGrass?: (item: PlacementItem) => boolean;
}>;

export type PlacementValidationInput = Readonly<{
  mapPlacementGrid: MapPlacementGrid;
  placementSnapshot: PlacementSnapshot;
  buildingMetadataById: BuildingPlacementMetadataById;
  candidate: PlacementValidationCandidate;
  itemPredicates?: PlacementItemPredicates;
  freePlacement?: boolean;
}>;

export function validatePlacement(
  placementValidationInput: PlacementValidationInput,
): PlacementValidationResult {
  assertPlacementValidationInput(placementValidationInput);
  const freePlacement = placementValidationInput.freePlacement === true;

  if (freePlacement) {
    return { valid: true };
  }

  assertPlacementValidationDependencies(placementValidationInput);

  const placementSnapshot = createPersistentPlacementSnapshot(
    placementValidationInput.placementSnapshot,
  );

  const { candidate, mapPlacementGrid } = placementValidationInput;

  switch (candidate.kind) {
    case "building":
      return validateBuildingPlacement(
        candidate.building,
        placementSnapshot,
        placementValidationInput.buildingMetadataById,
        mapPlacementGrid,
      );
    case "crop":
      return validateCropPlacement(
        candidate.crop,
        placementSnapshot,
        placementValidationInput.buildingMetadataById,
        mapPlacementGrid,
      );
    case "item":
      return validateItemPlacement(
        candidate.item,
        placementSnapshot,
        placementValidationInput.buildingMetadataById,
        mapPlacementGrid,
        candidate.placementRequirement,
      );
    case "floor":
      return validateFloorPlacement(
        candidate.item,
        placementSnapshot,
        mapPlacementGrid,
        placementValidationInput.itemPredicates,
      );
    case "fence":
      return validateFencePlacement(
        candidate.item,
        placementSnapshot,
        mapPlacementGrid,
        placementValidationInput.itemPredicates,
      );
  }
}

type BuildingPlacementTileRequirement = Readonly<{
  tile: MapTileCoordinates;
  mapRequirement: "buildable" | "passable" | "none";
}>;

type BuildingBlockingOccupancy = ReadonlyMap<
  string,
  "occupied-by-building" | "occupied-by-crop" | "occupied-by-item" | "occupied-by-fence"
>;

type BlockingOccupancy = Map<
  string,
  "occupied-by-building" | "occupied-by-crop" | "occupied-by-item" | "occupied-by-fence"
>;

function validateBuildingPlacement(
  candidateBuilding: NewPlacementBuilding,
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
  mapPlacementGrid: MapPlacementGrid,
): PlacementValidationResult {
  const candidateMetadata = getRequiredBuildingMetadata(
    buildingMetadataById,
    candidateBuilding.buildingId,
  );
  const candidateTileRequirements = createBuildingTileRequirements(
    candidateBuilding,
    candidateMetadata,
  );

  for (const tileRequirement of candidateTileRequirements) {
    const capabilitiesOrRejection = getPlacementCapabilitiesOrRejection(
      mapPlacementGrid,
      tileRequirement.tile,
    );

    if (isPlacementValidationRejection(capabilitiesOrRejection)) {
      return capabilitiesOrRejection;
    }

    const capabilities = capabilitiesOrRejection;

    if (
      tileRequirement.mapRequirement === "buildable" &&
      !capabilities.buildable
    ) {
      return rejectPlacement("not-buildable", tileRequirement.tile);
    }

    if (
      tileRequirement.mapRequirement === "passable" &&
      !capabilities.passable
    ) {
      return rejectPlacement("not-passable", tileRequirement.tile);
    }
  }

  const blockingOccupancy = createBuildingBlockingOccupancy(
    placementSnapshot,
    buildingMetadataById,
  );

  for (const tileRequirement of candidateTileRequirements) {
    const blockingReason = blockingOccupancy.get(tileKey(tileRequirement.tile));

    if (blockingReason !== undefined) {
      return rejectPlacement(blockingReason, tileRequirement.tile);
    }
  }

  return { valid: true };
}

function validateCropPlacement(
  candidateCrop: PlacementCrop,
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
  mapPlacementGrid: MapPlacementGrid,
): PlacementValidationResult {
  const candidateTile = createCandidateTile(candidateCrop.x, candidateCrop.y);
  const capabilitiesOrRejection = getPlacementCapabilitiesOrRejection(
    mapPlacementGrid,
    candidateTile,
  );

  if (isPlacementValidationRejection(capabilitiesOrRejection)) {
    return capabilitiesOrRejection;
  }

  const capabilities = capabilitiesOrRejection;

  const cropIsInGardenPot = isGardenPotAtTile(
    placementSnapshot.items,
    candidateTile,
  );

  if (!cropIsInGardenPot && !capabilities.diggable) {
    return rejectPlacement("not-diggable", candidateTile);
  }

  const blockingReason = createCropBlockingOccupancy(
    placementSnapshot,
    buildingMetadataById,
  ).get(tileKey(candidateTile));

  if (blockingReason !== undefined) {
    return rejectPlacement(blockingReason, candidateTile);
  }

  return { valid: true };
}

function validateItemPlacement(
  candidateItem: NewPlacementItem,
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
  mapPlacementGrid: MapPlacementGrid,
  placementRequirement: CatalogItemPlacementRequirement = "passable",
): PlacementValidationResult {
  if (candidateItem.bedType !== null) {
    return validateBedPlacement(
      candidateItem,
      placementSnapshot,
      buildingMetadataById,
      mapPlacementGrid,
    );
  }

  const candidateTiles = createCandidateItemTiles(candidateItem);

  for (const candidateTile of candidateTiles) {
    const capabilitiesOrRejection = getPlacementCapabilitiesOrRejection(
      mapPlacementGrid,
      candidateTile,
    );

    if (isPlacementValidationRejection(capabilitiesOrRejection)) {
      return capabilitiesOrRejection;
    }

    if (candidateItem.itemId === crabPotCatalogItemId) {
      if (!capabilitiesOrRejection.crabPot) {
        return rejectPlacement("not-crab-pot-tile", candidateTile);
      }
    } else if (placementRequirement === "wall" && !capabilitiesOrRejection.wall) {
      return rejectPlacement("not-wall", candidateTile);
    } else if (
      placementRequirement === "diggable"
      && !capabilitiesOrRejection.diggable
    ) {
      return rejectPlacement("not-diggable", candidateTile);
    } else if (!capabilitiesOrRejection.passable) {
      return rejectPlacement("not-passable", candidateTile);
    }

    if (
      !candidateItem.isRug
      && isTileReservedByExistingDoubleBed(
        placementSnapshot.items,
        candidateTile,
      )
    ) {
      return rejectPlacement("occupied-by-item", candidateTile);
    }
  }

  const blockingOccupancy = createItemBlockingOccupancy(
    placementSnapshot,
    buildingMetadataById,
    candidateItem,
  );

  for (const candidateTile of candidateTiles) {
    const blockingReason = blockingOccupancy.get(tileKey(candidateTile));

    if (blockingReason !== undefined) {
      return rejectPlacement(blockingReason, candidateTile);
    }
  }

  return { valid: true };
}

function validateBedPlacement(
  candidateBed: NewPlacementItem,
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
  mapPlacementGrid: MapPlacementGrid,
): PlacementValidationResult {
  const bedSemantics = getBedPlacementSemantics({
    bedType: requireConcreteBedType(candidateBed.bedType),
    footprint: candidateBed.footprint,
    rotation: candidateBed.rotation,
  });
  const bedTileRequirements = createBedTileRequirements(
    candidateBed,
    bedSemantics,
  );

  const rowMajorValidation = validateBedRowMajorRequirements(
    bedTileRequirements,
    placementSnapshot,
    buildingMetadataById,
    mapPlacementGrid,
  );
  if (rowMajorValidation !== null) {
    return rowMajorValidation;
  }

  const exitValidation = validateCandidateBedExitClearance(
    candidateBed,
    bedSemantics,
    placementSnapshot.items,
  );
  if (exitValidation !== null) {
    return exitValidation;
  }

  const itemBlockingOccupancy = createBedItemBlockingOccupancy(
    placementSnapshot.items,
  );
  for (const candidateTile of createCandidateItemTiles(candidateBed)) {
    const itemBlockingReason = itemBlockingOccupancy.get(tileKey(candidateTile));
    if (itemBlockingReason !== undefined) {
      return rejectPlacement(itemBlockingReason, candidateTile);
    }
  }

  const buildingBlockingOccupancy = createBuildingBlockingOccupancyOnly(
    placementSnapshot,
    buildingMetadataById,
  );
  for (const candidateTile of createCandidateItemTiles(candidateBed)) {
    if (buildingBlockingOccupancy.has(tileKey(candidateTile))) {
      return rejectPlacement("occupied-by-building", candidateTile);
    }
  }

  return { valid: true };
}

type BedTileRequirement = Readonly<{
  tile: MapTileCoordinates;
  collidesWithTerrain: boolean;
}>;

function createBedTileRequirements(
  candidateBed: NewPlacementItem,
  bedSemantics: BedPlacementSemantics,
): readonly BedTileRequirement[] {
  const bedTileRequirements: BedTileRequirement[] = [];

  for (let rowIndex = 0; rowIndex < candidateBed.footprint.height; rowIndex += 1) {
    const collisionMaskRow = bedSemantics.collisionMask[rowIndex];
    if (collisionMaskRow === undefined) {
      throw new Error(
        `Placement validation bed collision mask has no row ${String(rowIndex)}; received ${describeValue(bedSemantics.collisionMask)}.`,
      );
    }

    for (
      let columnIndex = 0;
      columnIndex < candidateBed.footprint.width;
      columnIndex += 1
    ) {
      const collidesWithTerrain = collisionMaskRow[columnIndex];
      if (collidesWithTerrain === undefined) {
        throw new Error(
          `Placement validation bed collision mask row ${String(rowIndex)} has no column ${String(columnIndex)}; received ${describeValue(collisionMaskRow)}.`,
        );
      }

      bedTileRequirements.push({
        tile: createCandidateTile(
          candidateBed.x + columnIndex,
          candidateBed.y + rowIndex,
        ),
        collidesWithTerrain,
      });
    }
  }

  return bedTileRequirements;
}

function validateBedRowMajorRequirements(
  bedTileRequirements: readonly BedTileRequirement[],
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
  mapPlacementGrid: MapPlacementGrid,
): Extract<PlacementValidationResult, { valid: false }> | null {
  let terrainOccupancy: BlockingOccupancy | null = null;

  for (const bedTileRequirement of bedTileRequirements) {
    const capabilitiesOrRejection = getPlacementCapabilitiesOrRejection(
      mapPlacementGrid,
      bedTileRequirement.tile,
    );
    if (isPlacementValidationRejection(capabilitiesOrRejection)) {
      return capabilitiesOrRejection;
    }

    if (!bedTileRequirement.collidesWithTerrain) {
      continue;
    }

    if (!capabilitiesOrRejection.passable) {
      return rejectPlacement("not-passable", bedTileRequirement.tile);
    }

    if (
      isTileReservedByExistingDoubleBed(
        placementSnapshot.items,
        bedTileRequirement.tile,
      )
    ) {
      return rejectPlacement("occupied-by-item", bedTileRequirement.tile);
    }

    terrainOccupancy ??= createBuildingAndCropBlockingOccupancy(
      placementSnapshot,
      buildingMetadataById,
    );
    const terrainBlockingReason = terrainOccupancy.get(
      tileKey(bedTileRequirement.tile),
    );
    if (terrainBlockingReason !== undefined) {
      return rejectPlacement(terrainBlockingReason, bedTileRequirement.tile);
    }
  }

  return null;
}

function validateCandidateBedExitClearance(
  candidateBed: NewPlacementItem,
  bedSemantics: BedPlacementSemantics,
  existingItems: readonly PlacementItem[],
): Extract<PlacementValidationResult, { valid: false }> | null {
  const exitBlockers = bedSemantics.exitOffsets.map((exitOffset) => {
    const exitTile = createBedExitTile(
      candidateBed.x + exitOffset.x,
      candidateBed.y + exitOffset.y,
    );

    return {
      exitTile,
      blockingReason: getBedExitBlockingReason(existingItems, exitTile),
    };
  });

  if (candidateBed.bedType === "double") {
    const requiredExit = exitBlockers[0];
    if (requiredExit?.blockingReason !== undefined) {
      return rejectPlacement(requiredExit.blockingReason, requiredExit.exitTile);
    }

    return null;
  }

  if (candidateBed.bedType === "single") {
    const everyExitIsBlocked = exitBlockers.length === 2
      && exitBlockers.every(
        (exitBlocker) => exitBlocker.blockingReason !== undefined,
      );
    if (everyExitIsBlocked) {
      const firstExitBlocker = exitBlockers[0];
      if (firstExitBlocker === undefined || firstExitBlocker.blockingReason === undefined) {
        throw new Error(
          `Placement validation single bed must have a first blocked exit; received ${describeValue(exitBlockers)}.`,
        );
      }

      return rejectPlacement(
        firstExitBlocker.blockingReason,
        firstExitBlocker.exitTile,
      );
    }
  }

  return null;
}

function createBedExitTile(x: number, y: number): MapTileCoordinates {
  assertSafeInteger(x, "bed exit.x");
  assertSafeInteger(y, "bed exit.y");

  return { x, y };
}

function getBedExitBlockingReason(
  existingItems: readonly PlacementItem[],
  exitTile: MapTileCoordinates,
): "occupied-by-item" | "occupied-by-fence" | undefined {
  const blockingItem = existingItems.find(
    (existingItem) =>
      existingItem.layer !== "path"
      && !existingItem.isRug
      && isPlacementItemAtTile(existingItem, exitTile),
  );

  if (blockingItem === undefined) {
    return undefined;
  }

  return blockingItem.layer === "fence"
    ? "occupied-by-fence"
    : "occupied-by-item";
}

function createBedItemBlockingOccupancy(
  existingItems: readonly PlacementItem[],
): ReadonlyMap<string, "occupied-by-item" | "occupied-by-fence"> {
  const occupancyByTile = new Map<
    string,
    "occupied-by-item" | "occupied-by-fence"
  >();

  addItemBlockingOccupancy(
    occupancyByTile,
    existingItems,
    (existingItem) =>
      existingItem.layer !== "path"
      && !existingItem.isRug
      && !existingItem.isGrass,
  );

  return occupancyByTile;
}

function createBuildingBlockingOccupancyOnly(
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
): ReadonlyMap<string, "occupied-by-building"> {
  const occupancyByTile = new Map<string, "occupied-by-building">();

  for (const existingBuilding of placementSnapshot.buildings) {
    const existingMetadata = getRequiredBuildingMetadata(
      buildingMetadataById,
      existingBuilding.buildingId,
    );

    for (const tileRequirement of createBuildingTileRequirements(
      existingBuilding,
      existingMetadata,
      createExistingTile,
    )) {
      occupancyByTile.set(tileKey(tileRequirement.tile), "occupied-by-building");
    }
  }

  return occupancyByTile;
}

function isTileReservedByExistingDoubleBed(
  existingItems: readonly PlacementItem[],
  candidateTile: MapTileCoordinates,
): boolean {
  return existingItems.some((existingItem) => {
    if (existingItem.bedType !== "double") {
      return false;
    }

    const bedSemantics = getBedPlacementSemantics({
      bedType: existingItem.bedType,
      footprint: existingItem.footprint,
      rotation: existingItem.rotation,
    });
    const exitOffset = bedSemantics.exitOffsets[0];
    if (exitOffset === undefined) {
      throw new Error(
        `Placement validation double bed ${describeValue(existingItem.instanceId)} has no exit offset; received ${describeValue(bedSemantics.exitOffsets)}.`,
      );
    }

    return candidateTile.x === existingItem.x + exitOffset.x
      && candidateTile.y === existingItem.y + exitOffset.y;
  });
}

function isPlacementItemAtTile(
  placementItem: PlacementItem,
  tile: MapTileCoordinates,
): boolean {
  return tile.x >= placementItem.x
    && tile.x < placementItem.x + placementItem.footprint.width
    && tile.y >= placementItem.y
    && tile.y < placementItem.y + placementItem.footprint.height;
}

function requireConcreteBedType(
  bedType: NewPlacementItem["bedType"],
): "single" | "double" | "child" {
  assertPlacementBedType(bedType);

  if (bedType === null) {
    throw new TypeError(
      "Placement validation bed type must not be null; received null.",
    );
  }

  return bedType;
}

function validateFloorPlacement(
  candidateItem: NewPlacementItem,
  placementSnapshot: PlacementSnapshot,
  mapPlacementGrid: MapPlacementGrid,
  itemPredicates: PlacementItemPredicates | undefined,
): PlacementValidationResult {
  const candidateTiles = createCandidateItemTiles(candidateItem);
  const mapRequirement = getPathItemPlacementRequirement(candidateItem);

  for (const candidateTile of candidateTiles) {
    const capabilitiesOrRejection = getPlacementCapabilitiesOrRejection(
      mapPlacementGrid,
      candidateTile,
    );

    if (isPlacementValidationRejection(capabilitiesOrRejection)) {
      return capabilitiesOrRejection;
    }

    if (mapRequirement === "diggable" && !capabilitiesOrRejection.diggable) {
      return rejectPlacement("not-diggable", candidateTile);
    }

    if (mapRequirement === "passable" && !capabilitiesOrRejection.passable) {
      return rejectPlacement("not-passable", candidateTile);
    }
  }

  const blockingOccupancy = createFloorBlockingOccupancy(
    placementSnapshot,
    itemPredicates,
  );

  for (const candidateTile of candidateTiles) {
    const blockingReason = blockingOccupancy.get(tileKey(candidateTile));

    if (blockingReason !== undefined) {
      return rejectPlacement(blockingReason, candidateTile);
    }
  }

  return { valid: true };
}

function validateFencePlacement(
  candidateItem: NewPlacementItem,
  placementSnapshot: PlacementSnapshot,
  mapPlacementGrid: MapPlacementGrid,
  itemPredicates: PlacementItemPredicates | undefined,
): PlacementValidationResult {
  const candidateTiles = createCandidateItemTiles(candidateItem);

  for (const candidateTile of candidateTiles) {
    const capabilitiesOrRejection = getPlacementCapabilitiesOrRejection(
      mapPlacementGrid,
      candidateTile,
    );

    if (isPlacementValidationRejection(capabilitiesOrRejection)) {
      return capabilitiesOrRejection;
    }

    if (!capabilitiesOrRejection.passable) {
      return rejectPlacement("not-passable", candidateTile);
    }
  }

  const blockingOccupancy = createFenceBlockingOccupancy(
    placementSnapshot,
    itemPredicates,
  );

  for (const candidateTile of candidateTiles) {
    const blockingReason = blockingOccupancy.get(tileKey(candidateTile));

    if (blockingReason !== undefined) {
      return rejectPlacement(blockingReason, candidateTile);
    }
  }

  return { valid: true };
}

function createBuildingTileRequirements(
  building: NewPlacementBuilding,
  buildingMetadata: BuildingPlacementMetadata,
  createTile: (x: number, y: number) => MapTileCoordinates = createCandidateTile,
): readonly BuildingPlacementTileRequirement[] {
  const tileRequirements: BuildingPlacementTileRequirement[] = [];

  for (const [rowIndex, collisionMapRow] of buildingMetadata.collisionMap.entries()) {
    for (const [columnIndex, collisionMapCell] of collisionMapRow.entries()) {
      tileRequirements.push({
        tile: createTile(
          building.x + columnIndex,
          building.y + rowIndex,
        ),
        mapRequirement: collisionMapCell.requiresBuildable
          ? "buildable"
          : "none",
      });
    }
  }

  for (const additionalPlacementTile of buildingMetadata.additionalPlacementTiles) {
    for (let yOffset = 0; yOffset < additionalPlacementTile.height; yOffset += 1) {
      for (let xOffset = 0; xOffset < additionalPlacementTile.width; xOffset += 1) {
        tileRequirements.push({
          tile: createTile(
            building.x + additionalPlacementTile.x + xOffset,
            building.y + additionalPlacementTile.y + yOffset,
          ),
          mapRequirement: additionalPlacementTile.onlyNeedsToBePassable
            ? "passable"
            : "buildable",
        });
      }
    }
  }

  if (buildingMetadata.humanDoor.x !== -1) {
    tileRequirements.push({
      tile: createTile(
        building.x + buildingMetadata.humanDoor.x,
        building.y + buildingMetadata.humanDoor.y,
      ),
      mapRequirement: "buildable",
    });
  }

  return tileRequirements;
}

function createBuildingBlockingOccupancy(
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
): BuildingBlockingOccupancy {
  const occupancyByTile = createBuildingAndCropBlockingOccupancy(
    placementSnapshot,
    buildingMetadataById,
  );

  addItemBlockingOccupancy(
    occupancyByTile,
    placementSnapshot.items,
    (existingItem) => existingItem.layer !== "path",
  );

  return occupancyByTile;
}

function createCropBlockingOccupancy(
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
): BuildingBlockingOccupancy {
  const occupancyByTile = createBuildingAndCropBlockingOccupancy(
    placementSnapshot,
    buildingMetadataById,
  );

  addItemBlockingOccupancy(
    occupancyByTile,
    placementSnapshot.items,
    (existingItem) =>
      existingItem.layer !== "path"
      && existingItem.itemId !== gardenPotCatalogItemId,
  );

  return occupancyByTile;
}

function createItemBlockingOccupancy(
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
  candidateItem: NewPlacementItem,
): BuildingBlockingOccupancy {
  const occupancyByTile = createBuildingAndCropBlockingOccupancy(
    placementSnapshot,
    buildingMetadataById,
  );

  addItemBlockingOccupancy(
    occupancyByTile,
    placementSnapshot.items,
    (existingItem) => doesExistingItemBlockCandidateItem(
      existingItem,
      candidateItem,
    ),
  );

  return occupancyByTile;
}

function createBuildingAndCropBlockingOccupancy(
  placementSnapshot: PlacementSnapshot,
  buildingMetadataById: BuildingPlacementMetadataById,
): BlockingOccupancy {
  const occupancyByTile: BlockingOccupancy = new Map();

  for (const existingBuilding of placementSnapshot.buildings) {
    const existingMetadata = getRequiredBuildingMetadata(
      buildingMetadataById,
      existingBuilding.buildingId,
    );

    for (const tileRequirement of createBuildingTileRequirements(
      existingBuilding,
      existingMetadata,
      createExistingTile,
    )) {
      occupancyByTile.set(tileKey(tileRequirement.tile), "occupied-by-building");
    }
  }

  for (const existingCrop of placementSnapshot.crops) {
    occupancyByTile.set(
      tileKey(createExistingTile(existingCrop.x, existingCrop.y)),
      "occupied-by-crop",
    );
  }

  return occupancyByTile;
}

function addItemBlockingOccupancy(
  occupancyByTile: BlockingOccupancy,
  placementItems: readonly PlacementItem[],
  blocksPlacement: (placementItem: PlacementItem) => boolean,
): void {
  for (const existingItem of placementItems) {
    if (!blocksPlacement(existingItem)) {
      continue;
    }

    const blockingReason = existingItem.layer === "fence"
      ? "occupied-by-fence"
      : "occupied-by-item";

    for (const itemTile of createItemTiles(existingItem)) {
      occupancyByTile.set(tileKey(itemTile), blockingReason);
    }
  }
}

function doesExistingItemBlockCandidateItem(
  existingItem: PlacementItem,
  candidateItem: NewPlacementItem,
): boolean {
  if (candidateItem.isRug) {
    return existingItem.layer === "item" && existingItem.isRug;
  }

  return existingItem.layer !== "path" && !existingItem.isRug;
}

function createFloorBlockingOccupancy(
  placementSnapshot: PlacementSnapshot,
  itemPredicates: PlacementItemPredicates | undefined,
): ReadonlyMap<
  string,
  "occupied-by-path" | "occupied-by-crop" | "occupied-by-tree-or-grass"
> {
  const occupancyByTile = new Map<
    string,
    "occupied-by-path" | "occupied-by-crop" | "occupied-by-tree-or-grass"
  >();

  for (const existingCrop of placementSnapshot.crops) {
    occupancyByTile.set(
      tileKey(createExistingTile(existingCrop.x, existingCrop.y)),
      "occupied-by-crop",
    );
  }

  for (const existingItem of placementSnapshot.items) {
    const blockingReason = existingItem.layer === "path"
      ? "occupied-by-path"
      : isTreeOrGrass(existingItem, itemPredicates)
      ? "occupied-by-tree-or-grass"
      : undefined;

    if (blockingReason === undefined) {
      continue;
    }

    for (const itemTile of createItemTiles(existingItem)) {
      occupancyByTile.set(tileKey(itemTile), blockingReason);
    }
  }

  return occupancyByTile;
}

function createFenceBlockingOccupancy(
  placementSnapshot: PlacementSnapshot,
  itemPredicates: PlacementItemPredicates | undefined,
): ReadonlyMap<string, "occupied-by-item" | "occupied-by-fence"> {
  const occupancyByTile = new Map<
    string,
    "occupied-by-item" | "occupied-by-fence"
  >();

  for (const existingItem of placementSnapshot.items) {
    const blockingReason = existingItem.layer === "fence"
      ? "occupied-by-fence"
      : existingItem.layer === "item" &&
          !existingItem.isRug &&
          !isGrass(existingItem, itemPredicates)
      ? "occupied-by-item"
      : undefined;

    if (blockingReason === undefined) {
      continue;
    }

    for (const itemTile of createItemTiles(existingItem)) {
      occupancyByTile.set(tileKey(itemTile), blockingReason);
    }
  }

  return occupancyByTile;
}

function createCandidateItemTiles(
  item: NewPlacementItem,
): readonly MapTileCoordinates[] {
  return createItemTiles(item, createCandidateTile);
}

function createItemTiles(
  item: Pick<PlacementItem, "x" | "y" | "footprint">,
  createTile: (x: number, y: number) => MapTileCoordinates = createExistingTile,
): readonly MapTileCoordinates[] {
  const itemTiles: MapTileCoordinates[] = [];

  for (let yOffset = 0; yOffset < item.footprint.height; yOffset += 1) {
    for (let xOffset = 0; xOffset < item.footprint.width; xOffset += 1) {
      itemTiles.push(createTile(item.x + xOffset, item.y + yOffset));
    }
  }

  return itemTiles;
}

function isTreeOrGrass(
  item: PlacementItem,
  itemPredicates: PlacementItemPredicates | undefined,
): boolean {
  return itemPredicates?.isTree?.(item) === true ||
    isGrass(item, itemPredicates);
}

function isGrass(
  item: PlacementItem,
  itemPredicates: PlacementItemPredicates | undefined,
): boolean {
  return item.isGrass || itemPredicates?.isGrass?.(item) === true;
}

function getRequiredBuildingMetadata(
  buildingMetadataById: BuildingPlacementMetadataById,
  buildingId: string,
): BuildingPlacementMetadata {
  const buildingMetadata = buildingMetadataById[buildingId];

  if (buildingMetadata === undefined) {
    throw new Error(
      `Placement validation received unknown building ID ${describeValue(buildingId)}.`,
    );
  }

  return buildingMetadata;
}

function rejectPlacement(
  reason: PlacementValidationRejectionReason,
  tile: MapTileCoordinates,
): Extract<PlacementValidationResult, { valid: false }> {
  return { valid: false, reason, tile };
}

function getPlacementCapabilitiesOrRejection(
  mapPlacementGrid: MapPlacementGrid,
  tile: MapTileCoordinates,
): MapPlacementCapabilities | Extract<PlacementValidationResult, { valid: false }> {
  if (
    tile.x >= mapPlacementGrid.width ||
    tile.y >= mapPlacementGrid.height
  ) {
    return rejectPlacement("outside-map", tile);
  }

  return getMapPlacementCapabilities(mapPlacementGrid, tile);
}

function isPlacementValidationRejection(
  placementCapabilitiesOrRejection:
    | MapPlacementCapabilities
    | Extract<PlacementValidationResult, { valid: false }>,
): placementCapabilitiesOrRejection is Extract<
  PlacementValidationResult,
  { valid: false }
> {
  return "valid" in placementCapabilitiesOrRejection;
}

function assertPlacementValidationInput(
  placementValidationInput: PlacementValidationInput,
): void {
  if (
    typeof placementValidationInput !== "object" ||
    placementValidationInput === null
  ) {
    throw new TypeError(
      `Placement validation input must be a non-null object; received ${describeValue(placementValidationInput)}.`,
    );
  }

  if (placementValidationInput.freePlacement !== undefined &&
    typeof placementValidationInput.freePlacement !== "boolean") {
    throw new TypeError(
      `Placement validation freePlacement must be a boolean or undefined; received ${describeValue(placementValidationInput.freePlacement)}.`,
    );
  }

  const { candidate } = placementValidationInput;
  assertNonNullObject(candidate, "candidate");

  switch (candidate.kind) {
    case "building":
      assertBuildingCandidate(candidate.building);
      return;
    case "crop":
      assertCropCandidate(candidate.crop);
      return;
    case "item":
      assertItemCandidate(candidate.item, "item", "item");
      assertItemPlacementRequirement(candidate.placementRequirement);
      return;
    case "floor":
      assertItemCandidate(candidate.item, "path", "floor");
      return;
    case "fence":
      assertItemCandidate(candidate.item, "fence", "fence");
      return;
    default:
      throw new TypeError(
        `Placement validation candidate kind must be one of building, crop, item, floor, or fence; received ${describeValue((candidate as Readonly<Record<string, unknown>>).kind)}.`,
      );
  }
}

function assertItemPlacementRequirement(
  placementRequirement: unknown,
): void {
  if (
    placementRequirement !== undefined &&
    placementRequirement !== "diggable" &&
    placementRequirement !== "passable" &&
    placementRequirement !== "wall"
  ) {
    throw new TypeError(
      `Placement validation item placementRequirement must be \"diggable\", \"passable\", \"wall\", or undefined; received ${describeValue(placementRequirement)}.`,
    );
  }
}

function assertPlacementValidationDependencies(
  placementValidationInput: PlacementValidationInput,
): void {
  assertNonNullObject(
    placementValidationInput.mapPlacementGrid,
    "mapPlacementGrid",
  );
  assertNonNullObject(
    placementValidationInput.placementSnapshot,
    "placementSnapshot",
  );
  assertNonNullObject(
    placementValidationInput.buildingMetadataById,
    "buildingMetadataById",
  );
  assertPlacementItemPredicates(placementValidationInput.itemPredicates);
}

function assertBuildingCandidate(building: NewPlacementBuilding): void {
  assertNonNullObject(building, "building candidate");
  assertCandidateCoordinates(building.x, building.y, "building");

  if (typeof building.buildingId !== "string" || building.buildingId.length === 0) {
    throw new TypeError(
      `Placement validation building ID must be a non-empty string; received ${describeValue(building.buildingId)}.`,
    );
  }
}

function assertCropCandidate(crop: PlacementCrop): void {
  assertNonNullObject(crop, "crop candidate");
  assertCandidateCoordinates(crop.x, crop.y, "crop");

  if (typeof crop.cropId !== "string" || crop.cropId.length === 0) {
    throw new TypeError(
      `Placement validation crop ID must be a non-empty string; received ${describeValue(crop.cropId)}.`,
    );
  }
}

function assertItemCandidate(
  item: NewPlacementItem,
  expectedLayer: "item" | "path" | "fence",
  candidateKind: "item" | "floor" | "fence",
): void {
  assertNonNullObject(item, `${candidateKind} item candidate`);
  assertCandidateCoordinates(item.x, item.y, `${candidateKind} item`);

  if (item.layer !== expectedLayer) {
    throw new TypeError(
      `Placement validation ${candidateKind} candidate item layer must be ${JSON.stringify(expectedLayer)}; received ${describeValue(item.layer)}.`,
    );
  }

  if (typeof item.itemId !== "string" || item.itemId.length === 0) {
    throw new TypeError(
      `Placement validation ${candidateKind} item.itemId must be a non-empty string; received ${describeValue(item.itemId)}.`,
    );
  }

  assertSafeInteger(item.rotation, `${candidateKind} item.rotation`);
  assertSafeInteger(item.variant, `${candidateKind} item.variant`);

  if (typeof item.tintColor !== "string" || item.tintColor.length === 0) {
    throw new TypeError(
      `Placement validation ${candidateKind} item.tintColor must be a non-empty string; received ${describeValue(item.tintColor)}.`,
    );
  }

  for (const booleanFieldName of [
    "locked",
    "isRug",
    "isGrass",
    "isTable",
    "isLongTable",
    "flipped",
  ] as const) {
    if (typeof item[booleanFieldName] !== "boolean") {
      throw new TypeError(
        `Placement validation ${candidateKind} item.${booleanFieldName} must be a boolean; received ${describeValue(item[booleanFieldName])}.`,
      );
    }
  }

  if (item.isRug && item.layer !== "item") {
    throw new TypeError(
      `Placement validation ${candidateKind} item isRug true requires layer "item"; received ${describeValue(item.layer)}.`,
    );
  }

  assertPlacementBedType(item.bedType);

  if (item.bedType !== null) {
    if (item.isRug) {
      throw new TypeError(
        `Placement validation ${candidateKind} item bedType ${describeValue(item.bedType)} cannot be combined with isRug true; received ${describeValue(item.isRug)}.`,
      );
    }

    getBedPlacementSemantics({
      bedType: item.bedType,
      footprint: item.footprint,
      rotation: item.rotation,
    });
  }

  if (
    item.heldItemId !== undefined &&
    (typeof item.heldItemId !== "string" || item.heldItemId.length === 0)
  ) {
    throw new TypeError(
      `Placement validation ${candidateKind} item.heldItemId must be a non-empty string or undefined; received ${describeValue(item.heldItemId)}.`,
    );
  }

  assertNonNullObject(item.footprint, `${candidateKind} item footprint`);
  assertPositiveSafeInteger(item.footprint.width, `${candidateKind} item footprint.width`);
  assertPositiveSafeInteger(item.footprint.height, `${candidateKind} item footprint.height`);
}

function assertPlacementItemPredicates(
  itemPredicates: PlacementItemPredicates | undefined,
): void {
  if (itemPredicates === undefined) {
    return;
  }

  assertNonNullObject(itemPredicates, "itemPredicates");

  for (const predicateName of ["isTree", "isGrass"] as const) {
    const predicate = itemPredicates[predicateName];

    if (predicate !== undefined && typeof predicate !== "function") {
      throw new TypeError(
        `Placement validation itemPredicates.${predicateName} must be a function or undefined; received ${describeValue(predicate)}.`,
      );
    }
  }
}

function assertCandidateCoordinates(
  x: unknown,
  y: unknown,
  fieldName: string,
): void {
  assertSafeInteger(x, `${fieldName}.x`);
  assertSafeInteger(y, `${fieldName}.y`);

  if (x < 0 || y < 0) {
    throw new RangeError(
      `Placement validation ${fieldName} coordinates must be non-negative; received x ${String(x)}, y ${String(y)}.`,
    );
  }
}

function assertNonNullObject(value: unknown, fieldName: string): void {
  if (typeof value !== "object" || value === null) {
    throw new TypeError(
      `Placement validation ${fieldName} must be a non-null object; received ${describeValue(value)}.`,
    );
  }
}

function createCandidateTile(x: number, y: number): MapTileCoordinates {
  assertCandidateCoordinates(x, y, "tile");

  return { x, y };
}

function createExistingTile(x: number, y: number): MapTileCoordinates {
  assertSafeInteger(x, "existing tile.x");
  assertSafeInteger(y, "existing tile.y");

  return { x, y };
}

function tileKey(tile: MapTileCoordinates): string {
  return `${String(tile.x)},${String(tile.y)}`;
}

function assertSafeInteger(value: unknown, fieldName: string): asserts value is number {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(
      `Placement validation field ${JSON.stringify(fieldName)} must be a safe integer; received ${describeValue(value)}.`,
    );
  }
}

function assertPositiveSafeInteger(
  value: unknown,
  fieldName: string,
): asserts value is number {
  assertSafeInteger(value, fieldName);

  if (value <= 0) {
    throw new RangeError(
      `Placement validation field ${JSON.stringify(fieldName)} must be positive; received ${String(value)}.`,
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
