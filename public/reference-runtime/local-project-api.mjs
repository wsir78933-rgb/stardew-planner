const referenceLocalProjectStorageKey = "stardewplan-reference-local-projects-v1";
const referenceLocalProjectDocumentVersion = 1;
const referenceProjectVersion = 4;
const referenceGameVersion = "1.6.15";
const referenceSeasons = new Set(["spring", "summer", "fall", "winter"]);
const referenceIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/;
const maximumReferenceProjectTitleLength = 100;
const maximumReferenceMapLabelLength = 100;
const referenceLocalProjectApiInstalledSymbol = Symbol.for(
  "stardewplan.reference-local-project-api.installed",
);

export function createEmptyReferenceProjectDocument() {
  return { version: referenceLocalProjectDocumentVersion, projects: [] };
}

export function parseReferenceProjectDocument(serializedProjectDocument) {
  if (serializedProjectDocument === null) {
    return createEmptyReferenceProjectDocument();
  }

  if (typeof serializedProjectDocument !== "string") {
    throw new Error(
      `Reference local project storage must be a string or null. Received: ${describeReceivedValue(serializedProjectDocument)}.`,
    );
  }

  let parsedProjectDocument;

  try {
    parsedProjectDocument = JSON.parse(serializedProjectDocument);
  } catch (parseError) {
    const parseMessage = parseError instanceof Error ? parseError.message : String(parseError);
    throw new Error(
      `Reference local project storage contains malformed JSON ${describeReceivedValue(serializedProjectDocument)}. Parser error: ${parseMessage}.`,
    );
  }

  return validateReferenceProjectDocument(parsedProjectDocument);
}

export function serializeReferenceProjectDocument(rawProjectDocument) {
  return JSON.stringify(validateReferenceProjectDocument(rawProjectDocument));
}

export function validateReferenceProjectDocument(rawProjectDocument) {
  assertPlainObject(
    rawProjectDocument,
    "Reference local project document",
  );
  const projectDocumentRecord = rawProjectDocument;

  if (
    projectDocumentRecord.version !== referenceLocalProjectDocumentVersion
  ) {
    throw new Error(
      `Reference local project document version must be ${String(referenceLocalProjectDocumentVersion)}. Received: ${describeReceivedValue(projectDocumentRecord.version)}.`,
    );
  }

  if (!Array.isArray(projectDocumentRecord.projects)) {
    throw new Error(
      `Reference local project document projects must be an array. Received: ${describeReceivedValue(projectDocumentRecord.projects)}.`,
    );
  }

  const projectIds = new Set();
  const validatedProjects = projectDocumentRecord.projects.map(
    (rawStoredProject, projectIndex) => {
      const validatedStoredProject = validateStoredReferenceProject(
        rawStoredProject,
        projectIndex,
      );

      if (projectIds.has(validatedStoredProject.id)) {
        throw new Error(
          `Reference local project document contains duplicate project ID ${describeReceivedValue(validatedStoredProject.id)} at index ${String(projectIndex)}.`,
        );
      }

      projectIds.add(validatedStoredProject.id);
      return validatedStoredProject;
    },
  );

  return {
    version: referenceLocalProjectDocumentVersion,
    projects: validatedProjects,
  };
}

export function handleReferenceProjectRequest(request, storedProjectDocument) {
  const parsedRequest = validateReferenceApiRequest(request);

  if (isExcludedReferenceApiPath(parsedRequest.pathname)) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(parsedRequest.pathname),
      createEmptyReferenceProjectDocument(),
    );
  }

  const validatedProjectDocument = validateReferenceProjectDocument(
    storedProjectDocument,
  );
  const pathSegments = parseReferencePathSegments(parsedRequest.pathname);

  if (
    parsedRequest.method === "GET" &&
    parsedRequest.pathname === "/api/auth/get-session"
  ) {
    return createJsonReferenceResponse(200, {
      user: {
        id: "reference-local-user",
        name: "Local Planner",
        email: "local@stardewplan.invalid",
        image: null,
      },
      expires: null,
    }, validatedProjectDocument);
  }

  if (
    parsedRequest.method === "GET" &&
    parsedRequest.pathname === "/api/account/premium"
  ) {
    return createJsonReferenceResponse(
      200,
      { isPremium: true, premiumUntil: null },
      validatedProjectDocument,
    );
  }

  if (pathSegments[0] !== "api" || pathSegments[1] !== "projects") {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(parsedRequest.pathname),
      validatedProjectDocument,
    );
  }

  if (pathSegments.length === 2) {
    return handleProjectCollectionRequest(parsedRequest, validatedProjectDocument);
  }

  const projectId = assertReferenceIdentifier(
    pathSegments[2],
    "Project ID",
  );

  if (pathSegments.length === 3) {
    return handleProjectRequest(
      parsedRequest,
      validatedProjectDocument,
      projectId,
    );
  }

  if (pathSegments[3] !== "maps") {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(parsedRequest.pathname),
      validatedProjectDocument,
    );
  }

  if (pathSegments.length === 4) {
    return handleMapCollectionRequest(
      parsedRequest,
      validatedProjectDocument,
      projectId,
    );
  }

  const mapId = assertReferenceIdentifier(pathSegments[4], "Map ID");
  const mapAction = pathSegments[5];

  if (pathSegments.length === 5) {
    return handleMapRequest(
      parsedRequest,
      validatedProjectDocument,
      projectId,
      mapId,
    );
  }

  if (pathSegments.length !== 6 || mapAction === undefined) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(parsedRequest.pathname),
      validatedProjectDocument,
    );
  }

  if (mapAction === "thumbnail") {
    return handleThumbnailRequest(
      parsedRequest,
      validatedProjectDocument,
      projectId,
      mapId,
    );
  }

  if (mapAction === "duplicate" && parsedRequest.method === "POST") {
    return duplicateReferenceMap(validatedProjectDocument, projectId, mapId);
  }

  if (mapAction === "copy" && parsedRequest.method === "POST") {
    return copyReferenceMap(validatedProjectDocument, projectId, mapId, false, parsedRequest.jsonBody);
  }

  if (mapAction === "move" && parsedRequest.method === "POST") {
    return copyReferenceMap(validatedProjectDocument, projectId, mapId, true, parsedRequest.jsonBody);
  }

  return createJsonReferenceResponse(
    404,
    createLocalNotFoundBody(parsedRequest.pathname),
    validatedProjectDocument,
  );
}

