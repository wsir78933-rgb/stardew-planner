export const editorBehaviorOptionKeys = [
  "autoShowResourceClumps",
  "showJoystick",
  "leftHandMode",
  "freePlacement",
  "showToasts",
  "gameCursors",
] as const;

export type EditorBehaviorOptionKey = (typeof editorBehaviorOptionKeys)[number];

export type EditorBehaviorOptions = Readonly<{
  autoShowResourceClumps: boolean;
  freePlacement: boolean;
  gameCursors: boolean;
  leftHandMode: boolean;
  showJoystick: boolean;
  showToasts: boolean;
}>;

export function createInitialEditorBehaviorOptions(): EditorBehaviorOptions {
  return {
    autoShowResourceClumps: true,
    freePlacement: false,
    gameCursors: true,
    leftHandMode: false,
    showJoystick: true,
    showToasts: true,
  };
}

export function setEditorBehaviorOption(
  currentEditorBehaviorOptions: EditorBehaviorOptions,
  editorBehaviorOptionKey: EditorBehaviorOptionKey,
  nextValue: boolean,
): EditorBehaviorOptions {
  assertEditorBehaviorOptions(currentEditorBehaviorOptions);

  if (!editorBehaviorOptionKeys.includes(editorBehaviorOptionKey)) {
    throw new TypeError(
      `Editor behavior option key must be one of ${editorBehaviorOptionKeys.join(", ")}; received ${describeValue(editorBehaviorOptionKey)}.`,
    );
  }

  if (typeof nextValue !== "boolean") {
    throw new TypeError(
      `Editor behavior option ${editorBehaviorOptionKey} must be set to a boolean; received ${describeValue(nextValue)}.`,
    );
  }

  return {
    ...currentEditorBehaviorOptions,
    [editorBehaviorOptionKey]: nextValue,
  };
}

function assertEditorBehaviorOptions(
  editorBehaviorOptions: EditorBehaviorOptions,
): void {
  if (typeof editorBehaviorOptions !== "object" || editorBehaviorOptions === null) {
    throw new TypeError(
      `Editor behavior options must be a non-null object; received ${describeValue(editorBehaviorOptions)}.`,
    );
  }

  for (const editorBehaviorOptionKey of editorBehaviorOptionKeys) {
    if (typeof editorBehaviorOptions[editorBehaviorOptionKey] !== "boolean") {
      throw new TypeError(
        `Editor behavior option ${editorBehaviorOptionKey} must be a boolean; received ${describeValue(editorBehaviorOptions[editorBehaviorOptionKey])}.`,
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
