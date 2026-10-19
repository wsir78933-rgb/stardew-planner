import { cloneElement, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EditorModal,
  shouldHandleEditorModalKeyboardEvent,
} from "../../src/components/editor-modal";
import { closeModalFromBackdropClick } from "../../src/components/modal-backdrop-close";
import { getEditorModalCopy } from "../../src/i18n/editor-modal-copy";
import { createInitialEditorDisplayOptions } from "../../src/editor/editor-display-options";
import {
  editorModalIds,
  type EditorModalId,
} from "../../src/editor/editor-view-state";
import { FarmSettingsPanel } from "../../src/components/farm-settings-panel";
import { MapConfigurationPanel } from "../../src/components/map-configuration-panel";
import { PlannerMapPicker } from "../../src/components/planner-map-picker";
import { readEditorMenuModalFocusTarget, rememberEditorMenuModalFocusTarget } from "../../src/components/editor-menu-bar";
import { createInitialMapRenderOptions, type MapRenderOptions } from "../../src/maps/map-render-options";

const modalHookState = vi.hoisted(() => ({
  isEnabled: false,
  referenceCursor: 0,
  references: [] as Array<{ current: unknown }>,
  effects: [] as Array<() => void | (() => void)>,
}));

vi.mock("react", async (importOriginal) => {
  const actualReact = await importOriginal<typeof import("react")>();

  return {
    ...actualReact,
    useId: () => modalHookState.isEnabled ? "modal-test-heading" : actualReact.useId(),
    useRef: ((initialValue: unknown) => {
      if (!modalHookState.isEnabled) return actualReact.useRef(initialValue);
      const referenceIndex = modalHookState.referenceCursor++;
      modalHookState.references[referenceIndex] ??= { current: initialValue };
      return modalHookState.references[referenceIndex];
    }) as typeof actualReact.useRef,
    useEffect: ((effect, dependencies) => {
      if (!modalHookState.isEnabled) return actualReact.useEffect(effect, dependencies);
      modalHookState.effects.push(effect);
    }) as typeof actualReact.useEffect,
    useState: ((initialValue: unknown) => {
      if (!modalHookState.isEnabled) return actualReact.useState(initialValue);
      return [
        typeof initialValue === "function" ? initialValue() : initialValue,
        () => { throw new Error("This modal test only renders the initial child state."); },
      ];
    }) as typeof actualReact.useState,
  };
});

afterEach(() => {
  modalHookState.isEnabled = false;
  modalHookState.referenceCursor = 0;
  modalHookState.references = [];
  modalHookState.effects = [];
  vi.unstubAllGlobals();
});

describe("editor reference information dialogs", () => {
  it("registers the three source-reference information dialogs", () => {
    expect(editorModalIds).toContain("help-info");
    expect(editorModalIds).toContain("keyboard-shortcuts");
    expect(editorModalIds).toContain("whats-new");
    expect(editorModalIds).not.toContain("season-picker");
  });

  it("registers the menu panels used by the top navigation", () => {
    expect(editorModalIds).toContain("ambience-panel");
    expect(editorModalIds).toContain("farm-settings");
    expect(editorModalIds).not.toContain("map-options");
    expect(editorModalIds).toContain("feedback");
    expect(editorModalIds).toContain("map-picker");
    expect(editorModalIds).toContain("save-panel");
  });

  it("renders local-only help without feedback or support actions", () => {
    const helpDialogMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "help-info",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );

    expect(helpDialogMarkup).toContain("Help &amp; Info");
    expect(helpDialogMarkup).toContain("Click Cycling");
    expect(helpDialogMarkup).toContain("X-ray");
    expect(helpDialogMarkup).not.toContain("Feedback");
    expect(helpDialogMarkup).not.toContain("Support");
  });

  it("documents Q as rotating or cycling the selected or placed item variant", () => {
    const keyboardShortcutsMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "keyboard-shortcuts",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );

    expect(keyboardShortcutsMarkup).toContain(
      "<dt><kbd>Q</kbd></dt><dd>Rotate or cycle variant on selected/placed item</dd>",
    );
    expect(keyboardShortcutsMarkup).toContain(
      "<dt><kbd>Ctrl / ⌘</kbd></dt><dd>X-ray: hold to see behind overlapping sprites</dd>",
    );
  });
});

