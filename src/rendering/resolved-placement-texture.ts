import type {
  PlacementRenderEntry,
  PlacementRenderFrame,
} from "./placement-rendering";
import { resolvePlannerTextureFrame } from "./planner-texture-frame-resolution";

export type ResolvedPlacementTextureEntry = Readonly<{
  placementRenderEntry: PlacementRenderEntry;
  resolvedAssetPath: string;
  resolvedFrame: PlacementRenderFrame;
}>;

export function resolvePlacementTextureEntry(
  placementRenderEntry: PlacementRenderEntry,
): ResolvedPlacementTextureEntry {
  const lockedTexturePath = placementRenderEntry.textureLocalPath
    ?? placementRenderEntry.catalogItem.textureLocalPath;
  const resolvedTextureFrame = resolvePlannerTextureFrame(
    lockedTexturePath,
    placementRenderEntry.frame,
  );

  return {
    placementRenderEntry,
    resolvedAssetPath: resolvedTextureFrame.resolvedAssetPath,
    resolvedFrame: resolvedTextureFrame.resolvedFrame,
  };
}

export function resolvePlacementTextureEntries(
  placementRenderEntries: readonly PlacementRenderEntry[],
): readonly ResolvedPlacementTextureEntry[] {
  return placementRenderEntries.map(resolvePlacementTextureEntry);
}
