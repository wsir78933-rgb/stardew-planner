import {
  MapImageExportError,
  type MapImageExporter,
  type ScreenshotResolution,
} from "../projects/map-image-export";
import { createEmptyInteriorDecorState } from "../interior-decor/interior-decor-state";
import { createPersistentPlacementSnapshot } from "../placement/placement-snapshot";
import type { ReferenceProjectWorkspaceState } from "../reference-runtime/use-reference-project-workspace";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";
import {
  createCanonicalMapIdentityReference,
  createCanonicalSessionTransition,
  getCurrentCanonicalSession,
} from "./planner-workspace-canonical-session";
import {
  captureCurrentCleanMapImage,
  captureCurrentMapScreenshot,
  createCurrentMapImageExporterSlot,
  updateCurrentMapImageExporter,
} from "./planner-workspace-map-image-exporter";
import {
  capturePlannerMapThumbnail,
  saveCurrentCanonicalMapThumbnail,
} from "./planner-workspace-thumbnail-save";
import type { PlannerWorkspaceAction, PlannerWorkspaceState } from "./planner-workspace-state";
import { getPlannerMapById } from "../maps/map-catalog";

type PlannerWorkspacePersistenceController = Pick<
  ReferenceProjectWorkspaceController,
  | "clearActiveProject"
  | "createMap"
  | "createProject"
  | "getState"
  | "getPlannerMapIdForMapFile"
  | "saveOpenMap"
  | "saveThumbnail"
>;

type PlannerWorkspacePersistenceProjectState = Pick<
  ReferenceProjectWorkspaceState,
  "activeSession"
>;

type PlannerWorkspaceMapSaveResult =
  | "created-canonical-session"
  | "saved-existing-canonical-session";

type PendingSmartSaveCanonicalSession = Readonly<{
  mapId: string;
  plannerMapId: string;
  projectId: string;
}>;

type PlannerWorkspaceMapLayoutSnapshot = Readonly<{
  mapRenderOptions: PlannerWorkspaceState["mapRenderOptions"];
  placementSnapshot: PlannerWorkspaceState["placementHistory"]["currentState"];
  season: PlannerWorkspaceState["season"];
  selectedPlannerMapId: PlannerWorkspaceState["selectedPlannerMapId"];
}>;

type PlannerWorkspaceMapSaveContext = Readonly<{
  activeProjectId: string | null;
  activeSessionMapId: string | null;
  activeSessionProjectId: string | null;
  mapImageExporter: MapImageExporter;
  plannerMapId: string;
}>;

type PlannerWorkspacePersistenceRuntimeInput = Readonly<{
  dispatchPlannerWorkspaceAction: (plannerWorkspaceAction: PlannerWorkspaceAction) => void;
  initialPlannerWorkspaceState: PlannerWorkspaceState;
  initialWorkspaceState: PlannerWorkspacePersistenceProjectState;
  newProjectName?: string;
  workspaceController: PlannerWorkspacePersistenceController;
}>;

export type PlannerWorkspacePersistenceRuntime = Readonly<{
  captureCleanMapImage: (screenshotResolution: ScreenshotResolution) => Promise<Blob>;
  captureScreenshot: (screenshotResolution: ScreenshotResolution) => Promise<Blob>;
  clearMapImageExporter: (plannerMapId: string) => void;
  handleMapChange: (plannerMapId: string) => void;
  handleMapImageExporterReady: (
    receivedPlannerMapId: string,
    receivedMapImageExporter: MapImageExporter | null,
  ) => void;
  saveCurrentMap: () => void;
  saveCurrentMapAndRefreshThumbnail: () => Promise<void>;
  saveThumbnail: () => Promise<void>;
  synchronizeCanonicalSession: () => void;
  updateWorkspaceSnapshot: (
    plannerWorkspaceState: PlannerWorkspaceState,
    workspaceState: PlannerWorkspacePersistenceProjectState,
  ) => void;
}>;

