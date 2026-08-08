import { describe, expect, it } from "vitest";
import * as referenceProjectRepositoryModule from "../../src/reference-runtime/reference-project-repository";
import {
  handleReferenceProjectRequest,
  type ReferenceApiRequest,
  type ReferenceApiResponse,
  type ReferenceLocalProjectDocument,
} from "../../src/reference-runtime/local-project-api";
import { referenceProjectDocumentFixture } from "./fixtures/reference-project-document";

const expectedProjectRepositoryMethodNames = [
  "listProjects",
  "openProject",
  "createProject",
  "duplicateProject",
  "renameProject",
  "deleteProject",
  "importProject",
  "exportProject",
  "updateMap",
  "createMap",
  "renameMap",
  "duplicateMap",
  "deleteMap",
  "copyMap",
  "moveMap",
  "saveThumbnail",
] as const;

type FutureRepositoryModule = {
  createReferenceProjectRepository?: unknown;
  referenceProjectStorageKey?: unknown;
};

type RecordingStorage = Readonly<{
  storage: {
    getItem(storageKey: string): string | null;
    setItem(storageKey: string, serializedProjectDocument: string): void;
  };
  getWriteCount(): number;
  getSerializedProjectDocument(): string | null;
}>;

function createRecordingStorage(
  initialSerializedProjectDocument: string | null,
  writeError?: Error,
): RecordingStorage {
  let serializedProjectDocument = initialSerializedProjectDocument;
  let writeCount = 0;

  return {
    storage: {
      getItem: (storageKey: string) => {
        expect(storageKey).toBe("stardewplan-reference-local-projects-v1");
        return serializedProjectDocument;
      },
      setItem: (storageKey: string, nextSerializedProjectDocument: string) => {
        expect(storageKey).toBe("stardewplan-reference-local-projects-v1");
        writeCount += 1;
        if (writeError !== undefined) {
          throw writeError;
        }
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    },
    getWriteCount: () => writeCount,
    getSerializedProjectDocument: () => serializedProjectDocument,
  };
}

function cloneFixtureProjectDocument(): ReferenceLocalProjectDocument {
  return JSON.parse(
    JSON.stringify(referenceProjectDocumentFixture),
  ) as ReferenceLocalProjectDocument;
}

function createRepositoryWithStorage(
  recordingStorage: RecordingStorage,
  mutationOptions: Readonly<{
    requestHandler?: (
      request: ReferenceApiRequest,
      projectDocument: unknown,
    ) => ReferenceApiResponse;
    now?: () => string;
    createIdentifier?: () => string;
  }> = {},
) {
  const repositoryOptions = {
    storage: recordingStorage.storage,
    ...mutationOptions,
  };

  return referenceProjectRepositoryModule.createReferenceProjectRepository(
    repositoryOptions,
  );
}

function createRecordingRequestHandler(
  recordedRequests: ReferenceApiRequest[],
): (
  request: ReferenceApiRequest,
  projectDocument: unknown,
) => ReferenceApiResponse {
  return (request, projectDocument) => {
    recordedRequests.push(request);
    return handleReferenceProjectRequest(request, projectDocument);
  };
}

function createIdentifierSequence(
  identifiers: readonly string[],
): () => string {
  let nextIdentifierIndex = 0;

  return () => {
    const nextIdentifier = identifiers[nextIdentifierIndex];
    if (nextIdentifier === undefined) {
      throw new Error(
        `Test identifier sequence exhausted at index ${String(nextIdentifierIndex)}.`,
      );
    }
    nextIdentifierIndex += 1;
    return nextIdentifier;
  };
}

describe("reference project repository public contract", () => {
  it("exposes the canonical storage key and every supported project operation", () => {
    const futureRepositoryModule =
      referenceProjectRepositoryModule as FutureRepositoryModule;

    expect(futureRepositoryModule.referenceProjectStorageKey).toBe(
      "stardewplan-reference-local-projects-v1",
    );
    expect(futureRepositoryModule.createReferenceProjectRepository).toBeTypeOf(
      "function",
    );

    if (typeof futureRepositoryModule.createReferenceProjectRepository !== "function") {
      return;
    }

    const repository = futureRepositoryModule.createReferenceProjectRepository({
      storage: {
        getItem: (storageKey: string) =>
          storageKey === "stardewplan-reference-local-projects-v1"
            ? JSON.stringify(referenceProjectDocumentFixture)
            : null,
        setItem: () => undefined,
      },
    }) as Record<string, unknown>;

    expect(Object.keys(repository).sort()).toEqual(
      [...expectedProjectRepositoryMethodNames].sort(),
    );
    for (const methodName of expectedProjectRepositoryMethodNames) {
      expect(repository[methodName]).toBeTypeOf("function");
    }
  });

  it("throws a browser-storage error only when no storage port is injected", () => {
    const futureRepositoryModule =
      referenceProjectRepositoryModule as FutureRepositoryModule;
    const createRepository =
      futureRepositoryModule.createReferenceProjectRepository;

    expect(createRepository).toBeTypeOf("function");

    if (typeof createRepository !== "function") {
      return;
    }

    expect(() => createRepository()).toThrow(
      "Reference project repository requires browser localStorage when no storage is injected.",
    );
  });
});

describe("reference project repository canonical persistence", () => {
  it("lists no projects from empty storage without writing", () => {
    const recordingStorage = createRecordingStorage(null);
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(repository.listProjects()).toEqual([]);
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("lists each stored project's persisted summary without writing", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(repository.listProjects()).toEqual([
      {
        id: "project-alpha",
        title: "Alpha Farm",
        created_at: "2026-08-02T00:00:00.000Z",
        updated_at: "2026-08-02T01:00:00.000Z",
      },
      {
        id: "project-beta",
        title: "Beta Cabin",
        created_at: "2026-08-02T02:00:00.000Z",
        updated_at: "2026-08-02T03:00:00.000Z",
      },
    ]);
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("opens the stored project matching the requested ID without writing", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(repository.openProject("project-beta")).toEqual(
      referenceProjectDocumentFixture.projects[1],
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("rejects an absent project ID with the received ID", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(() => repository.openProject("project-missing")).toThrow(
      'Reference project "project-missing" was not found in the canonical document.',
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("rejects malformed stored JSON instead of treating it as empty", () => {
    const recordingStorage = createRecordingStorage("{");
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(() => repository.listProjects()).toThrow(
      'Reference local project storage contains malformed JSON "{".',
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("rejects a stored document with the received wrong version", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify({ version: 2, projects: [] }),
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(() => repository.listProjects()).toThrow(
      "Reference local project document version must be 1. Received: 2.",
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("rejects a stored document with a duplicate received project ID", () => {
    const duplicateProjectDocument = cloneFixtureProjectDocument();
    duplicateProjectDocument.projects[1] = {
      ...duplicateProjectDocument.projects[1],
      id: "project-alpha",
      project: {
        ...duplicateProjectDocument.projects[1].project,
        maps: duplicateProjectDocument.projects[1].project.maps.map((projectMap) => ({
          ...projectMap,
          thumbnail: projectMap.thumbnail.replace("project-beta", "project-alpha"),
        })),
      },
    };
    const recordingStorage = createRecordingStorage(
      JSON.stringify(duplicateProjectDocument),
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(() => repository.listProjects()).toThrow(
      'Reference local project document contains duplicate project ID "project-alpha" at index 1.',
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("exports exactly the requested project in a version-one canonical document without writing", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(JSON.parse(repository.exportProject("project-beta"))).toEqual({
      version: 1,
      projects: [referenceProjectDocumentFixture.projects[1]],
    });
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("appends one valid imported project without replacing current projects", () => {
    const existingProjectDocument = cloneFixtureProjectDocument();
    existingProjectDocument.projects = [existingProjectDocument.projects[0]];
    const importedProjectDocument = cloneFixtureProjectDocument();
    importedProjectDocument.projects = [importedProjectDocument.projects[1]];
    const recordingStorage = createRecordingStorage(
      JSON.stringify(existingProjectDocument),
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(repository.importProject(JSON.stringify(importedProjectDocument))).toEqual(
      referenceProjectDocumentFixture.projects[1],
    );
    expect(recordingStorage.getWriteCount()).toBe(1);
    expect(JSON.parse(recordingStorage.getSerializedProjectDocument() ?? "null")).toEqual(
      referenceProjectDocumentFixture,
    );
  });

  it.each([
    ["no project", []],
    [
      "more than one project",
      cloneFixtureProjectDocument().projects,
    ],
  ])(
    "rejects an import containing %s with the received project count",
    (_description, importedProjects) => {
      const recordingStorage = createRecordingStorage(
        JSON.stringify(referenceProjectDocumentFixture),
      );
      const repository = createRepositoryWithStorage(recordingStorage);

      expect(() =>
        repository.importProject(
          JSON.stringify({ version: 1, projects: importedProjects }),
        ),
      ).toThrow(
        `Reference project import requires exactly one project. Received project count: ${String(importedProjects.length)}.`,
      );
      expect(recordingStorage.getWriteCount()).toBe(0);
    },
  );

  it("rejects malformed imported JSON with the received serialized value", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(() => repository.importProject("{")).toThrow(
      'Reference local project storage contains malformed JSON "{".',
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
  });

  it("fully remaps an imported project ID conflict instead of overwriting existing projects", () => {
    const duplicateImportDocument = cloneFixtureProjectDocument();
    duplicateImportDocument.projects = [duplicateImportDocument.projects[0]];
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: () => {
        throw new Error("Import must not invoke the frozen request handler.");
      },
      now: () => "2026-08-02T12:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-imported",
        "map-imported-standard",
        "map-imported-island",
      ]),
    });

    const importedProject = repository.importProject(
      JSON.stringify(duplicateImportDocument),
    );

    expect(importedProject.id).toBe("project-imported");
    expect(importedProject.created_at).toBe("2026-08-02T12:00:00.000Z");
    expect(importedProject.updated_at).toBe("2026-08-02T12:00:00.000Z");
    expect(importedProject.project.activeMapId).toBe("map-imported-standard");
    expect(importedProject.project.maps.map((projectMap) => projectMap.id)).toEqual([
      "map-imported-standard",
      "map-imported-island",
    ]);
    expect(importedProject.project.maps.map((projectMap) => projectMap.thumbnail)).toEqual([
      "/api/projects/project-imported/maps/map-imported-standard/thumbnail",
      "/api/projects/project-imported/maps/map-imported-island/thumbnail",
    ]);
    expect(Object.keys(importedProject.thumbnailsByMapId ?? {})).toEqual([
      "map-imported-standard",
      "map-imported-island",
    ]);
    expect(recordingStorage.getWriteCount()).toBe(1);
    const writtenProjectDocument = JSON.parse(
      recordingStorage.getSerializedProjectDocument() ?? "null",
    ) as ReferenceLocalProjectDocument;
    expect(writtenProjectDocument.projects.slice(0, 2)).toEqual(
      referenceProjectDocumentFixture.projects,
    );
    expect(writtenProjectDocument.projects[2]).toEqual(importedProject);
  });

  it("stops a conflicting import after bounded map-ID allocation", () => {
    const duplicateImportDocument = cloneFixtureProjectDocument();
    duplicateImportDocument.projects = [duplicateImportDocument.projects[0]];
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: () => {
        throw new Error("Import must not invoke the frozen request handler.");
      },
      now: () => "2026-08-03T01:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-imported",
        "map-standard", "map-standard", "map-standard", "map-standard",
        "map-standard", "map-standard", "map-standard", "map-standard",
      ]),
    });

    expect(() =>
      repository.importProject(JSON.stringify(duplicateImportDocument)),
    ).toThrow(
      /ID allocation for remap project maps.*map IDs.*map-standard/i,
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it("stops a conflicting import after bounded repeated new map-ID allocation", () => {
    const duplicateImportDocument = cloneFixtureProjectDocument();
    duplicateImportDocument.projects = [duplicateImportDocument.projects[0]];
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: () => {
        throw new Error("Import must not invoke the frozen request handler.");
      },
      now: () => "2026-08-03T04:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-imported",
        "map-new", "map-new", "map-new", "map-new", "map-new",
        "map-new", "map-new", "map-new", "map-new",
      ]),
    });

    expect(() =>
      repository.importProject(JSON.stringify(duplicateImportDocument)),
    ).toThrow(
      /ID allocation for remap project maps.*map IDs.*map-new/i,
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it("rejects a parseable schema-invalid import without changing serialized storage", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage);

    expect(() =>
      repository.importProject(
        JSON.stringify({ version: 1, projects: [{ id: "schema-invalid" }] }),
      ),
    ).toThrow(
      "Project title must be a string. Received: undefined.",
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });
});

describe("reference project repository project mutations", () => {
  it("creates a project through the compatible handler and writes the validated response once", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T10:00:00.000Z",
      createIdentifier: () => "project-created",
    });

    const createdProject = repository.createProject({
      projectName: "Created Farm",
      season: "fall",
    });

    expect(recordedRequests).toEqual([
      {
        method: "POST",
        pathname: "/api/projects",
        jsonBody: { projectName: "Created Farm", season: "fall" },
      },
    ]);
    expect(createdProject).toEqual({
      id: "project-created",
      title: "Created Farm",
      created_at: "2026-08-02T10:00:00.000Z",
      updated_at: "2026-08-02T10:00:00.000Z",
      project: {
        version: 4,
        gameVersion: "1.6.15",
        projectName: "Created Farm",
        season: "fall",
        activeMapId: null,
        maps: [],
      },
      thumbnailsByMapId: {},
    });
    expect(recordingStorage.getWriteCount()).toBe(1);
    expect(
      JSON.parse(recordingStorage.getSerializedProjectDocument() ?? "null")
        .projects.slice(0, 2),
    ).toEqual(referenceProjectDocumentFixture.projects);
  });

  it("renames only the requested project through PUT and updates its injected timestamp", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T11:00:00.000Z",
    });

    const renamedProject = repository.renameProject(
      "project-alpha",
      "Renamed Farm",
    );

    expect(recordedRequests).toEqual([
      {
        method: "PUT",
        pathname: "/api/projects/project-alpha",
        jsonBody: { projectName: "Renamed Farm" },
      },
    ]);
    expect(renamedProject.title).toBe("Renamed Farm");
    expect(renamedProject.project.projectName).toBe("Renamed Farm");
    expect(renamedProject.updated_at).toBe("2026-08-02T11:00:00.000Z");
    expect(recordingStorage.getWriteCount()).toBe(1);
    const writtenDocument = JSON.parse(
      recordingStorage.getSerializedProjectDocument() ?? "null",
    ) as ReferenceLocalProjectDocument;
    expect(writtenDocument.projects[1]).toEqual(
      referenceProjectDocumentFixture.projects[1],
    );
  });

  it("deletes only the requested project through DELETE and writes once", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
    });

    expect(repository.deleteProject("project-beta")).toBeUndefined();

    expect(recordedRequests).toEqual([
      {
        method: "DELETE",
        pathname: "/api/projects/project-beta",
      },
    ]);
    expect(recordingStorage.getWriteCount()).toBe(1);
    expect(
      JSON.parse(recordingStorage.getSerializedProjectDocument() ?? "null"),
    ).toEqual({
      version: 1,
      projects: [referenceProjectDocumentFixture.projects[0]],
    });
  });

  it("duplicates a project with complete canonical ID remapping and leaves the source unchanged", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: () => {
        throw new Error(
          "Project duplication must not invoke the frozen request handler.",
        );
      },
      now: () => "2026-08-02T13:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-duplicate",
        "map-duplicate-standard",
        "map-duplicate-island",
      ]),
    });

    const duplicatedProject = repository.duplicateProject("project-alpha");

    expect(duplicatedProject.id).toBe("project-duplicate");
    expect(duplicatedProject.title).toBe("Alpha Farm");
    expect(duplicatedProject.created_at).toBe("2026-08-02T13:00:00.000Z");
    expect(duplicatedProject.updated_at).toBe("2026-08-02T13:00:00.000Z");
    expect(duplicatedProject.project.activeMapId).toBe("map-duplicate-standard");
    expect(duplicatedProject.project.maps.map((projectMap) => projectMap.id)).toEqual([
      "map-duplicate-standard",
      "map-duplicate-island",
    ]);
    expect(duplicatedProject.project.maps.map((projectMap) => projectMap.thumbnail)).toEqual([
      "/api/projects/project-duplicate/maps/map-duplicate-standard/thumbnail",
      "/api/projects/project-duplicate/maps/map-duplicate-island/thumbnail",
    ]);
    expect(Object.keys(duplicatedProject.thumbnailsByMapId ?? {})).toEqual([
      "map-duplicate-standard",
      "map-duplicate-island",
    ]);
    expect(duplicatedProject.project.maps[0].state).toEqual(
      referenceProjectDocumentFixture.projects[0].project.maps[0].state,
    );
    expect(recordingStorage.getWriteCount()).toBe(1);
    const writtenProjectDocument = JSON.parse(
      recordingStorage.getSerializedProjectDocument() ?? "null",
    ) as ReferenceLocalProjectDocument;
    expect(writtenProjectDocument.projects[0]).toEqual(
      referenceProjectDocumentFixture.projects[0],
    );
    expect(writtenProjectDocument.projects[1]).toEqual(
      referenceProjectDocumentFixture.projects[1],
    );
    expect(writtenProjectDocument.projects[2]).toEqual(duplicatedProject);
  });

  it("stops project duplication after bounded source-map ID allocation", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: () => {
        throw new Error(
          "Project duplication must not invoke the frozen request handler.",
        );
      },
      now: () => "2026-08-03T02:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-duplicate",
        "map-standard", "map-standard", "map-standard", "map-standard",
        "map-standard", "map-standard", "map-standard", "map-standard",
      ]),
    });

    expect(() => repository.duplicateProject("project-alpha")).toThrow(
      /ID allocation for remap project maps.*map IDs.*map-standard/i,
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it("stops project duplication after bounded repeated new map-ID allocation", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: () => {
        throw new Error(
          "Project duplication must not invoke the frozen request handler.",
        );
      },
      now: () => "2026-08-03T03:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-duplicate",
        "map-new", "map-new", "map-new", "map-new", "map-new",
        "map-new", "map-new", "map-new", "map-new",
      ]),
    });

    expect(() => repository.duplicateProject("project-alpha")).toThrow(
      /ID allocation for remap project maps.*map IDs.*map-new/i,
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });
});

