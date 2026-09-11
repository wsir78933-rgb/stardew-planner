import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  blogPostSlugs,
  getAllBlogPostMeta,
  getAllBlogPosts,
  getBlogPostBySlug,
  isBlogPostSlug,
  validateBlogPostRegistry,
  type LocalizedBlogPost,
} from "../../src/blog/blog-post-registry";

const expectedSlugs = [
  "carpenter-stardew",
  "where-is-robin-stardew-valley",
  "stardew-valley-npc",
  "stardew-valley-town-map",
  "where-is-stardew-valley-located",
  "stardew-valley-expanded-bachelors-and-bachelorettes",
  "sprinkler-stardew",
  "glasshouse-stardew-valley",
  "oak-tree-stardew",
  "stardew-valley-trees",
  "maple-tree-stardew",
] as const;

function createLocalizedPost(
  slug: (typeof expectedSlugs)[number],
  overrides: Partial<LocalizedBlogPost> = {},
): LocalizedBlogPost {
  return {
    slug,
    title: `Title for ${slug}`,
    description: `Description for ${slug}`,
    topic: "Stardew Valley Guides",
    author: "Stardew Valley Planner Team",
    readTimeMinutes: 5,
    coverImage: {
      src: "/social-images/stardew-valley-farm-planner.png",
      alt: `Illustration for ${slug}`,
    },
    featured: true,
    Content: () => null,
    ...overrides,
  };
}

function createCompleteRegistry(): Readonly<
  Record<"en" | "zh-CN", readonly LocalizedBlogPost[]>
> {
  return {
    en: expectedSlugs.map((slug) => createLocalizedPost(slug)),
    "zh-CN": expectedSlugs.map((slug) =>
      createLocalizedPost(slug, { author: "星露谷规划器团队" }),
    ),
  };
}

it("keeps the eleven canonical blog identities in publishing order", () => {
  expect(blogPostSlugs).toEqual(expectedSlugs);
  expect(isBlogPostSlug("carpenter-stardew")).toBe(true);
  expect(isBlogPostSlug("where-is-robin-stardew-valley")).toBe(true);
  expect(isBlogPostSlug("missing-post")).toBe(false);
});

it("publishes only the twenty-two localized root-level canonical article paths", () => {
  expect(blogPostCanonicalPaths).toEqual([
    "/carpenter-stardew/",
    "/where-is-robin-stardew-valley/",
    "/stardew-valley-npc/",
    "/stardew-valley-town-map/",
    "/where-is-stardew-valley-located/",
    "/stardew-valley-expanded-bachelors-and-bachelorettes/",
    "/sprinkler-stardew/",
    "/glasshouse-stardew-valley/",
    "/oak-tree-stardew/",
    "/stardew-valley-trees/",
    "/maple-tree-stardew/",
    "/zh/carpenter-stardew/",
    "/zh/where-is-robin-stardew-valley/",
    "/zh/stardew-valley-npc/",
    "/zh/stardew-valley-town-map/",
    "/zh/where-is-stardew-valley-located/",
    "/zh/stardew-valley-expanded-bachelors-and-bachelorettes/",
    "/zh/sprinkler-stardew/",
    "/zh/glasshouse-stardew-valley/",
    "/zh/oak-tree-stardew/",
    "/zh/stardew-valley-trees/",
    "/zh/maple-tree-stardew/",
  ]);
});

