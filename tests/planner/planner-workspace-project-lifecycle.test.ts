import { describe, expect, it } from "vitest";
import { retainPlannerWorkspaceProjectLifecycle } from "../../src/planner/planner-workspace-project-lifecycle";
import {
  createCanonicalMapIdentityReference,
  createCanonicalSessionTransition,
} from "../../src/planner/planner-workspace-canonical-session";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
} from "../../src/planner/planner-workspace-state";
import { createReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";

function createRepository() {
  const supportedProjectDocument = structuredClone(referenceProjectDocumentFixture);
  for (const storedProject of supportedProjectDocument.projects) {
    for (const projectMap of storedProject.project.maps) {
      projectMap.state = {
        buildings: [],
        crops: [],
        items: [],
        nextBuildingId: 1,
        nextItemId: 1,
      };
      projectMap.decor = { floors: {}, wallpapers: {} };
      projectMap.renovations = [];
    }
  }
  let serializedProjectDocument = JSON.stringify(supportedProjectDocument);
  return createReferenceProjectRepository({
    storage: {
      getItem: () => serializedProjectDocument,
      setItem: (_storageKey, nextSerializedProjectDocument) => {
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    },
    createIdentifier: () => "unused-lifecycle-identifier",
    now: () => "2026-08-09T00:00:00.000Z",
  });
}

describe("planner workspace project lifecycle", () => {
  it("retains the canonical project session while its replacement map prepares", () => {
    const repository = createRepository();
    const firstProjectState = {
      projects: repository.listProjects(),
      repository,
    };
    const lifecycle = retainPlannerWorkspaceProjectLifecycle(null, firstProjectState);
    lifecycle.workspaceController.openProject("project-alpha");

    const canonicalSession = lifecycle.workspaceController.getState().activeSession;
    expect(canonicalSession).toMatchObject({
      mapId: "map-standard",
      projectId: "project-alpha",
      sourceMap: { mapFile: "Farm.tmx" },
    });
    const canonicalSessionAction = createCanonicalSessionTransition(
      canonicalSession,
      lifecycle.workspaceController,
      createCanonicalMapIdentityReference(),
    );
    if (canonicalSessionAction === null) {
      throw new Error("Expected the opened Standard project map to create a canonical action.");
    }
    const canonicalPlannerWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState("forest"),
      canonicalSessionAction,
    );
    expect(canonicalPlannerWorkspaceState).toMatchObject({
      activeMapId: "map-standard",
      activeProjectId: "project-alpha",
      selectedPlannerMapId: "standard",
    });

    const lifecycleDuringMapPreparation =
      retainPlannerWorkspaceProjectLifecycle(lifecycle, null);
    const lifecycleAfterMapPreparation = retainPlannerWorkspaceProjectLifecycle(
      lifecycleDuringMapPreparation,
      { projects: [], repository },
    );

    expect(lifecycleDuringMapPreparation).toBe(lifecycle);
    expect(lifecycleAfterMapPreparation).toBe(lifecycle);
    expect(lifecycleAfterMapPreparation.workspaceController.getState()).toMatchObject({
      activeProject: { id: "project-alpha" },
      activeSession: { mapId: "map-standard", projectId: "project-alpha" },
    });

    lifecycleAfterMapPreparation.workspaceController.saveOpenMap({ season: "fall" });
    expect(
      repository.openProject("project-alpha").project.maps.find(
        (projectMap) => projectMap.id === "map-standard",
      )?.season,
    ).toBe("fall");

    lifecycleAfterMapPreparation.workspaceController.clearActiveProject();
    expect(lifecycleAfterMapPreparation.workspaceController.getState()).toMatchObject({
      activeProject: null,
      activeSession: null,
    });
  });

  it("reads initial summaries once and does not share controller state between workspaces", () => {
    const repository = createRepository();
    let firstSummaryReadCount = 0;
    let replacementSummaryReadCount = 0;
    const initialProjectState = {
      get projects() {
        firstSummaryReadCount += 1;
        return repository.listProjects();
      },
      repository,
    };
    const replacementProjectState = {
      get projects() {
        replacementSummaryReadCount += 1;
        return [];
      },
      repository,
    };

    const firstWorkspaceLifecycle = retainPlannerWorkspaceProjectLifecycle(
      null,
      initialProjectState,
    );
    expect(
      retainPlannerWorkspaceProjectLifecycle(
        firstWorkspaceLifecycle,
        replacementProjectState,
      ),
    ).toBe(firstWorkspaceLifecycle);
    const secondWorkspaceLifecycle = retainPlannerWorkspaceProjectLifecycle(
      null,
      { projects: repository.listProjects(), repository },
    );

    expect(firstSummaryReadCount).toBe(1);
    expect(replacementSummaryReadCount).toBe(0);
    expect(secondWorkspaceLifecycle).not.toBe(firstWorkspaceLifecycle);
    expect(secondWorkspaceLifecycle.workspaceController).not.toBe(
      firstWorkspaceLifecycle.workspaceController,
    );

    firstWorkspaceLifecycle.workspaceController.openProject("project-alpha");
    expect(firstWorkspaceLifecycle.workspaceController.getState().activeProject?.id).toBe(
      "project-alpha",
    );
    expect(secondWorkspaceLifecycle.workspaceController.getState().activeProject).toBeNull();
  });

  it("fails fast when a prepared generation changes repository identity", () => {
    const firstRepository = createRepository();
    const lifecycle = retainPlannerWorkspaceProjectLifecycle(null, {
      projects: firstRepository.listProjects(),
      repository: firstRepository,
    });

    expect(() =>
      retainPlannerWorkspaceProjectLifecycle(lifecycle, {
        projects: [],
        repository: createRepository(),
      }),
    ).toThrow(/repository changed after mount/);
  });
});
