import { createHash, randomUUID } from "node:crypto";
import {
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, join, parse, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DOMParser } from "@xmldom/xmldom";
import {
  assetLockFileName,
  createAssetLock,
  getCanonicalAssetOutputPath,
  parseAssetLock,
  serializeAssetLock,
  validateAssetOutputPaths,
  type AssetLock,
  type AssetLockEntry,
} from "./asset-lock";
import { validateSourceAsset, type SourceAsset } from "./source-asset";
import { sourceAssets } from "./source-manifest";

const pngMagicBytes = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const pngChunkHeaderByteLength = 8;
const pngChunkCrcByteLength = 4;
const pngIhdrChunkType = "IHDR";
const pngIendChunkType = "IEND";
const pngIhdrContentByteLength = 13;

export type FetchResponse = {
  ok: boolean;
  status: number;
  url: string;
  headers: {
    get(headerName: string): string | null;
  };
  arrayBuffer(): Promise<ArrayBuffer>;
};

export type FetchImplementation = (
  sourceUrl: string,
) => Promise<FetchResponse>;

export type RenameDirectory = (
  sourceDirectory: string,
  destinationDirectory: string,
) => Promise<void>;

export type AssetSynchronizationOptions = {
  renameDirectory?: RenameDirectory;
};

export async function synchronizeAssets(
  sourceAssetList: readonly SourceAsset[],
  fetchImplementation: FetchImplementation,
  targetDirectory: string,
  assetSynchronizationOptions?: AssetSynchronizationOptions,
): Promise<void> {
  validateSynchronizationInput(
    sourceAssetList,
    fetchImplementation,
    targetDirectory,
  );

  const publishedDirectory = resolve(targetDirectory);
  const renameDirectory = getRenameDirectory(assetSynchronizationOptions);
  const publishedDirectoryExists = await inspectPublishedDirectory(
    publishedDirectory,
  );
  const publishedAssetLock = await readExistingPublishedAssetLock(
    publishedDirectory,
    publishedDirectoryExists,
  );
  validateCandidateRetainsPublishedOutputPaths(
    sourceAssetList,
    publishedAssetLock,
  );
  const stagingDirectory = await createStagingDirectory(publishedDirectory);

  try {
    const candidateAssetLockEntries = await downloadCandidateAssets(
      sourceAssetList,
      fetchImplementation,
      stagingDirectory,
    );
    const candidateAssetLock = createAssetLock(candidateAssetLockEntries);

    await writeAssetLock(stagingDirectory, candidateAssetLock);
    validatePublishedLockHashes(publishedAssetLock, candidateAssetLock);
    await publishStagingDirectory(
      stagingDirectory,
      publishedDirectory,
      publishedDirectoryExists,
      renameDirectory,
    );
  } catch (synchronizationError) {
    await removeStagingDirectoryAfterFailure(
      stagingDirectory,
      synchronizationError,
    );
    throw synchronizationError;
  }
}

function validateSynchronizationInput(
  sourceAssetList: readonly SourceAsset[],
  fetchImplementation: FetchImplementation,
  targetDirectory: string,
): void {
  if (!Array.isArray(sourceAssetList)) {
    throw new TypeError(
      `Source asset list must be an array. Received: ${formatInvalidValue(sourceAssetList)}.`,
    );
  }

  if (typeof fetchImplementation !== "function") {
    throw new TypeError(
      `Asset fetch implementation must be a function. Received: ${formatInvalidValue(fetchImplementation)}.`,
    );
  }

  validateTargetDirectory(targetDirectory);
  validateSourceAssetList(sourceAssetList);
}

function validateTargetDirectory(targetDirectory: string): void {
  if (typeof targetDirectory !== "string" || targetDirectory.length === 0) {
    throw new TypeError(
      `Asset target directory must be a non-empty path string. Received: ${formatInvalidValue(targetDirectory)}.`,
    );
  }

  const publishedDirectory = resolve(targetDirectory);

  if (publishedDirectory === parse(publishedDirectory).root) {
    throw new TypeError(
      `Asset target directory cannot be a filesystem root. Received: ${formatInvalidValue(targetDirectory)}.`,
    );
  }
}

