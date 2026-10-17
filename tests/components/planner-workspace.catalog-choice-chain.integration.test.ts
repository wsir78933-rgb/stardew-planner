import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Children, createElement, isValidElement, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  createCatalogFromDatasets,
  createDefaultCatalogItemPresentationChoice,
  type CatalogItem,
  type CatalogPresentationChoice,
} from "../../src/catalog";
import { catalogDatasetUrls } from "../../src/catalog/catalog-loader";
import {
  CatalogItemGrid,
  getCatalogItemThumbnailStyle,
  getNextCatalogItemControlChoice,
  resolveCatalogItemCardSelectionChoice,
  type CatalogItemControl,
} from "../../src/components/item-catalog-panel";
import { CatalogPlacementControls } from "../../src/components/catalog-placement-controls";
import { createWorkspaceCatalogPlacementPreviewInput } from "../../src/components/planner-workspace";
import { SelectionInspector } from "../../src/components/selection-inspector";
import { applyEditorFill } from "../../src/editor/editor-fill-controller";
import { applyEditorCursorPlacement } from "../../src/editor/editor-placement-controller";
import {
  cycleSelectedPlacementAppearance,
  duplicateSelectedPlacementAtTile,
  getPlacementSelectionDetails,
} from "../../src/editor/editor-selection-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createPlacementHistory,
  redoPlacementHistory,
  undoPlacementHistory,
  type PlacementHistory,
} from "../../src/placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  createPersistentPlacementSnapshot,
  restorePlacementSnapshot,
  type PlacementItem,
  type PlacementSnapshot,
} from "../../src/placement/placement-snapshot";
import {
  applyPlannerWorkspaceMapTileClick,
  applyPlannerWorkspaceMapTileRectangle,
  setPlannerWorkspaceSelectedNightLightState,
} from "../../src/planner/planner-workspace-editing-controller";
import {
  changeWorkspaceCatalogItemChoice,
  clearWorkspaceCatalogSelection,
  createInitialWorkspaceCatalogChoiceState,
  cyclePendingWorkspaceCatalogChoice,
  selectWorkspaceCatalogItem,
  type WorkspaceCatalogChoiceState,
} from "../../src/planner/planner-workspace-catalog-controls";
import { createTreePlacementRenderLayers } from "../../src/rendering/tree-placement-rendering";