describe("farm settings and map selection integration", () => {
  it.each([
    { locale: "en" as const, title: "Farm Settings", mapTitle: "Choose map", spouseHeading: "Spouse", caveHeading: "Cave" },
    { locale: "zh" as const, title: "农场设置", mapTitle: "选择地图", spouseHeading: "配偶", caveHeading: "洞穴" },
  ])("keeps the $locale farm settings and map selection dialogs separate", ({ locale, title, mapTitle, spouseHeading, caveHeading }) => {
    const properties = {
      copy: getEditorModalCopy(locale === "zh" ? "zh-CN" : "en"),
      locale,
      onClose: () => undefined,
      onMapChange: () => undefined,
      onPanelPositionChange: () => undefined,
      panelPosition: "bottom" as const,
      selectedMapId: "standard",
    };
    const farmSettingsMarkup = renderToStaticMarkup(
      createElement(EditorModal, { ...properties, modalId: "farm-settings" }),
    );
    const mapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, { ...properties, modalId: "map-picker" }),
    );

    expect(farmSettingsMarkup).toMatch(new RegExp(`<h2[^>]*>${title}</h2>`));
    expect(farmSettingsMarkup).toContain(`<h3>${spouseHeading}</h3>`);
    expect(farmSettingsMarkup).toContain(`<h3>${caveHeading}</h3>`);
    expect(farmSettingsMarkup).not.toContain('data-editor-map-id=');
    expect(farmSettingsMarkup).not.toContain('aria-label="Map categories"');
    expect(mapPickerMarkup).toMatch(new RegExp(`<h2[^>]*>${mapTitle}</h2>`));
    expect(mapPickerMarkup).toContain('data-editor-map-id="standard"');
    expect(mapPickerMarkup).not.toMatch(/<h3>Spouse<\/h3>|<h3>Cave<\/h3>|<h3>配偶<\/h3>|<h3>洞穴<\/h3>/);
  });

  it.each([
    { locale: "en" as const, caveLabel: "Bats" },
    { locale: "zh" as const, caveLabel: "蝙蝠" },
  ])("updates spouse and cave through the existing $locale modal state callback", ({ locale, caveLabel }) => {
    const initialMapRenderOptions = createInitialMapRenderOptions();
    let mapRenderOptions = initialMapRenderOptions;
    const onMapRenderOptionsChange = vi.fn((nextOptions: MapRenderOptions) => {
      mapRenderOptions = nextOptions;
    });
    const renderFarmControls = () => {
      const modalTree = renderEditorModalTree({
        copy: getEditorModalCopy(locale === "zh" ? "zh-CN" : "en"),
        locale,
        modalId: "farm-settings",
        mapRenderOptions,
        onClose: () => undefined,
        onMapChange: () => undefined,
        onMapRenderOptionsChange,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      });
      const farmPanel = requireModalElement(modalTree, FarmSettingsPanel);
      expect(farmPanel.props.onMapRenderOptionsChange).toBe(onMapRenderOptionsChange);
      return expandPanelComponents(FarmSettingsPanel(farmPanel.props as Parameters<typeof FarmSettingsPanel>[0]));
    };
    const spouseButton = requireModalElement(renderFarmControls(), "button",
      (element) => element.props.children === "Abigail");
    activateModalControl(spouseButton);
    expect(onMapRenderOptionsChange).toHaveBeenCalledTimes(1);
    expect(mapRenderOptions.farm).toMatchObject({ spouseId: "Abigail", caveChoice: "none" });
    const selectedSpouseButton = requireModalElement(renderFarmControls(), "button",
      (element) => element.props.children === "Abigail");
    expect(selectedSpouseButton.props["aria-pressed"]).toBe(true);

    const caveButton = requireModalElement(renderFarmControls(), "button",
      (element) => element.props.children === caveLabel);
    activateModalControl(caveButton);
    expect(onMapRenderOptionsChange).toHaveBeenCalledTimes(2);
    expect(mapRenderOptions.farm).toEqual({ spouseId: "Abigail", caveChoice: "bats" });
    expect(mapRenderOptions.farmhouse2).toEqual(initialMapRenderOptions.farmhouse2);
    expect(mapRenderOptions.gingerIslandOverlayIds).toEqual(initialMapRenderOptions.gingerIslandOverlayIds);
    expect(requireModalElement(renderFarmControls(), "button",
      (element) => element.props.children === caveLabel).props["aria-pressed"]).toBe(true);
  });

  it("preserves the project map content, configuration, and fallback selection callback", () => {
    const onMapChange = vi.fn();
    const onMapRenderOptionsChange = vi.fn();
    const mapRenderOptions = createInitialMapRenderOptions();
    const onProjectMapSave = vi.fn();
    const projectMapPanelContent = createElement("button", {
      onClick: onProjectMapSave,
      type: "button",
    }, "Save project map");
    const properties = {
      copy: getEditorModalCopy("en"),
      modalId: "map-picker" as const,
      onClose: () => undefined,
      onMapChange,
      onMapRenderOptionsChange,
      onPanelPositionChange: () => undefined,
      panelPosition: "bottom" as const,
      selectedMapId: "ginger-island",
      mapRenderOptions,
    };
    const projectMapModal = renderEditorModalTree({ ...properties, projectMapPanelContent });
    const projectSaveButton = requireModalElement(projectMapModal, "button",
      (element) => element.props.children === "Save project map");
    expect(projectSaveButton).toBe(projectMapPanelContent);
    activateModalControl(projectSaveButton);
    expect(onProjectMapSave).toHaveBeenCalledOnce();
    expect(getModalElements(projectMapModal).some((element) => element.type === PlannerMapPicker)).toBe(false);
    const mapConfiguration = requireModalElement(projectMapModal, MapConfigurationPanel);
    expect(mapConfiguration.props).toMatchObject({
      selectedMapId: "ginger-island", mapRenderOptions, onMapRenderOptionsChange,
    });
    expect(getModalElements(projectMapModal).some((element) => element.type === FarmSettingsPanel)).toBe(false);

    const fallbackMapModal = renderEditorModalTree(properties);
    const mapPicker = requireModalElement(fallbackMapModal, PlannerMapPicker);
    const pickerTree = capturePlannerMapPickerTree(
      mapPicker.props as Parameters<typeof PlannerMapPicker>[0],
    );
    const currentMapButton = requireModalElement(pickerTree, "button",
      (element) => element.props["data-editor-map-id"] === "ginger-island");
    activateModalControl(currentMapButton);
    expect(onMapChange).toHaveBeenCalledExactlyOnceWith("ginger-island");

    const farmSettingsModal = renderEditorModalTree({ ...properties, modalId: "farm-settings", projectMapPanelContent });
    expect(getModalElements(farmSettingsModal)).not.toContain(projectMapPanelContent);
    expect(getModalElements(farmSettingsModal).some((element) => element.type === MapConfigurationPanel)).toBe(false);
  });
});