function validateSourceAssetList(
  sourceAssetList: readonly SourceAsset[],
): void {
  if (sourceAssetList.length === 0) {
    throw new TypeError(
      `Source asset list must contain at least one asset. Received: ${formatInvalidValue(sourceAssetList)}.`,
    );
  }

  for (const sourceAsset of sourceAssetList) {
    validateSourceAsset(sourceAsset);
  }

  validateAssetOutputPaths(
    sourceAssetList.map((sourceAsset) => sourceAsset.outputPath),
  );
}

function getRenameDirectory(
  assetSynchronizationOptions: AssetSynchronizationOptions | undefined,
): RenameDirectory {
  if (assetSynchronizationOptions === undefined) {
    return rename;
  }

  if (
    typeof assetSynchronizationOptions !== "object" ||
    assetSynchronizationOptions === null ||
    Array.isArray(assetSynchronizationOptions)
  ) {
    throw new TypeError(
      `Asset synchronization options must be a non-null object. Received: ${formatInvalidValue(assetSynchronizationOptions)}.`,
    );
  }

  if (assetSynchronizationOptions.renameDirectory === undefined) {
    return rename;
  }

  if (typeof assetSynchronizationOptions.renameDirectory !== "function") {
    throw new TypeError(
      `Asset synchronization renameDirectory must be a function. Received: ${formatInvalidValue(assetSynchronizationOptions.renameDirectory)}.`,
    );
  }

  return assetSynchronizationOptions.renameDirectory;
}

async function inspectPublishedDirectory(
  publishedDirectory: string,
): Promise<boolean> {
  let inspectedDirectory = publishedDirectory;
  let publishedDirectoryExists = false;

  while (true) {
    const inspectedDirectoryMetadata = await getExistingPathMetadata(
      inspectedDirectory,
    );

    if (inspectedDirectoryMetadata !== null) {
      validateRealDirectoryPath(inspectedDirectory, inspectedDirectoryMetadata);

      if (inspectedDirectory === publishedDirectory) {
        publishedDirectoryExists = true;
      }
    }

    const inspectedDirectoryParent = dirname(inspectedDirectory);

    if (inspectedDirectoryParent === inspectedDirectory) {
      return publishedDirectoryExists;
    }

    inspectedDirectory = inspectedDirectoryParent;
  }
}

async function getExistingPathMetadata(path: string) {
  try {
    return await lstat(path);
  } catch (filesystemError) {
    if (isMissingFileError(filesystemError)) {
      return null;
    }

    throw filesystemError;
  }
}

function validateRealDirectoryPath(path: string, pathMetadata: Awaited<ReturnType<typeof lstat>>): void {
  if (pathMetadata.isSymbolicLink() || !pathMetadata.isDirectory()) {
    throw new TypeError(
      `Asset target directory and every existing ancestor must be real directories, not symbolic links or files. Received: ${formatInvalidValue(path)}.`,
    );
  }
}

async function createStagingDirectory(
  publishedDirectory: string,
): Promise<string> {
  const publishedDirectoryParent = dirname(publishedDirectory);
  const publishedDirectoryName = parse(publishedDirectory).base;

  await mkdir(publishedDirectoryParent, { recursive: true });

  return mkdtemp(
    join(publishedDirectoryParent, `.${publishedDirectoryName}.staging-`),
  );
}

async function downloadCandidateAssets(
  sourceAssetList: readonly SourceAsset[],
  fetchImplementation: FetchImplementation,
  stagingDirectory: string,
): Promise<AssetLockEntry[]> {
  const candidateAssetLockEntries: AssetLockEntry[] = [];

  for (const sourceAsset of sourceAssetList) {
    const response = await fetchImplementation(sourceAsset.sourceUrl);
    validateFetchResponse(response, sourceAsset);
    const content = new Uint8Array(await response.arrayBuffer());

    validateContent(sourceAsset, content);
    await writeCandidateAsset(stagingDirectory, sourceAsset, content);

    candidateAssetLockEntries.push({
      sourceUrl: sourceAsset.sourceUrl,
      outputPath: sourceAsset.outputPath,
      mediaType: sourceAsset.mediaType,
      sha256: calculateSha256(content),
    });
  }

  return candidateAssetLockEntries;
}

