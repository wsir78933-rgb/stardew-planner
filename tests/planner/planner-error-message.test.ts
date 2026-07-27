import { describe, expect, it } from "vitest";
import { getLocalizedPlannerErrorMessage } from "../../src/planner/planner-error-message";
import { ReferenceProjectMigrationError } from "../../src/projects/reference-local-project-migration";

describe("planner error messages", () => {
  it("localizes the known frozen-project migration error", () => {
    const migrationError = new ReferenceProjectMigrationError("projects[0] is invalid");

    expect(getLocalizedPlannerErrorMessage("zh-CN", migrationError)).toContain(
      "无法迁移",
    );
    expect(getLocalizedPlannerErrorMessage("en", migrationError)).toContain(
      "could not be migrated",
    );
  });

  it("does not hide an unknown error behind a generic planner message", () => {
    expect(getLocalizedPlannerErrorMessage("en", new Error("unexpected"))).toBeNull();
  });
});