describe("planner workspace catalog choice integration", () => {
  it("passes real furniture, tree, and generic controls through state, Q, and cursor placement", async () => {
    const catalogItems = (await createLockedCatalog()).items;
    const furnitureItem = requireCatalogItem(catalogItems, "furniture_0");
    const fruitTreeItem = requireCatalogItem(catalogItems, "fruittree_628");
    const genericItem = requireCatalogItem(catalogItems, "object:599");

    const furnitureSelection = createControlledQSelection(
      furnitureItem,
      "rotation",
    );
    expectPlacedChoice(furnitureSelection, {
      flipped: false,
      footprint: requireRotationFootprint(furnitureItem, 2),
      rotation: 2,
      variant: 0,
    });

    const fruitTreeSelection = createControlledQSelection(
      fruitTreeItem,
      "flip",
    );
    expectPlacedChoice(fruitTreeSelection, {
      flipped: true,
      footprint: fruitTreeItem.tileSize,
      rotation: 0,
      variant: 1,
    });

    const genericSelection = createControlledQSelection(
      genericItem,
      "variant",
    );
    expectPlacedChoice(genericSelection, {
      flipped: false,
      footprint: genericItem.tileSize,
      rotation: 0,
      variant: 2,
    });
  });

  it("cycles pending pill actions into preview and placement, then cancels without losing the item choice", async () => {
    const catalogItems = (await createLockedCatalog()).items;
    const furnitureItem = requireCatalogItem(catalogItems, "furniture_0");
    const fruitTreeItem = requireCatalogItem(catalogItems, "fruittree_628");

    const furniturePill = createPendingCatalogPillInteraction(furnitureItem);
    clickPlacementControl(furniturePill.primaryActionButton);
    const selectedFurniture = furniturePill.getChoiceState().selectedCatalogItem;
    if (selectedFurniture === null) {
      throw new Error("Expected the pending furniture item after its rotation action.");
    }
    expect(selectedFurniture.presentationChoice.rotation).toBe(1);

    const furniturePreview = createWorkspaceCatalogPlacementPreviewInput({
      buildingMetadataById: {},
      freePlacement: true,
      selectedCatalogItem: selectedFurniture,
      tool: "cursor",
    });
    if (furniturePreview === null) {
      throw new Error("Expected the pending furniture item in the canvas preview.");
    }
    expect(furniturePreview.catalogPresentationChoice.rotation).toBe(1);
    expect(getCatalogItemThumbnailStyle(
      furnitureItem,
      selectedFurniture.presentationChoice,
    ).backgroundPosition).not.toBe(
      getCatalogItemThumbnailStyle(
        furnitureItem,
        createDefaultCatalogItemPresentationChoice(furnitureItem),
      ).backgroundPosition,
    );

    const furniturePlacement = applyEditorCursorPlacement({
      buildingMetadataById: {},
      catalogPresentationChoice: furniturePreview.catalogPresentationChoice,
      cursorTile: { x: 0, y: 0 },
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(4, 4),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
      selectedCatalogItem: furniturePreview.selectedCatalogItem,
    });
    expect(furniturePlacement).toMatchObject({ applied: true });
    expect(furniturePlacement.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        itemId: furnitureItem.id,
        rotation: 1,
        footprint: requireRotationFootprint(furnitureItem, 1),
      }),
    ]);

    clickPlacementControl(furniturePill.cancelButton);
    const cancelledFurnitureState = furniturePill.getChoiceState();
    expect(cancelledFurnitureState.selectedCatalogItem).toBeNull();
    expect(cancelledFurnitureState.presentationChoicesByItemId.get(furnitureItem.id)).toEqual(
      selectedFurniture.presentationChoice,
    );
    expect(selectWorkspaceCatalogItem(cancelledFurnitureState, furnitureItem)
      .selectedCatalogItem?.presentationChoice).toEqual(selectedFurniture.presentationChoice);

    const fruitTreePill = createPendingCatalogPillInteraction(fruitTreeItem);
    clickPlacementControl(fruitTreePill.primaryActionButton);
    const selectedFruitTree = fruitTreePill.getChoiceState().selectedCatalogItem;
    if (selectedFruitTree === null) {
      throw new Error("Expected the pending tree item after its variant action.");
    }
    expect(selectedFruitTree.presentationChoice.variant).toBe(1);

    const fruitTreePreview = createWorkspaceCatalogPlacementPreviewInput({
      buildingMetadataById: {},
      freePlacement: true,
      selectedCatalogItem: selectedFruitTree,
      tool: "cursor",
    });
    if (fruitTreePreview === null) {
      throw new Error("Expected the pending tree item in the canvas preview.");
    }
    expect(fruitTreePreview.catalogPresentationChoice.variant).toBe(1);

    const fruitTreePlacement = applyEditorCursorPlacement({
      buildingMetadataById: {},
      catalogPresentationChoice: fruitTreePreview.catalogPresentationChoice,
      cursorTile: { x: 0, y: 0 },
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(4, 4),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
      selectedCatalogItem: fruitTreePreview.selectedCatalogItem,
    });
    expect(fruitTreePlacement).toMatchObject({ applied: true });
    expect(fruitTreePlacement.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ itemId: fruitTreeItem.id, variant: 1 }),
    ]);
  });

  it("keeps the hidden wild-tree variant action connected to pending preview and tree rendering", async () => {
    const wildTreeItem = requireCatalogItem(
      (await createLockedCatalog()).items,
      "wildtree_6",
    );
    const presentationCapabilities = wildTreeItem.presentationCapabilities;
    if (presentationCapabilities === undefined) {
      throw new Error(`Expected presentation capabilities for ${wildTreeItem.id}.`);
    }
    expect(presentationCapabilities.variantCycle?.count).toBe(2);
    expect(presentationCapabilities.visibleVariants).toEqual([]);

    const wildTreePill = createPendingCatalogPillInteraction(wildTreeItem);
    expect(wildTreePill.primaryActionButton.props["data-control"]).toBe("variant");
    clickPlacementControl(wildTreePill.primaryActionButton);

    const selectedWildTree = wildTreePill.getChoiceState().selectedCatalogItem;
    if (selectedWildTree === null) {
      throw new Error(`Expected the pending tree selection for ${wildTreeItem.id}.`);
    }
    expect(selectedWildTree.presentationChoice.variant).toBe(1);

    const wildTreePreview = createWorkspaceCatalogPlacementPreviewInput({
      buildingMetadataById: {},
      freePlacement: true,
      selectedCatalogItem: selectedWildTree,
      tool: "cursor",
    });
    if (wildTreePreview === null) {
      throw new Error(`Expected a canvas preview for ${wildTreeItem.id}.`);
    }
    expect(wildTreePreview.catalogPresentationChoice.variant).toBe(1);

    const wildTreePlacement = applyEditorCursorPlacement({
      buildingMetadataById: {},
      catalogPresentationChoice: wildTreePreview.catalogPresentationChoice,
      cursorTile: { x: 0, y: 0 },
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(4, 4),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
      selectedCatalogItem: wildTreePreview.selectedCatalogItem,
    });
    if (!wildTreePlacement.applied) {
      throw new Error(`Expected placement for pending tree ${wildTreeItem.id}.`);
    }

    const placedWildTree = wildTreePlacement.placementHistory.currentState.items[0];
    if (placedWildTree === undefined) {
      throw new Error(`Expected ${wildTreeItem.id} in the placement history.`);
    }
    expect(placedWildTree.variant).toBe(1);
    const renderedWildTreeLayers = createTreePlacementRenderLayers({
      catalogItem: wildTreeItem,
      mapId: "standard",
      placementItem: placedWildTree,
      season: "fall",
    });
    expect(renderedWildTreeLayers?.[1]?.frame).toMatchObject({ x: 128, y: 96 });
  });

  it("passes a controlled fill fixture through state and pending Q to every tile", () => {
    const fillCatalogItem: CatalogItem = {
      allowedTools: ["cursor", "fill"],
      category: "floor",
      id: "floor:controlled",
      name: "Controlled Floor",
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 3, family: "generic" },
        visibleVariants: [
          createVisibleVariant(0, "Base"),
          createVisibleVariant(1, "Alternate"),
          createVisibleVariant(2, "Third"),
        ],
      },
      sprite: { kind: "sprite-index", index: 0 },
      textureLocalPath: "/game-assets/test.png",
      tileSize: { width: 1, height: 1 },
    };
    const fillSelection = createControlledQSelection(
      fillCatalogItem,
      "variant",
    ).selectedCatalogItem;
    if (fillSelection === null) {
      throw new Error("Expected a selected controlled floor item.");
    }
    const fillResult = applyEditorFill({
      buildingMetadataById: {},
      catalogPresentationChoice: fillSelection.presentationChoice,
      firstTile: { x: 0, y: 0 },
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(2, 1),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
      secondTile: { x: 1, y: 0 },
      selectedCatalogItem: fillSelection.catalogItem,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ rotation: 0, variant: 2 }),
      expect.objectContaining({ rotation: 0, variant: 2 }),
    ]);
  });

  it("uses real furniture_0 rotation-three built-in flip XOR with a user flip", async () => {
    const furnitureItem = requireCatalogItem(
      (await createLockedCatalog()).items,
      "furniture_0",
    );
    const furnitureRenderingMetadata = furnitureItem.renderingMetadata;
    if (furnitureRenderingMetadata?.kind !== "furniture") {
      throw new Error("Expected furniture_0 rendering metadata.");
    }
    const rotationThreeSprite = furnitureRenderingMetadata.rotationSprites?.[3];
    if (rotationThreeSprite?.flipped !== true) {
      throw new Error("Expected furniture_0 rotation 3 to use a built-in flipped frame.");
    }
    const builtInFlipStyle = getCatalogItemThumbnailStyle(furnitureItem, {
      flipped: false,
      rotation: 3,
      variant: 0,
    });
    expect(builtInFlipStyle).toMatchObject({
      backgroundPosition: `-${String(rotationThreeSprite.sprite.x * 1.875)}px -${String(rotationThreeSprite.sprite.y * 1.875)}px`,
      transform: "scaleX(-1)",
    });

    const flipCapableFurnitureItem: CatalogItem = {
      ...furnitureItem,
      presentationCapabilities: {
        ...requirePresentationCapabilities(furnitureItem),
        canFlip: true,
      },
    };
    const userFlipStyle = getCatalogItemThumbnailStyle(
      flipCapableFurnitureItem,
      { flipped: true, rotation: 3, variant: 0 },
    );
    expect(userFlipStyle.backgroundPosition).toBe(
      builtInFlipStyle.backgroundPosition,
    );
    expect(userFlipStyle.transform).toBeUndefined();
  });

  it("keeps locked HoeDirt on the existing Q, history, persistence, and duplicate interfaces", async () => {
    const hoeDirtCatalogItem = requireCatalogItem(
      (await createLockedCatalog()).items,
      "hoedirt",
    );
    const selectedChoiceState = selectWorkspaceCatalogItem(
      createInitialWorkspaceCatalogChoiceState(),
      hoeDirtCatalogItem,
    );
    const pendingQTransition = cyclePendingWorkspaceCatalogChoice(
      selectedChoiceState,
    );
    if (!pendingQTransition.changed) {
      throw new Error("Expected pending HoeDirt Q to select Watered.");
    }
    const pendingHoeDirt = pendingQTransition.state.selectedCatalogItem;
    if (pendingHoeDirt === null) {
      throw new Error("Expected pending HoeDirt selection.");
    }
    const mapPlacementGrid = createPlacementGrid(2, 1);
    const placementResult = applyEditorCursorPlacement({
      buildingMetadataById: {},
      catalogPresentationChoice: pendingHoeDirt.presentationChoice,
      cursorTile: { x: 0, y: 0 },
      mapPlacementGrid,
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
      selectedCatalogItem: pendingHoeDirt.catalogItem,
    });
    if (!placementResult.applied) {
      throw new Error("Expected Watered HoeDirt cursor placement.");
    }
    expect(placementResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        itemId: "hoedirt",
        layer: "path",
        variant: 1,
      }),
    ]);

    const selectedQResult = cycleSelectedPlacementAppearance({
      buildingMetadataById: {},
      catalogItems: [hoeDirtCatalogItem],
      mapPlacementGrid,
      placementHistory: placementResult.placementHistory,
      selectedPlacementKey: "item:1",
    });
    expect(selectedQResult).toMatchObject({ applied: true });
    expect(selectedQResult.placementHistory.currentState.items[0]?.variant).toBe(0);
    const undoneHistory = undoPlacementHistory(selectedQResult.placementHistory);
    expect(undoneHistory.currentState.items[0]?.variant).toBe(1);
    expect(redoPlacementHistory(undoneHistory).currentState.items[0]?.variant).toBe(0);

    const restoredWateredSnapshot = restorePlacementSnapshot(
      createPersistentPlacementSnapshot(undoneHistory.currentState),
    );
    expect(restoredWateredSnapshot.items[0]).toEqual(expect.objectContaining({
      itemId: "hoedirt",
      layer: "path",
      variant: 1,
    }));
    const duplicateResult = duplicateSelectedPlacementAtTile({
      buildingMetadataById: {},
      cursorTile: { x: 1, y: 0 },
      mapPlacementGrid,
      placementHistory: createPlacementHistory(restoredWateredSnapshot),
      selectedPlacementKey: "item:1",
    });
    expect(duplicateResult).toMatchObject({ applied: true });
    expect(duplicateResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ itemId: "hoedirt", variant: 1, x: 0, y: 0 }),
      expect.objectContaining({ itemId: "hoedirt", variant: 1, x: 1, y: 0 }),
    ]);
  });

  it("keeps lit card, pill, and first placement on the same variant without rewriting placed objects", async () => {
    const catalogItems = (await createLockedCatalog()).items;
    const campfire = requireCatalogItem(catalogItems, "big-craftable:146");
    const carvedBrazier = requireCatalogItem(catalogItems, "big-craftable:148");
    const torch = requireCatalogItem(catalogItems, "object:93");
    const jungleTorch = requireCatalogItem(catalogItems, "furniture_2331");
    const torchChoice = createDefaultCatalogItemPresentationChoice(torch);
    const jungleTorchChoice = createDefaultCatalogItemPresentationChoice(jungleTorch);

    expect(campfire.renderingMetadata?.kind).toBe("lit-big-craftable");
    expect(carvedBrazier.renderingMetadata?.kind).toBe("lit-big-craftable");
    expect(torch.renderingMetadata?.kind).not.toBe("lit-big-craftable");
    expect(jungleTorch.renderingMetadata?.kind).not.toBe("lit-big-craftable");
    expect(resolveCatalogItemCardSelectionChoice(torch, torchChoice, true)).toEqual(torchChoice);
    expect(resolveCatalogItemCardSelectionChoice(jungleTorch, jungleTorchChoice, true))
      .toEqual(jungleTorchChoice);
    expect(countCatalogLitFlames(renderCatalogCardMarkup(
      createInitialWorkspaceCatalogChoiceState(),
      [campfire],
    ))).toBe(3);

    let choiceState = applyCatalogCardClick(
      createInitialWorkspaceCatalogChoiceState(),
      campfire,
      false,
    );
    expect(choiceState.selectedCatalogItem?.presentationChoice.variant).toBe(0);
    expect(countCatalogLitFlames(renderCatalogCardMarkup(choiceState, [campfire, carvedBrazier])))
      .toBe(4);
    expect(countCatalogLitFlames(renderCatalogPillMarkup(choiceState))).toBe(3);

    const litPreview = requireCatalogPreview(choiceState);
    expect(litPreview.catalogPresentationChoice.variant).toBe(0);
    const litPlacement = placeCatalogPreview(
      litPreview,
      { x: 0, y: 0 },
      createPlacementHistory(createEmptyPlacementSnapshot()),
    );
    expect(litPlacement).toMatchObject({ applied: true });
    const frozenPlacedItems = structuredClone(litPlacement.placementHistory.currentState.items);
    expect(frozenPlacedItems).toEqual([
      expect.objectContaining({ itemId: campfire.id, variant: 0, x: 0, y: 0 }),
    ]);

    choiceState = applyCatalogCardClick(choiceState, campfire, true);
    expect(choiceState.selectedCatalogItem?.presentationChoice.variant).toBe(1);
    expect(choiceState.presentationChoicesByItemId.get(campfire.id)?.variant).toBe(1);
    expect(countCatalogLitFlames(renderCatalogCardMarkup(choiceState, [campfire]))).toBe(0);
    expect(countCatalogLitFlames(renderCatalogPillMarkup(choiceState))).toBe(0);
    expect(litPlacement.placementHistory.currentState.items).toEqual(frozenPlacedItems);

    const unlitPreview = requireCatalogPreview(choiceState);
    expect(unlitPreview.catalogPresentationChoice.variant).toBe(1);
    const mixedPlacement = placeCatalogPreview(
      unlitPreview,
      { x: 1, y: 0 },
      litPlacement.placementHistory,
    );
    expect(mixedPlacement).toMatchObject({ applied: true });
    expect(mixedPlacement.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ itemId: campfire.id, variant: 0, x: 0, y: 0 }),
      expect.objectContaining({ itemId: campfire.id, variant: 1, x: 1, y: 0 }),
    ]);

    const unlitPill = createPendingPillForChoiceState(choiceState);
    clickPlacementControl(unlitPill.primaryActionButton);
    choiceState = unlitPill.getChoiceState();
    expect(choiceState.selectedCatalogItem?.presentationChoice.variant).toBe(0);
    expect(countCatalogLitFlames(renderCatalogCardMarkup(choiceState, [campfire]))).toBe(3);
    expect(countCatalogLitFlames(renderCatalogPillMarkup(choiceState))).toBe(3);

    choiceState = applyCatalogCardClick(choiceState, carvedBrazier, false);
    expect(choiceState.selectedCatalogItem?.catalogItem.id).toBe(carvedBrazier.id);
    expect(choiceState.selectedCatalogItem?.presentationChoice.variant).toBe(0);
    expect(choiceState.presentationChoicesByItemId.get(campfire.id)?.variant).toBe(0);

    choiceState = applyCatalogCardClick(choiceState, carvedBrazier, true);
    expect(choiceState.presentationChoicesByItemId.get(carvedBrazier.id)?.variant).toBe(1);
    expect(choiceState.presentationChoicesByItemId.get(campfire.id)?.variant).toBe(0);
    expect(countCatalogLitFlames(renderCatalogCardMarkup(
      choiceState,
      [campfire, carvedBrazier],
    ))).toBe(3);

    choiceState = applyCatalogCardClick(choiceState, campfire, false);
    expect(choiceState.selectedCatalogItem?.catalogItem.id).toBe(campfire.id);
    expect(choiceState.selectedCatalogItem?.presentationChoice.variant).toBe(0);
    expect(choiceState.presentationChoicesByItemId.get(carvedBrazier.id)?.variant).toBe(1);
  });

  const lockedLitBigCraftableIds = [
    "big-craftable:143",
    "big-craftable:144",
    "big-craftable:145",
    "big-craftable:146",
    "big-craftable:147",
    "big-craftable:148",
    "big-craftable:149",
    "big-craftable:150",
    "big-craftable:151",
    "big-craftable:278",
  ] as const;
  const lockedLitCatalog = createLockedCatalog();

  it.each(lockedLitBigCraftableIds)(
    "keeps switched %s through single placement, fill, inspector undo, and other catalog cards",
    async (catalogItemId) => {
      const catalogItems = (await lockedLitCatalog).items;
      const catalogItem = requireCatalogItem(catalogItems, catalogItemId);
      const flameLayerCount = requireLitFlameLayerCount(catalogItem);
      if (catalogItem.tileSize.width !== 1 || catalogItem.tileSize.height !== 1) {
        throw new Error(
          `Expected a 1 by 1 footprint for ${catalogItem.id}; received ${String(catalogItem.tileSize.width)} by ${String(catalogItem.tileSize.height)}.`,
        );
      }
      if (catalogItem.presentationCapabilities?.variantCycle?.count !== 2) {
        throw new Error(
          `Expected a 2-step variant cycle for ${catalogItem.id}; received ${JSON.stringify(catalogItem.presentationCapabilities?.variantCycle ?? null)}.`,
        );
      }

      let choiceState = applyCatalogCardClick(
        createInitialWorkspaceCatalogChoiceState(),
        catalogItem,
        false,
      );
      expect(choiceState.selectedCatalogItem?.presentationChoice.variant).toBe(0);
      expect(countCatalogLitFlames(renderCatalogCardMarkup(choiceState, [catalogItem])))
        .toBe(flameLayerCount);

      choiceState = applyCatalogCardClick(choiceState, catalogItem, true);
      const unlitChoice = choiceState.selectedCatalogItem?.presentationChoice;
      if (unlitChoice === undefined) {
        throw new Error(`Expected an unlit catalog choice for ${catalogItem.id}.`);
      }
      expect(unlitChoice.variant).toBe(1);
      expect(countCatalogLitFlames(renderCatalogCardMarkup(choiceState, [catalogItem]))).toBe(0);
      expect(countCatalogLitFlames(renderCatalogPillMarkup(choiceState))).toBe(0);
      expect(createPendingPillForChoiceState(choiceState).primaryActionButton.props["data-control"])
        .toBe("variant");

      const mapPlacementGrid = createPlacementGrid(4, 4);
      const placed = placeWorkspaceCatalogItem(
        catalogItem,
        unlitChoice,
        { x: 0, y: 0 },
        createPlacementHistory(createEmptyPlacementSnapshot()),
        mapPlacementGrid,
      );
      const placedItem = requirePlacedItemAt(
        placed.placementHistory.currentState.items,
        catalogItem.id,
        0,
        0,
      );
      expect(placedItem.variant).toBe(1);
      expectAbsentNightLightState(placedItem);
      const placedBeforeCardSwitch = structuredClone(
        placed.placementHistory.currentState.items,
      );
      choiceState = switchCatalogCardsAroundPlacedLight(
        choiceState,
        catalogItems,
        catalogItem,
      );
      expect(choiceState.presentationChoicesByItemId.get(catalogItem.id)?.variant).toBe(0);
      expect(placed.placementHistory.currentState.items).toEqual(placedBeforeCardSwitch);

      const undonePlacement = undoPlacementHistory(placed.placementHistory);
      expect(undonePlacement.currentState.items).toEqual([]);
      expect(redoPlacementHistory(undonePlacement).currentState.items)
        .toEqual(placedBeforeCardSwitch);

      const filled = fillWorkspaceCatalogItem(
        catalogItem,
        unlitChoice,
        createPlacementHistory(createEmptyPlacementSnapshot()),
        mapPlacementGrid,
      );
      expect(filled.placementHistory.currentState.items).toHaveLength(2);
      for (const fillOrigin of [{ x: 0, y: 0 }, { x: 1, y: 0 }] as const) {
        const filledItem = requirePlacedItemAt(
          filled.placementHistory.currentState.items,
          catalogItem.id,
          fillOrigin.x,
          fillOrigin.y,
        );
        expect(filledItem.variant).toBe(1);
        expectAbsentNightLightState(filledItem);
      }
      const filledBeforeCardSwitch = structuredClone(
        filled.placementHistory.currentState.items,
      );
      switchCatalogCardsAroundPlacedLight(choiceState, catalogItems, catalogItem);
      expect(filled.placementHistory.currentState.items).toEqual(filledBeforeCardSwitch);

      const selectedPlacementKey = selectWorkspacePlacementAtTile(
        filled.placementHistory,
        { x: 0, y: 0 },
        mapPlacementGrid,
      );
      const selectedItem = requirePlacementItemForSelectionKey(
        filled.placementHistory.currentState,
        selectedPlacementKey,
      );
      if (selectedItem.x !== 0 || selectedItem.y !== 0 || selectedItem.itemId !== catalogItem.id) {
        throw new Error(
          `Expected ${catalogItem.id} at 0,0 to be selected; received ${selectedItem.itemId} at ${String(selectedItem.x)},${String(selectedItem.y)}.`,
        );
      }

      const nightLightToggle = applySelectedPlacementNightLightButton(
        catalogItems,
        filled.placementHistory,
        selectedPlacementKey,
      );
      if (nightLightToggle.buttonLabel !== "Light selected light" || nightLightToggle.requestedNightLightState !== undefined) {
        throw new Error(
          `Expected ${catalogItem.id} variant 1 to offer Light and request undefined; received ${nightLightToggle.buttonLabel} and ${JSON.stringify(nightLightToggle.requestedNightLightState)}.`,
        );
      }
      const litItem = requirePlacementItemForSelectionKey(
        nightLightToggle.placementHistory.currentState,
        selectedPlacementKey,
      );
      const untouchedFilledItem = requirePlacedItemAt(
        nightLightToggle.placementHistory.currentState.items,
        catalogItem.id,
        1,
        0,
      );
      expect(litItem.variant).toBe(0);
      expectAbsentNightLightState(litItem);
      expect(untouchedFilledItem.variant).toBe(1);
      expectAbsentNightLightState(untouchedFilledItem);

      const undoneNightLight = undoPlacementHistory(nightLightToggle.placementHistory);
      const restoredFilledItem = requirePlacementItemForSelectionKey(
        undoneNightLight.currentState,
        selectedPlacementKey,
      );
      expect(restoredFilledItem.variant).toBe(1);
      expectAbsentNightLightState(restoredFilledItem);

      const redoneNightLight = redoPlacementHistory(undoneNightLight);
      const redoneItem = requirePlacementItemForSelectionKey(
        redoneNightLight.currentState,
        selectedPlacementKey,
      );
      expect(redoneItem.variant).toBe(0);
      expectAbsentNightLightState(redoneItem);
      const redoneBeforeCardSwitch = structuredClone(redoneNightLight.currentState.items);
      switchCatalogCardsAroundPlacedLight(
        choiceState,
        catalogItems,
        catalogItem,
      );
      expect(redoneNightLight.currentState.items).toEqual(redoneBeforeCardSwitch);
    },
  );
});

