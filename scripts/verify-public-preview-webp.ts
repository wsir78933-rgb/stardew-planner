import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicPreviewSource } from "../src/assets/public-preview-source";
import { plannerMaps } from "../src/maps/map-catalog";
import { officialFarmTypes } from "../src/reference/official-farm-guides";

const workspaceDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectedPublicPreviewPairCount = 29;
const maximumDerivativeBytes = 4_096_433;
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

type ImageDimensions = Readonly<{ width: number; height: number }>;

type PublicPreviewPair = Readonly<{
  sourcePngPath: string;
  derivedWebpPath: string;
}>;

function collectPublicPreviewPairs(): readonly PublicPreviewPair[] {
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
  const previewOutputPaths = [
    ...officialFarmPreviewOutputPaths,
    ...communityPreviewOutputPaths,
  ];

  if (previewOutputPaths.length !== expectedPublicPreviewPairCount) {
    throw new Error(
      `Public preview set must contain ${String(expectedPublicPreviewPairCount)} paths. Received count: ${String(previewOutputPaths.length)}.`,
    );
  }

  return previewOutputPaths.map((previewOutputPath) => ({
    sourcePngPath: resolve(workspaceDirectory, "public/assets", previewOutputPath),
    derivedWebpPath: resolve(
      workspaceDirectory,
      "public",
      createPublicPreviewSource(previewOutputPath).slice(1),
    ),
  }));
}

function requireRegularFile(filePath: string, fileDescription: string): number {
  if (!existsSync(filePath)) {
    throw new Error(`Required ${fileDescription} does not exist. Received path: ${JSON.stringify(filePath)}.`);
  }

  const fileStats = statSync(filePath);

  if (!fileStats.isFile() || fileStats.size === 0) {
    throw new Error(`Required ${fileDescription} must be a non-empty file. Received path: ${JSON.stringify(filePath)}. Received bytes: ${String(fileStats.size)}.`);
  }

  return fileStats.size;
}

function readPngDimensions(sourcePngPath: string): ImageDimensions {
  const sourcePngContents = readFileSync(sourcePngPath);

  if (sourcePngContents.length < 24 || !sourcePngContents.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`Source PNG must contain a PNG signature and IHDR dimensions. Received path: ${JSON.stringify(sourcePngPath)}. Received bytes: ${String(sourcePngContents.length)}.`);
  }
  if (sourcePngContents.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error(`Source PNG must use IHDR as its first chunk. Received path: ${JSON.stringify(sourcePngPath)}. Received chunk: ${JSON.stringify(sourcePngContents.toString("ascii", 12, 16))}.`);
  }

  const width = sourcePngContents.readUInt32BE(16);
  const height = sourcePngContents.readUInt32BE(20);

  if (width === 0 || height === 0) {
    throw new Error(`Source PNG dimensions must be positive. Received path: ${JSON.stringify(sourcePngPath)}. Received dimensions: ${String(width)}x${String(height)}.`);
  }

  return { width, height };
}

function requireLosslessWebp(derivedWebpPath: string): ImageDimensions {
  const webpInfo = execFileSync("webpinfo", [derivedWebpPath], { encoding: "utf8" });

  if (!/^\s*Chunk VP8L at/m.test(webpInfo)) {
    throw new Error(`Derived WebP must contain VP8L lossless data. Received path: ${JSON.stringify(derivedWebpPath)}. Received webpinfo: ${JSON.stringify(webpInfo)}.`);
  }

  const width = readWebpInfoInteger(webpInfo, "Width", derivedWebpPath);
  const height = readWebpInfoInteger(webpInfo, "Height", derivedWebpPath);

  return { width, height };
}

function readWebpInfoInteger(webpInfo: string, fieldName: string, derivedWebpPath: string): number {
  const fieldMatch = webpInfo.match(new RegExp(`^\\s*${fieldName}:\\s*(\\d+)\\s*$`, "m"));

  if (fieldMatch?.[1] === undefined) {
    throw new Error(`Derived WebP webpinfo must include ${fieldName}. Received path: ${JSON.stringify(derivedWebpPath)}. Received webpinfo: ${JSON.stringify(webpInfo)}.`);
  }

  return Number.parseInt(fieldMatch[1], 10);
}

function decodeImageToRgba(imagePath: string): Buffer {
  return execFileSync(
    "ffmpeg",
    ["-v", "error", "-i", imagePath, "-f", "rawvideo", "-pix_fmt", "rgba", "-"],
    { encoding: "buffer", maxBuffer: 64 * 1024 * 1024 },
  );
}

