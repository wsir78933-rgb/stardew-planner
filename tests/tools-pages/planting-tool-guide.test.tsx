import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import {
  getPlantingToolGuideCopy,
  type PlantingToolGuideId,
} from "../../src/i18n/planting-tool-guide-copy";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { PlantingToolGuide } from "../../src/tools-pages/planting-tool-guide";
import { getPlantingToolGuideMedia } from "../../src/tools-pages/planting-tool-media";

const plantingGuideCases = [
  { locale: "en", tool: "crop-profit" },
  { locale: "en", tool: "crop-growth" },
  { locale: "zh-CN", tool: "crop-profit" },
  { locale: "zh-CN", tool: "crop-growth" },
] as const satisfies readonly Readonly<{
  locale: PublicLocale;
  tool: PlantingToolGuideId;
}>[];

const expectedCompetitorHrefsByTool: Readonly<Record<PlantingToolGuideId, readonly string[]>> = {
  "crop-profit": [
    "https://thorinair.github.io/Stardew-Profits/",
    "https://www.stardewprofit.com/calculator",
  ],
  "crop-growth": [
    "https://themonstrousdev.github.io/sdv_crop_planner/v3/",
    "https://stardewvalleywiki.com/Crop_Growth_Calendars",
  ],
};

function escapeHtmlText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertGuideHeading(markup: string, headingId: string, title: string): void {
  expect(markup).toContain(`aria-labelledby="${headingId}"`);
  expect(markup).toMatch(
    new RegExp(`<h2\\b(?=[^>]*\\bid="${escapeRegExp(headingId)}")[^>]*>${escapeRegExp(escapeHtmlText(title))}</h2>`),
  );
}

function extractMarkupOrThrow(markup: string, pattern: RegExp, label: string): string {
  const matchedMarkup = markup.match(pattern);

  if (matchedMarkup === null) {
    throw new Error(`Expected rendered planting guide to contain ${label}.`);
  }

  return matchedMarkup[0];
}

function expectedCurrentToolHref(locale: PublicLocale, tool: PlantingToolGuideId): string {
  const localizedToolsPath = locale === "en" ? "/tools" : "/zh/tools";

  return `${localizedToolsPath}/${tool}`;
}

function assertTextFollows(markup: string, earlierText: string, laterText: string): void {
  const earlierIndex = markup.indexOf(escapeHtmlText(earlierText));
  const laterIndex = markup.indexOf(escapeHtmlText(laterText));

  if (earlierIndex < 0) {
    throw new Error(`Expected planting guide markup to contain ${JSON.stringify(earlierText)}.`);
  }

  if (laterIndex < 0) {
    throw new Error(`Expected planting guide markup to contain ${JSON.stringify(laterText)}.`);
  }

  expect(laterIndex).toBeGreaterThan(earlierIndex);
}

