import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as typescript from "typescript";
import { describe, expect, it, vi } from "vitest";
import {
  assertReferenceProjectWorkspaceRepositoryReference,
  cloneReferenceProjectWorkspaceState,
  createReferenceProjectWorkspaceController,
  type ReferenceProjectWorkspaceController,
  useReferenceProjectWorkspace,
} from "../../src/reference-runtime/use-reference-project-workspace";
import {
  createReferenceProjectRepository,
  type ReferenceProjectRepository,
  type ReferenceProjectSummary,
} from "../../src/reference-runtime/reference-project-repository";
import type { ReferenceLocalProjectDocument } from "../../src/reference-runtime/local-project-api";
import { plannerMaps } from "../../src/maps/map-catalog";
import { referenceProjectDocumentFixture } from "./fixtures/reference-project-document";

function createRepository(): ReferenceProjectRepository {
  let serializedProjectDocument = JSON.stringify(createAdapterSupportedDocument());
  return createReferenceProjectRepository({
    storage: {
      getItem: () => serializedProjectDocument,
      setItem: (_storageKey, nextSerializedProjectDocument) => {
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    },
    createIdentifier: (() => {
      let nextIdentifier = 0;
      return () => `workspace-id-${String(++nextIdentifier)}`;
    })(),
    now: () => "2026-08-03T00:00:00.000Z",
  });
}

function createController(repository = createRepository()) {
  return createReferenceProjectWorkspaceController({
    initialProjectSummaries: repository.listProjects(),
    repository,
  });
}

describe("reference project workspace controller", () => {
  it("notifies active subscribers and removes each subscription once", () => {
    const controller = createController();
    const firstSubscriber = vi.fn();
    const secondSubscriber = vi.fn();
    const unsubscribeFirstSubscriber = controller.subscribe(firstSubscriber);
    const unsubscribeSecondSubscriber = controller.subscribe(secondSubscriber);

    controller.openProject("project-alpha");
    expect(firstSubscriber).toHaveBeenCalledTimes(1);
    expect(secondSubscriber).toHaveBeenCalledTimes(1);

    unsubscribeFirstSubscriber();
    unsubscribeFirstSubscriber();
    controller.clearActiveProject();

    expect(firstSubscriber).toHaveBeenCalledTimes(1);
    expect(secondSubscriber).toHaveBeenCalledTimes(2);
    unsubscribeSecondSubscriber();
  });

  it("rejects a non-function state subscriber with its received value", () => {
    const controller = createController();

    expect(() =>
      controller.subscribe("not-a-function" as unknown as () => void),
    ).toThrow(/subscriber.*not-a-function/);
  });

  it.each([
    "listProjects",
    "openProject",
    "updateMap",
    "duplicateProject",
    "importProject",
    "copyMap",
    "moveMap",
    "createProject",
    "renameProject",
    "deleteProject",
    "exportProject",
    "createMap",
    "renameMap",
    "duplicateMap",
    "deleteMap",
    "saveThumbnail",
  ] as const)("rejects a non-function repository.%s", (methodName) => {
    const repository = createRepository() as Record<string, unknown>;
    repository[methodName] = "not-a-function";

    expect(() =>
      createReferenceProjectWorkspaceController({
        repository: repository as unknown as ReferenceProjectRepository,
        initialProjectSummaries: [],
      }),
    ).toThrow(new RegExp(`repository\\.${methodName}.*not-a-function`));
  });

  it("rejects a malformed planner map candidate with its received value", () => {
    const controller = createController();
    expect(() =>
      controller.getPlannerMapIdForMapFile("Farm.tmx", [
        { id: "broken-map", mapFile: 42 } as unknown as (typeof plannerMaps)[number],
      ]),
    ).toThrow('Reference planner map candidate at index 0 must contain non-empty string id and mapFile; received {"id":"broken-map","mapFile":42}.');
  });

  it.each([
    [{ id: "", mapFile: "Farm.tmx" }, '{"id":"","mapFile":"Farm.tmx"}'],
    [{ id: "standard", mapFile: "" }, '{"id":"standard","mapFile":""}'],
  ] as const)("rejects an empty planner map candidate field with its received value", (candidatePlannerMap, receivedCandidate) => {
    const controller = createController();
    expect(() =>
      controller.getPlannerMapIdForMapFile(
        "Farm.tmx",
        [candidatePlannerMap] as unknown as typeof plannerMaps,
      ),
    ).toThrow(`Reference planner map candidate at index 0 must contain non-empty string id and mapFile; received ${receivedCandidate}.`);
  });

  it("rejects a non-function subscriber and every invalid summary field", () => {
    const repository = createRepository();
    expect(() =>
      createReferenceProjectWorkspaceController({
        repository,
        initialProjectSummaries: [],
        onStateChange: "not-a-function" as unknown as () => void,
      }),
    ).toThrow(/onStateChange.*not-a-function/);

    for (const summaryField of [
      "id",
      "title",
      "created_at",
      "updated_at",
    ] as const) {
      const invalidSummary = {
        id: "project-alpha",
        title: "Alpha Farm",
        created_at: "created",
        updated_at: "updated",
        [summaryField]: 42,
      };
      expect(() =>
        createReferenceProjectWorkspaceController({
          repository,
          initialProjectSummaries: [
            invalidSummary as unknown as ReferenceProjectSummary,
          ],
        }),
      ).toThrow(new RegExp(`${summaryField}.*42`));
    }
  });
  it("refreshes summaries without changing an open session", () => {
    const repository = createRepository();
    const controller = createController(repository);
    controller.openProject("project-alpha");
    const stateBeforeRefresh = controller.getState();

    controller.refreshProjects();

    expect(controller.getState()).toMatchObject({
      activeProject: stateBeforeRefresh.activeProject,
      activeSession: stateBeforeRefresh.activeSession,
      projectSummaries: repository.listProjects(),
    });
  });

  it("opens valid and null-active-map projects, but preserves state when an active map is absent", () => {
    const repository = createRepository();
    const controller = createController(repository);
    controller.openProject("project-alpha");
    expect(controller.getState().activeSession?.mapId).toBe("map-standard");

    const nullMapRepository = createRepositoryWithProject({
      ...referenceProjectDocumentFixture.projects[0],
      id: "project-no-maps",
      project: { ...referenceProjectDocumentFixture.projects[0].project, activeMapId: null, maps: [] },
      thumbnailsByMapId: {},
    });
    const nullMapController = createController(nullMapRepository);
    nullMapController.openProject("project-no-maps");
    expect(nullMapController.getState().activeSession).toBeNull();

    const missingMapProject = {
      ...referenceProjectDocumentFixture.projects[0],
      id: "project-missing-map",
      project: {
        ...referenceProjectDocumentFixture.projects[0].project,
        activeMapId: "missing-map",
        maps: referenceProjectDocumentFixture.projects[0].project.maps.map((projectMap) => ({
          ...projectMap,
          thumbnail: `/api/projects/project-missing-map/maps/${projectMap.id}/thumbnail`,
        })),
      },
    };
    const missingMapRepository = createMissingActiveMapRepository(missingMapProject);
    const missingMapController = createController(missingMapRepository);
    const stateBeforeFailure = missingMapController.getState();
    expect(() => missingMapController.openProject("project-missing-map")).toThrow(
      /project-missing-map.*missing-map/,
    );
    expect(missingMapController.getState()).toStrictEqual(stateBeforeFailure);
  });

  it("activates and saves a map with the complete canonical update body", () => {
    const repository = createRepository();
    const updateInputs: unknown[] = [];
    const recordingRepository: ReferenceProjectRepository = {
      ...repository,
      updateMap: (updateInput) => {
        updateInputs.push(updateInput);
        return repository.updateMap(updateInput);
      },
    };
    const initialIslandMap = repository.openProject("project-alpha").project.maps[1]!;
    const controller = createController(recordingRepository);
    controller.openProject("project-alpha");
    controller.activateMap("map-island");
    controller.saveOpenMap({ season: "fall" });

    expect(updateInputs).toHaveLength(2);
    expect(updateInputs[0]).toEqual({
      projectId: "project-alpha",
      mapId: "map-island",
      mapFile: initialIslandMap.mapFile,
      label: initialIslandMap.label,
      season: "summer",
      state: initialIslandMap.state,
      decor: initialIslandMap.decor,
      renovations: initialIslandMap.renovations,
      setActive: true,
    });
    expect(updateInputs[1]).toEqual({
      projectId: "project-alpha",
      mapId: "map-island",
      mapFile: initialIslandMap.mapFile,
      label: initialIslandMap.label,
      season: "fall",
      state: initialIslandMap.state,
      decor: initialIslandMap.decor,
      renovations: initialIslandMap.renovations,
      setActive: true,
    });
    expect(controller.getState().activeSession?.season).toBe("fall");
  });

  it("persists a no-op save through exactly one complete canonical update", () => {
    const repository = createRepository();
    let updateMapCallCount = 0;
    const recordingRepository: ReferenceProjectRepository = {
      ...repository,
      updateMap: (updateInput) => {
        updateMapCallCount += 1;
        return repository.updateMap(updateInput);
      },
    };
    const controller = createController(recordingRepository);
    controller.openProject("project-alpha");
    controller.saveOpenMap({});

    expect(updateMapCallCount).toBe(1);
    expect(controller.getState().activeSession?.mapId).toBe("map-standard");
  });

  it("preserves controller state when repository or adapter operations fail", () => {
    const repository = createRepository();
    const controller = createController(repository);
    const initialState = controller.getState();
    expect(() => controller.openProject("missing-project")).toThrow(/missing-project/);
    expect(controller.getState()).toStrictEqual(initialState);
    expect(() => controller.saveOpenMap({})).toThrow(/active open-map session/);
    expect(controller.getState()).toStrictEqual(initialState);
  });

  it("preserves state when refreshing summaries fails", () => {
    const repository = createRepository();
    const refreshError = new Error("list failed");
    const failingRepository: ReferenceProjectRepository = {
      ...repository,
      listProjects: () => { throw refreshError; },
    };
    const controller = createReferenceProjectWorkspaceController({
      repository: failingRepository,
      initialProjectSummaries: [],
    });
    const stateBeforeRefresh = controller.getState();

    expect(captureThrownValue(() => controller.refreshProjects())).toBe(
      refreshError,
    );
    expect(controller.getState()).toStrictEqual(stateBeforeRefresh);
  });

  it("keeps state and does not notify when activate repository update fails", () => {
    const repository = createRepository();
    const updateError = new Error("activate update failed");
    const updateMap = vi.spyOn(repository, "updateMap").mockImplementation(() => {
      throw updateError;
    });
    const deliveredStates: unknown[] = [];
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: repository.listProjects(),
      onStateChange: (workspaceState) => deliveredStates.push(workspaceState),
    });
    controller.openProject("project-alpha");
    deliveredStates.length = 0;
    const stateBeforeFailure = controller.getState();

    expect(captureThrownValue(() => controller.activateMap("map-island"))).toBe(
      updateError,
    );
    expect(updateMap).toHaveBeenCalledTimes(1);
    expect(deliveredStates).toHaveLength(0);
    expect(controller.getState()).toStrictEqual(stateBeforeFailure);
  });

  it("keeps state and avoids update when adapter save validation fails", () => {
    const repository = createRepository();
    const updateMap = vi.spyOn(repository, "updateMap");
    const deliveredStates: unknown[] = [];
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: repository.listProjects(),
      onStateChange: (workspaceState) => deliveredStates.push(workspaceState),
    });
    controller.openProject("project-alpha");
    deliveredStates.length = 0;
    updateMap.mockClear();
    const stateBeforeFailure = controller.getState();

    expect(() =>
      controller.saveOpenMap({ unexpected: true } as unknown as Parameters<
        typeof controller.saveOpenMap
      >[0]),
    ).toThrow(/unexpected.*not supported/i);
    expect(updateMap).not.toHaveBeenCalled();
    expect(deliveredStates).toHaveLength(0);
    expect(controller.getState()).toStrictEqual(stateBeforeFailure);
  });

  it("keeps state and does not notify when save repository update fails", () => {
    const repository = createRepository();
    const saveError = new Error("save update failed");
    const updateMap = vi.spyOn(repository, "updateMap").mockImplementation(() => {
      throw saveError;
    });
    const deliveredStates: unknown[] = [];
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: repository.listProjects(),
      onStateChange: (workspaceState) => deliveredStates.push(workspaceState),
    });
    controller.openProject("project-alpha");
    deliveredStates.length = 0;
    updateMap.mockClear();
    const stateBeforeFailure = controller.getState();

    expect(captureThrownValue(() => controller.saveOpenMap({}))).toBe(saveError);
    expect(updateMap).toHaveBeenCalledTimes(1);
    expect(deliveredStates).toHaveLength(0);
    expect(controller.getState()).toStrictEqual(stateBeforeFailure);
  });

  it.each(["duplicateProject", "importProject"] as const)(
    "keeps state when %s returns a project with a missing active map",
    (repositoryMethodName) => {
      const repository = createRepository();
      const invalidReturnedProject = repository.openProject("project-alpha");
      invalidReturnedProject.project.activeMapId = "missing-map";
      const repositoryMethod = vi
        .spyOn(repository, repositoryMethodName)
        .mockReturnValue(invalidReturnedProject);
      const deliveredStates: unknown[] = [];
      const controller = createReferenceProjectWorkspaceController({
        repository,
        initialProjectSummaries: repository.listProjects(),
        onStateChange: (workspaceState) => deliveredStates.push(workspaceState),
      });
      const stateBeforeFailure = controller.getState();

      const invokeRepositoryMethod = () =>
        repositoryMethodName === "duplicateProject"
          ? controller.duplicateProject("project-alpha")
          : controller.importProject(repository.exportProject("project-alpha"));

      expect(invokeRepositoryMethod).toThrow(/missing-map/);
      expect(repositoryMethod).toHaveBeenCalledTimes(1);
      expect(deliveredStates).toHaveLength(0);
      expect(controller.getState()).toStrictEqual(stateBeforeFailure);
    },
  );

  it("keeps state and does not notify on copy or move repository errors", () => {
    const repository = createRepository();
    const copyError = new Error("copy failed");
    const moveError = new Error("move failed");
    const copyMap = vi.spyOn(repository, "copyMap").mockImplementation(() => {
      throw copyError;
    });
    const moveMap = vi.spyOn(repository, "moveMap").mockImplementation(() => {
      throw moveError;
    });
    const deliveredStates: unknown[] = [];
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: repository.listProjects(),
      onStateChange: (workspaceState) => deliveredStates.push(workspaceState),
    });
    const stateBeforeFailure = controller.getState();

    expect(captureThrownValue(() =>
      controller.copyMap({
        projectId: "project-alpha",
        mapId: "map-island",
        targetProjectId: "project-beta",
      }),
    )).toBe(copyError);
    expect(captureThrownValue(() =>
      controller.moveMap({
        projectId: "project-alpha",
        mapId: "map-island",
        targetProjectId: "project-beta",
      }),
    )).toBe(moveError);
    expect(copyMap).toHaveBeenCalledTimes(1);
    expect(moveMap).toHaveBeenCalledTimes(1);
    expect(deliveredStates).toHaveLength(0);
    expect(controller.getState()).toStrictEqual(stateBeforeFailure);
  });

  it("keeps state when a moved current map is absent from the returned target", () => {
    const repository = createRepository();
    const moveMap = vi.spyOn(repository, "moveMap").mockReturnValue({
      sourceProject: repository.openProject("project-alpha"),
      targetProject: repository.openProject("project-beta"),
    });
    const deliveredStates: unknown[] = [];
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: repository.listProjects(),
      onStateChange: (workspaceState) => deliveredStates.push(workspaceState),
    });
    controller.openProject("project-alpha");
    deliveredStates.length = 0;
    const stateBeforeFailure = controller.getState();

    expect(() =>
      controller.moveMap({
        projectId: "project-alpha",
        mapId: "map-standard",
        targetProjectId: "project-beta",
      }),
    ).toThrow(/project-beta.*map-standard/);
    expect(moveMap).toHaveBeenCalledTimes(1);
    expect(deliveredStates).toHaveLength(0);
    expect(controller.getState()).toStrictEqual(stateBeforeFailure);
  });

  it("isolates initial summaries and getState results from mutation", () => {
    const repository = createRepository();
    const sourceSummaries = repository.listProjects();
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: sourceSummaries,
    });
    (sourceSummaries as unknown as Array<{ title: string }>)[0]!.title =
      "mutated source";
    const exposedState = controller.getState();
    (exposedState.projectSummaries as unknown as Array<{ title: string }>)[0]!.title =
      "mutated result";

    expect(controller.getState().projectSummaries[0]?.title).toBe("Alpha Farm");
  });

  it("isolates repository results, refresh results, and subscriber state", () => {
    const repository = createRepository();
    const returnedProject = repository.openProject("project-alpha");
    const refreshedSummaries = repository.listProjects();
    const deliveredStates: unknown[] = [];
    const recordingRepository: ReferenceProjectRepository = {
      ...repository,
      openProject: () => returnedProject,
      listProjects: () => refreshedSummaries,
    };
    const controller = createReferenceProjectWorkspaceController({
      repository: recordingRepository,
      initialProjectSummaries: repository.listProjects(),
      onStateChange: (workspaceState) => {
        deliveredStates.push(workspaceState);
        (workspaceState.activeProject as { title: string } | null)!.title =
          "subscriber mutation";
      },
    });
    controller.openProject("project-alpha");
    returnedProject.title = "repository mutation";
    controller.refreshProjects();
    (refreshedSummaries as unknown as Array<{ title: string }>)[0]!.title =
      "refresh mutation";

    expect(deliveredStates).toHaveLength(2);
    expect(controller.getState().activeProject?.title).toBe("Alpha Farm");
    expect(controller.getState().projectSummaries[0]?.title).toBe("Alpha Farm");
  });

  it("opens remapped project IDs after duplicate/import and updates summaries after copy", () => {
    const repository = createRepository();
    const controller = createController(repository);
    controller.duplicateProject("project-alpha");
    const duplicatedProject = controller.getState().activeProject;
    expect(duplicatedProject?.id).not.toBe("project-alpha");
    expect(controller.getState().activeSession?.projectId).toBe(duplicatedProject?.id);

    controller.importProject(repository.exportProject("project-beta"));
    expect(controller.getState().activeProject?.id).not.toBe("project-beta");
    const summariesBeforeCopy = controller.getState().projectSummaries;
    controller.copyMap({ projectId: "project-alpha", mapId: "map-island", targetProjectId: "project-beta" });
    expect(controller.getState().projectSummaries).not.toBe(summariesBeforeCopy);
  });

  it("reconciles the active target project and preserves its active map after copying another project map", () => {
    const repository = createRepository();
    const controller = createController(repository);
    controller.openProject("project-beta");
    const activeMapIdBeforeCopy = controller.getState().activeSession!.mapId;
    const targetMapIdsBeforeCopy = new Set(
      controller.getState().activeProject!.project.maps.map((projectMap) => projectMap.id),
    );

    controller.copyMap({
      projectId: "project-alpha",
      mapId: "map-island",
      targetProjectId: "project-beta",
    });

    expect(controller.getState().activeProject?.id).toBe("project-beta");
    expect(controller.getState().activeSession?.mapId).toBe(activeMapIdBeforeCopy);
    expect(
      controller
        .getState()
        .activeProject!.project.maps.some((projectMap) => !targetMapIdsBeforeCopy.has(projectMap.id)),
    ).toBe(true);
  });

  it("creates, renames, and deletes projects while reconciling the active session", () => {
    const repository = createRepository();
    const controller = createController(repository);

    controller.createProject({ projectName: "New Farm", season: "fall" });
    expect(controller.getState().activeProject?.title).toBe("New Farm");
    expect(controller.getState().activeSession).toBeNull();

    const createdProjectId = controller.getState().activeProject!.id;
    controller.renameProject(createdProjectId, "Renamed Farm");
    expect(controller.getState().activeProject?.title).toBe("Renamed Farm");
    expect(controller.getState().activeSession).toBeNull();

    controller.deleteProject(createdProjectId);
    expect(controller.getState()).toMatchObject({
      activeProject: null,
      activeSession: null,
    });
    expect(controller.getState().projectSummaries).not.toContainEqual(
      expect.objectContaining({ id: createdProjectId }),
    );
  });

  it("creates, renames, duplicates, deletes, and thumbnails maps through the active project", () => {
    const repository = createRepository();
    const controller = createController(repository);
    controller.openProject("project-alpha");

    controller.createMap({
      projectId: "project-alpha",
      mapFile: "Farm_Foraging.tmx",
      label: "Forest map",
      season: "fall",
    });
    const createdMapId = controller
      .getState()
      .activeProject!.project.maps.find((projectMap) => projectMap.label === "Forest map")!.id;
    expect(controller.getState().activeSession).toMatchObject({
      mapId: "map-standard",
      projectId: "project-alpha",
    });

    controller.renameMap({
      projectId: "project-alpha",
      mapId: createdMapId,
      requestedLabel: "Renamed forest map",
    });
    expect(
      controller
        .getState()
        .activeProject!.project.maps.find((projectMap) => projectMap.id === createdMapId)!
        .label,
    ).toBe("Renamed forest map");

    controller.saveThumbnail({
      projectId: "project-alpha",
      mapId: createdMapId,
      webpBytes: createStructurallyValidWebpBytes(),
    });
    expect(controller.getState().activeSession?.mapId).toBe("map-standard");

    const mapIdsBeforeDuplicate = new Set(
      controller.getState().activeProject!.project.maps.map((projectMap) => projectMap.id),
    );
    controller.duplicateMap({ projectId: "project-alpha", mapId: createdMapId });
    const duplicatedMapId = controller
      .getState()
      .activeProject!.project.maps.find((projectMap) => !mapIdsBeforeDuplicate.has(projectMap.id))!.id;
    expect(duplicatedMapId).not.toBe(createdMapId);

    controller.deleteMap({ projectId: "project-alpha", mapId: duplicatedMapId });
    expect(controller.getState().activeSession?.mapId).not.toBe(duplicatedMapId);
  });

  it("exports a project without changing controller state", () => {
    const repository = createRepository();
    const controller = createController(repository);
    controller.openProject("project-alpha");
    const stateBeforeExport = controller.getState();

    expect(controller.exportProject("project-alpha")).toContain("project-alpha");
    expect(controller.getState()).toStrictEqual(stateBeforeExport);
  });

  it("clears active project state without calling the repository and delivers isolated state once", () => {
    const repository = createRepository();
    const repositoryMethodSpies = createReferenceProjectRepositoryMethodSpies(repository);
    const deliveredStates: ReturnType<ReferenceProjectWorkspaceController["getState"]>[] = [];
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: repository.listProjects(),
      onStateChange: (workspaceState) => deliveredStates.push(workspaceState),
    });
    controller.openProject("project-alpha");
    Object.values(repositoryMethodSpies).forEach((repositoryMethodSpy) => repositoryMethodSpy.mockClear());
    deliveredStates.length = 0;
    const projectSummariesBeforeClear = controller.getState().projectSummaries;

    controller.clearActiveProject();

    expectOnlyReferenceRepositoryMethodCall(repositoryMethodSpies, null);
    expect(deliveredStates).toHaveLength(1);
    expect(controller.getState()).toMatchObject({
      activeProject: null,
      activeSession: null,
      projectSummaries: projectSummariesBeforeClear,
    });
    (deliveredStates[0]!.projectSummaries[0] as { title: string }).title =
      "Mutated outside controller";
    expect(controller.getState().projectSummaries[0]!.title).not.toBe(
      "Mutated outside controller",
    );
  });

  it("does not deliver state when the active project is already clear", () => {
    const repository = createRepository();
    const repositoryMethodSpies = createReferenceProjectRepositoryMethodSpies(repository);
    const deliveredStates: ReturnType<ReferenceProjectWorkspaceController["getState"]>[] = [];
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: repository.listProjects(),
      onStateChange: (workspaceState) => deliveredStates.push(workspaceState),
    });
    Object.values(repositoryMethodSpies).forEach((repositoryMethodSpy) => repositoryMethodSpy.mockClear());

    controller.clearActiveProject();
    expect(deliveredStates).toHaveLength(0);
    controller.openProject("project-alpha");
    controller.clearActiveProject();
    deliveredStates.length = 0;
    Object.values(repositoryMethodSpies).forEach((repositoryMethodSpy) => repositoryMethodSpy.mockClear());
    controller.clearActiveProject();

    expectOnlyReferenceRepositoryMethodCall(repositoryMethodSpies, null);
    expect(deliveredStates).toHaveLength(0);
  });

  it.each([
    ["createProject", (controller: ReferenceProjectWorkspaceController) => controller.createProject({ projectName: "Created", season: "spring" })],
    ["renameProject", (controller: ReferenceProjectWorkspaceController) => controller.renameProject("project-alpha", "Renamed")],
    ["deleteProject", (controller: ReferenceProjectWorkspaceController) => controller.deleteProject("project-alpha")],
    ["exportProject", (controller: ReferenceProjectWorkspaceController) => controller.exportProject("project-alpha")],
    ["createMap", (controller: ReferenceProjectWorkspaceController) => controller.createMap({ projectId: "project-alpha", mapFile: "Farm_Foraging.tmx", label: "Forest", season: "fall" })],
    ["renameMap", (controller: ReferenceProjectWorkspaceController) => controller.renameMap({ projectId: "project-alpha", mapId: "map-standard", requestedLabel: "Renamed" })],
    ["duplicateMap", (controller: ReferenceProjectWorkspaceController) => controller.duplicateMap({ projectId: "project-alpha", mapId: "map-standard" })],
    ["deleteMap", (controller: ReferenceProjectWorkspaceController) => controller.deleteMap({ projectId: "project-alpha", mapId: "map-island" })],
    ["saveThumbnail", (controller: ReferenceProjectWorkspaceController) => controller.saveThumbnail({ projectId: "project-alpha", mapId: "map-standard", webpBytes: createStructurallyValidWebpBytes() })],
  ] as const)("preserves state when repository.%s throws", (methodName, invokeMethod) => {
    const repository = createRepository();
    const repositoryError = new Error(`${methodName} failed`);
    const repositoryMethod = vi
      .spyOn(repository, methodName)
      .mockImplementation(() => { throw repositoryError; });
    const controller = createController(repository);
    controller.openProject("project-alpha");
    const stateBeforeFailure = controller.getState();

    expect(captureThrownValue(() => invokeMethod(controller))).toBe(repositoryError);
    expect(repositoryMethod).toHaveBeenCalledTimes(1);
    expect(controller.getState()).toStrictEqual(stateBeforeFailure);
  });

  it.each([
    ["Farm.tmx", "standard", plannerMaps],
    ["unknown-map.tmx", "Reference planner map file is unknown", plannerMaps],
    [
      "Farm.tmx",
      "Reference planner map file is ambiguous",
      [plannerMaps[0]!, { ...plannerMaps[0]!, id: "duplicate-standard" }],
    ],
  ] as const)("resolves map file %s exactly or fails fast", (mapFile, expectedResult, candidateMaps) => {
    const controller = createController();
    if (expectedResult === "standard") {
      expect(controller.getPlannerMapIdForMapFile(mapFile, candidateMaps)).toBe(expectedResult);
      return;
    }
    expect(() => controller.getPlannerMapIdForMapFile(mapFile, candidateMaps)).toThrow(
      new RegExp(`${expectedResult}.*${mapFile}`),
    );
  });

  it.each([
    ["refresh", "listProjects", (controller: ReferenceProjectWorkspaceController) => controller.refreshProjects()],
    [
      "open",
      "openProject",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.openProject("project-alpha"),
    ],
    [
      "activate",
      "updateMap",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.activateMap("map-island"),
    ],
    ["save", "updateMap", (controller: ReferenceProjectWorkspaceController) => controller.saveOpenMap({})],
    [
      "duplicate",
      "duplicateProject",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.duplicateProject("project-alpha"),
    ],
    [
      "import",
      "importProject",
      (
        controller: ReferenceProjectWorkspaceController,
      ) => controller.importProject(createSerializedProjectForImport()),
    ],
    [
      "copy",
      "copyMap",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.copyMap({
          projectId: "project-alpha",
          mapId: "map-island",
          targetProjectId: "project-beta",
        }),
    ],
    [
      "move",
      "moveMap",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.moveMap({
          projectId: "project-alpha",
          mapId: "map-island",
          targetProjectId: "project-beta",
        }),
    ],
    [
      "create project",
      "createProject",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.createProject({ projectName: "Created", season: "spring" }),
    ],
    [
      "rename project",
      "renameProject",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.renameProject("project-alpha", "Renamed"),
    ],
    [
      "delete project",
      "deleteProject",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.deleteProject("project-alpha"),
    ],
    [
      "export project",
      "exportProject",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.exportProject("project-alpha"),
    ],
    [
      "create map",
      "createMap",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.createMap({ projectId: "project-alpha", mapFile: "Farm_Foraging.tmx", label: "Forest", season: "fall" }),
    ],
    [
      "rename map",
      "renameMap",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.renameMap({ projectId: "project-alpha", mapId: "map-standard", requestedLabel: "Renamed" }),
    ],
    [
      "duplicate map",
      "duplicateMap",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.duplicateMap({ projectId: "project-alpha", mapId: "map-standard" }),
    ],
    [
      "delete map",
      "deleteMap",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.deleteMap({ projectId: "project-alpha", mapId: "map-island" }),
    ],
    [
      "save thumbnail",
      "saveThumbnail",
      (controller: ReferenceProjectWorkspaceController) =>
        controller.saveThumbnail({ projectId: "project-alpha", mapId: "map-standard", webpBytes: createStructurallyValidWebpBytes() }),
    ],
  ] as const)("calls only %s repository method once", (_operationName, expectedMethodName, invokeOperation) => {
    const repository = createRepository();
    const repositoryMethodSpies = createReferenceProjectRepositoryMethodSpies(repository);
    const controller = createReferenceProjectWorkspaceController({
      repository,
      initialProjectSummaries: repository.listProjects(),
    });
    if (expectedMethodName === "updateMap") controller.openProject("project-alpha");
    Object.values(repositoryMethodSpies).forEach((repositoryMethodSpy) => repositoryMethodSpy.mockClear());

    invokeOperation(controller);

    expectOnlyReferenceRepositoryMethodCall(repositoryMethodSpies, expectedMethodName);
  });

  it("follows an active moved map and preserves another active map on a non-active move", () => {
    const repository = createRepository();
    const controller = createController(repository);
    controller.openProject("project-alpha");
    controller.moveMap({ projectId: "project-alpha", mapId: "map-standard", targetProjectId: "project-beta" });
    expect(controller.getState().activeProject?.id).toBe("project-beta");
    expect(controller.getState().activeSession?.mapId).toBe("map-standard");

    const secondRepository = createRepository();
    const secondController = createController(secondRepository);
    secondController.openProject("project-alpha");
    secondController.moveMap({ projectId: "project-alpha", mapId: "map-island", targetProjectId: "project-beta" });
    expect(secondController.getState().activeProject?.id).toBe("project-alpha");
    expect(secondController.getState().activeSession?.mapId).toBe("map-standard");
  });

  it("does not follow another project's same map ID, but follows its own moved map", () => {
    const documentWithSharedMapIds = createAdapterSupportedDocument();
    const sourceProject = documentWithSharedMapIds.projects[1]!;
    const sourceMap = sourceProject.project.maps[0]!;
    sourceMap.id = "map-standard";
    sourceMap.thumbnail = "/api/projects/project-beta/maps/map-standard/thumbnail";
    sourceProject.project.activeMapId = "map-standard";
    sourceProject.thumbnailsByMapId = {
      "map-standard": sourceProject.thumbnailsByMapId!["farmhouse-custom-map"]!,
    };
    const targetProject = structuredClone(sourceProject);
    targetProject.id = "project-target";
    targetProject.title = "Target Farm";
    targetProject.project.projectName = "Target Farm";
    targetProject.project.activeMapId = null;
    targetProject.project.maps = [];
    targetProject.thumbnailsByMapId = {};
    documentWithSharedMapIds.projects.push(targetProject);

    const firstController = createController(
      createRepositoryFromDocument(documentWithSharedMapIds),
    );
    firstController.openProject("project-alpha");
    firstController.moveMap({
      projectId: "project-beta",
      mapId: "map-standard",
      targetProjectId: "project-target",
    });
    expect(firstController.getState().activeProject?.id).toBe("project-alpha");
    expect(firstController.getState().activeSession?.projectId).toBe("project-alpha");

    const secondController = createController(
      createRepositoryFromDocument(documentWithSharedMapIds),
    );
    secondController.openProject("project-beta");
    secondController.moveMap({
      projectId: "project-beta",
      mapId: "map-standard",
      targetProjectId: "project-target",
    });
    expect(secondController.getState().activeProject?.id).toBe("project-target");
    expect(secondController.getState().activeSession?.mapId).toBe("map-standard");
  });
});

