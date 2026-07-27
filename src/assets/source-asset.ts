const allowedSourceAssetMediaTypes = [
  "application/json",
  "application/xml",
  "image/png",
] as const;

const approvedAssetOrigin = "https://assets.stardewplan.com";
const lockedAssetPathPrefix = "/assets/1.6.15/";

export type SourceAssetMediaType =
  (typeof allowedSourceAssetMediaTypes)[number];

export type SourceAsset = {
  sourceUrl: string;
  outputPath: string;
  mediaType: SourceAssetMediaType;
};

export function validateSourceAsset(sourceAsset: SourceAsset): void {
  validateSourceAssetObject(sourceAsset);

  const sourceUrlText = validateSourceUrlText(sourceAsset.sourceUrl);
  const sourceUrl = parseSourceUrl(sourceUrlText);

  validateSourceUrlProtocol(sourceUrl, sourceUrlText);
  validateSourceUrlOrigin(sourceUrl, sourceUrlText);
  validateSourceUrlCredentials(sourceUrl, sourceUrlText);
  validateSourceUrlSearch(sourceUrl, sourceUrlText);
  validateSourceUrlHash(sourceUrl, sourceUrlText);
  const sourceUrlPathnameExpression = getSourceUrlPathnameExpression(
    sourceUrlText,
  );
  validateSourceUrlPath(sourceUrlPathnameExpression, sourceUrlText);
  validateOutputPath(sourceAsset.outputPath);
  validateSourceAssetMediaType(sourceAsset.mediaType);
}

function validateSourceAssetObject(sourceAsset: SourceAsset): void {
  if (typeof sourceAsset !== "object" || sourceAsset === null) {
    throw new TypeError(
      `Source asset must be a non-null object. Received: ${formatInvalidValue(sourceAsset)}.`,
    );
  }

  const requiredPropertyNames = [
    "sourceUrl",
    "outputPath",
    "mediaType",
  ] as const;

  for (const requiredPropertyName of requiredPropertyNames) {
    if (!Object.hasOwn(sourceAsset, requiredPropertyName)) {
      throw new TypeError(
        `Source asset must include own property ${requiredPropertyName}. Received: ${formatInvalidValue(sourceAsset)}.`,
      );
    }
  }
}

