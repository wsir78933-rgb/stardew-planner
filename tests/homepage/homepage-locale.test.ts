import { describe, expect, test } from "vitest";
import * as homepageLocaleModule from "@/src/homepage/homepage-locale";

describe("homepage locale module boundary", () => {
  test("exposes the English default without browser storage APIs", () => {
    expect(homepageLocaleModule.DEFAULT_HOMEPAGE_LOCALE).toBe("en");
    expect(homepageLocaleModule).not.toHaveProperty("HOMEPAGE_LOCALE_STORAGE_KEY");
    expect(homepageLocaleModule).not.toHaveProperty("getStoredHomepageLocale");
    expect(homepageLocaleModule).not.toHaveProperty("saveHomepageLocale");
  });
});
