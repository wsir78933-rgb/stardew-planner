import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";
import { encodePngAsWebp } from "../../src/projects/browser-png-to-webp";
import {
  createLocalProjectAndSaveCurrentMap,
  createPlannerLocalProjectActions,
  createPlannerProjectMapActions,
} from "../../src/planner/planner-workspace-project-actions";
import {
  automaticMapSaveDelayMilliseconds,
  changePlannerWorkspaceMap,
  createAutomaticMapSaveLayoutKey,
  createPlannerWorkspacePersistenceRuntime,
  saveCurrentPlannerWorkspaceMap,
} from "../../src/planner/planner-workspace-persistence-runtime";

vi.mock("../../src/projects/browser-png-to-webp", () => ({
  encodePngAsWebp: vi.fn(),
}));
import {
  copyPlannerWorkspaceCleanMapImage,
  type PlannerWorkspaceStartup,
} from "../../src/components/planner-workspace";
import { createInitialEditorPreferences } from "../../src/editor/browser-editor-preferences";
import type {
  BrowserPlannerWorkspaceBootstrapInput,
  PreparedPlannerWorkspace,
} from "../../src/planner/planner-workspace-bootstrap";
import { createPlannerWorkspaceInitialStartup } from "../../src/planner/planner-workspace-startup";
import type { PreparedDefaultMap } from "../../src/resources/default-map-resource";
import type { TilesheetSeason } from "../../src/rendering/tilesheet-asset-resolver";
import { attachPlannerCanvasContextMenuListener } from "../../src/components/planner-canvas";
import * as plannerCanvasContextMenuModule from "../../src/components/planner-canvas-context-menu";
import {
  createCanonicalMapIdentityReference,
  createCanonicalSessionTransition,
} from "../../src/planner/planner-workspace-canonical-session";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
  type PlannerWorkspaceAction,
  type PlannerWorkspaceState,
} from "../../src/planner/planner-workspace-state";
import type { PlannerWorkspaceStateController } from "../../src/planner/use-planner-workspace-state";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import {
  setFarmCaveChoice,
  setFarmSpouseId,
} from "../../src/maps/map-render-options";
import type { ReferenceProjectMap } from "../../src/reference-runtime/local-project-api";
import type { ReferenceOpenMapSession } from "../../src/reference-runtime/reference-project-editor-adapter";
import {
  createReferenceProjectRepository,
  referenceProjectStorageKey,
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

  it("opens a canvas-only menu before the selected action writes the clean one-times PNG", async () => {
    const handlePlannerCanvasContextMenuCopyAction = (
      plannerCanvasContextMenuModule as unknown as {
        handlePlannerCanvasContextMenuCopyAction?: (
          onClose: () => void,
          onCopyFullMap: () => Promise<void>,
        ) => Promise<void>;
      }
    ).handlePlannerCanvasContextMenuCopyAction;
    expect(handlePlannerCanvasContextMenuCopyAction).toBeTypeOf("function");
    if (handlePlannerCanvasContextMenuCopyAction === undefined) {
      return;
    }

    const cleanMapImage = new Blob(["clean map"], { type: "image/png" });
    const captureCleanMapImage = vi.fn(async () => cleanMapImage);
    let writtenClipboardItems: readonly unknown[] | null = null;
    const clipboardWrite = vi.fn(
      async (clipboardItems: readonly unknown[]): Promise<void> => {
        writtenClipboardItems = clipboardItems;
      },
    );
    const pixiCanvas = new ClipboardContextMenuCanvas();
    const otherElement = {} as HTMLElement;
    const openedMenuPoints: Readonly<{ x: number; y: number }>[] = [];
    const menuActionOrder: string[] = [];

    await withGlobalValue(
      "navigator",
      { clipboard: { write: clipboardWrite } },
      async () => {
        await withGlobalValue("ClipboardItem", RecordingClipboardItem, async () => {
          const cleanup = attachPlannerCanvasContextMenuListener({
            onOpen: (point) => openedMenuPoints.push(point),
            pixiCanvas: pixiCanvas as unknown as HTMLCanvasElement,
          });

          const matchingContextMenuEvent = pixiCanvas.dispatchContextMenuEvent(
            pixiCanvas,
            120,
            80,
          );
          expect(matchingContextMenuEvent.preventDefault).toHaveBeenCalledOnce();
          expect(openedMenuPoints).toEqual([{ x: 120, y: 80 }]);

          await handlePlannerCanvasContextMenuCopyAction(
            () => menuActionOrder.push("close"),
            async () => {
              menuActionOrder.push("copy");
              await copyPlannerWorkspaceCleanMapImage(captureCleanMapImage);
            },
          );
          expect(menuActionOrder).toEqual(["close", "copy"]);
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

          const unrelatedContextMenuEvent = pixiCanvas.dispatchContextMenuEvent(
            otherElement,
            96,
            72,
          );
          expect(unrelatedContextMenuEvent.preventDefault).not.toHaveBeenCalled();
          expect(openedMenuPoints).toEqual([{ x: 120, y: 80 }]);
          expect(captureCleanMapImage).toHaveBeenCalledOnce();
          expect(clipboardWrite).toHaveBeenCalledOnce();

          cleanup();
          const afterCleanupContextMenuEvent = pixiCanvas.dispatchContextMenuEvent(
            pixiCanvas,
            20,
            10,
          );
          expect(afterCleanupContextMenuEvent.preventDefault).not.toHaveBeenCalled();
          expect(openedMenuPoints).toEqual([{ x: 120, y: 80 }]);
          expect(captureCleanMapImage).toHaveBeenCalledOnce();
          expect(clipboardWrite).toHaveBeenCalledOnce();
        });
      },
    );
  });

  it("creates and saves the current unsaved map in the supplied localized project", () => {
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
      newProjectName: "未命名项目",
      workspaceController,
    });

    persistenceRuntime.saveCurrentMap();

    const savedWorkspaceState = workspaceController.getState();
    expect(savedWorkspaceState.projectSummaries).toHaveLength(1);
    expect(savedWorkspaceState.activeProject?.title).toBe("未命名项目");
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
      createProjectWithFirstMap: vi.fn(),
      getState: () => ({
        activeProject: null,
        activeSession,
        folders: [],
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
      mapRenderOptions: plannerWorkspaceState.mapRenderOptions,
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
      createProjectWithFirstMap: vi.fn(),
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

  it("uses the supplied localized name when creating a local project", () => {
    const controllerMethods = {
      createProject: vi.fn(),
      createProjectWithFirstMap: vi.fn(),
      deleteProject: vi.fn(),
      duplicateProject: vi.fn(),
      exportProject: vi.fn(() => "serialized-project"),
      importProject: vi.fn(),
      openProject: vi.fn(),
      renameProject: vi.fn(),
    };
    const projectActions = createPlannerLocalProjectActions({
      newProjectName: "未命名项目",
      season: "summer",
      workspaceController: controllerMethods,
    });

    projectActions.onCreateProject();

    expect(controllerMethods.createProject).toHaveBeenCalledWith({
      projectName: "未命名项目",
      season: "summer",
    });
  });

  it("maps every project-map action to one controller call with exact IDs", () => {
    const controllerMethods = {
      activateMap: vi.fn(),
      copyMap: vi.fn(),
      createMap: vi.fn(),
      deleteMap: vi.fn(),
      duplicateMap: vi.fn(),
      getState: vi.fn(() => {
        throw new Error(
          "Expected this controller-call test to avoid getState; received a getState call.",
        );
      }),
      moveMap: vi.fn(),
      renameMap: vi.fn(),
    };
    const projectMapActions = createPlannerProjectMapActions({
      activeProjectId: "project-source",
      season: "winter",
      workspaceController: controllerMethods,
    });

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

  it("throws the received map ids when adding a map does not create one", async () => {
    const workspaceController = createReferenceProjectWorkspaceController({
      repository: createIntegrationRepository(createIntegrationBrowserStorage()),
      initialProjectSummaries: [],
    });
    workspaceController.createProject({
      projectName: "Untitled Project",
      season: "spring",
    });
    const activeProjectId = workspaceController.getState().activeProject?.id;
    if (activeProjectId === undefined) {
      throw new Error(
        `Expected the empty project to have an ID before the failed add; received ${JSON.stringify(activeProjectId)}.`,
      );
    }
    vi.spyOn(workspaceController, "createMap").mockImplementation(() => undefined);
    const activateMap = vi.spyOn(workspaceController, "activateMap");
    const projectMapActions = createPlannerProjectMapActions({
      activeProjectId,
      season: "spring",
      workspaceController,
    });

    await expect(projectMapActions.onAddMap("forest")).rejects.toThrow(
      /Received created map IDs \[]/,
    );
    expect(activateMap).not.toHaveBeenCalled();
    expect(workspaceController.getState().activeProject?.project.maps).toEqual([]);
    expect(workspaceController.getState().projectSummaries).toHaveLength(1);
  });

  it("activates an added map and autosaves later season, options, and placements into that map", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    try {
      const projectStorage = createIntegrationBrowserStorage();
      const repository = createIntegrationRepository(projectStorage);
      const workspaceController = createReferenceProjectWorkspaceController({
        repository,
        initialProjectSummaries: [],
      });
      let plannerWorkspaceState = reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState("standard"),
        {
          placementSnapshot: {
            ...createEmptyPlacementSnapshot(),
            crops: [{ cropId: "crop:24", x: 3, y: 5 }],
          },
          type: "reset-placement-history",
        },
      );
      const settledErrors: unknown[] = [];
      const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
        dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
          plannerWorkspaceState = reducePlannerWorkspaceState(
            plannerWorkspaceState,
            plannerWorkspaceAction,
          );
        },
        initialPlannerWorkspaceState: plannerWorkspaceState,
        initialWorkspaceState: workspaceController.getState(),
        newProjectName: "Untitled Project",
        onAutomaticSaveSettled: (caughtError) => {
          settledErrors.push(caughtError);
        },
        workspaceController,
      });
      const pngBlob = new Blob(["added map preview"], { type: "image/png" });
      persistenceRuntime.handleMapImageExporterReady("standard", {
        captureCleanMapImage: vi.fn(async () => pngBlob),
        captureScreenshot: vi.fn(async () => pngBlob),
      });
      const firstPreviewBytes = createIntegrationPreviewWebpBytes(51);
      const forestPreviewBytes = createIntegrationPreviewWebpBytes(52);
      vi.mocked(encodePngAsWebp)
        .mockResolvedValueOnce(firstPreviewBytes)
        .mockResolvedValueOnce(forestPreviewBytes);
      const projectActions = createPlannerLocalProjectActions({
        newProjectName: "Untitled Project",
        season: plannerWorkspaceState.season,
        workspaceController,
      });
      await createLocalProjectAndSaveCurrentMap({
        createProjectWithCurrentMap: persistenceRuntime.createProjectWithCurrentMap,
      });
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
        throw new Error("Expected New plan to create a project ID before adding a map.");
      }
      const standardMapId = workspaceController.getState().activeSession?.mapId;
      if (standardMapId === undefined) {
        throw new Error(
          `Expected the first map to have an ID; received ${JSON.stringify(standardMapId)}.`,
        );
      }

      const projectMapActions = createPlannerProjectMapActions({
        activeProjectId: createdProjectId,
        season: plannerWorkspaceState.season,
        workspaceController,
      });
      await projectMapActions.onAddMap("forest");
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );
      persistenceRuntime.synchronizeCanonicalSession();
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );

      const forestSession = workspaceController.getState().activeSession;
      if (forestSession === null || forestSession.mapId === standardMapId) {
        throw new Error(
          "Expected the added Forest Farm to become the canonical session; "
            + `received map ID ${JSON.stringify(forestSession?.mapId ?? null)} `
            + `and first map ID ${JSON.stringify(standardMapId)}.`,
        );
      }
      expect(plannerWorkspaceState.selectedPlannerMapId).toBe("forest");
      expect(plannerWorkspaceState.activeMapId).toBe(forestSession.mapId);
      expect(plannerWorkspaceState.activeProjectId).toBe(createdProjectId);
      expect(workspaceController.getState().activeProject?.project.maps).toHaveLength(2);
      persistenceRuntime.handleMapImageExporterReady("forest", {
        captureCleanMapImage: vi.fn(async () => pngBlob),
        captureScreenshot: vi.fn(async () => pngBlob),
      });

      const editedMapRenderOptions = setFarmCaveChoice(
        setFarmSpouseId(plannerWorkspaceState.mapRenderOptions, "Abigail"),
        "bats",
      );
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        season: "winter",
        type: "select-season",
      });
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        mapRenderOptions: editedMapRenderOptions,
        type: "set-map-render-options",
      });
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        placementSnapshot: {
          ...plannerWorkspaceState.placementHistory.currentState,
          crops: [{ cropId: "crop:24", x: 8, y: 9 }],
        },
        type: "reset-placement-history",
      });
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );
      persistenceRuntime.scheduleAutomaticSave();
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
      const forestMapBeforeDebounce = readStoredProjectMap(
        projectStorage,
        createdProjectId,
        "Farm_Foraging.tmx",
      );
      expect(forestMapBeforeDebounce.season).toBe("spring");

      await vi.advanceTimersByTimeAsync(1);
      const reloadedRepository = createIntegrationRepository(projectStorage);
      const reloadedProject = reloadedRepository.openProject(createdProjectId);
      const standardMap = readProjectMapByFile(reloadedProject.project.maps, "Farm.tmx");
      const forestMap = readProjectMapByFile(reloadedProject.project.maps, "Farm_Foraging.tmx");
      const forestPreviewDataUrl = reloadedProject.thumbnailsByMapId?.[forestMap.id];
      expect(reloadedRepository.listProjects()).toHaveLength(1);
      expect(reloadedProject.project.maps).toHaveLength(2);
      expect(reloadedProject.project.activeMapId).toBe(forestMap.id);
      expect(standardMap.season).toBe("spring");
      expect(standardMap.state.crops).toEqual([{ cropId: "crop:24", x: 3, y: 5 }]);
      expect(forestMap.season).toBe("winter");
      expect(forestMap.state.crops).toEqual([{ cropId: "crop:24", x: 8, y: 9 }]);
      expect(forestMap.state.mapRenderOptions).toEqual(editedMapRenderOptions);
      expect(forestPreviewDataUrl).toBe(createWebpDataUrl(forestPreviewBytes));
      expect(forestPreviewDataUrl).not.toContain("/api/projects");
      expect(reloadedRepository.listProjects()[0]?.activeMapThumbnailDataUrl).toBe(
        forestPreviewDataUrl,
      );
      expect(settledErrors).toEqual([null]);
      expect(projectStorage.writtenStorageKeys.filter(
        (storageKey) => storageKey !== referenceProjectStorageKey,
      )).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("saves the pending canonical map before Add map creates the next map", async () => {
    vi.useFakeTimers();
    try {
      const editedPreviewBytes = createIntegrationPreviewWebpBytes(62);
      const savedProject = await openIntegrationProjectWithSavedStandardMap(
        createIntegrationPreviewWebpBytes(61),
      );
      const storedBeforeEdit = readStoredProjectMap(
        savedProject.projectStorage,
        savedProject.projectId,
        "Farm.tmx",
      );
      const editedMapRenderOptions = setFarmCaveChoice(
        setFarmSpouseId(savedProject.plannerWorkspaceState().mapRenderOptions, "Abigail"),
        "bats",
      );
      savedProject.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
      savedProject.editPlannerWorkspaceState({
        mapRenderOptions: editedMapRenderOptions,
        type: "set-map-render-options",
      });
      savedProject.editPlannerWorkspaceState({
        placementSnapshot: {
          ...savedProject.plannerWorkspaceState().placementHistory.currentState,
          crops: [{ cropId: "crop:24", x: 8, y: 9 }],
        },
        type: "reset-placement-history",
      });
      savedProject.persistenceRuntime.scheduleAutomaticSave();
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
      const storedBeforeDebounce = readStoredProjectMap(
        savedProject.projectStorage,
        savedProject.projectId,
        "Farm.tmx",
      );
      expect(storedBeforeDebounce.season).toBe(storedBeforeEdit.season);
      expect(storedBeforeDebounce.state.crops).toEqual(storedBeforeEdit.state.crops);
      expect(storedBeforeDebounce.state.buildings).toEqual(storedBeforeEdit.state.buildings);
      expect(createIntegrationRepository(savedProject.projectStorage).openProject(
        savedProject.projectId,
      ).project.maps).toHaveLength(1);

      const editedPreviewRelease: {
        resolvePreview: (webpBytes: Uint8Array) => void;
      } = {
        resolvePreview: () => {
          throw new Error(
            `Expected Add map to start saving project ${JSON.stringify(savedProject.projectId)} `
              + `map ${JSON.stringify(savedProject.standardMapId)} before creating the next map.`,
          );
        },
      };
      vi.mocked(encodePngAsWebp).mockImplementationOnce(
        () => new Promise((resolve) => {
          editedPreviewRelease.resolvePreview = resolve;
        }),
      );
      const createMap = savedProject.workspaceController.createMap.bind(
        savedProject.workspaceController,
      );
      const createMapSpy = vi.spyOn(
        savedProject.workspaceController,
        "createMap",
      ).mockImplementation((mapCreationInput) => {
        const storedAtCreate = readStoredProjectMap(
          savedProject.projectStorage,
          savedProject.projectId,
          "Farm.tmx",
        );
        const storedProjectAtCreate = createIntegrationRepository(
          savedProject.projectStorage,
        ).openProject(savedProject.projectId);
        expect(storedProjectAtCreate.project.maps).toHaveLength(1);
        expect(storedAtCreate.id).toBe(savedProject.standardMapId);
        expect(storedAtCreate.season).toBe("winter");
        expect(storedAtCreate.state.mapRenderOptions).toEqual(editedMapRenderOptions);
        expect(storedAtCreate.state.crops).toEqual([{ cropId: "crop:24", x: 8, y: 9 }]);
        expect(storedAtCreate.state.buildings).toEqual(storedBeforeEdit.state.buildings);
        expect(storedProjectAtCreate.thumbnailsByMapId?.[savedProject.standardMapId]).toBe(
          createWebpDataUrl(editedPreviewBytes),
        );
        return createMap(mapCreationInput);
      });
      const activateMapSpy = vi.spyOn(savedProject.workspaceController, "activateMap");
      const addMapPromise = createPlannerProjectMapActions({
        activeProjectId: savedProject.projectId,
        season: savedProject.plannerWorkspaceState().season,
        workspaceController: savedProject.workspaceController,
      }).onAddMap("forest");
      for (let microtaskCount = 0; microtaskCount < 10; microtaskCount += 1) {
        await Promise.resolve();
      }

      expect(vi.mocked(encodePngAsWebp)).toHaveBeenCalledTimes(2);
      expect(createMapSpy).not.toHaveBeenCalled();
      expect(activateMapSpy).not.toHaveBeenCalled();
      expect(readStoredProjectMap(
        savedProject.projectStorage,
        savedProject.projectId,
        "Farm.tmx",
      ).season).toBe("spring");
      editedPreviewRelease.resolvePreview(editedPreviewBytes);
      await addMapPromise;

      expect(createMapSpy).toHaveBeenCalledTimes(1);
      expect(activateMapSpy).toHaveBeenCalledTimes(1);
      const storedProject = createIntegrationRepository(savedProject.projectStorage).openProject(
        savedProject.projectId,
      );
      const standardMap = readProjectMapByFile(storedProject.project.maps, "Farm.tmx");
      const forestMap = readProjectMapByFile(storedProject.project.maps, "Farm_Foraging.tmx");
      expect(storedProject.project.maps).toHaveLength(2);
      expect(new Set(storedProject.project.maps.map((projectMap) => projectMap.id)).size).toBe(2);
      expect(new Set(storedProject.project.maps.map((projectMap) => projectMap.mapFile)).size).toBe(2);
      expect(standardMap.id).toBe(savedProject.standardMapId);
      expect(standardMap.season).toBe("winter");
      expect(standardMap.state.mapRenderOptions).toEqual(editedMapRenderOptions);
      expect(standardMap.state.crops).toEqual([{ cropId: "crop:24", x: 8, y: 9 }]);
      expect(standardMap.state.buildings).toEqual(storedBeforeEdit.state.buildings);
      expect(forestMap.id).not.toBe(savedProject.standardMapId);
      expect(storedProject.project.activeMapId).toBe(forestMap.id);
      expect(savedProject.workspaceController.getState().activeSession?.mapId).toBe(forestMap.id);
      expect(savedProject.workspaceController.getState().activeSession?.projectId).toBe(
        savedProject.projectId,
      );
      expect(savedProject.settledErrors).toEqual([null]);
      savedProject.persistenceRuntime.updateWorkspaceSnapshot(
        savedProject.plannerWorkspaceState(),
        savedProject.workspaceController.getState(),
      );
      savedProject.persistenceRuntime.synchronizeCanonicalSession();
      expect(savedProject.plannerWorkspaceState().selectedPlannerMapId).toBe("forest");
      expect(savedProject.plannerWorkspaceState().activeMapId).toBe(forestMap.id);
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);
      expect(createIntegrationRepository(savedProject.projectStorage).openProject(
        savedProject.projectId,
      ).project.maps).toHaveLength(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not add a map when saving the previous map fails", async () => {
    vi.useFakeTimers();
    try {
      const savedProject = await openIntegrationProjectWithSavedStandardMap(
        createIntegrationPreviewWebpBytes(71),
      );
      const encodingError = new Error(
        'WebP encoding failed for planner map ID "standard".',
      );
      savedProject.editPlannerWorkspaceState({ season: "winter", type: "select-season" });
      savedProject.editPlannerWorkspaceState({
        placementSnapshot: {
          ...savedProject.plannerWorkspaceState().placementHistory.currentState,
          crops: [{ cropId: "crop:24", x: 8, y: 9 }],
        },
        type: "reset-placement-history",
      });
      savedProject.persistenceRuntime.scheduleAutomaticSave();
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
      vi.mocked(encodePngAsWebp).mockRejectedValueOnce(encodingError);
      const createMapSpy = vi.spyOn(savedProject.workspaceController, "createMap");
      const activateMapSpy = vi.spyOn(savedProject.workspaceController, "activateMap");

      await createPlannerProjectMapActions({
        activeProjectId: savedProject.projectId,
        season: savedProject.plannerWorkspaceState().season,
        workspaceController: savedProject.workspaceController,
      }).onAddMap("forest");

      expect(createMapSpy).not.toHaveBeenCalled();
      expect(activateMapSpy).not.toHaveBeenCalled();
      expect(savedProject.settledErrors).toEqual([encodingError]);
      expect(savedProject.plannerWorkspaceState().season).toBe("winter");
      expect(savedProject.plannerWorkspaceState().selectedPlannerMapId).toBe("standard");
      expect(savedProject.workspaceController.getState().activeSession?.mapId).toBe(
        savedProject.standardMapId,
      );
      expect(savedProject.workspaceController.getState().activeProject?.project.maps).toHaveLength(1);
      const storedStandardMap = readStoredProjectMap(
        savedProject.projectStorage,
        savedProject.projectId,
        "Farm.tmx",
      );
      expect(storedStandardMap.season).toBe("spring");
      expect(storedStandardMap.state.crops).toEqual([{ cropId: "crop:24", x: 3, y: 5 }]);
      expect(createIntegrationRepository(savedProject.projectStorage).openProject(
        savedProject.projectId,
      ).project.maps).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not create an extra first map when adding a map to an empty project", async () => {
    vi.useFakeTimers();
    try {
      const projectStorage = createIntegrationBrowserStorage();
      const workspaceController = createReferenceProjectWorkspaceController({
        repository: createIntegrationRepository(projectStorage),
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
        initialWorkspaceState: workspaceController.getState(),
        workspaceController,
      });
      workspaceController.createProject({
        projectName: "Untitled Project",
        season: "spring",
      });
      const projectId = workspaceController.getState().activeProject?.id;
      if (projectId === undefined) {
        throw new Error(
          `Expected the empty project to have an ID before Add map; received ${JSON.stringify(projectId)}.`,
        );
      }
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        season: "winter",
        type: "select-season",
      });
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );
      persistenceRuntime.scheduleAutomaticSave();
      const createMapSpy = vi.spyOn(workspaceController, "createMap");

      await createPlannerProjectMapActions({
        activeProjectId: projectId,
        season: plannerWorkspaceState.season,
        workspaceController,
      }).onAddMap("forest");

      expect(createMapSpy).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);
      const storedMaps = createIntegrationRepository(projectStorage).openProject(projectId).project.maps;
      expect(storedMaps).toHaveLength(1);
      expect(storedMaps[0]?.mapFile).toBe("Farm_Foraging.tmx");
      expect(workspaceController.getState().activeProject?.project.maps).toHaveLength(1);
      expect(workspaceController.getState().activeSession?.mapId).toBe(storedMaps[0]?.id);
    } finally {
      vi.useRealTimers();
    }
  });

  it("calls the atomic new-plan save once and rethrows its failure", async () => {
    const callOrder: string[] = [];
    await createLocalProjectAndSaveCurrentMap({
      createProjectWithCurrentMap: async () => {
        callOrder.push("create-project-with-current-map");
      },
    });
    expect(callOrder).toEqual(["create-project-with-current-map"]);

    const saveError = new Error(
      'Cannot save the current canvas as the first map for project ID "project-empty".',
    );
    await expect(createLocalProjectAndSaveCurrentMap({
      createProjectWithCurrentMap: async () => {
        throw saveError;
      },
    })).rejects.toBe(saveError);
  });

  it("saves a new plan into browser storage and restores the later layout", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    vi.useFakeTimers();
    try {
      const projectStorage = createIntegrationBrowserStorage();
      const repository = createIntegrationRepository(projectStorage);
      const workspaceController = createReferenceProjectWorkspaceController({
        repository,
        initialProjectSummaries: [],
      });
      let plannerWorkspaceState = reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState("standard"),
        {
          placementSnapshot: {
            ...createEmptyPlacementSnapshot(),
            crops: [{ cropId: "crop:24", x: 3, y: 5 }],
          },
          type: "reset-placement-history",
        },
      );
      const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
        dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
          plannerWorkspaceState = reducePlannerWorkspaceState(
            plannerWorkspaceState,
            plannerWorkspaceAction,
          );
        },
        initialPlannerWorkspaceState: plannerWorkspaceState,
        initialWorkspaceState: workspaceController.getState(),
        newProjectName: "Untitled Project",
        workspaceController,
      });
      const pngBlob = new Blob(["library preview"], { type: "image/png" });
      persistenceRuntime.handleMapImageExporterReady("standard", {
        captureCleanMapImage: vi.fn(async () => pngBlob),
        captureScreenshot: vi.fn(async () => pngBlob),
      });
      const firstPreviewBytes = createIntegrationPreviewWebpBytes(21);
      const editedPreviewBytes = createIntegrationPreviewWebpBytes(22);
      vi.mocked(encodePngAsWebp)
        .mockResolvedValueOnce(firstPreviewBytes)
        .mockResolvedValueOnce(editedPreviewBytes);
      const projectActions = createPlannerLocalProjectActions({
        newProjectName: "Untitled Project",
        season: plannerWorkspaceState.season,
        workspaceController,
      });

      await createLocalProjectAndSaveCurrentMap({
        createProjectWithCurrentMap: persistenceRuntime.createProjectWithCurrentMap,
      });
      expect(projectStorage.writtenStorageKeys).toEqual([referenceProjectStorageKey]);
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
      expect(workspaceController.getState().activeProject?.title).toBe("Untitled Project");
      expect(workspaceController.getState().activeProject?.project.maps).toHaveLength(1);
      expect(workspaceController.getState().activeSession?.sourceMap).toMatchObject({
        label: "Standard Farm",
        mapFile: "Farm.tmx",
      });
      expect(
        repository.openProject(createdProjectId).project.maps[0]?.state.crops,
      ).toEqual([{ cropId: "crop:24", x: 3, y: 5 }]);
      expect(repository.listProjects()[0]?.activeMapThumbnailDataUrl).toBe(
        createWebpDataUrl(firstPreviewBytes),
      );

      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        placementSnapshot: {
          ...createEmptyPlacementSnapshot(),
          crops: [{ cropId: "crop:24", x: 8, y: 9 }],
        },
        type: "reset-placement-history",
      });
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        season: "winter",
        type: "select-season",
      });
      const mapRenderOptionsBeforeEdit = plannerWorkspaceState.mapRenderOptions;
      const editedMapRenderOptions = setFarmCaveChoice(
        setFarmSpouseId(mapRenderOptionsBeforeEdit, "Abigail"),
        "bats",
      );
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        mapRenderOptions: editedMapRenderOptions,
        type: "set-map-render-options",
      });
      if (
        JSON.stringify(plannerWorkspaceState.mapRenderOptions)
        === JSON.stringify(mapRenderOptionsBeforeEdit)
      ) {
        throw new Error(
          "Expected the stored map render options edit to change the saved value; "
            + `received ${JSON.stringify(plannerWorkspaceState.mapRenderOptions)}.`,
        );
      }
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );
      persistenceRuntime.scheduleAutomaticSave();
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);

      const reloadedRepository = createIntegrationRepository(projectStorage);
      const reloadedController = createReferenceProjectWorkspaceController({
        repository: reloadedRepository,
        initialProjectSummaries: reloadedRepository.listProjects(),
      });
      reloadedController.openProject(createdProjectId);
      expect(reloadedRepository.listProjects()).toHaveLength(1);
      expect(reloadedController.getState().activeSession?.placementSnapshot.crops).toEqual([
        { cropId: "crop:24", x: 8, y: 9 },
      ]);
      expect(reloadedController.getState().activeSession?.season).toBe("winter");
      expect(
        reloadedController.getState().activeSession?.sourceMap.state.mapRenderOptions,
      ).toEqual(plannerWorkspaceState.mapRenderOptions);
      expect(reloadedRepository.listProjects()[0]?.activeMapThumbnailDataUrl).toBe(
        createWebpDataUrl(editedPreviewBytes),
      );
      expect(projectStorage.writtenStorageKeys).toContain(referenceProjectStorageKey);
      expect(
        projectStorage.writtenStorageKeys.filter(
          (storageKey) => storageKey !== referenceProjectStorageKey,
        ),
      ).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not leave an empty New plan when the first preview save fails and keeps the canvas", async () => {
    vi.mocked(encodePngAsWebp).mockReset();
    const previewFailure = new Error(
      "First map preview export failed: WebP encoder rejected the captured PNG.",
    );
    vi.mocked(encodePngAsWebp).mockRejectedValue(previewFailure);
    const projectStorage = createIntegrationBrowserStorage();
    const repository = createIntegrationRepository(projectStorage);
    const workspaceController = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: [],
    });
    const existingProject = seedExistingIntegrationProject(workspaceController);
    const existingSession = workspaceController.getState().activeSession;
    if (existingSession === null) {
      throw new Error(
        `Expected seeded project ${JSON.stringify(existingProject.projectId)} to have an active session.`,
      );
    }
    const openCanonicalMapAction = createCanonicalSessionTransition(
      existingSession,
      workspaceController,
      createCanonicalMapIdentityReference(),
    );
    if (openCanonicalMapAction === null) {
      throw new Error(
        `Expected seeded project ${JSON.stringify(existingProject.projectId)} to open its canonical map.`,
      );
    }
    const canvasCrops = [{ cropId: "crop:24", x: 4, y: 7 }];
    let plannerWorkspaceState = reducePlannerWorkspaceState(
      reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState("standard"),
        openCanonicalMapAction,
      ),
      {
        placementSnapshot: {
          ...createEmptyPlacementSnapshot(),
          crops: canvasCrops,
        },
        type: "reset-placement-history",
      },
    );
    const dispatchedPlannerActions: PlannerWorkspaceAction[] = [];
    const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        dispatchedPlannerActions.push(plannerWorkspaceAction);
        plannerWorkspaceState = reducePlannerWorkspaceState(
          plannerWorkspaceState,
          plannerWorkspaceAction,
        );
      },
      initialPlannerWorkspaceState: plannerWorkspaceState,
      initialWorkspaceState: workspaceController.getState(),
      newProjectName: "Untitled Project",
      workspaceController,
    });
    const pngBlob = new Blob(["failed new plan preview"], { type: "image/png" });
    persistenceRuntime.handleMapImageExporterReady("standard", {
      captureCleanMapImage: vi.fn(async () => pngBlob),
      captureScreenshot: vi.fn(async () => pngBlob),
    });
    const projectActions = createPlannerLocalProjectActions({
      newProjectName: "Untitled Project",
      season: plannerWorkspaceState.season,
      workspaceController,
    });
    const localProjectsCopy = getSaveModalCopy("en").localProjects;
    const reactHookHarness = createLocalProjectPanelHookHarness();
    vi.doMock("react", async () => {
      const reactExports = await vi.importActual<typeof import("react")>("react");
      return {
        ...reactExports,
        useCallback: <Callback extends (...callbackArguments: never[]) => unknown>(
          callback: Callback,
        ) => callback,
        useEffect: () => undefined,
        useLayoutEffect: () => undefined,
        useRef: reactHookHarness.useRef,
        useState: reactHookHarness.useState,
      };
    });

    try {
      const { LocalProjectPanel } = await import("../../src/components/local-project-panel");

      function renderLocalProjectPanel(): React.ReactElement {
        reactHookHarness.beginRender();
        const workspaceState = workspaceController.getState();
        const panel = LocalProjectPanel({
          copy: localProjectsCopy,
          currentProjectId: workspaceState.activeProject?.id ?? null,
          currentProjectMapInstanceCount:
            workspaceState.activeProject?.project.maps.length ?? null,
          currentProjectMapInstanceName:
            workspaceState.activeSession?.sourceMap.label ?? null,
          currentProjectName: workspaceState.activeProject?.title ?? null,
          deleteCopy: getSaveModalCopy("en").deleteProject,
          onCreateProject: () => createLocalProjectAndSaveCurrentMap({
            createProjectWithCurrentMap: persistenceRuntime.createProjectWithCurrentMap,
          }),
          onDeleteProject: (projectId) => workspaceController.deleteProject(projectId),
          onDuplicateProject: () => {
            throw new Error("Duplicate is outside this New plan failure test.");
          },
          onExportProject: (projectId) => workspaceController.exportProject(projectId),
          onImportProject: () => {
            throw new Error("Import is outside this New plan failure test.");
          },
          onOpenProject: (projectId) => workspaceController.openProject(projectId),
          onRenameProject: (projectId, requestedName) => {
            workspaceController.renameProject(projectId, requestedName);
          },
          projects: workspaceState.projectSummaries,
          storageErrorMessage: null,
          storageStatus: "ready",
        });
        if (!React.isValidElement(panel)) {
          throw new Error("Expected LocalProjectPanel to return an element.");
        }
        return panel;
      }

      const panelBeforeNewPlan = renderLocalProjectPanel();
      const writtenKeyCountBeforeNewPlan = projectStorage.writtenStorageKeys.length;
      clickRenderedButton(panelBeforeNewPlan, localProjectsCopy.newProject);
      await flushPendingPromiseCallbacks();
      expect(projectStorage.writtenStorageKeys).toHaveLength(writtenKeyCountBeforeNewPlan);
      const panelAfterFailedNewPlan = renderLocalProjectPanel();
      const alertMessages = collectRenderedText(panelAfterFailedNewPlan, "p", (properties) => (
        properties.role === "alert"
      ));
      if (alertMessages.length !== 1) {
        throw new Error(
          `Expected one visible project alert; received ${JSON.stringify(alertMessages)}.`,
        );
      }

      expect(alertMessages[0]).toBe(localProjectsCopy.actionFailure(previewFailure.message));
      expect(alertMessages[0]).toContain(previewFailure.message);
      expect(textContent(panelAfterFailedNewPlan)).not.toContain(localProjectsCopy.createdProject);
      expect(textContent(panelAfterFailedNewPlan)).not.toContain("Untitled Project");
      expect(textContent(panelAfterFailedNewPlan)).not.toContain(localProjectsCopy.noMapPreview);
      expect(collectRenderedAttribute(panelAfterFailedNewPlan, "data-project-id")).toEqual([
        existingProject.projectId,
      ]);
      expect(collectRenderedAttribute(panelAfterFailedNewPlan, "src")).toEqual([
        existingProject.thumbnailDataUrl,
      ]);
      expect(workspaceController.exportProject(existingProject.projectId)).toBe(
        existingProject.serializedProject,
      );
      expect(workspaceController.getState().activeProject?.id).toBe(existingProject.projectId);
      expect(workspaceController.getState().projectSummaries.map((projectSummary) => projectSummary.id))
        .toEqual([existingProject.projectId]);
      expect(repository.listProjects()).toEqual([
        expect.objectContaining({
          activeMapThumbnailDataUrl: existingProject.thumbnailDataUrl,
          id: existingProject.projectId,
          mapCount: 1,
          title: "Existing Farm",
        }),
      ]);
      expect(dispatchedPlannerActions).toEqual([]);
      expect(plannerWorkspaceState.selectedPlannerMapId).toBe("standard");
      expect(plannerWorkspaceState.placementHistory.currentState.crops).toEqual(canvasCrops);
      expect(plannerWorkspaceState.placementHistory.currentState.crops).not.toEqual(
        existingProject.placementSnapshot.crops,
      );

      const reloadedRepository = createIntegrationRepository(projectStorage);
      const reloadedController = createReferenceProjectWorkspaceController({
        repository: reloadedRepository,
        initialProjectSummaries: reloadedRepository.listProjects(),
      });
      reloadedController.openProject(existingProject.projectId);
      expect(reloadedController.getState().activeProject?.project.maps).toHaveLength(1);
      expect(reloadedController.getState().activeSession?.placementSnapshot.crops).toEqual(
        existingProject.placementSnapshot.crops,
      );
      expect(reloadedRepository.listProjects()).toHaveLength(1);
    } finally {
      vi.doUnmock("react");
      vi.resetModules();
      vi.mocked(encodePngAsWebp).mockReset();
    }
  });

  it("does not create a map when automatic save has no current map", async () => {
    vi.useFakeTimers();
    try {
      const projectStorage = createIntegrationBrowserStorage();
      const repository = createIntegrationRepository(projectStorage);
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
    } finally {
      vi.useRealTimers();
    }
  });

  it("schedules an automatic save from persistence controls after the map layout changes", async () => {
    const persistenceControlsHookRuntime = createPersistenceControlsHookRuntime();
    vi.resetModules();
    vi.doMock("react", () => persistenceControlsHookRuntime.reactModule);
    try {
      const webpModule = await import("../../src/projects/browser-png-to-webp");
      const { usePlannerWorkspacePersistenceControls } = await import(
        "../../src/components/use-planner-workspace-persistence-controls"
      );
      vi.mocked(webpModule.encodePngAsWebp).mockReset();
      vi.mocked(webpModule.encodePngAsWebp).mockResolvedValue(
        createIntegrationPreviewWebpBytes(41),
      );
      vi.useFakeTimers();

      const projectStorage = createIntegrationBrowserStorage();
      const repository = createIntegrationRepository(projectStorage);
      const workspaceController = createReferenceProjectWorkspaceController({
        repository,
        initialProjectSummaries: [],
      });
      let plannerWorkspaceState = reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState("standard"),
        {
          placementSnapshot: {
            ...createEmptyPlacementSnapshot(),
            crops: [{ cropId: "crop:24", x: 3, y: 5 }],
          },
          type: "reset-placement-history",
        },
      );
      const mountedPersistenceControls = persistenceControlsHookRuntime.mount(() =>
        usePlannerWorkspacePersistenceControls({
          dispatchPlannerWorkspaceAction: (
            plannerWorkspaceAction: PlannerWorkspaceAction,
          ) => {
            plannerWorkspaceState = reducePlannerWorkspaceState(
              plannerWorkspaceState,
              plannerWorkspaceAction,
            );
          },
          newProjectName: "Untitled Project",
          plannerWorkspaceState,
          workspaceController,
          workspaceState: workspaceController.getState(),
        }),
      );
      const initialPersistenceControls = mountedPersistenceControls.render();
      const pngBlob = new Blob(["layout autosave preview"], { type: "image/png" });
      initialPersistenceControls.handleMapImageExporterReady("standard", {
        captureCleanMapImage: vi.fn(async () => pngBlob),
        captureScreenshot: vi.fn(async () => pngBlob),
      });
      const projectActions = createPlannerLocalProjectActions({
        newProjectName: "Untitled Project",
        season: plannerWorkspaceState.season,
        workspaceController,
      });
      await createLocalProjectAndSaveCurrentMap({
        createProjectWithCurrentMap: initialPersistenceControls.createProjectWithCurrentMap,
      });
      const createdProjectId = workspaceController.getState().activeProject?.id;
      if (createdProjectId === undefined) {
        throw new Error("Expected New plan to create a project ID.");
      }

      mountedPersistenceControls.render();
      mountedPersistenceControls.render();
      if (
        plannerWorkspaceState.activeProjectId === null
        || plannerWorkspaceState.activeMapId === null
      ) {
        throw new Error(
          "Expected persistence controls to synchronize the saved map before the layout edit; "
            + `received project ID ${JSON.stringify(plannerWorkspaceState.activeProjectId)} `
            + `and map ID ${JSON.stringify(plannerWorkspaceState.activeMapId)}.`,
        );
      }
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);
      const encodeCountBeforeLayoutChange = vi.mocked(webpModule.encodePngAsWebp).mock.calls.length;
      expect(
        openReloadedIntegrationSession(projectStorage, createdProjectId).placementSnapshot.crops,
      ).toEqual([{ cropId: "crop:24", x: 3, y: 5 }]);

      const layoutKeyBeforeEdit = createAutomaticMapSaveLayoutKey(plannerWorkspaceState);
      plannerWorkspaceState = reducePlannerWorkspaceState(plannerWorkspaceState, {
        placementSnapshot: {
          ...plannerWorkspaceState.placementHistory.currentState,
          crops: [{ cropId: "crop:24", x: 11, y: 12 }],
        },
        type: "reset-placement-history",
      });
      const layoutKeyAfterEdit = createAutomaticMapSaveLayoutKey(plannerWorkspaceState);
      if (layoutKeyAfterEdit === layoutKeyBeforeEdit) {
        throw new Error(
          "Expected the map layout edit to change the automatic save key; "
            + `received ${layoutKeyAfterEdit}.`,
        );
      }
      mountedPersistenceControls.render();
      expect(vi.mocked(webpModule.encodePngAsWebp).mock.calls.length).toBe(
        encodeCountBeforeLayoutChange,
      );
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds - 1);
      expect(
        openReloadedIntegrationSession(projectStorage, createdProjectId).placementSnapshot.crops,
      ).toEqual([{ cropId: "crop:24", x: 3, y: 5 }]);
      expect(vi.mocked(webpModule.encodePngAsWebp).mock.calls.length).toBe(
        encodeCountBeforeLayoutChange,
      );

      await vi.advanceTimersByTimeAsync(1);
      const reloadedSession = openReloadedIntegrationSession(
        projectStorage,
        createdProjectId,
      );
      expect(reloadedSession.placementSnapshot.crops).toEqual([
        { cropId: "crop:24", x: 11, y: 12 },
      ]);
      expect(vi.mocked(webpModule.encodePngAsWebp).mock.calls.length).toBe(
        encodeCountBeforeLayoutChange + 1,
      );
      expect(mountedPersistenceControls.render().automaticSaveErrorMessage).toBeNull();
      mountedPersistenceControls.unmount();
    } finally {
      persistenceControlsHookRuntime.unmountMountedHook();
      vi.doUnmock("react");
      vi.resetModules();
      vi.useRealTimers();
    }
  });

  it("saves summer after the season resource key reloads through PlannerWorkspace", async () => {
    const seasonWorkspaceHarness = createPlannerWorkspaceSeasonHarness();
    const pendingSeasonBootstraps: PendingSeasonBootstrap[] = [];
    vi.resetModules();
    vi.doMock("react", async () => {
      const actualReact = await vi.importActual<typeof import("react")>("react");
      return {
        ...actualReact,
        ...seasonWorkspaceHarness.reactModule,
      };
    });
    try {
      const webpModule = await import("../../src/projects/browser-png-to-webp");
      const { PlannerWorkspace } = await import("../../src/components/planner-workspace");
      vi.mocked(webpModule.encodePngAsWebp).mockReset();
      vi.mocked(webpModule.encodePngAsWebp).mockResolvedValue(
        createIntegrationPreviewWebpBytes(51),
      );
      vi.useFakeTimers();

      const projectStorage = createIntegrationBrowserStorage();
      const repository = createIntegrationRepository(projectStorage);
      const plannerWorkspaceStartup: PlannerWorkspaceStartup = {
        ...createPlannerWorkspaceInitialStartup({ viewportWidth: 1280 }),
        bootstrapWorkspace: (
          bootstrapInput: PendingSeasonBootstrapInput,
        ) => new Promise<PreparedPlannerWorkspace | null>((resolve) => {
          pendingSeasonBootstraps.push({
            resolve,
            resourceGeneration: bootstrapInput.resourceGeneration,
            season: bootstrapInput.mapRequest.season,
            mapId: bootstrapInput.mapRequest.mapId,
          });
        }),
      };
      const commitPlannerWorkspace = () => seasonWorkspaceHarness.commit(
        React.createElement(PlannerWorkspace, {
          locale: "en",
          startup: plannerWorkspaceStartup,
        }),
      );

      const loadingMount = commitPlannerWorkspace();
      expect(loadingMount.workspaceStateKind).toBe("loading");
      expect(loadingMount.persistenceBoundaryCount).toBe(0);
      expect(loadingMount.preparedContentCount).toBe(0);
      const springBootstrap = requireOnlyPendingSeasonBootstrap(pendingSeasonBootstraps);
      if (springBootstrap.season !== "spring") {
        throw new Error(
          "Expected the first planner map request season to be spring. "
            + `Received ${JSON.stringify(springBootstrap.season)}.`,
        );
      }
      releasePendingSeasonBootstrap(
        pendingSeasonBootstraps,
        createSeasonPreparedWorkspace(repository, springBootstrap),
      );
      await vi.advanceTimersByTimeAsync(0);
      const preparedSpringMount = requirePreparedSeasonMount(commitPlannerWorkspace());
      const springPreviewBlob = new Blob(["spring map preview"], { type: "image/png" });
      preparedSpringMount.persistenceControls.handleMapImageExporterReady(
        preparedSpringMount.plannerWorkspaceState.selectedPlannerMapId,
        {
          captureCleanMapImage: vi.fn(async () => springPreviewBlob),
          captureScreenshot: vi.fn(async () => springPreviewBlob),
        },
      );
      const projectActions = createPlannerLocalProjectActions({
        newProjectName: "Untitled Project",
        season: preparedSpringMount.plannerWorkspaceState.season,
        workspaceController: preparedSpringMount.workspaceController,
      });
      await createLocalProjectAndSaveCurrentMap({
        createProjectWithCurrentMap:
          preparedSpringMount.persistenceControls.createProjectWithCurrentMap,
      });
      const createdProjectId = preparedSpringMount.workspaceController.getState().activeProject?.id;
      const createdMapId = preparedSpringMount.workspaceController.getState().activeSession?.mapId;
      if (createdProjectId === undefined || createdMapId === undefined) {
        throw new Error(
          "Expected New plan to create a canonical project and map. "
            + `Received project ID ${JSON.stringify(createdProjectId)} `
            + `and map ID ${JSON.stringify(createdMapId)}.`,
        );
      }

      commitPlannerWorkspace();
      const synchronizedSpringMount = requirePreparedSeasonMount(commitPlannerWorkspace());
      if (
        synchronizedSpringMount.plannerWorkspaceState.season !== "spring"
        || synchronizedSpringMount.plannerWorkspaceState.activeProjectId !== createdProjectId
        || synchronizedSpringMount.plannerWorkspaceState.activeMapId !== createdMapId
      ) {
        throw new Error(
          "Expected PlannerWorkspace to synchronize the saved spring map before the season change. "
            + `Received project ID ${JSON.stringify(synchronizedSpringMount.plannerWorkspaceState.activeProjectId)}, `
            + `map ID ${JSON.stringify(synchronizedSpringMount.plannerWorkspaceState.activeMapId)}, `
            + `and season ${JSON.stringify(synchronizedSpringMount.plannerWorkspaceState.season)}.`,
        );
      }
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);
      const storedProjectBeforeSeasonChange = createIntegrationRepository(
        projectStorage,
      ).openProject(createdProjectId);
      const storedMapBeforeSeasonChange = readStoredProjectMap(
        projectStorage,
        createdProjectId,
        "Farm.tmx",
      );
      expect(storedMapBeforeSeasonChange.id).toBe(createdMapId);
      expect(storedMapBeforeSeasonChange.season).toBe("spring");

      synchronizedSpringMount.plannerWorkspaceStateController.dispatchPlannerWorkspaceAction({
        season: "summer",
        type: "select-season",
      });
      const seasonLoadingMount = commitPlannerWorkspace();
      const summerBootstrap = requireOnlyPendingSeasonBootstrap(pendingSeasonBootstraps);
      if (summerBootstrap.season !== "summer") {
        throw new Error(
          "Expected selecting summer to request summer map resources. "
            + `Received ${JSON.stringify(summerBootstrap.season)}.`,
        );
      }
      expect(seasonLoadingMount.workspaceStateKind).toBe("loading");
      expect(seasonLoadingMount.persistenceBoundaryCount).toBe(1);
      expect(seasonLoadingMount.preparedContentCount).toBe(0);
      if (
        seasonLoadingMount.plannerWorkspaceState === null
        || seasonLoadingMount.plannerWorkspaceState.season !== "summer"
        || seasonLoadingMount.plannerWorkspaceState.activeMapId !== createdMapId
      ) {
        throw new Error(
          "Expected the mounted planner state to keep summer while season resources load. "
            + `Received season ${JSON.stringify(seasonLoadingMount.plannerWorkspaceState?.season ?? null)} `
            + `and map ID ${JSON.stringify(seasonLoadingMount.plannerWorkspaceState?.activeMapId ?? null)}.`,
        );
      }
      synchronizedSpringMount.persistenceControls.handleMapImageExporterReady(
        synchronizedSpringMount.plannerWorkspaceState.selectedPlannerMapId,
        null,
      );
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);

      const storedProjectWhileSeasonResourcesLoad = createIntegrationRepository(
        projectStorage,
      ).openProject(createdProjectId);
      expect(readStoredProjectMap(
        projectStorage,
        createdProjectId,
        "Farm.tmx",
      ).season).toBe("spring");
      expect(storedProjectWhileSeasonResourcesLoad.updated_at).toBe(
        storedProjectBeforeSeasonChange.updated_at,
      );

      releasePendingSeasonBootstrap(
        pendingSeasonBootstraps,
        createSeasonPreparedWorkspace(repository, summerBootstrap),
      );
      await vi.advanceTimersByTimeAsync(0);
      const restoredSummerMount = requirePreparedSeasonMount(commitPlannerWorkspace());
      if (
        restoredSummerMount.plannerWorkspaceState.season !== "summer"
        || restoredSummerMount.plannerWorkspaceState.activeMapId !== createdMapId
      ) {
        throw new Error(
          "Expected the restored summer workspace to keep the selected season. "
            + `Received season ${JSON.stringify(restoredSummerMount.plannerWorkspaceState.season)} `
            + `and map ID ${JSON.stringify(restoredSummerMount.plannerWorkspaceState.activeMapId)}.`,
        );
      }
      expect(restoredSummerMount.persistenceControls.automaticSaveErrorMessage).toBeNull();

      vi.mocked(webpModule.encodePngAsWebp).mockResolvedValueOnce(
        createIntegrationPreviewWebpBytes(52),
      );
      const summerPreviewBlob = new Blob(["summer map preview"], { type: "image/png" });
      restoredSummerMount.persistenceControls.handleMapImageExporterReady(
        restoredSummerMount.plannerWorkspaceState.selectedPlannerMapId,
        {
          captureCleanMapImage: vi.fn(async () => summerPreviewBlob),
          captureScreenshot: vi.fn(async () => summerPreviewBlob),
        },
      );
      expect(restoredSummerMount.persistenceControls.automaticSaveErrorMessage).toBeNull();
      await vi.advanceTimersByTimeAsync(automaticMapSaveDelayMilliseconds);
      const savedSummerMount = requirePreparedSeasonMount(commitPlannerWorkspace());

      const storedProjectAfterSeasonSave = createIntegrationRepository(
        projectStorage,
      ).openProject(createdProjectId);
      const storedMapAfterSeasonSave = readStoredProjectMap(
        projectStorage,
        createdProjectId,
        "Farm.tmx",
      );
      expect(storedMapAfterSeasonSave.id).toBe(createdMapId);
      expect(storedMapAfterSeasonSave.season).toBe("summer");
      expect(storedProjectAfterSeasonSave.project.maps).toHaveLength(1);
      expect(storedProjectAfterSeasonSave.updated_at > storedProjectBeforeSeasonChange.updated_at)
        .toBe(true);
      expect(savedSummerMount.plannerWorkspaceState.season).toBe("summer");
      expect(savedSummerMount.plannerWorkspaceState.activeMapId).toBe(createdMapId);
      expect(savedSummerMount.persistenceControls.automaticSaveErrorMessage).toBeNull();
    } finally {
      seasonWorkspaceHarness.unmount();
      vi.doUnmock("react");
      vi.resetModules();
      vi.useRealTimers();
    }
  });
});

