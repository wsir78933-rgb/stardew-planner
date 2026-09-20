import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { HowToLevelUpFarmingStardewEnglishArticle } from "../../src/blog/articles/how-to-level-up-farming-stardew.en";
import { HowToLevelUpFarmingStardewChineseArticle } from "../../src/blog/articles/how-to-level-up-farming-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared farming XP article identity for both locales", () => {
  expect(isBlogPostSlug("how-to-level-up-farming-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/how-to-level-up-farming-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/how-to-level-up-farming-stardew/");
});

it("exposes the locked farming XP angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(HowToLevelUpFarmingStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(HowToLevelUpFarmingStardewChineseArticle),
  );

  expect(englishMarkup).toContain(
    "using a hoe or watering can does not grant experience by itself",
  );
  expect(englishMarkup).toContain("only reward experience for the first product");
  expect(englishMarkup).toContain("2,150 for level 5");
  expect(englishMarkup).toContain("15,000 for 10");
  expect(englishMarkup).toContain("/blog/illustrations/farming-xp-source-map.webp");
  expect(englishMarkup).toContain(
    "/blog/illustrations/farming-xp-first-product-only.webp",
  );
  expect(englishMarkup).not.toContain("<h2>FAQ</h2>");
  expect(chineseMarkup).toContain("使用锄头和喷壶不会获得经验。");
  expect(chineseMarkup).toContain("蓝莓这一株是 10 点");
  expect(chineseMarkup).toContain("5 级 2150 点，10 级一共 15000 点");
  expect(chineseMarkup).toContain(
    "/blog/illustrations/how-to-level-up-farming-stardew-add-or-not-zh.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/how-to-level-up-farming-stardew-first-product-zh.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/how-to-level-up-farming-stardew-level-ladder-zh.webp",
  );
  expect(chineseMarkup).toContain("<h2>FAQ</h2>");
});
