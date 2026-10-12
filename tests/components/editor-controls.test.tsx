import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EditorMenuBar, readEditorMenuModalFocusTarget } from "../../src/components/editor-menu-bar";
import {
  closeEditorModal,
  createInitialEditorViewState,
  openEditorModal,
  type EditorModalId,
} from "../../src/editor/editor-view-state";
import {
  EditorToolbar,
  getEditorToolbarToolSelectionAfterClick,
} from "../../src/components/editor-toolbar";

const menuHookState = vi.hoisted(() => ({
  isEnabled: false,
  isExpanded: false,
  toggleReference: { current: null as unknown },
}));

vi.mock("react", async (importOriginal) => {
  const actualReact = await importOriginal<typeof import("react")>();

  return {
    ...actualReact,
    useId: () => menuHookState.isEnabled ? "menu-test-controls" : actualReact.useId(),
    useRef: ((initialValue: unknown) => menuHookState.isEnabled
      ? menuHookState.toggleReference
      : actualReact.useRef(initialValue)) as typeof actualReact.useRef,
    useState: ((initialState: unknown) => {
      if (!menuHookState.isEnabled) return actualReact.useState(initialState);

      return [
        menuHookState.isExpanded,
        (nextValue: boolean | ((currentValue: boolean) => boolean)) => {
          menuHookState.isExpanded = typeof nextValue === "function"
            ? nextValue(menuHookState.isExpanded)
            : nextValue;
        },
      ];
    }) as typeof actualReact.useState,
  };
});

afterEach(() => {
  menuHookState.isEnabled = false;
  menuHookState.isExpanded = false;
  menuHookState.toggleReference.current = null;
});

