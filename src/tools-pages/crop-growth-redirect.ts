import { createCropGrowthToolHref } from "./planting-tool-href";

export function createCropGrowthRedirectHref(locale: unknown, cropId: unknown): string {
  if (locale !== "en" && locale !== "zh-CN") {
    throw new Error(`Unsupported public locale. Received: ${JSON.stringify(locale)}.`);
  }

  const growthHref = createCropGrowthToolHref(locale);

  if (cropId === null || cropId === "") {
    return growthHref;
  }

  if (typeof cropId !== "string") {
    throw new Error(`Crop id must be a non-empty string. Received: ${JSON.stringify(cropId)}.`);
  }

  return `${growthHref}?crop=${encodeURIComponent(cropId)}`;
}
