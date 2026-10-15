import {
  parseCloudProjectList,
  parseCloudProjectRecord,
  validateCloudProjectDocument,
  type CloudProjectRecord,
  type CloudProjectSummary,
} from "./cloud-project-contract";

export class CloudProjectRequestError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(code: string, statusCode: number, message: string) {
    super(message);
    this.name = "CloudProjectRequestError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export type CloudProjectPage = Readonly<{
  projects: readonly CloudProjectSummary[];
  nextCursor: string | null;
}>;

export async function getCloudProjects(
  signal?: AbortSignal,
  afterCloudProjectId?: string,
): Promise<CloudProjectPage> {
  const validatedCursor =
    afterCloudProjectId === undefined
      ? undefined
      : requireCloudProjectId(afterCloudProjectId);
  const requestUrl =
    validatedCursor === undefined
      ? "/api/cloud-projects"
      : `/api/cloud-projects?after=${encodeURIComponent(validatedCursor)}`;
  const rawList = await requestCloudApi(requestUrl, {
    method: "GET",
    signal,
  });
  return parseCloudProjectList(rawList);
}

export async function getCloudProject(
  cloudProjectId: string,
  signal?: AbortSignal,
): Promise<CloudProjectRecord> {
  const validatedCloudProjectId = requireCloudProjectId(cloudProjectId);
  const rawRecord = await requestCloudApi(
    `/api/cloud-projects/${encodeURIComponent(validatedCloudProjectId)}`,
    { method: "GET", signal },
  );
  const record = parseCloudProjectRecord(rawRecord);
  assertCloudProjectResponseId(record, validatedCloudProjectId);
  return record;
}

export async function putCloudProject(
  cloudProjectId: string,
  requestBody: Readonly<{
    expectedRevision: number;
    projectDocument: unknown;
  }>,
  signal?: AbortSignal,
): Promise<CloudProjectRecord> {
  const validatedCloudProjectId = requireCloudProjectId(cloudProjectId);
  const expectedRevision = requireExpectedRevision(requestBody.expectedRevision);
  const projectDocument = validateCloudProjectDocument(
    requestBody.projectDocument,
  );
  const rawRecord = await requestCloudApi(
    `/api/cloud-projects/${encodeURIComponent(validatedCloudProjectId)}`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ expectedRevision, projectDocument }),
      signal,
    },
  );
  const record = parseCloudProjectRecord(rawRecord);
  assertCloudProjectResponseId(record, validatedCloudProjectId);
  return record;
}

export async function deleteCloudProject(
  cloudProjectId: string,
  expectedRevision: number,
  signal?: AbortSignal,
): Promise<void> {
  const validatedCloudProjectId = requireCloudProjectId(cloudProjectId);
  const revision = requirePositiveRevision(expectedRevision);
  await requestCloudApi(
    `/api/cloud-projects/${encodeURIComponent(validatedCloudProjectId)}?revision=${String(revision)}`,
    { method: "DELETE", signal },
  );
}

async function requestCloudApi(
  requestUrl: string,
  requestInit: RequestInit,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(requestUrl, {
      ...requestInit,
      credentials: "same-origin",
      headers: {
        accept: "application/json",
        ...requestInit.headers,
      },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new CloudProjectRequestError(
        "NETWORK_ERROR",
        0,
        `Cloud project request to ${requestUrl} failed: ${error.message}`,
      );
    }
    throw error;
  }

  const responseText = await response.text();
  const rawResponse = parseResponseJson(responseText, requestUrl, response);
  if (!response.ok) {
    throw parseCloudApiError(rawResponse, requestUrl, response);
  }
  if (response.status === 204 && responseText.length === 0) {
    return null;
  }
  return rawResponse;
}

