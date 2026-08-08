import { spawn } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { STARTUP_CURSOR_ATLAS_CONTRACT } from "./startup-cursor-atlas-contract.mjs";

const workspaceDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sourcePngPath = resolve(
  workspaceDirectory,
  STARTUP_CURSOR_ATLAS_CONTRACT.sourcePngRelativePath,
);
const completeWebpPath = resolve(
  workspaceDirectory,
  STARTUP_CURSOR_ATLAS_CONTRACT.completeWebpRelativePath,
);
const atlasWebpPath = resolve(
  workspaceDirectory,
  STARTUP_CURSOR_ATLAS_CONTRACT.atlasWebpRelativePath,
);
const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

await verifyStartupCursorAtlas();

export async function verifyStartupCursorAtlas() {
  const requiredFiles = await assertRequiredFiles();
  const sourcePngDimensions = readPngDimensions(
    requiredFiles.sourcePngContents,
    sourcePngPath,
  );

  assertSourceDimensions(sourcePngDimensions);
  await assertAtlasWebpContract();
  assertAtlasSmallerThanCompleteWebp(
    requiredFiles.atlasWebpFileSize,
    requiredFiles.completeWebpFileSize,
  );
  await assertMappedRegionsMatchDecodedSourceRgba();
  await assertUnmappedAtlasPixelsAreTransparent();

  process.stdout.write(
    `Verified startup Cursor atlas at ${JSON.stringify(atlasWebpPath)}: 78x25 exact-lossless WebP with four RGBA-identical frames.\n`,
  );
}

async function assertRequiredFiles() {
  const [
    sourcePngFileSize,
    completeWebpFileSize,
    atlasWebpFileSize,
    sourcePngContents,
  ] = await Promise.all([
    getRequiredFileSize(sourcePngPath, "startup Cursor source PNG"),
    getRequiredFileSize(completeWebpPath, "complete Cursor WebP"),
    getRequiredFileSize(atlasWebpPath, "startup Cursor atlas WebP"),
    readRequiredFile(sourcePngPath, "startup Cursor source PNG"),
  ]);

  return {
    sourcePngContents,
    sourcePngFileSize,
    completeWebpFileSize,
    atlasWebpFileSize,
  };
}

async function getRequiredFileSize(filePath, fileDescription) {
  let fileStats;

  try {
    fileStats = await stat(filePath);
  } catch (fileStatError) {
    throw new Error(
      `Required ${fileDescription} file does not exist at ${JSON.stringify(filePath)}.`,
      { cause: fileStatError },
    );
  }

  if (!fileStats.isFile()) {
    throw new Error(
      `Required ${fileDescription} path must be a file. Received path: ${JSON.stringify(filePath)}.`,
    );
  }

  if (fileStats.size === 0) {
    throw new Error(
      `Required ${fileDescription} file must not be empty. Received path: ${JSON.stringify(filePath)}. Received byte size: ${String(fileStats.size)}.`,
    );
  }

  return fileStats.size;
}

async function readRequiredFile(filePath, fileDescription) {
  try {
    return await readFile(filePath);
  } catch (fileReadError) {
    throw new Error(
      `Could not read required ${fileDescription} file at ${JSON.stringify(filePath)}.`,
      { cause: fileReadError },
    );
  }
}

function readPngDimensions(sourcePngContents, sourcePngFilePath) {
  if (sourcePngContents.length < 24) {
    throw new Error(
      `Startup Cursor source PNG must include its signature and IHDR dimensions. Source path: ${JSON.stringify(sourcePngFilePath)}. Received byte size: ${String(sourcePngContents.length)}.`,
    );
  }

  if (!sourcePngContents.subarray(0, pngSignature.length).equals(pngSignature)) {
    throw new Error(
      `Startup Cursor source PNG must start with the PNG signature. Source path: ${JSON.stringify(sourcePngFilePath)}. Received leading bytes: ${JSON.stringify([...sourcePngContents.subarray(0, pngSignature.length)])}.`,
    );
  }

  const firstChunkType = sourcePngContents.toString("ascii", 12, 16);

  if (firstChunkType !== "IHDR") {
    throw new Error(
      `Startup Cursor source PNG must contain IHDR as its first chunk. Source path: ${JSON.stringify(sourcePngFilePath)}. Received first chunk type: ${JSON.stringify(firstChunkType)}.`,
    );
  }

  return {
    width: sourcePngContents.readUInt32BE(16),
    height: sourcePngContents.readUInt32BE(20),
  };
}

function assertSourceDimensions(receivedSourceDimensions) {
  const expectedSourceDimensions =
    STARTUP_CURSOR_ATLAS_CONTRACT.sourceDimensions;

  if (
    receivedSourceDimensions.width !== expectedSourceDimensions.width ||
    receivedSourceDimensions.height !== expectedSourceDimensions.height
  ) {
    throw new Error(
      `Startup Cursor source PNG dimensions must match the atlas contract. Source path: ${JSON.stringify(sourcePngPath)}. Expected dimensions: ${String(expectedSourceDimensions.width)}x${String(expectedSourceDimensions.height)}. Received dimensions: ${String(receivedSourceDimensions.width)}x${String(receivedSourceDimensions.height)}.`,
    );
  }
}

