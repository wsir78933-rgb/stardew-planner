import { spawn } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);

const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const verifiedInitialTexturePairs = [
  {
    sourcePngRelativePath:
      "public/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet.png",
    derivedWebpRelativePath:
      "public/planner-textures/initial/spring_outdoorsTileSheet.webp",
  },
  {
    sourcePngRelativePath:
      "public/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet2.png",
    derivedWebpRelativePath:
      "public/planner-textures/initial/spring_outdoorsTileSheet2.webp",
  },
  {
    sourcePngRelativePath:
      "public/game-assets/1.6.15/sprites/springobjects.png",
    derivedWebpRelativePath:
      "public/planner-textures/initial/springobjects.webp",
  },
  {
    sourcePngRelativePath:
      "public/game-assets/1.6.15/sprites/Cursors.png",
    derivedWebpRelativePath:
      "public/planner-textures/initial/Cursors.webp",
  },
];

await verifyInitialPlannerTextureWebpPairs();

async function verifyInitialPlannerTextureWebpPairs() {
  for (const verifiedInitialTexturePair of verifiedInitialTexturePairs) {
    await verifyInitialPlannerTextureWebpPair(verifiedInitialTexturePair);
  }

  process.stdout.write(
    `Verified ${String(verifiedInitialTexturePairs.length)} initial planner lossless WebP textures.\n`,
  );
}

async function verifyInitialPlannerTextureWebpPair(
  verifiedInitialTexturePair,
) {
  const sourcePngFilePath = resolve(
    workspaceDirectory,
    verifiedInitialTexturePair.sourcePngRelativePath,
  );
  const derivedWebpFilePath = resolve(
    workspaceDirectory,
    verifiedInitialTexturePair.derivedWebpRelativePath,
  );
  const [sourcePngFileSize, derivedWebpFileSize, sourcePngContents] =
    await Promise.all([
      getRequiredFileSize(sourcePngFilePath, "source PNG"),
      getRequiredFileSize(derivedWebpFilePath, "derived WebP"),
      readRequiredFile(sourcePngFilePath, "source PNG"),
    ]);
  const sourcePngDimensions = readPngDimensions(
    sourcePngContents,
    sourcePngFilePath,
  );

  if (derivedWebpFileSize >= sourcePngFileSize) {
    throw new Error(
      `Derived WebP must be smaller than its source PNG. Source PNG path: ${JSON.stringify(sourcePngFilePath)}. Source PNG bytes: ${String(sourcePngFileSize)}. Derived WebP path: ${JSON.stringify(derivedWebpFilePath)}. Derived WebP bytes: ${String(derivedWebpFileSize)}.`,
    );
  }

  const derivedWebpInfo = await runCommand("webpinfo", [derivedWebpFilePath]);
  const derivedWebpWidth = readWebpInfoInteger(
    derivedWebpInfo,
    "Width",
    derivedWebpFilePath,
  );
  const derivedWebpHeight = readWebpInfoInteger(
    derivedWebpInfo,
    "Height",
    derivedWebpFilePath,
  );
  const derivedWebpAlpha = readWebpInfoInteger(
    derivedWebpInfo,
    "Alpha",
    derivedWebpFilePath,
  );

  if (!/^\s*Format:\s*Lossless\b/m.test(derivedWebpInfo)) {
    throw new Error(
      `Derived WebP must use lossless encoding. Derived WebP path: ${JSON.stringify(derivedWebpFilePath)}. Received webpinfo output: ${JSON.stringify(derivedWebpInfo)}.`,
    );
  }

  if (derivedWebpAlpha !== 1) {
    throw new Error(
      `Derived WebP must preserve an alpha channel. Derived WebP path: ${JSON.stringify(derivedWebpFilePath)}. Received Alpha: ${String(derivedWebpAlpha)}.`,
    );
  }

  assertMatchingDimensions(
    sourcePngDimensions,
    { width: derivedWebpWidth, height: derivedWebpHeight },
    sourcePngFilePath,
    derivedWebpFilePath,
  );

  const [sourcePngRgbaBytes, derivedWebpRgbaBytes] = await Promise.all([
    decodeImageToRgba(sourcePngFilePath),
    decodeImageToRgba(derivedWebpFilePath),
  ]);
  const expectedRgbaByteLength =
    sourcePngDimensions.width * sourcePngDimensions.height * 4;

  assertRgbaByteLength(
    sourcePngRgbaBytes,
    expectedRgbaByteLength,
    "source PNG",
    sourcePngFilePath,
  );
  assertRgbaByteLength(
    derivedWebpRgbaBytes,
    expectedRgbaByteLength,
    "derived WebP",
    derivedWebpFilePath,
  );
  assertMatchingRgbaBytes(
    sourcePngRgbaBytes,
    derivedWebpRgbaBytes,
    sourcePngFilePath,
    derivedWebpFilePath,
  );
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
      `Source PNG must include its signature and IHDR dimensions. Source PNG path: ${JSON.stringify(sourcePngFilePath)}. Received byte size: ${String(sourcePngContents.length)}.`,
    );
  }

  if (!sourcePngContents.subarray(0, pngSignature.length).equals(pngSignature)) {
    throw new Error(
      `Source PNG must start with the PNG signature. Source PNG path: ${JSON.stringify(sourcePngFilePath)}. Received leading bytes: ${JSON.stringify([...sourcePngContents.subarray(0, pngSignature.length)])}.`,
    );
  }

  const firstChunkType = sourcePngContents.toString("ascii", 12, 16);

  if (firstChunkType !== "IHDR") {
    throw new Error(
      `Source PNG must contain IHDR as its first chunk. Source PNG path: ${JSON.stringify(sourcePngFilePath)}. Received first chunk type: ${JSON.stringify(firstChunkType)}.`,
    );
  }

  const width = sourcePngContents.readUInt32BE(16);
  const height = sourcePngContents.readUInt32BE(20);

  if (width === 0 || height === 0) {
    throw new Error(
      `Source PNG dimensions must be positive. Source PNG path: ${JSON.stringify(sourcePngFilePath)}. Received width: ${String(width)}. Received height: ${String(height)}.`,
    );
  }

  return { width, height };
}

