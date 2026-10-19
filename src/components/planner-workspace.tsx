"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  loadCatalogCategory,
  loadBuildingPlacementMetadata,
  type BuildingPlacementMetadataById,
  type CatalogItem,
  type CatalogPresentationChoice,
} from "../catalog";
import {
  getCatalogItemSceneAvailability,
} from "../catalog/catalog-scene-availability";
import type { EditorPreferences } from "../editor/browser-editor-preferences";
import {
  getPlacementSelectionDetails,
  getPlacementSelectionSummary,
  type PlacementSelectionDetails,
  type PlacementSelectionKey,
} from "../editor/editor-selection-controller";
import {
  getRussianCatalogItemDisplayName,
  getRussianPlannerMapDisplayName,
} from "../i18n/planner-russian-display-names";
import {
  readVisibleProjectMapLabel,
  type ProjectMapLabelLocale,
} from "../i18n/planner-project-map-label";
import { getPlannerMapById, plannerMaps } from "../maps/map-catalog";
import {
  interiorFlooringPatterns,
  interiorWallpaperPatterns,
  type InteriorDecorCatalogPattern,
} from "../interior-decor/interior-decor-catalog";
import type {
  MapPlacementGrid,
  MapTileCoordinates,
} from "../placement/map-placement-grids";
import type { PlacementHistory } from "../placement/placement-history";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import {
  applyPlannerWorkspaceMapTileClick,
  applyPlannerWorkspaceMapTileRectangle,
  applyPlannerWorkspacePlacementSelection,
  deletePlannerWorkspaceSelection,
  duplicatePlannerWorkspaceSelectionAtTile,
  previewPlannerWorkspaceFillRectangle,
  previewPlannerWorkspaceEraseAtTile,
  previewPlannerWorkspaceEraseRectangle,
  previewPlannerWorkspaceSelectionAtTile,
  getPlannerWorkspaceCatalogItemSelectionTool,
  getPlannerWorkspaceToolSelection,
  isPlannerWorkspaceToolDisabled,
  movePlannerWorkspaceSelection,
  cyclePlannerWorkspaceSelectedAppearance,
  setPlannerWorkspaceSelectedBuildingPaint,
  setPlannerWorkspaceSelectedBuildingWaterColor,
  setPlannerWorkspaceSelectedItemTint,
  setPlannerWorkspaceSelectedNightLightState,
  type PlannerWorkspaceErasePreviewInput,
  type PlannerWorkspaceEraseRectanglePreviewInput,
} from "../planner/planner-workspace-editing-controller";
import {
  advanceWorkspaceCatalogPlacementAttempt,
  changeWorkspaceCatalogItemChoice,
  clearWorkspaceCatalogSelection,
  createInitialWorkspaceCatalogChoiceState,
  cyclePendingWorkspaceCatalogChoice,
  selectWorkspaceCatalogItem,
  type WorkspaceSelectedCatalogItem,
} from "../planner/planner-workspace-catalog-controls";
import {
  performSelectedAppearanceCycleWhenCatalogReady,
  resolveRequiredPlacementCatalogSnapshot,
} from "../planner/planner-workspace-required-catalog";
import type { BuildingPaintColors } from "../paint/building-paint";
import {
  type BrowserPlannerWorkspaceBootstrapInput,
  type PreparedPlannerWorkspace,
} from "../planner/planner-workspace-bootstrap";
import {
  createPlannerCameraStateRetention,
  type PlannerCameraStateRetention,
} from "../planner/planner-camera-state-retention";
import {
  createLocalProjectAndSaveCurrentMap,
  createPlannerLocalProjectActions,
  createPlannerProjectMapActions,
} from "../planner/planner-workspace-project-actions";
import { openImportedGameSaveAndPreserveResult } from "../planner/planner-workspace-game-save-import";
import type { ImportedGameSaveState } from "../game-save/game-save-import";
import { getCatalogPanelCopy } from "../i18n/catalog-panel-copy";
import {
  completePlannerWorkspaceRequest,
  createInitialPlannerWorkspaceResourceState,
  requestPlannerWorkspaceRetry,
  shouldPreparePlannerWorkspaceRequest,
} from "../planner/planner-workspace-resource-lifecycle";
import {
  attachPlannerWorkspaceEditingKeyboardListener,
  createPlannerWorkspaceEditingKeyboardHandler,
} from "../planner/planner-workspace-editing-keyboard";
import {
  applyPlannerWorkspaceInteriorDecor,
  cancelInteriorDecorBeforeOrdinaryWorkspaceAction,
  createInteriorDecorSelectionTransition,
  getInteriorDecorRejectionMessage,
  getNextInteriorDecorRejectionNotification,
  getUnavailableInteriorDecorMessage,
  type InteriorDecorRejectionNotification,
} from "../planner/planner-workspace-interior-decor-controls";
import {
  attachPlannerWorkspaceXRayKeyboardListener,
  createPlannerWorkspaceXRayKeyboardHandler,
} from "../planner/planner-workspace-xray-keyboard";
import {
  usePlannerWorkspaceState,
  type PlannerWorkspaceStateController,
} from "../planner/use-planner-workspace-state";
import {
  createPlannerWorkspaceMapRequest,
  type PlannerWorkspaceInitialStartup,
} from "../planner/planner-workspace-startup";
import type { PlannerWorkspaceAction } from "../planner/planner-workspace-state";
import {
  retainPlannerWorkspaceProjectLifecycle,
  type PlannerWorkspaceProjectLifecycle,
} from "../planner/planner-workspace-project-lifecycle";
import type { EditorTool } from "../editor/editor-view-state";
import {
  useReferenceProjectWorkspace,
  useReferenceProjectWorkspaceController,
} from "../reference-runtime/use-reference-project-workspace";
import { EditorMenuBar } from "./editor-menu-bar";
import { EditorModal } from "./editor-modal";
import { usePlannerAmbienceOptions } from "../editor/use-planner-ambience-options";
import {
  isPlannerModalLayerOpen,
  lockPlannerModalPageScroll,
} from "./planner-modal-page-scroll-lock";
import { EditorToolbar } from "./editor-toolbar";
import { ItemCatalogPanel } from "./item-catalog-panel";
import {
  CatalogPlacementControls,
  getCatalogPlacementMode,
} from "./catalog-placement-controls";
import { PlannerGameSaveImportResultLoader } from "./planner-game-save-import-result-loader";
import { PlannerSaveModalLoader } from "./planner-save-modal-loader";
import {
  PlannerCanvas,
  type PlannerCanvasProperties,
  type PlannerCanvasPlacementPreviewInput,
} from "./planner-canvas";
import { PlannerRequiredCatalogGate } from "./planner-required-catalog-status";
import { useRequiredPlacementCatalog } from "./use-required-placement-catalog";
import {
  PlannerStartupStatus,
  type PlannerStartupStatusState,
} from "./planner-startup-status";
import type { EditorPerformanceMarker } from "../performance/editor-performance-marks";
import {
  copyPngImageToClipboard,
} from "../projects/browser-image-clipboard";
import type { ScreenshotResolution } from "../projects/map-image-export";
import { SelectionInspector } from "./selection-inspector";
import { ProjectMapInstancePanel } from "./project-map-instance-panel";
import { usePlannerWorkspacePersistenceControls } from "./use-planner-workspace-persistence-controls";
import type { HomepageLocale } from "../homepage/homepage-locale";
import {
  getEditorModalCopy,
  type EditorModalCopy,
} from "../i18n/editor-modal-copy";
import { getSaveModalCopy, type SaveModalCopy } from "../i18n/save-modal-copy";
import {
  createPlannerWorkspacePreferencePersistence,
  type PlannerWorkspacePreferencePersistence,
} from "./planner-workspace-preference-persistence";

export type PlannerWorkspaceBootstrap = (
  browserPlannerWorkspaceBootstrapInput: BrowserPlannerWorkspaceBootstrapInput,
) => Promise<PreparedPlannerWorkspace | null>;

export type PlannerWorkspaceStartup = PlannerWorkspaceInitialStartup &
  Readonly<{
    bootstrapWorkspace: PlannerWorkspaceBootstrap;
  }>;

export type PlannerWorkspaceRenderState =
  | Readonly<{ kind: "loading"; message: string }>
  | Readonly<{ kind: "error"; message: string; onRetry: () => void }>
  | Readonly<{
      kind: "prepared";
      preparedWorkspace: PreparedPlannerWorkspace;
      runtimeStatus: "loading" | "ready" | "interactive";
    }>;

export function copyPlannerWorkspaceCleanMapImage(
  captureCleanMapImage: (
    screenshotResolution: ScreenshotResolution,
  ) => Promise<Blob>,
  copyImageToClipboard: (
    pngImage: Promise<Blob>,
  ) => Promise<void> = copyPngImageToClipboard,
): Promise<void> {
  return copyImageToClipboard(captureCleanMapImage(1));
}

export function persistPlannerWorkspacePreferences({
  dispatchPlannerWorkspaceAction,
  locale = "en",
  preferencePersistence,
  preferences,
  resourceGeneration,
}: Readonly<{
  dispatchPlannerWorkspaceAction: (plannerWorkspaceAction: PlannerWorkspaceAction) => void;
  locale?: HomepageLocale;
  preferencePersistence: PlannerWorkspacePreferencePersistence;
  preferences: EditorPreferences;
  resourceGeneration: number;
}>): void {
  try {
    preferencePersistence.observePreferences(preferences);
  } catch (caughtError) {
    dispatchPlannerWorkspaceAction({
      message: getPlannerWorkspaceErrorMessage(caughtError, locale),
      resourceGeneration,
      type: "complete-runtime-error",
    });
  }
}

export type PlannerWorkspaceProperties = Readonly<{
  locale: HomepageLocale;
  startup: PlannerWorkspaceStartup;
  onAlignPlanner?: () => void;
  loadBuildingMetadata?: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory?: typeof loadCatalogCategory;
  performanceMarker?: EditorPerformanceMarker;
}>;

type PlannerWorkspaceStaticBoundaryProperties = Readonly<{
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
  plannerWorkspaceStateController?: PlannerWorkspaceStateController;
}>;

type PlannerWorkspacePersistenceControls = ReturnType<
  typeof usePlannerWorkspacePersistenceControls
>;

type PreparedPlannerWorkspaceContentProperties = Readonly<{
  cameraStateRetention: PlannerCameraStateRetention;
  editorModalCopy: EditorModalCopy;
  locale: HomepageLocale;
  saveModalCopy: SaveModalCopy;
  newProjectName: string;
  preparedWorkspace: PreparedPlannerWorkspace;
  projectWorkspace: NonNullable<
    ReturnType<typeof useReferenceProjectWorkspaceController>
  >;
  plannerWorkspaceStateController: PlannerWorkspaceStateController;
  loadBuildingMetadata: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory: typeof loadCatalogCategory;
  onImportedGameSaveResult: (importedGameSaveState: ImportedGameSaveState) => void;
  onAlignPlanner?: () => void;
  performanceMarker?: EditorPerformanceMarker;
  runtimeStatus: "loading" | "ready" | "interactive";
  workspacePersistenceControls: PlannerWorkspacePersistenceControls;
}>;

type CurrentMapPlacementGrid = Readonly<{
  mapId: string;
  mapPlacementGrid: MapPlacementGrid;
}>;

type PreparedWorkspaceInitialization = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById | null;
  getCurrentMapPlacementGrid: (
    requestedMapId: string,
  ) => MapPlacementGrid | null;
  getRequiredCurrentMapPlacementGrid: (requestedMapId: string) => MapPlacementGrid;
  onCanvasInteractive: () => void;
  onCanvasReady: () => void;
  onMapPlacementGridReady: (
    mapId: string,
    mapPlacementGrid: MapPlacementGrid,
  ) => void;
}>;

type WorkspaceCatalogControls = Readonly<{
  advanceSelectedCatalogPlacementAttempt: () => void;
  catalogPresentationChoicesByItemId: ReadonlyMap<
    string,
    CatalogPresentationChoice
  >;
  clearSelectedCatalogItem: () => void;
  onCatalogItemSelect: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
  onReadyCatalogItems: (catalogItems: readonly CatalogItem[]) => void;
  onToolChange: Parameters<typeof EditorToolbar>[0]["onToolChange"];
  readyCatalogItems: readonly CatalogItem[];
  searchQuery: string;
  selectedCatalogItem: WorkspaceSelectedCatalogItem | null;
  setSearchQuery: (searchQuery: string) => void;
}>;

type WorkspaceEditingControls = Readonly<{
  cancelPendingDuplicateSelection: () => void;
  hasPendingPlacementCopy: boolean;
  getPlacementCopyPreviewAtTile: NonNullable<
    PlannerCanvasProperties["getPlacementCopyPreviewAtTile"]
  >;
  getFillRectanglePreviewAtTiles: NonNullable<
    PlannerCanvasProperties["getFillRectanglePreviewAtTiles"]
  >;
  getErasePreviewAtTile: NonNullable<
    PlannerCanvasProperties["getErasePreviewAtTile"]
  >;
  getEraseRectanglePreviewAtTiles: NonNullable<
    PlannerCanvasProperties["getEraseRectanglePreviewAtTiles"]
  >;
  onMapTileClick: (mapId: string, cursorTile: { x: number; y: number }) => void;
  onPlacementSelectionClick: (
    mapId: string,
    placementSelectionKeys: readonly PlacementSelectionKey[],
  ) => void;
  onMapTileRectangle: (
    mapId: string,
    firstTile: { x: number; y: number },
    secondTile: { x: number; y: number },
  ) => void;
  onNudgeSelectedPlacements: (
    direction: "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp",
  ) => void;
  selectionInspector: ReactNode;
}>;

