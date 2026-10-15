import {
  CLOUD_PROJECT_DOCUMENT_MAX_BYTES,
  isCloudProjectContractError,
  parseCloudProjectId,
  validateCloudProjectDocument,
} from "../src/cloud-sync/cloud-project-contract";
import {
  deleteCloudProjectRecord,
  getCloudProjectRecord,
  listCloudProjectSummaries,
  putCloudProjectRecord,
} from "./cloud-project-repository";

const maximumCloudProjectRequestBytes = CLOUD_PROJECT_DOCUMENT_MAX_BYTES + 16_384;
const supportedCloudProjectMethods = new Set(["GET", "PUT", "DELETE"]);

type CloudProjectApiError = Error &
  Readonly<{
    name: "CloudProjectApiError";
    status: number;
    code: string;
  }>;

type CloudProjectRoute = Readonly<
  | { kind: "collection" }
  | { kind: "record"; cloudProjectId: string }
>;

type PutCloudProjectBody = Readonly<{
  expectedRevision: number;
  projectDocument: unknown;
}>;

export async function handleCloudProjectRequest(
  request: Request,
  database: D1Database,
  userId: string,
): Promise<Response> {
  try {
    assertAuthenticatedUserId(userId);
    const requestUrl = new URL(request.url);
    const route = parseCloudProjectRoute(requestUrl.pathname);
    return await dispatchCloudProjectRequest(request, requestUrl, route, database, userId);
  } catch (error) {
    if (isCloudProjectApiError(error)) {
      return createCloudProjectErrorResponse(error.status, error.code, error.message);
    }
    throw error;
  }
}

async function dispatchCloudProjectRequest(
  request: Request,
  requestUrl: URL,
  route: CloudProjectRoute | null,
  database: D1Database,
  userId: string,
): Promise<Response> {
  if (route === null) {
    throw createCloudProjectApiError(
      404,
      "ROUTE_NOT_FOUND",
      `Cloud project route does not exist. Received path ${JSON.stringify(requestUrl.pathname)}.`,
    );
  }

  if (!supportedCloudProjectMethods.has(request.method)) {
    throw createCloudProjectApiError(
      405,
      "METHOD_NOT_ALLOWED",
      `Cloud project route does not support method ${JSON.stringify(request.method)}.`,
    );
  }

  if (route.kind === "collection") {
    if (request.method !== "GET") {
      throw createCloudProjectApiError(
        405,
        "METHOD_NOT_ALLOWED",
        `Cloud project collection does not support method ${JSON.stringify(request.method)}.`,
      );
    }

    return await listCloudProjects(request, requestUrl, database, userId);
  }

  if (request.method === "GET") {
    return await readCloudProject(request, database, userId, route.cloudProjectId);
  }
  if (request.method === "PUT") {
    return await saveCloudProject(request, database, userId, route.cloudProjectId);
  }
  return await removeCloudProject(
    request,
    requestUrl,
    database,
    userId,
    route.cloudProjectId,
  );
}

async function listCloudProjects(
  request: Request,
  requestUrl: URL,
  database: D1Database,
  userId: string,
): Promise<Response> {
  assertEmptyRequestBody(request);
  const afterCloudProjectId = parseCloudProjectAfter(requestUrl);
  const projectPage = await runCloudProjectDatabaseOperation(() =>
    listCloudProjectSummaries(database, userId, afterCloudProjectId),
  );
  return createCloudProjectSuccessResponse(projectPage);
}

async function readCloudProject(
  request: Request,
  database: D1Database,
  userId: string,
  cloudProjectId: string,
): Promise<Response> {
  assertEmptyRequestBody(request);
  const cloudProject = await runCloudProjectDatabaseOperation(() =>
    getCloudProjectRecord(database, userId, cloudProjectId),
  );
  if (cloudProject === null) {
    throw createCloudProjectApiError(
      404,
      "PROJECT_NOT_FOUND",
      `Cloud project ${JSON.stringify(cloudProjectId)} does not exist for the authenticated account.`,
    );
  }

  return createCloudProjectSuccessResponse(cloudProject);
}