describe("reference project repository map mutations", () => {
  it("creates a map through POST with exact body and remaps the returned map ID", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T14:00:00.000Z",
      createIdentifier: () => "map-created",
    });

    const updatedProject = repository.createMap({
      projectId: "project-beta",
      mapFile: "ForestFarm.tmx",
      label: "Forest Farm",
      season: "fall",
    });

    expect(recordedRequests).toEqual([
      {
        method: "POST",
        pathname: "/api/projects/project-beta/maps",
        jsonBody: {
          mapFile: "ForestFarm.tmx",
          label: "Forest Farm",
          season: "fall",
        },
      },
    ]);
    expect(updatedProject.updated_at).toBe("2026-08-02T14:00:00.000Z");
    expect(updatedProject.project.maps.at(-1)).toEqual({
      id: "map-created",
      mapFile: "ForestFarm.tmx",
      label: "Forest Farm",
      season: "fall",
      state: {
        buildings: [],
        crops: [],
        items: [],
        nextBuildingId: 1,
        nextItemId: 1,
      },
      decor: { wallpapers: {}, floors: {} },
      renovations: [],
      thumbnail: "/api/projects/project-beta/maps/map-created/thumbnail",
    });
    expect(recordingStorage.getWriteCount()).toBe(1);
    const writtenProjectDocument = JSON.parse(
      recordingStorage.getSerializedProjectDocument() ?? "null",
    ) as ReferenceLocalProjectDocument;
    expect(writtenProjectDocument.projects[0]).toEqual(
      referenceProjectDocumentFixture.projects[0],
    );
  });

  it("updates one complete map through PUT and only changes the affected project timestamp", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T15:00:00.000Z",
    });
    const mapUpdate = {
      projectId: "project-alpha",
      mapId: "map-island",
      mapFile: "IslandFarm.tmx",
      label: "Updated Island",
      season: "winter" as const,
      state: {
        buildings: [],
        crops: [],
        items: [],
        nextBuildingId: 1,
        nextItemId: 1,
        preservedUpdateExtension: { enabled: true },
      },
      decor: {
        wallpapers: { island: "wallpaper_9" },
        floors: { island: "flooring_2" },
      },
      renovations: [{ id: "island-house", enabled: true }],
      setActive: true,
    };

    const updatedProject = repository.updateMap(mapUpdate);

    expect(recordedRequests).toEqual([
      {
        method: "PUT",
        pathname: "/api/projects/project-alpha/maps/map-island",
        jsonBody: {
          mapFile: mapUpdate.mapFile,
          label: mapUpdate.label,
          season: mapUpdate.season,
          state: mapUpdate.state,
          decor: mapUpdate.decor,
          renovations: mapUpdate.renovations,
          setActive: true,
        },
      },
    ]);
    expect(updatedProject.updated_at).toBe("2026-08-02T15:00:00.000Z");
    expect(updatedProject.project.activeMapId).toBe("map-island");
    expect(updatedProject.project.maps[1]).toMatchObject({
      id: "map-island",
      label: "Updated Island",
      season: "winter",
      state: mapUpdate.state,
      decor: mapUpdate.decor,
      renovations: mapUpdate.renovations,
    });
    expect(recordingStorage.getWriteCount()).toBe(1);
    const writtenProjectDocument = JSON.parse(
      recordingStorage.getSerializedProjectDocument() ?? "null",
    ) as ReferenceLocalProjectDocument;
    expect(writtenProjectDocument.projects[1]).toEqual(
      referenceProjectDocumentFixture.projects[1],
    );
  });

  it("renames one map through PATCH with the exact label body", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T16:00:00.000Z",
    });

    const renamedProject = repository.renameMap({
      projectId: "project-alpha",
      mapId: "map-island",
      requestedLabel: "Renamed Island",
    });

    expect(recordedRequests).toEqual([
      {
        method: "PATCH",
        pathname: "/api/projects/project-alpha/maps/map-island",
        jsonBody: { label: "Renamed Island" },
      },
    ]);
    expect(renamedProject.updated_at).toBe("2026-08-02T16:00:00.000Z");
    expect(renamedProject.project.maps[1].label).toBe("Renamed Island");
    expect(recordingStorage.getWriteCount()).toBe(1);
  });

  it("deletes one map through DELETE and preserves the frozen active-map and thumbnail semantics", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T17:00:00.000Z",
    });

    const updatedProject = repository.deleteMap({
      projectId: "project-alpha",
      mapId: "map-standard",
    });

    expect(recordedRequests).toEqual([
      {
        method: "DELETE",
        pathname: "/api/projects/project-alpha/maps/map-standard",
      },
    ]);
    expect(updatedProject.updated_at).toBe("2026-08-02T17:00:00.000Z");
    expect(updatedProject.project.activeMapId).toBe("map-island");
    expect(updatedProject.project.maps.map((projectMap) => projectMap.id)).toEqual([
      "map-island",
    ]);
    expect(updatedProject.thumbnailsByMapId).toEqual({
      "map-island":
        referenceProjectDocumentFixture.projects[0].thumbnailsByMapId?.[
          "map-island"
        ],
    });
    expect(recordingStorage.getWriteCount()).toBe(1);
  });

  it("duplicates one map through the frozen duplicate endpoint and remaps its generated ID", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T18:00:00.000Z",
      createIdentifier: () => "map-duplicate",
    });

    const updatedProject = repository.duplicateMap({
      projectId: "project-alpha",
      mapId: "map-standard",
    });

    expect(recordedRequests).toEqual([
      {
        method: "POST",
        pathname: "/api/projects/project-alpha/maps/map-standard/duplicate",
      },
    ]);
    expect(updatedProject.updated_at).toBe("2026-08-02T18:00:00.000Z");
    expect(updatedProject.project.maps.at(-1)).toMatchObject({
      id: "map-duplicate",
      label: "Standard Farm Copy",
      thumbnail: "/api/projects/project-alpha/maps/map-duplicate/thumbnail",
      state: referenceProjectDocumentFixture.projects[0].project.maps[0].state,
    });
    expect(updatedProject.thumbnailsByMapId?.["map-duplicate"]).toBe(
      referenceProjectDocumentFixture.projects[0].thumbnailsByMapId?.[
        "map-standard"
      ],
    );
    expect(recordingStorage.getWriteCount()).toBe(1);
  });
});