function validateFetchResponse(
  response: FetchResponse,
  sourceAsset: SourceAsset,
): void {
  if (typeof response !== "object" || response === null) {
    throw new TypeError(
      `Asset fetch response must be a non-null object for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received: ${formatInvalidValue(response)}.`,
    );
  }

  if (
    response.ok !== true ||
    !Number.isInteger(response.status) ||
    response.status < 200 ||
    response.status >= 300
  ) {
    throw new Error(
      `Asset request must return ok=true and an integer 2xx status for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received ok: ${formatInvalidValue(response.ok)}. Received HTTP status: ${formatInvalidValue(response.status)}.`,
    );
  }

  validateFinalResponseUrl(response.url, sourceAsset);
  validateResponseContentType(response.headers, sourceAsset);

  if (typeof response.arrayBuffer !== "function") {
    throw new TypeError(
      `Asset fetch response must provide arrayBuffer() for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received: ${formatInvalidValue(response.arrayBuffer)}.`,
    );
  }
}

function validateFinalResponseUrl(
  finalResponseUrl: string,
  sourceAsset: SourceAsset,
): void {
  if (typeof finalResponseUrl !== "string" || finalResponseUrl.length === 0) {
    throw new TypeError(
      `Asset fetch response URL must be a non-empty string for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received: ${formatInvalidValue(finalResponseUrl)}.`,
    );
  }

  validateSourceAsset({
    sourceUrl: finalResponseUrl,
    outputPath: sourceAsset.outputPath,
    mediaType: sourceAsset.mediaType,
  });
}

function validateResponseContentType(
  responseHeaders: FetchResponse["headers"],
  sourceAsset: SourceAsset,
): void {
  if (typeof responseHeaders !== "object" || responseHeaders === null) {
    throw new TypeError(
      `Asset fetch response headers must be a non-null object for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received: ${formatInvalidValue(responseHeaders)}.`,
    );
  }

  if (typeof responseHeaders.get !== "function") {
    throw new TypeError(
      `Asset fetch response headers must provide get() for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received: ${formatInvalidValue(responseHeaders.get)}.`,
    );
  }

  const receivedContentType = responseHeaders.get("content-type");

  if (typeof receivedContentType !== "string") {
    throw new TypeError(
      `Asset response content-type must be ${sourceAsset.mediaType} for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received: ${formatInvalidValue(receivedContentType)}.`,
    );
  }

  const normalizedReceivedMediaType = receivedContentType
    .split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (normalizedReceivedMediaType !== sourceAsset.mediaType) {
    throw new TypeError(
      `Asset response content-type must be ${sourceAsset.mediaType} for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received: ${formatInvalidValue(receivedContentType)}.`,
    );
  }
}

function validateContent(sourceAsset: SourceAsset, content: Uint8Array): void {
  if (sourceAsset.mediaType === "application/json") {
    validateJsonContent(sourceAsset, content);
    return;
  }

  if (sourceAsset.mediaType === "application/xml") {
    validateXmlContent(sourceAsset, content);
    return;
  }

  validatePngContent(sourceAsset, content);
}

function validateJsonContent(sourceAsset: SourceAsset, content: Uint8Array): void {
  const textContent = decodeUtf8Content(sourceAsset, content);

  try {
    JSON.parse(textContent);
  } catch (parsingError) {
    if (parsingError instanceof SyntaxError) {
      throw new TypeError(
        `Asset JSON must be valid for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received UTF-8 content: ${formatInvalidValue(textContent)}. Parsing failed: ${parsingError.message}`,
        { cause: parsingError },
      );
    }

    throw parsingError;
  }
}

function validateXmlContent(sourceAsset: SourceAsset, content: Uint8Array): void {
  const textContent = decodeUtf8Content(sourceAsset, content);
  const xmlProblems: string[] = [];
  let xmlDocument: ReturnType<DOMParser["parseFromString"]>;

  try {
    xmlDocument = new DOMParser({
      onError: (level, message) => {
        xmlProblems.push(`${level}: ${message}`);
      },
    }).parseFromString(textContent, "application/xml");
  } catch (parsingError) {
    if (parsingError instanceof Error) {
      throw new TypeError(
        `Asset XML must parse without warnings or errors for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received UTF-8 content: ${formatInvalidValue(textContent)}. Parsing failed: ${parsingError.message}`,
        { cause: parsingError },
      );
    }

    throw parsingError;
  }

  if (xmlProblems.length > 0) {
    throw new TypeError(
      `Asset XML must parse without warnings or errors for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received UTF-8 content: ${formatInvalidValue(textContent)}. Parser messages: ${xmlProblems.join(" | ")}`,
    );
  }

  if (xmlDocument === undefined) {
    throw new TypeError(
      `Asset XML parser did not produce a document for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received UTF-8 content: ${formatInvalidValue(textContent)}.`,
    );
  }

  if (sourceAsset.outputPath.endsWith(".tmx") && xmlDocument.documentElement?.tagName !== "map") {
    throw new TypeError(
      `Asset TMX root element must be "map" for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received root element: ${formatInvalidValue(xmlDocument.documentElement?.tagName)}.`,
    );
  }
}

