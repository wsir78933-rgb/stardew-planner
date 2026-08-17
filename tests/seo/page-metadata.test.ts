import { expect, expectTypeOf, it } from "vitest";
import type { Metadata } from "next";
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
      socialImagePath?: string;
      robots?: Metadata["robots"];
    }>
  >();
});

it("creates absolute canonical metadata with a route description", () => {
  const metadata = createPublicPageMetadata({
    locale: "en",
    canonicalPath: "/privacy",
    title: "Privacy Policy",
    description: "Learn how browser-local projects and site data are handled.",
  });

  expect(metadata.alternates?.canonical).toBe(
    "https://stardewvalleyplanner.art/privacy",
  );
  expect(metadata.alternates?.languages).toEqual({
    en: "https://stardewvalleyplanner.art/privacy",
    "zh-CN": "https://stardewvalleyplanner.art/zh/privacy",
    "x-default": "https://stardewvalleyplanner.art/privacy",
  });
  expect(metadata.description).toBe(
    "Learn how browser-local projects and site data are handled.",
  );
  expect(metadata.openGraph).toMatchObject({
    url: "https://stardewvalleyplanner.art/privacy",
    title: "Privacy Policy",
    description: "Learn how browser-local projects and site data are handled.",
    type: "website",
    images: [expectedSocialImageUrl],
  });
  expect(metadata.twitter).toMatchObject({
    card: "summary",
    title: "Privacy Policy",
    description: "Learn how browser-local projects and site data are handled.",
    images: [expectedSocialImageUrl],
  });
});

it("preserves the supported article Open Graph type", () => {
  const metadata = createPublicPageMetadata({
    locale: "en",
    canonicalPath: "/carpenter-stardew",
    title: "Carpenter in Stardew Valley",
    description: "Find Robin's building services.",
    openGraphType: "article",
  });

  expect(metadata.openGraph).toMatchObject({ type: "article" });
});

it("resolves a route-specific social image against the public site URL", () => {
  const metadata = createPublicPageMetadata({
    locale: "en",
    canonicalPath: "/carpenter-stardew",
    title: "Carpenter Stardew: Which Robin Service Do You Need Today?",
    description: "Match your task—buy, build, upgrade, or move—to the menu and verify the shop can serve you.",
    socialImagePath: "/blog/carpenter-stardew-cover.webp",
  });

  expect(metadata.openGraph).toMatchObject({
    images: ["https://stardewvalleyplanner.art/blog/carpenter-stardew-cover.webp"],
  });
  expect(metadata.twitter).toMatchObject({
    images: ["https://stardewvalleyplanner.art/blog/carpenter-stardew-cover.webp"],
  });
});

it("preserves an explicit robots directive", () => {
  const metadata = createPublicPageMetadata({
    locale: "en",
    canonicalPath: "/contact",
    title: "Contact Stardew Valley Planner",
    description: "Get in touch with Stardew Valley Planner.",
    robots: { index: false, follow: true },
  });

  expect(metadata.robots).toEqual({ index: false, follow: true });
});

it("creates Chinese metadata from a locale-neutral public identity", () => {
  const metadata = createPublicPageMetadata({
    locale: "zh-CN",
    canonicalPath: "/privacy",
    title: "隐私政策",
    description: "了解浏览器本地项目和站点数据的处理方式。",
  });

  expect(metadata.alternates).toEqual({
    canonical: "https://stardewvalleyplanner.art/zh/privacy",
    languages: {
      en: "https://stardewvalleyplanner.art/privacy",
      "zh-CN": "https://stardewvalleyplanner.art/zh/privacy",
      "x-default": "https://stardewvalleyplanner.art/privacy",
    },
  });
  expect(metadata.openGraph).toMatchObject({
    url: "https://stardewvalleyplanner.art/zh/privacy",
    images: [expectedSocialImageUrl],
  });
  expect(metadata.twitter).toMatchObject({
    images: [expectedSocialImageUrl],
  });
});
