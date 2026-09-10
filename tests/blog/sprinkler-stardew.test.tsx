import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { SprinklerStardewEnglishArticle } from "../../src/blog/articles/sprinkler-stardew.en";
import { SprinklerStardewChineseArticle } from "../../src/blog/articles/sprinkler-stardew.zh";
import {
  blogPostCanonicalPaths,
  getBlogPostBySlug,
  isBlogPostSlug,
} from "../../src/blog/blog-post-registry";

const englishTitle =
  "Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails";
const englishDescription =
  "Craft Farming 2, 6, or 9 sprinklers, place them for 6am watering, and check pots, Beach Farm sand, greenhouse rain, and island weather.";
const chineseTitle = "星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地";
const chineseDescription =
  "说明三种官方洒水器的早晨浇水格数、耕种解锁，以及花盆、沙地等浇不到的情况。";

it("publishes the locked localized sprinkler metadata on the shared identity", () => {
  expect(isBlogPostSlug("sprinkler-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/sprinkler-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/sprinkler-stardew/");
  expect(getBlogPostBySlug("en", "sprinkler-stardew")).toMatchObject({
    slug: "sprinkler-stardew",
    title: englishTitle,
    description: englishDescription,
    topic: "Stardew Valley Guides",
    author: "Stardew Valley Planner Team",
    readTimeMinutes: 14,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "Top-down farm illustration of three sprinklers: a 4-tile plus/cross, an 8-tile ring, and a 24-tile square of watered crops.",
    },
    featured: true,
  });
  expect(getBlogPostBySlug("zh-CN", "sprinkler-stardew")).toMatchObject({
    slug: "sprinkler-stardew",
    title: chineseTitle,
    description: chineseDescription,
    topic: "星露谷物语指南",
    author: "星露谷规划器团队",
    readTimeMinutes: 13,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "俯视农田插画，三台洒水器并排：左侧洒水器浇上下左右 4 格十字，中间优质洒水器浇周围 8 格，右侧铱制洒水器浇 24 格。",
    },
    featured: true,
  });
});

it("renders the exact gated English body, FAQ, CTA, and source boundaries without a body H1", () => {
  const markup = renderToStaticMarkup(<SprinklerStardewEnglishArticle />);

  expect(markup).toMatch(/^<article><p>/);
  expect(markup).not.toContain("<h1");
  expect(markup).toContain(
    "waters the four tiles above, below, left, and right",
  );
  expect(markup).toContain(
    "the crafting pages say they fire automatically every morning at 6am",
  );
  expect(markup).toContain(
    "a sprinkler may not be equipped with both a pressure nozzle and an Enricher at the same time",
  );
  expect(markup).toContain(
    "place sprinklers and turn on sprinkler radius",
  );
  expect(markup).toContain('href="/#planner"');
  expect(markup.match(/class="blog-faq-item"/g) ?? []).toHaveLength(7);
  expect(markup).toContain("Greenhouse");
  expect(markup).toContain("https://stardewvalleywiki.com/Greenhouse");
  expect(markup).not.toContain("<iframe");
});

it("renders the exact gated Chinese body, CTA, FAQ, and source boundaries without a body H1", () => {
  const markup = renderToStaticMarkup(<SprinklerStardewChineseArticle />);

  expect(markup).toMatch(/^<article><p>/);
  expect(markup).not.toContain("<h1");
  expect(markup).toContain("洒水器只浇上下左右 4 格");
  expect(markup).toContain("耕种 6 级解锁的是优质洒水器");
  expect(markup).toContain(
    "本站规划器只用来试摆覆盖范围，不能反过来证明游戏怎么浇水",
  );
  expect(markup).toContain("进游戏拆田之前，打开");
  expect(markup).toContain('href="/zh"');
  expect(markup).toContain("星露谷物语规划器");
  expect(markup.match(/class="blog-faq-item"/g) ?? []).toHaveLength(5);
  expect(markup).toContain("洒水器 - 星露谷物语官方中文维基");
  expect(markup).not.toContain("<iframe");
});
