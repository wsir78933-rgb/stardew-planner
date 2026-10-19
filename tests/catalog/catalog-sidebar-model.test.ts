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
import {
  deduplicateCatalogItems,
  getCatalogSidebarDisplayName,
  getCatalogSidebarReferenceEntry,
} from "../../src/catalog/catalog-sidebar-model";

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

function getSceneAvailableCatalogItems(
  catalogItems: readonly CatalogItem[],
  scene: "indoors" | "outdoors",
): CatalogItem[] {
  return catalogItems.filter((catalogItem) => {
    const referenceEntry = getCatalogSidebarReferenceEntry(catalogItem.id);
    if (referenceEntry !== undefined) {
      return referenceEntry[scene];
    }
    return scene === "indoors" && catalogItem.interiorDecorKind !== undefined;
  });
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

    expect(deduplicateCatalogItems([originalCatalogItem, { ...originalCatalogItem }]))
      .toEqual([originalCatalogItem]);
    expect(deduplicateCatalogItems([
      originalCatalogItem,
      { ...originalCatalogItem, tileSize: { height: 3, width: 4 } },
    ])).toEqual([originalCatalogItem]);

    expect(() =>
      deduplicateCatalogItems([
        originalCatalogItem,
        { ...originalCatalogItem, allowedTools: ["erase", "cursor"] },
      ]),
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
      deduplicateCatalogItems([originalCatalogItem, conflictingCatalogItem]),
    ).toThrow(
      'Catalog item ID "building:test-barn" has conflicting values: tileSize: {"height":3,"width":4} vs {"height":3,"width":5}; textureLocalPath: "/buildings.png" vs "/alternate-buildings.png"; sprite: {"height":48,"kind":"source-rect","width":64,"x":0,"y":0} vs {"height":48,"kind":"source-rect","width":80,"x":64,"y":0}.',
    );
  });

  it("selects all reference placeables by stable local ID", async () => {
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

    expect(selectedItems).toHaveLength(153);
    expect(new Set(selectedItems.map(({ id }) => id)).size).toBe(153);
    expect(selectedItems).toContainEqual(
      expect.objectContaining({ id: "object:251", name: "Tea Sapling" }),
    );
    expect(selectedItems).toContainEqual(
      expect.objectContaining({ id: "big-craftable:56", name: "Slime Ball" }),
    );
    expect(selectedItems.map(({ id }) => id)).toEqual(
      expect.arrayContaining(["bush:small", "bush:medium", "bush:large"]),
    );
  });

  it("projects exactly 949 reference items into stable categories and facets", async () => {
    const { items } = await createLockedSidebarCatalog();
    const referenceItems = items.filter(({ id }) =>
      getCatalogSidebarReferenceEntry(id) !== undefined,
    );
    const catalogItemIds = referenceItems.map(({ id }) => id);
    const expectedCategoryCounts: Readonly<Record<CatalogSidebarCategory, number>> = {
      buildings: 49,
      crops: 67,
      trees: 22,
      equipment: 71,
      paths: 21,
      lighting: 39,
      furniture: 257,
      decor: 423,
    };

    expect(referenceItems).toHaveLength(949);
    expect(new Set(catalogItemIds).size).toBe(catalogItemIds.length);

    for (const category of catalogSidebarCategories) {
      const categoryItems = getCatalogSidebarItems(referenceItems, category, "");
      const filters = getCatalogSidebarFilters(referenceItems, category);
      const facetGroups = filters.slice(1).map((filter) => {
        const filteredItems = getCatalogSidebarItems(referenceItems, category, "", filter.id);
        expect(filteredItems).toHaveLength(filter.count);
        return filteredItems;
      });
      const facetItemIds = facetGroups.flatMap((group) => group.map(({ id }) => id));

      expect(categoryItems).toHaveLength(expectedCategoryCounts[category]);
      expect(filters[0]).toMatchObject({
        id: "all",
        label: "All",
        count: expectedCategoryCounts[category],
      });
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

  it("matches Standard farm availability counts while retaining refused facet rows", async () => {
    const { items } = await createLockedSidebarCatalog();
    const referenceItems = items.filter(({ id }) =>
      getCatalogSidebarReferenceEntry(id) !== undefined,
    );
    const farmAvailableItems = getSceneAvailableCatalogItems(referenceItems, "outdoors");
    const expectedFarmFiltersByCategory: Readonly<
      Record<CatalogSidebarCategory, Readonly<Record<string, number>>>
    > = {
      buildings: {
        all: 49, animal: 7, production: 2, storage: 3, utility: 7,
        luxury: 5, cabins: 21, structures: 4,
      },
      crops: {
        all: 67, spring: 16, summer: 16, fall: 16, winter: 5,
        "multi-season": 8, "giant-crops": 5, saplings: 1,
      },
      trees: { all: 22, "wild-trees": 11, "fruit-trees": 8, bushes: 3 },
      equipment: { all: 69, utility: 32, machines: 37 },
      paths: { all: 21 },
      lighting: { all: 17 },
      furniture: {
        all: 100, chairs: 37, benches: 5, couches: 1,
        tables: 51, "long-tables": 5, tvs: 1,
      },
      decor: {
        all: 237, functional: 19, plants: 64,
        "large-decor": 43, "small-decor": 80, "special-items": 31,
      },
    };

    for (const category of catalogSidebarCategories) {
      const actualFilterCounts = Object.fromEntries(
        getCatalogSidebarFilters(farmAvailableItems, category)
          .map(({ id, count }) => [id, count]),
      );
      expect(actualFilterCounts).toEqual(expectedFarmFiltersByCategory[category]);
    }

    expect(getCatalogSidebarItems(referenceItems, "furniture", "", "couches"))
      .toHaveLength(13);
    expect(getCatalogSidebarItems(referenceItems, "furniture", "", "tvs"))
      .toHaveLength(6);
    expect(getCatalogSidebarItems(referenceItems, "decor", "", "plants"))
      .toHaveLength(85);
  });

  it("uses Farmhouse availability for the full indoor furniture and decor facets", async () => {
    const { items } = await createLockedSidebarCatalog();
    const referenceItems = items.filter(({ id }) =>
      getCatalogSidebarReferenceEntry(id) !== undefined,
    );
    const farmhouseAvailableItems = getSceneAvailableCatalogItems(referenceItems, "indoors");
    const expectedIndoorFiltersByCategory: Readonly<
      Partial<Record<CatalogSidebarCategory, Readonly<Record<string, number>>>>
    > = {
      equipment: { all: 71, utility: 33, machines: 38 },
      furniture: {
        all: 257, chairs: 37, benches: 5, couches: 13, armchairs: 5,
        cushions: 14, tables: 51, "long-tables": 5, bookcases: 13,
        dressers: 9, beds: 22, fireplaces: 11, rugs: 60, tvs: 6,
        "fish-tanks": 6,
      },
      decor: {
        all: 414, functional: 15, plants: 85, paintings: 89,
        "wall-hangings": 56, "windows-doors": 18, "large-decor": 41,
        "small-decor": 79, "special-items": 31,
      },
    };

    for (const [category, expectedCounts] of Object.entries(expectedIndoorFiltersByCategory)) {
      const sidebarCategory = category as CatalogSidebarCategory;
      const actualFilterCounts = Object.fromEntries(
        getCatalogSidebarFilters(farmhouseAvailableItems, sidebarCategory)
          .map(({ id, count }) => [id, count]),
      );
      expect(actualFilterCounts).toEqual(expectedCounts);
    }

    expect(getCatalogSidebarItems(referenceItems, "decor", "", "functional"))
      .toHaveLength(19);
    expect(getCatalogSidebarItems(referenceItems, "decor", "", "large-decor"))
      .toHaveLength(45);
    expect(getCatalogSidebarItems(referenceItems, "decor", "", "small-decor"))
      .toHaveLength(80);
  });

  it("searches and displays reference aliases while preserving distinct stable IDs", async () => {
    const { items } = await createLockedSidebarCatalog();
    const itemsById = new Map(items.map((catalogItem) => [catalogItem.id, catalogItem]));
    const getItemById = (itemId: string): CatalogItem => {
      const catalogItem = itemsById.get(itemId);
      if (catalogItem === undefined) {
        throw new Error(`Locked sidebar fixture is missing ${JSON.stringify(itemId)}.`);
      }
      return catalogItem;
    };

    expect(getCatalogSidebarItems(items, "buildings", "joja cola painting"))
      .toContainEqual(expect.objectContaining({ id: "furniture_JojaColaPainting" }));
    expect(getCatalogSidebarDisplayName(getItemById("furniture_JojaColaPainting")))
      .toBe("Joja Cola Painting");
    expect(getCatalogSidebarDisplayName(getItemById("furniture_JojaColaPainting"), "ja"))
      .toBe("Joja Cola Painting");
    expect(getCatalogSidebarDisplayName(getItemById("furniture_JojaColaPainting"), "ru"))
      .toBe("Картина Joja Cola");
    expect(getCatalogSidebarDisplayName(getItemById("big-craftable:113"), "ru"))
      .toBe("Редкое пугало 2");
    expect(getCatalogSidebarItems(items, "buildings", "crop:496_398"))
      .toContainEqual(expect.objectContaining({ id: "crop:496_398" }));
    expect(getCatalogSidebarItems(items, "crops", "grape").map(({ id }) => id))
      .toEqual(["crop:496_398", "crop:301"]);
    expect(getCatalogSidebarDisplayName(getItemById("big-craftable:113")))
      .toBe("Rarecrow 2");
    expect(getCatalogSidebarDisplayName(getItemById("big-craftable:278")))
      .toBe("Campfire 2");

    const fallbackCatalogItem: CatalogItem = {
      id: "placeable:test-status-name",
      name: "Test Decoration (Dry)",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/test.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
      allowedTools: ["cursor", "erase"],
    };
    expect(getCatalogSidebarDisplayName(fallbackCatalogItem)).toBe("Test Decoration");
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
      getCatalogSidebarReferenceEntry(catalogItem.id)?.facetId === "paintings",
    );
    const plant = itemByName("Topiary Tree");

    expect(hasItemInFilter("equipment", "machines", itemByName("Keg")?.id ?? "missing"))
      .toBe(true);
    for (const name of ["Chest", "Sprinkler", "Scarecrow", "Wood Sign"]) {
      const catalogItem = itemByName(name);
      expect(catalogItem).toBeDefined();
      expect(hasItemInFilter("equipment", "utility", catalogItem?.id ?? "missing"))
        .toBe(true);
    }
    const pierreSign = itemByName("Pierre's Sign");
    expect(getCatalogSidebarCategory(pierreSign!)).toBe("decor");
    expect(hasItemInFilter("decor", "wall-hangings", pierreSign?.id ?? "missing"))
      .toBe(true);
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
