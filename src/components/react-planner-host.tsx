"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createEditorPerformanceMarker } from "../performance/editor-performance-marks";
import { createBrowserPlannerWorkspaceBootstrap } from "../planner/planner-workspace-bootstrap";
import type { PlannerWorkspaceBootstrap } from "./planner-workspace";

const PlannerWorkspace = dynamic(
  () =>
    import("./planner-workspace").then(
      ({ PlannerWorkspace: LoadedPlannerWorkspace }) => LoadedPlannerWorkspace,
    ),
  { ssr: false },
);

export function ReactPlannerHost() {
  const [performanceMarker] = useState(createEditorPerformanceMarker);
  const [bootstrapWorkspace, setBootstrapWorkspace] =
    useState<PlannerWorkspaceBootstrap | null>(null);
  const [hasMountedInBrowser, setHasMountedInBrowser] = useState(false);

  useEffect(() => {
    performanceMarker.mark("editor:island-mounted");
    setBootstrapWorkspace(() =>
      createBrowserPlannerWorkspaceBootstrap({
        performanceMarker,
      }),
    );
    setHasMountedInBrowser(true);
  }, [performanceMarker]);

  if (!hasMountedInBrowser || bootstrapWorkspace === null) {
    return null;
  }

  return (
    <PlannerWorkspace
      bootstrapWorkspace={bootstrapWorkspace}
      performanceMarker={performanceMarker}
    />
  );
}
