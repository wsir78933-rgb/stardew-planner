import { expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import type { PlacementItem } from "../../src/placement/placement-snapshot";
import { createPaintableChestPlacementRenderLayers } from "../../src/rendering/paintable-chest-placement-rendering";

it("renders a chest body, lock, and lid", () => {
  const layers = createPaintableChestPlacementRenderLayers(
    createPaintableChestCatalogItem("130"),
    createPlacementItem("#ff0000"),
  );

  expect(layers).toEqual([
    expect.objectContaining({ frame: { x: 0, y: 672, width: 16, height: 32 }, pixelGeometry: expect.objectContaining({ positionX: 32, positionY: 32 }), shouldApplySelectionTint: false, tintColor: "#ff0000" }),
    expect.objectContaining({ frame: { x: 0, y: 725, width: 16, height: 11 }, pixelGeometry: expect.objectContaining({ positionX: 32, positionY: 53 }), shouldApplySelectionTint: false }),
    expect.objectContaining({ frame: { x: 0, y: 704, width: 16, height: 32 }, pixelGeometry: expect.objectContaining({ positionX: 32, positionY: 32 }), shouldApplySelectionTint: false }),
  ]);
});

it.each([
  ["130", 672, 704, 725],
  ["232", 928, 960, 981],
  ["BigChest", 1248, 1280, 1301],
  ["BigStoneChest", 1312, 1344, 1365],
])("uses the locked frames for %s", (recordId, bodyY, lidY, lockY) => {
  const layers = createPaintableChestPlacementRenderLayers(
    createPaintableChestCatalogItem(recordId),
    { ...createPlacementItem("#ffffff"), itemId: `big-craftable:${recordId}` },
  );

  expect(layers?.map((layer) => layer.frame.y)).toEqual([bodyY, lockY, lidY]);
  expect(layers?.[0]?.tintColor).toBe("#ffffff");
  expect(layers?.slice(1).every((layer) => layer.tintColor === undefined)).toBe(true);
});

it("does not compose an item outside the exact chest capability", () => {
  expect(createPaintableChestPlacementRenderLayers(
    { ...createPaintableChestCatalogItem("256"), paintableChest: undefined },
    { ...createPlacementItem("#ff0000"), itemId: "big-craftable:256" },
  )).toBeNull();
});

function createPaintableChestCatalogItem(recordId: string): CatalogItem {
  return { id: `big-craftable:${recordId}`, name: "Chest", category: "placeable", tileSize: { width: 1, height: 1 }, textureLocalPath: "/game-assets/1.6.15/sprites/Craftables.png", sprite: { kind: "sprite-index", index: 130 }, allowedTools: [], paintableChest: { kind: "paintable-chest" } };
}

function createPlacementItem(tintColor: string): PlacementItem {
  return { instanceId: 1, itemId: "big-craftable:130", layer: "item", x: 2, y: 3, rotation: 0, footprint: { width: 1, height: 1 }, variant: 0, tintColor, locked: false, isRug: false, isGrass: false, isTable: false, isLongTable: false, flipped: false, bedType: null };
}
