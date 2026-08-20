import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  createInitialEditorPreferences,
  type EditorPreferences,
} from "../../src/editor/browser-editor-preferences";
import {
  createPlannerWorkspaceRenderState,
  persistPlannerWorkspacePreferences,
  PlannerWorkspaceStaticBoundary,
  mergeReadyCatalogItems,
  type PlannerWorkspaceRenderState,
} from "../../src/components/planner-workspace";
import {
  createPlannerWorkspacePreferencePersistence,
} from "../../src/components/planner-workspace-preference-persistence";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
} from "../../src/planner/planner-workspace-state";
import type { PlannerWorkspaceStateController } from "../../src/planner/use-planner-workspace-state";
import type { CatalogItem } from "../../src/catalog";
import { createReferenceProjectRepository } from "../../src/reference-runtime/reference-project-repository";
import type { PreparedPlannerWorkspace } from "../../src/planner/planner-workspace-bootstrap";
import { analyzeRequiredPlacementCatalog } from "../../src/planner/planner-workspace-required-catalog";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import type { PreparedDefaultMap } from "../../src/resources/default-map-resource";
import { referenceProjectDocumentFixture } from "../reference-runtime/fixtures/reference-project-document";

function createPreparedWorkspace(mapId = "standard"): PreparedPlannerWorkspace {
  let serializedProjectDocument = JSON.stringify(referenceProjectDocumentFixture);
  const repository = createReferenceProjectRepository({
    now: () => "2026-08-03T00:00:00.000Z",
    storage: {
      getItem: () => serializedProjectDocument,
      setItem: (_storageKey, nextSerializedProjectDocument) => {
        serializedProjectDocument = nextSerializedProjectDocument;
      },
    },
  });

  return {
    canvasResources: {
      pixi: {} as typeof import("pixi.js"),
      preparedMap: {
        mapId,
        parsedMap: {} as PreparedDefaultMap["parsedMap"],
        renderingContract: {} as PreparedDefaultMap["renderingContract"],
        season: "spring",
      },
      resourceGeneration: 3,
    },
    preferences: createInitialEditorPreferences(),
    projectState: {
      projects: repository.listProjects(),
      repository,
    },
    resourceGeneration: 3,
    buildingsCatalog: { items: [] },
    savePreferences: () => undefined,
  };
}

function renderWorkspace(
  plannerWorkspaceRenderState: PlannerWorkspaceRenderState,
  plannerWorkspaceStateController?: PlannerWorkspaceStateController,
): string {
  return renderToStaticMarkup(
    createElement(PlannerWorkspaceStaticBoundary, {
      plannerWorkspaceRenderState,
      plannerWorkspaceStateController,
    }),
  );
}

function createWorkspaceStateController(
  selectedPlannerMapId: string,
): PlannerWorkspaceStateController {
  const plannerWorkspaceState = reducePlannerWorkspaceState(
    createInitialPlannerWorkspaceState(),
    {
      plannerMapId: selectedPlannerMapId,
      type: "select-map",
    },
  );
  const rejectUnexpectedWorkspaceAction = (): never => {
    throw new Error("Static workspace rendering must not dispatch an action.");
  };

  return {
    applyPlacementEditResult: rejectUnexpectedWorkspaceAction,
    dispatchPlannerWorkspaceAction: rejectUnexpectedWorkspaceAction,
    plannerWorkspaceState,
    resetPlacementHistory: rejectUnexpectedWorkspaceAction,
    setSelectedPlacementKeys: rejectUnexpectedWorkspaceAction,
  };
}

function createCatalogItem(id: string, name: string): CatalogItem {
  return {
    allowedTools: ["cursor"],
    category: "placeable",
    id,
    name,
    sprite: { kind: "sprite-index", index: 0 },
    textureLocalPath: "/game-assets/1.6.15/tilesheets/springobjects.png",
    tileSize: { width: 1, height: 1 },
  };
}

