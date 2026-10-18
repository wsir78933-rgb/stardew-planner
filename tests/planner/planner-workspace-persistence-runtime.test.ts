import { afterEach, describe, expect, it, vi } from "vitest";
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
import {
  automaticMapSaveDelayMilliseconds,
  createAutomaticMapSaveLayoutKey,
  createPlannerWorkspacePersistenceRuntime,
} from "../../src/planner/planner-workspace-persistence-runtime";
import { createPlannerLocalProjectActions } from "../../src/planner/planner-workspace-project-actions";
import {
  createReferenceProjectRepository,
  referenceProjectStorageKey,
} from "../../src/reference-runtime/reference-project-repository";
import type { ReferenceStoredProject } from "../../src/reference-runtime/local-project-api";
import { createReferenceProjectWorkspaceController } from "../../src/reference-runtime/use-reference-project-workspace";

vi.mock("../../src/projects/browser-png-to-webp", () => ({
  encodePngAsWebp: vi.fn(),
}));

function createStoredProjectWithoutSession(): ReferenceStoredProject {
  return {
    id: "project-with-maps",
    title: "Farm",
    created_at: "2026-08-13T00:00:01.000Z",
    updated_at: "2026-08-13T00:00:01.000Z",
    project: {
      version: 4,
      gameVersion: "1.6.15",
      projectName: "Farm",
      season: "spring",
      activeMapId: "map-standard",
      maps: [
        {
          id: "map-standard",
          mapFile: "Farm.tmx",
          label: "Standard Farm",
          season: "spring",
          state: {},
          decor: { floors: {}, wallpapers: {} },
          renovations: [],
          thumbnail: "/api/projects/project-with-maps/maps/map-standard/thumbnail",
        },
      ],
    },
  };
}

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

