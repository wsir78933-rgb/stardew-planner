import { expect, it } from "vitest";
import type { BlogPostSlug, LocalizedBlogPost } from "../../src/blog/blog-post-registry";
import { getBlogArchiveState } from "../../src/blog/blog-archive-state";

function createBlogPost(index: number): LocalizedBlogPost {
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
  };
}

it.each([
  [0, 0],
  [1, 1],
  [9, 1],
  [10, 2],
  [18, 2],
  [19, 3],
])("calculates %i archive posts as %i pages", (postCount, pageCount) => {
  const posts = Array.from({ length: postCount }, (_, index) => createBlogPost(index));

  const archiveState = getBlogArchiveState(posts, undefined);

  expect(archiveState.pageCount).toBe(pageCount);
  expect(archiveState.page).toBe(1);
  expect(archiveState.posts).toHaveLength(Math.min(postCount, 9));
});

it("normalizes an invalid archive page to the first page", () => {
  const posts = Array.from({ length: 10 }, (_, index) => createBlogPost(index));

  const archiveState = getBlogArchiveState(posts, "not-a-page");

  expect(archiveState.page).toBe(1);
  expect(archiveState.posts.map((post) => post.title)).toEqual([
    "Guide 0",
    "Guide 1",
    "Guide 2",
    "Guide 3",
    "Guide 4",
    "Guide 5",
    "Guide 6",
    "Guide 7",
    "Guide 8",
  ]);
});

it("normalizes an over-large archive page to the final page", () => {
  const posts = Array.from({ length: 19 }, (_, index) => createBlogPost(index));

  const archiveState = getBlogArchiveState(posts, "99");

  expect(archiveState.page).toBe(3);
  expect(archiveState.posts.map((post) => post.title)).toEqual(["Guide 18"]);
});
