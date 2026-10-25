import type { PublicLocale } from "../../i18n/public-locale";

export type ProductionScheduleCaseImage = Readonly<{
  src: string;
  width: number;
  height: number;
}>;

export type ProductionScheduleCaseMedia = Readonly<{
  desktop: ProductionScheduleCaseImage;
  mobile: ProductionScheduleCaseImage;
}>;

const DESKTOP_CASE_IMAGE_WIDTH = 556;
const DESKTOP_CASE_IMAGE_HEIGHT = 417;
const MOBILE_CASE_IMAGE_WIDTH = 312;
const MOBILE_CASE_IMAGE_HEIGHT = 234;

function createCaseImage(src: string, width: number, height: number): ProductionScheduleCaseImage {
  return {
    src,
    width,
    height,
  };
}

function createCaseMedia(localeDirectory: "en" | "zh-CN"): ProductionScheduleCaseMedia {
  return {
    desktop: createCaseImage(
      `/images/planning-tool-guides/production-schedule/${localeDirectory}/desktop/case.png`,
      DESKTOP_CASE_IMAGE_WIDTH,
      DESKTOP_CASE_IMAGE_HEIGHT,
    ),
    mobile: createCaseImage(
      `/images/planning-tool-guides/production-schedule/${localeDirectory}/mobile/case.png`,
      MOBILE_CASE_IMAGE_WIDTH,
      MOBILE_CASE_IMAGE_HEIGHT,
    ),
  };
}

const productionScheduleCaseMediaByLocale: Readonly<Record<PublicLocale, ProductionScheduleCaseMedia>> = {
  en: createCaseMedia("en"),
  "zh-CN": createCaseMedia("zh-CN"),
};

export function getProductionScheduleCaseMedia(locale: PublicLocale): ProductionScheduleCaseMedia {
  if (locale !== "en" && locale !== "zh-CN") {
    throw new Error(`Unsupported production schedule case image locale: ${JSON.stringify(locale)}.`);
  }

  return productionScheduleCaseMediaByLocale[locale];
}