export function createWorkspaceCatalogPlacementPreviewInput(
  input: Readonly<{
    buildingMetadataById: BuildingPlacementMetadataById | null;
    freePlacement: boolean;
    selectedCatalogItem: WorkspaceSelectedCatalogItem | null;
    tool: EditorTool | null;
  }>,
): PlannerCanvasPlacementPreviewInput | null {
  if (
    input.tool !== "cursor" ||
    input.buildingMetadataById === null ||
    input.selectedCatalogItem === null
  ) {
    return null;
  }

  return {
    buildingMetadataById: input.buildingMetadataById,
    catalogPresentationChoice: input.selectedCatalogItem.presentationChoice,
    freePlacement: input.freePlacement,
    ...(input.selectedCatalogItem.resolvedCompositeVariant === undefined
      ? {}
      : {
          resolvedCompositeVariant:
            input.selectedCatalogItem.resolvedCompositeVariant,
        }),
    selectedCatalogItem: input.selectedCatalogItem.catalogItem,
  };
}

export function createWorkspaceErasePreviewAtTileInput(
  input: Readonly<{
    buildingMetadataById: BuildingPlacementMetadataById | null;
    currentMapPlacementGrid: MapPlacementGrid | null;
    cursorTile: MapTileCoordinates;
    placementHistory: PlacementHistory<PlacementSnapshot>;
    tool: EditorTool | null;
  }>,
): PlannerWorkspaceErasePreviewInput | null {
  if (
    input.tool !== "erase" ||
    input.buildingMetadataById === null ||
    input.currentMapPlacementGrid === null
  ) {
    return null;
  }

  return {
    buildingMetadataById: input.buildingMetadataById,
    cursorTile: input.cursorTile,
    placementHistory: input.placementHistory,
    tool: input.tool,
  };
}

export function createWorkspaceEraseRectanglePreviewInput(
  input: Readonly<{
    buildingMetadataById: BuildingPlacementMetadataById | null;
    currentMapPlacementGrid: MapPlacementGrid | null;
    firstTile: MapTileCoordinates;
    placementHistory: PlacementHistory<PlacementSnapshot>;
    secondTile: MapTileCoordinates;
    tool: EditorTool | null;
  }>,
): PlannerWorkspaceEraseRectanglePreviewInput | null {
  if (
    input.tool !== "erase" ||
    input.buildingMetadataById === null ||
    input.currentMapPlacementGrid === null
  ) {
    return null;
  }

  return {
    buildingMetadataById: input.buildingMetadataById,
    firstTile: input.firstTile,
    placementHistory: input.placementHistory,
    secondTile: input.secondTile,
    tool: input.tool,
  };
}

export function getPlannerCanvasInteractionProperties(
  input: Readonly<{
    hasSelectedPlacements: boolean;
    hasPendingPlacementCopy?: boolean;
    tool: EditorTool | null;
    wheelZoomEnabled: boolean;
  }>,
): Readonly<{
  pointerInteractionMode:
    | "move-selected"
    | "navigate"
    | "rectangle"
    | "multi-select";
  wheelZoomEnabled: boolean;
}> {
  return {
    pointerInteractionMode:
      input.hasPendingPlacementCopy === true
        ? "navigate"
        : input.tool === null
          ? "navigate"
          : input.tool === "multi-select"
            ? "multi-select"
            : input.tool === "fill" || input.tool === "erase"
              ? "rectangle"
              : input.hasSelectedPlacements
                ? "move-selected"
                : "navigate",
    wheelZoomEnabled: input.wheelZoomEnabled,
  };
}

export function processPlannerWorkspaceMapTileClick(
  input: Readonly<{
    advanceSelectedCatalogPlacementAttempt: () => void;
    applyEditingTransition: (
      placementHistory: PlacementHistory<PlacementSnapshot>,
      selectedPlacementKeys: readonly PlacementSelectionKey[],
    ) => void;
    buildingMetadataById: BuildingPlacementMetadataById | null;
    clearPendingDuplicateSelection: () => void;
    cursorTile: { x: number; y: number };
    freePlacement: boolean;
    getRequiredCurrentMapPlacementGrid: (
      requestedMapId: string,
    ) => MapPlacementGrid;
    mapId: string;
    pendingDuplicateSelectionKeys: readonly PlacementSelectionKey[] | null;
    placementHistory: PlacementHistory<PlacementSnapshot>;
    readyCatalogItems: readonly CatalogItem[];
    selectedCatalogItem: WorkspaceSelectedCatalogItem | null;
    selectedPlacementKeys: readonly PlacementSelectionKey[];
    tool: EditorTool | null;
  }>,
): void {
  if (input.buildingMetadataById === null) {
    throw new Error(
      `Planner workspace building placement metadata is unavailable for requested map ID ${JSON.stringify(input.mapId)}.`,
    );
  }
  const mapPlacementGrid = input.getRequiredCurrentMapPlacementGrid(input.mapId);
  const pendingDuplicateSelectionKeys = input.pendingDuplicateSelectionKeys;
  const editingTransition =
    pendingDuplicateSelectionKeys === null
      ? applyPlannerWorkspaceMapTileClick({
          buildingMetadataById: input.buildingMetadataById,
          catalogPresentationChoice:
            input.selectedCatalogItem?.presentationChoice ?? null,
          cursorTile: input.cursorTile,
          freePlacement: input.freePlacement,
          mapPlacementGrid,
          placementHistory: input.placementHistory,
          resolvedCompositeVariant:
            input.selectedCatalogItem?.resolvedCompositeVariant,
          selectedCatalogItem: input.selectedCatalogItem?.catalogItem ?? null,
          selectedPlacementKeys: input.selectedPlacementKeys,
          tool: input.tool,
        })
      : duplicatePlannerWorkspaceSelectionAtTile({
          buildingMetadataById: input.buildingMetadataById,
          catalogItems: input.readyCatalogItems,
          cursorTile: input.cursorTile,
          freePlacement: input.freePlacement,
          mapPlacementGrid,
          placementHistory: input.placementHistory,
          selectedPlacementKeys: pendingDuplicateSelectionKeys,
        });
  if (
    pendingDuplicateSelectionKeys === null ||
    editingTransition.placementHistory !== input.placementHistory
  ) {
    input.clearPendingDuplicateSelection();
  }
  input.applyEditingTransition(
    editingTransition.placementHistory,
    editingTransition.selectedPlacementKeys,
  );
  if (
    pendingDuplicateSelectionKeys === null &&
    input.tool === "cursor" &&
    input.selectedCatalogItem !== null &&
    editingTransition.placementHistory !== input.placementHistory
  ) {
    input.advanceSelectedCatalogPlacementAttempt();
  }
}

export function processPlannerWorkspaceSelectionMove(
  input: Readonly<{
    applyEditingTransition: PlannerWorkspaceStateController["applyPlacementEditResult"];
    editingTransition: ReturnType<typeof movePlannerWorkspaceSelection>;
    onToolChange: (tool: EditorTool) => void;
    placementHistory: PlacementHistory<PlacementSnapshot>;
    tool: EditorTool | null;
  }>,
): void {
  const completedMultiSelectionMove =
    input.tool === "multi-select" &&
    input.editingTransition.placementHistory !== input.placementHistory;

  input.applyEditingTransition(
    input.editingTransition.placementHistory,
    completedMultiSelectionMove
      ? []
      : input.editingTransition.selectedPlacementKeys,
  );

  if (completedMultiSelectionMove) {
    input.onToolChange("cursor");
  }
}

function readPlannerChromeLocale(
  locale: HomepageLocale,
): "en" | "zh" | "ru" {
  if (locale === "en") return "en";
  if (locale === "zh-CN") return "zh";
  if (locale === "ru") return "ru";
  throw new Error(
    `Unsupported planner locale. Received: ${JSON.stringify(locale)}.`,
  );
}

function readPlannerWorkspaceStartupMessage(locale: HomepageLocale): string {
  if (locale === "en" || locale === "zh-CN") {
    return "Loading local planner resources…";
  }
  if (locale === "ru") {
    return "Загрузка локальных ресурсов планировщика…";
  }
  throw new Error(
    `Unsupported planner locale. Received: ${JSON.stringify(locale)}.`,
  );
}

const interiorDecorPatternByCatalogItemId = new Map<string, InteriorDecorCatalogPattern>([
  ...interiorWallpaperPatterns,
  ...interiorFlooringPatterns,
].map((pattern) => [pattern.id, pattern]));

function ignoreImportedGameSave(_importedGameSaveState: ImportedGameSaveState): void {}

export function PlannerWorkspace({
  locale,
  startup,
  onAlignPlanner,
  loadBuildingMetadata = loadBuildingPlacementMetadata,
  loadRequiredCatalogCategory = loadCatalogCategory,
  performanceMarker,
}: PlannerWorkspaceProperties) {
  const editorModalCopy = getEditorModalCopy(locale);
  const saveModalCopy = getSaveModalCopy(locale);
  const plannerWorkspaceStateController = usePlannerWorkspaceState({
    initialPlannerWorkspaceState: startup.initialPlannerWorkspaceState,
  });
  const {
    dispatchPlannerWorkspaceAction,
    plannerWorkspaceState,
  } = plannerWorkspaceStateController;
  const bootstrapWorkspaceReference = useRef<PlannerWorkspaceBootstrap>(
    startup.bootstrapWorkspace,
  );
  const initialMapRequestReference = useRef(startup.initialMapRequest);
  const projectLifecycleReference =
    useRef<PlannerWorkspaceProjectLifecycle | null>(null);
  const resourceGenerationReference = useRef(0);
  const [workspaceResourceState, setWorkspaceResourceState] = useState(
    createInitialPlannerWorkspaceResourceState,
  );
  const [importedGameSaveResult, setImportedGameSaveResult] =
    useState<ImportedGameSaveState | null>(null);
  const isPlannerModalOpen = isPlannerModalLayerOpen({
    editorModalId: plannerWorkspaceState.modalId,
    hasImportedGameSaveResult: importedGameSaveResult !== null,
  });

  useEffect(() => {
    if (!isPlannerModalOpen) {
      return;
    }

    return lockPlannerModalPageScroll(document.body.style);
  }, [isPlannerModalOpen]);

  useEffect(() => {
    const mapRequest = resourceGenerationReference.current === 0
      ? initialMapRequestReference.current
      : createPlannerWorkspaceMapRequest(plannerWorkspaceState);

    if (!shouldPreparePlannerWorkspaceRequest(workspaceResourceState, mapRequest)) {
      return;
    }

    const resourceGeneration = resourceGenerationReference.current + 1;
    resourceGenerationReference.current = resourceGeneration;
    dispatchPlannerWorkspaceAction({
      resourceGeneration,
      type: "start-runtime-loading",
    });
    let hasDisposed = false;
    const isResourceGenerationCurrent = () =>
      !hasDisposed && resourceGenerationReference.current === resourceGeneration;

    async function prepareWorkspace(): Promise<void> {
      try {
        const nextPreparedWorkspace = await bootstrapWorkspaceReference.current({
          isGenerationCurrent: isResourceGenerationCurrent,
          mapRequest,
          resourceGeneration,
        });

        if (nextPreparedWorkspace === null || !isResourceGenerationCurrent()) {
          return;
        }

        setWorkspaceResourceState((currentState) =>
          completePlannerWorkspaceRequest(
            currentState,
            nextPreparedWorkspace,
            mapRequest,
          ),
        );
      } catch (caughtError) {
        if (!isResourceGenerationCurrent()) {
          return;
        }
        dispatchPlannerWorkspaceAction({
          message: getPlannerWorkspaceErrorMessage(caughtError, locale),
          resourceGeneration,
          type: "complete-runtime-error",
        });
      }
    }

    void prepareWorkspace();

    return () => {
      hasDisposed = true;
    };
  }, [
    plannerWorkspaceState.mapRenderOptions,
    plannerWorkspaceState.season,
    plannerWorkspaceState.selectedPlannerMapId,
    dispatchPlannerWorkspaceAction,
    locale,
    workspaceResourceState,
  ]);

  const preparedWorkspace = workspaceResourceState.preparedRequest?.preparedWorkspace ?? null;
  projectLifecycleReference.current = retainPlannerWorkspaceProjectLifecycle(
    projectLifecycleReference.current,
    preparedWorkspace?.projectState ?? null,
  );
  const projectWorkspace = useReferenceProjectWorkspaceController(
    projectLifecycleReference.current?.workspaceController ?? null,
  );
  const mapRequest = createPlannerWorkspaceMapRequest(plannerWorkspaceState);
  const isPreparedWorkspaceCurrent =
    preparedWorkspace !== null &&
    !shouldPreparePlannerWorkspaceRequest(workspaceResourceState, mapRequest);
  const plannerWorkspaceRenderState = createPlannerWorkspaceRenderState({
    locale,
    preparedWorkspace: isPreparedWorkspaceCurrent ? preparedWorkspace : null,
    plannerWorkspaceState,
    onRetry: () =>
      setWorkspaceResourceState((currentState) =>
        requestPlannerWorkspaceRetry(currentState),
      ),
  });

  return (
    <>
      <PlannerWorkspaceRenderedBoundary
        editorModalCopy={editorModalCopy}
        locale={locale}
        loadBuildingMetadata={loadBuildingMetadata}
        loadRequiredCatalogCategory={loadRequiredCatalogCategory}
        newProjectName={saveModalCopy.localProjects.defaultProjectName}
        onImportedGameSaveResult={setImportedGameSaveResult}
        onAlignPlanner={onAlignPlanner}
        performanceMarker={performanceMarker}
        plannerWorkspaceRenderState={plannerWorkspaceRenderState}
        plannerWorkspaceStateController={plannerWorkspaceStateController}
        projectWorkspace={projectWorkspace}
        saveModalCopy={saveModalCopy}
      />
      <PlannerGameSaveImportResultLoader
        copy={{
          gameSave: saveModalCopy.gameSave,
          gameSaveResultLoader: saveModalCopy.gameSaveResultLoader,
        }}
        importedGameSaveState={importedGameSaveResult}
        onClose={() => setImportedGameSaveResult(null)}
      />
    </>
  );
}

