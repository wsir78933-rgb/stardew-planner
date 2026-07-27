export const siteLocales = ["en", "zh-CN"] as const;

export type SiteLocale = (typeof siteLocales)[number];

export function assertSiteLocale(locale: unknown): asserts locale is SiteLocale {
  if (locale === "en" || locale === "zh-CN") {
    return;
  }

  throw new Error(`site locale ${formatInvalidValue(locale)} is not supported`);
}

function formatInvalidValue(value: unknown): string {
  return typeof value === "string" ? `"${value}"` : String(value);
}
