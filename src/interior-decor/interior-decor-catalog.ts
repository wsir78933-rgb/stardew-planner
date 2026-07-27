import type { InteriorDecorKind } from "./interior-decor-state";

export type InteriorDecorCatalogPattern = Readonly<{
  id: string;
  kind: InteriorDecorKind;
  name: string;
  patternId: string;
  previewRect: Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  textureLocalPath: string;
}>;

const localTilesheetRoot = "/game-assets/1.6.15/tilesheets";
const standardInteriorTilesheetPath =
  `${localTilesheetRoot}/walls_and_floors.png`;
const additionalWallpaperTilesheetPath =
  `${localTilesheetRoot}/wallpapers_2.png`;
const additionalFlooringTilesheetPath =
  `${localTilesheetRoot}/floors_2.png`;
const interiorTilesheetColumnCount = 16;
const standardFlooringStartY = 336;
const supportedInteriorDecorMapIds = new Set([
  "farmhouse-0",
  "farmhouse-1",
  "farmhouse-2",
  "shed",
  "big-shed",
  "island-farmhouse",
]);

export const interiorWallpaperPatterns = [
  ...createStandardWallpaperPatterns(),
  ...createAdditionalWallpaperPatterns(),
] as const satisfies readonly InteriorDecorCatalogPattern[];

export const interiorFlooringPatterns = [
  ...createStandardFlooringPatterns(),
  ...createAdditionalFlooringPatterns(),
] as const satisfies readonly InteriorDecorCatalogPattern[];

export function isInteriorDecorSupportedMapId(mapId: string): boolean {
  return supportedInteriorDecorMapIds.has(mapId);
}

function createStandardWallpaperPatterns(): readonly InteriorDecorCatalogPattern[] {
  return Array.from({ length: 112 }, (_, patternIndex) =>
    createWallpaperPattern({
      id: `wp_${String(patternIndex)}`,
      patternId: String(patternIndex),
      textureLocalPath: standardInteriorTilesheetPath,
      previewRect: getWallpaperPreviewRect(patternIndex),
    }),
  );
}

function createAdditionalWallpaperPatterns(): readonly InteriorDecorCatalogPattern[] {
  return Array.from({ length: 26 }, (_, patternIndex) =>
    createWallpaperPattern({
      id: `wp_MoreWalls:${String(patternIndex)}`,
      patternId: `MoreWalls:${String(patternIndex)}`,
      textureLocalPath: additionalWallpaperTilesheetPath,
      previewRect: getWallpaperPreviewRect(patternIndex),
    }),
  );
}

function createStandardFlooringPatterns(): readonly InteriorDecorCatalogPattern[] {
  return Array.from({ length: 88 }, (_, patternIndex) =>
    createFlooringPattern({
      id: `fl_${String(patternIndex)}`,
      patternId: String(patternIndex),
      textureLocalPath: standardInteriorTilesheetPath,
      previewRect: getFlooringPreviewRect(patternIndex, standardFlooringStartY),
    }),
  );
}

function createAdditionalFlooringPatterns(): readonly InteriorDecorCatalogPattern[] {
  return Array.from({ length: 9 }, (_, patternIndex) =>
    createFlooringPattern({
      id: `fl_MoreFloors:${String(patternIndex)}`,
      patternId: `MoreFloors:${String(patternIndex)}`,
      textureLocalPath: additionalFlooringTilesheetPath,
      previewRect: getFlooringPreviewRect(patternIndex, 0),
    }),
  );
}

function createWallpaperPattern(
  pattern: Omit<InteriorDecorCatalogPattern, "kind" | "name">,
): InteriorDecorCatalogPattern {
  return {
    ...pattern,
    kind: "wallpaper",
    name: `Wallpaper ${pattern.patternId}`,
  };
}

function createFlooringPattern(
  pattern: Omit<InteriorDecorCatalogPattern, "kind" | "name">,
): InteriorDecorCatalogPattern {
  return {
    ...pattern,
    kind: "flooring",
    name: `Flooring ${pattern.patternId}`,
  };
}

function getWallpaperPreviewRect(
  patternIndex: number,
): InteriorDecorCatalogPattern["previewRect"] {
  return {
    x: (patternIndex % interiorTilesheetColumnCount) * 16,
    y: Math.floor(patternIndex / interiorTilesheetColumnCount) * 48 + 8,
    width: 16,
    height: 28,
  };
}

function getFlooringPreviewRect(
  patternIndex: number,
  startY: number,
): InteriorDecorCatalogPattern["previewRect"] {
  return {
    x: (patternIndex % 8) * 32,
    y: Math.floor(patternIndex / 8) * 32 + startY,
    width: 28,
    height: 26,
  };
}
