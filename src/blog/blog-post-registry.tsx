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
import { WhereIsStardewValleyLocatedEnglishArticle } from "./articles/where-is-stardew-valley-located.en";
import { WhereIsStardewValleyLocatedChineseArticle } from "./articles/where-is-stardew-valley-located.zh";
import { StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle } from "./articles/stardew-valley-expanded-bachelors-and-bachelorettes.en";
import { StardewValleyExpandedBachelorsAndBachelorettesChineseArticle } from "./articles/stardew-valley-expanded-bachelors-and-bachelorettes.zh";
import { SprinklerStardewEnglishArticle } from "./articles/sprinkler-stardew.en";
import { SprinklerStardewChineseArticle } from "./articles/sprinkler-stardew.zh";
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
    {
      slug: "where-is-stardew-valley-located",
      title: "Where Is Stardew Valley Located in the Game’s World?",
      description:
        "Understand the game’s fictional geography, the role of the Gem Sea and Gotoro Empire, and the clear limits of real-world comparisons.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 11,
      coverImage: {
        src: "/blog/where-is-stardew-valley-located-cover.webp",
        alt: "Original illustration of a quiet rural valley with a small town, mountains, and a farm road",
      },
      featured: true,
      Content: WhereIsStardewValleyLocatedEnglishArticle,
    },
    {
      slug: "stardew-valley-expanded-bachelors-and-bachelorettes",
      title: "7 Stardew Valley Expanded Bachelors and Bachelorettes",
      description:
        "See all 7 current SVE bachelors and bachelorettes, who is event-gated, starter loved gifts, and how to plan the farm after you choose.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 12,
      coverImage: {
        src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
        alt: "Original illustration of seven villagers at a vineyard and town square, no copyrighted sprites",
      },
      featured: true,
      Content: StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle,
    },
    {
      slug: "sprinkler-stardew",
      title: "Sprinkler Stardew: 4, 8, or 24 Tiles Before You Plant",
      description:
        "Match each sprinkler to 4, 8, or 24 tiles, then check radius overlay on your farm map. Pressure nozzles and enrichers cannot share one sprinkler.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 10,
      coverImage: {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "Original illustration of a farm field with three empty sprinkler footprints: a four-tile plus, an eight-tile ring, and a twenty-four-tile square",
      },
      featured: true,
      Content: SprinklerStardewEnglishArticle,
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
    {
      slug: "where-is-stardew-valley-located",
      title: "星露谷在游戏世界中位于哪里？",
      description:
        "了解游戏中的虚构地理、宝石海与戈特洛帝国的关系，以及将游戏地点与现实世界进行类比时的明确边界。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 11,
      coverImage: {
        src: "/blog/where-is-stardew-valley-located-cover.webp",
        alt: "原创乡村山谷插画，可见小镇、远山与通往农场的道路",
      },
      featured: true,
      Content: WhereIsStardewValleyLocatedChineseArticle,
    },
    {
      slug: "stardew-valley-expanded-bachelors-and-bachelorettes",
      title:
        "当前星露谷SVE 可结婚角色完整名单是7人：克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅、维克多",
      description:
        "先对照当前7位星露谷SVE可结婚角色名单，分清4位女性和3位男性，再核对克莱尔、斯嘉丽、兰斯的出现闸门和入门最爱礼物。选定对象后打开星露谷农场规划器，给农舍、配偶房和出货箱道路留空；规划器只做布局，不追踪红心或NPC行程。来源核对于2026年8月25日SVE Wiki村民页。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 12,
      coverImage: {
        src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
        alt: "葡萄园与小镇广场上七位村民相聚的原创插画，未使用受版权保护的游戏立绘",
      },
      featured: true,
      Content: StardewValleyExpandedBachelorsAndBachelorettesChineseArticle,
    },
    {
      slug: "sprinkler-stardew",
      title: "星露谷洒水器布局先分清4/8/24格",
      description:
        "覆盖落到池塘、通道或边界时，名义覆盖不会都变成作物格。规划器可叠加洒水器与稻草人范围，导出截图后再照着进游戏摆放。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 10,
      coverImage: {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "俯视农田网格中对比优质与铱制洒水器覆盖范围的星露谷洒水器布局示意",
      },
      featured: true,
      Content: SprinklerStardewChineseArticle,
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
