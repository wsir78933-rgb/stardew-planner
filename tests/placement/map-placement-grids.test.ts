import { describe, expect, it } from "vitest";
import {
  createMapPlacementGrid,
  getMapPlacementCapabilities,
  isTmxPropertyTruthy,
} from "../../src/placement/map-placement-grids";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import { validatePlacement } from "../../src/placement/placement-validation";
import { tiledFlipFlags } from "../../src/tmx/decode-tile-layer-data";
import type { TmxMap, TmxProperties, TmxTileLayer } from "../../src/tmx/tmx-types";

function createPlacementTestMap(overrides: Partial<TmxMap> = {}): TmxMap {
  return {
    width: 3,
    height: 1,
    tileWidth: 16,
    tileHeight: 16,
    properties: {},
    tilesets: [
      {
        firstGid: 1,
        name: "test tilesheet",
        tileWidth: 16,
        tileHeight: 16,
        tileCount: 3,
        columns: 3,
        imageSource: "test.png",
        imageWidth: 48,
        imageHeight: 16,
        properties: {},
        tileProperties: new Map<number, TmxProperties>([
          [0, { Buildable: "T", Diggable: "T" }],
          [1, { Buildable: "T", Water: "T" }],
          [2, { Buildable: "T", Diggable: "T" }],
        ]),
      },
    ],
    tileLayers: [
      {
        id: null,
        name: "Back",
        width: 3,
        height: 1,
        visible: true,
        opacity: 1,
        offsetX: 0,
        offsetY: 0,
        properties: {},
        rawGids: new Uint32Array([1 + tiledFlipFlags.horizontal, 2, 3]),
      },
      {
        id: null,
        name: "Buildings",
        width: 3,
        height: 1,
        visible: true,
        opacity: 1,
        offsetX: 0,
        offsetY: 0,
        properties: {},
        rawGids: new Uint32Array([0, 1, 0]),
      },
    ],
    objectLayers: [],
    tileDataProperties: new Map([
      ["Back:0,0", { Buildable: "f" }],
    ]),
    ...overrides,
  };
}

function createTileLayer(
  name: string,
  width: number,
  height: number,
  rawGids: readonly number[],
): TmxTileLayer {
  return {
    id: null,
    name,
    width,
    height,
    visible: true,
    opacity: 1,
    offsetX: 0,
    offsetY: 0,
    properties: {},
    rawGids: new Uint32Array(rawGids),
  };
}

function createCrabPotTestMap(overrides: Partial<TmxMap> = {}): TmxMap {
  return {
    width: 3,
    height: 3,
    tileWidth: 16,
    tileHeight: 16,
    properties: {},
    tilesets: [
      {
        firstGid: 1,
        name: "crab-pot tilesheet",
        tileWidth: 16,
        tileHeight: 16,
        tileCount: 3,
        columns: 3,
        imageSource: "test.png",
        imageWidth: 48,
        imageHeight: 16,
        properties: {},
        tileProperties: new Map<number, TmxProperties>([
          [0, { Buildable: "T" }],
          [1, { Water: "T" }],
          [2, { Passable: "T" }],
        ]),
      },
    ],
    tileLayers: [
      createTileLayer("Back", 3, 3, [
        1, 1, 1,
        2, 2, 2,
        1, 1, 1,
      ]),
      createTileLayer("Buildings", 3, 3, new Array<number>(9).fill(0)),
    ],
    objectLayers: [],
    tileDataProperties: new Map(),
    ...overrides,
  };
}

