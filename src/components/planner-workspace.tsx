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
  createBrowserPlannerWorkspaceBootstrap,
  type BrowserPlannerWorkspaceBootstrapInput,
  type PreparedPlannerWorkspace,
} from "../planner/planner-workspace-bootstrap";
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
} from "../planner/planner-workspace-interior-decor-controls";
import {
  attachPlannerWorkspaceXRayKeyboardListener,
  createPlannerWorkspaceXRayKeyboardHandler,
} from "../planner/planner-workspace-xray-keyboard";
import {
  usePlannerWorkspaceState,
  type PlannerWorkspaceStateController,
} from "../planner/use-planner-workspace-state";
import { useReferenceProjectWorkspace } from "../reference-runtime/use-reference-project-workspace";
import { EditorMenuBar } from "./editor-menu-bar";
import { EditorModal } from "./editor-modal";
import { EditorToolbar } from "./editor-toolbar";
import { ItemCatalogPanel } from "./item-catalog-panel";
import { PlannerGameSaveImportResultLoader } from "./planner-game-save-import-result-loader";
import { PlannerSaveModalLoader } from "./planner-save-modal-loader";
import { PlannerCanvas } from "./planner-canvas";
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

export type PlannerWorkspaceRenderState =
  | Readonly<{ kind: "loading"; message: string }>
  | Readonly<{ kind: "error"; message: string; onRetry: () => void }>
  | Readonly<{
      kind: "prepared";
      preparedWorkspace: PreparedPlannerWorkspace;
      runtimeStatus: "loading" | "ready" | "interactive";
    }>;

export type PlannerWorkspaceProperties = Readonly<{
  bootstrapWorkspace?: PlannerWorkspaceBootstrap;
  loadBuildingMetadata?: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory?: typeof loadCatalogCategory;
  performanceMarker?: EditorPerformanceMarker;
}>;

type PlannerWorkspaceStaticBoundaryProperties = Readonly<{
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
  plannerWorkspaceStateController?: PlannerWorkspaceStateController;
}>;

