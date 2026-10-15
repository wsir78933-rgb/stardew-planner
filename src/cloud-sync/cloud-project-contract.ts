import {
  parseReferenceProjectDocument,
  validateReferenceProjectDocument,
  type ReferenceLocalProjectDocument,
  type ReferenceStoredProject,
} from "../reference-runtime/local-project-api";

export const CLOUD_PROJECT_DOCUMENT_MAX_BYTES = 1_048_576;
export const CLOUD_PROJECT_DOCUMENT_MAX_JSON_DEPTH = 64;
export const CLOUD_PROJECT_LIST_PAGE_SIZE = 100;

export type CloudProjectSummary = Readonly<{
  id: string;
  title: string;
  revision: number;
  updatedAt: string;
  mapCount: number;
}>;

export type CloudProjectRecord = CloudProjectSummary &
  Readonly<{
    projectDocument: ReferenceLocalProjectDocument;
  }>;

export type CloudProjectListPage = Readonly<{
  projects: CloudProjectSummary[];
  nextCursor: string | null;
}>;

export type CloudProjectContractError = Error &
  Readonly<{ name: "CloudProjectContractError" }>;

export function isCloudProjectContractError(
  error: unknown,
): error is CloudProjectContractError {
  return error instanceof Error && error.name === "CloudProjectContractError";
}

export function prepareCloudProjectDocument(
  serializedSingleProjectDocument: string,
): ReferenceLocalProjectDocument {
  if (typeof serializedSingleProjectDocument !== "string") {
    throw createCloudProjectContractError(
      `Cloud project export must be a string. Received: ${describeReceivedValue(serializedSingleProjectDocument)}.`,
    );
  }

  assertJsonNestingDepth(serializedSingleProjectDocument);
  let rawProjectDocument: unknown;
  try {
    rawProjectDocument = JSON.parse(serializedSingleProjectDocument);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    throw createCloudProjectContractError(
      `Cloud project export contains malformed JSON at ${error.message}. Received ${String(new TextEncoder().encode(serializedSingleProjectDocument).byteLength)} bytes.`,
    );
  }

  const imageFreeProjectDocument = removeRawProjectThumbnailData(
    rawProjectDocument,
  );
  const sanitizedSerializedProjectDocument = JSON.stringify(
    imageFreeProjectDocument,
  );
  if (typeof sanitizedSerializedProjectDocument !== "string") {
    throw createCloudProjectContractError(
      `Cloud project export did not serialize to JSON. Received: ${describeReceivedValue(imageFreeProjectDocument)}.`,
    );
  }

  assertJsonNestingDepth(sanitizedSerializedProjectDocument);
  const validatedProjectDocument = parseReferenceProjectDocumentAtBoundary(
    sanitizedSerializedProjectDocument,
  );
  return createImageFreeCloudProjectDocument(validatedProjectDocument);
}

export function validateCloudProjectDocument(
  rawProjectDocument: unknown,
): ReferenceLocalProjectDocument {
  const imageFreeRawProjectDocument = removeRawProjectThumbnailData(
    rawProjectDocument,
  );
  assertValueNestingDepth(imageFreeRawProjectDocument);
  const validatedProjectDocument = validateReferenceProjectDocumentAtBoundary(
    imageFreeRawProjectDocument,
  );
  return createImageFreeCloudProjectDocument(validatedProjectDocument);
}

export function serializeCloudProjectDocument(
  rawProjectDocument: unknown,
): string {
  return JSON.stringify(validateCloudProjectDocument(rawProjectDocument));
}