function validatePngContent(sourceAsset: SourceAsset, content: Uint8Array): void {
  validatePngSignature(sourceAsset, content);

  let pngChunkStartByteIndex = pngMagicBytes.length;
  let isFirstPngChunk = true;

  while (pngChunkStartByteIndex < content.length) {
    const parsedPngChunk = parsePngChunk(
      sourceAsset,
      content,
      pngChunkStartByteIndex,
    );

    if (isFirstPngChunk) {
      validatePngIhdrChunk(sourceAsset, parsedPngChunk);
      isFirstPngChunk = false;
    }

    if (parsedPngChunk.chunkType === pngIendChunkType) {
      validatePngIendChunk(sourceAsset, parsedPngChunk, content.length);
      return;
    }

    pngChunkStartByteIndex = parsedPngChunk.nextChunkStartByteIndex;
  }

  if (isFirstPngChunk) {
    throw new TypeError(
      `Asset PNG must contain IHDR as its first chunk for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received PNG byte length: ${content.length}.`,
    );
  }

  throw new TypeError(
    `Asset PNG must end with exactly one IEND chunk for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received PNG byte length: ${content.length}.`,
  );
}

type ParsedPngChunk = {
  chunkContents: Uint8Array;
  chunkType: string;
  nextChunkStartByteIndex: number;
};

function validatePngSignature(
  sourceAsset: SourceAsset,
  content: Uint8Array,
): void {
  if (
    content.length < pngMagicBytes.length ||
    pngMagicBytes.some(
      (expectedByte, byteIndex) => content[byteIndex] !== expectedByte,
    )
  ) {
    throw new TypeError(
      `Asset PNG must start with the PNG magic bytes for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received leading bytes: ${formatInvalidValue(toHex(content.slice(0, pngMagicBytes.length)))}.`,
    );
  }
}

function parsePngChunk(
  sourceAsset: SourceAsset,
  content: Uint8Array,
  pngChunkStartByteIndex: number,
): ParsedPngChunk {
  const remainingPngByteLength = content.length - pngChunkStartByteIndex;
  const minimumPngChunkByteLength =
    pngChunkHeaderByteLength + pngChunkCrcByteLength;

  if (remainingPngByteLength < minimumPngChunkByteLength) {
    throw new TypeError(
      `Asset PNG must contain a complete chunk header and CRC for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received remaining byte length: ${remainingPngByteLength}.`,
    );
  }

  const chunkContentByteLength = readPngUnsignedInteger(
    content,
    pngChunkStartByteIndex,
  );
  const chunkTypeStartByteIndex = pngChunkStartByteIndex + 4;
  const chunkContentStartByteIndex =
    pngChunkStartByteIndex + pngChunkHeaderByteLength;
  const remainingByteLengthAfterChunkHeader =
    content.length - chunkContentStartByteIndex;

  if (
    chunkContentByteLength >
    remainingByteLengthAfterChunkHeader - pngChunkCrcByteLength
  ) {
    throw new TypeError(
      `Asset PNG chunk length exceeds the remaining bytes for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received chunk content byte length: ${chunkContentByteLength}. Received remaining byte length after header: ${remainingByteLengthAfterChunkHeader}.`,
    );
  }

  const chunkContentEndByteIndex =
    chunkContentStartByteIndex + chunkContentByteLength;
  const chunkCrcByteIndex = chunkContentEndByteIndex;
  const nextChunkStartByteIndex = chunkCrcByteIndex + pngChunkCrcByteLength;
  const chunkType = new TextDecoder("ascii").decode(
    content.slice(chunkTypeStartByteIndex, chunkContentStartByteIndex),
  );
  const chunkContents = content.slice(
    chunkContentStartByteIndex,
    chunkContentEndByteIndex,
  );
  const receivedChunkCrc = readPngUnsignedInteger(content, chunkCrcByteIndex);
  const calculatedChunkCrc = calculatePngCyclicRedundancyCheck(
    content.slice(chunkTypeStartByteIndex, chunkContentEndByteIndex),
  );

  if (receivedChunkCrc !== calculatedChunkCrc) {
    throw new TypeError(
      `Asset PNG chunk CRC must match its chunk type and contents for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received chunk type: ${formatInvalidValue(chunkType)}. Received CRC: ${receivedChunkCrc}. Calculated CRC: ${calculatedChunkCrc}.`,
    );
  }

  return {
    chunkContents,
    chunkType,
    nextChunkStartByteIndex,
  };
}