export function installReferenceLocalProjectApi() {
  if (typeof window === "undefined") {
    throw new Error("Reference local project API can only install in a browser window.");
  }

  if (window[referenceLocalProjectApiInstalledSymbol] === true) {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  Object.defineProperty(window, referenceLocalProjectApiInstalledSymbol, {
    value: true,
    configurable: false,
    enumerable: false,
    writable: false,
  });

  window.fetch = async function referenceLocalProjectFetch(input, init) {
    const request = new Request(input, init);
    const requestUrl = new URL(request.url, window.location.origin);

    if (!requestUrl.pathname.startsWith("/api/")) {
      return originalFetch(input, init);
    }

    if (isExcludedReferenceApiPath(requestUrl.pathname)) {
      return createBrowserResponse(
        createJsonReferenceResponse(
          404,
          createLocalNotFoundBody(requestUrl.pathname),
          createEmptyReferenceProjectDocument(),
        ),
      );
    }

    const localProjectDocument = readReferenceProjectDocumentFromStorage(
      window.localStorage,
    );
    const referenceApiRequest = await createReferenceApiRequestFromBrowserRequest(
      request,
      requestUrl.pathname,
    );
    const referenceApiResponse = handleReferenceProjectRequest(
      referenceApiRequest,
      localProjectDocument,
    );

    if (referenceApiResponse.didMutateProjectDocument) {
      writeReferenceProjectDocumentToStorage(
        window.localStorage,
        referenceApiResponse.projectDocument,
      );
    }

    return createBrowserResponse(referenceApiResponse);
  };
}

function handleProjectCollectionRequest(request, projectDocument) {
  if (request.method === "GET") {
    return createJsonReferenceResponse(
      200,
      {
        projects: projectDocument.projects.map((storedProject) =>
          createReferenceProjectSummary(storedProject),
        ),
      },
      projectDocument,
    );
  }

  if (request.method === "POST") {
    const creationInput = assertRequestBodyObject(
      request.jsonBody,
      "Project creation request body",
    );
    const projectTitle = normalizeReferenceProjectTitle(creationInput.projectName);
    const projectSeason = assertReferenceSeason(
      creationInput.season,
      "Project season",
    );
    const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
    const projectId = createReferenceIdentifier();
    const createdAt = new Date().toISOString();
    const createdProject = createStoredReferenceProject({
      id: projectId,
      title: projectTitle,
      createdAt,
      season: projectSeason,
    });

    nextProjectDocument.projects.push(createdProject);
    return createJsonReferenceResponse(
      200,
      { projectId },
      nextProjectDocument,
      true,
    );
  }

  return createJsonReferenceResponse(
    404,
    createLocalNotFoundBody(request.pathname),
    projectDocument,
  );
}

function handleProjectRequest(request, projectDocument, projectId) {
  const storedProjectIndex = findStoredReferenceProjectIndex(
    projectDocument,
    projectId,
  );

  if (storedProjectIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(request.pathname),
      projectDocument,
    );
  }

  const storedProject = projectDocument.projects[storedProjectIndex];

  if (request.method === "GET") {
    return createJsonReferenceResponse(200, storedProject.project, projectDocument);
  }

  if (request.method === "PUT") {
    const renameInput = assertRequestBodyObject(
      request.jsonBody,
      "Project rename request body",
    );
    const projectTitle = normalizeReferenceProjectTitle(renameInput.projectName);
    const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
    const renamedProject = nextProjectDocument.projects[storedProjectIndex];

    renamedProject.title = projectTitle;
    renamedProject.updated_at = new Date().toISOString();
    renamedProject.project.projectName = projectTitle;

    return createJsonReferenceResponse(200, {}, nextProjectDocument, true);
  }

  if (request.method === "DELETE") {
    const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
    nextProjectDocument.projects.splice(storedProjectIndex, 1);
    return createJsonReferenceResponse(200, {}, nextProjectDocument, true);
  }

  return createJsonReferenceResponse(
    404,
    createLocalNotFoundBody(request.pathname),
    projectDocument,
  );
}

function handleMapCollectionRequest(request, projectDocument, projectId) {
  if (request.method !== "POST") {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(request.pathname),
      projectDocument,
    );
  }

  const mapCreationInput = assertRequestBodyObject(
    request.jsonBody,
    "Project map creation request body",
  );
  const mapFile = normalizeReferenceMapFile(mapCreationInput.mapFile);
  const mapLabel = normalizeReferenceMapLabel(mapCreationInput.label);
  const mapSeason = assertReferenceSeason(mapCreationInput.season, "Map season");
  const storedProjectIndex = findStoredReferenceProjectIndex(
    projectDocument,
    projectId,
  );

  if (storedProjectIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(request.pathname),
      projectDocument,
    );
  }

  const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
  const targetProject = nextProjectDocument.projects[storedProjectIndex];
  const mapId = createReferenceIdentifier();
  const createdMap = createReferenceProjectMap({
    projectId,
    mapId,
    mapFile,
    label: mapLabel,
    season: mapSeason,
  });

  targetProject.project.maps.push(createdMap);
  if (targetProject.project.activeMapId === null) {
    targetProject.project.activeMapId = mapId;
  }
  targetProject.updated_at = new Date().toISOString();

  return createJsonReferenceResponse(200, { mapId }, nextProjectDocument, true);
}

function handleMapRequest(request, projectDocument, projectId, mapId) {
  const storedProjectIndex = findStoredReferenceProjectIndex(
    projectDocument,
    projectId,
  );

  if (storedProjectIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(request.pathname),
      projectDocument,
    );
  }

  const storedProject = projectDocument.projects[storedProjectIndex];
  const mapIndex = findReferenceProjectMapIndex(storedProject.project, mapId);

  if (mapIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(request.pathname),
      projectDocument,
    );
  }

  if (request.method === "PUT") {
    return updateReferenceProjectMap(
      request.jsonBody,
      projectDocument,
      storedProjectIndex,
      mapIndex,
    );
  }

  if (request.method === "PATCH") {
    const renameInput = assertRequestBodyObject(
      request.jsonBody,
      "Project map rename request body",
    );
    const mapLabel = normalizeReferenceMapLabel(renameInput.label);
    const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
    const renamedProject = nextProjectDocument.projects[storedProjectIndex];
    const renamedMap = renamedProject.project.maps[mapIndex];

    renamedMap.label = mapLabel;
    renamedProject.updated_at = new Date().toISOString();
    return createJsonReferenceResponse(200, {}, nextProjectDocument, true);
  }

  if (request.method === "DELETE") {
    const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
    const targetProject = nextProjectDocument.projects[storedProjectIndex];

    targetProject.project.maps.splice(mapIndex, 1);
    delete targetProject.thumbnailsByMapId[mapId];
    if (targetProject.project.activeMapId === mapId) {
      targetProject.project.activeMapId = selectActiveReferenceMapId(
        targetProject.project,
      );
    }
    targetProject.updated_at = new Date().toISOString();
    return createJsonReferenceResponse(200, {}, nextProjectDocument, true);
  }

  return createJsonReferenceResponse(
    404,
    createLocalNotFoundBody(request.pathname),
    projectDocument,
  );
}

function updateReferenceProjectMap(
  rawMapUpdate,
  projectDocument,
  storedProjectIndex,
  mapIndex,
) {
  const mapUpdate = assertRequestBodyObject(
    rawMapUpdate,
    "Project map update request body",
  );
  const mapFile = normalizeReferenceMapFile(mapUpdate.mapFile);
  const mapLabel = normalizeReferenceMapLabel(mapUpdate.label);
  const mapSeason = assertReferenceSeason(mapUpdate.season, "Map season");
  const mapState = validateReferenceMapState(mapUpdate.state);
  const mapDecor = validateReferenceMapDecor(mapUpdate.decor);
  const mapRenovations = validateReferenceMapRenovations(mapUpdate.renovations);
  const setActive = assertSetActiveFlag(mapUpdate.setActive);
  const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
  const targetProject = nextProjectDocument.projects[storedProjectIndex];
  const targetMap = targetProject.project.maps[mapIndex];

  targetMap.mapFile = mapFile;
  targetMap.label = mapLabel;
  targetMap.season = mapSeason;
  targetMap.state = mapState;
  targetMap.decor = mapDecor;
  targetMap.renovations = mapRenovations;
  if (setActive) {
    targetProject.project.activeMapId = targetMap.id;
  }
  targetProject.updated_at = new Date().toISOString();

  return createJsonReferenceResponse(200, {}, nextProjectDocument, true);
}

