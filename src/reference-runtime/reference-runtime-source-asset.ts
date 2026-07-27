const referenceRuntimeMediaTypes = [
  "application/javascript",
  "application/json",
  "application/xml",
  "image/png",
  "text/css",
] as const;

const stardewPlanOrigin = "https://stardewplan.com";
const stardewPlanAssetsOrigin = "https://assets.stardewplan.com";
const immutableRuntimePathPrefix = "/_app/immutable/";
const sameOriginAssetPathPrefixes = ["/assets/", "/img/"] as const;
const gameAssetPathPrefix = "/assets/1.6.15/";
const explicitlyAuthorisedSameOriginPaths = new Set([
  "/favicon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
]);

export type ReferenceRuntimeMediaType =
  (typeof referenceRuntimeMediaTypes)[number];

export type ReferenceRuntimeSourceAsset = {
  sourceUrl: string;
  publicOutputPath: string;
  mediaType: ReferenceRuntimeMediaType;
};

export function createReferenceRuntimeSourceAsset(
  sourceUrl: string,
): ReferenceRuntimeSourceAsset {
  const sourceUrlRecord = validateReferenceRuntimeSourceUrl(sourceUrl);
  const publicOutputPath = getPublicOutputPath(sourceUrlRecord);
  const mediaType = getReferenceRuntimeMediaType(publicOutputPath);

  return { sourceUrl, publicOutputPath, mediaType };
}

export function validateReferenceRuntimeSourceAsset(
  sourceAsset: ReferenceRuntimeSourceAsset,
): void {
  if (
    typeof sourceAsset !== "object" ||
    sourceAsset === null ||
    Array.isArray(sourceAsset)
  ) {
    throw new TypeError(
      `Reference runtime source asset must be a non-null object. Received: ${formatInvalidValue(sourceAsset)}.`,
    );
  }

  const sourceUrlRecord = validateReferenceRuntimeSourceUrl(sourceAsset.sourceUrl);
  const expectedPublicOutputPath = getPublicOutputPath(sourceUrlRecord);

  if (sourceAsset.publicOutputPath !== expectedPublicOutputPath) {
    throw new TypeError(
      `Reference runtime public output path must match its source URL. Received public output path: ${formatInvalidValue(sourceAsset.publicOutputPath)}. Expected: ${formatInvalidValue(expectedPublicOutputPath)}.`,
    );
  }

  const expectedMediaType = getReferenceRuntimeMediaType(
    sourceAsset.publicOutputPath,
  );

  if (sourceAsset.mediaType !== expectedMediaType) {
    throw new TypeError(
      `Reference runtime media type must match its public output path. Received media type: ${formatInvalidValue(sourceAsset.mediaType)}. Expected: ${formatInvalidValue(expectedMediaType)}.`,
    );
  }
}

export function validateReferenceRuntimePublicOutputPaths(
  sourceAssets: readonly ReferenceRuntimeSourceAsset[],
): void {
  const sourceAssetByCanonicalOutputPath = new Map<
    string,
    ReferenceRuntimeSourceAsset
  >();

  for (const sourceAsset of sourceAssets) {
    validateReferenceRuntimeSourceAsset(sourceAsset);
    const canonicalOutputPath = getCanonicalPublicOutputPath(
      sourceAsset.publicOutputPath,
    );
    const existingSourceAsset = sourceAssetByCanonicalOutputPath.get(
      canonicalOutputPath,
    );

    if (existingSourceAsset !== undefined) {
      throw new TypeError(
        `Reference runtime public output paths cannot duplicate after NFC and en-US lowercase canonicalization. Received conflicting paths: ${formatInvalidValue(existingSourceAsset.publicOutputPath)} and ${formatInvalidValue(sourceAsset.publicOutputPath)}.`,
      );
    }

    sourceAssetByCanonicalOutputPath.set(canonicalOutputPath, sourceAsset);
  }
}

export function getReferenceRuntimeSourceUrlForPublicOutputPath(
  publicOutputPath: string,
): string {
  if (typeof publicOutputPath !== "string" || publicOutputPath.length === 0) {
    throw new TypeError(
      `Reference runtime public output path must be a non-empty string. Received: ${formatInvalidValue(publicOutputPath)}.`,
    );
  }

  const sourceUrl = new URL(`/${publicOutputPath}`, stardewPlanOrigin).href;
  const sourceAsset = createReferenceRuntimeSourceAsset(sourceUrl);

  if (sourceAsset.publicOutputPath !== publicOutputPath) {
    throw new TypeError(
      `Reference runtime public output path must be canonical. Received: ${formatInvalidValue(publicOutputPath)}.`,
    );
  }

  return sourceUrl;
}

