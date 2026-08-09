import { describe, expect, test } from "vitest";
import * as homepageLocaleModule from "@/src/homepage/homepage-locale";

describe("homepage locale module boundary", () => {
  test("exposes route locales without a client-side default or browser storage APIs", () => {
    expect(homepageLocaleModule.HOMEPAGE_LOCALES).toEqual(["en", "zh-CN"]);
    expect(homepageLocaleModule).not.toHaveProperty("DEFAULT_HOMEPAGE_LOCALE");
    expect(homepageLocaleModule).not.toHaveProperty("HOMEPAGE_LOCALE_STORAGE_KEY");
    expect(homepageLocaleModule).not.toHaveProperty("getStoredHomepageLocale");
    expect(homepageLocaleModule).not.toHaveProperty("saveHomepageLocale");
  });
});