it.each(plantingGuideCases)(
  "renders the seven approved guide modules for $tool in $locale",
  ({ locale, tool }) => {
    const copy = getPlantingToolGuideCopy(locale, tool);
    const media = getPlantingToolGuideMedia(locale, tool);
    const markup = renderToStaticMarkup(
      <PlantingToolGuide currentTool={tool} locale={locale} />,
    );

    expect(markup.match(/<h1\b/g) ?? []).toHaveLength(0);
    expect(markup.match(/<h2\b/g) ?? []).toHaveLength(11);
    expect(markup.match(/<h3\b/g) ?? []).toHaveLength(12);
    expect(markup.match(/<section\b/g) ?? []).toHaveLength(5);
    expect(markup.match(/<article\b/g) ?? []).toHaveLength(5);
    expect(copy.overview.paragraphs).toHaveLength(3);
    expect(copy.features.items).toHaveLength(5);
    expect(copy.featureIntro.items).toHaveLength(4);
    expect(copy.howToUse.steps).toHaveLength(3);
    expect(copy.whyChoose.items).toHaveLength(5);
    expect(copy.comparison.products).toHaveLength(3);
    expect(copy.comparison.rows).toHaveLength(6);
    expect(copy.faq.items).toHaveLength(7);

    assertGuideHeading(markup, `${tool}-guide-overview`, copy.overview.title);
    assertGuideHeading(markup, `${tool}-guide-feature-intro`, copy.featureIntro.title);
    assertGuideHeading(markup, `${tool}-guide-why-choose`, copy.whyChoose.title);
    assertGuideHeading(markup, `${tool}-guide-comparison`, copy.comparison.title);
    expect(markup).not.toContain(escapeHtmlText(copy.features.eyebrow));
    expect(markup).not.toContain(escapeHtmlText(copy.features.title));
    expect(markup).not.toContain(copy.comparison.checkedOn);
    expect(markup).not.toContain(escapeHtmlText(copy.comparison.affiliation));
    expect(markup).not.toContain("<time");

    const approvedVisibleText = [
      copy.overview.eyebrow,
      copy.overview.title,
      copy.overview.aside,
      ...copy.overview.paragraphs,
      ...copy.features.items.flatMap((feature) => [feature.eyebrow, feature.number, feature.title, feature.body]),
      copy.featureIntro.eyebrow,
      copy.featureIntro.title,
      copy.featureIntro.description,
      ...copy.featureIntro.items.flatMap((item) => [item.title, item.body]),
      copy.howToUse.eyebrow,
      copy.howToUse.title,
      copy.howToUse.actionLabel,
      ...copy.howToUse.steps.flatMap((step) => [step.number, step.title, step.body]),
      copy.whyChoose.eyebrow,
      copy.whyChoose.title,
      copy.whyChoose.description,
      ...copy.whyChoose.items.flatMap((item) => [item.number, item.title, item.body]),
      copy.comparison.eyebrow,
      copy.comparison.title,
      copy.comparison.description,
      copy.comparison.cornerLabel,
      ...copy.comparison.products.map((product) => product.name),
      ...copy.comparison.rows.flatMap((row) => [row.label, ...row.values]),
      copy.faq.eyebrow,
      copy.faq.title,
      copy.faq.description,
      ...copy.faq.items.flatMap((item) => [item.question, item.answer]),
    ].join("\n");

    for (const source of copy.comparison.sources) {
      if (!approvedVisibleText.includes(source.label)) {
        expect(markup).not.toContain(escapeHtmlText(source.label));
      }
    }

    assertTextFollows(markup, copy.overview.title, copy.features.items[0].title);
    assertTextFollows(markup, copy.features.items[0].title, copy.features.items[4].title);
    assertTextFollows(markup, copy.features.items[4].title, copy.featureIntro.title);
    assertTextFollows(markup, copy.featureIntro.title, copy.howToUse.title);
    assertTextFollows(markup, copy.howToUse.title, copy.whyChoose.title);
    assertTextFollows(markup, copy.whyChoose.title, copy.comparison.title);
    assertTextFollows(markup, copy.comparison.title, copy.faq.title);

    expect(markup).toContain(escapeHtmlText(copy.overview.eyebrow));
    expect(markup).toContain(escapeHtmlText(copy.overview.aside));
    for (const paragraph of copy.overview.paragraphs) {
      expect(markup).toContain(escapeHtmlText(paragraph));
    }

    const featureArticles = markup.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
    expect(featureArticles).toHaveLength(5);
    const mediaSides = [...markup.matchAll(/data-feature-media="(start|end)"/g)].map((match) => match[1]);
    expect(mediaSides).toEqual(["end", "start", "end", "start", "end"]);

    for (const [featureIndex, feature] of copy.features.items.entries()) {
      const featureArticle = featureArticles[featureIndex];
      const featureMedia = media[featureIndex];
      const titleIndex = featureArticle.indexOf(escapeHtmlText(feature.title));
      const pictureIndex = featureArticle.indexOf("<picture");

      expect(featureArticle).toContain(`id="${tool}-guide-feature-${featureIndex + 1}"`);
      expect(featureArticle).toContain(escapeHtmlText(feature.number));
      expect(featureArticle).toContain(escapeHtmlText(feature.eyebrow));
      expect(featureArticle).toContain(escapeHtmlText(feature.body));
      expect(titleIndex).toBeGreaterThan(-1);
      expect(pictureIndex).toBeGreaterThan(titleIndex);
      expect(featureArticle).toContain(`media="(max-width: 700px)"`);
      expect(featureArticle).toContain(`srcSet="${featureMedia.mobile.src}"`);
      expect(featureArticle).toContain(`src="${featureMedia.desktop.src}"`);
      expect(featureArticle).toContain(`width="${featureMedia.desktop.width}"`);
      expect(featureArticle).toContain(`height="${featureMedia.desktop.height}"`);
      expect(featureArticle).toContain(`width="${featureMedia.mobile.width}"`);
      expect(featureArticle).toContain(`height="${featureMedia.mobile.height}"`);
      expect(featureArticle).toContain('alt=""');
      expect(featureArticle).toContain('loading="lazy"');
    }

    expect(markup).toContain(escapeHtmlText(copy.featureIntro.eyebrow));
    expect(markup).toContain(escapeHtmlText(copy.featureIntro.description));
    for (const introItem of copy.featureIntro.items) {
      expect(markup).toMatch(
        new RegExp(`<h3\\b[^>]*>${escapeRegExp(escapeHtmlText(introItem.title))}</h3>`),
      );
      expect(markup).toContain(escapeHtmlText(introItem.body));
    }

    expect(markup).toContain(escapeHtmlText(copy.howToUse.eyebrow));
    expect(markup).toContain(escapeHtmlText(copy.howToUse.actionLabel));
    const orderedStepsMarkup = extractMarkupOrThrow(
      markup,
      /<ol\b[^>]*>[\s\S]*?<\/ol>/,
      "the How It Works ordered list",
    );
    expect(orderedStepsMarkup.match(/<li\b/g) ?? []).toHaveLength(3);
    for (const step of copy.howToUse.steps) {
      expect(orderedStepsMarkup).toContain(escapeHtmlText(step.number));
      expect(orderedStepsMarkup).toContain(escapeHtmlText(step.title));
      expect(orderedStepsMarkup).toContain(escapeHtmlText(step.body));
    }
    expect(markup).toMatch(
      new RegExp(
        `<button\\b(?=[^>]*type="button")[^>]*>[\\s\\S]*?${escapeRegExp(escapeHtmlText(copy.howToUse.actionLabel))}[\\s\\S]*?<\\/button>`,
      ),
    );

    expect(markup).toContain(escapeHtmlText(copy.whyChoose.eyebrow));
    expect(markup).toContain(escapeHtmlText(copy.whyChoose.description));
    for (const reason of copy.whyChoose.items) {
      expect(markup).toContain(escapeHtmlText(reason.number));
      expect(markup).toMatch(
        new RegExp(`<h3\\b[^>]*>${escapeRegExp(escapeHtmlText(reason.title))}</h3>`),
      );
      expect(markup).toContain(escapeHtmlText(reason.body));
    }

    const expectedProductHrefs = [
      expectedCurrentToolHref(locale, tool),
      ...expectedCompetitorHrefsByTool[tool],
    ];
    expect(copy.comparison.products.map((product) => product.href)).toEqual(expectedProductHrefs);

    const comparisonTableMarkup = extractMarkupOrThrow(
      markup,
      /<table\b[^>]*>[\s\S]*?<\/table>/,
      "the comparison table",
    );
    const comparisonHeadersMarkup = extractMarkupOrThrow(
      comparisonTableMarkup,
      /<thead\b[^>]*>[\s\S]*?<\/thead>/,
      "the comparison table header",
    );
    expect(comparisonHeadersMarkup).toContain(escapeHtmlText(copy.comparison.cornerLabel));
    expect(comparisonHeadersMarkup.match(/<th\b(?=[^>]*scope="col")[^>]*>/g) ?? []).toHaveLength(4);
    expect(markup).toContain(escapeHtmlText(copy.comparison.eyebrow));
    expect(markup).toContain(escapeHtmlText(copy.comparison.description));
    expect(markup.match(/role="region"/g) ?? []).toHaveLength(1);

    for (const [productIndex, product] of copy.comparison.products.entries()) {
      const currentAttribute = productIndex === 0 ? '(?=[^>]*aria-current="page")' : '(?![^>]*aria-current)';
      expect(comparisonHeadersMarkup).toMatch(
        new RegExp(
          `<a\\b${currentAttribute}(?=[^>]*href="${escapeRegExp(product.href)}")[^>]*>${escapeRegExp(escapeHtmlText(product.name))}</a>`,
        ),
      );
    }

    const comparisonBodyMarkup = extractMarkupOrThrow(
      comparisonTableMarkup,
      /<tbody\b[^>]*>[\s\S]*?<\/tbody>/,
      "the comparison table body",
    );
    const renderedComparisonRows = [...comparisonBodyMarkup.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)];
    expect(renderedComparisonRows).toHaveLength(6);

    for (const [rowIndex, row] of copy.comparison.rows.entries()) {
      expect(row.values).toHaveLength(3);

      const renderedRow = renderedComparisonRows[rowIndex][1];
      expect(renderedRow).toMatch(
        new RegExp(
          `<th\\b(?=[^>]*scope="row")[^>]*>${escapeRegExp(escapeHtmlText(row.label))}</th>`,
        ),
      );
      expect(renderedRow.match(/<td\b/g) ?? []).toHaveLength(3);
      for (const comparisonValue of row.values) {
        expect(renderedRow).toContain(escapeHtmlText(comparisonValue));
      }
    }

    expect(markup).toContain(escapeHtmlText(copy.faq.eyebrow));
    expect(markup).toContain(escapeHtmlText(copy.faq.title));
    expect(markup).toContain(escapeHtmlText(copy.faq.description));
    expect(markup.match(/aria-expanded="false"/g) ?? []).toHaveLength(7);

    for (const faqItem of copy.faq.items) {
      const faqButtonMatch = markup.match(
        new RegExp(
          `<button\\b(?=[^>]*aria-expanded="false")(?=[^>]*aria-controls="([^"]+)")[^>]*>[\\s\\S]*?${escapeRegExp(escapeHtmlText(faqItem.question))}[\\s\\S]*?<\\/button>`,
        ),
      );

      if (faqButtonMatch === null) {
        throw new Error(`Expected FAQ question button ${JSON.stringify(faqItem.question)}.`);
      }

      const answerId = faqButtonMatch[1];
      expect(markup).toMatch(
        new RegExp(
          `<p\\b(?=[^>]*\\bid="${escapeRegExp(answerId)}")(?=[^>]*aria-hidden="true")[^>]*>`,
        ),
      );
      expect(markup).toContain(escapeHtmlText(faqItem.answer));
    }
  },
);

