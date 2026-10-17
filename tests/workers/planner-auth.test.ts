import { describe, expect, it } from "vitest";
import {
  handlePlannerAuthRequest,
  validatePlannerMutationOrigin,
  type PlannerAuthEnvironment,
} from "../../workers/planner-auth";

describe("planner authentication boundary", () => {
  it("returns a clear no-store 503 when the Google auth configuration is missing", async () => {
    const response = await handlePlannerAuthRequest(
      new Request("http://localhost:8787/api/auth/get-session"),
      {},
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.json()).resolves.toMatchObject({
      message: expect.stringContaining("BETTER_AUTH_SECRET"),
    });
  });

  it("does not expose Better Auth session listing endpoints", async () => {
    const response = await handlePlannerAuthRequest(
      new Request("http://localhost:8787/api/auth/list-sessions"),
      {},
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("rejects missing and non-allowlisted Origins on mutations", async () => {
    const environment: PlannerAuthEnvironment = {
      AUTH_ALLOWED_ORIGINS: "https://planner.example",
    };
    const missingOriginResponse = validatePlannerMutationOrigin(
      new Request("https://planner.example/api/cloud-projects/project-1", {
        method: "PUT",
      }),
      environment,
    );
    const hostileOriginResponse = validatePlannerMutationOrigin(
      new Request("https://planner.example/api/cloud-projects/project-1", {
        method: "DELETE",
        headers: { origin: "https://attacker.example" },
      }),
      environment,
    );

    expect(missingOriginResponse?.status).toBe(403);
    expect(hostileOriginResponse?.status).toBe(403);
    await expect(hostileOriginResponse?.json()).resolves.toMatchObject({
      message: expect.stringContaining("https://attacker.example"),
    });
  });

  it("allows only an exact configured origin", () => {
    const originResponse = validatePlannerMutationOrigin(
      new Request("https://planner.example/api/cloud-projects/project-1", {
        method: "PUT",
        headers: { origin: "https://planner.example" },
      }),
      { AUTH_ALLOWED_ORIGINS: "https://planner.example" },
    );

    expect(originResponse).toBeNull();
  });
});
