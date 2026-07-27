import {
  additionalFurnitureTilesheetOutputPaths,
  buildingPaintMaskOutputPaths,
  buildingSpriteOutputPaths,
  modNonSeasonalTilesheetOutputPaths,
  modSeasonalTilesheetOutputPaths,
  officialTilesheetOutputPaths,
  regularTilesheetOutputPaths,
  renderingDataOutputPaths,
  renderingRuntimeAssetEntries,
  spriteOutputPaths,
  terrainOutputPaths,
} from "./rendering-runtime-manifest";
import {
  validateSourceAsset,
  type SourceAsset,
  type SourceAssetMediaType,
} from "./source-asset";

const lockedAssetSourceBaseUrl =
  "https://assets.stardewplan.com/assets/1.6.15/";

export const officialTilesheetSourceAssets = createImageSourceAssets(
  officialTilesheetOutputPaths,
);

export const modNonSeasonalTilesheetSourceAssets = createImageSourceAssets(
  modNonSeasonalTilesheetOutputPaths,
);

export const modSeasonalTilesheetSourceAssets = createImageSourceAssets(
  modSeasonalTilesheetOutputPaths,
);

export const renderingDataSourceAssets = createSourceAssets(
  renderingDataOutputPaths,
  "application/json",
);

export const buildingSpriteSourceAssets = createImageSourceAssets(
  buildingSpriteOutputPaths,
);

export const buildingPaintMaskSourceAssets = createImageSourceAssets(
  buildingPaintMaskOutputPaths,
);

export const spriteSourceAssets = createImageSourceAssets(spriteOutputPaths);

export const terrainSourceAssets = createImageSourceAssets(terrainOutputPaths);

export const regularTilesheetSourceAssets = createImageSourceAssets(
  regularTilesheetOutputPaths,
);

export const additionalFurnitureTilesheetSourceAssets = createImageSourceAssets(
  additionalFurnitureTilesheetOutputPaths,
);

export const renderingSourceAssets = createRenderingSourceAssets();

function createRenderingSourceAssets(): readonly SourceAsset[] {
  const sourceAssetCandidates = renderingRuntimeAssetEntries.map(
    (renderingRuntimeAssetEntry) =>
      createSourceAsset(
        renderingRuntimeAssetEntry.outputPath,
        getSourceAssetMediaType(renderingRuntimeAssetEntry.outputPath),
      ),
  );

  return validateDistinctSourceAssets(sourceAssetCandidates);
}

function getSourceAssetMediaType(
  outputPath: string,
): SourceAssetMediaType {
  if (outputPath.endsWith(".json")) {
    return "application/json";
  }

  if (outputPath.endsWith(".png")) {
    return "image/png";
  }

  throw new Error(
    `Rendering runtime output path must end with .json or .png. Received output path: ${JSON.stringify(outputPath)}.`,
  );
}

function createImageSourceAssets(
  outputPaths: readonly string[],
): readonly SourceAsset[] {
  return createSourceAssets(outputPaths, "image/png");
}

function createSourceAssets(
  outputPaths: readonly string[],
  mediaType: SourceAssetMediaType,
): readonly SourceAsset[] {
  return outputPaths.map((outputPath) =>
    createSourceAsset(outputPath, mediaType),
  );
}

function createSourceAsset(
  outputPath: string,
  mediaType: SourceAssetMediaType,
): SourceAsset {
  return {
    sourceUrl: new URL(outputPath, lockedAssetSourceBaseUrl).toString(),
    outputPath,
    mediaType,
  };
}

function validateDistinctSourceAssets(
  sourceAssetCandidates: readonly SourceAsset[],
): readonly SourceAsset[] {
  const sourceAssetOutputPaths = new Set<string>();

  for (const sourceAssetCandidate of sourceAssetCandidates) {
    validateSourceAsset(sourceAssetCandidate);

    if (sourceAssetOutputPaths.has(sourceAssetCandidate.outputPath)) {
      throw new Error(
        `Rendering source assets cannot contain duplicate output path: ${sourceAssetCandidate.outputPath}.`,
      );
    }

    sourceAssetOutputPaths.add(sourceAssetCandidate.outputPath);
  }

  return sourceAssetCandidates;
}
