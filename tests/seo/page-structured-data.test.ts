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
    headline: "Carpenter in Stardew Valley",
    description: "Find Robin's building services.",
    pathname: "/carpenter-stardew",
  });
  const articleWithImage = createArticleStructuredData({
    locale: "zh-CN",
    headline: "星露谷木匠指南",
    description: "查看罗宾的建筑服务。",
    pathname: "/zh/carpenter-stardew",
    imagePathname: "/blog/carpenter-stardew-cover.png",
  });
  const collectionPage = createCollectionPageStructuredData({
    locale: "zh-CN",
    name: "星露谷农场规划指南",
    description: "浏览农场规划文章。",
    pathname: "/zh/blog",
  });
  const breadcrumbs = createBreadcrumbListStructuredData({
    items: [
      { name: "Planner", pathname: "/" },
      { name: "Carpenter guide", pathname: "/carpenter-stardew" },
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
    headline: "Carpenter in Stardew Valley",
    url: "https://stardewvalleyplanner.art/carpenter-stardew",
    inLanguage: "en",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
  });
  expect(articleWithImage).toMatchObject({
    "@type": "Article",
    url: "https://stardewvalleyplanner.art/zh/carpenter-stardew",
    inLanguage: "zh-CN",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
    image: "https://stardewvalleyplanner.art/blog/carpenter-stardew-cover.png",
  });
  expect(collectionPage).toMatchObject({
    "@type": "CollectionPage",
    name: "星露谷农场规划指南",
    url: "https://stardewvalleyplanner.art/zh/blog",
    inLanguage: "zh-CN",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
  });
  expect(breadcrumbs).toMatchObject({
    "@type": "BreadcrumbList",
    itemListElement: [
      { position: 1, name: "Planner", item: "https://stardewvalleyplanner.art" },
      {
        position: 2,
        name: "Carpenter guide",
        item: "https://stardewvalleyplanner.art/carpenter-stardew",
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
