import { validateSourceAsset, type SourceAsset } from "./source-asset";
import { mapSourceAssets } from "./map-source-manifest";
import { renderingSourceAssets } from "./rendering-source-manifest";

export const sourceAssets = createSourceAssets();

function createSourceAssets(): readonly SourceAsset[] {
  const sourceAssetCandidates = [
    {
      sourceUrl:
        "https://assets.stardewplan.com/assets/1.6.15/data/Crops.json",
      outputPath: "data/Crops.json",
      mediaType: "application/json" as const,
    },
    ...mapSourceAssets,
    ...renderingSourceAssets,
  ];
  const sourceAssetOutputPaths = new Set<string>();

  for (const sourceAssetCandidate of sourceAssetCandidates) {
    validateSourceAsset(sourceAssetCandidate);

    if (sourceAssetOutputPaths.has(sourceAssetCandidate.outputPath)) {
      throw new Error(
        `Source assets cannot contain duplicate output path: ${sourceAssetCandidate.outputPath}.`,
      );
    }

    sourceAssetOutputPaths.add(sourceAssetCandidate.outputPath);
  }

  return sourceAssetCandidates;
}
