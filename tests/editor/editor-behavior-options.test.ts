import { describe, expect, it } from "vitest";
import {
  createInitialEditorBehaviorOptions,
  setEditorBehaviorOption,
} from "../../src/editor/editor-behavior-options";

describe("editor behavior options", () => {
  it("uses source-aligned local behavior defaults", () => {
    expect(createInitialEditorBehaviorOptions()).toEqual({
      autoShowResourceClumps: true,
      freePlacement: false,
      gameCursors: true,
      leftHandMode: false,
      showJoystick: true,
      showToasts: true,
    });
  });

  it("sets one behavior option without mutating the current options", () => {
    const currentBehaviorOptions = createInitialEditorBehaviorOptions();
    const nextBehaviorOptions = setEditorBehaviorOption(
      currentBehaviorOptions,
      "freePlacement",
      true,
    );

    expect(nextBehaviorOptions).toEqual({
      ...currentBehaviorOptions,
      freePlacement: true,
    });
    expect(currentBehaviorOptions.freePlacement).toBe(false);
  });
});
