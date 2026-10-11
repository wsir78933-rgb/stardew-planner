import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createPlaceableCatalogFromDatasets,
  type CatalogItem,
  type CatalogSeason,
} from "../../src/catalog";
import { createCatalogFromDatasets } from "../../src/catalog/catalog-schema";
import { createBushCatalogItems, getBushSourceRect } from "../../src/catalog/bushes";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
} from "../../src/placement/placement-snapshot";
import {
  createPlacementRenderEntries,
  type PlacementRenderEntry,
} from "../../src/rendering/placement-rendering";

const seasons = ["spring", "summer", "fall", "winter"] as const;

const expectedFramesById = {
  "bush:small": [
    { x: 0, y: 224, width: 16, height: 32 },
    { x: 32, y: 224, width: 16, height: 32 },
    { x: 64, y: 224, width: 16, height: 32 },
    { x: 96, y: 224, width: 16, height: 32 },
  ],
  "bush:medium": [
    { x: 0, y: 0, width: 32, height: 48 },
    { x: 64, y: 0, width: 32, height: 48 },
    { x: 0, y: 48, width: 32, height: 48 },
    { x: 64, y: 48, width: 32, height: 48 },
  ],
  "bush:large": [
    { x: 0, y: 128, width: 48, height: 48 },
    { x: 0, y: 128, width: 48, height: 48 },
    { x: 48, y: 128, width: 48, height: 48 },
    { x: 0, y: 176, width: 48, height: 48 },
  ],
} as const;

async function readLockedDataset(filename: string): Promise<unknown> {
  return JSON.parse(await readFile(
    path.join(process.cwd(), "public/game-assets/1.6.15/data", filename),
    "utf8",
  )) as unknown;
}

async function loadFullCatalogItems(): Promise<readonly CatalogItem[]> {
  return createCatalogFromDatasets(
    {
      buildings: await readLockedDataset("Buildings.json"),
      crops: await readLockedDataset("Crops.json"),
      bigCraftables: await readLockedDataset("BigCraftables.json"),
      objects: await readLockedDataset("Objects.json"),
      fences: await readLockedDataset("Fences.json"),
      floorsAndPaths: await readLockedDataset("FloorsAndPaths.json"),
      furniture: await readLockedDataset("Furniture.json"),
      fruitTrees: await readLockedDataset("FruitTrees.json"),
    },
    catalogDatasetUrls,
  ).items;
}

async function loadPlaceableCatalogItems(): Promise<readonly CatalogItem[]> {
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

function createBushPlacementItem(
  catalogItem: CatalogItem,
  variant = 0,
  flipped = false,
): PlacementItem {
  return {
    instanceId: 1,
    itemId: catalogItem.id,
    x: 3,
    y: 4,
    layer: "item",
    rotation: 0,
    footprint: catalogItem.tileSize,
    variant,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped,
    bedType: null,
  };
}

function renderBush(
  catalogItem: CatalogItem,
  season: CatalogSeason,
  variant = 0,
  flipped = false,
): readonly PlacementRenderEntry[] {
  return createPlacementRenderEntries(
    {
      ...createEmptyPlacementSnapshot(),
      items: [createBushPlacementItem(catalogItem, variant, flipped)],
      nextItemId: 2,
    },
    [catalogItem],
    season,
  );
}

describe("bush catalog and seasonal frames", () => {
  it("creates the three placeables with exact footprints and seasonal base frames", () => {
    const bushItems = createBushCatalogItems();

    expect(bushItems.map(({ id, name, tileSize, textureLocalPath }) => ({
      id,
      name,
      tileSize,
      textureLocalPath,
    }))).toEqual([
      {
        id: "bush:small",
        name: "Small Bush",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: "/game-assets/1.6.15/tilesheets/bushes.png",
      },
      {
        id: "bush:medium",
        name: "Medium Bush",
        tileSize: { width: 2, height: 1 },
        textureLocalPath: "/game-assets/1.6.15/tilesheets/bushes.png",
      },
      {
        id: "bush:large",
        name: "Large Bush",
        tileSize: { width: 3, height: 1 },
        textureLocalPath: "/game-assets/1.6.15/tilesheets/bushes.png",
      },
    ]);

    for (const bushItem of bushItems) {
      const expectedFrames = expectedFramesById[
        bushItem.id as keyof typeof expectedFramesById
      ];
      expect(bushItem.sprite).toEqual({ kind: "source-rect", ...expectedFrames[0] });
      expect(bushItem.renderingMetadata?.kind).toBe("seasonal-placeable");
      if (bushItem.renderingMetadata?.kind !== "seasonal-placeable") {
        throw new Error(`Expected seasonal rendering metadata for ${bushItem.id}.`);
      }
      expect(seasons.map((season) => bushItem.renderingMetadata?.kind === "seasonal-placeable"
        ? bushItem.renderingMetadata.seasonalFrames[season]
        : null)).toEqual(expectedFrames.map((frame) => ({ kind: "source-rect", ...frame })));
    }

    const mediumBush = bushItems.find(({ id }) => id === "bush:medium");
    expect(mediumBush?.presentationCapabilities).toMatchObject({
      canFlip: true,
      variantCycle: { count: 2, family: "tree" },
      visibleVariants: [
        { label: "Plain", value: 0 },
        { label: "Berries", value: 1 },
      ],
    });
  });

  it("adds all three items to the full and focused placeable catalogs", async () => {
    const fullCatalogItems = await loadFullCatalogItems();
    const placeableCatalogItems = await loadPlaceableCatalogItems();
    const bushIds = ["bush:small", "bush:medium", "bush:large"];

    expect(fullCatalogItems).toHaveLength(1703);
    for (const bushId of bushIds) {
      expect(fullCatalogItems.some(({ id }) => id === bushId)).toBe(true);
      expect(placeableCatalogItems.some(({ id }) => id === bushId)).toBe(true);
    }
  });

  it("uses the second Medium Bush frame for berries in every season and preserves flip", () => {
    const mediumBush = createBushCatalogItems().find(({ id }) => id === "bush:medium");
    if (mediumBush === undefined) {
      throw new Error("Expected Medium Bush in the locked bush catalog.");
    }

    for (const [seasonIndex, season] of seasons.entries()) {
      const plainFrame = expectedFramesById["bush:medium"][seasonIndex];
      const berryFrame = { ...plainFrame, x: plainFrame.x + plainFrame.width };
      expect(getBushSourceRect("bush:medium", season, 0)).toEqual({
        kind: "source-rect",
        ...plainFrame,
      });
      expect(getBushSourceRect("bush:medium", season, 1)).toEqual({
        kind: "source-rect",
        ...berryFrame,
      });
      const [renderedBush] = renderBush(mediumBush, season, 1, true);
      expect(renderedBush?.frame).toEqual(berryFrame);
      expect(renderedBush?.isFlipped).toBe(true);
    }
  });

  it("rejects unknown bush frames, seasons, and unsupported variants with their values", () => {
    expect(() => getBushSourceRect("bush:unknown", "spring"))
      .toThrow('received "bush:unknown"');
    expect(() => getBushSourceRect("bush:medium", "monsoon" as CatalogSeason))
      .toThrow('received "monsoon"');
    expect(() => getBushSourceRect("bush:small", "spring", 1))
      .toThrow("received 1");
  });
});