describe("planner workspace static boundary", () => {
  it("turns a current interactive Canvas failure into the outer Retry state", () => {
    const loadingWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      { resourceGeneration: 3, type: "start-runtime-loading" },
    );
    const readyWorkspaceState = reducePlannerWorkspaceState(
      loadingWorkspaceState,
      { resourceGeneration: 3, type: "complete-runtime-ready" },
    );
    const interactiveWorkspaceState = reducePlannerWorkspaceState(
      readyWorkspaceState,
      { resourceGeneration: 3, type: "complete-runtime-interactive" },
    );
    const failedWorkspaceState = reducePlannerWorkspaceState(
      interactiveWorkspaceState,
      {
        message: 'Unable to render mapId "standard". Placement value "broken-floor" is invalid.',
        resourceGeneration: 3,
        type: "complete-runtime-error",
      },
    );
    let retryRequestCount = 0;

    const renderState = createPlannerWorkspaceRenderState({
      onRetry: () => {
        retryRequestCount += 1;
      },
      plannerWorkspaceState: failedWorkspaceState,
      preparedWorkspace: createPreparedWorkspace(),
    });

    expect(renderState.kind).toBe("error");
    if (renderState.kind !== "error") {
      throw new Error(`Expected an error render state; received ${renderState.kind}.`);
    }
    expect(renderState.message).toContain('mapId "standard"');
    expect(renderState.message).toContain('"broken-floor"');
    renderState.onRetry();
    expect(retryRequestCount).toBe(1);
  });

  it("keeps one reserved workspace geometry while startup resources load", () => {
    const loadingMarkup = renderWorkspace({
      kind: "loading",
      message: "Loading local planner resources…",
    });

    expect(loadingMarkup).toContain(
      'class="planner-workspace planner-editor-shell"',
    );
    expect(loadingMarkup).toContain('data-planner-workspace-state="loading"');
    expect(loadingMarkup).toContain(
      'class="planner-workspace__reserved-geometry planner-editor-canvas-area"',
    );
    expect(loadingMarkup).toContain('role="status"');
    expect(loadingMarkup).toContain("Loading local planner resources…");
  });

  it("shows the original startup failure in an alert without accessing storage", () => {
    let storageReadCount = 0;
    const errorMarkup = renderWorkspace({
      kind: "error",
      message: "Reference local project storage contains malformed JSON \"{\".",
      onRetry: () => {
        storageReadCount += 1;
      },
    });

    expect(errorMarkup).toContain(
      'class="planner-workspace planner-editor-shell"',
    );
    expect(errorMarkup).toContain('data-planner-workspace-state="error"');
    expect(errorMarkup).toContain('role="alert"');
    expect(errorMarkup).toContain(
      "Reference local project storage contains malformed JSON &quot;{&quot;.",
    );
    expect(errorMarkup).toContain(">Retry</button>");
    expect(storageReadCount).toBe(0);
  });

  it("renders the prepared shell while the default building catalog loads without mounting Pixi in Node", () => {
    const preparedMarkup = renderWorkspace({
      kind: "prepared",
      preparedWorkspace: createPreparedWorkspace(),
      runtimeStatus: "interactive",
    });

    expect(preparedMarkup).toContain('data-planner-workspace-state="prepared"');
    expect(preparedMarkup).toContain('aria-label="Editor menu"');
    expect(preparedMarkup).toContain('aria-label="Editor tools"');
    expect(preparedMarkup).toContain('aria-label="Item catalog"');
    expect(preparedMarkup).toContain("Loading placed item catalog…");
    expect(preparedMarkup).not.toContain('class="planner-canvas__viewport"');
    expect(preparedMarkup).toContain('placeholder="Search..."');
  });

  it("does not render a separate interior decor panel on supported interior maps", () => {
    const preparedMarkup = renderWorkspace(
      {
        kind: "prepared",
        preparedWorkspace: createPreparedWorkspace("farmhouse-2"),
        runtimeStatus: "interactive",
      },
      createWorkspaceStateController("farmhouse-2"),
    );

    expect(preparedMarkup).not.toContain('aria-label="Interior decor"');
  });

  it("keeps startup status visible through prepared loading and ready states only", () => {
    const preparedWorkspace = createPreparedWorkspace();
    const preparedLoadingMarkup = renderWorkspace({
      kind: "prepared",
      preparedWorkspace,
      runtimeStatus: "loading",
    });
    const preparedReadyMarkup = renderWorkspace({
      kind: "prepared",
      preparedWorkspace,
      runtimeStatus: "ready",
    });
    const preparedInteractiveMarkup = renderWorkspace({
      kind: "prepared",
      preparedWorkspace,
      runtimeStatus: "interactive",
    });

    expect(preparedLoadingMarkup).toContain('class="planner-startup-status"');
    expect(preparedReadyMarkup).toContain('class="planner-startup-status"');
    expect(preparedInteractiveMarkup).not.toContain(
      'class="planner-startup-status"',
    );
  });

  it("merges catalog-ready callback items by exact catalog ID", () => {
    const initiallyReadyCatalogItems = [
      createCatalogItem("object:93", "Old Torch"),
    ];
    const nextReadyCatalogItems = [
      createCatalogItem("object:93", "Torch"),
      createCatalogItem("object:390", "Stone"),
    ];

    expect(
      mergeReadyCatalogItems(
        initiallyReadyCatalogItems,
        nextReadyCatalogItems,
      ),
    ).toEqual(nextReadyCatalogItems);
  });

  it("lets a buildings-only placement use prepared catalog items instead of an empty array", () => {
    const barnCatalogItem = createCatalogItem("building:Barn", "Barn");
    const preparedWorkspace: PreparedPlannerWorkspace = {
      ...createPreparedWorkspace(),
      buildingsCatalog: { items: [barnCatalogItem] },
    };
    const buildingsOnlySnapshot = {
      ...createEmptyPlacementSnapshot(),
      buildings: [{ buildingId: "Barn", instanceId: 1, x: 0, y: 0 }],
      nextBuildingId: 2,
    };

    expect(
      analyzeRequiredPlacementCatalog(buildingsOnlySnapshot, []),
    ).toEqual({
      kind: "missing",
      missingCatalogItems: [
        { category: "buildings", itemId: "building:Barn" },
      ],
    });
    expect(
      analyzeRequiredPlacementCatalog(
        buildingsOnlySnapshot,
        preparedWorkspace.buildingsCatalog.items,
      ),
    ).toEqual({ kind: "ready" });
  });

  it("merges a later prepared buildings catalog into already-ready catalog items", () => {
    const cropCatalogItem = createCatalogItem("crop:24", "Parsnip");
    const barnCatalogItem = createCatalogItem("building:Barn", "Barn");
    const preparedWorkspace: PreparedPlannerWorkspace = {
      ...createPreparedWorkspace(),
      buildingsCatalog: { items: [barnCatalogItem] },
    };

    expect(
      mergeReadyCatalogItems(
        [cropCatalogItem],
        preparedWorkspace.buildingsCatalog.items,
      ),
    ).toEqual([cropCatalogItem, barnCatalogItem]);
  });
});

