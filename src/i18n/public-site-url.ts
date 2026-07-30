import { assertCanonicalPublicPath } from "./canonical-public-routes";
import { getLocalizedPath } from "./localized-path";
import { assertSiteLocale, type SiteLocale } from "./locales";

export const publicSiteOrigin = "https://stardewvalleyplanner.art";

export function getAbsoluteLocalizedUrl(
  locale: SiteLocale,
  canonicalPath: string,
): string {
  assertCanonicalPublicPath(canonicalPath);
  return `${publicSiteOrigin}${getLocalizedPath(locale, canonicalPath)}`;
}

export function getAlternateLanguageUrls(canonicalPath: string) {
  return {
    en: getAbsoluteLocalizedUrl("en", canonicalPath),
    "zh-CN": getAbsoluteLocalizedUrl("zh-CN", canonicalPath),
    "x-default": getAbsoluteLocalizedUrl("en", canonicalPath),
  };
}

export function getOpenGraphLocale(locale: SiteLocale): "en_US" | "zh_CN" {
  assertSiteLocale(locale);

  if (locale === "en") {
    return "en_US";
  }

  return "zh_CN";
}
