import { describe, expect, it } from "vitest";
import type { CatalogItem } from "../../src/catalog";
import type { PlacementSnapshot } from "../../src/placement/placement-snapshot";
import { createDaytimeWindowOverlayDescriptors } from "../../src/rendering/daytime-window-overlay-rendering";

function createWindowCatalogItem(recordId: string): CatalogItem {
  return {
    id: `furniture_${recordId}`,
    name: `Window ${recordId}`,
    category: "decor",
    tileSize: { width: 1, height: 2 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
    allowedTools: ["cursor"],
    renderingMetadata: {
      kind: "furniture",
      furnitureType: "window",
      indoors: true,
      outdoors: false,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: true,
      isWindow: true,
      isRug: false,
      isTable: false,
      isLongTable: false,
      bedType: null,
      compositeSprite: null,
    },
  };
}

function createBoardedWindowCatalogItem(): CatalogItem {
  return {
    ...createWindowCatalogItem("BoardedWindow"),
    id: "furniture_1630",
    renderingMetadata: {
      kind: "furniture",
      furnitureType: "painting",
      indoors: true,
      outdoors: false,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: true,
      isRug: false,
      isTable: false,
      isLongTable: false,
      bedType: null,
      compositeSprite: null,
    },
  };
}

function createPlacementSnapshot(itemIds: readonly string[]): PlacementSnapshot {
  return {
    buildings: [],
    crops: [],
    items: itemIds.map((itemId, index) => ({
      instanceId: index + 1,
      itemId,
      layer: "item" as const,
      x: index + 2,
      y: index + 4,
      rotation: 0,
      footprint: { width: 1, height: 2 },
      variant: 0,
      tintColor: "#ffffff",
      locked: false,
      isRug: false,
      isGrass: false,
      isTable: false,
      isLongTable: false,
      flipped: false,
      bedType: null,
    })),
    nextBuildingId: 1,
    nextItemId: itemIds.length + 1,
  };
}

describe("daytime window overlay rendering", () => {
  it("creates the locked cursor overlay for every catalog item marked isWindow during daytime", () => {
    const catalogItems = ["1614", "1616", "1673", "1678", "1682", "1749", "TriangleWindow"]
      .map(createWindowCatalogItem);

    expect(createDaytimeWindowOverlayDescriptors({
      catalogItems,
      isDaytime: true,
      placementSnapshot: createPlacementSnapshot(catalogItems.map((catalogItem) => catalogItem.id)),
    })).toEqual(catalogItems.map((catalogItem, index) => ({
      frame: { x: 21, y: 1695, width: 41, height: 67 },
      itemInstanceId: index + 1,
      pixelGeometry: {
        anchorX: 4.75 / 41,
        anchorY: 5.5 / 67,
        horizontalScale: 1,
        positionX: (index + 2) * 16 - 8,
        positionY: (index + 4) * 16,
      },
      textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
    })));
  });

  it("omits every window at night", () => {
    const windowCatalogItem = createWindowCatalogItem("1614");

    expect(createDaytimeWindowOverlayDescriptors({
      catalogItems: [windowCatalogItem],
      isDaytime: false,
      placementSnapshot: createPlacementSnapshot([windowCatalogItem.id]),
    })).toEqual([]);
  });

  it("does not give Boarded Window daytime light because it is a painting, not isWindow", () => {
    const boardedWindowCatalogItem = createBoardedWindowCatalogItem();

    expect(createDaytimeWindowOverlayDescriptors({
      catalogItems: [boardedWindowCatalogItem],
      isDaytime: true,
      placementSnapshot: createPlacementSnapshot([boardedWindowCatalogItem.id]),
    })).toEqual([]);
  });

  it("fails fast for duplicate catalog item IDs", () => {
    const windowCatalogItem = createWindowCatalogItem("1614");

    expect(() => createDaytimeWindowOverlayDescriptors({
      catalogItems: [windowCatalogItem, windowCatalogItem],
      isDaytime: true,
      placementSnapshot: createPlacementSnapshot([windowCatalogItem.id]),
    })).toThrow('Daytime window catalog items must not contain duplicate id "furniture_1614".');
  });

  it("fails fast for furniture window metadata that disagrees with its Type", () => {
    const windowCatalogItem = createWindowCatalogItem("1614");
    const windowRenderingMetadata = windowCatalogItem.renderingMetadata;

    if (windowRenderingMetadata?.kind !== "furniture") {
      throw new Error("Expected furniture window rendering metadata.");
    }
    const { isWindow: ignoredIsWindow, ...windowMetadataWithoutIsWindow } =
      windowRenderingMetadata;
    void ignoredIsWindow;

    expect(() => createDaytimeWindowOverlayDescriptors({
      catalogItems: [{
        ...windowCatalogItem,
        renderingMetadata: windowMetadataWithoutIsWindow,
      }],
      isDaytime: true,
      placementSnapshot: createPlacementSnapshot([windowCatalogItem.id]),
    })).toThrow(
      'Daytime window catalog item "furniture_1614" furniture Type "window" requires isWindow true; received undefined.',
    );
  });
});
