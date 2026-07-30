export const HOMEPAGE_LOCALES = ["en", "zh-CN"] as const;

export type HomepageLocale = (typeof HOMEPAGE_LOCALES)[number];

export const DEFAULT_HOMEPAGE_LOCALE: HomepageLocale = "en";
export const HOMEPAGE_LOCALE_STORAGE_KEY = "stardew-homepage-locale";

export function isHomepageLocale(localeValue: string): localeValue is HomepageLocale {
  return HOMEPAGE_LOCALES.some((homepageLocale) => homepageLocale === localeValue);
}

export function getStoredHomepageLocale(
  storage: Pick<Storage, "getItem">,
): HomepageLocale {
  const storedHomepageLocale = storage.getItem(HOMEPAGE_LOCALE_STORAGE_KEY);

  if (storedHomepageLocale === null || !isHomepageLocale(storedHomepageLocale)) {
    return DEFAULT_HOMEPAGE_LOCALE;
  }

  return storedHomepageLocale;
}

export function saveHomepageLocale(
  storage: Pick<Storage, "setItem">,
  homepageLocale: HomepageLocale,
): void {
  if (!isHomepageLocale(homepageLocale)) {
    throw new Error(`Unsupported homepage locale: "${homepageLocale}"`);
  }

  storage.setItem(HOMEPAGE_LOCALE_STORAGE_KEY, homepageLocale);
}
