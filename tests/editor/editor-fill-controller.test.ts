import { describe, expect, it } from "vitest";
import type {
  BuildingPlacementMetadataById,
  CatalogItem,
} from "../../src/catalog";
import {
  applyEditorFill,
} from "../../src/editor/editor-fill-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import { createPlacementHistory } from "../../src/placement/placement-history";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

function createCatalogItem(
  catalogItem: Partial<CatalogItem> & Pick<CatalogItem, "id" | "category">,
): CatalogItem {
  return {
    name: catalogItem.id,
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/test.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor", "fill"],
    ...catalogItem,
  };
}

function createPlacementGrid(width: number, height: number): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: true,
      diggable: true,
      passable: true,
      treePlantable: false,
      treePlantableOnDirt: false,
      wall: false,
      crabPot: false,
    })),
  };
}

function createBlockedPlacementGrid(width: number, height: number): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: false,
      diggable: false,
      passable: false,
      treePlantable: false,
      treePlantableOnDirt: false,
      wall: false,
      crabPot: false,
    })),
  };
}

function createNonDiggablePassableGrid(width: number, height: number): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: true,
      diggable: false,
      passable: true,
      treePlantable: false,
      treePlantableOnDirt: false,
      wall: false,
      crabPot: false,
    })),
  };
}

function createHoeDirtCatalogItem(): CatalogItem {
  return createCatalogItem({
    id: "hoedirt",
    category: "floor",
    renderingMetadata: {
      kind: "hoe-dirt",
      seasonalTextureLocalPaths: {
        spring: "/game-assets/1.6.15/terrain/hoeDirt.png",
        summer: "/game-assets/1.6.15/terrain/hoeDirt.png",
        fall: "/game-assets/1.6.15/terrain/hoeDirt.png",
        winter: "/game-assets/1.6.15/terrain/hoeDirtSnow.png",
      },
    },
    presentationCapabilities: {
      canFlip: false,
      rotation: null,
      variantCycle: { count: 2, family: "generic" },
      visibleVariants: [
        {
          label: "Dry",
          renderDescriptor: { kind: "variant-index", variant: 0 },
          value: 0,
        },
        {
          label: "Watered",
          renderDescriptor: { kind: "variant-index", variant: 1 },
          value: 1,
        },
      ],
    },
  });
}

function createFreeCactusCatalogItem(): CatalogItem {
  return createCatalogItem({
    id: "furniture_FreeCactus",
    category: "placeable",
    textureLocalPath: "/game-assets/1.6.15/tilesheets/FreeCactuses.png",
    sprite: { kind: "source-rect", x: 0, y: 96, width: 16, height: 16 },
    renderingMetadata: {
      kind: "furniture",
      furnitureType: "randomized_plant",
      indoors: true,
      outdoors: true,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: false,
      isRug: false,
      isTable: false,
      isLongTable: false,
      bedType: null,
      compositeSprite: {
        layers: [
          { baseY: 96, count: 16, offsetY: 0 },
          { baseY: 48, count: 24, offsetY: -8 },
          { baseY: 0, count: 24, offsetY: -24 },
        ],
        pieceSize: 16,
        columns: 8,
      },
    },
  });
}

function createBedCatalogItem(
  bedType: "single" | "double" | "child",
): CatalogItem {
  const width = bedType === "double" ? 3 : 2;
  const furnitureType = bedType === "single"
    ? "bed"
    : bedType === "double"
    ? "bed double"
    : "bed child";

  return createCatalogItem({
    id: `furniture_test_${bedType}_bed`,
    category: "placeable",
    tileSize: { width, height: 3 },
    sprite: { kind: "source-rect", x: 0, y: 0, width: width * 16, height: 64 },
    allowedTools: ["cursor", "multi-select", "fill", "erase"],
    presentationCapabilities: {
      canFlip: false,
      rotation: {
        count: 1,
        footprints: [{ width, height: 3 }],
      },
      variantCycle: null,
      visibleVariants: [],
    },
    renderingMetadata: {
      kind: "furniture",
      furnitureType,
      indoors: true,
      outdoors: false,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: false,
      isRug: false,
      isTable: false,
      isLongTable: false,
      bedType,
      compositeSprite: null,
    },
  });
}

function createBuildingMetadataById(): BuildingPlacementMetadataById {
  return {};
}

