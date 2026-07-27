import type { CatalogItem } from "../catalog";
import {
  restorePlacementSnapshot,
  type PlacementItem,
  type PlacementItemLayer,
  type PlacementSnapshot,
} from "../placement/placement-snapshot";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

export type GameSaveUnmappedEntry = Readonly<{
  kind: string;
  sourceId: string;
}>;

export class GameSaveImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameSaveImportError";
  }
}

export type ParsedStardewGameSave = Readonly<{
  buildings: readonly Readonly<{
    buildingType: string;
    x: number;
    y: number;
  }>[];
  crops: readonly Readonly<{
    isDead: boolean;
    seedIndex: string | null;
    x: number;
    y: number;
  }>[];
  farmName: string;
  floorings: readonly Readonly<{
    whichFloor: string;
    x: number;
    y: number;
  }>[];
  objects: readonly Readonly<{
    flipped: boolean;
    heldObjectId: string | null;
    isBigCraftable: boolean;
    itemId: string;
    tintColor: string;
    x: number;
    y: number;
  }>[];
  resourceClumps: readonly Readonly<{
    parentSheetIndex: number;
    x: number;
    y: number;
  }>[];
  season: string;
  unmappedEntries: readonly GameSaveUnmappedEntry[];
  whichFarm: string;
}>;

export type ImportedGameSaveState = Readonly<{
  farmName: string;
  mapId: string;
  placementSnapshot: PlacementSnapshot;
  season: TilesheetSeason;
  unmappedEntries: readonly GameSaveUnmappedEntry[];
}>;

const mapIdByFarmType = new Map<string, string>([
  ["0", "standard"],
  ["1", "riverland"],
  ["2", "forest"],
  ["3", "hilltop"],
  ["4", "wilderness"],
  ["5", "four-corners"],
  ["6", "beach"],
  ["MeadowlandsFarm", "meadowlands"],
  ["FrontierFarm", "frontier"],
]);

const supportedSeasons = ["spring", "summer", "fall", "winter"] as const;
const fenceObjectIds = new Set(["298", "322", "323", "324"]);

export function createImportedGameSaveState(
  parsedStardewGameSave: ParsedStardewGameSave,
  catalogItems: readonly CatalogItem[],
): ImportedGameSaveState {
  assertParsedStardewGameSave(parsedStardewGameSave);
  const catalogItemsById = createCatalogItemsById(catalogItems);
  const mapId = getMapIdForFarmType(parsedStardewGameSave.whichFarm);
  const season = getSupportedSeason(parsedStardewGameSave.season);
  const unmappedEntries = [...parsedStardewGameSave.unmappedEntries];
  const buildings = createImportedBuildings(
    parsedStardewGameSave.buildings,
    catalogItemsById,
    unmappedEntries,
  );
  const items = [
    ...createImportedObjects(
      parsedStardewGameSave.objects,
      catalogItemsById,
      unmappedEntries,
    ),
    ...createImportedFloorings(
      parsedStardewGameSave.floorings,
      catalogItemsById,
      unmappedEntries,
    ),
    ...createImportedResourceClumps(
      parsedStardewGameSave.resourceClumps,
      catalogItemsById,
      unmappedEntries,
    ),
  ].map((importedItem, itemIndex) => ({
    ...importedItem,
    instanceId: itemIndex + 1,
  }));
  const crops = createImportedCrops(
    parsedStardewGameSave.crops,
    catalogItemsById,
    unmappedEntries,
  );
  const placementSnapshot = restorePlacementSnapshot({
    buildings,
    crops,
    items,
    nextBuildingId: buildings.length + 1,
    nextItemId: items.length + 1,
  });

  return {
    farmName: parsedStardewGameSave.farmName,
    mapId,
    placementSnapshot,
    season,
    unmappedEntries,
  };
}