export function PlannerWorkspaceStaticBoundary({
  plannerWorkspaceRenderState,
  plannerWorkspaceStateController,
}: PlannerWorkspaceStaticBoundaryProperties) {
  if (plannerWorkspaceRenderState.kind === "prepared") {
    return (
      <StaticPreparedPlannerWorkspace
        preparedWorkspace={plannerWorkspaceRenderState.preparedWorkspace}
        plannerWorkspaceStateController={plannerWorkspaceStateController}
        runtimeStatus={plannerWorkspaceRenderState.runtimeStatus}
      />
    );
  }

  return (
    <PlannerWorkspaceGeometry
      locale="en"
      plannerWorkspaceRenderState={plannerWorkspaceRenderState}
    />
  );
}

function StaticPreparedPlannerWorkspace({
  preparedWorkspace,
  plannerWorkspaceStateController,
  runtimeStatus,
}: Readonly<{
  preparedWorkspace: PreparedPlannerWorkspace;
  plannerWorkspaceStateController?: PlannerWorkspaceStateController;
  runtimeStatus: "loading" | "ready" | "interactive";
}>) {
  const defaultPlannerWorkspaceStateController = usePlannerWorkspaceState();
  const resolvedPlannerWorkspaceStateController =
    plannerWorkspaceStateController ?? defaultPlannerWorkspaceStateController;
  const projectLifecycleReference =
    useRef<PlannerWorkspaceProjectLifecycle | null>(null);
  const projectLifecycle = projectLifecycleReference.current === null
    ? retainPlannerWorkspaceProjectLifecycle(null, preparedWorkspace.projectState)
    : retainPlannerWorkspaceProjectLifecycle(
        projectLifecycleReference.current,
        preparedWorkspace.projectState,
      );
  projectLifecycleReference.current = projectLifecycle;
  const projectWorkspace = useReferenceProjectWorkspaceController(
    projectLifecycle.workspaceController,
  );

  return (
    <PlannerWorkspaceRenderedBoundary
      editorModalCopy={getEditorModalCopy("en")}
      locale="en"
      loadBuildingMetadata={loadBuildingPlacementMetadata}
      loadRequiredCatalogCategory={loadCatalogCategory}
      newProjectName="Untitled Project"
      onImportedGameSaveResult={ignoreImportedGameSave}
      performanceMarker={undefined}
      plannerWorkspaceRenderState={{
        kind: "prepared",
        preparedWorkspace,
        runtimeStatus,
      }}
      plannerWorkspaceStateController={resolvedPlannerWorkspaceStateController}
      projectWorkspace={projectWorkspace}
      saveModalCopy={getSaveModalCopy("en")}
    />
  );
}

function PlannerWorkspaceRenderedBoundary({
  editorModalCopy,
  locale,
  loadBuildingMetadata,
  loadRequiredCatalogCategory,
  newProjectName,
  onImportedGameSaveResult,
  onAlignPlanner,
  performanceMarker,
  plannerWorkspaceRenderState,
  plannerWorkspaceStateController,
  projectWorkspace,
  saveModalCopy,
}: Readonly<{
  editorModalCopy: EditorModalCopy;
  locale: HomepageLocale;
  loadBuildingMetadata: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory: typeof loadCatalogCategory;
  newProjectName: string;
  onImportedGameSaveResult: (importedGameSaveState: ImportedGameSaveState) => void;
  onAlignPlanner?: () => void;
  performanceMarker?: EditorPerformanceMarker;
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
  plannerWorkspaceStateController: PlannerWorkspaceStateController;
  projectWorkspace: ReturnType<typeof useReferenceProjectWorkspaceController>;
  saveModalCopy: SaveModalCopy;
}>) {
  const cameraStateRetentionReference =
    useRef<PlannerCameraStateRetention | null>(null);

  if (cameraStateRetentionReference.current === null) {
    cameraStateRetentionReference.current = createPlannerCameraStateRetention();
  }
  cameraStateRetentionReference.current.observeSelectedMapId(
    plannerWorkspaceStateController.plannerWorkspaceState.selectedPlannerMapId,
  );
  const cameraStateRetention = cameraStateRetentionReference.current;
  if (cameraStateRetention === null) {
    throw new Error("Planner camera state retention was not created.");
  }

  return (
    <PlannerWorkspaceGeometry
      locale={locale}
      plannerWorkspaceRenderState={plannerWorkspaceRenderState}
    >
      {projectWorkspace === null ? null : (
        <PlannerWorkspacePersistenceBoundary
          cameraStateRetention={cameraStateRetention}
          editorModalCopy={editorModalCopy}
          locale={locale}
          loadBuildingMetadata={loadBuildingMetadata}
          loadRequiredCatalogCategory={loadRequiredCatalogCategory}
          newProjectName={newProjectName}
          onAlignPlanner={onAlignPlanner}
          onImportedGameSaveResult={onImportedGameSaveResult}
          performanceMarker={performanceMarker}
          plannerWorkspaceRenderState={plannerWorkspaceRenderState}
          plannerWorkspaceStateController={plannerWorkspaceStateController}
          projectWorkspace={projectWorkspace}
          saveModalCopy={saveModalCopy}
        />
      )}
    </PlannerWorkspaceGeometry>
  );
}

function PlannerWorkspacePersistenceBoundary({
  cameraStateRetention,
  editorModalCopy,
  locale,
  loadBuildingMetadata,
  loadRequiredCatalogCategory,
  newProjectName,
  onAlignPlanner,
  onImportedGameSaveResult,
  performanceMarker,
  plannerWorkspaceRenderState,
  plannerWorkspaceStateController,
  projectWorkspace,
  saveModalCopy,
}: Readonly<{
  cameraStateRetention: PlannerCameraStateRetention;
  editorModalCopy: EditorModalCopy;
  locale: HomepageLocale;
  loadBuildingMetadata: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory: typeof loadCatalogCategory;
  newProjectName: string;
  onAlignPlanner?: () => void;
  onImportedGameSaveResult: (importedGameSaveState: ImportedGameSaveState) => void;
  performanceMarker?: EditorPerformanceMarker;
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
  plannerWorkspaceStateController: PlannerWorkspaceStateController;
  projectWorkspace: NonNullable<
    ReturnType<typeof useReferenceProjectWorkspaceController>
  >;
  saveModalCopy: SaveModalCopy;
}>) {
  const {
    dispatchPlannerWorkspaceAction,
    plannerWorkspaceState,
  } = plannerWorkspaceStateController;
  const workspacePersistenceControls = usePlannerWorkspacePersistenceControls({
    dispatchPlannerWorkspaceAction,
    locale,
    newProjectName,
    plannerWorkspaceState,
    workspaceController: projectWorkspace.workspaceController,
    workspaceState: projectWorkspace.workspaceState,
  });

  if (plannerWorkspaceRenderState.kind !== "prepared") {
    return null;
  }

  return (
    <PreparedPlannerWorkspaceContent
      cameraStateRetention={cameraStateRetention}
      editorModalCopy={editorModalCopy}
      locale={locale}
      loadBuildingMetadata={loadBuildingMetadata}
      loadRequiredCatalogCategory={loadRequiredCatalogCategory}
      newProjectName={newProjectName}
      onAlignPlanner={onAlignPlanner}
      onImportedGameSaveResult={onImportedGameSaveResult}
      performanceMarker={performanceMarker}
      plannerWorkspaceStateController={plannerWorkspaceStateController}
      preparedWorkspace={plannerWorkspaceRenderState.preparedWorkspace}
      projectWorkspace={projectWorkspace}
      runtimeStatus={plannerWorkspaceRenderState.runtimeStatus}
      saveModalCopy={saveModalCopy}
      workspacePersistenceControls={workspacePersistenceControls}
    />
  );
}

function PlannerWorkspaceGeometry({
  children,
  locale,
  plannerWorkspaceRenderState,
}: Readonly<{
  children?: ReactNode;
  locale: HomepageLocale;
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
}>) {
  return (
    <section
      className="planner-workspace planner-editor-shell"
      data-planner-workspace-state={plannerWorkspaceRenderState.kind}
    >
      <PlannerStartupStatus
        locale={locale}
        state={toPlannerStartupStatusState(plannerWorkspaceRenderState, locale)}
      />
      <div className="planner-workspace__reserved-geometry planner-editor-canvas-area">
        {children}
      </div>
    </section>
  );
}