function createImageFreeCloudProjectDocument(
  validatedProjectDocument: ReferenceLocalProjectDocument,
): ReferenceLocalProjectDocument {
  if (validatedProjectDocument.projects.length !== 1) {
    throw createCloudProjectContractError(
      `Cloud project document must contain exactly one project. Received: ${String(validatedProjectDocument.projects.length)} projects.`,
    );
  }

  const storedProject = validatedProjectDocument.projects[0];
  if (!storedProject) {
    throw createCloudProjectContractError(
      "Cloud project document unexpectedly has no project after validating a one-project document.",
    );
  }

  const cloudProjectDocument: ReferenceLocalProjectDocument = {
    version: 1,
    projects: [removeProjectThumbnailData(storedProject)],
  };
  const serializedProjectDocument = JSON.stringify(cloudProjectDocument);
  assertJsonNestingDepth(serializedProjectDocument);
  const projectDocumentByteLength = new TextEncoder().encode(
    serializedProjectDocument,
  ).byteLength;

  if (projectDocumentByteLength > CLOUD_PROJECT_DOCUMENT_MAX_BYTES) {
    throw createCloudProjectContractError(
      `Cloud project document is ${String(projectDocumentByteLength)} bytes after removing thumbnails; maximum is ${String(CLOUD_PROJECT_DOCUMENT_MAX_BYTES)} bytes.`,
    );
  }

  return cloudProjectDocument;
}

function parseReferenceProjectDocumentAtBoundary(
  serializedProjectDocument: string,
): ReferenceLocalProjectDocument {
  try {
    return parseReferenceProjectDocument(serializedProjectDocument);
  } catch (error) {
    if (!(error instanceof Error) || error.name !== "Error") {
      throw error;
    }

    throw createCloudProjectContractError(error.message);
  }
}

function validateReferenceProjectDocumentAtBoundary(
  rawProjectDocument: unknown,
): ReferenceLocalProjectDocument {
  try {
    return validateReferenceProjectDocument(rawProjectDocument);
  } catch (error) {
    if (!(error instanceof Error) || error.name !== "Error") {
      throw error;
    }

    throw createCloudProjectContractError(error.message);
  }
}

export function parseCloudProjectDocument(
  serializedProjectDocument: string,
): ReferenceLocalProjectDocument {
  if (typeof serializedProjectDocument !== "string") {
    throw createCloudProjectContractError(
      `Cloud project database JSON must be a string. Received: ${describeReceivedValue(serializedProjectDocument)}.`,
    );
  }

  const serializedByteLength = new TextEncoder().encode(
    serializedProjectDocument,
  ).byteLength;
  if (serializedByteLength > CLOUD_PROJECT_DOCUMENT_MAX_BYTES) {
    throw createCloudProjectContractError(
      `Cloud project database JSON is ${String(serializedByteLength)} bytes; maximum is ${String(CLOUD_PROJECT_DOCUMENT_MAX_BYTES)} bytes.`,
    );
  }

  assertJsonNestingDepth(serializedProjectDocument);
  let rawProjectDocument: unknown;
  try {
    rawProjectDocument = JSON.parse(serializedProjectDocument);
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    throw createCloudProjectContractError(
      `Cloud project database JSON is malformed at ${error.message}. Received ${String(serializedByteLength)} bytes.`,
    );
  }

  assertNoStoredProjectThumbnailData(rawProjectDocument);
  return validateCloudProjectDocument(rawProjectDocument);
}

export function parseCloudProjectSummary(
  rawSummary: unknown,
): CloudProjectSummary {
  const summaryRecord = assertPlainRecord(rawSummary, "Cloud project summary");
  const id = assertCloudProjectId(summaryRecord.id);
  const title = assertCloudProjectTitle(summaryRecord.title);
  const revision = assertPositiveSafeInteger(
    summaryRecord.revision,
    "Cloud project revision",
  );
  const updatedAt = assertTimestamp(summaryRecord.updatedAt);
  const mapCount = assertNonNegativeSafeInteger(
    summaryRecord.mapCount,
    "Cloud project mapCount",
  );

  return { id, title, revision, updatedAt, mapCount };
}

export function parseCloudProjectRecord(
  rawRecord: unknown,
): CloudProjectRecord {
  const record = assertPlainRecord(rawRecord, "Cloud project record");
  const summary = parseCloudProjectSummary(record);
  assertNoStoredProjectThumbnailData(record.projectDocument);
  const projectDocument = validateCloudProjectDocument(
    record.projectDocument,
  );
  const storedProject = projectDocument.projects[0];

  if (!storedProject) {
    throw createCloudProjectContractError(
      "Cloud project record unexpectedly has no project after validation.",
    );
  }

  if (summary.title !== storedProject.title) {
    throw createCloudProjectContractError(
      `Cloud project summary title must match project document title. Received summary title ${describeReceivedValue(summary.title)} and document title ${describeReceivedValue(storedProject.title)}.`,
    );
  }

  const actualMapCount = storedProject.project.maps.length;
  if (summary.mapCount !== actualMapCount) {
    throw createCloudProjectContractError(
      `Cloud project summary mapCount must match project document maps. Received ${String(summary.mapCount)} and ${String(actualMapCount)}.`,
    );
  }

  return { ...summary, projectDocument };
}

