import type {
  Catalog,
  CatalogBuildingMultilayerLayer,
  CatalogCropRenderingMetadata,
  CatalogItem,
  CatalogItemTool,
  CatalogPresentationCapabilities,
  CatalogSourceRect,
} from "./catalog-types";
import { createFrozenBuildingCompositionCatalogProperties } from "./building-composition";
import { createFurnitureCatalogItems } from "./furniture";
import { createHoeDirtCatalogItem } from "./hoe-dirt";
import { createCrabPotCatalogRenderingProperties } from "./crab-pot";
import { createObjectPlacementShadowProperties } from "./object-placement-shadows";
import { gateCatalogItemId, gateRenderingMetadata, isGateFenceRecordId } from "./gates";
import { getLockedLitBigCraftableRenderingMetadata } from "./lit-big-craftable-definitions";
import { getLockedPaintableChestMetadata } from "./paintable-chests";
import { createSeasonalPlaceableCatalogProperties } from "./seasonal-placeables";
import { getLockedNightLightDescriptor } from "../night-lights/locked-night-light-definitions";
import { createResourceClumpCatalogItems } from "./resource-clumps";
import {
  createSprinklerCatalogRenderingProperties,
  isSprinklerCatalogItemId,
} from "./sprinklers";
import {
  createFruitTreeCatalogItems,
  createWildTreeCatalogItems,
} from "./trees";
import {
  interiorFlooringPatterns,
  interiorWallpaperPatterns,
} from "../interior-decor/interior-decor-catalog";

export type CatalogDatasetUrls = Readonly<{
  buildings: string;
  crops: string;
  bigCraftables: string;
  objects: string;
  fences: string;
  floorsAndPaths: string;
  furniture: string;
  fruitTrees: string;
}>;

export type RawCatalogDatasets = Readonly<{
  buildings: unknown;
  crops: unknown;
  bigCraftables: unknown;
  objects: unknown;
  fences: unknown;
  floorsAndPaths: unknown;
  furniture: unknown;
  fruitTrees: unknown;
}>;

type RecordById = Readonly<Record<string, unknown>>;

type RecordLocation = Readonly<{
  datasetUrl: string;
  recordId: string;
}>;

const localAssetRoot = "/game-assets/1.6.15";

const expectedRecordCountByDataset = {
  buildings: 25,
  crops: 50,
  bigCraftables: 182,
  objects: 807,
  fences: 5,
  floorsAndPaths: 13,
  furniture: 645,
  fruitTrees: 8,
} as const;

const verifiedBuildingTextureNames = new Set([
  "Barn",
  "Beach Cabin",
  "Big Barn",
  "Big Coop",
  "Big Shed",
  "Coop",
  "Deluxe Barn",
  "Deluxe Coop",
  "Desert Obelisk",
  "Earth Obelisk",
  "Fish Pond",
  "Gold Clock",
  "Greenhouse",
  "Island Obelisk",
  "Junimo Hut",
  "Log Cabin",
  "Mailbox",
  "Mill",
  "Neighbor Cabin",
  "Pet Bowl",
  "Plank Cabin",
  "Rustic Cabin",
  "Shed",
  "Shipping Bin",
  "Silo",
  "Slime Hutch",
  "Stable",
  "Stone Cabin",
  "Stone Pet Bowl",
  "Trailer Cabin",
  "Water Obelisk",
  "Well",
  "houses",
  "Hay Pet Bowl",
]);

const verifiedFenceTextureNames = new Set([
  "Fence1",
  "Fence2",
  "Fence3",
  "Fence5",
]);

// The reference planner presents the building picker in this curated order,
// rather than the insertion order of Buildings.json. Keeping the source
// records intact while ordering only the projection preserves placement IDs
// and metadata but makes the visible catalog match the reference UI.
const referenceBuildingCatalogOrder = [
  "Coop",
  "Big Coop",
  "Deluxe Coop",
  "Barn",
  "Big Barn",
  "Deluxe Barn",
  "Slime Hutch",
  "Mill",
  "Fish Pond",
  "Shed",
  "Big Shed",
  "Silo",
  "Well",
  "Stable",
  "Shipping Bin",
  "Junimo Hut",
  "Pet Bowl",
  "Stone Pet Bowl",
  "Hay Pet Bowl",
  "Earth Obelisk",
  "Water Obelisk",
  "Desert Obelisk",
  "Island Obelisk",
  "Gold Clock",
  "Cabin",
  "Cabin_1",
  "Cabin_2",
  "Plank Cabin",
  "Plank Cabin_1",
  "Plank Cabin_2",
  "Log Cabin",
  "Log Cabin_1",
  "Log Cabin_2",
  "Neighbor Cabin",
  "Neighbor Cabin_1",
  "Neighbor Cabin_2",
  "Rustic Cabin",
  "Rustic Cabin_1",
  "Rustic Cabin_2",
  "Beach Cabin",
  "Beach Cabin_1",
  "Beach Cabin_2",
  "Trailer Cabin",
  "Trailer Cabin_1",
  "Trailer Cabin_2",
  "Farmhouse",
  "Farmhouse_1",
  "Farmhouse_2",
  "Greenhouse",
] as const;

const placementTools = ["cursor", "multi-select", "erase"] as const;
const fillablePlacementTools = [
  "cursor",
  "multi-select",
  "fill",
  "erase",
] as const;

// The reference planner classifies these BigCraftables into non-furniture
// groups before adding the remaining entries to its Decor catalog. Keep the
// same name-based boundary so the React projection does not invent or omit
// furniture items when the upstream dataset changes.
const referenceBigCraftableMachineNames = new Set([
  "Keg",
  "Preserves Jar",
  "Cheese Press",
  "Mayonnaise Machine",
  "Loom",
  "Oil Maker",
  "Recycling Machine",
  "Crystalarium",
  "Furnace",
  "Seed Maker",
  "Charcoal Kiln",
  "Tapper",
  "Heavy Tapper",
  "Lightning Rod",
  "Bee House",
  "Cask",
  "Worm Bin",
  "Bone Mill",
  "Geode Crusher",
  "Wood Chipper",
  "Solar Panel",
  "Ostrich Incubator",
  "Slime Incubator",
  "Slime Egg-Press",
  "Auto-Grabber",
  "Auto-Petter",
  "Mushroom Box",
  "Garden Pot",
  "Hopper",
  "Coffee Maker",
  "Sewing Machine",
  "Mini-Shipping Bin",
  "Deconstructor",
  "Workbench",
  "Farm Computer",
  "Bait Maker",
  "Dehydrator",
  "Heavy Furnace",
  "Anvil",
  "Mini-Forge",
  "Fish Smoker",
  "Deluxe Worm Bin",
  "Mushroom Log",
]);

const referenceBigCraftableLightingNames = new Set([
  "Wooden Brazier",
  "Stone Brazier",
  "Gold Brazier",
  "Campfire",
  "Stump Brazier",
  "Carved Brazier",
  "Skull Brazier",
  "Barrel Brazier",
  "Marble Brazier",
  "Wood Lamp-post",
  "Iron Lamp-post",
  "Tall Torch",
  "Bonfire",
  "Jack-O-Lantern",
]);

const referenceBigCraftableSignNames = new Set([
  "Wood Sign",
  "Stone Sign",
  "Dark Sign",
  "Text Sign",
  "Item Pedestal",
]);