function PreparedPlannerWorkspaceContent({
  cameraStateRetention,
  editorModalCopy,
  locale,
  newProjectName,
  preparedWorkspace,
  projectWorkspace,
  plannerWorkspaceStateController,
  loadBuildingMetadata,
  loadRequiredCatalogCategory,
  onImportedGameSaveResult,
  onAlignPlanner,
  performanceMarker,
  runtimeStatus,
  saveModalCopy,
  workspacePersistenceControls,
}: PreparedPlannerWorkspaceContentProperties) {
  const editorLocale = readPlannerChromeLocale(locale);
  const {
    applyPlacementEditResult,
    dispatchPlannerWorkspaceAction,
    plannerWorkspaceState,
    setSelectedPlacementKeys,
  } = plannerWorkspaceStateController;
  const { plannerAmbienceOptions, setPlannerAmbienceOptions } = usePlannerAmbienceOptions();
  const preferencePersistence = useMemo(
    () => createPlannerWorkspacePreferencePersistence({
      initialPreferences: preparedWorkspace.preferences,
      savePreferences: preparedWorkspace.savePreferences,
    }),
    [preparedWorkspace.preferences, preparedWorkspace.savePreferences],
  );
  useEffect(() => {
    persistPlannerWorkspacePreferences({
      dispatchPlannerWorkspaceAction,
      locale,
      preferencePersistence,
      preferences: {
        behaviorOptions: plannerWorkspaceState.behaviorOptions,
        displayOptions: plannerWorkspaceState.displayOptions,
      },
      resourceGeneration: preparedWorkspace.resourceGeneration,
    });
  }, [
    dispatchPlannerWorkspaceAction,
    locale,
    plannerWorkspaceState.behaviorOptions,
    plannerWorkspaceState.displayOptions,
    preferencePersistence,
    preparedWorkspace.resourceGeneration,
  ]);
  const { workspaceController, workspaceState } = projectWorkspace;
  const {
    buildingMetadataById,
    getCurrentMapPlacementGrid,
    getRequiredCurrentMapPlacementGrid,
    handleCanvasError,
    handleCanvasInteractive,
    handleCanvasReady,
    handleMapPlacementGridReady,
  } = usePreparedWorkspaceInitialization({
    dispatchPlannerWorkspaceAction,
    loadBuildingMetadata,
    locale,
    preparedWorkspace,
    selectedPlannerMapId: plannerWorkspaceState.selectedPlannerMapId,
  });
  const handleCopyCleanMapImage = useCallback(
    () =>
      copyPlannerWorkspaceCleanMapImage(
        workspacePersistenceControls.captureCleanMapImage,
      ),
    [workspacePersistenceControls.captureCleanMapImage],
  );
  const {
    advanceSelectedCatalogPlacementAttempt,
    catalogPresentationChoicesByItemId,
    clearSelectedCatalogItem,
    handleCatalogItemSelect,
    handleReadyCatalogItems,
    handleToolChange,
    readyCatalogItems,
    searchQuery,
    selectedCatalogItem,
    setSearchQuery,
    cyclePendingCatalogChoice,
  } = useWorkspaceCatalogControls(
    dispatchPlannerWorkspaceAction,
    preparedWorkspace,
    plannerWorkspaceState.tool,
  );
  const requiredPlacementCatalogSnapshot =
    resolveRequiredPlacementCatalogSnapshot({
      activeSession: workspaceState.activeSession,
      currentPlacementSnapshot:
        plannerWorkspaceState.placementHistory.currentState,
      getPlannerMapIdForMapFile: workspaceController.getPlannerMapIdForMapFile,
      plannerWorkspaceCanonicalIdentity: plannerWorkspaceState,
    });
  const requiredPlacementCatalogGate = useRequiredPlacementCatalog({
    catalogItems: readyCatalogItems,
    loadCategory: loadRequiredCatalogCategory,
    onCatalogItemsLoaded: handleReadyCatalogItems,
    placementSnapshot: requiredPlacementCatalogSnapshot,
    resourceGeneration: preparedWorkspace.resourceGeneration,
  });
  const isRequiredPlacementCatalogReady =
    requiredPlacementCatalogGate.kind === "ready";
  const [activeInteriorDecorPattern, setActiveInteriorDecorPattern] =
    useState<InteriorDecorCatalogPattern | null>(null);
  const [interiorDecorRejectionNotification, setInteriorDecorRejectionNotification] =
    useState<InteriorDecorRejectionNotification | null>(null);
  const [wheelZoomEnabled, setWheelZoomEnabled] = useState(false);
  const [isXRayActive, setIsXRayActive] = useState(false);
  const handleZoomControlClick = useCallback(() => {
    setWheelZoomEnabled((currentlyEnabled) => !currentlyEnabled);
    onAlignPlanner?.();
  }, [onAlignPlanner]);
  const handleCancelInteriorDecor = useCallback(() => {
    setActiveInteriorDecorPattern(null);
    setInteriorDecorRejectionNotification(null);
  }, []);
  useEffect(() => {
    if (interiorDecorRejectionNotification === null) {
      return;
    }

    const rejectionMessageTimeoutId = window.setTimeout(() => {
      setInteriorDecorRejectionNotification(null);
    }, 3_000);

    return () => {
      window.clearTimeout(rejectionMessageTimeoutId);
    };
  }, [interiorDecorRejectionNotification]);
  const showInteriorDecorRejectionMessage = useCallback(
    (message: string) => {
      setInteriorDecorRejectionNotification((currentNotification) =>
        getNextInteriorDecorRejectionNotification(
          currentNotification,
          plannerWorkspaceState.behaviorOptions.showToasts,
          message,
        ),
      );
    },
    [plannerWorkspaceState.behaviorOptions.showToasts],
  );
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    return attachPlannerWorkspaceXRayKeyboardListener(
      window,
      createPlannerWorkspaceXRayKeyboardHandler({
        onXRayActiveChange: setIsXRayActive,
      }, { isEnabled: () => plannerWorkspaceState.modalId === null }),
    );
  }, [plannerWorkspaceState.modalId]);
  const workspaceEditingControls = useWorkspaceEditingControls({
    activeInteriorDecorPattern,
    locale,
    advanceSelectedCatalogPlacementAttempt,
    applyPlacementEditResult,
    buildingMetadataById,
    clearSelectedCatalogItem,
    getCurrentMapPlacementGrid,
    getRequiredCurrentMapPlacementGrid,
    isRequiredPlacementCatalogReady,
    plannerWorkspaceState,
    readyCatalogItems,
    selectedCatalogItem,
    setSelectedPlacementKeys,
    onPendingCatalogChoiceCycle: cyclePendingCatalogChoice,
    onDismissInteriorDecor: handleCancelInteriorDecor,
    onToolChange: (tool) => handleOrdinaryToolChange(tool),
  });
  const placementPreview = createWorkspaceCatalogPlacementPreviewInput({
    buildingMetadataById,
    freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
    selectedCatalogItem,
    tool: plannerWorkspaceState.tool,
  });
  const handleInteriorDecorPatternSelect = useCallback(
    (pattern: InteriorDecorCatalogPattern | null) => {
      const selectionTransition = createInteriorDecorSelectionTransition(pattern);
      setActiveInteriorDecorPattern(selectionTransition.activeInteriorDecorPattern);
      setInteriorDecorRejectionNotification(null);
      if (!selectionTransition.shouldClearOrdinaryPlacementInteraction) {
        return;
      }
      clearSelectedCatalogItem();
      workspaceEditingControls.cancelPendingDuplicateSelection();
      setSelectedPlacementKeys([]);
    },
    [clearSelectedCatalogItem, setSelectedPlacementKeys, workspaceEditingControls],
  );
  const handleInteriorDecorApply = useCallback(
    (
      mapId: string,
      interiorDecorKind: InteriorDecorCatalogPattern["kind"],
      targetId: string,
      patternId: string,
    ) => {
      if (activeInteriorDecorPattern === null) {
        throw new Error(
          `Planner workspace received interior decor application for map ID ${JSON.stringify(mapId)} without an active interior decor pattern.`,
        );
      }
      if (
        activeInteriorDecorPattern.kind !== interiorDecorKind ||
        activeInteriorDecorPattern.patternId !== patternId
      ) {
        throw new Error(
          `Planner workspace interior decor application does not match the active pattern ${JSON.stringify(activeInteriorDecorPattern.id)}; received kind ${JSON.stringify(interiorDecorKind)} and pattern ID ${JSON.stringify(patternId)}.`,
        );
      }
      const interiorDecorTransition = applyPlannerWorkspaceInteriorDecor({
        mapId,
        pattern: activeInteriorDecorPattern,
        placementHistory: plannerWorkspaceState.placementHistory,
        targetId,
      });
      applyPlacementEditResult(
        interiorDecorTransition.placementHistory,
        interiorDecorTransition.selectedPlacementKeys,
      );
      setInteriorDecorRejectionNotification(null);
    },
    [activeInteriorDecorPattern, applyPlacementEditResult, plannerWorkspaceState.placementHistory],
  );
  const handleInteriorDecorRejected = useCallback(
    (mapId: string, interiorDecorKind: InteriorDecorCatalogPattern["kind"]) => {
      showInteriorDecorRejectionMessage(
        getInteriorDecorRejectionMessage(mapId, interiorDecorKind, editorLocale),
      );
    },
    [editorLocale, showInteriorDecorRejectionMessage],
  );
  const handleOrdinaryCatalogItemSelect = useCallback(
    (
      catalogItem: CatalogItem,
      presentationChoice: CatalogPresentationChoice,
    ) => {
      const interiorDecorPattern = interiorDecorPatternByCatalogItemId.get(catalogItem.id);
      if (interiorDecorPattern !== undefined) {
        const unavailableInteriorDecorMessage = getUnavailableInteriorDecorMessage(
          plannerWorkspaceState.selectedPlannerMapId,
          interiorDecorPattern.kind,
          editorLocale,
        );
        if (unavailableInteriorDecorMessage !== null) {
          showInteriorDecorRejectionMessage(unavailableInteriorDecorMessage);
          return;
        }
        handleInteriorDecorPatternSelect(interiorDecorPattern);
        return;
      }
      const sceneAvailability = getCatalogItemSceneAvailability(
        catalogItem,
        plannerWorkspaceState.selectedPlannerMapId,
      );
      cancelInteriorDecorBeforeOrdinaryWorkspaceAction({
        cancelInteriorDecor: handleCancelInteriorDecor,
        performOrdinaryWorkspaceAction: () => {
          workspaceEditingControls.cancelPendingDuplicateSelection();
          setSelectedPlacementKeys([]);
          handleCatalogItemSelect(catalogItem, presentationChoice);
          if (sceneAvailability !== "available") {
            showInteriorDecorRejectionMessage(
              getCatalogPanelCopy(locale).sceneAvailabilityReason(
                sceneAvailability,
              ),
            );
          }
        },
      });
    },
    [
      editorLocale,
      handleCancelInteriorDecor,
      handleInteriorDecorPatternSelect,
      handleCatalogItemSelect,
      locale,
      plannerWorkspaceState.selectedPlannerMapId,
      setSelectedPlacementKeys,
      showInteriorDecorRejectionMessage,
      workspaceEditingControls,
    ],
  );
  const handleOrdinaryToolChange = useCallback(
    (tool: Parameters<typeof EditorToolbar>[0]["tool"]) => {
      cancelInteriorDecorBeforeOrdinaryWorkspaceAction({
        cancelInteriorDecor: handleCancelInteriorDecor,
        performOrdinaryWorkspaceAction: () => {
          workspaceEditingControls.cancelPendingDuplicateSelection();
          handleToolChange(tool);
        },
      });
    },
    [handleCancelInteriorDecor, handleToolChange, workspaceEditingControls],
  );
  const handlePlannerMapChange = useCallback(
    (plannerMapId: string) => {
      cancelInteriorDecorBeforeOrdinaryWorkspaceAction({
        cancelInteriorDecor: handleCancelInteriorDecor,
        performOrdinaryWorkspaceAction: () =>
          workspacePersistenceControls.handleMapChange(plannerMapId),
      });
    },
    [handleCancelInteriorDecor, workspacePersistenceControls],
  );
  const localProjectActions = createPlannerLocalProjectActions({
    newProjectName,
    season: plannerWorkspaceState.season,
    workspaceController,
  });
  const plannerCanvasInteractionProperties = getPlannerCanvasInteractionProperties({
    hasPendingPlacementCopy:
      workspaceEditingControls.hasPendingPlacementCopy,
    hasSelectedPlacements:
      plannerWorkspaceState.selectedPlacementKeys.length > 0,
    tool: plannerWorkspaceState.tool,
    wheelZoomEnabled,
  });
  return (
    <>
      <EditorMenuBar
        locale={editorLocale}
        activeModalId={plannerWorkspaceState.modalId}
        leftHandMode={plannerWorkspaceState.behaviorOptions.leftHandMode}
        mapDisplayName={readVisiblePlannerMenuMapLabel(
          plannerWorkspaceState.selectedPlannerMapId,
          editorLocale,
        )}
        onCycleSeason={() =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            type: "cycle-season",
          })
        }
        onOpenModal={(modalId) => dispatchPlannerWorkspaceAction(
          plannerWorkspaceState.modalId === modalId ? { type: "close-modal" } : { modalId, type: "open-modal" },
        )}
        season={plannerWorkspaceState.season}
      />
      <EditorToolbar
        locale={editorLocale}
        canRedo={plannerWorkspaceState.placementHistory.redoStates.length > 0}
        canUndo={plannerWorkspaceState.placementHistory.undoStates.length > 0}
        isToolDisabled={(tool) =>
          isPlannerWorkspaceToolDisabled(
            tool,
            selectedCatalogItem?.catalogItem ?? null,
          )
        }
        onWheelZoomToggle={handleZoomControlClick}
        onRedo={() =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            type: "redo-placement-history",
          })
        }
        onToolChange={handleOrdinaryToolChange}
        onUndo={() =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            type: "undo-placement-history",
          })
        }
        tool={plannerWorkspaceState.tool}
        wheelZoomEnabled={wheelZoomEnabled}
      />
      <ItemCatalogPanel
        catalogPresentationChoicesByItemId={catalogPresentationChoicesByItemId}
        category={plannerWorkspaceState.catalogCategory}
        locale={locale}
        mapId={plannerWorkspaceState.selectedPlannerMapId}
        leftHandMode={plannerWorkspaceState.behaviorOptions.leftHandMode}
        onCatalogItemSelect={handleOrdinaryCatalogItemSelect}
        onCategoryChange={(catalogCategory) =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            catalogCategory,
            type: "select-catalog-category",
          })
        }
        onOpenModal={(modalId) =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            modalId,
            type: "open-modal",
          })
        }
        onReadyCatalogItems={handleReadyCatalogItems}
        onSearchQueryChange={setSearchQuery}
        panelPosition={plannerWorkspaceState.panelPosition}
        searchQuery={searchQuery}
        selectedCatalogItemId={plannerWorkspaceState.selectedCatalogItemId}
        shouldLoadThumbnails={runtimeStatus === "interactive"}
      />
      {interiorDecorRejectionNotification === null ? null : (
        <p aria-live="polite" role="status" className="planner-workspace__toast">
          <span aria-hidden="true">!</span>
          {interiorDecorRejectionNotification.message}
        </p>
      )}
      {workspacePersistenceControls.automaticSaveErrorMessage === null ? null : (
        <p aria-live="assertive" role="alert" className="planner-workspace__toast">
          {saveModalCopy.localProjects.actionFailure(
            workspacePersistenceControls.automaticSaveErrorMessage,
          )}
        </p>
      )}
      <PlannerRequiredCatalogGate locale={locale} state={requiredPlacementCatalogGate}>
        <PlannerCanvas
          ambienceOptions={plannerAmbienceOptions}
          locale={editorLocale}
          gameCursors={plannerWorkspaceState.behaviorOptions.gameCursors}
          onCancelEditingInteraction={workspaceEditingControls.cancelEditingInteraction}
          activeInteriorDecorPattern={activeInteriorDecorPattern}
          cameraStateRetention={cameraStateRetention}
          catalogItems={readyCatalogItems}
          displayOptions={plannerWorkspaceState.displayOptions}
          isXRayActive={isXRayActive}
          wheelZoomEnabled={plannerCanvasInteractionProperties.wheelZoomEnabled}
          isResourceGenerationCurrent={(resourceGeneration) =>
            resourceGeneration === preparedWorkspace.resourceGeneration
          }
          leftHandMode={plannerWorkspaceState.behaviorOptions.leftHandMode}
          mapId={plannerWorkspaceState.selectedPlannerMapId}
          onCanvasError={handleCanvasError}
          onCopyCleanMapImage={handleCopyCleanMapImage}
          onCanvasReady={handleCanvasReady}
          onInteractive={handleCanvasInteractive}
          onMapPlacementGridReady={handleMapPlacementGridReady}
          onMapImageExporterReady={workspacePersistenceControls.handleMapImageExporterReady}
          onMapTileClick={workspaceEditingControls.handleMapTileClick}
          onMapTileRectangle={workspaceEditingControls.handleMapTileRectangle}
          getPlacementCopyPreviewAtTile={
            workspaceEditingControls.getPlacementCopyPreviewAtTile
          }
          getFillRectanglePreviewAtTiles={
            workspaceEditingControls.getFillRectanglePreviewAtTiles
          }
          getErasePreviewAtTile={workspaceEditingControls.getErasePreviewAtTile}
          getEraseRectanglePreviewAtTiles={
            workspaceEditingControls.getEraseRectanglePreviewAtTiles
          }
          onPlacementSelectionClick={workspaceEditingControls.onPlacementSelectionClick}
          onMoveSelectedPlacements={workspaceEditingControls.handleMoveSelectedPlacements}
          onNudgeSelectedPlacements={workspaceEditingControls.handleNudgeSelectedPlacements}
          onInteriorDecorApply={handleInteriorDecorApply}
          onInteriorDecorRejected={handleInteriorDecorRejected}
          performanceMarker={performanceMarker}
          placementPreview={placementPreview}
          placementSnapshot={plannerWorkspaceState.placementHistory.currentState}
          pointerInteractionMode={
            plannerCanvasInteractionProperties.pointerInteractionMode
          }
          shortRectangleClickBehavior={
            plannerWorkspaceState.tool === "fill" ? "rectangle" : "single-tile"
          }
          preparedCanvasResources={preparedWorkspace.canvasResources}
          season={plannerWorkspaceState.season}
          selectedPlacementKeys={plannerWorkspaceState.selectedPlacementKeys}
          showJoystick={plannerWorkspaceState.behaviorOptions.showJoystick}
          showResourceClumpSpawnLocations={
            plannerWorkspaceState.behaviorOptions.autoShowResourceClumps
          }
        />
        {plannerWorkspaceState.selectedPlacementKeys.length > 0 ? (
          workspaceEditingControls.selectionInspector
        ) : (
          <CatalogPlacementControls
            catalogItem={selectedCatalogItem?.catalogItem ?? null}
            presentationChoice={selectedCatalogItem?.presentationChoice ?? null}
            placementMode={getCatalogPlacementMode(plannerWorkspaceState.tool)}
            locale={locale}
            onCancel={clearSelectedCatalogItem}
            onCyclePendingChoice={cyclePendingCatalogChoice}
          />
        )}
      </PlannerRequiredCatalogGate>
      <EditorModal
        locale={editorLocale}
        season={plannerWorkspaceState.season}
        ambienceOptions={plannerAmbienceOptions}
        onAmbienceChange={setPlannerAmbienceOptions}
        onSeasonChange={(season) => {
          dispatchPlannerWorkspaceAction({ type: "select-season", season });
          dispatchPlannerWorkspaceAction({ type: "open-modal", modalId: "ambience-panel" });
        }}
        behaviorOptions={plannerWorkspaceState.behaviorOptions}
        copy={editorModalCopy}
        displayOptions={plannerWorkspaceState.displayOptions}
        mapRenderOptions={plannerWorkspaceState.mapRenderOptions}
        modalId={plannerWorkspaceState.modalId}
        onBehaviorOptionChange={(option, value) =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            option,
            type: "set-behavior-option",
            value,
          })
        }
        onClose={() =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            type: "close-modal",
          })
        }
        onDisplayOptionToggle={(option) =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            option,
            type: "toggle-display-option",
          })
        }
        onMapChange={handlePlannerMapChange}
        onMapRenderOptionsChange={(mapRenderOptions) =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            mapRenderOptions,
            type: "set-map-render-options",
          })
        }
        onPanelPositionChange={(panelPosition) =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            panelPosition,
            type: "select-panel-position",
          })
        }
        panelPosition={plannerWorkspaceState.panelPosition}
        projectMapPanelContent={createProjectMapPanelContent({
          activeProject: workspaceState.activeProject,
          cancelInteriorDecor: handleCancelInteriorDecor,
          locale: editorLocale,
          projectSummaries: workspaceState.projectSummaries,
          season: plannerWorkspaceState.season,
          workspaceController,
        })}
        savePanelContent={
          <PlannerSaveModalLoader
            catalogItems={readyCatalogItems}
            copy={saveModalCopy}
            locale={editorLocale}
            currentProjectId={workspaceState.activeProject?.id ?? null}
            currentProjectMapInstanceCount={
              workspaceState.activeProject?.project.maps.length ?? null
            }
            currentProjectMapInstanceName={readVisibleCurrentProjectMapInstanceName(
              workspaceState.activeSession,
              editorLocale,
            )}
            currentProjectName={workspaceState.activeProject?.title ?? null}
            mapDisplayName={
              getPlannerMapById(plannerWorkspaceState.selectedPlannerMapId).displayName
            }
            mapFile={getPlannerMapById(plannerWorkspaceState.selectedPlannerMapId).mapFile}
            onCaptureScreenshot={workspacePersistenceControls.captureScreenshot}
            onImportGameSave={(importedGameSaveState) =>
              openImportedGameSaveAndPreserveResult({
                dispatchPlannerWorkspaceAction,
                importedGameSaveState,
                onImportedGameSaveResult,
                workspaceController,
              })
            }
            onSaveThumbnail={workspacePersistenceControls.saveThumbnail}
            placementSnapshot={plannerWorkspaceState.placementHistory.currentState}
            folders={workspaceState.folders}
            projects={workspaceState.projectSummaries}
            season={plannerWorkspaceState.season}
            selectedPlannerMapId={plannerWorkspaceState.selectedPlannerMapId}
            storageErrorMessage={null}
            storageStatus="ready"
            workspaceController={workspaceController}
            {...localProjectActions}
            onCreateProject={() => createLocalProjectAndSaveCurrentMap({
              createProjectWithCurrentMap:
                workspacePersistenceControls.createProjectWithCurrentMap,
            })}
          />
        }
        selectedMapId={plannerWorkspaceState.selectedPlannerMapId}
      />
    </>
  );
}