describe("useReferenceProjectWorkspace", () => {
  it("creates an outward workspace snapshot without shared project or session references", () => {
    const repository = createRepository();
    const controller = createController(repository);
    controller.openProject("project-alpha");
    const internalSnapshot = controller.getState();
    const outwardSnapshot = cloneReferenceProjectWorkspaceState(internalSnapshot);
    (outwardSnapshot.activeProject as { title: string } | null)!.title =
      "outward mutation";
    (outwardSnapshot.projectSummaries as unknown as Array<{ title: string }>)[0]!.title =
      "summary mutation";
    (outwardSnapshot.activeSession as { season: string } | null)!.season =
      "winter";

    expect(internalSnapshot.activeProject?.title).toBe("Alpha Farm");
    expect(internalSnapshot.projectSummaries[0]?.title).toBe("Alpha Farm");
    expect(internalSnapshot.activeSession?.season).toBe("spring");
  });

  it("renders the initial bootstrapped workspace contract on the server", () => {
    const repository = createRepository();
    function WorkspaceContract() {
      const controller = useReferenceProjectWorkspace({
        repository,
        initialProjectSummaries: repository.listProjects(),
      });
      const hasNoActiveProject = controller.workspaceState.activeProject === null;
      const hasNoActiveSession = controller.workspaceState.activeSession === null;
      return (
        <output>{`${String(hasNoActiveProject)}:${String(hasNoActiveSession)}`}</output>
      );
    }
    expect(renderToStaticMarkup(<WorkspaceContract />)).toContain("true:true");
  });
});