describe("planner workspace automatic local save", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("changes the automatic save key for layout, season, and render options", () => {
    const initialPlannerWorkspaceState = createInitialPlannerWorkspaceState("standard");
    const initialAutomaticSaveKey = createAutomaticMapSaveLayoutKey(
      initialPlannerWorkspaceState,
    );
    const seasonChangedState = reducePlannerWorkspaceState(initialPlannerWorkspaceState, {
      season: "winter",
      type: "select-season",
    });
    const renderOptionsChangedState = reducePlannerWorkspaceState(
      initialPlannerWorkspaceState,
      {
        mapRenderOptions: createMapRenderOptionsWithSpouseAndCave(),
        type: "set-map-render-options",
      },
    );
    const layoutChangedState = reducePlannerWorkspaceState(initialPlannerWorkspaceState, {
      placementSnapshot: {
        ...initialPlannerWorkspaceState.placementHistory.currentState,
        crops: [{ cropId: "crop:24", x: 4, y: 6 }],
      },
      type: "reset-placement-history",
    });
    const savePanelOpenedState = reducePlannerWorkspaceState(initialPlannerWorkspaceState, {
      modalId: "save-panel",
      type: "open-modal",
    });

    expect(createAutomaticMapSaveLayoutKey(seasonChangedState)).not.toBe(
      initialAutomaticSaveKey,
    );
    expect(createAutomaticMapSaveLayoutKey(renderOptionsChangedState)).not.toBe(
      initialAutomaticSaveKey,
    );
    expect(createAutomaticMapSaveLayoutKey(layoutChangedState)).not.toBe(
      initialAutomaticSaveKey,
    );
    expect(createAutomaticMapSaveLayoutKey(savePanelOpenedState)).toBe(
      initialAutomaticSaveKey,
    );
  });

  it("saves a new plan preview, then reloads the debounced layout, season, and render options", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const projectStorage = createBrowserProjectStorage();
    const repository = createRepositoryForBrowserStorage(projectStorage);
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
      newProjectName: "Untitled Project",
      workspaceController,
    });
    const pngBlob = new Blob(["new plan preview"], { type: "image/png" });
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(async () => pngBlob),
    });
    const firstPreviewBytes = createWebpBytes(31);
    const editedPreviewBytes = createWebpBytes(32);
    vi.mocked(encodePngAsWebp)
      .mockResolvedValueOnce(firstPreviewBytes)
      .mockResolvedValueOnce(editedPreviewBytes);
    const firstPreviewDataUrl = createWebpDataUrl(firstPreviewBytes);
    const editedPreviewDataUrl = createWebpDataUrl(editedPreviewBytes);

    await persistenceRuntime.createProjectWithCurrentMap();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );

    const createdProjectId = workspaceController.getState().activeProject?.id;
    if (createdProjectId === undefined) {
      throw new Error("Expected New plan to create a project ID.");
    }
    const savedBeforeEdit = readStoredAutomaticSaveProject(
      projectStorage,
      createdProjectId,
    );
    expect(savedBeforeEdit.projectCount).toBe(1);
    expect(savedBeforeEdit.storedMap.state.buildings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ buildingId: "Coop", x: 39, y: 27 }),
      ]),
    );
    expect(savedBeforeEdit.previewDataUrl).toBe(firstPreviewDataUrl);
    expect(savedBeforeEdit.storedMaps).toHaveLength(1);

    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      season: "winter",
      type: "select-season",
    });
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(1);
    expect(readStoredAutomaticSaveProject(projectStorage, createdProjectId).storedMap.season)
      .toBe(savedBeforeEdit.storedMap.season);

    const editedMapRenderOptions = createMapRenderOptionsWithSpouseAndCave();
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      mapRenderOptions: editedMapRenderOptions,
      type: "set-map-render-options",
    });
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      placementSnapshot: {
        ...plannerWorkspaceState.placementHistory.currentState,
        crops: [{ cropId: "crop:24", x: 4, y: 6 }],
      },
      type: "reset-placement-history",
    });
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(1);
    expect(
      readStoredAutomaticSaveProject(projectStorage, createdProjectId).storedMap.state
        .mapRenderOptions,
    ).toEqual(savedBeforeEdit.storedMap.state.mapRenderOptions);

    await vi.advanceTimersByTimeAsync(1);

    const savedAfterEdit = readStoredAutomaticSaveProject(
      projectStorage,
      createdProjectId,
    );
    expect(savedAfterEdit.projectCount).toBe(1);
    expect(savedAfterEdit.storedMaps).toHaveLength(1);
    expect(savedAfterEdit.storedMap.season).toBe("winter");
    expect(savedAfterEdit.storedMap.state.mapRenderOptions).toEqual(editedMapRenderOptions);
    expect(savedAfterEdit.storedMap.state.crops).toEqual([
      { cropId: "crop:24", x: 4, y: 6 },
    ]);
    expect(savedAfterEdit.storedMap.state.buildings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ buildingId: "Coop", x: 39, y: 27 }),
      ]),
    );
    expect(savedAfterEdit.previewDataUrl).toBe(editedPreviewDataUrl);
    expect(projectStorage.writtenStorageKeys).toContain(referenceProjectStorageKey);
    expect(
      projectStorage.writtenStorageKeys.filter(
        (storageKey) => storageKey !== referenceProjectStorageKey,
      ),
    ).toEqual([]);
  });

  it("reports an automatic save failure and keeps the last saved season", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const settledErrors: unknown[] = [];
    const projectStorage = createBrowserProjectStorage();
    const repository = createRepositoryForBrowserStorage(projectStorage);
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
      onAutomaticSaveSettled: (caughtError) => {
        settledErrors.push(caughtError);
      },
      workspaceController,
    });
    const pngBlob = new Blob(["map preview"], { type: "image/png" });
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(async () => pngBlob),
    });
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(createWebpBytes(33));
    await persistenceRuntime.createProjectWithCurrentMap();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    const createdProjectId = workspaceController.getState().activeProject?.id;
    if (createdProjectId === undefined) {
      throw new Error("Expected the saved project to keep its project ID.");
    }
    const encodingError = new Error(
      'WebP encoding failed for planner map ID "standard".',
    );
    vi.mocked(encodePngAsWebp).mockRejectedValueOnce(encodingError);
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      season: "summer",
      type: "select-season",
    });
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );

    persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);

    expect(settledErrors).toEqual([encodingError]);
    expect(
      readStoredAutomaticSaveProject(projectStorage, createdProjectId).storedMap.season,
    ).toBe("spring");
  });

  it("does not create a project or map when no current map is open", async () => {
    vi.useFakeTimers();
    const projectStorage = createBrowserProjectStorage();
    const repository = createRepositoryForBrowserStorage(projectStorage);
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

    persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);
    expect(repository.listProjects()).toEqual([]);
    expect(projectStorage.writtenStorageKeys).toEqual([]);

    workspaceController.createProject({
      projectName: "Empty Project",
      season: "spring",
    });
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      season: "fall",
      type: "select-season",
    });
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);

    expect(repository.listProjects()).toHaveLength(1);
    expect(workspaceController.getState().activeProject?.project.maps).toEqual([]);
    expect(workspaceController.getState().activeSession).toBeNull();
  });

  it("rejects an automatic save when a project map has no canonical session", () => {
    const storedProject = createStoredProjectWithoutSession();
    const createProject = vi.fn();
    const createProjectWithFirstMap = vi.fn();
    const createMap = vi.fn();
    const workspaceController = {
      clearActiveProject: vi.fn(),
      createMap,
      createProject,
      createProjectWithFirstMap,
      getPlannerMapIdForMapFile: (mapFile: string) => {
        if (mapFile === "Farm.tmx") return "standard";
        throw new Error(`Unexpected map file ${JSON.stringify(mapFile)}.`);
      },
      getState: () => ({
        activeProject: storedProject,
        activeSession: null,
        folders: [],
        projectSummaries: [],
      }),
      saveOpenMap: vi.fn(),
      saveThumbnail: vi.fn(),
    };
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: vi.fn(),
      initialPlannerWorkspaceState: createInitialPlannerWorkspaceState("standard"),
      initialWorkspaceState: { activeSession: null },
      workspaceController,
    });

    expect(() => persistenceRuntime.scheduleAutomaticSave()).toThrow(
      /project ID "project-with-maps"/,
    );
    expect(() => persistenceRuntime.scheduleAutomaticSave()).toThrow(
      /map IDs \["map-standard"\]/,
    );
    expect(() => persistenceRuntime.scheduleAutomaticSave()).toThrow(
      /session map ID null/,
    );
    expect(createProject).not.toHaveBeenCalled();
    expect(createProjectWithFirstMap).not.toHaveBeenCalled();
    expect(createMap).not.toHaveBeenCalled();
  });

  it("saves the pending canonical map before handleMapChange switches planner maps", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const firstPreviewBytes = createWebpBytes(51);
    const editedPreviewBytes = createWebpBytes(52);
    const projectId = await openSavedCoopPlan(harness, firstPreviewBytes);
    const savedBeforeEdit = readStoredAutomaticSaveProject(harness.projectStorage, projectId);
    const editedMapRenderOptions = createMapRenderOptionsWithSpouseAndCave();

    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.editPlannerWorkspaceState({
      mapRenderOptions: editedMapRenderOptions,
      type: "set-map-render-options",
    });
    harness.editPlannerWorkspaceState({
      placementSnapshot: {
        ...harness.plannerWorkspaceState().placementHistory.currentState,
        crops: [{ cropId: "crop:24", x: 4, y: 6 }],
      },
      type: "reset-placement-history",
    });
    harness.persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);

    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(1);
    expect(readStoredAutomaticSaveProject(harness.projectStorage, projectId).storedMap.season)
      .toBe(savedBeforeEdit.storedMap.season);
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(editedPreviewBytes);
    harness.beginRecordingMapChangeOrder();

    await harness.persistenceRuntime.handleMapChange("forest");

    const savedAfterSwitch = readStoredAutomaticSaveProject(
      harness.projectStorage,
      projectId,
    );
    expect(harness.mapChangeOrder).toEqual([
      "capture-old-map",
      "select-map",
      "clear-exporter",
    ]);
    expect(savedAfterSwitch.projectCount).toBe(1);
    expect(savedAfterSwitch.storedMaps).toHaveLength(1);
    expect(savedAfterSwitch.storedMap.mapFile).toBe("Farm.tmx");
    expect(savedAfterSwitch.storedMap.season).toBe("winter");
    expect(savedAfterSwitch.storedMap.state.mapRenderOptions).toEqual(editedMapRenderOptions);
    expect(savedAfterSwitch.storedMap.state.crops).toEqual([
      { cropId: "crop:24", x: 4, y: 6 },
    ]);
    expect(savedAfterSwitch.storedMap.state.buildings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ buildingId: "Coop", x: 39, y: 27 }),
      ]),
    );
    expect(savedAfterSwitch.previewDataUrl).toBe(createWebpDataUrl(editedPreviewBytes));
    expect(harness.plannerWorkspaceState()).toMatchObject({
      activeMapId: null,
      activeProjectId: null,
      selectedPlannerMapId: "forest",
    });
    expect(harness.repository.listProjects()).toHaveLength(1);
  });

  it("waits for an in-flight preview before handleMapChange leaves the old map", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(61));
    const editedPreviewBytes = createWebpBytes(62);
    const pngBlob = new Blob(["in-flight preview"], { type: "image/png" });
    const pendingCapture: {
      release: ((capturedPngBlob: Blob) => void) | null;
    } = { release: null };
    harness.persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(() => {
        harness.mapChangeOrder.push("capture-old-map");
        if (harness.workspaceController.getState().activeSession === null) {
          throw new Error(
            "Expected the old canonical session to stay open during in-flight thumbnail capture; "
              + `received planner map ID ${JSON.stringify(harness.plannerWorkspaceState().selectedPlannerMapId)}.`,
          );
        }
        return new Promise<Blob>((resolve) => {
          pendingCapture.release = resolve;
        });
      }),
    });
    harness.editPlannerWorkspaceState({ season: "summer", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    harness.beginRecordingMapChangeOrder();
    vi.advanceTimersByTime(automaticMapSaveDelayMilliseconds);
    for (let microtaskCount = 0; microtaskCount < 10; microtaskCount += 1) {
      await Promise.resolve();
    }
    const releaseCapture = pendingCapture.release;
    if (releaseCapture === null) {
      throw new Error(
        "Expected the debounced automatic save to start thumbnail capture before the map change.",
      );
    }

    const mapChangePromise = harness.persistenceRuntime.handleMapChange("forest");
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    expect(harness.mapChangeOrder).toEqual(["capture-old-map"]);
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(editedPreviewBytes);
    releaseCapture(pngBlob);
    await mapChangePromise;

    const savedAfterSwitch = readStoredAutomaticSaveProject(
      harness.projectStorage,
      projectId,
    );
    expect(harness.mapChangeOrder).toEqual([
      "capture-old-map",
      "select-map",
      "clear-exporter",
    ]);
    expect(savedAfterSwitch.storedMaps).toHaveLength(1);
    expect(savedAfterSwitch.storedMap.mapFile).toBe("Farm.tmx");
    expect(savedAfterSwitch.storedMap.season).toBe("summer");
    expect(savedAfterSwitch.previewDataUrl).toBe(createWebpDataUrl(editedPreviewBytes));
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("forest");
    expect(harness.repository.listProjects()).toHaveLength(1);
  });

  it("retries a thumbnail captured before handleMapChange only for the latest canonical snapshot", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(71));
    const latestPreviewBytes = createWebpBytes(72);
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
    vi.mocked(encodePngAsWebp).mockImplementationOnce(async () => {
      harness.editPlannerWorkspaceState({ season: "fall", type: "select-season" });
      harness.editPlannerWorkspaceState({
        placementSnapshot: {
          ...harness.plannerWorkspaceState().placementHistory.currentState,
          crops: [{ cropId: "crop:24", x: 8, y: 9 }],
        },
        type: "reset-placement-history",
      });
      return createWebpBytes(70);
    });
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(latestPreviewBytes);
    harness.beginRecordingMapChangeOrder();

    await harness.persistenceRuntime.handleMapChange("forest");

    const savedAfterSwitch = readStoredAutomaticSaveProject(
      harness.projectStorage,
      projectId,
    );
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(3);
    expect(harness.mapChangeOrder).toEqual([
      "capture-old-map",
      "capture-old-map",
      "select-map",
      "clear-exporter",
    ]);
    expect(savedAfterSwitch.storedMaps).toHaveLength(1);
    expect(savedAfterSwitch.storedMap.mapFile).toBe("Farm.tmx");
    expect(savedAfterSwitch.storedMap.season).toBe("fall");
    expect(savedAfterSwitch.storedMap.state.crops).toEqual([
      { cropId: "crop:24", x: 8, y: 9 },
    ]);
    expect(savedAfterSwitch.previewDataUrl).toBe(createWebpDataUrl(latestPreviewBytes));
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("forest");
  });

  it("keeps a failed map change on the current map, reports it, and retries the same edit", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(81));
    const encodingError = new Error(
      'WebP encoding failed for planner map ID "standard".',
    );
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.editPlannerWorkspaceState({
      placementSnapshot: {
        ...harness.plannerWorkspaceState().placementHistory.currentState,
        crops: [{ cropId: "crop:24", x: 4, y: 6 }],
      },
      type: "reset-placement-history",
    });
    harness.persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
    vi.mocked(encodePngAsWebp).mockRejectedValueOnce(encodingError);

    await harness.persistenceRuntime.handleMapChange("forest");

    expect(harness.settledErrors).toEqual([encodingError]);
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    expect(harness.plannerWorkspaceState().season).toBe("winter");
    expect(harness.plannerWorkspaceState().placementHistory.currentState.crops).toEqual([
      { cropId: "crop:24", x: 4, y: 6 },
    ]);
    expect(readStoredAutomaticSaveProject(harness.projectStorage, projectId).storedMap.season)
      .toBe("spring");
    expect(harness.repository.listProjects()).toHaveLength(1);
    expect(harness.workspaceController.getState().activeSession).not.toBeNull();

    const retriedPreviewBytes = createWebpBytes(82);
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(retriedPreviewBytes);
    await harness.persistenceRuntime.handleMapChange("forest");

    const savedAfterRetry = readStoredAutomaticSaveProject(
      harness.projectStorage,
      projectId,
    );
    expect(savedAfterRetry.storedMaps).toHaveLength(1);
    expect(savedAfterRetry.storedMap.mapFile).toBe("Farm.tmx");
    expect(savedAfterRetry.storedMap.season).toBe("winter");
    expect(savedAfterRetry.storedMap.state.crops).toEqual([
      { cropId: "crop:24", x: 4, y: 6 },
    ]);
    expect(savedAfterRetry.previewDataUrl).toBe(createWebpDataUrl(retriedPreviewBytes));
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("forest");
    expect(harness.settledErrors).toEqual([encodingError, null]);
    expect(harness.repository.listProjects()).toHaveLength(1);
  });

  it("does not retry a map change onto another planner map when the canonical session disappears", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(91));
    const savedBeforeEdit = readStoredAutomaticSaveProject(harness.projectStorage, projectId);
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
    vi.mocked(encodePngAsWebp).mockImplementationOnce(async () => {
      harness.workspaceController.clearActiveProject();
      harness.persistenceRuntime.updateWorkspaceSnapshot(
        harness.plannerWorkspaceState(),
        { activeSession: null },
      );
      return createWebpBytes(90);
    });
    harness.beginRecordingMapChangeOrder();

    await harness.persistenceRuntime.handleMapChange("forest");

    const savedAfterBlockedChange = readStoredAutomaticSaveProject(
      harness.projectStorage,
      projectId,
    );
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(2);
    expect(harness.mapChangeOrder).toEqual(["capture-old-map"]);
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    expect(harness.plannerWorkspaceState().season).toBe("winter");
    expect(savedAfterBlockedChange.storedMaps).toHaveLength(1);
    expect(savedAfterBlockedChange.storedMap.mapFile).toBe("Farm.tmx");
    expect(savedAfterBlockedChange.storedMap.season).toBe(savedBeforeEdit.storedMap.season);
    expect(savedAfterBlockedChange.previewDataUrl).toBe(savedBeforeEdit.previewDataUrl);
    expect(harness.repository.listProjects()).toHaveLength(1);
    expect(harness.settledErrors).toHaveLength(1);
    expect(harness.settledErrors[0]).toBeInstanceOf(MapImageExportError);
    expect(harness.settledErrors).not.toContain(null);
  });

  it("does not clear the last automatic save error when the canonical session is already gone", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(101));
    const encodingError = new Error(
      'WebP encoding failed for planner map ID "standard".',
    );
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    vi.mocked(encodePngAsWebp).mockRejectedValueOnce(encodingError);
    await harness.persistenceRuntime.handleMapChange("forest");
    expect(harness.settledErrors).toEqual([encodingError]);

    harness.editPlannerWorkspaceState({ season: "fall", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    harness.workspaceController.clearActiveProject();
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      { activeSession: null },
    );
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);

    expect(harness.settledErrors).toEqual([encodingError]);
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    expect(harness.plannerWorkspaceState().season).toBe("fall");
    const savedAfterMissingSession = readStoredAutomaticSaveProject(
      harness.projectStorage,
      projectId,
    );
    expect(savedAfterMissingSession.storedMap.season).toBe("spring");
    expect(savedAfterMissingSession.storedMaps).toHaveLength(1);
    expect(savedAfterMissingSession.storedMap.mapFile).toBe("Farm.tmx");
    expect(harness.repository.listProjects()).toHaveLength(1);
    expect(harness.workspaceController.getState().activeProject).toBeNull();
  });

  it("finishes the first preview save before handleMapChange clears the new project", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    const harness = createAutomaticMapChangeHarness();
    const editedMapRenderOptions = createMapRenderOptionsWithSpouseAndCave();
    const previewBytes = createWebpBytes(121);
    const deferredScreenshot = installDeferredFirstMapScreenshot(harness);
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.editPlannerWorkspaceState({
      mapRenderOptions: editedMapRenderOptions,
      type: "set-map-render-options",
    });
    harness.editPlannerWorkspaceState({
      placementSnapshot: {
        ...harness.plannerWorkspaceState().placementHistory.currentState,
        crops: [{ cropId: "crop:24", x: 4, y: 6 }],
      },
      type: "reset-placement-history",
    });
    harness.beginRecordingMapChangeOrder();
    const firstSaveResult = watchPreviewSave(
      harness.persistenceRuntime.createProjectWithCurrentMap(),
    );
    await flushQueuedPreviewWork();
    expect(deferredScreenshot.isWaiting).toBe(true);

    const mapChangePromise = harness.persistenceRuntime.handleMapChange("forest");
    await flushQueuedPreviewWork();

    expect(harness.mapChangeOrder).toEqual(["capture-first-map"]);
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    expect(harness.workspaceController.getState().activeProject).toBeNull();
    expect(harness.repository.listProjects()).toEqual([]);
    expect(harness.projectStorage.writtenStorageKeys).toEqual([]);
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(previewBytes);
    deferredScreenshot.release(new Blob(["first map preview"], { type: "image/png" }));
    await mapChangePromise;

    expect(await firstSaveResult).toBeNull();
    const projectId = harness.repository.listProjects()[0]?.id;
    if (projectId === undefined) {
      throw new Error("Expected the first preview save to create one project ID.");
    }
    const savedFirstMap = readStoredAutomaticSaveProject(harness.projectStorage, projectId);
    expect(harness.projectStorage.writtenStorageKeys).toEqual([referenceProjectStorageKey]);
    expect(harness.mapChangeOrder).toEqual([
      "capture-first-map",
      "select-map",
      "clear-exporter",
    ]);
    expect(savedFirstMap.storedMaps).toHaveLength(1);
    expect(savedFirstMap.storedMap.mapFile).toBe("Farm.tmx");
    expect(savedFirstMap.storedMap.season).toBe("winter");
    expect(savedFirstMap.storedMap.state.mapRenderOptions).toEqual(editedMapRenderOptions);
    expect(savedFirstMap.storedMap.state.crops).toEqual([
      { cropId: "crop:24", x: 4, y: 6 },
    ]);
    expect(savedFirstMap.storedMap.state.buildings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ buildingId: "Coop", x: 39, y: 27 }),
      ]),
    );
    expect(savedFirstMap.previewDataUrl).toBe(createWebpDataUrl(previewBytes));
    expect(harness.repository.listProjects()).toHaveLength(1);
    expect(harness.plannerWorkspaceState()).toMatchObject({
      activeMapId: null,
      activeProjectId: null,
      selectedPlannerMapId: "forest",
    });
    expect(harness.settledErrors).toEqual([]);
  });

  it("does not leave an empty project when the first preview capture fails", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    const harness = createAutomaticMapChangeHarness();
    const deferredScreenshot = installDeferredFirstMapScreenshot(harness);
    const captureError = new Error(
      'Cannot capture the first map preview for planner map ID "standard".',
    );
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.beginRecordingMapChangeOrder();
    const firstSaveResult = watchPreviewSave(
      harness.persistenceRuntime.createProjectWithCurrentMap(),
    );
    await flushQueuedPreviewWork();
    expect(deferredScreenshot.isWaiting).toBe(true);

    const mapChangePromise = harness.persistenceRuntime.handleMapChange("forest");
    await flushQueuedPreviewWork();
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    expect(harness.repository.listProjects()).toEqual([]);
    deferredScreenshot.fail(captureError);
    await mapChangePromise;

    expect(await firstSaveResult).toBe(captureError);
    expect(harness.settledErrors).toEqual([captureError]);
    expect(harness.mapChangeOrder).toEqual(["capture-first-map"]);
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    expect(harness.plannerWorkspaceState().season).toBe("winter");
    expect(harness.workspaceController.getState().activeProject).toBeNull();
    expect(harness.workspaceController.getState().activeSession).toBeNull();
    expect(harness.repository.listProjects()).toEqual([]);
    expect(harness.projectStorage.writtenStorageKeys).toEqual([]);
    expect(vi.mocked(encodePngAsWebp)).not.toHaveBeenCalled();
  });

  it("changes maps after a failed first preview without creating an empty project", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    const harness = createAutomaticMapChangeHarness();
    const deferredScreenshot = installDeferredFirstMapScreenshot(harness);
    const captureError = new Error(
      'Cannot capture the first map preview for planner map ID "standard".',
    );
    const canvasCrops = [{ cropId: "crop:24", x: 4, y: 6 }];
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.editPlannerWorkspaceState({
      placementSnapshot: {
        ...harness.plannerWorkspaceState().placementHistory.currentState,
        crops: canvasCrops,
      },
      type: "reset-placement-history",
    });
    harness.beginRecordingMapChangeOrder();
    const firstSaveResult = watchPreviewSave(
      harness.persistenceRuntime.createProjectWithCurrentMap(),
    );
    await flushQueuedPreviewWork();
    expect(deferredScreenshot.isWaiting).toBe(true);

    const blockedMapChange = harness.persistenceRuntime.handleMapChange("forest");
    await flushQueuedPreviewWork();
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    deferredScreenshot.fail(captureError);
    await blockedMapChange;

    expect(await firstSaveResult).toBe(captureError);
    expect(harness.settledErrors).toEqual([captureError]);
    expect(harness.mapChangeOrder).toEqual(["capture-first-map"]);
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
    expect(harness.plannerWorkspaceState().season).toBe("winter");
    expect(harness.plannerWorkspaceState().placementHistory.currentState.crops).toEqual(
      canvasCrops,
    );
    expect(harness.workspaceController.getState().activeProject).toBeNull();
    expect(harness.repository.listProjects()).toEqual([]);
    expect(harness.projectStorage.writtenStorageKeys).toEqual([]);

    await harness.persistenceRuntime.handleMapChange("forest");

    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("forest");
    expect(harness.plannerWorkspaceState().season).toBe("winter");
    expect(harness.settledErrors).toEqual([captureError]);
    expect(harness.repository.listProjects()).toEqual([]);
    expect(harness.workspaceController.getState().activeProject).toBeNull();
    expect(harness.workspaceController.getState().activeSession).toBeNull();
    expect(vi.mocked(encodePngAsWebp)).not.toHaveBeenCalled();
  });

  it("does not write the captured map onto another project when the active project changes", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    const harness = createAutomaticMapChangeHarness();
    const existingProjectId = await openSavedCoopPlan(harness, createWebpBytes(141));
    const emptyProject = harness.repository.createProject({
      projectName: "Historical Empty",
      season: "spring",
    });
    const storedDocumentBeforeCreate = harness.projectStorage.getItem(referenceProjectStorageKey);
    const writeCountBeforeCreate = harness.projectStorage.writtenStorageKeys.length;
    const encodeCallsBeforeCreate = vi.mocked(encodePngAsWebp).mock.calls.length;
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(createWebpBytes(142));
    harness.workspaceController.openProject(existingProjectId);
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      harness.workspaceController.getState(),
    );
    const deferredScreenshot = installDeferredFirstMapScreenshot(harness);
    const createResult = watchPreviewSave(
      harness.persistenceRuntime.createProjectWithCurrentMap(),
    );
    await flushQueuedPreviewWork();
    expect(deferredScreenshot.isWaiting).toBe(true);
    expect(harness.repository.listProjects()).toHaveLength(2);

    harness.workspaceController.openProject(emptyProject.id);
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      harness.workspaceController.getState(),
    );
    deferredScreenshot.release(new Blob(["switched project preview"], { type: "image/png" }));
    const createError = await createResult;

    expect(createError).toBeInstanceOf(MapImageExportError);
    expect(createError instanceof Error ? createError.message : "").toContain(emptyProject.id);
    expect(harness.repository.listProjects().map((projectSummary) => projectSummary.id))
      .toEqual([existingProjectId, emptyProject.id]);
    expect(harness.repository.openProject(emptyProject.id).project.maps).toEqual([]);
    expect(harness.repository.openProject(existingProjectId).project.maps).toHaveLength(1);
    expect(harness.projectStorage.getItem(referenceProjectStorageKey)).toBe(
      storedDocumentBeforeCreate,
    );
    expect(harness.projectStorage.writtenStorageKeys).toHaveLength(writeCountBeforeCreate);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(encodeCallsBeforeCreate + 1);
  });

  it("drops a restored-snapshot debounce before handleMapChange and still saves the next map edit", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const standardProjectId = await openSavedCoopPlan(harness, createWebpBytes(131));
    const restoredPreviewBytes = createWebpBytes(132);
    const forestPreviewBytes = createWebpBytes(133);
    const laterForestPreviewBytes = createWebpBytes(134);
    const pngBlob = new Blob(["restored snapshot preview"], { type: "image/png" });
    const pendingCapture: {
      release: ((capturedPngBlob: Blob) => void) | null;
    } = { release: null };
    harness.persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(() => new Promise<Blob>((resolve) => {
        pendingCapture.release = resolve;
      })),
    });
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    vi.advanceTimersByTime(automaticMapSaveDelayMilliseconds);
    await flushQueuedPreviewWork();
    const releaseCapture = pendingCapture.release;
    if (releaseCapture === null) {
      throw new Error(
        "Expected the winter automatic save to be waiting on thumbnail capture for project "
          + `${JSON.stringify(standardProjectId)}.`,
      );
    }

    harness.editPlannerWorkspaceState({ season: "fall", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    harness.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(restoredPreviewBytes);
    releaseCapture(pngBlob);
    await flushQueuedPreviewWork();
    if (harness.settledErrors.length !== 1 || harness.settledErrors[0] !== null) {
      throw new Error(
        "Expected the restored winter snapshot to settle before the map change; received "
          + `${JSON.stringify(harness.settledErrors)} for project ${JSON.stringify(standardProjectId)}.`,
      );
    }

    await harness.persistenceRuntime.handleMapChange("forest");
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      harness.workspaceController.getState(),
    );
    expect(harness.plannerWorkspaceState().selectedPlannerMapId).toBe("forest");
    expect(harness.workspaceController.getState().activeSession).toBeNull();
    const forestPngBlob = new Blob(["forest map preview"], { type: "image/png" });
    harness.persistenceRuntime.handleMapImageExporterReady("forest", {
      captureCleanMapImage: vi.fn(async () => forestPngBlob),
      captureScreenshot: vi.fn(async () => forestPngBlob),
    });
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(forestPreviewBytes);
    await harness.persistenceRuntime.createProjectWithCurrentMap();
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      harness.workspaceController.getState(),
    );
    harness.persistenceRuntime.synchronizeCanonicalSession();
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      harness.workspaceController.getState(),
    );
    const forestProjectId = harness.workspaceController.getState().activeProject?.id;
    if (forestProjectId === undefined || forestProjectId === standardProjectId) {
      throw new Error(
        "Expected the forest map change to open a new project; received "
          + `${JSON.stringify(forestProjectId)} and standard project ${JSON.stringify(standardProjectId)}.`,
      );
    }
    const encodeCountAfterForestSave = vi.mocked(encodePngAsWebp).mock.calls.length;
    const settledCountAfterForestSave = harness.settledErrors.length;
    vi.mocked(encodePngAsWebp).mockResolvedValue(createWebpBytes(135));

    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);

    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(encodeCountAfterForestSave);
    expect(harness.settledErrors).toHaveLength(settledCountAfterForestSave);
    const forestProjectAfterOldTimer = harness.repository.openProject(forestProjectId);
    expect(forestProjectAfterOldTimer.project.maps).toHaveLength(1);
    expect(forestProjectAfterOldTimer.project.maps[0]?.mapFile).toBe("Farm_Foraging.tmx");
    expect(forestProjectAfterOldTimer.project.maps[0]?.season).toBe("winter");
    const standardProjectAfterOldTimer = harness.repository.openProject(standardProjectId);
    expect(standardProjectAfterOldTimer.project.maps).toHaveLength(1);
    expect(standardProjectAfterOldTimer.project.maps[0]?.mapFile).toBe("Farm.tmx");
    expect(standardProjectAfterOldTimer.project.maps[0]?.season).toBe("winter");

    harness.editPlannerWorkspaceState({ season: "summer", type: "select-season" });
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(laterForestPreviewBytes);
    harness.persistenceRuntime.scheduleAutomaticSave();
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(encodeCountAfterForestSave);
    expect(harness.repository.openProject(forestProjectId).project.maps[0]?.season).toBe("winter");

    await vi.advanceTimersByTimeAsync(1);

    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(encodeCountAfterForestSave + 1);
    const forestProjectAfterLaterEdit = harness.repository.openProject(forestProjectId);
    expect(forestProjectAfterLaterEdit.project.maps).toHaveLength(1);
    expect(forestProjectAfterLaterEdit.project.maps[0]?.season).toBe("summer");
    expect(harness.settledErrors.at(-1)).toBeNull();
    expect(harness.repository.openProject(standardProjectId).project.maps[0]?.season).toBe("winter");
  });

  it("saves the selected season after the map exporter returns", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(41));
    const storedProjectBeforeSeasonChange = harness.repository.openProject(projectId);
    expect(storedProjectBeforeSeasonChange.project.maps[0]?.season).toBe("spring");
    const updatedAtBeforeSeasonChange = storedProjectBeforeSeasonChange.updated_at;

    harness.editPlannerWorkspaceState({ season: "summer", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    harness.persistenceRuntime.handleMapImageExporterReady("standard", null);
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);

    const storedProjectAfterUnavailableExporter = harness.repository.openProject(projectId);
    expect(storedProjectAfterUnavailableExporter.project.maps[0]?.season).toBe("spring");
    expect(storedProjectAfterUnavailableExporter.updated_at).toBe(updatedAtBeforeSeasonChange);
    expect(harness.settledErrors.filter((settledError) => (
      settledError instanceof Error
      && settledError.message.includes("exporter is unavailable")
    ))).toEqual([]);

    const summerPreviewBytes = createWebpBytes(42);
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(summerPreviewBytes);
    const summerPreviewBlob = new Blob(["summer map preview"], { type: "image/png" });
    harness.persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => summerPreviewBlob),
      captureScreenshot: vi.fn(async () => summerPreviewBlob),
    });
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);

    const storedProjectAfterExporterReturns = harness.repository.openProject(projectId);
    expect(storedProjectAfterExporterReturns.project.maps[0]?.season).toBe("summer");
    expect(storedProjectAfterExporterReturns.updated_at).not.toBe(updatedAtBeforeSeasonChange);
    expect(harness.settledErrors.at(-1)).toBeNull();
    expect(readStoredAutomaticSaveProject(harness.projectStorage, projectId).storedMap.season)
      .toBe("summer");
  });

  it("flushes the pending map before Open, Duplicate, and Import", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(61));
    const pendingCrop = { cropId: "crop:24", x: 11, y: 12 };
    const otherProject = harness.repository.createProject({
      projectName: "Other Farm",
      season: "spring",
    });
    const serializedImport = createSerializedImportProject(harness);
    const projectActions = createPlannerLocalProjectActions({
      season: "spring",
      workspaceController: harness.workspaceController,
    });

    await editCanonicalMapWithoutWaitingForAutomaticSave(harness, [pendingCrop]);
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(createWebpBytes(62));
    await projectActions.onOpenProject(otherProject.id);

    expect(harness.workspaceController.getState().activeProject?.id).toBe(otherProject.id);
    expect(readStoredMapCrops(harness, projectId)).toEqual([pendingCrop]);
    expect(harness.repository.listProjects()).toHaveLength(2);
    const encodeCountAfterOpen = vi.mocked(encodePngAsWebp).mock.calls.length;
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(encodeCountAfterOpen);

    harness.workspaceController.openProject(projectId);
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      harness.workspaceController.getState(),
    );
    harness.persistenceRuntime.synchronizeCanonicalSession();
    await editCanonicalMapWithoutWaitingForAutomaticSave(harness, [
      { cropId: "crop:24", x: 13, y: 14 },
    ]);
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(createWebpBytes(63));
    const projectCountBeforeDuplicate = harness.repository.listProjects().length;
    await projectActions.onDuplicateProject(projectId);

    const duplicatedProjectId = harness.workspaceController.getState().activeProject?.id;
    if (duplicatedProjectId === undefined || duplicatedProjectId === projectId) {
      throw new Error(
        "Expected Duplicate to switch to the copied project. "
          + `Received ${JSON.stringify(duplicatedProjectId)} for source ${JSON.stringify(projectId)}.`,
      );
    }
    expect(readStoredMapCrops(harness, projectId)).toEqual([
      { cropId: "crop:24", x: 13, y: 14 },
    ]);
    expect(readStoredMapCrops(harness, duplicatedProjectId)).toEqual([
      { cropId: "crop:24", x: 13, y: 14 },
    ]);
    expect(harness.repository.listProjects()).toHaveLength(projectCountBeforeDuplicate + 1);

    harness.workspaceController.openProject(projectId);
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      harness.workspaceController.getState(),
    );
    harness.persistenceRuntime.synchronizeCanonicalSession();
    await editCanonicalMapWithoutWaitingForAutomaticSave(harness, [
      { cropId: "crop:24", x: 15, y: 16 },
    ]);
    vi.mocked(encodePngAsWebp).mockResolvedValueOnce(createWebpBytes(64));
    const projectCountBeforeImport = harness.repository.listProjects().length;
    await projectActions.onImportProject(serializedImport);

    const importedProjectId = harness.workspaceController.getState().activeProject?.id;
    if (
      importedProjectId === undefined
      || importedProjectId === projectId
      || importedProjectId === duplicatedProjectId
    ) {
      throw new Error(
        "Expected Import to switch to the imported project. "
          + `Received ${JSON.stringify(importedProjectId)}.`,
      );
    }
    expect(readStoredMapCrops(harness, projectId)).toEqual([
      { cropId: "crop:24", x: 15, y: 16 },
    ]);
    expect(harness.repository.listProjects()).toHaveLength(projectCountBeforeImport + 1);
    expect(harness.settledErrors.at(-1)).toBeNull();
  });

  it("does not switch, duplicate, or import when the pending map save fails", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(71));
    const savedCropsBeforeEdit = readStoredMapCrops(harness, projectId);
    const otherProject = harness.repository.createProject({
      projectName: "Other Farm",
      season: "spring",
    });
    const serializedImport = createSerializedImportProject(harness);
    const projectActions = createPlannerLocalProjectActions({
      season: "spring",
      workspaceController: harness.workspaceController,
    });
    const encodingError = new Error(
      'WebP encoding failed for planner map ID "standard".',
    );

    await editCanonicalMapWithoutWaitingForAutomaticSave(harness, [
      { cropId: "crop:24", x: 4, y: 6 },
    ]);
    vi.mocked(encodePngAsWebp).mockRejectedValueOnce(encodingError);
    const projectCountBeforeFailedOpen = harness.repository.listProjects().length;
    await expect(projectActions.onOpenProject(otherProject.id)).rejects.toBe(encodingError);

    expect(harness.workspaceController.getState().activeProject?.id).toBe(projectId);
    expect(readStoredMapCrops(harness, projectId)).toEqual(savedCropsBeforeEdit);
    expect(harness.repository.listProjects()).toHaveLength(projectCountBeforeFailedOpen);
    expect(harness.settledErrors).toEqual([encodingError]);

    vi.mocked(encodePngAsWebp).mockRejectedValueOnce(encodingError);
    await expect(projectActions.onDuplicateProject(projectId)).rejects.toBe(encodingError);
    expect(harness.repository.listProjects()).toHaveLength(projectCountBeforeFailedOpen);
    expect(harness.workspaceController.getState().activeProject?.id).toBe(projectId);

    vi.mocked(encodePngAsWebp).mockRejectedValueOnce(encodingError);
    await expect(projectActions.onImportProject(serializedImport)).rejects.toBe(encodingError);
    expect(harness.repository.listProjects()).toHaveLength(projectCountBeforeFailedOpen);
    expect(harness.workspaceController.getState().activeProject?.id).toBe(projectId);
    expect(harness.settledErrors).toEqual([encodingError, encodingError, encodingError]);
  });

  it("does not create a project when Open, Duplicate, and Import have no pending map edit", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(81));
    const otherProject = harness.repository.createProject({
      projectName: "Other Farm",
      season: "spring",
    });
    const serializedImport = createSerializedImportProject(harness);
    const projectActions = createPlannerLocalProjectActions({
      season: "spring",
      workspaceController: harness.workspaceController,
    });
    const encodeCountBeforeOpen = vi.mocked(encodePngAsWebp).mock.calls.length;
    const projectCountBeforeOpen = harness.repository.listProjects().length;

    await projectActions.onOpenProject(otherProject.id);

    expect(harness.workspaceController.getState().activeProject?.id).toBe(otherProject.id);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(encodeCountBeforeOpen);
    expect(harness.repository.listProjects()).toHaveLength(projectCountBeforeOpen);
    expect(harness.settledErrors).toEqual([]);

    const projectCountBeforeDuplicate = harness.repository.listProjects().length;
    await projectActions.onDuplicateProject(otherProject.id);
    expect(harness.repository.listProjects()).toHaveLength(projectCountBeforeDuplicate + 1);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(encodeCountBeforeOpen);

    const projectCountBeforeImport = harness.repository.listProjects().length;
    await projectActions.onImportProject(serializedImport);
    expect(harness.repository.listProjects()).toHaveLength(projectCountBeforeImport + 1);
    expect(harness.workspaceController.getState().activeProject?.id).not.toBe(projectId);
    expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(encodeCountBeforeOpen);
  });

  it("blocks Open while the map exporter is loading and still reports that save failure", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(91));
    const otherProject = harness.repository.createProject({
      projectName: "Other Farm",
      season: "spring",
    });
    const projectActions = createPlannerLocalProjectActions({
      season: "spring",
      workspaceController: harness.workspaceController,
    });
    harness.editPlannerWorkspaceState({ season: "summer", type: "select-season" });
    harness.persistenceRuntime.scheduleAutomaticSave();
    harness.persistenceRuntime.handleMapImageExporterReady("standard", null);
    await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);
    expect(harness.settledErrors).toEqual([]);
    expect(harness.repository.openProject(projectId).project.maps[0]?.season).toBe("spring");

    const blockedOpen = projectActions.onOpenProject(otherProject.id);
    await expect(blockedOpen).rejects.toThrow(/exporter planner map ID null/);

    expect(harness.workspaceController.getState().activeProject?.id).toBe(projectId);
    expect(harness.repository.listProjects()).toHaveLength(2);
    expect(harness.settledErrors).toHaveLength(1);
    const blockedOpenError = harness.settledErrors[0];
    expect(blockedOpenError).toBeInstanceOf(Error);
    if (!(blockedOpenError instanceof Error)) {
      throw new Error(
        "Expected the blocked Open to report an Error. "
          + `Received ${JSON.stringify(blockedOpenError)}.`,
      );
    }
    expect(blockedOpenError.message).toContain("exporter planner map ID null");
    expect(harness.repository.openProject(projectId).project.maps[0]?.season).toBe("spring");
  });

  it("keeps the open library on a folder duplicate so both plans stay in that folder", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    const harness = createAutomaticMapChangeHarness();
    const projectId = await openSavedCoopPlan(harness, createWebpBytes(51));
    const cropsFolder = harness.workspaceController.createFolder("Crops");
    harness.workspaceController.moveProjectToFolder(projectId, cropsFolder.id);
    harness.editPlannerWorkspaceState({
      modalId: "save-panel",
      type: "open-modal",
    });

    harness.workspaceController.duplicateProject(projectId);
    harness.persistenceRuntime.updateWorkspaceSnapshot(
      harness.plannerWorkspaceState(),
      harness.workspaceController.getState(),
    );
    harness.persistenceRuntime.synchronizeCanonicalSession();

    expect(harness.plannerWorkspaceState().modalId).toBe("save-panel");
    const projectSummaries = harness.workspaceController.getState().projectSummaries;
    expect(projectSummaries).toHaveLength(2);
    const duplicateSummary = projectSummaries.find(
      (projectSummary) => projectSummary.id !== projectId,
    );
    if (duplicateSummary === undefined) {
      throw new Error(
        `Expected duplicateProject to add a second summary. Received ${JSON.stringify(projectSummaries.map((projectSummary) => projectSummary.id))}.`,
      );
    }
    expect(projectSummaries.map((projectSummary) => projectSummary.folderId)).toEqual([
      cropsFolder.id,
      cropsFolder.id,
    ]);
    expect(harness.repository.openProject(projectId).folderId).toBe(cropsFolder.id);
    expect(harness.repository.openProject(duplicateSummary.id).folderId).toBe(cropsFolder.id);
  });
});

