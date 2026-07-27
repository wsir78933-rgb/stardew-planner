import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const referenceRuntimeAssetDirectoryPath = path.join(
  process.cwd(),
  "public/_app/immutable/assets",
);

async function readFrozenReferenceRuntimeCss() {
  const referenceRuntimeAssetNames = await readdir(
    referenceRuntimeAssetDirectoryPath,
  );
  const referenceRuntimeCssSources = await Promise.all(
    referenceRuntimeAssetNames
      .filter((referenceRuntimeAssetName) =>
        referenceRuntimeAssetName.endsWith(".css"),
      )
      .map((referenceRuntimeCssAssetName) =>
        readFile(
          path.join(
            referenceRuntimeAssetDirectoryPath,
            referenceRuntimeCssAssetName,
          ),
          "utf8",
        ),
      ),
  );

  return referenceRuntimeCssSources.join("\n");
}

describe("reference runtime visual contract", () => {
  it("preserves the locked desktop catalog width and compact/mobile breakpoints", async () => {
    const frozenReferenceRuntimeCss = await readFrozenReferenceRuntimeCss();

    expect(frozenReferenceRuntimeCss).toContain("width:340px");
    expect(frozenReferenceRuntimeCss).toContain("max-width:1400px");
    expect(frozenReferenceRuntimeCss).toContain("max-width:640px");
  });
});
