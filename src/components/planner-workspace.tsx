"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  loadCatalogCategory,
  loadBuildingPlacementMetadata,
  isAutoVisibleResourceClumpCatalogItemId,
  type BuildingPlacementMetadataById,
  type CatalogItem,
  type CatalogPresentationChoice,
} from "../catalog";
import {
  getPlacementSelectionDetails,
  getPlacementSelectionSummary,
  type PlacementSelectionDetails,
  type PlacementSelectionKey,
} from "../editor/editor-selection-controller";
import { getPlannerMapById, plannerMaps } from "../maps/map-catalog";
import {
  interiorFlooringPatterns,
  interiorWallpaperPatterns,
  type InteriorDecorCatalogPattern,
} from "../interior-decor/interior-decor-catalog";
import type { MapPlacementGrid } from "../placement/map-placement-grids";
import type { PlacementHistory } from "../placement/placement-history";
import type { PlacementSnapshot } from "../placement/placement-snapshot";
import {
  applyPlannerWorkspaceMapTileClick,
  applyPlannerWorkspaceMapTileRectangle,
  applyPlannerWorkspacePlacementSelection,
  deletePlannerWorkspaceSelection,
  duplicatePlannerWorkspaceSelectionAtTile,
  getPlannerWorkspaceToolSelection,
  movePlannerWorkspaceSelection,
  cyclePlannerWorkspaceSelectedAppearance,
  setPlannerWorkspaceSelectedBuildingPaint,
  setPlannerWorkspaceSelectedBuildingWaterColor,
  setPlannerWorkspaceSelectedItemTint,
  setPlannerWorkspaceSelectedNightLightState,
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
  createPlannerLocalProjectActions,
  createPlannerProjectMapActions,
} from "../planner/planner-workspace-project-actions";
import { openImportedGameSaveAndPreserveResult } from "../planner/planner-workspace-game-save-import";
import type { ImportedGameSaveState } from "../game-save/game-save-import";
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
import { EditorToolbar } from "./editor-toolbar";
import { ItemCatalogPanel } from "./item-catalog-panel";
import { PlannerGameSaveImportResultLoader } from "./planner-game-save-import-result-loader";
import { PlannerSaveModalLoader } from "./planner-save-modal-loader";
import {
  PlannerCanvas,
  type PlannerCanvasPlacementPreviewInput,
} from "./planner-canvas";
import { PlannerRequiredCatalogGate } from "./planner-required-catalog-status";
import { useRequiredPlacementCatalog } from "./use-required-placement-catalog";
import {
  PlannerStartupStatus,
  type PlannerStartupStatusState,
} from "./planner-startup-status";
import type { EditorPerformanceMarker } from "../performance/editor-performance-marks";
import { SelectionInspector } from "./selection-inspector";
import { ProjectMapInstancePanel } from "./project-map-instance-panel";
import { usePlannerWorkspacePersistenceControls } from "./use-planner-workspace-persistence-controls";

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

export type PlannerWorkspaceProperties = Readonly<{
  startup: PlannerWorkspaceStartup;
  loadBuildingMetadata?: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory?: typeof loadCatalogCategory;
  performanceMarker?: EditorPerformanceMarker;
}>;

type PlannerWorkspaceStaticBoundaryProperties = Readonly<{
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
  plannerWorkspaceStateController?: PlannerWorkspaceStateController;
}>;

type PreparedPlannerWorkspaceContentProperties = Readonly<{
  cameraStateRetention: PlannerCameraStateRetention;
  preparedWorkspace: PreparedPlannerWorkspace;
  projectWorkspace: NonNullable<
    ReturnType<typeof useReferenceProjectWorkspaceController>
  >;
  plannerWorkspaceStateController: PlannerWorkspaceStateController;
  loadBuildingMetadata: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory: typeof loadCatalogCategory;
  onImportedGameSaveResult: (importedGameSaveState: ImportedGameSaveState) => void;
  performanceMarker?: EditorPerformanceMarker;
  runtimeStatus: "loading" | "ready" | "interactive";
}>;