function handleThumbnailRequest(request, projectDocument, projectId, mapId) {
  const storedProjectIndex = findStoredReferenceProjectIndex(
    projectDocument,
    projectId,
  );

  if (storedProjectIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(request.pathname),
      projectDocument,
    );
  }

  const storedProject = projectDocument.projects[storedProjectIndex];
  const mapIndex = findReferenceProjectMapIndex(storedProject.project, mapId);

  if (mapIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(request.pathname),
      projectDocument,
    );
  }

  if (request.method === "POST") {
    const webpBytes = assertReferenceWebpThumbnail(request);
    const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
    const targetProject = nextProjectDocument.projects[storedProjectIndex];

    targetProject.thumbnailsByMapId[mapId] = createWebpDataUrl(webpBytes);
    targetProject.updated_at = new Date().toISOString();
    return createJsonReferenceResponse(200, {}, nextProjectDocument, true);
  }

  if (request.method === "GET") {
    const thumbnailDataUrl = storedProject.thumbnailsByMapId[mapId];

    if (thumbnailDataUrl === undefined) {
      return createJsonReferenceResponse(
        404,
        createLocalNotFoundBody(request.pathname),
        projectDocument,
      );
    }

    return {
      status: 200,
      headers: { "content-type": "image/webp" },
      binaryBody: parseWebpDataUrl(thumbnailDataUrl),
      projectDocument,
      didMutateProjectDocument: false,
    };
  }

  return createJsonReferenceResponse(
    404,
    createLocalNotFoundBody(request.pathname),
    projectDocument,
  );
}

function duplicateReferenceMap(projectDocument, projectId, mapId) {
  const storedProjectIndex = findStoredReferenceProjectIndex(projectDocument, projectId);

  if (storedProjectIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(`/api/projects/${projectId}/maps/${mapId}/duplicate`),
      projectDocument,
    );
  }

  const storedProject = projectDocument.projects[storedProjectIndex];
  const mapIndex = findReferenceProjectMapIndex(storedProject.project, mapId);

  if (mapIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(`/api/projects/${projectId}/maps/${mapId}/duplicate`),
      projectDocument,
    );
  }

  const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
  const targetProject = nextProjectDocument.projects[storedProjectIndex];
  const sourceMap = targetProject.project.maps[mapIndex];
  const duplicateMapId = createReferenceIdentifier();
  const duplicateMap = cloneReferenceProjectMap(
    sourceMap,
    projectId,
    duplicateMapId,
    createDuplicateReferenceMapLabel(sourceMap.label),
  );

  targetProject.project.maps.push(duplicateMap);
  const thumbnailDataUrl = targetProject.thumbnailsByMapId[mapId];
  if (thumbnailDataUrl !== undefined) {
    targetProject.thumbnailsByMapId[duplicateMapId] = thumbnailDataUrl;
  }
  targetProject.updated_at = new Date().toISOString();
  return createJsonReferenceResponse(200, {}, nextProjectDocument, true);
}

function copyReferenceMap(
  projectDocument,
  sourceProjectId,
  sourceMapId,
  shouldMoveMap,
  rawTarget,
) {
  const sourceProjectIndex = findStoredReferenceProjectIndex(
    projectDocument,
    sourceProjectId,
  );

  if (sourceProjectIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(`/api/projects/${sourceProjectId}/maps/${sourceMapId}`),
      projectDocument,
    );
  }

  const sourceProject = projectDocument.projects[sourceProjectIndex];
  const sourceMapIndex = findReferenceProjectMapIndex(
    sourceProject.project,
    sourceMapId,
  );

  if (sourceMapIndex === -1) {
    return createJsonReferenceResponse(
      404,
      createLocalNotFoundBody(`/api/projects/${sourceProjectId}/maps/${sourceMapId}`),
      projectDocument,
    );
  }

  const mapTransferTarget = resolveReferenceMapTransferTarget(
    rawTarget,
    projectDocument,
  );

  if (
    shouldMoveMap &&
    mapTransferTarget.targetProjectId === sourceProjectId
  ) {
    throw new Error(
      `Project map move targetProjectId must not equal the source project ID. Received: ${describeReceivedValue(mapTransferTarget.targetProjectId)}.`,
    );
  }

  const nextProjectDocument = cloneReferenceProjectDocument(projectDocument);
  const resolvedTargetProjectIndex = mapTransferTarget.targetProjectId === undefined
    ? appendReferenceProject(nextProjectDocument, mapTransferTarget.newProjectName)
    : findStoredReferenceProjectIndex(
      nextProjectDocument,
      mapTransferTarget.targetProjectId,
    );

  if (resolvedTargetProjectIndex === -1) {
    throw new Error(
      `Target project ID does not exist. Received: ${describeReceivedValue(mapTransferTarget.targetProjectId)}.`,
    );
  }

  const copiedSourceProject = nextProjectDocument.projects[sourceProjectIndex];
  const copiedSourceMapIndex = findReferenceProjectMapIndex(
    copiedSourceProject.project,
    sourceMapId,
  );
  const copiedSourceMap = copiedSourceProject.project.maps[copiedSourceMapIndex];
  const targetProject = nextProjectDocument.projects[resolvedTargetProjectIndex];
  const targetMapId = shouldMoveMap ? sourceMapId : createReferenceIdentifier();
  const transferredMap = cloneReferenceProjectMap(
    copiedSourceMap,
    targetProject.id,
    targetMapId,
    copiedSourceMap.label,
  );

  targetProject.project.maps.push(transferredMap);
  if (targetProject.project.activeMapId === null) {
    targetProject.project.activeMapId = targetMapId;
  }

  const copiedThumbnail = copiedSourceProject.thumbnailsByMapId[sourceMapId];
  if (copiedThumbnail !== undefined) {
    targetProject.thumbnailsByMapId[targetMapId] = copiedThumbnail;
  }

  if (shouldMoveMap && sourceProjectIndex !== resolvedTargetProjectIndex) {
    copiedSourceProject.project.maps.splice(copiedSourceMapIndex, 1);
    delete copiedSourceProject.thumbnailsByMapId[sourceMapId];
    if (copiedSourceProject.project.activeMapId === sourceMapId) {
      copiedSourceProject.project.activeMapId = selectActiveReferenceMapId(
        copiedSourceProject.project,
      );
    }
  }

  copiedSourceProject.updated_at = new Date().toISOString();
  targetProject.updated_at = copiedSourceProject.updated_at;

  return createJsonReferenceResponse(
    200,
    { projectTitle: targetProject.title },
    nextProjectDocument,
    true,
  );
}