const referenceBigCraftableFunctionalDecorNames = new Set([
  "Scarecrow",
  "Deluxe Scarecrow",
  "Rarecrow",
  "Chest",
  "Stone Chest",
  "Junimo Chest",
  "Big Chest",
  "Big Stone Chest",
  "Mini-Obelisk",
  "Feed Hopper",
  "Incubator",
  "Heater",
  "Tub o' Flowers",
  "Soda Machine",
  "Telephone",
  "Mini-Fridge",
  "Mini-Jukebox",
  "Camera",
  "Statue Of Endless Fortune",
  "Statue Of Perfection",
  "Statue Of True Perfection",
  "Statue Of Blessings",
  "Statue Of The Dwarf King",
]);

const referenceBigCraftableExcludedNames = new Set([
  "Door",
  "Locked Door",
  "Boulder",
  "Staircase",
  "Slime Ball",
  "Barrel",
  "Crate",
  "Cursed P.K. Arcade System",
  "Table Piece L",
  "Table Piece R",
]);
export function createCatalogFromDatasets(
  rawCatalogDatasets: RawCatalogDatasets,
  catalogDatasetUrls: CatalogDatasetUrls,
): Catalog {
  const buildingsById = assertDatasetRecordCount(
    rawCatalogDatasets.buildings,
    catalogDatasetUrls.buildings,
    expectedRecordCountByDataset.buildings,
  );
  const cropsById = assertDatasetRecordCount(
    rawCatalogDatasets.crops,
    catalogDatasetUrls.crops,
    expectedRecordCountByDataset.crops,
  );
  const bigCraftablesById = assertDatasetRecordCount(
    rawCatalogDatasets.bigCraftables,
    catalogDatasetUrls.bigCraftables,
    expectedRecordCountByDataset.bigCraftables,
  );
  const objectsById = assertDatasetRecordCount(
    rawCatalogDatasets.objects,
    catalogDatasetUrls.objects,
    expectedRecordCountByDataset.objects,
  );
  const fencesById = assertDatasetRecordCount(
    rawCatalogDatasets.fences,
    catalogDatasetUrls.fences,
    expectedRecordCountByDataset.fences,
  );
  const floorsById = assertDatasetRecordCount(
    rawCatalogDatasets.floorsAndPaths,
    catalogDatasetUrls.floorsAndPaths,
    expectedRecordCountByDataset.floorsAndPaths,
  );
  const furnitureById = assertDatasetRecordCount(
    rawCatalogDatasets.furniture,
    catalogDatasetUrls.furniture,
    expectedRecordCountByDataset.furniture,
  );
  const fruitTreesById = assertDatasetRecordCount(
    rawCatalogDatasets.fruitTrees,
    catalogDatasetUrls.fruitTrees,
    expectedRecordCountByDataset.fruitTrees,
  );

  const catalogItems = [
    ...createBuildingCatalogItems(buildingsById, catalogDatasetUrls.buildings),
    ...createCropCatalogItems(
      cropsById,
      objectsById,
      catalogDatasetUrls.crops,
      catalogDatasetUrls.objects,
    ),
    ...createBigCraftableCatalogItems(
      bigCraftablesById,
      catalogDatasetUrls.bigCraftables,
    ),
    ...createObjectCatalogItems(objectsById, catalogDatasetUrls.objects),
    createHoeDirtCatalogItem(),
    ...createFloorCatalogItems(
      floorsById,
      objectsById,
      catalogDatasetUrls.floorsAndPaths,
      catalogDatasetUrls.objects,
    ),
    ...createFenceCatalogItems(
      fencesById,
      objectsById,
      catalogDatasetUrls.fences,
      catalogDatasetUrls.objects,
    ),
    ...createFurnitureCatalogItems(
      furnitureById,
      catalogDatasetUrls.furniture,
    ),
    ...createFruitTreeCatalogItems(
      fruitTreesById,
      catalogDatasetUrls.fruitTrees,
    ),
    ...createWildTreeCatalogItems(),
    ...createResourceClumpCatalogItems(),
  ];

  return { items: catalogItems };
}

export function createBuildingCatalogFromDataset(
  rawBuildings: unknown,
  buildingsDatasetUrl: string,
): Catalog {
  const buildingsById = assertDatasetRecordCount(
    rawBuildings,
    buildingsDatasetUrl,
    expectedRecordCountByDataset.buildings,
  );

  return {
    items: createBuildingCatalogItems(buildingsById, buildingsDatasetUrl),
  };
}

export function createCropCatalogFromDatasets(
  rawCrops: unknown,
  rawObjects: unknown,
  cropsDatasetUrl: string,
  objectsDatasetUrl: string,
): Catalog {
  const cropsById = assertDatasetRecordCount(
    rawCrops,
    cropsDatasetUrl,
    expectedRecordCountByDataset.crops,
  );
  const objectsById = assertDatasetRecordCount(
    rawObjects,
    objectsDatasetUrl,
    expectedRecordCountByDataset.objects,
  );

  return {
    items: createCropCatalogItems(
      cropsById,
      objectsById,
      cropsDatasetUrl,
      objectsDatasetUrl,
    ),
  };
}

export function createPlaceableCatalogFromDatasets(
  rawBigCraftables: unknown,
  rawObjects: unknown,
  rawFences: unknown,
  rawFloorsAndPaths: unknown,
  rawFurniture: unknown,
  rawFruitTrees: unknown,
  catalogDatasetUrls: Pick<
    CatalogDatasetUrls,
    | "bigCraftables"
    | "objects"
    | "fences"
    | "floorsAndPaths"
    | "furniture"
    | "fruitTrees"
  >,
): Catalog {
  const bigCraftablesById = assertDatasetRecordCount(
    rawBigCraftables,
    catalogDatasetUrls.bigCraftables,
    expectedRecordCountByDataset.bigCraftables,
  );
  const objectsById = assertDatasetRecordCount(
    rawObjects,
    catalogDatasetUrls.objects,
    expectedRecordCountByDataset.objects,
  );
  const fencesById = assertDatasetRecordCount(
    rawFences,
    catalogDatasetUrls.fences,
    expectedRecordCountByDataset.fences,
  );
  const floorsById = assertDatasetRecordCount(
    rawFloorsAndPaths,
    catalogDatasetUrls.floorsAndPaths,
    expectedRecordCountByDataset.floorsAndPaths,
  );
  const furnitureById = assertDatasetRecordCount(
    rawFurniture,
    catalogDatasetUrls.furniture,
    expectedRecordCountByDataset.furniture,
  );
  const fruitTreesById = assertDatasetRecordCount(
    rawFruitTrees,
    catalogDatasetUrls.fruitTrees,
    expectedRecordCountByDataset.fruitTrees,
  );
  const placeableItems = [
    ...createBigCraftableCatalogItems(
      bigCraftablesById,
      catalogDatasetUrls.bigCraftables,
    ),
    ...createObjectCatalogItems(objectsById, catalogDatasetUrls.objects),
    createHoeDirtCatalogItem(),
    ...createFloorCatalogItems(
      floorsById,
      objectsById,
      catalogDatasetUrls.floorsAndPaths,
      catalogDatasetUrls.objects,
    ),
    ...createFenceCatalogItems(
      fencesById,
      objectsById,
      catalogDatasetUrls.fences,
      catalogDatasetUrls.objects,
    ),
    ...createFurnitureCatalogItems(furnitureById, catalogDatasetUrls.furniture),
    ...createFruitTreeCatalogItems(fruitTreesById, catalogDatasetUrls.fruitTrees),
    ...createWildTreeCatalogItems(),
  ];

  return {
    items: isReferenceCatalogDataset(bigCraftablesById, objectsById)
      ? [...placeableItems, ...createReferenceSupplementaryPlaceableItems()]
      : placeableItems,
  };
}

