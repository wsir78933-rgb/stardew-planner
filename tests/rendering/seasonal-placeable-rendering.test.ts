import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createPlaceableCatalogFromDatasets,
  type CatalogItem,
  type CatalogSeason,
} from "../../src/catalog";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
} from "../../src/placement/placement-snapshot";
import {
  createPlacementRenderEntries,
  type PlacementRenderEntry,
} from "../../src/rendering/placement-rendering";

const seasons = ["spring", "summer", "fall", "winter"] as const;
const lockedTreePlacementMatrixHash =
  "fd3aa02c09d6955b07f3357447e870e3a4ab0e919d1841de553e2ae95f39e71b";

async function readLockedDataset(filename: string): Promise<unknown> {
  return JSON.parse(await readFile(
    path.join(process.cwd(), "public/game-assets/1.6.15/data", filename),
    "utf8",
  )) as unknown;
}

async function loadLockedPlaceableCatalog(): Promise<readonly CatalogItem[]> {
  const [bigCraftables, objects, fences, floorsAndPaths, furniture, fruitTrees] =
    await Promise.all([
      readLockedDataset("BigCraftables.json"),
      readLockedDataset("Objects.json"),
      readLockedDataset("Fences.json"),
      readLockedDataset("FloorsAndPaths.json"),
      readLockedDataset("Furniture.json"),
      readLockedDataset("FruitTrees.json"),
    ]);

  return createPlaceableCatalogFromDatasets(
    bigCraftables,
    objects,
    fences,
    floorsAndPaths,
    furniture,
    fruitTrees,
    catalogDatasetUrls,
  ).items;
}

function getRequiredCatalogItem(
  catalogItems: readonly CatalogItem[],
  itemId: string,
): CatalogItem {
  const catalogItem = catalogItems.find((item) => item.id === itemId);
  if (catalogItem === undefined) {
    throw new Error(`Expected locked catalog item ${JSON.stringify(itemId)}.`);
  }
  return catalogItem;
}

function createPlacementItem(
  itemId: string,
  overrides: Partial<PlacementItem> = {},
): PlacementItem {
  return {
    instanceId: 1,
    itemId,
    x: 2,
    y: 3,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant: 0,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: itemId === "grass_1" || itemId === "grass_7",
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
    ...overrides,
  };
}

function renderItem(
  catalogItem: CatalogItem,
  season: CatalogSeason,
  placementItem = createPlacementItem(catalogItem.id),
): readonly PlacementRenderEntry[] {
  return createPlacementRenderEntries(
    {
      ...createEmptyPlacementSnapshot(),
      items: [placementItem],
      nextItemId: 2,
    },
    [catalogItem],
    season,
  );
}

function summarizeGrassEntry(entry: PlacementRenderEntry) {
  return {
    frame: entry.frame,
    layerId: entry.layerId,
    pixelGeometry: entry.pixelGeometry,
    rotationQuarterTurns: entry.rotationQuarterTurns,
    shouldApplySelectionTint: entry.shouldApplySelectionTint,
    textureLocalPath: entry.textureLocalPath,
    zIndex: entry.zIndex,
  };
}

function expectedGrassEntries(seasonFrameY: number) {
  const clumps = [
    { frameX: 30, flip: true, positionX: 39.5, positionY: 60, zIndex: 6.51 },
    { frameX: 0, flip: false, positionX: 44.5, positionY: 59, zIndex: 6.385 },
    { frameX: 15, flip: true, positionX: 38.5, positionY: 66, zIndex: 7.26 },
    { frameX: 30, flip: false, positionX: 48.5, positionY: 65, zIndex: 7.135 },
  ] as const;

  return clumps.map((clump, clumpIndex) => ({
    frame: {
      x: clump.frameX,
      y: seasonFrameY,
      width: 15,
      height: 20,
    },
    layerId: `GrassClump_${String(clumpIndex)}`,
    pixelGeometry: {
      anchorX: 0.5,
      anchorY: 0.875,
      horizontalScale: clump.flip ? -1 : 1,
      positionX: clump.positionX,
      positionY: clump.positionY,
    },
    rotationQuarterTurns: 0,
    shouldApplySelectionTint: true,
    textureLocalPath: "/game-assets/1.6.15/terrain/grass.png",
    zIndex: clump.zIndex,
  }));
}