describe("createMapPlacementGrid", () => {
  it("uses merged Back TileData only for buildability while crop diggability stays tileset-based", () => {
    const placementGrid = createMapPlacementGrid(createPlacementTestMap());

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toEqual({
      buildable: false,
      diggable: true,
      passable: true,
      treePlantable: true,
      treePlantableOnDirt: false,
      fruitTreePlantable: true,
      fruitTreesRestricted: false,
      objectPlaceable: true,
      noFurniture: false,
      water: false,
      crabPot: false,
      wall: false,
    });
  });

  it("rejects water and Buildings layer occupancy for the appropriate capabilities", () => {
    const placementGrid = createMapPlacementGrid(createPlacementTestMap());

    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 0 })).toEqual({
      buildable: false,
      diggable: false,
      passable: false,
      treePlantable: false,
      treePlantableOnDirt: false,
      fruitTreePlantable: false,
      fruitTreesRestricted: false,
      objectPlaceable: false,
      noFurniture: false,
      water: true,
      crabPot: false,
      wall: false,
    });
    expect(getMapPlacementCapabilities(placementGrid, { x: 2, y: 0 })).toEqual({
      buildable: true,
      diggable: true,
      passable: true,
      treePlantable: true,
      treePlantableOnDirt: false,
      fruitTreePlantable: true,
      fruitTreesRestricted: false,
      objectPlaceable: true,
      noFurniture: false,
      water: false,
      crabPot: false,
      wall: false,
    });
  });

  it("marks only Back TileData WallID anchors as wall tiles", () => {
    const placementGrid = createMapPlacementGrid(
      createPlacementTestMap({
        tileDataProperties: new Map<string, TmxProperties>([
          ["Back:1,0", { WallID: "Kitchen" }],
          ["Buildings:2,0", { WallID: "IgnoredBuildingsWall" }],
        ]),
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 }).wall).toBe(false);
    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 0 }).wall).toBe(true);
    expect(getMapPlacementCapabilities(placementGrid, { x: 2, y: 0 }).wall).toBe(false);
  });

  it("fails with the requested coordinate when capabilities are read outside the map", () => {
    const placementGrid = createMapPlacementGrid(createPlacementTestMap());

    expect(() =>
      getMapPlacementCapabilities(placementGrid, { x: 3, y: 0 }),
    ).toThrow('x "3"');
  });

  it("rejects a placement grid capability with a missing wall flag", () => {
    const placementGrid = {
      width: 1,
      height: 1,
      capabilitiesByTile: [{
        buildable: true,
        crabPot: false,
        diggable: true,
        passable: true,
        treePlantable: false,
        treePlantableOnDirt: false,
      }],
    } as unknown as ReturnType<typeof createMapPlacementGrid>;

    expect(() => getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toThrow(
      "wall",
    );
  });

  it("uses the original crab-pot water corridor and adjacent land rule", () => {
    const placementGrid = createMapPlacementGrid(createCrabPotTestMap());

    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 1 })).toMatchObject({
      crabPot: true,
    });
  });

  it("treats a Dirt tile type as dirt for dirt-only tree placement", () => {
    const placementGrid = createMapPlacementGrid(
      createPlacementTestMap({
        tilesets: [
          {
            firstGid: 1,
            name: "tree tilesheet",
            tileWidth: 16,
            tileHeight: 16,
            tileCount: 3,
            columns: 3,
            imageSource: "test.png",
            imageWidth: 48,
            imageHeight: 16,
            properties: {},
            tileProperties: new Map<number, TmxProperties>([
              [0, { Type: "Dirt", Diggable: "T" }],
            ]),
          },
        ],
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toMatchObject({
      treePlantable: true,
      treePlantableOnDirt: true,
    });
  });

  it("allows a crab pot when its only passable adjacent tile is a Buildings Passable tile", () => {
    const placementGrid = createMapPlacementGrid(
      createCrabPotTestMap({
        tileLayers: [
          createTileLayer("Back", 3, 3, [
            0, 0, 0,
            2, 2, 2,
            0, 0, 0,
          ]),
          createTileLayer("Buildings", 3, 3, [
            3, 0, 0,
            0, 0, 0,
            0, 0, 0,
          ]),
        ],
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 1 })).toMatchObject({
      crabPot: true,
    });
  });

  it("lets TileData NoSpawn block tree placement even when CanPlantTrees is set", () => {
    const placementGrid = createMapPlacementGrid(
      createPlacementTestMap({
        tileDataProperties: new Map<string, TmxProperties>([
          ["Back:0,0", { NoSpawn: "trees", CanPlantTrees: "T" }],
        ]),
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toMatchObject({
      treePlantable: false,
      treePlantableOnDirt: false,
    });
  });

  it("lets CanPlantTrees override a tileset NoSpawn tree value", () => {
    const placementGrid = createMapPlacementGrid(
      createPlacementTestMap({
        tilesets: [
          {
            firstGid: 1,
            name: "tree tilesheet",
            tileWidth: 16,
            tileHeight: 16,
            tileCount: 3,
            columns: 3,
            imageSource: "test.png",
            imageWidth: 48,
            imageHeight: 16,
            properties: {},
            tileProperties: new Map<number, TmxProperties>([
              [0, { NoSpawn: "tree", CanPlantTrees: "T" }],
            ]),
          },
        ],
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toMatchObject({
      treePlantable: true,
      treePlantableOnDirt: true,
    });
  });

  it("ignores TileData Water and Buildings Passable for passability and crab pots", () => {
    const placementGrid = createMapPlacementGrid(
      createCrabPotTestMap({
        tileLayers: [
          createTileLayer("Back", 3, 3, [
            1, 1, 1,
            2, 2, 2,
            1, 1, 1,
          ]),
          createTileLayer("Buildings", 3, 3, [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0,
          ]),
        ],
        tileDataProperties: new Map<string, TmxProperties>([
          ["Back:0,0", { Water: "T" }],
          ["Buildings:1,1", { Passable: "T" }],
        ]),
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toMatchObject({
      passable: true,
    });
    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 1 })).toMatchObject({
      crabPot: true,
    });
  });

  it("rejects crab pots on a Buildings Passable water tile", () => {
    const placementGrid = createMapPlacementGrid(
      createCrabPotTestMap({
        tileLayers: [
          createTileLayer("Back", 3, 3, [
            1, 1, 1,
            2, 2, 2,
            1, 1, 1,
          ]),
          createTileLayer("Buildings", 3, 3, [
            0, 0, 0,
            0, 3, 0,
            0, 0, 0,
          ]),
        ],
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 1 })).toMatchObject({
      crabPot: false,
    });
  });

  it("allows crab pots in a vertical water corridor", () => {
    const placementGrid = createMapPlacementGrid(
      createCrabPotTestMap({
        tileLayers: [
          createTileLayer("Back", 3, 3, [
            1, 2, 1,
            1, 2, 1,
            1, 2, 1,
          ]),
          createTileLayer("Buildings", 3, 3, new Array<number>(9).fill(0)),
        ],
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 1 })).toMatchObject({
      crabPot: true,
    });
  });

  it("rejects crab pots outside a continuous water corridor", () => {
    const placementGrid = createMapPlacementGrid(
      createCrabPotTestMap({
        tileLayers: [
          createTileLayer("Back", 3, 3, [
            1, 1, 1,
            2, 2, 1,
            1, 1, 1,
          ]),
          createTileLayer("Buildings", 3, 3, new Array<number>(9).fill(0)),
        ],
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 1 })).toMatchObject({
      crabPot: false,
    });
  });

  it("rejects crab pots without an adjacent passable tile", () => {
    const placementGrid = createMapPlacementGrid(
      createCrabPotTestMap({
        tileLayers: [
          createTileLayer("Back", 3, 3, [
            0, 0, 0,
            2, 2, 2,
            0, 0, 0,
          ]),
          createTileLayer("Buildings", 3, 3, new Array<number>(9).fill(0)),
        ],
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 1 })).toMatchObject({
      crabPot: false,
    });
  });

  it("keeps ordinary objects off Buildings-layer tiles, NoFurniture tiles, and the farm-cave mouth", () => {
    const placementGrid = createMapPlacementGrid(
      createPlacementTestMap({
        properties: { Warp: "2 0 FarmCave 8 11" },
        tilesets: [
          {
            firstGid: 1,
            name: "object tilesheet",
            tileWidth: 16,
            tileHeight: 16,
            tileCount: 3,
            columns: 3,
            imageSource: "test.png",
            imageWidth: 48,
            imageHeight: 16,
            properties: {},
            tileProperties: new Map<number, TmxProperties>([
              [0, { NoFurniture: "f" }],
              [1, { Passable: "T" }],
              [2, { Buildable: "T" }],
            ]),
          },
        ],
        tileLayers: [
          createTileLayer("Back", 3, 1, [1, 1, 3]),
          createTileLayer("Buildings", 3, 1, [0, 2, 0]),
        ],
        tileDataProperties: new Map(),
      }),
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toMatchObject({
      noFurniture: true,
      objectPlaceable: true,
      passable: true,
    });
    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 0 })).toMatchObject({
      objectPlaceable: false,
      passable: true,
    });
    expect(getMapPlacementCapabilities(placementGrid, { x: 2, y: 0 })).toMatchObject({
      objectPlaceable: false,
      passable: true,
    });
  });

  it("uses farm, greenhouse, and off-farm tree masks when the map file is known", () => {
    const grassMap = createPlacementTestMap({
      tilesets: [
        {
          firstGid: 1,
          name: "grass tilesheet",
          tileWidth: 16,
          tileHeight: 16,
          tileCount: 1,
          columns: 1,
          imageSource: "test.png",
          imageWidth: 16,
          imageHeight: 16,
          properties: {},
          tileProperties: new Map<number, TmxProperties>([
            [0, { Type: "Grass" }],
          ]),
        },
      ],
      tileLayers: [
        createTileLayer("Back", 3, 1, [1, 1, 1]),
        createTileLayer("Buildings", 3, 1, [0, 0, 0]),
      ],
      tileDataProperties: new Map(),
    });

    expect(
      getMapPlacementCapabilities(createMapPlacementGrid(grassMap, "BusStop.tmx"), { x: 0, y: 0 }),
    ).toMatchObject({
      treePlantable: false,
      fruitTreePlantable: false,
      fruitTreesRestricted: false,
    });
    expect(
      getMapPlacementCapabilities(createMapPlacementGrid(grassMap, "Farm.tmx"), { x: 0, y: 0 }),
    ).toMatchObject({
      treePlantable: true,
      fruitTreePlantable: true,
      fruitTreesRestricted: true,
    });
    expect(
      getMapPlacementCapabilities(createMapPlacementGrid(grassMap, "Greenhouse.tmx"), { x: 0, y: 0 }),
    ).toMatchObject({
      treePlantable: false,
      fruitTreePlantable: false,
      fruitTreesRestricted: false,
    });
  });

  it("lets farm fruit trees use diggable or stone tiles that block ordinary trees", () => {
    const placementGrid = createMapPlacementGrid(
      createPlacementTestMap({
        tilesets: [
          {
            firstGid: 1,
            name: "fruit tilesheet",
            tileWidth: 16,
            tileHeight: 16,
            tileCount: 2,
            columns: 2,
            imageSource: "test.png",
            imageWidth: 32,
            imageHeight: 16,
            properties: {},
            tileProperties: new Map<number, TmxProperties>([
              [0, { Diggable: "T", NoSpawn: "All", Type: "Dirt" }],
              [1, { Type: "Wood" }],
            ]),
          },
        ],
        tileLayers: [
          createTileLayer("Back", 3, 1, [1, 2, 1]),
          createTileLayer("Buildings", 3, 1, [0, 0, 0]),
        ],
        tileDataProperties: new Map(),
      }),
      "Farm.tmx",
    );

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toMatchObject({
      fruitTreePlantable: true,
      treePlantable: false,
    });
    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 0 })).toMatchObject({
      fruitTreePlantable: false,
      treePlantable: true,
    });
  });

  it("rejects Ginger Island diggable tiles that are not on the outdoors sheet", () => {
    const islandMap = createPlacementTestMap({
      tilesets: [
        {
          firstGid: 1,
          name: "island tilesheet",
          tileWidth: 16,
          tileHeight: 16,
          tileCount: 2,
          columns: 2,
          imageSource: "island_tilesheet_1.png",
          imageWidth: 32,
          imageHeight: 16,
          properties: {},
          tileProperties: new Map<number, TmxProperties>([
            [0, { Diggable: "T" }],
            [1, { Diggable: "T" }],
          ]),
        },
        {
          firstGid: 3,
          name: "outdoors",
          tileWidth: 16,
          tileHeight: 16,
          tileCount: 1,
          columns: 1,
          imageSource: "spring_outdoorsTileSheet.png",
          imageWidth: 16,
          imageHeight: 16,
          properties: {},
          tileProperties: new Map<number, TmxProperties>([
            [0, { Diggable: "T" }],
          ]),
        },
      ],
      tileLayers: [
        createTileLayer("Back", 3, 1, [1, 3, 1]),
        createTileLayer("Buildings", 3, 1, [0, 0, 0]),
      ],
      tileDataProperties: new Map(),
    });

    expect(
      getMapPlacementCapabilities(createMapPlacementGrid(islandMap, "Island_W.tmx"), { x: 0, y: 0 }).diggable,
    ).toBe(false);
    expect(
      getMapPlacementCapabilities(createMapPlacementGrid(islandMap, "Island_W.tmx"), { x: 1, y: 0 }).diggable,
    ).toBe(true);
    expect(
      getMapPlacementCapabilities(createMapPlacementGrid(islandMap), { x: 0, y: 0 }).diggable,
    ).toBe(true);
  });

  it("lets greenhouse fruit trees use non-diggable stone while wild trees cannot", () => {
    const stoneMap = createPlacementTestMap({
      tilesets: [
        {
          firstGid: 1,
          name: "stone tilesheet",
          tileWidth: 16,
          tileHeight: 16,
          tileCount: 1,
          columns: 1,
          imageSource: "test.png",
          imageWidth: 16,
          imageHeight: 16,
          properties: {},
          tileProperties: new Map<number, TmxProperties>([
            [0, { Type: "Stone" }],
          ]),
        },
      ],
      tileLayers: [
        createTileLayer("Back", 3, 1, [1, 1, 1]),
        createTileLayer("Buildings", 3, 1, [0, 0, 0]),
      ],
      tileDataProperties: new Map(),
    });
    const placementSnapshot = createEmptyPlacementSnapshot();

    for (const mapFile of ["Greenhouse.tmx", "grandpas-shed-2.tmx"] as const) {
      const mapPlacementGrid = createMapPlacementGrid(stoneMap, mapFile);

      expect(getMapPlacementCapabilities(mapPlacementGrid, { x: 0, y: 0 })).toMatchObject({
        diggable: false,
        treePlantable: false,
        fruitTreePlantable: true,
      });
      expect(validatePlacement({
        mapPlacementGrid,
        placementSnapshot,
        buildingMetadataById: {},
        candidate: {
          kind: "item",
          item: {
            itemId: "wildtree_1",
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
          },
        },
      })).toEqual({
        valid: false,
        reason: "not-passable",
        tile: { x: 0, y: 0 },
      });
      expect(validatePlacement({
        mapPlacementGrid,
        placementSnapshot,
        buildingMetadataById: {},
        candidate: {
          kind: "item",
          item: {
            itemId: "fruittree_628",
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
          },
        },
      })).toEqual({ valid: true });
    }
  });

  it("rejects a map file that is not a tmx name", () => {
    expect(() => createMapPlacementGrid(createPlacementTestMap(), "Farm")).toThrow(
      'received "Farm"',
    );
  });

  it("keeps whitespace-wrapped false property values truthy, matching the original map rule", () => {
    expect(isTmxPropertyTruthy(undefined)).toBe(false);
    expect(isTmxPropertyTruthy("")).toBe(false);
    expect(isTmxPropertyTruthy("false")).toBe(false);
    expect(isTmxPropertyTruthy(" false ")).toBe(true);
    expect(isTmxPropertyTruthy("F")).toBe(false);
    expect(isTmxPropertyTruthy("T")).toBe(true);
  });
});
