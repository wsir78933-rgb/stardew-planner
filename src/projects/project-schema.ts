import { getPlannerMapById } from "../maps/map-catalog";

export const localProjectV1FormatVersion = 1 as const;
export const localProjectV2FormatVersion = 2 as const;

// Kept for staged compatibility with the v1 browser store until Task 2.
export const localProjectFormatVersion = localProjectV1FormatVersion;

export const defaultLocalProjectMapId = "standard";
export const maximumLocalProjectNameLength = 80;
export const maximumLocalMapInstanceNameLength = 80;
export const maximumLocalProjectIdLength = 120;

export type JsonSafeValue =
  | null
  | boolean
  | number
  | string
  | readonly JsonSafeValue[]
  | Readonly<{ [propertyName: string]: JsonSafeValue }>;

export type LocalProjectV1 = Readonly<{
  formatVersion: typeof localProjectV1FormatVersion;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeMapId: string;
  maps: Readonly<Record<string, JsonSafeValue>>;
}>;

export type LocalProject = LocalProjectV1;

export type StoredLocalProjectCollectionV1 = Readonly<{
  formatVersion: typeof localProjectV1FormatVersion;
  projects: readonly LocalProjectV1[];
}>;

export type StoredLocalProjectCollection = StoredLocalProjectCollectionV1;

export type LocalProjectMapInstanceV2 = Readonly<{
  baseMapId: string;
  name: string;
  state: JsonSafeValue;
}>;

export type LocalProjectV2 = Readonly<{
  formatVersion: typeof localProjectV2FormatVersion;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeMapInstanceId: string;
  mapInstances: Readonly<Record<string, LocalProjectMapInstanceV2>>;
}>;

export type StoredLocalProjectCollectionV2 = Readonly<{
  formatVersion: typeof localProjectV2FormatVersion;
  projects: readonly LocalProjectV2[];
}>;

const forbiddenJsonPropertyNames = new Set([
  "__proto__",
  "constructor",
  "prototype",
]);

const localProjectFieldNames = [
  "formatVersion",
  "id",
  "name",
  "createdAt",
  "updatedAt",
  "activeMapId",
  "maps",
] as const;

const localProjectCollectionFieldNames = ["formatVersion", "projects"] as const;

const localProjectV2FieldNames = [
  "formatVersion",
  "id",
  "name",
  "createdAt",
  "updatedAt",
  "activeMapInstanceId",
  "mapInstances",
] as const;

const localProjectMapInstanceV2FieldNames = [
  "baseMapId",
  "name",
  "state",
] as const;

export function normalizeLocalProjectName(rawName: unknown): string {
  if (typeof rawName !== "string") {
    throw new Error(
      `Local project name must be a string; received ${describeInvalidValue(rawName)}.`,
    );
  }

  const normalizedName = rawName.trim();

  if (normalizedName.length === 0) {
    throw new Error(
      `Local project name must not be blank; received ${describeInvalidValue(rawName)}.`,
    );
  }

  if (normalizedName.length > maximumLocalProjectNameLength) {
    throw new Error(
      `Local project name exceeds ${String(maximumLocalProjectNameLength)} characters; received ${describeInvalidValue(rawName)}.`,
    );
  }

  return normalizedName;
}

export function normalizeLocalMapInstanceName(rawName: unknown): string {
  if (typeof rawName !== "string") {
    throw new Error(
      `Local map instance name must be a string; received ${describeInvalidValue(rawName)}.`,
    );
  }

  const normalizedName = rawName.trim();

  if (normalizedName.length === 0) {
    throw new Error(
      `Local map instance name must not be blank; received ${describeInvalidValue(rawName)}.`,
    );
  }

  if (normalizedName.length > maximumLocalMapInstanceNameLength) {
    throw new Error(
      `Local map instance name exceeds ${String(maximumLocalMapInstanceNameLength)} characters; received ${describeInvalidValue(rawName)}.`,
    );
  }

  return normalizedName;
}