function readWebpInfoInteger(derivedWebpInfo, fieldName, derivedWebpFilePath) {
  const fieldMatch = derivedWebpInfo.match(
    new RegExp(`^\\s*${fieldName}:\\s*(\\d+)\\s*$`, "m"),
  );

  if (fieldMatch?.[1] === undefined) {
    throw new Error(
      `Derived WebP webpinfo output must include ${fieldName}. Derived WebP path: ${JSON.stringify(derivedWebpFilePath)}. Received webpinfo output: ${JSON.stringify(derivedWebpInfo)}.`,
    );
  }

  return Number.parseInt(fieldMatch[1], 10);
}

function assertMatchingDimensions(
  sourcePngDimensions,
  derivedWebpDimensions,
  sourcePngFilePath,
  derivedWebpFilePath,
) {
  if (
    sourcePngDimensions.width !== derivedWebpDimensions.width ||
    sourcePngDimensions.height !== derivedWebpDimensions.height
  ) {
    throw new Error(
      `Derived WebP dimensions must match its source PNG. Source PNG path: ${JSON.stringify(sourcePngFilePath)}. Source PNG dimensions: ${String(sourcePngDimensions.width)}x${String(sourcePngDimensions.height)}. Derived WebP path: ${JSON.stringify(derivedWebpFilePath)}. Derived WebP dimensions: ${String(derivedWebpDimensions.width)}x${String(derivedWebpDimensions.height)}.`,
    );
  }
}

async function decodeImageToRgba(imageFilePath) {
  return runCommand("ffmpeg", [
    "-v",
    "error",
    "-i",
    imageFilePath,
    "-f",
    "rawvideo",
    "-pix_fmt",
    "rgba",
    "-",
  ], true);
}

function assertRgbaByteLength(
  rgbaBytes,
  expectedRgbaByteLength,
  imageDescription,
  imageFilePath,
) {
  if (rgbaBytes.length !== expectedRgbaByteLength) {
    throw new Error(
      `Decoded ${imageDescription} RGBA byte length must match its dimensions. Image path: ${JSON.stringify(imageFilePath)}. Expected RGBA bytes: ${String(expectedRgbaByteLength)}. Received RGBA bytes: ${String(rgbaBytes.length)}.`,
    );
  }
}

function assertMatchingRgbaBytes(
  sourcePngRgbaBytes,
  derivedWebpRgbaBytes,
  sourcePngFilePath,
  derivedWebpFilePath,
) {
  const firstDifferentByteOffset = sourcePngRgbaBytes.findIndex(
    (sourcePngByte, byteOffset) =>
      sourcePngByte !== derivedWebpRgbaBytes[byteOffset],
  );

  if (firstDifferentByteOffset === -1) {
    return;
  }

  throw new Error(
    `Decoded RGBA pixels must match exactly. Source PNG path: ${JSON.stringify(sourcePngFilePath)}. Derived WebP path: ${JSON.stringify(derivedWebpFilePath)}. First differing RGBA byte offset: ${String(firstDifferentByteOffset)}. Source PNG RGBA bytes: ${JSON.stringify([...sourcePngRgbaBytes.subarray(firstDifferentByteOffset, firstDifferentByteOffset + 4)])}. Derived WebP RGBA bytes: ${JSON.stringify([...derivedWebpRgbaBytes.subarray(firstDifferentByteOffset, firstDifferentByteOffset + 4)])}.`,
  );
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
