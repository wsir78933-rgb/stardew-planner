import { describe, expect, it } from "vitest";
import type { CatalogItem, CatalogSeason } from "../../src/catalog";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import { createTreePlacementRenderLayers } from "../../src/rendering/tree-placement-rendering";

const seasonalWildTreeTexturePaths = {
  spring: "/game-assets/1.6.15/terrain/tree1_spring.png",
  summer: "/game-assets/1.6.15/terrain/tree1_summer.png",
  fall: "/game-assets/1.6.15/terrain/tree1_fall.png",
  winter: "/game-assets/1.6.15/terrain/tree1_winter.png",
} as const;

function createPlacementItem(
  placementItem: Partial<PlacementItem> = {},
): PlacementItem {
  return {
    bedType: null,
    flipped: false,
    footprint: { width: 1, height: 1 },
    instanceId: 9,
    isGrass: false,
    isLongTable: false,
    isRug: false,
    isTable: false,
    itemId: "wildtree_1",
    layer: "item",
    locked: false,
    rotation: 0,
    tintColor: "#ffffff",
    variant: 0,
    x: 2,
    y: 3,
    ...placementItem,
  };
}

function createWildTreeCatalogItem(
  isStumpInWinter = false,
  leafySeasons = {
    spring: true,
    summer: true,
    fall: true,
    winter: false,
  },
): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id: "wildtree_1",
    name: "Oak Tree",
    renderingMetadata: {
      hasMossVariant: true,
      isStumpInWinter,
      kind: "wild-tree",
      leafySeasons,
      seasonalTextureLocalPaths: seasonalWildTreeTexturePaths,
    },
    sprite: { height: 96, kind: "source-rect", width: 48, x: 0, y: 0 },
    textureLocalPath: seasonalWildTreeTexturePaths.spring,
    tileSize: { width: 1, height: 1 },
  };
}

function createFruitTreeCatalogItem(
  fruitSeasons: readonly CatalogSeason[] = ["fall"],
): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id: "fruittree_633",
    name: "Apple Tree",
    renderingMetadata: {
      fruitSeasons,
      fruitSprite: {
        height: 16,
        kind: "source-rect",
        width: 16,
        x: 224,
        y: 416,
      },
      kind: "fruit-tree",
    },
    sprite: { height: 64, kind: "source-rect", width: 48, x: 192, y: 160 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/fruitTrees.png",
    tileSize: { width: 1, height: 1 },
  };
}

