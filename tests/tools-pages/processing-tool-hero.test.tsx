import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  getProcessingToolGuideCopy,
} from "../../src/i18n/processing-tool-guide-copy";
import { getProcessingToolRouteCopy } from "../../src/i18n/processing-tool-route-copy";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { CaskAgingTool } from "../../src/tools-pages/processing/cask-aging-tool";
import { KegIngredientRankingTool } from "../../src/tools-pages/processing/keg-ingredient-ranking-tool";
import { ProcessingComparisonTool } from "../../src/tools-pages/processing/processing-comparison-tool";
import { ProcessingToolFrame } from "../../src/tools-pages/processing/processing-tool-frame";
import {
  getProcessingToolHref,
  isProcessingComparisonToolId,
  PROCESSING_TOOL_IDS,
  type ProcessingToolId,
} from "../../src/tools-pages/processing/processing-tool-definition";
import { getProcessingToolGuideMedia } from "../../src/tools-pages/processing/processing-tool-media";

const processingHeroLocaleCases = ["en", "zh-CN"] as const satisfies readonly PublicLocale[];

function renderProcessingToolPage(locale: PublicLocale, toolId: ProcessingToolId): string {
  const routeCopy = getProcessingToolRouteCopy(locale, toolId);
  let workspace;

  if (isProcessingComparisonToolId(toolId)) {
    workspace = <ProcessingComparisonTool locale={locale} toolId={toolId} />;
  } else if (toolId === "keg-ingredient-ranking") {
    workspace = <KegIngredientRankingTool locale={locale} />;
  } else if (toolId === "cask-aging") {
    workspace = <CaskAgingTool locale={locale} />;
  } else {
    throw new Error(`Unsupported processing hero test tool. Received ${JSON.stringify(toolId)}.`);
  }

  return renderToStaticMarkup(
    <ProcessingToolFrame currentTool={toolId} locale={locale} title={routeCopy.title}>
      {workspace}
    </ProcessingToolFrame>,
  );
}

