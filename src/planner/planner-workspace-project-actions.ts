import { getPlannerMapById } from "../maps/map-catalog";
import {
  readCanonicalMapSaveBeforeAddMap,
  readCanonicalMapSaveBeforeProjectSwitch,
} from "./planner-workspace-persistence-runtime";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type {
  ReferenceProjectWorkspaceController,
  ReferenceProjectWorkspaceState,
} from "../reference-runtime/use-reference-project-workspace";

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
  | "getState"
  | "moveMap"
  | "renameMap"
>;

export type PlannerLocalProjectActions = Readonly<{
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void | Promise<void>;
  onExportProject: (projectId: string) => string;
  onImportProject: (serializedProject: string) => void | Promise<void>;
  onOpenProject: (projectId: string) => void | Promise<void>;
  onRenameProject: (projectId: string, requestedName: string) => void;
}>;

export type PlannerProjectMapActions = Readonly<{
  onAddMap: (plannerMapId: string) => Promise<void>;
  onCopyMapInstance: (mapInstanceId: string, destinationProjectId: string) => void;
  onDeleteMapInstance: (mapInstanceId: string) => void;
  onDuplicateMapInstance: (mapInstanceId: string) => void;
  onMoveMapInstance: (mapInstanceId: string, destinationProjectId: string) => void;
  onOpenMapInstance: (mapInstanceId: string) => void;
  onRenameMapInstance: (mapInstanceId: string, requestedName: string) => void;
}>;

export async function createLocalProjectAndSaveCurrentMap({
  createProjectWithCurrentMap,
}: Readonly<{
  createProjectWithCurrentMap: () => Promise<void>;
}>): Promise<void> {
  assertLocalProjectCallback(
    createProjectWithCurrentMap,
    "Creating a local project with the current map requires createProjectWithCurrentMap",
  );
  await createProjectWithCurrentMap();
}

