"use client";

import { useEffect, useRef, useState } from "react";
import type {
  BuildingPlacementMetadataById,
  CatalogItem,
  CatalogPresentationChoice,
} from "../catalog";
import { evaluateEditorCursorPlacementPreview } from "../editor/editor-placement-controller";
import type { PlacementSelectionKey } from "../editor/editor-selection-controller";
import {
  PlannerJoystick,
  type PlannerJoystickDirection,
} from "./planner-joystick";
import {
  PlannerCanvasContextMenu,
  type CanvasContextMenuPoint,
} from "./planner-canvas-context-menu";
import {
  createInitialEditorDisplayOptions,
  type EditorDisplayOptions,
} from "../editor/editor-display-options";
import {
  getPlannerMapById,
} from "../maps/map-catalog";
import {
  createMapPlacementGrid,
  type MapPlacementGrid,
} from "../placement/map-placement-grids";
import {
  getMapTileAtPointer,
  type MapPointerTile,
} from "../placement/map-pointer-tile";
import type {
  PlacementSnapshot,
  PlacementSnapshotAction,
} from "../placement/placement-snapshot";
import { applyBuildingPaintToPixels } from "../paint/building-paint-rendering";
import {
  createNightLightRenderDescriptors,
  type NightLightRenderDescriptor,
} from "../night-lights/night-light-rendering";
import {
  applyInteriorDecorToMap,
  getInteriorDecorTargetAtTile,
} from "../interior-decor/interior-decor-rendering";
import type { InteriorDecorCatalogPattern } from "../interior-decor/interior-decor-catalog";
import type {
  InteriorDecorKind,
  InteriorDecorState,
} from "../interior-decor/interior-decor-state";
import {
  type MapImageExporter,
  type ScreenshotResolution,
} from "../projects/map-image-export";
import {
  createMapRenderingContract,
  isKnownUnavailableRenderingTileset,
  type MapRenderingContract,
  type RenderingTileset,
} from "../rendering/map-rendering-contract";
import { createLayerTileGeometryResolver } from "../rendering/map-tile-geometry";
import {
  clampCameraPosition,
  createInitialCameraState,
  getCameraKeyboardPan,
  getWheelRequestedZoom,
  panCameraBy,
  type CameraGeometry,
  type CameraState,
  zoomCameraAtPoint,
} from "../rendering/camera-state";
import type { PlannerCameraStateRetention } from "../planner/planner-camera-state-retention";
import {
  createPlacementRenderEntries,
  createTransientPlacementRenderEntries,
  type PlacementRenderEntry,
} from "../rendering/placement-rendering";
import {
  resolvePlacementTextureEntries,
  type ResolvedPlacementTextureEntry,
} from "../rendering/resolved-placement-texture";
import { initializePlannerTextureAssets } from "../rendering/planner-texture-assets";
import {
  createMapDisplayOverlayTiles,
  createPlacementCoverageOverlayRectangles,
  createResourceClumpOverlayEntries,
} from "../rendering/map-display-overlays";
import { createNpcPathOverlayTiles } from "../rendering/npc-paths";
import {
  createMapScreenshotDimensions,
  getMapScreenshotFooterHeight,
} from "../rendering/map-screenshot";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import { resolveInitialPlannerTextureAssetPath } from "../rendering/initial-planner-texture-path";
import type { TmxMap } from "../tmx/tmx-types";
import type { EditorPerformanceMarker } from "../performance/editor-performance-marks";
import type { PreparedDefaultMap } from "../resources/default-map-resource";

const localGameAssetRoot = "/game-assets/1.6.15/";
const validPlacementPreviewTint = 0x00ff00;
const invalidPlacementPreviewTint = 0xff0000;
const mapTileRectanglePreviewColor = 0x4a9eff;
const mapTileRectanglePreviewFillAlpha = 0.18;
const mapTileRectanglePreviewDashLength = 5;
const mapTileRectanglePreviewDashGap = 3;
const mapTileRectanglePreviewStrokeWidth = 1.5;

export type PlacementPreviewVisualDescriptor = Readonly<{
  alpha: number;
  tint: number;
}>;

export function createPlacementPreviewVisualDescriptor(
  isPlacementValid: boolean,
): PlacementPreviewVisualDescriptor {
  return isPlacementValid
    ? { alpha: 0.6, tint: validPlacementPreviewTint }
    : { alpha: 0.4, tint: invalidPlacementPreviewTint };
}

type PointerInteractionMode =
  | "navigate"
  | "rectangle"
  | "multi-select"
  | "move-selected";

type PlacementPreviewOverlayRenderer = () => void;

export type PlannerCanvasPlacementPreviewInput = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  catalogPresentationChoice: CatalogPresentationChoice;
  freePlacement: boolean;
  resolvedCompositeVariant?: number;
  selectedCatalogItem: CatalogItem;
}>;

export type PlannerCanvasPlacementPreviewState = Readonly<{
  previewAction: PlacementSnapshotAction;
  visualDescriptor: PlacementPreviewVisualDescriptor;
}>;

export function createPlannerCanvasPlacementPreviewState(
  input: Readonly<{
    hoveredMapTile: MapPointerTile | null;
    mapPlacementGrid: MapPlacementGrid;
    placementPreview: PlannerCanvasPlacementPreviewInput | null | undefined;
    placementSnapshot: PlacementSnapshot | undefined;
  }>,
): PlannerCanvasPlacementPreviewState | null {
  if (
    input.hoveredMapTile === null ||
    input.placementPreview === null ||
    input.placementPreview === undefined ||
    input.placementSnapshot === undefined
  ) {
    return null;
  }

  const previewEvaluation = evaluateEditorCursorPlacementPreview({
    buildingMetadataById: input.placementPreview.buildingMetadataById,
    catalogPresentationChoice: input.placementPreview.catalogPresentationChoice,
    cursorTile: input.hoveredMapTile,
    freePlacement: input.placementPreview.freePlacement,
    mapPlacementGrid: input.mapPlacementGrid,
    placementSnapshot: input.placementSnapshot,
    resolvedCompositeVariant: input.placementPreview.resolvedCompositeVariant,
    selectedCatalogItem: input.placementPreview.selectedCatalogItem,
  });

  if (!previewEvaluation.previewable) {
    return null;
  }

  return {
    previewAction: previewEvaluation.previewAction,
    visualDescriptor: createPlacementPreviewVisualDescriptor(
      previewEvaluation.validation.valid,
    ),
  };
}

export type PlannerCanvasProperties = Readonly<{
  cameraStateRetention: PlannerCameraStateRetention;
  catalogItems?: readonly CatalogItem[];
  displayOptions?: EditorDisplayOptions;
  isXRayActive?: boolean;
  wheelZoomEnabled?: boolean;
  leftHandMode?: boolean;
  mapId: string;
  placementPreview?: PlannerCanvasPlacementPreviewInput | null;
  pointerInteractionMode?: PointerInteractionMode;
  placementSnapshot?: PlacementSnapshot;
  selectedPlacementKeys?: readonly string[];
  season: TilesheetSeason;
  preparedCanvasResources: PlannerCanvasPreparedResources;
  isResourceGenerationCurrent?: (resourceGeneration: number) => boolean;
  performanceMarker?: EditorPerformanceMarker;
  onCanvasError?: (message: string) => void;
  onCopyCleanMapImage?: () => Promise<void>;
  onCanvasReady?: () => void;
  onInteractive?: () => void;
  showJoystick?: boolean;
  showResourceClumpSpawnLocations?: boolean;
  onMapPlacementGridReady?: (
    mapId: string,
    mapPlacementGrid: MapPlacementGrid,
  ) => void;
  onMapImageExporterReady?: (
    mapId: string,
    mapImageExporter: MapImageExporter | null,
  ) => void;
  onNudgeSelectedPlacements?: (direction: PlannerJoystickDirection) => void;
  onMoveSelectedPlacements?: (tileDelta: Readonly<{ x: number; y: number }>) => void;
  onMapTileClick?: (mapId: string, mapTileCoordinates: MapPointerTile) => void;
  onMapTileRectangle?: (
    mapId: string,
    startMapTileCoordinates: MapPointerTile,
    endMapTileCoordinates: MapPointerTile,
  ) => void;
  onPlacementSelectionClick?: (
    mapId: string,
    placementSelectionKeys: readonly PlacementSelectionKey[],
  ) => void;
  activeInteriorDecorPattern?: InteriorDecorCatalogPattern | null;
  onInteriorDecorApply?: (
    mapId: string,
    interiorDecorKind: InteriorDecorKind,
    targetId: string,
    patternId: string,
  ) => void;
  onInteriorDecorRejected?: (
    mapId: string,
    interiorDecorKind: InteriorDecorKind,
  ) => void;
}>;

export function handlePlannerCanvasContextMenuEvent(
  contextMenuEvent: MouseEvent,
  pixiCanvas: HTMLCanvasElement,
  onOpen: (point: CanvasContextMenuPoint) => void,
): void {
  if (contextMenuEvent.target !== pixiCanvas) {
    return;
  }

  contextMenuEvent.preventDefault();
  onOpen({ x: contextMenuEvent.offsetX, y: contextMenuEvent.offsetY });
}

export async function handlePlannerCanvasContextMenuCopyAction(
  onCopyCleanMapImage: (() => Promise<void>) | undefined,
  reportCopyError: (message: string) => void,
): Promise<void> {
  if (onCopyCleanMapImage === undefined) {
    return;
  }

  try {
    await onCopyCleanMapImage();
  } catch (caughtError) {
    reportCopyError(
      caughtError instanceof Error ? caughtError.message : String(caughtError),
    );
  }
}

export function attachPlannerCanvasContextMenuListener(
  input: Readonly<{
    onOpen: (point: CanvasContextMenuPoint) => void;
    pixiCanvas: HTMLCanvasElement;
  }>,
): () => void {
  let hasRemovedContextMenuListener = false;
  const handleCanvasContextMenuEvent = (contextMenuEvent: MouseEvent): void => {
    handlePlannerCanvasContextMenuEvent(
      contextMenuEvent,
      input.pixiCanvas,
      input.onOpen,
    );
  };

  input.pixiCanvas.addEventListener("contextmenu", handleCanvasContextMenuEvent);

  return (): void => {
    if (hasRemovedContextMenuListener) {
      return;
    }
    hasRemovedContextMenuListener = true;
    input.pixiCanvas.removeEventListener("contextmenu", handleCanvasContextMenuEvent);
  };
}

export type PlannerCanvasPreparedResources = Readonly<{
  pixi: PixiModule;
  preparedMap: PreparedDefaultMap;
  resourceGeneration: number;
}>;

export function shouldRenderPlannerJoystick(
  showJoystickPreference: boolean,
  selectedPlacementKeys: readonly string[],
): boolean {
  return showJoystickPreference && selectedPlacementKeys.length > 0;
}

export type MapPlacementGridReadyNotificationProperties = Readonly<{
  isMapLifecycleCurrent: () => boolean;
  mapId: string;
  onMapPlacementGridReady?: (
    mapId: string,
    mapPlacementGrid: MapPlacementGrid,
  ) => void;
  parsedMap: TmxMap;
}>;

type PlannerCanvasStatus =
  | Readonly<{ kind: "loading" }>
  | Readonly<{ kind: "ready" }>
  | Readonly<{ kind: "error"; message: string }>;

export function createPlannerCanvasContextMenuCopyAction(
  input: Readonly<{
    getOnCopyCleanMapImage: () => (() => Promise<void>) | undefined;
    isMapLifecycleCurrent: () => boolean;
    onCanvasError: (message: string) => void;
    setPlannerCanvasStatus: (status: PlannerCanvasStatus) => void;
  }>,
): () => Promise<void> {
  return () =>
    handlePlannerCanvasContextMenuCopyAction(
      input.getOnCopyCleanMapImage(),
      (message) => {
        reportCurrentPlannerCanvasError({
          isMapLifecycleCurrent: input.isMapLifecycleCurrent,
          message,
          onCurrentError: (currentMessage) => {
            input.setPlannerCanvasStatus({ kind: "error", message: currentMessage });
            input.onCanvasError(currentMessage);
          },
        });
      },
    );
}

export type PlannerCanvasCameraLifecycle = Readonly<{
  commitCameraState(cameraState: CameraState): void;
  readCurrentCameraState(): CameraState | null;
  resizeCamera(cameraGeometry: CameraGeometry): CameraState;
}>;

export function createPlannerCanvasCameraLifecycle(
  input: Readonly<{
    cameraStateRetention: PlannerCameraStateRetention;
    mapId: string;
    renderCameraState: (cameraState: CameraState) => void;
  }>,
): PlannerCanvasCameraLifecycle {
  let currentCameraState: CameraState | null = null;

  const commitCameraState = (cameraState: CameraState): void => {
    currentCameraState = cameraState;
    input.renderCameraState(cameraState);
    input.cameraStateRetention.write(input.mapId, cameraState);
  };

  return {
    commitCameraState,
    readCurrentCameraState(): CameraState | null {
      return currentCameraState;
    },
    resizeCamera(cameraGeometry): CameraState {
      const cameraStateBeforeResize = currentCameraState
        ?? input.cameraStateRetention.read(input.mapId);
      const resizedCameraState = cameraStateBeforeResize === null
        ? createInitialCameraState(cameraGeometry)
        : clampCameraPosition(cameraStateBeforeResize, cameraGeometry);

      commitCameraState(resizedCameraState);
      return resizedCameraState;
    },
  };
}

type PixiModule = typeof import("pixi.js");
type PixiTexture = import("pixi.js").Texture;
type PixiApplication = import("pixi.js").Application;

type PixiApplicationLifetime<Application> = Readonly<{
  setApplication(application: Application): void;
  finishInitialization(): void;
  requestDestruction(): void;
  isDestructionRequested(): boolean;
}>;

type MapContainerCreationResult = Readonly<{
  mapContainer: import("pixi.js").Container;
  knownUnavailableTilesheetWarnings: readonly string[];
}>;

type KnownUnavailableTilesheet = Readonly<{
  outputPath: string;
  reason: string;
}>;

type LoadableTilesheet = Readonly<{
  tilesetIndex: number;
  assetPath: string;
}>;

type PlannerCameraControlsProperties = Readonly<{
  canvasElement: HTMLCanvasElement;
  getCameraGeometry: () => CameraGeometry;
  getCameraState: () => CameraState;
  getWheelZoomEnabled?: () => boolean;
  getPointerInteractionMode?: () => PointerInteractionMode;
  getMapTileAtPointer?: (
    pointerCoordinates: PointerCoordinates,
  ) => MapPointerTile | null;
  getPlacementDragTarget?: (
    pointerCoordinates: PointerCoordinates,
  ) => PlacementDragTarget | null;
  getPlacementDragTileSize?: () => Readonly<{ height: number; width: number }>;
  onMapTileHover?: (mapTileCoordinates: MapPointerTile | null) => void;
  onMapTileClick?: (mapTileCoordinates: MapPointerTile) => void;
  onMapTileRectangle?: (
    startMapTileCoordinates: MapPointerTile,
    endMapTileCoordinates: MapPointerTile,
  ) => void;
  onMapTileRectanglePreview?: (
    startMapTileCoordinates: MapPointerTile,
    endMapTileCoordinates: MapPointerTile,
  ) => void;
  onMapTileRectanglePreviewClear?: () => void;
  getPlacementSelectionKeysAtPointer?: (
    pointerCoordinates: PointerCoordinates,
  ) => readonly PlacementSelectionKey[];
  onPlacementSelectionClick?: (
    placementSelectionKeys: readonly PlacementSelectionKey[],
  ) => void;
  onMoveSelectedPlacements?: (tileDelta: Readonly<{ x: number; y: number }>) => void;
  setCameraState: (cameraState: CameraState) => void;
}>;

type PlannerCameraControls = Readonly<{
  dispose(): void;
  synchronizePointerInteractionMode(): void;
}>;

type MapTileRectanglePreviewRenderer = Readonly<{
  clear(): void;
  render(
    startMapTileCoordinates: MapPointerTile,
    endMapTileCoordinates: MapPointerTile,
  ): void;
}>;

export type PlannerCanvasInteractionBindingPorts = Readonly<{
  attachCameraControls(): PlannerCameraControls;
  createResizeObserver(onResize: () => void): Readonly<{
    observe(element: Element): void;
    disconnect(): void;
  }>;
  windowPort: Readonly<{
    addEventListener(eventName: "resize", listener: () => void): void;
    removeEventListener(eventName: "resize", listener: () => void): void;
  }>;
}>;

export type PlannerCanvasInteractionBinding = Readonly<{
  dispose(): void;
  synchronizePointerInteractionMode(): void;
}>;

export function bindPlannerCanvasInteractions(
  canvasHostElement: Element,
  onResize: () => void,
  ports: PlannerCanvasInteractionBindingPorts,
): PlannerCanvasInteractionBinding {
  let hasDisposed = false;
  let cameraControls: PlannerCameraControls | null = null;
  let resizeObserver: ReturnType<
    PlannerCanvasInteractionBindingPorts["createResizeObserver"]
  > | null = null;
  let didAddWindowResizeListener = false;

  const dispose = (): void => {
    if (hasDisposed) {
      return;
    }
    hasDisposed = true;
    resizeObserver?.disconnect();
    if (didAddWindowResizeListener) {
      ports.windowPort.removeEventListener("resize", onResize);
    }
    cameraControls?.dispose();
  };
  const synchronizePointerInteractionMode = (): void => {
    cameraControls?.synchronizePointerInteractionMode();
  };

  try {
    cameraControls = ports.attachCameraControls();
    resizeObserver = ports.createResizeObserver(onResize);
    resizeObserver.observe(canvasHostElement);
    ports.windowPort.addEventListener("resize", onResize);
    didAddWindowResizeListener = true;
    return { dispose, synchronizePointerInteractionMode };
  } catch (caughtError) {
    dispose();
    throw caughtError;
  }
}

export type PlannerCanvasInitializationDependencies = readonly [
  mapId: string,
  season: TilesheetSeason,
  interiorDecorStateRevision: string,
  pixi: PixiModule,
  preparedMap: PreparedDefaultMap,
  resourceGeneration: number,
];

export function getPlannerCanvasInitializationDependencies(
  mapId: string,
  season: TilesheetSeason,
  interiorDecorStateRevision: string,
  preparedCanvasResources: PlannerCanvasPreparedResources,
): PlannerCanvasInitializationDependencies {
  return [
    mapId,
    season,
    interiorDecorStateRevision,
    preparedCanvasResources.pixi,
    preparedCanvasResources.preparedMap,
    preparedCanvasResources.resourceGeneration,
  ];
}

type PlacementOverlayRenderer = () => void;
type MapDisplayOverlayRenderer = () => void;
type XRayRenderer = () => void;

export type PlacementSpriteAnimation = Readonly<{
  update(currentTimeMilliseconds: number): boolean;
}>;

export type PlacementSprite = Readonly<{
  animation: PlacementSpriteAnimation | null;
  animationFrameTextures: readonly PixiTexture[];
  placementKey: string;
  sprite: import("pixi.js").Sprite;
  frameTexture: PixiTexture | null;
  paintedTexture: PixiTexture | null;
}>;

type PlacementDragTarget = Readonly<{
  sprites: readonly PlacementSprite[];
}>;

export type PlacementAnimationController = Readonly<{
  dispose(): void;
  replaceAnimations(animations: readonly PlacementSpriteAnimation[]): void;
}>;

const placementAnimationIntervalMilliseconds = 100;

