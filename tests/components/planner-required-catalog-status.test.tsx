import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  PlannerRequiredCatalogGate,
  PlannerRequiredCatalogStatus,
} from "../../src/components/planner-required-catalog-status";

describe("planner required catalog status", () => {
  it("renders a brief accessible loading status", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerRequiredCatalogStatus, {
        state: { kind: "loading" },
      }),
    );

    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('role="status"');
    expect(markup).toContain("Loading placed item catalog…");
    expect(markup).not.toContain("Retry");
  });

  it("renders a specific accessible error with a Retry action", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerRequiredCatalogStatus, {
        state: {
          kind: "error",
          message:
            'Required planner catalog category "placeables" item ID "object:390" must have exactly one match; received 0 matches.',
          onRetry: () => undefined,
        },
      }),
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("placeables");
    expect(markup).toContain("object:390");
    expect(markup).toContain(">Retry</button>");
  });

  it("does not offer an ineffective Retry for an already-ready duplicate ID", () => {
    const markup = renderToStaticMarkup(
      createElement(PlannerRequiredCatalogStatus, {
        state: {
          kind: "error",
          message:
            'Required planner catalog category "placeables" item ID "object:390" must have exactly one match; received 2 matches.',
        },
      }),
    );

    expect(markup).toContain('role="alert"');
    expect(markup).not.toContain("Retry");
  });

  it("mounts canvas and selection content only after the required catalog is ready", () => {
    const loadingMarkup = renderToStaticMarkup(
      createElement(
        PlannerRequiredCatalogGate,
        { state: { kind: "loading" } },
        createElement("div", { "data-planner-canvas": true }, "Canvas"),
        createElement("aside", { "data-selection-inspector": true }, "Selection"),
      ),
    );
    const readyMarkup = renderToStaticMarkup(
      createElement(
        PlannerRequiredCatalogGate,
        { state: { kind: "ready" } },
        createElement("div", { "data-planner-canvas": true }, "Canvas"),
        createElement("aside", { "data-selection-inspector": true }, "Selection"),
      ),
    );

    expect(loadingMarkup).toContain("Loading placed item catalog…");
    expect(loadingMarkup).not.toContain("data-planner-canvas");
    expect(loadingMarkup).not.toContain("data-selection-inspector");
    expect(readyMarkup).toContain("data-planner-canvas");
    expect(readyMarkup).toContain("data-selection-inspector");
    expect(readyMarkup).not.toContain("Loading placed item catalog…");
  });
});
