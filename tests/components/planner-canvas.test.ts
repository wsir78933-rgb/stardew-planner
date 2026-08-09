import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createPlannerCanvasCameraLifecycle } from "../../src/components/planner-canvas";
import * as plannerCanvasModule from "../../src/components/planner-canvas";
import {
  catalogDatasetUrls,
  createBuildingCatalogFromDataset,
  type CatalogItem,
  type CatalogSeason,
} from "../../src/catalog";
import { createInitialMapPlacementSnapshot } from "../../src/maps/map-initial-composition";
import type { CameraGeometry, CameraState } from "../../src/rendering/camera-state";
import type { RenderingTileset } from "../../src/rendering/map-rendering-contract";
import { getMapTileAtPointer } from "../../src/placement/map-pointer-tile";
import type { MapPlacementGrid } from "../../src/placement/map-placement-grids";
import { interiorWallpaperPatterns } from "../../src/interior-decor/interior-decor-catalog";
import type { TmxMap } from "../../src/tmx/tmx-types";
import type { PlacementRenderEntry } from "../../src/rendering/placement-rendering";
import { createPlacementRenderEntries } from "../../src/rendering/placement-rendering";
import {
  resolvePlacementTextureEntries,
  type ResolvedPlacementTextureEntry,
} from "../../src/rendering/resolved-placement-texture";
import {
  createEmptyPlacementSnapshot,
  type PlacementSnapshot,
} from "../../src/placement/placement-snapshot";
import { createPlannerCameraStateRetention } from "../../src/planner/planner-camera-state-retention";

const {
  applyPlacementSnapshotInteriorDecor,
  assertPreparedCanvasResourcesMatchRequestedMap,
  createPixiApplicationLifetime,
  createNightModeOverlayContainer,
  createPlannerCanvasCleanup,
  bindPlannerCanvasInteractions,
  commitPlannerCanvasExporterAndWarnings,
  createPlacementSprite,
  createPlacementSpriteBatch,
  destroyPlacementSprites,
  formatKnownUnavailableTilesheetWarning,
  getPlacementContainerAlpha,
  getInteriorDecorStateRevision,
  getLoadableTilesheets,
  getPlannerCanvasRenderingContract,
  getPlannerCanvasInitializationDependencies,
  loadPlacementTextures,
  replacePlacementSprites,
  reportCurrentPlannerCanvasError,
  settlePlannerCanvasPlacementRender,
} = plannerCanvasModule;

type PlannerCanvasInitialTexturesLoader = (
  pixi: typeof import("pixi.js"),
  renderingTilesets: readonly RenderingTileset[],
  resolvedInitialPlacementTextureEntries: readonly ResolvedPlacementTextureEntry[],
  placementTexturePromisesByResolvedUrl: Map<
    string,
    Promise<import("pixi.js").Texture>
  >,
) => Promise<
  Readonly<{
    resourceClumpTilesheetTexture: import("pixi.js").Texture;
    tilesheetTextures: ReadonlyMap<number, import("pixi.js").Texture>;
  }>
>;

const loadPlannerCanvasInitialTextures = (
  plannerCanvasModule as unknown as {
    loadPlannerCanvasInitialTextures?: PlannerCanvasInitialTexturesLoader;
  }
).loadPlannerCanvasInitialTextures;

type ResolvedPlacementTexturesLoader = (
  pixi: typeof import("pixi.js"),
  resolvedPlacementTextureEntries: readonly ResolvedPlacementTextureEntry[],
  placementTexturePromisesByResolvedUrl: Map<
    string,
    Promise<import("pixi.js").Texture>
  >,
) => Promise<ReadonlyMap<string, import("pixi.js").Texture>>;

const loadResolvedPlacementTextures = (
  plannerCanvasModule.loadPlacementTextures as unknown
) as ResolvedPlacementTexturesLoader;

type InitialResolvedPlacementTextureEntriesCreator = (
  input: Readonly<{
    catalogItems: readonly CatalogItem[] | undefined;
    isNightMode: boolean;
    mapId: string;
    mapPlacementGrid?: MapPlacementGrid;
    placementSnapshot: PlacementSnapshot | undefined;
    season: CatalogSeason;
  }>,
) => readonly ResolvedPlacementTextureEntry[];

const createInitialResolvedPlacementTextureEntries = (
  plannerCanvasModule as unknown as {
    createInitialResolvedPlacementTextureEntries?:
      InitialResolvedPlacementTextureEntriesCreator;
  }
).createInitialResolvedPlacementTextureEntries;

function loadLockedBuildingCatalog(): readonly CatalogItem[] {
  const rawBuildings = JSON.parse(readFileSync(
    new URL(
      "../../public/game-assets/1.6.15/data/Buildings.json",
      import.meta.url,
    ),
    "utf8",
  )) as unknown;

  return createBuildingCatalogFromDataset(
    rawBuildings,
    catalogDatasetUrls.buildings,
  ).items;
}

const shouldRenderPlannerJoystick = (
  plannerCanvasModule as typeof plannerCanvasModule & {
    shouldRenderPlannerJoystick?: (
      showJoystickPreference: boolean,
      selectedPlacementKeys: readonly string[],
    ) => boolean;
  }
).shouldRenderPlannerJoystick;

const createPlacementPreviewVisualDescriptor = (
  plannerCanvasModule as unknown as {
    createPlacementPreviewVisualDescriptor: (isPlacementValid: boolean) => Readonly<{
      alpha: number;
      tint: number;
    }>;
  }
).createPlacementPreviewVisualDescriptor;

const createPlannerCanvasPlacementPreviewState = (
  plannerCanvasModule as unknown as {
    createPlannerCanvasPlacementPreviewState: (input: unknown) => unknown;
  }
).createPlannerCanvasPlacementPreviewState;

const createPlannerCanvasPlacementPreviewRenderer = (
  plannerCanvasModule as unknown as {
    createPlannerCanvasPlacementPreviewRenderer: (input: unknown) => {
      dispose: () => void;
      render: (input: unknown) => Promise<"error" | "ready" | "stale">;
    };
  }
).createPlannerCanvasPlacementPreviewRenderer;

const renderMapScreenshotWithoutEditorOverlays = (
  plannerCanvasModule as unknown as {
    renderMapScreenshotWithoutEditorOverlays: <Result>(input: Readonly<{
      mapDisplayOverlayContainer: { visible: boolean };
      placementPreviewContainer: { visible: boolean };
      renderScreenshot: () => Promise<Result> | Result;
    }>) => Promise<Result>;
  }
).renderMapScreenshotWithoutEditorOverlays;

describe("PlannerCanvas joystick visibility", () => {
  it.each([
    { expected: false, selectedPlacementKeys: [], showJoystickPreference: false },
    {
      expected: false,
      selectedPlacementKeys: ["item:1"],
      showJoystickPreference: false,
    },
    { expected: false, selectedPlacementKeys: [], showJoystickPreference: true },
    {
      expected: true,
      selectedPlacementKeys: ["item:1"],
      showJoystickPreference: true,
    },
  ])(
    "returns $expected for preference=$showJoystickPreference and $selectedPlacementKeys.length selected placements",
    ({ expected, selectedPlacementKeys, showJoystickPreference }) => {
      expect(shouldRenderPlannerJoystick).toBeTypeOf("function");
      if (shouldRenderPlannerJoystick === undefined) {
        return;
      }

      expect(
        shouldRenderPlannerJoystick(
          showJoystickPreference,
          selectedPlacementKeys,
        ),
      ).toBe(expected);
    },
  );
});

describe("PlannerCanvas placement preview visual state", () => {
  it("uses the locked valid and invalid ghost tint and alpha values", () => {
    expect(createPlacementPreviewVisualDescriptor(true)).toEqual({
      alpha: 0.6,
      tint: 0x00ff00,
    });
    expect(createPlacementPreviewVisualDescriptor(false)).toEqual({
      alpha: 0.4,
      tint: 0xff0000,
    });
  });

  it("builds an invalid transient action at the hovered tile without a source mutation", () => {
    const placementSnapshot = createEmptyPlacementSnapshot();
    const placementPreviewState = createPlannerCanvasPlacementPreviewState({
      hoveredMapTile: { x: 1, y: 0 },
      mapPlacementGrid: {
        capabilitiesByTile: [
          {
            buildable: false,
            crabPot: false,
            diggable: false,
            passable: false,
            treePlantable: false,
            treePlantableOnDirt: false,
            wall: false,
          },
          {
            buildable: false,
            crabPot: false,
            diggable: false,
            passable: false,
            treePlantable: false,
            treePlantableOnDirt: false,
            wall: false,
          },
        ],
        height: 1,
        width: 2,
      },
      placementPreview: {
        buildingMetadataById: {},
        catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
        freePlacement: false,
        selectedCatalogItem: {
          allowedTools: ["cursor"],
          category: "floor",
          id: "floor:13",
          name: "Stone Floor",
          sprite: { kind: "sprite-index", index: 0 },
          textureLocalPath: "/game-assets/1.6.15/tilesheets/flooring.png",
          tileSize: { width: 1, height: 1 },
        },
      },
      placementSnapshot,
    });

    expect(placementPreviewState).toMatchObject({
      previewAction: {
        type: "add-item",
        item: expect.objectContaining({
          itemId: "floor:13",
          x: 1,
          y: 0,
        }),
      },
      visualDescriptor: { alpha: 0.4, tint: 0xff0000 },
    });
    expect(placementSnapshot).toEqual(createEmptyPlacementSnapshot());
  });

  it("returns an exact red duplicate-crop ghost state without throwing", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 1, y: 0 }],
      nextBuildingId: 5,
      nextItemId: 8,
    };

    const placementPreviewState = createPlannerCanvasPlacementPreviewState({
      hoveredMapTile: { x: 1, y: 0 },
      mapPlacementGrid: {
        capabilitiesByTile: Array.from({ length: 2 }, () => ({
          buildable: true,
          crabPot: false,
          diggable: true,
          passable: true,
          treePlantable: false,
          treePlantableOnDirt: false,
          wall: false,
        })),
        height: 1,
        width: 2,
      },
      placementPreview: {
        buildingMetadataById: {},
        catalogPresentationChoice: { flipped: false, rotation: 0, variant: 0 },
        freePlacement: false,
        selectedCatalogItem: {
          allowedTools: ["cursor"],
          category: "crop",
          id: "crop:24",
          name: "Parsnip",
          sprite: { kind: "sprite-index", index: 0 },
          textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
          tileSize: { width: 1, height: 1 },
        },
      },
      placementSnapshot,
    });

    expect(placementPreviewState).toMatchObject({
      previewAction: {
        type: "add-crop",
        crop: { cropId: "crop:24", x: 1, y: 0 },
      },
      visualDescriptor: { alpha: 0.4, tint: 0xff0000 },
    });
    expect(placementSnapshot.nextBuildingId).toBe(5);
    expect(placementSnapshot.nextItemId).toBe(8);
    expect(placementSnapshot.crops).toEqual([
      { cropId: "crop:24", x: 1, y: 0 },
    ]);
  });

});

