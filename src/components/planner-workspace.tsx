"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { BuildingPlacementMetadataById, Catalog, CatalogItem } from "../catalog";
import { loadBuildingPlacementMetadata } from "../catalog/building-placement-metadata-loader";
import {
  applyEditorErase,
  applyEditorEraseRectangle,
} from "../editor/editor-erase-controller";
import { applyEditorFill } from "../editor/editor-fill-controller";
import { getEditorHistoryKeyboardShortcut } from "../editor/editor-history-keyboard-shortcut";
import { applyEditorCursorPlacement } from "../editor/editor-placement-controller";
import {
  selectPlacementAtTile,
  selectPlacementsInRectangle,
  type PlacementSelectionKey,
} from "../editor/editor-selection-controller";
import { undoPlacementHistory, redoPlacementHistory } from "../placement/placement-history";
import type { MapPlacementGrid } from "../placement/map-placement-grids";
import type { MapPointerTile } from "../placement/map-pointer-tile";
import type { MapImageExporter, ScreenshotResolution } from "../projects/map-image-export";
import {
  createBrowserLocalProjectStoreV2,
  type LocalProjectStoreV2,
  type LocalProjectV2Summary,
} from "../projects/local-project-store";
import type { LocalProjectV2 } from "../projects/project-schema";
import {
  createProjectMapState,
  createSavedLocalProject,
  getEditorViewStateForLocalProject,
  getMapRenderOptionsForLocalProjectMapInstance,
  getPlacementSnapshotForLocalProjectMapInstance,
} from "../projects/local-project-editor-actions";
import { migrateReferenceProjectsIfNeeded } from "../projects/reference-local-project-storage-migration";
import type { LocalProjectStorageStatus } from "./local-project-panel";
import { LocalProjectPanel } from "./local-project-panel";
import { EditorMenuBar } from "./editor-menu-bar";
import { EditorModal } from "./editor-modal";
import { EditorToolbar } from "./editor-toolbar";
import { InteriorDecorPanel } from "./interior-decor-panel";
import { ItemCatalogPanel } from "./item-catalog-panel";
import { MapImageExportPanel } from "./map-image-export-panel";
import { FarmSummaryPanel } from "./farm-summary-panel";
import { FarmSummaryModal } from "./farm-summary-modal";
import { PlannerCanvas } from "./planner-canvas";
import {
  ProjectMapInstancePanel,
  type ProjectMapInstanceSummary,
} from "./project-map-instance-panel";
import { applyInteriorDecorPatternToHistory } from "../interior-decor/interior-decor-controller";
import type { InteriorDecorCatalogPattern } from "../interior-decor/interior-decor-catalog";
import type { InteriorDecorKind } from "../interior-decor/interior-decor-state";
import { getPlannerMapById, plannerMaps } from "../maps/map-catalog";
import type { SiteLocale } from "../i18n/locales";
import { getPlannerMapDisplayName } from "../i18n/catalog-display";
import { getLocalizedPlannerErrorMessage } from "../planner/planner-error-message";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
} from "../planner/planner-workspace-state";
import type { FarmSummary } from "../projects/farm-summary";

export type PlannerWorkspaceProperties = Readonly<{
  initialMapId?: string;
  locale: SiteLocale;
}>;

type PlannerWorkspaceLabels = Readonly<{
  map: string;
  workspace: string;
}>;

