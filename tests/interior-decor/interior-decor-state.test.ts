import { describe, expect, it } from "vitest";
import {
  createEmptyInteriorDecorState,
  getInteriorDecorPattern,
  restoreInteriorDecorState,
  setInteriorDecorPattern,
  type InteriorDecorKind,
} from "../../src/interior-decor/interior-decor-state";

describe("interior decor state", () => {
  it("accepts each locked wallpaper and flooring namespace", () => {
    expect(
      restoreInteriorDecorState({
        wallpapers: { Bedroom: "111", Kitchen: "MoreWalls:25" },
        floors: { Floor: "87", Entry: "MoreFloors:8" },
      }),
    ).toEqual({
      wallpapers: { Bedroom: "111", Kitchen: "MoreWalls:25" },
      floors: { Floor: "87", Entry: "MoreFloors:8" },
    });
  });

  it("creates immutable updates for one validated target and reads the selected pattern", () => {
    const emptyInteriorDecorState = createEmptyInteriorDecorState();
    const updatedInteriorDecorState = setInteriorDecorPattern(
      emptyInteriorDecorState,
      "wallpaper",
      "Bedroom",
      "17",
    );

    expect(emptyInteriorDecorState).toEqual({ wallpapers: {}, floors: {} });
    expect(updatedInteriorDecorState).toEqual({
      wallpapers: { Bedroom: "17" },
      floors: {},
    });
    expect(getInteriorDecorPattern(updatedInteriorDecorState, "wallpaper", "Bedroom"))
      .toBe("17");
    expect(getInteriorDecorPattern(updatedInteriorDecorState, "flooring", "Bedroom"))
      .toBeUndefined();
  });

  it("rejects wrong namespaces, patterns, target keys, kinds, and unexpected fields", () => {
    const invalidInteriorDecorStates = [
      {
        value: { wallpapers: {}, floors: { Floor: "MoreWalls:0" } },
        expectedError: "MoreWalls:0",
      },
      {
        value: { wallpapers: { Bedroom: "112" }, floors: {} },
        expectedError: "112",
      },
      {
        value: { wallpapers: {}, floors: { Floor: "MoreFloors:9" } },
        expectedError: "MoreFloors:9",
      },
      {
        value: { wallpapers: { "": "0" }, floors: {} },
        expectedError: 'target ID must be a non-empty string; received ""',
      },
      {
        value: { wallpapers: {}, floors: {}, unexpected: true },
        expectedError: "interiorDecor.unexpected",
      },
    ];

    for (const invalidInteriorDecorState of invalidInteriorDecorStates) {
      expect(() => restoreInteriorDecorState(invalidInteriorDecorState.value)).toThrow(
        invalidInteriorDecorState.expectedError,
      );
    }

    expect(() =>
      setInteriorDecorPattern(
        createEmptyInteriorDecorState(),
        "floor" as unknown as InteriorDecorKind,
        "Bedroom",
        "0",
      ),
    ).toThrow('kind must be "wallpaper" or "flooring"; received "floor"');
  });

  it("rejects a parsed __proto__ target instead of silently dropping it", () => {
    const parsedInteriorDecorState = JSON.parse(
      '{"wallpapers":{"__proto__":"0"},"floors":{}}',
    ) as unknown;

    expect(() => restoreInteriorDecorState(parsedInteriorDecorState)).toThrow(
      "__proto__",
    );
  });

  it("rejects missing decor containers, non-record containers, and noncanonical IDs", () => {
    const invalidInteriorDecorStates = [
      {
        value: { floors: {} },
        expectedError: "interiorDecor.wallpapers",
      },
      {
        value: { wallpapers: {} },
        expectedError: "interiorDecor.floors",
      },
      {
        value: { wallpapers: [], floors: {} },
        expectedError: "interiorDecor.wallpapers",
      },
      {
        value: { wallpapers: { Bedroom: "00" }, floors: {} },
        expectedError: 'received "00"',
      },
      {
        value: { wallpapers: { Bedroom: "MoreWalls:01" }, floors: {} },
        expectedError: 'received "MoreWalls:01"',
      },
    ];

    for (const invalidInteriorDecorState of invalidInteriorDecorStates) {
      expect(() => restoreInteriorDecorState(invalidInteriorDecorState.value)).toThrow(
        invalidInteriorDecorState.expectedError,
      );
    }
  });

  it("does not suppress unexpected description failures at the input boundary", () => {
    const descriptionFailure = new Error("interior decor description sentinel");
    const invalidPatternValue = {};

    Object.defineProperty(invalidPatternValue, Symbol.toStringTag, {
      get() {
        throw descriptionFailure;
      },
    });

    expect(() =>
      restoreInteriorDecorState({
        wallpapers: { Bedroom: invalidPatternValue },
        floors: {},
      }),
    ).toThrow(descriptionFailure);
  });

  it("includes an invalid JSON object value in its boundary error", () => {
    expect(() =>
      restoreInteriorDecorState({
        wallpapers: { Bedroom: { unexpected: "value" } },
        floors: {},
      }),
    ).toThrow('received {"unexpected":"value"}');
  });
});
