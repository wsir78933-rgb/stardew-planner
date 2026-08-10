import { expect, it } from "vitest";
import {
  createArticleStructuredData,
  createBreadcrumbListStructuredData,
  createCollectionPageStructuredData,
  createWebApplicationStructuredData,
  createWebSiteStructuredData,
  serializeJsonLd,
} from "../../src/seo/page-structured-data";

it("escapes a script-closing sequence in JSON-LD", () => {
  expect(serializeJsonLd({ label: "</script><p>unsafe" })).toContain(
    "\\u003c/script>",
  );
});

it("builds schema data exclusively from explicit visible fields", () => {
  const website = createWebSiteStructuredData();
  const webApplication = createWebApplicationStructuredData({
    locale: "en",
    name: "Stardew Valley Planner",
    description: "Plan Stardew Valley farm layouts.",
    pathname: "/",
  });
  const article = createArticleStructuredData({
    locale: "en",
    headline: "Standard Farm Guide",
    description: "Plan a Standard Farm.",
    pathname: "/farm/standard",
  });
  const articleWithImage = createArticleStructuredData({
    locale: "zh-CN",
    headline: "标准农场指南",
    description: "规划标准农场。",
    pathname: "/zh/farm/standard",
    imagePathname: "/public-previews/1.6.15/farms/standard.webp",
  });
  const collectionPage = createCollectionPageStructuredData({
    locale: "zh-CN",
    name: "Modded Stardew Valley Farms",
    description: "Browse community-made maps.",
    pathname: "/mods",
  });
  const breadcrumbs = createBreadcrumbListStructuredData({
    items: [
      { name: "Planner", pathname: "/" },
      { name: "Standard Farm", pathname: "/farm/standard" },
    ],
  });

  expect(website).toEqual({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://stardewvalleyplanner.art/#website",
    name: "Stardew Valley Planner",
    url: "https://stardewvalleyplanner.art",
    inLanguage: ["en", "zh-CN"],
  });
  expect(webApplication).toMatchObject({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://stardewvalleyplanner.art#webapplication",
    name: "Stardew Valley Planner",
    url: "https://stardewvalleyplanner.art",
    inLanguage: "en",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
    isAccessibleForFree: true,
    browserRequirements: "Requires a modern web browser with JavaScript enabled.",
  });
  expect(article).toMatchObject({
    "@type": "Article",
    headline: "Standard Farm Guide",
    url: "https://stardewvalleyplanner.art/farm/standard",
    inLanguage: "en",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
  });
  expect(articleWithImage).toMatchObject({
    "@type": "Article",
    url: "https://stardewvalleyplanner.art/zh/farm/standard",
    inLanguage: "zh-CN",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
    image: "https://stardewvalleyplanner.art/public-previews/1.6.15/farms/standard.webp",
  });
  expect(collectionPage).toMatchObject({
    "@type": "CollectionPage",
    name: "Modded Stardew Valley Farms",
    url: "https://stardewvalleyplanner.art/mods",
    inLanguage: "zh-CN",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
  });
  expect(breadcrumbs).toMatchObject({
    "@type": "BreadcrumbList",
    itemListElement: [
      { position: 1, name: "Planner", item: "https://stardewvalleyplanner.art" },
      {
        position: 2,
        name: "Standard Farm",
        item: "https://stardewvalleyplanner.art/farm/standard",
      },
    ],
  });

  for (const structuredData of [
    website,
    webApplication,
    article,
    articleWithImage,
    collectionPage,
    breadcrumbs,
  ]) {
    for (const forbiddenProperty of [
      "author",
      "reviewedBy",
      "datePublished",
      "dateModified",
      "aggregateRating",
      "review",
      "offers",
      "price",
      "priceCurrency",
      "publisher",
      "operatingSystem",
      "applicationCategory",
    ]) {
      expect(structuredData).not.toHaveProperty(forbiddenProperty);
    }
  }

  expect(article).not.toHaveProperty("image");
});