type PendingSeasonBootstrapInput = BrowserPlannerWorkspaceBootstrapInput;

type PendingSeasonBootstrap = {
  mapId: string;
  resolve: (preparedWorkspace: PreparedPlannerWorkspace | null) => void;
  resourceGeneration: number;
  season: string;
};

type SeasonWorkspaceMapImageExporter = {
  captureCleanMapImage: () => Promise<Blob>;
  captureScreenshot: () => Promise<Blob>;
};

type SeasonWorkspacePersistenceControls = {
  automaticSaveErrorMessage: string | null;
  handleMapImageExporterReady: (
    plannerMapId: string,
    mapImageExporter: SeasonWorkspaceMapImageExporter | null,
  ) => void;
  createProjectWithCurrentMap: () => Promise<void>;
};

type SeasonWorkspaceMount = {
  persistenceBoundaryCount: number;
  persistenceControls: SeasonWorkspacePersistenceControls | null;
  plannerWorkspaceState: PlannerWorkspaceState | null;
  plannerWorkspaceStateController: PlannerWorkspaceStateController | null;
  preparedContentCount: number;
  workspaceController: ReturnType<typeof createReferenceProjectWorkspaceController> | null;
  workspaceStateKind: string | null;
};

type SeasonHarnessEffect = {
  dependencies: readonly unknown[];
  effect: () => void | (() => void);
  hookIndex: number;
};

