import { expect, it } from "vitest";
import {
  createArticleStructuredData,
  createBreadcrumbListStructuredData,
  createCollectionPageStructuredData,
  createJapaneseHomepageWebApplicationStructuredData,
  createRussianHomepageWebApplicationStructuredData,
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
    inLanguage: ["en", "zh-CN", "ja", "ru"],
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

it("describes the Russian homepage as a Russian web application without widening the site locale", () => {
  const russianWebApplication = createRussianHomepageWebApplicationStructuredData({
    name: "Планировщик фермы Stardew Valley",
    description:
      "Планируйте свою ферму в Stardew Valley до того, как начнете строить в игре. Выбирайте из 8 типов ферм, расставляйте здания и посевы, переключайте сезоны, проверяйте зоны действия и импортируйте сохранения.",
  });

  expect(russianWebApplication).toMatchObject({
    "@type": "WebApplication",
    name: "Планировщик фермы Stardew Valley",
    url: "https://stardewvalleyplanner.art/ru",
    inLanguage: "ru",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
  });
  expect(russianWebApplication["@type"]).not.toBe("WebSite");
  expect(() =>
    createRussianHomepageWebApplicationStructuredData({
      name: "   ",
      description: "описание",
    }),
  ).toThrow('Received: "   "');
});

it("builds Japanese homepage WebApplication fields from the confirmed copy", () => {
  const japanesePlannerTitle =
    "スターデューバレー プランナー｜無料のオンライン牧場レイアウトツール";
  const japanesePlannerDescription =
    "スタバレのレイアウトツールで、ゲーム内で建てる前に牧場を計画。8種類の牧場から選び、建物や作物を配置できます。季節の切り替え、スプリンクラーの範囲確認、セーブデータの読み込みにも対応。";
  const japaneseWebApplication = createJapaneseHomepageWebApplicationStructuredData({
    name: japanesePlannerTitle,
    description: japanesePlannerDescription,
    pathname: "/ja",
  });

  expect(japaneseWebApplication).toEqual({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://stardewvalleyplanner.art/ja#webapplication",
    name: japanesePlannerTitle,
    description: japanesePlannerDescription,
    url: "https://stardewvalleyplanner.art/ja",
    inLanguage: "ja",
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
    isAccessibleForFree: true,
    browserRequirements: "Requires a modern web browser with JavaScript enabled.",
  });
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
    expect(japaneseWebApplication).not.toHaveProperty(forbiddenProperty);
  }
});

it("rejects a Japanese homepage structured data pathname other than /ja", () => {
  expect(() =>
    createJapaneseHomepageWebApplicationStructuredData({
      name: "スターデューバレー プランナー",
      description: "牧場を計画。",
      pathname: "/ja/blog",
    }),
  ).toThrow('Received: "/ja/blog"');
});

it("rejects an empty Japanese homepage structured data name or description", () => {
  expect(() =>
    createJapaneseHomepageWebApplicationStructuredData({
      name: "   ",
      description: "牧場を計画。",
      pathname: "/ja",
    }),
  ).toThrow('Received: "   "');
  expect(() =>
    createJapaneseHomepageWebApplicationStructuredData({
      name: "スターデューバレー プランナー",
      description: "",
      pathname: "/ja",
    }),
  ).toThrow('Received: ""');
});
