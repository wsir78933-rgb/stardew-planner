import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PlannerFarmSummaryModalContent } from "../../src/components/planner-farm-summary-modal-content";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";

describe("planner farm-summary modal content", () => {
  it("wraps the farm-summary panel and renders its inline preview", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerFarmSummaryModalContent, {
        catalogItems: [],
        mapDisplayName: "Forest Farm",
        placementSnapshot: createEmptyPlacementSnapshot(),
        selectedPlannerMapId: "forest",
        season: "winter",
      }),
    );

    expect(markup).toContain(
      'class="planner-save-modal-content planner-save-modal-content--farm-summary"',
    );
    expect(markup).toContain("Map: Forest Farm");
    expect(markup).toContain("Season: Winter");
    expect(markup).toContain("0 items placed");
    expect(markup).toContain("View detailed summary");
    expect(markup).toContain("<button");
  });
});
