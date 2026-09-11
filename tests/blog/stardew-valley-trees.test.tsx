import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { StardewValleyTreesEnglishArticle } from "../../src/blog/articles/stardew-valley-trees.en";
import { StardewValleyTreesChineseArticle } from "../../src/blog/articles/stardew-valley-trees.zh";
import {
  blogPostCanonicalPaths,
  getBlogPostBySlug,
  isBlogPostSlug,
} from "../../src/blog/blog-post-registry";

const englishTitle =
  "Mark keep, orchard, and clear tiles before you chop Stardew Valley trees";
const englishDescription =
  "Outdoor farm only. Mark keep, orchard, and clear tiles, then plant or cut. Fruit trees need a 3×3 until mature; a planner 1×1 icon is not a growth check.";
const chineseTitle = "星露谷种树：先分普通树和果树，再在农场图上留间隔";
const chineseDescription =
  "温室里的果树不是这篇的任务。果树要未开垦的 3×3；打开「树木不可生长区」。规划器能摆外观，没有果树 3×3 检查。";

it("publishes the locked localized trees metadata on the shared identity", () => {
  expect(isBlogPostSlug("stardew-valley-trees")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/stardew-valley-trees/");
  expect(blogPostCanonicalPaths).toContain("/zh/stardew-valley-trees/");
  expect(getBlogPostBySlug("en", "stardew-valley-trees")).toMatchObject({
    slug: "stardew-valley-trees",
    title: englishTitle,
    description: englishDescription,
    topic: "Stardew Valley Guides",
    author: "Stardew Valley Planner Team",
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-trees-cover.webp",
      alt: "Top-down farm illustration: a keep grove of trees with tapper buckets on the left, a fruit orchard with space between trunks in the middle, and empty cleared dirt on the right.",
    },
    featured: true,
  });
  expect(getBlogPostBySlug("zh-CN", "stardew-valley-trees")).toMatchObject({
    slug: "stardew-valley-trees",
    title: chineseTitle,
    description: chineseDescription,
    topic: "星露谷物语指南",
    author: "星露谷规划器团队",
    readTimeMinutes: 13,
    coverImage: {
      src: "/blog/stardew-valley-trees-cover.webp",
      alt: "俯视农场插画：左侧是挂树液桶的保留树丛，中间是树干留空的果树区，右侧是已清空的空地。",
    },
    featured: true,
  });
});

it("renders the locked English body, CTA, and source boundaries without a body H1 or FAQ", () => {
  const markup = renderToStaticMarkup(<StardewValleyTreesEnglishArticle />);

  expect(markup).toMatch(/^<article><p>/);
  expect(markup).not.toContain("<h1");
  expect(markup).toContain(
    "Chopping the first unlabeled tree, or buying the first sapling, is a layout choice.",
  );
  expect(markup).toContain(
    "Plant in untilled ground at the center of a clear 3×3",
  );
  expect(markup).toContain(
    "A 1×1 icon that sits on a path or against another trunk is not proof the game will let a sapling grow there.",
  );
  expect(markup).toContain('href="/#planner"');
  expect(markup).toContain('href="/glasshouse-stardew-valley"');
  expect(markup).toContain('href="/sprinkler-stardew"');
  expect(markup).toContain("https://stardewvalleywiki.com/Trees");
  expect(markup).toContain("https://stardewvalleywiki.com/Fruit_Trees");
  expect(markup.match(/class="blog-faq-item"/g) ?? []).toHaveLength(0);
  expect(markup).not.toContain("<iframe");
});

it("renders the locked Chinese body, CTA, and source boundaries without a body H1 or FAQ", () => {
  const markup = renderToStaticMarkup(<StardewValleyTreesChineseArticle />);

  expect(markup).toMatch(/^<article><p>/);
  expect(markup).not.toContain("<h1");
  expect(markup).toContain("先写下本季树的任务");
  expect(markup).toContain("规划器没有果树 3×3 检查");
  expect(markup).toContain("树木不可生长区");
  expect(markup).toContain('href="/zh#planner"');
  expect(markup).toContain('href="/zh/glasshouse-stardew-valley"');
  expect(markup).toContain('href="/zh/sprinkler-stardew"');
  expect(markup).toContain("官方中文维基：树");
  expect(markup.match(/class="blog-faq-item"/g) ?? []).toHaveLength(0);
  expect(markup).not.toContain("<iframe");
});
