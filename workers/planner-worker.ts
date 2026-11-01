import contactWorker, {
  type ContactWorkerEnvironment,
} from "./contact-worker";

export type PlannerWorkerEnvironment = Env & ContactWorkerEnvironment;

function isRetiredCloudEndpointRequest(request: Request): boolean {
  const requestPath = new URL(request.url).pathname;
  return (
    requestPath === "/api/auth" ||
    requestPath.startsWith("/api/auth/") ||
    requestPath === "/api/cloud-projects" ||
    requestPath.startsWith("/api/cloud-projects/")
  );
}

function createRetiredCloudEndpointResponse(): Response {
  return new Response(null, {
    status: 404,
    headers: { "cache-control": "no-store" },
  });
}

async function handlePlannerWorkerRequest(
  request: Request,
  environment: PlannerWorkerEnvironment,
): Promise<Response> {
  if (isRetiredCloudEndpointRequest(request)) {
    return createRetiredCloudEndpointResponse();
  }

  return contactWorker.fetch(request, environment);
}

const plannerWorker = {
  fetch: handlePlannerWorkerRequest,
};

export default plannerWorker;
