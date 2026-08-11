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
import { copyPlannerWorkspaceCleanMapImage } from "../../src/components/planner-workspace";
import { attachPlannerCanvasCopyListener } from "../../src/components/planner-canvas";
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
import {
  createReferenceProjectRepository,
} from "../../src/reference-runtime/reference-project-repository";
import {
  createReferenceProjectWorkspaceController,
  type ReferenceProjectWorkspaceState,
} from "../../src/reference-runtime/use-reference-project-workspace";

describe("planner workspace project composition", () => {
  it("copies a one-times clean map image through the browser clipboard adapter", async () => {
    const cleanMapImage = new Blob(["clean map"], { type: "image/png" });
    const captureCleanMapImage = vi.fn(async () => cleanMapImage);
    let copiedImage: Blob | null = null;

    await copyPlannerWorkspaceCleanMapImage(
      captureCleanMapImage,
      async (pngImage) => {
        copiedImage = await pngImage;
      },
    );

    expect(captureCleanMapImage).toHaveBeenCalledWith(1);
    expect(copiedImage).toBe(cleanMapImage);
  });

  it("writes the clean one-times PNG through the default clipboard adapter only for the mounted Pixi canvas", async () => {
    const cleanMapImage = new Blob(["clean map"], { type: "image/png" });
    const captureCleanMapImage = vi.fn(async () => cleanMapImage);
    let writtenClipboardItems: readonly unknown[] | null = null;
    const clipboardWrite = vi.fn(
      async (clipboardItems: readonly unknown[]): Promise<void> => {
        writtenClipboardItems = clipboardItems;
      },
    );
    const pixiCanvas = new ClipboardCopyCanvas();
    const otherElement = {} as HTMLElement;

    await withGlobalValue(
      "navigator",
      { clipboard: { write: clipboardWrite } },
      async () => {
        await withGlobalValue("ClipboardItem", RecordingClipboardItem, async () => {
          const cleanup = attachPlannerCanvasCopyListener({
            getOnCopyCleanMapImage: () => () =>
              copyPlannerWorkspaceCleanMapImage(captureCleanMapImage),
            pixiCanvas: pixiCanvas as unknown as HTMLCanvasElement,
            reportCopyError: (message) => {
              throw new Error(`Unexpected clipboard copy error: ${message}`);
            },
          });

          const matchingCopyEvent = await pixiCanvas.dispatchCopyEvent(pixiCanvas);
          expect(matchingCopyEvent.preventDefault).toHaveBeenCalledOnce();
          expect(captureCleanMapImage).toHaveBeenCalledWith(1);
          expect(clipboardWrite).toHaveBeenCalledOnce();
          const clipboardItem = writtenClipboardItems?.[0];
          if (clipboardItem === undefined) {
            throw new Error("Expected navigator.clipboard.write to receive one ClipboardItem.");
          }
          expect(clipboardItem).toBeInstanceOf(RecordingClipboardItem);
          await expect((clipboardItem as RecordingClipboardItem).pngImage).resolves.toBe(
            cleanMapImage,
          );

          const unrelatedCopyEvent = await pixiCanvas.dispatchCopyEvent(otherElement);
          expect(unrelatedCopyEvent.preventDefault).not.toHaveBeenCalled();
          expect(captureCleanMapImage).toHaveBeenCalledOnce();
          expect(clipboardWrite).toHaveBeenCalledOnce();

          cleanup();
          const afterCleanupCopyEvent = await pixiCanvas.dispatchCopyEvent(pixiCanvas);
          expect(afterCleanupCopyEvent.preventDefault).not.toHaveBeenCalled();
          expect(captureCleanMapImage).toHaveBeenCalledOnce();
          expect(clipboardWrite).toHaveBeenCalledOnce();
        });
      },
    );
  });

  it("creates and saves the current unsaved map in one Untitled Project", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      createIdentifier: (() => {
        let nextIdentifier = 0;
        return () => `smart-save-id-${String(++nextIdentifier)}`;
      })(),
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ buildingId: "building:Barn", instanceId: 1, x: 8, y: 12 }],
      crops: [{ cropId: "crop:24", x: 2, y: 4 }],
      items: [{
        bedType: null,
        flipped: false,
        footprint: { height: 1, width: 1 },
        instanceId: 1,
        isGrass: false,
        isLongTable: false,
        isRug: false,
        isTable: false,
        itemId: "placeable:Chest",
        layer: "item" as const,
        locked: false,
        rotation: 0,
        tintColor: "#ffffff",
        variant: 0,
        x: 3,
        y: 5,
      }],
      nextBuildingId: 2,
      nextItemId: 2,
    };
    const plannerWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        placementSnapshot,
        plannerMapId: "standard",
        season: "summer",
        type: "open-unsaved-imported-map",
      },
    );
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: vi.fn(),
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: workspaceController.getState(),
      workspaceController,
    });

    persistenceRuntime.saveCurrentMap();

    const savedWorkspaceState = workspaceController.getState();
    expect(savedWorkspaceState.projectSummaries).toHaveLength(1);
    expect(savedWorkspaceState.activeProject?.title).toBe("Untitled Project");
    expect(savedWorkspaceState.activeProject?.project.maps).toHaveLength(1);
    expect(savedWorkspaceState.activeSession?.sourceMap).toMatchObject({
      label: "Standard Farm",
      mapFile: "Farm.tmx",
      season: "summer",
    });
    const savedProjectId = savedWorkspaceState.activeProject?.id;
    if (savedProjectId === undefined) {
      throw new Error("Expected the one-click save to create a project ID.");
    }
    const exportedProject = JSON.parse(workspaceController.exportProject(savedProjectId));
    expect(exportedProject.projects).toHaveLength(1);
    expect(exportedProject.projects[0].project.maps).toHaveLength(1);
    expect(exportedProject.projects[0].project.maps[0]).toMatchObject({
      label: "Standard Farm",
      mapFile: "Farm.tmx",
      season: "summer",
      state: {
        buildings: [{ buildingId: "building:Barn", instanceId: "b1", x: 8, y: 12 }],
        crops: [{ cropId: "crop:24", x: 2, y: 4 }],
        items: [{
          instanceId: "i1",
          itemId: "placeable:Chest",
          layer: "item",
          x: 3,
          y: 5,
        }],
      },
    });
  });

  it("reuses an active empty project when saving the current unsaved map", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    workspaceController.createProject({
      projectName: "Existing Empty Project",
      season: "fall",
    });
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: vi.fn(),
      initialPlannerWorkspaceState: reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState(),
        {
          placementSnapshot: createEmptyPlacementSnapshot(),
          plannerMapId: "standard",
          season: "fall",
          type: "open-unsaved-imported-map",
        },
      ),
      initialWorkspaceState: workspaceController.getState(),
      workspaceController,
    });

    persistenceRuntime.saveCurrentMap();

    const savedWorkspaceState = workspaceController.getState();
    expect(savedWorkspaceState.projectSummaries).toHaveLength(1);
    expect(savedWorkspaceState.activeProject?.title).toBe("Existing Empty Project");
    expect(savedWorkspaceState.activeProject?.project.maps).toHaveLength(1);
  });

  it("creates a Forest Farm map with its catalog file and label", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: vi.fn(),
      initialPlannerWorkspaceState: reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState(),
        {
          placementSnapshot: createEmptyPlacementSnapshot(),
          plannerMapId: "forest",
          season: "winter",
          type: "open-unsaved-imported-map",
        },
      ),
      initialWorkspaceState: workspaceController.getState(),
      workspaceController,
    });

    persistenceRuntime.saveCurrentMap();

    expect(workspaceController.getState().activeSession?.sourceMap).toMatchObject({
      label: "Forest Farm",
      mapFile: "Farm_Foraging.tmx",
      season: "winter",
    });
  });

  it("keeps a created empty project recoverable when map creation fails", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    const mapCreationError = new Error("Map creation failed.");
    let shouldFailMapCreation = true;
    const retryingWorkspaceController = {
      ...workspaceController,
      createMap: (input: Parameters<typeof workspaceController.createMap>[0]) => {
        if (shouldFailMapCreation) {
          shouldFailMapCreation = false;
          throw mapCreationError;
        }
        workspaceController.createMap(input);
      },
    };
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: vi.fn(),
      initialPlannerWorkspaceState: reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState(),
        {
          placementSnapshot: createEmptyPlacementSnapshot(),
          plannerMapId: "standard",
          season: "spring",
          type: "open-unsaved-imported-map",
        },
      ),
      initialWorkspaceState: workspaceController.getState(),
      workspaceController: retryingWorkspaceController,
    });

    expect(() => persistenceRuntime.saveCurrentMap()).toThrow(mapCreationError);
    expect(workspaceController.getState().activeProject?.project.maps).toHaveLength(0);
    expect(workspaceController.getState().projectSummaries).toHaveLength(1);

    persistenceRuntime.saveCurrentMap();

    expect(workspaceController.getState().projectSummaries).toHaveLength(1);
    expect(workspaceController.getState().activeProject?.project.maps).toHaveLength(1);
  });

  it("keeps the local canvas and Save panel recoverable when the first map snapshot save fails", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    const snapshotSaveError = new Error("Snapshot save failed.");
    let shouldFailSnapshotSave = true;
    const retryingWorkspaceController = {
      ...workspaceController,
      saveOpenMap: (edits: Parameters<typeof workspaceController.saveOpenMap>[0]) => {
        if (shouldFailSnapshotSave) {
          shouldFailSnapshotSave = false;
          throw snapshotSaveError;
        }
        workspaceController.saveOpenMap(edits);
      },
    };
    const originalPlacementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 6, y: 8 }],
    };
    let plannerWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        placementSnapshot: originalPlacementSnapshot,
        plannerMapId: "standard",
        season: "spring",
        type: "open-unsaved-imported-map",
      },
    );
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      modalId: "save-panel",
      type: "open-modal",
    });
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (action) => {
        plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, action);
      },
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: workspaceController.getState(),
      workspaceController: retryingWorkspaceController,
    });

    expect(() => persistenceRuntime.saveCurrentMap()).toThrow(snapshotSaveError);
    expect(workspaceController.getState().projectSummaries).toHaveLength(1);
    expect(workspaceController.getState().activeProject?.project.maps).toHaveLength(1);

    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();

    expect(plannerWorkspaceState.modalId).toBe("save-panel");
    expect(plannerWorkspaceState.placementHistory.currentState).toEqual(
      originalPlacementSnapshot,
    );

    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.saveCurrentMap();

    const savedProjectId = workspaceController.getState().activeProject?.id;
    if (savedProjectId === undefined) {
      throw new Error("Expected the recoverable save to retain its project ID.");
    }
    const savedProject = JSON.parse(workspaceController.exportProject(savedProjectId));
    expect(savedProject.projects).toHaveLength(1);
    expect(savedProject.projects[0].project.maps).toHaveLength(1);
    expect(savedProject.projects[0].project.maps[0].state.crops).toEqual(
      originalPlacementSnapshot.crops,
    );
  });

  it("retries a created map snapshot save before canonical synchronization without duplication", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    const snapshotSaveError = new Error("Snapshot save failed before synchronization.");
    let shouldFailSnapshotSave = true;
    const retryingWorkspaceController = {
      ...workspaceController,
      saveOpenMap: (edits: Parameters<typeof workspaceController.saveOpenMap>[0]) => {
        if (shouldFailSnapshotSave) {
          shouldFailSnapshotSave = false;
          throw snapshotSaveError;
        }
        workspaceController.saveOpenMap(edits);
      },
    };
    const originalPlacementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 3, y: 7 }],
    };
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: vi.fn(),
      initialPlannerWorkspaceState: reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState(),
        {
          placementSnapshot: originalPlacementSnapshot,
          plannerMapId: "standard",
          season: "spring",
          type: "open-unsaved-imported-map",
        },
      ),
      initialWorkspaceState: workspaceController.getState(),
      workspaceController: retryingWorkspaceController,
    });

    expect(() => persistenceRuntime.saveCurrentMap()).toThrow(snapshotSaveError);
    persistenceRuntime.saveCurrentMap();

    const savedProjectId = workspaceController.getState().activeProject?.id;
    if (savedProjectId === undefined) {
      throw new Error("Expected the immediate retry to retain its project ID.");
    }
    const savedProject = JSON.parse(workspaceController.exportProject(savedProjectId));
    expect(savedProject.projects).toHaveLength(1);
    expect(savedProject.projects[0].project.maps).toHaveLength(1);
    expect(savedProject.projects[0].project.maps[0].state.crops).toEqual(
      originalPlacementSnapshot.crops,
    );
  });

  it("fails before synchronizing a pending smart save into a different active map", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    const snapshotSaveError = new Error("Snapshot save failed before map switch.");
    const retryingWorkspaceController = {
      ...workspaceController,
      saveOpenMap: () => {
        throw snapshotSaveError;
      },
    };
    const originalPlacementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 4, y: 6 }],
    };
    let plannerWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        placementSnapshot: originalPlacementSnapshot,
        plannerMapId: "standard",
        season: "spring",
        type: "open-unsaved-imported-map",
      },
    );
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      modalId: "save-panel",
      type: "open-modal",
    });
    const dispatchPlannerWorkspaceAction = vi.fn((action) => {
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, action);
    });
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction,
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: workspaceController.getState(),
      workspaceController: retryingWorkspaceController,
    });

    expect(() => persistenceRuntime.saveCurrentMap()).toThrow(snapshotSaveError);
    const pendingProjectId = workspaceController.getState().activeProject?.id;
    if (pendingProjectId === undefined) {
      throw new Error("Expected the failed smart save to create its project ID.");
    }
    workspaceController.createProject({
      projectName: "Different Project",
      season: "summer",
    });
    const differentProjectIdForMapCreation = workspaceController.getState().activeProject?.id;
    if (differentProjectIdForMapCreation === undefined) {
      throw new Error("Expected setup to create a project before creating its map.");
    }
    workspaceController.createMap({
      label: "Standard Farm",
      mapFile: "Farm.tmx",
      projectId: differentProjectIdForMapCreation,
      season: "summer",
    });
    const differentProjectState = workspaceController.getState();
    const differentProjectId = differentProjectState.activeProject?.id;
    const differentMapId = differentProjectState.activeSession?.mapId;
    if (differentProjectId === undefined || differentMapId === undefined) {
      throw new Error("Expected setup to create an active project and map to switch to.");
    }

    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      differentProjectState,
    );

    expect(() => persistenceRuntime.synchronizeCanonicalSession()).toThrow(
      new RegExp(
        `Received project ID ${JSON.stringify(differentProjectId)}, map ID ${JSON.stringify(differentMapId)}, and planner map ID "standard"`,
      ),
    );
    expect(dispatchPlannerWorkspaceAction).not.toHaveBeenCalled();

    workspaceController.openProject(pendingProjectId);
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();

    expect(dispatchPlannerWorkspaceAction).toHaveBeenCalledTimes(1);
    expect(plannerWorkspaceState.modalId).toBe("save-panel");
    expect(plannerWorkspaceState.placementHistory.currentState).toEqual(
      originalPlacementSnapshot,
    );
  });

  it("fails before overwriting a non-canonical active project map", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    workspaceController.createProject({
      projectName: "Existing Project",
      season: "spring",
    });
    const existingProjectId = workspaceController.getState().activeProject?.id;
    if (existingProjectId === undefined) {
      throw new Error("Expected setup to create an existing project ID.");
    }
    workspaceController.createMap({
      label: "Standard Farm",
      mapFile: "Farm.tmx",
      projectId: existingProjectId,
      season: "spring",
    });
    const existingProjectExport = workspaceController.exportProject(existingProjectId);
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: vi.fn(),
      initialPlannerWorkspaceState: reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState(),
        {
          placementSnapshot: {
            ...createEmptyPlacementSnapshot(),
            crops: [{ cropId: "crop:24", x: 9, y: 9 }],
          },
          plannerMapId: "forest",
          season: "summer",
          type: "open-unsaved-imported-map",
        },
      ),
      initialWorkspaceState: workspaceController.getState(),
      workspaceController,
    });

    expect(() => persistenceRuntime.saveCurrentMap()).toThrow(
      /active project is not empty and without an active session/,
    );

    expect(workspaceController.exportProject(existingProjectId)).toBe(existingProjectExport);
  });

  it("updates the same map after canonical state synchronization", () => {
    let serializedProjectDocument: string | null = null;
    const repository = createReferenceProjectRepository({
      now: () => "2026-08-01T00:00:00.000Z",
      storage: {
        getItem: () => serializedProjectDocument,
        setItem: (_storageKey, nextSerializedProjectDocument) => {
          serializedProjectDocument = nextSerializedProjectDocument;
        },
      },
    });
    const workspaceController = createReferenceProjectWorkspaceController({
      initialProjectSummaries: repository.listProjects(),
      repository,
    });
    let plannerWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        placementSnapshot: {
          ...createEmptyPlacementSnapshot(),
          crops: [{ cropId: "crop:24", x: 2, y: 4 }],
        },
        plannerMapId: "standard",
        season: "spring",
        type: "open-unsaved-imported-map",
      },
    );
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      modalId: "save-panel",
      type: "open-modal",
    });
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (action) => {
        plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, action);
      },
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: workspaceController.getState(),
      workspaceController,
    });

    persistenceRuntime.saveCurrentMap();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    expect(plannerWorkspaceState.modalId).toBe("save-panel");
    plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
      placementSnapshot: {
        ...createEmptyPlacementSnapshot(),
        crops: [{ cropId: "crop:24", x: 7, y: 9 }],
      },
      type: "reset-placement-history",
    });
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      workspaceController.getState(),
    );

    persistenceRuntime.saveCurrentMap();

    const savedProjectId = workspaceController.getState().activeProject?.id;
    if (savedProjectId === undefined) {
      throw new Error("Expected the synchronized map to retain its project ID.");
    }
    const savedProject = JSON.parse(workspaceController.exportProject(savedProjectId));
    expect(savedProject.projects[0].project.maps).toHaveLength(1);
    expect(savedProject.projects[0].project.maps[0].state.crops).toEqual([
      { cropId: "crop:24", x: 7, y: 9 },
    ]);
  });

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
    const workspaceController = {
      clearActiveProject: vi.fn(),
      createMap: vi.fn(),
      createProject: vi.fn(),
      getState: () => ({
        activeProject: null,
        activeSession,
        projectSummaries: [],
      }),
      getPlannerMapIdForMapFile: (mapFile: string) => {
        if (mapFile === "Farm.tmx") return "standard";
        if (mapFile === "Farm_Foraging.tmx") return "forest";
        throw new Error(`Unexpected map file ${JSON.stringify(mapFile)}.`);
      },
      saveOpenMap,
      saveThumbnail: vi.fn(),
    };
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction,
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: createCanonicalProjectWorkspaceState(activeSession),
      workspaceController,
    });

    persistenceRuntime.synchronizeCanonicalSession();
    expect(dispatchPlannerWorkspaceAction).toHaveBeenCalledTimes(1);
    persistenceRuntime.saveCurrentMap();
    expect(workspaceController.createProject).not.toHaveBeenCalled();
    expect(workspaceController.createMap).not.toHaveBeenCalled();
    persistenceRuntime.updateWorkspaceSnapshot(
      plannerWorkspaceState,
      createCanonicalProjectWorkspaceState(activeSession),
    );
    persistenceRuntime.synchronizeCanonicalSession();
    expect(dispatchPlannerWorkspaceAction).toHaveBeenCalledTimes(1);

    const standardCaptureScreenshot = vi.fn(
      async () => new Blob(["standard"], { type: "image/png" }),
    );
    const standardCaptureCleanMapImage = vi.fn(
      async () => new Blob(["standard clean"], { type: "image/png" }),
    );
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: standardCaptureCleanMapImage,
      captureScreenshot: standardCaptureScreenshot,
    });
    await persistenceRuntime.captureScreenshot(1);
    expect(standardCaptureScreenshot).toHaveBeenCalledWith(1);
    expect(standardCaptureCleanMapImage).not.toHaveBeenCalled();
    await persistenceRuntime.captureCleanMapImage(1);
    expect(standardCaptureCleanMapImage).toHaveBeenCalledWith(1);
    expect(standardCaptureScreenshot).toHaveBeenCalledTimes(1);

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
    const forestCaptureCleanMapImage = vi.fn(
      async () => new Blob(["forest clean"], { type: "image/png" }),
    );
    persistenceRuntime.handleMapImageExporterReady("forest", {
      captureCleanMapImage: forestCaptureCleanMapImage,
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

class ClipboardCopyCanvas {
  private readonly copyListeners = new Set<EventListener>();

  addEventListener(
    eventType: string,
    eventListener: EventListenerOrEventListenerObject,
  ): void {
    if (eventType !== "copy" || typeof eventListener !== "function") {
      throw new Error("Clipboard copy canvas only supports function copy listeners.");
    }

    this.copyListeners.add(eventListener);
  }

  removeEventListener(
    eventType: string,
    eventListener: EventListenerOrEventListenerObject,
  ): void {
    if (eventType !== "copy" || typeof eventListener !== "function") {
      throw new Error("Clipboard copy canvas only supports function copy listeners.");
    }

    this.copyListeners.delete(eventListener);
  }

  dispatchEvent(_event: Event): boolean {
    return true;
  }

  async dispatchCopyEvent(target: EventTarget): Promise<ClipboardEvent & {
    preventDefault: ReturnType<typeof vi.fn>;
  }> {
    const preventDefault = vi.fn();
    const copyEvent = {
      preventDefault,
      target,
    } as ClipboardEvent & { preventDefault: ReturnType<typeof vi.fn> };

    for (const copyListener of this.copyListeners) {
      copyListener(copyEvent);
    }
    await Promise.resolve();
    await Promise.resolve();

    return copyEvent;
  }
}

class RecordingClipboardItem {
  readonly pngImage: Promise<Blob>;

  constructor(clipboardItemData: Readonly<{ "image/png": Promise<Blob> }>) {
    this.pngImage = clipboardItemData["image/png"];
  }
}

async function withGlobalValue(
  key: "ClipboardItem" | "navigator",
  value: unknown,
  action: () => Promise<void>,
): Promise<void> {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, key);
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value,
    writable: true,
  });

  try {
    await action();
  } finally {
    if (originalDescriptor === undefined) {
      Reflect.deleteProperty(globalThis, key);
    } else {
      Object.defineProperty(globalThis, key, originalDescriptor);
    }
  }
}