function validatePngIhdrChunk(
  sourceAsset: SourceAsset,
  parsedPngChunk: ParsedPngChunk,
): void {
  if (parsedPngChunk.chunkType !== pngIhdrChunkType) {
    throw new TypeError(
      `Asset PNG first chunk must be IHDR for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received first chunk type: ${formatInvalidValue(parsedPngChunk.chunkType)}.`,
    );
  }

  if (parsedPngChunk.chunkContents.length !== pngIhdrContentByteLength) {
    throw new TypeError(
      `Asset PNG IHDR chunk must contain ${pngIhdrContentByteLength} bytes for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received IHDR byte length: ${parsedPngChunk.chunkContents.length}.`,
    );
  }

  const pixelWidth = readPngUnsignedInteger(parsedPngChunk.chunkContents, 0);
  const pixelHeight = readPngUnsignedInteger(parsedPngChunk.chunkContents, 4);

  if (pixelWidth === 0 || pixelHeight === 0) {
    throw new TypeError(
      `Asset PNG IHDR width and height must be positive for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received width: ${pixelWidth}. Received height: ${pixelHeight}.`,
    );
  }
}

function validatePngIendChunk(
  sourceAsset: SourceAsset,
  parsedPngChunk: ParsedPngChunk,
  pngByteLength: number,
): void {
  if (parsedPngChunk.chunkContents.length !== 0) {
    throw new TypeError(
      `Asset PNG IEND chunk must have zero content bytes for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received IEND byte length: ${parsedPngChunk.chunkContents.length}.`,
    );
  }

  if (parsedPngChunk.nextChunkStartByteIndex !== pngByteLength) {
    throw new TypeError(
      `Asset PNG cannot contain bytes after IEND for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received bytes after IEND: ${pngByteLength - parsedPngChunk.nextChunkStartByteIndex}.`,
    );
  }
}

function readPngUnsignedInteger(
  content: Uint8Array,
  byteIndex: number,
): number {
  return new DataView(
    content.buffer,
    content.byteOffset + byteIndex,
    4,
  ).getUint32(0);
}

function calculatePngCyclicRedundancyCheck(
  chunkTypeAndContents: Uint8Array,
): number {
  let cyclicRedundancyCheck = 0xffffffff;

  for (const chunkByte of chunkTypeAndContents) {
    cyclicRedundancyCheck ^= chunkByte;

    for (let bitIndex = 0; bitIndex < 8; bitIndex += 1) {
      cyclicRedundancyCheck =
        (cyclicRedundancyCheck >>> 1) ^
        (0xedb88320 & -(cyclicRedundancyCheck & 1));
    }
  }

  return (cyclicRedundancyCheck ^ 0xffffffff) >>> 0;
}

function decodeUtf8Content(
  sourceAsset: SourceAsset,
  content: Uint8Array,
): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(content);
  } catch (decodingError) {
    if (decodingError instanceof TypeError) {
      throw new TypeError(
        `Asset content must be valid UTF-8 for ${formatInvalidValue(sourceAsset.sourceUrl)}. Received bytes: ${formatInvalidValue(toHex(content))}. Decoding failed: ${decodingError.message}`,
        { cause: decodingError },
      );
    }

    throw decodingError;
  }
}

function calculateSha256(content: Uint8Array): string {
  return createHash("sha256").update(content).digest("hex");
}