function renderToolbar(
  tool: Parameters<typeof EditorToolbar>[0]["tool"],
  locale: "en" | "zh" = "en",
): string {
  return renderToStaticMarkup(
    createElement(EditorToolbar, {
      canRedo: false,
      canUndo: false,
      locale,
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
    expect(markup).toContain('aria-label="Library"');
    expect(markup).toContain('aria-label="Current map: Standard Farm"');
    expect(markup).toContain('data-editor-modal-id="feedback"');
    expect(markup).toContain("C12.3143 21.5809");
    expect(markup).toContain('data-editor-modal-id="ambience-panel"');
    expect(markup).toContain('data-editor-modal-id="farm-settings"');
    expect(markup).toContain('data-editor-modal-id="view-panel"');
    expect(markup).toContain('data-editor-modal-id="settings-panel"');
  });

  it("localizes the header controls and keeps every action mapped to its modal", () => {
    const markup = renderToStaticMarkup(
      createElement(EditorMenuBar, {
        activeModalId: null,
        locale: "zh",
        mapDisplayName: "标准农场",
        onCycleSeason: () => undefined,
        onOpenModal: () => undefined,
        season: "spring",
      }),
    );

    expect(markup).toContain('aria-label="帮助"');
    expect(markup).toContain('aria-label="快捷键"');
    expect(markup).toContain('aria-label="反馈"');
    expect(markup).toContain('aria-label="本地项目"');
    expect(markup).toContain('aria-label="当前地图: 标准农场"');
    expect(markup).toContain('aria-label="氛围"');
    expect(markup).toContain('aria-label="农场设置"');
    expect(markup).toContain('aria-label="地图"');
    expect(markup).toContain('aria-label="视图"');
    expect(markup).toContain('aria-label="设置"');
    expect(markup).toContain('data-editor-modal-id="help-info"');
    expect(markup).toContain('data-editor-modal-id="keyboard-shortcuts"');
    expect(markup).toContain('data-editor-modal-id="feedback"');
    expect(markup).toContain('data-editor-modal-id="save-panel"');
    expect(markup).toContain('data-editor-modal-id="map-picker"');
  });

  it.each([
    {
      locale: "en" as const,
      mapName: "Standard Farm",
      currentMapLabel: "Current map: Standard Farm",
      menuLabel: "Menu",
      controlLabels: ["Ambience", "Farm Settings", "Map", "View", "Settings"],
    },
    {
      locale: "zh" as const,
      mapName: "标准农场",
      currentMapLabel: "当前地图: 标准农场",
      menuLabel: "菜单",
      controlLabels: ["氛围", "农场设置", "地图", "视图", "设置"],
    },
  ])("routes ordered $locale menu actions and both map triggers through the real callbacks", ({
    locale, mapName, currentMapLabel, menuLabel, controlLabels,
  }) => {
    menuHookState.isEnabled = true;
    let editorViewState = createInitialEditorViewState();
    const onOpenModal = vi.fn((modalId: EditorModalId) => {
      editorViewState = openEditorModal(editorViewState, modalId);
    });
    const renderMenu = () => EditorMenuBar({
      activeModalId: editorViewState.modalId,
      locale,
      mapDisplayName: mapName,
      onCycleSeason: () => undefined,
      onOpenModal,
      season: "spring",
    });
    const initialButtons = getMenuButtons(renderMenu());
    expect(initialButtons.slice(-5).map((button) => button.props["aria-label"]))
      .toEqual(controlLabels);
    const expectedModalIds = [
      "ambience-panel", "farm-settings", "map-picker", "view-panel", "settings-panel",
    ];

    for (const [controlIndex, controlLabel] of controlLabels.entries()) {
      activateMenuButton(renderMenu(), menuLabel);
      expect(menuHookState.isExpanded).toBe(true);
      activateMenuButton(renderMenu(), controlLabel);
      expect(menuHookState.isExpanded).toBe(false);
      expect(editorViewState.modalId).toBe(expectedModalIds[controlIndex]);
      expect(onOpenModal).toHaveBeenLastCalledWith(expectedModalIds[controlIndex]);
      expect(requireMenuButton(renderMenu(), controlLabel).props["aria-expanded"]).toBe(true);
      editorViewState = closeEditorModal(editorViewState);
      expect(requireMenuButton(renderMenu(), controlLabel).props["aria-expanded"]).toBe(false);
    }

    for (const mapTriggerLabel of [currentMapLabel, controlLabels[2]]) {
      activateMenuButton(renderMenu(), mapTriggerLabel);
      expect(onOpenModal).toHaveBeenLastCalledWith("map-picker");
      expect(editorViewState.modalId).toBe("map-picker");
      expect(requireMenuButton(renderMenu(), currentMapLabel).props["aria-expanded"]).toBe(true);
      expect(requireMenuButton(renderMenu(), controlLabels[2]).props["aria-expanded"]).toBe(true);
      expect(requireMenuButton(renderMenu(), controlLabels[1]).props["aria-expanded"]).toBe(false);
      editorViewState = closeEditorModal(editorViewState);
      expect(requireMenuButton(renderMenu(), currentMapLabel).props["aria-expanded"]).toBe(false);
      expect(requireMenuButton(renderMenu(), controlLabels[2]).props["aria-expanded"]).toBe(false);
    }
  });

  it.each([
    { locale: "en" as const, controlLabel: "Farm Settings", modalId: "farm-settings" },
    { locale: "en" as const, controlLabel: "Map", modalId: "map-picker" },
    { locale: "zh" as const, controlLabel: "农场设置", modalId: "farm-settings" },
    { locale: "zh" as const, controlLabel: "地图", modalId: "map-picker" },
  ])("focuses the visible compact toggle before $locale $controlLabel collapses and opens", ({ locale, controlLabel, modalId }) => {
    menuHookState.isEnabled = true;
    menuHookState.isExpanded = true;
    let activeControl: unknown = null;
    const compactToggle = {
      getClientRects: () => [{}],
      focus: vi.fn(() => {
        expect(menuHookState.isExpanded).toBe(true);
        activeControl = compactToggle;
      }),
    };
    const onOpenModal = vi.fn(() => {
      expect(menuHookState.isExpanded).toBe(false);
      expect(activeControl).toBe(compactToggle);
    });
    const menuTree = renderFocusMenu(locale, onOpenModal);
    menuHookState.toggleReference.current = compactToggle;

    activateMenuButton(menuTree, controlLabel);

    expect(compactToggle.focus).toHaveBeenCalledOnce();
    expect(onOpenModal).toHaveBeenCalledExactlyOnceWith(modalId);
  });

  it.each(["Farm Settings", "Map", "Current map: Standard Farm"])(
    "preserves the original %s trigger when the compact toggle is hidden",
    (controlLabel) => {
      menuHookState.isEnabled = true;
      const compactToggle = { getClientRects: () => [], focus: vi.fn() };
      const onOpenModal = vi.fn();
      const menuTree = renderFocusMenu("en", onOpenModal);
      menuHookState.toggleReference.current = compactToggle;

      activateMenuButton(menuTree, controlLabel);

      expect(compactToggle.focus).not.toHaveBeenCalled();
      expect(onOpenModal).toHaveBeenCalledOnce();
    },
  );

  it("rejects a missing compact toggle before closing the menu or opening farm settings", () => {
    menuHookState.isEnabled = true;
    menuHookState.isExpanded = true;
    const onOpenModal = vi.fn();
    const menuTree = renderFocusMenu("en", onOpenModal);
    const onClick = requireMenuButton(menuTree, "Farm Settings").props.onClick;
    if (typeof onClick !== "function") throw new Error("Farm Settings click handler is missing.");

    expect(() => onClick({ currentTarget: {} })).toThrow(
      'Compact menu toggle is unavailable for modal "farm-settings"; received null.',
    );
    expect(menuHookState.isExpanded).toBe(true);
    expect(onOpenModal).not.toHaveBeenCalled();
  });

  it.each([
    { controlLabel: "Map", selector: '.editor-menu-bar__button[data-editor-modal-id="map-picker"]' },
    { controlLabel: "Current map: Standard Farm", selector: ".editor-menu-bar__map-name" },
  ])("keeps the $controlLabel focus return distinct from the other map entrance", ({ controlLabel, selector }) => {
    menuHookState.isEnabled = true;
    const mapControl = { getClientRects: () => [{}] };
    const mapNameControl = { getClientRects: () => [{}] };
    const editorRoot = {
      querySelector: (requestedSelector: string) => {
        if (requestedSelector === '.editor-menu-bar__button[data-editor-modal-id="map-picker"]') return mapControl;
        if (requestedSelector === ".editor-menu-bar__map-name") return mapNameControl;
        throw new Error(`Unexpected test focus selector ${JSON.stringify(requestedSelector)}.`);
      },
    };
    const modalElement = { closest: () => editorRoot } as unknown as HTMLElement;
    const onOpenModal = vi.fn(() => {
      expect(readEditorMenuModalFocusTarget(modalElement, "map-picker"))
        .toBe(editorRoot.querySelector(selector));
    });

    activateMenuButton(renderFocusMenu("en", onOpenModal), controlLabel, editorRoot);

    expect(onOpenModal).toHaveBeenCalledExactlyOnceWith("map-picker");
  });

  it("renders the four tools and history actions without a Zoom control", () => {
    const toolbarMarkup = renderToolbar("cursor");

    expect(toolbarMarkup).toContain('viewBox="0 0 24 24"');
    expect(toolbarMarkup).toContain('data-editor-tool="cursor"');
    expect(toolbarMarkup).toContain('data-editor-tool="multi-select"');
    expect(toolbarMarkup).toContain('data-editor-tool="fill"');
    expect(toolbarMarkup).toContain('data-editor-tool="erase"');
    expect(toolbarMarkup).toContain('data-editor-history-action="undo"');
    expect(toolbarMarkup).toContain('data-editor-history-action="redo"');
    expect(toolbarMarkup).not.toContain('data-editor-tool="zoom"');
    expect(toolbarMarkup).not.toContain("Zoom");
    expect(toolbarMarkup).not.toContain("滚轮缩放");
    expect(toolbarMarkup.match(/class="separator editor-toolbar__divider"/g)).toHaveLength(1);
    expect(toolbarMarkup).not.toContain('class="editor-toolbar__label"');
    expect(toolbarMarkup).toContain('aria-label="Select"');
    expect(toolbarMarkup).toContain('aria-label="Multi"');
    expect(toolbarMarkup).toContain('aria-label="Fill"');
    expect(toolbarMarkup).toContain('aria-label="Erase"');
    expect(toolbarMarkup).toContain('data-tooltip="Select and move items (V)"');
    expect(toolbarMarkup).toContain(
      'data-tooltip="Click or drag to select multiple items (M)"',
    );
    expect(toolbarMarkup).toContain(
      'data-tooltip="Drag a rectangle to fill items (F)"',
    );
    expect(toolbarMarkup).toContain(
      'data-tooltip="Click or drag a rectangle to erase items (E)"',
    );
    expect(toolbarMarkup).not.toMatch(
      /<button[^>]*data-editor-tool="[^"]+"[^>]*title=/,
    );

    const localizedToolbarMarkup = renderToolbar("cursor", "zh");
    expect(localizedToolbarMarkup).not.toContain('data-editor-tool="zoom"');
    expect(localizedToolbarMarkup).toContain('aria-label="选择"');
    expect(localizedToolbarMarkup).toContain('aria-label="多选"');
    expect(localizedToolbarMarkup).toContain('aria-label="填充"');
    expect(localizedToolbarMarkup).toContain('aria-label="擦除"');
    expect(localizedToolbarMarkup).toContain('data-tooltip="选择并移动物品（V）"');
    expect(localizedToolbarMarkup).toContain(
      'data-tooltip="点击或拖框多选物品（M）"',
    );
    expect(localizedToolbarMarkup).toContain(
      'data-tooltip="拖动矩形批量填充（F）"',
    );
    expect(localizedToolbarMarkup).toContain(
      'data-tooltip="点击或拖框擦除物品（E）"',
    );
    expect(localizedToolbarMarkup).toContain('aria-label="撤销"');
    expect(localizedToolbarMarkup).toContain('aria-label="重做"');
  });

  it("shows each tool usage tooltip on hover and keyboard focus", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "app/globals.css"),
      "utf8",
    );
    const editorToolTooltipSelector =
      ".planner-editor-shell .editor-toolbar .editor-toolbar__button[data-editor-tool]";

    expect(stylesheet).toContain(`${editorToolTooltipSelector}::after`);
    expect(stylesheet).toContain("content: attr(data-tooltip);");
    expect(stylesheet).toContain(`${editorToolTooltipSelector}:hover::after`);
    expect(stylesheet).toContain(
      `${editorToolTooltipSelector}:focus-visible::after`,
    );
  });

  it("renders exactly one visible selected tool or no selection", () => {
    const cases = [
      { expectedPressedLabels: [], tool: null },
      { expectedPressedLabels: ["Select"], tool: "cursor" },
      { expectedPressedLabels: ["Multi"], tool: "multi-select" },
      { expectedPressedLabels: ["Fill"], tool: "fill" },
      { expectedPressedLabels: ["Erase"], tool: "erase" },
    ] as const;

    for (const toolbarCase of cases) {
      const markup = renderToolbar(toolbarCase.tool);
      const pressedLabels = Array.from(
        markup.matchAll(/aria-label="([^"]+)" aria-pressed="true"/g),
        ([, ariaLabel]) => ariaLabel,
      );

      expect(pressedLabels).toEqual(toolbarCase.expectedPressedLabels);
    }

  });

  it("keeps each toolbar tool selected when clicked repeatedly and switches to another requested tool", () => {
    const tools = ["cursor", "multi-select", "fill", "erase"] as const;

    for (const requestedTool of tools) {
      expect(getEditorToolbarToolSelectionAfterClick(requestedTool)).toBe(
        requestedTool,
      );
      expect(getEditorToolbarToolSelectionAfterClick(requestedTool)).toBe(
        requestedTool,
      );
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
      /<button aria-label="Erase" aria-pressed="false" class="([^"]+)"/,
    )?.[1];
    const activeEraseClassName = activeMarkup.match(
      /<button aria-label="Erase" aria-pressed="true" class="([^"]+)"/,
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
      /<button aria-label="Multi" aria-pressed="false" class="([^"]+)"/,
    )?.[1];
    const selectedMultiSelectClassName = selectedToolbarMarkup.match(
      /<button aria-label="Multi" aria-pressed="true" class="([^"]+)"/,
    )?.[1];
    const selectedCursorClassName = selectedToolbarMarkup.match(
      /<button aria-label="Select" aria-pressed="false" class="([^"]+)"/,
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

  it("locks Cursor colors after generic hover without broad or false selectors", () => {
    const stylesheet = readFileSync(
      resolve(process.cwd(), "app/globals.css"),
      "utf8",
    );
    const genericToolHoverSelector =
      ".planner-editor-shell .tool-btn:hover:not(:disabled)";
    const selectedCursorSelector =
      '.planner-editor-shell .tool-btn.cursor[aria-pressed="true"]';
    const genericToolHoverRuleIndex = stylesheet.indexOf(
      `${genericToolHoverSelector} {`,
    );
    const selectedCursorRuleIndex = stylesheet.indexOf(
      `${selectedCursorSelector} {`,
    );
    const selectedCursorRuleEnd = stylesheet.indexOf(
      "}",
      selectedCursorRuleIndex,
    );
    const selectedCursorRule = stylesheet.slice(
      selectedCursorRuleIndex,
      selectedCursorRuleEnd + 1,
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
    expect(genericToolHoverRuleIndex).toBeGreaterThanOrEqual(0);
    expect(selectedCursorRuleIndex).toBeGreaterThan(genericToolHoverRuleIndex);
    expect(selectedCursorRule).toContain("background: rgb(177 58 40 / 15%);");
    expect(selectedCursorRule).toContain("color: #b13a28;");
  });
});

