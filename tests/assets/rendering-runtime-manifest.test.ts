import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderingSourceAssets } from "../../src/assets/rendering-source-manifest";
import {
  renderingRuntimeAssetEntries,
  renderingRuntimeAssetOutputPaths,
} from "../../src/assets/rendering-runtime-manifest";

describe("rendering runtime asset manifest", () => {
  it("provides the complete locked rendering output path set without source URLs", () => {
    expect(renderingRuntimeAssetEntries).toHaveLength(224);
    expect(renderingRuntimeAssetOutputPaths).toHaveLength(224);
    expect(new Set(renderingRuntimeAssetOutputPaths)).toHaveLength(224);
    expect(renderingRuntimeAssetOutputPaths).toEqual(
      renderingSourceAssets.map((sourceAsset) => sourceAsset.outputPath),
    );

    for (const renderingRuntimeAssetEntry of renderingRuntimeAssetEntries) {
      expect(renderingRuntimeAssetEntry).not.toHaveProperty("sourceUrl");
      expect(JSON.stringify(renderingRuntimeAssetEntry)).not.toContain(
        "assets.stardewplan.com",
      );
    }
  });

  it("keeps the runtime tilesheet resolver independent from the build-time source manifest", async () => {
    const resolverSourceFilePath = path.join(
      process.cwd(),
      "src/rendering/tilesheet-asset-resolver.ts",
    );
    const resolverSource = await readFile(resolverSourceFilePath, "utf8");

    expect(resolverSource).toContain("rendering-runtime-manifest");
    expect(resolverSource).not.toContain("rendering-source-manifest");
    expect(resolverSource).not.toContain("assets.stardewplan.com");
  });
});
