import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { RancherOrTillerStardewEnglishArticle } from "../../src/blog/articles/rancher-or-tiller-stardew.en";
import { RancherOrTillerStardewChineseArticle } from "../../src/blog/articles/rancher-or-tiller-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared rancher or tiller article identity for both locales", () => {
  expect(isBlogPostSlug("rancher-or-tiller-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/rancher-or-tiller-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/rancher-or-tiller-stardew/");
});

it("exposes the locked rancher or tiller angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(RancherOrTillerStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(RancherOrTillerStardewChineseArticle),
  );

  expect(englishMarkup).toContain("This click locks your Farming 10 pair");
  expect(englishMarkup).toContain("It does not pick professions");
  expect(chineseMarkup).toContain("5 级这一选会锁住 10 级");
  expect(chineseMarkup).toContain("白天技能栏里选不了");
});
