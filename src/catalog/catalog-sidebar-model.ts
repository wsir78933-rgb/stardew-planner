import { getRussianCatalogItemDisplayName } from "../i18n/planner-russian-display-names";
import type { HomepageLocale } from "../homepage/homepage-locale";
import { catalogItemCategories, type CatalogItem } from "./catalog-types";
import { referencePlaceableCatalogItemIds } from "./reference-placeable-order";
import {
  getCatalogSidebarReferenceEntry as findCatalogSidebarReferenceEntry,
} from "./catalog-sidebar-reference";

export {
  getCatalogSidebarReferenceEntry,
} from "./catalog-sidebar-reference";
export type {
  CatalogSidebarReferenceEntry,
} from "./catalog-sidebar-reference";

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
    { id: "bushes", label: "Bushes" },
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
    { id: "cushions", label: "Cushions" },
    { id: "tables", label: "Tables" },
    { id: "long-tables", label: "Long tables" },
    { id: "bookcases", label: "Bookcases" },
    { id: "dressers", label: "Dressers" },
    { id: "beds", label: "Beds" },
    { id: "fireplaces", label: "Fireplaces" },
    { id: "rugs", label: "Rugs" },
    { id: "tvs", label: "TVs" },
    { id: "fish-tanks", label: "Fish tanks" },
  ],
  decor: [
    { id: "functional", label: "Functional" },
    { id: "plants", label: "Plants" },
    { id: "paintings", label: "Paintings" },
    { id: "wall-hangings", label: "Wall hangings" },
    { id: "windows-doors", label: "Windows & doors" },
    { id: "large-decor", label: "Large decor" },
    { id: "small-decor", label: "Small decor" },
    { id: "special-items", label: "Special items" },
    { id: "wallpaper", label: "Wallpaper" },
    { id: "flooring", label: "Flooring" },
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
};

