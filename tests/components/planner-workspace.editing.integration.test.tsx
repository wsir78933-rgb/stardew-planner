import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  type BuildingPlacementMetadataById,
  type CatalogItem,
} from "../../src/catalog";
import {
  createInitialWorkspaceCatalogChoiceState,
  selectWorkspaceCatalogItem,
} from "../../src/planner/planner-workspace-catalog-controls";
import {
  applyPlannerWorkspaceMapTileClick,
  applyPlannerWorkspaceMapTileRectangle,
  applyPlannerWorkspacePlacementSelection,
  deletePlannerWorkspaceSelection,
  duplicatePlannerWorkspaceSelectionAtTile,
  getPlannerWorkspaceCatalogItemSelectionTool,
  getPlannerWorkspaceToolSelection,
  movePlannerWorkspaceSelection,
  cyclePlannerWorkspaceSelectedAppearance,
  setPlannerWorkspaceSelectedBuildingPaint,
  setPlannerWorkspaceSelectedBuildingWaterColor,
  setPlannerWorkspaceSelectedItemTint,
  setPlannerWorkspaceSelectedNightLightState,
} from "../../src/planner/planner-workspace-editing-controller";
import { createReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import { createReferenceProjectWorkspaceController } from "../../src/reference-runtime/use-reference-project-workspace";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createPlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  type PlacementSnapshot,
} from "../../src/placement/placement-snapshot";
import {
  createWorkspaceErasePreviewAtTileInput,
  createWorkspaceEraseRectanglePreviewInput,
  createWorkspaceCatalogPlacementPreviewInput,
  getPlannerCanvasInteractionProperties,
  processPlannerWorkspaceMapTileClick,
  processPlannerWorkspaceSelectionMove,
} from "../../src/components/planner-workspace";
import { createPlannerCanvasPlacementPreviewState } from "../../src/components/planner-canvas";

function createStandardFarmPlacementGrid(): MapPlacementGrid {
  return {
    width: 4,
    height: 4,
    capabilitiesByTile: Array.from({ length: 16 }, () => ({
      buildable: true,
      crabPot: false,
      diggable: true,
      passable: true,
      treePlantable: false,
      treePlantableOnDirt: false,
      wall: false,
    })),
  };
}

function createBuildingMetadataById(): BuildingPlacementMetadataById {
  return {};
}

function createFloorCatalogItem(): CatalogItem {
  return {
    allowedTools: ["cursor", "fill", "multi-select", "erase"],
    category: "floor",
    id: "floor:Stone Floor",
    name: "Stone Floor",
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
    tileSize: { width: 1, height: 1 },
  };
}

function createCropCatalogItem(): CatalogItem {
  return {
    allowedTools: ["cursor", "fill", "multi-select", "erase"],
    category: "crop",
    id: "crop:24",
    name: "Parsnip",
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/1.6.15/objects/Parsnip.png",
    tileSize: { width: 1, height: 1 },
  };
}

function createBeachCabinCatalogItemFromLockedBuildings(): CatalogItem {
  const buildingsPath = resolve(
    process.cwd(),
    "public/game-assets/1.6.15/data/Buildings.json",
  );
  const lockedBuildings = JSON.parse(readFileSync(buildingsPath, "utf8")) as unknown;
  const beachCabinCatalogItem = createBuildingCatalogFromDataset(
    lockedBuildings,
    catalogDatasetUrls.buildings,
  ).items.find((catalogItem) => catalogItem.id === "building:Beach Cabin");

  if (beachCabinCatalogItem === undefined) {
    throw new Error('Locked building catalog did not contain "building:Beach Cabin".');
  }

  return beachCabinCatalogItem;
}

function createDeluxeCoopCatalogItem(): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "building",
    id: "building:Deluxe Coop",
    name: "Deluxe Coop",
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/1.6.15/buildings/Deluxe Coop.png",
    tileSize: { width: 6, height: 3 },
  };
}

function createBuildableDeluxeCoopMetadataById(): BuildingPlacementMetadataById {
  return {
    "Deluxe Coop": {
      size: { width: 6, height: 3 },
      collisionMap: Array.from({ length: 3 }, () =>
        Array.from({ length: 6 }, () => ({ requiresBuildable: true }))),
      additionalPlacementTiles: [],
      humanDoor: { x: -1, y: -1 },
      tilePropertyGrid: [],
    },
  };
}

function createDeluxeCoopPlacementGrid(): MapPlacementGrid {
  const width = 8;
  const height = 6;

  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: true,
      crabPot: false,
      diggable: true,
      passable: true,
      treePlantable: false,
      treePlantableOnDirt: false,
      wall: false,
    })),
  };
}

function createRotatableCatalogItem(): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id: "object:Stone",
    name: "Stone",
    presentationCapabilities: {
      canFlip: false,
      rotation: {
        count: 4,
        footprints: [
          { width: 1, height: 1 },
          { width: 1, height: 1 },
          { width: 1, height: 1 },
          { width: 1, height: 1 },
        ],
      },
      variantCycle: null,
      visibleVariants: [],
    },
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/test.png",
    tileSize: { width: 1, height: 1 },
  };
}

function createAttachableFurnitureCatalogItem(): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id: "furniture_0",
    name: "Oak Chair",
    renderingMetadata: {
      bedType: null,
      compositeSprite: null,
      furnitureType: "chair",
      indoors: true,
      isLongTable: false,
      isRug: false,
      isTable: false,
      kind: "furniture",
      outdoors: false,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: false,
    },
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/test.png",
    tileSize: { width: 1, height: 1 },
  };
}

function createCompositeFurnitureCatalogItem(): CatalogItem {
  return {
    ...createAttachableFurnitureCatalogItem(),
    id: "furniture_FreeCactus",
    name: "Free Cactus",
    renderingMetadata: {
      ...createAttachableFurnitureCatalogItem().renderingMetadata,
      compositeSprite: {
        columns: 8,
        layers: [
          { baseY: 96, count: 16, offsetY: 0 },
          { baseY: 48, count: 24, offsetY: -8 },
          { baseY: 0, count: 24, offsetY: -24 },
        ],
        pieceSize: 16,
      },
      furnitureType: "randomized_plant",
    } as Extract<CatalogItem["renderingMetadata"], { kind: "furniture" }>,
  };
}

