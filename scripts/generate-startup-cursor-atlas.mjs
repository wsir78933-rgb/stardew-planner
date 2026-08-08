import { spawn } from "node:child_process";
import {
  link,
  mkdtemp,
  readFile,
  rm,
  stat,
  unlink,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
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
const atlasWebpPath = resolve(
  workspaceDirectory,
  STARTUP_CURSOR_ATLAS_CONTRACT.atlasWebpRelativePath,
);
const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

await generateStartupCursorAtlas();

export async function generateStartupCursorAtlas() {
  const temporaryRoot = await parseRequiredTemporaryRoot(process.argv.slice(2));

  await assertLockedSourceDimensions();

  const generationDirectory = await createGenerationDirectory(temporaryRoot);
  const intermediatePngPath = await composeStartupCursorAtlasPng(
    generationDirectory,
  );
  const generatedWebpPath = await encodeExactLosslessAtlas(
    intermediatePngPath,
    generationDirectory,
  );

  await publishEncodedAtlasExclusively(generatedWebpPath);
  await rm(generationDirectory, { recursive: true });

  process.stdout.write(
    `Generated startup Cursor atlas at ${JSON.stringify(atlasWebpPath)} from ${JSON.stringify(sourcePngPath)}.\n`,
  );
}

export async function parseRequiredTemporaryRoot(argumentValues) {
  if (
    argumentValues.length !== 2 ||
    argumentValues[0] !== "--temporary-root" ||
    typeof argumentValues[1] !== "string" ||
    argumentValues[1].length === 0
  ) {
    throw new Error(
      `Expected --temporary-root followed by one directory path; received ${JSON.stringify(argumentValues)}.`,
    );
  }

  const temporaryRoot = resolve(argumentValues[1]);
  let temporaryRootStats;

  try {
    temporaryRootStats = await stat(temporaryRoot);
  } catch (temporaryRootStatError) {
    throw new Error(
      `Could not inspect startup Cursor temporary root ${JSON.stringify(temporaryRoot)}. Received argument values: ${JSON.stringify(argumentValues)}.`,
      { cause: temporaryRootStatError },
    );
  }

  if (!temporaryRootStats.isDirectory()) {
    throw new Error(
      `Startup Cursor temporary root must be a directory. Received path: ${JSON.stringify(temporaryRoot)}. Received argument values: ${JSON.stringify(argumentValues)}.`,
    );
  }

  return temporaryRoot;
}

async function assertLockedSourceDimensions() {
  await getRequiredFileSize(sourcePngPath, "locked startup Cursor source PNG");

  const sourcePngContents = await readRequiredFile(
    sourcePngPath,
    "locked startup Cursor source PNG",
  );
  const receivedSourceDimensions = readPngDimensions(
    sourcePngContents,
    sourcePngPath,
  );
  const expectedSourceDimensions =
    STARTUP_CURSOR_ATLAS_CONTRACT.sourceDimensions;

  if (
    receivedSourceDimensions.width !== expectedSourceDimensions.width ||
    receivedSourceDimensions.height !== expectedSourceDimensions.height
  ) {
    throw new Error(
      `Locked startup Cursor source PNG dimensions must match the atlas contract. Source path: ${JSON.stringify(sourcePngPath)}. Expected dimensions: ${String(expectedSourceDimensions.width)}x${String(expectedSourceDimensions.height)}. Received dimensions: ${String(receivedSourceDimensions.width)}x${String(receivedSourceDimensions.height)}.`,
    );
  }
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
      `Locked startup Cursor source PNG must include its signature and IHDR dimensions. Source path: ${JSON.stringify(sourcePngFilePath)}. Received byte size: ${String(sourcePngContents.length)}.`,
    );
  }

  if (!sourcePngContents.subarray(0, pngSignature.length).equals(pngSignature)) {
    throw new Error(
      `Locked startup Cursor source PNG must start with the PNG signature. Source path: ${JSON.stringify(sourcePngFilePath)}. Received leading bytes: ${JSON.stringify([...sourcePngContents.subarray(0, pngSignature.length)])}.`,
    );
  }

  const firstChunkType = sourcePngContents.toString("ascii", 12, 16);

  if (firstChunkType !== "IHDR") {
    throw new Error(
      `Locked startup Cursor source PNG must contain IHDR as its first chunk. Source path: ${JSON.stringify(sourcePngFilePath)}. Received first chunk type: ${JSON.stringify(firstChunkType)}.`,
    );
  }

  return {
    width: sourcePngContents.readUInt32BE(16),
    height: sourcePngContents.readUInt32BE(20),
  };
}