describe("reference project repository map transfer and thumbnail mutations", () => {
  it("copies a map to an existing project through the frozen copy endpoint", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T19:00:00.000Z",
      createIdentifier: () => "map-copied",
    });

    const targetProject = repository.copyMap({
      projectId: "project-alpha",
      mapId: "map-island",
      targetProjectId: "project-beta",
    });

    expect(recordedRequests).toEqual([
      {
        method: "POST",
        pathname: "/api/projects/project-alpha/maps/map-island/copy",
        jsonBody: { targetProjectId: "project-beta" },
      },
    ]);
    expect(targetProject.id).toBe("project-beta");
    expect(targetProject.updated_at).toBe("2026-08-02T19:00:00.000Z");
    expect(targetProject.project.maps.at(-1)).toMatchObject({
      id: "map-copied",
      label: "Island Farm",
      thumbnail: "/api/projects/project-beta/maps/map-copied/thumbnail",
    });
    expect(targetProject.thumbnailsByMapId?.["map-copied"]).toBe(
      referenceProjectDocumentFixture.projects[0].thumbnailsByMapId?.[
        "map-island"
      ],
    );
    expect(recordingStorage.getWriteCount()).toBe(1);
    const writtenProjectDocument = JSON.parse(
      recordingStorage.getSerializedProjectDocument() ?? "null",
    ) as ReferenceLocalProjectDocument;
    expect(writtenProjectDocument.projects[0].updated_at).toBe(
      "2026-08-02T19:00:00.000Z",
    );
  });

  it("copies a map into a new target project and remaps both generated IDs", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T20:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-copy-target",
        "map-copy-target",
      ]),
    });

    const targetProject = repository.copyMap({
      projectId: "project-alpha",
      mapId: "map-island",
      newProjectName: "Copied Maps",
    });

    expect(recordedRequests).toEqual([
      {
        method: "POST",
        pathname: "/api/projects/project-alpha/maps/map-island/copy",
        jsonBody: { newProjectName: "Copied Maps" },
      },
    ]);
    expect(targetProject).toMatchObject({
      id: "project-copy-target",
      title: "Copied Maps",
      created_at: "2026-08-02T20:00:00.000Z",
      updated_at: "2026-08-02T20:00:00.000Z",
      project: {
        activeMapId: "map-copy-target",
        maps: [
          {
            id: "map-copy-target",
            thumbnail:
              "/api/projects/project-copy-target/maps/map-copy-target/thumbnail",
          },
        ],
      },
    });
    expect(targetProject.thumbnailsByMapId?.["map-copy-target"]).toBe(
      referenceProjectDocumentFixture.projects[0].thumbnailsByMapId?.[
        "map-island"
      ],
    );
    expect(recordingStorage.getWriteCount()).toBe(1);
  });

  it("moves a map to an existing project while preserving its map ID", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T21:00:00.000Z",
      createIdentifier: () => {
        throw new Error("Existing-project move must not generate an ID.");
      },
    });

    const moveResult = repository.moveMap({
      projectId: "project-alpha",
      mapId: "map-standard",
      targetProjectId: "project-beta",
    });

    expect(recordedRequests).toEqual([
      {
        method: "POST",
        pathname: "/api/projects/project-alpha/maps/map-standard/move",
        jsonBody: { targetProjectId: "project-beta" },
      },
    ]);
    expect(moveResult.sourceProject.project.maps.map((projectMap) => projectMap.id)).toEqual([
      "map-island",
    ]);
    expect(moveResult.sourceProject.project.activeMapId).toBe("map-island");
    expect(moveResult.sourceProject.thumbnailsByMapId).toEqual({
      "map-island":
        referenceProjectDocumentFixture.projects[0].thumbnailsByMapId?.[
          "map-island"
        ],
    });
    expect(moveResult.targetProject.project.maps.at(-1)).toMatchObject({
      id: "map-standard",
      thumbnail: "/api/projects/project-beta/maps/map-standard/thumbnail",
    });
    expect(moveResult.sourceProject.updated_at).toBe(
      "2026-08-02T21:00:00.000Z",
    );
    expect(moveResult.targetProject.updated_at).toBe(
      "2026-08-02T21:00:00.000Z",
    );
    expect(recordingStorage.getWriteCount()).toBe(1);
  });

  it("moves a map into a new target project and only remaps the generated project ID", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T22:00:00.000Z",
      createIdentifier: () => "project-move-target",
    });

    const moveResult = repository.moveMap({
      projectId: "project-alpha",
      mapId: "map-island",
      newProjectName: "Moved Maps",
    });

    expect(recordedRequests).toEqual([
      {
        method: "POST",
        pathname: "/api/projects/project-alpha/maps/map-island/move",
        jsonBody: { newProjectName: "Moved Maps" },
      },
    ]);
    expect(moveResult.sourceProject.project.maps.map((projectMap) => projectMap.id)).toEqual([
      "map-standard",
    ]);
    expect(moveResult.targetProject).toMatchObject({
      id: "project-move-target",
      title: "Moved Maps",
      created_at: "2026-08-02T22:00:00.000Z",
      updated_at: "2026-08-02T22:00:00.000Z",
      project: {
        activeMapId: "map-island",
        maps: [
          {
            id: "map-island",
            thumbnail:
              "/api/projects/project-move-target/maps/map-island/thumbnail",
          },
        ],
      },
    });
    expect(moveResult.targetProject.thumbnailsByMapId?.["map-island"]).toBe(
      referenceProjectDocumentFixture.projects[0].thumbnailsByMapId?.[
        "map-island"
      ],
    );
    expect(recordingStorage.getWriteCount()).toBe(1);
  });

  it("saves valid WebP bytes through the thumbnail endpoint and reads them from canonical storage", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const recordedRequests: ReferenceApiRequest[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: createRecordingRequestHandler(recordedRequests),
      now: () => "2026-08-02T23:00:00.000Z",
    });
    const webpBytes = new Uint8Array([
      82, 73, 70, 70, 14, 0, 0, 0, 87, 69, 66, 80, 86, 80, 56, 32, 1, 0,
      0, 0, 0, 0,
    ]);

    const savedProject = repository.saveThumbnail({
      projectId: "project-beta",
      mapId: "farmhouse-custom-map",
      webpBytes,
    });

    expect(recordedRequests).toEqual([
      {
        method: "POST",
        pathname:
          "/api/projects/project-beta/maps/farmhouse-custom-map/thumbnail",
        contentType: "image/webp",
        binaryBody: webpBytes,
      },
    ]);
    expect(savedProject.updated_at).toBe("2026-08-02T23:00:00.000Z");
    expect(
      savedProject.thumbnailsByMapId?.["farmhouse-custom-map"],
    ).toBe("data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA==");
    expect(recordingStorage.getWriteCount()).toBe(1);
    expect(
      repository.openProject("project-beta").thumbnailsByMapId?.[
        "farmhouse-custom-map"
      ],
    ).toBe("data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA==");
    expect(recordingStorage.getWriteCount()).toBe(1);
  });
});

