import { describe, expect, it, vi } from "vitest";
import {
  createPlannerRuntimeLoader,
  describePlannerRuntimeLoadFailure,
  resolvePlannerRuntimeKind,
} from "../../src/components/editor-runtime-selector";

describe("editor runtime selector", () => {
  it.each([
    ["", "react"],
    ["?plannerRuntime=react", "react"],
    ["?plannerRuntime=reference", "reference"],
    ["?plannerRuntime=unknown", "react"],
  ] as const)("resolves %s to %s", (plannerRuntimeSearch, expectedRuntimeKind) => {
    expect(resolvePlannerRuntimeKind(plannerRuntimeSearch)).toBe(
      expectedRuntimeKind,
    );
  });

  it.each([
    "?plannerRuntime=react&plannerRuntime=reference",
    "?plannerRuntime=react&plannerRuntime=react",
  ])("rejects repeated planner runtime values in %s", (plannerRuntimeSearch) => {
    expect(() => resolvePlannerRuntimeKind(plannerRuntimeSearch)).toThrow(
      /plannerRuntime.*received.*react/s,
    );
  });

  it("loads exactly the selected runtime branch", async () => {
    const reactRuntimeLoader = vi.fn(async () => () => null);
    const referenceRuntimeLoader = vi.fn(async () => () => null);
    const loadPlannerRuntime = createPlannerRuntimeLoader({
      react: reactRuntimeLoader,
      reference: referenceRuntimeLoader,
    });

    await loadPlannerRuntime("react");

    expect(reactRuntimeLoader).toHaveBeenCalledTimes(1);
    expect(referenceRuntimeLoader).not.toHaveBeenCalled();
  });

  it("reports a runtime import failure with the selected runtime and received error", () => {
    expect(
      describePlannerRuntimeLoadFailure("react", new Error("chunk missing")),
    ).toBe("Could not load react planner runtime: chunk missing");
    expect(
      describePlannerRuntimeLoadFailure("reference", "network unavailable"),
    ).toBe(
      'Could not load reference planner runtime: received non-Error value "network unavailable".',
    );
  });
});