async function saveCloudProject(
  request: Request,
  database: D1Database,
  userId: string,
  cloudProjectId: string,
): Promise<Response> {
  const serializedRequestBody = await readBoundedJsonRequestBody(request);
  const rawRequestBody = parseJsonRequestBody(serializedRequestBody);
  const putCloudProjectBody = parsePutCloudProjectBody(rawRequestBody);
  const projectDocument = validateIncomingCloudProjectDocument(
    putCloudProjectBody.projectDocument,
  );
  const savedCloudProject = await runCloudProjectDatabaseOperation(() =>
    putCloudProjectRecord(
      database,
      userId,
      cloudProjectId,
      putCloudProjectBody.expectedRevision,
      projectDocument,
    ),
  );
  if (savedCloudProject === null) {
    throw createCloudProjectApiError(
      409,
      "REVISION_CONFLICT",
      `Cloud project ${JSON.stringify(cloudProjectId)} did not match expected revision ${String(putCloudProjectBody.expectedRevision)}. No cloud data was overwritten.`,
    );
  }

  return createCloudProjectSuccessResponse(savedCloudProject);
}

async function removeCloudProject(
  request: Request,
  requestUrl: URL,
  database: D1Database,
  userId: string,
  cloudProjectId: string,
): Promise<Response> {
  assertEmptyRequestBody(request);
  const expectedRevision = parseDeleteRevision(requestUrl);
  const wasDeleted = await runCloudProjectDatabaseOperation(() =>
    deleteCloudProjectRecord(database, userId, cloudProjectId, expectedRevision),
  );
  if (!wasDeleted) {
    throw createCloudProjectApiError(
      409,
      "REVISION_CONFLICT",
      `Cloud project ${JSON.stringify(cloudProjectId)} did not match delete revision ${String(expectedRevision)}. No cloud data was deleted.`,
    );
  }

  return createCloudProjectSuccessResponse({ deleted: true });
}

function parseCloudProjectAfter(requestUrl: URL): string | null {
  const queryEntries = [...requestUrl.searchParams.entries()];
  if (queryEntries.length === 0) {
    return null;
  }

  const afterEntry = queryEntries[0];
  if (
    queryEntries.length !== 1 ||
    !afterEntry ||
    afterEntry[0] !== "after"
  ) {
    throw createCloudProjectApiError(
      400,
      "INVALID_CURSOR",
      `Cloud project list accepts only one after cursor query parameter. Received ${JSON.stringify(queryEntries)}.`,
    );
  }

  try {
    return parseCloudProjectId(afterEntry[1]);
  } catch (error) {
    if (!isCloudProjectContractError(error)) {
      throw error;
    }

    throw createCloudProjectApiError(
      400,
      "INVALID_CURSOR",
      `Cloud project list after cursor is invalid: ${error.message}`,
    );
  }
}

function parseCloudProjectRoute(pathname: string): CloudProjectRoute | null {
  if (pathname === "/api/cloud-projects") {
    return { kind: "collection" };
  }

  const recordPathMatch = /^\/api\/cloud-projects\/([^/]+)$/.exec(pathname);
  if (!recordPathMatch) {
    return null;
  }

  const encodedCloudProjectId = recordPathMatch[1];
  if (encodedCloudProjectId === undefined) {
    throw createCloudProjectApiError(
      400,
      "INVALID_PROJECT_ID",
      `Cloud project route is missing its id. Received path ${JSON.stringify(pathname)}.`,
    );
  }

  let cloudProjectId: string;
  try {
    cloudProjectId = decodeURIComponent(encodedCloudProjectId);
  } catch (error) {
    if (!(error instanceof URIError)) {
      throw error;
    }

    throw createCloudProjectApiError(
      400,
      "INVALID_PROJECT_ID",
      `Cloud project id contains malformed URL encoding. Received segment ${JSON.stringify(encodedCloudProjectId)}.`,
    );
  }

  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$/.test(cloudProjectId)) {
    throw createCloudProjectApiError(
      400,
      "INVALID_PROJECT_ID",
      `Cloud project id must contain 1 to 120 letters, digits, underscores, or hyphens. Received ${JSON.stringify(cloudProjectId)}.`,
    );
  }

  return { kind: "record", cloudProjectId };
}

