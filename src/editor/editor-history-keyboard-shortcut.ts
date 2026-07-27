export type EditorHistoryKeyboardShortcut = "undo" | "redo";

type KeyboardShortcutInput = Readonly<{
  altKey: boolean;
  ctrlKey: boolean;
  key: string;
  metaKey: boolean;
  shiftKey: boolean;
}>;

export function getEditorHistoryKeyboardShortcut(
  keyboardShortcutInput: KeyboardShortcutInput,
): EditorHistoryKeyboardShortcut | null {
  if (
    keyboardShortcutInput.altKey ||
    (!keyboardShortcutInput.ctrlKey && !keyboardShortcutInput.metaKey)
  ) {
    return null;
  }

  const normalizedKey = keyboardShortcutInput.key.toLowerCase();

  if (normalizedKey === "z") {
    return keyboardShortcutInput.shiftKey ? "redo" : "undo";
  }

  if (normalizedKey === "y" && !keyboardShortcutInput.shiftKey) {
    return "redo";
  }

  return null;
}
