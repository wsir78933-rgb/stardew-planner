import {
  assertLocalMapInstanceId,
  cloneJsonSafeValue,
  cloneLocalProject,
  cloneLocalProjectV2,
  createLocalProject,
  defaultLocalProjectMapId,
  localProjectFormatVersion,
  localProjectV1FormatVersion,
  localProjectV2FormatVersion,
  maximumLocalProjectNameLength,
  migrateLocalProjectV1ToV2,
  migrateStoredLocalProjectCollectionV1ToV2,
  normalizeLocalMapInstanceName,
  normalizeLocalProjectName,
  parseExportedLocalProject,
  parseExportedLocalProjectV2,
  parseStoredLocalProjectCollection,
  parseStoredLocalProjectCollectionV2,
  validateLocalProject,
  validateLocalProjectV2,
  validateStoredLocalProjectCollection,
  validateStoredLocalProjectCollectionV2,
  assertKnownLocalMapId,
  assertLocalProjectId,
  type JsonSafeValue,
  type LocalProject,
  type LocalProjectMapInstanceV2,
  type LocalProjectV2,
  type StoredLocalProjectCollection,
  type StoredLocalProjectCollectionV2,
} from "./project-schema";
import { getPlannerMapById } from "../maps/map-catalog";

export const localProjectStorageKey = "stardew-planner.local-projects.v1";
export const localProjectV2StorageKey = "stardew-planner.local-projects.v2";

const maximumProjectIdGenerationAttempts = 20;

export type LocalProjectStorageAdapter = Readonly<{
  getItem(storageKey: string): string | null;
  setItem(storageKey: string, serializedValue: string): void;
  removeItem(storageKey: string): void;
}>;

export type LocalProjectSummary = Readonly<{
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeMapId: string;
}>;

export type CreateLocalProjectInput = Readonly<{
  name?: string;
  initialMapId?: string;
}>;

export type LocalProjectStore = Readonly<{
  listProjects(): readonly LocalProjectSummary[];
  createProject(input?: CreateLocalProjectInput): LocalProject;
  openProject(projectId: string): LocalProject;
  saveCurrentMapState(
    projectId: string,
    activeMapId: string,
    currentMapState: JsonSafeValue,
  ): LocalProject;
  renameProject(projectId: string, requestedName: string): LocalProject;
  duplicateProject(projectId: string, requestedName?: string): LocalProject;
  deleteProject(projectId: string): void;
  exportProject(projectId: string): string;
  importProject(serializedProject: string): LocalProject;
}>;

export type CreateBrowserLocalProjectStoreOptions = Readonly<{
  storage?: LocalProjectStorageAdapter;
  createProjectId?: () => string;
  now?: () => string;
}>;

export type LocalProjectV2Summary = Readonly<{
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeMapInstanceId: string;
  activeMapInstanceName: string;
  activeBaseMapId: string;
  mapInstanceCount: number;
}>;

export type CreateLocalProjectV2Input = Readonly<{
  name?: string;
  initialBaseMapId?: string;
}>;

export type CreateLocalMapInstanceInput = Readonly<{
  baseMapId: string;
  name?: string;
}>;

export type LocalMapInstanceTransferResult = Readonly<{
  destinationMapInstanceId: string;
  destinationProject: LocalProjectV2;
  sourceProject: LocalProjectV2;
}>;

export type LocalProjectStoreV2 = Readonly<{
  listProjects(): readonly LocalProjectV2Summary[];
  createProject(input?: CreateLocalProjectV2Input): LocalProjectV2;
  openProject(projectId: string): LocalProjectV2;
  saveMapInstanceState(
    projectId: string,
    mapInstanceId: string,
    currentMapState: JsonSafeValue,
  ): LocalProjectV2;
  renameProject(projectId: string, requestedName: string): LocalProjectV2;
  duplicateProject(projectId: string, requestedName?: string): LocalProjectV2;
  deleteProject(projectId: string): void;
  createMapInstance(
    projectId: string,
    input: CreateLocalMapInstanceInput,
  ): LocalProjectV2;
  duplicateMapInstance(
    projectId: string,
    mapInstanceId: string,
    requestedName?: string,
  ): LocalProjectV2;
  copyMapInstance(
    sourceProjectId: string,
    sourceMapInstanceId: string,
    destinationProjectId: string,
  ): LocalMapInstanceTransferResult;
  moveMapInstance(
    sourceProjectId: string,
    sourceMapInstanceId: string,
    destinationProjectId: string,
  ): LocalMapInstanceTransferResult;
  renameMapInstance(
    projectId: string,
    mapInstanceId: string,
    requestedName: string,
  ): LocalProjectV2;
  deleteMapInstance(projectId: string, mapInstanceId: string): LocalProjectV2;
  switchActiveMapInstance(
    projectId: string,
    mapInstanceId: string,
  ): LocalProjectV2;
  exportProject(projectId: string): string;
  importProject(serializedProject: string): LocalProjectV2;
}>;

export type CreateBrowserLocalProjectStoreV2Options = Readonly<{
  storage?: LocalProjectStorageAdapter;
  createProjectId?: () => string;
  createMapInstanceId?: () => string;
  now?: () => string;
}>;

