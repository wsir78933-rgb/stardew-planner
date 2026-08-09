import { describe, expect, it } from "vitest";
import * as editorSelectionControllerModule from "../../src/editor/editor-selection-controller";
import type {
  BuildingPlacementMetadataById,
  CatalogItem,
  CatalogPresentationCapabilities,
} from "../../src/catalog";
import {
  deleteSelectedPlacements,
  duplicateSelectedPlacementAtTile,
  getPlacementSelectionBounds,
  getPlacementSelectionSummary,
  getPlacementSelectionDetails,
  moveSelectedPlacements,
  cycleSelectedPlacementAppearance,
  setSelectedPlacementBuildingPaint,
  setSelectedPlacementBuildingWaterColor,
  setSelectedPlacementNightLightState,
  setSelectedPlacementItemTint,
  selectPlacementAtTile,
  selectPlacementByKey,
  selectPlacementsInRectangle,
} from "../../src/editor/editor-selection-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createPlacementHistory,
  redoPlacementHistory,
  type PlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
  type PlacementSnapshot,
} from "../../src/placement/placement-snapshot";

function createBuildingMetadataById(): BuildingPlacementMetadataById {
  return {
    Barn: {
      size: { width: 2, height: 2 },
      collisionMap: [
        [{ requiresBuildable: true }, { requiresBuildable: true }],
        [{ requiresBuildable: true }, { requiresBuildable: true }],
      ],
      additionalPlacementTiles: [],
      humanDoor: { x: -1, y: -1 },
      tilePropertyGrid: [],
    },
    "Fish Pond": {
      size: { width: 5, height: 5 },
      collisionMap: Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => ({ requiresBuildable: true }))
      ),
      additionalPlacementTiles: [],
      humanDoor: { x: -1, y: -1 },
      tilePropertyGrid: [],
    },
  };
}

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

function createTableWithHeldItem(
  parentFields: Partial<PlacementItem> = {},
): PlacementItem {
  return createPlacementItem({
    footprint: { width: 2, height: 2 },
    instanceId: 1,
    isTable: true,
    itemId: "furniture_724",
    x: 3,
    y: 4,
    heldItem: {
      bedType: null,
      flipped: true,
      footprint: { width: 1, height: 1 },
      instanceId: 7,
      isGrass: false,
      isLongTable: false,
      isRug: false,
      isTable: false,
      itemId: "furniture_0",
      layer: "item",
      locked: false,
      rotation: 1,
      tintColor: "#123456",
      variant: 2,
      x: 4,
      y: 5,
    },
    ...parentFields,
  });
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

function createWallPlacementGrid(
  width: number,
  height: number,
  wallTileKeys: readonly string[],
): MapPlacementGrid {
  const wallTileKeySet = new Set(wallTileKeys);

  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, (_unused, tileIndex) => {
      const x = tileIndex % width;
      const y = Math.floor(tileIndex / width);

      return {
        buildable: true,
        diggable: true,
        passable: true,
        treePlantable: false,
        treePlantableOnDirt: false,
        wall: wallTileKeySet.has(`${String(x)},${String(y)}`),
        crabPot: false,
      };
    }),
  };
}

const nightLightCatalogItems = [
  {
    id: "object:93",
    nightLight: { radiusInTiles: 4, color: 0xffe3a0 },
  },
] as const;

const fireplaceNightLightCatalogItems: readonly CatalogItem[] = [
  {
    allowedTools: ["cursor"],
    category: "placeable",
    id: "furniture_1792",
    furnitureFire: { kind: "fireplace" as const },
    name: "Brick Fireplace",
    nightLight: { radiusInTiles: 4, color: 0xffe3a0 },
    sprite: { kind: "source-rect", x: 0, y: 0, width: 32, height: 80 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
    tileSize: { width: 2, height: 1 },
  },
];

function createCatalogItem(
  itemId: string,
  presentationCapabilities?: CatalogPresentationCapabilities,
): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id: itemId,
    name: itemId,
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/test.png",
    tileSize: presentationCapabilities?.rotation?.footprints[0] ?? {
      width: 1,
      height: 1,
    },
    ...(presentationCapabilities === undefined
      ? {}
      : { presentationCapabilities }),
  };
}

function createWallMountedFurnitureCatalogItem(
  itemId: string,
  furnitureType: "painting" | "window" = "window",
): CatalogItem {
  return {
    ...createCatalogItem(itemId),
    renderingMetadata: {
      kind: "furniture",
      furnitureType,
      indoors: true,
      outdoors: false,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: true,
      ...(furnitureType === "window" ? { isWindow: true } : {}),
      isRug: false,
      isTable: false,
      isLongTable: false,
      bedType: null,
      compositeSprite: null,
    },
    tileSize: { width: 1, height: 2 },
  };
}

const twoVariantTreeCatalogItem = createCatalogItem("tree:test", {
  canFlip: false,
  rotation: null,
  variantCycle: { count: 2, family: "tree" },
  visibleVariants: [],
});

const threeVariantGenericCatalogItem = createCatalogItem("generic:test", {
  canFlip: false,
  rotation: null,
  variantCycle: { count: 3, family: "generic" },
  visibleVariants: [],
});

const fishPondCatalogItem: CatalogItem = {
  ...createCatalogItem("building:Fish Pond", {
    canFlip: false,
    rotation: null,
    variantCycle: { count: 4, family: "generic" },
    visibleVariants: [0, 1, 2, 3].map((variant) => ({
      label: ["Net 1", "Net 2", "Net 3", "None"][variant]!,
      renderDescriptor: { kind: "variant-index" as const, variant },
      value: variant,
    })),
  }),
  category: "building",
  renderingMetadata: {
    buildingId: "Fish Pond",
    kind: "building-multilayer",
    layers: [
      {
        frame: { kind: "source-rect", x: 0, y: 0, width: 80, height: 80 },
        id: "FishPondBase",
        offsetX: 0,
        offsetY: 0,
      },
    ],
    sortTileOffset: 4.5,
    waterColors: [{ label: "Default", value: 3_964_566 }],
  },
  tileSize: { width: 5, height: 5 },
};

const twoRotationCatalogItem = createCatalogItem("furniture:two", {
  canFlip: false,
  rotation: {
    count: 2,
    footprints: [
      { width: 2, height: 1 },
      { width: 1, height: 2 },
    ],
  },
  variantCycle: null,
  visibleVariants: [],
});

const heldItemRotationCatalogItem = createCatalogItem("furniture_0", {
  canFlip: false,
  rotation: {
    count: 2,
    footprints: [
      { width: 1, height: 1 },
      { width: 1, height: 1 },
    ],
  },
  variantCycle: null,
  visibleVariants: [],
});

const tableRotationCatalogItem = createCatalogItem("furniture_724", {
  canFlip: false,
  rotation: {
    count: 2,
    footprints: [
      { width: 2, height: 2 },
      { width: 1, height: 2 },
    ],
  },
  variantCycle: null,
  visibleVariants: [],
});

const twoRotationRugCatalogItem = createCatalogItem("furniture_1451", {
  canFlip: false,
  rotation: {
    count: 2,
    footprints: [
      { width: 2, height: 1 },
      { width: 1, height: 2 },
    ],
  },
  variantCycle: null,
  visibleVariants: [],
});

const doubleBedCatalogItem: CatalogItem = {
  ...createCatalogItem("furniture_test_double_bed", {
    canFlip: false,
    rotation: {
      count: 1,
      footprints: [{ width: 3, height: 3 }],
    },
    variantCycle: null,
    visibleVariants: [],
  }),
  allowedTools: ["cursor", "multi-select", "fill", "erase"],
  renderingMetadata: {
    kind: "furniture",
    furnitureType: "bed double",
    indoors: true,
    outdoors: false,
    rotationSprites: undefined,
    rotationTileSizes: undefined,
    wallMounted: false,
    isRug: false,
    isTable: false,
    isLongTable: false,
    bedType: "double",
    compositeSprite: null,
  },
  sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 64 },
  tileSize: { width: 3, height: 3 },
};

const fourRotationCatalogItem = createCatalogItem("furniture:four", {
  canFlip: false,
  rotation: {
    count: 4,
    footprints: [
      { width: 2, height: 1 },
      { width: 1, height: 2 },
      { width: 3, height: 1 },
      { width: 1, height: 3 },
    ],
  },
  variantCycle: null,
  visibleVariants: [],
});