describe("editor modal trigger focus and close behavior", () => {
  it.each([
    { triggerLabel: "Map", modalId: "map-picker" as const },
    { triggerLabel: "Current map: Standard Farm", modalId: "map-picker" as const },
    { triggerLabel: "Farm Settings", modalId: "farm-settings" as const },
  ])("returns focus to $triggerLabel after Escape closes its dialog", ({ triggerLabel, modalId }) => {
    const ownerDocument = { activeElement: null as FocusElement | null };
    class FocusElement {
      isConnected = true;
      constructor(readonly label: string) {}
      hasAttribute(): boolean { return false; }
      closest(): null { return null; }
      focus = vi.fn(() => { ownerDocument.activeElement = this; });
    }
    vi.stubGlobal("HTMLElement", FocusElement);
    const trigger = new FocusElement(triggerLabel);
    const closeControl = new FocusElement("Close dialog");
    ownerDocument.activeElement = trigger;
    const modalElement = {
      ownerDocument,
      closest: () => null,
      querySelectorAll: () => [closeControl],
      contains: (target: unknown) => target === closeControl,
    } as unknown as HTMLElement;
    const onClose = vi.fn();
    const properties = {
      copy: getEditorModalCopy("en"),
      modalId,
      onClose,
      onMapChange: () => undefined,
      onPanelPositionChange: () => undefined,
      panelPosition: "bottom" as const,
      selectedMapId: "standard",
    };
    const openModal = renderEditorModalTree(properties);
    const dialog = requireModalElement(openModal, "section",
      (element) => element.props.role === "dialog");
    (dialog.props.ref as { current: HTMLElement | null }).current = modalElement;
    for (const effect of modalHookState.effects) effect();
    expect(ownerDocument.activeElement).toBe(closeControl);
    expect(closeControl.focus).toHaveBeenCalledOnce();

    const keyboardEvent = {
      key: "Escape", target: closeControl,
      preventDefault: vi.fn(), stopPropagation: vi.fn(),
    };
    const onKeyDown = dialog.props.onKeyDown;
    if (typeof onKeyDown !== "function") throw new Error(`Dialog ${modalId} has no keyboard handler.`);
    onKeyDown(keyboardEvent);
    expect(onClose).toHaveBeenCalledOnce();
    expect(keyboardEvent.preventDefault).toHaveBeenCalledOnce();
    expect(keyboardEvent.stopPropagation).toHaveBeenCalledOnce();
    expect(renderEditorModalTree({ ...properties, modalId: null })).toBeNull();
    for (const effect of modalHookState.effects) effect();
    expect(trigger.focus).toHaveBeenCalledOnce();
    expect(ownerDocument.activeElement).toBe(trigger);
  });

  it.each([
    { triggerLabel: "Farm Settings", selector: '.editor-menu-bar__button[data-editor-modal-id="farm-settings"]' as const, optionLabel: "Abigail" },
    { triggerLabel: "Farm Settings", selector: '.editor-menu-bar__button[data-editor-modal-id="farm-settings"]' as const, optionLabel: "Bats" },
    { triggerLabel: "Menu", selector: ".editor-menu-bar__toggle" as const, optionLabel: "Bats" },
  ])("restores $triggerLabel after choosing $optionLabel remounts the farm dialog and its trigger", ({ triggerLabel, selector, optionLabel }) => {
    const ownerDocument = { activeElement: null as FocusElement | null };
    let currentTrigger: FocusElement;
    const editorRoot = {
      querySelector: (requestedSelector: string) => requestedSelector === selector ? currentTrigger : null,
    } as unknown as HTMLElement;
    class FocusElement {
      isConnected = true;
      constructor(readonly label: string) {}
      hasAttribute(): boolean { return false; }
      closest(): HTMLElement { return editorRoot; }
      getClientRects(): object[] { return [{}]; }
      focus = vi.fn(() => { ownerDocument.activeElement = this; });
    }
    vi.stubGlobal("HTMLElement", FocusElement);
    const originalTrigger = new FocusElement(triggerLabel);
    currentTrigger = originalTrigger;
    ownerDocument.activeElement = originalTrigger;
    rememberEditorMenuModalFocusTarget(originalTrigger as unknown as HTMLElement, "farm-settings", selector);
    const closeControl = new FocusElement("Close dialog");
    const modalElement = {
      ownerDocument,
      closest: () => editorRoot,
      querySelectorAll: () => [closeControl],
      contains: (target: unknown) => target === closeControl,
    } as unknown as HTMLElement;
    let mapRenderOptions = createInitialMapRenderOptions();
    const onMapRenderOptionsChange = vi.fn((nextOptions: MapRenderOptions) => { mapRenderOptions = nextOptions; });
    const properties = {
      copy: getEditorModalCopy("en"),
      modalId: "farm-settings" as const,
      onClose: () => undefined,
      onMapChange: () => undefined,
      onMapRenderOptionsChange,
      onPanelPositionChange: () => undefined,
      panelPosition: "bottom" as const,
      selectedMapId: "standard",
    };
    const openedModal = renderEditorModalTree({ ...properties, mapRenderOptions });
    const openedDialog = requireModalElement(openedModal, "section", (element) => element.props.role === "dialog");
    (openedDialog.props.ref as { current: HTMLElement | null }).current = modalElement;
    const unmountEffects = modalHookState.effects.map((effect) => effect());
    const farmPanel = requireModalElement(openedModal, FarmSettingsPanel);
    const farmControls = expandPanelComponents(FarmSettingsPanel(farmPanel.props as Parameters<typeof FarmSettingsPanel>[0]));
    activateModalControl(requireModalElement(farmControls, "button", (element) => element.props.children === optionLabel));
    expect(onMapRenderOptionsChange).toHaveBeenCalledOnce();

    originalTrigger.isConnected = false;
    for (const unmountEffect of unmountEffects) if (typeof unmountEffect === "function") unmountEffect();
    modalHookState.references = [];
    currentTrigger = new FocusElement(triggerLabel);
    ownerDocument.activeElement = new FocusElement("Body");
    const remountedModal = renderEditorModalTree({ ...properties, mapRenderOptions });
    const remountedDialog = requireModalElement(remountedModal, "section", (element) => element.props.role === "dialog");
    (remountedDialog.props.ref as { current: HTMLElement | null }).current = modalElement;
    for (const effect of modalHookState.effects) effect();
    expect(ownerDocument.activeElement).toBe(closeControl);
    expect(renderEditorModalTree({ ...properties, modalId: null })).toBeNull();
    for (const effect of modalHookState.effects) effect();

    expect(currentTrigger.focus).toHaveBeenCalledOnce();
    expect(originalTrigger.focus).not.toHaveBeenCalled();
    expect(ownerDocument.activeElement).toBe(currentTrigger);
    expect(readEditorMenuModalFocusTarget(modalElement, "farm-settings")).toBeNull();
  });
});

