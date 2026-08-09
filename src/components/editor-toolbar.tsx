"use client";

import {
  editorToolAvailability,
  type EditorTool,
} from "../editor/editor-view-state";
import {
  Eraser,
  MousePointer2,
  PaintBucket,
  Redo2,
  SquareDashedMousePointer,
  Undo2,
} from "lucide-react";

type EditorToolbarProperties = Readonly<{
  tool: EditorTool | null;
  onToolChange: (tool: EditorTool | null) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}>;

const editorToolControls: readonly Readonly<{
  tool: EditorTool;
  label: string;
  icon: typeof MousePointer2;
}>[] = [
  { tool: "cursor", label: "Cursor tool", icon: MousePointer2 },
  {
    tool: "multi-select",
    label: "Multi-select tool",
    icon: SquareDashedMousePointer,
  },
  { tool: "fill", label: "Fill tool", icon: PaintBucket },
  { tool: "erase", label: "Erase tool", icon: Eraser },
];

export function EditorToolbar({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorToolbarProperties) {
  const isZoomSelected = tool === "zoom";
  const renderToolButton = (editorToolControl: (typeof editorToolControls)[number]) => {
    const isSelected = tool === editorToolControl.tool;
    const isAvailable = editorToolAvailability[editorToolControl.tool];
    const ToolIcon = editorToolControl.icon;

    return (
      <button
        aria-label={editorToolControl.label}
        aria-pressed={isSelected}
        className={`tool-btn editor-toolbar__button${
          editorToolControl.tool === "multi-select" ? " multi-select" : ""
        }${
          editorToolControl.tool === "erase"
            ? ` erase-hover${isSelected ? " erase" : ""}`
            : ""
        }${editorToolControl.tool === "fill" ? " fill" : ""}${
          editorToolControl.tool === "cursor" ? " cursor" : ""
        }${
          isSelected ? " active" : ""
        }`}
        disabled={!isAvailable}
        key={editorToolControl.tool}
        onClick={() => onToolChange(isSelected ? null : editorToolControl.tool)}
        title={editorToolControl.label}
        type="button"
      >
        <ToolIcon aria-hidden="true" size={18} strokeWidth={2} />
      </button>
    );
  };

  return (
    <div className="toolbar-wrapper planner-editor-toolbar" data-planner-toolbar>
      <div
        aria-label="Editor tools"
        className="toolbar editor-toolbar"
        role="toolbar"
      >
        <div className="tool-group">
          {editorToolControls
            .filter((editorToolControl) =>
              editorToolControl.tool === "cursor" ||
              editorToolControl.tool === "multi-select" ||
              editorToolControl.tool === "fill",
            )
            .map(renderToolButton)}
        </div>
        <span aria-hidden="true" className="separator editor-toolbar__divider" />
        <div className="tool-group">
          {renderToolButton(editorToolControls[3])}
        </div>
        <span aria-hidden="true" className="separator editor-toolbar__divider" />
        <div
          aria-label="Wheel zoom"
          className="tool-group reference-runtime-wheel-zoom-group"
          role="group"
        >
          <button
            aria-label={isZoomSelected ? "Disable wheel zoom" : "Enable wheel zoom"}
            aria-pressed={isZoomSelected}
            className="tool-btn editor-toolbar__button reference-runtime-wheel-zoom-button"
            data-reference-runtime-wheel-zoom-button="true"
            onClick={() => onToolChange(isZoomSelected ? null : "zoom")}
            title={isZoomSelected ? "Disable wheel zoom" : "Enable wheel zoom"}
            type="button"
          >
            Zoom
          </button>
        </div>
        <span aria-hidden="true" className="separator editor-toolbar__divider" />
        <div className="tool-group">
          <button
            aria-label="Undo"
            className="tool-btn editor-toolbar__button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            type="button"
          >
            <Undo2 aria-hidden="true" size={18} strokeWidth={2} />
          </button>
          <button
            aria-label="Redo"
            className="tool-btn editor-toolbar__button"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            type="button"
          >
            <Redo2 aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