function parsePutCloudProjectBody(rawValue: unknown): PutCloudProjectBody {
  const requestBody = assertPlainRecord(rawValue, "Cloud project PUT body");
  const requestBodyKeys = Object.keys(requestBody);
  const unknownBodyKeys = requestBodyKeys.filter(
    (key) => key !== "expectedRevision" && key !== "projectDocument",
  );
  if (unknownBodyKeys.length > 0) {
    const unknownBodyKey = unknownBodyKeys[0];
    throw createCloudProjectApiError(
      400,
      "INVALID_REQUEST_BODY",
      `Cloud project PUT body contains unexpected field ${JSON.stringify(unknownBodyKey)}.`,
    );
  }

  if (!Object.hasOwn(requestBody, "expectedRevision")) {
    throw createCloudProjectApiError(
      400,
      "INVALID_REQUEST_BODY",
      "Cloud project PUT body is missing expectedRevision. Received: undefined.",
    );
  }
  const expectedRevision = requestBody.expectedRevision;
  if (
    typeof expectedRevision !== "number" ||
    !Number.isSafeInteger(expectedRevision) ||
    expectedRevision < 0
  ) {
    throw createCloudProjectApiError(
      400,
      "INVALID_REQUEST_BODY",
      `Cloud project expectedRevision must be a non-negative safe integer. Received ${describeReceivedValue(expectedRevision)}.`,
    );
  }

  if (!Object.hasOwn(requestBody, "projectDocument")) {
    throw createCloudProjectApiError(
      400,
      "INVALID_REQUEST_BODY",
      "Cloud project PUT body is missing projectDocument. Received: undefined.",
    );
  }

  return {
    expectedRevision,
    projectDocument: requestBody.projectDocument,
  };
}

function validateIncomingCloudProjectDocument(
  rawProjectDocument: unknown,
): ReturnType<typeof validateCloudProjectDocument> {
  try {
    return validateCloudProjectDocument(rawProjectDocument);
  } catch (error) {
    if (!isCloudProjectContractError(error)) {
      throw error;
    }

    throw createCloudProjectApiError(
      400,
      "INVALID_PROJECT_DOCUMENT",
      error.message,
    );
  }
}

async function readBoundedJsonRequestBody(request: Request): Promise<string> {
  assertJsonContentType(request);
  assertDeclaredRequestBodySize(request);

  if (!request.body) {
    throw createCloudProjectApiError(
      400,
      "INVALID_REQUEST_BODY",
      "Cloud project PUT body is missing. Received 0 bytes.",
    );
  }

  const requestBodyReader = request.body.getReader();
  const requestBodyChunks: Uint8Array[] = [];
  let receivedByteLength = 0;

  try {
    while (true) {
      const readResult = await requestBodyReader.read();
      if (readResult.done) {
        break;
      }

      receivedByteLength += readResult.value.byteLength;
      if (receivedByteLength > maximumCloudProjectRequestBytes) {
        await requestBodyReader.cancel();
        throw createCloudProjectApiError(
          413,
          "REQUEST_BODY_TOO_LARGE",
          `Cloud project PUT body is ${String(receivedByteLength)} bytes; maximum is ${String(maximumCloudProjectRequestBytes)} bytes.`,
        );
      }
      requestBodyChunks.push(readResult.value);
    }
  } finally {
    requestBodyReader.releaseLock();
  }

  const requestBodyBytes = new Uint8Array(receivedByteLength);
  let requestBodyWriteOffset = 0;
  for (const requestBodyChunk of requestBodyChunks) {
    requestBodyBytes.set(requestBodyChunk, requestBodyWriteOffset);
    requestBodyWriteOffset += requestBodyChunk.byteLength;
  }

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(requestBodyBytes);
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }

    throw createCloudProjectApiError(
      400,
      "INVALID_REQUEST_ENCODING",
      `Cloud project PUT body is not valid UTF-8. Received ${String(receivedByteLength)} bytes.`,
    );
  }
}

function assertJsonContentType(request: Request): void {
  const contentType = request.headers.get("content-type");
  const mediaType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    throw createCloudProjectApiError(
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      `Cloud project PUT requires application/json. Received ${describeReceivedValue(contentType)}.`,
    );
  }
}

function assertDeclaredRequestBodySize(request: Request): void {
  const contentLength = request.headers.get("content-length");
  if (contentLength === null) {
    return;
  }
  if (!/^(0|[1-9][0-9]*)$/.test(contentLength)) {
    throw createCloudProjectApiError(
      400,
      "INVALID_CONTENT_LENGTH",
      `Cloud project content-length must be a non-negative decimal integer. Received ${JSON.stringify(contentLength)}.`,
    );
  }

  const declaredByteLength = Number(contentLength);
  if (!Number.isSafeInteger(declaredByteLength)) {
    throw createCloudProjectApiError(
      400,
      "INVALID_CONTENT_LENGTH",
      `Cloud project content-length exceeds the safe integer range. Received ${JSON.stringify(contentLength)}.`,
    );
  }
  if (declaredByteLength > maximumCloudProjectRequestBytes) {
    throw createCloudProjectApiError(
      413,
      "REQUEST_BODY_TOO_LARGE",
      `Cloud project PUT body declares ${String(declaredByteLength)} bytes; maximum is ${String(maximumCloudProjectRequestBytes)} bytes.`,
    );
  }
}

