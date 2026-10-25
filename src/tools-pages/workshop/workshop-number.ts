export function parseWorkshopInteger(
  rawValue: string,
  fieldName: string,
  minimum: 0 | 1,
): number {
  const trimmedValue = rawValue.trim();
  const parsedValue = Number(trimmedValue);
  if (
    !/^\d+$/.test(trimmedValue) ||
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < minimum
  ) {
    throw new Error(
      `Workshop field ${JSON.stringify(fieldName)} must be a safe integer of at least ${minimum}. Received: ${JSON.stringify(rawValue)}.`,
    );
  }
  return parsedValue;
}
import type { PublicLocale } from "../../i18n/public-locale";


export function formatWorkshopCount(value: number, locale: PublicLocale): string {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Workshop count is invalid. Received: ${JSON.stringify(value)}.`);
  }
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-CN").format(value);
}

export function formatWorkshopAverage(value: number, locale: PublicLocale): string {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Workshop average is invalid. Received: ${JSON.stringify(value)}.`);
  }
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "zh-CN", {
    maximumFractionDigits: 2,
  }).format(value);
}