function createControlledQSelection(
  catalogItem: CatalogItem,
  control: CatalogItemControl,
): WorkspaceCatalogChoiceState {
  const controlledChoice = getNextCatalogItemControlChoice(
    catalogItem,
    createDefaultCatalogItemPresentationChoice(catalogItem),
    control,
  );
  const choiceStateWithControl = changeWorkspaceCatalogItemChoice(
    createInitialWorkspaceCatalogChoiceState(),
    catalogItem,
    controlledChoice,
  );
  const selectedChoiceState = selectWorkspaceCatalogItem(
    choiceStateWithControl,
    catalogItem,
  );
  const pendingTransition = cyclePendingWorkspaceCatalogChoice(
    selectedChoiceState,
  );
  if (!pendingTransition.changed) {
    throw new Error(`Expected pending Q to change choice for ${catalogItem.id}.`);
  }
  return pendingTransition.state;
}

type PlacementActionButtonProperties = Readonly<{
  "data-control"?: "rotation" | "variant";
  onClick?: (mouseEvent: MouseEvent<HTMLButtonElement>) => void;
}>;

type PendingCatalogPillInteraction = Readonly<{
  cancelButton: ReactElement<PlacementActionButtonProperties>;
  getChoiceState: () => WorkspaceCatalogChoiceState;
  primaryActionButton: ReactElement<PlacementActionButtonProperties>;
}>;

