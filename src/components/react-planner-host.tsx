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
import type { HomepageLocale } from "../homepage/homepage-locale";

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

type PlannerWorkspaceModule = typeof import("./planner-workspace");

export type CreatePlannerWorkspaceModuleLoaderInput = Readonly<{
  importPlannerWorkspace: () => Promise<PlannerWorkspaceModule>;
  startImmediately: boolean;
}>;

export function createPlannerWorkspaceModuleLoader({
  importPlannerWorkspace,
  startImmediately,
}: CreatePlannerWorkspaceModuleLoaderInput): () => Promise<
  ComponentType<PlannerWorkspaceProperties>
> {
  if (typeof importPlannerWorkspace !== "function") {
    throw new TypeError(
      `createPlannerWorkspaceModuleLoader importPlannerWorkspace must be a function; received ${String(importPlannerWorkspace)}.`,
    );
  }

  let plannerWorkspaceModulePromise: Promise<PlannerWorkspaceModule> | undefined;
  if (startImmediately) {
    plannerWorkspaceModulePromise = importPlannerWorkspace();
  }

  return () => {
    plannerWorkspaceModulePromise ??= importPlannerWorkspace();
    return plannerWorkspaceModulePromise.then(
      ({ PlannerWorkspace: LoadedPlannerWorkspace }) =>
        createPlannerWorkspaceModuleReadyBoundary(LoadedPlannerWorkspace),
    );
  };
}

const PlannerWorkspace = dynamic<PlannerWorkspaceProperties>(
  createPlannerWorkspaceModuleLoader({
    importPlannerWorkspace: () => import("./planner-workspace"),
    startImmediately: typeof window !== "undefined",
  }),
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
  locale,
  performanceMarker,
  plannerHostStartup,
}: Readonly<{
  locale: HomepageLocale;
  performanceMarker: ReturnType<typeof createEditorPerformanceMarker>;
  plannerHostStartup: PlannerWorkspaceStartup;
}>) {
  return (
    <PlannerWorkspace
      locale={locale}
      performanceMarker={performanceMarker}
      startup={plannerHostStartup}
    />
  );
}

export function ReactPlannerHost({ locale }: Readonly<{ locale: HomepageLocale }>) {
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
    locale={locale}
    performanceMarker={performanceMarker}
    plannerHostStartup={plannerHostStartup}
  />;
}
