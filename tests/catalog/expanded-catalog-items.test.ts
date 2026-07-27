import { describe, expect, it } from "vitest";
import {
  createFruitTreeCatalogItems,
  createFurnitureCatalogItems,
  createWildTreeCatalogItems,
} from "../../src/catalog";

describe("expanded catalog items", () => {
  it("maps verified furniture source rectangles, footprints, and rotation metadata", () => {
    const catalogItems = createFurnitureCatalogItems(
      {
        "0":
          "Oak Chair/chair/-1/-1/4/350/-1/[LocalizedText Strings\\Furniture:OakChair]",
        "724":
          "Coffee Table/table/2 2/2 1/2/1250/-1/[LocalizedText Strings\\Furniture:CoffeeTable]",
        FreeCactus:
          "Cactus/randomized_plant/1 1/1 1/1/350/2/[LocalizedText Strings\\Furniture:Cactus]/0/TileSheets\\FreeCactuses/true",
        CCFishTank:
          "CCFishTank/fishtank/6 3/6 1/1/5000/-1/[LocalizedText Strings\\Furniture:CCFishTank]/256/TileSheets\\furniture_2/true",
      },
      "/game-assets/1.6.15/data/Furniture.json",
    );

    expect(catalogItems).toHaveLength(3);
    expect(catalogItems).toContainEqual({
      id: "furniture_0",
      name: "Oak Chair",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
      allowedTools: ["cursor", "multi-select", "erase"],
      renderingMetadata: {
        kind: "furniture",
        furnitureType: "chair",
        indoors: true,
        outdoors: true,
        rotationSprites: [
          { sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 } },
          { sprite: { kind: "source-rect", x: 16, y: 0, width: 16, height: 32 } },
          { sprite: { kind: "source-rect", x: 32, y: 0, width: 16, height: 32 } },
          {
            sprite: { kind: "source-rect", x: 16, y: 0, width: 16, height: 32 },
            flipped: true,
          },
        ],
        rotationTileSizes: undefined,
        wallMounted: false,
        isRug: false,
        isTable: false,
        isLongTable: false,
        bedType: null,
        compositeSprite: null,
      },
    });
    expect(catalogItems).toContainEqual({
      id: "furniture_724",
      name: "Coffee Table",
      category: "placeable",
      tileSize: { width: 2, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      sprite: { kind: "source-rect", x: 320, y: 352, width: 32, height: 32 },
      allowedTools: ["cursor", "multi-select", "erase"],
      renderingMetadata: {
        kind: "furniture",
        furnitureType: "table",
        indoors: true,
        outdoors: true,
        rotationSprites: [
          { sprite: { kind: "source-rect", x: 320, y: 352, width: 32, height: 32 } },
          { sprite: { kind: "source-rect", x: 352, y: 352, width: 16, height: 48 } },
        ],
        rotationTileSizes: [
          { width: 2, height: 1 },
          { width: 1, height: 2 },
        ],
        wallMounted: false,
        isRug: false,
        isTable: true,
        isLongTable: false,
        bedType: null,
        compositeSprite: null,
      },
    });
    expect(catalogItems).toContainEqual(
      expect.objectContaining({
        id: "furniture_FreeCactus",
        textureLocalPath: "/game-assets/1.6.15/tilesheets/FreeCactuses.png",
        sprite: { kind: "source-rect", x: 0, y: 96, width: 16, height: 16 },
        renderingMetadata: expect.objectContaining({
          kind: "furniture",
          compositeSprite: {
            pieceSize: 16,
            columns: 8,
            layers: [
              { baseY: 96, count: 16, offsetY: 0 },
              { baseY: 48, count: 24, offsetY: -8 },
              { baseY: 0, count: 24, offsetY: -24 },
            ],
          },
        }),
      }),
    );
    expect(catalogItems.some((catalogItem) => catalogItem.id === "furniture_CCFishTank")).toBe(false);
  });

  it("rejects furniture textures that are not included in the locked asset manifest", () => {
    expect(() =>
      createFurnitureCatalogItems(
        {
          "0":
            "Oak Chair/chair/-1/-1/4/350/-1/[LocalizedText Strings\\Furniture:OakChair]//TileSheets\\unknown_furniture",
        },
        "/game-assets/1.6.15/data/Furniture.json",
      ),
    ).toThrow(
      "/game-assets/1.6.15/data/Furniture.json record \"0\" field \"Texture\" references unverified local furniture texture \"TileSheets\\\\unknown_furniture\"",
    );
  });

  it("maps the verified fruit-tree sprites, seasonal fruit overlays, and fixed footprint", () => {
    const catalogItems = createFruitTreeCatalogItems(
      {
        "628": {
          Texture: "TileSheets\\fruitTrees",
          TextureSpriteRow: 0,
          Seasons: ["Spring"],
        },
        "629": {
          Texture: "TileSheets\\fruitTrees",
          TextureSpriteRow: 1,
          Seasons: ["Spring"],
        },
        "630": {
          Texture: "TileSheets\\fruitTrees",
          TextureSpriteRow: 2,
          Seasons: ["Summer"],
        },
        "631": {
          Texture: "TileSheets\\fruitTrees",
          TextureSpriteRow: 3,
          Seasons: ["Summer"],
        },
        "632": {
          Texture: "TileSheets\\fruitTrees",
          TextureSpriteRow: 4,
          Seasons: ["Fall"],
        },
        "633": {
          Texture: "TileSheets\\fruitTrees",
          TextureSpriteRow: 5,
          Seasons: ["Fall"],
        },
        "69": {
          Texture: "TileSheets\\fruitTrees",
          TextureSpriteRow: 7,
          Seasons: ["Summer"],
        },
        "835": {
          Texture: "TileSheets\\fruitTrees",
          TextureSpriteRow: 8,
          Seasons: ["Summer"],
        },
      },
      "/game-assets/1.6.15/data/FruitTrees.json",
    );

    expect(catalogItems).toHaveLength(8);
    expect(catalogItems).toEqual(expect.arrayContaining([
      {
        id: "fruittree_628",
        name: "Cherry Tree",
        category: "placeable",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: "/game-assets/1.6.15/tilesheets/fruitTrees.png",
        sprite: { kind: "source-rect", x: 192, y: 0, width: 48, height: 64 },
        allowedTools: ["cursor", "multi-select", "erase"],
        renderingMetadata: {
          kind: "fruit-tree",
          fruitSprite: { kind: "source-rect", x: 224, y: 416, width: 16, height: 16 },
          fruitSeasons: ["spring"],
        },
      },
      {
        id: "fruittree_835",
        name: "Mango Tree",
        category: "placeable",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: "/game-assets/1.6.15/tilesheets/fruitTrees.png",
        sprite: { kind: "source-rect", x: 192, y: 640, width: 48, height: 64 },
        allowedTools: ["cursor", "multi-select", "erase"],
        renderingMetadata: {
          kind: "fruit-tree",
          fruitSprite: { kind: "source-rect", x: 288, y: 544, width: 16, height: 16 },
          fruitSeasons: ["summer"],
        },
      },
    ]));
  });

  it("maps every source-verified wild tree to its seasonal local textures", () => {
    const catalogItems = createWildTreeCatalogItems();

    expect(catalogItems).toHaveLength(11);
    expect(catalogItems).toContainEqual({
      id: "wildtree_1",
      name: "Oak Tree",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/terrain/tree1_spring.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 96 },
      allowedTools: ["cursor", "multi-select", "erase"],
      renderingMetadata: {
        kind: "wild-tree",
        seasonalTextureLocalPaths: {
          spring: "/game-assets/1.6.15/terrain/tree1_spring.png",
          summer: "/game-assets/1.6.15/terrain/tree1_summer.png",
          fall: "/game-assets/1.6.15/terrain/tree1_fall.png",
          winter: "/game-assets/1.6.15/terrain/tree1_winter.png",
        },
        leafySeasons: { spring: true, summer: true, fall: true, winter: false },
        hasMossVariant: true,
        isStumpInWinter: false,
      },
    });
    expect(catalogItems).toContainEqual(
      expect.objectContaining({
        id: "wildtree_13",
        name: "Mystic Tree",
        renderingMetadata: expect.objectContaining({
          kind: "wild-tree",
          hasMossVariant: false,
          isStumpInWinter: false,
        }),
      }),
    );
  });
});