function createImportedBuildings(
  savedBuildings: ParsedStardewGameSave["buildings"],
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  unmappedEntries: GameSaveUnmappedEntry[],
): PlacementSnapshot["buildings"] {
  const importedBuildings = [] as Array<PlacementSnapshot["buildings"][number]>;

  for (const savedBuilding of savedBuildings) {
    const catalogItemId = `building:${savedBuilding.buildingType}`;
    const catalogItem = catalogItemsById.get(catalogItemId);

    if (catalogItem?.category !== "building") {
      unmappedEntries.push({ kind: "building", sourceId: catalogItemId });
      continue;
    }

    importedBuildings.push({
      buildingId: savedBuilding.buildingType,
      instanceId: importedBuildings.length + 1,
      x: savedBuilding.x,
      y: savedBuilding.y,
    });
  }

  return importedBuildings;
}

function createImportedObjects(
  savedObjects: ParsedStardewGameSave["objects"],
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  unmappedEntries: GameSaveUnmappedEntry[],
): readonly Omit<PlacementItem, "instanceId">[] {
  const importedObjects: Array<Omit<PlacementItem, "instanceId">> = [];

  for (const savedObject of savedObjects) {
    const objectCatalogMapping = getObjectCatalogMapping(savedObject);
    const catalogItem = catalogItemsById.get(objectCatalogMapping.itemId);

    if (catalogItem === undefined || catalogItem.category !== objectCatalogMapping.category) {
      unmappedEntries.push({ kind: "object", sourceId: objectCatalogMapping.itemId });
      continue;
    }

    importedObjects.push(
      createImportedPlacementItem({
        catalogItem,
        flipped: savedObject.flipped,
        itemId: objectCatalogMapping.itemId,
        layer: objectCatalogMapping.layer,
        tintColor: savedObject.tintColor,
        variant: getObjectVariant(savedObject.heldObjectId),
        x: savedObject.x,
        y: savedObject.y,
      }),
    );
  }

  return importedObjects;
}

function createImportedFloorings(
  savedFloorings: ParsedStardewGameSave["floorings"],
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  unmappedEntries: GameSaveUnmappedEntry[],
): readonly Omit<PlacementItem, "instanceId">[] {
  const importedFloorings: Array<Omit<PlacementItem, "instanceId">> = [];

  for (const savedFlooring of savedFloorings) {
    const itemId = `floor:${savedFlooring.whichFloor}`;
    const catalogItem = catalogItemsById.get(itemId);

    if (catalogItem?.category !== "floor") {
      unmappedEntries.push({ kind: "flooring", sourceId: itemId });
      continue;
    }

    importedFloorings.push(
      createImportedPlacementItem({
        catalogItem,
        flipped: false,
        itemId,
        layer: "path",
        tintColor: "#ffffff",
        variant: 0,
        x: savedFlooring.x,
        y: savedFlooring.y,
      }),
    );
  }

  return importedFloorings;
}

function createImportedResourceClumps(
  savedResourceClumps: ParsedStardewGameSave["resourceClumps"],
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  unmappedEntries: GameSaveUnmappedEntry[],
): readonly Omit<PlacementItem, "instanceId">[] {
  const importedResourceClumps: Array<Omit<PlacementItem, "instanceId">> = [];

  for (const savedResourceClump of savedResourceClumps) {
    const itemId = `clump_${String(savedResourceClump.parentSheetIndex)}`;
    const catalogItem = catalogItemsById.get(itemId);

    if (catalogItem?.category !== "decor") {
      unmappedEntries.push({ kind: "resource-clump", sourceId: itemId });
      continue;
    }

    importedResourceClumps.push(
      createImportedPlacementItem({
        catalogItem,
        flipped: false,
        itemId,
        layer: "item",
        tintColor: "#ffffff",
        variant: 0,
        x: savedResourceClump.x,
        y: savedResourceClump.y,
      }),
    );
  }

  return importedResourceClumps;
}

