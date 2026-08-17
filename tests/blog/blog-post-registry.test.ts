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

it("keeps the two canonical blog identities in publishing order", () => {
  expect(blogPostSlugs).toEqual(expectedSlugs);
  expect(isBlogPostSlug("carpenter-stardew")).toBe(true);
  expect(isBlogPostSlug("where-is-robin-stardew-valley")).toBe(true);
  expect(isBlogPostSlug("missing-post")).toBe(false);
});

it("publishes only the four localized root-level canonical article paths", () => {
  expect(blogPostCanonicalPaths).toEqual([
    "/carpenter-stardew/",
    "/where-is-robin-stardew-valley/",
    "/zh/carpenter-stardew/",
    "/zh/where-is-robin-stardew-valley/",
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
  expect(getBlogPostBySlug("zh-CN", "missing-post" as never)).toBeUndefined();
});

it("binds every localized post to its own original blog cover", () => {
  const expectedCoverPaths = {
    "carpenter-stardew": "/blog/carpenter-stardew-cover.webp",
    "where-is-robin-stardew-valley": "/blog/where-is-robin-stardew-valley-cover.webp",
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
  ).toThrow("where-is-robin-stardew-valley");
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
