import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogSidebarCategories,
  createCatalogCategoryLoader,
  getCatalogSidebarItems,
  selectCatalogSidebarPlaceableItems,
  type CatalogSidebarCategory,
} from "../../src/catalog";
import type { CatalogItem } from "../../src/catalog/catalog-types";
import { getCatalogSidebarReferenceEntry } from "../../src/catalog/catalog-sidebar-model";
import {
  getCatalogItemSceneAvailability,
  isCatalogItemVisibleOnMap,
} from "../../src/catalog/catalog-scene-availability";

describe("catalog scene availability", () => {
  it("uses furniture permissions for Standard Farm and interior maps", () => {
    const indoorFurniture = createCatalogItem({
      renderingMetadata: createFurnitureMetadata(true, false),
    });
    const outdoorFurniture = createCatalogItem({
      renderingMetadata: createFurnitureMetadata(false, true),
    });
    const universalFurniture = createCatalogItem({
      renderingMetadata: createFurnitureMetadata(true, true),
    });

    expect(getCatalogItemSceneAvailability(indoorFurniture, "standard")).toBe(
      "indoor-only",
    );
    expect(getCatalogItemSceneAvailability(indoorFurniture, "farmhouse-0")).toBe(
      "available",
    );
    expect(getCatalogItemSceneAvailability(outdoorFurniture, "standard")).toBe(
      "available",
    );
    expect(getCatalogItemSceneAvailability(outdoorFurniture, "farmhouse-0")).toBe(
      "outdoor-only",
    );
    expect(getCatalogItemSceneAvailability(universalFurniture, "standard")).toBe(
      "available",
    );
    expect(getCatalogItemSceneAvailability(universalFurniture, "farmhouse-0")).toBe(
      "available",
    );
  });

  it("keeps unlisted non-furniture items available", () => {
    const building = createCatalogItem({ category: "building" });

    expect(getCatalogItemSceneAvailability(building, "standard")).toBe(
      "available",
    );
    expect(getCatalogItemSceneAvailability(building, "farmhouse-0")).toBe(
      "available",
    );
  });

  it("uses verified scene permissions for Mini-Fridge and Ostrich Incubator", () => {
    const miniFridge = createCatalogItem({ id: "big-craftable:216" });
    const ostrichIncubator = createCatalogItem({ id: "big-craftable:254" });

    for (const catalogItem of [miniFridge, ostrichIncubator]) {
      expect(getCatalogItemSceneAvailability(catalogItem, "standard")).toBe(
        "indoor-only",
      );
      expect(getCatalogItemSceneAvailability(catalogItem, "farmhouse-0")).toBe(
        "available",
      );
    }
  });

  it("keeps fruit and wild trees available on the two greenhouse-like maps", () => {
    const fruitTree = createCatalogItem({ id: "fruittree_628" });
    const wildTree = createCatalogItem({ id: "wildtree_1" });
    const smallBush = createCatalogItem({ id: "bush:small" });

    for (const mapId of ["greenhouse", "sve-grandpas-shed-2"]) {
      expect(getCatalogItemSceneAvailability(fruitTree, mapId)).toBe(
        "available",
      );
      expect(getCatalogItemSceneAvailability(wildTree, mapId)).toBe(
        "available",
      );
      expect(getCatalogItemSceneAvailability(smallBush, mapId)).toBe(
        "outdoor-only",
      );
    }
    expect(getCatalogItemSceneAvailability(fruitTree, "farmhouse-0")).toBe(
      "outdoor-only",
    );
  });

  it("matches verified refusal counts for Standard Farm and Farmhouse", async () => {
    const sourceCatalogItems = await loadCurrentCatalogItems();
    const sidebarItemsByCategory = new Map(
      catalogSidebarCategories.map((category) => [
        category,
        getCatalogSidebarItems(sourceCatalogItems, category, ""),
      ]),
    );
    const allSidebarItems = [...sidebarItemsByCategory.values()].flat();
    const standardFarmVisibleItems = allSidebarItems.filter((catalogItem) =>
      isCatalogItemVisibleOnMap(catalogItem, "standard"),
    );

    expect(standardFarmVisibleItems).toHaveLength(949);
    expect(new Set(standardFarmVisibleItems.map(({ id }) => id)).size).toBe(949);

    const standardFarmUnavailableCounts = [
      ["equipment", 2],
      ["lighting", 22],
      ["furniture", 157],
      ["decor", 186],
    ] as const satisfies readonly (readonly [CatalogSidebarCategory, number])[];

    for (const [category, unavailableCount] of standardFarmUnavailableCounts) {
      const categoryItems = sidebarItemsByCategory.get(category);
      if (categoryItems === undefined) {
        throw new Error(
          `Sidebar catalog category ${JSON.stringify(category)} was not loaded.`,
        );
      }

      expect(
        categoryItems
          .filter((catalogItem) =>
            isCatalogItemVisibleOnMap(catalogItem, "standard"),
          )
          .filter((catalogItem) =>
            getCatalogItemSceneAvailability(catalogItem, "standard") !==
            "available",
          ),
      ).toHaveLength(unavailableCount);
    }

    const farmhouseUnavailableCounts = [
      ["equipment", 0],
      ["paths", 0],
      ["lighting", 0],
      ["furniture", 0],
    ] as const satisfies readonly (readonly [CatalogSidebarCategory, number])[];

    for (const [category, unavailableCount] of farmhouseUnavailableCounts) {
      const categoryItems = sidebarItemsByCategory.get(category);
      if (categoryItems === undefined) {
        throw new Error(
          `Sidebar catalog category ${JSON.stringify(category)} was not loaded.`,
        );
      }

      expect(
        categoryItems.filter((catalogItem) =>
          getCatalogItemSceneAvailability(catalogItem, "farmhouse-0") !==
          "available",
        ),
      ).toHaveLength(unavailableCount);
    }

    const farmhouseCropItems = sidebarItemsByCategory.get("crops");
    const farmhouseDecorItems = sidebarItemsByCategory.get("decor");
    if (farmhouseCropItems === undefined || farmhouseDecorItems === undefined) {
      throw new Error("Farmhouse crop or decor catalog items were not loaded.");
    }

    const visibleFarmhouseCropItems = farmhouseCropItems.filter((catalogItem) =>
      isCatalogItemVisibleOnMap(catalogItem, "farmhouse-0"),
    );
    const visibleFarmhouseDecorReferenceItems = farmhouseDecorItems.filter(
      (catalogItem) =>
        isCatalogItemVisibleOnMap(catalogItem, "farmhouse-0") &&
        getCatalogSidebarReferenceEntry(catalogItem.id) !== undefined,
    );
    const unavailableFarmhouseCrops = visibleFarmhouseCropItems.filter(
      (catalogItem) =>
        getCatalogItemSceneAvailability(catalogItem, "farmhouse-0") !==
        "available",
    );
    expect(unavailableFarmhouseCrops.map(({ id }) => id).sort()).toEqual([
      "crop:giant_Cauliflower",
      "crop:giant_Melon",
      "crop:giant_Powdermelon",
      "crop:giant_Pumpkin",
      "crop:giant_QiFruit",
    ]);

    expect(visibleFarmhouseDecorReferenceItems).toHaveLength(423);
    const unavailableFarmhouseDecor = visibleFarmhouseDecorReferenceItems.filter(
      (catalogItem) =>
        getCatalogItemSceneAvailability(catalogItem, "farmhouse-0") !==
        "available",
    );
    expect(unavailableFarmhouseDecor).toHaveLength(9);
    expect(
      unavailableFarmhouseDecor.filter(({ id }) => id.startsWith("clump_")),
    ).toHaveLength(4);
    expect(
      unavailableFarmhouseDecor.filter(
        ({ renderingMetadata }) =>
          renderingMetadata?.kind === "furniture" && !renderingMetadata.indoors,
      ),
    ).toHaveLength(5);

    const unavailableBuildingAndTree = allSidebarItems.filter(
      (catalogItem) =>
        ["building:Coop", "wildtree_1"].includes(catalogItem.id) &&
        isCatalogItemVisibleOnMap(catalogItem, "farmhouse-0") &&
        getCatalogItemSceneAvailability(catalogItem, "farmhouse-0") !==
          "available",
    );
    expect(unavailableBuildingAndTree.map(({ id }) => id).sort()).toEqual([
      "building:Coop",
      "wildtree_1",
    ]);
  });

  it("shows wallpaper and flooring only on their supported maps", () => {
    const wallpaper = createCatalogItem({ interiorDecorKind: "wallpaper" });
    const flooring = createCatalogItem({ interiorDecorKind: "flooring" });
    const ordinaryFurniture = createCatalogItem({
      renderingMetadata: createFurnitureMetadata(true, true),
    });

    expect(isCatalogItemVisibleOnMap(wallpaper, "standard")).toBe(false);
    expect(isCatalogItemVisibleOnMap(flooring, "standard")).toBe(false);
    expect(isCatalogItemVisibleOnMap(wallpaper, "farmhouse-0")).toBe(true);
    expect(isCatalogItemVisibleOnMap(flooring, "farmhouse-0")).toBe(true);
    expect(isCatalogItemVisibleOnMap(wallpaper, "farm-cave")).toBe(false);
    expect(isCatalogItemVisibleOnMap(ordinaryFurniture, "standard")).toBe(true);
    expect(isCatalogItemVisibleOnMap(ordinaryFurniture, "farm-cave")).toBe(true);
  });

  it("rejects unknown map IDs and furniture with no allowed scene", () => {
    const furnitureWithNoAllowedScene = createCatalogItem({
      renderingMetadata: createFurnitureMetadata(false, false),
    });
    const ordinaryFurniture = createCatalogItem({
      renderingMetadata: createFurnitureMetadata(true, true),
    });

    expect(() =>
      getCatalogItemSceneAvailability(ordinaryFurniture, "missing-map"),
    ).toThrow("Unknown planner map id: missing-map");
    expect(() =>
      isCatalogItemVisibleOnMap(ordinaryFurniture, "missing-map"),
    ).toThrow("Unknown planner map id: missing-map");
    expect(() =>
      getCatalogItemSceneAvailability(furnitureWithNoAllowedScene, "standard"),
    ).toThrow(
      'Catalog item "catalog-item" is marked unavailable both indoors and outdoors.',
    );
  });
});

