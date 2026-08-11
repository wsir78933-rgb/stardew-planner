import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EditorMenuBar } from "../../src/components/editor-menu-bar";
import {
  EditorModal,
  getModalFocusTarget,
} from "../../src/components/editor-modal";
import { EditorToolbar } from "../../src/components/editor-toolbar";
import { SelectionInspector } from "../../src/components/selection-inspector";
import {
  ItemCatalogPanel,
  getNextCatalogCategory,
} from "../../src/components/item-catalog-panel";

function ignoreEditorAction(): void {}

describe("editor shell", () => {
  it("renders every original editing tool, including Fill", () => {
    const toolbarMarkup = renderToStaticMarkup(
      createElement(EditorToolbar, {
        tool: "cursor",
        onToolChange: ignoreEditorAction,
        onUndo: ignoreEditorAction,
        onRedo: ignoreEditorAction,
        canUndo: false,
        canRedo: false,
      }),
    );

    expect(toolbarMarkup.match(/<button/g)).toHaveLength(7);
    expect(toolbarMarkup).toContain('aria-label="Cursor tool"');
    expect(toolbarMarkup).toContain('aria-label="Multi-select tool"');
    expect(toolbarMarkup).toContain('aria-label="Fill tool"');
    expect(toolbarMarkup).toContain('aria-label="Erase tool"');
    expect(toolbarMarkup).toContain('aria-pressed="true"');
    expect(toolbarMarkup).not.toMatch(/aria-label="Erase tool"[^>]*disabled=""/);
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

  it("renders the original direct-action icon bar without a custom menu layer", () => {
    const menuMarkup = renderToStaticMarkup(
      createElement(EditorMenuBar, {
        activeModalId: null,
        mapDisplayName: "Standard Farm",
        onCycleSeason: ignoreEditorAction,
        season: "spring",
        onOpenModal: ignoreEditorAction,
      }),
    );
    expect(menuMarkup.match(/<button/g)).toHaveLength(6);
    expect(menuMarkup).toContain('class="menu-bar editor-menu-bar"');
    expect(menuMarkup).toContain('aria-label="Menu"');
    expect(menuMarkup).toContain("editor-menu-bar__controls");
    expect(menuMarkup).not.toContain('editor-menu-actions');
    expect(menuMarkup).toContain('aria-label="Season: spring"');
    const seasonButtonMarkup = menuMarkup.match(
      /<button(?=[^>]*aria-label="Season: spring")[^>]*>/,
    )?.[0];
    if (seasonButtonMarkup === undefined) {
      throw new Error("Expected the season menu button to be rendered.");
    }
    expect(seasonButtonMarkup).not.toContain('aria-haspopup="dialog"');
    expect(seasonButtonMarkup).not.toContain("aria-expanded=");
    expect(menuMarkup).toContain(
      'aria-label="Map: Standard Farm"',
    );
    expect(menuMarkup).toContain('aria-label="View"');
    expect(menuMarkup).toContain('aria-label="Save"');
    expect(menuMarkup).toContain('aria-label="Settings"');
    expect(menuMarkup).not.toMatch(
      /support|login|member|premium|sync|share|feedback/i,
    );
  });

  it("renders the shared categorized map picker with the selected Farm tab", () => {
    const mapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
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

  it("shows the NPC Paths control only for the Bus Stop source map", () => {
    const standardViewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
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
        modalId: "view-panel",
        selectedMapId: "bus-stop",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(standardViewMarkup).not.toContain("NPC Paths");
    expect(busStopViewMarkup).toContain("NPC Paths");
  });

  it("groups View controls clearly while preserving pressed and disabled semantics", () => {
    const viewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "view-panel",
        selectedMapId: "standard",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(viewMarkup).toContain("Grid");
    expect(viewMarkup).toContain("Sprinkler Radius");
    expect(viewMarkup).toContain("Blocked (Buildings)");
    expect(viewMarkup).toContain("Night Mode");
    expect(viewMarkup).toContain("Appearance");
    expect(viewMarkup).toContain("Map Objects");
    expect(viewMarkup).toContain("Show resource clumps");
    expect(viewMarkup).toContain("Unavailable");
    expect(viewMarkup.match(/<h3>Display<\/h3>/g)).toBeNull();
    expect(viewMarkup).not.toMatch(/<button[^>]*>Resource Clumps<\/button>/);
    expect(viewMarkup.match(/aria-pressed=/g)).toHaveLength(12);
    expect(viewMarkup).toMatch(/disabled=""[^>]*>Weather/);
    expect(viewMarkup).toMatch(
      /disabled=""[^>]*>Weather<span class="editor-modal__option-status">Unavailable<\/span><\/button>/,
    );
  });

  it("renders local Settings with preserved toggles, unavailable status, and legal links", () => {
    const settingsMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "settings-panel",
        selectedMapId: "standard",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(settingsMarkup).toContain("Joystick");
    expect(settingsMarkup).toContain("Free Placement");
    expect(settingsMarkup).toContain("Toast Notifications");
    expect(settingsMarkup).toContain("Game-Styled Cursors");
    expect(settingsMarkup).toContain("Legal");
    expect(settingsMarkup.match(/aria-pressed=/g)).toHaveLength(5);
    expect(settingsMarkup).toMatch(/disabled=""[^>]*>Manage Mods/);
    expect(settingsMarkup).toMatch(
      /disabled=""[^>]*>Manage Mods<span class="editor-modal__option-status">Unavailable<\/span><\/button>/,
    );
    expect(settingsMarkup).toContain(
      'class="editor-modal__view-options editor-modal__legal-links"',
    );
    expect(settingsMarkup).toContain(
      '<a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>',
    );
    expect(settingsMarkup).toContain(
      '<a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a>',
    );
    expect(settingsMarkup).not.toMatch(/sign in|account|member|premium|sync|share|feedback/i);
  });

  it("renders the four catalog categories and a search field", () => {
    const catalogMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
        catalogPresentationChoicesByItemId: new Map(),
        category: "buildings",
        panelPosition: "bottom",
        searchQuery: "",
        selectedCatalogItemId: null,
        onCatalogItemPresentationChoiceChange: ignoreEditorAction,
        onCatalogItemSelect: ignoreEditorAction,
        onCategoryChange: ignoreEditorAction,
        onSearchQueryChange: ignoreEditorAction,
      }),
    );

    expect(catalogMarkup).toContain("Buildings");
    expect(catalogMarkup).toContain("Crops");
    expect(catalogMarkup).toContain("Placeables");
    expect(catalogMarkup).toContain("Decor");
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
        onCatalogItemPresentationChoiceChange: ignoreEditorAction,
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

  it("moves catalog tab selection with left, right, home, and end keys", () => {
    expect(getNextCatalogCategory("crops", "ArrowLeft")).toBe("buildings");
    expect(getNextCatalogCategory("crops", "ArrowRight")).toBe("placeables");
    expect(getNextCatalogCategory("decor", "ArrowRight")).toBe("buildings");
    expect(getNextCatalogCategory("placeables", "Home")).toBe("buildings");
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
