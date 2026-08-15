"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  type EditorModalId,
  type EditorPanelPosition,
} from "../editor/editor-view-state";
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
import { getPlannerMapById, plannerMaps } from "../maps/map-catalog";
import { isNpcPathSupportedMapFile } from "../rendering/npc-paths";
import { PlannerMapPicker } from "./planner-map-picker";
import { closeModalFromBackdropClick } from "./modal-backdrop-close";
import type { EditorModalCopy } from "../i18n/editor-modal-copy";

type EditorModalProperties = Readonly<{
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
        modalTriggerElementReference.current = null;
        isModalOpenReference.current = false;
      }

      return;
    }

    if (modalElement === null) {
      throw new Error(`Modal element is unavailable for modalId ${JSON.stringify(modalId)}.`);
    }

    if (!isModalOpenReference.current) {
      modalTriggerElementReference.current = getModalActiveElement(modalElement);
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
          <h2 id={modalHeadingId}>{getModalLabel(modalId, copy)}</h2>
          <button
            aria-label={getModalCloseDialogLabel(modalId, copy)}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>
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
          <ViewPanel
            behaviorOptions={behaviorOptions}
            copy={copy.view}
            displayOptions={displayOptions}
            onBehaviorOptionChange={onBehaviorOptionChange}
            onDisplayOptionToggle={onDisplayOptionToggle}
            onPanelPositionChange={onPanelPositionChange}
            panelPosition={panelPosition}
            selectedMapId={selectedMapId}
            stateLabel={copy.stateLabel}
          />
        ) : null}
        {modalId === "save-panel" ? savePanelContent : null}
        {modalId === "settings-panel" ? (
          <SettingsPanel
            behaviorOptions={behaviorOptions}
            copy={copy.settings}
            stateLabel={copy.stateLabel}
            unavailableStatusLabel={copy.view.unavailableWeather.statusLabel}
            onBehaviorOptionChange={onBehaviorOptionChange}
          />
        ) : null}
        {modalId === "help-info" ? <HelpInfoPanel /> : null}
        {modalId === "keyboard-shortcuts" ? <KeyboardShortcutsPanel /> : null}
        {modalId === "whats-new" ? <WhatsNewPanel /> : null}
      </section>
    </div>
  );
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

function PanelPositionPicker({
  copy,
  panelPosition,
  onPanelPositionChange,
  stateLabel,
}: Readonly<{
  copy: EditorModalCopy["view"]["catalogPosition"];
  panelPosition: EditorPanelPosition;
  onPanelPositionChange: (panelPosition: EditorPanelPosition) => void;
  stateLabel: EditorModalCopy["stateLabel"];
}>) {
  return (
    <div className="editor-modal__panel-picker">
      <p>{copy.description}</p>
      <button
        aria-pressed={panelPosition === "bottom"}
        data-state-label={stateLabel(panelPosition === "bottom")}
        onClick={() => onPanelPositionChange("bottom")}
        type="button"
      >
        {copy.bottomPanel}
      </button>
      <button
        aria-pressed={panelPosition === "left"}
        data-state-label={stateLabel(panelPosition === "left")}
        onClick={() => onPanelPositionChange("left")}
        type="button"
      >
        {copy.leftPanel}
      </button>
    </div>
  );
}

const viewOptionGroups: readonly Readonly<{
  options: readonly EditorDisplayOptionKey[];
}>[] = [
  {
    options: [
      "showGrid",
      "showSprinklerRadius",
      "showScarecrowRadius",
      "showBeeHouseRadius",
      "showJunimoHutRadius",
    ],
  },
  {
    options: [
      "showBuildableTiles",
      "showCropTiles",
      "showTreeTiles",
    ],
  },
  {
    options: ["showNightMode"],
  },
];

