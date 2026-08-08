import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as catalogModule from "../../src/catalog";
import {
  catalogDatasetUrls,
  createDecorCatalogFromDataset,
  createFurnitureCatalogItems,
  createPlaceableCatalogFromDatasets,
  type CatalogItem,
  type CatalogSeason,
  type CatalogSourceRect,
} from "../../src/catalog";
import {
  getCatalogItemsForPanel,
  getCatalogItemThumbnailStyle,
} from "../../src/components/item-catalog-panel";

const seasons = ["spring", "summer", "fall", "winter"] as const;
const lockedPlaceableManifestHash =
  "03d0b62d3987256575102383268ff2d21849175d36feaf8a970b3cbb8f624673";
const lockedDecorManifestHash =
  "7d86e81f8ccfbdf51a64e7d75f66bb35f811f769e53409b880e81830a1673992";
const lockedTreeAndHoeDirtSeasonalPathHash =
  "dc866cdc1f868cfc14605e87477dd5a4f67f462e9139222d0b0372b0dcb61762";

type SeasonalFrameSelector = (
  catalogItem: CatalogItem,
  season: CatalogSeason,
) => CatalogSourceRect | null;

async function readLockedDataset(filename: string): Promise<unknown> {
  return JSON.parse(await readFile(
    path.join(process.cwd(), "public/game-assets/1.6.15/data", filename),
    "utf8",
  )) as unknown;
}

