import { describe, expect, it } from "vitest";
import { applyInteriorDecorPatternToHistory } from "../../src/interior-decor/interior-decor-controller";
import { createPlacementHistory } from "../../src/placement/placement-history";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

describe("interior decor controller", () => {
  it("commits a wallpaper change into the shared placement history", () => {
    const initialSnapshot = {
      ...createEmptyPlacementSnapshot(),
      items: [
        {
          instanceId: 1,
          itemId: "object:388",
          x: 4,
          y: 5,
          layer: "item" as const,
          rotation: 0,
          footprint: { width: 1, height: 1 },
          variant: 0,
          tintColor: "#ffffff",
          locked: false,
          isRug: false,
          isGrass: false,
          isTable: false,
          isLongTable: false,
          flipped: false,
          bedType: null,
        },
      ],
      nextItemId: 2,
    };

    const nextHistory = applyInteriorDecorPatternToHistory({
      interiorDecorKind: "wallpaper",
      patternId: "17",
      placementHistory: createPlacementHistory(initialSnapshot),
      targetId: "UpperRoom",
    });

    expect(nextHistory.currentState.interiorDecor).toEqual({
      wallpapers: { UpperRoom: "17" },
      floors: {},
    });
    expect(nextHistory.currentState.items).toEqual(initialSnapshot.items);
    expect(nextHistory.undoStates).toEqual([initialSnapshot]);
    expect(nextHistory.redoStates).toEqual([]);
  });

  it("retains existing wallpaper choices when it commits a flooring change", () => {
    const initialSnapshot = {
      ...createEmptyPlacementSnapshot(),
      interiorDecor: {
        wallpapers: { UpperRoom: "17" },
        floors: {},
      },
    };

    const nextHistory = applyInteriorDecorPatternToHistory({
      interiorDecorKind: "flooring",
      patternId: "MoreFloors:8",
      placementHistory: createPlacementHistory(initialSnapshot),
      targetId: "Nursery",
    });

    expect(nextHistory.currentState.interiorDecor).toEqual({
      wallpapers: { UpperRoom: "17" },
      floors: { Nursery: "MoreFloors:8" },
    });
  });
});
