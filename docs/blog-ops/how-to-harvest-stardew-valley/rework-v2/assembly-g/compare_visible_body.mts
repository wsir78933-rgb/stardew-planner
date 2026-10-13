import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const assemblyDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(assemblyDirectory, "../../../../../");

async function loadArticle(fileName: string): Promise<() => ReturnType<typeof createElement>> {
  const articlePath = path.join(workspaceRoot, "src/blog/articles", fileName);
  const articleUrl = pathToFileURL(articlePath).href;
  const articleModule = await import(articleUrl);
  const exportName = Object.keys(articleModule).find(
    (key) => typeof articleModule[key] === "function",
  );
  if (exportName === undefined) {
    throw new Error(
      `Article module ${articlePath} has no function export. Received keys: ${Object.keys(articleModule).join(", ")}.`,
    );
  }
  return articleModule[exportName];
}

const expectationPath = new URL("./visible-body-expectation.json", import.meta.url);
const expectation = JSON.parse(readFileSync(expectationPath, "utf8"));

const elementPattern =
  /<(p|h2|h3|li|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/g;

function decodeHtml(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function visibleText(htmlFragment: string): string {
  const withoutTags = htmlFragment.replace(/<[^>]+>/g, "");
  return decodeHtml(withoutTags).replace(/\s+/g, " ").trim();
}

function renderedBlocks(markup: string): string[] {
  const blocks: string[] = [];
  for (const match of markup.matchAll(elementPattern)) {
    blocks.push(visibleText(match[2]));
  }
  return blocks;
}

function expectedBlocks(localeMapping: { visibleBlocks: Array<{ text: string[] }> }): string[] {
  return localeMapping.visibleBlocks.flatMap((block) =>
    block.text.map((text) => text.replace(/\s+/g, " ").trim()),
  );
}

function assertEqualBlocks(locale: string, actual: string[], expected: string[]): void {
  if (actual.length !== expected.length) {
    throw new Error(
      `${locale} visible block count mismatch. Received: ${actual.length}. Expected: ${expected.length}.`,
    );
  }
  for (let index = 0; index < actual.length; index += 1) {
    if (actual[index] !== expected[index]) {
      throw new Error(
        `${locale} visible block ${index} mismatch.\nReceived: ${JSON.stringify(actual[index])}\nExpected: ${JSON.stringify(expected[index])}`,
      );
    }
  }
}

function quoteVisibleText(quote: string): string {
  const withoutAnchor = quote.replace(/<a href="[^"]*">([^<]*)<\/a>/g, "$1");
  const withoutMarkdownLink = withoutAnchor.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  return withoutMarkdownLink.replaceAll("**", "").replace(/\s+/g, " ").trim();
}

function countOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) {
    throw new Error("Reference quote collapsed to an empty string.");
  }
  let count = 0;
  let fromIndex = 0;
  while (fromIndex <= haystack.length) {
    const foundIndex = haystack.indexOf(needle, fromIndex);
    if (foundIndex < 0) {
      return count;
    }
    count += 1;
    fromIndex = foundIndex + needle.length;
  }
  return count;
}

function assertReferences(
  locale: string,
  hrefs: string[],
  visible: string,
): Array<Record<string, unknown>> {
  const handoffName =
    locale === "en" ? "public-blog-handoff-en.json" : "public-blog-handoff-zh.json";
  const handoffPath = new URL(`../handoffs/${handoffName}`, import.meta.url);
  const handoff = JSON.parse(readFileSync(handoffPath, "utf8"));
  const references = handoff.publicReferences;
  if (!Array.isArray(references) || references.length !== 21) {
    throw new Error(`${locale} publicReferences length must be 21. Received: ${references?.length}.`);
  }
  return references.map((reference) => {
    const url = reference.url;
    const appliesTo = reference.appliesTo;
    if (typeof url !== "string" || url.length === 0) {
      throw new Error(`${locale} reference ${reference.id} is missing url.`);
    }
    if (!hrefs.includes(url)) {
      throw new Error(`${locale} rendered hrefs are missing reference url ${url}.`);
    }
    const visibleQuote = quoteVisibleText(appliesTo.quote);
    const occurrenceCount = countOccurrences(visible, visibleQuote);
    if (occurrenceCount < appliesTo.occurrence) {
      throw new Error(
        `${locale} reference ${reference.id} visible quote count is ${occurrenceCount}, below occurrence ${appliesTo.occurrence}. Quote: ${JSON.stringify(visibleQuote)}.`,
      );
    }
    return {
      id: reference.id,
      url,
      occurrence: appliesTo.occurrence,
      visibleQuoteCount: occurrenceCount,
    };
  });
}

function compareLocale(
  locale: string,
  article: () => ReturnType<typeof createElement>,
  localeMapping: { visibleBlocks: Array<{ text: string[] }>; figures: unknown },
): Record<string, unknown> {
  const markup = renderToStaticMarkup(createElement(article));
  const actual = renderedBlocks(markup);
  const expected = expectedBlocks(localeMapping);
  assertEqualBlocks(locale, actual, expected);
  const hrefs = [...markup.matchAll(/href="([^"]*)"/g)].map((match) => decodeHtml(match[1]));
  if (hrefs.length !== 25) {
    throw new Error(`${locale} href count must be 25. Received: ${hrefs.length}.`);
  }
  const lazyCount = markup.match(/loading="lazy"/g)?.length ?? 0;
  if (lazyCount !== 2) {
    throw new Error(`${locale} lazy image count must be 2. Received: ${lazyCount}.`);
  }
  const references = assertReferences(locale, hrefs, actual.join("\n"));
  return {
    locale,
    visibleBlockCount: actual.length,
    hrefs,
    lazyImageCount: lazyCount,
    references,
  };
}

const englishArticle = await loadArticle("how-to-harvest-stardew-valley.en.tsx");
const chineseArticle = await loadArticle("how-to-harvest-stardew-valley.zh.tsx");
const report = {
  english: compareLocale("en", englishArticle, expectation.english),
  chinese: compareLocale("zh-CN", chineseArticle, expectation.chinese),
};

const reportPath = new URL("./visible-body-comparison.json", import.meta.url);
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log("visible body comparison passed");
console.log(`en blocks ${report.english.visibleBlockCount} hrefs ${report.english.hrefs.length}`);
console.log(`zh blocks ${report.chinese.visibleBlockCount} hrefs ${report.chinese.hrefs.length}`);
