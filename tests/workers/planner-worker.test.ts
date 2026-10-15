import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../workers/planner-auth", async (importOriginal) => {
  const plannerAuthModule =
    await importOriginal<typeof import("../../workers/planner-auth")>();
  return {
    ...plannerAuthModule,
    getPlannerSession: vi.fn<typeof plannerAuthModule.getPlannerSession>(),
  };
});

vi.mock("../../workers/cloud-project-api", async (importOriginal) => {
  const cloudProjectApiModule =
    await importOriginal<typeof import("../../workers/cloud-project-api")>();
  return {
    ...cloudProjectApiModule,
    handleCloudProjectRequest:
      vi.fn<typeof cloudProjectApiModule.handleCloudProjectRequest>(),
  };
});

import { getPlannerSession } from "../../workers/planner-auth";
import { handleCloudProjectRequest } from "../../workers/cloud-project-api";
import plannerWorker, {
  type PlannerWorkerEnvironment,
} from "../../workers/planner-worker";

const authenticatedSessionB = {
  kind: "available" as const,
  userId: "session-account-B",
  user: {
    id: "session-account-B",
    name: "Session Account B",
    email: "account-b@example.com",
    image: null,
  },
};

const cloudProjectRequestCases = [
  {
    method: "GET",
    path: "/api/cloud-projects",
    origin: null,
  },
  {
    method: "PUT",
    path: "/api/cloud-projects/project-1",
    origin: "https://stardewvalleyplanner.art",
  },
  {
    method: "DELETE",
    path: "/api/cloud-projects/project-1",
    origin: "https://stardewvalleyplanner.art",
  },
] as const;

function createCloudProjectRequest(
  requestCase: (typeof cloudProjectRequestCases)[number],
  expectedAccountId?: string,
): Request {
  const requestHeaders = new Headers();
  if (requestCase.origin !== null) {
    requestHeaders.set("origin", requestCase.origin);
  }
  if (expectedAccountId !== undefined) {
    requestHeaders.set("X-Expected-Account-Id", expectedAccountId);
  }

  return new Request(
    `https://stardewvalleyplanner.art${requestCase.path}`,
    { method: requestCase.method, headers: requestHeaders },
  );
}

function createRecordingD1Binding(): Readonly<{
  database: D1Database;
  batch: ReturnType<typeof vi.fn>;
  exec: ReturnType<typeof vi.fn>;
  prepare: ReturnType<typeof vi.fn>;
}> {
  const batch = vi.fn();
  const exec = vi.fn();
  const prepare = vi.fn();
  return {
    database: { batch, exec, prepare } as unknown as D1Database,
    batch,
    exec,
    prepare,
  };
}

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
  beforeEach(() => {
    vi.mocked(getPlannerSession).mockReset();
    vi.mocked(handleCloudProjectRequest).mockReset();
  });

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
    expect(getPlannerSession).not.toHaveBeenCalled();
  });

  it.each(cloudProjectRequestCases)(
    "rejects $method requests when the expected account differs from the signed-in account",
    async (requestCase) => {
      const { database, batch, exec, prepare } = createRecordingD1Binding();
      const environment = createPlannerWorkerEnvironment({ DB: database });
      const request = createCloudProjectRequest(requestCase, "header-account-A");
      vi.mocked(getPlannerSession).mockResolvedValue(authenticatedSessionB);

      const response = await plannerWorker.fetch(request, environment);
      const responseBody = await response.json();

      expect(response.status).toBe(409);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(responseBody).toEqual({
        error: {
          code: "ACCOUNT_CHANGED",
          message:
            'X-Expected-Account-Id value "header-account-A" does not match the authenticated account.',
        },
      });
      expect(handleCloudProjectRequest).not.toHaveBeenCalled();
      expect(batch).not.toHaveBeenCalled();
      expect(exec).not.toHaveBeenCalled();
      expect(prepare).not.toHaveBeenCalled();
    },
  );

  it.each(cloudProjectRequestCases)(
    "requires an expected account ID for $method requests",
    async (requestCase) => {
      const { database, batch, exec, prepare } = createRecordingD1Binding();
      const environment = createPlannerWorkerEnvironment({ DB: database });
      const request = createCloudProjectRequest(requestCase);
      vi.mocked(getPlannerSession).mockResolvedValue(authenticatedSessionB);

      const response = await plannerWorker.fetch(request, environment);
      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(responseBody).toEqual({
        error: {
          code: "EXPECTED_ACCOUNT_REQUIRED",
          message: 'X-Expected-Account-Id value null must identify the active account.',
        },
      });
      expect(handleCloudProjectRequest).not.toHaveBeenCalled();
      expect(batch).not.toHaveBeenCalled();
      expect(exec).not.toHaveBeenCalled();
      expect(prepare).not.toHaveBeenCalled();
    },
  );

  it("returns 401 before checking the expected account when no session exists", async () => {
    const { database } = createRecordingD1Binding();
    const environment = createPlannerWorkerEnvironment({ DB: database });
    vi.mocked(getPlannerSession).mockResolvedValue({
      kind: "available",
      user: null,
      userId: null,
    });

    const response = await plannerWorker.fetch(
      createCloudProjectRequest(cloudProjectRequestCases[0]),
      environment,
    );

    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(handleCloudProjectRequest).not.toHaveBeenCalled();
  });

  it("passes the authenticated session account to the cloud handler when IDs match", async () => {
    const { database, batch, exec, prepare } = createRecordingD1Binding();
    const environment = createPlannerWorkerEnvironment({ DB: database });
    const request = createCloudProjectRequest(
      cloudProjectRequestCases[0],
      "session-account-B",
    );
    vi.mocked(getPlannerSession).mockResolvedValue(authenticatedSessionB);
    vi.mocked(handleCloudProjectRequest).mockResolvedValue(
      Response.json({ ok: true }, { headers: { "cache-control": "public" } }),
    );

    const response = await plannerWorker.fetch(request, environment);

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(handleCloudProjectRequest).toHaveBeenCalledExactlyOnceWith(
      request,
      database,
      "session-account-B",
    );
    expect(batch).not.toHaveBeenCalled();
    expect(exec).not.toHaveBeenCalled();
    expect(prepare).not.toHaveBeenCalled();
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
