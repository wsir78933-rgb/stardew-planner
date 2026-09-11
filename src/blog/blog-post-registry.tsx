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
import { GlasshouseStardewValleyEnglishArticle } from "./articles/glasshouse-stardew-valley.en";
import { GlasshouseStardewValleyChineseArticle } from "./articles/glasshouse-stardew-valley.zh";
import { OakTreeStardewEnglishArticle } from "./articles/oak-tree-stardew.en";
import { OakTreeStardewChineseArticle } from "./articles/oak-tree-stardew.zh";
import { StardewValleyTreesEnglishArticle } from "./articles/stardew-valley-trees.en";
import { StardewValleyTreesChineseArticle } from "./articles/stardew-valley-trees.zh";
import { MapleTreeStardewEnglishArticle } from "./articles/maple-tree-stardew.en";
import { MapleTreeStardewChineseArticle } from "./articles/maple-tree-stardew.zh";
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
      title: "Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades",
      description:
        "Use Robin's Carpenter's Shop for farm buildings, farmhouse upgrades, moves, demolition, and shop supplies, with a placement plan before you order.",
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
      title: "Where Is Robin in Stardew Valley? Hours, Schedule, and Exceptions",
      description:
        "Find Robin at 24 Mountain Road, check Tuesday, Friday, rain, festival, clinic, and construction closures, and plan your Carpenter's Shop trip.",
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
      title: "Stardew Valley NPC List: Villagers, Marriage Candidates, and Services",
      description:
        "Sort the current Stardew Valley NPC list by marriage, giftable, and non-giftable roles, then plan gifts, schedules, and farm services.",
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
      title: "Where Is Stardew Valley Located? Ferngill Republic, Pelican Town, and the Real-World Theory",
      description:
        "Find Stardew Valley on the in-game map: separate Pelican Town, the Farm, and the Ferngill Republic, then test what Harvey's coordinates and Pacific Northwest influences do—and do not—prove.",
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
      title: "Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes",
      description:
        "Meet all 7 Stardew Valley Expanded marriage candidates, check who is available early, unlock Scarlett and Lance, and plan gifts and marriage steps.",
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
      title: "Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails",
      description:
        "Craft Farming 2, 6, or 9 sprinklers, place them for 6am watering, and check pots, Beach Farm sand, greenhouse rain, and island weather.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 14,
      coverImage: {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "Top-down farm illustration of three sprinklers: a 4-tile plus/cross, an 8-tile ring, and a 24-tile square of watered crops.",
      },
      featured: true,
      Content: SprinklerStardewEnglishArticle,
    },
    {
      slug: "glasshouse-stardew-valley",
      title: "Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers",
      description:
        "Repair the Stardew Valley Greenhouse, plan its 10×12 crop bed, save soil with border sprinklers, and place fruit trees without blocking growth.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 11,
      coverImage: {
        src: "/blog/glasshouse-stardew-valley-cover.webp",
        alt: "Original illustration of a glass farm building interior with an empty 10-by-12 crop rectangle and a wood border",
      },
      featured: true,
      Content: GlasshouseStardewValleyEnglishArticle,
    },
    {
      slug: "oak-tree-stardew",
      title: "Stardew Valley Oak Tree: Acorns, Tappers, and Oak Resin",
      description:
        "Identify an oak from an acorn, plant with wild-tree spacing, then tap Oak Resin every 7 nights or chop for wood after you sketch the trunks.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 12,
      coverImage: {
        src: "/blog/oak-tree-stardew-cover.webp",
        alt: "Original illustration of spaced oak trees on a farm road, with a wooden bucket on one trunk and acorns on the soil",
      },
      featured: true,
      Content: OakTreeStardewEnglishArticle,
    },
    {
      slug: "stardew-valley-trees",
      title: "Mark keep, orchard, and clear tiles before you chop Stardew Valley trees",
      description:
        "Outdoor farm only. Mark keep, orchard, and clear tiles, then plant or cut. Fruit trees need a 3×3 until mature; a planner 1×1 icon is not a growth check.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 12,
      coverImage: {
        src: "/blog/stardew-valley-trees-cover.webp",
        alt: "Top-down farm illustration: a keep grove of trees with tapper buckets on the left, a fruit orchard with space between trunks in the middle, and empty cleared dirt on the right.",
      },
      featured: true,
      Content: StardewValleyTreesEnglishArticle,
    },
    {
      slug: "maple-tree-stardew",
      title: "Plant a Maple Tree in Stardew With One-Tile Gaps, Then Tap Maple Syrup",
      description:
        "Match Maple Seed, not leaf shape. Collect seeds, tap Maple Syrup every 9 nights at Foraging 4 or chop. Sketch Maple Tree (Normal); it does not make syrup.",
      topic: "Stardew Valley Guides",
      author: "Stardew Valley Planner Team",
      readTimeMinutes: 14,
      coverImage: {
        src: "/blog/maple-tree-stardew-cover.webp",
        alt: "Spaced maple trees with a wooden bucket on one trunk and winged maple seeds on the soil",
      },
      featured: true,
      Content: MapleTreeStardewEnglishArticle,
    },
  ],
  "zh-CN": [
    {
      slug: "carpenter-stardew",
      title: "星露谷物语木匠商店：罗宾位置、营业时间、建筑与升级",
      description: "了解罗宾木匠商店的营业时间、农场建筑、农舍升级、移动和拆除，并在下单前先规划放置位置。",
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
      title: "罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程",
      description:
        "查找罗宾的 24 Mountain Road 木匠商店，核对周二、周五、雨天、节日、诊所和农场施工例外。",
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
      title: "星露谷 NPC 名单：可结婚角色、可送礼村民与服务",
      description:
        "按可结婚、可送礼和不可送礼分类整理星露谷 NPC，并核对送礼、好感度、商店服务与农场规划关系。",
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
      title: "星露谷物语位于哪里？芬吉尔共和国、鹈鹕镇与现实地点",
      description:
        "理清星露谷、鹈鹕镇、农场和芬吉尔共和国的关系，再看哈维坐标与太平洋西北地区影响能否证明现实地点。",
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
      title: "星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物",
      description:
        "整理星露谷 SVE 当前 7 位可结婚角色，核对斯嘉丽与兰斯的出现条件、入门最爱礼物和原版结婚流程。",
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
      title: "星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地",
      description:
        "说明三种官方洒水器的早晨浇水格数、耕种解锁，以及花盆、沙地等浇不到的情况。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 13,
      coverImage: {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "俯视农田插画，三台洒水器并排：左侧洒水器浇上下左右 4 格十字，中间优质洒水器浇周围 8 格，右侧铱制洒水器浇 24 格。",
      },
      featured: true,
      Content: SprinklerStardewChineseArticle,
    },
    {
      slug: "glasshouse-stardew-valley",
      title: "星露谷物语温室布局：120格耕地与洒水器摆放指南",
      description:
        "了解温室解锁、10×12耕地、洒水器占用和果树生长限制，再用温室地图检查布局后下种。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 11,
      coverImage: {
        src: "/blog/glasshouse-stardew-valley-cover.webp",
        alt: "玻璃墙温室内空耕地与一圈木框的原创插画",
      },
      featured: true,
      Content: GlasshouseStardewValleyChineseArticle,
    },
    {
      slug: "oak-tree-stardew",
      title: "星露谷物语橡树：橡子种植、间距与树脂采集",
      description:
        "认清橡树和果树，按野树间距种下橡子，成熟后用树液采集器每 7 天收橡树树脂，或砍树取木材。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 12,
      coverImage: {
        src: "/blog/oak-tree-stardew-cover.webp",
        alt: "农场土路上间隔种植的橡树原创插画，一棵树干挂着木桶，地面有橡子",
      },
      featured: true,
      Content: OakTreeStardewChineseArticle,
    },
    {
      slug: "stardew-valley-trees",
      title: "星露谷种树：先分普通树和果树，再在农场图上留间隔",
      description:
        "温室里的果树不是这篇的任务。果树要未开垦的 3×3；打开「树木不可生长区」。规划器能摆外观，没有果树 3×3 检查。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 13,
      coverImage: {
        src: "/blog/stardew-valley-trees-cover.webp",
        alt: "俯视农场插画：左侧是挂树液桶的保留树丛，中间是树干留空的果树区，右侧是已清空的空地。",
      },
      featured: true,
      Content: StardewValleyTreesChineseArticle,
    },
    {
      slug: "maple-tree-stardew",
      title: "星露谷物语枫树：别靠树冠认，采集器 9 天出枫糖浆",
      description:
        "先确认是枫树种子，皮埃尔不卖。避开成年树邻格养成，采集 4 级挂采集器，普通 9 天出枫糖浆。规划器搜 Maple Tree。",
      topic: "星露谷物语指南",
      author: "星露谷规划器团队",
      readTimeMinutes: 14,
      coverImage: {
        src: "/blog/maple-tree-stardew-cover.webp",
        alt: "近处枫树树干挂着木桶，地面散落带翅种子，土路分叉通向农舍与风车的水彩插画",
      },
      featured: true,
      Content: MapleTreeStardewChineseArticle,
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
