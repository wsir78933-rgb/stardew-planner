import { describe, expect, it } from "vitest";
import {
  createEmptyReferenceProjectDocument,
  handleReferenceProjectRequest,
  installReferenceLocalProjectApi,
  serializeReferenceProjectDocument,
  type ReferenceLocalProjectDocument,
} from "../../src/reference-runtime/local-project-api";

function createReferenceRequest(
  method: string,
  pathname: string,
  jsonBody?: unknown,
) {
  return { method, pathname, jsonBody };
}

function createProjectDocumentWithMap(): ReferenceLocalProjectDocument {
  return {
    version: 1,
    projects: [
      {
        id: "project-source",
        title: "Source Farm",
        created_at: "2026-07-27T00:00:00.000Z",
        updated_at: "2026-07-27T00:00:00.000Z",
        project: {
          version: 4,
          gameVersion: "1.6.15",
          projectName: "Source Farm",
          season: "spring",
          activeMapId: "map-source",
          maps: [
            {
              id: "map-source",
              mapFile: "Farm.tmx",
              label: "Source Farm",
              season: "spring",
              state: {
                buildings: [],
                crops: [],
                items: [],
                nextBuildingId: 1,
                nextItemId: 1,
              },
              decor: { wallpapers: {}, floors: {} },
              renovations: [],
              thumbnail:
                "/api/projects/project-source/maps/map-source/thumbnail",
            },
          ],
        },
        thumbnailsByMapId: {},
      },
      {
        id: "project-target",
        title: "Target Farm",
        created_at: "2026-07-27T00:00:00.000Z",
        updated_at: "2026-07-27T00:00:00.000Z",
        project: {
          version: 4,
          gameVersion: "1.6.15",
          projectName: "Target Farm",
          season: "summer",
          activeMapId: null,
          maps: [],
        },
        thumbnailsByMapId: {},
      },
    ],
  };
}

function createFrozenClientBuildingSnapshot(instanceId: string) {
  return { instanceId, buildingId: "Barn", x: 3, y: 4 };
}

function createFrozenClientItemSnapshot(instanceId: string) {
  return {
    instanceId,
    itemId: "object_16",
    x: 5,
    y: 6,
    layer: "item",
    rotation: 0,
    footprint: { w: 1, h: 1 },
    variant: 0,
  };
}