export function assertLocalProjectId(rawProjectId: unknown): asserts rawProjectId is string {
  assertStableIdentifier(rawProjectId, "Local project ID");
}

export function assertLocalMapId(rawMapId: unknown): asserts rawMapId is string {
  assertStableIdentifier(rawMapId, "Local map ID");
}

export function assertLocalMapInstanceId(
  rawMapInstanceId: unknown,
): asserts rawMapInstanceId is string {
  assertStableIdentifier(rawMapInstanceId, "Local map instance ID");
}

export function assertKnownLocalMapId(
  rawMapId: unknown,
): asserts rawMapId is string {
  assertLocalMapId(rawMapId);
  getPlannerMapById(rawMapId);
}

export function createLocalProject(input: {
  id: unknown;
  name: unknown;
  timestamp: unknown;
  activeMapId: unknown;
  activeMapState: unknown;
}): LocalProject {
  const normalizedName = normalizeLocalProjectName(input.name);
  assertLocalProjectId(input.id);
  assertKnownLocalMapId(input.activeMapId);
  assertCanonicalTimestamp(input.timestamp, "Local project timestamp");

  return validateLocalProject({
    formatVersion: localProjectFormatVersion,
    id: input.id,
    name: normalizedName,
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    activeMapId: input.activeMapId,
    maps: { [input.activeMapId]: input.activeMapState },
  });
}

export function validateLocalProject(rawProject: unknown): LocalProject {
  assertExactFieldNames(rawProject, localProjectFieldNames, "local project");
  const projectRecord = rawProject as Record<string, unknown>;

  if (projectRecord.formatVersion !== localProjectFormatVersion) {
    throw new Error(
      `Unsupported local project formatVersion ${describeInvalidValue(projectRecord.formatVersion)}; expected ${String(localProjectFormatVersion)}.`,
    );
  }

  assertLocalProjectId(projectRecord.id);
  const normalizedName = normalizeLocalProjectName(projectRecord.name);

  if (projectRecord.name !== normalizedName) {
    throw new Error(
      `Local project name must be trimmed before storage; received ${describeInvalidValue(projectRecord.name)}.`,
    );
  }

  assertCanonicalTimestamp(projectRecord.createdAt, "Local project createdAt");
  assertCanonicalTimestamp(projectRecord.updatedAt, "Local project updatedAt");

  if (Date.parse(projectRecord.createdAt) > Date.parse(projectRecord.updatedAt)) {
    throw new Error(
      `Local project createdAt ${describeInvalidValue(projectRecord.createdAt)} must not be later than updatedAt ${describeInvalidValue(projectRecord.updatedAt)}.`,
    );
  }

  assertKnownLocalMapId(projectRecord.activeMapId);
  const clonedMaps = validateMapStateRecord(projectRecord.maps);

  if (!Object.hasOwn(clonedMaps, projectRecord.activeMapId)) {
    throw new Error(
      `Local project activeMapId ${describeInvalidValue(projectRecord.activeMapId)} does not exist in maps ${describeInvalidValue(Object.keys(clonedMaps))}.`,
    );
  }

  return {
    formatVersion: localProjectFormatVersion,
    id: projectRecord.id,
    name: normalizedName,
    createdAt: projectRecord.createdAt,
    updatedAt: projectRecord.updatedAt,
    activeMapId: projectRecord.activeMapId,
    maps: clonedMaps,
  };
}

