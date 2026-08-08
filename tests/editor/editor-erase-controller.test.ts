import { describe, expect, it } from "vitest";
import type { BuildingPlacementMetadataById } from "../../src/catalog";
import {
  applyEditorErase,
  applyEditorEraseRectangle,
} from "../../src/editor/editor-erase-controller";
import {
  createPlacementHistory,
  redoPlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
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

function createTableWithHeldItem(): PlacementItem {
  return createPlacementItem({
    footprint: { width: 2, height: 2 },
    instanceId: 1,
    isTable: true,
    itemId: "furniture_724",
    x: 3,
    y: 4,
    heldItem: {
      bedType: null,
      flipped: false,
      footprint: { width: 1, height: 1 },
      instanceId: 7,
      isGrass: false,
      isLongTable: false,
      isRug: false,
      isTable: false,
      itemId: "furniture_0",
      layer: "item",
      locked: false,
      rotation: 0,
      tintColor: "#ffffff",
      variant: 0,
      x: 4,
      y: 5,
    },
  });
}

describe("applyEditorErase", () => {
  it("erases a table and its held child as one undoable parent cascade", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createTableWithHeldItem()],
      nextItemId: 8,
    });

    const eraseResult = applyEditorErase({
      cursorTile: { x: 4, y: 5 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(eraseResult).toMatchObject({ applied: true, erased: "item" });
    expect(eraseResult.placementHistory.currentState.items).toEqual([]);
    expect(eraseResult.placementHistory.currentState.nextItemId).toBe(8);
    expect(eraseResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    const undoneHistory = undoPlacementHistory(eraseResult.placementHistory);
    expect(undoneHistory.currentState).toEqual(placementHistory.currentState);
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      eraseResult.placementHistory.currentState,
    );
  });

  it("erases a bed from any tile in its complete placement footprint in one history entry", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem({
          bedType: "double",
          footprint: { width: 3, height: 3 },
          instanceId: 1,
          itemId: "furniture_test_double_bed",
          x: 2,
          y: 1,
        }),
      ],
      nextItemId: 2,
    });

    const eraseResult = applyEditorErase({
      cursorTile: { x: 4, y: 3 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(eraseResult).toMatchObject({ applied: true, erased: "item" });
    expect(eraseResult.placementHistory.currentState.items).toEqual([]);
    expect(eraseResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
  });

  it("erases a stored giant crop item from any tile in its 3 by 3 footprint", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem({
        footprint: { width: 3, height: 3 },
        instanceId: 1,
        itemId: "crop:giant_Cauliflower",
        x: 2,
        y: 1,
      })],
      nextItemId: 2,
    });

    const eraseResult = applyEditorErase({
      cursorTile: { x: 4, y: 3 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(eraseResult).toMatchObject({ applied: true, erased: "item" });
    expect(eraseResult.placementHistory.currentState.items).toEqual([]);
    const undoneHistory = undoPlacementHistory(eraseResult.placementHistory);
    expect(undoneHistory.currentState).toEqual(placementHistory.currentState);
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      eraseResult.placementHistory.currentState,
    );
  });

  it("removes the visible non-path item before the crop, building, or path beneath it", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 0, y: 0 }],
      crops: [{ cropId: "crop:24", x: 0, y: 0 }],
      items: [
        createPlacementItem({ instanceId: 1, layer: "path" }),
        createPlacementItem({ instanceId: 2, layer: "item" }),
      ],
      nextBuildingId: 2,
      nextItemId: 3,
    });

    const erasedPlacement = applyEditorErase({
      cursorTile: { x: 0, y: 0 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(erasedPlacement).toMatchObject({ applied: true, erased: "item" });
    expect(erasedPlacement.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(erasedPlacement.placementHistory.currentState.items).toEqual([
      createPlacementItem({ instanceId: 1, layer: "path" }),
    ]);
  });

  it("erases a Garden Pot crop before its pot and preserves undo and redo", () => {
    const gardenPot = createPlacementItem({
      instanceId: 1,
      itemId: "big-craftable:62",
      x: 2,
      y: 3,
    });
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 2, y: 3 }],
      items: [gardenPot],
      nextItemId: 2,
    });

    const eraseResult = applyEditorErase({
      cursorTile: { x: 2, y: 3 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(eraseResult).toMatchObject({ applied: true, erased: "crop" });
    expect(eraseResult.placementHistory.currentState).toMatchObject({
      crops: [],
      items: [gardenPot],
    });
    const undoneHistory = undoPlacementHistory(eraseResult.placementHistory);
    expect(undoneHistory.currentState).toEqual(placementHistory.currentState);
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      eraseResult.placementHistory.currentState,
    );
  });

  it("removes an ordinary item above an overlapping rug before the rug", () => {
    const rug = createPlacementItem({
      instanceId: 2,
      itemId: "furniture_1451",
      footprint: { width: 3, height: 2 },
      isRug: true,
      x: 0,
      y: 0,
    });
    const ordinaryItem = createPlacementItem({
      instanceId: 1,
      x: 1,
      y: 1,
    });
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [ordinaryItem, rug],
      nextItemId: 3,
    });

    const erasedPlacement = applyEditorErase({
      cursorTile: { x: 1, y: 1 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(erasedPlacement).toMatchObject({ applied: true, erased: "item" });
    expect(erasedPlacement.placementHistory.currentState.items).toEqual([rug]);
  });

  it("removes a crop before a building and reports when the cursor has no placement", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 3, y: 4 }],
      crops: [{ cropId: "crop:24", x: 3, y: 4 }],
      nextBuildingId: 2,
    });

    const cropErase = applyEditorErase({
      cursorTile: { x: 3, y: 4 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(cropErase).toMatchObject({ applied: true, erased: "crop" });
    expect(cropErase.placementHistory.currentState.crops).toEqual([]);

    const emptyErase = applyEditorErase({
      cursorTile: { x: 30, y: 30 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(emptyErase).toEqual({
      applied: false,
      reason: "no-placement-at-cursor",
      placementHistory,
    });
  });

  it("removes every unlocked building, item, and crop intersecting a drag rectangle in one history entry", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      buildings: [
        { instanceId: 1, buildingId: "Barn", x: 2, y: 2 },
        { instanceId: 2, buildingId: "Barn", x: 7, y: 7 },
      ],
      crops: [
        { cropId: "crop:24", x: 3, y: 3 },
        { cropId: "crop:24", x: 7, y: 7 },
      ],
      items: [
        createPlacementItem({ instanceId: 1, x: 4, y: 4, layer: "item" }),
        createPlacementItem({ instanceId: 2, x: 4, y: 4, layer: "path", locked: true }),
        createPlacementItem({ instanceId: 3, x: 7, y: 7, layer: "item" }),
      ],
      nextBuildingId: 3,
      nextItemId: 4,
    });

    const erasedRectangle = applyEditorEraseRectangle({
      firstTile: { x: 2, y: 2 },
      secondTile: { x: 4, y: 4 },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(erasedRectangle).toMatchObject({
      applied: true,
      erasedBuildingCount: 1,
      erasedCropCount: 1,
      erasedItemCount: 1,
    });
    expect(erasedRectangle.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(erasedRectangle.placementHistory.currentState).toMatchObject({
      buildings: [{ instanceId: 2, buildingId: "Barn", x: 7, y: 7 }],
      crops: [{ cropId: "crop:24", x: 7, y: 7 }],
      items: [
        createPlacementItem({
          instanceId: 2,
          x: 4,
          y: 4,
          layer: "path",
          locked: true,
        }),
        createPlacementItem({ instanceId: 3, x: 7, y: 7, layer: "item" }),
      ],
    });
  });
});