describe("reference project repository atomic mutation failures", () => {
  it("does not write or change serialized storage when the handler throws", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: () => {
        throw new Error("Injected handler failure.");
      },
    });

    expect(() =>
      repository.renameProject("project-alpha", "Never Written"),
    ).toThrow("Injected handler failure.");
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it("rejects a non-object handler response with the received value before writing", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: () => null as unknown as ReferenceApiResponse,
    });

    expect(() =>
      repository.renameProject("project-alpha", "Never Written"),
    ).toThrow(
      "Reference project repository expected a mutation response object. Received: null.",
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it.each([
    [
      "non-200 status",
      (response: ReferenceApiResponse): ReferenceApiResponse => ({
        ...response,
        status: 409,
      }),
      "Reference project repository expected mutation status 200. Received: 409.",
    ],
    [
      "false mutation flag",
      (response: ReferenceApiResponse): ReferenceApiResponse => ({
        ...response,
        didMutateProjectDocument: false,
      }),
      "Reference project repository expected didMutateProjectDocument true. Received: false.",
    ],
    [
      "wrong response body",
      (response: ReferenceApiResponse): ReferenceApiResponse => ({
        ...response,
        jsonBody: { unexpected: true },
      }),
      'Reference project repository expected mutation response keys []. Received: ["unexpected"].',
    ],
    [
      "wrong response content type",
      (response: ReferenceApiResponse): ReferenceApiResponse => ({
        ...response,
        headers: { "content-type": "text/plain" },
      }),
      'Reference project repository expected mutation content-type "application/json". Received: "text/plain".',
    ],
  ])(
    "does not write or change serialized storage for a handler %s",
    (_description, alterResponse, expectedError) => {
      const originalSerializedProjectDocument = JSON.stringify(
        referenceProjectDocumentFixture,
      );
      const recordingStorage = createRecordingStorage(
        originalSerializedProjectDocument,
      );
      const repository = createRepositoryWithStorage(recordingStorage, {
        requestHandler: (request, projectDocument) =>
          alterResponse(
            handleReferenceProjectRequest(request, projectDocument),
          ),
      });

      expect(() =>
        repository.renameProject("project-alpha", "Never Written"),
      ).toThrow(expectedError);
      expect(recordingStorage.getWriteCount()).toBe(0);
      expect(recordingStorage.getSerializedProjectDocument()).toBe(
        originalSerializedProjectDocument,
      );
    },
  );

  it("does not write or change serialized storage for a schema-invalid handler document", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: (request, projectDocument) => ({
        ...handleReferenceProjectRequest(request, projectDocument),
        projectDocument: {
          version: 1,
          projects: [{ id: "schema-invalid" }],
        } as ReferenceLocalProjectDocument,
      }),
    });

    expect(() =>
      repository.renameProject("project-alpha", "Never Written"),
    ).toThrow("Project title must be a string. Received: undefined.");
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it("attempts setItem exactly once without repair and preserves storage when setItem throws", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
      new Error("Storage quota exceeded."),
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      now: () => "2026-08-03T00:00:00.000Z",
    });

    expect(() =>
      repository.renameProject("project-alpha", "Quota Failure"),
    ).toThrow("Storage quota exceeded.");
    expect(recordingStorage.getWriteCount()).toBe(1);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it("rejects a parseable non-ISO injected timestamp before writing", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(
      originalSerializedProjectDocument,
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      now: () => "August 2, 2026",
    });

    expect(() =>
      repository.renameProject("project-alpha", "Invalid Timestamp"),
    ).toThrow(
      'Reference project repository now() must return a canonical ISO timestamp string. Received: "August 2, 2026".',
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it("encodes every caller-provided path segment before invoking the handler", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const receivedPathnames: string[] = [];
    const repository = createRepositoryWithStorage(recordingStorage, {
      requestHandler: (request, projectDocument) => {
        receivedPathnames.push(request.pathname);
        return {
          status: 200,
          headers: { "content-type": "application/json" },
          jsonBody: {},
          projectDocument: projectDocument as ReferenceLocalProjectDocument,
          didMutateProjectDocument: true,
        };
      },
    });

    repository.deleteProject("project/with space");

    expect(receivedPathnames).toEqual([
      "/api/projects/project%2Fwith%20space",
    ]);
    expect(recordingStorage.getWriteCount()).toBe(1);
  });

  it("retries colliding repository-generated project and map IDs before committing", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      now: () => "2026-08-03T05:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-alpha",
        "project-duplicate-safe",
        "map-standard",
        "map-duplicate-standard-safe",
        "map-island",
        "map-duplicate-island-safe",
      ]),
    });

    const duplicatedProject = repository.duplicateProject("project-alpha");

    expect(duplicatedProject.id).toBe("project-duplicate-safe");
    expect(duplicatedProject.project.maps.map((projectMap) => projectMap.id)).toEqual([
      "map-duplicate-standard-safe",
      "map-duplicate-island-safe",
    ]);
    expect(recordingStorage.getWriteCount()).toBe(1);
  });

  it("retries a destination map collision for create, duplicate, and copy", () => {
    const initialDocument = cloneFixtureProjectDocument();
    const existingTargetMap = structuredClone(
      initialDocument.projects[0].project.maps[0],
    );
    existingTargetMap.id = "map-beta-existing";
    existingTargetMap.thumbnail =
      "/api/projects/project-beta/maps/map-beta-existing/thumbnail";
    initialDocument.projects[1].project = {
      ...initialDocument.projects[1].project,
      activeMapId: "map-beta-existing",
      maps: [existingTargetMap],
    };
    initialDocument.projects[1].thumbnailsByMapId = {
      "map-beta-existing": "data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAA==",
    };
    const recordingStorage = createRecordingStorage(JSON.stringify(initialDocument));
    const repository = createRepositoryWithStorage(recordingStorage, {
      now: () => "2026-08-03T06:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "map-standard",
        "map-created-safe",
        "map-standard",
        "map-duplicate-safe",
        "map-beta-existing",
        "map-copied-safe",
      ]),
    });

    expect(
      repository.createMap({
        projectId: "project-alpha",
        mapFile: "ForestFarm.tmx",
        label: "Created",
        season: "fall",
      }).project.maps.at(-1)?.id,
    ).toBe("map-created-safe");
    expect(
      repository.duplicateMap({ projectId: "project-alpha", mapId: "map-standard" })
        .project.maps.at(-1)?.id,
    ).toBe("map-duplicate-safe");
    expect(
      repository.copyMap({
        projectId: "project-alpha",
        mapId: "map-island",
        targetProjectId: "project-beta",
      }).project.maps.at(-1)?.id,
    ).toBe("map-copied-safe");
    expect(recordingStorage.getWriteCount()).toBe(3);
  });

  it("retries IDs for conflicting import and a copied map's newly created target", () => {
    const importedDocument = cloneFixtureProjectDocument();
    importedDocument.projects = [importedDocument.projects[0]];
    const importStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const importRepository = createRepositoryWithStorage(importStorage, {
      now: () => "2026-08-03T07:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-alpha",
        "project-import-safe",
        "map-standard",
        "map-import-standard-safe",
        "map-island",
        "map-import-island-safe",
      ]),
    });

    expect(importRepository.importProject(JSON.stringify(importedDocument)).id).toBe(
      "project-import-safe",
    );

    const transferStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const transferRepository = createRepositoryWithStorage(transferStorage, {
      now: () => "2026-08-03T08:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-alpha",
        "project-copy-safe",
        "map-island",
        "map-copy-safe",
      ]),
    });
    const copiedProject = transferRepository.copyMap({
      projectId: "project-alpha",
      mapId: "map-island",
      newProjectName: "Copied Farm",
    });

    expect(copiedProject.id).toBe("project-copy-safe");
    expect(copiedProject.project.maps.map((projectMap) => projectMap.id)).toEqual([
      "map-copy-safe",
    ]);
  });

  it("rejects a runtime BigInt identifier with allocation context and zero writes", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(originalSerializedProjectDocument);
    const repository = createRepositoryWithStorage(recordingStorage, {
      createIdentifier: (() => 1n) as unknown as () => string,
      now: () => "2026-08-03T09:30:00.000Z",
    });

    expect(() => repository.duplicateProject("project-alpha")).toThrow(
      /allocation.*duplicate project.*project IDs.*BigInt.*1/s,
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });

  it("occupies each accepted remapped map ID before allocating the next map", () => {
    const recordingStorage = createRecordingStorage(
      JSON.stringify(referenceProjectDocumentFixture),
    );
    const repository = createRepositoryWithStorage(recordingStorage, {
      createIdentifier: createIdentifierSequence([
        "project-duplicate-safe",
        "map-safe",
        "map-safe",
        "map-safe-2",
      ]),
      now: () => "2026-08-03T09:45:00.000Z",
    });

    const duplicatedProject = repository.duplicateProject("project-alpha");

    expect(duplicatedProject.project.maps.map((projectMap) => projectMap.id)).toEqual([
      "map-safe",
      "map-safe-2",
    ]);
    expect(duplicatedProject.project.activeMapId).toBe("map-safe");
    expect(Object.keys(duplicatedProject.thumbnailsByMapId ?? {})).toEqual([
      "map-safe",
      "map-safe-2",
    ]);
    expect(duplicatedProject.project.maps.map((projectMap) => projectMap.thumbnail)).toEqual([
      "/api/projects/project-duplicate-safe/maps/map-safe/thumbnail",
      "/api/projects/project-duplicate-safe/maps/map-safe-2/thumbnail",
    ]);
    expect(recordingStorage.getWriteCount()).toBe(1);
  });

  it("stops bounded allocation with operation and scope context without writing", () => {
    const originalSerializedProjectDocument = JSON.stringify(
      referenceProjectDocumentFixture,
    );
    const recordingStorage = createRecordingStorage(originalSerializedProjectDocument);
    const repository = createRepositoryWithStorage(recordingStorage, {
      createIdentifier: () => "project-alpha",
      now: () => "2026-08-03T09:00:00.000Z",
    });

    expect(() => repository.duplicateProject("project-alpha")).toThrow(
      /allocation.*duplicate project.*project IDs.*project-alpha/i,
    );
    expect(recordingStorage.getWriteCount()).toBe(0);
    expect(recordingStorage.getSerializedProjectDocument()).toBe(
      originalSerializedProjectDocument,
    );
  });
});