export function validateLocalProjectV2(rawProject: unknown): LocalProjectV2 {
  assertExactFieldNames(rawProject, localProjectV2FieldNames, "local project");
  const projectRecord = rawProject as Record<string, unknown>;

  if (projectRecord.formatVersion !== localProjectV2FormatVersion) {
    throw new Error(
      `Unsupported local project formatVersion ${describeInvalidValue(projectRecord.formatVersion)}; expected ${String(localProjectV2FormatVersion)}.`,
    );
  }

  assertLocalProjectId(projectRecord.id);
  const normalizedName = normalizeLocalProjectName(projectRecord.name);

  if (projectRecord.name !== normalizedName) {
    throw new Error(
      `Local project name must be trimmed before storage; received ${describeInvalidValue(projectRecord.name)}.`,
    );
  }

  assertCanonicalTimestamp(projectRecord.createdAt, "Local project createdAt");
  assertCanonicalTimestamp(projectRecord.updatedAt, "Local project updatedAt");

  if (Date.parse(projectRecord.createdAt) > Date.parse(projectRecord.updatedAt)) {
    throw new Error(
      `Local project createdAt ${describeInvalidValue(projectRecord.createdAt)} must not be later than updatedAt ${describeInvalidValue(projectRecord.updatedAt)}.`,
    );
  }

  assertLocalMapInstanceId(projectRecord.activeMapInstanceId);
  const clonedMapInstances = validateLocalProjectMapInstanceRecord(
    projectRecord.mapInstances,
  );

  if (!Object.hasOwn(clonedMapInstances, projectRecord.activeMapInstanceId)) {
    throw new Error(
      `Local project activeMapInstanceId ${describeInvalidValue(projectRecord.activeMapInstanceId)} does not exist in mapInstances ${describeInvalidValue(Object.keys(clonedMapInstances))}.`,
    );
  }

  return {
    formatVersion: localProjectV2FormatVersion,
    id: projectRecord.id,
    name: normalizedName,
    createdAt: projectRecord.createdAt,
    updatedAt: projectRecord.updatedAt,
    activeMapInstanceId: projectRecord.activeMapInstanceId,
    mapInstances: clonedMapInstances,
  };
}

export function migrateLocalProjectV1ToV2(rawProject: unknown): LocalProjectV2 {
  const localProjectV1 = validateLocalProject(rawProject);
  const mapInstances: Record<string, LocalProjectMapInstanceV2> = Object.create(
    null,
  ) as Record<string, LocalProjectMapInstanceV2>;

  for (const [baseMapId, state] of Object.entries(localProjectV1.maps)) {
    const mapInstanceId = createLegacyMapInstanceId(baseMapId);
    const plannerMap = getPlannerMapById(baseMapId);

    mapInstances[mapInstanceId] = {
      baseMapId,
      name: plannerMap.displayName,
      state,
    };
  }

  return validateLocalProjectV2({
    formatVersion: localProjectV2FormatVersion,
    id: localProjectV1.id,
    name: localProjectV1.name,
    createdAt: localProjectV1.createdAt,
    updatedAt: localProjectV1.updatedAt,
    activeMapInstanceId: createLegacyMapInstanceId(localProjectV1.activeMapId),
    mapInstances,
  });
}

export function migrateStoredLocalProjectCollectionV1ToV2(
  rawCollection: unknown,
): StoredLocalProjectCollectionV2 {
  const storedCollectionV1 = validateStoredLocalProjectCollection(rawCollection);

  return validateStoredLocalProjectCollectionV2({
    formatVersion: localProjectV2FormatVersion,
    projects: storedCollectionV1.projects.map(migrateLocalProjectV1ToV2),
  });
}

export function validateStoredLocalProjectCollectionV2(
  rawCollection: unknown,
): StoredLocalProjectCollectionV2 {
  assertExactFieldNames(
    rawCollection,
    localProjectCollectionFieldNames,
    "local project collection",
  );
  const collectionRecord = rawCollection as Record<string, unknown>;

  if (collectionRecord.formatVersion !== localProjectV2FormatVersion) {
    throw new Error(
      `Unsupported local project collection formatVersion ${describeInvalidValue(collectionRecord.formatVersion)}; expected ${String(localProjectV2FormatVersion)}.`,
    );
  }

  if (!Array.isArray(collectionRecord.projects)) {
    throw new Error(
      `Local project collection projects must be an array; received ${describeInvalidValue(collectionRecord.projects)}.`,
    );
  }

  const projectIds = new Set<string>();
  const projects = collectionRecord.projects.map((rawProject, projectIndex) => {
    const validatedProject = validateLocalProjectV2(rawProject);

    if (projectIds.has(validatedProject.id)) {
      throw new Error(
        `Local project collection contains duplicate project ID ${describeInvalidValue(validatedProject.id)} at index ${String(projectIndex)}.`,
      );
    }

    projectIds.add(validatedProject.id);
    return validatedProject;
  });

  return {
    formatVersion: localProjectV2FormatVersion,
    projects,
  };
}

