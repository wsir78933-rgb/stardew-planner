import { catalogItemCategories, type CatalogItem } from "./catalog-types";
import { referencePlaceableCatalogNames } from "./reference-placeable-order";

export const catalogSidebarCategories = [
  "buildings",
  "crops",
  "trees",
  "equipment",
  "paths",
  "lighting",
  "furniture",
  "decor",
] as const;

export type CatalogSidebarCategory = (typeof catalogSidebarCategories)[number];

const catalogItemValueFields = [
  "name",
  "category",
  "interiorDecorKind",
  "tileSize",
  "textureLocalPath",
  "sprite",
  "thumbnailSprite",
  "allowedTools",
  "nightLight",
  "furnitureFire",
  "paintableChest",
  "presentationCapabilities",
  "placementShadow",
  "renderingMetadata",
] as const satisfies readonly (keyof CatalogItem)[];

type CatalogSidebarFilter = Readonly<{
  id: string;
  label: string;
  count: number;
}>;

type CatalogSidebarFilterDefinition = Readonly<{
  id: string;
  label: string;
}>;

const catalogSidebarFiltersByCategory: Readonly<
  Record<CatalogSidebarCategory, readonly CatalogSidebarFilterDefinition[]>
> = {
  buildings: [
    { id: "animal", label: "Animals" },
    { id: "production", label: "Production" },
    { id: "storage", label: "Storage" },
    { id: "utility", label: "Utility" },
    { id: "luxury", label: "Luxury" },
    { id: "cabins", label: "Cabins" },
    { id: "structures", label: "Structures" },
  ],
  crops: [
    { id: "spring", label: "Spring" },
    { id: "summer", label: "Summer" },
    { id: "fall", label: "Fall" },
    { id: "winter", label: "Winter" },
    { id: "multi-season", label: "Multi-season" },
    { id: "giant-crops", label: "Giant crops" },
    { id: "saplings", label: "Saplings" },
  ],
  trees: [
    { id: "wild-trees", label: "Wild trees" },
    { id: "fruit-trees", label: "Fruit trees" },
  ],
  equipment: [
    { id: "utility", label: "Utility" },
    { id: "machines", label: "Machines" },
  ],
  paths: [],
  lighting: [],
  furniture: [
    { id: "chairs", label: "Chairs" },
    { id: "benches", label: "Benches" },
    { id: "couches", label: "Couches" },
    { id: "armchairs", label: "Armchairs" },
    { id: "tables", label: "Tables" },
    { id: "long-tables", label: "Long tables" },
    { id: "bookcases", label: "Bookcases" },
    { id: "dressers", label: "Dressers" },
    { id: "beds", label: "Beds" },
    { id: "fireplaces", label: "Fireplaces" },
    { id: "rugs", label: "Rugs" },
    { id: "tvs", label: "TVs" },
    { id: "fish-tanks", label: "Fish tanks" },
    { id: "other", label: "Other" },
  ],
  decor: [
    { id: "functional", label: "Functional" },
    { id: "plants", label: "Plants" },
    { id: "paintings", label: "Paintings" },
    { id: "wall-hangings", label: "Wall hangings" },
    { id: "windows-doors", label: "Windows & doors" },
    { id: "large-decor", label: "Large decor" },
    { id: "small-decor", label: "Small decor" },
    { id: "special", label: "Special" },
    { id: "wallpaper", label: "Wallpaper" },
    { id: "flooring", label: "Flooring" },
    { id: "other", label: "Other" },
  ],
};

