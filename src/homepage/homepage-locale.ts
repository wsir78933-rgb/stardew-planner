export const HOMEPAGE_LOCALES = ["en", "zh-CN"] as const;

export type HomepageLocale = (typeof HOMEPAGE_LOCALES)[number];

export const HOMEPAGE_LOCALE_LABELS = {
  en: "English",
  "zh-CN": "中文",
} as const satisfies Readonly<Record<HomepageLocale, string>>;

export const DEFAULT_HOMEPAGE_LOCALE: HomepageLocale = "en";

export function isHomepageLocale(localeValue: string): localeValue is HomepageLocale {
  return HOMEPAGE_LOCALES.some((homepageLocale) => homepageLocale === localeValue);
}
