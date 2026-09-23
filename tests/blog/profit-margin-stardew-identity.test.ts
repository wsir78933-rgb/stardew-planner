import { existsSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProfitMarginStardewEnglishArticle } from "../../src/blog/articles/profit-margin-stardew.en";
import { ProfitMarginStardewChineseArticle } from "../../src/blog/articles/profit-margin-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

const projectRoot = join(import.meta.dirname, "../..");
const requiredPaths = [
  "src/blog/articles/profit-margin-stardew.en.tsx",
  "src/blog/articles/profit-margin-stardew.zh.tsx",
  "public/blog/profit-margin-stardew-cover.webp",
  "public/blog/profit-margin-stardew-cover.avif",
  "public/blog/illustrations/profit-margin-stardew-price-boundary.webp",
  "public/blog/illustrations/profit-margin-stardew-price-boundary.avif",
  "public/blog/illustrations/profit-margin-stardew-advanced-options.webp",
  "public/blog/illustrations/profit-margin-stardew-advanced-options.avif",
] as const;

it("registers the paired profit-margin-stardew identity and required local files", () => {
  for (const relativePath of requiredPaths) {
    const absolutePath = join(projectRoot, relativePath);
    expect(existsSync(absolutePath), `Missing required path: ${absolutePath}`).toBe(true);
  }

  expect(isBlogPostSlug("profit-margin-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/profit-margin-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/profit-margin-stardew/");
});

it("renders independent reader bodies with no page-level H1 or figure token placeholders", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(ProfitMarginStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ProfitMarginStardewChineseArticle),
  );

  for (const markup of [englishMarkup, chineseMarkup]) {
    expect(markup).not.toContain("<h1");
    expect(markup).not.toContain("fig-01-price-boundary");
    expect(markup).not.toContain("fig-02-advanced-options-path");
    expect(markup.match(/<img /g) ?? []).toHaveLength(2);
    expect(markup.match(/loading="lazy"/g) ?? []).toHaveLength(2);
    expect(markup).toContain("<h2");
    expect(markup).toContain("<h2>Sources</h2>");
  }

  expect(englishMarkup).toContain(
    "/blog/illustrations/profit-margin-stardew-price-boundary.webp",
  );
  expect(englishMarkup).toContain(
    "/blog/illustrations/profit-margin-stardew-advanced-options.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/profit-margin-stardew-price-boundary.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/profit-margin-stardew-advanced-options.webp",
  );
});
