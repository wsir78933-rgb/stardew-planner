import { renderingRuntimeAssetOutputPaths } from "../assets/rendering-runtime-manifest";

const localAssetRoot = "/game-assets/1.6.15/";

const plannerSeasons = ["spring", "summer", "fall", "winter"] as const;

const officialSeasonalTilesheetBasenames = new Set<string>([
  "outdoorsTileSheet",
  "outdoorsTileSheet2",
  "outdoorTileSheet_extra",
  "Waterfalls",
  "town",
  "Shadows",
  "beach",
  "island_tilesheet_1",
]);

const officialNonSeasonalTilesheetBasenames = new Set<string>([
  "townInterior",
  "townInterior_2",
  "farmhouse_tiles",
  "walls_and_floors",
  "wallpapers_2",
  "floors_2",
  "coopTiles",
  "SewerTiles",
  "mine",
  "Farm Obelisk",
]);

const daisyextrasSpringFallbackModIds = new Set<string>([
  "aimon111.aimonssmallhilltopfarm",
  "archibaldtk.waterfallforestfarm",
  "collingbe.seabreezefarmmapislandfarm",
  "daisyniko.blackberryfieldsfarm",
  "daisyniko.capitalistdreamfarm2",
  "daisyniko.overgrowngardenfarm",
  "daisyniko.solofourcornersfarm",
  "daisyniko.strawberryfieldsfarm",
  "daisyniko.yetanotherfarmmap",
  "daisyniko.zenithfarm",
]);

const waterfallForestSpringFallbackTilesheetBasenames = new Set<string>([
  "ATK_AToMS_EXground",
  "ATK_AToMS_EXaqua",
  "ATK_AToMS_foliage",
  "ATK_AToMS_EXmisc",
]);

const modestMapsPublicTilesheetOutputPathBySource = new Map<string, string>([
  [".paths.png", "tilesheets/paths.png"],
  [
    ".spring_outdoorsTileSheet.png",
    "tilesheets/spring_outdoorsTileSheet.png",
  ],
]);

const lockedRenderingOutputPaths = new Set(renderingRuntimeAssetOutputPaths);

const knownUnavailableTilesheetReasonByOutputPath = new Map<string, string>([
  [
    "mods/daisyniko.capitalistdreamfarm2/DesertTiles.png",
    "The locked Stardew Planner 1.6.15 source returned HTTP 404 for this required tilesheet.",
  ],
]);

export type TilesheetSeason = (typeof plannerSeasons)[number];

export type TilesheetAssetRequest = Readonly<{
  tilesetSource: string;
  season: TilesheetSeason;
  modId: string | null;
}>;

export type LocalTilesheetAsset = Readonly<{
  localPath: string;
  usedSpringFallback: boolean;
  knownUnavailable?: never;
}>;

export type KnownUnavailableTilesheetAsset = Readonly<{
  localPath?: never;
  usedSpringFallback?: never;
  knownUnavailable: Readonly<{
    outputPath: string;
    reason: string;
  }>;
}>;

export type ResolvedTilesheetAsset =
  | LocalTilesheetAsset
  | KnownUnavailableTilesheetAsset;

export function resolveTilesheetAsset(
  tilesheetAssetRequest: TilesheetAssetRequest,
): ResolvedTilesheetAsset {
  validateTilesheetAssetRequest(tilesheetAssetRequest);

  const outputPath = resolveTilesheetOutputPath(tilesheetAssetRequest);
  return resolveManifestBackedAsset(outputPath, tilesheetAssetRequest);
}

export function isKnownUnavailableTilesheetAsset(
  resolvedTilesheetAsset: ResolvedTilesheetAsset,
): resolvedTilesheetAsset is KnownUnavailableTilesheetAsset {
  return "knownUnavailable" in resolvedTilesheetAsset;
}

