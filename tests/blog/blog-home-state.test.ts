import { expect, it } from "vitest";
import type { BlogPostSlug, LocalizedBlogPost } from "../../src/blog/blog-post-registry";
import { getAllBlogPosts } from "../../src/blog/blog-post-registry";
import {
  buildBlogHomeHref,
  filterBlogPostsByTitle,
  getBlogHomeState,
  paginateBlogPosts,
} from "../../src/blog/blog-home-state";

function createBlogPost(
  index: number,
  overrides: Partial<LocalizedBlogPost> = {},
): LocalizedBlogPost {
  return {
    slug: (index % 2 === 0
      ? "carpenter-stardew"
      : "where-is-robin-stardew-valley") as BlogPostSlug,
    title: `Guide ${index}`,
    description: `Description ${index}`,
    topic: "Stardew Valley Guides",
    author: "Stardew Valley Planner Team",
    readTimeMinutes: 5,
    coverImage: {
      src: "/social-images/stardew-valley-farm-planner.png",
      alt: `Useful guide illustration ${index}`,
    },
    featured: true,
    Content: () => null,
    ...overrides,
  };
}

it("returns an empty default home state for no posts", () => {
  expect(getBlogHomeState([], {})).toEqual({
    query: "",
    topic: "",
    visible: 6,
    topics: [],
    posts: [],
    topicCarouselPosts: [],
    totalPostCount: 0,
  });
});

it("keeps four real posts in registry canonical order", () => {
  const posts = getAllBlogPosts("en");
  const homeState = getBlogHomeState(posts, {});

  expect(homeState.posts.map((post) => post.slug)).toEqual([
    "carpenter-stardew",
    "where-is-robin-stardew-valley",
    "stardew-valley-npc",
    "stardew-valley-town-map",
  ]);
  expect(homeState.totalPostCount).toBe(4);
  expect(homeState.topicCarouselPosts.map((post) => post.slug)).toEqual([
    "carpenter-stardew",
    "where-is-robin-stardew-valley",
    "stardew-valley-npc",
    "stardew-valley-town-map",
  ]);
});

it("treats every array-valued home parameter as an invalid non-string value", () => {
  const posts = Array.from({ length: 7 }, (_, index) => createBlogPost(index));
  const homeState = getBlogHomeState(posts, {
    q: ["Robin"],
    topic: ["Stardew Valley Guides"],
    visible: ["12"],
  });

  expect(homeState.query).toBe("");
  expect(homeState.topic).toBe("");
  expect(homeState.visible).toBe(6);
  expect(homeState.posts).toHaveLength(6);
  expect(
    buildBlogHomeHref("en", {
      q: ["Robin"],
      topic: ["Stardew Valley Guides"],
      visible: ["12"],
    }),
  ).toBe("/blog");
});

it("keeps an unknown topic selected while returning no matching posts", () => {
  const homeState = getBlogHomeState(getAllBlogPosts("en"), {
    topic: "Unknown topic",
  });

  expect(homeState.topic).toBe("Unknown topic");
  expect(homeState.posts).toEqual([]);
  expect(homeState.totalPostCount).toBe(0);
});

it("filters titles case-insensitively without changing input order", () => {
  const posts = [
    createBlogPost(0, { title: "Robin's Carpenter Shop" }),
    createBlogPost(1, { title: "How to Find Robin" }),
    createBlogPost(2, { title: "Stardew Valley Fishing" }),
  ];

  expect(filterBlogPostsByTitle(posts, "rObIn").map((post) => post.title)).toEqual([
    "Robin's Carpenter Shop",
    "How to Find Robin",
  ]);
  expect(posts.map((post) => post.title)).toEqual([
    "Robin's Carpenter Shop",
    "How to Find Robin",
    "Stardew Valley Fishing",
  ]);
});

it.each(["0", "-2", "1.5", "not-a-number"])(
  "normalizes invalid visible parameter %s to six posts",
  (visible) => {
    const posts = Array.from({ length: 7 }, (_, index) => createBlogPost(index));

    const homeState = getBlogHomeState(posts, { visible });

    expect(homeState.visible).toBe(6);
    expect(homeState.posts).toHaveLength(6);
  },
);

it("deduplicates four same-topic fixtures in their first-seen order", () => {
  const posts = Array.from({ length: 4 }, (_, index) =>
    createBlogPost(index, { topic: "Robin Guides" }),
  );

  expect(getBlogHomeState(posts, {}).topics).toEqual(["Robin Guides"]);
});

it("selects the first canonical-order topic with at least four posts", () => {
  const posts = [
    createBlogPost(0, { topic: "Too small" }),
    createBlogPost(1, { topic: "Robin Guides" }),
    createBlogPost(2, { topic: "Later Guides" }),
    createBlogPost(3, { topic: "Too small" }),
    createBlogPost(4, { topic: "Robin Guides" }),
    createBlogPost(5, { topic: "Too small" }),
    createBlogPost(6, { topic: "Later Guides" }),
    createBlogPost(7, { topic: "Robin Guides" }),
    createBlogPost(8, { topic: "Later Guides" }),
    createBlogPost(9, { topic: "Robin Guides" }),
    createBlogPost(10, { topic: "Later Guides" }),
  ];

  expect(
    getBlogHomeState(posts, {}).topicCarouselPosts.map((post) => post.title),
  ).toEqual(["Guide 1", "Guide 4", "Guide 7", "Guide 9"]);
});

it("returns no topic carousel posts when every topic has fewer than four posts", () => {
  const posts = Array.from({ length: 3 }, (_, index) =>
    createBlogPost(index, { topic: "Robin Guides" }),
  );

  expect(getBlogHomeState(posts, {}).topicCarouselPosts).toEqual([]);
});

it("limits more than six matching posts while retaining their total", () => {
  const posts = Array.from({ length: 7 }, (_, index) =>
    createBlogPost(index, { title: `Robin guide ${index}` }),
  );

  const homeState = getBlogHomeState(posts, { q: "Robin" });

  expect(homeState.posts).toHaveLength(6);
  expect(homeState.totalPostCount).toBe(7);
  expect(homeState.posts.map((post) => post.title)).toEqual([
    "Robin guide 0",
    "Robin guide 1",
    "Robin guide 2",
    "Robin guide 3",
    "Robin guide 4",
    "Robin guide 5",
  ]);
});

it("preserves a query, topic, and non-default visible count in localized links", () => {
  expect(
    buildBlogHomeHref("zh-CN", {
      q: "Robin's hours",
      topic: "Stardew Valley Guides",
      visible: "9",
    }),
  ).toBe(
    "/zh/blog?q=Robin%27s+hours&topic=Stardew+Valley+Guides&visible=9",
  );
});

it("omits empty query parameters and the default visible count from home links", () => {
  expect(
    buildBlogHomeHref("en", { q: " ", topic: "", visible: "6" }),
  ).toBe("/blog");
});

it("paginates without mutating or sorting the supplied posts", () => {
  const posts = Array.from({ length: 4 }, (_, index) => createBlogPost(index));

  expect(paginateBlogPosts(posts, 2, 2).map((post) => post.title)).toEqual([
    "Guide 2",
    "Guide 3",
  ]);
  expect(posts.map((post) => post.title)).toEqual([
    "Guide 0",
    "Guide 1",
    "Guide 2",
    "Guide 3",
  ]);
});