describe("frozen seasonal Placeable rendering", () => {
  it("renders four deterministic Grass Starter clumps with exact spring geometry, flip, and z", async () => {
    const catalogItems = await loadLockedPlaceableCatalog();
    const grassStarter = getRequiredCatalogItem(catalogItems, "grass_1");

    expect(renderItem(grassStarter, "spring").map(summarizeGrassEntry)).toEqual(
      expectedGrassEntries(0),
    );
  });

  it("keeps deterministic grass geometry while switching both grass types across all four seasonal rows", async () => {
    const catalogItems = await loadLockedPlaceableCatalog();
    const expectedRowsById = {
      grass_1: [0, 20, 40, 80],
      grass_7: [160, 180, 200, 220],
    } as const;

    for (const [itemId, expectedRows] of Object.entries(expectedRowsById)) {
      const catalogItem = getRequiredCatalogItem(catalogItems, itemId);
      for (const [seasonIndex, season] of seasons.entries()) {
        expect(renderItem(catalogItem, season).map(summarizeGrassEntry)).toEqual(
          expectedGrassEntries(expectedRows[seasonIndex] as number),
        );
      }
    }
  });

  it("switches Tea Sapling through its four exact bushes frames", async () => {
    const catalogItems = await loadLockedPlaceableCatalog();
    const teaSapling = getRequiredCatalogItem(catalogItems, "object:251");
    const expectedFrames = [
      { x: 32, y: 256, width: 16, height: 32 },
      { x: 96, y: 256, width: 16, height: 32 },
      { x: 32, y: 288, width: 16, height: 32 },
      { x: 96, y: 288, width: 16, height: 32 },
    ];

    expect(seasons.map((season) => renderItem(teaSapling, season)[0]?.frame))
      .toEqual(expectedFrames);
  });

  it("uses sprite 108 for spring/summer and 109 for fall/winter Tub o' Flowers", async () => {
    const catalogItems = await loadLockedPlaceableCatalog();
    const tubOfFlowers = getRequiredCatalogItem(
      catalogItems,
      "big-craftable:108",
    );

    expect(seasons.map((season) => renderItem(tubOfFlowers, season)[0]?.frame))
      .toEqual([
        { x: 64, y: 416, width: 16, height: 32 },
        { x: 64, y: 416, width: 16, height: 32 },
        { x: 80, y: 416, width: 16, height: 32 },
        { x: 80, y: 416, width: 16, height: 32 },
      ]);
  });

  it("switches Seasonal Decor and all six Seasonal Plants through four consecutive sprites", async () => {
    const catalogItems = await loadLockedPlaceableCatalog();
    for (const baseSpriteIndex of [48, 184, 188, 192, 196, 200, 204]) {
      const seasonalItem = getRequiredCatalogItem(
        catalogItems,
        `big-craftable:${String(baseSpriteIndex)}`,
      );
      const expectedFrames = seasons.map((_, seasonIndex) => {
        const spriteIndex = baseSpriteIndex + seasonIndex;
        return {
          x: (spriteIndex % 8) * 16,
          y: Math.floor(spriteIndex / 8) * 32,
          width: 16,
          height: 32,
        };
      });

      expect(seasons.map((season) => renderItem(seasonalItem, season)[0]?.frame))
        .toEqual(expectedFrames);
    }
  });

  it("fails fast when a locked seasonal item loses its composition metadata", async () => {
    const catalogItems = await loadLockedPlaceableCatalog();
    for (const itemId of ["grass_1", "object:251", "big-craftable:108"]) {
      const corruptCatalogItem = {
        ...getRequiredCatalogItem(catalogItems, itemId),
        renderingMetadata: undefined,
      };
      expect(() => renderItem(corruptCatalogItem, "winter")).toThrow(
        `Seasonal Placeable ${JSON.stringify(itemId)} requires locked seasonal rendering metadata`,
      );
    }
  });

  it("locks all 19 tree items across four seasons, two variants, flip, pixel geometry, and z", async () => {
    const catalogItems = await loadLockedPlaceableCatalog();
    const treeItems = catalogItems.filter((item) =>
      item.id.startsWith("wildtree_") || item.id.startsWith("fruittree_")
    );
    const matrix = treeItems.flatMap((catalogItem) =>
      seasons.flatMap((season) =>
        [0, 1].flatMap((variant) =>
          [false, true].map((flipped) => ({
            id: catalogItem.id,
            season,
            variant,
            flipped,
            entries: renderItem(
              catalogItem,
              season,
              createPlacementItem(catalogItem.id, { variant, flipped }),
            ).map((entry) => ({
              frame: entry.frame,
              geo: entry.pixelGeometry,
              path: entry.textureLocalPath,
              z: entry.zIndex,
              flip: entry.isFlipped ?? false,
              tint: entry.shouldApplySelectionTint ?? null,
            })),
          })),
        ),
      ),
    );

    expect(treeItems).toHaveLength(19);
    expect(matrix).toHaveLength(304);
    expect(createHash("sha256").update(JSON.stringify(matrix)).digest("hex"))
      .toBe(lockedTreePlacementMatrixHash);
  });
});