type CurrentMapPlacementGrid = Readonly<{
  mapId: string;
  mapPlacementGrid: MapPlacementGrid;
}>;

type PreparedWorkspaceInitialization = Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById | null;
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
  onCatalogItemPresentationChoiceChange: (
    catalogItem: CatalogItem,
    presentationChoice: CatalogPresentationChoice,
  ) => void;
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
    (input.tool !== "cursor" && input.tool !== "zoom") ||
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

export function getPlannerCanvasInteractionProperties(
  input: Readonly<{
    hasSelectedPlacements: boolean;
    tool: EditorTool | null;
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
      input.tool === null || input.tool === "zoom"
        ? "navigate"
        : input.tool === "multi-select"
          ? "multi-select"
          : input.tool === "fill" ||
            input.tool === "erase"
          ? "rectangle"
          : input.hasSelectedPlacements
            ? "move-selected"
            : "navigate",
    wheelZoomEnabled: input.tool === "zoom",
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
    pendingDuplicateSelectionKey: PlacementSelectionKey | null;
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
  const pendingDuplicateSelectionKey = input.pendingDuplicateSelectionKey;
  const selectedPlacementKeys =
    pendingDuplicateSelectionKey === null
      ? input.selectedPlacementKeys
      : [pendingDuplicateSelectionKey];
  const editingTransition =
    pendingDuplicateSelectionKey === null
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
              selectedPlacementKeys,
              tool: input.tool,
            })
          : duplicatePlannerWorkspaceSelectionAtTile({
              buildingMetadataById: input.buildingMetadataById,
              catalogItems: input.readyCatalogItems,
              cursorTile: input.cursorTile,
              freePlacement: input.freePlacement,
              mapPlacementGrid,
              placementHistory: input.placementHistory,
              selectedPlacementKeys,
            });
  input.clearPendingDuplicateSelection();
  input.applyEditingTransition(
    editingTransition.placementHistory,
    editingTransition.selectedPlacementKeys,
  );
  if (
    pendingDuplicateSelectionKey === null
    && (input.tool === "cursor" || input.tool === "zoom")
    && input.selectedCatalogItem !== null
    && editingTransition.placementHistory !== input.placementHistory
  ) {
    input.advanceSelectedCatalogPlacementAttempt();
  }
}

const startupLoadingMessage = "Loading local planner resources…";

const interiorDecorPatternByCatalogItemId = new Map<string, InteriorDecorCatalogPattern>([
  ...interiorWallpaperPatterns,
  ...interiorFlooringPatterns,
].map((pattern) => [pattern.id, pattern]));

function ignoreImportedGameSave(_importedGameSaveState: ImportedGameSaveState): void {}

export function PlannerWorkspace({
  startup,
  loadBuildingMetadata = loadBuildingPlacementMetadata,
  loadRequiredCatalogCategory = loadCatalogCategory,
  performanceMarker,
}: PlannerWorkspaceProperties) {
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
          message: getPlannerWorkspaceErrorMessage(caughtError),
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
        loadBuildingMetadata={loadBuildingMetadata}
        loadRequiredCatalogCategory={loadRequiredCatalogCategory}
        onImportedGameSaveResult={setImportedGameSaveResult}
        performanceMarker={performanceMarker}
        plannerWorkspaceRenderState={plannerWorkspaceRenderState}
        plannerWorkspaceStateController={plannerWorkspaceStateController}
        projectWorkspace={projectWorkspace}
      />
      <PlannerGameSaveImportResultLoader
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

  return <PlannerWorkspaceGeometry plannerWorkspaceRenderState={plannerWorkspaceRenderState} />;
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
      loadBuildingMetadata={loadBuildingPlacementMetadata}
      loadRequiredCatalogCategory={loadCatalogCategory}
      onImportedGameSaveResult={ignoreImportedGameSave}
      performanceMarker={undefined}
      plannerWorkspaceRenderState={{
        kind: "prepared",
        preparedWorkspace,
        runtimeStatus,
      }}
      plannerWorkspaceStateController={resolvedPlannerWorkspaceStateController}
      projectWorkspace={projectWorkspace}
    />
  );
}