describe("planner workspace preference persistence", () => {
  it("waits for restored preferences before saving one exact user change", () => {
    const savedPreferences: EditorPreferences[] = [];
    const restoredPreferences: EditorPreferences = {
      behaviorOptions: {
        ...createInitialEditorPreferences().behaviorOptions,
        freePlacement: true,
      },
      displayOptions: {
        ...createInitialEditorPreferences().displayOptions,
        showGrid: true,
      },
    };
    const preferencePersistence = createPlannerWorkspacePreferencePersistence({
      initialPreferences: restoredPreferences,
      savePreferences: (nextPreferences) => {
        savedPreferences.push(structuredClone(nextPreferences));
      },
    });

    preferencePersistence.observePreferences(createInitialEditorPreferences());
    preferencePersistence.observePreferences(restoredPreferences);
    preferencePersistence.observePreferences({
      behaviorOptions: {
        ...restoredPreferences.behaviorOptions,
        leftHandMode: true,
      },
      displayOptions: restoredPreferences.displayOptions,
    });

    expect(savedPreferences).toEqual([
      {
        behaviorOptions: {
          autoShowResourceClumps: true,
          freePlacement: true,
          gameCursors: true,
          leftHandMode: true,
          showJoystick: true,
          showToasts: true,
        },
        displayOptions: {
          showBeeHouseRadius: false,
          showBuildableTiles: false,
          showCropTiles: false,
          showGrid: true,
          showJunimoHutRadius: false,
          showNightMode: false,
          showNpcPaths: false,
          showScarecrowRadius: false,
          showSprinklerRadius: false,
          showTreeTiles: false,
        },
      },
    ]);
  });

  it("turns a preference storage write failure into the existing alert state", () => {
    const restoredPreferences = createInitialEditorPreferences();
    const storageWriteError = new Error(
      'Cannot save editor preferences for key "stardew-planner.editor-preferences.v2": quota exceeded.',
    );
    const preferencePersistence = createPlannerWorkspacePreferencePersistence({
      initialPreferences: restoredPreferences,
      savePreferences: () => {
        throw storageWriteError;
      },
    });
    preferencePersistence.observePreferences(restoredPreferences);
    let plannerWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      { resourceGeneration: 3, type: "start-runtime-loading" },
    );

    persistPlannerWorkspacePreferences({
      dispatchPlannerWorkspaceAction: (plannerWorkspaceAction) => {
        plannerWorkspaceState = reducePlannerWorkspaceState(
          plannerWorkspaceState,
          plannerWorkspaceAction,
        );
      },
      preferencePersistence,
      preferences: {
        behaviorOptions: {
          ...restoredPreferences.behaviorOptions,
          freePlacement: true,
        },
        displayOptions: restoredPreferences.displayOptions,
      },
      resourceGeneration: 3,
    });
    const errorRenderState = createPlannerWorkspaceRenderState({
      onRetry: () => undefined,
      plannerWorkspaceState,
      preparedWorkspace: createPreparedWorkspace(),
    });

    expect(errorRenderState.kind).toBe("error");
    if (errorRenderState.kind !== "error") {
      throw new Error(
        `Expected preference persistence to produce an error render state; received ${errorRenderState.kind}.`,
      );
    }
    expect(errorRenderState.message).toBe(storageWriteError.message);
    expect(renderWorkspace(errorRenderState)).toContain('role="alert"');
  });
});
