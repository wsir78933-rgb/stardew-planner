import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicPreviewSource } from "../src/assets/public-preview-source";
import { plannerMaps } from "../src/maps/map-catalog";
import { officialFarmTypes } from "../src/reference/official-farm-guides";

const workspaceDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectedPublicPreviewPairCount = 29;

export function collectPublicPreviewOutputPaths(): readonly string[] {
  const officialFarmPreviewOutputPaths = officialFarmTypes.map((farmType) => {
    const officialFarm = plannerMaps.find((plannerMap) => plannerMap.id === farmType);

    if (officialFarm === undefined) {
      throw new Error(`Official farm map must exist. Received farm type: ${JSON.stringify(farmType)}.`);
    }

    return officialFarm.previewOutputPath;
  });
  const communityPreviewOutputPaths = plannerMaps
    .filter(
      (plannerMap) =>
        plannerMap.category === "community-farm" ||
        plannerMap.category === "community-interior",
    )
    .map((plannerMap) => plannerMap.previewOutputPath);
  const publicPreviewOutputPaths = [
    ...officialFarmPreviewOutputPaths,
    ...communityPreviewOutputPaths,
  ];

  if (publicPreviewOutputPaths.length !== expectedPublicPreviewPairCount) {
    throw new Error(
      `Public preview set must contain ${String(expectedPublicPreviewPairCount)} paths. Received count: ${String(publicPreviewOutputPaths.length)}.`,
    );
  }

  return publicPreviewOutputPaths;
}

export function resolveSourcePngPath(previewOutputPath: string): string {
  return resolve(workspaceDirectory, "public/assets", previewOutputPath);
}

export function resolveDerivedWebpPath(previewOutputPath: string): string {
  const publicPreviewSource = createPublicPreviewSource(previewOutputPath);

  return resolve(workspaceDirectory, "public", publicPreviewSource.slice(1));
}

export function encodeLosslessWebp(
  sourcePngPath: string,
  derivedWebpPath: string,
): void {
  if (!existsSync(sourcePngPath)) {
    throw new Error(
      `Cannot encode missing source PNG. Source PNG path: ${JSON.stringify(sourcePngPath)}. Derived WebP path: ${JSON.stringify(derivedWebpPath)}.`,
    );
  }

  execFileSync("cwebp", [
    "-lossless",
    "-exact",
    "-m",
    "6",
    sourcePngPath,
    "-o",
    derivedWebpPath,
  ], { stdio: "pipe" });
}

export function generatePublicPreviewWebpFiles(): void {
  const previewOutputPaths = collectPublicPreviewOutputPaths();
  const publicPreviewPairs = previewOutputPaths.map((previewOutputPath) => ({
    sourcePngPath: resolveSourcePngPath(previewOutputPath),
    derivedWebpPath: resolveDerivedWebpPath(previewOutputPath),
  }));
  const derivedWebpPaths = publicPreviewPairs.map(
    (publicPreviewPair) => publicPreviewPair.derivedWebpPath,
  );

  if (new Set(derivedWebpPaths).size !== derivedWebpPaths.length) {
    throw new Error(
      `Public preview derived WebP paths must be unique. Received paths: ${JSON.stringify(derivedWebpPaths)}.`,
    );
  }

  for (const publicPreviewPair of publicPreviewPairs) {
    if (!existsSync(publicPreviewPair.sourcePngPath)) {
      throw new Error(
        `Cannot encode missing source PNG. Source PNG path: ${JSON.stringify(publicPreviewPair.sourcePngPath)}. Derived WebP path: ${JSON.stringify(publicPreviewPair.derivedWebpPath)}.`,
      );
    }
  }

  for (const publicPreviewPair of publicPreviewPairs) {
    mkdirSync(dirname(publicPreviewPair.derivedWebpPath), { recursive: true });
    encodeLosslessWebp(
      publicPreviewPair.sourcePngPath,
      publicPreviewPair.derivedWebpPath,
    );
  }

  const sourcePngBytes = publicPreviewPairs.reduce(
    (totalBytes, publicPreviewPair) =>
      totalBytes + statSync(publicPreviewPair.sourcePngPath).size,
    0,
  );
  const derivedWebpBytes = publicPreviewPairs.reduce(
    (totalBytes, publicPreviewPair) =>
      totalBytes + statSync(publicPreviewPair.derivedWebpPath).size,
    0,
  );

  process.stdout.write(
    `Generated ${String(publicPreviewPairs.length)} public preview lossless WebP files. Source bytes: ${String(sourcePngBytes)}. Derived bytes: ${String(derivedWebpBytes)}. Saved bytes: ${String(sourcePngBytes - derivedWebpBytes)}.\n`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generatePublicPreviewWebpFiles();
}
