import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyReferenceOpenMapEdits,
  createReferenceOpenMapSession,
  type ReferenceOpenMapEdits,
  type ReferenceOpenMapSession,
} from "./reference-project-editor-adapter";
import type {
  ReferenceProjectFolder,
  ReferenceProjectMap,
  ReferenceStoredProject,
} from "./local-project-api";
import {
  createReferenceProjectSummary,
  restoreMissingProjectFarmOptions,
  type ReferenceMapCreationInput,
  type ReferenceMapIdentityInput,
  type ReferenceMapRenameInput,
  type ReferenceMapTransferInput,
  type ReferenceMapUpdateInput,
  type ReferenceProjectCreationInput,
  type ReferenceProjectFirstMapWriteInput,
  type ReferenceProjectRepository,
  type ReferenceProjectSummary,
  type ReferenceThumbnailSaveInput,
} from "./reference-project-repository";
import { plannerMaps, type PlannerMap } from "../maps/map-catalog";

export type ReferenceProjectWorkspaceState = Readonly<{
  projectSummaries: readonly ReferenceProjectSummary[];
  folders: readonly ReferenceProjectFolder[];
  activeProject: ReferenceStoredProject | null;
  activeSession: ReferenceOpenMapSession | null;
}>;

export type ReferenceProjectWorkspaceController = Readonly<{
  getState: () => ReferenceProjectWorkspaceState;
  subscribe: (subscriber: () => void) => () => void;
  clearActiveProject: () => void;
  refreshProjects: () => void;
  openProject: (projectId: string) => void;
  createProject: (input: ReferenceProjectCreationInput) => void;
  createProjectWithFirstMap: (
    input: ReferenceProjectWithFirstMapCreationInput,
  ) => void;
  renameProject: (projectId: string, requestedName: string) => void;
  deleteProject: (projectId: string) => void;
  exportProject: (projectId: string) => string;
  activateMap: (mapId: string) => void;
  saveOpenMap: (edits: ReferenceOpenMapEdits) => void;
  createMap: (input: ReferenceMapCreationInput) => void;
  renameMap: (input: ReferenceMapRenameInput) => void;
  duplicateMap: (input: ReferenceMapIdentityInput) => void;
  deleteMap: (input: ReferenceMapIdentityInput) => void;
  duplicateProject: (projectId: string) => void;
  importProject: (serializedProject: string) => void;
  copyMap: (input: ReferenceMapTransferInput) => void;
  moveMap: (input: ReferenceMapTransferInput) => void;
  saveThumbnail: (input: ReferenceThumbnailSaveInput) => void;
  listFolders: () => readonly ReferenceProjectFolder[];
  createFolder: (folderName: string) => ReferenceProjectFolder;
  renameFolder: (folderId: string, folderName: string) => ReferenceProjectFolder;
  moveProjectToFolder: (projectId: string, folderId: string | null) => void;
  countMyPlans: () => number;
  getPlannerMapIdForMapFile: (
    mapFile: string,
    candidatePlannerMaps?: readonly PlannerMap[],
  ) => string;
}>;

export type ReferenceProjectWithFirstMapCreationInput = Readonly<{
  projectName: string;
  season: ReferenceProjectMap["season"];
  mapFile: string;
  label: string;
  edits: ReferenceOpenMapEdits;
  webpBytes: Uint8Array;
}>;

export type ReferenceProjectWorkspaceInput = Readonly<{
  repository: ReferenceProjectRepository;
  initialProjectSummaries: readonly ReferenceProjectSummary[];
}>;

type ReferenceProjectWorkspaceControllerInput = ReferenceProjectWorkspaceInput &
  Readonly<{
    onStateChange?: (workspaceState: ReferenceProjectWorkspaceState) => void;
  }>;

