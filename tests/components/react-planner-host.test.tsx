import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  createPlannerWorkspaceModuleReadyBoundary,
  createReactPlannerHostStartup,
  ReactPlannerHostWorkspace,
  ReactPlannerHost,
} from "../../src/components/react-planner-host";
import type {
  PlannerWorkspaceBootstrap,
  PlannerWorkspaceProperties,
} from "../../src/components/planner-workspace";
import { createEditorPerformanceMarker } from "../../src/performance/editor-performance-marks";
import { usePlannerWorkspaceState } from "../../src/planner/use-planner-workspace-state";

function createWorkspaceBootstrap(): PlannerWorkspaceBootstrap {
  return async () => null;
}

function createWorkspaceProperties(
  locationSearch: string,
): PlannerWorkspaceProperties {
  const plannerHostStartup = createReactPlannerHostStartup({
    bootstrapWorkspace: createWorkspaceBootstrap(),
    locationSearch,
    viewportWidth: 1024,
  });
  const performanceMarker = createEditorPerformanceMarker();
  performanceMarker.mark("editor:island-mounted");
  const plannerWorkspaceElement = ReactPlannerHostWorkspace({
    locale: "zh-CN",
    performanceMarker,
    plannerHostStartup,
  });
  const plannerWorkspaceProperties =
    plannerWorkspaceElement.props as PlannerWorkspaceProperties;

  expect(plannerWorkspaceProperties.startup).toBe(plannerHostStartup);
  expect(plannerWorkspaceProperties.locale).toBe("zh-CN");

  return plannerWorkspaceProperties;
}

function readInitialPlannerMapId(
  plannerWorkspaceProperties: PlannerWorkspaceProperties,
): string {
  function PlannerWorkspaceStateSummary() {
    const { plannerWorkspaceState } = usePlannerWorkspaceState({
      initialPlannerWorkspaceState:
        plannerWorkspaceProperties.startup.initialPlannerWorkspaceState,
    });
    return createElement("output", null, plannerWorkspaceState.selectedPlannerMapId);
  }

  return renderToStaticMarkup(createElement(PlannerWorkspaceStateSummary));
}

describe("React planner host", () => {
  it("does not mark workspace availability before the dynamic workspace module resolves", () => {
    const markedNames: string[] = [];
    const performanceMarker = createEditorPerformanceMarker({
      mark(markName) {
        markedNames.push(markName);
      },
    });
    performanceMarker.mark("editor:island-mounted");
    const plannerHostStartup = createReactPlannerHostStartup({
      bootstrapWorkspace: createWorkspaceBootstrap(),
      locationSearch: "",
      viewportWidth: 1024,
    });

    ReactPlannerHostWorkspace({
      locale: "en",
      performanceMarker,
      plannerHostStartup,
    });

    expect(markedNames).toEqual(["editor:island-mounted"]);
  });

  it("marks workspace availability from the resolved dynamic module boundary", () => {
    const markedNames: string[] = [];
    const performanceMarker = createEditorPerformanceMarker({
      mark(markName) {
        markedNames.push(markName);
      },
    });
    performanceMarker.mark("editor:island-mounted");
    const plannerHostStartup = createReactPlannerHostStartup({
      bootstrapWorkspace: createWorkspaceBootstrap(),
      locationSearch: "",
      viewportWidth: 1024,
    });
    const WorkspaceModuleReadyBoundary = createPlannerWorkspaceModuleReadyBoundary(
      () => createElement("output", null, "workspace"),
    );

    expect(renderToStaticMarkup(createElement(WorkspaceModuleReadyBoundary, {
      locale: "en",
      performanceMarker,
      startup: plannerHostStartup,
    }))).toBe("<output>workspace</output>");
    expect(markedNames).toEqual([
      "editor:island-mounted",
      "editor:workspace-module-ready",
    ]);
  });

  it("renders an accessible loading status without the workspace or Pixi runtime", () => {
    const reactPlannerHostMarkup = renderToStaticMarkup(
      createElement(ReactPlannerHost, { locale: "en" }),
    );

    expect(reactPlannerHostMarkup).toContain('role="status"');
    expect(reactPlannerHostMarkup).toContain("Loading planner…");
    expect(reactPlannerHostMarkup).not.toContain("planner-canvas__viewport");
    expect(reactPlannerHostMarkup).not.toContain("reference-runtime-root");
  });

  it.each([
    ["?farmType=forest", "forest"],
    ["?farmType=modest-maps-standard", "modest-maps-standard"],
    ["", "standard"],
    ["?farmType=unknown-mod-farm", "standard"],
    ["?farmType=forest&farmType=beach", "standard"],
  ])("passes %s to the first workspace map request as %s", (
    locationSearch,
    expectedMapId,
  ) => {
    const plannerWorkspaceProperties = createWorkspaceProperties(locationSearch);

    expect(readInitialPlannerMapId(plannerWorkspaceProperties)).toBe(
      `<output>${expectedMapId}</output>`,
    );
    expect(plannerWorkspaceProperties.startup.initialMapRequest).toMatchObject({
      mapId: expectedMapId,
    });
  });
});