export function parseCloudProjectList(rawList: unknown): CloudProjectListPage {
  const listRecord = assertPlainRecord(rawList, "Cloud project list");
  if (!Array.isArray(listRecord.projects)) {
    throw createCloudProjectContractError(
      `Cloud project list projects must be an array. Received: ${describeReceivedValue(listRecord.projects)}.`,
    );
  }
  if (listRecord.projects.length > CLOUD_PROJECT_LIST_PAGE_SIZE) {
    throw createCloudProjectContractError(
      `Cloud project list contains ${String(listRecord.projects.length)} summaries; maximum page size is ${String(CLOUD_PROJECT_LIST_PAGE_SIZE)}.`,
    );
  }

  const projects = listRecord.projects.map(parseCloudProjectSummary);
  for (let projectIndex = 1; projectIndex < projects.length; projectIndex += 1) {
    const previousProject = projects[projectIndex - 1];
    const currentProject = projects[projectIndex];
    if (!previousProject || !currentProject) {
      throw createCloudProjectContractError(
        `Cloud project list has a missing summary at index ${String(projectIndex)}.`,
      );
    }
    if (previousProject.id >= currentProject.id) {
      throw createCloudProjectContractError(
        `Cloud project list IDs must be in ascending order without duplicates. Received ${describeReceivedValue(previousProject.id)} before ${describeReceivedValue(currentProject.id)}.`,
      );
    }
  }

  const nextCursor =
    listRecord.nextCursor === null
      ? null
      : assertCloudProjectId(listRecord.nextCursor);
  if (nextCursor !== null) {
    const lastProject = projects.at(-1);
    if (projects.length !== CLOUD_PROJECT_LIST_PAGE_SIZE || !lastProject) {
      throw createCloudProjectContractError(
        `Cloud project list nextCursor requires exactly ${String(CLOUD_PROJECT_LIST_PAGE_SIZE)} summaries. Received ${String(projects.length)} summaries and cursor ${describeReceivedValue(nextCursor)}.`,
      );
    }
    if (nextCursor !== lastProject.id) {
      throw createCloudProjectContractError(
        `Cloud project list nextCursor must match the last summary id. Received ${describeReceivedValue(nextCursor)} and last id ${describeReceivedValue(lastProject.id)}.`,
      );
    }
  }

  return { projects, nextCursor };
}

export function parseCloudProjectId(rawId: unknown): string {
  return assertCloudProjectId(rawId);
}

function removeProjectThumbnailData(
  storedProject: ReferenceStoredProject,
): ReferenceStoredProject {
  return {
    id: storedProject.id,
    title: storedProject.title,
    created_at: storedProject.created_at,
    updated_at: storedProject.updated_at,
    project: storedProject.project,
  };
}

function removeRawProjectThumbnailData(rawProjectDocument: unknown): unknown {
  if (
    typeof rawProjectDocument !== "object" ||
    rawProjectDocument === null ||
    Array.isArray(rawProjectDocument)
  ) {
    return rawProjectDocument;
  }

  const projectDocument = rawProjectDocument as Record<string, unknown>;
  const rawProjects = projectDocument.projects;
  if (!Array.isArray(rawProjects)) {
    return rawProjectDocument;
  }

  const imageFreeProjects = rawProjects.map((rawStoredProject) => {
    if (
      typeof rawStoredProject !== "object" ||
      rawStoredProject === null ||
      Array.isArray(rawStoredProject)
    ) {
      return rawStoredProject;
    }

    const storedProject = rawStoredProject as Record<string, unknown>;
    const imageFreeStoredProject: Record<string, unknown> = {};
    for (const [propertyName, propertyValue] of Object.entries(storedProject)) {
      if (propertyName !== "thumbnailsByMapId") {
        imageFreeStoredProject[propertyName] = propertyValue;
      }
    }
    return imageFreeStoredProject;
  });

  return { ...projectDocument, projects: imageFreeProjects };
}