function PlannerWorkspaceRenderedBoundary({
  loadBuildingMetadata,
  loadRequiredCatalogCategory,
  onImportedGameSaveResult,
  performanceMarker,
  plannerWorkspaceRenderState,
  plannerWorkspaceStateController,
  projectWorkspace,
}: Readonly<{
  loadBuildingMetadata: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory: typeof loadCatalogCategory;
  onImportedGameSaveResult: (importedGameSaveState: ImportedGameSaveState) => void;
  performanceMarker?: EditorPerformanceMarker;
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
  plannerWorkspaceStateController: PlannerWorkspaceStateController;
  projectWorkspace: ReturnType<typeof useReferenceProjectWorkspaceController>;
}>) {
  const cameraStateRetentionReference =
    useRef<PlannerCameraStateRetention | null>(null);

  if (cameraStateRetentionReference.current === null) {
    cameraStateRetentionReference.current = createPlannerCameraStateRetention();
  }
  cameraStateRetentionReference.current.observeSelectedMapId(
    plannerWorkspaceStateController.plannerWorkspaceState.selectedPlannerMapId,
  );

  return (
    <PlannerWorkspaceGeometry plannerWorkspaceRenderState={plannerWorkspaceRenderState}>
      {plannerWorkspaceRenderState.kind === "prepared" && projectWorkspace !== null ? (
        <PreparedPlannerWorkspaceContent
          cameraStateRetention={cameraStateRetentionReference.current}
          loadBuildingMetadata={loadBuildingMetadata}
          loadRequiredCatalogCategory={loadRequiredCatalogCategory}
          plannerWorkspaceStateController={plannerWorkspaceStateController}
          preparedWorkspace={plannerWorkspaceRenderState.preparedWorkspace}
          projectWorkspace={projectWorkspace}
          onImportedGameSaveResult={onImportedGameSaveResult}
          performanceMarker={performanceMarker}
          runtimeStatus={plannerWorkspaceRenderState.runtimeStatus}
        />
      ) : null}
    </PlannerWorkspaceGeometry>
  );
}

function PlannerWorkspaceGeometry({
  children,
  plannerWorkspaceRenderState,
}: Readonly<{
  children?: ReactNode;
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
}>) {
  return (
    <section
      className="planner-workspace planner-editor-shell"
      data-planner-workspace-state={plannerWorkspaceRenderState.kind}
    >
      <PlannerStartupStatus state={toPlannerStartupStatusState(plannerWorkspaceRenderState)} />
      <div className="planner-workspace__reserved-geometry planner-editor-canvas-area">
        {children}
      </div>
    </section>
  );
}

