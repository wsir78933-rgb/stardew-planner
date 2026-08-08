import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createCatalogFromDatasets,
  fishPondWaterColors,
} from "../../src/catalog";

async function readLockedCatalogDataset(filename: string): Promise<unknown> {
  const absolutePath = path.join(
    process.cwd(),
    "public/game-assets/1.6.15/data",
    filename,
  );

  return JSON.parse(await readFile(absolutePath, "utf8")) as unknown;
}

describe("catalog schema", () => {
  it("accepts the version-locked local datasets and retains only verified texture mappings", async () => {
    const catalog = createCatalogFromDatasets(
      {
        buildings: await readLockedCatalogDataset("Buildings.json"),
        crops: await readLockedCatalogDataset("Crops.json"),
        bigCraftables: await readLockedCatalogDataset("BigCraftables.json"),
        objects: await readLockedCatalogDataset("Objects.json"),
        fences: await readLockedCatalogDataset("Fences.json"),
        floorsAndPaths: await readLockedCatalogDataset("FloorsAndPaths.json"),
        furniture: await readLockedCatalogDataset("Furniture.json"),
        fruitTrees: await readLockedCatalogDataset("FruitTrees.json"),
      },
      catalogDatasetUrls,
    );

    expect(catalog.items).toHaveLength(1700);
    expect(catalog.items.find((catalogItem) => catalogItem.id === "building:Coop"))
      .toMatchObject({
        id: "building:Coop",
        name: "Coop",
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
      });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "building:Coop"))
      .toMatchObject({
        renderingMetadata: {
          buildingId: "Coop",
          kind: "building-multilayer",
          layers: expect.arrayContaining([
            expect.objectContaining({ id: "Base" }),
            expect.objectContaining({ id: "Default_AnimalDoor" }),
          ]),
          sortTileOffset: 0,
        },
      });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "building:Shipping Bin"))
      .toMatchObject({
        renderingMetadata: {
          layers: expect.arrayContaining([
            expect.objectContaining({ id: "Base" }),
            expect.objectContaining({ id: "ShippingBinLid" }),
          ]),
        },
      });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "building:Junimo Hut"))
      .toMatchObject({
        sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 64 },
      });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "building:Pet Bowl"))
      .toMatchObject({
        renderingMetadata: {
          layers: expect.arrayContaining([
            expect.objectContaining({ id: "Default_Background" }),
            expect.objectContaining({ id: "Base" }),
          ]),
        },
      });
    expect(catalog.items.find((catalogItem) =>
      catalogItem.id === "building:Fish Pond"
    )).toMatchObject({
      id: "building:Fish Pond",
      name: "Fish Pond",
      category: "building",
      tileSize: { width: 5, height: 5 },
      textureLocalPath: "/game-assets/1.6.15/buildings/Fish Pond.png",
      sprite: {
        kind: "source-rect",
        x: 0,
        y: 0,
        width: 80,
        height: 80,
      },
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 4, family: "generic" },
        visibleVariants: [
          { label: "Net 1", value: 0 },
          { label: "Net 2", value: 1 },
          { label: "Net 3", value: 2 },
          { label: "None", value: 3 },
        ],
      },
      renderingMetadata: {
        buildingId: "Fish Pond",
        kind: "building-multilayer",
        sortTileOffset: 4.5,
        },
      });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "building:Farmhouse"))
      .toMatchObject({
        renderingMetadata: {
          layers: expect.arrayContaining([
            expect.objectContaining({
            id: "Mailbox",
            frame: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
            offsetX: 146,
            offsetY: 48,
            textureLocalPath: "/game-assets/1.6.15/buildings/Mailbox.png",
            }),
            expect.objectContaining({ id: "Default_Mailbox" }),
          ]),
        },
      });
    expect(fishPondWaterColors).toEqual([
      { label: "Default", value: 3_964_566 },
      { label: "Lava Eel", value: 16_391_710 },
      { label: "Void Salmon", value: 7_869_550 },
      { label: "Slimejack", value: 3_997_500 },
      { label: "Super Cucumber", value: 9_856_200 },
      { label: "Glacier Fish", value: 6_615_260 },
      { label: "Ms. Angler", value: 16_742_600 },
      { label: "Angler", value: 16_742_400 },
      { label: "Mutant Carp", value: 3_333_220 },
      { label: "Crimson Fish", value: 15_091_310 },
      { label: "Legend", value: 2_659_890 },
      { label: "Legendary", value: 9_843_410 },
    ]);
    expect(catalog.items).toContainEqual({
      id: "furniture_0",
      name: "Oak Chair",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
      allowedTools: ["cursor", "multi-select", "erase"],
      presentationCapabilities: expect.objectContaining({
        rotation: expect.objectContaining({ count: 4 }),
      }),
      renderingMetadata: expect.objectContaining({ kind: "furniture" }),
    });
    expect(catalog.items).toContainEqual({
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
      renderingMetadata: expect.objectContaining({ kind: "fruit-tree" }),
    });
    expect(catalog.items).toContainEqual({
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
      renderingMetadata: expect.objectContaining({ kind: "wild-tree" }),
    });
    expect(catalog.items).toContainEqual({
      id: "crop:CarrotSeeds",
      name: "Carrot",
      category: "crop",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
      sprite: { kind: "sprite-index", index: 48 },
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 64, y: 768, width: 16, height: 32 },
        tintColors: [],
        hasForageShadow: false,
      },
    });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "crop:425")).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 208, y: 480, width: 16, height: 32 },
        coloredRect: { kind: "source-rect", x: 224, y: 480, width: 16, height: 32 },
        tintColors: [0xbb00ff, 0x7789ff, 0x47e3ff, 0xff7f90, 0xcdb2ff, 0x8c77ff],
        hasForageShadow: false,
      },
    });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "crop:495_18")).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      sprite: { kind: "sprite-index", index: 23 },
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 288, y: 0, width: 16, height: 16 },
        tintColors: [],
        hasForageShadow: true,
      },
    });
    expect(catalog.items.find((catalogItem) =>
      catalogItem.id === "crop:giant_Cauliflower"
    )).toMatchObject({
      sprite: { kind: "source-rect", x: 112, y: 512, width: 48, height: 64 },
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 112, y: 512, width: 48, height: 64 },
        tintColors: [],
        hasForageShadow: false,
      },
    });
    expect(catalog.items).toContainEqual({
      id: "floor:0",
      name: "Wood Floor",
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
      id: "hoedirt",
      name: "Tilled Dirt",
      category: "floor",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/terrain/hoeDirt.png",
      sprite: {
        kind: "source-rect",
        x: 0,
        y: 0,
        width: 16,
        height: 16,
      },
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 2, family: "generic" },
        visibleVariants: [
          {
            label: "Dry",
            renderDescriptor: { kind: "variant-index", variant: 0 },
            value: 0,
          },
          {
            label: "Watered",
            renderDescriptor: { kind: "variant-index", variant: 1 },
            value: 1,
          },
        ],
      },
      renderingMetadata: {
        kind: "hoe-dirt",
        seasonalTextureLocalPaths: {
          spring: "/game-assets/1.6.15/terrain/hoeDirt.png",
          summer: "/game-assets/1.6.15/terrain/hoeDirt.png",
          fall: "/game-assets/1.6.15/terrain/hoeDirt.png",
          winter: "/game-assets/1.6.15/terrain/hoeDirtSnow.png",
        },
      },
    });
    expect(catalog.items.findIndex((item) => item.id === "hoedirt")).toBeLessThan(
      catalog.items.findIndex((item) => item.id === "floor:0"),
    );
    expect(
      [
        ["object:599", 0],
        ["object:621", 1],
        ["object:645", 2],
      ].map(([catalogItemId, baseRadius]) => ({
        catalogItemId,
        renderingMetadata: catalog.items.find(
          (catalogItem) => catalogItem.id === catalogItemId,
        )?.renderingMetadata,
        baseRadius,
      })),
    ).toEqual([
      {
        catalogItemId: "object:599",
        renderingMetadata: { kind: "sprinkler", baseRadius: 0 },
        baseRadius: 0,
      },
      {
        catalogItemId: "object:621",
        renderingMetadata: { kind: "sprinkler", baseRadius: 1 },
        baseRadius: 1,
      },
      {
        catalogItemId: "object:645",
        renderingMetadata: { kind: "sprinkler", baseRadius: 2 },
        baseRadius: 2,
      },
    ]);
    expect(
      catalog.items.find((catalogItem) => catalogItem.id === "object:600")
        ?.renderingMetadata,
    ).toBeUndefined();
    expect(
      catalog.items.find((catalogItem) => catalogItem.id === "object:710")
        ?.renderingMetadata,
    ).toEqual({ kind: "crab-pot" });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "object:325"))
      .toEqual(expect.objectContaining({
        id: "object:325",
        name: "Gate",
        category: "fence",
        tileSize: { width: 1, height: 1 },
        textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
        allowedTools: ["cursor", "multi-select", "erase"],
      }));
    expect(
      catalog.items.filter((catalogItem) => catalogItem.placementShadow !== undefined)
        .map((catalogItem) => catalogItem.id),
    ).toEqual([
      "object:16", "object:18", "object:20", "object:22", "object:152",
      "object:153", "object:283", "object:372", "object:392", "object:393",
      "object:394", "object:396", "object:397", "object:398", "object:402",
      "object:404", "object:406", "object:408", "object:410", "object:412",
      "object:414", "object:416", "object:463", "object:464", "object:599",
      "object:621", "object:645", "object:718", "object:719", "object:723",
    ]);
    expect(
      catalog.items.filter((catalogItem) => catalogItem.furnitureFire !== undefined)
        .map((catalogItem) => [catalogItem.id, catalogItem.furnitureFire?.kind]),
    ).toEqual([
      ["furniture_1792", "fireplace"], ["furniture_1794", "fireplace"],
      ["furniture_1796", "fireplace"], ["furniture_1798", "fireplace"],
      ["furniture_1800", "fireplace"], ["furniture_1866", "fireplace"],
      ["furniture_2331", "torch"], ["furniture_2397", "torch"],
      ["furniture_2398", "torch"], ["furniture_DesertFireplace", "fireplace"],
      ["furniture_JojaFireplace", "fireplace"], ["furniture_WizardFireplace", "fireplace"],
      ["furniture_JunimoFireplace", "fireplace"], ["furniture_RetroFireplace", "fireplace"],
    ]);
    expect(catalog.items.find((catalogItem) => catalogItem.id === "furniture_1792"))
      .toMatchObject({ nightLight: { radiusInTiles: 10, color: 0xffe3a0 } });
    expect(catalog.items.find((catalogItem) => catalogItem.id === "furniture_2331"))
      .toMatchObject({ nightLight: { radiusInTiles: 3, color: 0xffe3a0 } });
    expect(
      [
        "143",
        "144",
        "145",
        "146",
        "147",
        "148",
        "149",
        "150",
        "151",
        "278",
      ].map((recordId) => ({
        recordId,
        renderingMetadata: catalog.items.find(
          (catalogItem) => catalogItem.id === `big-craftable:${recordId}`,
        )?.renderingMetadata,
      })),
    ).toEqual([
      ...["143", "144", "145"].map((recordId) => ({
        recordId,
        renderingMetadata: expect.objectContaining({
          kind: "lit-big-craftable",
          flameLayers: [
            { offsetX: 2, offsetY: -14, scale: 1, timeOffsetMilliseconds: 0 },
          ],
        }),
      })),
      {
        recordId: "146",
        renderingMetadata: expect.objectContaining({
          kind: "lit-big-craftable",
          flameLayers: [
            { offsetX: 3, offsetY: -2, scale: 0.75, timeOffsetMilliseconds: 0 },
            { offsetX: 5, offsetY: 0, scale: 0.75, timeOffsetMilliseconds: 137 },
            { offsetX: 3, offsetY: 3, scale: 0.75, timeOffsetMilliseconds: 274 },
          ],
        }),
      },
      ...["147", "148", "149", "150", "151"].map((recordId) => ({
        recordId,
        renderingMetadata: expect.objectContaining({
          kind: "lit-big-craftable",
          flameLayers: [
            { offsetX: 2, offsetY: -14, scale: 1, timeOffsetMilliseconds: 0 },
          ],
        }),
      })),
      {
        recordId: "278",
        renderingMetadata: expect.objectContaining({
          kind: "lit-big-craftable",
          flameLayers: [
            { offsetX: 3, offsetY: -2, scale: 0.75, timeOffsetMilliseconds: 0 },
            { offsetX: 5, offsetY: 0, scale: 0.75, timeOffsetMilliseconds: 137 },
            { offsetX: 3, offsetY: 3, scale: 0.75, timeOffsetMilliseconds: 274 },
          ],
        }),
      },
    ]);
    for (const nonAnimatedBigCraftableId of ["72", "152"]) {
      expect(
        catalog.items.find(
          (catalogItem) =>
            catalogItem.id === `big-craftable:${nonAnimatedBigCraftableId}`,
        )?.renderingMetadata,
      ).toBeUndefined();
    }
    expect(catalog.items).toContainEqual({
      id: "fence:322",
      name: "Wood Fence",
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
    expect(catalog.items).toContainEqual({
      id: "clump_602",
      name: "Large Log",
      category: "decor",
      tileSize: { width: 2, height: 2 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      sprite: {
        kind: "source-rect",
        x: 32,
        y: 400,
        width: 32,
        height: 32,
      },
      allowedTools: ["cursor", "multi-select", "erase"],
    });
    expect(catalog.items.some((item) => item.id === "object:342")).toBe(false);
    expect(catalog.items.some((item) => item.textureLocalPath.includes("Objects_2"))).toBe(false);
  });

  it("loads Furniture and FruitTrees from the version-locked local asset root without PaintData", () => {
    expect(Object.values(catalogDatasetUrls)).toContain(
      "/game-assets/1.6.15/data/Furniture.json",
    );
    expect(Object.values(catalogDatasetUrls)).toContain(
      "/game-assets/1.6.15/data/FruitTrees.json",
    );
    expect(Object.values(catalogDatasetUrls)).not.toContain(
      "/game-assets/1.6.15/data/PaintData.json",
    );
  });

  it("marks only version-locked light metadata and explicit light IDs as night lights", async () => {
    const catalog = createCatalogFromDatasets(
      {
        buildings: await readLockedCatalogDataset("Buildings.json"),
        crops: await readLockedCatalogDataset("Crops.json"),
        bigCraftables: await readLockedCatalogDataset("BigCraftables.json"),
        objects: await readLockedCatalogDataset("Objects.json"),
        fences: await readLockedCatalogDataset("Fences.json"),
        floorsAndPaths: await readLockedCatalogDataset("FloorsAndPaths.json"),
        furniture: await readLockedCatalogDataset("Furniture.json"),
        fruitTrees: await readLockedCatalogDataset("FruitTrees.json"),
      },
      catalogDatasetUrls,
    );

    for (const catalogItemId of [
      "object:93",
      "big-craftable:143",
      "big-craftable:152",
      "furniture_1443",
      "object:746",
      "furniture_1369",
      "furniture_1440",
    ]) {
      expect(catalog.items.find((catalogItem) => catalogItem.id === catalogItemId))
        .toEqual(expect.objectContaining({ nightLight: expect.any(Object) }));
    }

    expect(catalog.items.find((catalogItem) => catalogItem.id === "big-craftable:72"))
      .not.toHaveProperty("nightLight");
    expect(catalog.items.some((catalogItem) => catalogItem.id === "furniture_CCFishTank"))
      .toBe(false);
  });
});
