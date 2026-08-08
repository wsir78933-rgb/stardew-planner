import { getPlannerMapById } from "../maps/map-catalog";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { ReferenceProjectWorkspaceController } from "../reference-runtime/use-reference-project-workspace";

type LocalProjectController = Pick<
  ReferenceProjectWorkspaceController,
  | "createProject"
  | "deleteProject"
  | "duplicateProject"
  | "exportProject"
  | "importProject"
  | "openProject"
  | "renameProject"
>;

type ProjectMapController = Pick<
  ReferenceProjectWorkspaceController,
  | "activateMap"
  | "copyMap"
  | "createMap"
  | "deleteMap"
  | "duplicateMap"
  | "moveMap"
  | "renameMap"
>;

export type PlannerLocalProjectActions = Readonly<{
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onExportProject: (projectId: string) => string;
  onImportProject: (serializedProject: string) => void;
  onOpenProject: (projectId: string) => void;
  onRenameProject: (projectId: string, requestedName: string) => void;
}>;

export type PlannerProjectMapActions = Readonly<{
  onAddMap: (plannerMapId: string) => void;
  onCopyMapInstance: (mapInstanceId: string, destinationProjectId: string) => void;
  onDeleteMapInstance: (mapInstanceId: string) => void;
  onDuplicateMapInstance: (mapInstanceId: string) => void;
  onMoveMapInstance: (mapInstanceId: string, destinationProjectId: string) => void;
  onOpenMapInstance: (mapInstanceId: string) => void;
  onRenameMapInstance: (mapInstanceId: string, requestedName: string) => void;
}>;

export function createPlannerLocalProjectActions({
  season,
  workspaceController,
}: Readonly<{
  season: TilesheetSeason;
  workspaceController: LocalProjectController;
}>): PlannerLocalProjectActions {
  return {
    onCreateProject: () => workspaceController.createProject({
      projectName: "Untitled Project",
      season,
    }),
    onDeleteProject: (projectId) => workspaceController.deleteProject(projectId),
    onDuplicateProject: (projectId) => workspaceController.duplicateProject(projectId),
    onExportProject: (projectId) => workspaceController.exportProject(projectId),
    onImportProject: (serializedProject) => workspaceController.importProject(serializedProject),
    onOpenProject: (projectId) => workspaceController.openProject(projectId),
    onRenameProject: (projectId, requestedName) =>
      workspaceController.renameProject(projectId, requestedName),
  };
}

export function createPlannerProjectMapActions({
  activeProjectId,
  season,
  workspaceController,
}: Readonly<{
  activeProjectId: string;
  season: TilesheetSeason;
  workspaceController: ProjectMapController;
}>): PlannerProjectMapActions {
  return {
    onAddMap: (plannerMapId) => {
      const plannerMap = getPlannerMapById(plannerMapId);
      workspaceController.createMap({
        projectId: activeProjectId,
        mapFile: plannerMap.mapFile,
        label: plannerMap.displayName,
        season,
      });
    },
    onCopyMapInstance: (mapInstanceId, destinationProjectId) =>
      workspaceController.copyMap({
        projectId: activeProjectId,
        mapId: mapInstanceId,
        targetProjectId: destinationProjectId,
      }),
    onDeleteMapInstance: (mapInstanceId) =>
      workspaceController.deleteMap({
        projectId: activeProjectId,
        mapId: mapInstanceId,
      }),
    onDuplicateMapInstance: (mapInstanceId) =>
      workspaceController.duplicateMap({
        projectId: activeProjectId,
        mapId: mapInstanceId,
      }),
    onMoveMapInstance: (mapInstanceId, destinationProjectId) =>
      workspaceController.moveMap({
        projectId: activeProjectId,
        mapId: mapInstanceId,
        targetProjectId: destinationProjectId,
      }),
    onOpenMapInstance: (mapInstanceId) => workspaceController.activateMap(mapInstanceId),
    onRenameMapInstance: (mapInstanceId, requestedName) =>
      workspaceController.renameMap({
        projectId: activeProjectId,
        mapId: mapInstanceId,
        requestedLabel: requestedName,
      }),
  };
}