function PreparedPlannerWorkspaceContent({
  cameraStateRetention,
  preparedWorkspace,
  projectWorkspace,
  plannerWorkspaceStateController,
  loadBuildingMetadata,
  loadRequiredCatalogCategory,
  onImportedGameSaveResult,
  performanceMarker,
  runtimeStatus,
}: PreparedPlannerWorkspaceContentProperties) {
  const {
    applyPlacementEditResult,
    dispatchPlannerWorkspaceAction,
    plannerWorkspaceState,
    setSelectedPlacementKeys,
  } = plannerWorkspaceStateController;
  const { workspaceController, workspaceState } = projectWorkspace;
  const workspacePersistenceControls = usePlannerWorkspacePersistenceControls({
    dispatchPlannerWorkspaceAction,
    plannerWorkspaceState,
    workspaceController,
    workspaceState,
  });
  const {
    buildingMetadataById,
    getRequiredCurrentMapPlacementGrid,
    handleCanvasError,
    handleCanvasInteractive,
    handleCanvasReady,
    handleMapPlacementGridReady,
  } = usePreparedWorkspaceInitialization({
    dispatchPlannerWorkspaceAction,
    loadBuildingMetadata,
    preparedWorkspace,
    selectedPlannerMapId: plannerWorkspaceState.selectedPlannerMapId,
  });
  const {
    advanceSelectedCatalogPlacementAttempt,
    catalogPresentationChoicesByItemId,
    clearSelectedCatalogItem,
    handleCatalogItemPresentationChoiceChange,
    handleCatalogItemSelect,
    handleReadyCatalogItems,
    handleToolChange,
    readyCatalogItems,
    searchQuery,
    selectedCatalogItem,
    setSearchQuery,
    cyclePendingCatalogChoice,
  } = useWorkspaceCatalogControls(dispatchPlannerWorkspaceAction);
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
  const [isXRayActive, setIsXRayActive] = useState(false);
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
      }),
    );
  }, []);
  const workspaceEditingControls = useWorkspaceEditingControls({
    activeInteriorDecorPattern,
    advanceSelectedCatalogPlacementAttempt,
    applyPlacementEditResult,
    buildingMetadataById,
    clearSelectedCatalogItem,
    getRequiredCurrentMapPlacementGrid,
    isRequiredPlacementCatalogReady,
    plannerWorkspaceState,
    readyCatalogItems,
    selectedCatalogItem,
    setSelectedPlacementKeys,
    onPendingCatalogChoiceCycle: cyclePendingCatalogChoice,
    onDismissInteriorDecor: handleCancelInteriorDecor,
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
        getInteriorDecorRejectionMessage(mapId, interiorDecorKind),
      );
    },
    [showInteriorDecorRejectionMessage],
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
        );
        if (unavailableInteriorDecorMessage !== null) {
          showInteriorDecorRejectionMessage(unavailableInteriorDecorMessage);
          return;
        }
        handleInteriorDecorPatternSelect(interiorDecorPattern);
        return;
      }
      cancelInteriorDecorBeforeOrdinaryWorkspaceAction({
        cancelInteriorDecor: handleCancelInteriorDecor,
        performOrdinaryWorkspaceAction: () => {
          workspaceEditingControls.cancelPendingDuplicateSelection();
          setSelectedPlacementKeys([]);
          handleCatalogItemSelect(catalogItem, presentationChoice);
        },
      });
    },
    [
      handleCancelInteriorDecor,
      handleInteriorDecorPatternSelect,
      handleCatalogItemSelect,
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
    season: plannerWorkspaceState.season,
    workspaceController,
  });
  const plannerCanvasInteractionProperties = getPlannerCanvasInteractionProperties({
    hasSelectedPlacements:
      plannerWorkspaceState.selectedPlacementKeys.length > 0,
    tool: plannerWorkspaceState.tool,
  });
  return (
    <>
      <EditorMenuBar
        activeModalId={plannerWorkspaceState.modalId}
        leftHandMode={plannerWorkspaceState.behaviorOptions.leftHandMode}
        mapDisplayName={getPlannerMapById(plannerWorkspaceState.selectedPlannerMapId).displayName}
        onCycleSeason={() =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            type: "cycle-season",
          })
        }
        onOpenModal={(modalId) =>
          plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
            modalId,
            type: "open-modal",
          })
        }
        season={plannerWorkspaceState.season}
      />
      <EditorToolbar
        canRedo={plannerWorkspaceState.placementHistory.redoStates.length > 0}
        canUndo={plannerWorkspaceState.placementHistory.undoStates.length > 0}
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
      />
      <ItemCatalogPanel
        catalogPresentationChoicesByItemId={catalogPresentationChoicesByItemId}
        category={plannerWorkspaceState.catalogCategory}
        leftHandMode={plannerWorkspaceState.behaviorOptions.leftHandMode}
        onCatalogItemPresentationChoiceChange={handleCatalogItemPresentationChoiceChange}
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
      <PlannerRequiredCatalogGate state={requiredPlacementCatalogGate}>
        <PlannerCanvas
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
          onCanvasReady={handleCanvasReady}
          onInteractive={handleCanvasInteractive}
          onMapPlacementGridReady={handleMapPlacementGridReady}
          onMapImageExporterReady={workspacePersistenceControls.handleMapImageExporterReady}
          onMapTileClick={workspaceEditingControls.handleMapTileClick}
          onMapTileRectangle={workspaceEditingControls.handleMapTileRectangle}
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
          preparedCanvasResources={preparedWorkspace.canvasResources}
          season={plannerWorkspaceState.season}
          selectedPlacementKeys={plannerWorkspaceState.selectedPlacementKeys}
          showJoystick={plannerWorkspaceState.behaviorOptions.showJoystick}
          showResourceClumpSpawnLocations={
            plannerWorkspaceState.behaviorOptions.autoShowResourceClumps &&
            isAutoVisibleResourceClumpCatalogItemId(
              plannerWorkspaceState.selectedCatalogItemId,
            )
          }
        />
        {workspaceEditingControls.selectionInspector}
      </PlannerRequiredCatalogGate>
      <EditorModal
        behaviorOptions={plannerWorkspaceState.behaviorOptions}
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
          projectSummaries: workspaceState.projectSummaries,
          season: plannerWorkspaceState.season,
          workspaceController,
        })}
        savePanelContent={
          <PlannerSaveModalLoader
            catalogItems={readyCatalogItems}
            currentProjectId={workspaceState.activeProject?.id ?? null}
            currentProjectMapInstanceCount={
              workspaceState.activeProject?.project.maps.length ?? null
            }
            currentProjectMapInstanceName={
              workspaceState.activeSession?.sourceMap.label ?? null
            }
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
            onSaveCurrentMap={workspacePersistenceControls.saveCurrentMap}
            onSaveThumbnail={workspacePersistenceControls.saveThumbnail}
            placementSnapshot={plannerWorkspaceState.placementHistory.currentState}
            projects={workspaceState.projectSummaries}
            season={plannerWorkspaceState.season}
            selectedPlannerMapId={plannerWorkspaceState.selectedPlannerMapId}
            storageErrorMessage={null}
            storageStatus="ready"
            {...localProjectActions}
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
  projectSummaries,
  season,
  workspaceController,
}: Readonly<{
  activeProject: ReturnType<typeof useReferenceProjectWorkspace>["workspaceState"]["activeProject"];
  cancelInteriorDecor: () => void;
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
  preparedWorkspace,
  selectedPlannerMapId,
}: Readonly<{
  dispatchPlannerWorkspaceAction: PlannerWorkspaceStateController["dispatchPlannerWorkspaceAction"];
  loadBuildingMetadata: () => Promise<BuildingPlacementMetadataById>;
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
          message: getPlannerWorkspaceErrorMessage(caughtError),
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

  const getRequiredCurrentMapPlacementGrid = useCallback(
    (requestedMapId: string): MapPlacementGrid => {
      const currentMapPlacementGrid = mapPlacementGridReference.current;
      if (
        currentMapPlacementGrid === null ||
        currentMapPlacementGrid.mapId !== requestedMapId
      ) {
        throw new Error(
          `Planner workspace map placement grid is unavailable for requested map ID ${JSON.stringify(requestedMapId)}.`,
        );
      }
      return currentMapPlacementGrid.mapPlacementGrid;
    },
    [],
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
        message,
        resourceGeneration: preparedWorkspace.resourceGeneration,
        type: "complete-runtime-error",
      });
    },
    [dispatchPlannerWorkspaceAction, preparedWorkspace.resourceGeneration],
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
    getRequiredCurrentMapPlacementGrid,
    handleCanvasError,
    handleCanvasInteractive,
    handleCanvasReady,
    handleMapPlacementGridReady,
  };
}

