import { describe, expect, it } from "vitest";
import type { BuildingPlacementMetadataById } from "../../src/catalog";
import {
  deleteSelectedPlacements,
  duplicateSelectedPlacementAtTile,
  getPlacementSelectionSummary,
  getPlacementSelectionDetails,
  moveSelectedPlacements,
  rotateSelectedPlacement,
  setSelectedPlacementBuildingPaint,
  setSelectedPlacementNightLightState,
  setSelectedPlacementItemTint,
  selectPlacementAtTile,
  selectPlacementsInRectangle,
} from "../../src/editor/editor-selection-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import { createPlacementHistory } from "../../src/placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
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
      crabPot: false,
    })),
  };
}

const nightLightCatalogItems = [
  {
    id: "object:93",
    nightLight: { radiusInTiles: 4, color: 0xffe3a0 },
  },
] as const;

describe("editor selection controller", () => {
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
      items: [createPlacementItem({ instanceId: 1, itemId: "object:390" })],
      nextItemId: 2,
    };

    const placementSelectionDetails = getPlacementSelectionDetails({
      placementSnapshot,
      selectedPlacementKey: "item:1",
    });

    expect(placementSelectionDetails).toEqual({
      catalogItemId: "object:390",
      canRotate: true,
      kind: "item",
      nightLightState: undefined,
      selectedPlacementKey: "item:1",
      tintColor: "#ffffff",
    });
    expect(Object.hasOwn(placementSelectionDetails, "nightLightState")).toBe(
      true,
    );
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

  it("rotates one unlocked item in one history entry without changing its identity", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1, rotation: 3 })],
      nextItemId: 2,
    });

    const rotateResult = rotateSelectedPlacement({
      placementHistory,
      selectedPlacementKey: "item:1",
    });

    expect(rotateResult).toMatchObject({ applied: true });
    expect(rotateResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(rotateResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ instanceId: 1, rotation: 0 }),
    ]);
  });

  it("changes one unlocked selected item tint in one history entry", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({ instanceId: 1, tintColor: "#ffffff" })],
      nextItemId: 2,
    });

    const tintResult = setSelectedPlacementItemTint({
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
      items: [createPlacementItem({ instanceId: 1, x: 2, y: 2 })],
      nextItemId: 2,
    });

    const duplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: createBuildingMetadataById(),
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
      expect.objectContaining({ instanceId: 1, x: 2, y: 2 }),
      expect.objectContaining({ instanceId: 2, x: 4, y: 4 }),
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
