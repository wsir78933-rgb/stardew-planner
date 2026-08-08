import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import { createObjectPlacementShadowRenderLayer } from "../../src/rendering/object-placement-shadow-rendering";

function createPlacementItem(itemId: string): PlacementItem {
  return {
    instanceId: 4,
    itemId,
    x: 3,
    y: 5,
    layer: "item",
    rotation: 2,
    footprint: { width: 1, height: 1 },
    variant: 2,
    tintColor: "#123456",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: true,
    bedType: null,
  };
}

function createShadowCatalogItem(itemId = "object:16"): CatalogItem {
  return {
    id: itemId,
    name: itemId,
    category: "placeable",
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "sprite-index", index: Number(itemId.split(":")[1]) },
    allowedTools: ["cursor", "multi-select", "erase"],
    placementShadow: {
      alpha: 0.5,
      textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
    },
  };
}

describe("object placement shadow rendering", () => {
  it("describes the frozen generic shadow without custom or selection tint", () => {
    expect(createObjectPlacementShadowRenderLayer(
      createShadowCatalogItem(),
      createPlacementItem("object:16"),
    )).toEqual({
      frame: null,
      opacity: 0.5,
      pixelGeometry: {
        anchorX: 0.5,
        anchorY: 0.5,
        horizontalScale: 1,
        positionX: 56,
        positionY: 93.75,
      },
      shouldApplySelectionTint: false,
      textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
    });
  });

  it("leaves an ordinary object shadow-free and rejects exact metadata misuse", () => {
    expect(createObjectPlacementShadowRenderLayer(
      { ...createShadowCatalogItem("object:17"), placementShadow: undefined },
      createPlacementItem("object:17"),
    )).toBeNull();
    expect(() => createObjectPlacementShadowRenderLayer(
      createShadowCatalogItem("object:17"),
      createPlacementItem("object:17"),
    )).toThrow('Object placement shadow catalog item "object:17" is not in the locked shadow ID set; received {"alpha":0.5,"textureLocalPath":"/game-assets/1.6.15/sprites/shadow.png"}.');
  });
});