function createPendingCatalogPillInteraction(
  catalogItem: CatalogItem,
): PendingCatalogPillInteraction {
  let pendingCatalogChoiceState = selectWorkspaceCatalogItem(
    createInitialWorkspaceCatalogChoiceState(),
    catalogItem,
  );
  const placementControls = CatalogPlacementControls({
    catalogItem,
    presentationChoice: pendingCatalogChoiceState.selectedCatalogItem?.presentationChoice ?? null,
    placementMode: "place",
    locale: "en",
    onCancel: () => {
      pendingCatalogChoiceState = clearWorkspaceCatalogSelection(
        pendingCatalogChoiceState,
      );
    },
    onCyclePendingChoice: () => {
      const choiceTransition = cyclePendingWorkspaceCatalogChoice(
        pendingCatalogChoiceState,
      );
      if (!choiceTransition.changed) {
        return false;
      }
      pendingCatalogChoiceState = choiceTransition.state;
      return true;
    },
  });
  if (placementControls === null) {
    throw new Error(`Expected pending pill for catalog item ${JSON.stringify(catalogItem.id)}.`);
  }

  const actionButtons = getPendingCatalogPillButtons(placementControls);
  const primaryActionButton = actionButtons.find(
    (actionButton) => actionButton.props["data-control"] !== undefined,
  );
  const cancelButton = actionButtons.find(
    (actionButton) => actionButton.props["data-control"] === undefined,
  );
  if (primaryActionButton === undefined || cancelButton === undefined) {
    throw new Error(
      `Expected primary and Cancel controls for catalog item ${JSON.stringify(catalogItem.id)}.`,
    );
  }

  return {
    cancelButton,
    getChoiceState: () => pendingCatalogChoiceState,
    primaryActionButton,
  };
}