function validateTilesheetAssetRequest(
  tilesheetAssetRequest: TilesheetAssetRequest,
): void {
  if (
    typeof tilesheetAssetRequest !== "object" ||
    tilesheetAssetRequest === null
  ) {
    throw new TypeError(
      `Tilesheet asset request must be a non-null object. Received: ${formatInvalidValue(tilesheetAssetRequest)}.`,
    );
  }

  const { tilesetSource, season, modId } = tilesheetAssetRequest;

  if (typeof tilesetSource !== "string" || tilesetSource.length === 0) {
    throw new TypeError(
      `Tilesheet source must be a non-empty string. Received: ${formatTilesheetAssetRequest(tilesheetAssetRequest)}.`,
    );
  }

  if (!plannerSeasons.includes(season)) {
    throw new TypeError(
      `Tilesheet season must be one of ${plannerSeasons.join(", ")}. Received: ${formatTilesheetAssetRequest(tilesheetAssetRequest)}.`,
    );
  }

  if (modId !== null && (typeof modId !== "string" || modId.length === 0)) {
    throw new TypeError(
      `Tilesheet mod ID must be null or a non-empty string. Received: ${formatTilesheetAssetRequest(tilesheetAssetRequest)}.`,
    );
  }
}

function resolveTilesheetOutputPath(
  tilesheetAssetRequest: TilesheetAssetRequest,
): string {
  const { tilesetSource, season, modId } = tilesheetAssetRequest;

  if (modId === "inkubusmods.modestmapsstandardfarm") {
    const publicTilesheetOutputPath =
      modestMapsPublicTilesheetOutputPathBySource.get(tilesetSource);

    if (publicTilesheetOutputPath !== undefined) {
      return publicTilesheetOutputPath;
    }
  }

  if (tilesetSource === "paths" || tilesetSource === "paths.png") {
    return "tilesheets/paths.png";
  }

  const tilesheetFilename = appendPngExtension(
    getTilesheetFilename(tilesetSource),
  );
  const tilesheetBasename = removePngExtension(tilesheetFilename);
  const seasonalTilesheetBasename = getSeasonalTilesheetBasename(
    tilesheetBasename,
  );

  if (seasonalTilesheetBasename !== null) {
    return resolveSeasonalTilesheetOutputPath(
      seasonalTilesheetBasename,
      season,
      modId,
      tilesheetAssetRequest,
    );
  }

  if (tilesheetBasename === "island_tilesheet_1") {
    return "tilesheets/island_tilesheet_1.png";
  }

  if (officialNonSeasonalTilesheetBasenames.has(tilesheetBasename)) {
    return `tilesheets/${tilesheetFilename}`;
  }

  if (modId !== null) {
    return `mods/${modId}/${tilesheetFilename}`;
  }

  throw createResolutionError(
    "The source is neither a supported official tilesheet nor a Mod tilesheet",
    tilesheetAssetRequest,
  );
}

function getTilesheetFilename(tilesetSource: string): string {
  const backslashIndex = tilesetSource.lastIndexOf("\\");
  const tilesheetFilename = tilesetSource.slice(backslashIndex + 1);

  if (tilesheetFilename.length === 0) {
    throw new Error(
      `Tilesheet source must include a filename after its final backslash. Received tilesetSource: ${formatInvalidValue(tilesetSource)}.`,
    );
  }

  return tilesheetFilename;
}

function appendPngExtension(tilesheetFilename: string): string {
  return tilesheetFilename.endsWith(".png")
    ? tilesheetFilename
    : `${tilesheetFilename}.png`;
}

function removePngExtension(tilesheetFilename: string): string {
  return tilesheetFilename.slice(0, -".png".length);
}

function getSeasonalTilesheetBasename(
  tilesheetBasename: string,
): string | null {
  for (const plannerSeason of plannerSeasons) {
    const seasonalPrefix = `${plannerSeason}_`;

    if (tilesheetBasename.startsWith(seasonalPrefix)) {
      return tilesheetBasename.slice(seasonalPrefix.length);
    }
  }

  return null;
}