describe("PlannerCanvas placement preview Pixi lifecycle", () => {
  it("clears the prior ghost before a replacement settles and stays empty on failure", async () => {
    let rejectReplacement:
      | ((replacementError: Error) => void)
      | undefined;
    const replacementPromise = new Promise<readonly unknown[]>((_, reject) => {
      rejectReplacement = reject;
    });
    const previewContainer = {
      children: [] as unknown[],
      addChild(...sprites: unknown[]) {
        this.children.push(...sprites);
      },
      removeChildren() {
        this.children = [];
      },
    };
    const destroyedSpriteIds: string[] = [];
    const receivedErrors: string[] = [];
    const replacedAnimationIds: string[][] = [];
    const previewRenderer = createPlannerCanvasPlacementPreviewRenderer({
      container: previewContainer,
      destroyPlacementSprites: (placementSprites: readonly { id: string }[]) => {
        destroyedSpriteIds.push(...placementSprites.map((sprite) => sprite.id));
      },
      getPlacementSpriteAnimations: (placementSprites: readonly { id: string }[]) =>
        placementSprites.map((sprite) => sprite.id),
      isMapLifecycleCurrent: () => true,
      mapId: "standard",
      onCurrentError: (message: string) => {
        receivedErrors.push(message);
      },
      onRender: () => undefined,
      replaceAnimations: (animationIds: readonly string[]) => {
        replacedAnimationIds.push([...animationIds]);
      },
    });
    await previewRenderer.render({
      createPlacementSprites: () => Promise.resolve([
        { id: "first", sprite: { id: "first", alpha: 1, tint: 0xffffff } },
      ]),
      visualDescriptor: { alpha: 0.6, tint: 0x00ff00 },
    });

    const replacementRender = previewRenderer.render({
      createPlacementSprites: () => replacementPromise,
      visualDescriptor: { alpha: 0.4, tint: 0xff0000 },
    });

    expect(previewContainer.children).toEqual([]);
    expect(destroyedSpriteIds).toEqual(["first"]);
    expect(replacedAnimationIds.at(-1)).toEqual([]);
    const replacementError = new Error("replacement texture failed");
    rejectReplacement?.(replacementError);
    expect(await replacementRender).toBe("error");
    expect(previewContainer.children).toEqual([]);
    expect(receivedErrors).toEqual([
      'Unable to render mapId "standard". replacement texture failed',
    ]);
  });

  it("destroys a deferred ghost when the map lifecycle expires without disposal", async () => {
    let isMapLifecycleValid = true;
    let resolvePlacementSprites:
      | ((placementSprites: readonly unknown[]) => void)
      | undefined;
    const placementSpritesPromise = new Promise<readonly unknown[]>((resolve) => {
      resolvePlacementSprites = resolve;
    });
    const previewContainer = {
      children: [] as unknown[],
      addChild(...sprites: unknown[]) {
        this.children.push(...sprites);
      },
      removeChildren() {
        this.children = [];
      },
    };
    const destroyedSpriteIds: string[] = [];
    const previewRenderer = createPlannerCanvasPlacementPreviewRenderer({
      container: previewContainer,
      destroyPlacementSprites: (placementSprites: readonly { id: string }[]) => {
        destroyedSpriteIds.push(...placementSprites.map((sprite) => sprite.id));
      },
      getPlacementSpriteAnimations: () => [],
      isMapLifecycleCurrent: () => isMapLifecycleValid,
      mapId: "standard",
      onCurrentError: () => undefined,
      onRender: () => undefined,
      replaceAnimations: () => undefined,
    });
    const deferredRender = previewRenderer.render({
      createPlacementSprites: () => placementSpritesPromise,
      visualDescriptor: { alpha: 0.6, tint: 0x00ff00 },
    });

    isMapLifecycleValid = false;
    resolvePlacementSprites?.([
      {
        id: "expired-lifecycle",
        sprite: {
          id: "expired-lifecycle",
          alpha: 1,
          tint: 0xffffff,
        },
      },
    ]);

    expect(await deferredRender).toBe("stale");
    expect(previewContainer.children).toEqual([]);
    expect(destroyedSpriteIds).toEqual(["expired-lifecycle"]);
  });

  it("commits every layered ghost sprite to only the preview container", async () => {
    const committedSprite = { id: "committed", alpha: 1, tint: 0xffffff };
    const committedContainer = { children: [committedSprite] };
    const previewContainer = {
      children: [] as Array<{ id: string; alpha: number; tint: number }>,
      addChild(...sprites: Array<{ id: string; alpha: number; tint: number }>) {
        this.children.push(...sprites);
      },
      removeChildren() {
        this.children = [];
      },
    };
    const destroyedSpriteIds: string[] = [];
    const renderer = createPlannerCanvasPlacementPreviewRenderer({
      container: previewContainer,
      destroyPlacementSprites: (placementSprites: readonly { id: string }[]) => {
        destroyedSpriteIds.push(...placementSprites.map((sprite) => sprite.id));
      },
      getPlacementSpriteAnimations: () => [],
      isMapLifecycleCurrent: () => true,
      mapId: "standard",
      onCurrentError: () => undefined,
      onRender: () => undefined,
      replaceAnimations: () => undefined,
    });
    const layeredSprites = [
      { id: "base", sprite: { id: "base", alpha: 1, tint: 0xffffff } },
      { id: "overlay", sprite: { id: "overlay", alpha: 1, tint: 0xffffff } },
    ];

    const renderStatus = await renderer.render({
      createPlacementSprites: () => Promise.resolve(layeredSprites),
      visualDescriptor: { alpha: 0.4, tint: 0xff0000 },
    });

    expect(renderStatus).toBe("ready");
    expect(previewContainer.children).toEqual([
      { id: "base", alpha: 0.4, tint: 0xff0000 },
      { id: "overlay", alpha: 0.4, tint: 0xff0000 },
    ]);
    expect(committedContainer.children).toEqual([committedSprite]);
    expect(destroyedSpriteIds).toEqual([]);
  });

  it("destroys deferred stale sprites and all owned sprites on dispose", async () => {
    let resolveStaleSprites: ((sprites: readonly unknown[]) => void) | undefined;
    const staleSpritesPromise = new Promise<readonly unknown[]>((resolve) => {
      resolveStaleSprites = resolve;
    });
    const previewContainer = {
      children: [] as unknown[],
      addChild(...sprites: unknown[]) {
        this.children.push(...sprites);
      },
      removeChildren() {
        this.children = [];
      },
    };
    const destroyedSpriteIds: string[] = [];
    let animationDisposeCount = 0;
    const renderer = createPlannerCanvasPlacementPreviewRenderer({
      container: previewContainer,
      destroyPlacementSprites: (placementSprites: readonly { id: string }[]) => {
        destroyedSpriteIds.push(...placementSprites.map((sprite) => sprite.id));
      },
      getPlacementSpriteAnimations: () => [],
      isMapLifecycleCurrent: () => true,
      mapId: "standard",
      onCurrentError: () => undefined,
      onRender: () => undefined,
      replaceAnimations: () => undefined,
      disposeAnimations: () => {
        animationDisposeCount += 1;
      },
    });
    const staleRender = renderer.render({
      createPlacementSprites: () => staleSpritesPromise,
      visualDescriptor: { alpha: 0.6, tint: 0x00ff00 },
    });
    await renderer.render({
      createPlacementSprites: () => Promise.resolve([
        { id: "current", sprite: { id: "current", alpha: 1, tint: 0xffffff } },
      ]),
      visualDescriptor: { alpha: 0.6, tint: 0x00ff00 },
    });
    resolveStaleSprites?.([
      { id: "stale", sprite: { id: "stale", alpha: 1, tint: 0xffffff } },
    ]);

    expect(await staleRender).toBe("stale");
    expect(previewContainer.children).toEqual([
      { id: "current", alpha: 0.6, tint: 0x00ff00 },
    ]);
    let resolveDisposedSprites: ((sprites: readonly unknown[]) => void) | undefined;
    const disposedSpritesPromise = new Promise<readonly unknown[]>((resolve) => {
      resolveDisposedSprites = resolve;
    });
    const disposedRender = renderer.render({
      createPlacementSprites: () => disposedSpritesPromise,
      visualDescriptor: { alpha: 0.4, tint: 0xff0000 },
    });
    renderer.dispose();
    resolveDisposedSprites?.([
      { id: "disposed", sprite: { id: "disposed", alpha: 1, tint: 0xffffff } },
    ]);
    expect(await disposedRender).toBe("stale");
    expect(previewContainer.children).toEqual([]);
    expect(destroyedSpriteIds).toEqual(["stale", "current", "disposed"]);
    expect(animationDisposeCount).toBe(1);
  });
});

describe("PlannerCanvas screenshot preview exclusion", () => {
  it("keeps committed content visible while excluding and restoring the ghost", async () => {
    const committedContainer = { visible: true, children: ["committed"] };
    const mapDisplayOverlayContainer = { visible: true };
    const placementPreviewContainer = { visible: true, children: ["ghost"] };

    const capturedChildren = await renderMapScreenshotWithoutEditorOverlays({
      mapDisplayOverlayContainer,
      placementPreviewContainer,
      renderScreenshot: () => {
        expect(mapDisplayOverlayContainer.visible).toBe(false);
        expect(placementPreviewContainer.visible).toBe(false);
        expect(committedContainer.visible).toBe(true);
        return [...committedContainer.children];
      },
    });

    expect(capturedChildren).toEqual(["committed"]);
    expect(mapDisplayOverlayContainer.visible).toBe(true);
    expect(placementPreviewContainer.visible).toBe(true);
  });

  it("restores both editor overlays when screenshot rendering fails", async () => {
    const screenshotFailure = new Error("extract failed");
    const mapDisplayOverlayContainer = { visible: false };
    const placementPreviewContainer = { visible: true };

    await expect(renderMapScreenshotWithoutEditorOverlays({
      mapDisplayOverlayContainer,
      placementPreviewContainer,
      renderScreenshot: () => Promise.reject(screenshotFailure),
    })).rejects.toBe(screenshotFailure);
    expect(mapDisplayOverlayContainer.visible).toBe(false);
    expect(placementPreviewContainer.visible).toBe(true);
  });
});

describe("PlannerCanvas Pixi initialization", () => {
  it("uses the frozen runtime canvas background color", () => {
    const plannerCanvasSource = readFileSync(
      new URL("../../src/components/planner-canvas.tsx", import.meta.url),
      "utf8",
    );

    expect(plannerCanvasSource).toContain("backgroundColor: 0x141e17,");
  });
});

describe("PlannerCanvas camera state retention", () => {
  it("scopes a committed camera state to same-map canvas lifecycles", () => {
    const cameraStateRetention = createPlannerCameraStateRetention();
    const cameraGeometry: CameraGeometry = {
      mapPixelHeight: 80,
      mapPixelWidth: 100,
      viewportHeight: 160,
      viewportWidth: 200,
    };
    const committedCameraState: CameraState = {
      initialFitZoom: 0.5,
      maximumZoom: 4,
      minimumZoom: 0.25,
      positionX: 120,
      positionY: -40,
      zoom: 1.25,
    };
    const firstCanvasLifecycle = createPlannerCanvasCameraLifecycle({
      cameraStateRetention,
      mapId: "standard",
      renderCameraState: () => {},
    });

    firstCanvasLifecycle.resizeCamera(cameraGeometry);
    firstCanvasLifecycle.commitCameraState(committedCameraState);

    const sameMapCanvasReload = createPlannerCanvasCameraLifecycle({
      cameraStateRetention,
      mapId: "standard",
      renderCameraState: () => {},
    });
    expect(sameMapCanvasReload.resizeCamera(cameraGeometry)).toEqual({
      ...committedCameraState,
      positionY: 62,
    });

    const changedMapCanvas = createPlannerCanvasCameraLifecycle({
      cameraStateRetention,
      mapId: "beach",
      renderCameraState: () => {},
    });
    expect(changedMapCanvas.resizeCamera(cameraGeometry)).toEqual({
      initialFitZoom: 2,
      maximumZoom: 4,
      minimumZoom: 0.25,
      positionX: 100,
      positionY: 80,
      zoom: 2,
    });
  });

  it("renders and retains wheel zoom and pointer pan commits", () => {
    const cameraStateRetention = createPlannerCameraStateRetention();
    const renderedCameraStates: CameraState[] = [];
    const cameraLifecycle = createPlannerCanvasCameraLifecycle({
      cameraStateRetention,
      mapId: "standard",
      renderCameraState: (cameraState) => {
        renderedCameraStates.push(cameraState);
      },
    });
    const wheelZoomCameraState: CameraState = {
      initialFitZoom: 0.5,
      maximumZoom: 4,
      minimumZoom: 0.25,
      positionX: 120,
      positionY: -40,
      zoom: 1.5,
    };
    const pointerPanCameraState: CameraState = {
      ...wheelZoomCameraState,
      positionX: 160,
      positionY: -20,
    };

    cameraLifecycle.commitCameraState(wheelZoomCameraState);
    cameraLifecycle.commitCameraState(pointerPanCameraState);

    expect(renderedCameraStates).toEqual([
      wheelZoomCameraState,
      pointerPanCameraState,
    ]);
    expect(cameraStateRetention.read("standard")).toEqual(pointerPanCameraState);
  });
});

describe("prepared PlannerCanvas resources", () => {
  it("fails before Pixi side effects when the prepared map does not match the requested map or season", () => {
    const preparedCanvasResources = {
      pixi: {} as typeof import("pixi.js"),
      preparedMap: {
        mapId: "standard",
        season: "spring" as const,
        parsedMap: {} as TmxMap,
        renderingContract: {} as import("../../src/rendering/map-rendering-contract").MapRenderingContract,
      },
      resourceGeneration: 1,
    };

    expect(() => assertPreparedCanvasResourcesMatchRequestedMap(
      preparedCanvasResources,
      "beach",
      "spring",
    )).toThrow(/standard.*beach/);
    expect(() => assertPreparedCanvasResourcesMatchRequestedMap(
      preparedCanvasResources,
      "standard",
      "winter",
    )).toThrow(/spring.*winter/);
  });

  it("reuses the prepared contract only while interior decor leaves the parsed map unchanged", () => {
    const preparedMap = {
      mapId: "farmhouse-0",
      season: "spring" as const,
      parsedMap: {} as TmxMap,
      renderingContract: { source: "prepared" } as unknown as import("../../src/rendering/map-rendering-contract").MapRenderingContract,
    };
    const decoratedMap = {} as TmxMap;
    const decoratedRenderingContract = { source: "decorated" } as unknown as import("../../src/rendering/map-rendering-contract").MapRenderingContract;
    const createRenderingContract = (() => decoratedRenderingContract) as typeof import("../../src/rendering/map-rendering-contract").createMapRenderingContract;

    expect(getPlannerCanvasRenderingContract(
      preparedMap,
      preparedMap.parsedMap,
      createRenderingContract,
    )).toBe(preparedMap.renderingContract);
    expect(getPlannerCanvasRenderingContract(
      preparedMap,
      decoratedMap,
      createRenderingContract,
    )).toBe(decoratedRenderingContract);
  });

  it("does not restart initialization when only callback identities change", () => {
    const preparedCanvasResources = {
      pixi: {} as typeof import("pixi.js"),
      preparedMap: {
        mapId: "standard",
        season: "spring" as const,
        parsedMap: {} as TmxMap,
        renderingContract: {} as import("../../src/rendering/map-rendering-contract").MapRenderingContract,
      },
      resourceGeneration: 1,
    };
    const firstDependencies = getPlannerCanvasInitializationDependencies(
      "standard",
      "spring",
      "",
      preparedCanvasResources,
    );
    const secondDependencies = getPlannerCanvasInitializationDependencies(
      "standard",
      "spring",
      "",
      { ...preparedCanvasResources },
    );
    const changedDependencies = getPlannerCanvasInitializationDependencies(
      "standard",
      "spring",
      "",
      { ...preparedCanvasResources, resourceGeneration: 2 },
    );

    expect(secondDependencies).toEqual(firstDependencies);
    expect(changedDependencies).not.toEqual(firstDependencies);
  });
});

