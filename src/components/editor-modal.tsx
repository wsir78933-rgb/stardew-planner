"use client";

import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  type EditorModalId,
  type EditorPanelPosition,
} from "../editor/editor-view-state";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import {
  createInitialEditorDisplayOptions,
  type EditorDisplayOptionKey,
  type EditorDisplayOptions,
} from "../editor/editor-display-options";
import {
  createInitialEditorBehaviorOptions,
  type EditorBehaviorOptionKey,
  type EditorBehaviorOptions,
} from "../editor/editor-behavior-options";
import { MapConfigurationPanel } from "./map-configuration-panel";
import {
  createInitialMapRenderOptions,
  type MapRenderOptions,
} from "../maps/map-render-options";
import { plannerMaps } from "../maps/map-catalog";
import { PlannerMapPicker } from "./planner-map-picker";
import { closeModalFromBackdropClick } from "./modal-backdrop-close";
import type { EditorModalCopy } from "../i18n/editor-modal-copy";
import { createInitialPlannerAmbienceOptions, type PlannerAmbienceOptions } from "../editor/planner-ambience-options";
import { AmbienceConfigPanel, ViewConfigPanel, SettingsConfigPanel } from "./editor-config-panels";
import { FarmSettingsPanel } from "./farm-settings-panel";
import { forgetEditorMenuModalFocusTarget, readEditorMenuModalFocusTarget } from "./editor-menu-bar";
import { PlannerFeedbackForm } from "../contact/planner-feedback-form";

type EditorModalProperties = Readonly<{
  locale?: "en" | "zh";
  season?: TilesheetSeason;
  ambienceOptions?: PlannerAmbienceOptions;
  onSeasonChange?: (season: TilesheetSeason) => void;
  onAmbienceChange?: (options: PlannerAmbienceOptions) => void;
  copy: EditorModalCopy;
  modalId: EditorModalId | null;
  selectedMapId: string;
  panelPosition: EditorPanelPosition;
  behaviorOptions?: EditorBehaviorOptions;
  displayOptions?: EditorDisplayOptions;
  mapRenderOptions?: MapRenderOptions;
  onClose: () => void;
  onBehaviorOptionChange?: (
    editorBehaviorOptionKey: EditorBehaviorOptionKey,
    nextValue: boolean,
  ) => void;
  onDisplayOptionToggle?: (editorDisplayOptionKey: EditorDisplayOptionKey) => void;
  onMapChange: (mapId: string) => void;
  onMapRenderOptionsChange?: (nextMapRenderOptions: MapRenderOptions) => void;
  onPanelPositionChange: (panelPosition: EditorPanelPosition) => void;
  projectMapPanelContent?: ReactNode;
  savePanelContent?: ReactNode;
}>;

type ModalFocusTargetProperties = Readonly<{
  activeElement: HTMLElement | null;
  modalElement: HTMLElement;
  shiftKey: boolean;
}>;

const modalFocusableElementSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function EditorModal({
  locale = "en",
  season = "spring",
  ambienceOptions = createInitialPlannerAmbienceOptions(),
  onSeasonChange = missingSceneControl,
  onAmbienceChange = missingSceneControl,
  copy,
  modalId,
  selectedMapId,
  panelPosition,
  behaviorOptions = createInitialEditorBehaviorOptions(),
  displayOptions = createInitialEditorDisplayOptions(),
  mapRenderOptions = createInitialMapRenderOptions(),
  onClose,
  onBehaviorOptionChange = ignoreEditorBehaviorOptionChange,
  onDisplayOptionToggle = ignoreEditorDisplayOptionToggle,
  onMapChange,
  onMapRenderOptionsChange = ignoreMapRenderOptionsChange,
  onPanelPositionChange,
  projectMapPanelContent,
  savePanelContent,
}: EditorModalProperties) {
  const modalElementReference = useRef<HTMLElement>(null);
  const modalTriggerElementReference = useRef<HTMLElement | null>(null);
  const isModalOpenReference = useRef(false);
  const modalHeadingId = useId();

  useEffect(() => {
    const modalElement = modalElementReference.current;

    if (modalId === null) {
      if (isModalOpenReference.current) {
        restoreModalTriggerFocus(modalTriggerElementReference.current);
        forgetEditorMenuModalFocusTarget(modalTriggerElementReference.current);
        modalTriggerElementReference.current = null;
        isModalOpenReference.current = false;
      }

      return;
    }

    if (modalElement === null) {
      throw new Error(`Modal element is unavailable for modalId ${JSON.stringify(modalId)}.`);
    }

    if (!isModalOpenReference.current) {
      modalTriggerElementReference.current = readEditorMenuModalFocusTarget(modalElement, modalId)
        ?? getModalActiveElement(modalElement);
      isModalOpenReference.current = true;
    }

    focusFirstModalControl(modalElement);
  }, [modalId]);

  useEffect(() => {
    return () => {
      if (isModalOpenReference.current) {
        restoreModalTriggerFocus(modalTriggerElementReference.current);
      }
    };
  }, []);

  function handleModalKeyDown(keyboardEvent: KeyboardEvent<HTMLElement>): void {
    const modalElement = modalElementReference.current;

    if (modalElement === null) {
      throw new Error(
        `Modal element is unavailable for keyboard event in modalId ${JSON.stringify(modalId)}.`,
      );
    }

    if (
      !shouldHandleEditorModalKeyboardEvent(modalElement, keyboardEvent.target)
    ) {
      return;
    }

    if (keyboardEvent.key === "Escape") {
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
      onClose();
      return;
    }

    if (keyboardEvent.key !== "Tab") {
      return;
    }

    const focusTarget = getModalFocusTarget({
      activeElement: getModalActiveElement(modalElement),
      modalElement,
      shiftKey: keyboardEvent.shiftKey,
    });

    if (focusTarget === null) {
      return;
    }

    keyboardEvent.preventDefault();
    focusTarget.focus();
  }

  if (modalId === null) {
    return null;
  }

  const editorModalClassName = getEditorModalClassName(modalId);
  const editorModalBackdropClassName = getEditorModalBackdropClassName(modalId);

  return (
    <div
      className={editorModalBackdropClassName}
      onClick={(mouseEvent) => {
        closeModalFromBackdropClick({
          currentTarget: mouseEvent.currentTarget,
          eventTarget: mouseEvent.target,
          onClose,
        });
      }}
    >
      <section
        aria-labelledby={modalHeadingId}
        aria-modal="true"
        className={editorModalClassName}
        onKeyDown={handleModalKeyDown}
        ref={modalElementReference}
        role="dialog"
        tabIndex={-1}
      >
        <header className="editor-modal__header">
          <h2 id={modalHeadingId}>{getModalLabel(modalId, copy, locale)}</h2>
          <button
            aria-label={getModalCloseDialogLabel(modalId, copy)}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>
        {modalId === "ambience-panel" ? <AmbienceConfigPanel locale={locale} season={season} ambienceOptions={ambienceOptions} nightMode={displayOptions.showNightMode} onSeasonChange={onSeasonChange} onAmbienceChange={onAmbienceChange} onNightModeToggle={() => onDisplayOptionToggle("showNightMode")} /> : null}
        {modalId === "farm-settings" ? (
          <FarmSettingsPanel
            locale={locale}
            selectedMapId={selectedMapId}
            mapRenderOptions={mapRenderOptions}
            onMapRenderOptionsChange={onMapRenderOptionsChange}
          />
        ) : null}
        {modalId === "feedback" ? <PlannerFeedbackForm locale={locale} /> : null}
        {modalId === "map-picker" ? (
          <>
            {projectMapPanelContent ?? (
              <PlannerMapPicker
                mapIdDataAttribute="data-editor-map-id"
                maps={plannerMaps}
                onMapSelect={onMapChange}
                selectedMapId={selectedMapId}
              />
            )}
            <MapConfigurationPanel
              mapRenderOptions={mapRenderOptions}
              onMapRenderOptionsChange={onMapRenderOptionsChange}
              selectedMapId={selectedMapId}
            />
          </>
        ) : null}
        {modalId === "view-panel" ? (
          <ViewConfigPanel
            locale={locale}
            behaviorOptions={behaviorOptions}
            displayOptions={displayOptions}
            onBehaviorChange={onBehaviorOptionChange}
            onDisplayToggle={onDisplayOptionToggle}
            onPanelPositionChange={onPanelPositionChange}
            panelPosition={panelPosition}
            selectedMapId={selectedMapId}
          />
        ) : null}
        {modalId === "save-panel" ? savePanelContent : null}
        {modalId === "settings-panel" ? (
          <SettingsConfigPanel
            locale={locale}
            behaviorOptions={behaviorOptions}
            copy={copy.settings}
            onBehaviorChange={onBehaviorOptionChange}
          />
        ) : null}
        {modalId === "help-info" ? <HelpInfoPanel /> : null}
        {modalId === "keyboard-shortcuts" ? <KeyboardShortcutsPanel locale={locale} /> : null}
        {modalId === "whats-new" ? <WhatsNewPanel /> : null}
      </section>
    </div>
  );
}

function missingSceneControl(): never {
  throw new Error("The open editor panel has no scene-control callback configured.");
}

