import { expect, expectTypeOf, it } from "vitest";
import type { Metadata } from "next";
import { metadata as japanesePlannerMetadata } from "../../app/ja/page";
import type { PublicLocale } from "../../src/i18n/public-locale";
import type { PublicCanonicalPath } from "../../src/i18n/public-route-registry";
import {
  createJapaneseHomepageMetadata,
  createPublicPageMetadata,
  type PublicPageMetadataInput,
} from "../../src/seo/page-metadata";

const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.webp";

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
    card: "summary_large_image",
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

it("adds Japanese only to homepage language alternates", () => {
  const homepageMetadata = createPublicPageMetadata({
    locale: "en",
    canonicalPath: "/",
    title: "Home",
    description: "Home description",
  });
  const privacyMetadata = createPublicPageMetadata({
    locale: "zh-CN",
    canonicalPath: "/privacy",
    title: "隐私政策",
    description: "了解浏览器本地项目和站点数据的处理方式。",
  });

  expect(homepageMetadata.alternates?.languages).toMatchObject({
    en: "https://stardewvalleyplanner.art",
    "zh-CN": "https://stardewvalleyplanner.art/zh",
    ja: "https://stardewvalleyplanner.art/ja",
    "x-default": "https://stardewvalleyplanner.art",
  });
  expect(privacyMetadata.alternates?.languages).not.toHaveProperty("ja");
});

it("rejects an empty Japanese homepage title or description", () => {
  expect(() =>
    createJapaneseHomepageMetadata({
      title: " ",
      description: "牧場を計画。",
    }),
  ).toThrow('Received: " "');
  expect(() =>
    createJapaneseHomepageMetadata({
      title: "スターデューバレー プランナー",
      description: "",
    }),
  ).toThrow('Received: ""');
});

it("publishes the confirmed Japanese homepage title, description, and alternates", () => {
  const japanesePlannerTitle =
    "スターデューバレー プランナー｜無料のオンライン牧場レイアウトツール";
  const japanesePlannerDescription =
    "スタバレのレイアウトツールで、ゲーム内で建てる前に牧場を計画。8種類の牧場から選び、建物や作物を配置できます。季節の切り替え、スプリンクラーの範囲確認、セーブデータの読み込みにも対応。";

  expect(japanesePlannerMetadata).toMatchObject({
    title: japanesePlannerTitle,
    description: japanesePlannerDescription,
    alternates: {
      canonical: "https://stardewvalleyplanner.art/ja",
      languages: {
        en: "https://stardewvalleyplanner.art",
        "zh-CN": "https://stardewvalleyplanner.art/zh",
        ja: "https://stardewvalleyplanner.art/ja",
        "x-default": "https://stardewvalleyplanner.art",
      },
    },
    openGraph: {
      title: japanesePlannerTitle,
      description: japanesePlannerDescription,
      type: "website",
      url: "https://stardewvalleyplanner.art/ja",
      images: [expectedSocialImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: japanesePlannerTitle,
      description: japanesePlannerDescription,
      images: [expectedSocialImageUrl],
    },
  });
});
