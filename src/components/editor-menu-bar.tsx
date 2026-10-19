"use client";

import { useId, useRef, useState } from "react";
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import type { EditorModalId } from "../editor/editor-view-state";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import {
  PlannerReferenceIcon,
  type PlannerReferenceIconName,
} from "./planner-reference-icon";

type EditorMenuBarLocale = PlannerChromeLocale;

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

type EditorMenuControlKey = "ambience" | "farmSettings" | "map" | "view" | "settings";

type EditorMenuControl = Readonly<{
  icon: PlannerReferenceIconName;
  key: EditorMenuControlKey;
  modalId: Extract<EditorModalId, "ambience-panel" | "farm-settings" | "map-picker" | "view-panel" | "settings-panel">;
}>;

type MenuModalFocusId = Extract<EditorModalId, "farm-settings" | "map-picker">;
type MenuModalFocusSelector =
  | ".editor-menu-bar__toggle"
  | ".editor-menu-bar__map-name"
  | `.editor-menu-bar__button[data-editor-modal-id="${MenuModalFocusId}"]`;

const menuModalFocusTargets = new WeakMap<HTMLElement, Readonly<{
  modalId: MenuModalFocusId;
  selector: MenuModalFocusSelector;
}>>();

export function rememberEditorMenuModalFocusTarget(
  triggerElement: HTMLElement,
  modalId: MenuModalFocusId,
  selector: MenuModalFocusSelector,
): void {
  const editorRoot = triggerElement.closest<HTMLElement>(".planner-editor-shell");
  if (editorRoot === null) {
    throw new Error(`Editor root is unavailable for menu modal ${JSON.stringify(modalId)} and trigger ${JSON.stringify(selector)}; received null.`);
  }
  menuModalFocusTargets.set(editorRoot, { modalId, selector });
}

export function readEditorMenuModalFocusTarget(
  modalElement: HTMLElement,
  modalId: EditorModalId,
): HTMLElement | null {
  if (modalId !== "farm-settings" && modalId !== "map-picker") return null;
  const editorRoot = modalElement.closest<HTMLElement>(".planner-editor-shell");
  if (editorRoot === null) return null;
  const focusTarget = menuModalFocusTargets.get(editorRoot);
  if (focusTarget === undefined || focusTarget.modalId !== modalId) return null;
  const triggerElement = editorRoot.querySelector<HTMLElement>(focusTarget.selector);
  if (triggerElement === null) {
    throw new Error(`Menu modal ${JSON.stringify(modalId)} focus target ${JSON.stringify(focusTarget.selector)} is unavailable; received null.`);
  }
  if (triggerElement.getClientRects().length === 0) {
    throw new Error(`Menu modal ${JSON.stringify(modalId)} focus target ${JSON.stringify(focusTarget.selector)} is hidden; received 0 client rects.`);
  }
  return triggerElement;
}

export function forgetEditorMenuModalFocusTarget(triggerElement: HTMLElement | null): void {
  const editorRoot = triggerElement?.closest<HTMLElement>(".planner-editor-shell");
  if (editorRoot !== null && editorRoot !== undefined) menuModalFocusTargets.delete(editorRoot);
}

function readEditorMenuCopy(locale: EditorMenuBarLocale) {
  if (locale === "en" || locale === "zh" || locale === "ja" || locale === "ru") {
    return editorMenuCopyByLocale[locale];
  }

  const unsupportedLocale: never = locale;
  throw new TypeError(
    `Editor menu locale must be "en", "zh", "ja", or "ru"; received ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function rememberMenuControlFocusTarget(
  triggerElement: HTMLElement,
  compactMenuToggle: HTMLButtonElement | null,
  modalId: MenuModalFocusId,
): void {
  if (compactMenuToggle === null) {
    throw new Error(`Compact menu toggle is unavailable for modal ${JSON.stringify(modalId)}; received null.`);
  }
  if (compactMenuToggle.getClientRects().length > 0) {
    compactMenuToggle.focus();
    rememberEditorMenuModalFocusTarget(triggerElement, modalId, ".editor-menu-bar__toggle");
  } else {
    rememberEditorMenuModalFocusTarget(triggerElement, modalId, `.editor-menu-bar__button[data-editor-modal-id="${modalId}"]`);
  }
}

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
  { icon: "Settings", key: "farmSettings", modalId: "farm-settings" },
  { icon: "Map", key: "map", modalId: "map-picker" },
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
    farmSettings: "Farm Settings",
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
    farmSettings: "农场设置",
    map: "地图",
    view: "视图",
    settings: "设置",
  },
  ja: {
    navigation: "エディターナビゲーション",
    brand: "Stardew Planner",
    utilities: "ヘルプとフィードバック",
    help: "ヘルプ",
    keyboard: "ショートカット",
    feedback: "フィードバック",
    library: "ライブラリ",
    currentMap: "現在のマップ",
    features: "エディターオプション",
    menu: "メニュー",
    ambience: "雰囲気",
    farmSettings: "牧場の設定",
    map: "マップ",
    view: "表示",
    settings: "設定",
  },
  ru: {
    navigation: "Навигация редактора",
    brand: "Планировщик Stardew",
    utilities: "Справка и отзывы",
    help: "Справка",
    keyboard: "Сочетания клавиш",
    feedback: "Отзыв",
    library: "Библиотека",
    currentMap: "Текущая карта",
    features: "Параметры редактора",
    menu: "Меню",
    ambience: "Атмосфера",
    farmSettings: "Настройки фермы",
    map: "Карта",
    view: "Вид",
    settings: "Настройки",
  },

} as const satisfies Record<EditorMenuBarLocale, {
  navigation: string;
  brand: string;
  utilities: string;
  help: string;
  keyboard: string;
  feedback: string;
  library: string;
  currentMap: string;
  features: string;
  menu: string;
  ambience: string;
  farmSettings: string;
  map: string;
  view: string;
  settings: string;
}>;

export function EditorMenuBar({
  activeModalId,
  leftHandMode = false,
  locale = "en",
  mapDisplayName,
  onOpenModal,
}: EditorMenuBarProperties) {
  const [isCompactMenuExpanded, setIsCompactMenuExpanded] = useState(false);
  const compactMenuToggleReference = useRef<HTMLButtonElement>(null);
  const menuControlsId = useId();
  const editorMenuCopy = readEditorMenuCopy(locale);

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
          onClick={(mouseEvent) => {
            rememberEditorMenuModalFocusTarget(mouseEvent.currentTarget, "map-picker", ".editor-menu-bar__map-name");
            onOpenModal("map-picker");
          }}
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
        ref={compactMenuToggleReference}
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
              onClick={(mouseEvent) => {
                const modalId = editorHeaderMenuControl.modalId;
                if (modalId === "farm-settings" || modalId === "map-picker") {
                  rememberMenuControlFocusTarget(mouseEvent.currentTarget, compactMenuToggleReference.current, modalId);
                }
                setIsCompactMenuExpanded(false);
                onOpenModal(modalId);
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