export function validateStoredLocalProjectCollection(
  rawCollection: unknown,
): StoredLocalProjectCollection {
  assertExactFieldNames(
    rawCollection,
    localProjectCollectionFieldNames,
    "local project collection",
  );
  const collectionRecord = rawCollection as Record<string, unknown>;

  if (collectionRecord.formatVersion !== localProjectFormatVersion) {
    throw new Error(
      `Unsupported local project collection formatVersion ${describeInvalidValue(collectionRecord.formatVersion)}; expected ${String(localProjectFormatVersion)}.`,
    );
  }

  if (!Array.isArray(collectionRecord.projects)) {
    throw new Error(
      `Local project collection projects must be an array; received ${describeInvalidValue(collectionRecord.projects)}.`,
    );
  }

  const projectIds = new Set<string>();
  const projects = collectionRecord.projects.map((rawProject, projectIndex) => {
    const validatedProject = validateLocalProject(rawProject);

    if (projectIds.has(validatedProject.id)) {
      throw new Error(
        `Local project collection contains duplicate project ID ${describeInvalidValue(validatedProject.id)} at index ${String(projectIndex)}.`,
      );
    }

    projectIds.add(validatedProject.id);
    return validatedProject;
  });

  return {
    formatVersion: localProjectFormatVersion,
    projects,
  };
}

export function parseExportedLocalProject(serializedProject: unknown): LocalProject {
  return validateLocalProject(
    parseSerializedJson(serializedProject, "exported local project"),
  );
}

export function parseExportedLocalProjectV2(
  serializedProject: unknown,
): LocalProjectV2 {
  return validateLocalProjectV2(
    parseSerializedJson(serializedProject, "exported local project"),
  );
}

export function parseStoredLocalProjectCollection(
  serializedCollection: unknown,
): StoredLocalProjectCollection {
  return validateStoredLocalProjectCollection(
    parseSerializedJson(serializedCollection, "stored local project collection"),
  );
}

export function parseStoredLocalProjectCollectionV2(
  serializedCollection: unknown,
): StoredLocalProjectCollectionV2 {
  return validateStoredLocalProjectCollectionV2(
    parseSerializedJson(serializedCollection, "stored local project collection"),
  );
}

export function cloneLocalProject(localProject: LocalProject): LocalProject {
  return validateLocalProject(localProject);
}

export function cloneLocalProjectV2(
  localProject: LocalProjectV2,
): LocalProjectV2 {
  return validateLocalProjectV2(localProject);
}

export function cloneJsonSafeValue(
  rawMapState: unknown,
  location = "map state",
): JsonSafeValue {
  return validateJsonSafeValue(rawMapState, location, new WeakSet<object>());
}

function assertStableIdentifier(
  rawIdentifier: unknown,
  identifierLabel: string,
): asserts rawIdentifier is string {
  if (typeof rawIdentifier !== "string") {
    throw new Error(
      `${identifierLabel} must be a string; received ${describeInvalidValue(rawIdentifier)}.`,
    );
  }

  if (
    rawIdentifier.length === 0 ||
    rawIdentifier.length > maximumLocalProjectIdLength ||
    rawIdentifier !== rawIdentifier.trim() ||
    !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(rawIdentifier)
  ) {
    throw new Error(
      `${identifierLabel} must be a non-empty safe identifier no longer than ${String(maximumLocalProjectIdLength)} characters; received ${describeInvalidValue(rawIdentifier)}.`,
    );
  }
}