async function writeCandidateAsset(
  stagingDirectory: string,
  sourceAsset: SourceAsset,
  content: Uint8Array,
): Promise<void> {
  const candidateFilePath = resolve(stagingDirectory, sourceAsset.outputPath);

  if (!isDescendantPath(stagingDirectory, candidateFilePath)) {
    throw new TypeError(
      `Asset output path must resolve inside the staging directory. Received: ${formatInvalidValue(sourceAsset.outputPath)}.`,
    );
  }

  await mkdir(dirname(candidateFilePath), { recursive: true });
  await writeFile(candidateFilePath, content);
}

async function writeAssetLock(
  stagingDirectory: string,
  candidateAssetLock: AssetLock,
): Promise<void> {
  await writeFile(
    join(stagingDirectory, assetLockFileName),
    serializeAssetLock(candidateAssetLock),
    "utf8",
  );
}

async function readExistingPublishedAssetLock(
  publishedDirectory: string,
  publishedDirectoryExists: boolean,
): Promise<AssetLock | null> {
  if (!publishedDirectoryExists) {
    return null;
  }

  const publishedLockPath = join(publishedDirectory, assetLockFileName);
  const publishedLockContents = await readPublishedAssetLock(publishedLockPath);

  if (publishedLockContents === null) {
    return null;
  }

  const publishedAssetLock = parseAssetLock(publishedLockContents);
  await validatePublishedAssetSnapshot(publishedDirectory, publishedAssetLock);

  return publishedAssetLock;
}

function validateCandidateRetainsPublishedOutputPaths(
  sourceAssetList: readonly SourceAsset[],
  publishedAssetLock: AssetLock | null,
): void {
  if (publishedAssetLock === null) {
    return;
  }

  const candidateCanonicalOutputPaths = new Set(
    sourceAssetList.map((sourceAsset) =>
      getCanonicalAssetOutputPath(sourceAsset.outputPath),
    ),
  );

  for (const publishedAssetLockEntry of publishedAssetLock.assets) {
    const publishedCanonicalOutputPath = getCanonicalAssetOutputPath(
      publishedAssetLockEntry.outputPath,
    );

    if (!candidateCanonicalOutputPaths.has(publishedCanonicalOutputPath)) {
      throw new Error(
        `Candidate source asset list cannot remove a previously published output path. Missing output path: ${formatInvalidValue(publishedAssetLockEntry.outputPath)}.`,
      );
    }
  }
}

function validatePublishedLockHashes(
  publishedAssetLock: AssetLock | null,
  candidateAssetLock: AssetLock,
): void {
  if (publishedAssetLock === null) {
    return;
  }

  const publishedLockEntriesByOutputPath = new Map(
    publishedAssetLock.assets.map((assetLockEntry) => [
      getCanonicalAssetOutputPath(assetLockEntry.outputPath),
      assetLockEntry,
    ]),
  );

  for (const candidateAssetLockEntry of candidateAssetLock.assets) {
    const publishedAssetLockEntry = publishedLockEntriesByOutputPath.get(
      getCanonicalAssetOutputPath(candidateAssetLockEntry.outputPath),
    );

    if (
      publishedAssetLockEntry !== undefined &&
      publishedAssetLockEntry.sha256 !== candidateAssetLockEntry.sha256
    ) {
      throw new Error(
        `Asset lock hash mismatch for output path ${formatInvalidValue(candidateAssetLockEntry.outputPath)}. Existing SHA-256: ${formatInvalidValue(publishedAssetLockEntry.sha256)}. Candidate SHA-256: ${formatInvalidValue(candidateAssetLockEntry.sha256)}.`,
      );
    }
  }
}

async function readPublishedAssetLock(
  publishedLockPath: string,
): Promise<string | null> {
  const publishedLockMetadata = await getExistingPathMetadata(publishedLockPath);

  if (publishedLockMetadata === null) {
    const publishedDirectoryContents = await readdir(dirname(publishedLockPath));

    if (publishedDirectoryContents.length === 0) {
      return null;
    }

    throw new Error(
      `Existing asset target directory is missing ${assetLockFileName}. Received target path: ${formatInvalidValue(publishedLockPath)}.`,
    );
  }

  validatePublishedAssetLockFile(publishedLockPath, publishedLockMetadata);

  return readFile(publishedLockPath, "utf8");
}

function validatePublishedAssetLockFile(
  publishedLockPath: string,
  publishedLockMetadata: Awaited<ReturnType<typeof lstat>>,
): void {
  if (publishedLockMetadata.isSymbolicLink() || !publishedLockMetadata.isFile()) {
    throw new TypeError(
      `Existing asset lock must be a regular file, not a symbolic link or special filesystem entry. Received lock path: ${formatInvalidValue(publishedLockPath)}.`,
    );
  }
}

