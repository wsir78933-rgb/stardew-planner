import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const implementationDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(implementationDirectory, "../../../../../../");
const beforeDirectory = path.join(implementationDirectory, "before");
const historicalComparisonPath = path.join(
  workspaceRoot,
  "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/assembly-g/visible-body-comparison.json",
);

const locales = [
  {
    id: "en",
    sourceName: "how-to-harvest-stardew-valley.en.tsx",
    beforeSourceName: "how-to-harvest-stardew-valley.en.tsx.txt",
    beforeSsrName: "en-ssr.html",
    exportName: "HowToHarvestStardewValleyEnglishArticle",
    faqHeading: "How to Harvest Stardew Valley FAQ",
  },
  {
    id: "zh-CN",
    sourceName: "how-to-harvest-stardew-valley.zh.tsx",
    beforeSourceName: "how-to-harvest-stardew-valley.zh.tsx.txt",
    beforeSsrName: "zh-ssr.html",
    exportName: "HowToHarvestStardewValleyChineseArticle",
    faqHeading: "星露谷物语收作物常见问题",
  },
];

const addedImportLines = [
  'import { BlogFaqList } from "../../components/blog/blog-faq-list";\n',
  'import { BlogSources } from "../../components/blog/blog-sources";\n',
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function firstMismatch(actual, expected) {
  const length = Math.min(actual.length, expected.length);
  for (let index = 0; index < length; index += 1) {
    if (actual[index] !== expected[index]) {
      return index;
    }
  }
  return length;
}

function snippet(value, index) {
  const start = Math.max(0, index - 80);
  const end = Math.min(value.length, index + 80);
  return JSON.stringify(value.slice(start, end));
}

function assertSameText(label, actual, expected) {
  if (actual === expected) {
    return;
  }
  const index = firstMismatch(actual, expected);
  throw new Error(
    `${label} mismatch at index ${index}. Actual length ${actual.length}. Expected length ${expected.length}. Actual snippet: ${snippet(actual, index)}. Expected snippet: ${snippet(expected, index)}.`,
  );
}

function stripAddedImports(source, sourceName) {
  let stripped = source;
  for (const importLine of addedImportLines) {
    const occurrenceCount = stripped.split(importLine).length - 1;
    if (occurrenceCount !== 1) {
      throw new Error(
        `${sourceName} import occurrence count is ${occurrenceCount}. Expected 1. Import: ${JSON.stringify(importLine)}.`,
      );
    }
    stripped = stripped.replace(importLine, "");
  }
  return stripped;
}

function stripSourceFooter(source, locale) {
  const strippedImports = stripAddedImports(source, locale.sourceName);
  const footerStart = `      <h2>${locale.faqHeading}</h2>\n`;
  const articleClose = "    </article>\n";
  const start = strippedImports.indexOf(footerStart);
  const end = strippedImports.lastIndexOf(articleClose);
  if (start < 0) {
    throw new Error(`${locale.id} source is missing FAQ heading ${JSON.stringify(locale.faqHeading)}.`);
  }
  if (end < start) {
    throw new Error(`${locale.id} article close is before the FAQ heading.`);
  }
  if (strippedImports.indexOf(footerStart, start + footerStart.length) !== -1) {
    throw new Error(`${locale.id} source has more than one FAQ heading.`);
  }
  return strippedImports.slice(0, start) + strippedImports.slice(end);
}

function stripRenderedFooter(markup, locale) {
  const footerStart = `<h2>${locale.faqHeading}</h2>`;
  const articleClose = "</article>";
  const start = markup.indexOf(footerStart);
  const end = markup.lastIndexOf(articleClose);
  if (start < 0) {
    throw new Error(`${locale.id} SSR is missing FAQ heading ${JSON.stringify(locale.faqHeading)}.`);
  }
  if (end < start) {
    throw new Error(`${locale.id} SSR article close is before the FAQ heading.`);
  }
  const footer = markup.slice(start, end);
  if (!footer.includes('class="blog-faq-list"')) {
    throw new Error(`${locale.id} footer is missing BlogFaqList.`);
  }
  if ((footer.match(/class="blog-faq-list"/g) ?? []).length !== 1) {
    throw new Error(`${locale.id} footer BlogFaqList count is not 1.`);
  }
  if ((footer.match(/class="blog-faq-trigger"/g) ?? []).length !== 5) {
    throw new Error(`${locale.id} footer FAQ trigger count is not 5.`);
  }
  if ((footer.match(/data-blog-planner-cta="true"/g) ?? []).length !== 1) {
    throw new Error(`${locale.id} footer CTA count is not 1.`);
  }
  if (!footer.includes('class="blog-sources"')) {
    throw new Error(`${locale.id} footer is missing Sources.`);
  }
  return markup.slice(0, start) + markup.slice(end);
}

const elementPattern = /<(p|h2|h3|li|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/g;

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function visibleText(htmlFragment) {
  return decodeHtml(htmlFragment.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

function renderedBlocks(markup) {
  const blocks = [];
  for (const match of markup.matchAll(elementPattern)) {
    blocks.push(visibleText(match[2]));
  }
  return blocks;
}

const historicalComparisonBefore = sha256(readFileSync(historicalComparisonPath));
const results = [];

for (const locale of locales) {
  const currentSourcePath = path.join(workspaceRoot, "src/blog/articles", locale.sourceName);
  const beforeSource = readFileSync(path.join(beforeDirectory, locale.beforeSourceName), "utf8");
  const currentSource = readFileSync(currentSourcePath, "utf8");
  const strippedSource = stripSourceFooter(currentSource, locale);
  assertSameText(`${locale.id} source without footer`, strippedSource, beforeSource);

  const articleModule = await import(pathToFileURL(currentSourcePath).href);
  const article = articleModule[locale.exportName];
  if (typeof article !== "function") {
    throw new Error(
      `${locale.id} export ${locale.exportName} is missing. Received keys: ${Object.keys(articleModule).join(", ")}.`,
    );
  }
  const currentMarkup = renderToStaticMarkup(createElement(article));
  const beforeMarkup = readFileSync(path.join(beforeDirectory, locale.beforeSsrName), "utf8");
  const strippedMarkup = stripRenderedFooter(currentMarkup, locale);
  assertSameText(`${locale.id} SSR without footer`, strippedMarkup, beforeMarkup);

  const hrefs = [...strippedMarkup.matchAll(/href="([^"]*)"/g)].map((match) => decodeHtml(match[1]));
  if (hrefs.length !== 25) {
    throw new Error(`${locale.id} stripped href count must be 25. Received: ${hrefs.length}.`);
  }
  const lazyCount = strippedMarkup.match(/loading="lazy"/g)?.length ?? 0;
  if (lazyCount !== 2) {
    throw new Error(`${locale.id} stripped lazy image count must be 2. Received: ${lazyCount}.`);
  }
  const currentHrefCount = currentMarkup.match(/href="/g)?.length ?? 0;
  if (currentHrefCount !== 30) {
    throw new Error(`${locale.id} current href count must be 30. Received: ${currentHrefCount}.`);
  }

  results.push({
    locale: locale.id,
    sourceUnchangedAfterFooterRemoval: true,
    ssrUnchangedAfterFooterRemoval: true,
    strippedVisibleBlockCount: renderedBlocks(strippedMarkup).length,
    strippedHrefCount: hrefs.length,
    strippedLazyImageCount: lazyCount,
    currentHrefCount,
    beforeSourceSha256: sha256(beforeSource),
    strippedSourceSha256: sha256(strippedSource),
  });
}

const historicalComparisonAfter = sha256(readFileSync(historicalComparisonPath));
if (historicalComparisonAfter !== historicalComparisonBefore) {
  throw new Error(
    `assembly-g visible-body-comparison.json changed. Before: ${historicalComparisonBefore}. After: ${historicalComparisonAfter}.`,
  );
}

const report = {
  historicalAssemblyComparisonSha256: historicalComparisonAfter,
  results,
};
const reportPath = path.join(implementationDirectory, "locked-body-comparison.json");
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log("locked body comparison passed");
console.log(JSON.stringify(report, null, 2));
