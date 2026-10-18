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

export const automaticMapSaveDelayMilliseconds = 300;

const canonicalMapSaveBeforeAddMapByController = new WeakMap<
  object,
  () => Promise<boolean>
>();

const canonicalMapSaveBeforeProjectSwitchByController = new WeakMap<
  object,
  () => Promise<void>
>();

export function readCanonicalMapSaveBeforeAddMap(
  workspaceController: object,
): (() => Promise<boolean>) | null {
  if (typeof workspaceController !== "object" || workspaceController === null) {
    throw new TypeError(
      "Cannot save the current map before adding a map because workspaceController is "
        + `${workspaceController === null ? "null" : typeof workspaceController}.`,
    );
  }
  return canonicalMapSaveBeforeAddMapByController.get(workspaceController) ?? null;
}

export function readCanonicalMapSaveBeforeProjectSwitch(
  workspaceController: object,
): (() => Promise<void>) | null {
  if (typeof workspaceController !== "object" || workspaceController === null) {
    throw new TypeError(
      "Cannot save the current map before switching projects because workspaceController is "
        + `${workspaceController === null ? "null" : typeof workspaceController}.`,
    );
  }
  return canonicalMapSaveBeforeProjectSwitchByController.get(workspaceController) ?? null;
}

type PlannerWorkspacePersistenceController = Pick<
  ReferenceProjectWorkspaceController,
  | "clearActiveProject"
  | "createMap"
  | "createProject"
  | "createProjectWithFirstMap"
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

type CanonicalSnapshotSaveIdentity = Readonly<{
  exporter: MapImageExporter;
  layoutKey: string;
  mapId: string;
  projectId: string;
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
  onAutomaticSaveSettled?: (caughtError: unknown | null) => void;
  workspaceController: PlannerWorkspacePersistenceController;
}>;

