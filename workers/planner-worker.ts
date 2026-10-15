import contactWorker, {
  type ContactWorkerEnvironment,
} from "./contact-worker";
import { handleCloudProjectRequest } from "./cloud-project-api";
import {
  getPlannerSession,
  handlePlannerAuthRequest,
  validatePlannerMutationOrigin,
  type PlannerAuthEnvironment,
} from "./planner-auth";

export type PlannerWorkerEnvironment = Env &
  ContactWorkerEnvironment &
  PlannerAuthEnvironment;

const expectedAccountHeaderName = "X-Expected-Account-Id";

function isPlannerAuthRequest(request: Request): boolean {
  return new URL(request.url).pathname.startsWith("/api/auth/");
}

function isCloudProjectRequest(request: Request): boolean {
  const requestPath = new URL(request.url).pathname;
  return (
    requestPath === "/api/cloud-projects" ||
    requestPath.startsWith("/api/cloud-projects/")
  );
}

function createUnauthorizedResponse(): Response {
  return Response.json(
    { message: "Sign in to sync planner projects." },
    { status: 401 },
  );
}

function createCloudProjectErrorResponse(
  status: number,
  code: string,
  message: string,
): Response {
  return Response.json(
    { error: { code, message } },
    { status, headers: { "cache-control": "no-store" } },
  );
}

function createNoStoreResponse(response: Response): Response {
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("cache-control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

function validateExpectedAccountId(
  request: Request,
  authenticatedUserId: string,
): Response | null {
  const expectedAccountId = request.headers.get(expectedAccountHeaderName);
  if (expectedAccountId === null || expectedAccountId.trim().length === 0) {
    return createCloudProjectErrorResponse(
      400,
      "EXPECTED_ACCOUNT_REQUIRED",
      `${expectedAccountHeaderName} value ${JSON.stringify(expectedAccountId)} must identify the active account.`,
    );
  }

  if (expectedAccountId !== authenticatedUserId) {
    return createCloudProjectErrorResponse(
      409,
      "ACCOUNT_CHANGED",
      `${expectedAccountHeaderName} value ${JSON.stringify(expectedAccountId)} does not match the authenticated account.`,
    );
  }

  return null;
}

async function handleAuthenticatedCloudProjectRequest(
  request: Request,
  environment: PlannerWorkerEnvironment,
): Promise<Response> {
  if (request.method === "PUT" || request.method === "DELETE") {
    const originFailureResponse = validatePlannerMutationOrigin(
      request,
      environment,
    );
    if (originFailureResponse !== null) {
      return createNoStoreResponse(originFailureResponse);
    }
  }

  const sessionLookup = await getPlannerSession(request, environment);
  if (sessionLookup.kind === "unavailable") {
    return createNoStoreResponse(sessionLookup.response);
  }
  if (sessionLookup.userId === null) {
    return createNoStoreResponse(createUnauthorizedResponse());
  }

  const accountMismatchResponse = validateExpectedAccountId(
    request,
    sessionLookup.userId,
  );
  if (accountMismatchResponse !== null) {
    return createNoStoreResponse(accountMismatchResponse);
  }

  const cloudProjectResponse = await handleCloudProjectRequest(
    request,
    environment.DB,
    sessionLookup.userId,
  );
  return createNoStoreResponse(cloudProjectResponse);
}

async function handlePlannerWorkerRequest(
  request: Request,
  environment: PlannerWorkerEnvironment,
): Promise<Response> {
  if (isPlannerAuthRequest(request)) {
    return handlePlannerAuthRequest(request, environment);
  }

  if (isCloudProjectRequest(request)) {
    return handleAuthenticatedCloudProjectRequest(request, environment);
  }

  return contactWorker.fetch(request, environment);
}

const plannerWorker = {
  fetch: handlePlannerWorkerRequest,
};

export default plannerWorker;
