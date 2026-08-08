import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  createFruitTreeCatalogItems,
  createFurnitureCatalogItems,
  createWildTreeCatalogItems,
} from "../../src/catalog";

describe("expanded catalog items", () => {
  it("locks the seven window records to their frozen placement contract", () => {
    const rawFurnitureDataset = JSON.parse(
      readFileSync(
        path.join(
          process.cwd(),
          "public/game-assets/1.6.15/data/Furniture.json",
        ),
        "utf8",
      ),
    ) as unknown;
    const furnitureItems = createFurnitureCatalogItems(
      rawFurnitureDataset,
      "/game-assets/1.6.15/data/Furniture.json",
    );
    const windowItems = furnitureItems.filter((catalogItem) =>
      catalogItem.renderingMetadata?.kind === "furniture"
      && catalogItem.renderingMetadata.isWindow === true
    );

    expect(windowItems.map((catalogItem) => catalogItem.id).sort()).toEqual([
      "furniture_1614",
      "furniture_1616",
      "furniture_1673",
      "furniture_1678",
      "furniture_1682",
      "furniture_1749",
      "furniture_TriangleWindow",
    ]);
    for (const windowItem of windowItems) {
      expect(windowItem.tileSize).toEqual({ width: 1, height: 2 });
      expect(windowItem.presentationCapabilities).toEqual({
        canFlip: false,
        rotation: { count: 1, footprints: [{ width: 1, height: 2 }] },
        variantCycle: null,
        visibleVariants: [],
      });
    }

    expect(() => createFurnitureCatalogItems(
      {
        unexpected: "Unexpected Window/window/1 2/1 2/1/1/-1",
      },
      "/game-assets/1.6.15/data/Furniture.json",
    )).toThrow('field "Type" has unsupported window record ID "unexpected".');
  });

  it("derives every exact bed family, footprint, rotation, and Fill capability from Furniture Type", () => {
    const rawFurnitureDataset = JSON.parse(
      readFileSync(
        path.join(
          process.cwd(),
          "public/game-assets/1.6.15/data/Furniture.json",
        ),
        "utf8",
      ),
    ) as unknown;
    const furnitureItems = createFurnitureCatalogItems(
      rawFurnitureDataset,
      "/game-assets/1.6.15/data/Furniture.json",
    );
    const bedItems = furnitureItems.filter((catalogItem) =>
      catalogItem.renderingMetadata?.kind === "furniture"
      && catalogItem.renderingMetadata.bedType !== null
    );
    const bedIdsByType = Object.fromEntries(
      ["single", "double", "child"].map((bedType) => [
        bedType,
        bedItems
          .filter((catalogItem) =>
            catalogItem.renderingMetadata?.kind === "furniture"
            && catalogItem.renderingMetadata.bedType === bedType
          )
          .map((catalogItem) => catalogItem.id.slice("furniture_".length))
          .sort(),
      ]),
    );

    expect(bedIdsByType).toEqual({
      single: [
        "2048",
        "2176",
        "BluePinstripeBed",
        "MidnightBeachBed",
      ],
      double: [
        "2052",
        "2058",
        "2064",
        "2070",
        "2180",
        "2186",
        "2192",
        "2496",
        "2502",
        "2508",
        "2514",
        "BluePinstripeDoubleBed",
        "JojaBed",
        "JunimoBed",
        "MidnightBeachDoubleBed",
        "RetroBed",
        "WizardBed",
      ],
      child: ["2076"],
    });

    expect(bedItems).toHaveLength(22);
    for (const bedItem of bedItems) {
      const bedMetadata = bedItem.renderingMetadata;
      if (bedMetadata?.kind !== "furniture" || bedMetadata.bedType === null) {
        throw new Error(`Expected bed metadata for ${bedItem.id}.`);
      }

      const expectedWidth = bedMetadata.bedType === "double" ? 3 : 2;
      expect(bedItem.allowedTools).toEqual([
        "cursor",
        "multi-select",
        "fill",
        "erase",
      ]);
      expect(bedItem.tileSize).toEqual({ width: expectedWidth, height: 3 });
      expect(bedItem.presentationCapabilities?.rotation).toEqual({
        count: 1,
        footprints: [{ width: expectedWidth, height: 3 }],
      });
      expect(bedItem.sprite).toEqual(
        expect.objectContaining({ width: expectedWidth * 16, height: 64 }),
      );
    }

    expect(
      furnitureItems.find((catalogItem) => catalogItem.id === "furniture_0")
        ?.allowedTools,
    ).toEqual(["cursor", "multi-select", "erase"]);
  });

  it("maps verified furniture source rectangles, footprints, and rotation metadata", () => {
    const catalogItems = createFurnitureCatalogItems(
      {
        "0":
          "Oak Chair/chair/-1/-1/4/350/-1/[LocalizedText Strings\\Furniture:OakChair]",
        "724":
          "Coffee Table/table/2 2/2 1/2/1250/-1/[LocalizedText Strings\\Furniture:CoffeeTable]",
        "1451":
          "Red Rug/rug/-1/-1/2/1000/-1/[LocalizedText Strings\\Furniture:RedRug]",
        FreeCactus:
          "Cactus/randomized_plant/1 1/1 1/1/350/2/[LocalizedText Strings\\Furniture:Cactus]/0/TileSheets\\FreeCactuses/true",
        CCFishTank:
          "CCFishTank/fishtank/6 3/6 1/1/5000/-1/[LocalizedText Strings\\Furniture:CCFishTank]/256/TileSheets\\furniture_2/true",
      },
      "/game-assets/1.6.15/data/Furniture.json",
    );

    expect(catalogItems).toHaveLength(4);
    expect(catalogItems).toContainEqual({
      id: "furniture_0",
      name: "Oak Chair",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
      allowedTools: ["cursor", "multi-select", "erase"],
      presentationCapabilities: expect.objectContaining({
        canFlip: false,
        rotation: expect.objectContaining({ count: 4 }),
      }),
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
    expect(catalogItems).toContainEqual(
      expect.objectContaining({
        id: "furniture_1451",
        tileSize: { width: 3, height: 2 },
        allowedTools: ["cursor", "multi-select", "erase"],
        presentationCapabilities: expect.objectContaining({
          canFlip: false,
          rotation: {
            count: 2,
            footprints: [
              { width: 3, height: 2 },
              { width: 2, height: 3 },
            ],
          },
        }),
        renderingMetadata: expect.objectContaining({
          kind: "furniture",
          furnitureType: "rug",
          isRug: true,
          isTable: false,
          isLongTable: false,
          bedType: null,
        }),
      }),
    );
    expect(catalogItems).toContainEqual({
      id: "furniture_724",
      name: "Coffee Table",
      category: "placeable",
      tileSize: { width: 2, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      sprite: { kind: "source-rect", x: 320, y: 352, width: 32, height: 32 },
      allowedTools: ["cursor", "multi-select", "erase"],
      presentationCapabilities: expect.objectContaining({
        canFlip: false,
        rotation: expect.objectContaining({ count: 2 }),
      }),
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
        allowedTools: ["cursor", "multi-select", "fill", "erase"],
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
        presentationCapabilities: expect.objectContaining({
          canFlip: true,
          variantCycle: { count: 2, family: "tree" },
        }),
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
        presentationCapabilities: expect.objectContaining({
          canFlip: true,
          variantCycle: { count: 2, family: "tree" },
        }),
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
      presentationCapabilities: expect.objectContaining({
        canFlip: true,
        variantCycle: { count: 2, family: "tree" },
      }),
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
