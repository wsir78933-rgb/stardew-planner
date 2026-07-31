import { expect, it } from "vitest";
import { createPublicPageMetadata } from "../../src/seo/page-metadata";

it("creates absolute canonical metadata with a route description", () => {
  const metadata = createPublicPageMetadata({
    pathname: "/mods",
    title: "Modded Stardew Valley Farms",
    description:
      "Browse local planning maps for community-made Stardew Valley farms and interiors.",
  });

  expect(metadata.alternates?.canonical).toBe(
    "https://stardewvalleyplanner.art/mods",
  );
  expect(metadata.description).toBe(
    "Browse local planning maps for community-made Stardew Valley farms and interiors.",
  );
  expect(metadata.openGraph).toMatchObject({
    url: "https://stardewvalleyplanner.art/mods",
    title: "Modded Stardew Valley Farms",
    description:
      "Browse local planning maps for community-made Stardew Valley farms and interiors.",
    type: "website",
  });
  expect(metadata.twitter).toMatchObject({
    card: "summary",
    title: "Modded Stardew Valley Farms",
    description:
      "Browse local planning maps for community-made Stardew Valley farms and interiors.",
  });
});

it("preserves the supported article Open Graph type", () => {
  const metadata = createPublicPageMetadata({
    pathname: "/farm/standard",
    title: "Standard Farm Guide",
    description: "Plan a Standard Farm.",
    openGraphType: "article",
  });

  expect(metadata.openGraph).toMatchObject({ type: "article" });
});

it("creates Chinese metadata from a locale-neutral public identity", () => {
  const metadata = createPublicPageMetadata({
    pathname: "/mods",
    locale: "zh-CN",
    title: "星露谷物语模组农场",
    description: "浏览社区制作的星露谷物语农场和室内规划地图。",
  });

  expect(metadata.alternates).toEqual({
    canonical: "https://stardewvalleyplanner.art/zh/mods",
    languages: {
      en: "https://stardewvalleyplanner.art/mods",
      "zh-CN": "https://stardewvalleyplanner.art/zh/mods",
      "x-default": "https://stardewvalleyplanner.art/mods",
    },
  });
  expect(metadata.openGraph).toMatchObject({
    url: "https://stardewvalleyplanner.art/zh/mods",
  });
});

it("keeps legal pages outside the localized public route registry", () => {
  const metadata = createPublicPageMetadata({
    pathname: "/privacy",
    title: "Privacy Policy",
    description: "Learn how this browser-local planner handles local data.",
  });

  expect(metadata.alternates).toEqual({
    canonical: "https://stardewvalleyplanner.art/privacy",
  });
});
