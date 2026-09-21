import { existsSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { expect, it } from "vitest";
import { LastDayToPlantStardewEnglishArticle } from "../../src/blog/articles/last-day-to-plant-stardew.en";
import { LastDayToPlantStardewChineseArticle } from "../../src/blog/articles/last-day-to-plant-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

const projectRoot = join(import.meta.dirname, "../..");
const requiredLastDayToPlantPaths = [
  "src/blog/articles/last-day-to-plant-stardew.en.tsx",
  "src/blog/articles/last-day-to-plant-stardew.zh.tsx",
  "public/blog/last-day-to-plant-stardew-cover.webp",
] as const;

function assertRequiredLastDayToPlantPathExists(relativePath: string): void {
  const absolutePath = join(projectRoot, relativePath);

  if (!existsSync(absolutePath)) {
    throw new Error(
      `Missing required last-day-to-plant-stardew path. Received: ${absolutePath}.`,
    );
  }
}

it("registers the shared last-day-to-plant article identity for both locales", () => {
  for (const relativePath of requiredLastDayToPlantPaths) {
    assertRequiredLastDayToPlantPathExists(relativePath);
  }

  expect(isBlogPostSlug("last-day-to-plant-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/last-day-to-plant-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/last-day-to-plant-stardew/");
});

it("exposes the locked last-plant formula in both independent article bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(LastDayToPlantStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(LastDayToPlantStardewChineseArticle),
  );

  expect(englishMarkup).toContain(
    "by Spring 24 if you still want it ready on Spring 28",
  );
  expect(englishMarkup).toContain("28 − 4 = 24");
  expect(englishMarkup).toContain("28 − 12 = 16");
  expect(englishMarkup).toContain("/blog/illustrations/last-plant-grow-clock.webp");
  expect(englishMarkup).toContain(
    "/blog/illustrations/last-plant-season-calendar.webp",
  );
  expect(englishMarkup).not.toContain("<h2>FAQ</h2>");
  expect(chineseMarkup).toContain(
    "春天想在第 28 天收到防风草，最晚在第 24 天种下",
  );
  expect(chineseMarkup).toContain("播种日 = 28 − 4 = 24");
  expect(chineseMarkup).toContain("最晚在秋天第 15 天种下");
  expect(chineseMarkup).toContain(
    "/blog/illustrations/last-plant-parsnip-calendar-gap-zh.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/last-plant-cranberry-first-vs-full-zh.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/last-plant-four-season-calendar-zh.webp",
  );
  expect(chineseMarkup).toContain("<h2>FAQ</h2>");
});