function createCatalogItem(input: Readonly<{
  category?: CatalogItem["category"];
  id?: string;
  interiorDecorKind?: CatalogItem["interiorDecorKind"];
  renderingMetadata?: CatalogItem["renderingMetadata"];
}> = {}): CatalogItem {
  return {
    id: input.id ?? "catalog-item",
    name: "Catalog item",
    category: input.category ?? "placeable",
    ...(input.interiorDecorKind === undefined
      ? {}
      : { interiorDecorKind: input.interiorDecorKind }),
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/texture.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
    ...(input.renderingMetadata === undefined
      ? {}
      : { renderingMetadata: input.renderingMetadata }),
  };
}

function createFurnitureMetadata(
  indoors: boolean,
  outdoors: boolean,
): NonNullable<CatalogItem["renderingMetadata"]> {
  return {
    kind: "furniture",
    furnitureType: "armchair",
    indoors,
    outdoors,
    rotationSprites: undefined,
    rotationTileSizes: undefined,
    wallMounted: false,
    isRug: false,
    isTable: false,
    isLongTable: false,
    bedType: null,
    compositeSprite: null,
  };
}

async function loadCurrentCatalogItems(): Promise<readonly CatalogItem[]> {
  const catalogCategoryLoader = createCatalogCategoryLoader(
    async (requestedUrl) => {
      const datasetPath = path.join(
        process.cwd(),
        "public",
        requestedUrl.replace(/^\//, ""),
      );
      const datasetJson = JSON.parse(await readFile(datasetPath, "utf8")) as unknown;

      return {
        ok: true,
        status: 200,
        json: async () => datasetJson,
      };
    },
  );
  const [buildings, crops, placeables, decor] = await Promise.all([
    catalogCategoryLoader.loadCategory("buildings"),
    catalogCategoryLoader.loadCategory("crops"),
    catalogCategoryLoader.loadCategory("placeables"),
    catalogCategoryLoader.loadCategory("decor"),
  ]);

  return [
    ...buildings.items,
    ...crops.items,
    ...selectCatalogSidebarPlaceableItems(placeables.items),
    ...decor.items,
  ];
}
