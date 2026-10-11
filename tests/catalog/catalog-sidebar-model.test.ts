import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  catalogSidebarCategories,
  createBuildingCatalogFromDataset,
  createCropCatalogFromDatasets,
  createDecorCatalogFromDataset,
  createPlaceableCatalogFromDatasets,
  getCatalogSidebarCategory,
  getCatalogSidebarFilters,
  getCatalogSidebarItems,
  selectCatalogSidebarPlaceableItems,
  type CatalogItem,
  type CatalogSidebarCategory,
} from "../../src/catalog";

type LockedCatalogDatasetName = keyof typeof catalogDatasetUrls;
type LockedCropRecord = Readonly<{ Seasons?: unknown }>;

const filenameByDatasetName: Readonly<Record<LockedCatalogDatasetName, string>> = {
  buildings: "Buildings.json",
  crops: "Crops.json",
  bigCraftables: "BigCraftables.json",
  objects: "Objects.json",
  fences: "Fences.json",
  floorsAndPaths: "FloorsAndPaths.json",
  furniture: "Furniture.json",
  fruitTrees: "FruitTrees.json",
};

const supplementaryForageFacetByItemId: Readonly<Record<string, string>> = {
  "crop:495_18": "spring",
  "crop:495_20": "spring",
  "crop:495_22": "spring",
  "crop:496_398": "summer",
  "crop:496_402": "summer",
  "crop:497_406": "fall",
  "crop:497_408": "fall",
  "crop:497_410": "fall",
  "crop:498_414": "winter",
  "crop:498_416": "winter",
  "crop:498_418": "winter",
};

async function readLockedCatalogDataset(
  datasetName: LockedCatalogDatasetName,
): Promise<unknown> {
  const datasetPath = path.join(
    process.cwd(),
    "public/game-assets/1.6.15/data",
    filenameByDatasetName[datasetName],
  );

  return JSON.parse(await readFile(datasetPath, "utf8")) as unknown;
}

async function createLockedSidebarCatalog(): Promise<Readonly<{
  cropRecords: Readonly<Record<string, LockedCropRecord>>;
  items: readonly CatalogItem[];
}>> {
  const lockedDatasetEntries = await Promise.all(
    (Object.keys(catalogDatasetUrls) as LockedCatalogDatasetName[]).map(
      async (datasetName) => [datasetName, await readLockedCatalogDataset(datasetName)] as const,
    ),
  );
  const lockedDatasets = Object.fromEntries(lockedDatasetEntries) as Readonly<
    Record<LockedCatalogDatasetName, unknown>
  >;
  const buildingCatalog = createBuildingCatalogFromDataset(
    lockedDatasets.buildings,
    catalogDatasetUrls.buildings,
  );
  const cropCatalog = createCropCatalogFromDatasets(
    lockedDatasets.crops,
    lockedDatasets.objects,
    catalogDatasetUrls.crops,
    catalogDatasetUrls.objects,
  );
  const placeableCatalog = createPlaceableCatalogFromDatasets(
    lockedDatasets.bigCraftables,
    lockedDatasets.objects,
    lockedDatasets.fences,
    lockedDatasets.floorsAndPaths,
    lockedDatasets.furniture,
    lockedDatasets.fruitTrees,
    catalogDatasetUrls,
  );
  const decorCatalog = createDecorCatalogFromDataset(
    lockedDatasets.furniture,
    catalogDatasetUrls.furniture,
    lockedDatasets.bigCraftables,
    catalogDatasetUrls.bigCraftables,
  );
  const itemsById = new Map<string, CatalogItem>();

  for (const catalogItem of [
    ...buildingCatalog.items,
    ...cropCatalog.items,
    ...selectCatalogSidebarPlaceableItems(placeableCatalog.items),
    ...decorCatalog.items,
  ]) {
    const existingCatalogItem = itemsById.get(catalogItem.id);
    if (existingCatalogItem !== undefined) {
      expect(existingCatalogItem).toMatchObject({
        category: catalogItem.category,
        name: catalogItem.name,
      });
      continue;
    }
    itemsById.set(catalogItem.id, catalogItem);
  }

  return {
    cropRecords: lockedDatasets.crops as Readonly<Record<string, LockedCropRecord>>,
    items: [...itemsById.values()],
  };
}

