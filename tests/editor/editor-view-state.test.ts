import { describe, expect, it } from "vitest";
import {
  collapseEditorMenuForModalOpen,
  createInitialEditorViewState,
  getEditorLayout,
  openEditorModal,
  selectCatalogCategory,
  selectEditorMap,
  selectEditorSeason,
  selectEditorTool,
  selectPanelPosition,
  toggleEditorMenuVisibility,
} from "../../src/editor/editor-view-state";

describe("editor view state", () => {
  it("starts on the standard farm with the cursor and bottom catalog", () => {
    expect(createInitialEditorViewState()).toEqual({
      season: "spring",
      mapId: "standard",
      tool: "cursor",
      catalogCategory: "buildings",
      panelPosition: "bottom",
      modalId: null,
    });
  });

  it("changes to a catalogued map and closes the map picker", () => {
    const mapPickerState = openEditorModal(
      createInitialEditorViewState(),
      "map-picker",
    );

    expect(selectEditorMap(mapPickerState, "waterfall-forest")).toMatchObject({
      mapId: "waterfall-forest",
      modalId: null,
      season: "spring",
      tool: "cursor",
    });
  });

  it("changes season and closes the season picker", () => {
    const seasonPickerState = openEditorModal(
      createInitialEditorViewState(),
      "season-picker",
    );

    expect(selectEditorSeason(seasonPickerState, "winter")).toMatchObject({
      season: "winter",
      modalId: null,
      mapId: "standard",
    });
  });

  it("allows the available multi-select and fill tools", () => {
    const initialEditorViewState = createInitialEditorViewState();

    expect(selectEditorTool(initialEditorViewState, "multi-select").tool).toBe(
      "multi-select",
    );
    expect(selectEditorTool(initialEditorViewState, "fill").tool).toBe("fill");
  });

  it("keeps map state while moving the catalog to the left", () => {
    const waterfallFarmState = selectEditorMap(
      createInitialEditorViewState(),
      "waterfall-forest",
    );
    const cropCatalogState = selectCatalogCategory(
      waterfallFarmState,
      "crops",
    );

    expect(selectPanelPosition(cropCatalogState, "left")).toMatchObject({
      mapId: "waterfall-forest",
      catalogCategory: "crops",
      panelPosition: "left",
    });
  });

  it("uses compact layout at 1400px and for coarse pointers", () => {
    expect(getEditorLayout({ viewportWidth: 1401, hasCoarsePointer: false })).toBe(
      "desktop",
    );
    expect(getEditorLayout({ viewportWidth: 1400, hasCoarsePointer: false })).toBe(
      "compact",
    );
    expect(getEditorLayout({ viewportWidth: 2000, hasCoarsePointer: true })).toBe(
      "compact",
    );
  });

  it("toggles the editor menu between collapsed and expanded", () => {
    expect(toggleEditorMenuVisibility("collapsed")).toBe("expanded");
    expect(toggleEditorMenuVisibility("expanded")).toBe("collapsed");
  });

  it("collapses the editor menu before opening a modal action", () => {
    expect(collapseEditorMenuForModalOpen("collapsed")).toBe("collapsed");
    expect(collapseEditorMenuForModalOpen("expanded")).toBe("collapsed");
  });

  it("fails fast for unknown map and season values", () => {
    const initialEditorViewState = createInitialEditorViewState();

    expect(() => selectEditorMap(initialEditorViewState, "not-a-map")).toThrow(
      "not-a-map",
    );
    expect(() => selectEditorSeason(initialEditorViewState, "monsoon" as never)).toThrow(
      "monsoon",
    );
  });
});