export function createReferenceProjectWorkspaceController(
  input: ReferenceProjectWorkspaceControllerInput,
): ReferenceProjectWorkspaceController {
  assertReferenceProjectWorkspaceInput(input);
  let workspaceState = createInitialWorkspaceState(
    input.initialProjectSummaries,
    input.repository.listFolders(),
  );
  const stateSubscribers = new Set<() => void>();

  function commitWorkspaceState(nextWorkspaceState: ReferenceProjectWorkspaceState): void {
    workspaceState = cloneReferenceProjectWorkspaceState(nextWorkspaceState);
    input.onStateChange?.(
      cloneReferenceProjectWorkspaceState(workspaceState),
    );
    stateSubscribers.forEach((stateSubscriber) => stateSubscriber());
  }

  function subscribe(stateSubscriber: () => void): () => void {
    if (typeof stateSubscriber !== "function") {
      throw new TypeError(
        `Reference project workspace subscriber must be a function; received ${JSON.stringify(stateSubscriber)}.`,
      );
    }
    stateSubscribers.add(stateSubscriber);
    let isSubscribed = true;
    return () => {
      if (!isSubscribed) return;
      isSubscribed = false;
      stateSubscribers.delete(stateSubscriber);
    };
  }

  function openProject(projectId: string): void {
    const openedProject = cloneStoredProject(input.repository.openProject(projectId));
    const openedSession = prepareReferenceProjectActiveSession(openedProject);
    commitWorkspaceState({
      ...workspaceState,
      activeProject: openedProject,
      activeSession: openedSession,
    });
  }

  function clearActiveProject(): void {
    if (workspaceState.activeProject === null && workspaceState.activeSession === null) {
      return;
    }
    commitWorkspaceState({
      ...workspaceState,
      activeProject: null,
      activeSession: null,
    });
  }

  function createProject(projectCreationInput: ReferenceProjectCreationInput): void {
    const createdProject = cloneStoredProject(
      input.repository.createProject(projectCreationInput),
    );
    commitWorkspaceState({
      ...workspaceState,
      projectSummaries: replaceProjectSummary(
        workspaceState.projectSummaries,
        createdProject,
      ),
      activeProject: createdProject,
      activeSession: prepareReferenceProjectActiveSession(createdProject),
    });
  }

  function createProjectWithFirstMap(
    projectCreationInput: ReferenceProjectWithFirstMapCreationInput,
  ): void {
    const firstMap = createFirstMapFromEdits(projectCreationInput);
    const createdProject = cloneStoredProject(
      input.repository.createProjectWithFirstMap(
        createFirstMapWriteInput(projectCreationInput, firstMap),
      ),
    );
    const activeSession = prepareReferenceProjectActiveSession(createdProject);
    if (activeSession === null) {
      throw new Error(
        `Reference project ${JSON.stringify(createdProject.id)} was stored with its first map but has no active session. Received activeMapId ${JSON.stringify(createdProject.project.activeMapId)} and map count ${String(createdProject.project.maps.length)}.`,
      );
    }
    commitWorkspaceState({
      ...workspaceState,
      projectSummaries: replaceProjectSummary(
        workspaceState.projectSummaries,
        createdProject,
      ),
      activeProject: createdProject,
      activeSession,
    });
  }

  function renameProject(projectId: string, requestedName: string): void {
    const renamedProject = cloneStoredProject(
      input.repository.renameProject(projectId, requestedName),
    );
    commitWorkspaceState(
      replaceProjectInWorkspaceState(workspaceState, renamedProject),
    );
  }

  function deleteProject(projectId: string): void {
    input.repository.deleteProject(projectId);
    const projectSummaries = workspaceState.projectSummaries.filter(
      (projectSummary) => projectSummary.id !== projectId,
    );
    if (workspaceState.activeProject?.id === projectId) {
      commitWorkspaceState({
        ...workspaceState,
        projectSummaries,
        activeProject: null,
        activeSession: null,
      });
      return;
    }
    commitWorkspaceState({ ...workspaceState, projectSummaries });
  }

  function exportProject(projectId: string): string {
    return input.repository.exportProject(projectId);
  }

  function refreshProjects(): void {
    const projectSummaries = cloneProjectSummaries(
      input.repository.listProjects(),
      "refreshed projectSummaries",
    );
    commitWorkspaceState({ ...workspaceState, projectSummaries });
  }

  function activateMap(mapId: string): void {
    const activeProject = requireActiveProject(workspaceState.activeProject);
    const activeMap = findProjectMap(activeProject, mapId);
    const updatedProject = cloneStoredProject(
      input.repository.updateMap(createMapUpdateInput(activeProject.id, activeMap)),
    );
    const activeSession = createSessionForMap(updatedProject, mapId);
    commitWorkspaceState({
      ...workspaceState,
      projectSummaries: replaceProjectSummary(workspaceState.projectSummaries, updatedProject),
      activeProject: updatedProject,
      activeSession,
    });
  }

  function saveOpenMap(edits: ReferenceOpenMapEdits): void {
    const activeSession = requireActiveSession(workspaceState.activeSession);
    const activeProject = requireActiveProject(workspaceState.activeProject);
    const savedMap = applyReferenceOpenMapEdits(activeSession, edits);
    const updatedProject = cloneStoredProject(
      input.repository.updateMap(
        createMapUpdateInput(
          activeSession.projectId,
          savedMap,
          activeProject.updated_at,
        ),
      ),
    );
    const refreshedSession = createSessionForMap(updatedProject, savedMap.id);
    commitWorkspaceState({
      ...workspaceState,
      projectSummaries: replaceProjectSummary(workspaceState.projectSummaries, updatedProject),
      activeProject: updatedProject,
      activeSession: refreshedSession,
    });
  }

  function createMap(mapCreationInput: ReferenceMapCreationInput): void {
    const updatedProject = cloneStoredProject(
      input.repository.createMap(mapCreationInput),
    );
    commitWorkspaceState(
      replaceProjectInWorkspaceState(workspaceState, updatedProject),
    );
  }

  function renameMap(mapRenameInput: ReferenceMapRenameInput): void {
    const updatedProject = cloneStoredProject(
      input.repository.renameMap(mapRenameInput),
    );
    commitWorkspaceState(
      replaceProjectInWorkspaceState(workspaceState, updatedProject),
    );
  }

  function duplicateMap(mapIdentityInput: ReferenceMapIdentityInput): void {
    const updatedProject = cloneStoredProject(
      input.repository.duplicateMap(mapIdentityInput),
    );
    commitWorkspaceState(
      replaceProjectInWorkspaceState(workspaceState, updatedProject),
    );
  }

  function deleteMap(mapIdentityInput: ReferenceMapIdentityInput): void {
    const updatedProject = cloneStoredProject(
      input.repository.deleteMap(mapIdentityInput),
    );
    commitWorkspaceState(
      replaceProjectInWorkspaceState(workspaceState, updatedProject),
    );
  }

  function duplicateProject(projectId: string): void {
    const duplicatedMutation = input.repository.duplicateProject(
      projectId,
      prepareReferenceProjectActiveSession,
    );
    const duplicatedProject = cloneStoredProject(duplicatedMutation.project);
    commitWorkspaceState({
      ...workspaceState,
      projectSummaries: replaceProjectSummary(workspaceState.projectSummaries, duplicatedProject),
      activeProject: duplicatedProject,
      activeSession: duplicatedMutation.preparedActiveSession,
    });
  }

  function importProject(serializedProject: string): void {
    const importedMutation = input.repository.importProject(
      serializedProject,
      prepareReferenceProjectActiveSession,
    );
    const importedProject = cloneStoredProject(importedMutation.project);
    commitWorkspaceState({
      ...workspaceState,
      projectSummaries: replaceProjectSummary(workspaceState.projectSummaries, importedProject),
      activeProject: importedProject,
      activeSession: importedMutation.preparedActiveSession,
    });
  }

  function copyMap(mapTransferInput: ReferenceMapTransferInput): void {
    const targetProject = cloneStoredProject(input.repository.copyMap(mapTransferInput));
    commitWorkspaceState(
      replaceProjectInWorkspaceState(workspaceState, targetProject),
    );
  }

  function moveMap(mapTransferInput: ReferenceMapTransferInput): void {
    const moveResult = input.repository.moveMap(mapTransferInput);
    const nextWorkspaceState = createMovedMapWorkspaceState(
      workspaceState,
      mapTransferInput,
      cloneStoredProject(moveResult.sourceProject),
      cloneStoredProject(moveResult.targetProject),
    );
    commitWorkspaceState(nextWorkspaceState);
  }

  function saveThumbnail(thumbnailSaveInput: ReferenceThumbnailSaveInput): void {
    const updatedProject = cloneStoredProject(
      input.repository.saveThumbnail(thumbnailSaveInput),
    );
    commitWorkspaceState(
      replaceProjectInWorkspaceState(workspaceState, updatedProject),
    );
  }

  function listFolders(): readonly ReferenceProjectFolder[] {
    return cloneProjectFolders(workspaceState.folders, "folders");
  }

  function createFolder(folderName: string): ReferenceProjectFolder {
    const createdFolder = input.repository.createFolder(folderName);
    const storedFolder = { id: createdFolder.id, name: createdFolder.name };
    commitWorkspaceState({
      ...workspaceState,
      folders: [...workspaceState.folders, storedFolder],
    });
    return storedFolder;
  }

  function renameFolder(folderId: string, folderName: string): ReferenceProjectFolder {
    assertUniqueProjectFolderId(workspaceState.folders, folderId);
    const renamedFolder = input.repository.renameFolder(folderId, folderName);
    const storedFolder = { id: renamedFolder.id, name: renamedFolder.name };
    commitWorkspaceState({
      ...workspaceState,
      folders: replaceRenamedProjectFolder(workspaceState.folders, storedFolder),
    });
    return storedFolder;
  }

  function moveProjectToFolder(projectId: string, folderId: string | null): void {
    const movedProject = cloneStoredProject(
      input.repository.moveProjectToFolder(projectId, folderId),
    );
    commitWorkspaceState(
      replaceProjectInWorkspaceState(workspaceState, movedProject),
    );
  }

  function countMyPlans(): number {
    const myPlansCount = input.repository.countMyPlans();
    if (!Number.isSafeInteger(myPlansCount) || myPlansCount < 0) {
      throw new Error(
        `Reference project My Plans count must be a non-negative safe integer. Received: ${JSON.stringify(myPlansCount)}.`,
      );
    }
    return myPlansCount;
  }

  return {
    getState: () => cloneReferenceProjectWorkspaceState(workspaceState),
    subscribe,
    clearActiveProject,
    refreshProjects,
    openProject,
    createProject,
    createProjectWithFirstMap,
    renameProject,
    deleteProject,
    exportProject,
    activateMap,
    saveOpenMap,
    createMap,
    renameMap,
    duplicateMap,
    deleteMap,
    duplicateProject,
    importProject,
    copyMap,
    moveMap,
    saveThumbnail,
    listFolders,
    createFolder,
    renameFolder,
    moveProjectToFolder,
    countMyPlans,
    getPlannerMapIdForMapFile,
  };
}