function assertCanonicalTimestamp(
  rawTimestamp: unknown,
  timestampLabel: string,
): asserts rawTimestamp is string {
  if (typeof rawTimestamp !== "string") {
    throw new Error(
      `${timestampLabel} must be an ISO timestamp string; received ${describeInvalidValue(rawTimestamp)}.`,
    );
  }

  const timestampMilliseconds = Date.parse(rawTimestamp);

  if (
    Number.isNaN(timestampMilliseconds) ||
    new Date(timestampMilliseconds).toISOString() !== rawTimestamp
  ) {
    throw new Error(
      `${timestampLabel} must be a canonical ISO timestamp; received ${describeInvalidValue(rawTimestamp)}.`,
    );
  }
}

function validateMapStateRecord(
  rawMaps: unknown,
): Readonly<Record<string, JsonSafeValue>> {
  assertPlainRecord(rawMaps, "Local project maps");
  const mapsRecord = rawMaps as Record<string, unknown>;
  const clonedMaps: Record<string, JsonSafeValue> = Object.create(null) as Record<
    string,
    JsonSafeValue
  >;

  for (const [rawMapId, rawMapState] of Object.entries(mapsRecord)) {
    assertKnownLocalMapId(rawMapId);
    clonedMaps[rawMapId] = cloneJsonSafeValue(
      rawMapState,
      `map state for map ID ${describeInvalidValue(rawMapId)}`,
    );
  }

  return clonedMaps;
}

function validateLocalProjectMapInstanceRecord(
  rawMapInstances: unknown,
): Readonly<Record<string, LocalProjectMapInstanceV2>> {
  assertPlainRecord(rawMapInstances, "Local project mapInstances");
  const mapInstancesRecord = rawMapInstances as Record<string, unknown>;
  const mapInstanceEntries = Object.entries(mapInstancesRecord);

  if (mapInstanceEntries.length === 0) {
    throw new Error("Local project mapInstances must contain at least one map instance.");
  }

  const clonedMapInstances: Record<string, LocalProjectMapInstanceV2> =
    Object.create(null) as Record<string, LocalProjectMapInstanceV2>;

  for (const [mapInstanceId, rawMapInstance] of mapInstanceEntries) {
    assertLocalMapInstanceId(mapInstanceId);
    clonedMapInstances[mapInstanceId] = validateLocalProjectMapInstance(
      rawMapInstance,
      mapInstanceId,
    );
  }

  return clonedMapInstances;
}

function validateLocalProjectMapInstance(
  rawMapInstance: unknown,
  mapInstanceId: string,
): LocalProjectMapInstanceV2 {
  assertExactFieldNames(
    rawMapInstance,
    localProjectMapInstanceV2FieldNames,
    `local project map instance ${describeInvalidValue(mapInstanceId)}`,
  );
  const mapInstanceRecord = rawMapInstance as Record<string, unknown>;

  assertKnownLocalMapId(mapInstanceRecord.baseMapId);
  const normalizedName = normalizeLocalMapInstanceName(mapInstanceRecord.name);

  if (mapInstanceRecord.name !== normalizedName) {
    throw new Error(
      `Local map instance name must be trimmed before storage; received ${describeInvalidValue(mapInstanceRecord.name)}.`,
    );
  }

  return {
    baseMapId: mapInstanceRecord.baseMapId,
    name: normalizedName,
    state: cloneJsonSafeValue(
      mapInstanceRecord.state,
      `map instance state for map instance ID ${describeInvalidValue(mapInstanceId)}`,
    ),
  };
}

function createLegacyMapInstanceId(baseMapId: string): string {
  const mapInstanceId = `map-${baseMapId}`;
  assertLocalMapInstanceId(mapInstanceId);
  return mapInstanceId;
}

