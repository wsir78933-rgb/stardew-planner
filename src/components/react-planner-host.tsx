"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ComponentType } from "react";
import { getPlannerMapIdFromSearch } from "../maps/planner-map-query";
import { createEditorPerformanceMarker } from "../performance/editor-performance-marks";
import { createBrowserPlannerWorkspaceBootstrap } from "../planner/planner-workspace-bootstrap";
import { createPlannerWorkspaceInitialStartup } from "../planner/planner-workspace-startup";
import type {
  PlannerWorkspaceBootstrap,
  PlannerWorkspaceProperties,
  PlannerWorkspaceStartup,
} from "./planner-workspace";
import { PlannerStartupStatus } from "./planner-startup-status";

export function createPlannerWorkspaceModuleReadyBoundary(
  LoadedPlannerWorkspace: ComponentType<PlannerWorkspaceProperties>,
): ComponentType<PlannerWorkspaceProperties> {
  return function PlannerWorkspaceModuleReadyBoundary(
    plannerWorkspaceProperties,
  ) {
    plannerWorkspaceProperties.performanceMarker?.mark(
      "editor:workspace-module-ready",
    );

    return <LoadedPlannerWorkspace {...plannerWorkspaceProperties} />;
  };
}

const PlannerWorkspace = dynamic<PlannerWorkspaceProperties>(
  () =>
    import("./planner-workspace").then(
      ({ PlannerWorkspace: LoadedPlannerWorkspace }) =>
        createPlannerWorkspaceModuleReadyBoundary(LoadedPlannerWorkspace),
    ),
  { ssr: false },
);

export type ReactPlannerHostStartupInput = Readonly<{
  bootstrapWorkspace: PlannerWorkspaceBootstrap;
  locationSearch: string;
  viewportWidth: number;
}>;

export function createReactPlannerHostStartup({
  bootstrapWorkspace,
  locationSearch,
  viewportWidth,
}: ReactPlannerHostStartupInput): PlannerWorkspaceStartup {
  return {
    bootstrapWorkspace,
    ...createPlannerWorkspaceInitialStartup({
      initialPlannerMapId: getPlannerMapIdFromSearch(locationSearch) ?? undefined,
      viewportWidth,
    }),
  };
}

export function ReactPlannerHostWorkspace({
  performanceMarker,
  plannerHostStartup,
}: Readonly<{
  performanceMarker: ReturnType<typeof createEditorPerformanceMarker>;
  plannerHostStartup: PlannerWorkspaceStartup;
}>) {
  return (
    <PlannerWorkspace
      performanceMarker={performanceMarker}
      startup={plannerHostStartup}
    />
  );
}

export function ReactPlannerHost() {
  const [performanceMarker] = useState(createEditorPerformanceMarker);
  const [plannerHostStartup, setPlannerHostStartup] =
    useState<PlannerWorkspaceStartup | null>(null);

  useEffect(() => {
    performanceMarker.mark("editor:island-mounted");
    setPlannerHostStartup(() =>
      createReactPlannerHostStartup({
        bootstrapWorkspace: createBrowserPlannerWorkspaceBootstrap({
          performanceMarker,
        }),
        locationSearch: window.location.search,
        viewportWidth: window.innerWidth,
      }),
    );
  }, [performanceMarker]);

  if (plannerHostStartup === null) {
    return (
      <PlannerStartupStatus
        state={{ kind: "loading", message: "Loading planner…" }}
      />
    );
  }

  return <ReactPlannerHostWorkspace
    performanceMarker={performanceMarker}
    plannerHostStartup={plannerHostStartup}
  />;
}