describe("editor modal localized View and Settings content", () => {
  it("renders localized View and Settings groups with pressed states and Save dialog copy", () => {
    const copy = getEditorModalCopy("zh-CN");
    const viewDisplayOptions = {
      ...createInitialEditorDisplayOptions(),
      showSprinklerRadius: true,
    };
    const viewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy,
        displayOptions: viewDisplayOptions,
        locale: "zh",
        modalId: "view-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "bus-stop",
      }),
    );
    const settingsMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy,
        locale: "zh",
        modalId: "settings-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const saveMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy,
        locale: "zh",
        modalId: "save-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        savePanelContent: createElement("p", null, "Save content"),
        selectedMapId: "standard",
      }),
    );
    const englishSaveMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "save-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        savePanelContent: createElement("p", null, "Save content"),
        selectedMapId: "standard",
      }),
    );

    expect(viewMarkup).toContain("视图");
    expect(viewMarkup).toContain("覆盖范围");
    expect(viewMarkup).toContain('<span class="editor-config-switch__label">洒水器</span>');
    expect(viewMarkup).toContain('<span class="editor-config-switch__label">资源巨块</span>');
    expect(viewMarkup).toContain('aria-pressed="false"');
    expect(viewMarkup).toContain('aria-pressed="true"');
    expect(viewMarkup).toContain(
      `class="editor-config-switch__state">${copy.stateLabel(false)}</span>`,
    );
    expect(viewMarkup).toContain(
      `class="editor-config-switch__state">${copy.stateLabel(true)}</span>`,
    );
    expect(viewMarkup).toMatch(
      /<button class="editor-config-switch" type="button" aria-pressed="true"[^>]*>.*?<span class="editor-config-switch__label">洒水器<\/span>.*?<span aria-hidden="true" class="editor-config-switch__state">开<\/span>/,
    );
    expect(viewMarkup).toContain("关闭对话框");
    expect(settingsMarkup).toContain("设置");
    expect(settingsMarkup).toContain("触屏");
    expect(settingsMarkup).toContain("显示摇杆");
    expect(settingsMarkup).toContain("左手模式");
    expect(settingsMarkup).toContain("自由放置");
    expect(settingsMarkup).toContain('title="禁用放置规则，可在地图任意位置放置物品"');
    expect(settingsMarkup).toContain('href="/zh/privacy"');
    expect(settingsMarkup).toContain('href="/zh/terms"');
    expect(saveMarkup).toMatch(/<h2[^>]*>本地项目<\/h2>/);
    expect(saveMarkup).toMatch(
      /<header class="editor-modal__header"><h2[^>]*>本地项目<\/h2><button aria-label="关闭对话框" type="button">×<\/button><\/header>/,
    );
    expect(englishSaveMarkup).toMatch(/<h2[^>]*>Library<\/h2>/);
    expect(englishSaveMarkup).toMatch(
      /<header class="editor-modal__header"><h2[^>]*>Library<\/h2><button aria-label="Close dialog" type="button">×<\/button><\/header>/,
    );
  });
});

