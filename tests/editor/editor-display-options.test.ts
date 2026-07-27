import { describe, expect, it } from "vitest";
import {
  createInitialEditorDisplayOptions,
  toggleEditorDisplayOption,
} from "../../src/editor/editor-display-options";

describe("editor display options", () => {
  it("creates the source-aligned local defaults", () => {
    expect(createInitialEditorDisplayOptions()).toEqual({
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
    });
  });

  it("toggles exactly one display option without mutating the current state", () => {
    const currentDisplayOptions = createInitialEditorDisplayOptions();
    const nextDisplayOptions = toggleEditorDisplayOption(
      currentDisplayOptions,
      "showGrid",
    );

    expect(nextDisplayOptions).toEqual({
      ...currentDisplayOptions,
      showGrid: true,
    });
    expect(currentDisplayOptions.showGrid).toBe(false);
  });
});