function useWorkspaceCatalogControls(
  dispatchPlannerWorkspaceAction: PlannerWorkspaceStateController["dispatchPlannerWorkspaceAction"],
) {
  const [catalogChoiceState, setCatalogChoiceState] = useState(
    createInitialWorkspaceCatalogChoiceState,
  );
  const [readyCatalogItems, setReadyCatalogItems] = useState<
    readonly CatalogItem[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const advanceSelectedCatalogPlacementAttempt = useCallback(() => {
    setCatalogChoiceState(advanceWorkspaceCatalogPlacementAttempt);
  }, []);
  const handleCatalogItemSelect = useCallback(
    (
      catalogItem: CatalogItem,
      presentationChoice: CatalogPresentationChoice,
    ) => {
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
    },
    [dispatchPlannerWorkspaceAction],
  );
  const handleCatalogItemPresentationChoiceChange = useCallback(
    (
      catalogItem: CatalogItem,
      presentationChoice: CatalogPresentationChoice,
    ) => {
      setCatalogChoiceState((currentCatalogChoiceState) =>
        changeWorkspaceCatalogItemChoice(
          currentCatalogChoiceState,
          catalogItem,
          presentationChoice,
        ),
      );
    },
    [],
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
      const toolSelection = getPlannerWorkspaceToolSelection(
        tool,
        catalogChoiceState.selectedCatalogItem?.catalogItem ?? null,
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
    handleCatalogItemPresentationChoiceChange,
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
  getRequiredCurrentMapPlacementGrid,
  isRequiredPlacementCatalogReady,
  plannerWorkspaceState,
  readyCatalogItems,
  selectedCatalogItem,
  setSelectedPlacementKeys,
  onPendingCatalogChoiceCycle,
  onDismissInteriorDecor,
}: Readonly<{
  activeInteriorDecorPattern: InteriorDecorCatalogPattern | null;
  advanceSelectedCatalogPlacementAttempt: () => void;
  applyPlacementEditResult: PlannerWorkspaceStateController["applyPlacementEditResult"];
  buildingMetadataById: BuildingPlacementMetadataById | null;
  clearSelectedCatalogItem: () => void;
  getRequiredCurrentMapPlacementGrid: (requestedMapId: string) => MapPlacementGrid;
  isRequiredPlacementCatalogReady: boolean;
  plannerWorkspaceState: PlannerWorkspaceStateController["plannerWorkspaceState"];
  readyCatalogItems: readonly CatalogItem[];
  selectedCatalogItem: WorkspaceSelectedCatalogItem | null;
  setSelectedPlacementKeys: PlannerWorkspaceStateController["setSelectedPlacementKeys"];
  onPendingCatalogChoiceCycle: () => boolean;
  onDismissInteriorDecor: () => void;
}>) {
  const [pendingDuplicateSelectionKey, setPendingDuplicateSelectionKey] =
    useState<PlacementSelectionKey | null>(null);
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
          setPendingDuplicateSelectionKey(null),
        cursorTile,
        freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
        getRequiredCurrentMapPlacementGrid,
        mapId,
        pendingDuplicateSelectionKey,
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
      pendingDuplicateSelectionKey,
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
    (selectedPlacementKey: PlacementSelectionKey) => {
      setPendingDuplicateSelectionKey(selectedPlacementKey);
    },
    [],
  );
  const handleDismissSelection = useCallback(() => {
    setSelectedPlacementKeys([]);
  }, [setSelectedPlacementKeys]);
  const handleDismissEditingInteraction = useCallback(() => {
    onDismissInteriorDecor();
    setPendingDuplicateSelectionKey(null);
    setSelectedPlacementKeys([]);
    clearSelectedCatalogItem();
  }, [clearSelectedCatalogItem, onDismissInteriorDecor, setSelectedPlacementKeys]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleKeyboardEvent = createPlannerWorkspaceEditingKeyboardHandler({
      getSelectedPlacementKey: () =>
        plannerWorkspaceState.selectedPlacementKeys.length === 1
          ? plannerWorkspaceState.selectedPlacementKeys[0] ?? null
          : null,
      hasDismissableInteraction: () =>
        plannerWorkspaceState.selectedPlacementKeys.length > 0 ||
        selectedCatalogItem !== null ||
        pendingDuplicateSelectionKey !== null ||
        activeInteriorDecorPattern !== null,
      hasSelection: () => plannerWorkspaceState.selectedPlacementKeys.length > 0,
      hasPendingCatalogItem: () => selectedCatalogItem !== null,
      onCopy: handleCopySelection,
      onDelete: handleDeleteSelection,
      onDismiss: handleDismissEditingInteraction,
      onPendingChoiceCycle: onPendingCatalogChoiceCycle,
      onCycleSelectedAppearance: handleCycleSelectedAppearance,
    });
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
    pendingDuplicateSelectionKey,
    onPendingCatalogChoiceCycle,
    selectedCatalogItem,
  ]);

  const selectionInspector = isRequiredPlacementCatalogReady
    ? createSelectionInspector(
        plannerWorkspaceState.placementHistory.currentState,
        plannerWorkspaceState.selectedPlacementKeys,
        readyCatalogItems,
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
    cancelPendingDuplicateSelection: () => setPendingDuplicateSelectionKey(null),
    handleMapTileClick,
    handleMapTileRectangle,
    handleMoveSelectedPlacements,
    handleNudgeSelectedPlacements,
    onPlacementSelectionClick: handlePlacementSelectionClick,
    selectionInspector,
  };
}