describe("reference project workspace repository lifecycle", () => {
  it("rejects a repository reference changed after mount", () => {
    const repository = createRepository();
    expect(() =>
      assertReferenceProjectWorkspaceRepositoryReference(
        repository,
        createRepository(),
      ),
    ).toThrow(/repository changed after mount/);
  });
});

describe("reference project workspace dependency boundary", () => {
  it("keeps canonical workspace, React shell, and editing imports outside V2 and migration paths", () => {
    const modulePaths = [
      "src/reference-runtime/use-reference-project-workspace.ts",
      "src/components/planner-workspace.tsx",
      "src/components/planner-save-modal-content.tsx",
      "src/components/planner-save-modal-loader.tsx",
      "src/components/planner-game-save-modal-content.tsx",
      "src/components/planner-game-save-import-result-loader.tsx",
      "src/components/planner-farm-summary-modal-content.tsx",
      "src/components/use-planner-workspace-persistence-controls.ts",
      "src/planner/planner-workspace-editing-controller.ts",
      "src/planner/planner-workspace-persistence-runtime.ts",
      "src/planner/planner-workspace-game-save-import.ts",
      "src/planner/planner-workspace-project-actions.ts",
      "src/components/local-project-panel.tsx",
      "src/components/project-map-instance-panel.tsx",
      "src/projects/reference-project-export-file.ts",
    ];

    for (const modulePath of modulePaths) {
      expect(findForbiddenWorkspaceImports(getImportedModuleNames(modulePath))).toEqual(
        [],
      );
    }
    for (const forbiddenModuleName of [
      "../projects/local-project-store",
      "../projects/project-schema",
      "../projects/local-project-editor-actions",
      "../reference-runtime/migration-boundary",
      "../reference-runtime/migrations/boundary",
      "../reference-runtime/migrate-boundary",
      "../../public/reference-runtime/local-project-api.mjs",
    ]) {
      expect(findForbiddenWorkspaceImports([forbiddenModuleName])).toEqual([
        forbiddenModuleName,
      ]);
    }
    expect(
      findForbiddenWorkspaceImports([
        "./reference-project-editor-adapter",
        "./reference-project-repository",
      ]),
    ).toEqual([]);
  });
});