function getPendingCatalogPillButtons(
  placementControls: ReactElement,
): readonly ReactElement<PlacementActionButtonProperties>[] {
  const placementControlsProperties = placementControls.props as Readonly<{
    children?: ReactNode;
  }>;
  const pillChildren = Children.toArray(placementControlsProperties.children);
  const actionContainer = pillChildren.find(
    (pillChild) => isValidElement<{ className?: string }>(pillChild)
      && pillChild.props.className === "catalog-placement-controls__actions",
  );
  if (!isValidElement<{ children?: ReactNode }>(actionContainer)) {
    throw new Error("Pending catalog pill has no action container.");
  }

  const actionButtons = Children.toArray(actionContainer.props.children).filter(
    (actionButton): actionButton is ReactElement<PlacementActionButtonProperties> =>
      isValidElement<PlacementActionButtonProperties>(actionButton),
  );
  if (actionButtons.length === 0) {
    throw new Error("Pending catalog pill has no action buttons.");
  }
  return actionButtons;
}

function clickPlacementControl(
  placementControlButton: ReactElement<PlacementActionButtonProperties>,
): void {
  const clickHandler = placementControlButton.props.onClick;
  if (clickHandler === undefined) {
    throw new Error("Pending catalog action button has no click handler.");
  }
  clickHandler({} as MouseEvent<HTMLButtonElement>);
}