export function getPlannerMapIdForMapFile(
  mapFile: string,
  candidatePlannerMaps: readonly PlannerMap[] = plannerMaps,
): string {
  if (typeof mapFile !== "string" || mapFile.length === 0) {
    throw new TypeError(
      `Reference planner map file must be a non-empty string; received ${JSON.stringify(mapFile)}.`,
    );
  }
  if (!Array.isArray(candidatePlannerMaps)) {
    throw new TypeError(
      `Reference planner map candidates must be an array; received ${JSON.stringify(candidatePlannerMaps)}.`,
    );
  }
  candidatePlannerMaps.forEach((candidatePlannerMap, candidateIndex) => {
    if (
      typeof candidatePlannerMap !== "object" ||
      candidatePlannerMap === null ||
      typeof candidatePlannerMap.id !== "string" ||
      candidatePlannerMap.id.length === 0 ||
      typeof candidatePlannerMap.mapFile !== "string" ||
      candidatePlannerMap.mapFile.length === 0
    ) {
      throw new TypeError(
        `Reference planner map candidate at index ${String(candidateIndex)} must contain non-empty string id and mapFile; received ${JSON.stringify(candidatePlannerMap)}.`,
      );
    }
  });
  const matchingPlannerMaps = candidatePlannerMaps.filter(
    (plannerMap) => plannerMap.mapFile === mapFile,
  );
  if (matchingPlannerMaps.length === 0) {
    throw new Error(
      `Reference planner map file is unknown; received ${JSON.stringify(mapFile)}.`,
    );
  }
  if (matchingPlannerMaps.length !== 1) {
    throw new Error(
      `Reference planner map file is ambiguous; received ${JSON.stringify(mapFile)}; matching planner map IDs: ${JSON.stringify(matchingPlannerMaps.map((plannerMap) => plannerMap.id))}.`,
    );
  }
  return matchingPlannerMaps[0]!.id;
}