describe("workspace catalog placement preview wiring", () => {
  it("passes the selected catalog item and its current presentation choice to Cursor preview", () => {
    const selectedCatalogItem = createRotatableCatalogItem();
    const presentationChoice = { flipped: false, rotation: 2, variant: 0 };
    const expectedPreviewInput = {
      buildingMetadataById: {},
      catalogPresentationChoice: presentationChoice,
      freePlacement: true,
      resolvedCompositeVariant: 4383,
      selectedCatalogItem,
    };

    expect(createWorkspaceCatalogPlacementPreviewInput({
      buildingMetadataById: {},
      freePlacement: true,
      selectedCatalogItem: {
        catalogItem: selectedCatalogItem,
        presentationChoice,
        resolvedCompositeVariant: 4383,
      },
      tool: "cursor",
    })).toEqual(expectedPreviewInput);
    expect(createWorkspaceCatalogPlacementPreviewInput({
      buildingMetadataById: {},
      freePlacement: true,
      selectedCatalogItem: { catalogItem: selectedCatalogItem, presentationChoice },
      tool: "fill",
    })).toBeNull();
    expect(createWorkspaceCatalogPlacementPreviewInput({
      buildingMetadataById: {},
      freePlacement: true,
      selectedCatalogItem: { catalogItem: selectedCatalogItem, presentationChoice },
      tool: null,
    })).toBeNull();
  });
});

describe("workspace eraser preview wiring", () => {
  it("passes ready hover and rectangle inputs independently of catalog selection", () => {
    const placementHistory = createTwoPlacedFloorItemsHistory();
    const buildingMetadataById = createBuildingMetadataById();
    const currentMapPlacementGrid = createStandardFarmPlacementGrid();

    const hoverInput = createWorkspaceErasePreviewAtTileInput({
      buildingMetadataById,
      currentMapPlacementGrid,
      cursorTile: { x: 0, y: 0 },
      placementHistory,
      tool: "erase",
    });
    const rectangleInput = createWorkspaceEraseRectanglePreviewInput({
      buildingMetadataById,
      currentMapPlacementGrid,
      firstTile: { x: 0, y: 0 },
      placementHistory,
      secondTile: { x: 1, y: 0 },
      tool: "erase",
    });

    expect(hoverInput).toEqual({
      buildingMetadataById,
      cursorTile: { x: 0, y: 0 },
      placementHistory,
      tool: "erase",
    });
    expect(rectangleInput).toEqual({
      buildingMetadataById,
      firstTile: { x: 0, y: 0 },
      placementHistory,
      secondTile: { x: 1, y: 0 },
      tool: "erase",
    });
    expect(hoverInput?.placementHistory).toBe(placementHistory);
    expect(rectangleInput?.placementHistory).toBe(placementHistory);
    expect(createWorkspaceErasePreviewAtTileInput({
      buildingMetadataById,
      currentMapPlacementGrid: null,
      cursorTile: { x: 0, y: 0 },
      placementHistory,
      tool: "erase",
    })).toBeNull();
    expect(createWorkspaceEraseRectanglePreviewInput({
      buildingMetadataById: null,
      currentMapPlacementGrid,
      firstTile: { x: 0, y: 0 },
      placementHistory,
      secondTile: { x: 1, y: 0 },
      tool: "erase",
    })).toBeNull();
    expect(createWorkspaceErasePreviewAtTileInput({
      buildingMetadataById,
      currentMapPlacementGrid,
      cursorTile: { x: 0, y: 0 },
      placementHistory,
      tool: "multi-select",
    })).toBeNull();
  });
});

describe("planner canvas interaction properties", () => {
  it("keeps pointer mode independent from wheel zoom while deriving it from tools and placements", () => {
    const cases = [
      {
        expectedPointerInteractionMode: "navigate",
        hasSelectedPlacements: true,
        tool: null,
      },
      {
        expectedPointerInteractionMode: "rectangle",
        hasSelectedPlacements: true,
        tool: "erase",
      },
      {
        expectedPointerInteractionMode: "multi-select",
        hasSelectedPlacements: true,
        tool: "multi-select",
      },
      {
        expectedPointerInteractionMode: "navigate",
        hasPendingPlacementCopy: true,
        hasSelectedPlacements: true,
        tool: "multi-select",
      },
      {
        expectedPointerInteractionMode: "rectangle",
        hasSelectedPlacements: true,
        tool: "fill",
      },
      {
        expectedPointerInteractionMode: "move-selected",
        hasSelectedPlacements: true,
        tool: "cursor",
      },
      {
        expectedPointerInteractionMode: "navigate",
        hasSelectedPlacements: false,
        tool: "cursor",
      },
    ] as const;

    for (const canvasInteractionCase of cases) {
      for (const wheelZoomEnabled of [false, true]) {
        expect(
          getPlannerCanvasInteractionProperties({
            hasPendingPlacementCopy:
              "hasPendingPlacementCopy" in canvasInteractionCase
                ? canvasInteractionCase.hasPendingPlacementCopy
                : false,
            hasSelectedPlacements: canvasInteractionCase.hasSelectedPlacements,
            tool: canvasInteractionCase.tool,
            wheelZoomEnabled,
          }),
        ).toEqual({
          pointerInteractionMode:
            canvasInteractionCase.expectedPointerInteractionMode,
          wheelZoomEnabled,
        });
      }
    }
  });
});

