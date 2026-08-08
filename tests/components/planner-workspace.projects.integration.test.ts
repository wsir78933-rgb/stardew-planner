import { describe, expect, it, vi } from "vitest";
import {
  createPlannerLocalProjectActions,
  createPlannerProjectMapActions,
} from "../../src/planner/planner-workspace-project-actions";
import {
  changePlannerWorkspaceMap,
  createPlannerWorkspacePersistenceRuntime,
  saveCurrentPlannerWorkspaceMap,
} from "../../src/planner/planner-workspace-persistence-runtime";
import {
  createCanonicalMapIdentityReference,
  createCanonicalSessionTransition,
} from "../../src/planner/planner-workspace-canonical-session";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
} from "../../src/planner/planner-workspace-state";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import type { ReferenceOpenMapSession } from "../../src/reference-runtime/reference-project-editor-adapter";
import type { ReferenceProjectWorkspaceState } from "../../src/reference-runtime/use-reference-project-workspace";

describe("planner workspace project composition", () => {
  it("keeps canonical and exporter identity across the actual persistence runtime lifecycle", async () => {
    let activeSession = createCanonicalSession();
    let plannerWorkspaceState = createCanonicalPlannerWorkspaceState();
    const dispatchPlannerWorkspaceAction = vi.fn();
    const saveOpenMap = vi.fn(() => {
      activeSession = {
        ...activeSession,
        placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
      };
    });
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction,
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: createCanonicalProjectWorkspaceState(activeSession),
      workspaceController: {
        clearActiveProject: vi.fn(),
        getPlannerMapIdForMapFile: (mapFile) => {
          if (mapFile === "Farm.tmx") return "standard";
          if (mapFile === "Farm_Foraging.tmx") return "forest";
          throw new Error(`Unexpected map file ${JSON.stringify(mapFile)}.`);
        },
        saveOpenMap,
        saveThumbnail: vi.fn(),
      },
    });

    persistenceRuntime.synchronizeCanonicalSession();
    expect(dispatchPlannerWorkspaceAction).toHaveBeenCalledTimes(1);
    persistenceRuntime.saveCurrentMap();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      createCanonicalProjectWorkspaceState(activeSession),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    expect(dispatchPlannerWorkspaceAction).toHaveBeenCalledTimes(1);

    const standardCaptureScreenshot = vi.fn(
      async () => new Blob(["standard"], { type: "image/png" }),
    );
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureScreenshot: standardCaptureScreenshot,
    });
    await persistenceRuntime.captureScreenshot(1);
    expect(standardCaptureScreenshot).toHaveBeenCalledWith(1);

    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      plannerMapId: "forest",
      type: "select-map",
    });
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      { activeSession: null },
    );
    const forestCaptureScreenshot = vi.fn(
      async () => new Blob(["forest"], { type: "image/png" }),
    );
    persistenceRuntime.handleMapImageExporterReady("forest", {
      captureScreenshot: forestCaptureScreenshot,
    });
    persistenceRuntime.clearMapImageExporter("standard");
    await persistenceRuntime.captureScreenshot(2);
    expect(forestCaptureScreenshot).toHaveBeenCalledWith(2);
  });

  it("clears the canonical controller before selecting a generic planner map", () => {
    const operationOrder: string[] = [];
    let plannerWorkspaceState = createCanonicalPlannerWorkspaceState();

    changePlannerWorkspaceMap({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        operationOrder.push("select-map");
        plannerWorkspaceState = reducePlannerWorkspaceState(
          plannerWorkspaceState,
          plannerWorkspaceAction,
        );
      },
      plannerMapId: "forest",
      workspaceController: {
        clearActiveProject: () => operationOrder.push("clear-active-project"),
      },
    });

    expect(operationOrder).toEqual(["clear-active-project", "select-map"]);
    expect(plannerWorkspaceState).toMatchObject({
      activeMapId: null,
      activeProjectId: null,
      selectedPlannerMapId: "forest",
    });
  });

  it("saves the exact canonical session without scheduling a same-identity reset", () => {
    const activeSession = createCanonicalSession();
    const plannerWorkspaceState = createCanonicalPlannerWorkspaceState();
    const workspaceState = createCanonicalProjectWorkspaceState(activeSession);
    const saveOpenMap = vi.fn();
    const canonicalMapIdentityReference = createCanonicalMapIdentityReference();
    const canonicalMapLookup = { getPlannerMapIdForMapFile: () => "standard" };
    expect(createCanonicalSessionTransition(
      activeSession,
      canonicalMapLookup,
      canonicalMapIdentityReference,
    )).not.toBeNull();

    saveCurrentPlannerWorkspaceMap({
      plannerWorkspaceState,
      workspaceController: { ...canonicalMapLookup, saveOpenMap },
      workspaceState,
    });

    expect(saveOpenMap).toHaveBeenCalledTimes(1);
    expect(saveOpenMap).toHaveBeenCalledWith({
      placementSnapshot: plannerWorkspaceState.placementHistory.currentState,
      season: "spring",
    });
    expect(createCanonicalSessionTransition(
      { ...activeSession, placementSnapshot: createEmptyPlacementSnapshot() },
      canonicalMapLookup,
      canonicalMapIdentityReference,
    )).toBeNull();
  });

  it("fails before saving when the canonical project map is not current", () => {
    const plannerWorkspaceState = createCanonicalPlannerWorkspaceState();
    const saveOpenMap = vi.fn();

    expect(() => saveCurrentPlannerWorkspaceMap({
      plannerWorkspaceState: {
        ...plannerWorkspaceState,
        selectedPlannerMapId: "forest",
      },
      workspaceController: {
        getPlannerMapIdForMapFile: () => "standard",
        saveOpenMap,
      },
      workspaceState: {
        activeSession: createCanonicalSession(),
      },
    })).toThrow(
      'project ID "project-alpha", map ID "map-standard", and planner map ID "forest"',
    );
    expect(saveOpenMap).not.toHaveBeenCalled();
  });

  it("maps every local-project action to one exact controller call", () => {
    const controllerMethods = {
      createProject: vi.fn(),
      deleteProject: vi.fn(),
      duplicateProject: vi.fn(),
      exportProject: vi.fn(() => "serialized-project"),
      importProject: vi.fn(),
      openProject: vi.fn(),
      renameProject: vi.fn(),
    };
    const projectActions = createPlannerLocalProjectActions({
      season: "fall",
      workspaceController: controllerMethods,
    });

    projectActions.onCreateProject();
    expectOnlyControllerMethodCalled(controllerMethods, "createProject");
    expect(controllerMethods.createProject).toHaveBeenCalledWith({
      projectName: "Untitled Project",
      season: "fall",
    });
    vi.clearAllMocks();

    projectActions.onOpenProject("project-open");
    expectOnlyControllerMethodCalled(controllerMethods, "openProject");
    expect(controllerMethods.openProject).toHaveBeenCalledWith("project-open");
    vi.clearAllMocks();

    projectActions.onRenameProject("project-rename", "Renamed Farm");
    expectOnlyControllerMethodCalled(controllerMethods, "renameProject");
    expect(controllerMethods.renameProject).toHaveBeenCalledWith(
      "project-rename",
      "Renamed Farm",
    );
    vi.clearAllMocks();

    projectActions.onDuplicateProject("project-duplicate");
    expectOnlyControllerMethodCalled(controllerMethods, "duplicateProject");
    expect(controllerMethods.duplicateProject).toHaveBeenCalledWith(
      "project-duplicate",
    );
    vi.clearAllMocks();

    expect(projectActions.onExportProject("project-export")).toBe(
      "serialized-project",
    );
    expectOnlyControllerMethodCalled(controllerMethods, "exportProject");
    expect(controllerMethods.exportProject).toHaveBeenCalledWith("project-export");
    vi.clearAllMocks();

    projectActions.onImportProject("imported-project");
    expectOnlyControllerMethodCalled(controllerMethods, "importProject");
    expect(controllerMethods.importProject).toHaveBeenCalledWith("imported-project");
    vi.clearAllMocks();

    projectActions.onDeleteProject("project-delete");
    expectOnlyControllerMethodCalled(controllerMethods, "deleteProject");
    expect(controllerMethods.deleteProject).toHaveBeenCalledWith("project-delete");
  });

  it("maps every project-map action to one controller call with exact IDs", () => {
    const controllerMethods = {
      activateMap: vi.fn(),
      copyMap: vi.fn(),
      createMap: vi.fn(),
      deleteMap: vi.fn(),
      duplicateMap: vi.fn(),
      moveMap: vi.fn(),
      renameMap: vi.fn(),
    };
    const projectMapActions = createPlannerProjectMapActions({
      activeProjectId: "project-source",
      season: "winter",
      workspaceController: controllerMethods,
    });

    projectMapActions.onAddMap("forest");
    expectOnlyControllerMethodCalled(controllerMethods, "createMap");
    expect(controllerMethods.createMap).toHaveBeenCalledWith({
      projectId: "project-source",
      mapFile: "Farm_Foraging.tmx",
      label: "Forest Farm",
      season: "winter",
    });
    vi.clearAllMocks();

    projectMapActions.onOpenMapInstance("map-open");
    expectOnlyControllerMethodCalled(controllerMethods, "activateMap");
    expect(controllerMethods.activateMap).toHaveBeenCalledWith("map-open");
    vi.clearAllMocks();

    projectMapActions.onRenameMapInstance("map-rename", "Renamed Layout");
    expectOnlyControllerMethodCalled(controllerMethods, "renameMap");
    expect(controllerMethods.renameMap).toHaveBeenCalledWith({
      projectId: "project-source",
      mapId: "map-rename",
      requestedLabel: "Renamed Layout",
    });
    vi.clearAllMocks();

    projectMapActions.onDuplicateMapInstance("map-duplicate");
    expectOnlyControllerMethodCalled(controllerMethods, "duplicateMap");
    expect(controllerMethods.duplicateMap).toHaveBeenCalledWith({
      projectId: "project-source",
      mapId: "map-duplicate",
    });
    vi.clearAllMocks();

    projectMapActions.onDeleteMapInstance("map-delete");
    expectOnlyControllerMethodCalled(controllerMethods, "deleteMap");
    expect(controllerMethods.deleteMap).toHaveBeenCalledWith({
      projectId: "project-source",
      mapId: "map-delete",
    });
    vi.clearAllMocks();

    projectMapActions.onCopyMapInstance("map-copy", "project-copy-target");
    expectOnlyControllerMethodCalled(controllerMethods, "copyMap");
    expect(controllerMethods.copyMap).toHaveBeenCalledWith({
      projectId: "project-source",
      mapId: "map-copy",
      targetProjectId: "project-copy-target",
    });
    vi.clearAllMocks();

    projectMapActions.onMoveMapInstance("map-move", "project-move-target");
    expectOnlyControllerMethodCalled(controllerMethods, "moveMap");
    expect(controllerMethods.moveMap).toHaveBeenCalledWith({
      projectId: "project-source",
      mapId: "map-move",
      targetProjectId: "project-move-target",
    });
  });
});