function resolveReferenceMapTransferTarget(rawTarget, projectDocument) {
  const transferInput = assertRequestBodyObject(
    rawTarget,
    "Project map transfer request body",
  );
  const hasTargetProjectId = Object.hasOwn(transferInput, "targetProjectId");
  const hasNewProjectName = Object.hasOwn(transferInput, "newProjectName");

  if (hasTargetProjectId === hasNewProjectName) {
    throw new Error(
      `Project map transfer must include exactly one targetProjectId or newProjectName. Received: ${describeReceivedValue(transferInput)}.`,
    );
  }

  if (hasTargetProjectId) {
    const targetProjectId = assertReferenceIdentifier(
      transferInput.targetProjectId,
      "Target project ID",
    );

    if (findStoredReferenceProjectIndex(projectDocument, targetProjectId) === -1) {
      throw new Error(
        `Target project ID does not exist. Received: ${describeReceivedValue(targetProjectId)}.`,
      );
    }

    return { targetProjectId };
  }

  return {
    newProjectName: normalizeReferenceProjectTitle(transferInput.newProjectName),
  };
}

function appendReferenceProject(projectDocument, projectTitle) {
  const projectId = createReferenceIdentifier();
  const createdAt = new Date().toISOString();
  const createdProject = createStoredReferenceProject({
    id: projectId,
    title: projectTitle,
    createdAt,
    season: "spring",
  });

  projectDocument.projects.push(createdProject);
  return projectDocument.projects.length - 1;
}

function createStoredReferenceProject({ id, title, createdAt, season }) {
  return {
    id,
    title,
    created_at: createdAt,
    updated_at: createdAt,
    project: {
      version: referenceProjectVersion,
      gameVersion: referenceGameVersion,
      projectName: title,
      season,
      activeMapId: null,
      maps: [],
    },
    thumbnailsByMapId: {},
  };
}

function createReferenceProjectMap({ projectId, mapId, mapFile, label, season }) {
  return {
    id: mapId,
    mapFile,
    label,
    season,
    state: createEmptyReferenceMapState(),
    decor: createEmptyReferenceMapDecor(),
    renovations: [],
    thumbnail: createReferenceThumbnailPath(projectId, mapId),
  };
}

function createDuplicateReferenceMapLabel(sourceMapLabel) {
  const duplicateSuffix = " Copy";
  const maximumSourceLabelLength =
    maximumReferenceMapLabelLength - duplicateSuffix.length;

  return `${sourceMapLabel.slice(0, maximumSourceLabelLength)}${duplicateSuffix}`;
}

function createEmptyReferenceMapState() {
  return {
    buildings: [],
    crops: [],
    items: [],
    nextBuildingId: 1,
    nextItemId: 1,
  };
}

function createEmptyReferenceMapDecor() {
  return { wallpapers: {}, floors: {} };
}

function cloneReferenceProjectDocument(projectDocument) {
  return validateReferenceProjectDocument(projectDocument);
}

function cloneReferenceProjectMap(sourceMap, projectId, mapId, label) {
  return {
    id: mapId,
    mapFile: sourceMap.mapFile,
    label,
    season: sourceMap.season,
    state: cloneJsonValue(sourceMap.state, "Project map state"),
    decor: cloneJsonValue(sourceMap.decor, "Project map decor"),
    renovations: cloneJsonValue(sourceMap.renovations, "Project map renovations"),
    thumbnail: createReferenceThumbnailPath(projectId, mapId),
  };
}

function validateStoredReferenceProject(rawStoredProject, projectIndex) {
  assertPlainObject(rawStoredProject, `Reference stored project at index ${String(projectIndex)}`);
  const storedProjectRecord = rawStoredProject;
  const projectId = assertReferenceIdentifier(storedProjectRecord.id, "Project ID");
  const projectTitle = normalizeReferenceProjectTitle(storedProjectRecord.title);
  const createdAt = assertReferenceTimestamp(
    storedProjectRecord.created_at,
    "Project created_at",
  );
  const updatedAt = assertReferenceTimestamp(
    storedProjectRecord.updated_at,
    "Project updated_at",
  );
  const referenceProject = validateReferenceProject(
    storedProjectRecord.project,
    projectId,
    projectTitle,
  );
  const thumbnailsByMapId = validateReferenceThumbnailRecord(
    storedProjectRecord.thumbnailsByMapId,
    referenceProject,
  );

  if (Date.parse(createdAt) > Date.parse(updatedAt)) {
    throw new Error(
      `Project created_at ${describeReceivedValue(createdAt)} must not be later than updated_at ${describeReceivedValue(updatedAt)}.`,
    );
  }

  return {
    id: projectId,
    title: projectTitle,
    created_at: createdAt,
    updated_at: updatedAt,
    project: referenceProject,
    thumbnailsByMapId,
  };
}

function validateReferenceProject(rawProject, projectId, projectTitle) {
  assertPlainObject(rawProject, "Reference project document");
  const projectRecord = rawProject;

  if (projectRecord.version !== referenceProjectVersion) {
    throw new Error(
      `Reference project version must be ${String(referenceProjectVersion)}. Received: ${describeReceivedValue(projectRecord.version)}.`,
    );
  }

  if (projectRecord.gameVersion !== referenceGameVersion) {
    throw new Error(
      `Reference project gameVersion must be ${describeReceivedValue(referenceGameVersion)}. Received: ${describeReceivedValue(projectRecord.gameVersion)}.`,
    );
  }

  const storedProjectName = normalizeReferenceProjectTitle(projectRecord.projectName);
  if (storedProjectName !== projectTitle) {
    throw new Error(
      `Reference project projectName must match stored title. Received projectName: ${describeReceivedValue(storedProjectName)}; title: ${describeReceivedValue(projectTitle)}.`,
    );
  }

  const projectSeason = assertReferenceSeason(projectRecord.season, "Project season");

  if (!Array.isArray(projectRecord.maps)) {
    throw new Error(
      `Reference project maps must be an array. Received: ${describeReceivedValue(projectRecord.maps)}.`,
    );
  }

  const mapIds = new Set();
  const validatedMaps = projectRecord.maps.map((rawMap, mapIndex) => {
    const validatedMap = validateReferenceProjectMap(rawMap, projectId, mapIndex);

    if (mapIds.has(validatedMap.id)) {
      throw new Error(
        `Reference project contains duplicate map ID ${describeReceivedValue(validatedMap.id)} at index ${String(mapIndex)}.`,
      );
    }

    mapIds.add(validatedMap.id);
    return validatedMap;
  });
  const activeMapId = projectRecord.activeMapId;

  if (activeMapId !== null) {
    const validatedActiveMapId = assertReferenceIdentifier(activeMapId, "Project activeMapId");
    if (!mapIds.has(validatedActiveMapId)) {
      throw new Error(
        `Project activeMapId does not exist in maps. Received: ${describeReceivedValue(validatedActiveMapId)}.`,
      );
    }
  }

  if (activeMapId === null && validatedMaps.length > 0) {
    throw new Error("Project activeMapId must identify a map when maps are present. Received: null.");
  }

  return {
    version: referenceProjectVersion,
    gameVersion: referenceGameVersion,
    projectName: storedProjectName,
    season: projectSeason,
    activeMapId,
    maps: validatedMaps,
  };
}

