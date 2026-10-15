import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const implementationDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(implementationDirectory, "../../../../../../");

const locales = [
  {
    id: "en",
    sourceName: "how-to-harvest-stardew-valley.en.tsx",
    exportName: "HowToHarvestStardewValleyEnglishArticle",
    faqHeading: "How to Harvest Stardew Valley FAQ",
    sourcesHeading: "Sources",
    plannerHref: "/#planner",
    labels: [
      "Crops on the Stardew Valley Wiki",
      "Controls on the Stardew Valley Wiki",
      "Scythe on the Stardew Valley Wiki",
      "Iridium Scythe on the Stardew Valley Wiki",
    ],
  },
  {
    id: "zh-CN",
    sourceName: "how-to-harvest-stardew-valley.zh.tsx",
    exportName: "HowToHarvestStardewValleyChineseArticle",
    faqHeading: "星露谷物语收作物常见问题",
    sourcesHeading: "来源",
    plannerHref: "/zh#planner",
    labels: [
      "星露谷物语维基：作物",
      "星露谷物语维基：操作",
      "星露谷物语维基：镰刀",
      "星露谷物语维基：铱镰刀",
    ],
  },
];

const sourceHrefs = [
  "https://stardewvalleywiki.com/index.php?title=Crops&amp;oldid=193979",
  "https://stardewvalleywiki.com/index.php?title=Controls&amp;oldid=192481",
  "https://stardewvalleywiki.com/index.php?title=Scythe&amp;oldid=171696",
  "https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&amp;oldid=186836",
];

function requireIncludes(label, markup, expected) {
  if (!markup.includes(expected)) {
    throw new Error(`${label} is missing ${JSON.stringify(expected)}.`);
  }
}

for (const locale of locales) {
  const articlePath = path.join(workspaceRoot, "src/blog/articles", locale.sourceName);
  const articleModule = await import(pathToFileURL(articlePath).href);
  const article = articleModule[locale.exportName];
  if (typeof article !== "function") {
    throw new Error(`${locale.id} export ${locale.exportName} is missing.`);
  }
  const markup = renderToStaticMarkup(createElement(article));
  const sourceStart = markup.indexOf('<section class="blog-sources">');
  const sourceEnd = markup.indexOf("</section>", sourceStart);
  if (sourceStart < 0 || sourceEnd < 0) {
    throw new Error(`${locale.id} Sources section is missing.`);
  }
  const sourceSection = markup.slice(sourceStart, sourceEnd + "</section>".length);
  const sourceAnchors = sourceSection.match(/<a href=/g) ?? [];
  if (sourceAnchors.length !== 4) {
    throw new Error(`${locale.id} source anchor count must be 4. Received: ${sourceAnchors.length}.`);
  }
  let previousPosition = -1;
  for (const href of sourceHrefs) {
    const position = sourceSection.indexOf(`href="${href}"`);
    if (position <= previousPosition) {
      throw new Error(`${locale.id} source order failed for ${href}. Position: ${position}.`);
    }
    previousPosition = position;
  }
  for (const label of locale.labels) {
    requireIncludes(`${locale.id} source label`, sourceSection, label);
  }
  requireIncludes(locale.id, sourceSection, `<h2>${locale.sourcesHeading}</h2>`);
  if (sourceSection.includes("data-blog-planner-cta")) {
    throw new Error(`${locale.id} Sources section contains the planner CTA.`);
  }
  const ctaCount = markup.match(/data-blog-planner-cta="true"/g) ?? [];
  if (ctaCount.length !== 1) {
    throw new Error(`${locale.id} CTA count must be 1. Received: ${ctaCount.length}.`);
  }
  const ctaIndex = markup.indexOf("data-blog-planner-cta");
  const faqIndex = markup.indexOf('class="blog-faq-list"');
  if (!(faqIndex >= 0 && ctaIndex > faqIndex && sourceStart > ctaIndex)) {
    throw new Error(
      `${locale.id} footer order is not FAQ, CTA, Sources. Received faq ${faqIndex}, cta ${ctaIndex}, sources ${sourceStart}.`,
    );
  }
  requireIncludes(locale.id, markup, `href="${locale.plannerHref}"`);
  requireIncludes(locale.id, markup, `<h2>${locale.faqHeading}</h2>`);
  const triggers = markup.match(/<button[^>]*class="blog-faq-trigger"/g) ?? [];
  if (triggers.length !== 5) {
    throw new Error(`${locale.id} FAQ button count must be 5. Received: ${triggers.length}.`);
  }
  if (markup.includes("FAQPage") || markup.includes("QAPage")) {
    throw new Error(`${locale.id} article markup contains FAQPage or QAPage.`);
  }
  if (markup.includes("Fiber_Seeds")) {
    const footerStart = markup.indexOf(`<h2>${locale.faqHeading}</h2>`);
    if (markup.slice(footerStart).includes("Fiber_Seeds")) {
      throw new Error(`${locale.id} public footer includes the Fiber Seeds URL.`);
    }
  }
  console.log(`${locale.id} footer contract passed`);
}

const historicalPath = path.join(
  workspaceRoot,
  "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/assembly-g/visible-body-comparison.json",
);
readFileSync(historicalPath);
console.log("harvest footer verification passed");
