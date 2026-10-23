import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
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
import { plannerMaps } from "../../src/maps/map-catalog";

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

  it("uses the buildable map capability for buildings", () => {
    const building = createCatalogItem({ category: "building" });

    expect(getCatalogItemSceneAvailability(building, "standard")).toBe(
      "available",
    );
    expect(getCatalogItemSceneAvailability(building, "farmhouse-0")).toBe(
      "not-buildable-here",
    );
  });

  it("keeps the crop rail visible when Tea Sapling is eligible", () => {
    const crop = createCatalogItem({ category: "crop" });
    const teaSapling = createCatalogItem({ id: "object:251" });

    expect(isCatalogItemVisibleOnMap(crop, "railroad")).toBe(true);
    expect(getCatalogItemSceneAvailability(teaSapling, "railroad")).toBe(
      "available",
    );
  });

  it("only marks bushes eligible on buildable maps", () => {
    const bush = createCatalogItem({ id: "bush:small" });

    expect(getCatalogItemSceneAvailability(bush, "standard")).toBe(
      "available",
    );
    expect(getCatalogItemSceneAvailability(bush, "ginger-island")).toBe(
      "not-placeable-here",
    );
    expect(getCatalogItemSceneAvailability(bush, "railroad")).toBe(
      "not-placeable-here",
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
        "not-placeable-here",
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

    expect(standardFarmVisibleItems).toHaveLength(952);
    expect(new Set(standardFarmVisibleItems.map(({ id }) => id)).size).toBe(952);

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

    expect(visibleFarmhouseDecorReferenceItems).toHaveLength(426);
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

    const coopBuilding = allSidebarItems.find(
      ({ id }) => id === "building:Coop",
    );
    const wildTree = allSidebarItems.find(({ id }) => id === "wildtree_1");
    if (coopBuilding === undefined || wildTree === undefined) {
      throw new Error(
        "Farmhouse building or tree candidate was not loaded from the reference catalog.",
      );
    }
    expect(isCatalogItemVisibleOnMap(coopBuilding, "farmhouse-0")).toBe(false);
    expect(getCatalogItemSceneAvailability(coopBuilding, "farmhouse-0")).toBe(
      "not-buildable-here",
    );
    expect(isCatalogItemVisibleOnMap(wildTree, "farmhouse-0")).toBe(false);
    expect(getCatalogItemSceneAvailability(wildTree, "farmhouse-0")).toBe(
      "outdoor-only",
    );
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

  it("matches exact visible and eligible catalog ID sets for all 61 maps", async () => {
    const sourceCatalogItems = await loadCurrentCatalogItems();
    const sidebarItemsByCategory = new Map(
      catalogSidebarCategories.map((category) => [
        category,
        getCatalogSidebarItems(sourceCatalogItems, category, ""),
      ]),
    );
    const parityFixture = JSON.parse(
      await readFile(
        path.join(
          process.cwd(),
          "tests",
          "catalog",
          "fixtures",
          "competitor-map-catalog-parity.json",
        ),
        "utf8",
      ),
    ) as CatalogParityFixture;

    expect(plannerMaps).toHaveLength(61);
    expect(parityFixture.maps).toHaveLength(plannerMaps.length);
    expect(plannerMaps.map(({ id }) => id).sort()).toEqual(
      parityFixture.maps.map(({ mapId }) => mapId).sort(),
    );
    expect(parityFixture.categories).toEqual(catalogSidebarCategories);

    for (const plannerMap of plannerMaps) {
      const fixtureMap = parityFixture.maps.find(
        ({ mapId }) => mapId === plannerMap.id,
      );
      if (fixtureMap === undefined) {
        throw new Error(
          `Competitor parity fixture is missing map ID ${JSON.stringify(plannerMap.id)}.`,
        );
      }

      for (const category of catalogSidebarCategories) {
        const categoryItems = sidebarItemsByCategory.get(category);
        if (categoryItems === undefined) {
          throw new Error(
            `Local sidebar category ${JSON.stringify(category)} was not loaded.`,
          );
        }

        const visibleIds = categoryItems
          .filter((catalogItem) =>
            isCatalogItemVisibleOnMap(catalogItem, plannerMap.id),
          )
          .map(({ id }) => id);
        const eligibleIds = categoryItems
          .filter((catalogItem) =>
            isCatalogItemVisibleOnMap(catalogItem, plannerMap.id),
          )
          .filter((catalogItem) =>
            getCatalogItemSceneAvailability(catalogItem, plannerMap.id) ===
            "available",
          )
          .map(({ id }) => id);
        const visibleDigest = createCatalogItemIdDigest(visibleIds);
        const eligibleDigest = createCatalogItemIdDigest(eligibleIds);

        expect(
          visibleDigest,
          `${plannerMap.id}/${category} visible candidate set`,
        ).toEqual(fixtureMap.categories[category].visibleCandidate);
        expect(
          eligibleDigest,
          `${plannerMap.id}/${category} eligible set`,
        ).toEqual(fixtureMap.categories[category].eligible);
      }
    }
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

function createCatalogItemIdDigest(
  catalogItemIds: readonly string[],
): Readonly<{ count: number; sha256: string }> {
  const sortedCatalogItemIds = [...catalogItemIds].sort();
  return {
    count: sortedCatalogItemIds.length,
    sha256: createHash("sha256")
      .update(JSON.stringify(sortedCatalogItemIds))
      .digest("hex"),
  };
}

type CatalogParityFixture = Readonly<{
  categories: readonly CatalogSidebarCategory[];
  maps: readonly Readonly<{
    mapId: string;
    categories: Readonly<
      Record<
        CatalogSidebarCategory,
        Readonly<{
          eligible: Readonly<{ count: number; sha256: string }>;
          visibleCandidate: Readonly<{ count: number; sha256: string }>;
        }>
      >
    >;
  }>[];
}>;

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
