import { existsSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { createPublicPreviewSource } from "../../src/assets/public-preview-source";
import { plannerMaps } from "../../src/maps/map-catalog";
import { officialFarmTypes } from "../../src/reference/official-farm-guides";

const workspaceDirectory = resolve(import.meta.dirname, "../..");
const publicPreviewDirectory = resolve(
  workspaceDirectory,
  "public/public-previews/1.6.15",
);

function collectPublicPreviewOutputPaths(): readonly string[] {
  const officialFarmPreviewPaths = officialFarmTypes.map((farmType) => {
    const officialFarm = plannerMaps.find((plannerMap) => plannerMap.id === farmType);

    if (officialFarm === undefined) {
      throw new Error(`Official farm map must exist. Received farm type: ${JSON.stringify(farmType)}.`);
    }

    return officialFarm.previewOutputPath;
  });
  const communityPreviewPaths = plannerMaps
    .filter(
      (plannerMap) =>
        plannerMap.category === "community-farm" ||
        plannerMap.category === "community-interior",
    )
    .map((plannerMap) => plannerMap.previewOutputPath);

  return [...officialFarmPreviewPaths, ...communityPreviewPaths];
}

function collectPublicPreviewFilePaths(
  directoryPath: string,
): readonly string[] {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap(
    (directoryEntry) => {
      const entryPath = resolve(directoryPath, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        return collectPublicPreviewFilePaths(entryPath);
      }
      if (directoryEntry.isFile()) {
        return [entryPath];
      }

      throw new Error(
        `Public preview directory must contain only regular files and directories. Received path: ${JSON.stringify(entryPath)}.`,
      );
    },
  );
}

describe("public preview WebP derivatives", () => {
  it("provides an exact, unique 29-file public preview set", () => {
    const publicPreviewOutputPaths = collectPublicPreviewOutputPaths();
    const officialFarmPreviewPaths = publicPreviewOutputPaths.slice(0, officialFarmTypes.length);
    const communityPreviewPaths = publicPreviewOutputPaths.slice(officialFarmTypes.length);
    const publicPreviewSources = publicPreviewOutputPaths.map(createPublicPreviewSource);

    expect(officialFarmPreviewPaths).toHaveLength(8);
    expect(communityPreviewPaths).toHaveLength(21);
    expect(publicPreviewOutputPaths).toHaveLength(29);
    expect(new Set(publicPreviewSources).size).toBe(29);
    expect(publicPreviewSources.every((publicPreviewSource) => publicPreviewSource.endsWith(".webp"))).toBe(true);

    const expectedDerivedRelativePaths = publicPreviewSources
      .map((publicPreviewSource) =>
        publicPreviewSource.slice("/public-previews/1.6.15/".length),
      )
      .sort();
    const actualDerivedRelativePaths = collectPublicPreviewFilePaths(
      publicPreviewDirectory,
    )
      .map((filePath) => relative(publicPreviewDirectory, filePath))
      .sort();

    expect(actualDerivedRelativePaths.every((filePath) => filePath.endsWith(".webp"))).toBe(true);
    expect(actualDerivedRelativePaths).toEqual(expectedDerivedRelativePaths);

    for (const publicPreviewSource of publicPreviewSources) {
      const derivedWebpPath = resolve(
        workspaceDirectory,
        "public",
        publicPreviewSource.slice(1),
      );

      expect(
        existsSync(derivedWebpPath),
        `Expected generated public preview WebP at ${JSON.stringify(derivedWebpPath)}.`,
      ).toBe(true);
    }
  });

  it("does not execute the verifier when it is imported", async () => {
    vi.resetModules();
    const standardOutputWrite = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);

    const verifierModule = await import(
      "../../scripts/verify-public-preview-webp"
    );

    expect(verifierModule.verifyPublicPreviewWebpFiles).toEqual(
      expect.any(Function),
    );
    expect(standardOutputWrite).not.toHaveBeenCalled();
    standardOutputWrite.mockRestore();
  });
});
