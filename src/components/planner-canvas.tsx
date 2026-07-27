"use client";

import { useEffect, useRef, useState } from "react";
import type { CatalogItem } from "../catalog";
import {
  PlannerJoystick,
  type PlannerJoystickDirection,
} from "./planner-joystick";
import {
  createInitialEditorDisplayOptions,
  type EditorDisplayOptions,
} from "../editor/editor-display-options";
import {
  farmhouse2Composite,
  getPlannerMapById,
  gingerIslandOverlays,
  spouseRoomLayouts,
} from "../maps/map-catalog";
import {
  composeMapTileOverlays,
  type MapTileCompositionOptions,
} from "../maps/map-tile-composition";
import {
  createInitialMapRenderOptions,
  type MapRenderOptions,
} from "../maps/map-render-options";
import {
  createMapPlacementGrid,
  type MapPlacementGrid,
} from "../placement/map-placement-grids";
import {
  getMapTileAtPointer,
  type MapPointerTile,
} from "../placement/map-pointer-tile";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
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
import {
  createPlacementRenderEntries,
  type PlacementRenderEntry,
} from "../rendering/placement-rendering";
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
import { parseTmxMap } from "../tmx/parse-tmx-map";
import type { TmxMap } from "../tmx/tmx-types";

const localGameAssetRoot = "/game-assets/1.6.15/";
const defaultMapRenderOptions = createInitialMapRenderOptions();

type PointerInteractionMode = "navigate" | "rectangle" | "move-selected";

