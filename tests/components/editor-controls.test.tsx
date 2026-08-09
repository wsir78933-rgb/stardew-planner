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
    expect(disabledMarkup).toContain(
      'class="tool-btn editor-toolbar__button reference-runtime-wheel-zoom-button"',
    );
    expect(disabledMarkup).toContain('aria-pressed="false"');
    expect(disabledMarkup).toContain('aria-label="Enable wheel zoom"');
    expect(enabledMarkup).toContain('aria-pressed="true"');
    expect(enabledMarkup).toContain(
      'class="tool-btn editor-toolbar__button reference-runtime-wheel-zoom-button"',
    );
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
      new Set(["tool-btn", "editor-toolbar__button", "cursor"]),
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

  it("keeps Cursor selection and wheel zoom state independent", () => {
    const cursorSelectedWheelZoomDisabledMarkup = renderToStaticMarkup(
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
    const cursorUnselectedWheelZoomEnabledMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        canRedo: false,
        canUndo: false,
        onRedo: () => undefined,
        onToolChange: () => undefined,
        onUndo: () => undefined,
        onWheelZoomToggle: () => undefined,
        tool: "multi-select",
        wheelZoomEnabled: true,
      }),
    );
    const bothEnabledMarkup = renderToStaticMarkup(
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
    const selectedCursorClassName = cursorSelectedWheelZoomDisabledMarkup.match(
      /<button aria-label="Cursor tool" aria-pressed="true" class="([^"]+)"/,
    )?.[1];
    const unselectedCursorClassName = cursorUnselectedWheelZoomEnabledMarkup.match(
      /<button aria-label="Cursor tool" aria-pressed="false" class="([^"]+)"/,
    )?.[1];

    expect(bothEnabledMarkup).toMatch(
      /<button aria-label="Cursor tool" aria-pressed="true" class="(?=[^"]*\bcursor\b)[^"]+"/,
    );
    expect(bothEnabledMarkup).toMatch(
      /<button aria-label="Disable wheel zoom" aria-pressed="true" class="(?=[^"]*\breference-runtime-wheel-zoom-button\b)[^"]+"/,
    );
    expect(new Set(selectedCursorClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button", "cursor", "active"]),
    );
    expect(new Set(unselectedCursorClassName?.split(" "))).toEqual(
      new Set(["tool-btn", "editor-toolbar__button", "cursor"]),
    );
    expect(cursorSelectedWheelZoomDisabledMarkup).toContain(
      'aria-label="Enable wheel zoom" aria-pressed="false"',
    );
    expect(cursorUnselectedWheelZoomEnabledMarkup).toContain(
      'aria-label="Cursor tool" aria-pressed="false"',
    );
  });

  it("locks Cursor and wheel Zoom colors after generic hover without broad or false selectors", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "app/globals.css"),
      "utf8",
    );
    const genericToolHoverSelector =
      ".planner-editor-shell .tool-btn:hover:not(:disabled)";
    const selectedCursorSelector =
      '.planner-editor-shell .tool-btn.cursor[aria-pressed="true"]';
    const selectedWheelZoomSelector =
      '.planner-editor-shell .reference-runtime-wheel-zoom-button[aria-pressed="true"]';
    const genericToolHoverRuleIndex = stylesheet.indexOf(
      `${genericToolHoverSelector} {`,
    );
    const selectedCursorRuleIndex = stylesheet.indexOf(
      `${selectedCursorSelector} {`,
    );
    const selectedWheelZoomRuleIndex = stylesheet.indexOf(
      `${selectedWheelZoomSelector} {`,
    );
    const selectedCursorRuleEnd = stylesheet.indexOf(
      "}",
      selectedCursorRuleIndex,
    );
    const selectedWheelZoomRuleEnd = stylesheet.indexOf(
      "}",
      selectedWheelZoomRuleIndex,
    );
    const selectedCursorRule = stylesheet.slice(
      selectedCursorRuleIndex,
      selectedCursorRuleEnd + 1,
    );
    const selectedWheelZoomRule = stylesheet.slice(
      selectedWheelZoomRuleIndex,
      selectedWheelZoomRuleEnd + 1,
    );

    expect(stylesheet).not.toContain(
      '.planner-editor-shell .tool-btn[aria-pressed="true"]',
    );
    expect(stylesheet).not.toContain(
      '.planner-editor-shell .editor-toolbar__button[aria-pressed="true"]',
    );
    expect(stylesheet).not.toContain(
      '.planner-editor-shell .tool-btn.cursor[aria-pressed="false"]',
    );
    expect(stylesheet).not.toContain(
      '.planner-editor-shell .reference-runtime-wheel-zoom-button[aria-pressed="false"]',
    );
    expect(genericToolHoverRuleIndex).toBeGreaterThanOrEqual(0);
    expect(selectedCursorRuleIndex).toBeGreaterThan(genericToolHoverRuleIndex);
    expect(selectedWheelZoomRuleIndex).toBeGreaterThan(genericToolHoverRuleIndex);
    expect(selectedCursorRule).toContain("background: rgb(177 58 40 / 15%);");
    expect(selectedCursorRule).toContain("color: #b13a28;");
    expect(selectedWheelZoomRule).toContain(
      "background: rgb(177 58 40 / 15%);",
    );
    expect(selectedWheelZoomRule).toContain("color: #b13a28;");
  });
});
