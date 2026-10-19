export const HOMEPAGE_LOCALES = ["en", "zh-CN", "ja"] as const;

export type HomepageLocale = (typeof HOMEPAGE_LOCALES)[number];

export const HOMEPAGE_LOCALE_LABELS = {
  en: "English",
  "zh-CN": "中文",
  ja: "日本語",
} as const satisfies Readonly<Record<HomepageLocale, string>>;

export const PLANNER_CHROME_LOCALES = ["en", "zh", "ja"] as const;

export type PlannerChromeLocale = (typeof PLANNER_CHROME_LOCALES)[number];

export function isHomepageLocale(localeValue: string): localeValue is HomepageLocale {
  return HOMEPAGE_LOCALES.some((homepageLocale) => homepageLocale === localeValue);
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

  const unsupportedHomepageLocale: never = homepageLocale;
  throw new Error(
    `Cannot read planner chrome locale because homepage locale is ${JSON.stringify(unsupportedHomepageLocale)}.`,
  );
}

export function assertPlannerChromeLocale(
  locale: string,
): asserts locale is PlannerChromeLocale {
  if (locale === "en" || locale === "zh" || locale === "ja") {
    return;
  }

  throw new TypeError(
    `Planner chrome locale must be "en", "zh", or "ja"; received ${JSON.stringify(locale)}.`,
  );
}
