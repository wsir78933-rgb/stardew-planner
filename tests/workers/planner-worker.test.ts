import { describe, expect, it, vi } from "vitest";
import plannerWorker, {
  type PlannerWorkerEnvironment,
} from "../../workers/planner-worker";

function createPlannerWorkerEnvironment(
  overrides: Partial<PlannerWorkerEnvironment> = {},
): PlannerWorkerEnvironment {
  return {
    AUTH_ALLOWED_ORIGINS: "https://stardewvalleyplanner.art",
    CONTACT_ALLOWED_ORIGIN: "https://stardewvalleyplanner.art",
    STATIC_ASSETS: {
      fetch: vi.fn(async () => new Response("static page", { status: 200 })),
    },
    ...overrides,
  } as PlannerWorkerEnvironment;
}

describe("planner Worker routing", () => {
  it("keeps local static routes available without authentication configuration", async () => {
    const environment = createPlannerWorkerEnvironment();
    const response = await plannerWorker.fetch(
      new Request("http://localhost:8787/planner/"),
      environment,
    );

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("static page");
  });

  it("requires an exact Origin before a cloud project mutation", async () => {
    const environment = createPlannerWorkerEnvironment();
    const response = await plannerWorker.fetch(
      new Request("http://localhost:8787/api/cloud-projects/project-1", {
        method: "PUT",
        headers: { origin: "https://attacker.example" },
      }),
      environment,
    );
    const missingOriginResponse = await plannerWorker.fetch(
      new Request("http://localhost:8787/api/cloud-projects/project-1", {
        method: "DELETE",
      }),
      environment,
    );

    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(missingOriginResponse.status).toBe(403);
    expect(missingOriginResponse.headers.get("cache-control")).toBe("no-store");
  });

  it("continues to delegate contact and feedback routes to the existing Worker", async () => {
    const environment = createPlannerWorkerEnvironment();
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
  });
});