export function useReferenceProjectWorkspace(
  input: ReferenceProjectWorkspaceInput,
): Readonly<{
  workspaceState: ReferenceProjectWorkspaceState;
  workspaceController: ReferenceProjectWorkspaceController;
}> {
  const controllerReference = useRef<ReferenceProjectWorkspaceController | null>(null);
  const repositoryReference = useRef<ReferenceProjectRepository | null>(null);
  assertReferenceProjectWorkspaceRepositoryReference(
    repositoryReference.current,
    input.repository,
  );
  if (controllerReference.current === null) {
    controllerReference.current = createReferenceProjectWorkspaceController({
      ...input,
    });
    repositoryReference.current = input.repository;
  }
  const projectWorkspace = useReferenceProjectWorkspaceController(
    controllerReference.current,
  );
  if (projectWorkspace === null) {
    throw new Error("Reference project workspace controller was not created.");
  }
  return projectWorkspace;
}

type SubscribedReferenceProjectWorkspace = Readonly<{
  workspaceController: ReferenceProjectWorkspaceController;
  workspaceState: ReferenceProjectWorkspaceState;
}>;

export function useReferenceProjectWorkspaceController(
  workspaceController: ReferenceProjectWorkspaceController | null,
): SubscribedReferenceProjectWorkspace | null {
  const [subscribedWorkspace, setSubscribedWorkspace] =
    useState<SubscribedReferenceProjectWorkspace | null>(() =>
      workspaceController === null
        ? null
        : {
            workspaceController,
            workspaceState: workspaceController.getState(),
          },
    );
  useEffect(() => {
    if (workspaceController === null) {
      setSubscribedWorkspace(null);
      return;
    }
    const subscribedController = workspaceController;
    function synchronizeWorkspaceState(): void {
      setSubscribedWorkspace({
        workspaceController: subscribedController,
        workspaceState: subscribedController.getState(),
      });
    }
    synchronizeWorkspaceState();
    return subscribedController.subscribe(synchronizeWorkspaceState);
  }, [workspaceController]);
  const currentWorkspace = subscribedWorkspace?.workspaceController === workspaceController
    ? subscribedWorkspace
    : workspaceController === null
      ? null
      : {
          workspaceController,
          workspaceState: workspaceController.getState(),
        };
  return useMemo(
    () => currentWorkspace === null
      ? null
      : {
          workspaceController: currentWorkspace.workspaceController,
          workspaceState: cloneReferenceProjectWorkspaceState(
            currentWorkspace.workspaceState,
          ),
        },
    [currentWorkspace],
  );
}