function isReferenceCatalogDataset(
  bigCraftablesById: RecordById,
  objectsById: RecordById,
): boolean {
  const scarecrowRecord = assertPlainJsonRecord(bigCraftablesById["8"], {
    datasetUrl: "BigCraftables.json",
    recordId: "8",
  });
  const sprinklerRecord = assertPlainJsonRecord(objectsById["599"], {
    datasetUrl: "Objects.json",
    recordId: "599",
  });

  return scarecrowRecord.Name === "Scarecrow" && sprinklerRecord.Name === "Sprinkler";
}

function createReferenceSupplementaryPlaceableItems(): readonly CatalogItem[] {
  const grassTextureLocalPath = `${localAssetRoot}/terrain/grass.png`;
  const mannequinTextureLocalPath = `${localAssetRoot}/tilesheets/Mannequins.png`;
  const grassItems: readonly CatalogItem[] = [
    {
      id: "grass_1",
      name: "Grass Starter",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: grassTextureLocalPath,
      sprite: { kind: "source-rect", x: 0, y: 0, width: 15, height: 20 },
      allowedTools: placementTools,
      ...createSeasonalPlaceableCatalogProperties("grass_1"),
    },
    {
      id: "grass_7",
      name: "Blue Grass Starter",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: grassTextureLocalPath,
      sprite: { kind: "source-rect", x: 0, y: 160, width: 15, height: 20 },
      allowedTools: placementTools,
      ...createSeasonalPlaceableCatalogProperties("grass_7"),
    },
  ];
  const mannequinNames = [
    ["male", "Mannequin (Male)", 2],
    ["female", "Mannequin (Female)", 6],
    ["cursed_male", "Cursed Mannequin (Male)", 10],
    ["cursed_female", "Cursed Mannequin (Female)", 14],
  ] as const;
  const mannequinItems = mannequinNames.map(([idSuffix, name, sheetIndex]) => ({
    id: `furniture_mannequin_${idSuffix}`,
    name,
    category: "placeable" as const,
    tileSize: { width: 1, height: 1 },
    textureLocalPath: mannequinTextureLocalPath,
    sprite: {
      kind: "source-rect" as const,
      x: (sheetIndex % 8) * 16,
      y: Math.floor(sheetIndex / 8) * 32,
      width: 16,
      height: 32,
    },
    allowedTools: placementTools,
  }));

  return [
    ...grassItems,
    ...mannequinItems,
    ...createResourceClumpCatalogItems(),
  ];
}

export function createDecorCatalogFromDataset(
  rawFurniture: unknown,
  furnitureDatasetUrl: string,
  rawBigCraftables: unknown,
  bigCraftablesDatasetUrl: string,
): Catalog {
  const furnitureById = assertDatasetRecordCount(
    rawFurniture,
    furnitureDatasetUrl,
    expectedRecordCountByDataset.furniture,
  );
  const bigCraftablesById = assertDatasetRecordCount(
    rawBigCraftables,
    bigCraftablesDatasetUrl,
    expectedRecordCountByDataset.bigCraftables,
  );

  return {
    items: [
      ...createFurnitureCatalogItems(furnitureById, furnitureDatasetUrl),
      ...createReferenceBigCraftableFurnitureCatalogItems(
        bigCraftablesById,
        bigCraftablesDatasetUrl,
      ),
      ...createReferenceInteriorPatternCatalogItems(),
    ],
  };
}

function createReferenceBigCraftableFurnitureCatalogItems(
  bigCraftablesById: RecordById,
  datasetUrl: string,
): readonly CatalogItem[] {
  const allBigCraftableItems = createBigCraftableCatalogItems(
    bigCraftablesById,
    datasetUrl,
  );
  const itemByRecordId = new Map(
    allBigCraftableItems.map((catalogItem) => [
      catalogItem.id.slice("big-craftable:".length),
      catalogItem,
    ]),
  );
  const nameOccurrences = new Map<string, number>();
  const furnitureItems: CatalogItem[] = [];

  for (const [recordId, rawBigCraftableRecord] of Object.entries(bigCraftablesById)) {
    const recordLocation = { datasetUrl, recordId };
    const bigCraftableRecord = assertPlainJsonRecord(
      rawBigCraftableRecord,
      recordLocation,
    );
    const catalogItem = itemByRecordId.get(recordId);
    if (catalogItem === undefined) {
      throw new Error(
        `BigCraftables dataset ${JSON.stringify(datasetUrl)} record ${JSON.stringify(recordId)} did not produce a catalog item.`,
      );
    }

    const itemName = readNonEmptyString(
      bigCraftableRecord.Name,
      "Name",
      recordLocation,
    );
    const nextOccurrence = (nameOccurrences.get(itemName) ?? 0) + 1;
    nameOccurrences.set(itemName, nextOccurrence);

    if (!isReferenceBigCraftableFurniture(
      itemName,
      bigCraftableRecord.IsLamp,
      recordLocation,
    )) {
      continue;
    }

    furnitureItems.push({
      ...catalogItem,
      name: nextOccurrence === 1 ? itemName : `${itemName} ${String(nextOccurrence)}`,
    });
  }

  return furnitureItems;
}

function isReferenceBigCraftableFurniture(
  itemName: string,
  rawIsLamp: unknown,
  recordLocation: RecordLocation,
): boolean {
  const isLamp = readOptionalBoolean(rawIsLamp, "IsLamp", recordLocation) ?? false;
  return !isLamp &&
    !referenceBigCraftableMachineNames.has(itemName) &&
    !referenceBigCraftableLightingNames.has(itemName) &&
    !referenceBigCraftableSignNames.has(itemName) &&
    !referenceBigCraftableFunctionalDecorNames.has(itemName) &&
    !referenceBigCraftableExcludedNames.has(itemName);
}

function createReferenceInteriorPatternCatalogItems(): readonly CatalogItem[] {
  const wallpaperItems = interiorWallpaperPatterns.map((pattern) => ({
    id: pattern.id,
    name: pattern.name,
    category: "decor" as const,
    interiorDecorKind: pattern.kind,
    tileSize: { width: 1, height: 1 },
    textureLocalPath: pattern.textureLocalPath,
    sprite: { kind: "source-rect" as const, ...pattern.previewRect },
    allowedTools: placementTools,
  }));
  const flooringItems = interiorFlooringPatterns.map((pattern) => ({
    id: pattern.id,
    name: pattern.name,
    category: "decor" as const,
    interiorDecorKind: pattern.kind,
    tileSize: { width: 1, height: 1 },
    textureLocalPath: pattern.textureLocalPath,
    sprite: { kind: "source-rect" as const, ...pattern.previewRect },
    allowedTools: placementTools,
  }));

  return [...wallpaperItems, ...flooringItems];
}

export function createDecorCatalog(): Catalog {
  // Keep this synchronous helper for callers that only need the editor's
  // static resource-clump items. Browser category loading uses the dataset
  // backed function above so Decor matches the reference furniture tab.
  return { items: createResourceClumpCatalogItems() };
}

function createBuildingCatalogItems(
  buildingsById: RecordById,
  datasetUrl: string,
): readonly CatalogItem[] {
  const buildingSources = createBuildingCatalogSources(buildingsById, datasetUrl);

  return orderBuildingCatalogItems(
    buildingSources.map((buildingSource) =>
      createBuildingCatalogItem(buildingSource, datasetUrl)
    ),
  );
}

type BuildingCatalogSource = Readonly<{
  buildingId: string;
  isRawBuildingRecord: boolean;
  name: string;
  rawBuildingRecord: RecordById;
  rawTexture: unknown;
  upgradeNumber: number;
}>;