export function createPlannerWorkspacePersistenceRuntime({
  dispatchPlannerWorkspaceAction,
  initialPlannerWorkspaceState,
  initialWorkspaceState,
  newProjectName = "Untitled Project",
  workspaceController,
}: PlannerWorkspacePersistenceRuntimeInput): PlannerWorkspacePersistenceRuntime {
  const canonicalMapIdentityReference = createCanonicalMapIdentityReference();
  const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
  let currentPlannerWorkspaceState = initialPlannerWorkspaceState;
  let currentWorkspaceState = initialWorkspaceState;
  let pendingSmartSaveCanonicalSession: PendingSmartSaveCanonicalSession | null = null;
  let shouldPreserveSavePanelOnCanonicalSynchronization = false;

  function updateWorkspaceSnapshot(
    plannerWorkspaceState: PlannerWorkspaceState,
    workspaceState: PlannerWorkspacePersistenceProjectState,
  ): void {
    currentPlannerWorkspaceState = plannerWorkspaceState;
    currentWorkspaceState = workspaceState;
  }

  function synchronizeCanonicalSession(): void {
    if (pendingSmartSaveCanonicalSession !== null) {
      requireMatchingPendingSmartSaveCanonicalSession({
        pendingCanonicalSession: pendingSmartSaveCanonicalSession,
        plannerWorkspaceState: currentPlannerWorkspaceState,
        workspaceController,
        workspaceState: workspaceController.getState(),
      });
    }
    const canonicalSessionAction = createCanonicalSessionTransition(
      currentWorkspaceState.activeSession,
      workspaceController,
      canonicalMapIdentityReference,
    );
    if (canonicalSessionAction !== null) {
      if (shouldPreserveSavePanelOnCanonicalSynchronization) {
        shouldPreserveSavePanelOnCanonicalSynchronization = false;
        dispatchPlannerWorkspaceAction({
          ...canonicalSessionAction,
          placementSnapshot:
            pendingSmartSaveCanonicalSession === null
              ? canonicalSessionAction.placementSnapshot
              : currentPlannerWorkspaceState.placementHistory.currentState,
          type: "synchronize-smart-save-canonical-map",
        });
        pendingSmartSaveCanonicalSession = null;
        return;
      }
      dispatchPlannerWorkspaceAction(canonicalSessionAction);
    }
  }

  function handleMapImageExporterReady(
    receivedPlannerMapId: string,
    receivedMapImageExporter: MapImageExporter | null,
  ): void {
    updateCurrentMapImageExporter(
      currentMapImageExporterSlot,
      currentPlannerWorkspaceState.selectedPlannerMapId,
      receivedPlannerMapId,
      receivedMapImageExporter,
    );
  }

  function clearMapImageExporter(plannerMapId: string): void {
    updateCurrentMapImageExporter(
      currentMapImageExporterSlot,
      plannerMapId,
      plannerMapId,
      null,
    );
  }

  function captureScreenshot(
    screenshotResolution: ScreenshotResolution,
  ): Promise<Blob> {
    return captureCurrentMapScreenshot(
      currentMapImageExporterSlot,
      currentPlannerWorkspaceState.selectedPlannerMapId,
      screenshotResolution,
    );
  }

  function captureCleanMapImage(
    screenshotResolution: ScreenshotResolution,
  ): Promise<Blob> {
    return captureCurrentCleanMapImage(
      currentMapImageExporterSlot,
      currentPlannerWorkspaceState.selectedPlannerMapId,
      screenshotResolution,
    );
  }

  function handleMapChange(plannerMapId: string): void {
    changePlannerWorkspaceMap({
      dispatchPlannerWorkspaceAction,
      plannerMapId,
      workspaceController,
    });
  }

  function saveCurrentMap(): void {
    if (pendingSmartSaveCanonicalSession !== null) {
      savePendingSmartSaveCanonicalSession({
        pendingCanonicalSession: pendingSmartSaveCanonicalSession,
        plannerWorkspaceState: currentPlannerWorkspaceState,
        workspaceController,
      });
      pendingSmartSaveCanonicalSession = null;
      shouldPreserveSavePanelOnCanonicalSynchronization = true;
      return;
    }
    const saveResult = saveCurrentPlannerWorkspaceMapOrCreate({
      newProjectName,
      onCreatedCanonicalSession: (createdCanonicalSession) => {
        pendingSmartSaveCanonicalSession = createdCanonicalSession;
        shouldPreserveSavePanelOnCanonicalSynchronization = true;
      },
      plannerWorkspaceState: currentPlannerWorkspaceState,
      workspaceController,
      workspaceState: currentWorkspaceState,
    });
    pendingSmartSaveCanonicalSession = null;
    shouldPreserveSavePanelOnCanonicalSynchronization =
      saveResult === "created-canonical-session";
  }

  async function saveCurrentMapAndRefreshThumbnail(): Promise<void> {
    const savedPlannerWorkspaceMapLayout = createPlannerWorkspaceMapLayoutSnapshot(
      currentPlannerWorkspaceState,
    );
    const capturedMapSaveContext = createPlannerWorkspaceMapSaveContext(
      currentPlannerWorkspaceState,
      currentWorkspaceState,
      currentMapImageExporterSlot.current,
      workspaceController,
    );
    const capturedPlannerMapThumbnail = await capturePlannerMapThumbnail(
      capturedMapSaveContext.plannerMapId,
      capturedMapSaveContext.mapImageExporter,
    );
    assertPlannerWorkspaceMapSaveContextIsCurrent(
      capturedMapSaveContext,
      savedPlannerWorkspaceMapLayout,
      currentPlannerWorkspaceState,
      currentWorkspaceState,
      currentMapImageExporterSlot.current,
      workspaceController,
    );
    saveCurrentMap();
    const savedCanonicalSession = requireSavedPlannerWorkspaceMapSession(
      capturedPlannerMapThumbnail.plannerMapId,
      workspaceController,
    );
    workspaceController.saveThumbnail({
      projectId: savedCanonicalSession.projectId,
      mapId: savedCanonicalSession.mapId,
      webpBytes: capturedPlannerMapThumbnail.webpBytes,
    });
  }

  async function saveThumbnail(): Promise<void> {
    const registeredMapImageExporter = currentMapImageExporterSlot.current;
    const currentCanonicalSession = getCurrentCanonicalSession(
      currentWorkspaceState.activeSession,
      currentPlannerWorkspaceState,
      workspaceController,
    );
    if (
      currentCanonicalSession === null
      || registeredMapImageExporter === null
      || registeredMapImageExporter.plannerMapId
        !== currentPlannerWorkspaceState.selectedPlannerMapId
    ) {
      throw new MapImageExportError(
        "Cannot save a thumbnail because the current canonical map image exporter is unavailable "
          + `for project ID ${JSON.stringify(currentCanonicalSession?.projectId ?? null)}, map ID `
          + `${JSON.stringify(currentCanonicalSession?.mapId ?? null)}, and planner map ID `
          + `${JSON.stringify(currentPlannerWorkspaceState.selectedPlannerMapId)}.`,
      );
    }
    await saveCurrentCanonicalMapThumbnail({
      getCurrentWorkspaceSnapshot: () => createCurrentThumbnailWorkspaceSnapshot(
        currentWorkspaceState,
        currentPlannerWorkspaceState,
        currentMapImageExporterSlot.current,
        workspaceController,
      ),
      getPlannerMapIdForMapFile: workspaceController.getPlannerMapIdForMapFile,
      workspaceController,
    });
  }

  return {
    captureCleanMapImage,
    captureScreenshot,
    clearMapImageExporter,
    handleMapChange,
    handleMapImageExporterReady,
    saveCurrentMap,
    saveCurrentMapAndRefreshThumbnail,
    saveThumbnail,
    synchronizeCanonicalSession,
    updateWorkspaceSnapshot,
  };
}