async function validatePublishedAssetSnapshot(
  publishedDirectory: string,
  publishedAssetLock: AssetLock,
): Promise<void> {
  const physicalAssetOutputPaths = await collectPublishedAssetOutputPaths(
    publishedDirectory,
    publishedDirectory,
  );
  const physicalOutputPathsByCanonicalPath =
    createCanonicalOutputPathIndex(
      physicalAssetOutputPaths,
      "physical asset files",
    );
  const lockedOutputPathsByCanonicalPath = createCanonicalOutputPathIndex(
    publishedAssetLock.assets.map((assetLockEntry) => assetLockEntry.outputPath),
    "asset lock entries",
  );

  for (const [canonicalOutputPath, physicalOutputPath] of physicalOutputPathsByCanonicalPath) {
    if (!lockedOutputPathsByCanonicalPath.has(canonicalOutputPath)) {
      throw new Error(
        `Existing asset target contains a physical file that is not locked. Received physical output path: ${formatInvalidValue(physicalOutputPath)}. Received target directory: ${formatInvalidValue(publishedDirectory)}.`,
      );
    }
  }

  for (const [canonicalOutputPath, lockedOutputPath] of lockedOutputPathsByCanonicalPath) {
    if (!physicalOutputPathsByCanonicalPath.has(canonicalOutputPath)) {
      throw new Error(
        `Existing asset lock references a missing physical file. Received locked output path: ${formatInvalidValue(lockedOutputPath)}. Received target directory: ${formatInvalidValue(publishedDirectory)}.`,
      );
    }
  }
}

async function collectPublishedAssetOutputPaths(
  publishedDirectory: string,
  inspectedDirectory: string,
): Promise<string[]> {
  const inspectedDirectoryEntries = await readdir(inspectedDirectory);
  const physicalAssetOutputPaths: string[] = [];

  for (const inspectedDirectoryEntryName of inspectedDirectoryEntries) {
    const inspectedEntryPath = join(
      inspectedDirectory,
      inspectedDirectoryEntryName,
    );
    const inspectedEntryMetadata = await lstat(inspectedEntryPath);

    if (inspectedEntryMetadata.isSymbolicLink()) {
      throw new TypeError(
        `Existing asset target cannot contain symbolic links. Received symbolic link path: ${formatInvalidValue(inspectedEntryPath)}.`,
      );
    }

    if (inspectedEntryMetadata.isDirectory()) {
      const nestedPhysicalAssetOutputPaths =
        await collectPublishedAssetOutputPaths(
          publishedDirectory,
          inspectedEntryPath,
        );
      physicalAssetOutputPaths.push(...nestedPhysicalAssetOutputPaths);
      continue;
    }

    if (!inspectedEntryMetadata.isFile()) {
      throw new TypeError(
        `Existing asset target can contain only regular files and directories. Received non-regular entry path: ${formatInvalidValue(inspectedEntryPath)}.`,
      );
    }

    const physicalOutputPath = toPublishedAssetOutputPath(
      publishedDirectory,
      inspectedEntryPath,
    );

    if (physicalOutputPath !== assetLockFileName) {
      physicalAssetOutputPaths.push(physicalOutputPath);
    }
  }

  return physicalAssetOutputPaths;
}

function toPublishedAssetOutputPath(
  publishedDirectory: string,
  physicalEntryPath: string,
): string {
  const physicalOutputPath = relative(publishedDirectory, physicalEntryPath).replaceAll(
    "\\",
    "/",
  );

  if (physicalOutputPath.length === 0 || physicalOutputPath.startsWith("../")) {
    throw new TypeError(
      `Existing asset physical file must resolve inside the target directory. Received target directory: ${formatInvalidValue(publishedDirectory)}. Received physical file path: ${formatInvalidValue(physicalEntryPath)}.`,
    );
  }

  return physicalOutputPath;
}