function createInitialWorkspaceState(
  projectSummaries: readonly ReferenceProjectSummary[],
  projectFolders: readonly ReferenceProjectFolder[],
): ReferenceProjectWorkspaceState {
  return {
    projectSummaries: cloneProjectSummaries(
      projectSummaries,
      "initialProjectSummaries",
    ),
    folders: cloneProjectFolders(projectFolders, "initial folders"),
    activeProject: null,
    activeSession: null,
  };
}

export function prepareReferenceProjectActiveSession(
  project: ReferenceStoredProject,
): ReferenceOpenMapSession | null {
  const activeMapId = project.project.activeMapId;
  if (activeMapId === null) return null;
  return createSessionForMap(project, activeMapId);
}

function createFirstMapFromEdits(
  input: ReferenceProjectWithFirstMapCreationInput,
): ReferenceProjectMap {
  if (!(input.webpBytes instanceof Uint8Array) || input.webpBytes.byteLength === 0) {
    throw new TypeError(
      `Reference project first map thumbnail bytes must be a non-empty Uint8Array. Received: ${describeThumbnailBytes(input.webpBytes)}.`,
    );
  }
  const blankMap: ReferenceProjectMap = {
    id: "pending-first-map",
    mapFile: input.mapFile,
    label: input.label,
    season: input.season,
    state: {
      buildings: [],
      crops: [],
      items: [],
      nextBuildingId: 1,
      nextItemId: 1,
    },
    decor: { wallpapers: {}, floors: {} },
    renovations: [],
    thumbnail: "/api/projects/pending-project/maps/pending-first-map/thumbnail",
  };
  return applyReferenceOpenMapEdits(
    createReferenceOpenMapSession("pending-project", blankMap),
    input.edits,
  );
}

function createFirstMapWriteInput(
  input: ReferenceProjectWithFirstMapCreationInput,
  firstMap: ReferenceProjectMap,
): ReferenceProjectFirstMapWriteInput {
  return {
    projectName: input.projectName,
    season: input.season,
    mapFile: firstMap.mapFile,
    label: firstMap.label,
    mapSeason: firstMap.season,
    state: firstMap.state,
    decor: firstMap.decor,
    renovations: firstMap.renovations,
    webpBytes: input.webpBytes,
  };
}