describe("applyEditorFill", () => {
  it("fills a floor rectangle atomically as one undoable history entry", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    const fillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: createPlacementGrid(2, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 4 });
    expect(fillResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 0, y: 0 }),
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 1, y: 0 }),
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 0, y: 1 }),
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 1, y: 1 }),
    ]);
  });

  it("fills HoeDirt only across diggable tiles and keeps ordinary floor behavior unchanged", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const hoeDirtResult = applyEditorFill({
      selectedCatalogItem: createHoeDirtCatalogItem(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 1 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: createNonDiggablePassableGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });
    const ordinaryFloorResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: createNonDiggablePassableGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(hoeDirtResult).toMatchObject({
      applied: false,
      placementHistory,
      validation: { valid: false, reason: "not-diggable", tile: { x: 0, y: 0 } },
    });
    expect(ordinaryFloorResult).toMatchObject({
      applied: true,
      placedTileCount: 2,
    });
  });

  it("preserves the selected HoeDirt variant across one atomic fill", () => {
    const fillResult = applyEditorFill({
      selectedCatalogItem: createHoeDirtCatalogItem(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 1 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: createPlacementGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ itemId: "hoedirt", layer: "path", variant: 1 }),
      expect.objectContaining({ itemId: "hoedirt", layer: "path", variant: 1 }),
    ]);
  });

  it("samples three independent FreeCactus layers for every valid fill tile", () => {
    const sampledFractions = [
      0, 0, 0,
      15 / 16, 23 / 24, 23 / 24,
    ];
    let sampleIndex = 0;
    const fillResult = applyEditorFill({
      selectedCatalogItem: createFreeCactusCatalogItem(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: createPlacementGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
      randomFractionSource: () => sampledFractions[sampleIndex++]!,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        itemId: "furniture_FreeCactus",
        variant: 0,
        x: 0,
      }),
      expect.objectContaining({
        itemId: "furniture_FreeCactus",
        variant: 9215,
        x: 1,
      }),
    ]);
    expect(sampleIndex).toBe(6);
  });

  it("does not sample a rejected FreeCactus fill tile", () => {
    const validPlacementGrid = createPlacementGrid(2, 1);
    const placementGrid: MapPlacementGrid = {
      ...validPlacementGrid,
      capabilitiesByTile: validPlacementGrid.capabilitiesByTile.map(
        (tileCapabilities, tileIndex) => ({
          ...tileCapabilities,
          passable: tileIndex === 1 ? false : tileCapabilities.passable,
        }),
      ),
    };
    let sampledFractionCount = 0;
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillResult = applyEditorFill({
      selectedCatalogItem: createFreeCactusCatalogItem(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: placementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
      randomFractionSource: () => {
        sampledFractionCount += 1;
        return 0;
      },
    });

    expect(fillResult).toMatchObject({
      applied: false,
      placementHistory,
      validation: { valid: false, reason: "not-passable", tile: { x: 1, y: 0 } },
    });
    expect(sampledFractionCount).toBe(3);
  });

  it("fills only a fence perimeter and keeps the source history unchanged when any tile is invalid", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fenceResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "fence:322", category: "fence" }),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 2, y: 2 },
      mapPlacementGrid: createPlacementGrid(3, 3),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fenceResult).toMatchObject({ applied: true, placedTileCount: 8 });
    expect(fenceResult.placementHistory.currentState.items).not.toContainEqual(
      expect.objectContaining({ x: 1, y: 1 }),
    );

    const invalidFillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 3, y: 0 },
      mapPlacementGrid: createPlacementGrid(3, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(invalidFillResult).toMatchObject({
      applied: false,
      placementHistory,
      validation: { valid: false, reason: "outside-map", tile: { x: 3, y: 0 } },
    });
  });

  it("fills a complete standard farm-sized rectangle instead of rejecting a valid 5,200-tile gesture", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    const fillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 79, y: 64 },
      mapPlacementGrid: createPlacementGrid(80, 65),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 5200 });
    expect(fillResult.placementHistory.currentState.items).toHaveLength(5200);
  });

  it("uses the enabled free-placement preference for every tile in a fill", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    const fillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      freePlacement: true,
      mapPlacementGrid: createBlockedPlacementGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
  });

  it("propagates one validated choice to every filled item", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const controlledFloorItem = createCatalogItem({
      id: "floor:1",
      category: "floor",
      presentationCapabilities: {
        canFlip: true,
        rotation: {
          count: 2,
          footprints: [
            { width: 1, height: 1 },
            { width: 1, height: 1 },
          ],
        },
        variantCycle: { count: 2, family: "generic" },
        visibleVariants: [
          createVisibleVariant(0, "Base"),
          createVisibleVariant(1, "Alternate"),
        ],
      },
    });
    const fillResult = applyEditorFill({
      selectedCatalogItem: controlledFloorItem,
      catalogPresentationChoice: { flipped: true, rotation: 1, variant: 1 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        flipped: true,
        footprint: { width: 1, height: 1 },
        rotation: 1,
        variant: 1,
      }),
      expect.objectContaining({
        flipped: true,
        footprint: { width: 1, height: 1 },
        rotation: 1,
        variant: 1,
      }),
    ]);

    expect(() => applyEditorFill({
      selectedCatalogItem: controlledFloorItem,
      catalogPresentationChoice: { flipped: true, rotation: 2, variant: 1 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 0, y: 0 },
      mapPlacementGrid: createPlacementGrid(1, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    })).toThrow(/floor:1.*2/s);
  });

  it("tiles complete bed footprints with accurate bedType as one undoable Fill", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillResult = applyEditorFill({
      selectedCatalogItem: createBedCatalogItem("single"),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 3, y: 2 },
      mapPlacementGrid: createPlacementGrid(4, 3),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        bedType: "single",
        footprint: { width: 2, height: 3 },
        x: 0,
        y: 0,
      }),
      expect.objectContaining({
        bedType: "single",
        footprint: { width: 2, height: 3 },
        x: 2,
        y: 0,
      }),
    ]);
    expect(fillResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(fillResult.placementHistory.redoStates).toEqual([]);
  });

  it("tiles giant crop item footprints without creating ordinary crop records", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const giantCrop = createCatalogItem({
      id: "crop:giant_Cauliflower",
      category: "crop",
      tileSize: { width: 3, height: 3 },
    });

    const fillResult = applyEditorFill({
      selectedCatalogItem: giantCrop,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 5, y: 2 },
      mapPlacementGrid: createPlacementGrid(6, 3),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState).toMatchObject({
      crops: [],
      items: [
        expect.objectContaining({
          itemId: giantCrop.id,
          footprint: { width: 3, height: 3 },
          x: 0,
          y: 0,
        }),
        expect.objectContaining({
          itemId: giantCrop.id,
          footprint: { width: 3, height: 3 },
          x: 3,
          y: 0,
        }),
      ],
      nextItemId: 3,
    });
  });

  it("places zero beds and preserves history when Fill contains no complete footprint", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillResult = applyEditorFill({
      selectedCatalogItem: createBedCatalogItem("double"),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 2, y: 2 },
      secondTile: { x: 3, y: 3 },
      mapPlacementGrid: createPlacementGrid(8, 8),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toEqual({
      applied: true,
      placedTileCount: 0,
      placementHistory,
    });
    expect(fillResult.placementHistory.currentState).toBe(
      placementHistory.currentState,
    );
    expect(fillResult.placementHistory.undoStates).toEqual([]);
    expect(fillResult.placementHistory.redoStates).toEqual([]);
  });

  it("skips rejected bed candidates while validating accepted candidates in fill order", () => {
    const existingSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          instanceId: 1,
          itemId: "object:blocker",
          x: 3,
          y: 1,
          layer: "item" as const,
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
        },
      ],
      nextItemId: 2,
    };
    const placementHistory = createPlacementHistory(existingSnapshot);
    const fillResult = applyEditorFill({
      selectedCatalogItem: createBedCatalogItem("double"),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 5, y: 2 },
      mapPlacementGrid: createPlacementGrid(6, 3),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      existingSnapshot.items[0],
      expect.objectContaining({
        bedType: "double",
        footprint: { width: 3, height: 3 },
        x: 0,
        y: 0,
      }),
    ]);
    expect(fillResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
  });

  it("returns the first rejection without history when every bed candidate is blocked", () => {
    const existingSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          instanceId: 1,
          itemId: "object:blocker",
          x: 1,
          y: 1,
          layer: "item" as const,
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
        },
      ],
      nextItemId: 2,
    };
    const placementHistory = createPlacementHistory(existingSnapshot);
    const fillResult = applyEditorFill({
      selectedCatalogItem: createBedCatalogItem("double"),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 2, y: 2 },
      mapPlacementGrid: createPlacementGrid(6, 6),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toEqual({
      applied: false,
      placementHistory,
      validation: {
        reason: "occupied-by-item",
        tile: { x: 1, y: 1 },
        valid: false,
      },
    });
    expect(fillResult.placementHistory.currentState).toBe(
      placementHistory.currentState,
    );
    expect(fillResult.placementHistory.undoStates).toEqual([]);
  });
});

function createVisibleVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}
