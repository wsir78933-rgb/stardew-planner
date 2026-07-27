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
  it("renders the reference-visible tools without a Fill button", () => {
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

    expect(toolbarMarkup.match(/<button/g)).toHaveLength(5);
    expect(toolbarMarkup).toContain('aria-label="Cursor tool"');
    expect(toolbarMarkup).toContain('aria-label="Multi-select tool"');
    expect(toolbarMarkup).toContain('aria-label="Erase tool"');
    expect(toolbarMarkup).toContain('aria-pressed="true"');
    expect(toolbarMarkup).not.toContain('aria-label="Fill tool"');
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
        onRotate: ignoreEditorAction,
        onTintChange: ignoreEditorAction,
        selection: {
          canRotate: true,
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
    expect(inspectorMarkup).toContain('aria-label="Rotate selected item"');
    expect(inspectorMarkup).toContain('aria-label="Copy selected placement"');
    expect(inspectorMarkup).toContain('aria-label="Delete selected placement"');
  });

  it("renders Menu separately from its collapsed editor actions", () => {
    const collapsedMenuMarkup = renderToStaticMarkup(
      createElement(EditorMenuBar, {
        activeModalId: null,
        editorMenuVisibility: "collapsed",
        mapDisplayName: "Standard Farm",
        season: "spring",
        onOpenModal: ignoreEditorAction,
        onToggleMenu: ignoreEditorAction,
      }),
    );
    const expandedMenuMarkup = renderToStaticMarkup(
      createElement(EditorMenuBar, {
        activeModalId: null,
        editorMenuVisibility: "expanded",
        mapDisplayName: "Standard Farm",
        season: "spring",
        onOpenModal: ignoreEditorAction,
        onToggleMenu: ignoreEditorAction,
        expandedActionsClassName: "planner-workspace__menu-popover",
      }),
    );

    expect(collapsedMenuMarkup.match(/<button/g)).toHaveLength(1);
    expect(collapsedMenuMarkup).toContain('aria-label="Menu"');
    expect(collapsedMenuMarkup).toContain('aria-expanded="false"');
    expect(collapsedMenuMarkup).not.toContain(
      'aria-controls="editor-menu-actions"',
    );
    expect(collapsedMenuMarkup).not.toContain("Season");
    expect(expandedMenuMarkup.match(/<button/g)).toHaveLength(6);
    expect(expandedMenuMarkup).toContain('aria-label="Menu"');
    expect(expandedMenuMarkup).toContain('aria-expanded="true"');
    expect(expandedMenuMarkup).toContain(
      'aria-controls="editor-menu-actions"',
    );
    expect(expandedMenuMarkup).toContain('id="editor-menu-actions"');
    expect(expandedMenuMarkup).toContain(
      'class="editor-menu-bar__actions planner-workspace__menu-popover"',
    );
    expect(expandedMenuMarkup).toContain('aria-label="Season: spring"');
    expect(expandedMenuMarkup).toContain(
      'aria-label="Map: Standard Farm"',
    );
    expect(expandedMenuMarkup).toContain("Season");
    expect(expandedMenuMarkup).toContain("Map");
    expect(expandedMenuMarkup).toContain("View");
    expect(expandedMenuMarkup).toContain("Save");
    expect(expandedMenuMarkup).toContain("Settings");
    expect(expandedMenuMarkup).not.toMatch(
      /support|login|member|premium|sync|share|feedback/i,
    );
  });

  it("groups every catalogued map into the four editor map headings", () => {
    const mapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "map-picker",
        selectedMapId: "standard",
        season: "spring",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(mapPickerMarkup).toContain(">Farm<");
    expect(mapPickerMarkup).toContain(">Interiors<");
    expect(mapPickerMarkup).toContain(">Exteriors<");
    expect(mapPickerMarkup).toContain(">Community<");
    expect(mapPickerMarkup.match(/data-editor-map-id=/g)).toHaveLength(48);
    expect(mapPickerMarkup).toContain(
      'src="/game-assets/1.6.15/maps/previews/Farm.png"',
    );
    expect(mapPickerMarkup).toContain("Waterfall Forest Farm (WaFF)");
    expect(mapPickerMarkup).toContain(
      'data-editor-map-id="sve-grandpas-shed-2"',
    );
    expect(mapPickerMarkup).toContain('role="dialog"');
    expect(mapPickerMarkup).toContain('tabindex="-1"');
  });

  it("renders the source-faithful Ginger Island and Farmhouse 2 map configuration controls", () => {
    const gingerIslandMapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "map-picker",
        selectedMapId: "ginger-island",
        season: "spring",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );
    const farmhouseMapPickerMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "map-picker",
        selectedMapId: "farmhouse-2",
        season: "spring",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
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
        season: "spring",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
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
        season: "spring",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );
    const busStopViewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "view-panel",
        selectedMapId: "bus-stop",
        season: "spring",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(standardViewMarkup).not.toContain("NPC Paths");
    expect(busStopViewMarkup).toContain("NPC Paths");
  });

  it("renders original View toggles and keeps Weather unavailable", () => {
    const viewMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "view-panel",
        selectedMapId: "standard",
        season: "spring",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(viewMarkup).toContain("Grid");
    expect(viewMarkup).toContain("Sprinkler Radius");
    expect(viewMarkup).toContain("Blocked (Buildings)");
    expect(viewMarkup).toContain("Night Mode");
    expect(viewMarkup).toMatch(/Weather<\/button>/);
    expect(viewMarkup).toMatch(/disabled=""[^>]*>Weather/);
  });

  it("renders local Settings without account controls and keeps mods unavailable", () => {
    const settingsMarkup = renderToStaticMarkup(
      createElement(EditorModal, {
        modalId: "settings-panel",
        selectedMapId: "standard",
        season: "spring",
        panelPosition: "bottom",
        onClose: ignoreEditorAction,
        onMapChange: ignoreEditorAction,
        onSeasonChange: ignoreEditorAction,
        onPanelPositionChange: ignoreEditorAction,
      }),
    );

    expect(settingsMarkup).toContain("Joystick");
    expect(settingsMarkup).toContain("Free Placement");
    expect(settingsMarkup).toContain("Toast Notifications");
    expect(settingsMarkup).toContain("Game-Styled Cursors");
    expect(settingsMarkup).toMatch(/disabled=""[^>]*>Manage Mods/);
    expect(settingsMarkup).not.toMatch(/sign in|account|member|premium|sync|share|feedback/i);
  });

  it("renders the four catalog categories and a search field", () => {
    const catalogMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
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
    expect(catalogMarkup).toContain("Placeables");
    expect(catalogMarkup).toContain("Decor");
    expect(catalogMarkup).toContain('type="search"');
  });

  it("connects every catalog tab to its active tabpanel", () => {
    const catalogMarkup = renderToStaticMarkup(
      createElement(ItemCatalogPanel, {
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
