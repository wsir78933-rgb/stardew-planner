import { getPlannerMapById } from "../maps/map-catalog";
import type { TilesheetSeason } from "../rendering/tilesheet-asset-resolver";

export const editorSeasons = ["spring", "summer", "fall", "winter"] as const;

export const editorTools = [
  "cursor",
  "multi-select",
  "fill",
  "erase",
] as const;

export const editorCatalogCategories = [
  "buildings",
  "crops",
  "placeables",
  "decor",
] as const;

export const editorPanelPositions = ["bottom", "left"] as const;

export const editorModalIds = [
  "map-picker",
  "view-panel",
  "save-panel",
  "settings-panel",
  "help-info",
  "keyboard-shortcuts",
  "whats-new",
] as const;

export type EditorTool = (typeof editorTools)[number];
export type EditorCatalogCategory = (typeof editorCatalogCategories)[number];
export type EditorPanelPosition = (typeof editorPanelPositions)[number];
export type EditorModalId = (typeof editorModalIds)[number];
export type EditorMenuVisibility = "collapsed" | "expanded";

export type EditorViewState = Readonly<{
  season: TilesheetSeason;
  mapId: string;
  tool: EditorTool;
  catalogCategory: EditorCatalogCategory;
  panelPosition: EditorPanelPosition;
  modalId: EditorModalId | null;
}>;

export type EditorLayoutInput = Readonly<{
  viewportWidth: number;
  hasCoarsePointer: boolean;
}>;

export type EditorLayout = "desktop" | "compact";

export const editorToolAvailability: Readonly<Record<EditorTool, boolean>> = {
  cursor: true,
  "multi-select": true,
  fill: true,
  erase: true,
};

const compactLayoutMaximumWidth = 1400;

export function toggleEditorMenuVisibility(
  editorMenuVisibility: EditorMenuVisibility,
): EditorMenuVisibility {
  return editorMenuVisibility === "collapsed" ? "expanded" : "collapsed";
}

export function collapseEditorMenuForModalOpen(
  editorMenuVisibility: EditorMenuVisibility,
): EditorMenuVisibility {
  return editorMenuVisibility === "expanded"
    ? "collapsed"
    : editorMenuVisibility;
}

export function createInitialEditorViewState(
  viewportWidth?: number,
): EditorViewState {
  return {
    season: "spring",
    mapId: "standard",
    tool: "cursor",
    catalogCategory: "buildings",
    panelPosition:
      viewportWidth === undefined || viewportWidth > 640 ? "left" : "bottom",
    modalId: null,
  };
}

export function getNextEditorSeason(season: TilesheetSeason): TilesheetSeason {
  validateEditorSeason(season);
  const seasonIndex = editorSeasons.indexOf(season);
  return editorSeasons[(seasonIndex + 1) % editorSeasons.length];
}

export function selectEditorMap(
  editorViewState: EditorViewState,
  mapId: string,
): EditorViewState {
  validateEditorViewState(editorViewState);
  validateMapId(mapId);

  return {
    ...editorViewState,
    mapId,
    modalId: null,
  };
}

export function selectEditorSeason(
  editorViewState: EditorViewState,
  season: TilesheetSeason,
): EditorViewState {
  validateEditorViewState(editorViewState);
  validateEditorSeason(season);

  return {
    ...editorViewState,
    season,
    modalId: null,
  };
}

export function selectEditorTool(
  editorViewState: EditorViewState,
  tool: EditorTool,
): EditorViewState {
  validateEditorViewState(editorViewState);
  validateEditorTool(tool);

  if (!editorToolAvailability[tool]) {
    throw new Error(`Editor tool is unavailable: ${formatValue(tool)}.`);
  }

  return {
    ...editorViewState,
    tool,
  };
}

export function selectCatalogCategory(
  editorViewState: EditorViewState,
  catalogCategory: EditorCatalogCategory,
): EditorViewState {
  validateEditorViewState(editorViewState);
  validateCatalogCategory(catalogCategory);

  return {
    ...editorViewState,
    catalogCategory,
  };
}