it("returns paired English and Chinese post metadata in canonical order", () => {
  const englishPosts = getAllBlogPosts("en");
  const chinesePosts = getAllBlogPosts("zh-CN");

  expect(englishPosts.map((post) => post.slug)).toEqual(expectedSlugs);
  expect(chinesePosts.map((post) => post.slug)).toEqual(expectedSlugs);
  expect(englishPosts.every((post) => post.author === "Stardew Valley Planner Team")).toBe(
    true,
  );
  expect(chinesePosts.every((post) => post.author === "星露谷规划器团队")).toBe(true);
  expect(englishPosts.every((post) => post.featured)).toBe(true);
  expect(chinesePosts.every((post) => post.featured)).toBe(true);
  expect(getBlogPostBySlug("en", "carpenter-stardew")?.slug).toBe(
    "carpenter-stardew",
  );
  expect(englishPosts[0]).toMatchObject({
    title: "Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades",
    description:
      "Use Robin's Carpenter's Shop for farm buildings, farmhouse upgrades, moves, demolition, and shop supplies, with a placement plan before you order.",
  });
  expect(chinesePosts[0]).toMatchObject({
    title: "星露谷物语木匠商店：罗宾位置、营业时间、建筑与升级",
    description:
      "了解罗宾木匠商店的营业时间、农场建筑、农舍升级、移动和拆除，并在下单前先规划放置位置。",
  });
  expect(englishPosts[1]).toMatchObject({
    title: "Where Is Robin in Stardew Valley? Hours, Schedule, and Exceptions",
    description:
      "Find Robin at 24 Mountain Road, check Tuesday, Friday, rain, festival, clinic, and construction closures, and plan your Carpenter's Shop trip.",
  });
  expect(chinesePosts[1]).toMatchObject({
    title: "罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程",
    description:
      "查找罗宾的 24 Mountain Road 木匠商店，核对周二、周五、雨天、节日、诊所和农场施工例外。",
  });
  expect(englishPosts[2]).toMatchObject({
    title: "Stardew Valley NPC List: Villagers, Marriage Candidates, and Services",
    description:
      "Sort the current Stardew Valley NPC list by marriage, giftable, and non-giftable roles, then plan gifts, schedules, and farm services.",
  });
  expect(chinesePosts[2]).toMatchObject({
    title: "星露谷 NPC 名单：可结婚角色、可送礼村民与服务",
    description:
      "按可结婚、可送礼和不可送礼分类整理星露谷 NPC，并核对送礼、好感度、商店服务与农场规划关系。",
  });
  expect(englishPosts[3]).toMatchObject({
    title: "Stardew Valley Town Map: Pelican Town Landmarks & Routes",
    description:
      "Use this Stardew Valley town map guide to find Pelican Town landmarks, exits, and a route back to your farm before you plan its layout.",
  });
  expect(chinesePosts[3]).toMatchObject({
    title: "星露谷物语小镇地图：鹈鹕镇地点与路线",
    description:
      "用这份鹈鹕镇地点与出口指南，先找到商店、海滩、深山和回农场的路，再开始安排你的农场布局。",
  });
  expect(englishPosts[4]).toMatchObject({
    title: "Where Is Stardew Valley Located? Ferngill Republic, Pelican Town, and the Real-World Theory",
    description:
      "Find Stardew Valley on the in-game map: separate Pelican Town, the Farm, and the Ferngill Republic, then test what Harvey's coordinates and Pacific Northwest influences do—and do not—prove.",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/where-is-stardew-valley-located-cover.webp",
      alt: "Original illustration of a quiet rural valley with a small town, mountains, and a farm road",
    },
  });
  expect(chinesePosts[4]).toMatchObject({
    title: "星露谷物语位于哪里？芬吉尔共和国、鹈鹕镇与现实地点",
    description:
      "理清星露谷、鹈鹕镇、农场和芬吉尔共和国的关系，再看哈维坐标与太平洋西北地区影响能否证明现实地点。",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/where-is-stardew-valley-located-cover.webp",
      alt: "原创乡村山谷插画，可见小镇、远山与通往农场的道路",
    },
  });
  expect(englishPosts[5]).toMatchObject({
    title: "Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes",
    description:
      "Meet all 7 Stardew Valley Expanded marriage candidates, check who is available early, unlock Scarlett and Lance, and plan gifts and marriage steps.",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      alt: "Original illustration of seven villagers at a vineyard and town square, no copyrighted sprites",
    },
  });
  expect(chinesePosts[5]).toMatchObject({
    title: "星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物",
    description:
      "整理星露谷 SVE 当前 7 位可结婚角色，核对斯嘉丽与兰斯的出现条件、入门最爱礼物和原版结婚流程。",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      alt: "葡萄园与小镇广场上七位村民相聚的原创插画，未使用受版权保护的游戏立绘",
    },
  });
  expect(englishPosts[6]).toMatchObject({
    title:
      "Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails",
    description:
      "Craft Farming 2, 6, or 9 sprinklers, place them for 6am watering, and check pots, Beach Farm sand, greenhouse rain, and island weather.",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "Top-down farm illustration of three sprinklers: a 4-tile plus/cross, an 8-tile ring, and a 24-tile square of watered crops.",
    },
  });
  expect(chinesePosts[6]).toMatchObject({
    title: "星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地",
    description:
      "说明三种官方洒水器的早晨浇水格数、耕种解锁，以及花盆、沙地等浇不到的情况。",
    readTimeMinutes: 13,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "俯视农田插画，三台洒水器并排：左侧洒水器浇上下左右 4 格十字，中间优质洒水器浇周围 8 格，右侧铱制洒水器浇 24 格。",
    },
  });
  expect(englishPosts[7]).toMatchObject({
    title: "Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers",
    description:
      "Repair the Stardew Valley Greenhouse, plan its 10×12 crop bed, save soil with border sprinklers, and place fruit trees without blocking growth.",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/glasshouse-stardew-valley-cover.webp",
      alt: "Original illustration of a glass farm building interior with an empty 10-by-12 crop rectangle and a wood border",
    },
  });
  expect(chinesePosts[7]).toMatchObject({
    title: "星露谷物语温室布局：120格耕地与洒水器摆放指南",
    description:
      "了解温室解锁、10×12耕地、洒水器占用和果树生长限制，再用温室地图检查布局后下种。",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/glasshouse-stardew-valley-cover.webp",
      alt: "玻璃墙温室内空耕地与一圈木框的原创插画",
    },
  });
  expect(englishPosts[8]).toMatchObject({
    title: "Stardew Valley Oak Tree: Acorns, Tappers, and Oak Resin",
    description:
      "Identify an oak from an acorn, plant with wild-tree spacing, then tap Oak Resin every 7 nights or chop for wood after you sketch the trunks.",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/oak-tree-stardew-cover.webp",
      alt: "Original illustration of spaced oak trees on a farm road, with a wooden bucket on one trunk and acorns on the soil",
    },
  });
  expect(chinesePosts[8]).toMatchObject({
    title: "星露谷物语橡树：橡子种植、间距与树脂采集",
    description:
      "认清橡树和果树，按野树间距种下橡子，成熟后用树液采集器每 7 天收橡树树脂，或砍树取木材。",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/oak-tree-stardew-cover.webp",
      alt: "农场土路上间隔种植的橡树原创插画，一棵树干挂着木桶，地面有橡子",
    },
  });
  expect(englishPosts[9]).toMatchObject({
    title: "Mark keep, orchard, and clear tiles before you chop Stardew Valley trees",
    description:
      "Outdoor farm only. Mark keep, orchard, and clear tiles, then plant or cut. Fruit trees need a 3×3 until mature; a planner 1×1 icon is not a growth check.",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-trees-cover.webp",
      alt: "Top-down farm illustration: a keep grove of trees with tapper buckets on the left, a fruit orchard with space between trunks in the middle, and empty cleared dirt on the right.",
    },
  });
  expect(chinesePosts[9]).toMatchObject({
    title: "星露谷种树：先分普通树和果树，再在农场图上留间隔",
    description:
      "温室里的果树不是这篇的任务。果树要未开垦的 3×3；打开「树木不可生长区」。规划器能摆外观，没有果树 3×3 检查。",
    readTimeMinutes: 13,
    coverImage: {
      src: "/blog/stardew-valley-trees-cover.webp",
      alt: "俯视农场插画：左侧是挂树液桶的保留树丛，中间是树干留空的果树区，右侧是已清空的空地。",
    },
  });
  expect(englishPosts[10]).toMatchObject({
    title: "Plant a Maple Tree in Stardew With One-Tile Gaps, Then Tap Maple Syrup",
    description:
      "Match Maple Seed, not leaf shape. Collect seeds, tap Maple Syrup every 9 nights at Foraging 4 or chop. Sketch Maple Tree (Normal); it does not make syrup.",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/maple-tree-stardew-cover.webp",
      alt: "Spaced maple trees with a wooden bucket on one trunk and winged maple seeds on the soil",
    },
  });
  expect(chinesePosts[10]).toMatchObject({
    title: "星露谷物语枫树：别靠树冠认，采集器 9 天出枫糖浆",
    description:
      "先确认是枫树种子，皮埃尔不卖。避开成年树邻格养成，采集 4 级挂采集器，普通 9 天出枫糖浆。规划器搜 Maple Tree。",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/maple-tree-stardew-cover.webp",
      alt: "近处枫树树干挂着木桶，地面散落带翅种子，土路分叉通向农舍与风车的水彩插画",
    },
  });
  expect(getBlogPostBySlug("zh-CN", "missing-post" as never)).toBeUndefined();
});