type BrowserProjectStorage = Readonly<{
  getItem: (storageKey: string) => string | null;
  setItem: (storageKey: string, serializedProjectDocument: string) => void;
  writtenStorageKeys: readonly string[];
}>;

function createBrowserProjectStorage(): BrowserProjectStorage {
  const storedEntries = new Map<string, string>();
  const writtenStorageKeys: string[] = [];
  return {
    writtenStorageKeys,
    getItem: (storageKey) => storedEntries.get(storageKey) ?? null,
    setItem: (storageKey, serializedProjectDocument) => {
      writtenStorageKeys.push(storageKey);
      storedEntries.set(storageKey, serializedProjectDocument);
    },
  };
}

function createRepositoryForBrowserStorage(projectStorage: BrowserProjectStorage) {
  let identifierSequence = 0;
  let timestampSequence = 0;
  return createReferenceProjectRepository({
    storage: projectStorage,
    createIdentifier: () => {
      identifierSequence += 1;
      return `autosave-${String(identifierSequence)}`;
    },
    now: () => {
      timestampSequence += 1;
      return `2026-08-12T00:00:${String(timestampSequence).padStart(2, "0")}.000Z`;
    },
  });
}

function createWebpDataUrl(webpBytes: Uint8Array): string {
  return `data:image/webp;base64,${Buffer.from(webpBytes).toString("base64")}`;
}