export function createPlacementAnimationController(
  renderAnimatedPlacements: () => void,
): PlacementAnimationController {
  if (typeof renderAnimatedPlacements !== "function") {
    throw new TypeError(
      `Placement animation render callback must be a function; received ${describeValue(renderAnimatedPlacements)}.`,
    );
  }

  let animationInterval: ReturnType<typeof setInterval> | null = null;
  let currentAnimations: readonly PlacementSpriteAnimation[] = [];
  let hasDisposed = false;

  const stopAnimationInterval = (): void => {
    if (animationInterval !== null) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
  };

  return {
    dispose(): void {
      if (hasDisposed) {
        return;
      }

      hasDisposed = true;
      currentAnimations = [];
      stopAnimationInterval();
    },
    replaceAnimations(animations): void {
      if (hasDisposed) {
        throw new Error(
          "Placement animation controller cannot replace animations after disposal.",
        );
      }
      assertPlacementSpriteAnimations(animations);
      stopAnimationInterval();
      currentAnimations = animations;

      if (currentAnimations.length === 0) {
        return;
      }

      animationInterval = setInterval(() => {
        const currentTimeMilliseconds = performance.now();
        let didChangeVisualState = false;

        for (const animation of currentAnimations) {
          didChangeVisualState =
            animation.update(currentTimeMilliseconds) || didChangeVisualState;
        }

        if (didChangeVisualState) {
          renderAnimatedPlacements();
        }
      }, placementAnimationIntervalMilliseconds);
    },
  };
}

function assertPlacementSpriteAnimations(
  animations: readonly PlacementSpriteAnimation[],
): void {
  if (!Array.isArray(animations)) {
    throw new TypeError(
      `Placement animations must be an array; received ${describeValue(animations)}.`,
    );
  }

  for (let animationIndex = 0; animationIndex < animations.length; animationIndex += 1) {
    const animation = animations[animationIndex];

    if (
      typeof animation !== "object"
      || animation === null
      || typeof animation.update !== "function"
    ) {
      throw new TypeError(
        `Placement animation at index ${String(animationIndex)} must expose an update function; received ${describeValue(animation)}.`,
      );
    }
  }
}

export type PlannerCanvasPlacementRenderStatus = "error" | "ready" | "stale";

export type SettlePlannerCanvasPlacementRenderInput<PlacementSpriteRecord> =
  Readonly<{
    createPlacementSprites: () => Promise<readonly PlacementSpriteRecord[]>;
    isRenderCurrent: () => boolean;
    mapId: string;
    onCurrentCommitFailure: (
      placementSprites: readonly PlacementSpriteRecord[],
    ) => void;
    onCurrentError: (message: string, caughtError: unknown) => void;
    onCurrentReady: (
      placementSprites: readonly PlacementSpriteRecord[],
      claimPlacementSpriteOwnership: () => void,
    ) => void;
    onStaleReady: (placementSprites: readonly PlacementSpriteRecord[]) => void;
  }>;

export async function settlePlannerCanvasPlacementRender<PlacementSpriteRecord>(
  input: SettlePlannerCanvasPlacementRenderInput<PlacementSpriteRecord>,
): Promise<PlannerCanvasPlacementRenderStatus> {
  let placementSprites: readonly PlacementSpriteRecord[];
  try {
    placementSprites = await input.createPlacementSprites();
  } catch (caughtError) {
    if (!input.isRenderCurrent()) {
      return "stale";
    }
    input.onCurrentError(
      formatPlannerCanvasError(input.mapId, caughtError),
      caughtError,
    );
    return "error";
  }

  if (!input.isRenderCurrent()) {
    input.onStaleReady(placementSprites);
    return "stale";
  }
  let hasClaimedPlacementSpriteOwnership = false;
  try {
    input.onCurrentReady(placementSprites, () => {
      hasClaimedPlacementSpriteOwnership = true;
    });
    return "ready";
  } catch (caughtError) {
    let reportedError = caughtError;
    if (!hasClaimedPlacementSpriteOwnership) {
      try {
        input.onCurrentCommitFailure(placementSprites);
      } catch (rollbackError) {
        reportedError = new AggregateError(
          [caughtError, rollbackError],
          "Placement sprite commit and rollback both failed.",
        );
      }
    }
    input.onCurrentError(
      formatPlannerCanvasError(input.mapId, reportedError),
      reportedError,
    );
    return "error";
  }
}

type PlacementPreviewSpriteRecord<Sprite> = Readonly<{
  sprite: Sprite & { alpha: number; tint: number };
}>;

export function createPlannerCanvasPlacementPreviewRenderer<
  Sprite,
  PlacementSpriteRecord extends PlacementPreviewSpriteRecord<Sprite>,
  PlacementAnimation,
>(input: Readonly<{
  container: Readonly<{
    addChild: (...sprites: Sprite[]) => unknown;
    removeChildren: () => unknown;
  }>;
  destroyPlacementSprites: (
    placementSprites: readonly PlacementSpriteRecord[],
  ) => void;
  disposeAnimations?: () => void;
  getPlacementSpriteAnimations: (
    placementSprites: readonly PlacementSpriteRecord[],
  ) => readonly PlacementAnimation[];
  isMapLifecycleCurrent: () => boolean;
  mapId: string;
  onCurrentError: (message: string, caughtError: unknown) => void;
  onRender: () => void;
  replaceAnimations: (animations: readonly PlacementAnimation[]) => void;
}>): Readonly<{
  clear: () => void;
  dispose: () => void;
  render: (renderInput: Readonly<{
    createPlacementSprites: () => Promise<readonly PlacementSpriteRecord[]>;
    visualDescriptor: PlacementPreviewVisualDescriptor;
  }>) => Promise<PlannerCanvasPlacementRenderStatus>;
}> {
  let renderVersion = 0;
  let renderedPlacementSprites: readonly PlacementSpriteRecord[] = [];

  const releaseRenderedPlacementSprites = (): void => {
    input.container.removeChildren();
    input.destroyPlacementSprites(renderedPlacementSprites);
    renderedPlacementSprites = [];
    input.replaceAnimations([]);
    input.onRender();
  };

  const clear = (): void => {
    renderVersion += 1;
    releaseRenderedPlacementSprites();
  };

  return {
    clear,
    dispose(): void {
      clear();
      input.disposeAnimations?.();
    },
    render(renderInput): Promise<PlannerCanvasPlacementRenderStatus> {
      renderVersion += 1;
      const requestedRenderVersion = renderVersion;
      releaseRenderedPlacementSprites();

      return settlePlannerCanvasPlacementRender({
        createPlacementSprites: renderInput.createPlacementSprites,
        isRenderCurrent: () =>
          input.isMapLifecycleCurrent()
          && requestedRenderVersion === renderVersion,
        mapId: input.mapId,
        onCurrentCommitFailure: input.destroyPlacementSprites,
        onCurrentError: input.onCurrentError,
        onCurrentReady: (
          placementSprites,
          claimPlacementSpriteOwnership,
        ) => {
          input.container.removeChildren();
          input.destroyPlacementSprites(renderedPlacementSprites);
          renderedPlacementSprites = [];
          for (const placementSprite of placementSprites) {
            placementSprite.sprite.alpha = renderInput.visualDescriptor.alpha;
            placementSprite.sprite.tint = renderInput.visualDescriptor.tint;
          }
          if (placementSprites.length > 0) {
            input.container.addChild(
              ...placementSprites.map((placementSprite) => placementSprite.sprite),
            );
          }
          renderedPlacementSprites = placementSprites;
          input.replaceAnimations(
            input.getPlacementSpriteAnimations(placementSprites),
          );
          claimPlacementSpriteOwnership();
          input.onRender();
        },
        onStaleReady: input.destroyPlacementSprites,
      });
    },
  };
}

export function reportCurrentPlannerCanvasError(
  input: Readonly<{
    isMapLifecycleCurrent: () => boolean;
    message: string;
    onCurrentError: (message: string) => void;
  }>,
): boolean {
  if (!input.isMapLifecycleCurrent()) {
    return false;
  }
  input.onCurrentError(input.message);
  return true;
}

export async function createPlacementSpriteBatch<PlacementSpriteRecord>(
  input: Readonly<{
    destroyCreatedPlacementSprites: (
      createdPlacementSprites: readonly PlacementSpriteRecord[],
    ) => void;
    placementSpritePromises: readonly Promise<PlacementSpriteRecord>[];
  }>,
): Promise<readonly PlacementSpriteRecord[]> {
  const settledPlacementSprites = await Promise.allSettled(
    input.placementSpritePromises,
  );
  const createdPlacementSprites = settledPlacementSprites.flatMap(
    (settledPlacementSprite) =>
      settledPlacementSprite.status === "fulfilled"
        ? [settledPlacementSprite.value]
        : [],
  );
  const firstPlacementFailure = settledPlacementSprites.find(
    (settledPlacementSprite) => settledPlacementSprite.status === "rejected",
  );

  if (firstPlacementFailure === undefined) {
    return createdPlacementSprites;
  }

  try {
    input.destroyCreatedPlacementSprites(createdPlacementSprites);
  } catch (cleanupError) {
    throw new AggregateError(
      [firstPlacementFailure.reason, cleanupError],
      "Placement sprite creation and rollback both failed.",
    );
  }
  throw firstPlacementFailure.reason;
}

type PointerCoordinates = Readonly<{
  x: number;
  y: number;
}>;

type PointerDragState = Readonly<{
  hasExceededPanThreshold: boolean;
  pointerId: number;
  startCoordinates: PointerCoordinates;
  startMapTileCoordinates: MapPointerTile | null;
  lastCoordinates: PointerCoordinates;
}>;

type PlacementDragState = Readonly<{
  baseSpritePositions: ReadonlyMap<import("pixi.js").Sprite, Readonly<{ x: number; y: number }>>;
  hasExceededPlacementThreshold: boolean;
  lastTileDelta: Readonly<{ x: number; y: number }>;
  pointerId: number;
  selectedPlacementSprites: readonly PlacementSprite[];
  startCoordinates: PointerCoordinates;
  startMapTileCoordinates: MapPointerTile;
}>;

type PinchGestureState = Readonly<{
  initialCameraState: CameraState;
  initialCenterCoordinates: PointerCoordinates;
  initialDistance: number;
}>;

const pointerPanThreshold = 3;
const placementDragThreshold = 5;
const keyboardZoomMultiplier = 1.08;
const xRayPlacementContainerAlpha = 0.18;

export function getPlacementContainerAlpha(isXRayActive: boolean): number {
  if (typeof isXRayActive !== "boolean") {
    throw new TypeError(
      `X-ray active state must be a boolean; received ${describeValue(isXRayActive)}.`,
    );
  }

  return isXRayActive ? xRayPlacementContainerAlpha : 1;
}

export function assertPreparedCanvasResourcesMatchRequestedMap(
  preparedCanvasResources: PlannerCanvasPreparedResources,
  requestedMapId: string,
  requestedSeason: TilesheetSeason,
): void {
  if (preparedCanvasResources.preparedMap.mapId !== requestedMapId) {
    throw new Error(
      `Prepared Canvas mapId ${JSON.stringify(preparedCanvasResources.preparedMap.mapId)} does not match requested mapId ${JSON.stringify(requestedMapId)}.`,
    );
  }
  if (preparedCanvasResources.preparedMap.season !== requestedSeason) {
    throw new Error(
      `Prepared Canvas season ${JSON.stringify(preparedCanvasResources.preparedMap.season)} does not match requested season ${JSON.stringify(requestedSeason)}.`,
    );
  }
  if (!Number.isInteger(preparedCanvasResources.resourceGeneration) || preparedCanvasResources.resourceGeneration < 0) {
    throw new TypeError(
      `Prepared Canvas resourceGeneration must be a non-negative integer; received ${JSON.stringify(preparedCanvasResources.resourceGeneration)}.`,
    );
  }
}

export function getPlannerCanvasRenderingContract(
  preparedMap: PreparedDefaultMap,
  renderedMap: TmxMap,
  createRenderingContract: typeof createMapRenderingContract =
    createMapRenderingContract,
): MapRenderingContract {
  if (renderedMap === preparedMap.parsedMap) {
    return preparedMap.renderingContract;
  }

  return createRenderingContract({
    mapId: preparedMap.mapId,
    parsedMap: renderedMap,
    requestedSeason: preparedMap.season,
  });
}

export type PlannerCanvasCleanupOperations = Readonly<{
  disposeInteractionBinding(): void;
  disposeMapDisplayOverlay(): void;
  disposePlacementOverlay(): void;
  disposePlacementPreview?(): void;
  clearJoystickCameraPan(): void;
  clearMapImageExporter(): void;
  destroyResourceClumpFrameTextures(): void;
  destroyPixiApplication(): void;
  clearCanvasHost(): void;
}>;

export function createPlannerCanvasCleanup(
  cleanupOperations: PlannerCanvasCleanupOperations,
): () => void {
  let hasCleanedUp = false;

  return (): void => {
    if (hasCleanedUp) {
      return;
    }
    hasCleanedUp = true;
    cleanupOperations.disposeInteractionBinding();
    cleanupOperations.disposeMapDisplayOverlay();
    cleanupOperations.disposePlacementOverlay();
    cleanupOperations.disposePlacementPreview?.();
    cleanupOperations.clearJoystickCameraPan();
    cleanupOperations.clearMapImageExporter();
    cleanupOperations.destroyResourceClumpFrameTextures();
    cleanupOperations.destroyPixiApplication();
    cleanupOperations.clearCanvasHost();
  };
}

export function commitPlannerCanvasExporterAndWarnings(
  isMapLifecycleCurrent: () => boolean,
  notifyMapImageExporterReady: () => void,
  setKnownUnavailableTilesheetWarnings: () => void,
): boolean {
  notifyMapImageExporterReady();
  if (!isMapLifecycleCurrent()) {
    return false;
  }

  setKnownUnavailableTilesheetWarnings();
  return isMapLifecycleCurrent();
}

export function createInitialResolvedPlacementTextureEntries(
  input: Readonly<{
    catalogItems: readonly CatalogItem[] | undefined;
    isNightMode: boolean;
    mapId: string;
    mapPlacementGrid?: MapPlacementGrid;
    placementSnapshot: PlacementSnapshot | undefined;
    season: TilesheetSeason;
  }>,
): readonly ResolvedPlacementTextureEntry[] {
  if (input.catalogItems === undefined || input.placementSnapshot === undefined) {
    return [];
  }

  return resolvePlacementTextureEntries(createPlacementRenderEntries(
    input.placementSnapshot,
    input.catalogItems,
    input.season,
    input.mapId,
    input.mapPlacementGrid,
    input.isNightMode,
  ));
}