function verifyPublicPreviewPair(publicPreviewPair: PublicPreviewPair): {
  sourcePngBytes: number;
  derivedWebpBytes: number;
} {
  const sourcePngBytes = requireRegularFile(publicPreviewPair.sourcePngPath, "source PNG");
  const derivedWebpBytes = requireRegularFile(publicPreviewPair.derivedWebpPath, "derived WebP");

  if (derivedWebpBytes >= sourcePngBytes) {
    throw new Error(`Derived WebP must be smaller than its source PNG. Source PNG path: ${JSON.stringify(publicPreviewPair.sourcePngPath)}. Source bytes: ${String(sourcePngBytes)}. Derived WebP path: ${JSON.stringify(publicPreviewPair.derivedWebpPath)}. Derived bytes: ${String(derivedWebpBytes)}.`);
  }

  const sourcePngDimensions = readPngDimensions(publicPreviewPair.sourcePngPath);
  const derivedWebpDimensions = requireLosslessWebp(publicPreviewPair.derivedWebpPath);

  if (
    sourcePngDimensions.width !== derivedWebpDimensions.width ||
    sourcePngDimensions.height !== derivedWebpDimensions.height
  ) {
    throw new Error(`Derived WebP dimensions must match source PNG dimensions. Source PNG path: ${JSON.stringify(publicPreviewPair.sourcePngPath)}. Source dimensions: ${String(sourcePngDimensions.width)}x${String(sourcePngDimensions.height)}. Derived WebP path: ${JSON.stringify(publicPreviewPair.derivedWebpPath)}. Derived dimensions: ${String(derivedWebpDimensions.width)}x${String(derivedWebpDimensions.height)}.`);
  }

  const sourcePngRgba = decodeImageToRgba(publicPreviewPair.sourcePngPath);
  const derivedWebpRgba = decodeImageToRgba(publicPreviewPair.derivedWebpPath);
  const expectedRgbaBytes = sourcePngDimensions.width * sourcePngDimensions.height * 4;

  if (sourcePngRgba.length !== expectedRgbaBytes || derivedWebpRgba.length !== expectedRgbaBytes) {
    throw new Error(`Decoded RGBA byte counts must match image dimensions. Source PNG path: ${JSON.stringify(publicPreviewPair.sourcePngPath)}. Source RGBA bytes: ${String(sourcePngRgba.length)}. Derived WebP path: ${JSON.stringify(publicPreviewPair.derivedWebpPath)}. Derived RGBA bytes: ${String(derivedWebpRgba.length)}. Expected RGBA bytes: ${String(expectedRgbaBytes)}.`);
  }

  const sourceRgbaHash = createHash("sha256").update(sourcePngRgba).digest("hex");
  const derivedRgbaHash = createHash("sha256").update(derivedWebpRgba).digest("hex");

  if (sourceRgbaHash !== derivedRgbaHash) {
    throw new Error(`Decoded RGBA SHA-256 values must match. Source PNG path: ${JSON.stringify(publicPreviewPair.sourcePngPath)}. Source SHA-256: ${sourceRgbaHash}. Derived WebP path: ${JSON.stringify(publicPreviewPair.derivedWebpPath)}. Derived SHA-256: ${derivedRgbaHash}.`);
  }

  return { sourcePngBytes, derivedWebpBytes };
}

export function verifyPublicPreviewWebpFiles(): void {
  const publicPreviewPairs = collectPublicPreviewPairs();
  const publicPreviewTotals = publicPreviewPairs.reduce(
    (totals, publicPreviewPair) => {
      const verifiedPair = verifyPublicPreviewPair(publicPreviewPair);

      return {
        sourcePngBytes: totals.sourcePngBytes + verifiedPair.sourcePngBytes,
        derivedWebpBytes: totals.derivedWebpBytes + verifiedPair.derivedWebpBytes,
      };
    },
    { sourcePngBytes: 0, derivedWebpBytes: 0 },
  );

  if (publicPreviewPairs.length !== expectedPublicPreviewPairCount) {
    throw new Error(`Verified public preview pair count must be ${String(expectedPublicPreviewPairCount)}. Received count: ${String(publicPreviewPairs.length)}.`);
  }
  if (publicPreviewTotals.derivedWebpBytes >= maximumDerivativeBytes) {
    throw new Error(`Public preview derivative total must be below ${String(maximumDerivativeBytes)} bytes. Received bytes: ${String(publicPreviewTotals.derivedWebpBytes)}.`);
  }

  process.stdout.write(`Verified ${String(publicPreviewPairs.length)} RGBA-identical public preview VP8L WebP files. Source bytes: ${String(publicPreviewTotals.sourcePngBytes)}. Derived bytes: ${String(publicPreviewTotals.derivedWebpBytes)}.\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  verifyPublicPreviewWebpFiles();
}
