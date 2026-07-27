import { describe, expect, it } from "vitest";
import {
  createMapScreenshotDimensions,
  getMapScreenshotFooterHeight,
} from "../../src/rendering/map-screenshot";

describe("map screenshot", () => {
  it("creates original-pixel 1x and HQ 2x screenshot dimensions", () => {
    expect(
      createMapScreenshotDimensions({
        mapHeight: 65,
        mapWidth: 120,
        resolution: 1,
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual({ height: 1040, width: 1920 });
    expect(
      createMapScreenshotDimensions({
        mapHeight: 65,
        mapWidth: 120,
        resolution: 2,
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toEqual({ height: 2080, width: 3840 });
    expect(getMapScreenshotFooterHeight(1040)).toBe(31);
    expect(getMapScreenshotFooterHeight(400)).toBe(24);
  });

  it("rejects invalid capture geometry and resolution at the renderer boundary", () => {
    expect(() =>
      createMapScreenshotDimensions({
        mapHeight: 65,
        mapWidth: 120,
        resolution: 3,
        tileHeight: 16,
        tileWidth: 16,
      }),
    ).toThrow("Map screenshot resolution must be 1 or 2; received 3");
    expect(() => getMapScreenshotFooterHeight(0)).toThrow(
      "Map screenshot height must be a positive safe integer; received 0",
    );
  });
});
