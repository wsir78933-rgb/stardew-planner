import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const startupCursorAtlasPath =
  "public/planner-textures/initial/Cursors-startup.webp";
type StartupCursorAtlasVerifierModule = Readonly<{
  assertUnmappedAtlasPixelsAreTransparent?: (
    atlasRgbaBytes: Buffer,
  ) => void;
}>;

describe("startup Cursor atlas artifact", () => {
  it("keeps the sparse atlas on the original 704x2256 texture surface", () => {
    const webpInfo = execFileSync("webpinfo", [startupCursorAtlasPath], {
      encoding: "utf8",
    });

    expect(webpInfo).toMatch(/^\s*Width:\s*704\s*$/m);
    expect(webpInfo).toMatch(/^\s*Height:\s*2256\s*$/m);
    expect(webpInfo).toMatch(/^\s*Alpha:\s*1\s*$/m);
    expect(webpInfo).toMatch(/^\s*Format:\s*Lossless\b/m);
  });

  it("rejects an unmapped pixel with non-zero RGB even when alpha is zero", async () => {
    const verifierModule = await import(
      new URL(
        "../../scripts/verify-startup-cursor-atlas.mjs",
        import.meta.url,
      ).href,
    ) as StartupCursorAtlasVerifierModule;
    const assertUnmappedAtlasPixelsAreTransparent =
      verifierModule.assertUnmappedAtlasPixelsAreTransparent;

    expect(assertUnmappedAtlasPixelsAreTransparent).toBeTypeOf("function");
    if (assertUnmappedAtlasPixelsAreTransparent === undefined) {
      return;
    }

    const malformedAtlasRgba = Buffer.alloc(704 * 2256 * 4);
    malformedAtlasRgba.set([255, 0, 0, 0], 0);

    expect(() => assertUnmappedAtlasPixelsAreTransparent(malformedAtlasRgba))
      .toThrow(/x=0, y=0.*\[255, 0, 0, 0\]/);
  });
});
