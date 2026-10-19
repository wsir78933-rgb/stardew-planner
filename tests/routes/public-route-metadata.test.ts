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
import { metadata as russianPlannerMetadata } from "../../app/ru/page";
import {
  dynamicParams as chineseBlogDynamicParams,
  generateMetadata as generateChineseBlogMetadata,
  generateStaticParams as generateChineseBlogStaticParams,
} from "../../app/zh/[slug]/page";
import { metadata as chineseBlogArchiveMetadata } from "../../app/zh/blog/archive/page";
import { metadata as chineseBlogIndexMetadata } from "../../app/zh/blog/page";
import { metadata as chineseContactMetadata } from "../../app/zh/contact/page";
import { metadata as chinesePlannerMetadata } from "../../app/zh/page";
import { getBlogCopy } from "../../src/blog/blog-copy";
import { blogPostSlugs, getBlogPostBySlug } from "../../src/blog/blog-post-registry";

const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.webp";

function createExpectedLanguageAlternates(pathname: string) {
  const englishUrl = `https://stardewvalleyplanner.art${pathname === "/" ? "" : pathname}`;
  const chineseUrl = `https://stardewvalleyplanner.art/zh${pathname === "/" ? "" : pathname}`;

  return {
    en: englishUrl,
    "zh-CN": chineseUrl,
    "x-default": englishUrl,
  };
}

const homepageLanguageAlternates = {
  ...createExpectedLanguageAlternates("/"),
  ru: "https://stardewvalleyplanner.art/ru",
};

const confirmedRussianHomepageTitle =
  "Планировщик фермы Stardew Valley — бесплатно онлайн";
const confirmedRussianHomepageDescription =
  "Планировщик для Stardew Valley: создавайте планировку фермы онлайн. 8 типов ферм, здания и посевы, смена сезонов, зоны действия и импорт сохранений.";

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
        card: "summary_large_image",
        title: "Stardew Valley Planner – Free Online Farm Layout Tool",
        images: [expectedSocialImageUrl],
      },
    });
  });

  it("publishes four homepage alternates and three alternates for contact", () => {
    expect(plannerMetadata.alternates).toEqual({
      canonical: "https://stardewvalleyplanner.art",
      languages: homepageLanguageAlternates,
    });
    expect(chinesePlannerMetadata.alternates).toEqual({
      canonical: "https://stardewvalleyplanner.art/zh",
      languages: homepageLanguageAlternates,
    });
    expect({
      title: russianPlannerMetadata.title,
      description: russianPlannerMetadata.description,
    }).toEqual({
      title: confirmedRussianHomepageTitle,
      description: confirmedRussianHomepageDescription,
    });
    expect(russianPlannerMetadata.alternates).toEqual({
      canonical: "https://stardewvalleyplanner.art/ru",
      languages: homepageLanguageAlternates,
    });
    expect(russianPlannerMetadata).not.toHaveProperty("keywords");
    expect(contactMetadata.alternates).toEqual({
      canonical: "https://stardewvalleyplanner.art/contact",
      languages: createExpectedLanguageAlternates("/contact"),
    });
    expect(chineseContactMetadata.alternates).toEqual({
      canonical: "https://stardewvalleyplanner.art/zh/contact",
      languages: createExpectedLanguageAlternates("/contact"),
    });
    for (const pageMetadata of [
      plannerMetadata,
      chinesePlannerMetadata,
      russianPlannerMetadata,
      contactMetadata,
      chineseContactMetadata,
    ]) {
      expect(pageMetadata.openGraph).toMatchObject({
        images: [expectedSocialImageUrl],
      });
      expect(pageMetadata.twitter).toMatchObject({
        card: "summary_large_image",
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
        twitter: {
          card: "summary_large_image",
          images: [expectedSocialImageUrl],
        },
      });
    }
  });

  it("gives blog archive pages their own description instead of reusing the index copy", () => {
    const englishCopy = getBlogCopy("en");
    const chineseCopy = getBlogCopy("zh-CN");

    expect(englishCopy.archiveDescription).not.toBe(englishCopy.blogDescription);
    expect(chineseCopy.archiveDescription).not.toBe(chineseCopy.blogDescription);
    expect(blogIndexMetadata.description).toBe(englishCopy.blogDescription);
    expect(blogArchiveMetadata.description).toBe(englishCopy.archiveDescription);
    expect(chineseBlogIndexMetadata.description).toBe(chineseCopy.blogDescription);
    expect(chineseBlogArchiveMetadata.description).toBe(chineseCopy.archiveDescription);
    expect(blogIndexMetadata.alternates?.languages).toEqual(
      createExpectedLanguageAlternates("/blog"),
    );
    expect(blogArchiveMetadata.alternates?.languages).toEqual(
      createExpectedLanguageAlternates("/blog/archive"),
    );
    expect(chineseBlogIndexMetadata.alternates?.languages).toEqual(
      createExpectedLanguageAlternates("/blog"),
    );
    expect(chineseBlogArchiveMetadata.alternates?.languages).toEqual(
      createExpectedLanguageAlternates("/blog/archive"),
    );
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

      const englishArticleMetadata = await generateBlogMetadata({
        params: Promise.resolve({ slug }),
      });
      expect(englishArticleMetadata.alternates?.languages).toEqual(
        createExpectedLanguageAlternates(`/${slug}`),
      );
      expect(englishArticleMetadata).toMatchObject({
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
        twitter: {
          card: "summary_large_image",
          images: [
            `https://stardewvalleyplanner.art${englishPost.coverImage.src}`,
          ],
        },
      });

      const chineseArticleMetadata = await generateChineseBlogMetadata({
        params: Promise.resolve({ slug }),
      });
      expect(chineseArticleMetadata.alternates?.languages).toEqual(
        createExpectedLanguageAlternates(`/${slug}`),
      );
      expect(chineseArticleMetadata).toMatchObject({
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
        twitter: {
          card: "summary_large_image",
          images: [
            `https://stardewvalleyplanner.art${chinesePost.coverImage.src}`,
          ],
        },
      });
    }
  });
});
