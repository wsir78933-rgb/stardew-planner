import type { CatalogGateRenderingMetadata } from "./catalog-types";

export const gateCatalogItemId = "object:325";

export const gateRenderingMetadata: CatalogGateRenderingMetadata = {
  kind: "gate",
  textureLocalPath: "/game-assets/1.6.15/tilesheets/Fence1.png",
};

export function isGateFenceRecordId(recordId: string): boolean {
  return recordId === "325";
}
