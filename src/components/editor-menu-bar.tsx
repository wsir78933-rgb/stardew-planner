"use client";

import type {
  EditorMenuVisibility,
  EditorModalId,
} from "../editor/editor-view-state";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

type EditorMenuBarProperties = Readonly<{
  locale?: SiteLocale;
  activeModalId: EditorModalId | null;
  editorMenuVisibility: EditorMenuVisibility;
  expandedActionsClassName?: string;
  mapDisplayName: string;
  season: TilesheetSeason;
  onOpenModal: (modalId: EditorModalId) => void;
  onToggleMenu: () => void;
}>;

const editorMenuActionsId = "editor-menu-actions";

const editorMenuControls: readonly Readonly<{
  id: EditorModalId;
  labelKey: string;
}>[] = [
  { id: "season-picker", labelKey: "planner.menu.season" },
  { id: "map-picker", labelKey: "planner.menu.map" },
  { id: "view-panel", labelKey: "planner.menu.view" },
  { id: "save-panel", labelKey: "planner.menu.save" },
  { id: "settings-panel", labelKey: "planner.menu.settings" },
];

export function EditorMenuBar({
  locale = "en",
  activeModalId,
  editorMenuVisibility,
  expandedActionsClassName,
  mapDisplayName,
  season,
  onOpenModal,
  onToggleMenu,
}: EditorMenuBarProperties) {
  const isExpanded = editorMenuVisibility === "expanded";

  return (
    <nav aria-label={translate(locale, "planner.menu.label")} className="editor-menu-bar">
      <button
        aria-controls={isExpanded ? editorMenuActionsId : undefined}
        aria-expanded={isExpanded}
        aria-label={translate(locale, "planner.menu.menu")}
        className="editor-menu-bar__button"
        onClick={onToggleMenu}
        type="button"
      >
        {translate(locale, "planner.menu.menu")}
      </button>
      {isExpanded ? (
        <div
          className={`editor-menu-bar__actions${expandedActionsClassName === undefined ? "" : ` ${expandedActionsClassName}`}`}
          id={editorMenuActionsId}
        >
          {editorMenuControls.map((editorMenuControl) => {
            const menuLabel = getMenuLabel(
              locale,
              editorMenuControl,
              mapDisplayName,
              season,
            );
            const controlLabel = translate(locale, editorMenuControl.labelKey);
            const accessibleMenuLabel = getAccessibleMenuLabel(
              controlLabel,
              menuLabel,
            );

            return (
              <button
                aria-label={accessibleMenuLabel}
                aria-expanded={activeModalId === editorMenuControl.id}
                aria-haspopup="dialog"
                className="editor-menu-bar__button"
                key={editorMenuControl.id}
                onClick={() => onOpenModal(editorMenuControl.id)}
                type="button"
              >
                <span className="editor-menu-bar__label">
                  {controlLabel}
                </span>
                <span aria-hidden="true" className="editor-menu-bar__value">
                  {menuLabel}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}

function getMenuLabel(
  locale: SiteLocale,
  editorMenuControl: (typeof editorMenuControls)[number],
  mapDisplayName: string,
  season: TilesheetSeason,
): string {
  if (editorMenuControl.id === "season-picker") {
    return formatMenuSeason(locale, season);
  }

  if (editorMenuControl.id === "map-picker") {
    return mapDisplayName;
  }

  return "";
}

function formatMenuSeason(locale: SiteLocale, season: TilesheetSeason): string {
  if (locale !== "zh-CN") {
    return season;
  }

  return {
    spring: "春季",
    summer: "夏季",
    fall: "秋季",
    winter: "冬季",
  }[season];
}

function getAccessibleMenuLabel(
  controlLabel: string,
  menuLabel: string,
): string {
  return menuLabel.length === 0
    ? controlLabel
    : `${controlLabel}: ${menuLabel}`;
}