type SeasonHarnessEffectSlot = {
  cleanup?: () => void;
  dependencies: readonly unknown[];
};

type SeasonHarnessMemoSlot = {
  dependencies: readonly unknown[];
  value: unknown;
};

type SeasonHarnessFiber = {
  componentName: string;
  effectSlots: Map<number, SeasonHarnessEffectSlot>;
  hookIndex: number;
  memoSlots: Map<number, SeasonHarnessMemoSlot>;
  pendingEffects: SeasonHarnessEffect[];
  pendingLayoutEffects: SeasonHarnessEffect[];
  renderedHookCount: number | null;
  setterSlots: unknown[];
  stateSlots: unknown[];
};

const plannerWorkspaceSeasonComponentNames = new Set([
  "PlannerWorkspace",
  "PlannerWorkspaceRenderedBoundary",
  "PlannerWorkspaceGeometry",
  "PlannerWorkspacePersistenceBoundary",
]);

function createPlannerWorkspaceSeasonHarness() {
  const fibers = new Map<string, SeasonHarnessFiber>();
  let currentFiber: SeasonHarnessFiber | null = null;

  function requireSeasonHarnessFiber(hookName: string): SeasonHarnessFiber {
    if (currentFiber === null) {
      throw new Error(
        `Planner workspace season harness called ${hookName} outside a mounted component.`,
      );
    }
    return currentFiber;
  }

  function readSeasonHarnessDependencies(
    dependencies: readonly unknown[] | undefined,
    hookName: string,
  ): readonly unknown[] {
    if (!Array.isArray(dependencies)) {
      throw new Error(
        `Planner workspace season harness ${hookName} requires a dependency array. `
          + `Received ${JSON.stringify(dependencies)}.`,
      );
    }
    return dependencies;
  }

  function haveEqualSeasonHarnessDependencies(
    previousDependencies: readonly unknown[],
    nextDependencies: readonly unknown[],
  ): boolean {
    return previousDependencies.length === nextDependencies.length
      && previousDependencies.every((dependency, index) =>
        Object.is(dependency, nextDependencies[index]),
      );
  }

  function scheduleSeasonHarnessEffect(
    pendingEffects: SeasonHarnessEffect[],
    effect: () => void | (() => void),
    dependencies: readonly unknown[] | undefined,
    hookName: string,
  ): void {
    const fiber = requireSeasonHarnessFiber(hookName);
    const hookIndex = fiber.hookIndex;
    fiber.hookIndex += 1;
    const nextDependencies = readSeasonHarnessDependencies(dependencies, hookName);
    const previousEffect = fiber.effectSlots.get(hookIndex);
    if (
      previousEffect !== undefined
      && haveEqualSeasonHarnessDependencies(previousEffect.dependencies, nextDependencies)
    ) {
      return;
    }
    pendingEffects.push({
      dependencies: nextDependencies,
      effect,
      hookIndex,
    });
  }

  function runSeasonHarnessEffects(
    fiber: SeasonHarnessFiber,
    pendingEffects: readonly SeasonHarnessEffect[],
  ): void {
    for (const pendingEffect of pendingEffects) {
      const previousEffect = fiber.effectSlots.get(pendingEffect.hookIndex);
      previousEffect?.cleanup?.();
      const cleanup = pendingEffect.effect();
      fiber.effectSlots.set(pendingEffect.hookIndex, {
        cleanup: typeof cleanup === "function" ? cleanup : undefined,
        dependencies: pendingEffect.dependencies,
      });
    }
  }

  function finishSeasonHarnessFiber(fiber: SeasonHarnessFiber): void {
    if (
      fiber.renderedHookCount !== null
      && fiber.hookIndex !== fiber.renderedHookCount
    ) {
      throw new Error(
        `Planner workspace component ${fiber.componentName} changed its hook count from `
          + `${String(fiber.renderedHookCount)} to ${String(fiber.hookIndex)}.`,
      );
    }
    fiber.renderedHookCount = fiber.hookIndex;
    runSeasonHarnessEffects(fiber, fiber.pendingLayoutEffects);
    runSeasonHarnessEffects(fiber, fiber.pendingEffects);
  }

  function createSeasonHarnessFiber(componentName: string): SeasonHarnessFiber {
    return {
      componentName,
      effectSlots: new Map(),
      hookIndex: 0,
      memoSlots: new Map(),
      pendingEffects: [],
      pendingLayoutEffects: [],
      renderedHookCount: null,
      setterSlots: [],
      stateSlots: [],
    };
  }

  function commit(node: React.ReactNode): SeasonWorkspaceMount {
    const observation = createEmptySeasonWorkspaceMount();
    const visitedFiberKeys = new Set<string>();
    try {
      walkSeasonWorkspaceNode(node, "root", visitedFiberKeys, observation);
    } finally {
      currentFiber = null;
    }
    for (const [fiberKey, fiber] of fibers) {
      if (visitedFiberKeys.has(fiberKey)) continue;
      for (const effectSlot of fiber.effectSlots.values()) {
        effectSlot.cleanup?.();
      }
      fibers.delete(fiberKey);
    }
    return observation;
  }

  function walkSeasonWorkspaceNode(
    node: React.ReactNode,
    path: string,
    visitedFiberKeys: Set<string>,
    observation: SeasonWorkspaceMount,
  ): void {
    if (node === null || node === undefined || typeof node === "boolean") return;
    if (typeof node === "string" || typeof node === "number") return;
    if (Array.isArray(node)) {
      node.forEach((child, index) => {
        walkSeasonWorkspaceNode(child, `${path}/${String(index)}`, visitedFiberKeys, observation);
      });
      return;
    }
    if (!React.isValidElement(node)) {
      throw new Error(
        `Planner workspace season harness received an unsupported node at ${path}. `
          + `Received ${JSON.stringify(typeof node)}.`,
      );
    }
    walkSeasonWorkspaceElement(node, path, visitedFiberKeys, observation);
  }

  function walkSeasonWorkspaceElement(
    element: React.ReactElement,
    path: string,
    visitedFiberKeys: Set<string>,
    observation: SeasonWorkspaceMount,
  ): void {
    const elementType: unknown = element.type;
    if (elementType === React.Fragment) {
      walkSeasonWorkspaceNode(
        readSeasonWorkspaceChildren(element),
        `${path}/fragment`,
        visitedFiberKeys,
        observation,
      );
      return;
    }
    if (typeof elementType === "string") {
      const props = readSeasonWorkspaceProps(element);
      if (elementType === "section") {
        const workspaceStateKind = props["data-planner-workspace-state"];
        if (typeof workspaceStateKind === "string") {
          observation.workspaceStateKind = workspaceStateKind;
        }
      }
      walkSeasonWorkspaceNode(
        readSeasonWorkspaceChildren(element),
        `${path}/${elementType}`,
        visitedFiberKeys,
        observation,
      );
      return;
    }
    if (typeof elementType === "function") {
      walkSeasonWorkspaceFunction(
        elementType,
        element,
        path,
        visitedFiberKeys,
        observation,
      );
      return;
    }
    throw new Error(
      `Planner workspace season harness cannot render element type ${describeSeasonWorkspaceElementType(elementType)} at ${path}.`,
    );
  }

  function walkSeasonWorkspaceFunction(
    elementType: Function,
    element: React.ReactElement,
    path: string,
    visitedFiberKeys: Set<string>,
    observation: SeasonWorkspaceMount,
  ): void {
    const componentName = elementType.name;
    const props = readSeasonWorkspaceProps(element);
    if (componentName === "PreparedPlannerWorkspaceContent") {
      observation.preparedContentCount += 1;
      observation.persistenceControls = readSeasonWorkspacePersistenceControls(props);
      observation.workspaceController = readSeasonWorkspaceController(props);
      return;
    }
    if (!plannerWorkspaceSeasonComponentNames.has(componentName)) return;
    if (componentName === "PlannerWorkspaceRenderedBoundary") {
      const plannerWorkspaceStateController = readSeasonWorkspaceStateController(props);
      observation.plannerWorkspaceStateController = plannerWorkspaceStateController;
      observation.plannerWorkspaceState = plannerWorkspaceStateController.plannerWorkspaceState;
    }
    if (componentName === "PlannerWorkspacePersistenceBoundary") {
      observation.persistenceBoundaryCount += 1;
    }
    const fiberKey = `${path}/${componentName}`;
    const fiber = fibers.get(fiberKey) ?? createSeasonHarnessFiber(componentName);
    fibers.set(fiberKey, fiber);
    visitedFiberKeys.add(fiberKey);
    currentFiber = fiber;
    fiber.hookIndex = 0;
    fiber.pendingEffects = [];
    fiber.pendingLayoutEffects = [];
    const renderedNode = (elementType as (componentProps: unknown) => React.ReactNode)(
      element.props,
    );
    finishSeasonHarnessFiber(fiber);
    currentFiber = null;
    walkSeasonWorkspaceNode(renderedNode, fiberKey, visitedFiberKeys, observation);
  }

  return {
    commit,
    reactModule: {
      useCallback<Callback extends (...callbackArguments: never[]) => unknown>(
        callback: Callback,
        dependencies: readonly unknown[] | undefined,
      ): Callback {
        const fiber = requireSeasonHarnessFiber("useCallback");
        const hookIndex = fiber.hookIndex;
        fiber.hookIndex += 1;
        const nextDependencies = readSeasonHarnessDependencies(dependencies, "useCallback");
        const previousCallback = fiber.memoSlots.get(hookIndex);
        if (
          previousCallback === undefined
          || !haveEqualSeasonHarnessDependencies(
            previousCallback.dependencies,
            nextDependencies,
          )
        ) {
          fiber.memoSlots.set(hookIndex, {
            dependencies: nextDependencies,
            value: callback,
          });
        }
        return readSeasonHarnessMemoValue<Callback>(fiber, hookIndex, "useCallback");
      },
      useEffect(
        effect: () => void | (() => void),
        dependencies?: readonly unknown[],
      ): void {
        const fiber = requireSeasonHarnessFiber("useEffect");
        scheduleSeasonHarnessEffect(fiber.pendingEffects, effect, dependencies, "useEffect");
      },
      useLayoutEffect(
        effect: () => void | (() => void),
        dependencies?: readonly unknown[],
      ): void {
        const fiber = requireSeasonHarnessFiber("useLayoutEffect");
        scheduleSeasonHarnessEffect(
          fiber.pendingLayoutEffects,
          effect,
          dependencies,
          "useLayoutEffect",
        );
      },
      useMemo<MemoValue>(
        factory: () => MemoValue,
        dependencies: readonly unknown[] | undefined,
      ): MemoValue {
        const fiber = requireSeasonHarnessFiber("useMemo");
        const hookIndex = fiber.hookIndex;
        fiber.hookIndex += 1;
        if (typeof factory !== "function") {
          throw new Error(
            `Planner workspace season harness useMemo requires a factory function. Received ${JSON.stringify(factory)}.`,
          );
        }
        const nextDependencies = readSeasonHarnessDependencies(dependencies, "useMemo");
        const previousMemo = fiber.memoSlots.get(hookIndex);
        if (
          previousMemo === undefined
          || !haveEqualSeasonHarnessDependencies(previousMemo.dependencies, nextDependencies)
        ) {
          fiber.memoSlots.set(hookIndex, {
            dependencies: nextDependencies,
            value: factory(),
          });
        }
        return readSeasonHarnessMemoValue<MemoValue>(fiber, hookIndex, "useMemo");
      },
      useReducer<State, Action>(
        reducer: (state: State, action: Action) => State,
        initialArg: unknown,
        initializer?: (initialArgument: unknown) => State,
      ): [State, (action: Action) => void] {
        const fiber = requireSeasonHarnessFiber("useReducer");
        const hookIndex = fiber.hookIndex;
        fiber.hookIndex += 1;
        if (!Object.hasOwn(fiber.stateSlots, hookIndex)) {
          fiber.stateSlots[hookIndex] = typeof initializer === "function"
            ? initializer(initialArg)
            : initialArg;
          fiber.setterSlots[hookIndex] = (action: Action) => {
            const currentState = fiber.stateSlots[hookIndex] as State;
            fiber.stateSlots[hookIndex] = reducer(currentState, action);
          };
        }
        return [
          fiber.stateSlots[hookIndex] as State,
          readSeasonHarnessSetter<(action: Action) => void>(fiber, hookIndex, "useReducer"),
        ];
      },
      useRef<ReferenceValue>(initialValue: ReferenceValue): { current: ReferenceValue } {
        const fiber = requireSeasonHarnessFiber("useRef");
        const hookIndex = fiber.hookIndex;
        fiber.hookIndex += 1;
        if (!Object.hasOwn(fiber.stateSlots, hookIndex)) {
          fiber.stateSlots[hookIndex] = { current: initialValue };
        }
        const referenceSlot = fiber.stateSlots[hookIndex];
        if (!isSeasonHarnessRefSlot<ReferenceValue>(referenceSlot)) {
          throw new Error(
            `Planner workspace season harness ref slot ${String(hookIndex)} in ${fiber.componentName} is not a ref. `
              + `Received ${JSON.stringify(referenceSlot)}.`,
          );
        }
        return referenceSlot;
      },
      useState<StateValue>(
        initialValue: StateValue | (() => StateValue),
      ): [StateValue, (nextValue: StateValue | ((currentValue: StateValue) => StateValue)) => void] {
        const fiber = requireSeasonHarnessFiber("useState");
        const hookIndex = fiber.hookIndex;
        fiber.hookIndex += 1;
        if (!Object.hasOwn(fiber.stateSlots, hookIndex)) {
          fiber.stateSlots[hookIndex] = typeof initialValue === "function"
            ? (initialValue as () => StateValue)()
            : initialValue;
          fiber.setterSlots[hookIndex] = (
            nextValue: StateValue | ((currentValue: StateValue) => StateValue),
          ) => {
            const currentValue = fiber.stateSlots[hookIndex] as StateValue;
            fiber.stateSlots[hookIndex] = typeof nextValue === "function"
              ? (nextValue as (currentValue: StateValue) => StateValue)(currentValue)
              : nextValue;
          };
        }
        return [
          fiber.stateSlots[hookIndex] as StateValue,
          readSeasonHarnessSetter<
            (nextValue: StateValue | ((currentValue: StateValue) => StateValue)) => void
          >(fiber, hookIndex, "useState"),
        ];
      },
    },
    unmount(): void {
      for (const fiber of fibers.values()) {
        for (const effectSlot of fiber.effectSlots.values()) {
          effectSlot.cleanup?.();
        }
      }
      fibers.clear();
      currentFiber = null;
    },
  };
}