function describeThumbnailBytes(receivedBytes: unknown): string {
  if (receivedBytes instanceof Uint8Array) {
    return `Uint8Array(byteLength=${String(receivedBytes.byteLength)})`;
  }
  try {
    return JSON.stringify(receivedBytes);
  } catch {
    return `${typeof receivedBytes} value`;
  }
}

function createSessionForMap(
  project: ReferenceStoredProject,
  mapId: string,
): ReferenceOpenMapSession {
  return createReferenceOpenMapSession(project.id, findProjectMap(project, mapId));
}

function findProjectMap(
  project: ReferenceStoredProject,
  mapId: string,
): ReferenceStoredProject["project"]["maps"][number] {
  const projectMap = project.project.maps.find(
    (candidateMap) => candidateMap.id === mapId,
  );
  if (projectMap === undefined) {
    const receivedProjectId = JSON.stringify(project.id);
    const receivedMapId = JSON.stringify(mapId);
    throw new Error(
      `Reference project workspace cannot find map ${receivedMapId} in project ${receivedProjectId}. ` +
        `Received project ID: ${receivedProjectId}; received map ID: ${receivedMapId}.`,
    );
  }
  return projectMap;
}

function createMapUpdateInput(
  projectId: string,
  map: ReferenceStoredProject["project"]["maps"][number],
  expectedProjectRevision?: string,
): ReferenceMapUpdateInput {
  return {
    projectId,
    mapId: map.id,
    mapFile: map.mapFile,
    label: map.label,
    season: map.season,
    state: map.state,
    decor: map.decor,
    renovations: map.renovations,
    setActive: true,
    ...(expectedProjectRevision === undefined
      ? {}
      : { expectedProjectRevision }),
  };
}

function requireActiveProject(
  activeProject: ReferenceStoredProject | null,
): ReferenceStoredProject {
  if (activeProject === null) {
    throw new Error("Reference project workspace requires an active project. Received active project: null.");
  }
  return activeProject;
}

function requireActiveSession(
  activeSession: ReferenceOpenMapSession | null,
): ReferenceOpenMapSession {
  if (activeSession === null) {
    throw new Error("Reference project workspace requires an active open-map session. Received active session: null.");
  }
  return activeSession;
}

function replaceProjectSummary(
  projectSummaries: readonly ReferenceProjectSummary[],
  project: ReferenceStoredProject,
): readonly ReferenceProjectSummary[] {
  const projectSummary = createReferenceProjectSummary(project);
  const matchingSummaryIndex = projectSummaries.findIndex(
    (candidateSummary) => candidateSummary.id === project.id,
  );
  if (matchingSummaryIndex === -1) return [...projectSummaries, projectSummary];
  return projectSummaries.map((candidateSummary) =>
    candidateSummary.id === project.id ? projectSummary : candidateSummary,
  );
}

function replaceProjectInWorkspaceState(
  workspaceState: ReferenceProjectWorkspaceState,
  updatedProject: ReferenceStoredProject,
): ReferenceProjectWorkspaceState {
  const projectSummaries = replaceProjectSummary(
    workspaceState.projectSummaries,
    updatedProject,
  );
  if (workspaceState.activeProject?.id !== updatedProject.id) {
    return { ...workspaceState, projectSummaries };
  }
  return {
    projectSummaries,
    folders: cloneProjectFolders(workspaceState.folders, "folders"),
    activeProject: updatedProject,
    activeSession: prepareReferenceProjectActiveSession(updatedProject),
  };
}

function createMovedMapWorkspaceState(
  workspaceState: ReferenceProjectWorkspaceState,
  input: ReferenceMapTransferInput,
  sourceProject: ReferenceStoredProject,
  targetProject: ReferenceStoredProject,
): ReferenceProjectWorkspaceState {
  const projectSummaries = replaceProjectSummary(
    replaceProjectSummary(workspaceState.projectSummaries, sourceProject),
    targetProject,
  );
  const activeSession = workspaceState.activeSession;
  if (
    activeSession?.projectId === input.projectId &&
    activeSession.mapId === input.mapId
  ) {
    return {
      projectSummaries,
      folders: workspaceState.folders,
      activeProject: targetProject,
      activeSession: createSessionForMap(targetProject, input.mapId),
    };
  }
  if (workspaceState.activeProject?.id === sourceProject.id) {
    return reconcileActiveProjectWorkspaceState(
      projectSummaries,
      sourceProject,
      activeSession,
      workspaceState.folders,
    );
  }
  if (workspaceState.activeProject?.id === targetProject.id) {
    return reconcileActiveProjectWorkspaceState(
      projectSummaries,
      targetProject,
      activeSession,
      workspaceState.folders,
    );
  }
  return { ...workspaceState, projectSummaries };
}

