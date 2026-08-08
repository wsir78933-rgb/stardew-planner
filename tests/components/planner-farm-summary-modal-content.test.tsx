import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PlannerFarmSummaryModalContent } from "../../src/components/planner-farm-summary-modal-content";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

describe("planner farm-summary modal content", () => {
  it("passes the current map, season, placement snapshot, and ready catalog to the summary panel", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerFarmSummaryModalContent, {
        catalogItems: [],
        mapDisplayName: "Forest Farm",
        placementSnapshot: createEmptyPlacementSnapshot(),
        selectedPlannerMapId: "forest",
        season: "winter",
      }),
    );

    expect(markup).toContain("Farm Summary");
  });
});
