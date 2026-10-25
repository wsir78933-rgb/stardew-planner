import { publicLocales, type PublicLocale } from "../../i18n/public-locale";

export function getMaterialsAndResinCaseImagePath(locale: PublicLocale): string {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported materials and resin case image locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  return `/images/planning-tool-guides/materials-and-resin/${locale}/desktop/case-calculator.png`;
}
