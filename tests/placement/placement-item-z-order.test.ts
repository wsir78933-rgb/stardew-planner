import { describe, expect, it } from "vitest";
import { getPlacementItemZIndex } from "../../src/placement/placement-item-z-order";
import type { PlacementItem } from "../../src/placement/placement-snapshot";

function createPlacementItem(
  placementItem: Partial<PlacementItem> = {},
): PlacementItem {
  return {
    instanceId: 1,
    itemId: "object:390",
    x: 0,
    y: 0,
    layer: "item",
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
    ...placementItem,
  };
}

describe("getPlacementItemZIndex", () => {
  it("returns the frozen path, rug, and ordinary footprint-bottom z values", () => {
    expect(getPlacementItemZIndex(createPlacementItem({ layer: "path" }))).toBe(0.1);
    expect(
      getPlacementItemZIndex(
        createPlacementItem({
          itemId: "furniture_1451",
          isRug: true,
          footprint: { width: 3, height: 2 },
          y: 8,
        }),
      ),
    ).toBe(0.2);
    expect(
      getPlacementItemZIndex(
        createPlacementItem({ footprint: { width: 2, height: 2 }, y: 3 }),
      ),
    ).toBe(9);
  });

  it("fails fast with received invalid rug, layer, coordinate, and footprint values", () => {
    for (const [placementItem, expectedMessage] of [
      [
        createPlacementItem({ isRug: true, layer: "path" }),
        'rug must use layer "item"; received "path"',
      ],
      [
        { ...createPlacementItem(), isRug: "yes" },
        'isRug must be a boolean; received "yes"',
      ],
      [
        { ...createPlacementItem(), layer: "unknown" },
        'layer must be one of "item", "path", or "fence"; received "unknown"',
      ],
      [
        { ...createPlacementItem(), y: 1.5 },
        "y must be a safe integer; received 1.5",
      ],
      [
        { ...createPlacementItem(), footprint: { width: 1, height: 0 } },
        "footprint.height must be a positive safe integer; received 0",
      ],
    ] as const) {
      expect(() =>
        getPlacementItemZIndex(
          placementItem as unknown as PlacementItem,
        )
      ).toThrow(expectedMessage);
    }
  });
});