async function editCanonicalMapWithoutWaitingForAutomaticSave(
  harness: ReturnType<typeof createAutomaticMapChangeHarness>,
  crops: readonly { cropId: string; x: number; y: number }[],
): Promise<void> {
  harness.editPlannerWorkspaceState({
    placementSnapshot: {
      ...harness.plannerWorkspaceState().placementHistory.currentState,
      crops: [...crops],
    },
    type: "reset-placement-history",
  });
  harness.persistenceRuntime.scheduleAutomaticSave();
  await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
}

function createSerializedImportProject(
  harness: ReturnType<typeof createAutomaticMapChangeHarness>,
): string {
  const importedSourceProject = harness.repository.createProject({
    projectName: "Imported Farm",
    season: "spring",
  });
  const serializedProject = harness.repository.exportProject(importedSourceProject.id);
  harness.repository.deleteProject(importedSourceProject.id);
  if (serializedProject.length === 0) {
    throw new Error(
      `Expected the import fixture for project ${JSON.stringify(importedSourceProject.id)} to contain JSON.`,
    );
  }
  return serializedProject;
}

function readStoredMapCrops(
  harness: ReturnType<typeof createAutomaticMapChangeHarness>,
  projectId: string,
) {
  return readStoredAutomaticSaveProject(
    harness.projectStorage,
    projectId,
  ).storedMap.state.crops;
}

