import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  EditorModal,
  shouldHandleEditorModalKeyboardEvent,
} from "../../src/components/editor-modal";
import { editorModalIds } from "../../src/editor/editor-view-state";

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

describe("editor modal visual variants", () => {
  it("adds the Save-only modal modifier without changing other dialogs", () => {
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

    expect(saveModalMarkup).toContain(
      'class="editor-modal editor-modal--save-panel"',
    );
    expect(helpModalMarkup).toContain('class="editor-modal"');
    expect(helpModalMarkup).not.toContain("editor-modal--save-panel");
  });
});

function createFakeModalElement(
  containedTarget: EventTarget,
): Pick<HTMLElement, "contains"> {
  return {
    contains(candidate: Node | null): boolean {
      return (candidate as EventTarget | null) === containedTarget;
    },
  };
}
