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

it("keeps the seven canonical blog identities in publishing order", () => {
  expect(blogPostSlugs).toEqual(expectedSlugs);
  expect(isBlogPostSlug("carpenter-stardew")).toBe(true);
  expect(isBlogPostSlug("where-is-robin-stardew-valley")).toBe(true);
  expect(isBlogPostSlug("missing-post")).toBe(false);
});

it("publishes only the fourteen localized root-level canonical article paths", () => {
  expect(blogPostCanonicalPaths).toEqual([
    "/carpenter-stardew/",
    "/where-is-robin-stardew-valley/",
    "/stardew-valley-npc/",
    "/stardew-valley-town-map/",
    "/where-is-stardew-valley-located/",
    "/stardew-valley-expanded-bachelors-and-bachelorettes/",
    "/sprinkler-stardew/",
    "/zh/carpenter-stardew/",
    "/zh/where-is-robin-stardew-valley/",
    "/zh/stardew-valley-npc/",
    "/zh/stardew-valley-town-map/",
    "/zh/where-is-stardew-valley-located/",
    "/zh/stardew-valley-expanded-bachelors-and-bachelorettes/",
    "/zh/sprinkler-stardew/",
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
    title: "Carpenter Stardew: Which Robin Service Do You Need Today?",
    description:
      "Match your task—buy, build, upgrade, or move—to the menu and verify the shop can serve you.",
  });
  expect(chinesePosts[0]).toMatchObject({
    title: "星露谷木匠：今天该选罗宾的哪项服务？",
    description: "根据购买、建造、升级或移动的实际需求，选择对应菜单并确认罗宾木匠商店能接单。",
  });
  expect(englishPosts[1]).toMatchObject({
    title: "Robin's Shop Is Empty? Find Her in Stardew Valley Today",
    description:
      "Learn why Robin leaves the counter, where she goes on Tuesday and Friday, and when rain or farm construction changes the answer today.",
  });
  expect(chinesePosts[1]).toMatchObject({
    title: "罗宾的商店没人？今天去哪里找她",
    description:
      "了解罗宾为什么会离开柜台、周二和周五会去哪里，以及下雨或农场施工会如何改变她当天的行程。",
  });
  expect(englishPosts[2]).toMatchObject({
    title: "Stardew Valley NPC Guide: Gifts, Marriage, and Services",
    description:
      "Compare current friendship groups, gift rules, marriage candidates, and the NPC services that shape your building, animal, and tool plans.",
  });
  expect(chinesePosts[2]).toMatchObject({
    title: "星露谷 NPC 指南：礼物、婚姻与服务",
    description:
      "比较当前好感度分类、送礼规则、可结婚候选，以及会影响建筑、动物和工具规划的 NPC 服务。",
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
    title: "Where Is Stardew Valley Located in the Game’s World?",
    description:
      "Understand the game’s fictional geography, the role of the Gem Sea and Gotoro Empire, and the clear limits of real-world comparisons.",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/where-is-stardew-valley-located-cover.webp",
      alt: "Original illustration of a quiet rural valley with a small town, mountains, and a farm road",
    },
  });
  expect(chinesePosts[4]).toMatchObject({
    title: "星露谷在游戏世界中位于哪里？",
    description:
      "了解游戏中的虚构地理、宝石海与戈特洛帝国的关系，以及将游戏地点与现实世界进行类比时的明确边界。",
    readTimeMinutes: 11,
    coverImage: {
      src: "/blog/where-is-stardew-valley-located-cover.webp",
      alt: "原创乡村山谷插画，可见小镇、远山与通往农场的道路",
    },
  });
  expect(englishPosts[5]).toMatchObject({
    title: "7 Stardew Valley Expanded Bachelors and Bachelorettes",
    description:
      "See all 7 current SVE bachelors and bachelorettes, who is event-gated, starter loved gifts, and how to plan the farm after you choose.",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      alt: "Original illustration of seven villagers at a vineyard and town square, no copyrighted sprites",
    },
  });
  expect(chinesePosts[5]).toMatchObject({
    title:
      "当前星露谷SVE 可结婚角色完整名单是7人：克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅、维克多",
    description:
      "先对照当前7位星露谷SVE可结婚角色名单，分清4位女性和3位男性，再核对克莱尔、斯嘉丽、兰斯的出现闸门和入门最爱礼物。选定对象后打开星露谷农场规划器，给农舍、配偶房和出货箱道路留空；规划器只做布局，不追踪红心或NPC行程。来源核对于2026年8月25日SVE Wiki村民页。",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      alt: "葡萄园与小镇广场上七位村民相聚的原创插画，未使用受版权保护的游戏立绘",
    },
  });
  expect(englishPosts[6]).toMatchObject({
    title: "Sprinkler Stardew: 4, 8, or 24 Tiles Before You Plant",
    description:
      "Match each sprinkler to 4, 8, or 24 tiles, then check radius overlay on your farm map. Pressure nozzles and enrichers cannot share one sprinkler.",
    readTimeMinutes: 10,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "Original illustration of a farm field with three empty sprinkler footprints: a four-tile plus, an eight-tile ring, and a twenty-four-tile square",
    },
  });
  expect(chinesePosts[6]).toMatchObject({
    title:
      "星露谷洒水器布局别急着照抄模板：先算清4/8/24格覆盖，再排池塘、通道与农场边角，少漏浇也不浪费格",
    description:
      "星露谷洒水器布局怎么排，先看4格十字、8格3×3、24格5×5三种覆盖，再按农田边角、池塘和通道修正。本文给出数量公式、优质与铱制洒水器摆法、2×2模块示例、沙地与漏浇排查，还教你用在线规划器叠加洒水器和稻草人范围，先在地图上检查并导出截图，再照着布局进游戏摆放。",
    readTimeMinutes: 10,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "俯视农田网格中对比优质与铱制洒水器覆盖范围的星露谷洒水器布局示意",
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
    "Expected: carpenter-stardew. Received: sprinkler-stardew.",
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