function assertNoStoredProjectThumbnailData(rawProjectDocument: unknown): void {
  if (
    typeof rawProjectDocument !== "object" ||
    rawProjectDocument === null ||
    Array.isArray(rawProjectDocument)
  ) {
    return;
  }

  const projectDocument = rawProjectDocument as Record<string, unknown>;
  const projects = projectDocument.projects;
  if (!Array.isArray(projects) || projects.length !== 1) {
    return;
  }

  const storedProject = projects[0];
  if (
    typeof storedProject === "object" &&
    storedProject !== null &&
    !Array.isArray(storedProject) &&
    Object.hasOwn(storedProject, "thumbnailsByMapId")
  ) {
    const thumbnailData = (storedProject as Record<string, unknown>)
      .thumbnailsByMapId;
    throw createCloudProjectContractError(
      `Cloud project record must not include stored thumbnail data. Received thumbnailsByMapId ${describeThumbnailValue(thumbnailData)}.`,
    );
  }
}

function describeThumbnailValue(thumbnailData: unknown): string {
  if (typeof thumbnailData === "string") {
    return `a string with ${String(new TextEncoder().encode(thumbnailData).byteLength)} bytes`;
  }
  if (
    typeof thumbnailData === "object" &&
    thumbnailData !== null &&
    !Array.isArray(thumbnailData)
  ) {
    return `an object with ${String(Object.keys(thumbnailData).length)} entries`;
  }
  if (Array.isArray(thumbnailData)) {
    return `an array with ${String(thumbnailData.length)} entries`;
  }
  return `a value of type ${typeof thumbnailData} (${describeReceivedValue(thumbnailData)})`;
}

function assertCloudProjectId(rawId: unknown): string {
  if (
    typeof rawId !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(rawId)
  ) {
    throw createCloudProjectContractError(
      `Cloud project id must contain 1 to 120 letters, digits, underscores, or hyphens. Received: ${describeReceivedValue(rawId)}.`,
    );
  }

  return rawId;
}

function assertCloudProjectTitle(rawTitle: unknown): string {
  if (
    typeof rawTitle !== "string" ||
    rawTitle.trim().length === 0 ||
    rawTitle.trim().length > 100 ||
    rawTitle !== rawTitle.trim()
  ) {
    throw createCloudProjectContractError(
      `Cloud project title must be a trimmed string containing 1 to 100 characters. Received: ${describeReceivedValue(rawTitle)}.`,
    );
  }

  return rawTitle;
}

