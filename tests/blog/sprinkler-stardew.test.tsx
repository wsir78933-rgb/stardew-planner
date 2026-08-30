import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { SprinklerStardewEnglishArticle } from "../../src/blog/articles/sprinkler-stardew.en";
import { SprinklerStardewChineseArticle } from "../../src/blog/articles/sprinkler-stardew.zh";
import {
  blogPostCanonicalPaths,
  getBlogPostBySlug,
  isBlogPostSlug,
} from "../../src/blog/blog-post-registry";

const englishTitle = "Sprinkler Stardew: 4, 8, or 24 Tiles Before You Plant";
const englishDescription =
  "Match each sprinkler to 4, 8, or 24 tiles, then check radius overlay on your farm map. Pressure nozzles and enrichers cannot share one sprinkler.";
const chineseTitle =
  "星露谷洒水器布局别急着照抄模板：先算清4/8/24格覆盖，再排池塘、通道与农场边角，少漏浇也不浪费格";
const chineseDescription =
  "星露谷洒水器布局怎么排，先看4格十字、8格3×3、24格5×5三种覆盖，再按农田边角、池塘和通道修正。本文给出数量公式、优质与铱制洒水器摆法、2×2模块示例、沙地与漏浇排查，还教你用在线规划器叠加洒水器和稻草人范围，先在地图上检查并导出截图，再照着布局进游戏摆放。";

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
    "The watering can will eat a morning once the field is bigger than a handful of parsnips.",
  );
  expect(markup).toContain("Count the tiles the sprinkler actually waters");
  expect(markup).toContain("Pressure Nozzle grows the radius to 3×3, 5×5, or 7×7.");
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
    "很多洒水器布局看起来很整齐，放进自己的农场却会漏浇：地图边缘、池塘和通道，会让纸面上的满覆盖失效。",
  );
  expect(markup).toContain("理论最少数量 = 向上取整（计划浇水格数 ÷ 单个洒水器覆盖格数）");
  expect(markup).toContain("把洒水器先摆进真实农场地图");
  expect(markup).toContain('href="/zh#planner"');
  expect(markup).toContain("打开星露谷农场规划器");
  expect(markup.match(/class="blog-faq-item"/g) ?? []).toHaveLength(5);
  expect(markup).toContain("星露谷物语官方中文维基：洒水器");
  expect(markup).not.toContain("<iframe");
});
