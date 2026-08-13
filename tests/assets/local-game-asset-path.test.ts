import { describe, expect, it } from "vitest";
import {
  resolveLocalGameAssetPath,
} from "../../src/assets/local-game-asset-path";

describe("local game asset path", () => {
  it.each([
    {
      assetOutputPath: "sprites/Cursors.png",
      expectedLocalPath: "/game-assets/1.6.15/sprites/Cursors.png",
    },
    {
      assetOutputPath: "tilesheets/craftables.png",
      expectedLocalPath: "/game-assets/1.6.15/tilesheets/craftables.png",
    },
  ])(
    "resolves $assetOutputPath below the locked source root",
    ({ assetOutputPath, expectedLocalPath }) => {
      expect(resolveLocalGameAssetPath(assetOutputPath)).toBe(expectedLocalPath);
    },
  );

  it.each(["", "/sprites/Cursors.png", "sprites\\Cursors.png", "../Cursors.png"])(
    "rejects an invalid relative asset output path %j",
    (assetOutputPath) => {
      expect(() => resolveLocalGameAssetPath(assetOutputPath)).toThrow(
        new RegExp(JSON.stringify(assetOutputPath).replaceAll("\\", "\\\\")),
      );
    },
  );
});
