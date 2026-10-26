import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  createBuildingPlacementMetadata,
  createDecorCatalogFromDataset,
  createPlaceableCatalogFromDatasets,
  type BuildingPlacementMetadataById,
  type CatalogItem,
  type CatalogTileSize,
} from "../../src/catalog";
import {
  applyEditorFill,
} from "../../src/editor/editor-fill-controller";
import { applyEditorCursorPlacement } from "../../src/editor/editor-placement-controller";
import { previewPlannerWorkspaceFillRectangle } from "../../src/planner/planner-workspace-editing-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createPlacementHistory,
  redoPlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
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

let lockedPlaceableCatalogItems: readonly CatalogItem[] | undefined;

function readLockedPlaceableCatalogItems(): readonly CatalogItem[] {
  if (lockedPlaceableCatalogItems === undefined) {
    lockedPlaceableCatalogItems = createPlaceableCatalogFromDatasets(
      readLockedCatalogDataset("BigCraftables.json"),
      readLockedCatalogDataset("Objects.json"),
      readLockedCatalogDataset("Fences.json"),
      readLockedCatalogDataset("FloorsAndPaths.json"),
      readLockedCatalogDataset("Furniture.json"),
      readLockedCatalogDataset("FruitTrees.json"),
      catalogDatasetUrls,
    ).items;
  }

  return lockedPlaceableCatalogItems;
}

function requireLockedPlaceableCatalogItem(catalogItemId: string): CatalogItem {
  const catalogItem = readLockedPlaceableCatalogItems().find(
    (candidateCatalogItem) => candidateCatalogItem.id === catalogItemId,
  );
  if (catalogItem === undefined) {
    throw new Error(
      `Locked placeable catalog did not contain item ${JSON.stringify(catalogItemId)}.`,
    );
  }
  return catalogItem;
}

function createBlueGrassCatalogItemFromLockedDatasets(): CatalogItem {
  const catalog = createPlaceableCatalogFromDatasets(
    readLockedCatalogDataset("BigCraftables.json"),
    readLockedCatalogDataset("Objects.json"),
    readLockedCatalogDataset("Fences.json"),
    readLockedCatalogDataset("FloorsAndPaths.json"),
    readLockedCatalogDataset("Furniture.json"),
    readLockedCatalogDataset("FruitTrees.json"),
    catalogDatasetUrls,
  );
  const blueGrassCatalogItem = catalog.items.find(
    (catalogItem) => catalogItem.id === "grass_7",
  );

  if (blueGrassCatalogItem === undefined) {
    throw new Error('Locked catalog did not contain item "grass_7".');
  }

  return blueGrassCatalogItem;
}

function readLockedCatalogDataset(filename: string): unknown {
  const absolutePath = resolve(
    process.cwd(),
    "public/game-assets/1.6.15/data",
    filename,
  );

  return JSON.parse(readFileSync(absolutePath, "utf8")) as unknown;
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

function createWallPlacementGrid(width: number, height: number): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
      buildable: false,
      diggable: false,
      // A wall item is rejected as not-passable unless the wall tile is also passable.
      passable: true,
      treePlantable: false,
      treePlantableOnDirt: false,
      wall: true,
      crabPot: false,
    })),
  };
}

function withTileCapability(
  mapPlacementGrid: MapPlacementGrid,
  x: number,
  y: number,
  capabilityName: "buildable" | "diggable" | "passable" | "wall",
  enabled: boolean,
): MapPlacementGrid {
  const tileIndex = y * mapPlacementGrid.width + x;

  return {
    ...mapPlacementGrid,
    capabilitiesByTile: mapPlacementGrid.capabilitiesByTile.map(
      (tileCapabilities, index) => index === tileIndex
        ? { ...tileCapabilities, [capabilityName]: enabled }
        : tileCapabilities,
    ),
  };
}

function withFillTool(catalogItem: CatalogItem): CatalogItem {
  if (catalogItem.allowedTools.includes("fill")) {
    return catalogItem;
  }

  return {
    ...catalogItem,
    allowedTools: [...catalogItem.allowedTools, "fill"],
  };
}