export function getCatalogSidebarCategory(
  catalogItem: CatalogItem,
): CatalogSidebarCategory {
  validateCatalogItem(catalogItem);
  const referenceEntry = findCatalogSidebarReferenceEntry(catalogItem.id);
  if (referenceEntry !== undefined) {
    return referenceEntry.category;
  }

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
  const categoryItems = getReferenceCategoryItems(
    deduplicateCatalogItems(catalogItems),
    category,
  );
  const filters: CatalogSidebarFilter[] = [
    {
      id: "all",
      label: "All",
      count: categoryItems.length,
    },
  ];

  for (const filterDefinition of catalogSidebarFiltersByCategory[category]) {
    const count = categoryItems.filter((catalogItem) =>
      getCatalogSidebarFacetId(catalogItem) === filterDefinition.id,
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
  locale: HomepageLocale = "en",
): CatalogItem[] {
  validateCatalogSidebarCategory(category);
  validateCatalogSearchQuery(searchQuery);
  validateCatalogSidebarFilter(category, filterId);
  assertHomepageLocale(locale);
  const uniqueCatalogItems = deduplicateCatalogItems(catalogItems);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  if (normalizedSearchQuery.length > 0) {
    return sortCatalogItemsBySidebarOrder(uniqueCatalogItems.filter((catalogItem) => {
      const referenceEntry = findCatalogSidebarReferenceEntry(catalogItem.id);
      if (referenceEntry === undefined && !isInteriorPattern(catalogItem)) {
        return false;
      }
      const displayName = normalizeCatalogDisplayName(
        referenceEntry?.displayName ?? catalogItem.name,
      );
      const matchesEnglishNameOrId = catalogItem.name.toLowerCase().includes(normalizedSearchQuery) ||
        displayName.toLowerCase().includes(normalizedSearchQuery) ||
        catalogItem.id.toLowerCase().includes(normalizedSearchQuery);
      if (locale !== "ru") {
        return matchesEnglishNameOrId;
      }
      const russianDisplayName = readRussianCatalogSidebarDisplayName(catalogItem);
      return matchesEnglishNameOrId ||
        russianDisplayName.toLowerCase().includes(normalizedSearchQuery);
    }));
  }

  return sortCatalogItemsBySidebarOrder(getReferenceCategoryItems(uniqueCatalogItems, category)
    .filter((catalogItem) => {
      if (filterId === "all") {
        return true;
      }
      return getCatalogSidebarFacetId(catalogItem) === filterId;
    }));
}

export function getCatalogSidebarDisplayName(
  catalogItem: CatalogItem,
  locale: HomepageLocale = "en",
): string {
  validateCatalogItem(catalogItem);
  assertHomepageLocale(locale);
  if (locale === "ru") {
    return readRussianCatalogSidebarDisplayName(catalogItem);
  }
  const referenceEntry = findCatalogSidebarReferenceEntry(catalogItem.id);
  return normalizeCatalogDisplayName(referenceEntry?.displayName ?? catalogItem.name);
}

export function selectCatalogSidebarPlaceableItems(
  catalogItems: readonly CatalogItem[],
): readonly CatalogItem[] {
  validateCatalogItems(catalogItems);
  const uniqueCatalogItems = deduplicateCatalogItems(catalogItems);
  const candidateCatalogItemById = new Map(uniqueCatalogItems.filter((catalogItem) =>
    catalogItem.renderingMetadata?.kind !== "furniture" &&
    (catalogItem.category === "placeable" ||
      catalogItem.category === "floor" ||
      catalogItem.category === "fence" ||
      catalogItem.id.startsWith("clump_")),
  ).map((catalogItem) => [catalogItem.id, catalogItem]));
  const selectedCatalogItems: CatalogItem[] = [];

  for (const referenceItemId of referencePlaceableCatalogItemIds) {
    const selectedCatalogItem = candidateCatalogItemById.get(referenceItemId);

    if (selectedCatalogItem === undefined) {
      throw new Error(
        `Reference placeables require local catalog item ID ${JSON.stringify(referenceItemId)}; no placeable source item matched it.`,
      );
    }

    selectedCatalogItems.push(selectedCatalogItem);
  }

  return selectedCatalogItems;
}

function getReferenceCategoryItems(
  catalogItems: readonly CatalogItem[],
  category: CatalogSidebarCategory,
): CatalogItem[] {
  return catalogItems.filter((catalogItem) =>
    findCatalogSidebarReferenceEntry(catalogItem.id)?.category === category ||
    (category === "decor" && isInteriorPattern(catalogItem)),
  );
}

function sortCatalogItemsBySidebarOrder(catalogItems: readonly CatalogItem[]): CatalogItem[] {
  return [...catalogItems].sort((leftItem, rightItem) => {
    const leftEntry = findCatalogSidebarReferenceEntry(leftItem.id);
    const rightEntry = findCatalogSidebarReferenceEntry(rightItem.id);
    if (leftEntry === undefined && rightEntry === undefined) {
      return 0;
    }
    if (leftEntry === undefined) {
      return 1;
    }
    if (rightEntry === undefined) {
      return -1;
    }
    const categoryOrderDifference = catalogSidebarCategories.indexOf(leftEntry.category) -
      catalogSidebarCategories.indexOf(rightEntry.category);
    return categoryOrderDifference || leftEntry.order - rightEntry.order;
  });
}

function getCatalogSidebarFacetId(catalogItem: CatalogItem): string {
  const referenceEntry = findCatalogSidebarReferenceEntry(catalogItem.id);
  if (referenceEntry !== undefined) {
    return referenceEntry.facetId;
  }
  if (catalogItem.interiorDecorKind === "wallpaper") {
    return "wallpaper";
  }
  if (catalogItem.interiorDecorKind === "flooring") {
    return "flooring";
  }

  throw new Error(
    `Catalog item ${JSON.stringify(catalogItem.id)} has no sidebar facet mapping.`,
  );
}

function isInteriorPattern(
  catalogItem: CatalogItem,
): catalogItem is CatalogItem & { interiorDecorKind: "wallpaper" | "flooring" } {
  return catalogItem.interiorDecorKind === "wallpaper" ||
    catalogItem.interiorDecorKind === "flooring";
}

function assertHomepageLocale(locale: HomepageLocale): void {
  if (locale !== "en" && locale !== "zh-CN" && locale !== "ja" && locale !== "ru") {
    throw new TypeError(
      `Homepage locale must be "en", "zh-CN", "ja", or "ru"; received ${describeValue(locale)}.`,
    );
  }
}

function readRussianCatalogSidebarDisplayName(catalogItem: CatalogItem): string {
  if (isInteriorPattern(catalogItem)) {
    return readRussianInteriorPatternDisplayName(catalogItem);
  }
  return getRussianCatalogItemDisplayName(catalogItem.id);
}

function readRussianInteriorPatternDisplayName(
  catalogItem: CatalogItem & { interiorDecorKind: "wallpaper" | "flooring" },
): string {
  const englishPrefix = catalogItem.interiorDecorKind === "wallpaper" ? "Wallpaper " : "Flooring ";
  if (!catalogItem.name.startsWith(englishPrefix)) {
    throw new Error(
      `Interior ${catalogItem.interiorDecorKind} item ${JSON.stringify(catalogItem.id)} has name ${JSON.stringify(catalogItem.name)}, which does not start with ${JSON.stringify(englishPrefix)}.`,
    );
  }
  const patternId = catalogItem.name.slice(englishPrefix.length);
  if (patternId.length === 0) {
    throw new Error(
      `Interior ${catalogItem.interiorDecorKind} item ${JSON.stringify(catalogItem.id)} is missing a pattern id in name ${JSON.stringify(catalogItem.name)}.`,
    );
  }
  const russianKind = catalogItem.interiorDecorKind === "wallpaper" ? "Обои" : "Пол";
  return `${russianKind} ${patternId}`;
}

function normalizeCatalogDisplayName(displayName: string): string {
  return displayName.replace(/\s+\((?:Normal|No Fruit|Lit|Dry)\)$/, "");
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