function createEmptySeasonWorkspaceMount(): SeasonWorkspaceMount {
  return {
    persistenceBoundaryCount: 0,
    persistenceControls: null,
    plannerWorkspaceState: null,
    plannerWorkspaceStateController: null,
    preparedContentCount: 0,
    workspaceController: null,
    workspaceStateKind: null,
  };
}

function readSeasonHarnessMemoValue<MemoValue>(
  fiber: SeasonHarnessFiber,
  hookIndex: number,
  hookName: string,
): MemoValue {
  const memoSlot = fiber.memoSlots.get(hookIndex);
  if (memoSlot === undefined) {
    throw new Error(
      `Planner workspace season harness ${hookName} is missing its saved value at hook ${String(hookIndex)} in ${fiber.componentName}.`,
    );
  }
  return memoSlot.value as MemoValue;
}

function readSeasonHarnessSetter<Setter>(
  fiber: SeasonHarnessFiber,
  hookIndex: number,
  hookName: string,
): Setter {
  const setter = fiber.setterSlots[hookIndex];
  if (typeof setter !== "function") {
    throw new Error(
      `Planner workspace season harness ${hookName} is missing its setter at hook ${String(hookIndex)} in ${fiber.componentName}.`,
    );
  }
  return setter as Setter;
}

function isSeasonHarnessRefSlot<ReferenceValue>(
  hookStateSlot: unknown,
): hookStateSlot is { current: ReferenceValue } {
  return hookStateSlot !== null
    && typeof hookStateSlot === "object"
    && Object.hasOwn(hookStateSlot, "current");
}

