import type {
  ReferenceApiRequest,
  ReferenceApiResponse,
  ReferenceLocalProjectDocument,
  ReferenceJsonValue,
  ReferenceProjectFolder,
  ReferenceProjectMap,
  ReferenceStoredProject,
} from "./local-project-api";
import {
  handleReferenceProjectRequest,
  parseReferenceProjectDocument,
  serializeReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "./local-project-api";
import {
  createInitialMapRenderOptions,
  restoreMapRenderOptions,
  type MapRenderOptions,
} from "../maps/map-render-options";

export const referenceProjectStorageKey =
  "stardewplan-reference-local-projects-v1";

export type ReferenceProjectStorage = Readonly<{
  getItem(storageKey: string): string | null;
  setItem(storageKey: string, serializedProjectDocument: string): void;
}>;

export type ReferenceProjectSummary = Readonly<
  Pick<ReferenceStoredProject, "id" | "title" | "created_at" | "updated_at">
  & Readonly<{
    mapCount?: number;
    activeMapThumbnailDataUrl?: string | null;
    folderId?: string;
  }>
>;

export function createReferenceProjectSummary(
  storedProject: ReferenceStoredProject,
): ReferenceProjectSummary {
  const projectSummary: ReferenceProjectSummary = {
    id: storedProject.id,
    title: storedProject.title,
    created_at: storedProject.created_at,
    updated_at: storedProject.updated_at,
    mapCount: storedProject.project.maps.length,
    activeMapThumbnailDataUrl: readActiveMapThumbnailDataUrl(storedProject),
  };
  if (storedProject.folderId !== undefined) {
    return { ...projectSummary, folderId: storedProject.folderId };
  }
  return projectSummary;
}

function readActiveMapThumbnailDataUrl(
  storedProject: ReferenceStoredProject,
): string | null {
  const activeMapId = storedProject.project.activeMapId;
  if (activeMapId === null) {
    return null;
  }

  const thumbnailDataUrl = storedProject.thumbnailsByMapId?.[activeMapId];
  if (thumbnailDataUrl === undefined) {
    return null;
  }
  if (
    !thumbnailDataUrl.startsWith("data:image/webp;base64,") ||
    thumbnailDataUrl.includes("/api/projects")
  ) {
    throw new Error(
      `Project ${JSON.stringify(storedProject.id)} map ${JSON.stringify(activeMapId)} thumbnail must be a WebP data URL. Received: ${JSON.stringify(thumbnailDataUrl)}.`,
    );
  }

  return thumbnailDataUrl;
}

export type ReferenceProjectCreationInput = Readonly<{
  projectName: string;
  season: ReferenceProjectMap["season"];
}>;

export type ReferenceProjectFirstMapWriteInput = Readonly<{
  projectName: string;
  season: ReferenceProjectMap["season"];
  mapFile: string;
  label: string;
  mapSeason: ReferenceProjectMap["season"];
  state: ReferenceProjectMap["state"];
  decor: ReferenceProjectMap["decor"];
  renovations: ReferenceProjectMap["renovations"];
  webpBytes: Uint8Array;
}>;

export type ReferenceMapCreationInput = Readonly<{
  projectId: string;
  mapFile: string;
  label: string;
  season: ReferenceProjectMap["season"];
}>;

export type ReferenceMapUpdateInput = Readonly<{
  projectId: string;
  mapId: string;
  mapFile: string;
  label: string;
  season: ReferenceProjectMap["season"];
  state: Record<string, ReferenceJsonValue>;
  decor: ReferenceProjectMap["decor"];
  renovations: ReferenceJsonValue[];
  setActive: boolean;
  expectedProjectRevision?: string;
}>;

export type ReferenceMapRenameInput = Readonly<{
  projectId: string;
  mapId: string;
  requestedLabel: string;
}>;

export type ReferenceMapIdentityInput = Readonly<{
  projectId: string;
  mapId: string;
}>;

type ReferenceExistingProjectTransferTarget = Readonly<{
  targetProjectId: string;
  newProjectName?: never;
}>;

type ReferenceNewProjectTransferTarget = Readonly<{
  targetProjectId?: never;
  newProjectName: string;
}>;

export type ReferenceMapTransferInput = ReferenceMapIdentityInput &
  (ReferenceExistingProjectTransferTarget | ReferenceNewProjectTransferTarget);

export type ReferenceMapMoveResult = Readonly<{
  sourceProject: ReferenceStoredProject;
  targetProject: ReferenceStoredProject;
}>;

export type ReferenceThumbnailSaveInput = Readonly<{
  projectId: string;
  mapId: string;
  webpBytes: Uint8Array;
}>;

export type ReferenceProjectPreflight<PreparedActiveSession> = (
  candidateProject: ReferenceStoredProject,
) => PreparedActiveSession;

export type ReferencePreparedProjectMutation<PreparedActiveSession> = Readonly<{
  project: ReferenceStoredProject;
  preparedActiveSession: PreparedActiveSession;
}>;

type ReferenceProjectMutationWithPreflight = {
  (projectValue: string): ReferenceStoredProject;
  <PreparedActiveSession>(
    projectValue: string,
    prepareActiveSession: ReferenceProjectPreflight<PreparedActiveSession>,
  ): ReferencePreparedProjectMutation<PreparedActiveSession>;
};

export type ReferenceProjectRepository = Readonly<{
  listProjects(): readonly ReferenceProjectSummary[];
  openProject(projectId: string): ReferenceStoredProject;
  createProject(input: ReferenceProjectCreationInput): ReferenceStoredProject;
  createProjectWithFirstMap(
    input: ReferenceProjectFirstMapWriteInput,
  ): ReferenceStoredProject;
  duplicateProject: ReferenceProjectMutationWithPreflight;
  renameProject(
    projectId: string,
    requestedName: string,
  ): ReferenceStoredProject;
  deleteProject(projectId: string): void;
  importProject: ReferenceProjectMutationWithPreflight;
  exportProject(projectId: string): string;
  updateMap(input: ReferenceMapUpdateInput): ReferenceStoredProject;
  createMap(input: ReferenceMapCreationInput): ReferenceStoredProject;
  renameMap(input: ReferenceMapRenameInput): ReferenceStoredProject;
  duplicateMap(input: ReferenceMapIdentityInput): ReferenceStoredProject;
  deleteMap(input: ReferenceMapIdentityInput): ReferenceStoredProject;
  copyMap(input: ReferenceMapTransferInput): ReferenceStoredProject;
  moveMap(input: ReferenceMapTransferInput): ReferenceMapMoveResult;
  saveThumbnail(input: ReferenceThumbnailSaveInput): ReferenceStoredProject;
  listFolders(): readonly ReferenceProjectFolder[];
  createFolder(folderName: string): ReferenceProjectFolder;
  renameFolder(folderId: string, folderName: string): ReferenceProjectFolder;
  moveProjectToFolder(
    projectId: string,
    folderId: string | null,
  ): ReferenceStoredProject;
  countMyPlans(): number;
}>;

export type ReferenceProjectRepositoryOptions = Readonly<{
  storage?: ReferenceProjectStorage;
  requestHandler?: ReferenceProjectRequestHandler;
  now?: () => string;
  createIdentifier?: () => string;
}>;

export type ReferenceProjectRequestHandler = (
  request: ReferenceApiRequest,
  projectDocument: unknown,
) => ReferenceApiResponse;

type ReferenceMutationResponseShape =
  | "empty"
  | "mapId"
  | "projectId"
  | "projectTitle";

type ReferenceProjectTransactionResult<Result> = Readonly<{
  projectDocument: unknown;
  selectResult(validatedProjectDocument: ReferenceLocalProjectDocument): Result;
}>;

type ReferenceResolvedMapTransferTarget = Readonly<{
  handlerTargetProjectId: string;
  handlerTargetProject: ReferenceStoredProject;
}>;

type ReferenceNormalizedMapTransferTarget = Readonly<{
  projectDocument: ReferenceLocalProjectDocument;
  targetProjectId: string;
}>;

const maximumReferenceIdentifierAllocationAttempts = 8;

function describeReferenceIdentifierCandidate(receivedIdentifier: unknown): string {
  if (receivedIdentifier === undefined) {
    return "undefined";
  }
  if (typeof receivedIdentifier === "bigint") {
    return `BigInt(${receivedIdentifier.toString()})`;
  }
  if (typeof receivedIdentifier === "symbol") {
    return String(receivedIdentifier);
  }
  if (typeof receivedIdentifier === "number" && !Number.isFinite(receivedIdentifier)) {
    return `Number(${String(receivedIdentifier)})`;
  }
  if (typeof receivedIdentifier === "function") {
    return "function value";
  }

  try {
    const serializedIdentifier = JSON.stringify(receivedIdentifier);
    return serializedIdentifier ?? `${typeof receivedIdentifier} value`;
  } catch {
    return `${typeof receivedIdentifier} value (JSON serialization failed)`;
  }
}

function allocateUniqueReferenceIdentifier(
  createIdentifier: () => string,
  occupiedIdentifiers: Set<string>,
  operationName: string,
  scopeName: string,
): string {
  const collidingIdentifiers: string[] = [];
  for (
    let allocationAttempt = 0;
    allocationAttempt < maximumReferenceIdentifierAllocationAttempts;
    allocationAttempt += 1
  ) {
    const candidateIdentifier = createIdentifier();
    if (typeof candidateIdentifier !== "string" || candidateIdentifier.length === 0) {
      throw new TypeError(
        `Reference project repository ID allocation for ${operationName} in ${scopeName} requires a non-empty string candidate. Received: ${describeReferenceIdentifierCandidate(candidateIdentifier)}.`,
      );
    }
    if (!occupiedIdentifiers.has(candidateIdentifier)) {
      occupiedIdentifiers.add(candidateIdentifier);
      return candidateIdentifier;
    }
    collidingIdentifiers.push(candidateIdentifier);
  }

  throw new Error(
    `Reference project repository ID allocation for ${operationName} in ${scopeName} exhausted after ${String(maximumReferenceIdentifierAllocationAttempts)} attempts. Occupied IDs: ${JSON.stringify([...occupiedIdentifiers])}. Colliding received values: ${JSON.stringify(collidingIdentifiers)}.`,
  );
}

function resolveReferenceProjectStorage(
  injectedStorage: ReferenceProjectStorage | undefined,
): ReferenceProjectStorage {
  if (injectedStorage !== undefined) {
    return injectedStorage;
  }

  if (typeof window === "undefined" || window.localStorage === undefined) {
    throw new Error(
      "Reference project repository requires browser localStorage when no storage is injected.",
    );
  }

  return window.localStorage;
}

function createDefaultReferenceIdentifier(): string {
  if (typeof globalThis.crypto?.randomUUID !== "function") {
    throw new Error(
      "Reference project repository ID generation requires crypto.randomUUID().",
    );
  }

  return globalThis.crypto.randomUUID();
}

function createCurrentIsoTimestamp(): string {
  return new Date().toISOString();
}

function createReferenceProjectPath(projectId: string): string {
  return `/api/projects/${encodeURIComponent(projectId)}`;
}

function createReferenceMapCollectionPath(projectId: string): string {
  return `${createReferenceProjectPath(projectId)}/maps`;
}

function createReferenceMapPath(projectId: string, mapId: string): string {
  return `${createReferenceMapCollectionPath(projectId)}/${encodeURIComponent(mapId)}`;
}

function createReferenceMapActionPath(
  projectId: string,
  mapId: string,
  actionName: "copy" | "duplicate" | "move" | "thumbnail",
): string {
  return `${createReferenceMapPath(projectId, mapId)}/${actionName}`;
}

function assertMutationTimestamp(receivedTimestamp: unknown): string {
  const parsedTimestamp =
    typeof receivedTimestamp === "string"
      ? Date.parse(receivedTimestamp)
      : Number.NaN;
  if (
    typeof receivedTimestamp !== "string" ||
    Number.isNaN(parsedTimestamp) ||
    new Date(parsedTimestamp).toISOString() !== receivedTimestamp
  ) {
    throw new Error(
      `Reference project repository now() must return a canonical ISO timestamp string. Received: ${JSON.stringify(receivedTimestamp)}.`,
    );
  }

  return receivedTimestamp;
}

function createNextProjectUpdatedAt(
  currentProject: ReferenceStoredProject,
  receivedTimestamp: unknown,
): string {
  const requestedTimestamp = assertMutationTimestamp(receivedTimestamp);
  const currentTimestampMilliseconds = Date.parse(currentProject.updated_at);
  if (Number.isNaN(currentTimestampMilliseconds)) {
    throw new Error(
      `Reference project ${JSON.stringify(currentProject.id)} stored updated_at must be parseable by Date.parse; received ${JSON.stringify(currentProject.updated_at)}.`,
    );
  }

  const requestedTimestampMilliseconds = Date.parse(requestedTimestamp);
  const nextTimestampMilliseconds = Math.max(
    requestedTimestampMilliseconds,
    currentTimestampMilliseconds + 1,
  );
  let nextTimestamp: string;
  try {
    nextTimestamp = new Date(nextTimestampMilliseconds).toISOString();
  } catch (caughtError) {
    throw new Error(
      `Reference project ${JSON.stringify(currentProject.id)} cannot advance updated_at beyond ${JSON.stringify(currentProject.updated_at)} using now() value ${JSON.stringify(requestedTimestamp)}.`,
      { cause: caughtError },
    );
  }
  if (Date.parse(nextTimestamp) <= currentTimestampMilliseconds) {
    throw new Error(
      `Reference project ${JSON.stringify(currentProject.id)} cannot advance updated_at beyond ${JSON.stringify(currentProject.updated_at)} using now() value ${JSON.stringify(requestedTimestamp)}; received next timestamp ${JSON.stringify(nextTimestamp)}.`,
    );
  }
  return nextTimestamp;
}

function assertPlainResponseBody(
  receivedBody: unknown,
  responseShape: ReferenceMutationResponseShape,
): Record<string, unknown> {
  if (
    receivedBody === null ||
    typeof receivedBody !== "object" ||
    Array.isArray(receivedBody)
  ) {
    throw new Error(
      `Reference project repository expected ${responseShape} mutation JSON response body. Received: ${JSON.stringify(receivedBody)}.`,
    );
  }

  return receivedBody as Record<string, unknown>;
}

function requireMutationResponse(
  receivedResponse: unknown,
  responseShape: ReferenceMutationResponseShape,
): Readonly<{
  projectDocument: ReferenceLocalProjectDocument;
  responseBody: Record<string, unknown>;
}> {
  if (
    receivedResponse === null ||
    typeof receivedResponse !== "object" ||
    Array.isArray(receivedResponse)
  ) {
    throw new Error(
      `Reference project repository expected a mutation response object. Received: ${JSON.stringify(receivedResponse)}.`,
    );
  }
  const response = receivedResponse as ReferenceApiResponse;

  if (response.status !== 200) {
    throw new Error(
      `Reference project repository expected mutation status 200. Received: ${String(response.status)}.`,
    );
  }

  if (response.didMutateProjectDocument !== true) {
    throw new Error(
      `Reference project repository expected didMutateProjectDocument true. Received: ${String(response.didMutateProjectDocument)}.`,
    );
  }

  if (response.binaryBody !== undefined) {
    throw new Error(
      `Reference project repository expected a JSON mutation response without binaryBody. Received byte length: ${String(response.binaryBody.byteLength)}.`,
    );
  }

  const responseContentType = response.headers?.["content-type"];
  if (responseContentType !== "application/json") {
    throw new Error(
      `Reference project repository expected mutation content-type "application/json". Received: ${JSON.stringify(responseContentType)}.`,
    );
  }

  const responseBody = assertPlainResponseBody(response.jsonBody, responseShape);
  const expectedResponseKeys = responseShape === "empty" ? [] : [responseShape];
  const receivedResponseKeys = Object.keys(responseBody);

  if (
    receivedResponseKeys.length !== expectedResponseKeys.length ||
    receivedResponseKeys.some(
      (receivedKey, receivedIndex) =>
        receivedKey !== expectedResponseKeys[receivedIndex],
    )
  ) {
    throw new Error(
      `Reference project repository expected mutation response keys ${JSON.stringify(expectedResponseKeys)}. Received: ${JSON.stringify(receivedResponseKeys)}.`,
    );
  }

  if (
    responseShape !== "empty" &&
    typeof responseBody[responseShape] !== "string"
  ) {
    throw new Error(
      `Reference project repository expected mutation response ${responseShape} to be a string. Received: ${JSON.stringify(responseBody[responseShape])}.`,
    );
  }

  return {
    projectDocument: validateReferenceProjectDocument(response.projectDocument),
    responseBody,
  };
}

function requireStoredProject(
  projectDocument: ReferenceLocalProjectDocument,
  projectId: string,
): ReferenceStoredProject {
  const storedProject = projectDocument.projects.find(
    (candidateProject) => candidateProject.id === projectId,
  );

  if (storedProject === undefined) {
    throw new Error(
      `Reference project ${JSON.stringify(projectId)} was not found in the canonical document.`,
    );
  }

  return storedProject;
}

function assertExpectedProjectRevision(
  projectDocument: ReferenceLocalProjectDocument,
  projectId: string,
  expectedProjectRevision: string | undefined,
): void {
  if (expectedProjectRevision === undefined) {
    return;
  }
  if (typeof expectedProjectRevision !== "string" || expectedProjectRevision.length === 0) {
    throw new TypeError(
      `Reference project ${JSON.stringify(projectId)} expected revision must be a non-empty string; received ${JSON.stringify(expectedProjectRevision)}.`,
    );
  }

  const actualProjectRevision = requireStoredProject(
    projectDocument,
    projectId,
  ).updated_at;
  if (actualProjectRevision !== expectedProjectRevision) {
    throw new Error(
      `Reference project ${JSON.stringify(projectId)} save conflict: expected revision ${JSON.stringify(expectedProjectRevision)}; actual revision ${JSON.stringify(actualProjectRevision)}.`,
    );
  }
}

function replaceStoredProject(
  projectDocument: ReferenceLocalProjectDocument,
  projectId: string,
  replacementProject: ReferenceStoredProject,
): ReferenceLocalProjectDocument {
  const projectIndex = projectDocument.projects.findIndex(
    (candidateProject) => candidateProject.id === projectId,
  );

  if (projectIndex === -1) {
    throw new Error(
      `Reference project handler response did not contain project ${JSON.stringify(projectId)}.`,
    );
  }

  return copyReferenceProjectDocument(
    projectDocument,
    projectDocument.projects.map((storedProject, storedProjectIndex) =>
      storedProjectIndex === projectIndex ? replacementProject : storedProject,
    ),
  );
}

function copyReferenceProjectDocument(
  sourceDocument: ReferenceLocalProjectDocument,
  projects: readonly ReferenceStoredProject[],
): ReferenceLocalProjectDocument {
  const projectDocument: ReferenceLocalProjectDocument = {
    version: 1,
    projects: [...projects],
  };
  if (sourceDocument.folders !== undefined && sourceDocument.folders.length > 0) {
    projectDocument.folders = sourceDocument.folders.map((projectFolder) => ({
      id: projectFolder.id,
      name: projectFolder.name,
    }));
  }
  return projectDocument;
}

function placeProjectInMyPlans(
  storedProject: ReferenceStoredProject,
): ReferenceStoredProject {
  if (storedProject.folderId === undefined) {
    return storedProject;
  }

  const projectInMyPlans: ReferenceStoredProject = { ...storedProject };
  delete projectInMyPlans.folderId;
  return projectInMyPlans;
}

function assertReferenceFolderId(folderId: string): void {
  if (typeof folderId !== "string") {
    throw new TypeError(
      `Folder ID must be a string. Received: ${JSON.stringify(folderId)}.`,
    );
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(folderId)) {
    throw new Error(
      `Folder ID must contain only letters, digits, underscores, and hyphens and be at most 120 characters. Received: ${JSON.stringify(folderId)}.`,
    );
  }
}

function assignProjectFolder(
  storedProject: ReferenceStoredProject,
  folderId: string | null,
): ReferenceStoredProject {
  if (folderId === null) {
    return placeProjectInMyPlans(storedProject);
  }

  return { ...storedProject, folderId };
}

function replaceProjectUpdatedTimestamp(
  projectDocument: ReferenceLocalProjectDocument,
  projectId: string,
  updatedAt: string,
): ReferenceLocalProjectDocument {
  const storedProject = requireStoredProject(projectDocument, projectId);
  return replaceStoredProject(projectDocument, projectId, {
    ...storedProject,
    updated_at: updatedAt,
  });
}

type RestoredStoredMapRenderOptions = Readonly<{
  mapRenderOptions: MapRenderOptions;
  hasStoredFarmOptions: boolean;
}>;

function restoreStoredMapRenderOptions(
  rawMapRenderOptions: ReferenceJsonValue | undefined,
): RestoredStoredMapRenderOptions {
  const mapRenderOptions = restoreMapRenderOptions(rawMapRenderOptions);
  const hasStoredFarmOptions =
    rawMapRenderOptions !== undefined
    && rawMapRenderOptions !== null
    && typeof rawMapRenderOptions === "object"
    && !Array.isArray(rawMapRenderOptions)
    && Object.hasOwn(rawMapRenderOptions, "farm");

  return { mapRenderOptions, hasStoredFarmOptions };
}

function requireStoredFarmOptions(
  mapRenderOptions: MapRenderOptions,
  projectId: string,
  mapId: string,
): NonNullable<MapRenderOptions["farm"]> {
  if (mapRenderOptions.farm === undefined) {
    throw new Error(
      `Reference project ${JSON.stringify(projectId)} map ${JSON.stringify(mapId)} stored farm options were expected; received ${JSON.stringify(mapRenderOptions.farm)}.`,
    );
  }

  return mapRenderOptions.farm;
}

function serializeMapRenderOptions(
  mapRenderOptions: MapRenderOptions,
): Record<string, ReferenceJsonValue> {
  const serializedMapRenderOptions: Record<string, ReferenceJsonValue> = {
    gingerIslandOverlayIds: [...mapRenderOptions.gingerIslandOverlayIds],
    farmhouse2: {
      marriageMapEnabled: mapRenderOptions.farmhouse2.marriageMapEnabled,
      renovationIds: [...mapRenderOptions.farmhouse2.renovationIds],
      spouseId: mapRenderOptions.farmhouse2.spouseId,
    },
  };

  if (mapRenderOptions.farm !== undefined) {
    serializedMapRenderOptions.farm = {
      spouseId: mapRenderOptions.farm.spouseId,
      caveChoice: mapRenderOptions.farm.caveChoice,
    };
  }

  return serializedMapRenderOptions;
}

function findStoredProjectFarmOptions(
  storedProject: ReferenceStoredProject,
): NonNullable<MapRenderOptions["farm"]> | undefined {
  const restoredMapOptions = storedProject.project.maps.map((projectMap) => ({
    projectMap,
    ...restoreStoredMapRenderOptions(projectMap.state.mapRenderOptions),
  }));
  const activeMapOptions = restoredMapOptions.find(
    ({ projectMap }) => projectMap.id === storedProject.project.activeMapId,
  );
  const firstMapWithFarmOptions =
    activeMapOptions?.hasStoredFarmOptions === true
      ? activeMapOptions
      : restoredMapOptions.find(({ hasStoredFarmOptions }) => hasStoredFarmOptions);

  if (firstMapWithFarmOptions === undefined) {
    return undefined;
  }

  return requireStoredFarmOptions(
    firstMapWithFarmOptions.mapRenderOptions,
    storedProject.id,
    firstMapWithFarmOptions.projectMap.id,
  );
}

export function restoreMissingProjectFarmOptions(
  storedProject: ReferenceStoredProject,
): ReferenceStoredProject {
  const inheritedFarmOptions = findStoredProjectFarmOptions(storedProject);
  if (inheritedFarmOptions === undefined) {
    return storedProject;
  }

  return {
    ...storedProject,
    project: {
      ...storedProject.project,
      maps: storedProject.project.maps.map((projectMap) => {
        const { mapRenderOptions, hasStoredFarmOptions } =
          restoreStoredMapRenderOptions(projectMap.state.mapRenderOptions);
        if (hasStoredFarmOptions) {
          return projectMap;
        }

        return {
          ...projectMap,
          state: {
            ...projectMap.state,
            mapRenderOptions: serializeMapRenderOptions({
              ...mapRenderOptions,
              farm: inheritedFarmOptions,
            }),
          },
        };
      }),
    },
  };
}

function inheritFarmOptionsOnMap(
  projectMap: ReferenceProjectMap,
  farmOptions: NonNullable<MapRenderOptions["farm"]>,
): ReferenceProjectMap {
  return setFarmOptionsOnMap(projectMap, farmOptions);
}

function setFarmOptionsOnMap(
  projectMap: ReferenceProjectMap,
  farmOptions: NonNullable<MapRenderOptions["farm"]>,
): ReferenceProjectMap {
  const { mapRenderOptions } = restoreStoredMapRenderOptions(
    projectMap.state.mapRenderOptions,
  );

  return {
    ...projectMap,
    state: {
      ...projectMap.state,
      mapRenderOptions: serializeMapRenderOptions({
        ...mapRenderOptions,
        farm: farmOptions,
      }),
    },
  };
}

function synchronizeProjectFarmOptions(
  storedProject: ReferenceStoredProject,
  sourceMapId: string,
  farmOptions: NonNullable<MapRenderOptions["farm"]>,
): ReferenceStoredProject {
  return {
    ...storedProject,
    project: {
      ...storedProject.project,
      maps: storedProject.project.maps.map((projectMap) => {
        if (projectMap.id === sourceMapId) {
          return projectMap;
        }

        const { mapRenderOptions } = restoreStoredMapRenderOptions(
          projectMap.state.mapRenderOptions,
        );

        return {
          ...projectMap,
          state: {
            ...projectMap.state,
            mapRenderOptions: serializeMapRenderOptions({
              ...mapRenderOptions,
              farm: farmOptions,
            }),
          },
        };
      }),
    },
  };
}

function remapStoredProjectMapIdentity(
  storedProject: ReferenceStoredProject,
  sourceMapId: string,
  nextMapId: string,
): ReferenceStoredProject {
  let didFindSourceMap = false;
  const remappedMaps = storedProject.project.maps.map((projectMap) => {
    if (projectMap.id !== sourceMapId) {
      return projectMap;
    }

    didFindSourceMap = true;
    return {
      ...projectMap,
      id: nextMapId,
      thumbnail: `/api/projects/${storedProject.id}/maps/${nextMapId}/thumbnail`,
    };
  });

  if (!didFindSourceMap) {
    throw new Error(
      `Reference project map ${JSON.stringify(sourceMapId)} was not found in project ${JSON.stringify(storedProject.id)}.`,
    );
  }

  const remappedThumbnailsByMapId = {
    ...(storedProject.thumbnailsByMapId ?? {}),
  };
  const sourceThumbnail = remappedThumbnailsByMapId[sourceMapId];
  delete remappedThumbnailsByMapId[sourceMapId];
  if (sourceThumbnail !== undefined) {
    remappedThumbnailsByMapId[nextMapId] = sourceThumbnail;
  }

  return {
    ...storedProject,
    project: {
      ...storedProject.project,
      activeMapId:
        storedProject.project.activeMapId === sourceMapId
          ? nextMapId
          : storedProject.project.activeMapId,
      maps: remappedMaps,
    },
    thumbnailsByMapId: remappedThumbnailsByMapId,
  };
}

function findSingleAddedMapId(
  currentProject: ReferenceStoredProject,
  mutatedProject: ReferenceStoredProject,
): string {
  const currentMapIds = new Set(
    currentProject.project.maps.map((projectMap) => projectMap.id),
  );
  const addedMapIds = mutatedProject.project.maps
    .map((projectMap) => projectMap.id)
    .filter((mapId) => !currentMapIds.has(mapId));

  if (addedMapIds.length !== 1) {
    throw new Error(
      `Reference project repository expected exactly one added map ID. Received: ${JSON.stringify(addedMapIds)}.`,
    );
  }

  return addedMapIds[0];
}

function findSingleAddedProjectId(
  currentProjectDocument: ReferenceLocalProjectDocument,
  mutatedProjectDocument: ReferenceLocalProjectDocument,
): string {
  const currentProjectIds = new Set(
    currentProjectDocument.projects.map((storedProject) => storedProject.id),
  );
  const addedProjectIds = mutatedProjectDocument.projects
    .map((storedProject) => storedProject.id)
    .filter((projectId) => !currentProjectIds.has(projectId));

  if (addedProjectIds.length !== 1) {
    throw new Error(
      `Reference project repository expected exactly one added project ID. Received: ${JSON.stringify(addedProjectIds)}.`,
    );
  }

  return addedProjectIds[0];
}

function remapStoredProjectIdentifierPreservingMapIds(
  storedProject: ReferenceStoredProject,
  nextProjectId: string,
  createdAt: string,
  updatedAt: string,
): ReferenceStoredProject {
  return {
    ...storedProject,
    id: nextProjectId,
    created_at: createdAt,
    updated_at: updatedAt,
    project: {
      ...storedProject.project,
      maps: storedProject.project.maps.map((projectMap) => ({
        ...projectMap,
        thumbnail: `/api/projects/${nextProjectId}/maps/${projectMap.id}/thumbnail`,
      })),
    },
  };
}

function remapStoredProjectIdentity(
  sourceProject: ReferenceStoredProject,
  nextProjectId: string,
  createIdentifier: () => string,
  timestampOverride?: Readonly<{ createdAt: string; updatedAt: string }>,
  additionalOccupiedMapIds: readonly string[] = [],
): ReferenceStoredProject {
  const occupiedMapIds = new Set(
    [
      ...sourceProject.project.maps.map((sourceMap) => sourceMap.id),
      ...additionalOccupiedMapIds,
    ],
  );
  const remappedMapIds = new Map<string, string>();
  for (const sourceMap of sourceProject.project.maps) {
    remappedMapIds.set(
      sourceMap.id,
      allocateUniqueReferenceIdentifier(
        createIdentifier,
        occupiedMapIds,
        "remap project maps",
        `map IDs for project ${JSON.stringify(sourceProject.id)}`,
      ),
    );
  }

  const remappedMaps = sourceProject.project.maps.map((sourceMap) => {
    const remappedMapId = remappedMapIds.get(sourceMap.id);
    if (remappedMapId === undefined) {
      throw new Error(
        `Reference project map ID remapping failed for received map ID ${JSON.stringify(sourceMap.id)}.`,
      );
    }

    return {
      ...sourceMap,
      id: remappedMapId,
      thumbnail: `/api/projects/${nextProjectId}/maps/${remappedMapId}/thumbnail`,
    };
  });
  const remappedThumbnailsByMapId: Record<string, string> = {};
  for (const [sourceMapId, thumbnailDataUrl] of Object.entries(
    sourceProject.thumbnailsByMapId ?? {},
  )) {
    const remappedMapId = remappedMapIds.get(sourceMapId);
    if (remappedMapId === undefined) {
      throw new Error(
        `Reference project thumbnail ID remapping failed for received map ID ${JSON.stringify(sourceMapId)}.`,
      );
    }
    remappedThumbnailsByMapId[remappedMapId] = thumbnailDataUrl;
  }

  const activeMapId = sourceProject.project.activeMapId;
  const remappedActiveMapId =
    activeMapId === null ? null : remappedMapIds.get(activeMapId);
  if (activeMapId !== null && remappedActiveMapId === undefined) {
    throw new Error(
      `Reference project active map ID remapping failed for received map ID ${JSON.stringify(activeMapId)}.`,
    );
  }

  return {
    ...sourceProject,
    id: nextProjectId,
    created_at: timestampOverride?.createdAt ?? sourceProject.created_at,
    updated_at: timestampOverride?.updatedAt ?? sourceProject.updated_at,
    project: {
      ...sourceProject.project,
      activeMapId: remappedActiveMapId ?? null,
      maps: remappedMaps,
    },
    thumbnailsByMapId: remappedThumbnailsByMapId,
  };
}

function assertFirstMapWriteInput(
  input: ReferenceProjectFirstMapWriteInput,
): void {
  if (typeof input !== "object" || input === null) {
    throw new TypeError(
      `Reference project first map write input must be an object. Received: ${JSON.stringify(input)}.`,
    );
  }
  if (!(input.webpBytes instanceof Uint8Array) || input.webpBytes.byteLength === 0) {
    throw new TypeError(
      `Reference project first map thumbnail bytes must be a non-empty Uint8Array. Received: ${describeFirstMapThumbnailBytes(input.webpBytes)}.`,
    );
  }
}

function describeFirstMapThumbnailBytes(receivedBytes: unknown): string {
  if (receivedBytes instanceof Uint8Array) {
    return `Uint8Array(byteLength=${String(receivedBytes.byteLength)})`;
  }
  try {
    return JSON.stringify(receivedBytes);
  } catch {
    return `${typeof receivedBytes} value`;
  }
}

function assertCreatedProjectHasFirstMapPreview(
  storedProject: ReferenceStoredProject,
): void {
  const firstMap = storedProject.project.maps[0];
  const thumbnailDataUrl = firstMap === undefined
    ? undefined
    : storedProject.thumbnailsByMapId?.[firstMap.id];
  if (
    storedProject.project.maps.length !== 1
    || firstMap === undefined
    || storedProject.project.activeMapId !== firstMap.id
    || thumbnailDataUrl === undefined
    || !thumbnailDataUrl.startsWith("data:image/webp;base64,")
  ) {
    throw new Error(
      `Reference project ${JSON.stringify(storedProject.id)} must be stored with one active map and a WebP preview. Received activeMapId ${JSON.stringify(storedProject.project.activeMapId)}, map count ${String(storedProject.project.maps.length)}, and thumbnail ${JSON.stringify(thumbnailDataUrl ?? null)}.`,
    );
  }
}

export function createReferenceProjectRepository(
  options: ReferenceProjectRepositoryOptions = {},
): ReferenceProjectRepository {
  const storage = resolveReferenceProjectStorage(options.storage);
  const requestHandler =
    options.requestHandler ?? handleReferenceProjectRequest;
  const now = options.now ?? createCurrentIsoTimestamp;
  const createIdentifier =
    options.createIdentifier ?? createDefaultReferenceIdentifier;

  function readReferenceProjectDocument(): ReferenceLocalProjectDocument {
    const serializedProjectDocument = storage.getItem(referenceProjectStorageKey);

    return validateReferenceProjectDocument(
      parseReferenceProjectDocument(serializedProjectDocument),
    );
  }

  function openStoredProject(projectId: string): ReferenceStoredProject {
    const projectDocument = readReferenceProjectDocument();
    return restoreMissingProjectFarmOptions(
      requireStoredProject(projectDocument, projectId),
    );
  }

  function executeReferenceProjectTransaction<Result>(
    createTransactionResult: (
      currentProjectDocument: ReferenceLocalProjectDocument,
    ) => ReferenceProjectTransactionResult<Result>,
  ): Result {
    const currentProjectDocument = readReferenceProjectDocument();
    const transactionResult = createTransactionResult(currentProjectDocument);
    const validatedProjectDocument = validateReferenceProjectDocument(
      transactionResult.projectDocument,
    );
    const serializedProjectDocument = serializeReferenceProjectDocument(
      validatedProjectDocument,
    );
    const selectedResult = transactionResult.selectResult(
      validatedProjectDocument,
    );

    storage.setItem(referenceProjectStorageKey, serializedProjectDocument);
    return selectedResult;
  }

  function selectProjectMutationResult<PreparedActiveSession>(
    candidateProject: ReferenceStoredProject,
    prepareActiveSession?: ReferenceProjectPreflight<PreparedActiveSession>,
  ):
    | ReferenceStoredProject
    | ReferencePreparedProjectMutation<PreparedActiveSession> {
    const restoredCandidateProject =
      restoreMissingProjectFarmOptions(candidateProject);
    if (prepareActiveSession === undefined) {
      return restoredCandidateProject;
    }
    return {
      project: restoredCandidateProject,
      preparedActiveSession: prepareActiveSession(restoredCandidateProject),
    };
  }

  function invokeMutationHandler(
    request: ReferenceApiRequest,
    currentProjectDocument: ReferenceLocalProjectDocument,
    responseShape: ReferenceMutationResponseShape,
  ): ReturnType<typeof requireMutationResponse> {
    return requireMutationResponse(
      requestHandler(request, currentProjectDocument),
      responseShape,
    );
  }

  function executeSingleProjectMutation(
    request: ReferenceApiRequest,
    projectId: string,
    expectedProjectRevision?: string,
  ): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      assertExpectedProjectRevision(
        currentProjectDocument,
        projectId,
        expectedProjectRevision,
      );
      const currentProject = requireStoredProject(
        currentProjectDocument,
        projectId,
      );
      const nextProjectUpdatedAt = createNextProjectUpdatedAt(
        currentProject,
        now(),
      );
      const mutationResponse = invokeMutationHandler(
        request,
        currentProjectDocument,
        "empty",
      );
      const projectDocument = replaceProjectUpdatedTimestamp(
        mutationResponse.projectDocument,
        projectId,
        nextProjectUpdatedAt,
      );

      return {
        projectDocument,
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, projectId),
      };
    });
  }

  function createProject(
    input: ReferenceProjectCreationInput,
  ): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const mutationResponse = invokeMutationHandler(
        {
          method: "POST",
          pathname: "/api/projects",
          jsonBody: {
            projectName: input.projectName,
            season: input.season,
          },
        },
        currentProjectDocument,
        "projectId",
      );
      const handlerProjectId = mutationResponse.responseBody.projectId as string;
      const createdProject = requireStoredProject(
        mutationResponse.projectDocument,
        handlerProjectId,
      );
      const createdAt = assertMutationTimestamp(now());
      const createdProjectId = allocateUniqueReferenceIdentifier(
        createIdentifier,
        new Set(currentProjectDocument.projects.map((storedProject) => storedProject.id)),
        "create project",
        "project IDs",
      );
      const remappedProject = remapStoredProjectIdentity(
        createdProject,
        createdProjectId,
        createIdentifier,
        { createdAt, updatedAt: createdAt },
      );
      const projectDocument = replaceStoredProject(
        mutationResponse.projectDocument,
        handlerProjectId,
        remappedProject,
      );

      return {
        projectDocument,
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, createdProjectId),
      };
    });
  }

  function createProjectWithFirstMap(
    input: ReferenceProjectFirstMapWriteInput,
  ): ReferenceStoredProject {
    assertFirstMapWriteInput(input);
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const createdResponse = invokeMutationHandler(
        {
          method: "POST",
          pathname: "/api/projects",
          jsonBody: {
            projectName: input.projectName,
            season: input.season,
          },
        },
        currentProjectDocument,
        "projectId",
      );
      const handlerProjectId = createdResponse.responseBody.projectId;
      if (typeof handlerProjectId !== "string" || handlerProjectId.length === 0) {
        throw new Error(
          `Reference project creation did not return a project ID. Received: ${JSON.stringify(handlerProjectId)}.`,
        );
      }
      const mapResponse = invokeMutationHandler(
        {
          method: "POST",
          pathname: createReferenceMapCollectionPath(handlerProjectId),
          jsonBody: {
            mapFile: input.mapFile,
            label: input.label,
            season: input.mapSeason,
          },
        },
        createdResponse.projectDocument,
        "mapId",
      );
      const handlerMapId = mapResponse.responseBody.mapId;
      if (typeof handlerMapId !== "string" || handlerMapId.length === 0) {
        throw new Error(
          `Reference project ${JSON.stringify(handlerProjectId)} first map creation did not return a map ID. Received: ${JSON.stringify(handlerMapId)}.`,
        );
      }
      const updateResponse = invokeMutationHandler(
        {
          method: "PUT",
          pathname: createReferenceMapPath(handlerProjectId, handlerMapId),
          jsonBody: {
            mapFile: input.mapFile,
            label: input.label,
            season: input.mapSeason,
            state: input.state,
            decor: input.decor,
            renovations: input.renovations,
            setActive: true,
          },
        },
        mapResponse.projectDocument,
        "empty",
      );
      const { mapRenderOptions, hasStoredFarmOptions } =
        restoreStoredMapRenderOptions(input.state.mapRenderOptions);
      const projectAfterMapUpdate = requireStoredProject(
        updateResponse.projectDocument,
        handlerProjectId,
      );
      const projectWithFarmOptions = hasStoredFarmOptions
        ? synchronizeProjectFarmOptions(
            projectAfterMapUpdate,
            handlerMapId,
            requireStoredFarmOptions(
              mapRenderOptions,
              handlerProjectId,
              handlerMapId,
            ),
          )
        : projectAfterMapUpdate;
      const projectDocumentAfterMapUpdate = projectWithFarmOptions === projectAfterMapUpdate
        ? updateResponse.projectDocument
        : replaceStoredProject(
            updateResponse.projectDocument,
            handlerProjectId,
            projectWithFarmOptions,
          );
      const thumbnailResponse = invokeMutationHandler(
        {
          method: "POST",
          pathname: createReferenceMapActionPath(
            handlerProjectId,
            handlerMapId,
            "thumbnail",
          ),
          contentType: "image/webp",
          binaryBody: input.webpBytes,
        },
        projectDocumentAfterMapUpdate,
        "empty",
      );
      const createdAt = assertMutationTimestamp(now());
      const createdProjectId = allocateUniqueReferenceIdentifier(
        createIdentifier,
        new Set(
          currentProjectDocument.projects.map((storedProject) => storedProject.id),
        ),
        "create project with first map",
        "project IDs",
      );
      const remappedProject = remapStoredProjectIdentity(
        requireStoredProject(thumbnailResponse.projectDocument, handlerProjectId),
        createdProjectId,
        createIdentifier,
        { createdAt, updatedAt: createdAt },
      );
      assertCreatedProjectHasFirstMapPreview(remappedProject);
      return {
        projectDocument: replaceStoredProject(
          thumbnailResponse.projectDocument,
          handlerProjectId,
          remappedProject,
        ),
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, createdProjectId),
      };
    });
  }

  function renameProject(
    projectId: string,
    requestedName: string,
  ): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const currentProject = requireStoredProject(
        currentProjectDocument,
        projectId,
      );
      const nextProjectUpdatedAt = createNextProjectUpdatedAt(
        currentProject,
        now(),
      );
      const mutationResponse = invokeMutationHandler(
        {
          method: "PUT",
          pathname: createReferenceProjectPath(projectId),
          jsonBody: { projectName: requestedName },
        },
        currentProjectDocument,
        "empty",
      );
      const renamedProject = requireStoredProject(
        mutationResponse.projectDocument,
        projectId,
      );
      const projectDocument = replaceStoredProject(
        mutationResponse.projectDocument,
        projectId,
        {
          ...renamedProject,
          updated_at: nextProjectUpdatedAt,
        },
      );

      return {
        projectDocument,
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, projectId),
      };
    });
  }

  function deleteProject(projectId: string): void {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const mutationResponse = invokeMutationHandler(
        {
          method: "DELETE",
          pathname: createReferenceProjectPath(projectId),
        },
        currentProjectDocument,
        "empty",
      );

      return {
        projectDocument: mutationResponse.projectDocument,
        selectResult: () => undefined,
      };
    });
  }

  function duplicateProject(projectId: string): ReferenceStoredProject;
  function duplicateProject<PreparedActiveSession>(
    projectId: string,
    prepareActiveSession: ReferenceProjectPreflight<PreparedActiveSession>,
  ): ReferencePreparedProjectMutation<PreparedActiveSession>;
  function duplicateProject<PreparedActiveSession>(
    projectId: string,
    prepareActiveSession?: ReferenceProjectPreflight<PreparedActiveSession>,
  ):
    | ReferenceStoredProject
    | ReferencePreparedProjectMutation<PreparedActiveSession> {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const sourceProject = requireStoredProject(
        currentProjectDocument,
        projectId,
      );
      const duplicateProjectId = allocateUniqueReferenceIdentifier(
        createIdentifier,
        new Set(currentProjectDocument.projects.map((storedProject) => storedProject.id)),
        "duplicate project",
        "project IDs",
      );
      const duplicateTimestamp = assertMutationTimestamp(now());
      const duplicatedProject = remapStoredProjectIdentity(
        sourceProject,
        duplicateProjectId,
        createIdentifier,
        {
          createdAt: duplicateTimestamp,
          updatedAt: duplicateTimestamp,
        },
      );

      return {
        projectDocument: copyReferenceProjectDocument(currentProjectDocument, [
          ...currentProjectDocument.projects,
          duplicatedProject,
        ]),
        selectResult: (validatedProjectDocument) =>
          selectProjectMutationResult(
            requireStoredProject(validatedProjectDocument, duplicateProjectId),
            prepareActiveSession,
          ),
      };
    });
  }

  function createMap(input: ReferenceMapCreationInput): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const currentProject = requireStoredProject(
        currentProjectDocument,
        input.projectId,
      );
      const inheritedFarmOptions = findStoredProjectFarmOptions(currentProject);
      const nextProjectUpdatedAt = createNextProjectUpdatedAt(
        currentProject,
        now(),
      );
      const mutationResponse = invokeMutationHandler(
        {
          method: "POST",
          pathname: createReferenceMapCollectionPath(input.projectId),
          jsonBody: {
            mapFile: input.mapFile,
            label: input.label,
            season: input.season,
          },
        },
        currentProjectDocument,
        "mapId",
      );
      const handlerMapId = mutationResponse.responseBody.mapId as string;
      const mutatedProject = requireStoredProject(
        mutationResponse.projectDocument,
        input.projectId,
      );
      const createdMapId = allocateUniqueReferenceIdentifier(
        createIdentifier,
        new Set(currentProject.project.maps.map((projectMap) => projectMap.id)),
        "create map",
        `map IDs for project ${JSON.stringify(input.projectId)}`,
      );
      const remappedProject = remapStoredProjectMapIdentity(
        mutatedProject,
        handlerMapId,
        createdMapId,
      );
      const projectWithInheritedFarmOptions = inheritedFarmOptions === undefined
        ? remappedProject
        : {
            ...remappedProject,
            project: {
              ...remappedProject.project,
              maps: remappedProject.project.maps.map((projectMap) =>
                projectMap.id === createdMapId
                  ? inheritFarmOptionsOnMap(projectMap, inheritedFarmOptions)
                  : projectMap,
              ),
            },
          };
      const projectDocument = replaceStoredProject(
        mutationResponse.projectDocument,
        input.projectId,
        {
          ...projectWithInheritedFarmOptions,
          updated_at: nextProjectUpdatedAt,
        },
      );

      return {
        projectDocument,
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, input.projectId),
      };
    });
  }

  function updateMap(input: ReferenceMapUpdateInput): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      assertExpectedProjectRevision(
        currentProjectDocument,
        input.projectId,
        input.expectedProjectRevision,
      );
      const currentProject = requireStoredProject(
        currentProjectDocument,
        input.projectId,
      );
      const { mapRenderOptions, hasStoredFarmOptions } =
        restoreStoredMapRenderOptions(input.state.mapRenderOptions);
      const farmOptionsToSynchronize = hasStoredFarmOptions
        ? requireStoredFarmOptions(mapRenderOptions, input.projectId, input.mapId)
        : undefined;
      const nextProjectUpdatedAt = createNextProjectUpdatedAt(
        currentProject,
        now(),
      );
      const mutationResponse = invokeMutationHandler(
        {
          method: "PUT",
          pathname: createReferenceMapPath(input.projectId, input.mapId),
          jsonBody: {
            mapFile: input.mapFile,
            label: input.label,
            season: input.season,
            state: input.state,
            decor: input.decor,
            renovations: input.renovations,
            setActive: input.setActive,
          },
        },
        currentProjectDocument,
        "empty",
      );
      const updatedProject = requireStoredProject(
        mutationResponse.projectDocument,
        input.projectId,
      );
      const projectWithSynchronizedFarmOptions = farmOptionsToSynchronize === undefined
        ? updatedProject
        : synchronizeProjectFarmOptions(
            updatedProject,
            input.mapId,
            farmOptionsToSynchronize,
          );
      const projectDocument = replaceStoredProject(
        mutationResponse.projectDocument,
        input.projectId,
        {
          ...projectWithSynchronizedFarmOptions,
          updated_at: nextProjectUpdatedAt,
        },
      );

      return {
        projectDocument,
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, input.projectId),
      };
    });
  }

  function renameMap(input: ReferenceMapRenameInput): ReferenceStoredProject {
    return executeSingleProjectMutation(
      {
        method: "PATCH",
        pathname: createReferenceMapPath(input.projectId, input.mapId),
        jsonBody: { label: input.requestedLabel },
      },
      input.projectId,
    );
  }

  function deleteMap(input: ReferenceMapIdentityInput): ReferenceStoredProject {
    return executeSingleProjectMutation(
      {
        method: "DELETE",
        pathname: createReferenceMapPath(input.projectId, input.mapId),
      },
      input.projectId,
    );
  }

  function duplicateMap(
    input: ReferenceMapIdentityInput,
  ): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const currentProject = requireStoredProject(
        currentProjectDocument,
        input.projectId,
      );
      const nextProjectUpdatedAt = createNextProjectUpdatedAt(
        currentProject,
        now(),
      );
      const mutationResponse = invokeMutationHandler(
        {
          method: "POST",
          pathname: createReferenceMapActionPath(
            input.projectId,
            input.mapId,
            "duplicate",
          ),
        },
        currentProjectDocument,
        "empty",
      );
      const mutatedProject = requireStoredProject(
        mutationResponse.projectDocument,
        input.projectId,
      );
      const handlerMapId = findSingleAddedMapId(
        currentProject,
        mutatedProject,
      );
      const remappedProject = remapStoredProjectMapIdentity(
        mutatedProject,
        handlerMapId,
        allocateUniqueReferenceIdentifier(
          createIdentifier,
          new Set(currentProject.project.maps.map((projectMap) => projectMap.id)),
          "duplicate map",
          `map IDs for project ${JSON.stringify(input.projectId)}`,
        ),
      );
      const projectDocument = replaceStoredProject(
        mutationResponse.projectDocument,
        input.projectId,
        {
          ...remappedProject,
          updated_at: nextProjectUpdatedAt,
        },
      );

      return {
        projectDocument,
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, input.projectId),
      };
    });
  }

  function resolveAndValidateMapTransferTarget(
    input: ReferenceMapTransferInput,
    currentProjectDocument: ReferenceLocalProjectDocument,
    mutationResponse: ReturnType<typeof requireMutationResponse>,
  ): ReferenceResolvedMapTransferTarget {
    const handlerTargetProjectId =
      input.targetProjectId ??
      findSingleAddedProjectId(
        currentProjectDocument,
        mutationResponse.projectDocument,
      );
    const handlerTargetProject = requireStoredProject(
      mutationResponse.projectDocument,
      handlerTargetProjectId,
    );
    const responseProjectTitle =
      mutationResponse.responseBody.projectTitle as string;

    if (responseProjectTitle !== handlerTargetProject.title) {
      throw new Error(
        `Reference project repository transfer response projectTitle must match the target project title. Received projectTitle: ${JSON.stringify(responseProjectTitle)}; target title: ${JSON.stringify(handlerTargetProject.title)}.`,
      );
    }

    return { handlerTargetProjectId, handlerTargetProject };
  }

  function normalizeNewMapTransferTargetIdentity(
    transferAction: "copy" | "move",
    input: ReferenceMapTransferInput,
    currentProjectDocument: ReferenceLocalProjectDocument,
    mutationResponse: ReturnType<typeof requireMutationResponse>,
    resolvedTarget: ReferenceResolvedMapTransferTarget,
    transferTimestamp: string,
  ): ReferenceNormalizedMapTransferTarget {
    const targetProjectId = allocateUniqueReferenceIdentifier(
      createIdentifier,
      new Set(
        mutationResponse.projectDocument.projects
          .filter((storedProject) => storedProject.id !== resolvedTarget.handlerTargetProjectId)
          .map((storedProject) => storedProject.id),
      ),
      `${transferAction} map to new project`,
      "project IDs",
    );
    const targetProject =
      transferAction === "copy"
        ? remapStoredProjectIdentity(
            resolvedTarget.handlerTargetProject,
            targetProjectId,
            createIdentifier,
            {
              createdAt: transferTimestamp,
              updatedAt: transferTimestamp,
            },
            requireStoredProject(currentProjectDocument, input.projectId).project.maps.map(
              (projectMap) => projectMap.id,
            ),
          )
        : remapStoredProjectIdentifierPreservingMapIds(
            resolvedTarget.handlerTargetProject,
            targetProjectId,
            transferTimestamp,
            transferTimestamp,
          );

    return {
      projectDocument: replaceStoredProject(
        mutationResponse.projectDocument,
        resolvedTarget.handlerTargetProjectId,
        targetProject,
      ),
      targetProjectId,
    };
  }

  function normalizeExistingMapTransferTargetIdentity(
    targetProjectId: string,
    transferAction: "copy" | "move",
    currentProjectDocument: ReferenceLocalProjectDocument,
    mutationResponse: ReturnType<typeof requireMutationResponse>,
    resolvedTarget: ReferenceResolvedMapTransferTarget,
  ): ReferenceNormalizedMapTransferTarget {
    if (transferAction === "move") {
      return {
        projectDocument: mutationResponse.projectDocument,
        targetProjectId,
      };
    }

    const currentTargetProject = requireStoredProject(
      currentProjectDocument,
      targetProjectId,
    );
    const handlerMapId = findSingleAddedMapId(
      currentTargetProject,
      resolvedTarget.handlerTargetProject,
    );
    const targetProject = remapStoredProjectMapIdentity(
      resolvedTarget.handlerTargetProject,
      handlerMapId,
      allocateUniqueReferenceIdentifier(
        createIdentifier,
        new Set(
          currentTargetProject.project.maps.map((projectMap) => projectMap.id),
        ),
        "copy map to existing project",
        `map IDs for project ${JSON.stringify(targetProjectId)}`,
      ),
    );

    return {
      projectDocument: replaceStoredProject(
        mutationResponse.projectDocument,
        targetProjectId,
        targetProject,
      ),
      targetProjectId,
    };
  }

  function normalizeMapTransferTargetIdentity(
    input: ReferenceMapTransferInput,
    transferAction: "copy" | "move",
    currentProjectDocument: ReferenceLocalProjectDocument,
    mutationResponse: ReturnType<typeof requireMutationResponse>,
    resolvedTarget: ReferenceResolvedMapTransferTarget,
    transferTimestamp: string,
  ): ReferenceNormalizedMapTransferTarget {
    if (input.targetProjectId === undefined) {
      return normalizeNewMapTransferTargetIdentity(
        transferAction,
        input,
        currentProjectDocument,
        mutationResponse,
        resolvedTarget,
        transferTimestamp,
      );
    }

    return normalizeExistingMapTransferTargetIdentity(
      input.targetProjectId,
      transferAction,
      currentProjectDocument,
      mutationResponse,
      resolvedTarget,
    );
  }

  function findTransferredMapId(
    input: ReferenceMapTransferInput,
    transferAction: "copy" | "move",
    currentProjectDocument: ReferenceLocalProjectDocument,
    targetProject: ReferenceStoredProject,
  ): string {
    if (transferAction === "move") {
      const movedMapExists = targetProject.project.maps.some(
        (projectMap) => projectMap.id === input.mapId,
      );
      if (!movedMapExists) {
        throw new Error(
          `Reference project repository move target ${JSON.stringify(targetProject.id)} did not contain transferred map ${JSON.stringify(input.mapId)}.`,
        );
      }
      return input.mapId;
    }

    if (input.targetProjectId === undefined) {
      const copiedMapId = targetProject.project.activeMapId;
      if (
        copiedMapId === null
        || !targetProject.project.maps.some(
          (projectMap) => projectMap.id === copiedMapId,
        )
      ) {
        throw new Error(
          `Reference project repository copy target ${JSON.stringify(targetProject.id)} must have an active transferred map; received ${JSON.stringify(copiedMapId)}.`,
        );
      }
      return copiedMapId;
    }

    return findSingleAddedMapId(
      requireStoredProject(currentProjectDocument, input.targetProjectId),
      targetProject,
    );
  }

  function synchronizeTransferredProjectFarmOptions(
    projectDocument: ReferenceLocalProjectDocument,
    targetProjectId: string,
    transferredMapId: string,
    farmOptions: NonNullable<MapRenderOptions["farm"]>,
  ): ReferenceLocalProjectDocument {
    const targetProject = requireStoredProject(projectDocument, targetProjectId);
    const targetProjectWithTransferredFarmOptions = {
      ...targetProject,
      project: {
        ...targetProject.project,
        maps: targetProject.project.maps.map((projectMap) =>
          projectMap.id === transferredMapId
            ? setFarmOptionsOnMap(projectMap, farmOptions)
            : projectMap,
        ),
      },
    };
    const transferredMapExists = targetProject.project.maps.some(
      (projectMap) => projectMap.id === transferredMapId,
    );
    if (!transferredMapExists) {
      throw new Error(
        `Reference project repository target ${JSON.stringify(targetProjectId)} did not contain transferred map ${JSON.stringify(transferredMapId)}.`,
      );
    }

    return replaceStoredProject(
      projectDocument,
      targetProjectId,
      synchronizeProjectFarmOptions(
        targetProjectWithTransferredFarmOptions,
        transferredMapId,
        farmOptions,
      ),
    );
  }

  function applyMapTransferTimestamps(
    projectDocument: ReferenceLocalProjectDocument,
    sourceProjectId: string,
    targetProjectId: string,
    sourceProjectUpdatedAt: string,
    targetProjectUpdatedAt: string,
  ): ReferenceLocalProjectDocument {
    const sourceTimestampedProjectDocument = replaceProjectUpdatedTimestamp(
      projectDocument,
      sourceProjectId,
      sourceProjectUpdatedAt,
    );
    if (targetProjectId === sourceProjectId) {
      return sourceTimestampedProjectDocument;
    }

    return replaceProjectUpdatedTimestamp(
      sourceTimestampedProjectDocument,
      targetProjectId,
      targetProjectUpdatedAt,
    );
  }

  function selectMapTransferResult(
    validatedProjectDocument: ReferenceLocalProjectDocument,
    sourceProjectId: string,
    targetProjectId: string,
  ): ReferenceMapMoveResult {
    const sourceProject = requireStoredProject(
      validatedProjectDocument,
      sourceProjectId,
    );
    const targetProject = requireStoredProject(
      validatedProjectDocument,
      targetProjectId,
    );
    return {
      sourceProject: restoreMissingProjectFarmOptions(sourceProject),
      targetProject: restoreMissingProjectFarmOptions(targetProject),
    };
  }

  function executeMapTransfer(
    input: ReferenceMapTransferInput,
    transferAction: "copy" | "move",
  ): ReferenceMapMoveResult {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const requestedMutationTimestamp = assertMutationTimestamp(now());
      const sourceProject = requireStoredProject(
        currentProjectDocument,
        input.projectId,
      );
      const sourceFarmOptions = findStoredProjectFarmOptions(sourceProject);
      const currentTargetProject = input.targetProjectId === undefined
        ? undefined
        : requireStoredProject(currentProjectDocument, input.targetProjectId);
      const currentTargetFarmOptions = currentTargetProject === undefined
        ? undefined
        : findStoredProjectFarmOptions(currentTargetProject);
      const sourceProjectUpdatedAt = createNextProjectUpdatedAt(
        sourceProject,
        requestedMutationTimestamp,
      );
      const transferBody =
        input.targetProjectId !== undefined
          ? { targetProjectId: input.targetProjectId }
          : { newProjectName: input.newProjectName };
      const mutationResponse = invokeMutationHandler(
        {
          method: "POST",
          pathname: createReferenceMapActionPath(
            input.projectId,
            input.mapId,
            transferAction,
          ),
          jsonBody: transferBody,
        },
        currentProjectDocument,
        "projectTitle",
      );
      const resolvedTarget = resolveAndValidateMapTransferTarget(
        input,
        currentProjectDocument,
        mutationResponse,
      );
      const targetProjectUpdatedAt = input.targetProjectId === undefined
        ? requestedMutationTimestamp
        : input.targetProjectId === input.projectId
          ? sourceProjectUpdatedAt
          : createNextProjectUpdatedAt(
              requireStoredProject(
                currentProjectDocument,
                input.targetProjectId,
              ),
              requestedMutationTimestamp,
            );
      const normalizedTarget = normalizeMapTransferTargetIdentity(
        input,
        transferAction,
        currentProjectDocument,
        mutationResponse,
        resolvedTarget,
        requestedMutationTimestamp,
      );
      const targetFarmOptions = currentTargetFarmOptions ?? sourceFarmOptions;
      const projectDocumentWithFarmOptions =
        normalizedTarget.targetProjectId === input.projectId
        || targetFarmOptions === undefined
          ? normalizedTarget.projectDocument
          : synchronizeTransferredProjectFarmOptions(
              normalizedTarget.projectDocument,
              normalizedTarget.targetProjectId,
              findTransferredMapId(
                input,
                transferAction,
                currentProjectDocument,
                requireStoredProject(
                  normalizedTarget.projectDocument,
                  normalizedTarget.targetProjectId,
                ),
              ),
              targetFarmOptions,
            );
      const projectDocument = applyMapTransferTimestamps(
        projectDocumentWithFarmOptions,
        input.projectId,
        normalizedTarget.targetProjectId,
        sourceProjectUpdatedAt,
        targetProjectUpdatedAt,
      );

      return {
        projectDocument,
        selectResult: (validatedProjectDocument) =>
          selectMapTransferResult(
            validatedProjectDocument,
            input.projectId,
            normalizedTarget.targetProjectId,
          ),
      };
    });
  }

  function copyMap(input: ReferenceMapTransferInput): ReferenceStoredProject {
    return executeMapTransfer(input, "copy").targetProject;
  }

  function moveMap(input: ReferenceMapTransferInput): ReferenceMapMoveResult {
    return executeMapTransfer(input, "move");
  }

  function listFolders(): readonly ReferenceProjectFolder[] {
    return readReferenceProjectDocument().folders ?? [];
  }

  function createFolder(folderName: string): ReferenceProjectFolder {
    if (typeof folderName !== "string") {
      throw new TypeError(
        `Folder name must be a string. Received: ${JSON.stringify(folderName)}.`,
      );
    }

    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const folderId = allocateUniqueReferenceIdentifier(
        createIdentifier,
        new Set(
          (currentProjectDocument.folders ?? []).map(
            (projectFolder) => projectFolder.id,
          ),
        ),
        "create folder",
        "folder IDs",
      );
      return {
        projectDocument: {
          version: 1,
          projects: currentProjectDocument.projects,
          folders: [
            ...(currentProjectDocument.folders ?? []),
            { id: folderId, name: folderName },
          ],
        },
        selectResult: (validatedProjectDocument) => {
          const createdFolder = validatedProjectDocument.folders?.find(
            (projectFolder) => projectFolder.id === folderId,
          );
          if (createdFolder === undefined) {
            throw new Error(
              `Reference project folder ${JSON.stringify(folderId)} was not stored. Received folders: ${JSON.stringify(validatedProjectDocument.folders ?? [])}.`,
            );
          }
          return createdFolder;
        },
      };
    });
  }

  function renameFolder(
    folderId: string,
    folderName: string,
  ): ReferenceProjectFolder {
    assertReferenceFolderId(folderId);
    if (typeof folderName !== "string") {
      throw new TypeError(
        `Folder name must be a string. Received: ${JSON.stringify(folderName)}.`,
      );
    }

    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const projectFolders = currentProjectDocument.folders ?? [];
      const folderIndex = projectFolders.findIndex(
        (projectFolder) => projectFolder.id === folderId,
      );
      if (folderIndex === -1) {
        throw new Error(
          `Folder ID does not exist. Received: ${JSON.stringify(folderId)}. Existing folder IDs: ${JSON.stringify(projectFolders.map((projectFolder) => projectFolder.id))}.`,
        );
      }

      return {
        projectDocument: {
          version: 1,
          projects: currentProjectDocument.projects,
          folders: projectFolders.map((projectFolder, projectFolderIndex) =>
            projectFolderIndex === folderIndex
              ? { id: projectFolder.id, name: folderName }
              : { id: projectFolder.id, name: projectFolder.name },
          ),
        },
        selectResult: (validatedProjectDocument) => {
          const renamedFolder = validatedProjectDocument.folders?.[folderIndex];
          if (renamedFolder === undefined || renamedFolder.id !== folderId) {
            throw new Error(
              `Reference project folder ${JSON.stringify(folderId)} was not stored at index ${String(folderIndex)}. Received folders: ${JSON.stringify(validatedProjectDocument.folders ?? [])}.`,
            );
          }
          return renamedFolder;
        },
      };
    });
  }

  function moveProjectToFolder(
    projectId: string,
    folderId: string | null,
  ): ReferenceStoredProject {
    if (typeof projectId !== "string") {
      throw new TypeError(
        `Project ID must be a string. Received: ${JSON.stringify(projectId)}.`,
      );
    }
    if (folderId !== null && typeof folderId !== "string") {
      throw new TypeError(
        `Folder ID must be a string or null for My Plans. Received: ${JSON.stringify(folderId)}.`,
      );
    }

    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const storedProject = requireStoredProject(currentProjectDocument, projectId);
      const movedProject = assignProjectFolder(storedProject, folderId);
      return {
        projectDocument: copyReferenceProjectDocument(
          currentProjectDocument,
          currentProjectDocument.projects.map((candidateProject) =>
            candidateProject.id === projectId ? movedProject : candidateProject,
          ),
        ),
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, projectId),
      };
    });
  }

  function countMyPlans(): number {
    return readReferenceProjectDocument().projects.filter(
      (storedProject) => storedProject.folderId === undefined,
    ).length;
  }

  function saveThumbnail(
    input: ReferenceThumbnailSaveInput,
  ): ReferenceStoredProject {
    return executeSingleProjectMutation(
      {
        method: "POST",
        pathname: createReferenceMapActionPath(
          input.projectId,
          input.mapId,
          "thumbnail",
        ),
        contentType: "image/webp",
        binaryBody: input.webpBytes,
      },
      input.projectId,
    );
  }

  function importProject(serializedProject: string): ReferenceStoredProject;
  function importProject<PreparedActiveSession>(
    serializedProject: string,
    prepareActiveSession: ReferenceProjectPreflight<PreparedActiveSession>,
  ): ReferencePreparedProjectMutation<PreparedActiveSession>;
  function importProject<PreparedActiveSession>(
    serializedProject: string,
    prepareActiveSession?: ReferenceProjectPreflight<PreparedActiveSession>,
  ):
    | ReferenceStoredProject
    | ReferencePreparedProjectMutation<PreparedActiveSession> {
    const importedProjectDocument = validateReferenceProjectDocument(
      parseReferenceProjectDocument(serializedProject),
    );

    if (importedProjectDocument.projects.length !== 1) {
      throw new Error(
        `Reference project import requires exactly one project. Received project count: ${String(importedProjectDocument.projects.length)}.`,
      );
    }

    const importedProject = importedProjectDocument.projects[0];
    if (importedProject === undefined) {
      throw new Error(
        "Reference project import requires exactly one project. Received project count: 0.",
      );
    }
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const hasProjectIdConflict = currentProjectDocument.projects.some(
        (candidateProject) => candidateProject.id === importedProject.id,
      );
      let appendedProject = importedProject;
      if (hasProjectIdConflict) {
        const importedAt = assertMutationTimestamp(now());
        appendedProject = remapStoredProjectIdentity(
          importedProject,
          allocateUniqueReferenceIdentifier(
            createIdentifier,
            new Set(
              currentProjectDocument.projects.map((storedProject) => storedProject.id),
            ),
            "import conflicting project",
            "project IDs",
          ),
          createIdentifier,
          { createdAt: importedAt, updatedAt: importedAt },
        );
      }

      return {
        projectDocument: copyReferenceProjectDocument(currentProjectDocument, [
          ...currentProjectDocument.projects,
          placeProjectInMyPlans(appendedProject),
        ]),
        selectResult: (validatedProjectDocument) =>
          selectProjectMutationResult(
            requireStoredProject(validatedProjectDocument, appendedProject.id),
            prepareActiveSession,
          ),
      };
    });
  }

  return {
    listProjects: () =>
      readReferenceProjectDocument().projects.map(createReferenceProjectSummary),
    openProject: openStoredProject,
    createProject,
    createProjectWithFirstMap,
    duplicateProject,
    renameProject,
    deleteProject,
    importProject,
    exportProject: (projectId: string) =>
      serializeReferenceProjectDocument({
        version: 1,
        projects: [placeProjectInMyPlans(openStoredProject(projectId))],
      }),
    updateMap,
    createMap,
    renameMap,
    duplicateMap,
    deleteMap,
    copyMap,
    moveMap,
    saveThumbnail,
    listFolders,
    createFolder,
    renameFolder,
    moveProjectToFolder,
    countMyPlans,
  };
}
