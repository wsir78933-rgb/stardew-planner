import { describe, expect, it } from "vitest";
import {
  assertBedTerrainCollisionMask,
  getBedPlacementSemantics,
} from "../../src/placement/bed-placement-semantics";

describe("bed placement semantics", () => {
  it.each([
    {
      bedType: "single" as const,
      footprint: { width: 2, height: 3 },
      collisionMask: [
        [false, false],
        [true, true],
        [true, true],
      ],
      exitOffsets: [
        { x: -1, y: 1 },
        { x: 2, y: 1 },
      ],
    },
    {
      bedType: "double" as const,
      footprint: { width: 3, height: 3 },
      collisionMask: [
        [false, false, false],
        [true, true, true],
        [true, true, true],
      ],
      exitOffsets: [{ x: -1, y: 1 }],
    },
    {
      bedType: "child" as const,
      footprint: { width: 2, height: 3 },
      collisionMask: [
        [false, false],
        [true, true],
        [true, true],
      ],
      exitOffsets: [],
    },
  ])(
    "returns the frozen terrain mask and exit offsets for $bedType beds",
    ({ bedType, footprint, collisionMask, exitOffsets }) => {
      expect(
        getBedPlacementSemantics({ bedType, footprint, rotation: 0 }),
      ).toEqual({ collisionMask, exitOffsets });
    },
  );

  it("fails fast with the received invalid bed type, rotation, and footprint", () => {
    expect(() =>
      getBedPlacementSemantics({
        bedType: "queen" as "single",
        footprint: { width: 2, height: 3 },
        rotation: 0,
      }),
    ).toThrow('bedType must be one of "single", "double", or "child"; received "queen"');
    expect(() =>
      getBedPlacementSemantics({
        bedType: "single",
        footprint: { width: 2, height: 3 },
        rotation: 1,
      }),
    ).toThrow("bed rotation must be 0; received 1");
    expect(() =>
      getBedPlacementSemantics({
        bedType: "double",
        footprint: { width: 2, height: 3 },
        rotation: 0,
      }),
    ).toThrow(
      "double bed footprint must be 3 by 3; received width 2, height 3",
    );
  });

  it("fails fast with the received invalid terrain collision mask", () => {
    expect(() =>
      assertBedTerrainCollisionMask(
        "single",
        { width: 2, height: 3 },
        [
          [false, false],
          [true, false],
          [true, true],
        ],
      ),
    ).toThrow(
      "single bed terrain collision mask row 1 column 1 must be true; received false",
    );
    expect(() =>
      assertBedTerrainCollisionMask(
        "child",
        { width: 2, height: 3 },
        [[false, false], [true, true]],
      ),
    ).toThrow(
      "child bed terrain collision mask must contain 3 rows; received 2 rows",
    );
  });
});
