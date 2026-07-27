import { describe, expect, it } from "vitest";
import type { BuildingPlacementMetadataById } from "../../src/catalog";
import {
  applyEditorErase,
  applyEditorEraseRectangle,
} from "../../src/editor/editor-erase-controller";
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

describe("applyEditorErase", () => {
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
