import { describe, expect, it } from "vitest";
import {
  createFarmGuidePageMetadata,
  createPageMetadata,
} from "../../src/i18n/page-metadata";

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
      applicationName: "星露谷规划器",
      robots: { index: true, follow: true },
      alternates: {
        canonical: "https://stardewvalleyplanner.art/zh/mods",
        languages: {
          en: "https://stardewvalleyplanner.art/mods",
          "zh-CN": "https://stardewvalleyplanner.art/zh/mods",
          "x-default": "https://stardewvalleyplanner.art/mods",
        },
      },
      openGraph: {
        type: "website",
        url: "https://stardewvalleyplanner.art/zh/mods",
        title: "星露谷模组规划器",
        description: "规划你的星露谷模组组合。",
        siteName: "Stardew Planner",
        locale: "zh_CN",
      },
      twitter: {
        card: "summary",
        title: "星露谷模组规划器",
        description: "规划你的星露谷模组组合。",
      },
    });
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter?.images).toBeUndefined();
  });

  it("uses farm guide translations in HTML, Open Graph, and Twitter metadata", () => {
    const metadata = createFarmGuidePageMetadata(
      "en",
      "/farm/standard",
      "Standard Farm",
    );

    expect(metadata).toMatchObject({
      title: "Standard Farm Guide | Stardew Planner",
      description:
        "Explore the Standard Farm map and start planning its Stardew Valley layout.",
      openGraph: {
        title: "Standard Farm Guide | Stardew Planner",
        description:
          "Explore the Standard Farm map and start planning its Stardew Valley layout.",
      },
      twitter: {
        title: "Standard Farm Guide | Stardew Planner",
        description:
          "Explore the Standard Farm map and start planning its Stardew Valley layout.",
      },
    });
  });

  it("rejects a farm guide name that leaves the farmName placeholder unresolved", () => {
    const createMetadataWithUnresolvedFarmName = () =>
      createFarmGuidePageMetadata("en", "/farm/standard", "{farmName}");

    expect(createMetadataWithUnresolvedFarmName).toThrow("{farmName}");
    expect(createMetadataWithUnresolvedFarmName).toThrow(
      "seo.farmGuide.title",
    );
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
