import { describe, expect, it } from "vitest";
import { createPageMetadata } from "../../src/i18n/page-metadata";

describe("createPageMetadata", () => {
  it("creates deterministic Chinese metadata with self canonical and every required alternate", () => {
    const metadata = createPageMetadata({
      locale: "zh-CN",
      canonicalPath: "/mods",
      titleKey: "seo.mods.title",
      descriptionKey: "seo.mods.description",
    });

    expect(metadata).toMatchObject({
      title: "星露谷模组规划器",
      description: "规划你的星露谷模组组合。",
      alternates: {
        canonical: "https://stardewvalleyplanner.art/zh/mods",
        languages: {
          en: "https://stardewvalleyplanner.art/mods",
          "zh-CN": "https://stardewvalleyplanner.art/zh/mods",
          "x-default": "https://stardewvalleyplanner.art/mods",
        },
      },
      openGraph: {
        url: "https://stardewvalleyplanner.art/zh/mods",
        title: "星露谷模组规划器",
      },
    });
  });

  it("fails fast with the received key when a metadata message does not exist", () => {
    expect(() =>
      createPageMetadata({
        locale: "en",
        canonicalPath: "/mods",
        titleKey: "seo.mods.unknown",
        descriptionKey: "seo.mods.description",
      }),
    ).toThrow('message key "seo.mods.unknown" does not exist');
  });

  it.each(["/mods?tab=foo", "/mods#details"])(
    "rejects UI state in the canonical path %s",
    (canonicalPath) => {
      expect(() =>
        createPageMetadata({
          locale: "en",
          canonicalPath,
          titleKey: "seo.mods.title",
          descriptionKey: "seo.mods.description",
        }),
      ).toThrow(`canonical path "${canonicalPath}" must not contain "?" or "#"`);
    },
  );

  it("rejects unknown static canonical paths with the received path", () => {
    expect(() =>
      createPageMetadata({
        locale: "en",
        canonicalPath: "/farm/custom",
        titleKey: "seo.mods.title",
        descriptionKey: "seo.mods.description",
      }),
    ).toThrow('canonical public path "/farm/custom" is not supported');
  });
});
