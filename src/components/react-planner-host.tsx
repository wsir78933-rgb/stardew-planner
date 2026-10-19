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
import { PlannerChromeLocaleProvider } from "@/src/i18n/planner-chrome-locale";
import { readPlannerChromeLocale, type HomepageLocale } from "../homepage/homepage-locale";

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
  onAlignPlanner,
}: Readonly<{
  locale: HomepageLocale;
  performanceMarker: ReturnType<typeof createEditorPerformanceMarker>;
  plannerHostStartup: PlannerWorkspaceStartup;
  onAlignPlanner?: () => void;
}>) {
  return (
    <PlannerWorkspace
      locale={locale}
      onAlignPlanner={onAlignPlanner}
      performanceMarker={performanceMarker}
      startup={plannerHostStartup}
    />
  );
}

export function ReactPlannerHost({
  locale,
  onAlignPlanner,
}: Readonly<{
  locale: HomepageLocale;
  onAlignPlanner?: () => void;
}>) {
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

  const plannerHostContent = plannerHostStartup === null ? (
    <PlannerStartupStatus
      state={{ kind: "loading", message: readPlannerHostLoadingMessage(locale) }}
    />
  ) : (
    <ReactPlannerHostWorkspace
      locale={locale}
      onAlignPlanner={onAlignPlanner}
      performanceMarker={performanceMarker}
      plannerHostStartup={plannerHostStartup}
    />
  );

  return (
    <PlannerChromeLocaleProvider locale={readPlannerChromeLocale(locale)}>
      {plannerHostContent}
    </PlannerChromeLocaleProvider>
  );
}

function readPlannerHostLoadingMessage(locale: HomepageLocale): string {
  if (locale === "ja") {
    return "プランナーを読み込んでいます…";
  }

  if (locale === "en" || locale === "zh-CN") {
    return "Loading planner…";
  }

  if (locale === "ru") {
    return "Загрузка планировщика…";
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read planner host loading message because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