describe("PlannerCanvas cleanup", () => {
  it("runs every lifecycle cleanup operation exactly once across repeated cleanup", () => {
    const cleanupOperationNames: string[] = [];
    const cleanUpPlannerCanvas = createPlannerCanvasCleanup({
      disposeInteractionBinding: () => cleanupOperationNames.push("interaction"),
      disposeMapDisplayOverlay: () => cleanupOperationNames.push("map overlay"),
      disposePlacementOverlay: () => cleanupOperationNames.push("placement overlay"),
      clearJoystickCameraPan: () => cleanupOperationNames.push("joystick"),
      clearMapImageExporter: () => cleanupOperationNames.push("exporter"),
      destroyResourceClumpFrameTextures: () => cleanupOperationNames.push("textures"),
      destroyPixiApplication: () => cleanupOperationNames.push("pixi"),
      clearCanvasHost: () => cleanupOperationNames.push("host"),
    });

    cleanUpPlannerCanvas();
    cleanUpPlannerCanvas();

    expect(cleanupOperationNames).toEqual([
      "interaction",
      "map overlay",
      "placement overlay",
      "joystick",
      "exporter",
      "textures",
      "pixi",
      "host",
    ]);
  });

  it("removes real camera listeners and destroys Pixi lifetime resources once", () => {
    const placementClickTestControls = createPlacementClickTestControls();
    if (placementClickTestControls === null) {
      return;
    }
    const cleanupOperationNames: string[] = [];
    const destroyedApplications: string[] = [];
    const pixiApplicationLifetime = createPixiApplicationLifetime<string>(
      (applicationId) => destroyedApplications.push(applicationId),
    );
    pixiApplicationLifetime.setApplication("planner-application");
    pixiApplicationLifetime.finishInitialization();
    const frameTexture = createDestroyablePixiResource();
    const cleanUpPlannerCanvas = createPlannerCanvasCleanup({
      disposeInteractionBinding: () => placementClickTestControls.cameraControls.dispose(),
      disposeMapDisplayOverlay: () => cleanupOperationNames.push("map overlay"),
      disposePlacementOverlay: () => cleanupOperationNames.push("placement overlay"),
      clearJoystickCameraPan: () => cleanupOperationNames.push("joystick"),
      clearMapImageExporter: () => cleanupOperationNames.push("exporter"),
      destroyResourceClumpFrameTextures: () => {
        frameTexture.destroy();
        cleanupOperationNames.push("textures");
      },
      destroyPixiApplication: () => pixiApplicationLifetime.requestDestruction(),
      clearCanvasHost: () => cleanupOperationNames.push("host"),
    });

    cleanUpPlannerCanvas();
    cleanUpPlannerCanvas();
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 100, 80),
    );

    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
    expect(frameTexture.destroyed).toBe(true);
    expect(destroyedApplications).toEqual(["planner-application"]);
    expect(cleanupOperationNames).toEqual([
      "map overlay",
      "placement overlay",
      "joystick",
      "exporter",
      "textures",
      "host",
    ]);
  });

  it("binds and disposes observer, window, and real camera listeners once", () => {
    const placementClickTestControls = createPlacementClickTestControls();
    if (placementClickTestControls === null) {
      return;
    }
    const windowResizeListeners = new Set<() => void>();
    let observedElement: Element | null = null;
    let disconnectCount = 0;
    let resizeCount = 0;
    const interactionBinding = bindPlannerCanvasInteractions(
      placementClickTestControls.canvasElement as unknown as Element,
      () => {
        resizeCount += 1;
      },
      {
        attachCameraControls: () => placementClickTestControls.cameraControls,
        createResizeObserver: () => ({
          observe: (element) => {
            observedElement = element;
          },
          disconnect: () => {
            disconnectCount += 1;
          },
        }),
        windowPort: {
          addEventListener: (_eventName, listener) => {
            windowResizeListeners.add(listener);
          },
          removeEventListener: (_eventName, listener) => {
            windowResizeListeners.delete(listener);
          },
        },
      },
    );

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 100, 80),
    );
    for (const listener of windowResizeListeners) {
      listener();
    }
    interactionBinding.dispose();
    interactionBinding.dispose();
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(2, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(2, 100, 80),
    );

    expect(observedElement).toBe(
      placementClickTestControls.canvasElement as unknown as Element,
    );
    expect(disconnectCount).toBe(1);
    expect(windowResizeListeners).toEqual(new Set());
    expect(resizeCount).toBe(1);
    expect(placementClickTestControls.clickedMapTiles).toEqual([{ x: 5, y: 4 }]);
  });
});

describe("PlannerCanvas exporter commit", () => {
  it("does not schedule warnings when a synchronous exporter callback stales the generation", () => {
    let generationIsCurrent = true;
    const committedSteps: string[] = [];

    const didCommit = commitPlannerCanvasExporterAndWarnings(
      () => generationIsCurrent,
      () => {
        committedSteps.push("exporter");
        generationIsCurrent = false;
      },
      () => committedSteps.push("warnings"),
    );

    expect(didCommit).toBe(false);
    expect(committedSteps).toEqual(["exporter"]);
  });
});

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
  getWheelZoomEnabled?: () => boolean;
  getPointerInteractionMode?: () =>
    | "navigate"
    | "rectangle"
    | "multi-select"
    | "move-selected";
  getMapTileAtPointer: (pointerCoordinates: Readonly<{ x: number; y: number }>) =>
    | Readonly<{ x: number; y: number }>
    | null;
  getPlacementDragTarget?: (pointerCoordinates: Readonly<{ x: number; y: number }>) =>
    | Readonly<{
        sprites: readonly { sprite: TestPlacementDragSprite }[];
      }>
    | null;
  getPlacementDragTileSize?: () => Readonly<{ height: number; width: number }>;
  onMapTileHover?: (
    mapTileCoordinates: Readonly<{ x: number; y: number }> | null,
  ) => void;
  onMapTileClick: (mapTileCoordinates: Readonly<{ x: number; y: number }>) => void;
  getPlacementSelectionKeysAtPointer?: (
    pointerCoordinates: Readonly<{ x: number; y: number }>,
  ) => readonly string[];
  onPlacementSelectionClick?: (placementSelectionKeys: readonly string[]) => void;
  onMapTileRectangle?: (
    startMapTileCoordinates: Readonly<{ x: number; y: number }>,
    endMapTileCoordinates: Readonly<{ x: number; y: number }>,
  ) => void;
  onMoveSelectedPlacements?: (tileDelta: Readonly<{ x: number; y: number }>) => void;
  setCameraState: (cameraState: CameraState) => void;
}>) => Readonly<{ dispose(): void }>;

