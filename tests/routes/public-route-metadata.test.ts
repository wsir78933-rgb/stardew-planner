import { describe, expect, it } from "vitest";
import { metadata as plannerMetadata } from "../../app/(en)/page";
import { farmComparisonMetadata } from "../../app/(en)/farm-comparison/page";
import { generateMetadata } from "../../app/(en)/farm/[type]/page";
import { modsMetadata } from "../../app/(en)/mods/page";
import { metadata as contactMetadata } from "../../app/(en)/contact/page";
import { metadata as blogIndexMetadata } from "../../app/(en)/blog/page";
import { metadata as blogArchiveMetadata } from "../../app/(en)/blog/archive/page";
import { metadata as chinesePlannerMetadata } from "../../app/zh/page";
import { farmComparisonMetadata as chineseFarmComparisonMetadata } from "../../app/zh/farm-comparison/page";
import {
  dynamicParams as chineseFarmDynamicParams,
  generateMetadata as generateChineseFarmMetadata,
  generateStaticParams as generateChineseFarmStaticParams,
} from "../../app/zh/farm/[type]/page";
import { modsMetadata as chineseModsMetadata } from "../../app/zh/mods/page";
import { metadata as chineseContactMetadata } from "../../app/zh/contact/page";
import { metadata as chineseBlogIndexMetadata } from "../../app/zh/blog/page";
import { metadata as chineseBlogArchiveMetadata } from "../../app/zh/blog/archive/page";
import {
  dynamicParams as blogDynamicParams,
  generateMetadata as generateBlogMetadata,
  generateStaticParams as generateBlogStaticParams,
} from "../../app/(en)/[slug]/page";
import {
  dynamicParams as chineseBlogDynamicParams,
  generateMetadata as generateChineseBlogMetadata,
  generateStaticParams as generateChineseBlogStaticParams,
} from "../../app/zh/[slug]/page";
import { blogPostSlugs, getBlogPostBySlug } from "../../src/blog/blog-post-registry";
import {
  officialFarmGuides,
  officialFarmTypes,
} from "../../src/reference/official-farm-guides";

const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.png";

const fixedInformationPageMetadataExpectations = [
  [
    farmComparisonMetadata,
    "Stardew Valley Farm Types: Compare All 8 Maps",
    "Compare all 8 Stardew Valley farm types by usable space, unique resources, and layout trade-offs. Find the right map for crops, fishing, animals, co-op, or a challenge run.",
    "https://stardewvalleyplanner.art/farm-comparison",
  ],
  [
    modsMetadata,
    "Stardew Valley Farm Map Mods | Stardew Planner",
    "Compare 18 Stardew Valley farm map mods and 3 SVE interiors, see who each layout suits, and open every supported map in the online planner.",
    "https://stardewvalleyplanner.art/mods",
  ],
] as const;

const publicPageMetadataExpectations = [
  [plannerMetadata, "/"],
  [farmComparisonMetadata, "/farm-comparison"],
  [modsMetadata, "/mods"],
  [contactMetadata, "/contact"],
] as const;

function createExpectedLanguageAlternates(pathname: string) {
  const englishUrl = `https://stardewvalleyplanner.art${pathname === "/" ? "" : pathname}`;
  const chineseUrl = `https://stardewvalleyplanner.art/zh${pathname === "/" ? "" : pathname}`;

  return {
    en: englishUrl,
    "zh-CN": chineseUrl,
    "x-default": englishUrl,
  };
}

