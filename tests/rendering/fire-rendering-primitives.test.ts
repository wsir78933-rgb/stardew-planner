import { describe, expect, it } from "vitest";
import {
  fireAnimationFrames,
  fireGlowFrame,
  resolveFireAnimationTimeOffset,
  resolveFireGlowPhaseOffset,
} from "../../src/rendering/fire-rendering-primitives";

describe("fire rendering primitives", () => {
  it("returns the shared Cursor fire frames used by both rendering families", () => {
    expect(fireAnimationFrames).toEqual([
      { x: 276, y: 1985, width: 12, height: 11 },
      { x: 288, y: 1985, width: 12, height: 11 },
      { x: 300, y: 1985, width: 12, height: 11 },
      { x: 312, y: 1985, width: 12, height: 11 },
    ]);
    expect(fireGlowFrame).toEqual({
      x: 88,
      y: 1779,
      width: 30,
      height: 30,
    });
  });

  it.each([
    { x: 2, y: 3, expectedAnimationOffset: 46, expectedGlowOffset: -1533 },
    { x: 4, y: 7, expectedAnimationOffset: 70, expectedGlowOffset: -113 },
  ])(
    "preserves both position hashes at ($x,$y)",
    ({ expectedAnimationOffset, expectedGlowOffset, x, y }) => {
      expect(resolveFireAnimationTimeOffset(x, y)).toBe(expectedAnimationOffset);
      expect(resolveFireGlowPhaseOffset(x, y)).toBe(expectedGlowOffset);
    },
  );
});
