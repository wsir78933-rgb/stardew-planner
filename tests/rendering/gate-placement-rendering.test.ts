import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import { createGatePlacementRenderLayers } from "../../src/rendering/gate-placement-rendering";

function item(itemId: string, x: number, y: number): PlacementItem { return { instanceId: x * 10 + y + 10, itemId, x, y, layer: "fence", rotation: 0, footprint: { width: 1, height: 1 }, variant: 0, tintColor: "#ffffff", locked: false, isRug: false, isGrass: false, isTable: false, isLongTable: false, flipped: false, bedType: null }; }
const gateCatalog: CatalogItem = { id: "object:325", name: "Gate", category: "fence", tileSize: { width: 1, height: 1 }, textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png", sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 352 }, allowedTools: ["cursor", "multi-select", "erase"], renderingMetadata: { kind: "gate", textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png" } };

describe("gate placement rendering", () => {
  it("uses only cardinal ordinary fences and emits frozen east-west frame", () => {
    const gate = item("object:325", 5, 5);
    expect(createGatePlacementRenderLayers(gateCatalog, gate, [gate, item("fence:322", 4, 5), item("fence:324", 6, 5), item("object:325", 5, 6)])).toEqual([expect.objectContaining({ frame: { x: 0, y: 128, width: 24, height: 32 }, pixelGeometry: expect.objectContaining({ positionX: 76, positionY: 64 }) })]);
  });
  it("uses the frozen two-layer north-south sprite and default for disconnected gates", () => {
    const gate = item("object:325", 5, 5);
    expect(createGatePlacementRenderLayers(gateCatalog, gate, [gate, item("fence:298", 5, 4), item("fence:323", 5, 6)])).toHaveLength(2);
    expect(createGatePlacementRenderLayers(gateCatalog, gate, [gate])).toEqual([expect.objectContaining({ frame: { x: 32, y: 160, width: 16, height: 32 } })]);
  });
});
