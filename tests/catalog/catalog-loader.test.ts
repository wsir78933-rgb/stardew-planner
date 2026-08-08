import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  loadCatalog,
  type CatalogJsonFetcher,
} from "../../src/catalog";

type JsonResponse = Readonly<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

function createCatalogJsonFetcher(
  jsonByUrl: Readonly<Record<string, unknown>>,
): CatalogJsonFetcher {
  return async (requestedUrl: string): Promise<JsonResponse> => {
    if (!Object.hasOwn(jsonByUrl, requestedUrl)) {
      return {
        ok: false,
        status: 404,
        json: async () => null,
      };
    }

    return {
      ok: true,
      status: 200,
      json: async () => jsonByUrl[requestedUrl],
    };
  };
}

function createValidCatalogDatasets(): Readonly<Record<string, unknown>> {
  const buildingRecords = Object.fromEntries(
    Array.from({ length: 25 }, (_, index) => [
      `Building ${String(index)}`,
      {
        Texture: "Buildings\\Coop",
        Size: { X: 6, Y: 3 },
        SourceRect: { X: 0, Y: 0, Width: 96, Height: 112 },
      },
    ]),
  );
  const objectRecords = Object.fromEntries(
    Array.from({ length: 807 }, (_, index) => [
      String(index),
      {
        Name: `Object ${String(index)}`,
        Texture: index < 718 ? null : "TileSheets\\Objects_2",
        SpriteIndex: index,
      },
    ]),
  );
  const cropRecords = Object.fromEntries(
    Array.from({ length: 50 }, (_, index) => [
      `Crop ${String(index)}`,
      {
        Texture: "TileSheets\\crops",
        SpriteIndex: index,
        HarvestItemId: String(index),
      },
    ]),
  );
  const bigCraftableRecords = Object.fromEntries(
    Array.from({ length: 182 }, (_, index) => [
      String(index),
      {
        Name: `Big Craftable ${String(index)}`,
        Texture: null,
        SpriteIndex: index,
      },
    ]),
  );
  const floorRecords = Object.fromEntries(
    Array.from({ length: 13 }, (_, index) => [
      String(index),
      {
        Id: String(index),
        ItemId: String(index),
        Texture: "TerrainFeatures\\Flooring",
        Corner: { X: index * 64, Y: 0 },
        CornerSize: 4,
      },
    ]),
  );
  const fenceRecords = Object.fromEntries(
    Array.from({ length: 5 }, (_, index) => [
      String(index),
      {
        Texture: "LooseSprites\\Fence1",
      },
    ]),
  );
  const furnitureRecords = Object.fromEntries(
    Array.from({ length: 644 }, (_, index) => [
      String(index),
      `Furniture ${String(index)}/chair/-1/-1/4/350/-1/[LocalizedText Strings\\Furniture:Fixture]`,
    ]),
  );
  furnitureRecords.CCFishTank =
    "CCFishTank/fishtank/6 3/6 1/1/5000/-1/[LocalizedText Strings\\Furniture:CCFishTank]/256/TileSheets\\furniture_2/true";
  const fruitTreeRecords = {
    "69": { Texture: "TileSheets\\fruitTrees", TextureSpriteRow: 7, Seasons: ["Summer"] },
    "628": { Texture: "TileSheets\\fruitTrees", TextureSpriteRow: 0, Seasons: ["Spring"] },
    "629": { Texture: "TileSheets\\fruitTrees", TextureSpriteRow: 1, Seasons: ["Spring"] },
    "630": { Texture: "TileSheets\\fruitTrees", TextureSpriteRow: 2, Seasons: ["Summer"] },
    "631": { Texture: "TileSheets\\fruitTrees", TextureSpriteRow: 3, Seasons: ["Summer"] },
    "632": { Texture: "TileSheets\\fruitTrees", TextureSpriteRow: 4, Seasons: ["Fall"] },
    "633": { Texture: "TileSheets\\fruitTrees", TextureSpriteRow: 5, Seasons: ["Fall"] },
    "835": { Texture: "TileSheets\\fruitTrees", TextureSpriteRow: 8, Seasons: ["Summer"] },
  };

  return {
    [catalogDatasetUrls.buildings]: buildingRecords,
    [catalogDatasetUrls.crops]: cropRecords,
    [catalogDatasetUrls.bigCraftables]: bigCraftableRecords,
    [catalogDatasetUrls.objects]: objectRecords,
    [catalogDatasetUrls.fences]: fenceRecords,
    [catalogDatasetUrls.floorsAndPaths]: floorRecords,
    [catalogDatasetUrls.furniture]: furnitureRecords,
    [catalogDatasetUrls.fruitTrees]: fruitTreeRecords,
  };
}

