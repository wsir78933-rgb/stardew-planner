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
  editorSeasons,
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
import { getPlannerMapById, plannerMaps, type PlannerMap } from "../maps/map-catalog";
import { isNpcPathSupportedMapFile } from "../rendering/npc-paths";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";
import { getPlannerMapDisplayName } from "../i18n/catalog-display";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

export type EditorModalProperties = Readonly<{
  locale?: SiteLocale;
  modalId: EditorModalId | null;
  selectedMapId: string;
  season: TilesheetSeason;
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
  onSeasonChange: (season: TilesheetSeason) => void;
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

const mapGroupDefinitions: readonly Readonly<{
  headingKey: string;
  includesMap: (plannerMap: PlannerMap) => boolean;
}>[] = [
  { headingKey: "planner.modal.farm", includesMap: (plannerMap) => plannerMap.category === "farm" },
  {
    headingKey: "planner.modal.interiors",
    includesMap: (plannerMap) => plannerMap.category === "interior",
  },
  {
    headingKey: "planner.modal.exteriors",
    includesMap: (plannerMap) => plannerMap.category === "exterior",
  },
  {
    headingKey: "planner.modal.community",
    includesMap: (plannerMap) =>
      plannerMap.category === "community-farm" ||
      plannerMap.category === "community-interior",
  },
];

export function EditorModal({
  locale = "en",
  modalId,
  selectedMapId,
  season,
  panelPosition,
  behaviorOptions = createInitialEditorBehaviorOptions(),
  displayOptions = createInitialEditorDisplayOptions(),
  mapRenderOptions = createInitialMapRenderOptions(),
  onClose,
  onBehaviorOptionChange = ignoreEditorBehaviorOptionChange,
  onDisplayOptionToggle = ignoreEditorDisplayOptionToggle,
  onMapChange,
  onMapRenderOptionsChange = ignoreMapRenderOptionsChange,
  onSeasonChange,
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
    if (keyboardEvent.key === "Escape") {
      keyboardEvent.preventDefault();
      onClose();
      return;
    }

    if (keyboardEvent.key !== "Tab") {
      return;
    }

    const modalElement = modalElementReference.current;

    if (modalElement === null) {
      throw new Error(`Modal element is unavailable for Tab key in modalId ${JSON.stringify(modalId)}.`);
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

  return (
    <div className="editor-modal__backdrop">
      <section
        aria-labelledby={modalHeadingId}
        aria-modal="true"
        className="editor-modal"
        onKeyDown={handleModalKeyDown}
        ref={modalElementReference}
        role="dialog"
        tabIndex={-1}
      >
        <header className="editor-modal__header">
          <h2 id={modalHeadingId}>{getModalLabel(locale, modalId)}</h2>
          <button aria-label={translate(locale, "planner.modal.close")} onClick={onClose} type="button">
            ×
          </button>
        </header>
        {modalId === "map-picker" ? (
          <>
            {projectMapPanelContent ?? (
              <MapPicker
                locale={locale}
                onMapChange={onMapChange}
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
        {modalId === "season-picker" ? (
          <SeasonPicker locale={locale} onSeasonChange={onSeasonChange} season={season} />
        ) : null}
        {modalId === "view-panel" ? (
          <ViewPanel
            behaviorOptions={behaviorOptions}
            displayOptions={displayOptions}
            locale={locale}
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
            locale={locale}
            onBehaviorOptionChange={onBehaviorOptionChange}
          />
        ) : null}
        {modalId === "help-info" ? <HelpInfoPanel locale={locale} /> : null}
        {modalId === "keyboard-shortcuts" ? <KeyboardShortcutsPanel locale={locale} /> : null}
        {modalId === "whats-new" ? <WhatsNewPanel locale={locale} /> : null}
      </section>
    </div>
  );
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

function MapPicker({
  locale,
  selectedMapId,
  onMapChange,
}: Readonly<{
  locale: SiteLocale;
  selectedMapId: string;
  onMapChange: (mapId: string) => void;
}>) {
  return (
    <div className="editor-modal__map-groups">
      {mapGroupDefinitions.map((mapGroupDefinition) => {
        const groupedMaps = plannerMaps.filter(mapGroupDefinition.includesMap);

        return (
          <section className="editor-modal__map-group" key={mapGroupDefinition.headingKey}>
            <h3>{translate(locale, mapGroupDefinition.headingKey)}</h3>
            <div className="editor-modal__map-grid">
              {groupedMaps.map((plannerMap) => (
                <button
                  aria-pressed={plannerMap.id === selectedMapId}
                  data-editor-map-id={plannerMap.id}
                  key={plannerMap.id}
                  onClick={() => onMapChange(plannerMap.id)}
                  type="button"
                >
                  <img
                    alt=""
                    aria-hidden="true"
                    src={`/game-assets/1.6.15/${plannerMap.previewOutputPath}`}
                  />
                  <span>{getPlannerMapDisplayName(locale, plannerMap.id, plannerMap.displayName)}</span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function SeasonPicker({
  locale,
  season,
  onSeasonChange,
}: Readonly<{
  locale: SiteLocale;
  season: TilesheetSeason;
  onSeasonChange: (season: TilesheetSeason) => void;
}>) {
  return (
    <div className="editor-modal__season-picker">
      {editorSeasons.map((editorSeason) => (
        <button
          aria-pressed={editorSeason === season}
          key={editorSeason}
          onClick={() => onSeasonChange(editorSeason)}
          type="button"
        >
          {formatSeason(locale, editorSeason)}
        </button>
      ))}
    </div>
  );
}

function PanelPositionPicker({
  locale,
  panelPosition,
  onPanelPositionChange,
}: Readonly<{
  locale: SiteLocale;
  panelPosition: EditorPanelPosition;
  onPanelPositionChange: (panelPosition: EditorPanelPosition) => void;
}>) {
  return (
    <div className="editor-modal__panel-picker">
      <p>{translate(locale, "planner.modal.catalogPositionDescription")}</p>
      <button
        aria-pressed={panelPosition === "bottom"}
        onClick={() => onPanelPositionChange("bottom")}
        type="button"
      >
        {translate(locale, "planner.modal.bottomPanel")}
      </button>
      <button
        aria-pressed={panelPosition === "left"}
        onClick={() => onPanelPositionChange("left")}
        type="button"
      >
        {translate(locale, "planner.modal.leftPanel")}
      </button>
    </div>
  );
}

const viewOptionGroups: readonly Readonly<{
  heading: string;
  options: readonly Readonly<{
    key: EditorDisplayOptionKey;
    label: string;
    titleKey: string;
  }>[];
}>[] = [
  {
    heading: "Overlays",
    options: [
      { key: "showGrid", label: "Grid", titleKey: "planner.modal.titles.grid" },
      {
        key: "showSprinklerRadius",
        label: "Sprinkler Radius",
        titleKey: "planner.modal.titles.sprinklerRadius",
      },
      {
        key: "showScarecrowRadius",
        label: "Scarecrow Radius",
        titleKey: "planner.modal.titles.scarecrowRadius",
      },
      {
        key: "showBeeHouseRadius",
        label: "Bee House Range",
        titleKey: "planner.modal.titles.beeHouseRange",
      },
      {
        key: "showJunimoHutRadius",
        label: "Junimo Hut Range",
        titleKey: "planner.modal.titles.junimoHutRange",
      },
    ],
  },
  {
    heading: "Map Overlays",
    options: [
      {
        key: "showBuildableTiles",
        label: "Blocked (Buildings)",
        titleKey: "planner.modal.titles.blockedBuildings",
      },
      {
        key: "showCropTiles",
        label: "Blocked (Crops)",
        titleKey: "planner.modal.titles.blockedCrops",
      },
      {
        key: "showTreeTiles",
        label: "Blocked (Trees)",
        titleKey: "planner.modal.titles.blockedTrees",
      },
    ],
  },
  {
    heading: "Display",
    options: [
      {
        key: "showNightMode",
        label: "Night Mode",
        titleKey: "planner.modal.titles.nightMode",
      },
    ],
  },
];

function ViewPanel({
  behaviorOptions,
  displayOptions,
  locale,
  onBehaviorOptionChange,
  onDisplayOptionToggle,
  onPanelPositionChange,
  panelPosition,
  selectedMapId,
}: Readonly<{
  behaviorOptions: EditorBehaviorOptions;
  displayOptions: EditorDisplayOptions;
  locale: SiteLocale;
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
          <h3>{getEditorModalText(locale, viewOptionGroup.heading)}</h3>
          <div className="editor-modal__view-options">
            {viewOptionGroup.options.map((viewOption) => (
              <button
                aria-pressed={displayOptions[viewOption.key]}
                key={viewOption.key}
                onClick={() => onDisplayOptionToggle(viewOption.key)}
                title={translate(locale, viewOption.titleKey)}
                type="button"
              >
                {getEditorModalText(locale, viewOption.label)}
              </button>
            ))}
            {viewOptionGroup.heading === "Map Overlays" &&
            shouldShowNpcPathOption ? (
              <button
                aria-pressed={displayOptions.showNpcPaths}
                onClick={() => onDisplayOptionToggle("showNpcPaths")}
                title={translate(locale, "planner.modal.titles.npcPaths")}
                type="button"
              >
                {translate(locale, "planner.modal.npcPaths")}
              </button>
            ) : null}
          </div>
        </section>
      ))}
      <section className="editor-modal__view-section">
        <h3>{translate(locale, "planner.modal.resourceClumps")}</h3>
        <div className="editor-modal__view-options">
          <button
            aria-pressed={behaviorOptions.autoShowResourceClumps}
            onClick={() =>
              onBehaviorOptionChange(
                "autoShowResourceClumps",
                !behaviorOptions.autoShowResourceClumps,
              )
            }
            title={translate(locale, "planner.modal.titles.resourceClumps")}
            type="button"
          >
            {translate(locale, "planner.modal.resourceClumps")}
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>{translate(locale, "planner.modal.display")}</h3>
        <div className="editor-modal__view-options">
          <button disabled title={translate(locale, "planner.modal.titles.weather")} type="button">
            {translate(locale, "planner.modal.weather")}
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>{translate(locale, "planner.modal.catalogPosition")}</h3>
        <PanelPositionPicker
          locale={locale}
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
    titleKey: string;
  }>[];
}>[] = [
  {
    heading: "Mobile",
    options: [
      {
        key: "showJoystick",
        label: "Joystick",
        titleKey: "planner.modal.titles.joystick",
      },
      {
        key: "leftHandMode",
        label: "Left-hand Mode",
        titleKey: "planner.modal.titles.leftHand",
      },
    ],
  },
  {
    heading: "Notifications",
    options: [
      {
        key: "showToasts",
        label: "Toast Notifications",
        titleKey: "planner.modal.titles.toasts",
      },
    ],
  },
  {
    heading: "Interface",
    options: [
      {
        key: "gameCursors",
        label: "Game-Styled Cursors",
        titleKey: "planner.modal.titles.cursors",
      },
    ],
  },
];

function SettingsPanel({
  behaviorOptions,
  locale,
  onBehaviorOptionChange,
}: Readonly<{
  behaviorOptions: EditorBehaviorOptions;
  locale: SiteLocale;
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
          <h3>{getEditorModalText(locale, settingsOptionGroup.heading)}</h3>
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
                title={translate(locale, settingsOption.titleKey)}
                type="button"
              >
                {getEditorModalText(locale, settingsOption.label)}
              </button>
            ))}
          </div>
        </section>
      ))}
      <section className="editor-modal__view-section">
        <h3>{translate(locale, "planner.modal.placement")}</h3>
        <div className="editor-modal__view-options">
          <button
            aria-pressed={behaviorOptions.freePlacement}
            onClick={handleFreePlacementClick}
            title={translate(locale, "planner.modal.titles.freePlacement")}
            type="button"
          >
            {translate(locale, "planner.modal.freePlacement")}
          </button>
        </div>
        {isConfirmingFreePlacement ? (
          <div className="editor-modal__free-placement-warning" role="alert">
            <p>
              {translate(locale, "planner.modal.freePlacementWarning")}
            </p>
            <div>
              <button onClick={() => setIsConfirmingFreePlacement(false)} type="button">
                {translate(locale, "planner.modal.cancel")}
              </button>
              <button onClick={confirmFreePlacement} type="button">
                {translate(locale, "planner.modal.enableFreePlacement")}
              </button>
            </div>
          </div>
        ) : null}
      </section>
      <section className="editor-modal__view-section">
        <h3>{translate(locale, "planner.modal.community")}</h3>
        <div className="editor-modal__view-options">
          <button disabled title={translate(locale, "planner.modal.titles.manageMods")} type="button">
            {translate(locale, "planner.modal.manageMods")}
          </button>
        </div>
      </section>
      <section className="editor-modal__view-section">
        <h3>{translate(locale, "planner.modal.jojaStuff")}</h3>
        <div className="editor-modal__view-options">
          <a href="/privacy" target="_blank" rel="noreferrer">{translate(locale, "planner.modal.privacy")}</a>
          <a href="/terms" target="_blank" rel="noreferrer">{translate(locale, "planner.modal.terms")}</a>
        </div>
      </section>
    </div>
  );
}

function HelpInfoPanel({ locale }: Readonly<{ locale: SiteLocale }>) {
  return (
    <div className="editor-reference-info">
      <section>
        <h3>{translate(locale, "planner.reference.features")}</h3>
        <ul>
          <li>{translate(locale, "planner.reference.clickCycling")}</li>
          <li>{translate(locale, "planner.reference.xray")}</li>
          <li>{translate(locale, "planner.reference.drag")}</li>
          <li>{translate(locale, "planner.reference.paint")}</li>
          <li>{translate(locale, "planner.reference.radius")}</li>
        </ul>
      </section>
      <section>
        <h3>{translate(locale, "planner.reference.goodToKnow")}</h3>
        <ul>
          <li>{translate(locale, "planner.reference.localProjects")}</li>
          <li>{translate(locale, "planner.reference.freePlacement")}</li>
          <li>{translate(locale, "planner.reference.interior")}</li>
        </ul>
      </section>
      <section>
        <h3>{translate(locale, "planner.reference.maps")}</h3>
        <p>{translate(locale, "planner.reference.mapsDescription")}</p>
      </section>
    </div>
  );
}

function KeyboardShortcutsPanel({ locale }: Readonly<{ locale: SiteLocale }>) {
  return (
    <div className="editor-reference-info editor-reference-info--shortcuts">
      <section>
        <h3>{translate(locale, "planner.reference.tools")}</h3>
        <dl>
          <div><dt>V</dt><dd>{translate(locale, "planner.reference.cursorMode")}</dd></div>
          <div><dt>M</dt><dd>{translate(locale, "planner.reference.multiSelectMode")}</dd></div>
          <div><dt>E</dt><dd>{translate(locale, "planner.reference.eraseMode")}</dd></div>
          <div><dt>F</dt><dd>{translate(locale, "planner.reference.fillMode")}</dd></div>
          <div><dt>Q</dt><dd>{translate(locale, "planner.reference.rotate")}</dd></div>
          <div><dt>C</dt><dd>{translate(locale, "planner.reference.copy")}</dd></div>
          <div><dt>Delete</dt><dd>{translate(locale, "planner.reference.delete")}</dd></div>
          <div><dt>Esc / Right click</dt><dd>{translate(locale, "planner.reference.cancel")}</dd></div>
        </dl>
      </section>
      <section>
        <h3>{translate(locale, "planner.reference.camera")}</h3>
        <dl>
          <div><dt>WASD / Arrow keys</dt><dd>{translate(locale, "planner.reference.pan")}</dd></div>
          <div><dt>R / T</dt><dd>{translate(locale, "planner.reference.zoom")}</dd></div>
          <div><dt>Wheel / pinch</dt><dd>{translate(locale, "planner.reference.zoomCursor")}</dd></div>
          <div><dt>Space</dt><dd>{translate(locale, "planner.reference.holdXray")}</dd></div>
        </dl>
      </section>
      <section>
        <h3>{translate(locale, "planner.reference.history")}</h3>
        <dl>
          <div><dt>Ctrl/Cmd + Z</dt><dd>{translate(locale, "planner.reference.undo")}</dd></div>
          <div><dt>Ctrl/Cmd + Y</dt><dd>{translate(locale, "planner.reference.redo")}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function WhatsNewPanel({ locale }: Readonly<{ locale: SiteLocale }>) {
  return (
    <div className="editor-reference-info">
      <p className="editor-reference-info__version">{translate(locale, "planner.reference.version")}</p>
      <section>
        <h3>{translate(locale, "planner.reference.communityMaps")}</h3>
        <p>{translate(locale, "planner.reference.communityMapsDescription")}</p>
      </section>
      <section>
        <h3>{translate(locale, "planner.reference.tableDecor")}</h3>
        <p>{translate(locale, "planner.reference.tableDecorDescription")}</p>
      </section>
      <section>
        <h3>{translate(locale, "planner.reference.winterCrops")}</h3>
        <p>{translate(locale, "planner.reference.winterCropsDescription")}</p>
      </section>
      <section>
        <h3>{translate(locale, "planner.reference.sprinklerShadows")}</h3>
        <p>{translate(locale, "planner.reference.sprinklerShadowsDescription")}</p>
      </section>
    </div>
  );
}

function getModalLabel(locale: SiteLocale, modalId: EditorModalId): string {
  if (modalId === "map-picker") {
    return translate(locale, "planner.modal.chooseMap");
  }

  if (modalId === "season-picker") {
    return translate(locale, "planner.modal.chooseSeason");
  }

  if (modalId === "view-panel") {
    return translate(locale, "planner.modal.view");
  }

  if (modalId === "save-panel") {
    return translate(locale, "planner.modal.save");
  }

  if (modalId === "help-info") {
    return translate(locale, "planner.modal.help");
  }

  if (modalId === "keyboard-shortcuts") {
    return translate(locale, "planner.modal.shortcuts");
  }

  if (modalId === "whats-new") {
    return translate(locale, "planner.modal.whatsNew");
  }

  return translate(locale, "planner.modal.settings");
}

function formatSeason(locale: SiteLocale, season: TilesheetSeason): string {
  if (locale === "zh-CN") {
    return { spring: "春季", summer: "夏季", fall: "秋季", winter: "冬季" }[season];
  }

  return season;
}

function getEditorModalText(locale: SiteLocale, sourceText: string): string {
  const messageKeyBySourceText: Readonly<Record<string, string>> = {
    Overlays: "planner.modal.overlays",
    "Map Overlays": "planner.modal.mapOverlays",
    Display: "planner.modal.display",
    Grid: "planner.modal.grid",
    "Sprinkler Radius": "planner.modal.sprinklerRadius",
    "Scarecrow Radius": "planner.modal.scarecrowRadius",
    "Bee House Range": "planner.modal.beeHouseRange",
    "Junimo Hut Range": "planner.modal.junimoHutRange",
    "Blocked (Buildings)": "planner.modal.blockedBuildings",
    "Blocked (Crops)": "planner.modal.blockedCrops",
    "Blocked (Trees)": "planner.modal.blockedTrees",
    "Night Mode": "planner.modal.nightMode",
    Mobile: "planner.modal.mobile",
    Joystick: "planner.modal.joystick",
    "Left-hand Mode": "planner.modal.leftHand",
    Notifications: "planner.modal.notifications",
    "Toast Notifications": "planner.modal.toasts",
    Interface: "planner.modal.interface",
    "Game-Styled Cursors": "planner.modal.cursors",
  };
  const messageKey = messageKeyBySourceText[sourceText];

  return messageKey === undefined ? sourceText : translate(locale, messageKey);
}