function getImportedModuleNames(modulePath: string): readonly string[] {
  const absoluteModulePath = resolve(process.cwd(), modulePath);
  const moduleSource = readFileSync(absoluteModulePath, "utf8");
  const sourceFile = typescript.createSourceFile(
    absoluteModulePath,
    moduleSource,
    typescript.ScriptTarget.Latest,
    true,
  );
  const importedModuleNames: string[] = [];
  sourceFile.forEachChild((sourceNode) => {
    if (
      typescript.isImportDeclaration(sourceNode) &&
      typescript.isStringLiteral(sourceNode.moduleSpecifier)
    ) {
      importedModuleNames.push(sourceNode.moduleSpecifier.text);
    }
  });
  return importedModuleNames;
}

function findForbiddenWorkspaceImports(
  importedModuleNames: readonly string[],
): readonly string[] {
  const forbiddenModuleNames = new Set([
    "../projects/local-project-store",
    "../projects/project-schema",
    "../projects/local-project-editor-actions",
    "../reference-runtime/migration-boundary",
    "../reference-runtime/migrations/boundary",
    "../reference-runtime/migrate-boundary",
    "../../public/reference-runtime/local-project-api.mjs",
  ]);
  return importedModuleNames.filter(
    (moduleName) =>
      forbiddenModuleNames.has(moduleName) ||
      /(^|[/.-])(migration|migrations|migrate)([/.-]|$)/.test(moduleName),
  );
}

