import { describe, expect, it } from "vitest";
import {
  getAbsoluteLocalizedUrl,
  getAlternateLanguageUrls,
  getOpenGraphLocale,
} from "../../src/i18n/public-site-url";

describe("public site URLs", () => {
  it("creates localized absolute URLs and reciprocal alternates from a canonical path", () => {
    expect(getAbsoluteLocalizedUrl("zh-CN", "/mods")).toBe(
      "https://stardewvalleyplanner.art/zh/mods",
    );
    expect(getAlternateLanguageUrls("/mods")).toEqual({
      en: "https://stardewvalleyplanner.art/mods",
      "zh-CN": "https://stardewvalleyplanner.art/zh/mods",
      "x-default": "https://stardewvalleyplanner.art/mods",
    });
  });

  it("rejects an unsupported canonical path with its received value", () => {
    expect(() => getAbsoluteLocalizedUrl("en", "/farm/custom")).toThrow(
      'canonical public path "/farm/custom" is not supported',
    );
  });

  it("maps supported site locales to Open Graph locale values", () => {
    expect(getOpenGraphLocale("en")).toBe("en_US");
    expect(getOpenGraphLocale("zh-CN")).toBe("zh_CN");
  });

  it("rejects an unsupported Open Graph locale with its received value", () => {
    expect(() => getOpenGraphLocale("fr" as never)).toThrow(
      'site locale "fr" is not supported',
    );
  });
});
