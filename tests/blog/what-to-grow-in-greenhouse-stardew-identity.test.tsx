import { existsSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { WhatToGrowInGreenhouseStardewEnglishArticle } from "../../src/blog/articles/what-to-grow-in-greenhouse-stardew.en";
import { WhatToGrowInGreenhouseStardewChineseArticle } from "../../src/blog/articles/what-to-grow-in-greenhouse-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

const projectRoot = join(import.meta.dirname, "../..");
const requiredPaths = [
  "src/blog/articles/what-to-grow-in-greenhouse-stardew.en.tsx",
  "src/blog/articles/what-to-grow-in-greenhouse-stardew.zh.tsx",
  "public/blog/what-to-grow-in-greenhouse-stardew-cover.webp",
  "public/blog/what-to-grow-in-greenhouse-stardew-cover.avif",
  "public/blog/illustrations/what-to-grow-in-greenhouse-stardew-choice-en.webp",
  "public/blog/illustrations/what-to-grow-in-greenhouse-stardew-choice-en.avif",
  "public/blog/illustrations/what-to-grow-in-greenhouse-stardew-choice-zh.webp",
  "public/blog/illustrations/what-to-grow-in-greenhouse-stardew-choice-zh.avif",
] as const;

it("registers the paired greenhouse crop-choice identity and local assets", () => {
  for (const relativePath of requiredPaths) {
    const absolutePath = join(projectRoot, relativePath);
    expect(existsSync(absolutePath), `Missing required path: ${absolutePath}`).toBe(true);
  }

  expect(isBlogPostSlug("what-to-grow-in-greenhouse-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/what-to-grow-in-greenhouse-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/what-to-grow-in-greenhouse-stardew/");
});

it("renders localized choice figures, scrollable tables, and source sections", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(WhatToGrowInGreenhouseStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(WhatToGrowInGreenhouseStardewChineseArticle),
  );

  expect(englishMarkup).not.toContain("<h1");
  expect(chineseMarkup).not.toContain("<h1");
  expect(englishMarkup).toContain("Regrowing crop");
  expect(englishMarkup).toContain("Single-harvest crop");
  expect(englishMarkup).toContain("Fruit trees");
  expect(chineseMarkup).toContain("重复收获");
  expect(chineseMarkup).toContain("一次收获");
  expect(chineseMarkup).toContain("果树");
  expect(englishMarkup.match(/<img /g) ?? []).toHaveLength(1);
  expect(chineseMarkup.match(/<img /g) ?? []).toHaveLength(1);
  expect(englishMarkup.match(/blog-table-scroll/g) ?? []).toHaveLength(3);
    expect(chineseMarkup.match(/blog-table-scroll/g) ?? []).toHaveLength(4);
  expect(englishMarkup).toContain("<h2>Sources</h2>");
  expect(chineseMarkup).toContain("<h2>来源</h2>");
  expect(englishMarkup).not.toContain("canary V7-GH-GROW-A-4f8c2e91");
  expect(chineseMarkup).not.toContain("canary V7-GH-GROW-A-4f8c2e91");
});
