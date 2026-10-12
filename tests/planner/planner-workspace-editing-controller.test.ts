import { describe, expect, it } from "vitest";
import {
  applyPlannerWorkspaceMapTileClick,
  applyPlannerWorkspaceMapTileRectangle,
  applyPlannerWorkspacePlacementSelection,
  duplicatePlannerWorkspaceSelectionAtTile,
  previewPlannerWorkspaceSelectionAtTile,
  previewPlannerWorkspaceFillRectangle,
  previewPlannerWorkspaceEraseAtTile,
  previewPlannerWorkspaceEraseRectangle,
} from "../../src/planner/planner-workspace-editing-controller";
import type { CatalogItem } from "../../src/catalog";
import { createPlacementHistory, undoPlacementHistory } from "../../src/placement/placement-history";
import { createEmptyPlacementSnapshot, type PlacementItem } from "../../src/placement/placement-snapshot";

function createFloor(instanceId: number, x: number, y: number): PlacementItem {
  return {
    instanceId, x, y, itemId: "floor:1", layer: "path", rotation: 0,
    footprint: { width: 1, height: 1 }, variant: 0, tintColor: "#ffffff",
    locked: false, isRug: false, isGrass: false, isTable: false,
    isLongTable: false, flipped: false, bedType: null,
  };
}

function createCopyInput() {
  return {
    buildingMetadataById: {}, freePlacement: false,
    mapPlacementGrid: {
      width: 10, height: 10,
      capabilitiesByTile: Array.from({ length: 100 }, () => ({
        buildable: true, diggable: true, passable: true, crabPot: false,
        treePlantable: false, treePlantableOnDirt: false, wall: false,
      })),
    },
    placementHistory: createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createFloor(1, 1, 1), createFloor(2, 3, 2)], nextItemId: 3,
    }),
    selectedPlacementKeys: ["item:1", "item:2"], cursorTile: { x: 5, y: 4 },
  };
}

