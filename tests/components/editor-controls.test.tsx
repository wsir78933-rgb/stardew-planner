import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EditorMenuBar } from "../../src/components/editor-menu-bar";
import { EditorToolbar } from "../../src/components/editor-toolbar";

describe("editor controls", () => {
  it("renders the compact menu trigger alongside the desktop menu controls", () => {
    const markup = renderToStaticMarkup(
      createElement(EditorMenuBar, {
        activeModalId: null,
        mapDisplayName: "Standard Farm",
        onCycleSeason: () => undefined,
        onOpenModal: () => undefined,
        season: "spring",
      }),
    );

    expect(markup).toContain('aria-label="Menu"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('title="Menu"');
    expect(markup).toContain("editor-menu-bar__controls");
  });

  it("renders the wheel zoom control as a real toggle button", () => {
    const disabledMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        onWheelZoomToggle: () => undefined,
        tool: "cursor",
        wheelZoomEnabled: false,
      }),
    );
    const enabledMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        onWheelZoomToggle: () => undefined,
        tool: "cursor",
        wheelZoomEnabled: true,
      }),
    );

    expect(disabledMarkup).toContain('data-reference-runtime-wheel-zoom-button="true"');
    expect(disabledMarkup).toContain('aria-pressed="false"');
    expect(disabledMarkup).toContain('aria-label="Enable wheel zoom"');
    expect(enabledMarkup).toContain('aria-pressed="true"');
    expect(enabledMarkup).toContain('aria-label="Disable wheel zoom"');
  });

  it("matches the frozen inactive and active erase button classes", () => {
    const inactiveMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        tool: "cursor",
      }),
    );
    const activeMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        tool: "erase",
      }),
    );
    const inactiveEraseClassName = inactiveMarkup.match(
      /<button aria-label="Erase tool" aria-pressed="false" class="([^"]+)"/,
    )?.[1];
    const activeEraseClassName = activeMarkup.match(
      /<button aria-label="Erase tool" aria-pressed="true" class="([^"]+)"/,
    )?.[1];

    expect(new Set(inactiveEraseClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button", "erase-hover"]),
    );
    expect(new Set(activeEraseClassName?.split(" "))).toEqual(
      new Set([
        "tool-btn",
        "editor-toolbar__button",
        "erase-hover",
        "erase",
        "active",
      ]),
    );
  });

  it("adds a Multi-select-specific styling hook without changing selected semantics", () => {
    const inactiveToolbarMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        tool: "cursor",
      }),
    );
    const selectedToolbarMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        tool: "multi-select",
      }),
    );
    const inactiveMultiSelectClassName = inactiveToolbarMarkup.match(
      /<button aria-label="Multi-select tool" aria-pressed="false" class="([^"]+)"/,
    )?.[1];
    const selectedMultiSelectClassName = selectedToolbarMarkup.match(
      /<button aria-label="Multi-select tool" aria-pressed="true" class="([^"]+)"/,
    )?.[1];
    const selectedCursorClassName = selectedToolbarMarkup.match(
      /<button aria-label="Cursor tool" aria-pressed="false" class="([^"]+)"/,
    )?.[1];

    expect(new Set(inactiveMultiSelectClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button", "multi-select"]),
    );
    expect(new Set(selectedMultiSelectClassName?.split(" "))).toEqual(
      new Set([
        "tool-btn",
        "editor-toolbar__button",
        "multi-select",
        "active",
      ]),
    );
    expect(new Set(selectedCursorClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button"]),
    );
  });

  it("locks selected Multi-select colors after the generic tool hover rule", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "app/globals.css"),
      "utf8",
    );
    const genericToolHoverSelector =
      ".planner-editor-shell .tool-btn:hover:not(:disabled)";
    const selectedMultiSelectSelector =
      '.planner-editor-shell .tool-btn.multi-select[aria-pressed="true"]';
    const genericToolHoverRuleIndex = stylesheet.indexOf(
      `${genericToolHoverSelector} {`,
    );
    const selectedMultiSelectRuleIndex = stylesheet.indexOf(
      `${selectedMultiSelectSelector} {`,
    );
    const selectedMultiSelectRuleEnd = stylesheet.indexOf(
      "}",
      selectedMultiSelectRuleIndex,
    );
    const selectedMultiSelectRule = stylesheet.slice(
      selectedMultiSelectRuleIndex,
      selectedMultiSelectRuleEnd + 1,
    );

    expect(stylesheet).not.toContain(
      '.planner-editor-shell .tool-btn.multi-select[aria-pressed="false"]',
    );
    expect(genericToolHoverRuleIndex).toBeGreaterThanOrEqual(0);
    expect(selectedMultiSelectRuleIndex).toBeGreaterThan(genericToolHoverRuleIndex);
    expect(selectedMultiSelectRule).toContain(
      "background: rgb(177 58 40 / 15%);",
    );
    expect(selectedMultiSelectRule).toContain("color: #b13a28;");
  });
});