function createFrozenClientMapState(stateOverrides: Record<string, unknown> = {}) {
  return {
    buildings: [],
    crops: [],
    items: [],
    nextBuildingId: 1,
    nextItemId: 1,
    ...stateOverrides,
  };
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

describe("reference runtime local project API", () => {
  it("creates a local project without changing an existing project", () => {
    const documentBeforeRequest = createProjectDocumentWithMap();
    const response = handleReferenceProjectRequest(
      createReferenceRequest("POST", "/api/projects", {
        projectName: "Spring Farm",
        season: "spring",
      }),
      documentBeforeRequest,
    );

    expect(response.status).toBe(200);
    expect(response.jsonBody).toMatchObject({ projectId: expect.any(String) });
    expect(documentBeforeRequest.projects).toHaveLength(2);
    expect(response.projectDocument.projects).toHaveLength(3);
    expect(response.projectDocument.projects[0]).toEqual(
      documentBeforeRequest.projects[0],
    );
    expect(response.projectDocument.projects[2]?.title).toBe("Spring Farm");
  });

  it("rejects invalid map state without changing the stored project document", () => {
    const documentBeforeRequest = createProjectDocumentWithMap();
    const serializedBeforeRequest = JSON.stringify(documentBeforeRequest);

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest(
          "PUT",
          "/api/projects/project-source/maps/map-source",
          {
            mapFile: "Farm.tmx",
            label: "Source Farm",
            season: "spring",
            state: "invalid",
            setActive: true,
          },
        ),
        documentBeforeRequest,
      ),
    ).toThrow(
      'Project map state must be a non-null object. Received: "invalid".',
    );
    expect(JSON.stringify(documentBeforeRequest)).toBe(serializedBeforeRequest);
  });

  it("rejects persisted map states that cannot be restored by the frozen client", () => {
    const documentWithMissingStateFields = createProjectDocumentWithMap();
    documentWithMissingStateFields.projects[0]!.project.maps[0]!.state = {};

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest("GET", "/api/projects"),
        documentWithMissingStateFields,
      ),
    ).toThrow("Project map state buildings must be an array. Received: undefined.");

    const documentWithMalformedBuilding = createProjectDocumentWithMap();
    documentWithMalformedBuilding.projects[0]!.project.maps[0]!.state = {
      buildings: [{}],
      crops: [],
      items: [],
      nextBuildingId: 1,
      nextItemId: 1,
    };

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest("GET", "/api/projects"),
        documentWithMalformedBuilding,
      ),
    ).toThrow("Project map state buildings[0].instanceId must be a non-empty string. Received: undefined.");
  });

  it("rejects duplicate building and item instance IDs without mutation", () => {
    const documentWithDuplicateBuildingId = createProjectDocumentWithMap();
    documentWithDuplicateBuildingId.projects[0]!.project.maps[0]!.state =
      createFrozenClientMapState({
        buildings: [
          createFrozenClientBuildingSnapshot("b1"),
          createFrozenClientBuildingSnapshot("b1"),
        ],
        nextBuildingId: 2,
      });
    const serializedDuplicateBuildingDocument = JSON.stringify(
      documentWithDuplicateBuildingId,
    );

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest("GET", "/api/projects"),
        documentWithDuplicateBuildingId,
      ),
    ).toThrow('Project map state buildings contains duplicate instanceId "b1" at index 1.');
    expect(JSON.stringify(documentWithDuplicateBuildingId)).toBe(
      serializedDuplicateBuildingDocument,
    );

    const documentWithDuplicateItemId = createProjectDocumentWithMap();
    documentWithDuplicateItemId.projects[0]!.project.maps[0]!.state =
      createFrozenClientMapState({
        items: [
          createFrozenClientItemSnapshot("i1"),
          createFrozenClientItemSnapshot("i1"),
        ],
        nextItemId: 2,
      });
    const serializedDuplicateItemDocument = JSON.stringify(documentWithDuplicateItemId);

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest("GET", "/api/projects"),
        documentWithDuplicateItemId,
      ),
    ).toThrow('Project map state items contains duplicate instanceId "i1" at index 1.');
    expect(JSON.stringify(documentWithDuplicateItemId)).toBe(
      serializedDuplicateItemDocument,
    );
  });

  it("rejects duplicate crop tiles and stale next identifiers on persisted state", () => {
    const documentWithDuplicateCropTile = createProjectDocumentWithMap();
    documentWithDuplicateCropTile.projects[0]!.project.maps[0]!.state =
      createFrozenClientMapState({
        crops: [
          { cropId: "crop_472", x: 8, y: 9 },
          { cropId: "crop_473", x: 8, y: 9 },
        ],
      });
    const serializedDuplicateCropDocument = JSON.stringify(documentWithDuplicateCropTile);

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest("GET", "/api/projects"),
        documentWithDuplicateCropTile,
      ),
    ).toThrow('Project map state crops contains duplicate tile coordinate "8,9" at index 1.');
    expect(JSON.stringify(documentWithDuplicateCropTile)).toBe(
      serializedDuplicateCropDocument,
    );

    const documentWithStaleNextIdentifiers = createProjectDocumentWithMap();
    documentWithStaleNextIdentifiers.projects[0]!.project.maps[0]!.state =
      createFrozenClientMapState({
        buildings: [createFrozenClientBuildingSnapshot("b2")],
        items: [createFrozenClientItemSnapshot("i3")],
        nextBuildingId: 2,
        nextItemId: 3,
      });
    const serializedStaleIdentifierDocument = JSON.stringify(
      documentWithStaleNextIdentifiers,
    );

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest("GET", "/api/projects"),
        documentWithStaleNextIdentifiers,
      ),
    ).toThrow("Project map state nextBuildingId must exceed existing generated identifier 2. Received: 2.");
    expect(JSON.stringify(documentWithStaleNextIdentifiers)).toBe(
      serializedStaleIdentifierDocument,
    );
  });

  it("rejects semantic map state collisions on PUT without mutation", () => {
    const documentBeforePut = createProjectDocumentWithMap();
    const serializedBeforePut = JSON.stringify(documentBeforePut);

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest(
          "PUT",
          "/api/projects/project-source/maps/map-source",
          {
            mapFile: "Farm.tmx",
            label: "Source Farm",
            season: "spring",
            state: createFrozenClientMapState({
              items: [
                createFrozenClientItemSnapshot("i1"),
                createFrozenClientItemSnapshot("i1"),
              ],
              nextItemId: 2,
            }),
            setActive: true,
          },
        ),
        documentBeforePut,
      ),
    ).toThrow('Project map state items contains duplicate instanceId "i1" at index 1.');
    expect(JSON.stringify(documentBeforePut)).toBe(serializedBeforePut);
  });

  it("duplicates, copies, and moves maps without mutating the source input", () => {
    const sourceDocument = createProjectDocumentWithMap();
    const duplicateResponse = handleReferenceProjectRequest(
      createReferenceRequest(
        "POST",
        "/api/projects/project-source/maps/map-source/duplicate",
      ),
      sourceDocument,
    );
    const duplicateMapId = duplicateResponse.projectDocument.projects[0]?.project.maps[1]
      ?.id;

    expect(duplicateResponse.status).toBe(200);
    expect(duplicateMapId).toEqual(expect.any(String));
    expect(sourceDocument.projects[0]?.project.maps).toHaveLength(1);

    const copyResponse = handleReferenceProjectRequest(
      createReferenceRequest(
        "POST",
        "/api/projects/project-source/maps/map-source/copy",
        { targetProjectId: "project-target" },
      ),
      duplicateResponse.projectDocument,
    );

    expect(copyResponse.status).toBe(200);
    expect(copyResponse.jsonBody).toEqual({ projectTitle: "Target Farm" });
    expect(copyResponse.projectDocument.projects[1]?.project.maps).toHaveLength(1);
    expect(() =>
      serializeReferenceProjectDocument(copyResponse.projectDocument),
    ).not.toThrow();

    const moveResponse = handleReferenceProjectRequest(
      createReferenceRequest(
        "POST",
        "/api/projects/project-source/maps/map-source/move",
        { newProjectName: "Moved Farm" },
      ),
      copyResponse.projectDocument,
    );

    expect(moveResponse.status).toBe(200);
    expect(moveResponse.jsonBody).toEqual({ projectTitle: "Moved Farm" });
    expect(moveResponse.projectDocument.projects[0]?.project.maps).toHaveLength(1);
    expect(moveResponse.projectDocument.projects[2]?.project.maps).toHaveLength(1);
    expect(() =>
      serializeReferenceProjectDocument(moveResponse.projectDocument),
    ).not.toThrow();
  });

  it("preserves active maps when deleting or moving a different map", () => {
    const documentWithFirstDuplicate = handleReferenceProjectRequest(
      createReferenceRequest(
        "POST",
        "/api/projects/project-source/maps/map-source/duplicate",
      ),
      createProjectDocumentWithMap(),
    ).projectDocument;
    const documentWithTwoDuplicates = handleReferenceProjectRequest(
      createReferenceRequest(
        "POST",
        "/api/projects/project-source/maps/map-source/duplicate",
      ),
      documentWithFirstDuplicate,
    ).projectDocument;
    const mapToRemove = documentWithTwoDuplicates.projects[0]?.project.maps[0]?.id;
    const preservedActiveMapId = documentWithTwoDuplicates.projects[0]?.project.maps[2]
      ?.id;

    expect(mapToRemove).toBe("map-source");
    expect(preservedActiveMapId).toEqual(expect.any(String));
    documentWithTwoDuplicates.projects[0]!.project.activeMapId = preservedActiveMapId!;

    const deleteResponse = handleReferenceProjectRequest(
      createReferenceRequest(
        "DELETE",
        `/api/projects/project-source/maps/${mapToRemove}`,
      ),
      documentWithTwoDuplicates,
    );

    expect(deleteResponse.projectDocument.projects[0]?.project.activeMapId).toBe(
      preservedActiveMapId,
    );

    const moveResponse = handleReferenceProjectRequest(
      createReferenceRequest(
        "POST",
        `/api/projects/project-source/maps/${mapToRemove}/move`,
        { targetProjectId: "project-target" },
      ),
      documentWithTwoDuplicates,
    );

    expect(moveResponse.projectDocument.projects[0]?.project.activeMapId).toBe(
      preservedActiveMapId,
    );
    expect(moveResponse.projectDocument.projects[1]?.project.activeMapId).toBe(
      mapToRemove,
    );
  });

  it("rejects map moves to the current project before a duplicate ID is created", () => {
    const projectDocument = createProjectDocumentWithMap();
    const serializedBeforeMove = JSON.stringify(projectDocument);

    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest(
          "POST",
          "/api/projects/project-source/maps/map-source/move",
          { targetProjectId: "project-source" },
        ),
        projectDocument,
      ),
    ).toThrow(
      'Project map move targetProjectId must not equal the source project ID. Received: "project-source".',
    );
    expect(JSON.stringify(projectDocument)).toBe(serializedBeforeMove);
  });

  it("duplicates a maximum-length label into a valid bounded label", () => {
    const documentWithMaximumLabel = createProjectDocumentWithMap();
    const maximumLabel = "x".repeat(100);
    documentWithMaximumLabel.projects[0]!.project.maps[0]!.label = maximumLabel;

    const duplicateResponse = handleReferenceProjectRequest(
      createReferenceRequest(
        "POST",
        "/api/projects/project-source/maps/map-source/duplicate",
      ),
      documentWithMaximumLabel,
    );
    const duplicateLabel = duplicateResponse.projectDocument.projects[0]?.project.maps[1]
      ?.label;

    expect(duplicateLabel).toBe(`${"x".repeat(95)} Copy`);
    expect(duplicateLabel).toHaveLength(100);
    expect(() =>
      serializeReferenceProjectDocument(duplicateResponse.projectDocument),
    ).not.toThrow();
  });

  it("accepts only raw WebP thumbnail uploads and serves them as WebP", () => {
    const documentBeforeRequest = createProjectDocumentWithMap();
    const serializedBeforeRequest = JSON.stringify(documentBeforeRequest);

    expect(() =>
      handleReferenceProjectRequest(
        {
          method: "POST",
          pathname: "/api/projects/project-source/maps/map-source/thumbnail",
          contentType: "image/png",
          binaryBody: new Uint8Array([1, 2, 3]),
        },
        documentBeforeRequest,
      ),
    ).toThrow('Project thumbnail content type must be "image/webp". Received: "image/png".');
    expect(JSON.stringify(documentBeforeRequest)).toBe(serializedBeforeRequest);

    expect(() =>
      handleReferenceProjectRequest(
        {
          method: "POST",
          pathname: "/api/projects/project-source/maps/map-source/thumbnail",
          contentType: "image/webp",
          binaryBody: new Uint8Array([82, 73, 70, 70, 0, 0, 0, 0, 78, 79, 80, 69]),
        },
        documentBeforeRequest,
      ),
    ).toThrow("Project thumbnail bytes must contain a RIFF/WEBP container signature.");
    expect(JSON.stringify(documentBeforeRequest)).toBe(serializedBeforeRequest);

    const minimalWebpContainer = createStructurallyValidWebpBytes();

    const uploadedThumbnailResponse = handleReferenceProjectRequest(
      {
        method: "POST",
        pathname: "/api/projects/project-source/maps/map-source/thumbnail",
        contentType: "image/webp",
        binaryBody: minimalWebpContainer,
      },
      documentBeforeRequest,
    );
    const thumbnailResponse = handleReferenceProjectRequest(
      createReferenceRequest(
        "GET",
        "/api/projects/project-source/maps/map-source/thumbnail",
      ),
      uploadedThumbnailResponse.projectDocument,
    );

    expect(thumbnailResponse.status).toBe(200);
    expect(thumbnailResponse.headers).toEqual({ "content-type": "image/webp" });
    expect(thumbnailResponse.binaryBody).toEqual(minimalWebpContainer);
  });

  it("rejects fake WebP headers without a supported first image chunk", () => {
    const documentBeforeRequest = createProjectDocumentWithMap();
    const serializedBeforeRequest = JSON.stringify(documentBeforeRequest);
    const fakeWebpHeader = new Uint8Array([
      82, 73, 70, 70,
      4, 0, 0, 0,
      87, 69, 66, 80,
    ]);

    expect(() =>
      handleReferenceProjectRequest(
        {
          method: "POST",
          pathname: "/api/projects/project-source/maps/map-source/thumbnail",
          contentType: "image/webp",
          binaryBody: fakeWebpHeader,
        },
        documentBeforeRequest,
      ),
    ).toThrow("Project thumbnail must contain a supported first WebP image chunk. Received byte length: 12.");
    expect(JSON.stringify(documentBeforeRequest)).toBe(serializedBeforeRequest);
  });

  it("rejects WebP RIFF and chunk lengths that do not match the bytes", () => {
    const documentBeforeRequest = createProjectDocumentWithMap();
    const serializedBeforeRequest = JSON.stringify(documentBeforeRequest);
    const invalidRiffLength = new Uint8Array([
      82, 73, 70, 70,
      13, 0, 0, 0,
      87, 69, 66, 80,
      86, 80, 56, 32,
      0, 0, 0, 0,
    ]);
    const invalidChunkLength = new Uint8Array([
      82, 73, 70, 70,
      12, 0, 0, 0,
      87, 69, 66, 80,
      86, 80, 56, 32,
      1, 0, 0, 0,
    ]);

    expect(() =>
      handleReferenceProjectRequest(
        {
          method: "POST",
          pathname: "/api/projects/project-source/maps/map-source/thumbnail",
          contentType: "image/webp",
          binaryBody: invalidRiffLength,
        },
        documentBeforeRequest,
      ),
    ).toThrow("Project thumbnail RIFF declared size must equal byte length minus 8. Received declared size: 13; received byte length: 20.");
    expect(() =>
      handleReferenceProjectRequest(
        {
          method: "POST",
          pathname: "/api/projects/project-source/maps/map-source/thumbnail",
          contentType: "image/webp",
          binaryBody: invalidChunkLength,
        },
        documentBeforeRequest,
      ),
    ).toThrow("Project thumbnail first chunk length exceeds available bytes. Received declared chunk size: 1; received byte length: 20.");
    expect(JSON.stringify(documentBeforeRequest)).toBe(serializedBeforeRequest);
  });

  it("returns the frozen client response shapes and local 404s", () => {
    const projectDocument = createProjectDocumentWithMap();
    const listResponse = handleReferenceProjectRequest(
      createReferenceRequest("GET", "/api/projects"),
      projectDocument,
    );
    const projectResponse = handleReferenceProjectRequest(
      createReferenceRequest("GET", "/api/projects/project-source"),
      projectDocument,
    );
    const sessionResponse = handleReferenceProjectRequest(
      createReferenceRequest("GET", "/api/auth/get-session"),
      projectDocument,
    );
    const premiumResponse = handleReferenceProjectRequest(
      createReferenceRequest("GET", "/api/account/premium"),
      projectDocument,
    );
    const unknownProjectResponse = handleReferenceProjectRequest(
      createReferenceRequest("GET", "/api/projects/unknown-project"),
      projectDocument,
    );
    const excludedResponse = handleReferenceProjectRequest(
      createReferenceRequest("POST", "/api/feedback"),
      projectDocument,
    );

    expect(listResponse.jsonBody).toEqual({
      projects: [
        {
          id: "project-source",
          title: "Source Farm",
          created_at: "2026-07-27T00:00:00.000Z",
          updated_at: "2026-07-27T00:00:00.000Z",
        },
        {
          id: "project-target",
          title: "Target Farm",
          created_at: "2026-07-27T00:00:00.000Z",
          updated_at: "2026-07-27T00:00:00.000Z",
        },
      ],
    });
    expect(projectResponse.jsonBody).toEqual(projectDocument.projects[0]?.project);
    expect(sessionResponse.jsonBody).toMatchObject({ user: { id: "reference-local-user" } });
    expect(premiumResponse.jsonBody).toEqual({ isPremium: true, premiumUntil: null });
    expect(unknownProjectResponse.status).toBe(404);
    expect(excludedResponse.status).toBe(404);
  });

  it("rejects malformed stored documents before any endpoint work", () => {
    expect(() =>
      handleReferenceProjectRequest(
        createReferenceRequest("GET", "/api/projects"),
        { version: 1, projects: "invalid" },
      ),
    ).toThrow('Reference local project document projects must be an array. Received: "invalid".');
  });

  it("creates an empty versioned local project document", () => {
    expect(createEmptyReferenceProjectDocument()).toEqual({ version: 1, projects: [] });
  });

  it("intercepts every local API request without calling the original fetch", async () => {
    const localStorageValuesByKey = new Map<string, string>();
    const originalFetchCalls: Array<readonly [unknown, RequestInit | undefined]> = [];
    const browserWindow = {
      location: { origin: "https://reference-local.test" },
      localStorage: {
        getItem(storageKey: string): string | null {
          return localStorageValuesByKey.get(storageKey) ?? null;
        },
        setItem(storageKey: string, serializedValue: string): void {
          localStorageValuesByKey.set(storageKey, serializedValue);
        },
      },
      fetch: async (input: unknown, init?: RequestInit): Promise<Response> => {
        originalFetchCalls.push([input, init]);
        return new Response("passthrough", { status: 200 });
      },
    };
    const globalObjectWithWindow = globalThis as unknown as {
      window?: typeof browserWindow;
    };
    const originalWindow = globalObjectWithWindow.window;

    globalObjectWithWindow.window = browserWindow;

    try {
      installReferenceLocalProjectApi();
      const fetchAfterFirstInstallation = browserWindow.fetch;
      installReferenceLocalProjectApi();

      expect(browserWindow.fetch).toBe(fetchAfterFirstInstallation);

      const projectResponse = await browserWindow.fetch(
        "https://reference-local.test/api/projects",
      );
      const excludedResponse = await browserWindow.fetch(
        "https://reference-local.test/api/feedback",
        { method: "POST" },
      );
      const assetResponse = await browserWindow.fetch(
        "https://reference-local.test/assets/tilesheets/spring_outdoorsTileSheet.png",
      );

      expect(projectResponse.status).toBe(200);
      expect(await projectResponse.json()).toEqual({ projects: [] });
      expect(excludedResponse.status).toBe(404);
      expect(await excludedResponse.json()).toMatchObject({
        error: "Reference local API route not found.",
      });
      expect(await assetResponse.text()).toBe("passthrough");
      expect(originalFetchCalls).toHaveLength(1);

      localStorageValuesByKey.set(
        "stardewplan-reference-local-projects-v1",
        '{"version":1,"projects":"invalid"}',
      );
      const malformedExcludedResponse = await browserWindow.fetch(
        "https://reference-local.test/api/feedback",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        },
      );

      expect(malformedExcludedResponse.status).toBe(404);
      expect(await malformedExcludedResponse.json()).toMatchObject({
        error: "Reference local API route not found.",
      });
      expect(originalFetchCalls).toHaveLength(1);
    } finally {
      if (originalWindow === undefined) {
        delete globalObjectWithWindow.window;
      } else {
        globalObjectWithWindow.window = originalWindow;
      }
    }
  });
});