function getExpectedCropFacetId(
  catalogItemId: string,
  cropRecords: Readonly<Record<string, LockedCropRecord>>,
): string {
  if (catalogItemId === "object:251") {
    return "saplings";
  }
  if (catalogItemId.startsWith("crop:giant_")) {
    return "giant-crops";
  }
  const supplementaryFacetId = supplementaryForageFacetByItemId[catalogItemId];
  if (supplementaryFacetId !== undefined) {
    return supplementaryFacetId;
  }
  if (!catalogItemId.startsWith("crop:")) {
    throw new Error(`Unexpected crop sidebar ID ${JSON.stringify(catalogItemId)}.`);
  }

  const cropRecordId = catalogItemId.slice("crop:".length);
  const cropRecord = cropRecords[cropRecordId];
  if (cropRecord === undefined) {
    throw new Error(
      `Crop sidebar item ${JSON.stringify(catalogItemId)} has no locked raw crop record.`,
    );
  }
  const seasons = cropRecord.Seasons;
  if (!Array.isArray(seasons) || seasons.some((season) => typeof season !== "string")) {
    throw new Error(
      `Crop source ${JSON.stringify(cropRecordId)} has invalid Seasons ${JSON.stringify(seasons)}.`,
    );
  }
  if (seasons.length !== 1) {
    return "multi-season";
  }

  const season = seasons[0]?.toLowerCase();
  if (["spring", "summer", "fall", "winter"].includes(season ?? "")) {
    return season ?? "multi-season";
  }

  return "multi-season";
}

