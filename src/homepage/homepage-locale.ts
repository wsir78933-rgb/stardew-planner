export const HOMEPAGE_LOCALES = ["en", "zh-CN", "ru"] as const;

export type HomepageLocale = (typeof HOMEPAGE_LOCALES)[number];

export const HOMEPAGE_DISPLAY_LOCALES = HOMEPAGE_LOCALES;

export type HomepageDisplayLocale = HomepageLocale;

export const HOMEPAGE_LOCALE_LABELS = {
  en: "English",
  "zh-CN": "中文",
  ru: "Русский",
} as const satisfies Readonly<Record<HomepageDisplayLocale, string>>;

export function isHomepageLocale(localeValue: string): localeValue is HomepageLocale {
  return HOMEPAGE_LOCALES.some((homepageLocale) => homepageLocale === localeValue);
}

export function isHomepageDisplayLocale(
  localeValue: string,
): localeValue is HomepageDisplayLocale {
  return isHomepageLocale(localeValue);
}
