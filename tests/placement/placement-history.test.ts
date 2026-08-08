import { describe, expect, it } from "vitest";
import {
  clearPlacementHistoryRedo,
  clonePlacementHistory,
  commitPlacementHistory,
  createPlacementHistory,
  redoPlacementHistory,
  undoPlacementHistory,
} from "../../src/placement/placement-history";
import {
  createEmptyPlacementSnapshot,
  replacePlacementSnapshotInteriorDecor,
} from "../../src/placement/placement-snapshot";

describe("placement history", () => {
  it("validates and clones every stored state through the supplied clone function", () => {
    const placementHistory = {
      currentState: { placementIds: ["current"] },
      redoStates: [{ placementIds: ["redo"] }],
      undoStates: [{ placementIds: ["undo"] }],
    };

    const clonedPlacementHistory = clonePlacementHistory(
      placementHistory,
      (placementState) => ({
        placementIds: [...placementState.placementIds],
      }),
    );

    placementHistory.currentState.placementIds.push("mutated");
    placementHistory.undoStates[0]?.placementIds.push("mutated");
    placementHistory.redoStates[0]?.placementIds.push("mutated");

    expect(clonedPlacementHistory).toEqual({
      currentState: { placementIds: ["current"] },
      redoStates: [{ placementIds: ["redo"] }],
      undoStates: [{ placementIds: ["undo"] }],
    });
  });

  it("clears redo through the public history boundary while preserving current and undo states", () => {
    const currentState = { placementIds: ["current"] };
    const undoStates = [{ placementIds: ["undo"] }];
    const placementHistory = {
      currentState,
      redoStates: [{ placementIds: ["redo"] }],
      undoStates,
    };

    const clearedPlacementHistory = clearPlacementHistoryRedo(placementHistory);

    expect(clearedPlacementHistory).toEqual({
      currentState,
      redoStates: [],
      undoStates,
    });
    expect(clearedPlacementHistory.currentState).toBe(currentState);
    expect(clearedPlacementHistory.undoStates).toBe(undoStates);
  });

  it("records a new placement state as an undoable transition", () => {
    const initialHistory = createPlacementHistory({ placementIds: [] });
    const updatedHistory = commitPlacementHistory(initialHistory, {
      placementIds: ["crop:1,1"],
    });

    expect(updatedHistory).toEqual({
      currentState: { placementIds: ["crop:1,1"] },
      redoStates: [],
      undoStates: [{ placementIds: [] }],
    });
  });

  it("restores the previous state and makes the reverted state redoable", () => {
    const updatedHistory = commitPlacementHistory(
      createPlacementHistory({ placementIds: [] }),
      { placementIds: ["crop:1,1"] },
    );

    expect(undoPlacementHistory(updatedHistory)).toEqual({
      currentState: { placementIds: [] },
      redoStates: [{ placementIds: ["crop:1,1"] }],
      undoStates: [],
    });
  });

  it("restores an undone state only once through redo", () => {
    const updatedHistory = commitPlacementHistory(
      createPlacementHistory({ placementIds: [] }),
      { placementIds: ["crop:1,1"] },
    );

    expect(redoPlacementHistory(undoPlacementHistory(updatedHistory))).toEqual(
      updatedHistory,
    );
  });

  it("undoes and redoes interior decor through the shared placement history", () => {
    const initialSnapshot = createEmptyPlacementSnapshot();
    const wallpaperSnapshot = replacePlacementSnapshotInteriorDecor(
      initialSnapshot,
      { wallpapers: { Bedroom: "0" }, floors: {} },
    );
    const wallpaperHistory = commitPlacementHistory(
      createPlacementHistory(initialSnapshot),
      wallpaperSnapshot,
    );

    expect(undoPlacementHistory(wallpaperHistory).currentState.interiorDecor).toBe(
      undefined,
    );
    expect(
      redoPlacementHistory(undoPlacementHistory(wallpaperHistory)).currentState
        .interiorDecor,
    ).toEqual({ wallpapers: { Bedroom: "0" }, floors: {} });
  });

  it("undoes and redoes an exact nested table-child state", () => {
    const initialSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [{
        bedType: null,
        flipped: false,
        footprint: { width: 2, height: 2 },
        instanceId: 1,
        isGrass: false,
        isLongTable: false,
        isRug: false,
        isTable: true,
        itemId: "furniture_724",
        layer: "item" as const,
        locked: false,
        rotation: 0,
        tintColor: "#ffffff",
        variant: 0,
        x: 3,
        y: 4,
        heldItem: {
          bedType: null,
          flipped: false,
          footprint: { width: 1, height: 1 },
          instanceId: 7,
          isGrass: false,
          isLongTable: false,
          isRug: false,
          isTable: false,
          itemId: "furniture_0",
          layer: "item" as const,
          locked: false,
          rotation: 0,
          tintColor: "#ffffff",
          variant: 0,
          x: 4,
          y: 5,
        },
      }],
      nextItemId: 8,
    };
    const editedSnapshot = {
      ...initialSnapshot,
      items: [{
        ...initialSnapshot.items[0]!,
        heldItem: {
          ...initialSnapshot.items[0]!.heldItem,
          tintColor: "#123456",
          variant: 2,
          x: 3,
          y: 4,
        },
      }],
    };
    const editedHistory = commitPlacementHistory(
      createPlacementHistory(initialSnapshot),
      editedSnapshot,
    );

    const undoneHistory = undoPlacementHistory(editedHistory);
    expect(undoneHistory.currentState).toEqual(initialSnapshot);
    expect(redoPlacementHistory(undoneHistory).currentState).toEqual(
      editedSnapshot,
    );
  });

  it("clears the redo branch when a new state is committed after undo", () => {
    const initialHistory = createPlacementHistory({ placementIds: [] });
    const firstHistory = commitPlacementHistory(initialHistory, {
      placementIds: ["crop:1,1"],
    });
    const undoneHistory = undoPlacementHistory(firstHistory);

    expect(
      commitPlacementHistory(undoneHistory, {
        placementIds: ["floor:1,1"],
      }),
    ).toEqual({
      currentState: { placementIds: ["floor:1,1"] },
      redoStates: [],
      undoStates: [{ placementIds: [] }],
    });
  });

  it("keeps only the latest 50 complete snapshots", () => {
    let placementHistory = createPlacementHistory({ sequence: 0 });

    for (let sequence = 1; sequence <= 51; sequence += 1) {
      placementHistory = commitPlacementHistory(placementHistory, { sequence });
    }

    expect(placementHistory.currentState).toEqual({ sequence: 51 });
    expect(placementHistory.undoStates).toHaveLength(50);
    expect(placementHistory.undoStates[0]).toEqual({ sequence: 1 });
    expect(placementHistory.undoStates.at(-1)).toEqual({ sequence: 50 });
  });
});
