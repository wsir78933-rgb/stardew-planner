import { describe, expect, it, vi } from "vitest";
import { tiledFlipFlags } from "../../src/tmx/decode-tile-layer-data";
import type {
  MapRenderingContract,
  RenderingTileLayer,
} from "../../src/rendering/map-rendering-contract";
import {
  createMapWaterAnimationUpdate,
  createMapWaterTilePositions,
  getMapWaterSurfaceFrameState,
  getMapWaterSeasonTint,
  type WaterSurfaceAnimationFrame,
} from "../../src/rendering/map-water-animation";

function createWaterSurfaceFrames(): readonly WaterSurfaceAnimationFrame[] {
  return Array.from({ length: 10 }, (_, frameIndex) => ({
    index: frameIndex,
    durationMilliseconds: 200,
    sourceRectsByFlip: [
      { x: frameIndex * 64, y: 2064, width: 64, height: 64 },
      { x: frameIndex * 64, y: 2192, width: 64, height: 64 },
    ] as const,
  }));
}

function createTileLayer(
  name: string,
  width: number,
  height: number,
  rawGids: Uint32Array,
): RenderingTileLayer {
  return {
    name,
    width,
    height,
    opacity: 1,
    offsetX: 0,
    offsetY: 0,
    rawGids,
  };
}

function createMapRenderingContract(
  visibleTileLayers: readonly RenderingTileLayer[],
  waterTileGids: ReadonlySet<number>,
): MapRenderingContract {
  return {
    mapId: "test-map",
    modId: null,
    requestedSeason: "spring",
    effectiveSeason: "spring",
    mapWidth: 4,
    mapHeight: 3,
    tileWidth: 16,
    tileHeight: 16,
    tilesets: [],
    tileAnimationsByGid: new Map(),
    waterTileGids,
    visibleTileLayers,
  };
}

describe("map water animation", () => {
  it("uses the competitor's seasonal water colors", () => {
    expect(getMapWaterSeasonTint("spring")).toBe(0x78c8ff);
    expect(getMapWaterSeasonTint("summer")).toBe(0x3cf0ff);
    expect(getMapWaterSeasonTint("fall")).toBe(0xff82c8);
    expect(getMapWaterSeasonTint("winter")).toBe(0x8250ff);
  });

  it("finds Back-layer Water GIDs after flip flags and ignores upper-layer markers", () => {
    const baseLayer = createTileLayer(
      "Back",
      4,
      3,
      new Uint32Array([
        0, 5, 0, 0,
        0, tiledFlipFlags.horizontal + 5, 0, 0,
        0, 5, 0, 0,
      ]),
    );
    const buildingsLayer = createTileLayer(
      "Buildings",
      4,
      3,
      new Uint32Array([
        0, 0, 0, 5,
        0, 5, 0, 0,
        0, 0, 0, 0,
      ]),
    );
    const alwaysFrontLayer = createTileLayer(
      "AlwaysFront",
      4,
      3,
      new Uint32Array([
        5, 0, 0, 0,
        0, 5, 0, 0,
        0, 0, 0, 0,
      ]),
    );

    expect(
      createMapWaterTilePositions(
        createMapRenderingContract(
          [baseLayer, buildingsLayer, alwaysFrontLayer],
          new Set([5]),
        ),
      ),
    ).toEqual([
      {
        tileX: 1,
        tileY: 0,
        layerIndex: 0,
        parity: 1,
        isTopTile: true,
        isBottomTile: false,
      },
      {
        tileX: 1,
        tileY: 1,
        layerIndex: 0,
        parity: 0,
        isTopTile: false,
        isBottomTile: false,
      },
      {
        tileX: 1,
        tileY: 2,
        layerIndex: 0,
        parity: 1,
        isTopTile: false,
        isBottomTile: true,
      },
    ]);
  });

  it("uses 200ms atlas frames and clips top and bottom shoreline slices", () => {
    const waterSurfaceFrames = createWaterSurfaceFrames();
    const shorelineTile = {
      tileX: 1,
      tileY: 2,
      layerIndex: 0,
      parity: 1,
      isTopTile: true,
      isBottomTile: true,
    } as const;

    expect(
      getMapWaterSurfaceFrameState(shorelineTile, waterSurfaceFrames, 0, 16),
    ).toMatchObject({
      frameIndex: 0,
      phaseIndex: 1,
      textureRect: { x: 0, y: 2192, width: 64, height: 64 },
      fillTextureRect: null,
      tileOffsetY: 0,
      fillOffsetY: 16,
      fillVisible: false,
    });
    expect(
      getMapWaterSurfaceFrameState(shorelineTile, waterSurfaceFrames, 667, 16),
    ).toMatchObject({
      frameIndex: 3,
      phaseIndex: 1,
      textureRect: { x: 192, y: 2196, width: 64, height: 60 },
      fillTextureRect: { x: 192, y: 2064, width: 64, height: 4 },
      tileOffsetY: 0,
      fillOffsetY: 15,
      fillVisible: true,
    });
    expect(
      getMapWaterSurfaceFrameState(shorelineTile, waterSurfaceFrames, 10_667, 16),
    ).toMatchObject({
      frameIndex: 3,
      phaseIndex: 0,
      textureRect: { x: 192, y: 2064, width: 64, height: 64 },
      fillTextureRect: null,
      fillVisible: false,
    });
  });

  it("applies shared frame states once per water style and reports visual changes", () => {
    const waterTilePositions = [
      { tileX: 0, tileY: 0, layerIndex: 0, parity: 0, isTopTile: false, isBottomTile: false },
      { tileX: 2, tileY: 0, layerIndex: 0, parity: 0, isTopTile: false, isBottomTile: false },
    ] as const;
    const applyFrameState = vi.fn();
    const waterAnimationUpdate = createMapWaterAnimationUpdate(
      waterTilePositions,
      createWaterSurfaceFrames(),
      16,
      applyFrameState,
      "test-map",
    );

    expect(waterAnimationUpdate.update(0)).toBe(true);
    expect(applyFrameState).toHaveBeenCalledTimes(2);
    expect(waterAnimationUpdate.update(100)).toBe(false);
    expect(applyFrameState).toHaveBeenCalledTimes(2);
    expect(waterAnimationUpdate.update(200)).toBe(true);
    expect(applyFrameState).toHaveBeenCalledTimes(4);
  });

  it("rejects water textures outside the verified 10-frame, 200ms layout", () => {
    expect(() =>
      getMapWaterSurfaceFrameState(
        {
          tileX: 0,
          tileY: 0,
          layerIndex: 0,
          parity: 0,
          isTopTile: false,
          isBottomTile: false,
        },
        createWaterSurfaceFrames().slice(1),
        0,
        16,
      ),
    ).toThrow(/must contain exactly 10 frames/);
  });
});
