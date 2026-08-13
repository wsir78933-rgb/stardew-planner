import { describe, expect, it } from "vitest";
import { createInitialEditorPreferences } from "../../src/editor/browser-editor-preferences";
import { createInitialMapRenderOptions } from "../../src/maps/map-render-options";
import {
  completePlannerWorkspaceRequest,
  createInitialPlannerWorkspaceResourceState,
  requestPlannerWorkspaceRetry,
  shouldPreparePlannerWorkspaceRequest,
} from "../../src/planner/planner-workspace-resource-lifecycle";
import type { PreparedPlannerWorkspace } from "../../src/planner/planner-workspace-bootstrap";
import type { DefaultMapRequest } from "../../src/resources/default-map-resource";

function createMapRequest(): DefaultMapRequest {
  return {
    mapId: "standard",
    mapRenderOptions: createInitialMapRenderOptions(),
    season: "spring",
  };
}

function createPreparedWorkspace(resourceGeneration: number): PreparedPlannerWorkspace {
  return {
    canvasResources: {
      pixi: {} as typeof import("pixi.js"),
      preparedMap: {
        mapId: "standard",
        parsedMap: {} as PreparedPlannerWorkspace["canvasResources"]["preparedMap"]["parsedMap"],
        renderingContract:
          {} as PreparedPlannerWorkspace["canvasResources"]["preparedMap"]["renderingContract"],
        season: "spring",
      },
      resourceGeneration,
    },
    preferences: createInitialEditorPreferences(),
    projectState: {
      projects: [],
      repository: {} as PreparedPlannerWorkspace["projectState"]["repository"],
    },
    resourceGeneration,
    savePreferences: () => undefined,
  };
}

describe("planner workspace resource lifecycle", () => {
  it("invalidates the prepared request when Retry starts a new runtime attempt", () => {
    const mapRequest = createMapRequest();
    const preparedState = completePlannerWorkspaceRequest(
      createInitialPlannerWorkspaceResourceState(),
      createPreparedWorkspace(3),
      mapRequest,
    );

    const retryState = requestPlannerWorkspaceRetry(preparedState);

    expect(retryState.preparedRequest).toBeNull();
    expect(retryState.retryRequestCount).toBe(1);
    expect(shouldPreparePlannerWorkspaceRequest(retryState, mapRequest)).toBe(true);
  });

  it("repeats only when the exact map request changes", () => {
    const mapRequest = createMapRequest();
    const preparedState = completePlannerWorkspaceRequest(
      createInitialPlannerWorkspaceResourceState(),
      createPreparedWorkspace(4),
      mapRequest,
    );
    const changedRenderOptionsRequest: DefaultMapRequest = {
      ...mapRequest,
      mapRenderOptions: {
        ...mapRequest.mapRenderOptions,
        farmhouse2: {
          ...mapRequest.mapRenderOptions.farmhouse2,
          marriageMapEnabled: true,
        },
      },
    };

    expect(shouldPreparePlannerWorkspaceRequest(preparedState, mapRequest)).toBe(false);
    expect(
      shouldPreparePlannerWorkspaceRequest(preparedState, changedRenderOptionsRequest),
    ).toBe(true);
  });
});
