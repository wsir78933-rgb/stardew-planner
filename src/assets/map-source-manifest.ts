import {
  farmhouse2Composite,
  gingerIslandOverlays,
  plannerMaps,
  type PlannerMap,
} from "../maps/map-catalog";
import {
  validateSourceAsset,
  type SourceAsset,
  type SourceAssetMediaType,
} from "./source-asset";

const lockedAssetSourceBaseUrl =
  "https://assets.stardewplan.com/assets/1.6.15/";

export const mapSourceAssets = createMapSourceAssets();

function createMapSourceAssets(): readonly SourceAsset[] {
  const mapSourceAssetCandidates = [
    ...createPlannerMapSourceAssets(),
    ...createGingerIslandOverlaySourceAssets(),
    ...createFarmhouse2CompositeSourceAssets(),
  ];

  return validateDistinctSourceAssets(mapSourceAssetCandidates);
}

function createPlannerMapSourceAssets(): SourceAsset[] {
  return plannerMaps.flatMap((plannerMap) => [
    createPlannerMapFileSourceAsset(plannerMap),
    createPreviewSourceAsset(plannerMap.previewOutputPath),
  ]);
}

function createPlannerMapFileSourceAsset(plannerMap: PlannerMap): SourceAsset {
  const outputPath = plannerMap.modId
    ? `mods/${plannerMap.modId}/${plannerMap.mapFile}`
    : `maps/${plannerMap.mapFile}`;

  return createSourceAsset(outputPath, "application/xml");
}

function createPreviewSourceAsset(previewOutputPath: string): SourceAsset {
  return createSourceAsset(previewOutputPath, "image/png");
}

function createGingerIslandOverlaySourceAssets(): SourceAsset[] {
  return gingerIslandOverlays.map((gingerIslandOverlay) =>
    createSourceAsset(`maps/${gingerIslandOverlay.mapFile}`, "application/xml"),
  );
}

function createFarmhouse2CompositeSourceAssets(): SourceAsset[] {
  return [
    createSourceAsset(
      `maps/${farmhouse2Composite.marriageMapFile}`,
      "application/xml",
    ),
    createSourceAsset(
      `maps/${farmhouse2Composite.spouseRoomMapFile}`,
      "application/xml",
    ),
    ...farmhouse2Composite.renovations.map((farmhouseRenovation) =>
      createSourceAsset(
        `maps/${farmhouseRenovation.mapFile}`,
        "application/xml",
      ),
    ),
  ];
}

function createSourceAsset(
  outputPath: string,
  mediaType: SourceAssetMediaType,
): SourceAsset {
  return {
    sourceUrl: `${lockedAssetSourceBaseUrl}${outputPath}`,
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
        `Map source assets cannot contain duplicate output path: ${sourceAssetCandidate.outputPath}.`,
      );
    }

    sourceAssetOutputPaths.add(sourceAssetCandidate.outputPath);
  }

  return sourceAssetCandidates;
}