function readStoredAutomaticSaveProject(
  projectStorage: BrowserProjectStorage,
  projectId: string,
) {
  const reloadedRepository = createRepositoryForBrowserStorage(projectStorage);
  const storedProject = reloadedRepository.openProject(projectId);
  const storedMap = storedProject.project.maps[0];
  if (storedMap === undefined) {
    throw new Error(
      `Expected stored project ${JSON.stringify(projectId)} to contain its first map; received ${String(storedProject.project.maps.length)} maps.`,
    );
  }
  return {
    previewDataUrl: reloadedRepository.listProjects()[0]?.activeMapThumbnailDataUrl ?? null,
    projectCount: reloadedRepository.listProjects().length,
    storedMap,
    storedMaps: storedProject.project.maps,
  };
}

function createAutomaticMapChangeHarness() {
  const settledErrors: unknown[] = [];
  const mapChangeOrder: string[] = [];
  let recordMapChangeOrder = false;
  const projectStorage = createBrowserProjectStorage();
  const repository = createRepositoryForBrowserStorage(projectStorage);
  const workspaceController = createReferenceProjectWorkspaceController({
    repository,
    initialProjectSummaries: [],
  });
  let plannerWorkspaceState = createPlannerWorkspaceStateWithCoop();
  const pngBlob = new Blob(["automatic map preview"], { type: "image/png" });
  const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
    dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
      if (recordMapChangeOrder && plannerWorkspaceAction.type === "select-map") {
        mapChangeOrder.push("select-map");
        persistenceRuntime.clearMapImageExporter(plannerWorkspaceState.selectedPlannerMapId);
        mapChangeOrder.push("clear-exporter");
      }
      plannerWorkspaceState = reducePlannerWorkspaceState(
        plannerWorkspaceState,
        plannerWorkspaceAction,
      );
    },
    initialPlannerWorkspaceState: plannerWorkspaceState,
    initialWorkspaceState: { activeSession: null },
    newProjectName: "Untitled Project",
    onAutomaticSaveSettled: (caughtError) => {
      settledErrors.push(caughtError);
    },
    workspaceController,
  });
  persistenceRuntime.handleMapImageExporterReady("standard", {
    captureCleanMapImage: vi.fn(async () => pngBlob),
    captureScreenshot: vi.fn(async () => {
      if (!recordMapChangeOrder) return pngBlob;
      mapChangeOrder.push("capture-old-map");
      if (workspaceController.getState().activeSession === null) {
        throw new Error(
          "Expected the old canonical session to stay open until its preview is captured; "
            + `received planner map ID ${JSON.stringify(plannerWorkspaceState.selectedPlannerMapId)}.`,
        );
      }
      return pngBlob;
    }),
  });

  return {
    beginRecordingMapChangeOrder: () => {
      recordMapChangeOrder = true;
    },
    editPlannerWorkspaceState: (
      plannerWorkspaceAction: Parameters<typeof reducePlannerWorkspaceState>[1],
    ) => {
      plannerWorkspaceState = reducePlannerWorkspaceState(
        plannerWorkspaceState,
        plannerWorkspaceAction,
      );
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );
    },
    mapChangeOrder,
    persistenceRuntime,
    plannerWorkspaceState: () => plannerWorkspaceState,
    projectStorage,
    repository,
    settledErrors,
    workspaceController,
  };
}

