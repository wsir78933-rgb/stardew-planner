import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  EditorModal,
  shouldHandleEditorModalKeyboardEvent,
} from "../../src/components/editor-modal";
import { closeModalFromBackdropClick } from "../../src/components/modal-backdrop-close";
import { getEditorModalCopy } from "../../src/i18n/editor-modal-copy";
import {
  editorModalIds,
  type EditorModalId,
} from "../../src/editor/editor-view-state";

describe("editor reference information dialogs", () => {
  it("registers the three source-reference information dialogs", () => {
    expect(editorModalIds).toContain("help-info");
    expect(editorModalIds).toContain("keyboard-shortcuts");
    expect(editorModalIds).toContain("whats-new");
    expect(editorModalIds).not.toContain("season-picker");
  });

  it("registers the menu panels used by the top navigation", () => {
    expect(editorModalIds).toContain("ambience-panel");
    expect(editorModalIds).toContain("map-options");
    expect(editorModalIds).toContain("feedback");
    expect(editorModalIds).toContain("map-picker");
    expect(editorModalIds).toContain("save-panel");
  });

  it("renders local-only help without feedback or support actions", () => {
    const helpDialogMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "help-info",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );

    expect(helpDialogMarkup).toContain("Help &amp; Info");
    expect(helpDialogMarkup).toContain("Click Cycling");
    expect(helpDialogMarkup).toContain("X-ray");
    expect(helpDialogMarkup).not.toContain("Feedback");
    expect(helpDialogMarkup).not.toContain("Support");
  });

  it("documents Q as rotating or cycling the selected or placed item variant", () => {
    const keyboardShortcutsMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "keyboard-shortcuts",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );

    expect(keyboardShortcutsMarkup).toContain(
      "<dt><kbd>Q</kbd></dt><dd>Rotate or cycle variant on selected/placed item</dd>",
    );
    expect(keyboardShortcutsMarkup).toContain(
      "<dt><kbd>Ctrl / ⌘</kbd></dt><dd>X-ray: hold to see behind overlapping sprites</dd>",
    );
  });
});

describe("editor modal localized View and Settings content", () => {
  it("renders localized View and Settings groups with pressed states and Save dialog copy", () => {
    const copy = getEditorModalCopy("zh-CN");
    const viewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy,
        locale: "zh",
        modalId: "view-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "bus-stop",
      }),
    );
    const settingsMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy,
        locale: "zh",
        modalId: "settings-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const saveMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy,
        locale: "zh",
        modalId: "save-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        savePanelContent: createElement("p", null, "Save content"),
        selectedMapId: "standard",
      }),
    );
    const englishSaveMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "save-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        savePanelContent: createElement("p", null, "Save content"),
        selectedMapId: "standard",
      }),
    );

    expect(viewMarkup).toContain("视图");
    expect(viewMarkup).toContain("覆盖范围");
    expect(viewMarkup).toContain('<span class="editor-config-switch__label">洒水器</span>');
    expect(viewMarkup).toContain('<span class="editor-config-switch__label">资源巨块</span>');
    expect(viewMarkup).toContain('aria-pressed="false"');
    expect(viewMarkup).toContain('aria-pressed="true"');
    expect(viewMarkup).toContain(
      `class="editor-config-switch__state">${copy.stateLabel(false)}</span>`,
    );
    expect(viewMarkup).toContain(
      `class="editor-config-switch__state">${copy.stateLabel(true)}</span>`,
    );
    expect(viewMarkup).toContain("关闭对话框");
    expect(settingsMarkup).toContain("设置");
    expect(settingsMarkup).toContain("触屏");
    expect(settingsMarkup).toContain("显示摇杆");
    expect(settingsMarkup).toContain("左手模式");
    expect(settingsMarkup).toContain("自由放置");
    expect(settingsMarkup).toContain('title="禁用放置规则，可在地图任意位置放置物品"');
    expect(settingsMarkup).toContain('href="/zh/privacy"');
    expect(settingsMarkup).toContain('href="/zh/terms"');
    expect(saveMarkup).toMatch(/<h2[^>]*>本地项目<\/h2>/);
    expect(saveMarkup).toMatch(
      /<header class="editor-modal__header"><h2[^>]*>本地项目<\/h2><button aria-label="关闭对话框" type="button">×<\/button><\/header>/,
    );
    expect(englishSaveMarkup).toMatch(/<h2[^>]*>Library<\/h2>/);
    expect(englishSaveMarkup).toMatch(
      /<header class="editor-modal__header"><h2[^>]*>Library<\/h2><button aria-label="Close dialog" type="button">×<\/button><\/header>/,
    );
  });
});

