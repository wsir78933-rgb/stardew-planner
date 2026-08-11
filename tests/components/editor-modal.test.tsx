import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  EditorModal,
  shouldHandleEditorModalKeyboardEvent,
} from "../../src/components/editor-modal";
import { closeModalFromBackdropClick } from "../../src/components/modal-backdrop-close";
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
