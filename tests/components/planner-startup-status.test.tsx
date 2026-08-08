import { createElement } from "react";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  PlannerStartupStatus,
  type PlannerStartupStatusState,
} from "../../src/components/planner-startup-status";

function renderStartupStatus(state: PlannerStartupStatusState): string {
  return renderToStaticMarkup(createElement(PlannerStartupStatus, { state }));
}

describe("planner startup status", () => {
  it("announces a specific loading message without changing layout", () => {
    const markup = renderStartupStatus({
      kind: "loading",
      message: "Loading your farm map",
    });

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain("Loading your farm map");
  });

  it("renders a specific startup error with an actionable retry control", () => {
    const markup = renderStartupStatus({
      kind: "error",
      message: "Could not load Standard Farm",
      onRetry: vi.fn(),
    });

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("Could not load Standard Farm");
    expect(markup).toContain('<button type="button">Retry</button>');
  });

  it("wires retry to the supplied callback", () => {
    const onRetry = vi.fn();
    const startupStatusElement = PlannerStartupStatus({
      state: {
        kind: "error",
        message: "Could not load Standard Farm",
        onRetry,
      },
    });

    if (startupStatusElement === null || startupStatusElement.type !== "div") {
      throw new Error("Expected an error status container.");
    }

    const errorStatusContainer = startupStatusElement as ReactElement<{
      children: [ReactElement, ReactElement];
    }>;
    const errorStatusChildren = errorStatusContainer.props.children as [
      ReactElement,
      ReactElement,
    ];
    const retryButton = errorStatusChildren[1] as ReactElement<{
      onClick: () => void;
    }>;

    if (retryButton.type !== "button") {
      throw new Error("Expected the second error status child to be a button.");
    }

    retryButton.props.onClick();

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders no stale loading or error content after the editor is interactive", () => {
    const markup = renderStartupStatus({ kind: "interactive" });

    expect(markup).toBe("");
    expect(markup).not.toContain("role=");
    expect(markup).not.toContain("Loading");
    expect(markup).not.toContain("Retry");
  });
});
