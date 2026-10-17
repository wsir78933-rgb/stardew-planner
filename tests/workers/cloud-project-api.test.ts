import { describe, expect, it } from "vitest";
import {
  CLOUD_PROJECT_DOCUMENT_MAX_BYTES,
  prepareCloudProjectDocument,
} from "../../src/cloud-sync/cloud-project-contract";
import type { ReferenceLocalProjectDocument } from "../../src/reference-runtime/local-project-api";
import { handleCloudProjectRequest } from "../../workers/cloud-project-api";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";

type CloudProjectDbRow = Readonly<{
  id: string;
  title: string;
  revision: number;
  updated_at: string;
  map_count: number;
  project_document_json: string;
  user_id: string;
}>;

type PreparedQueryRecord = {
  query: string;
  values: unknown[];
};

function readRawRows<Row = unknown[]>(
  options?: { columnNames?: false },
): Promise<Row[]>;
function readRawRows<Row = unknown[]>(
  options: { columnNames: true },
): Promise<[string[], ...Row[]]>;
async function readRawRows<Row = unknown[]>(
  options?: { columnNames?: boolean },
): Promise<Row[] | [string[], ...Row[]]> {
  if (options?.columnNames === true) {
    const columnNames: string[] = [];
    const rawRows: Row[] = [];
    return [columnNames, ...rawRows];
  }
  return [];
}

function createRecordingD1Database(): Readonly<{
  database: D1Database;
  rows: Map<string, CloudProjectDbRow>;
  preparedQueries: PreparedQueryRecord[];
}> {
  const rows = new Map<string, CloudProjectDbRow>();
  const preparedQueries: PreparedQueryRecord[] = [];
  const database = {
    prepare(query: string) {
      let boundValues: unknown[] = [];
      const queryRecord: PreparedQueryRecord = { query, values: boundValues };
      preparedQueries.push(queryRecord);

      const statement: D1PreparedStatement = {
        bind(...values: unknown[]): D1PreparedStatement {
          boundValues = values;
          queryRecord.values = values;
          return statement;
        },
        async first<Row = Record<string, unknown>>(): Promise<Row | null> {
          const row = executeFirstQuery(query, boundValues, rows);
          return row === null ? null : (row as Row);
        },
        async all<Row = Record<string, unknown>>(): Promise<D1Result<Row>> {
          const queryResultRows = executeAllQuery(query, boundValues, rows);
          return {
            success: true as const,
            results: queryResultRows as Row[],
            meta: {
              duration: 0,
              size_after: 0,
              rows_read: queryResultRows.length,
              rows_written: 0,
              last_row_id: 0,
              changed_db: false,
              changes: 0,
            },
          };
        },
        async run<Row = Record<string, unknown>>() {
          return {
            success: true as const,
            results: [],
            meta: {
              duration: 0,
              size_after: 0,
              rows_read: 0,
              rows_written: 0,
              last_row_id: 0,
              changed_db: false,
              changes: 0,
            },
          };
        },
        raw: readRawRows,
      };

      return statement;
    },
  };

  return {
    database: database as D1Database,
    rows,
    preparedQueries,
  };
}

function executeAllQuery(
  query: string,
  values: unknown[],
  rows: Map<string, CloudProjectDbRow>,
): CloudProjectDbRow[] {
  if (
    !query.includes("FROM cloud_projects") ||
    !query.includes("WHERE user_id = ?") ||
    !query.includes("ORDER BY id ASC") ||
    !query.includes("LIMIT 101")
  ) {
    throw new Error(`Unexpected D1 all query: ${query}`);
  }
  const userId = assertStringValue(values[0], "list user_id");
  const afterCloudProjectId = query.includes("AND id > ?")
    ? assertStringValue(values[1], "list after id")
    : null;
  return [...rows.values()]
    .filter(
      (row) =>
        row.user_id === userId &&
        (afterCloudProjectId === null || row.id > afterCloudProjectId),
    )
    .sort((firstRow, secondRow) => firstRow.id.localeCompare(secondRow.id))
    .slice(0, 101);
}

