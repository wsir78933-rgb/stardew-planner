import type { ImportedGameSaveState } from "../game-save/game-save-import";
import type { PlannerWorkspaceAction } from "./planner-workspace-state";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";

type OpenUnsavedImportedGameSaveInput = Readonly<{
  dispatchPlannerWorkspaceAction: (plannerWorkspaceAction: PlannerWorkspaceAction) => void;
  importedGameSaveState: ImportedGameSaveState;
  workspaceController: Pick<ReferenceProjectWorkspaceController, "clearActiveProject">;
}>;

type OpenImportedGameSaveAndPreserveResultInput = OpenUnsavedImportedGameSaveInput &
  Readonly<{
    onImportedGameSaveResult: (importedGameSaveState: ImportedGameSaveState) => void;
  }>;

export function openUnsavedImportedGameSave({
  dispatchPlannerWorkspaceAction,
  importedGameSaveState,
  workspaceController,
}: OpenUnsavedImportedGameSaveInput): void {
  workspaceController.clearActiveProject();
  dispatchPlannerWorkspaceAction({
    placementSnapshot: importedGameSaveState.placementSnapshot,
    plannerMapId: importedGameSaveState.mapId,
    season: importedGameSaveState.season,
    type: "open-unsaved-imported-map",
  });
}

export function openImportedGameSaveAndPreserveResult({
  dispatchPlannerWorkspaceAction,
  importedGameSaveState,
  onImportedGameSaveResult,
  workspaceController,
}: OpenImportedGameSaveAndPreserveResultInput): void {
  openUnsavedImportedGameSave({
    dispatchPlannerWorkspaceAction,
    importedGameSaveState,
    workspaceController,
  });
  onImportedGameSaveResult(importedGameSaveState);
}