it("keeps guide media frames contained and the comparison scroll inside the table", () => {
  const guideCss = readFileSync(
    new URL("../../src/tools-pages/planting-tool-guide.module.css", import.meta.url),
    "utf8",
  );
  const howCss = readFileSync(
    new URL("../../src/tools-pages/how-it-works-09.module.css", import.meta.url),
    "utf8",
  );

  expect(guideCss).toContain("aspect-ratio: 4 / 3");
  expect(guideCss).toContain("object-fit: contain");
  expect(guideCss).toContain("max-width: 700px");
  expect(guideCss).toContain("width: calc(100% * 1024 / 499)");
  expect(guideCss).toContain("overflow-x: auto");
  expect(guideCss).not.toContain("font-family");
  expect(guideCss).not.toContain("object-fit: cover");
  expect(howCss).not.toContain("uppercase");
  expect(howCss).not.toContain("font-family");
  expect(howCss.match(/overflow-x:\s*auto/g) ?? []).toHaveLength(0);
});

it("uses different localized guide content for the two tools", () => {
  const englishProfitCopy = getPlantingToolGuideCopy("en", "crop-profit");
  const englishGrowthCopy = getPlantingToolGuideCopy("en", "crop-growth");
  const chineseProfitCopy = getPlantingToolGuideCopy("zh-CN", "crop-profit");
  const chineseGrowthCopy = getPlantingToolGuideCopy("zh-CN", "crop-growth");

  expect(englishProfitCopy.overview.title).not.toBe(englishGrowthCopy.overview.title);
  expect(chineseProfitCopy.overview.title).not.toBe(chineseGrowthCopy.overview.title);
  expect(englishProfitCopy.overview.title).not.toBe(chineseProfitCopy.overview.title);
  expect(englishGrowthCopy.overview.title).not.toBe(chineseGrowthCopy.overview.title);
});

it("fails fast with the received unsupported locale", () => {
  const unsupportedLocale = "ru" as PublicLocale;

  expect(() => getPlantingToolGuideCopy(unsupportedLocale, "crop-profit")).toThrow(
    JSON.stringify(unsupportedLocale),
  );
});

it("fails fast with the received unsupported tool", () => {
  const unsupportedTool = "processing" as PlantingToolGuideId;

  expect(() => getPlantingToolGuideCopy("en", unsupportedTool)).toThrow(
    JSON.stringify(unsupportedTool),
  );
});
