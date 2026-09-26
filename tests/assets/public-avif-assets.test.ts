import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../..");
const publicImageDirectories = [
  "public/homepage",
  "public/blog",
] as const;
const publicPreviewDirectory = "public/public-previews/1.6.15";

function collectWebpRelativePaths(directoryPath: string): string[] {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap(
    (directoryEntry) => {
      const entryPath = resolve(directoryPath, directoryEntry.name);

      if (directoryEntry.isDirectory()) {
        return collectWebpRelativePaths(entryPath);
      }

      if (directoryEntry.isFile() && entryPath.endsWith(".webp")) {
        return [relative(projectRoot, entryPath)];
      }

      if (directoryEntry.isFile()) {
        return [];
      }

      throw new Error(
        `Public image directory must contain only regular files and directories. Received path: ${JSON.stringify(entryPath)}.`,
      );
    },
  );
}

function readAvifHeader(relativeImagePath: string): Buffer {
  const avifRelativePath = relativeImagePath.replace(/\.webp$/, ".avif");
  const avifAbsolutePath = resolve(projectRoot, avifRelativePath);

  if (!existsSync(avifAbsolutePath)) {
    throw new Error(`Expected AVIF derivative at ${JSON.stringify(avifRelativePath)}.`);
  }

  const avifBytes = readFileSync(avifAbsolutePath);
  if (avifBytes.length === 0) {
    throw new Error(`AVIF derivative is empty at ${JSON.stringify(avifRelativePath)}.`);
  }

  return avifBytes.subarray(0, 64);
}

describe("public AVIF derivatives", () => {
  it("provides AVIF derivatives for every opaque public WebP image", () => {
    const webpRelativePaths = publicImageDirectories
      .flatMap((directory) => collectWebpRelativePaths(resolve(projectRoot, directory)))
      .sort();
    const opaqueWebpRelativePaths = webpRelativePaths;

    expect(opaqueWebpRelativePaths).toHaveLength(79);
    for (const relativeImagePath of opaqueWebpRelativePaths) {
      const avifHeader = readAvifHeader(relativeImagePath);
      expect(avifHeader.includes(Buffer.from("ftypavif"))).toBe(true);
      expect(
        statSync(resolve(projectRoot, relativeImagePath.replace(/\.webp$/, ".avif"))).size,
      ).toBeGreaterThan(0);
    }
  });

  it("keeps compact and transparent public previews on their WebP path", () => {
    const publicPreviewWebpRelativePaths = collectWebpRelativePaths(
      resolve(projectRoot, publicPreviewDirectory),
    );

    expect(publicPreviewWebpRelativePaths).toHaveLength(29);
    for (const relativeImagePath of publicPreviewWebpRelativePaths) {
      expect(existsSync(resolve(projectRoot, relativeImagePath))).toBe(true);
      expect(
        existsSync(resolve(projectRoot, relativeImagePath.replace(/\.webp$/, ".avif"))),
      ).toBe(false);
    }
  });
});
