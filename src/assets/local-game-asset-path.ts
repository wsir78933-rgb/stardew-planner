export const localGameAssetRootPath = "/game-assets/1.6.15" as const;

export type LocalGameAssetPath =
  `${typeof localGameAssetRootPath}/${string}`;

export function resolveLocalGameAssetPath(
  assetOutputPath: string,
): LocalGameAssetPath {
  assertRelativeAssetOutputPath(assetOutputPath);
  return `${localGameAssetRootPath}/${assetOutputPath}`;
}

function assertRelativeAssetOutputPath(assetOutputPath: string): void {
  const pathSegments = assetOutputPath.split("/");
  const hasInvalidPathSegment = pathSegments.some(
    (pathSegment) =>
      pathSegment.length === 0 || pathSegment === "." || pathSegment === "..",
  );

  if (
    assetOutputPath.length === 0
    || assetOutputPath.includes("\\")
    || hasInvalidPathSegment
  ) {
    throw new TypeError(
      `Local game asset output path must be a non-empty relative path with no backslashes, empty segments, ".", or ".." segments; received ${JSON.stringify(assetOutputPath)}.`,
    );
  }
}
