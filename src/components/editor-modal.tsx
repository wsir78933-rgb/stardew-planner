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

type EditorModalLocale = "en" | "zh" | "ru";

type EditorModalProperties = Readonly<{
  locale?: EditorModalLocale;
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
                locale={locale}
                mapIdDataAttribute="data-editor-map-id"
                maps={plannerMaps}
                onMapSelect={onMapChange}
                selectedMapId={selectedMapId}
              />
            )}
            <MapConfigurationPanel
              locale={locale}
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
        {modalId === "help-info" ? <HelpInfoPanel locale={locale} /> : null}
        {modalId === "keyboard-shortcuts" ? <KeyboardShortcutsPanel locale={locale} /> : null}
        {modalId === "whats-new" ? <WhatsNewPanel locale={locale} /> : null}
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

function HelpInfoPanel({ locale }: Readonly<{ locale: EditorModalLocale }>) {
  if (locale === "ru") {
    return <RussianHelpInfoPanel />;
  }
  if (locale === "en" || locale === "zh") {
    return <EnglishHelpInfoPanel />;
  }
  throw new Error(
    `Unsupported editor modal locale. Received: ${JSON.stringify(locale)}.`,
  );
}

function EnglishHelpInfoPanel() {
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

function KeyboardShortcutsPanel({ locale }: Readonly<{ locale: EditorModalLocale }>) {
  const shortcutCopy = readKeyboardShortcutCopy(locale);
  return (
    <div className="editor-reference-info editor-reference-info--shortcuts">
      {shortcutCopy.groups.map((group, groupIndex) => <section key={group.heading}><h3>{group.heading}</h3><dl>{group.entries.map(([key, description]) => <div key={key}><dt><kbd>{key}</kbd></dt><dd>{description}</dd></div>)}</dl>{groupIndex === 1 ? <p className="editor-shortcuts-hint">{shortcutCopy.navigationHint}</p> : null}</section>)}
    </div>
  );
}

function WhatsNewPanel({ locale }: Readonly<{ locale: EditorModalLocale }>) {
  if (locale === "ru") {
    return <RussianWhatsNewPanel />;
  }
  if (locale === "en" || locale === "zh") {
    return <EnglishWhatsNewPanel />;
  }
  throw new Error(
    `Unsupported editor modal locale. Received: ${JSON.stringify(locale)}.`,
  );
}

function EnglishWhatsNewPanel() {
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

function RussianHelpInfoPanel() {
  return (
    <div className="editor-reference-info">
      <section>
        <h3>Возможности</h3>
        <ul>
          <li><strong>Переключение щелчком</strong> · Щёлкайте одну клетку несколько раз, чтобы перебирать перекрывающиеся предметы.</li>
          <li><strong>Рентген</strong> · Удерживайте пробел, чтобы видеть сквозь размещённые спрайты.</li>
          <li><strong>Перетаскивание</strong> · Перетащите выбранную постройку или предмет, чтобы переместить их.</li>
          <li><strong>Окраска</strong> · Перекрашивайте поддерживаемые постройки, сундуки и воду в пруду.</li>
          <li><strong>Зоны действия</strong> · Показывает покрытие спринклеров, пугал, ульев и хижины Джунимо.</li>
        </ul>
      </section>
      <section>
        <h3>Полезно знать</h3>
        <ul>
          <li>Проекты сохраняются только в этом браузере. Экспортируйте JSON, чтобы оставить переносимую копию.</li>
          <li>Свободное размещение включайте только для раскладки, которую игра может не разрешить.</li>
          <li>Обои и настил можно применять только к подходящим внутренним областям.</li>
        </ul>
      </section>
      <section>
        <h3>Карты</h3>
        <p>Кнопка «Карта» переключает ферму, интерьер, экстерьер и закрытые карты сообщества. В одном локальном проекте можно хранить отдельные раскладки для нескольких карт.</p>
      </section>
    </div>
  );
}

function RussianWhatsNewPanel() {
  return (
    <div className="editor-reference-info">
      <p className="editor-reference-info__version">v0.1.1 · апрель 2026</p>
      <section>
        <h3>Карты сообщества</h3>
        <p>Карты сообщества открываются на вкладке сообщества и по-прежнему входят в этот планировщик локально.</p>
      </section>
      <section>
        <h3>Декор стола</h3>
        <p>Ставьте лампы, растения и другие подходящие предметы на столы и тумбы.</p>
      </section>
      <section>
        <h3>Зимние культуры</h3>
        <p>Пороховая дыня доступна в выборе культур.</p>
      </section>
      <section>
        <h3>Тени спринклеров</h3>
        <p>Спринклеры отображаются с тенью на земле, как в игре.</p>
      </section>
    </div>
  );
}

type KeyboardShortcutGroup = Readonly<{
  entries: readonly (readonly [string, string])[];
  heading: string;
}>;

type KeyboardShortcutCopy = Readonly<{
  groups: readonly KeyboardShortcutGroup[];
  navigationHint: string;
}>;

const englishKeyboardShortcutCopy: KeyboardShortcutCopy = {
  groups: [
    { heading: "Tools", entries: [
      ["V", "Switch to cursor mode"],
      ["M", "Switch to multi-select mode"],
      ["E", "Switch to erase mode"],
      ["F", "Switch to fill mode"],
      ["Q", "Rotate or cycle variant on selected/placed item"],
      ["C", "Duplicate selected item or building"],
      ["Del", "Delete selected item or building"],
      ["Esc", "Cancel placement or deselect"],
      ["RMB", "Cancel placement or deselect (right-click)"],
    ] },
    { heading: "Navigation", entries: [
      ["W A S D", "Pan the canvas"],
      ["↑ ← ↓ →", "Pan the canvas (alternative)"],
      ["R", "Zoom in"],
      ["T", "Zoom out"],
      ["Ctrl / ⌘", "X-ray: hold to see behind overlapping sprites"],
      ["Space", "Hold for X-ray (alternative)"],
    ] },
    { heading: "History", entries: [
      ["Ctrl / ⌘ Z", "Undo last action"],
      ["Ctrl / ⌘ Y", "Redo last action"],
      ["Ctrl / ⌘ ⇧ Z", "Redo (alternative)"],
    ] },
  ],
  navigationHint: "Enable the bottom Zoom button to zoom with the scroll wheel; two-finger pinch still works.",
};

const chineseKeyboardShortcutCopy: KeyboardShortcutCopy = {
  groups: [
    { heading: "工具", entries: [
      ["V", "切换到选择模式"],
      ["M", "切换到多选模式"],
      ["E", "切换到擦除模式"],
      ["F", "切换到填充模式"],
      ["Q", "旋转或切换所选 / 待放置物品外观"],
      ["C", "复制选中物品或建筑"],
      ["Del", "删除选中物品或建筑"],
      ["Esc", "取消放置或取消选择"],
      ["RMB", "右键取消放置或取消选择"],
    ] },
    { heading: "导航", entries: [
      ["W A S D", "平移画布"],
      ["↑ ← ↓ →", "平移画布（方向键）"],
      ["R", "放大"],
      ["T", "缩小"],
      ["Ctrl / ⌘", "按住透视重叠的物品"],
      ["Space", "按住透视（原有快捷键）"],
    ] },
    { heading: "历史", entries: [
      ["Ctrl / ⌘ Z", "撤销上一次操作"],
      ["Ctrl / ⌘ Y", "重做上一次撤销的操作"],
      ["Ctrl / ⌘ ⇧ Z", "重做（备用快捷键）"],
    ] },
  ],
  navigationHint: "滚轮缩放需先开启底部“缩放”按钮；双指捏合仍可缩放",
};

const russianKeyboardShortcutCopy: KeyboardShortcutCopy = {
  groups: [
    { heading: "Инструменты", entries: [
      ["V", "Переключить режим выбора"],
      ["M", "Переключить режим множественного выбора"],
      ["E", "Переключить режим стирания"],
      ["F", "Переключить режим заливки"],
      ["Q", "Повернуть или сменить вариант выбранного или размещаемого предмета"],
      ["C", "Дублировать выбранный предмет или постройку"],
      ["Del", "Удалить выбранный предмет или постройку"],
      ["Esc", "Отменить размещение или снять выделение"],
      ["RMB", "Отменить размещение или снять выделение (правая кнопка)"],
    ] },
    { heading: "Навигация", entries: [
      ["W A S D", "Перемещать холст"],
      ["↑ ← ↓ →", "Перемещать холст (клавиши со стрелками)"],
      ["R", "Увеличить"],
      ["T", "Уменьшить"],
      ["Ctrl / ⌘", "Рентген: удерживайте, чтобы видеть перекрытые спрайты"],
      ["Space", "Удерживайте для рентгена (запасной вариант)"],
    ] },
    { heading: "История", entries: [
      ["Ctrl / ⌘ Z", "Отменить последнее действие"],
      ["Ctrl / ⌘ Y", "Вернуть отменённое действие"],
      ["Ctrl / ⌘ ⇧ Z", "Вернуть (запасной вариант)"],
    ] },
  ],
  navigationHint: "Чтобы масштабировать колесом, включите нижнюю кнопку «Масштаб»; жест двумя пальцами по-прежнему работает.",
};

function readKeyboardShortcutCopy(locale: EditorModalLocale): KeyboardShortcutCopy {
  if (locale === "en") return englishKeyboardShortcutCopy;
  if (locale === "zh") return chineseKeyboardShortcutCopy;
  if (locale === "ru") return russianKeyboardShortcutCopy;
  throw new Error(
    `Unsupported editor modal locale. Received: ${JSON.stringify(locale)}.`,
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

function getModalLabel(
  modalId: EditorModalId,
  copy: EditorModalCopy,
  locale: EditorModalLocale,
): string {
  if (modalId === "ambience-panel") {
    return readFixedEditorModalLabel(locale, { en: "Ambience", zh: "氛围", ru: "Атмосфера" });
  }
  if (modalId === "farm-settings") {
    return readFixedEditorModalLabel(locale, { en: "Farm Settings", zh: "农场设置", ru: "Настройки фермы" });
  }
  if (modalId === "feedback") {
    return readFixedEditorModalLabel(locale, { en: "Send feedback", zh: "发送反馈", ru: "Отправить отзыв" });
  }
  if (modalId === "map-picker") {
    return readFixedEditorModalLabel(locale, { en: "Choose map", zh: "选择地图", ru: "Выбор карты" });
  }
  if (modalId === "view-panel") {
    return copy.modalTitles.view;
  }
  if (modalId === "save-panel") {
    return readFixedEditorModalLabel(locale, { en: "Library", zh: "本地项目", ru: "Библиотека" });
  }
  if (modalId === "help-info") {
    return readFixedEditorModalLabel(locale, { en: "Help & Info", zh: "帮助与说明", ru: "Справка" });
  }
  if (modalId === "keyboard-shortcuts") {
    return readFixedEditorModalLabel(locale, {
      en: "Keyboard Shortcuts",
      zh: "键盘快捷键",
      ru: "Сочетания клавиш",
    });
  }
  if (modalId === "whats-new") {
    return readFixedEditorModalLabel(locale, {
      en: "What's New",
      zh: "What's New",
      ru: "Что нового",
    });
  }
  return copy.modalTitles.settings;
}

function readFixedEditorModalLabel(
  locale: EditorModalLocale,
  labels: Readonly<Record<EditorModalLocale, string>>,
): string {
  const label = labels[locale];
  if (label === undefined) {
    throw new Error(
      `Unsupported editor modal locale. Received: ${JSON.stringify(locale)}.`,
    );
  }
  return label;
}

function getModalCloseDialogLabel(
  _modalId: EditorModalId,
  copy: EditorModalCopy,
): string {
  return copy.closeDialogLabel;
}
