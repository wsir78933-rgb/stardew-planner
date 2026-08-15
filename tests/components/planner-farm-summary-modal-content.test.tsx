import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PlannerFarmSummaryModalContent } from "../../src/components/planner-farm-summary-modal-content";
import { createEmptyPlacementSnapshot } from "../../src/placement/placement-snapshot";
import { getSaveModalCopy } from "../../src/i18n/save-modal-copy";

describe("planner farm-summary modal content", () => {
  it("wraps the farm-summary panel with Chinese preview copy", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerFarmSummaryModalContent, {
        catalogItems: [],
        copy: {
          farmSummaryDetail: getSaveModalCopy("zh-CN").farmSummaryDetail,
          farmSummaryPreview: getSaveModalCopy("zh-CN").farmSummaryPreview,
        },
        mapDisplayName: "Forest Farm",
        placementSnapshot: createEmptyPlacementSnapshot(),
        selectedPlannerMapId: "forest",
        season: "winter",
      }),
    );

    expect(markup).toContain(
      'class="planner-save-modal-content planner-save-modal-content--farm-summary"',
    );
    expect(markup).toContain("地图: Forest Farm");
    expect(markup).toContain("季节: 冬季");
    expect(markup).toContain("0 个物品已放置");
    expect(markup).toContain("查看详细摘要");
    expect(markup).toContain("<button");
  });
});
