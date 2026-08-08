import {
  MapImageExportError,
  type MapImageExporter,
  type ScreenshotResolution,
} from "../projects/map-image-export";
import type { ReferenceProjectWorkspaceState } from "../reference-runtime/use-reference-project-workspace";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";
import {
  createCanonicalMapIdentityReference,
  createCanonicalSessionTransition,
  getCurrentCanonicalSession,
} from "./planner-workspace-canonical-session";
import {
  captureCurrentMapScreenshot,
  createCurrentMapImageExporterSlot,
  updateCurrentMapImageExporter,
} from "./planner-workspace-map-image-exporter";
import { saveCurrentCanonicalMapThumbnail } from "./planner-workspace-thumbnail-save";
import type { PlannerWorkspaceAction, PlannerWorkspaceState } from "./planner-workspace-state";

type PlannerWorkspacePersistenceController = Pick<
  ReferenceProjectWorkspaceController,
  | "clearActiveProject"
  | "getPlannerMapIdForMapFile"
  | "saveOpenMap"
  | "saveThumbnail"
>;

type PlannerWorkspacePersistenceProjectState = Pick<
  ReferenceProjectWorkspaceState,
  "activeSession"
>;

type PlannerWorkspacePersistenceRuntimeInput = Readonly<{
  dispatchPlannerWorkspaceAction: (plannerWorkspaceAction: PlannerWorkspaceAction) => void;
  initialPlannerWorkspaceState: PlannerWorkspaceState;
  initialWorkspaceState: PlannerWorkspacePersistenceProjectState;
  workspaceController: PlannerWorkspacePersistenceController;
}>;

export type PlannerWorkspacePersistenceRuntime = Readonly<{
  captureScreenshot: (screenshotResolution: ScreenshotResolution) => Promise<Blob>;
  clearMapImageExporter: (plannerMapId: string) => void;
  handleMapChange: (plannerMapId: string) => void;
  handleMapImageExporterReady: (
    receivedPlannerMapId: string,
    receivedMapImageExporter: MapImageExporter | null,
  ) => void;
  saveCurrentMap: () => void;
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
  workspaceController,
}: PlannerWorkspacePersistenceRuntimeInput): PlannerWorkspacePersistenceRuntime {
  const canonicalMapIdentityReference = createCanonicalMapIdentityReference();
  const currentMapImageExporterSlot = createCurrentMapImageExporterSlot();
  let currentPlannerWorkspaceState = initialPlannerWorkspaceState;
  let currentWorkspaceState = initialWorkspaceState;

  function updateWorkspaceSnapshot(
    plannerWorkspaceState: PlannerWorkspaceState,
    workspaceState: PlannerWorkspacePersistenceProjectState,
  ): void {
    currentPlannerWorkspaceState = plannerWorkspaceState;
    currentWorkspaceState = workspaceState;
  }

  function synchronizeCanonicalSession(): void {
    const canonicalSessionAction = createCanonicalSessionTransition(
      currentWorkspaceState.activeSession,
      workspaceController,
      canonicalMapIdentityReference,
    );
    if (canonicalSessionAction !== null) {
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

  function handleMapChange(plannerMapId: string): void {
    changePlannerWorkspaceMap({
      dispatchPlannerWorkspaceAction,
      plannerMapId,
      workspaceController,
    });
  }

  function saveCurrentMap(): void {
    saveCurrentPlannerWorkspaceMap({
      plannerWorkspaceState: currentPlannerWorkspaceState,
      workspaceController,
      workspaceState: currentWorkspaceState,
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
    captureScreenshot,
    clearMapImageExporter,
    handleMapChange,
    handleMapImageExporterReady,
    saveCurrentMap,
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
    placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
    season: plannerWorkspaceState.season,
  });
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