function validateReferenceProjectMap(rawMap, projectId, mapIndex) {
  assertPlainObject(rawMap, `Reference project map at index ${String(mapIndex)}`);
  const mapRecord = rawMap;
  const mapId = assertReferenceIdentifier(mapRecord.id, "Map ID");
  const mapFile = normalizeReferenceMapFile(mapRecord.mapFile);
  const label = normalizeReferenceMapLabel(mapRecord.label);
  const season = assertReferenceSeason(mapRecord.season, "Map season");
  const state = validateReferenceMapState(mapRecord.state);
  const decor = validateReferenceMapDecor(mapRecord.decor);
  const renovations = validateReferenceMapRenovations(mapRecord.renovations);
  const expectedThumbnailPath = createReferenceThumbnailPath(projectId, mapId);

  if (mapRecord.thumbnail !== expectedThumbnailPath) {
    throw new Error(
      `Project map thumbnail must be ${describeReceivedValue(expectedThumbnailPath)}. Received: ${describeReceivedValue(mapRecord.thumbnail)}.`,
    );
  }

  return {
    id: mapId,
    mapFile,
    label,
    season,
    state,
    decor,
    renovations,
    thumbnail: expectedThumbnailPath,
  };
}

function validateReferenceMapState(rawState) {
  if (!isPlainObject(rawState)) {
    throw new Error(
      `Project map state must be a non-null object. Received: ${describeReceivedValue(rawState)}.`,
    );
  }

  const buildings = validateReferenceMapStateEntries(
    rawState.buildings,
    "buildings",
    validateReferenceBuildingStateEntry,
  );
  const crops = validateReferenceMapStateEntries(
    rawState.crops,
    "crops",
    validateReferenceCropStateEntry,
  );
  const items = validateReferenceMapStateEntries(
    rawState.items,
    "items",
    validateReferenceItemStateEntry,
  );
  const nextBuildingId = assertPositiveReferenceMapStateInteger(
    rawState.nextBuildingId,
    "nextBuildingId",
  );
  const nextItemId = assertPositiveReferenceMapStateInteger(
    rawState.nextItemId,
    "nextItemId",
  );

  assertUniqueReferenceMapStateInstanceIds(buildings, "buildings");
  assertUniqueReferenceMapStateInstanceIds(items, "items");
  assertUniqueReferenceCropCoordinates(crops);
  assertReferenceNextIdentifierIsUnused(
    buildings,
    "b",
    nextBuildingId,
    "nextBuildingId",
  );
  assertReferenceNextIdentifierIsUnused(
    items,
    "i",
    nextItemId,
    "nextItemId",
  );

  return cloneJsonValue(rawState, "Project map state");
}

function validateReferenceMapStateEntries(
  rawEntries,
  fieldName,
  validateEntry,
) {
  if (!Array.isArray(rawEntries)) {
    throw new Error(
      `Project map state ${fieldName} must be an array. Received: ${describeReceivedValue(rawEntries)}.`,
    );
  }

  rawEntries.forEach((rawEntry, entryIndex) => {
    validateEntry(rawEntry, `${fieldName}[${String(entryIndex)}]`);
  });

  return rawEntries;
}

function assertUniqueReferenceMapStateInstanceIds(entries, fieldName) {
  const encounteredInstanceIds = new Set();

  entries.forEach((entry, entryIndex) => {
    if (encounteredInstanceIds.has(entry.instanceId)) {
      throw new Error(
        `Project map state ${fieldName} contains duplicate instanceId ${describeReceivedValue(entry.instanceId)} at index ${String(entryIndex)}.`,
      );
    }

    encounteredInstanceIds.add(entry.instanceId);
  });
}

function assertUniqueReferenceCropCoordinates(crops) {
  const encounteredCoordinates = new Set();

  crops.forEach((crop, cropIndex) => {
    const coordinate = `${String(crop.x)},${String(crop.y)}`;

    if (encounteredCoordinates.has(coordinate)) {
      throw new Error(
        `Project map state crops contains duplicate tile coordinate ${describeReceivedValue(coordinate)} at index ${String(cropIndex)}.`,
      );
    }

    encounteredCoordinates.add(coordinate);
  });
}

function assertReferenceNextIdentifierIsUnused(
  entries,
  identifierPrefix,
  nextIdentifier,
  nextIdentifierFieldName,
) {
  const largestGeneratedIdentifier = findLargestGeneratedReferenceIdentifier(
    entries,
    identifierPrefix,
  );

  if (
    largestGeneratedIdentifier !== null &&
    nextIdentifier <= largestGeneratedIdentifier
  ) {
    throw new Error(
      `Project map state ${nextIdentifierFieldName} must exceed existing generated identifier ${String(largestGeneratedIdentifier)}. Received: ${String(nextIdentifier)}.`,
    );
  }
}

function findLargestGeneratedReferenceIdentifier(entries, identifierPrefix) {
  const generatedIdentifierPattern = new RegExp(
    `^${identifierPrefix}([1-9][0-9]*)$`,
  );
  let largestGeneratedIdentifier = null;

  for (const entry of entries) {
    const generatedIdentifierMatch = generatedIdentifierPattern.exec(
      entry.instanceId,
    );

    if (generatedIdentifierMatch === null) {
      continue;
    }

    const generatedIdentifier = Number(generatedIdentifierMatch[1]);
    if (!Number.isSafeInteger(generatedIdentifier)) {
      continue;
    }

    if (
      largestGeneratedIdentifier === null ||
      generatedIdentifier > largestGeneratedIdentifier
    ) {
      largestGeneratedIdentifier = generatedIdentifier;
    }
  }

  return largestGeneratedIdentifier;
}

function validateReferenceBuildingStateEntry(rawBuilding, fieldPath) {
  assertPlainObject(rawBuilding, `Project map state ${fieldPath}`);
  assertNonEmptyReferenceMapStateString(
    rawBuilding.instanceId,
    `${fieldPath}.instanceId`,
  );
  assertNonEmptyReferenceMapStateString(
    rawBuilding.buildingId,
    `${fieldPath}.buildingId`,
  );
  assertReferenceMapStateInteger(rawBuilding.x, `${fieldPath}.x`);
  assertReferenceMapStateInteger(rawBuilding.y, `${fieldPath}.y`);
}

function validateReferenceCropStateEntry(rawCrop, fieldPath) {
  assertPlainObject(rawCrop, `Project map state ${fieldPath}`);
  assertNonEmptyReferenceMapStateString(rawCrop.cropId, `${fieldPath}.cropId`);
  assertReferenceMapStateInteger(rawCrop.x, `${fieldPath}.x`);
  assertReferenceMapStateInteger(rawCrop.y, `${fieldPath}.y`);
}

function validateReferenceItemStateEntry(rawItem, fieldPath) {
  assertPlainObject(rawItem, `Project map state ${fieldPath}`);
  assertNonEmptyReferenceMapStateString(
    rawItem.instanceId,
    `${fieldPath}.instanceId`,
  );
  assertNonEmptyReferenceMapStateString(rawItem.itemId, `${fieldPath}.itemId`);
  assertReferenceMapStateInteger(rawItem.x, `${fieldPath}.x`);
  assertReferenceMapStateInteger(rawItem.y, `${fieldPath}.y`);
  assertNonEmptyReferenceMapStateString(rawItem.layer, `${fieldPath}.layer`);
  assertReferenceMapStateInteger(rawItem.rotation, `${fieldPath}.rotation`);
  assertReferenceItemFootprint(rawItem.footprint, `${fieldPath}.footprint`);
  assertReferenceMapStateInteger(rawItem.variant, `${fieldPath}.variant`);
}

