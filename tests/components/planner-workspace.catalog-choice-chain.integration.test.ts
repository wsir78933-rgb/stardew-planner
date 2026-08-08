import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createCatalogFromDatasets,
  createDefaultCatalogItemPresentationChoice,
  type CatalogItem,
} from "../../src/catalog";
import { catalogDatasetUrls } from "../../src/catalog/catalog-loader";
import {
  getCatalogItemThumbnailStyle,
  getNextCatalogItemControlChoice,
  type CatalogItemControl,
} from "../../src/components/item-catalog-panel";
import { applyEditorFill } from "../../src/editor/editor-fill-controller";
import { applyEditorCursorPlacement } from "../../src/editor/editor-placement-controller";
import {
  cycleSelectedPlacementAppearance,
  duplicateSelectedPlacementAtTile,
} from "../../src/editor/editor-selection-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createPlacementHistory,
  redoPlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  createPersistentPlacementSnapshot,
  restorePlacementSnapshot,
} from "../../src/placement/placement-snapshot";
import {
  changeWorkspaceCatalogItemChoice,
  createInitialWorkspaceCatalogChoiceState,
  cyclePendingWorkspaceCatalogChoice,
  selectWorkspaceCatalogItem,
  type WorkspaceCatalogChoiceState,
} from "../../src/planner/planner-workspace-catalog-controls";

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
