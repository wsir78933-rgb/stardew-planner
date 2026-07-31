import { expect, it } from "vitest";
import {
  createArticleStructuredData,
  createBreadcrumbListStructuredData,
  createCollectionPageStructuredData,
  createWebApplicationStructuredData,
  serializeJsonLd,
} from "../../src/seo/page-structured-data";

it("escapes a script-closing sequence in JSON-LD", () => {
  expect(serializeJsonLd({ label: "</script><p>unsafe" })).toContain(
    "\\u003c/script>",
  );
});

it("builds schema data exclusively from explicit visible fields", () => {
  const webApplication = createWebApplicationStructuredData({
    name: "Stardew Valley Planner",
    description: "Plan Stardew Valley farm layouts.",
    pathname: "/",
  });
  const article = createArticleStructuredData({
    headline: "Standard Farm Guide",
    description: "Plan a Standard Farm.",
    pathname: "/farm/standard",
  });
  const collectionPage = createCollectionPageStructuredData({
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

  expect(webApplication).toMatchObject({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Stardew Valley Planner",
    url: "https://stardewvalleyplanner.art",
  });
  expect(article).toMatchObject({
    "@type": "Article",
    headline: "Standard Farm Guide",
    url: "https://stardewvalleyplanner.art/farm/standard",
  });
  expect(collectionPage).toMatchObject({
    "@type": "CollectionPage",
    name: "Modded Stardew Valley Farms",
    url: "https://stardewvalleyplanner.art/mods",
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
    webApplication,
    article,
    collectionPage,
    breadcrumbs,
  ]) {
    expect(structuredData).not.toHaveProperty("aggregateRating");
    expect(structuredData).not.toHaveProperty("offers");
    expect(structuredData).not.toHaveProperty("author");
    expect(structuredData).not.toHaveProperty("image");
  }
});