describe("catalog item selection tools", () => {
  it.each(["cursor", "multi-select", "erase", "fill", null] as const)(
    "uses Cursor for a building selected while the current tool is %s, then previews and places it",
    (currentTool) => {
      const catalogItem = createDeluxeCoopCatalogItem();
      const buildingMetadataById = createBuildableDeluxeCoopMetadataById();
      const placementGrid = createDeluxeCoopPlacementGrid();
      const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
      const presentationChoice = { flipped: false, rotation: 0, variant: 0 };
      const selectedCatalogItem = { catalogItem, presentationChoice };
      const selectionTool = getPlannerWorkspaceCatalogItemSelectionTool(
        currentTool,
        catalogItem,
      );

      expect(selectionTool).toBe("cursor");

      const placementPreviewInput = createWorkspaceCatalogPlacementPreviewInput({
        buildingMetadataById,
        freePlacement: false,
        selectedCatalogItem,
        tool: selectionTool,
      });
      expect(placementPreviewInput).not.toBeNull();
      if (placementPreviewInput === null) {
        throw new Error("A selected Deluxe Coop must produce a Cursor preview input.");
      }

      const placementPreview = createPlannerCanvasPlacementPreviewState({
        hoveredMapTile: { x: 1, y: 1 },
        mapPlacementGrid: placementGrid,
        placementPreview: placementPreviewInput,
        placementSnapshot: placementHistory.currentState,
      });
      expect(placementPreview).not.toBeNull();

      const placementTransition = applyPlannerWorkspaceMapTileClick({
        buildingMetadataById,
        catalogPresentationChoice: presentationChoice,
        cursorTile: { x: 1, y: 1 },
        freePlacement: false,
        mapPlacementGrid: placementGrid,
        placementHistory,
        selectedCatalogItem: catalogItem,
        selectedPlacementKeys: [],
        tool: selectionTool,
      });

      expect(placementTransition.placementHistory.currentState.buildings).toEqual([
        { buildingId: "Deluxe Coop", instanceId: 1, x: 1, y: 1 },
      ]);
      expect(placementTransition.placementHistory.undoStates).toEqual([
        placementHistory.currentState,
      ]);
      const undonePlacementHistory = undoPlacementHistory(
        placementTransition.placementHistory,
      );
      expect(undonePlacementHistory.currentState.buildings).toEqual([]);
      expect(undonePlacementHistory.redoStates).toEqual([
        placementTransition.placementHistory.currentState,
      ]);
    },
  );

  it.each([
    { category: "floor", catalogItem: createFloorCatalogItem() },
    { category: "crop", catalogItem: createCropCatalogItem() },
  ])("keeps Fill for fill-compatible $category items", ({ catalogItem }) => {
    const selectionTool = getPlannerWorkspaceCatalogItemSelectionTool(
      "fill",
      catalogItem,
    );
    expect(selectionTool).toBe("fill");

    const fillTransition = applyPlannerWorkspaceMapTileRectangle({
      ...createEditingInput(),
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      selectedCatalogItem: catalogItem,
      tool: selectionTool,
    });
    const placedRecords = catalogItem.category === "crop"
      ? fillTransition.placementHistory.currentState.crops
      : fillTransition.placementHistory.currentState.items;

    expect(placedRecords).toHaveLength(2);
  });

  it("keeps the locked Beach Cabin available to Fill when the tool or building is selected first", () => {
    const beachCabinCatalogItem = createBeachCabinCatalogItemFromLockedBuildings();
    const fillSelectedBeforeBuilding = getPlannerWorkspaceToolSelection(
      "fill",
      null,
    );
    const toolAfterBuildingSelection =
      getPlannerWorkspaceCatalogItemSelectionTool(
        "fill",
        beachCabinCatalogItem,
      );
    const fillSelectedAfterBuilding = getPlannerWorkspaceToolSelection(
      "fill",
      beachCabinCatalogItem,
    );

    expect(fillSelectedBeforeBuilding).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });
    expect(toolAfterBuildingSelection).toBe("fill");
    expect(fillSelectedAfterBuilding).toEqual({
      selectedCatalogItem: beachCabinCatalogItem,
      selectedCatalogItemId: "building:Beach Cabin",
    });
    expect(
      getPlannerWorkspaceCatalogItemSelectionTool(
        "fill",
        fillSelectedAfterBuilding.selectedCatalogItem!,
      ),
    ).toBe("fill");
  });
});

function createEditingInput(
  placementSnapshot: PlacementSnapshot = createEmptyPlacementSnapshot(),
) {
  return {
    buildingMetadataById: createBuildingMetadataById(),
    freePlacement: false,
    mapPlacementGrid: createStandardFarmPlacementGrid(),
    placementHistory: createPlacementHistory(placementSnapshot),
    catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
    selectedCatalogItem: createFloorCatalogItem(),
    selectedPlacementKeys: [],
  };
}

function createTwoPlacedFloorItemsHistory() {
  const editingInput = createEditingInput();
  const firstPlacementTransition = applyPlannerWorkspaceMapTileClick({
    ...editingInput,
    cursorTile: { x: 0, y: 0 },
    tool: "cursor",
  });
  const secondPlacementTransition = applyPlannerWorkspaceMapTileClick({
    ...editingInput,
    cursorTile: { x: 1, y: 0 },
    placementHistory: firstPlacementTransition.placementHistory,
    tool: "cursor",
  });

  return secondPlacementTransition.placementHistory;
}

function createAdapterSupportedStandardFarmDocument() {
  const standardFarmProject = structuredClone(referenceProjectDocumentFixture.projects[0]);
  if (standardFarmProject === undefined) {
    throw new Error("Expected the canonical fixture to contain a Standard Farm project.");
  }
  standardFarmProject.project.maps = standardFarmProject.project.maps.map(
    (projectMap) => ({
      ...projectMap,
      decor: { floors: {}, wallpapers: {} },
      renovations: [],
      state: {
        buildings: [],
        crops: [],
        items: [],
        nextBuildingId: 1,
        nextItemId: 1,
      },
    }),
  );

  return { projects: [standardFarmProject], version: 1 } as const;
}