export function changePlannerWorkspaceMap({
  dispatchPlannerWorkspaceAction,
  plannerMapId,
  workspaceController,
}: Readonly<{
  dispatchPlannerWorkspaceAction: (plannerWorkspaceAction: PlannerWorkspaceAction) => void;
  plannerMapId: string;
  workspaceController: Pick<ReferenceProjectWorkspaceController, "clearActiveProject">;
}>): void {
  workspaceController.clearActiveProject();
  dispatchPlannerWorkspaceAction({ plannerMapId, type: "select-map" });
}

export function saveCurrentPlannerWorkspaceMap({
  plannerWorkspaceState,
  workspaceController,
  workspaceState,
}: Readonly<{
  plannerWorkspaceState: PlannerWorkspaceState;
  workspaceController: Pick<
    ReferenceProjectWorkspaceController,
    "getPlannerMapIdForMapFile" | "saveOpenMap"
  >;
  workspaceState: PlannerWorkspacePersistenceProjectState;
}>): void {
  const currentCanonicalSession = getCurrentCanonicalSession(
    workspaceState.activeSession,
    plannerWorkspaceState,
    workspaceController,
  );
  if (currentCanonicalSession === null) {
    throw new Error(
      "Cannot save this map because there is no active canonical project map for "
        + `project ID ${JSON.stringify(plannerWorkspaceState.activeProjectId)}, map ID `
        + `${JSON.stringify(plannerWorkspaceState.activeMapId)}, and planner map ID `
        + `${JSON.stringify(plannerWorkspaceState.selectedPlannerMapId)}.`,
    );
  }
  workspaceController.saveOpenMap({
    mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
    placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
    season: plannerWorkspaceState.season,
  });
}