describe("editor modal keyboard event containment", () => {
  it("handles a keyboard event from inside the outer modal", () => {
    const containedTarget = {} as EventTarget;
    const modalElement = createFakeModalElement(containedTarget);

    expect(
      shouldHandleEditorModalKeyboardEvent(modalElement, containedTarget),
    ).toBe(true);
  });

  it("ignores a keyboard event from portalled content", () => {
    const containedTarget = {} as EventTarget;
    const portalledTarget = {} as EventTarget;
    const modalElement = createFakeModalElement(containedTarget);

    expect(
      shouldHandleEditorModalKeyboardEvent(modalElement, portalledTarget),
    ).toBe(false);
  });

  it("rejects a keyboard event without a target", () => {
    const modalElement = createFakeModalElement({} as EventTarget);

    expect(() =>
      shouldHandleEditorModalKeyboardEvent(modalElement, null),
    ).toThrow(/event target.*null/i);
  });
});

describe("editor modal backdrop click handling", () => {
  it("calls onClose only when the click target is the backdrop itself", () => {
    const backdropTarget = {} as EventTarget;
    const dialogTarget = {} as EventTarget;
    const nestedTarget = {} as EventTarget;
    let closeCount = 0;
    const onClose = (): void => {
      closeCount += 1;
    };

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: backdropTarget,
      onClose,
    });
    expect(closeCount).toBe(1);

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: dialogTarget,
      onClose,
    });
    expect(closeCount).toBe(1);

    closeModalFromBackdropClick({
      currentTarget: backdropTarget,
      eventTarget: nestedTarget,
      onClose,
    });
    expect(closeCount).toBe(1);
  });
});