function createImportedCrops(
  savedCrops: ParsedStardewGameSave["crops"],
  catalogItemsById: ReadonlyMap<string, CatalogItem>,
  unmappedEntries: GameSaveUnmappedEntry[],
): PlacementSnapshot["crops"] {
  const importedCrops = [] as Array<PlacementSnapshot["crops"][number]>;

  for (const savedCrop of savedCrops) {
    if (savedCrop.isDead || savedCrop.seedIndex === null) {
      unmappedEntries.push({
        kind: savedCrop.isDead ? "dead-crop" : "hoe-dirt",
        sourceId: savedCrop.seedIndex ?? "none",
      });
      continue;
    }

    const cropId = `crop:${savedCrop.seedIndex}`;
    const catalogItem = catalogItemsById.get(cropId);

    if (catalogItem?.category !== "crop") {
      unmappedEntries.push({ kind: "crop", sourceId: cropId });
      continue;
    }

    importedCrops.push({ cropId, x: savedCrop.x, y: savedCrop.y });
  }

  return importedCrops;
}

function createImportedPlacementItem(
  input: Readonly<{
    catalogItem: CatalogItem;
    flipped: boolean;
    itemId: string;
    layer: PlacementItemLayer;
    tintColor: string;
    variant: number;
    x: number;
    y: number;
  }>,
): Omit<PlacementItem, "instanceId"> {
  return {
    bedType: null,
    flipped: input.flipped,
    footprint: {
      height: input.catalogItem.tileSize.height,
      width: input.catalogItem.tileSize.width,
    },
    isGrass: false,
    isLongTable: false,
    isRug: false,
    isTable: false,
    itemId: input.itemId,
    layer: input.layer,
    locked: false,
    rotation: 0,
    tintColor: input.tintColor,
    variant: input.variant,
    x: input.x,
    y: input.y,
  };
}

function getObjectCatalogMapping(
  savedObject: ParsedStardewGameSave["objects"][number],
): Readonly<{
  category: "fence" | "placeable";
  itemId: string;
  layer: PlacementItemLayer;
}> {
  if (savedObject.isBigCraftable) {
    return {
      category: "placeable",
      itemId: `big-craftable:${savedObject.itemId}`,
      layer: "item",
    };
  }

  if (fenceObjectIds.has(savedObject.itemId)) {
    return {
      category: "fence",
      itemId: `fence:${savedObject.itemId}`,
      layer: "fence",
    };
  }

  return {
    category: "placeable",
    itemId: `object:${savedObject.itemId}`,
    layer: "item",
  };
}

function getObjectVariant(heldObjectId: string | null): number {
  if (heldObjectId === "915") {
    return 1;
  }

  if (heldObjectId === "913") {
    return 2;
  }

  return 0;
}

function createCatalogItemsById(
  catalogItems: readonly CatalogItem[],
): ReadonlyMap<string, CatalogItem> {
  if (!Array.isArray(catalogItems)) {
    throw new GameSaveImportError(
      `Game save import catalog items must be an array; received ${describeValue(catalogItems)}.`,
    );
  }

  const catalogItemsById = new Map<string, CatalogItem>();

  for (const catalogItem of catalogItems) {
    if (
      typeof catalogItem !== "object" ||
      catalogItem === null ||
      typeof catalogItem.id !== "string" ||
      catalogItem.id.length === 0
    ) {
      throw new GameSaveImportError(
        `Game save import catalog item must have a non-empty ID; received ${describeValue(catalogItem)}.`,
      );
    }

    if (
      typeof catalogItem.category !== "string" ||
      typeof catalogItem.tileSize !== "object" ||
      catalogItem.tileSize === null ||
      !Number.isSafeInteger(catalogItem.tileSize.width) ||
      catalogItem.tileSize.width <= 0 ||
      !Number.isSafeInteger(catalogItem.tileSize.height) ||
      catalogItem.tileSize.height <= 0
    ) {
      throw new GameSaveImportError(
        `Game save import catalog item ${JSON.stringify(catalogItem.id)} must have a positive safe-integer tileSize; received ${describeValue(catalogItem.tileSize)}.`,
      );
    }

    if (catalogItemsById.has(catalogItem.id)) {
      throw new GameSaveImportError(
        `Game save import catalog contains duplicate item ID ${JSON.stringify(catalogItem.id)}.`,
      );
    }

    catalogItemsById.set(catalogItem.id, catalogItem);
  }

  return catalogItemsById;
}

