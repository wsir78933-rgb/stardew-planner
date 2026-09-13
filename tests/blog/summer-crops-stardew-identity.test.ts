import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { SummerCropsStardewEnglishArticle } from "../../src/blog/articles/summer-crops-stardew.en";
import { SummerCropsStardewChineseArticle } from "../../src/blog/articles/summer-crops-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared summer crops article identity for both locales", () => {
  expect(isBlogPostSlug("summer-crops-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/summer-crops-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/summer-crops-stardew/");
});

it("exposes the locked summer crops angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(SummerCropsStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(SummerCropsStardewChineseArticle),
  );

  expect(englishMarkup).toContain("There is no single best outdoor summer crop");
  expect(englishMarkup).toContain("The Luau sells one starfruit per year for 3,000g");
  expect(englishMarkup).toContain(
    "It does not compute gold/day, last-plant dates, or giant 1% rolls",
  );
  expect(chineseMarkup).toContain(
    "星露谷夏天种什么，按你今年买得到的种子和浇得完的格子选",
  );
  expect(chineseMarkup).toContain("它不算金币、不浇水、不掷每天 1%");
});
