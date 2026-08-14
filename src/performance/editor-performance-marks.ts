export const EDITOR_PERFORMANCE_MARKS = [
  "editor:island-mounted",
  "editor:workspace-module-ready",
  "editor:buildings-dataset-ready",
  "editor:project-state-ready",
  "editor:pixi-module-ready",
  "editor:default-map-fetched",
  "editor:default-map-parsed",
  "editor:pixi-application-ready",
  "editor:initial-textures-started",
  "editor:required-textures-ready",
  "editor:map-container-started",
  "editor:map-container-ready",
  "editor:canvas-mounted",
  "editor:interactive",
] as const;

export type EditorPerformanceMarkName =
  (typeof EDITOR_PERFORMANCE_MARKS)[number];

export type EditorPerformanceMarkOwner =
  | "ReactPlannerHost"
  | "planner workspace bootstrap"
  | "planner resource coordinator"
  | "PlannerCanvas";

export const EDITOR_PERFORMANCE_MARK_RESPONSIBILITIES: Readonly<
  Record<EditorPerformanceMarkName, EditorPerformanceMarkOwner>
> = {
  "editor:island-mounted": "ReactPlannerHost",
  "editor:workspace-module-ready": "ReactPlannerHost",
  "editor:buildings-dataset-ready": "planner workspace bootstrap",
  "editor:project-state-ready": "planner resource coordinator",
  "editor:pixi-module-ready": "planner resource coordinator",
  "editor:default-map-fetched": "planner resource coordinator",
  "editor:default-map-parsed": "planner resource coordinator",
  "editor:pixi-application-ready": "PlannerCanvas",
  "editor:initial-textures-started": "PlannerCanvas",
  "editor:required-textures-ready": "PlannerCanvas",
  "editor:map-container-started": "PlannerCanvas",
  "editor:map-container-ready": "PlannerCanvas",
  "editor:canvas-mounted": "PlannerCanvas",
  "editor:interactive": "PlannerCanvas",
};

export interface EditorPerformanceMarkPort {
  mark(markName: string): void;
}

export interface EditorPerformanceMarker {
  mark(markName: EditorPerformanceMarkName): void;
}

const directPredecessors: Readonly<
  Record<EditorPerformanceMarkName, readonly EditorPerformanceMarkName[]>
> = {
  "editor:island-mounted": [],
  "editor:workspace-module-ready": ["editor:island-mounted"],
  "editor:buildings-dataset-ready": ["editor:workspace-module-ready"],
  "editor:project-state-ready": ["editor:workspace-module-ready"],
  "editor:pixi-module-ready": ["editor:workspace-module-ready"],
  "editor:default-map-fetched": ["editor:workspace-module-ready"],
  "editor:default-map-parsed": ["editor:default-map-fetched"],
  "editor:pixi-application-ready": ["editor:pixi-module-ready"],
  "editor:initial-textures-started": [
    "editor:pixi-application-ready",
    "editor:default-map-parsed",
  ],
  "editor:required-textures-ready": [
    "editor:pixi-module-ready",
    "editor:default-map-parsed",
    "editor:initial-textures-started",
  ],
  "editor:map-container-started": ["editor:required-textures-ready"],
  "editor:map-container-ready": ["editor:map-container-started"],
  "editor:canvas-mounted": [
    "editor:project-state-ready",
    "editor:required-textures-ready",
    "editor:map-container-ready",
  ],
  "editor:interactive": ["editor:canvas-mounted"],
};

function getBrowserPerformanceMarkPort(): EditorPerformanceMarkPort | null {
  if (typeof window === "undefined") {
    return null;
  }

  const browserPerformance = window.performance;

  if (typeof browserPerformance?.mark !== "function") {
    return null;
  }

  return browserPerformance;
}

function getMissingDirectPredecessors(
  markName: EditorPerformanceMarkName,
  markedNames: ReadonlySet<EditorPerformanceMarkName>,
): EditorPerformanceMarkName[] {
  return directPredecessors[markName].filter(
    (predecessorName) => !markedNames.has(predecessorName),
  );
}

function createOrderingError(
  markName: EditorPerformanceMarkName,
  missingPredecessors: readonly EditorPerformanceMarkName[],
): Error {
  return new Error(
    `Cannot mark ${markName}; missing direct predecessors: ${missingPredecessors.join(", ")}.`,
  );
}

export function createEditorPerformanceMarker(
  performanceMarkPort: EditorPerformanceMarkPort | null = getBrowserPerformanceMarkPort(),
): EditorPerformanceMarker {
  const markedNames = new Set<EditorPerformanceMarkName>();

  return {
    mark(markName) {
      if (markedNames.has(markName)) {
        return;
      }

      const missingPredecessors = getMissingDirectPredecessors(
        markName,
        markedNames,
      );

      if (missingPredecessors.length > 0) {
        throw createOrderingError(markName, missingPredecessors);
      }

      performanceMarkPort?.mark(markName);
      markedNames.add(markName);
    },
  };
}
