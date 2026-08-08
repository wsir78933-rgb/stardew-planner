import type { PreparedPlannerWorkspace } from "./planner-workspace-bootstrap";
import {
  getDefaultMapRequestCacheKey,
  type DefaultMapRequest,
} from "../resources/default-map-resource";

export type PreparedPlannerWorkspaceRequest = Readonly<{
  preparedWorkspace: PreparedPlannerWorkspace;
  requestCacheKey: string;
}>;

export type PlannerWorkspaceResourceState = Readonly<{
  preparedRequest: PreparedPlannerWorkspaceRequest | null;
  retryRequestCount: number;
}>;

export function createInitialPlannerWorkspaceResourceState(): PlannerWorkspaceResourceState {
  return {
    preparedRequest: null,
    retryRequestCount: 0,
  };
}

export function completePlannerWorkspaceRequest(
  currentState: PlannerWorkspaceResourceState,
  preparedWorkspace: PreparedPlannerWorkspace,
  mapRequest: DefaultMapRequest,
): PlannerWorkspaceResourceState {
  return {
    ...currentState,
    preparedRequest: {
      preparedWorkspace,
      requestCacheKey: getDefaultMapRequestCacheKey(mapRequest),
    },
  };
}

export function requestPlannerWorkspaceRetry(
  currentState: PlannerWorkspaceResourceState,
): PlannerWorkspaceResourceState {
  return {
    preparedRequest: null,
    retryRequestCount: currentState.retryRequestCount + 1,
  };
}

export function shouldPreparePlannerWorkspaceRequest(
  currentState: PlannerWorkspaceResourceState,
  mapRequest: DefaultMapRequest,
): boolean {
  return (
    currentState.preparedRequest === null ||
    currentState.preparedRequest.requestCacheKey !==
      getDefaultMapRequestCacheKey(mapRequest)
  );
}