function createReferenceProjectRepositoryMethodSpies(
  repository: ReferenceProjectRepository,
) {
  return {
    listProjects: vi.spyOn(repository, "listProjects"),
    openProject: vi.spyOn(repository, "openProject"),
    updateMap: vi.spyOn(repository, "updateMap"),
    duplicateProject: vi.spyOn(repository, "duplicateProject"),
    importProject: vi.spyOn(repository, "importProject"),
    copyMap: vi.spyOn(repository, "copyMap"),
    moveMap: vi.spyOn(repository, "moveMap"),
    createProject: vi.spyOn(repository, "createProject"),
    renameProject: vi.spyOn(repository, "renameProject"),
    deleteProject: vi.spyOn(repository, "deleteProject"),
    exportProject: vi.spyOn(repository, "exportProject"),
    createMap: vi.spyOn(repository, "createMap"),
    renameMap: vi.spyOn(repository, "renameMap"),
    duplicateMap: vi.spyOn(repository, "duplicateMap"),
    deleteMap: vi.spyOn(repository, "deleteMap"),
    saveThumbnail: vi.spyOn(repository, "saveThumbnail"),
  };
}

function expectOnlyReferenceRepositoryMethodCall(
  repositoryMethodSpies: ReturnType<
    typeof createReferenceProjectRepositoryMethodSpies
  >,
  expectedMethodName: keyof ReturnType<
    typeof createReferenceProjectRepositoryMethodSpies
  > | null,
): void {
  for (const [methodName, repositoryMethodSpy] of Object.entries(
    repositoryMethodSpies,
  )) {
    expect(repositoryMethodSpy).toHaveBeenCalledTimes(
      methodName === expectedMethodName ? 1 : 0,
    );
  }
}