describe("catalog loader", () => {
  it("fetches every catalog dataset exclusively from the version-locked local asset root", async () => {
    const requestedUrls: string[] = [];
    const validCatalogDatasets = createValidCatalogDatasets();
    const fetchCatalogJson = createCatalogJsonFetcher(validCatalogDatasets);

    const catalog = await loadCatalog(async (requestedUrl) => {
      requestedUrls.push(requestedUrl);
      return fetchCatalogJson(requestedUrl);
    });

    expect(requestedUrls).toEqual(Object.values(catalogDatasetUrls));
    expect(requestedUrls).toEqual(
      expect.arrayContaining([
        "/game-assets/1.6.15/data/Buildings.json",
        "/game-assets/1.6.15/data/Crops.json",
        "/game-assets/1.6.15/data/BigCraftables.json",
        "/game-assets/1.6.15/data/Objects.json",
        "/game-assets/1.6.15/data/Fences.json",
        "/game-assets/1.6.15/data/FloorsAndPaths.json",
        "/game-assets/1.6.15/data/Furniture.json",
        "/game-assets/1.6.15/data/FruitTrees.json",
      ]),
    );
    expect(requestedUrls.every((requestedUrl) => requestedUrl.startsWith("/game-assets/1.6.15/data/"))).toBe(
      true,
    );
    expect(catalog.items).toHaveLength(1660);
  });

  it("creates precise item contracts for every verified rendering category", async () => {
    const catalog = await loadCatalog(
      createCatalogJsonFetcher(createValidCatalogDatasets()),
    );

    expect(catalog.items.filter((item) => item.category === "building")).toHaveLength(25);
    expect(catalog.items.filter((item) => item.category === "crop")).toHaveLength(50);
    expect(catalog.items.filter((item) => item.category === "placeable")).toHaveLength(1562);
    expect(catalog.items.filter((item) => item.category === "floor")).toHaveLength(14);
    expect(catalog.items.filter((item) => item.category === "fence")).toHaveLength(5);
    expect(catalog.items.filter((item) => item.category === "decor")).toHaveLength(4);
    expect(catalog.items.find((item) => item.id === "building:Building 0"))
      .toMatchObject({
      id: "building:Building 0",
      name: "Building 0",
      category: "building",
      tileSize: { width: 6, height: 3 },
      textureLocalPath: "/game-assets/1.6.15/buildings/Coop.png",
      sprite: {
        kind: "source-rect",
        x: 0,
        y: 0,
        width: 96,
        height: 112,
      },
      allowedTools: ["cursor", "multi-select", "erase"],
      renderingMetadata: {
        buildingId: "Building 0",
        kind: "building-multilayer",
        layers: expect.arrayContaining([
          expect.objectContaining({ id: "Base" }),
        ]),
        sortTileOffset: 0,
      },
    });
    expect(catalog.items).toContainEqual({
      id: "crop:Crop 0",
      name: "Object 0",
      category: "crop",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
      sprite: { kind: "sprite-index", index: 0 },
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 16, y: 0, width: 16, height: 32 },
        tintColors: [],
        hasForageShadow: false,
      },
    });
    expect(catalog.items).toContainEqual({
      id: "big-craftable:0",
      name: "Big Craftable 0",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
      sprite: { kind: "sprite-index", index: 0 },
      allowedTools: ["cursor", "multi-select", "erase"],
    });
    expect(catalog.items).toContainEqual({
      id: "object:0",
      name: "Object 0",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      sprite: { kind: "sprite-index", index: 0 },
      allowedTools: ["cursor", "multi-select", "erase"],
    });
    expect(catalog.items).toContainEqual({
      id: "floor:0",
      name: "Object 0",
      category: "floor",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
      sprite: {
        kind: "source-rect",
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      },
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
    });
    expect(catalog.items).toContainEqual({
      id: "fence:0",
      name: "Object 0",
      category: "fence",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png",
      sprite: {
        kind: "source-rect",
        x: 32,
        y: 32,
        width: 16,
        height: 32,
      },
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
    });
  });

  it("does not expose records that require the unavailable Objects_2 texture", async () => {
    const catalog = await loadCatalog(
      createCatalogJsonFetcher(createValidCatalogDatasets()),
    );

    expect(catalog.items.some((item) => item.id === "object:718")).toBe(false);
    expect(catalog.items.some((item) => item.textureLocalPath.includes("Objects_2"))).toBe(false);
  });

  it("rejects a failed local fetch with the exact dataset URL", async () => {
    const fetchCatalogJson = createCatalogJsonFetcher(createValidCatalogDatasets());

    await expect(
      loadCatalog(async (requestedUrl) => {
        if (requestedUrl === catalogDatasetUrls.crops) {
          return { ok: false, status: 503, json: async () => null };
        }

        return fetchCatalogJson(requestedUrl);
      }),
    ).rejects.toThrow(
      `Catalog dataset request failed for URL ${JSON.stringify(catalogDatasetUrls.crops)} with status 503`,
    );
  });

  it("rejects invalid record values with their dataset URL and record value", async () => {
    const invalidCatalogDatasets = createValidCatalogDatasets();
    const invalidCropRecords = invalidCatalogDatasets[catalogDatasetUrls.crops] as Record<
      string,
      Record<string, unknown>
    >;
    invalidCropRecords["Crop 0"].HarvestItemId = "missing-object";

    await expect(
      loadCatalog(createCatalogJsonFetcher(invalidCatalogDatasets)),
    ).rejects.toThrow(
      `${catalogDatasetUrls.crops} record "Crop 0" has HarvestItemId "missing-object" that is absent from ${JSON.stringify(catalogDatasetUrls.objects)}`,
    );
  });

  it("rejects malformed JSON roots with their source URL and received record value", async () => {
    const invalidCatalogDatasets = createValidCatalogDatasets();
    const invalidBuildingRecords = invalidCatalogDatasets[
      catalogDatasetUrls.buildings
    ] as Record<string, unknown>;
    invalidBuildingRecords["Building 0"] = [];

    await expect(
      loadCatalog(createCatalogJsonFetcher(invalidCatalogDatasets)),
    ).rejects.toThrow(
      `${catalogDatasetUrls.buildings} record "Building 0" must be a plain JSON object; received []`,
    );
  });
});
