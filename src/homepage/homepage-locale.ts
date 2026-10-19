export const HOMEPAGE_LOCALES = ["en", "zh-CN", "ja", "ru"] as const;

export type HomepageLocale = (typeof HOMEPAGE_LOCALES)[number];

export const HOMEPAGE_DISPLAY_LOCALES = HOMEPAGE_LOCALES;

export type HomepageDisplayLocale = HomepageLocale;

export const HOMEPAGE_LOCALE_LABELS = {
  en: "English",
  "zh-CN": "中文",
  ja: "日本語",
  ru: "Русский",
} as const satisfies Readonly<Record<HomepageLocale, string>>;

export const PLANNER_CHROME_LOCALES = ["en", "zh", "ja", "ru"] as const;

export type PlannerChromeLocale = (typeof PLANNER_CHROME_LOCALES)[number];

export function isHomepageLocale(localeValue: string): localeValue is HomepageLocale {
  return HOMEPAGE_LOCALES.some((homepageLocale) => homepageLocale === localeValue);
}

export function isHomepageDisplayLocale(
  localeValue: string,
): localeValue is HomepageDisplayLocale {
  return isHomepageLocale(localeValue);
}

export function readPlannerChromeLocale(homepageLocale: HomepageLocale): PlannerChromeLocale {
  if (homepageLocale === "en") {
    return "en";
  }

  if (homepageLocale === "zh-CN") {
    return "zh";
  }

  if (homepageLocale === "ja") {
    return "ja";
  }

  if (homepageLocale === "ru") {
    return "ru";
  }

  const unsupportedHomepageLocale: never = homepageLocale;
  throw new Error(
    `Cannot read planner chrome locale because homepage locale is ${JSON.stringify(unsupportedHomepageLocale)}.`,
  );
}

export function assertPlannerChromeLocale(
  locale: string,
): asserts locale is PlannerChromeLocale {
  if (locale === "en" || locale === "zh" || locale === "ja" || locale === "ru") {
    return;
  }

  throw new TypeError(
    `Planner chrome locale must be "en", "zh", "ja", or "ru"; received ${JSON.stringify(locale)}.`,
  );
}