export function selectPanelPosition(
  editorViewState: EditorViewState,
  panelPosition: EditorPanelPosition,
): EditorViewState {
  validateEditorViewState(editorViewState);
  validatePanelPosition(panelPosition);

  return {
    ...editorViewState,
    panelPosition,
  };
}

export function openEditorModal(
  editorViewState: EditorViewState,
  modalId: EditorModalId,
): EditorViewState {
  validateEditorViewState(editorViewState);
  validateModalId(modalId);

  return {
    ...editorViewState,
    modalId,
  };
}

export function closeEditorModal(
  editorViewState: EditorViewState,
): EditorViewState {
  validateEditorViewState(editorViewState);

  return {
    ...editorViewState,
    modalId: null,
  };
}

export function getEditorLayout(editorLayoutInput: EditorLayoutInput): EditorLayout {
  validateEditorLayoutInput(editorLayoutInput);

  return editorLayoutInput.viewportWidth <= compactLayoutMaximumWidth ||
    editorLayoutInput.hasCoarsePointer
    ? "compact"
    : "desktop";
}

function validateEditorViewState(editorViewState: EditorViewState): void {
  if (typeof editorViewState !== "object" || editorViewState === null) {
    throw new TypeError(
      `Editor view state must be a non-null object. Received: ${formatValue(editorViewState)}.`,
    );
  }

  validateEditorSeason(editorViewState.season);
  validateMapId(editorViewState.mapId);
  validateEditorTool(editorViewState.tool);
  validateCatalogCategory(editorViewState.catalogCategory);
  validatePanelPosition(editorViewState.panelPosition);

  if (
    editorViewState.modalId !== null &&
    !editorModalIds.includes(editorViewState.modalId)
  ) {
    throw new TypeError(
      `Editor modal ID must be null or one of ${editorModalIds.join(", ")}. Received: ${formatValue(editorViewState.modalId)}.`,
    );
  }
}

function validateMapId(mapId: string): void {
  if (typeof mapId !== "string" || mapId.length === 0) {
    throw new TypeError(
      `Editor map ID must be a non-empty string. Received: ${formatValue(mapId)}.`,
    );
  }

  getPlannerMapById(mapId);
}

function validateEditorSeason(season: TilesheetSeason): void {
  if (!editorSeasons.includes(season)) {
    throw new TypeError(
      `Editor season must be one of ${editorSeasons.join(", ")}. Received: ${formatValue(season)}.`,
    );
  }
}

function validateEditorTool(tool: EditorTool): void {
  if (!editorTools.includes(tool)) {
    throw new TypeError(
      `Editor tool must be one of ${editorTools.join(", ")}. Received: ${formatValue(tool)}.`,
    );
  }
}

function validateCatalogCategory(catalogCategory: EditorCatalogCategory): void {
  if (!editorCatalogCategories.includes(catalogCategory)) {
    throw new TypeError(
      `Editor catalog category must be one of ${editorCatalogCategories.join(", ")}. Received: ${formatValue(catalogCategory)}.`,
    );
  }
}

function validatePanelPosition(panelPosition: EditorPanelPosition): void {
  if (!editorPanelPositions.includes(panelPosition)) {
    throw new TypeError(
      `Editor panel position must be one of ${editorPanelPositions.join(", ")}. Received: ${formatValue(panelPosition)}.`,
    );
  }
}

function validateModalId(modalId: EditorModalId): void {
  if (!editorModalIds.includes(modalId)) {
    throw new TypeError(
      `Editor modal ID must be one of ${editorModalIds.join(", ")}. Received: ${formatValue(modalId)}.`,
    );
  }
}

function validateEditorLayoutInput(editorLayoutInput: EditorLayoutInput): void {
  if (
    typeof editorLayoutInput !== "object" ||
    editorLayoutInput === null ||
    !Number.isFinite(editorLayoutInput.viewportWidth) ||
    editorLayoutInput.viewportWidth < 0 ||
    typeof editorLayoutInput.hasCoarsePointer !== "boolean"
  ) {
    throw new TypeError(
      `Editor layout input must include a non-negative finite viewportWidth and boolean hasCoarsePointer. Received: ${formatValue(editorLayoutInput)}.`,
    );
  }
}

function formatValue(value: unknown): string {
  return JSON.stringify(value);
}
