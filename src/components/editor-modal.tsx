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
import type { PlannerChromeLocale } from "@/src/homepage/homepage-locale";
import { readLocalizedCatalogItemLabel } from "@/src/homepage/japanese-game-display-labels";
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
  locale?: PlannerChromeLocale;
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

function HelpInfoPanel({ locale }: Readonly<{ locale: PlannerChromeLocale }>) {
  if (locale === "ru") {
    return <RussianHelpInfoPanel />;
  }

  if (locale === "ja") {
    return (
      <div className="editor-reference-info">
        <section>
          <h3>機能</h3>
          <ul>
            <li><strong>クリックで切り替え</strong> · 同じマスを繰り返しクリックすると、重なったアイテムを順に切り替えます。</li>
            <li><strong>透視</strong> · Space を押し続けると、配置したスプライトの奥が見えます。</li>
            <li><strong>ドラッグで移動</strong> · 選択した建物やアイテムをドラッグして位置を変えます。</li>
            <li><strong>ペイント</strong> · 対応する建物、チェスト、魚のいる池の水の色を変えられます。</li>
            <li><strong>範囲表示</strong> · スプリンクラー、かかし、ハチの巣箱、ジュニモ小屋の範囲を確認できます。</li>
          </ul>
        </section>
        <section>
          <h3>知っておくこと</h3>
          <ul>
            <li>プロジェクトはこのブラウザだけに保存されます。持ち出すには JSON を書き出してください。</li>
            <li>自由配置は、ゲームが許可しない配置を意図するときだけ使ってください。</li>
            <li>壁紙とフローリングは、対応する屋内だけに使えます。</li>
          </ul>
        </section>
        <section>
          <h3>マップ</h3>
          <p>マップから牧場、屋内、屋外、ロックされたコミュニティマップを切り替えます。ローカルプロジェクトごとに、複数マップの配置を別に保存できます。</p>
        </section>
      </div>
    );
  }

  if (locale === "en" || locale === "zh") {
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

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read help panel because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function KeyboardShortcutsPanel({ locale }: Readonly<{ locale: PlannerChromeLocale }>) {
  const shortcutText = (text: Readonly<{ en: string; zh: string; ja: string; ru: string }>) =>
    readEditorModalText(locale, text);
  const shortcutGroups = [
    { heading: shortcutText({ en: "Tools", zh: "工具", ja: "ツール", ru: "Инструменты" }), entries: [
      ["V", shortcutText({ en: "Switch to cursor mode", zh: "切换到选择模式", ja: "選択モードに切り替え", ru: "Переключить режим выбора" })],
      ["M", shortcutText({ en: "Switch to multi-select mode", zh: "切换到多选模式", ja: "複数選択モードに切り替え", ru: "Переключить режим множественного выбора" })],
      ["E", shortcutText({ en: "Switch to erase mode", zh: "切换到擦除模式", ja: "消去モードに切り替え", ru: "Переключить режим стирания" })],
      ["F", shortcutText({ en: "Switch to fill mode", zh: "切换到填充模式", ja: "塗りつぶしモードに切り替え", ru: "Переключить режим заливки" })],
      ["Q", shortcutText({ en: "Rotate or cycle variant on selected/placed item", zh: "旋转或切换所选 / 待放置物品外观", ja: "選択中または配置予定のアイテムの向きや種類を切り替え", ru: "Повернуть или сменить вариант выбранного или размещаемого предмета" })],
      ["C", shortcutText({ en: "Duplicate selected item or building", zh: "复制选中物品或建筑", ja: "選択したアイテムまたは建物を複製", ru: "Дублировать выбранный предмет или постройку" })],
      ["Del", shortcutText({ en: "Delete selected item or building", zh: "删除选中物品或建筑", ja: "選択したアイテムまたは建物を削除", ru: "Удалить выбранный предмет или постройку" })],
      ["Esc", shortcutText({ en: "Cancel placement or deselect", zh: "取消放置或取消选择", ja: "配置または選択をキャンセル", ru: "Отменить размещение или снять выделение" })],
      ["RMB", shortcutText({ en: "Cancel placement or deselect (right-click)", zh: "右键取消放置或取消选择", ja: "右クリックで配置または選択をキャンセル", ru: "Отменить размещение или снять выделение (правая кнопка)" })],
    ] },
    { heading: shortcutText({ en: "Navigation", zh: "导航", ja: "移動", ru: "Навигация" }), entries: [
      ["W A S D", shortcutText({ en: "Pan the canvas", zh: "平移画布", ja: "キャンバスを移動", ru: "Перемещать холст" })],
      ["↑ ← ↓ →", shortcutText({ en: "Pan the canvas (alternative)", zh: "平移画布（方向键）", ja: "キャンバスを移動（方向キー）", ru: "Перемещать холст (клавиши со стрелками)" })],
      ["R", shortcutText({ en: "Zoom in", zh: "放大", ja: "拡大", ru: "Увеличить" })],
      ["T", shortcutText({ en: "Zoom out", zh: "缩小", ja: "縮小", ru: "Уменьшить" })],
      ["Ctrl / ⌘", shortcutText({ en: "X-ray: hold to see behind overlapping sprites", zh: "按住透视重叠的物品", ja: "透視: 押し続けると重なったスプライトの奥が見える", ru: "Рентген: удерживайте, чтобы видеть перекрытые спрайты" })],
      ["Space", shortcutText({ en: "Hold for X-ray (alternative)", zh: "按住透视（原有快捷键）", ja: "押し続けると透視（別のショートカット）", ru: "Удерживайте для рентгена (запасной вариант)" })],
    ] },
    { heading: shortcutText({ en: "History", zh: "历史", ja: "履歴", ru: "История" }), entries: [
      ["Ctrl / ⌘ Z", shortcutText({ en: "Undo last action", zh: "撤销上一次操作", ja: "直前の操作を元に戻す", ru: "Отменить последнее действие" })],
      ["Ctrl / ⌘ Y", shortcutText({ en: "Redo last action", zh: "重做上一次撤销的操作", ja: "元に戻した操作をやり直す", ru: "Вернуть отменённое действие" })],
      ["Ctrl / ⌘ ⇧ Z", shortcutText({ en: "Redo (alternative)", zh: "重做（备用快捷键）", ja: "やり直す（別のショートカット）", ru: "Вернуть (запасной вариант)" })],
    ] },
  ];
  return (
    <div className="editor-reference-info editor-reference-info--shortcuts">
      {shortcutGroups.map((group) => <section key={group.heading}><h3>{group.heading}</h3><dl>{group.entries.map(([key, description]) => <div key={key}><dt><kbd>{key}</kbd></dt><dd>{description}</dd></div>)}</dl>{group === shortcutGroups[1] ? <p className="editor-shortcuts-hint">{shortcutText({ en: "Enable the bottom Zoom button to zoom with the scroll wheel; two-finger pinch still works.", zh: "滚轮缩放需先开启底部“缩放”按钮；双指捏合仍可缩放", ja: "ホイールでズームするには、下の「ズーム」ボタンを先にオンにしてください。2本指のピンチはそのまま使えます。", ru: "Чтобы масштабировать колесом, включите нижнюю кнопку «Масштаб»; жест двумя пальцами по-прежнему работает." })}</p> : null}</section>)}
    </div>
  );
}

function WhatsNewPanel({
  locale,
}: Readonly<{ locale: PlannerChromeLocale }>) {
  if (locale === "ru") {
    return <RussianWhatsNewPanel />;
  }

  if (locale === "ja") {
    return (
      <div className="editor-reference-info">
        <p className="editor-reference-info__version">v0.1.1 · 2026年4月</p>
        <section>
          <h3>コミュニティマップ</h3>
          <p>コミュニティの牧場マップは、マップのコミュニティタブから使えます。このプランナーに同梱されています。</p>
        </section>
        <section>
          <h3>テーブルの装飾</h3>
          <p>ランプ、植物、その他の対応アイテムをテーブルやエンドテーブルに置けます。</p>
        </section>
        <section>
          <h3>冬の作物</h3>
          <p>{readLocalizedCatalogItemLabel("ja", "Powdermelon")} を作物選択から使えます。</p>
        </section>
        <section>
          <h3>スプリンクラーの影</h3>
          <p>スプリンクラーに、ゲーム内と同じ地面の影が付きます。</p>
        </section>
      </div>
    );
  }

  if (locale === "en" || locale === "zh") {
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

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read what's new panel because locale is ${JSON.stringify(unsupportedLocale)}.`,
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

function getModalLabel(modalId: EditorModalId, copy: EditorModalCopy, locale: PlannerChromeLocale): string {
  if (modalId === "ambience-panel") return readEditorModalText(locale, { en: "Ambience", zh: "氛围", ja: "雰囲気", ru: "Атмосфера" });
  if (modalId === "farm-settings") return readEditorModalText(locale, { en: "Farm Settings", zh: "农场设置", ja: "牧場の設定", ru: "Настройки фермы" });
  if (modalId === "feedback") return readEditorModalText(locale, { en: "Send feedback", zh: "发送反馈", ja: "フィードバックを送信", ru: "Отправить отзыв" });
  if (modalId === "map-picker") {
    return readEditorModalText(locale, { en: "Choose map", zh: "选择地图", ja: "マップを選ぶ", ru: "Выбор карты" });
  }

  if (modalId === "view-panel") {
    return copy.modalTitles.view;
  }

  if (modalId === "save-panel") {
    return readEditorModalText(locale, { en: "Library", zh: "本地项目", ja: "ライブラリ", ru: "Библиотека" });
  }

  if (modalId === "help-info") {
    return readEditorModalText(locale, { en: "Help & Info", zh: "帮助与说明", ja: "ヘルプと説明", ru: "Справка" });
  }

  if (modalId === "keyboard-shortcuts") {
    return readEditorModalText(locale, { en: "Keyboard Shortcuts", zh: "键盘快捷键", ja: "キーボードショートカット", ru: "Сочетания клавиш" });
  }

  if (modalId === "whats-new") {
    return readEditorModalText(locale, { en: "What's New", zh: "What's New", ja: "更新情報", ru: "Что нового" });
  }

  if (modalId === "settings-panel") {
    return copy.modalTitles.settings;
  }

  const unsupportedModalId: never = modalId;
  throw new Error(
    `Cannot read editor modal label because modal id is ${JSON.stringify(unsupportedModalId)}.`,
  );
}

function readEditorModalText(
  locale: PlannerChromeLocale,
  text: Readonly<{ en: string; zh: string; ja: string; ru: string }>,
): string {
  if (locale === "en" || locale === "zh" || locale === "ja" || locale === "ru") {
    return text[locale];
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read editor modal text because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}

function getModalCloseDialogLabel(
  _modalId: EditorModalId,
  copy: EditorModalCopy,
): string {
  return copy.closeDialogLabel;
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
