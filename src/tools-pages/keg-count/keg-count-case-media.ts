const CASE_IMAGE_LOCALES = ["en", "zh-CN"] as const;

type KegCountCaseImageLocale = (typeof CASE_IMAGE_LOCALES)[number];

function isKegCountCaseImageLocale(locale: string): locale is KegCountCaseImageLocale {
  return locale === "en" || locale === "zh-CN";
}

export function getKegCountCaseImagePaths(
  locale: string,
): readonly [string, string, string, string] {
  if (!isKegCountCaseImageLocale(locale)) {
    throw new Error(
      `Unsupported keg count case image locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  const currentStockPath = `/images/planning-tool-guides/keg-count/${locale}/desktop/case-current-stock.png`;
  const repeatingHarvestPath = `/images/planning-tool-guides/keg-count/${locale}/desktop/case-repeating-harvest.png`;

  return [currentStockPath, repeatingHarvestPath, currentStockPath, repeatingHarvestPath];
}
