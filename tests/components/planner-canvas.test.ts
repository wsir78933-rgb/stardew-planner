import { describe, expect, it } from "vitest";
import * as plannerCanvasModule from "../../src/components/planner-canvas";
import type { CameraGeometry, CameraState } from "../../src/rendering/camera-state";
import type { RenderingTileset } from "../../src/rendering/map-rendering-contract";
import { getMapTileAtPointer } from "../../src/placement/map-pointer-tile";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import { interiorWallpaperPatterns } from "../../src/interior-decor/interior-decor-catalog";
import type { TmxMap } from "../../src/tmx/tmx-types";

const {
  applyPlacementSnapshotInteriorDecor,
  createPixiApplicationLifetime,
  createNightModeOverlayContainer,
  destroyPlacementSprites,
  formatKnownUnavailableTilesheetWarning,
  getPlacementContainerAlpha,
  getInteriorDecorStateRevision,
  getLoadableTilesheets,
  replacePlacementSprites,
} = plannerCanvasModule;

describe("planner canvas X-ray rendering", () => {
  it("keeps ordinary placement rendering opaque and makes it translucent only while held", () => {
    expect(getPlacementContainerAlpha(false)).toBe(1);
    expect(getPlacementContainerAlpha(true)).toBe(0.18);
  });
});

class TestNightModeContainer {
  readonly children: unknown[] = [];

  addChild(child: unknown): void {
    this.children.push(child);
  }
}

class TestNightModeGraphics {
  readonly circles: Array<Readonly<{ x: number; y: number; radius: number }>> = [];

  rect(): this {
    return this;
  }

  circle(x: number, y: number, radius: number): this {
    this.circles.push({ x, y, radius });
    return this;
  }

  fill(): this {
    return this;
  }
}

type PlannerCameraControlsFactory = (plannerCameraControlsProperties: Readonly<{
  canvasElement: HTMLCanvasElement;
  getCameraGeometry: () => CameraGeometry;
  getCameraState: () => CameraState;
  getPointerInteractionMode?: () =>
    | "navigate"
    | "rectangle"
    | "move-selected";
  getMapTileAtPointer: (pointerCoordinates: Readonly<{ x: number; y: number }>) =>
    | Readonly<{ x: number; y: number }>
    | null;
  onMapTileClick: (mapTileCoordinates: Readonly<{ x: number; y: number }>) => void;
  onMapTileRectangle?: (
    startMapTileCoordinates: Readonly<{ x: number; y: number }>,
    endMapTileCoordinates: Readonly<{ x: number; y: number }>,
  ) => void;
  setCameraState: (cameraState: CameraState) => void;
}>) => Readonly<{ dispose(): void }>;

type MapPlacementGridReadyNotifier = (mapPlacementGridReadyProperties: Readonly<{
  isMapLifecycleCurrent: () => boolean;
  mapId: string;
  onMapPlacementGridReady?: (
    mapId: string,
    mapPlacementGrid: MapPlacementGrid,
  ) => void;
  parsedMap: TmxMap;
}>) => void;

class TestCanvasElement {
  private readonly capturedPointerIds = new Set<number>();
  private readonly eventListeners = new Map<string, EventListener[]>();

  tabIndex = -1;

  addEventListener(
    eventType: string,
    eventListener: EventListenerOrEventListenerObject,
  ): void {
    if (typeof eventListener !== "function") {
      throw new Error(`Test canvas does not support object event listener for ${eventType}.`);
    }

    const listenersForEventType = this.eventListeners.get(eventType) ?? [];
    listenersForEventType.push(eventListener);
    this.eventListeners.set(eventType, listenersForEventType);
  }

  removeEventListener(
    eventType: string,
    eventListener: EventListenerOrEventListenerObject,
  ): void {
    if (typeof eventListener !== "function") {
      return;
    }

    const listenersForEventType = this.eventListeners.get(eventType);

    if (listenersForEventType === undefined) {
      return;
    }

    this.eventListeners.set(
      eventType,
      listenersForEventType.filter((listener) => listener !== eventListener),
    );
  }

