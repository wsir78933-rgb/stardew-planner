import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { MapleTreeStardewEnglishArticle } from "../../src/blog/articles/maple-tree-stardew.en";
import { MapleTreeStardewChineseArticle } from "../../src/blog/articles/maple-tree-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared maple tree article identity for both locales", () => {
  expect(isBlogPostSlug("maple-tree-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/maple-tree-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/maple-tree-stardew/");
});

it("exposes the locked maple grove angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(createElement(MapleTreeStardewEnglishArticle));
  const chineseMarkup = renderToStaticMarkup(createElement(MapleTreeStardewChineseArticle));

  expect(englishMarkup).toContain("Identify a maple by seed and syrup, not by leaf adjectives");
  expect(englishMarkup).toContain("Sketch Maple Tree (Normal) in the planner");
  expect(englishMarkup).toContain("The planner is a placement sketch");
  expect(chineseMarkup).toContain("先认枫树，别种成橡树");
  expect(chineseMarkup).toContain("在规划器里标 Maple Tree");
  expect(chineseMarkup).toContain("规划器搜不到：改搜 Maple Tree");
});
