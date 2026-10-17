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
  wheelZoomEnabled: boolean;
  onWheelZoomToggle: () => void;
  canUndo: boolean;
  canRedo: boolean;
  locale?: EditorToolbarLocale;
  isToolDisabled?: (tool: EditorTool) => boolean;
}>;

type EditorToolbarControl = Readonly<{
  icon: PlannerReferenceIconName;
  key: "select" | "multi" | "fill" | "erase";
  tooltipKey:
    | "selectTooltip"
    | "multiTooltip"
    | "fillTooltip"
    | "eraseTooltip";
  tool: Extract<EditorTool, "cursor" | "multi-select" | "fill" | "erase">;
}>;

const editorToolbarControls = [
  {
    tool: "cursor",
    key: "select",
    tooltipKey: "selectTooltip",
    icon: "Select",
  },
  {
    tool: "multi-select",
    key: "multi",
    tooltipKey: "multiTooltip",
    icon: "Multi",
  },
  { tool: "fill", key: "fill", tooltipKey: "fillTooltip", icon: "Fill" },
  {
    tool: "erase",
    key: "erase",
    tooltipKey: "eraseTooltip",
    icon: "Erase",
  },
] as const satisfies readonly EditorToolbarControl[];

const editorToolbarCopyByLocale = {
  en: {
    toolbar: "Editor tools",
    select: "Select",
    multi: "Multi",
    fill: "Fill",
    erase: "Erase",
    selectTooltip: "Select and move items (V)",
    multiTooltip: "Click or drag to select multiple items (M)",
    fillTooltip: "Drag a rectangle to fill items (F)",
    eraseTooltip: "Click or drag a rectangle to erase items (E)",
    zoom: "Zoom",
    zoomTooltip: "Toggle scroll wheel zoom and align the planner in view: scroll up to zoom in, down to zoom out",
    undo: "Undo",
    redo: "Redo",
  },
  zh: {
    toolbar: "编辑工具",
    select: "选择",
    multi: "多选",
    fill: "填充",
    erase: "擦除",
    selectTooltip: "选择并移动物品（V）",
    multiTooltip: "点击或拖框多选物品（M）",
    fillTooltip: "拖动矩形批量填充（F）",
    eraseTooltip: "点击或拖框擦除物品（E）",
    zoom: "缩放",
    zoomTooltip: "点击开启/关闭滚轮缩放，并将规划器对齐到窗口：上滚放大，下滚缩小",
    undo: "撤销",
    redo: "重做",
  },
} as const;

export function getEditorToolbarToolSelectionAfterClick(
  requestedTool: EditorToolbarControl["tool"],
): EditorToolbarControl["tool"] {
  return requestedTool;
}

export function EditorToolbar({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  wheelZoomEnabled,
  onWheelZoomToggle,
  canUndo,
  canRedo,
  locale = "en",
  isToolDisabled,
}: EditorToolbarProperties) {
  const editorToolbarCopy = editorToolbarCopyByLocale[locale];
  const renderToolButton = (editorToolbarControl: EditorToolbarControl) => {
    const isSelected = tool === editorToolbarControl.tool;
    const isAvailable =
      editorToolAvailability[editorToolbarControl.tool] &&
      !isToolDisabled?.(editorToolbarControl.tool);
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
            getEditorToolbarToolSelectionAfterClick(editorToolbarControl.tool),
          )
        }
        data-tooltip={editorToolbarCopy[editorToolbarControl.tooltipKey]}
        type="button"
      >
        <PlannerReferenceIcon name={editorToolbarControl.icon} size={20} />
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
          <button
            aria-label={editorToolbarCopy.zoom}
            aria-pressed={wheelZoomEnabled}
            className={`tool-btn editor-toolbar__button editor-wheel-zoom-button${wheelZoomEnabled ? " active" : ""}`}
            data-wheel-zoom-toggle=""
            data-tooltip={editorToolbarCopy.zoomTooltip}
            onKeyDown={(keyboardEvent) => {
              if (keyboardEvent.key === " " || keyboardEvent.key === "Spacebar") {
                keyboardEvent.stopPropagation();
              }
            }}
            onClick={onWheelZoomToggle}
            type="button"
          >
            <PlannerReferenceIcon name="Zoom" size={20} />
          </button>
        </div>
        <span aria-hidden="true" className="separator editor-toolbar__divider" />
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

function getHistoryTitle(
  locale: EditorToolbarLocale,
  action: "undo" | "redo",
): string {
  if (locale === "zh") {
    return action === "undo" ? "撤销（Ctrl+Z）" : "重做（Ctrl+Y）";
  }

  return action === "undo" ? "Undo (Ctrl+Z)" : "Redo (Ctrl+Y)";
}
