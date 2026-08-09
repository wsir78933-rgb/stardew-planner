import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EditorMenuBar } from "../../src/components/editor-menu-bar";
import {
  EditorToolbar,
  getEditorToolbarToolSelectionAfterClick,
} from "../../src/components/editor-toolbar";

function renderToolbar(
  tool: Parameters<typeof EditorToolbar>[0]["tool"],
): string {
  return renderToStaticMarkup(
    createElement(EditorToolbar, {
      canRedo: false,
      canUndo: false,
      onRedo: () => undefined,
      onToolChange: () => undefined,
      onUndo: () => undefined,
      tool,
    }),
  );
}

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

  it("renders exactly one visible selected tool or no selection", () => {
    const cases = [
      { expectedPressedLabels: [], tool: null },
      { expectedPressedLabels: ["Cursor tool"], tool: "cursor" },
      { expectedPressedLabels: ["Multi-select tool"], tool: "multi-select" },
      { expectedPressedLabels: ["Erase tool"], tool: "erase" },
      { expectedPressedLabels: ["Disable wheel zoom"], tool: "zoom" },
    ] as const;

    for (const toolbarCase of cases) {
      const markup = renderToolbar(toolbarCase.tool);
      const pressedLabels = Array.from(
        markup.matchAll(/aria-label="([^"]+)" aria-pressed="true"/g),
        ([, ariaLabel]) => ariaLabel,
      );

      expect(pressedLabels).toEqual(toolbarCase.expectedPressedLabels);
    }

    const zoomMarkup = renderToolbar("zoom");
    expect(zoomMarkup).toContain(
      'class="tool-btn editor-toolbar__button reference-runtime-wheel-zoom-button"',
    );
    expect(zoomMarkup).toContain(
      'data-reference-runtime-wheel-zoom-button="true"',
    );
  });

  it("deselects the current tool and otherwise selects the requested visible tool", () => {
    const cases = [
      { currentTool: "cursor", expectedTool: null, requestedTool: "cursor" },
      {
        currentTool: "multi-select",
        expectedTool: null,
        requestedTool: "multi-select",
      },
      { currentTool: "erase", expectedTool: null, requestedTool: "erase" },
      { currentTool: "zoom", expectedTool: null, requestedTool: "zoom" },
      { currentTool: "zoom", expectedTool: "cursor", requestedTool: "cursor" },
      {
        currentTool: "cursor",
        expectedTool: "multi-select",
        requestedTool: "multi-select",
      },
      { currentTool: "cursor", expectedTool: "erase", requestedTool: "erase" },
      { currentTool: "cursor", expectedTool: "zoom", requestedTool: "zoom" },
      { currentTool: null, expectedTool: "cursor", requestedTool: "cursor" },
      {
        currentTool: null,
        expectedTool: "multi-select",
        requestedTool: "multi-select",
      },
      { currentTool: null, expectedTool: "erase", requestedTool: "erase" },
      { currentTool: null, expectedTool: "zoom", requestedTool: "zoom" },
    ] as const;

    for (const toolbarSelectionCase of cases) {
      expect(
        getEditorToolbarToolSelectionAfterClick(
          toolbarSelectionCase.currentTool,
          toolbarSelectionCase.requestedTool,
        ),
      ).toBe(toolbarSelectionCase.expectedTool);
    }
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
      '.planner-editor-shell .tool-btn.reference-runtime-wheel-zoom-button[aria-pressed="true"]';
    const legacySelectedWheelZoomSelector =
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
    expect(stylesheet).not.toContain(`${legacySelectedWheelZoomSelector} {`);
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