function createCanonicalOutputPathIndex(
  outputPaths: readonly string[],
  outputPathSourceName: string,
): Map<string, string> {
  const outputPathsByCanonicalPath = new Map<string, string>();

  for (const outputPath of outputPaths) {
    const canonicalOutputPath = getCanonicalAssetOutputPath(outputPath);
    const previouslyIndexedOutputPath = outputPathsByCanonicalPath.get(
      canonicalOutputPath,
    );

    if (previouslyIndexedOutputPath !== undefined) {
      throw new TypeError(
        `Existing asset target ${outputPathSourceName} cannot collide after NFC and en-US lowercase canonicalization. Received conflicting output paths: ${formatInvalidValue(previouslyIndexedOutputPath)} and ${formatInvalidValue(outputPath)}.`,
      );
    }

    outputPathsByCanonicalPath.set(canonicalOutputPath, outputPath);
  }

  return outputPathsByCanonicalPath;
}

async function publishStagingDirectory(
  stagingDirectory: string,
  publishedDirectory: string,
  publishedDirectoryExists: boolean,
  renameDirectory: RenameDirectory,
): Promise<void> {
  if (!publishedDirectoryExists) {
    await renameDirectory(stagingDirectory, publishedDirectory);
    return;
  }

  const publishedDirectoryParent = dirname(publishedDirectory);
  const publishedDirectoryName = parse(publishedDirectory).base;
  const backupDirectory = join(
    publishedDirectoryParent,
    `.${publishedDirectoryName}.backup-${randomUUID()}`,
  );

  await renameDirectory(publishedDirectory, backupDirectory);

  try {
    await renameDirectory(stagingDirectory, publishedDirectory);
  } catch (publicationError) {
    await restorePublishedDirectory(
      backupDirectory,
      publishedDirectory,
      publicationError,
      renameDirectory,
    );
  }

  await rm(backupDirectory, { force: false, recursive: true });
}

async function restorePublishedDirectory(
  backupDirectory: string,
  publishedDirectory: string,
  publicationError: unknown,
  renameDirectory: RenameDirectory,
): Promise<never> {
  try {
    await renameDirectory(backupDirectory, publishedDirectory);
  } catch (restorationError) {
    throw new AggregateError(
      [publicationError, restorationError],
      `Asset publication failed for ${formatInvalidValue(publishedDirectory)} and the existing directory could not be restored from ${formatInvalidValue(backupDirectory)}.`,
    );
  }

  throw new Error(
    `Asset publication failed for ${formatInvalidValue(publishedDirectory)}. The existing directory was restored from ${formatInvalidValue(backupDirectory)}.`,
    { cause: publicationError },
  );
}

async function removeStagingDirectoryAfterFailure(
  stagingDirectory: string,
  synchronizationError: unknown,
): Promise<void> {
  try {
    await rm(stagingDirectory, { force: true, recursive: true });
  } catch (cleanupError) {
    throw new AggregateError(
      [synchronizationError, cleanupError],
      `Asset synchronization failed and staging directory cleanup also failed. Staging directory: ${formatInvalidValue(stagingDirectory)}.`,
    );
  }
}

function isDescendantPath(
  parentDirectory: string,
  candidatePath: string,
): boolean {
  const relativeCandidatePath = relative(parentDirectory, candidatePath);

  return (
    relativeCandidatePath !== "" &&
    !relativeCandidatePath.startsWith("..") &&
    !relativeCandidatePath.includes("\\")
  );
}

function isMissingFileError(filesystemError: unknown): boolean {
  return (
    typeof filesystemError === "object" &&
    filesystemError !== null &&
    "code" in filesystemError &&
    filesystemError.code === "ENOENT"
  );
}

function toHex(content: Uint8Array): string {
  return Buffer.from(content).toString("hex");
}

function formatInvalidValue(invalidValue: unknown): string {
  if (typeof invalidValue === "string") {
    return JSON.stringify(invalidValue);
  }

  try {
    return JSON.stringify(invalidValue);
  } catch (formattingError) {
    if (formattingError instanceof TypeError) {
      return String(invalidValue);
    }

    throw formattingError;
  }
}

function isAssetSyncCliEntry(): boolean {
  const executedScriptPath = process.argv[1];

  return (
    typeof executedScriptPath === "string" &&
    resolve(executedScriptPath) === fileURLToPath(import.meta.url)
  );
}

if (isAssetSyncCliEntry()) {
  void synchronizeAssets(
    sourceAssets,
    fetch as FetchImplementation,
    join("public", "game-assets", "1.6.15"),
  );
}
