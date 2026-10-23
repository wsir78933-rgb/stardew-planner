import { describe, expect, it } from "vitest";
import { createMapContainer } from "../../src/components/planner-canvas";
import type { MapRenderingContract, RenderingTileLayer } from "../../src/rendering/map-rendering-contract";
import type { MapWaterTilePosition, WaterSurfaceAnimationFrame } from "../../src/rendering/map-water-animation";

class TestMapContainer {
  readonly children: TestMapDisplayObject[] = [];
  alpha = 1;
  label = "";
  readonly position = { set: (_x: number, _y: number) => undefined };

  addChild(child: TestMapDisplayObject): TestMapDisplayObject {
    this.children.push(child);
    return child;
  }

  addChildAt(child: TestMapDisplayObject, index: number): TestMapDisplayObject {
    this.children.splice(index, 0, child);
    return child;
  }
}

class TestMapSprite {
  alpha = 1;
  label = "";
  tint = 0;
  visible = true;
  readonly anchor = { set: (_x: number, _y?: number) => undefined };
  readonly position = { set: (_x: number, _y: number) => undefined };
  readonly scale = { set: (_x: number, _y: number) => undefined };

  constructor(readonly texture: TestMapTexture) {}

  destroy(): void {}
}

class TestMapRectangle {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
  ) {}
}

class TestMapTexture {
  constructor(
    readonly options: Readonly<{
      frame?: TestMapRectangle;
      source: unknown;
    }>,
  ) {}

  get source(): unknown {
    return this.options.source;
  }

  destroy(): void {}
}

type TestMapDisplayObject = TestMapContainer | TestMapSprite;

const testPixiModule = {
  Container: TestMapContainer,
  Rectangle: TestMapRectangle,
  Sprite: TestMapSprite,
  Texture: TestMapTexture,
} as never;

function createMapLayer(name: string): RenderingTileLayer {
  return {
    name,
    width: 1,
    height: 1,
    opacity: 1,
    offsetX: 0,
    offsetY: 0,
    rawGids: new Uint32Array([0]),
  };
}

function createWaterFrames(): readonly WaterSurfaceAnimationFrame[] {
  return Array.from({ length: 10 }, (_, index) => ({
    index,
    durationMilliseconds: 200,
    sourceRectsByFlip: [
      { x: index * 64, y: 2064, width: 64, height: 64 },
      { x: index * 64, y: 2192, width: 64, height: 64 },
    ] as const,
  }));
}

function renderLayerLabels(
  layerNames: readonly string[],
): readonly string[] {
  const visibleTileLayers = layerNames.map(createMapLayer);
  const renderingContract: MapRenderingContract = {
    mapId: "water-layer-order-test",
    modId: null,
    requestedSeason: "spring",
    effectiveSeason: "spring",
    mapWidth: 1,
    mapHeight: 1,
    tileWidth: 16,
    tileHeight: 16,
    tilesets: [],
    tileAnimationsByGid: new Map(),
    waterTileGids: new Set([1]),
    visibleTileLayers,
  };
  const waterTilePosition: MapWaterTilePosition = {
    tileX: 0,
    tileY: 0,
    layerIndex: visibleTileLayers.findIndex((layer) => layer.name === "Back"),
    parity: 0,
    isTopTile: true,
    isBottomTile: true,
  };
  const waterTexture = new TestMapTexture({ source: { width: 704, height: 2256 } });
  const mapContainerResult = createMapContainer(
    testPixiModule,
    renderingContract,
    new Map(),
    {
      texture: waterTexture,
      frames: createWaterFrames(),
    } as never,
    [waterTilePosition],
  );

  const labels = mapContainerResult.mapContainer.children.map(
    (child) => child.label,
  );
  mapContainerResult.destroyFrameTextures();
  return labels;
}

describe("planner canvas water overlay layer order", () => {
  it("places Back water after all pre-Buildings layers and before Buildings and later layers", () => {
    expect(
      renderLayerLabels([
        "Back",
        "Back2",
        "Buildings",
        "Buildings1",
        "Front",
        "AlwaysFront",
      ]),
    ).toEqual([
      "mapTileLayer:Back",
      "mapTileLayer:Back2",
      "mapWaterSurfaceOverlay",
      "mapTileLayer:Buildings",
      "mapTileLayer:Buildings1",
      "mapTileLayer:Front",
      "mapTileLayer:AlwaysFront",
    ]);
  });

  it("places water after ordinary layers and before AlwaysFront when Buildings is absent", () => {
    expect(
      renderLayerLabels(["Back", "Back2", "Front", "AlwaysFront"]),
    ).toEqual([
      "mapTileLayer:Back",
      "mapTileLayer:Back2",
      "mapTileLayer:Front",
      "mapWaterSurfaceOverlay",
      "mapTileLayer:AlwaysFront",
    ]);
  });
});
