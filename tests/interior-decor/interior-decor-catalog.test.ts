import { describe, expect, it } from "vitest";
import {
  interiorFlooringPatterns,
  interiorWallpaperPatterns,
  isInteriorDecorSupportedMapId,
} from "../../src/interior-decor/interior-decor-catalog";

describe("interior decor catalog", () => {
  it("lists every locked wallpaper and flooring pattern with the original IDs", () => {
    expect(interiorWallpaperPatterns).toHaveLength(138);
    expect(interiorFlooringPatterns).toHaveLength(97);
    expect(interiorWallpaperPatterns[0]).toMatchObject({
      id: "wp_0",
      kind: "wallpaper",
      patternId: "0",
    });
    expect(interiorWallpaperPatterns.at(-1)).toMatchObject({
      id: "wp_MoreWalls:25",
      kind: "wallpaper",
      patternId: "MoreWalls:25",
    });
    expect(interiorFlooringPatterns[0]).toMatchObject({
      id: "fl_0",
      kind: "flooring",
      patternId: "0",
    });
    expect(interiorFlooringPatterns.at(-1)).toMatchObject({
      id: "fl_MoreFloors:8",
      kind: "flooring",
      patternId: "MoreFloors:8",
    });
  });

  it("uses the exact original preview rectangles and locked local tilesheets", () => {
    expect(interiorWallpaperPatterns[17]).toMatchObject({
      textureLocalPath:
        "/game-assets/1.6.15/tilesheets/walls_and_floors.png",
      previewRect: { x: 16, y: 56, width: 16, height: 28 },
    });
    expect(interiorWallpaperPatterns.at(-1)).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/wallpapers_2.png",
      previewRect: { x: 144, y: 56, width: 16, height: 28 },
    });
    expect(interiorFlooringPatterns[87]).toMatchObject({
      textureLocalPath:
        "/game-assets/1.6.15/tilesheets/walls_and_floors.png",
      previewRect: { x: 224, y: 656, width: 28, height: 26 },
    });
    expect(interiorFlooringPatterns.at(-1)).toMatchObject({
      textureLocalPath: "/game-assets/1.6.15/tilesheets/floors_2.png",
      previewRect: { x: 0, y: 32, width: 28, height: 26 },
    });
  });

  it("matches competitor wallpaper and flooring selector maps", () => {
    const paperedMapIds = [
      "farmhouse-0",
      "farmhouse-1",
      "farmhouse-2",
      "shed",
      "big-shed",
      "slime-hutch",
      "island-farmhouse",
      "sve-winery",
      "sve-grandpas-shed-1",
      "sve-grandpas-shed-2",
    ];
    const unsupportedMapIds = [
      "standard",
      "farm-cave",
      "barn",
      "farmhouse-cellar",
    ];

    expect(paperedMapIds.filter(isInteriorDecorSupportedMapId)).toEqual(
      paperedMapIds,
    );
    expect(unsupportedMapIds.filter(isInteriorDecorSupportedMapId)).toEqual(
      [],
    );
  });
});
