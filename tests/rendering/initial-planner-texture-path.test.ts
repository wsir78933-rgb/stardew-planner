import { describe, expect, it } from "vitest";
import {
  resolveInitialPlannerTextureAssetPath,
} from "../../src/rendering/initial-planner-texture-path";

describe("initial planner texture paths", () => {
  it.each([
    {
      textureAssetPath:
        "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet.png",
      expectedTextureAssetPath:
        "/planner-textures/initial/spring_outdoorsTileSheet.webp",
    },
    {
      textureAssetPath:
        "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet2.png",
      expectedTextureAssetPath:
        "/planner-textures/initial/spring_outdoorsTileSheet2.webp",
    },
    {
      textureAssetPath: "/game-assets/1.6.15/sprites/springobjects.png",
      expectedTextureAssetPath: "/planner-textures/initial/springobjects.webp",
    },
    {
      textureAssetPath: "/game-assets/1.6.15/sprites/Cursors.png",
      expectedTextureAssetPath: "/planner-textures/initial/Cursors.webp",
    },
  ])(
    "resolves verified startup texture $textureAssetPath to $expectedTextureAssetPath",
    ({ expectedTextureAssetPath, textureAssetPath }) => {
      expect(resolveInitialPlannerTextureAssetPath(textureAssetPath)).toBe(
        expectedTextureAssetPath,
      );
    },
  );

  it.each([
    "/game-assets/1.6.15/tilesheets/winter_outdoorsTileSheet.png",
    "/game-assets/1.6.15/tilesheets/paths.png",
    "/game-assets/1.6.15/tilesheets/spring_outdoorTileSheet_extra.png",
  ])("preserves non-whitelisted texture path %s exactly", (textureAssetPath) => {
    expect(resolveInitialPlannerTextureAssetPath(textureAssetPath)).toBe(
      textureAssetPath,
    );
  });

  it("rejects an invalid received texture path", () => {
    expect(() => resolveInitialPlannerTextureAssetPath("")).toThrow(
      /texture asset path.*""/i,
    );
  });
});