async function assertAtlasWebpContract() {
  const atlasWebpInfo = await runCommand("webpinfo", [atlasWebpPath]);
  const atlasWebpWidth = readWebpInfoInteger(atlasWebpInfo, "Width");
  const atlasWebpHeight = readWebpInfoInteger(atlasWebpInfo, "Height");
  const atlasWebpAlpha = readWebpInfoInteger(atlasWebpInfo, "Alpha");
  const expectedAtlasDimensions = STARTUP_CURSOR_ATLAS_CONTRACT.atlasDimensions;

  if (!/^\s*Format:\s*Lossless\b/m.test(atlasWebpInfo)) {
    throw new Error(
      `Startup Cursor atlas WebP must use lossless encoding. Atlas path: ${JSON.stringify(atlasWebpPath)}. Received webpinfo output: ${JSON.stringify(atlasWebpInfo)}.`,
    );
  }

  if (atlasWebpAlpha !== 1) {
    throw new Error(
      `Startup Cursor atlas WebP must preserve an alpha channel. Atlas path: ${JSON.stringify(atlasWebpPath)}. Received Alpha: ${String(atlasWebpAlpha)}.`,
    );
  }

  if (
    atlasWebpWidth !== expectedAtlasDimensions.width ||
    atlasWebpHeight !== expectedAtlasDimensions.height
  ) {
    throw new Error(
      `Startup Cursor atlas WebP dimensions must match the atlas contract. Atlas path: ${JSON.stringify(atlasWebpPath)}. Expected dimensions: ${String(expectedAtlasDimensions.width)}x${String(expectedAtlasDimensions.height)}. Received dimensions: ${String(atlasWebpWidth)}x${String(atlasWebpHeight)}.`,
    );
  }
}

function readWebpInfoInteger(webpInfoOutput, fieldName) {
  const fieldMatch = webpInfoOutput.match(
    new RegExp(`^\\s*${fieldName}:\\s*(\\d+)\\s*$`, "m"),
  );

  if (fieldMatch?.[1] === undefined) {
    throw new Error(
      `Startup Cursor atlas webpinfo output must include ${fieldName}. Atlas path: ${JSON.stringify(atlasWebpPath)}. Received webpinfo output: ${JSON.stringify(webpInfoOutput)}.`,
    );
  }

  return Number.parseInt(fieldMatch[1], 10);
}

function assertAtlasSmallerThanCompleteWebp(
  atlasWebpFileSize,
  completeWebpFileSize,
) {
  if (atlasWebpFileSize >= completeWebpFileSize) {
    throw new Error(
      `Startup Cursor atlas WebP must be smaller than the complete Cursor WebP. Atlas path: ${JSON.stringify(atlasWebpPath)}. Atlas bytes: ${String(atlasWebpFileSize)}. Complete path: ${JSON.stringify(completeWebpPath)}. Complete bytes: ${String(completeWebpFileSize)}.`,
    );
  }
}

async function assertMappedRegionsMatchDecodedSourceRgba() {
  const [sourcePngRgbaBytes, atlasWebpRgbaBytes] = await Promise.all([
    decodeImageToRgba(sourcePngPath),
    decodeImageToRgba(atlasWebpPath),
  ]);

  assertDecodedRgbaByteLength(
    sourcePngRgbaBytes,
    STARTUP_CURSOR_ATLAS_CONTRACT.sourceDimensions,
    "startup Cursor source PNG",
    sourcePngPath,
  );
  assertDecodedRgbaByteLength(
    atlasWebpRgbaBytes,
    STARTUP_CURSOR_ATLAS_CONTRACT.atlasDimensions,
    "startup Cursor atlas WebP",
    atlasWebpPath,
  );

  for (const frameContract of STARTUP_CURSOR_ATLAS_CONTRACT.frames) {
    assertFrameRgbaMatches(sourcePngRgbaBytes, atlasWebpRgbaBytes, frameContract);
  }
}

async function assertUnmappedAtlasPixelsAreTransparent() {
  const atlasRgbaBytes = await decodeImageToRgba(atlasWebpPath);

  assertDecodedRgbaByteLength(
    atlasRgbaBytes,
    STARTUP_CURSOR_ATLAS_CONTRACT.atlasDimensions,
    "startup Cursor atlas WebP",
    atlasWebpPath,
  );

  const { width, height } = STARTUP_CURSOR_ATLAS_CONTRACT.atlasDimensions;
  const coveredPixels = new Uint8Array(width * height);

  for (const frameContract of STARTUP_CURSOR_ATLAS_CONTRACT.frames) {
    for (
      let frameY = frameContract.atlas.y;
      frameY < frameContract.atlas.y + frameContract.atlas.height;
      frameY += 1
    ) {
      for (
        let frameX = frameContract.atlas.x;
        frameX < frameContract.atlas.x + frameContract.atlas.width;
        frameX += 1
      ) {
        coveredPixels[frameY * width + frameX] = 1;
      }
    }
  }

  for (let pixelIndex = 0; pixelIndex < coveredPixels.length; pixelIndex += 1) {
    const alphaByte = atlasRgbaBytes[pixelIndex * 4 + 3];

    if (coveredPixels[pixelIndex] === 0 && alphaByte !== 0) {
      throw new Error(
        `Startup Cursor atlas ${JSON.stringify(atlasWebpPath)} unmapped pixel ${String(pixelIndex)} must be transparent. Received alpha: ${String(alphaByte)}.`,
      );
    }
  }
}

