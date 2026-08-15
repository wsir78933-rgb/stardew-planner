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

  it("describes Q as cycling the selected item appearance", () => {
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
      "<dt>Q</dt><dd>Cycle the selected item appearance</dd>",
    );
    expect(keyboardShortcutsMarkup).not.toContain(
      "Rotate the selected item",
    );
  });
});

describe("editor modal localized View and Settings content", () => {
  it("renders Chinese headings, controls, tooltips, state labels, and Save dialog copy", () => {
    const copy = getEditorModalCopy("zh-CN");
    const viewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy,
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
    expect(viewMarkup).toContain("覆盖层");
    expect(viewMarkup).toContain("洒水器范围");
    expect(viewMarkup).toContain('title="在地图上显示地块网格线"');
    expect(viewMarkup).toContain('data-state-label="开"');
    expect(viewMarkup).toContain('data-state-label="关"');
    expect(viewMarkup).toContain("关闭对话框");
    expect(settingsMarkup).toContain("设置");
    expect(settingsMarkup).toContain("移动端");
    expect(settingsMarkup).toContain("自由放置");
    expect(settingsMarkup).toContain('title="在触控设备上显示方向键，便于精确放置物品"');
    expect(settingsMarkup).toContain('href="/zh/privacy"');
    expect(settingsMarkup).toContain('href="/zh/terms"');
    expect(saveMarkup).toMatch(/<h2[^>]*>保存<\/h2>/);
    expect(saveMarkup).toMatch(
      /<header class="editor-modal__header"><h2[^>]*>保存<\/h2><button aria-label="关闭对话框" type="button">×<\/button><\/header>/,
    );
    expect(englishSaveMarkup).toMatch(/<h2[^>]*>Save<\/h2>/);
    expect(englishSaveMarkup).toMatch(
      /<header class="editor-modal__header"><h2[^>]*>Save<\/h2><button aria-label="Close dialog" type="button">×<\/button><\/header>/,
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
      'class="editor-modal editor-modal--view-panel"',
    );
    expect(settingsModalMarkup).toContain(
      'class="editor-modal editor-modal--settings-panel"',
    );
    expect(helpModalMarkup).toContain(
      'class="editor-modal editor-modal--help-info"',
    );
    expect(keyboardModalMarkup).toContain('class="editor-modal"');
    expect(whatsNewModalMarkup).toContain('class="editor-modal"');
    expect(keyboardModalMarkup).not.toContain("editor-modal--keyboard-shortcuts");
    expect(whatsNewModalMarkup).not.toContain("editor-modal--whats-new");
  });

  it("fixes only Save, View, Settings, and Help backdrops to the viewport", () => {
    const viewportFixedModalIds = [
      "save-panel",
      "view-panel",
      "settings-panel",
      "help-info",
    ] as const satisfies readonly EditorModalId[];
    const editorShellPositionedModalIds = [
      "map-picker",
      "keyboard-shortcuts",
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