function readSeasonWorkspaceProps(element: React.ReactElement): Record<string, unknown> {
  if (element.props === null || typeof element.props !== "object") {
    throw new Error(
      `Expected rendered planner workspace props to be an object. Received ${JSON.stringify(element.props)}.`,
    );
  }
  return element.props as Record<string, unknown>;
}

function readSeasonWorkspaceChildren(element: React.ReactElement): React.ReactNode {
  return readSeasonWorkspaceProps(element).children as React.ReactNode;
}

function readSeasonWorkspaceStateController(
  props: Record<string, unknown>,
): PlannerWorkspaceStateController {
  const plannerWorkspaceStateController = props.plannerWorkspaceStateController;
  if (!isPlannerWorkspaceStateController(plannerWorkspaceStateController)) {
    throw new Error(
      "Expected PlannerWorkspaceRenderedBoundary to receive a planner workspace state controller. "
        + `Received keys ${JSON.stringify(Object.keys(props))}.`,
    );
  }
  return plannerWorkspaceStateController;
}

function isPlannerWorkspaceStateController(
  plannerWorkspaceStateController: unknown,
): plannerWorkspaceStateController is PlannerWorkspaceStateController {
  if (
    plannerWorkspaceStateController === null
    || typeof plannerWorkspaceStateController !== "object"
  ) {
    return false;
  }
  const candidate = plannerWorkspaceStateController as {
    dispatchPlannerWorkspaceAction?: unknown;
    plannerWorkspaceState?: unknown;
  };
  return typeof candidate.dispatchPlannerWorkspaceAction === "function"
    && candidate.plannerWorkspaceState !== null
    && typeof candidate.plannerWorkspaceState === "object";
}