function createAppearanceCycleInput(
  placementHistory: PlacementHistory<PlacementSnapshot>,
  catalogItems: readonly CatalogItem[],
  freePlacement = false,
) {
  return {
    buildingMetadataById: createBuildingMetadataById(),
    catalogItems,
    freePlacement,
    mapPlacementGrid: createPlacementGrid(8, 8),
    placementHistory,
    selectedPlacementKey: "item:1",
  };
}

describe("editor selection controller", () => {
  it("selects a table child above its parent across the parent footprint with stable item keys", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createTableWithHeldItem()],
      nextItemId: 8,
    };

    expect(selectPlacementsInRectangle({
      buildingMetadataById: createBuildingMetadataById(),
      firstTile: { x: 3, y: 4 },
      placementSnapshot,
      secondTile: { x: 4, y: 5 },
    })).toEqual(["item:1", "item:7"]);
    expect(selectPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      cursorTile: { x: 3, y: 4 },
      placementSnapshot,
    })).toBe("item:7");
    expect(selectPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      currentSelectionKey: "item:7",
      cursorTile: { x: 4, y: 5 },
      placementSnapshot,
    })).toBe("item:1");
    expect(getPlacementSelectionBounds({
      buildingMetadataById: createBuildingMetadataById(),
      placementSnapshot,
      selectedPlacementKeys: ["item:7"],
    })).toEqual({ minimumX: 3, minimumY: 4, maximumX: 4, maximumY: 5 });
  });

  it("filters locked table parents and children independently from synthetic rectangle membership", () => {
    const lockedChildTable = createTableWithHeldItem();
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          ...lockedChildTable,
          heldItem: { ...lockedChildTable.heldItem!, locked: true },
        },
        createTableWithHeldItem({
          instanceId: 2,
          locked: true,
          heldItem: { ...lockedChildTable.heldItem!, instanceId: 8 },
          x: 6,
        }),
      ],
      nextItemId: 9,
    };

    expect(selectPlacementsInRectangle({
      buildingMetadataById: createBuildingMetadataById(),
      firstTile: { x: 3, y: 4 },
      placementSnapshot,
      secondTile: { x: 7, y: 5 },
    })).toEqual(["item:1", "item:8"]);
  });

  it("deletes a selected table child without reusing its ID and normalizes a parent-child delete", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createTableWithHeldItem()],
      nextItemId: 8,
    });

    const childDeleteResult = deleteSelectedPlacements({
      placementHistory,
      selectedPlacementKeys: ["item:7"],
    });

    expect(childDeleteResult).toMatchObject({ applied: true });
    expect(childDeleteResult.placementHistory.currentState.items).toHaveLength(1);
    expect(childDeleteResult.placementHistory.currentState.items[0]).toMatchObject({
      instanceId: 1,
    });
    expect(childDeleteResult.placementHistory.currentState.items[0]?.heldItem)
      .toBeUndefined();
    expect(childDeleteResult.placementHistory.currentState.nextItemId).toBe(8);
    expect(childDeleteResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    const childDeleteUndo = undoPlacementHistory(childDeleteResult.placementHistory);
    expect(childDeleteUndo.currentState).toEqual(placementHistory.currentState);
    expect(redoPlacementHistory(childDeleteUndo).currentState).toEqual(
      childDeleteResult.placementHistory.currentState,
    );

    const parentAndChildDeleteResult = deleteSelectedPlacements({
      placementHistory,
      selectedPlacementKeys: ["item:1", "item:7"],
    });
    expect(parentAndChildDeleteResult).toMatchObject({ applied: true });
    expect(parentAndChildDeleteResult.placementHistory.currentState.items).toEqual([]);
    expect(parentAndChildDeleteResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
  });

  it("moves a selected table child by moving its parent once and resets the child origin", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createTableWithHeldItem()],
      nextItemId: 8,
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [tableRotationCatalogItem],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKeys: ["item:7"],
      tileDelta: { x: 1, y: 0 },
    });

    expect(moveResult).toMatchObject({
      applied: true,
      selectedPlacementKeys: ["item:7"],
    });
    expect(moveResult.placementHistory.currentState.items[0]).toMatchObject({
      instanceId: 1,
      x: 4,
      y: 4,
      heldItem: { instanceId: 7, x: 4, y: 4 },
    });
    expect(moveResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    const undoneHistory = undoPlacementHistory(moveResult.placementHistory);
    expect(undoneHistory.currentState).toEqual(placementHistory.currentState);
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      moveResult.placementHistory.currentState,
    );
  });

  it("normalizes a parent-child move and keeps a failed child move atomic", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createTableWithHeldItem()],
      nextItemId: 8,
    });

    const normalizedMoveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [tableRotationCatalogItem],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKeys: ["item:1", "item:7"],
      tileDelta: { x: 0, y: 1 },
    });

    expect(normalizedMoveResult).toMatchObject({
      applied: true,
      selectedPlacementKeys: ["item:1", "item:7"],
    });
    expect(normalizedMoveResult.placementHistory.currentState.items[0])
      .toMatchObject({
        instanceId: 1,
        x: 3,
        y: 5,
        heldItem: { instanceId: 7, x: 3, y: 5 },
      });
    expect(normalizedMoveResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);

    const failedMoveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [tableRotationCatalogItem],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKeys: ["item:7"],
      tileDelta: { x: 7, y: 0 },
    });
    expect(failedMoveResult).toMatchObject({ applied: false });
    expect(failedMoveResult.placementHistory).toBe(placementHistory);
    expect(placementHistory.undoStates).toEqual([]);
  });

  it("cycles a held child through legal 1x1 rotations without map collision", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createTableWithHeldItem()],
      nextItemId: 8,
    });

    const cycleResult = cycleSelectedPlacementAppearance({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [heldItemRotationCatalogItem],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKey: "item:7",
    });

    expect(cycleResult).toMatchObject({
      applied: true,
      selectedPlacementKey: "item:7",
    });
    expect(cycleResult.placementHistory.currentState.items[0]).toMatchObject({
      instanceId: 1,
      heldItem: {
        instanceId: 7,
        footprint: { width: 1, height: 1 },
        rotation: 0,
      },
    });
    expect(cycleResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
  });

  it("rejects a held child Q result larger than 1x1 without changing history", () => {
    const tableWithHeldItem = createTableWithHeldItem();
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [{
        ...tableWithHeldItem,
        heldItem: { ...tableWithHeldItem.heldItem!, rotation: 0 },
      }],
      nextItemId: 8,
    });
    const illegalHeldRotationCatalogItem = createCatalogItem("furniture_0", {
      canFlip: false,
      rotation: {
        count: 2,
        footprints: [
          { width: 1, height: 1 },
          { width: 2, height: 1 },
        ],
      },
      variantCycle: null,
      visibleVariants: [],
    });

    expect(getPlacementSelectionDetails({
      catalogItems: [illegalHeldRotationCatalogItem],
      placementSnapshot: placementHistory.currentState,
      selectedPlacementKey: "item:7",
    })).toMatchObject({
      canCycleAppearance: false,
      selectedPlacementKey: "item:7",
    });

    const cycleResult = cycleSelectedPlacementAppearance({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [illegalHeldRotationCatalogItem],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKey: "item:7",
    });

    expect(cycleResult).toEqual({
      applied: false,
      placementHistory,
      reason: "not-cycleable",
      selectedPlacementKey: "item:7",
    });
    expect(placementHistory.undoStates).toEqual([]);
  });

  it("cycles a parent with normal validation and relinks its child to the parent origin", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createTableWithHeldItem()],
      nextItemId: 8,
    });

    const cycleResult = cycleSelectedPlacementAppearance({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [tableRotationCatalogItem],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(cycleResult).toMatchObject({ applied: true });
    expect(cycleResult.placementHistory.currentState.items[0]).toMatchObject({
      footprint: { width: 1, height: 2 },
      instanceId: 1,
      rotation: 1,
      heldItem: { instanceId: 7, x: 3, y: 4 },
    });
    const undoneHistory = undoPlacementHistory(cycleResult.placementHistory);
    expect(undoneHistory.currentState).toEqual(placementHistory.currentState);
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      cycleResult.placementHistory.currentState,
    );
  });

  it("copies a parent without its child and copies a child as an ordinary top-level item", () => {
    const tableWithHeldItem = createTableWithHeldItem();
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [{
        ...tableWithHeldItem,
        heldItem: {
          ...tableWithHeldItem.heldItem!,
          nightLightState: "off" as const,
        },
      }],
      nextItemId: 8,
    });
    const sharedCopyInput = {
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [tableRotationCatalogItem, heldItemRotationCatalogItem],
      mapPlacementGrid: createPlacementGrid(12, 12),
      placementHistory,
    };

    const parentCopyResult = duplicateSelectedPlacementAtTile({
      ...sharedCopyInput,
      cursorTile: { x: 7, y: 4 },
      selectedPlacementKey: "item:1",
    });
    expect(parentCopyResult).toMatchObject({
      applied: true,
      selectedPlacementKey: "item:8",
    });
    expect(parentCopyResult.placementHistory.currentState.items[1]).toMatchObject({
      instanceId: 8,
      itemId: "furniture_724",
      x: 7,
      y: 4,
    });
    expect(parentCopyResult.placementHistory.currentState.items[1]?.heldItem)
      .toBeUndefined();

    const childCopyResult = duplicateSelectedPlacementAtTile({
      ...sharedCopyInput,
      cursorTile: { x: 0, y: 0 },
      selectedPlacementKey: "item:7",
    });
    expect(childCopyResult).toMatchObject({
      applied: true,
      selectedPlacementKey: "item:8",
    });
    expect(childCopyResult.placementHistory.currentState.items).toHaveLength(2);
    expect(childCopyResult.placementHistory.currentState.items[1]).toMatchObject({
      flipped: true,
      footprint: { width: 1, height: 1 },
      instanceId: 8,
      itemId: "furniture_0",
      nightLightState: "off",
      rotation: 1,
      tintColor: "#123456",
      variant: 2,
      x: 0,
      y: 0,
    });
    expect(childCopyResult.placementHistory.currentState.nextItemId).toBe(9);
    expect(childCopyResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);

    const failedChildCopyResult = duplicateSelectedPlacementAtTile({
      ...sharedCopyInput,
      cursorTile: { x: 3, y: 4 },
      selectedPlacementKey: "item:7",
    });
    expect(failedChildCopyResult).toMatchObject({ applied: false });
    expect(failedChildCopyResult.placementHistory).toBe(placementHistory);
  });

  it("reads and updates held-child tint through the public item identity", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createTableWithHeldItem()],
      nextItemId: 8,
    });

    expect(getPlacementSelectionDetails({
      catalogItems: [heldItemRotationCatalogItem],
      placementSnapshot: placementHistory.currentState,
      selectedPlacementKey: "item:7",
    })).toMatchObject({
      catalogItemId: "furniture_0",
      kind: "item",
      selectedPlacementKey: "item:7",
      tintColor: "#123456",
    });

    const tintResult = setSelectedPlacementItemTint({
      catalogItems: [{ ...heldItemRotationCatalogItem, paintableChest: { kind: "paintable-chest" } }],
      placementHistory,
      selectedPlacementKey: "item:7",
      tintColor: "#abcdef",
    });
    expect(tintResult.placementHistory.currentState.items[0]?.heldItem)
      .toMatchObject({ instanceId: 7, tintColor: "#abcdef" });
    expect(tintResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
  });

  it("updates a catalog-derived held-child night light in one history entry", () => {
    const tableWithHeldItem = createTableWithHeldItem();
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [{
        ...tableWithHeldItem,
        heldItem: {
          ...tableWithHeldItem.heldItem!,
          itemId: "object:93",
        },
      }],
      nextItemId: 8,
    });

    const nightLightResult = setSelectedPlacementNightLightState({
      catalogItems: nightLightCatalogItems,
      nightLightState: "off",
      placementHistory,
      selectedPlacementKey: "item:7",
    });

    expect(nightLightResult).toMatchObject({ applied: true });
    expect(nightLightResult.placementHistory.currentState.items[0]?.heldItem)
      .toMatchObject({ instanceId: 7, nightLightState: "off" });
    expect(nightLightResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
  });

  it("selects all intersecting unlocked placements with stable type-qualified keys", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 2, y: 2 }],
      crops: [{ cropId: "crop:24", x: 4, y: 4 }],
      items: [
        createPlacementItem({ instanceId: 1, x: 5, y: 5 }),
        createPlacementItem({ instanceId: 2, x: 5, y: 5, locked: true }),
      ],
      nextBuildingId: 2,
      nextItemId: 3,
    };

    expect(
      selectPlacementsInRectangle({
        buildingMetadataById: createBuildingMetadataById(),
        firstTile: { x: 3, y: 3 },
        placementSnapshot,
        secondTile: { x: 5, y: 5 },
      }),
    ).toEqual(["building:1", "crop:4,4", "item:1"]);
  });

  it("selects the visually highest unlocked placement at one map tile", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 2, y: 2 }],
      crops: [{ cropId: "crop:24", x: 3, y: 3 }],
      items: [
        createPlacementItem({ instanceId: 1, x: 3, y: 3 }),
        createPlacementItem({ instanceId: 2, x: 3, y: 3, locked: true }),
      ],
      nextBuildingId: 2,
      nextItemId: 3,
    };

    expect(
      selectPlacementAtTile({
        buildingMetadataById: createBuildingMetadataById(),
        cursorTile: { x: 3, y: 3 },
        placementSnapshot,
      }),
    ).toBe("item:1");
  });

  it("validates a direct placement key and keeps locked items unselected", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({ instanceId: 1 }),
        createPlacementItem({ instanceId: 2, locked: true }),
      ],
      nextItemId: 3,
    };

    expect(selectPlacementByKey({
      placementSnapshot,
      selectedPlacementKey: "item:1",
    })).toBe("item:1");
    expect(selectPlacementByKey({
      placementSnapshot,
      selectedPlacementKey: "item:2",
    })).toBeNull();
    expect(() => selectPlacementByKey({
      placementSnapshot,
      selectedPlacementKey: "item:999",
    })).toThrow(/item:999.*does not exist/);
  });

  it("selects the first unlocked key after locked direct-hit candidates", () => {
    const selectFirstSelectablePlacementKey = (
      editorSelectionControllerModule as typeof editorSelectionControllerModule & {
        selectFirstSelectablePlacementKey?: (input: Readonly<{
          placementSnapshot: PlacementSnapshot;
          placementSelectionKeys: readonly string[];
        }>) => string | null;
      }
    ).selectFirstSelectablePlacementKey;

    if (typeof selectFirstSelectablePlacementKey !== "function") {
      expect(selectFirstSelectablePlacementKey).toBeTypeOf("function");
      return;
    }

    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({ instanceId: 1 }),
        createPlacementItem({ instanceId: 2, locked: true }),
        createPlacementItem({ instanceId: 3, locked: true }),
      ],
      nextItemId: 4,
    };

    expect(selectFirstSelectablePlacementKey({
      placementSnapshot,
      placementSelectionKeys: ["item:2", "item:1"],
    })).toBe("item:1");
    expect(selectFirstSelectablePlacementKey({
      placementSnapshot,
      placementSelectionKeys: ["item:3", "item:2"],
    })).toBeNull();
  });

  it("selects a Garden Pot crop above its pot and cycles back to the pot", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 3, y: 3 }],
      items: [createPlacementItem({
        instanceId: 1,
        itemId: "big-craftable:62",
        x: 3,
        y: 3,
      })],
      nextItemId: 2,
    };
    const sharedSelectionInput = {
      buildingMetadataById: createBuildingMetadataById(),
      cursorTile: { x: 3, y: 3 },
      placementSnapshot,
    };

    expect(selectPlacementAtTile(sharedSelectionInput)).toBe("crop:3,3");
    expect(selectPlacementAtTile({
      ...sharedSelectionInput,
      currentSelectionKey: "crop:3,3",
    })).toBe("item:1");
  });

  it("selects a stored giant crop item from a non-origin footprint tile", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({
        footprint: { width: 3, height: 3 },
        instanceId: 1,
        itemId: "crop:giant_Cauliflower",
        x: 2,
        y: 1,
      })],
      nextItemId: 2,
    };

    expect(selectPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      cursorTile: { x: 4, y: 3 },
      placementSnapshot,
    })).toBe("item:1");
  });

  it("selects and cycles an ordinary item above an overlapping rug regardless of snapshot order", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({ instanceId: 1, x: 3, y: 3 }),
        createPlacementItem({
          instanceId: 2,
          itemId: "furniture_1451",
          footprint: { width: 3, height: 2 },
          isRug: true,
          x: 2,
          y: 2,
        }),
      ],
      nextItemId: 3,
    };
    const sharedSelectionInput = {
      buildingMetadataById: createBuildingMetadataById(),
      cursorTile: { x: 3, y: 3 },
      placementSnapshot,
    };

    expect(selectPlacementAtTile(sharedSelectionInput)).toBe("item:1");
    expect(
      selectPlacementAtTile({
        ...sharedSelectionInput,
        currentSelectionKey: "item:1",
      }),
    ).toBe("item:2");
    expect(
      selectPlacementAtTile({
        ...sharedSelectionInput,
        currentSelectionKey: "item:2",
      }),
    ).toBe("item:1");
  });

  it("cycles through overlapping unlocked placements and wraps at the last candidate", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 3, y: 3 }],
      items: [
        createPlacementItem({ instanceId: 1, x: 3, y: 3 }),
        createPlacementItem({ instanceId: 2, x: 3, y: 3 }),
      ],
      nextItemId: 3,
    };
    const sharedSelectionInput = {
      buildingMetadataById: createBuildingMetadataById(),
      cursorTile: { x: 3, y: 3 },
      placementSnapshot,
    };

    expect(selectPlacementAtTile(sharedSelectionInput)).toBe("item:2");
    expect(
      selectPlacementAtTile({
        ...sharedSelectionInput,
        currentSelectionKey: "item:2",
      }),
    ).toBe("item:1");
    expect(
      selectPlacementAtTile({
        ...sharedSelectionInput,
        currentSelectionKey: "item:1",
      }),
    ).toBe("crop:3,3");
    expect(
      selectPlacementAtTile({
        ...sharedSelectionInput,
        currentSelectionKey: "crop:3,3",
      }),
    ).toBe("item:2");
  });

  it("exposes an inspector-safe description for one selected placement", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          instanceId: 1,
          itemId: twoRotationCatalogItem.id,
        }),
      ],
      nextItemId: 2,
    };

    const placementSelectionDetails = getPlacementSelectionDetails({
      catalogItems: [twoRotationCatalogItem],
      placementSnapshot,
      selectedPlacementKey: "item:1",
    });

    expect(placementSelectionDetails).toEqual({
      catalogItemId: twoRotationCatalogItem.id,
      canCycleAppearance: true,
      kind: "item",
      nightLightState: undefined,
      selectedPlacementKey: "item:1",
      tintColor: "#ffffff",
    });
    expect(Object.hasOwn(placementSelectionDetails, "nightLightState")).toBe(
      true,
    );
  });

  it("cycles a selected Fish Pond from its normalized safe-integer variant", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [
        {
          instanceId: 1,
          buildingId: "Fish Pond",
          variant: -1,
          waterColor: 16_391_710,
          x: 1,
          y: 1,
        },
      ],
      nextBuildingId: 2,
    });
    const selectionDetails = getPlacementSelectionDetails({
      catalogItems: [fishPondCatalogItem],
      placementSnapshot: placementHistory.currentState,
      selectedPlacementKey: "building:1",
    });
    const cycleResult = cycleSelectedPlacementAppearance({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [fishPondCatalogItem],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKey: "building:1",
    });

    expect(selectionDetails).toMatchObject({
      canCycleAppearance: true,
      canSetWaterColor: true,
      waterColor: 16_391_710,
    });
    expect(cycleResult).toMatchObject({ applied: true });
    expect(cycleResult.placementHistory.currentState.buildings[0]).toEqual({
      instanceId: 1,
      buildingId: "Fish Pond",
      variant: 0,
      waterColor: 16_391_710,
      x: 1,
      y: 1,
    });
    expect(
      undoPlacementHistory(cycleResult.placementHistory).currentState.buildings[0],
    ).toMatchObject({ variant: -1, waterColor: 16_391_710 });
  });

  it("keeps opaque building appearance fields when Q is unsupported and through move and copy", () => {
    const ordinaryBuildingCatalogItem: CatalogItem = {
      ...createCatalogItem("building:Barn"),
      category: "building",
      tileSize: { width: 2, height: 2 },
    };
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [
        {
          instanceId: 1,
          buildingId: "Barn",
          variant: 99,
          waterColor: 42,
          x: 1,
          y: 1,
        },
      ],
      nextBuildingId: 2,
    });

    expect(cycleSelectedPlacementAppearance({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [ordinaryBuildingCatalogItem],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKey: "building:1",
    })).toEqual({
      applied: false,
      placementHistory,
      reason: "not-cycleable",
      selectedPlacementKey: "building:1",
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createCatalogItem("object:390")],
      mapPlacementGrid: createPlacementGrid(10, 10),
      placementHistory,
      selectedPlacementKeys: ["building:1"],
      tileDelta: { x: 1, y: 0 },
    });
    expect(moveResult).toMatchObject({ applied: true });
    expect(moveResult.placementHistory.currentState.buildings[0]).toMatchObject({
      variant: 99,
      waterColor: 42,
      x: 2,
    });

    const duplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      cursorTile: { x: 6, y: 6 },
      mapPlacementGrid: createPlacementGrid(12, 12),
      placementHistory: moveResult.placementHistory,
      selectedPlacementKey: "building:1",
    });
    expect(duplicateResult).toMatchObject({ applied: true });
    expect(duplicateResult.placementHistory.currentState.buildings[1]).toMatchObject({
      variant: 99,
      waterColor: 42,
      x: 6,
      y: 6,
    });
  });

  it("sets and removes selected Fish Pond water color through one history boundary", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [
        { instanceId: 1, buildingId: "Fish Pond", x: 1, y: 1 },
      ],
      nextBuildingId: 2,
    });
    const coloredResult = setSelectedPlacementBuildingWaterColor({
      catalogItems: [fishPondCatalogItem],
      placementHistory,
      selectedPlacementKey: "building:1",
      waterColor: 16_391_710,
    });
    const defaultResult = setSelectedPlacementBuildingWaterColor({
      catalogItems: [fishPondCatalogItem],
      placementHistory: coloredResult.placementHistory,
      selectedPlacementKey: "building:1",
      waterColor: undefined,
    });

    expect(coloredResult.placementHistory.currentState.buildings[0])
      .toMatchObject({ waterColor: 16_391_710 });
    expect(defaultResult.placementHistory.currentState.buildings[0])
      .not.toHaveProperty("waterColor");
    expect(defaultResult.placementHistory.undoStates).toHaveLength(2);
  });

  it("reports an empty validated selection as a zero-count summary", () => {
    expect(
      getPlacementSelectionSummary({
        placementSnapshot: createEmptyPlacementSnapshot(),
        selectedPlacementKeys: [],
      }),
    ).toEqual({ count: 0 });
  });

  it("reports the count for a mixed validated selection", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 2, y: 2 }],
      crops: [{ cropId: "crop:24", x: 4, y: 4 }],
      items: [createPlacementItem({ instanceId: 1, x: 5, y: 5 })],
      nextBuildingId: 2,
      nextItemId: 2,
    };

    expect(
      getPlacementSelectionSummary({
        placementSnapshot,
        selectedPlacementKeys: ["building:1", "crop:4,4", "item:1"],
      }),
    ).toEqual({ count: 3 });
  });

  it("rejects duplicate keys before reporting a selection summary", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1 })],
      nextItemId: 2,
    };

    expect(() =>
      getPlacementSelectionSummary({
        placementSnapshot,
        selectedPlacementKeys: ["item:1", "item:1"],
      }),
    ).toThrow('selectedPlacementKeys must not contain duplicates; received item:1,item:1');
  });

  it("rejects stale keys before reporting a selection summary", () => {
    expect(() =>
      getPlacementSelectionSummary({
        placementSnapshot: createEmptyPlacementSnapshot(),
        selectedPlacementKeys: ["item:999"],
      }),
    ).toThrow('selected placement key "item:999" does not exist');
  });

  it("deletes the selected placements in one history entry and rejects stale selection keys", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 2, y: 2 }],
      crops: [{ cropId: "crop:24", x: 4, y: 4 }],
      items: [createPlacementItem({ instanceId: 1, x: 5, y: 5 })],
      nextBuildingId: 2,
      nextItemId: 2,
    });

    const deleteResult = deleteSelectedPlacements({
      placementHistory,
      selectedPlacementKeys: ["building:1", "crop:4,4", "item:1"],
    });

    expect(deleteResult).toMatchObject({ applied: true });
    expect(deleteResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(deleteResult.placementHistory.currentState).toMatchObject({
      buildings: [],
      crops: [],
      items: [],
    });
    expect(() =>
      deleteSelectedPlacements({
        placementHistory,
        selectedPlacementKeys: ["item:999"],
      }),
    ).toThrow('selected placement key "item:999"');
  });

  it("moves a complete selection only when every moved placement remains valid", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 1, y: 1 }],
      crops: [{ cropId: "crop:24", x: 4, y: 4 }],
      items: [createPlacementItem({ instanceId: 1, x: 5, y: 5 })],
      nextBuildingId: 2,
      nextItemId: 2,
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createCatalogItem("object:390")],
      mapPlacementGrid: createPlacementGrid(12, 12),
      placementHistory,
      selectedPlacementKeys: ["building:1", "crop:4,4", "item:1"],
      tileDelta: { x: 2, y: 1 },
    });

    expect(moveResult).toMatchObject({ applied: true });
    expect(moveResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(moveResult.placementHistory.currentState).toMatchObject({
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 3, y: 2 }],
      crops: [{ cropId: "crop:24", x: 6, y: 5 }],
      items: [expect.objectContaining({ instanceId: 1, x: 7, y: 6 })],
    });
    expect(moveResult.selectedPlacementKeys).toEqual([
      "building:1",
      "crop:6,5",
      "item:1",
    ]);
  });

  it("moves a selected group one tile in a single history entry", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 1, y: 1 }],
      items: [createPlacementItem({ instanceId: 1, x: 3, y: 3 })],
      nextItemId: 2,
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createCatalogItem("object:390")],
      mapPlacementGrid: createPlacementGrid(8, 8),
      placementHistory,
      selectedPlacementKeys: ["crop:1,1", "item:1"],
      tileDelta: { x: 0, y: -1 },
    });

    expect(moveResult).toMatchObject({ applied: true });
    expect(moveResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(moveResult.placementHistory.currentState).toMatchObject({
      crops: [{ cropId: "crop:24", x: 1, y: 0 }],
      items: [expect.objectContaining({ instanceId: 1, x: 3, y: 2 })],
    });
    expect(moveResult.selectedPlacementKeys).toEqual(["crop:1,0", "item:1"]);
  });

  it("does not change the history when one selected placement would leave the map", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1, x: 4, y: 4 })],
      nextItemId: 2,
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createCatalogItem("object:390")],
      mapPlacementGrid: createPlacementGrid(5, 5),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    });

    expect(moveResult).toMatchObject({
      applied: false,
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      validation: { valid: false, reason: "outside-map", tile: { x: 5, y: 4 } },
    });
  });

  it("uses the enabled free-placement preference when moving a selected placement", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1, x: 4, y: 4 })],
      nextItemId: 2,
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createCatalogItem("object:390")],
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(5, 5),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    });

    expect(moveResult).toMatchObject({ applied: true });
    expect(moveResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ instanceId: 1, x: 5, y: 4 }),
    ]);
  });

  it("cycles tree and generic appearances through variants before rotation", () => {
    for (const catalogItem of [
      twoVariantTreeCatalogItem,
      threeVariantGenericCatalogItem,
    ]) {
      const placementHistory = createPlacementHistory({
        ...createEmptyPlacementSnapshot(),
        items: [
          createPlacementItem({
            footprint: { width: 3, height: 2 },
            instanceId: 1,
            itemId: catalogItem.id,
            rotation: 0,
            variant: 0,
          }),
        ],
        nextItemId: 2,
      });

      const cycleResult = cycleSelectedPlacementAppearance(
        createAppearanceCycleInput(placementHistory, [catalogItem]),
      );

      expect(cycleResult).toMatchObject({ applied: true });
      expect(cycleResult.placementHistory.currentState.items).toEqual([
        expect.objectContaining({
          footprint: { width: 3, height: 2 },
          instanceId: 1,
          rotation: 0,
          variant: 1,
        }),
      ]);
      expect(cycleResult.placementHistory.undoStates).toEqual([
        placementHistory.currentState,
      ]);
    }
  });

  it("prioritizes a variant transition when rotation is also available", () => {
    const variantAndRotationCatalogItem = createCatalogItem(
      "variant-and-rotation:test",
      {
        canFlip: false,
        rotation: {
          count: 2,
          footprints: [
            { width: 2, height: 1 },
            { width: 1, height: 2 },
          ],
        },
        variantCycle: { count: 2, family: "generic" },
        visibleVariants: [],
      },
    );
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          footprint: { width: 1, height: 2 },
          itemId: variantAndRotationCatalogItem.id,
          rotation: 1,
          variant: 0,
        }),
      ],
      nextItemId: 2,
    });

    const cycleResult = cycleSelectedPlacementAppearance(
      createAppearanceCycleInput(
        placementHistory,
        [variantAndRotationCatalogItem],
      ),
    );

    expect(cycleResult).toMatchObject({ applied: true });
    expect(cycleResult.placementHistory.currentState.items[0]).toMatchObject({
      footprint: { width: 1, height: 2 },
      rotation: 1,
      variant: 1,
    });
  });

  it("cycles capability-backed path and fence variants without changing footprints", () => {
    for (const placementItemLayer of ["path", "fence"] as const) {
      const placementHistory = createPlacementHistory({
        ...createEmptyPlacementSnapshot(),
        items: [
          createPlacementItem({
            footprint: { width: 1, height: 1 },
            itemId: threeVariantGenericCatalogItem.id,
            layer: placementItemLayer,
          }),
        ],
        nextItemId: 2,
      });

      expect(getPlacementSelectionDetails({
        catalogItems: [threeVariantGenericCatalogItem],
        placementSnapshot: placementHistory.currentState,
        selectedPlacementKey: "item:1",
      })).toMatchObject({ canCycleAppearance: true });

      const cycleResult = cycleSelectedPlacementAppearance(
        createAppearanceCycleInput(
          placementHistory,
          [threeVariantGenericCatalogItem],
        ),
      );

      expect(cycleResult).toMatchObject({ applied: true });
      expect(cycleResult.placementHistory.currentState.items[0]).toMatchObject({
        footprint: { width: 1, height: 1 },
        layer: placementItemLayer,
        rotation: 0,
        variant: 1,
      });
    }
  });

  it("uses two- and four-rotation capability footprints and preserves undo/redo", () => {
    const rotationCases = [
      {
        catalogItem: twoRotationCatalogItem,
        currentFootprint: { width: 2, height: 1 },
        currentRotation: 0,
        expectedFootprint: { width: 1, height: 2 },
        expectedRotation: 1,
      },
      {
        catalogItem: fourRotationCatalogItem,
        currentFootprint: { width: 1, height: 3 },
        currentRotation: 3,
        expectedFootprint: { width: 2, height: 1 },
        expectedRotation: 0,
      },
    ] as const;

    for (const rotationCase of rotationCases) {
      const placementHistory = createPlacementHistory({
        ...createEmptyPlacementSnapshot(),
        items: [
          createPlacementItem({
            flipped: rotationCase.catalogItem.id === "furniture:two",
            footprint: rotationCase.currentFootprint,
            itemId: rotationCase.catalogItem.id,
            rotation: rotationCase.currentRotation,
            variant: rotationCase.catalogItem.id === "furniture:two" ? 7 : 0,
          }),
        ],
        nextItemId: 2,
      });

      const cycleResult = cycleSelectedPlacementAppearance(
        createAppearanceCycleInput(placementHistory, [rotationCase.catalogItem]),
      );

      expect(cycleResult).toMatchObject({ applied: true });
      expect(cycleResult.placementHistory.currentState.items[0]).toMatchObject({
        flipped: rotationCase.catalogItem.id === "furniture:two",
        footprint: rotationCase.expectedFootprint,
        instanceId: 1,
        rotation: rotationCase.expectedRotation,
        variant: rotationCase.catalogItem.id === "furniture:two" ? 7 : 0,
      });
      const undoneHistory = undoPlacementHistory(cycleResult.placementHistory);
      expect(undoneHistory.currentState).toEqual(placementHistory.currentState);
      expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
        cycleResult.placementHistory.currentState,
      );
    }
  });

  it("moves, rotates, copies, undoes, and redoes a rug across ordinary furniture", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          instanceId: 1,
          itemId: twoRotationRugCatalogItem.id,
          footprint: { width: 2, height: 1 },
          isRug: true,
          x: 0,
          y: 0,
        }),
        createPlacementItem({ instanceId: 2, x: 2, y: 0 }),
      ],
      nextItemId: 3,
    });
    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [twoRotationRugCatalogItem],
      mapPlacementGrid: createPlacementGrid(8, 8),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    });

    expect(moveResult).toMatchObject({ applied: true });
    expect(moveResult.placementHistory.currentState.items[0]).toMatchObject({
      footprint: { width: 2, height: 1 },
      isRug: true,
      x: 1,
      y: 0,
    });

    const rotationResult = cycleSelectedPlacementAppearance({
      ...createAppearanceCycleInput(
        moveResult.placementHistory,
        [twoRotationRugCatalogItem],
      ),
    });

    expect(rotationResult).toMatchObject({ applied: true });
    expect(rotationResult.placementHistory.currentState.items[0]).toMatchObject({
      footprint: { width: 1, height: 2 },
      isRug: true,
      rotation: 1,
      x: 1,
      y: 0,
    });

    const duplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [twoRotationRugCatalogItem],
      cursorTile: { x: 2, y: 0 },
      mapPlacementGrid: createPlacementGrid(8, 8),
      placementHistory: rotationResult.placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(duplicateResult).toMatchObject({
      applied: true,
      selectedPlacementKey: "item:3",
    });
    expect(duplicateResult.placementHistory.currentState.items[2]).toMatchObject({
      footprint: { width: 1, height: 2 },
      instanceId: 3,
      isRug: true,
      rotation: 1,
      x: 2,
      y: 0,
    });
    const undoneHistory = undoPlacementHistory(duplicateResult.placementHistory);
    expect(undoneHistory.currentState).toEqual(
      rotationResult.placementHistory.currentState,
    );
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      duplicateResult.placementHistory.currentState,
    );
  });

  it("selects, keeps Q stable, moves, copies, undoes, and rejects an invalid double bed copy", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          bedType: "double",
          footprint: { width: 3, height: 3 },
          itemId: doubleBedCatalogItem.id,
          x: 2,
          y: 1,
        }),
      ],
      nextItemId: 2,
    });

    expect(selectPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      cursorTile: { x: 4, y: 3 },
      placementSnapshot: placementHistory.currentState,
    })).toBe("item:1");

    expect(cycleSelectedPlacementAppearance({
      ...createAppearanceCycleInput(placementHistory, [doubleBedCatalogItem]),
    })).toEqual({
      applied: false,
      placementHistory,
      reason: "not-cycleable",
      selectedPlacementKey: "item:1",
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [doubleBedCatalogItem],
      mapPlacementGrid: createPlacementGrid(12, 8),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    });

    expect(moveResult).toMatchObject({ applied: true });
    expect(moveResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        bedType: "double",
        footprint: { width: 3, height: 3 },
        instanceId: 1,
        rotation: 0,
        x: 3,
        y: 1,
      }),
    ]);
    expect(moveResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);

    const duplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [doubleBedCatalogItem],
      cursorTile: { x: 7, y: 1 },
      mapPlacementGrid: createPlacementGrid(12, 8),
      placementHistory: moveResult.placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(duplicateResult).toMatchObject({
      applied: true,
      selectedPlacementKey: "item:2",
    });
    expect(duplicateResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        bedType: "double",
        footprint: { width: 3, height: 3 },
        instanceId: 1,
        x: 3,
        y: 1,
      }),
      expect.objectContaining({
        bedType: "double",
        footprint: { width: 3, height: 3 },
        instanceId: 2,
        x: 7,
        y: 1,
      }),
    ]);
    const undoneHistory = undoPlacementHistory(duplicateResult.placementHistory);
    expect(undoneHistory.currentState).toEqual(
      moveResult.placementHistory.currentState,
    );
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      duplicateResult.placementHistory.currentState,
    );

    const invalidDuplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [doubleBedCatalogItem],
      cursorTile: { x: 10, y: 1 },
      mapPlacementGrid: createPlacementGrid(12, 8),
      placementHistory: duplicateResult.placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(invalidDuplicateResult).toMatchObject({
      applied: false,
      placementHistory: duplicateResult.placementHistory,
      selectedPlacementKey: "item:1",
      validation: {
        reason: "outside-map",
        tile: { x: 12, y: 1 },
        valid: false,
      },
    });
  });

  it("keeps opaque presentation fields unchanged when no capability can cycle", () => {
    const opaqueCatalogItem = createCatalogItem("opaque:test");
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          flipped: true,
          itemId: opaqueCatalogItem.id,
          rotation: 3,
          variant: 9,
        }),
      ],
      nextItemId: 2,
    });

    const cycleResult = cycleSelectedPlacementAppearance(
      createAppearanceCycleInput(placementHistory, [opaqueCatalogItem]),
    );

    expect(getPlacementSelectionDetails({
      catalogItems: [opaqueCatalogItem],
      placementSnapshot: placementHistory.currentState,
      selectedPlacementKey: "item:1",
    })).toMatchObject({ canCycleAppearance: false });
    expect(cycleResult).toEqual({
      applied: false,
      placementHistory,
      reason: "not-cycleable",
      selectedPlacementKey: "item:1",
    });
  });

  it("preserves a FreeCactus composite variant through Q, move, undo, redo, and copy", () => {
    const freeCactusCatalogItem = createCatalogItem("furniture_FreeCactus");
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          itemId: freeCactusCatalogItem.id,
          variant: 4375,
          x: 1,
          y: 1,
        }),
      ],
      nextItemId: 2,
    });

    expect(cycleSelectedPlacementAppearance(
      createAppearanceCycleInput(placementHistory, [freeCactusCatalogItem]),
    )).toEqual({
      applied: false,
      placementHistory,
      reason: "not-cycleable",
      selectedPlacementKey: "item:1",
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [freeCactusCatalogItem],
      mapPlacementGrid: createPlacementGrid(8, 8),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    });

    expect(moveResult).toMatchObject({ applied: true });
    expect(moveResult.placementHistory.currentState.items[0]).toMatchObject({
      itemId: "furniture_FreeCactus",
      variant: 4375,
      x: 2,
      y: 1,
    });
    const undoneHistory = undoPlacementHistory(moveResult.placementHistory);
    const redoneHistory = redoPlacementHistory(undoneHistory);
    expect(undoneHistory.currentState.items[0]?.variant).toBe(4375);
    expect(redoneHistory.currentState.items[0]?.variant).toBe(4375);

    const duplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [freeCactusCatalogItem],
      cursorTile: { x: 4, y: 4 },
      mapPlacementGrid: createPlacementGrid(8, 8),
      placementHistory: redoneHistory,
      selectedPlacementKey: "item:1",
    });

    expect(duplicateResult).toMatchObject({ applied: true });
    expect(duplicateResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ instanceId: 1, variant: 4375, x: 2, y: 1 }),
      expect.objectContaining({ instanceId: 2, variant: 4375, x: 4, y: 4 }),
    ]);
  });

  it("excludes the current item while validating a rotated footprint", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          footprint: { width: 2, height: 1 },
          instanceId: 1,
          itemId: twoRotationCatalogItem.id,
        }),
      ],
      nextItemId: 2,
    });

    const cycleResult = cycleSelectedPlacementAppearance({
      ...createAppearanceCycleInput(placementHistory, [twoRotationCatalogItem]),
    });

    expect(cycleResult).toMatchObject({ applied: true });
    expect(cycleResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        footprint: { width: 1, height: 2 },
        instanceId: 1,
        rotation: 1,
      }),
    ]);
  });

  it("rejects a rotated footprint collision without changing history or selection", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          footprint: { width: 2, height: 1 },
          instanceId: 1,
          itemId: twoRotationCatalogItem.id,
        }),
        createPlacementItem({ instanceId: 2, x: 0, y: 1 }),
      ],
      nextItemId: 3,
    });

    const cycleResult = cycleSelectedPlacementAppearance(
      createAppearanceCycleInput(placementHistory, [twoRotationCatalogItem]),
    );

    expect(cycleResult).toEqual({
      applied: false,
      placementHistory,
      selectedPlacementKey: "item:1",
      validation: {
        reason: "occupied-by-item",
        tile: { x: 0, y: 1 },
        valid: false,
      },
    });
    expect(placementHistory.undoStates).toEqual([]);
  });

  it("honors free placement while validating a rotated footprint", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          footprint: { width: 2, height: 1 },
          instanceId: 1,
          itemId: twoRotationCatalogItem.id,
          x: 7,
          y: 7,
        }),
      ],
      nextItemId: 2,
    });

    const cycleResult = cycleSelectedPlacementAppearance(
      createAppearanceCycleInput(
        placementHistory,
        [twoRotationCatalogItem],
        true,
      ),
    );

    expect(cycleResult).toMatchObject({ applied: true });
    expect(cycleResult.placementHistory.currentState.items[0]).toMatchObject({
      footprint: { width: 1, height: 2 },
      rotation: 1,
      x: 7,
      y: 7,
    });
  });

  it("moves and copies 1x2 windows only onto complete wall targets", () => {
    const windowCatalogItem = createWallMountedFurnitureCatalogItem("furniture_1614");
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({
        footprint: { width: 1, height: 2 },
        itemId: windowCatalogItem.id,
        x: 0,
        y: 0,
      })],
      nextItemId: 2,
    });

    const moveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [windowCatalogItem],
      mapPlacementGrid: createWallPlacementGrid(4, 3, ["1,0", "1,1", "2,0", "2,1"]),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    });
    expect(moveResult).toMatchObject({ applied: true });
    expect(moveResult.placementHistory.currentState.items[0]).toMatchObject({
      footprint: { width: 1, height: 2 },
      x: 1,
      y: 0,
    });

    const copyResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [windowCatalogItem],
      cursorTile: { x: 2, y: 0 },
      mapPlacementGrid: createWallPlacementGrid(4, 3, ["1,0", "1,1", "2,0", "2,1"]),
      placementHistory: moveResult.placementHistory,
      selectedPlacementKey: "item:1",
    });
    expect(copyResult).toMatchObject({ applied: true, selectedPlacementKey: "item:2" });

    const missingLowerWallResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [windowCatalogItem],
      cursorTile: { x: 3, y: 0 },
      mapPlacementGrid: createWallPlacementGrid(4, 3, ["3,0"]),
      placementHistory: moveResult.placementHistory,
      selectedPlacementKey: "item:1",
    });
    expect(missingLowerWallResult).toMatchObject({
      applied: false,
      validation: { valid: false, reason: "not-wall", tile: { x: 3, y: 1 } },
    });
  });

  it("applies the same wall rule to Boarded Window paintings and bypasses it only with free placement", () => {
    const boardedWindowCatalogItem = createWallMountedFurnitureCatalogItem(
      "furniture_Boarded Window",
      "painting",
    );
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({
        footprint: { width: 1, height: 2 },
        itemId: boardedWindowCatalogItem.id,
      })],
      nextItemId: 2,
    });

    const rejectedMoveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [boardedWindowCatalogItem],
      mapPlacementGrid: createPlacementGrid(3, 3),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    });
    expect(rejectedMoveResult).toMatchObject({
      applied: false,
      validation: { valid: false, reason: "not-wall", tile: { x: 1, y: 0 } },
    });

    const freePlacementMoveResult = moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [boardedWindowCatalogItem],
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(3, 3),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 3, y: 0 },
    });
    expect(freePlacementMoveResult).toMatchObject({ applied: true });
    expect(freePlacementMoveResult.placementHistory.currentState.items[0]).toMatchObject({
      x: 3,
      y: 0,
    });
  });

  it("fails fast before moving a window when its catalog requirement cannot be resolved", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({
        footprint: { width: 1, height: 2 },
        itemId: "furniture_1614",
      })],
      nextItemId: 2,
    });

    expect(() => moveSelectedPlacements({
      buildingMetadataById: createBuildingMetadataById(),
      mapPlacementGrid: createWallPlacementGrid(3, 3, ["1,0", "1,1"]),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    })).toThrow('Editor selection item "furniture_1614" requires catalog items');
    expect(placementHistory.undoStates).toEqual([]);
  });

  it("fails fast for missing, duplicate, or incompatible catalog choices", () => {
    const validHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({ itemId: twoRotationCatalogItem.id, rotation: 0 }),
      ],
      nextItemId: 2,
    });
    const invalidChoiceHistory = createPlacementHistory({
      ...validHistory.currentState,
      items: [
        createPlacementItem({ itemId: twoRotationCatalogItem.id, rotation: 2 }),
      ],
    });

    expect(() => cycleSelectedPlacementAppearance(
      createAppearanceCycleInput(validHistory, []),
    )).toThrow(/furniture:two.*received 0 matches/s);
    expect(() => cycleSelectedPlacementAppearance(
      createAppearanceCycleInput(validHistory, [
        twoRotationCatalogItem,
        twoRotationCatalogItem,
      ]),
    )).toThrow(/furniture:two.*received 2 matches/s);
    expect(() => cycleSelectedPlacementAppearance(
      createAppearanceCycleInput(invalidChoiceHistory, [twoRotationCatalogItem]),
    )).toThrow(/furniture:two.*2/s);
  });

  it("changes one unlocked selected item tint in one history entry", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1, tintColor: "#ffffff" })],
      nextItemId: 2,
    });

    const tintResult = setSelectedPlacementItemTint({
      catalogItems: [{ ...createCatalogItem("object:390"), paintableChest: { kind: "paintable-chest" } }],
      placementHistory,
      selectedPlacementKey: "item:1",
      tintColor: "#123abc",
    });

    expect(tintResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(tintResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ instanceId: 1, tintColor: "#123abc" }),
    ]);
    expect(tintResult.selectedPlacementKey).toBe("item:1");
  });

  it("rejects a non-paintable item before changing history", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem()],
      nextItemId: 2,
    });
    expect(() => setSelectedPlacementItemTint({
      catalogItems: [createCatalogItem("object:390")],
      placementHistory,
      selectedPlacementKey: "item:1",
      tintColor: "#123abc",
    })).toThrow(/does not support chest paint/);
    expect(placementHistory.undoStates).toEqual([]);
    expect(placementHistory.currentState.items[0]?.tintColor).toBe("#ffffff");
  });

  it("rejects a locked paintable chest before changing history", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ locked: true })],
      nextItemId: 2,
    });

    expect(() => setSelectedPlacementItemTint({
      catalogItems: [{ ...createCatalogItem("object:390"), paintableChest: { kind: "paintable-chest" } }],
      placementHistory,
      selectedPlacementKey: "item:1",
      tintColor: "#123abc",
    })).toThrow(/item:1.*locked item/);
    expect(placementHistory.undoStates).toEqual([]);
    expect(placementHistory.currentState.items[0]?.tintColor).toBe("#ffffff");
  });

  it("does not add history when a chest receives its existing color", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem()],
      nextItemId: 2,
    });
    const result = setSelectedPlacementItemTint({
      catalogItems: [{ ...createCatalogItem("object:390"), paintableChest: { kind: "paintable-chest" } }],
      placementHistory,
      selectedPlacementKey: "item:1",
      tintColor: "#ffffff",
    });
    expect(result.placementHistory).toBe(placementHistory);
    expect(result.placementHistory.undoStates).toEqual([]);
  });

  it("paints one supported selected building in one history entry", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Big Shed", x: 3, y: 4 }],
      nextBuildingId: 2,
    });

    const paintResult = setSelectedPlacementBuildingPaint({
      placementHistory,
      selectedPlacementKey: "building:1",
      paintColors: {
        color1: "#112233",
        color2: "#445566",
        color3: "#778899",
      },
    });

    expect(paintResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(paintResult.placementHistory.currentState.buildings).toEqual([
      expect.objectContaining({
        instanceId: 1,
        paintColors: {
          color1: "#112233",
          color2: "#445566",
          color3: "#778899",
        },
      }),
    ]);
  });

  it("extinguishes and lights one selected catalog-derived light in one history entry per action", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1, itemId: "object:93" })],
      nextItemId: 2,
    });

    const extinguishResult = setSelectedPlacementNightLightState({
      catalogItems: nightLightCatalogItems,
      nightLightState: "off",
      placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(extinguishResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(extinguishResult.placementHistory.currentState.items[0]).toEqual(
      expect.objectContaining({ nightLightState: "off" }),
    );

    const lightResult = setSelectedPlacementNightLightState({
      catalogItems: nightLightCatalogItems,
      nightLightState: undefined,
      placementHistory: extinguishResult.placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(lightResult.placementHistory.undoStates).toHaveLength(2);
    expect(lightResult.placementHistory.currentState.items[0]?.nightLightState)
      .toBeUndefined();
    expect(
      Object.hasOwn(
        lightResult.placementHistory.currentState.items[0] ?? {},
        "nightLightState",
      ),
    ).toBe(false);
  });

  it("uses the frozen variant field for a fireplace and removes legacy state when toggled", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [{
        ...createPlacementItem({ instanceId: 1, itemId: "furniture_1792", variant: 1 }),
        nightLightState: "off" as const,
      }],
      nextItemId: 2,
    });

    const extinguishResult = setSelectedPlacementNightLightState({
      catalogItems: fireplaceNightLightCatalogItems,
      nightLightState: undefined,
      placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(extinguishResult.placementHistory.currentState.items[0]).toEqual(
      expect.objectContaining({ variant: 0 }),
    );
    expect(extinguishResult.placementHistory.currentState.items[0]).not.toHaveProperty(
      "nightLightState",
    );

    const extinguishResultAgain = setSelectedPlacementNightLightState({
      catalogItems: fireplaceNightLightCatalogItems,
      nightLightState: "off",
      placementHistory: extinguishResult.placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(extinguishResultAgain.placementHistory.currentState.items[0]).toEqual(
      expect.objectContaining({ variant: 1 }),
    );
  });

  it("reports the frozen fireplace variant through the existing light control state", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({
        instanceId: 1,
        itemId: "furniture_1792",
        variant: 1,
      })],
      nextItemId: 2,
    };

    expect(getPlacementSelectionDetails({
      catalogItems: fireplaceNightLightCatalogItems,
      placementSnapshot,
      selectedPlacementKey: "item:1",
    })).toMatchObject({
      catalogItemId: "furniture_1792",
      nightLightState: "off",
    });
  });

  it("rejects conflicting frozen fireplace variant and legacy light state", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [{
        ...createPlacementItem({ instanceId: 1, itemId: "furniture_1792", variant: 0 }),
        nightLightState: "off" as const,
      }],
      nextItemId: 2,
    });

    expect(() =>
      setSelectedPlacementNightLightState({
        catalogItems: fireplaceNightLightCatalogItems,
        nightLightState: "off",
        placementHistory,
        selectedPlacementKey: "item:1",
      })
    ).toThrow('Furniture fire item "furniture_1792" has conflicting variant 0 and nightLightState "off"');
  });

  it("rejects a non-light, locked, or stale light selection without mutating history", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({ instanceId: 1, itemId: "object:390" }),
        createPlacementItem({ instanceId: 2, itemId: "object:93", locked: true }),
      ],
      nextItemId: 3,
    });
    const originalPlacementSnapshot = placementHistory.currentState;
    const originalUndoStates = placementHistory.undoStates;

    for (const invalidLightCommand of [
      {
        selectedPlacementKey: "item:1",
        expectedError:
          'catalog item "object:390" must be a catalog-derived night light',
      },
      {
        selectedPlacementKey: "item:2",
        expectedError: 'selected placement key "item:2" resolves to a locked item',
      },
      {
        selectedPlacementKey: "item:999",
        expectedError: 'selected placement key "item:999" does not exist',
      },
    ]) {
      expect(() =>
        setSelectedPlacementNightLightState({
          catalogItems: nightLightCatalogItems,
          nightLightState: "off",
          placementHistory,
          selectedPlacementKey: invalidLightCommand.selectedPlacementKey,
        }),
      ).toThrow(invalidLightCommand.expectedError);
      expect(placementHistory.currentState).toBe(originalPlacementSnapshot);
      expect(placementHistory.undoStates).toBe(originalUndoStates);
    }
  });

  it("rejects malformed catalog light metadata without mutating history", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1, itemId: "object:93" })],
      nextItemId: 2,
    });

    expect(() =>
      setSelectedPlacementNightLightState({
        catalogItems: [
          {
            id: "object:93",
            nightLight: { radiusInTiles: 0, color: 0xffe3a0 },
          },
        ],
        nightLightState: "off",
        placementHistory,
        selectedPlacementKey: "item:1",
      }),
    ).toThrow(
      'Editor selection catalog item "object:93" nightLight.radiusInTiles must be a positive finite number; received 0',
    );
    expect(placementHistory.undoStates).toEqual([]);
    expect(placementHistory.currentState.items[0]?.nightLightState).toBeUndefined();
  });

  it("rejects invalid tint targets without mutating history", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 1, y: 1 }],
      crops: [{ cropId: "crop:24", x: 2, y: 2 }],
      items: [
        createPlacementItem({ instanceId: 1, tintColor: "#ffffff" }),
        createPlacementItem({ instanceId: 2, locked: true }),
      ],
      nextBuildingId: 2,
      nextItemId: 3,
    });
    const originalPlacementSnapshot = placementHistory.currentState;
    const originalUndoStates = placementHistory.undoStates;

    const invalidTintCommands = [
      {
        selectedPlacementKey: "building:1",
        tintColor: "#123abc",
        expectedError: 'selected placement key "building:1" must refer to an item',
      },
      {
        selectedPlacementKey: "crop:2,2",
        tintColor: "#123abc",
        expectedError: 'selected placement key "crop:2,2" must refer to an item',
      },
      {
        selectedPlacementKey: "item:2",
        tintColor: "#123abc",
        expectedError: 'selected placement key "item:2" resolves to a locked item',
      },
      {
        selectedPlacementKey: "item:1",
        tintColor: "#ABCDEF",
        expectedError:
          'field "item.tintColor" must be a canonical lowercase #rrggbb color; received "#ABCDEF"',
      },
      {
        selectedPlacementKey: "unknown:1",
        tintColor: "#123abc",
        expectedError:
          'key must begin with "building:", "crop:", or "item:"; received "unknown:1"',
      },
    ];

    for (const invalidTintCommand of invalidTintCommands) {
      expect(() =>
        setSelectedPlacementItemTint({
          catalogItems: [{ ...createCatalogItem("object:390"), paintableChest: { kind: "paintable-chest" } }],
          placementHistory,
          selectedPlacementKey: invalidTintCommand.selectedPlacementKey,
          tintColor: invalidTintCommand.tintColor,
        }),
      ).toThrow(invalidTintCommand.expectedError);
      expect(placementHistory.currentState).toBe(originalPlacementSnapshot);
      expect(placementHistory.undoStates).toBe(originalUndoStates);
      expect(placementHistory.undoStates).toEqual([]);
      expect(placementHistory.currentState.items[0]?.tintColor).toBe("#ffffff");
    }
  });

  it("copies a selected item at a valid target without moving the source", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          growthStage: 2,
          instanceId: 1,
          x: 2,
          y: 2,
        }),
      ],
      nextItemId: 2,
    });

    const duplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createCatalogItem("object:390")],
      cursorTile: { x: 4, y: 4 },
      mapPlacementGrid: createPlacementGrid(12, 12),
      placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(duplicateResult).toMatchObject({
      applied: true,
      selectedPlacementKey: "item:2",
    });
    expect(duplicateResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(duplicateResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ growthStage: 2, instanceId: 1, x: 2, y: 2 }),
      expect.objectContaining({ growthStage: 2, instanceId: 2, x: 4, y: 4 }),
    ]);
  });

  it("does not copy a selected item when its destination is outside the map", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1, x: 2, y: 2 })],
      nextItemId: 2,
    });

    const duplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createCatalogItem("object:390")],
      cursorTile: { x: 5, y: 4 },
      mapPlacementGrid: createPlacementGrid(5, 5),
      placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(duplicateResult).toMatchObject({
      applied: false,
      placementHistory,
      selectedPlacementKey: "item:1",
      validation: { valid: false, reason: "outside-map", tile: { x: 5, y: 4 } },
    });
  });
});