function createBuildingCatalogSources(
  buildingsById: RecordById,
  datasetUrl: string,
): readonly BuildingCatalogSource[] {
  const buildingSources: BuildingCatalogSource[] = [];
  const buildingSourceById = new Map<string, BuildingCatalogSource>();

  for (const [recordId, rawBuildingRecord] of orderBuildingCatalogEntries(
    Object.entries(buildingsById),
  )) {
    const recordLocation = { datasetUrl, recordId };
    const buildingRecord = assertPlainJsonRecord(rawBuildingRecord, recordLocation);
    const baseSource: BuildingCatalogSource = {
      buildingId: recordId,
      isRawBuildingRecord: true,
      name: recordId,
      rawBuildingRecord: buildingRecord,
      rawTexture: buildingRecord.Texture,
      upgradeNumber: 0,
    };
    addUniqueBuildingCatalogSource(buildingSources, buildingSourceById, baseSource);

    const rawSkins = buildingRecord.Skins;
    if (rawSkins === undefined || rawSkins === null) {
      continue;
    }
    if (!Array.isArray(rawSkins)) {
      throw new Error(
        `${formatRecordLocation(recordLocation)} field "Skins" must be null or an array; received ${describeValue(rawSkins)}.`,
      );
    }
    rawSkins.forEach((rawSkin, skinIndex) => {
      const skinLocation = {
        datasetUrl,
        recordId: `${recordId}.Skins[${String(skinIndex)}]`,
      };
      const skinRecord = assertPlainJsonRecord(rawSkin, skinLocation);
      const skinId = readNonEmptyString(skinRecord.Id, "Id", skinLocation);
      addUniqueBuildingCatalogSource(buildingSources, buildingSourceById, {
        buildingId: skinId,
        isRawBuildingRecord: false,
        name: skinId,
        rawBuildingRecord: buildingRecord,
        rawTexture: skinRecord.Texture,
        upgradeNumber: 0,
      });
    });
  }

  for (const baseBuildingId of [
    "Cabin",
    "Plank Cabin",
    "Log Cabin",
    "Neighbor Cabin",
    "Rustic Cabin",
    "Beach Cabin",
    "Trailer Cabin",
    "Farmhouse",
  ]) {
    const baseSource = buildingSourceById.get(baseBuildingId);
    if (baseSource === undefined) {
      continue;
    }
    for (const upgradeNumber of [1, 2]) {
      const buildingId = `${baseBuildingId}_${String(upgradeNumber)}`;
      addUniqueBuildingCatalogSource(buildingSources, buildingSourceById, {
        ...baseSource,
        buildingId,
        isRawBuildingRecord: false,
        name: `${baseBuildingId === "Farmhouse" ? "Farmhouse" : baseBuildingId} (Upgrade ${String(upgradeNumber)})`,
        upgradeNumber,
      });
    }
  }

  return buildingSources;
}

function addUniqueBuildingCatalogSource(
  buildingSources: BuildingCatalogSource[],
  buildingSourceById: Map<string, BuildingCatalogSource>,
  buildingSource: BuildingCatalogSource,
): void {
  if (buildingSourceById.has(buildingSource.buildingId)) {
    throw new Error(
      `Buildings dataset produced duplicate frozen building ID ${JSON.stringify(buildingSource.buildingId)}.`,
    );
  }
  buildingSources.push(buildingSource);
  buildingSourceById.set(buildingSource.buildingId, buildingSource);
}

function createBuildingCatalogItem(
  buildingSource: BuildingCatalogSource,
  datasetUrl: string,
): CatalogItem {
  const recordLocation = {
    datasetUrl,
    recordId: buildingSource.buildingId,
  };
  const textureLocalPath = resolveBuildingTextureLocalPath(
    buildingSource.rawTexture,
    recordLocation,
  );
  const tileSize = {
    width: readPositiveInteger(
      buildingSource.rawBuildingRecord.Size,
      "X",
      recordLocation,
    ),
    height: readPositiveInteger(
      buildingSource.rawBuildingRecord.Size,
      "Y",
      recordLocation,
    ),
  };
  const sourceRect = createBuildingSourceRect(buildingSource, recordLocation);
  const drawOffset = readDrawPosition(
    buildingSource.rawBuildingRecord.DrawOffset,
    "DrawOffset",
    recordLocation,
  );
  const compositionProperties = createFrozenBuildingCompositionCatalogProperties({
    buildingId: buildingSource.buildingId,
    drawOffset,
    drawShadow: readOptionalBoolean(
      buildingSource.rawBuildingRecord.DrawShadow,
      "DrawShadow",
      recordLocation,
    ) ?? true,
    isRawBuildingRecord: buildingSource.isRawBuildingRecord,
    sourceDrawLayers: createBuildingSourceDrawLayers(
      buildingSource.rawBuildingRecord,
      recordLocation,
    ),
    sourceRect,
    sortTileOffset: readOptionalFiniteNumber(
      buildingSource.rawBuildingRecord.SortTileOffset,
      "SortTileOffset",
      recordLocation,
    ) ?? 0,
    textureLocalPath,
    tileSize,
  });

  return {
    id: `building:${buildingSource.buildingId}`,
    name: buildingSource.name,
    category: "building",
    tileSize,
    textureLocalPath,
    allowedTools: placementTools,
    ...compositionProperties,
  };
}

function createBuildingSourceRect(
  buildingSource: BuildingCatalogSource,
  recordLocation: RecordLocation,
): CatalogSourceRect {
  const sourceRect = readSourceRect(
    buildingSource.rawBuildingRecord.SourceRect,
    recordLocation,
  );
  if (buildingSource.upgradeNumber === 0) {
    return sourceRect;
  }
  if (buildingSource.buildingId.startsWith("Farmhouse_")) {
    return {
      ...sourceRect,
      y: sourceRect.y + sourceRect.height * buildingSource.upgradeNumber,
    };
  }
  const cabinSourceRect = sourceRect.width > 0
    ? sourceRect
    : { kind: "source-rect" as const, x: 0, y: 0, width: 80, height: 112 };
  return {
    ...cabinSourceRect,
    x: cabinSourceRect.x + cabinSourceRect.width * buildingSource.upgradeNumber,
  };
}

function createBuildingSourceDrawLayers(
  buildingRecord: RecordById,
  recordLocation: RecordLocation,
): readonly CatalogBuildingMultilayerLayer[] {
  const rawDrawLayers = buildingRecord.DrawLayers;
  const sourceDrawLayers: CatalogBuildingMultilayerLayer[] = [];

  if (rawDrawLayers !== undefined && rawDrawLayers !== null) {
    if (!Array.isArray(rawDrawLayers)) {
      throw new Error(
        `${formatRecordLocation(recordLocation)} field "DrawLayers" must be null or an array; received ${describeValue(rawDrawLayers)}.`,
      );
    }

    rawDrawLayers.forEach((rawDrawLayer, layerIndex) => {
      const layerLocation = {
        ...recordLocation,
        recordId: `${recordLocation.recordId}.DrawLayers[${String(layerIndex)}]`,
      };
      const drawLayer = assertPlainJsonRecord(rawDrawLayer, layerLocation);
      const sortTileOffset = readOptionalFiniteNumber(
        drawLayer.SortTileOffset,
        "SortTileOffset",
        layerLocation,
      ) ?? 0;
      if (sortTileOffset >= 1 || Boolean(drawLayer.OnlyDrawIfChestHasContents)) {
        return;
      }

      const layerId = readNonEmptyString(drawLayer.Id, "Id", layerLocation);
      const sourceRect = readSourceRect(drawLayer.SourceRect, layerLocation);
      const drawPosition = readDrawPosition(
        drawLayer.DrawPosition,
        "DrawPosition",
        layerLocation,
      );
      sourceDrawLayers.push({
        id: layerId,
        frame: sourceRect,
        offsetX: drawPosition.x,
        offsetY: drawPosition.y,
      });
    });
  }

  return sourceDrawLayers;
}

