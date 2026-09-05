import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { SprinklerStardewEnglishArticle } from "../../src/blog/articles/sprinkler-stardew.en";
import { SprinklerStardewChineseArticle } from "../../src/blog/articles/sprinkler-stardew.zh";
import {
  blogPostCanonicalPaths,
  getBlogPostBySlug,
  isBlogPostSlug,
} from "../../src/blog/blog-post-registry";

const englishTitle = "Stardew Valley Sprinkler Layout: 4, 8 & 24 Tiles";
const englishDescription =
  "Compare 4, 8, and 24-tile sprinklers, choose a grid for your farm, and check coverage before planting with the Stardew Valley Planner.";
const chineseTitle = "星露谷洒水器布局：4、8、24格覆盖与摆放";
const chineseDescription =
  "分清普通、优质和铱制洒水器的4/8/24格范围，再用规划器检查田块、边界和通道，避免漏浇。";

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
    readTimeMinutes: 10,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "Original illustration of a farm field with three empty sprinkler footprints: a four-tile plus, an eight-tile ring, and a twenty-four-tile square",
    },
    featured: true,
  });
  expect(getBlogPostBySlug("zh-CN", "sprinkler-stardew")).toMatchObject({
    slug: "sprinkler-stardew",
    title: chineseTitle,
    description: chineseDescription,
    topic: "星露谷物语指南",
    author: "星露谷规划器团队",
    readTimeMinutes: 10,
    coverImage: {
      src: "/blog/sprinkler-stardew-cover.webp",
      alt: "俯视农田网格中对比优质与铱制洒水器覆盖范围的星露谷洒水器布局示意",
    },
    featured: true,
  });
});

it("renders the exact gated English body, FAQ, CTA, and source boundaries without a body H1", () => {
  const markup = renderToStaticMarkup(<SprinklerStardewEnglishArticle />);

  expect(markup).toMatch(/^<article><p>/);
  expect(markup).not.toContain("<h1");
  expect(markup).toContain(
    "Treat every sprinkler as a shape before you treat it as a farm plan.",
  );
  expect(markup).toContain("A coverage number is not a crop count.");
  expect(markup).toContain("Pressure Nozzle grows the radius to 3×3, 5×5, or 7×7.");
  expect(markup).toContain("The planner shows placement geometry, not tomorrow morning.");
  expect(markup).toContain('href="/"');
  expect(markup.match(/class="blog-faq-item"/g) ?? []).toHaveLength(4);
  expect(markup).toContain("Stardew Valley Wiki: Greenhouse sprinklers");
  expect(markup).not.toContain("<iframe");
});

it("renders the exact gated Chinese body, CTA, FAQ, and source boundaries without a body H1", () => {
  const markup = renderToStaticMarkup(<SprinklerStardewChineseArticle />);

  expect(markup).toMatch(/^<article><p>/);
  expect(markup).not.toContain("<h1");
  expect(markup).toContain(
    "先把洒水器当成覆盖形状，再把它放进农场路线",
  );
  expect(markup).toContain("名义覆盖不是有效作物格");
  expect(markup).toContain("把洒水器先摆进真实农场地图");
  expect(markup).toContain("规划器只显示摆放关系，不代替第二天早晨的浇水");
  expect(markup).toContain('href="/zh#planner"');
  expect(markup).toContain("打开星露谷农场规划器");
  expect(markup.match(/class="blog-faq-item"/g) ?? []).toHaveLength(5);
  expect(markup).toContain("星露谷物语官方中文维基：洒水器");
  expect(markup).not.toContain("<iframe");
});
