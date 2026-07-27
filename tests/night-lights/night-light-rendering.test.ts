import { describe, expect, it } from "vitest";
import { createNightLightRenderDescriptors } from "../../src/night-lights/night-light-rendering";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

function createLightPlacementSnapshot(
  itemId: string,
  nightLightState?: "off",
) {
  return {
    ...createEmptyPlacementSnapshot(),
    items: [
      {
        instanceId: 1,
        itemId,
        x: 2,
        y: 3,
        layer: "item" as const,
        rotation: 0,
        footprint: { width: 2, height: 1 },
        variant: 0,
        tintColor: "#ffffff",
        locked: false,
        isRug: false,
        isGrass: false,
        isTable: false,
        isLongTable: false,
        flipped: false,
        bedType: null,
        ...(nightLightState === undefined ? {} : { nightLightState }),
      },
    ],
    nextItemId: 2,
  };
}

const catalogItemsWithTorch = [
  {
    id: "object:93",
    nightLight: { radiusInTiles: 4, color: 0xffe3a0 },
  },
] as const;

describe("night light rendering", () => {
  it("creates a centered pixel descriptor for a lit catalog-derived light", () => {
    expect(
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithTorch,
        isNightMode: true,
        placementSnapshot: createLightPlacementSnapshot("object:93"),
        tileHeight: 20,
        tileWidth: 16,
      }),
    ).toEqual([
      {
        centerX: 48,
        centerY: 70,
        color: 0xffe3a0,
        radiusInPixels: 80,
      },
    ]);
  });

  it("omits off states, unknown catalog IDs, and daytime descriptors", () => {
    expect(
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithTorch,
        isNightMode: true,
        placementSnapshot: createLightPlacementSnapshot("object:93", "off"),
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual([]);
    expect(
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithTorch,
        isNightMode: true,
        placementSnapshot: createLightPlacementSnapshot("object:999"),
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual([]);
    expect(
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithTorch,
        isNightMode: false,
        placementSnapshot: createLightPlacementSnapshot("object:93"),
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual([]);
  });

  it("rejects a catalog light with an invalid rendering radius", () => {
    expect(() =>
      createNightLightRenderDescriptors({
        catalogItems: [
          {
            id: "object:93",
            nightLight: { radiusInTiles: 0, color: 0xffe3a0 },
          },
        ],
        isNightMode: true,
        placementSnapshot: createLightPlacementSnapshot("object:93"),
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toThrow(
      'Night-light catalog item "object:93" radiusInTiles must be a positive finite number; received 0.',
    );
  });

  it("rejects an invalid persisted light state even when Night Mode is off", () => {
    const placementSnapshotWithInvalidLightState = createLightPlacementSnapshot(
      "object:93",
    );
    Object.assign(placementSnapshotWithInvalidLightState.items[0], {
      nightLightState: "lit",
    });

    expect(() =>
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithTorch,
        isNightMode: false,
        placementSnapshot: placementSnapshotWithInvalidLightState,
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toThrow(
      'Placement snapshot field "items[0].nightLightState" must equal "off"; received "lit".',
    );
  });
});