function readSeasonWorkspacePersistenceControls(
  props: Record<string, unknown>,
): SeasonWorkspacePersistenceControls {
  const persistenceControls = props.workspacePersistenceControls;
  if (!isSeasonWorkspacePersistenceControls(persistenceControls)) {
    throw new Error(
      "Expected prepared planner workspace persistence controls. "
        + `Received keys ${JSON.stringify(Object.keys(props))}.`,
    );
  }
  return persistenceControls;
}

function isSeasonWorkspacePersistenceControls(
  persistenceControls: unknown,
): persistenceControls is SeasonWorkspacePersistenceControls {
  if (persistenceControls === null || typeof persistenceControls !== "object") return false;
  const candidate = persistenceControls as {
    automaticSaveErrorMessage?: unknown;
    handleMapImageExporterReady?: unknown;
    createProjectWithCurrentMap?: unknown;
  };
  return typeof candidate.handleMapImageExporterReady === "function"
    && typeof candidate.createProjectWithCurrentMap === "function"
    && (
      candidate.automaticSaveErrorMessage === null
      || typeof candidate.automaticSaveErrorMessage === "string"
    );
}

function readSeasonWorkspaceController(
  props: Record<string, unknown>,
): ReturnType<typeof createReferenceProjectWorkspaceController> {
  const projectWorkspace = props.projectWorkspace;
  if (projectWorkspace === null || typeof projectWorkspace !== "object") {
    throw new Error(
      "Expected prepared planner workspace project state. "
        + `Received keys ${JSON.stringify(Object.keys(props))}.`,
    );
  }
  const workspaceController = (
    projectWorkspace as { workspaceController?: unknown }
  ).workspaceController;
  if (
    workspaceController === null
    || typeof workspaceController !== "object"
    || typeof (workspaceController as { createProject?: unknown }).createProject !== "function"
    || typeof (workspaceController as { getState?: unknown }).getState !== "function"
  ) {
    throw new Error(
      "Expected the mounted reference project workspace controller. "
        + `Received ${JSON.stringify(
          workspaceController !== null && typeof workspaceController === "object"
            ? Object.keys(workspaceController)
            : workspaceController,
        )}.`,
    );
  }
  return workspaceController as ReturnType<typeof createReferenceProjectWorkspaceController>;
}