function validateSourceUrlText(sourceUrl: string): string {
  if (typeof sourceUrl !== "string" || sourceUrl.length === 0) {
    throw new TypeError(
      `Source asset URL must be a non-empty string. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  return sourceUrl;
}

function parseSourceUrl(sourceUrlText: string): URL {
  try {
    return new URL(sourceUrlText);
  } catch (urlParsingError) {
    const parsingMessage =
      urlParsingError instanceof Error
        ? urlParsingError.message
        : formatInvalidValue(urlParsingError);

    throw new TypeError(
      `Source asset URL must be a valid absolute URL. Received: ${formatInvalidValue(sourceUrlText)}. Parsing failed: ${parsingMessage}`,
      { cause: urlParsingError },
    );
  }
}

function validateSourceUrlProtocol(sourceUrl: URL, sourceUrlText: string): void {
  if (sourceUrl.protocol !== "https:") {
    throw new TypeError(
      `Source asset URL must use HTTPS. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }
}

function validateSourceUrlOrigin(sourceUrl: URL, sourceUrlText: string): void {
  if (sourceUrl.origin !== approvedAssetOrigin) {
    throw new TypeError(
      `Source asset URL must use origin ${approvedAssetOrigin}. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }
}

function validateSourceUrlCredentials(sourceUrl: URL, sourceUrlText: string): void {
  if (sourceUrl.username !== "" || sourceUrl.password !== "") {
    throw new TypeError(
      `Source asset URL cannot contain a username or password. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }
}

function validateSourceUrlSearch(sourceUrl: URL, sourceUrlText: string): void {
  if (sourceUrl.search !== "" || sourceUrlText.includes("?")) {
    throw new TypeError(
      `Source asset URL cannot contain a query string. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }
}

function validateSourceUrlHash(sourceUrl: URL, sourceUrlText: string): void {
  if (sourceUrl.hash !== "" || sourceUrlText.includes("#")) {
    throw new TypeError(
      `Source asset URL cannot contain a hash fragment. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }
}

function getSourceUrlPathnameExpression(sourceUrlText: string): string {
  const authorityStartIndex = sourceUrlText.indexOf("//");
  const authorityEndIndex = findAuthorityEndIndex(
    sourceUrlText,
    authorityStartIndex,
  );
  const pathnameEndIndex = findPathnameEndIndex(
    sourceUrlText,
    authorityEndIndex,
  );

  return sourceUrlText.slice(authorityEndIndex, pathnameEndIndex);
}

function findAuthorityEndIndex(
  sourceUrlText: string,
  authorityStartIndex: number,
): number {
  if (authorityStartIndex === -1) {
    throw new TypeError(
      `Source asset URL must use an authority-based absolute URL. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }

  const authorityContentStartIndex = authorityStartIndex + 2;
  const authorityEndOffset = sourceUrlText
    .slice(authorityContentStartIndex)
    .search(/[/?#]/);

  if (authorityEndOffset === -1) {
    return sourceUrlText.length;
  }

  return authorityContentStartIndex + authorityEndOffset;
}

function findPathnameEndIndex(
  sourceUrlText: string,
  pathnameStartIndex: number,
): number {
  const pathnameEndOffset = sourceUrlText
    .slice(pathnameStartIndex)
    .search(/[?#]/);

  if (pathnameEndOffset === -1) {
    return sourceUrlText.length;
  }

  return pathnameStartIndex + pathnameEndOffset;
}

function validateSourceUrlPath(
  sourceUrlPathnameExpression: string,
  sourceUrlText: string,
): void {
  if (!sourceUrlPathnameExpression.startsWith(lockedAssetPathPrefix)) {
    throw new TypeError(
      `Source asset URL must use path prefix ${lockedAssetPathPrefix}. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }

  if (sourceUrlPathnameExpression.includes("\\")) {
    throw new TypeError(
      `Source asset URL pathname cannot contain a backslash. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }

  if (sourceUrlPathnameExpression.split("/").some(isDotPathSegment)) {
    throw new TypeError(
      `Source asset URL pathname cannot contain "." or ".." path segments. Received: ${formatInvalidValue(sourceUrlText)}.`,
    );
  }

  validatePercentEncodedPathExpression(
    sourceUrlPathnameExpression,
    sourceUrlText,
  );
}

function validatePercentEncodedPathExpression(
  sourceUrlPathnameExpression: string,
  sourceUrlText: string,
): void {
  let recursivelyDecodedPathnameExpression = sourceUrlPathnameExpression;

  while (recursivelyDecodedPathnameExpression.includes("%")) {
    recursivelyDecodedPathnameExpression = decodePercentEscapes(
      recursivelyDecodedPathnameExpression,
      sourceUrlText,
    );
  }
}

function decodePercentEscapes(
  pathnameExpression: string,
  sourceUrlText: string,
): string {
  let decodedPathnameExpression = "";

  for (
    let characterIndex = 0;
    characterIndex < pathnameExpression.length;
    characterIndex += 1
  ) {
    const pathnameCharacter = pathnameExpression[characterIndex];

    if (pathnameCharacter !== "%") {
      decodedPathnameExpression += pathnameCharacter;
      continue;
    }

    const encodedCharacter = pathnameExpression.slice(
      characterIndex + 1,
      characterIndex + 3,
    );

    if (!isHexadecimalByte(encodedCharacter)) {
      throw new TypeError(
        `Source asset URL pathname must use valid percent escapes. Received: ${formatInvalidValue(sourceUrlText)}.`,
      );
    }

    const decodedCharacterCode = Number.parseInt(encodedCharacter, 16);

    if (isUnsafeEncodedPathCharacter(decodedCharacterCode)) {
      throw new TypeError(
        `Source asset URL pathname cannot percent-encode a slash, backslash, or dot. Received: ${formatInvalidValue(sourceUrlText)}.`,
      );
    }

    decodedPathnameExpression += String.fromCharCode(decodedCharacterCode);
    characterIndex += 2;
  }

  return decodedPathnameExpression;
}

function isHexadecimalByte(encodedCharacter: string): boolean {
  return /^[0-9A-Fa-f]{2}$/.test(encodedCharacter);
}

function isUnsafeEncodedPathCharacter(decodedCharacterCode: number): boolean {
  return (
    decodedCharacterCode === 0x2f ||
    decodedCharacterCode === 0x5c ||
    decodedCharacterCode === 0x2e
  );
}

function validateOutputPath(outputPath: string): void {
  if (typeof outputPath !== "string" || outputPath.length === 0) {
    throw new TypeError(
      `Source asset output path must be a non-empty relative path. Received: ${formatInvalidValue(outputPath)}.`,
    );
  }

  if (outputPath.startsWith("/")) {
    throw new TypeError(
      `Source asset output path cannot start with "/". Received: ${formatInvalidValue(outputPath)}.`,
    );
  }

  if (isWindowsDrivePath(outputPath)) {
    throw new TypeError(
      `Source asset output path cannot use a Windows drive prefix. Received: ${formatInvalidValue(outputPath)}.`,
    );
  }

  if (outputPath.includes("\0")) {
    throw new TypeError(
      `Source asset output path cannot contain a NUL character. Received: ${formatInvalidValue(outputPath)}.`,
    );
  }

  if (outputPath.includes("\\")) {
    throw new TypeError(
      `Source asset output path cannot contain a backslash. Received: ${formatInvalidValue(outputPath)}.`,
    );
  }

  if (outputPath.split("/").some(isEmptyPathSegment)) {
    throw new TypeError(
      `Source asset output path cannot contain an empty path segment. Received: ${formatInvalidValue(outputPath)}.`,
    );
  }

  if (outputPath.split("/").some(isDotPathSegment)) {
    throw new TypeError(
      `Source asset output path cannot contain "." or ".." path segments. Received: ${formatInvalidValue(outputPath)}.`,
    );
  }
}

function isDotPathSegment(pathSegment: string): boolean {
  return pathSegment === "." || pathSegment === "..";
}

function isEmptyPathSegment(pathSegment: string): boolean {
  return pathSegment.length === 0;
}

function isWindowsDrivePath(outputPath: string): boolean {
  return /^[A-Za-z]:/.test(outputPath);
}

function validateSourceAssetMediaType(mediaType: SourceAssetMediaType): void {
  if (!allowedSourceAssetMediaTypes.includes(mediaType)) {
    throw new TypeError(
      `Source asset media type must be one of ${allowedSourceAssetMediaTypes.join(", ")}. Received: ${formatInvalidValue(mediaType)}.`,
    );
  }
}

function formatInvalidValue(invalidValue: unknown): string {
  if (typeof invalidValue === "string") {
    return `"${invalidValue}"`;
  }

  if (typeof invalidValue === "object" && invalidValue !== null) {
    return formatInvalidObject(invalidValue);
  }

  return String(invalidValue);
}

function formatInvalidObject(invalidObject: object): string {
  try {
    const serializedObject = JSON.stringify(invalidObject);

    return serializedObject ?? String(invalidObject);
  } catch (serializationError) {
    if (serializationError instanceof TypeError) {
      return Object.prototype.toString.call(invalidObject);
    }

    throw serializationError;
  }
}