type TestPlacementDragSprite = Readonly<{
  position: { x: number; y: number; set(x: number, y: number): void };
  getBounds: () => Readonly<{
    containsPoint(x: number, y: number): boolean;
  }>;
}>;

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

  dispatchWheelEvent(wheelEvent: WheelEvent): void {
    for (const eventListener of this.eventListeners.get("wheel") ?? []) {
      eventListener(wheelEvent);
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

function createWheelEvent(
  preventDefaultCallback: () => void,
): WheelEvent {
  return {
    clientX: 100,
    clientY: 80,
    ctrlKey: false,
    deltaY: -120,
    preventDefault: preventDefaultCallback,
  } as WheelEvent;
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
  interactionMode: "navigate" | "rectangle" | "multi-select" | "move-selected" = "navigate",
  wheelZoomEnabled = false,
  placementSelectionKeysAtPointer: readonly string[] = ["item:1"],
): Readonly<{
  canvasElement: TestCanvasElement;
  cameraControls: Readonly<{ dispose(): void }>;
  clickedMapTiles: Array<Readonly<{ x: number; y: number }>>;
  clickedPlacementKeys: Array<readonly string[]>;
  hoveredMapTiles: Array<Readonly<{ x: number; y: number }> | null>;
  selectedMapRectangles: Array<
    Readonly<{
      start: Readonly<{ x: number; y: number }>;
      end: Readonly<{ x: number; y: number }>;
    }>
  >;
  readCameraState: () => CameraState;
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
  const clickedPlacementKeys: Array<readonly string[]> = [];
  const hoveredMapTiles: Array<Readonly<{ x: number; y: number }> | null> = [];
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

  const cameraControls = attachPlannerCameraControls({
    canvasElement: canvasElement as unknown as HTMLCanvasElement,
    getCameraGeometry: () => cameraGeometry,
    getCameraState: () => currentCameraState,
    getWheelZoomEnabled: () => wheelZoomEnabled,
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
    getPlacementSelectionKeysAtPointer: () => placementSelectionKeysAtPointer,
    onPlacementSelectionClick: (placementSelectionKeys) => {
      clickedPlacementKeys.push(placementSelectionKeys);
    },
    onMapTileHover: (mapTileCoordinates) => {
      hoveredMapTiles.push(mapTileCoordinates);
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

  return {
    canvasElement,
    cameraControls,
    clickedMapTiles,
    clickedPlacementKeys,
    hoveredMapTiles,
    selectedMapRectangles,
    readCameraState: () => currentCameraState,
  };
}

function createPlacementDragTestControls(): Readonly<{
  cameraControls: Readonly<{ dispose(): void }>;
  canvasElement: TestCanvasElement;
  committedMoves: Array<Readonly<{ x: number; y: number }>>;
  placementSprite: TestPlacementDragSprite;
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
  const placementSpritePosition = { x: 32, y: 32 };
  const placementSprite = {
    position: {
      ...placementSpritePosition,
      set(x: number, y: number): void {
        placementSpritePosition.x = x;
        placementSpritePosition.y = y;
        this.x = x;
        this.y = y;
      },
    },
    getBounds: () => ({
      containsPoint: (x: number, y: number) =>
        x >= 90 && x <= 110 && y >= 70 && y <= 90,
    }),
  } satisfies TestPlacementDragSprite;
  const committedMoves: Array<Readonly<{ x: number; y: number }>> = [];
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

  const cameraControls = (attachPlannerCameraControls as unknown as PlannerCameraControlsFactory)({
    canvasElement: canvasElement as unknown as HTMLCanvasElement,
    getCameraGeometry: () => cameraGeometry,
    getCameraState: () => currentCameraState,
    getPointerInteractionMode: () => "move-selected",
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
    getPlacementDragTarget: () => ({ sprites: [{ sprite: placementSprite }] }),
    getPlacementDragTileSize: () => ({ height: 16, width: 16 }),
    onMapTileClick: () => {},
    onMoveSelectedPlacements: (tileDelta) => {
      committedMoves.push(tileDelta);
    },
    setCameraState: (cameraState) => {
      currentCameraState = cameraState;
    },
  });

  return {
    cameraControls,
    canvasElement,
    committedMoves,
    placementSprite,
  };
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
  it("destroys every layered sprite and each frame texture it owns", () => {
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
    const thirdSprite = createDestroyablePixiResource();
    const ownedFrameTexture = createDestroyablePixiResource();
    const secondOwnedFrameTexture = createDestroyablePixiResource();

    destroyPlacementSpriteRecords([
      {
        animation: null,
        animationFrameTextures: [],
        paintedTexture: null,
        sprite: firstSprite,
        frameTexture: ownedFrameTexture,
      },
      {
        animation: null,
        animationFrameTextures: [],
        paintedTexture: null,
        sprite: secondSprite,
        frameTexture: secondOwnedFrameTexture,
      },
      {
        animation: null,
        animationFrameTextures: [],
        paintedTexture: null,
        sprite: thirdSprite,
        frameTexture: null,
      },
    ]);

    expect(firstSprite.destroyed).toBe(true);
    expect(secondSprite.destroyed).toBe(true);
    expect(thirdSprite.destroyed).toBe(true);
    expect(ownedFrameTexture.destroyed).toBe(true);
    expect(secondOwnedFrameTexture.destroyed).toBe(true);
  });
});

describe("furniture placement sprite positioning", () => {
  class TestPlacementSprite {
    anchorCoordinates: number[] = [];
    positionCoordinates: number[] = [];
    rotation = 0;
    scale = { x: 1 };
    tint = 0xffffff;
    anchor = {
      set: (...coordinates: number[]) => {
        this.anchorCoordinates = coordinates;
      },
    };
    position = {
      set: (...coordinates: number[]) => {
        this.positionCoordinates = coordinates;
      },
    };
  }

  const pixi = {
    Sprite: TestPlacementSprite,
  } as unknown as typeof import("pixi.js");
  const placementTexture = {
    source: {},
  } as import("pixi.js").Texture;

  function createFurnitureRenderEntry(
    effectiveFootprint: Readonly<{ width: number; height: number }>,
    isFlipped = false,
  ): PlacementRenderEntry {
    return {
      catalogItem: {
        allowedTools: ["cursor"],
        category: "placeable",
        id: "furniture:bench",
        name: "Bench",
        renderingMetadata: {
          bedType: null,
          compositeSprite: null,
          furnitureType: "bench",
          indoors: true,
          isLongTable: false,
          isRug: false,
          isTable: false,
          kind: "furniture",
          outdoors: true,
          rotationSprites: undefined,
          rotationTileSizes: undefined,
          wallMounted: false,
        },
        sprite: { height: 16, kind: "source-rect", width: 32, x: 0, y: 0 },
        textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
        tileSize: { width: 2, height: 1 },
      },
      effectiveFootprint,
      frame: null,
      isFlipped,
      key: "item:44",
      rotationQuarterTurns: 0,
      tileX: 3,
      tileY: 4,
    };
  }

  function createCropRenderEntry(
    effectiveFootprint: Readonly<{ width: number; height: number }>,
  ): PlacementRenderEntry {
    return {
      catalogItem: {
        allowedTools: ["cursor"],
        category: "crop",
        id: "crop:giant_Cauliflower",
        name: "Giant Cauliflower",
        sprite: { height: 64, kind: "source-rect", width: 48, x: 112, y: 512 },
        textureLocalPath: "/game-assets/1.6.15/tilesheets/crops.png",
        tileSize: { width: 3, height: 3 },
      },
      effectiveFootprint,
      frame: null,
      key: "crop:1,2",
      rotationQuarterTurns: 0,
      tileX: 1,
      tileY: 2,
    };
  }

  it("bottom-aligns rotated furniture with its persisted footprint", () => {
    const placementSprite = createPlacementSprite(
      pixi,
      createFurnitureRenderEntry({ width: 1, height: 2 }),
      placementTexture,
      null,
      16,
      20,
      false,
    ).sprite as unknown as TestPlacementSprite;

    expect(placementSprite.anchorCoordinates).toEqual([0, 1]);
    expect(placementSprite.positionCoordinates).toEqual([48, 120]);
  });

  it("mirrors rotated furniture around the persisted footprint center", () => {
    const placementSprite = createPlacementSprite(
      pixi,
      createFurnitureRenderEntry({ width: 1, height: 2 }, true),
      placementTexture,
      null,
      16,
      20,
      false,
    ).sprite as unknown as TestPlacementSprite;

    expect(placementSprite.anchorCoordinates).toEqual([0.5, 1]);
    expect(placementSprite.positionCoordinates).toEqual([56, 120]);
    expect(placementSprite.scale.x).toBe(-1);
  });

  it("preserves unrotated furniture positioning", () => {
    const placementSprite = createPlacementSprite(
      pixi,
      createFurnitureRenderEntry({ width: 2, height: 1 }),
      placementTexture,
      null,
      16,
      20,
      false,
    ).sprite as unknown as TestPlacementSprite;

    expect(placementSprite.anchorCoordinates).toEqual([0, 1]);
    expect(placementSprite.positionCoordinates).toEqual([48, 100]);
  });

  it("bottom-aligns a giant crop to its effective 3 by 3 footprint while preserving one-tile crops", () => {
    const giantCropSprite = createPlacementSprite(
      pixi,
      createCropRenderEntry({ width: 3, height: 3 }),
      placementTexture,
      null,
      16,
      16,
      true,
    ).sprite as unknown as TestPlacementSprite;
    const ordinaryCropSprite = createPlacementSprite(
      pixi,
      createCropRenderEntry({ width: 1, height: 1 }),
      placementTexture,
      null,
      16,
      16,
      false,
    ).sprite as unknown as TestPlacementSprite;

    expect(giantCropSprite.anchorCoordinates).toEqual([0, 1]);
    expect(giantCropSprite.positionCoordinates).toEqual([16, 80]);
    expect(ordinaryCropSprite.anchorCoordinates).toEqual([0, 1]);
    expect(ordinaryCropSprite.positionCoordinates).toEqual([16, 48]);
  });

  it("fails before Pixi allocation for an invalid effective footprint", () => {
    let spriteAllocationCount = 0;
    const allocationTrackingPixi = {
      Sprite: class extends TestPlacementSprite {
        constructor() {
          super();
          spriteAllocationCount += 1;
        }
      },
    } as unknown as typeof import("pixi.js");

    expect(() => createPlacementSprite(
      allocationTrackingPixi,
      createFurnitureRenderEntry({ width: 0, height: 2 }),
      placementTexture,
      null,
      16,
      20,
      false,
    )).toThrow(
      'Placement render entry "item:44" effective footprint width and height must be positive integers; received {"width":0,"height":2}.',
    );
    expect(spriteAllocationCount).toBe(0);
  });
});

describe("layered placement sprite rendering", () => {
  class TestLayerSprite {
    anchorCoordinates: number[] = [];
    positionCoordinates: number[] = [];
    rotation = 0;
    scale = { x: 1 };
    tint = 0xffffff;
    zIndex = 0;
    anchor = {
      set: (...coordinates: number[]) => {
        this.anchorCoordinates = coordinates;
      },
    };
    position = {
      set: (...coordinates: number[]) => {
        this.positionCoordinates = coordinates;
      },
    };
  }

  const pixi = {
    Assets: { load: async () => ({}) },
    Sprite: TestLayerSprite,
  } as unknown as typeof import("pixi.js");

  function createLayerRenderEntry(
    shouldApplySelectionTint: boolean,
    horizontalMirrorCenterX?: number,
  ): PlacementRenderEntry {
    return {
      catalogItem: {
        allowedTools: ["cursor"],
        category: "placeable",
        id: "wildtree_1",
        name: "Oak Tree",
        sprite: { height: 96, kind: "source-rect", width: 48, x: 0, y: 0 },
        textureLocalPath:
          "/game-assets/1.6.15/terrain/tree1_spring.png",
        tileSize: { height: 1, width: 1 },
      },
      effectiveFootprint: { height: 1, width: 1 },
      frame: null,
      key: "item:9",
      pixelGeometry: {
        anchorX: horizontalMirrorCenterX === undefined ? 0 : 1,
        anchorY: 0,
        ...(horizontalMirrorCenterX === undefined
          ? {}
          : { horizontalMirrorCenterX }),
        horizontalScale: horizontalMirrorCenterX === undefined ? 1 : -1,
        positionX: 19.25,
        positionY: 44,
      },
      rotationQuarterTurns: 0,
      shouldApplySelectionTint,
      tileX: 2,
      tileY: 3,
    };
  }

  it("applies generic pixel geometry including texture-width mirroring", () => {
    const placementSprite = createPlacementSprite(
      pixi,
      createLayerRenderEntry(true, 40),
      { source: {}, width: 41 } as import("pixi.js").Texture,
      null,
      16,
      16,
      false,
    ).sprite as unknown as TestLayerSprite;

    expect(placementSprite.anchorCoordinates).toEqual([1, 0]);
    expect(placementSprite.positionCoordinates).toEqual([19.75, 44]);
    expect(placementSprite.scale.x).toBe(-1);
  });

  it("applies an explicit multilayer zIndex to every Pixi sprite", () => {
    const placementSprite = createPlacementSprite(
      pixi,
      { ...createLayerRenderEntry(true), zIndex: 7.5 },
      { source: {}, width: 16 } as import("pixi.js").Texture,
      null,
      16,
      16,
      false,
    ).sprite as unknown as TestLayerSprite;

    expect(placementSprite.zIndex).toBe(7.5);
  });

  it("keeps shadow layers out of selection tint", () => {
    const shadowSprite = createPlacementSprite(
      pixi,
      createLayerRenderEntry(false),
      { source: {}, width: 41 } as import("pixi.js").Texture,
      null,
      16,
      16,
      true,
    ).sprite as unknown as TestLayerSprite;
    const treeSprite = createPlacementSprite(
      pixi,
      createLayerRenderEntry(true),
      { source: {}, width: 16 } as import("pixi.js").Texture,
      null,
      16,
      16,
      true,
    ).sprite as unknown as TestLayerSprite;
    const customTintTreeSprite = createPlacementSprite(
      pixi,
      { ...createLayerRenderEntry(true), tintColor: "#123456" },
      { source: {}, width: 16 } as import("pixi.js").Texture,
      null,
      16,
      16,
      false,
    ).sprite as unknown as TestLayerSprite;

    expect(shadowSprite.tint).toBe(0xffffff);
    expect(treeSprite.tint).toBe(0xffdf4a);
    expect(customTintTreeSprite.tint).toBe(0x123456);
  });

  it("loads each resolved layer texture once", async () => {
    const requestedTexturePaths: string[] = [];
    const textureLoadingPixi = {
      Assets: {
        load: async ({ src }: { src: string }) => {
          requestedTexturePaths.push(src);
          return { src };
        },
      },
    } as unknown as typeof import("pixi.js");
    const treeLayer = createLayerRenderEntry(true);
    const shadowLayer = {
      ...createLayerRenderEntry(false),
      textureLocalPath:
        "/game-assets/1.6.15/terrain/tree_shadow.png",
    };

    await loadResolvedPlacementTextures(
      textureLoadingPixi,
      resolvePlacementTextureEntries([treeLayer, treeLayer, shadowLayer]),
      new Map(),
    );

    expect(requestedTexturePaths).toEqual([
      "/game-assets/1.6.15/terrain/tree1_spring.png",
      "/game-assets/1.6.15/terrain/tree_shadow.png",
    ]);
  });

  it("uses the resolved startup WebP URL to cache and load a Greenhouse entrance texture", async () => {
    const lockedGreenhouseEntranceTexturePath =
      "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet.png";
    const resolvedGreenhouseEntranceTextureUrl =
      "/planner-textures/initial/spring_outdoorsTileSheet.webp";
    const requestedTextureUrls: string[] = [];
    const loadedGreenhouseEntranceTexture = {
      source: {},
    } as import("pixi.js").Texture;
    const placementTexturePromisesByResolvedUrl = new Map<
      string,
      Promise<import("pixi.js").Texture>
    >();
    const greenhouseEntranceLayer = {
      ...createLayerRenderEntry(false),
      textureLocalPath: lockedGreenhouseEntranceTexturePath,
    };

    const placementTexturesByResolvedAssetPath = await loadResolvedPlacementTextures(
      {
        Assets: {
          load: async ({ src }: { src: string }) => {
            requestedTextureUrls.push(src);
            return loadedGreenhouseEntranceTexture;
          },
        },
      } as unknown as typeof import("pixi.js"),
      resolvePlacementTextureEntries([
        greenhouseEntranceLayer,
        greenhouseEntranceLayer,
      ]),
      placementTexturePromisesByResolvedUrl,
    );

    expect(requestedTextureUrls).toEqual([
      resolvedGreenhouseEntranceTextureUrl,
    ]);
    expect([...placementTexturePromisesByResolvedUrl.keys()]).toEqual([
      resolvedGreenhouseEntranceTextureUrl,
    ]);
    expect(
      placementTexturePromisesByResolvedUrl.has(
        lockedGreenhouseEntranceTexturePath,
      ),
    ).toBe(false);
    expect(
      placementTexturesByResolvedAssetPath.get(
        resolvedGreenhouseEntranceTextureUrl,
      ),
    ).toBe(loadedGreenhouseEntranceTexture);
    expect(
      placementTexturesByResolvedAssetPath.has(
        resolvedGreenhouseEntranceTextureUrl,
      ),
    ).toBe(true);
  });

  it("preloads the startup cursor atlas once for shared default placement frames", async () => {
    expect(loadPlannerCanvasInitialTextures).toBeTypeOf("function");
    expect(loadResolvedPlacementTextures).toBeTypeOf("function");
    if (
      loadPlannerCanvasInitialTextures === undefined
      || loadResolvedPlacementTextures === undefined
    ) {
      return;
    }

    const lockedGreenhouseEntranceTexturePath =
      "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet.png";
    const lockedShippingBinTexturePath =
      "/game-assets/1.6.15/sprites/Cursors.png";
    const greenhouseEntranceTextureUrl =
      "/planner-textures/initial/spring_outdoorsTileSheet.webp";
    const resourceClumpTextureUrl =
      "/planner-textures/initial/springobjects.webp";
    const shippingBinTextureUrl =
      "/planner-textures/initial/Cursors-startup.webp";
    const requiredInitialTextureUrls = [
      greenhouseEntranceTextureUrl,
      resourceClumpTextureUrl,
      shippingBinTextureUrl,
    ] as const;
    const loadedTexturesByResolvedUrl = new Map<
      string,
      import("pixi.js").Texture
    >(
      requiredInitialTextureUrls.map((resolvedTextureUrl) => [
        resolvedTextureUrl,
        { source: { label: resolvedTextureUrl } } as import("pixi.js").Texture,
      ]),
    );
    const assetTexturePromisesByResolvedUrl = new Map<
      string,
      Promise<import("pixi.js").Texture>
    >();
    const requestedTextureUrls: string[] = [];
    const textureLoadingPixi = {
      Assets: {
        load: ({ src }: { src: string }) => {
          requestedTextureUrls.push(src);
          const loadedTexture = loadedTexturesByResolvedUrl.get(src);
          if (loadedTexture === undefined) {
            throw new Error(
              `Unexpected initial planner texture URL ${JSON.stringify(src)}.`,
            );
          }
          const assetTexturePromise = Promise.resolve(loadedTexture);
          assetTexturePromisesByResolvedUrl.set(src, assetTexturePromise);
          return assetTexturePromise;
        },
      },
    } as unknown as typeof import("pixi.js");
    const springOutdoorsTileset: RenderingTileset = {
      assetPath: lockedGreenhouseEntranceTexturePath,
      columns: 25,
      firstGid: 1,
      imageHeight: 992,
      imageWidth: 400,
      source: "spring_outdoorsTileSheet",
      tileCount: 1550,
      tileHeight: 16,
      tileWidth: 16,
      usedSpringFallback: false,
    };
    const placementTexturePromisesByResolvedUrl = new Map<
      string,
      Promise<import("pixi.js").Texture>
    >();
    const greenhouseEntranceLayer = {
      ...createLayerRenderEntry(false),
      textureLocalPath: lockedGreenhouseEntranceTexturePath,
    };
    const shippingBinLayer = {
      ...createLayerRenderEntry(false),
      frame: { x: 134, y: 226, width: 30, height: 25 },
      textureLocalPath: lockedShippingBinTexturePath,
    };
    const resolvedInitialPlacementTextureEntries = resolvePlacementTextureEntries([
      greenhouseEntranceLayer,
      greenhouseEntranceLayer,
      shippingBinLayer,
      shippingBinLayer,
    ]);

    const initialTextures = await loadPlannerCanvasInitialTextures(
      textureLoadingPixi,
      [springOutdoorsTileset],
      resolvedInitialPlacementTextureEntries,
      placementTexturePromisesByResolvedUrl,
    );

    expect(requestedTextureUrls).toHaveLength(3);
    expect(new Set(requestedTextureUrls)).toEqual(
      new Set(requiredInitialTextureUrls),
    );
    for (const resolvedTextureUrl of requiredInitialTextureUrls) {
      expect(
        placementTexturePromisesByResolvedUrl.get(resolvedTextureUrl),
      ).toBe(assetTexturePromisesByResolvedUrl.get(resolvedTextureUrl));
    }
    expect(initialTextures.tilesheetTextures.get(0)).toBe(
      loadedTexturesByResolvedUrl.get(greenhouseEntranceTextureUrl),
    );
    expect(initialTextures.resourceClumpTilesheetTexture).toBe(
      loadedTexturesByResolvedUrl.get(resourceClumpTextureUrl),
    );

    const placementTexturesByResolvedAssetPath = await loadResolvedPlacementTextures(
      textureLoadingPixi,
      resolvedInitialPlacementTextureEntries,
      placementTexturePromisesByResolvedUrl,
    );

    expect(requestedTextureUrls).toHaveLength(3);
    expect([...placementTexturesByResolvedAssetPath.keys()]).toEqual([
      greenhouseEntranceTextureUrl,
      shippingBinTextureUrl,
    ]);
    expect(
      placementTexturesByResolvedAssetPath.get(
        greenhouseEntranceTextureUrl,
      ),
    ).toBe(loadedTexturesByResolvedUrl.get(greenhouseEntranceTextureUrl));
    expect(
      placementTexturesByResolvedAssetPath.get(shippingBinTextureUrl),
    ).toBe(loadedTexturesByResolvedUrl.get(shippingBinTextureUrl));
    expect(
      requestedTextureUrls.includes("/planner-textures/initial/Cursors.webp"),
    ).toBe(false);
  });

  it("loads startup-atlas and complete-Cursors textures separately for one locked cursor path", async () => {
    const lockedCursorPath = "/game-assets/1.6.15/sprites/Cursors.png";
    const resolvedEntries = resolvePlacementTextureEntries([
      {
        ...createLayerRenderEntry(false),
        frame: { x: 134, y: 226, width: 30, height: 25 },
        textureLocalPath: lockedCursorPath,
      },
      {
        ...createLayerRenderEntry(false),
        frame: { x: 21, y: 1695, width: 41, height: 67 },
        textureLocalPath: lockedCursorPath,
      },
    ]);
    const requestedTextureUrls: string[] = [];
    const placementTexturePromisesByResolvedUrl = new Map<
      string,
      Promise<import("pixi.js").Texture>
    >();

    const loadedTextures = await loadResolvedPlacementTextures(
      {
        Assets: {
          load: async ({ src }: { src: string }) => {
            requestedTextureUrls.push(src);
            return { source: { src } } as unknown as import("pixi.js").Texture;
          },
        },
      } as unknown as typeof import("pixi.js"),
      resolvedEntries,
      placementTexturePromisesByResolvedUrl,
    );

    const expectedCursorTextureUrls = new Set([
      "/planner-textures/initial/Cursors-startup.webp",
      "/planner-textures/initial/Cursors.webp",
    ]);
    expect(new Set(loadedTextures.keys())).toEqual(expectedCursorTextureUrls);
    expect(new Set(placementTexturePromisesByResolvedUrl.keys())).toEqual(
      expectedCursorTextureUrls,
    );
    expect(new Set(requestedTextureUrls)).toEqual(expectedCursorTextureUrls);
  });

  it("preloads no cursor asset for initial entries without cursor frames", async () => {
    expect(loadPlannerCanvasInitialTextures).toBeTypeOf("function");
    if (loadPlannerCanvasInitialTextures === undefined) {
      return;
    }

    const requestedTextureUrls: string[] = [];
    const resourceClumpTextureUrl = "/planner-textures/initial/springobjects.webp";
    const resourceClumpTexture = {
      source: { src: resourceClumpTextureUrl },
    } as unknown as import("pixi.js").Texture;

    const initialTextures = await loadPlannerCanvasInitialTextures(
      {
        Assets: {
          load: async ({ src }: { src: string }) => {
            requestedTextureUrls.push(src);
            if (src !== resourceClumpTextureUrl) {
              throw new Error(`Unexpected initial texture URL ${JSON.stringify(src)}.`);
            }
            return resourceClumpTexture;
          },
        },
      } as unknown as typeof import("pixi.js"),
      [],
      [],
      new Map(),
    );

    expect(initialTextures.resourceClumpTilesheetTexture).toBe(resourceClumpTexture);
    expect(requestedTextureUrls).toEqual([resourceClumpTextureUrl]);
    expect(requestedTextureUrls).not.toContain(
      "/planner-textures/initial/Cursors-startup.webp",
    );
    expect(requestedTextureUrls).not.toContain(
      "/planner-textures/initial/Cursors.webp",
    );
  });

  it.each([
    {
      catalogItems: undefined,
      missingInputName: "catalog",
      placementSnapshot: createInitialMapPlacementSnapshot("standard"),
    },
    {
      catalogItems: [] as readonly CatalogItem[],
      missingInputName: "snapshot",
      placementSnapshot: undefined,
    },
  ])(
    "returns no initial descriptors and requests no Cursor asset when $missingInputName is undefined",
    async ({ catalogItems, placementSnapshot }) => {
      expect(createInitialResolvedPlacementTextureEntries).toBeTypeOf("function");
      expect(loadPlannerCanvasInitialTextures).toBeTypeOf("function");
      if (
        createInitialResolvedPlacementTextureEntries === undefined
        || loadPlannerCanvasInitialTextures === undefined
      ) {
        return;
      }

      const resolvedInitialPlacementTextureEntries =
        createInitialResolvedPlacementTextureEntries({
          catalogItems,
          isNightMode: false,
          mapId: "standard",
          placementSnapshot,
          season: "spring",
        });
      expect(resolvedInitialPlacementTextureEntries).toEqual([]);

      const requestedTextureUrls: string[] = [];
      const resourceClumpTextureUrl =
        "/planner-textures/initial/springobjects.webp";
      await expect(loadPlannerCanvasInitialTextures(
        {
          Assets: {
            load: async ({ src }: { src: string }) => {
              requestedTextureUrls.push(src);
              return { source: { src } } as unknown as import("pixi.js").Texture;
            },
          },
        } as unknown as typeof import("pixi.js"),
        [],
        resolvedInitialPlacementTextureEntries,
        new Map(),
      )).resolves.toEqual(expect.objectContaining({
        tilesheetTextures: new Map(),
      }));
      expect(requestedTextureUrls).toEqual([resourceClumpTextureUrl]);
      expect(requestedTextureUrls).not.toContain(
        "/planner-textures/initial/Cursors-startup.webp",
      );
      expect(requestedTextureUrls).not.toContain(
        "/planner-textures/initial/Cursors.webp",
      );
    },
  );

  it("creates resolved default entries when both the catalog and snapshot exist", async () => {
    expect(createInitialResolvedPlacementTextureEntries).toBeTypeOf("function");
    expect(loadPlannerCanvasInitialTextures).toBeTypeOf("function");
    if (
      createInitialResolvedPlacementTextureEntries === undefined
      || loadPlannerCanvasInitialTextures === undefined
    ) {
      return;
    }

    const resolvedInitialPlacementTextureEntries =
      createInitialResolvedPlacementTextureEntries({
        catalogItems: loadLockedBuildingCatalog(),
        isNightMode: false,
        mapId: "standard",
        placementSnapshot: createInitialMapPlacementSnapshot("standard"),
        season: "spring",
      });
    expect(resolvedInitialPlacementTextureEntries.filter(
      (resolvedPlacementTextureEntry) =>
        resolvedPlacementTextureEntry.resolvedAssetPath
          === "/planner-textures/initial/Cursors-startup.webp",
    )).toHaveLength(12);
    expect(resolvedInitialPlacementTextureEntries.some(
      (resolvedPlacementTextureEntry) =>
        resolvedPlacementTextureEntry.resolvedAssetPath
          === "/planner-textures/initial/Cursors.webp",
    )).toBe(false);

    const requestedTextureUrls: string[] = [];
    await loadPlannerCanvasInitialTextures(
      {
        Assets: {
          load: async ({ src }: { src: string }) => {
            requestedTextureUrls.push(src);
            return { source: { src } } as unknown as import("pixi.js").Texture;
          },
        },
      } as unknown as typeof import("pixi.js"),
      [],
      resolvedInitialPlacementTextureEntries,
      new Map(),
    );
    expect(requestedTextureUrls.filter((requestedTextureUrl) =>
      requestedTextureUrl === "/planner-textures/initial/Cursors-startup.webp"
    )).toHaveLength(1);
    expect(requestedTextureUrls).not.toContain(
      "/planner-textures/initial/Cursors.webp",
    );
  });

  it("creates Pixi child textures from atlas frames without changing placement geometry", async () => {
    const resolvedPlacementTextureEntry = resolvePlacementTextureEntries([
      {
        ...createLayerRenderEntry(false),
        frame: { x: 134, y: 226, width: 30, height: 25 },
        textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      },
    ])[0];
    expect(resolvedPlacementTextureEntry).toBeDefined();
    if (resolvedPlacementTextureEntry === undefined) {
      return;
    }

    const loadedPlacementTextures = await loadResolvedPlacementTextures(
      {
        Assets: {
          load: async () => ({ source: {} } as import("pixi.js").Texture),
        },
      } as unknown as typeof import("pixi.js"),
      [resolvedPlacementTextureEntry],
      new Map(),
    );
    const placementTexture = loadedPlacementTextures.get(
      "/planner-textures/initial/Cursors-startup.webp",
    );
    expect(placementTexture).toBeDefined();
    if (placementTexture === undefined) {
      return;
    }

    class AtlasFrameTexture {
      destroyed = false;
      height = 25;
      width = 30;
      constructor(public readonly options: unknown) {}
      destroy(): void {
        this.destroyed = true;
      }
    }
    class AtlasSprite extends TestLayerSprite {
      destroyed = false;
      destroy(): void {
        this.destroyed = true;
      }
    }
    const pixi = {
      Rectangle: class AtlasRectangle {
        constructor(
          public readonly x: number,
          public readonly y: number,
          public readonly width: number,
          public readonly height: number,
        ) {}
      },
      Sprite: AtlasSprite,
      Texture: AtlasFrameTexture,
    } as unknown as typeof import("pixi.js");
    const placementSprite = createPlacementSprite(
      pixi,
      {
        ...resolvedPlacementTextureEntry.placementRenderEntry,
        frame: resolvedPlacementTextureEntry.resolvedFrame,
      },
      placementTexture,
      null,
      16,
      16,
      false,
    );
    const ownedAtlasFrameTexture = placementSprite.frameTexture as unknown as AtlasFrameTexture;

    expect(ownedAtlasFrameTexture.options).toEqual(expect.objectContaining({
      frame: expect.objectContaining({ x: 134, y: 226, width: 30, height: 25 }),
    }));
    expect((placementSprite.sprite as unknown as AtlasSprite).positionCoordinates)
      .toEqual([19.25, 44]);

    destroyPlacementSprites([placementSprite]);
    expect((placementSprite.sprite as unknown as AtlasSprite).destroyed).toBe(true);
    expect(ownedAtlasFrameTexture.destroyed).toBe(true);
  });

  it("creates and destroys the connected Watered HoeDirt frame through the shared Canvas path", async () => {
    const catalogItem = {
      id: "hoedirt",
      name: "Tilled Dirt",
      category: "floor" as const,
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/terrain/hoeDirt.png",
      sprite: { kind: "source-rect" as const, x: 0, y: 0, width: 16, height: 16 },
      allowedTools: ["cursor", "multi-select", "fill", "erase"] as const,
      renderingMetadata: {
        kind: "hoe-dirt" as const,
        seasonalTextureLocalPaths: {
          spring: "/game-assets/1.6.15/terrain/hoeDirt.png",
          summer: "/game-assets/1.6.15/terrain/hoeDirt.png",
          fall: "/game-assets/1.6.15/terrain/hoeDirt.png",
          winter: "/game-assets/1.6.15/terrain/hoeDirtSnow.png",
        },
      },
    };
    const createHoeDirtItem = (instanceId: number, x: number) => ({
      instanceId,
      itemId: "hoedirt",
      x,
      y: 0,
      layer: "path" as const,
      rotation: 0,
      footprint: { width: 1, height: 1 },
      variant: 1,
      tintColor: "#ffffff",
      locked: false,
      isRug: false,
      isGrass: false,
      isTable: false,
      isLongTable: false,
      flipped: false,
      bedType: null,
    });
    const renderEntries = createPlacementRenderEntries({
      ...createEmptyPlacementSnapshot(),
      items: [createHoeDirtItem(1, 0), createHoeDirtItem(2, 1)],
      nextItemId: 3,
    }, [catalogItem]);
    const wateredOverlayEntry = renderEntries.find(
      (entry) => entry.key === "item:1" && entry.frame?.x === 80,
    );
    if (wateredOverlayEntry === undefined) {
      throw new Error("Expected connected Watered HoeDirt overlay frame x=80.");
    }
    const requestedTexturePaths: string[] = [];
    await loadResolvedPlacementTextures({
      Assets: {
        load: async ({ src }: { src: string }) => {
          requestedTexturePaths.push(src);
          return { source: {} };
        },
      },
    } as unknown as typeof import("pixi.js"), resolvePlacementTextureEntries(renderEntries), new Map());

    class HoeDirtFrameTexture {
      destroyed = false;
      height = 16;
      width = 16;
      constructor(public readonly options: unknown) {}
      destroy(): void {
        this.destroyed = true;
      }
    }
    class HoeDirtSprite extends TestLayerSprite {
      destroyed = false;
      destroy(): void {
        this.destroyed = true;
      }
    }
    const pixiWithFrames = {
      Rectangle: class HoeDirtRectangle {
        constructor(
          public readonly x: number,
          public readonly y: number,
          public readonly width: number,
          public readonly height: number,
        ) {}
      },
      Sprite: HoeDirtSprite,
      Texture: HoeDirtFrameTexture,
    } as unknown as typeof import("pixi.js");
    const placementSprite = createPlacementSprite(
      pixiWithFrames,
      wateredOverlayEntry,
      { source: {} } as import("pixi.js").Texture,
      null,
      16,
      16,
      false,
    );
    const ownedFrameTexture = placementSprite.frameTexture as unknown as HoeDirtFrameTexture;

    expect(requestedTexturePaths).toEqual([
      "/game-assets/1.6.15/terrain/hoeDirt.png",
    ]);
    expect(ownedFrameTexture.options).toEqual(expect.objectContaining({
      frame: expect.objectContaining({ x: 80, y: 48, width: 16, height: 16 }),
    }));
    destroyPlacementSprites([placementSprite]);
    expect((placementSprite.sprite as unknown as HoeDirtSprite).destroyed).toBe(true);
    expect(ownedFrameTexture.destroyed).toBe(true);
  });

  it("shares one sprinkler texture and destroys selected base and attachment sprites", async () => {
    const catalogItem = {
      id: "object:621",
      name: "Quality Sprinkler",
      category: "placeable" as const,
      tileSize: { width: 1, height: 1 },
      textureLocalPath:
        "/game-assets/1.6.15/tilesheets/springobjects.png",
      sprite: { kind: "sprite-index" as const, index: 621 },
      allowedTools: ["cursor", "multi-select", "erase"] as const,
      placementShadow: {
        alpha: 0.5,
        textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
      },
      renderingMetadata: { kind: "sprinkler" as const, baseRadius: 1 },
    };
    const renderEntries = createPlacementRenderEntries(
      {
        ...createEmptyPlacementSnapshot(),
        items: [
          {
            instanceId: 9,
            itemId: "object:621",
            x: 2,
            y: 3,
            layer: "item" as const,
            rotation: 0,
            footprint: { width: 1, height: 1 },
            variant: 1,
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
        nextItemId: 10,
      },
      [catalogItem],
    );
    const requestedTexturePaths: string[] = [];

    await loadResolvedPlacementTextures(
      {
        Assets: {
          load: async ({ src }: { src: string }) => {
            requestedTexturePaths.push(src);
            return { source: {} };
          },
        },
      } as unknown as typeof import("pixi.js"),
      resolvePlacementTextureEntries(renderEntries),
      new Map(),
    );

    class SprinklerFrameTexture {
      destroyed = false;
      height = 16;
      width = 16;
      constructor(public readonly options: unknown) {}
      destroy(): void {
        this.destroyed = true;
      }
    }
    class SprinklerSprite extends TestLayerSprite {
      destroyed = false;
      destroy(): void {
        this.destroyed = true;
      }
    }
    const pixiWithFrames = {
      Rectangle: class SprinklerRectangle {
        constructor(
          public readonly x: number,
          public readonly y: number,
          public readonly width: number,
          public readonly height: number,
        ) {}
      },
      Sprite: SprinklerSprite,
      Texture: SprinklerFrameTexture,
    } as unknown as typeof import("pixi.js");
    const placementSprites = renderEntries.map((renderEntry) =>
      createPlacementSprite(
        pixiWithFrames,
        renderEntry,
        { source: {} } as import("pixi.js").Texture,
        null,
        16,
        16,
        true,
      ),
    );
    const attachmentFrameTexture = placementSprites[2]
      ?.frameTexture as unknown as SprinklerFrameTexture;

    expect(requestedTexturePaths).toEqual([
      "/game-assets/1.6.15/sprites/shadow.png",
      "/game-assets/1.6.15/tilesheets/springobjects.png",
    ]);
    expect(
      placementSprites.map(
        (placementSprite) =>
          (placementSprite.sprite as unknown as SprinklerSprite).tint,
      ),
    ).toEqual([0xffffff, 0xffdf4a, 0xffdf4a]);
    expect(
      (placementSprites[2]?.sprite as unknown as SprinklerSprite)
        .positionCoordinates,
    ).toEqual([32, 48]);
    expect(attachmentFrameTexture.options).toEqual(expect.objectContaining({
      frame: expect.objectContaining({ x: 64, y: 608, width: 16, height: 16 }),
    }));

    destroyPlacementSprites(placementSprites);
    expect(
      placementSprites.map(
        (placementSprite) =>
          (placementSprite.sprite as unknown as SprinklerSprite).destroyed,
      ),
    ).toEqual([true, true, true]);
    expect(
      placementSprites.map(
        (placementSprite) =>
          (placementSprite.frameTexture as unknown as SprinklerFrameTexture | null)
            ?.destroyed,
      ),
    ).toEqual([undefined, true, true]);
  });

  it("keeps a non-startup window Cursor frame on the complete Cursors WebP through the shared Canvas path", async () => {
    const windowCatalogItem = {
      id: "furniture_1614",
      name: "Window",
      category: "placeable" as const,
      tileSize: { width: 1, height: 2 },
      textureLocalPath: "/game-assets/1.6.15/tilesheets/furniture.png",
      sprite: { kind: "source-rect" as const, x: 0, y: 0, width: 16, height: 32 },
      allowedTools: ["cursor", "multi-select", "erase"] as const,
      renderingMetadata: {
        kind: "furniture" as const,
        furnitureType: "window",
        indoors: true,
        outdoors: false,
        rotationSprites: undefined,
        rotationTileSizes: undefined,
        wallMounted: true,
        isWindow: true as const,
        isRug: false,
        isTable: false,
        isLongTable: false,
        bedType: null,
        compositeSprite: null,
      },
    };
    const renderEntries = createPlacementRenderEntries({
      ...createEmptyPlacementSnapshot(),
      items: [{
        instanceId: 42, itemId: windowCatalogItem.id, x: 2, y: 3, layer: "item" as const,
        rotation: 0, footprint: { width: 1, height: 2 }, variant: 0, tintColor: "#123456",
        locked: false, isRug: false, isGrass: false, isTable: false, isLongTable: false,
        flipped: false, bedType: null,
      }],
      nextItemId: 43,
    }, [windowCatalogItem]);
    const resolvedRenderEntries = resolvePlacementTextureEntries(renderEntries);
    const requestedTexturePaths: string[] = [];
    await loadResolvedPlacementTextures({
      Assets: { load: async ({ src }: { src: string }) => {
        requestedTexturePaths.push(src);
        return { source: {} };
      } },
    } as unknown as typeof import("pixi.js"), resolvedRenderEntries, new Map());

    class WindowFrameTexture {
      destroyed = false;
      width = 41;
      height = 67;
      constructor(public readonly options: unknown) {}
      destroy(): void { this.destroyed = true; }
    }
    class WindowSprite extends TestLayerSprite {
      destroyed = false;
      destroy(): void { this.destroyed = true; }
    }
    const pixi = {
      Rectangle: class WindowRectangle {
        constructor(
          public readonly x: number,
          public readonly y: number,
          public readonly width: number,
          public readonly height: number,
        ) {}
      },
      Sprite: WindowSprite,
      Texture: WindowFrameTexture,
    } as unknown as typeof import("pixi.js");
    const placementSprites = resolvedRenderEntries.map((resolvedRenderEntry) => createPlacementSprite(
      pixi,
      {
        ...resolvedRenderEntry.placementRenderEntry,
        frame: resolvedRenderEntry.resolvedFrame,
      },
      { source: {} } as import("pixi.js").Texture,
      null,
      16,
      16,
      true,
    ));

    expect(requestedTexturePaths).toEqual([
      "/game-assets/1.6.15/tilesheets/furniture.png",
      "/planner-textures/initial/Cursors.webp",
    ]);
    expect(placementSprites.map((placementSprite) =>
      (placementSprite.sprite as unknown as WindowSprite).tint,
    )).toEqual([0xffdf4a, 0xffffff]);
    expect((placementSprites[1]?.sprite as unknown as WindowSprite).positionCoordinates)
      .toEqual([24, 48]);
    expect((placementSprites[1]?.sprite as unknown as WindowSprite).anchorCoordinates)
      .toEqual([4.75 / 41, 5.5 / 67]);
    expect((placementSprites[1]?.frameTexture as unknown as WindowFrameTexture).options)
      .toEqual(expect.objectContaining({
        frame: expect.objectContaining({ x: 21, y: 1695, width: 41, height: 67 }),
      }));

    destroyPlacementSprites(placementSprites);
    expect(placementSprites.map((placementSprite) =>
      (placementSprite.sprite as unknown as WindowSprite).destroyed,
    )).toEqual([true, true]);
    expect(placementSprites.map((placementSprite) =>
      (placementSprite.frameTexture as unknown as WindowFrameTexture).destroyed,
    )).toEqual([true, true]);
  });

  it("keeps all four furniture-fire animation frames on the complete Cursors WebP and releases their child textures", async () => {
    expect(loadResolvedPlacementTextures).toBeTypeOf("function");
    if (loadResolvedPlacementTextures === undefined) {
      return;
    }

    const furnitureFireFrames = [276, 288, 300, 312].map((x) => ({
      x,
      y: 1985,
      width: 12,
      height: 11,
    }));
    const resolvedFurnitureFireEntry = resolvePlacementTextureEntries([
      {
        ...createLayerRenderEntry(false),
        animation: {
          frameDurationMilliseconds: 100,
          frames: furnitureFireFrames,
          kind: "frame-cycle" as const,
          timeOffsetMilliseconds: 0,
        },
        frame: furnitureFireFrames[0]!,
        textureLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
      },
    ])[0];
    expect(resolvedFurnitureFireEntry).toBeDefined();
    if (resolvedFurnitureFireEntry === undefined) {
      return;
    }
    expect(resolvedFurnitureFireEntry.resolvedAssetPath).toBe(
      "/planner-textures/initial/Cursors.webp",
    );
    expect(resolvedFurnitureFireEntry.resolvedFrame).toEqual(
      furnitureFireFrames[0],
    );

    const loadedPlacementTextures = await loadResolvedPlacementTextures(
      {
        Assets: {
          load: async ({ src }: { src: string }) => {
            expect(src).toBe("/planner-textures/initial/Cursors.webp");
            return { source: {} } as import("pixi.js").Texture;
          },
        },
      } as unknown as typeof import("pixi.js"),
      [resolvedFurnitureFireEntry],
      new Map(),
    );
    const placementTexture = loadedPlacementTextures.get(
      "/planner-textures/initial/Cursors.webp",
    );
    expect(placementTexture).toBeDefined();
    if (placementTexture === undefined) {
      return;
    }

    class FurnitureFireFrameTexture {
      destroyed = false;
      constructor(public readonly options: unknown) {}
      destroy(): void {
        this.destroyed = true;
      }
    }
    class FurnitureFireSprite extends TestLayerSprite {
      destroyed = false;
      texture: unknown;
      constructor(input: Readonly<{ texture: unknown }>) {
        super();
        this.texture = input.texture;
      }
      destroy(): void {
        this.destroyed = true;
      }
    }
    const pixi = {
      Rectangle: class FurnitureFireRectangle {
        constructor(
          public readonly x: number,
          public readonly y: number,
          public readonly width: number,
          public readonly height: number,
        ) {}
      },
      Sprite: FurnitureFireSprite,
      Texture: FurnitureFireFrameTexture,
    } as unknown as typeof import("pixi.js");
    const placementSprite = createPlacementSprite(
      pixi,
      {
        ...resolvedFurnitureFireEntry.placementRenderEntry,
        frame: resolvedFurnitureFireEntry.resolvedFrame,
      },
      placementTexture,
      null,
      16,
      16,
      false,
    );
    const ownedFrameTextures = [
      placementSprite.frameTexture,
      ...placementSprite.animationFrameTextures,
    ] as unknown as FurnitureFireFrameTexture[];

    expect(ownedFrameTextures.map((ownedFrameTexture) =>
      (ownedFrameTexture.options as { frame: unknown }).frame,
    )).toEqual(furnitureFireFrames);

    destroyPlacementSprites([placementSprite]);
    expect((placementSprite.sprite as unknown as FurnitureFireSprite).destroyed)
      .toBe(true);
    expect(ownedFrameTextures.every((ownedFrameTexture) => ownedFrameTexture.destroyed))
      .toBe(true);
  });

  it("loads one chest texture and destroys all three chest layer frames", async () => {
    const chestCatalogItem = {
      id: "big-craftable:130",
      name: "Chest",
      category: "placeable" as const,
      tileSize: { width: 1, height: 1 },
      textureLocalPath: "/game-assets/1.6.15/sprites/craftables.png",
      sprite: { kind: "sprite-index" as const, index: 130 },
      allowedTools: ["cursor", "multi-select", "erase"] as const,
      paintableChest: { kind: "paintable-chest" as const },
    };
    const chestRenderEntries = createPlacementRenderEntries({
      ...createEmptyPlacementSnapshot(),
      items: [{
        instanceId: 10, itemId: chestCatalogItem.id, x: 2, y: 3, layer: "item" as const,
        rotation: 0, footprint: { width: 1, height: 1 }, variant: 0, tintColor: "#123abc",
        locked: false, isRug: false, isGrass: false, isTable: false, isLongTable: false,
        flipped: false, bedType: null,
      }],
      nextItemId: 11,
    }, [chestCatalogItem]);
    const requestedTexturePaths: string[] = [];
    await loadResolvedPlacementTextures({
      Assets: { load: async ({ src }: { src: string }) => {
        requestedTexturePaths.push(src);
        return { source: {} };
      } },
    } as unknown as typeof import("pixi.js"), resolvePlacementTextureEntries(chestRenderEntries), new Map());

    class ChestFrameTexture {
      destroyed = false;
      constructor(public readonly options: unknown) {}
      destroy(): void { this.destroyed = true; }
    }
    class ChestSprite extends TestLayerSprite {
      destroyed = false;
      destroy(): void { this.destroyed = true; }
    }
    const pixiWithFrames = {
      Rectangle: class ChestRectangle {},
      Sprite: ChestSprite,
      Texture: ChestFrameTexture,
    } as unknown as typeof import("pixi.js");
    let sharedChestTextureDestroyCount = 0;
    const sharedChestTexture = {
      destroy(): void { sharedChestTextureDestroyCount += 1; },
      source: {},
    } as unknown as import("pixi.js").Texture;
    const chestPlacementSprites = chestRenderEntries.map((renderEntry) => createPlacementSprite(
      pixiWithFrames, renderEntry, sharedChestTexture,
      null, 16, 16, true,
    ));

    expect(requestedTexturePaths).toEqual(["/game-assets/1.6.15/sprites/craftables.png"]);
    expect(chestPlacementSprites).toHaveLength(3);
    expect(chestPlacementSprites.map((placementSprite) => (placementSprite.sprite as unknown as ChestSprite).tint)).toEqual([0x123abc, 0xffffff, 0xffffff]);
    destroyPlacementSprites(chestPlacementSprites);
    expect(chestPlacementSprites.map((placementSprite) => (placementSprite.sprite as unknown as ChestSprite).destroyed)).toEqual([true, true, true]);
    expect(chestPlacementSprites.map((placementSprite) => (placementSprite.frameTexture as unknown as ChestFrameTexture).destroyed)).toEqual([true, true, true]);
    expect(sharedChestTextureDestroyCount).toBe(0);
  });

  it("rejects invalid sprinkler metadata before Canvas frame or sprite allocation", () => {
    let frameTextureAllocationCount = 0;
    let spriteAllocationCount = 0;
    const allocationTrackingPixi = {
      Rectangle: class SprinklerRectangle {},
      Sprite: class SprinklerSprite {
        constructor() {
          spriteAllocationCount += 1;
        }
      },
      Texture: class SprinklerFrameTexture {
        constructor() {
          frameTextureAllocationCount += 1;
        }
      },
    } as unknown as typeof import("pixi.js");

    expect(() => {
      const renderEntries = createPlacementRenderEntries(
        {
          ...createEmptyPlacementSnapshot(),
          items: [
            {
              instanceId: 9,
              itemId: "object:621",
              x: 2,
              y: 3,
              layer: "item" as const,
              rotation: 0,
              footprint: { width: 1, height: 1 },
              variant: 1,
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
          nextItemId: 10,
        },
        [
          {
            id: "object:621",
            name: "Quality Sprinkler",
            category: "placeable",
            tileSize: { width: 1, height: 1 },
            textureLocalPath:
              "/game-assets/1.6.15/tilesheets/springobjects.png",
            sprite: { kind: "sprite-index", index: 621 },
            allowedTools: ["cursor", "multi-select", "erase"],
            placementShadow: {
              alpha: 0.5,
              textureLocalPath: "/game-assets/1.6.15/sprites/shadow.png",
            },
          },
        ],
      );

      for (const renderEntry of renderEntries) {
        createPlacementSprite(
          allocationTrackingPixi,
          renderEntry,
          { source: {} } as import("pixi.js").Texture,
          null,
          16,
          16,
          false,
        );
      }
    }).toThrow(
      'Sprinkler catalog item "object:621" requires rendering metadata {"kind":"sprinkler","baseRadius":1}; received undefined.',
    );
    expect(frameTextureAllocationCount).toBe(0);
    expect(spriteAllocationCount).toBe(0);
  });
});

describe("PlannerCanvas placement render failures", () => {
  it("reports an error only for the current Canvas lifecycle", () => {
    const receivedErrors: string[] = [];

    const didReportStaleError = reportCurrentPlannerCanvasError({
      isMapLifecycleCurrent: () => false,
      message: "stale failure",
      onCurrentError: (message) => receivedErrors.push(message),
    });
    const didReportCurrentError = reportCurrentPlannerCanvasError({
      isMapLifecycleCurrent: () => true,
      message: "current failure",
      onCurrentError: (message) => receivedErrors.push(message),
    });

    expect(didReportStaleError).toBe(false);
    expect(didReportCurrentError).toBe(true);
    expect(receivedErrors).toEqual(["current failure"]);
  });

  it("reports a current placement failure without committing the render", async () => {
    const placementFailure = new Error('Placement value "broken-floor" is invalid.');
    const receivedErrors: string[] = [];
    let committedRenderCount = 0;

    const renderStatus = await settlePlannerCanvasPlacementRender({
      createPlacementSprites: () => Promise.reject(placementFailure),
      isRenderCurrent: () => true,
      mapId: "standard",
      onCurrentCommitFailure: () => undefined,
      onCurrentError: (message) => receivedErrors.push(message),
      onCurrentReady: () => {
        committedRenderCount += 1;
      },
      onStaleReady: () => undefined,
    });

    expect(renderStatus).toBe("error");
    expect(receivedErrors).toEqual([
      'Unable to render mapId "standard". Placement value "broken-floor" is invalid.',
    ]);
    expect(committedRenderCount).toBe(0);
  });

  it("destroys every fulfilled sprite when one parallel sprite creation fails", async () => {
    const firstPlacementSprite = { id: "first" };
    const laterPlacementSprite = { id: "later" };
    const placementFailure = new Error("second placement failed");
    const destroyedPlacementSpriteIds: string[] = [];

    await expect(
      createPlacementSpriteBatch({
        destroyCreatedPlacementSprites: (createdPlacementSprites) => {
          destroyedPlacementSpriteIds.push(
            ...createdPlacementSprites.map((placementSprite) => placementSprite.id),
          );
        },
        placementSpritePromises: [
          Promise.resolve(firstPlacementSprite),
          Promise.reject(placementFailure),
          Promise.resolve(laterPlacementSprite),
        ],
      }),
    ).rejects.toBe(placementFailure);
    expect(destroyedPlacementSpriteIds).toEqual(["first", "later"]);
  });

  it("rolls back unowned sprites when the current render commit fails", async () => {
    const placementSprite = { id: "unowned" };
    const commitFailure = new Error("placement commit failed");
    const rolledBackPlacementSpriteIds: string[] = [];
    const receivedErrors: string[] = [];

    const renderStatus = await settlePlannerCanvasPlacementRender({
      createPlacementSprites: () => Promise.resolve([placementSprite]),
      isRenderCurrent: () => true,
      mapId: "standard",
      onCurrentCommitFailure: (placementSprites) => {
        rolledBackPlacementSpriteIds.push(
          ...placementSprites.map((createdPlacementSprite) => createdPlacementSprite.id),
        );
      },
      onCurrentError: (message) => receivedErrors.push(message),
      onCurrentReady: () => {
        throw commitFailure;
      },
      onStaleReady: () => undefined,
    });

    expect(renderStatus).toBe("error");
    expect(rolledBackPlacementSpriteIds).toEqual(["unowned"]);
    expect(receivedErrors).toEqual([
      'Unable to render mapId "standard". placement commit failed',
    ]);
  });

  it("does not roll back sprites after the current renderer has claimed ownership", async () => {
    const rendererFailure = new Error("renderer failed after ownership");
    let rollbackCount = 0;
    const receivedErrors: string[] = [];

    const renderStatus = await settlePlannerCanvasPlacementRender({
      createPlacementSprites: () => Promise.resolve([{ id: "owned" }]),
      isRenderCurrent: () => true,
      mapId: "standard",
      onCurrentCommitFailure: () => {
        rollbackCount += 1;
      },
      onCurrentError: (message) => receivedErrors.push(message),
      onCurrentReady: (_placementSprites, claimPlacementSpriteOwnership) => {
        claimPlacementSpriteOwnership();
        throw rendererFailure;
      },
      onStaleReady: () => undefined,
    });

    expect(renderStatus).toBe("error");
    expect(rollbackCount).toBe(0);
    expect(receivedErrors).toEqual([
      'Unable to render mapId "standard". renderer failed after ownership',
    ]);
  });

  it("preserves current commit and rollback failures in the reported error", async () => {
    const commitFailure = new Error("commit failed");
    const rollbackFailure = new Error("commit rollback failed");
    let reportedError: unknown;
    let reportedMessage = "";

    const renderStatus = await settlePlannerCanvasPlacementRender({
      createPlacementSprites: () => Promise.resolve([{ id: "unowned" }]),
      isRenderCurrent: () => true,
      mapId: "standard",
      onCurrentCommitFailure: () => {
        throw rollbackFailure;
      },
      onCurrentError: (message, caughtError) => {
        reportedMessage = message;
        reportedError = caughtError;
      },
      onCurrentReady: () => {
        throw commitFailure;
      },
      onStaleReady: () => undefined,
    });

    expect(renderStatus).toBe("error");
    expect(reportedMessage).toContain("Placement sprite commit and rollback both failed.");
    expect(reportedError).toBeInstanceOf(AggregateError);
    expect((reportedError as AggregateError).errors).toEqual([
      commitFailure,
      rollbackFailure,
    ]);
  });

  it("does not swallow a stale placement rollback failure", async () => {
    const rollbackFailure = new Error("stale sprite rollback failed");

    await expect(
      settlePlannerCanvasPlacementRender({
        createPlacementSprites: () => Promise.resolve([{ id: "stale" }]),
        isRenderCurrent: () => false,
        mapId: "standard",
        onCurrentCommitFailure: () => undefined,
        onCurrentError: () => undefined,
        onCurrentReady: () => undefined,
        onStaleReady: () => {
          throw rollbackFailure;
        },
      }),
    ).rejects.toBe(rollbackFailure);
  });

  it("preserves both sprite creation and batch rollback failures", async () => {
    const placementFailure = new Error("placement creation failed");
    const rollbackFailure = new Error("placement rollback failed");
    let receivedError: unknown;

    try {
      await createPlacementSpriteBatch({
        destroyCreatedPlacementSprites: () => {
          throw rollbackFailure;
        },
        placementSpritePromises: [
          Promise.resolve({ id: "created" }),
          Promise.reject(placementFailure),
        ],
      });
    } catch (caughtError) {
      receivedError = caughtError;
    }

    expect(receivedError).toBeInstanceOf(AggregateError);
    expect((receivedError as AggregateError).errors).toEqual([
      placementFailure,
      rollbackFailure,
    ]);
  });

  it("validates an invalid tint before allocating a frame texture or sprite", () => {
    let frameTextureAllocationCount = 0;
    let spriteAllocationCount = 0;
    const pixi = {
      Rectangle: class TestRectangle {},
      Sprite: class TestSprite {
        constructor() {
          spriteAllocationCount += 1;
        }
      },
      Texture: class TestTexture {
        constructor() {
          frameTextureAllocationCount += 1;
        }
      },
    } as unknown as typeof import("pixi.js");
    const placementRenderEntry = {
      effectiveFootprint: { height: 1, width: 1 },
      frame: { height: 16, width: 16, x: 0, y: 0 },
      key: "item:invalid-tint",
      tintColor: "not-a-color",
    } as PlacementRenderEntry;

    expect(() =>
      createPlacementSprite(
        pixi,
        placementRenderEntry,
        { source: {} } as import("pixi.js").Texture,
        null,
        16,
        16,
        false,
      ),
    ).toThrow('Placement sprite tint color must be a six-digit hexadecimal color; received "not-a-color".');
    expect(frameTextureAllocationCount).toBe(0);
    expect(spriteAllocationCount).toBe(0);
  });

  it("releases an owned frame texture when Pixi sprite construction fails", () => {
    let wasFrameTextureDestroyed = false;
    const pixi = {
      Rectangle: class TestRectangle {},
      Sprite: class TestSprite {
        constructor() {
          throw new Error("sprite construction failed");
        }
      },
      Texture: class TestTexture {
        destroy(): void { wasFrameTextureDestroyed = true; }
      },
    } as unknown as typeof import("pixi.js");
    const placementRenderEntry = {
      effectiveFootprint: { height: 1, width: 1 },
      frame: { height: 16, width: 16, x: 0, y: 0 },
      key: "item:failed-sprite",
    } as PlacementRenderEntry;

    expect(() => createPlacementSprite(
      pixi,
      placementRenderEntry,
      { source: {} } as import("pixi.js").Texture,
      null,
      16,
      16,
      false,
    )).toThrow("sprite construction failed");
    expect(wasFrameTextureDestroyed).toBe(true);
  });

  it("releases owned sprite and frame resources when placement positioning fails", () => {
    let wasFrameTextureDestroyed = false;
    let wasSpriteDestroyed = false;
    const pixi = {
      Rectangle: class TestRectangle {},
      Sprite: class TestSprite {
        anchor = { set: () => { throw new Error("positioning failed"); } };
        position = { set: () => undefined };
        scale = { x: 1, y: 1, set: () => undefined };
        destroy(): void { wasSpriteDestroyed = true; }
      },
      Texture: class TestTexture {
        destroy(): void { wasFrameTextureDestroyed = true; }
      },
    } as unknown as typeof import("pixi.js");
    const placementRenderEntry = {
      effectiveFootprint: { height: 1, width: 1 },
      frame: { height: 16, width: 16, x: 0, y: 0 },
      key: "item:failed-positioning",
      tileX: 1,
      tileY: 2,
      catalogItem: { category: "placeable", tileSize: { width: 1, height: 1 } },
      rotationQuarterTurns: 0,
    } as PlacementRenderEntry;

    expect(() => createPlacementSprite(
      pixi, placementRenderEntry, { source: {} } as import("pixi.js").Texture,
      null, 16, 16, false,
    )).toThrow("positioning failed");
    expect(wasSpriteDestroyed).toBe(true);
    expect(wasFrameTextureDestroyed).toBe(true);
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

describe("findRenderedPlacementSelectionKeysAtPointer", () => {
  it("orders overlapping hits by descending zIndex and later draw order", () => {
    const findRenderedPlacementSelectionKeysAtPointer = (
      plannerCanvasModule as unknown as {
        findRenderedPlacementSelectionKeysAtPointer?: (
          renderedPlacementSprites: readonly Readonly<{
            placementKey: string;
            sprite: Readonly<{
              zIndex: number;
              getBounds(): Readonly<{
                containsPoint(x: number, y: number): boolean;
              }>;
            }>;
          }>[],
          pointerCoordinates: Readonly<{ x: number; y: number }>,
        ) => readonly string[];
      }
    ).findRenderedPlacementSelectionKeysAtPointer;

    if (typeof findRenderedPlacementSelectionKeysAtPointer !== "function") {
      expect(findRenderedPlacementSelectionKeysAtPointer).toBeTypeOf("function");
      return;
    }

    const overlappingBounds = {
      containsPoint: () => true,
    };
    const higherZIndexSprite = {
      placementKey: "item:1",
      sprite: {
        zIndex: 20,
        getBounds: () => overlappingBounds,
      },
    };
    const lowerZIndexSprite = {
      placementKey: "item:2",
      sprite: {
        zIndex: 10,
        getBounds: () => overlappingBounds,
      },
    };
    const sameZIndexEarlierSprite = {
      placementKey: "item:3",
      sprite: {
        zIndex: 30,
        getBounds: () => overlappingBounds,
      },
    };
    const sameZIndexLaterSprite = {
      placementKey: "item:4",
      sprite: {
        zIndex: 30,
        getBounds: () => overlappingBounds,
      },
    };

    expect(
      findRenderedPlacementSelectionKeysAtPointer(
        [higherZIndexSprite, lowerZIndexSprite],
        { x: 8, y: 8 },
      ),
    ).toEqual(["item:1", "item:2"]);
    expect(
      findRenderedPlacementSelectionKeysAtPointer(
        [sameZIndexEarlierSprite, sameZIndexLaterSprite],
        { x: 8, y: 8 },
      ),
    ).toEqual(["item:4", "item:3"]);
  });

  it("deduplicates overlapping layers for the same placement key", () => {
    const findRenderedPlacementSelectionKeysAtPointer = (
      plannerCanvasModule.findRenderedPlacementSelectionKeysAtPointer as unknown as (
        renderedPlacementSprites: readonly Readonly<{
          placementKey: string;
          sprite: Readonly<{
            zIndex: number;
            getBounds(): Readonly<{
              containsPoint(x: number, y: number): boolean;
            }>;
          }>;
        }>[],
        pointerCoordinates: Readonly<{ x: number; y: number }>,
      ) => readonly string[]
    );
    const overlappingBounds = {
      containsPoint: () => true,
    };

    expect(
      findRenderedPlacementSelectionKeysAtPointer(
        [
          {
            placementKey: "item:1",
            sprite: { zIndex: 20, getBounds: () => overlappingBounds },
          },
          {
            placementKey: "item:1",
            sprite: { zIndex: 10, getBounds: () => overlappingBounds },
          },
        ],
        { x: 8, y: 8 },
      ),
    ).toEqual(["item:1"]);
  });
});

describe("attachPlannerCameraControls map placement clicks", () => {
  it("reports ordinary mouse hover tiles and clears them without placing", () => {
    const placementClickTestControls = createPlacementClickTestControls();

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerleave",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerleave",
      createPointerEvent(1, 100, 80),
    );

    expect(placementClickTestControls.hoveredMapTiles).toEqual([
      { x: 5, y: 4 },
      null,
    ]);
    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
  });

  it("restores the release-tile hover after an ordinary click exactly once", () => {
    const placementClickTestControls = createPlacementClickTestControls();

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 100, 80),
    );

    expect(placementClickTestControls.hoveredMapTiles).toEqual([
      { x: 5, y: 4 },
      null,
      { x: 5, y: 4 },
    ]);
    expect(placementClickTestControls.clickedMapTiles).toEqual([
      { x: 5, y: 4 },
    ]);
  });

  it("keeps the ghost cleared after a real mouse pan", () => {
    const placementClickTestControls = createPlacementClickTestControls();

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 108, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 108, 80),
    );

    expect(placementClickTestControls.hoveredMapTiles).toEqual([
      { x: 5, y: 4 },
      null,
    ]);
    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
  });

  it("only captures wheel input when wheel zoom is enabled", () => {
    const disabledControls = createPlacementClickTestControls();
    if (disabledControls === null) {
      return;
    }
    let disabledPreventDefaultCalls = 0;
    disabledControls.canvasElement.dispatchWheelEvent(
      createWheelEvent(() => {
        disabledPreventDefaultCalls += 1;
      }),
    );
    expect(disabledPreventDefaultCalls).toBe(0);
    expect(disabledControls.readCameraState().zoom).toBe(1);

    const enabledControls = createPlacementClickTestControls("navigate", true);
    if (enabledControls === null) {
      return;
    }
    let enabledPreventDefaultCalls = 0;
    enabledControls.canvasElement.dispatchWheelEvent(
      createWheelEvent(() => {
        enabledPreventDefaultCalls += 1;
      }),
    );
    expect(enabledPreventDefaultCalls).toBe(1);
    expect(enabledControls.readCameraState().zoom).toBeGreaterThan(1);
  });

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

  it("reports a placement key for a short click in dedicated multi-select mode instead of a rectangle", () => {
    const placementClickTestControls = createPlacementClickTestControls("multi-select");

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 100, 80),
    );

    expect(placementClickTestControls.clickedPlacementKeys).toEqual([["item:1"]]);
    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
    expect(placementClickTestControls.selectedMapRectangles).toEqual([]);
  });

  it("reports an empty candidate list for a blank multi-select short click", () => {
    const placementClickTestControls = createPlacementClickTestControls(
      "multi-select",
      false,
      [],
    );

    if (placementClickTestControls === null) {
      return;
    }

    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementClickTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 100, 80),
    );

    expect(placementClickTestControls.clickedPlacementKeys).toEqual([[]]);
    expect(placementClickTestControls.selectedMapRectangles).toEqual([]);
  });

  it("reports a map rectangle after a multi-select drag exceeds the existing threshold", () => {
    const placementClickTestControls = createPlacementClickTestControls("multi-select");

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

    expect(placementClickTestControls.clickedPlacementKeys).toEqual([]);
    expect(placementClickTestControls.clickedMapTiles).toEqual([]);
    expect(placementClickTestControls.selectedMapRectangles).toEqual([
      {
        start: { x: 5, y: 4 },
        end: { x: 7, y: 6 },
      },
    ]);
  });

  it("does not report direct selection or a rectangle when a multi-select pinch ends", () => {
    const placementClickTestControls = createPlacementClickTestControls("multi-select");

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

    expect(placementClickTestControls.clickedPlacementKeys).toEqual([]);
    expect(placementClickTestControls.selectedMapRectangles).toEqual([]);
  });

  it("previews and commits a selected-placement drag after the five-pixel threshold", () => {
    const placementDragTestControls = createPlacementDragTestControls();

    if (placementDragTestControls === null) {
      return;
    }

    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 104, 80),
    );
    expect(placementDragTestControls.placementSprite.position).toMatchObject({
      x: 32,
      y: 32,
    });
    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 132, 112),
    );
    expect(placementDragTestControls.placementSprite.position).toMatchObject({
      x: 64,
      y: 64,
    });
    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointerup",
      createPointerEvent(1, 132, 112),
    );

    expect(placementDragTestControls.committedMoves).toEqual([{ x: 2, y: 2 }]);
  });

  it("restores a selected-placement preview on cancellation without committing", () => {
    const placementDragTestControls = createPlacementDragTestControls();

    if (placementDragTestControls === null) {
      return;
    }

    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80),
    );
    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 132, 112),
    );
    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointercancel",
      createPointerEvent(1, 132, 112),
    );

    expect(placementDragTestControls.placementSprite.position).toMatchObject({
      x: 32,
      y: 32,
    });
    expect(placementDragTestControls.committedMoves).toEqual([]);
  });

  it("cancels a selected-placement preview when a second pointer enters pinch mode", () => {
    const placementDragTestControls = createPlacementDragTestControls();

    if (placementDragTestControls === null) {
      return;
    }

    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(1, 100, 80, { pointerType: "touch" }),
    );
    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointermove",
      createPointerEvent(1, 132, 112, { pointerType: "touch" }),
    );
    placementDragTestControls.canvasElement.dispatchPointerEvent(
      "pointerdown",
      createPointerEvent(2, 120, 80, { pointerType: "touch" }),
    );

    expect(placementDragTestControls.placementSprite.position).toMatchObject({
      x: 32,
      y: 32,
    });
    expect(placementDragTestControls.committedMoves).toEqual([]);
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
