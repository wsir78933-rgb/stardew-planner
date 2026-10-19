import { describe, expect, test } from "vitest";
import * as homepageLocaleModule from "@/src/homepage/homepage-locale";

describe("homepage locale module boundary", () => {
  test("includes Japanese and Russian in the homepage locale and keeps the display locale aligned", () => {
    expect(
      homepageLocaleModule.HOMEPAGE_LOCALES,
      `Homepage locales must be English, Chinese, Japanese, and Russian. Received: ${JSON.stringify(homepageLocaleModule.HOMEPAGE_LOCALES)}.`,
    ).toEqual(["en", "zh-CN", "ja", "ru"]);
    expect(
      homepageLocaleModule.HOMEPAGE_DISPLAY_LOCALES,
      `Homepage display locales must be English, Chinese, Japanese, and Russian. Received: ${JSON.stringify(homepageLocaleModule.HOMEPAGE_DISPLAY_LOCALES)}.`,
    ).toEqual(["en", "zh-CN", "ja", "ru"]);
    expect(homepageLocaleModule.HOMEPAGE_LOCALE_LABELS).toEqual({
      en: "English",
      "zh-CN": "中文",
      ja: "日本語",
      ru: "Русский",
    });
    expect(homepageLocaleModule.isHomepageLocale("en")).toBe(true);
    expect(homepageLocaleModule.isHomepageLocale("zh-CN")).toBe(true);
    expect(homepageLocaleModule.isHomepageLocale("ja")).toBe(true);
    expect(homepageLocaleModule.isHomepageLocale("ru")).toBe(true);
    expect(homepageLocaleModule.isHomepageLocale("fr")).toBe(false);
    expect(homepageLocaleModule.isHomepageDisplayLocale("ja")).toBe(true);
    expect(homepageLocaleModule.isHomepageDisplayLocale("ru")).toBe(true);
    expect(homepageLocaleModule.isHomepageDisplayLocale("fr")).toBe(false);
    expect(homepageLocaleModule.readPlannerChromeLocale("ja")).toBe("ja");
    expect(homepageLocaleModule.readPlannerChromeLocale("ru")).toBe("ru");
    expect(homepageLocaleModule.readPlannerChromeLocale("zh-CN")).toBe("zh");
    expect(homepageLocaleModule.readPlannerChromeLocale("en")).toBe("en");
    expect(homepageLocaleModule).not.toHaveProperty("DEFAULT_HOMEPAGE_LOCALE");
    expect(homepageLocaleModule).not.toHaveProperty("HOMEPAGE_LOCALE_STORAGE_KEY");
    expect(homepageLocaleModule).not.toHaveProperty("getStoredHomepageLocale");
    expect(homepageLocaleModule).not.toHaveProperty("saveHomepageLocale");
  });
});