  dispatchPointerEvent(eventType: string, pointerEvent: PointerEvent): void {
    for (const eventListener of this.eventListeners.get(eventType) ?? []) {
      eventListener(pointerEvent);
    }
  }

  focus(): void {}

  getBoundingClientRect(): DOMRect {
    return {
      bottom: 160,
      height: 160,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON(): Record<string, never> {
        return {};
      },
    };
  }

  hasPointerCapture(pointerId: number): boolean {
    return this.capturedPointerIds.has(pointerId);
  }

  releasePointerCapture(pointerId: number): void {
    this.capturedPointerIds.delete(pointerId);
  }

  setAttribute(): void {}

  setPointerCapture(pointerId: number): void {
    this.capturedPointerIds.add(pointerId);
  }
}

function createPointerEvent(
  pointerId: number,
  clientX: number,
  clientY: number,
  overrides: Partial<Pick<PointerEvent, "button" | "pointerType">> = {},
): PointerEvent {
  return {
    button: 0,
    clientX,
    clientY,
    pointerId,
    pointerType: "mouse",
    preventDefault(): void {},
    ...overrides,
  } as PointerEvent;
}

function createDestroyablePixiResource(): Readonly<{
  destroyed: boolean;
  destroy(): void;
}> {
  let destroyed = false;

  return {
    get destroyed(): boolean {
      return destroyed;
    },
    destroy(): void {
      destroyed = true;
    },
  };
}

function createPlacementClickTestControls(
  interactionMode: "navigate" | "rectangle" | "move-selected" = "navigate",
): Readonly<{
  canvasElement: TestCanvasElement;
  clickedMapTiles: Array<Readonly<{ x: number; y: number }>>;
  selectedMapRectangles: Array<
    Readonly<{
      start: Readonly<{ x: number; y: number }>;
      end: Readonly<{ x: number; y: number }>;
    }>
  >;
}> | null {
  const attachPlannerCameraControls = (
    plannerCanvasModule as typeof plannerCanvasModule & {
      attachPlannerCameraControls?: PlannerCameraControlsFactory;
    }
  ).attachPlannerCameraControls;

  if (typeof attachPlannerCameraControls !== "function") {
    expect(attachPlannerCameraControls).toBeTypeOf("function");
    return null;
  }

  const canvasElement = new TestCanvasElement();
  const clickedMapTiles: Array<Readonly<{ x: number; y: number }>> = [];
  const selectedMapRectangles: Array<
    Readonly<{
      start: Readonly<{ x: number; y: number }>;
      end: Readonly<{ x: number; y: number }>;
    }>
  > = [];
  let currentCameraState: CameraState = {
    initialFitZoom: 1,
    maximumZoom: 4,
    minimumZoom: 0.25,
    positionX: 100,
    positionY: 80,
    zoom: 1,
  };
  const cameraGeometry: CameraGeometry = {
    mapPixelHeight: 128,
    mapPixelWidth: 160,
    viewportHeight: 160,
    viewportWidth: 200,
  };

  attachPlannerCameraControls({
    canvasElement: canvasElement as unknown as HTMLCanvasElement,
    getCameraGeometry: () => cameraGeometry,
    getCameraState: () => currentCameraState,
    getPointerInteractionMode: () => interactionMode,
    getMapTileAtPointer: (pointerCoordinates) =>
      getMapTileAtPointer({
        pointerX: pointerCoordinates.x,
        pointerY: pointerCoordinates.y,
        cameraPositionX: currentCameraState.positionX,
        cameraPositionY: currentCameraState.positionY,
        zoom: currentCameraState.zoom,
        mapTileWidth: 16,
        mapTileHeight: 16,
        mapWidth: 10,
        mapHeight: 8,
      }),
    onMapTileClick: (mapTileCoordinates) => {
      clickedMapTiles.push(mapTileCoordinates);
    },
    onMapTileRectangle: (startMapTileCoordinates, endMapTileCoordinates) => {
      selectedMapRectangles.push({
        start: startMapTileCoordinates,
        end: endMapTileCoordinates,
      });
    },
    setCameraState: (cameraState) => {
      currentCameraState = cameraState;
    },
  });

  return { canvasElement, clickedMapTiles, selectedMapRectangles };
}