function parseJsonRequestBody(serializedRequestBody: string): unknown {
  try {
    return JSON.parse(serializedRequestBody) as unknown;
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    throw createCloudProjectApiError(
      400,
      "INVALID_JSON",
      `Cloud project PUT body contains malformed JSON at ${error.message}. Received ${String(new TextEncoder().encode(serializedRequestBody).byteLength)} bytes.`,
    );
  }
}

function parseDeleteRevision(requestUrl: URL): number {
  const queryEntries = [...requestUrl.searchParams.entries()];
  const revisionValues = requestUrl.searchParams.getAll("revision");
  if (
    revisionValues.length !== 1 ||
    queryEntries.length !== 1 ||
    queryEntries[0]?.[0] !== "revision"
  ) {
    throw createCloudProjectApiError(
      400,
      "INVALID_REVISION",
      `Cloud project DELETE requires exactly one revision query parameter and no other parameters. Received ${JSON.stringify(queryEntries)}.`,
    );
  }

  const rawRevision = revisionValues[0];
  if (!rawRevision || !/^[1-9][0-9]*$/.test(rawRevision)) {
    throw createCloudProjectApiError(
      400,
      "INVALID_REVISION",
      `Cloud project DELETE revision must be a positive decimal integer. Received ${describeReceivedValue(rawRevision)}.`,
    );
  }

  const expectedRevision = Number(rawRevision);
  if (!Number.isSafeInteger(expectedRevision)) {
    throw createCloudProjectApiError(
      400,
      "INVALID_REVISION",
      `Cloud project DELETE revision exceeds the safe integer range. Received ${JSON.stringify(rawRevision)}.`,
    );
  }

  return expectedRevision;
}

function assertEmptyRequestBody(request: Request): void {
  if (request.body !== null) {
    throw createCloudProjectApiError(
      400,
      "UNEXPECTED_REQUEST_BODY",
      `Cloud project ${request.method} request must not include a body. Received a request stream.`,
    );
  }
}

function assertAuthenticatedUserId(userId: unknown): asserts userId is string {
  if (typeof userId !== "string" || userId.length === 0) {
    throw createCloudProjectApiError(
      401,
      "AUTHENTICATION_REQUIRED",
      `Cloud project access requires an authenticated BetterAuth user id. Received ${describeReceivedValue(userId)}.`,
    );
  }
}

function assertPlainRecord(rawValue: unknown, fieldName: string): Record<string, unknown> {
  if (
    typeof rawValue !== "object" ||
    rawValue === null ||
    Array.isArray(rawValue) ||
    (Object.getPrototypeOf(rawValue) !== Object.prototype &&
      Object.getPrototypeOf(rawValue) !== null)
  ) {
    throw createCloudProjectApiError(
      400,
      "INVALID_REQUEST_BODY",
      `${fieldName} must be a plain object. Received ${describeReceivedValue(rawValue)}.`,
    );
  }

  return rawValue as Record<string, unknown>;
}

async function runCloudProjectDatabaseOperation<Value>(
  databaseOperation: () => Promise<Value>,
): Promise<Value> {
  try {
    return await databaseOperation();
  } catch (error) {
    if (isCloudProjectContractError(error)) {
      throw createCloudProjectApiError(
        500,
        "INVALID_DATABASE_RECORD",
        `D1 returned invalid cloud project data: ${error.message}`,
      );
    }
    if (error instanceof Error) {
      throw createCloudProjectApiError(
        500,
        "DATABASE_OPERATION_FAILED",
        `D1 cloud project operation failed: ${error.message}`,
      );
    }
    throw error;
  }
}

function createCloudProjectSuccessResponse(body: unknown): Response {
  return Response.json(body, {
    headers: { "cache-control": "no-store" },
  });
}

function createCloudProjectErrorResponse(
  status: number,
  code: string,
  message: string,
): Response {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: { "cache-control": "no-store" },
    },
  );
}

function createCloudProjectApiError(
  status: number,
  code: string,
  message: string,
): CloudProjectApiError {
  const error = new Error(message);
  error.name = "CloudProjectApiError";
  return Object.assign(error, { status, code }) as CloudProjectApiError;
}

function isCloudProjectApiError(error: unknown): error is CloudProjectApiError {
  return (
    error instanceof Error &&
    error.name === "CloudProjectApiError" &&
    typeof (error as CloudProjectApiError).status === "number" &&
    typeof (error as CloudProjectApiError).code === "string"
  );
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
