import { describe, expect, it } from "vitest";
import {
  createCollectionPageStructuredData,
  createFarmGuideArticleStructuredData,
  createPlannerWebApplicationStructuredData,
} from "../../src/i18n/page-structured-data";

const prohibitedStructuredDataProperties = [
  "image",
  "author",
  "aggregateRating",
  "offers",
  "sameAs",
] as const;

describe("page structured data", () => {
  it("creates localized WebApplication structured data for the English planner homepage", () => {
    expect(
      createPlannerWebApplicationStructuredData({
        locale: "en",
        canonicalPath: "/",
        titleKey: "seo.planner.title",
        descriptionKey: "seo.planner.description",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Stardew Valley Farm Planner",
      description:
        "Plan Stardew Valley farm layouts with local maps, items, and projects.",
      url: "https://stardewvalleyplanner.art/",
      inLanguage: "en",
    });
  });

  it("creates localized CollectionPage structured data for the farm comparison and mods pages", () => {
    expect(
      createCollectionPageStructuredData({
        locale: "en",
        canonicalPath: "/farm-comparison",
        titleKey: "seo.farmComparison.title",
        descriptionKey: "seo.farmComparison.description",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Stardew Valley Farm Comparison",
      description:
        "Compare every official Stardew Valley farm map before planning your layout.",
      url: "https://stardewvalleyplanner.art/farm-comparison",
      inLanguage: "en",
    });

    expect(
      createCollectionPageStructuredData({
        locale: "zh-CN",
        canonicalPath: "/mods",
        titleKey: "seo.mods.title",
        descriptionKey: "seo.mods.description",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "星露谷模组规划器",
      description: "规划你的星露谷模组组合。",
      url: "https://stardewvalleyplanner.art/zh/mods",
      inLanguage: "zh-CN",
    });
  });

  it("creates localized Article structured data for farm guides", () => {
    expect(
      createFarmGuideArticleStructuredData({
        locale: "zh-CN",
        canonicalPath: "/farm/standard",
        farmName: "标准农场",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "标准农场 指南 | 星露谷规划器",
      description: "了解标准农场地图，并开始规划你的星露谷农场布局。",
      url: "https://stardewvalleyplanner.art/zh/farm/standard",
      inLanguage: "zh-CN",
    });
  });

  it("omits unsupported image, author, rating, price, and social properties", () => {
    const structuredData = [
      createPlannerWebApplicationStructuredData({
        locale: "en",
        canonicalPath: "/",
        titleKey: "seo.planner.title",
        descriptionKey: "seo.planner.description",
      }),
      createCollectionPageStructuredData({
        locale: "en",
        canonicalPath: "/mods",
        titleKey: "seo.mods.title",
        descriptionKey: "seo.mods.description",
      }),
      createFarmGuideArticleStructuredData({
        locale: "en",
        canonicalPath: "/farm/standard",
        farmName: "Standard Farm",
      }),
    ];

    for (const pageStructuredData of structuredData) {
      for (const prohibitedProperty of prohibitedStructuredDataProperties) {
        expect(pageStructuredData).not.toHaveProperty(prohibitedProperty);
      }
    }
  });

  it("rejects unsupported locale and canonical path inputs with their received values", () => {
    expect(() =>
      createPlannerWebApplicationStructuredData({
        locale: "fr" as never,
        canonicalPath: "/",
        titleKey: "seo.planner.title",
        descriptionKey: "seo.planner.description",
      }),
    ).toThrow('site locale "fr" is not supported');

    expect(() =>
      createCollectionPageStructuredData({
        locale: "en",
        canonicalPath: "/farm/custom",
        titleKey: "seo.mods.title",
        descriptionKey: "seo.mods.description",
      }),
    ).toThrow('canonical public path "/farm/custom" is not supported');
  });

  it("rejects a farm name that leaves a structured-data placeholder unresolved", () => {
    expect(() =>
      createFarmGuideArticleStructuredData({
        locale: "en",
        canonicalPath: "/farm/standard",
        farmName: "{farmName}",
      }),
    ).toThrow('{farmName}');
  });
});
