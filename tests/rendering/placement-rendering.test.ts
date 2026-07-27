import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import {
  createPlacementRenderEntries,
} from "../../src/rendering/placement-rendering";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

function createCatalogItem(
  catalogItem: Partial<CatalogItem> & Pick<CatalogItem, "id" | "category">,
): CatalogItem {
  return {
    name: catalogItem.id,
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/test.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
    ...catalogItem,
  };
}

describe("createPlacementRenderEntries", () => {
  it("includes the locked paint mask only for a painted supported building", () => {
    const paintedBuildingCatalogItem = createCatalogItem({
      id: "building:Big Shed",
      category: "building",
      textureLocalPath: "/game-assets/1.6.15/buildings/Big Shed.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 112, height: 96 },
    });

    expect(
      createPlacementRenderEntries(
        {
          ...createEmptyPlacementSnapshot(),
          buildings: [
            {
              instanceId: 1,
              buildingId: "Big Shed",
              x: 2,
              y: 3,
              paintColors: {
                color1: "#112233",
                color2: "#445566",
                color3: "#778899",
              },
            },
          ],
          nextBuildingId: 2,
        },
        [paintedBuildingCatalogItem],
      ),
    ).toEqual([
      expect.objectContaining({
        buildingPaint: {
          colors: {
            color1: "#112233",
            color2: "#445566",
            color3: "#778899",
          },
          paintMaskLocalPath:
            "/game-assets/1.6.15/buildings/Big Shed_PaintMask.png",
        },
      }),
    ]);
  });

  it("maps persistent building, crop, floor, and fence records to locked local sprites", () => {
    const catalogItems = [
      createCatalogItem({
        id: "building:Barn",
        category: "building",
        tileSize: { width: 7, height: 4 },
        textureLocalPath: "/game-assets/1.6.15/buildings/Barn.png",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 112, height: 112 },
      }),
      createCatalogItem({
        id: "crop:24",
        category: "crop",
        textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
        sprite: { kind: "sprite-index", index: 18 },
      }),
      createCatalogItem({
        id: "floor:1",
        category: "floor",
        textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
        sprite: { kind: "source-rect", x: 32, y: 16, width: 64, height: 64 },
      }),
      createCatalogItem({
        id: "fence:322",
        category: "fence",
        textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 352 },
      }),
    ];
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 3, y: 4 }],
      crops: [{ cropId: "crop:24", x: 6, y: 7 }],
      items: [
        {
          instanceId: 1,
          itemId: "floor:1",
          x: 8,
          y: 9,
          layer: "path" as const,
          rotation: 0,
          footprint: { width: 1, height: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
        {
          instanceId: 2,
          itemId: "fence:322",
          x: 9,
          y: 10,
          layer: "fence" as const,
          rotation: 0,
          footprint: { width: 1, height: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
      ],
      nextBuildingId: 2,
      nextItemId: 3,
    };

    expect(
      createPlacementRenderEntries(placementSnapshot, catalogItems),
    ).toEqual([
      {
        key: "building:1",
        catalogItem: catalogItems[0],
        tileX: 3,
        tileY: 4,
        frame: { x: 0, y: 0, width: 112, height: 112 },
        rotationQuarterTurns: 0,
      },
      {
        key: "crop:6,7",
        catalogItem: catalogItems[1],
        tileX: 6,
        tileY: 7,
        frame: { x: 32, y: 32, width: 16, height: 32 },
        rotationQuarterTurns: 0,
      },
      {
        key: "item:1",
        catalogItem: catalogItems[2],
        tileX: 8,
        tileY: 9,
        frame: { x: 32, y: 16, width: 16, height: 16 },
        rotationQuarterTurns: 0,
      },
      {
        key: "item:2",
        catalogItem: catalogItems[3],
        tileX: 9,
        tileY: 10,
        frame: { x: 0, y: 0, width: 16, height: 16 },
        rotationQuarterTurns: 0,
      },
    ]);
  });

  it("fails fast when a persistent placement references a catalog item that is unavailable", () => {
    expect(() =>
      createPlacementRenderEntries(
        {
          ...createEmptyPlacementSnapshot(),
          crops: [{ cropId: "crop:missing", x: 0, y: 0 }],
        },
        [],
      ),
    ).toThrow('catalog item ID "crop:missing"');
  });

  it("normalizes item rotation to quarter turns while buildings and crops remain unrotated", () => {
    const catalogItems = [
      createCatalogItem({
        id: "building:Barn",
        category: "building",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
      }),
      createCatalogItem({
        id: "crop:24",
        category: "crop",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
      }),
      createCatalogItem({
        id: "object:390",
        category: "placeable",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
      }),
    ];
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 0, y: 0 }],
      crops: [{ cropId: "crop:24", x: 1, y: 1 }],
      items: [
        {
          instanceId: 1,
          itemId: "object:390",
          x: 2,
          y: 2,
          layer: "item" as const,
          rotation: -1,
          footprint: { width: 1, height: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
      ],
      nextBuildingId: 2,
      nextItemId: 2,
    };

    expect(
      createPlacementRenderEntries(placementSnapshot, catalogItems).map(
        (placementRenderEntry) => placementRenderEntry.rotationQuarterTurns,
      ),
    ).toEqual([0, 0, 3]);
  });

  it("uses furniture rotation sprites and the selected seasonal wild-tree texture", () => {
    const catalogItems = [
      createCatalogItem({
        id: "furniture_0",
        category: "placeable",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
        renderingMetadata: {
          kind: "furniture",
          furnitureType: "chair",
          indoors: true,
          outdoors: true,
          rotationSprites: [
            { sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 } },
            { sprite: { kind: "source-rect", x: 16, y: 0, width: 32, height: 16 } },
          ],
          rotationTileSizes: undefined,
          wallMounted: false,
          isRug: false,
          isTable: false,
          isLongTable: false,
          bedType: null,
          compositeSprite: null,
        },
      }),
      createCatalogItem({
        id: "wildtree_1",
        category: "placeable",
        textureLocalPath: "/game-assets/1.6.15/terrain/tree1_spring.png",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 96 },
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
      }),
    ];
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          instanceId: 1,
          itemId: "furniture_0",
          x: 2,
          y: 2,
          layer: "item" as const,
          rotation: 1,
          footprint: { width: 1, height: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
        {
          instanceId: 2,
          itemId: "wildtree_1",
          x: 3,
          y: 3,
          layer: "item" as const,
          rotation: 0,
          footprint: { width: 1, height: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
      ],
      nextItemId: 3,
    };

    expect(
      createPlacementRenderEntries(placementSnapshot, catalogItems, "summer"),
    ).toEqual([
      expect.objectContaining({
        key: "item:1",
        frame: { kind: "source-rect", x: 16, y: 0, width: 32, height: 16 },
        rotationQuarterTurns: 0,
      }),
      expect.objectContaining({
        key: "item:2",
        textureLocalPath: "/game-assets/1.6.15/terrain/tree1_summer.png",
      }),
    ]);
  });
});