function ViewPanel({
  behaviorOptions,
  copy,
  displayOptions,
  onBehaviorOptionChange,
  onDisplayOptionToggle,
  onPanelPositionChange,
  panelPosition,
  selectedMapId,
  stateLabel,
}: Readonly<{
  behaviorOptions: EditorBehaviorOptions;
  copy: EditorModalCopy["view"];
  displayOptions: EditorDisplayOptions;
  onBehaviorOptionChange: (
    editorBehaviorOptionKey: EditorBehaviorOptionKey,
    nextValue: boolean,
  ) => void;
  onDisplayOptionToggle: (editorDisplayOptionKey: EditorDisplayOptionKey) => void;
  onPanelPositionChange: (panelPosition: EditorPanelPosition) => void;
  panelPosition: EditorPanelPosition;
  selectedMapId: string;
  stateLabel: EditorModalCopy["stateLabel"];
}>) {
  const shouldShowNpcPathOption = isNpcPathSupportedMapFile(
    getPlannerMapById(selectedMapId).mapFile,
  );

  return (
    <div className="editor-modal__view-panel">
      {viewOptionGroups.map((viewOptionGroup, groupIndex) => {
        const viewOptionGroupCopy = copy.optionGroups[groupIndex];

        if (viewOptionGroupCopy === undefined) {
          throw new Error(`View modal copy is missing option group ${String(groupIndex)}.`);
        }

        return (
        <section className="editor-modal__view-section" key={viewOptionGroupCopy.heading}>
          <h3>{viewOptionGroupCopy.heading}</h3>
          <div className="editor-modal__view-options">
            {viewOptionGroup.options.map((viewOptionKey, optionIndex) => {
              const viewOptionCopy = viewOptionGroupCopy.options[optionIndex];

              if (viewOptionCopy === undefined) {
                throw new Error(
                  `View modal copy is missing option ${String(optionIndex)} in group ${String(groupIndex)}.`,
                );
              }

              return (
                <button
                  aria-pressed={displayOptions[viewOptionKey]}
                  data-state-label={stateLabel(displayOptions[viewOptionKey])}
                  key={viewOptionKey}
                  onClick={() => onDisplayOptionToggle(viewOptionKey)}
                  title={viewOptionCopy.title}
                  type="button"
                >
                  {viewOptionCopy.label}
                </button>
              );
            })}
            {groupIndex === 1 &&
            shouldShowNpcPathOption ? (
              <button
                aria-pressed={displayOptions.showNpcPaths}
                data-state-label={stateLabel(displayOptions.showNpcPaths)}
                onClick={() => onDisplayOptionToggle("showNpcPaths")}
                title={copy.npcPaths.title}
                type="button"
              >
                {copy.npcPaths.label}
              </button>
            ) : null}
          </div>
        </section>
        );
      })}
      <section className="editor-modal__view-section">
        <h3>{copy.mapObjects.heading}</h3>
        <div className="editor-modal__view-options">
          <button
            aria-pressed={behaviorOptions.autoShowResourceClumps}
            data-state-label={stateLabel(behaviorOptions.autoShowResourceClumps)}
            onClick={() =>
              onBehaviorOptionChange(
                "autoShowResourceClumps",
                !behaviorOptions.autoShowResourceClumps,
              )
            }
            title={copy.mapObjects.option.title}
            type="button"
          >
            {copy.mapObjects.option.label}
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>{copy.unavailableWeather.heading}</h3>
        <div className="editor-modal__view-options">
          <button disabled title={copy.unavailableWeather.title} type="button">
            {copy.unavailableWeather.label}
            <span className="editor-modal__option-status">{copy.unavailableWeather.statusLabel}</span>
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>{copy.catalogPosition.heading}</h3>
        <PanelPositionPicker
          copy={copy.catalogPosition}
          onPanelPositionChange={onPanelPositionChange}
          panelPosition={panelPosition}
          stateLabel={stateLabel}
        />
      </section>
    </div>
  );
}

const settingsOptionGroups: readonly Readonly<{
  options: readonly EditorBehaviorOptionKey[];
}>[] = [
  {
    options: ["showJoystick", "leftHandMode"],
  },
  {
    options: ["showToasts"],
  },
  {
    options: ["gameCursors"],
  },
];