function assertPositiveSafeInteger(rawValue: unknown, fieldName: string): number {
  if (!Number.isSafeInteger(rawValue) || typeof rawValue !== "number" || rawValue < 1) {
    throw createCloudProjectContractError(
      `${fieldName} must be a positive safe integer. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function assertNonNegativeSafeInteger(
  rawValue: unknown,
  fieldName: string,
): number {
  if (
    !Number.isSafeInteger(rawValue) ||
    typeof rawValue !== "number" ||
    rawValue < 0
  ) {
    throw createCloudProjectContractError(
      `${fieldName} must be a non-negative safe integer. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function assertTimestamp(rawValue: unknown): string {
  if (typeof rawValue !== "string" || Number.isNaN(Date.parse(rawValue))) {
    throw createCloudProjectContractError(
      `Cloud project updatedAt must be a valid timestamp string. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function assertPlainRecord(rawValue: unknown, fieldName: string): Record<string, unknown> {
  if (
    typeof rawValue !== "object" ||
    rawValue === null ||
    Array.isArray(rawValue) ||
    (Object.getPrototypeOf(rawValue) !== Object.prototype &&
      Object.getPrototypeOf(rawValue) !== null)
  ) {
    throw createCloudProjectContractError(
      `${fieldName} must be a plain object. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }

  return rawValue as Record<string, unknown>;
}

function assertJsonNestingDepth(serializedValue: string): void {
  let nestingDepth = 0;
  let isInsideString = false;
  let nextCharacterIsEscaped = false;

  for (const character of serializedValue) {
    if (isInsideString) {
      if (nextCharacterIsEscaped) {
        nextCharacterIsEscaped = false;
      } else if (character === "\\") {
        nextCharacterIsEscaped = true;
      } else if (character === '"') {
        isInsideString = false;
      }
      continue;
    }

    if (character === '"') {
      isInsideString = true;
    } else if (character === "{" || character === "[") {
      nestingDepth += 1;
      if (nestingDepth > CLOUD_PROJECT_DOCUMENT_MAX_JSON_DEPTH) {
        throw createCloudProjectContractError(
          `Cloud project export JSON nesting exceeds ${String(CLOUD_PROJECT_DOCUMENT_MAX_JSON_DEPTH)} levels. Received depth greater than ${String(CLOUD_PROJECT_DOCUMENT_MAX_JSON_DEPTH)}.`,
        );
      }
    } else if (character === "}" || character === "]") {
      nestingDepth -= 1;
    }
  }
}

function assertValueNestingDepth(rawValue: unknown): void {
  const valueStack: Array<
    | Readonly<{ kind: "value"; value: unknown; depth: number }>
    | Readonly<{ kind: "exit"; value: object }>
  > = [{ kind: "value", value: rawValue, depth: 0 }];
  const activeObjects = new WeakSet<object>();
  let visitedValueCount = 0;

  while (valueStack.length > 0) {
    const nextValue = valueStack.pop();
    if (!nextValue) {
      continue;
    }

    if (nextValue.kind === "exit") {
      activeObjects.delete(nextValue.value);
      continue;
    }

    visitedValueCount += 1;
    if (visitedValueCount > 600_000) {
      throw createCloudProjectContractError(
        "Cloud project document exceeds the bounded 600000-value validation limit. Received at least 600001 values.",
      );
    }

    const nextObject = nextValue.value;
    if (typeof nextObject !== "object" || nextObject === null) {
      continue;
    }

    const nextDepth = nextValue.depth + 1;
    if (nextDepth > CLOUD_PROJECT_DOCUMENT_MAX_JSON_DEPTH) {
      throw createCloudProjectContractError(
        `Cloud project document nesting exceeds ${String(CLOUD_PROJECT_DOCUMENT_MAX_JSON_DEPTH)} levels. Received depth ${String(nextDepth)}.`,
      );
    }
    if (activeObjects.has(nextObject)) {
      throw createCloudProjectContractError(
        `Cloud project document contains a circular reference at depth ${String(nextDepth)}. Received value ${describeReceivedValue(nextObject)}.`,
      );
    }

    activeObjects.add(nextObject);
    valueStack.push({ kind: "exit", value: nextObject });
    if (Array.isArray(nextObject)) {
      for (const arrayValue of nextObject) {
        valueStack.push({ kind: "value", value: arrayValue, depth: nextDepth });
      }
      continue;
    }

    const objectPrototype = Object.getPrototypeOf(nextObject);
    if (objectPrototype !== Object.prototype && objectPrototype !== null) {
      throw createCloudProjectContractError(
        `Cloud project document contains a non-plain object at depth ${String(nextDepth)}. Received: ${describeReceivedValue(nextObject)}.`,
      );
    }

    for (const [propertyName, propertyValue] of Object.entries(nextObject)) {
      if (
        propertyName === "__proto__" ||
        propertyName === "constructor" ||
        propertyName === "prototype"
      ) {
        throw createCloudProjectContractError(
          `Cloud project document contains unsafe property ${describeReceivedValue(propertyName)} at depth ${String(nextDepth)}.`,
        );
      }
      valueStack.push({ kind: "value", value: propertyValue, depth: nextDepth });
    }
  }
}

function describeReceivedValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    const serializedString = JSON.stringify(rawValue);
    if (serializedString.length <= 180) {
      return serializedString;
    }

    return `${serializedString.slice(0, 180)}… (${String(rawValue.length)} characters)`;
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
  } catch (error) {
    if (error instanceof TypeError) {
      return `[unserializable value: ${error.message}]`;
    }
    throw error;
  }
}

function createCloudProjectContractError(
  message: string,
): CloudProjectContractError {
  const error = new Error(message);
  error.name = "CloudProjectContractError";
  return error as CloudProjectContractError;
}
