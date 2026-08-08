import { describe, expect, it } from "vitest";
import {
  createMapDisplayOverlayTiles,
  createPlacementCoverageOverlayRectangles,
  createResourceClumpOverlayEntries,
} from "../../src/rendering/map-display-overlays";
import { createInitialEditorDisplayOptions } from "../../src/editor/editor-display-options";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
} from "../../src/placement/placement-snapshot";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import type { TmxMap } from "../../src/tmx/tmx-types";

function createPlacementGrid(): MapPlacementGrid {
  return {
    width: 2,
    height: 2,
    capabilitiesByTile: [
      {
        buildable: true,
        crabPot: false,
        diggable: true,
        passable: true,
        treePlantable: true,
        treePlantableOnDirt: false,
        wall: false,
      },
      {
        buildable: false,
        crabPot: false,
        diggable: true,
        passable: true,
        treePlantable: true,
        treePlantableOnDirt: false,
        wall: false,
      },
      {
        buildable: true,
        crabPot: false,
        diggable: false,
        passable: true,
        treePlantable: false,
        treePlantableOnDirt: false,
        wall: false,
      },
      {
        buildable: true,
        crabPot: false,
        diggable: true,
        passable: true,
        treePlantable: false,
        treePlantableOnDirt: true,
        wall: false,
      },
    ],
  };
}

function createMapWithResourceClumpTiles(): TmxMap {
  return {
    width: 3,
    height: 2,
    tileWidth: 16,
    tileHeight: 16,
    properties: {},
    tilesets: [
      {
        firstGid: 65,
        name: "Paths",
        tileWidth: 16,
        tileHeight: 16,
        tileCount: 128,
        columns: 16,
        imageSource: "Maps/springobjects.png",
        imageWidth: 256,
        imageHeight: 128,
        properties: {},
        tileProperties: new Map(),
      },
    ],
    tileLayers: [
      {
        id: 1,
        name: "Paths",
        width: 3,
        height: 2,
        visible: true,
        opacity: 1,
        offsetX: 0,
        offsetY: 0,
        properties: {},
        rawGids: new Uint32Array([84, 85, 86, 0, 83, 87]),
      },
    ],
    objectLayers: [],
    tileDataProperties: new Map(),
  };
}

function createPlacementItem(
  instanceId: number,
  itemId: string,
  x: number,
  y: number,
  variant = 0,
): PlacementItem {
  return {
    instanceId,
    itemId,
    x,
    y,
    layer: "item",
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

describe("map display overlays", () => {
  it("marks only blocked map capabilities selected by the View options", () => {
    const displayOptions = {
      ...createInitialEditorDisplayOptions(),
      showBuildableTiles: true,
      showCropTiles: true,
      showTreeTiles: true,
    };

    expect(
      createMapDisplayOverlayTiles(createPlacementGrid(), displayOptions),
    ).toEqual([
      { kind: "blocked-buildings", x: 1, y: 0 },
      { kind: "blocked-crops", x: 0, y: 1 },
      { kind: "blocked-trees", x: 0, y: 1 },
    ]);
  });

  it("creates source-shaped coverage rectangles for placed sprinklers and scarecrows", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem(1, "object:621", 10, 20),
        createPlacementItem(2, "big-craftable:8", 30, 40),
      ],
      nextItemId: 3,
    };
    const displayOptions = {
      ...createInitialEditorDisplayOptions(),
      showScarecrowRadius: true,
      showSprinklerRadius: true,
    };

    expect(
      createPlacementCoverageOverlayRectangles(placementSnapshot, displayOptions),
    ).toEqual([
      {
        color: 0x3db4ff,
        height: 1,
        width: 1,
        x: 9,
        y: 19,
      },
      { color: 0x3db4ff, height: 1, width: 1, x: 10, y: 19 },
      { color: 0x3db4ff, height: 1, width: 1, x: 11, y: 19 },
      { color: 0x3db4ff, height: 1, width: 1, x: 9, y: 20 },
      { color: 0x3db4ff, height: 1, width: 1, x: 11, y: 20 },
      { color: 0x3db4ff, height: 1, width: 1, x: 9, y: 21 },
      { color: 0x3db4ff, height: 1, width: 1, x: 10, y: 21 },
      { color: 0x3db4ff, height: 1, width: 1, x: 11, y: 21 },
      {
        color: 0xf6cf4a,
        height: 17,
        width: 17,
        x: 22,
        y: 32,
      },
    ]);
  });

  it("deduplicates exact sprinkler coverage tiles across placed sprinklers", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        createPlacementItem(1, "object:599", 10, 10),
        createPlacementItem(2, "object:599", 10, 12),
      ],
      nextItemId: 3,
    };
    const displayOptions = {
      ...createInitialEditorDisplayOptions(),
      showSprinklerRadius: true,
    };

    expect(
      createPlacementCoverageOverlayRectangles(placementSnapshot, displayOptions),
    ).toEqual([
      { color: 0x3db4ff, height: 1, width: 1, x: 10, y: 9 },
      { color: 0x3db4ff, height: 1, width: 1, x: 10, y: 11 },
      { color: 0x3db4ff, height: 1, width: 1, x: 9, y: 10 },
      { color: 0x3db4ff, height: 1, width: 1, x: 11, y: 10 },
      { color: 0x3db4ff, height: 1, width: 1, x: 10, y: 13 },
      { color: 0x3db4ff, height: 1, width: 1, x: 9, y: 12 },
      { color: 0x3db4ff, height: 1, width: 1, x: 11, y: 12 },
    ]);
  });

  it("omits sprinkler tiles when the persistent display option is disabled", () => {
    expect(
      createPlacementCoverageOverlayRectangles(
        {
          ...createEmptyPlacementSnapshot(),
          items: [createPlacementItem(1, "object:645", 10, 10, 1)],
          nextItemId: 2,
        },
        createInitialEditorDisplayOptions(),
      ),
    ).toEqual([]);
  });

  it("preserves scarecrow, Bee House, and Junimo Hut coverage rectangles", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [
        { instanceId: 1, buildingId: "Junimo Hut", x: 70, y: 80 },
      ],
      items: [
        createPlacementItem(1, "big-craftable:8", 30, 40),
        createPlacementItem(2, "big-craftable:10", 50, 60),
      ],
      nextBuildingId: 2,
      nextItemId: 3,
    };
    const displayOptions = {
      ...createInitialEditorDisplayOptions(),
      showScarecrowRadius: true,
      showBeeHouseRadius: true,
      showJunimoHutRadius: true,
    };

    expect(
      createPlacementCoverageOverlayRectangles(placementSnapshot, displayOptions),
    ).toEqual([
      { color: 0xf6cf4a, height: 17, width: 17, x: 22, y: 32 },
      { color: 0xf078c4, height: 11, width: 11, x: 45, y: 55 },
      { color: 0x6bcf78, height: 17, width: 17, x: 63, y: 73 },
    ]);
  });

  it("identifies only the source resource-clump spawn tiles from the Paths layer", () => {
    expect(createResourceClumpOverlayEntries(createMapWithResourceClumpTiles())).toEqual([
      {
        kind: "large-log",
        parentSheetIndex: 602,
        sourceX: 32,
        sourceY: 400,
        x: 0,
        y: 0,
      },
      {
        kind: "large-boulder",
        parentSheetIndex: 672,
        sourceX: 0,
        sourceY: 448,
        x: 1,
        y: 0,
      },
      {
        kind: "large-stump",
        parentSheetIndex: 600,
        sourceX: 0,
        sourceY: 400,
        x: 2,
        y: 0,
      },
    ]);
  });
});
