import type { PlannerProjectState } from "../resources/planner-resource-coordinator";
import {
  assertReferenceProjectWorkspaceRepositoryReference,
  createReferenceProjectWorkspaceController,
  type ReferenceProjectWorkspaceController,
} from "../reference-runtime/use-reference-project-workspace";
import type { ReferenceProjectRepository } from "../reference-runtime/reference-project-repository";

export type PlannerWorkspaceProjectLifecycle = Readonly<{
  repository: ReferenceProjectRepository;
  workspaceController: ReferenceProjectWorkspaceController;
}>;

export function retainPlannerWorkspaceProjectLifecycle(
  currentLifecycle: null,
  projectState: PlannerProjectState,
): PlannerWorkspaceProjectLifecycle;
export function retainPlannerWorkspaceProjectLifecycle(
  currentLifecycle: PlannerWorkspaceProjectLifecycle,
  projectState: PlannerProjectState | null,
): PlannerWorkspaceProjectLifecycle;
export function retainPlannerWorkspaceProjectLifecycle(
  currentLifecycle: PlannerWorkspaceProjectLifecycle | null,
  projectState: PlannerProjectState | null,
): PlannerWorkspaceProjectLifecycle | null;
export function retainPlannerWorkspaceProjectLifecycle(
  currentLifecycle: PlannerWorkspaceProjectLifecycle | null,
  projectState: PlannerProjectState | null,
): PlannerWorkspaceProjectLifecycle | null {
  if (projectState === null) {
    return currentLifecycle;
  }
  if (currentLifecycle !== null) {
    assertReferenceProjectWorkspaceRepositoryReference(
      currentLifecycle.repository,
      projectState.repository,
    );
    return currentLifecycle;
  }
  return {
    repository: projectState.repository,
    workspaceController: createReferenceProjectWorkspaceController({
      initialProjectSummaries: projectState.projects,
      repository: projectState.repository,
    }),
  };
}
