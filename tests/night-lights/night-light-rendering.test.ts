import { describe, expect, it } from "vitest";
import { createNightLightRenderDescriptors } from "../../src/night-lights/night-light-rendering";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

function createLightPlacementSnapshot(
  itemId: string,
  nightLightState?: "off",
  variant = 0,
  footprintWidth = 2,
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
        footprint: { width: footprintWidth, height: 1 },
        variant,
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

const catalogItemsWithLitBigCraftable = [
  {
    id: "big-craftable:146",
    nightLight: { radiusInTiles: 5, color: 0xffe3a0 },
    renderingMetadata: {
      kind: "lit-big-craftable" as const,
      flameLayers: [
        { offsetX: 3, offsetY: -2, scale: 0.75, timeOffsetMilliseconds: 0 },
        { offsetX: 5, offsetY: 0, scale: 0.75, timeOffsetMilliseconds: 137 },
        { offsetX: 3, offsetY: 3, scale: 0.75, timeOffsetMilliseconds: 274 },
      ],
    },
  },
] as const;

const catalogItemsWithFurnitureFire = [
  {
    id: "furniture_1792",
    furnitureFire: { kind: "fireplace" as const },
    nightLight: { radiusInTiles: 10, color: 0xffe3a0 },
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

  it("suppresses the exact BigCraftable night light only for its Unlit variant", () => {
    expect(
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithLitBigCraftable,
        isNightMode: true,
        placementSnapshot: createLightPlacementSnapshot(
          "big-craftable:146",
          undefined,
          1,
          1,
        ),
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual([]);
    expect(
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithLitBigCraftable,
        isNightMode: true,
        placementSnapshot: createLightPlacementSnapshot(
          "big-craftable:146",
          undefined,
          0,
          1,
        ),
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual([
      {
        centerX: 40,
        centerY: 56,
        color: 0xffe3a0,
        radiusInPixels: 80,
      },
    ]);
  });

  it("suppresses a frozen furniture fire only for variant one", () => {
    expect(
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithFurnitureFire,
        isNightMode: true,
        placementSnapshot: createLightPlacementSnapshot("furniture_1792", undefined, 1),
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual([]);
    expect(
      createNightLightRenderDescriptors({
        catalogItems: catalogItemsWithFurnitureFire,
        isNightMode: true,
        placementSnapshot: createLightPlacementSnapshot("furniture_1792", undefined, 2),
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual([
      {
        centerX: 48,
        centerY: 56,
        color: 0xffe3a0,
        radiusInPixels: 160,
      },
    ]);
  });
});
