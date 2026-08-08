import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import {
  createSprinklerAttachmentRenderLayer,
  createSprinklerCoverageTiles,
} from "../../src/rendering/sprinkler-placement-rendering";

function createSprinklerCatalogItem(
  itemId: string,
  baseRadius: number,
): CatalogItem {
  return {
    id: itemId,
    name: itemId,
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "sprite-index", index: Number(itemId.split(":")[1]) },
    allowedTools: ["cursor", "multi-select", "erase"],
    renderingMetadata: { kind: "sprinkler", baseRadius },
  };
}

function createPlacementItem(
  itemId: string,
  variant: number,
): PlacementItem {
  return {
    instanceId: 7,
    itemId,
    x: 10,
    y: 20,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

const sprinklerCoverageCases = [
  { itemId: "object:599", variant: 0, expectedCount: 4, expectedBound: 1 },
  { itemId: "object:599", variant: 1, expectedCount: 8, expectedBound: 1 },
  { itemId: "object:599", variant: 2, expectedCount: 4, expectedBound: 1 },
  { itemId: "object:621", variant: 0, expectedCount: 8, expectedBound: 1 },
  { itemId: "object:621", variant: 1, expectedCount: 24, expectedBound: 2 },
  { itemId: "object:621", variant: 2, expectedCount: 8, expectedBound: 1 },
  { itemId: "object:645", variant: 0, expectedCount: 24, expectedBound: 2 },
  { itemId: "object:645", variant: 1, expectedCount: 48, expectedBound: 3 },
  { itemId: "object:645", variant: 2, expectedCount: 24, expectedBound: 2 },
] as const;

describe("sprinkler placement rendering", () => {
  it.each(sprinklerCoverageCases)(
    "returns $expectedCount exact coverage tiles for $itemId variant $variant without its center",
    ({ itemId, variant, expectedCount, expectedBound }) => {
      const coverageTiles = createSprinklerCoverageTiles(
        createPlacementItem(itemId, variant),
      );

      expect(coverageTiles).toHaveLength(expectedCount);
      expect(coverageTiles).not.toContainEqual({ x: 10, y: 20 });
      expect(
        new Set(coverageTiles?.map(({ x, y }) => `${String(x)},${String(y)}`)),
      ).toHaveProperty("size", expectedCount);
      expect(
        coverageTiles?.every(
          ({ x, y }) =>
            Math.abs(x - 10) <= expectedBound
            && Math.abs(y - 20) <= expectedBound,
        ),
      ).toBe(true);
    },
  );

  it.each([0, 2])(
    "keeps radius-zero variant %i coverage ordered north, south, west, east",
    (variant) => {
      expect(
        createSprinklerCoverageTiles(
          createPlacementItem("object:599", variant),
        ),
      ).toEqual([
        { x: 10, y: 19 },
        { x: 10, y: 21 },
        { x: 9, y: 20 },
        { x: 11, y: 20 },
      ]);
    },
  );

  it("returns no sprinkler behavior for an ordinary object", () => {
    const placementItem = createPlacementItem("object:600", 0);
    const catalogItem = createSprinklerCatalogItem("object:600", 1);
    const ordinaryCatalogItem = {
      ...catalogItem,
      renderingMetadata: undefined,
    };

    expect(createSprinklerCoverageTiles(placementItem)).toBeNull();
    expect(
      createSprinklerAttachmentRenderLayer(ordinaryCatalogItem, placementItem),
    ).toBeNull();
  });

  it("returns exact Pressure and Enricher attachment layers while Base has none", () => {
    const catalogItem = createSprinklerCatalogItem("object:621", 1);

    expect(
      createSprinklerAttachmentRenderLayer(
        catalogItem,
        createPlacementItem("object:621", 0),
      ),
    ).toBeNull();
    expect(
      createSprinklerAttachmentRenderLayer(
        catalogItem,
        createPlacementItem("object:621", 1),
      ),
    ).toEqual({
      frame: { x: 64, y: 608, width: 16, height: 16 },
      pixelGeometry: {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: 160,
        positionY: 320,
      },
      textureLocalPath:
        "/game-assets/1.6.15/tilesheets/springobjects.png",
    });
    expect(
      createSprinklerAttachmentRenderLayer(
        catalogItem,
        createPlacementItem("object:621", 2),
      ),
    ).toEqual({
      frame: { x: 32, y: 608, width: 16, height: 16 },
      pixelGeometry: {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: 160,
        positionY: 315,
      },
      textureLocalPath:
        "/game-assets/1.6.15/tilesheets/springobjects.png",
    });
  });

  it("rejects an invalid sprinkler variant with the exact received value", () => {
    expect(() =>
      createSprinklerCoverageTiles(createPlacementItem("object:599", 3)),
    ).toThrow(
      'Sprinkler placement item "object:599" variant must be an integer from 0 through 2; received 3.',
    );
  });

  it("rejects missing or mismatched metadata for an exact sprinkler ID", () => {
    const placementItem = createPlacementItem("object:621", 1);
    const missingMetadataCatalogItem = {
      ...createSprinklerCatalogItem("object:621", 1),
      renderingMetadata: undefined,
    };

    expect(() =>
      createSprinklerAttachmentRenderLayer(
        missingMetadataCatalogItem,
        placementItem,
      ),
    ).toThrow(
      'Sprinkler catalog item "object:621" requires rendering metadata {"kind":"sprinkler","baseRadius":1}; received undefined.',
    );
    expect(() =>
      createSprinklerAttachmentRenderLayer(
        createSprinklerCatalogItem("object:621", 2),
        placementItem,
      ),
    ).toThrow(
      'Sprinkler catalog item "object:621" requires rendering metadata {"kind":"sprinkler","baseRadius":1}; received {"kind":"sprinkler","baseRadius":2}.',
    );
  });

  it("rejects sprinkler metadata attached to a non-sprinkler exact ID", () => {
    expect(() =>
      createSprinklerAttachmentRenderLayer(
        createSprinklerCatalogItem("object:600", 1),
        createPlacementItem("object:600", 0),
      ),
    ).toThrow(
      'Catalog item "object:600" cannot use sprinkler rendering metadata; received {"kind":"sprinkler","baseRadius":1}.',
    );
  });

  it("rejects a catalog and placement item exact-ID mismatch", () => {
    expect(() =>
      createSprinklerAttachmentRenderLayer(
        createSprinklerCatalogItem("object:621", 1),
        createPlacementItem("object:599", 1),
      ),
    ).toThrow(
      'Sprinkler placement item ID "object:599" does not match catalog item ID "object:621".',
    );
  });
});