export function createPlannerWorkspaceRenderState({
  preparedWorkspace,
  plannerWorkspaceState,
  onRetry,
}: Readonly<{
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
  return { kind: "loading", message: startupLoadingMessage };
}

function toPlannerStartupStatusState(
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState,
): PlannerStartupStatusState {
  if (plannerWorkspaceRenderState.kind === "loading") {
    return { kind: "loading", message: plannerWorkspaceRenderState.message } as const;
  }
  if (plannerWorkspaceRenderState.kind === "error") {
    return plannerWorkspaceRenderState;
  }
  return plannerWorkspaceRenderState.runtimeStatus === "interactive"
    ? { kind: "interactive" }
    : { kind: "loading", message: startupLoadingMessage };
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
  onDelete: () => void,
  onCycleAppearance: () => void,
  onCopy: (selectedPlacementKey: PlacementSelectionKey) => void,
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
    onDelete,
    onCycleAppearance,
    onCopy,
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
  onDelete: () => void,
  onCycleAppearance: () => void,
  onCopy: (selectedPlacementKey: PlacementSelectionKey) => void,
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
  const entityName =
    catalogItems.find((catalogItem) => catalogItem.id === selectionDetails.catalogItemId)
      ?.name ?? selectionDetails.catalogItemId;
  if (selectionDetails.kind === "building") {
    if (selectionDetails.canSetWaterColor) {
      return (
        <SelectionInspector
          kind="single"
          onBuildingWaterColorChange={(waterColor) =>
            onBuildingWaterColorChange(
              selectionDetails.selectedPlacementKey,
              waterColor,
            )
          }
          onCopy={() => onCopy(selectionDetails.selectedPlacementKey)}
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
          onBuildingPaintChange={(paintColors) =>
            onBuildingPaintChange(selectionDetails.selectedPlacementKey, paintColors)
          }
          onCopy={() => onCopy(selectionDetails.selectedPlacementKey)}
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
        onCopy={() => onCopy(selectionDetails.selectedPlacementKey)}
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
        onCopy={() => onCopy(selectionDetails.selectedPlacementKey)}
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
      onCopy={() => onCopy(selectionDetails.selectedPlacementKey)}
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

function getPlannerWorkspaceErrorMessage(caughtError: unknown): string {
  if (caughtError instanceof Error) {
    return caughtError.message;
  }
  return String(caughtError);
}
