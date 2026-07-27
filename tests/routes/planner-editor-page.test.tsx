import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PlannerPage from "../../app/page";

describe("planner editor page", () => {
  it("mounts the frozen reference client with its native module bootstrap", () => {
    const plannerPageMarkup = renderToStaticMarkup(createElement(PlannerPage));

    expect(plannerPageMarkup.match(/id="reference-runtime-root"/g)).toHaveLength(1);
    expect(
      plannerPageMarkup.match(
        /<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="\/reference-runtime\/bootstrap\.mjs")[^>]*>/gi,
      ),
    ).toHaveLength(1);
    expect(plannerPageMarkup).not.toContain("planner-workspace");
    expect(plannerPageMarkup).not.toContain("<iframe");
  });
});
