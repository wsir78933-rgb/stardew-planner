import { getLocalizedPublicPath } from "../i18n/public-route-registry";

export function createCropGrowthRedirectHref(locale: unknown, cropId: unknown): string {
  if (locale !== "en" && locale !== "zh-CN") {
    throw new Error(`Unsupported public locale. Received: ${JSON.stringify(locale)}.`);
  }

  const cropProfitPathname = getLocalizedPublicPath(locale, "/tools/crop-profit");
  const growthHref = `${cropProfitPathname}?tool=growth`;

  if (cropId === null || cropId === "") {
    return growthHref;
  }

  if (typeof cropId !== "string") {
    throw new Error(`Crop id must be a non-empty string. Received: ${JSON.stringify(cropId)}.`);
  }

  return `${growthHref}&crop=${encodeURIComponent(cropId)}`;
}