function extractRgbaRegion(rgbaBytes, imageWidth, frame) {
  const regionBytes = Buffer.alloc(frame.width * frame.height * 4);

  for (let regionY = 0; regionY < frame.height; regionY += 1) {
    const sourceStart = ((frame.y + regionY) * imageWidth + frame.x) * 4;
    const sourceEnd = sourceStart + frame.width * 4;
    rgbaBytes.copy(
      regionBytes,
      regionY * frame.width * 4,
      sourceStart,
      sourceEnd,
    );
  }

  return regionBytes;
}

function assertFrameRgbaMatches(
  sourceRgbaBytes,
  atlasRgbaBytes,
  frameContract,
) {
  const sourceRegion = extractRgbaRegion(
    sourceRgbaBytes,
    STARTUP_CURSOR_ATLAS_CONTRACT.sourceDimensions.width,
    frameContract.source,
  );
  const atlasRegion = extractRgbaRegion(
    atlasRgbaBytes,
    STARTUP_CURSOR_ATLAS_CONTRACT.atlasDimensions.width,
    frameContract.atlas,
  );
  const firstDifferentByteOffset = sourceRegion.findIndex(
    (sourceByte, byteOffset) => sourceByte !== atlasRegion[byteOffset],
  );

  if (firstDifferentByteOffset !== -1) {
    throw new Error(
      `Startup Cursor atlas frame ${JSON.stringify(frameContract.id)} differs at RGBA byte ${String(firstDifferentByteOffset)}. Source path: ${JSON.stringify(sourcePngPath)}. Atlas path: ${JSON.stringify(atlasWebpPath)}. Source frame: ${JSON.stringify(frameContract.source)}. Atlas frame: ${JSON.stringify(frameContract.atlas)}.`,
    );
  }
}

async function decodeImageToRgba(imageFilePath) {
  return runCommand(
    "ffmpeg",
    [
      "-v",
      "error",
      "-i",
      imageFilePath,
      "-f",
      "rawvideo",
      "-pix_fmt",
      "rgba",
      "-",
    ],
    true,
  );
}

function assertDecodedRgbaByteLength(
  rgbaBytes,
  imageDimensions,
  imageDescription,
  imageFilePath,
) {
  const expectedRgbaByteLength =
    imageDimensions.width * imageDimensions.height * 4;

  if (rgbaBytes.length !== expectedRgbaByteLength) {
    throw new Error(
      `Decoded ${imageDescription} RGBA byte length must match its dimensions. Image path: ${JSON.stringify(imageFilePath)}. Expected RGBA bytes: ${String(expectedRgbaByteLength)}. Received RGBA bytes: ${String(rgbaBytes.length)}.`,
    );
  }
}

function runCommand(commandName, commandArguments, capturesBinaryOutput = false) {
  return new Promise((resolveCommand, rejectCommand) => {
    const commandProcess = spawn(commandName, commandArguments, {
      cwd: workspaceDirectory,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const standardOutputChunks = [];
    const standardErrorChunks = [];

    commandProcess.stdout.on("data", (outputChunk) => {
      standardOutputChunks.push(Buffer.from(outputChunk));
    });
    commandProcess.stderr.on("data", (errorChunk) => {
      standardErrorChunks.push(Buffer.from(errorChunk));
    });
    commandProcess.once("error", (commandError) => {
      rejectCommand(
        new Error(
          `Could not run command ${JSON.stringify(commandName)} for arguments ${JSON.stringify(commandArguments)}.`,
          { cause: commandError },
        ),
      );
    });
    commandProcess.once("close", (exitCode, signalName) => {
      const standardError = Buffer.concat(standardErrorChunks).toString("utf8");

      if (exitCode !== 0) {
        rejectCommand(
          new Error(
            `Command ${JSON.stringify(commandName)} failed for arguments ${JSON.stringify(commandArguments)}. Received exit code: ${String(exitCode)}. Received signal: ${String(signalName)}. Standard error: ${JSON.stringify(standardError)}.`,
          ),
        );
        return;
      }

      const standardOutput = Buffer.concat(standardOutputChunks);
      resolveCommand(
        capturesBinaryOutput ? standardOutput : standardOutput.toString("utf8"),
      );
    });
  });
}
