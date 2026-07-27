import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PlannerPage from "../../app/page";

describe("planner editor page", () => {
  it("keeps the frozen reference client out of the static page markup", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));

    expect(plannerPageMarkup).not.toContain('id="reference-runtime-root"');
    expect(plannerPageMarkup).not.toContain(
      'src="/reference-runtime/bootstrap.mjs"',
    );
    expect(plannerPageMarkup).not.toContain("planner-workspace");
    expect(plannerPageMarkup).not.toContain("<iframe");
  });
});
