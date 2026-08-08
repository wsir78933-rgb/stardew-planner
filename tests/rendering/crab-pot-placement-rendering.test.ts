import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import { createCrabPotPixelGeometry } from "../../src/rendering/crab-pot-placement-rendering";

function createCrabPotCatalogItem(): CatalogItem {
  return {
    id: "object:710",
    name: "Crab Pot",
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "sprite-index", index: 710 },
    allowedTools: ["cursor", "multi-select", "erase"],
    renderingMetadata: { kind: "crab-pot" },
  };
}

function createCrabPotPlacementItem(): PlacementItem {
  return {
    instanceId: 1,
    itemId: "object:710",
    x: 1,
    y: 1,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant: 0,
    tintColor: "#00ff00",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

function createWaterGrid(waterTileKeys: readonly string[]): MapPlacementGrid {
  const waterTileKeySet = new Set(waterTileKeys);
  return {
    width: 3,
    height: 3,
    capabilitiesByTile: Array.from({ length: 9 }, (_unusedValue, tileIndex) => {
      const x = tileIndex % 3;
      const y = Math.floor(tileIndex / 3);
      return {
        buildable: false,
        crabPot: false,
        diggable: false,
        passable: false,
        treePlantable: false,
        treePlantableOnDirt: false,
        wall: false,
        water: waterTileKeySet.has(`${String(x)},${String(y)}`),
      };
    }),
  };
}

describe("crab-pot placement rendering", () => {
  it("uses the frozen water-edge offsets and preserves the generic tint/key path", () => {
    expect(createCrabPotPixelGeometry(
      createCrabPotCatalogItem(),
      createCrabPotPlacementItem(),
      createWaterGrid(["1,1", "2,1", "1,2"]),
    )).toEqual({
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX: 24,
      positionY: 14,
    });
  });

  it("treats out-of-bounds water neighbors as blocked", () => {
    expect(createCrabPotPixelGeometry(
      createCrabPotCatalogItem(),
      { ...createCrabPotPlacementItem(), x: 0, y: 0 },
      createWaterGrid(["0,0", "1,0", "0,1"]),
    )).toEqual({
      anchorX: 0,
      anchorY: 0,
      horizontalScale: 1,
      positionX: 8,
      positionY: -2,
    });
  });

  it("fails before rendering when the exact catalog metadata is absent", () => {
    expect(() => createCrabPotPixelGeometry(
      { ...createCrabPotCatalogItem(), renderingMetadata: undefined },
      createCrabPotPlacementItem(),
      createWaterGrid([]),
    )).toThrow('Crab Pot catalog item "object:710" renderingMetadata must have kind "crab-pot"; received undefined.');
  });
});