export function PlannerCanvas({
  cameraStateRetention,
  catalogItems,
  displayOptions = createInitialEditorDisplayOptions(),
  isXRayActive = false,
  wheelZoomEnabled = false,
  leftHandMode = false,
  mapId,
  placementPreview = null,
  pointerInteractionMode = "navigate",
  placementSnapshot,
  selectedPlacementKeys = [],
  season,
  preparedCanvasResources,
  isResourceGenerationCurrent,
  performanceMarker,
  onCanvasError,
  onCopyCleanMapImage,
  onCanvasReady,
  onInteractive,
  showJoystick = false,
  showResourceClumpSpawnLocations = false,
  activeInteriorDecorPattern = null,
  onMapPlacementGridReady,
  onMapImageExporterReady,
  onInteriorDecorApply,
  onInteriorDecorRejected,
  onNudgeSelectedPlacements,
  onMoveSelectedPlacements,
  onMapTileClick,
  onMapTileRectangle,
  onPlacementSelectionClick,
}: PlannerCanvasProperties) {
  const canvasHostElementReference = useRef<HTMLDivElement>(null);
  const onMapPlacementGridReadyReference = useRef(onMapPlacementGridReady);
  const onMapImageExporterReadyReference = useRef(onMapImageExporterReady);
  const onMapTileClickReference = useRef(onMapTileClick);
  const onMapTileRectangleReference = useRef(onMapTileRectangle);
  const onPlacementSelectionClickReference = useRef(onPlacementSelectionClick);
  const activeInteriorDecorPatternReference = useRef(activeInteriorDecorPattern);
  const onInteriorDecorApplyReference = useRef(onInteriorDecorApply);
  const onInteriorDecorRejectedReference = useRef(onInteriorDecorRejected);
  const isResourceGenerationCurrentReference = useRef(
    isResourceGenerationCurrent,
  );
  const performanceMarkerReference = useRef(performanceMarker);
  const onCanvasErrorReference = useRef(onCanvasError);
  const onCopyCleanMapImageReference = useRef(onCopyCleanMapImage);
  const onCopyFullMapFromContextMenuReference = useRef<
    (() => Promise<void>) | null
  >(null);
  const canvasContextMenuEditorRootReference = useRef<HTMLElement | null>(null);
  const canvasContextMenuFocusRestoreReference = useRef<HTMLCanvasElement | null>(
    null,
  );
  const onCanvasReadyReference = useRef(onCanvasReady);
  const onInteractiveReference = useRef(onInteractive);
  const onMoveSelectedPlacementsReference = useRef(onMoveSelectedPlacements);
  const pointerInteractionModeReference = useRef(pointerInteractionMode);
  const pointerInteractionModeSynchronizerReference = useRef<
    (() => void) | null
  >(null);
  const catalogItemsReference = useRef(catalogItems);
  const placementOverlayRendererReference = useRef<PlacementOverlayRenderer | null>(
    null,
  );
  const placementPreviewOverlayRendererReference = useRef<
    PlacementPreviewOverlayRenderer | null
  >(null);
  const xRayRendererReference = useRef<XRayRenderer | null>(null);
  const mapDisplayOverlayRendererReference =
    useRef<MapDisplayOverlayRenderer | null>(null);
  const placementSnapshotReference = useRef(placementSnapshot);
  const placementPreviewReference = useRef(placementPreview);
  const selectedPlacementKeysReference = useRef(selectedPlacementKeys);
  const displayOptionsReference = useRef(displayOptions);
  const isXRayActiveReference = useRef(isXRayActive);
  const wheelZoomEnabledReference = useRef(wheelZoomEnabled);
  const showResourceClumpSpawnLocationsReference = useRef(
    showResourceClumpSpawnLocations,
  );
  const joystickCameraPanReference = useRef<
    ((direction: PlannerJoystickDirection) => void) | null
  >(null);
  const [plannerCanvasStatus, setPlannerCanvasStatus] =
    useState<PlannerCanvasStatus>({ kind: "loading" });
  const [knownUnavailableTilesheetWarnings, setKnownUnavailableTilesheetWarnings] =
    useState<readonly string[]>([]);
  const [canvasContextMenuPoint, setCanvasContextMenuPoint] =
    useState<CanvasContextMenuPoint | null>(null);
  const interiorDecorStateRevision = getInteriorDecorStateRevision(
    placementSnapshot?.interiorDecor,
  );
  const plannerCanvasInitializationDependencies =
    getPlannerCanvasInitializationDependencies(
      mapId,
      season,
      interiorDecorStateRevision,
      preparedCanvasResources,
    );

  onMapPlacementGridReadyReference.current = onMapPlacementGridReady;
  onMapImageExporterReadyReference.current = onMapImageExporterReady;
  onMapTileClickReference.current = onMapTileClick;
  onMapTileRectangleReference.current = onMapTileRectangle;
  onPlacementSelectionClickReference.current = onPlacementSelectionClick;
  activeInteriorDecorPatternReference.current = activeInteriorDecorPattern;
  onInteriorDecorApplyReference.current = onInteriorDecorApply;
  onInteriorDecorRejectedReference.current = onInteriorDecorRejected;
  isResourceGenerationCurrentReference.current = isResourceGenerationCurrent;
  performanceMarkerReference.current = performanceMarker;
  onCanvasErrorReference.current = onCanvasError;
  onCopyCleanMapImageReference.current = onCopyCleanMapImage;
  onCanvasReadyReference.current = onCanvasReady;
  onInteractiveReference.current = onInteractive;
  onMoveSelectedPlacementsReference.current = onMoveSelectedPlacements;
  pointerInteractionModeReference.current = pointerInteractionMode;
  catalogItemsReference.current = catalogItems;
  placementSnapshotReference.current = placementSnapshot;
  placementPreviewReference.current = placementPreview;
  selectedPlacementKeysReference.current = selectedPlacementKeys;
  displayOptionsReference.current = displayOptions;
  isXRayActiveReference.current = isXRayActive;
  wheelZoomEnabledReference.current = wheelZoomEnabled;
  showResourceClumpSpawnLocationsReference.current =
    showResourceClumpSpawnLocations;

  useEffect(() => {
    placementOverlayRendererReference.current?.();
  }, [catalogItems, displayOptions.showNightMode, placementSnapshot, selectedPlacementKeys]);

  useEffect(() => {
    placementPreviewOverlayRendererReference.current?.();
  }, [catalogItems, displayOptions.showNightMode, placementPreview, placementSnapshot]);

  useEffect(() => {
    xRayRendererReference.current?.();
  }, [isXRayActive]);

  useEffect(() => {
    mapDisplayOverlayRendererReference.current?.();
  }, [displayOptions, placementSnapshot, showResourceClumpSpawnLocations]);

  useEffect(() => {
    pointerInteractionModeSynchronizerReference.current?.();
  }, [pointerInteractionMode]);

  useEffect(() => {
    assertPreparedCanvasResourcesMatchRequestedMap(
      preparedCanvasResources,
      mapId,
      season,
    );
    const canvasHostElement = canvasHostElementReference.current;

    if (canvasHostElement === null) {
      throw new Error(
        `Planner canvas host is unavailable for mapId ${JSON.stringify(mapId)}.`,
      );
    }

    const mountedCanvasHostElement = canvasHostElement;

    const pixiApplicationLifetime = createPixiApplicationLifetime<PixiApplication>(
      destroyPixiApplication,
    );
    const isMapLifecycleCurrent = (): boolean =>
      !pixiApplicationLifetime.isDestructionRequested() &&
      (isResourceGenerationCurrentReference.current?.(
        preparedCanvasResources.resourceGeneration,
      ) ?? true);
    let interactionBinding: PlannerCanvasInteractionBinding | null = null;
    let synchronizePointerInteractionMode: (() => void) | null = null;
    let disposeMapDisplayOverlay: (() => void) | null = null;
    let disposePlacementOverlay: (() => void) | null = null;
    let disposePlacementPreview: (() => void) | null = null;
    let removeCanvasContextMenuListener: (() => void) | null = null;
    let joystickCameraPan: ((direction: PlannerJoystickDirection) => void) | null =
      null;
    let resourceClumpFrameTexturesByParentSheetIndex: ReadonlyMap<
      number,
      PixiTexture
    > | null = null;
    const cleanUpPlannerCanvas = createPlannerCanvasCleanup({
      disposeInteractionBinding: () => {
        if (
          pointerInteractionModeSynchronizerReference.current ===
          synchronizePointerInteractionMode
        ) {
          pointerInteractionModeSynchronizerReference.current = null;
        }
        interactionBinding?.dispose();
      },
      disposeMapDisplayOverlay: () => disposeMapDisplayOverlay?.(),
      disposePlacementOverlay: () => disposePlacementOverlay?.(),
      disposePlacementPreview: () => disposePlacementPreview?.(),
      clearJoystickCameraPan: () => {
        if (joystickCameraPanReference.current === joystickCameraPan) {
          joystickCameraPanReference.current = null;
        }
      },
      clearMapImageExporter: () =>
        onMapImageExporterReadyReference.current?.(mapId, null),
      destroyResourceClumpFrameTextures: () => {
        destroyResourceClumpFrameTextures(
          resourceClumpFrameTexturesByParentSheetIndex,
        );
        resourceClumpFrameTexturesByParentSheetIndex = null;
      },
      destroyPixiApplication: () => pixiApplicationLifetime.requestDestruction(),
      clearCanvasHost: () => {
        removeCanvasContextMenuListener?.();
        onCopyFullMapFromContextMenuReference.current = null;
        setCanvasContextMenuPoint(null);
        mountedCanvasHostElement.replaceChildren();
      },
    });

    setPlannerCanvasStatus({ kind: "loading" });
    setKnownUnavailableTilesheetWarnings([]);

    async function initializePlannerCanvas(): Promise<void> {
      try {
        const loadedMap = preparedCanvasResources.preparedMap.parsedMap;
        const parsedMap = applyPlacementSnapshotInteriorDecor(
          loadedMap,
          placementSnapshot?.interiorDecor,
        );
        const mapFile = getPlannerMapById(mapId).mapFile;
        const mapPlacementGrid = createMapPlacementGrid(parsedMap);

        notifyMapPlacementGridReady({
          isMapLifecycleCurrent: () =>
            isMapLifecycleCurrent(),
          mapId,
          onMapPlacementGridReady: onMapPlacementGridReadyReference.current,
          parsedMap,
        });

        if (!isMapLifecycleCurrent()) {
          cleanUpPlannerCanvas();
          return;
        }

        const renderingContract = getPlannerCanvasRenderingContract(
          preparedCanvasResources.preparedMap,
          parsedMap,
        );
        const pixi = preparedCanvasResources.pixi;

        const pixiApplication = new pixi.Application();
        pixiApplicationLifetime.setApplication(pixiApplication);

        try {
          await pixiApplication.init({
            antialias: false,
            autoDensity: true,
            autoStart: false,
            backgroundColor: 0x141e17,
            height: 1,
            resolution: window.devicePixelRatio || 1,
            width: 1,
          });
          pixiApplication.ticker.stop();
        } finally {
          pixiApplicationLifetime.finishInitialization();
        }

        if (!isMapLifecycleCurrent()) {
          cleanUpPlannerCanvas();
          return;
        }

        mountedCanvasHostElement.replaceChildren(pixiApplication.canvas);
        const pixiCanvas = pixiApplication.canvas;
        const editorRootElement = mountedCanvasHostElement.closest(
          ".planner-editor-shell",
        );
        if (!(editorRootElement instanceof HTMLElement)) {
          throw new Error(
            `Planner canvas mapId ${JSON.stringify(mapId)} requires an HTMLElement .planner-editor-shell root.`,
          );
        }
        canvasContextMenuEditorRootReference.current = editorRootElement;
        onCopyFullMapFromContextMenuReference.current =
          createPlannerCanvasContextMenuCopyAction({
            getOnCopyCleanMapImage: () => onCopyCleanMapImageReference.current,
            isMapLifecycleCurrent,
            onCanvasError: (currentMessage) =>
              onCanvasErrorReference.current?.(currentMessage),
            setPlannerCanvasStatus,
          });
        removeCanvasContextMenuListener = attachPlannerCanvasContextMenuListener({
          pixiCanvas,
          onOpen: (point) => {
            canvasContextMenuFocusRestoreReference.current = pixiCanvas;
            setCanvasContextMenuPoint(point);
          },
        });

        await initializePlannerTextureAssets(pixi);

        const placementTexturePromisesByResolvedUrl = new Map<
          string,
          Promise<PixiTexture>
        >();
        const resolvedInitialPlacementTextureEntries =
          createInitialResolvedPlacementTextureEntries({
            catalogItems: catalogItemsReference.current,
            isNightMode: displayOptionsReference.current.showNightMode,
            mapId,
            mapPlacementGrid,
            placementSnapshot: placementSnapshotReference.current,
            season,
          });
        const { resourceClumpTilesheetTexture, tilesheetTextures } =
          await loadPlannerCanvasInitialTextures(
            pixi,
            renderingContract.tilesets,
            resolvedInitialPlacementTextureEntries,
            placementTexturePromisesByResolvedUrl,
          );

        if (!isMapLifecycleCurrent()) {
          cleanUpPlannerCanvas();
          return;
        }

        performanceMarkerReference.current?.mark("editor:required-textures-ready");

        const resourceClumpFrameTextures = createResourceClumpFrameTextures(
          pixi,
          resourceClumpTilesheetTexture,
        );
        resourceClumpFrameTexturesByParentSheetIndex = resourceClumpFrameTextures;

        const mapContainerCreationResult = createMapContainer(
          pixi,
          renderingContract,
          tilesheetTextures,
        );

        pixiApplication.stage.eventMode = "none";
        mapContainerCreationResult.mapContainer.eventMode = "none";
        pixiApplication.stage.addChild(mapContainerCreationResult.mapContainer);
        const mapDisplayOverlayContainer = new pixi.Container();
        mapDisplayOverlayContainer.label = "mapDisplayOverlays";
        mapContainerCreationResult.mapContainer.addChild(mapDisplayOverlayContainer);
        const placementContainer = new pixi.Container();
        placementContainer.label = "placements";
        placementContainer.sortableChildren = true;
        mapContainerCreationResult.mapContainer.addChild(placementContainer);
        const placementPreviewContainer = new pixi.Container();
        placementPreviewContainer.label = "placementPreview";
        placementPreviewContainer.sortableChildren = true;
        mapContainerCreationResult.mapContainer.addChild(placementPreviewContainer);
        const mapTileRectanglePreviewGraphics = new pixi.Graphics();
        mapTileRectanglePreviewGraphics.label = "mapTileRectanglePreview";
        mapContainerCreationResult.mapContainer.addChild(mapTileRectanglePreviewGraphics);
        const nightModeOverlayContainer = new pixi.Container();
        nightModeOverlayContainer.label = "nightMode";
        mapContainerCreationResult.mapContainer.addChild(nightModeOverlayContainer);

        const renderMapDisplayOverlay = (): void => {
          const currentPlacementSnapshot = placementSnapshotReference.current;

          replaceMapDisplayOverlayChildren(
            mapDisplayOverlayContainer,
            createMapDisplayOverlayContainer({
              editorDisplayOptions: displayOptionsReference.current,
              mapPlacementGrid,
              mapFile,
              parsedMap,
              placementSnapshot: currentPlacementSnapshot,
              pixi,
              resourceClumpFrameTexturesByParentSheetIndex:
                resourceClumpFrameTextures,
              showResourceClumpSpawnLocations:
                showResourceClumpSpawnLocationsReference.current,
              tileHeight: renderingContract.tileHeight,
              tileWidth: renderingContract.tileWidth,
            }),
          );
          replaceMapDisplayOverlayChildren(
            nightModeOverlayContainer,
            createNightModeOverlayContainer({
              catalogItems: catalogItemsReference.current,
              editorDisplayOptions: displayOptionsReference.current,
              mapPlacementGrid,
              pixi,
              placementSnapshot: currentPlacementSnapshot,
              tileHeight: renderingContract.tileHeight,
              tileWidth: renderingContract.tileWidth,
            }),
          );
          pixiApplication.renderer.render(pixiApplication.stage);
        };

        mapDisplayOverlayRendererReference.current = renderMapDisplayOverlay;
        disposeMapDisplayOverlay = (): void => {
          replaceMapDisplayOverlayChildren(mapDisplayOverlayContainer, null);
          replaceMapDisplayOverlayChildren(nightModeOverlayContainer, null);

          if (
            mapDisplayOverlayRendererReference.current === renderMapDisplayOverlay
          ) {
            mapDisplayOverlayRendererReference.current = null;
          }
        };
        let placementRenderVersion = 0;
        let renderedPlacementSprites: readonly PlacementSprite[] = [];
        const placementAnimationController =
          createPlacementAnimationController(() => {
            pixiApplication.renderer.render(pixiApplication.stage);
          });

        const renderXRay = (): void => {
          placementContainer.alpha = getPlacementContainerAlpha(
            isXRayActiveReference.current,
          );
          pixiApplication.renderer.render(pixiApplication.stage);
        };

        xRayRendererReference.current = renderXRay;
        renderXRay();

        const reportPlacementRenderError = (message: string): void => {
          reportCurrentPlannerCanvasError({
            isMapLifecycleCurrent,
            message,
            onCurrentError: (currentMessage) => {
              setPlannerCanvasStatus({ kind: "error", message: currentMessage });
              onCanvasErrorReference.current?.(currentMessage);
            },
          });
        };
        const renderPlacementOverlay = async (): Promise<PlannerCanvasPlacementRenderStatus> => {
          placementRenderVersion += 1;
          const requestedPlacementRenderVersion = placementRenderVersion;
          const currentCatalogItems = catalogItemsReference.current;
          const currentPlacementSnapshot = placementSnapshotReference.current;
          const currentSelectedPlacementKeys =
            selectedPlacementKeysReference.current;

          if (
            currentCatalogItems === undefined ||
            currentPlacementSnapshot === undefined
          ) {
            replacePlacementSprites(
              placementContainer,
              renderedPlacementSprites,
              [],
            );
            renderedPlacementSprites = [];
            placementAnimationController.replaceAnimations([]);
            pixiApplication.renderer.render(pixiApplication.stage);
            return "ready";
          }

          return settlePlannerCanvasPlacementRender({
            createPlacementSprites: () =>
              createPlacementSprites({
                pixi,
                catalogItems: currentCatalogItems,
                mapId,
                mapPlacementGrid,
                isNightMode: displayOptionsReference.current.showNightMode,
                placementSnapshot: currentPlacementSnapshot,
                season,
                selectedPlacementKeys: currentSelectedPlacementKeys,
                tileWidth: renderingContract.tileWidth,
                tileHeight: renderingContract.tileHeight,
                placementTexturePromisesByResolvedUrl,
              }),
            isRenderCurrent: () =>
              isMapLifecycleCurrent() &&
              requestedPlacementRenderVersion === placementRenderVersion,
            mapId,
            onCurrentCommitFailure: destroyPlacementSprites,
            onCurrentError: reportPlacementRenderError,
            onCurrentReady: (
              placementSprites,
              claimPlacementSpriteOwnership,
            ) => {
              placementContainer.removeChildren();
              destroyPlacementSprites(renderedPlacementSprites);
              renderedPlacementSprites = [];
              if (placementSprites.length > 0) {
                placementContainer.addChild(
                  ...placementSprites.map(
                    (placementSprite) => placementSprite.sprite,
                  ),
                );
              }
              renderedPlacementSprites = placementSprites;
              placementAnimationController.replaceAnimations(
                getPlacementSpriteAnimations(placementSprites),
              );
              claimPlacementSpriteOwnership();
              pixiApplication.renderer.render(pixiApplication.stage);
              setPlannerCanvasStatus({ kind: "ready" });
            },
            onStaleReady: destroyPlacementSprites,
          });
        };
        const requestPlacementOverlayRender = (): void => {
          void renderPlacementOverlay().catch((caughtError: unknown) => {
            reportPlacementRenderError(
              formatPlannerCanvasError(mapId, caughtError),
            );
          });
        };

        disposePlacementOverlay = (): void => {
          placementRenderVersion += 1;
          placementAnimationController.dispose();
          destroyPlacementSprites(renderedPlacementSprites);
          renderedPlacementSprites = [];
          placementContainer.removeChildren();

          if (
            placementOverlayRendererReference.current ===
            requestPlacementOverlayRender
          ) {
            placementOverlayRendererReference.current = null;
          }

          if (xRayRendererReference.current === renderXRay) {
            xRayRendererReference.current = null;
          }
        };
        const initialPlacementRenderStatus = await renderPlacementOverlay();
        if (initialPlacementRenderStatus !== "ready") {
          cleanUpPlannerCanvas();
          return;
        }
        placementOverlayRendererReference.current = requestPlacementOverlayRender;

        let hoveredMapTile: MapPointerTile | null = null;
        const placementPreviewAnimationController =
          createPlacementAnimationController(() => {
            pixiApplication.renderer.render(pixiApplication.stage);
          });
        const placementPreviewRenderer =
          createPlannerCanvasPlacementPreviewRenderer({
            container: placementPreviewContainer,
            destroyPlacementSprites,
            disposeAnimations: () => {
              placementPreviewAnimationController.dispose();
            },
            getPlacementSpriteAnimations,
            isMapLifecycleCurrent,
            mapId,
            onCurrentError: reportPlacementRenderError,
            onRender: () => {
              pixiApplication.renderer.render(pixiApplication.stage);
            },
            replaceAnimations: (animations) => {
              placementPreviewAnimationController.replaceAnimations(animations);
            },
          });
        const renderPlacementPreviewOverlay = async (): Promise<PlannerCanvasPlacementRenderStatus> => {
          const currentPlacementSnapshot = placementSnapshotReference.current;
          const placementPreviewState = createPlannerCanvasPlacementPreviewState({
            hoveredMapTile,
            mapPlacementGrid,
            placementPreview: placementPreviewReference.current,
            placementSnapshot: currentPlacementSnapshot,
          });
          const currentCatalogItems = catalogItemsReference.current;

          if (
            placementPreviewState === null
            || currentCatalogItems === undefined
            || currentPlacementSnapshot === undefined
          ) {
            placementPreviewRenderer.clear();
            return "ready";
          }

          return placementPreviewRenderer.render({
            createPlacementSprites: () =>
              createPlacementSprites({
                pixi,
                catalogItems: currentCatalogItems,
                mapId,
                mapPlacementGrid,
                isNightMode: displayOptionsReference.current.showNightMode,
                placementRenderEntries: createTransientPlacementRenderEntries(
                  currentPlacementSnapshot,
                  placementPreviewState.previewAction,
                  currentCatalogItems,
                  season,
                  mapId,
                  mapPlacementGrid,
                  displayOptionsReference.current.showNightMode,
                ),
                season,
                selectedPlacementKeys: [],
                tileWidth: renderingContract.tileWidth,
                tileHeight: renderingContract.tileHeight,
                placementTexturePromisesByResolvedUrl,
              }),
            visualDescriptor: placementPreviewState.visualDescriptor,
          });
        };
        const requestPlacementPreviewOverlayRender = (): void => {
          void renderPlacementPreviewOverlay().catch((caughtError: unknown) => {
            reportPlacementRenderError(
              formatPlannerCanvasError(mapId, caughtError),
            );
          });
        };

        disposePlacementPreview = (): void => {
          placementPreviewRenderer.dispose();

          if (
            placementPreviewOverlayRendererReference.current ===
            requestPlacementPreviewOverlayRender
          ) {
            placementPreviewOverlayRendererReference.current = null;
          }
        };
        placementPreviewOverlayRendererReference.current =
          requestPlacementPreviewOverlayRender;

        let currentCameraGeometry: CameraGeometry | null = null;

        const renderCameraState = (cameraState: CameraState) => {
          if (currentCameraGeometry === null) {
            throw new Error(
              `Planner camera geometry is unavailable while rendering mapId ${JSON.stringify(mapId)}.`,
            );
          }

          applyCameraState(
            pixiApplication,
            mapContainerCreationResult.mapContainer,
            currentCameraGeometry,
            cameraState,
          );
        };

        const cameraLifecycle = createPlannerCanvasCameraLifecycle({
          cameraStateRetention,
          mapId,
          renderCameraState,
        });
        const mapTileRectanglePreviewRenderer =
          createMapTileRectanglePreviewRenderer({
            graphics: mapTileRectanglePreviewGraphics,
            render: () => {
              pixiApplication.renderer.render(pixiApplication.stage);
            },
            tileHeight: renderingContract.tileHeight,
            tileWidth: renderingContract.tileWidth,
          });

        const resizeMapToViewport = () => {
          if (!isMapLifecycleCurrent()) {
            return;
          }

          currentCameraGeometry = getCameraGeometry(
            renderingContract,
            mountedCanvasHostElement,
          );
          pixiApplication.renderer.resize(
            currentCameraGeometry.viewportWidth,
            currentCameraGeometry.viewportHeight,
          );
          cameraLifecycle.resizeCamera(currentCameraGeometry);
        };

        resizeMapToViewport();
        renderMapDisplayOverlay();
        joystickCameraPan = (direction: PlannerJoystickDirection): void => {
          const cameraPan = getCameraKeyboardPan(direction);

          if (cameraPan === null) {
            throw new Error(
              `Planner joystick direction ${JSON.stringify(direction)} has no camera pan mapping.`,
            );
          }

          const currentCameraState = cameraLifecycle.readCurrentCameraState();

          if (currentCameraGeometry === null || currentCameraState === null) {
            throw new Error(
              `Planner joystick is unavailable while mapId ${JSON.stringify(mapId)} is loading.`,
            );
          }

          cameraLifecycle.commitCameraState(panCameraBy(
            currentCameraState,
            currentCameraGeometry,
            cameraPan,
          ));
        };
        joystickCameraPanReference.current = joystickCameraPan;
        interactionBinding = bindPlannerCanvasInteractions(
          mountedCanvasHostElement,
          resizeMapToViewport,
          {
            attachCameraControls: () =>
              attachPlannerCameraControls({
                canvasElement: pixiApplication.canvas,
                getCameraGeometry(): CameraGeometry {
                  if (currentCameraGeometry === null) {
                    throw new Error(
                      `Planner camera geometry is unavailable for mapId ${JSON.stringify(mapId)}.`,
                    );
                  }

                  return currentCameraGeometry;
                },
                getCameraState(): CameraState {
                  const currentCameraState =
                    cameraLifecycle.readCurrentCameraState();

                  if (currentCameraState === null) {
                    throw new Error(
                      `Planner camera state is unavailable for mapId ${JSON.stringify(mapId)}.`,
                    );
                  }

                  return currentCameraState;
                },
                getWheelZoomEnabled(): boolean {
                  return wheelZoomEnabledReference.current;
                },
                getPointerInteractionMode(): PointerInteractionMode {
                  return pointerInteractionModeReference.current;
                },
                getMapTileAtPointer(
                  pointerCoordinates: PointerCoordinates,
                ): MapPointerTile | null {
                  const cameraState = cameraLifecycle.readCurrentCameraState();

                  if (cameraState === null) {
                    throw new Error(
                      `Planner camera state is unavailable while finding a map tile for mapId ${JSON.stringify(mapId)}.`,
                    );
                  }

                  return getMapTileAtPointer({
                    pointerX: pointerCoordinates.x,
                    pointerY: pointerCoordinates.y,
                    cameraPositionX: cameraState.positionX,
                    cameraPositionY: cameraState.positionY,
                    zoom: cameraState.zoom,
                    mapTileWidth: renderingContract.tileWidth,
                    mapTileHeight: renderingContract.tileHeight,
                    mapWidth: renderingContract.mapWidth,
                    mapHeight: renderingContract.mapHeight,
                  });
                },
                getPlacementDragTarget(
                  pointerCoordinates: PointerCoordinates,
                ): PlacementDragTarget | null {
                  const selectedPlacementKeySet = new Set(
                    selectedPlacementKeysReference.current,
                  );
                  const selectedPlacementSprites = renderedPlacementSprites.filter(
                    (placementSprite) =>
                      selectedPlacementKeySet.has(placementSprite.placementKey),
                  );
                  const hitSprite = [...selectedPlacementSprites]
                    .reverse()
                    .find((placementSprite) =>
                      placementSprite.sprite.getBounds().containsPoint(
                        pointerCoordinates.x,
                        pointerCoordinates.y,
                      ),
                    );

                  return hitSprite === undefined
                    ? null
                    : { sprites: selectedPlacementSprites };
                },
                getPlacementSelectionKeysAtPointer(
                  pointerCoordinates: PointerCoordinates,
                ): readonly PlacementSelectionKey[] {
                  return findRenderedPlacementSelectionKeysAtPointer(
                    renderedPlacementSprites,
                    pointerCoordinates,
                  );
                },
                getPlacementDragTileSize(): Readonly<{
                  height: number;
                  width: number;
                }> {
                  return {
                    height: renderingContract.tileHeight,
                    width: renderingContract.tileWidth,
                  };
                },
                onMapTileHover(mapTileCoordinates: MapPointerTile | null): void {
                  if (!isMapLifecycleCurrent()) {
                    return;
                  }

                  hoveredMapTile = mapTileCoordinates;
                  requestPlacementPreviewOverlayRender();
                },
                onMapTileClick(mapTileCoordinates: MapPointerTile): void {
                  if (!isMapLifecycleCurrent()) {
                    return;
                  }

                  const wasInteriorDecorClickHandled =
                    dispatchInteriorDecorMapTileClick({
                      activeInteriorDecorPattern:
                        activeInteriorDecorPatternReference.current,
                      mapId,
                      mapTileCoordinates,
                      onInteriorDecorApply:
                        onInteriorDecorApplyReference.current,
                      onInteriorDecorRejected:
                        onInteriorDecorRejectedReference.current,
                      parsedMap,
                    });

                  if (wasInteriorDecorClickHandled) {
                    return;
                  }

                  onMapTileClickReference.current?.(
                    mapId,
                    mapTileCoordinates,
                  );
                },
                onMapTileRectangle(
                  startMapTileCoordinates: MapPointerTile,
                  endMapTileCoordinates: MapPointerTile,
                ): void {
                  if (!isMapLifecycleCurrent()) {
                    return;
                  }

                  onMapTileRectangleReference.current?.(
                    mapId,
                    startMapTileCoordinates,
                    endMapTileCoordinates,
                  );
                },
                onMapTileRectanglePreview(
                  startMapTileCoordinates: MapPointerTile,
                  endMapTileCoordinates: MapPointerTile,
                ): void {
                  if (!isMapLifecycleCurrent()) {
                    return;
                  }

                  mapTileRectanglePreviewRenderer.render(
                    startMapTileCoordinates,
                    endMapTileCoordinates,
                  );
                },
                onMapTileRectanglePreviewClear(): void {
                  if (!isMapLifecycleCurrent()) {
                    return;
                  }

                  mapTileRectanglePreviewRenderer.clear();
                },
                onPlacementSelectionClick(
                  placementSelectionKeys: readonly PlacementSelectionKey[],
                ): void {
                  if (!isMapLifecycleCurrent()) {
                    return;
                  }

                  onPlacementSelectionClickReference.current?.(
                    mapId,
                    placementSelectionKeys,
                  );
                },
                onMoveSelectedPlacements(tileDelta): void {
                  if (!isMapLifecycleCurrent()) {
                    return;
                  }
                  onMoveSelectedPlacementsReference.current?.(tileDelta);
                },
                setCameraState(cameraState: CameraState): void {
                  cameraLifecycle.commitCameraState(cameraState);
                },
              }),
            createResizeObserver: (onResize) => new ResizeObserver(onResize),
            windowPort: window,
          },
        );
        synchronizePointerInteractionMode = (): void => {
          interactionBinding?.synchronizePointerInteractionMode();
        };
        pointerInteractionModeSynchronizerReference.current =
          synchronizePointerInteractionMode;
        synchronizePointerInteractionMode();

        if (!isMapLifecycleCurrent()) {
          cleanUpPlannerCanvas();
          return;
        }
        performanceMarkerReference.current?.mark("editor:canvas-mounted");
        onCanvasReadyReference.current?.();

        if (!isMapLifecycleCurrent()) {
          cleanUpPlannerCanvas();
          return;
        }

        const committedExporterAndWarnings =
          commitPlannerCanvasExporterAndWarnings(
            isMapLifecycleCurrent,
            () => {
              onMapImageExporterReadyReference.current?.(
                mapId,
                createMapImageCaptureMethods({
                  captureMapScreenshotCanvas: (resolution) =>
                    captureMapScreenshotCanvas({
                      mapContainer: mapContainerCreationResult.mapContainer,
                      mapDisplayOverlayContainer,
                      mapTileRectanglePreviewGraphics,
                      placementPreviewContainer,
                      pixi,
                      pixiApplication,
                      renderingContract,
                      resolution,
                    }),
                }),
              );
            },
            () => {
              setKnownUnavailableTilesheetWarnings(
                mapContainerCreationResult.knownUnavailableTilesheetWarnings,
              );
            },
          );
        if (!committedExporterAndWarnings) {
          cleanUpPlannerCanvas();
          return;
        }
        setPlannerCanvasStatus({ kind: "ready" });
        if (!isMapLifecycleCurrent()) {
          cleanUpPlannerCanvas();
          return;
        }
        performanceMarkerReference.current?.mark("editor:interactive");
        onInteractiveReference.current?.();
      } catch (caughtError) {
        const wasUnmountedBeforeFailure =
          !isMapLifecycleCurrent();

        cleanUpPlannerCanvas();

        if (!wasUnmountedBeforeFailure) {
          const errorMessage = formatPlannerCanvasError(mapId, caughtError);
          setPlannerCanvasStatus({
            kind: "error",
            message: errorMessage,
          });
          onCanvasErrorReference.current?.(errorMessage);
        }
      }
    }

    void initializePlannerCanvas();

    return () => {
      cleanUpPlannerCanvas();
    };
  }, plannerCanvasInitializationDependencies);

  return (
    <section
      aria-busy={plannerCanvasStatus.kind === "loading"}
      aria-label={`Farm map canvas for ${mapId}`}
      className={`planner-canvas canvas-container ${
        pointerInteractionMode === "navigate" ? "cursor-mode" : "placement-active"
      }`}
    >
      <div className="planner-canvas__viewport" ref={canvasHostElementReference} />
      {canvasContextMenuPoint !== null ? (
        <PlannerCanvasContextMenu
          canvasHostElement={canvasHostElementReference.current}
          editorRootElement={canvasContextMenuEditorRootReference.current}
          focusRestoreElement={canvasContextMenuFocusRestoreReference.current}
          onClose={() => setCanvasContextMenuPoint(null)}
          onCopyFullMap={() =>
            onCopyFullMapFromContextMenuReference.current?.() ?? Promise.resolve()
          }
          position={canvasContextMenuPoint}
        />
      ) : null}
      {shouldRenderPlannerJoystick(showJoystick, selectedPlacementKeys) &&
      plannerCanvasStatus.kind === "ready" ? (
        <PlannerJoystick
          isLeftHanded={leftHandMode}
          onNudge={onNudgeSelectedPlacements}
          onPan={(direction) => {
            const panMapWithJoystick = joystickCameraPanReference.current;

            if (panMapWithJoystick === null) {
              throw new Error(
                `Planner joystick is unavailable while mapId ${JSON.stringify(mapId)} is loading.`,
              );
            }

            panMapWithJoystick(direction);
          }}
        />
      ) : null}
      {plannerCanvasStatus.kind === "loading" ? (
        <p className="planner-canvas__status" role="status">
          Loading local map {mapId}…
        </p>
      ) : null}
      {plannerCanvasStatus.kind === "error" ? (
        <p className="planner-canvas__error" role="alert">
          {plannerCanvasStatus.message}
        </p>
      ) : null}
      {knownUnavailableTilesheetWarnings.map((warningMessage) => (
        <p className="planner-canvas__warning" key={warningMessage} role="status">
          {warningMessage}
        </p>
      ))}
    </section>
  );
}

