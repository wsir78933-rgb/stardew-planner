import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EditorMenuBar } from "../../src/components/editor-menu-bar";
import {
  EditorModal,
  getModalFocusTarget,
} from "../../src/components/editor-modal";
import { getEditorModalCopy } from "../../src/i18n/editor-modal-copy";
import { createInitialEditorDisplayOptions } from "../../src/editor/editor-display-options";
import { createInitialPlannerAmbienceOptions } from "../../src/editor/planner-ambience-options";
import { EditorToolbar } from "../../src/components/editor-toolbar";
import { SelectionInspector } from "../../src/components/selection-inspector";
import {
  ItemCatalogPanel,
  getNextCatalogCategory,
} from "../../src/components/item-catalog-panel";
import { editorCatalogCategories } from "../../src/editor/editor-view-state";

const freePlacementWarningState = vi.hoisted(() => ({ isVisible: false }));

vi.mock("react", async (importOriginal) => {
  const actualReact = await importOriginal<typeof import("react")>();

  return {
    ...actualReact,
    useState: ((initialState: unknown) => {
      if (freePlacementWarningState.isVisible) {
        return [true, () => undefined];
      }

      return actualReact.useState(initialState);
    }) as typeof actualReact.useState,
  };
});

function ignoreEditorAction(): void {}

