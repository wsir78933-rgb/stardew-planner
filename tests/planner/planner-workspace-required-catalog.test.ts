import { describe, expect, it } from "vitest";
import type { Catalog, CatalogItem } from "../../src/catalog";
import {
  analyzeRequiredPlacementCatalog,
  getRequiredPlacementCatalogCategories,
  getNextRequiredPlacementCatalogRetryAttempt,
  performSelectedAppearanceCycleWhenCatalogReady,
  resolveRequiredPlacementCatalogSnapshot,
  startRequiredPlacementCatalogLoad,
} from "../../src/planner/planner-workspace-required-catalog";
import {
  createEmptyPlacementSnapshot,
  type PlacementItem,
  type PlacementSnapshot,
} from "../../src/placement/placement-snapshot";
import type { ReferenceOpenMapSession } from "../../src/reference-runtime/reference-project-editor-adapter";

function createCatalogItem(itemId: string): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: itemId.startsWith("building:")
      ? "building"
      : itemId.startsWith("crop:")
        ? "crop"
        : "placeable",
    id: itemId,
    name: itemId,
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/test.png",
    tileSize: { width: 1, height: 1 },
  };
}

function createPlacementItem(
  itemId: string,
  instanceId = 1,
): PlacementItem {
  return {
    bedType: null,
    flipped: false,
    footprint: { width: 1, height: 1 },
    instanceId,
    isGrass: false,
    isLongTable: false,
    isRug: false,
    isTable: false,
    itemId,
    layer: "item",
    locked: false,
    rotation: 0,
    tintColor: "#ffffff",
    variant: 0,
    x: instanceId,
    y: instanceId,
  };
}

function createMixedPlacementSnapshot(): PlacementSnapshot {
  return {
    ...createEmptyPlacementSnapshot(),
    buildings: [
      { buildingId: "Barn", instanceId: 1, x: 0, y: 0 },
      { buildingId: "Barn", instanceId: 2, x: 4, y: 4 },
    ],
    crops: [
      { cropId: "crop:24", x: 1, y: 1 },
      { cropId: "crop:24", x: 2, y: 2 },
    ],
    items: [
      createPlacementItem("object:390", 1),
      createPlacementItem("object:390", 2),
    ],
    nextBuildingId: 3,
    nextItemId: 3,
  };
}

function createReferenceOpenMapSession(
  projectId: string,
  mapId: string,
  mapFile: string,
  placementSnapshot: PlacementSnapshot,
): ReferenceOpenMapSession {
  return {
    projectId,
    mapId,
    sourceMap: { id: mapId, mapFile },
    placementSnapshot,
  } as unknown as ReferenceOpenMapSession;
}

function createDeferred<Value>() {
  let resolvePromise: (value: Value) => void = () => undefined;
  let rejectPromise: (reason: unknown) => void = () => undefined;
  const promise = new Promise<Value>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  return { promise, reject: rejectPromise, resolve: resolvePromise };
}