function executeFirstQuery(
  query: string,
  values: unknown[],
  rows: Map<string, CloudProjectDbRow>,
): unknown | null {
  if (query.startsWith("SELECT ") && query.includes("WHERE user_id = ? AND id = ?")) {
    const userId = assertStringValue(values[0], "select user_id");
    const cloudProjectId = assertStringValue(values[1], "select id");
    return rows.get(createCloudProjectRowKey(userId, cloudProjectId)) ?? null;
  }

  if (query.startsWith("INSERT INTO cloud_projects")) {
    const userId = assertStringValue(values[0], "insert user_id");
    const cloudProjectId = assertStringValue(values[1], "insert id");
    const rowKey = createCloudProjectRowKey(userId, cloudProjectId);
    if (rows.has(rowKey)) {
      return null;
    }
    const insertedRow: CloudProjectDbRow = {
      user_id: userId,
      id: cloudProjectId,
      title: assertStringValue(values[2], "insert title"),
      revision: 1,
      updated_at: assertStringValue(values[3], "insert updated_at"),
      map_count: assertNumberValue(values[4], "insert map_count"),
      project_document_json: assertStringValue(values[5], "insert project_document_json"),
    };
    rows.set(rowKey, insertedRow);
    return insertedRow;
  }

  if (query.startsWith("UPDATE cloud_projects")) {
    const title = assertStringValue(values[0], "update title");
    const updatedAt = assertStringValue(values[1], "update updated_at");
    const mapCount = assertNumberValue(values[2], "update map_count");
    const serializedProjectDocument = assertStringValue(
      values[3],
      "update project_document_json",
    );
    const userId = assertStringValue(values[4], "update user_id");
    const cloudProjectId = assertStringValue(values[5], "update id");
    const expectedRevision = assertNumberValue(values[6], "update revision");
    const maximumRevision = assertNumberValue(values[7], "update max revision");
    const rowKey = createCloudProjectRowKey(userId, cloudProjectId);
    const existingRow = rows.get(rowKey);
    if (
      !existingRow ||
      existingRow.revision !== expectedRevision ||
      existingRow.revision >= maximumRevision
    ) {
      return null;
    }

    const updatedRow: CloudProjectDbRow = {
      ...existingRow,
      title,
      revision: existingRow.revision + 1,
      updated_at: updatedAt,
      map_count: mapCount,
      project_document_json: serializedProjectDocument,
    };
    rows.set(rowKey, updatedRow);
    return updatedRow;
  }

  if (query.startsWith("DELETE FROM cloud_projects")) {
    const userId = assertStringValue(values[0], "delete user_id");
    const cloudProjectId = assertStringValue(values[1], "delete id");
    const expectedRevision = assertNumberValue(values[2], "delete revision");
    const rowKey = createCloudProjectRowKey(userId, cloudProjectId);
    const existingRow = rows.get(rowKey);
    if (!existingRow || existingRow.revision !== expectedRevision) {
      return null;
    }

    rows.delete(rowKey);
    return { deleted_id: cloudProjectId };
  }

  throw new Error(`Unexpected D1 first query: ${query}`);
}

function createCloudProjectRowKey(userId: string, cloudProjectId: string): string {
  return JSON.stringify([userId, cloudProjectId]);
}

function assertStringValue(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string in the D1 test double. Received ${String(value)}.`);
  }
  return value;
}

function assertNumberValue(value: unknown, fieldName: string): number {
  if (typeof value !== "number") {
    throw new Error(`${fieldName} must be a number in the D1 test double. Received ${String(value)}.`);
  }
  return value;
}

function cloneProjectDocument(): ReferenceLocalProjectDocument {
  return JSON.parse(
    JSON.stringify(referenceProjectDocumentFixture),
  ) as ReferenceLocalProjectDocument;
}

function createCloudProjectDocument(title = "Alpha Farm"): ReferenceLocalProjectDocument {
  const projectDocument = cloneProjectDocument();
  const storedProject = projectDocument.projects[0];
  if (!storedProject) {
    throw new Error("Fixture project at index 0 is missing.");
  }
  storedProject.title = title;
  storedProject.project.projectName = title;
  return prepareCloudProjectDocument(
    JSON.stringify({ version: 1, projects: [storedProject] }),
  );
}

function createPutRequest(
  cloudProjectId: string,
  expectedRevision: number,
  projectDocument = createCloudProjectDocument(),
): Request {
  return new Request(`https://planner.test/api/cloud-projects/${cloudProjectId}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ expectedRevision, projectDocument }),
  });
}

