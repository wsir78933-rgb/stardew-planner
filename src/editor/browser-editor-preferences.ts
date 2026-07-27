import {
  createInitialEditorBehaviorOptions,
  editorBehaviorOptionKeys,
  type EditorBehaviorOptions,
} from "./editor-behavior-options";
import {
  createInitialEditorDisplayOptions,
  editorDisplayOptionKeys,
  type EditorDisplayOptions,
} from "./editor-display-options";

export const editorPreferenceStorageKey =
  "stardew-planner.editor-preferences.v2";

export type EditorPreferences = Readonly<{
  behaviorOptions: EditorBehaviorOptions;
  displayOptions: EditorDisplayOptions;
}>;

export type EditorPreferenceStorageAdapter = Readonly<{
  getItem(storageKey: string): string | null;
  setItem(storageKey: string, serializedValue: string): void;
}>;

export type EditorPreferenceStore = Readonly<{
  load(): EditorPreferences;
  save(editorPreferences: EditorPreferences): void;
}>;

export type CreateBrowserEditorPreferenceStoreOptions = Readonly<{
  storage?: EditorPreferenceStorageAdapter;
}>;

export function createBrowserEditorPreferenceStore(
  options: CreateBrowserEditorPreferenceStoreOptions = {},
): EditorPreferenceStore {
  const storage = options.storage ?? getBrowserLocalStorage();
  assertEditorPreferenceStorageAdapter(storage);

  return {
    load(): EditorPreferences {
      const serializedEditorPreferences = storage.getItem(editorPreferenceStorageKey);

      if (serializedEditorPreferences === null) {
        return createInitialEditorPreferences();
      }

      return parseStoredEditorPreferences(serializedEditorPreferences);
    },
    save(editorPreferences: EditorPreferences): void {
      const persistentEditorPreferences = parseEditorPreferences(editorPreferences);
      storage.setItem(
        editorPreferenceStorageKey,
        JSON.stringify(persistentEditorPreferences),
      );
    },
  };
}

export function createInitialEditorPreferences(): EditorPreferences {
  return {
    behaviorOptions: createInitialEditorBehaviorOptions(),
    displayOptions: createInitialEditorDisplayOptions(),
  };
}

function getBrowserLocalStorage(): EditorPreferenceStorageAdapter {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    throw new Error(
      "Browser localStorage is unavailable; createBrowserEditorPreferenceStore requires a browser storage context.",
    );
  }

  try {
    return window.localStorage;
  } catch (caughtError) {
    throw new Error(
      `Browser localStorage is unavailable while reading window.localStorage: ${describeCaughtError(caughtError)}.`,
      { cause: caughtError },
    );
  }
}

function parseStoredEditorPreferences(
  serializedEditorPreferences: string,
): EditorPreferences {
  if (typeof serializedEditorPreferences !== "string") {
    throw new TypeError(
      `Editor preferences storage value must be a string; received ${describeValue(serializedEditorPreferences)}.`,
    );
  }

  let rawEditorPreferences: unknown;

  try {
    rawEditorPreferences = JSON.parse(serializedEditorPreferences);
  } catch (caughtError) {
    throw new Error(
      `Editor preferences JSON is invalid for storage key ${JSON.stringify(editorPreferenceStorageKey)}: ${describeCaughtError(caughtError)}.`,
      { cause: caughtError },
    );
  }

  return parseEditorPreferences(rawEditorPreferences);
}

function parseEditorPreferences(rawEditorPreferences: unknown): EditorPreferences {
  const editorPreferencesRecord = assertPlainRecord(
    rawEditorPreferences,
    "editor preferences",
  );
  assertExactFields(
    editorPreferencesRecord,
    "editor preferences",
    ["behaviorOptions", "displayOptions"],
  );

  return {
    behaviorOptions: parseEditorBehaviorOptions(
      editorPreferencesRecord.behaviorOptions,
    ),
    displayOptions: parseEditorDisplayOptions(
      editorPreferencesRecord.displayOptions,
    ),
  };
}