function createCanonicalPlannerWorkspaceState() {
  return reducePlannerWorkspaceState(createInitialPlannerWorkspaceState(), {
    activeMapId: "map-standard",
    activeProjectId: "project-alpha",
    placementSnapshot: createEmptyPlacementSnapshot(),
    plannerMapId: "standard",
    season: "spring",
    type: "open-canonical-map",
  });
}

function createCanonicalSession(): ReferenceOpenMapSession {
  return {
    projectId: "project-alpha",
    mapId: "map-standard",
    placementSnapshot: createEmptyPlacementSnapshot(),
    season: "spring",
    sourceMap: { mapFile: "Farm.tmx" },
  } as ReferenceOpenMapSession;
}

function createCanonicalProjectWorkspaceState(
  activeSession: ReferenceOpenMapSession,
): Pick<ReferenceProjectWorkspaceState, "activeSession"> {
  return {
    activeSession,
  };
}

function expectOnlyControllerMethodCalled(
  controllerMethods: Record<string, ReturnType<typeof vi.fn>>,
  expectedMethodName: string,
): void {
  const calledMethodNames = Object.entries(controllerMethods)
    .filter(([, controllerMethod]) => controllerMethod.mock.calls.length > 0)
    .map(([controllerMethodName]) => controllerMethodName);
  expect(calledMethodNames).toEqual([expectedMethodName]);
}
