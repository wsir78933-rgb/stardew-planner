import { describe, expect, it } from "vitest";
import {
  createBrowserEditorPreferenceStore,
  editorPreferenceStorageKey,
} from "../../src/editor/browser-editor-preferences";
import {
  createInitialEditorBehaviorOptions,
} from "../../src/editor/editor-behavior-options";
import {
  createInitialEditorDisplayOptions,
} from "../../src/editor/editor-display-options";

function createMemoryStorage(initialValues: Readonly<Record<string, string>> = {}) {
  const storedValues = new Map(Object.entries(initialValues));

  return {
    getItem(storageKey: string): string | null {
      return storedValues.get(storageKey) ?? null;
    },
    setItem(storageKey: string, serializedValue: string): void {
      storedValues.set(storageKey, serializedValue);
    },
  };
}

describe("browser editor preference store", () => {
  it("returns source-aligned defaults when browser storage is empty", () => {
    const editorPreferenceStore = createBrowserEditorPreferenceStore({
      storage: createMemoryStorage(),
    });

    expect(editorPreferenceStore.load()).toEqual({
      behaviorOptions: createInitialEditorBehaviorOptions(),
      displayOptions: createInitialEditorDisplayOptions(),
    });
  });

  it("round-trips a strict local preference record", () => {
    const storage = createMemoryStorage();
    const editorPreferenceStore = createBrowserEditorPreferenceStore({ storage });
    const expectedPreferences = {
      behaviorOptions: {
        ...createInitialEditorBehaviorOptions(),
        freePlacement: true,
      },
      displayOptions: {
        ...createInitialEditorDisplayOptions(),
        showGrid: true,
      },
    };

    editorPreferenceStore.save(expectedPreferences);

    expect(JSON.parse(storage.getItem(editorPreferenceStorageKey) ?? "")).toEqual(
      expectedPreferences,
    );
    const remountedEditorPreferenceStore = createBrowserEditorPreferenceStore({
      storage,
    });
    expect(remountedEditorPreferenceStore.load()).toEqual(expectedPreferences);
  });

  it("fails fast for malformed persisted preference JSON", () => {
    const editorPreferenceStore = createBrowserEditorPreferenceStore({
      storage: createMemoryStorage({ [editorPreferenceStorageKey]: "{" }),
    });

    expect(() => editorPreferenceStore.load()).toThrow(
      "Editor preferences JSON is invalid",
    );
  });
});
