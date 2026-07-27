import { describe, expect, it } from "vitest";
import { siteLocales } from "../../src/i18n/locales";

describe("site locales", () => {
  it("exposes English and Simplified Chinese as the supported locales", () => {
    expect(siteLocales).toEqual(["en", "zh-CN"]);
  });
});