function SettingsPanel({
  behaviorOptions,
  copy,
  onBehaviorOptionChange,
  stateLabel,
  unavailableStatusLabel,
}: Readonly<{
  behaviorOptions: EditorBehaviorOptions;
  copy: EditorModalCopy["settings"];
  onBehaviorOptionChange: (
    editorBehaviorOptionKey: EditorBehaviorOptionKey,
    nextValue: boolean,
  ) => void;
  stateLabel: EditorModalCopy["stateLabel"];
  unavailableStatusLabel: string;
}>) {
  const [isConfirmingFreePlacement, setIsConfirmingFreePlacement] =
    useState(false);

  function handleFreePlacementClick(): void {
    if (behaviorOptions.freePlacement) {
      onBehaviorOptionChange("freePlacement", false);
      return;
    }

    setIsConfirmingFreePlacement(true);
  }

  function confirmFreePlacement(): void {
    onBehaviorOptionChange("freePlacement", true);
    setIsConfirmingFreePlacement(false);
  }

  return (
    <div className="editor-modal__settings-panel">
      {settingsOptionGroups.map((settingsOptionGroup, groupIndex) => {
        const settingsOptionGroupCopy = copy.optionGroups[groupIndex];

        if (settingsOptionGroupCopy === undefined) {
          throw new Error(`Settings modal copy is missing option group ${String(groupIndex)}.`);
        }

        return (
        <section className="editor-modal__view-section" key={settingsOptionGroupCopy.heading}>
          <h3>{settingsOptionGroupCopy.heading}</h3>
          <div className="editor-modal__view-options">
            {settingsOptionGroup.options.map((settingsOptionKey, optionIndex) => {
              const settingsOptionCopy = settingsOptionGroupCopy.options[optionIndex];

              if (settingsOptionCopy === undefined) {
                throw new Error(
                  `Settings modal copy is missing option ${String(optionIndex)} in group ${String(groupIndex)}.`,
                );
              }

              return (
                <button
                  aria-pressed={behaviorOptions[settingsOptionKey]}
                  data-state-label={stateLabel(behaviorOptions[settingsOptionKey])}
                  key={settingsOptionKey}
                  onClick={() =>
                    onBehaviorOptionChange(
                      settingsOptionKey,
                      !behaviorOptions[settingsOptionKey],
                    )
                  }
                  title={settingsOptionCopy.title}
                  type="button"
                >
                  {settingsOptionCopy.label}
                </button>
              );
            })}
          </div>
        </section>
        );
      })}
      <section className="editor-modal__view-section">
        <h3>{copy.placementHeading}</h3>
        <div className="editor-modal__view-options">
          <button
            aria-pressed={behaviorOptions.freePlacement}
            data-state-label={stateLabel(behaviorOptions.freePlacement)}
            onClick={handleFreePlacementClick}
            title={copy.freePlacement.title}
            type="button"
          >
            {copy.freePlacement.label}
          </button>
        </div>
        {isConfirmingFreePlacement ? (
          <div className="editor-modal__free-placement-warning" role="alert">
            <p>{copy.freePlacementWarning}</p>
            <div>
              <button onClick={() => setIsConfirmingFreePlacement(false)} type="button">
                {copy.warningActions.cancel}
              </button>
              <button onClick={confirmFreePlacement} type="button">
                {copy.warningActions.confirm}
              </button>
            </div>
          </div>
        ) : null}
      </section>
      <section className="editor-modal__view-section">
        <h3>{copy.community.heading}</h3>
        <div className="editor-modal__view-options">
          <button disabled title={copy.community.manageMods.title} type="button">
            {copy.community.manageMods.label}
            <span className="editor-modal__option-status">{unavailableStatusLabel}</span>
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>{copy.legalHeading}</h3>
        <div className="editor-modal__view-options editor-modal__legal-links">
          <a href={copy.privacyPolicy.href} target="_blank" rel="noreferrer">{copy.privacyPolicy.label}</a>
          <a href={copy.termsOfService.href} target="_blank" rel="noreferrer">{copy.termsOfService.label}</a>
        </div>
      </section>
    </div>
  );
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

function KeyboardShortcutsPanel() {
  return (
    <div className="editor-reference-info editor-reference-info--shortcuts">
      <section>
        <h3>Tools</h3>
        <dl>
          <div><dt>V</dt><dd>Switch to cursor mode</dd></div>
          <div><dt>M</dt><dd>Switch to multi-select mode</dd></div>
          <div><dt>E</dt><dd>Switch to erase mode</dd></div>
          <div><dt>F</dt><dd>Switch to fill mode</dd></div>
          <div><dt>Q</dt><dd>Cycle the selected item appearance</dd></div>
          <div><dt>C</dt><dd>Copy the selected placement</dd></div>
          <div><dt>Delete</dt><dd>Delete the selected placement</dd></div>
          <div><dt>Esc / Right click</dt><dd>Cancel placement or clear selection</dd></div>
        </dl>
      </section>
      <section>
        <h3>Camera</h3>
        <dl>
          <div><dt>WASD / Arrow keys</dt><dd>Pan the canvas</dd></div>
          <div><dt>R / T</dt><dd>Zoom in or out</dd></div>
          <div><dt>Wheel / pinch</dt><dd>Zoom toward the cursor</dd></div>
          <div><dt>Space</dt><dd>Hold for X-ray</dd></div>
        </dl>
      </section>
      <section>
        <h3>History</h3>
        <dl>
          <div><dt>Ctrl/Cmd + Z</dt><dd>Undo the last action</dd></div>
          <div><dt>Ctrl/Cmd + Y</dt><dd>Redo the last undone action</dd></div>
        </dl>
      </section>
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
    modalId === "help-info"
  ) {
    return "editor-modal__backdrop editor-modal__backdrop--viewport-fixed";
  }

  return "editor-modal__backdrop";
}

function getModalLabel(modalId: EditorModalId, copy: EditorModalCopy): string {
  if (modalId === "map-picker") {
    return "Choose map";
  }

  if (modalId === "view-panel") {
    return copy.modalTitles.view;
  }

  if (modalId === "save-panel") {
    return copy.modalTitles.save;
  }

  if (modalId === "help-info") {
    return "Help & Info";
  }

  if (modalId === "keyboard-shortcuts") {
    return "Keyboard Shortcuts";
  }

  if (modalId === "whats-new") {
    return "What's New";
  }

  return copy.modalTitles.settings;
}

function getModalCloseDialogLabel(
  modalId: EditorModalId,
  copy: EditorModalCopy,
): string {
  if (
    modalId === "save-panel" ||
    modalId === "view-panel" ||
    modalId === "settings-panel"
  ) {
    return copy.closeDialogLabel;
  }

  return "Close dialog";
}
