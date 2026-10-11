"use client";

import { useId, useState } from "react";
import type { EditorModalId } from "../editor/editor-view-state";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import {
  PlannerReferenceIcon,
  type PlannerReferenceIconName,
} from "./planner-reference-icon";

type EditorMenuBarLocale = "en" | "zh";

type EditorMenuBarProperties = Readonly<{
  activeModalId: EditorModalId | null;
  leftHandMode?: boolean;
  locale?: EditorMenuBarLocale;
  mapDisplayName: string;
  onCycleSeason: () => void;
  onOpenModal: (modalId: EditorModalId) => void;
  projectDisplayName?: string;
  season: TilesheetSeason;
}>;

type EditorMenuControlKey = "ambience" | "map" | "view" | "settings";

type EditorMenuControl = Readonly<{
  icon: PlannerReferenceIconName;
  key: EditorMenuControlKey;
  modalId: Extract<EditorModalId, "ambience-panel" | "map-options" | "view-panel" | "settings-panel">;
}>;

const editorHeaderUtilityControls = [
  { icon: "Help", key: "help", modalId: "help-info" },
  { icon: "Keyboard", key: "keyboard", modalId: "keyboard-shortcuts" },
  { icon: "Feedback", key: "feedback", modalId: "feedback" },
] as const satisfies readonly Readonly<{
  icon: PlannerReferenceIconName;
  key: "help" | "keyboard" | "feedback";
  modalId: Extract<EditorModalId, "help-info" | "keyboard-shortcuts" | "feedback">;
}>[];

const editorHeaderMenuControls = [
  { icon: "Ambience", key: "ambience", modalId: "ambience-panel" },
  { icon: "Map", key: "map", modalId: "map-options" },
  { icon: "View", key: "view", modalId: "view-panel" },
  { icon: "Settings", key: "settings", modalId: "settings-panel" },
] as const satisfies readonly EditorMenuControl[];

const editorMenuCopyByLocale = {
  en: {
    navigation: "Editor navigation",
    brand: "Stardew Planner",
    utilities: "Help and feedback",
    help: "Help",
    keyboard: "Keyboard shortcuts",
    feedback: "Feedback",
    library: "Library",
    currentMap: "Current map",
    features: "Editor options",
    menu: "Menu",
    ambience: "Ambience",
    map: "Map",
    view: "View",
    settings: "Settings",
  },
  zh: {
    navigation: "编辑器导航",
    brand: "Stardew Planner",
    utilities: "帮助与反馈",
    help: "帮助",
    keyboard: "快捷键",
    feedback: "反馈",
    library: "本地项目",
    currentMap: "当前地图",
    features: "编辑器选项",
    menu: "菜单",
    ambience: "氛围",
    map: "地图",
    view: "视图",
    settings: "设置",
  },
} as const;