describe("editor shell", () => {
  it("renders every editing tool, the wheel-zoom toggle, and history actions", () => {
    const toolbarMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        tool: "cursor",
        onToolChange: ignoreEditorAction,
        onUndo: ignoreEditorAction,
        onRedo: ignoreEditorAction,
        onWheelZoomToggle: ignoreEditorAction,
        canUndo: false,
        canRedo: false,
        wheelZoomEnabled: false,
      }),
    );

    expect(toolbarMarkup.match(/<button/g)).toHaveLength(7);
    expect(toolbarMarkup).toContain('aria-label="Select"');
    expect(toolbarMarkup).toContain('aria-label="Multi"');
    expect(toolbarMarkup).toContain('aria-label="Fill"');
    expect(toolbarMarkup).toContain('aria-label="Erase"');
    expect(toolbarMarkup).toContain('aria-label="Zoom"');
    expect(toolbarMarkup).toContain('data-wheel-zoom-toggle=""');
    expect(toolbarMarkup).toContain('aria-label="Zoom" aria-pressed="false"');
    expect(toolbarMarkup).toContain('aria-pressed="true"');
    expect(toolbarMarkup).not.toMatch(/aria-label="Erase"[^>]*disabled=""/);
    expect(toolbarMarkup).toMatch(/aria-label="Undo"[^>]*disabled=""/);
    expect(toolbarMarkup).toMatch(/aria-label="Redo"[^>]*disabled=""/);
  });

  it("renders a single-entity inspector with independent rotate, copy, and delete actions", () => {
    const inspectorMarkup = renderToStaticMarkup(
      createElement(SelectionInspector, {
        kind: "single",
        onCopy: ignoreEditorAction,
        onDelete: ignoreEditorAction,
        onDismiss: ignoreEditorAction,
        onNightLightStateChange: ignoreEditorAction,
        onCycleAppearance: ignoreEditorAction,
        onTintChange: ignoreEditorAction,
        selection: {
          canCycleAppearance: true,
          entityName: "Sprinkler",
          isNightLight: false,
          kind: "item",
          nightLightState: undefined,
          tintColor: "#ffffff",
        },
      }),
    );

    expect(inspectorMarkup).toContain("Sprinkler");
    expect(inspectorMarkup).toContain('aria-label="Dismiss selection"');
    expect(inspectorMarkup).toContain(
      'aria-label="Cycle selected item appearance"',
    );
    expect(inspectorMarkup).toContain('aria-label="Copy selected placement"');
    expect(inspectorMarkup).toContain('aria-label="Delete selected placement"');
  });

  it("renders the unified header actions without account or cloud controls", () => {
    const menuMarkup = renderToStaticMarkup(
      createElement(EditorMenuBar, {
        activeModalId: null,
        mapDisplayName: "Standard Farm",
        onCycleSeason: ignoreEditorAction,
        season: "spring",
        onOpenModal: ignoreEditorAction,
      }),
    );
    expect(menuMarkup.match(/<button/g)).toHaveLength(11);
    expect(menuMarkup).toContain('class="menu-bar editor-menu-bar"');
    expect(menuMarkup).toContain('aria-label="Menu"');
    expect(menuMarkup).toContain("editor-menu-bar__controls");
    expect(menuMarkup).not.toContain('editor-menu-actions');
    expect(menuMarkup).toContain('aria-label="Help"');
    expect(menuMarkup).toContain('aria-label="Keyboard shortcuts"');
    expect(menuMarkup).toContain('aria-label="Feedback"');
    expect(menuMarkup).toContain('aria-label="Library"');
    expect(menuMarkup).toContain('aria-label="Current map: Standard Farm"');
    expect(menuMarkup).toContain('data-editor-modal-id="ambience-panel"');
    expect(menuMarkup).toContain('data-editor-modal-id="farm-settings"');
    expect(menuMarkup).toContain('data-editor-modal-id="map-picker"');
    expect(menuMarkup).toContain('data-editor-modal-id="feedback"');
    expect(menuMarkup).toContain('aria-label="Farm Settings"');
    expect(menuMarkup.match(/data-editor-modal-id="map-picker"/g)).toHaveLength(2);
    expect(menuMarkup).toContain('aria-label="View"');
    expect(menuMarkup).toContain('aria-label="Settings"');
    expect(menuMarkup).not.toMatch(
      /support|login|member|premium|sync|share|mods|cloud/i,
    );
  });

  it("renders the shared categorized map picker with the selected Farm tab", () => {
    const mapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "map-picker",
        selectedMapId: "standard",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(mapPickerMarkup).toContain('aria-label="Map categories"');
    expect(mapPickerMarkup.match(/role="tab"/g)).toHaveLength(4);
    expect(mapPickerMarkup.match(/role="tabpanel"/g)).toHaveLength(1);
    expect(mapPickerMarkup.match(/data-editor-map-id=/g)).toHaveLength(9);
    expect(mapPickerMarkup).toMatch(/aria-selected="true"[^>]*>Farm</);
    expect(mapPickerMarkup).toContain(
      'src="/game-assets/1.6.15/maps/previews/Farm.png"',
    );
    expect(mapPickerMarkup).not.toContain('data-editor-map-id="farmhouse-2"');
    expect(mapPickerMarkup).toContain('role="dialog"');
    expect(mapPickerMarkup).toContain('tabindex="-1"');
  });

  it("opens Winery in its Community/Interiors category with the current card selected", () => {
    const mapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "map-picker",
        selectedMapId: "sve-winery",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );
    const wineryButtonMarkup = getButtonMarkupWithAttribute(
      mapPickerMarkup,
      'data-editor-map-id="sve-winery"',
    );

    expect(mapPickerMarkup.match(/data-editor-map-id=/g)).toHaveLength(3);
    expect(mapPickerMarkup).toMatch(
      /aria-labelledby="([^"]+)-tab-community \1-community-tab-interiors"/,
    );
    expect(wineryButtonMarkup).toContain('aria-pressed="true"');
    expect(wineryButtonMarkup).toContain("Winery (SVE)");
  });

  it("renders the source-faithful Ginger Island and Farmhouse 2 map configuration controls", () => {
    const gingerIslandMapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "map-picker",
        selectedMapId: "ginger-island",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );
    const farmhouseMapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "map-picker",
        selectedMapId: "farmhouse-2",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(gingerIslandMapPickerMarkup).toContain("Ginger Island");
    expect(gingerIslandMapPickerMarkup).toContain("Restored");
    expect(gingerIslandMapPickerMarkup).toContain("Obelisk");
    expect(farmhouseMapPickerMarkup).toContain("Farmhouse (Upgrade 2)");
    expect(farmhouseMapPickerMarkup).toContain("Married layout");
    expect(farmhouseMapPickerMarkup).toContain("Spouse room");
    expect(farmhouseMapPickerMarkup).toContain("Open Bedroom");
  });

  it("renders the supplied local project controls for Save instead of a placeholder", () => {
    const savePanelMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "save-panel",
        selectedMapId: "standard",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
        savePanelContent: createElement("p", null, "Save to this device"),
      }),
    );

    expect(savePanelMarkup).toContain("Save to this device");
    expect(savePanelMarkup).not.toContain(
      "This local feature will be enabled in the next editor step.",
    );
  });

  it("shows NPC paths disabled on unsupported maps and enabled on Bus Stop", () => {
    const standardViewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "view-panel",
        selectedMapId: "standard",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );
    const busStopViewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "view-panel",
        selectedMapId: "bus-stop",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(standardViewMarkup).toMatch(
      /aria-pressed="false" disabled="" title="NPC paths are unavailable on this map"><span class="editor-config-switch__label">NPC paths<\/span>/,
    );
    expect(busStopViewMarkup).toMatch(
      /aria-pressed="false" title="Show tiles NPCs walk through"><span class="editor-config-switch__label">NPC paths<\/span>/,
    );
    expect(busStopViewMarkup).not.toContain('disabled="" title="NPC paths are unavailable on this map"');
  });

  it("groups View controls clearly while preserving pressed and disabled semantics", () => {
    const viewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "view-panel",
        selectedMapId: "standard",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(viewMarkup).toContain("Ranges");
    expect(viewMarkup).toContain("Sprinkler");
    expect(viewMarkup).toContain("Scarecrow");
    expect(viewMarkup).toContain("Bee house");
    expect(viewMarkup).toContain("Junimo hut");
    expect(viewMarkup).toContain("Guides");
    expect(viewMarkup).toContain("Grid");
    expect(viewMarkup).toContain("Resource clumps");
    expect(viewMarkup).toContain("Blocked tiles");
    expect(viewMarkup).toContain("Buildings");
    expect(viewMarkup).toContain("Catalog position");
    expect(viewMarkup).not.toContain("Night mode");
    expect(viewMarkup).not.toContain("Weather");
    expect(viewMarkup.match(/<h3>Display<\/h3>/g)).toBeNull();
    expect(viewMarkup).not.toMatch(/<button[^>]*>Resource Clumps<\/button>/);
    expect(viewMarkup.match(/aria-pressed=/g)).toHaveLength(12);
  });

  it("renders local Settings with grouped toggles and legal links", () => {
    const settingsMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "settings-panel",
        selectedMapId: "standard",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(settingsMarkup).toContain("Interface");
    expect(settingsMarkup).toContain("Cursor");
    expect(settingsMarkup).toContain("System");
    expect(settingsMarkup).toContain("Game");
    expect(settingsMarkup).toContain("Toast notifications");
    expect(settingsMarkup).toContain("Free Placement");
    expect(settingsMarkup).toContain("Touch controls");
    expect(settingsMarkup).toContain("Show joystick");
    expect(settingsMarkup).toContain("Left-hand mode");
    expect(settingsMarkup).not.toContain("Manage Mods");
    expect(settingsMarkup.match(/aria-pressed=/g)).toHaveLength(6);
    expect(settingsMarkup).toContain('class="editor-config-legal"');
    expect(settingsMarkup).toContain(
      '<a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>',
    );
    expect(settingsMarkup).toContain(
      '<a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a>',
    );
    expect(settingsMarkup).not.toMatch(/sign in|account|member|premium|sync|share|feedback/i);
  });

  it("renders Night mode and weather selection inside Ambience", () => {
    const ambienceMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        copy: getEditorModalCopy("en"),
        modalId: "ambience-panel",
        selectedMapId: "standard",
        panelPosition: "bottom",
        season: "summer",
        ambienceOptions: createInitialPlannerAmbienceOptions(),
        displayOptions: {
          ...createInitialEditorDisplayOptions(),
          showNightMode: true,
        },
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
        onAmbienceChange: ignoreEditorAction,
        onDisplayOptionToggle: ignoreEditorAction,
      }),
    );

    expect(ambienceMarkup).toContain("Season");
    expect(ambienceMarkup).toContain("Summer");
    expect(ambienceMarkup).toMatch(/aria-label="Summer" aria-pressed="true"/);
    expect(ambienceMarkup).toContain("Night mode");
    expect(ambienceMarkup).toContain("Atmosphere");
    expect(ambienceMarkup).toContain("Summer clouds");
    expect(ambienceMarkup).toContain("Butterflies &amp; debris");
    expect(ambienceMarkup).toContain("Animations");
    expect(ambienceMarkup).toContain("Weather");
    expect(ambienceMarkup).toMatch(/aria-pressed="true">Clear<\/button>/);
  });

  it("renders the localized Free Placement warning actions", () => {
    freePlacementWarningState.isVisible = true;

    try {
      const settingsMarkup = renderToStaticMarkup(
        createElement(EditorModal, {
          copy: getEditorModalCopy("zh-CN"),
          modalId: "settings-panel",
          selectedMapId: "standard",
          panelPosition: "bottom",
          onClose: ignoreEditorAction,
          onMapChange: ignoreEditorAction,
          onPanelPositionChange: ignoreEditorAction,
        }),
      );

      expect(settingsMarkup).toContain("自由放置会禁用地图放置规则，部分布局可能无法在游戏中实现。");
      expect(settingsMarkup).toContain("取消");
      expect(settingsMarkup).toContain("启用自由放置");
    } finally {
      freePlacementWarningState.isVisible = false;
    }
  });

  it("renders all eight catalog categories and a search field", () => {
    const catalogMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "buildings",
        panelPosition: "bottom",
        searchQuery: "",
        selectedCatalogItemId: null,
        onCatalogItemSelect: ignoreEditorAction,
        onCategoryChange: ignoreEditorAction,
        onSearchQueryChange: ignoreEditorAction,
      }),
    );

    expect(catalogMarkup).toContain("Buildings");
    expect(catalogMarkup).toContain("Crops");
    expect(catalogMarkup).toContain("Trees");
    expect(catalogMarkup).toContain("Equipment");
    expect(catalogMarkup).toContain("Fences &amp; Paths");
    expect(catalogMarkup).toContain("Lighting");
    expect(catalogMarkup).toContain("Furniture");
    expect(catalogMarkup).toContain("Decor");
    expect(catalogMarkup.match(/role="tab"/g)).toHaveLength(8);
    expect(catalogMarkup).toContain('type="search"');
  });

  it("connects every catalog tab to its active tabpanel", () => {
    const catalogMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "crops",
        panelPosition: "bottom",
        searchQuery: "",
        selectedCatalogItemId: null,
        onCatalogItemSelect: ignoreEditorAction,
        onCategoryChange: ignoreEditorAction,
        onSearchQueryChange: ignoreEditorAction,
      }),
    );

    const catalogPanelMarkup = catalogMarkup.match(
      /<div[^>]*role="tabpanel"[^>]*>/,
    )?.[0];
    const catalogPanelLabelledBy = getMarkupAttribute(
      catalogPanelMarkup,
      "aria-labelledby",
    );
    const catalogPanelId = getMarkupAttribute(catalogPanelMarkup, "id");

    expect(catalogPanelId).not.toBeNull();
    expect(catalogPanelLabelledBy).toMatch(/-tab-crops$/);
    expect(catalogMarkup).toContain(`aria-controls="${catalogPanelId}"`);
    expect(catalogMarkup).toContain(`id="${catalogPanelLabelledBy}"`);
    expect(catalogMarkup).toContain('aria-selected="true"');
    expect(catalogMarkup).toContain('tabindex="0"');
  });

  it("moves through all eight catalog tabs with arrow, home, and end keys", () => {
    expect(editorCatalogCategories).toEqual([
      "buildings",
      "crops",
      "trees",
      "equipment",
      "paths",
      "lighting",
      "furniture",
      "decor",
    ]);

    const expectedArrowTargets = {
      buildings: {
        ArrowLeft: "equipment",
        ArrowRight: "crops",
        ArrowUp: "paths",
        ArrowDown: "paths",
      },
      crops: {
        ArrowLeft: "buildings",
        ArrowRight: "trees",
        ArrowUp: "lighting",
        ArrowDown: "lighting",
      },
      trees: {
        ArrowLeft: "crops",
        ArrowRight: "equipment",
        ArrowUp: "furniture",
        ArrowDown: "furniture",
      },
      equipment: {
        ArrowLeft: "trees",
        ArrowRight: "buildings",
        ArrowUp: "decor",
        ArrowDown: "decor",
      },
      paths: {
        ArrowLeft: "decor",
        ArrowRight: "lighting",
        ArrowUp: "buildings",
        ArrowDown: "buildings",
      },
      lighting: {
        ArrowLeft: "paths",
        ArrowRight: "furniture",
        ArrowUp: "crops",
        ArrowDown: "crops",
      },
      furniture: {
        ArrowLeft: "lighting",
        ArrowRight: "decor",
        ArrowUp: "trees",
        ArrowDown: "trees",
      },
      decor: {
        ArrowLeft: "furniture",
        ArrowRight: "paths",
        ArrowUp: "equipment",
        ArrowDown: "equipment",
      },
    } as const;

    for (const category of editorCatalogCategories) {
      for (const keyboardKey of [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ] as const) {
        expect(getNextCatalogCategory(category, keyboardKey)).toBe(
          expectedArrowTargets[category][keyboardKey],
        );
      }
    }

    expect(getNextCatalogCategory("paths", "Home")).toBe("buildings");
    expect(getNextCatalogCategory("crops", "End")).toBe("decor");
    expect(getNextCatalogCategory("crops", "Enter")).toBeNull();
  });

  it("chooses the correct target when a modal tab key reaches either boundary", () => {
    const firstControl = createFocusableElement("first");
    const finalControl = createFocusableElement("final");
    const modalElement = createModalElement([firstControl, finalControl]);

    expect(
      getModalFocusTarget({
        activeElement: finalControl,
        modalElement,
        shiftKey: false,
      }),
    ).toBe(firstControl);
    expect(
      getModalFocusTarget({
        activeElement: firstControl,
        modalElement,
        shiftKey: true,
      }),
    ).toBe(finalControl);
  });

  it("uses the dialog itself when a modal has no focusable controls", () => {
    const modalElement = createModalElement([]);

    expect(
      getModalFocusTarget({
        activeElement: modalElement,
        modalElement,
        shiftKey: false,
      }),
    ).toBe(modalElement);
  });
});

