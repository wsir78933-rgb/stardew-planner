import { expect, expectTypeOf, it } from "vitest";
import type { PublicLocale } from "../../src/i18n/public-locale";
import type { PublicCanonicalPath } from "../../src/i18n/public-route-registry";
import {
  createPublicPageMetadata,
  type PublicPageMetadataInput,
} from "../../src/seo/page-metadata";

const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.png";

it("requires an explicit locale and canonical public identity at the type boundary", () => {
  expectTypeOf<PublicPageMetadataInput>().toEqualTypeOf<
    Readonly<{
      locale: PublicLocale;
      canonicalPath: PublicCanonicalPath;
      title: string;
      description: string;
      openGraphType?: "article" | "website";
    }>
  >();
});

it("creates absolute canonical metadata with a route description", () => {
  const metadata = createPublicPageMetadata({
    locale: "en",
    canonicalPath: "/mods",
    title: "Modded Stardew Valley Farms",
    description:
      "Browse local planning maps for community-made Stardew Valley farms and interiors.",
  });

  expect(metadata.alternates?.canonical).toBe(
    "https://stardewvalleyplanner.art/mods",
  );
  expect(metadata.alternates?.languages).toEqual({
    en: "https://stardewvalleyplanner.art/mods",
    "zh-CN": "https://stardewvalleyplanner.art/zh/mods",
    "x-default": "https://stardewvalleyplanner.art/mods",
  });
  expect(metadata.description).toBe(
    "Browse local planning maps for community-made Stardew Valley farms and interiors.",
  );
  expect(metadata.openGraph).toMatchObject({
    url: "https://stardewvalleyplanner.art/mods",
    title: "Modded Stardew Valley Farms",
    description:
      "Browse local planning maps for community-made Stardew Valley farms and interiors.",
    type: "website",
    images: [expectedSocialImageUrl],
  });
  expect(metadata.twitter).toMatchObject({
    card: "summary",
    title: "Modded Stardew Valley Farms",
    description:
      "Browse local planning maps for community-made Stardew Valley farms and interiors.",
    images: [expectedSocialImageUrl],
  });
});

it("preserves the supported article Open Graph type", () => {
  const metadata = createPublicPageMetadata({
    locale: "en",
    canonicalPath: "/farm/standard",
    title: "Standard Farm Guide",
    description: "Plan a Standard Farm.",
    openGraphType: "article",
  });

  expect(metadata.openGraph).toMatchObject({ type: "article" });
});

it("creates Chinese metadata from a locale-neutral public identity", () => {
  const metadata = createPublicPageMetadata({
    locale: "zh-CN",
    canonicalPath: "/mods",
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
    images: [expectedSocialImageUrl],
  });
  expect(metadata.twitter).toMatchObject({
    images: [expectedSocialImageUrl],
  });
});