describe("editor modal visual variants", () => {
  it("adds only the approved content-specific modal modifiers", () => {
    const saveModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "save-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        savePanelContent: createElement("p", null, "Save content"),
        selectedMapId: "standard",
      }),
    );
    const mapPickerModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "map-picker",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const viewModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "view-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const settingsModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "settings-panel",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const ambienceModalMarkup = renderEditorModalMarkup("ambience-panel");
    const farmSettingsModalMarkup = renderEditorModalMarkup("farm-settings");
    const feedbackModalMarkup = renderEditorModalMarkup("feedback");
    const helpModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "help-info",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const keyboardModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "keyboard-shortcuts",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );
    const whatsNewModalMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "whats-new",
        onClose: () => undefined,
        onMapChange: () => undefined,
        onPanelPositionChange: () => undefined,
        panelPosition: "bottom",
        selectedMapId: "standard",
      }),
    );

    expect(saveModalMarkup).toContain(
      'class="editor-modal editor-modal--save-panel"',
    );
    expect(mapPickerModalMarkup).toContain(
      'class="editor-modal editor-modal--map-picker"',
    );
    expect(viewModalMarkup).toContain(
      'class="editor-modal editor-modal--view-panel editor-modal--popover"',
    );
    expect(settingsModalMarkup).toContain(
      'class="editor-modal editor-modal--settings-panel editor-modal--popover"',
    );
    expect(ambienceModalMarkup).toContain(
      'class="editor-modal editor-modal--ambience-panel editor-modal--popover"',
    );
    expect(farmSettingsModalMarkup).toContain(
      'class="editor-modal editor-modal--farm-settings editor-modal--popover"',
    );
    expect(feedbackModalMarkup).toContain(
      'class="editor-modal editor-modal--feedback"',
    );
    expect(helpModalMarkup).toContain(
      'class="editor-modal editor-modal--help-info"',
    );
    expect(keyboardModalMarkup).toContain(
      'class="editor-modal editor-modal--shortcuts"',
    );
    expect(whatsNewModalMarkup).toContain('class="editor-modal"');
    expect(whatsNewModalMarkup).not.toContain("editor-modal--whats-new");
  });

  it("fixes full-screen modal backdrops and keeps menu popovers anchored to the editor", () => {
    const viewportFixedModalIds = [
      "save-panel",
      "view-panel",
      "settings-panel",
      "help-info",
      "feedback",
      "keyboard-shortcuts",
      "map-picker",
    ] as const satisfies readonly EditorModalId[];
    const editorShellPositionedModalIds = [
      "ambience-panel",
      "farm-settings",
      "whats-new",
    ] as const satisfies readonly EditorModalId[];

    for (const modalId of viewportFixedModalIds) {
      expect(renderEditorModalMarkup(modalId)).toContain(
        'class="editor-modal__backdrop editor-modal__backdrop--viewport-fixed"',
      );
    }

    for (const modalId of editorShellPositionedModalIds) {
      const modalMarkup = renderEditorModalMarkup(modalId);

      expect(modalMarkup).toContain('class="editor-modal__backdrop"');
      expect(modalMarkup).not.toContain(
        "editor-modal__backdrop--viewport-fixed",
      );
    }
  });
});