describe("tree placement rendering", () => {
  it("describes exact mature wild-tree shadow, trunk, and canopy layers", () => {
    expect(createTreePlacementRenderLayers({
      catalogItem: createWildTreeCatalogItem(),
      mapId: "standard",
      placementItem: createPlacementItem(),
      season: "spring",
    })).toEqual([
      {
        frame: null,
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 19.25,
          positionY: 44,
        },
        shouldApplySelectionTint: false,
        textureLocalPath: "/game-assets/1.6.15/terrain/tree_shadow.png",
      },
      {
        frame: { height: 32, width: 16, x: 32, y: 96 },
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 32,
          positionY: 32,
        },
        shouldApplySelectionTint: true,
        textureLocalPath: seasonalWildTreeTexturePaths.spring,
      },
      {
        frame: { height: 96, width: 48, x: 0, y: 0 },
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 16,
          positionY: -32,
        },
        shouldApplySelectionTint: true,
        textureLocalPath: seasonalWildTreeTexturePaths.spring,
      },
    ]);
  });

  it("uses the moss offset outside winter and renders only a winter stump trunk", () => {
    const mossLayers = createTreePlacementRenderLayers({
      catalogItem: createWildTreeCatalogItem(),
      mapId: "standard",
      placementItem: createPlacementItem({ variant: 1 }),
      season: "fall",
    });
    const winterStumpLayers = createTreePlacementRenderLayers({
      catalogItem: createWildTreeCatalogItem(true),
      mapId: "standard",
      placementItem: createPlacementItem({ variant: 1 }),
      season: "winter",
    });

    expect(mossLayers?.map((layer) => layer.frame)).toEqual([
      null,
      { height: 32, width: 16, x: 128, y: 96 },
      { height: 96, width: 48, x: 96, y: 0 },
    ]);
    expect(winterStumpLayers).toEqual([
      expect.objectContaining({
        frame: { height: 32, width: 16, x: 32, y: 96 },
        textureLocalPath: seasonalWildTreeTexturePaths.winter,
      }),
    ]);
  });

  it("chooses the nonleafy mature shadow and mirrors every wild-tree layer", () => {
    const layers = createTreePlacementRenderLayers({
      catalogItem: createWildTreeCatalogItem(false, {
        spring: false,
        summer: false,
        fall: false,
        winter: false,
      }),
      mapId: "standard",
      placementItem: createPlacementItem({ flipped: true }),
      season: "winter",
    });

    expect(layers?.[0]).toEqual(expect.objectContaining({
      shouldApplySelectionTint: false,
      textureLocalPath:
        "/game-assets/1.6.15/terrain/tree_shadow_nonleafy.png",
    }));
    expect(layers?.every(
      (layer) =>
        layer.pixelGeometry.anchorX === 1
        && layer.pixelGeometry.horizontalMirrorCenterX === 40
        && layer.pixelGeometry.horizontalScale === -1,
    )).toBe(true);
  });

  it.each([
    [0, { height: 16, width: 16, x: 32, y: 128 }, 48],
    [1, { height: 16, width: 16, x: 0, y: 128 }, 48],
    [2, { height: 16, width: 16, x: 16, y: 128 }, 48],
    [3, { height: 32, width: 16, x: 0, y: 96 }, 32],
    [4, { height: 32, width: 16, x: 0, y: 96 }, 32],
  ] as const)(
    "renders wild-tree growth stage %i as one bottom-aligned layer",
    (growthStage, expectedFrame, expectedPositionY) => {
      const layers = createTreePlacementRenderLayers({
        catalogItem: createWildTreeCatalogItem(true),
        mapId: "standard",
        placementItem: createPlacementItem({
          flipped: true,
          growthStage,
          variant: 1,
        }),
        season: "winter",
      });

      expect(layers).toEqual([
        expect.objectContaining({
          frame: expectedFrame,
          pixelGeometry: {
            anchorX: 1,
            anchorY: 0,
            horizontalMirrorCenterX: 40,
            horizontalScale: -1,
            positionX: 32,
            positionY: expectedPositionY,
          },
          textureLocalPath: seasonalWildTreeTexturePaths.winter,
        }),
      ]);
    },
  );

  it.each([0, 1, 2, 3] as const)(
    "renders fruit-tree growth stage %i as one bottom-centered layer",
    (growthStage) => {
      const layers = createTreePlacementRenderLayers({
        catalogItem: createFruitTreeCatalogItem(),
        mapId: "standard",
        placementItem: createPlacementItem({
          flipped: true,
          growthStage,
          itemId: "fruittree_633",
        }),
        season: "spring",
      });

      expect(layers).toEqual([
        {
          frame: {
            height: 80,
            width: 48,
            x: growthStage * 48,
            y: 160,
          },
          pixelGeometry: {
            anchorX: 1,
            anchorY: 1,
            horizontalScale: -1,
            positionX: 40,
            positionY: 64,
          },
          shouldApplySelectionTint: true,
          textureLocalPath:
            "/game-assets/1.6.15/tilesheets/fruitTrees.png",
        },
      ]);
    },
  );

  it("describes exact seasonal mature fruit-tree layers", () => {
    const layers = createTreePlacementRenderLayers({
      catalogItem: createFruitTreeCatalogItem(),
      mapId: "standard",
      placementItem: createPlacementItem({ itemId: "fruittree_633" }),
      season: "fall",
    });

    expect(layers).toEqual([
      expect.objectContaining({
        frame: { height: 16, width: 48, x: 288, y: 224 },
        pixelGeometry: expect.objectContaining({ positionX: 16, positionY: 48 }),
      }),
      expect.objectContaining({
        frame: { height: 32, width: 48, x: 384, y: 208 },
        pixelGeometry: expect.objectContaining({ positionX: 16, positionY: 32 }),
      }),
      expect.objectContaining({
        frame: { height: 64, width: 48, x: 288, y: 160 },
        pixelGeometry: expect.objectContaining({ positionX: 16, positionY: -16 }),
      }),
    ]);
  });

  it("forces greenhouse summer layers and permits fruit in every season", () => {
    const layers = createTreePlacementRenderLayers({
      catalogItem: createFruitTreeCatalogItem([]),
      mapId: "greenhouse",
      placementItem: createPlacementItem({
        flipped: true,
        itemId: "fruittree_633",
        variant: 1,
      }),
      season: "winter",
    });

    expect(layers?.slice(0, 3).map((layer) => layer.frame)).toEqual([
      { height: 16, width: 48, x: 240, y: 224 },
      { height: 32, width: 48, x: 384, y: 208 },
      { height: 64, width: 48, x: 240, y: 160 },
    ]);
    expect(layers?.slice(0, 3).every(
      (layer) =>
        layer.pixelGeometry.anchorX === 1
        && layer.pixelGeometry.horizontalMirrorCenterX === 40
        && layer.pixelGeometry.horizontalScale === -1,
    )).toBe(true);
    expect(layers).toHaveLength(6);
  });

  it("uses the frozen fruit positions and keeps fruit independent from placement flip", () => {
    const unflippedLayers = createTreePlacementRenderLayers({
      catalogItem: createFruitTreeCatalogItem(["fall"]),
      mapId: "standard",
      placementItem: createPlacementItem({
        itemId: "fruittree_633",
        variant: 1,
      }),
      season: "fall",
    });
    const flippedLayers = createTreePlacementRenderLayers({
      catalogItem: createFruitTreeCatalogItem(["fall"]),
      mapId: "standard",
      placementItem: createPlacementItem({
        flipped: true,
        itemId: "fruittree_633",
        variant: 1,
      }),
      season: "fall",
    });
    const fruitLayers = unflippedLayers?.slice(3);
    const flippedFruitLayers = flippedLayers?.slice(3);
    const treeX = 2;
    const treeY = 3;
    const firstX = (treeX * 200) % 64 / 2;
    const firstY = treeX % 64 / 3;
    const secondY = (treeX * 232) % 64 / 3;
    const thirdOffset = (treeX * 200) % 64 / 3;

    expect(fruitLayers?.map((layer) => layer.pixelGeometry)).toEqual([
      {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: (treeX * 64 - 64 + firstX) / 4,
        positionY: (treeY * 64 - 192 - firstY) / 4,
      },
      {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: (treeX * 64 + 32) / 4,
        positionY: (treeY * 64 - 256 + secondY) / 4,
      },
      {
        anchorX: 1,
        anchorY: 0,
        horizontalScale: -1,
        positionX: (treeX * 64 + thirdOffset) / 4,
        positionY: (treeY * 64 - 160 + thirdOffset) / 4,
      },
    ]);
    expect(flippedFruitLayers).toEqual(fruitLayers);
    expect(fruitLayers?.every(
      (layer) =>
        layer.textureLocalPath
        === "/game-assets/1.6.15/sprites/springobjects.png",
    )).toBe(true);
  });

  it("does not draw fruit outside its season on a normal map", () => {
    const layers = createTreePlacementRenderLayers({
      catalogItem: createFruitTreeCatalogItem(["fall"]),
      mapId: "standard",
      placementItem: createPlacementItem({
        itemId: "fruittree_633",
        variant: 1,
      }),
      season: "summer",
    });

    expect(layers).toHaveLength(3);
  });
});
