"use client";

import { useEffect, useRef } from "react";
import type {
  MapImageExporter,
  ScreenshotResolution,
} from "../projects/map-image-export";
import {
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
  plannerWorkspaceState: PlannerWorkspaceState;
  workspaceController: ReferenceProjectWorkspaceController;
  workspaceState: ReferenceProjectWorkspaceState;
}>;

export function usePlannerWorkspacePersistenceControls({
  dispatchPlannerWorkspaceAction,
  plannerWorkspaceState,
  workspaceController,
  workspaceState,
}: PlannerWorkspacePersistenceControlsInput): Readonly<{
  captureScreenshot: (screenshotResolution: ScreenshotResolution) => Promise<Blob>;
  handleMapChange: (plannerMapId: string) => void;
  handleMapImageExporterReady: (
    receivedPlannerMapId: string,
    receivedMapImageExporter: MapImageExporter | null,
  ) => void;
  saveCurrentMap: () => void;
  saveThumbnail: () => Promise<void>;
}> {
  const persistenceRuntimeReference = useRef<
    PlannerWorkspacePersistenceRuntime | null
  >(null);
  if (persistenceRuntimeReference.current === null) {
    persistenceRuntimeReference.current = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction,
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: workspaceState,
      workspaceController,
    });
  }
  const persistenceRuntime = persistenceRuntimeReference.current;
  persistenceRuntime.updateWorkspaceSnapshot(
    plannerWorkspaceState,
    workspaceState,
  );

  useEffect(() => {
    persistenceRuntime.synchronizeCanonicalSession();
  }, [persistenceRuntime, workspaceState.activeSession]);

  useEffect(() => {
    const plannerMapId = plannerWorkspaceState.selectedPlannerMapId;
    return () => persistenceRuntime.clearMapImageExporter(plannerMapId);
  }, [persistenceRuntime, plannerWorkspaceState.selectedPlannerMapId]);

  return {
    captureScreenshot: persistenceRuntime.captureScreenshot,
    handleMapChange: persistenceRuntime.handleMapChange,
    handleMapImageExporterReady: persistenceRuntime.handleMapImageExporterReady,
    saveCurrentMap: persistenceRuntime.saveCurrentMap,
    saveThumbnail: persistenceRuntime.saveThumbnail,
  };
}