function parseResponseJson(
  responseText: string,
  requestUrl: string,
  response: Response,
): unknown {
  if (response.status === 204 && responseText.length === 0) {
    return null;
  }
  try {
    return JSON.parse(responseText) as unknown;
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    throw new CloudProjectRequestError(
      "INVALID_RESPONSE",
      response.status,
      `Cloud project request to ${requestUrl} returned invalid JSON for HTTP ${String(response.status)}: ${error.message}.`,
    );
  }
}

function parseCloudApiError(
  rawResponse: unknown,
  requestUrl: string,
  response: Response,
): CloudProjectRequestError {
  if (
    typeof rawResponse !== "object" ||
    rawResponse === null ||
    Array.isArray(rawResponse)
  ) {
    return new CloudProjectRequestError(
      "INVALID_ERROR_RESPONSE",
      response.status,
      `Cloud project request to ${requestUrl} returned HTTP ${String(response.status)} ${response.statusText} with a non-object error body: ${describeValue(rawResponse)}.`,
    );
  }

  const errorEnvelope = (rawResponse as Record<string, unknown>).error;
  if (
    typeof errorEnvelope !== "object" ||
    errorEnvelope === null ||
    Array.isArray(errorEnvelope)
  ) {
    return new CloudProjectRequestError(
      "INVALID_ERROR_RESPONSE",
      response.status,
      `Cloud project request to ${requestUrl} returned HTTP ${String(response.status)} without an error object. Received: ${describeValue(errorEnvelope)}.`,
    );
  }

  const code = (errorEnvelope as Record<string, unknown>).code;
  const message = (errorEnvelope as Record<string, unknown>).message;
  if (typeof code !== "string" || code.length === 0) {
    return new CloudProjectRequestError(
      "INVALID_ERROR_RESPONSE",
      response.status,
      `Cloud project request to ${requestUrl} returned an empty or invalid error code: ${describeValue(code)}.`,
    );
  }
  if (typeof message !== "string" || message.length === 0) {
    return new CloudProjectRequestError(
      code,
      response.status,
      `Cloud project request to ${requestUrl} returned error ${code} without a valid message: ${describeValue(message)}.`,
    );
  }
  return new CloudProjectRequestError(code, response.status, message);
}

function requireCloudProjectId(cloudProjectId: string): string {
  if (typeof cloudProjectId !== "string" || cloudProjectId.length === 0) {
    throw new CloudProjectRequestError(
      "INVALID_PROJECT_ID",
      0,
      `Cloud project ID must be a non-empty string. Received: ${describeValue(cloudProjectId)}.`,
    );
  }
  return cloudProjectId;
}

function requireExpectedRevision(expectedRevision: number): number {
  if (
    !Number.isSafeInteger(expectedRevision) ||
    expectedRevision < 0
  ) {
    throw new CloudProjectRequestError(
      "INVALID_REVISION",
      0,
      `Cloud project expectedRevision must be a non-negative safe integer. Received: ${describeValue(expectedRevision)}.`,
    );
  }
  return expectedRevision;
}

function requirePositiveRevision(revision: number): number {
  if (!Number.isSafeInteger(revision) || revision < 1) {
    throw new CloudProjectRequestError(
      "INVALID_REVISION",
      0,
      `Cloud project revision must be a positive safe integer. Received: ${describeValue(revision)}.`,
    );
  }
  return revision;
}

function assertCloudProjectResponseId(
  record: CloudProjectRecord,
  requestedCloudProjectId: string,
): void {
  if (record.id !== requestedCloudProjectId) {
    throw new CloudProjectRequestError(
      "INVALID_RESPONSE",
      200,
      `Cloud project response ID ${describeValue(record.id)} does not match requested ID ${describeValue(requestedCloudProjectId)}.`,
    );
  }
}

function describeValue(rawValue: unknown): string {
  if (typeof rawValue === "string") {
    return JSON.stringify(rawValue);
  }
  if (rawValue === undefined) {
    return "undefined";
  }
  const serializedValue = JSON.stringify(rawValue);
  return serializedValue ?? String(rawValue);
}