function saveCurrentPlannerWorkspaceMapOrCreate({
  newProjectName,
  onCreatedCanonicalSession,
  plannerWorkspaceState,
  workspaceController,
  workspaceState,
}: Readonly<{
  newProjectName: string;
  onCreatedCanonicalSession: (
    createdCanonicalSession: PendingSmartSaveCanonicalSession,
  ) => void;
  plannerWorkspaceState: PlannerWorkspaceState;
  workspaceController: PlannerWorkspacePersistenceController;
  workspaceState: PlannerWorkspacePersistenceProjectState;
}>): PlannerWorkspaceMapSaveResult {
  const currentCanonicalSession = getCurrentCanonicalSession(
    workspaceState.activeSession,
    plannerWorkspaceState,
    workspaceController,
  );
  if (currentCanonicalSession !== null) {
    saveCurrentPlannerWorkspaceMap({
      plannerWorkspaceState,
      workspaceController,
      workspaceState,
    });
    return "saved-existing-canonical-session";
  }

  createAndSaveCurrentPlannerWorkspaceMap({
    newProjectName,
    onCreatedCanonicalSession,
    plannerWorkspaceState,
    workspaceController,
  });
  return "created-canonical-session";
}

function createAndSaveCurrentPlannerWorkspaceMap({
  newProjectName,
  onCreatedCanonicalSession,
  plannerWorkspaceState,
  workspaceController,
}: Readonly<{
  newProjectName: string;
  onCreatedCanonicalSession: (
    createdCanonicalSession: PendingSmartSaveCanonicalSession,
  ) => void;
  plannerWorkspaceState: PlannerWorkspaceState;
  workspaceController: PlannerWorkspacePersistenceController;
}>): void {
  const projectForMapCreation = getOrCreateEmptyProjectForCurrentMap(
    newProjectName,
    plannerWorkspaceState,
    workspaceController,
  );
  const selectedPlannerMap = getPlannerMapById(
    plannerWorkspaceState.selectedPlannerMapId,
  );
  workspaceController.createMap({
    label: selectedPlannerMap.displayName,
    mapFile: selectedPlannerMap.mapFile,
    projectId: projectForMapCreation.id,
    season: plannerWorkspaceState.season,
  });
  const createdCanonicalSession = requireCreatedCurrentMapSession(
    workspaceController.getState(),
    projectForMapCreation.id,
    selectedPlannerMap.mapFile,
    plannerWorkspaceState,
  );
  onCreatedCanonicalSession(createdCanonicalSession);
  workspaceController.saveOpenMap({
    mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
    placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
    season: plannerWorkspaceState.season,
  });
}