export type PlannerWorkspacePersistenceRuntime = Readonly<{
  cancelPendingAutomaticSave: () => void;
  captureCleanMapImage: (screenshotResolution: ScreenshotResolution) => Promise<Blob>;
  captureScreenshot: (screenshotResolution: ScreenshotResolution) => Promise<Blob>;
  clearMapImageExporter: (plannerMapId: string) => void;
  handleMapChange: (plannerMapId: string) => Promise<void>;
  handleMapImageExporterReady: (
    receivedPlannerMapId: string,
    receivedMapImageExporter: MapImageExporter | null,
  ) => void;
  saveCurrentMap: () => void;
  createProjectWithCurrentMap: () => Promise<void>;
  saveCurrentMapAndRefreshThumbnail: () => Promise<void>;
  scheduleAutomaticSave: () => void;
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
  onAutomaticSaveSettled,
  workspaceController,
}: PlannerWorkspacePersistenceRuntimeInput): PlannerWorkspacePersistenceRuntime {
  const canonicalMapIdentityReference = createCanonicalMapIdentityReference();
  const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
  let currentPlannerWorkspaceState = initialPlannerWorkspaceState;
  let currentWorkspaceState = initialWorkspaceState;
  let pendingSmartSaveCanonicalSession: PendingSmartSaveCanonicalSession | null = null;
  let shouldPreserveSavePanelOnCanonicalSynchronization = false;
  let previewSaveTail: Promise<void> = Promise.resolve();
  let mapChangeTail: Promise<void> = Promise.resolve();
  let automaticSaveTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let hasUnsavedCanonicalEdit = false;
  let automaticSaveFailure: unknown | null = null;
  let staleAutomaticSaveError: unknown | null = null;
  let inFlightAutomaticSave: Promise<void> | null = null;
  let inFlightPreviewSave: Promise<unknown> | null = null;

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
      const libraryIsOpen = currentPlannerWorkspaceState.modalId === "save-panel";
      if (shouldPreserveSavePanelOnCanonicalSynchronization || libraryIsOpen) {
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
    if (receivedMapImageExporter === null) return;
    if (receivedPlannerMapId !== currentPlannerWorkspaceState.selectedPlannerMapId) {
      return;
    }
    resumeUnsavedAutomaticSaveWhenExporterReturns();
  }

  function resumeUnsavedAutomaticSaveWhenExporterReturns(): void {
    if (!hasUnsavedCanonicalEdit && automaticSaveFailure === null) return;
    if (automaticSaveTimeoutId !== null || inFlightAutomaticSave !== null) return;
    if (!canSaveLatestCanonicalSnapshot()) return;
    scheduleAutomaticSave();
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

  function handleMapChange(plannerMapId: string): Promise<void> {
    const queuedMapChange = mapChangeTail.then(
      () => changeMapAfterAutomaticSave(plannerMapId),
      () => changeMapAfterAutomaticSave(plannerMapId),
    );
    mapChangeTail = queuedMapChange.then(
      () => undefined,
      () => undefined,
    );
    return queuedMapChange;
  }

  async function changeMapAfterAutomaticSave(plannerMapId: string): Promise<void> {
    const didFinishFirstPreviewSave = await waitForFirstPreviewSaveBeforeMapChange();
    if (!didFinishFirstPreviewSave) return;
    const didFlushUnsavedCanonicalEdit = await flushUnsavedCanonicalEditBeforeMapChange();
    if (!didFlushUnsavedCanonicalEdit) return;
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

  function saveCurrentMapAndRefreshThumbnail(): Promise<void> {
    cancelPendingAutomaticSave();
    return enqueuePreviewSave(() => saveCurrentMapAndRefreshThumbnailNow());
  }

  async function saveCurrentMapAndRefreshThumbnailNow(): Promise<void> {
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

  function createProjectWithCurrentMap(): Promise<void> {
    return enqueuePreviewSave(async () => {
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
      const selectedPlannerMap = getPlannerMapById(
        currentPlannerWorkspaceState.selectedPlannerMapId,
      );
      workspaceController.createProjectWithFirstMap({
        edits: {
          mapRenderOptions: currentPlannerWorkspaceState.mapRenderOptions,
          placementSnapshot: currentPlannerWorkspaceState.placementHistory.currentState,
          season: currentPlannerWorkspaceState.season,
        },
        label: selectedPlannerMap.displayName,
        mapFile: selectedPlannerMap.mapFile,
        projectName: newProjectName,
        season: currentPlannerWorkspaceState.season,
        webpBytes: capturedPlannerMapThumbnail.webpBytes,
      });
      currentWorkspaceState = {
        activeSession: workspaceController.getState().activeSession,
      };
      shouldPreserveSavePanelOnCanonicalSynchronization = true;
    });
  }

  function saveExistingCanonicalMapAndRefreshThumbnail(): Promise<boolean> {
    return enqueuePreviewSave(async () => {
      if (readCurrentCanonicalSession() === null) {
        assertAutomaticSaveCanSkipMissingCanonicalSession();
        return false;
      }
      await saveCurrentMapAndRefreshThumbnailNow();
      return true;
    });
  }

  function enqueuePreviewSave<SaveResult>(
    saveOperation: () => Promise<SaveResult>,
  ): Promise<SaveResult> {
    const queuedPreviewSave = previewSaveTail.then(saveOperation, saveOperation);
    previewSaveTail = queuedPreviewSave.then(
      () => undefined,
      () => undefined,
    );
    trackInFlightPreviewSave(queuedPreviewSave);
    return queuedPreviewSave;
  }

  function trackInFlightPreviewSave(queuedPreviewSave: Promise<unknown>): void {
    inFlightPreviewSave = queuedPreviewSave;
    queuedPreviewSave.then(
      () => {
        if (inFlightPreviewSave === queuedPreviewSave) {
          inFlightPreviewSave = null;
        }
      },
      () => {
        if (inFlightPreviewSave === queuedPreviewSave) {
          inFlightPreviewSave = null;
        }
      },
    );
  }

  async function waitForFirstPreviewSaveBeforeMapChange(): Promise<boolean> {
    const previewSaveInFlight = inFlightPreviewSave;
    if (previewSaveInFlight === null || readCurrentCanonicalSession() !== null) {
      return true;
    }
    try {
      await previewSaveInFlight;
    } catch (caughtError: unknown) {
      reportBlockedAutomaticSave(caughtError);
      return false;
    }
    return true;
  }

  function cancelPendingAutomaticSave(): void {
    if (automaticSaveTimeoutId === null) return;
    clearTimeout(automaticSaveTimeoutId);
    automaticSaveTimeoutId = null;
  }

  function scheduleAutomaticSave(): void {
    if (readCurrentCanonicalSession() === null) {
      assertAutomaticSaveCanSkipMissingCanonicalSession();
      return;
    }
    cancelPendingAutomaticSave();
    hasUnsavedCanonicalEdit = true;
    automaticSaveFailure = null;
    automaticSaveTimeoutId = setTimeout(() => {
      automaticSaveTimeoutId = null;
      void runAutomaticSave();
    }, automaticMapSaveDelayMilliseconds);
  }

  function runAutomaticSave(): Promise<void> {
    if (inFlightAutomaticSave !== null) return inFlightAutomaticSave;
    const automaticSavePromise = performAutomaticSave().finally(() => {
      if (inFlightAutomaticSave === automaticSavePromise) {
        inFlightAutomaticSave = null;
      }
    });
    inFlightAutomaticSave = automaticSavePromise;
    return automaticSavePromise;
  }

  async function performAutomaticSave(): Promise<void> {
    const layoutKeyBeforeSave = createAutomaticMapSaveLayoutKey(
      currentPlannerWorkspaceState,
    );
    if (shouldDeferAutomaticSaveUntilMapImageExporterReturns()) {
      deferAutomaticSaveUntilMapImageExporterReturns();
      return;
    }
    try {
      const didSaveCanonicalMap = await saveExistingCanonicalMapAndRefreshThumbnail();
      if (!didSaveCanonicalMap) return;
      if (
        readCurrentCanonicalSession() === null
        || createAutomaticMapSaveLayoutKey(currentPlannerWorkspaceState) !== layoutKeyBeforeSave
      ) {
        if (readCurrentCanonicalSession() !== null) scheduleAutomaticSave();
        return;
      }
      hasUnsavedCanonicalEdit = false;
      automaticSaveFailure = null;
      staleAutomaticSaveError = null;
      settleAutomaticSave(null, onAutomaticSaveSettled);
    } catch (caughtError: unknown) {
      handleAutomaticSaveFailure(caughtError);
    }
  }

  function handleAutomaticSaveFailure(caughtError: unknown): void {
    hasUnsavedCanonicalEdit = true;
    if (
      isRetryableUnavailableMapImageExporterError(caughtError)
      && !canSaveLatestCanonicalSnapshot()
    ) {
      deferAutomaticSaveUntilMapImageExporterReturns(caughtError);
      return;
    }
    if (
      isStaleMapPreviewCaptureError(caughtError)
      && canSaveLatestCanonicalSnapshot()
    ) {
      staleAutomaticSaveError = caughtError;
      scheduleAutomaticSave();
      return;
    }
    staleAutomaticSaveError = null;
    automaticSaveFailure = caughtError;
    settleAutomaticSave(caughtError, onAutomaticSaveSettled);
  }

  function shouldDeferAutomaticSaveUntilMapImageExporterReturns(): boolean {
    return readCurrentCanonicalSession() !== null
      && !canSaveLatestCanonicalSnapshot();
  }

  function deferAutomaticSaveUntilMapImageExporterReturns(
    caughtError: unknown | null = null,
  ): void {
    hasUnsavedCanonicalEdit = true;
    automaticSaveFailure = null;
    if (caughtError !== null) {
      staleAutomaticSaveError = caughtError;
    }
  }

  async function flushUnsavedCanonicalEditBeforeMapChange(): Promise<boolean> {
    // A matching in-flight save clears the unsaved flag and leaves the debounce
    // that a restored layout change armed. Drop that timer before the map switch.
    cancelPendingAutomaticSave();
    if (!hasUnsavedCanonicalEdit && inFlightAutomaticSave === null) return true;
    automaticSaveFailure = null;

    while (hasUnsavedCanonicalEdit && automaticSaveFailure === null) {
      const canonicalSaveAttemptId = readLatestCanonicalSaveAttemptId();
      if (canonicalSaveAttemptId === null) {
        reportBlockedAutomaticSave(staleAutomaticSaveError ?? createBlockedAutomaticSaveError());
        return false;
      }
      const joinedInFlightAutomaticSave = inFlightAutomaticSave !== null;
      cancelPendingAutomaticSave();
      await runAutomaticSave();
      if (!hasUnsavedCanonicalEdit || automaticSaveFailure !== null) break;
      if (joinedInFlightAutomaticSave) continue;
      const canonicalSaveAttemptIdAfterSave = readLatestCanonicalSaveAttemptId();
      if (
        canonicalSaveAttemptIdAfterSave !== null
        && isSameCanonicalSnapshotSaveIdentity(
          canonicalSaveAttemptId,
          canonicalSaveAttemptIdAfterSave,
        )
      ) {
        cancelPendingAutomaticSave();
        reportBlockedAutomaticSave(
          staleAutomaticSaveError ?? createBlockedAutomaticSaveError(),
        );
        return false;
      }
    }

    const didSaveCanonicalEditBeforeMapChange =
      !hasUnsavedCanonicalEdit && automaticSaveFailure === null;
    if (didSaveCanonicalEditBeforeMapChange) {
      cancelPendingAutomaticSave();
    }
    return didSaveCanonicalEditBeforeMapChange;
  }

  async function savePendingCanonicalMapBeforeAddMap(): Promise<boolean> {
    const previewSaveInFlight = inFlightPreviewSave;
    if (
      previewSaveInFlight !== null
      && !hasUnsavedCanonicalEdit
      && inFlightAutomaticSave === null
    ) {
      try {
        await previewSaveInFlight;
      } catch (caughtError: unknown) {
        reportBlockedAutomaticSave(caughtError);
        return false;
      }
    }
    return flushUnsavedCanonicalEditBeforeMapChange();
  }

  async function savePendingCanonicalMapBeforeProjectSwitch(): Promise<void> {
    const didSavePendingCanonicalMap = await savePendingCanonicalMapBeforeAddMap();
    if (didSavePendingCanonicalMap) return;
    throw readBlockedProjectSwitchError();
  }

  function readBlockedProjectSwitchError(): Error {
    if (automaticSaveFailure instanceof Error) return automaticSaveFailure;
    if (staleAutomaticSaveError instanceof Error) return staleAutomaticSaveError;
    const blockedSaveValue = automaticSaveFailure ?? staleAutomaticSaveError;
    if (blockedSaveValue !== null) {
      return new Error(
        "Cannot switch the local project because the current map was not saved: "
          + `${JSON.stringify(String(blockedSaveValue))}.`,
      );
    }
    return createBlockedAutomaticSaveError();
  }

  function reportBlockedAutomaticSave(blockedError: unknown): void {
    hasUnsavedCanonicalEdit = readCurrentCanonicalSession() !== null;
    automaticSaveFailure = blockedError;
    settleAutomaticSave(blockedError, onAutomaticSaveSettled);
  }

  function readCurrentCanonicalSession() {
    return readExistingCanonicalSession(
      currentWorkspaceState,
      currentPlannerWorkspaceState,
      workspaceController,
    );
  }

  function assertAutomaticSaveCanSkipMissingCanonicalSession(): void {
    const controllerState = workspaceController.getState();
    const activeProject = controllerState.activeProject;
    const activeSession = controllerState.activeSession;
    const activeSessionMapId = activeSession === null ? null : activeSession.mapId;
    if (activeProject === null || activeProject.project.maps.length === 0) return;
    if (activeSession !== null) return;
    const receivedMapIds = activeProject.project.maps.map((projectMap) => projectMap.id);
    cancelPendingAutomaticSave();
    throw new Error(
      "Cannot skip the automatic map save because the active project has maps but no canonical session. "
        + `Received project ID ${JSON.stringify(activeProject.id)}, `
        + `active map ID ${JSON.stringify(activeProject.project.activeMapId)}, `
        + `map IDs ${JSON.stringify(receivedMapIds)}, `
        + `session map ID ${JSON.stringify(activeSessionMapId)}, `
        + `workspace session map ID ${JSON.stringify(currentWorkspaceState.activeSession?.mapId ?? null)}, `
        + `planner project ID ${JSON.stringify(currentPlannerWorkspaceState.activeProjectId)}, `
        + `planner map ID ${JSON.stringify(currentPlannerWorkspaceState.activeMapId)}, `
        + `and selected planner map ID ${JSON.stringify(currentPlannerWorkspaceState.selectedPlannerMapId)}.`,
    );
  }

  function canSaveLatestCanonicalSnapshot(): boolean {
    if (readCurrentCanonicalSession() === null) return false;
    const registeredMapImageExporter = currentMapImageExporterSlot.current;
    return registeredMapImageExporter !== null
      && registeredMapImageExporter.plannerMapId
        === currentPlannerWorkspaceState.selectedPlannerMapId;
  }

  function readLatestCanonicalSaveAttemptId(): CanonicalSnapshotSaveIdentity | null {
    if (!canSaveLatestCanonicalSnapshot()) return null;
    const canonicalSession = readCurrentCanonicalSession();
    const registeredMapImageExporter = currentMapImageExporterSlot.current;
    if (canonicalSession === null || registeredMapImageExporter === null) return null;
    return {
      exporter: registeredMapImageExporter.mapImageExporter,
      layoutKey: createAutomaticMapSaveLayoutKey(currentPlannerWorkspaceState),
      mapId: canonicalSession.mapId,
      projectId: canonicalSession.projectId,
    };
  }

  function createBlockedAutomaticSaveError(): Error {
    const plannerMapId = currentPlannerWorkspaceState.selectedPlannerMapId;
    const canonicalSession = readCurrentCanonicalSession();
    const controllerState = workspaceController.getState();
    const registeredMapImageExporter = currentMapImageExporterSlot.current;
    if (canonicalSession === null) {
      return new Error(
        "Cannot finish the automatic map save before changing planner maps because the canonical session is missing. "
          + `Received workspace project ID ${JSON.stringify(currentWorkspaceState.activeSession?.projectId ?? null)}, `
          + `workspace map ID ${JSON.stringify(currentWorkspaceState.activeSession?.mapId ?? null)}, `
          + `controller project ID ${JSON.stringify(controllerState.activeSession?.projectId ?? controllerState.activeProject?.id ?? null)}, `
          + `controller map ID ${JSON.stringify(controllerState.activeSession?.mapId ?? null)}, `
          + `and planner map ID ${JSON.stringify(plannerMapId)}.`,
      );
    }
    const resolvedPlannerMapId = workspaceController.getPlannerMapIdForMapFile(
      canonicalSession.sourceMap.mapFile,
    );
    return new Error(
      "Cannot finish the automatic map save before changing planner maps because the latest snapshot cannot be saved. "
        + `Received project ID ${JSON.stringify(canonicalSession.projectId)}, `
        + `map ID ${JSON.stringify(canonicalSession.mapId)}, `
        + `resolved planner map ID ${JSON.stringify(resolvedPlannerMapId)}, `
        + `current planner map ID ${JSON.stringify(plannerMapId)}, `
        + `and exporter planner map ID ${JSON.stringify(registeredMapImageExporter?.plannerMapId ?? null)}.`,
    );
  }

  canonicalMapSaveBeforeAddMapByController.set(
    workspaceController,
    savePendingCanonicalMapBeforeAddMap,
  );
  canonicalMapSaveBeforeProjectSwitchByController.set(
    workspaceController,
    savePendingCanonicalMapBeforeProjectSwitch,
  );

  return {
    cancelPendingAutomaticSave,
    captureCleanMapImage,
    captureScreenshot,
    clearMapImageExporter,
    handleMapChange,
    handleMapImageExporterReady,
    saveCurrentMap,
    createProjectWithCurrentMap,
    saveCurrentMapAndRefreshThumbnail,
    scheduleAutomaticSave,
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

function isSameCanonicalSnapshotSaveIdentity(
  firstIdentity: CanonicalSnapshotSaveIdentity,
  secondIdentity: CanonicalSnapshotSaveIdentity,
): boolean {
  return firstIdentity.exporter === secondIdentity.exporter
    && firstIdentity.layoutKey === secondIdentity.layoutKey
    && firstIdentity.mapId === secondIdentity.mapId
    && firstIdentity.projectId === secondIdentity.projectId;
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

export function createAutomaticMapSaveLayoutKey(
  plannerWorkspaceState: PlannerWorkspaceState,
): string {
  return JSON.stringify({
    mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
    placementSnapshot: createNormalizedPlacementSnapshotForComparison(
      plannerWorkspaceState.placementHistory.currentState,
    ),
    season: plannerWorkspaceState.season,
  });
}

function readExistingCanonicalSession(
  workspaceState: PlannerWorkspacePersistenceProjectState,
  plannerWorkspaceState: PlannerWorkspaceState,
  workspaceController: Pick<
    ReferenceProjectWorkspaceController,
    "getPlannerMapIdForMapFile" | "getState"
  >,
) {
  const snapshotSession = getCurrentCanonicalSession(
    workspaceState.activeSession,
    plannerWorkspaceState,
    workspaceController,
  );
  if (snapshotSession === null) return null;
  const controllerSession = getCurrentCanonicalSession(
    workspaceController.getState().activeSession,
    plannerWorkspaceState,
    workspaceController,
  );
  if (
    controllerSession === null
    || controllerSession.projectId !== snapshotSession.projectId
    || controllerSession.mapId !== snapshotSession.mapId
  ) {
    return null;
  }
  return controllerSession;
}

function settleAutomaticSave(
  caughtError: unknown | null,
  onAutomaticSaveSettled: ((caughtError: unknown | null) => void) | undefined,
): void {
  if (onAutomaticSaveSettled !== undefined) {
    onAutomaticSaveSettled(caughtError);
    return;
  }
  if (caughtError === null) return;
  if (caughtError instanceof Error) throw caughtError;
  throw new Error(
    `Automatic map save failed: ${JSON.stringify(String(caughtError))}.`,
  );
}

function isStaleMapPreviewCaptureError(caughtError: unknown): boolean {
  return caughtError instanceof MapImageExportError
    && caughtError.message.includes("during thumbnail capture");
}

function isRetryableUnavailableMapImageExporterError(caughtError: unknown): boolean {
  return caughtError instanceof MapImageExportError
    && caughtError.message.includes("exporter is unavailable");
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
