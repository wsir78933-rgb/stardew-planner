"use client";

import {
  editorToolAvailability,
  type EditorTool,
} from "../editor/editor-view-state";
import {
  PlannerReferenceIcon,
  type PlannerReferenceIconName,
} from "./planner-reference-icon";

type EditorToolbarLocale = "en" | "zh";

type EditorToolbarProperties = Readonly<{
  tool: EditorTool | null;
  onToolChange: (tool: EditorTool | null) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  includeZoom?: boolean;
  locale?: EditorToolbarLocale;
}>;

type EditorToolbarControl = Readonly<{
  icon: PlannerReferenceIconName;
  key: "select" | "multi" | "fill" | "erase";
  tool: Extract<EditorTool, "cursor" | "multi-select" | "fill" | "erase">;
}>;

const editorToolbarControls = [
  { tool: "cursor", key: "select", icon: "Select" },
  { tool: "multi-select", key: "multi", icon: "Multi" },
  { tool: "fill", key: "fill", icon: "Fill" },
  { tool: "erase", key: "erase", icon: "Erase" },
] as const satisfies readonly EditorToolbarControl[];

const editorToolbarCopyByLocale = {
  en: {
    toolbar: "Editor tools",
    select: "Select",
    multi: "Multi",
    fill: "Fill",
    erase: "Erase",
    zoom: "Zoom",
    undo: "Undo",
    redo: "Redo",
  },
  zh: {
    toolbar: "编辑工具",
    select: "选择",
    multi: "多选",
    fill: "填充",
    erase: "擦除",
    zoom: "缩放",
    undo: "撤销",
    redo: "重做",
  },
} as const;

export function getEditorToolbarToolSelectionAfterClick(
  currentTool: EditorTool | null,
  requestedTool: EditorTool,
): EditorTool | null {
  return currentTool === requestedTool ? null : requestedTool;
}

export function EditorToolbar({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  includeZoom = true,
  locale = "en",
}: EditorToolbarProperties) {
  const editorToolbarCopy = editorToolbarCopyByLocale[locale];
  const isZoomSelected = tool === "zoom";
  const renderToolButton = (editorToolbarControl: EditorToolbarControl) => {
    const isSelected = tool === editorToolbarControl.tool;
    const isAvailable = editorToolAvailability[editorToolbarControl.tool];
    const controlLabel = editorToolbarCopy[editorToolbarControl.key];

    return (
      <button
        aria-label={controlLabel}
        aria-pressed={isSelected}
        className={getEditorToolbarButtonClassName(editorToolbarControl, isSelected)}
        data-editor-tool={editorToolbarControl.tool}
        disabled={!isAvailable}
        key={editorToolbarControl.tool}
        onClick={() =>
          onToolChange(
            getEditorToolbarToolSelectionAfterClick(tool, editorToolbarControl.tool),
          )
        }
        title={controlLabel}
        type="button"
      >
        <PlannerReferenceIcon name={editorToolbarControl.icon} size={20} />
        <span className="editor-toolbar__label">{controlLabel}</span>
      </button>
    );
  };

  return (
    <div className="toolbar-wrapper planner-editor-toolbar" data-planner-toolbar>
      <div
        aria-label={editorToolbarCopy.toolbar}
        className="toolbar editor-toolbar"
        role="toolbar"
      >
        <div className="tool-group editor-toolbar__tool-group">
          {editorToolbarControls.map(renderToolButton)}
        </div>
        {includeZoom ? (
          <>
            <span aria-hidden="true" className="separator editor-toolbar__divider" />
            <div
              aria-label={editorToolbarCopy.zoom}
              className="tool-group editor-wheel-zoom-group"
              role="group"
            >
              <button
                aria-label={isZoomSelected ? getZoomDisableLabel(locale) : getZoomEnableLabel(locale)}
                aria-pressed={isZoomSelected}
                className="tool-btn editor-toolbar__button editor-wheel-zoom-button"
                data-editor-tool="zoom"
                data-editor-wheel-zoom-button="true"
                onClick={() =>
                  onToolChange(getEditorToolbarToolSelectionAfterClick(tool, "zoom"))
                }
                title={isZoomSelected ? getZoomDisableLabel(locale) : getZoomEnableLabel(locale)}
                type="button"
              >
                <span className="editor-toolbar__label">{editorToolbarCopy.zoom}</span>
              </button>
            </div>
            <span aria-hidden="true" className="separator editor-toolbar__divider" />
          </>
        ) : (
          <span aria-hidden="true" className="separator editor-toolbar__divider" />
        )}
        <div aria-label="History" className="tool-group editor-toolbar__history-group" role="group">
          <button
            aria-label={editorToolbarCopy.undo}
            className="tool-btn editor-toolbar__button editor-toolbar__history-button"
            data-editor-history-action="undo"
            disabled={!canUndo}
            onClick={onUndo}
            title={getHistoryTitle(locale, "undo")}
            type="button"
          >
            <PlannerReferenceIcon name="Undo" size={20} />
          </button>
          <button
            aria-label={editorToolbarCopy.redo}
            className="tool-btn editor-toolbar__button editor-toolbar__history-button"
            data-editor-history-action="redo"
            disabled={!canRedo}
            onClick={onRedo}
            title={getHistoryTitle(locale, "redo")}
            type="button"
          >
            <PlannerReferenceIcon name="Redo" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function getEditorToolbarButtonClassName(
  editorToolbarControl: EditorToolbarControl,
  isSelected: boolean,
): string {
  let className = "tool-btn editor-toolbar__button";

  if (editorToolbarControl.tool === "multi-select") {
    className += " multi-select";
  }

  if (editorToolbarControl.tool === "erase") {
    className += " erase-hover";
    if (isSelected) {
      className += " erase";
    }
  }

  if (editorToolbarControl.tool === "fill") {
    className += " fill";
  }

  if (editorToolbarControl.tool === "cursor") {
    className += " cursor";
  }

  return className + (isSelected ? " active" : "");
}

function getZoomEnableLabel(locale: EditorToolbarLocale): string {
  return locale === "zh" ? "启用滚轮缩放" : "Enable wheel zoom";
}

function getZoomDisableLabel(locale: EditorToolbarLocale): string {
  return locale === "zh" ? "关闭滚轮缩放" : "Disable wheel zoom";
}

function getHistoryTitle(
  locale: EditorToolbarLocale,
  action: "undo" | "redo",
): string {
  if (locale === "zh") {
    return action === "undo" ? "撤销（Ctrl+Z）" : "重做（Ctrl+Y）";
  }

  return action === "undo" ? "Undo (Ctrl+Z)" : "Redo (Ctrl+Y)";
}