function createMapPlacementGridCallbackMap(): TmxMap {
  return {
    width: 1,
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
        tileCount: 1,
        columns: 1,
        imageSource: "test.png",
        imageWidth: 16,
        imageHeight: 16,
        properties: {},
        tileProperties: new Map([[0, { Buildable: "T", Diggable: "T" }]]),
      },
    ],
    tileLayers: [
      {
        id: null,
        name: "Back",
        width: 1,
        height: 1,
        visible: true,
        opacity: 1,
        offsetX: 0,
        offsetY: 0,
        properties: {},
        rawGids: new Uint32Array([1]),
      },
      {
        id: null,
        name: "Buildings",
        width: 1,
        height: 1,
        visible: true,
        opacity: 1,
        offsetX: 0,
        offsetY: 0,
        properties: {},
        rawGids: new Uint32Array([0]),
      },
    ],
    objectLayers: [],
    tileDataProperties: new Map(),
  };
}

function createInteriorDecorClickMap(): TmxMap {
  return {
    width: 2,
    height: 3,
    tileWidth: 16,
    tileHeight: 16,
    properties: {},
    tilesets: [
      {
        firstGid: 1,
        name: "walls and floors",
        tileWidth: 16,
        tileHeight: 16,
        tileCount: 688,
        columns: 16,
        imageSource: "walls_and_floors",
        imageWidth: 256,
        imageHeight: 688,
        properties: {},
        tileProperties: new Map(),
      },
    ],
    tileLayers: [
      {
        id: null,
        name: "Back",
        width: 2,
        height: 3,
        visible: true,
        opacity: 1,
        offsetX: 0,
        offsetY: 0,
        properties: {},
        rawGids: Uint32Array.from([1, 1, 1, 1, 0, 0]),
      },
      {
        id: null,
        name: "Buildings",
        width: 2,
        height: 3,
        visible: true,
        opacity: 1,
        offsetX: 0,
        offsetY: 0,
        properties: {},
        rawGids: Uint32Array.from([0, 0, 0, 0, 1, 1]),
      },
    ],
    objectLayers: [],
    tileDataProperties: new Map([["Back:0,0", { WallID: "Bedroom" }]]),
  };
}

describe("createPixiApplicationLifetime", () => {
  it("defers destruction until Pixi initialization has settled", () => {
    const destroyedApplicationIds: string[] = [];
    const pixiApplicationLifetime = createPixiApplicationLifetime<string>(
      (applicationId) => {
        destroyedApplicationIds.push(applicationId);
      },
    );

    pixiApplicationLifetime.setApplication("farm-map");
    pixiApplicationLifetime.requestDestruction();

    expect(destroyedApplicationIds).toEqual([]);

    pixiApplicationLifetime.finishInitialization();
    pixiApplicationLifetime.requestDestruction();

    expect(destroyedApplicationIds).toEqual(["farm-map"]);
  });

  it("destroys once when initialization fails after cleanup was requested", () => {
    const destroyedApplicationIds: string[] = [];
    const pixiApplicationLifetime = createPixiApplicationLifetime<string>(
      (applicationId) => {
        destroyedApplicationIds.push(applicationId);
      },
    );

    pixiApplicationLifetime.setApplication("failed-map");
    pixiApplicationLifetime.requestDestruction();
    pixiApplicationLifetime.finishInitialization();
    pixiApplicationLifetime.finishInitialization();

    expect(destroyedApplicationIds).toEqual(["failed-map"]);
  });
});