type CaptureMapScreenshotInput = Readonly<{
  mapContainer: import("pixi.js").Container;
  mapDisplayOverlayContainer: import("pixi.js").Container;
  mapTileRectanglePreviewGraphics: import("pixi.js").Graphics;
  placementPreviewContainer: import("pixi.js").Container;
  pixi: PixiModule;
  pixiApplication: PixiApplication;
  renderingContract: MapRenderingContract;
  resolution: ScreenshotResolution;
}>;

export function createMapImageCaptureMethods(
  input: Readonly<{
    captureMapScreenshotCanvas: (
      resolution: ScreenshotResolution,
    ) => Promise<HTMLCanvasElement>;
  }>,
): MapImageExporter {
  return {
    async captureCleanMapImage(resolution): Promise<Blob> {
      return createPngBlob(await input.captureMapScreenshotCanvas(resolution));
    },
    async captureScreenshot(resolution): Promise<Blob> {
      const mapScreenshotCanvas = await input.captureMapScreenshotCanvas(resolution);
      return createPngBlob(createWatermarkedScreenshotCanvas(mapScreenshotCanvas));
    },
  };
}

async function captureMapScreenshotCanvas(
  captureMapScreenshotInput: CaptureMapScreenshotInput,
): Promise<HTMLCanvasElement> {
  const {
    mapContainer,
    mapDisplayOverlayContainer,
    mapTileRectanglePreviewGraphics,
    placementPreviewContainer,
    pixi,
    pixiApplication,
    renderingContract,
    resolution,
  } = captureMapScreenshotInput;
  const screenshotDimensions = createMapScreenshotDimensions({
    mapHeight: renderingContract.mapHeight,
    mapWidth: renderingContract.mapWidth,
    resolution,
    tileHeight: renderingContract.tileHeight,
    tileWidth: renderingContract.tileWidth,
  });
  const screenshotRenderTextureReference: {
    current: import("pixi.js").RenderTexture | null;
  } = { current: null };

  try {
    return await renderMapScreenshotWithoutEditorOverlays({
      mapDisplayOverlayContainer,
      mapTileRectanglePreviewGraphics,
      placementPreviewContainer,
      renderScreenshot: () =>
        renderMapScreenshotWithFullMapTransform({
          mapContainer,
          renderScreenshot: () => {
            screenshotRenderTextureReference.current = pixi.RenderTexture.create({
              height: screenshotDimensions.height,
              resolution: 1,
              width: screenshotDimensions.width,
            });
            pixiApplication.renderer.render({
              container: mapContainer,
              target: screenshotRenderTextureReference.current,
            });
            const extractedCanvas = pixiApplication.renderer.extract.canvas(
              screenshotRenderTextureReference.current,
            );
            const mapScreenshotCanvas = assertHtmlCanvasElement(extractedCanvas);
            return mapScreenshotCanvas;
          },
          resolution,
        }),
    });
  } finally {
    screenshotRenderTextureReference.current?.destroy(true);
    pixiApplication.renderer.render(pixiApplication.stage);
  }
}

export async function renderMapScreenshotWithFullMapTransform<Result>(
  input: Readonly<{
    mapContainer: import("pixi.js").Container;
    renderScreenshot: () => Promise<Result> | Result;
    resolution: ScreenshotResolution;
  }>,
): Promise<Result> {
  const originalMapPivot = {
    x: input.mapContainer.pivot.x,
    y: input.mapContainer.pivot.y,
  };
  const originalMapPosition = {
    x: input.mapContainer.position.x,
    y: input.mapContainer.position.y,
  };
  const originalMapScale = {
    x: input.mapContainer.scale.x,
    y: input.mapContainer.scale.y,
  };

  try {
    input.mapContainer.pivot.set(0, 0);
    input.mapContainer.position.set(0, 0);
    input.mapContainer.scale.set(input.resolution);
    return await input.renderScreenshot();
  } finally {
    input.mapContainer.pivot.set(originalMapPivot.x, originalMapPivot.y);
    input.mapContainer.scale.set(originalMapScale.x, originalMapScale.y);
    input.mapContainer.position.set(originalMapPosition.x, originalMapPosition.y);
  }
}

export async function renderMapScreenshotWithoutEditorOverlays<Result>(
  input: Readonly<{
    mapDisplayOverlayContainer: { visible: boolean };
    mapTileRectanglePreviewGraphics: { visible: boolean };
    placementPreviewContainer: { visible: boolean };
    renderScreenshot: () => Promise<Result> | Result;
  }>,
): Promise<Result> {
  const wasMapDisplayOverlayVisible = input.mapDisplayOverlayContainer.visible;
  const wasMapTileRectanglePreviewVisible =
    input.mapTileRectanglePreviewGraphics.visible;
  const wasPlacementPreviewVisible = input.placementPreviewContainer.visible;

  try {
    input.mapDisplayOverlayContainer.visible = false;
    input.mapTileRectanglePreviewGraphics.visible = false;
    input.placementPreviewContainer.visible = false;
    return await input.renderScreenshot();
  } finally {
    input.mapDisplayOverlayContainer.visible = wasMapDisplayOverlayVisible;
    input.mapTileRectanglePreviewGraphics.visible =
      wasMapTileRectanglePreviewVisible;
    input.placementPreviewContainer.visible = wasPlacementPreviewVisible;
  }
}

function assertHtmlCanvasElement(extractedCanvas: unknown): HTMLCanvasElement {
  if (typeof HTMLCanvasElement === "undefined") {
    throw new Error("Map screenshot export requires HTMLCanvasElement support.");
  }

  if (!(extractedCanvas instanceof HTMLCanvasElement)) {
    throw new TypeError(
      `Pixi map screenshot extraction must return an HTMLCanvasElement; received ${describeValue(extractedCanvas)}.`,
    );
  }

  return extractedCanvas;
}