function readDrawPosition(
  rawDrawPosition: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): Readonly<{ x: number; y: number }> {
  const drawPosition = rawDrawPosition ?? "0, 0";
  if (typeof drawPosition !== "string") {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a comma-separated integer pair; received ${describeValue(drawPosition)}.`,
    );
  }
  const coordinateParts = drawPosition.split(",").map((coordinateText) => Number(coordinateText.trim()));
  if (
    coordinateParts.length !== 2 ||
    coordinateParts.some((coordinate) => !Number.isSafeInteger(coordinate))
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a comma-separated integer pair; received ${describeValue(drawPosition)}.`,
    );
  }
  const [x, y] = coordinateParts;
  return { x: x as number, y: y as number };
}

function orderBuildingCatalogItems(
  buildingItems: readonly CatalogItem[],
): readonly CatalogItem[] {
  const orderByBuildingId = new Map<string, number>(
    referenceBuildingCatalogOrder.map((buildingId, orderIndex) => [
      `building:${buildingId}`,
      orderIndex,
    ]),
  );

  return [...buildingItems].sort((first, second) => {
    const firstOrder = orderByBuildingId.get(first.id) ?? Number.MAX_SAFE_INTEGER;
    const secondOrder = orderByBuildingId.get(second.id) ?? Number.MAX_SAFE_INTEGER;
    return firstOrder - secondOrder;
  });
}

function orderBuildingCatalogEntries(
  buildingEntries: readonly (readonly [string, unknown])[],
): readonly (readonly [string, unknown])[] {
  const orderByBuildingId = new Map<string, number>(
    referenceBuildingCatalogOrder.map((buildingId, orderIndex) => [
      buildingId,
      orderIndex,
    ]),
  );

  return [...buildingEntries].sort(([firstId], [secondId]) => {
    const firstOrder = orderByBuildingId.get(firstId) ?? Number.MAX_SAFE_INTEGER;
    const secondOrder = orderByBuildingId.get(secondId) ?? Number.MAX_SAFE_INTEGER;

    return firstOrder - secondOrder;
  });
}

function createCropCatalogItems(
  cropsById: RecordById,
  objectsById: RecordById,
  cropDatasetUrl: string,
  objectDatasetUrl: string,
): readonly CatalogItem[] {
  const orderedCropGroups = createOrderedCropCatalogGroups(
    cropsById,
    objectsById,
    cropDatasetUrl,
    objectDatasetUrl,
  );
  const supplementaryForageItems = createSupplementaryForageCropItems(
    cropsById,
    objectsById,
    cropDatasetUrl,
    objectDatasetUrl,
  );
  const giantCropItems = Object.hasOwn(cropsById, "495")
    ? createGiantCropCatalogItems()
    : [];

  return [
    ...orderedCropGroups.Spring,
    ...supplementaryForageItems.Spring,
    ...orderedCropGroups.Summer,
    ...supplementaryForageItems.Summer,
    ...orderedCropGroups.Fall,
    ...supplementaryForageItems.Fall,
    ...orderedCropGroups.Winter,
    ...supplementaryForageItems.Winter,
    ...orderedCropGroups["Multi-Season"],
    ...giantCropItems,
  ];
}

type CropCatalogSeasonGroup = Readonly<{
  Spring: CatalogItem[];
  Summer: CatalogItem[];
  Fall: CatalogItem[];
  Winter: CatalogItem[];
  "Multi-Season": CatalogItem[];
}>;

function createOrderedCropCatalogGroups(
  cropsById: RecordById,
  objectsById: RecordById,
  cropDatasetUrl: string,
  objectDatasetUrl: string,
): CropCatalogSeasonGroup {
  const seasonGroups: CropCatalogSeasonGroup = {
    Spring: [],
    Summer: [],
    Fall: [],
    Winter: [],
    "Multi-Season": [],
  };

  for (const [recordId, rawCropRecord] of Object.entries(cropsById)) {
    const recordLocation = { datasetUrl: cropDatasetUrl, recordId };
    const cropRecord = assertPlainJsonRecord(rawCropRecord, recordLocation);
    const seasons = readNullableStringArray(
      cropRecord.Seasons,
      "Seasons",
      recordLocation,
    ) ?? [];
    const cropCatalogItem = createCropCatalogItem(
      recordId,
      cropRecord,
      objectsById,
      cropDatasetUrl,
      objectDatasetUrl,
    );

    if (seasons.length === 1 && isCropSeason(seasons[0])) {
      seasonGroups[seasons[0]].push(cropCatalogItem);
    } else {
      seasonGroups["Multi-Season"].push(cropCatalogItem);
    }
  }

  return seasonGroups;
}

function createCropCatalogItem(
  recordId: string,
  cropRecord: RecordById,
  objectsById: RecordById,
  cropDatasetUrl: string,
  objectDatasetUrl: string,
  itemId = `crop:${recordId}`,
  nameOverride?: string,
  spriteIndexOverride?: number,
  harvestItemIdOverride?: string,
): CatalogItem {
  const recordLocation = { datasetUrl: cropDatasetUrl, recordId };
  assertExactString(
    cropRecord.Texture,
    "TileSheets\\crops",
    "Texture",
    recordLocation,
  );
  const harvestItemId = harvestItemIdOverride ?? readNonEmptyString(
    cropRecord.HarvestItemId,
    "HarvestItemId",
    recordLocation,
  );
  const name = nameOverride ?? readReferencedObjectName(
    objectsById,
    harvestItemId,
    "HarvestItemId",
    recordLocation,
    objectDatasetUrl,
  );
  const spriteIndex = spriteIndexOverride ?? readNonNegativeInteger(
    cropRecord.SpriteIndex,
    "SpriteIndex",
    recordLocation,
  );
  const cropRenderingMetadata = createCropRenderingMetadata(
    spriteIndex,
    cropRecord,
    objectsById,
    harvestItemId,
    recordLocation,
    objectDatasetUrl,
  );

  return {
    id: itemId,
    name,
    category: "crop",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: getCropTextureLocalPath(spriteIndex),
    sprite: {
      kind: "sprite-index",
      index: spriteIndex,
    },
    allowedTools: fillablePlacementTools,
    renderingMetadata: cropRenderingMetadata,
  };
}

function createCropRenderingMetadata(
  spriteIndex: number,
  cropRecord: RecordById,
  objectsById: RecordById,
  harvestItemId: string,
  cropRecordLocation: RecordLocation,
  objectDatasetUrl: string,
): CatalogCropRenderingMetadata {
  const daysInPhaseCount = readDaysInPhaseCount(
    cropRecord.DaysInPhase,
    cropRecordLocation,
  );

  if (spriteIndex !== 23) {
    const fullyGrownRect = {
      kind: "source-rect" as const,
      x: (daysInPhaseCount + 1) * 16 + (spriteIndex % 2 !== 0 ? 128 : 0),
      y: Math.floor(spriteIndex / 2) * 32,
      width: 16,
      height: 32,
    };
    const rawTintColors = readNullableStringArray(
      cropRecord.TintColors,
      "TintColors",
      cropRecordLocation,
    ) ?? [];

    if (rawTintColors.length === 0) {
      return {
        kind: "crop",
        fullyGrownRect,
        tintColors: [],
        hasForageShadow: false,
      };
    }

    const tintColors = rawTintColors.map((tintColor) =>
      parseCropTintColor(tintColor, cropRecordLocation)
    );
    return {
      kind: "crop",
      fullyGrownRect,
      coloredRect: {
        kind: "source-rect",
        x: (daysInPhaseCount + 2) * 16 + (spriteIndex % 2 !== 0 ? 128 : 0),
        y: Math.floor(spriteIndex / 2) * 32,
        width: 16,
        height: 32,
      },
      tintColors,
      hasForageShadow: false,
    };
  }

  const objectRecord = assertPlainJsonRecord(
    objectsById[harvestItemId],
    { datasetUrl: objectDatasetUrl, recordId: harvestItemId },
  );
  const objectSpriteIndex = readNonNegativeInteger(
    objectRecord.SpriteIndex,
    "SpriteIndex",
    { datasetUrl: objectDatasetUrl, recordId: harvestItemId },
  );

  return {
    kind: "crop",
    fullyGrownRect: {
      kind: "source-rect",
      x: (objectSpriteIndex % 24) * 16,
      y: Math.floor(objectSpriteIndex / 24) * 16,
      width: 16,
      height: 16,
    },
    tintColors: [],
    hasForageShadow: true,
  };
}