describe("createNightModeOverlayContainer", () => {
  it("draws bounded light circles after the night base for lit catalog lights", () => {
    const createNightOverlay = (
      plannerCanvasModule as typeof plannerCanvasModule & {
        createNightModeOverlayContainer?: (input: unknown) => TestNightModeContainer;
      }
    ).createNightModeOverlayContainer;

    if (typeof createNightOverlay !== "function") {
      expect(createNightOverlay).toBeTypeOf("function");
      return;
    }

    const nightModeOverlayContainer = createNightOverlay({
      catalogItems: [
        {
          id: "object:93",
          nightLight: { radiusInTiles: 4, color: 0xffe3a0 },
        },
      ],
      editorDisplayOptions: {
        showBeeHouseRadius: false,
        showBuildableTiles: false,
        showCropTiles: false,
        showGrid: false,
        showJunimoHutRadius: false,
        showNightMode: true,
        showNpcPaths: false,
        showScarecrowRadius: false,
        showSprinklerRadius: false,
        showTreeTiles: false,
      },
      mapPlacementGrid: {
        width: 5,
        height: 5,
        capabilitiesByTile: [],
      },
      pixi: {
        Container: TestNightModeContainer,
        Graphics: TestNightModeGraphics,
      },
      placementSnapshot: {
        buildings: [],
        crops: [],
        items: [
          {
            instanceId: 1,
            itemId: "object:93",
            x: 2,
            y: 3,
            layer: "item",
            rotation: 0,
            footprint: { width: 2, height: 1 },
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
        nextBuildingId: 1,
        nextItemId: 2,
      },
      tileHeight: 20,
      tileWidth: 16,
    });
    const nightModeGraphics = nightModeOverlayContainer.children[0];

    expect(nightModeGraphics).toBeInstanceOf(TestNightModeGraphics);
    expect((nightModeGraphics as TestNightModeGraphics).circles).toContainEqual({
      x: 48,
      y: 70,
      radius: 80,
    });
  });
});

describe("destroyPlacementSprites", () => {
  it("destroys each sprite and only the frame texture it owns", () => {
    const destroyPlacementSpriteRecords = (
      plannerCanvasModule as typeof plannerCanvasModule & {
        destroyPlacementSprites?: (placementSprites: readonly unknown[]) => void;
      }
    ).destroyPlacementSprites;

    if (typeof destroyPlacementSpriteRecords !== "function") {
      expect(destroyPlacementSpriteRecords).toBeTypeOf("function");
      return;
    }

    const firstSprite = createDestroyablePixiResource();
    const secondSprite = createDestroyablePixiResource();
    const ownedFrameTexture = createDestroyablePixiResource();

    destroyPlacementSpriteRecords([
      { sprite: firstSprite, frameTexture: ownedFrameTexture },
      { sprite: secondSprite, frameTexture: null },
    ]);

    expect(firstSprite.destroyed).toBe(true);
    expect(secondSprite.destroyed).toBe(true);
    expect(ownedFrameTexture.destroyed).toBe(true);
  });
});

describe("replacePlacementSprites", () => {
  it("does not call Pixi addChild without any next placement sprites", () => {
    const addChildArguments: unknown[][] = [];
    const placementContainer = {
      addChild(...placementSprites: unknown[]): void {
        addChildArguments.push(placementSprites);
      },
      removeChildren(): void {},
    };

    replacePlacementSprites(
      placementContainer as never,
      [],
      [],
    );

    expect(addChildArguments).toEqual([]);
  });
});

describe("formatKnownUnavailableTilesheetWarning", () => {
  it("names the affected map, asset path, and locked-source reason", () => {
    expect(
      formatKnownUnavailableTilesheetWarning("capitalist-dream", {
        outputPath: "mods/daisyniko.capitalistdreamfarm2/DesertTiles.png",
        reason: "The locked source returned HTTP 404.",
      }),
    ).toBe(
      'Map "capitalist-dream" skips unavailable tilesheet "mods/daisyniko.capitalistdreamfarm2/DesertTiles.png". The locked source returned HTTP 404.',
    );
  });
});

describe("getLoadableTilesheets", () => {
  it("does not schedule a local load for a known-unavailable tilesheet", () => {
    const renderingTilesets: readonly RenderingTileset[] = [
      {
        source: "townInterior",
        firstGid: 1,
        tileWidth: 16,
        tileHeight: 16,
        imageWidth: 256,
        imageHeight: 256,
        columns: 16,
        tileCount: 256,
        assetPath: "/game-assets/1.6.15/tilesheets/townInterior.png",
        usedSpringFallback: false,
      },
      {
        source: "DesertTiles",
        firstGid: 257,
        tileWidth: 16,
        tileHeight: 16,
        imageWidth: 256,
        imageHeight: 256,
        columns: 16,
        tileCount: 256,
        knownUnavailable: {
          outputPath: "mods/daisyniko.capitalistdreamfarm2/DesertTiles.png",
          reason: "The locked source returned HTTP 404.",
        },
      },
    ];

    expect(getLoadableTilesheets(renderingTilesets)).toEqual([
      {
        tilesetIndex: 0,
        assetPath: "/game-assets/1.6.15/tilesheets/townInterior.png",
      },
    ]);
  });
});

describe("interior decor map refresh", () => {
  it("keeps undecorated maps intact and gives every decor change its own revision", () => {
    const loadedMap = createMapPlacementGridCallbackMap();

    expect(applyPlacementSnapshotInteriorDecor(loadedMap, undefined)).toBe(
      loadedMap,
    );
    expect(
      getInteriorDecorStateRevision({ wallpapers: { UpperRoom: "17" }, floors: {} }),
    ).not.toBe(
      getInteriorDecorStateRevision({ wallpapers: { UpperRoom: "18" }, floors: {} }),
    );
    expect(getInteriorDecorStateRevision(undefined)).toBe("");
  });
});

describe("dispatchInteriorDecorMapTileClick", () => {
  it("emits the verified WallID rather than a normal placement when wallpaper selection is active", () => {
    const dispatchInteriorDecorMapTileClick = (
      plannerCanvasModule as typeof plannerCanvasModule & {
        dispatchInteriorDecorMapTileClick?: (input: Readonly<{
          activeInteriorDecorPattern: (typeof interiorWallpaperPatterns)[number] | null;
          mapId: string;
          mapTileCoordinates: Readonly<{ x: number; y: number }>;
          onInteriorDecorApply?: (
            mapId: string,
            interiorDecorKind: "wallpaper" | "flooring",
            targetId: string,
            patternId: string,
          ) => void;
          onInteriorDecorRejected?: (
            mapId: string,
            interiorDecorKind: "wallpaper" | "flooring",
          ) => void;
          parsedMap: TmxMap;
        }>) => boolean;
      }
    ).dispatchInteriorDecorMapTileClick;

    if (typeof dispatchInteriorDecorMapTileClick !== "function") {
      expect(dispatchInteriorDecorMapTileClick).toBeTypeOf("function");
      return;
    }

    const activePattern = interiorWallpaperPatterns[0];

    if (activePattern === undefined) {
      throw new Error("Interior decor catalog must contain wallpaper 0.");
    }

    const appliedInteriorDecor: unknown[][] = [];
    const rejectedInteriorDecor: unknown[][] = [];
    const wasHandled = dispatchInteriorDecorMapTileClick({
      activeInteriorDecorPattern: activePattern,
      mapId: "farmhouse-0",
      mapTileCoordinates: { x: 0, y: 0 },
      onInteriorDecorApply: (...argumentsForApplication) => {
        appliedInteriorDecor.push(argumentsForApplication);
      },
      onInteriorDecorRejected: (...argumentsForRejection) => {
        rejectedInteriorDecor.push(argumentsForRejection);
      },
      parsedMap: createInteriorDecorClickMap(),
    });

    expect(wasHandled).toBe(true);
    expect(appliedInteriorDecor).toEqual([
      ["farmhouse-0", "wallpaper", "Bedroom", "0"],
    ]);
    expect(rejectedInteriorDecor).toEqual([]);
  });

  it("consumes an invalid decor click through the rejection callback", () => {
    const dispatchInteriorDecorMapTileClick = (
      plannerCanvasModule as typeof plannerCanvasModule & {
        dispatchInteriorDecorMapTileClick?: (input: Readonly<{
          activeInteriorDecorPattern: (typeof interiorWallpaperPatterns)[number] | null;
          mapId: string;
          mapTileCoordinates: Readonly<{ x: number; y: number }>;
          onInteriorDecorRejected?: (
            mapId: string,
            interiorDecorKind: "wallpaper" | "flooring",
          ) => void;
          parsedMap: TmxMap;
        }>) => boolean;
      }
    ).dispatchInteriorDecorMapTileClick;

    if (typeof dispatchInteriorDecorMapTileClick !== "function") {
      expect(dispatchInteriorDecorMapTileClick).toBeTypeOf("function");
      return;
    }

    const activePattern = interiorWallpaperPatterns[0];

    if (activePattern === undefined) {
      throw new Error("Interior decor catalog must contain wallpaper 0.");
    }

    const rejectedInteriorDecor: unknown[][] = [];
    const wasHandled = dispatchInteriorDecorMapTileClick({
      activeInteriorDecorPattern: activePattern,
      mapId: "farmhouse-0",
      mapTileCoordinates: { x: 1, y: 2 },
      onInteriorDecorRejected: (...argumentsForRejection) => {
        rejectedInteriorDecor.push(argumentsForRejection);
      },
      parsedMap: createInteriorDecorClickMap(),
    });

    expect(wasHandled).toBe(true);
    expect(rejectedInteriorDecor).toEqual([["farmhouse-0", "wallpaper"]]);
  });
});

describe("getMapTileCompositionOptions", () => {
  it("enables overlay TileData only for Farmhouse 2", () => {
    const getMapTileCompositionOptions = (
      plannerCanvasModule as typeof plannerCanvasModule & {
        getMapTileCompositionOptions?: (mapId: string) =>
          | Readonly<{ includeTileDataProperties: true }>
          | undefined;
      }
    ).getMapTileCompositionOptions;

    if (typeof getMapTileCompositionOptions !== "function") {
      expect(getMapTileCompositionOptions).toBeTypeOf("function");
      return;
    }

    expect(getMapTileCompositionOptions("farmhouse-2")).toEqual({
      includeTileDataProperties: true,
    });
    expect(getMapTileCompositionOptions("ginger-island")).toBeUndefined();
    expect(getMapTileCompositionOptions("standard")).toBeUndefined();
  });
});

describe("attachPlannerCameraControls map placement clicks", () => {
  it("calls the map-tile callback for a left-pointer release within the three-pixel pan threshold", () => {
    const placementClickTestControls = createPlacementClickTestControls();

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 103, 80),
    );

    expect(placementClickTestControls.clickedMapTiles).toEqual([{ x: 5, y: 4 }]);
  });

  it("does not call the map-tile callback after a pointer moves beyond the pan threshold", () => {
    const placementClickTestControls = createPlacementClickTestControls();

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 104, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 104, 80),
    );

    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
  });

  it("reports a map rectangle instead of panning or placing a single item in rectangle mode", () => {
    const placementClickTestControls = createPlacementClickTestControls("rectangle");

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 132, 112),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 132, 112),
    );

    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
    expect(placementClickTestControls.selectedMapRectangles).toEqual([
      {
        start: { x: 5, y: 4 },
        end: { x: 7, y: 6 },
      },
    ]);
  });

  it("reports a map rectangle for a selected-placement drag without panning the camera", () => {
    const placementClickTestControls = createPlacementClickTestControls("move-selected");

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 132, 112),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 132, 112),
    );

    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
    expect(placementClickTestControls.selectedMapRectangles).toEqual([
      {
        start: { x: 5, y: 4 },
        end: { x: 7, y: 6 },
      },
    ]);
  });

  it("does not report a rectangle for a secondary mouse or pen button", () => {
    const placementClickTestControls = createPlacementClickTestControls("rectangle");

    if (placementClickTestControls === null) {
      return;
    }

    for (const pointerType of ["mouse", "pen"] as const) {
      placementClickTestControls.canvasElement.dispatchPointerEvent(
        "pointerdown",
        createPointerEvent(1, 100, 80, { button: 2, pointerType }),
      );
      placementClickTestControls.canvasElement.dispatchPointerEvent(
        "pointerup",
        createPointerEvent(1, 132, 112, { button: 2, pointerType }),
      );
    }

    expect(placementClickTestControls.selectedMapRectangles).toEqual([]);
  });

  it("does not call the map-tile callback when a pointer gesture enters pinch mode", () => {
    const placementClickTestControls = createPlacementClickTestControls();

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80, { pointerType: "touch" }),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(2, 120, 80, { pointerType: "touch" }),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 100, 80, { pointerType: "touch" }),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(2, 120, 80, { pointerType: "touch" }),
    );

    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
  });

  it("does not call the map-tile callback after cancellation, capture loss, right clicks, or map-exterior releases", () => {
    const placementClickTestControls = createPlacementClickTestControls();

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointercancel",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(2, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "lostpointercapture",
      createPointerEvent(2, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(3, 100, 80, { button: 2 }),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(3, 100, 80, { button: 2 }),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(4, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(4, 100, 80, { button: 2 }),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(5, 10, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(5, 10, 80),
    );

    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
  });
});

