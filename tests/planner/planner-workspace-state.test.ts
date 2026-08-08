import { describe, expect, it } from "vitest";
import {
  createInitialPlannerWorkspaceState,
  reducePlannerWorkspaceState,
  type PlannerWorkspaceAction,
} from "../../src/planner/planner-workspace-state";
import { createInitialEditorPreferences } from "../../src/editor/browser-editor-preferences";
import { createInitialMapRenderOptions } from "../../src/maps/map-render-options";
import {
  commitPlacementHistory,
  redoPlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
import {
  applyPlacementSnapshotAction,
  createEmptyPlacementSnapshot,
} from "../../src/placement/placement-snapshot";

const frozenInitialFarmBuildingsByPlannerMapId = [
  ["standard", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["riverland", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["forest", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["hilltop", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["wilderness", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["four-corners", [["Farmhouse", 59, 12], ["Greenhouse", 36, 29], ["Shipping Bin", 71, 14], ["Pet Bowl", 49, 40]]],
  ["beach", [["Farmhouse", 59, 12], ["Greenhouse", 14, 14], ["Shipping Bin", 71, 14], ["Pet Bowl", 78, 21]]],
  ["meadowlands", [["Farmhouse", 76, 16], ["Greenhouse", 37, 19], ["Shipping Bin", 88, 18], ["Pet Bowl", 91, 14]]],
  ["ginger-island", []],
  ["if2r", [["Farmhouse", 59, 12], ["Greenhouse", 41, 45], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["frontier", [["Farmhouse", 113, 23], ["Greenhouse", 87, 4], ["Shipping Bin", 130, 26], ["Pet Bowl", 120, 15]]],
  ["grandpas", [["Farmhouse", 90, 46], ["Greenhouse", 18, 52], ["Shipping Bin", 107, 49], ["Pet Bowl", 102, 38]]],
  ["capitalist-dream", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["capitalist-dream-2", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["overgrown-garden", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["yet-another", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["solo-four-corners", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 12], ["Pet Bowl", 48, 40]]],
  ["strawberry-fields", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
  ["blackberry-fields", [["Farmhouse", 71, 8], ["Greenhouse", 95, 16], ["Shipping Bin", 84, 12], ["Pet Bowl", 82, 7]]],
  ["zenith", [["Farmhouse", 39, 14], ["Greenhouse", 64, 26], ["Shipping Bin", 55, 19], ["Pet Bowl", 51, 17]]],
  ["everfarm", [["Farmhouse", 178, 4], ["Greenhouse", 169, 3], ["Shipping Bin", 193, 8], ["Pet Bowl", 194, 17]]],
  ["sea-breeze-island", [["Farmhouse", 48, 15], ["Greenhouse", 14, 46], ["Shipping Bin", 60, 18], ["Pet Bowl", 54, 36]]],
  ["aimon-s-small-hilltop", [["Farmhouse", 39, 6], ["Greenhouse", 14, 13], ["Shipping Bin", 53, 25], ["Pet Bowl", 32, 11]]],
  ["aimon-s-small-forest", [["Farmhouse", 55, 12], ["Greenhouse", 11, 2], ["Shipping Bin", 66, 15], ["Pet Bowl", 45, 5]]],
  ["more-lively-meadowlands", [["Farmhouse", 76, 16], ["Greenhouse", 37, 19], ["Shipping Bin", 88, 18], ["Pet Bowl", 91, 14]]],
  ["modest-maps-standard", [["Farmhouse", 61, 12], ["Greenhouse", 19, 7], ["Shipping Bin", 73, 14], ["Pet Bowl", 76, 19]]],
  ["waterfall-forest", [["Farmhouse", 59, 12], ["Greenhouse", 25, 10], ["Shipping Bin", 71, 14], ["Pet Bowl", 53, 7]]],
] as const;

describe("planner workspace state", () => {
  it("cycles seasons through the workspace state boundary without opening a modal", () => {
    let workspaceState = createInitialPlannerWorkspaceState();

    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "cycle-season",
    });
    expect(workspaceState).toMatchObject({ season: "summer", modalId: null });

    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "cycle-season",
    });
    expect(workspaceState).toMatchObject({ season: "fall", modalId: null });

    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "cycle-season",
    });
    expect(workspaceState).toMatchObject({ season: "winter", modalId: null });

    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "cycle-season",
    });
    expect(workspaceState).toMatchObject({ season: "spring", modalId: null });
  });

  it("uses every frozen Wl default building composition with deterministic IDs", () => {
    for (const [plannerMapId, expectedBuildings] of frozenInitialFarmBuildingsByPlannerMapId) {
      const initialPlacementSnapshot = createInitialPlannerWorkspaceState(
        plannerMapId,
      ).placementHistory.currentState;

      expect(
        initialPlacementSnapshot.buildings.map(({ buildingId, x, y }) => [
          buildingId,
          x,
          y,
        ]),
      ).toEqual(expectedBuildings);
      expect(initialPlacementSnapshot.buildings.map(({ instanceId }) => instanceId)).toEqual(
        expectedBuildings.length === 0 ? [] : [1, 2, 3, 4],
      );
      expect(initialPlacementSnapshot).toMatchObject({
        crops: [],
        items: [],
        nextBuildingId: expectedBuildings.length === 0 ? 1 : 5,
        nextItemId: 1,
      });
    }
  });

  it("starts a non-farm planner map without injected placements", () => {
    expect(
      createInitialPlannerWorkspaceState("farmhouse-0").placementHistory.currentState,
    ).toEqual(createEmptyPlacementSnapshot());
  });

  it("preserves same-map edits and resets a different map to its frozen composition", () => {
    const initialWorkspaceState = createInitialPlannerWorkspaceState("standard");
    const editedPlacementSnapshot = applyPlacementSnapshotAction(
      initialWorkspaceState.placementHistory.currentState,
      { type: "add-crop", crop: { cropId: "parsnip", x: 2, y: 3 } },
    );
    const editedWorkspaceState = {
      ...initialWorkspaceState,
      placementHistory: commitPlacementHistory(
        initialWorkspaceState.placementHistory,
        editedPlacementSnapshot,
      ),
      selectedPlacementKeys: ["crop:2:3"] as const,
    };

    const sameMapWorkspaceState = reducePlannerWorkspaceState(
      editedWorkspaceState,
      { type: "select-map", plannerMapId: "standard" },
    );
    const differentMapWorkspaceState = reducePlannerWorkspaceState(
      editedWorkspaceState,
      { type: "select-map", plannerMapId: "four-corners" },
    );

    expect(sameMapWorkspaceState.placementHistory.currentState).toEqual(
      editedPlacementSnapshot,
    );
    expect(differentMapWorkspaceState.placementHistory).toEqual({
      currentState: {
        buildings: [
          { buildingId: "Farmhouse", instanceId: 1, x: 59, y: 12 },
          { buildingId: "Greenhouse", instanceId: 2, x: 36, y: 29 },
          { buildingId: "Shipping Bin", instanceId: 3, x: 71, y: 14 },
          { buildingId: "Pet Bowl", instanceId: 4, x: 49, y: 40 },
        ],
        crops: [],
        items: [],
        nextBuildingId: 5,
        nextItemId: 1,
      },
      redoStates: [],
      undoStates: [],
    });
    expect(differentMapWorkspaceState.selectedPlacementKeys).toEqual([]);
  });

  it("preserves the complete placement history when selecting the current map", () => {
    const initialWorkspaceState = createInitialPlannerWorkspaceState("standard");
    const editedPlacementSnapshot = applyPlacementSnapshotAction(
      initialWorkspaceState.placementHistory.currentState,
      { type: "add-crop", crop: { cropId: "parsnip", x: 2, y: 3 } },
    );
    const placementHistoryWithRedo = undoPlacementHistory(
      commitPlacementHistory(
        initialWorkspaceState.placementHistory,
        editedPlacementSnapshot,
      ),
    );
    const workspaceStateWithRedo = {
      ...initialWorkspaceState,
      placementHistory: placementHistoryWithRedo,
      selectedPlacementKeys: ["crop:2:3"] as const,
    };

    const sameMapWorkspaceState = reducePlannerWorkspaceState(
      workspaceStateWithRedo,
      {
        type: "select-map",
        plannerMapId: "standard",
      },
    );

    expect(sameMapWorkspaceState.placementHistory).toBe(placementHistoryWithRedo);
    expect(sameMapWorkspaceState.placementHistory).toEqual(
      placementHistoryWithRedo,
    );
  });

  it("uses the initial viewport width for the catalog position", () => {
    expect(
      createInitialPlannerWorkspaceState("standard", 640).panelPosition,
    ).toBe("bottom");
    expect(
      createInitialPlannerWorkspaceState("standard", 641).panelPosition,
    ).toBe("left");
    expect(createInitialPlannerWorkspaceState().panelPosition).toBe("left");
  });

  it("restores prepared display and behavior preferences in one reducer transition", () => {
    const preparedPreferences = {
      ...createInitialEditorPreferences(),
      behaviorOptions: {
        ...createInitialEditorPreferences().behaviorOptions,
        freePlacement: true,
        showJoystick: false,
      },
      displayOptions: {
        ...createInitialEditorPreferences().displayOptions,
        showGrid: true,
        showNightMode: true,
      },
    };

    const restoredWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        preferences: preparedPreferences,
        type: "restore-prepared-preferences",
      } as unknown as PlannerWorkspaceAction,
    );

    expect(restoredWorkspaceState.behaviorOptions).toEqual(
      preparedPreferences.behaviorOptions,
    );
    expect(restoredWorkspaceState.displayOptions).toEqual(
      preparedPreferences.displayOptions,
    );
  });

  it("fails fast when prepared preferences contain a non-boolean behavior value", () => {
    const invalidPreparedPreferences = {
      ...createInitialEditorPreferences(),
      behaviorOptions: {
        ...createInitialEditorPreferences().behaviorOptions,
        freePlacement: "enabled",
      },
    };

    expect(() =>
      reducePlannerWorkspaceState(createInitialPlannerWorkspaceState(), {
        preferences: invalidPreparedPreferences,
        type: "restore-prepared-preferences",
      } as unknown as PlannerWorkspaceAction),
    ).toThrow(
      'Editor behavior option freePlacement must be set to a boolean; received "enabled".',
    );
  });

  it("fails fast when prepared preferences contain a non-boolean display value", () => {
    const invalidPreparedPreferences = {
      ...createInitialEditorPreferences(),
      displayOptions: {
        ...createInitialEditorPreferences().displayOptions,
        showGrid: "visible",
      },
    };

    expect(() =>
      reducePlannerWorkspaceState(createInitialPlannerWorkspaceState(), {
        preferences: invalidPreparedPreferences,
        type: "restore-prepared-preferences",
      } as unknown as PlannerWorkspaceAction),
    ).toThrow(
      'Planner workspace prepared display option showGrid must be a boolean; received "visible".',
    );
  });

  it("delegates editor, menu, display, behavior, and render transitions", () => {
    let workspaceState = createInitialPlannerWorkspaceState();

    expect(workspaceState).toMatchObject({
      activeMapId: null,
      activeProjectId: null,
      catalogCategory: "buildings",
      editorMenuVisibility: "expanded",
      modalId: null,
      panelPosition: "left",
      runtimeState: { resourceGeneration: 0, status: "loading" },
      season: "spring",
      selectedPlannerMapId: "standard",
      tool: "cursor",
    });

    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "select-map",
      plannerMapId: "forest",
    } as unknown as PlannerWorkspaceAction);
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "select-season",
      season: "winter",
    });
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "select-tool",
      tool: "erase",
    });
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "select-catalog-category",
      catalogCategory: "decor",
    });
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "select-panel-position",
      panelPosition: "left",
    });
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "toggle-menu",
    });
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "open-modal",
      modalId: "settings-panel",
    });
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "toggle-display-option",
      option: "showGrid",
    });
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "set-behavior-option",
      option: "freePlacement",
      value: true,
    });

    const nextMapRenderOptions = {
      ...createInitialMapRenderOptions(),
      gingerIslandOverlayIds: ["bin"] as const,
    };
    workspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "set-map-render-options",
      mapRenderOptions: nextMapRenderOptions,
    });

    expect(workspaceState).toMatchObject({
      behaviorOptions: { freePlacement: true },
      catalogCategory: "decor",
      displayOptions: { showGrid: true },
      editorMenuVisibility: "collapsed",
      mapRenderOptions: { gingerIslandOverlayIds: ["bin"] },
      modalId: "settings-panel",
      panelPosition: "left",
      season: "winter",
      selectedPlannerMapId: "forest",
      tool: "erase",
    });
  });

  it("rejects unsupported actions with the received action", () => {
    expect(() =>
      reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState(),
        { type: "unrecognized", received: 17 } as unknown as PlannerWorkspaceAction,
      ),
    ).toThrow('Planner workspace action is unsupported: {"type":"unrecognized","received":17}.');
  });

  it("rejects invalid map render options through the render-options boundary", () => {
    expect(() =>
      reducePlannerWorkspaceState(createInitialPlannerWorkspaceState(), {
        type: "set-map-render-options",
        mapRenderOptions: {
          ...createInitialMapRenderOptions(),
          gingerIslandOverlayIds: ["not-an-overlay"],
        } as unknown as ReturnType<typeof createInitialMapRenderOptions>,
      }),
    ).toThrow(
      'Map render options.gingerIslandOverlayIds must be one of restored, bin, cave, obelisk; received "not-an-overlay".',
    );
  });

  it("opens a canonical map atomically with the verified planner identity and reset placement state", () => {
    const placementSnapshot = applyPlacementSnapshotAction(
      createEmptyPlacementSnapshot(),
      { type: "add-crop", crop: { cropId: "parsnip", x: 2, y: 3 } },
    );
    const workspaceState = {
      ...createInitialPlannerWorkspaceState(),
      placementHistory: commitPlacementHistory(
        createInitialPlannerWorkspaceState().placementHistory,
        placementSnapshot,
      ),
      selectedPlacementKeys: ["crop:2:3"],
    };

    const openedWorkspaceState = reducePlannerWorkspaceState(
      workspaceState,
      {
        type: "open-canonical-map",
        activeMapId: "map-instance-8",
        activeProjectId: "project-3",
        placementSnapshot,
        plannerMapId: "forest",
        season: "summer",
      } as unknown as PlannerWorkspaceAction,
    );

    expect(openedWorkspaceState).toMatchObject({
      activeMapId: "map-instance-8",
      activeProjectId: "project-3",
      season: "summer",
      selectedPlacementKeys: [],
      selectedPlannerMapId: "forest",
    });
    expect(openedWorkspaceState.placementHistory).toEqual({
      currentState: placementSnapshot,
      redoStates: [],
      undoStates: [],
    });
  });

  it("opens an unsaved imported map atomically without retaining canonical identity or redo history", () => {
    const placementSnapshot = applyPlacementSnapshotAction(
      createEmptyPlacementSnapshot(),
      { type: "add-crop", crop: { cropId: "parsnip", x: 2, y: 3 } },
    );
    const placementHistoryWithRedo = undoPlacementHistory(
      commitPlacementHistory(
        createInitialPlannerWorkspaceState().placementHistory,
        placementSnapshot,
      ),
    );
    const workspaceState = {
      ...createInitialPlannerWorkspaceState(),
      activeMapId: "canonical-map",
      activeProjectId: "canonical-project",
      placementHistory: placementHistoryWithRedo,
      selectedCatalogItemId: "wood-floor",
      selectedPlacementKeys: ["crop:2:3"],
    };

    const importedWorkspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "open-unsaved-imported-map",
      placementSnapshot,
      plannerMapId: "forest",
      season: "winter",
    } as unknown as PlannerWorkspaceAction);

    expect(importedWorkspaceState).toMatchObject({
      activeMapId: null,
      activeProjectId: null,
      season: "winter",
      selectedCatalogItemId: null,
      selectedPlacementKeys: [],
      selectedPlannerMapId: "forest",
    });
    expect(importedWorkspaceState.placementHistory).toEqual({
      currentState: placementSnapshot,
      redoStates: [],
      undoStates: [],
    });
  });

  it("fails fast for an invalid unsaved imported map input", () => {
    expect(() =>
      reducePlannerWorkspaceState(createInitialPlannerWorkspaceState(), {
        type: "open-unsaved-imported-map",
        placementSnapshot: createEmptyPlacementSnapshot(),
        plannerMapId: "unknown-map",
        season: "winter",
      } as unknown as PlannerWorkspaceAction),
    ).toThrow("Unknown planner map id: unknown-map");
  });

  it("rejects incomplete canonical identities with received values", () => {
    expect(() =>
      reducePlannerWorkspaceState(
        createInitialPlannerWorkspaceState(),
        {
          type: "open-canonical-map",
          activeMapId: "",
          activeProjectId: "project-3",
          placementSnapshot: createEmptyPlacementSnapshot(),
          plannerMapId: "forest",
          season: "summer",
        } as unknown as PlannerWorkspaceAction,
      ),
    ).toThrow('Canonical map identity activeMapId must be a non-empty string; received "".');
  });

  it("clears canonical identity only when selecting a different planner map", () => {
    const canonicalWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        type: "open-canonical-map",
        activeMapId: "map-1",
        activeProjectId: "project-1",
        placementSnapshot: createEmptyPlacementSnapshot(),
        plannerMapId: "forest",
        season: "summer",
      },
    );

    const sameMapWorkspaceState = reducePlannerWorkspaceState(
      canonicalWorkspaceState,
      { type: "select-map", plannerMapId: "forest" },
    );
    const differentMapWorkspaceState = reducePlannerWorkspaceState(
      canonicalWorkspaceState,
      { type: "select-map", plannerMapId: "standard" },
    );

    expect(sameMapWorkspaceState).toMatchObject({
      activeMapId: "map-1",
      activeProjectId: "project-1",
    });
    expect(differentMapWorkspaceState).toMatchObject({
      activeMapId: null,
      activeProjectId: null,
    });
  });

  it("clears selection and redo history when switching planner maps or resetting placement history", () => {
    const initialPlacementSnapshot = createEmptyPlacementSnapshot();
    const placementSnapshotWithCrop = applyPlacementSnapshotAction(
      initialPlacementSnapshot,
      { type: "add-crop", crop: { cropId: "parsnip", x: 2, y: 3 } },
    );
    const placementHistoryWithRedo = undoPlacementHistory(
      commitPlacementHistory(
        createInitialPlannerWorkspaceState().placementHistory,
        placementSnapshotWithCrop,
      ),
    );
    const workspaceState = {
      ...createInitialPlannerWorkspaceState(),
      placementHistory: placementHistoryWithRedo,
      selectedPlacementKeys: ["crop:2:3"],
    };

    const mapSwitchedWorkspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "select-map",
      plannerMapId: "forest",
    } as unknown as PlannerWorkspaceAction);
    const resetWorkspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "reset-placement-history",
      placementSnapshot: placementSnapshotWithCrop,
    } as unknown as PlannerWorkspaceAction);

    expect(mapSwitchedWorkspaceState.selectedPlacementKeys).toEqual([]);
    expect(mapSwitchedWorkspaceState.placementHistory.redoStates).toEqual([]);
    expect(mapSwitchedWorkspaceState.placementHistory.undoStates).toEqual(
      placementHistoryWithRedo.undoStates,
    );
    expect(resetWorkspaceState.selectedPlacementKeys).toEqual([]);
    expect(resetWorkspaceState.placementHistory).toEqual({
      currentState: placementSnapshotWithCrop,
      redoStates: [],
      undoStates: [],
    });
  });

  it("applies edit results atomically and clears selection across undo and redo boundaries", () => {
    const initialPlacementSnapshot = createEmptyPlacementSnapshot();
    const placementSnapshotWithCrop = applyPlacementSnapshotAction(
      initialPlacementSnapshot,
      { type: "add-crop", crop: { cropId: "parsnip", x: 2, y: 3 } },
    );
    const placementHistoryWithUndo = commitPlacementHistory(
      createInitialPlannerWorkspaceState().placementHistory,
      placementSnapshotWithCrop,
    );
    const workspaceState = createInitialPlannerWorkspaceState();

    const editedWorkspaceState = reducePlannerWorkspaceState(workspaceState, {
      type: "apply-placement-edit-result",
      placementHistory: placementHistoryWithUndo,
      selectedPlacementKeys: ["crop:2:3"],
    } as unknown as PlannerWorkspaceAction);
    const undoneWorkspaceState = reducePlannerWorkspaceState(
      editedWorkspaceState,
      { type: "undo-placement-history" } as unknown as PlannerWorkspaceAction,
    );
    const redoneWorkspaceState = reducePlannerWorkspaceState(
      undoneWorkspaceState,
      { type: "redo-placement-history" } as unknown as PlannerWorkspaceAction,
    );
    const boundaryWorkspaceState = reducePlannerWorkspaceState(
      {
        ...workspaceState,
        selectedPlacementKeys: ["crop:2:3"],
      },
      { type: "undo-placement-history" } as unknown as PlannerWorkspaceAction,
    );

    expect(editedWorkspaceState).toMatchObject({
      placementHistory: placementHistoryWithUndo,
      selectedPlacementKeys: ["crop:2:3"],
    });
    expect(undoneWorkspaceState).toMatchObject({
      placementHistory: undoPlacementHistory(placementHistoryWithUndo),
      selectedPlacementKeys: [],
    });
    expect(redoneWorkspaceState).toMatchObject({
      placementHistory: redoPlacementHistory(undoPlacementHistory(placementHistoryWithUndo)),
      selectedPlacementKeys: [],
    });
    expect(boundaryWorkspaceState).toMatchObject({
      placementHistory: workspaceState.placementHistory,
      selectedPlacementKeys: [],
    });
  });

  it("commits runtime completions only in generation and lifecycle order", () => {
    const loadingWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        type: "start-runtime-loading",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );
    const staleReadyWorkspaceState = reducePlannerWorkspaceState(
      loadingWorkspaceState,
      {
        type: "complete-runtime-ready",
        resourceGeneration: 3,
      } as unknown as PlannerWorkspaceAction,
    );
    const staleInteractiveWorkspaceState = reducePlannerWorkspaceState(
      loadingWorkspaceState,
      {
        type: "complete-runtime-interactive",
        resourceGeneration: 3,
      } as unknown as PlannerWorkspaceAction,
    );
    const skippedInteractiveWorkspaceState = reducePlannerWorkspaceState(
      loadingWorkspaceState,
      {
        type: "complete-runtime-interactive",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );
    const readyWorkspaceState = reducePlannerWorkspaceState(
      loadingWorkspaceState,
      {
        type: "complete-runtime-ready",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );
    const interactiveWorkspaceState = reducePlannerWorkspaceState(
      readyWorkspaceState,
      {
        type: "complete-runtime-interactive",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );
    const staleErrorWorkspaceState = reducePlannerWorkspaceState(
      interactiveWorkspaceState,
      {
        type: "complete-runtime-error",
        message: "",
        resourceGeneration: 3,
      } as unknown as PlannerWorkspaceAction,
    );
    const lateReadyWorkspaceState = reducePlannerWorkspaceState(
      interactiveWorkspaceState,
      {
        type: "complete-runtime-ready",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );
    const lateInteractiveWorkspaceState = reducePlannerWorkspaceState(
      interactiveWorkspaceState,
      {
        type: "complete-runtime-interactive",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );
    const lateErrorWorkspaceState = reducePlannerWorkspaceState(
      interactiveWorkspaceState,
      {
        type: "complete-runtime-error",
        message: "late failure",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );
    const errorWorkspaceState = reducePlannerWorkspaceState(
      readyWorkspaceState,
      {
        type: "complete-runtime-error",
        message: "unable to load map",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );
    const errorRegressionWorkspaceState = reducePlannerWorkspaceState(
      errorWorkspaceState,
      {
        type: "complete-runtime-ready",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction,
    );

    expect(loadingWorkspaceState.runtimeState).toEqual({
      resourceGeneration: 4,
      status: "loading",
    });
    expect(staleReadyWorkspaceState).toBe(loadingWorkspaceState);
    expect(staleInteractiveWorkspaceState).toBe(loadingWorkspaceState);
    expect(skippedInteractiveWorkspaceState).toBe(loadingWorkspaceState);
    expect(readyWorkspaceState.runtimeState).toEqual({
      resourceGeneration: 4,
      status: "ready",
    });
    expect(interactiveWorkspaceState.runtimeState).toEqual({
      resourceGeneration: 4,
      status: "interactive",
    });
    expect(staleErrorWorkspaceState).toBe(interactiveWorkspaceState);
    expect(lateReadyWorkspaceState).toBe(interactiveWorkspaceState);
    expect(lateInteractiveWorkspaceState).toBe(interactiveWorkspaceState);
    expect(lateErrorWorkspaceState.runtimeState).toEqual({
      message: "late failure",
      resourceGeneration: 4,
      status: "error",
    });
    expect(errorWorkspaceState.runtimeState).toEqual({
      message: "unable to load map",
      resourceGeneration: 4,
      status: "error",
    });
    expect(errorRegressionWorkspaceState).toBe(errorWorkspaceState);
    expect(() =>
      reducePlannerWorkspaceState(createInitialPlannerWorkspaceState(), {
        type: "start-runtime-loading",
        resourceGeneration: -1,
      } as unknown as PlannerWorkspaceAction),
    ).toThrow('Planner workspace resourceGeneration must be a non-negative integer; received -1.');
    expect(() =>
      reducePlannerWorkspaceState(loadingWorkspaceState, {
        type: "complete-runtime-error",
        message: "",
        resourceGeneration: 4,
      } as unknown as PlannerWorkspaceAction),
    ).toThrow('Planner workspace runtime error message must be a non-empty string; received "".');
  });

  it("normalizes canonical-open and reset snapshots before storing them", () => {
    const canonicalOpenSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [] as { cropId: string; x: number; y: number }[],
    };
    const resetSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [] as { cropId: string; x: number; y: number }[],
    };
    const openedWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        type: "open-canonical-map",
        activeMapId: "map-instance-8",
        activeProjectId: "project-3",
        placementSnapshot: canonicalOpenSnapshot,
        plannerMapId: "forest",
        season: "summer",
      },
    );
    const resetWorkspaceState = reducePlannerWorkspaceState(
      openedWorkspaceState,
      {
        type: "reset-placement-history",
        placementSnapshot: resetSnapshot,
      },
    );

    canonicalOpenSnapshot.crops.push({ cropId: "parsnip", x: 2, y: 3 });
    resetSnapshot.crops.push({ cropId: "melon", x: 4, y: 5 });

    expect(openedWorkspaceState.placementHistory.currentState.crops).toEqual([]);
    expect(resetWorkspaceState.placementHistory.currentState.crops).toEqual([]);
  });

  it("validates and clones every snapshot in an edit-result history", () => {
    const currentSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [] as { cropId: string; x: number; y: number }[],
    };
    const undoSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [] as { cropId: string; x: number; y: number }[],
    };
    const redoSnapshot = {
      ...createEmptyPlacementSnapshot(),
      crops: [] as { cropId: string; x: number; y: number }[],
    };
    const editedWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        type: "apply-placement-edit-result",
        placementHistory: {
          currentState: currentSnapshot,
          redoStates: [redoSnapshot],
          undoStates: [undoSnapshot],
        },
        selectedPlacementKeys: [],
      },
    );

    currentSnapshot.crops.push({ cropId: "parsnip", x: 2, y: 3 });
    undoSnapshot.crops.push({ cropId: "melon", x: 4, y: 5 });
    redoSnapshot.crops.push({ cropId: "pumpkin", x: 6, y: 7 });

    expect(editedWorkspaceState.placementHistory.currentState.crops).toEqual([]);
    expect(editedWorkspaceState.placementHistory.undoStates[0]?.crops).toEqual([]);
    expect(editedWorkspaceState.placementHistory.redoStates[0]?.crops).toEqual([]);
    expect(() =>
      reducePlannerWorkspaceState(createInitialPlannerWorkspaceState(), {
        type: "apply-placement-edit-result",
        placementHistory: {
          currentState: createEmptyPlacementSnapshot(),
          redoStates: [],
          undoStates: null,
        } as unknown as ReturnType<typeof createInitialPlannerWorkspaceState>["placementHistory"],
        selectedPlacementKeys: [],
      }),
    ).toThrow("Placement history undoStates must be an array; received null.");
  });

  it("rejects a current state whose canonical identities are not paired", () => {
    const invalidCanonicalWorkspaceState = {
      ...createInitialPlannerWorkspaceState(),
      activeProjectId: "project-3",
    };

    expect(() =>
      reducePlannerWorkspaceState(invalidCanonicalWorkspaceState, {
        type: "toggle-menu",
      }),
    ).toThrow(
      'Planner workspace canonical identities must be both null or non-empty strings; received activeProjectId "project-3" and activeMapId null.',
    );
  });

  it("keeps catalog and placement selection transitions reducer-owned", () => {
    const selectedPlacementKeys = ["crop:2:3"];
    const selectedWorkspaceState = reducePlannerWorkspaceState(
      createInitialPlannerWorkspaceState(),
      {
        type: "set-selected-placement-keys",
        selectedPlacementKeys,
      } as unknown as PlannerWorkspaceAction,
    );
    const catalogSelectedWorkspaceState = reducePlannerWorkspaceState(
      selectedWorkspaceState,
      {
        type: "set-selected-catalog-item",
        catalogItemId: "fence",
      } as unknown as PlannerWorkspaceAction,
    );

    selectedPlacementKeys.push("item:4");

    expect(catalogSelectedWorkspaceState).toMatchObject({
      selectedCatalogItemId: "fence",
      selectedPlacementKeys: ["crop:2:3"],
    });
  });
});
