import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

const globalsCssPath = join(import.meta.dirname, "../../app/globals.css");

function readBlogStylesheet(): string {
  return readFileSync(globalsCssPath, "utf8");
}

function readScopedBlogCssBlock(stylesheet: string): string {
  const startMarker = "/* Blog module: isolated from the planner and site-wide public-page surfaces. */";
  const endMarker = "[data-public-page-shell] {";
  const blockStart = stylesheet.indexOf(startMarker);
  const blockEnd = stylesheet.indexOf(endMarker, blockStart);

  if (blockStart === -1 || blockEnd === -1) {
    throw new Error(`Missing scoped blog CSS block. Received markers: ${blockStart}, ${blockEnd}.`);
  }

  return stylesheet.slice(blockStart, blockEnd);
}

function readScopedRuleBody(scopedBlogCssBlock: string, selector: string): string {
  const ruleStart = scopedBlogCssBlock.indexOf(`${selector} {`);
  const ruleEnd = scopedBlogCssBlock.indexOf("}", ruleStart);

  if (ruleStart === -1 || ruleEnd === -1) {
    throw new Error(`Missing scoped blog rule. Received selector: ${selector}.`);
  }

  return scopedBlogCssBlock.slice(ruleStart, ruleEnd);
}

it("defines responsive blog layout and accessibility rules under blog-only scopes", () => {
  const stylesheet = readScopedBlogCssBlock(readBlogStylesheet());

  expect(stylesheet).toContain("[data-blog-page]");
  expect(stylesheet).toContain("[data-blog-article]");
  expect(stylesheet).toMatch(/\[data-blog-page\][^{]*\.blog-article-grid[\s\S]*grid-template-columns:\s*1fr/);
  expect(stylesheet).toMatch(/@media \(min-width:\s*768px\)[\s\S]*\[data-blog-page\][^{]*\.blog-article-grid[\s\S]*repeat\(2,/);
  expect(stylesheet).toMatch(/@media \(min-width:\s*1024px\)[\s\S]*\[data-blog-page\][^{]*\.blog-article-grid[\s\S]*repeat\(3,/);
  expect(stylesheet).toMatch(/@media \(min-width:\s*1024px\)[\s\S]*\[data-blog-article\][^{]*\.blog-table-of-contents[\s\S]*position:\s*sticky/);
  expect(stylesheet).toMatch(/\[data-blog-page\][^{]*:focus-visible/);
  expect(stylesheet).toMatch(/\[data-blog-article\][^{]*:focus-visible/);
  expect(stylesheet).toMatch(/\[data-blog-page\],[\s\S]*\[data-blog-article\][\s\S]*overflow-x:\s*clip/);
  expect(
    readScopedRuleBody(stylesheet, "[data-blog-article] .blog-table-of-contents"),
  ).toMatch(/\bdisplay:\s*(?:block|grid)/);
});

it("keeps every blog class selector inside a blog scope without planner or footer selectors", () => {
  const scopedBlogCssBlock = readScopedBlogCssBlock(readBlogStylesheet());
  const blogSelectorLines = scopedBlogCssBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes(".blog-"));

  expect(blogSelectorLines).not.toHaveLength(0);
  expect(
    blogSelectorLines.every(
      (line) =>
        line.startsWith("[data-blog-page]") || line.startsWith("[data-blog-article]"),
    ),
  ).toBe(true);
  expect(scopedBlogCssBlock).not.toMatch(/\.planner-editor-shell|\[data-site-footer\]/);
  expect(scopedBlogCssBlock).not.toMatch(/(?:^|,)\s*(?:nav|footer)\b/m);
});
