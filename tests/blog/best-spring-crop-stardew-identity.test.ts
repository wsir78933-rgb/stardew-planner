import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { BestSpringCropStardewEnglishArticle } from "../../src/blog/articles/best-spring-crop-stardew.en";
import { BestSpringCropStardewChineseArticle } from "../../src/blog/articles/best-spring-crop-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared best spring crop article identity for both locales", () => {
  expect(isBlogPostSlug("best-spring-crop-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/best-spring-crop-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/best-spring-crop-stardew/");
});

it("exposes the locked spring crop angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(BestSpringCropStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(BestSpringCropStardewChineseArticle),
  );

  expect(englishMarkup).toContain(
    "Best depends on year, gold, and the plot you can water",
  );
  expect(englishMarkup).toContain("Sketch the spring bed in the planner");
  expect(englishMarkup).toContain("The planner does not water");
  expect(chineseMarkup).toContain("第一年春天种什么");
  expect(chineseMarkup).toContain("先在规划器里画出春季那块田");
  expect(chineseMarkup).toContain("规划器里的春季田只是草图");
});
