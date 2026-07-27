export const editorDisplayOptionKeys = [
  "showGrid",
  "showSprinklerRadius",
  "showScarecrowRadius",
  "showBeeHouseRadius",
  "showJunimoHutRadius",
  "showBuildableTiles",
  "showCropTiles",
  "showTreeTiles",
  "showNpcPaths",
  "showNightMode",
] as const;

export type EditorDisplayOptionKey = (typeof editorDisplayOptionKeys)[number];

export type EditorDisplayOptions = Readonly<{
  showBeeHouseRadius: boolean;
  showBuildableTiles: boolean;
  showCropTiles: boolean;
  showGrid: boolean;
  showJunimoHutRadius: boolean;
  showNightMode: boolean;
  showNpcPaths: boolean;
  showScarecrowRadius: boolean;
  showSprinklerRadius: boolean;
  showTreeTiles: boolean;
}>;

export function createInitialEditorDisplayOptions(): EditorDisplayOptions {
  return {
    showBeeHouseRadius: false,
    showBuildableTiles: false,
    showCropTiles: false,
    showGrid: false,
    showJunimoHutRadius: false,
    showNightMode: false,
    showNpcPaths: false,
    showScarecrowRadius: false,
    showSprinklerRadius: false,
    showTreeTiles: false,
  };
}

export function toggleEditorDisplayOption(
  currentDisplayOptions: EditorDisplayOptions,
  editorDisplayOptionKey: EditorDisplayOptionKey,
): EditorDisplayOptions {
  assertEditorDisplayOptions(currentDisplayOptions);

  if (!editorDisplayOptionKeys.includes(editorDisplayOptionKey)) {
    throw new TypeError(
      `Editor display option key must be one of ${editorDisplayOptionKeys.join(", ")}; received ${describeValue(editorDisplayOptionKey)}.`,
    );
  }

  return {
    ...currentDisplayOptions,
    [editorDisplayOptionKey]: !currentDisplayOptions[editorDisplayOptionKey],
  };
}

function assertEditorDisplayOptions(
  editorDisplayOptions: EditorDisplayOptions,
): void {
  if (typeof editorDisplayOptions !== "object" || editorDisplayOptions === null) {
    throw new TypeError(
      `Editor display options must be a non-null object; received ${describeValue(editorDisplayOptions)}.`,
    );
  }

  for (const editorDisplayOptionKey of editorDisplayOptionKeys) {
    if (typeof editorDisplayOptions[editorDisplayOptionKey] !== "boolean") {
      throw new TypeError(
        `Editor display option ${editorDisplayOptionKey} must be a boolean; received ${describeValue(editorDisplayOptions[editorDisplayOptionKey])}.`,
      );
    }
  }
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null) {
    return "null";
  }

  return JSON.stringify(value);
}