const referencePlaceableMachineNames = new Set([
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

const referencePlaceableLightingNames = new Set([
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

const referencePlaceableUtilityNames = new Set([
  "Chest",
  "Stone Chest",
  "Big Chest",
  "Big Stone Chest",
  "Junimo Chest",
  "Scarecrow",
  "Deluxe Scarecrow",
  "Rarecrow",
  "Wood Sign",
  "Stone Sign",
  "Dark Sign",
  "Text Sign",
  "Item Pedestal",
  "Sprinkler",
  "Quality Sprinkler",
  "Iridium Sprinkler",
  "Crab Pot",
]);

const referencePlaceableFunctionalDecorNames = new Set([
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

const cropSeasonByCatalogItemId = new Map<string, string>([
  ...[
    "crop:472", "crop:473", "crop:474", "crop:475", "crop:476", "crop:273",
    "crop:477", "crop:478", "crop:745", "crop:427", "crop:429", "crop:495",
    "crop:CarrotSeeds", "crop:495_18", "crop:495_20", "crop:495_22",
  ].map((itemId) => [itemId, "spring"] as const),
  ...[
    "crop:831", "crop:479", "crop:480", "crop:481", "crop:482", "crop:484",
    "crop:485", "crop:486", "crop:833", "crop:302", "crop:453", "crop:455",
    "crop:496", "crop:SummerSquashSeeds", "crop:496_398", "crop:496_402",
  ].map((itemId) => [itemId, "summer"] as const),
  ...[
    "crop:301", "crop:299", "crop:488", "crop:489", "crop:490", "crop:491",
    "crop:492", "crop:493", "crop:494", "crop:425", "crop:347", "crop:497",
    "crop:BroccoliSeeds", "crop:497_406", "crop:497_408", "crop:497_410",
  ].map((itemId) => [itemId, "fall"] as const),
  ...[
    "crop:498", "crop:PowdermelonSeeds", "crop:498_414", "crop:498_416",
    "crop:498_418",
  ].map((itemId) => [itemId, "winter"] as const),
  ...[
    "crop:483", "crop:433", "crop:802", "crop:487", "crop:499", "crop:431",
    "crop:885", "crop:890",
  ].map((itemId) => [itemId, "multi-season"] as const),
]);

const giantCropIds = new Set([
  "crop:giant_Cauliflower",
  "crop:giant_Melon",
  "crop:giant_Pumpkin",
  "crop:giant_Powdermelon",
  "crop:giant_QiFruit",
]);

const animalBuildingIds = new Set([
  "Barn",
  "Big Barn",
  "Deluxe Barn",
  "Coop",
  "Big Coop",
  "Deluxe Coop",
  "Slime Hutch",
]);

const productionBuildingIds = new Set([
  "Fish Pond",
  "Mill",
]);

const storageBuildingIds = new Set([
  "Big Shed",
  "Shed",
  "Silo",
]);

const utilityBuildingIds = new Set([
  "Greenhouse",
  "Hay Pet Bowl",
  "Pet Bowl",
  "Shipping Bin",
  "Stone Pet Bowl",
  "Stable",
  "Well",
]);

const luxuryBuildingIds = new Set([
  "Desert Obelisk",
  "Earth Obelisk",
  "Gold Clock",
  "Island Obelisk",
  "Water Obelisk",
]);

const furnitureFacetByFurnitureType: Readonly<Record<string, string>> = {
  chair: "chairs",
  bench: "benches",
  couch: "couches",
  armchair: "armchairs",
  table: "tables",
  "long table": "long-tables",
  bookcase: "bookcases",
  dresser: "dressers",
  bed: "beds",
  "bed double": "beds",
  "bed child": "beds",
  fireplace: "fireplaces",
  rug: "rugs",
  fishtank: "fish-tanks",
  other: "other",
};

export function getCatalogSidebarCategory(
  catalogItem: CatalogItem,
): CatalogSidebarCategory {
  validateCatalogItem(catalogItem);

  if (catalogItem.category === "building") {
    return "buildings";
  }
  if (catalogItem.category === "crop" || catalogItem.id === "object:251") {
    return "crops";
  }
  if (
    catalogItem.renderingMetadata?.kind === "fruit-tree" ||
    catalogItem.renderingMetadata?.kind === "wild-tree"
  ) {
    return "trees";
  }
  if (catalogItem.category === "floor" || catalogItem.category === "fence" ||
      catalogItem.id === "hoedirt" || catalogItem.id === "grass_1" ||
      catalogItem.id === "grass_7") {
    return "paths";
  }
  if (isFurnitureFireplace(catalogItem)) {
    return "furniture";
  }
  if (isLightingItem(catalogItem)) {
    return "lighting";
  }
  if (catalogItem.renderingMetadata?.kind === "furniture") {
    if (catalogItem.name.toLowerCase().includes(" tv") ||
        catalogItem.name.toLowerCase().endsWith("tv")) {
      return "furniture";
    }
    if (Object.hasOwn(furnitureFacetByFurnitureType, catalogItem.renderingMetadata.furnitureType)) {
      return "furniture";
    }
  }
  if (isEquipmentItem(catalogItem)) {
    return "equipment";
  }
  if (catalogItem.category === "decor" || catalogItem.category === "placeable") {
    return "decor";
  }

  throw new TypeError(
    `Catalog item ${JSON.stringify(catalogItem.id)} has unsupported category ${JSON.stringify(catalogItem.category)}.`,
  );
}

export function getCatalogSidebarFilters(
  catalogItems: readonly CatalogItem[],
  category: CatalogSidebarCategory,
): readonly CatalogSidebarFilter[] {
  validateCatalogSidebarCategory(category);
  const categoryItems = deduplicateCatalogItems(catalogItems).filter(
    (catalogItem) => getCatalogSidebarCategory(catalogItem) === category,
  );
  const filters: CatalogSidebarFilter[] = [
    { id: "all", label: "All", count: categoryItems.length },
  ];

  for (const filterDefinition of catalogSidebarFiltersByCategory[category]) {
    const count = categoryItems.filter(
      (catalogItem) => getCatalogSidebarFacetId(catalogItem, category) === filterDefinition.id,
    ).length;
    if (count > 0) {
      filters.push({ ...filterDefinition, count });
    }
  }

  return filters;
}

export function getCatalogSidebarItems(
  catalogItems: readonly CatalogItem[],
  category: CatalogSidebarCategory,
  searchQuery: string,
  filterId = "all",
): CatalogItem[] {
  validateCatalogSidebarCategory(category);
  validateCatalogSearchQuery(searchQuery);
  validateCatalogSidebarFilter(category, filterId);
  const uniqueCatalogItems = deduplicateCatalogItems(catalogItems);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  if (normalizedSearchQuery.length > 0) {
    return uniqueCatalogItems.filter((catalogItem) =>
      catalogItem.name.toLowerCase().includes(normalizedSearchQuery) ||
      catalogItem.id.toLowerCase().includes(normalizedSearchQuery),
    );
  }

  return uniqueCatalogItems.filter((catalogItem) =>
    getCatalogSidebarCategory(catalogItem) === category &&
    (filterId === "all" || getCatalogSidebarFacetId(catalogItem, category) === filterId),
  );
}

export function selectCatalogSidebarPlaceableItems(
  catalogItems: readonly CatalogItem[],
): readonly CatalogItem[] {
  validateCatalogItems(catalogItems);
  const candidates = catalogItems.filter((catalogItem) =>
    catalogItem.renderingMetadata?.kind !== "furniture" &&
    (catalogItem.category === "placeable" ||
      catalogItem.category === "floor" ||
      catalogItem.category === "fence" ||
      catalogItem.id.startsWith("clump_")),
  );
  const selectedCatalogItems: CatalogItem[] = [];
  const consumedCatalogItemIds = new Set<string>();

  for (const referenceName of referencePlaceableCatalogNames) {
    const baseName = normalizeReferencePlaceableName(referenceName);
    const familyName = getReferencePlaceableFamilyName(referenceName);
    const matchingCatalogItems = candidates.filter((catalogItem) =>
      !consumedCatalogItemIds.has(catalogItem.id) &&
      matchesReferencePlaceableName(catalogItem, referenceName, baseName, familyName),
    );
    const selectedCatalogItem = matchingCatalogItems[0];

    if (selectedCatalogItem === undefined) {
      throw new Error(
        `Reference placeables require catalog item ${JSON.stringify(referenceName)}; no unused local item matched it.`,
      );
    }

    consumedCatalogItemIds.add(selectedCatalogItem.id);
    selectedCatalogItems.push(selectedCatalogItem);
  }

  return selectedCatalogItems;
}

function getCatalogSidebarFacetId(
  catalogItem: CatalogItem,
  category: CatalogSidebarCategory,
): string {
  if (category === "buildings") {
    return getBuildingFacetId(catalogItem);
  }
  if (category === "crops") {
    return getCropFacetId(catalogItem);
  }
  if (category === "trees") {
    return catalogItem.renderingMetadata?.kind === "fruit-tree"
      ? "fruit-trees"
      : "wild-trees";
  }
  if (category === "equipment") {
    return referencePlaceableMachineNames.has(catalogItem.name) ? "machines" : "utility";
  }
  if (category === "furniture") {
    return getFurnitureFacetId(catalogItem);
  }
  if (category === "decor") {
    return getDecorFacetId(catalogItem);
  }

  return "all";
}

function getBuildingFacetId(catalogItem: CatalogItem): string {
  const buildingId = catalogItem.id.startsWith("building:")
    ? catalogItem.id.slice("building:".length)
    : catalogItem.id;
  const baseBuildingId = buildingId.replace(/_[12]$/, "");

  if (baseBuildingId.includes("Cabin")) {
    return "cabins";
  }
  if (animalBuildingIds.has(baseBuildingId)) {
    return "animal";
  }
  if (productionBuildingIds.has(baseBuildingId)) {
    return "production";
  }
  if (storageBuildingIds.has(baseBuildingId)) {
    return "storage";
  }
  if (utilityBuildingIds.has(baseBuildingId)) {
    return "utility";
  }
  if (luxuryBuildingIds.has(baseBuildingId)) {
    return "luxury";
  }

  return "structures";
}

function getCropFacetId(catalogItem: CatalogItem): string {
  if (catalogItem.id === "object:251") {
    return "saplings";
  }
  if (giantCropIds.has(catalogItem.id)) {
    return "giant-crops";
  }

  const cropFacetId = cropSeasonByCatalogItemId.get(catalogItem.id);
  if (cropFacetId === undefined) {
    throw new Error(
      `Crop ${JSON.stringify(catalogItem.id)} has no locked 1.6.15 sidebar season mapping.`,
    );
  }

  return cropFacetId;
}

function getFurnitureFacetId(catalogItem: CatalogItem): string {
  if (catalogItem.name.toLowerCase().includes(" tv") ||
      catalogItem.name.toLowerCase().endsWith("tv")) {
    return "tvs";
  }
  if (catalogItem.furnitureFire?.kind === "fireplace") {
    return "fireplaces";
  }
  const furnitureType = catalogItem.renderingMetadata?.kind === "furniture"
    ? catalogItem.renderingMetadata.furnitureType
    : "";

  return furnitureFacetByFurnitureType[furnitureType] ?? "other";
}

function getDecorFacetId(catalogItem: CatalogItem): string {
  if (catalogItem.interiorDecorKind === "wallpaper") {
    return "wallpaper";
  }
  if (catalogItem.interiorDecorKind === "flooring") {
    return "flooring";
  }
  if (referencePlaceableFunctionalDecorNames.has(catalogItem.name)) {
    return "functional";
  }
  const furnitureMetadata = catalogItem.renderingMetadata?.kind === "furniture"
    ? catalogItem.renderingMetadata
    : undefined;
  const lowerCaseName = catalogItem.name.toLowerCase();

  if (furnitureMetadata?.furnitureType === "painting") {
    return "paintings";
  }
  if (
    furnitureMetadata?.furnitureType === "randomized_plant" ||
    furnitureMetadata?.compositeSprite !== null &&
      furnitureMetadata?.compositeSprite !== undefined ||
    lowerCaseName.includes("plant") ||
    lowerCaseName.includes("cactus") ||
    (lowerCaseName.includes("tree") &&
      catalogItem.id !== "furniture_CatTree" &&
      catalogItem.id !== "furniture_DarkCatTree")
  ) {
    return "plants";
  }
  if (furnitureMetadata?.furnitureType === "window" || furnitureMetadata?.isWindow === true ||
      catalogItem.name === "Door" || catalogItem.name === "Locked Door") {
    return "windows-doors";
  }
  if (furnitureMetadata?.wallMounted === true) {
    return "wall-hangings";
  }
  if (catalogItem.id.startsWith("clump_") || lowerCaseName.includes("mannequin")) {
    return "special";
  }
  if (catalogItem.tileSize.width >= 3 || catalogItem.tileSize.height >= 3) {
    return "large-decor";
  }
  if (furnitureMetadata?.furnitureType === "decor" || catalogItem.category === "placeable") {
    return "small-decor";
  }

  return "other";
}

function isFurnitureFireplace(catalogItem: CatalogItem): boolean {
  return catalogItem.furnitureFire?.kind === "fireplace" ||
    (catalogItem.renderingMetadata?.kind === "furniture" &&
      catalogItem.renderingMetadata.furnitureType === "fireplace");
}

function isLightingItem(catalogItem: CatalogItem): boolean {
  if (catalogItem.furnitureFire?.kind === "torch") {
    return true;
  }
  if (catalogItem.renderingMetadata?.kind === "furniture") {
    const furnitureType = catalogItem.renderingMetadata.furnitureType;
    if (["lamp", "torch", "sconce"].includes(furnitureType)) {
      return true;
    }
  }

  return referencePlaceableLightingNames.has(catalogItem.name) ||
    (catalogItem.nightLight !== undefined && !isFurnitureFireplace(catalogItem));
}

function isEquipmentItem(catalogItem: CatalogItem): boolean {
  if (catalogItem.renderingMetadata?.kind === "sprinkler" ||
      catalogItem.renderingMetadata?.kind === "crab-pot") {
    return true;
  }
  if (referencePlaceableMachineNames.has(catalogItem.name) ||
      referencePlaceableUtilityNames.has(catalogItem.name)) {
    return true;
  }
  if (/^Rarecrow(?: \d+)?$/.test(catalogItem.name) ||
      /^.*(?:Chest|Scarecrow|Sign)$/.test(catalogItem.name)) {
    return true;
  }

  return false;
}

function matchesReferencePlaceableName(
  catalogItem: CatalogItem,
  referenceName: string,
  baseName: string,
  familyName: string | undefined,
): boolean {
  if (referenceName === "Tilled Dirt (Dry)") {
    return catalogItem.id === "hoedirt";
  }
  if (referenceName === "Grass Starter" || referenceName === "Blue Grass Starter") {
    return catalogItem.id === (referenceName === "Grass Starter" ? "grass_1" : "grass_7");
  }
  if (isReferenceFloorName(referenceName)) {
    return catalogItem.category === "floor" && catalogItem.name === baseName;
  }
  if (isReferenceFenceName(referenceName)) {
    return referenceName === "Gate"
      ? catalogItem.id === "object:325"
      : catalogItem.category === "fence" && catalogItem.name === baseName;
  }
  if (familyName !== undefined) {
    return catalogItem.name === familyName;
  }
  if (referenceName.includes("Tree")) {
    return (catalogItem.id.startsWith("wildtree_") || catalogItem.id.startsWith("fruittree_")) &&
      catalogItem.name === baseName;
  }

  return catalogItem.name === referenceName || catalogItem.name === baseName;
}

function normalizeReferencePlaceableName(referenceName: string): string {
  return referenceName
    .replace(/ \(Lit\)$/, "")
    .replace(/ \(Normal\)$/, "")
    .replace(/ \(No Fruit\)$/, "");
}

function getReferencePlaceableFamilyName(referenceName: string): string | undefined {
  if (/^Rarecrow(?: \d+)?$/.test(referenceName)) {
    return "Rarecrow";
  }
  if (referenceName === "Campfire" || /^Campfire(?: \d+)? \(Lit\)$/.test(referenceName)) {
    return "Campfire";
  }
  return undefined;
}

function isReferenceFloorName(referenceName: string): boolean {
  return [
    "Wood Floor",
    "Stone Floor",
    "Weathered Floor",
    "Crystal Floor",
    "Straw Floor",
    "Gravel Path",
    "Wood Path",
    "Crystal Path",
    "Cobblestone Path",
    "Stepping Stone Path",
    "Brick Floor",
    "Rustic Plank Floor",
    "Stone Walkway Floor",
  ].includes(referenceName);
}

function isReferenceFenceName(referenceName: string): boolean {
  return ["Gate", "Hardwood Fence", "Wood Fence", "Stone Fence", "Iron Fence"].includes(
    referenceName,
  );
}

export function deduplicateCatalogItems(
  catalogItems: readonly CatalogItem[],
): readonly CatalogItem[] {
  validateCatalogItems(catalogItems);
  const uniqueItemsById = new Map<string, CatalogItem>();

  for (const catalogItem of catalogItems) {
    const existingCatalogItem = uniqueItemsById.get(catalogItem.id);
    if (existingCatalogItem === undefined) {
      uniqueItemsById.set(catalogItem.id, catalogItem);
      continue;
    }
    const conflictingValues = getConflictingCatalogItemValues(
      existingCatalogItem,
      catalogItem,
    );
    if (conflictingValues.length > 0) {
      throw new Error(
        `Catalog item ID ${JSON.stringify(catalogItem.id)} has conflicting values: ${conflictingValues.join("; ")}.`,
      );
    }
  }

  return [...uniqueItemsById.values()];
}

function getConflictingCatalogItemValues(
  existingCatalogItem: CatalogItem,
  incomingCatalogItem: CatalogItem,
): string[] {
  const conflictingValues: string[] = [];

  for (const fieldName of catalogItemValueFields) {
    const existingValue = formatCatalogItemFieldValue(existingCatalogItem[fieldName]);
    const incomingValue = formatCatalogItemFieldValue(incomingCatalogItem[fieldName]);
    if (existingValue !== incomingValue) {
      conflictingValues.push(`${fieldName}: ${existingValue} vs ${incomingValue}`);
    }
  }

  return conflictingValues;
}

function formatCatalogItemFieldValue(fieldValue: unknown): string {
  const serializedValue = JSON.stringify(fieldValue, sortCatalogItemObjectKeys);
  return serializedValue === undefined ? String(fieldValue) : serializedValue;
}

function sortCatalogItemObjectKeys(_key: string, fieldValue: unknown): unknown {
  if (typeof fieldValue !== "object" || fieldValue === null || Array.isArray(fieldValue)) {
    return fieldValue;
  }

  const sortedEntries = Object.entries(fieldValue).sort(([leftKey], [rightKey]) =>
    leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0,
  );
  return Object.fromEntries(sortedEntries);
}

function validateCatalogItems(catalogItems: readonly CatalogItem[]): void {
  if (!Array.isArray(catalogItems)) {
    throw new TypeError(
      `Catalog items must be an array; received ${describeValue(catalogItems)}.`,
    );
  }
  for (const catalogItem of catalogItems) {
    validateCatalogItem(catalogItem);
  }
}

function validateCatalogItem(catalogItem: CatalogItem): void {
  if (typeof catalogItem !== "object" || catalogItem === null) {
    throw new TypeError(
      `Catalog item must be a non-null object; received ${describeValue(catalogItem)}.`,
    );
  }
  if (typeof catalogItem.id !== "string" || catalogItem.id.length === 0) {
    throw new TypeError(
      `Catalog item ID must be a non-empty string; received ${describeValue(catalogItem.id)}.`,
    );
  }
  if (typeof catalogItem.name !== "string" || catalogItem.name.length === 0) {
    throw new TypeError(
      `Catalog item ${JSON.stringify(catalogItem.id)} name must be a non-empty string; received ${describeValue(catalogItem.name)}.`,
    );
  }
  if (!(catalogItemCategories as readonly string[]).includes(catalogItem.category)) {
    throw new TypeError(
      `Catalog item ${JSON.stringify(catalogItem.id)} has unsupported category ${describeValue(catalogItem.category)}.`,
    );
  }
}

function validateCatalogSidebarCategory(category: string): asserts category is CatalogSidebarCategory {
  if (!(catalogSidebarCategories as readonly string[]).includes(category)) {
    throw new TypeError(
      `Catalog sidebar category must be one of ${catalogSidebarCategories.join(", ")}; received ${describeValue(category)}.`,
    );
  }
}

function validateCatalogSidebarFilter(
  category: CatalogSidebarCategory,
  filterId: string,
): void {
  if (
    filterId !== "all" &&
    !catalogSidebarFiltersByCategory[category].some(({ id }) => id === filterId)
  ) {
    throw new TypeError(
      `Catalog sidebar filter for category ${JSON.stringify(category)} must be "all" or one of ${catalogSidebarFiltersByCategory[category].map(({ id }) => JSON.stringify(id)).join(", ")}; received ${describeValue(filterId)}.`,
    );
  }
}

function validateCatalogSearchQuery(searchQuery: string): void {
  if (typeof searchQuery !== "string") {
    throw new TypeError(
      `Catalog sidebar search query must be a string; received ${describeValue(searchQuery)}.`,
    );
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "symbol" || typeof value === "function") {
    return String(value);
  }
  if (typeof value === "bigint") {
    return `${String(value)}n`;
  }
  return JSON.stringify(value) ?? String(value);
}
