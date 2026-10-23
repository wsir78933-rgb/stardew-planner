import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import { createFurnitureFirePlacementRenderLayers } from "../../src/rendering/furniture-fire-placement-rendering";

function createFireFurnitureCatalogItem(
  id: string,
  furnitureFire?: NonNullable<CatalogItem["furnitureFire"]>,
): CatalogItem {
  return {
    id,
    name: id,
    category: "placeable",
    tileSize: { width: 2, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 32, height: 80 },
    allowedTools: ["cursor"],
    ...(furnitureFire === undefined ? {} : { furnitureFire }),
  };
}

function createFireFurniturePlacementItem(
  itemId: string,
  variant: number,
  tintColor = "#ffffff",
): PlacementItem {
  return {
    instanceId: 18,
    itemId,
    x: 4,
    y: 7,
    layer: "item",
    rotation: 0,
    footprint: { width: 2, height: 1 },
    variant,
    tintColor,
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

describe("furniture fire placement rendering", () => {
  it("renders the frozen two-flame fireplace and its pulsing glow", () => {
    const catalogItem = createFireFurnitureCatalogItem("furniture_1792", {
      kind: "fireplace",
    });

    expect(
      createFurnitureFirePlacementRenderLayers(
        catalogItem,
        createFireFurniturePlacementItem("furniture_1792", 0),
      ),
    ).toEqual([
      expect.objectContaining({
        animation: {
          frames: [
            { x: 276, y: 1985, width: 12, height: 11 },
            { x: 288, y: 1985, width: 12, height: 11 },
            { x: 300, y: 1985, width: 12, height: 11 },
            { x: 312, y: 1985, width: 12, height: 11 },
          ],
          kind: "frame-cycle",
          frameDurationMilliseconds: 100,
          timeOffsetMilliseconds: 70,
        },
        frame: { x: 276, y: 1985, width: 12, height: 11 },
        pixelGeometry: expect.objectContaining({
          positionX: 77,
          positionY: 104,
          uniformScale: 1,
        }),
        textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      }),
      expect.objectContaining({
        animation: expect.objectContaining({
          kind: "frame-cycle",
          frameDurationMilliseconds: 100,
          timeOffsetMilliseconds: 270,
        }),
        pixelGeometry: expect.objectContaining({
          positionX: 71,
          positionY: 104,
          uniformScale: 1,
        }),
      }),
      expect.objectContaining({
        animation: expect.objectContaining({
          kind: "scale-pulse",
          baseScale: 0.8,
          phaseOffsetMilliseconds: -113,
          pulseAmplitude: 0.25,
        }),
        opacity: 0.35,
        pixelGeometry: expect.objectContaining({
          anchorX: 0.5,
          anchorY: 0.5,
          positionX: 80,
          positionY: 104,
          uniformScale: 0.8,
        }),
        tintColor: "#eee8aa",
      }),
    ]);
  });

  it("renders the frozen torch flame without a glow or custom tint", () => {
    const catalogItem = createFireFurnitureCatalogItem("furniture_2331", {
      kind: "torch",
    });

    expect(
      createFurnitureFirePlacementRenderLayers(
        catalogItem,
        createFireFurniturePlacementItem("furniture_2331", 0, "#d4a373"),
      ),
    ).toEqual([
      expect.objectContaining({
        pixelGeometry: expect.objectContaining({
          positionX: 67,
          positionY: 94,
          uniformScale: 1,
        }),
        shouldApplySelectionTint: false,
        tintColor: "#ffffff",
      }),
    ]);
  });

  it("renders the ordinary Torch with its seven-frame small flame", () => {
    const catalogItem = createFireFurnitureCatalogItem("object:93");

    expect(
      createFurnitureFirePlacementRenderLayers(
        catalogItem,
        createFireFurniturePlacementItem("object:93", 0),
      ),
    ).toEqual([
      expect.objectContaining({
        animation: {
          frames: [
            { x: 276, y: 1965, width: 8, height: 8 },
            { x: 284, y: 1965, width: 8, height: 8 },
            { x: 292, y: 1965, width: 8, height: 8 },
            { x: 300, y: 1965, width: 8, height: 8 },
            { x: 308, y: 1965, width: 8, height: 8 },
            { x: 316, y: 1965, width: 8, height: 8 },
            { x: 324, y: 1965, width: 8, height: 8 },
          ],
          kind: "frame-cycle",
          frameDurationMilliseconds: 100,
          timeOffsetMilliseconds: 570,
        },
        frame: { x: 276, y: 1965, width: 8, height: 8 },
        opacity: 0.75,
        pixelGeometry: expect.objectContaining({
          positionX: 70,
          positionY: 114,
          uniformScale: 0.75,
        }),
        shouldApplySelectionTint: false,
        tintColor: "#ffffff",
      }),
    ]);
  });

  it("keeps furniture torches on the four-frame large flame", () => {
    const catalogItem = createFireFurnitureCatalogItem("furniture_2331", {
      kind: "torch",
    });

    expect(
      createFurnitureFirePlacementRenderLayers(
        catalogItem,
        createFireFurniturePlacementItem("furniture_2331", 0),
      ),
    ).toEqual([
      expect.objectContaining({
        animation: expect.objectContaining({
          frames: [
            { x: 276, y: 1985, width: 12, height: 11 },
            { x: 288, y: 1985, width: 12, height: 11 },
            { x: 300, y: 1985, width: 12, height: 11 },
            { x: 312, y: 1985, width: 12, height: 11 },
          ],
          frameDurationMilliseconds: 100,
        }),
        pixelGeometry: expect.objectContaining({
          positionX: 67,
          positionY: 94,
          uniformScale: 1,
        }),
      }),
    ]);
  });

  it("removes every fire visual for the frozen unlit variant", () => {
    const catalogItem = createFireFurnitureCatalogItem("furniture_1792", {
      kind: "fireplace",
    });

    expect(
      createFurnitureFirePlacementRenderLayers(
        catalogItem,
        createFireFurniturePlacementItem("furniture_1792", 1),
      ),
    ).toEqual([]);
  });

  it("fails fast when a fire metadata item is outside its locked family", () => {
    const catalogItem = createFireFurnitureCatalogItem("furniture_0", {
      kind: "fireplace",
    });

    expect(() =>
      createFurnitureFirePlacementRenderLayers(
        catalogItem,
        createFireFurniturePlacementItem("furniture_0", 0),
      )
    ).toThrow('Furniture fire catalog item "furniture_0" is not in the locked fireplace ID set');
  });
});
