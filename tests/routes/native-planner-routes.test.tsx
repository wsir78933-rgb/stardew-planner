import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EnglishPlannerPage from "../../app/(en)/page";
import ChinesePlannerPage from "../../app/zh/page";

function expectNativePlannerRoute(
  plannerPageMarkup: string,
  workspaceLabel: string,
): void {
  expect(plannerPageMarkup).toContain(`aria-label="${workspaceLabel}"`);
  expect(plannerPageMarkup).toContain("data-planner-workspace");
  expect(plannerPageMarkup).not.toContain("reference-runtime-root");
  expect(plannerPageMarkup).not.toContain("reference-runtime/bootstrap.mjs");
  expect(plannerPageMarkup).not.toContain("<iframe");
}

describe("native planner routes", () => {
  it("renders the English planner as native React workspace markup", () => {
    expectNativePlannerRoute(
      renderToStaticMarkup(createElement(EnglishPlannerPage)),
      "Stardew Planner",
    );
  });

  it("renders the Chinese planner as native React workspace markup", () => {
    expectNativePlannerRoute(
      renderToStaticMarkup(createElement(ChinesePlannerPage)),
      "星露谷规划器",
    );
  });
});