async function createGenerationDirectory(temporaryRoot) {
  return mkdtemp(join(temporaryRoot, "startup-cursor-atlas-"));
}

async function composeStartupCursorAtlasPng(generationDirectory) {
  const intermediatePngPath = join(generationDirectory, "Cursors-startup.png");
  const atlasFilter = [
    "color=c=black@0.0:s=704x2256,format=rgba[transparent-atlas]",
    "[0:v]crop=30:25:134:226,format=rgba[lid]",
    "[0:v]crop=16:16:656:394,format=rgba[left]",
    "[0:v]crop=16:16:672:394,format=rgba[middle]",
    "[0:v]crop=16:16:688:394,format=rgba[right]",
    "[transparent-atlas][lid]overlay=134:226:format=auto[with-lid]",
    "[with-lid][left]overlay=656:394:format=auto[with-left-shadow]",
    "[with-left-shadow][middle]overlay=672:394:format=auto[with-middle-shadow]",
    "[with-middle-shadow][right]overlay=688:394:format=auto,format=rgba[atlas]",
  ].join(";");

  await runCommand("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-i",
    sourcePngPath,
    "-filter_complex",
    atlasFilter,
    "-map",
    "[atlas]",
    "-frames:v",
    "1",
    intermediatePngPath,
  ]);

  return intermediatePngPath;
}

async function encodeExactLosslessAtlas(intermediatePngPath, generationDirectory) {
  const generatedWebpPath = join(generationDirectory, "Cursors-startup.webp");

  await runCommand("cwebp", [
    "-lossless",
    "-exact",
    "-m",
    "6",
    intermediatePngPath,
    "-o",
    generatedWebpPath,
  ]);

  return generatedWebpPath;
}

async function publishEncodedAtlasExclusively(generatedWebpPath) {
  try {
    await link(generatedWebpPath, atlasWebpPath);
  } catch (atlasPublishError) {
    if (atlasPublishError?.code === "EEXIST") {
      throw new Error(
        `Startup Cursor atlas target already exists and cannot be atomically published without overwrite. Encoded temporary path: ${JSON.stringify(generatedWebpPath)}. Atlas target path: ${JSON.stringify(atlasWebpPath)}. Received error code: ${JSON.stringify(atlasPublishError.code)}.`,
        { cause: atlasPublishError },
      );
    }

    if (atlasPublishError?.code === "EXDEV") {
      throw new Error(
        `Startup Cursor atlas encoded temporary file and target must be on the same filesystem for atomic exclusive publish. Encoded temporary path: ${JSON.stringify(generatedWebpPath)}. Atlas target path: ${JSON.stringify(atlasWebpPath)}. Received error code: ${JSON.stringify(atlasPublishError.code)}.`,
        { cause: atlasPublishError },
      );
    }

    throw new Error(
      `Could not atomically publish startup Cursor atlas without overwrite. Encoded temporary path: ${JSON.stringify(generatedWebpPath)}. Atlas target path: ${JSON.stringify(atlasWebpPath)}. Received error code: ${JSON.stringify(atlasPublishError?.code)}.`,
      { cause: atlasPublishError },
    );
  }

  try {
    await unlink(generatedWebpPath);
  } catch (encodedTemporaryUnlinkError) {
    throw new Error(
      `Startup Cursor atlas was published but its owned encoded temporary hard-link source could not be removed. Encoded temporary path: ${JSON.stringify(generatedWebpPath)}. Atlas target path: ${JSON.stringify(atlasWebpPath)}. Received error code: ${JSON.stringify(encodedTemporaryUnlinkError?.code)}.`,
      { cause: encodedTemporaryUnlinkError },
    );
  }
}

function runCommand(commandName, commandArguments) {
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

      resolveCommand(Buffer.concat(standardOutputChunks).toString("utf8"));
    });
  });
}
