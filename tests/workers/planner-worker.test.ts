import { describe, expect, it, vi } from "vitest";
import plannerWorker, {
  type PlannerWorkerEnvironment,
} from "../../workers/planner-worker";

const retiredCloudEndpointPaths = [
  "/api/auth",
  "/api/auth/",
  "/api/auth/get-session",
  "/api/cloud-projects",
  "/api/cloud-projects/",
  "/api/cloud-projects/project-1",
] as const;

const retiredCloudEndpointMethods = [
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
] as const;

function createPlannerWorkerEnvironment(
  staticAssetFetch: ReturnType<typeof vi.fn>,
): PlannerWorkerEnvironment {
  return {
    CONTACT_ALLOWED_ORIGIN: "https://stardewvalleyplanner.art",
    CONTACT_EXPECTED_TURNSTILE_HOSTNAME: "stardewvalleyplanner.art",
    CONTACT_FROM_EMAIL: "",
    CONTACT_RECIPIENT_EMAIL: "",
    CONTACT_TURNSTILE_ACTION: "turnstile-spin-v2",
    TURNSTILE_SECRET: "",
    CONTACT_EMAIL: { send: vi.fn() },
    STATIC_ASSETS: { connect: vi.fn(), fetch: staticAssetFetch },
  };
}

describe("planner Worker routing", () => {
  it("returns 404 for retired auth and cloud project paths without reading D1", async () => {
    const staticAssetFetch = vi.fn(async () => new Response("static page"));
    const databaseMethods = {
      batch: vi.fn(),
      exec: vi.fn(),
      prepare: vi.fn(),
    };
    const environment = {
      ...createPlannerWorkerEnvironment(staticAssetFetch),
      DB: databaseMethods,
    } as PlannerWorkerEnvironment;

    for (const retiredCloudEndpointPath of retiredCloudEndpointPaths) {
      for (const retiredCloudEndpointMethod of retiredCloudEndpointMethods) {
        const response = await plannerWorker.fetch(
          new Request(
            `https://stardewvalleyplanner.art${retiredCloudEndpointPath}`,
            { method: retiredCloudEndpointMethod },
          ),
          environment,
        );

        expect(response.status).toBe(404);
        expect(response.headers.get("cache-control")).toBe("no-store");
        expect(await response.text()).toBe("");
      }
    }

    expect(staticAssetFetch).not.toHaveBeenCalled();
    expect(databaseMethods.batch).not.toHaveBeenCalled();
    expect(databaseMethods.exec).not.toHaveBeenCalled();
    expect(databaseMethods.prepare).not.toHaveBeenCalled();
  });

  it("serves static routes through the asset binding", async () => {
    const staticAssetFetch = vi.fn(async () => new Response("static page"));
    const environment = createPlannerWorkerEnvironment(staticAssetFetch);
    const request = new Request("http://localhost:8787/planner/");

    const response = await plannerWorker.fetch(request, environment);

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("static page");
    expect(staticAssetFetch).toHaveBeenCalledExactlyOnceWith(request);
  });

  it("continues to delegate contact and feedback routes to the existing Worker", async () => {
    const staticAssetFetch = vi.fn(async () => new Response("static page"));
    const environment = createPlannerWorkerEnvironment(staticAssetFetch);
    const contactResponse = await plannerWorker.fetch(
      new Request("https://stardewvalleyplanner.art/api/contact", {
        method: "POST",
        headers: {
          origin: "https://stardewvalleyplanner.art",
          "content-type": "application/json",
        },
        body: "{}",
      }),
      environment,
    );
    const feedbackResponse = await plannerWorker.fetch(
      new Request("https://stardewvalleyplanner.art/api/feedback", {
        method: "POST",
        headers: {
          origin: "https://stardewvalleyplanner.art",
          "content-type": "application/json",
        },
        body: "{}",
      }),
      environment,
    );

    expect(contactResponse.status).toBe(500);
    await expect(contactResponse.json()).resolves.toMatchObject({
      message: "Contact delivery is not configured.",
    });
    expect(feedbackResponse.status).toBe(500);
    await expect(feedbackResponse.json()).resolves.toMatchObject({
      message: "Planner feedback delivery is not configured.",
    });
    expect(staticAssetFetch).not.toHaveBeenCalled();
  });
});
