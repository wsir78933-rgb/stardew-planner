import type { ReactNode } from "react";
import { publicLocales, type PublicLocale } from "../i18n/public-locale";
import { CarpenterStardewEnglishArticle } from "./articles/carpenter-stardew.en";
import { CarpenterStardewChineseArticle } from "./articles/carpenter-stardew.zh";
import { WhereIsRobinEnglishArticle } from "./articles/where-is-robin-stardew-valley.en";
import { WhereIsRobinChineseArticle } from "./articles/where-is-robin-stardew-valley.zh";
import {
  blogPostCanonicalPaths,
  blogPostSlugs,
  isBlogPostSlug,
  type BlogPostSlug,
} from "./blog-post-identities";

export {
  blogPostCanonicalPaths,
  blogPostSlugs,
  isBlogPostSlug,
  type BlogPostSlug,
};

export type BlogPostMeta = Readonly<{
  slug: BlogPostSlug;
  title: string;
  description: string;
  topic: string;
  author: string;
  readTimeMinutes: number;
  coverImage: Readonly<{
    src: string;
    alt: string;
  }>;
  featured: boolean;
}>;

export type LocalizedBlogPost = BlogPostMeta &
  Readonly<{
    Content: () => ReactNode;
  }>;

type LocalizedBlogPostRegistry = Readonly<
  Record<PublicLocale, readonly LocalizedBlogPost[]>
>;

const blogPostsByLocale: LocalizedBlogPostRegistry = {
  en: [
    {
      slug: "carpenter-stardew",
      title: "Carpenter in Stardew Valley: Robin's Hours and Services",
      description:
        "Find Robin's shop, check its real service hours, and use a practical checklist before placing or moving farm buildings.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 8,
      coverImage: {
        src: "/blog/carpenter-stardew-cover.png",
        alt: "Illustration of a timber workshop beneath pine-covered mountains",
      },
      featured: true,
      Content: CarpenterStardewEnglishArticle,
    },
    {
      slug: "where-is-robin-stardew-valley",
      title: "Where Is Robin in Stardew Valley? Location and Hours",
      description:
        "Find Robin at 24 Mountain Road, check her normal hours and special schedules, and know when the Carpenter's Shop counter is open.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 7,
      coverImage: {
        src: "/blog/where-is-robin-stardew-valley-cover.png",
        alt: "Illustration of a path leading from a farm toward a mountain workshop",
      },
      featured: true,
      Content: WhereIsRobinEnglishArticle,
    },
  ],
  "zh-CN": [
    {
      slug: "carpenter-stardew",
      title: "星露谷木匠罗宾：营业时间、建筑服务与下单规划",
      description: "找到罗宾的木匠商店，核对真实营业时间，并在放置或搬动农场建筑前完成占地规划。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 8,
      coverImage: {
        src: "/blog/carpenter-stardew-cover.png",
        alt: "松林山脚下木工工坊的原创插画",
      },
      featured: true,
      Content: CarpenterStardewChineseArticle,
    },
    {
      slug: "where-is-robin-stardew-valley",
      title: "罗宾在星露谷物语的哪里？位置、营业时间与特殊行程",
      description: "前往山区的 24 Mountain Road 找罗宾，并确认木匠商店在普通日期和特殊行程中的营业状态。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 7,
      coverImage: {
        src: "/blog/where-is-robin-stardew-valley-cover.png",
        alt: "从农场通往山间工坊的小路原创插画",
      },
      featured: true,
      Content: WhereIsRobinChineseArticle,
    },
  ],
};

function describeReceivedValue(value: unknown): string {
  return JSON.stringify(value) ?? String(value);
}