it("binds every localized post to its own original blog cover", () => {
  const expectedCoverPaths = {
    "carpenter-stardew": "/blog/carpenter-stardew-cover.webp",
    "where-is-robin-stardew-valley": "/blog/where-is-robin-stardew-valley-cover.webp",
    "stardew-valley-npc": "/blog/stardew-valley-npc-cover.webp",
    "stardew-valley-town-map": "/blog/stardew-valley-town-map-cover.webp",
    "where-is-stardew-valley-located":
      "/blog/where-is-stardew-valley-located-cover.webp",
    "stardew-valley-expanded-bachelors-and-bachelorettes":
      "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
    "sprinkler-stardew": "/blog/sprinkler-stardew-cover.webp",
    "glasshouse-stardew-valley": "/blog/glasshouse-stardew-valley-cover.webp",
    "oak-tree-stardew": "/blog/oak-tree-stardew-cover.webp",
    "stardew-valley-trees": "/blog/stardew-valley-trees-cover.webp",
    "maple-tree-stardew": "/blog/maple-tree-stardew-cover.webp",
  } as const;

  for (const locale of ["en", "zh-CN"] as const) {
    for (const post of getAllBlogPosts(locale)) {
      expect(post.coverImage.src).toBe(expectedCoverPaths[post.slug]);
      expect(post.coverImage.src).not.toBe("/social-images/stardew-valley-farm-planner.png");
    }
  }
});

