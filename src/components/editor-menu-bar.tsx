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
  season: TilesheetSeason;
  onOpenModal: (modalId: EditorModalId) => void;
}>;

const editorMenuControls: readonly Readonly<{
  id: EditorModalId;
  label: string;
  icon: typeof Map;
}>[] = [
  { id: "season-picker", label: "Season", icon: CloudSun },
  { id: "map-picker", label: "Map", icon: Map },
  { id: "view-panel", label: "View", icon: Eye },
  { id: "save-panel", label: "Save", icon: Save },
  { id: "settings-panel", label: "Settings", icon: Wrench },
];

export function EditorMenuBar({
  activeModalId,
  leftHandMode = false,
  mapDisplayName,
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
        const MenuIcon = editorMenuControl.icon;

        return (
          <button
            aria-label={accessibleMenuLabel}
            aria-expanded={activeModalId === editorMenuControl.id}
            aria-haspopup="dialog"
            className={`menu-btn editor-menu-bar__button${
              activeModalId === editorMenuControl.id ? " active" : ""
            }`}
            key={editorMenuControl.id}
            onClick={() => {
              setIsCompactMenuExpanded(false);
              onOpenModal(editorMenuControl.id);
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
