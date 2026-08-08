import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  getCropRenderingMetadata,
  type CatalogFurnitureRotationSprite,
  type CatalogItem,
} from "../../src/catalog";
import {
  createPlacementRenderEntries,
} from "../../src/rendering/placement-rendering";
import {
  createEmptyPlacementSnapshot,
  type PlacementHeldItem,
  type PlacementItem,
} from "../../src/placement/placement-snapshot";

function createCatalogItem(
  catalogItem: Partial<CatalogItem> & Pick<CatalogItem, "id" | "category">,
): CatalogItem {
  return {
    name: catalogItem.id,
    tileSize: { width: 1, height: 1 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/test.png",
    sprite: { kind: "sprite-index", index: 0 },
    allowedTools: ["cursor"],
    ...catalogItem,
  };
}

function createCropCatalogItem(
  catalogItem: Partial<CatalogItem> = {},
): CatalogItem {
  return createCatalogItem({
    id: "crop:24",
    category: "crop",
    textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
    sprite: { kind: "sprite-index", index: 18 },
    renderingMetadata: {
      kind: "crop",
      fullyGrownRect: { kind: "source-rect", x: 64, y: 288, width: 16, height: 32 },
      tintColors: [],
      hasForageShadow: false,
    } as never,
    ...catalogItem,
  });
}

function createBuildingCatalogItem(
  catalogItem: Partial<CatalogItem> & Pick<CatalogItem, "id">,
  sortTileOffset = 0,
  paintMaskLocalPath?: string,
): CatalogItem {
  const buildingId = catalogItem.id.slice("building:".length);
  const sprite = catalogItem.sprite ?? {
    kind: "source-rect" as const,
    x: 0,
    y: 0,
    width: 16,
    height: 16,
  };
  if (sprite.kind !== "source-rect") {
    throw new Error(`Test building ${JSON.stringify(catalogItem.id)} requires a source-rect sprite.`);
  }
  return createCatalogItem({
    category: "building",
    ...catalogItem,
    renderingMetadata: {
      buildingId,
      kind: "building-multilayer",
      layers: [{
        frame: sprite,
        id: "Base",
        offsetX: 0,
        offsetY: 0,
      }],
      ...(paintMaskLocalPath === undefined ? {} : { paintMaskLocalPath }),
      sortTileOffset,
    },
  });
}

function excludeHoeDirtRenderEntries(
  renderEntries: readonly ReturnType<typeof createPlacementRenderEntries>[number][],
) {
  return renderEntries.filter(
    (renderEntry) =>
      renderEntry.textureLocalPath !== "/game-assets/1.6.15/terrain/hoeDirt.png"
      && renderEntry.textureLocalPath !== "/game-assets/1.6.15/terrain/hoeDirtSnow.png",
  );
}

function createHoeDirtCatalogItem(): CatalogItem {
  return createCatalogItem({
    id: "hoedirt",
    category: "floor",
    textureLocalPath: "/game-assets/1.6.15/terrain/hoeDirt.png",
    sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
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

function createHoeDirtPlacementItem(
  instanceId: number,
  x: number,
  y: number,
  variant: number,
  layer: PlacementItem["layer"] = "path",
): PlacementItem {
  return {
    instanceId,
    itemId: "hoedirt",
    x,
    y,
    layer,
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant,
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

function createFurnitureCatalogItem(
  id: string,
  furnitureType: string,
  tileSize: Readonly<{ width: number; height: number }>,
  sourceRect: Readonly<{ x: number; y: number; width: number; height: number }>,
  tableFlags: Readonly<{ isLongTable: boolean; isTable: boolean }>,
  rotationSprites: readonly CatalogFurnitureRotationSprite[] | undefined = undefined,
  isRug = false,
): CatalogItem {
  return createCatalogItem({
    id,
    category: "placeable",
    tileSize,
    sprite: { kind: "source-rect", ...sourceRect },
    renderingMetadata: {
      kind: "furniture",
      furnitureType,
      indoors: true,
      outdoors: true,
      rotationSprites,
      rotationTileSizes: undefined,
      wallMounted: false,
      isRug,
      ...tableFlags,
      bedType: null,
      compositeSprite: null,
    },
  });
}

function createTablePlacementItem(
  isLongTable = false,
): PlacementItem {
  return {
    ...createHoeDirtPlacementItem(31, 4, 6, 0, "item"),
    itemId: isLongTable ? "furniture_long-table" : "furniture_table",
    footprint: isLongTable ? { width: 3, height: 1 } : { width: 2, height: 2 },
    isTable: !isLongTable,
    isLongTable,
  };
}

function createSprinklerCatalogItem(
  itemId = "object:621",
  baseRadius = 1,
): CatalogItem {
  return createCatalogItem({
    id: itemId,
    category: "placeable",
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "sprite-index", index: Number(itemId.split(":")[1]) },
    placementShadow: {
      alpha: 0.5,
      textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
    },
    renderingMetadata: { kind: "sprinkler", baseRadius },
  });
}

function createSprinklerPlacementItem(
  variant: number,
  tintColor = "#ffffff",
): PlacementItem {
  return {
    instanceId: 9,
    itemId: "object:621",
    x: 2,
    y: 3,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant,
    tintColor,
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

function createCrabPotCatalogItem(): CatalogItem {
  return createCatalogItem({
    id: "object:710",
    category: "placeable",
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    sprite: { kind: "sprite-index", index: 710 },
    renderingMetadata: { kind: "crab-pot" },
  });
}

function createCrabPotPlacementItem(): PlacementItem {
  return {
    ...createSprinklerPlacementItem(0, "#00ff00"),
    itemId: "object:710",
    x: 1,
    y: 1,
  };
}

function createLitBigCraftableCatalogItem(
  recordId: "143" | "146" | "278" = "146",
): CatalogItem {
  const flameLayers = recordId === "143"
    ? [
        { offsetX: 2, offsetY: -14, scale: 1, timeOffsetMilliseconds: 0 },
      ]
    : [
        { offsetX: 3, offsetY: -2, scale: 0.75, timeOffsetMilliseconds: 0 },
        { offsetX: 5, offsetY: 0, scale: 0.75, timeOffsetMilliseconds: 137 },
        { offsetX: 3, offsetY: 3, scale: 0.75, timeOffsetMilliseconds: 274 },
      ];

  return createCatalogItem({
    id: `big-craftable:${recordId}`,
    category: "placeable",
    textureLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
    sprite: { kind: "sprite-index", index: Number(recordId) },
    renderingMetadata: { kind: "lit-big-craftable", flameLayers },
  });
}

function createLitBigCraftablePlacementItem(
  recordId: string,
  variant: number,
  tintColor = "#ffffff",
): PlacementItem {
  return {
    instanceId: 12,
    itemId: `big-craftable:${recordId}`,
    x: 2,
    y: 3,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant,
    tintColor,
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
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

function createFreeCactusPlacementItem(variant: number): PlacementItem {
  return {
    instanceId: 21,
    itemId: "furniture_FreeCactus",
    x: 2,
    y: 3,
    layer: "item",
    rotation: 0,
    footprint: { width: 1, height: 1 },
    variant,
    tintColor: "#123456",
    locked: false,
    isRug: false,
    isGrass: false,
    isTable: false,
    isLongTable: false,
    flipped: false,
    bedType: null,
  };
}

const hoeDirtCardinalFrameCases = [
  { mask: 0, frame: { x: 0, y: 0, width: 16, height: 16 } },
  { mask: 1, frame: { x: 0, y: 48, width: 16, height: 16 } },
  { mask: 2, frame: { x: 16, y: 48, width: 16, height: 16 } },
  { mask: 3, frame: { x: 16, y: 32, width: 16, height: 16 } },
  { mask: 4, frame: { x: 0, y: 16, width: 16, height: 16 } },
  { mask: 5, frame: { x: 0, y: 32, width: 16, height: 16 } },
  { mask: 6, frame: { x: 16, y: 0, width: 16, height: 16 } },
  { mask: 7, frame: { x: 16, y: 16, width: 16, height: 16 } },
  { mask: 8, frame: { x: 48, y: 48, width: 16, height: 16 } },
  { mask: 9, frame: { x: 48, y: 32, width: 16, height: 16 } },
  { mask: 10, frame: { x: 32, y: 48, width: 16, height: 16 } },
  { mask: 11, frame: { x: 32, y: 32, width: 16, height: 16 } },
  { mask: 12, frame: { x: 48, y: 0, width: 16, height: 16 } },
  { mask: 13, frame: { x: 48, y: 16, width: 16, height: 16 } },
  { mask: 14, frame: { x: 32, y: 0, width: 16, height: 16 } },
  { mask: 15, frame: { x: 32, y: 16, width: 16, height: 16 } },
] as const;

function createCropsForCardinalMask(mask: number) {
  const crops = [{ cropId: "crop:24", x: 2, y: 2 }];
  const cardinalNeighbors = [
    { bit: 1, x: 2, y: 1 },
    { bit: 2, x: 3, y: 2 },
    { bit: 4, x: 2, y: 3 },
    { bit: 8, x: 1, y: 2 },
  ];

  for (const cardinalNeighbor of cardinalNeighbors) {
    if ((mask & cardinalNeighbor.bit) !== 0) {
      crops.push({
        cropId: "crop:24",
        x: cardinalNeighbor.x,
        y: cardinalNeighbor.y,
      });
    }
  }

  return crops;
}

describe("createPlacementRenderEntries", () => {
  it("uses frozen path, rug, and ordinary item z-order without changing item keys", () => {
    const floorCatalogItem = createCatalogItem({
      id: "floor:1",
      category: "floor",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
    });
    const rugCatalogItem = createCatalogItem({
      id: "furniture_1451",
      category: "placeable",
      tileSize: { width: 3, height: 2 },
      sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 32 },
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
    const chairCatalogItem = createCatalogItem({
      id: "furniture_0",
      category: "placeable",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
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
    });
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          ...createHoeDirtPlacementItem(1, 0, 0, 0, "path"),
          itemId: floorCatalogItem.id,
        },
        {
          ...createHoeDirtPlacementItem(2, 2, 8, 0, "item"),
          itemId: rugCatalogItem.id,
          footprint: { width: 3, height: 2 },
          isRug: true,
        },
        {
          ...createHoeDirtPlacementItem(3, 3, 3, 0, "item"),
          itemId: chairCatalogItem.id,
          footprint: { width: 1, height: 2 },
        },
      ],
      nextItemId: 4,
    };

    expect(
      createPlacementRenderEntries(
        placementSnapshot,
        [floorCatalogItem, rugCatalogItem, chairCatalogItem],
      ).map((renderEntry) => ({
        key: renderEntry.key,
        zIndex: renderEntry.zIndex,
      })),
    ).toEqual([
      { key: "item:1", zIndex: 0.1 },
      { key: "item:2", zIndex: 0.2 },
      { key: "item:3", zIndex: 9 },
    ]);
  });

  it("renders a held child above its parent from the parent center without persistent tint", () => {
    const tableCatalogItem = createFurnitureCatalogItem(
      "furniture_table",
      "table",
      { width: 2, height: 2 },
      { x: 0, y: 0, width: 32, height: 32 },
      { isLongTable: false, isTable: true },
    );
    const childCatalogItem = createFurnitureCatalogItem(
      "furniture_child",
      "chair",
      { width: 1, height: 1 },
      { x: 0, y: 0, width: 16, height: 16 },
      { isLongTable: false, isTable: false },
      [{ sprite: { kind: "source-rect", x: 32, y: 48, width: 16, height: 16 } }],
    );
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [{
        ...createTablePlacementItem(),
        heldItem: {
          ...createHoeDirtPlacementItem(32, 99, 101, 0, "item"),
          layer: "item",
          itemId: childCatalogItem.id,
          rotation: 1,
          tintColor: "#123456",
          flipped: true,
        } satisfies PlacementHeldItem,
      }],
      nextItemId: 33,
    };

    expect(
      createPlacementRenderEntries(
        placementSnapshot,
        [tableCatalogItem, childCatalogItem],
      ),
    ).toEqual([
      expect.objectContaining({ key: "item:31", zIndex: 15 }),
      expect.objectContaining({
        effectiveFootprint: { width: 1, height: 1 },
        frame: { kind: "source-rect", x: 32, y: 48, width: 16, height: 16 },
        key: "item:32",
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 72,
          positionY: 92,
        },
        rotationQuarterTurns: 0,
        shouldApplySelectionTint: true,
        zIndex: 15.001,
      }),
    ]);
    const heldChildRenderEntry = createPlacementRenderEntries(
      placementSnapshot,
      [tableCatalogItem, childCatalogItem],
    )[1];
    expect(heldChildRenderEntry).not.toHaveProperty("isFlipped");
    expect(heldChildRenderEntry).not.toHaveProperty("tintColor");
  });

  it("centers a loaded long-table child with the frozen tea-table offset", () => {
    const longTableCatalogItem = createFurnitureCatalogItem(
      "furniture_long-table",
      "long_table",
      { width: 3, height: 1 },
      { x: 0, y: 0, width: 48, height: 16 },
      { isLongTable: true, isTable: false },
    );
    const childCatalogItem = createFurnitureCatalogItem(
      "furniture_child",
      "chair",
      { width: 1, height: 1 },
      { x: 0, y: 0, width: 16, height: 16 },
      { isLongTable: false, isTable: false },
    );
    const longTable = {
      ...createTablePlacementItem(true),
      itemId: "furniture_tea-long-table",
      heldItem: {
        ...createHoeDirtPlacementItem(32, -10, -20, 0, "item"),
        layer: "item",
        itemId: childCatalogItem.id,
      } satisfies PlacementHeldItem,
    };

    expect(
      createPlacementRenderEntries(
        { ...createEmptyPlacementSnapshot(), items: [longTable], nextItemId: 33 },
        [{ ...longTableCatalogItem, id: longTable.itemId }, childCatalogItem],
      )[1],
    ).toEqual(expect.objectContaining({
      key: "item:32",
      pixelGeometry: {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: 80,
        positionY: 92,
      },
      zIndex: 13.001,
    }));
  });

  it("fails before rendering a held child whose locked catalog metadata is not furniture", () => {
    const tableCatalogItem = createFurnitureCatalogItem(
      "furniture_table",
      "table",
      { width: 2, height: 2 },
      { x: 0, y: 0, width: 32, height: 32 },
      { isLongTable: false, isTable: true },
    );
    const nonFurnitureCatalogItem = createCatalogItem({
      id: "object:1",
      category: "placeable",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
    });
    const heldItem: PlacementHeldItem = {
      ...createHoeDirtPlacementItem(32, 8, 9, 0, "item"),
      layer: "item",
      itemId: nonFurnitureCatalogItem.id,
    };

    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [{ ...createTablePlacementItem(), heldItem }],
        nextItemId: 33,
      },
      [tableCatalogItem, nonFurnitureCatalogItem],
    )).toThrow(
      'held item instanceId 32 requires furniture catalog metadata for item "object:1"',
    );
  });

  it("renders a one-tile rug held by a table through the ordinary furniture frame path", () => {
    const tableCatalogItem = createFurnitureCatalogItem(
      "furniture_table",
      "table",
      { width: 2, height: 2 },
      { x: 0, y: 0, width: 32, height: 32 },
      { isLongTable: false, isTable: true },
    );
    const rugCatalogItem = createFurnitureCatalogItem(
      "furniture_rug",
      "rug",
      { width: 1, height: 1 },
      { x: 16, y: 32, width: 16, height: 16 },
      { isLongTable: false, isTable: false },
      undefined,
      true,
    );
    const heldRug: PlacementHeldItem = {
      ...createHoeDirtPlacementItem(32, 80, 90, 0, "item"),
      layer: "item",
      itemId: rugCatalogItem.id,
      isRug: true,
    };

    expect(createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [{ ...createTablePlacementItem(), heldItem: heldRug }],
        nextItemId: 33,
      },
      [tableCatalogItem, rugCatalogItem],
    )[1]).toEqual(expect.objectContaining({
      frame: { x: 16, y: 32, width: 16, height: 16 },
      key: "item:32",
      pixelGeometry: expect.objectContaining({ positionX: 72, positionY: 92 }),
    }));
  });

  it("rejects invalid held structure before attempting render-entry construction", () => {
    const tableCatalogItem = createFurnitureCatalogItem(
      "furniture_table",
      "table",
      { width: 2, height: 2 },
      { x: 0, y: 0, width: 32, height: 32 },
      { isLongTable: false, isTable: true },
    );
    const invalidHeldItem = {
      ...createHoeDirtPlacementItem(32, 8, 9, 0, "item"),
      layer: "item" as const,
      itemId: "furniture_child",
      footprint: { width: 2, height: 1 },
    };

    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [{ ...createTablePlacementItem(), heldItem: invalidHeldItem }],
        nextItemId: 33,
      },
      [tableCatalogItem],
    )).toThrow(/heldItem\.footprint.*1x1/s);
  });

  it("fails fast when furniture Type metadata or persisted isRug disagrees", () => {
    const createFurnitureCatalogItem = (
      furnitureType: string,
      isRug: boolean,
    ): CatalogItem => createCatalogItem({
      id: "furniture_test",
      category: "placeable",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
      renderingMetadata: {
        kind: "furniture",
        furnitureType,
        indoors: true,
        outdoors: true,
        rotationSprites: undefined,
        rotationTileSizes: undefined,
        wallMounted: false,
        isRug,
        isTable: false,
        isLongTable: false,
        bedType: null,
        compositeSprite: null,
      },
    });
    const createSnapshot = (isRug: boolean) => ({
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          ...createHoeDirtPlacementItem(1, 0, 0, 0, "item"),
          itemId: "furniture_test",
          isRug,
        },
      ],
      nextItemId: 2,
    });

    expect(() =>
      createPlacementRenderEntries(
        createSnapshot(false),
        [createFurnitureCatalogItem("rug", false)],
      )
    ).toThrow(
      'furniture Type "rug" requires isRug true; received false',
    );
    expect(() =>
      createPlacementRenderEntries(
        createSnapshot(true),
        [createFurnitureCatalogItem("chair", false)],
      )
    ).toThrow(
      'placement isRug must match catalog Type "chair" for item "furniture_test"; expected false, received true',
    );
  });

  it("renders the exact bed sprite over its footprint and fails fast on bed metadata drift", () => {
    const bedCatalogItem = createCatalogItem({
      id: "furniture_2048",
      category: "placeable",
      tileSize: { width: 2, height: 3 },
      sprite: { kind: "source-rect", x: 0, y: 1024, width: 32, height: 64 },
      renderingMetadata: {
        kind: "furniture",
        furnitureType: "bed",
        indoors: true,
        outdoors: false,
        rotationSprites: undefined,
        rotationTileSizes: undefined,
        wallMounted: false,
        isRug: false,
        isTable: false,
        isLongTable: false,
        bedType: "single",
        compositeSprite: null,
      },
    });
    const createBedSnapshot = (
      bedType: PlacementItem["bedType"],
      rotation = 0,
      footprint = { width: 2, height: 3 },
    ) => ({
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          ...createHoeDirtPlacementItem(1, 2, 3, 0, "item"),
          itemId: "furniture_2048",
          bedType,
          rotation,
          footprint,
        },
      ],
      nextItemId: 2,
    });

    expect(
      createPlacementRenderEntries(createBedSnapshot("single"), [bedCatalogItem]),
    ).toEqual([
      expect.objectContaining({
        effectiveFootprint: { width: 2, height: 3 },
        frame: { x: 0, y: 1024, width: 32, height: 64 },
        key: "item:1",
        rotationQuarterTurns: 0,
        tileX: 2,
        tileY: 3,
        zIndex: 11,
      }),
    ]);

    expect(() => createPlacementRenderEntries(
      createBedSnapshot(null),
      [bedCatalogItem],
    )).toThrow(
      'placement bedType must match catalog Type "bed" for item "furniture_2048"; expected "single", received null',
    );
    expect(() => createPlacementRenderEntries(
      createBedSnapshot("single"),
      [{
        ...bedCatalogItem,
        renderingMetadata: {
          ...bedCatalogItem.renderingMetadata,
          bedType: "double",
        } as CatalogItem["renderingMetadata"],
      }],
    )).toThrow(
      'furniture Type "bed" requires bedType "single"; received "double"',
    );
    expect(() => createPlacementRenderEntries(
      createBedSnapshot("single", 1),
      [bedCatalogItem],
    )).toThrow("bed rotation must be 0; received 1");
    expect(() => createPlacementRenderEntries(
      createBedSnapshot("single", 0, { width: 3, height: 3 }),
      [bedCatalogItem],
    )).toThrow(
      "single bed footprint must be 2 by 3; received width 3, height 3",
    );
  });

  it("creates every exact Fish Pond layer in frozen order and applies variant and water rules", async () => {
    const rawBuildings = JSON.parse(await readFile(
      path.join(
        process.cwd(),
        "public/game-assets/1.6.15/data/Buildings.json",
      ),
      "utf8",
    )) as unknown;
    const fishPondCatalogItem = createBuildingCatalogFromDataset(
      rawBuildings,
      catalogDatasetUrls.buildings,
    ).items.find((catalogItem) => catalogItem.id === "building:Fish Pond");
    if (fishPondCatalogItem === undefined) {
      throw new Error("Expected the locked catalog to contain building:Fish Pond.");
    }
    const createFishPondEntries = (
      variant: number | undefined,
      waterColor: number | undefined,
    ) => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        buildings: [
          {
            instanceId: 1,
            buildingId: "Fish Pond",
            x: 2,
            y: 3,
            ...(variant === undefined ? {} : { variant }),
            ...(waterColor === undefined ? {} : { waterColor }),
          },
        ],
        nextBuildingId: 2,
      },
      [fishPondCatalogItem],
      "summer",
    );
    const defaultEntries = createFishPondEntries(undefined, undefined);
    const waterTileLayers = Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from({ length: 4 }, (_, columnIndex) => ({
        frame: {
          x: 0,
          y: 2064 + ((rowIndex + columnIndex) % 2 === 0 ? 0 : 128),
          width: 64,
          height: rowIndex === 4 ? 32 : 64,
        },
        layerId: `FishPondWaterTile_${String(rowIndex)}_${String(columnIndex)}`,
        opacity: 0.5,
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 40 + columnIndex * 16,
          positionY: 56 + rowIndex * 16,
          uniformScale: 0.25,
        },
        textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
        tintColor: "#3cf0ff",
      })),
    ).flat();
    const shadowLayers = Array.from({ length: 5 }, (_, columnIndex) => ({
      frame: {
        x: columnIndex === 0 ? 656 : columnIndex === 4 ? 688 : 672,
        y: 394,
        width: 16,
        height: 16,
      },
      layerId: columnIndex === 0
        ? "Shadow_left"
        : columnIndex === 4
          ? "Shadow_right"
          : `Shadow_mid_${String(columnIndex)}`,
      pixelGeometry: {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: 32 + columnIndex * 16,
        positionY: 128,
      },
      textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
    }));
    const commonLayerProperties = {
      effectiveFootprint: { width: 5, height: 5 },
      key: "building:1",
      tileX: 2,
      tileY: 3,
      zIndex: 5.5,
    };

    expect(defaultEntries).toHaveLength(29);
    expect(defaultEntries.map((entry) => ({
      frame: entry.frame,
      layerId: entry.layerId,
      opacity: entry.opacity,
      pixelGeometry: entry.pixelGeometry,
      textureLocalPath: entry.textureLocalPath,
      tintColor: entry.tintColor,
    }))).toEqual([
      {
        frame: { x: 0, y: 80, width: 80, height: 80 },
        layerId: "FishPondWater",
        opacity: undefined,
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 32,
          positionY: 48,
        },
        textureLocalPath: "/game-assets/1.6.15/buildings/Fish Pond.png",
        tintColor: "#3c7e96",
      },
      ...waterTileLayers,
      ...shadowLayers.map((layer) => ({
        ...layer,
        opacity: undefined,
        tintColor: undefined,
      })),
      {
        frame: { x: 0, y: 0, width: 80, height: 80 },
        layerId: "FishPondBase",
        opacity: undefined,
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 32,
          positionY: 48,
        },
        textureLocalPath: "/game-assets/1.6.15/buildings/Fish Pond.png",
        tintColor: undefined,
      },
      {
        frame: { x: 16, y: 160, width: 48, height: 7 },
        layerId: "FishPondBubbles",
        opacity: undefined,
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 48,
          positionY: 59,
        },
        textureLocalPath: "/game-assets/1.6.15/buildings/Fish Pond.png",
        tintColor: undefined,
      },
      {
        frame: { x: 80, y: 0, width: 80, height: 48 },
        layerId: "FishPondNetting",
        opacity: undefined,
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 32,
          positionY: 16,
        },
        textureLocalPath: "/game-assets/1.6.15/buildings/Fish Pond.png",
        tintColor: undefined,
      },
    ]);
    for (const entry of defaultEntries) {
      expect(entry).toMatchObject(commonLayerProperties);
      expect(entry.animation).toBeUndefined();
    }

    const noneEntries = createFishPondEntries(-1, undefined);
    expect(noneEntries).toHaveLength(28);
    expect(noneEntries.some((entry) =>
      entry.layerId === "FishPondNetting"
    )).toBe(false);

    const customWaterEntries = createFishPondEntries(2, 16_391_710);
    expect(customWaterEntries).toHaveLength(28);
    expect(customWaterEntries.some((entry) =>
      entry.layerId === "FishPondBubbles"
    )).toBe(false);
    expect(customWaterEntries.find((entry) =>
      entry.layerId === "FishPondWater"
    )?.tintColor).toBe("#fa1e1e");
    expect(customWaterEntries.filter((entry) =>
      entry.layerId?.startsWith("FishPondWaterTile_")
    ).every((entry) => entry.tintColor === "#fa1e1e")).toBe(true);
    expect(customWaterEntries.at(-1)?.frame).toEqual({
      x: 80,
      y: 96,
      width: 80,
      height: 48,
    });

    expect(createFishPondEntries(3, 3_964_566)).toHaveLength(27);
  });
  it("includes the locked paint mask only for a painted supported building", () => {
    const paintedBuildingCatalogItem = createBuildingCatalogItem({
      id: "building:Big Shed",
      textureLocalPath: "/game-assets/1.6.15/buildings/Big Shed.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 112, height: 96 },
    }, 0, "/game-assets/1.6.15/buildings/Big Shed_PaintMask.png");

    expect(
      createPlacementRenderEntries(
        {
          ...createEmptyPlacementSnapshot(),
          buildings: [
            {
              instanceId: 1,
              buildingId: "Big Shed",
              x: 2,
              y: 3,
              paintColors: {
                color1: "#112233",
                color2: "#445566",
                color3: "#778899",
              },
            },
          ],
          nextBuildingId: 2,
        },
        [paintedBuildingCatalogItem],
      ),
    ).toEqual([
      expect.objectContaining({
        buildingPaint: {
          colors: {
            color1: "#112233",
            color2: "#445566",
            color3: "#778899",
          },
          paintMaskLocalPath:
            "/game-assets/1.6.15/buildings/Big Shed_PaintMask.png",
        },
      }),
    ]);
  });

  it("maps persistent building, crop, floor, and fence records to locked local sprites", () => {
    const catalogItems = [
      createBuildingCatalogItem({
        id: "building:Barn",
        tileSize: { width: 7, height: 4 },
        textureLocalPath: "/game-assets/1.6.15/buildings/Barn.png",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 112, height: 112 },
      }),
      createCropCatalogItem(),
      createCatalogItem({
        id: "floor:1",
        category: "floor",
        textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
        sprite: { kind: "source-rect", x: 32, y: 16, width: 64, height: 64 },
      }),
      createCatalogItem({
        id: "fence:322",
        category: "fence",
        textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 352 },
      }),
    ];
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 3, y: 4 }],
      crops: [{ cropId: "crop:24", x: 6, y: 7 }],
      items: [
        {
          instanceId: 1,
          itemId: "floor:1",
          x: 8,
          y: 9,
          layer: "path" as const,
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
        {
          instanceId: 2,
          itemId: "fence:322",
          x: 9,
          y: 10,
          layer: "fence" as const,
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
      nextBuildingId: 2,
      nextItemId: 3,
    };

    expect(
      createPlacementRenderEntries(placementSnapshot, catalogItems),
    ).toEqual([
      {
        key: "building:1",
        catalogItem: catalogItems[0],
        effectiveFootprint: { width: 7, height: 4 },
        tileX: 3,
        tileY: 4,
        frame: { x: 0, y: 0, width: 112, height: 112 },
        layerId: "Base",
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 48,
          positionY: 64,
        },
        rotationQuarterTurns: 0,
        textureLocalPath: "/game-assets/1.6.15/buildings/Barn.png",
        zIndex: 14.5,
      },
      {
        key: "crop:6,7",
        catalogItem: catalogItems[1],
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 6,
        tileY: 7,
        frame: { x: 0, y: 0, width: 16, height: 16 },
        rotationQuarterTurns: 0,
        shouldApplySelectionTint: false,
        textureLocalPath: "/game-assets/1.6.15/terrain/hoeDirt.png",
      },
      {
        key: "crop:6,7",
        catalogItem: catalogItems[1],
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 6,
        tileY: 7,
        frame: { x: 64, y: 288, width: 16, height: 32 },
        rotationQuarterTurns: 0,
        textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
        zIndex: 15,
      },
      {
        key: "item:1",
        catalogItem: catalogItems[2],
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 8,
        tileY: 9,
        frame: { x: 32, y: 16, width: 16, height: 16 },
        rotationQuarterTurns: 0,
        zIndex: 0.1,
      },
      {
        key: "item:2",
        catalogItem: catalogItems[3],
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 9,
        tileY: 10,
        frame: { x: 0, y: 0, width: 16, height: 16 },
        rotationQuarterTurns: 0,
        zIndex: 21,
      },
    ]);
  });

  it("renders a mature crop from its crop rendering frame instead of its source sprite index", () => {
    const catalogItem = createCropCatalogItem({
      id: "crop:CarrotSeeds",
      sprite: { kind: "sprite-index", index: 48 },
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 64, y: 768, width: 16, height: 32 },
        tintColors: [],
        hasForageShadow: false,
      } as never,
    });

    const cropRenderingMetadata = getCropRenderingMetadata(catalogItem);
    const cropRenderEntries = excludeHoeDirtRenderEntries(createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        crops: [{ cropId: catalogItem.id, x: 2, y: 3 }],
      },
      [catalogItem],
    ));

    expect(cropRenderEntries).toEqual([
      {
        key: "crop:2,3",
        catalogItem,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 2,
        tileY: 3,
        frame: { x: 64, y: 768, width: 16, height: 32 },
        rotationQuarterTurns: 0,
        textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
        zIndex: 7,
      },
    ]);
    expect(cropRenderEntries[0]?.frame).toEqual({
      x: cropRenderingMetadata.fullyGrownRect.x,
      y: cropRenderingMetadata.fullyGrownRect.y,
      width: cropRenderingMetadata.fullyGrownRect.width,
      height: cropRenderingMetadata.fullyGrownRect.height,
    });
  });

  it("renders a tinted mature crop as base and color layers at the same crop position", () => {
    const catalogItem = createCropCatalogItem({
      id: "crop:425",
      sprite: { kind: "sprite-index", index: 31 },
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 208, y: 480, width: 16, height: 32 },
        coloredRect: { kind: "source-rect", x: 224, y: 480, width: 16, height: 32 },
        tintColors: [0xbb00ff, 0x7789ff, 0x47e3ff, 0xff7f90, 0xcdb2ff, 0x8c77ff],
        hasForageShadow: false,
      } as never,
    });

    expect(excludeHoeDirtRenderEntries(createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        crops: [{ cropId: catalogItem.id, x: 2, y: 3 }],
      },
      [catalogItem],
    ))).toEqual([
      {
        key: "crop:2,3",
        catalogItem,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 2,
        tileY: 3,
        frame: { x: 208, y: 480, width: 16, height: 32 },
        rotationQuarterTurns: 0,
        textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
        zIndex: 7,
      },
      {
        key: "crop:2,3",
        catalogItem,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 2,
        tileY: 3,
        frame: { x: 224, y: 480, width: 16, height: 32 },
        rotationQuarterTurns: 0,
        textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
        tintColor: "#cdb2ff",
        zIndex: 7,
      },
    ]);
  });

  it("uses each supplementary forage crop's springobjects frame and frozen shadow geometry", () => {
    const daffodil = createCropCatalogItem({
      id: "crop:495_18",
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      sprite: { kind: "sprite-index", index: 23 },
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 288, y: 0, width: 16, height: 16 },
        tintColors: [],
        hasForageShadow: true,
      } as never,
    });
    const leek = createCropCatalogItem({
      id: "crop:495_20",
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      sprite: { kind: "sprite-index", index: 23 },
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 320, y: 0, width: 16, height: 16 },
        tintColors: [],
        hasForageShadow: true,
      } as never,
    });

    const renderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        crops: [
          { cropId: daffodil.id, x: 4, y: 5 },
          { cropId: leek.id, x: 5, y: 5 },
        ],
      },
      [daffodil, leek],
    );

    expect(excludeHoeDirtRenderEntries(renderEntries)).toEqual([
      {
        key: "crop:4,5",
        catalogItem: daffodil,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 4,
        tileY: 5,
        frame: null,
        opacity: 0.5,
        pixelGeometry: {
          anchorX: 0.5,
          anchorY: 0.5,
          horizontalScale: 1,
          positionX: 72,
          positionY: 93.25,
        },
        rotationQuarterTurns: 0,
        shouldApplySelectionTint: false,
        textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
        zIndex: 11,
      },
      {
        key: "crop:4,5",
        catalogItem: daffodil,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 4,
        tileY: 5,
        frame: { x: 288, y: 0, width: 16, height: 16 },
        rotationQuarterTurns: 0,
        textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
        zIndex: 11,
      },
      {
        key: "crop:5,5",
        catalogItem: leek,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 5,
        tileY: 5,
        frame: null,
        opacity: 0.5,
        pixelGeometry: {
          anchorX: 0.5,
          anchorY: 0.5,
          horizontalScale: 1,
          positionX: 88,
          positionY: 93.25,
        },
        rotationQuarterTurns: 0,
        shouldApplySelectionTint: false,
        textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
        zIndex: 11,
      },
      {
        key: "crop:5,5",
        catalogItem: leek,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 5,
        tileY: 5,
        frame: { x: 320, y: 0, width: 16, height: 16 },
        rotationQuarterTurns: 0,
        textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
        zIndex: 11,
      },
    ]);
  });

  it("renders a giant crop persisted as a 3 by 3 item at its footprint-bottom z index", () => {
    const catalogItem = createCropCatalogItem({
      id: "crop:giant_Cauliflower",
      tileSize: { width: 3, height: 3 },
      sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 16 },
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 112, y: 512, width: 48, height: 64 },
        tintColors: [],
        hasForageShadow: false,
      } as never,
    });

    expect(excludeHoeDirtRenderEntries(createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [{
          ...createHoeDirtPlacementItem(1, 1, 2, 0, "item"),
          itemId: catalogItem.id,
          footprint: { width: 3, height: 3 },
        }],
        nextItemId: 2,
      },
      [catalogItem],
    ))).toEqual([
      {
        key: "item:1",
        catalogItem,
        effectiveFootprint: { width: 3, height: 3 },
        tileX: 1,
        tileY: 2,
        frame: { x: 112, y: 512, width: 48, height: 64 },
        rotationQuarterTurns: 0,
        zIndex: 9,
      },
    ]);
  });

  it("renders Garden Pot crops without HoeDirt or forage shadows at frozen pixel geometry", () => {
    const gardenPot = createCatalogItem({
      id: "big-craftable:62",
      category: "placeable",
      textureLocalPath: "/game-assets/1.6.15/tilesheets/Craftables.png",
      sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
    });
    const ordinaryCrop = createCropCatalogItem({
      id: "crop:CarrotSeeds",
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 64, y: 768, width: 16, height: 32 },
        coloredRect: { kind: "source-rect", x: 80, y: 768, width: 16, height: 32 },
        tintColors: [0xcdb2ff],
        hasForageShadow: false,
      } as never,
    });
    const forageCrop = createCropCatalogItem({
      id: "crop:495_18",
      textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 288, y: 0, width: 16, height: 16 },
        tintColors: [],
        hasForageShadow: true,
      } as never,
    });

    const renderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        crops: [
          { cropId: ordinaryCrop.id, x: 2, y: 3 },
          { cropId: forageCrop.id, x: 4, y: 3 },
        ],
        items: [
          { ...createHoeDirtPlacementItem(1, 2, 3, 0, "item"), itemId: gardenPot.id },
          { ...createHoeDirtPlacementItem(2, 4, 3, 0, "item"), itemId: gardenPot.id },
        ],
        nextItemId: 3,
      },
      [gardenPot, ordinaryCrop, forageCrop],
    );

    expect(renderEntries.filter((entry) => entry.catalogItem.category === "crop"))
      .toEqual([
        {
          key: "crop:2,3",
          catalogItem: ordinaryCrop,
          effectiveFootprint: { width: 1, height: 1 },
          tileX: 2,
          tileY: 3,
          frame: { x: 64, y: 768, width: 16, height: 32 },
          pixelGeometry: {
            anchorX: 0,
            anchorY: 0,
            horizontalScale: 1,
            positionX: 32,
            positionY: 26,
          },
          rotationQuarterTurns: 0,
          textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
          zIndex: 7.5,
        },
        {
          key: "crop:2,3",
          catalogItem: ordinaryCrop,
          effectiveFootprint: { width: 1, height: 1 },
          tileX: 2,
          tileY: 3,
          frame: { x: 80, y: 768, width: 16, height: 32 },
          pixelGeometry: {
            anchorX: 0,
            anchorY: 0,
            horizontalScale: 1,
            positionX: 32,
            positionY: 26,
          },
          rotationQuarterTurns: 0,
          textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
          tintColor: "#cdb2ff",
          zIndex: 7.5,
        },
        {
          key: "crop:4,3",
          catalogItem: forageCrop,
          effectiveFootprint: { width: 1, height: 1 },
          tileX: 4,
          tileY: 3,
          frame: { x: 288, y: 0, width: 16, height: 16 },
          pixelGeometry: {
            anchorX: 0,
            anchorY: 0,
            horizontalScale: 1,
            positionX: 64,
            positionY: 42,
          },
          rotationQuarterTurns: 0,
          textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
          zIndex: 7.5,
        },
      ]);
    expect(renderEntries.some((entry) =>
      entry.textureLocalPath === "/game-assets/1.6.15/terrain/hoeDirt.png",
    )).toBe(false);
    expect(renderEntries.some((entry) =>
      entry.textureLocalPath === "/game-assets/1.6.15/sprites/shadow.png",
    )).toBe(false);
  });

  it("fails fast when a crop catalog item does not expose crop rendering metadata", () => {
    const catalogItem = createCatalogItem({
      id: "crop:missing-rendering",
      category: "crop",
      textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
      sprite: { kind: "sprite-index", index: 48 },
    });

    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        crops: [{ cropId: catalogItem.id, x: 0, y: 0 }],
      },
      [catalogItem],
    )).toThrow('crop rendering metadata');
  });

  it("fails fast when crop rendering metadata exposes tints without a color frame", () => {
    const catalogItem = createCropCatalogItem({
      id: "crop:inconsistent-rendering",
      renderingMetadata: {
        kind: "crop",
        fullyGrownRect: { kind: "source-rect", x: 64, y: 768, width: 16, height: 32 },
        tintColors: [0xff0000],
        hasForageShadow: false,
      } as never,
    });

    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        crops: [{ cropId: catalogItem.id, x: 0, y: 0 }],
      },
      [catalogItem],
    )).toThrow('coloredRect');
  });

  it.each(hoeDirtCardinalFrameCases)(
    "uses the exact HoeDirt base frame for cardinal mask $mask without loading placeables",
    ({ mask, frame }) => {
      const cropCatalogItem = createCropCatalogItem();
      const placementRenderEntries = createPlacementRenderEntries(
        {
          ...createEmptyPlacementSnapshot(),
          crops: createCropsForCardinalMask(mask),
        },
        [cropCatalogItem],
      );
      const centerDirtEntry = placementRenderEntries.find(
        (entry) =>
          entry.textureLocalPath === "/game-assets/1.6.15/terrain/hoeDirt.png"
          && entry.tileX === 2
          && entry.tileY === 2,
      );

      expect(centerDirtEntry).toEqual({
        key: "crop:2,2",
        catalogItem: cropCatalogItem,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 2,
        tileY: 2,
        frame,
        rotationQuarterTurns: 0,
        shouldApplySelectionTint: false,
        textureLocalPath: "/game-assets/1.6.15/terrain/hoeDirt.png",
      });
      expect(placementRenderEntries.indexOf(centerDirtEntry!)).toBeLessThan(
        placementRenderEntries.findIndex((entry) =>
          entry.key === "crop:2,2"
          && entry.textureLocalPath === "/game-assets/1.6.15/tilesheets/crops.png"
        ),
      );
    },
  );

  it("connects one union base across crops and HoeDirt items but only connects Watered overlays", () => {
    const cropCatalogItem = createCropCatalogItem();
    const hoeDirtCatalogItem = createHoeDirtCatalogItem();
    const placementRenderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        crops: [
          { cropId: "crop:24", x: 2, y: 2 },
          { cropId: "crop:24", x: 2, y: 1 },
        ],
        items: [
          createHoeDirtPlacementItem(1, 2, 2, 1),
          createHoeDirtPlacementItem(2, 3, 2, 1),
          createHoeDirtPlacementItem(3, 2, 3, 0),
        ],
        nextItemId: 4,
      },
      [cropCatalogItem, hoeDirtCatalogItem],
    );
    const hoeDirtEntries = placementRenderEntries.filter(
      (entry) => entry.textureLocalPath === "/game-assets/1.6.15/terrain/hoeDirt.png",
    );
    const centerDirtEntries = hoeDirtEntries.filter(
      (entry) => entry.tileX === 2 && entry.tileY === 2,
    );

    expect(hoeDirtEntries).toHaveLength(6);
    expect(centerDirtEntries).toEqual([
      expect.objectContaining({
        key: "item:1",
        frame: { x: 16, y: 16, width: 16, height: 16 },
        shouldApplySelectionTint: true,
      }),
      expect.objectContaining({
        key: "item:1",
        frame: { x: 80, y: 48, width: 16, height: 16 },
        shouldApplySelectionTint: true,
      }),
    ]);
    expect(hoeDirtEntries.filter(
      (entry) => entry.tileX === 3 && entry.tileY === 2,
    )).toEqual([
      expect.objectContaining({ frame: { x: 48, y: 48, width: 16, height: 16 } }),
      expect.objectContaining({ frame: { x: 112, y: 48, width: 16, height: 16 } }),
    ]);
    expect(hoeDirtEntries.filter(
      (entry) => entry.tileX === 2 && entry.tileY === 3,
    )).toHaveLength(1);
    expect(hoeDirtEntries).toContainEqual(expect.objectContaining({
      key: "crop:2,1",
      shouldApplySelectionTint: false,
    }));
    const firstCropSpriteIndex = placementRenderEntries.findIndex(
      (entry) => entry.catalogItem.category === "crop"
        && entry.textureLocalPath === "/game-assets/1.6.15/tilesheets/crops.png",
    );
    expect(placementRenderEntries.slice(0, firstCropSpriteIndex)).toEqual(
      hoeDirtEntries,
    );
  });

  it("uses the snow HoeDirt texture in winter", () => {
    const cropCatalogItem = createCropCatalogItem();
    const winterRenderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        crops: [{ cropId: "crop:24", x: 0, y: 0 }],
      },
      [cropCatalogItem],
      "winter",
    );

    expect(winterRenderEntries[0]).toEqual(expect.objectContaining({
      frame: { x: 0, y: 0, width: 16, height: 16 },
      textureLocalPath: "/game-assets/1.6.15/terrain/hoeDirtSnow.png",
    }));
  });

  it.each([
    [
      "layer",
      createHoeDirtPlacementItem(1, 0, 0, 0, "item"),
      /HoeDirt.*item:1.*layer.*"item"/s,
    ],
    [
      "variant",
      createHoeDirtPlacementItem(1, 0, 0, 2),
      /HoeDirt.*item:1.*variant.*2/s,
    ],
  ])("rejects invalid HoeDirt item %s before rendering", (_fieldName, placementItem, errorPattern) => {
    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [placementItem],
        nextItemId: 2,
      },
      [createHoeDirtCatalogItem()],
    )).toThrow(errorPattern);
  });

  it("rejects invalid HoeDirt season metadata with the catalog ID and received path", () => {
    const invalidHoeDirtCatalogItem = {
      ...createHoeDirtCatalogItem(),
      renderingMetadata: {
        kind: "hoe-dirt" as const,
        seasonalTextureLocalPaths: {
          spring: "/game-assets/1.6.15/terrain/hoeDirt.png",
          summer: "/game-assets/1.6.15/terrain/hoeDirt.png",
          fall: "/game-assets/1.6.15/terrain/hoeDirt.png",
          winter: "/game-assets/1.6.15/terrain/wrong.png",
        },
      },
    };

    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createHoeDirtPlacementItem(1, 0, 0, 0)],
        nextItemId: 2,
      },
      [invalidHoeDirtCatalogItem],
      "winter",
    )).toThrow(/hoedirt.*winter.*wrong\.png/s);
  });

  it("fails fast when a persistent placement references a catalog item that is unavailable", () => {
    expect(() =>
      createPlacementRenderEntries(
        {
          ...createEmptyPlacementSnapshot(),
          crops: [{ cropId: "crop:missing", x: 0, y: 0 }],
        },
        [],
      ),
    ).toThrow('catalog item ID "crop:missing"');
  });

  it("normalizes item rotation while buildings, crop dirt, and crops remain unrotated", () => {
    const catalogItems = [
      createBuildingCatalogItem({
        id: "building:Barn",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
      }),
      createCropCatalogItem(),
      createCatalogItem({
        id: "object:390",
        category: "placeable",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 16 },
      }),
    ];
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ instanceId: 1, buildingId: "Barn", x: 0, y: 0 }],
      crops: [{ cropId: "crop:24", x: 1, y: 1 }],
      items: [
        {
          instanceId: 1,
          itemId: "object:390",
          x: 2,
          y: 2,
          layer: "item" as const,
          rotation: -1,
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
      nextBuildingId: 2,
      nextItemId: 2,
    };

    expect(
      createPlacementRenderEntries(placementSnapshot, catalogItems).map(
        (placementRenderEntry) => placementRenderEntry.rotationQuarterTurns,
      ),
    ).toEqual([0, 0, 0, 3]);
  });

  it("uses furniture rotation sprites and expands one wild tree into shared-key layers", () => {
    const catalogItems = [
      createCatalogItem({
        id: "furniture_0",
        category: "placeable",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 },
        renderingMetadata: {
          kind: "furniture",
          furnitureType: "chair",
          indoors: true,
          outdoors: true,
          rotationSprites: [
            { sprite: { kind: "source-rect", x: 0, y: 0, width: 16, height: 32 } },
            { sprite: { kind: "source-rect", x: 16, y: 0, width: 32, height: 16 } },
          ],
          rotationTileSizes: undefined,
          wallMounted: false,
          isRug: false,
          isTable: false,
          isLongTable: false,
          bedType: null,
          compositeSprite: null,
        },
      }),
      createCatalogItem({
        id: "wildtree_1",
        category: "placeable",
        textureLocalPath: "/game-assets/1.6.15/terrain/tree1_spring.png",
        sprite: { kind: "source-rect", x: 0, y: 0, width: 48, height: 96 },
        renderingMetadata: {
          kind: "wild-tree",
          seasonalTextureLocalPaths: {
            spring: "/game-assets/1.6.15/terrain/tree1_spring.png",
            summer: "/game-assets/1.6.15/terrain/tree1_summer.png",
            fall: "/game-assets/1.6.15/terrain/tree1_fall.png",
            winter: "/game-assets/1.6.15/terrain/tree1_winter.png",
          },
          leafySeasons: { spring: true, summer: true, fall: true, winter: false },
          hasMossVariant: true,
          isStumpInWinter: false,
        },
      }),
    ];
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          instanceId: 1,
          itemId: "furniture_0",
          x: 2,
          y: 2,
          layer: "item" as const,
          rotation: 1,
          footprint: { width: 1, height: 2 },
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
        {
          instanceId: 2,
          itemId: "wildtree_1",
          x: 3,
          y: 3,
          layer: "item" as const,
          rotation: 0,
          footprint: { width: 1, height: 1 },
          variant: 0,
          tintColor: "#123456",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
      ],
      nextItemId: 3,
    };

    const placementRenderEntries = createPlacementRenderEntries(
      placementSnapshot,
      catalogItems,
      "summer",
    );

    expect(placementRenderEntries).toEqual([
      expect.objectContaining({
        key: "item:1",
        effectiveFootprint: { width: 1, height: 2 },
        frame: { kind: "source-rect", x: 16, y: 0, width: 32, height: 16 },
        rotationQuarterTurns: 0,
      }),
      expect.objectContaining({
        key: "item:2",
        shouldApplySelectionTint: false,
        textureLocalPath:
          "/game-assets/1.6.15/terrain/tree_shadow.png",
      }),
      expect.objectContaining({
        key: "item:2",
        pixelGeometry: expect.objectContaining({
          positionX: 48,
          positionY: 32,
        }),
        shouldApplySelectionTint: true,
        textureLocalPath: "/game-assets/1.6.15/terrain/tree1_summer.png",
      }),
      expect.objectContaining({
        key: "item:2",
        pixelGeometry: expect.objectContaining({
          positionX: 32,
          positionY: -32,
        }),
        shouldApplySelectionTint: true,
        textureLocalPath: "/game-assets/1.6.15/terrain/tree1_summer.png",
      }),
    ]);
    expect(placementRenderEntries[1]).not.toHaveProperty("tintColor");
  });

  it("keeps FreeCactus variant zero single-layer and expands a positive variant exactly", () => {
    const catalogItem = createFreeCactusCatalogItem();
    const createSnapshot = (variant: number) => ({
      ...createEmptyPlacementSnapshot(),
      items: [createFreeCactusPlacementItem(variant)],
      nextItemId: 22,
    });

    const zeroVariantEntries = createPlacementRenderEntries(
      createSnapshot(0),
      [catalogItem],
    );
    const compositeEntries = createPlacementRenderEntries(
      createSnapshot(4375),
      [catalogItem],
    );

    expect(zeroVariantEntries).toEqual([
      expect.objectContaining({
        frame: { x: 0, y: 96, width: 16, height: 16 },
        key: "item:21",
      }),
    ]);
    expect(compositeEntries).toEqual([
      expect.objectContaining({
        frame: { x: 112, y: 96, width: 16, height: 16 },
        key: "item:21",
        pixelGeometry: expect.objectContaining({ positionX: 32, positionY: 48 }),
        shouldApplySelectionTint: true,
      }),
      expect.objectContaining({
        frame: { x: 16, y: 64, width: 16, height: 16 },
        key: "item:21",
        pixelGeometry: expect.objectContaining({ positionX: 32, positionY: 40 }),
        shouldApplySelectionTint: true,
      }),
      expect.objectContaining({
        frame: { x: 48, y: 16, width: 16, height: 16 },
        key: "item:21",
        pixelGeometry: expect.objectContaining({ positionX: 32, positionY: 24 }),
        shouldApplySelectionTint: true,
      }),
    ]);
  });

  it("preserves the frozen positive-variant formula beyond the generated range", () => {
    const catalogItem = createFreeCactusCatalogItem();
    const renderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createFreeCactusPlacementItem(9216)],
        nextItemId: 22,
      },
      [catalogItem],
    );

    expect(renderEntries.map((renderEntry) => renderEntry.frame)).toEqual([
      { x: 0, y: 96, width: 16, height: 16 },
      { x: 0, y: 48, width: 16, height: 16 },
      { x: 0, y: 48, width: 16, height: 16 },
    ]);
  });

  it("keeps old non-positive FreeCactus variants on the frozen single-layer path", () => {
    const catalogItem = createFreeCactusCatalogItem();
    const renderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createFreeCactusPlacementItem(-1)],
        nextItemId: 22,
      },
      [catalogItem],
    );

    expect(renderEntries).toHaveLength(1);
    expect(renderEntries[0]).toEqual(expect.objectContaining({
      frame: { x: 0, y: 96, width: 16, height: 16 },
    }));
  });

  it("expands Pressure into a locked attachment with the base key and tint", () => {
    const catalogItem = createSprinklerCatalogItem();
    const placementRenderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createSprinklerPlacementItem(1, "#123456")],
        nextItemId: 10,
      },
      [catalogItem],
    );

    expect(placementRenderEntries).toEqual([
      {
        key: "item:9",
        catalogItem,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 2,
        tileY: 3,
        frame: null,
        opacity: 0.5,
        pixelGeometry: {
          anchorX: 0.5,
          anchorY: 0.5,
          horizontalScale: 1,
          positionX: 40,
          positionY: 61.75,
        },
        rotationQuarterTurns: 0,
        shouldApplySelectionTint: false,
        textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
        zIndex: 7,
      },
      {
        key: "item:9",
        catalogItem,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 2,
        tileY: 3,
        frame: { x: 336, y: 400, width: 16, height: 16 },
        rotationQuarterTurns: 0,
        zIndex: 7,
      },
      {
        key: "item:9",
        catalogItem,
        effectiveFootprint: { width: 1, height: 1 },
        tileX: 2,
        tileY: 3,
        frame: { x: 64, y: 608, width: 16, height: 16 },
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 32,
          positionY: 48,
        },
        rotationQuarterTurns: 0,
        shouldApplySelectionTint: true,
        textureLocalPath:
          "/game-assets/1.6.15/tilesheets/springobjects.png",
        zIndex: 7,
      },
    ]);
  });

  it("keeps Base attachment-free and gives Enricher its exact offset in every season", () => {
    const catalogItem = createSprinklerCatalogItem();
    const createSnapshot = (variant: number) => ({
      ...createEmptyPlacementSnapshot(),
      items: [createSprinklerPlacementItem(variant)],
      nextItemId: 10,
    });

    expect(
      createPlacementRenderEntries(createSnapshot(0), [catalogItem]),
    ).toHaveLength(2);
    const springEntries = createPlacementRenderEntries(
      createSnapshot(2),
      [catalogItem],
      "spring",
    );
    const winterEntries = createPlacementRenderEntries(
      createSnapshot(2),
      [catalogItem],
      "winter",
    );

    expect(winterEntries).toEqual(springEntries);
    expect(springEntries).toHaveLength(3);
    expect(springEntries[2]).toEqual(expect.objectContaining({
      frame: { x: 32, y: 608, width: 16, height: 16 },
      pixelGeometry: expect.objectContaining({ positionX: 32, positionY: 43 }),
    }));
  });

  it("fails before returning an exact sprinkler with invalid metadata or variant", () => {
    const missingMetadataCatalogItem = {
      ...createSprinklerCatalogItem(),
      renderingMetadata: undefined,
    };
    const createSnapshot = (variant: number) => ({
      ...createEmptyPlacementSnapshot(),
      items: [createSprinklerPlacementItem(variant)],
      nextItemId: 10,
    });

    expect(() =>
      createPlacementRenderEntries(
        createSnapshot(1),
        [missingMetadataCatalogItem],
      ),
    ).toThrow(
      'Sprinkler catalog item "object:621" requires rendering metadata {"kind":"sprinkler","baseRadius":1}; received undefined.',
    );
    expect(() =>
      createPlacementRenderEntries(
        createSnapshot(3),
        [createSprinklerCatalogItem()],
      ),
    ).toThrow(
      'Sprinkler placement item "object:621" variant must be an integer from 0 through 2; received 3.',
    );
  });

  it("expands a Lit campfire into its exact base, three flames, and pulsing glow in every season", () => {
    const catalogItem = createLitBigCraftableCatalogItem("146");
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        createLitBigCraftablePlacementItem("146", 0, "#123456"),
      ],
      nextItemId: 13,
    };
    const springRenderEntries = createPlacementRenderEntries(
      placementSnapshot,
      [catalogItem],
      "spring",
    );
    const winterRenderEntries = createPlacementRenderEntries(
      placementSnapshot,
      [catalogItem],
      "winter",
    );

    expect(winterRenderEntries).toEqual(springRenderEntries);
    expect(springRenderEntries).toHaveLength(5);
    expect(springRenderEntries[0]).toEqual(expect.objectContaining({
      key: "item:12",
      frame: { x: 32, y: 576, width: 16, height: 32 },
      pixelGeometry: {
        anchorX: 0,
        anchorY: 0,
        horizontalScale: 1,
        positionX: 32,
        positionY: 32,
      },
      shouldApplySelectionTint: true,
    }));
    expect(
      springRenderEntries.slice(1, 4).map((renderEntry) => ({
        animation: renderEntry.animation,
        frame: renderEntry.frame,
        key: renderEntry.key,
        pixelGeometry: renderEntry.pixelGeometry,
        textureLocalPath: renderEntry.textureLocalPath,
        tintColor: renderEntry.tintColor,
      })),
    ).toEqual([
      {
        animation: {
          frameDurationMilliseconds: 100,
          frames: [
            { x: 276, y: 1985, width: 12, height: 11 },
            { x: 288, y: 1985, width: 12, height: 11 },
            { x: 300, y: 1985, width: 12, height: 11 },
            { x: 312, y: 1985, width: 12, height: 11 },
          ],
          kind: "frame-cycle",
          timeOffsetMilliseconds: 46,
        },
        frame: { x: 276, y: 1985, width: 12, height: 11 },
        key: "item:12",
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 35,
          positionY: 46,
          uniformScale: 0.75,
        },
        textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      },
      {
        animation: expect.objectContaining({
          kind: "frame-cycle",
          timeOffsetMilliseconds: 183,
        }),
        frame: { x: 276, y: 1985, width: 12, height: 11 },
        key: "item:12",
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 37,
          positionY: 48,
          uniformScale: 0.75,
        },
        textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      },
      {
        animation: expect.objectContaining({
          kind: "frame-cycle",
          timeOffsetMilliseconds: 320,
        }),
        frame: { x: 276, y: 1985, width: 12, height: 11 },
        key: "item:12",
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 35,
          positionY: 51,
          uniformScale: 0.75,
        },
        textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      },
    ]);
    expect(springRenderEntries[4]).toEqual(expect.objectContaining({
      animation: {
        baseScale: 0.6,
        kind: "scale-pulse",
        phaseOffsetMilliseconds: -1533,
        pulseAmplitude: 0.2,
        timeDivisorMilliseconds: 1000,
        timeModuloMilliseconds: 3140,
      },
      frame: { x: 88, y: 1779, width: 30, height: 30 },
      key: "item:12",
      opacity: 0.35,
      pixelGeometry: {
        anchorX: 0.5,
        anchorY: 0.5,
        horizontalScale: 1,
        positionX: 40,
        positionY: 48,
        uniformScale: 0.6,
      },
      textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      tintColor: "#eee8aa",
    }));
  });

  it("keeps Unlit attachment-free and renders a Lit brazier at its frozen offsets", () => {
    const catalogItem = createLitBigCraftableCatalogItem("143");
    const createSnapshot = (variant: number) => ({
      ...createEmptyPlacementSnapshot(),
      items: [createLitBigCraftablePlacementItem("143", variant)],
      nextItemId: 13,
    });

    const unlitRenderEntries = createPlacementRenderEntries(
      createSnapshot(1),
      [catalogItem],
    );
    const litRenderEntries = createPlacementRenderEntries(
      createSnapshot(0),
      [catalogItem],
    );

    expect(unlitRenderEntries).toHaveLength(1);
    expect(unlitRenderEntries[0]).toEqual(expect.objectContaining({
      frame: { x: 112, y: 544, width: 16, height: 32 },
      pixelGeometry: expect.objectContaining({ positionX: 32, positionY: 32 }),
    }));
    expect(litRenderEntries).toHaveLength(3);
    expect(litRenderEntries[1]).toEqual(expect.objectContaining({
      pixelGeometry: expect.objectContaining({
        positionX: 34,
        positionY: 34,
        uniformScale: 1,
      }),
    }));
    expect(litRenderEntries[2]).toEqual(expect.objectContaining({
      tintColor: "#eee8aa",
    }));
  });

  it("renders the exact Crab Pot water-edge position through the generic sprite path", () => {
    const mapPlacementGrid = {
      width: 3,
      height: 3,
      capabilitiesByTile: Array.from({ length: 9 }, (_unusedValue, tileIndex) => {
        const x = tileIndex % 3;
        const y = Math.floor(tileIndex / 3);
        return {
          buildable: false,
          crabPot: false,
          diggable: false,
          passable: false,
          treePlantable: false,
          treePlantableOnDirt: false,
          wall: false,
          water: new Set(["1,1", "2,1", "1,2"]).has(`${String(x)},${String(y)}`),
        };
      }),
    };
    const renderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createCrabPotPlacementItem()],
        nextItemId: 10,
      },
      [createCrabPotCatalogItem()],
      "spring",
      "standard",
      mapPlacementGrid,
    );

    expect(renderEntries).toEqual([
      expect.objectContaining({
        key: "item:9",
        zIndex: 3,
        pixelGeometry: {
          anchorX: 0,
          anchorY: 0,
          horizontalScale: 1,
          positionX: 24,
          positionY: 14,
        },
      }),
    ]);
  });

  it("leaves ordinary BigCraftables generic and fails fast for exact invalid metadata or variant", () => {
    const ordinaryBigCraftable = createCatalogItem({
      id: "big-craftable:152",
      category: "placeable",
      textureLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
      sprite: { kind: "sprite-index", index: 152 },
    });
    const ordinaryRenderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createLitBigCraftablePlacementItem("152", 0)],
        nextItemId: 13,
      },
      [ordinaryBigCraftable],
    );

    expect(ordinaryRenderEntries).toHaveLength(1);
    expect(ordinaryRenderEntries[0]).not.toHaveProperty("animation");
    expect(ordinaryRenderEntries[0]).not.toHaveProperty("pixelGeometry");
    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createLitBigCraftablePlacementItem("146", 0)],
        nextItemId: 13,
      },
      [{ ...createLitBigCraftableCatalogItem("146"), renderingMetadata: undefined }],
    )).toThrow(
      'Lit BigCraftable catalog item "big-craftable:146" requires locked rendering metadata; received undefined.',
    );
    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createLitBigCraftablePlacementItem("146", 2)],
        nextItemId: 13,
      },
      [createLitBigCraftableCatalogItem("146")],
    )).toThrow(
      'Lit BigCraftable placement item "big-craftable:146" variant must equal 0 or 1; received 2.',
    );
    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createLitBigCraftablePlacementItem("146", 0)],
        nextItemId: 13,
      },
      [{
        ...createLitBigCraftableCatalogItem("146"),
        renderingMetadata: {
          kind: "lit-big-craftable",
          flameLayers: [null],
        } as unknown as CatalogItem["renderingMetadata"],
      }],
    )).toThrow(
      'Lit BigCraftable catalog item "big-craftable:146" rendering metadata must match the locked definition; received {"kind":"lit-big-craftable","flameLayers":[null]}.',
    );
    expect(() => createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [createLitBigCraftablePlacementItem("146", 0)],
        nextItemId: 13,
      },
      [{
        ...createLitBigCraftableCatalogItem("146"),
        sprite: { kind: "sprite-index", index: 147 },
      }],
    )).toThrow(
      'Lit BigCraftable catalog item "big-craftable:146" sprite index must equal locked record ID 146; received 147.',
    );
  });

  it("renders a daytime window overlay after its furniture and omits it at night", () => {
    const windowCatalogItem = createFurnitureCatalogItem(
      "furniture_1614",
      "window",
      { width: 1, height: 2 },
      { x: 0, y: 0, width: 16, height: 32 },
      { isLongTable: false, isTable: false },
    );
    const catalogWindowMetadata = windowCatalogItem.renderingMetadata;

    if (catalogWindowMetadata?.kind !== "furniture") {
      throw new Error("Expected window furniture rendering metadata.");
    }

    const windowPlacementItem = {
      ...createHoeDirtPlacementItem(71, 5, 6, 0, "item"),
      itemId: windowCatalogItem.id,
      footprint: { width: 1, height: 2 },
    };
    const daytimeRenderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [windowPlacementItem],
        nextItemId: 72,
      },
      [{
        ...windowCatalogItem,
        renderingMetadata: {
          ...catalogWindowMetadata,
          wallMounted: true,
          isWindow: true,
        },
      }],
    );

    expect(daytimeRenderEntries).toHaveLength(2);
    expect(daytimeRenderEntries[0]).toMatchObject({
      key: "item:71",
      frame: { x: 0, y: 0, width: 16, height: 32 },
    });
    expect(daytimeRenderEntries[1]).toMatchObject({
      key: "item:71",
      frame: { x: 21, y: 1695, width: 41, height: 67 },
      textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      zIndex: 15,
      pixelGeometry: {
        anchorX: 4.75 / 41,
        anchorY: 5.5 / 67,
        horizontalScale: 1,
        positionX: 72,
        positionY: 96,
      },
      shouldApplySelectionTint: false,
    });

    expect(createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [windowPlacementItem],
        nextItemId: 72,
      },
      [{
        ...windowCatalogItem,
        renderingMetadata: {
          ...catalogWindowMetadata,
          wallMounted: true,
          isWindow: true,
        },
      }],
      "spring",
      "standard",
      undefined,
      true,
    )).toHaveLength(1);
  });
});
