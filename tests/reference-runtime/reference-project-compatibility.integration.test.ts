import { describe, expect, it } from "vitest";

import {
  applyReferenceOpenMapEdits,
  createReferenceOpenMapSession,
} from "../../src/reference-runtime/reference-project-editor-adapter";
import {
  createReferenceProjectRepository,
  referenceProjectStorageKey,
  type ReferenceProjectStorage,
} from "../../src/reference-runtime/reference-project-repository";
import {
  handleReferenceProjectRequest,
  parseReferenceProjectDocument,
  serializeReferenceProjectDocument,
  validateReferenceProjectDocument,
  type ReferenceLocalProjectDocument,
  type ReferenceProjectMap,
} from "../../src/reference-runtime/local-project-api";
import { referenceProjectDocumentFixture } from "./fixtures/reference-project-document";

type MutableReferenceProjectStorage = Readonly<{
  storage: ReferenceProjectStorage;
  readSerializedDocument(): string;
}>;

function createMutableReferenceProjectStorage(
  initialSerializedDocument: string,
  writeFailure?: Error,
): MutableReferenceProjectStorage {
  let serializedDocument = initialSerializedDocument;

  return {
    storage: {
      getItem(storageKey: string): string | null {
        expect(storageKey).toBe(referenceProjectStorageKey);
        return serializedDocument;
      },
      setItem(storageKey: string, nextSerializedDocument: string): void {
        expect(storageKey).toBe(referenceProjectStorageKey);
        if (writeFailure !== undefined) {
          throw writeFailure;
        }
        serializedDocument = nextSerializedDocument;
      },
    },
    readSerializedDocument(): string {
      return serializedDocument;
    },
  };
}

function createIdentifierSequence(identifiers: readonly string[]): () => string {
  let nextIdentifierIndex = 0;

  return (): string => {
    const identifier = identifiers[nextIdentifierIndex];
    if (identifier === undefined) {
      throw new Error(
        `Integration identifier sequence exhausted at index ${String(nextIdentifierIndex)}.`,
      );
    }
    nextIdentifierIndex += 1;
    return identifier;
  };
}

function createFixtureWithDistinctThumbnailPayloads(): ReferenceLocalProjectDocument {
  const fixtureWithDistinctThumbnails = structuredClone(
    referenceProjectDocumentFixture,
  );
  const alphaProject = fixtureWithDistinctThumbnails.projects[0];
  if (alphaProject?.thumbnailsByMapId === undefined) {
    throw new Error("Expected the alpha fixture project to contain thumbnail payloads.");
  }
  alphaProject.thumbnailsByMapId["map-island"] =
    "data:image/webp;base64,UklGRg4AAABXRUJQVlA4IAEAAAAAAQ==";

  return validateReferenceProjectDocument(fixtureWithDistinctThumbnails);
}

function readProjectMap(
  projectDocument: ReferenceLocalProjectDocument,
  projectId: string,
  mapId: string,
): ReferenceProjectMap {
  const project = projectDocument.projects.find(
    (candidateProject) => candidateProject.id === projectId,
  );
  if (project === undefined) {
    throw new Error(`Expected project ${JSON.stringify(projectId)}.`);
  }
  const projectMap = project.project.maps.find(
    (candidateMap) => candidateMap.id === mapId,
  );
  if (projectMap === undefined) {
    throw new Error(
      `Expected map ${JSON.stringify(mapId)} in project ${JSON.stringify(projectId)}.`,
    );
  }
  return projectMap;
}

function readSingleAddedMapId(
  previousMapIds: readonly string[],
  receivedMapIds: readonly string[],
): string {
  const previousMapIdSet = new Set(previousMapIds);
  const addedMapIds = receivedMapIds.filter(
    (receivedMapId) => !previousMapIdSet.has(receivedMapId),
  );
  if (addedMapIds.length !== 1) {
    throw new Error(
      `Expected exactly one added frozen duplicate map ID. Previous IDs: ${JSON.stringify(previousMapIds)}. Received IDs: ${JSON.stringify(receivedMapIds)}. Added IDs: ${JSON.stringify(addedMapIds)}.`,
    );
  }
  return addedMapIds[0]!;
}

