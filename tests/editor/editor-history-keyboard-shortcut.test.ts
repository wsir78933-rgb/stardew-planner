import { describe, expect, it } from "vitest";
import { getEditorHistoryKeyboardShortcut } from "../../src/editor/editor-history-keyboard-shortcut";

describe("editor history keyboard shortcut", () => {
  it("maps Ctrl or Cmd Z to undo", () => {
    expect(
      getEditorHistoryKeyboardShortcut({
        altKey: false,
        ctrlKey: true,
        key: "z",
        metaKey: false,
        shiftKey: false,
      }),
    ).toBe("undo");
    expect(
      getEditorHistoryKeyboardShortcut({
        altKey: false,
        ctrlKey: false,
        key: "Z",
        metaKey: true,
        shiftKey: false,
      }),
    ).toBe("undo");
  });

  it("maps Ctrl Y and Ctrl or Cmd Shift Z to redo", () => {
    expect(
      getEditorHistoryKeyboardShortcut({
        altKey: false,
        ctrlKey: true,
        key: "y",
        metaKey: false,
        shiftKey: false,
      }),
    ).toBe("redo");
    expect(
      getEditorHistoryKeyboardShortcut({
        altKey: false,
        ctrlKey: false,
        key: "z",
        metaKey: true,
        shiftKey: true,
      }),
    ).toBe("redo");
  });

  it("ignores incomplete or conflicting modifier combinations", () => {
    expect(
      getEditorHistoryKeyboardShortcut({
        altKey: false,
        ctrlKey: false,
        key: "z",
        metaKey: false,
        shiftKey: false,
      }),
    ).toBeNull();
    expect(
      getEditorHistoryKeyboardShortcut({
        altKey: true,
        ctrlKey: true,
        key: "z",
        metaKey: false,
        shiftKey: false,
      }),
    ).toBeNull();
  });
});