export function PlannerWorkspace({
  initialMapId,
  locale,
}: PlannerWorkspaceProperties) {
  const [plannerWorkspaceState, dispatchPlannerWorkspaceState] = useReducer(
    reducePlannerWorkspaceState,
    initialMapId,
    createInitialPlannerWorkspaceState,
  );
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItem | null>(
    null,
  );
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");
  const [loadedCatalog, setLoadedCatalog] = useState<Catalog | null>(null);
  const [openFarmSummary, setOpenFarmSummary] = useState<FarmSummary | null>(
    null,
  );
  const [buildingMetadataById, setBuildingMetadataById] =
    useState<BuildingPlacementMetadataById | null>(null);
  const [currentProject, setCurrentProject] = useState<LocalProjectV2 | null>(null);
  const [projects, setProjects] = useState<readonly LocalProjectV2Summary[]>([]);
  const [storageStatus, setStorageStatus] = useState<LocalProjectStorageStatus>(
    "loading",
  );
  const [storageErrorMessage, setStorageErrorMessage] = useState<string | null>(
    null,
  );
  const [activeInteriorDecorPattern, setActiveInteriorDecorPattern] =
    useState<InteriorDecorCatalogPattern | null>(null);
  const projectStoreReference = useRef<LocalProjectStoreV2 | null>(null);
  const mapPlacementGridReference = useRef<MapPlacementGrid | null>(null);
  const mapImageExporterReference = useRef<MapImageExporter | null>(null);
  const labels = getPlannerWorkspaceLabels(locale);
  const selectedPlannerMap = getPlannerMapById(
    plannerWorkspaceState.selectedMapId,
  );

  useEffect(() => {
    let hasUnmounted = false;

    try {
      const browserStorage = getRequiredBrowserStorage();
      migrateReferenceProjectsIfNeeded(browserStorage);
      const projectStore = createBrowserLocalProjectStoreV2({
        storage: browserStorage,
      });
      const loadedProjects = projectStore.listProjects();

      if (hasUnmounted) {
        return;
      }

      projectStoreReference.current = projectStore;
      setProjects(loadedProjects);
      setStorageStatus("ready");
      setStorageErrorMessage(null);
    } catch (caughtError) {
      const localizedErrorMessage = getLocalizedPlannerErrorMessage(locale, caughtError);

      if (localizedErrorMessage === null) {
        throw caughtError;
      }

      if (!hasUnmounted) {
        setStorageStatus("error");
        setStorageErrorMessage(localizedErrorMessage);
      }
    }

    return () => {
      hasUnmounted = true;
    };
  }, [locale]);

  useEffect(() => {
    let hasUnmounted = false;

    void loadBuildingPlacementMetadata().then((loadedBuildingMetadataById) => {
      if (!hasUnmounted) {
        setBuildingMetadataById(loadedBuildingMetadataById);
      }
    }).catch((caughtError: unknown) => {
      throw caughtError;
    });

    return () => {
      hasUnmounted = true;
    };
  }, []);

  useEffect(() => {
    function handleHistoryKeyboardShortcut(keyboardEvent: KeyboardEvent): void {
      const historyShortcut = getEditorHistoryKeyboardShortcut(keyboardEvent);

      if (historyShortcut === "undo") {
        keyboardEvent.preventDefault();
        dispatchPlannerWorkspaceState({
          type: "set-placement-history",
          placementHistory: undoPlacementHistory(
            plannerWorkspaceState.placementHistory,
          ),
        });
      }

      if (historyShortcut === "redo") {
        keyboardEvent.preventDefault();
        dispatchPlannerWorkspaceState({
          type: "set-placement-history",
          placementHistory: redoPlacementHistory(
            plannerWorkspaceState.placementHistory,
          ),
        });
      }
    }

    window.addEventListener("keydown", handleHistoryKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleHistoryKeyboardShortcut);
  }, [plannerWorkspaceState.placementHistory]);

  function updateProjectsFromStore(): void {
    const projectStore = getRequiredProjectStore(projectStoreReference.current);
    setProjects(projectStore.listProjects());
  }

  function loadProjectMap(
    projectToLoad: LocalProjectV2,
    mapInstanceId = projectToLoad.activeMapInstanceId,
  ): void {
    const editorViewState = getEditorViewStateForLocalProject(
      {
        catalogCategory: plannerWorkspaceState.catalogCategory,
        mapId: plannerWorkspaceState.selectedMapId,
        modalId: plannerWorkspaceState.modalId,
        panelPosition: plannerWorkspaceState.panelPosition,
        season: plannerWorkspaceState.season,
        tool: plannerWorkspaceState.tool,
      },
      projectToLoad,
    );
    const mapInstance = projectToLoad.mapInstances[mapInstanceId];

    if (mapInstance === undefined) {
      throw new Error(
        `Cannot load local project ${JSON.stringify(projectToLoad.id)} because map instance ${JSON.stringify(mapInstanceId)} is unavailable.`,
      );
    }

    dispatchPlannerWorkspaceState({ type: "select-map", mapId: editorViewState.mapId });
    dispatchPlannerWorkspaceState({ type: "select-season", season: editorViewState.season });
    dispatchPlannerWorkspaceState({
      type: "set-map-render-options",
      mapRenderOptions: getMapRenderOptionsForLocalProjectMapInstance(
        projectToLoad,
        mapInstanceId,
      ),
    });
    dispatchPlannerWorkspaceState({
      type: "reset-placement-history",
      placementSnapshot: getPlacementSnapshotForLocalProjectMapInstance(
        projectToLoad,
        mapInstanceId,
      ),
    });
    setCurrentProject(projectToLoad);
    setSelectedCatalogItem(null);
    setActiveInteriorDecorPattern(null);
  }

  function handleCreateProject(): void {
    const projectStore = getRequiredProjectStore(projectStoreReference.current);
    const createdProject = createSavedLocalProject(projectStore, {
      baseMapId: plannerWorkspaceState.selectedMapId,
      mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
      placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
      season: plannerWorkspaceState.season,
    });

    setCurrentProject(createdProject);
    updateProjectsFromStore();
  }

  function handleSaveCurrentMap(): void {
    const projectStore = getRequiredProjectStore(projectStoreReference.current);

    if (currentProject === null) {
      handleCreateProject();
      return;
    }

    const savedProject = projectStore.saveMapInstanceState(
      currentProject.id,
      currentProject.activeMapInstanceId,
      createProjectMapState(
        plannerWorkspaceState.season,
        plannerWorkspaceState.placementHistory.currentState,
        plannerWorkspaceState.mapRenderOptions,
      ),
    );
    setCurrentProject(savedProject);
    updateProjectsFromStore();
  }

  function handleOpenProject(projectId: string): void {
    const projectStore = getRequiredProjectStore(projectStoreReference.current);
    loadProjectMap(projectStore.openProject(projectId));
    updateProjectsFromStore();
  }

  function handleRenameProject(projectId: string, requestedName: string): void {
    const projectStore = getRequiredProjectStore(projectStoreReference.current);
    const renamedProject = projectStore.renameProject(projectId, requestedName);

    if (currentProject?.id === projectId) {
      setCurrentProject(renamedProject);
    }

    updateProjectsFromStore();
  }

  function handleDuplicateProject(projectId: string): void {
    getRequiredProjectStore(projectStoreReference.current).duplicateProject(projectId);
    updateProjectsFromStore();
  }

  function handleDeleteProject(projectId: string): void {
    const projectStore = getRequiredProjectStore(projectStoreReference.current);
    projectStore.deleteProject(projectId);

    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }

    updateProjectsFromStore();
  }

  function handleImportProject(serializedProject: string): void {
    const importedProject = getRequiredProjectStore(
      projectStoreReference.current,
    ).importProject(serializedProject);
    loadProjectMap(importedProject);
    updateProjectsFromStore();
  }

  function handleAddMap(baseMapId: string): void {
    const currentLocalProject = getRequiredCurrentProject(currentProject);
    const projectStore = getRequiredProjectStore(projectStoreReference.current);
    const updatedProject = projectStore.createMapInstance(currentLocalProject.id, {
      baseMapId,
    });
    loadProjectMap(updatedProject, updatedProject.activeMapInstanceId);
    updateProjectsFromStore();
  }

  function handleOpenMapInstance(mapInstanceId: string): void {
    const currentLocalProject = getRequiredCurrentProject(currentProject);
    const projectStore = getRequiredProjectStore(projectStoreReference.current);
    const updatedProject = projectStore.switchActiveMapInstance(
      currentLocalProject.id,
      mapInstanceId,
    );
    loadProjectMap(updatedProject);
    updateProjectsFromStore();
  }

  function handleRenameMapInstance(
    mapInstanceId: string,
    requestedName: string,
  ): void {
    const currentLocalProject = getRequiredCurrentProject(currentProject);
    const updatedProject = getRequiredProjectStore(
      projectStoreReference.current,
    ).renameMapInstance(currentLocalProject.id, mapInstanceId, requestedName);
    setCurrentProject(updatedProject);
    updateProjectsFromStore();
  }

  function handleDuplicateMapInstance(mapInstanceId: string): void {
    const currentLocalProject = getRequiredCurrentProject(currentProject);
    const updatedProject = getRequiredProjectStore(
      projectStoreReference.current,
    ).duplicateMapInstance(currentLocalProject.id, mapInstanceId);
    setCurrentProject(updatedProject);
    updateProjectsFromStore();
  }

  function handleDeleteMapInstance(mapInstanceId: string): void {
    const currentLocalProject = getRequiredCurrentProject(currentProject);
    const updatedProject = getRequiredProjectStore(
      projectStoreReference.current,
    ).deleteMapInstance(currentLocalProject.id, mapInstanceId);
    loadProjectMap(updatedProject);
    updateProjectsFromStore();
  }

  function handleCopyMapInstance(
    mapInstanceId: string,
    destinationProjectId: string,
  ): void {
    const currentLocalProject = getRequiredCurrentProject(currentProject);
    getRequiredProjectStore(projectStoreReference.current).copyMapInstance(
      currentLocalProject.id,
      mapInstanceId,
      destinationProjectId,
    );
    updateProjectsFromStore();
  }

  function handleMoveMapInstance(
    mapInstanceId: string,
    destinationProjectId: string,
  ): void {
    const currentLocalProject = getRequiredCurrentProject(currentProject);
    const transferResult = getRequiredProjectStore(
      projectStoreReference.current,
    ).moveMapInstance(currentLocalProject.id, mapInstanceId, destinationProjectId);
    loadProjectMap(transferResult.sourceProject);
    updateProjectsFromStore();
  }

  function handleMapTileClick(mapId: string, mapTileCoordinates: MapPointerTile): void {
    assertCurrentMapId(plannerWorkspaceState.selectedMapId, mapId);
    const controllerDependencies = getRequiredControllerDependencies(
      mapPlacementGridReference.current,
      buildingMetadataById,
    );

    if (plannerWorkspaceState.tool === "cursor") {
      if (selectedCatalogItem !== null) {
        const placementResult = applyEditorCursorPlacement({
          buildingMetadataById: controllerDependencies.buildingMetadataById,
          cursorTile: mapTileCoordinates,
          freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
          mapPlacementGrid: controllerDependencies.mapPlacementGrid,
          placementHistory: plannerWorkspaceState.placementHistory,
          selectedCatalogItem,
        });
        dispatchPlannerWorkspaceState({
          type: "set-placement-history",
          placementHistory: placementResult.placementHistory,
        });
        return;
      }

      const selectedPlacementKey = selectPlacementAtTile({
        buildingMetadataById: controllerDependencies.buildingMetadataById,
        cursorTile: mapTileCoordinates,
        currentSelectionKey: plannerWorkspaceState.selectedPlacementKeys[0],
        placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
      });
      dispatchPlannerWorkspaceState({
        type: "set-selected-placement-keys",
        selectedPlacementKeys: selectedPlacementKey === null ? [] : [selectedPlacementKey],
      });
      return;
    }

    if (plannerWorkspaceState.tool === "erase") {
      const eraseResult = applyEditorErase({
        buildingMetadataById: controllerDependencies.buildingMetadataById,
        cursorTile: mapTileCoordinates,
        placementHistory: plannerWorkspaceState.placementHistory,
      });
      dispatchPlannerWorkspaceState({
        type: "set-placement-history",
        placementHistory: eraseResult.placementHistory,
      });
    }
  }

  function handleMapTileRectangle(
    mapId: string,
    firstTile: MapPointerTile,
    secondTile: MapPointerTile,
  ): void {
    assertCurrentMapId(plannerWorkspaceState.selectedMapId, mapId);
    const controllerDependencies = getRequiredControllerDependencies(
      mapPlacementGridReference.current,
      buildingMetadataById,
    );

    if (plannerWorkspaceState.tool === "multi-select") {
      dispatchPlannerWorkspaceState({
        type: "set-selected-placement-keys",
        selectedPlacementKeys: selectPlacementsInRectangle({
          buildingMetadataById: controllerDependencies.buildingMetadataById,
          firstTile,
          placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
          secondTile,
        }),
      });
      return;
    }

    if (plannerWorkspaceState.tool === "fill") {
      const fillResult = applyEditorFill({
        buildingMetadataById: controllerDependencies.buildingMetadataById,
        firstTile,
        freePlacement: plannerWorkspaceState.behaviorOptions.freePlacement,
        mapPlacementGrid: controllerDependencies.mapPlacementGrid,
        placementHistory: plannerWorkspaceState.placementHistory,
        secondTile,
        selectedCatalogItem,
      });
      dispatchPlannerWorkspaceState({
        type: "set-placement-history",
        placementHistory: fillResult.placementHistory,
      });
      return;
    }

    if (plannerWorkspaceState.tool === "erase") {
      const eraseResult = applyEditorEraseRectangle({
        buildingMetadataById: controllerDependencies.buildingMetadataById,
        firstTile,
        placementHistory: plannerWorkspaceState.placementHistory,
        secondTile,
      });
      dispatchPlannerWorkspaceState({
        type: "set-placement-history",
        placementHistory: eraseResult.placementHistory,
      });
    }
  }

  function handleInteriorDecorApply(
    mapId: string,
    interiorDecorKind: InteriorDecorKind,
    targetId: string,
    patternId: string,
  ): void {
    assertCurrentMapId(plannerWorkspaceState.selectedMapId, mapId);
    dispatchPlannerWorkspaceState({
      type: "set-placement-history",
      placementHistory: applyInteriorDecorPatternToHistory({
        interiorDecorKind,
        patternId,
        placementHistory: plannerWorkspaceState.placementHistory,
        targetId,
      }),
    });
  }

  function handleCaptureScreenshot(
    screenshotResolution: ScreenshotResolution,
  ): Promise<Blob> {
    const mapImageExporter = mapImageExporterReference.current;

    if (mapImageExporter === null) {
      throw new Error("Cannot export a planner map before the current canvas is ready.");
    }

    return mapImageExporter.captureScreenshot(screenshotResolution);
  }

  const projectMapPanelContent = currentProject === null
    ? undefined
    : (
      <ProjectMapInstancePanel
        activeMapInstanceId={currentProject.activeMapInstanceId}
        locale={locale}
        mapChoices={plannerMaps.map((plannerMap) => ({
          displayName: getLocalizedPlannerMapName(locale, plannerMap.id),
          id: plannerMap.id,
        }))}
        mapInstances={createProjectMapInstanceSummaries(currentProject)}
        onAddMap={handleAddMap}
        onCopyMapInstance={handleCopyMapInstance}
        onDeleteMapInstance={handleDeleteMapInstance}
        onDuplicateMapInstance={handleDuplicateMapInstance}
        onMoveMapInstance={handleMoveMapInstance}
        onOpenMapInstance={handleOpenMapInstance}
        onRenameMapInstance={handleRenameMapInstance}
        projectChoices={projects
          .filter((project) => project.id !== currentProject.id)
          .map((project) => ({ id: project.id, name: project.name }))}
      />
    );

  return (
    <section
      aria-label={labels.workspace}
      className="planner-workspace"
      data-planner-workspace
    >
      <header className="planner-workspace__header">
        <button
          aria-label={labels.map}
          onClick={() => dispatchPlannerWorkspaceState({ type: "open-modal", modalId: "map-picker" })}
          type="button"
        >
          {getLocalizedPlannerMapName(locale, plannerWorkspaceState.selectedMapId)}
        </button>
        <EditorMenuBar
          activeModalId={plannerWorkspaceState.modalId}
          editorMenuVisibility={plannerWorkspaceState.editorMenuVisibility}
          locale={locale}
          mapDisplayName={getLocalizedPlannerMapName(
            locale,
            plannerWorkspaceState.selectedMapId,
          )}
          onOpenModal={(modalId) => dispatchPlannerWorkspaceState({ type: "open-modal", modalId })}
          onToggleMenu={() => dispatchPlannerWorkspaceState({ type: "toggle-menu" })}
          season={plannerWorkspaceState.season}
        />
        <EditorToolbar
          canRedo={plannerWorkspaceState.placementHistory.redoStates.length > 0}
          canUndo={plannerWorkspaceState.placementHistory.undoStates.length > 0}
          locale={locale}
          onRedo={() => dispatchPlannerWorkspaceState({
            type: "set-placement-history",
            placementHistory: redoPlacementHistory(plannerWorkspaceState.placementHistory),
          })}
          onToolChange={(tool) => dispatchPlannerWorkspaceState({ type: "select-tool", tool })}
          onUndo={() => dispatchPlannerWorkspaceState({
            type: "set-placement-history",
            placementHistory: undoPlacementHistory(plannerWorkspaceState.placementHistory),
          })}
          tool={plannerWorkspaceState.tool}
        />
      </header>
      <PlannerCanvas
        activeInteriorDecorPattern={activeInteriorDecorPattern}
        displayOptions={plannerWorkspaceState.displayOptions}
        isXRayActive={false}
        leftHandMode={plannerWorkspaceState.behaviorOptions.leftHandMode}
        mapId={plannerWorkspaceState.selectedMapId}
        mapRenderOptions={plannerWorkspaceState.mapRenderOptions}
        onInteriorDecorApply={handleInteriorDecorApply}
        onMapImageExporterReady={(_mapId, mapImageExporter) => {
          mapImageExporterReference.current = mapImageExporter;
        }}
        onMapPlacementGridReady={(_mapId, mapPlacementGrid) => {
          mapPlacementGridReference.current = mapPlacementGrid;
        }}
        onMapTileClick={handleMapTileClick}
        onMapTileRectangle={handleMapTileRectangle}
        placementSnapshot={plannerWorkspaceState.placementHistory.currentState}
        pointerInteractionMode={
          plannerWorkspaceState.tool === "cursor" ? "navigate" : "rectangle"
        }
        season={plannerWorkspaceState.season}
        selectedPlacementKeys={plannerWorkspaceState.selectedPlacementKeys}
        showJoystick={plannerWorkspaceState.behaviorOptions.showJoystick}
        showResourceClumpSpawnLocations={
          plannerWorkspaceState.behaviorOptions.autoShowResourceClumps
        }
      />
      <ItemCatalogPanel
        category={plannerWorkspaceState.catalogCategory}
        locale={locale}
        onCatalogItemSelect={(catalogItem) => {
          setSelectedCatalogItem(catalogItem);
          dispatchPlannerWorkspaceState({
            type: "set-selected-catalog-item",
            catalogItemId: catalogItem.id,
          });
        }}
        onCategoryChange={(catalogCategory) => dispatchPlannerWorkspaceState({
          type: "select-catalog-category",
          catalogCategory,
        })}
        onCatalogReady={setLoadedCatalog}
        onOpenModal={(modalId) => dispatchPlannerWorkspaceState({ type: "open-modal", modalId })}
        onSearchQueryChange={setCatalogSearchQuery}
        panelPosition={plannerWorkspaceState.panelPosition}
        searchQuery={catalogSearchQuery}
        selectedCatalogItemId={plannerWorkspaceState.selectedCatalogItemId}
      />
      <InteriorDecorPanel
        locale={locale}
        mapId={plannerWorkspaceState.selectedMapId}
        onPatternSelect={setActiveInteriorDecorPattern}
        selectedPattern={activeInteriorDecorPattern}
      />
      <EditorModal
        behaviorOptions={plannerWorkspaceState.behaviorOptions}
        displayOptions={plannerWorkspaceState.displayOptions}
        mapRenderOptions={plannerWorkspaceState.mapRenderOptions}
        locale={locale}
        modalId={plannerWorkspaceState.modalId}
        onBehaviorOptionChange={(option, value) => dispatchPlannerWorkspaceState({
          type: "set-behavior-option",
          option,
          value,
        })}
        onClose={() => dispatchPlannerWorkspaceState({ type: "close-modal" })}
        onDisplayOptionToggle={(option) => dispatchPlannerWorkspaceState({
          type: "toggle-display-option",
          option,
        })}
        onMapChange={(mapId) => dispatchPlannerWorkspaceState({ type: "select-map", mapId })}
        onMapRenderOptionsChange={(mapRenderOptions) => dispatchPlannerWorkspaceState({
          type: "set-map-render-options",
          mapRenderOptions,
        })}
        onPanelPositionChange={(panelPosition) => dispatchPlannerWorkspaceState({
          type: "select-panel-position",
          panelPosition,
        })}
        onSeasonChange={(season) => dispatchPlannerWorkspaceState({ type: "select-season", season })}
        panelPosition={plannerWorkspaceState.panelPosition}
        projectMapPanelContent={projectMapPanelContent}
        savePanelContent={
          <>
            <LocalProjectPanel
              currentProjectId={currentProject?.id ?? null}
              currentProjectMapInstanceCount={
                currentProject === null
                  ? null
                  : Object.keys(currentProject.mapInstances).length
              }
              currentProjectMapInstanceName={
                currentProject === null
                  ? null
                  : currentProject.mapInstances[currentProject.activeMapInstanceId]?.name ?? null
              }
              currentProjectName={currentProject?.name ?? null}
              locale={locale}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onDuplicateProject={handleDuplicateProject}
              onExportProject={(projectId) => getRequiredProjectStore(
                projectStoreReference.current,
              ).exportProject(projectId)}
              onImportProject={handleImportProject}
              onOpenProject={handleOpenProject}
              onRenameProject={handleRenameProject}
              onSaveCurrentMap={handleSaveCurrentMap}
              projects={projects}
              storageErrorMessage={storageErrorMessage}
              storageStatus={storageStatus}
            />
            <MapImageExportPanel
              locale={locale}
              mapFile={selectedPlannerMap.mapFile}
              onCaptureScreenshot={handleCaptureScreenshot}
              season={plannerWorkspaceState.season}
            />
            {loadedCatalog !== null ? (
              <FarmSummaryPanel
                catalogItems={loadedCatalog.items}
                locale={locale}
                mapContext={{
                  baseMapId: selectedPlannerMap.id,
                  displayName: selectedPlannerMap.displayName,
                  season: plannerWorkspaceState.season,
                }}
                onOpenFarmSummary={(farmSummary) => {
                  dispatchPlannerWorkspaceState({ type: "close-modal" });
                  setOpenFarmSummary(farmSummary);
                }}
                placementSnapshot={plannerWorkspaceState.placementHistory.currentState}
              />
            ) : null}
          </>
        }
        season={plannerWorkspaceState.season}
        selectedMapId={plannerWorkspaceState.selectedMapId}
      />
      {openFarmSummary !== null ? (
        <FarmSummaryModal
          farmSummary={openFarmSummary}
          locale={locale}
          onClose={() => setOpenFarmSummary(null)}
        />
      ) : null}
    </section>
  );
}