describe("public route metadata", () => {
  it("uses the approved English planner metadata without changing localized routes", () => {
    expect(plannerMetadata).toMatchObject({
      title: "Stardew Valley Planner – Free Online Farm Layout Tool",
      description:
        "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
      openGraph: {
        title: "Stardew Valley Planner – Free Online Farm Layout Tool",
        description:
          "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
      },
      twitter: {
        title: "Stardew Valley Planner – Free Online Farm Layout Tool",
        description:
          "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
      },
    });
  });

  it("uses exact title, description, and canonical metadata for fixed information pages", () => {
    for (const [pageMetadata, title, description, canonical] of fixedInformationPageMetadataExpectations) {
      expect(pageMetadata).toMatchObject({
        title,
        description,
        alternates: { canonical },
      });
    }
  });

  it("generates exact metadata for every official farm guide", async () => {
    for (const farmType of officialFarmTypes) {
      const farmGuide = officialFarmGuides[farmType];

      await expect(
        generateMetadata({ params: Promise.resolve({ type: farmType }) }),
      ).resolves.toMatchObject({
        title: `${farmGuide.title} | Stardew Valley Farm Planner`,
        description: `${farmGuide.title} farm guide. ${farmGuide.bestFor}`,
        alternates: {
          canonical: `https://stardewvalleyplanner.art/farm/${farmType}`,
        },
      });
    }
  });

  it("publishes paired language alternates for every English public route", async () => {
    for (const [pageMetadata, pathname] of publicPageMetadataExpectations) {
      expect(pageMetadata.alternates).toMatchObject({
        canonical: `https://stardewvalleyplanner.art${pathname === "/" ? "" : pathname}`,
        languages: createExpectedLanguageAlternates(pathname),
      });
      expect(pageMetadata.openGraph).toMatchObject({
        images: [expectedSocialImageUrl],
      });
      expect(pageMetadata.twitter).toMatchObject({
        images: [expectedSocialImageUrl],
      });
    }

    for (const farmType of officialFarmTypes) {
      await expect(
        generateMetadata({ params: Promise.resolve({ type: farmType }) }),
      ).resolves.toMatchObject({
        alternates: {
          canonical: `https://stardewvalleyplanner.art/farm/${farmType}`,
          languages: createExpectedLanguageAlternates(`/farm/${farmType}`),
        },
        openGraph: { images: [expectedSocialImageUrl] },
        twitter: { images: [expectedSocialImageUrl] },
      });
    }
  });

  it("assigns Chinese fixed public pages their localized canonicals and language alternates", () => {
    for (const [pageMetadata, pathname] of [
      [chinesePlannerMetadata, "/"],
      [chineseFarmComparisonMetadata, "/farm-comparison"],
      [chineseModsMetadata, "/mods"],
      [chineseContactMetadata, "/contact"],
    ] as const) {
      expect(pageMetadata.alternates).toMatchObject({
        canonical: `https://stardewvalleyplanner.art/zh${pathname === "/" ? "" : pathname}`,
        languages: createExpectedLanguageAlternates(pathname),
      });
      expect(pageMetadata.openGraph).toMatchObject({
        images: [expectedSocialImageUrl],
      });
      expect(pageMetadata.twitter).toMatchObject({
        images: [expectedSocialImageUrl],
      });
    }
  });

  it("uses search-focused Chinese metadata for the Mod map collection", () => {
    expect(chineseModsMetadata).toMatchObject({
      title: "星露谷物语农场地图 Mod | 星露谷规划器",
      description:
        "对比 18 张星露谷物语农场地图 Mod 和 3 张 SVE 室内地图，了解每张地图适合谁，并在在线规划器中打开受支持的布局。",
    });
  });

  it("uses decision-focused Chinese metadata for the farm comparison", () => {
    expect(chineseFarmComparisonMetadata).toMatchObject({
      title: "星露谷物语农场类型对比：8 种地图怎么选",
      description:
        "对比《星露谷物语》8 种农场地图的可用空间、独特资源与布局取舍，快速找到适合作物、钓鱼、畜牧、多人联机或挑战玩法的农场。",
    });
  });

  it("marks the bilingual contact pages as followable but noindex", () => {
    for (const pageMetadata of [contactMetadata, chineseContactMetadata]) {
      expect(pageMetadata).toMatchObject({
        robots: { index: false, follow: true },
      });
    }
  });

  it("marks every fixed bilingual blog page as followable but noindex", () => {
    for (const pageMetadata of [
      blogIndexMetadata,
      blogArchiveMetadata,
      chineseBlogIndexMetadata,
      chineseBlogArchiveMetadata,
    ]) {
      expect(pageMetadata).toMatchObject({
        robots: { index: false, follow: true },
      });
    }
  });

  it("generates every Chinese official farm metadata entry at its localized path", async () => {
    expect(generateChineseFarmStaticParams()).toEqual(
      officialFarmTypes.map((type) => ({ type })),
    );
    expect(chineseFarmDynamicParams).toBe(false);

    for (const farmType of officialFarmTypes) {
      await expect(
        generateChineseFarmMetadata({
          params: Promise.resolve({ type: farmType }),
        }),
      ).resolves.toMatchObject({
        alternates: {
          canonical: `https://stardewvalleyplanner.art/zh/farm/${farmType}`,
          languages: createExpectedLanguageAlternates(`/farm/${farmType}`),
        },
        openGraph: { images: [expectedSocialImageUrl] },
        twitter: { images: [expectedSocialImageUrl] },
      });
    }
  });

  it("generates paired article metadata from each localized blog post cover", async () => {
    expect(generateBlogStaticParams()).toEqual(blogPostSlugs.map((slug) => ({ slug })));
    expect(generateChineseBlogStaticParams()).toEqual(
      blogPostSlugs.map((slug) => ({ slug })),
    );
    expect(blogDynamicParams).toBe(false);
    expect(chineseBlogDynamicParams).toBe(false);

    for (const slug of blogPostSlugs) {
      const englishPost = getBlogPostBySlug("en", slug);
      const chinesePost = getBlogPostBySlug("zh-CN", slug);

      if (englishPost === undefined || chinesePost === undefined) {
        throw new Error(`Missing localized blog post metadata for ${slug}.`);
      }

      await expect(
        generateBlogMetadata({ params: Promise.resolve({ slug }) }),
      ).resolves.toMatchObject({
        title: englishPost.title,
        description: englishPost.description,
        alternates: {
          canonical: `https://stardewvalleyplanner.art/${slug}`,
          languages: createExpectedLanguageAlternates(`/${slug}`),
        },
        openGraph: {
          type: "article",
          images: [`https://stardewvalleyplanner.art${englishPost.coverImage.src}`],
        },
        twitter: {
          images: [`https://stardewvalleyplanner.art${englishPost.coverImage.src}`],
        },
        robots: { index: false, follow: true },
      });

      await expect(
        generateChineseBlogMetadata({ params: Promise.resolve({ slug }) }),
      ).resolves.toMatchObject({
        title: chinesePost.title,
        description: chinesePost.description,
        alternates: {
          canonical: `https://stardewvalleyplanner.art/zh/${slug}`,
          languages: createExpectedLanguageAlternates(`/${slug}`),
        },
        openGraph: {
          type: "article",
          images: [`https://stardewvalleyplanner.art${chinesePost.coverImage.src}`],
        },
        twitter: {
          images: [`https://stardewvalleyplanner.art${chinesePost.coverImage.src}`],
        },
        robots: { index: false, follow: true },
      });
    }
  });
});