export function shouldHandleEditorModalKeyboardEvent(
  modalElement: Pick<HTMLElement, "contains">,
  eventTarget: EventTarget | null,
): boolean {
  if (eventTarget === null) {
    throw new Error(
      `Cannot handle editor modal keyboard event because the event target is ${JSON.stringify(eventTarget)}.`,
    );
  }

  return modalElement.contains(eventTarget as Node);
}

function ignoreEditorDisplayOptionToggle(): void {}

function ignoreEditorBehaviorOptionChange(): void {}

function ignoreMapRenderOptionsChange(): void {}

export function getModalFocusTarget({
  activeElement,
  modalElement,
  shiftKey,
}: ModalFocusTargetProperties): HTMLElement | null {
  const focusableElements = getFocusableModalElements(modalElement);

  if (focusableElements.length === 0) {
    return modalElement;
  }

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  if (shiftKey) {
    if (
      activeElement === firstFocusableElement ||
      !modalElement.contains(activeElement)
    ) {
      return lastFocusableElement;
    }

    return null;
  }

  if (
    activeElement === lastFocusableElement ||
    !modalElement.contains(activeElement)
  ) {
    return firstFocusableElement;
  }

  return null;
}

function focusFirstModalControl(modalElement: HTMLElement): void {
  const firstFocusableElement = getFocusableModalElements(modalElement)[0];

  (firstFocusableElement ?? modalElement).focus();
}

function getFocusableModalElements(modalElement: HTMLElement): HTMLElement[] {
  return Array.from(
    modalElement.querySelectorAll<HTMLElement>(modalFocusableElementSelector),
  ).filter((focusableElement) => !focusableElement.hasAttribute("disabled"));
}

function getModalActiveElement(modalElement: HTMLElement): HTMLElement | null {
  const activeElement = modalElement.ownerDocument.activeElement;

  if (activeElement instanceof HTMLElement) {
    return activeElement;
  }

  return null;
}

function restoreModalTriggerFocus(
  modalTriggerElement: HTMLElement | null,
): void {
  if (modalTriggerElement?.isConnected) {
    modalTriggerElement.focus();
  }
}

function HelpInfoPanel() {
  return (
    <div className="editor-reference-info">
      <section>
        <h3>Features</h3>
        <ul>
          <li><strong>Click Cycling</strong> · Click the same tile repeatedly to cycle through overlapping items.</li>
          <li><strong>X-ray</strong> · Hold Space to see through placed sprites.</li>
          <li><strong>Drag to Move</strong> · Drag a selected building or item to reposition it.</li>
          <li><strong>Paint</strong> · Recolour supported buildings, chests, and fish pond water.</li>
          <li><strong>Radius Overlays</strong> · Preview sprinkler, scarecrow, bee house, and Junimo Hut coverage.</li>
        </ul>
      </section>
      <section>
        <h3>Good to Know</h3>
        <ul>
          <li>Projects are saved only in this browser. Export JSON to keep a portable copy.</li>
          <li>Use Free Placement only when you intentionally want a layout the game may not allow.</li>
          <li>Wallpaper and flooring can only be applied to compatible interior regions.</li>
        </ul>
      </section>
      <section>
        <h3>Maps</h3>
        <p>Use Map to switch among farm, interior, exterior, and locked community maps. Each local project can keep separate layouts for multiple maps.</p>
      </section>
    </div>
  );
}

function KeyboardShortcutsPanel({ locale }: Readonly<{ locale: "en" | "zh" }>) {
  const isChinese = locale === "zh";
  const shortcutGroups = [
    { heading: isChinese ? "工具" : "Tools", entries: [
      ["V", isChinese ? "切换到选择模式" : "Switch to cursor mode"],
      ["M", isChinese ? "切换到多选模式" : "Switch to multi-select mode"],
      ["E", isChinese ? "切换到擦除模式" : "Switch to erase mode"],
      ["F", isChinese ? "切换到填充模式" : "Switch to fill mode"],
      ["Q", isChinese ? "旋转或切换所选 / 待放置物品外观" : "Rotate or cycle variant on selected/placed item"],
      ["C", isChinese ? "复制选中物品或建筑" : "Duplicate selected item or building"],
      ["Del", isChinese ? "删除选中物品或建筑" : "Delete selected item or building"],
      ["Esc", isChinese ? "取消放置或取消选择" : "Cancel placement or deselect"],
      ["RMB", isChinese ? "右键取消放置或取消选择" : "Cancel placement or deselect (right-click)"],
    ] },
    { heading: isChinese ? "导航" : "Navigation", entries: [
      ["W A S D", isChinese ? "平移画布" : "Pan the canvas"],
      ["↑ ← ↓ →", isChinese ? "平移画布（方向键）" : "Pan the canvas (alternative)"],
      ["R", isChinese ? "放大" : "Zoom in"],
      ["T", isChinese ? "缩小" : "Zoom out"],
      ["Ctrl / ⌘", isChinese ? "按住透视重叠的物品" : "X-ray: hold to see behind overlapping sprites"],
      ["Space", isChinese ? "按住透视（原有快捷键）" : "Hold for X-ray (alternative)"],
    ] },
    { heading: isChinese ? "历史" : "History", entries: [
      ["Ctrl / ⌘ Z", isChinese ? "撤销上一次操作" : "Undo last action"],
      ["Ctrl / ⌘ Y", isChinese ? "重做上一次撤销的操作" : "Redo last action"],
      ["Ctrl / ⌘ ⇧ Z", isChinese ? "重做（备用快捷键）" : "Redo (alternative)"],
    ] },
  ];
  return (
    <div className="editor-reference-info editor-reference-info--shortcuts">
      {shortcutGroups.map((group) => <section key={group.heading}><h3>{group.heading}</h3><dl>{group.entries.map(([key, description]) => <div key={key}><dt><kbd>{key}</kbd></dt><dd>{description}</dd></div>)}</dl>{group === shortcutGroups[1] ? <p className="editor-shortcuts-hint">{isChinese ? "滚轮缩放需先开启底部“缩放”按钮；双指捏合仍可缩放" : "Enable the bottom Zoom button to zoom with the scroll wheel; two-finger pinch still works."}</p> : null}</section>)}
    </div>
  );
}