describe("notifyMapPlacementGridReady", () => {
  it("builds a placement grid and reports it for the current local map lifecycle", () => {
    const notifyMapPlacementGridReady = (
      plannerCanvasModule as typeof plannerCanvasModule & {
        notifyMapPlacementGridReady?: MapPlacementGridReadyNotifier;
      }
    ).notifyMapPlacementGridReady;

    if (typeof notifyMapPlacementGridReady !== "function") {
      expect(notifyMapPlacementGridReady).toBeTypeOf("function");
      return;
    }

    const reportedPlacementGrids: Array<Readonly<{
      mapId: string;
      mapPlacementGrid: MapPlacementGrid;
    }>> = [];

    notifyMapPlacementGridReady({
      isMapLifecycleCurrent: () => true,
      mapId: "farm",
      onMapPlacementGridReady: (mapId, mapPlacementGrid) => {
        reportedPlacementGrids.push({ mapId, mapPlacementGrid });
      },
      parsedMap: createMapPlacementGridCallbackMap(),
    });

    expect(reportedPlacementGrids).toHaveLength(1);
    expect(reportedPlacementGrids[0]).toMatchObject({
      mapId: "farm",
      mapPlacementGrid: {
        width: 1,
        height: 1,
        capabilitiesByTile: [
          {
            buildable: true,
            diggable: true,
          },
        ],
      },
    });
  });

  it("does not report a grid for an expired map lifecycle", () => {
    const notifyMapPlacementGridReady = (
      plannerCanvasModule as typeof plannerCanvasModule & {
        notifyMapPlacementGridReady?: MapPlacementGridReadyNotifier;
      }
    ).notifyMapPlacementGridReady;

    if (typeof notifyMapPlacementGridReady !== "function") {
      expect(notifyMapPlacementGridReady).toBeTypeOf("function");
      return;
    }

    const reportedPlacementGrids: Array<MapPlacementGrid> = [];

    notifyMapPlacementGridReady({
      isMapLifecycleCurrent: () => false,
      mapId: "farm",
      onMapPlacementGridReady: (_mapId, mapPlacementGrid) => {
        reportedPlacementGrids.push(mapPlacementGrid);
      },
      parsedMap: createMapPlacementGridCallbackMap(),
    });

    expect(reportedPlacementGrids).toEqual([]);
  });

  it("does not report a grid when the map lifecycle expires while the grid is built", () => {
    const notifyMapPlacementGridReady = (
      plannerCanvasModule as typeof plannerCanvasModule & {
        notifyMapPlacementGridReady?: MapPlacementGridReadyNotifier;
      }
    ).notifyMapPlacementGridReady;

    if (typeof notifyMapPlacementGridReady !== "function") {
      expect(notifyMapPlacementGridReady).toBeTypeOf("function");
      return;
    }

    let lifecycleCheckCount = 0;
    const reportedPlacementGrids: Array<MapPlacementGrid> = [];

    notifyMapPlacementGridReady({
      isMapLifecycleCurrent: () => {
        lifecycleCheckCount += 1;
        return lifecycleCheckCount === 1;
      },
      mapId: "farm",
      onMapPlacementGridReady: (_mapId, mapPlacementGrid) => {
        reportedPlacementGrids.push(mapPlacementGrid);
      },
      parsedMap: createMapPlacementGridCallbackMap(),
    });

    expect(reportedPlacementGrids).toEqual([]);
  });
});
