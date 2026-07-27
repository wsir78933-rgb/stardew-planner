import { describe, expect, it } from "vitest";
import {
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