function updateMapThroughRepository(
  repository: ReturnType<typeof createReferenceProjectRepository>,
  projectId: string,
  referenceProjectMap: ReferenceProjectMap,
): void {
  repository.updateMap({
    projectId,
    mapId: referenceProjectMap.id,
    mapFile: referenceProjectMap.mapFile,
    label: referenceProjectMap.label,
    season: referenceProjectMap.season,
    state: referenceProjectMap.state,
    decor: referenceProjectMap.decor,
    renovations: referenceProjectMap.renovations,
    setActive: true,
  });
}

function assertProjectIdentityConsistency(
  projectDocument: ReferenceLocalProjectDocument,
): void {
  const projectIds = projectDocument.projects.map((project) => project.id);
  expect(new Set(projectIds).size).toBe(projectIds.length);

  for (const project of projectDocument.projects) {
    const mapIds = project.project.maps.map((projectMap) => projectMap.id);
    expect(new Set(mapIds).size).toBe(mapIds.length);
    expect(mapIds).toContain(project.project.activeMapId);
    expect(Object.keys(project.thumbnailsByMapId ?? {}).sort()).toEqual(
      [...mapIds].sort(),
    );
    for (const projectMap of project.project.maps) {
      expect(projectMap.thumbnail).toBe(
        `/api/projects/${project.id}/maps/${projectMap.id}/thumbnail`,
      );
    }
  }
}