function validateJsonSafeValue(
  rawValue: unknown,
  location: string,
  ancestors: WeakSet<object>,
): JsonSafeValue {
  if (
    rawValue === null ||
    typeof rawValue === "string" ||
    typeof rawValue === "boolean"
  ) {
    return rawValue;
  }

  if (typeof rawValue === "number") {
    if (!Number.isFinite(rawValue)) {
      throw new Error(
        `${location} must contain only finite JSON numbers; received ${describeInvalidValue(rawValue)}.`,
      );
    }

    return rawValue;
  }

  if (Array.isArray(rawValue)) {
    if (ancestors.has(rawValue)) {
      throw new Error(
        `${location} must not contain a circular array value; received ${describeInvalidValue(rawValue)}.`,
      );
    }

    ancestors.add(rawValue);
    const clonedItems = rawValue.map((item, itemIndex) =>
      validateJsonSafeValue(item, `${location}[${String(itemIndex)}]`, ancestors),
    );
    ancestors.delete(rawValue);
    return clonedItems;
  }

  assertPlainRecord(rawValue, location);

  if (ancestors.has(rawValue)) {
    throw new Error(
      `${location} must not contain a circular object value; received ${describeInvalidValue(rawValue)}.`,
    );
  }

  ancestors.add(rawValue);
  const clonedRecord: Record<string, JsonSafeValue> = Object.create(null) as Record<
    string,
    JsonSafeValue
  >;

  for (const [propertyName, propertyValue] of Object.entries(rawValue)) {
    if (forbiddenJsonPropertyNames.has(propertyName)) {
      throw new Error(
        `${location} contains forbidden JSON property ${describeInvalidValue(propertyName)}.`,
      );
    }

    clonedRecord[propertyName] = validateJsonSafeValue(
      propertyValue,
      `${location}.${propertyName}`,
      ancestors,
    );
  }

  ancestors.delete(rawValue);
  return clonedRecord;
}

function assertExactFieldNames(
  rawValue: unknown,
  allowedFieldNames: readonly string[],
  location: string,
): asserts rawValue is Record<string, unknown> {
  assertPlainRecord(rawValue, location);
  const recordValue = rawValue as Record<string, unknown>;
  const fieldNames = Object.keys(recordValue);

  for (const fieldName of fieldNames) {
    if (!allowedFieldNames.includes(fieldName)) {
      throw new Error(
        `Unsupported ${location} field ${describeInvalidValue(fieldName)} in ${describeInvalidValue(rawValue)}.`,
      );
    }
  }

  for (const requiredFieldName of allowedFieldNames) {
    if (!Object.hasOwn(recordValue, requiredFieldName)) {
      throw new Error(
        `Missing required ${location} field ${describeInvalidValue(requiredFieldName)} in ${describeInvalidValue(rawValue)}.`,
      );
    }
  }
}

function assertPlainRecord(rawValue: unknown, location: string): asserts rawValue is object {
  if (
    rawValue === null ||
    typeof rawValue !== "object" ||
    Array.isArray(rawValue) ||
    (Object.getPrototypeOf(rawValue) !== Object.prototype &&
      Object.getPrototypeOf(rawValue) !== null)
  ) {
    throw new Error(
      `${location} must be a plain JSON object; received ${describeInvalidValue(rawValue)}.`,
    );
  }
}

function parseSerializedJson(
  serializedValue: unknown,
  serializedValueLabel: string,
): unknown {
  if (typeof serializedValue !== "string") {
    throw new Error(
      `${serializedValueLabel} must be a JSON string; received ${describeInvalidValue(serializedValue)}.`,
    );
  }

  try {
    return JSON.parse(serializedValue) as unknown;
  } catch (caughtError) {
    if (caughtError instanceof SyntaxError) {
      throw new Error(
        `Cannot parse ${serializedValueLabel} ${describeInvalidValue(serializedValue)}: ${caughtError.message}`,
      );
    }

    throw caughtError;
  }
}

function describeInvalidValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }

  if (rawValue === undefined) {
    return "undefined";
  }

  if (typeof rawValue === "number" && Number.isNaN(rawValue)) {
    return "NaN";
  }

  if (rawValue === Infinity) {
    return "Infinity";
  }

  if (rawValue === -Infinity) {
    return "-Infinity";
  }

  if (Array.isArray(rawValue)) {
    return rawValue.length === 0 ? "[]" : `[array length ${String(rawValue.length)}]`;
  }

  if (rawValue !== null && typeof rawValue === "object") {
    return `[object ${Object.prototype.toString.call(rawValue)}]`;
  }

  return String(rawValue);
}
