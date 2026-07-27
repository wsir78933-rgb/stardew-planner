import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EnglishPlannerPage from "../../app/(en)/page";
import ChinesePlannerPage from "../../app/zh/page";

describe("planner editor page", () => {
  it("mounts the native English planner without the frozen runtime bootstrap", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(EnglishPlannerPage));

    expect(plannerPageMarkup).toContain('aria-label="Stardew Planner"');
    expect(plannerPageMarkup).toContain("planner-workspace");
    expect(plannerPageMarkup).not.toContain("reference-runtime/bootstrap.mjs");
    expect(plannerPageMarkup).not.toContain("<iframe");
  });

  it("mounts the native Chinese planner", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(ChinesePlannerPage));

    expect(plannerPageMarkup).toContain('aria-label="星露谷规划器"');
    expect(plannerPageMarkup).not.toContain("reference-runtime/bootstrap.mjs");
  });
});
