import { describe, expect, it } from "vitest";
import type {
  RenderingTileLayer,
  RenderingTileset,
} from "../../src/rendering/map-rendering-contract";
import {
  createLayerTileGeometryResolver,
  decodeTiledTileTransform,
  resolveLayerTileGeometry,
} from "../../src/rendering/map-tile-geometry";

const horizontalFlipFlag = 0x80000000;
const verticalFlipFlag = 0x40000000;
const diagonalFlipFlag = 0x20000000;

function createTestTileset(
  firstGid: number,
  tileCount: number,
  columns: number,
  imageWidth: number,
  imageHeight: number,
): RenderingTileset {
  return {
    source: "test-tilesheet",
    firstGid,
    tileWidth: 16,
    tileHeight: 16,
    imageWidth,
    imageHeight,
    columns,
    tileCount,
    assetPath: "/game-assets/1.6.15/tilesheets/test-tilesheet.png",
    usedSpringFallback: false,
  };
}

function createTestLayer(
  width: number,
  height: number,
  rawGids: Uint32Array,
): RenderingTileLayer {
  return {
    name: "Test layer",
    width,
    height,
    opacity: 1,
    offsetX: 0,
    offsetY: 0,
    rawGids,
  };
}

function toUnsignedRawGid(rawGid: number): number {
  return rawGid >>> 0;
}

describe("decodeTiledTileTransform", () => {
  it.each([
    ["ordinary", 37, 0, 1, 1],
    ["horizontal", toUnsignedRawGid(horizontalFlipFlag | 37), 0, -1, 1],
    ["vertical", toUnsignedRawGid(verticalFlipFlag | 37), 0, 1, -1],
    ["horizontal and vertical", toUnsignedRawGid(horizontalFlipFlag | verticalFlipFlag | 37), 0, -1, -1],
    ["diagonal", toUnsignedRawGid(diagonalFlipFlag | 37), Math.PI / 2, 1, -1],
    ["diagonal and horizontal", toUnsignedRawGid(diagonalFlipFlag | horizontalFlipFlag | 37), Math.PI / 2, 1, 1],
    ["diagonal and vertical", toUnsignedRawGid(diagonalFlipFlag | verticalFlipFlag | 37), -Math.PI / 2, 1, 1],
    [
      "diagonal, horizontal, and vertical",
      toUnsignedRawGid(
        diagonalFlipFlag | horizontalFlipFlag | verticalFlipFlag | 37,
      ),
      -Math.PI / 2,
      1,
      -1,
    ],
  ])(
    "applies Tiled %s flip flags in diagonal-horizontal-vertical order",
    (_, rawGid, rotationRadians, scaleX, scaleY) => {
      expect(decodeTiledTileTransform(rawGid)).toEqual({
        baseGid: 37,
        rotationRadians,
        scaleX,
        scaleY,
      });
    },
  );
});

describe("resolveLayerTileGeometry", () => {
  it("addresses the right frame from the matching tileset and preserves the layer cell position", () => {
    const resolvedTileGeometry = resolveLayerTileGeometry({
      mapId: "standard",
      mapTileWidth: 16,
      mapTileHeight: 16,
      layer: createTestLayer(3, 2, new Uint32Array([0, 0, 0, 0, 22, 0])),
      tileIndex: 4,
      tilesets: [
        createTestTileset(1, 16, 4, 64, 64),
        createTestTileset(17, 8, 4, 64, 32),
      ],
    });

    expect(resolvedTileGeometry).toEqual({
      positionX: 16,
      positionY: 16,
      frameX: 16,
      frameY: 16,
      frameWidth: 16,
      frameHeight: 16,
      tilesetIndex: 1,
      transform: {
        baseGid: 22,
        rotationRadians: 0,
        scaleX: 1,
        scaleY: 1,
      },
    });
  });

  it("uses the spouse layer width instead of a map width when resolving the final tile cell", () => {
    const spouseRoomRawGids = new Uint32Array(100 * 25);

    spouseRoomRawGids[2499] = 2;

    expect(
      resolveLayerTileGeometry({
        mapId: "farmhouse-2",
        mapTileWidth: 16,
        mapTileHeight: 16,
        layer: createTestLayer(100, 25, spouseRoomRawGids),
        tileIndex: 2499,
        tilesets: [createTestTileset(1, 16, 4, 64, 64)],
      }),
    ).toMatchObject({
      positionX: 1584,
      positionY: 384,
      frameX: 16,
      frameY: 0,
    });
  });

  it("fails before rendering when layer dimensions and raw GID length disagree", () => {
    expect(() =>
      resolveLayerTileGeometry({
        mapId: "standard",
        mapTileWidth: 16,
        mapTileHeight: 16,
        layer: createTestLayer(3, 2, new Uint32Array([1, 2, 3])),
        tileIndex: 0,
        tilesets: [createTestTileset(1, 16, 4, 64, 64)],
      }),
    ).toThrow("3x2");
  });

  it("fails before rendering when a non-empty GID is outside every tileset", () => {
    expect(() =>
      resolveLayerTileGeometry({
        mapId: "standard",
        mapTileWidth: 16,
        mapTileHeight: 16,
        layer: createTestLayer(1, 1, new Uint32Array([99])),
        tileIndex: 0,
        tilesets: [createTestTileset(1, 16, 4, 64, 64)],
      }),
    ).toThrow("99");
  });
});

describe("createLayerTileGeometryResolver", () => {
  it("uses a tileset snapshot after validating the layer once", () => {
    const observedTilesetPropertyNames: string[] = [];
    const instrumentedTileset = new Proxy(
      createTestTileset(1, 16, 4, 64, 64),
      {
        get(target, propertyName, receiver) {
          if (typeof propertyName === "string") {
            observedTilesetPropertyNames.push(propertyName);
          }

          return Reflect.get(target, propertyName, receiver);
        },
      },
    );
    const layerTileGeometryResolver = createLayerTileGeometryResolver({
      mapId: "standard",
      mapTileWidth: 16,
      mapTileHeight: 16,
      layer: createTestLayer(3, 2, new Uint32Array([1, 2, 3, 4, 5, 6])),
      tilesets: [instrumentedTileset],
    });

    observedTilesetPropertyNames.length = 0;

    expect(layerTileGeometryResolver.resolveTile(0)).toMatchObject({
      frameX: 0,
      frameY: 0,
      positionX: 0,
      positionY: 0,
    });
    expect(layerTileGeometryResolver.resolveTile(5)).toMatchObject({
      frameX: 16,
      frameY: 16,
      positionX: 32,
      positionY: 16,
    });
    expect(observedTilesetPropertyNames).toEqual([]);
  });

  it("fails fast with the map, layer, and base GID when it builds a lookup", () => {
    expect(() =>
      createLayerTileGeometryResolver({
        mapId: "farmhouse-2",
        mapTileWidth: 16,
        mapTileHeight: 16,
        layer: createTestLayer(1, 1, new Uint32Array([99])),
        tilesets: [createTestTileset(1, 16, 4, 64, 64)],
      }),
    ).toThrow(
      /99.*farmhouse-2/,
    );
  });
});
