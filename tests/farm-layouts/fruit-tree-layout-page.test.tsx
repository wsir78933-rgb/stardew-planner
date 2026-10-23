import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { getFruitTreeLayoutPageCopy } from "../../src/farm-layouts/fruit-tree-layout-content";
import { FruitTreeLayoutPage } from "../../src/farm-layouts/fruit-tree-layout-page";
import type { PublicLocale } from "../../src/i18n/public-locale";

const expectedFruitTreeCaseIds = [
  "01-greenhouse-18-optimal-wiki",
  "02-outdoor-orchard-3x3-grid",
  "03-greenhouse-two-of-each",
  "04-outdoor-seasonal-fruit-rows",
  "05-mature-orchard-path-packed",
  "06-orchard-beehive-gaps",
  "07-farmhouse-adjacent-fruit-border",
] as const;
const expectedPageSectionMarkers = [
  'id="fruit-tree-layout-what-is"',
  'id="fruit-tree-layout-cases"',
  'id="fruit-tree-layout-how-to-heading"',
  'id="fruit-tree-layout-faq"',
  'id="fruit-tree-layout-cta"',
] as const;

test.each(["en", "zh-CN"] as const)(
  "renders the selected cover, seven project downloads, and all page sections in %s",
  (locale: PublicLocale) => {
    const pageCopy = getFruitTreeLayoutPageCopy(locale);
    const markup = renderToStaticMarkup(<FruitTreeLayoutPage locale={locale} />);

    expect(markup).toContain('data-fruit-tree-layout-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup).toContain(`>${pageCopy.title}</h1>`);
    expect(markup.match(/<h1(?:\s|>)/gu) ?? []).toHaveLength(1);
    expect(markup).toContain('data-fruit-tree-layout-cover="true"');
    expect(markup).toContain(`src="${pageCopy.cover.imageSrc}"`);
    expect(markup).toContain(`src="${pageCopy.cover.imageOriginalSrc}"`);
    expect(markup.match(/data-fruit-tree-layout-case=/gu) ?? []).toHaveLength(7);
    expect(markup.match(/download=""/gu) ?? []).toHaveLength(7);
    expect(markup.match(/type="image\/avif"/gu) ?? []).toHaveLength(8);

    let previousSectionMarkerIndex = markup.indexOf(
      'id="fruit-tree-layout-page-title"',
    );
    expect(previousSectionMarkerIndex).toBeGreaterThanOrEqual(0);
    for (const sectionMarker of expectedPageSectionMarkers) {
      const sectionMarkerIndex = markup.indexOf(sectionMarker);
      expect(sectionMarkerIndex).toBeGreaterThan(previousSectionMarkerIndex);
      previousSectionMarkerIndex = sectionMarkerIndex;
    }

    let previousCaseMarkerIndex = markup.indexOf(
      'id="fruit-tree-layout-cases"',
    );
    for (const [caseIndex, layoutCase] of pageCopy.cases.entries()) {
      const expectedCaseId = expectedFruitTreeCaseIds[caseIndex];
      if (expectedCaseId === undefined) {
        throw new Error(
          `Unexpected Fruit Tree Layout case at index ${caseIndex}; received ${JSON.stringify(layoutCase.id)}.`,
        );
      }

      expect(layoutCase.id).toBe(expectedCaseId);
      const caseMarker = `data-fruit-tree-layout-case="${layoutCase.id}"`;
      const caseMarkerIndex = markup.indexOf(caseMarker);
      expect(caseMarkerIndex).toBeGreaterThan(previousCaseMarkerIndex);
      previousCaseMarkerIndex = caseMarkerIndex;
      expect(markup).toContain(`id="${layoutCase.id}"`);
      expect(markup).toContain(
        `download="" href="${layoutCase.projectHref}"`,
      );
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(markup).toContain(layoutCase.title);
      expect(markup).toContain(layoutCase.summary);
    }

    expect(markup).toContain(pageCopy.whatIsHeading);
    expect(markup).toContain(pageCopy.casesHeading);
    expect(markup).toContain(pageCopy.howToHeading);
    expect(markup).toContain(pageCopy.faqHeading);
    expect(markup).toContain(pageCopy.ctaHeading);
    expect(markup).toContain(
      locale === "zh-CN" ? 'href="/zh#planner"' : 'href="/#planner"',
    );
  },
);