type PreparedPlannerWorkspaceContentProperties = Readonly<{
  preparedWorkspace: PreparedPlannerWorkspace;
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

const startupLoadingMessage = "Loading local planner resources…";

const interiorDecorPatternByCatalogItemId = new Map<string, InteriorDecorCatalogPattern>([
  ...interiorWallpaperPatterns,
  ...interiorFlooringPatterns,
].map((pattern) => [pattern.id, pattern]));

function ignoreImportedGameSave(_importedGameSaveState: ImportedGameSaveState): void {}

export function PlannerWorkspace({
  bootstrapWorkspace,
  loadBuildingMetadata = loadBuildingPlacementMetadata,
  loadRequiredCatalogCategory = loadCatalogCategory,
  performanceMarker,
}: PlannerWorkspaceProperties) {
  const plannerWorkspaceStateController = usePlannerWorkspaceState();
  const {
    dispatchPlannerWorkspaceAction,
    plannerWorkspaceState,
  } = plannerWorkspaceStateController;
  const bootstrapWorkspaceReference = useRef<PlannerWorkspaceBootstrap | null>(
    bootstrapWorkspace ?? null,
  );
  const resourceGenerationReference = useRef(0);
  const [workspaceResourceState, setWorkspaceResourceState] = useState(
    createInitialPlannerWorkspaceResourceState,
  );
  const [importedGameSaveResult, setImportedGameSaveResult] =
    useState<ImportedGameSaveState | null>(null);

  useEffect(() => {
    const mapRequest = {
      mapId: plannerWorkspaceState.selectedPlannerMapId,
      mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
      season: plannerWorkspaceState.season,
    };

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
        const resolvedBootstrapWorkspace =
          bootstrapWorkspaceReference.current ??
          createBrowserPlannerWorkspaceBootstrap();
        bootstrapWorkspaceReference.current = resolvedBootstrapWorkspace;
        const nextPreparedWorkspace = await resolvedBootstrapWorkspace({
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
  const mapRequest = {
    mapId: plannerWorkspaceState.selectedPlannerMapId,
    mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
    season: plannerWorkspaceState.season,
  };
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
}: Readonly<{
  loadBuildingMetadata: () => Promise<BuildingPlacementMetadataById>;
  loadRequiredCatalogCategory: typeof loadCatalogCategory;
  onImportedGameSaveResult: (importedGameSaveState: ImportedGameSaveState) => void;
  performanceMarker?: EditorPerformanceMarker;
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState;
  plannerWorkspaceStateController: PlannerWorkspaceStateController;
}>) {
  return (
    <PlannerWorkspaceGeometry plannerWorkspaceRenderState={plannerWorkspaceRenderState}>
      {plannerWorkspaceRenderState.kind === "prepared" ? (
        <PreparedPlannerWorkspaceContent
          loadBuildingMetadata={loadBuildingMetadata}
          loadRequiredCatalogCategory={loadRequiredCatalogCategory}
          plannerWorkspaceStateController={plannerWorkspaceStateController}
          preparedWorkspace={plannerWorkspaceRenderState.preparedWorkspace}
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
  preparedWorkspace,
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
  const { workspaceController, workspaceState } = usePreparedWorkspaceProjectState(
    preparedWorkspace,
  );
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
  const [interiorDecorRejectionMessage, setInteriorDecorRejectionMessage] =
    useState<string | null>(null);
  const [isXRayActive, setIsXRayActive] = useState(false);
  const [isWheelZoomEnabled, setIsWheelZoomEnabled] = useState(false);
  const handleCancelInteriorDecor = useCallback(() => {
    setActiveInteriorDecorPattern(null);
    setInteriorDecorRejectionMessage(null);
  }, []);
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
  const handleInteriorDecorPatternSelect = useCallback(
    (pattern: InteriorDecorCatalogPattern | null) => {
      const selectionTransition = createInteriorDecorSelectionTransition(pattern);
      setActiveInteriorDecorPattern(selectionTransition.activeInteriorDecorPattern);
      setInteriorDecorRejectionMessage(null);
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
      setInteriorDecorRejectionMessage(null);
    },
    [activeInteriorDecorPattern, applyPlacementEditResult, plannerWorkspaceState.placementHistory],
  );
  const handleInteriorDecorRejected = useCallback(
    (mapId: string, interiorDecorKind: InteriorDecorCatalogPattern["kind"]) => {
      setInteriorDecorRejectionMessage(
        getInteriorDecorRejectionMessage(mapId, interiorDecorKind),
      );
    },
    [],
  );
  const handleOrdinaryCatalogItemSelect = useCallback(
    (
      catalogItem: CatalogItem,
      presentationChoice: CatalogPresentationChoice,
    ) => {
      const interiorDecorPattern = interiorDecorPatternByCatalogItemId.get(catalogItem.id);
      if (interiorDecorPattern !== undefined) {
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
      setSelectedPlacementKeys,
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
        onWheelZoomToggle={() => setIsWheelZoomEnabled((enabled) => !enabled)}
        tool={plannerWorkspaceState.tool}
        wheelZoomEnabled={isWheelZoomEnabled}
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
      {interiorDecorRejectionMessage === null ? null : (
        <p aria-live="polite" role="status">
          {interiorDecorRejectionMessage}
        </p>
      )}
      <PlannerRequiredCatalogGate state={requiredPlacementCatalogGate}>
        <PlannerCanvas
          activeInteriorDecorPattern={activeInteriorDecorPattern}
          catalogItems={readyCatalogItems}
          displayOptions={plannerWorkspaceState.displayOptions}
          isXRayActive={isXRayActive}
          wheelZoomEnabled={isWheelZoomEnabled}
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
          onMoveSelectedPlacements={workspaceEditingControls.handleMoveSelectedPlacements}
          onNudgeSelectedPlacements={workspaceEditingControls.handleNudgeSelectedPlacements}
          onInteriorDecorApply={handleInteriorDecorApply}
          onInteriorDecorRejected={handleInteriorDecorRejected}
          performanceMarker={performanceMarker}
          placementSnapshot={plannerWorkspaceState.placementHistory.currentState}
          pointerInteractionMode={
            plannerWorkspaceState.tool === "multi-select" ||
            plannerWorkspaceState.tool === "fill" ||
            plannerWorkspaceState.tool === "erase"
              ? "rectangle"
              : plannerWorkspaceState.selectedPlacementKeys.length > 0
                ? "move-selected"
                : "navigate"
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

function usePreparedWorkspaceProjectState(
  preparedWorkspace: PreparedPlannerWorkspace,
): ReturnType<typeof useReferenceProjectWorkspace> {
  return useReferenceProjectWorkspace({
    initialProjectSummaries: preparedWorkspace.projectState.projects,
    repository: preparedWorkspace.projectState.repository,
  });
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
      if (buildingMetadataById === null) {
        throw new Error(
          `Planner workspace building placement metadata is unavailable for requested map ID ${JSON.stringify(mapId)}.`,
        );
      }
      const mapPlacementGrid = getRequiredCurrentMapPlacementGrid(mapId);
      const selectedPlacementKeys =
        pendingDuplicateSelectionKey === null
          ? plannerWorkspaceState.selectedPlacementKeys
          : [pendingDuplicateSelectionKey];
      const editingTransition =
        pendingDuplicateSelectionKey === null
          ? applyPlannerWorkspaceMapTileClick({
              buildingMetadataById,
              catalogPresentationChoice:
                selectedCatalogItem?.presentationChoice ?? null,
              cursorTile,
              freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
              mapPlacementGrid,
              placementHistory: plannerWorkspaceState.placementHistory,
              selectedCatalogItem: selectedCatalogItem?.catalogItem ?? null,
              selectedPlacementKeys,
              tool: plannerWorkspaceState.tool,
            })
          : duplicatePlannerWorkspaceSelectionAtTile({
              buildingMetadataById,
              catalogItems: readyCatalogItems,
              cursorTile,
              freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
              mapPlacementGrid,
              placementHistory: plannerWorkspaceState.placementHistory,
              selectedPlacementKeys,
            });
      setPendingDuplicateSelectionKey(null);
      applyEditingTransition(
        editingTransition.placementHistory,
        editingTransition.selectedPlacementKeys,
      );
    },
    [
      applyEditingTransition,
      buildingMetadataById,
      getRequiredCurrentMapPlacementGrid,
      pendingDuplicateSelectionKey,
      plannerWorkspaceState,
      selectedCatalogItem,
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