function getCropTextureLocalPath(spriteIndex: number): string {
  return spriteIndex === 23
    ? `${localAssetRoot}/tilesheets/springobjects.png`
    : `${localAssetRoot}/tilesheets/crops.png`;
}

function parseCropTintColor(
  tintValue: string | undefined,
  cropRecordLocation: RecordLocation,
): number {
  if (tintValue === undefined) {
    throw new Error(
      `${formatRecordLocation(cropRecordLocation)} field "TintColors" must contain at least one color when provided.`,
    );
  }

  if (/^#[0-9a-fA-F]{6}$/.test(tintValue)) {
    return Number.parseInt(tintValue.slice(1), 16);
  }

  const namedTintColors: Readonly<Record<string, number>> = {
    Blue: 0x0000ff,
    Green: 0x00ff00,
    Red: 0xff0000,
    White: 0xffffff,
    Yellow: 0xffff00,
  };
  const parsedTintColor = namedTintColors[tintValue];
  if (parsedTintColor !== undefined) {
    return parsedTintColor;
  }

  throw new Error(
    `${formatRecordLocation(cropRecordLocation)} field "TintColors" contains unsupported color ${JSON.stringify(tintValue)}.`,
  );
}

function createSupplementaryForageCropItems(
  cropsById: RecordById,
  objectsById: RecordById,
  cropDatasetUrl: string,
  objectDatasetUrl: string,
): Readonly<CropCatalogSeasonGroup> {
  const forageDefinitions = [
    { cropRecordId: "495", season: "Spring", objectIds: ["18", "20", "22"] },
    { cropRecordId: "496", season: "Summer", objectIds: ["398", "402"] },
    { cropRecordId: "497", season: "Fall", objectIds: ["406", "408", "410"] },
    { cropRecordId: "498", season: "Winter", objectIds: ["414", "416", "418"] },
  ] as const;
  const supplementaryItems: CropCatalogSeasonGroup = {
    Spring: [],
    Summer: [],
    Fall: [],
    Winter: [],
    "Multi-Season": [],
  };
  const availableDefinitionCount = forageDefinitions.filter(({ cropRecordId }) =>
    Object.hasOwn(cropsById, cropRecordId),
  ).length;

  if (availableDefinitionCount === 0) {
    return supplementaryItems;
  }
  if (availableDefinitionCount !== forageDefinitions.length) {
    throw new Error(
      `Crops dataset must contain all four forage base records 495, 496, 497, and 498; received ${String(availableDefinitionCount)} records.`,
    );
  }

  for (const definition of forageDefinitions) {
    const rawCropRecord = cropsById[definition.cropRecordId];
    const cropRecord = assertPlainJsonRecord(rawCropRecord, {
      datasetUrl: cropDatasetUrl,
      recordId: definition.cropRecordId,
    });
    for (const objectId of definition.objectIds) {
      const objectRecord = assertPlainJsonRecord(objectsById[objectId], {
        datasetUrl: objectDatasetUrl,
        recordId: objectId,
      });
      const objectName = readNonEmptyString(
        objectRecord.Name,
        "Name",
        { datasetUrl: objectDatasetUrl, recordId: objectId },
      );
      supplementaryItems[definition.season].push(
        createCropCatalogItem(
          definition.cropRecordId,
          cropRecord,
          objectsById,
          cropDatasetUrl,
          objectDatasetUrl,
          `crop:${definition.cropRecordId}_${objectId}`,
          objectName,
          23,
          objectId,
        ),
      );
    }
  }

  return supplementaryItems;
}