export function createPlannerLocalProjectActions({
  newProjectName = "Untitled Project",
  season,
  workspaceController,
}: Readonly<{
  newProjectName?: string;
  season: TilesheetSeason;
  workspaceController: LocalProjectController;
}>): PlannerLocalProjectActions {
  return {
    onCreateProject: () => workspaceController.createProject({
      projectName: newProjectName,
      season,
    }),
    onDeleteProject: (projectId) => workspaceController.deleteProject(projectId),
    onDuplicateProject: (projectId) => switchLocalProjectAfterPendingCanonicalSave(
      workspaceController,
      () => workspaceController.duplicateProject(projectId),
    ),
    onExportProject: (projectId) => workspaceController.exportProject(projectId),
    onImportProject: (serializedProject) => switchLocalProjectAfterPendingCanonicalSave(
      workspaceController,
      () => workspaceController.importProject(serializedProject),
    ),
    onOpenProject: (projectId) => switchLocalProjectAfterPendingCanonicalSave(
      workspaceController,
      () => workspaceController.openProject(projectId),
    ),
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
  const addProjectMap = (plannerMapId: string): void => {
    const plannerMap = getPlannerMapById(plannerMapId);
    const projectMapIdsBeforeCreate = readActiveProjectMapIds(
      workspaceController.getState(),
      activeProjectId,
    );
    workspaceController.createMap({
      projectId: activeProjectId,
      mapFile: plannerMap.mapFile,
      label: plannerMap.displayName,
      season,
    });
    const createdMapId = readCreatedProjectMapId({
      activeProjectId,
      expectedMapFile: plannerMap.mapFile,
      plannerMapId,
      projectMapIdsBeforeCreate,
      workspaceState: workspaceController.getState(),
    });
    workspaceController.activateMap(createdMapId);
    assertAddedMapSessionIsCanonical(
      workspaceController.getState(),
      activeProjectId,
      createdMapId,
      plannerMapId,
    );
  };

  return {
    onAddMap: (plannerMapId) => {
      const existingCanonicalMap = readExistingCanonicalProjectMap(
        workspaceController.getState(),
        activeProjectId,
      );
      const savePendingCanonicalMap = readCanonicalMapSaveBeforeAddMap(workspaceController);
      if (existingCanonicalMap !== null && savePendingCanonicalMap === null) {
        throw new Error(
          "Cannot add a map before saving the current map because no canonical map save is registered. "
            + `Received project ID ${JSON.stringify(existingCanonicalMap.projectId)}, `
            + `active map ID ${JSON.stringify(existingCanonicalMap.activeMapId)}, `
            + `session project ID ${JSON.stringify(existingCanonicalMap.sessionProjectId)}, `
            + `session map ID ${JSON.stringify(existingCanonicalMap.sessionMapId)}, `
            + `and planner map ID ${JSON.stringify(plannerMapId)}.`,
        );
      }
      return addProjectMapAfterSavingPendingCanonicalMap({
        addProjectMap,
        plannerMapId,
        savePendingCanonicalMap,
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

function switchLocalProjectAfterPendingCanonicalSave(
  workspaceController: object,
  switchProject: () => void,
): void | Promise<void> {
  const savePendingCanonicalMap = readCanonicalMapSaveBeforeProjectSwitch(
    workspaceController,
  );
  if (savePendingCanonicalMap === null) {
    switchProject();
    return;
  }
  return savePendingCanonicalMap().then(switchProject);
}

async function addProjectMapAfterSavingPendingCanonicalMap({
  addProjectMap,
  plannerMapId,
  savePendingCanonicalMap,
}: Readonly<{
  addProjectMap: (plannerMapId: string) => void;
  plannerMapId: string;
  savePendingCanonicalMap: (() => Promise<boolean>) | null;
}>): Promise<void> {
  if (savePendingCanonicalMap !== null) {
    const didSavePendingCanonicalMap = await savePendingCanonicalMap();
    if (!didSavePendingCanonicalMap) return;
  }
  addProjectMap(plannerMapId);
}

function readExistingCanonicalProjectMap(
  workspaceState: ReferenceProjectWorkspaceState,
  activeProjectId: string,
): Readonly<{
  activeMapId: string;
  projectId: string;
  sessionMapId: string;
  sessionProjectId: string;
}> | null {
  const activeProject = workspaceState.activeProject;
  const activeSession = workspaceState.activeSession;
  const activeMapId = activeProject?.project.activeMapId ?? null;
  if (
    activeProject === null
    || activeProject.id !== activeProjectId
    || activeProject.project.maps.length === 0
    || activeMapId === null
    || activeMapId.length === 0
    || activeSession === null
    || activeSession.projectId !== activeProject.id
    || activeSession.mapId !== activeMapId
  ) {
    return null;
  }
  return {
    activeMapId,
    projectId: activeProject.id,
    sessionMapId: activeSession.mapId,
    sessionProjectId: activeSession.projectId,
  };
}

function readActiveProjectMapIds(
  workspaceState: ReferenceProjectWorkspaceState,
  activeProjectId: string,
): ReadonlySet<string> {
  const activeProject = workspaceState.activeProject;
  if (activeProject === null || activeProject.id !== activeProjectId) {
    throw new Error(
      "Cannot add a map because the active project does not match the requested project. "
        + `Received active project ID ${JSON.stringify(activeProject?.id ?? null)} `
        + `and requested project ID ${JSON.stringify(activeProjectId)}.`,
    );
  }
  const projectMapIds = activeProject.project.maps.map((projectMap) => {
    if (typeof projectMap.id !== "string" || projectMap.id.length === 0) {
      throw new Error(
        `Cannot add a map because project ${JSON.stringify(activeProjectId)} has map ID `
          + `${JSON.stringify(projectMap.id)}.`,
      );
    }
    return projectMap.id;
  });
  if (new Set(projectMapIds).size !== projectMapIds.length) {
    throw new Error(
      `Cannot add a map because project ${JSON.stringify(activeProjectId)} has duplicate map IDs `
        + `${JSON.stringify(projectMapIds)}.`,
    );
  }
  return new Set(projectMapIds);
}

function readCreatedProjectMapId({
  activeProjectId,
  expectedMapFile,
  plannerMapId,
  projectMapIdsBeforeCreate,
  workspaceState,
}: Readonly<{
  activeProjectId: string;
  expectedMapFile: string;
  plannerMapId: string;
  projectMapIdsBeforeCreate: ReadonlySet<string>;
  workspaceState: ReferenceProjectWorkspaceState;
}>): string {
  const activeProject = workspaceState.activeProject;
  if (activeProject === null || activeProject.id !== activeProjectId) {
    throw new Error(
      "Cannot activate the added map because the active project changed during createMap. "
        + `Received active project ID ${JSON.stringify(activeProject?.id ?? null)}, `
        + `requested project ID ${JSON.stringify(activeProjectId)}, `
        + `and planner map ID ${JSON.stringify(plannerMapId)}.`,
    );
  }
  const createdMapIds = activeProject.project.maps
    .map((projectMap) => projectMap.id)
    .filter((projectMapId) => !projectMapIdsBeforeCreate.has(projectMapId));
  if (createdMapIds.length !== 1) {
    throw new Error(
      "Adding a project map must create exactly one map. "
        + `Received created map IDs ${JSON.stringify(createdMapIds)}, `
        + `previous map IDs ${JSON.stringify([...projectMapIdsBeforeCreate])}, `
        + `project ID ${JSON.stringify(activeProjectId)}, `
        + `and planner map ID ${JSON.stringify(plannerMapId)}.`,
    );
  }
  const createdMapId = createdMapIds[0];
  if (createdMapId === undefined || createdMapId.length === 0) {
    throw new Error(
      `Adding a project map returned an empty map ID; received ${JSON.stringify(createdMapId)} `
        + `for project ID ${JSON.stringify(activeProjectId)} `
        + `and planner map ID ${JSON.stringify(plannerMapId)}.`,
    );
  }
  const createdMap = activeProject.project.maps.find(
    (projectMap) => projectMap.id === createdMapId,
  );
  if (createdMap === undefined || createdMap.mapFile !== expectedMapFile) {
    throw new Error(
      "Adding a project map created a map with a different map file. "
        + `Received map ID ${JSON.stringify(createdMapId)}, `
        + `map file ${JSON.stringify(createdMap?.mapFile ?? null)}, `
        + `expected map file ${JSON.stringify(expectedMapFile)}, `
        + `project ID ${JSON.stringify(activeProjectId)}, `
        + `and planner map ID ${JSON.stringify(plannerMapId)}.`,
    );
  }
  return createdMapId;
}

function assertAddedMapSessionIsCanonical(
  workspaceState: ReferenceProjectWorkspaceState,
  activeProjectId: string,
  createdMapId: string,
  plannerMapId: string,
): void {
  const activeSession = workspaceState.activeSession;
  const activeMapId = workspaceState.activeProject?.project.activeMapId ?? null;
  if (
    workspaceState.activeProject?.id !== activeProjectId
    || activeMapId !== createdMapId
    || activeSession === null
    || activeSession.projectId !== activeProjectId
    || activeSession.mapId !== createdMapId
  ) {
    throw new Error(
      "Adding a project map did not activate its canonical session. "
        + `Received project ID ${JSON.stringify(workspaceState.activeProject?.id ?? null)}, `
        + `active map ID ${JSON.stringify(activeMapId)}, `
        + `session project ID ${JSON.stringify(activeSession?.projectId ?? null)}, `
        + `session map ID ${JSON.stringify(activeSession?.mapId ?? null)}, `
        + `expected project ID ${JSON.stringify(activeProjectId)}, `
        + `expected map ID ${JSON.stringify(createdMapId)}, `
        + `and planner map ID ${JSON.stringify(plannerMapId)}.`,
    );
  }
}

function assertLocalProjectCallback(
  projectCallback: unknown,
  requirement: string,
): asserts projectCallback is () => unknown {
  if (typeof projectCallback !== "function") {
    throw new TypeError(
      `${requirement}; received ${typeof projectCallback}.`,
    );
  }
}


