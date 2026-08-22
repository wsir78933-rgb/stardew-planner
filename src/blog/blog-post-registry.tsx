import type { ReactNode } from "react";
import { publicLocales, type PublicLocale } from "../i18n/public-locale";
import { CarpenterStardewEnglishArticle } from "./articles/carpenter-stardew.en";
import { CarpenterStardewChineseArticle } from "./articles/carpenter-stardew.zh";
import { WhereIsRobinEnglishArticle } from "./articles/where-is-robin-stardew-valley.en";
import { WhereIsRobinChineseArticle } from "./articles/where-is-robin-stardew-valley.zh";
import { StardewValleyNpcEnglishArticle } from "./articles/stardew-valley-npc.en";
import { StardewValleyNpcChineseArticle } from "./articles/stardew-valley-npc.zh";
import { StardewValleyTownMapEnglishArticle } from "./articles/stardew-valley-town-map.en";
import { StardewValleyTownMapChineseArticle } from "./articles/stardew-valley-town-map.zh";
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
      title: "Carpenter Stardew: Which Robin Service Do You Need Today?",
      description:
        "Match your task—buy, build, upgrade, or move—to the menu and verify the shop can serve you.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 8,
      coverImage: {
        src: "/blog/carpenter-stardew-cover.webp",
        alt: "Illustration of Robin's mountain workshop with a farm-building plan",
      },
      featured: true,
      Content: CarpenterStardewEnglishArticle,
    },
    {
      slug: "where-is-robin-stardew-valley",
      title: "Robin's Shop Is Empty? Find Her in Stardew Valley Today",
      description:
        "Learn why Robin leaves the counter, where she goes on Tuesday and Friday, and when rain or farm construction changes the answer today.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 8,
      coverImage: {
        src: "/blog/where-is-robin-stardew-valley-cover.webp",
        alt: "Mountain path leading toward Robin's carpenter workshop",
      },
      featured: true,
      Content: WhereIsRobinEnglishArticle,
    },
    {
      slug: "stardew-valley-npc",
      title: "Stardew Valley NPC Guide: Gifts, Marriage, and Services",
      description:
        "Compare current friendship groups, gift rules, marriage candidates, and the NPC services that shape your building, animal, and tool plans.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 10,
      coverImage: {
        src: "/blog/stardew-valley-npc-cover.webp",
        alt: "Original illustration of Stardew Valley townspeople meeting in a mountain village square",
      },
      featured: true,
      Content: StardewValleyNpcEnglishArticle,
    },
    {
      slug: "stardew-valley-town-map",
      title: "Stardew Valley Town Map: Pelican Town Landmarks & Routes",
      description:
        "Use this Stardew Valley town map guide to find Pelican Town landmarks, exits, and a route back to your farm before you plan its layout.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 6,
      coverImage: {
        src: "/blog/stardew-valley-town-map-cover.webp",
        alt: "Original illustrated map of a riverside town with roads, bridges, and landmarks",
      },
      featured: true,
      Content: StardewValleyTownMapEnglishArticle,
    },
  ],
  "zh-CN": [
    {
      slug: "carpenter-stardew",
      title: "星露谷木匠：今天该选罗宾的哪项服务？",
      description: "根据购买、建造、升级或移动的实际需求，选择对应菜单并确认罗宾木匠商店能接单。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 8,
      coverImage: {
        src: "/blog/carpenter-stardew-cover.webp",
        alt: "罗宾山间木匠工坊与农场建筑规划示意插画",
      },
      featured: true,
      Content: CarpenterStardewChineseArticle,
    },
    {
      slug: "where-is-robin-stardew-valley",
      title: "罗宾的商店没人？今天去哪里找她",
      description:
        "了解罗宾为什么会离开柜台、周二和周五会去哪里，以及下雨或农场施工会如何改变她当天的行程。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 8,
      coverImage: {
        src: "/blog/where-is-robin-stardew-valley-cover.webp",
        alt: "通往罗宾山间木匠工坊的暖色山路插画",
      },
      featured: true,
      Content: WhereIsRobinChineseArticle,
    },
    {
      slug: "stardew-valley-npc",
      title: "星露谷 NPC 指南：礼物、婚姻与服务",
      description:
        "比较当前好感度分类、送礼规则、可结婚候选，以及会影响建筑、动物和工具规划的 NPC 服务。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 10,
      coverImage: {
        src: "/blog/stardew-valley-npc-cover.webp",
        alt: "星露谷山间小镇中不同村民相遇交谈的原创插画",
      },
      featured: true,
      Content: StardewValleyNpcChineseArticle,
    },
    {
      slug: "stardew-valley-town-map",
      title: "星露谷物语小镇地图：鹈鹕镇地点与路线",
      description:
        "用这份鹈鹕镇地点与出口指南，先找到商店、海滩、深山和回农场的路，再开始安排你的农场布局。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 6,
      coverImage: {
        src: "/blog/stardew-valley-town-map-cover.webp",
        alt: "原创河畔小镇地图插画，标出道路、桥梁与主要地标",
      },
      featured: true,
      Content: StardewValleyTownMapChineseArticle,
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