function createProjectMapPanelContent({
  activeProject,
  cancelInteriorDecor,
  locale,
  projectSummaries,
  season,
  workspaceController,
}: Readonly<{
  activeProject: ReturnType<typeof useReferenceProjectWorkspace>["workspaceState"]["activeProject"];
  cancelInteriorDecor: () => void;
  locale: "en" | "zh" | "ru";
  projectSummaries: ReturnType<typeof useReferenceProjectWorkspace>["workspaceState"]["projectSummaries"];
  season: PlannerWorkspaceStateController["plannerWorkspaceState"]["season"];
  workspaceController: ReturnType<typeof useReferenceProjectWorkspace>["workspaceController"];
}>): ReactNode {
  if (activeProject === null) return null;

  const destinationProjectSummaries = projectSummaries.filter(
    (projectSummary) => projectSummary.id !== activeProject.id,
  );
  const projectMapActions = createPlannerProjectMapActions({
    activeProjectId: activeProject.id,
    season,
    workspaceController,
  });
  const handleOpenMapInstance = (mapInstanceId: string): void => {
    cancelInteriorDecorBeforeOrdinaryWorkspaceAction({
      cancelInteriorDecor,
      performOrdinaryWorkspaceAction: () =>
        projectMapActions.onOpenMapInstance(mapInstanceId),
    });
  };

  return (
    <ProjectMapInstancePanel
      activeMapInstanceId={activeProject.project.activeMapId}
      locale={locale}
      mapChoices={plannerMaps}
      mapInstances={activeProject.project.maps}
      projectChoices={destinationProjectSummaries}
      {...projectMapActions}
      onOpenMapInstance={handleOpenMapInstance}
    />
  );
}

function usePreparedWorkspaceInitialization({
  dispatchPlannerWorkspaceAction,
  loadBuildingMetadata,
  locale,
  preparedWorkspace,
  selectedPlannerMapId,
}: Readonly<{
  dispatchPlannerWorkspaceAction: PlannerWorkspaceStateController["dispatchPlannerWorkspaceAction"];
  loadBuildingMetadata: () => Promise<BuildingPlacementMetadataById>;
  locale: HomepageLocale;
  preparedWorkspace: PreparedPlannerWorkspace;
  selectedPlannerMapId: string;
}>) {
  const mapPlacementGridReference = useRef<CurrentMapPlacementGrid | null>(null);
  const preparedPreferencesGenerationReference = useRef<number | null>(null);
  const canvasInteractiveGenerationReference = useRef<number | null>(null);
  const [buildingMetadataById, setBuildingMetadataById] =
    useState<BuildingPlacementMetadataById | null>(null);

  useEffect(() => {
    if (
      preparedPreferencesGenerationReference.current ===
      preparedWorkspace.resourceGeneration
    ) {
      return;
    }
    preparedPreferencesGenerationReference.current = preparedWorkspace.resourceGeneration;
    dispatchPlannerWorkspaceAction({
      preferences: preparedWorkspace.preferences,
      type: "restore-prepared-preferences",
    });
  }, [dispatchPlannerWorkspaceAction, preparedWorkspace]);

  useEffect(() => {
    let hasDisposed = false;

    async function loadRequiredBuildingMetadata(): Promise<void> {
      try {
        const nextBuildingMetadataById = await loadBuildingMetadata();
        if (!hasDisposed) {
          setBuildingMetadataById(nextBuildingMetadataById);
        }
      } catch (caughtError) {
        if (hasDisposed) {
          return;
        }
        dispatchPlannerWorkspaceAction({
          message: getPlannerWorkspaceErrorMessage(caughtError, locale),
          resourceGeneration: preparedWorkspace.resourceGeneration,
          type: "complete-runtime-error",
        });
      }
    }

    void loadRequiredBuildingMetadata();

    return () => {
      hasDisposed = true;
    };
  }, [
    loadBuildingMetadata,
    dispatchPlannerWorkspaceAction,
    locale,
    preparedWorkspace.resourceGeneration,
  ]);

  useEffect(() => {
    if (
      buildingMetadataById === null ||
      canvasInteractiveGenerationReference.current !==
        preparedWorkspace.resourceGeneration
    ) {
      return;
    }
    dispatchPlannerWorkspaceAction({
      resourceGeneration: preparedWorkspace.resourceGeneration,
      type: "complete-runtime-interactive",
    });
  }, [
    buildingMetadataById,
    dispatchPlannerWorkspaceAction,
    preparedWorkspace.resourceGeneration,
  ]);

  const getCurrentMapPlacementGrid = useCallback(
    (requestedMapId: string): MapPlacementGrid | null => {
      const currentMapPlacementGrid = mapPlacementGridReference.current;
      if (
        currentMapPlacementGrid === null ||
        currentMapPlacementGrid.mapId !== requestedMapId
      ) {
        return null;
      }
      return currentMapPlacementGrid.mapPlacementGrid;
    },
    [],
  );
  const getRequiredCurrentMapPlacementGrid = useCallback(
    (requestedMapId: string): MapPlacementGrid => {
      const currentMapPlacementGrid =
        getCurrentMapPlacementGrid(requestedMapId);
      if (currentMapPlacementGrid === null) {
        throw new Error(
          `Planner workspace map placement grid is unavailable for requested map ID ${JSON.stringify(requestedMapId)}.`,
        );
      }
      return currentMapPlacementGrid;
    },
    [getCurrentMapPlacementGrid],
  );
  const handleCanvasReady = useCallback(() => {
    dispatchPlannerWorkspaceAction({
      resourceGeneration: preparedWorkspace.resourceGeneration,
      type: "complete-runtime-ready",
    });
  }, [dispatchPlannerWorkspaceAction, preparedWorkspace.resourceGeneration]);
  const handleCanvasError = useCallback(
    (message: string) => {
      dispatchPlannerWorkspaceAction({
        message: readPlannerCanvasErrorMessage(message, locale),
        resourceGeneration: preparedWorkspace.resourceGeneration,
        type: "complete-runtime-error",
      });
    },
    [dispatchPlannerWorkspaceAction, locale, preparedWorkspace.resourceGeneration],
  );
  const handleCanvasInteractive = useCallback(() => {
    canvasInteractiveGenerationReference.current = preparedWorkspace.resourceGeneration;
    if (buildingMetadataById !== null) {
      dispatchPlannerWorkspaceAction({
        resourceGeneration: preparedWorkspace.resourceGeneration,
        type: "complete-runtime-interactive",
      });
    }
  }, [
    buildingMetadataById,
    dispatchPlannerWorkspaceAction,
    preparedWorkspace.resourceGeneration,
  ]);
  const handleMapPlacementGridReady = useCallback(
    (mapId: string, mapPlacementGrid: MapPlacementGrid) => {
      if (mapId === selectedPlannerMapId) {
        mapPlacementGridReference.current = { mapId, mapPlacementGrid };
      }
    },
    [selectedPlannerMapId],
  );

  return {
    buildingMetadataById,
    getCurrentMapPlacementGrid,
    getRequiredCurrentMapPlacementGrid,
    handleCanvasError,
    handleCanvasInteractive,
    handleCanvasReady,
    handleMapPlacementGridReady,
  };
}