type MenuButton = ReactElement<Record<string, unknown>>;

function getMenuButtons(menuNode: ReactNode): MenuButton[] {
  if (Array.isArray(menuNode)) return menuNode.flatMap(getMenuButtons);
  if (!isValidElement(menuNode)) return [];

  const menuElement = menuNode as MenuButton;
  if (menuElement.type === "button") return [menuElement];
  return getMenuButtons(menuElement.props.children as ReactNode);
}

function requireMenuButton(menuNode: ReactNode, label: string): MenuButton {
  const menuButton = getMenuButtons(menuNode).find((button) => button.props["aria-label"] === label);
  if (!menuButton) throw new Error(`Menu button ${JSON.stringify(label)} is missing.`);
  return menuButton;
}

function activateMenuButton(menuNode: ReactNode, label: string, editorRoot: object = {}): void {
  const onClick = requireMenuButton(menuNode, label).props.onClick;
  if (typeof onClick !== "function") {
    throw new Error(`Menu button ${JSON.stringify(label)} has no click handler.`);
  }
  menuHookState.toggleReference.current ??= { getClientRects: () => [], focus: vi.fn() };
  onClick({ currentTarget: { closest: () => editorRoot } });
}

function renderFocusMenu(locale: "en" | "zh", onOpenModal: (modalId: EditorModalId) => void): ReturnType<typeof EditorMenuBar> {
  return EditorMenuBar({
    activeModalId: null,
    locale,
    mapDisplayName: "Standard Farm",
    onCycleSeason: () => undefined,
    onOpenModal,
    season: "spring",
  });
}
