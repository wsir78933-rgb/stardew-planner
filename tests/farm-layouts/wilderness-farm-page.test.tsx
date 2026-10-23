import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { getFeaturedWildernessFarmCase, getWildernessFarmPageCopy } from "../../src/farm-layouts/wilderness-farm-content";
import { WildernessFarmPage } from "../../src/farm-layouts/wilderness-farm-page";
import type { PublicLocale } from "../../src/i18n/public-locale";

const expectedWildernessCaseIds = [
  "forest-integrated-village",
  "forest-shed-courts",
  "summer-mushroom-garden",
  "circular-crop-ring",
  "stone-grid-fish-ponds",
  "fenced-shed-village",
  "autumn-symmetry",
] as const;
const expectedWildernessSectionMarkers = [
  'id="wilderness-farm-what-is"',
  'id="wilderness-farm-layouts"',
  'id="wilderness-farm-how-to-heading"',
  'id="wilderness-farm-cta"',
] as const;

function escapeHtmlText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

test.each(["en", "zh-CN"] as const)(
  "renders the selected Wilderness Farm cover, seven downloads, and page sections in %s",
  (locale: PublicLocale) => {
    const pageCopy = getWildernessFarmPageCopy(locale);
    const featuredCase = getFeaturedWildernessFarmCase(locale);
    const markup = renderToStaticMarkup(<WildernessFarmPage locale={locale} />);
    const renderedCaseIds = Array.from(
      markup.matchAll(/data-wilderness-farm-case="([^"]+)"/gu),
      ([, caseId]) => caseId,
    );

    expect(markup).toContain('data-wilderness-farm-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup).toContain(`>${escapeHtmlText(pageCopy.heading)}</h1>`);
    expect(markup.match(/<h1(?:\s|>)/gu) ?? []).toHaveLength(1);
    expect(markup.match(/data-wilderness-farm-case=/gu) ?? []).toHaveLength(7);
    expect(markup.match(/download=""/gu) ?? []).toHaveLength(7);
    expect(markup.match(/type="image\/avif"/gu) ?? []).toHaveLength(8);
    expect(renderedCaseIds).toEqual(expectedWildernessCaseIds);
    expect(featuredCase.id).toBe(expectedWildernessCaseIds[0]);
    expect(markup.indexOf(`src="${featuredCase.imageSrc}"`)).toBeLessThan(
      markup.indexOf('id="wilderness-farm-layouts"'),
    );
    expect(markup).toContain(`src="${featuredCase.imageOriginalSrc}"`);

    let previousSectionMarkerIndex = markup.indexOf(
      'id="wilderness-farm-page-title"',
    );
    expect(previousSectionMarkerIndex).toBeGreaterThanOrEqual(0);
    for (const sectionMarker of expectedWildernessSectionMarkers) {
      const sectionMarkerIndex = markup.indexOf(sectionMarker);
      expect(sectionMarkerIndex).toBeGreaterThan(previousSectionMarkerIndex);
      previousSectionMarkerIndex = sectionMarkerIndex;
    }

    let previousCaseMarkerIndex = markup.indexOf('id="wilderness-farm-layouts"');
    for (const [caseIndex, farmCase] of pageCopy.cases.entries()) {
      const expectedCaseId = expectedWildernessCaseIds[caseIndex];
      if (expectedCaseId === undefined) {
        throw new Error(
          `Unexpected Wilderness Farm case at index ${caseIndex}; received ${JSON.stringify(farmCase.id)}.`,
        );
      }
      expect(farmCase.id).toBe(expectedCaseId);
      const caseMarker = `data-wilderness-farm-case="${farmCase.id}"`;
      const caseMarkerIndex = markup.indexOf(caseMarker);
      expect(caseMarkerIndex).toBeGreaterThan(previousCaseMarkerIndex);
      previousCaseMarkerIndex = caseMarkerIndex;
      expect(markup).toContain(`id="${farmCase.id}"`);
      expect(markup).toContain(`download="" href="${farmCase.projectHref}"`);
      expect(markup).toContain(`src="${farmCase.imageSrc}"`);
      expect(markup).toContain(`src="${farmCase.imageOriginalSrc}"`);
      expect(markup).toContain(escapeHtmlText(farmCase.title));
      expect(markup).toContain(escapeHtmlText(farmCase.summary));
      expect(markup).toContain(escapeHtmlText(farmCase.imageAlt));
    }

    expect(markup).toContain(escapeHtmlText(pageCopy.whatIsHeading));
    expect(markup).toContain(escapeHtmlText(pageCopy.casesHeading));
    expect(markup).toContain(escapeHtmlText(pageCopy.howToHeading));
    expect(markup).toContain(escapeHtmlText(pageCopy.faqHeading));
    expect(markup).toContain(escapeHtmlText(pageCopy.ctaHeading));
    expect(markup).toContain(
      locale === "zh-CN" ? 'href="/zh#planner"' : 'href="/#planner"',
    );

    for (const paragraph of pageCopy.whatIsParagraphs) {
      expect(markup).toContain(escapeHtmlText(paragraph));
    }
    for (const faq of pageCopy.faqs) {
      expect(markup).toContain(escapeHtmlText(faq.question));
      expect(markup).toContain(escapeHtmlText(faq.answer));
    }
    for (const howToStep of pageCopy.howToSteps) {
      expect(markup).toContain(escapeHtmlText(howToStep.number));
      expect(markup).toContain(escapeHtmlText(howToStep.title));
      expect(markup).toContain(escapeHtmlText(howToStep.body));
    }
  },
);