function describeSeasonWorkspaceElementType(elementType: unknown): string {
  if (typeof elementType === "symbol") return elementType.description ?? "symbol";
  if (typeof elementType === "function") return elementType.name || "anonymous function";
  if (elementType === null) return "null";
  if (typeof elementType === "object") return "object";
  return typeof elementType;
}

function requirePreparedSeasonMount(mount: SeasonWorkspaceMount): {
  persistenceControls: SeasonWorkspacePersistenceControls;
  plannerWorkspaceState: PlannerWorkspaceState;
  plannerWorkspaceStateController: PlannerWorkspaceStateController;
  workspaceController: ReturnType<typeof createReferenceProjectWorkspaceController>;
} {
  if (
    mount.workspaceStateKind !== "prepared"
    || mount.persistenceBoundaryCount !== 1
    || mount.preparedContentCount !== 1
    || mount.persistenceControls === null
    || mount.plannerWorkspaceState === null
    || mount.plannerWorkspaceStateController === null
    || mount.workspaceController === null
  ) {
    throw new Error(
      "Expected the exported planner workspace to be prepared with its persistence boundary mounted. "
        + `Received state ${JSON.stringify(mount.workspaceStateKind)}, `
        + `persistence boundaries ${String(mount.persistenceBoundaryCount)}, `
        + `prepared content ${String(mount.preparedContentCount)}, `
        + `season ${JSON.stringify(mount.plannerWorkspaceState?.season ?? null)}, `
        + `controls ${mount.persistenceControls === null ? "missing" : "present"}, `
        + `and controller ${mount.workspaceController === null ? "missing" : "present"}.`,
    );
  }
  return {
    persistenceControls: mount.persistenceControls,
    plannerWorkspaceState: mount.plannerWorkspaceState,
    plannerWorkspaceStateController: mount.plannerWorkspaceStateController,
    workspaceController: mount.workspaceController,
  };
}

function requireOnlyPendingSeasonBootstrap(
  pendingSeasonBootstraps: readonly PendingSeasonBootstrap[],
): PendingSeasonBootstrap {
  if (pendingSeasonBootstraps.length !== 1) {
    throw new Error(
      "Expected one waiting planner workspace bootstrap. "
        + `Received ${String(pendingSeasonBootstraps.length)} seasons `
        + `${JSON.stringify(pendingSeasonBootstraps.map((pendingBootstrap) => pendingBootstrap.season))}.`,
    );
  }
  const pendingSeasonBootstrap = pendingSeasonBootstraps[0];
  if (pendingSeasonBootstrap === undefined) {
    throw new Error("Expected the waiting planner workspace bootstrap to exist.");
  }
  return pendingSeasonBootstrap;
}

function releasePendingSeasonBootstrap(
  pendingSeasonBootstraps: PendingSeasonBootstrap[],
  preparedWorkspace: PreparedPlannerWorkspace,
): void {
  const pendingSeasonBootstrap = pendingSeasonBootstraps.shift();
  if (pendingSeasonBootstrap === undefined) {
    throw new Error("Expected a planner workspace bootstrap request to release.");
  }
  pendingSeasonBootstrap.resolve(preparedWorkspace);
}

function createSeasonPreparedWorkspace(
  repository: ReturnType<typeof createIntegrationRepository>,
  pendingSeasonBootstrap: PendingSeasonBootstrap,
): PreparedPlannerWorkspace {
  const season = readSeasonHarnessTilesheetSeason(pendingSeasonBootstrap.season);
  return {
    buildingsCatalog: { items: [] },
    canvasResources: {
      pixi: {} as typeof import("pixi.js"),
      preparedMap: {
        mapId: pendingSeasonBootstrap.mapId,
        parsedMap: {} as PreparedDefaultMap["parsedMap"],
        renderingContract: {} as PreparedDefaultMap["renderingContract"],
        season,
      },
      resourceGeneration: pendingSeasonBootstrap.resourceGeneration,
    },
    preferences: createInitialEditorPreferences(),
    projectState: {
      projects: repository.listProjects(),
      repository,
    },
    resourceGeneration: pendingSeasonBootstrap.resourceGeneration,
    savePreferences: () => undefined,
  };
}

function readSeasonHarnessTilesheetSeason(season: string): TilesheetSeason {
  if (
    season === "spring"
    || season === "summer"
    || season === "fall"
    || season === "winter"
  ) {
    return season;
  }
  throw new Error(
    "Expected a tilesheet season of spring, summer, fall, or winter. "
      + `Received ${JSON.stringify(season)}.`,
  );
}

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
    sourceMap: { mapFile: "Farm.tmx", state: {} },
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

class ClipboardContextMenuCanvas {
  private readonly contextMenuListeners = new Set<EventListener>();

  addEventListener(
    eventType: string,
    eventListener: EventListenerOrEventListenerObject,
  ): void {
    if (eventType !== "contextmenu" || typeof eventListener !== "function") {
      throw new Error("Clipboard context-menu canvas only supports function contextmenu listeners.");
    }

    this.contextMenuListeners.add(eventListener);
  }

  removeEventListener(
    eventType: string,
    eventListener: EventListenerOrEventListenerObject,
  ): void {
    if (eventType !== "contextmenu" || typeof eventListener !== "function") {
      throw new Error("Clipboard context-menu canvas only supports function contextmenu listeners.");
    }

    this.contextMenuListeners.delete(eventListener);
  }

  dispatchEvent(_event: Event): boolean {
    return true;
  }

  dispatchContextMenuEvent(
    target: EventTarget,
    offsetX: number,
    offsetY: number,
  ): MouseEvent & {
    preventDefault: ReturnType<typeof vi.fn>;
  } {
    const preventDefault = vi.fn();
    const contextMenuEvent = {
      offsetX,
      offsetY,
      preventDefault,
      target,
    } as MouseEvent & { preventDefault: ReturnType<typeof vi.fn> };

    for (const contextMenuListener of this.contextMenuListeners) {
      contextMenuListener(contextMenuEvent);
    }

    return contextMenuEvent;
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

async function openIntegrationProjectWithSavedStandardMap(
  firstPreviewBytes: Uint8Array,
) {
  vi.mocked(encodePngAsWebp).mockReset();
  vi.mocked(encodePngAsWebp).mockResolvedValueOnce(firstPreviewBytes);
  const projectStorage = createIntegrationBrowserStorage();
  const workspaceController = createReferenceProjectWorkspaceController({
    repository: createIntegrationRepository(projectStorage),
    initialProjectSummaries: [],
  });
  let plannerWorkspaceState = reducePlannerWorkspaceState(
    createInitialPlannerWorkspaceState("standard"),
    {
      placementSnapshot: {
        ...createEmptyPlacementSnapshot(),
        crops: [{ cropId: "crop:24", x: 3, y: 5 }],
      },
      type: "reset-placement-history",
    },
  );
  const settledErrors: unknown[] = [];
  const persistenceRuntime = createPlannerWorkspacePersistenceRuntime({
    dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
      plannerWorkspaceState = reducePlannerWorkspaceState(
        plannerWorkspaceState,
        plannerWorkspaceAction,
      );
    },
    initialPlannerWorkspaceState: plannerWorkspaceState,
    initialWorkspaceState: workspaceController.getState(),
    newProjectName: "Untitled Project",
    onAutomaticSaveSettled: (caughtError) => {
      settledErrors.push(caughtError);
    },
    workspaceController,
  });
  const pngBlob = new Blob(["added map preview"], { type: "image/png" });
  persistenceRuntime.handleMapImageExporterReady("standard", {
    captureCleanMapImage: vi.fn(async () => pngBlob),
    captureScreenshot: vi.fn(async () => pngBlob),
  });
  const projectActions = createPlannerLocalProjectActions({
    newProjectName: "Untitled Project",
    season: plannerWorkspaceState.season,
    workspaceController,
  });
  await createLocalProjectAndSaveCurrentMap({
    createProjectWithCurrentMap: persistenceRuntime.createProjectWithCurrentMap,
  });
  persistenceRuntime.updateWorkspaceSnapshot(
    plannerWorkspaceState,
    workspaceController.getState(),
  );
  persistenceRuntime.synchronizeCanonicalSession();
  persistenceRuntime.updateWorkspaceSnapshot(
    plannerWorkspaceState,
    workspaceController.getState(),
  );
  const projectId = workspaceController.getState().activeProject?.id;
  const standardMapId = workspaceController.getState().activeSession?.mapId;
  if (projectId === undefined || standardMapId === undefined) {
    throw new Error(
      "Expected New plan to save a standard map before Add map. "
        + `Received project ID ${JSON.stringify(projectId ?? null)} `
        + `and map ID ${JSON.stringify(standardMapId ?? null)}.`,
    );
  }
  return {
    editPlannerWorkspaceState: (plannerWorkspaceAction: PlannerWorkspaceAction) => {
      plannerWorkspaceState = reducePlannerWorkspaceState(
        plannerWorkspaceState,
        plannerWorkspaceAction,
      );
      persistenceRuntime.updateWorkspaceSnapshot(
        plannerWorkspaceState,
        workspaceController.getState(),
      );
    },
    persistenceRuntime,
    plannerWorkspaceState: () => plannerWorkspaceState,
    projectId,
    projectStorage,
    settledErrors,
    standardMapId,
    workspaceController,
  };
}

function readStoredProjectMap(
  projectStorage: IntegrationBrowserStorage,
  projectId: string,
  mapFile: string,
) {
  const reloadedRepository = createIntegrationRepository(projectStorage);
  return readProjectMapByFile(
    reloadedRepository.openProject(projectId).project.maps,
    mapFile,
  );
}

function readProjectMapByFile(
  projectMaps: readonly ReferenceProjectMap[],
  mapFile: string,
): ReferenceProjectMap {
  const projectMap = projectMaps.find((candidateMap) => candidateMap.mapFile === mapFile);
  if (projectMap === undefined) {
    throw new Error(
      `Expected project maps to include ${JSON.stringify(mapFile)}; received `
        + `${JSON.stringify(projectMaps.map((candidateMap) => candidateMap.mapFile))}.`,
    );
  }
  return projectMap;
}

function createIntegrationPreviewWebpBytes(payloadByte: number): Uint8Array {
  return new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 14, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
    0x56, 0x50, 0x38, 0x20, 1, 0, 0, 0, payloadByte, 0,
  ]);
}

function createWebpDataUrl(webpBytes: Uint8Array): string {
  return `data:image/webp;base64,${Buffer.from(webpBytes).toString("base64")}`;
}

type IntegrationBrowserStorage = Readonly<{
  getItem: (storageKey: string) => string | null;
  setItem: (storageKey: string, serializedProjectDocument: string) => void;
  writtenStorageKeys: readonly string[];
}>;

