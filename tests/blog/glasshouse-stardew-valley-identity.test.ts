import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { GlasshouseStardewValleyEnglishArticle } from "../../src/blog/articles/glasshouse-stardew-valley.en";
import { GlasshouseStardewValleyChineseArticle } from "../../src/blog/articles/glasshouse-stardew-valley.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

it("registers the shared glasshouse article identity for both locales", () => {
  expect(isBlogPostSlug("glasshouse-stardew-valley")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/glasshouse-stardew-valley/");
  expect(blogPostCanonicalPaths).toContain("/zh/glasshouse-stardew-valley/");
});

it("exposes the V4.1 greenhouse layout angle in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(createElement(GlasshouseStardewValleyEnglishArticle));
  const chineseMarkup = renderToStaticMarkup(createElement(GlasshouseStardewValleyChineseArticle));

  expect(englishMarkup).toContain("Plan the greenhouse around decisions, not a picture");
  expect(englishMarkup).toContain("When six iridium sprinklers are your ceiling");
  expect(englishMarkup).toContain("The planner is a placement check, not a game-state simulator");
  expect(chineseMarkup).toContain("先决定温室要服务哪种玩法");
  expect(chineseMarkup).toContain("把布局拆成三个独立区域");
  expect(chineseMarkup).toContain("规划器只检查摆放关系，不代替游戏状态");
});