function useWorkspaceCatalogControls(
  dispatchPlannerWorkspaceAction: PlannerWorkspaceStateController["dispatchPlannerWorkspaceAction"],
  preparedWorkspace: PreparedPlannerWorkspace,
  currentTool: EditorTool | null,
) {
  const preparedBuildingsCatalogItems =
    preparedWorkspace.buildingsCatalog.items;
  const [catalogChoiceState, setCatalogChoiceState] = useState(
    createInitialWorkspaceCatalogChoiceState,
  );
  const [readyCatalogItems, setReadyCatalogItems] = useState<
    readonly CatalogItem[]
  >(preparedBuildingsCatalogItems);
  const [searchQuery, setSearchQuery] = useState("");
  const preparedBuildingsCatalogGenerationReference = useRef(
    preparedWorkspace.resourceGeneration,
  );
  useEffect(() => {
    if (
      preparedBuildingsCatalogGenerationReference.current ===
      preparedWorkspace.resourceGeneration
    ) {
      return;
    }
    preparedBuildingsCatalogGenerationReference.current =
      preparedWorkspace.resourceGeneration;
    setReadyCatalogItems((currentCatalogItems) =>
      mergeReadyCatalogItems(
        currentCatalogItems,
        preparedWorkspace.buildingsCatalog.items,
      ),
    );
  }, [
    preparedWorkspace.buildingsCatalog.items,
    preparedWorkspace.resourceGeneration,
  ]);
  const advanceSelectedCatalogPlacementAttempt = useCallback(() => {
    setCatalogChoiceState(advanceWorkspaceCatalogPlacementAttempt);
  }, []);
  const handleCatalogItemSelect = useCallback(
    (
      catalogItem: CatalogItem,
      presentationChoice: CatalogPresentationChoice,
    ) => {
      const catalogItemSelectionTool =
        getPlannerWorkspaceCatalogItemSelectionTool(currentTool, catalogItem);

      setCatalogChoiceState((currentCatalogChoiceState) =>
        selectWorkspaceCatalogItem(
          changeWorkspaceCatalogItemChoice(
            currentCatalogChoiceState,
            catalogItem,
            presentationChoice,
          ),
          catalogItem,
        ),
      );
      setReadyCatalogItems((currentCatalogItems) =>
        mergeReadyCatalogItem(currentCatalogItems, catalogItem),
      );
      dispatchPlannerWorkspaceAction({
        catalogItemId: catalogItem.id,
        type: "set-selected-catalog-item",
      });
      dispatchPlannerWorkspaceAction({
        tool: catalogItemSelectionTool,
        type: "select-tool",
      });
    },
    [currentTool, dispatchPlannerWorkspaceAction],
  );
  const clearSelectedCatalogItem = useCallback(() => {
    setCatalogChoiceState(clearWorkspaceCatalogSelection);
    dispatchPlannerWorkspaceAction({
      catalogItemId: null,
      type: "set-selected-catalog-item",
    });
  }, [dispatchPlannerWorkspaceAction]);
  const handleReadyCatalogItems = useCallback(
    (catalogItems: readonly CatalogItem[]) => {
      setReadyCatalogItems((currentCatalogItems) =>
        mergeReadyCatalogItems(currentCatalogItems, catalogItems),
      );
    },
    [],
  );
  const handleToolChange = useCallback(
    (tool: Parameters<typeof EditorToolbar>[0]["tool"]) => {
      const currentCatalogItem =
        catalogChoiceState.selectedCatalogItem?.catalogItem ?? null;
      if (
        tool !== null &&
        isPlannerWorkspaceToolDisabled(tool, currentCatalogItem)
      ) {
        return;
      }
      const toolSelection = getPlannerWorkspaceToolSelection(
        tool,
        currentCatalogItem,
      );
      if (toolSelection.selectedCatalogItem === null) {
        setCatalogChoiceState(clearWorkspaceCatalogSelection);
      }
      dispatchPlannerWorkspaceAction({
        catalogItemId: toolSelection.selectedCatalogItemId,
        type: "set-selected-catalog-item",
      });
      dispatchPlannerWorkspaceAction({
        tool,
        type: "select-tool",
      });
    },
    [catalogChoiceState.selectedCatalogItem, dispatchPlannerWorkspaceAction],
  );
  const cyclePendingCatalogChoice = useCallback(() => {
    const pendingCatalogChoiceTransition =
      cyclePendingWorkspaceCatalogChoice(catalogChoiceState);
    if (!pendingCatalogChoiceTransition.changed) {
      return false;
    }
    setCatalogChoiceState(pendingCatalogChoiceTransition.state);
    return true;
  }, [catalogChoiceState]);

  return {
    advanceSelectedCatalogPlacementAttempt,
    catalogPresentationChoicesByItemId:
      catalogChoiceState.presentationChoicesByItemId,
    clearSelectedCatalogItem,
    cyclePendingCatalogChoice,
    handleCatalogItemSelect,
    handleReadyCatalogItems,
    handleToolChange,
    readyCatalogItems,
    searchQuery,
    selectedCatalogItem: catalogChoiceState.selectedCatalogItem,
    setSearchQuery,
  };
}