function WhatsNewPanel() {
  return (
    <div className="editor-reference-info">
      <p className="editor-reference-info__version">v0.1.1 · April 2026</p>
      <section>
        <h3>Community Maps</h3>
        <p>Community farm maps are available from the Community map tab and remain bundled locally with this planner.</p>
      </section>
      <section>
        <h3>Table Decor</h3>
        <p>Place lamps, plants, and other compatible objects on tables and end tables.</p>
      </section>
      <section>
        <h3>Winter Crops</h3>
        <p>Powdermelon is available from the crop picker.</p>
      </section>
      <section>
        <h3>Sprinkler Shadows</h3>
        <p>Sprinklers render with a ground shadow matching the in-game appearance.</p>
      </section>
    </div>
  );
}

function getEditorModalClassName(modalId: EditorModalId): string {
  if (["ambience-panel", "farm-settings", "view-panel", "settings-panel"].includes(modalId)) {
    return `editor-modal editor-modal--${modalId} editor-modal--popover`;
  }
  if (modalId === "feedback") return "editor-modal editor-modal--feedback";
  if (modalId === "keyboard-shortcuts") return "editor-modal editor-modal--shortcuts";
  if (modalId === "map-picker") {
    return "editor-modal editor-modal--map-picker";
  }

  if (modalId === "save-panel") {
    return "editor-modal editor-modal--save-panel";
  }

  if (modalId === "view-panel") {
    return "editor-modal editor-modal--view-panel";
  }

  if (modalId === "settings-panel") {
    return "editor-modal editor-modal--settings-panel";
  }

  if (modalId === "help-info") {
    return "editor-modal editor-modal--help-info";
  }

  return "editor-modal";
}

function getEditorModalBackdropClassName(modalId: EditorModalId): string {
  if (
    modalId === "save-panel" ||
    modalId === "view-panel" ||
    modalId === "settings-panel" ||
    modalId === "help-info" ||
    modalId === "feedback" ||
    modalId === "keyboard-shortcuts" ||
    modalId === "map-picker"
  ) {
    return "editor-modal__backdrop editor-modal__backdrop--viewport-fixed";
  }

  return "editor-modal__backdrop";
}

function getModalLabel(modalId: EditorModalId, copy: EditorModalCopy, locale: "en" | "zh"): string {
  if (modalId === "ambience-panel") return locale === "zh" ? "氛围" : "Ambience";
  if (modalId === "farm-settings") return locale === "zh" ? "农场设置" : "Farm Settings";
  if (modalId === "feedback") return locale === "zh" ? "发送反馈" : "Send feedback";
  if (modalId === "map-picker") {
    return locale === "zh" ? "选择地图" : "Choose map";
  }

  if (modalId === "view-panel") {
    return copy.modalTitles.view;
  }

  if (modalId === "save-panel") {
    return locale === "zh" ? "本地项目" : "Library";
  }

  if (modalId === "help-info") {
    return locale === "zh" ? "帮助与说明" : "Help & Info";
  }

  if (modalId === "keyboard-shortcuts") {
    return locale === "zh" ? "键盘快捷键" : "Keyboard Shortcuts";
  }

  if (modalId === "whats-new") {
    return "What's New";
  }

  return copy.modalTitles.settings;
}

function getModalCloseDialogLabel(
  _modalId: EditorModalId,
  copy: EditorModalCopy,
): string {
  return copy.closeDialogLabel;
}
