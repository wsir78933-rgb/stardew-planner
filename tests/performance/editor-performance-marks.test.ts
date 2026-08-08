import { describe, expect, it, vi } from "vitest";
import {
  EDITOR_PERFORMANCE_MARK_RESPONSIBILITIES,
  EDITOR_PERFORMANCE_MARKS,
  createEditorPerformanceMarker,
} from "../../src/performance/editor-performance-marks";

const approvedMarkNames = [
  "editor:island-mounted",
  "editor:project-state-ready",
  "editor:pixi-module-ready",
  "editor:default-map-fetched",
  "editor:default-map-parsed",
  "editor:required-textures-ready",
  "editor:canvas-mounted",
  "editor:interactive",
] as const;

function createRecordedPerformanceApi(): {
  mark: (markName: string) => void;
  markedNames: string[];
} {
  const markedNames: string[] = [];

  return {
    mark(markName) {
      markedNames.push(markName);
    },
    markedNames,
  };
}

describe("editor performance marks", () => {
  it("records the approved marks in dependency order", () => {
    const recordedPerformanceApi = createRecordedPerformanceApi();
    const marker = createEditorPerformanceMarker(recordedPerformanceApi);

    for (const approvedMarkName of approvedMarkNames) {
      marker.mark(approvedMarkName);
    }

    expect(EDITOR_PERFORMANCE_MARKS).toEqual(approvedMarkNames);
    expect(recordedPerformanceApi.markedNames).toEqual(approvedMarkNames);
  });

  it("assigns each mark to the approved runtime owner", () => {
    expect(EDITOR_PERFORMANCE_MARK_RESPONSIBILITIES).toEqual({
      "editor:island-mounted": "ReactPlannerHost",
      "editor:project-state-ready": "planner resource coordinator",
      "editor:pixi-module-ready": "planner resource coordinator",
      "editor:default-map-fetched": "planner resource coordinator",
      "editor:default-map-parsed": "planner resource coordinator",
      "editor:required-textures-ready": "PlannerCanvas",
      "editor:canvas-mounted": "PlannerCanvas",
      "editor:interactive": "PlannerCanvas",
    });
  });

  it.each([
    ["editor:project-state-ready", ["editor:island-mounted"]],
    ["editor:pixi-module-ready", ["editor:island-mounted"]],
    ["editor:default-map-fetched", ["editor:island-mounted"]],
    ["editor:default-map-parsed", ["editor:default-map-fetched"]],
    [
      "editor:required-textures-ready",
      ["editor:pixi-module-ready", "editor:default-map-parsed"],
    ],
    [
      "editor:canvas-mounted",
      ["editor:project-state-ready", "editor:required-textures-ready"],
    ],
    ["editor:interactive", ["editor:canvas-mounted"]],
  ] as const)(
    "rejects %s until every direct predecessor is marked",
    (attemptedMarkName, missingPredecessors) => {
      const marker = createEditorPerformanceMarker();

      expect(() => marker.mark(attemptedMarkName)).toThrow(
        new RegExp(
          `${attemptedMarkName}.*${missingPredecessors.join(".*")}`,
        "s",
      ),
      );
    },
  );

  it("reports every missing direct predecessor in a single failure", () => {
    const marker = createEditorPerformanceMarker(null);
    marker.mark("editor:island-mounted");

    expect(() => marker.mark("editor:required-textures-ready")).toThrow(
      /editor:required-textures-ready.*editor:pixi-module-ready.*editor:default-map-parsed/s,
    );
  });

  it("suppresses duplicate marks before writing to the browser Performance API", () => {
    const recordedPerformanceApi = createRecordedPerformanceApi();
    const marker = createEditorPerformanceMarker(recordedPerformanceApi);

    marker.mark("editor:island-mounted");
    marker.mark("editor:island-mounted");

    expect(recordedPerformanceApi.markedNames).toEqual([
      "editor:island-mounted",
    ]);
  });

  it("keeps strict ordering when the browser Performance API is unavailable", () => {
    const marker = createEditorPerformanceMarker(null);

    for (const approvedMarkName of approvedMarkNames) {
      expect(() => marker.mark(approvedMarkName)).not.toThrow();
    }

    const strictMarker = createEditorPerformanceMarker(null);

    expect(() => strictMarker.mark("editor:interactive")).toThrow(
      /editor:interactive.*editor:canvas-mounted/s,
    );
  });

  it("does not write User Timing during Node rendering while preserving marker ordering", () => {
    expect(typeof window).toBe("undefined");

    const browserPerformanceMarkSpy = vi.spyOn(globalThis.performance, "mark");

    try {
      const marker = createEditorPerformanceMarker();

      marker.mark("editor:island-mounted");
      expect(browserPerformanceMarkSpy).not.toHaveBeenCalled();
      expect(() => marker.mark("editor:project-state-ready")).not.toThrow();
    } finally {
      browserPerformanceMarkSpy.mockRestore();
    }
  });

  it("does not accept a mark when the browser Performance API rejects it", () => {
    const marker = createEditorPerformanceMarker({
      mark(markName) {
        if (markName === "editor:island-mounted") {
          throw new Error("Performance mark write failed.");
        }
      },
    });

    expect(() => marker.mark("editor:island-mounted")).toThrow(
      "Performance mark write failed.",
    );
    expect(() => marker.mark("editor:project-state-ready")).toThrow(
      /editor:project-state-ready.*editor:island-mounted/s,
    );
  });
});
