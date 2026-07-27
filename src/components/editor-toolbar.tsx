"use client";

import {
  editorToolAvailability,
  type EditorTool,
} from "../editor/editor-view-state";

type EditorToolbarProperties = Readonly<{
  tool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}>;

const editorToolControls: readonly Readonly<{
  tool: EditorTool;
  label: string;
  glyph: string;
}>[] = [
  { tool: "cursor", label: "Cursor tool", glyph: "↖" },
  { tool: "multi-select", label: "Multi-select tool", glyph: "▦" },
  { tool: "erase", label: "Erase tool", glyph: "⌫" },
];

export function EditorToolbar({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorToolbarProperties) {
  return (
    <div aria-label="Editor tools" className="editor-toolbar" role="toolbar">
      {editorToolControls.map((editorToolControl) => {
        const isSelected = tool === editorToolControl.tool;
        const isAvailable = editorToolAvailability[editorToolControl.tool];

        return (
          <button
            aria-label={editorToolControl.label}
            aria-pressed={isSelected}
            className="editor-toolbar__button"
            disabled={!isAvailable}
            key={editorToolControl.tool}
            onClick={() => onToolChange(editorToolControl.tool)}
            title={editorToolControl.label}
            type="button"
          >
            <span aria-hidden="true" className="editor-toolbar__glyph">
              {editorToolControl.glyph}
            </span>
          </button>
        );
      })}
      <span aria-hidden="true" className="editor-toolbar__divider" />
      <button
        aria-label="Undo"
        className="editor-toolbar__button"
        disabled={!canUndo}
        onClick={onUndo}
        title="Undo (Ctrl+Z)"
        type="button"
      >
        <span aria-hidden="true" className="editor-toolbar__glyph">
          ↶
        </span>
      </button>
      <button
        aria-label="Redo"
        className="editor-toolbar__button"
        disabled={!canRedo}
        onClick={onRedo}
        title="Redo (Ctrl+Y)"
        type="button"
      >
        <span aria-hidden="true" className="editor-toolbar__glyph">
          ↷
        </span>
      </button>
    </div>
  );
}