export function EditorMenuBar({
  activeModalId,
  leftHandMode = false,
  locale = "en",
  mapDisplayName,
  onOpenModal,
}: EditorMenuBarProperties) {
  const [isCompactMenuExpanded, setIsCompactMenuExpanded] = useState(false);
  const menuControlsId = useId();
  const editorMenuCopy = editorMenuCopyByLocale[locale];

  return (
    <nav
      aria-label={editorMenuCopy.navigation}
      className={"menu-bar editor-menu-bar" + (leftHandMode ? " left-hand" : "")}
    >
      <div className="editor-menu-bar__brand-region">
        <span className="editor-menu-bar__brand">{editorMenuCopy.brand}</span>
        <div
          aria-label={editorMenuCopy.utilities}
          className="editor-menu-bar__utility-controls"
          role="group"
        >
          {editorHeaderUtilityControls.map((editorHeaderUtilityControl) => {
            const utilityLabel = editorMenuCopy[editorHeaderUtilityControl.key];
            const isUtilityActive = activeModalId === editorHeaderUtilityControl.modalId;

            return (
              <button
                aria-expanded={isUtilityActive}
                aria-haspopup="dialog"
                aria-label={utilityLabel}
                className={getEditorMenuButtonClassName(
                  "menu-btn editor-menu-bar__utility-button",
                  isUtilityActive,
                )}
                data-editor-modal-id={editorHeaderUtilityControl.modalId}
                key={editorHeaderUtilityControl.modalId}
                onClick={() => onOpenModal(editorHeaderUtilityControl.modalId)}
                title={utilityLabel}
                type="button"
              >
                <PlannerReferenceIcon name={editorHeaderUtilityControl.icon} size={15} />
              </button>
            );
          })}
        </div>
      </div>

      <span aria-hidden="true" className="editor-menu-bar__brand-divider" />

      <div aria-label={editorMenuCopy.library} className="editor-menu-bar__project-context">
        <button
          aria-expanded={activeModalId === "save-panel"}
          aria-haspopup="dialog"
          aria-label={editorMenuCopy.library}
          className={getEditorMenuButtonClassName(
            "menu-btn editor-menu-bar__library-button",
            activeModalId === "save-panel",
          )}
          data-editor-modal-id="save-panel"
          onClick={() => onOpenModal("save-panel")}
          title={editorMenuCopy.library}
          type="button"
        >
          <PlannerReferenceIcon name="Library" size={15} />
          <span>{editorMenuCopy.library}</span>
        </button>
        <span aria-hidden="true" className="editor-menu-bar__breadcrumb-separator">›</span>
        <button
          aria-expanded={activeModalId === "map-picker"}
          aria-haspopup="dialog"
          aria-label={editorMenuCopy.currentMap + ": " + mapDisplayName}
          className={getEditorMenuButtonClassName(
            "menu-btn editor-menu-bar__map-name",
            activeModalId === "map-picker",
          )}
          data-editor-modal-id="map-picker"
          onClick={() => onOpenModal("map-picker")}
          title={editorMenuCopy.currentMap + ": " + mapDisplayName}
          type="button"
        >
          <span>{mapDisplayName}</span>
        </button>
      </div>

      <button
        aria-controls={menuControlsId}
        aria-expanded={isCompactMenuExpanded}
        aria-label={editorMenuCopy.menu}
        className="menu-btn editor-menu-bar__toggle"
        onClick={() => setIsCompactMenuExpanded((isExpanded) => !isExpanded)}
        title={editorMenuCopy.menu}
        type="button"
      >
        <PlannerReferenceIcon name="Settings" size={18} />
      </button>
      {isCompactMenuExpanded ? (
        <span aria-hidden="true" className="separator-h editor-menu-bar__separator" />
      ) : null}
      <div
        aria-label={editorMenuCopy.features}
        className="editor-menu-bar__controls"
        data-expanded={isCompactMenuExpanded}
        id={menuControlsId}
        role="group"
      >
        {editorHeaderMenuControls.map((editorHeaderMenuControl) => {
          const menuLabel = editorMenuCopy[editorHeaderMenuControl.key];
          const isMenuControlActive = activeModalId === editorHeaderMenuControl.modalId;

          return (
            <button
              aria-expanded={isMenuControlActive}
              aria-haspopup="dialog"
              aria-label={menuLabel}
              className={getEditorMenuButtonClassName(
                "menu-btn editor-menu-bar__button",
                isMenuControlActive,
              )}
              data-editor-modal-id={editorHeaderMenuControl.modalId}
              key={editorHeaderMenuControl.modalId}
              onClick={() => {
                setIsCompactMenuExpanded(false);
                onOpenModal(editorHeaderMenuControl.modalId);
              }}
              title={menuLabel}
              type="button"
            >
              <PlannerReferenceIcon name={editorHeaderMenuControl.icon} size={15} />
              <span>{menuLabel}</span>
              {editorHeaderMenuControl.key !== "settings" ? (
                <span aria-hidden="true" className="editor-menu-bar__chevron">⌄</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function getEditorMenuButtonClassName(
  baseClassName: string,
  isActive: boolean,
): string {
  return baseClassName + (isActive ? " active" : "");
}
