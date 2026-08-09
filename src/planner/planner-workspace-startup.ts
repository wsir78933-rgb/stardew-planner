import type { DefaultMapRequest } from "../resources/default-map-resource";
import {
  createInitialPlannerWorkspaceState,
  type PlannerWorkspaceState,
} from "./planner-workspace-state";

export type PlannerWorkspaceInitialStartup = Readonly<{
  initialMapRequest: DefaultMapRequest;
  initialPlannerWorkspaceState: PlannerWorkspaceState;
}>;

export type PlannerWorkspaceInitialStartupInput = Readonly<{
  initialPlannerMapId?: string;
  viewportWidth?: number;
}>;

export function createPlannerWorkspaceInitialStartup({
  initialPlannerMapId,
  viewportWidth,
}: PlannerWorkspaceInitialStartupInput = {}): PlannerWorkspaceInitialStartup {
  const initialPlannerWorkspaceState = createInitialPlannerWorkspaceState(
    initialPlannerMapId,
    viewportWidth,
  );

  return {
    initialMapRequest: createPlannerWorkspaceMapRequest(
      initialPlannerWorkspaceState,
    ),
    initialPlannerWorkspaceState,
  };
}

export function createPlannerWorkspaceMapRequest(
  plannerWorkspaceState: Pick<
    PlannerWorkspaceState,
    "mapRenderOptions" | "season" | "selectedPlannerMapId"
  >,
): DefaultMapRequest {
  return {
    mapId: plannerWorkspaceState.selectedPlannerMapId,
    mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
    season: plannerWorkspaceState.season,
  };
}