function expectPlacedChoice(
  catalogChoiceState: WorkspaceCatalogChoiceState,
  expectedPlacementChoice: Readonly<{
    flipped: boolean;
    footprint: CatalogItem["tileSize"];
    rotation: number;
    variant: number;
  }>,
): void {
  const selectedCatalogItem = catalogChoiceState.selectedCatalogItem;
  if (selectedCatalogItem === null) {
    throw new Error("Expected an active catalog selection for placement.");
  }
  const placementResult = applyEditorCursorPlacement({
    buildingMetadataById: {},
    catalogPresentationChoice: selectedCatalogItem.presentationChoice,
    cursorTile: { x: 0, y: 0 },
    freePlacement: true,
    mapPlacementGrid: createPlacementGrid(4, 4),
    placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
    selectedCatalogItem: selectedCatalogItem.catalogItem,
  });
  expect(placementResult).toMatchObject({ applied: true });
  expect(placementResult.placementHistory.currentState.items).toEqual([
    expect.objectContaining(expectedPlacementChoice),
  ]);
}

function requireCatalogItem(
  catalogItems: readonly CatalogItem[],
  itemId: string,
): CatalogItem {
  const catalogItem = catalogItems.find((candidateItem) => candidateItem.id === itemId);
  if (catalogItem === undefined) {
    throw new Error(`Expected locked catalog item ${JSON.stringify(itemId)}.`);
  }
  return catalogItem;
}

function requirePresentationCapabilities(catalogItem: CatalogItem) {
  if (catalogItem.presentationCapabilities === undefined) {
    throw new Error(`Expected presentation capabilities for ${catalogItem.id}.`);
  }
  return catalogItem.presentationCapabilities;
}

function requireRotationFootprint(
  catalogItem: CatalogItem,
  rotation: number,
): CatalogItem["tileSize"] {
  const rotationFootprint =
    requirePresentationCapabilities(catalogItem).rotation?.footprints[rotation];
  if (rotationFootprint === undefined) {
    throw new Error(
      `Expected ${catalogItem.id} rotation footprint ${String(rotation)}.`,
    );
  }
  return rotationFootprint;
}

function createVisibleVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}

function applyCatalogCardClick(
  choiceState: WorkspaceCatalogChoiceState,
  catalogItem: CatalogItem,
  isSelectedCatalogItem: boolean,
): WorkspaceCatalogChoiceState {
  const rememberedChoice = choiceState.presentationChoicesByItemId.get(catalogItem.id);
  const currentChoice = rememberedChoice === undefined
    ? createDefaultCatalogItemPresentationChoice(catalogItem)
    : rememberedChoice;
  return selectWorkspaceCatalogItem(
    changeWorkspaceCatalogItemChoice(
      choiceState,
      catalogItem,
      resolveCatalogItemCardSelectionChoice(
        catalogItem,
        currentChoice,
        isSelectedCatalogItem,
      ),
    ),
    catalogItem,
  );
}

function renderCatalogCardMarkup(
  choiceState: WorkspaceCatalogChoiceState,
  catalogItems: readonly CatalogItem[],
): string {
  return renderToStaticMarkup(createElement(CatalogItemGrid, {
    catalogItems,
    catalogPresentationChoicesByItemId: choiceState.presentationChoicesByItemId,
    onCatalogItemSelect: () => undefined,
    selectedCatalogItemId: choiceState.selectedCatalogItem?.catalogItem.id ?? null,
  }));
}

function renderCatalogPillMarkup(choiceState: WorkspaceCatalogChoiceState): string {
  const selectedCatalogItem = choiceState.selectedCatalogItem;
  if (selectedCatalogItem === null) {
    throw new Error("Expected a selected catalog item before rendering the placement pill.");
  }
  const placementControls = CatalogPlacementControls({
    catalogItem: selectedCatalogItem.catalogItem,
    locale: "en",
    onCancel: () => undefined,
    onCyclePendingChoice: () => true,
    placementMode: "place",
    presentationChoice: selectedCatalogItem.presentationChoice,
  });
  if (placementControls === null) {
    throw new Error(`Expected a placement pill for ${selectedCatalogItem.catalogItem.id}.`);
  }
  return renderToStaticMarkup(placementControls);
}

function countCatalogLitFlames(markup: string): number {
  return markup.match(/catalog-lit-thumbnail__flame/g)?.length ?? 0;
}

function requireCatalogPreview(choiceState: WorkspaceCatalogChoiceState) {
  const selectedCatalogItem = choiceState.selectedCatalogItem;
  if (selectedCatalogItem === null) {
    throw new Error("Expected a selected catalog item before creating a placement preview.");
  }
  const preview = createWorkspaceCatalogPlacementPreviewInput({
    buildingMetadataById: {},
    freePlacement: true,
    selectedCatalogItem,
    tool: "cursor",
  });
  if (preview === null) {
    throw new Error(`Expected a placement preview for ${selectedCatalogItem.catalogItem.id}.`);
  }
  return preview;
}

function placeCatalogPreview(
  preview: NonNullable<ReturnType<typeof createWorkspaceCatalogPlacementPreviewInput>>,
  cursorTile: { x: number; y: number },
  placementHistory: PlacementHistory<PlacementSnapshot>,
) {
  return applyEditorCursorPlacement({
    buildingMetadataById: {},
    catalogPresentationChoice: preview.catalogPresentationChoice,
    cursorTile,
    freePlacement: true,
    mapPlacementGrid: createPlacementGrid(4, 4),
    placementHistory,
    selectedCatalogItem: preview.selectedCatalogItem,
  });
}

function createPendingPillForChoiceState(
  choiceState: WorkspaceCatalogChoiceState,
): PendingCatalogPillInteraction {
  let pendingCatalogChoiceState = choiceState;
  const selectedCatalogItem = pendingCatalogChoiceState.selectedCatalogItem;
  if (selectedCatalogItem === null) {
    throw new Error("Expected a selected catalog item before cycling the placement pill.");
  }
  const placementControls = CatalogPlacementControls({
    catalogItem: selectedCatalogItem.catalogItem,
    locale: "en",
    onCancel: () => undefined,
    onCyclePendingChoice: () => {
      const choiceTransition = cyclePendingWorkspaceCatalogChoice(
        pendingCatalogChoiceState,
      );
      if (!choiceTransition.changed) {
        return false;
      }
      pendingCatalogChoiceState = choiceTransition.state;
      return true;
    },
    placementMode: "place",
    presentationChoice: selectedCatalogItem.presentationChoice,
  });
  if (placementControls === null) {
    throw new Error(`Expected a placement pill for ${selectedCatalogItem.catalogItem.id}.`);
  }
  const actionButtons = getPendingCatalogPillButtons(placementControls);
  const primaryActionButton = actionButtons.find(
    (actionButton) => actionButton.props["data-control"] !== undefined,
  );
  const cancelButton = actionButtons.find(
    (actionButton) => actionButton.props["data-control"] === undefined,
  );
  if (primaryActionButton === undefined || cancelButton === undefined) {
    throw new Error(`Expected pill actions for ${selectedCatalogItem.catalogItem.id}.`);
  }
  return {
    cancelButton,
    getChoiceState: () => pendingCatalogChoiceState,
    primaryActionButton,
  };
}