function createWatermarkedScreenshotCanvas(
  mapScreenshotCanvas: HTMLCanvasElement,
): HTMLCanvasElement {
  if (typeof document === "undefined") {
    throw new Error("Map screenshot export requires a browser document.");
  }

  const footerHeight = getMapScreenshotFooterHeight(mapScreenshotCanvas.height);
  const watermarkedScreenshotCanvas = document.createElement("canvas");
  watermarkedScreenshotCanvas.width = mapScreenshotCanvas.width;
  watermarkedScreenshotCanvas.height = mapScreenshotCanvas.height + footerHeight;
  const canvasContext = watermarkedScreenshotCanvas.getContext("2d");

  if (canvasContext === null) {
    throw new Error("Map screenshot export could not create a 2D canvas context.");
  }

  canvasContext.drawImage(mapScreenshotCanvas, 0, 0);
  canvasContext.fillStyle = "#03311C";
  canvasContext.fillRect(
    0,
    mapScreenshotCanvas.height,
    watermarkedScreenshotCanvas.width,
    footerHeight,
  );
  const watermarkFontSize = Math.max(12, Math.round(footerHeight * 0.55));
  canvasContext.font = `600 ${String(watermarkFontSize)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  canvasContext.fillStyle = "#eaf5ee";
  canvasContext.textBaseline = "middle";
  canvasContext.fillText(
    "StardewPlan.com",
    Math.round(footerHeight * 0.5),
    mapScreenshotCanvas.height + footerHeight / 2,
  );

  return watermarkedScreenshotCanvas;
}

function createPngBlob(screenshotCanvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    screenshotCanvas.toBlob((screenshotBlob) => {
      if (screenshotBlob === null) {
        reject(new Error("Map screenshot export could not encode the PNG image."));
        return;
      }

      resolve(screenshotBlob);
    }, "image/png");
  });
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    return Object.prototype.toString.call(value);
  }

  return JSON.stringify(value);
}

export function notifyMapPlacementGridReady(
  mapPlacementGridReadyNotificationProperties: MapPlacementGridReadyNotificationProperties,
): void {
  const {
    isMapLifecycleCurrent,
    mapId,
    onMapPlacementGridReady,
    parsedMap,
  } = mapPlacementGridReadyNotificationProperties;

  if (
    onMapPlacementGridReady === undefined ||
    !isMapLifecycleCurrent()
  ) {
    return;
  }

  const mapPlacementGrid = createMapPlacementGrid(parsedMap);

  if (!isMapLifecycleCurrent()) {
    return;
  }

  onMapPlacementGridReady(mapId, mapPlacementGrid);
}

export function createPixiApplicationLifetime<Application>(
  destroyApplication: (application: Application) => void,
): PixiApplicationLifetime<Application> {
  let application: Application | null = null;
  let initializationFinished = false;
  let destructionRequested = false;
  let applicationDestroyed = false;

  function destroyInitializedApplicationIfRequired(): void {
    if (
      !destructionRequested ||
      !initializationFinished ||
      application === null ||
      applicationDestroyed
    ) {
      return;
    }

    applicationDestroyed = true;
    destroyApplication(application);
  }

  return {
    setApplication(nextApplication: Application): void {
      if (application !== null) {
        throw new Error("Pixi application lifetime already has an application.");
      }

      if (initializationFinished) {
        throw new Error(
          "Pixi application lifetime cannot receive an application after initialization has finished.",
        );
      }

      application = nextApplication;
      destroyInitializedApplicationIfRequired();
    },
    finishInitialization(): void {
      initializationFinished = true;
      destroyInitializedApplicationIfRequired();
    },
    requestDestruction(): void {
      destructionRequested = true;
      destroyInitializedApplicationIfRequired();
    },
    isDestructionRequested(): boolean {
      return destructionRequested;
    },
  };
}

export function formatKnownUnavailableTilesheetWarning(
  mapId: string,
  knownUnavailableTilesheet: KnownUnavailableTilesheet,
): string {
  return `Map ${JSON.stringify(mapId)} skips unavailable tilesheet ${JSON.stringify(knownUnavailableTilesheet.outputPath)}. ${knownUnavailableTilesheet.reason}`;
}

export function getLoadableTilesheets(
  renderingTilesets: readonly RenderingTileset[],
): readonly LoadableTilesheet[] {
  return renderingTilesets.flatMap((renderingTileset, tilesetIndex) => {
    if (isKnownUnavailableRenderingTileset(renderingTileset)) {
      return [];
    }

    return [
      {
        tilesetIndex,
        assetPath: renderingTileset.assetPath,
      },
    ];
  });
}

export function getInteriorDecorStateRevision(
  interiorDecorState: InteriorDecorState | undefined,
): string {
  return interiorDecorState === undefined
    ? ""
    : JSON.stringify(interiorDecorState);
}

export function applyPlacementSnapshotInteriorDecor(
  loadedMap: TmxMap,
  interiorDecorState: InteriorDecorState | undefined,
): TmxMap {
  return interiorDecorState === undefined
    ? loadedMap
    : applyInteriorDecorToMap(loadedMap, interiorDecorState);
}

export type InteriorDecorMapTileClickInput = Readonly<{
  activeInteriorDecorPattern: InteriorDecorCatalogPattern | null;
  mapId: string;
  mapTileCoordinates: MapPointerTile;
  onInteriorDecorApply?: (
    mapId: string,
    interiorDecorKind: InteriorDecorKind,
    targetId: string,
    patternId: string,
  ) => void;
  onInteriorDecorRejected?: (
    mapId: string,
    interiorDecorKind: InteriorDecorKind,
  ) => void;
  parsedMap: TmxMap;
}>;

export function dispatchInteriorDecorMapTileClick(
  interiorDecorMapTileClickInput: InteriorDecorMapTileClickInput,
): boolean {
  const {
    activeInteriorDecorPattern,
    mapId,
    mapTileCoordinates,
    onInteriorDecorApply,
    onInteriorDecorRejected,
    parsedMap,
  } = interiorDecorMapTileClickInput;

  if (activeInteriorDecorPattern === null) {
    return false;
  }

  const targetId = getInteriorDecorTargetAtTile(
    parsedMap,
    activeInteriorDecorPattern.kind,
    mapTileCoordinates,
  );

  if (targetId === null) {
    onInteriorDecorRejected?.(mapId, activeInteriorDecorPattern.kind);
    return true;
  }

  onInteriorDecorApply?.(
    mapId,
    activeInteriorDecorPattern.kind,
    targetId,
    activeInteriorDecorPattern.patternId,
  );
  return true;
}

export async function loadPlannerCanvasInitialTextures(
  pixi: PixiModule,
  renderingTilesets: readonly RenderingTileset[],
  resolvedInitialPlacementTextureEntries: readonly ResolvedPlacementTextureEntry[],
  placementTexturePromisesByResolvedUrl: Map<string, Promise<PixiTexture>>,
): Promise<
  Readonly<{
    resourceClumpTilesheetTexture: PixiTexture;
    tilesheetTextures: ReadonlyMap<number, PixiTexture>;
  }>
> {
  const initialPlacementTextureAssetPaths = [
    ...new Set(resolvedInitialPlacementTextureEntries.map(
      (resolvedPlacementTextureEntry) =>
        resolvedPlacementTextureEntry.resolvedAssetPath,
    )),
  ];
  const [tilesheetTextures, resourceClumpTilesheetTexture] = await Promise.all([
    loadTilesheetTextures(
      pixi,
      renderingTilesets,
      placementTexturePromisesByResolvedUrl,
    ),
    loadResourceClumpTilesheetTexture(
      pixi,
      placementTexturePromisesByResolvedUrl,
    ),
    Promise.all(initialPlacementTextureAssetPaths.map(
      (resolvedAssetPath) => loadPlannerTextureWithResolvedUrlCache(
        pixi,
        resolvedAssetPath,
        placementTexturePromisesByResolvedUrl,
      ),
    )),
  ]);

  return { resourceClumpTilesheetTexture, tilesheetTextures };
}

async function loadTilesheetTextures(
  pixi: PixiModule,
  renderingTilesets: readonly RenderingTileset[],
  placementTexturePromisesByResolvedUrl: Map<string, Promise<PixiTexture>>,
): Promise<ReadonlyMap<number, PixiTexture>> {
  const textureEntries = await Promise.all(
    getLoadableTilesheets(renderingTilesets).map(
      async ({ assetPath, tilesetIndex }) => {
        const tilesheetTexture = await loadPlannerTextureWithResolvedUrlCache(
          pixi,
          resolveInitialPlannerTextureAssetPath(assetPath),
          placementTexturePromisesByResolvedUrl,
        );

        return [tilesetIndex, tilesheetTexture] as const;
      },
    ),
  );

  return new Map(textureEntries);
}

async function loadResourceClumpTilesheetTexture(
  pixi: PixiModule,
  placementTexturePromisesByResolvedUrl: Map<string, Promise<PixiTexture>>,
): Promise<PixiTexture> {
  return loadPlannerTextureWithResolvedUrlCache(
    pixi,
    resolveInitialPlannerTextureAssetPath(
      `${localGameAssetRoot}sprites/springobjects.png`,
    ),
    placementTexturePromisesByResolvedUrl,
  );
}

function createResourceClumpFrameTextures(
  pixi: PixiModule,
  resourceClumpTilesheetTexture: PixiTexture,
): ReadonlyMap<number, PixiTexture> {
  const sourceCellSize = 16;
  const sourceColumnCount = 24;
  const sourceFrameSize = 32;
  const parentSheetIndexes = [600, 602, 672] as const;

  return new Map(
    parentSheetIndexes.map((parentSheetIndex) => [
      parentSheetIndex,
      new pixi.Texture({
        frame: new pixi.Rectangle(
          (parentSheetIndex % sourceColumnCount) * sourceCellSize,
          Math.floor(parentSheetIndex / sourceColumnCount) * sourceCellSize,
          sourceFrameSize,
          sourceFrameSize,
        ),
        source: resourceClumpTilesheetTexture.source,
      }),
    ]),
  );
}

function destroyResourceClumpFrameTextures(
  resourceClumpFrameTexturesByParentSheetIndex: ReadonlyMap<
    number,
    PixiTexture
  > | null,
): void {
  if (resourceClumpFrameTexturesByParentSheetIndex === null) {
    return;
  }

  for (const resourceClumpFrameTexture of resourceClumpFrameTexturesByParentSheetIndex.values()) {
    resourceClumpFrameTexture.destroy();
  }
}

type CreateMapDisplayOverlayContainerInput = Readonly<{
  editorDisplayOptions: EditorDisplayOptions;
  mapPlacementGrid: MapPlacementGrid;
  mapFile: string;
  parsedMap: TmxMap;
  placementSnapshot: PlacementSnapshot | undefined;
  pixi: PixiModule;
  resourceClumpFrameTexturesByParentSheetIndex: ReadonlyMap<number, PixiTexture>;
  showResourceClumpSpawnLocations: boolean;
  tileHeight: number;
  tileWidth: number;
}>;

type CreateNightModeOverlayContainerInput = Readonly<{
  catalogItems: readonly CatalogItem[] | undefined;
  editorDisplayOptions: EditorDisplayOptions;
  mapPlacementGrid: MapPlacementGrid;
  pixi: PixiModule;
  placementSnapshot: PlacementSnapshot | undefined;
  tileHeight: number;
  tileWidth: number;
}>;

function createMapDisplayOverlayContainer(
  createMapDisplayOverlayContainerInput: CreateMapDisplayOverlayContainerInput,
): import("pixi.js").Container {
  const {
    editorDisplayOptions,
    mapPlacementGrid,
    mapFile,
    parsedMap,
    placementSnapshot,
    pixi,
    resourceClumpFrameTexturesByParentSheetIndex,
    showResourceClumpSpawnLocations,
    tileHeight,
    tileWidth,
  } = createMapDisplayOverlayContainerInput;
  const mapDisplayOverlayContainer = new pixi.Container();
  const mapDisplayGraphics = new pixi.Graphics();

  if (editorDisplayOptions.showGrid) {
    drawMapGridLines(
      mapDisplayGraphics,
      mapPlacementGrid,
      tileWidth,
      tileHeight,
    );
  }

  for (const mapDisplayOverlayTile of createMapDisplayOverlayTiles(
    mapPlacementGrid,
    editorDisplayOptions,
  )) {
    mapDisplayGraphics
      .rect(
        mapDisplayOverlayTile.x * tileWidth,
        mapDisplayOverlayTile.y * tileHeight,
        tileWidth,
        tileHeight,
      )
      .fill({
        alpha: 0.35,
        color: getMapDisplayOverlayColor(mapDisplayOverlayTile.kind),
      });
  }

  if (editorDisplayOptions.showNpcPaths) {
    for (const npcPathOverlayTile of createNpcPathOverlayTiles(mapFile, parsedMap)) {
      mapDisplayGraphics
        .rect(
          npcPathOverlayTile.x * tileWidth,
          npcPathOverlayTile.y * tileHeight,
          tileWidth,
          tileHeight,
        )
        .fill({ alpha: 0.45, color: 0xcc0000 });
    }
  }

  if (placementSnapshot !== undefined) {
    for (const placementCoverageOverlayRectangle of createPlacementCoverageOverlayRectangles(
      placementSnapshot,
      editorDisplayOptions,
    )) {
      mapDisplayGraphics
        .rect(
          placementCoverageOverlayRectangle.x * tileWidth,
          placementCoverageOverlayRectangle.y * tileHeight,
          placementCoverageOverlayRectangle.width * tileWidth,
          placementCoverageOverlayRectangle.height * tileHeight,
        )
        .fill({
          alpha: 0.16,
          color: placementCoverageOverlayRectangle.color,
        })
        .stroke({
          alpha: 0.62,
          color: placementCoverageOverlayRectangle.color,
          width: 1,
        });
    }
  }

  mapDisplayOverlayContainer.addChild(mapDisplayGraphics);

  if (showResourceClumpSpawnLocations) {
    mapDisplayOverlayContainer.addChild(
      createResourceClumpOverlayContainer({
        parsedMap,
        pixi,
        resourceClumpFrameTexturesByParentSheetIndex,
        tileHeight,
        tileWidth,
      }),
    );
  }

  return mapDisplayOverlayContainer;
}

function createResourceClumpOverlayContainer(
  createResourceClumpOverlayContainerInput: Readonly<{
    parsedMap: TmxMap;
    pixi: PixiModule;
    resourceClumpFrameTexturesByParentSheetIndex: ReadonlyMap<number, PixiTexture>;
    tileHeight: number;
    tileWidth: number;
  }>,
): import("pixi.js").Container {
  const resourceClumpOverlayContainer = new createResourceClumpOverlayContainerInput.pixi.Container();
  resourceClumpOverlayContainer.label = "resourceClumps";

  for (const resourceClumpOverlayEntry of createResourceClumpOverlayEntries(
    createResourceClumpOverlayContainerInput.parsedMap,
  )) {
    const resourceClumpFrameTexture =
      createResourceClumpOverlayContainerInput.resourceClumpFrameTexturesByParentSheetIndex.get(
        resourceClumpOverlayEntry.parentSheetIndex,
      );

    if (resourceClumpFrameTexture === undefined) {
      throw new Error(
        `Resource-clump overlay texture is unavailable for parentSheetIndex ${String(resourceClumpOverlayEntry.parentSheetIndex)}.`,
      );
    }

    const resourceClumpSprite = new createResourceClumpOverlayContainerInput.pixi.Sprite({
      roundPixels: true,
      texture: resourceClumpFrameTexture,
    });
    resourceClumpSprite.alpha = 0.5;
    resourceClumpSprite.position.set(
      resourceClumpOverlayEntry.x * createResourceClumpOverlayContainerInput.tileWidth,
      resourceClumpOverlayEntry.y * createResourceClumpOverlayContainerInput.tileHeight,
    );
    resourceClumpSprite.width = 2 * createResourceClumpOverlayContainerInput.tileWidth;
    resourceClumpSprite.height = 2 * createResourceClumpOverlayContainerInput.tileHeight;
    resourceClumpOverlayContainer.addChild(resourceClumpSprite);
  }

  return resourceClumpOverlayContainer;
}

export function createNightModeOverlayContainer(
  createNightModeOverlayContainerInput: CreateNightModeOverlayContainerInput,
): import("pixi.js").Container {
  const {
    catalogItems,
    editorDisplayOptions,
    mapPlacementGrid,
    pixi,
    placementSnapshot,
    tileHeight,
    tileWidth,
  } = createNightModeOverlayContainerInput;
  const nightModeOverlayContainer = new pixi.Container();

  if (!editorDisplayOptions.showNightMode) {
    return nightModeOverlayContainer;
  }

  const nightModeGraphics = new pixi.Graphics();
  nightModeGraphics
    .rect(
      0,
      0,
      mapPlacementGrid.width * tileWidth,
      mapPlacementGrid.height * tileHeight,
    )
    .fill({ alpha: 0.48, color: 0x061329 });

  if (catalogItems !== undefined && placementSnapshot !== undefined) {
    const nightLightRenderDescriptors = createNightLightRenderDescriptors({
      catalogItems,
      isNightMode: true,
      placementSnapshot,
      tileHeight,
      tileWidth,
    });

    for (const nightLightRenderDescriptor of nightLightRenderDescriptors) {
      drawNightLightShape(nightModeGraphics, nightLightRenderDescriptor);
    }
  }

  nightModeOverlayContainer.addChild(nightModeGraphics);
  return nightModeOverlayContainer;
}

function drawNightLightShape(
  nightModeGraphics: import("pixi.js").Graphics,
  nightLightRenderDescriptor: NightLightRenderDescriptor,
): void {
  const { centerX, centerY, color, radiusInPixels } = nightLightRenderDescriptor;

  nightModeGraphics
    .circle(centerX, centerY, radiusInPixels)
    .fill({ alpha: 0.12, color });
  nightModeGraphics
    .circle(centerX, centerY, radiusInPixels * 0.66)
    .fill({ alpha: 0.18, color });
  nightModeGraphics
    .circle(centerX, centerY, radiusInPixels * 0.33)
    .fill({ alpha: 0.26, color });
}

function drawMapGridLines(
  mapDisplayGraphics: import("pixi.js").Graphics,
  mapPlacementGrid: MapPlacementGrid,
  tileWidth: number,
  tileHeight: number,
): void {
  for (let x = 0; x <= mapPlacementGrid.width; x += 1) {
    mapDisplayGraphics
      .moveTo(x * tileWidth, 0)
      .lineTo(x * tileWidth, mapPlacementGrid.height * tileHeight)
      .stroke({ alpha: 0.4, color: 0xe6f1d5, width: 1 });
  }

  for (let y = 0; y <= mapPlacementGrid.height; y += 1) {
    mapDisplayGraphics
      .moveTo(0, y * tileHeight)
      .lineTo(mapPlacementGrid.width * tileWidth, y * tileHeight)
      .stroke({ alpha: 0.4, color: 0xe6f1d5, width: 1 });
  }
}

export function createMapTileRectanglePreviewRenderer(
  input: Readonly<{
    graphics: import("pixi.js").Graphics;
    render: () => void;
    tileHeight: number;
    tileWidth: number;
  }>,
): MapTileRectanglePreviewRenderer {
  const clear = (): void => {
    input.graphics.clear();
    input.render();
  };

  return {
    clear,
    render(startMapTileCoordinates, endMapTileCoordinates): void {
      const mapTileRectangle = getMapTileRectanglePixels(
        startMapTileCoordinates,
        endMapTileCoordinates,
        input.tileWidth,
        input.tileHeight,
      );

      input.graphics.clear();
      input.graphics
        .rect(
          mapTileRectangle.x,
          mapTileRectangle.y,
          mapTileRectangle.width,
          mapTileRectangle.height,
        )
        .fill({
          alpha: mapTileRectanglePreviewFillAlpha,
          color: mapTileRectanglePreviewColor,
        });
      drawDashedMapTileRectangleBorder(input.graphics, mapTileRectangle);
      input.render();
    },
  };
}

function getMapTileRectanglePixels(
  startMapTileCoordinates: MapPointerTile,
  endMapTileCoordinates: MapPointerTile,
  tileWidth: number,
  tileHeight: number,
): Readonly<{ height: number; width: number; x: number; y: number }> {
  const startTileX = Math.min(startMapTileCoordinates.x, endMapTileCoordinates.x);
  const startTileY = Math.min(startMapTileCoordinates.y, endMapTileCoordinates.y);
  const endTileX = Math.max(startMapTileCoordinates.x, endMapTileCoordinates.x);
  const endTileY = Math.max(startMapTileCoordinates.y, endMapTileCoordinates.y);

  return {
    height: (endTileY - startTileY + 1) * tileHeight,
    width: (endTileX - startTileX + 1) * tileWidth,
    x: startTileX * tileWidth,
    y: startTileY * tileHeight,
  };
}

function drawDashedMapTileRectangleBorder(
  graphics: import("pixi.js").Graphics,
  mapTileRectangle: Readonly<{ height: number; width: number; x: number; y: number }>,
): void {
  drawDashedMapTileRectangleEdge(
    graphics,
    { x: mapTileRectangle.x, y: mapTileRectangle.y },
    { x: mapTileRectangle.x + mapTileRectangle.width, y: mapTileRectangle.y },
  );
  drawDashedMapTileRectangleEdge(
    graphics,
    { x: mapTileRectangle.x + mapTileRectangle.width, y: mapTileRectangle.y },
    {
      x: mapTileRectangle.x + mapTileRectangle.width,
      y: mapTileRectangle.y + mapTileRectangle.height,
    },
  );
  drawDashedMapTileRectangleEdge(
    graphics,
    {
      x: mapTileRectangle.x + mapTileRectangle.width,
      y: mapTileRectangle.y + mapTileRectangle.height,
    },
    { x: mapTileRectangle.x, y: mapTileRectangle.y + mapTileRectangle.height },
  );
  drawDashedMapTileRectangleEdge(
    graphics,
    { x: mapTileRectangle.x, y: mapTileRectangle.y + mapTileRectangle.height },
    { x: mapTileRectangle.x, y: mapTileRectangle.y },
  );
}

function drawDashedMapTileRectangleEdge(
  graphics: import("pixi.js").Graphics,
  edgeStart: Readonly<{ x: number; y: number }>,
  edgeEnd: Readonly<{ x: number; y: number }>,
): void {
  const edgeLength = Math.hypot(edgeEnd.x - edgeStart.x, edgeEnd.y - edgeStart.y);
  const directionX = (edgeEnd.x - edgeStart.x) / edgeLength;
  const directionY = (edgeEnd.y - edgeStart.y) / edgeLength;

  for (
    let dashStartDistance = 0;
    dashStartDistance < edgeLength;
    dashStartDistance += mapTileRectanglePreviewDashLength + mapTileRectanglePreviewDashGap
  ) {
    const dashEndDistance = Math.min(
      dashStartDistance + mapTileRectanglePreviewDashLength,
      edgeLength,
    );
    graphics
      .moveTo(
        edgeStart.x + directionX * dashStartDistance,
        edgeStart.y + directionY * dashStartDistance,
      )
      .lineTo(
        edgeStart.x + directionX * dashEndDistance,
        edgeStart.y + directionY * dashEndDistance,
      )
      .stroke({
        color: mapTileRectanglePreviewColor,
        width: mapTileRectanglePreviewStrokeWidth,
      });
  }
}

function getMapDisplayOverlayColor(
  mapDisplayOverlayKind: "blocked-buildings" | "blocked-crops" | "blocked-trees",
): number {
  if (mapDisplayOverlayKind === "blocked-buildings") {
    return 0xcc0000;
  }

  if (mapDisplayOverlayKind === "blocked-crops") {
    return 0xe07b21;
  }

  return 0x7d3f98;
}

function replaceMapDisplayOverlayChildren(
  mapDisplayOverlayContainer: import("pixi.js").Container,
  nextMapDisplayOverlayContainer: import("pixi.js").Container | null,
): void {
  const currentMapDisplayOverlayChildren =
    mapDisplayOverlayContainer.removeChildren();

  for (const currentMapDisplayOverlayChild of currentMapDisplayOverlayChildren) {
    currentMapDisplayOverlayChild.destroy({ children: true });
  }

  if (nextMapDisplayOverlayContainer !== null) {
    mapDisplayOverlayContainer.addChild(nextMapDisplayOverlayContainer);
  }
}

function createMapContainer(
  pixi: PixiModule,
  renderingContract: MapRenderingContract,
  tilesheetTextures: ReadonlyMap<number, PixiTexture>,
): MapContainerCreationResult {
  const mapContainer = new pixi.Container();
  const tileTextureByFrame = new Map<string, PixiTexture>();
  const knownUnavailableTilesheetWarnings = new Set<string>();

  for (const renderingTileLayer of renderingContract.visibleTileLayers) {
    const layerContainer = new pixi.Container();

    layerContainer.alpha = renderingTileLayer.opacity;
    layerContainer.position.set(
      renderingTileLayer.offsetX,
      renderingTileLayer.offsetY,
    );
    const layerTileGeometryResolver = createLayerTileGeometryResolver({
      mapId: renderingContract.mapId,
      mapTileWidth: renderingContract.tileWidth,
      mapTileHeight: renderingContract.tileHeight,
      layer: renderingTileLayer,
      tilesets: renderingContract.tilesets,
    });

    for (
      let tileIndex = 0;
      tileIndex < renderingTileLayer.rawGids.length;
      tileIndex += 1
    ) {
      const resolvedTileGeometry = layerTileGeometryResolver.resolveTile(tileIndex);

      if (resolvedTileGeometry === null) {
        continue;
      }

      const renderingTileset =
        renderingContract.tilesets[resolvedTileGeometry.tilesetIndex];

      if (renderingTileset === undefined) {
        throw new Error(
          `Rendering tileset is unavailable at index ${resolvedTileGeometry.tilesetIndex} for mapId ${JSON.stringify(renderingContract.mapId)} and layer ${JSON.stringify(renderingTileLayer.name)}.`,
        );
      }

      if (isKnownUnavailableRenderingTileset(renderingTileset)) {
        knownUnavailableTilesheetWarnings.add(
          formatKnownUnavailableTilesheetWarning(
            renderingContract.mapId,
            renderingTileset.knownUnavailable,
          ),
        );
        continue;
      }

      const tileTexture = getFrameTexture(
        pixi,
        tileTextureByFrame,
        tilesheetTextures,
        renderingContract.mapId,
        resolvedTileGeometry.tilesetIndex,
        resolvedTileGeometry.frameX,
        resolvedTileGeometry.frameY,
        resolvedTileGeometry.frameWidth,
        resolvedTileGeometry.frameHeight,
      );
      const tileSprite = new pixi.Sprite({
        roundPixels: true,
        texture: tileTexture,
      });

      tileSprite.anchor.set(0.5);
      tileSprite.position.set(
        resolvedTileGeometry.positionX + resolvedTileGeometry.frameWidth / 2,
        resolvedTileGeometry.positionY + resolvedTileGeometry.frameHeight / 2,
      );
      tileSprite.rotation = resolvedTileGeometry.transform.rotationRadians;
      tileSprite.scale.set(
        resolvedTileGeometry.transform.scaleX,
        resolvedTileGeometry.transform.scaleY,
      );
      layerContainer.addChild(tileSprite);
    }

    mapContainer.addChild(layerContainer);
  }

  return {
    mapContainer,
    knownUnavailableTilesheetWarnings: [...knownUnavailableTilesheetWarnings],
  };
}

type CreatePlacementSpritesBaseInput = Readonly<{
  pixi: PixiModule;
  catalogItems: readonly CatalogItem[];
  isNightMode: boolean;
  mapId: string;
  mapPlacementGrid: MapPlacementGrid;
  season: TilesheetSeason;
  selectedPlacementKeys: readonly string[];
  tileWidth: number;
  tileHeight: number;
  placementTexturePromisesByResolvedUrl: Map<string, Promise<PixiTexture>>;
}>;

type CreatePlacementSpritesInput = CreatePlacementSpritesBaseInput & (
  | Readonly<{
      placementRenderEntries?: never;
      placementSnapshot: PlacementSnapshot;
    }>
  | Readonly<{
      placementRenderEntries: readonly PlacementRenderEntry[];
      placementSnapshot?: never;
    }>
);

async function createPlacementSprites(
  createPlacementSpritesInput: CreatePlacementSpritesInput,
): Promise<readonly PlacementSprite[]> {
  const allPlacementRenderEntries =
    createPlacementSpritesInput.placementRenderEntries
    ?? createPlacementRenderEntries(
      createPlacementSpritesInput.placementSnapshot,
      createPlacementSpritesInput.catalogItems,
      createPlacementSpritesInput.season,
      createPlacementSpritesInput.mapId,
      createPlacementSpritesInput.mapPlacementGrid,
      createPlacementSpritesInput.isNightMode,
    );
  const resolvedPlacementTextureEntries = resolvePlacementTextureEntries(
    allPlacementRenderEntries,
  );
  const placementTexturesByResolvedAssetPath = await loadPlacementTextures(
    createPlacementSpritesInput.pixi,
    resolvedPlacementTextureEntries,
    createPlacementSpritesInput.placementTexturePromisesByResolvedUrl,
  );
  const selectedPlacementKeySet = new Set(
    createPlacementSpritesInput.selectedPlacementKeys,
  );

  return createPlacementSpriteBatch({
    destroyCreatedPlacementSprites: destroyPlacementSprites,
    placementSpritePromises: resolvedPlacementTextureEntries.map(async (
      resolvedPlacementTextureEntry,
    ) => {
      const placementRenderEntry =
        resolvedPlacementTextureEntry.placementRenderEntry;
      const placementTexture = getRequiredPlacementTexture(
        placementTexturesByResolvedAssetPath,
        resolvedPlacementTextureEntry.resolvedAssetPath,
      );
      const isSelected = selectedPlacementKeySet.has(placementRenderEntry.key);
      getPlacementSpriteTintColor(placementRenderEntry.tintColor, isSelected);
      const paintedTexture = await createPaintedBuildingTexture(
        createPlacementSpritesInput.pixi,
        placementRenderEntry,
      );

      return createPlacementSprite(
        createPlacementSpritesInput.pixi,
        {
          ...placementRenderEntry,
          frame: resolvedPlacementTextureEntry.resolvedFrame,
        },
        paintedTexture ?? placementTexture,
        paintedTexture,
        createPlacementSpritesInput.tileWidth,
        createPlacementSpritesInput.tileHeight,
        isSelected,
      );
    }),
  });
}

export async function loadPlacementTextures(
  pixi: PixiModule,
  resolvedPlacementTextureEntries: readonly ResolvedPlacementTextureEntry[],
  placementTexturePromisesByResolvedUrl: Map<string, Promise<PixiTexture>>,
): Promise<ReadonlyMap<string, PixiTexture>> {
  const resolvedAssetPaths = [
    ...new Set(resolvedPlacementTextureEntries.map(
      (resolvedPlacementTextureEntry) =>
        resolvedPlacementTextureEntry.resolvedAssetPath,
    )),
  ];
  const textureEntries = await Promise.all(
    resolvedAssetPaths.map(async (resolvedAssetPath) => [
      resolvedAssetPath,
      await loadPlannerTextureWithResolvedUrlCache(
        pixi,
        resolvedAssetPath,
        placementTexturePromisesByResolvedUrl,
      ),
    ] as const),
  );

  return new Map(textureEntries);
}

function loadPlannerTextureWithResolvedUrlCache(
  pixi: PixiModule,
  resolvedTextureAssetPath: string,
  texturePromisesByResolvedUrl: Map<string, Promise<PixiTexture>>,
): Promise<PixiTexture> {
  const cachedTexturePromise = texturePromisesByResolvedUrl.get(
    resolvedTextureAssetPath,
  );

  if (cachedTexturePromise !== undefined) {
    return cachedTexturePromise;
  }

  const texturePromise = pixi.Assets.load<PixiTexture>({
    src: resolvedTextureAssetPath,
    data: {
      autoGenerateMipmaps: false,
      mipLevelCount: 1,
      scaleMode: "nearest",
    },
  });
  texturePromisesByResolvedUrl.set(
    resolvedTextureAssetPath,
    texturePromise,
  );
  return texturePromise;
}

function getRequiredPlacementTexture(
  placementTexturesByResolvedAssetPath: ReadonlyMap<string, PixiTexture>,
  resolvedAssetPath: string,
): PixiTexture {
  const placementTexture = placementTexturesByResolvedAssetPath.get(
    resolvedAssetPath,
  );

  if (placementTexture === undefined) {
    throw new Error(
      `Placement sprite texture is unavailable for resolved asset path ${JSON.stringify(resolvedAssetPath)}.`,
    );
  }

  return placementTexture;
}

function getPlacementTextureLocalPath(
  placementRenderEntry: PlacementRenderEntry,
): string {
  return placementRenderEntry.textureLocalPath
    ?? placementRenderEntry.catalogItem.textureLocalPath;
}

function assertLockedLocalPlacementTexturePath(localTexturePath: string): void {
  if (
    typeof localTexturePath !== "string"
    || !localTexturePath.startsWith(localGameAssetRoot)
    || localTexturePath.includes("..")
  ) {
    throw new Error(
      `Placement sprite texture must be a locked local asset under ${JSON.stringify(localGameAssetRoot)}; received ${JSON.stringify(localTexturePath)}.`,
    );
  }
}

async function createPaintedBuildingTexture(
  pixi: PixiModule,
  placementRenderEntry: PlacementRenderEntry,
): Promise<PixiTexture | null> {
  const buildingPaint = placementRenderEntry.buildingPaint;

  if (buildingPaint === undefined) {
    return null;
  }

  const sourceLocalPath = getPlacementTextureLocalPath(placementRenderEntry);
  assertLockedLocalPlacementTexturePath(sourceLocalPath);
  assertLockedLocalPlacementTexturePath(buildingPaint.paintMaskLocalPath);
  const [buildingImage, paintMaskImage] = await Promise.all([
    loadLocalPlannerImage(sourceLocalPath),
    loadLocalPlannerImage(buildingPaint.paintMaskLocalPath),
  ]);

  if (
    buildingImage.naturalWidth !== paintMaskImage.naturalWidth ||
    buildingImage.naturalHeight !== paintMaskImage.naturalHeight
  ) {
    throw new Error(
      `Building paint mask ${JSON.stringify(buildingPaint.paintMaskLocalPath)} dimensions ${String(paintMaskImage.naturalWidth)}x${String(paintMaskImage.naturalHeight)} do not match building texture ${JSON.stringify(sourceLocalPath)} dimensions ${String(buildingImage.naturalWidth)}x${String(buildingImage.naturalHeight)}.`,
    );
  }

  const paintedCanvas = document.createElement("canvas");
  paintedCanvas.width = buildingImage.naturalWidth;
  paintedCanvas.height = buildingImage.naturalHeight;
  const paintingContext = paintedCanvas.getContext("2d", { willReadFrequently: true });

  if (paintingContext === null) {
    throw new Error(
      `Building paint could not create a 2D canvas context for texture ${JSON.stringify(sourceLocalPath)}.`,
    );
  }

  paintingContext.drawImage(buildingImage, 0, 0);
  const buildingImageData = paintingContext.getImageData(
    0,
    0,
    paintedCanvas.width,
    paintedCanvas.height,
  );
  const paintMaskCanvas = document.createElement("canvas");
  paintMaskCanvas.width = paintMaskImage.naturalWidth;
  paintMaskCanvas.height = paintMaskImage.naturalHeight;
  const paintMaskContext = paintMaskCanvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (paintMaskContext === null) {
    throw new Error(
      `Building paint could not create a 2D canvas context for mask ${JSON.stringify(buildingPaint.paintMaskLocalPath)}.`,
    );
  }

  paintMaskContext.drawImage(paintMaskImage, 0, 0);
  const paintMaskImageData = paintMaskContext.getImageData(
    0,
    0,
    paintMaskCanvas.width,
    paintMaskCanvas.height,
  );
  buildingImageData.data.set(
    applyBuildingPaintToPixels({
      buildingPixels: buildingImageData.data,
      maskPixels: paintMaskImageData.data,
      paintColors: buildingPaint.colors,
    }),
  );
  paintingContext.putImageData(buildingImageData, 0, 0);

  return pixi.Texture.from(paintedCanvas, true);
}

function loadLocalPlannerImage(localPath: string): Promise<HTMLImageElement> {
  assertLockedLocalPlacementTexturePath(localPath);

  return new Promise((resolve, reject) => {
    const plannerImage = new Image();
    plannerImage.decoding = "async";
    plannerImage.addEventListener("load", () => resolve(plannerImage), {
      once: true,
    });
    plannerImage.addEventListener(
      "error",
      () =>
        reject(
          new Error(
            `Building paint could not load locked local image ${JSON.stringify(localPath)}.`,
          ),
        ),
      { once: true },
    );
    plannerImage.src = localPath;
  });
}

export function createPlacementSprite(
  pixi: PixiModule,
  placementRenderEntry: PlacementRenderEntry,
  placementTexture: PixiTexture,
  paintedTexture: PixiTexture | null,
  tileWidth: number,
  tileHeight: number,
  isSelected: boolean,
): PlacementSprite {
  assertPlacementRenderEntryEffectiveFootprint(placementRenderEntry);
  assertPlacementRenderEntryVisualProperties(placementRenderEntry);
  const placementTintColor = getPlacementSpriteTintColor(
    placementRenderEntry.tintColor,
    isSelected,
  );
  const placementFrameTexture = getPlacementFrameTexture(
    pixi,
    placementTexture,
    placementRenderEntry.frame,
  );
  let placementSprite: import("pixi.js").Sprite | null = null;
  let animationResources: PlacementSpriteAnimationResources | null = null;

  try {
    placementSprite = new pixi.Sprite({
      roundPixels: true,
      texture: placementFrameTexture.texture,
    });

    placementSprite.tint = placementTintColor;
    placementSprite.blendMode = isSelected ? "add" : "normal";
    placementSprite.alpha = placementRenderEntry.opacity ?? 1;
    placementSprite.zIndex = placementRenderEntry.zIndex ?? 0;
    animationResources = createPlacementSpriteAnimationResources(
      pixi,
      placementSprite,
      placementTexture,
      placementRenderEntry,
      placementFrameTexture,
    );
    const placementSpriteResult = createPlacementSpriteResult(
      placementSprite,
      placementFrameTexture.frameTexture,
      paintedTexture,
      animationResources,
      placementRenderEntry,
    );

    const { catalogItem, tileX, tileY } = placementRenderEntry;

    if (placementRenderEntry.pixelGeometry !== undefined) {
    const pixelGeometry = placementRenderEntry.pixelGeometry;
    const mirroredPositionX =
      pixelGeometry.horizontalMirrorCenterX === undefined
        ? pixelGeometry.positionX
        : 2 * pixelGeometry.horizontalMirrorCenterX
          - pixelGeometry.positionX
          - placementFrameTexture.texture.width;
    placementSprite.anchor.set(pixelGeometry.anchorX, pixelGeometry.anchorY);
    placementSprite.position.set(mirroredPositionX, pixelGeometry.positionY);
    if (pixelGeometry.uniformScale === undefined) {
      placementSprite.scale.x = pixelGeometry.horizontalScale;
    } else {
      placementSprite.scale.set(pixelGeometry.uniformScale);
      placementSprite.scale.x *= pixelGeometry.horizontalScale;
    }
      return placementSpriteResult;
    }

    if (catalogItem.category === "building") {
    placementSprite.anchor.set(0, 1);
    placementSprite.position.set(
      tileX * tileWidth,
      (tileY + catalogItem.tileSize.height) * tileHeight,
    );
      return placementSpriteResult;
    }

    if (catalogItem.category === "crop") {
    placementSprite.anchor.set(0, 1);
    placementSprite.position.set(
      tileX * tileWidth,
      (tileY + placementRenderEntry.effectiveFootprint.height) * tileHeight,
    );
      return placementSpriteResult;
    }

    if (catalogItem.renderingMetadata?.kind === "furniture") {
    if (placementRenderEntry.isFlipped) {
      placementSprite.anchor.set(0.5, 1);
      placementSprite.position.set(
        tileX * tileWidth
          + (placementRenderEntry.effectiveFootprint.width * tileWidth) / 2,
        (tileY + placementRenderEntry.effectiveFootprint.height) * tileHeight,
      );
      placementSprite.scale.x = -1;
    } else {
      placementSprite.anchor.set(0, 1);
      placementSprite.position.set(
        tileX * tileWidth,
        (tileY + placementRenderEntry.effectiveFootprint.height) * tileHeight,
      );
    }

      return placementSpriteResult;
    }

    if (
    placementRenderEntry.rotationQuarterTurns !== 0 ||
    placementRenderEntry.isFlipped
  ) {
    placementSprite.anchor.set(0.5);
    placementSprite.position.set(
      tileX * tileWidth + placementFrameTexture.texture.width / 2,
      tileY * tileHeight + placementFrameTexture.texture.height / 2,
    );
    placementSprite.rotation =
      placementRenderEntry.rotationQuarterTurns * (Math.PI / 2);
    placementSprite.scale.x = placementRenderEntry.isFlipped ? -1 : 1;
      return placementSpriteResult;
    }

    placementSprite.anchor.set(0, 0);
    placementSprite.position.set(tileX * tileWidth, tileY * tileHeight);
    return placementSpriteResult;
  } catch (caughtError) {
    placementSprite?.destroy();
    placementFrameTexture.frameTexture?.destroy();
    paintedTexture?.destroy();
    for (const animationFrameTexture of animationResources?.animationFrameTextures ?? []) {
      animationFrameTexture.destroy();
    }
    throw caughtError;
  }
}

type PlacementSpriteAnimationResources = Readonly<{
  animation: PlacementSpriteAnimation | null;
  animationFrameTextures: readonly PixiTexture[];
}>;

function createPlacementSpriteAnimationResources(
  pixi: PixiModule,
  placementSprite: import("pixi.js").Sprite,
  placementTexture: PixiTexture,
  placementRenderEntry: PlacementRenderEntry,
  placementFrameTexture: Readonly<{
    texture: PixiTexture;
    frameTexture: PixiTexture | null;
  }>,
): PlacementSpriteAnimationResources {
  const animation = placementRenderEntry.animation;

  if (animation === undefined) {
    return { animation: null, animationFrameTextures: [] };
  }

  if (animation.kind === "scale-pulse") {
    return {
      animation: {
        update(currentTimeMilliseconds): boolean {
          const nextScale = animation.baseScale
            + Math.sin(
              ((currentTimeMilliseconds + animation.phaseOffsetMilliseconds)
                % animation.timeModuloMilliseconds)
                / animation.timeDivisorMilliseconds,
            ) * animation.pulseAmplitude;
          const horizontalScale =
            placementRenderEntry.pixelGeometry?.horizontalScale ?? 1;
          const nextScaleX = nextScale * horizontalScale;
          const didChangeScale =
            placementSprite.scale.x !== nextScaleX
            || placementSprite.scale.y !== nextScale;

          if (didChangeScale) {
            placementSprite.scale.set(nextScale);
            placementSprite.scale.x *= horizontalScale;
          }

          return didChangeScale;
        },
      },
      animationFrameTextures: [],
    };
  }

  const animationTextures: PixiTexture[] = [placementFrameTexture.texture];
  const animationFrameTextures: PixiTexture[] = [];

  try {
    for (const animationFrame of animation.frames.slice(1)) {
      const animationFrameTexture = getPlacementFrameTexture(
        pixi,
        placementTexture,
        animationFrame,
      );
      animationTextures.push(animationFrameTexture.texture);
      if (animationFrameTexture.frameTexture !== null) {
        animationFrameTextures.push(animationFrameTexture.frameTexture);
      }
    }
  } catch (caughtError) {
    for (const animationFrameTexture of animationFrameTextures) {
      animationFrameTexture.destroy();
    }
    throw caughtError;
  }

  return {
    animation: {
      update(currentTimeMilliseconds): boolean {
        const rawFrameIndex = Math.floor(
          (currentTimeMilliseconds + animation.timeOffsetMilliseconds)
            / animation.frameDurationMilliseconds,
        );
        const frameIndex =
          ((rawFrameIndex % animationTextures.length) + animationTextures.length)
          % animationTextures.length;
        const nextTexture = animationTextures[frameIndex];

        if (nextTexture === undefined || placementSprite.texture === nextTexture) {
          return false;
        }

        placementSprite.texture = nextTexture;
        return true;
      },
    },
    animationFrameTextures,
  };
}

function assertPlacementRenderEntryEffectiveFootprint(
  placementRenderEntry: PlacementRenderEntry,
): void {
  const effectiveFootprint = placementRenderEntry.effectiveFootprint;
  if (
    typeof effectiveFootprint !== "object"
    || effectiveFootprint === null
    || !Number.isInteger(effectiveFootprint.width)
    || effectiveFootprint.width <= 0
    || !Number.isInteger(effectiveFootprint.height)
    || effectiveFootprint.height <= 0
  ) {
    throw new TypeError(
      `Placement render entry ${JSON.stringify(placementRenderEntry.key)} effective footprint width and height must be positive integers; received ${JSON.stringify(effectiveFootprint)}.`,
    );
  }
}

function assertPlacementRenderEntryVisualProperties(
  placementRenderEntry: PlacementRenderEntry,
): void {
  if (
    placementRenderEntry.zIndex !== undefined
    && (
      typeof placementRenderEntry.zIndex !== "number"
      || !Number.isFinite(placementRenderEntry.zIndex)
    )
  ) {
    throw new TypeError(
      `Placement render entry ${JSON.stringify(placementRenderEntry.key)} zIndex must be finite; received ${describeValue(placementRenderEntry.zIndex)}.`,
    );
  }
  if (
    placementRenderEntry.opacity !== undefined
    && (
      typeof placementRenderEntry.opacity !== "number"
      || !Number.isFinite(placementRenderEntry.opacity)
      || placementRenderEntry.opacity < 0
      || placementRenderEntry.opacity > 1
    )
  ) {
    throw new TypeError(
      `Placement render entry ${JSON.stringify(placementRenderEntry.key)} opacity must be a finite number from 0 through 1; received ${describeValue(placementRenderEntry.opacity)}.`,
    );
  }

  const uniformScale = placementRenderEntry.pixelGeometry?.uniformScale;
  if (
    uniformScale !== undefined
    && (
      typeof uniformScale !== "number"
      || !Number.isFinite(uniformScale)
      || uniformScale <= 0
    )
  ) {
    throw new TypeError(
      `Placement render entry ${JSON.stringify(placementRenderEntry.key)} uniform scale must be a positive finite number; received ${describeValue(uniformScale)}.`,
    );
  }

  const animation = placementRenderEntry.animation;
  if (animation === undefined) {
    return;
  }
  if (typeof animation !== "object" || animation === null) {
    throw new TypeError(
      `Placement render entry ${JSON.stringify(placementRenderEntry.key)} animation must be a non-null object; received ${describeValue(animation)}.`,
    );
  }

  if (animation.kind === "frame-cycle") {
    assertPositiveFiniteAnimationNumber(
      placementRenderEntry.key,
      animation.frameDurationMilliseconds,
      "frame-cycle duration",
    );
    if (!Array.isArray(animation.frames) || animation.frames.length === 0) {
      throw new TypeError(
        `Placement render entry ${JSON.stringify(placementRenderEntry.key)} frame-cycle frames must be a non-empty array; received ${describeValue(animation.frames)}.`,
      );
    }
    if (
      typeof animation.timeOffsetMilliseconds !== "number"
      || !Number.isFinite(animation.timeOffsetMilliseconds)
    ) {
      throw new TypeError(
        `Placement render entry ${JSON.stringify(placementRenderEntry.key)} frame-cycle time offset must be finite; received ${describeValue(animation.timeOffsetMilliseconds)}.`,
      );
    }

    for (let frameIndex = 0; frameIndex < animation.frames.length; frameIndex += 1) {
      assertPlacementAnimationFrame(
        placementRenderEntry.key,
        animation.frames[frameIndex],
        frameIndex,
      );
    }
    if (!arePlacementFramesEqual(placementRenderEntry.frame, animation.frames[0])) {
      throw new Error(
        `Placement render entry ${JSON.stringify(placementRenderEntry.key)} frame-cycle first frame must equal the render frame; received frame ${describeValue(placementRenderEntry.frame)} and first animation frame ${describeValue(animation.frames[0])}.`,
      );
    }
    return;
  }

  if (animation.kind === "scale-pulse") {
    assertPositiveFiniteAnimationNumber(
      placementRenderEntry.key,
      animation.baseScale,
      "scale-pulse base scale",
    );
    assertNonNegativeFiniteAnimationNumber(
      placementRenderEntry.key,
      animation.pulseAmplitude,
      "scale-pulse amplitude",
    );
    assertPositiveFiniteAnimationNumber(
      placementRenderEntry.key,
      animation.timeDivisorMilliseconds,
      "scale-pulse time divisor",
    );
    assertPositiveFiniteAnimationNumber(
      placementRenderEntry.key,
      animation.timeModuloMilliseconds,
      "scale-pulse time modulo",
    );
    if (
      typeof animation.phaseOffsetMilliseconds !== "number"
      || !Number.isFinite(animation.phaseOffsetMilliseconds)
    ) {
      throw new TypeError(
        `Placement render entry ${JSON.stringify(placementRenderEntry.key)} scale-pulse phase offset must be finite; received ${describeValue(animation.phaseOffsetMilliseconds)}.`,
      );
    }
    if (uniformScale !== animation.baseScale) {
      throw new Error(
        `Placement render entry ${JSON.stringify(placementRenderEntry.key)} scale-pulse base scale must equal pixel geometry uniform scale; received ${describeValue(animation.baseScale)} and ${describeValue(uniformScale)}.`,
      );
    }
    return;
  }

  throw new TypeError(
    `Placement render entry ${JSON.stringify(placementRenderEntry.key)} animation kind is unsupported; received ${describeValue((animation as { kind?: unknown }).kind)}.`,
  );
}

function assertPositiveFiniteAnimationNumber(
  placementKey: string,
  receivedNumber: unknown,
  fieldName: string,
): void {
  if (
    typeof receivedNumber !== "number"
    || !Number.isFinite(receivedNumber)
    || receivedNumber <= 0
  ) {
    throw new TypeError(
      `Placement render entry ${JSON.stringify(placementKey)} ${fieldName} must be a positive finite number; received ${describeValue(receivedNumber)}.`,
    );
  }
}

function assertNonNegativeFiniteAnimationNumber(
  placementKey: string,
  receivedNumber: unknown,
  fieldName: string,
): void {
  if (
    typeof receivedNumber !== "number"
    || !Number.isFinite(receivedNumber)
    || receivedNumber < 0
  ) {
    throw new TypeError(
      `Placement render entry ${JSON.stringify(placementKey)} ${fieldName} must be a non-negative finite number; received ${describeValue(receivedNumber)}.`,
    );
  }
}

function assertPlacementAnimationFrame(
  placementKey: string,
  animationFrame: unknown,
  frameIndex: number,
): void {
  const frameRecord = animationFrame as Partial<{
    height: unknown;
    width: unknown;
    x: unknown;
    y: unknown;
  }>;
  if (
    typeof animationFrame !== "object"
    || animationFrame === null
    || !Number.isInteger(frameRecord.x)
    || (frameRecord.x as number) < 0
    || !Number.isInteger(frameRecord.y)
    || (frameRecord.y as number) < 0
    || !Number.isInteger(frameRecord.width)
    || (frameRecord.width as number) <= 0
    || !Number.isInteger(frameRecord.height)
    || (frameRecord.height as number) <= 0
  ) {
    throw new TypeError(
      `Placement render entry ${JSON.stringify(placementKey)} frame-cycle frame ${String(frameIndex)} must contain non-negative integer x/y and positive integer width/height; received ${JSON.stringify(animationFrame)}.`,
    );
  }
}

function arePlacementFramesEqual(
  firstFrame: PlacementRenderEntry["frame"],
  secondFrame: PlacementRenderEntry["frame"],
): boolean {
  return firstFrame !== null
    && secondFrame !== null
    && firstFrame.x === secondFrame.x
    && firstFrame.y === secondFrame.y
    && firstFrame.width === secondFrame.width
    && firstFrame.height === secondFrame.height;
}

function getPlacementSpriteTintColor(
  tintColor: string | undefined,
  isSelected: boolean,
): number {
  return isSelected ? 0xffdf4a : getPlacementTintColor(tintColor);
}

function createPlacementSpriteResult(
  sprite: import("pixi.js").Sprite,
  frameTexture: PixiTexture | null,
  paintedTexture: PixiTexture | null,
  animationResources: PlacementSpriteAnimationResources,
  placementRenderEntry: PlacementRenderEntry,
): PlacementSprite {
  return {
    ...animationResources,
    placementKey: placementRenderEntry.key,
    sprite,
    frameTexture,
    paintedTexture,
  };
}

function getPlacementTintColor(tintColor: string | undefined): number {
  if (tintColor === undefined) {
    return 0xffffff;
  }

  if (!/^#[0-9a-f]{6}$/i.test(tintColor)) {
    throw new TypeError(
      `Placement sprite tint color must be a six-digit hexadecimal color; received ${JSON.stringify(tintColor)}.`,
    );
  }

  return Number.parseInt(tintColor.slice(1), 16);
}

function getPlacementFrameTexture(
  pixi: PixiModule,
  placementTexture: PixiTexture,
  placementFrame: PlacementRenderEntry["frame"],
): Readonly<{ texture: PixiTexture; frameTexture: PixiTexture | null }> {
  if (placementFrame === null) {
    return { texture: placementTexture, frameTexture: null };
  }

  const frameTexture = new pixi.Texture({
    frame: new pixi.Rectangle(
      placementFrame.x,
      placementFrame.y,
      placementFrame.width,
      placementFrame.height,
    ),
    source: placementTexture.source,
  });

  return { texture: frameTexture, frameTexture };
}

export function replacePlacementSprites(
  placementContainer: import("pixi.js").Container,
  currentPlacementSprites: readonly PlacementSprite[],
  nextPlacementSprites: readonly PlacementSprite[],
): void {
  placementContainer.removeChildren();
  destroyPlacementSprites(currentPlacementSprites);

  if (nextPlacementSprites.length > 0) {
    placementContainer.addChild(
      ...nextPlacementSprites.map((placementSprite) => placementSprite.sprite),
    );
  }
}

export function destroyPlacementSprites(
  placementSprites: readonly PlacementSprite[],
): void {
  for (const placementSprite of placementSprites) {
    placementSprite.sprite.destroy();
    placementSprite.frameTexture?.destroy();
    for (const animationFrameTexture of placementSprite.animationFrameTextures) {
      animationFrameTexture.destroy();
    }
    placementSprite.paintedTexture?.destroy();
  }
}

function getPlacementSpriteAnimations(
  placementSprites: readonly PlacementSprite[],
): readonly PlacementSpriteAnimation[] {
  return placementSprites.flatMap((placementSprite) =>
    placementSprite.animation === null ? [] : [placementSprite.animation]
  );
}

function getFrameTexture(
  pixi: PixiModule,
  tileTextureByFrame: Map<string, PixiTexture>,
  tilesheetTextures: ReadonlyMap<number, PixiTexture>,
  mapId: string,
  tilesetIndex: number,
  frameX: number,
  frameY: number,
  frameWidth: number,
  frameHeight: number,
): PixiTexture {
  const frameKey = `${tilesetIndex}:${frameX}:${frameY}:${frameWidth}:${frameHeight}`;
  const cachedTexture = tileTextureByFrame.get(frameKey);

  if (cachedTexture !== undefined) {
    return cachedTexture;
  }

  const tilesheetTexture = tilesheetTextures.get(tilesetIndex);

  if (tilesheetTexture === undefined) {
    throw new Error(
      `Tilesheet texture is unavailable at tileset index ${tilesetIndex} for mapId ${JSON.stringify(mapId)}. Received loaded tilesheet texture count: ${tilesheetTextures.size}.`,
    );
  }

  const frameTexture = new pixi.Texture({
    frame: new pixi.Rectangle(frameX, frameY, frameWidth, frameHeight),
    source: tilesheetTexture.source,
  });

  tileTextureByFrame.set(frameKey, frameTexture);

  return frameTexture;
}

function getCameraGeometry(
  renderingContract: MapRenderingContract,
  canvasHostElement: HTMLDivElement,
): CameraGeometry {
  const viewportBounds = canvasHostElement.getBoundingClientRect();

  return {
    mapPixelHeight: renderingContract.mapHeight * renderingContract.tileHeight,
    mapPixelWidth: renderingContract.mapWidth * renderingContract.tileWidth,
    viewportHeight: Math.max(1, Math.floor(viewportBounds.height)),
    viewportWidth: Math.max(1, Math.floor(viewportBounds.width)),
  };
}

function applyCameraState(
  pixiApplication: PixiApplication,
  mapContainer: import("pixi.js").Container,
  cameraGeometry: CameraGeometry,
  cameraState: CameraState,
): void {
  mapContainer.pivot.set(
    cameraGeometry.mapPixelWidth / 2,
    cameraGeometry.mapPixelHeight / 2,
  );
  mapContainer.position.set(cameraState.positionX, cameraState.positionY);
  mapContainer.scale.set(cameraState.zoom, cameraState.zoom);
  pixiApplication.renderer.render(pixiApplication.stage);
}

export function attachPlannerCameraControls(
  plannerCameraControlsProperties: PlannerCameraControlsProperties,
): PlannerCameraControls {
  const {
    canvasElement,
    getCameraGeometry,
    getCameraState,
    getPointerInteractionMode = () => "navigate",
    getWheelZoomEnabled = () => false,
    getMapTileAtPointer,
    getPlacementDragTarget,
    getPlacementDragTileSize,
    getPlacementSelectionKeysAtPointer,
    onMapTileHover,
    onMapTileClick,
    onMapTileRectangle,
    onMapTileRectanglePreview,
    onMapTileRectanglePreviewClear,
    onPlacementSelectionClick,
    onMoveSelectedPlacements,
    setCameraState,
  } = plannerCameraControlsProperties;
  const activePointerCoordinates = new Map<number, PointerCoordinates>();
  const placementClickSuppressedPointerIds = new Set<number>();
  let pointerDragState: PointerDragState | null = null;
  let placementDragState: PlacementDragState | null = null;
  let pinchGestureState: PinchGestureState | null = null;
  let mapTileRectanglePreviewPointerId: number | null = null;
  let lastReportedMapTileHover: MapPointerTile | null | undefined;

  canvasElement.tabIndex = 0;
  canvasElement.setAttribute("aria-label", "Interactive farm map camera");

  function handleWheel(wheelEvent: WheelEvent): void {
    if (!getWheelZoomEnabled()) {
      return;
    }

    wheelEvent.preventDefault();

    const canvasBounds = canvasElement.getBoundingClientRect();
    const cameraState = getCameraState();

    setCameraState(
      zoomCameraAtPoint(cameraState, getCameraGeometry(), {
        anchorX: wheelEvent.clientX - canvasBounds.left,
        anchorY: wheelEvent.clientY - canvasBounds.top,
        requestedZoom: getWheelRequestedZoom(
          cameraState.zoom,
          wheelEvent.deltaY,
          wheelEvent.ctrlKey,
        ),
      }),
    );
  }

  function handleKeyDown(keyboardEvent: KeyboardEvent): void {
    if (
      keyboardEvent.altKey ||
      keyboardEvent.ctrlKey ||
      keyboardEvent.metaKey
    ) {
      return;
    }

    const cameraPan = getCameraKeyboardPan(keyboardEvent.key);

    if (cameraPan !== null) {
      keyboardEvent.preventDefault();
      setCameraState(
        panCameraBy(getCameraState(), getCameraGeometry(), cameraPan),
      );
      return;
    }

    const normalizedKey = keyboardEvent.key.toLowerCase();

    if (normalizedKey !== "r" && normalizedKey !== "t") {
      return;
    }

    keyboardEvent.preventDefault();
    const cameraGeometry = getCameraGeometry();
    const cameraState = getCameraState();
    const zoomMultiplier =
      normalizedKey === "r" ? keyboardZoomMultiplier : 1 / keyboardZoomMultiplier;

    setCameraState(
      zoomCameraAtPoint(cameraState, cameraGeometry, {
        anchorX: cameraGeometry.viewportWidth / 2,
        anchorY: cameraGeometry.viewportHeight / 2,
        requestedZoom: cameraState.zoom * zoomMultiplier,
      }),
    );
  }

  function handlePointerDown(pointerEvent: PointerEvent): void {
    if (pointerEvent.button !== 0) {
      return;
    }

    pointerEvent.preventDefault();
    clearMapTileHover(pointerEvent);
    canvasElement.focus({ preventScroll: true });
    canvasElement.setPointerCapture(pointerEvent.pointerId);
    placementClickSuppressedPointerIds.delete(pointerEvent.pointerId);
    const pointerCoordinates = getPointerCoordinates(pointerEvent, canvasElement);
    const hadActivePointer = activePointerCoordinates.size > 0;
    activePointerCoordinates.set(pointerEvent.pointerId, pointerCoordinates);
    const placementDragTarget =
      !hadActivePointer && getPointerInteractionMode() === "move-selected"
        ? getPlacementDragTarget?.(pointerCoordinates) ?? null
        : null;

    if (placementDragTarget !== null) {
      const startMapTileCoordinates =
        getMapTileAtPointer?.(pointerCoordinates) ?? null;

      if (startMapTileCoordinates !== null) {
        placementDragState = createPlacementDragState(
          pointerEvent.pointerId,
          pointerCoordinates,
          startMapTileCoordinates,
          placementDragTarget,
        );
        pointerDragState = null;
        return;
      }
    }

    const startMapTileCoordinates =
      isMapRectanglePointerInteractionMode(getPointerInteractionMode())
        ? getMapTileAtPointer?.(pointerCoordinates) ?? null
        : null;
    synchronizePointerGesture(startMapTileCoordinates);

    if (
      isMultiSelectPointerInteractionMode(getPointerInteractionMode())
      && activePointerCoordinates.size === 1
      && startMapTileCoordinates !== null
    ) {
      mapTileRectanglePreviewPointerId = pointerEvent.pointerId;
      onMapTileRectanglePreview?.(
        startMapTileCoordinates,
        startMapTileCoordinates,
      );
    }
  }

  function handlePointerMove(pointerEvent: PointerEvent): void {
    if (!activePointerCoordinates.has(pointerEvent.pointerId)) {
      reportMapTileHover(pointerEvent);
      return;
    }

    pointerEvent.preventDefault();
    const pointerCoordinates = getPointerCoordinates(pointerEvent, canvasElement);
    activePointerCoordinates.set(pointerEvent.pointerId, pointerCoordinates);

    if (activePointerCoordinates.size >= 2) {
      updateCameraForPinch();
      return;
    }

    if (
      placementDragState !== null
      && placementDragState.pointerId === pointerEvent.pointerId
    ) {
      updatePlacementDrag(pointerCoordinates);
      return;
    }

    const pointerInteractionMode = getPointerInteractionMode();

    if (!isMultiSelectPointerInteractionMode(pointerInteractionMode)) {
      clearMapTileRectanglePreview();
    }

    if (isRectanglePointerInteractionMode(pointerInteractionMode)) {
      return;
    }

    if (isMultiSelectPointerInteractionMode(pointerInteractionMode)) {
      reportMapTileRectanglePreview(pointerEvent.pointerId, pointerCoordinates);
      return;
    }

    if (
      pointerDragState === null ||
      pointerDragState.pointerId !== pointerEvent.pointerId
    ) {
      return;
    }

    const movedDistance = Math.hypot(
      pointerCoordinates.x - pointerDragState.startCoordinates.x,
      pointerCoordinates.y - pointerDragState.startCoordinates.y,
    );

    if (!pointerDragState.hasExceededPanThreshold) {
      if (movedDistance <= pointerPanThreshold) {
        return;
      }

      pointerDragState = {
        ...pointerDragState,
        hasExceededPanThreshold: true,
      };
    }

    setCameraState(
      panCameraBy(getCameraState(), getCameraGeometry(), {
        deltaX: pointerCoordinates.x - pointerDragState.lastCoordinates.x,
        deltaY: pointerCoordinates.y - pointerDragState.lastCoordinates.y,
      }),
    );
    pointerDragState = {
      ...pointerDragState,
      lastCoordinates: pointerCoordinates,
    };
  }

  function handlePointerUp(pointerEvent: PointerEvent): void {
    const pointerCoordinates = getPointerCoordinates(pointerEvent, canvasElement);

    if (isMultiSelectPointerInteractionMode(getPointerInteractionMode())) {
      if (placementClickSuppressedPointerIds.has(pointerEvent.pointerId)) {
        handlePointerEnd(pointerEvent);
        return;
      }

      if (hasExceededPointerPanThreshold(pointerEvent.pointerId, pointerCoordinates)) {
        const mapTileRectangle =
          pointerEvent.button !== 0
            ? null
            : getMapTileRectangle(pointerEvent.pointerId, pointerCoordinates);

        handlePointerEnd(pointerEvent);

        if (mapTileRectangle !== null) {
          onMapTileRectangle?.(
            mapTileRectangle.startMapTileCoordinates,
            mapTileRectangle.endMapTileCoordinates,
          );
        }
        return;
      }

      const placementSelectionKeys =
        pointerEvent.button !== 0
          ? []
          : getPlacementSelectionClickKeys(
              pointerEvent.pointerId,
              pointerCoordinates,
            );

      handlePointerEnd(pointerEvent);
      if (pointerEvent.button === 0) {
        onPlacementSelectionClick?.(placementSelectionKeys);
      }
      return;
    }

    if (
      placementDragState !== null
      && placementDragState.pointerId === pointerEvent.pointerId
    ) {
      finishPlacementDrag(pointerEvent, pointerCoordinates);
      return;
    }

    if (isRectanglePointerInteractionMode(getPointerInteractionMode())) {
      const mapTileRectangle =
        pointerEvent.button !== 0
          ? null
          : getMapTileRectangle(pointerEvent.pointerId, pointerCoordinates);

      handlePointerEnd(pointerEvent);

      if (mapTileRectangle !== null) {
        onMapTileRectangle?.(
          mapTileRectangle.startMapTileCoordinates,
          mapTileRectangle.endMapTileCoordinates,
        );
      }
      return;
    }

    const mapTileCoordinates =
      pointerEvent.button !== 0
        ? null
        : getPlacementClickMapTile(pointerEvent.pointerId, pointerCoordinates);

    handlePointerEnd(pointerEvent);

    if (mapTileCoordinates !== null) {
      if (pointerEvent.pointerType === "mouse") {
        reportMapTileHoverIfChanged(mapTileCoordinates);
      }
      onMapTileClick?.(mapTileCoordinates);
    }
  }

  function getPlacementClickMapTile(
    pointerId: number,
    pointerCoordinates: PointerCoordinates,
  ): MapPointerTile | null {
    if (
      !activePointerCoordinates.has(pointerId) ||
      placementClickSuppressedPointerIds.has(pointerId) ||
      pointerDragState === null ||
      pointerDragState.pointerId !== pointerId ||
      pointerDragState.hasExceededPanThreshold ||
      hasExceededPointerPanThreshold(pointerId, pointerCoordinates)
    ) {
      return null;
    }

    return getMapTileAtPointer?.(pointerCoordinates) ?? null;
  }

  function getPlacementSelectionClickKeys(
    pointerId: number,
    pointerCoordinates: PointerCoordinates,
  ): readonly PlacementSelectionKey[] {
    if (!isShortPointerClick(pointerId, pointerCoordinates)) {
      return [];
    }

    return getPlacementSelectionKeysAtPointer?.(pointerCoordinates) ?? [];
  }

  function isShortPointerClick(
    pointerId: number,
    pointerCoordinates: PointerCoordinates,
  ): boolean {
    return (
      activePointerCoordinates.has(pointerId) &&
      !placementClickSuppressedPointerIds.has(pointerId) &&
      pointerDragState !== null &&
      pointerDragState.pointerId === pointerId &&
      !hasExceededPointerPanThreshold(pointerId, pointerCoordinates)
    );
  }

  function hasExceededPointerPanThreshold(
    pointerId: number,
    pointerCoordinates: PointerCoordinates,
  ): boolean {
    if (pointerDragState === null || pointerDragState.pointerId !== pointerId) {
      return true;
    }

    return (
      pointerDragState.hasExceededPanThreshold ||
      Math.hypot(
        pointerCoordinates.x - pointerDragState.startCoordinates.x,
        pointerCoordinates.y - pointerDragState.startCoordinates.y,
      ) > pointerPanThreshold
    );
  }

  function getMapTileRectangle(
    pointerId: number,
    pointerCoordinates: PointerCoordinates,
  ): Readonly<{
    startMapTileCoordinates: MapPointerTile;
    endMapTileCoordinates: MapPointerTile;
  }> | null {
    if (
      !activePointerCoordinates.has(pointerId) ||
      placementClickSuppressedPointerIds.has(pointerId) ||
      pointerDragState === null ||
      pointerDragState.pointerId !== pointerId ||
      pointerDragState.startMapTileCoordinates === null
    ) {
      return null;
    }

    const endMapTileCoordinates = getMapTileAtPointer?.(pointerCoordinates) ?? null;

    if (endMapTileCoordinates === null) {
      return null;
    }

    return {
      startMapTileCoordinates: pointerDragState.startMapTileCoordinates,
      endMapTileCoordinates,
    };
  }

  function reportMapTileRectanglePreview(
    pointerId: number,
    pointerCoordinates: PointerCoordinates,
  ): void {
    const mapTileRectangle = getMapTileRectangle(pointerId, pointerCoordinates);

    if (mapTileRectangle === null) {
      return;
    }

    onMapTileRectanglePreview?.(
      mapTileRectangle.startMapTileCoordinates,
      mapTileRectangle.endMapTileCoordinates,
    );
  }

  function clearMapTileRectanglePreviewForPointer(pointerId: number): void {
    if (mapTileRectanglePreviewPointerId !== pointerId) {
      return;
    }

    mapTileRectanglePreviewPointerId = null;
    onMapTileRectanglePreviewClear?.();
  }

  function clearMapTileRectanglePreview(force = false): void {
    if (mapTileRectanglePreviewPointerId === null && !force) {
      return;
    }

    mapTileRectanglePreviewPointerId = null;
    onMapTileRectanglePreviewClear?.();
  }

  function createPlacementDragState(
    pointerId: number,
    startCoordinates: PointerCoordinates,
    startMapTileCoordinates: MapPointerTile,
    placementDragTarget: PlacementDragTarget,
  ): PlacementDragState {
    if (placementDragTarget.sprites.length === 0) {
      throw new Error("Selected placement drag target must contain at least one sprite.");
    }

    const baseSpritePositions = new Map<
      import("pixi.js").Sprite,
      Readonly<{ x: number; y: number }>
    >();

    for (const placementSprite of placementDragTarget.sprites) {
      baseSpritePositions.set(placementSprite.sprite, {
        x: placementSprite.sprite.position.x,
        y: placementSprite.sprite.position.y,
      });
    }

    return {
      baseSpritePositions,
      hasExceededPlacementThreshold: false,
      lastTileDelta: { x: 0, y: 0 },
      pointerId,
      selectedPlacementSprites: placementDragTarget.sprites,
      startCoordinates,
      startMapTileCoordinates,
    };
  }

  function updatePlacementDrag(pointerCoordinates: PointerCoordinates): void {
    const currentPlacementDragState = placementDragState;

    if (currentPlacementDragState === null) {
      return;
    }

    const movedDistance = Math.hypot(
      pointerCoordinates.x - currentPlacementDragState.startCoordinates.x,
      pointerCoordinates.y - currentPlacementDragState.startCoordinates.y,
    );

    if (
      !currentPlacementDragState.hasExceededPlacementThreshold
      && movedDistance <= placementDragThreshold
    ) {
      return;
    }

    const currentMapTileCoordinates = getMapTileAtPointer?.(pointerCoordinates) ?? null;
    if (currentMapTileCoordinates === null) {
      return;
    }

    const nextTileDelta = {
      x: currentMapTileCoordinates.x - currentPlacementDragState.startMapTileCoordinates.x,
      y: currentMapTileCoordinates.y - currentPlacementDragState.startMapTileCoordinates.y,
    };
    const tileDeltaChanged =
      nextTileDelta.x !== currentPlacementDragState.lastTileDelta.x
      || nextTileDelta.y !== currentPlacementDragState.lastTileDelta.y;

    if (!tileDeltaChanged && currentPlacementDragState.hasExceededPlacementThreshold) {
      return;
    }

    placementDragState = {
      ...currentPlacementDragState,
      hasExceededPlacementThreshold: true,
      lastTileDelta: nextTileDelta,
    };
    applyPlacementDragPreview(placementDragState);
  }

  function applyPlacementDragPreview(
    currentPlacementDragState: PlacementDragState,
  ): void {
    const tileSize = getPlacementDragTileSize?.();
    if (tileSize === undefined) {
      throw new Error("Selected placement drag requires map tile dimensions.");
    }

    for (const [sprite, basePosition] of currentPlacementDragState.baseSpritePositions) {
      sprite.position.set(
        basePosition.x + currentPlacementDragState.lastTileDelta.x * tileSize.width,
        basePosition.y + currentPlacementDragState.lastTileDelta.y * tileSize.height,
      );
    }
  }

  function restorePlacementDragPreview(
    currentPlacementDragState: PlacementDragState,
  ): void {
    for (const [sprite, basePosition] of currentPlacementDragState.baseSpritePositions) {
      sprite.position.set(basePosition.x, basePosition.y);
    }
  }

  function cancelPlacementDrag(pointerId: number): void {
    if (placementDragState === null || placementDragState.pointerId !== pointerId) {
      return;
    }

    restorePlacementDragPreview(placementDragState);
    placementDragState = null;
    placementClickSuppressedPointerIds.add(pointerId);
  }

  function finishPlacementDrag(
    pointerEvent: PointerEvent,
    pointerCoordinates: PointerCoordinates,
  ): void {
    const currentPlacementDragState = placementDragState;
    if (currentPlacementDragState === null) {
      return;
    }

    const finalTileDelta = currentPlacementDragState.lastTileDelta;
    const shouldCommit =
      pointerEvent.button === 0
      && currentPlacementDragState.hasExceededPlacementThreshold
      && (finalTileDelta.x !== 0 || finalTileDelta.y !== 0);

    if (shouldCommit) {
      restorePlacementDragPreview(currentPlacementDragState);
      placementDragState = null;
      handlePointerEnd(pointerEvent);
      onMoveSelectedPlacements?.(finalTileDelta);
      return;
    }

    cancelPlacementDrag(pointerEvent.pointerId);
    handlePointerEnd(pointerEvent);
    if (pointerEvent.button === 0) {
      const mapTileCoordinates = getMapTileAtPointer?.(pointerCoordinates) ?? null;
      if (mapTileCoordinates !== null) {
        onMapTileClick?.(mapTileCoordinates);
      }
    }
  }

  function handlePointerEnd(pointerEvent: PointerEvent): void {
    if (!activePointerCoordinates.delete(pointerEvent.pointerId)) {
      return;
    }

    placementClickSuppressedPointerIds.delete(pointerEvent.pointerId);

    if (canvasElement.hasPointerCapture(pointerEvent.pointerId)) {
      canvasElement.releasePointerCapture(pointerEvent.pointerId);
    }

    clearMapTileRectanglePreviewForPointer(pointerEvent.pointerId);
    synchronizePointerGesture();
  }

  function handlePointerCancel(pointerEvent: PointerEvent): void {
    cancelPlacementDrag(pointerEvent.pointerId);
    handlePointerEnd(pointerEvent);
    clearMapTileHover(pointerEvent);
  }

  function handlePointerLeave(pointerEvent: PointerEvent): void {
    clearMapTileHover(pointerEvent);
  }

  function reportMapTileHover(pointerEvent: PointerEvent): void {
    if (pointerEvent.pointerType !== "mouse") {
      return;
    }

    const pointerCoordinates = getPointerCoordinates(pointerEvent, canvasElement);
    reportMapTileHoverIfChanged(
      getMapTileAtPointer?.(pointerCoordinates) ?? null,
    );
  }

  function clearMapTileHover(pointerEvent: PointerEvent): void {
    if (pointerEvent.pointerType === "mouse") {
      reportMapTileHoverIfChanged(null);
    }
  }

  function reportMapTileHoverIfChanged(
    mapTileCoordinates: MapPointerTile | null,
  ): void {
    if (
      lastReportedMapTileHover !== undefined
      && (
        lastReportedMapTileHover === null
          ? mapTileCoordinates === null
          : mapTileCoordinates !== null
            && lastReportedMapTileHover.x === mapTileCoordinates.x
            && lastReportedMapTileHover.y === mapTileCoordinates.y
      )
    ) {
      return;
    }
    lastReportedMapTileHover = mapTileCoordinates;
    onMapTileHover?.(mapTileCoordinates);
  }

  function synchronizePointerGesture(
    startMapTileCoordinates: MapPointerTile | null = null,
  ): void {
    if (activePointerCoordinates.size >= 2) {
      if (placementDragState !== null) {
        cancelPlacementDrag(placementDragState.pointerId);
      }

      for (const pointerId of activePointerCoordinates.keys()) {
        placementClickSuppressedPointerIds.add(pointerId);
      }

      clearMapTileRectanglePreview();
      pointerDragState = null;
      pinchGestureState = createPinchGestureState(
        activePointerCoordinates,
        getCameraState(),
      );
      return;
    }

    pinchGestureState = null;
    const remainingPointer = activePointerCoordinates.entries().next().value;

    if (remainingPointer === undefined) {
      pointerDragState = null;
      return;
    }

    const [pointerId, pointerCoordinates] = remainingPointer;
    pointerDragState = {
      hasExceededPanThreshold: false,
      lastCoordinates: pointerCoordinates,
      pointerId,
      startCoordinates: pointerCoordinates,
      startMapTileCoordinates,
    };
  }

  function updateCameraForPinch(): void {
    if (pinchGestureState === null) {
      return;
    }

    const pinchCoordinates = getPinchCoordinates(activePointerCoordinates);

    if (pinchCoordinates === null || pinchCoordinates.distance === 0) {
      return;
    }

    const zoomedCameraState = zoomCameraAtPoint(
      pinchGestureState.initialCameraState,
      getCameraGeometry(),
      {
        anchorX: pinchGestureState.initialCenterCoordinates.x,
        anchorY: pinchGestureState.initialCenterCoordinates.y,
        requestedZoom:
          pinchGestureState.initialCameraState.zoom *
          (pinchCoordinates.distance / pinchGestureState.initialDistance),
      },
    );

    setCameraState(
      panCameraBy(zoomedCameraState, getCameraGeometry(), {
        deltaX:
          pinchCoordinates.centerCoordinates.x -
          pinchGestureState.initialCenterCoordinates.x,
        deltaY:
          pinchCoordinates.centerCoordinates.y -
          pinchGestureState.initialCenterCoordinates.y,
      }),
    );
  }

  canvasElement.addEventListener("keydown", handleKeyDown);
  canvasElement.addEventListener("pointercancel", handlePointerCancel);
  canvasElement.addEventListener("pointerdown", handlePointerDown);
  canvasElement.addEventListener("pointerleave", handlePointerLeave);
  canvasElement.addEventListener("pointermove", handlePointerMove);
  canvasElement.addEventListener("pointerup", handlePointerUp);
  canvasElement.addEventListener("lostpointercapture", handlePointerCancel);
  canvasElement.addEventListener("wheel", handleWheel, { passive: false });

  return {
    synchronizePointerInteractionMode(): void {
      if (!isMultiSelectPointerInteractionMode(getPointerInteractionMode())) {
        clearMapTileRectanglePreview();
      }
    },
    dispose(): void {
      canvasElement.removeEventListener("keydown", handleKeyDown);
      canvasElement.removeEventListener("pointercancel", handlePointerCancel);
      canvasElement.removeEventListener("pointerdown", handlePointerDown);
      canvasElement.removeEventListener("pointerleave", handlePointerLeave);
      canvasElement.removeEventListener("pointermove", handlePointerMove);
      canvasElement.removeEventListener("pointerup", handlePointerUp);
      canvasElement.removeEventListener("lostpointercapture", handlePointerCancel);
      canvasElement.removeEventListener("wheel", handleWheel);
      activePointerCoordinates.clear();
      placementClickSuppressedPointerIds.clear();
      pinchGestureState = null;
      pointerDragState = null;
      if (placementDragState !== null) {
        restorePlacementDragPreview(placementDragState);
      }
      clearMapTileRectanglePreview(true);
      reportMapTileHoverIfChanged(null);
      placementDragState = null;
    },
  };
}

function isRectanglePointerInteractionMode(
  pointerInteractionMode: PointerInteractionMode,
): boolean {
  return pointerInteractionMode === "rectangle";
}

function isMapRectanglePointerInteractionMode(
  pointerInteractionMode: PointerInteractionMode,
): boolean {
  return (
    isRectanglePointerInteractionMode(pointerInteractionMode) ||
    isMultiSelectPointerInteractionMode(pointerInteractionMode)
  );
}

function isMultiSelectPointerInteractionMode(
  pointerInteractionMode: PointerInteractionMode,
): boolean {
  return pointerInteractionMode === "multi-select";
}

export function findRenderedPlacementSelectionKeysAtPointer(
  renderedPlacementSprites: readonly PlacementSprite[],
  pointerCoordinates: PointerCoordinates,
): readonly PlacementSelectionKey[] {
  const hitPlacementKeys = new Set<PlacementSelectionKey>();
  const visuallyOrderedPlacementSprites = renderedPlacementSprites
    .map((placementSprite, sourceIndex) => ({
      placementSprite,
      sourceIndex,
    }))
    .sort((firstPlacementSprite, secondPlacementSprite) => {
      const zIndexDifference =
        secondPlacementSprite.placementSprite.sprite.zIndex -
        firstPlacementSprite.placementSprite.sprite.zIndex;

      return zIndexDifference !== 0
        ? zIndexDifference
        : secondPlacementSprite.sourceIndex - firstPlacementSprite.sourceIndex;
    });

  for (const { placementSprite } of visuallyOrderedPlacementSprites) {
    if (
      placementSprite.sprite.getBounds().containsPoint(
        pointerCoordinates.x,
        pointerCoordinates.y,
      )
    ) {
      hitPlacementKeys.add(placementSprite.placementKey);
    }
  }

  return [...hitPlacementKeys];
}

function getPointerCoordinates(
  pointerEvent: PointerEvent,
  canvasElement: HTMLCanvasElement,
): PointerCoordinates {
  const canvasBounds = canvasElement.getBoundingClientRect();

  return {
    x: pointerEvent.clientX - canvasBounds.left,
    y: pointerEvent.clientY - canvasBounds.top,
  };
}

function createPinchGestureState(
  activePointerCoordinates: ReadonlyMap<number, PointerCoordinates>,
  initialCameraState: CameraState,
): PinchGestureState | null {
  const pinchCoordinates = getPinchCoordinates(activePointerCoordinates);

  if (pinchCoordinates === null || pinchCoordinates.distance === 0) {
    return null;
  }

  return {
    initialCameraState,
    initialCenterCoordinates: pinchCoordinates.centerCoordinates,
    initialDistance: pinchCoordinates.distance,
  };
}

function getPinchCoordinates(
  activePointerCoordinates: ReadonlyMap<number, PointerCoordinates>,
): Readonly<{
  centerCoordinates: PointerCoordinates;
  distance: number;
}> | null {
  const pointerCoordinates = [...activePointerCoordinates.values()];
  const firstPointerCoordinates = pointerCoordinates[0];
  const secondPointerCoordinates = pointerCoordinates[1];

  if (
    firstPointerCoordinates === undefined ||
    secondPointerCoordinates === undefined
  ) {
    return null;
  }

  return {
    centerCoordinates: {
      x: (firstPointerCoordinates.x + secondPointerCoordinates.x) / 2,
      y: (firstPointerCoordinates.y + secondPointerCoordinates.y) / 2,
    },
    distance: Math.hypot(
      secondPointerCoordinates.x - firstPointerCoordinates.x,
      secondPointerCoordinates.y - firstPointerCoordinates.y,
    ),
  };
}

function destroyPixiApplication(pixiApplication: PixiApplication): void {
  pixiApplication.destroy(
    { removeView: true },
    {
      children: true,
    },
  );
}

function formatPlannerCanvasError(mapId: string, caughtError: unknown): string {
  const errorMessage =
    caughtError instanceof Error ? caughtError.message : String(caughtError);

  return `Unable to render mapId ${JSON.stringify(mapId)}. ${errorMessage}`;
}
