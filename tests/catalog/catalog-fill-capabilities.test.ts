import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createCatalogFromDatasets,
  createDecorCatalogFromDataset,
  createPlaceableCatalogFromDatasets,
  type CatalogItem,
} from "../../src/catalog";

async function readLockedDataset(filename: string): Promise<unknown> {
  return JSON.parse(
    await readFile(
      path.join(process.cwd(), "public/game-assets/1.6.15/data", filename),
      "utf8",
    ),
  ) as unknown;
}

type LockedDatasets = Readonly<{
  buildings: unknown;
  crops: unknown;
  bigCraftables: unknown;
  objects: unknown;
  fences: unknown;
  floorsAndPaths: unknown;
  furniture: unknown;
  fruitTrees: unknown;
}>;

async function readAllDatasets(): Promise<LockedDatasets> {
  const [
    buildings,
    crops,
    bigCraftables,
    objects,
    fences,
    floorsAndPaths,
    furniture,
    fruitTrees,
  ] = await Promise.all([
    readLockedDataset("Buildings.json"),
    readLockedDataset("Crops.json"),
    readLockedDataset("BigCraftables.json"),
    readLockedDataset("Objects.json"),
    readLockedDataset("Fences.json"),
    readLockedDataset("FloorsAndPaths.json"),
    readLockedDataset("Furniture.json"),
    readLockedDataset("FruitTrees.json"),
  ]);

  return {
    buildings,
    crops,
    bigCraftables,
    objects,
    fences,
    floorsAndPaths,
    furniture,
    fruitTrees,
  };
}

const standardFillableTools = ["cursor", "multi-select", "fill", "erase"] as const;
const patternNonFillableTools = ["cursor", "multi-select", "erase"] as const;

describe("catalog fill capability contracts across factories", () => {
  it("equips all full catalog placeable and grid stamp items with the fill tool", async () => {
    const datasets = await readAllDatasets();
    const catalog = createCatalogFromDatasets(datasets, catalogDatasetUrls);

    expect(catalog.items.length).toBeGreaterThan(1600);

    const itemsMissingFill = catalog.items.filter(
      (item) => !item.allowedTools.includes("fill"),
    );

    expect(
      itemsMissingFill.map((item) => ({
        id: item.id,
        category: item.category,
        allowedTools: item.allowedTools,
      })),
    ).toEqual([]);

    for (const item of catalog.items) {
      expect(item.allowedTools).toEqual(standardFillableTools);
    }
  });

  it("equips all placeable catalog items including supplementary items with the fill tool", async () => {
    const datasets = await readAllDatasets();
    const placeableCatalog = createPlaceableCatalogFromDatasets(
      datasets.bigCraftables,
      datasets.objects,
      datasets.fences,
      datasets.floorsAndPaths,
      datasets.furniture,
      datasets.fruitTrees,
      catalogDatasetUrls,
    );

    expect(placeableCatalog.items.length).toBeGreaterThan(1500);

    const itemsMissingFill = placeableCatalog.items.filter(
      (item) => !item.allowedTools.includes("fill"),
    );

    expect(
      itemsMissingFill.map((item) => ({
        id: item.id,
        category: item.category,
        allowedTools: item.allowedTools,
      })),
    ).toEqual([]);

    for (const item of placeableCatalog.items) {
      expect(item.allowedTools).toEqual(standardFillableTools);
    }
  });

  it("verifies fill capabilities on representative items of every category and footprint", async () => {
    const datasets = await readAllDatasets();
    const fullCatalog = createCatalogFromDatasets(datasets, catalogDatasetUrls);
    const placeableCatalog = createPlaceableCatalogFromDatasets(
      datasets.bigCraftables,
      datasets.objects,
      datasets.fences,
      datasets.floorsAndPaths,
      datasets.furniture,
      datasets.fruitTrees,
      catalogDatasetUrls,
    );

    const combinedMap = new Map<string, CatalogItem>();
    for (const item of fullCatalog.items) {
      combinedMap.set(item.id, item);
    }
    for (const item of placeableCatalog.items) {
      combinedMap.set(item.id, item);
    }

    const representativeItemIds = [
      // Standard objects and lighting
      "object:0",
      "object:93",
      // Big craftables (chests, machines, lamps)
      "big-craftable:0",
      "big-craftable:130",
      // Supplementary grass items
      "grass_1",
      "grass_7",
      // Mannequin supplementary placeables
      "furniture_mannequin_male",
      "furniture_mannequin_female",
      // Gate and fence
      "object:325",
      "fence:322",
      // Resource clumps (2x2 decor)
      "clump_600",
      "clump_602",
      "clump_622",
      "clump_672",
      // Fruit and wild trees
      "fruittree_628",
      "wildtree_1",
      // Multi-tile bushes
      "bush:small",
      "bush:medium",
      "bush:large",
      // Furniture (various footprints & composite)
      "furniture_0",
      "furniture_724",
      "furniture_1451",
      "furniture_FreeCactus",
      // Crops and giant crops
      "crop:CarrotSeeds",
      "crop:giant_Cauliflower",
      "crop:giant_Melon",
      "crop:giant_Pumpkin",
      // Floors & tilled dirt
      "floor:0",
      "hoedirt",
      // Multi-tile buildings
      "building:Coop",
      "building:Cabin",
    ];

    for (const id of representativeItemIds) {
      const item = combinedMap.get(id);
      expect(item, `Representative item ${id} should exist`).toBeDefined();
      expect(item?.allowedTools).toEqual(standardFillableTools);
    }
  });

  it("preserves non-fill tool constraints strictly for interior wallpaper and flooring patterns", async () => {
    const datasets = await readAllDatasets();
    const decorCatalog = createDecorCatalogFromDataset(
      datasets.furniture,
      catalogDatasetUrls.furniture,
      datasets.bigCraftables,
      catalogDatasetUrls.bigCraftables,
    );

    const patternItems = decorCatalog.items.filter(
      (item) => item.interiorDecorKind !== undefined,
    );
    const nonPatternDecorItems = decorCatalog.items.filter(
      (item) => item.interiorDecorKind === undefined,
    );

    expect(patternItems.length).toBeGreaterThan(0);
    expect(nonPatternDecorItems.length).toBeGreaterThan(0);

    for (const patternItem of patternItems) {
      expect(
        patternItem.allowedTools,
        `Pattern item ${patternItem.id} must NOT have fill tool`,
      ).toEqual(patternNonFillableTools);
    }

    for (const decorItem of nonPatternDecorItems) {
      expect(
        decorItem.allowedTools,
        `Non-pattern decor item ${decorItem.id} must have fill tool`,
      ).toEqual(standardFillableTools);
    }
  });
});