describe("planner workspace basic editing orchestration", () => {
  it("leaves valid click and rectangle input unchanged for no tool", () => {
    const initialEditingInput = createEditingInput();

    for (const tool of [null] as const) {
      const clickTransition = applyPlannerWorkspaceMapTileClick({
        ...initialEditingInput,
        cursorTile: { x: 1, y: 1 },
        tool,
      });
      const rectangleTransition = applyPlannerWorkspaceMapTileRectangle({
        ...initialEditingInput,
        firstTile: { x: 0, y: 0 },
        secondTile: { x: 1, y: 1 },
        tool,
      });

      expect(clickTransition.placementHistory).toBe(
        initialEditingInput.placementHistory,
      );
      expect(clickTransition.selectedPlacementKeys).toBe(
        initialEditingInput.selectedPlacementKeys,
      );
      expect(rectangleTransition.placementHistory).toBe(
        initialEditingInput.placementHistory,
      );
      expect(rectangleTransition.selectedPlacementKeys).toBe(
        initialEditingInput.selectedPlacementKeys,
      );
    }
  });

  it("leaves map clicks unchanged when no tool is selected", () => {
    const initialEditingInput = createEditingInput();
    const placedTransition = applyPlannerWorkspaceMapTileClick({
      ...initialEditingInput,
      cursorTile: { x: 1, y: 1 },
      tool: "cursor",
    });

    const noToolTransition = applyPlannerWorkspaceMapTileClick({
      ...initialEditingInput,
      catalogPresentationChoice: null,
      cursorTile: { x: 1, y: 1 },
      placementHistory: placedTransition.placementHistory,
      selectedCatalogItem: null,
      selectedPlacementKeys: [],
      tool: null,
    });

    expect(noToolTransition.placementHistory).toBe(
      placedTransition.placementHistory,
    );
    expect(noToolTransition.selectedPlacementKeys).toEqual([]);
  });

  it("leaves map rectangles unchanged when no tool is selected", () => {
    const initialEditingInput = createEditingInput();
    const placedTransition = applyPlannerWorkspaceMapTileClick({
      ...initialEditingInput,
      cursorTile: { x: 1, y: 1 },
      tool: "cursor",
    });
    const selectedPlacementKeys = ["item:1"] as const;

    const noToolRectangleTransition = applyPlannerWorkspaceMapTileRectangle({
      ...initialEditingInput,
      firstTile: { x: 0, y: 0 },
      placementHistory: placedTransition.placementHistory,
      secondTile: { x: 1, y: 1 },
      selectedPlacementKeys,
      tool: null,
    });

    expect(noToolRectangleTransition.placementHistory).toBe(
      placedTransition.placementHistory,
    );
    expect(noToolRectangleTransition.placementHistory.currentState).toBe(
      placedTransition.placementHistory.currentState,
    );
    expect(noToolRectangleTransition.selectedPlacementKeys).toBe(
      selectedPlacementKeys,
    );
  });

  it("processes a successful selected-item Cursor click and advances exactly once", () => {
    const editingInput = createEditingInput();
    const applyEditingTransition = vi.fn();
    const advanceSelectedCatalogPlacementAttempt = vi.fn();
    const clearPendingDuplicateSelection = vi.fn();

    processPlannerWorkspaceMapTileClick({
      advanceSelectedCatalogPlacementAttempt,
      applyEditingTransition,
      buildingMetadataById: editingInput.buildingMetadataById,
      clearPendingDuplicateSelection,
      cursorTile: { x: 1, y: 1 },
      freePlacement: editingInput.freePlacement,
      getRequiredCurrentMapPlacementGrid: () => editingInput.mapPlacementGrid,
      mapId: "standard",
      pendingDuplicateSelectionKeys: null,
      placementHistory: editingInput.placementHistory,
      readyCatalogItems: [editingInput.selectedCatalogItem],
      selectedCatalogItem: {
        catalogItem: editingInput.selectedCatalogItem,
        presentationChoice: editingInput.catalogPresentationChoice,
      },
      selectedPlacementKeys: editingInput.selectedPlacementKeys,
      tool: "cursor",
    });

    expect(applyEditingTransition).toHaveBeenCalledTimes(1);
    expect(applyEditingTransition).toHaveBeenCalledWith(
      expect.objectContaining({
        currentState: expect.objectContaining({
          items: [
            expect.objectContaining({
              instanceId: 1,
              itemId: "floor:Stone Floor",
              layer: "path",
              x: 1,
              y: 1,
            }),
          ],
        }),
      }),
      [],
    );
    expect(advanceSelectedCatalogPlacementAttempt).toHaveBeenCalledTimes(1);
    expect(clearPendingDuplicateSelection).toHaveBeenCalledTimes(1);
  });

  it("keeps an invalid selected-item Cursor click unchanged and does not advance", () => {
    const editingInput = createEditingInput();
    const applyEditingTransition = vi.fn();
    const advanceSelectedCatalogPlacementAttempt = vi.fn();
    const clearPendingDuplicateSelection = vi.fn();

    processPlannerWorkspaceMapTileClick({
      advanceSelectedCatalogPlacementAttempt,
      applyEditingTransition,
      buildingMetadataById: editingInput.buildingMetadataById,
      clearPendingDuplicateSelection,
      cursorTile: { x: 99, y: 99 },
      freePlacement: editingInput.freePlacement,
      getRequiredCurrentMapPlacementGrid: () => editingInput.mapPlacementGrid,
      mapId: "standard",
      pendingDuplicateSelectionKeys: null,
      placementHistory: editingInput.placementHistory,
      readyCatalogItems: [editingInput.selectedCatalogItem],
      selectedCatalogItem: {
        catalogItem: editingInput.selectedCatalogItem,
        presentationChoice: editingInput.catalogPresentationChoice,
      },
      selectedPlacementKeys: editingInput.selectedPlacementKeys,
      tool: "cursor",
    });

    expect(applyEditingTransition).toHaveBeenCalledTimes(1);
    expect(applyEditingTransition).toHaveBeenCalledWith(
      editingInput.placementHistory,
      editingInput.selectedPlacementKeys,
    );
    expect(advanceSelectedCatalogPlacementAttempt).not.toHaveBeenCalled();
    expect(clearPendingDuplicateSelection).toHaveBeenCalledTimes(1);
  });

  it("does not advance a selected catalog attempt during pending duplicate mode", () => {
    const editingInput = createEditingInput();
    const placedHistory = applyPlannerWorkspaceMapTileClick({
      ...editingInput,
      cursorTile: { x: 0, y: 0 },
      tool: "cursor",
    }).placementHistory;
    const applyEditingTransition = vi.fn();
    const advanceSelectedCatalogPlacementAttempt = vi.fn();
    const clearPendingDuplicateSelection = vi.fn();

    processPlannerWorkspaceMapTileClick({
      advanceSelectedCatalogPlacementAttempt,
      applyEditingTransition,
      buildingMetadataById: editingInput.buildingMetadataById,
      clearPendingDuplicateSelection,
      cursorTile: { x: 1, y: 1 },
      freePlacement: editingInput.freePlacement,
      getRequiredCurrentMapPlacementGrid: () => editingInput.mapPlacementGrid,
      mapId: "standard",
      pendingDuplicateSelectionKeys: ["item:1"],
      placementHistory: placedHistory,
      readyCatalogItems: [editingInput.selectedCatalogItem],
      selectedCatalogItem: {
        catalogItem: editingInput.selectedCatalogItem,
        presentationChoice: editingInput.catalogPresentationChoice,
      },
      selectedPlacementKeys: ["item:1"],
      tool: "cursor",
    });

    expect(applyEditingTransition).toHaveBeenCalledTimes(1);
    expect(advanceSelectedCatalogPlacementAttempt).not.toHaveBeenCalled();
    expect(clearPendingDuplicateSelection).toHaveBeenCalledTimes(1);
  });

  it("keeps a pending multi-placement copy after an invalid tile and commits it at the next valid tile", () => {
    const editingInput = createEditingInput();
    const placementHistory = createPlacementHistory<PlacementSnapshot>({
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 2, y: 2 }],
      items: [
        {
          bedType: null,
          flipped: false,
          footprint: { width: 1, height: 1 },
          instanceId: 1,
          isGrass: false,
          isLongTable: false,
          isRug: false,
          isTable: false,
          itemId: "floor:Stone Floor",
          layer: "path",
          locked: false,
          rotation: 0,
          tintColor: "#ffffff",
          variant: 0,
          x: 0,
          y: 0,
        },
        {
          bedType: null,
          flipped: false,
          footprint: { width: 1, height: 1 },
          instanceId: 2,
          isGrass: false,
          isLongTable: false,
          isRug: false,
          isTable: false,
          itemId: "floor:Stone Floor",
          layer: "path",
          locked: false,
          rotation: 0,
          tintColor: "#ffffff",
          variant: 0,
          x: 1,
          y: 0,
        },
      ],
      nextItemId: 3,
    });
    const applyEditingTransition = vi.fn();
    const advanceSelectedCatalogPlacementAttempt = vi.fn();
    const clearPendingDuplicateSelection = vi.fn();

    processPlannerWorkspaceMapTileClick({
      advanceSelectedCatalogPlacementAttempt,
      applyEditingTransition,
      buildingMetadataById: editingInput.buildingMetadataById,
      clearPendingDuplicateSelection,
      cursorTile: { x: 2, y: 2 },
      freePlacement: editingInput.freePlacement,
      getRequiredCurrentMapPlacementGrid: () => editingInput.mapPlacementGrid,
      mapId: "standard",
      pendingDuplicateSelectionKeys: ["item:1", "item:2"],
      placementHistory,
      readyCatalogItems: [editingInput.selectedCatalogItem],
      selectedCatalogItem: null,
      selectedPlacementKeys: ["item:1", "item:2"],
      tool: "multi-select",
    });

    expect(applyEditingTransition).toHaveBeenCalledTimes(1);
    expect(applyEditingTransition).toHaveBeenNthCalledWith(
      1,
      placementHistory,
      ["item:1", "item:2"],
    );
    expect(clearPendingDuplicateSelection).not.toHaveBeenCalled();

    processPlannerWorkspaceMapTileClick({
      advanceSelectedCatalogPlacementAttempt,
      applyEditingTransition,
      buildingMetadataById: editingInput.buildingMetadataById,
      clearPendingDuplicateSelection,
      cursorTile: { x: 0, y: 2 },
      freePlacement: editingInput.freePlacement,
      getRequiredCurrentMapPlacementGrid: () => editingInput.mapPlacementGrid,
      mapId: "standard",
      pendingDuplicateSelectionKeys: ["item:1", "item:2"],
      placementHistory,
      readyCatalogItems: [editingInput.selectedCatalogItem],
      selectedCatalogItem: null,
      selectedPlacementKeys: ["item:1", "item:2"],
      tool: "multi-select",
    });

    expect(applyEditingTransition).toHaveBeenCalledTimes(2);
    expect(applyEditingTransition).toHaveBeenNthCalledWith(
      1,
      placementHistory,
      ["item:1", "item:2"],
    );
    expect(applyEditingTransition).toHaveBeenCalledWith(
      expect.objectContaining({
        currentState: expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({ instanceId: 3, x: 0, y: 2 }),
            expect.objectContaining({ instanceId: 4, x: 1, y: 2 }),
          ]),
        }),
      }),
      ["item:3", "item:4"],
    );
    expect(advanceSelectedCatalogPlacementAttempt).not.toHaveBeenCalled();
    expect(clearPendingDuplicateSelection).toHaveBeenCalledTimes(1);
  });

  it("passes the selected attempt composite variant through cursor placement", () => {
    const placementTransition = applyPlannerWorkspaceMapTileClick({
      ...createEditingInput(),
      cursorTile: { x: 1, y: 1 },
      freePlacement: true,
      resolvedCompositeVariant: 4383,
      selectedCatalogItem: createCompositeFurnitureCatalogItem(),
      tool: "cursor",
    });

    expect(placementTransition.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        itemId: "furniture_FreeCactus",
        variant: 4383,
      }),
    ]);
  });

  it("clears the catalog selection with the Cursor tool so the next click selects instead of placing", () => {
    const initialEditingInput = createEditingInput();
    const placedTransition = applyPlannerWorkspaceMapTileClick({
      ...initialEditingInput,
      cursorTile: { x: 1, y: 1 },
      tool: "cursor",
    });

    const cursorToolSelection = getPlannerWorkspaceToolSelection(
      "cursor",
      initialEditingInput.selectedCatalogItem,
    );
    const selectedTransition = applyPlannerWorkspaceMapTileClick({
      ...initialEditingInput,
      cursorTile: { x: 1, y: 1 },
      placementHistory: placedTransition.placementHistory,
      catalogPresentationChoice: null,
      selectedCatalogItem: cursorToolSelection.selectedCatalogItem,
      tool: "cursor",
    });

    expect(cursorToolSelection).toEqual({
      selectedCatalogItem: null,
      selectedCatalogItemId: null,
    });
    expect(selectedTransition.placementHistory).toBe(placedTransition.placementHistory);
    expect(selectedTransition.selectedPlacementKeys).toEqual(["item:1"]);
  });

  it("toggles placement keys in and out of a Multi selection without changing history", () => {
    const placementHistory = createPlacementHistory<PlacementSnapshot>({
      ...createEmptyPlacementSnapshot(),
      items: [{
        bedType: null,
        flipped: false,
        footprint: { width: 1, height: 1 },
        instanceId: 1,
        isGrass: false,
        isLongTable: false,
        isRug: false,
        isTable: false,
        itemId: "floor:Stone Floor",
        layer: "path",
        locked: false,
        rotation: 0,
        tintColor: "#ffffff",
        variant: 0,
        x: 1,
        y: 1,
      }, {
        bedType: null,
        flipped: false,
        footprint: { width: 1, height: 1 },
        instanceId: 2,
        isGrass: false,
        isLongTable: false,
        isRug: false,
        isTable: false,
        itemId: "floor:Stone Floor",
        layer: "path",
        locked: false,
        rotation: 0,
        tintColor: "#ffffff",
        variant: 0,
        x: 2,
        y: 1,
      }],
      nextItemId: 3,
    });

    const selectedTransition = applyPlannerWorkspacePlacementSelection({
      placementHistory,
      placementSelectionKeys: ["item:1"],
    });

    expect(selectedTransition.placementHistory).toBe(placementHistory);
    expect(selectedTransition.selectedPlacementKeys).toEqual(["item:1"]);

    const addedSelectionTransition = applyPlannerWorkspacePlacementSelection({
      placementHistory,
      placementSelectionKeys: ["item:2"],
      selectedPlacementKeys: selectedTransition.selectedPlacementKeys,
      toggleSelection: true,
    });
    expect(addedSelectionTransition.placementHistory).toBe(placementHistory);
    expect(addedSelectionTransition.selectedPlacementKeys).toEqual([
      "item:1",
      "item:2",
    ]);

    const removedSelectionTransition = applyPlannerWorkspacePlacementSelection({
      placementHistory,
      placementSelectionKeys: ["item:1"],
      selectedPlacementKeys: addedSelectionTransition.selectedPlacementKeys,
      toggleSelection: true,
    });
    expect(removedSelectionTransition.selectedPlacementKeys).toEqual(["item:2"]);

    const emptyClickTransition = applyPlannerWorkspacePlacementSelection({
      placementHistory,
      placementSelectionKeys: [],
      selectedPlacementKeys: removedSelectionTransition.selectedPlacementKeys,
      toggleSelection: true,
    });
    expect(emptyClickTransition.selectedPlacementKeys).toEqual([]);
  });

  it("places with the cursor, selects without a catalog item, and keeps the complete transition at each step", () => {
    const initialEditingInput = createEditingInput();

    const placedTransition = applyPlannerWorkspaceMapTileClick({
      ...initialEditingInput,
      cursorTile: { x: 1, y: 1 },
      tool: "cursor",
    });

    expect(placedTransition.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        instanceId: 1,
        itemId: "floor:Stone Floor",
        layer: "path",
        x: 1,
        y: 1,
      }),
    ]);
    expect(placedTransition.selectedPlacementKeys).toEqual([]);

    const selectedTransition = applyPlannerWorkspaceMapTileClick({
      ...initialEditingInput,
      catalogPresentationChoice: null,
      placementHistory: placedTransition.placementHistory,
      selectedCatalogItem: null,
      selectedPlacementKeys: [],
      cursorTile: { x: 1, y: 1 },
      tool: "cursor",
    });

    expect(selectedTransition.placementHistory).toBe(placedTransition.placementHistory);
    expect(selectedTransition.selectedPlacementKeys).toEqual(["item:1"]);
  });

  it("attaches pending furniture, clears placement selection, and leaves the pending catalog choice outside the transition", () => {
    const selectedCatalogItem = createAttachableFurnitureCatalogItem();
    const catalogPresentationChoice = {
      flipped: false,
      rotation: 0,
      variant: 0,
    } as const;
    const placementHistory = createPlacementHistory<PlacementSnapshot>({
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          bedType: null,
          flipped: false,
          footprint: { width: 2, height: 2 },
          instanceId: 1,
          isGrass: false,
          isLongTable: false,
          isRug: false,
          isTable: true,
          itemId: "furniture_724",
          layer: "item",
          locked: false,
          rotation: 0,
          tintColor: "#ffffff",
          variant: 0,
          x: 1,
          y: 1,
        },
      ],
      nextItemId: 5,
    });
    const transitionInput = {
      buildingMetadataById: createBuildingMetadataById(),
      catalogPresentationChoice,
      cursorTile: { x: 2, y: 2 },
      freePlacement: false,
      mapPlacementGrid: createStandardFarmPlacementGrid(),
      placementHistory,
      selectedCatalogItem,
      selectedPlacementKeys: ["item:1"],
      tool: "cursor" as const,
    };

    const transition = applyPlannerWorkspaceMapTileClick(transitionInput);

    expect(transition.placementHistory.currentState.items[0]?.heldItem).toMatchObject({
      instanceId: 5,
      itemId: "furniture_0",
      variant: 0,
      x: 2,
      y: 2,
    });
    expect(transition.placementHistory.currentState.nextItemId).toBe(6);
    expect(transition.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(transition.selectedPlacementKeys).toEqual([]);
    expect(transitionInput.selectedCatalogItem).toBe(selectedCatalogItem);
    expect(transitionInput.catalogPresentationChoice).toBe(catalogPresentationChoice);
    expect(transition).not.toHaveProperty("selectedCatalogItem");
    expect(transition).not.toHaveProperty("catalogPresentationChoice");
  });

  it("routes multi-select, fill, and erase rectangles through their existing controller contracts", () => {
    const initialEditingInput = createEditingInput();
    const selectedTransition = applyPlannerWorkspaceMapTileRectangle({
      ...initialEditingInput,
      placementHistory: createPlacementHistory<PlacementSnapshot>({
        ...createEmptyPlacementSnapshot(),
        items: [
          {
            bedType: null,
            flipped: false,
            footprint: { width: 1, height: 1 },
            instanceId: 1,
            isGrass: false,
            isLongTable: false,
            isRug: false,
            isTable: false,
            itemId: "floor:Stone Floor",
            layer: "path",
            locked: false,
            rotation: 0,
            tintColor: "#ffffff",
            variant: 0,
            x: 0,
            y: 0,
          },
        ],
        nextItemId: 2,
      }),
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 0, y: 0 },
      tool: "multi-select",
    });

    expect(selectedTransition.selectedPlacementKeys).toEqual(["item:1"]);

    const filledTransition = applyPlannerWorkspaceMapTileRectangle({
      ...initialEditingInput,
      firstTile: { x: 1, y: 1 },
      secondTile: { x: 2, y: 1 },
      tool: "fill",
    });

    expect(filledTransition.placementHistory.currentState.items).toHaveLength(2);

    const erasedTransition = applyPlannerWorkspaceMapTileRectangle({
      ...initialEditingInput,
      placementHistory: filledTransition.placementHistory,
      selectedPlacementKeys: ["item:1"],
      firstTile: { x: 1, y: 1 },
      secondTile: { x: 2, y: 1 },
      tool: "erase",
    });

    expect(erasedTransition.placementHistory.currentState.items).toEqual([]);
    expect(erasedTransition.selectedPlacementKeys).toEqual([]);
  });

  it("passes one validated catalog choice through cursor placement and fill", () => {
    const controlledFloorItem: CatalogItem = {
      ...createFloorCatalogItem(),
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
    };
    const controlledEditingInput = {
      ...createEditingInput(),
      catalogPresentationChoice: { flipped: true, rotation: 1, variant: 1 },
      freePlacement: true,
      selectedCatalogItem: controlledFloorItem,
    } as const;
    const placedTransition = applyPlannerWorkspaceMapTileClick({
      ...controlledEditingInput,
      cursorTile: { x: 0, y: 0 },
      tool: "cursor",
    });
    expect(placedTransition.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        flipped: true,
        rotation: 1,
        variant: 1,
      }),
    ]);

    const filledTransition = applyPlannerWorkspaceMapTileRectangle({
      ...controlledEditingInput,
      firstTile: { x: 1, y: 0 },
      secondTile: { x: 2, y: 0 },
      tool: "fill",
    });
    expect(filledTransition.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ flipped: true, rotation: 1, variant: 1 }),
      expect.objectContaining({ flipped: true, rotation: 1, variant: 1 }),
    ]);
  });

  it("fails fast on mismatched catalog item and choice pairs for every workspace tool", () => {
    const selectedCatalogItemWithoutChoice = {
      ...createEditingInput(),
      catalogPresentationChoice: null,
    };
    const choiceWithoutSelectedCatalogItem = {
      ...createEditingInput(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      selectedCatalogItem: null,
    };

    for (const tool of ["cursor", "erase"] as const) {
      expect(() => applyPlannerWorkspaceMapTileClick({
        ...selectedCatalogItemWithoutChoice,
        cursorTile: { x: 0, y: 0 },
        tool,
      })).toThrow(/floor:Stone Floor.*catalogPresentationChoice.*null/s);
      expect(() => applyPlannerWorkspaceMapTileClick({
        ...choiceWithoutSelectedCatalogItem,
        cursorTile: { x: 0, y: 0 },
        tool,
      })).toThrow(/selectedCatalogItem.*null.*catalogPresentationChoice.*rotation.*0/s);
    }

    for (const tool of ["multi-select", "fill"] as const) {
      expect(() => applyPlannerWorkspaceMapTileRectangle({
        ...selectedCatalogItemWithoutChoice,
        firstTile: { x: 0, y: 0 },
        secondTile: { x: 0, y: 0 },
        tool,
      })).toThrow(/floor:Stone Floor.*catalogPresentationChoice.*null/s);
      expect(() => applyPlannerWorkspaceMapTileRectangle({
        ...choiceWithoutSelectedCatalogItem,
        firstTile: { x: 0, y: 0 },
        secondTile: { x: 0, y: 0 },
        tool,
      })).toThrow(/selectedCatalogItem.*null.*catalogPresentationChoice.*rotation.*0/s);
    }
  });

  it("moves an existing selection through the selection controller and preserves an invalid transition", () => {
    const placementHistory = createPlacementHistory<PlacementSnapshot>({
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          bedType: null,
          flipped: false,
          footprint: { width: 1, height: 1 },
          instanceId: 1,
          isGrass: false,
          isLongTable: false,
          isRug: false,
          isTable: false,
          itemId: "object:Stone",
          layer: "item",
          locked: false,
          rotation: 0,
          tintColor: "#ffffff",
          variant: 0,
          x: 1,
          y: 1,
        },
      ],
      nextItemId: 2,
    });

    const movedTransition = movePlannerWorkspaceSelection({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createRotatableCatalogItem()],
      freePlacement: false,
      mapPlacementGrid: createStandardFarmPlacementGrid(),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 1, y: 0 },
    });

    expect(movedTransition.placementHistory.currentState.items[0]).toMatchObject({
      instanceId: 1,
      x: 2,
      y: 1,
    });
    expect(movedTransition.selectedPlacementKeys).toEqual(["item:1"]);

    const invalidTransition = movePlannerWorkspaceSelection({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createRotatableCatalogItem()],
      freePlacement: false,
      mapPlacementGrid: createStandardFarmPlacementGrid(),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
      tileDelta: { x: 0, y: 0 },
    });

    expect(invalidTransition).toEqual({
      placementHistory,
      selectedPlacementKeys: ["item:1"],
    });
  });

  it("clears a moved Multi group and returns to Select only after a successful move", () => {
    const placementHistory = createTwoPlacedFloorItemsHistory();
    const selectedPlacementKeys = ["item:1", "item:2"] as const;
    const editingTransition = movePlannerWorkspaceSelection({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createFloorCatalogItem()],
      freePlacement: false,
      mapPlacementGrid: createStandardFarmPlacementGrid(),
      placementHistory,
      selectedPlacementKeys,
      tileDelta: { x: 1, y: 1 },
    });
    const applyEditingTransition = vi.fn();
    const onToolChange = vi.fn();

    processPlannerWorkspaceSelectionMove({
      applyEditingTransition,
      editingTransition,
      onToolChange,
      placementHistory,
      tool: "multi-select",
    });

    expect(editingTransition.placementHistory).not.toBe(placementHistory);
    expect(editingTransition.placementHistory.currentState.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ instanceId: 1, x: 1, y: 1 }),
        expect.objectContaining({ instanceId: 2, x: 2, y: 1 }),
      ]),
    );
    expect(applyEditingTransition).toHaveBeenCalledWith(
      editingTransition.placementHistory,
      [],
    );
    expect(onToolChange).toHaveBeenCalledTimes(1);
    expect(onToolChange).toHaveBeenCalledWith("cursor");
  });

  it("preserves Multi selection and tool when a group move is invalid", () => {
    const placementHistory = createTwoPlacedFloorItemsHistory();
    const selectedPlacementKeys = ["item:1", "item:2"] as const;
    const editingTransition = movePlannerWorkspaceSelection({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createFloorCatalogItem()],
      freePlacement: false,
      mapPlacementGrid: createStandardFarmPlacementGrid(),
      placementHistory,
      selectedPlacementKeys,
      tileDelta: { x: 0, y: 0 },
    });
    const applyEditingTransition = vi.fn();
    const onToolChange = vi.fn();

    processPlannerWorkspaceSelectionMove({
      applyEditingTransition,
      editingTransition,
      onToolChange,
      placementHistory,
      tool: "multi-select",
    });

    expect(editingTransition.placementHistory).toBe(placementHistory);
    expect(applyEditingTransition).toHaveBeenCalledWith(
      placementHistory,
      selectedPlacementKeys,
    );
    expect(onToolChange).not.toHaveBeenCalled();
  });

  it("preserves the selection and Cursor tool after a successful single-item move", () => {
    const placementHistory = createTwoPlacedFloorItemsHistory();
    const selectedPlacementKeys = ["item:1"] as const;
    const editingTransition = movePlannerWorkspaceSelection({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createFloorCatalogItem()],
      freePlacement: false,
      mapPlacementGrid: createStandardFarmPlacementGrid(),
      placementHistory,
      selectedPlacementKeys,
      tileDelta: { x: 0, y: 1 },
    });
    const applyEditingTransition = vi.fn();
    const onToolChange = vi.fn();

    processPlannerWorkspaceSelectionMove({
      applyEditingTransition,
      editingTransition,
      onToolChange,
      placementHistory,
      tool: "cursor",
    });

    expect(editingTransition.placementHistory).not.toBe(placementHistory);
    expect(applyEditingTransition).toHaveBeenCalledWith(
      editingTransition.placementHistory,
      selectedPlacementKeys,
    );
    expect(onToolChange).not.toHaveBeenCalled();
  });

  it("rotates, duplicates at a requested tile, and deletes through selection-controller transitions", () => {
    const placementHistory = createPlacementHistory<PlacementSnapshot>({
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          bedType: null,
          flipped: false,
          footprint: { width: 1, height: 1 },
          instanceId: 1,
          isGrass: false,
          isLongTable: false,
          isRug: false,
          isTable: false,
          itemId: "object:Stone",
          layer: "item",
          locked: false,
          rotation: 0,
          tintColor: "#ffffff",
          variant: 0,
          x: 1,
          y: 1,
        },
      ],
      nextItemId: 2,
    });

    const appearanceCycleTransition = cyclePlannerWorkspaceSelectedAppearance({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createRotatableCatalogItem()],
      freePlacement: false,
      mapPlacementGrid: createStandardFarmPlacementGrid(),
      placementHistory,
      selectedPlacementKeys: ["item:1"],
    });

    expect(appearanceCycleTransition.placementHistory.currentState.items[0]).toMatchObject({
      instanceId: 1,
      rotation: 1,
    });
    expect(appearanceCycleTransition.selectedPlacementKeys).toEqual(["item:1"]);

    const duplicatedTransition = duplicatePlannerWorkspaceSelectionAtTile({
      buildingMetadataById: createBuildingMetadataById(),
      catalogItems: [createRotatableCatalogItem()],
      cursorTile: { x: 2, y: 1 },
      freePlacement: false,
      mapPlacementGrid: createStandardFarmPlacementGrid(),
      placementHistory: appearanceCycleTransition.placementHistory,
      selectedPlacementKeys: appearanceCycleTransition.selectedPlacementKeys,
    });

    expect(duplicatedTransition.placementHistory.currentState.items).toHaveLength(2);
    expect(duplicatedTransition.selectedPlacementKeys).toEqual(["item:2"]);

    const deletedTransition = deletePlannerWorkspaceSelection({
      placementHistory: duplicatedTransition.placementHistory,
      selectedPlacementKeys: duplicatedTransition.selectedPlacementKeys,
    });

    expect(deletedTransition.placementHistory.currentState.items).toHaveLength(1);
    expect(deletedTransition.selectedPlacementKeys).toEqual([]);
  });

  it("saves and reopens a real Standard Farm cursor placement through canonical storage", () => {
    let serializedProjectDocument = JSON.stringify(
      createAdapterSupportedStandardFarmDocument(),
    );
    const storage = {
      getItem: () => serializedProjectDocument,
      setItem: (_storageKey: string, nextSerializedProjectDocument: string) => {
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    };
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-03T00:00:00.000Z",
      storage,
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });

    workspaceController.openProject("project-alpha");
    const openSession = workspaceController.getState().activeSession;
    if (openSession === null) {
      throw new Error("Expected Standard Farm to create an open canonical map session.");
    }
    const placedTransition = applyPlannerWorkspaceMapTileClick({
      buildingMetadataById: createBuildingMetadataById(),
      cursorTile: { x: 1, y: 1 },
      freePlacement: false,
      mapPlacementGrid: {
        width: 20,
        height: 20,
        capabilitiesByTile: Array.from({ length: 400 }, () => ({
          buildable: true,
          crabPot: false,
          diggable: true,
          passable: true,
          treePlantable: false,
          treePlantableOnDirt: false,
          wall: false,
        })),
      },
      placementHistory: createPlacementHistory(openSession.placementSnapshot),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      selectedCatalogItem: createFloorCatalogItem(),
      selectedPlacementKeys: [],
      tool: "cursor",
    });
    workspaceController.saveOpenMap({
      placementSnapshot: placedTransition.placementHistory.currentState,
      season: "fall",
    });

    const reopenedRepository = createReferenceProjectRepository({
      now: () => "2026-08-03T00:00:00.000Z",
      storage,
    });
    const reopenedWorkspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: reopenedRepository.listProjects(),
      repository: reopenedRepository,
    });
    reopenedWorkspaceController.openProject("project-alpha");
    const reopenedSession = reopenedWorkspaceController.getState().activeSession;

    expect(reopenedSession?.projectId).toBe("project-alpha");
    expect(reopenedSession?.mapId).toBe("map-standard");
    expect(reopenedSession?.season).toBe("fall");
    expect(reopenedSession?.placementSnapshot.items).toContainEqual(
      expect.objectContaining({
        itemId: "floor:Stone Floor",
        layer: "path",
        x: 1,
        y: 1,
      }),
    );
  });

  it("updates selected tint, night-light state, and building paint through existing selection controllers", () => {
    const itemPlacementHistory = createPlacementHistory<PlacementSnapshot>({
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          bedType: null,
          flipped: false,
          footprint: { width: 1, height: 1 },
          instanceId: 1,
          isGrass: false,
          isLongTable: false,
          isRug: false,
          isTable: false,
          itemId: "object:93",
          layer: "item",
          locked: false,
          rotation: 0,
          tintColor: "#ffffff",
          variant: 0,
          x: 1,
          y: 1,
        },
      ],
      nextItemId: 2,
    });
    const tintedTransition = setPlannerWorkspaceSelectedItemTint({
      catalogItems: [{
        allowedTools: [], category: "placeable", id: "object:93", name: "Chest", paintableChest: { kind: "paintable-chest" }, sprite: { kind: "sprite-index", index: 130 }, textureLocalPath: "/game-assets/test.png", tileSize: { width: 1, height: 1 },
      }],
      placementHistory: itemPlacementHistory,
      selectedPlacementKeys: ["item:1"],
      tintColor: "#123456",
    });
    const litTransition = setPlannerWorkspaceSelectedNightLightState({
      catalogItems: [
        {
          id: "object:93",
          nightLight: { color: 0xffe3a0, radiusInTiles: 4 },
        },
      ],
      nightLightState: "off",
      placementHistory: tintedTransition.placementHistory,
      selectedPlacementKeys: tintedTransition.selectedPlacementKeys,
    });

    expect(litTransition.placementHistory.currentState.items[0]).toMatchObject({
      nightLightState: "off",
      tintColor: "#123456",
    });

    const buildingPlacementHistory = createPlacementHistory<PlacementSnapshot>({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ buildingId: "Big Shed", instanceId: 1, x: 1, y: 1 }],
      nextBuildingId: 2,
    });
    const paintedTransition = setPlannerWorkspaceSelectedBuildingPaint({
      paintColors: {
        color1: "#112233",
        color2: "#445566",
        color3: "#778899",
      },
      placementHistory: buildingPlacementHistory,
      selectedPlacementKeys: ["building:1"],
    });

    expect(paintedTransition.placementHistory.currentState.buildings[0]).toMatchObject({
      paintColors: {
        color1: "#112233",
        color2: "#445566",
        color3: "#778899",
      },
    });
  });

  it("updates and clears a selected Fish Pond water color through workspace history", () => {
    const fishPondCatalogItem: CatalogItem = {
      allowedTools: ["cursor"],
      category: "building",
      id: "building:Fish Pond",
      name: "Fish Pond",
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
        waterColors: [
          { label: "Default", value: 3_964_566 },
          { label: "Lava Eel", value: 16_391_710 },
        ],
      },
      sprite: { kind: "source-rect", x: 0, y: 0, width: 80, height: 80 },
      textureLocalPath: "/game-assets/test/Fish Pond.png",
      tileSize: { width: 5, height: 5 },
    };
    const placementHistory = createPlacementHistory<PlacementSnapshot>({
      ...createEmptyPlacementSnapshot(),
      buildings: [{ buildingId: "Fish Pond", instanceId: 1, x: 1, y: 1 }],
      nextBuildingId: 2,
    });

    const coloredTransition = setPlannerWorkspaceSelectedBuildingWaterColor({
      catalogItems: [fishPondCatalogItem],
      placementHistory,
      selectedPlacementKeys: ["building:1"],
      waterColor: 16_391_710,
    });
    const defaultTransition = setPlannerWorkspaceSelectedBuildingWaterColor({
      catalogItems: [fishPondCatalogItem],
      placementHistory: coloredTransition.placementHistory,
      selectedPlacementKeys: coloredTransition.selectedPlacementKeys,
      waterColor: undefined,
    });

    expect(coloredTransition.placementHistory.currentState.buildings[0]).toMatchObject({
      waterColor: 16_391_710,
    });
    expect(defaultTransition.placementHistory.currentState.buildings[0]).not.toHaveProperty(
      "waterColor",
    );
    expect(defaultTransition.placementHistory.undoStates).toHaveLength(2);
  });
});

function createVisibleVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}