function getRequiredBrowserStorage(): Storage {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    throw new Error("Planner workspace requires browser localStorage.");
  }

  return window.localStorage;
}

function getRequiredProjectStore(
  projectStore: LocalProjectStoreV2 | null,
): LocalProjectStoreV2 {
  if (projectStore === null) {
    throw new Error("Planner local project store is not ready.");
  }

  return projectStore;
}

function getRequiredCurrentProject(
  currentProject: LocalProjectV2 | null,
): LocalProjectV2 {
  if (currentProject === null) {
    throw new Error("A local project must be open before changing project maps.");
  }

  return currentProject;
}

function getRequiredControllerDependencies(
  mapPlacementGrid: MapPlacementGrid | null,
  buildingMetadataById: BuildingPlacementMetadataById | null,
): Readonly<{
  buildingMetadataById: BuildingPlacementMetadataById;
  mapPlacementGrid: MapPlacementGrid;
}> {
  if (mapPlacementGrid === null) {
    throw new Error("Planner placement controls are unavailable until the current map has loaded.");
  }

  if (buildingMetadataById === null) {
    throw new Error("Planner placement controls are unavailable until building metadata has loaded.");
  }

  return { buildingMetadataById, mapPlacementGrid };
}

function assertCurrentMapId(selectedMapId: string, callbackMapId: string): void {
  if (selectedMapId !== callbackMapId) {
    throw new Error(
      `Planner canvas callback map ID ${JSON.stringify(callbackMapId)} does not match selected map ID ${JSON.stringify(selectedMapId)}.`,
    );
  }
}

function createProjectMapInstanceSummaries(
  currentProject: LocalProjectV2,
): readonly ProjectMapInstanceSummary[] {
  return Object.entries(currentProject.mapInstances).map(
    ([id, mapInstance]) => ({
      baseMapId: mapInstance.baseMapId,
      id,
      name: mapInstance.name,
    }),
  );
}

function getPlannerWorkspaceLabels(locale: SiteLocale): PlannerWorkspaceLabels {
  return locale === "zh-CN"
    ? { map: "地图", workspace: "星露谷规划器" }
    : { map: "Map", workspace: "Stardew Planner" };
}

function getLocalizedPlannerMapName(locale: SiteLocale, mapId: string): string {
  const plannerMap = getPlannerMapById(mapId);
  return getPlannerMapDisplayName(locale, plannerMap.id, plannerMap.displayName);
}
