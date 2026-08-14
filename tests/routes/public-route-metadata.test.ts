import { describe, expect, it } from "vitest";
import {
  dynamicParams as blogDynamicParams,
  generateMetadata as generateBlogMetadata,
  generateStaticParams as generateBlogStaticParams,
} from "../../app/(en)/[slug]/page";
import { metadata as blogArchiveMetadata } from "../../app/(en)/blog/archive/page";
import { metadata as blogIndexMetadata } from "../../app/(en)/blog/page";
import { metadata as contactMetadata } from "../../app/(en)/contact/page";
import { metadata as plannerMetadata } from "../../app/(en)/page";
import {
  dynamicParams as chineseBlogDynamicParams,
  generateMetadata as generateChineseBlogMetadata,
  generateStaticParams as generateChineseBlogStaticParams,
} from "../../app/zh/[slug]/page";
import { metadata as chineseBlogArchiveMetadata } from "../../app/zh/blog/archive/page";
import { metadata as chineseBlogIndexMetadata } from "../../app/zh/blog/page";
import { metadata as chineseContactMetadata } from "../../app/zh/contact/page";
import { metadata as chinesePlannerMetadata } from "../../app/zh/page";
import { blogPostSlugs, getBlogPostBySlug } from "../../src/blog/blog-post-registry";

const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.png";

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
  it("uses the approved English planner metadata", () => {
    expect(plannerMetadata).toMatchObject({
      title: "Stardew Valley Planner – Free Online Farm Layout Tool",
      description:
        "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
      openGraph: {
        title: "Stardew Valley Planner – Free Online Farm Layout Tool",
        images: [expectedSocialImageUrl],
      },
      twitter: {
        title: "Stardew Valley Planner – Free Online Farm Layout Tool",
        images: [expectedSocialImageUrl],
      },
    });
  });

  it("publishes paired language alternates for the remaining fixed routes", () => {
    for (const [pageMetadata, pathname] of [
      [plannerMetadata, "/"],
      [contactMetadata, "/contact"],
      [chinesePlannerMetadata, "/"],
      [chineseContactMetadata, "/contact"],
    ] as const) {
      const localizedCanonical =
        pageMetadata === chinesePlannerMetadata ||
        pageMetadata === chineseContactMetadata
          ? `https://stardewvalleyplanner.art/zh${pathname === "/" ? "" : pathname}`
          : `https://stardewvalleyplanner.art${pathname === "/" ? "" : pathname}`;

      expect(pageMetadata.alternates).toMatchObject({
        canonical: localizedCanonical,
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

  it("marks the bilingual contact pages as followable but noindex", () => {
    for (const pageMetadata of [contactMetadata, chineseContactMetadata]) {
      expect(pageMetadata).toMatchObject({
        robots: { index: false, follow: true },
      });
    }
  });

  it("marks every fixed bilingual blog page as indexable and followable", () => {
    for (const pageMetadata of [
      blogIndexMetadata,
      blogArchiveMetadata,
      chineseBlogIndexMetadata,
      chineseBlogArchiveMetadata,
    ]) {
      expect(pageMetadata).toMatchObject({
        robots: { index: true, follow: true },
      });
    }
  });

  it("generates paired article metadata from each localized blog post cover", async () => {
    expect(generateBlogStaticParams()).toEqual(
      blogPostSlugs.map((slug) => ({ slug })),
    );
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
        alternates: {
          canonical: `https://stardewvalleyplanner.art/${slug}`,
          languages: createExpectedLanguageAlternates(`/${slug}`),
        },
        openGraph: {
          type: "article",
          images: [
            `https://stardewvalleyplanner.art${englishPost.coverImage.src}`,
          ],
        },
        robots: { index: true, follow: true },
      });

      await expect(
        generateChineseBlogMetadata({ params: Promise.resolve({ slug }) }),
      ).resolves.toMatchObject({
        title: chinesePost.title,
        alternates: {
          canonical: `https://stardewvalleyplanner.art/zh/${slug}`,
          languages: createExpectedLanguageAlternates(`/${slug}`),
        },
        openGraph: {
          type: "article",
          images: [
            `https://stardewvalleyplanner.art${chinesePost.coverImage.src}`,
          ],
        },
        robots: { index: true, follow: true },
      });
    }
  });
});