describe("reference project frozen and React alternating compatibility", () => {
  it("round-trips a frozen fixture through a React open/save and frozen validation", () => {
    const storage = createMutableReferenceProjectStorage(
      serializeReferenceProjectDocument(referenceProjectDocumentFixture),
    );
    const repository = createReferenceProjectRepository({
      storage: storage.storage,
      now: () => "2026-08-03T00:00:00.000Z",
    });
    const sourceMap = repository.openProject("project-alpha").project.maps[1];
    if (sourceMap === undefined) {
      throw new Error("Expected the alpha project to contain a map.");
    }
    const openMapSession = createReferenceOpenMapSession("project-alpha", sourceMap);
    const savedMap = applyReferenceOpenMapEdits(openMapSession, {
      placementSnapshot: openMapSession.placementSnapshot,
      season: openMapSession.season,
      interiorDecor: openMapSession.interiorDecor,
      renovations: openMapSession.sourceMap.renovations,
    });

    updateMapThroughRepository(repository, "project-alpha", savedMap);

    const frozenValidatedDocument = validateReferenceProjectDocument(
      parseReferenceProjectDocument(storage.readSerializedDocument()),
    );
    expect(readProjectMap(frozenValidatedDocument, "project-alpha", "map-island")).toEqual(
      referenceProjectDocumentFixture.projects[0]?.project.maps[1],
    );
  });

  it("round-trips a frozen table pointer through nested React editing and repository persistence", () => {
    const heldItemDocument = structuredClone(referenceProjectDocumentFixture);
    const sourceMap = heldItemDocument.projects[0]?.project.maps[1];
    if (sourceMap === undefined) {
      throw new Error("Expected the alpha fixture to contain an island map.");
    }
    const sourceItems = sourceMap.state.items as Array<Record<string, unknown>>;
    sourceItems.push(
      {
        instanceId: "custom-table",
        itemId: "furniture_1300",
        x: 4,
        y: 5,
        layer: "item",
        rotation: 0,
        footprint: { w: 2, h: 2, tableAnchor: "bottom" },
        variant: 0,
        tintColor: "#ffffff",
        locked: false,
        isRug: false,
        isGrass: false,
        isTable: true,
        isLongTable: false,
        flipped: false,
        bedType: null,
        heldItemId: "custom-table-child",
        parentExtension: { keep: true },
      },
      {
        instanceId: "custom-table-child",
        itemId: "furniture_45",
        x: 5,
        y: 5,
        layer: "item",
        rotation: 0,
        footprint: { w: 1, h: 1, childAnchor: "center" },
        variant: 2,
        tintColor: "#abcdef",
        locked: false,
        isRug: false,
        isGrass: false,
        isTable: false,
        isLongTable: false,
        flipped: false,
        bedType: null,
        childExtension: { keep: true },
      },
    );
    const storage = createMutableReferenceProjectStorage(
      serializeReferenceProjectDocument(heldItemDocument),
    );
    const repository = createReferenceProjectRepository({ storage: storage.storage });
    const openedMap = repository.openProject("project-alpha").project.maps[1];
    if (openedMap === undefined) {
      throw new Error("Expected the repository to open the island map.");
    }
    const session = createReferenceOpenMapSession("project-alpha", openedMap);
    const parent = session.placementSnapshot.items.find(
      (item) => item.itemId === "furniture_1300",
    );
    if (parent?.heldItem === undefined) {
      throw new Error("Expected the React snapshot to nest the frozen child.");
    }

    const savedMap = applyReferenceOpenMapEdits(session, {
      placementSnapshot: {
        ...session.placementSnapshot,
        items: session.placementSnapshot.items.map((item) =>
          item.instanceId === parent.instanceId
            ? { ...item, heldItem: { ...parent.heldItem!, variant: 6 } }
            : item,
        ),
      },
    });
    updateMapThroughRepository(repository, "project-alpha", savedMap);

    const persistedMap = readProjectMap(
      parseReferenceProjectDocument(storage.readSerializedDocument()),
      "project-alpha",
      "map-island",
    );
    const persistedItems = persistedMap.state.items as Array<Record<string, unknown>>;
    expect(persistedItems.slice(-2).map((item) => item.instanceId)).toEqual([
      "custom-table",
      "custom-table-child",
    ]);
    expect(persistedItems.at(-2)).toMatchObject({
      heldItemId: "custom-table-child",
      parentExtension: { keep: true },
    });
    expect(persistedItems.at(-1)).toMatchObject({
      variant: 6,
      childExtension: { keep: true },
      footprint: { w: 1, h: 1, childAnchor: "center" },
    });
    expect(
      createReferenceOpenMapSession("project-alpha", persistedMap)
        .placementSnapshot.items.find((item) => item.itemId === "furniture_1300")
        ?.heldItem,
    ).toMatchObject({ itemId: "furniture_45", variant: 6 });
  });

  it("opens a React save after frozen PATCH and duplicate-map operations", () => {
    const storage = createMutableReferenceProjectStorage(
      serializeReferenceProjectDocument(referenceProjectDocumentFixture),
    );
    const repository = createReferenceProjectRepository({
      storage: storage.storage,
      now: () => "2026-08-03T01:00:00.000Z",
    });
    const sourceMap = repository.openProject("project-alpha").project.maps[1];
    if (sourceMap === undefined) {
      throw new Error("Expected the alpha project to contain a map.");
    }
    const savedMap = applyReferenceOpenMapEdits(
      createReferenceOpenMapSession("project-alpha", sourceMap),
      { season: "fall" },
    );
    updateMapThroughRepository(repository, "project-alpha", savedMap);

    const patchedDocument = handleReferenceProjectRequest(
      {
        method: "PATCH",
        pathname: "/api/projects/project-alpha/maps/map-island",
        jsonBody: { label: "Frozen Renamed Standard Farm" },
      },
      parseReferenceProjectDocument(storage.readSerializedDocument()),
    ).projectDocument;
    const frozenDuplicateResponse = handleReferenceProjectRequest(
      {
        method: "POST",
        pathname: "/api/projects/project-alpha/maps/map-island/duplicate",
      },
      patchedDocument,
    );
    expect(frozenDuplicateResponse.status).toBe(200);
    expect(frozenDuplicateResponse.jsonBody).toEqual({});
    const frozenDuplicateMapId = readSingleAddedMapId(
      patchedDocument.projects
        .find((project) => project.id === "project-alpha")
        ?.project.maps.map((projectMap) => projectMap.id) ?? [],
      frozenDuplicateResponse.projectDocument.projects
        .find((project) => project.id === "project-alpha")
        ?.project.maps.map((projectMap) => projectMap.id) ?? [],
    );
    const reopenedRepository = createReferenceProjectRepository({
      storage: createMutableReferenceProjectStorage(
        serializeReferenceProjectDocument(frozenDuplicateResponse.projectDocument),
      ).storage,
    });

    const reopenedAlphaProject = reopenedRepository.openProject("project-alpha");
    expect(reopenedAlphaProject.project.maps).toHaveLength(3);
    const frozenPatchedIslandMap = readProjectMap(
      patchedDocument,
      "project-alpha",
      "map-island",
    );
    const reopenedDuplicatedMap = readProjectMap(
      { version: 1, projects: [reopenedAlphaProject] },
      "project-alpha",
      frozenDuplicateMapId,
    );
    expect(reopenedAlphaProject.project.maps[1]).toMatchObject({
      id: "map-island",
      label: "Frozen Renamed Standard Farm",
      season: "fall",
    });
    expect(reopenedDuplicatedMap).toMatchObject({
      id: frozenDuplicateMapId,
      label: `${frozenPatchedIslandMap.label} Copy`,
      season: frozenPatchedIslandMap.season,
      state: frozenPatchedIslandMap.state,
      decor: frozenPatchedIslandMap.decor,
      renovations: frozenPatchedIslandMap.renovations,
      thumbnail: `/api/projects/project-alpha/maps/${frozenDuplicateMapId}/thumbnail`,
    });
    expect(createReferenceOpenMapSession("project-alpha", reopenedDuplicatedMap).season).toBe(
      "fall",
    );
  });

  it("preserves unrelated projects, canonical IDs, thumbnails, decor, renovations, and extension state across ownership changes", () => {
    const initialSerializedDocument = serializeReferenceProjectDocument(
      referenceProjectDocumentFixture,
    );
    const storage = createMutableReferenceProjectStorage(initialSerializedDocument);
    const repository = createReferenceProjectRepository({
      storage: storage.storage,
      now: () => "2026-08-03T02:00:00.000Z",
    });
    const sourceMap = repository.openProject("project-alpha").project.maps[1];
    if (sourceMap === undefined) {
      throw new Error("Expected the alpha project to contain a map.");
    }
    const savedMap = applyReferenceOpenMapEdits(
      createReferenceOpenMapSession("project-alpha", sourceMap),
      {
        interiorDecor: {
          wallpapers: { island: "77" },
          floors: { island: "87" },
        },
        renovations: ["kitchen", { id: "cellar", complete: false }],
      },
    );

    updateMapThroughRepository(repository, "project-alpha", savedMap);
    const frozenPatchedDocument = handleReferenceProjectRequest(
      {
        method: "PATCH",
        pathname: "/api/projects/project-alpha/maps/map-island",
        jsonBody: { label: "Frozen Island Label" },
      },
      parseReferenceProjectDocument(storage.readSerializedDocument()),
    ).projectDocument;
    const validatedDocument = validateReferenceProjectDocument(frozenPatchedDocument);

    expect(validatedDocument.projects[1]).toEqual(
      referenceProjectDocumentFixture.projects[1],
    );
    expect(readProjectMap(validatedDocument, "project-alpha", "map-standard")).toEqual(
      referenceProjectDocumentFixture.projects[0]?.project.maps[0],
    );
    expect(readProjectMap(validatedDocument, "project-alpha", "map-island")).toMatchObject({
      state: referenceProjectDocumentFixture.projects[0]?.project.maps[1]?.state,
      thumbnail:
        "/api/projects/project-alpha/maps/map-island/thumbnail",
      decor: {
        wallpapers: { island: "77" },
        floors: { island: "87" },
      },
      renovations: ["kitchen", { id: "cellar", complete: false }],
    });
    expect(readProjectMap(validatedDocument, "project-alpha", "map-island")).toMatchObject({
      label: "Frozen Island Label",
      thumbnail:
        "/api/projects/project-alpha/maps/map-island/thumbnail",
    });
    expect(validatedDocument.projects[0]?.project.maps[0]?.state.buildings).toEqual(
      referenceProjectDocumentFixture.projects[0]?.project.maps[0]?.state.buildings,
    );
    expect(validatedDocument.projects[0]?.project.maps[0]?.state.items).toEqual(
      referenceProjectDocumentFixture.projects[0]?.project.maps[0]?.state.items,
    );
    expect(validatedDocument.projects[0]?.project.maps[0]?.state.nextBuildingId).toBe(13);
    expect(validatedDocument.projects[0]?.project.maps[0]?.state.nextItemId).toBe(10);
  });

  it("keeps duplicate and imported conflict copies internally consistent for frozen and React reads", () => {
    const fixtureWithDistinctThumbnails =
      createFixtureWithDistinctThumbnailPayloads();
    const storage = createMutableReferenceProjectStorage(
      serializeReferenceProjectDocument(fixtureWithDistinctThumbnails),
    );
    const repository = createReferenceProjectRepository({
      storage: storage.storage,
      now: () => "2026-08-03T03:00:00.000Z",
      createIdentifier: createIdentifierSequence([
        "project-duplicate",
        "map-duplicate-standard",
        "map-duplicate-island",
        "project-imported",
        "map-imported-standard",
        "map-imported-island",
      ]),
    });

    repository.duplicateProject("project-alpha");
    repository.importProject(repository.exportProject("project-alpha"));

    const frozenValidatedDocument = validateReferenceProjectDocument(
      parseReferenceProjectDocument(storage.readSerializedDocument()),
    );
    assertProjectIdentityConsistency(frozenValidatedDocument);
    expect(frozenValidatedDocument.projects.map((project) => project.id)).toEqual([
      "project-alpha",
      "project-beta",
      "project-duplicate",
      "project-imported",
    ]);
    expect(
      frozenValidatedDocument.projects[3]?.project.maps.map((projectMap) => projectMap.id),
    ).toEqual(["map-imported-standard", "map-imported-island"]);
    expect(frozenValidatedDocument.projects[2]).toMatchObject({
      id: "project-duplicate",
      project: {
        activeMapId: "map-duplicate-standard",
        maps: [
          { id: "map-duplicate-standard" },
          { id: "map-duplicate-island" },
        ],
      },
      thumbnailsByMapId: {
        "map-duplicate-standard":
          fixtureWithDistinctThumbnails.projects[0]?.thumbnailsByMapId?.[
            "map-standard"
          ],
        "map-duplicate-island":
          fixtureWithDistinctThumbnails.projects[0]?.thumbnailsByMapId?.[
            "map-island"
          ],
      },
    });
    expect(frozenValidatedDocument.projects[3]).toMatchObject({
      id: "project-imported",
      project: {
        activeMapId: "map-imported-standard",
        maps: [
          { id: "map-imported-standard" },
          { id: "map-imported-island" },
        ],
      },
      thumbnailsByMapId: {
        "map-imported-standard":
          fixtureWithDistinctThumbnails.projects[0]?.thumbnailsByMapId?.[
            "map-standard"
          ],
        "map-imported-island":
          fixtureWithDistinctThumbnails.projects[0]?.thumbnailsByMapId?.[
            "map-island"
          ],
      },
    });

    const reopenedRepository = createReferenceProjectRepository({
      storage: createMutableReferenceProjectStorage(
        serializeReferenceProjectDocument(frozenValidatedDocument),
      ).storage,
    });
    for (const projectId of ["project-alpha", "project-duplicate", "project-imported"]) {
      const reopenedProject = reopenedRepository.openProject(projectId);
      expect(reopenedProject.project.maps).toHaveLength(2);
      expect(() =>
        createReferenceOpenMapSession(projectId, reopenedProject.project.maps[1]!),
      ).not.toThrow();
    }
  });

  it("leaves the previous serialized document visible after a storage quota error", () => {
    const initialSerializedDocument = serializeReferenceProjectDocument(
      referenceProjectDocumentFixture,
    );
    const storage = createMutableReferenceProjectStorage(
      initialSerializedDocument,
      new Error("QuotaExceededError: storage limit reached"),
    );
    const repository = createReferenceProjectRepository({
      storage: storage.storage,
      now: () => "2026-08-03T04:00:00.000Z",
    });

    expect(() =>
      repository.renameMap({
        projectId: "project-alpha",
        mapId: "map-standard",
        requestedLabel: "Must Not Partially Persist",
      }),
    ).toThrow("QuotaExceededError: storage limit reached");
    expect(storage.readSerializedDocument()).toBe(initialSerializedDocument);
    expect(repository.openProject("project-alpha").project.maps[0]?.label).toBe(
      "Standard Farm",
    );
  });

  it("rejects frozen-valid object decor that the strict React model cannot represent", () => {
    const repository = createReferenceProjectRepository({
      storage: createMutableReferenceProjectStorage(
        serializeReferenceProjectDocument(referenceProjectDocumentFixture),
      ).storage,
    });
    const frozenStandardMap = readProjectMap(
      { version: 1, projects: [repository.openProject("project-alpha")] },
      "project-alpha",
      "map-standard",
    );

    expect(() =>
      createReferenceOpenMapSession("project-alpha", frozenStandardMap),
    ).toThrow(
      /project-alpha.*map-standard.*decor\.wallpapers\.wall-1.*\{"pattern":"wallpaper_12","x":1,"y":2\}/s,
    );
  });
});