function getOrCreateEmptyProjectForCurrentMap(
  newProjectName: string,
  plannerWorkspaceState: PlannerWorkspaceState,
  workspaceController: PlannerWorkspacePersistenceController,
) {
  const workspaceStateBeforeCreation = workspaceController.getState();
  if (workspaceStateBeforeCreation.activeProject === null) {
    workspaceController.createProject({
      projectName: newProjectName,
      season: plannerWorkspaceState.season,
    });
  }
  const workspaceStateForMapCreation = workspaceController.getState();
  const activeProject = workspaceStateForMapCreation.activeProject;
  if (
    activeProject === null
    || workspaceStateForMapCreation.activeSession !== null
    || activeProject.project.maps.length !== 0
  ) {
    throw createSmartSaveStateError(
      "Cannot create a map because the active project is not empty and without an active session",
      workspaceStateForMapCreation,
      plannerWorkspaceState,
    );
  }
  return activeProject;
}

function requireCreatedCurrentMapSession(
  workspaceState: ReferenceProjectWorkspaceState,
  expectedProjectId: string,
  expectedMapFile: string,
  plannerWorkspaceState: PlannerWorkspaceState,
): PendingSmartSaveCanonicalSession {
  const activeSession = workspaceState.activeSession;
  if (
    workspaceState.activeProject?.id !== expectedProjectId
    || activeSession === null
    || activeSession.projectId !== expectedProjectId
    || activeSession.sourceMap.mapFile !== expectedMapFile
  ) {
    throw createSmartSaveStateError(
      "Cannot save the created map because the active session does not match the created project and selected planner map",
      workspaceState,
      plannerWorkspaceState,
    );
  }
  return {
    mapId: activeSession.mapId,
    plannerMapId: plannerWorkspaceState.selectedPlannerMapId,
    projectId: activeSession.projectId,
  };
}

function savePendingSmartSaveCanonicalSession({
  pendingCanonicalSession,
  plannerWorkspaceState,
  workspaceController,
}: Readonly<{
  pendingCanonicalSession: PendingSmartSaveCanonicalSession;
  plannerWorkspaceState: PlannerWorkspaceState;
  workspaceController: PlannerWorkspacePersistenceController;
}>): void {
  const currentWorkspaceState = workspaceController.getState();
  requireMatchingPendingSmartSaveCanonicalSession({
    pendingCanonicalSession,
    plannerWorkspaceState,
    workspaceController,
    workspaceState: currentWorkspaceState,
  });
  workspaceController.saveOpenMap({
    mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
    placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
    season: plannerWorkspaceState.season,
  });
}

function requireMatchingPendingSmartSaveCanonicalSession({
  pendingCanonicalSession,
  plannerWorkspaceState,
  workspaceController,
  workspaceState,
}: Readonly<{
  pendingCanonicalSession: PendingSmartSaveCanonicalSession;
  plannerWorkspaceState: PlannerWorkspaceState;
  workspaceController: Pick<
    ReferenceProjectWorkspaceController,
    "getPlannerMapIdForMapFile"
  >;
  workspaceState: ReferenceProjectWorkspaceState;
}>): void {
  const activeSession = workspaceState.activeSession;
  if (
    workspaceState.activeProject?.id !== pendingCanonicalSession.projectId
    || activeSession === null
    || activeSession.projectId !== pendingCanonicalSession.projectId
    || activeSession.mapId !== pendingCanonicalSession.mapId
    || workspaceController.getPlannerMapIdForMapFile(activeSession.sourceMap.mapFile)
      !== pendingCanonicalSession.plannerMapId
    || plannerWorkspaceState.selectedPlannerMapId
      !== pendingCanonicalSession.plannerMapId
  ) {
    throw createSmartSaveStateError(
      "Cannot use the unsaved created map because the active session no longer matches it",
      workspaceState,
      plannerWorkspaceState,
    );
  }
}

function createSmartSaveStateError(
  message: string,
  workspaceState: ReferenceProjectWorkspaceState,
  plannerWorkspaceState: PlannerWorkspaceState,
): Error {
  return new Error(
    `${message}. Received project ID ${JSON.stringify(workspaceState.activeProject?.id ?? null)}, `
      + `map ID ${JSON.stringify(workspaceState.activeSession?.mapId ?? null)}, and planner map ID `
      + `${JSON.stringify(plannerWorkspaceState.selectedPlannerMapId)}.`,
  );
}

