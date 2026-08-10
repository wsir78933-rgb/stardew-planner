const publicPreviewRoot = "/public-previews/1.6.15/";

export function createPublicPreviewSource(previewOutputPath: string): string {
  if (
    previewOutputPath.length === 0 ||
    previewOutputPath.startsWith("/") ||
    previewOutputPath.endsWith("/") ||
    previewOutputPath.includes("\\") ||
    previewOutputPath.split("/").includes("..") ||
    !previewOutputPath.endsWith(".png")
  ) {
    throw new Error(
      `Public preview output path must be a relative PNG path without traversal. Received: ${JSON.stringify(previewOutputPath)}.`,
    );
  }

  return `${publicPreviewRoot}${previewOutputPath.slice(0, -4)}.webp`;
}
