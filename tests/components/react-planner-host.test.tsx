import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ReactPlannerHost } from "../../src/components/react-planner-host";

describe("React planner host", () => {
  it("keeps the React workspace and Pixi runtime out of static HTML", () => {
    const reactPlannerHostMarkup = renderToStaticMarkup(
      createElement(ReactPlannerHost),
    );

    expect(reactPlannerHostMarkup).toBe("");
    expect(reactPlannerHostMarkup).not.toContain("planner-canvas__viewport");
    expect(reactPlannerHostMarkup).not.toContain("reference-runtime-root");
  });
});
