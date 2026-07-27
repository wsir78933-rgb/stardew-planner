import { describe, expect, it } from "vitest";
import {
  initialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
} from "../../src/planner/planner-workspace-state";

describe("planner workspace state", () => {
  it("selects a known map without mutating the prior state", () => {
    const nextPlannerWorkspaceState = reducePlannerWorkspaceState(
      initialPlannerWorkspaceState,
      { type: "select-map", mapId: "beach" },
    );

    expect(nextPlannerWorkspaceState.selectedMapId).toBe("beach");
    expect(initialPlannerWorkspaceState.selectedMapId).toBe("standard");
    expect(nextPlannerWorkspaceState).not.toBe(initialPlannerWorkspaceState);
  });

  it("rejects an unknown map instead of storing an invalid selection", () => {
    expect(() =>
      reducePlannerWorkspaceState(initialPlannerWorkspaceState, {
        type: "select-map",
        mapId: "unknown",
      }),
    ).toThrow("unknown");
  });
});