async function openSavedCoopPlan(
  harness: ReturnType<typeof createAutomaticMapChangeHarness>,
  previewBytes: Uint8Array,
): Promise<string> {
  vi.mocked(encodePngAsWebp).mockResolvedValueOnce(previewBytes);
  await harness.persistenceRuntime.createProjectWithCurrentMap();
  harness.persistenceRuntime.updateWorkspaceSnapshot(
    harness.plannerWorkspaceState(),
    harness.workspaceController.getState(),
  );
  harness.persistenceRuntime.synchronizeCanonicalSession();
  harness.persistenceRuntime.updateWorkspaceSnapshot(
    harness.plannerWorkspaceState(),
    harness.workspaceController.getState(),
  );
  const projectId = harness.workspaceController.getState().activeProject?.id;
  if (projectId === undefined) {
    throw new Error("Expected New plan to create a project ID.");
  }
  return projectId;
}

function watchPreviewSave(previewSave: Promise<void>): Promise<unknown> {
  return previewSave.then(
    () => null,
    (caughtError: unknown) => caughtError,
  );
}

async function flushQueuedPreviewWork(): Promise<void> {
  for (let microtaskCount = 0; microtaskCount < 10; microtaskCount += 1) {
    await Promise.resolve();
  }
}

type DeferredFirstMapScreenshot = Readonly<{
  fail: (captureError: unknown) => void;
  isWaiting: boolean;
  release: (capturedPngBlob: Blob) => void;
}>;

