"use client";

import type {
  EditorMenuVisibility,
  EditorModalId,
} from "../editor/editor-view-state";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

type EditorMenuBarProperties = Readonly<{
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
  label: string;
}>[] = [
  { id: "season-picker", label: "Season" },
  { id: "map-picker", label: "Map" },
  { id: "view-panel", label: "View" },
  { id: "save-panel", label: "Save" },
  { id: "settings-panel", label: "Settings" },
];

export function EditorMenuBar({
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
    <nav aria-label="Editor menu" className="editor-menu-bar">
      <button
        aria-controls={isExpanded ? editorMenuActionsId : undefined}
        aria-expanded={isExpanded}
        aria-label="Menu"
        className="editor-menu-bar__button"
        onClick={onToggleMenu}
        type="button"
      >
        Menu
      </button>
      {isExpanded ? (
        <div
          className={`editor-menu-bar__actions${expandedActionsClassName === undefined ? "" : ` ${expandedActionsClassName}`}`}
          id={editorMenuActionsId}
        >
          {editorMenuControls.map((editorMenuControl) => {
            const menuLabel = getMenuLabel(
              editorMenuControl,
              mapDisplayName,
              season,
            );
            const accessibleMenuLabel = getAccessibleMenuLabel(
              editorMenuControl,
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
                  {editorMenuControl.label}
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
  editorMenuControl: (typeof editorMenuControls)[number],
  mapDisplayName: string,
  season: TilesheetSeason,
): string {
  if (editorMenuControl.id === "season-picker") {
    return season;
  }

  if (editorMenuControl.id === "map-picker") {
    return mapDisplayName;
  }

  return "";
}

function getAccessibleMenuLabel(
  editorMenuControl: (typeof editorMenuControls)[number],
  menuLabel: string,
): string {
  return menuLabel.length === 0
    ? editorMenuControl.label
    : `${editorMenuControl.label}: ${menuLabel}`;
}