export type PlannerCanvasProperties = Readonly<{
  catalogItems?: readonly CatalogItem[];
  displayOptions?: EditorDisplayOptions;
  isXRayActive?: boolean;
  leftHandMode?: boolean;
  mapId: string;
  mapRenderOptions?: MapRenderOptions;
  pointerInteractionMode?: PointerInteractionMode;
  placementSnapshot?: PlacementSnapshot;
  selectedPlacementKeys?: readonly string[];
  season: TilesheetSeason;
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
  onMapTileClick?: (mapId: string, mapTileCoordinates: MapPointerTile) => void;
  onMapTileRectangle?: (
    mapId: string,
    startMapTileCoordinates: MapPointerTile,
    endMapTileCoordinates: MapPointerTile,
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
  getPointerInteractionMode?: () => PointerInteractionMode;
  getMapTileAtPointer?: (
    pointerCoordinates: PointerCoordinates,
  ) => MapPointerTile | null;
  onMapTileClick?: (mapTileCoordinates: MapPointerTile) => void;
  onMapTileRectangle?: (
    startMapTileCoordinates: MapPointerTile,
    endMapTileCoordinates: MapPointerTile,
  ) => void;
  setCameraState: (cameraState: CameraState) => void;
}>;

type PlannerCameraControls = Readonly<{
  dispose(): void;
}>;

type PlacementOverlayRenderer = () => void;
type MapDisplayOverlayRenderer = () => void;
type XRayRenderer = () => void;

type PlacementSprite = Readonly<{
  sprite: import("pixi.js").Sprite;
  frameTexture: PixiTexture | null;
  paintedTexture: PixiTexture | null;
}>;

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

type PinchGestureState = Readonly<{
  initialCameraState: CameraState;
  initialCenterCoordinates: PointerCoordinates;
  initialDistance: number;
}>;

const pointerPanThreshold = 3;
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

export function PlannerCanvas({
  catalogItems,
  displayOptions = createInitialEditorDisplayOptions(),
  isXRayActive = false,
  leftHandMode = false,
  mapId,
  mapRenderOptions,
  pointerInteractionMode = "navigate",
  placementSnapshot,
  selectedPlacementKeys = [],
  season,
  showJoystick = false,
  showResourceClumpSpawnLocations = false,
  activeInteriorDecorPattern = null,
  onMapPlacementGridReady,
  onMapImageExporterReady,
  onInteriorDecorApply,
  onInteriorDecorRejected,
  onNudgeSelectedPlacements,
  onMapTileClick,
  onMapTileRectangle,
}: PlannerCanvasProperties) {
  const effectiveMapRenderOptions = mapRenderOptions ?? defaultMapRenderOptions;
  const canvasHostElementReference = useRef<HTMLDivElement>(null);
  const onMapPlacementGridReadyReference = useRef(onMapPlacementGridReady);
  const onMapImageExporterReadyReference = useRef(onMapImageExporterReady);
  const onMapTileClickReference = useRef(onMapTileClick);
  const onMapTileRectangleReference = useRef(onMapTileRectangle);
  const activeInteriorDecorPatternReference = useRef(activeInteriorDecorPattern);
  const onInteriorDecorApplyReference = useRef(onInteriorDecorApply);
  const onInteriorDecorRejectedReference = useRef(onInteriorDecorRejected);
  const pointerInteractionModeReference = useRef(pointerInteractionMode);
  const catalogItemsReference = useRef(catalogItems);
  const placementOverlayRendererReference = useRef<PlacementOverlayRenderer | null>(
    null,
  );
  const xRayRendererReference = useRef<XRayRenderer | null>(null);
  const mapDisplayOverlayRendererReference =
    useRef<MapDisplayOverlayRenderer | null>(null);
  const placementSnapshotReference = useRef(placementSnapshot);
  const selectedPlacementKeysReference = useRef(selectedPlacementKeys);
  const displayOptionsReference = useRef(displayOptions);
  const isXRayActiveReference = useRef(isXRayActive);
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
  const interiorDecorStateRevision = getInteriorDecorStateRevision(
    placementSnapshot?.interiorDecor,
  );

  onMapPlacementGridReadyReference.current = onMapPlacementGridReady;
  onMapImageExporterReadyReference.current = onMapImageExporterReady;
  onMapTileClickReference.current = onMapTileClick;
  onMapTileRectangleReference.current = onMapTileRectangle;
  activeInteriorDecorPatternReference.current = activeInteriorDecorPattern;
  onInteriorDecorApplyReference.current = onInteriorDecorApply;
  onInteriorDecorRejectedReference.current = onInteriorDecorRejected;
  pointerInteractionModeReference.current = pointerInteractionMode;
  catalogItemsReference.current = catalogItems;
  placementSnapshotReference.current = placementSnapshot;
  selectedPlacementKeysReference.current = selectedPlacementKeys;
  displayOptionsReference.current = displayOptions;
  isXRayActiveReference.current = isXRayActive;
  showResourceClumpSpawnLocationsReference.current =
    showResourceClumpSpawnLocations;

  useEffect(() => {
    placementOverlayRendererReference.current?.();
  }, [catalogItems, placementSnapshot, selectedPlacementKeys]);

  useEffect(() => {
    xRayRendererReference.current?.();
  }, [isXRayActive]);

  useEffect(() => {
    mapDisplayOverlayRendererReference.current?.();
  }, [displayOptions, placementSnapshot, showResourceClumpSpawnLocations]);

  useEffect(() => {
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
    let viewportResizeObserver: ResizeObserver | null = null;
    let handleWindowResize: (() => void) | null = null;
    let plannerCameraControls: PlannerCameraControls | null = null;
    let disposeMapDisplayOverlay: (() => void) | null = null;
    let disposePlacementOverlay: (() => void) | null = null;
    let joystickCameraPan: ((direction: PlannerJoystickDirection) => void) | null =
      null;
    let resourceClumpFrameTexturesByParentSheetIndex: ReadonlyMap<
      number,
      PixiTexture
    > | null = null;

    setPlannerCanvasStatus({ kind: "loading" });
    setKnownUnavailableTilesheetWarnings([]);

    async function initializePlannerCanvas(): Promise<void> {
      try {
        const mapAssetPath = getLocalMapAssetPath(
          mapId,
          effectiveMapRenderOptions,
        );
        const mapXml = await loadMapXml(mapId, mapAssetPath);

        if (pixiApplicationLifetime.isDestructionRequested()) {
          return;
        }

        const loadedMap = await loadPlannerMap(
          mapId,
          mapXml,
          effectiveMapRenderOptions,
        );
        const parsedMap = applyPlacementSnapshotInteriorDecor(
          loadedMap,
          placementSnapshot?.interiorDecor,
        );
        const mapFile = getPlannerMapById(mapId).mapFile;
        const mapPlacementGrid = createMapPlacementGrid(parsedMap);

        notifyMapPlacementGridReady({
          isMapLifecycleCurrent: () =>
            !pixiApplicationLifetime.isDestructionRequested(),
          mapId,
          onMapPlacementGridReady: onMapPlacementGridReadyReference.current,
          parsedMap,
        });

        if (pixiApplicationLifetime.isDestructionRequested()) {
          return;
        }

        const renderingContract = createMapRenderingContract({
          mapId,
          parsedMap,
          requestedSeason: season,
        });
        const pixi = await import("pixi.js");

        if (pixiApplicationLifetime.isDestructionRequested()) {
          return;
        }

        const pixiApplication = new pixi.Application();
        pixiApplicationLifetime.setApplication(pixiApplication);

        try {
          await pixiApplication.init({
            antialias: false,
            autoDensity: true,
            autoStart: false,
            backgroundColor: 0x111827,
            height: 1,
            resolution: window.devicePixelRatio || 1,
            width: 1,
          });
          pixiApplication.ticker.stop();
        } finally {
          pixiApplicationLifetime.finishInitialization();
        }

        if (pixiApplicationLifetime.isDestructionRequested()) {
          return;
        }

        mountedCanvasHostElement.replaceChildren(pixiApplication.canvas);

        const [tilesheetTextures, resourceClumpTilesheetTexture] = await Promise.all([
          loadTilesheetTextures(pixi, renderingContract),
          loadResourceClumpTilesheetTexture(pixi),
        ]);

        if (pixiApplicationLifetime.isDestructionRequested()) {
          return;
        }

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
        mapContainerCreationResult.mapContainer.addChild(placementContainer);
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
        const placementTexturePromisesByLocalPath = new Map<
          string,
          Promise<PixiTexture>
        >();
        let placementRenderVersion = 0;
        let renderedPlacementSprites: readonly PlacementSprite[] = [];

        const renderXRay = (): void => {
          placementContainer.alpha = getPlacementContainerAlpha(
            isXRayActiveReference.current,
          );
          pixiApplication.renderer.render(pixiApplication.stage);
        };

        xRayRendererReference.current = renderXRay;
        renderXRay();

        const renderPlacementOverlay = (): void => {
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
            pixiApplication.renderer.render(pixiApplication.stage);
            return;
          }

          void createPlacementSprites({
            pixi,
            catalogItems: currentCatalogItems,
            placementSnapshot: currentPlacementSnapshot,
            season,
            selectedPlacementKeys: currentSelectedPlacementKeys,
            tileWidth: renderingContract.tileWidth,
            tileHeight: renderingContract.tileHeight,
            placementTexturePromisesByLocalPath,
          }).then(
            (placementSprites) => {
              if (
                pixiApplicationLifetime.isDestructionRequested() ||
                requestedPlacementRenderVersion !== placementRenderVersion
              ) {
                destroyPlacementSprites(placementSprites);
                return;
              }

              replacePlacementSprites(
                placementContainer,
                renderedPlacementSprites,
                placementSprites,
              );
              renderedPlacementSprites = placementSprites;
              pixiApplication.renderer.render(pixiApplication.stage);
              setPlannerCanvasStatus({ kind: "ready" });
            },
            (caughtError: unknown) => {
              if (
                pixiApplicationLifetime.isDestructionRequested() ||
                requestedPlacementRenderVersion !== placementRenderVersion
              ) {
                return;
              }

              setPlannerCanvasStatus({
                kind: "error",
                message: formatPlannerCanvasError(mapId, caughtError),
              });
            },
          );
        };

        placementOverlayRendererReference.current = renderPlacementOverlay;
        disposePlacementOverlay = (): void => {
          placementRenderVersion += 1;
          destroyPlacementSprites(renderedPlacementSprites);
          renderedPlacementSprites = [];
          placementContainer.removeChildren();

          if (
            placementOverlayRendererReference.current === renderPlacementOverlay
          ) {
            placementOverlayRendererReference.current = null;
          }

          if (xRayRendererReference.current === renderXRay) {
            xRayRendererReference.current = null;
          }
        };
        renderPlacementOverlay();

        let currentCameraGeometry: CameraGeometry | null = null;
        let currentCameraState: CameraState | null = null;

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

        const resizeMapToViewport = () => {
          if (pixiApplicationLifetime.isDestructionRequested()) {
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
          currentCameraState =
            currentCameraState === null
              ? createInitialCameraState(currentCameraGeometry)
              : clampCameraPosition(currentCameraState, currentCameraGeometry);
          renderCameraState(currentCameraState);
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

          if (currentCameraGeometry === null || currentCameraState === null) {
            throw new Error(
              `Planner joystick is unavailable while mapId ${JSON.stringify(mapId)} is loading.`,
            );
          }

          currentCameraState = panCameraBy(
            currentCameraState,
            currentCameraGeometry,
            cameraPan,
          );
          renderCameraState(currentCameraState);
        };
        joystickCameraPanReference.current = joystickCameraPan;
        plannerCameraControls = attachPlannerCameraControls({
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
            if (currentCameraState === null) {
              throw new Error(
                `Planner camera state is unavailable for mapId ${JSON.stringify(mapId)}.`,
              );
            }

            return currentCameraState;
          },
          getPointerInteractionMode(): PointerInteractionMode {
            return pointerInteractionModeReference.current;
          },
          getMapTileAtPointer(pointerCoordinates: PointerCoordinates): MapPointerTile | null {
            const cameraState = currentCameraState;

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
          onMapTileClick(mapTileCoordinates: MapPointerTile): void {
            if (pixiApplicationLifetime.isDestructionRequested()) {
              return;
            }

            const wasInteriorDecorClickHandled =
              dispatchInteriorDecorMapTileClick({
                activeInteriorDecorPattern:
                  activeInteriorDecorPatternReference.current,
                mapId,
                mapTileCoordinates,
                onInteriorDecorApply: onInteriorDecorApplyReference.current,
                onInteriorDecorRejected:
                  onInteriorDecorRejectedReference.current,
                parsedMap,
              });

            if (wasInteriorDecorClickHandled) {
              return;
            }

            onMapTileClickReference.current?.(mapId, mapTileCoordinates);
          },
          onMapTileRectangle(
            startMapTileCoordinates: MapPointerTile,
            endMapTileCoordinates: MapPointerTile,
          ): void {
            if (pixiApplicationLifetime.isDestructionRequested()) {
              return;
            }

            onMapTileRectangleReference.current?.(
              mapId,
              startMapTileCoordinates,
              endMapTileCoordinates,
            );
          },
          setCameraState(cameraState: CameraState): void {
            currentCameraState = cameraState;
            renderCameraState(cameraState);
          },
        });
        viewportResizeObserver = new ResizeObserver(resizeMapToViewport);
        viewportResizeObserver.observe(mountedCanvasHostElement);
        handleWindowResize = resizeMapToViewport;
        window.addEventListener("resize", handleWindowResize);

        onMapImageExporterReadyReference.current?.(mapId, {
          captureScreenshot: (resolution) =>
            captureMapScreenshot({
              mapContainer: mapContainerCreationResult.mapContainer,
              mapDisplayOverlayContainer,
              pixi,
              pixiApplication,
              renderingContract,
              resolution,
            }),
        });

        setKnownUnavailableTilesheetWarnings(
          mapContainerCreationResult.knownUnavailableTilesheetWarnings,
        );
        setPlannerCanvasStatus({ kind: "ready" });
      } catch (caughtError) {
        const wasUnmountedBeforeFailure =
          pixiApplicationLifetime.isDestructionRequested();

        plannerCameraControls?.dispose();
        plannerCameraControls = null;
        destroyResourceClumpFrameTextures(
          resourceClumpFrameTexturesByParentSheetIndex,
        );
        resourceClumpFrameTexturesByParentSheetIndex = null;
        pixiApplicationLifetime.requestDestruction();

        if (!wasUnmountedBeforeFailure) {
          setPlannerCanvasStatus({
            kind: "error",
            message: formatPlannerCanvasError(mapId, caughtError),
          });
        }
      }
    }

    void initializePlannerCanvas();

    return () => {
      viewportResizeObserver?.disconnect();

      if (handleWindowResize !== null) {
        window.removeEventListener("resize", handleWindowResize);
      }

      plannerCameraControls?.dispose();
      disposeMapDisplayOverlay?.();
      disposePlacementOverlay?.();
      if (joystickCameraPanReference.current === joystickCameraPan) {
        joystickCameraPanReference.current = null;
      }
      onMapImageExporterReadyReference.current?.(mapId, null);
      destroyResourceClumpFrameTextures(
        resourceClumpFrameTexturesByParentSheetIndex,
      );
      resourceClumpFrameTexturesByParentSheetIndex = null;
      pixiApplicationLifetime.requestDestruction();

      mountedCanvasHostElement.replaceChildren();
    };
  }, [
    effectiveMapRenderOptions,
    interiorDecorStateRevision,
    mapId,
    season,
  ]);

  return (
    <section
      aria-busy={plannerCanvasStatus.kind === "loading"}
      aria-label={`Farm map canvas for ${mapId}`}
      className="planner-canvas"
    >
      <div className="planner-canvas__viewport" ref={canvasHostElementReference} />
      {showJoystick && plannerCanvasStatus.kind === "ready" ? (
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
  pixi: PixiModule;
  pixiApplication: PixiApplication;
  renderingContract: MapRenderingContract;
  resolution: ScreenshotResolution;
}>;

async function captureMapScreenshot(
  captureMapScreenshotInput: CaptureMapScreenshotInput,
): Promise<Blob> {
  const {
    mapContainer,
    mapDisplayOverlayContainer,
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
  const originalMapPosition = {
    x: mapContainer.position.x,
    y: mapContainer.position.y,
  };
  const originalMapScale = {
    x: mapContainer.scale.x,
    y: mapContainer.scale.y,
  };
  const wasMapDisplayOverlayVisible = mapDisplayOverlayContainer.visible;
  let screenshotRenderTexture: import("pixi.js").RenderTexture | null = null;

  try {
    mapDisplayOverlayContainer.visible = false;
    mapContainer.position.set(0, 0);
    mapContainer.scale.set(resolution);
    screenshotRenderTexture = pixi.RenderTexture.create({
      height: screenshotDimensions.height,
      resolution: 1,
      width: screenshotDimensions.width,
    });
    pixiApplication.renderer.render({
      container: mapContainer,
      target: screenshotRenderTexture,
    });
    const extractedCanvas = pixiApplication.renderer.extract.canvas(
      screenshotRenderTexture,
    );
    const mapScreenshotCanvas = assertHtmlCanvasElement(extractedCanvas);
    const watermarkedScreenshotCanvas = createWatermarkedScreenshotCanvas(
      mapScreenshotCanvas,
    );

    return createPngBlob(watermarkedScreenshotCanvas);
  } finally {
    mapContainer.scale.set(originalMapScale.x, originalMapScale.y);
    mapContainer.position.set(originalMapPosition.x, originalMapPosition.y);
    mapDisplayOverlayContainer.visible = wasMapDisplayOverlayVisible;
    screenshotRenderTexture?.destroy(true);
    pixiApplication.renderer.render(pixiApplication.stage);
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

function getLocalMapAssetPath(
  mapId: string,
  mapRenderOptions: MapRenderOptions,
): string {
  const plannerMap = getPlannerMapById(mapId);
  const mapFile = mapId === "farmhouse-2" && mapRenderOptions.farmhouse2.marriageMapEnabled
    ? farmhouse2Composite.marriageMapFile
    : plannerMap.mapFile;
  const mapOutputPath = plannerMap.modId
    ? `mods/${plannerMap.modId}/${mapFile}`
    : `maps/${mapFile}`;

  return `${localGameAssetRoot}${mapOutputPath}`;
}

async function loadMapXml(mapId: string, mapAssetPath: string): Promise<string> {
  const mapResponse = await fetch(mapAssetPath);

  if (!mapResponse.ok) {
    throw new Error(
      `Could not load local TMX asset ${JSON.stringify(mapAssetPath)} for mapId ${JSON.stringify(mapId)}. Received HTTP status ${mapResponse.status}.`,
    );
  }

  const mapXml = await mapResponse.text();

  if (mapXml.length === 0) {
    throw new Error(
      `Local TMX asset ${JSON.stringify(mapAssetPath)} for mapId ${JSON.stringify(mapId)} is empty.`,
    );
  }

  return mapXml;
}

async function loadPlannerMap(
  mapId: string,
  mapXml: string,
  mapRenderOptions: MapRenderOptions,
): Promise<TmxMap> {
  const parsedMap = await parseTmxMap(mapXml);

  if (mapId === "ginger-island") {
    const gingerIslandMapTileOverlays = await Promise.all(
      gingerIslandOverlays
        .filter((gingerIslandOverlay) =>
          mapRenderOptions.gingerIslandOverlayIds.includes(
            gingerIslandOverlay.id,
          ),
        )
        .map(async (gingerIslandOverlay) => ({
          id: gingerIslandOverlay.id,
          map: await loadMapTileOverlay(
            mapId,
            gingerIslandOverlay.id,
            gingerIslandOverlay.mapFile,
          ),
          sourceCrop: gingerIslandOverlay.sourceCrop,
          target: gingerIslandOverlay.target,
        })),
    );

    return composeMapTileOverlays(parsedMap, gingerIslandMapTileOverlays);
  }

  if (mapId !== "farmhouse-2") {
    return parsedMap;
  }

  const farmhouse2MapTileOverlays = await Promise.all(
    getFarmhouse2MapTileOverlays(mapRenderOptions).map(
      async (farmhouse2MapTileOverlay) => ({
        ...farmhouse2MapTileOverlay,
        map: await loadMapTileOverlay(
          mapId,
          farmhouse2MapTileOverlay.id,
          farmhouse2MapTileOverlay.mapFile,
        ),
      }),
    ),
  );

  return composeMapTileOverlays(
    parsedMap,
    farmhouse2MapTileOverlays,
    getMapTileCompositionOptions(mapId),
  );
}

export function getMapTileCompositionOptions(
  mapId: string,
): MapTileCompositionOptions | undefined {
  return mapId === "farmhouse-2"
    ? { includeTileDataProperties: true }
    : undefined;
}

function getFarmhouse2MapTileOverlays(
  mapRenderOptions: MapRenderOptions,
): readonly Readonly<{
  id: string;
  mapFile: string;
  sourceCrop: Readonly<{ x: number; y: number; width: number; height: number }>;
  target: Readonly<{ x: number; y: number }>;
}>[] {
  const selectedRenovationIdSet = new Set(
    mapRenderOptions.farmhouse2.renovationIds,
  );
  const selectedRenovationOverlays = farmhouse2Composite.renovations.flatMap(
    (farmhouseRenovation) =>
      selectedRenovationIdSet.has(farmhouseRenovation.id)
        ? [{ ...farmhouseRenovation }]
        : [],
  );
  const selectedSpouseRoom = mapRenderOptions.farmhouse2.spouseId === null
    ? null
    : spouseRoomLayouts.find(
      (spouseRoomLayout) =>
        spouseRoomLayout.spouseId === mapRenderOptions.farmhouse2.spouseId,
    );

  if (selectedSpouseRoom === undefined) {
    throw new Error(
      `Farmhouse 2 spouse room ${JSON.stringify(mapRenderOptions.farmhouse2.spouseId)} is unavailable in the locked map catalog.`,
    );
  }

  return [
    ...selectedRenovationOverlays,
    ...(selectedSpouseRoom === null
      ? []
      : [
        {
          id: `spouse-${selectedSpouseRoom.spouseId}`,
          mapFile: farmhouse2Composite.spouseRoomMapFile,
          sourceCrop: selectedSpouseRoom.sourceCrop,
          target: selectedSpouseRoom.target,
        },
      ]),
  ];
}

async function loadMapTileOverlay(
  mapId: string,
  overlayId: string,
  mapFile: string,
): Promise<TmxMap> {
  if (typeof mapFile !== "string" || !/^[A-Za-z0-9_ -]+\.tmx$/.test(mapFile)) {
    throw new Error(
      `Map tile overlay ${JSON.stringify(overlayId)} for mapId ${JSON.stringify(mapId)} must use a safe .tmx filename; received ${JSON.stringify(mapFile)}.`,
    );
  }

  const overlayMapXml = await loadMapXml(
    `${mapId}:${overlayId}`,
    `${localGameAssetRoot}maps/${mapFile}`,
  );

  return parseTmxMap(overlayMapXml);
}

async function loadTilesheetTextures(
  pixi: PixiModule,
  renderingContract: MapRenderingContract,
): Promise<ReadonlyMap<number, PixiTexture>> {
  const textureEntries = await Promise.all(
    getLoadableTilesheets(renderingContract.tilesets).map(
      async ({ assetPath, tilesetIndex }) => {
        const tilesheetTexture = await pixi.Assets.load<PixiTexture>({
          src: assetPath,
          data: {
            autoGenerateMipmaps: false,
            mipLevelCount: 1,
            scaleMode: "nearest",
          },
        });

        return [tilesetIndex, tilesheetTexture] as const;
      },
    ),
  );

  return new Map(textureEntries);
}

async function loadResourceClumpTilesheetTexture(
  pixi: PixiModule,
): Promise<PixiTexture> {
  return pixi.Assets.load<PixiTexture>({
    src: `${localGameAssetRoot}sprites/springobjects.png`,
    data: {
      autoGenerateMipmaps: false,
      mipLevelCount: 1,
      scaleMode: "nearest",
    },
  });
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

type CreatePlacementSpritesInput = Readonly<{
  pixi: PixiModule;
  catalogItems: readonly CatalogItem[];
  placementSnapshot: PlacementSnapshot;
  season: TilesheetSeason;
  selectedPlacementKeys: readonly string[];
  tileWidth: number;
  tileHeight: number;
  placementTexturePromisesByLocalPath: Map<string, Promise<PixiTexture>>;
}>;

async function createPlacementSprites(
  createPlacementSpritesInput: CreatePlacementSpritesInput,
): Promise<readonly PlacementSprite[]> {
  const placementRenderEntries = createPlacementRenderEntries(
    createPlacementSpritesInput.placementSnapshot,
    createPlacementSpritesInput.catalogItems,
    createPlacementSpritesInput.season,
  );
  const placementTexturesByLocalPath = await loadPlacementTextures(
    createPlacementSpritesInput.pixi,
    placementRenderEntries,
    createPlacementSpritesInput.placementTexturePromisesByLocalPath,
  );
  const selectedPlacementKeySet = new Set(
    createPlacementSpritesInput.selectedPlacementKeys,
  );

  return Promise.all(
    placementRenderEntries.map(async (placementRenderEntry) => {
      const placementTexture = getRequiredPlacementTexture(
        placementTexturesByLocalPath,
        getPlacementTextureLocalPath(placementRenderEntry),
      );
      const paintedTexture = await createPaintedBuildingTexture(
        createPlacementSpritesInput.pixi,
        placementRenderEntry,
      );

      return createPlacementSprite(
        createPlacementSpritesInput.pixi,
        placementRenderEntry,
        paintedTexture ?? placementTexture,
        paintedTexture,
        createPlacementSpritesInput.tileWidth,
        createPlacementSpritesInput.tileHeight,
        selectedPlacementKeySet.has(placementRenderEntry.key),
      );
    }),
  );
}

async function loadPlacementTextures(
  pixi: PixiModule,
  placementRenderEntries: readonly PlacementRenderEntry[],
  placementTexturePromisesByLocalPath: Map<string, Promise<PixiTexture>>,
): Promise<ReadonlyMap<string, PixiTexture>> {
  const localTexturePaths = [
    ...new Set(
      placementRenderEntries.map(getPlacementTextureLocalPath),
    ),
  ];
  const textureEntries = await Promise.all(
    localTexturePaths.map(async (localTexturePath) => [
      localTexturePath,
      await loadPlacementTexture(
        pixi,
        localTexturePath,
        placementTexturePromisesByLocalPath,
      ),
    ] as const),
  );

  return new Map(textureEntries);
}

function getPlacementTextureLocalPath(
  placementRenderEntry: PlacementRenderEntry,
): string {
  return (
    placementRenderEntry.textureLocalPath ??
    placementRenderEntry.catalogItem.textureLocalPath
  );
}

function loadPlacementTexture(
  pixi: PixiModule,
  localTexturePath: string,
  placementTexturePromisesByLocalPath: Map<string, Promise<PixiTexture>>,
): Promise<PixiTexture> {
  assertLockedLocalPlacementTexturePath(localTexturePath);
  const cachedTexturePromise = placementTexturePromisesByLocalPath.get(
    localTexturePath,
  );

  if (cachedTexturePromise !== undefined) {
    return cachedTexturePromise;
  }

  const texturePromise = pixi.Assets.load<PixiTexture>({
    src: localTexturePath,
    data: {
      autoGenerateMipmaps: false,
      mipLevelCount: 1,
      scaleMode: "nearest",
    },
  });
  placementTexturePromisesByLocalPath.set(localTexturePath, texturePromise);
  return texturePromise;
}

function assertLockedLocalPlacementTexturePath(localTexturePath: string): void {
  if (
    typeof localTexturePath !== "string" ||
    !localTexturePath.startsWith(localGameAssetRoot) ||
    localTexturePath.includes("..")
  ) {
    throw new Error(
      `Placement sprite texture must be a locked local asset under ${JSON.stringify(localGameAssetRoot)}; received ${JSON.stringify(localTexturePath)}.`,
    );
  }
}

function getRequiredPlacementTexture(
  placementTexturesByLocalPath: ReadonlyMap<string, PixiTexture>,
  localTexturePath: string,
): PixiTexture {
  const placementTexture = placementTexturesByLocalPath.get(localTexturePath);

  if (placementTexture === undefined) {
    throw new Error(
      `Placement sprite texture is unavailable for locked local path ${JSON.stringify(localTexturePath)}.`,
    );
  }

  return placementTexture;
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

function createPlacementSprite(
  pixi: PixiModule,
  placementRenderEntry: PlacementRenderEntry,
  placementTexture: PixiTexture,
  paintedTexture: PixiTexture | null,
  tileWidth: number,
  tileHeight: number,
  isSelected: boolean,
): PlacementSprite {
  const placementFrameTexture = getPlacementFrameTexture(
    pixi,
    placementTexture,
    placementRenderEntry.frame,
  );
  const placementSprite = new pixi.Sprite({
    roundPixels: true,
    texture: placementFrameTexture.texture,
  });

  placementSprite.tint = isSelected
    ? 0xffdf4a
    : getPlacementTintColor(placementRenderEntry.tintColor);

  const { catalogItem, tileX, tileY } = placementRenderEntry;

  if (catalogItem.category === "building") {
    placementSprite.anchor.set(0, 1);
    placementSprite.position.set(
      tileX * tileWidth,
      (tileY + catalogItem.tileSize.height) * tileHeight,
    );
    return createPlacementSpriteResult(
      placementSprite,
      placementFrameTexture.frameTexture,
      paintedTexture,
    );
  }

  if (catalogItem.category === "crop") {
    placementSprite.anchor.set(0, 1);
    placementSprite.position.set(tileX * tileWidth, (tileY + 1) * tileHeight);
    return createPlacementSpriteResult(
      placementSprite,
      placementFrameTexture.frameTexture,
      paintedTexture,
    );
  }

  if (placementRenderEntry.isTree) {
    placementSprite.anchor.set(0.5, 1);
    placementSprite.position.set(
      tileX * tileWidth + tileWidth / 2,
      (tileY + 1) * tileHeight,
    );
    placementSprite.scale.x = placementRenderEntry.isFlipped ? -1 : 1;
    return createPlacementSpriteResult(
      placementSprite,
      placementFrameTexture.frameTexture,
      paintedTexture,
    );
  }

  if (catalogItem.renderingMetadata?.kind === "furniture") {
    if (placementRenderEntry.isFlipped) {
      placementSprite.anchor.set(0.5, 1);
      placementSprite.position.set(
        tileX * tileWidth + (catalogItem.tileSize.width * tileWidth) / 2,
        (tileY + catalogItem.tileSize.height) * tileHeight,
      );
      placementSprite.scale.x = -1;
    } else {
      placementSprite.anchor.set(0, 1);
      placementSprite.position.set(
        tileX * tileWidth,
        (tileY + catalogItem.tileSize.height) * tileHeight,
      );
    }

    return createPlacementSpriteResult(
      placementSprite,
      placementFrameTexture.frameTexture,
      paintedTexture,
    );
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
    return createPlacementSpriteResult(
      placementSprite,
      placementFrameTexture.frameTexture,
      paintedTexture,
    );
  }

  placementSprite.anchor.set(0, 0);
  placementSprite.position.set(tileX * tileWidth, tileY * tileHeight);
  return createPlacementSpriteResult(
    placementSprite,
    placementFrameTexture.frameTexture,
    paintedTexture,
  );
}

function createPlacementSpriteResult(
  sprite: import("pixi.js").Sprite,
  frameTexture: PixiTexture | null,
  paintedTexture: PixiTexture | null,
): PlacementSprite {
  return { sprite, frameTexture, paintedTexture };
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
    placementSprite.paintedTexture?.destroy();
  }
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
    getMapTileAtPointer,
    onMapTileClick,
    onMapTileRectangle,
    setCameraState,
  } = plannerCameraControlsProperties;
  const activePointerCoordinates = new Map<number, PointerCoordinates>();
  const placementClickSuppressedPointerIds = new Set<number>();
  let pointerDragState: PointerDragState | null = null;
  let pinchGestureState: PinchGestureState | null = null;

  canvasElement.tabIndex = 0;
  canvasElement.setAttribute("aria-label", "Interactive farm map camera");

  function handleWheel(wheelEvent: WheelEvent): void {
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
    canvasElement.focus({ preventScroll: true });
    canvasElement.setPointerCapture(pointerEvent.pointerId);
    placementClickSuppressedPointerIds.delete(pointerEvent.pointerId);
    const pointerCoordinates = getPointerCoordinates(pointerEvent, canvasElement);
    activePointerCoordinates.set(pointerEvent.pointerId, pointerCoordinates);
    const startMapTileCoordinates =
      isRectanglePointerInteractionMode(getPointerInteractionMode())
        ? getMapTileAtPointer?.(pointerCoordinates) ?? null
        : null;
    synchronizePointerGesture(startMapTileCoordinates);
  }

  function handlePointerMove(pointerEvent: PointerEvent): void {
    if (!activePointerCoordinates.has(pointerEvent.pointerId)) {
      return;
    }

    pointerEvent.preventDefault();
    const pointerCoordinates = getPointerCoordinates(pointerEvent, canvasElement);
    activePointerCoordinates.set(pointerEvent.pointerId, pointerCoordinates);

    if (activePointerCoordinates.size >= 2) {
      updateCameraForPinch();
      return;
    }

    if (isRectanglePointerInteractionMode(getPointerInteractionMode())) {
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
      Math.hypot(
        pointerCoordinates.x - pointerDragState.startCoordinates.x,
        pointerCoordinates.y - pointerDragState.startCoordinates.y,
      ) > pointerPanThreshold
    ) {
      return null;
    }

    return getMapTileAtPointer?.(pointerCoordinates) ?? null;
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

  function handlePointerEnd(pointerEvent: PointerEvent): void {
    if (!activePointerCoordinates.delete(pointerEvent.pointerId)) {
      return;
    }

    placementClickSuppressedPointerIds.delete(pointerEvent.pointerId);

    if (canvasElement.hasPointerCapture(pointerEvent.pointerId)) {
      canvasElement.releasePointerCapture(pointerEvent.pointerId);
    }

    synchronizePointerGesture();
  }

  function synchronizePointerGesture(
    startMapTileCoordinates: MapPointerTile | null = null,
  ): void {
    if (activePointerCoordinates.size >= 2) {
      for (const pointerId of activePointerCoordinates.keys()) {
        placementClickSuppressedPointerIds.add(pointerId);
      }

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
  canvasElement.addEventListener("pointercancel", handlePointerEnd);
  canvasElement.addEventListener("pointerdown", handlePointerDown);
  canvasElement.addEventListener("pointermove", handlePointerMove);
  canvasElement.addEventListener("pointerup", handlePointerUp);
  canvasElement.addEventListener("lostpointercapture", handlePointerEnd);
  canvasElement.addEventListener("wheel", handleWheel, { passive: false });

  return {
    dispose(): void {
      canvasElement.removeEventListener("keydown", handleKeyDown);
      canvasElement.removeEventListener("pointercancel", handlePointerEnd);
      canvasElement.removeEventListener("pointerdown", handlePointerDown);
      canvasElement.removeEventListener("pointermove", handlePointerMove);
      canvasElement.removeEventListener("pointerup", handlePointerUp);
      canvasElement.removeEventListener("lostpointercapture", handlePointerEnd);
      canvasElement.removeEventListener("wheel", handleWheel);
      activePointerCoordinates.clear();
      placementClickSuppressedPointerIds.clear();
      pinchGestureState = null;
      pointerDragState = null;
    },
  };
}

function isRectanglePointerInteractionMode(
  pointerInteractionMode: PointerInteractionMode,
): boolean {
  return (
    pointerInteractionMode === "rectangle" ||
    pointerInteractionMode === "move-selected"
  );
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