export function getCanonicalReferenceRuntimePublicOutputPath(
  publicOutputPath: string,
): string {
  return getCanonicalPublicOutputPath(publicOutputPath);
}

export function isReferenceRuntimeMediaType(
  mediaType: string,
): mediaType is ReferenceRuntimeMediaType {
  return referenceRuntimeMediaTypes.includes(
    mediaType as ReferenceRuntimeMediaType,
  );
}

function validateReferenceRuntimeSourceUrl(sourceUrl: string): URL {
  if (typeof sourceUrl !== "string" || sourceUrl.length === 0) {
    throw new TypeError(
      `Reference runtime source URL must be a non-empty string. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  if (sourceUrl.includes("\\")) {
    throw new TypeError(
      `Reference runtime source URL pathname cannot contain a backslash. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  let parsedSourceUrl: URL;

  try {
    parsedSourceUrl = new URL(sourceUrl);
  } catch (urlParsingError) {
    throw new TypeError(
      `Reference runtime source URL must be a valid absolute URL. Received: ${formatInvalidValue(sourceUrl)}.`,
      { cause: urlParsingError },
    );
  }

  if (parsedSourceUrl.protocol !== "https:") {
    throw new TypeError(
      `Reference runtime source URL must use HTTPS. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  if (
    parsedSourceUrl.origin !== stardewPlanOrigin &&
    parsedSourceUrl.origin !== stardewPlanAssetsOrigin
  ) {
    throw new TypeError(
      `Reference runtime source URL must use an authorised StardewPlan origin. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  if (parsedSourceUrl.username !== "" || parsedSourceUrl.password !== "") {
    throw new TypeError(
      `Reference runtime source URL cannot contain credentials. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  if (parsedSourceUrl.search !== "" || sourceUrl.includes("?")) {
    throw new TypeError(
      `Reference runtime source URL cannot contain a query string. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  if (parsedSourceUrl.hash !== "" || sourceUrl.includes("#")) {
    throw new TypeError(
      `Reference runtime source URL cannot contain a hash fragment. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  const sourceUrlPathnameExpression = getSourceUrlPathnameExpression(sourceUrl);
  validateSourceUrlPathnameExpression(sourceUrlPathnameExpression, sourceUrl);
  validateAuthorisedSourceUrlPath(parsedSourceUrl, sourceUrl);

  return parsedSourceUrl;
}

function getSourceUrlPathnameExpression(sourceUrl: string): string {
  const authorityStartIndex = sourceUrl.indexOf("//");
  const authorityEndOffset = sourceUrl
    .slice(authorityStartIndex + 2)
    .search(/[/?#]/);

  if (authorityStartIndex === -1 || authorityEndOffset === -1) {
    return authorityEndOffset === -1
      ? ""
      : sourceUrl.slice(authorityStartIndex + 2 + authorityEndOffset);
  }

  const pathnameStartIndex = authorityStartIndex + 2 + authorityEndOffset;
  const pathnameEndOffset = sourceUrl
    .slice(pathnameStartIndex)
    .search(/[?#]/);

  return pathnameEndOffset === -1
    ? sourceUrl.slice(pathnameStartIndex)
    : sourceUrl.slice(pathnameStartIndex, pathnameStartIndex + pathnameEndOffset);
}

function validateSourceUrlPathnameExpression(
  pathnameExpression: string,
  sourceUrl: string,
): void {
  let decodedPathnameExpression = pathnameExpression;

  while (true) {
    validatePathnameSegments(decodedPathnameExpression, sourceUrl);

    if (!decodedPathnameExpression.includes("%")) {
      return;
    }

    let nextDecodedPathnameExpression: string;

    try {
      nextDecodedPathnameExpression = decodeURIComponent(
        decodedPathnameExpression,
      );
    } catch (decodingError) {
      throw new TypeError(
        `Reference runtime source URL pathname must use valid percent escapes. Received: ${formatInvalidValue(sourceUrl)}.`,
        { cause: decodingError },
      );
    }

    validatePercentEscapedPathCharacters(
      decodedPathnameExpression,
      sourceUrl,
    );

    if (nextDecodedPathnameExpression === decodedPathnameExpression) {
      return;
    }

    decodedPathnameExpression = nextDecodedPathnameExpression;
  }
}

function validatePercentEscapedPathCharacters(
  pathnameExpression: string,
  sourceUrl: string,
): void {
  for (
    let characterIndex = 0;
    characterIndex < pathnameExpression.length;
    characterIndex += 1
  ) {
    if (pathnameExpression[characterIndex] !== "%") {
      continue;
    }

    const encodedByte = pathnameExpression.slice(
      characterIndex + 1,
      characterIndex + 3,
    );

    if (!/^[0-9a-f]{2}$/i.test(encodedByte)) {
      throw new TypeError(
        `Reference runtime source URL pathname must use valid percent escapes. Received: ${formatInvalidValue(sourceUrl)}.`,
      );
    }

    const decodedCharacter = String.fromCharCode(
      Number.parseInt(encodedByte, 16),
    );

    if (
      decodedCharacter === "/" ||
      decodedCharacter === "\\" ||
      decodedCharacter === "."
    ) {
      throw new TypeError(
        `Reference runtime source URL pathname cannot percent-encode a slash, backslash, or dot. Received: ${formatInvalidValue(sourceUrl)}.`,
      );
    }

    characterIndex += 2;
  }
}

function validatePathnameSegments(
  pathnameExpression: string,
  sourceUrl: string,
): void {
  if (pathnameExpression.includes("\\")) {
    throw new TypeError(
      `Reference runtime source URL pathname cannot contain a backslash. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }

  if (
    pathnameExpression
      .split("/")
      .some((pathSegment) => pathSegment === "." || pathSegment === "..")
  ) {
    throw new TypeError(
      `Reference runtime source URL pathname cannot contain "." or ".." path segments. Received: ${formatInvalidValue(sourceUrl)}.`,
    );
  }
}

function validateAuthorisedSourceUrlPath(
  sourceUrl: URL,
  sourceUrlText: string,
): void {
  if (sourceUrl.origin === stardewPlanAssetsOrigin) {
    if (!sourceUrl.pathname.startsWith(gameAssetPathPrefix)) {
      throw new TypeError(
        `Reference runtime source URL must stay below ${gameAssetPathPrefix}. Received: ${formatInvalidValue(sourceUrlText)}.`,
      );
    }

    return;
  }

  if (
    sourceUrl.pathname.startsWith(immutableRuntimePathPrefix) ||
    sameOriginAssetPathPrefixes.some((pathPrefix) =>
      sourceUrl.pathname.startsWith(pathPrefix),
    ) ||
    explicitlyAuthorisedSameOriginPaths.has(sourceUrl.pathname)
  ) {
    return;
  }

  throw new TypeError(
    `Reference runtime source URL must stay below an authorised StardewPlan path. Received: ${formatInvalidValue(sourceUrlText)}.`,
  );
}

function getPublicOutputPath(sourceUrl: URL): string {
  const decodedPathname = decodeURIComponent(sourceUrl.pathname);
  const publicOutputPath =
    sourceUrl.origin === stardewPlanAssetsOrigin
      ? `assets/${decodedPathname.slice(gameAssetPathPrefix.length)}`
      : decodedPathname.slice(1);

  if (publicOutputPath.length === 0) {
    throw new TypeError(
      `Reference runtime source URL must identify a file. Received pathname: ${formatInvalidValue(sourceUrl.pathname)}.`,
    );
  }

  return publicOutputPath;
}

function getReferenceRuntimeMediaType(
  publicOutputPath: string,
): ReferenceRuntimeMediaType {
  if (publicOutputPath.endsWith(".js") || publicOutputPath.endsWith(".mjs")) {
    return "application/javascript";
  }

  if (publicOutputPath.endsWith(".css")) {
    return "text/css";
  }

  if (publicOutputPath.endsWith(".png")) {
    return "image/png";
  }

  if (publicOutputPath.endsWith(".json")) {
    return "application/json";
  }

  if (publicOutputPath.endsWith(".tmx")) {
    return "application/xml";
  }

  throw new TypeError(
    `Reference runtime source URL has an unrecognised content type. Received public output path: ${formatInvalidValue(publicOutputPath)}.`,
  );
}

function getCanonicalPublicOutputPath(publicOutputPath: string): string {
  return publicOutputPath
    .split("/")
    .map((pathSegment) =>
      pathSegment.normalize("NFC").toLocaleLowerCase("en-US"),
    )
    .join("/");
}

function formatInvalidValue(invalidValue: unknown): string {
  if (typeof invalidValue === "string") {
    return JSON.stringify(invalidValue);
  }

  try {
    return JSON.stringify(invalidValue);
  } catch {
    return String(invalidValue);
  }
}