function captureThrownValue(operation: () => void): unknown {
  try {
    operation();
  } catch (receivedError) {
    return receivedError;
  }
  throw new Error("Expected operation to throw, but it completed successfully.");
}

function createSerializedProjectForImport(): string {
  return JSON.stringify({
    version: 1,
    projects: [createAdapterSupportedDocument().projects[1]!],
  });
}

function createStructurallyValidWebpBytes(): Uint8Array {
  return new Uint8Array([
    82, 73, 70, 70,
    14, 0, 0, 0,
    87, 69, 66, 80,
    86, 80, 56, 32,
    1, 0, 0, 0,
    0,
    0,
  ]);
}

function createRepositoryWithProject(
  project: (typeof referenceProjectDocumentFixture.projects)[number],
): ReferenceProjectRepository {
  let serializedProjectDocument = JSON.stringify({ version: 1, projects: [project] });
  return createReferenceProjectRepository({
    storage: {
      getItem: () => serializedProjectDocument,
      setItem: (_storageKey, nextSerializedProjectDocument) => {
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    },
  });
}

function createRepositoryFromDocument(
  projectDocument: ReferenceLocalProjectDocument,
): ReferenceProjectRepository {
  let serializedProjectDocument = JSON.stringify(projectDocument);
  return createReferenceProjectRepository({
    storage: {
      getItem: () => serializedProjectDocument,
      setItem: (_storageKey, nextSerializedProjectDocument) => {
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    },
  });
}

function createAdapterSupportedDocument(): ReferenceLocalProjectDocument {
  const supportedDocument = structuredClone(referenceProjectDocumentFixture);
  for (const storedProject of supportedDocument.projects) {
    for (const projectMap of storedProject.project.maps) {
      projectMap.state = {
        buildings: [],
        crops: [],
        items: [],
        nextBuildingId: 1,
        nextItemId: 1,
      };
      projectMap.decor = { wallpapers: {}, floors: {} };
      projectMap.renovations = [];
    }
  }
  return supportedDocument;
}

function createMissingActiveMapRepository(
  missingMapProject: (typeof referenceProjectDocumentFixture.projects)[number],
): ReferenceProjectRepository {
  const unavailableOperation = () => {
    throw new Error("Unexpected repository operation in missing-active-map test.");
  };
  return {
    listProjects: () => [{
      id: missingMapProject.id,
      title: missingMapProject.title,
      created_at: missingMapProject.created_at,
      updated_at: missingMapProject.updated_at,
    }],
    openProject: (projectId: string) => {
      if (projectId !== missingMapProject.id) {
        throw new Error(`Unexpected project ID ${JSON.stringify(projectId)}.`);
      }
      return missingMapProject;
    },
    createProject: unavailableOperation,
    duplicateProject: unavailableOperation,
    renameProject: unavailableOperation,
    deleteProject: unavailableOperation,
    importProject: unavailableOperation,
    exportProject: unavailableOperation,
    updateMap: unavailableOperation,
    createMap: unavailableOperation,
    renameMap: unavailableOperation,
    duplicateMap: unavailableOperation,
    deleteMap: unavailableOperation,
    copyMap: unavailableOperation,
    moveMap: unavailableOperation,
    saveThumbnail: unavailableOperation,
  } as unknown as ReferenceProjectRepository;
}