describe("planner workspace required catalog", () => {
  it("uses the new active session snapshot on the first A-to-B session render", () => {
    const currentHistorySnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem("object:old")],
      nextItemId: 2,
    };
    const activeSessionSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem("object:new")],
      nextItemId: 2,
    };

    expect(
      resolveRequiredPlacementCatalogSnapshot({
        activeSession: createReferenceOpenMapSession(
          "project:b",
          "map:b",
          "Forest.tmx",
          activeSessionSnapshot,
        ),
        currentPlacementSnapshot: currentHistorySnapshot,
        getPlannerMapIdForMapFile: () => "forest-farm",
        plannerWorkspaceCanonicalIdentity: {
          activeMapId: "map:a",
          activeProjectId: "project:a",
          selectedPlannerMapId: "standard-farm",
        },
      }),
    ).toBe(activeSessionSnapshot);
  });

  it("preserves unsaved history for the matching canonical session identity", () => {
    const currentUnsavedHistorySnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem("object:unsaved")],
      nextItemId: 2,
    };
    const activeSessionSnapshot = createEmptyPlacementSnapshot();

    expect(
      resolveRequiredPlacementCatalogSnapshot({
        activeSession: createReferenceOpenMapSession(
          "project:a",
          "map:a",
          "Farm.tmx",
          activeSessionSnapshot,
        ),
        currentPlacementSnapshot: currentUnsavedHistorySnapshot,
        getPlannerMapIdForMapFile: () => "standard-farm",
        plannerWorkspaceCanonicalIdentity: {
          activeMapId: "map:a",
          activeProjectId: "project:a",
          selectedPlannerMapId: "standard-farm",
        },
      }),
    ).toBe(currentUnsavedHistorySnapshot);
  });

  it("uses current history without a canonical session or map lookup", () => {
    const currentHistorySnapshot = createMixedPlacementSnapshot();
    let mapLookupCount = 0;

    expect(
      resolveRequiredPlacementCatalogSnapshot({
        activeSession: null,
        currentPlacementSnapshot: currentHistorySnapshot,
        getPlannerMapIdForMapFile: () => {
          mapLookupCount += 1;
          return "standard-farm";
        },
        plannerWorkspaceCanonicalIdentity: {
          activeMapId: null,
          activeProjectId: null,
          selectedPlannerMapId: "standard-farm",
        },
      }),
    ).toBe(currentHistorySnapshot);
    expect(mapLookupCount).toBe(0);
  });

  it("derives stable unique panel categories from the current placement snapshot", () => {
    expect(getRequiredPlacementCatalogCategories(
      createMixedPlacementSnapshot(),
    )).toEqual(["buildings", "crops", "placeables"]);
    expect(getRequiredPlacementCatalogCategories({
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem("object:390")],
      nextItemId: 2,
    })).toEqual(["placeables"]);
    expect(getRequiredPlacementCatalogCategories(
      createEmptyPlacementSnapshot(),
    )).toEqual([]);
  });

  it("keeps a crop-only snapshot independent from the placeables catalog used by dirt rendering", () => {
    const cropOnlySnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [{ cropId: "crop:24", x: 1, y: 1 }],
    };

    expect(getRequiredPlacementCatalogCategories(cropOnlySnapshot)).toEqual([
      "crops",
    ]);
    expect(analyzeRequiredPlacementCatalog(cropOnlySnapshot, [
      createCatalogItem("crop:24"),
    ])).toEqual({ kind: "ready" });
  });

  it("loads a persisted giant crop item from the crops catalog on fresh reopen", async () => {
    const giantCropItemId = "crop:giant_Cauliflower";
    const freshReopenSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [{
        ...createPlacementItem(giantCropItemId),
        footprint: { width: 3, height: 3 },
      }],
      nextItemId: 2,
    };
    const requirement = analyzeRequiredPlacementCatalog(
      freshReopenSnapshot,
      [],
    );

    expect(getRequiredPlacementCatalogCategories(freshReopenSnapshot)).toEqual([
      "crops",
    ]);
    expect(requirement).toEqual({
      kind: "missing",
      missingCatalogItems: [{ category: "crops", itemId: giantCropItemId }],
    });
    if (requirement.kind !== "missing") {
      throw new Error(`Expected missing giant crop requirement; received ${requirement.kind}.`);
    }

    const requestedCategories: string[] = [];
    const loadedCatalogItemBatches: CatalogItem[][] = [];
    const catalogLoad = startRequiredPlacementCatalogLoad({
      loadCategory: async (category) => {
        requestedCategories.push(category);
        return { items: [createCatalogItem(giantCropItemId)] };
      },
      missingCatalogItems: requirement.missingCatalogItems,
      onCatalogItemsLoaded: (catalogItems) => {
        loadedCatalogItemBatches.push([...catalogItems]);
      },
      onError: (catalogError) => {
        throw catalogError;
      },
    });
    await catalogLoad.completion;

    expect(requestedCategories).toEqual(["crops"]);
    expect(loadedCatalogItemBatches).toEqual([
      [expect.objectContaining({ id: giantCropItemId })],
    ]);
    expect(analyzeRequiredPlacementCatalog(freshReopenSnapshot, [
      ...loadedCatalogItemBatches.flat(),
    ])).toEqual({ kind: "ready" });
  });

  it("requires one exact catalog match per unique placed catalog item ID", () => {
    const placementSnapshot = createMixedPlacementSnapshot();
    const missingAnalysis = analyzeRequiredPlacementCatalog(
      placementSnapshot,
      [],
    );

    expect(missingAnalysis).toEqual({
      kind: "missing",
      missingCatalogItems: [
        { category: "buildings", itemId: "building:Barn" },
        { category: "crops", itemId: "crop:24" },
        { category: "placeables", itemId: "object:390" },
      ],
    });
    expect(analyzeRequiredPlacementCatalog(placementSnapshot, [
      createCatalogItem("building:Barn"),
      createCatalogItem("crop:24"),
      createCatalogItem("object:390"),
    ])).toEqual({ kind: "ready" });
  });

  it("fails fast with category and received count for duplicate ready IDs", () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem("object:390")],
      nextItemId: 2,
    };

    expect(analyzeRequiredPlacementCatalog(placementSnapshot, [
      createCatalogItem("object:390"),
      createCatalogItem("object:390"),
    ])).toEqual({
      kind: "error",
      message:
        'Required planner catalog category "placeables" item ID "object:390" must have exactly one match; received 2 matches.',
    });
  });

  it("loads only the one missing placeables category for an items-only snapshot", async () => {
    const placementSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [createPlacementItem("object:390")],
      nextItemId: 2,
    };
    const alreadyLoadedCatalogItems = [createCatalogItem("building:Barn")];
    const requirement = analyzeRequiredPlacementCatalog(
      placementSnapshot,
      alreadyLoadedCatalogItems,
    );
    if (requirement.kind !== "missing") {
      throw new Error(
        `Expected missing catalog items; received ${requirement.kind}.`,
      );
    }
    const requestedCategories: string[] = [];
    const receivedCatalogItems: CatalogItem[][] = [];
    const receivedErrors: Error[] = [];

    const catalogLoad = startRequiredPlacementCatalogLoad({
      loadCategory: async (category) => {
        requestedCategories.push(category);
        return { items: [createCatalogItem("object:390")] };
      },
      missingCatalogItems: requirement.missingCatalogItems,
      onCatalogItemsLoaded: (catalogItems) => {
        receivedCatalogItems.push([...catalogItems]);
      },
      onError: (catalogError) => receivedErrors.push(catalogError),
    });
    await catalogLoad.completion;

    expect(requestedCategories).toEqual(["placeables"]);
    expect(receivedCatalogItems).toEqual([
      [expect.objectContaining({ id: "object:390" })],
    ]);
    expect(receivedErrors).toEqual([]);
    expect(
      analyzeRequiredPlacementCatalog(placementSnapshot, [
        ...alreadyLoadedCatalogItems,
        ...receivedCatalogItems.flat(),
      ]),
    ).toEqual({ kind: "ready" });
  });

  it("makes an empty requirement ready without making a category request", async () => {
    const requestedCategories: string[] = [];
    const catalogLoad = startRequiredPlacementCatalogLoad({
      loadCategory: async (category) => {
        requestedCategories.push(category);
        return { items: [] };
      },
      missingCatalogItems: [],
      onCatalogItemsLoaded: () => undefined,
      onError: () => undefined,
    });

    await catalogLoad.completion;

    expect(requestedCategories).toEqual([]);
  });

  it("ignores stale category resolution and rejection after cancellation", async () => {
    const staleResolution = createDeferred<Catalog>();
    const staleRejection = createDeferred<Catalog>();
    const receivedEvents: string[] = [];
    const missingCatalogItems = [
      { category: "placeables", itemId: "object:390" },
    ] as const;
    const resolvingLoad = startRequiredPlacementCatalogLoad({
      loadCategory: () => staleResolution.promise,
      missingCatalogItems,
      onCatalogItemsLoaded: () => receivedEvents.push("resolved"),
      onError: () => receivedEvents.push("resolution-error"),
    });
    const rejectingLoad = startRequiredPlacementCatalogLoad({
      loadCategory: () => staleRejection.promise,
      missingCatalogItems,
      onCatalogItemsLoaded: () => receivedEvents.push("rejected"),
      onError: () => receivedEvents.push("rejection-error"),
    });

    resolvingLoad.cancel();
    rejectingLoad.cancel();
    staleResolution.resolve({ items: [createCatalogItem("object:390")] });
    staleRejection.reject(new Error("stale load failed"));
    await Promise.all([resolvingLoad.completion, rejectingLoad.completion]);

    expect(receivedEvents).toEqual([]);
  });

  it("reports current load, missing ID, and duplicate ID failures without swallowing them", async () => {
    const failureCases = [
      {
        catalog: Promise.reject(new Error("network offline")),
        expectedCanRetry: true,
        expectedMessage:
          'Required planner catalog category "placeables" failed to load: network offline',
      },
      {
        catalog: Promise.resolve({ items: [] }),
        expectedCanRetry: false,
        expectedMessage:
          'Required planner catalog category "placeables" item ID "object:390" must have exactly one match; received 0 matches.',
      },
      {
        catalog: Promise.resolve({
          items: [
            createCatalogItem("object:390"),
            createCatalogItem("object:390"),
          ],
        }),
        expectedCanRetry: false,
        expectedMessage:
          'Required planner catalog category "placeables" item ID "object:390" must have exactly one match; received 2 matches.',
      },
    ] as const;

    for (const failureCase of failureCases) {
      const receivedErrors: Error[] = [];
      const receivedRetryableStates: boolean[] = [];
      const catalogLoad = startRequiredPlacementCatalogLoad({
        loadCategory: () => failureCase.catalog,
        missingCatalogItems: [
          { category: "placeables", itemId: "object:390" },
        ],
        onCatalogItemsLoaded: () => undefined,
        onError: (catalogError, canRetry) => {
          receivedErrors.push(catalogError);
          receivedRetryableStates.push(canRetry);
        },
      });

      await catalogLoad.completion;

      expect(receivedErrors).toHaveLength(1);
      expect(receivedErrors[0]?.message).toBe(failureCase.expectedMessage);
      expect(receivedRetryableStates).toEqual([failureCase.expectedCanRetry]);
    }
  });

  it("guards selected appearance work until the required catalog is ready", () => {
    const receivedActions: string[] = [];

    expect(performSelectedAppearanceCycleWhenCatalogReady(
      false,
      () => receivedActions.push("cycle"),
    )).toBe(false);
    expect(receivedActions).toEqual([]);
    expect(performSelectedAppearanceCycleWhenCatalogReady(
      true,
      () => receivedActions.push("cycle"),
    )).toBe(true);
    expect(receivedActions).toEqual(["cycle"]);
  });

  it("fails fast before the retry counter exceeds the safe integer boundary", () => {
    expect(getNextRequiredPlacementCatalogRetryAttempt(7)).toBe(8);
    expect(() => getNextRequiredPlacementCatalogRetryAttempt(
      Number.MAX_SAFE_INTEGER,
    )).toThrow(
      `Required planner catalog retry attempt cannot exceed ${String(Number.MAX_SAFE_INTEGER)}; received ${String(Number.MAX_SAFE_INTEGER)}.`,
    );
  });
});
