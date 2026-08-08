import type { CatalogLitBigCraftableRenderingMetadata } from "./catalog-types";

const brazierRenderingMetadata: CatalogLitBigCraftableRenderingMetadata = {
  kind: "lit-big-craftable",
  flameLayers: [
    { offsetX: 2, offsetY: -14, scale: 1, timeOffsetMilliseconds: 0 },
  ],
};

const campfireRenderingMetadata: CatalogLitBigCraftableRenderingMetadata = {
  kind: "lit-big-craftable",
  flameLayers: [
    { offsetX: 3, offsetY: -2, scale: 0.75, timeOffsetMilliseconds: 0 },
    { offsetX: 5, offsetY: 0, scale: 0.75, timeOffsetMilliseconds: 137 },
    { offsetX: 3, offsetY: 3, scale: 0.75, timeOffsetMilliseconds: 274 },
  ],
};

const renderingMetadataByRecordId = new Map<
  string,
  CatalogLitBigCraftableRenderingMetadata
>([
  ["143", brazierRenderingMetadata],
  ["144", brazierRenderingMetadata],
  ["145", brazierRenderingMetadata],
  ["146", campfireRenderingMetadata],
  ["147", brazierRenderingMetadata],
  ["148", brazierRenderingMetadata],
  ["149", brazierRenderingMetadata],
  ["150", brazierRenderingMetadata],
  ["151", brazierRenderingMetadata],
  ["278", campfireRenderingMetadata],
]);

export function getLockedLitBigCraftableRenderingMetadata(
  recordId: string,
): CatalogLitBigCraftableRenderingMetadata | undefined {
  return renderingMetadataByRecordId.get(recordId);
}