function readDaysInPhaseCount(
  rawDaysInPhase: unknown,
  recordLocation: RecordLocation,
): number {
  if (rawDaysInPhase === undefined || rawDaysInPhase === null) {
    return 0;
  }
  if (
    !Array.isArray(rawDaysInPhase) ||
    rawDaysInPhase.some((dayCount) =>
      typeof dayCount !== "number" ||
      !Number.isInteger(dayCount) ||
      dayCount < 0,
    )
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "DaysInPhase" must be null or an array of non-negative integers; received ${describeValue(rawDaysInPhase)}.`,
    );
  }

  return rawDaysInPhase.length;
}

function createGiantCropCatalogItems(): readonly CatalogItem[] {
  const giantCropDefinitions = [
    { name: "Cauliflower", texture: "crops.png", x: 112, y: 512 },
    { name: "Melon", texture: "crops.png", x: 160, y: 512 },
    { name: "Pumpkin", texture: "crops.png", x: 208, y: 512 },
    { name: "Powdermelon", texture: "Cursors_1_6.png", x: 320, y: 448 },
    { name: "QiFruit", texture: "Cursors_1_6.png", x: 368, y: 448 },
  ] as const;

  return giantCropDefinitions.map(({ name, texture, x, y }) => {
    const itemId = `crop:giant_${name}`;
    const textureLocalPath = `${localAssetRoot}/tilesheets/${texture}`;
    const fullyGrownRect = {
      kind: "source-rect" as const,
      x,
      y,
      width: 48,
      height: 64,
    };

    return {
      id: itemId,
      name: `Giant ${name}`,
      category: "crop" as const,
      tileSize: { width: 3, height: 3 },
      textureLocalPath,
      sprite: fullyGrownRect,
      allowedTools: fillablePlacementTools,
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect,
        tintColors: [],
        hasForageShadow: false,
      },
    };
  });
}

function isCropSeason(value: string | undefined): value is "Spring" | "Summer" | "Fall" | "Winter" {
  return value === "Spring" || value === "Summer" || value === "Fall" || value === "Winter";
}

function createBigCraftableCatalogItems(
  bigCraftablesById: RecordById,
  datasetUrl: string,
): readonly CatalogItem[] {
  return Object.entries(bigCraftablesById).map(
    ([recordId, rawBigCraftableRecord]) => {
      const recordLocation = { datasetUrl, recordId };
      const bigCraftableRecord = assertPlainJsonRecord(
        rawBigCraftableRecord,
        recordLocation,
      );
      assertExactNull(bigCraftableRecord.Texture, "Texture", recordLocation);
      const paintableChest = getLockedPaintableChestMetadata(recordId);
      const spriteIndex = readNonNegativeInteger(
        bigCraftableRecord.SpriteIndex,
        "SpriteIndex",
        recordLocation,
      );

      return {
        id: `big-craftable:${recordId}`,
        name: readNonEmptyString(bigCraftableRecord.Name, "Name", recordLocation),
        category: "placeable",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: `${localAssetRoot}/tilesheets/craftables.png`,
        sprite: {
          kind: "sprite-index",
          index: spriteIndex,
        },
        allowedTools: placementTools,
        ...(paintableChest === undefined ? {} : { paintableChest }),
        ...createAuditedBigCraftablePresentationProperties(recordId),
        ...createCatalogNightLightProperties({
          catalogItemId: `big-craftable:${recordId}`,
          contextTags: readNullableStringArray(
            bigCraftableRecord.ContextTags,
            "ContextTags",
            recordLocation,
          ),
          isLamp: readOptionalBoolean(
            bigCraftableRecord.IsLamp,
            "IsLamp",
            recordLocation,
          ),
        }),
      };
    },
  );
}

function createObjectCatalogItems(
  objectsById: RecordById,
  datasetUrl: string,
): readonly CatalogItem[] {
  const catalogItems: CatalogItem[] = [];

  for (const [recordId, rawObjectRecord] of Object.entries(objectsById)) {
    const recordLocation = { datasetUrl, recordId };
    const objectRecord = assertPlainJsonRecord(rawObjectRecord, recordLocation);
    const name = readNonEmptyString(objectRecord.Name, "Name", recordLocation);
    const spriteIndex = readNonNegativeInteger(
      objectRecord.SpriteIndex,
      "SpriteIndex",
      recordLocation,
    );

    if (objectRecord.Texture === null) {
      if (isGateFenceRecordId(recordId)) {
        continue;
      }
      const isTeaSapling = recordId === "251";
      const textureLocalPath = isTeaSapling
        ? `${localAssetRoot}/tilesheets/bushes.png`
        : `${localAssetRoot}/tilesheets/springobjects.png`;
      const sprite = isTeaSapling
        ? { kind: "source-rect" as const, x: 32, y: 256, width: 16, height: 32 }
        : { kind: "sprite-index" as const, index: spriteIndex };
      catalogItems.push({
        id: `object:${recordId}`,
        name,
        category: "placeable",
        tileSize: { width: 1, height: 1 },
        textureLocalPath,
        sprite,
        allowedTools: placementTools,
        ...createAuditedObjectPresentationProperties(recordId),
        ...createSeasonalPlaceableCatalogProperties(`object:${recordId}`),
        ...createSprinklerCatalogRenderingProperties(`object:${recordId}`),
        ...createCrabPotCatalogRenderingProperties(`object:${recordId}`),
        ...createObjectPlacementShadowProperties(`object:${recordId}`),
        ...createCatalogNightLightProperties({
          catalogItemId: `object:${recordId}`,
          contextTags: readNullableStringArray(
            objectRecord.ContextTags,
            "ContextTags",
            recordLocation,
          ),
        }),
      });
      continue;
    }

    if (typeof objectRecord.Texture !== "string") {
      throw new Error(
        `${formatRecordLocation(recordLocation)} field "Texture" must be null or a string; received ${describeValue(objectRecord.Texture)}.`,
      );
    }

    assertExactString(
      objectRecord.Texture,
      "TileSheets\\Objects_2",
      "Texture",
      recordLocation,
    );
  }

  return catalogItems;
}

function createAuditedObjectPresentationProperties(
  recordId: string,
): Readonly<{ presentationCapabilities?: CatalogPresentationCapabilities }> {
  if (!isSprinklerCatalogItemId(`object:${recordId}`)) {
    return {};
  }
  return {
    presentationCapabilities: {
      canFlip: false,
      rotation: null,
      variantCycle: { count: 3, family: "generic" },
      visibleVariants: [
        createVisibleVariant(0, "Base"),
        createVisibleVariant(1, "Pressure"),
        createVisibleVariant(2, "Enricher"),
      ],
    },
  };
}

function createAuditedBigCraftablePresentationProperties(
  recordId: string,
): Readonly<{
  presentationCapabilities?: CatalogPresentationCapabilities;
  renderingMetadata?: CatalogItem["renderingMetadata"];
}> {
  const seasonalProperties = createSeasonalPlaceableCatalogProperties(
    `big-craftable:${recordId}`,
  );
  const renderingMetadata = getLockedLitBigCraftableRenderingMetadata(recordId);

  if (seasonalProperties.renderingMetadata !== undefined) {
    if (renderingMetadata !== undefined) {
      throw new Error(
        `BigCraftable ${JSON.stringify(recordId)} cannot combine seasonal and lit rendering metadata.`,
      );
    }
    return seasonalProperties;
  }
  if (renderingMetadata === undefined) {
    return {};
  }
  return {
    presentationCapabilities: {
      canFlip: false,
      rotation: null,
      variantCycle: { count: 2, family: "generic" },
      visibleVariants: [
        createVisibleVariant(0, "Lit"),
        createVisibleVariant(1, "Unlit"),
      ],
    },
    renderingMetadata,
  };
}

function createVisibleVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}

function createCatalogNightLightProperties(input: Readonly<{
  catalogItemId: string;
  contextTags?: readonly string[];
  furnitureType?: string;
  isLamp?: boolean;
}>): Readonly<{ nightLight?: import("./catalog-types").CatalogNightLight }> {
  const nightLight = getLockedNightLightDescriptor(input);

  return nightLight === undefined ? {} : { nightLight };
}

function readNullableStringArray(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): readonly string[] | undefined {
  if (rawValue === undefined || rawValue === null) {
    return undefined;
  }

  if (!Array.isArray(rawValue) || rawValue.some((value) => typeof value !== "string")) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be null or an array of strings; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readOptionalBoolean(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): boolean | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  if (typeof rawValue !== "boolean") {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a boolean; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function createFloorCatalogItems(
  floorsById: RecordById,
  objectsById: RecordById,
  floorDatasetUrl: string,
  objectDatasetUrl: string,
): readonly CatalogItem[] {
  return Object.entries(floorsById).map(([recordId, rawFloorRecord]) => {
    const recordLocation = { datasetUrl: floorDatasetUrl, recordId };
    const floorRecord = assertPlainJsonRecord(rawFloorRecord, recordLocation);
    assertExactString(
      floorRecord.Id,
      recordId,
      "Id",
      recordLocation,
    );
    assertExactString(
      floorRecord.Texture,
      "TerrainFeatures\\Flooring",
      "Texture",
      recordLocation,
    );
    const itemId = readNonEmptyString(floorRecord.ItemId, "ItemId", recordLocation);
    readPositiveInteger(floorRecord, "CornerSize", recordLocation);
    const corner = assertPlainJsonRecord(floorRecord.Corner, recordLocation);

    return {
      id: `floor:${recordId}`,
      name: readReferencedObjectName(
        objectsById,
        itemId,
        "ItemId",
        recordLocation,
        objectDatasetUrl,
      ),
      category: "floor",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: `${localAssetRoot}/tilesheets/flooring.png`,
      sprite: {
        kind: "source-rect",
        x: readNonNegativeInteger(corner.X, "Corner.X", recordLocation),
        y: readNonNegativeInteger(corner.Y, "Corner.Y", recordLocation),
        // The reference catalog draws one 16×16 tile from the flooring sheet,
        // while CornerSize describes the placement footprint rather than the
        // thumbnail source rectangle.
        width: 16,
        height: 16,
      },
      allowedTools: fillablePlacementTools,
    };
  });
}

function createFenceCatalogItems(
  fencesById: RecordById,
  objectsById: RecordById,
  fenceDatasetUrl: string,
  objectDatasetUrl: string,
): readonly CatalogItem[] {
  return Object.entries(fencesById).map(([recordId, rawFenceRecord]) => {
    const recordLocation = { datasetUrl: fenceDatasetUrl, recordId };
    const fenceRecord = assertPlainJsonRecord(rawFenceRecord, recordLocation);
    const textureLocalPath = resolveFenceTextureLocalPath(
      fenceRecord.Texture,
      recordLocation,
    );

    const isGate = isGateFenceRecordId(recordId);
    return {
      id: isGate ? gateCatalogItemId : `fence:${recordId}`,
      name: readReferencedObjectName(
        objectsById,
        recordId,
        "record ID",
        recordLocation,
        objectDatasetUrl,
      ),
      category: "fence",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: isGate
        ? `${localAssetRoot}/tilesheets/springobjects.png`
        : textureLocalPath,
      sprite: {
        ...(isGate
          ? { kind: "sprite-index" as const, index: 325 }
          : {
              kind: "source-rect" as const,
              x: 32,
              y: 32,
              width: 16,
              height: 32,
            }),
      },
      allowedTools: isGate ? placementTools : fillablePlacementTools,
      ...(isGate ? { renderingMetadata: gateRenderingMetadata } : {}),
    };
  });
}

function assertDatasetRecordCount(
  rawDataset: unknown,
  datasetUrl: string,
  expectedRecordCount: number,
): RecordById {
  const recordsById = assertPlainJsonRecord(rawDataset, {
    datasetUrl,
    recordId: "<root>",
  });
  const recordEntries = Object.entries(recordsById);

  if (recordEntries.length !== expectedRecordCount) {
    throw new Error(
      `Catalog dataset URL ${JSON.stringify(datasetUrl)} must contain ${String(expectedRecordCount)} records; received ${String(recordEntries.length)} record IDs ${describeValue(recordEntries.map(([recordId]) => recordId))}.`,
    );
  }

  for (const [recordId] of recordEntries) {
    if (
      recordId.length === 0 ||
      recordId === "__proto__" ||
      recordId === "constructor" ||
      recordId === "prototype"
    ) {
      throw new Error(
        `Catalog dataset URL ${JSON.stringify(datasetUrl)} contains an unsafe record ID ${describeValue(recordId)}.`,
      );
    }
  }

  return recordsById;
}

function resolveBuildingTextureLocalPath(
  rawTexture: unknown,
  recordLocation: RecordLocation,
): string {
  const texture = readNonEmptyString(rawTexture, "Texture", recordLocation);
  const texturePrefix = "Buildings\\";

  if (!texture.startsWith(texturePrefix)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" must start with ${JSON.stringify(texturePrefix)}; received ${describeValue(texture)}.`,
    );
  }

  const textureName = texture.slice(texturePrefix.length);

  if (!verifiedBuildingTextureNames.has(textureName)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" references an unverified local building asset ${describeValue(texture)}.`,
    );
  }

  return `${localAssetRoot}/buildings/${textureName}.png`;
}