function createPlacementGrid(width: number, height: number): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: true,
      crabPot: false,
      diggable: true,
      passable: true,
      treePlantable: true,
      treePlantableOnDirt: true,
      wall: false,
    })),
  };
}

async function createLockedCatalog() {
  const datasetDirectory = join(process.cwd(), "public/game-assets/1.6.15/data");
  const readDataset = async (filename: string) =>
    JSON.parse(await readFile(join(datasetDirectory, filename), "utf8")) as unknown;

  return createCatalogFromDatasets({
    bigCraftables: await readDataset("BigCraftables.json"),
    buildings: await readDataset("Buildings.json"),
    crops: await readDataset("Crops.json"),
    fences: await readDataset("Fences.json"),
    floorsAndPaths: await readDataset("FloorsAndPaths.json"),
    fruitTrees: await readDataset("FruitTrees.json"),
    furniture: await readDataset("Furniture.json"),
    objects: await readDataset("Objects.json"),
  }, catalogDatasetUrls);
}

function requireLitFlameLayerCount(catalogItem: CatalogItem): number {
  const renderingMetadata = catalogItem.renderingMetadata;
  if (renderingMetadata?.kind !== "lit-big-craftable") {
    throw new Error(
      `Expected lit-big-craftable metadata for ${catalogItem.id}; received ${JSON.stringify(renderingMetadata?.kind ?? null)}.`,
    );
  }
  if (renderingMetadata.flameLayers.length === 0) {
    throw new Error(`Expected at least one flame layer for ${catalogItem.id}.`);
  }
  return renderingMetadata.flameLayers.length;
}

function switchCatalogCardsAroundPlacedLight(
  choiceState: WorkspaceCatalogChoiceState,
  catalogItems: readonly CatalogItem[],
  placedCatalogItem: CatalogItem,
): WorkspaceCatalogChoiceState {
  const torch = requireCatalogItem(catalogItems, "object:93");
  const otherLitCatalogItem = requireCatalogItem(
    catalogItems,
    placedCatalogItem.id === "big-craftable:143"
      ? "big-craftable:144"
      : "big-craftable:143",
  );
  const torchChoiceState = applyCatalogCardClick(choiceState, torch, false);
  if (torchChoiceState.selectedCatalogItem?.catalogItem.id !== torch.id) {
    throw new Error(
      `Expected catalog selection to move to ${torch.id}; received ${torchChoiceState.selectedCatalogItem?.catalogItem.id ?? "none"}.`,
    );
  }
  const otherVariantBefore = torchChoiceState.presentationChoicesByItemId.get(
    otherLitCatalogItem.id,
  )?.variant ?? 0;
  const selectedOtherChoiceState = applyCatalogCardClick(
    torchChoiceState,
    otherLitCatalogItem,
    false,
  );
  if (selectedOtherChoiceState.selectedCatalogItem?.presentationChoice.variant !== otherVariantBefore) {
    throw new Error(
      `Expected selecting ${otherLitCatalogItem.id} to keep variant ${String(otherVariantBefore)}; received ${String(selectedOtherChoiceState.selectedCatalogItem?.presentationChoice.variant)}.`,
    );
  }
  const toggledOtherChoiceState = applyCatalogCardClick(
    selectedOtherChoiceState,
    otherLitCatalogItem,
    true,
  );
  const expectedOtherVariant = otherVariantBefore === 0 ? 1 : 0;
  if (toggledOtherChoiceState.selectedCatalogItem?.presentationChoice.variant !== expectedOtherVariant) {
    throw new Error(
      `Expected ${otherLitCatalogItem.id} to switch from variant ${String(otherVariantBefore)} to ${String(expectedOtherVariant)}; received ${String(toggledOtherChoiceState.selectedCatalogItem?.presentationChoice.variant)}.`,
    );
  }
  const placedVariantBefore = toggledOtherChoiceState.presentationChoicesByItemId.get(
    placedCatalogItem.id,
  )?.variant;
  const reselectedPlacedChoiceState = applyCatalogCardClick(
    toggledOtherChoiceState,
    placedCatalogItem,
    false,
  );
  if (reselectedPlacedChoiceState.selectedCatalogItem?.presentationChoice.variant !== placedVariantBefore) {
    throw new Error(
      `Expected reselecting ${placedCatalogItem.id} to keep variant ${String(placedVariantBefore)}; received ${String(reselectedPlacedChoiceState.selectedCatalogItem?.presentationChoice.variant)}.`,
    );
  }
  return applyCatalogCardClick(
    reselectedPlacedChoiceState,
    placedCatalogItem,
    true,
  );
}

function placeWorkspaceCatalogItem(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
  cursorTile: Readonly<{ x: number; y: number }>,
  placementHistory: PlacementHistory<PlacementSnapshot>,
  mapPlacementGrid: MapPlacementGrid,
) {
  return applyPlannerWorkspaceMapTileClick({
    buildingMetadataById: {},
    catalogPresentationChoice: presentationChoice,
    cursorTile,
    freePlacement: true,
    mapPlacementGrid,
    placementHistory,
    selectedCatalogItem: catalogItem,
    selectedPlacementKeys: [],
    tool: "cursor",
  });
}

function fillWorkspaceCatalogItem(
  catalogItem: CatalogItem,
  presentationChoice: CatalogPresentationChoice,
  placementHistory: PlacementHistory<PlacementSnapshot>,
  mapPlacementGrid: MapPlacementGrid,
) {
  return applyPlannerWorkspaceMapTileRectangle({
    buildingMetadataById: {},
    catalogPresentationChoice: presentationChoice,
    firstTile: { x: 0, y: 0 },
    freePlacement: true,
    mapPlacementGrid,
    placementHistory,
    secondTile: { x: 1, y: 0 },
    selectedCatalogItem: catalogItem,
    selectedPlacementKeys: [],
    tool: "fill",
  });
}