function createPlainPlacementItem(input: Readonly<{
  footprint?: CatalogTileSize;
  instanceId: number;
  itemId: string;
  x: number;
  y: number;
}>) {
  return {
    instanceId: input.instanceId,
    itemId: input.itemId,
    x: input.x,
    y: input.y,
    layer: "item" as const,
    rotation: 0,
    footprint: input.footprint ?? { width: 1, height: 1 },
    variant: 0,
    tintColor: "#ffffff",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

function requireLockedWallpaper(): CatalogItem {
  const wallpaper = createDecorCatalogFromDataset(
    readLockedCatalogDataset("Furniture.json"),
    catalogDatasetUrls.furniture,
    readLockedCatalogDataset("BigCraftables.json"),
    catalogDatasetUrls.bigCraftables,
  ).items.find((catalogItem) => catalogItem.id === "wp_0");

  if (wallpaper === undefined) {
    throw new Error('Locked decor catalog did not contain item "wp_0".');
  }

  return wallpaper;
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

function createLockedBuildingFillContext(
  buildingId: string,
): Readonly<{
  catalogItem: CatalogItem;
  buildingMetadataById: BuildingPlacementMetadataById;
}> {
  const lockedBuildings = readLockedCatalogDataset("Buildings.json");
  const catalogItem = createBuildingCatalogFromDataset(
    lockedBuildings,
    catalogDatasetUrls.buildings,
  ).items.find((item) => item.id === `building:${buildingId}`);

  if (catalogItem === undefined) {
    throw new Error(
      `Locked building catalog did not contain building ID ${JSON.stringify(buildingId)}.`,
    );
  }

  return {
    catalogItem,
    buildingMetadataById: createBuildingPlacementMetadata(lockedBuildings),
  };
}

describe("applyEditorFill", () => {
  it("fills Blue Grass Starter on valid single tiles, previews the same placements, and supports undo and redo", () => {
    const blueGrassCatalogItem = createBlueGrassCatalogItemFromLockedDatasets();
    const basePlacementGrid = createPlacementGrid(3, 2);
    const mapPlacementGrid: MapPlacementGrid = {
      ...basePlacementGrid,
      capabilitiesByTile: basePlacementGrid.capabilitiesByTile.map(
        (tileCapabilities, tileIndex) => tileIndex === 1
          ? { ...tileCapabilities, passable: false }
          : tileCapabilities,
      ),
    };
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillInput = {
      selectedCatalogItem: blueGrassCatalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 2, y: 1 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    } as const;
    const previewActions = previewPlannerWorkspaceFillRectangle({
      ...fillInput,
      freePlacement: false,
      selectedPlacementKeys: [],
      tool: "fill",
    });
    const fillResult = applyEditorFill(fillInput);

    if (!fillResult.applied) {
      throw new Error("Blue Grass Starter Fill did not produce a placement history.");
    }
    if (previewActions === null) {
      throw new Error("Blue Grass Starter Fill preview did not produce placement actions.");
    }

    const filledItems = fillResult.placementHistory.currentState.items;
    const expectedPreviewActions = filledItems.map((filledItem) => {
      const { instanceId: omittedInstanceId, ...previewItem } = filledItem;
      return { type: "add-item" as const, item: previewItem };
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 5 });
    expect(filledItems).toHaveLength(5);
    expect(filledItems).toEqual([
      expect.objectContaining({ itemId: "grass_7", x: 0, y: 0, isGrass: true }),
      expect.objectContaining({ itemId: "grass_7", x: 2, y: 0, isGrass: true }),
      expect.objectContaining({ itemId: "grass_7", x: 0, y: 1, isGrass: true }),
      expect.objectContaining({ itemId: "grass_7", x: 1, y: 1, isGrass: true }),
      expect.objectContaining({ itemId: "grass_7", x: 2, y: 1, isGrass: true }),
    ]);
    expect(previewActions).toEqual(expectedPreviewActions);
    expect(fillResult.placementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(fillResult.placementHistory.redoStates).toEqual([]);

    const undonePlacementHistory = undoPlacementHistory(fillResult.placementHistory);
    expect(undonePlacementHistory.currentState.items).toEqual([]);
    expect(undonePlacementHistory.redoStates).toEqual([
      fillResult.placementHistory.currentState,
    ]);

    const redonePlacementHistory = redoPlacementHistory(undonePlacementHistory);
    expect(redonePlacementHistory.currentState).toEqual(
      fillResult.placementHistory.currentState,
    );
    expect(redonePlacementHistory.undoStates).toEqual([
      placementHistory.currentState,
    ]);
    expect(redonePlacementHistory.redoStates).toEqual([]);
  });

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

  it("fills Beach Cabin footprints across a 21 by 13 rectangle with matching preview, one history entry, and stable reversed bounds", () => {
    const { catalogItem, buildingMetadataById } =
      createLockedBuildingFillContext("Beach Cabin");
    const sourceSnapshot = createEmptyPlacementSnapshot();
    const placementHistory = createPlacementHistory(sourceSnapshot);
    const sourceHistoryBeforeFill = structuredClone(placementHistory);
    const fillInput = {
      selectedCatalogItem: catalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 20, y: 12 },
      mapPlacementGrid: createPlacementGrid(21, 13),
      buildingMetadataById,
      placementHistory,
    } as const;
    const previewActions = previewPlannerWorkspaceFillRectangle({
      ...fillInput,
      freePlacement: false,
      selectedPlacementKeys: [],
      tool: "fill",
    });
    const fillResult = applyEditorFill(fillInput);
    const reversedFillResult = applyEditorFill({
      ...fillInput,
      firstTile: { x: 20, y: 12 },
      secondTile: { x: 0, y: 0 },
    });

    if (!fillResult.applied) {
      throw new Error("Beach Cabin Fill did not produce a placement history.");
    }
    if (previewActions === null) {
      throw new Error("Beach Cabin Fill preview did not produce placement actions.");
    }
    if (!reversedFillResult.applied) {
      throw new Error("Reversed Beach Cabin Fill did not produce a placement history.");
    }

    const filledBuildings = fillResult.placementHistory.currentState.buildings;
    const expectedOrigins = [
      { x: 0, y: 0 }, { x: 5, y: 0 }, { x: 10, y: 0 }, { x: 15, y: 0 },
      { x: 0, y: 3 }, { x: 5, y: 3 }, { x: 10, y: 3 }, { x: 15, y: 3 },
      { x: 0, y: 6 }, { x: 5, y: 6 }, { x: 10, y: 6 }, { x: 15, y: 6 },
      { x: 0, y: 9 }, { x: 5, y: 9 }, { x: 10, y: 9 }, { x: 15, y: 9 },
    ];
    const occupiedTileKeys = filledBuildings.flatMap((building) =>
      Array.from({ length: 3 }, (_, offsetY) =>
        Array.from({ length: 5 }, (_, offsetX) =>
          `${building.x + offsetX},${building.y + offsetY}`
        )
      ).flat()
    );
    const expectedPreviewActions = filledBuildings.map((building) => {
      const { instanceId: omittedInstanceId, ...previewBuilding } = building;
      return { type: "add-building" as const, building: previewBuilding };
    });

    expect(catalogItem).toMatchObject({
      id: "building:Beach Cabin",
      tileSize: { width: 5, height: 3 },
    });
    expect(buildingMetadataById["Beach Cabin"]?.size).toEqual({
      width: 5,
      height: 3,
    });
    expect(fillResult.placedTileCount).toBe(16);
    expect(filledBuildings.map(({ x, y }) => ({ x, y }))).toEqual(expectedOrigins);
    expect(new Set(occupiedTileKeys).size).toBe(16 * 5 * 3);
    expect(previewActions).toEqual(expectedPreviewActions);
    expect(reversedFillResult.placementHistory.currentState.buildings).toEqual(
      filledBuildings,
    );
    expect(placementHistory).toEqual(sourceHistoryBeforeFill);
    expect(placementHistory.currentState).toBe(sourceSnapshot);
    expect(fillResult.placementHistory.undoStates).toEqual([sourceSnapshot]);
    expect(fillResult.placementHistory.redoStates).toEqual([]);

    const undonePlacementHistory = undoPlacementHistory(fillResult.placementHistory);
    expect(undonePlacementHistory.currentState).toBe(sourceSnapshot);
    expect(undonePlacementHistory.undoStates).toEqual([]);
    expect(undonePlacementHistory.redoStates).toEqual([
      fillResult.placementHistory.currentState,
    ]);

    const redonePlacementHistory = redoPlacementHistory(undonePlacementHistory);
    expect(redonePlacementHistory.currentState).toEqual(
      fillResult.placementHistory.currentState,
    );
    expect(redonePlacementHistory.undoStates).toEqual([sourceSnapshot]);
    expect(redonePlacementHistory.redoStates).toEqual([]);
  });

  it("skips a blocked Beach Cabin footprint while committing the other candidates", () => {
    const { catalogItem, buildingMetadataById } =
      createLockedBuildingFillContext("Beach Cabin");
    const sourceSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ buildingId: "Cabin", instanceId: 1, x: 0, y: 0 }],
      nextBuildingId: 2,
    };
    const placementHistory = createPlacementHistory(sourceSnapshot);
    const fillResult = applyEditorFill({
      selectedCatalogItem: catalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 20, y: 12 },
      mapPlacementGrid: createPlacementGrid(21, 13),
      buildingMetadataById,
      placementHistory,
    });

    if (!fillResult.applied) {
      throw new Error("Beach Cabin Fill did not commit its unblocked candidates.");
    }

    const newBuildings = fillResult.placementHistory.currentState.buildings.filter(
      (building) => building.buildingId === "Beach Cabin",
    );

    expect(fillResult.placedTileCount).toBe(15);
    expect(fillResult.placementHistory.currentState.buildings).toHaveLength(16);
    expect(newBuildings).toHaveLength(15);
    expect(newBuildings.some(({ x, y }) => x === 0 && y === 0)).toBe(false);
    expect(fillResult.placementHistory.undoStates).toEqual([sourceSnapshot]);
    expect(placementHistory.currentState).toBe(sourceSnapshot);
  });

  it("keeps accepted Farmhouse additional placement tiles occupied for later Fill candidates", () => {
    const { catalogItem, buildingMetadataById } =
      createLockedBuildingFillContext("Farmhouse");
    const sourceSnapshot = createEmptyPlacementSnapshot();
    const placementHistory = createPlacementHistory(sourceSnapshot);
    const fillInput = {
      selectedCatalogItem: catalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 8, y: 14 },
      mapPlacementGrid: createPlacementGrid(10, 16),
      buildingMetadataById,
      placementHistory,
    } as const;
    const previewActions = previewPlannerWorkspaceFillRectangle({
      ...fillInput,
      freePlacement: false,
      selectedPlacementKeys: [],
      tool: "fill",
    });
    const fillResult = applyEditorFill(fillInput);

    if (!fillResult.applied) {
      throw new Error("Farmhouse Fill did not produce its unblocked placements.");
    }
    if (previewActions === null) {
      throw new Error("Farmhouse Fill preview did not produce placement actions.");
    }

    const farmhouseMetadata = buildingMetadataById.Farmhouse;
    if (farmhouseMetadata === undefined) {
      throw new Error('Locked building metadata did not contain "Farmhouse".');
    }
    const filledBuildings = fillResult.placementHistory.currentState.buildings;

    expect(catalogItem).toMatchObject({
      id: "building:Farmhouse",
      tileSize: { width: 9, height: 5 },
    });
    expect(farmhouseMetadata).toMatchObject({
      size: { width: 9, height: 5 },
      additionalPlacementTiles: expect.arrayContaining([
        {
          x: 5,
          y: 5,
          width: 1,
          height: 1,
          onlyNeedsToBePassable: true,
        },
      ]),
    });
    expect(fillResult.placedTileCount).toBe(2);
    expect(filledBuildings).toEqual([
      { buildingId: "Farmhouse", instanceId: 1, x: 0, y: 0 },
      { buildingId: "Farmhouse", instanceId: 2, x: 0, y: 10 },
    ]);
    expect(previewActions).toEqual([
      { type: "add-building", building: { buildingId: "Farmhouse", x: 0, y: 0 } },
      { type: "add-building", building: { buildingId: "Farmhouse", x: 0, y: 10 } },
    ]);
    expect(placementHistory.currentState).toBe(sourceSnapshot);
    expect(fillResult.placementHistory.undoStates).toEqual([sourceSnapshot]);
    expect(fillResult.placementHistory.redoStates).toEqual([]);

    const undonePlacementHistory = undoPlacementHistory(fillResult.placementHistory);
    expect(undonePlacementHistory.currentState).toBe(sourceSnapshot);
    expect(undonePlacementHistory.currentState.buildings).toEqual([]);
    expect(undonePlacementHistory.undoStates).toEqual([]);
    expect(undonePlacementHistory.redoStates).toEqual([
      fillResult.placementHistory.currentState,
    ]);

    const redonePlacementHistory = redoPlacementHistory(undonePlacementHistory);
    expect(redonePlacementHistory.currentState).toEqual(
      fillResult.placementHistory.currentState,
    );
    expect(redonePlacementHistory.currentState.buildings).toHaveLength(2);
    expect(redonePlacementHistory.undoStates).toEqual([sourceSnapshot]);
    expect(redonePlacementHistory.redoStates).toEqual([]);
  });

  it("returns the first real occupancy validation and preserves history when every building candidate is blocked", () => {
    const { catalogItem, buildingMetadataById } =
      createLockedBuildingFillContext("Beach Cabin");
    const sourceSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ buildingId: "Cabin", instanceId: 1, x: 0, y: 0 }],
      nextBuildingId: 2,
    };
    const placementHistory = createPlacementHistory(sourceSnapshot);
    const fillResult = applyEditorFill({
      selectedCatalogItem: catalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 4, y: 2 },
      mapPlacementGrid: createPlacementGrid(5, 3),
      buildingMetadataById,
      placementHistory,
    });

    expect(fillResult).toEqual({
      applied: false,
      placementHistory,
      validation: {
        valid: false,
        reason: "occupied-by-building",
        tile: { x: 0, y: 0 },
      },
    });
    expect(placementHistory.currentState).toBe(sourceSnapshot);
    expect(placementHistory.undoStates).toEqual([]);
    expect(placementHistory.redoStates).toEqual([]);
  });

  it("treats a rectangle smaller than the Beach Cabin footprint as a no-op", () => {
    const { catalogItem, buildingMetadataById } =
      createLockedBuildingFillContext("Beach Cabin");
    const sourceSnapshot = createEmptyPlacementSnapshot();
    const placementHistory = createPlacementHistory(sourceSnapshot);
    const fillInput = {
      selectedCatalogItem: catalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 3, y: 2 },
      mapPlacementGrid: createPlacementGrid(5, 3),
      buildingMetadataById,
      placementHistory,
    } as const;
    const previewActions = previewPlannerWorkspaceFillRectangle({
      ...fillInput,
      freePlacement: false,
      selectedPlacementKeys: [],
      tool: "fill",
    });
    const fillResult = applyEditorFill(fillInput);

    expect(fillResult).toEqual({
      applied: true,
      placedTileCount: 0,
      placementHistory,
    });
    expect(previewActions).toEqual([]);
    expect(placementHistory.currentState).toBe(sourceSnapshot);
    expect(placementHistory.undoStates).toEqual([]);
    expect(placementHistory.redoStates).toEqual([]);
  });

  it("preserves a selected Fish Pond variant through Fill", () => {
    const { catalogItem, buildingMetadataById } =
      createLockedBuildingFillContext("Fish Pond");
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillResult = applyEditorFill({
      selectedCatalogItem: catalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 2 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 4, y: 4 },
      mapPlacementGrid: createPlacementGrid(5, 5),
      buildingMetadataById,
      placementHistory,
    });

    expect(catalogItem.id).toBe("building:Fish Pond");
    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(fillResult.placementHistory.currentState.buildings).toEqual([
      { buildingId: "Fish Pond", instanceId: 1, variant: 2, x: 0, y: 0 },
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

  it("uses the runtime random source for FreeCactus Fill by default", () => {
    const sampledFractions = [
      0, 0, 0,
      15 / 16, 23 / 24, 23 / 24,
    ];
    let sampleIndex = 0;
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(
      () => sampledFractions[sampleIndex++]!,
    );
    let fillResult: ReturnType<typeof applyEditorFill> | undefined;

    try {
      fillResult = applyEditorFill({
        selectedCatalogItem: createFreeCactusCatalogItem(),
        catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
        firstTile: { x: 0, y: 0 },
        secondTile: { x: 1, y: 0 },
        mapPlacementGrid: createPlacementGrid(2, 1),
        buildingMetadataById: createBuildingMetadataById(),
        placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
      });
    } finally {
      randomSpy.mockRestore();
    }

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult?.placementHistory.currentState.items.map((item) =>
      item.variant
    )).toEqual([0, 9215]);
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
      applied: true,
      placedTileCount: 1,
    });
    expect(fillResult.placementHistory.currentState.items).toHaveLength(1);
    expect(fillResult.placementHistory.undoStates).toEqual([placementHistory.currentState]);
    expect(sampledFractionCount).toBe(3);
  });

  it("fills only a fence perimeter and skips invalid tiles in an ordinary rectangle", () => {
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
      applied: true,
      placedTileCount: 3,
    });
    expect(invalidFillResult.placementHistory.currentState.items.map((item) => item.x)).toEqual([0, 1, 2]);
    expect(invalidFillResult.placementHistory.undoStates).toEqual([placementHistory.currentState]);
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

  it("fills Torch object:93 on legal tiles and supports undo and redo", () => {
    const torchCatalogItem = requireLockedPlaceableCatalogItem("object:93");
    const presentationChoice = { flipped: false, rotation: 0, variant: 0 } as const;
    expect(torchCatalogItem.name).toBe("Torch");
    expect(torchCatalogItem.allowedTools).toEqual([
      "cursor",
      "multi-select",
      "fill",
      "erase",
    ]);

    const openPlacementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const openFillResult = applyEditorFill({
      selectedCatalogItem: torchCatalogItem,
      catalogPresentationChoice: presentationChoice,
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: createPlacementGrid(2, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: openPlacementHistory,
    });
    if (!openFillResult.applied) {
      throw new Error(
        `Torch Fill did not apply on an open rectangle; received ${JSON.stringify(openFillResult)}.`,
      );
    }

    expect(openFillResult.placedTileCount).toBe(4);
    expect(openFillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ itemId: "object:93", x: 0, y: 0 }),
      expect.objectContaining({ itemId: "object:93", x: 1, y: 0 }),
      expect.objectContaining({ itemId: "object:93", x: 0, y: 1 }),
      expect.objectContaining({ itemId: "object:93", x: 1, y: 1 }),
    ]);
    expect(openFillResult.placementHistory.undoStates).toEqual([
      openPlacementHistory.currentState,
    ]);
    expect(openFillResult.placementHistory.redoStates).toEqual([]);

    const undoneOpenPlacementHistory = undoPlacementHistory(
      openFillResult.placementHistory,
    );
    expect(undoneOpenPlacementHistory.currentState.items).toEqual([]);
    expect(undoneOpenPlacementHistory.redoStates).toEqual([
      openFillResult.placementHistory.currentState,
    ]);
    const redoneOpenPlacementHistory = redoPlacementHistory(
      undoneOpenPlacementHistory,
    );
    expect(redoneOpenPlacementHistory.currentState).toEqual(
      openFillResult.placementHistory.currentState,
    );
    expect(redoneOpenPlacementHistory.undoStates).toEqual([
      openPlacementHistory.currentState,
    ]);
    expect(redoneOpenPlacementHistory.redoStates).toEqual([]);

    const openPlacementGrid = createPlacementGrid(2, 2);
    const constrainedPlacementGrid: MapPlacementGrid = {
      ...openPlacementGrid,
      capabilitiesByTile: openPlacementGrid.capabilitiesByTile.map(
        (tileCapabilities, tileIndex) => tileIndex === 2
          ? { ...tileCapabilities, passable: false }
          : tileCapabilities,
      ),
    };
    const occupiedPlacementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          instanceId: 1,
          itemId: "object:blocker",
          x: 1,
          y: 0,
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
    const constrainedPlacementHistory = createPlacementHistory(
      occupiedPlacementSnapshot,
    );
    const constrainedFillResult = applyEditorFill({
      selectedCatalogItem: torchCatalogItem,
      catalogPresentationChoice: presentationChoice,
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: constrainedPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: constrainedPlacementHistory,
    });
    if (!constrainedFillResult.applied) {
      throw new Error(
        `Torch Fill did not apply around blocked tiles; received ${JSON.stringify(constrainedFillResult)}.`,
      );
    }

    expect(constrainedFillResult.placedTileCount).toBe(2);
    expect(constrainedFillResult.placementHistory.currentState.items).toEqual([
      occupiedPlacementSnapshot.items[0],
      expect.objectContaining({ itemId: "object:93", x: 0, y: 0 }),
      expect.objectContaining({ itemId: "object:93", x: 1, y: 1 }),
    ]);
    const undoneConstrainedPlacementHistory = undoPlacementHistory(
      constrainedFillResult.placementHistory,
    );
    expect(undoneConstrainedPlacementHistory.currentState).toBe(
      occupiedPlacementSnapshot,
    );
    expect(undoneConstrainedPlacementHistory.currentState.items).toHaveLength(1);
    const redoneConstrainedPlacementHistory = redoPlacementHistory(
      undoneConstrainedPlacementHistory,
    );
    expect(redoneConstrainedPlacementHistory.currentState.items).toHaveLength(3);
  });

  it("leaves history unchanged when no catalog item is selected", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillResult = applyEditorFill({
      selectedCatalogItem: null,
      catalogPresentationChoice: null,
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: createPlacementGrid(2, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toEqual({
      applied: false,
      reason: "no-selected-catalog-item",
      placementHistory,
    });
    expect(placementHistory.currentState.items).toEqual([]);
    expect(placementHistory.undoStates).toEqual([]);
    expect(placementHistory.redoStates).toEqual([]);
  });

  it("rejects an explicit catalog item that does not list the fill tool", () => {
    const unsupportedCatalogItem = createCatalogItem({
      id: "object:fill-guard",
      category: "placeable",
      allowedTools: ["cursor", "multi-select", "erase"],
    });
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillResult = applyEditorFill({
      selectedCatalogItem: unsupportedCatalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: createPlacementGrid(2, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(unsupportedCatalogItem.allowedTools).not.toContain("fill");
    expect(fillResult).toEqual({
      applied: false,
      reason: "unsupported-catalog-category",
      placementHistory,
    });
    expect(placementHistory.currentState.items).toEqual([]);
    expect(placementHistory.undoStates).toEqual([]);
    expect(placementHistory.redoStates).toEqual([]);
  });

  it("rejects an illegal tile or footprint before changing history", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const floorCatalogItem = createCatalogItem({
      id: "floor:zero",
      category: "floor",
      tileSize: { width: 0, height: 1 },
    });

    expect(() => applyEditorFill({
      selectedCatalogItem: null,
      catalogPresentationChoice: null,
      firstTile: { x: -1, y: 0 },
      secondTile: { x: 0, y: 0 },
      mapPlacementGrid: createPlacementGrid(1, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    })).toThrow(/firstTile\.x[\s\S]*-1/);
    expect(() => applyEditorFill({
      selectedCatalogItem: floorCatalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: createPlacementGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    })).toThrow(/footprint width for catalog item "floor:zero"[\s\S]*received 0/);
    expect(() => applyEditorFill({
      selectedCatalogItem: {
        ...createCatalogItem({
          id: "decor:bad-kind",
          category: "decor",
        }),
        interiorDecorKind: "ceiling" as "wallpaper",
      },
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 0, y: 0 },
      mapPlacementGrid: createPlacementGrid(1, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    })).toThrow(/decor:bad-kind[\s\S]*ceiling/);
    expect(placementHistory.currentState.items).toEqual([]);
    expect(placementHistory.undoStates).toEqual([]);
    expect(placementHistory.redoStates).toEqual([]);
  });

  it("does not stamp wallpaper or indoor flooring, even when fill is listed", () => {
    const lockedWallpaper = requireLockedWallpaper();
    const fillableWallpaper = createCatalogItem({
      id: "wp_fillable",
      category: "decor",
      interiorDecorKind: "wallpaper",
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
    });
    const fillableFlooring = createCatalogItem({
      id: "fl_fillable",
      category: "decor",
      interiorDecorKind: "flooring",
      allowedTools: ["cursor", "multi-select", "fill", "erase"],
    });
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    for (const selectedCatalogItem of [
      lockedWallpaper,
      fillableWallpaper,
      fillableFlooring,
    ]) {
      const fillResult = applyEditorFill({
        selectedCatalogItem,
        catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
        firstTile: { x: 0, y: 0 },
        secondTile: { x: 2, y: 2 },
        mapPlacementGrid: createPlacementGrid(3, 3),
        buildingMetadataById: createBuildingMetadataById(),
        placementHistory,
      });

      expect(fillResult).toEqual({
        applied: false,
        reason: "unsupported-catalog-category",
        placementHistory,
      });
    }

    expect(lockedWallpaper.interiorDecorKind).toBe("wallpaper");
    expect(placementHistory.currentState.items).toEqual([]);
    expect(placementHistory.undoStates).toEqual([]);
  });

  it("stamps Stone and a Keg around blocked tiles as one undo", () => {
    const stone = withFillTool(requireLockedPlaceableCatalogItem("object:390"));
    const keg = withFillTool(requireLockedPlaceableCatalogItem("big-craftable:12"));
    const stoneHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const stoneResult = applyEditorFill({
      selectedCatalogItem: stone,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: withTileCapability(
        createPlacementGrid(2, 2),
        1,
        0,
        "passable",
        false,
      ),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: stoneHistory,
    });
    const kegHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const kegResult = applyEditorFill({
      selectedCatalogItem: keg,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 1, y: 0 },
      secondTile: { x: 0, y: 0 },
      mapPlacementGrid: createPlacementGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: kegHistory,
    });

    expect(stone.name).toBe("Stone");
    expect(stone.id).not.toBe("object:93");
    expect(stoneResult).toMatchObject({ applied: true, placedTileCount: 3 });
    expect(stoneResult.placementHistory.currentState.items.map(({ x, y }) => ({ x, y }))).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
    expect(stoneResult.placementHistory.undoStates).toEqual([stoneHistory.currentState]);
    expect(undoPlacementHistory(stoneResult.placementHistory).currentState.items).toEqual([]);
    expect(redoPlacementHistory(undoPlacementHistory(stoneResult.placementHistory)).currentState)
      .toEqual(stoneResult.placementHistory.currentState);
    expect(keg.name).toBe("Keg");
    expect(keg.tileSize).toEqual({ width: 1, height: 1 });
    expect(kegResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(kegResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ itemId: "big-craftable:12", x: 0, y: 0 }),
      expect.objectContaining({ itemId: "big-craftable:12", x: 1, y: 0 }),
    ]);
    expect(kegResult.placementHistory.undoStates).toEqual([kegHistory.currentState]);
    expect(kegResult.placementHistory.redoStates).toEqual([]);
  });

  it("keeps a wild tree flip and variant on every filled origin", () => {
    const wildTree = withFillTool(requireLockedPlaceableCatalogItem("wildtree_1"));
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const treePlacementGrid = createPlacementGrid(2, 1);
    const fillResult = applyEditorFill({
      selectedCatalogItem: wildTree,
      catalogPresentationChoice: { flipped: true, rotation: 0, variant: 1 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: {
        ...treePlacementGrid,
        capabilitiesByTile: treePlacementGrid.capabilitiesByTile.map(
          (tileCapabilities) => ({
            ...tileCapabilities,
            treePlantable: true,
          }),
        ),
      },
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(wildTree.presentationCapabilities?.canFlip).toBe(true);
    expect(wildTree.presentationCapabilities?.variantCycle?.count).toBe(2);
    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        flipped: true,
        footprint: { width: 1, height: 1 },
        itemId: "wildtree_1",
        rotation: 0,
        variant: 1,
        x: 0,
      }),
      expect.objectContaining({
        flipped: true,
        itemId: "wildtree_1",
        variant: 1,
        x: 1,
      }),
    ]);
    expect(fillResult.placementHistory.undoStates).toEqual([placementHistory.currentState]);
  });

  it("tiles resource clumps inside the selection and skips an occupied origin", () => {
    const stump = withFillTool(requireLockedPlaceableCatalogItem("clump_600"));
    const openHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const openResult = applyEditorFill({
      selectedCatalogItem: stump,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 4, y: 1 },
      secondTile: { x: 0, y: 0 },
      mapPlacementGrid: createPlacementGrid(5, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: openHistory,
    });
    const blocker = createPlainPlacementItem({
      instanceId: 1,
      itemId: "object:blocker",
      x: 2,
      y: 0,
    });
    const occupiedSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [blocker],
      nextItemId: 2,
    };
    const occupiedHistory = createPlacementHistory(occupiedSnapshot);
    const occupiedResult = applyEditorFill({
      selectedCatalogItem: stump,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 4, y: 1 },
      mapPlacementGrid: createPlacementGrid(5, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: occupiedHistory,
    });

    expect(stump.category).toBe("decor");
    expect(stump.interiorDecorKind).toBeUndefined();
    expect(stump.tileSize).toEqual({ width: 2, height: 2 });
    expect(openResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(openResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        footprint: { width: 2, height: 2 },
        itemId: "clump_600",
        x: 0,
        y: 0,
      }),
      expect.objectContaining({
        footprint: { width: 2, height: 2 },
        itemId: "clump_600",
        x: 2,
        y: 0,
      }),
    ]);
    expect(openResult.placementHistory.undoStates).toEqual([openHistory.currentState]);
    expect(occupiedResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(occupiedResult.placementHistory.currentState.items).toEqual([
      blocker,
      expect.objectContaining({ itemId: "clump_600", x: 0, y: 0 }),
    ]);
    expect(occupiedResult.placementHistory.undoStates).toEqual([occupiedSnapshot]);
    expect(occupiedHistory.currentState).toBe(occupiedSnapshot);
  });

  it("rejects a decorative door off a wall and tiles complete wall footprints", () => {
    const door = withFillTool(
      requireLockedPlaceableCatalogItem("furniture_DecorativeDoor1"),
    );
    const rejectedHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const rejectedResult = applyEditorFill({
      selectedCatalogItem: door,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 2 },
      mapPlacementGrid: createPlacementGrid(4, 3),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: rejectedHistory,
    });
    const wallHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const wallResult = applyEditorFill({
      selectedCatalogItem: door,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 3, y: 2 },
      mapPlacementGrid: withTileCapability(
        createWallPlacementGrid(4, 3),
        3,
        0,
        "wall",
        false,
      ),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: wallHistory,
    });

    expect(door.tileSize).toEqual({ width: 2, height: 3 });
    expect(door.renderingMetadata).toMatchObject({
      bedType: null,
      kind: "furniture",
      wallMounted: true,
    });
    expect(rejectedResult).toEqual({
      applied: false,
      placementHistory: rejectedHistory,
      validation: {
        reason: "not-wall",
        tile: { x: 0, y: 0 },
        valid: false,
      },
    });
    expect(rejectedHistory.undoStates).toEqual([]);
    expect(wallResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(wallResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        footprint: { width: 2, height: 3 },
        itemId: "furniture_DecorativeDoor1",
        x: 0,
        y: 0,
      }),
    ]);
    expect(wallResult.placementHistory.undoStates).toEqual([wallHistory.currentState]);
  });

  it("uses the rotated bench footprint and stays inside the selection", () => {
    const bench = withFillTool(requireLockedPlaceableCatalogItem("furniture_192"));
    const wideHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const wideResult = applyEditorFill({
      selectedCatalogItem: bench,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 3, y: 0 },
      mapPlacementGrid: createPlacementGrid(4, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: wideHistory,
    });
    const tooShortHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const tooShortResult = applyEditorFill({
      selectedCatalogItem: bench,
      catalogPresentationChoice: { flipped: false, rotation: 1, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 3, y: 0 },
      mapPlacementGrid: createPlacementGrid(4, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: tooShortHistory,
    });
    const tallHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const tallResult = applyEditorFill({
      selectedCatalogItem: bench,
      catalogPresentationChoice: { flipped: false, rotation: 1, variant: 0 },
      firstTile: { x: 1, y: 3 },
      secondTile: { x: 0, y: 0 },
      mapPlacementGrid: createPlacementGrid(2, 4),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: tallHistory,
    });

    expect(bench.name).toBe("Oak Bench");
    expect(bench.presentationCapabilities?.rotation?.footprints).toEqual([
      { width: 2, height: 1 },
      { width: 1, height: 2 },
      { width: 2, height: 1 },
      { width: 1, height: 2 },
    ]);
    expect(wideResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(wideResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        footprint: { width: 2, height: 1 },
        rotation: 0,
        x: 0,
        y: 0,
      }),
      expect.objectContaining({
        footprint: { width: 2, height: 1 },
        rotation: 0,
        x: 2,
        y: 0,
      }),
    ]);
    expect(tooShortResult).toEqual({
      applied: true,
      placedTileCount: 0,
      placementHistory: tooShortHistory,
    });
    expect(tooShortHistory.undoStates).toEqual([]);
    expect(tallResult).toMatchObject({ applied: true, placedTileCount: 4 });
    expect(tallResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ footprint: { width: 1, height: 2 }, rotation: 1, x: 0, y: 0 }),
      expect.objectContaining({ footprint: { width: 1, height: 2 }, rotation: 1, x: 1, y: 0 }),
      expect.objectContaining({ footprint: { width: 1, height: 2 }, rotation: 1, x: 0, y: 2 }),
      expect.objectContaining({ footprint: { width: 1, height: 2 }, rotation: 1, x: 1, y: 2 }),
    ]);
    expect(tallResult.placementHistory.undoStates).toEqual([tallHistory.currentState]);
    expect(undoPlacementHistory(tallResult.placementHistory).currentState.items).toEqual([]);
  });

  it("tiles a large bush by its 3 by 1 footprint", () => {
    const bush = withFillTool(requireLockedPlaceableCatalogItem("bush:large"));
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillResult = applyEditorFill({
      selectedCatalogItem: bush,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 5, y: 0 },
      mapPlacementGrid: createPlacementGrid(6, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(bush.category).toBe("placeable");
    expect(bush.tileSize).toEqual({ width: 3, height: 1 });
    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        footprint: { width: 3, height: 1 },
        itemId: "bush:large",
        x: 0,
        y: 0,
      }),
      expect.objectContaining({
        footprint: { width: 3, height: 1 },
        itemId: "bush:large",
        x: 3,
        y: 0,
      }),
    ]);
    expect(fillResult.placementHistory.undoStates).toEqual([placementHistory.currentState]);
  });

  it("tiles small and medium bushes by footprint and keeps the medium variant", () => {
    const smallBush = withFillTool(requireLockedPlaceableCatalogItem("bush:small"));
    const mediumBush = withFillTool(requireLockedPlaceableCatalogItem("bush:medium"));
    const smallHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const mediumHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const narrowHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const smallResult = applyEditorFill({
      selectedCatalogItem: smallBush,
      catalogPresentationChoice: { flipped: true, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: createPlacementGrid(2, 2),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: smallHistory,
    });
    const mediumResult = applyEditorFill({
      selectedCatalogItem: mediumBush,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 1 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 3, y: 0 },
      mapPlacementGrid: createPlacementGrid(4, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: mediumHistory,
    });
    const narrowResult = applyEditorFill({
      selectedCatalogItem: mediumBush,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 1 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 2, y: 0 },
      mapPlacementGrid: createPlacementGrid(3, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: narrowHistory,
    });

    expect(smallBush.tileSize).toEqual({ width: 1, height: 1 });
    expect(mediumBush.tileSize).toEqual({ width: 2, height: 1 });
    expect(smallResult).toMatchObject({ applied: true, placedTileCount: 4 });
    expect(smallResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ flipped: true, itemId: "bush:small", x: 0, y: 0 }),
      expect.objectContaining({ flipped: true, itemId: "bush:small", x: 1, y: 0 }),
      expect.objectContaining({ flipped: true, itemId: "bush:small", x: 0, y: 1 }),
      expect.objectContaining({ flipped: true, itemId: "bush:small", x: 1, y: 1 }),
    ]);
    expect(smallResult.placementHistory.undoStates).toEqual([smallHistory.currentState]);
    expect(undoPlacementHistory(smallResult.placementHistory).currentState.items).toEqual([]);
    expect(mediumResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(mediumResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        footprint: { width: 2, height: 1 },
        itemId: "bush:medium",
        variant: 1,
        x: 0,
        y: 0,
      }),
      expect.objectContaining({
        footprint: { width: 2, height: 1 },
        itemId: "bush:medium",
        variant: 1,
        x: 2,
        y: 0,
      }),
    ]);
    expect(mediumResult.placementHistory.undoStates).toHaveLength(1);
    expect(narrowResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(narrowResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({
        footprint: { width: 2, height: 1 },
        itemId: "bush:medium",
        variant: 1,
        x: 0,
        y: 0,
      }),
    ]);
  });

  it("leaves history unchanged when a bush footprint cannot fit or the map rejects every origin", () => {
    const largeBush = withFillTool(requireLockedPlaceableCatalogItem("bush:large"));
    const tooNarrowHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const tooNarrowResult = applyEditorFill({
      selectedCatalogItem: largeBush,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: createPlacementGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: tooNarrowHistory,
    });
    const blockedHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const blockedResult = applyEditorFill({
      selectedCatalogItem: largeBush,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 5, y: 0 },
      mapPlacementGrid: createBlockedPlacementGrid(6, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: blockedHistory,
    });
    const occupiedHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createPlainPlacementItem({ instanceId: 1, itemId: "object:390", x: 0, y: 0 })],
      nextItemId: 2,
    });
    const occupiedResult = applyEditorFill({
      selectedCatalogItem: largeBush,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 5, y: 0 },
      mapPlacementGrid: createPlacementGrid(6, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: occupiedHistory,
    });

    expect(tooNarrowResult).toEqual({
      applied: true,
      placedTileCount: 0,
      placementHistory: tooNarrowHistory,
    });
    expect(tooNarrowHistory.undoStates).toEqual([]);
    expect(blockedResult).toEqual({
      applied: false,
      placementHistory: blockedHistory,
      validation: {
        reason: "not-passable",
        tile: { x: 0, y: 0 },
        valid: false,
      },
    });
    expect(blockedHistory.currentState.items).toEqual([]);
    expect(occupiedResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(occupiedResult.placementHistory.currentState.items).toEqual([
      expect.objectContaining({ instanceId: 1, itemId: "object:390", x: 0, y: 0 }),
      expect.objectContaining({
        footprint: { width: 3, height: 1 },
        instanceId: 2,
        itemId: "bush:large",
        x: 3,
        y: 0,
      }),
    ]);
    expect(occupiedResult.placementHistory.undoStates).toEqual([
      occupiedHistory.currentState,
    ]);
    expect(occupiedResult.placementHistory.currentState.nextItemId).toBe(3);
  });

  it("records ordinary crops separately and skips a tile that is not diggable", () => {
    const crop = createCatalogItem({ id: "crop:24", category: "crop" });
    const partialHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const partialResult = applyEditorFill({
      selectedCatalogItem: crop,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 1 },
      mapPlacementGrid: withTileCapability(
        createPlacementGrid(2, 2),
        1,
        0,
        "diggable",
        false,
      ),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: partialHistory,
    });
    const blockedHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const blockedResult = applyEditorFill({
      selectedCatalogItem: crop,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid: createNonDiggablePassableGrid(2, 1),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: blockedHistory,
    });

    expect(partialResult).toMatchObject({ applied: true, placedTileCount: 3 });
    expect(partialResult.placementHistory.currentState).toMatchObject({
      crops: [
        { cropId: "crop:24", x: 0, y: 0 },
        { cropId: "crop:24", x: 0, y: 1 },
        { cropId: "crop:24", x: 1, y: 1 },
      ],
      items: [],
      nextItemId: 1,
    });
    expect(partialResult.placementHistory.undoStates).toEqual([
      partialHistory.currentState,
    ]);
    expect(blockedResult).toEqual({
      applied: false,
      placementHistory: blockedHistory,
      validation: {
        reason: "not-diggable",
        tile: { x: 0, y: 0 },
        valid: false,
      },
    });
    expect(blockedHistory.currentState.crops).toEqual([]);
    expect(blockedHistory.undoStates).toEqual([]);
  });

  it("preserves existing snapshot fields while filling one floor tile", () => {
    const sourceSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{
        buildingId: "Fish Pond",
        instanceId: 1,
        variant: 2,
        waterColor: 0x224466,
        x: 5,
        y: 5,
      }],
      crops: [{ cropId: "crop:24", x: 4, y: 4 }],
      interiorDecor: {
        floors: { kitchen: "4" },
        wallpapers: { bedroom: "12" },
      },
      items: [{
        ...createPlainPlacementItem({
          instanceId: 1,
          itemId: "object:93",
          x: 0,
          y: 0,
        }),
        flipped: true,
        growthStage: 3,
        locked: true,
        nightLightState: "off" as const,
        rotation: 2,
        tintColor: "#112233",
        variant: 1,
      }],
      nextBuildingId: 2,
      nextItemId: 2,
    };
    const placementHistory = createPlacementHistory(sourceSnapshot);
    const fillResult = applyEditorFill({
      selectedCatalogItem: createCatalogItem({ id: "floor:1", category: "floor" }),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 2, y: 0 },
      secondTile: { x: 2, y: 0 },
      mapPlacementGrid: createPlacementGrid(6, 6),
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory,
    });

    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(fillResult.placementHistory.currentState).toMatchObject({
      buildings: sourceSnapshot.buildings,
      crops: sourceSnapshot.crops,
      interiorDecor: sourceSnapshot.interiorDecor,
      nextBuildingId: 2,
      nextItemId: 3,
    });
    expect(fillResult.placementHistory.currentState.items).toEqual([
      sourceSnapshot.items[0],
      expect.objectContaining({ itemId: "floor:1", layer: "path", x: 2, y: 0 }),
    ]);
    expect(fillResult.placementHistory.undoStates).toEqual([sourceSnapshot]);
    expect(placementHistory.currentState).toBe(sourceSnapshot);
  });

  it("skips long-table held targets and still adds one undo for a legal neighbor", () => {
    const longTable = readLockedPlaceableCatalogItems().find((catalogItem) =>
      catalogItem.renderingMetadata?.kind === "furniture"
      && catalogItem.renderingMetadata.isLongTable
      && !catalogItem.renderingMetadata.wallMounted
    );
    const chair = requireLockedPlaceableCatalogItem("furniture_0");
    if (longTable === undefined) {
      throw new Error("Locked placeable catalog did not contain a floor long table.");
    }
    const longTableFootprint = longTable.presentationCapabilities?.rotation?.footprints[0]
      ?? longTable.tileSize;
    const mapPlacementGrid = createPlacementGrid(
      longTableFootprint.width + 1,
      longTableFootprint.height,
    );
    const tablePlacement = applyEditorCursorPlacement({
      selectedCatalogItem: longTable,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      cursorTile: { x: 0, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
    });
    if (!tablePlacement.applied) {
      throw new Error(
        `Long table ${JSON.stringify(longTable.id)} did not place; received ${JSON.stringify(tablePlacement)}.`,
      );
    }

    const tableHistory = tablePlacement.placementHistory;
    const rejectedFillResult = applyEditorFill({
      selectedCatalogItem: withFillTool(chair),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 0, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: tableHistory,
    });
    expect(rejectedFillResult).toEqual({
      applied: false,
      reason: "invalid-held-item-target",
      targetReason: "long-table",
      placementHistory: tableHistory,
    });
    expect(rejectedFillResult.placementHistory).toBe(tableHistory);
    expect(rejectedFillResult.placementHistory.currentState).toBe(tableHistory.currentState);
    expect(rejectedFillResult.placementHistory.undoStates).toBe(tableHistory.undoStates);
    expect(rejectedFillResult.placementHistory.redoStates).toBe(tableHistory.redoStates);
    expect(tableHistory.currentState.items).toHaveLength(1);
    expect(tableHistory.currentState.items[0]?.heldItem).toBeUndefined();

    const fillResult = applyEditorFill({
      selectedCatalogItem: withFillTool(chair),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: longTableFootprint.width, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: tableHistory,
    });

    expect(longTable.renderingMetadata).toMatchObject({
      isLongTable: true,
      wallMounted: false,
    });
    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(fillResult.placementHistory.currentState.items).toHaveLength(2);
    expect(fillResult.placementHistory.currentState.items[0]).toMatchObject({
      itemId: longTable.id,
      x: 0,
      y: 0,
    });
    expect(fillResult.placementHistory.currentState.items[0]?.heldItem).toBeUndefined();
    expect(fillResult.placementHistory.currentState.items[1]).toMatchObject({
      itemId: "furniture_0",
      x: longTableFootprint.width,
      y: 0,
    });
    expect(fillResult.placementHistory.undoStates).toEqual([
      ...tableHistory.undoStates,
      tableHistory.currentState,
    ]);
    expect(fillResult.placementHistory.redoStates).toEqual([]);
    expect(undoPlacementHistory(fillResult.placementHistory).currentState).toBe(
      tableHistory.currentState,
    );
  });

  it("keeps one undo when a fill attaches to an empty table and places the next tile", () => {
    const endTable = requireLockedPlaceableCatalogItem("furniture_1391");
    const chair = requireLockedPlaceableCatalogItem("furniture_0");
    const mapPlacementGrid = createPlacementGrid(2, 1);
    const tablePlacement = applyEditorCursorPlacement({
      selectedCatalogItem: endTable,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      cursorTile: { x: 0, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
    });
    if (!tablePlacement.applied) {
      throw new Error(
        `End table did not place; received ${JSON.stringify(tablePlacement)}.`,
      );
    }

    const fillResult = applyEditorFill({
      selectedCatalogItem: withFillTool(chair),
      catalogPresentationChoice: { flipped: false, rotation: 2, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: tablePlacement.placementHistory,
    });

    expect(chair.presentationCapabilities?.rotation?.count).toBe(4);
    expect(endTable.renderingMetadata).toMatchObject({
      isLongTable: false,
      isTable: true,
    });
    expect(fillResult).toMatchObject({ applied: true, placedTileCount: 2 });
    expect(fillResult.placementHistory.currentState.items).toHaveLength(2);
    expect(fillResult.placementHistory.currentState.items[0]).toMatchObject({
      instanceId: 1,
      itemId: "furniture_1391",
    });
    expect(fillResult.placementHistory.currentState.items[0]?.heldItem).toMatchObject({
      footprint: { width: 1, height: 1 },
      instanceId: 2,
      itemId: "furniture_0",
      rotation: 2,
    });
    expect(fillResult.placementHistory.currentState.items[1]).toMatchObject({
      footprint: { width: 1, height: 1 },
      instanceId: 3,
      itemId: "furniture_0",
      rotation: 2,
      x: 1,
      y: 0,
    });
    expect(fillResult.placementHistory.currentState.nextItemId).toBe(4);
    expect(fillResult.placementHistory.undoStates).toEqual([
      ...tablePlacement.placementHistory.undoStates,
      tablePlacement.placementHistory.currentState,
    ]);
    expect(fillResult.placementHistory.redoStates).toEqual([]);
  });

  it("rejects an all-occupied-table fill gesture and skips occupied tables when placing adjacent legal tiles", () => {
    const endTable = requireLockedPlaceableCatalogItem("furniture_1391");
    const chair = requireLockedPlaceableCatalogItem("furniture_0");
    const mapPlacementGrid = createPlacementGrid(2, 1);
    const tablePlacement = applyEditorCursorPlacement({
      selectedCatalogItem: endTable,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      cursorTile: { x: 0, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
    });
    if (!tablePlacement.applied) {
      throw new Error(
        `End table did not place; received ${JSON.stringify(tablePlacement)}.`,
      );
    }

    const occupiedPlacement = applyEditorCursorPlacement({
      selectedCatalogItem: chair,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      cursorTile: { x: 0, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: tablePlacement.placementHistory,
    });
    if (!occupiedPlacement.applied) {
      throw new Error(
        `Chair on table did not place; received ${JSON.stringify(occupiedPlacement)}.`,
      );
    }

    const occupiedHistory = occupiedPlacement.placementHistory;
    expect(occupiedHistory.currentState.items[0]?.heldItem).toBeDefined();

    const rejectedFillResult = applyEditorFill({
      selectedCatalogItem: withFillTool(chair),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 0, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: occupiedHistory,
    });
    expect(rejectedFillResult).toEqual({
      applied: false,
      reason: "invalid-held-item-target",
      targetReason: "occupied-table",
      placementHistory: occupiedHistory,
    });
    expect(rejectedFillResult.placementHistory).toBe(occupiedHistory);
    expect(rejectedFillResult.placementHistory.currentState).toBe(occupiedHistory.currentState);
    expect(rejectedFillResult.placementHistory.undoStates).toBe(occupiedHistory.undoStates);
    expect(rejectedFillResult.placementHistory.redoStates).toBe(occupiedHistory.redoStates);

    const partialFillResult = applyEditorFill({
      selectedCatalogItem: withFillTool(chair),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 1, y: 0 },
      mapPlacementGrid,
      buildingMetadataById: createBuildingMetadataById(),
      placementHistory: occupiedHistory,
    });

    expect(partialFillResult).toMatchObject({ applied: true, placedTileCount: 1 });
    expect(partialFillResult.placementHistory.currentState.items).toHaveLength(2);
    expect(partialFillResult.placementHistory.currentState.items[0]?.heldItem?.instanceId).toBe(
      occupiedHistory.currentState.items[0]?.heldItem?.instanceId,
    );
    expect(partialFillResult.placementHistory.currentState.items[1]).toMatchObject({
      itemId: "furniture_0",
      x: 1,
      y: 0,
    });
    expect(partialFillResult.placementHistory.undoStates).toEqual([
      ...occupiedHistory.undoStates,
      occupiedHistory.currentState,
    ]);
    expect(partialFillResult.placementHistory.redoStates).toEqual([]);
    expect(undoPlacementHistory(partialFillResult.placementHistory).currentState).toBe(
      occupiedHistory.currentState,
    );
  });

  it("does not place a building on a map that is not buildable", () => {
    const { catalogItem, buildingMetadataById } =
      createLockedBuildingFillContext("Beach Cabin");
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const fillResult = applyEditorFill({
      selectedCatalogItem: catalogItem,
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      firstTile: { x: 0, y: 0 },
      secondTile: { x: 4, y: 2 },
      mapPlacementGrid: createBlockedPlacementGrid(5, 3),
      buildingMetadataById,
      placementHistory,
    });

    expect(fillResult).toMatchObject({
      applied: false,
      placementHistory,
      validation: { reason: "not-buildable", valid: false },
    });
    expect(fillResult.placementHistory).toBe(placementHistory);
    expect(placementHistory.currentState.buildings).toEqual([]);
    expect(placementHistory.undoStates).toEqual([]);
  });
});

function createVisibleVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}
