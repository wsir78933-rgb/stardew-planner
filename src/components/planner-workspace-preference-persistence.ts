import type { EditorPreferences } from "../editor/browser-editor-preferences";
import { editorBehaviorOptionKeys } from "../editor/editor-behavior-options";
import { editorDisplayOptionKeys } from "../editor/editor-display-options";

export type PlannerWorkspacePreferencePersistence = Readonly<{
  observePreferences(editorPreferences: EditorPreferences): void;
}>;

export function createPlannerWorkspacePreferencePersistence({
  initialPreferences,
  savePreferences,
}: Readonly<{
  initialPreferences: EditorPreferences;
  savePreferences: (editorPreferences: EditorPreferences) => void;
}>): PlannerWorkspacePreferencePersistence {
  if (typeof savePreferences !== "function") {
    throw new TypeError(
      `Planner workspace savePreferences must be a function; received ${describeValue(savePreferences)}.`,
    );
  }

  let hasObservedInitialPreferences = false;
  let lastSavedPreferences = initialPreferences;

  return {
    observePreferences(editorPreferences): void {
      if (!hasObservedInitialPreferences) {
        if (haveSameEditorPreferences(editorPreferences, initialPreferences)) {
          hasObservedInitialPreferences = true;
        }
        return;
      }

      if (haveSameEditorPreferences(editorPreferences, lastSavedPreferences)) {
        return;
      }

      savePreferences(editorPreferences);
      lastSavedPreferences = editorPreferences;
    },
  };
}

function haveSameEditorPreferences(
  firstPreferences: EditorPreferences,
  secondPreferences: EditorPreferences,
): boolean {
  return editorBehaviorOptionKeys.every(
    (optionKey) =>
      firstPreferences.behaviorOptions[optionKey] ===
      secondPreferences.behaviorOptions[optionKey],
  ) && editorDisplayOptionKeys.every(
    (optionKey) =>
      firstPreferences.displayOptions[optionKey] ===
      secondPreferences.displayOptions[optionKey],
  );
}

function describeValue(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  return JSON.stringify(value);
}
