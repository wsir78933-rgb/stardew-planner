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
    {
      status: 401,
      headers: { "cache-control": "no-store" },
    },
  );
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
      return originFailureResponse;
    }
  }

  const sessionLookup = await getPlannerSession(request, environment);
  if (sessionLookup.kind === "unavailable") {
    return sessionLookup.response;
  }
  if (sessionLookup.userId === null) {
    return createUnauthorizedResponse();
  }

  return handleCloudProjectRequest(
    request,
    environment.DB,
    sessionLookup.userId,
  );
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
