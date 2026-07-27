import { describe, expect, it } from "vitest";
import {
  createMapPlacementGrid,
  getMapPlacementCapabilities,
  isTmxPropertyTruthy,
} from "../../src/placement/map-placement-grids";
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
      crabPot: false,
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
      crabPot: false,
    });
    expect(getMapPlacementCapabilities(placementGrid, { x: 2, y: 0 })).toEqual({
      buildable: true,
      diggable: true,
      passable: true,
      treePlantable: true,
      treePlantableOnDirt: false,
      crabPot: false,
    });
  });

  it("fails with the requested coordinate when capabilities are read outside the map", () => {
    const placementGrid = createMapPlacementGrid(createPlacementTestMap());

    expect(() =>
      getMapPlacementCapabilities(placementGrid, { x: 3, y: 0 }),
    ).toThrow('x "3"');
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

  it("keeps whitespace-wrapped false property values truthy, matching the original map rule", () => {
    expect(isTmxPropertyTruthy(undefined)).toBe(false);
    expect(isTmxPropertyTruthy("")).toBe(false);
    expect(isTmxPropertyTruthy("false")).toBe(false);
    expect(isTmxPropertyTruthy(" false ")).toBe(true);
    expect(isTmxPropertyTruthy("F")).toBe(false);
    expect(isTmxPropertyTruthy("T")).toBe(true);
  });
});
