import { describe, expect, it, vi } from "vitest";
import { encodePngAsWebp } from "../../src/projects/browser-png-to-webp";
import { MapImageExportError } from "../../src/projects/map-image-export";
import {
  createInitialMapRenderOptions,
  restoreMapRenderOptions,
  type MapRenderOptions,
} from "../../src/maps/map-render-options";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
} from "../../src/planner/planner-workspace-state";
import { applyPlacementSnapshotAction } from "../../src/placement/placement-snapshot";
import { createPlannerWorkspacePersistenceRuntime } from "../../src/planner/planner-workspace-persistence-runtime";
import { createReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import { createReferenceProjectWorkspaceController } from "../../src/reference-runtime/use-reference-project-workspace";

vi.mock("../../src/projects/browser-png-to-webp", () => ({
  encodePngAsWebp: vi.fn(),
}));

function createWebpBytes(payloadByte: number): Uint8Array {
  return new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 14, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
    0x56, 0x50, 0x38, 0x20, 1, 0, 0, 0, payloadByte, 0,
  ]);
}

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

function createPlannerWorkspaceStateWithCoop() {
  const initialPlannerWorkspaceState = createInitialPlannerWorkspaceState("standard");
  const placementSnapshot = applyPlacementSnapshotAction(
    initialPlannerWorkspaceState.placementHistory.currentState,
    {
      building: { buildingId: "Coop", x: 39, y: 27 },
      type: "add-building",
    },
  );
  return {
    ...initialPlannerWorkspaceState,
    placementHistory: {
      ...initialPlannerWorkspaceState.placementHistory,
      currentState: placementSnapshot,
    },
  };
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

  it("saves the current map preview on first smart-save and refreshes it on later saves", async () => {
    const repository = createEmptyProjectRepository();
    const workspaceController = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: [],
    });
    const firstMapRenderOptions = createMapRenderOptionsWithSpouseAndCave();
    let plannerWorkspaceState = {
      ...createInitialPlannerWorkspaceState("standard"),
      mapRenderOptions: firstMapRenderOptions,
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
    const pngBlob = new Blob(["current map"], { type: "image/png" });
    const observedMapRenderOptions: unknown[] = [];
    const captureScreenshot = vi.fn(async () => {
      observedMapRenderOptions.push(plannerWorkspaceState.mapRenderOptions);
      return pngBlob;
    });
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot,
    });
    vi.mocked(encodePngAsWebp)
      .mockResolvedValueOnce(createWebpBytes(1))
      .mockResolvedValueOnce(createWebpBytes(2));

    await persistenceRuntime.saveCurrentMapAndRefreshThumbnail();

    const createdSession = workspaceController.getState().activeSession;
    if (createdSession === null) {
      throw new Error("Expected smart-save to create a canonical map session.");
    }
    expect(observedMapRenderOptions[0]).toEqual(firstMapRenderOptions);
    expect(
      repository.openProject(createdSession.projectId).project.maps.find(
        (projectMap) => projectMap.id === createdSession.mapId,
      )?.state.mapRenderOptions,
    ).toEqual(firstMapRenderOptions);
    expect(repository.listProjects()[0]?.activeMapThumbnailDataUrl).toMatch(
      /^data:image\/webp;base64,/,
    );

    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    const nextMapRenderOptions = restoreMapRenderOptions({
      ...createInitialMapRenderOptions(),
      gingerIslandOverlayIds: ["bin"],
      farm: { spouseId: null, caveChoice: "mushrooms" },
    });
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      mapRenderOptions: nextMapRenderOptions,
      type: "set-map-render-options",
    });
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );

    await persistenceRuntime.saveCurrentMapAndRefreshThumbnail();

    const reopenedProject = repository.openProject(createdSession.projectId);
    expect(observedMapRenderOptions).toEqual([
      firstMapRenderOptions,
      nextMapRenderOptions,
    ]);
    expect(
      reopenedProject.project.maps.find(
        (projectMap) => projectMap.id === createdSession.mapId,
      )?.state.mapRenderOptions,
    ).toEqual(nextMapRenderOptions);
    expect(repository.listProjects()[0]?.activeMapThumbnailDataUrl).toBe(
      `data:image/webp;base64,${Buffer.from(createWebpBytes(2)).toString("base64")}`,
    );
    expect(captureScreenshot).toHaveBeenCalledTimes(2);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenNthCalledWith(1, pngBlob, undefined);
  });

  it("saves a placed Coop preview through first-save canonical hydration", async () => {
    const repository = createEmptyProjectRepository();
    const workspaceController = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: [],
    });
    let plannerWorkspaceState = createPlannerWorkspaceStateWithCoop();
    const placementSnapshotBeforeSave = plannerWorkspaceState.placementHistory.currentState;
    const pngBlob = new Blob(["saved Coop layout"], { type: "image/png" });
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        plannerWorkspaceState = reducePlannerWorkspaceState(
          plannerWorkspaceState,
          plannerWorkspaceAction,
        );
      },
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: { activeSession: null },
      workspaceController,
    });
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(async () => {
        expect(workspaceController.getState().activeSession).toBeNull();
        expect(
          plannerWorkspaceState.placementHistory.currentState.buildings,
        ).toContainEqual(expect.objectContaining({ buildingId: "Coop", x: 39, y: 27 }));
        return pngBlob;
      }),
    });
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(createWebpBytes(6));

    await persistenceRuntime.saveCurrentMapAndRefreshThumbnail();
    const createdSession = workspaceController.getState().activeSession;
    if (createdSession === null) {
      throw new Error("Expected first smart-save to create a canonical map session.");
    }
    expect(createdSession.placementSnapshot.buildings).toContainEqual(
      expect.objectContaining({ buildingId: "Coop", x: 39, y: 27 }),
    );

    expect(placementSnapshotBeforeSave).not.toHaveProperty("interiorDecor");
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    expect(plannerWorkspaceState.placementHistory.currentState).toEqual({
      ...placementSnapshotBeforeSave,
      interiorDecor: { wallpapers: {}, floors: {} },
    });

    expect(repository.listProjects()[0]?.activeMapThumbnailDataUrl).toMatch(
      /^data:image\/webp;base64,/,
    );
    const savedProject = repository.openProject(createdSession.projectId);
    expect(savedProject.project.maps[0]?.state.buildings).toHaveLength(5);
    expect(savedProject.project.maps[0]?.state.buildings).toContainEqual(
      expect.objectContaining({ buildingId: "Coop", x: 39, y: 27 }),
    );
  });

  it("does not store a preview if the active project session changes during encoding", async () => {
    const repository = createEmptyProjectRepository();
    const workspaceController = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: [],
    });
    let plannerWorkspaceState = createInitialPlannerWorkspaceState("standard");
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        plannerWorkspaceState = reducePlannerWorkspaceState(
          plannerWorkspaceState,
          plannerWorkspaceAction,
        );
      },
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: { activeSession: null },
      workspaceController,
    });
    const pngBlob = new Blob(["current map"], { type: "image/png" });
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(async () => pngBlob),
    });
    persistenceRuntime.saveCurrentMap();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    const activeProjectId = workspaceController.getState().activeProject?.id;
    if (activeProjectId === undefined) {
      throw new Error("Expected smart-save to create a local project.");
    }
    vi.mocked(encodePngAsWebp).mockImplementationOnce(async () => {
      workspaceController.clearActiveProject();
      return createWebpBytes(3);
    });

    await expect(
      persistenceRuntime.saveCurrentMapAndRefreshThumbnail(),
    ).rejects.toBeInstanceOf(MapImageExportError);

    expect(repository.openProject(activeProjectId).thumbnailsByMapId).toEqual({});
    expect(repository.listProjects()[0]?.activeMapThumbnailDataUrl).toBeNull();
  });

  it("does not save a preview if the layout changes during encoding", async () => {
    const repository = createEmptyProjectRepository();
    const workspaceController = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: [],
    });
    const savedMapRenderOptions = createMapRenderOptionsWithSpouseAndCave();
    let plannerWorkspaceState = {
      ...createInitialPlannerWorkspaceState("standard"),
      mapRenderOptions: savedMapRenderOptions,
    };
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
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
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    const activeSession = workspaceController.getState().activeSession;
    if (activeSession === null) {
      throw new Error("Expected smart-save to create a canonical map session.");
    }
    const pngBlob = new Blob(["current map"], { type: "image/png" });
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(async () => pngBlob),
    });
    const changedMapRenderOptions = restoreMapRenderOptions({
      ...createInitialMapRenderOptions(),
      gingerIslandOverlayIds: ["bin"],
      farm: { spouseId: null, caveChoice: "mushrooms" },
    });
    vi.mocked(encodePngAsWebp).mockImplementationOnce(async () => {
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        mapRenderOptions: changedMapRenderOptions,
        type: "set-map-render-options",
      });
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );
      return createWebpBytes(5);
    });

    await expect(
      persistenceRuntime.saveCurrentMapAndRefreshThumbnail(),
    ).rejects.toThrow('changed fields ["mapRenderOptions"]');

    const savedProject = repository.openProject(activeSession.projectId);
    expect(
      savedProject.project.maps.find(
        (projectMap) => projectMap.id === activeSession.mapId,
      )?.state.mapRenderOptions,
    ).toEqual(savedMapRenderOptions);
    expect(savedProject.thumbnailsByMapId).toEqual({});
    expect(repository.listProjects()[0]?.activeMapThumbnailDataUrl).toBeNull();
  });

  it("does not store a preview if the current exporter is cleared during capture", async () => {
    const repository = createEmptyProjectRepository();
    const workspaceController = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: [],
    });
    let plannerWorkspaceState = createInitialPlannerWorkspaceState("standard");
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        plannerWorkspaceState = reducePlannerWorkspaceState(
          plannerWorkspaceState,
          plannerWorkspaceAction,
        );
      },
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: { activeSession: null },
      workspaceController,
    });
    const pngBlob = new Blob(["current map"], { type: "image/png" });
    persistenceRuntime.saveCurrentMap();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    const activeProjectId = workspaceController.getState().activeProject?.id;
    if (activeProjectId === undefined) {
      throw new Error("Expected smart-save to create a local project.");
    }
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(async () => {
        persistenceRuntime.clearMapImageExporter("standard");
        return pngBlob;
      }),
    });
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(createWebpBytes(4));

    await expect(
      persistenceRuntime.saveCurrentMapAndRefreshThumbnail(),
    ).rejects.toBeInstanceOf(MapImageExportError);

    expect(repository.openProject(activeProjectId).thumbnailsByMapId).toEqual({});
    expect(repository.listProjects()[0]?.activeMapThumbnailDataUrl).toBeNull();
  });

  it("does not save a preview if the current Coop placement changes during encoding", async () => {
    const repository = createEmptyProjectRepository();
    const workspaceController = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: [],
    });
    let plannerWorkspaceState = createPlannerWorkspaceStateWithCoop();
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        plannerWorkspaceState = reducePlannerWorkspaceState(
          plannerWorkspaceState,
          plannerWorkspaceAction,
        );
      },
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: { activeSession: null },
      workspaceController,
    });
    const pngBlob = new Blob(["current map"], { type: "image/png" });
    persistenceRuntime.saveCurrentMap();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    const activeSession = workspaceController.getState().activeSession;
    if (activeSession === null) {
      throw new Error("Expected smart-save to create a canonical map session.");
    }
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(async () => pngBlob),
    });
    vi.mocked(encodePngAsWebp).mockImplementationOnce(async () => {
      const currentCoopPlacement = plannerWorkspaceState.placementHistory.currentState
        .buildings.find((building) => building.buildingId === "Coop");
      if (currentCoopPlacement === undefined) {
        throw new Error("Expected the canonical map to retain the saved Coop placement.");
      }
      const movedPlacementSnapshot = applyPlacementSnapshotAction(
        plannerWorkspaceState.placementHistory.currentState,
        {
          building: { ...currentCoopPlacement, x: currentCoopPlacement.x + 1 },
          type: "replace-building",
        },
      );
      plannerWorkspaceState = {
        ...plannerWorkspaceState,
        placementHistory: {
          ...plannerWorkspaceState.placementHistory,
          currentState: movedPlacementSnapshot,
        },
      };
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );
      return createWebpBytes(7);
    });

    await expect(
      persistenceRuntime.saveCurrentMapAndRefreshThumbnail(),
    ).rejects.toThrow('changed fields ["placementSnapshot"]');

    const savedProject = repository.openProject(activeSession.projectId);
    expect(savedProject.project.maps.find(
      (projectMap) => projectMap.id === activeSession.mapId,
    )?.state.buildings).toEqual(expect.arrayContaining([
      expect.objectContaining({ buildingId: "Coop", x: 39, y: 27 }),
    ]));
    expect(savedProject.thumbnailsByMapId).toEqual({});
  });
});