it("projects fresh client-safe metadata without article Content functions", () => {
  const firstProjection = getAllBlogPostMeta("en");
  const secondProjection = getAllBlogPostMeta("en");

  expect(firstProjection).not.toBe(secondProjection);
  expect(firstProjection[0]).not.toBe(secondProjection[0]);
  expect(firstProjection[0]).not.toHaveProperty("Content");
  expect(firstProjection.map((post) => post.slug)).toEqual(expectedSlugs);
});

it("accepts a registry with complete, meaningful localized posts", () => {
  expect(() => validateBlogPostRegistry(createCompleteRegistry())).not.toThrow();
});

it.each([
  ["title", { title: "" }],
  ["description", { description: "" }],
  ["topic", { topic: "" }],
  ["author", { author: "" }],
  ["cover image source", { coverImage: { src: "", alt: "A useful illustration" } }],
] as const)("rejects a blank required %s and names the post slug", (_field, overrides) => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", overrides);

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("carpenter-stardew");
});

it("rejects a non-positive read time with the rejected field value", () => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", {
    readTimeMinutes: 0,
  });

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("0");
});

it("rejects a fractional read time with the rejected field value", () => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", {
    readTimeMinutes: 2.5,
  });

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("2.5");
});

it("rejects a non-meaningful cover alt string with the rejected field value", () => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", {
    coverImage: {
      src: "/social-images/stardew-valley-farm-planner.png",
      alt: "Image",
    },
  });

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("Image");
});

it("rejects a registry missing a localized post and names its slug", () => {
  const registry = createCompleteRegistry();

  expect(() =>
    validateBlogPostRegistry({ ...registry, "zh-CN": [registry["zh-CN"][0]] }),
  ).toThrow("where-is-robin-stardew-valley");
});

it("rejects duplicate localized slugs and names the duplicate", () => {
  const registry = createCompleteRegistry();
  const duplicatePost = createLocalizedPost("carpenter-stardew");

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [registry.en[0], duplicatePost] }),
  ).toThrow("carpenter-stardew");
});

it("rejects localized posts that reverse canonical publishing order", () => {
  const registry = createCompleteRegistry();

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [...registry.en].reverse() }),
  ).toThrow(
    "Expected: carpenter-stardew. Received: maple-tree-stardew.",
  );
});

it("rejects unsupported locale entries and names the rejected locale", () => {
  const registry = { ...createCompleteRegistry(), fr: [] };

  expect(() => validateBlogPostRegistry(registry)).toThrow("fr");
});

it("rejects an unknown localized slug and names the rejected value", () => {
  const registry = createCompleteRegistry();
  const invalidPost = createLocalizedPost("carpenter-stardew", {
    slug: "unknown-stardew-post" as never,
  });

  expect(() =>
    validateBlogPostRegistry({ ...registry, en: [invalidPost, registry.en[1]] }),
  ).toThrow("unknown-stardew-post");
});