describe("catalog sidebar model", () => {
  it("exposes the eight stable top-level category IDs", () => {
    expect(catalogSidebarCategories).toEqual([
      "buildings",
      "crops",
      "trees",
      "equipment",
      "paths",
      "lighting",
      "furniture",
      "decor",
    ]);
  });

  it("deduplicates identical IDs and rejects conflicting render values", () => {
    const originalCatalogItem: CatalogItem = {
      id: "building:test-barn",
      name: "Test Barn",
      category: "building",
      tileSize: { width: 4, height: 3 },
      textureLocalPath: "/buildings.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 64, height: 48 },
      allowedTools: ["cursor", "erase"],
    };

    expect(
      getCatalogSidebarItems(
        [originalCatalogItem, { ...originalCatalogItem }],
        "buildings",
        "test barn",
      ),
    ).toEqual([originalCatalogItem]);
    expect(
      getCatalogSidebarItems(
        [
          originalCatalogItem,
          { ...originalCatalogItem, tileSize: { height: 3, width: 4 } },
        ],
        "buildings",
        "test barn",
      ),
    ).toEqual([originalCatalogItem]);

    expect(() =>
      getCatalogSidebarItems(
        [originalCatalogItem, { ...originalCatalogItem, allowedTools: ["erase", "cursor"] }],
        "buildings",
        "test barn",
      ),
    ).toThrow(
      'Catalog item ID "building:test-barn" has conflicting values: allowedTools: ["cursor","erase"] vs ["erase","cursor"].',
    );

    const conflictingCatalogItem: CatalogItem = {
      ...originalCatalogItem,
      tileSize: { width: 5, height: 3 },
      textureLocalPath: "/alternate-buildings.png",
      sprite: { kind: "source-rect", x: 64, y: 0, width: 80, height: 48 },
    };

    expect(() =>
      getCatalogSidebarItems(
        [originalCatalogItem, conflictingCatalogItem],
        "buildings",
        "test barn",
      ),
    ).toThrow(
      'Catalog item ID "building:test-barn" has conflicting values: tileSize: {"height":3,"width":4} vs {"height":3,"width":5}; textureLocalPath: "/buildings.png" vs "/alternate-buildings.png"; sprite: {"height":48,"kind":"source-rect","width":64,"x":0,"y":0} vs {"height":48,"kind":"source-rect","width":80,"x":64,"y":0}.',
    );
  });

  it("selects the original 149 visible placeables in reference order", async () => {
    const [
      bigCraftables,
      objects,
      fences,
      floorsAndPaths,
      furniture,
      fruitTrees,
    ] = await Promise.all([
      readLockedCatalogDataset("bigCraftables"),
      readLockedCatalogDataset("objects"),
      readLockedCatalogDataset("fences"),
      readLockedCatalogDataset("floorsAndPaths"),
      readLockedCatalogDataset("furniture"),
      readLockedCatalogDataset("fruitTrees"),
    ]);
    const placeableCatalog = createPlaceableCatalogFromDatasets(
      bigCraftables,
      objects,
      fences,
      floorsAndPaths,
      furniture,
      fruitTrees,
      catalogDatasetUrls,
    );
    const selectedItems = selectCatalogSidebarPlaceableItems(placeableCatalog.items);

    expect(selectedItems).toHaveLength(149);
    expect(new Set(selectedItems.map(({ id }) => id)).size).toBe(149);
    expect(selectedItems).toContainEqual(
      expect.objectContaining({ id: "object:251", name: "Tea Sapling" }),
    );
    expect(selectedItems.at(-1)).toMatchObject({
      id: "furniture_mannequin_cursed_female",
      name: "Cursed Mannequin (Female)",
    });
  });

  it("partitions every current visible ID into one category and one visible facet", async () => {
    const { items } = await createLockedSidebarCatalog();
    const catalogItemIds = items.map(({ id }) => id);

    expect(new Set(catalogItemIds).size).toBe(catalogItemIds.length);

    for (const category of catalogSidebarCategories) {
      const categoryItems = getCatalogSidebarItems(items, category, "");
      const filters = getCatalogSidebarFilters(items, category);
      const facetGroups = filters.slice(1).map((filter) => {
        const filteredItems = getCatalogSidebarItems(items, category, "", filter.id);
        expect(filteredItems).toHaveLength(filter.count);
        return filteredItems;
      });
      const facetItemIds = facetGroups.flatMap((group) => group.map(({ id }) => id));

      expect(filters[0]).toMatchObject({ id: "all", label: "All", count: categoryItems.length });
      expect(new Set(facetItemIds).size).toBe(facetItemIds.length);
      if (filters.length > 1) {
        expect([...facetItemIds].sort()).toEqual(categoryItems.map(({ id }) => id).sort());
      }
      expect(categoryItems.every((catalogItem) =>
        getCatalogSidebarCategory(catalogItem) === category,
      )).toBe(true);
    }
  });

  it("matches all 49 buildings to the approved stable facet partition", async () => {
    const { items } = await createLockedSidebarCatalog();
    const filters = getCatalogSidebarFilters(items, "buildings");
    const countsById = Object.fromEntries(
      filters.map(({ id, count }) => [id, count]),
    );

    expect(countsById).toEqual({
      all: 49,
      animal: 7,
      production: 2,
      storage: 3,
      utility: 7,
      luxury: 5,
      cabins: 21,
      structures: 4,
    });
  });

  it("maps the approved equipment, lighting, furniture, decor, tree, and path boundaries", async () => {
    const { items } = await createLockedSidebarCatalog();
    const hasItemInFilter = (
      category: CatalogSidebarCategory,
      filterId: string,
      catalogItemId: string,
    ) => getCatalogSidebarItems(items, category, "", filterId).some(
      (catalogItem) => catalogItem.id === catalogItemId,
    );
    const itemByName = (name: string) => items.find((catalogItem) => catalogItem.name === name);
    const fireplace = items.find((catalogItem) =>
      catalogItem.renderingMetadata?.kind === "furniture" &&
      catalogItem.renderingMetadata.furnitureType === "fireplace",
    );
    const fishTank = items.find((catalogItem) =>
      catalogItem.renderingMetadata?.kind === "furniture" &&
      catalogItem.renderingMetadata.furnitureType === "fishtank",
    );
    const wildTree = items.find((catalogItem) =>
      catalogItem.renderingMetadata?.kind === "wild-tree",
    );
    const fruitTree = items.find((catalogItem) =>
      catalogItem.renderingMetadata?.kind === "fruit-tree",
    );
    const painting = items.find((catalogItem) =>
      catalogItem.renderingMetadata?.kind === "furniture" &&
      catalogItem.renderingMetadata.furnitureType === "painting",
    );
    const plant = itemByName("Topiary Tree");

    expect(hasItemInFilter("equipment", "machines", itemByName("Keg")?.id ?? "missing"))
      .toBe(true);
    for (const name of ["Chest", "Sprinkler", "Scarecrow", "Wood Sign", "Pierre's Sign"]) {
      const catalogItem = itemByName(name);
      expect(catalogItem).toBeDefined();
      expect(hasItemInFilter("equipment", "utility", catalogItem?.id ?? "missing"))
        .toBe(true);
    }
    expect(hasItemInFilter("lighting", "all", itemByName("Wood Lamp-post")?.id ?? "missing"))
      .toBe(true);
    expect(getCatalogSidebarCategory(fireplace!)).toBe("furniture");
    expect(hasItemInFilter("furniture", "fireplaces", fireplace?.id ?? "missing"))
      .toBe(true);
    expect(hasItemInFilter("furniture", "fish-tanks", fishTank?.id ?? "missing"))
      .toBe(true);
    expect(getCatalogSidebarCategory(wildTree!)).toBe("trees");
    expect(hasItemInFilter("trees", "wild-trees", wildTree?.id ?? "missing")).toBe(true);
    expect(hasItemInFilter("trees", "fruit-trees", fruitTree?.id ?? "missing")).toBe(true);
    expect(hasItemInFilter("paths", "all", "grass_1")).toBe(true);
    expect(hasItemInFilter("paths", "all", "hoedirt")).toBe(true);
    expect(hasItemInFilter("decor", "wallpaper", "wp_0")).toBe(true);
    expect(hasItemInFilter("decor", "flooring", "fl_MoreFloors:8")).toBe(true);
    expect(hasItemInFilter("decor", "paintings", painting?.id ?? "missing")).toBe(true);
    expect(hasItemInFilter("decor", "plants", plant?.id ?? "missing")).toBe(true);
    expect(getCatalogSidebarFilters(items, "paths").map(({ id }) => id)).toEqual(["all"]);
    expect(getCatalogSidebarFilters(items, "lighting").map(({ id }) => id)).toEqual(["all"]);
  });

  it("locks every crop, forage, giant crop, and sapling to exactly one season facet", async () => {
    const { cropRecords, items } = await createLockedSidebarCatalog();
    const cropItems = getCatalogSidebarItems(items, "crops", "");
    const filters = getCatalogSidebarFilters(items, "crops");
    const facetByItemId = new Map<string, string>();

    for (const filter of filters.slice(1)) {
      for (const catalogItem of getCatalogSidebarItems(items, "crops", "", filter.id)) {
        facetByItemId.set(catalogItem.id, filter.id);
      }
    }

    expect(cropItems).toHaveLength(Object.keys(cropRecords).length + 11 + 5 + 1);
    expect(facetByItemId.size).toBe(cropItems.length);
    for (const catalogItem of cropItems) {
      expect(facetByItemId.get(catalogItem.id)).toBe(
        getExpectedCropFacetId(catalogItem.id, cropRecords),
      );
    }
  });

  it("searches the full catalog by name or ID regardless of selected category and facet", async () => {
    const { items } = await createLockedSidebarCatalog();

    expect(
      getCatalogSidebarItems(items, "buildings", "  kEg  ", "animal").some(
        (catalogItem) => catalogItem.name === "Keg",
      ),
    ).toBe(true);
    expect(
      getCatalogSidebarItems(items, "buildings", " wallpaper 0 ", "structures").some(
        (catalogItem) => catalogItem.id === "wp_0",
      ),
    ).toBe(true);
    expect(
      getCatalogSidebarItems(items, "buildings", " grass_1 ", "structures").some(
        (catalogItem) => catalogItem.id === "grass_1",
      ),
    ).toBe(true);
  });

  it("rejects unsupported sidebar categories, filters, and malformed catalog inputs", () => {
    const emptyCatalog: readonly CatalogItem[] = [];
    const invalidSearchQuery = function sidebarSearchQuery() {};

    expect(() =>
      getCatalogSidebarItems(emptyCatalog, "unknown" as CatalogSidebarCategory, ""),
    ).toThrow(/received "unknown"/);
    expect(() =>
      getCatalogSidebarItems(emptyCatalog, Symbol("invalid-category") as unknown as CatalogSidebarCategory, ""),
    ).toThrow(/Symbol\(invalid-category\)/);
    expect(() =>
      getCatalogSidebarItems(emptyCatalog, "crops", "", "not-a-crop-facet"),
    ).toThrow(/received "not-a-crop-facet"/);
    expect(() =>
      getCatalogSidebarItems(emptyCatalog, "crops", 17n as unknown as string),
    ).toThrow(/received 17n/);
    expect(() =>
      getCatalogSidebarItems(emptyCatalog, "crops", invalidSearchQuery as unknown as string),
    ).toThrow(/function sidebarSearchQuery/);
    expect(() =>
      getCatalogSidebarFilters(undefined as unknown as readonly CatalogItem[], "crops"),
    ).toThrow(/Catalog items must be an array/);
  });
});