function useWorkspaceEditingControls({
  activeInteriorDecorPattern,
  advanceSelectedCatalogPlacementAttempt,
  applyPlacementEditResult,
  buildingMetadataById,
  clearSelectedCatalogItem,
  getCurrentMapPlacementGrid,
  getRequiredCurrentMapPlacementGrid,
  isRequiredPlacementCatalogReady,
  locale,
  plannerWorkspaceState,
  readyCatalogItems,
  selectedCatalogItem,
  setSelectedPlacementKeys,
  onPendingCatalogChoiceCycle,
  onDismissInteriorDecor,
  onToolChange,
}: Readonly<{
  activeInteriorDecorPattern: InteriorDecorCatalogPattern | null;
  advanceSelectedCatalogPlacementAttempt: () => void;
  locale: HomepageLocale;
  applyPlacementEditResult: PlannerWorkspaceStateController["applyPlacementEditResult"];
  buildingMetadataById: BuildingPlacementMetadataById | null;
  clearSelectedCatalogItem: () => void;
  getCurrentMapPlacementGrid: (
    requestedMapId: string,
  ) => MapPlacementGrid | null;
  getRequiredCurrentMapPlacementGrid: (requestedMapId: string) => MapPlacementGrid;
  isRequiredPlacementCatalogReady: boolean;
  plannerWorkspaceState: PlannerWorkspaceStateController["plannerWorkspaceState"];
  readyCatalogItems: readonly CatalogItem[];
  selectedCatalogItem: WorkspaceSelectedCatalogItem | null;
  setSelectedPlacementKeys: PlannerWorkspaceStateController["setSelectedPlacementKeys"];
  onPendingCatalogChoiceCycle: () => boolean;
  onDismissInteriorDecor: () => void;
  onToolChange: (tool: NonNullable<Parameters<typeof EditorToolbar>[0]["tool"]>) => void;
}>) {
  const [pendingDuplicateSelectionKeys, setPendingDuplicateSelectionKeys] =
    useState<readonly PlacementSelectionKey[] | null>(null);
  const applyEditingTransition = useCallback(
    (
      placementHistory: PlacementHistory<PlacementSnapshot>,
      selectedPlacementKeys: readonly PlacementSelectionKey[],
    ) => {
      applyPlacementEditResult(placementHistory, selectedPlacementKeys);
    },
    [applyPlacementEditResult],
  );
  const handleMapTileClick = useCallback(
    (mapId: string, cursorTile: { x: number; y: number }) => {
      processPlannerWorkspaceMapTileClick({
        advanceSelectedCatalogPlacementAttempt,
        applyEditingTransition,
        buildingMetadataById,
        clearPendingDuplicateSelection: () =>
          setPendingDuplicateSelectionKeys(null),
        cursorTile,
        freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
        getRequiredCurrentMapPlacementGrid,
        mapId,
        pendingDuplicateSelectionKeys,
        placementHistory: plannerWorkspaceState.placementHistory,
        readyCatalogItems,
        selectedCatalogItem,
        tool: plannerWorkspaceState.tool,
        selectedPlacementKeys: plannerWorkspaceState.selectedPlacementKeys,
      });
    },
    [
      applyEditingTransition,
      advanceSelectedCatalogPlacementAttempt,
      buildingMetadataById,
      getRequiredCurrentMapPlacementGrid,
      pendingDuplicateSelectionKeys,
      plannerWorkspaceState,
      selectedCatalogItem,
    ],
  );
  const handlePlacementSelectionClick = useCallback(
    (
      mapId: string,
      placementSelectionKeys: readonly PlacementSelectionKey[],
    ) => {
      if (mapId !== plannerWorkspaceState.selectedPlannerMapId) {
        throw new Error(
          `Planner workspace placement selection map ID ${JSON.stringify(mapId)} does not match the selected map ID ${JSON.stringify(plannerWorkspaceState.selectedPlannerMapId)}.`,
        );
      }
      const editingTransition = applyPlannerWorkspacePlacementSelection({
        placementHistory: plannerWorkspaceState.placementHistory,
        placementSelectionKeys,
        selectedPlacementKeys: plannerWorkspaceState.selectedPlacementKeys,
        toggleSelection: plannerWorkspaceState.tool === "multi-select",
      });
      applyEditingTransition(
        editingTransition.placementHistory,
        editingTransition.selectedPlacementKeys,
      );
    },
    [
      applyEditingTransition,
      plannerWorkspaceState.placementHistory,
      plannerWorkspaceState.selectedPlannerMapId,
      plannerWorkspaceState.selectedPlacementKeys,
      plannerWorkspaceState.tool,
    ],
  );
  const handleMapTileRectangle = useCallback(
    (
      mapId: string,
      firstTile: { x: number; y: number },
      secondTile: { x: number; y: number },
    ) => {
      if (buildingMetadataById === null) {
        throw new Error(
          `Planner workspace building placement metadata is unavailable for requested map ID ${JSON.stringify(mapId)}.`,
        );
      }
      const editingTransition = applyPlannerWorkspaceMapTileRectangle({
        buildingMetadataById,
        catalogPresentationChoice:
          selectedCatalogItem?.presentationChoice ?? null,
        firstTile,
        freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
        mapPlacementGrid: getRequiredCurrentMapPlacementGrid(mapId),
        placementHistory: plannerWorkspaceState.placementHistory,
        secondTile,
        selectedCatalogItem: selectedCatalogItem?.catalogItem ?? null,
        selectedPlacementKeys: plannerWorkspaceState.selectedPlacementKeys,
        tool: plannerWorkspaceState.tool,
      });
      applyEditingTransition(
        editingTransition.placementHistory,
        editingTransition.selectedPlacementKeys,
      );
    },
    [
      applyEditingTransition,
      buildingMetadataById,
      getRequiredCurrentMapPlacementGrid,
      plannerWorkspaceState,
      selectedCatalogItem,
    ],
  );
  const getPlacementCopyPreviewAtTile = useCallback<
    NonNullable<PlannerCanvasProperties["getPlacementCopyPreviewAtTile"]>
  >(
    (cursorTile) => {
      if (
        pendingDuplicateSelectionKeys === null ||
        buildingMetadataById === null
      ) {
        return null;
      }
      return previewPlannerWorkspaceSelectionAtTile({
        buildingMetadataById,
        catalogItems: readyCatalogItems,
        cursorTile,
        freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
        mapPlacementGrid: getRequiredCurrentMapPlacementGrid(
          plannerWorkspaceState.selectedPlannerMapId,
        ),
        placementHistory: plannerWorkspaceState.placementHistory,
        selectedPlacementKeys: pendingDuplicateSelectionKeys,
      });
    },
    [
      buildingMetadataById,
      getRequiredCurrentMapPlacementGrid,
      pendingDuplicateSelectionKeys,
      plannerWorkspaceState,
      readyCatalogItems,
    ],
  );
  const getFillRectanglePreviewAtTiles = useCallback<
    NonNullable<PlannerCanvasProperties["getFillRectanglePreviewAtTiles"]>
  >(
    (firstTile, secondTile) => {
      if (
        plannerWorkspaceState.tool !== "fill" ||
        buildingMetadataById === null ||
        selectedCatalogItem === null
      ) {
        return null;
      }
      return previewPlannerWorkspaceFillRectangle({
        buildingMetadataById,
        catalogPresentationChoice: selectedCatalogItem.presentationChoice,
        firstTile,
        freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
        mapPlacementGrid: getRequiredCurrentMapPlacementGrid(
          plannerWorkspaceState.selectedPlannerMapId,
        ),
        placementHistory: plannerWorkspaceState.placementHistory,
        secondTile,
        selectedCatalogItem: selectedCatalogItem.catalogItem,
        selectedPlacementKeys: plannerWorkspaceState.selectedPlacementKeys,
        tool: "fill",
      });
    },
    [
      buildingMetadataById,
      getRequiredCurrentMapPlacementGrid,
      plannerWorkspaceState,
      selectedCatalogItem,
    ],
  );
  const getErasePreviewAtTile = useCallback<
    NonNullable<PlannerCanvasProperties["getErasePreviewAtTile"]>
  >(
    (cursorTile) => {
      const erasePreviewInput = createWorkspaceErasePreviewAtTileInput({
        buildingMetadataById,
        currentMapPlacementGrid: getCurrentMapPlacementGrid(
          plannerWorkspaceState.selectedPlannerMapId,
        ),
        cursorTile,
        placementHistory: plannerWorkspaceState.placementHistory,
        tool: plannerWorkspaceState.tool,
      });
      return erasePreviewInput === null
        ? null
        : previewPlannerWorkspaceEraseAtTile(erasePreviewInput);
    },
    [
      buildingMetadataById,
      getCurrentMapPlacementGrid,
      plannerWorkspaceState.placementHistory,
      plannerWorkspaceState.selectedPlannerMapId,
      plannerWorkspaceState.tool,
    ],
  );
  const getEraseRectanglePreviewAtTiles = useCallback<
    NonNullable<PlannerCanvasProperties["getEraseRectanglePreviewAtTiles"]>
  >(
    (firstTile, secondTile) => {
      const eraseRectanglePreviewInput =
        createWorkspaceEraseRectanglePreviewInput({
          buildingMetadataById,
          currentMapPlacementGrid: getCurrentMapPlacementGrid(
            plannerWorkspaceState.selectedPlannerMapId,
          ),
          firstTile,
          placementHistory: plannerWorkspaceState.placementHistory,
          secondTile,
          tool: plannerWorkspaceState.tool,
        });
      return eraseRectanglePreviewInput === null
        ? null
        : previewPlannerWorkspaceEraseRectangle(eraseRectanglePreviewInput);
    },
    [
      buildingMetadataById,
      getCurrentMapPlacementGrid,
      plannerWorkspaceState.placementHistory,
      plannerWorkspaceState.selectedPlannerMapId,
      plannerWorkspaceState.tool,
    ],
  );
  const handleNudgeSelectedPlacements = useCallback(
    (direction: "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp") => {
      if (buildingMetadataById === null) {
        throw new Error(
          `Planner workspace building placement metadata is unavailable for selected map ID ${JSON.stringify(plannerWorkspaceState.selectedPlannerMapId)}.`,
        );
      }
      const editingTransition = movePlannerWorkspaceSelection({
        buildingMetadataById,
        catalogItems: readyCatalogItems,
        freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
        mapPlacementGrid: getRequiredCurrentMapPlacementGrid(
          plannerWorkspaceState.selectedPlannerMapId,
        ),
        placementHistory: plannerWorkspaceState.placementHistory,
        selectedPlacementKeys: plannerWorkspaceState.selectedPlacementKeys,
        tileDelta: getPlannerWorkspaceNudgeDelta(direction),
      });
      applyEditingTransition(
        editingTransition.placementHistory,
        editingTransition.selectedPlacementKeys,
      );
    },
    [
      applyEditingTransition,
      buildingMetadataById,
      getRequiredCurrentMapPlacementGrid,
      plannerWorkspaceState,
    ],
  );
  const handleMoveSelectedPlacements = useCallback(
    (tileDelta: Readonly<{ x: number; y: number }>) => {
      if (buildingMetadataById === null) {
        throw new Error(
          `Planner workspace building placement metadata is unavailable for selected map ID ${JSON.stringify(plannerWorkspaceState.selectedPlannerMapId)}.`,
        );
      }
      const editingTransition = movePlannerWorkspaceSelection({
        buildingMetadataById,
        catalogItems: readyCatalogItems,
        freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
        mapPlacementGrid: getRequiredCurrentMapPlacementGrid(
          plannerWorkspaceState.selectedPlannerMapId,
        ),
        placementHistory: plannerWorkspaceState.placementHistory,
        selectedPlacementKeys: plannerWorkspaceState.selectedPlacementKeys,
        tileDelta,
      });
      processPlannerWorkspaceSelectionMove({
        applyEditingTransition,
        editingTransition,
        onToolChange,
        placementHistory: plannerWorkspaceState.placementHistory,
        tool: plannerWorkspaceState.tool,
      });
    },
    [
      applyEditingTransition,
      buildingMetadataById,
      getRequiredCurrentMapPlacementGrid,
      onToolChange,
      plannerWorkspaceState,
      readyCatalogItems,
    ],
  );
  const handleSelectedItemTintChange = useCallback(
    (selectedPlacementKey: PlacementSelectionKey, tintColor: string) => {
      const editingTransition = setPlannerWorkspaceSelectedItemTint({
        catalogItems: readyCatalogItems,
        placementHistory: plannerWorkspaceState.placementHistory,
        selectedPlacementKeys: [selectedPlacementKey],
        tintColor,
      });
      applyEditingTransition(
        editingTransition.placementHistory,
        editingTransition.selectedPlacementKeys,
      );
    },
    [applyEditingTransition, plannerWorkspaceState.placementHistory, readyCatalogItems],
  );
  const handleSelectedNightLightStateChange = useCallback(
    (
      selectedPlacementKey: PlacementSelectionKey,
      nightLightState: "off" | undefined,
    ) => {
      const editingTransition = setPlannerWorkspaceSelectedNightLightState({
        catalogItems: readyCatalogItems,
        nightLightState,
        placementHistory: plannerWorkspaceState.placementHistory,
        selectedPlacementKeys: [selectedPlacementKey],
      });
      applyEditingTransition(
        editingTransition.placementHistory,
        editingTransition.selectedPlacementKeys,
      );
    },
    [
      applyEditingTransition,
      plannerWorkspaceState.placementHistory,
      readyCatalogItems,
    ],
  );
  const handleSelectedBuildingPaintChange = useCallback(
    (
      selectedPlacementKey: PlacementSelectionKey,
      paintColors: BuildingPaintColors,
    ) => {
      const editingTransition = setPlannerWorkspaceSelectedBuildingPaint({
        paintColors,
        placementHistory: plannerWorkspaceState.placementHistory,
        selectedPlacementKeys: [selectedPlacementKey],
      });
      applyEditingTransition(
        editingTransition.placementHistory,
        editingTransition.selectedPlacementKeys,
      );
    },
    [applyEditingTransition, plannerWorkspaceState.placementHistory],
  );
  const handleSelectedBuildingWaterColorChange = useCallback(
    (
      selectedPlacementKey: PlacementSelectionKey,
      waterColor: number | undefined,
    ) => {
      const editingTransition = setPlannerWorkspaceSelectedBuildingWaterColor({
        catalogItems: readyCatalogItems,
        placementHistory: plannerWorkspaceState.placementHistory,
        selectedPlacementKeys: [selectedPlacementKey],
        waterColor,
      });
      applyEditingTransition(
        editingTransition.placementHistory,
        editingTransition.selectedPlacementKeys,
      );
    },
    [
      applyEditingTransition,
      plannerWorkspaceState.placementHistory,
      readyCatalogItems,
    ],
  );
  const handleDeleteSelection = useCallback(() => {
    const editingTransition = deletePlannerWorkspaceSelection({
      placementHistory: plannerWorkspaceState.placementHistory,
      selectedPlacementKeys: plannerWorkspaceState.selectedPlacementKeys,
    });
    applyEditingTransition(
      editingTransition.placementHistory,
      editingTransition.selectedPlacementKeys,
    );
  }, [applyEditingTransition, plannerWorkspaceState]);
  const handleCycleSelectedAppearance = useCallback(() => {
    performSelectedAppearanceCycleWhenCatalogReady(
      isRequiredPlacementCatalogReady,
      () => {
        if (buildingMetadataById === null) {
          throw new Error(
            `Planner workspace building placement metadata is unavailable for selected map ID ${JSON.stringify(plannerWorkspaceState.selectedPlannerMapId)}.`,
          );
        }
        const editingTransition = cyclePlannerWorkspaceSelectedAppearance({
          buildingMetadataById,
          catalogItems: readyCatalogItems,
          freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
          mapPlacementGrid: getRequiredCurrentMapPlacementGrid(
            plannerWorkspaceState.selectedPlannerMapId,
          ),
          placementHistory: plannerWorkspaceState.placementHistory,
          selectedPlacementKeys: plannerWorkspaceState.selectedPlacementKeys,
        });
        applyEditingTransition(
          editingTransition.placementHistory,
          editingTransition.selectedPlacementKeys,
        );
      },
    );
  }, [
    applyEditingTransition,
    buildingMetadataById,
    getRequiredCurrentMapPlacementGrid,
    isRequiredPlacementCatalogReady,
    plannerWorkspaceState,
    readyCatalogItems,
  ]);
  const handleCopySelection = useCallback(
    (selectedPlacementKeys: readonly PlacementSelectionKey[]) => {
      if (selectedPlacementKeys.length === 0) {
        throw new Error(
          "Planner workspace cannot start a placement copy without selected placement keys.",
        );
      }
      setPendingDuplicateSelectionKeys([...selectedPlacementKeys]);
    },
    [],
  );
  const handleDismissSelection = useCallback(() => {
    setPendingDuplicateSelectionKeys(null);
    setSelectedPlacementKeys([]);
  }, [setSelectedPlacementKeys]);
  const handleDismissEditingInteraction = useCallback(() => {
    onDismissInteriorDecor();
    setPendingDuplicateSelectionKeys(null);
    setSelectedPlacementKeys([]);
    clearSelectedCatalogItem();
  }, [clearSelectedCatalogItem, onDismissInteriorDecor, setSelectedPlacementKeys]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleKeyboardEvent = createPlannerWorkspaceEditingKeyboardHandler({
      getSelectedPlacementKeys: () =>
        plannerWorkspaceState.selectedPlacementKeys,
      hasDismissableInteraction: () =>
        plannerWorkspaceState.selectedPlacementKeys.length > 0 ||
        selectedCatalogItem !== null ||
        pendingDuplicateSelectionKeys !== null ||
        activeInteriorDecorPattern !== null,
      hasSelection: () => plannerWorkspaceState.selectedPlacementKeys.length > 0,
      hasPendingCatalogItem: () => selectedCatalogItem !== null,
      onCopy: handleCopySelection,
      onDelete: handleDeleteSelection,
      onDismiss: handleDismissEditingInteraction,
      onPendingChoiceCycle: onPendingCatalogChoiceCycle,
      onCycleSelectedAppearance: handleCycleSelectedAppearance,
      onToolChange,
    }, { isEnabled: () => plannerWorkspaceState.modalId === null });
    return attachPlannerWorkspaceEditingKeyboardListener(
      window,
      handleKeyboardEvent,
    );
  }, [
    activeInteriorDecorPattern,
    handleCopySelection,
    handleDeleteSelection,
    handleDismissEditingInteraction,
    handleCycleSelectedAppearance,
    plannerWorkspaceState.selectedPlacementKeys,
    pendingDuplicateSelectionKeys,
    onPendingCatalogChoiceCycle,
    onToolChange,
    plannerWorkspaceState.modalId,
    selectedCatalogItem,
  ]);

  const selectionInspector = isRequiredPlacementCatalogReady
    ? createSelectionInspector(
        plannerWorkspaceState.placementHistory.currentState,
        plannerWorkspaceState.selectedPlacementKeys,
        readyCatalogItems,
        locale,
        handleDeleteSelection,
        handleCycleSelectedAppearance,
        handleCopySelection,
        handleDismissSelection,
        handleSelectedItemTintChange,
        handleSelectedNightLightStateChange,
        handleSelectedBuildingPaintChange,
        handleSelectedBuildingWaterColorChange,
      )
    : null;

  return {
    cancelEditingInteraction: () => {
      const hasInteraction = plannerWorkspaceState.selectedPlacementKeys.length > 0 || selectedCatalogItem !== null || pendingDuplicateSelectionKeys !== null || activeInteriorDecorPattern !== null;
      if (hasInteraction) handleDismissEditingInteraction();
      return hasInteraction;
    },
    cancelPendingDuplicateSelection: () => setPendingDuplicateSelectionKeys(null),
    getPlacementCopyPreviewAtTile,
    getFillRectanglePreviewAtTiles,
    getErasePreviewAtTile,
    getEraseRectanglePreviewAtTiles,
    hasPendingPlacementCopy: pendingDuplicateSelectionKeys !== null,
    handleMapTileClick,
    handleMapTileRectangle,
    handleMoveSelectedPlacements,
    handleNudgeSelectedPlacements,
    onPlacementSelectionClick: handlePlacementSelectionClick,
    selectionInspector,
  };
}

