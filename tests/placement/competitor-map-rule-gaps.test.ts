import { describe, expect, it } from "vitest";
import {
  createMapPlacementGrid,
  getMapPlacementCapabilities,
} from "../../src/placement/map-placement-grids";
import type { TmxMap, TmxProperties, TmxTileLayer } from "../../src/tmx/tmx-types";

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

function createTileset(tileset: {
  firstGid: number;
  name: string;
  imageSource: string;
  tileCount: number;
  tileProperties: ReadonlyMap<number, TmxProperties>;
}) {
  return {
    firstGid: tileset.firstGid,
    name: tileset.name,
    tileWidth: 16,
    tileHeight: 16,
    tileCount: tileset.tileCount,
    columns: tileset.tileCount,
    imageSource: tileset.imageSource,
    imageWidth: 16 * tileset.tileCount,
    imageHeight: 16,
    properties: {},
    tileProperties: tileset.tileProperties,
  };
}

function createBackAndBuildingsMap(
  width: number,
  height: number,
  tilesets: TmxMap["tilesets"],
  backGids: readonly number[],
): TmxMap {
  const tileCount = width * height;

  return {
    width,
    height,
    tileWidth: 16,
    tileHeight: 16,
    properties: {},
    tilesets,
    tileLayers: [
      createTileLayer("Back", width, height, backGids),
      createTileLayer("Buildings", width, height, new Array<number>(tileCount).fill(0)),
    ],
    objectLayers: [],
    tileDataProperties: new Map(),
  };
}

function createGrassMap(width: number, height: number): TmxMap {
  return createBackAndBuildingsMap(
    width,
    height,
    [
      createTileset({
        firstGid: 1,
        name: "grass tilesheet",
        imageSource: "test.png",
        tileCount: 1,
        tileProperties: new Map<number, TmxProperties>([
          [0, { Type: "Grass" }],
        ]),
      }),
    ],
    new Array<number>(width * height).fill(1),
  );
}

const blockedIslandNorthTile = {
  buildable: false,
  diggable: false,
  objectPlaceable: false,
  treePlantable: false,
  fruitTreePlantable: false,
} as const;

describe("competitor map rule gaps", () => {
  it("rejects wild trees and fruit trees on winery and grandpa shed floor 1 grass", () => {
    const grassMap = createGrassMap(1, 1);

    for (const mapFile of ["winery.tmx", "grandpas-shed-1.tmx"] as const) {
      expect(
        getMapPlacementCapabilities(createMapPlacementGrid(grassMap, mapFile), { x: 0, y: 0 }),
      ).toMatchObject({
        treePlantable: false,
        fruitTreePlantable: false,
      });
    }
  });

  it("rejects fruit trees on grandpa shed floor 2 grass and greenhouse grass", () => {
    const grassMap = createGrassMap(1, 1);

    expect(
      getMapPlacementCapabilities(
        createMapPlacementGrid(grassMap, "grandpas-shed-2.tmx"),
        { x: 0, y: 0 },
      ),
    ).toMatchObject({
      treePlantable: false,
      fruitTreePlantable: false,
    });
    expect(
      getMapPlacementCapabilities(
        createMapPlacementGrid(grassMap, "Greenhouse.tmx"),
        { x: 0, y: 0 },
      ).fruitTreePlantable,
    ).toBe(false);
  });

  it("requires Island West untitled tile sheet2 for diggable tiles and garden pot crops", () => {
    const islandWestMap = createBackAndBuildingsMap(
      2,
      1,
      [
        createTileset({
          firstGid: 1,
          name: "untitled tile sheet2",
          imageSource: "tilesheets/summer_outdoorsTileSheet.png",
          tileCount: 1,
          tileProperties: new Map<number, TmxProperties>([
            [0, { Diggable: "T" }],
          ]),
        }),
        createTileset({
          firstGid: 2,
          name: "untitled tile sheet3",
          imageSource: "tilesheets/summer_outdoorsTileSheet2.png",
          tileCount: 1,
          tileProperties: new Map<number, TmxProperties>([
            [0, { Diggable: "T" }],
          ]),
        }),
      ],
      [1, 2],
    );
    const placementGrid = createMapPlacementGrid(islandWestMap, "Island_W.tmx");

    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toMatchObject({
      diggable: true,
      islandGardenPotCropAllowed: true,
    });
    expect(getMapPlacementCapabilities(placementGrid, { x: 1, y: 0 })).toMatchObject({
      diggable: false,
      islandGardenPotCropAllowed: false,
    });
  });

  it("blocks Island North ban rectangles and leaves grass outside them", () => {
    const islandNorthWidth = 70;
    const islandNorthHeight = 49;
    const placementGrid = createMapPlacementGrid(
      createGrassMap(islandNorthWidth, islandNorthHeight),
      "Island_N.tmx",
    );
    const grassOutsideBans = {
      buildable: false,
      diggable: false,
      objectPlaceable: true,
      treePlantable: false,
      fruitTreePlantable: false,
    } as const;

    expect(placementGrid.width).toBeGreaterThanOrEqual(70);
    expect(placementGrid.height).toBeGreaterThanOrEqual(49);
    expect(getMapPlacementCapabilities(placementGrid, { x: 0, y: 0 })).toMatchObject(
      grassOutsideBans,
    );
    expect(getMapPlacementCapabilities(placementGrid, { x: 7, y: 47 })).toMatchObject(
      grassOutsideBans,
    );
    expect(getMapPlacementCapabilities(placementGrid, { x: 37, y: 39 })).toMatchObject(
      blockedIslandNorthTile,
    );
    expect(getMapPlacementCapabilities(placementGrid, { x: 4, y: 47 })).toMatchObject(
      blockedIslandNorthTile,
    );
    expect(getMapPlacementCapabilities(placementGrid, { x: 6, y: 48 })).toMatchObject(
      blockedIslandNorthTile,
    );
  });
});
