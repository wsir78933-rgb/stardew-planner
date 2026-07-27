import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { tiledFlipFlags } from "../../src/tmx/decode-tile-layer-data";
import { farmhouse2Composite } from "../../src/maps/map-catalog";
import {
  composeMapTileOverlays,
  type MapTileOverlay,
} from "../../src/maps/map-tile-composition";
import { parseTmxMap } from "../../src/tmx/parse-tmx-map";
import type { TmxMap, TmxProperties } from "../../src/tmx/tmx-types";

const gameAssetsRootDirectory = path.join(
  process.cwd(),
  "public/game-assets/1.6.15",
);

beforeAll(() => {
  vi.stubGlobal("DOMParser", XmlDomParser);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

async function parseLockedMap(relativeMapPath: string): Promise<TmxMap> {
  const mapXml = await readFile(
    path.join(gameAssetsRootDirectory, relativeMapPath),
    "utf8",
  );

  return parseTmxMap(mapXml);
}

function createMap(
  width: number,
  height: number,
  firstGid: number,
  rawGids: readonly number[],
  tileDataProperties: ReadonlyMap<string, TmxProperties> = new Map(),
): TmxMap {
  return {
    width,
    height,
    tileWidth: 16,
    tileHeight: 16,
    properties: {},
    tilesets: [
      {
        firstGid,
        name: "island",
        tileWidth: 16,
        tileHeight: 16,
        tileCount: 32,
        columns: 8,
        imageSource: "island_tilesheet_1",
        imageWidth: 128,
        imageHeight: 64,
        properties: {},
        tileProperties: new Map(),
      },
    ],
    tileLayers: [
      {
        id: 1,
        name: "Back",
        width,
        height,
        visible: true,
        opacity: 1,
        offsetX: 0,
        offsetY: 0,
        properties: {},
        rawGids: Uint32Array.from(rawGids),
      },
    ],
    objectLayers: [],
    tileDataProperties,
  };
}

describe("map tile composition", () => {
  it("copies a source crop into the target while remapping matching tileset GIDs and flags", () => {
    const baseMap = createMap(4, 4, 65, Array(16).fill(0));
    const overlayMap = createMap(2, 2, 1, [1, 0, 3, tiledFlipFlags.horizontal | 4]);
    const overlays: readonly MapTileOverlay[] = [
      {
        id: "restored",
        map: overlayMap,
        sourceCrop: { x: 0, y: 0, width: 2, height: 2 },
        target: { x: 1, y: 1 },
      },
    ];

    const composedMap = composeMapTileOverlays(baseMap, overlays);

    expect(composedMap.tileLayers[0]?.rawGids).toEqual(
      Uint32Array.from([
        0, 0, 0, 0,
        0, 65, 0, 0,
        0, 67, (tiledFlipFlags.horizontal | 68) >>> 0, 0,
        0, 0, 0, 0,
      ]),
    );
    expect(baseMap.tileLayers[0]?.rawGids).toEqual(Uint32Array.from(Array(16).fill(0)));
  });

  it("fails fast when an overlay crop does not fit inside its source map", () => {
    const baseMap = createMap(4, 4, 65, Array(16).fill(0));
    const overlayMap = createMap(2, 2, 1, Array(4).fill(0));

    expect(() =>
      composeMapTileOverlays(baseMap, [
        {
          id: "invalid",
          map: overlayMap,
          sourceCrop: { x: 1, y: 0, width: 2, height: 2 },
          target: { x: 0, y: 0 },
        },
      ]),
    ).toThrow('Map tile overlay "invalid" source crop exceeds its map dimensions');
  });

  it("keeps overlay TileData out of the composite map by default", () => {
    const baseMap = createMap(4, 4, 1, Array(16).fill(0));
    const overlayMap = createMap(
      2,
      2,
      33,
      [33, 34, 35, 36],
      new Map([
        ["Back:1,1", { WallID: "OverlayWall" }],
      ]),
    );

    const composedMap = composeMapTileOverlays(baseMap, [
      {
        id: "without-tile-data",
        map: overlayMap,
        sourceCrop: { x: 1, y: 1, width: 1, height: 1 },
        target: { x: 2, y: 1 },
      },
    ]);

    expect(composedMap.tileDataProperties.has("Back:2,1")).toBe(false);
  });

  it("translates included cropped overlay TileData and lets later properties win", () => {
    const baseMap = createMap(
      4,
      4,
      1,
      Array(16).fill(0),
      new Map([
        ["Back:2,1", { Existing: "base", Shared: "base" }],
      ]),
    );
    const overlayMap = createMap(
      2,
      2,
      33,
      [33, 34, 35, 36],
      new Map<string, TmxProperties>([
        ["Back:0,0", { Ignored: "outside-source-crop" }],
        ["Back:1,1", { WallID: "OverlayWall", Shared: "overlay" }],
      ]),
    );

    const composedMap = composeMapTileOverlays(
      baseMap,
      [
        {
          id: "with-tile-data",
          map: overlayMap,
          sourceCrop: { x: 1, y: 1, width: 1, height: 1 },
          target: { x: 2, y: 1 },
        },
      ],
      { includeTileDataProperties: true },
    );

    expect(composedMap.tileDataProperties.get("Back:2,1")).toEqual({
      Existing: "base",
      Shared: "overlay",
      WallID: "OverlayWall",
    });
    expect(composedMap.tileDataProperties.has("Back:1,0")).toBe(false);
    expect(baseMap.tileDataProperties.get("Back:2,1")).toEqual({
      Existing: "base",
      Shared: "base",
    });
  });

  it("fails fast when included overlay TileData has a malformed key", () => {
    const baseMap = createMap(4, 4, 1, Array(16).fill(0));
    const overlayMap = createMap(
      2,
      2,
      33,
      [33, 34, 35, 36],
      new Map([
        ["Back:not-coordinates", { WallID: "BrokenWall" }],
      ]),
    );

    expect(() =>
      composeMapTileOverlays(
        baseMap,
        [
          {
            id: "malformed-tile-data",
            map: overlayMap,
            sourceCrop: { x: 0, y: 0, width: 2, height: 2 },
            target: { x: 0, y: 0 },
          },
        ],
        { includeTileDataProperties: true },
      ),
    ).toThrow("Back:not-coordinates");
    expect(() =>
      composeMapTileOverlays(
        baseMap,
        [
          {
            id: "malformed-tile-data",
            map: overlayMap,
            sourceCrop: { x: 0, y: 0, width: 2, height: 2 },
            target: { x: 0, y: 0 },
          },
        ],
        { includeTileDataProperties: true },
      ),
    ).toThrow("BrokenWall");
  });

  it("fails fast when included overlay TileData has a malformed property record", () => {
    const baseMap = createMap(4, 4, 1, Array(16).fill(0));
    const overlayMap = createMap(
      2,
      2,
      33,
      [33, 34, 35, 36],
      new Map([
        ["Back:0,0", null as unknown as TmxProperties],
      ]),
    );

    expect(() =>
      composeMapTileOverlays(
        baseMap,
        [
          {
            id: "malformed-tile-data-properties",
            map: overlayMap,
            sourceCrop: { x: 0, y: 0, width: 2, height: 2 },
            target: { x: 0, y: 0 },
          },
        ],
        { includeTileDataProperties: true },
      ),
    ).toThrow("Back:0,0");
    expect(() =>
      composeMapTileOverlays(
        baseMap,
        [
          {
            id: "malformed-tile-data-properties",
            map: overlayMap,
            sourceCrop: { x: 0, y: 0, width: 2, height: 2 },
            target: { x: 0, y: 0 },
          },
        ],
        { includeTileDataProperties: true },
      ),
    ).toThrow("null");
  });

  it("fails fast when included overlay TileData properties are a Map instead of a record", () => {
    const baseMap = createMap(4, 4, 1, Array(16).fill(0));
    const overlayMap = createMap(
      2,
      2,
      33,
      [33, 34, 35, 36],
      new Map([
        [
          "Back:0,0",
          new Map([["WallID", "Nursery"]]) as unknown as TmxProperties,
        ],
      ]),
    );

    expect(() =>
      composeMapTileOverlays(
        baseMap,
        [
          {
            id: "map-tile-data-properties",
            map: overlayMap,
            sourceCrop: { x: 0, y: 0, width: 2, height: 2 },
            target: { x: 0, y: 0 },
          },
        ],
        { includeTileDataProperties: true },
      ),
    ).toThrow("Back:0,0");
    expect(() =>
      composeMapTileOverlays(
        baseMap,
        [
          {
            id: "map-tile-data-properties",
            map: overlayMap,
            sourceCrop: { x: 0, y: 0, width: 2, height: 2 },
            target: { x: 0, y: 0 },
          },
        ],
        { includeTileDataProperties: true },
      ),
    ).toThrow("[object Map]");
  });

  it("translates the locked Crib FloorID into the FarmHouse2 coordinate system", async () => {
    const cribRenovation = farmhouse2Composite.renovations.find(
      (renovation) => renovation.id === "crib",
    );

    if (cribRenovation === undefined) {
      throw new Error("Locked FarmHouse2 composite must define the crib renovation.");
    }

    const [farmHouseTwo, cribMap] = await Promise.all([
      parseLockedMap("maps/FarmHouse2.tmx"),
      parseLockedMap(`maps/${cribRenovation.mapFile}`),
    ]);

    const composedMap = composeMapTileOverlays(
      farmHouseTwo,
      [
        {
          id: cribRenovation.id,
          map: cribMap,
          sourceCrop: cribRenovation.sourceCrop,
          target: cribRenovation.target,
        },
      ],
      { includeTileDataProperties: true },
    );

    expect(composedMap.tileDataProperties.get("Back:30,13")).toMatchObject({
      FloorID: "Nursery",
    });
  });
});
