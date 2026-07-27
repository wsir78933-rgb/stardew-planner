import {
  validateSourceAsset,
  type SourceAssetMediaType,
} from "./source-asset";

export const assetLockFileName = "asset-lock.json";

export type AssetLockEntry = {
  sourceUrl: string;
  outputPath: string;
  mediaType: SourceAssetMediaType;
  sha256: string;
};

export type AssetLock = {
  assets: AssetLockEntry[];
};

export function createAssetLock(
  assetLockEntries: readonly AssetLockEntry[],
): AssetLock {
  const assetLock = { assets: [...assetLockEntries] };
  validateAssetLock(assetLock);

  return assetLock;
}

export function parseAssetLock(assetLockContents: string): AssetLock {
  if (typeof assetLockContents !== "string") {
    throw new TypeError(
      `Asset lock contents must be a string. Received: ${formatInvalidValue(assetLockContents)}.`,
    );
  }

  let parsedAssetLock: unknown;

  try {
    parsedAssetLock = JSON.parse(assetLockContents);
  } catch (parsingError) {
    if (parsingError instanceof SyntaxError) {
      throw new TypeError(
        `Asset lock must contain valid JSON. Received: ${formatInvalidValue(assetLockContents)}. Parsing failed: ${parsingError.message}`,
        { cause: parsingError },
      );
    }

    throw parsingError;
  }

  validateAssetLock(parsedAssetLock);

  return {
    assets: parsedAssetLock.assets.map((assetLockEntry) => ({
      sourceUrl: assetLockEntry.sourceUrl,
      outputPath: assetLockEntry.outputPath,
      mediaType: assetLockEntry.mediaType,
      sha256: assetLockEntry.sha256,
    })),
  };
}

export function serializeAssetLock(assetLock: AssetLock): string {
  validateAssetLock(assetLock);

  return `${JSON.stringify(assetLock, null, 2)}\n`;
}

export function validateAssetLock(assetLock: unknown): asserts assetLock is AssetLock {
  validateAssetLockObject(assetLock);
  validateAssetLockKeys(assetLock);
  validateAssetLockEntries(assetLock.assets);
}

export function validateAssetOutputPaths(
  assetOutputPaths: readonly string[],
): void {
  const acceptedOutputPaths: Array<{
    originalOutputPath: string;
    canonicalOutputPath: string;
  }> = [];

  for (const assetOutputPath of assetOutputPaths) {
    validateAssetLockOutputPath(assetOutputPath);
    const canonicalOutputPath = getCanonicalAssetOutputPath(assetOutputPath);

    const conflictingOutputPath = acceptedOutputPaths.find(
      (acceptedOutputPath) =>
        acceptedOutputPath.canonicalOutputPath === canonicalOutputPath ||
        acceptedOutputPath.canonicalOutputPath.startsWith(
          `${canonicalOutputPath}/`,
        ) ||
        canonicalOutputPath.startsWith(
          `${acceptedOutputPath.canonicalOutputPath}/`,
        ),
    );

    if (conflictingOutputPath !== undefined) {
      throw new TypeError(
        `Asset output paths cannot duplicate or overlap as ancestor and descendant paths after NFC and en-US lowercase canonicalization. Received conflicting output paths: ${formatInvalidValue(conflictingOutputPath.originalOutputPath)} and ${formatInvalidValue(assetOutputPath)}.`,
      );
    }

    acceptedOutputPaths.push({
      originalOutputPath: assetOutputPath,
      canonicalOutputPath,
    });
  }
}

export function getCanonicalAssetOutputPath(assetOutputPath: string): string {
  return assetOutputPath
    .split("/")
    .map((pathSegment) => pathSegment.normalize("NFC").toLocaleLowerCase("en-US"))
    .join("/");
}

function validateAssetLockObject(assetLock: unknown): asserts assetLock is {
  assets: unknown;
} {
  if (typeof assetLock !== "object" || assetLock === null || Array.isArray(assetLock)) {
    throw new TypeError(
      `Asset lock must be a non-null object. Received: ${formatInvalidValue(assetLock)}.`,
    );
  }
}

function validateAssetLockKeys(assetLock: { assets: unknown }): void {
  const assetLockKeys = Object.keys(assetLock);

  if (assetLockKeys.length !== 1 || assetLockKeys[0] !== "assets") {
    throw new TypeError(
      `Asset lock must contain exactly the "assets" field. Received fields: ${formatInvalidValue(assetLockKeys)}.`,
    );
  }
}

function validateAssetLockEntries(
  assetLockEntries: unknown,
): asserts assetLockEntries is AssetLockEntry[] {
  if (!Array.isArray(assetLockEntries)) {
    throw new TypeError(
      `Asset lock "assets" must be an array. Received: ${formatInvalidValue(assetLockEntries)}.`,
    );
  }

  for (const assetLockEntry of assetLockEntries) {
    validateAssetLockEntry(assetLockEntry);
  }

  validateAssetOutputPaths(
    assetLockEntries.map((assetLockEntry) => assetLockEntry.outputPath),
  );
}

function validateAssetLockOutputPath(assetOutputPath: string): void {
  const canonicalOutputPath = getCanonicalAssetOutputPath(assetOutputPath);
  const canonicalAssetLockFileName = getCanonicalAssetOutputPath(assetLockFileName);

  if (
    canonicalOutputPath === canonicalAssetLockFileName ||
    canonicalOutputPath.startsWith(`${canonicalAssetLockFileName}/`)
  ) {
    throw new TypeError(
      `Asset output path cannot write the asset lock or a child path below it. Received: ${formatInvalidValue(assetOutputPath)}.`,
    );
  }
}

function validateAssetLockEntry(
  assetLockEntry: unknown,
): asserts assetLockEntry is AssetLockEntry {
  if (
    typeof assetLockEntry !== "object" ||
    assetLockEntry === null ||
    Array.isArray(assetLockEntry)
  ) {
    throw new TypeError(
      `Asset lock entry must be a non-null object. Received: ${formatInvalidValue(assetLockEntry)}.`,
    );
  }

  const assetLockEntryKeys = Object.keys(assetLockEntry).sort();
  const expectedAssetLockEntryKeys = [
    "mediaType",
    "outputPath",
    "sha256",
    "sourceUrl",
  ];

  if (
    assetLockEntryKeys.length !== expectedAssetLockEntryKeys.length ||
    assetLockEntryKeys.some(
      (assetLockEntryKey, keyIndex) =>
        assetLockEntryKey !== expectedAssetLockEntryKeys[keyIndex],
    )
  ) {
    throw new TypeError(
      `Asset lock entry must contain sourceUrl, outputPath, mediaType, and sha256 only. Received fields: ${formatInvalidValue(assetLockEntryKeys)}.`,
    );
  }

  const candidateAssetLockEntry = assetLockEntry as Record<string, unknown>;
  const sourceAsset = {
    sourceUrl: candidateAssetLockEntry.sourceUrl,
    outputPath: candidateAssetLockEntry.outputPath,
    mediaType: candidateAssetLockEntry.mediaType,
  } as AssetLockEntry;

  validateSourceAsset(sourceAsset);

  if (
    typeof candidateAssetLockEntry.sha256 !== "string" ||
    !/^[a-f0-9]{64}$/.test(candidateAssetLockEntry.sha256)
  ) {
    throw new TypeError(
      `Asset lock entry sha256 must be a 64-character lowercase hexadecimal hash. Received: ${formatInvalidValue(candidateAssetLockEntry.sha256)}.`,
    );
  }
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