export function createPlannerWorkspaceRenderState({
  locale,
  preparedWorkspace,
  plannerWorkspaceState,
  onRetry,
}: Readonly<{
  locale?: HomepageLocale;
  preparedWorkspace: PreparedPlannerWorkspace | null;
  plannerWorkspaceState: PlannerWorkspaceStateController["plannerWorkspaceState"];
  onRetry: () => void;
}>): PlannerWorkspaceRenderState {
  const runtimeState = plannerWorkspaceState.runtimeState;
  if (runtimeState.status === "error") {
    return { kind: "error", message: runtimeState.message, onRetry };
  }
  if (preparedWorkspace !== null) {
    return {
      kind: "prepared",
      preparedWorkspace,
      runtimeStatus: runtimeState.status,
    };
  }
  return {
    kind: "loading",
    message: resolvePlannerWorkspaceStartupMessage(locale),
  };
}

function resolvePlannerWorkspaceStartupMessage(
  locale: HomepageLocale | undefined,
): string {
  if (locale === undefined) {
    return "Loading local planner resources…";
  }
  return readPlannerWorkspaceStartupMessage(locale);
}

function toPlannerStartupStatusState(
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState,
  locale: HomepageLocale,
): PlannerStartupStatusState {
  if (plannerWorkspaceRenderState.kind === "loading") {
    return { kind: "loading", message: plannerWorkspaceRenderState.message } as const;
  }
  if (plannerWorkspaceRenderState.kind === "error") {
    return plannerWorkspaceRenderState;
  }
  return plannerWorkspaceRenderState.runtimeStatus === "interactive"
    ? { kind: "interactive" }
    : { kind: "loading", message: readPlannerWorkspaceStartupMessage(locale) };
}

function mergeReadyCatalogItem(
  currentCatalogItems: readonly CatalogItem[],
  selectedCatalogItem: CatalogItem,
): readonly CatalogItem[] {
  const currentCatalogItemIndex = currentCatalogItems.findIndex(
    (catalogItem) => catalogItem.id === selectedCatalogItem.id,
  );
  if (currentCatalogItemIndex === -1) {
    return [...currentCatalogItems, selectedCatalogItem];
  }
  return currentCatalogItems.map((catalogItem, catalogItemIndex) =>
    catalogItemIndex === currentCatalogItemIndex ? selectedCatalogItem : catalogItem,
  );
}

export function mergeReadyCatalogItems(
  currentCatalogItems: readonly CatalogItem[],
  nextCatalogItems: readonly CatalogItem[],
): readonly CatalogItem[] {
  return nextCatalogItems.reduce(
    (mergedCatalogItems, catalogItem) =>
      mergeReadyCatalogItem(mergedCatalogItems, catalogItem),
    currentCatalogItems,
  );
}

function getPlannerWorkspaceNudgeDelta(
  direction: "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp",
): Readonly<{ x: number; y: number }> {
  if (direction === "ArrowUp") return { x: 0, y: -1 };
  if (direction === "ArrowDown") return { x: 0, y: 1 };
  if (direction === "ArrowLeft") return { x: -1, y: 0 };
  return { x: 1, y: 0 };
}

function createSelectionInspector(
  placementSnapshot: Parameters<typeof getPlacementSelectionDetails>[0]["placementSnapshot"],
  selectedPlacementKeys: readonly PlacementSelectionKey[],
  catalogItems: readonly CatalogItem[],
  locale: HomepageLocale,
  onDelete: () => void,
  onCycleAppearance: () => void,
  onCopySelection: (
    selectedPlacementKeys: readonly PlacementSelectionKey[],
  ) => void,
  onDismiss: () => void,
  onItemTintChange: (
    selectedPlacementKey: PlacementSelectionKey,
    tintColor: string,
  ) => void,
  onNightLightStateChange: (
    selectedPlacementKey: PlacementSelectionKey,
    nightLightState: "off" | undefined,
  ) => void,
  onBuildingPaintChange: (
    selectedPlacementKey: PlacementSelectionKey,
    paintColors: BuildingPaintColors,
  ) => void,
  onBuildingWaterColorChange: (
    selectedPlacementKey: PlacementSelectionKey,
    waterColor: number | undefined,
  ) => void,
): ReactNode {
  if (selectedPlacementKeys.length === 0) {
    return null;
  }
  if (selectedPlacementKeys.length > 1) {
    return (
      <SelectionInspector
        kind="multiple"
        locale={readPlannerChromeLocale(locale)}
        onCopy={() => onCopySelection(selectedPlacementKeys)}
        onDelete={onDelete}
        onDismiss={onDismiss}
        selection={getPlacementSelectionSummary({
          placementSnapshot,
          selectedPlacementKeys,
        })}
      />
    );
  }
  const selectedPlacementKey = selectedPlacementKeys[0];
  if (selectedPlacementKey === undefined) {
    return null;
  }
  const selectionDetails = getPlacementSelectionDetails({
    catalogItems,
    placementSnapshot,
    selectedPlacementKey,
  });
  return createSingleSelectionInspector(
    selectionDetails,
    catalogItems,
    locale,
    onDelete,
    onCycleAppearance,
    onCopySelection,
    onDismiss,
    onItemTintChange,
    onNightLightStateChange,
    onBuildingPaintChange,
    onBuildingWaterColorChange,
  );
}

function createSingleSelectionInspector(
  selectionDetails: PlacementSelectionDetails,
  catalogItems: readonly CatalogItem[],
  locale: HomepageLocale,
  onDelete: () => void,
  onCycleAppearance: () => void,
  onCopySelection: (
    selectedPlacementKeys: readonly PlacementSelectionKey[],
  ) => void,
  onDismiss: () => void,
  onItemTintChange: (
    selectedPlacementKey: PlacementSelectionKey,
    tintColor: string,
  ) => void,
  onNightLightStateChange: (
    selectedPlacementKey: PlacementSelectionKey,
    nightLightState: "off" | undefined,
  ) => void,
  onBuildingPaintChange: (
    selectedPlacementKey: PlacementSelectionKey,
    paintColors: BuildingPaintColors,
  ) => void,
  onBuildingWaterColorChange: (
    selectedPlacementKey: PlacementSelectionKey,
    waterColor: number | undefined,
  ) => void,
): ReactNode {
  const inspectorLocale = readPlannerChromeLocale(locale);
  const entityName = readSelectedCatalogEntityName(
    catalogItems,
    selectionDetails.catalogItemId,
    locale,
  );
  if (selectionDetails.kind === "building") {
    if (selectionDetails.canSetWaterColor) {
      return (
        <SelectionInspector
          kind="single"
          locale={inspectorLocale}
          onBuildingWaterColorChange={(waterColor) =>
            onBuildingWaterColorChange(
              selectionDetails.selectedPlacementKey,
              waterColor,
            )
          }
          onCopy={() => onCopySelection([selectionDetails.selectedPlacementKey])}
          onDelete={onDelete}
          onDismiss={onDismiss}
          onCycleAppearance={onCycleAppearance}
          selection={{
            canCycleAppearance: selectionDetails.canCycleAppearance,
            canPaint: false,
            canSetWaterColor: true,
            entityName,
            kind: "building",
            waterColor: selectionDetails.waterColor,
          }}
        />
      );
    }
    if (selectionDetails.canPaint) {
      const paintColors = selectionDetails.paintColors;
      if (paintColors === undefined) {
        throw new Error(
          `Planner workspace paintable building selection ${JSON.stringify(selectionDetails.selectedPlacementKey)} has no paint colors.`,
        );
      }
      return (
        <SelectionInspector
          kind="single"
          locale={inspectorLocale}
          onBuildingPaintChange={(paintColors) =>
            onBuildingPaintChange(selectionDetails.selectedPlacementKey, paintColors)
          }
          onCopy={() => onCopySelection([selectionDetails.selectedPlacementKey])}
          onDelete={onDelete}
          onDismiss={onDismiss}
          onCycleAppearance={onCycleAppearance}
          selection={{
            canPaint: true,
            canCycleAppearance: false,
            entityName,
            kind: "building",
            paintColors,
          }}
        />
      );
    }
    return (
      <SelectionInspector
        kind="single"
        locale={inspectorLocale}
        onCopy={() => onCopySelection([selectionDetails.selectedPlacementKey])}
        onDelete={onDelete}
        onDismiss={onDismiss}
        onCycleAppearance={onCycleAppearance}
        selection={{
          canCycleAppearance: selectionDetails.canCycleAppearance,
          entityName,
          kind: "building",
          canPaint: false,
        }}
      />
    );
  }
  if (selectionDetails.kind === "crop") {
    return (
      <SelectionInspector
        kind="single"
        locale={inspectorLocale}
        onCopy={() => onCopySelection([selectionDetails.selectedPlacementKey])}
        onDelete={onDelete}
        onDismiss={onDismiss}
        onCycleAppearance={onCycleAppearance}
        selection={{ canCycleAppearance: false, entityName, kind: "crop" }}
      />
    );
  }
  return (
    <SelectionInspector
      kind="single"
      locale={inspectorLocale}
      onCopy={() => onCopySelection([selectionDetails.selectedPlacementKey])}
      onDelete={onDelete}
      onDismiss={onDismiss}
      onNightLightStateChange={(nightLightState) =>
        onNightLightStateChange(
          selectionDetails.selectedPlacementKey,
          nightLightState,
        )
      }
      onCycleAppearance={onCycleAppearance}
      onTintChange={(tintColor) =>
        onItemTintChange(selectionDetails.selectedPlacementKey, tintColor)
      }
      selection={{
        canCycleAppearance: selectionDetails.canCycleAppearance,
        canPaint: catalogItems.some((catalogItem) => catalogItem.id === selectionDetails.catalogItemId && catalogItem.paintableChest !== undefined),
        entityName,
        isNightLight: catalogItems.some(
          (catalogItem) => catalogItem.id === selectionDetails.catalogItemId && catalogItem.nightLight !== undefined,
        ),
        kind: "item",
        nightLightState: selectionDetails.nightLightState,
        tintColor: selectionDetails.tintColor,
      }}
    />
  );
}

function readPlannerMapCatalogId(mapId: string): (typeof plannerMaps)[number]["id"] {
  const catalogPlannerMap = plannerMaps.find(
    (candidatePlannerMap) => candidatePlannerMap.id === mapId,
  );
  if (catalogPlannerMap === undefined) {
    throw new Error(`Unknown planner map id: ${JSON.stringify(mapId)}.`);
  }
  return catalogPlannerMap.id;
}

export function readVisibleCurrentProjectMapInstanceName(
  activeSession: Readonly<{ sourceMap: { mapFile: string; label: string } }> | null,
  locale: ProjectMapLabelLocale,
): string | null {
  if (activeSession === null) {
    return null;
  }
  if (typeof activeSession !== "object") {
    throw new TypeError(
      `Active project session must be an object or null; received ${JSON.stringify(activeSession)}.`,
    );
  }
  return readVisibleProjectMapLabel(activeSession.sourceMap, locale);
}

function readVisiblePlannerMenuMapLabel(
  mapId: string,
  locale: "en" | "zh" | "ru",
): string {
  const plannerMap = getPlannerMapById(mapId);
  if (locale === "en" || locale === "zh") {
    return plannerMap.displayName;
  }
  if (locale === "ru") {
    return getRussianPlannerMapDisplayName(readPlannerMapCatalogId(plannerMap.id));
  }
  throw new Error(
    `Unsupported planner locale. Received: ${JSON.stringify(locale)}.`,
  );
}

function readSelectedCatalogEntityName(
  catalogItems: readonly CatalogItem[],
  catalogItemId: string,
  locale: HomepageLocale,
): string {
  const catalogItem = catalogItems.find(
    (candidateCatalogItem) => candidateCatalogItem.id === catalogItemId,
  );
  if (catalogItem === undefined) {
    return catalogItemId;
  }
  if (locale === "en" || locale === "zh-CN") {
    return catalogItem.name;
  }
  if (locale === "ru") {
    return getRussianCatalogItemDisplayName(catalogItem.id);
  }
  throw new Error(
    `Unsupported planner locale. Received: ${JSON.stringify(locale)}.`,
  );
}

function getPlannerWorkspaceErrorMessage(
  caughtError: unknown,
  locale: HomepageLocale,
): string {
  if (locale !== "en" && locale !== "zh-CN" && locale !== "ru") {
    throw new Error(
      `Unsupported planner locale. Received: ${JSON.stringify(locale)}.`,
    );
  }
  const diagnosticDetail = caughtError instanceof Error
    ? caughtError.message
    : String(caughtError);
  if (locale === "ru") {
    return `Не удалось подготовить планировщик. Причина: ${diagnosticDetail}`;
  }
  return diagnosticDetail;
}

function readPlannerCanvasErrorMessage(
  message: string,
  locale: HomepageLocale,
): string {
  if (typeof message !== "string") {
    throw new TypeError(
      `Planner canvas error message must be a string; received ${JSON.stringify(message)}.`,
    );
  }
  if (locale === "en" || locale === "zh-CN") {
    return message;
  }
  if (locale === "ru") {
    return `Не удалось подготовить планировщик. Причина: ${message}`;
  }
  throw new Error(
    `Unsupported planner locale. Received: ${JSON.stringify(locale)}.`,
  );
}
