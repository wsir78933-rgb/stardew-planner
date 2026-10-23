import { describe, expect, it } from "vitest";
import {
  applyPlannerWorkspaceMapTileClick,
  applyPlannerWorkspaceMapTileRectangle,
  applyPlannerWorkspacePlacementSelection,
  duplicatePlannerWorkspaceSelectionAtTile,
  getPlannerWorkspaceCatalogItemSelectionTool,
  getPlannerWorkspaceToolSelection,
  isPlannerWorkspaceToolAvailable,
  isPlannerWorkspaceToolDisabled,
  previewPlannerWorkspaceSelectionAtTile,
  previewPlannerWorkspaceFillRectangle,
  previewPlannerWorkspaceEraseAtTile,
  previewPlannerWorkspaceEraseRectangle,
  setPlannerWorkspaceSelectedAnimationOptions,
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

function createLongTable(instanceId: number, x: number, y: number): PlacementItem {
  return {
    instanceId, x, y, itemId: "furniture_200", layer: "item", rotation: 0,
    footprint: { width: 2, height: 1 }, variant: 0, tintColor: "#ffffff",
    locked: false, isRug: false, isGrass: false, isTable: true,
    isLongTable: true, flipped: false, bedType: null,
  };
}

function createOccupiedTable(instanceId: number, x: number, y: number): PlacementItem {
  return {
    instanceId, x, y, itemId: "furniture_1391", layer: "item", rotation: 0,
    footprint: { width: 1, height: 1 }, variant: 0, tintColor: "#ffffff",
    locked: false, isRug: false, isGrass: false, isTable: true,
    isLongTable: false, flipped: false, bedType: null,
    heldItem: {
      instanceId: instanceId + 1, x, y, itemId: "furniture_0", layer: "item", rotation: 0,
      footprint: { width: 1, height: 1 }, variant: 0, tintColor: "#ffffff",
      locked: false, isRug: false, isGrass: false, isTable: false,
      isLongTable: false, flipped: false, bedType: null,
    },
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
  it("routes animation options through history only for one selected placement", () => {
    const sourceHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createFloor(1, 1, 1), createFloor(2, 3, 2)],
      nextItemId: 3,
    });
    const options = { spriteState: "working", readyProduct: "348" };

    const transition = setPlannerWorkspaceSelectedAnimationOptions({
      animationOptions: options,
      placementHistory: sourceHistory,
      selectedPlacementKeys: ["item:1"],
    });

    expect(transition.selectedPlacementKeys).toEqual(["item:1"]);
    expect(transition.placementHistory.currentState.items[0]?.animationOptions)
      .toEqual(options);
    expect(transition.placementHistory.undoStates).toEqual([
      sourceHistory.currentState,
    ]);

    const multipleSelectionTransition = setPlannerWorkspaceSelectedAnimationOptions({
      animationOptions: { spriteState: "ready" },
      placementHistory: sourceHistory,
      selectedPlacementKeys: ["item:1", "item:2"],
    });
    expect(multipleSelectionTransition).toEqual({
      placementHistory: sourceHistory,
      selectedPlacementKeys: ["item:1", "item:2"],
    });
  });

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

  it("previews null and preserves history, selection, and fill tool when filling over invalid held-item table targets", () => {
    const copyInput = createCopyInput();
    const tableHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createLongTable(10, 1, 1), createOccupiedTable(20, 4, 4)],
      nextItemId: 30,
    });
    const selectedChairItem: CatalogItem = {
      allowedTools: ["cursor", "fill"],
      category: "placeable",
      id: "furniture_0",
      name: "Oak Chair",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      tileSize: { width: 1, height: 1 },
      renderingMetadata: {
        kind: "furniture",
        furnitureType: "chair",
        indoors: true,
        outdoors: true,
        rotationSprites: undefined,
        rotationTileSizes: undefined,
        wallMounted: false,
        isRug: false,
        isTable: false,
        isLongTable: false,
        bedType: null,
        compositeSprite: null,
      },
    };

    const longTableFillInput = {
      ...copyInput,
      placementHistory: tableHistory,
      selectedCatalogItem: selectedChairItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      tool: "fill" as const,
      firstTile: { x: 1, y: 1 },
      secondTile: { x: 2, y: 1 },
    };

    expect(previewPlannerWorkspaceFillRectangle(longTableFillInput)).toBeNull();

    const longTableTransition = applyPlannerWorkspaceMapTileRectangle(longTableFillInput);
    expect(longTableTransition.placementHistory).toBe(tableHistory);
    expect(longTableTransition.placementHistory.currentState).toBe(tableHistory.currentState);
    expect(longTableTransition.placementHistory.undoStates).toEqual([]);
    expect(longTableTransition.selectedPlacementKeys).toEqual(copyInput.selectedPlacementKeys);

    expect(isPlannerWorkspaceToolDisabled("fill", selectedChairItem)).toBe(false);
    expect(isPlannerWorkspaceToolAvailable("fill", selectedChairItem)).toBe(true);
    expect(getPlannerWorkspaceToolSelection("fill", selectedChairItem)).toEqual({
      selectedCatalogItem: selectedChairItem,
      selectedCatalogItemId: "furniture_0",
    });

    const occupiedTableFillInput = {
      ...copyInput,
      placementHistory: tableHistory,
      selectedCatalogItem: selectedChairItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      tool: "fill" as const,
      firstTile: { x: 4, y: 4 },
      secondTile: { x: 4, y: 4 },
    };

    expect(previewPlannerWorkspaceFillRectangle(occupiedTableFillInput)).toBeNull();

    const occupiedTableTransition = applyPlannerWorkspaceMapTileRectangle(occupiedTableFillInput);
    expect(occupiedTableTransition.placementHistory).toBe(tableHistory);
    expect(occupiedTableTransition.placementHistory.currentState).toBe(tableHistory.currentState);
    expect(occupiedTableTransition.placementHistory.undoStates).toEqual([]);
    expect(occupiedTableTransition.selectedPlacementKeys).toEqual(copyInput.selectedPlacementKeys);
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

  it("coordinates tool selection and allowedTools filtering between cursor, fill, and empty items", () => {
    const supportedFloorItem: CatalogItem = {
      allowedTools: ["cursor", "fill"],
      category: "floor",
      id: "floor:1",
      name: "Wood Floor",
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
      tileSize: { width: 1, height: 1 },
    };
    const unsupportedDecorItem: CatalogItem = {
      allowedTools: ["cursor"],
      category: "decor",
      id: "decor:1",
      name: "Wallpaper",
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/walls_and_floors.png",
      tileSize: { width: 1, height: 1 },
    };

    expect(getPlannerWorkspaceToolSelection("cursor", supportedFloorItem)).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });
    expect(getPlannerWorkspaceToolSelection("cursor", unsupportedDecorItem)).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });
    expect(getPlannerWorkspaceToolSelection("fill", supportedFloorItem)).toEqual({
      selectedCatalogItem: supportedFloorItem,
      selectedCatalogItemId: "floor:1",
    });
    expect(getPlannerWorkspaceToolSelection("fill", unsupportedDecorItem)).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });
    expect(getPlannerWorkspaceToolSelection("fill", null)).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });
    expect(getPlannerWorkspaceToolSelection("multi-select", supportedFloorItem)).toEqual({
      selectedCatalogItem: supportedFloorItem,
      selectedCatalogItemId: "floor:1",
    });
    expect(getPlannerWorkspaceToolSelection("erase", supportedFloorItem)).toEqual({
      selectedCatalogItem: supportedFloorItem,
      selectedCatalogItemId: "floor:1",
    });

    expect(() => getPlannerWorkspaceToolSelection("invalid-tool" as never, supportedFloorItem)).toThrow(
      'Planner workspace editing tool selection must be null or one of cursor, multi-select, fill, erase; received "invalid-tool".',
    );
  });

  it("reports tool availability and disabled status for pre-selection, supported items, and unsupported items", () => {
    const supportedCropItem: CatalogItem = {
      allowedTools: ["cursor", "fill"],
      category: "crop",
      id: "crop:parsnip",
      name: "Parsnip",
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
      tileSize: { width: 1, height: 1 },
    };
    const unsupportedItem: CatalogItem = {
      allowedTools: ["cursor"],
      category: "decor",
      id: "decor:pattern",
      name: "Pattern Decor",
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/walls_and_floors.png",
      tileSize: { width: 1, height: 1 },
    };

    expect(isPlannerWorkspaceToolDisabled("fill", null)).toBe(false);
    expect(isPlannerWorkspaceToolAvailable("fill", null)).toBe(true);

    expect(isPlannerWorkspaceToolDisabled("fill", supportedCropItem)).toBe(false);
    expect(isPlannerWorkspaceToolAvailable("fill", supportedCropItem)).toBe(true);

    expect(isPlannerWorkspaceToolDisabled("fill", unsupportedItem)).toBe(true);
    expect(isPlannerWorkspaceToolAvailable("fill", unsupportedItem)).toBe(false);

    expect(isPlannerWorkspaceToolDisabled("cursor", unsupportedItem)).toBe(false);
    expect(isPlannerWorkspaceToolAvailable("cursor", unsupportedItem)).toBe(true);

    expect(isPlannerWorkspaceToolDisabled("multi-select", unsupportedItem)).toBe(false);
    expect(isPlannerWorkspaceToolAvailable("multi-select", unsupportedItem)).toBe(true);

    expect(isPlannerWorkspaceToolDisabled("erase", unsupportedItem)).toBe(false);
    expect(isPlannerWorkspaceToolAvailable("erase", unsupportedItem)).toBe(true);

    expect(() => isPlannerWorkspaceToolDisabled("bad" as never, unsupportedItem)).toThrow(
      'Planner workspace editing tool selection must be null or one of cursor, multi-select, fill, erase; received "bad".',
    );
  });

  it("resolves catalog item selection tool according to existing tool and item capabilities", () => {
    const supportedBuildingItem: CatalogItem = {
      allowedTools: ["cursor", "fill"],
      category: "building",
      id: "building:coop",
      name: "Coop",
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/buildings.png",
      tileSize: { width: 6, height: 3 },
    };
    const unsupportedDecorItem: CatalogItem = {
      allowedTools: ["cursor"],
      category: "decor",
      id: "decor:rug",
      name: "Rug Decor",
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      tileSize: { width: 2, height: 2 },
    };

    expect(getPlannerWorkspaceCatalogItemSelectionTool("fill", supportedBuildingItem)).toBe("fill");
    expect(getPlannerWorkspaceCatalogItemSelectionTool("fill", unsupportedDecorItem)).toBe("cursor");
    expect(getPlannerWorkspaceCatalogItemSelectionTool("cursor", supportedBuildingItem)).toBe("cursor");
    expect(getPlannerWorkspaceCatalogItemSelectionTool("cursor", unsupportedDecorItem)).toBe("cursor");
    expect(getPlannerWorkspaceCatalogItemSelectionTool("multi-select", supportedBuildingItem)).toBe("cursor");
    expect(getPlannerWorkspaceCatalogItemSelectionTool("erase", supportedBuildingItem)).toBe("cursor");
    expect(getPlannerWorkspaceCatalogItemSelectionTool(null, supportedBuildingItem)).toBe("cursor");
  });
});
