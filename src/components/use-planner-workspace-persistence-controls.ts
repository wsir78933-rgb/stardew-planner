"use client";

import { useEffect, useRef, useState } from "react";
import type {
  MapImageExporter,
  ScreenshotResolution,
} from "../projects/map-image-export";
import {
  createAutomaticMapSaveLayoutKey,
  createPlannerWorkspacePersistenceRuntime,
  type PlannerWorkspacePersistenceRuntime,
} from "../planner/planner-workspace-persistence-runtime";
import type { PlannerWorkspaceState } from "../planner/planner-workspace-state";
import type { PlannerWorkspaceStateController } from "../planner/use-planner-workspace-state";
import type {
  ReferenceProjectWorkspaceController,
  ReferenceProjectWorkspaceState,
} from "../reference-runtime/use-reference-project-workspace";

type PlannerWorkspacePersistenceControlsInput = Readonly<{
  dispatchPlannerWorkspaceAction: PlannerWorkspaceStateController["dispatchPlannerWorkspaceAction"];
  newProjectName: string;
  plannerWorkspaceState: PlannerWorkspaceState;
  workspaceController: ReferenceProjectWorkspaceController;
  workspaceState: ReferenceProjectWorkspaceState;
}>;

export function usePlannerWorkspacePersistenceControls({
  dispatchPlannerWorkspaceAction,
  newProjectName,
  plannerWorkspaceState,
  workspaceController,
  workspaceState,
}: PlannerWorkspacePersistenceControlsInput): Readonly<{
  captureCleanMapImage: (screenshotResolution: ScreenshotResolution) => Promise<Blob>;
  captureScreenshot: (screenshotResolution: ScreenshotResolution) => Promise<Blob>;
  handleMapChange: (plannerMapId: string) => Promise<void>;
  handleMapImageExporterReady: (
    receivedPlannerMapId: string,
    receivedMapImageExporter: MapImageExporter | null,
  ) => void;
  automaticSaveErrorMessage: string | null;
  saveCurrentMap: () => Promise<void>;
  createProjectWithCurrentMap: () => Promise<void>;
  saveThumbnail: () => Promise<void>;
}> {
  const [automaticSaveErrorMessage, setAutomaticSaveErrorMessage] = useState<string | null>(
    null,
  );
  const settleAutomaticSaveRef = useRef<(caughtError: unknown | null) => void>(
    () => undefined,
  );
  settleAutomaticSaveRef.current = (caughtError) => {
    setAutomaticSaveErrorMessage(describeAutomaticSaveError(caughtError));
  };
  const persistenceRuntimeReference = useRef<
    PlannerWorkspacePersistenceRuntime | null
  >(null);
  if (persistenceRuntimeReference.current === null) {
    persistenceRuntimeReference.current = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction,
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: workspaceState,
      newProjectName,
      onAutomaticSaveSettled: (caughtError) => {
        settleAutomaticSaveRef.current(caughtError);
      },
      workspaceController,
    });
  }
  const persistenceRuntime = persistenceRuntimeReference.current;
  persistenceRuntime.updateWorkspaceSnapshot(
    plannerWorkspaceState,
    workspaceState,
  );
  const automaticSaveLayoutKey = createAutomaticMapSaveLayoutKey(plannerWorkspaceState);
  const observedAutomaticSaveLayoutKeyRef = useRef<string | null>(null);

  useEffect(() => {
    persistenceRuntime.synchronizeCanonicalSession();
  }, [persistenceRuntime, workspaceState.activeSession]);

  useEffect(() => {
    if (observedAutomaticSaveLayoutKeyRef.current === null) {
      observedAutomaticSaveLayoutKeyRef.current = automaticSaveLayoutKey;
      return;
    }
    if (observedAutomaticSaveLayoutKeyRef.current === automaticSaveLayoutKey) {
      return;
    }
    observedAutomaticSaveLayoutKeyRef.current = automaticSaveLayoutKey;
    try {
      persistenceRuntime.scheduleAutomaticSave();
    } catch (caughtError: unknown) {
      settleAutomaticSaveRef.current(caughtError);
    }
  }, [automaticSaveLayoutKey, persistenceRuntime]);

  useEffect(() => {
    return () => persistenceRuntime.cancelPendingAutomaticSave();
  }, [persistenceRuntime]);

  useEffect(() => {
    const plannerMapId = plannerWorkspaceState.selectedPlannerMapId;
    return () => persistenceRuntime.clearMapImageExporter(plannerMapId);
  }, [persistenceRuntime, plannerWorkspaceState.selectedPlannerMapId]);

  return {
    automaticSaveErrorMessage,
    captureCleanMapImage: persistenceRuntime.captureCleanMapImage,
    captureScreenshot: persistenceRuntime.captureScreenshot,
    handleMapChange: persistenceRuntime.handleMapChange,
    handleMapImageExporterReady: persistenceRuntime.handleMapImageExporterReady,
    saveCurrentMap: persistenceRuntime.saveCurrentMapAndRefreshThumbnail,
    createProjectWithCurrentMap: persistenceRuntime.createProjectWithCurrentMap,
    saveThumbnail: persistenceRuntime.saveThumbnail,
  };
}

function describeAutomaticSaveError(caughtError: unknown | null): string | null {
  if (caughtError === null) return null;
  if (caughtError instanceof Error) return caughtError.message;
  return `Automatic map save failed: ${JSON.stringify(String(caughtError))}.`;
}
