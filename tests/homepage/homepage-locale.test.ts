import { describe, expect, test } from "vitest";
import * as homepageLocaleModule from "@/src/homepage/homepage-locale";

describe("homepage locale module boundary", () => {
  test("exposes route locales without a client-side default or browser storage APIs", () => {
    expect(homepageLocaleModule.HOMEPAGE_LOCALES).toEqual(["en", "zh-CN", "ja"]);
    expect(homepageLocaleModule.HOMEPAGE_LOCALE_LABELS.ja).toBe("日本語");
    expect(homepageLocaleModule.readPlannerChromeLocale("ja")).toBe("ja");
    expect(homepageLocaleModule.readPlannerChromeLocale("zh-CN")).toBe("zh");
    expect(homepageLocaleModule.readPlannerChromeLocale("en")).toBe("en");
    expect(homepageLocaleModule).not.toHaveProperty("DEFAULT_HOMEPAGE_LOCALE");
    expect(homepageLocaleModule).not.toHaveProperty("HOMEPAGE_LOCALE_STORAGE_KEY");
    expect(homepageLocaleModule).not.toHaveProperty("getStoredHomepageLocale");
    expect(homepageLocaleModule).not.toHaveProperty("saveHomepageLocale");
  });
});
