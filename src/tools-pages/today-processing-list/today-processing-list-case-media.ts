import { publicLocales, type PublicLocale } from "../../i18n/public-locale";

export type TodayProcessingListCaseImage = Readonly<{
  src: string;
  width: number;
  height: number;
}>;

export type TodayProcessingListCaseMedia = Readonly<{
  desktop: TodayProcessingListCaseImage;
  mobile: TodayProcessingListCaseImage;
}>;

const DESKTOP_CASE_IMAGE_WIDTH = 556;
const DESKTOP_CASE_IMAGE_HEIGHT = 417;
const MOBILE_CASE_IMAGE_WIDTH = 312;
const MOBILE_CASE_IMAGE_HEIGHT = 234;

function createCaseImage(
  locale: PublicLocale,
  viewport: "desktop" | "mobile",
  width: number,
  height: number,
): TodayProcessingListCaseImage {
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    throw new Error(
      `Today processing list case image must have positive integer dimensions, received width ${JSON.stringify(width)} and height ${JSON.stringify(height)}.`,
    );
  }

  return {
    src: `/images/planning-tool-guides/today-processing-list/${locale}/${viewport}/case.png`,
    width,
    height,
  };
}

export function getTodayProcessingListCaseMedia(locale: PublicLocale): TodayProcessingListCaseMedia {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported today processing list case image locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  const desktop = createCaseImage(locale, "desktop", DESKTOP_CASE_IMAGE_WIDTH, DESKTOP_CASE_IMAGE_HEIGHT);
  const mobile = createCaseImage(locale, "mobile", MOBILE_CASE_IMAGE_WIDTH, MOBILE_CASE_IMAGE_HEIGHT);

  if (desktop.src === mobile.src) {
    throw new Error(
      `Today processing list case images must use separate desktop and mobile paths, received ${JSON.stringify(desktop.src)}.`,
    );
  }

  return { desktop, mobile };
}