function getMapIdForFarmType(whichFarm: string): string {
  const mapId = mapIdByFarmType.get(whichFarm);

  if (mapId === undefined) {
    throw new GameSaveImportError(
      `Game save farm type is unsupported: ${JSON.stringify(whichFarm)}.`,
    );
  }

  return mapId;
}

function getSupportedSeason(season: string): TilesheetSeason {
  if (!(supportedSeasons as readonly string[]).includes(season)) {
    throw new GameSaveImportError(
      `Game save season is unsupported: ${JSON.stringify(season)}.`,
    );
  }

  return season as TilesheetSeason;
}

function assertParsedStardewGameSave(
  parsedStardewGameSave: ParsedStardewGameSave,
): void {
  if (
    typeof parsedStardewGameSave !== "object" ||
    parsedStardewGameSave === null
  ) {
    throw new GameSaveImportError(
      `Game save import input must be a non-null object; received ${describeValue(parsedStardewGameSave)}.`,
    );
  }

  assertNonEmptyString(parsedStardewGameSave.farmName, "farmName");
  assertNonEmptyString(parsedStardewGameSave.whichFarm, "whichFarm");
  assertNonEmptyString(parsedStardewGameSave.season, "season");
  assertArray(parsedStardewGameSave.buildings, "buildings");
  assertArray(parsedStardewGameSave.crops, "crops");
  assertArray(parsedStardewGameSave.floorings, "floorings");
  assertArray(parsedStardewGameSave.objects, "objects");
  assertArray(parsedStardewGameSave.resourceClumps, "resourceClumps");
  assertArray(parsedStardewGameSave.unmappedEntries, "unmappedEntries");
  parsedStardewGameSave.buildings.forEach(assertSavedBuilding);
  parsedStardewGameSave.crops.forEach(assertSavedCrop);
  parsedStardewGameSave.floorings.forEach(assertSavedFlooring);
  parsedStardewGameSave.objects.forEach(assertSavedObject);
  parsedStardewGameSave.resourceClumps.forEach(assertSavedResourceClump);
  parsedStardewGameSave.unmappedEntries.forEach(assertUnmappedEntry);
}

function assertArray(value: unknown, fieldName: string): asserts value is readonly unknown[] {
  if (!Array.isArray(value)) {
    throw new GameSaveImportError(
      `Game save import field ${JSON.stringify(fieldName)} must be an array; received ${describeValue(value)}.`,
    );
  }
}

function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new GameSaveImportError(
      `Game save import field ${JSON.stringify(fieldName)} must be a non-empty string; received ${describeValue(value)}.`,
    );
  }
}

function assertSavedBuilding(value: unknown, entryIndex: number): void {
  const savedBuilding = assertNonNullRecord(value, `buildings[${String(entryIndex)}]`);
  assertNonEmptyString(savedBuilding.buildingType, `buildings[${String(entryIndex)}].buildingType`);
  assertSafeInteger(savedBuilding.x, `buildings[${String(entryIndex)}].x`);
  assertSafeInteger(savedBuilding.y, `buildings[${String(entryIndex)}].y`);
}

function assertSavedCrop(value: unknown, entryIndex: number): void {
  const savedCrop = assertNonNullRecord(value, `crops[${String(entryIndex)}]`);
  assertBoolean(savedCrop.isDead, `crops[${String(entryIndex)}].isDead`);
  assertStringOrNull(savedCrop.seedIndex, `crops[${String(entryIndex)}].seedIndex`);
  assertSafeInteger(savedCrop.x, `crops[${String(entryIndex)}].x`);
  assertSafeInteger(savedCrop.y, `crops[${String(entryIndex)}].y`);
}

