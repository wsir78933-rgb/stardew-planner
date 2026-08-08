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
});