function assertNonEmptyString(
  slug: string,
  fieldName: string,
  value: unknown,
): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Invalid ${fieldName} for blog post ${slug}. Received: ${describeReceivedValue(value)}.`,
    );
  }
}

function assertMeaningfulCoverAlt(slug: string, value: unknown): asserts value is string {
  assertNonEmptyString(slug, "coverImage.alt", value);

  if (value.trim().length < 8) {
    throw new Error(
      `Invalid coverImage.alt for blog post ${slug}. Received: ${describeReceivedValue(value)}.`,
    );
  }
}

function assertValidLocalizedBlogPost(post: unknown, locale: PublicLocale): void {
  if (typeof post !== "object" || post === null || Array.isArray(post)) {
    throw new Error(
      `Invalid blog post for locale ${locale}. Received: ${describeReceivedValue(post)}.`,
    );
  }

  const candidatePost = post as Record<string, unknown>;
  const slug = candidatePost.slug;

  if (!isBlogPostSlug(slug)) {
    throw new Error(`Invalid blog post slug. Received: ${describeReceivedValue(slug)}.`);
  }

  assertNonEmptyString(slug, "title", candidatePost.title);
  assertNonEmptyString(slug, "description", candidatePost.description);
  assertNonEmptyString(slug, "topic", candidatePost.topic);
  assertNonEmptyString(slug, "author", candidatePost.author);

  if (
    typeof candidatePost.readTimeMinutes !== "number" ||
    !Number.isInteger(candidatePost.readTimeMinutes) ||
    candidatePost.readTimeMinutes <= 0
  ) {
    throw new Error(
      `Invalid readTimeMinutes for blog post ${slug}. Received: ${describeReceivedValue(candidatePost.readTimeMinutes)}.`,
    );
  }

  if (
    typeof candidatePost.coverImage !== "object" ||
    candidatePost.coverImage === null ||
    Array.isArray(candidatePost.coverImage)
  ) {
    throw new Error(
      `Invalid coverImage for blog post ${slug}. Received: ${describeReceivedValue(candidatePost.coverImage)}.`,
    );
  }

  const coverImage = candidatePost.coverImage as Record<string, unknown>;
  assertNonEmptyString(slug, "coverImage.src", coverImage.src);
  assertMeaningfulCoverAlt(slug, coverImage.alt);

  if (typeof candidatePost.featured !== "boolean") {
    throw new Error(
      `Invalid featured for blog post ${slug}. Received: ${describeReceivedValue(candidatePost.featured)}.`,
    );
  }

  if (typeof candidatePost.Content !== "function") {
    throw new Error(
      `Invalid Content for blog post ${slug}. Received: ${describeReceivedValue(candidatePost.Content)}.`,
    );
  }
}

export function validateBlogPostRegistry(posts: unknown): void {
  if (typeof posts !== "object" || posts === null || Array.isArray(posts)) {
    throw new Error(`Invalid blog post registry. Received: ${describeReceivedValue(posts)}.`);
  }

  const registryCandidate = posts as Record<string, unknown>;

  for (const locale of Object.keys(registryCandidate)) {
    if (!publicLocales.includes(locale as PublicLocale)) {
      throw new Error(`Unsupported blog post locale. Received: ${describeReceivedValue(locale)}.`);
    }
  }

  for (const locale of publicLocales) {
    const localizedPosts = registryCandidate[locale];

    if (!Array.isArray(localizedPosts)) {
      throw new Error(
        `Missing localized blog posts for ${locale}. Received: ${describeReceivedValue(localizedPosts)}.`,
      );
    }

    const seenSlugs = new Set<BlogPostSlug>();
    for (const [index, post] of localizedPosts.entries()) {
      assertValidLocalizedBlogPost(post, locale);
      const slug = (post as BlogPostMeta).slug;
      const expectedSlug = blogPostSlugs[index];

      if (slug !== expectedSlug) {
        throw new Error(
          `Invalid blog post order for ${locale}. Expected: ${expectedSlug}. Received: ${slug}.`,
        );
      }

      if (seenSlugs.has(slug)) {
        throw new Error(`Duplicate blog post slug for ${locale}. Received: ${slug}.`);
      }

      seenSlugs.add(slug);
    }

    for (const slug of blogPostSlugs) {
      if (!seenSlugs.has(slug)) {
        throw new Error(`Missing blog post for ${locale}. Received: ${slug}.`);
      }
    }
  }
}

function assertPublicLocale(locale: PublicLocale): void {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported public locale. Received: ${describeReceivedValue(locale)}.`);
  }
}

validateBlogPostRegistry(blogPostsByLocale);

export function getAllBlogPosts(locale: PublicLocale): readonly LocalizedBlogPost[] {
  assertPublicLocale(locale);
  return blogPostsByLocale[locale];
}

export function getAllBlogPostMeta(locale: PublicLocale): readonly BlogPostMeta[] {
  return getAllBlogPosts(locale).map(({ Content: _content, coverImage, ...postMeta }) => ({
    ...postMeta,
    coverImage: { ...coverImage },
  }));
}

export function getBlogPostBySlug(
  locale: PublicLocale,
  slug: BlogPostSlug,
): LocalizedBlogPost | undefined {
  return getAllBlogPosts(locale).find((post) => post.slug === slug);
}
