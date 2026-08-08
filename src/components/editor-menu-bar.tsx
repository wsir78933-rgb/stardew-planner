"use client";

import type {
  EditorModalId,
} from "../editor/editor-view-state";
import { useId, useState } from "react";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import {
  CloudSun,
  Eye,
  Map,
  Save,
  Wrench,
} from "lucide-react";

type EditorMenuBarProperties = Readonly<{
  activeModalId: EditorModalId | null;
  leftHandMode?: boolean;
  mapDisplayName: string;
  onCycleSeason: () => void;
  season: TilesheetSeason;
  onOpenModal: (modalId: EditorModalId) => void;
}>;

type EditorMenuControl =
  | Readonly<{
      action: "cycle-season";
      icon: typeof Map;
      label: string;
    }>
  | Readonly<{
      action: "open-modal";
      icon: typeof Map;
      label: string;
      modalId: EditorModalId;
    }>;

const editorMenuControls: readonly EditorMenuControl[] = [
  { action: "cycle-season", label: "Season", icon: CloudSun },
  { action: "open-modal", modalId: "map-picker", label: "Map", icon: Map },
  { action: "open-modal", modalId: "view-panel", label: "View", icon: Eye },
  { action: "open-modal", modalId: "save-panel", label: "Save", icon: Save },
  { action: "open-modal", modalId: "settings-panel", label: "Settings", icon: Wrench },
];

export function EditorMenuBar({
  activeModalId,
  leftHandMode = false,
  mapDisplayName,
  onCycleSeason,
  season,
  onOpenModal,
}: EditorMenuBarProperties) {
  const [isCompactMenuExpanded, setIsCompactMenuExpanded] = useState(false);
  const menuControlsId = useId();

  return (
    <nav
      aria-label="Editor menu"
      className={`menu-bar editor-menu-bar${leftHandMode ? " left-hand" : ""}`}
    >
      <button
        aria-controls={menuControlsId}
        aria-expanded={isCompactMenuExpanded}
        aria-label="Menu"
        className="menu-btn editor-menu-bar__toggle"
        onClick={() => setIsCompactMenuExpanded((isExpanded) => !isExpanded)}
        title="Menu"
        type="button"
      >
        <Wrench aria-hidden="true" size={18} strokeWidth={2} />
      </button>
      {isCompactMenuExpanded ? (
        <span aria-hidden="true" className="separator-h editor-menu-bar__separator" />
      ) : null}
      <div
        className="editor-menu-bar__controls"
        data-expanded={isCompactMenuExpanded}
        id={menuControlsId}
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
          const isModalControl = editorMenuControl.action === "open-modal";
          const isModalControlActive =
            isModalControl && activeModalId === editorMenuControl.modalId;
          const MenuIcon = editorMenuControl.icon;

          return (
            <button
              aria-expanded={isModalControl ? isModalControlActive : undefined}
              aria-haspopup={isModalControl ? "dialog" : undefined}
              aria-label={accessibleMenuLabel}
              className={`menu-btn editor-menu-bar__button${
                isModalControlActive ? " active" : ""
              }`}
              key={editorMenuControl.action === "cycle-season" ? editorMenuControl.action : editorMenuControl.modalId}
              onClick={() => {
                setIsCompactMenuExpanded(false);
                if (editorMenuControl.action === "cycle-season") {
                  onCycleSeason();
                } else {
                  onOpenModal(editorMenuControl.modalId);
                }
              }}
              title={accessibleMenuLabel}
              type="button"
            >
              <MenuIcon aria-hidden="true" size={16} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function getMenuLabel(
  editorMenuControl: EditorMenuControl,
  mapDisplayName: string,
  season: TilesheetSeason,
): string {
  if (editorMenuControl.action === "cycle-season") {
    return season;
  }

  if (editorMenuControl.modalId === "map-picker") {
    return mapDisplayName;
  }

  return "";
}

function getAccessibleMenuLabel(
  editorMenuControl: EditorMenuControl,
  menuLabel: string,
): string {
  return menuLabel.length === 0
    ? editorMenuControl.label
    : `${editorMenuControl.label}: ${menuLabel}`;
}
