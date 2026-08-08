const verifiedStartupWebpPathByPngPath = new Map<string, string>([
  [
    "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet.png",
    "/planner-textures/initial/spring_outdoorsTileSheet.webp",
  ],
  [
    "/game-assets/1.6.15/tilesheets/spring_outdoorsTileSheet2.png",
    "/planner-textures/initial/spring_outdoorsTileSheet2.webp",
  ],
  [
    "/game-assets/1.6.15/sprites/springobjects.png",
    "/planner-textures/initial/springobjects.webp",
  ],
  [
    "/game-assets/1.6.15/sprites/Cursors.png",
    "/planner-textures/initial/Cursors.webp",
  ],
]);

export function resolveInitialPlannerTextureAssetPath(
  textureAssetPath: string,
): string {
  if (typeof textureAssetPath !== "string" || textureAssetPath.length === 0) {
    throw new TypeError(
      `Planner texture asset path must be a non-empty string; received ${JSON.stringify(textureAssetPath)}.`,
    );
  }

  return verifiedStartupWebpPathByPngPath.get(textureAssetPath) ?? textureAssetPath;
}
