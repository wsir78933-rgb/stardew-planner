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

type EditorModalProperties = Readonly<{
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

  const editorModalClassName =
    modalId === "map-picker"
      ? "editor-modal editor-modal--map-picker"
      : modalId === "save-panel"
        ? "editor-modal editor-modal--save-panel"
        : "editor-modal";

  return (
    <div className="editor-modal__backdrop">
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
          <h2 id={modalHeadingId}>{getModalLabel(modalId)}</h2>
          <button aria-label="Close dialog" onClick={onClose} type="button">
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
            displayOptions={displayOptions}
            onBehaviorOptionChange={onBehaviorOptionChange}
            onDisplayOptionToggle={onDisplayOptionToggle}
            onPanelPositionChange={onPanelPositionChange}
            panelPosition={panelPosition}
            selectedMapId={selectedMapId}
          />
        ) : null}
        {modalId === "save-panel" ? savePanelContent : null}
        {modalId === "settings-panel" ? (
          <SettingsPanel
            behaviorOptions={behaviorOptions}
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
  panelPosition,
  onPanelPositionChange,
}: Readonly<{
  panelPosition: EditorPanelPosition;
  onPanelPositionChange: (panelPosition: EditorPanelPosition) => void;
}>) {
  return (
    <div className="editor-modal__panel-picker">
      <p>Choose where the item catalog appears in this browser.</p>
      <button
        aria-pressed={panelPosition === "bottom"}
        onClick={() => onPanelPositionChange("bottom")}
        type="button"
      >
        Bottom panel
      </button>
      <button
        aria-pressed={panelPosition === "left"}
        onClick={() => onPanelPositionChange("left")}
        type="button"
      >
        Left panel
      </button>
    </div>
  );
}

const viewOptionGroups: readonly Readonly<{
  heading: string;
  options: readonly Readonly<{
    key: EditorDisplayOptionKey;
    label: string;
    title: string;
  }>[];
}>[] = [
  {
    heading: "Overlays",
    options: [
      { key: "showGrid", label: "Grid", title: "Show tile grid lines on the map" },
      {
        key: "showSprinklerRadius",
        label: "Sprinkler Radius",
        title: "Highlight tiles watered by each sprinkler",
      },
      {
        key: "showScarecrowRadius",
        label: "Scarecrow Radius",
        title: "Highlight tiles protected from crows",
      },
      {
        key: "showBeeHouseRadius",
        label: "Bee House Range",
        title: "Highlight flower range for honey production",
      },
      {
        key: "showJunimoHutRadius",
        label: "Junimo Hut Range",
        title: "Highlight harvest area for Junimo Huts",
      },
    ],
  },
  {
    heading: "Map Overlays",
    options: [
      {
        key: "showBuildableTiles",
        label: "Blocked (Buildings)",
        title: "Show where buildings cannot be placed",
      },
      {
        key: "showCropTiles",
        label: "Blocked (Crops)",
        title: "Show where crops cannot be planted",
      },
      {
        key: "showTreeTiles",
        label: "Blocked (Trees)",
        title: "Show where trees cannot grow",
      },
    ],
  },
  {
    heading: "Display",
    options: [
      {
        key: "showNightMode",
        label: "Night Mode",
        title: "Preview your farm at night with light sources",
      },
    ],
  },
];

function ViewPanel({
  behaviorOptions,
  displayOptions,
  onBehaviorOptionChange,
  onDisplayOptionToggle,
  onPanelPositionChange,
  panelPosition,
  selectedMapId,
}: Readonly<{
  behaviorOptions: EditorBehaviorOptions;
  displayOptions: EditorDisplayOptions;
  onBehaviorOptionChange: (
    editorBehaviorOptionKey: EditorBehaviorOptionKey,
    nextValue: boolean,
  ) => void;
  onDisplayOptionToggle: (editorDisplayOptionKey: EditorDisplayOptionKey) => void;
  onPanelPositionChange: (panelPosition: EditorPanelPosition) => void;
  panelPosition: EditorPanelPosition;
  selectedMapId: string;
}>) {
  const shouldShowNpcPathOption = isNpcPathSupportedMapFile(
    getPlannerMapById(selectedMapId).mapFile,
  );

  return (
    <div className="editor-modal__view-panel">
      {viewOptionGroups.map((viewOptionGroup) => (
        <section className="editor-modal__view-section" key={viewOptionGroup.heading}>
          <h3>{viewOptionGroup.heading}</h3>
          <div className="editor-modal__view-options">
            {viewOptionGroup.options.map((viewOption) => (
              <button
                aria-pressed={displayOptions[viewOption.key]}
                key={viewOption.key}
                onClick={() => onDisplayOptionToggle(viewOption.key)}
                title={viewOption.title}
                type="button"
              >
                {viewOption.label}
              </button>
            ))}
            {viewOptionGroup.heading === "Map Overlays" &&
            shouldShowNpcPathOption ? (
              <button
                aria-pressed={displayOptions.showNpcPaths}
                onClick={() => onDisplayOptionToggle("showNpcPaths")}
                title="Show tiles NPCs walk through"
                type="button"
              >
                NPC Paths
              </button>
            ) : null}
          </div>
        </section>
      ))}
      <section className="editor-modal__view-section">
        <h3>Resource Clumps</h3>
        <div className="editor-modal__view-options">
          <button
            aria-pressed={behaviorOptions.autoShowResourceClumps}
            onClick={() =>
              onBehaviorOptionChange(
                "autoShowResourceClumps",
                !behaviorOptions.autoShowResourceClumps,
              )
            }
            title="Show spawn locations while a resource clump is selected"
            type="button"
          >
            Resource Clumps
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>Display</h3>
        <div className="editor-modal__view-options">
          <button disabled title="Simulate rain, snow, and other weather effects" type="button">
            Weather
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>Catalog Position</h3>
        <PanelPositionPicker
          onPanelPositionChange={onPanelPositionChange}
          panelPosition={panelPosition}
        />
      </section>
    </div>
  );
}

