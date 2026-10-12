import { describe, expect, it } from "vitest";
import { createInitialMapPlacementSnapshot } from "../../src/maps/map-initial-composition";
import { plannerMaps } from "../../src/maps/map-catalog";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

describe("map initial composition", () => {
  it("starts every exterior map without injected farm placements", () => {
    const exteriorMaps = plannerMaps.filter(
      (plannerMap) => plannerMap.category === "exterior",
    );

    expect(exteriorMaps).toHaveLength(15);
    for (const exteriorMap of exteriorMaps) {
      expect(createInitialMapPlacementSnapshot(exteriorMap.id)).toEqual(
        createEmptyPlacementSnapshot(),
      );
    }
  });
});
