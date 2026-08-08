import { describe, expect, it } from "vitest";
import type {
  BuildingPlacementMetadataById,
  CatalogItem,
  CatalogPresentationChoice,
} from "../../src/catalog";
import {
  applyEditorCursorPlacement,
  evaluateEditorCursorPlacementPreview,
} from "../../src/editor/editor-placement-controller";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import {
  createPlacementHistory,
  redoPlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
} from "../../src/placement/placement-snapshot";

function createCatalogItem(
  catalogItem: Partial<CatalogItem> & Pick<CatalogItem, "id" | "category">,
): CatalogItem {
  return {
    name: catalogItem.id,
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/test.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
    ...catalogItem,
  };
}

function createPlacementGrid(
  tileCapabilities: Readonly<{
    buildable: boolean;
    diggable: boolean;
    passable: boolean;
  }> = { buildable: true, diggable: true, passable: true },
  width = 1,
  height = 1,
): MapPlacementGrid {
  return {
    width,
    height,
    capabilitiesByTile: Array.from({ length: width * height }, () => ({
        ...tileCapabilities,
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

function createBuildingMetadataById(): BuildingPlacementMetadataById {
  return {
    Barn: {
      size: { width: 1, height: 1 },
      collisionMap: [[{ requiresBuildable: true }]],
      additionalPlacementTiles: [],
      humanDoor: { x: -1, y: -1 },
      tilePropertyGrid: [],
    },
  };
}

function createPlacementInput(
  selectedCatalogItem: CatalogItem | null,
  overrides: Partial<Parameters<typeof applyEditorCursorPlacement>[0]> = {},
) {
  return {
    selectedCatalogItem,
    catalogPresentationChoice:
      selectedCatalogItem === null
        ? null
        : { flipped: false, rotation: 0, variant: 0 },
    cursorTile: { x: 0, y: 0 },
    mapPlacementGrid: createPlacementGrid(),
    buildingMetadataById: createBuildingMetadataById(),
    placementHistory: createPlacementHistory(createEmptyPlacementSnapshot()),
    ...overrides,
  };
}

function createHoeDirtCatalogItem(): CatalogItem {
  return createCatalogItem({
    id: "hoedirt",
    category: "floor",
    allowedTools: ["cursor", "multi-select", "fill", "erase"],
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
    renderingMetadata: {
      kind: "hoe-dirt",
      seasonalTextureLocalPaths: {
        spring: "/game-assets/1.6.15/terrain/hoeDirt.png",
        summer: "/game-assets/1.6.15/terrain/hoeDirt.png",
        fall: "/game-assets/1.6.15/terrain/hoeDirt.png",
        winter: "/game-assets/1.6.15/terrain/hoeDirtSnow.png",
      },
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

function createRugCatalogItem(): CatalogItem {
  return createCatalogItem({
    id: "furniture_2637",
    category: "placeable",
    renderingMetadata: {
      kind: "furniture",
      furnitureType: "rug",
      indoors: true,
      outdoors: false,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: false,
      isRug: true,
      isTable: false,
      isLongTable: false,
      bedType: null,
      compositeSprite: null,
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
      rotation: { count: 1, footprints: [{ width, height: 3 }] },
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

function createExistingPlacementItem(
  placementItem: Partial<PlacementItem>,
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

function createFurnitureCatalogItem(
  options: Readonly<{
    bedType?: "single" | "double" | "child" | null;
    id?: string;
    isLongTable?: boolean;
    isRug?: boolean;
    isTable?: boolean;
    tileSize?: Readonly<{ width: number; height: number }>;
    wallMounted?: boolean;
  }> = {},
): CatalogItem {
  const tileSize = options.tileSize ?? { width: 1, height: 1 };
  return createCatalogItem({
    id: options.id ?? "furniture_0",
    category: "placeable",
    tileSize,
    renderingMetadata: {
      bedType: options.bedType ?? null,
      compositeSprite: null,
      furnitureType: options.bedType === undefined ? "chair" : "bed",
      indoors: true,
      isLongTable: options.isLongTable ?? false,
      isRug: options.isRug ?? false,
      isTable: options.isTable ?? false,
      kind: "furniture",
      outdoors: false,
      rotationSprites: undefined,
      rotationTileSizes: undefined,
      wallMounted: options.wallMounted ?? false,
    },
  });
}

function createEmptyTablePlacement(
  placementItem: Partial<PlacementItem> = {},
): PlacementItem {
  return createExistingPlacementItem({
    footprint: { width: 2, height: 2 },
    isTable: true,
    itemId: "furniture_724",
    x: 1,
    y: 1,
    ...placementItem,
  });
}

describe("applyEditorCursorPlacement", () => {
  it("evaluates a rotated catalog candidate without persisting a placement", () => {
    const furnitureItem = createCatalogItem({
      id: "furniture_724",
      category: "placeable",
      presentationCapabilities: {
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
      },
      tileSize: { width: 2, height: 1 },
    });
    const placementSnapshot = createEmptyPlacementSnapshot();

    const previewEvaluation = evaluateEditorCursorPlacementPreview({
      buildingMetadataById: createBuildingMetadataById(),
      catalogPresentationChoice: { flipped: false, rotation: 1, variant: 0 },
      cursorTile: { x: 2, y: 1 },
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(undefined, 6, 6),
      placementSnapshot,
      selectedCatalogItem: furnitureItem,
    });

    expect(previewEvaluation).toMatchObject({
      previewable: true,
      validation: { valid: true },
      candidate: {
        kind: "item",
        item: {
          footprint: { width: 1, height: 2 },
          itemId: "furniture_724",
          rotation: 1,
          x: 2,
          y: 1,
        },
      },
      previewAction: {
        type: "add-item",
        item: expect.objectContaining({
          footprint: { width: 1, height: 2 },
          itemId: "furniture_724",
          rotation: 1,
          x: 2,
          y: 1,
        }),
      },
      targetMode: "map",
    });
    expect(placementSnapshot).toEqual(createEmptyPlacementSnapshot());
  });

  it("returns a transient action without allocating persistent IDs or counters", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createExistingPlacementItem({ instanceId: 1, itemId: "object:390" })],
      nextItemId: 2,
    };

    const previewEvaluation = evaluateEditorCursorPlacementPreview({
      buildingMetadataById: createBuildingMetadataById(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      cursorTile: { x: 1, y: 0 },
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(undefined, 3, 1),
      placementSnapshot,
      selectedCatalogItem: createCatalogItem({
        id: "floor:13",
        category: "floor",
      }),
    });

    expect(previewEvaluation).toMatchObject({
      previewable: true,
      previewAction: {
        type: "add-item",
        item: expect.objectContaining({
          itemId: "floor:13",
          x: 1,
          y: 0,
        }),
      },
    });
    expect(previewEvaluation).not.toHaveProperty("previewPlacementSnapshot");
    expect(previewEvaluation).not.toHaveProperty("previewRenderPlacementSnapshot");
    expect(previewEvaluation).not.toHaveProperty("previewRenderEntryKeys");
    expect(JSON.stringify(previewEvaluation)).not.toContain("instanceId");
    expect(placementSnapshot.nextItemId).toBe(2);
    expect(placementSnapshot.items).toEqual([
      expect.objectContaining({ instanceId: 1, itemId: "object:390" }),
    ]);
  });

  it("previews a duplicate crop as invalid without throwing or mutating the source", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 1, y: 1 }],
      nextBuildingId: 9,
      nextItemId: 12,
    };

    const previewEvaluation = evaluateEditorCursorPlacementPreview({
      buildingMetadataById: createBuildingMetadataById(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      cursorTile: { x: 1, y: 1 },
      mapPlacementGrid: createPlacementGrid(undefined, 3, 3),
      placementSnapshot,
      selectedCatalogItem: createCatalogItem({
        id: "crop:24",
        category: "crop",
      }),
    });

    expect(previewEvaluation).toMatchObject({
      previewable: true,
      previewAction: {
        type: "add-crop",
        crop: { cropId: "crop:24", x: 1, y: 1 },
      },
      targetMode: "map",
      validation: {
        valid: false,
        reason: "occupied-by-crop",
        tile: { x: 1, y: 1 },
      },
    });
    expect(placementSnapshot).toEqual({
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 1, y: 1 }],
      nextBuildingId: 9,
      nextItemId: 12,
    });
  });

  it("shares empty-table held-item resolution between preview and click", () => {
    const selectedCatalogItem = createFurnitureCatalogItem();
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createEmptyTablePlacement()],
      nextItemId: 8,
    };
    const previewEvaluation = evaluateEditorCursorPlacementPreview({
      buildingMetadataById: createBuildingMetadataById(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
      cursorTile: { x: 2, y: 2 },
      mapPlacementGrid: createPlacementGrid(
        { buildable: false, diggable: false, passable: false },
        5,
        5,
      ),
      placementSnapshot,
      selectedCatalogItem,
    });
    const clickResult = applyEditorCursorPlacement(
      createPlacementInput(selectedCatalogItem, {
        cursorTile: { x: 2, y: 2 },
        mapPlacementGrid: createPlacementGrid(
          { buildable: false, diggable: false, passable: false },
          5,
          5,
        ),
        placementHistory: createPlacementHistory(placementSnapshot),
      }),
    );

    expect(previewEvaluation).toMatchObject({
      previewable: true,
      targetMode: "held-item",
      targetParentInstanceId: 1,
      previewAction: {
        type: "attach-held-item",
        parentInstanceId: 1,
        item: expect.objectContaining({ itemId: "furniture_0" }),
      },
      validation: { valid: true },
    });
    expect(clickResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [expect.objectContaining({
            heldItem: expect.objectContaining({ itemId: "furniture_0" }),
          })],
        },
      },
    });
  });

  it.each([
    ["long-table", createEmptyTablePlacement({ isLongTable: true, isTable: false })],
    ["occupied-table", createEmptyTablePlacement({ heldItemId: "legacy-item" })],
  ] as const)("shares invalid %s target resolution between preview and click", (
    targetReason,
    targetPlacementItem,
  ) => {
    const selectedCatalogItem = createFurnitureCatalogItem();
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [targetPlacementItem],
      nextItemId: 2,
    };
    const sharedInput = {
      buildingMetadataById: createBuildingMetadataById(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 } as const,
      cursorTile: { x: 1, y: 1 },
      freePlacement: true,
      mapPlacementGrid: createPlacementGrid(undefined, 5, 5),
      selectedCatalogItem,
    };

    const previewEvaluation = evaluateEditorCursorPlacementPreview({
      ...sharedInput,
      placementSnapshot,
    });
    const clickResult = applyEditorCursorPlacement({
      ...sharedInput,
      placementHistory: createPlacementHistory(placementSnapshot),
    });

    expect(previewEvaluation).toMatchObject({
      previewable: true,
      targetMode: "invalid-held-item-target",
      targetParentInstanceId: 1,
      targetReason,
      validation: { valid: false },
    });
    expect(clickResult).toMatchObject({
      applied: false,
      reason: "invalid-held-item-target",
      targetReason,
    });
  });

  it("keeps one explicit composite variant across valid and invalid tiles and click", () => {
    const selectedCatalogItem = createFreeCactusCatalogItem();
    const placementSnapshot = createEmptyPlacementSnapshot();
    const validCapabilities = {
      buildable: true,
      crabPot: false,
      diggable: true,
      passable: true,
      treePlantable: false,
      treePlantableOnDirt: false,
      wall: false,
    };
    const invalidCapabilities = {
      ...validCapabilities,
      buildable: false,
      diggable: false,
      passable: false,
    };
    const sharedInput = {
      buildingMetadataById: createBuildingMetadataById(),
      catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 } as const,
      freePlacement: false,
      mapPlacementGrid: {
        capabilitiesByTile: [validCapabilities, invalidCapabilities],
        height: 1,
        width: 2,
      },
      resolvedCompositeVariant: 4383,
      selectedCatalogItem,
    };

    const validPreview = evaluateEditorCursorPlacementPreview({
      ...sharedInput,
      cursorTile: { x: 0, y: 0 },
      placementSnapshot,
    });
    const invalidPreview = evaluateEditorCursorPlacementPreview({
      ...sharedInput,
      cursorTile: { x: 1, y: 0 },
      placementSnapshot,
    });
    const clickResult = applyEditorCursorPlacement({
      ...sharedInput,
      cursorTile: { x: 0, y: 0 },
      placementHistory: createPlacementHistory(placementSnapshot),
    });

    expect(validPreview).toMatchObject({
      previewable: true,
      candidate: { kind: "item", item: { variant: 4383 } },
      validation: { valid: true },
    });
    expect(invalidPreview).toMatchObject({
      previewable: true,
      candidate: { kind: "item", item: { variant: 4383 } },
      validation: { valid: false },
    });
    expect(clickResult).toMatchObject({ applied: true });
    if (!validPreview.previewable || !clickResult.applied) {
      throw new Error("Expected preview and click to resolve the FreeCactus placement.");
    }
    expect(clickResult.placementHistory.currentState.items[0]?.variant)
      .toBe(validPreview.candidate.kind === "item"
        ? validPreview.candidate.item.variant
        : undefined);
  });

  it.each([
    ["single", 2],
    ["double", 3],
    ["child", 2],
  ] as const)(
    "places one %s bed with exact bedType and footprint in one history entry",
    (bedType, footprintWidth) => {
      const placementHistory = createPlacementHistory(
        createEmptyPlacementSnapshot(),
      );
      const placementResult = applyEditorCursorPlacement(
        createPlacementInput(createBedCatalogItem(bedType), {
          cursorTile: { x: 2, y: 1 },
          mapPlacementGrid: createPlacementGrid(
            { buildable: true, diggable: true, passable: true },
            10,
            6,
          ),
          placementHistory,
        }),
      );

      expect(placementResult).toMatchObject({
        applied: true,
        validation: { valid: true },
      });
      expect(placementResult.placementHistory.currentState.items).toEqual([
        expect.objectContaining({
          bedType,
          footprint: { width: footprintWidth, height: 3 },
          instanceId: 1,
          itemId: `furniture_test_${bedType}_bed`,
          rotation: 0,
          x: 2,
          y: 1,
        }),
      ]);
      expect(placementResult.placementHistory.undoStates).toEqual([
        placementHistory.currentState,
      ]);
      expect(placementResult.placementHistory.redoStates).toEqual([]);
    },
  );

  it("commits one history snapshot after placing supported building and crop catalog items", () => {
    const buildingHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const buildingResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "building:Barn", category: "building" }), {
        placementHistory: buildingHistory,
      }),
    );

    expect(buildingResult).toMatchObject({ applied: true, validation: { valid: true } });
    expect(buildingResult.placementHistory.undoStates).toEqual([
      buildingHistory.currentState,
    ]);
    expect(buildingResult.placementHistory.currentState.buildings).toEqual([
      { instanceId: 1, buildingId: "Barn", x: 0, y: 0 },
    ]);

    const cropHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const cropResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "crop:24", category: "crop" }), {
        placementHistory: cropHistory,
      }),
    );

    expect(cropResult).toMatchObject({ applied: true, validation: { valid: true } });
    expect(cropResult.placementHistory.undoStates).toEqual([cropHistory.currentState]);
    expect(cropResult.placementHistory.currentState.crops).toEqual([
      { cropId: "crop:24", x: 0, y: 0 },
    ]);
  });

  it("persists a giant crop as a 3 by 3 item while ordinary crops remain crop records", () => {
    const giantCrop = createCatalogItem({
      id: "crop:giant_Cauliflower",
      category: "crop",
      tileSize: { width: 3, height: 3 },
    });
    const giantHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const giantResult = applyEditorCursorPlacement(
      createPlacementInput(giantCrop, {
        cursorTile: { x: 1, y: 2 },
        mapPlacementGrid: createPlacementGrid(undefined, 6, 6),
        placementHistory: giantHistory,
      }),
    );

    expect(giantResult).toMatchObject({ applied: true, validation: { valid: true } });
    expect(giantResult.placementHistory.currentState).toMatchObject({
      crops: [],
      items: [expect.objectContaining({
        footprint: { width: 3, height: 3 },
        instanceId: 1,
        itemId: giantCrop.id,
        x: 1,
        y: 2,
      })],
      nextItemId: 2,
    });
    const undoneHistory = undoPlacementHistory(giantResult.placementHistory);
    expect(undoneHistory.currentState).toEqual(giantHistory.currentState);
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      giantResult.placementHistory.currentState,
    );

    const ordinaryCropResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "crop:24", category: "crop" })),
    );
    expect(ordinaryCropResult.placementHistory.currentState).toMatchObject({
      crops: [{ cropId: "crop:24", x: 0, y: 0 }],
      items: [],
    });
  });

  it("rejects giant crops when any footprint tile is non-diggable, outside the map, or occupied", () => {
    const giantCrop = createCatalogItem({
      id: "crop:giant_Cauliflower",
      category: "crop",
      tileSize: { width: 3, height: 3 },
    });
    const allDiggableGrid = createPlacementGrid(undefined, 5, 5);
    const nonDiggableMiddleGrid: MapPlacementGrid = {
      ...allDiggableGrid,
      capabilitiesByTile: allDiggableGrid.capabilitiesByTile.map(
        (tileCapabilities, tileIndex) =>
          tileIndex === 6
            ? { ...tileCapabilities, diggable: false }
            : tileCapabilities,
      ),
    };
    const blockedHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const occupiedHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createExistingPlacementItem({ instanceId: 1, x: 1, y: 1 })],
      nextItemId: 2,
    });

    expect(applyEditorCursorPlacement(createPlacementInput(giantCrop, {
      cursorTile: { x: 0, y: 0 },
      mapPlacementGrid: nonDiggableMiddleGrid,
      placementHistory: blockedHistory,
    }))).toEqual({
      applied: false,
      placementHistory: blockedHistory,
      validation: { valid: false, reason: "not-diggable", tile: { x: 1, y: 1 } },
    });
    expect(applyEditorCursorPlacement(createPlacementInput(giantCrop, {
      cursorTile: { x: 3, y: 3 },
      mapPlacementGrid: createPlacementGrid(undefined, 5, 5),
      placementHistory: blockedHistory,
    }))).toEqual({
      applied: false,
      placementHistory: blockedHistory,
      validation: { valid: false, reason: "outside-map", tile: { x: 5, y: 3 } },
    });
    expect(applyEditorCursorPlacement(createPlacementInput(giantCrop, {
      cursorTile: { x: 0, y: 0 },
      mapPlacementGrid: createPlacementGrid(undefined, 5, 5),
      placementHistory: occupiedHistory,
    }))).toEqual({
      applied: false,
      placementHistory: occupiedHistory,
      validation: { valid: false, reason: "occupied-by-item", tile: { x: 1, y: 1 } },
    });
  });

  it("omits the default Fish Pond variant and persists an explicitly selected net", () => {
    const fishPondCatalogItem = createCatalogItem({
      id: "building:Fish Pond",
      category: "building",
      presentationCapabilities: {
        canFlip: false,
        rotation: null,
        variantCycle: { count: 4, family: "generic" },
        visibleVariants: [0, 1, 2, 3].map((variant) => ({
          label: ["Net 1", "Net 2", "Net 3", "None"][variant]!,
          renderDescriptor: { kind: "variant-index" as const, variant },
          value: variant,
        })),
      },
    });
    const buildingMetadataById = {
      "Fish Pond": {
        size: { width: 1, height: 1 },
        collisionMap: [[{ requiresBuildable: true }]],
        additionalPlacementTiles: [],
        humanDoor: { x: -1, y: -1 },
        tilePropertyGrid: [],
      },
    };
    const defaultVariantResult = applyEditorCursorPlacement(
      createPlacementInput(fishPondCatalogItem, { buildingMetadataById }),
    );
    const selectedVariantResult = applyEditorCursorPlacement(
      createPlacementInput(fishPondCatalogItem, {
        buildingMetadataById,
        catalogPresentationChoice: { flipped: false, rotation: 0, variant: 2 },
      }),
    );

    expect(defaultVariantResult).toMatchObject({ applied: true });
    expect(defaultVariantResult.placementHistory.currentState.buildings[0])
      .toEqual({ instanceId: 1, buildingId: "Fish Pond", x: 0, y: 0 });
    expect(selectedVariantResult.placementHistory.currentState.buildings[0])
      .toEqual({
        instanceId: 1,
        buildingId: "Fish Pond",
        variant: 2,
        x: 0,
        y: 0,
      });
  });

  it("creates path and fence items with their validation layers and stable defaults", () => {
    const floorResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "floor:13", category: "floor" })),
    );
    const fenceResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "fence:322", category: "fence" })),
    );

    expect(floorResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [
            {
              instanceId: 1,
              itemId: "floor:13",
              x: 0,
              y: 0,
              layer: "path",
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
        },
      },
    });
    expect(fenceResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: { items: [expect.objectContaining({ itemId: "fence:322", layer: "fence" })] },
      },
    });
    const gateResult = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({
        id: "object:325",
        category: "fence",
        allowedTools: ["cursor", "multi-select", "erase"],
        renderingMetadata: {
          kind: "gate",
          textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png",
        },
      })),
    );
    expect(gateResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: { items: [expect.objectContaining({ itemId: "object:325", layer: "fence" })] },
      },
    });
  });

  it("requires a diggable tile for HoeDirt while ordinary floor placement remains passable-only", () => {
    const nonDiggableGrid = createPlacementGrid({
      buildable: true,
      diggable: false,
      passable: true,
    });
    const hoeDirtHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const hoeDirtResult = applyEditorCursorPlacement(
      createPlacementInput(createHoeDirtCatalogItem(), {
        catalogPresentationChoice: { flipped: false, rotation: 0, variant: 1 },
        mapPlacementGrid: nonDiggableGrid,
        placementHistory: hoeDirtHistory,
      }),
    );
    const ordinaryFloorResult = applyEditorCursorPlacement(
      createPlacementInput(
        createCatalogItem({ id: "floor:13", category: "floor" }),
        { mapPlacementGrid: nonDiggableGrid },
      ),
    );

    expect(hoeDirtResult).toEqual({
      applied: false,
      placementHistory: hoeDirtHistory,
      validation: {
        valid: false,
        reason: "not-diggable",
        tile: { x: 0, y: 0 },
      },
    });
    expect(ordinaryFloorResult).toMatchObject({ applied: true });
  });

  it("places HoeDirt on a diggable non-passable tile while ordinary floor remains rejected", () => {
    const diggableNonPassableGrid = createPlacementGrid({
      buildable: false,
      diggable: true,
      passable: false,
    });
    const hoeDirtResult = applyEditorCursorPlacement(
      createPlacementInput(createHoeDirtCatalogItem(), {
        mapPlacementGrid: diggableNonPassableGrid,
      }),
    );
    const ordinaryFloorResult = applyEditorCursorPlacement(
      createPlacementInput(
        createCatalogItem({ id: "floor:13", category: "floor" }),
        { mapPlacementGrid: diggableNonPassableGrid },
      ),
    );

    expect(hoeDirtResult).toMatchObject({ applied: true });
    expect(ordinaryFloorResult).toMatchObject({
      applied: false,
      validation: {
        valid: false,
        reason: "not-passable",
        tile: { x: 0, y: 0 },
      },
    });
  });

  it("places Watered HoeDirt as a path item through the existing cursor history interface", () => {
    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(createHoeDirtCatalogItem(), {
        catalogPresentationChoice: { flipped: false, rotation: 0, variant: 1 },
      }),
    );

    expect(placementResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [expect.objectContaining({
            itemId: "hoedirt",
            layer: "path",
            variant: 1,
          })],
        },
      },
    });
  });

  it("rejects an exact HoeDirt ID without its required rendering metadata", () => {
    expect(() => applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({
        id: "hoedirt",
        category: "floor",
      })),
    )).toThrow(/hoedirt.*renderingMetadata.*undefined/s);
  });

  it("returns the validator rejection and retains the exact history when placement is invalid", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const result = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "crop:24", category: "crop" }), {
        placementHistory,
        mapPlacementGrid: createPlacementGrid({
          buildable: true,
          diggable: false,
          passable: true,
        }),
      }),
    );

    expect(result).toEqual({
      applied: false,
      placementHistory,
      validation: { valid: false, reason: "not-diggable", tile: { x: 0, y: 0 } },
    });
  });

  it("allows a crop only on a Garden Pot occupied tile and preserves the pot in history", () => {
    const cropCatalogItem = createCatalogItem({ id: "crop:24", category: "crop" });
    const gardenPot = createExistingPlacementItem({
      instanceId: 1,
      itemId: "big-craftable:62",
      x: 0,
      y: 0,
    });
    const gardenPotHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [gardenPot],
      nextItemId: 2,
    });
    const nonDiggableGrid = createPlacementGrid({
      buildable: true,
      diggable: false,
      passable: true,
    });
    const gardenPotResult = applyEditorCursorPlacement(
      createPlacementInput(cropCatalogItem, {
        mapPlacementGrid: nonDiggableGrid,
        placementHistory: gardenPotHistory,
      }),
    );

    expect(gardenPotResult).toMatchObject({
      applied: true,
      validation: { valid: true },
      placementHistory: {
        currentState: {
          crops: [{ cropId: cropCatalogItem.id, x: 0, y: 0 }],
          items: [gardenPot],
        },
      },
    });

    const ordinaryItemHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createExistingPlacementItem({ instanceId: 1 })],
      nextItemId: 2,
    });
    expect(applyEditorCursorPlacement(createPlacementInput(cropCatalogItem, {
      mapPlacementGrid: createPlacementGrid(),
      placementHistory: ordinaryItemHistory,
    }))).toEqual({
      applied: false,
      placementHistory: ordinaryItemHistory,
      validation: { valid: false, reason: "occupied-by-item", tile: { x: 0, y: 0 } },
    });
  });

  it("commits a placement when freePlacement bypasses the validator's normal rules", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const result = applyEditorCursorPlacement(
      createPlacementInput(createCatalogItem({ id: "crop:24", category: "crop" }), {
        placementHistory,
        freePlacement: true,
        mapPlacementGrid: createPlacementGrid({
          buildable: false,
          diggable: false,
          passable: false,
        }),
      }),
    );

    expect(result).toMatchObject({
      applied: true,
      validation: { valid: true },
      placementHistory: {
        undoStates: [placementHistory.currentState],
        currentState: { crops: [{ cropId: "crop:24", x: 0, y: 0 }] },
      },
    });
  });

  it("places a 1x2 window only on wall tiles and bypasses the rule with free placement", () => {
    const windowCatalogItem = createCatalogItem({
      id: "furniture_1614",
      category: "placeable",
      tileSize: { width: 1, height: 2 },
      renderingMetadata: {
        kind: "furniture",
        furnitureType: "window",
        indoors: true,
        outdoors: false,
        rotationSprites: undefined,
        rotationTileSizes: undefined,
        wallMounted: true,
        isWindow: true,
        isRug: false,
        isTable: false,
        isLongTable: false,
        bedType: null,
        compositeSprite: null,
      },
    });

    const wallPlacementResult = applyEditorCursorPlacement(
      createPlacementInput(windowCatalogItem, {
        mapPlacementGrid: createWallPlacementGrid(2, 2, ["0,0", "0,1"]),
      }),
    );
    expect(wallPlacementResult).toMatchObject({ applied: true });
    expect(wallPlacementResult.placementHistory.currentState.items[0]).toMatchObject({
      footprint: { width: 1, height: 2 },
      itemId: "furniture_1614",
    });

    const nonWallPlacementResult = applyEditorCursorPlacement(
      createPlacementInput(windowCatalogItem, {
        mapPlacementGrid: createWallPlacementGrid(2, 2, ["0,0"]),
      }),
    );
    expect(nonWallPlacementResult).toMatchObject({
      applied: false,
      validation: { valid: false, reason: "not-wall", tile: { x: 0, y: 1 } },
    });

    const freePlacementResult = applyEditorCursorPlacement(
      createPlacementInput(windowCatalogItem, {
        freePlacement: true,
        mapPlacementGrid: createPlacementGrid({
          buildable: false,
          diggable: false,
          passable: false,
        }, 1, 1),
      }),
    );
    expect(freePlacementResult).toMatchObject({ applied: true });
  });

  it("returns a clear unapplied result for no selection and commits ordinary catalog items", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    expect(
      applyEditorCursorPlacement(
        createPlacementInput(null, { placementHistory }),
      ),
    ).toEqual({
      applied: false,
      reason: "no-selected-catalog-item",
      placementHistory,
    });
    expect(
      applyEditorCursorPlacement(
        createPlacementInput(
          createCatalogItem({ id: "object:390", category: "placeable" }),
          { placementHistory },
        ),
      ),
    ).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [expect.objectContaining({ itemId: "object:390", layer: "item" })],
        },
      },
    });
  });

  it("places version-locked furniture and tree catalog IDs with their catalog metadata", () => {
    const furnitureResult = applyEditorCursorPlacement(
      createPlacementInput(
        createCatalogItem({
          id: "furniture_724",
          category: "placeable",
          renderingMetadata: {
            kind: "furniture",
            furnitureType: "table",
            indoors: true,
            outdoors: true,
            rotationSprites: undefined,
            rotationTileSizes: undefined,
            wallMounted: false,
            isRug: false,
            isTable: true,
            isLongTable: false,
            bedType: null,
            compositeSprite: null,
          },
        }),
        { freePlacement: true },
      ),
    );

    expect(furnitureResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [
            expect.objectContaining({
              itemId: "furniture_724",
              isLongTable: false,
              isRug: false,
              isTable: true,
              bedType: null,
            }),
          ],
        },
      },
    });

    for (const catalogItemId of ["fruittree_628", "wildtree_1"]) {
      const treeResult = applyEditorCursorPlacement(
        createPlacementInput(
          createCatalogItem({ id: catalogItemId, category: "placeable" }),
          { freePlacement: true },
        ),
      );

      expect(treeResult).toMatchObject({
        applied: true,
        placementHistory: {
          currentState: {
            items: [expect.objectContaining({ itemId: catalogItemId })],
          },
        },
      });
    }
  });

  it("places a dataset-classified rug and an ordinary item in either overlap order", () => {
    const rugCatalogItem = createRugCatalogItem();
    const ordinaryCatalogItem = createCatalogItem({
      id: "object:390",
      category: "placeable",
    });
    const ordinaryThenRugHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createExistingPlacementItem({ instanceId: 1 })],
      nextItemId: 2,
    });
    const rugThenOrdinaryHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createExistingPlacementItem({
          instanceId: 1,
          itemId: rugCatalogItem.id,
          isRug: true,
        }),
      ],
      nextItemId: 2,
    });

    const rugPlacement = applyEditorCursorPlacement(
      createPlacementInput(rugCatalogItem, {
        placementHistory: ordinaryThenRugHistory,
      }),
    );
    const ordinaryPlacement = applyEditorCursorPlacement(
      createPlacementInput(ordinaryCatalogItem, {
        placementHistory: rugThenOrdinaryHistory,
      }),
    );

    expect(rugPlacement).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [
            expect.objectContaining({ instanceId: 1, isRug: false }),
            expect.objectContaining({
              instanceId: 2,
              itemId: "furniture_2637",
              isRug: true,
            }),
          ],
        },
      },
    });
    expect(ordinaryPlacement).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [
            expect.objectContaining({ instanceId: 1, isRug: true }),
            expect.objectContaining({
              instanceId: 2,
              itemId: "object:390",
              isRug: false,
            }),
          ],
        },
      },
    });
  });

  it("samples each FreeCactus layer once only after a cursor placement validates", () => {
    const sampledFractions = [15 / 16, 9 / 24, 11 / 24];
    let sampleIndex = 0;
    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(createFreeCactusCatalogItem(), {
        randomFractionSource: () => sampledFractions[sampleIndex++]!,
      }),
    );

    expect(sampleIndex).toBe(3);
    expect(placementResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [expect.objectContaining({
            itemId: "furniture_FreeCactus",
            variant: 4383,
          })],
        },
      },
    });

    let rejectedPlacementSampleCount = 0;
    const rejectedPlacementResult = applyEditorCursorPlacement(
      createPlacementInput(createFreeCactusCatalogItem(), {
        mapPlacementGrid: createPlacementGrid({
          buildable: false,
          diggable: false,
          passable: false,
        }),
        randomFractionSource: () => {
          rejectedPlacementSampleCount += 1;
          return 0;
        },
      }),
    );

    expect(rejectedPlacementResult).toMatchObject({ applied: false });
    expect(rejectedPlacementSampleCount).toBe(0);
  });

  it("rejects the exact invalid FreeCactus random fraction at the placement boundary", () => {
    const sampledFractions = [0, 1];
    let sampleIndex = 0;

    expect(() => applyEditorCursorPlacement(
      createPlacementInput(createFreeCactusCatalogItem(), {
        randomFractionSource: () => sampledFractions[sampleIndex++]!,
      }),
    )).toThrow(
      'Furniture composite random fraction for layer 1 must be at least 0 and less than 1; received 1.',
    );
    expect(sampleIndex).toBe(2);
  });

  it("writes validated furniture rotation footprints and tree variant/flip choices exactly", () => {
    const furnitureItem = createCatalogItem({
      id: "furniture_724",
      category: "placeable",
      presentationCapabilities: {
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
      },
      tileSize: { width: 2, height: 1 },
    });
    const rotatedFurnitureResult = applyEditorCursorPlacement(
      createPlacementInput(furnitureItem, {
        catalogPresentationChoice: {
          flipped: false,
          rotation: 1,
          variant: 0,
        },
        freePlacement: true,
      }),
    );
    expect(rotatedFurnitureResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [expect.objectContaining({
            flipped: false,
            footprint: { width: 1, height: 2 },
            rotation: 1,
            variant: 0,
          })],
        },
      },
    });

    const fruitTreeItem = createCatalogItem({
      id: "fruittree_628",
      category: "placeable",
      presentationCapabilities: {
        canFlip: true,
        rotation: null,
        variantCycle: { count: 2, family: "tree" },
        visibleVariants: [
          createVisibleVariant(0, "No Fruit"),
          createVisibleVariant(1, "Fruit"),
        ],
      },
    });
    const fruitTreeResult = applyEditorCursorPlacement(
      createPlacementInput(fruitTreeItem, {
        catalogPresentationChoice: {
          flipped: true,
          rotation: 0,
          variant: 1,
        },
        freePlacement: true,
      }),
    );
    expect(fruitTreeResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [expect.objectContaining({
            flipped: true,
            footprint: { width: 1, height: 1 },
            rotation: 0,
            variant: 1,
          })],
        },
      },
    });
  });

  it("fails fast on an invalid catalog choice before placement", () => {
    const furnitureItem = createCatalogItem({
      id: "furniture_724",
      category: "placeable",
      presentationCapabilities: {
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
      },
    });

    expect(() => applyEditorCursorPlacement(
      createPlacementInput(furnitureItem, {
        catalogPresentationChoice: {
          flipped: false,
          rotation: 2,
          variant: 0,
        } as CatalogPresentationChoice,
      }),
    )).toThrow(/furniture_724.*2/s);
  });

  it("preserves the two-by-two footprint when placing a resource clump decor item", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());

    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(
        createCatalogItem({
          id: "clump_602",
          category: "decor",
          tileSize: { width: 2, height: 2 },
        }),
        { placementHistory, freePlacement: true },
      ),
    );

    expect(placementResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [
            expect.objectContaining({
              footprint: { width: 2, height: 2 },
              itemId: "clump_602",
            }),
          ],
        },
      },
    });
  });

  it("rejects building catalog IDs that cannot be converted to metadata IDs", () => {
    expect(() =>
      applyEditorCursorPlacement(
        createPlacementInput(createCatalogItem({ id: "Barn", category: "building" })),
      ),
    ).toThrow(
      'Editor placement building catalog ID must match "building:<metadata ID>"; received "Barn".',
    );
  });

  it("rejects unknown building metadata IDs even when free placement is enabled", () => {
    expect(() =>
      applyEditorCursorPlacement(
        createPlacementInput(
          createCatalogItem({ id: "building:Ghost", category: "building" }),
          { freePlacement: true },
        ),
      ),
    ).toThrow('unknown building metadata ID "Ghost"');
  });

  it.each([
    ["rug", createFurnitureCatalogItem({ id: "furniture_2637", isRug: true })],
    ["table", createFurnitureCatalogItem({ id: "furniture_724", isTable: true })],
  ])(
    "attaches a one-by-one %s at the clicked tile with one history commit and one allocated ID",
    (_caseName, selectedCatalogItem) => {
      const placementHistory = createPlacementHistory({
        ...createEmptyPlacementSnapshot(),
        items: [createEmptyTablePlacement()],
        nextItemId: 8,
      });
      const placementResult = applyEditorCursorPlacement(
        createPlacementInput(selectedCatalogItem, {
          cursorTile: { x: 2, y: 2 },
          mapPlacementGrid: createPlacementGrid(
            { buildable: false, diggable: false, passable: false },
          ),
          placementHistory,
        }),
      );

      expect(placementResult).toMatchObject({
        applied: true,
        validation: { valid: true },
      });
      expect(placementResult.placementHistory.currentState.items).toEqual([
        expect.objectContaining({
          instanceId: 1,
          heldItem: expect.objectContaining({
            instanceId: 8,
            itemId: selectedCatalogItem.id,
            x: 2,
            y: 2,
          }),
        }),
      ]);
      expect(placementResult.placementHistory.currentState.nextItemId).toBe(9);
      expect(placementResult.placementHistory.undoStates).toEqual([
        placementHistory.currentState,
      ]);
      expect(placementResult.placementHistory.redoStates).toEqual([]);
    },
  );

  it.each([
    ["bed", createFurnitureCatalogItem({ bedType: "single", tileSize: { width: 2, height: 3 } })],
    ["wall furniture", createFurnitureCatalogItem({ wallMounted: true })],
    ["multi-tile furniture", createFurnitureCatalogItem({ tileSize: { width: 2, height: 1 } })],
    ["non-furniture item", createCatalogItem({ id: "object:390", category: "placeable" })],
    ["fence", createCatalogItem({ id: "fence:322", category: "fence" })],
  ])("does not attach rejected %s candidates and preserves history on target collision", (_caseName, selectedCatalogItem) => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createEmptyTablePlacement()],
      nextItemId: 2,
    });
    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(selectedCatalogItem, {
        cursorTile: { x: 1, y: 1 },
        mapPlacementGrid: createPlacementGrid(undefined, 5, 5),
        placementHistory,
      }),
    );

    expect(placementResult).toMatchObject({ applied: false });
    expect(placementResult.placementHistory).toBe(placementHistory);
    expect(placementHistory.currentState.items[0]?.heldItem).toBeUndefined();
    expect(placementHistory.currentState.nextItemId).toBe(2);
  });

  it("attaches to the topmost table-like target beneath an overlapping non-table item", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [
        createEmptyTablePlacement(),
        createExistingPlacementItem({
          instanceId: 2,
          itemId: "object:390",
          x: 2,
          y: 2,
        }),
      ],
      nextItemId: 3,
    });
    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(createFurnitureCatalogItem(), {
        cursorTile: { x: 2, y: 2 },
        mapPlacementGrid: createPlacementGrid(undefined, 5, 5),
        placementHistory,
      }),
    );

    expect(placementResult).toMatchObject({ applied: true });
    expect(placementResult.placementHistory.currentState.items[0]?.heldItem)
      .toMatchObject({ instanceId: 3, itemId: "furniture_0" });
    expect(placementResult.placementHistory.currentState.items[1]?.heldItem)
      .toBeUndefined();
  });

  it("uses normal free placement when no table-like target is under the cursor", () => {
    const placementHistory = createPlacementHistory(createEmptyPlacementSnapshot());
    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(createFurnitureCatalogItem(), {
        cursorTile: { x: 9, y: 9 },
        freePlacement: true,
        placementHistory,
      }),
    );

    expect(placementResult).toMatchObject({
      applied: true,
      placementHistory: {
        currentState: {
          items: [expect.objectContaining({ instanceId: 1, x: 9, y: 9 })],
        },
      },
    });
  });

  it("routes a path through normal placement instead of attaching it to a table", () => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createEmptyTablePlacement()],
      nextItemId: 2,
    });
    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(
        createCatalogItem({ id: "floor:13", category: "floor" }),
        {
          cursorTile: { x: 1, y: 1 },
          mapPlacementGrid: createPlacementGrid(undefined, 5, 5),
          placementHistory,
        },
      ),
    );

    expect(placementResult).toMatchObject({ applied: true });
    expect(placementResult.placementHistory.currentState.items[0]?.heldItem).toBeUndefined();
    expect(placementResult.placementHistory.currentState.items[1]).toMatchObject({
      instanceId: 2,
      layer: "path",
    });
  });

  it.each([
    [
      "long",
      createEmptyTablePlacement({ instanceId: 2, isLongTable: true, isTable: false, y: 2 }),
      3,
      "long-table",
    ],
    [
      "occupied",
      createEmptyTablePlacement({
        instanceId: 2,
        y: 2,
        heldItem: {
          bedType: null,
          flipped: false,
          footprint: { width: 1, height: 1 },
          instanceId: 3,
          isGrass: false,
          isLongTable: false,
          isRug: false,
          isTable: false,
          itemId: "furniture_1",
          layer: "item",
          locked: false,
          rotation: 0,
          tintColor: "#ffffff",
          variant: 0,
          x: 2,
          y: 2,
        },
      }),
      4,
      "occupied-table",
    ],
    [
      "legacy-occupied",
      createEmptyTablePlacement({
        instanceId: 2,
        y: 2,
        heldItemId: "legacy_furniture_1",
      }),
      3,
      "occupied-table",
    ],
  ] as const)("does not search a lower empty table when the topmost table is %s", (
    _caseName,
    topmostTable,
    nextItemId,
    targetReason,
  ) => {
    const placementHistory = createPlacementHistory({
      ...createEmptyPlacementSnapshot(),
      items: [createEmptyTablePlacement(), topmostTable],
      nextItemId,
    });
    const placementResult = applyEditorCursorPlacement(
      createPlacementInput(createFurnitureCatalogItem(), {
        cursorTile: { x: 2, y: 2 },
        freePlacement: true,
        mapPlacementGrid: createPlacementGrid(undefined, 5, 5),
        placementHistory,
      }),
    );

    expect(placementResult).toMatchObject({
      applied: false,
      reason: "invalid-held-item-target",
      targetReason,
    });
    expect(placementResult.placementHistory).toBe(placementHistory);
    expect(placementHistory.currentState.items[0]?.heldItem).toBeUndefined();
    expect(placementHistory.currentState.nextItemId).toBe(nextItemId);
  });
});

function createVisibleVariant(value: number, label: string) {
  return {
    label,
    renderDescriptor: { kind: "variant-index" as const, variant: value },
    value,
  };
}