function createCurrentThumbnailWorkspaceSnapshot(
  workspaceState: PlannerWorkspacePersistenceProjectState,
  plannerWorkspaceState: PlannerWorkspaceState,
  registeredMapImageExporter: Readonly<{
    plannerMapId: string;
    mapImageExporter: MapImageExporter;
  }> | null,
  workspaceController: Pick<
    ReferenceProjectWorkspaceController,
    "getPlannerMapIdForMapFile"
  >,
) {
  const activeSession = getCurrentCanonicalSession(
    workspaceState.activeSession,
    plannerWorkspaceState,
    workspaceController,
  );
  return {
    activeSession,
    plannerMapId: plannerWorkspaceState.selectedPlannerMapId,
    mapImageExporter:
      registeredMapImageExporter?.plannerMapId === plannerWorkspaceState.selectedPlannerMapId
        ? registeredMapImageExporter.mapImageExporter
        : null,
  };
}

function createPlannerWorkspaceMapSaveContext(
  plannerWorkspaceState: PlannerWorkspaceState,
  workspaceState: PlannerWorkspacePersistenceProjectState,
  registeredMapImageExporter: Readonly<{
    plannerMapId: string;
    mapImageExporter: MapImageExporter;
  }> | null,
  workspaceController: Pick<
    ReferenceProjectWorkspaceController,
    "getPlannerMapIdForMapFile" | "getState"
  >,
): PlannerWorkspaceMapSaveContext {
  const plannerMapId = plannerWorkspaceState.selectedPlannerMapId;
  if (
    registeredMapImageExporter === null
    || registeredMapImageExporter.plannerMapId !== plannerMapId
  ) {
    const controllerState = workspaceController.getState();
    throw new MapImageExportError(
      "Cannot capture the current map preview because its exporter is unavailable; received project ID "
        + `${JSON.stringify(controllerState.activeSession?.projectId ?? controllerState.activeProject?.id ?? null)}, map ID `
        + `${JSON.stringify(controllerState.activeSession?.mapId ?? null)}, planner map ID `
        + `${JSON.stringify(plannerMapId)}, and exporter planner map ID `
        + `${JSON.stringify(registeredMapImageExporter?.plannerMapId ?? null)}.`,
    );
  }

  const controllerState = workspaceController.getState();
  const workspaceCanonicalSession = getCurrentCanonicalSession(
    workspaceState.activeSession,
    plannerWorkspaceState,
    workspaceController,
  );
  if (!hasSameCanonicalSessionIdentity(
    workspaceCanonicalSession,
    controllerState.activeSession,
  )) {
    throw new MapImageExportError(
      "Cannot capture the current map preview because the workspace and controller sessions differ; received workspace project ID "
        + `${JSON.stringify(workspaceCanonicalSession?.projectId ?? null)}, map ID `
        + `${JSON.stringify(workspaceCanonicalSession?.mapId ?? null)}, controller project ID `
        + `${JSON.stringify(controllerState.activeSession?.projectId ?? null)}, map ID `
        + `${JSON.stringify(controllerState.activeSession?.mapId ?? null)}, and planner map ID `
        + `${JSON.stringify(plannerMapId)}.`,
    );
  }

  if (controllerState.activeSession !== null) {
    const activeSessionPlannerMapId = workspaceController.getPlannerMapIdForMapFile(
      controllerState.activeSession.sourceMap.mapFile,
    );
    if (activeSessionPlannerMapId !== plannerMapId) {
      throw new MapImageExportError(
        "Cannot capture the current map preview because the active session resolves to another planner map; received project ID "
          + `${JSON.stringify(controllerState.activeSession.projectId)}, map ID `
          + `${JSON.stringify(controllerState.activeSession.mapId)}, resolved planner map ID `
          + `${JSON.stringify(activeSessionPlannerMapId)}, and current planner map ID `
          + `${JSON.stringify(plannerMapId)}.`,
      );
    }
  }

  return {
    activeProjectId: controllerState.activeProject?.id ?? null,
    activeSessionMapId: controllerState.activeSession?.mapId ?? null,
    activeSessionProjectId: controllerState.activeSession?.projectId ?? null,
    mapImageExporter: registeredMapImageExporter.mapImageExporter,
    plannerMapId,
  };
}

