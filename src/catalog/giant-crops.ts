export const giantCropCatalogItemIds = [
  "crop:giant_Cauliflower",
  "crop:giant_Melon",
  "crop:giant_Pumpkin",
  "crop:giant_Powdermelon",
  "crop:giant_QiFruit",
] as const;

export function isGiantCropCatalogItemId(itemId: string): boolean {
  return (giantCropCatalogItemIds as readonly string[]).includes(itemId);
}