function assertReferenceItemFootprint(rawFootprint, fieldPath) {
  if (!isPlainObject(rawFootprint)) {
    throw new Error(
      `Project map state ${fieldPath} must be a non-null object. Received: ${describeReceivedValue(rawFootprint)}.`,
    );
  }

  assertPositiveReferenceMapStateInteger(rawFootprint.w, `${fieldPath}.w`);
  assertPositiveReferenceMapStateInteger(rawFootprint.h, `${fieldPath}.h`);
}

function assertNonEmptyReferenceMapStateString(rawValue, fieldPath) {
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    throw new Error(
      `Project map state ${fieldPath} must be a non-empty string. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }
}

function assertReferenceMapStateInteger(rawValue, fieldPath) {
  if (!Number.isSafeInteger(rawValue)) {
    throw new Error(
      `Project map state ${fieldPath} must be an integer. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }
}

function assertPositiveReferenceMapStateInteger(rawValue, fieldPath) {
  if (!Number.isSafeInteger(rawValue) || rawValue < 1) {
    throw new Error(
      `Project map state ${fieldPath} must be a positive integer. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function validateReferenceMapDecor(rawDecor) {
  if (rawDecor === undefined) {
    return createEmptyReferenceMapDecor();
  }

  if (!isPlainObject(rawDecor)) {
    throw new Error(
      `Project map decor must be a non-null object. Received: ${describeReceivedValue(rawDecor)}.`,
    );
  }

  const wallpapers = rawDecor.wallpapers;
  const floors = rawDecor.floors;

  if (!isPlainObject(wallpapers)) {
    throw new Error(
      `Project map decor wallpapers must be a non-null object. Received: ${describeReceivedValue(wallpapers)}.`,
    );
  }

  if (!isPlainObject(floors)) {
    throw new Error(
      `Project map decor floors must be a non-null object. Received: ${describeReceivedValue(floors)}.`,
    );
  }

  return {
    wallpapers: cloneJsonValue(wallpapers, "Project map decor wallpapers"),
    floors: cloneJsonValue(floors, "Project map decor floors"),
  };
}

function validateReferenceMapRenovations(rawRenovations) {
  if (rawRenovations === undefined) {
    return [];
  }

  if (!Array.isArray(rawRenovations)) {
    throw new Error(
      `Project map renovations must be an array. Received: ${describeReceivedValue(rawRenovations)}.`,
    );
  }

  return cloneJsonValue(rawRenovations, "Project map renovations");
}

function validateReferenceThumbnailRecord(rawThumbnailsByMapId, project) {
  if (rawThumbnailsByMapId === undefined) {
    return {};
  }

  assertPlainObject(rawThumbnailsByMapId, "Project thumbnailsByMapId");
  const thumbnailsByMapId = {};
  const mapIds = new Set(project.maps.map((projectMap) => projectMap.id));

  for (const [mapId, thumbnailDataUrl] of Object.entries(rawThumbnailsByMapId)) {
    assertReferenceIdentifier(mapId, "Thumbnail map ID");
    if (!mapIds.has(mapId)) {
      throw new Error(
        `Project thumbnail references a map that does not exist. Received: ${describeReceivedValue(mapId)}.`,
      );
    }
    thumbnailsByMapId[mapId] = validateWebpDataUrl(thumbnailDataUrl);
  }

  return thumbnailsByMapId;
}

function validateReferenceApiRequest(rawRequest) {
  assertPlainObject(rawRequest, "Reference API request");
  const requestRecord = rawRequest;

  if (typeof requestRecord.method !== "string") {
    throw new Error(
      `Reference API request method must be a string. Received: ${describeReceivedValue(requestRecord.method)}.`,
    );
  }

  if (typeof requestRecord.pathname !== "string" || !requestRecord.pathname.startsWith("/")) {
    throw new Error(
      `Reference API request pathname must be an absolute path string. Received: ${describeReceivedValue(requestRecord.pathname)}.`,
    );
  }

  return {
    method: requestRecord.method.toUpperCase(),
    pathname: requestRecord.pathname,
    jsonBody: requestRecord.jsonBody,
    contentType: requestRecord.contentType,
    binaryBody: requestRecord.binaryBody,
  };
}

function parseReferencePathSegments(pathname) {
  return pathname
    .split("/")
    .slice(1)
    .map((rawPathSegment) => decodeReferencePathSegment(rawPathSegment, pathname));
}

function decodeReferencePathSegment(rawPathSegment, pathname) {
  try {
    const decodedPathSegment = decodeURIComponent(rawPathSegment);

    if (decodedPathSegment.includes("/")) {
      throw new Error(
        `Reference API pathname must not contain an encoded slash. Received: ${describeReceivedValue(pathname)}.`,
      );
    }

    return decodedPathSegment;
  } catch (decodeError) {
    if (decodeError instanceof URIError) {
      throw new Error(
        `Reference API pathname contains an invalid encoded segment ${describeReceivedValue(rawPathSegment)}. Received pathname: ${describeReceivedValue(pathname)}.`,
      );
    }

    throw decodeError;
  }
}

function assertRequestBodyObject(rawRequestBody, description) {
  if (!isPlainObject(rawRequestBody)) {
    throw new Error(
      `${description} must be a non-null object. Received: ${describeReceivedValue(rawRequestBody)}.`,
    );
  }

  return rawRequestBody;
}

function assertReferenceIdentifier(rawIdentifier, description) {
  if (typeof rawIdentifier !== "string" || !referenceIdentifierPattern.test(rawIdentifier)) {
    throw new Error(
      `${description} must contain only letters, digits, underscores, and hyphens and be at most 120 characters. Received: ${describeReceivedValue(rawIdentifier)}.`,
    );
  }

  return rawIdentifier;
}

function normalizeReferenceProjectTitle(rawProjectTitle) {
  if (typeof rawProjectTitle !== "string") {
    throw new Error(
      `Project title must be a string. Received: ${describeReceivedValue(rawProjectTitle)}.`,
    );
  }

  const projectTitle = rawProjectTitle.trim();
  if (projectTitle.length === 0 || projectTitle.length > maximumReferenceProjectTitleLength) {
    throw new Error(
      `Project title must contain 1 to ${String(maximumReferenceProjectTitleLength)} characters after trimming. Received: ${describeReceivedValue(rawProjectTitle)}.`,
    );
  }

  return projectTitle;
}

function normalizeReferenceMapLabel(rawMapLabel) {
  if (typeof rawMapLabel !== "string") {
    throw new Error(
      `Project map label must be a string. Received: ${describeReceivedValue(rawMapLabel)}.`,
    );
  }

  const mapLabel = rawMapLabel.trim();
  if (mapLabel.length === 0 || mapLabel.length > maximumReferenceMapLabelLength) {
    throw new Error(
      `Project map label must contain 1 to ${String(maximumReferenceMapLabelLength)} characters after trimming. Received: ${describeReceivedValue(rawMapLabel)}.`,
    );
  }

  return mapLabel;
}

function normalizeReferenceMapFile(rawMapFile) {
  if (typeof rawMapFile !== "string" || !/^[^/\\]+\.tmx$/.test(rawMapFile)) {
    throw new Error(
      `Project map file must be a .tmx filename without path separators. Received: ${describeReceivedValue(rawMapFile)}.`,
    );
  }

  return rawMapFile;
}

function assertReferenceSeason(rawSeason, description) {
  if (typeof rawSeason !== "string" || !referenceSeasons.has(rawSeason)) {
    throw new Error(
      `${description} must be one of spring, summer, fall, winter. Received: ${describeReceivedValue(rawSeason)}.`,
    );
  }

  return rawSeason;
}

function assertSetActiveFlag(rawSetActive) {
  if (typeof rawSetActive !== "boolean") {
    throw new Error(
      `Project map setActive must be a boolean. Received: ${describeReceivedValue(rawSetActive)}.`,
    );
  }

  return rawSetActive;
}

function assertReferenceTimestamp(rawTimestamp, description) {
  if (typeof rawTimestamp !== "string" || Number.isNaN(Date.parse(rawTimestamp))) {
    throw new Error(
      `${description} must be an ISO timestamp string. Received: ${describeReceivedValue(rawTimestamp)}.`,
    );
  }

  return rawTimestamp;
}

function assertReferenceWebpThumbnail(request) {
  if (request.contentType !== "image/webp") {
    throw new Error(
      `Project thumbnail content type must be "image/webp". Received: ${describeReceivedValue(request.contentType)}.`,
    );
  }

  if (!(request.binaryBody instanceof Uint8Array) || request.binaryBody.byteLength === 0) {
    throw new Error(
      `Project thumbnail body must be a non-empty Uint8Array. Received: ${describeReceivedValue(request.binaryBody)}.`,
    );
  }

  const webpBytes = new Uint8Array(request.binaryBody);
  assertReferenceWebpContainerSignature(webpBytes);
  return webpBytes;
}

function assertReferenceWebpContainerSignature(webpBytes) {
  const hasWebpContainerSignature =
    webpBytes.byteLength >= 12 &&
    webpBytes[0] === 82 &&
    webpBytes[1] === 73 &&
    webpBytes[2] === 70 &&
    webpBytes[3] === 70 &&
    webpBytes[8] === 87 &&
    webpBytes[9] === 69 &&
    webpBytes[10] === 66 &&
    webpBytes[11] === 80;

  if (!hasWebpContainerSignature) {
    throw new Error(
      `Project thumbnail bytes must contain a RIFF/WEBP container signature. Received: ${describeReceivedValue(webpBytes)}.`,
    );
  }

  const declaredRiffSize = readReferenceWebpUint32(webpBytes, 4);
  const expectedRiffSize = webpBytes.byteLength - 8;

  if (declaredRiffSize !== expectedRiffSize) {
    throw new Error(
      `Project thumbnail RIFF declared size must equal byte length minus 8. Received declared size: ${String(declaredRiffSize)}; received byte length: ${String(webpBytes.byteLength)}.`,
    );
  }

  if (webpBytes.byteLength < 20) {
    throw new Error(
      `Project thumbnail must contain a supported first WebP image chunk. Received byte length: ${String(webpBytes.byteLength)}.`,
    );
  }

  const firstChunkType = readReferenceWebpFourCharacterCode(webpBytes, 12);
  if (
    firstChunkType !== "VP8 " &&
    firstChunkType !== "VP8L" &&
    firstChunkType !== "VP8X"
  ) {
    throw new Error(
      `Project thumbnail first WebP chunk must be VP8 , VP8L, or VP8X. Received chunk type: ${describeReceivedValue(firstChunkType)}.`,
    );
  }

  const declaredFirstChunkSize = readReferenceWebpUint32(webpBytes, 16);
  const firstChunkPayloadEnd = 20 + declaredFirstChunkSize;

  if (firstChunkPayloadEnd > webpBytes.byteLength) {
    throw new Error(
      `Project thumbnail first chunk length exceeds available bytes. Received declared chunk size: ${String(declaredFirstChunkSize)}; received byte length: ${String(webpBytes.byteLength)}.`,
    );
  }

  const firstChunkPaddingLength = declaredFirstChunkSize % 2;
  const firstChunkPaddedEnd = firstChunkPayloadEnd + firstChunkPaddingLength;
  if (firstChunkPaddedEnd > webpBytes.byteLength) {
    throw new Error(
      `Project thumbnail first chunk padding exceeds available bytes. Received declared chunk size: ${String(declaredFirstChunkSize)}; received byte length: ${String(webpBytes.byteLength)}.`,
    );
  }
}

function readReferenceWebpUint32(webpBytes, byteOffset) {
  return (
    webpBytes[byteOffset] +
    webpBytes[byteOffset + 1] * 2 ** 8 +
    webpBytes[byteOffset + 2] * 2 ** 16 +
    webpBytes[byteOffset + 3] * 2 ** 24
  );
}

function readReferenceWebpFourCharacterCode(webpBytes, byteOffset) {
  return String.fromCharCode(
    webpBytes[byteOffset],
    webpBytes[byteOffset + 1],
    webpBytes[byteOffset + 2],
    webpBytes[byteOffset + 3],
  );
}

function createReferenceIdentifier() {
  if (typeof globalThis.crypto?.randomUUID !== "function") {
    throw new Error("Reference local project ID generation requires crypto.randomUUID().");
  }

  return globalThis.crypto.randomUUID();
}

function findStoredReferenceProjectIndex(projectDocument, projectId) {
  return projectDocument.projects.findIndex(
    (storedProject) => storedProject.id === projectId,
  );
}

function findReferenceProjectMapIndex(project, mapId) {
  return project.maps.findIndex((projectMap) => projectMap.id === mapId);
}

function selectActiveReferenceMapId(project) {
  return project.maps[0]?.id ?? null;
}

function createReferenceProjectSummary(storedProject) {
  return {
    id: storedProject.id,
    title: storedProject.title,
    created_at: storedProject.created_at,
    updated_at: storedProject.updated_at,
  };
}

function createReferenceThumbnailPath(projectId, mapId) {
  return `/api/projects/${projectId}/maps/${mapId}/thumbnail`;
}

function createJsonReferenceResponse(
  status,
  jsonBody,
  projectDocument,
  didMutateProjectDocument = false,
) {
  return {
    status,
    headers: { "content-type": "application/json" },
    jsonBody,
    projectDocument,
    didMutateProjectDocument,
  };
}

function createLocalNotFoundBody(pathname) {
  return {
    error: "Reference local API route not found.",
    pathname,
  };
}

function isExcludedReferenceApiPath(pathname) {
  return (
    pathname === "/api/plans" ||
    pathname.startsWith("/api/plans/") ||
    pathname === "/api/feedback" ||
    pathname.startsWith("/api/feedback/") ||
    (pathname.startsWith("/api/account/") && pathname !== "/api/account/premium") ||
    pathname === "/api/account" ||
    (pathname.startsWith("/api/auth/") && pathname !== "/api/auth/get-session") ||
    pathname === "/api/auth" ||
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/")
  );
}

function readReferenceProjectDocumentFromStorage(storage) {
  return parseReferenceProjectDocument(
    storage.getItem(referenceLocalProjectStorageKey),
  );
}

function writeReferenceProjectDocumentToStorage(storage, projectDocument) {
  storage.setItem(
    referenceLocalProjectStorageKey,
    serializeReferenceProjectDocument(projectDocument),
  );
}

async function createReferenceApiRequestFromBrowserRequest(request, pathname) {
  const contentType = request.headers.get("content-type") ?? undefined;
  const normalizedContentType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
  const requestShape = {
    method: request.method,
    pathname,
    contentType: normalizedContentType,
  };

  if (request.method === "POST" && normalizedContentType === "image/webp") {
    return {
      ...requestShape,
      binaryBody: new Uint8Array(await request.arrayBuffer()),
    };
  }

  if (request.method !== "GET" && request.method !== "DELETE") {
    const requestText = await request.text();

    if (requestText.length === 0) {
      return requestShape;
    }

    try {
      return { ...requestShape, jsonBody: JSON.parse(requestText) };
    } catch (parseError) {
      const parseMessage = parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(
        `Reference API JSON request body is malformed ${describeReceivedValue(requestText)}. Parser error: ${parseMessage}.`,
      );
    }
  }

  return requestShape;
}

function createBrowserResponse(referenceApiResponse) {
  if (referenceApiResponse.binaryBody !== undefined) {
    return new Response(referenceApiResponse.binaryBody, {
      status: referenceApiResponse.status,
      headers: referenceApiResponse.headers,
    });
  }

  return new Response(JSON.stringify(referenceApiResponse.jsonBody), {
    status: referenceApiResponse.status,
    headers: referenceApiResponse.headers,
  });
}

function createWebpDataUrl(webpBytes) {
  return `data:image/webp;base64,${encodeBase64(webpBytes)}`;
}

function parseWebpDataUrl(thumbnailDataUrl) {
  const validatedThumbnailDataUrl = validateWebpDataUrl(thumbnailDataUrl);
  return decodeBase64(validatedThumbnailDataUrl.slice("data:image/webp;base64,".length));
}

function validateWebpDataUrl(rawThumbnailDataUrl) {
  if (
    typeof rawThumbnailDataUrl !== "string" ||
    !rawThumbnailDataUrl.startsWith("data:image/webp;base64,")
  ) {
    throw new Error(
      `Project thumbnail storage value must be a WebP data URL. Received: ${describeReceivedValue(rawThumbnailDataUrl)}.`,
    );
  }

  const encodedThumbnail = rawThumbnailDataUrl.slice("data:image/webp;base64,".length);
  if (encodedThumbnail.length === 0) {
    throw new Error(
      `Project thumbnail storage value must contain WebP bytes. Received: ${describeReceivedValue(rawThumbnailDataUrl)}.`,
    );
  }

  try {
    const decodedThumbnailBytes = decodeBase64(encodedThumbnail);
    assertReferenceWebpContainerSignature(decodedThumbnailBytes);
  } catch (decodeError) {
    if (
      decodeError instanceof Error &&
      decodeError.message.startsWith("Project thumbnail bytes must contain")
    ) {
      throw decodeError;
    }
    const decodeMessage = decodeError instanceof Error ? decodeError.message : String(decodeError);
    throw new Error(
      `Project thumbnail storage value has invalid base64 content ${describeReceivedValue(rawThumbnailDataUrl)}. Decoder error: ${decodeMessage}.`,
    );
  }

  return rawThumbnailDataUrl;
}

function encodeBase64(bytes) {
  let binaryText = "";
  for (const byte of bytes) {
    binaryText += String.fromCharCode(byte);
  }

  if (typeof globalThis.btoa !== "function") {
    throw new Error("Reference thumbnail encoding requires btoa().");
  }

  return globalThis.btoa(binaryText);
}

function decodeBase64(encodedText) {
  if (typeof globalThis.atob !== "function") {
    throw new Error("Reference thumbnail decoding requires atob().");
  }

  const binaryText = globalThis.atob(encodedText);
  const decodedBytes = new Uint8Array(binaryText.length);

  for (let byteIndex = 0; byteIndex < binaryText.length; byteIndex += 1) {
    decodedBytes[byteIndex] = binaryText.charCodeAt(byteIndex);
  }

  return decodedBytes;
}

function cloneJsonValue(rawValue, description) {
  assertJsonValue(rawValue, description, new Set());
  return JSON.parse(JSON.stringify(rawValue));
}

function assertJsonValue(rawValue, description, visitedObjects) {
  if (rawValue === null || typeof rawValue === "string" || typeof rawValue === "boolean") {
    return;
  }

  if (typeof rawValue === "number") {
    if (Number.isFinite(rawValue)) {
      return;
    }

    throw new Error(
      `${description} must not contain a non-finite number. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }

  if (Array.isArray(rawValue)) {
    if (visitedObjects.has(rawValue)) {
      throw new Error(`${description} must not contain a circular array. Received: ${describeReceivedValue(rawValue)}.`);
    }
    visitedObjects.add(rawValue);
    rawValue.forEach((arrayValue, arrayIndex) => {
      assertJsonValue(arrayValue, `${description}[${String(arrayIndex)}]`, visitedObjects);
    });
    visitedObjects.delete(rawValue);
    return;
  }

  if (isPlainObject(rawValue)) {
    if (visitedObjects.has(rawValue)) {
      throw new Error(`${description} must not contain a circular object. Received: ${describeReceivedValue(rawValue)}.`);
    }
    visitedObjects.add(rawValue);
    for (const [propertyName, propertyValue] of Object.entries(rawValue)) {
      if (
        propertyName === "__proto__" ||
        propertyName === "constructor" ||
        propertyName === "prototype"
      ) {
        throw new Error(
          `${description} must not contain unsafe property ${describeReceivedValue(propertyName)}. Received object: ${describeReceivedValue(rawValue)}.`,
        );
      }
      assertJsonValue(propertyValue, `${description}.${propertyName}`, visitedObjects);
    }
    visitedObjects.delete(rawValue);
    return;
  }

  throw new Error(
    `${description} must contain JSON-safe values only. Received: ${describeReceivedValue(rawValue)}.`,
  );
}

function assertPlainObject(rawValue, description) {
  if (!isPlainObject(rawValue)) {
    throw new Error(
      `${description} must be a non-null object. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }
}

function isPlainObject(rawValue) {
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
    return false;
  }

  const objectPrototype = Object.getPrototypeOf(rawValue);
  return objectPrototype === Object.prototype || objectPrototype === null;
}

function describeReceivedValue(rawValue) {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }

  if (rawValue === undefined) {
    return "undefined";
  }

  if (typeof rawValue === "number" && !Number.isFinite(rawValue)) {
    return String(rawValue);
  }

  try {
    const serializedValue = JSON.stringify(rawValue);
    return serializedValue === undefined ? String(rawValue) : serializedValue;
  } catch (serializationError) {
    const serializationMessage = serializationError instanceof Error
      ? serializationError.message
      : String(serializationError);
    return `[unserializable value: ${serializationMessage}]`;
  }
}