function parseEditorBehaviorOptions(
  rawEditorBehaviorOptions: unknown,
): EditorBehaviorOptions {
  const editorBehaviorOptionsRecord = assertPlainRecord(
    rawEditorBehaviorOptions,
    "behaviorOptions",
  );
  assertExactFields(
    editorBehaviorOptionsRecord,
    "behaviorOptions",
    editorBehaviorOptionKeys,
  );

  return {
    autoShowResourceClumps: readBoolean(
      editorBehaviorOptionsRecord.autoShowResourceClumps,
      "behaviorOptions.autoShowResourceClumps",
    ),
    freePlacement: readBoolean(
      editorBehaviorOptionsRecord.freePlacement,
      "behaviorOptions.freePlacement",
    ),
    gameCursors: readBoolean(
      editorBehaviorOptionsRecord.gameCursors,
      "behaviorOptions.gameCursors",
    ),
    leftHandMode: readBoolean(
      editorBehaviorOptionsRecord.leftHandMode,
      "behaviorOptions.leftHandMode",
    ),
    showJoystick: readBoolean(
      editorBehaviorOptionsRecord.showJoystick,
      "behaviorOptions.showJoystick",
    ),
    showToasts: readBoolean(
      editorBehaviorOptionsRecord.showToasts,
      "behaviorOptions.showToasts",
    ),
  };
}

function parseEditorDisplayOptions(
  rawEditorDisplayOptions: unknown,
): EditorDisplayOptions {
  const editorDisplayOptionsRecord = assertPlainRecord(
    rawEditorDisplayOptions,
    "displayOptions",
  );
  assertExactFields(
    editorDisplayOptionsRecord,
    "displayOptions",
    editorDisplayOptionKeys,
  );

  return {
    showBeeHouseRadius: readBoolean(
      editorDisplayOptionsRecord.showBeeHouseRadius,
      "displayOptions.showBeeHouseRadius",
    ),
    showBuildableTiles: readBoolean(
      editorDisplayOptionsRecord.showBuildableTiles,
      "displayOptions.showBuildableTiles",
    ),
    showCropTiles: readBoolean(
      editorDisplayOptionsRecord.showCropTiles,
      "displayOptions.showCropTiles",
    ),
    showGrid: readBoolean(editorDisplayOptionsRecord.showGrid, "displayOptions.showGrid"),
    showJunimoHutRadius: readBoolean(
      editorDisplayOptionsRecord.showJunimoHutRadius,
      "displayOptions.showJunimoHutRadius",
    ),
    showNightMode: readBoolean(
      editorDisplayOptionsRecord.showNightMode,
      "displayOptions.showNightMode",
    ),
    showNpcPaths: readBoolean(
      editorDisplayOptionsRecord.showNpcPaths,
      "displayOptions.showNpcPaths",
    ),
    showScarecrowRadius: readBoolean(
      editorDisplayOptionsRecord.showScarecrowRadius,
      "displayOptions.showScarecrowRadius",
    ),
    showSprinklerRadius: readBoolean(
      editorDisplayOptionsRecord.showSprinklerRadius,
      "displayOptions.showSprinklerRadius",
    ),
    showTreeTiles: readBoolean(
      editorDisplayOptionsRecord.showTreeTiles,
      "displayOptions.showTreeTiles",
    ),
  };
}

function assertEditorPreferenceStorageAdapter(
  storage: EditorPreferenceStorageAdapter,
): void {
  if (
    storage === null ||
    typeof storage !== "object" ||
    typeof storage.getItem !== "function" ||
    typeof storage.setItem !== "function"
  ) {
    throw new TypeError(
      `Editor preference storage adapter must expose getItem and setItem; received ${describeValue(storage)}.`,
    );
  }
}

function assertPlainRecord(
  value: unknown,
  fieldName: string,
): Readonly<Record<string, unknown>> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null)
  ) {
    throw new TypeError(
      `Editor preferences ${fieldName} must be a plain object; received ${describeValue(value)}.`,
    );
  }

  return value as Readonly<Record<string, unknown>>;
}

function assertExactFields(
  record: Readonly<Record<string, unknown>>,
  fieldName: string,
  expectedFieldNames: readonly string[],
): void {
  for (const expectedFieldName of expectedFieldNames) {
    if (!Object.hasOwn(record, expectedFieldName)) {
      throw new TypeError(
        `Editor preferences ${fieldName}.${expectedFieldName} must be present; received undefined.`,
      );
    }
  }

  for (const actualFieldName of Object.keys(record)) {
    if (!expectedFieldNames.includes(actualFieldName)) {
      throw new TypeError(
        `Editor preferences ${fieldName}.${actualFieldName} must not be present; received ${describeValue(record[actualFieldName])}.`,
      );
    }
  }
}

function readBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new TypeError(
      `Editor preferences ${fieldName} must be a boolean; received ${describeValue(value)}.`,
    );
  }

  return value;
}

function describeCaughtError(caughtError: unknown): string {
  return caughtError instanceof Error ? caughtError.message : String(caughtError);
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
