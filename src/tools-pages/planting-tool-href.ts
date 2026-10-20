import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";

export function createCropGrowthHref(locale: PublicLocale, cropId: string): string {
  if (cropId.trim().length === 0) {
    throw new Error(`Crop id must be a non-empty string. Received: ${JSON.stringify(cropId)}.`);
  }

  const pathname = getLocalizedPublicPath(locale, "/tools/crop-profit");
  return `${pathname}?tool=growth&crop=${encodeURIComponent(cropId)}`;
}

export function createCropProfitHref(locale: PublicLocale): string {
  return getLocalizedPublicPath(locale, "/tools/crop-profit");
}

export function createToolsHomeHref(locale: PublicLocale): string {
  return getLocalizedPublicPath(locale, "/tools");
}