async function createLockedRuntimeCatalogs() {
  const [bigCraftables, objects, fences, floorsAndPaths, furniture, fruitTrees] =
    await Promise.all([
      readLockedDataset("BigCraftables.json"),
      readLockedDataset("Objects.json"),
      readLockedDataset("Fences.json"),
      readLockedDataset("FloorsAndPaths.json"),
      readLockedDataset("Furniture.json"),
      readLockedDataset("FruitTrees.json"),
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
  const decorCatalog = createDecorCatalogFromDataset(
    furniture,
    catalogDatasetUrls.furniture,
    bigCraftables,
    catalogDatasetUrls.bigCraftables,
  );

  return {
    decorItems: decorCatalog.items,
    placeableItems: getCatalogItemsForPanel(placeableCatalog, "placeables", ""),
  };
}

function getSeasonalFrameSelector(): SeasonalFrameSelector | undefined {
  return (catalogModule as unknown as Readonly<Record<string, unknown>>)
    .getSeasonalPlaceableFrame as SeasonalFrameSelector | undefined;
}

function createLockedItemManifest(
  catalogItems: readonly CatalogItem[],
  getSeasonalPlaceableFrame: SeasonalFrameSelector,
) {
  return catalogItems.map((catalogItem) => {
    const baseFrame = resolveCatalogBaseFrame(catalogItem);
    const furnitureMetadata = catalogItem.renderingMetadata?.kind === "furniture"
      ? catalogItem.renderingMetadata
      : null;

    return {
      id: catalogItem.id,
      path: catalogItem.textureLocalPath,
      base: summarizeFrame(baseFrame),
      seasons: seasons.map((season) =>
        summarizeFrame(getSeasonalPlaceableFrame(catalogItem, season) ?? baseFrame)
      ),
      tile: [catalogItem.tileSize.width, catalogItem.tileSize.height],
      rotationFrames: furnitureMetadata?.rotationSprites?.map(
        ({ sprite, flipped }) => [
          sprite.x,
          sprite.y,
          sprite.width,
          sprite.height,
          flipped === true ? 1 : 0,
        ],
      ) ?? null,
      rotationFootprints:
        catalogItem.presentationCapabilities?.rotation?.footprints.map(
          (footprint) => [footprint.width, footprint.height],
        ) ?? null,
      canFlip: catalogItem.presentationCapabilities?.canFlip ?? false,
    };
  });
}

function resolveCatalogBaseFrame(catalogItem: CatalogItem): CatalogSourceRect {
  if (catalogItem.sprite.kind === "source-rect") {
    return catalogItem.sprite;
  }
  if (catalogItem.textureLocalPath.endsWith("/craftables.png")) {
    return createCraftablesFrame(catalogItem.sprite.index);
  }
  if (catalogItem.textureLocalPath.endsWith("/springobjects.png")) {
    return {
      kind: "source-rect",
      x: (catalogItem.sprite.index % 24) * 16,
      y: Math.floor(catalogItem.sprite.index / 24) * 16,
      width: 16,
      height: 16,
    };
  }
  throw new Error(
    `Locked manifest has no sprite-index layout for ${JSON.stringify(catalogItem.id)}.`,
  );
}

function createCraftablesFrame(spriteIndex: number): CatalogSourceRect {
  return {
    kind: "source-rect",
    x: (spriteIndex % 8) * 16,
    y: Math.floor(spriteIndex / 8) * 32,
    width: 16,
    height: 32,
  };
}

function summarizeFrame(frame: CatalogSourceRect) {
  return [frame.x, frame.y, frame.width, frame.height];
}

function hashManifest(manifest: unknown): string {
  return createHash("sha256").update(JSON.stringify(manifest)).digest("hex");
}

describe("frozen Placeables and Decor catalog parity", () => {
  it("exposes one shared fail-fast seasonal frame selector", () => {
    expect(getSeasonalFrameSelector()).toBeTypeOf("function");
  });

  it("locks all 149 visible Placeables across ID, asset, base frame, season, rotation, and footprint", async () => {
    const getSeasonalPlaceableFrame = getSeasonalFrameSelector();
    expect(getSeasonalPlaceableFrame).toBeTypeOf("function");
    if (getSeasonalPlaceableFrame === undefined) return;

    const { placeableItems } = await createLockedRuntimeCatalogs();
    expect(placeableItems).toHaveLength(149);
    expect(placeableItems.filter((item) => item.id.startsWith("clump_")))
      .toHaveLength(4);
    expect(placeableItems.filter((item) => item.id.startsWith("clump_")).every(
      (item) => item.textureLocalPath ===
        "/game-assets/1.6.15/tilesheets/springobjects.png",
    )).toBe(true);
    expect(hashManifest(createLockedItemManifest(
      placeableItems,
      getSeasonalPlaceableFrame,
    ))).toBe(lockedPlaceableManifestHash);
  });

  it("locks all 19 Trees and HoeDirt to their exact season-specific texture paths", async () => {
    const { placeableItems } = await createLockedRuntimeCatalogs();
    const treeAndHoeDirtItems = placeableItems.filter((item) =>
      item.id === "hoedirt" ||
      item.id.startsWith("wildtree_") ||
      item.id.startsWith("fruittree_")
    );
    const pathMatrix = treeAndHoeDirtItems.map((catalogItem) => ({
      id: catalogItem.id,
      paths: seasons.map((season) => {
        if (catalogItem.renderingMetadata?.kind === "wild-tree") {
          return catalogItem.renderingMetadata.seasonalTextureLocalPaths[season];
        }
        if (catalogItem.renderingMetadata?.kind === "hoe-dirt") {
          return catalogItem.renderingMetadata.seasonalTextureLocalPaths[season];
        }
        return catalogItem.textureLocalPath;
      }),
    }));

    expect(treeAndHoeDirtItems).toHaveLength(20);
    expect(hashManifest(pathMatrix)).toBe(lockedTreeAndHoeDirtSeasonalPathHash);
    expect(pathMatrix.find((entry) => entry.id === "hoedirt")?.paths.at(-1))
      .toBe("/game-assets/1.6.15/terrain/hoeDirtSnow.png");
  });

  it("locks all 947 visible Decor items and its 644/68/235 partitions", async () => {
    const getSeasonalPlaceableFrame = getSeasonalFrameSelector();
    expect(getSeasonalPlaceableFrame).toBeTypeOf("function");
    if (getSeasonalPlaceableFrame === undefined) return;

    const { decorItems } = await createLockedRuntimeCatalogs();
    expect(decorItems).toHaveLength(947);
    expect(decorItems.filter((item) =>
      item.renderingMetadata?.kind === "furniture"
    )).toHaveLength(644);
    expect(decorItems.filter((item) =>
      item.id.startsWith("big-craftable:")
    )).toHaveLength(68);
    expect(decorItems.filter((item) => item.category === "decor")).toHaveLength(235);
    expect(hashManifest(createLockedItemManifest(
      decorItems,
      getSeasonalPlaceableFrame,
    ))).toBe(lockedDecorManifestHash);
  });

  it("derives the spring thumbnail from the same seasonal selector used by placement", async () => {
    const getSeasonalPlaceableFrame = getSeasonalFrameSelector();
    expect(getSeasonalPlaceableFrame).toBeTypeOf("function");
    if (getSeasonalPlaceableFrame === undefined) return;

    const { placeableItems } = await createLockedRuntimeCatalogs();
    const expectedSpringThumbnailPositions = {
      grass_7: "0px -480px",
      "object:251": "-60px -480px",
      "big-craftable:108": "-120px -780px",
    } as const;
    for (const [itemId, expectedBackgroundPosition] of Object.entries(
      expectedSpringThumbnailPositions,
    )) {
      const catalogItem = placeableItems.find((item) => item.id === itemId);
      if (catalogItem === undefined) {
        throw new Error(`Expected visible Placeable ${JSON.stringify(itemId)}.`);
      }
      const springFrame = getSeasonalPlaceableFrame(catalogItem, "spring");
      if (springFrame === null) {
        throw new Error(`Expected seasonal spring frame for ${JSON.stringify(itemId)}.`);
      }
      const style = getCatalogItemThumbnailStyle(
        catalogItem,
        { flipped: false, rotation: 0, variant: 0 },
      );

      expect(style.backgroundPosition).toBe(expectedBackgroundPosition);
    }
  });

  it("keeps every FreeCactus composite frame within the frozen 128px texture height", async () => {
    const { decorItems } = await createLockedRuntimeCatalogs();
    const freeCactus = decorItems.find((item) => item.id === "furniture_FreeCactus");
    if (freeCactus?.renderingMetadata?.kind !== "furniture") {
      throw new Error("Expected locked FreeCactus furniture metadata.");
    }
    const compositeSprite = freeCactus.renderingMetadata.compositeSprite;
    if (compositeSprite === null) {
      throw new Error("Expected locked FreeCactus composite metadata.");
    }
    const maximumFrameBottom = Math.max(...compositeSprite.layers.map((layer) =>
      layer.baseY + Math.ceil(layer.count / compositeSprite.columns) *
        compositeSprite.pieceSize
    ));

    expect(maximumFrameBottom).toBe(128);
  });

  it("accepts a FreeCactus source frame on the frozen texture's final 16px row", async () => {
    const rawFurniture = await readLockedDataset("Furniture.json") as Record<
      string,
      string
    >;
    const freeCactusFields = rawFurniture.FreeCactus?.split("/");
    if (freeCactusFields === undefined) {
      throw new Error("Expected locked FreeCactus source record.");
    }
    freeCactusFields[8] = "56";

    expect(() => createFurnitureCatalogItems(
      { ...rawFurniture, FreeCactus: freeCactusFields.join("/") },
      catalogDatasetUrls.furniture,
    )).not.toThrow();
  });
});
