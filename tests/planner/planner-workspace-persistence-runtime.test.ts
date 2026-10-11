import { describe, expect, it } from "vitest";
import {
  createInitialMapRenderOptions,
  restoreMapRenderOptions,
  type MapRenderOptions,
} from "../../src/maps/map-render-options";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
} from "../../src/planner/planner-workspace-state";
import { createPlannerWorkspacePersistenceRuntime } from "../../src/planner/planner-workspace-persistence-runtime";
import { createReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import { createReferenceProjectWorkspaceController } from "../../src/reference-runtime/use-reference-project-workspace";

function createEmptyProjectRepository() {
  let serializedProjectDocument: string | null = null;
  let identifierSequence = 0;
  let timestampSequence = 0;

  return createReferenceProjectRepository({
    storage: {
      getItem: () => serializedProjectDocument,
      setItem: (_storageKey, nextSerializedProjectDocument) => {
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    },
    createIdentifier: () => {
      identifierSequence += 1;
      return `created-${String(identifierSequence)}`;
    },
    now: () => {
      timestampSequence += 1;
      return `2026-08-10T00:00:${String(timestampSequence).padStart(2, "0")}.000Z`;
    },
  });
}

function createMapRenderOptionsWithSpouseAndCave(): MapRenderOptions {
  return restoreMapRenderOptions({
    gingerIslandOverlayIds: ["cave"],
    farmhouse2: {
      marriageMapEnabled: true,
      renovationIds: [],
      spouseId: "abigail",
    },
    farm: { spouseId: "Abigail", caveChoice: "bats" },
  });
}

describe("planner workspace persistence runtime map render options", () => {
  it("saves options on smart-created maps and later explicit saves, then restores them on open", () => {
    const repository = createEmptyProjectRepository();
    const workspaceController = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: [],
    });
    const initialSavedMapRenderOptions = createMapRenderOptionsWithSpouseAndCave();
    let plannerWorkspaceState = {
      ...createInitialPlannerWorkspaceState("standard"),
      mapRenderOptions: initialSavedMapRenderOptions,
    };
    const dispatchedActions: Parameters<typeof reducePlannerWorkspaceState>[1][] = [];
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        dispatchedActions.push(plannerWorkspaceAction);
        plannerWorkspaceState = reducePlannerWorkspaceState(
          plannerWorkspaceState,
          plannerWorkspaceAction,
        );
      },
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: { activeSession: null },
      workspaceController,
    });

    persistenceRuntime.saveCurrentMap();
    persistenceRuntime.updateWorkspaceSnapshot(plannerWorkspaceState, {
      activeSession: workspaceController.getState().activeSession,
    });
    persistenceRuntime.synchronizeCanonicalSession();

    const createdProjectId = workspaceController.getState().activeProject?.id;
    if (createdProjectId === undefined) {
      throw new Error("Expected smart save to create an active local project.");
    }
    expect(dispatchedActions[0]).toMatchObject({
      mapRenderOptions: initialSavedMapRenderOptions,
      type: "synchronize-smart-save-canonical-map",
    });
    expect(plannerWorkspaceState.mapRenderOptions).toEqual(
      initialSavedMapRenderOptions,
    );
    expect(
      repository.openProject(createdProjectId).project.maps[0]?.state
        .mapRenderOptions,
    ).toEqual(initialSavedMapRenderOptions);

    workspaceController.openProject(createdProjectId);
    expect(
      workspaceController.getState().activeSession?.sourceMap.state
        .mapRenderOptions,
    ).toEqual(initialSavedMapRenderOptions);

    const explicitlySavedMapRenderOptions = restoreMapRenderOptions({
      ...createInitialMapRenderOptions(),
      gingerIslandOverlayIds: ["bin"],
      farm: { spouseId: null, caveChoice: "mushrooms" },
    });
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      mapRenderOptions: explicitlySavedMapRenderOptions,
      type: "set-map-render-options",
    });
    persistenceRuntime.updateWorkspaceSnapshot(plannerWorkspaceState, {
      activeSession: workspaceController.getState().activeSession,
    });
    persistenceRuntime.saveCurrentMap();

    expect(
      repository.openProject(createdProjectId).project.maps[0]?.state
        .mapRenderOptions,
    ).toEqual(explicitlySavedMapRenderOptions);
    workspaceController.openProject(createdProjectId);
    expect(
      workspaceController.getState().activeSession?.sourceMap.state
        .mapRenderOptions,
    ).toEqual(explicitlySavedMapRenderOptions);
  });
});
