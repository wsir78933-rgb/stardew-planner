import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { HowToEarnMoneyStardewEnglishArticle } from "../../src/blog/articles/how-to-earn-money-stardew.en";
import { HowToEarnMoneyStardewChineseArticle } from "../../src/blog/articles/how-to-earn-money-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared year 1 gold article identity for both locales", () => {
  expect(isBlogPostSlug("how-to-earn-money-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/how-to-earn-money-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/how-to-earn-money-stardew/");
});

it("exposes the locked year 1 gold angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(HowToEarnMoneyStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(HowToEarnMoneyStardewChineseArticle),
  );

  expect(englishMarkup).toContain(
    "Spring 1–12: fish, plant, or buy the backpack",
  );
  expect(englishMarkup).toContain("It does not earn gold");
  expect(chineseMarkup).toContain(
    "春 1 到春 12：下一步是钓鱼、种田，还是买背包",
  );
  expect(chineseMarkup).toContain("不算金币");
});
