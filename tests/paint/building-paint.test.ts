import { describe, expect, it } from "vitest";
import {
  getBuildingPaintDefinition,
  parseBuildingPaintDefinitions,
} from "../../src/paint/building-paint";

describe("building paint definitions", () => {
  it("parses locked PaintData channels for a paintable planner building", () => {
    const buildingPaintDefinitions = parseBuildingPaintDefinitions({
      "Big Shed": "Building/-45 -10/Roof/-20 5/Trim/-25 0",
      "Deluxe Coop": "Building/-25 0/Roof/-15 5/Trim/-25 0",
    });

    expect(buildingPaintDefinitions["Big Shed"]).toEqual({
      buildingId: "Big Shed",
      channels: [
        { id: "color1", label: "Building", minimumLight: -45, maximumLight: -10 },
        { id: "color2", label: "Roof", minimumLight: -20, maximumLight: 5 },
        { id: "color3", label: "Trim", minimumLight: -25, maximumLight: 0 },
      ],
      paintMaskLocalPath: "/game-assets/1.6.15/buildings/Big Shed_PaintMask.png",
    });
  });

  it("returns no definition for a building without a locked paint mask", () => {
    expect(
      getBuildingPaintDefinition("Barn", {
        Barn: "Building/-25 0/Roof/-15 5/Trim/-25 0",
      }),
    ).toBeNull();
  });

  it("fails fast for malformed PaintData channel values", () => {
    expect(() =>
      parseBuildingPaintDefinitions({
        "Big Shed": "Building/not-a-range",
      }),
    ).toThrow('PaintData building "Big Shed" channel "Building"');
  });
});