function selectWorkspacePlacementAtTile(
  placementHistory: PlacementHistory<PlacementSnapshot>,
  cursorTile: Readonly<{ x: number; y: number }>,
  mapPlacementGrid: MapPlacementGrid,
): string {
  const selection = applyPlannerWorkspaceMapTileClick({
    buildingMetadataById: {},
    catalogPresentationChoice: null,
    cursorTile,
    freePlacement: true,
    mapPlacementGrid,
    placementHistory,
    selectedCatalogItem: null,
    selectedPlacementKeys: [],
    tool: "cursor",
  });
  const selectedPlacementKey = selection.selectedPlacementKeys[0];
  if (selection.selectedPlacementKeys.length !== 1 || selectedPlacementKey === undefined) {
    throw new Error(
      `Expected one selection at ${String(cursorTile.x)},${String(cursorTile.y)}; received ${JSON.stringify(selection.selectedPlacementKeys)}.`,
    );
  }
  return selectedPlacementKey;
}

function applySelectedPlacementNightLightButton(
  catalogItems: readonly CatalogItem[],
  placementHistory: PlacementHistory<PlacementSnapshot>,
  selectedPlacementKey: string,
): Readonly<{
  buttonLabel: string;
  placementHistory: PlacementHistory<PlacementSnapshot>;
  requestedNightLightState: "off" | undefined;
}> {
  const selectionDetails = getPlacementSelectionDetails({
    catalogItems,
    placementSnapshot: placementHistory.currentState,
    selectedPlacementKey,
  });
  if (selectionDetails.kind !== "item") {
    throw new Error(
      `Expected an item inspector for ${JSON.stringify(selectedPlacementKey)}; received ${selectionDetails.kind}.`,
    );
  }
  const catalogItem = requireCatalogItem(catalogItems, selectionDetails.catalogItemId);
  if (catalogItem.nightLight === undefined) {
    throw new Error(`Expected night-light metadata for placed ${catalogItem.id}.`);
  }
  const buttonLabel = selectionDetails.nightLightState === "off"
    ? "Light selected light"
    : "Extinguish selected light";
  let requestedNightLightState: "off" | undefined | null = null;
  const inspector = SelectionInspector({
    kind: "single",
    onCopy: () => undefined,
    onCycleAppearance: () => undefined,
    onDelete: () => undefined,
    onDismiss: () => undefined,
    onNightLightStateChange: (nightLightState) => {
      requestedNightLightState = nightLightState;
    },
    onTintChange: () => undefined,
    selection: {
      canCycleAppearance: selectionDetails.canCycleAppearance,
      canPaint: catalogItem.paintableChest !== undefined,
      entityName: catalogItem.name,
      isNightLight: true,
      kind: "item",
      nightLightState: selectionDetails.nightLightState,
      tintColor: selectionDetails.tintColor,
    },
  });
  const nightLightButton = findButtonByAriaLabel(inspector, buttonLabel);
  const clickNightLight = nightLightButton.props.onClick;
  if (clickNightLight === undefined) {
    throw new Error(`Night-light button for ${catalogItem.id} has no click handler.`);
  }
  clickNightLight();
  if (requestedNightLightState === null) {
    throw new Error(`Night-light button for ${catalogItem.id} did not request a state.`);
  }
  return {
    buttonLabel,
    placementHistory: setPlannerWorkspaceSelectedNightLightState({
      catalogItems,
      nightLightState: requestedNightLightState,
      placementHistory,
      selectedPlacementKeys: [selectedPlacementKey],
    }).placementHistory,
    requestedNightLightState,
  };
}

function findButtonByAriaLabel(
  node: ReactNode,
  ariaLabel: string,
): ReactElement<Readonly<{ onClick?: () => void }>> {
  const buttons = collectAriaButtons(node);
  const matchedButton = buttons.find(
    (button) => button.props["aria-label"] === ariaLabel,
  );
  if (matchedButton === undefined) {
    throw new Error(
      `Expected a button labeled ${JSON.stringify(ariaLabel)}; received ${JSON.stringify(buttons.map((button) => button.props["aria-label"] ?? ""))}.`,
    );
  }
  return matchedButton;
}

function collectAriaButtons(
  node: ReactNode,
): ReactElement<Readonly<{ "aria-label"?: string; onClick?: () => void }>>[] {
  const buttons: ReactElement<Readonly<{ "aria-label"?: string; onClick?: () => void }>>[] = [];
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) {
      continue;
    }
    const properties = child.props as Readonly<{
      "aria-label"?: string;
      children?: ReactNode;
      onClick?: () => void;
    }>;
    if (typeof properties["aria-label"] === "string" && typeof properties.onClick === "function") {
      buttons.push(child as ReactElement<Readonly<{ "aria-label"?: string; onClick?: () => void }>>);
    }
    if (properties.children !== undefined) {
      buttons.push(...collectAriaButtons(properties.children));
    }
  }
  return buttons;
}

function requirePlacedItemAt(
  placementItems: readonly PlacementItem[],
  itemId: string,
  x: number,
  y: number,
): PlacementItem {
  const matches = placementItems.filter(
    (placementItem) => placementItem.itemId === itemId
      && placementItem.x === x
      && placementItem.y === y,
  );
  const placedItem = matches[0];
  if (matches.length !== 1 || placedItem === undefined) {
    throw new Error(
      `Expected one ${itemId} at ${String(x)},${String(y)}; received ${String(matches.length)} of ${String(placementItems.length)} items.`,
    );
  }
  return placedItem;
}

function requirePlacementItemForSelectionKey(
  placementSnapshot: PlacementSnapshot,
  selectedPlacementKey: string,
): PlacementItem {
  const instanceId = readItemSelectionInstanceId(selectedPlacementKey);
  const placementItem = placementSnapshot.items.find(
    (candidateItem) => candidateItem.instanceId === instanceId,
  );
  if (placementItem === undefined) {
    throw new Error(
      `Expected placement item for ${JSON.stringify(selectedPlacementKey)}; received instance ids ${JSON.stringify(placementSnapshot.items.map((candidateItem) => candidateItem.instanceId))}.`,
    );
  }
  return placementItem;
}

function readItemSelectionInstanceId(selectedPlacementKey: string): number {
  const itemKeyPrefix = "item:";
  if (!selectedPlacementKey.startsWith(itemKeyPrefix)) {
    throw new Error(
      `Expected an item selection key; received ${JSON.stringify(selectedPlacementKey)}.`,
    );
  }
  const instanceId = Number(selectedPlacementKey.slice(itemKeyPrefix.length));
  if (!Number.isSafeInteger(instanceId)) {
    throw new Error(
      `Expected an item instance id; received ${JSON.stringify(selectedPlacementKey)}.`,
    );
  }
  return instanceId;
}

function expectAbsentNightLightState(placementItem: PlacementItem): void {
  if (Object.hasOwn(placementItem, "nightLightState")) {
    throw new Error(
      `Placed ${placementItem.itemId} at ${String(placementItem.x)},${String(placementItem.y)} has nightLightState ${JSON.stringify(placementItem.nightLightState)}.`,
    );
  }
}
