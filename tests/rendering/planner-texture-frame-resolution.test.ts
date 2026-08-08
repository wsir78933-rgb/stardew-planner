import { describe, expect, it } from "vitest";
import {
  resolvePlannerTextureFrame,
  type PlannerTextureFrame,
} from "../../src/rendering/planner-texture-frame-resolution";

const cursorLockedTexturePath = "/game-assets/1.6.15/sprites/Cursors.png";

describe("planner texture frame resolution", () => {
  it("maps every approved Cursors source frame to its exact startup-atlas frame", () => {
    const approvedFrameMappings = [
      {
        sourceFrame: { x: 134, y: 226, width: 30, height: 25 },
        resolvedFrame: { x: 0, y: 0, width: 30, height: 25 },
      },
      {
        sourceFrame: { x: 656, y: 394, width: 16, height: 16 },
        resolvedFrame: { x: 30, y: 0, width: 16, height: 16 },
      },
      {
        sourceFrame: { x: 672, y: 394, width: 16, height: 16 },
        resolvedFrame: { x: 46, y: 0, width: 16, height: 16 },
      },
      {
        sourceFrame: { x: 688, y: 394, width: 16, height: 16 },
        resolvedFrame: { x: 62, y: 0, width: 16, height: 16 },
      },
    ] as const satisfies ReadonlyArray<Readonly<{
      sourceFrame: PlannerTextureFrame;
      resolvedFrame: PlannerTextureFrame;
    }>>;

    for (const { resolvedFrame, sourceFrame } of approvedFrameMappings) {
      expect(resolvePlannerTextureFrame(cursorLockedTexturePath, sourceFrame)).toEqual({
        resolvedAssetPath: "/planner-textures/initial/Cursors-startup.webp",
        resolvedFrame,
      });
    }
  });

  it("keeps a non-startup Cursors frame on the complete WebP with unchanged coordinates", () => {
    const sourceFrame = { x: 276, y: 1985, width: 12, height: 11 };

    expect(resolvePlannerTextureFrame(cursorLockedTexturePath, sourceFrame)).toEqual({
      resolvedAssetPath: "/planner-textures/initial/Cursors.webp",
      resolvedFrame: sourceFrame,
    });
  });

  it("preserves a non-Cursors frame through the existing initial path resolver", () => {
    const sourceFrame = { x: 64, y: 608, width: 16, height: 16 };

    expect(resolvePlannerTextureFrame(
      "/game-assets/1.6.15/sprites/springobjects.png",
      sourceFrame,
    )).toEqual({
      resolvedAssetPath: "/planner-textures/initial/springobjects.webp",
      resolvedFrame: sourceFrame,
    });
  });

  it("preserves a null full-texture frame", () => {
    expect(resolvePlannerTextureFrame(cursorLockedTexturePath, null)).toEqual({
      resolvedAssetPath: "/planner-textures/initial/Cursors.webp",
      resolvedFrame: null,
    });
  });

  it("rejects malformed explicit frames with the locked path and received values", () => {
    const malformedFrames: ReadonlyArray<Readonly<{
      receivedFrame: unknown;
      expectedMessageFragments: readonly string[];
    }>> = [
      {
        receivedFrame: undefined,
        expectedMessageFragments: ["received frame undefined", "x=undefined"],
      },
      {
        receivedFrame: "not-a-frame",
        expectedMessageFragments: ['received frame "not-a-frame"', "x=undefined"],
      },
      {
        receivedFrame: [],
        expectedMessageFragments: ["received frame []", "x=undefined"],
      },
      {
        receivedFrame: {},
        expectedMessageFragments: ["received frame [object Object]", "x=undefined"],
      },
      {
        receivedFrame: { x: 1 },
        expectedMessageFragments: ["x=1", "y=undefined", "width=undefined", "height=undefined"],
      },
      {
        receivedFrame: { x: -1, y: 0, width: 1, height: 1 },
        expectedMessageFragments: ["x=-1"],
      },
      {
        receivedFrame: { x: Number.NaN, y: 0, width: 1, height: 1 },
        expectedMessageFragments: ["x=NaN"],
      },
      {
        receivedFrame: { x: 0, y: 1.5, width: 1, height: 1 },
        expectedMessageFragments: ["y=1.5"],
      },
      {
        receivedFrame: { x: 0, y: 0, width: 0, height: 1 },
        expectedMessageFragments: ["width=0"],
      },
      {
        receivedFrame: { x: 0, y: 0, width: 1, height: Infinity },
        expectedMessageFragments: ["height=Infinity"],
      },
    ];

    for (const { expectedMessageFragments, receivedFrame } of malformedFrames) {
      let thrownError: unknown;

      try {
        resolvePlannerTextureFrame(
          cursorLockedTexturePath,
          receivedFrame as PlannerTextureFrame,
        );
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).toBeInstanceOf(TypeError);

      const errorMessage = (thrownError as Error).message;
      expect(errorMessage).toContain(cursorLockedTexturePath);

      for (const expectedMessageFragment of expectedMessageFragments) {
        expect(errorMessage).toContain(expectedMessageFragment);
      }
    }
  });
});