const settingsOptionGroups: readonly Readonly<{
  heading: string;
  options: readonly Readonly<{
    key: EditorBehaviorOptionKey;
    label: string;
    title: string;
  }>[];
}>[] = [
  {
    heading: "Mobile",
    options: [
      {
        key: "showJoystick",
        label: "Joystick",
        title: "Show directional pad for precise item placement on touch devices",
      },
      {
        key: "leftHandMode",
        label: "Left-hand Mode",
        title: "Move controls to the left side of the screen",
      },
    ],
  },
  {
    heading: "Notifications",
    options: [
      {
        key: "showToasts",
        label: "Toast Notifications",
        title: "Show brief notifications for tool changes, undo/redo, and actions",
      },
    ],
  },
  {
    heading: "Interface",
    options: [
      {
        key: "gameCursors",
        label: "Game-Styled Cursors",
        title: "Use the pixel-art game-styled cursors instead of your OS cursors",
      },
    ],
  },
];

function SettingsPanel({
  behaviorOptions,
  onBehaviorOptionChange,
}: Readonly<{
  behaviorOptions: EditorBehaviorOptions;
  onBehaviorOptionChange: (
    editorBehaviorOptionKey: EditorBehaviorOptionKey,
    nextValue: boolean,
  ) => void;
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
      {settingsOptionGroups.map((settingsOptionGroup) => (
        <section className="editor-modal__view-section" key={settingsOptionGroup.heading}>
          <h3>{settingsOptionGroup.heading}</h3>
          <div className="editor-modal__view-options">
            {settingsOptionGroup.options.map((settingsOption) => (
              <button
                aria-pressed={behaviorOptions[settingsOption.key]}
                key={settingsOption.key}
                onClick={() =>
                  onBehaviorOptionChange(
                    settingsOption.key,
                    !behaviorOptions[settingsOption.key],
                  )
                }
                title={settingsOption.title}
                type="button"
              >
                {settingsOption.label}
              </button>
            ))}
          </div>
        </section>
      ))}
      <section className="editor-modal__view-section">
        <h3>Placement</h3>
        <div className="editor-modal__view-options">
          <button
            aria-pressed={behaviorOptions.freePlacement}
            onClick={handleFreePlacementClick}
            title="Disable placement rules, place items anywhere on the map"
            type="button"
          >
            Free Placement
          </button>
        </div>
        {isConfirmingFreePlacement ? (
          <div className="editor-modal__free-placement-warning" role="alert">
            <p>
              Free placement disables map placement rules. Some layouts may not
              be achievable in-game.
            </p>
            <div>
              <button onClick={() => setIsConfirmingFreePlacement(false)} type="button">
                Cancel
              </button>
              <button onClick={confirmFreePlacement} type="button">
                Enable Free Placement
              </button>
            </div>
          </div>
        ) : null}
      </section>
      <section className="editor-modal__view-section">
        <h3>Community</h3>
        <div className="editor-modal__view-options">
          <button disabled title="Add and manage Content Patcher mods" type="button">
            Manage Mods
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>Joja Stuff</h3>
        <div className="editor-modal__view-options">
          <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
          <a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a>
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

function getModalLabel(modalId: EditorModalId): string {
  if (modalId === "map-picker") {
    return "Choose map";
  }

  if (modalId === "view-panel") {
    return "View";
  }

  if (modalId === "save-panel") {
    return "Save";
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

  return "Settings";
}