export function createBrowserLocalProjectStore(
  options: CreateBrowserLocalProjectStoreOptions = {},
): LocalProjectStore {
  const projectStorage = options.storage ?? getBrowserLocalStorage();
  const createProjectId = options.createProjectId ?? createCryptographicProjectId;
  const now = options.now ?? getCurrentIsoTimestamp;

  assertStorageAdapter(projectStorage);

  return {
    listProjects(): readonly LocalProjectSummary[] {
      return readProjectCollection(projectStorage).projects.map(
        createLocalProjectSummary,
      );
    },

    createProject(input: CreateLocalProjectInput = {}): LocalProject {
      const projectCollection = readProjectCollection(projectStorage);
      const validatedInput = validateCreateLocalProjectInput(input);
      const name =
        validatedInput.name === undefined
          ? createNextUntitledProjectName(projectCollection.projects)
          : validatedInput.name;
      const initialMapId =
        validatedInput.initialMapId ?? defaultLocalProjectMapId;
      assertKnownLocalMapId(initialMapId);
      const timestamp = now();
      const project = createLocalProject({
        id: createUniqueProjectId(projectCollection.projects, createProjectId),
        name,
        timestamp,
        activeMapId: initialMapId,
        activeMapState: {},
      });

      writeProjectCollection(projectStorage, {
        formatVersion: localProjectFormatVersion,
        projects: [...projectCollection.projects, project],
      });

      return cloneLocalProject(project);
    },

    openProject(projectId: string): LocalProject {
      const localProject = findExistingProject(
        readProjectCollection(projectStorage).projects,
        projectId,
      );

      return cloneLocalProject(localProject);
    },

    saveCurrentMapState(
      projectId: string,
      activeMapId: string,
      currentMapState: JsonSafeValue,
    ): LocalProject {
      assertLocalProjectId(projectId);
      assertKnownLocalMapId(activeMapId);
      const clonedMapState = cloneJsonSafeValue(
        currentMapState,
        `current map state for map ID ${JSON.stringify(activeMapId)}`,
      );
      const projectCollection = readProjectCollection(projectStorage);
      const existingProject = findExistingProject(projectCollection.projects, projectId);
      const savedProject = validateProjectUpdate(existingProject, {
        ...existingProject,
        updatedAt: now(),
        activeMapId,
        maps: {
          ...existingProject.maps,
          [activeMapId]: clonedMapState,
        },
      });

      writeProjectCollection(
        projectStorage,
        replaceExistingProject(projectCollection, savedProject),
      );

      return cloneLocalProject(savedProject);
    },

    renameProject(projectId: string, requestedName: string): LocalProject {
      assertLocalProjectId(projectId);
      const projectCollection = readProjectCollection(projectStorage);
      const existingProject = findExistingProject(projectCollection.projects, projectId);
      const renamedProject = validateProjectUpdate(existingProject, {
        ...existingProject,
        name: normalizeLocalProjectName(requestedName),
        updatedAt: now(),
      });

      writeProjectCollection(
        projectStorage,
        replaceExistingProject(projectCollection, renamedProject),
      );

      return cloneLocalProject(renamedProject);
    },

    duplicateProject(projectId: string, requestedName?: string): LocalProject {
      assertLocalProjectId(projectId);
      const projectCollection = readProjectCollection(projectStorage);
      const sourceProject = findExistingProject(projectCollection.projects, projectId);
      const duplicateName =
        requestedName === undefined
          ? createNextCopyProjectName(sourceProject.name, projectCollection.projects)
          : normalizeLocalProjectName(requestedName);
      const timestamp = now();
      const duplicateProject = validateProjectUpdate(sourceProject, {
        ...sourceProject,
        id: createUniqueProjectId(projectCollection.projects, createProjectId),
        name: duplicateName,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      writeProjectCollection(projectStorage, {
        formatVersion: localProjectFormatVersion,
        projects: [...projectCollection.projects, duplicateProject],
      });

      return cloneLocalProject(duplicateProject);
    },

    deleteProject(projectId: string): void {
      assertLocalProjectId(projectId);
      const projectCollection = readProjectCollection(projectStorage);
      findExistingProject(projectCollection.projects, projectId);

      writeProjectCollection(projectStorage, {
        formatVersion: localProjectFormatVersion,
        projects: projectCollection.projects.filter(
          (existingProject) => existingProject.id !== projectId,
        ),
      });
    },

    exportProject(projectId: string): string {
      const localProject = findExistingProject(
        readProjectCollection(projectStorage).projects,
        projectId,
      );

      return JSON.stringify(cloneLocalProject(localProject));
    },

    importProject(serializedProject: string): LocalProject {
      const importedProject = parseExportedLocalProject(serializedProject);
      const projectCollection = readProjectCollection(projectStorage);
      const importedWithLocalId = validateLocalProject({
        ...importedProject,
        id: createUniqueProjectId(projectCollection.projects, createProjectId),
      });

      writeProjectCollection(projectStorage, {
        formatVersion: localProjectFormatVersion,
        projects: [...projectCollection.projects, importedWithLocalId],
      });

      return cloneLocalProject(importedWithLocalId);
    },
  };
}

export function createBrowserLocalProjectStoreV2(
  options: CreateBrowserLocalProjectStoreV2Options = {},
): LocalProjectStoreV2 {
  const projectStorage = options.storage ?? getBrowserLocalStorage();
  const createProjectId = options.createProjectId ?? createCryptographicProjectId;
  const createMapInstanceId =
    options.createMapInstanceId ?? createCryptographicMapInstanceId;
  const now = options.now ?? getCurrentIsoTimestamp;

  assertStorageAdapter(projectStorage);

  return {
    listProjects(): readonly LocalProjectV2Summary[] {
      return readProjectCollectionV2(projectStorage).projects.map(
        createLocalProjectV2Summary,
      );
    },

    createProject(input: CreateLocalProjectV2Input = {}): LocalProjectV2 {
      const projectCollection = readProjectCollectionV2(projectStorage);
      const validatedInput = validateCreateLocalProjectV2Input(input);
      const projectName =
        validatedInput.name ?? createNextUntitledProjectNameV2(projectCollection.projects);
      const initialBaseMapId =
        validatedInput.initialBaseMapId ?? defaultLocalProjectMapId;
      assertKnownLocalMapId(initialBaseMapId);
      const timestamp = now();
      const initialMapInstanceId = createUniqueMapInstanceId([], createMapInstanceId);
      const initialMapInstance = createLocalMapInstance(
        initialBaseMapId,
        getPlannerMapById(initialBaseMapId).displayName,
        {},
      );
      const createdProject = validateLocalProjectV2({
        formatVersion: localProjectV2FormatVersion,
        id: createUniqueProjectIdV2(projectCollection.projects, createProjectId),
        name: projectName,
        createdAt: timestamp,
        updatedAt: timestamp,
        activeMapInstanceId: initialMapInstanceId,
        mapInstances: { [initialMapInstanceId]: initialMapInstance },
      });

      writeProjectCollectionV2(projectStorage, {
        formatVersion: localProjectV2FormatVersion,
        projects: [...projectCollection.projects, createdProject],
      });

      return cloneLocalProjectV2(createdProject);
    },

    openProject(projectId: string): LocalProjectV2 {
      return cloneLocalProjectV2(
        findExistingProjectV2(readProjectCollectionV2(projectStorage).projects, projectId),
      );
    },

    saveMapInstanceState(
      projectId: string,
      mapInstanceId: string,
      currentMapState: JsonSafeValue,
    ): LocalProjectV2 {
      assertLocalProjectId(projectId);
      assertLocalMapInstanceId(mapInstanceId);
      const clonedMapState = cloneJsonSafeValue(
        currentMapState,
        `current map state for map instance ID ${JSON.stringify(mapInstanceId)}`,
      );
      const projectCollection = readProjectCollectionV2(projectStorage);
      const existingProject = findExistingProjectV2(projectCollection.projects, projectId);
      const existingMapInstance = getRequiredMapInstance(existingProject, mapInstanceId);
      const savedProject = validateLocalProjectV2Update(existingProject, {
        ...existingProject,
        updatedAt: now(),
        mapInstances: {
          ...existingProject.mapInstances,
          [mapInstanceId]: {
            ...existingMapInstance,
            state: clonedMapState,
          },
        },
      });

      writeProjectCollectionV2(
        projectStorage,
        replaceExistingProjectV2(projectCollection, savedProject),
      );

      return cloneLocalProjectV2(savedProject);
    },

    renameProject(projectId: string, requestedName: string): LocalProjectV2 {
      assertLocalProjectId(projectId);
      const projectCollection = readProjectCollectionV2(projectStorage);
      const existingProject = findExistingProjectV2(projectCollection.projects, projectId);
      const renamedProject = validateLocalProjectV2Update(existingProject, {
        ...existingProject,
        name: normalizeLocalProjectName(requestedName),
        updatedAt: now(),
      });

      writeProjectCollectionV2(
        projectStorage,
        replaceExistingProjectV2(projectCollection, renamedProject),
      );

      return cloneLocalProjectV2(renamedProject);
    },

    duplicateProject(projectId: string, requestedName?: string): LocalProjectV2 {
      assertLocalProjectId(projectId);
      const projectCollection = readProjectCollectionV2(projectStorage);
      const sourceProject = findExistingProjectV2(projectCollection.projects, projectId);
      const duplicateName =
        requestedName === undefined
          ? createNextCopyProjectNameV2(sourceProject.name, projectCollection.projects)
          : normalizeLocalProjectName(requestedName);
      const timestamp = now();
      const duplicatedProject = validateLocalProjectV2Update(sourceProject, {
        ...sourceProject,
        id: createUniqueProjectIdV2(projectCollection.projects, createProjectId),
        name: duplicateName,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      writeProjectCollectionV2(projectStorage, {
        formatVersion: localProjectV2FormatVersion,
        projects: [...projectCollection.projects, duplicatedProject],
      });

      return cloneLocalProjectV2(duplicatedProject);
    },

    deleteProject(projectId: string): void {
      assertLocalProjectId(projectId);
      const projectCollection = readProjectCollectionV2(projectStorage);
      findExistingProjectV2(projectCollection.projects, projectId);

      writeProjectCollectionV2(projectStorage, {
        formatVersion: localProjectV2FormatVersion,
        projects: projectCollection.projects.filter(
          (existingProject) => existingProject.id !== projectId,
        ),
      });
    },

    createMapInstance(
      projectId: string,
      input: CreateLocalMapInstanceInput,
    ): LocalProjectV2 {
      assertLocalProjectId(projectId);
      const validatedInput = validateCreateLocalMapInstanceInput(input);
      const projectCollection = readProjectCollectionV2(projectStorage);
      const existingProject = findExistingProjectV2(projectCollection.projects, projectId);
      const mapInstanceId = createUniqueMapInstanceId(
        Object.keys(existingProject.mapInstances),
        createMapInstanceId,
      );
      const mapInstanceName =
        validatedInput.name ??
        createNextMapInstanceName(
          getPlannerMapById(validatedInput.baseMapId).displayName,
          existingProject.mapInstances,
        );
      const createdProject = validateLocalProjectV2Update(existingProject, {
        ...existingProject,
        updatedAt: now(),
        activeMapInstanceId: mapInstanceId,
        mapInstances: {
          ...existingProject.mapInstances,
          [mapInstanceId]: createLocalMapInstance(
            validatedInput.baseMapId,
            mapInstanceName,
            {},
          ),
        },
      });

      writeProjectCollectionV2(
        projectStorage,
        replaceExistingProjectV2(projectCollection, createdProject),
      );

      return cloneLocalProjectV2(createdProject);
    },

    duplicateMapInstance(
      projectId: string,
      mapInstanceId: string,
      requestedName?: string,
    ): LocalProjectV2 {
      assertLocalProjectId(projectId);
      assertLocalMapInstanceId(mapInstanceId);
      const projectCollection = readProjectCollectionV2(projectStorage);
      const existingProject = findExistingProjectV2(projectCollection.projects, projectId);
      const sourceMapInstance = getRequiredMapInstance(existingProject, mapInstanceId);
      const duplicateMapInstanceId = createUniqueMapInstanceId(
        Object.keys(existingProject.mapInstances),
        createMapInstanceId,
      );
      const duplicateName =
        requestedName === undefined
          ? createNextCopyMapInstanceName(sourceMapInstance.name, existingProject.mapInstances)
          : normalizeLocalMapInstanceName(requestedName);
      const duplicatedProject = validateLocalProjectV2Update(existingProject, {
        ...existingProject,
        updatedAt: now(),
        activeMapInstanceId: duplicateMapInstanceId,
        mapInstances: {
          ...existingProject.mapInstances,
          [duplicateMapInstanceId]: createLocalMapInstance(
            sourceMapInstance.baseMapId,
            duplicateName,
            sourceMapInstance.state,
          ),
        },
      });

      writeProjectCollectionV2(
        projectStorage,
        replaceExistingProjectV2(projectCollection, duplicatedProject),
      );

      return cloneLocalProjectV2(duplicatedProject);
    },

    copyMapInstance(
      sourceProjectId: string,
      sourceMapInstanceId: string,
      destinationProjectId: string,
    ): LocalMapInstanceTransferResult {
      const transferContext = createMapInstanceTransferContext({
        destinationProjectId,
        projectCollection: readProjectCollectionV2(projectStorage),
        sourceMapInstanceId,
        sourceProjectId,
      });
      const destinationMapInstanceId = createUniqueMapInstanceId(
        Object.keys(transferContext.destinationProject.mapInstances),
        createMapInstanceId,
      );
      const copiedDestinationProject = createDestinationProjectWithTransferredMap(
        transferContext.destinationProject,
        transferContext.sourceMapInstance,
        destinationMapInstanceId,
        now(),
      );
      const nextProjectCollection = replaceProjectsV2(
        transferContext.projectCollection,
        [transferContext.sourceProject, copiedDestinationProject],
      );

      writeProjectCollectionV2(projectStorage, nextProjectCollection);

      return {
        destinationMapInstanceId,
        destinationProject: cloneLocalProjectV2(copiedDestinationProject),
        sourceProject: cloneLocalProjectV2(transferContext.sourceProject),
      };
    },

    moveMapInstance(
      sourceProjectId: string,
      sourceMapInstanceId: string,
      destinationProjectId: string,
    ): LocalMapInstanceTransferResult {
      const transferContext = createMapInstanceTransferContext({
        destinationProjectId,
        projectCollection: readProjectCollectionV2(projectStorage),
        sourceMapInstanceId,
        sourceProjectId,
      });
      const sourceMapInstanceIds = Object.keys(
        transferContext.sourceProject.mapInstances,
      );

      if (sourceMapInstanceIds.length === 1) {
        throw new Error(
          `Local project ${JSON.stringify(sourceProjectId)} must contain at least one map instance; cannot move ${JSON.stringify(sourceMapInstanceId)}.`,
        );
      }

      const destinationMapInstanceId = createUniqueMapInstanceId(
        Object.keys(transferContext.destinationProject.mapInstances),
        createMapInstanceId,
      );
      const timestamp = now();
      const movedDestinationProject = createDestinationProjectWithTransferredMap(
        transferContext.destinationProject,
        transferContext.sourceMapInstance,
        destinationMapInstanceId,
        timestamp,
      );
      const movedSourceProject = createSourceProjectWithoutTransferredMap(
        transferContext.sourceProject,
        sourceMapInstanceId,
        timestamp,
      );
      const nextProjectCollection = replaceProjectsV2(
        transferContext.projectCollection,
        [movedSourceProject, movedDestinationProject],
      );

      writeProjectCollectionV2(projectStorage, nextProjectCollection);

      return {
        destinationMapInstanceId,
        destinationProject: cloneLocalProjectV2(movedDestinationProject),
        sourceProject: cloneLocalProjectV2(movedSourceProject),
      };
    },

    renameMapInstance(
      projectId: string,
      mapInstanceId: string,
      requestedName: string,
    ): LocalProjectV2 {
      assertLocalProjectId(projectId);
      assertLocalMapInstanceId(mapInstanceId);
      const projectCollection = readProjectCollectionV2(projectStorage);
      const existingProject = findExistingProjectV2(projectCollection.projects, projectId);
      const existingMapInstance = getRequiredMapInstance(existingProject, mapInstanceId);
      const renamedProject = validateLocalProjectV2Update(existingProject, {
        ...existingProject,
        updatedAt: now(),
        mapInstances: {
          ...existingProject.mapInstances,
          [mapInstanceId]: {
            ...existingMapInstance,
            name: normalizeLocalMapInstanceName(requestedName),
          },
        },
      });

      writeProjectCollectionV2(
        projectStorage,
        replaceExistingProjectV2(projectCollection, renamedProject),
      );

      return cloneLocalProjectV2(renamedProject);
    },

    deleteMapInstance(projectId: string, mapInstanceId: string): LocalProjectV2 {
      assertLocalProjectId(projectId);
      assertLocalMapInstanceId(mapInstanceId);
      const projectCollection = readProjectCollectionV2(projectStorage);
      const existingProject = findExistingProjectV2(projectCollection.projects, projectId);
      getRequiredMapInstance(existingProject, mapInstanceId);
      const remainingMapInstanceIds = Object.keys(existingProject.mapInstances).filter(
        (existingMapInstanceId) => existingMapInstanceId !== mapInstanceId,
      );

      if (remainingMapInstanceIds.length === 0) {
        throw new Error(
          `Local project ${JSON.stringify(projectId)} must contain at least one map instance; cannot delete ${JSON.stringify(mapInstanceId)}.`,
        );
      }

      const nextActiveMapInstanceId =
        existingProject.activeMapInstanceId === mapInstanceId
          ? remainingMapInstanceIds[0]!
          : existingProject.activeMapInstanceId;
      const { [mapInstanceId]: deletedMapInstance, ...remainingMapInstances } =
        existingProject.mapInstances;
      void deletedMapInstance;
      const deletedProject = validateLocalProjectV2Update(existingProject, {
        ...existingProject,
        updatedAt: now(),
        activeMapInstanceId: nextActiveMapInstanceId,
        mapInstances: remainingMapInstances,
      });

      writeProjectCollectionV2(
        projectStorage,
        replaceExistingProjectV2(projectCollection, deletedProject),
      );

      return cloneLocalProjectV2(deletedProject);
    },

    switchActiveMapInstance(
      projectId: string,
      mapInstanceId: string,
    ): LocalProjectV2 {
      assertLocalProjectId(projectId);
      assertLocalMapInstanceId(mapInstanceId);
      const projectCollection = readProjectCollectionV2(projectStorage);
      const existingProject = findExistingProjectV2(projectCollection.projects, projectId);
      getRequiredMapInstance(existingProject, mapInstanceId);
      const switchedProject = validateLocalProjectV2Update(existingProject, {
        ...existingProject,
        updatedAt: now(),
        activeMapInstanceId: mapInstanceId,
      });

      writeProjectCollectionV2(
        projectStorage,
        replaceExistingProjectV2(projectCollection, switchedProject),
      );

      return cloneLocalProjectV2(switchedProject);
    },

    exportProject(projectId: string): string {
      const localProject = findExistingProjectV2(
        readProjectCollectionV2(projectStorage).projects,
        projectId,
      );

      return JSON.stringify(cloneLocalProjectV2(localProject));
    },

    importProject(serializedProject: string): LocalProjectV2 {
      const importedProject = parseImportedLocalProjectV2(serializedProject);
      const projectCollection = readProjectCollectionV2(projectStorage);
      const importedProjectWithLocalId = validateLocalProjectV2({
        ...importedProject,
        id: createUniqueProjectIdV2(projectCollection.projects, createProjectId),
      });

      writeProjectCollectionV2(projectStorage, {
        formatVersion: localProjectV2FormatVersion,
        projects: [...projectCollection.projects, importedProjectWithLocalId],
      });

      return cloneLocalProjectV2(importedProjectWithLocalId);
    },
  };
}

function readProjectCollectionV2(
  storage: LocalProjectStorageAdapter,
): StoredLocalProjectCollectionV2 {
  const serializedV2Collection = readStoredCollection(storage, localProjectV2StorageKey);

  if (serializedV2Collection !== null) {
    return parseStoredLocalProjectCollectionV2(serializedV2Collection);
  }

  const serializedV1Collection = readStoredCollection(storage, localProjectStorageKey);

  if (serializedV1Collection === null) {
    return {
      formatVersion: localProjectV2FormatVersion,
      projects: [],
    };
  }

  const migratedCollection = migrateStoredLocalProjectCollectionV1ToV2(
    parseStoredLocalProjectCollection(serializedV1Collection),
  );
  writeProjectCollectionV2(storage, migratedCollection);
  return migratedCollection;
}

function writeProjectCollectionV2(
  storage: LocalProjectStorageAdapter,
  projectCollection: StoredLocalProjectCollectionV2,
): void {
  const validatedCollection = validateStoredLocalProjectCollectionV2(projectCollection);
  const serializedCollection = JSON.stringify(validatedCollection);

  try {
    storage.setItem(localProjectV2StorageKey, serializedCollection);
  } catch (caughtError) {
    throw new Error(
      `Cannot write browser local project storage key ${JSON.stringify(localProjectV2StorageKey)} with ${describeStorageAdapter(serializedCollection)}: ${describeThrownStorageError(caughtError)}.`,
      { cause: caughtError },
    );
  }
}

function readStoredCollection(
  storage: LocalProjectStorageAdapter,
  storageKey: string,
): string | null {
  let serializedCollection: string | null;

  try {
    serializedCollection = storage.getItem(storageKey);
  } catch (caughtError) {
    throw new Error(
      `Cannot read browser local project storage key ${JSON.stringify(storageKey)}: ${describeThrownStorageError(caughtError)}.`,
      { cause: caughtError },
    );
  }

  if (serializedCollection !== null && typeof serializedCollection !== "string") {
    throw new Error(
      `Local project storage getItem returned ${describeStorageAdapter(serializedCollection)} for key ${JSON.stringify(storageKey)}; expected string or null.`,
    );
  }

  return serializedCollection;
}

function parseImportedLocalProjectV2(serializedProject: string): LocalProjectV2 {
  const parsedProject = parseSerializedProject(serializedProject);

  if (
    parsedProject !== null &&
    typeof parsedProject === "object" &&
    !Array.isArray(parsedProject) &&
    (parsedProject as Record<string, unknown>).formatVersion === localProjectV1FormatVersion
  ) {
    return migrateLocalProjectV1ToV2(parsedProject);
  }

  return parseExportedLocalProjectV2(serializedProject);
}

function parseSerializedProject(serializedProject: string): unknown {
  if (typeof serializedProject !== "string") {
    throw new Error(
      `Exported local project must be a JSON string; received ${describeStorageAdapter(serializedProject)}.`,
    );
  }

  try {
    return JSON.parse(serializedProject) as unknown;
  } catch (caughtError) {
    if (caughtError instanceof SyntaxError) {
      throw new Error(
        `Cannot parse exported local project ${JSON.stringify(serializedProject)}: ${caughtError.message}`,
      );
    }

    throw caughtError;
  }
}

function createLocalMapInstance(
  baseMapId: string,
  mapInstanceName: string,
  state: JsonSafeValue,
): LocalProjectMapInstanceV2 {
  return {
    baseMapId,
    name: normalizeLocalMapInstanceName(mapInstanceName),
    state: cloneJsonSafeValue(state, `map instance state for base map ${JSON.stringify(baseMapId)}`),
  };
}

type MapInstanceTransferContext = Readonly<{
  destinationProject: LocalProjectV2;
  projectCollection: StoredLocalProjectCollectionV2;
  sourceMapInstance: LocalProjectMapInstanceV2;
  sourceProject: LocalProjectV2;
}>;

type CreateMapInstanceTransferContextInput = Readonly<{
  destinationProjectId: string;
  projectCollection: StoredLocalProjectCollectionV2;
  sourceMapInstanceId: string;
  sourceProjectId: string;
}>;

function createMapInstanceTransferContext(
  createMapInstanceTransferContextInput: CreateMapInstanceTransferContextInput,
): MapInstanceTransferContext {
  const {
    destinationProjectId,
    projectCollection,
    sourceMapInstanceId,
    sourceProjectId,
  } = createMapInstanceTransferContextInput;

  assertLocalProjectId(sourceProjectId);
  assertLocalProjectId(destinationProjectId);
  assertLocalMapInstanceId(sourceMapInstanceId);

  if (sourceProjectId === destinationProjectId) {
    throw new Error(
      `Map instance transfer requires distinct source and destination local project IDs; received ${JSON.stringify(sourceProjectId)}.`,
    );
  }

  const sourceProject = findExistingProjectV2(
    projectCollection.projects,
    sourceProjectId,
  );
  const destinationProject = findExistingProjectV2(
    projectCollection.projects,
    destinationProjectId,
  );

  return {
    destinationProject,
    projectCollection,
    sourceMapInstance: getRequiredMapInstance(sourceProject, sourceMapInstanceId),
    sourceProject,
  };
}

function createDestinationProjectWithTransferredMap(
  destinationProject: LocalProjectV2,
  sourceMapInstance: LocalProjectMapInstanceV2,
  destinationMapInstanceId: string,
  timestamp: string,
): LocalProjectV2 {
  const destinationMapInstanceName = createNextMapInstanceName(
    sourceMapInstance.name,
    destinationProject.mapInstances,
  );

  return validateLocalProjectV2Update(destinationProject, {
    ...destinationProject,
    updatedAt: timestamp,
    mapInstances: {
      ...destinationProject.mapInstances,
      [destinationMapInstanceId]: createLocalMapInstance(
        sourceMapInstance.baseMapId,
        destinationMapInstanceName,
        sourceMapInstance.state,
      ),
    },
  });
}

function createSourceProjectWithoutTransferredMap(
  sourceProject: LocalProjectV2,
  sourceMapInstanceId: string,
  timestamp: string,
): LocalProjectV2 {
  const { [sourceMapInstanceId]: movedMapInstance, ...remainingMapInstances } =
    sourceProject.mapInstances;
  void movedMapInstance;
  const remainingMapInstanceIds = Object.keys(remainingMapInstances);

  if (remainingMapInstanceIds.length === 0) {
    throw new Error(
      `Local project ${JSON.stringify(sourceProject.id)} must contain at least one map instance after moving ${JSON.stringify(sourceMapInstanceId)}.`,
    );
  }

  return validateLocalProjectV2Update(sourceProject, {
    ...sourceProject,
    updatedAt: timestamp,
    activeMapInstanceId:
      sourceProject.activeMapInstanceId === sourceMapInstanceId
        ? remainingMapInstanceIds[0]!
        : sourceProject.activeMapInstanceId,
    mapInstances: remainingMapInstances,
  });
}

function getRequiredMapInstance(
  localProject: LocalProjectV2,
  mapInstanceId: string,
): LocalProjectMapInstanceV2 {
  const mapInstance = localProject.mapInstances[mapInstanceId];

  if (mapInstance === undefined) {
    throw new Error(
      `Local project ID ${JSON.stringify(localProject.id)} does not contain map instance ID ${JSON.stringify(mapInstanceId)}; available IDs are ${JSON.stringify(Object.keys(localProject.mapInstances))}.`,
    );
  }

  return mapInstance;
}

function findExistingProjectV2(
  projects: readonly LocalProjectV2[],
  projectId: string,
): LocalProjectV2 {
  assertLocalProjectId(projectId);
  const localProject = projects.find(
    (existingProject) => existingProject.id === projectId,
  );

  if (localProject === undefined) {
    throw new Error(
      `Local project ID ${JSON.stringify(projectId)} does not exist in browser local storage.`,
    );
  }

  return localProject;
}

function replaceExistingProjectV2(
  projectCollection: StoredLocalProjectCollectionV2,
  replacementProject: LocalProjectV2,
): StoredLocalProjectCollectionV2 {
  let replacementApplied = false;
  const projects = projectCollection.projects.map((existingProject) => {
    if (existingProject.id !== replacementProject.id) {
      return existingProject;
    }

    replacementApplied = true;
    return replacementProject;
  });

  if (!replacementApplied) {
    throw new Error(
      `Cannot replace missing local project ID ${JSON.stringify(replacementProject.id)}.`,
    );
  }

  return {
    formatVersion: localProjectV2FormatVersion,
    projects,
  };
}

function replaceProjectsV2(
  projectCollection: StoredLocalProjectCollectionV2,
  replacementProjects: readonly LocalProjectV2[],
): StoredLocalProjectCollectionV2 {
  const replacementProjectById = new Map(
    replacementProjects.map((replacementProject) => [
      replacementProject.id,
      replacementProject,
    ]),
  );

  if (replacementProjectById.size !== replacementProjects.length) {
    throw new Error(
      `Cannot replace local projects with duplicate IDs: ${JSON.stringify(replacementProjects.map((replacementProject) => replacementProject.id))}.`,
    );
  }

  const replacedProjectIds = new Set<string>();
  const projects = projectCollection.projects.map((existingProject) => {
    const replacementProject = replacementProjectById.get(existingProject.id);

    if (replacementProject === undefined) {
      return existingProject;
    }

    replacedProjectIds.add(existingProject.id);
    return replacementProject;
  });

  for (const replacementProjectId of replacementProjectById.keys()) {
    if (!replacedProjectIds.has(replacementProjectId)) {
      throw new Error(
        `Cannot replace missing local project ID ${JSON.stringify(replacementProjectId)}.`,
      );
    }
  }

  return {
    formatVersion: localProjectV2FormatVersion,
    projects,
  };
}

function validateLocalProjectV2Update(
  existingProject: LocalProjectV2,
  rawProject: unknown,
): LocalProjectV2 {
  const updatedProject = validateLocalProjectV2(rawProject);

  if (Date.parse(updatedProject.updatedAt) < Date.parse(existingProject.updatedAt)) {
    throw new Error(
      `Local project update for ID ${JSON.stringify(existingProject.id)} must not move updatedAt backward from ${JSON.stringify(existingProject.updatedAt)} to ${JSON.stringify(updatedProject.updatedAt)}.`,
    );
  }

  return updatedProject;
}

function createUniqueProjectIdV2(
  projects: readonly LocalProjectV2[],
  createProjectId: () => string,
): string {
  return createUniqueStableIdentifier(
    projects.map((project) => project.id),
    createProjectId,
    assertLocalProjectId,
    "local project ID",
  );
}

function createUniqueMapInstanceId(
  existingMapInstanceIds: readonly string[],
  createMapInstanceId: () => string,
): string {
  return createUniqueStableIdentifier(
    existingMapInstanceIds,
    createMapInstanceId,
    assertLocalMapInstanceId,
    "local map instance ID",
  );
}

function createUniqueStableIdentifier(
  existingIdentifiers: readonly string[],
  createIdentifier: () => string,
  assertIdentifier: (rawIdentifier: unknown) => asserts rawIdentifier is string,
  identifierLabel: string,
): string {
  const existingIdentifierSet = new Set(existingIdentifiers);
  let lastGeneratedIdentifier = "(no generated identifier)";

  for (
    let attemptNumber = 1;
    attemptNumber <= maximumProjectIdGenerationAttempts;
    attemptNumber += 1
  ) {
    const generatedIdentifier = createIdentifier();
    assertIdentifier(generatedIdentifier);
    lastGeneratedIdentifier = generatedIdentifier;

    if (!existingIdentifierSet.has(generatedIdentifier)) {
      return generatedIdentifier;
    }
  }

  throw new Error(
    `Could not generate a unique ${identifierLabel} after ${String(maximumProjectIdGenerationAttempts)} attempts; last generated value was ${JSON.stringify(lastGeneratedIdentifier)}.`,
  );
}

function createLocalProjectV2Summary(
  localProject: LocalProjectV2,
): LocalProjectV2Summary {
  const activeMapInstance = getRequiredMapInstance(
    localProject,
    localProject.activeMapInstanceId,
  );

  return {
    id: localProject.id,
    name: localProject.name,
    createdAt: localProject.createdAt,
    updatedAt: localProject.updatedAt,
    activeMapInstanceId: localProject.activeMapInstanceId,
    activeMapInstanceName: activeMapInstance.name,
    activeBaseMapId: activeMapInstance.baseMapId,
    mapInstanceCount: Object.keys(localProject.mapInstances).length,
  };
}

function validateCreateLocalProjectV2Input(
  rawInput: unknown,
): CreateLocalProjectV2Input {
  const inputRecord = assertPlainInputRecord(rawInput, "Create local project v2 input");
  assertAllowedInputFields(inputRecord, ["name", "initialBaseMapId"], rawInput);
  const name = Object.hasOwn(inputRecord, "name")
    ? normalizeLocalProjectName(inputRecord.name)
    : undefined;
  const initialBaseMapId = Object.hasOwn(inputRecord, "initialBaseMapId")
    ? inputRecord.initialBaseMapId
    : undefined;

  if (initialBaseMapId !== undefined) {
    assertKnownLocalMapId(initialBaseMapId);
  }

  return { name, initialBaseMapId };
}

function validateCreateLocalMapInstanceInput(
  rawInput: unknown,
): CreateLocalMapInstanceInput {
  const inputRecord = assertPlainInputRecord(rawInput, "Create local map instance input");
  assertAllowedInputFields(inputRecord, ["baseMapId", "name"], rawInput);

  if (!Object.hasOwn(inputRecord, "baseMapId")) {
    throw new Error(
      `Create local map instance input is missing required field "baseMapId" in ${describeStorageAdapter(rawInput)}.`,
    );
  }

  assertKnownLocalMapId(inputRecord.baseMapId);
  const name = Object.hasOwn(inputRecord, "name")
    ? normalizeLocalMapInstanceName(inputRecord.name)
    : undefined;

  return { baseMapId: inputRecord.baseMapId, name };
}

function assertPlainInputRecord(
  rawInput: unknown,
  inputLabel: string,
): Record<string, unknown> {
  if (
    rawInput === null ||
    typeof rawInput !== "object" ||
    Array.isArray(rawInput) ||
    (Object.getPrototypeOf(rawInput) !== Object.prototype &&
      Object.getPrototypeOf(rawInput) !== null)
  ) {
    throw new Error(
      `${inputLabel} must be a plain object; received ${describeStorageAdapter(rawInput)}.`,
    );
  }

  return rawInput as Record<string, unknown>;
}

function assertAllowedInputFields(
  inputRecord: Record<string, unknown>,
  allowedFieldNames: readonly string[],
  rawInput: unknown,
): void {
  for (const fieldName of Object.keys(inputRecord)) {
    if (!allowedFieldNames.includes(fieldName)) {
      throw new Error(
        `Unsupported local project input field ${JSON.stringify(fieldName)} in ${describeStorageAdapter(rawInput)}.`,
      );
    }
  }
}

function createNextUntitledProjectNameV2(
  projects: readonly LocalProjectV2[],
): string {
  return createUniqueProjectNameV2("Untitled Project", projects);
}

function createUniqueProjectNameV2(
  initialName: string,
  projects: readonly LocalProjectV2[],
): string {
  return createUniqueName(
    initialName,
    projects.map((project) => project.name),
    maximumLocalProjectNameLength,
  );
}

function createNextCopyProjectNameV2(
  sourceProjectName: string,
  projects: readonly LocalProjectV2[],
): string {
  const copySuffix = " Copy";
  const copyNameStem = sourceProjectName
    .slice(0, maximumLocalProjectNameLength - copySuffix.length)
    .trimEnd();

  return createUniqueProjectNameV2(`${copyNameStem}${copySuffix}`, projects);
}

function createNextMapInstanceName(
  initialName: string,
  mapInstances: Readonly<Record<string, LocalProjectMapInstanceV2>>,
): string {
  return createUniqueName(
    initialName,
    Object.values(mapInstances).map((mapInstance) => mapInstance.name),
    maximumLocalProjectNameLength,
  );
}

function createNextCopyMapInstanceName(
  sourceName: string,
  mapInstances: Readonly<Record<string, LocalProjectMapInstanceV2>>,
): string {
  const copySuffix = " Copy";
  const copyNameStem = sourceName
    .slice(0, maximumLocalProjectNameLength - copySuffix.length)
    .trimEnd();

  return createNextMapInstanceName(`${copyNameStem}${copySuffix}`, mapInstances);
}

function createUniqueName(
  initialName: string,
  existingNames: readonly string[],
  maximumNameLength: number,
): string {
  const normalizedExistingNames = new Set(
    existingNames.map((existingName) => existingName.toLocaleLowerCase("en-US")),
  );

  if (!normalizedExistingNames.has(initialName.toLocaleLowerCase("en-US"))) {
    return initialName;
  }

  for (let duplicateNumber = 2; ; duplicateNumber += 1) {
    const duplicateSuffix = ` ${String(duplicateNumber)}`;
    const candidateName = `${initialName
      .slice(0, maximumNameLength - duplicateSuffix.length)
      .trimEnd()}${duplicateSuffix}`;

    if (!normalizedExistingNames.has(candidateName.toLocaleLowerCase("en-US"))) {
      return candidateName;
    }
  }
}

function getBrowserLocalStorage(): LocalProjectStorageAdapter {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    throw new Error(
      "Browser localStorage is unavailable; createBrowserLocalProjectStore requires a browser storage context.",
    );
  }

  try {
    return window.localStorage;
  } catch (caughtError) {
    throw new Error(
      `Browser localStorage is unavailable while reading window.localStorage: ${describeThrownStorageError(caughtError)}.`,
      { cause: caughtError },
    );
  }
}

function assertStorageAdapter(
  storage: LocalProjectStorageAdapter,
): asserts storage is LocalProjectStorageAdapter {
  if (
    storage === null ||
    typeof storage !== "object" ||
    typeof storage.getItem !== "function" ||
    typeof storage.setItem !== "function" ||
    typeof storage.removeItem !== "function"
  ) {
    throw new Error(
      `Local project storage adapter must expose getItem, setItem, and removeItem; received ${describeStorageAdapter(storage)}.`,
    );
  }
}

function readProjectCollection(
  storage: LocalProjectStorageAdapter,
): StoredLocalProjectCollection {
  let serializedCollection: string | null;

  try {
    serializedCollection = storage.getItem(localProjectStorageKey);
  } catch (caughtError) {
    throw new Error(
      `Cannot read browser local project storage key ${JSON.stringify(localProjectStorageKey)}: ${describeThrownStorageError(caughtError)}.`,
      { cause: caughtError },
    );
  }

  if (serializedCollection === null) {
    return {
      formatVersion: localProjectFormatVersion,
      projects: [],
    };
  }

  if (typeof serializedCollection !== "string") {
    throw new Error(
      `Local project storage getItem returned ${describeStorageAdapter(serializedCollection)} for key ${JSON.stringify(localProjectStorageKey)}; expected string or null.`,
    );
  }

  return parseStoredLocalProjectCollection(serializedCollection);
}

function writeProjectCollection(
  storage: LocalProjectStorageAdapter,
  projectCollection: StoredLocalProjectCollection,
): void {
  const validatedCollection = validateStoredLocalProjectCollection(projectCollection);
  const serializedCollection = JSON.stringify(validatedCollection);

  try {
    if (validatedCollection.projects.length === 0) {
      storage.removeItem(localProjectStorageKey);
      return;
    }

    storage.setItem(localProjectStorageKey, serializedCollection);
  } catch (caughtError) {
    throw new Error(
      `Cannot write browser local project storage key ${JSON.stringify(localProjectStorageKey)} with ${describeStorageAdapter(serializedCollection)}: ${describeThrownStorageError(caughtError)}.`,
      { cause: caughtError },
    );
  }
}

function findExistingProject(
  projects: readonly LocalProject[],
  projectId: string,
): LocalProject {
  assertLocalProjectId(projectId);
  const matchingProject = projects.find(
    (existingProject) => existingProject.id === projectId,
  );

  if (matchingProject === undefined) {
    throw new Error(
      `Local project ID ${JSON.stringify(projectId)} does not exist in browser local storage.`,
    );
  }

  return matchingProject;
}

function createUniqueProjectId(
  projects: readonly LocalProject[],
  createProjectId: () => string,
): string {
  let lastGeneratedProjectId = "(no generated project ID)";

  for (
    let attemptNumber = 1;
    attemptNumber <= maximumProjectIdGenerationAttempts;
    attemptNumber += 1
  ) {
    const generatedProjectId = createProjectId();
    assertLocalProjectId(generatedProjectId);
    lastGeneratedProjectId = generatedProjectId;

    if (
      !projects.some(
        (existingProject) => existingProject.id === generatedProjectId,
      )
    ) {
      return generatedProjectId;
    }
  }

  throw new Error(
    `Could not generate a unique local project ID after ${String(maximumProjectIdGenerationAttempts)} attempts; last generated value was ${JSON.stringify(lastGeneratedProjectId)}.`,
  );
}

function createNextUntitledProjectName(projects: readonly LocalProject[]): string {
  return createUniqueProjectName("Untitled Project", projects);
}

function createNextCopyProjectName(
  sourceProjectName: string,
  projects: readonly LocalProject[],
): string {
  const copySuffix = " Copy";
  const copyNameStem = sourceProjectName
    .slice(0, maximumLocalProjectNameLength - copySuffix.length)
    .trimEnd();

  return createUniqueProjectName(`${copyNameStem}${copySuffix}`, projects);
}

function createUniqueProjectName(
  initialName: string,
  projects: readonly LocalProject[],
): string {
  const existingNormalizedNames = new Set(
    projects.map((project) => project.name.toLocaleLowerCase("en-US")),
  );

  if (!existingNormalizedNames.has(initialName.toLocaleLowerCase("en-US"))) {
    return initialName;
  }

  for (let duplicateNumber = 2; ; duplicateNumber += 1) {
    const duplicateSuffix = ` ${String(duplicateNumber)}`;
    const candidateName = `${initialName
      .slice(0, maximumLocalProjectNameLength - duplicateSuffix.length)
      .trimEnd()}${duplicateSuffix}`;

    if (!existingNormalizedNames.has(candidateName.toLocaleLowerCase("en-US"))) {
      return candidateName;
    }
  }
}

function replaceExistingProject(
  projectCollection: StoredLocalProjectCollection,
  replacementProject: LocalProject,
): StoredLocalProjectCollection {
  let replacementApplied = false;
  const projects = projectCollection.projects.map((existingProject) => {
    if (existingProject.id !== replacementProject.id) {
      return existingProject;
    }

    replacementApplied = true;
    return replacementProject;
  });

  if (!replacementApplied) {
    throw new Error(
      `Cannot replace missing local project ID ${JSON.stringify(replacementProject.id)}.`,
    );
  }

  return {
    formatVersion: localProjectFormatVersion,
    projects,
  };
}

function validateProjectUpdate(
  existingProject: LocalProject,
  rawProject: unknown,
): LocalProject {
  const updatedProject = validateLocalProject(rawProject);

  if (Date.parse(updatedProject.updatedAt) < Date.parse(existingProject.updatedAt)) {
    throw new Error(
      `Local project update for ID ${JSON.stringify(existingProject.id)} must not move updatedAt backward from ${JSON.stringify(existingProject.updatedAt)} to ${JSON.stringify(updatedProject.updatedAt)}.`,
    );
  }

  return updatedProject;
}

function createLocalProjectSummary(project: LocalProject): LocalProjectSummary {
  return {
    id: project.id,
    name: project.name,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    activeMapId: project.activeMapId,
  };
}

function validateCreateLocalProjectInput(
  rawInput: unknown,
): CreateLocalProjectInput {
  if (
    rawInput === null ||
    typeof rawInput !== "object" ||
    Array.isArray(rawInput) ||
    (Object.getPrototypeOf(rawInput) !== Object.prototype &&
      Object.getPrototypeOf(rawInput) !== null)
  ) {
    throw new Error(
      `Create local project input must be a plain object; received ${describeStorageAdapter(rawInput)}.`,
    );
  }

  const inputRecord = rawInput as Record<string, unknown>;
  const allowedFieldNames = new Set(["name", "initialMapId"]);

  for (const fieldName of Object.keys(inputRecord)) {
    if (!allowedFieldNames.has(fieldName)) {
      throw new Error(
        `Unsupported create local project input field ${JSON.stringify(fieldName)} in ${describeStorageAdapter(rawInput)}.`,
      );
    }
  }

  const requestedName = Object.hasOwn(inputRecord, "name")
    ? normalizeLocalProjectName(inputRecord.name)
    : undefined;
  const requestedInitialMapId = Object.hasOwn(inputRecord, "initialMapId")
    ? inputRecord.initialMapId
    : undefined;

  if (requestedInitialMapId !== undefined) {
    assertKnownLocalMapId(requestedInitialMapId);
  }

  return {
    name: requestedName,
    initialMapId: requestedInitialMapId,
  };
}

function createCryptographicProjectId(): string {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new Error(
      "Browser crypto.randomUUID is unavailable; cannot generate a robust local project ID.",
    );
  }

  return `project-${crypto.randomUUID()}`;
}

function createCryptographicMapInstanceId(): string {
  if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
    throw new Error(
      "Browser crypto.randomUUID is unavailable; cannot generate a robust local map instance ID.",
    );
  }

  return `map-${crypto.randomUUID()}`;
}

function getCurrentIsoTimestamp(): string {
  return new Date().toISOString();
}

function describeStorageAdapter(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }

  if (rawValue === undefined) {
    return "undefined";
  }

  if (rawValue === null) {
    return "null";
  }

  if (Array.isArray(rawValue)) {
    return rawValue.length === 0 ? "[]" : `[array length ${String(rawValue.length)}]`;
  }

  if (typeof rawValue === "object") {
    return `[object ${Object.prototype.toString.call(rawValue)}]`;
  }

  return String(rawValue);
}

function describeThrownStorageError(caughtError: unknown): string {
  if (caughtError instanceof Error) {
    return `${caughtError.name}: ${caughtError.message}`;
  }

  return describeStorageAdapter(caughtError);
}