function createIntegrationBrowserStorage(): IntegrationBrowserStorage {
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

function createIntegrationRepository(projectStorage: IntegrationBrowserStorage) {
  let identifierSequence = 0;
  let timestampSequence = 0;
  return createReferenceProjectRepository({
    storage: projectStorage,
    createIdentifier: () => {
      identifierSequence += 1;
      return `integration-autosave-${String(identifierSequence)}`;
    },
    now: () => {
      timestampSequence += 1;
      return `2026-08-13T00:00:${String(timestampSequence).padStart(2, "0")}.000Z`;
    },
  });
}

function openReloadedIntegrationSession(
  projectStorage: IntegrationBrowserStorage,
  projectId: string,
): ReferenceOpenMapSession {
  const reloadedRepository = createIntegrationRepository(projectStorage);
  const reloadedController = createReferenceProjectWorkspaceController({
    repository: reloadedRepository,
    initialProjectSummaries: reloadedRepository.listProjects(),
  });
  reloadedController.openProject(projectId);
  const activeSession = reloadedController.getState().activeSession;
  if (activeSession === null) {
    throw new Error(
      `Expected reloaded project ${JSON.stringify(projectId)} to open an active session.`,
    );
  }
  return activeSession;
}

function createPersistenceControlsHookRuntime() {
  const hookStateSlots: unknown[] = [];
  const effectSlots = new Map<number, PersistenceControlsHookEffectSlot>();
  let currentHookIndex = 0;
  let scheduledEffects: PersistenceControlsHookEffect[] = [];
  let unmountMountedEffects: (() => void) | null = null;

  return {
    mount<Output>(renderHook: () => Output) {
      if (unmountMountedEffects !== null) {
        throw new Error(
          "Persistence controls hook runtime already has a mounted hook.",
        );
      }

      function render(): Output {
        currentHookIndex = 0;
        const pendingEffects: PersistenceControlsHookEffect[] = [];
        scheduledEffects = pendingEffects;
        const output = renderHook();
        for (const pendingEffect of pendingEffects) {
          const previousEffect = effectSlots.get(pendingEffect.hookIndex);
          previousEffect?.cleanup?.();
          const cleanup = pendingEffect.effect();
          effectSlots.set(pendingEffect.hookIndex, {
            cleanup: typeof cleanup === "function" ? cleanup : undefined,
            dependencies: pendingEffect.dependencies,
          });
        }
        return output;
      }

      function unmount(): void {
        if (unmountMountedEffects !== unmount) return;
        for (const effectSlot of effectSlots.values()) {
          effectSlot.cleanup?.();
        }
        effectSlots.clear();
        unmountMountedEffects = null;
      }

      unmountMountedEffects = unmount;
      return { render, unmount };
    },
    reactModule: {
      useEffect(
        effect: () => void | (() => void),
        dependencies: readonly unknown[],
      ): void {
        const hookIndex = currentHookIndex;
        currentHookIndex += 1;
        const previousEffect = effectSlots.get(hookIndex);
        if (
          previousEffect === undefined
          || !haveEqualPersistenceControlsHookDependencies(
            previousEffect.dependencies,
            dependencies,
          )
        ) {
          scheduledEffects.push({ dependencies, effect, hookIndex });
        }
      },
      useRef<ReferenceValue>(initialValue: ReferenceValue): { current: ReferenceValue } {
        const hookIndex = currentHookIndex;
        currentHookIndex += 1;
        if (!Object.hasOwn(hookStateSlots, hookIndex)) {
          hookStateSlots[hookIndex] = { current: initialValue };
        }
        const hookStateSlot = hookStateSlots[hookIndex];
        if (!isPersistenceControlsRefSlot<ReferenceValue>(hookStateSlot)) {
          throw new Error(
            `Persistence controls hook slot ${String(hookIndex)} is not a ref; `
              + `received ${JSON.stringify(hookStateSlot)}.`,
          );
        }
        return hookStateSlot;
      },
      useState<StateValue>(
        initialValue: StateValue | (() => StateValue),
      ): readonly [StateValue, (nextValue: StateValue | ((currentValue: StateValue) => StateValue)) => void] {
        const hookIndex = currentHookIndex;
        currentHookIndex += 1;
        if (!Object.hasOwn(hookStateSlots, hookIndex)) {
          hookStateSlots[hookIndex] = typeof initialValue === "function"
            ? (initialValue as () => StateValue)()
            : initialValue;
        }
        return [
          hookStateSlots[hookIndex] as StateValue,
          (nextValue) => {
            const currentValue = hookStateSlots[hookIndex] as StateValue;
            hookStateSlots[hookIndex] = typeof nextValue === "function"
              ? (nextValue as (currentValue: StateValue) => StateValue)(currentValue)
              : nextValue;
          },
        ];
      },
    },
    unmountMountedHook(): void {
      unmountMountedEffects?.();
    },
  };
}

type PersistenceControlsHookEffect = Readonly<{
  dependencies: readonly unknown[];
  effect: () => void | (() => void);
  hookIndex: number;
}>;

type PersistenceControlsHookEffectSlot = Readonly<{
  cleanup?: () => void;
  dependencies: readonly unknown[];
}>;

function haveEqualPersistenceControlsHookDependencies(
  previousDependencies: readonly unknown[],
  nextDependencies: readonly unknown[],
): boolean {
  return previousDependencies.length === nextDependencies.length
    && previousDependencies.every((dependency, index) =>
      Object.is(dependency, nextDependencies[index])
    );
}

function isPersistenceControlsRefSlot<ReferenceValue>(
  hookStateSlot: unknown,
): hookStateSlot is { current: ReferenceValue } {
  return hookStateSlot !== null
    && typeof hookStateSlot === "object"
    && Object.hasOwn(hookStateSlot, "current");
}

function seedExistingIntegrationProject(
  workspaceController: ReturnType<typeof createReferenceProjectWorkspaceController>,
) {
  workspaceController.createProject({
    projectName: "Existing Farm",
    season: "spring",
  });
  const projectId = workspaceController.getState().activeProject?.id;
  if (projectId === undefined) {
    throw new Error("Expected the existing local project to have an ID.");
  }
  workspaceController.createMap({
    label: "Standard Farm",
    mapFile: "Farm.tmx",
    projectId,
    season: "spring",
  });
  const mapId = workspaceController.getState().activeSession?.mapId;
  if (mapId === undefined) {
    throw new Error(
      `Expected existing project ${JSON.stringify(projectId)} to have a map ID.`,
    );
  }
  const webpBytes = createIntegrationPreviewWebpBytes(11);
  workspaceController.saveThumbnail({
    mapId,
    projectId,
    webpBytes,
  });
  const placementSnapshot = {
    ...createEmptyPlacementSnapshot(),
    crops: [{ cropId: "crop:24", x: 1, y: 2 }],
  };
  workspaceController.saveOpenMap({
    placementSnapshot,
    season: "spring",
  });
  return {
    placementSnapshot,
    projectId,
    serializedProject: workspaceController.exportProject(projectId),
    thumbnailDataUrl: createWebpDataUrl(webpBytes),
  };
}

type LocalProjectPanelHookHarness = Readonly<{
  beginRender: () => void;
  reset: () => void;
  useRef: <ReferenceValue,>(initialValue: ReferenceValue) => { current: ReferenceValue };
  useState: <StateValue,>(
    initialValue: StateValue | (() => StateValue),
  ) => readonly [
    StateValue,
    (nextValue: StateValue | ((currentValue: StateValue) => StateValue)) => void,
  ];
}>;

function createLocalProjectPanelHookHarness(): LocalProjectPanelHookHarness {
  const stateSlots: unknown[] = [];
  const referenceSlots: unknown[] = [];
  let stateCursor = 0;
  let referenceCursor = 0;

  return {
    beginRender() {
      stateCursor = 0;
      referenceCursor = 0;
    },
    reset() {
      stateSlots.length = 0;
      referenceSlots.length = 0;
      stateCursor = 0;
      referenceCursor = 0;
    },
    useRef<ReferenceValue,>(initialValue: ReferenceValue): { current: ReferenceValue } {
      const referenceIndex = referenceCursor;
      referenceCursor += 1;
      if (!Object.hasOwn(referenceSlots, referenceIndex)) {
        referenceSlots[referenceIndex] = { current: initialValue };
      }
      const referenceSlot = referenceSlots[referenceIndex];
      if (!isPersistenceControlsRefSlot<ReferenceValue>(referenceSlot)) {
        throw new Error(
          `Local project panel ref slot ${String(referenceIndex)} is not a ref; `
            + `received ${JSON.stringify(referenceSlot)}.`,
        );
      }
      return referenceSlot;
    },
    useState<StateValue,>(
      initialValue: StateValue | (() => StateValue),
    ) {
      const stateIndex = stateCursor;
      stateCursor += 1;
      if (!Object.hasOwn(stateSlots, stateIndex)) {
        stateSlots[stateIndex] = typeof initialValue === "function"
          ? (initialValue as () => StateValue)()
          : initialValue;
      }
      return [
        stateSlots[stateIndex] as StateValue,
        (nextValue) => {
          const currentValue = stateSlots[stateIndex] as StateValue;
          stateSlots[stateIndex] = typeof nextValue === "function"
            ? (nextValue as (currentValue: StateValue) => StateValue)(currentValue)
            : nextValue;
        },
      ];
    },
  };
}

type RenderedElement = React.ReactElement<{
  children?: React.ReactNode;
  onClick?: (...clickArguments: unknown[]) => void;
  role?: unknown;
  [attributeName: string]: unknown;
}>;

function textContent(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((child) => textContent(child)).join("");
  if (React.isValidElement(node)) {
    return textContent(readRenderedElement(node).props.children);
  }
  return "";
}

function readRenderedElement(node: React.ReactElement): RenderedElement {
  if (!React.isValidElement(node)) {
    throw new Error(`Expected a rendered element; received ${JSON.stringify(node)}.`);
  }
  return node as RenderedElement;
}

function visitRenderedElements(
  node: React.ReactNode,
  visit: (renderedElement: RenderedElement) => void,
): void {
  if (Array.isArray(node)) {
    for (const child of node) visitRenderedElements(child, visit);
    return;
  }
  if (!React.isValidElement(node)) return;
  const renderedElement = readRenderedElement(node);
  visit(renderedElement);
  visitRenderedElements(renderedElement.props.children, visit);
}

function collectRenderedText(
  node: React.ReactNode,
  elementType: string,
  matches: (properties: RenderedElement["props"]) => boolean,
): string[] {
  const renderedTexts: string[] = [];
  visitRenderedElements(node, (renderedElement) => {
    if (renderedElement.type === elementType && matches(renderedElement.props)) {
      renderedTexts.push(textContent(renderedElement.props.children));
    }
  });
  return renderedTexts;
}

function collectRenderedAttribute(
  node: React.ReactNode,
  attributeName: string,
): string[] {
  const attributeValues: string[] = [];
  visitRenderedElements(node, (renderedElement) => {
    const attributeValue = renderedElement.props[attributeName];
    if (typeof attributeValue === "string") attributeValues.push(attributeValue);
  });
  return attributeValues;
}

function clickRenderedButton(node: React.ReactNode, label: string): void {
  const clickHandler = findRenderedButtonClickHandler(node, label);
  clickHandler();
}

function findRenderedButtonClickHandler(
  node: React.ReactNode,
  label: string,
): (...clickArguments: unknown[]) => void {
  const clickHandlerSlot: {
    current: ((...clickArguments: unknown[]) => void) | null;
  } = { current: null };
  visitRenderedElements(node, (renderedElement) => {
    if (clickHandlerSlot.current !== null || renderedElement.type !== "button") return;
    if (textContent(renderedElement.props.children) !== label) return;
    clickHandlerSlot.current = readRenderedButtonClickHandler(
      renderedElement.props.onClick,
      label,
    );
  });
  const clickHandler = clickHandlerSlot.current;
  if (clickHandler === null) {
    throw new Error(`Expected a button labeled ${JSON.stringify(label)}.`);
  }
  return clickHandler;
}

function readRenderedButtonClickHandler(
  clickHandler: ((...clickArguments: unknown[]) => void) | undefined,
  label: string,
): (...clickArguments: unknown[]) => void {
  if (typeof clickHandler !== "function") {
    throw new Error(`Button ${JSON.stringify(label)} has no click handler.`);
  }
  return clickHandler;
}

function flushPendingPromiseCallbacks(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