function resolveFenceTextureLocalPath(
  rawTexture: unknown,
  recordLocation: RecordLocation,
): string {
  const texture = readNonEmptyString(rawTexture, "Texture", recordLocation);
  const texturePrefix = "LooseSprites\\";

  if (!texture.startsWith(texturePrefix)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" must start with ${JSON.stringify(texturePrefix)}; received ${describeValue(texture)}.`,
    );
  }

  const textureName = texture.slice(texturePrefix.length);

  if (!verifiedFenceTextureNames.has(textureName)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field "Texture" references an unverified local fence asset ${describeValue(texture)}.`,
    );
  }

  return `${localAssetRoot}/tilesheets/${textureName}.png`;
}

function readReferencedObjectName(
  objectsById: RecordById,
  referencedObjectId: string,
  referenceFieldName: string,
  referringRecordLocation: RecordLocation,
  objectDatasetUrl: string,
): string {
  if (!Object.hasOwn(objectsById, referencedObjectId)) {
    throw new Error(
      `${formatRecordLocation(referringRecordLocation)} has ${referenceFieldName} ${describeValue(referencedObjectId)} that is absent from ${JSON.stringify(objectDatasetUrl)}.`,
    );
  }

  const rawObjectRecord = objectsById[referencedObjectId];

  const objectRecord = assertPlainJsonRecord(rawObjectRecord, {
    datasetUrl: objectDatasetUrl,
    recordId: referencedObjectId,
  });

  return readNonEmptyString(objectRecord.Name, "Name", {
    datasetUrl: objectDatasetUrl,
    recordId: referencedObjectId,
  });
}

function readSourceRect(
  rawSourceRect: unknown,
  recordLocation: RecordLocation,
): CatalogSourceRect {
  const sourceRect = assertPlainJsonRecord(rawSourceRect, recordLocation);

  return {
    kind: "source-rect",
    x: readNonNegativeInteger(sourceRect.X, "SourceRect.X", recordLocation),
    y: readNonNegativeInteger(sourceRect.Y, "SourceRect.Y", recordLocation),
    width: readNonNegativeInteger(
      sourceRect.Width,
      "SourceRect.Width",
      recordLocation,
    ),
    height: readNonNegativeInteger(
      sourceRect.Height,
      "SourceRect.Height",
      recordLocation,
    ),
  };
}

function readPositiveInteger(
  rawRecord: unknown,
  propertyName: string,
  recordLocation: RecordLocation,
): number {
  const record = assertPlainJsonRecord(rawRecord, recordLocation);
  const propertyValue = record[propertyName];

  if (
    typeof propertyValue !== "number" ||
    !Number.isInteger(propertyValue) ||
    propertyValue <= 0
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(propertyName)} must be a positive integer; received ${describeValue(propertyValue)}.`,
    );
  }

  return propertyValue;
}

function readNonNegativeInteger(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): number {
  if (
    typeof rawValue !== "number" ||
    !Number.isInteger(rawValue) ||
    rawValue < 0
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a non-negative integer; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function readOptionalFiniteNumber(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): number | undefined {
  if (rawValue === undefined || rawValue === null) {
    return undefined;
  }
  if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a finite number or null; received ${describeValue(rawValue)}.`,
    );
  }
  return rawValue;
}

function readNonEmptyString(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): string {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must be a non-empty string; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function assertExactString(
  rawValue: unknown,
  expectedValue: string,
  fieldName: string,
  recordLocation: RecordLocation,
): void {
  if (rawValue !== expectedValue) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must equal ${describeValue(expectedValue)}; received ${describeValue(rawValue)}.`,
    );
  }
}

function assertExactNull(
  rawValue: unknown,
  fieldName: string,
  recordLocation: RecordLocation,
): void {
  if (rawValue !== null) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} field ${JSON.stringify(fieldName)} must equal null; received ${describeValue(rawValue)}.`,
    );
  }
}

function assertPlainJsonRecord(
  rawValue: unknown,
  recordLocation: RecordLocation,
): RecordById {
  if (
    rawValue === null ||
    typeof rawValue !== "object" ||
    Array.isArray(rawValue) ||
    (Object.getPrototypeOf(rawValue) !== Object.prototype &&
      Object.getPrototypeOf(rawValue) !== null)
  ) {
    throw new Error(
      `${formatRecordLocation(recordLocation)} must be a plain JSON object; received ${describeValue(rawValue)}.`,
    );
  }

  return rawValue as RecordById;
}

function formatRecordLocation(recordLocation: RecordLocation): string {
  return `${recordLocation.datasetUrl} record ${JSON.stringify(recordLocation.recordId)}`;
}

function describeValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }

  if (rawValue === undefined) {
    return "undefined";
  }

  if (typeof rawValue === "number" && Number.isNaN(rawValue)) {
    return "NaN";
  }

  if (rawValue === Infinity) {
    return "Infinity";
  }

  if (rawValue === -Infinity) {
    return "-Infinity";
  }

  if (Array.isArray(rawValue)) {
    return rawValue.length === 0 ? "[]" : `[array length ${String(rawValue.length)}]`;
  }

  if (rawValue !== null && typeof rawValue === "object") {
    return `[object ${Object.prototype.toString.call(rawValue)}]`;
  }

  return String(rawValue);
}