function assertSavedFlooring(value: unknown, entryIndex: number): void {
  const savedFlooring = assertNonNullRecord(value, `floorings[${String(entryIndex)}]`);
  assertNonEmptyString(savedFlooring.whichFloor, `floorings[${String(entryIndex)}].whichFloor`);
  assertSafeInteger(savedFlooring.x, `floorings[${String(entryIndex)}].x`);
  assertSafeInteger(savedFlooring.y, `floorings[${String(entryIndex)}].y`);
}

function assertSavedObject(value: unknown, entryIndex: number): void {
  const savedObject = assertNonNullRecord(value, `objects[${String(entryIndex)}]`);
  assertBoolean(savedObject.flipped, `objects[${String(entryIndex)}].flipped`);
  assertStringOrNull(savedObject.heldObjectId, `objects[${String(entryIndex)}].heldObjectId`);
  assertBoolean(savedObject.isBigCraftable, `objects[${String(entryIndex)}].isBigCraftable`);
  assertNonEmptyString(savedObject.itemId, `objects[${String(entryIndex)}].itemId`);
  assertHexColor(savedObject.tintColor, `objects[${String(entryIndex)}].tintColor`);
  assertSafeInteger(savedObject.x, `objects[${String(entryIndex)}].x`);
  assertSafeInteger(savedObject.y, `objects[${String(entryIndex)}].y`);
}

function assertSavedResourceClump(value: unknown, entryIndex: number): void {
  const savedResourceClump = assertNonNullRecord(value, `resourceClumps[${String(entryIndex)}]`);
  assertSafeInteger(
    savedResourceClump.parentSheetIndex,
    `resourceClumps[${String(entryIndex)}].parentSheetIndex`,
  );
  assertSafeInteger(savedResourceClump.x, `resourceClumps[${String(entryIndex)}].x`);
  assertSafeInteger(savedResourceClump.y, `resourceClumps[${String(entryIndex)}].y`);
}

function assertUnmappedEntry(value: unknown, entryIndex: number): void {
  const unmappedEntry = assertNonNullRecord(value, `unmappedEntries[${String(entryIndex)}]`);
  assertNonEmptyString(unmappedEntry.kind, `unmappedEntries[${String(entryIndex)}].kind`);
  assertNonEmptyString(unmappedEntry.sourceId, `unmappedEntries[${String(entryIndex)}].sourceId`);
}

function assertNonNullRecord(value: unknown, fieldName: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new GameSaveImportError(
      `Game save import field ${JSON.stringify(fieldName)} must be a non-null object; received ${describeValue(value)}.`,
    );
  }

  return value as Record<string, unknown>;
}

function assertBoolean(value: unknown, fieldName: string): void {
  if (typeof value !== "boolean") {
    throw new GameSaveImportError(
      `Game save import field ${JSON.stringify(fieldName)} must be a boolean; received ${describeValue(value)}.`,
    );
  }
}

function assertStringOrNull(value: unknown, fieldName: string): void {
  if (value !== null && typeof value !== "string") {
    throw new GameSaveImportError(
      `Game save import field ${JSON.stringify(fieldName)} must be a string or null; received ${describeValue(value)}.`,
    );
  }
}

function assertHexColor(value: unknown, fieldName: string): void {
  if (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value)) {
    throw new GameSaveImportError(
      `Game save import field ${JSON.stringify(fieldName)} must be a #RRGGBB color; received ${describeValue(value)}.`,
    );
  }
}

function assertSafeInteger(value: unknown, fieldName: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new GameSaveImportError(
      `Game save import field ${JSON.stringify(fieldName)} must be a safe integer; received ${describeValue(value)}.`,
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

  if (Array.isArray(value)) {
    return `[array length ${String(value.length)}]`;
  }

  return JSON.stringify(value);
}
