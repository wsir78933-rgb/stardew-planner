import { describe, expect, it } from "vitest";
import { applyBuildingPaintToPixels } from "../../src/paint/building-paint-rendering";

describe("building paint rendering", () => {
  it("recolors each RGB paint-mask channel independently while preserving unmasked pixels", () => {
    const paintedPixels = applyBuildingPaintToPixels({
      buildingPixels: new Uint8ClampedArray([
        100, 100, 100, 255,
        100, 100, 100, 255,
        100, 100, 100, 255,
        40, 50, 60, 255,
      ]),
      maskPixels: new Uint8ClampedArray([
        255, 0, 0, 255,
        0, 255, 0, 255,
        0, 0, 255, 255,
        0, 0, 0, 255,
      ]),
      paintColors: {
        color1: "#ff0000",
        color2: "#00ff00",
        color3: "#0000ff",
      },
    });

    expect([...paintedPixels]).toEqual([
      200, 0, 0, 255,
      0, 200, 0, 255,
      0, 0, 200, 255,
      40, 50, 60, 255,
    ]);
  });

  it("rejects paint pixel arrays with incompatible lengths", () => {
    expect(() =>
      applyBuildingPaintToPixels({
        buildingPixels: new Uint8ClampedArray([0, 0, 0, 255]),
        maskPixels: new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255]),
        paintColors: {
          color1: "#ffffff",
          color2: "#ffffff",
          color3: "#ffffff",
        },
      }),
    ).toThrow("must have the same length");
  });
});
