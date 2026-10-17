import {
  parseCloudProjectDocument,
  parseCloudProjectList,
  parseCloudProjectRecord,
  parseCloudProjectSummary,
  serializeCloudProjectDocument,
  CLOUD_PROJECT_LIST_PAGE_SIZE,
  type CloudProjectListPage,
  type CloudProjectRecord,
  type CloudProjectSummary,
} from "../src/cloud-sync/cloud-project-contract";
import type { ReferenceLocalProjectDocument } from "../src/reference-runtime/local-project-api";

const maximumCloudProjectRevision = Number.MAX_SAFE_INTEGER;

export async function listCloudProjectSummaries(
  database: D1Database,
  userId: string,
  afterCloudProjectId: string | null,
): Promise<CloudProjectListPage> {
  assertUserId(userId);
  if (afterCloudProjectId !== null) {
    assertCloudProjectId(afterCloudProjectId);
  }

  const queryResult =
    afterCloudProjectId === null
      ? await database
          .prepare(
            `SELECT id, title, revision, updated_at, map_count
             FROM cloud_projects
             WHERE user_id = ?
             ORDER BY id ASC
             LIMIT 101`,
          )
          .bind(userId)
          .all<unknown>()
      : await database
          .prepare(
            `SELECT id, title, revision, updated_at, map_count
             FROM cloud_projects
             WHERE user_id = ? AND id > ?
             ORDER BY id ASC
             LIMIT 101`,
          )
          .bind(userId, afterCloudProjectId)
          .all<unknown>();

  if (queryResult.success !== true || !Array.isArray(queryResult.results)) {
    throw new Error(
      `D1 list cloud_projects returned an invalid result envelope. Received success=${String(queryResult.success)} and results=${describeReceivedValue(queryResult.results)}.`,
    );
  }
  if (queryResult.results.length > CLOUD_PROJECT_LIST_PAGE_SIZE + 1) {
    throw new Error(
      `D1 list cloud_projects returned ${String(queryResult.results.length)} rows; query limit is ${String(CLOUD_PROJECT_LIST_PAGE_SIZE + 1)}.`,
    );
  }

  const summaries = queryResult.results
    .slice(0, CLOUD_PROJECT_LIST_PAGE_SIZE)
    .map((rawRow, rowIndex) =>
    parseCloudProjectSummary(createSummaryInputFromDatabaseRow(rawRow, rowIndex)),
  );
  const lastSummary = summaries.at(-1);
  const nextCursor =
    queryResult.results.length > CLOUD_PROJECT_LIST_PAGE_SIZE && lastSummary
      ? lastSummary.id
      : null;

  return parseCloudProjectList({ projects: summaries, nextCursor });
}

export async function getCloudProjectRecord(
  database: D1Database,
  userId: string,
  cloudProjectId: string,
): Promise<CloudProjectRecord | null> {
  assertUserId(userId);
  assertCloudProjectId(cloudProjectId);
  const rawRow = await database
    .prepare(
      `SELECT id, title, revision, updated_at, map_count, project_document_json
       FROM cloud_projects
       WHERE user_id = ? AND id = ?`,
    )
    .bind(userId, cloudProjectId)
    .first<unknown>();

  return rawRow === null ? null : parseCloudProjectDatabaseRow(rawRow);
}

export async function putCloudProjectRecord(
  database: D1Database,
  userId: string,
  cloudProjectId: string,
  expectedRevision: number,
  rawProjectDocument: unknown,
): Promise<CloudProjectRecord | null> {
  assertUserId(userId);
  assertCloudProjectId(cloudProjectId);
  assertExpectedRevision(expectedRevision);

  const serializedProjectDocument = serializeCloudProjectDocument(
    rawProjectDocument,
  );
  const projectDocument = parseCloudProjectDocument(serializedProjectDocument);
  const storedProject = projectDocument.projects[0];
  if (!storedProject) {
    throw new Error(
      "Validated cloud project document unexpectedly has no stored project.",
    );
  }

  const updatedAt = new Date().toISOString();
  const rawRow =
    expectedRevision === 0
      ? await insertCloudProject(
          database,
          userId,
          cloudProjectId,
          storedProject.title,
          storedProject.project.maps.length,
          serializedProjectDocument,
          updatedAt,
        )
      : await updateCloudProject(
          database,
          userId,
          cloudProjectId,
          expectedRevision,
          storedProject.title,
          storedProject.project.maps.length,
          serializedProjectDocument,
          updatedAt,
        );

  return rawRow === null ? null : parseCloudProjectDatabaseRow(rawRow);
}

