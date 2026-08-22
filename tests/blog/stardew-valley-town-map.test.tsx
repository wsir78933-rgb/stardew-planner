import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import {
  blogPostCanonicalPaths,
  blogPostSlugs,
  getBlogPostBySlug,
} from "../../src/blog/blog-post-registry";
import { StardewValleyTownMapEnglishArticle } from "../../src/blog/articles/stardew-valley-town-map.en";
import { StardewValleyTownMapChineseArticle } from "../../src/blog/articles/stardew-valley-town-map.zh";

const englishTitle = "Stardew Valley Town Map: Pelican Town Landmarks & Routes";
const englishDescription =
  "Use this Stardew Valley town map guide to find Pelican Town landmarks, exits, and a route back to your farm before you plan its layout.";
const chineseTitle = "星露谷物语小镇地图：鹈鹕镇地点与路线";
const chineseDescription =
  "用这份鹈鹕镇地点与出口指南，先找到商店、海滩、深山和回农场的路，再开始安排你的农场布局。";

it("publishes a paired town-map guide without misrepresenting the farm planner", () => {
  expect(blogPostSlugs).toContain("stardew-valley-town-map");
  expect(blogPostCanonicalPaths).toContain("/stardew-valley-town-map/");
  expect(blogPostCanonicalPaths).toContain("/zh/stardew-valley-town-map/");

  expect(getBlogPostBySlug("en", "stardew-valley-town-map")).toMatchObject({
    title: englishTitle,
    description: englishDescription,
    coverImage: {
      src: "/blog/stardew-valley-town-map-cover.webp",
      alt: "Original illustrated map of a riverside town with roads, bridges, and landmarks",
    },
  });
  expect(getBlogPostBySlug("zh-CN", "stardew-valley-town-map")).toMatchObject({
    title: chineseTitle,
    description: chineseDescription,
    coverImage: {
      src: "/blog/stardew-valley-town-map-cover.webp",
      alt: "原创河畔小镇地图插画，标出道路、桥梁与主要地标",
    },
  });

  const englishMarkup = renderToStaticMarkup(
    createElement(StardewValleyTownMapEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(StardewValleyTownMapChineseArticle),
  );

  expect(englishMarkup).toContain("Pelican Town");
  expect(englishMarkup).toContain("https://stardewvalleywiki.com/Pelican_Town");
  expect(englishMarkup).toContain('href="/#planner"');
  expect(englishMarkup).toContain("Stardew Valley town map FAQ");
  expect(chineseMarkup).toContain("鹈鹕镇");
  expect(chineseMarkup).toContain("https://zh.stardewvalleywiki.com/%E9%B9%88%E9%B9%95%E9%95%87");
  expect(chineseMarkup).toContain('href="/zh#planner"');
  expect(chineseMarkup).toContain("星露谷物语小镇地图常见问题");
});