function installDeferredFirstMapScreenshot(
  harness: ReturnType<typeof createAutomaticMapChangeHarness>,
): DeferredFirstMapScreenshot {
  const pendingCapture: {
    fail: ((captureError: unknown) => void) | null;
    release: ((capturedPngBlob: Blob) => void) | null;
  } = {
    fail: null,
    release: null,
  };
  const deferredScreenshot: {
    fail: (captureError: unknown) => void;
    isWaiting: boolean;
    release: (capturedPngBlob: Blob) => void;
  } = {
    isWaiting: false,
    fail: (captureError: unknown) => {
      const failCapture = pendingCapture.fail;
      if (failCapture === null) {
        throw new Error(
          "Expected the first map preview capture to be waiting; received no failure callback "
            + `for planner map ID ${JSON.stringify(harness.plannerWorkspaceState().selectedPlannerMapId)}.`,
        );
      }
      failCapture(captureError);
    },
    release: (capturedPngBlob: Blob) => {
      const releaseCapture = pendingCapture.release;
      if (releaseCapture === null) {
        throw new Error(
          "Expected the first map preview capture to be waiting; received no release callback "
            + `for planner map ID ${JSON.stringify(harness.plannerWorkspaceState().selectedPlannerMapId)}.`,
        );
      }
      releaseCapture(capturedPngBlob);
    },
  };
  const pngBlob = new Blob(["first map preview"], { type: "image/png" });
  harness.persistenceRuntime.handleMapImageExporterReady("standard", {
    captureCleanMapImage: vi.fn(async () => pngBlob),
    captureScreenshot: vi.fn(() => {
      harness.mapChangeOrder.push("capture-first-map");
      deferredScreenshot.isWaiting = true;
      return new Promise<Blob>((resolve, reject) => {
        pendingCapture.release = resolve;
        pendingCapture.fail = reject;
      });
    }),
  });
  return deferredScreenshot;
}