export async function deleteCloudProjectRecord(
  database: D1Database,
  userId: string,
  cloudProjectId: string,
  expectedRevision: number,
): Promise<boolean> {
  assertUserId(userId);
  assertCloudProjectId(cloudProjectId);
  if (expectedRevision < 1) {
    throw new Error(
      `Cloud project delete revision must be a positive safe integer. Received: ${describeReceivedValue(expectedRevision)}.`,
    );
  }
  assertExpectedRevision(expectedRevision);

  const deletedRow = await database
    .prepare(
      `DELETE FROM cloud_projects
       WHERE user_id = ? AND id = ? AND revision = ?
       RETURNING id AS deleted_id`,
    )
    .bind(userId, cloudProjectId, expectedRevision)
    .first<unknown>();

  if (deletedRow === null) {
    return false;
  }

  const deletedRecord = assertDatabaseRecord(
    deletedRow,
    "D1 cloud_projects delete result",
  );
  const returnedCloudProjectId = assertDatabaseString(
    deletedRecord.deleted_id,
    "deleted_id",
  );
  if (returnedCloudProjectId !== cloudProjectId) {
    throw new Error(
      `D1 cloud_projects delete returned a different id. Received ${describeReceivedValue(returnedCloudProjectId)}; expected ${describeReceivedValue(cloudProjectId)}.`,
    );
  }

  return true;
}

async function insertCloudProject(
  database: D1Database,
  userId: string,
  cloudProjectId: string,
  title: string,
  mapCount: number,
  serializedProjectDocument: string,
  updatedAt: string,
): Promise<unknown | null> {
  return database
    .prepare(
      `INSERT INTO cloud_projects
         (user_id, id, title, revision, updated_at, map_count, project_document_json)
       VALUES (?, ?, ?, 1, ?, ?, ?)
       ON CONFLICT (user_id, id) DO NOTHING
       RETURNING id, title, revision, updated_at, map_count, project_document_json`,
    )
    .bind(
      userId,
      cloudProjectId,
      title,
      updatedAt,
      mapCount,
      serializedProjectDocument,
    )
    .first<unknown>();
}

async function updateCloudProject(
  database: D1Database,
  userId: string,
  cloudProjectId: string,
  expectedRevision: number,
  title: string,
  mapCount: number,
  serializedProjectDocument: string,
  updatedAt: string,
): Promise<unknown | null> {
  return database
    .prepare(
      `UPDATE cloud_projects
       SET title = ?, revision = revision + 1, updated_at = ?,
           map_count = ?, project_document_json = ?
       WHERE user_id = ? AND id = ? AND revision = ?
         AND revision < ?
       RETURNING id, title, revision, updated_at, map_count, project_document_json`,
    )
    .bind(
      title,
      updatedAt,
      mapCount,
      serializedProjectDocument,
      userId,
      cloudProjectId,
      expectedRevision,
      maximumCloudProjectRevision,
    )
    .first<unknown>();
}

function parseCloudProjectDatabaseRow(rawRow: unknown): CloudProjectRecord {
  const databaseRow = assertDatabaseRecord(rawRow, "D1 cloud_projects row");
  const projectDocumentJson = assertDatabaseString(
    databaseRow.project_document_json,
    "project_document_json",
  );
  const projectDocument = parseCloudProjectDocument(projectDocumentJson);

  return parseCloudProjectRecord({
    ...createSummaryInputFromDatabaseRow(rawRow, 0),
    projectDocument,
  });
}

function createSummaryInputFromDatabaseRow(
  rawRow: unknown,
  rowIndex: number,
): Readonly<Record<string, unknown>> {
  const databaseRow = assertDatabaseRecord(
    rawRow,
    `D1 cloud_projects row at index ${String(rowIndex)}`,
  );

  return {
    id: databaseRow.id,
    title: databaseRow.title,
    revision: databaseRow.revision,
    updatedAt: databaseRow.updated_at,
    mapCount: databaseRow.map_count,
  };
}

function assertUserId(userId: unknown): asserts userId is string {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error(
      `Cloud project userId must be a non-empty string from authenticated BetterAuth context. Received: ${describeReceivedValue(userId)}.`,
    );
  }
}

function assertCloudProjectId(cloudProjectId: unknown): asserts cloudProjectId is string {
  if (
    typeof cloudProjectId !== "string" ||
    !/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(cloudProjectId)
  ) {
    throw new Error(
      `Cloud project id must contain 1 to 120 letters, digits, underscores, or hyphens. Received: ${describeReceivedValue(cloudProjectId)}.`,
    );
  }
}

function assertExpectedRevision(expectedRevision: unknown): asserts expectedRevision is number {
  if (
    typeof expectedRevision !== "number" ||
    !Number.isSafeInteger(expectedRevision) ||
    expectedRevision < 0
  ) {
    throw new Error(
      `Cloud project expectedRevision must be a non-negative safe integer. Received: ${describeReceivedValue(expectedRevision)}.`,
    );
  }
}

function assertDatabaseRecord(
  rawValue: unknown,
  fieldName: string,
): Record<string, unknown> {
  if (
    typeof rawValue !== "object" ||
    rawValue === null ||
    Array.isArray(rawValue)
  ) {
    throw new Error(
      `${fieldName} must be a non-null object. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }

  return rawValue as Record<string, unknown>;
}

function assertDatabaseString(rawValue: unknown, fieldName: string): string {
  if (typeof rawValue !== "string") {
    throw new Error(
      `D1 cloud_projects column ${fieldName} must be a string. Received: ${describeReceivedValue(rawValue)}.`,
    );
  }

  return rawValue;
}

function describeReceivedValue(rawValue: unknown): string {
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
  } catch (error) {
    if (error instanceof TypeError) {
      return `[unserializable value: ${error.message}]`;
    }
    throw error;
  }
}
