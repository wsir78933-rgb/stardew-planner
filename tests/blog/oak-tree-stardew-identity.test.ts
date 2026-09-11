import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { OakTreeStardewEnglishArticle } from "../../src/blog/articles/oak-tree-stardew.en";
import { OakTreeStardewChineseArticle } from "../../src/blog/articles/oak-tree-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared oak tree article identity for both locales", () => {
  expect(isBlogPostSlug("oak-tree-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/oak-tree-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/oak-tree-stardew/");
});

it("exposes the locked oak grove angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(createElement(OakTreeStardewEnglishArticle));
  const chineseMarkup = renderToStaticMarkup(createElement(OakTreeStardewChineseArticle));

  expect(englishMarkup).toContain("Identify an oak tree, not a fruit tree");
  expect(englishMarkup).toContain("Plant with wild-tree spacing, not orchard spacing");
  expect(englishMarkup).toContain("Grow: 20% nights versus Tree Fertilizer in 5 days");
  expect(englishMarkup).toContain("The planner is a placement sketch");
  expect(chineseMarkup).toContain("先认星露谷物语橡树，别种成枫树");
  expect(chineseMarkup).toContain("为什么一直不长大");
  expect(chineseMarkup).toContain("挂树液采集器拿橡树树脂");
  expect(chineseMarkup).toContain("规划器只显示摆放关系");
});