function createFocusableElement(identifier: string): HTMLElement {
  return {
    id: identifier,
    hasAttribute: () => false,
  } as unknown as HTMLElement;
}

function createModalElement(
  focusableElements: readonly HTMLElement[],
): HTMLElement {
  return {
    querySelectorAll: () => focusableElements,
  } as unknown as HTMLElement;
}

function getMarkupAttribute(
  markup: string | undefined,
  attributeName: string,
): string | null {
  if (markup === undefined) {
    return null;
  }

  return markup.match(new RegExp(`${attributeName}="([^"]+)"`))?.[1] ?? null;
}

function getButtonMarkupWithAttribute(
  containerMarkup: string,
  requiredAttribute: string,
): string {
  const attributePosition = containerMarkup.indexOf(requiredAttribute);
  const buttonStartPosition = containerMarkup.lastIndexOf(
    "<button",
    attributePosition,
  );
  const buttonEndPosition = containerMarkup.indexOf(
    "</button>",
    attributePosition,
  );

  if (
    attributePosition === -1 ||
    buttonStartPosition === -1 ||
    buttonEndPosition === -1
  ) {
    throw new Error(`Expected a button with attribute ${requiredAttribute}.`);
  }

  return containerMarkup.slice(buttonStartPosition, buttonEndPosition + 9);
}
