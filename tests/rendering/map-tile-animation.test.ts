import { describe, expect, it, vi } from "vitest";
import {
  createMapTileAnimationUpdate,
  getMapTileAnimationFrameIndex,
} from "../../src/rendering/map-tile-animation";
import type { RenderingTileAnimation } from "../../src/rendering/map-rendering-contract";

const variableDurationAnimation: RenderingTileAnimation = {
  frames: [
    { gid: 11, durationMilliseconds: 100 },
    { gid: 12, durationMilliseconds: 300 },
    { gid: 13, durationMilliseconds: 200 },
  ],
  durationMilliseconds: 600,
};

describe("map tile animation", () => {
  it("resolves variable-duration frame boundaries and wraps the timeline", () => {
    expect(getMapTileAnimationFrameIndex(variableDurationAnimation, 0)).toBe(0);
    expect(getMapTileAnimationFrameIndex(variableDurationAnimation, 99)).toBe(0);
    expect(getMapTileAnimationFrameIndex(variableDurationAnimation, 100)).toBe(1);
    expect(getMapTileAnimationFrameIndex(variableDurationAnimation, 399)).toBe(1);
    expect(getMapTileAnimationFrameIndex(variableDurationAnimation, 400)).toBe(2);
    expect(getMapTileAnimationFrameIndex(variableDurationAnimation, 599)).toBe(2);
    expect(getMapTileAnimationFrameIndex(variableDurationAnimation, 600)).toBe(0);
    expect(getMapTileAnimationFrameIndex(variableDurationAnimation, 1_450)).toBe(1);
  });

  it("applies only changed GIDs and reports whether the canvas needs rendering", () => {
    const applyFrame = vi.fn();
    const tileAnimationUpdate = createMapTileAnimationUpdate(
      variableDurationAnimation,
      applyFrame,
      "standard",
      11,
    );

    expect(tileAnimationUpdate.update(0)).toBe(false);
    expect(tileAnimationUpdate.update(99)).toBe(false);
    expect(tileAnimationUpdate.update(100)).toBe(true);
    expect(tileAnimationUpdate.update(399)).toBe(false);
    expect(tileAnimationUpdate.update(400)).toBe(true);
    expect(tileAnimationUpdate.update(600)).toBe(true);
    expect(applyFrame.mock.calls).toEqual([[1], [2], [0]]);
  });

  it("does not reapply repeated source GIDs in adjacent animation frames", () => {
    const applyFrame = vi.fn();
    const repeatedGidAnimation: RenderingTileAnimation = {
      frames: [
        { gid: 11, durationMilliseconds: 100 },
        { gid: 11, durationMilliseconds: 100 },
        { gid: 12, durationMilliseconds: 100 },
      ],
      durationMilliseconds: 300,
    };
    const tileAnimationUpdate = createMapTileAnimationUpdate(
      repeatedGidAnimation,
      applyFrame,
      "standard",
      11,
    );

    expect(tileAnimationUpdate.update(100)).toBe(false);
    expect(tileAnimationUpdate.update(200)).toBe(true);
    expect(applyFrame).toHaveBeenCalledOnce();
    expect(applyFrame).toHaveBeenCalledWith(2);
  });

  it("rejects an invalid frame and reports its serialized value", () => {
    expect(() =>
      createMapTileAnimationUpdate(
        {
          frames: [{ gid: 0, durationMilliseconds: 100 }],
          durationMilliseconds: 100,
        },
        vi.fn(),
        "standard",
        11,
      ),
    ).toThrow(/received \{"gid":0,"durationMilliseconds":100\}/);
  });

  it("rejects a non-finite or negative current time with map context", () => {
    const tileAnimationUpdate = createMapTileAnimationUpdate(
      variableDurationAnimation,
      vi.fn(),
      "standard",
      11,
    );

    expect(() => tileAnimationUpdate.update(Number.NaN)).toThrow(
      /time for GID 11 in mapId "standard" must be a finite non-negative number of milliseconds; received NaN\./,
    );
    expect(() => tileAnimationUpdate.update(-1)).toThrow(
      /time for GID 11 in mapId "standard" must be a finite non-negative number of milliseconds; received -1\./,
    );
  });
});