function assertPlannerWorkspaceMapSaveContextIsCurrent(
  capturedMapSaveContext: PlannerWorkspaceMapSaveContext,
  savedPlannerWorkspaceMapLayout: PlannerWorkspaceMapLayoutSnapshot,
  currentPlannerWorkspaceState: PlannerWorkspaceState,
  currentWorkspaceState: PlannerWorkspacePersistenceProjectState,
  registeredMapImageExporter: Readonly<{
    plannerMapId: string;
    mapImageExporter: MapImageExporter;
  }> | null,
  workspaceController: Pick<
    ReferenceProjectWorkspaceController,
    "getPlannerMapIdForMapFile" | "getState"
  >,
): void {
  const currentMapSaveContext = createPlannerWorkspaceMapSaveContext(
    currentPlannerWorkspaceState,
    currentWorkspaceState,
    registeredMapImageExporter,
    workspaceController,
  );
  if (
    !hasSamePlannerWorkspaceMapSaveContext(
      capturedMapSaveContext,
      currentMapSaveContext,
    )
  ) {
    throw new MapImageExportError(
      "Planner map save context changed during thumbnail capture; received current project ID "
        + `${JSON.stringify(currentMapSaveContext.activeProjectId)}, current session project ID `
        + `${JSON.stringify(currentMapSaveContext.activeSessionProjectId)}, map ID `
        + `${JSON.stringify(currentMapSaveContext.activeSessionMapId)}, planner map ID `
        + `${JSON.stringify(currentMapSaveContext.plannerMapId)}, and exporter `
        + `${JSON.stringify(currentMapSaveContext.mapImageExporter === capturedMapSaveContext.mapImageExporter ? "captured" : "different")}; captured project ID `
        + `${JSON.stringify(capturedMapSaveContext.activeProjectId)}, session project ID `
        + `${JSON.stringify(capturedMapSaveContext.activeSessionProjectId)}, map ID `
        + `${JSON.stringify(capturedMapSaveContext.activeSessionMapId)}, and planner map ID `
        + `${JSON.stringify(capturedMapSaveContext.plannerMapId)}.`,
    );
  }

  const currentActiveSession = workspaceController.getState().activeSession;
  assertPlannerWorkspaceMapLayoutMatchesSave(
    savedPlannerWorkspaceMapLayout,
    currentPlannerWorkspaceState,
    currentActiveSession,
  );
}

function hasSameCanonicalSessionIdentity(
  firstSession: ReferenceProjectWorkspaceState["activeSession"],
  secondSession: ReferenceProjectWorkspaceState["activeSession"],
): boolean {
  return firstSession === null
    ? secondSession === null
    : secondSession !== null
      && firstSession.projectId === secondSession.projectId
      && firstSession.mapId === secondSession.mapId;
}

function hasSamePlannerWorkspaceMapSaveContext(
  firstContext: PlannerWorkspaceMapSaveContext,
  secondContext: PlannerWorkspaceMapSaveContext,
): boolean {
  return firstContext.activeProjectId === secondContext.activeProjectId
    && firstContext.activeSessionMapId === secondContext.activeSessionMapId
    && firstContext.activeSessionProjectId === secondContext.activeSessionProjectId
    && firstContext.mapImageExporter === secondContext.mapImageExporter
    && firstContext.plannerMapId === secondContext.plannerMapId;
}