async function parseResponseBody(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

describe("cloud project API", () => {
  it("lists only the authenticated user's cloud project summaries", async () => {
    const testDatabase = createRecordingD1Database();
    testDatabase.rows.set(
      createCloudProjectRowKey("user-a", "cloud-alpha"),
      {
        id: "cloud-alpha",
        title: "Alpha Farm",
        revision: 1,
        updated_at: "2026-08-02T04:00:00.000Z",
        map_count: 2,
        project_document_json: "unused by summary list",
        user_id: "user-a",
      },
    );
    testDatabase.rows.set(
      createCloudProjectRowKey("user-b", "cloud-beta"),
      {
        id: "cloud-beta",
        title: "Beta Cabin",
        revision: 1,
        updated_at: "2026-08-02T05:00:00.000Z",
        map_count: 1,
        project_document_json: "unused by summary list",
        user_id: "user-b",
      },
    );

    const response = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects"),
      testDatabase.database,
      "user-a",
    );
    const responseBody = await parseResponseBody(response);

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      projects: [
        {
          id: "cloud-alpha",
          title: "Alpha Farm",
          revision: 1,
          updatedAt: "2026-08-02T04:00:00.000Z",
          mapCount: 2,
        },
      ],
      nextCursor: null,
    });
    expect(testDatabase.preparedQueries[0]?.query).toContain("WHERE user_id = ?");
    expect(testDatabase.preparedQueries[0]?.values).toEqual(["user-a"]);
    expect(testDatabase.preparedQueries[0]?.query).not.toContain("project_document_json");
  });

  it("bounds cloud project lists to 100 and reads the next page after the last id", async () => {
    const testDatabase = createRecordingD1Database();
    for (let projectIndex = 0; projectIndex < 103; projectIndex += 1) {
      const projectId = `cloud-${String(projectIndex).padStart(3, "0")}`;
      testDatabase.rows.set(createCloudProjectRowKey("user-a", projectId), {
        id: projectId,
        title: `Farm ${String(projectIndex).padStart(3, "0")}`,
        revision: 1,
        updated_at: "2026-08-02T04:00:00.000Z",
        map_count: 1,
        project_document_json: "unused by summary list",
        user_id: "user-a",
      });
    }
    testDatabase.rows.set(createCloudProjectRowKey("user-b", "cloud-000"), {
      id: "cloud-000",
      title: "Other Account Farm",
      revision: 1,
      updated_at: "2026-08-02T04:00:00.000Z",
      map_count: 1,
      project_document_json: "unused by summary list",
      user_id: "user-b",
    });

    const firstPageResponse = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects"),
      testDatabase.database,
      "user-a",
    );
    const firstPageBody = (await parseResponseBody(firstPageResponse)) as {
      projects: Array<{ id: string }>;
      nextCursor: string | null;
    };
    const secondPageResponse = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects?after=cloud-099"),
      testDatabase.database,
      "user-a",
    );
    const secondPageBody = (await parseResponseBody(secondPageResponse)) as {
      projects: Array<{ id: string }>;
      nextCursor: string | null;
    };

    expect(firstPageResponse.status).toBe(200);
    expect(firstPageBody.projects).toHaveLength(100);
    expect(firstPageBody.projects[0]?.id).toBe("cloud-000");
    expect(firstPageBody.projects.at(-1)?.id).toBe("cloud-099");
    expect(firstPageBody.nextCursor).toBe("cloud-099");
    expect(secondPageResponse.status).toBe(200);
    expect(secondPageBody.projects.map((project) => project.id)).toEqual([
      "cloud-100",
      "cloud-101",
      "cloud-102",
    ]);
    expect(secondPageBody.nextCursor).toBeNull();
    expect(testDatabase.preparedQueries[0]?.values).toEqual(["user-a"]);
    expect(testDatabase.preparedQueries[1]?.values).toEqual(["user-a", "cloud-099"]);
  });

  it("rejects malformed and unexpected cloud list cursors", async () => {
    const testDatabase = createRecordingD1Database();
    const malformedCursorResponse = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects?after=bad%20cursor"),
      testDatabase.database,
      "user-a",
    );
    const unexpectedQueryResponse = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects?after=cloud-id&other=value"),
      testDatabase.database,
      "user-a",
    );
    const malformedCursorBody = (await parseResponseBody(malformedCursorResponse)) as {
      error: { code: string; message: string };
    };
    const unexpectedQueryBody = (await parseResponseBody(unexpectedQueryResponse)) as {
      error: { code: string; message: string };
    };

    expect(malformedCursorResponse.status).toBe(400);
    expect(malformedCursorBody.error.code).toBe("INVALID_CURSOR");
    expect(malformedCursorBody.error.message).toContain("bad cursor");
    expect(unexpectedQueryResponse.status).toBe(400);
    expect(unexpectedQueryBody.error.code).toBe("INVALID_CURSOR");
    expect(testDatabase.preparedQueries).toHaveLength(0);
  });

  it("creates image-free projects and permits a cloud id different from the local id", async () => {
    const testDatabase = createRecordingD1Database();
    const response = await handleCloudProjectRequest(
      createPutRequest("cloud-share-id", 0),
      testDatabase.database,
      "user-a",
    );
    const responseBody = await parseResponseBody(response);
    const cloudRecord = responseBody as {
      id: string;
      revision: number;
      mapCount: number;
      projectDocument: ReferenceLocalProjectDocument;
    };
    const storedRow = testDatabase.rows.get(
      createCloudProjectRowKey("user-a", "cloud-share-id"),
    );

    expect(response.status).toBe(200);
    expect(cloudRecord.id).toBe("cloud-share-id");
    expect(cloudRecord.revision).toBe(1);
    expect(cloudRecord.mapCount).toBe(2);
    expect(cloudRecord.projectDocument.projects[0]?.id).toBe("project-alpha");
    expect(cloudRecord.projectDocument.projects[0] && "thumbnailsByMapId" in cloudRecord.projectDocument.projects[0]).toBe(false);
    expect(storedRow?.project_document_json).not.toContain("thumbnailsByMapId");
    expect(testDatabase.preparedQueries[0]?.query).toContain("ON CONFLICT (user_id, id) DO NOTHING");
  });

  it("updates with revision compare-and-swap and preserves data on conflict", async () => {
    const testDatabase = createRecordingD1Database();
    const createResponse = await handleCloudProjectRequest(
      createPutRequest("cloud-alpha", 0),
      testDatabase.database,
      "user-a",
    );
    expect(createResponse.status).toBe(200);

    const updateResponse = await handleCloudProjectRequest(
      createPutRequest("cloud-alpha", 1, createCloudProjectDocument("Renamed Farm")),
      testDatabase.database,
      "user-a",
    );
    const updatedCloudRecord = (await parseResponseBody(updateResponse)) as {
      title: string;
      revision: number;
    };
    expect(updateResponse.status).toBe(200);
    expect(updatedCloudRecord).toMatchObject({ title: "Renamed Farm", revision: 2 });

    const staleUpdateResponse = await handleCloudProjectRequest(
      createPutRequest("cloud-alpha", 1, createCloudProjectDocument("Lost Update")),
      testDatabase.database,
      "user-a",
    );
    const staleUpdateBody = (await parseResponseBody(staleUpdateResponse)) as {
      error: { code: string; message: string };
    };
    const storedRow = testDatabase.rows.get(createCloudProjectRowKey("user-a", "cloud-alpha"));

    expect(staleUpdateResponse.status).toBe(409);
    expect(staleUpdateBody.error.code).toBe("REVISION_CONFLICT");
    expect(staleUpdateBody.error.message).toContain("expected revision 1");
    expect(storedRow).toMatchObject({ title: "Renamed Farm", revision: 2 });
    expect(testDatabase.preparedQueries[2]?.query).toContain("WHERE user_id = ? AND id = ? AND revision = ?");
  });

  it("does not reveal another account's project and allows the same id per owner", async () => {
    const testDatabase = createRecordingD1Database();
    const createdResponse = await handleCloudProjectRequest(
      createPutRequest("shared-id", 0),
      testDatabase.database,
      "user-a",
    );
    expect(createdResponse.status).toBe(200);

    const hiddenResponse = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects/shared-id"),
      testDatabase.database,
      "user-b",
    );
    const hiddenBody = (await parseResponseBody(hiddenResponse)) as {
      error: { code: string };
    };
    const userBCreateResponse = await handleCloudProjectRequest(
      createPutRequest("shared-id", 0, createCloudProjectDocument("User B Farm")),
      testDatabase.database,
      "user-b",
    );

    expect(hiddenResponse.status).toBe(404);
    expect(hiddenBody.error.code).toBe("PROJECT_NOT_FOUND");
    expect(userBCreateResponse.status).toBe(200);
    expect(testDatabase.rows.has(createCloudProjectRowKey("user-a", "shared-id"))).toBe(true);
    expect(testDatabase.rows.has(createCloudProjectRowKey("user-b", "shared-id"))).toBe(true);
  });

  it("deletes only the expected revision for the authenticated owner", async () => {
    const testDatabase = createRecordingD1Database();
    await handleCloudProjectRequest(
      createPutRequest("cloud-delete", 0),
      testDatabase.database,
      "user-a",
    );

    const staleDeleteResponse = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects/cloud-delete?revision=2", {
        method: "DELETE",
      }),
      testDatabase.database,
      "user-a",
    );
    expect(staleDeleteResponse.status).toBe(409);
    expect(testDatabase.rows.has(createCloudProjectRowKey("user-a", "cloud-delete"))).toBe(true);

    const deleteResponse = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects/cloud-delete?revision=1", {
        method: "DELETE",
      }),
      testDatabase.database,
      "user-a",
    );
    expect(deleteResponse.status).toBe(200);
    expect(await parseResponseBody(deleteResponse)).toEqual({ deleted: true });
    expect(testDatabase.rows.has(createCloudProjectRowKey("user-a", "cloud-delete"))).toBe(false);
  });

  it("accepts zero-byte DELETE streams and rejects streams with request bytes", async () => {
    const testDatabase = createRecordingD1Database();
    await handleCloudProjectRequest(
      createPutRequest("cloud-empty-stream", 0),
      testDatabase.database,
      "user-a",
    );
    await handleCloudProjectRequest(
      createPutRequest("cloud-non-empty-stream", 0),
      testDatabase.database,
      "user-a",
    );

    const emptyRequestBody = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.close();
      },
    });
    const emptyStreamDeleteResponse = await handleCloudProjectRequest(
      new Request(
        "https://planner.test/api/cloud-projects/cloud-empty-stream?revision=1",
        {
          method: "DELETE",
          body: emptyRequestBody,
          duplex: "half",
        } as RequestInit & { duplex: "half" },
      ),
      testDatabase.database,
      "user-a",
    );
    const nonEmptyStreamDeleteResponse = await handleCloudProjectRequest(
      new Request(
        "https://planner.test/api/cloud-projects/cloud-non-empty-stream?revision=1",
        { method: "DELETE", body: "non-empty" },
      ),
      testDatabase.database,
      "user-a",
    );
    const nonEmptyStreamBody = (await parseResponseBody(nonEmptyStreamDeleteResponse)) as {
      error: { code: string; message: string };
    };

    expect(emptyStreamDeleteResponse.status).toBe(200);
    expect(testDatabase.rows.has(createCloudProjectRowKey("user-a", "cloud-empty-stream"))).toBe(false);
    expect(nonEmptyStreamDeleteResponse.status).toBe(400);
    expect(nonEmptyStreamBody.error.code).toBe("UNEXPECTED_REQUEST_BODY");
    expect(nonEmptyStreamBody.error.message).toContain("Received at least 9 bytes");
    expect(testDatabase.rows.has(createCloudProjectRowKey("user-a", "cloud-non-empty-stream"))).toBe(true);
  });

  it("returns the same error envelope for invalid and over-limit request bodies", async () => {
    const testDatabase = createRecordingD1Database();
    const invalidRevisionResponse = await handleCloudProjectRequest(
      createPutRequest("cloud-invalid", -1),
      testDatabase.database,
      "user-a",
    );
    const invalidRevisionBody = (await parseResponseBody(invalidRevisionResponse)) as {
      error: { code: string; message: string };
    };
    const oversizedRequestBody = "x".repeat(CLOUD_PROJECT_DOCUMENT_MAX_BYTES + 16_385);
    const oversizedResponse = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects/cloud-large", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: oversizedRequestBody,
      }),
      testDatabase.database,
      "user-a",
    );
    const oversizedBody = (await parseResponseBody(oversizedResponse)) as {
      error: { code: string; message: string };
    };

    expect(invalidRevisionResponse.status).toBe(400);
    expect(invalidRevisionBody.error.code).toBe("INVALID_REQUEST_BODY");
    expect(invalidRevisionBody.error.message).toContain("Received -1");
    expect(oversizedResponse.status).toBe(413);
    expect(oversizedBody.error.code).toBe("REQUEST_BODY_TOO_LARGE");
    expect(oversizedBody.error.message).toContain("maximum is 1064960 bytes");
    expect(testDatabase.rows.size).toBe(0);
  });

  it("rejects corrupted D1 row types and malformed D1 JSON without returning them", async () => {
    const testDatabase = createRecordingD1Database();
    testDatabase.rows.set(createCloudProjectRowKey("user-a", "bad-row"), {
      id: "bad-row",
      title: "Alpha Farm",
      revision: 1,
      updated_at: "2026-08-02T04:00:00.000Z",
      map_count: 2,
      project_document_json: "not-json",
      user_id: "user-a",
    });

    const response = await handleCloudProjectRequest(
      new Request("https://planner.test/api/cloud-projects/bad-row"),
      testDatabase.database,
      "user-a",
    );
    const responseBody = (await parseResponseBody(response)) as {
      error: { code: string; message: string };
    };

    expect(response.status).toBe(500);
    expect(responseBody.error.code).toBe("INVALID_DATABASE_RECORD");
    expect(responseBody.error.message).toContain("Cloud project database JSON is malformed");
  });
});