describe("editor modal keyboard event containment", () => {
  it("handles a keyboard event from inside the outer modal", () => {
    const containedTarget = {} as EventTarget;
    const modalElement = createFakeModalElement(containedTarget);

    expect(
      shouldHandleEditorModalKeyboardEvent(modalElement, containedTarget),
    ).toBe(true);
  });

  it("ignores a keyboard event from portalled content", () => {
    const containedTarget = {} as EventTarget;
    const portalledTarget = {} as EventTarget;
    const modalElement = createFakeModalElement(containedTarget);

    expect(
      shouldHandleEditorModalKeyboardEvent(modalElement, portalledTarget),
    ).toBe(false);
  });

  it("rejects a keyboard event without a target", () => {
    const modalElement = createFakeModalElement({} as EventTarget);

    expect(() =>
      shouldHandleEditorModalKeyboardEvent(modalElement, null),
    ).toThrow(/event target.*null/i);
  });
});

describe("editor modal backdrop click handling", () => {
  it("calls onClose only when the click target is the backdrop itself", () => {
    const backdropTarget = {} as EventTarget;
    const dialogTarget = {} as EventTarget;
    const nestedTarget = {} as EventTarget;
    let closeCount = 0;
    const onClose = (): void => {
      closeCount += 1;
    };

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: backdropTarget,
      onClose,
    });
    expect(closeCount).toBe(1);

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: dialogTarget,
      onClose,
    });
    expect(closeCount).toBe(1);

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: nestedTarget,
      onClose,
    });
    expect(closeCount).toBe(1);
  });
});

describe("editor modal visual variants", () => {
  it("adds only the approved content-specific modal modifiers", () => {
    const saveModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "save-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        savePanelContent: createElement("p", null, "Save content"),
        selectedMapId: "standard",
      }),
    );
    const mapPickerModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "map-picker",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const viewModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "view-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const settingsModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "settings-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const ambienceModalMarkup = renderEditorModalMarkup("ambience-panel");
    const mapOptionsModalMarkup = renderEditorModalMarkup("map-options");
    const feedbackModalMarkup = renderEditorModalMarkup("feedback");
    const helpModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "help-info",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const keyboardModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "keyboard-shortcuts",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const whatsNewModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "whats-new",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );

    expect(saveModalMarkup).toContain(
      'class="editor-modal editor-modal--save-panel"',
    );
    expect(mapPickerModalMarkup).toContain(
      'class="editor-modal editor-modal--map-picker"',
    );
    expect(viewModalMarkup).toContain(
      'class="editor-modal editor-modal--view-panel editor-modal--popover"',
    );
    expect(settingsModalMarkup).toContain(
      'class="editor-modal editor-modal--settings-panel editor-modal--popover"',
    );
    expect(ambienceModalMarkup).toContain(
      'class="editor-modal editor-modal--ambience-panel editor-modal--popover"',
    );
    expect(mapOptionsModalMarkup).toContain(
      'class="editor-modal editor-modal--map-options editor-modal--popover"',
    );
    expect(feedbackModalMarkup).toContain(
      'class="editor-modal editor-modal--feedback"',
    );
    expect(helpModalMarkup).toContain(
      'class="editor-modal editor-modal--help-info"',
    );
    expect(keyboardModalMarkup).toContain(
      'class="editor-modal editor-modal--shortcuts"',
    );
    expect(whatsNewModalMarkup).toContain('class="editor-modal"');
    expect(whatsNewModalMarkup).not.toContain("editor-modal--whats-new");
  });

  it("fixes full-screen modal backdrops and keeps menu popovers anchored to the editor", () => {
    const viewportFixedModalIds = [
      "save-panel",
      "view-panel",
      "settings-panel",
      "help-info",
      "feedback",
      "keyboard-shortcuts",
    ] as const satisfies readonly EditorModalId[];
    const editorShellPositionedModalIds = [
      "ambience-panel",
      "map-options",
      "map-picker",
      "whats-new",
    ] as const satisfies readonly EditorModalId[];

    for (const modalId of viewportFixedModalIds) {
      expect(renderEditorModalMarkup(modalId)).toContain(
        'class="editor-modal__backdrop editor-modal__backdrop--viewport-fixed"',
      );
    }

    for (const modalId of editorShellPositionedModalIds) {
      const modalMarkup = renderEditorModalMarkup(modalId);

      expect(modalMarkup).toContain('class="editor-modal__backdrop"');
      expect(modalMarkup).not.toContain(
        "editor-modal__backdrop--viewport-fixed",
      );
    }
  });
});

function renderEditorModalMarkup(modalId: EditorModalId): string {
  return renderToStaticMarkup(
    createElement(EditorModal, {
      copy: getEditorModalCopy("en"),
      modalId,
      onClose: () => undefined,
      onMapChange: () => undefined,
      onPanelPositionChange: () => undefined,
      panelPosition: "bottom",
      selectedMapId: "standard",
    }),
  );
}

function createFakeModalElement(
  containedTarget: EventTarget,
): Pick<HTMLElement, "contains"> {
  return {
    contains(candidate: Node | null): boolean {
      return (candidate as EventTarget | null) === containedTarget;
    },
  };
}
