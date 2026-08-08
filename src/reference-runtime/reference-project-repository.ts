import type {
  ReferenceApiRequest,
  ReferenceApiResponse,
  ReferenceLocalProjectDocument,
  ReferenceJsonValue,
  ReferenceProjectMap,
  ReferenceStoredProject,
} from "./local-project-api";
import {
  handleReferenceProjectRequest,
  parseReferenceProjectDocument,
  serializeReferenceProjectDocument,
  validateReferenceProjectDocument,
} from "./local-project-api";

export const referenceProjectStorageKey =
  "stardewplan-reference-local-projects-v1";

export type ReferenceProjectStorage = Readonly<{
  getItem(storageKey: string): string | null;
  setItem(storageKey: string, serializedProjectDocument: string): void;
}>;

export type ReferenceProjectSummary = Readonly<
  Pick<ReferenceStoredProject, "id" | "title" | "created_at" | "updated_at">
>;

export type ReferenceProjectCreationInput = Readonly<{
  projectName: string;
  season: ReferenceProjectMap["season"];
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

export type ReferenceProjectRepository = Readonly<{
  listProjects(): readonly ReferenceProjectSummary[];
  openProject(projectId: string): ReferenceStoredProject;
  createProject(input: ReferenceProjectCreationInput): ReferenceStoredProject;
  duplicateProject(projectId: string): ReferenceStoredProject;
  renameProject(
    projectId: string,
    requestedName: string,
  ): ReferenceStoredProject;
  deleteProject(projectId: string): void;
  importProject(serializedProject: string): ReferenceStoredProject;
  exportProject(projectId: string): string;
  updateMap(input: ReferenceMapUpdateInput): ReferenceStoredProject;
  createMap(input: ReferenceMapCreationInput): ReferenceStoredProject;
  renameMap(input: ReferenceMapRenameInput): ReferenceStoredProject;
  duplicateMap(input: ReferenceMapIdentityInput): ReferenceStoredProject;
  deleteMap(input: ReferenceMapIdentityInput): ReferenceStoredProject;
  copyMap(input: ReferenceMapTransferInput): ReferenceStoredProject;
  moveMap(input: ReferenceMapTransferInput): ReferenceMapMoveResult;
  saveThumbnail(input: ReferenceThumbnailSaveInput): ReferenceStoredProject;
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

  return {
    version: 1,
    projects: projectDocument.projects.map((storedProject, storedProjectIndex) =>
      storedProjectIndex === projectIndex ? replacementProject : storedProject,
    ),
  };
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
    return requireStoredProject(projectDocument, projectId);
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

    storage.setItem(referenceProjectStorageKey, serializedProjectDocument);
    return transactionResult.selectResult(validatedProjectDocument);
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
  ): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
      const mutationResponse = invokeMutationHandler(
        request,
        currentProjectDocument,
        "empty",
      );
      const projectDocument = replaceProjectUpdatedTimestamp(
        mutationResponse.projectDocument,
        projectId,
        assertMutationTimestamp(now()),
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

  function renameProject(
    projectId: string,
    requestedName: string,
  ): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
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
          updated_at: assertMutationTimestamp(now()),
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

  function duplicateProject(projectId: string): ReferenceStoredProject {
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
        projectDocument: {
          version: 1,
          projects: [...currentProjectDocument.projects, duplicatedProject],
        },
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, duplicateProjectId),
      };
    });
  }

  function createMap(input: ReferenceMapCreationInput): ReferenceStoredProject {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
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
      const currentProject = requireStoredProject(
        currentProjectDocument,
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
      const projectDocument = replaceStoredProject(
        mutationResponse.projectDocument,
        input.projectId,
        {
          ...remappedProject,
          updated_at: assertMutationTimestamp(now()),
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
    return executeSingleProjectMutation(
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
      input.projectId,
    );
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
          updated_at: assertMutationTimestamp(now()),
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

  function applyMapTransferTimestamps(
    projectDocument: ReferenceLocalProjectDocument,
    sourceProjectId: string,
    targetProjectId: string,
    transferTimestamp: string,
  ): ReferenceLocalProjectDocument {
    const sourceTimestampedProjectDocument = replaceProjectUpdatedTimestamp(
      projectDocument,
      sourceProjectId,
      transferTimestamp,
    );
    if (targetProjectId === sourceProjectId) {
      return sourceTimestampedProjectDocument;
    }

    return replaceProjectUpdatedTimestamp(
      sourceTimestampedProjectDocument,
      targetProjectId,
      transferTimestamp,
    );
  }

  function selectMapTransferResult(
    validatedProjectDocument: ReferenceLocalProjectDocument,
    sourceProjectId: string,
    targetProjectId: string,
  ): ReferenceMapMoveResult {
    return {
      sourceProject: requireStoredProject(
        validatedProjectDocument,
        sourceProjectId,
      ),
      targetProject: requireStoredProject(
        validatedProjectDocument,
        targetProjectId,
      ),
    };
  }

  function executeMapTransfer(
    input: ReferenceMapTransferInput,
    transferAction: "copy" | "move",
  ): ReferenceMapMoveResult {
    return executeReferenceProjectTransaction((currentProjectDocument) => {
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
      const transferTimestamp = assertMutationTimestamp(now());
      const resolvedTarget = resolveAndValidateMapTransferTarget(
        input,
        currentProjectDocument,
        mutationResponse,
      );
      const normalizedTarget = normalizeMapTransferTargetIdentity(
        input,
        transferAction,
        currentProjectDocument,
        mutationResponse,
        resolvedTarget,
        transferTimestamp,
      );
      const projectDocument = applyMapTransferTimestamps(
        normalizedTarget.projectDocument,
        input.projectId,
        normalizedTarget.targetProjectId,
        transferTimestamp,
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

  function importProject(serializedProject: string): ReferenceStoredProject {
    const importedProjectDocument = validateReferenceProjectDocument(
      parseReferenceProjectDocument(serializedProject),
    );

    if (importedProjectDocument.projects.length !== 1) {
      throw new Error(
        `Reference project import requires exactly one project. Received project count: ${String(importedProjectDocument.projects.length)}.`,
      );
    }

    const importedProject = importedProjectDocument.projects[0];
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
        projectDocument: {
          version: 1,
          projects: [...currentProjectDocument.projects, appendedProject],
        },
        selectResult: (validatedProjectDocument) =>
          requireStoredProject(validatedProjectDocument, appendedProject.id),
      };
    });
  }

  return {
    listProjects: () =>
      readReferenceProjectDocument().projects.map((storedProject) => ({
        id: storedProject.id,
        title: storedProject.title,
        created_at: storedProject.created_at,
        updated_at: storedProject.updated_at,
      })),
    openProject: openStoredProject,
    createProject,
    duplicateProject,
    renameProject,
    deleteProject,
    importProject,
    exportProject: (projectId: string) =>
      serializeReferenceProjectDocument({
        version: 1,
        projects: [openStoredProject(projectId)],
      }),
    updateMap,
    createMap,
    renameMap,
    duplicateMap,
    deleteMap,
    copyMap,
    moveMap,
    saveThumbnail,
  };
}