describe("planner workspace editing parity", () => {
  it("previews and commits only valid fill tiles without editing the source during hover", () => {
    const copyInput = createCopyInput();
    const selectedCatalogItem: CatalogItem = {
      allowedTools: ["cursor", "fill"], category: "floor", id: "floor:1", name: "Floor",
      sprite: { kind: "sprite-index", index: 0 }, textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png", tileSize: { width: 1, height: 1 },
    };
    const fillInput = {
      ...copyInput, selectedCatalogItem, catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      tool: "fill" as const, firstTile: { x: 1, y: 1 }, secondTile: { x: 3, y: 2 },
    };
    expect(previewPlannerWorkspaceFillRectangle(fillInput)).toHaveLength(4);
    expect(copyInput.placementHistory.currentState.items).toHaveLength(2);
    expect(copyInput.placementHistory.undoStates).toEqual([]);
    const fillTransition = applyPlannerWorkspaceMapTileRectangle(fillInput);
    expect(fillTransition.placementHistory.currentState.items).toHaveLength(6);
    expect(fillTransition.placementHistory.undoStates).toEqual([copyInput.placementHistory.currentState]);
    const rejectedTransition = applyPlannerWorkspaceMapTileRectangle({ ...fillInput, secondTile: fillInput.firstTile });
    expect(rejectedTransition.placementHistory).toBe(copyInput.placementHistory);
    expect(rejectedTransition.selectedPlacementKeys).toEqual(copyInput.selectedPlacementKeys);
  });

  it("preserves selection and history when a fill area cannot contain one whole bed", () => {
    const copyInput = createCopyInput();
    const selectedCatalogItem: CatalogItem = {
      allowedTools: ["cursor", "fill"], category: "placeable", id: "furniture_double_bed", name: "Double Bed",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 64 }, textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png", tileSize: { width: 3, height: 3 },
      renderingMetadata: {
        kind: "furniture", furnitureType: "bed double", indoors: true, outdoors: false,
        rotationSprites: undefined, rotationTileSizes: undefined, wallMounted: false,
        isRug: false, isTable: false, isLongTable: false, bedType: "double", compositeSprite: null,
      },
    };
    const fillTransition = applyPlannerWorkspaceMapTileRectangle({
      ...copyInput, selectedCatalogItem, catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      tool: "fill", firstTile: { x: 5, y: 5 }, secondTile: { x: 6, y: 6 },
    });
    expect(fillTransition.placementHistory).toBe(copyInput.placementHistory);
    expect(fillTransition.selectedPlacementKeys).toEqual(copyInput.selectedPlacementKeys);
  });

  it("previews eraser hover and rectangle targets without changing selection or history", () => {
    const copyInput = createCopyInput();
    const selectedPlacementKeys = copyInput.selectedPlacementKeys;
    const eraseContext = {
      buildingMetadataById: copyInput.buildingMetadataById,
      placementHistory: copyInput.placementHistory,
      tool: "erase" as const,
    };

    const hoverPreview = previewPlannerWorkspaceEraseAtTile({
      ...eraseContext,
      cursorTile: { x: 1, y: 1 },
    });
    expect(hoverPreview).toEqual(["item:1"]);
    expect(previewPlannerWorkspaceEraseAtTile({
      ...eraseContext,
      cursorTile: { x: 9, y: 9 },
    })).toEqual([]);
    const rectanglePreview = previewPlannerWorkspaceEraseRectangle({
      ...eraseContext,
      firstTile: { x: 1, y: 1 },
      secondTile: { x: 3, y: 2 },
    });
    expect(rectanglePreview).toEqual(["item:1", "item:2"]);

    expect(copyInput.placementHistory.currentState.items).toHaveLength(2);
    expect(copyInput.placementHistory.undoStates).toEqual([]);
    expect(copyInput.selectedPlacementKeys).toBe(selectedPlacementKeys);
    expect(copyInput.selectedPlacementKeys).toEqual(["item:1", "item:2"]);

    const hoverEraseTransition = applyPlannerWorkspaceMapTileClick({
      ...copyInput,
      catalogPresentationChoice: null,
      cursorTile: { x: 1, y: 1 },
      freePlacement: false,
      selectedCatalogItem: null,
      tool: "erase",
    });
    expect(hoverPreview).toEqual(["item:1"]);
    expect(hoverEraseTransition.placementHistory.currentState.items).toEqual([
      createFloor(2, 3, 2),
    ]);

    const rectangleEraseTransition = applyPlannerWorkspaceMapTileRectangle({
      ...copyInput,
      catalogPresentationChoice: null,
      firstTile: { x: 1, y: 1 },
      freePlacement: false,
      secondTile: { x: 3, y: 2 },
      selectedCatalogItem: null,
      tool: "erase",
    });
    expect(rectanglePreview).toEqual(["item:1", "item:2"]);
    expect(rectangleEraseTransition.placementHistory.currentState.items).toEqual([]);
    expect(rectangleEraseTransition.placementHistory.undoStates).toEqual([
      copyInput.placementHistory.currentState,
    ]);
  });

  it("returns null for non-erase tools and rejects invalid erase-preview coordinates", () => {
    const copyInput = createCopyInput();
    const erasePreviewContext = {
      buildingMetadataById: copyInput.buildingMetadataById,
      cursorTile: { x: 1, y: 1 },
      placementHistory: copyInput.placementHistory,
    };
    const eraseRectanglePreviewContext = {
      buildingMetadataById: copyInput.buildingMetadataById,
      firstTile: { x: 1, y: 1 },
      placementHistory: copyInput.placementHistory,
      secondTile: { x: 2, y: 2 },
    };

    expect(previewPlannerWorkspaceEraseAtTile({
      ...erasePreviewContext,
      tool: "cursor",
    })).toBeNull();
    expect(previewPlannerWorkspaceEraseRectangle({
      ...eraseRectanglePreviewContext,
      tool: "fill",
    })).toBeNull();
    expect(() => previewPlannerWorkspaceEraseAtTile({
      ...erasePreviewContext,
      cursorTile: { x: -1, y: 1 },
      tool: "erase",
    })).toThrow("Planner workspace editing cursorTile.x must be a non-negative safe integer; received -1.");
  });

  it("accumulates and toggles Multi clicks, and clears on empty space without history", () => {
    const { placementHistory } = createCopyInput();
    const firstSelection = applyPlannerWorkspacePlacementSelection({
      placementHistory, placementSelectionKeys: ["item:1"], selectedPlacementKeys: [], toggleSelection: true,
    });
    const secondSelection = applyPlannerWorkspacePlacementSelection({
      placementHistory, placementSelectionKeys: ["item:2"], selectedPlacementKeys: firstSelection.selectedPlacementKeys, toggleSelection: true,
    });
    expect(secondSelection.selectedPlacementKeys).toEqual(["item:1", "item:2"]);
    expect(applyPlannerWorkspacePlacementSelection({
      placementHistory, placementSelectionKeys: ["item:1"], selectedPlacementKeys: secondSelection.selectedPlacementKeys, toggleSelection: true,
    }).selectedPlacementKeys).toEqual(["item:2"]);
    expect(applyPlannerWorkspacePlacementSelection({
      placementHistory, placementSelectionKeys: [], selectedPlacementKeys: secondSelection.selectedPlacementKeys, toggleSelection: true,
    }).selectedPlacementKeys).toEqual([]);
    expect(secondSelection.placementHistory).toBe(placementHistory);
  });

  it("copies a group with relative offsets, pure preview and one undo entry", () => {
    const copyInput = createCopyInput();
    const previewActions = previewPlannerWorkspaceSelectionAtTile(copyInput);
    expect(previewActions).toMatchObject([
      { type: "add-item", item: { x: 5, y: 4 } },
      { type: "add-item", item: { x: 7, y: 5 } },
    ]);
    expect(copyInput.placementHistory.currentState.items).toHaveLength(2);
    const copyTransition = duplicatePlannerWorkspaceSelectionAtTile(copyInput);
    expect(copyTransition.selectedPlacementKeys).toEqual(["item:3", "item:4"]);
    expect(copyTransition.placementHistory.currentState.items.slice(2)).toMatchObject([
      { instanceId: 3, x: 5, y: 4 }, { instanceId: 4, x: 7, y: 5 },
    ]);
    expect(copyTransition.placementHistory.undoStates).toEqual([copyInput.placementHistory.currentState]);
    expect(undoPlacementHistory(copyTransition.placementHistory).currentState).toEqual(copyInput.placementHistory.currentState);
  });

  it("rejects the whole group when a later member is outside the map", () => {
    const copyInput = { ...createCopyInput(), cursorTile: { x: 8, y: 4 } };
    expect(previewPlannerWorkspaceSelectionAtTile(copyInput)).toBeNull();
    const copyTransition = duplicatePlannerWorkspaceSelectionAtTile(copyInput);
    expect(copyTransition.placementHistory).toBe(copyInput.placementHistory);
    expect(copyTransition.selectedPlacementKeys).toEqual(copyInput.selectedPlacementKeys);
  });

  it("rejects malformed toggle inputs with their actual value", () => {
    expect(() => applyPlannerWorkspacePlacementSelection({
      placementHistory: createCopyInput().placementHistory,
      placementSelectionKeys: [], toggleSelection: "yes" as unknown as boolean,
    })).toThrow('toggleSelection must be a boolean; received "yes"');
  });
});