function reconcileActiveProjectWorkspaceState(
  projectSummaries: readonly ReferenceProjectSummary[],
  activeProject: ReferenceStoredProject,
  previousSession: ReferenceOpenMapSession | null,
  projectFolders: readonly ReferenceProjectFolder[],
): ReferenceProjectWorkspaceState {
  if (previousSession === null) {
    return {
      projectSummaries,
      folders: projectFolders,
      activeProject,
      activeSession: null,
    };
  }
  return {
    projectSummaries,
    folders: projectFolders,
    activeProject,
    activeSession: createSessionForMap(activeProject, previousSession.mapId),
  };
}

function assertReferenceProjectWorkspaceInput(
  input: ReferenceProjectWorkspaceControllerInput,
): void {
  if (typeof input !== "object" || input === null) {
    throw new TypeError(
      `Reference project workspace input must be an object; received ${JSON.stringify(input)}.`,
    );
  }
  if (typeof input.repository !== "object" || input.repository === null) {
    throw new TypeError(
      `Reference project workspace repository must be an object; received ${JSON.stringify(input.repository)}.`,
    );
  }
  assertReferenceProjectWorkspaceRepository(input.repository);
  cloneProjectSummaries(
    input.initialProjectSummaries,
    "initialProjectSummaries",
  );
  if (input.onStateChange !== undefined && typeof input.onStateChange !== "function") {
    throw new TypeError(
      `Reference project workspace onStateChange must be a function; received ${JSON.stringify(input.onStateChange)}.`,
    );
  }
}

export function assertReferenceProjectWorkspaceRepositoryReference(
  initialRepository: ReferenceProjectRepository | null,
  receivedRepository: ReferenceProjectRepository,
): void {
  if (initialRepository !== null && initialRepository !== receivedRepository) {
    throw new Error(
      "Reference project workspace repository changed after mount. " +
        "Received a different repository reference.",
    );
  }
}

function assertReferenceProjectWorkspaceRepository(
  repository: ReferenceProjectRepository,
): void {
  for (const methodName of [
    "listProjects",
    "openProject",
    "updateMap",
    "duplicateProject",
    "importProject",
    "copyMap",
    "moveMap",
    "createProject",
    "createProjectWithFirstMap",
    "renameProject",
    "deleteProject",
    "exportProject",
    "createMap",
    "renameMap",
    "duplicateMap",
    "deleteMap",
    "saveThumbnail",
    "listFolders",
    "createFolder",
    "renameFolder",
    "moveProjectToFolder",
    "countMyPlans",
  ] as const) {
    if (typeof repository[methodName] !== "function") {
      throw new TypeError(
        `Reference project workspace repository.${methodName} must be a function; ` +
          `received ${JSON.stringify(repository[methodName])}.`,
      );
    }
  }
}