function readHeroHeadingText(markup: string): string {
  const headingMatch = markup.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  if (headingMatch === null) {
    throw new Error("Expected one complete processing route hero heading in rendered markup.");
  }

  return headingMatch[1]
    .replace(/<svg\b[\s\S]*?<\/svg>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function countTextOccurrences(markup: string, text: string): number {
  return markup.split(text).length - 1;
}

function escapeHtmlText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function readSectionEndIndex(
  markup: string,
  sectionStartIndex: number,
  sectionId: string,
): number {
  const sectionTags = [...markup.matchAll(/<\/?section\b[^>]*>/g)];
  const openingSection = sectionTags.find(
    (sectionTag) => sectionTag.index === sectionStartIndex,
  );

  if (openingSection === undefined || openingSection[0].startsWith("</")) {
    throw new Error(
      `Expected an opening section for ${JSON.stringify(sectionId)} at index ${sectionStartIndex}.`,
    );
  }

  let sectionDepth = 0;
  for (const sectionTag of sectionTags) {
    if (sectionTag.index === undefined || sectionTag.index < sectionStartIndex) {
      continue;
    }

    if (sectionTag[0].startsWith("</")) {
      sectionDepth -= 1;
      if (sectionDepth === 0) {
        return sectionTag.index + sectionTag[0].length;
      }
    } else {
      sectionDepth += 1;
    }
  }

  throw new Error(`Could not find the closing section for ${JSON.stringify(sectionId)}.`);
}

function readGuideMarkerIndex(markup: string, toolId: ProcessingToolId): number {
  const guideMarker = `data-processing-tool-guide="${toolId}"`;
  const guideMarkerIndex = markup.indexOf(guideMarker);

  if (guideMarkerIndex < 0) {
    throw new Error(`Expected rendered processing guide ${JSON.stringify(toolId)}.`);
  }

  return guideMarkerIndex;
}

function assertGuideSectionOrder(
  guideMarkup: string,
  locale: PublicLocale,
  toolId: ProcessingToolId,
): void {
  const copy = getProcessingToolGuideCopy(locale, toolId);
  const orderedMarkers = [
    `id="${toolId}-guide-overview"`,
    ...[1, 2, 3, 4, 5].map((featureNumber) => `id="${toolId}-guide-feature-${featureNumber}"`),
    `id="${toolId}-guide-feature-intro"`,
    escapeHtmlText(copy.howToUse.title),
    `id="${toolId}-guide-why-choose"`,
    `id="${toolId}-guide-comparison"`,
    escapeHtmlText(copy.faq.title),
    `id="${toolId}-guide-final-cta"`,
  ];
  const orderedMarkerIndexes = orderedMarkers.map((marker) => {
    const markerIndex = guideMarkup.indexOf(marker);
    if (markerIndex < 0) {
      throw new Error(
        `Processing guide ${JSON.stringify(toolId)} is missing ordered marker ${JSON.stringify(marker)}.`,
      );
    }
    return markerIndex;
  });

  for (let markerIndex = 1; markerIndex < orderedMarkerIndexes.length; markerIndex += 1) {
    expect(orderedMarkerIndexes[markerIndex]).toBeGreaterThan(
      orderedMarkerIndexes[markerIndex - 1],
    );
  }
}

function assertGuideMediaPaths(
  guideMarkup: string,
  locale: PublicLocale,
  toolId: ProcessingToolId,
): void {
  const mediaItems = getProcessingToolGuideMedia(locale, toolId);
  expect(mediaItems).toHaveLength(5);

  for (const [mediaIndex, mediaItem] of mediaItems.entries()) {
    expect(countTextOccurrences(guideMarkup, `src="${mediaItem.src}"`)).toBe(1);
    expect(guideMarkup).toContain(`id="${toolId}-guide-feature-${mediaIndex + 1}"`);
  }
}

function assertGuideComparisonAndFaq(
  guideMarkup: string,
  locale: PublicLocale,
  toolId: ProcessingToolId,
): void {
  const copy = getProcessingToolGuideCopy(locale, toolId);
  const comparisonTitleIndex = guideMarkup.indexOf(escapeHtmlText(copy.comparison.title));
  const faqTitleIndex = guideMarkup.indexOf(escapeHtmlText(copy.faq.title));
  const finalCtaIndex = guideMarkup.indexOf(`id="${toolId}-guide-final-cta"`);

  expect(comparisonTitleIndex).toBeGreaterThanOrEqual(0);
  expect(faqTitleIndex).toBeGreaterThan(comparisonTitleIndex);
  expect(finalCtaIndex).toBeGreaterThan(faqTitleIndex);

  const comparisonMarkup = guideMarkup.slice(comparisonTitleIndex, faqTitleIndex);
  expect(comparisonMarkup.match(/<th\b(?=[^>]*\bscope="col")[^>]*>/g) ?? []).toHaveLength(4);
  const tableBodyMatch = comparisonMarkup.match(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/);
  if (tableBodyMatch === null) {
    throw new Error(`Expected a comparison table body for ${JSON.stringify(toolId)}.`);
  }

  const tableRows = tableBodyMatch[1].match(/<tr\b[^>]*>[\s\S]*?<\/tr>/g) ?? [];
  expect(tableRows).toHaveLength(6);
  for (const tableRow of tableRows) {
    expect(tableRow.match(/<th\b/g) ?? []).toHaveLength(1);
    expect(tableRow.match(/<td\b/g) ?? []).toHaveLength(3);
  }

  const faqMarkup = guideMarkup.slice(faqTitleIndex, finalCtaIndex);
  expect(faqMarkup.match(/<button\b/g) ?? []).toHaveLength(7);
  for (const faqItem of copy.faq.items) {
    expect(faqMarkup).toContain(escapeHtmlText(faqItem.question));
  }
}

function assertProcessingGuideIntegration(
  markup: string,
  locale: PublicLocale,
  toolId: ProcessingToolId,
): number {
  const guideMarkerIndex = readGuideMarkerIndex(markup, toolId);
  const guideMarker = `data-processing-tool-guide="${toolId}"`;
  const guideMarkup = markup.slice(guideMarkerIndex);
  const calculatorId = `${toolId}-calculator`;
  const calculatorOpeningTag = markup.match(
    new RegExp(`<section\\b(?=[^>]*\\bid="${calculatorId}")[^>]*>`),
  );

  if (calculatorOpeningTag === null || calculatorOpeningTag.index === undefined) {
    throw new Error(`Expected calculator section ${JSON.stringify(calculatorId)}.`);
  }

  const calculatorEndIndex = readSectionEndIndex(
    markup,
    calculatorOpeningTag.index,
    calculatorId,
  );
  expect(countTextOccurrences(markup, guideMarker)).toBe(1);
  expect(guideMarkerIndex).toBeGreaterThan(calculatorEndIndex);

  const copy = getProcessingToolGuideCopy(locale, toolId);
  expect(guideMarkup).toContain(escapeHtmlText(copy.overview.title));
  expect(guideMarkup).toContain(escapeHtmlText(copy.cta.label));
  assertGuideSectionOrder(guideMarkup, locale, toolId);
  assertGuideMediaPaths(guideMarkup, locale, toolId);
  assertGuideComparisonAndFaq(guideMarkup, locale, toolId);

  return guideMarkerIndex;
}

function readWorkspaceHeadingId(toolId: ProcessingToolId): string {
  if (isProcessingComparisonToolId(toolId)) {
    return "processing-comparison-page-title";
  }
  if (toolId === "keg-ingredient-ranking") {
    return "keg-ingredient-ranking-title";
  }
  if (toolId === "cask-aging") {
    return "cask-aging-title";
  }

  throw new Error(`Unsupported processing workspace heading. Received ${JSON.stringify(toolId)}.`);
}

describe("processing tool route hero", () => {
  it.each(processingHeroLocaleCases.flatMap((locale) =>
    PROCESSING_TOOL_IDS.map((toolId) => [locale, toolId] as const),
  ))("renders one complete %s hero and guide for %s", (locale, toolId) => {
    const markup = renderProcessingToolPage(locale, toolId);
    const guideStartIndex = assertProcessingGuideIntegration(markup, locale, toolId);
    const heroAndWorkspaceMarkup = markup.slice(0, guideStartIndex);
    const routeCopy = getProcessingToolRouteCopy(locale, toolId);
    const calculatorId = `${toolId}-calculator`;
    const expectedHeading =
      locale === "en"
        ? `${routeCopy.hero.titleBefore} ${routeCopy.hero.accent} ${routeCopy.hero.titleAfter}`
        : `${routeCopy.hero.titleBefore}${routeCopy.hero.accent}${routeCopy.hero.titleAfter}`;
    const allToolsLabel = locale === "en" ? "All tools" : "全部工具";
    const rankingHref = getProcessingToolHref(locale, "keg-ingredient-ranking");
    const rankingLinkLabel =
      locale === "en" ? "View Keg ingredient ranking" : "查看 Keg 原料排行";

    expect(markup.match(/<h1\b/g) ?? []).toHaveLength(1);
    expect(markup).toContain(`id="${toolId}-hero-title"`);
    expect(readHeroHeadingText(markup)).toBe(expectedHeading);
    expect(markup).toContain(routeCopy.hero.description);
    expect(markup).toContain(routeCopy.hero.actionLabel);
    expect(markup).toContain(`href="#${calculatorId}"`);
    expect(countTextOccurrences(markup, `href="#${calculatorId}"`)).toBe(1);
    expect(countTextOccurrences(markup, `id="${calculatorId}"`)).toBe(1);
    expect(markup).toMatch(
      new RegExp(`<section\\b(?=[^>]*id="${calculatorId}")(?=[^>]*tabindex="-1")[^>]*>`),
    );
    expect(heroAndWorkspaceMarkup).not.toContain(`aria-label="${allToolsLabel}"`);
    expect(markup).toMatch(
      new RegExp(`<h2\\b(?=[^>]*id="${readWorkspaceHeadingId(toolId)}")`),
    );
    expect(heroAndWorkspaceMarkup).not.toMatch(/<nav\b/);
    expect(heroAndWorkspaceMarkup).not.toMatch(/\baria-current=/);

    if (toolId === "keg-processing") {
      const rankingLinkIndex = heroAndWorkspaceMarkup.indexOf(`href="${rankingHref}"`);
      const heroSectionEndIndex = heroAndWorkspaceMarkup.indexOf("</section>");
      const calculatorOpeningTagMatch = markup.match(
        new RegExp(`<section\\b(?=[^>]*id="${calculatorId}")[^>]*>`),
      );
      if (calculatorOpeningTagMatch === null || calculatorOpeningTagMatch.index === undefined) {
        throw new Error(`Expected calculator section for ${JSON.stringify(calculatorId)}.`);
      }
      const calculatorOpeningTagEndIndex = markup.indexOf(">", calculatorOpeningTagMatch.index);
      const workspaceHeadingIndex = markup.indexOf(
        `id="${readWorkspaceHeadingId(toolId)}"`,
      );

      expect(markup).toContain(rankingLinkLabel);
      expect(rankingLinkIndex).toBeGreaterThan(-1);
      expect(rankingLinkIndex).toBeGreaterThan(heroSectionEndIndex);
      expect(rankingLinkIndex).toBeGreaterThan(calculatorOpeningTagEndIndex);
      expect(rankingLinkIndex).toBeLessThan(workspaceHeadingIndex);
    } else {
      expect(heroAndWorkspaceMarkup).not.toContain(rankingHref);
      expect(heroAndWorkspaceMarkup).not.toContain(rankingLinkLabel);
    }
  });
});
