"use client";

import {
  editorToolAvailability,
  type EditorTool,
} from "../editor/editor-view-state";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

type EditorToolbarProperties = Readonly<{
  locale?: SiteLocale;
  tool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}>;

const editorToolControls: readonly Readonly<{
  tool: EditorTool;
  labelKey: string;
  glyph: string;
}>[] = [
  { tool: "cursor", labelKey: "planner.toolbar.cursorTool", glyph: "↖" },
  { tool: "multi-select", labelKey: "planner.toolbar.multiSelectTool", glyph: "▦" },
  { tool: "erase", labelKey: "planner.toolbar.eraseTool", glyph: "⌫" },
];

export function EditorToolbar({
  locale = "en",
  tool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorToolbarProperties) {
  return (
    <div aria-label={translate(locale, "planner.toolbar.label")} className="editor-toolbar" role="toolbar">
      {editorToolControls.map((editorToolControl) => {
        const isSelected = tool === editorToolControl.tool;
        const isAvailable = editorToolAvailability[editorToolControl.tool];
        const label = translate(locale, editorToolControl.labelKey);

        return (
          <button
            aria-label={label}
            aria-pressed={isSelected}
            className="editor-toolbar__button"
            disabled={!isAvailable}
            key={editorToolControl.tool}
            onClick={() => onToolChange(editorToolControl.tool)}
            title={label}
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
        aria-label={translate(locale, "planner.toolbar.undo")}
        className="editor-toolbar__button"
        disabled={!canUndo}
        onClick={onUndo}
        title={translate(locale, "planner.toolbar.undoShortcut")}
        type="button"
      >
        <span aria-hidden="true" className="editor-toolbar__glyph">
          ↶
        </span>
      </button>
      <button
        aria-label={translate(locale, "planner.toolbar.redo")}
        className="editor-toolbar__button"
        disabled={!canRedo}
        onClick={onRedo}
        title={translate(locale, "planner.toolbar.redoShortcut")}
        type="button"
      >
        <span aria-hidden="true" className="editor-toolbar__glyph">
          ↷
        </span>
      </button>
    </div>
  );
}