function cloneProjectSummaries(
  projectSummaries: readonly ReferenceProjectSummary[],
  sourceName: string,
): readonly ReferenceProjectSummary[] {
  if (!Array.isArray(projectSummaries)) {
    throw new TypeError(
      `Reference project workspace ${sourceName} must be an array; received ${JSON.stringify(projectSummaries)}.`,
    );
  }
  return projectSummaries.map((projectSummary, projectSummaryIndex) => {
    if (typeof projectSummary !== "object" || projectSummary === null) {
      throw new TypeError(
        `Reference project workspace ${sourceName}[${String(projectSummaryIndex)}] must be an object; ` +
          `received ${JSON.stringify(projectSummary)}.`,
      );
    }
    for (
      const fieldName of ["id", "title", "created_at", "updated_at"] as const
    ) {
      if (typeof projectSummary[fieldName] !== "string") {
        throw new TypeError(
          `Reference project workspace ${sourceName}[${String(projectSummaryIndex)}].${fieldName} must be a string; ` +
            `received ${JSON.stringify(projectSummary[fieldName])}.`,
        );
      }
    }
    if (
      projectSummary.mapCount !== undefined
      && (!Number.isSafeInteger(projectSummary.mapCount) || projectSummary.mapCount < 0)
    ) {
      throw new TypeError(
        `Reference project workspace ${sourceName}[${String(projectSummaryIndex)}].mapCount must be a non-negative safe integer; ` +
          `received ${JSON.stringify(projectSummary.mapCount)}.`,
      );
    }
    if (
      projectSummary.activeMapThumbnailDataUrl !== undefined
      && projectSummary.activeMapThumbnailDataUrl !== null
      && typeof projectSummary.activeMapThumbnailDataUrl !== "string"
    ) {
      throw new TypeError(
        `Reference project workspace ${sourceName}[${String(projectSummaryIndex)}].activeMapThumbnailDataUrl must be a string or null; ` +
          `received ${JSON.stringify(projectSummary.activeMapThumbnailDataUrl)}.`,
      );
    }
    if (
      projectSummary.activeMapThumbnailDataUrl !== undefined
      && projectSummary.activeMapThumbnailDataUrl !== null
      && projectSummary.activeMapThumbnailDataUrl.includes("/api/projects")
    ) {
      throw new Error(
        `Reference project workspace ${sourceName}[${String(projectSummaryIndex)}].activeMapThumbnailDataUrl must be a WebP data URL. ` +
          `Received: ${JSON.stringify(projectSummary.activeMapThumbnailDataUrl)}.`,
      );
    }
    if (
      projectSummary.folderId !== undefined
      && (typeof projectSummary.folderId !== "string" || projectSummary.folderId.length === 0)
    ) {
      throw new TypeError(
        `Reference project workspace ${sourceName}[${String(projectSummaryIndex)}].folderId must be a non-empty string; ` +
          `received ${JSON.stringify(projectSummary.folderId)}.`,
      );
    }
    return { ...projectSummary };
  });
}

function cloneProjectFolders(
  projectFolders: readonly ReferenceProjectFolder[],
  sourceName: string,
): readonly ReferenceProjectFolder[] {
  if (!Array.isArray(projectFolders)) {
    throw new TypeError(
      `Reference project workspace ${sourceName} must be an array; received ${JSON.stringify(projectFolders)}.`,
    );
  }
  return projectFolders.map((projectFolder, folderIndex) => {
    if (typeof projectFolder !== "object" || projectFolder === null) {
      throw new TypeError(
        `Reference project workspace ${sourceName}[${String(folderIndex)}] must be an object; ` +
          `received ${JSON.stringify(projectFolder)}.`,
      );
    }
    if (typeof projectFolder.id !== "string" || projectFolder.id.length === 0) {
      throw new TypeError(
        `Reference project workspace ${sourceName}[${String(folderIndex)}].id must be a non-empty string; ` +
          `received ${JSON.stringify(projectFolder.id)}.`,
      );
    }
    if (typeof projectFolder.name !== "string" || projectFolder.name.length === 0) {
      throw new TypeError(
        `Reference project workspace ${sourceName}[${String(folderIndex)}].name must be a non-empty string; ` +
          `received ${JSON.stringify(projectFolder.name)}.`,
      );
    }
    return { id: projectFolder.id, name: projectFolder.name };
  });
}

function assertUniqueProjectFolderId(
  projectFolders: readonly ReferenceProjectFolder[],
  folderId: string,
): void {
  const matchingFolderCount = projectFolders.filter(
    (projectFolder) => projectFolder.id === folderId,
  ).length;
  if (matchingFolderCount !== 1) {
    throw new Error(
      `Reference project workspace expected exactly one folder ${JSON.stringify(folderId)}. Received match count ${String(matchingFolderCount)} and folder IDs ${JSON.stringify(projectFolders.map((projectFolder) => projectFolder.id))}.`,
    );
  }
}

function replaceRenamedProjectFolder(
  projectFolders: readonly ReferenceProjectFolder[],
  renamedFolder: ReferenceProjectFolder,
): readonly ReferenceProjectFolder[] {
  assertUniqueProjectFolderId(projectFolders, renamedFolder.id);
  return projectFolders.map((projectFolder) =>
    projectFolder.id === renamedFolder.id
      ? { id: renamedFolder.id, name: renamedFolder.name }
      : projectFolder,
  );
}

function cloneStoredProject(project: ReferenceStoredProject): ReferenceStoredProject {
  return structuredClone(restoreMissingProjectFarmOptions(project));
}

export function cloneReferenceProjectWorkspaceState(
  workspaceState: ReferenceProjectWorkspaceState,
): ReferenceProjectWorkspaceState {
  return structuredClone(workspaceState);
}