type ModalElement = ReactElement<Record<string, unknown>>;

function renderEditorModalTree(properties: Parameters<typeof EditorModal>[0]): ReturnType<typeof EditorModal> {
  modalHookState.isEnabled = true;
  modalHookState.referenceCursor = 0;
  modalHookState.effects = [];
  return EditorModal(properties);
}

function capturePlannerMapPickerTree(
  pickerProperties: Parameters<typeof PlannerMapPicker>[0],
): ReactNode {
  const wasModalHookMockEnabled = modalHookState.isEnabled;
  modalHookState.isEnabled = false;
  let renderedPicker: ReactNode = null;
  let didRender = false;

  function CapturePlannerMapPicker(): ReactNode {
    didRender = true;
    renderedPicker = PlannerMapPicker(pickerProperties);
    return renderedPicker;
  }

  try {
    renderToStaticMarkup(createElement(CapturePlannerMapPicker));
  } finally {
    modalHookState.isEnabled = wasModalHookMockEnabled;
  }
  if (!didRender) {
    throw new Error("React did not render PlannerMapPicker.");
  }
  return renderedPicker;
}

function getModalElements(modalNode: ReactNode): ModalElement[] {
  if (Array.isArray(modalNode)) return modalNode.flatMap(getModalElements);
  if (!isValidElement(modalNode)) return [];
  const modalElement = modalNode as ModalElement;
  return [modalElement, ...getModalElements(modalElement.props.children as ReactNode)];
}

function expandPanelComponents(panelNode: ReactNode): ReactNode {
  if (Array.isArray(panelNode)) return panelNode.map(expandPanelComponents);
  if (!isValidElement(panelNode)) return panelNode;
  const panelElement = panelNode as ModalElement;
  if (typeof panelElement.type === "function") {
    const component = panelElement.type as unknown as (properties: Record<string, unknown>) => ReactNode;
    return expandPanelComponents(component(panelElement.props));
  }
  return cloneElement(panelElement, {
    children: expandPanelComponents(panelElement.props.children as ReactNode),
  });
}

function requireModalElement(
  modalNode: ReactNode,
  elementType: ModalElement["type"],
  matches: (element: ModalElement) => boolean = () => true,
): ModalElement {
  const element = getModalElements(modalNode).find((candidate) => candidate.type === elementType && matches(candidate));
  if (!element) throw new Error(`Modal element ${String(elementType)} is missing.`);
  return element;
}

function activateModalControl(element: ModalElement): void {
  const onClick = element.props.onClick;
  if (typeof onClick !== "function") throw new Error(`Modal control ${String(element.type)} has no click handler.`);
  onClick();
}

function renderEditorModalMarkup(modalId: EditorModalId): string {
  return renderToStaticMarkup(
    createElement(EditorModal, {
      copy: getEditorModalCopy("en"),
      modalId,
      onClose: () => undefined,
      onMapChange: () => undefined,
      onPanelPositionChange: () => undefined,
      panelPosition: "bottom",
      selectedMapId: "standard",
    }),
  );
}

function createFakeModalElement(
  containedTarget: EventTarget,
): Pick<HTMLElement, "contains"> {
  return {
    contains(candidate: Node | null): boolean {
      return (candidate as EventTarget | null) === containedTarget;
    },
  };
}
