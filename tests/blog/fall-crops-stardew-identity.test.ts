import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { FallCropsStardewEnglishArticle } from "../../src/blog/articles/fall-crops-stardew.en";
import { FallCropsStardewChineseArticle } from "../../src/blog/articles/fall-crops-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared fall crops article identity for both locales", () => {
  expect(isBlogPostSlug("fall-crops-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/fall-crops-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/fall-crops-stardew/");
});

it("exposes the locked fall crops angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(FallCropsStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(FallCropsStardewChineseArticle),
  );

  expect(englishMarkup).toContain("There is no single best outdoor fall crop");
  expect(englishMarkup).toContain(
    "Use the derived last-plant table before you spend a late-month Pierre trip. A pumpkin seed after Fall 15, a fairy rose after Fall 16, or a Sweet Gem after Fall 4 is an unfinished stage on Winter 1.",
  );
  expect(englishMarkup).toContain(
    "It does not compute gold/day, last-plant dates, or giant 1% rolls",
  );
  expect(chineseMarkup).toContain(
    "秋 1 先用镰刀清掉非当季枯株；夏 28 还在地里的玉米不枯",
  );
  expect(chineseMarkup).toContain("它不算金币、不浇水、不掷每天 1%");
});