function resolveSeasonalTilesheetOutputPath(
  tilesheetBasename: string,
  season: TilesheetSeason,
  modId: string | null,
  tilesheetAssetRequest: TilesheetAssetRequest,
): string {
  if (officialSeasonalTilesheetBasenames.has(tilesheetBasename)) {
    return `tilesheets/${season}_${tilesheetBasename}.png`;
  }

  if (modId !== null) {
    return `mods/${modId}/${season}_${tilesheetBasename}.png`;
  }

  throw createResolutionError(
    "A custom seasonal tilesheet requires a Mod ID",
    tilesheetAssetRequest,
  );
}

function resolveManifestBackedAsset(
  outputPath: string,
  tilesheetAssetRequest: TilesheetAssetRequest,
): ResolvedTilesheetAsset {
  if (lockedRenderingOutputPaths.has(outputPath)) {
    return createResolvedTilesheetAsset(outputPath, false);
  }

  const knownUnavailableReason =
    knownUnavailableTilesheetReasonByOutputPath.get(outputPath);

  if (knownUnavailableReason !== undefined) {
    return {
      knownUnavailable: {
        outputPath,
        reason: knownUnavailableReason,
      },
    };
  }

  const springFallbackOutputPath = getSpringFallbackOutputPath(outputPath);

  if (
    springFallbackOutputPath !== null &&
    lockedRenderingOutputPaths.has(springFallbackOutputPath)
  ) {
    return createResolvedTilesheetAsset(springFallbackOutputPath, true);
  }

  throw createResolutionError(
    `The resolved local asset is not present in the rendering manifest: ${formatInvalidValue(outputPath)}`,
    tilesheetAssetRequest,
  );
}

function getSpringFallbackOutputPath(outputPath: string): string | null {
  const seasonalModOutputPath = outputPath.match(
    /^mods\/([^/]+)\/(summer|fall|winter)_(.+)\.png$/,
  );

  if (seasonalModOutputPath === null) {
    return null;
  }

  const [, modId, , tilesheetBasename] = seasonalModOutputPath;

  if (isKnownMissingDaisyextrasSeasonalPath(modId, tilesheetBasename)) {
    return `mods/${modId}/spring_${tilesheetBasename}.png`;
  }

  if (isKnownMissingWaterfallForestSeasonalPath(modId, tilesheetBasename)) {
    return `mods/${modId}/spring_${tilesheetBasename}.png`;
  }

  if (isKnownMissingEverfarmSeasonalPath(modId, tilesheetBasename)) {
    return `mods/${modId}/spring_${tilesheetBasename}.png`;
  }

  return null;
}

function isKnownMissingDaisyextrasSeasonalPath(
  modId: string,
  tilesheetBasename: string,
): boolean {
  return (
    tilesheetBasename === "daisyextras" &&
    daisyextrasSpringFallbackModIds.has(modId)
  );
}

function isKnownMissingWaterfallForestSeasonalPath(
  modId: string,
  tilesheetBasename: string,
): boolean {
  return (
    modId === "archibaldtk.waterfallforestfarm" &&
    waterfallForestSpringFallbackTilesheetBasenames.has(tilesheetBasename)
  );
}

function isKnownMissingEverfarmSeasonalPath(
  modId: string,
  tilesheetBasename: string,
): boolean {
  return modId === "draylon.everfarm" && tilesheetBasename === "Blend";
}

function createResolvedTilesheetAsset(
  outputPath: string,
  usedSpringFallback: boolean,
): LocalTilesheetAsset {
  return {
    localPath: `${localAssetRoot}${outputPath}`,
    usedSpringFallback,
  };
}

function createResolutionError(
  reason: string,
  tilesheetAssetRequest: TilesheetAssetRequest,
): Error {
  return new Error(
    `Cannot resolve tilesheet asset. ${reason}. Received: ${formatTilesheetAssetRequest(tilesheetAssetRequest)}.`,
  );
}

function formatTilesheetAssetRequest(
  tilesheetAssetRequest: TilesheetAssetRequest,
): string {
  return `tilesetSource=${formatInvalidValue(tilesheetAssetRequest.tilesetSource)}, season=${formatInvalidValue(tilesheetAssetRequest.season)}, modId=${formatInvalidValue(tilesheetAssetRequest.modId)}`;
}

function formatInvalidValue(value: unknown): string {
  return JSON.stringify(value);
}
