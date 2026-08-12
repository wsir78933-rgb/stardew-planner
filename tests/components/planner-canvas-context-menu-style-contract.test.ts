import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globalStyles = readFileSync(
  resolve(process.cwd(), "app/globals.css"),
  "utf8",
);

describe("PlannerCanvasContextMenu style contract", () => {
  it("renders the context menu as a compact editor surface with a 44px action", () => {
    const contextMenuRule = globalStyles.match(
      /\.planner-editor-shell \[data-planner-canvas-context-menu\]\s*\{[^}]*\}/,
    )?.[0];
    const contextMenuItemRule = globalStyles.match(
      /\.planner-editor-shell \[data-planner-canvas-context-menu\] \[role="menuitem"\]\s*\{[^}]*\}/,
    )?.[0];

    expect(contextMenuRule).toContain("background: var(--bg-raised)");
    expect(contextMenuRule).toContain("border: 1px solid var(--border-subtle)");
    expect(contextMenuRule).toContain("border-radius: var(--lk-xs)");
    expect(contextMenuRule).toContain("box-shadow: 0 0.35rem 0.85rem rgb(36 42 34 / 16%)");
    expect(contextMenuRule).toContain("padding: var(--lk-2xs)");
    expect(contextMenuItemRule).toContain("min-height: 44px");
    expect(contextMenuItemRule).toContain("padding: 0 var(--lk-sm)");
  });

  it("gives the context-menu action clear hover and keyboard-focus feedback", () => {
    expect(globalStyles).toContain(
      '.planner-editor-shell [data-planner-canvas-context-menu] [role="menuitem"]:hover',
    );
    expect(globalStyles).toContain(
      '.planner-editor-shell [data-planner-canvas-context-menu] [role="menuitem"]:focus-visible',
    );
  });
});
