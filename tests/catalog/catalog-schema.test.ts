import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createCatalogFromDatasets,
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

    expect(catalog.items).toHaveLength(1660);
    expect(catalog.items).toContainEqual({
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
    expect(catalog.items).toContainEqual({
      id: "furniture_0",
      name: "Oak Chair",
      category: "placeable",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
      allowedTools: ["cursor", "multi-select", "erase"],
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
        width: 64,
        height: 64,
      },
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
    });
    expect(catalog.items).toContainEqual({
      id: "fence:322",
      name: "Wood Fence",
      category: "fence",
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png",
      sprite: {
        kind: "source-rect",
        x: 0,
        y: 0,
        width: 48,
        height: 352,
      },
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
    });
    expect(catalog.items).toContainEqual({
      id: "clump_602",
      name: "Large Log",
      category: "decor",
      tileSize: { width: 2, height: 2 },
      textureLocalPath: "/game-assets/1.6.15/sprites/springobjects.png",
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