function requireSavedPlannerWorkspaceMapSession(
  plannerMapId: string,
  workspaceController: Pick<
    ReferenceProjectWorkspaceController,
    "getPlannerMapIdForMapFile" | "getState"
  >,
) {
  const workspaceState = workspaceController.getState();
  const activeSession = workspaceState.activeSession;
  if (
    activeSession === null
    || workspaceState.activeProject?.id !== activeSession.projectId
  ) {
    throw new MapImageExportError(
      "Cannot save the map preview after saving the current map because its canonical session is unavailable; received project ID "
        + `${JSON.stringify(activeSession?.projectId ?? workspaceState.activeProject?.id ?? null)}, map ID `
        + `${JSON.stringify(activeSession?.mapId ?? null)}, and planner map ID `
        + `${JSON.stringify(plannerMapId)}.`,
    );
  }

  const savedSessionPlannerMapId = workspaceController.getPlannerMapIdForMapFile(
    activeSession.sourceMap.mapFile,
  );
  if (savedSessionPlannerMapId !== plannerMapId) {
    throw new MapImageExportError(
      "Cannot save the map preview because the saved canonical session resolves to another planner map; received project ID "
        + `${JSON.stringify(activeSession.projectId)}, map ID `
        + `${JSON.stringify(activeSession.mapId)}, resolved planner map ID `
        + `${JSON.stringify(savedSessionPlannerMapId)}, and captured planner map ID `
        + `${JSON.stringify(plannerMapId)}.`,
    );
  }
  return activeSession;
}

function createPlannerWorkspaceMapLayoutSnapshot(
  plannerWorkspaceState: PlannerWorkspaceState,
): PlannerWorkspaceMapLayoutSnapshot {
  return {
    mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
    placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
    season: plannerWorkspaceState.season,
    selectedPlannerMapId: plannerWorkspaceState.selectedPlannerMapId,
  };
}

function assertPlannerWorkspaceMapLayoutMatchesSave(
  savedPlannerWorkspaceMapLayout: PlannerWorkspaceMapLayoutSnapshot,
  currentPlannerWorkspaceState: PlannerWorkspaceState,
  currentSession: ReferenceProjectWorkspaceState["activeSession"],
): void {
  const changedLayoutFields: string[] = [];
  if (
    savedPlannerWorkspaceMapLayout.selectedPlannerMapId
    !== currentPlannerWorkspaceState.selectedPlannerMapId
  ) {
    changedLayoutFields.push("selectedPlannerMapId");
  }
  if (savedPlannerWorkspaceMapLayout.season !== currentPlannerWorkspaceState.season) {
    changedLayoutFields.push("season");
  }
  if (
    JSON.stringify(savedPlannerWorkspaceMapLayout.mapRenderOptions)
    !== JSON.stringify(currentPlannerWorkspaceState.mapRenderOptions)
  ) {
    changedLayoutFields.push("mapRenderOptions");
  }
  if (
    JSON.stringify(
      createNormalizedPlacementSnapshotForComparison(
        savedPlannerWorkspaceMapLayout.placementSnapshot,
      ),
    )
    !== JSON.stringify(
      createNormalizedPlacementSnapshotForComparison(
        currentPlannerWorkspaceState.placementHistory.currentState,
      ),
    )
  ) {
    changedLayoutFields.push("placementSnapshot");
  }
  if (changedLayoutFields.length === 0) return;

  throw new MapImageExportError(
    "Cannot save the map preview because the current planner layout changed during thumbnail capture; received changed fields "
      + `${JSON.stringify(changedLayoutFields)}, current project ID `
      + `${JSON.stringify(currentSession?.projectId ?? null)}, map ID `
      + `${JSON.stringify(currentSession?.mapId ?? null)}, saved planner map ID `
      + `${JSON.stringify(savedPlannerWorkspaceMapLayout.selectedPlannerMapId)}, and current planner map ID `
      + `${JSON.stringify(currentPlannerWorkspaceState.selectedPlannerMapId)}.`,
  );
}

function createNormalizedPlacementSnapshotForComparison(
  placementSnapshot: PlannerWorkspaceState["placementHistory"]["currentState"],
) {
  const persistentPlacementSnapshot = createPersistentPlacementSnapshot(
    placementSnapshot,
  );
  return {
    ...persistentPlacementSnapshot,
    interiorDecor:
      persistentPlacementSnapshot.interiorDecor ?? createEmptyInteriorDecorState(),
  };
}
