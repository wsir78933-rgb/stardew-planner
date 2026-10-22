import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import {
  getIridiumSprinklerLayoutPageCopy,
} from "../../src/farm-layouts/iridium-sprinkler-layout-content";
import { IridiumSprinklerLayoutPage } from "../../src/farm-layouts/iridium-sprinkler-layout-page";
import type { PublicLocale } from "../../src/i18n/public-locale";

const expectedIridiumSprinklerCaseIds = [
  "01-iridium-5x5-grid",
  "02-iridium-farm-patches-paths-scarecrows",
  "03-scarecrow-radius-iridium",
  "04-greenhouse-6-iridium-116",
  "05-greenhouse-4-iridium-pressure-118",
  "06-iridium-pressure-7x7-outdoor",
  "07-junimo-hut-iridium-5x5",
] as const;
const expectedPageSectionMarkers = [
  'id="iridium-sprinkler-layout-what-is"',
  'id="iridium-sprinkler-layout-cases"',
  'id="iridium-sprinkler-layout-how-to-heading"',
  'id="iridium-sprinkler-layout-faq"',
  'id="iridium-sprinkler-layout-cta"',
] as const;

test.each(["en", "zh-CN"] as const)(
  "renders the cover, seven downloadable cases, and all body sections in %s",
  (locale: PublicLocale) => {
    const pageCopy = getIridiumSprinklerLayoutPageCopy(locale);
    const markup = renderToStaticMarkup(
      <IridiumSprinklerLayoutPage locale={locale} />,
    );

    expect(markup).toContain('data-iridium-sprinkler-layout-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup).toContain(`>${pageCopy.title}</h1>`);
    expect(markup.match(/<h1(?:\s|>)/g) ?? []).toHaveLength(1);
    expect(markup).toContain('data-iridium-sprinkler-layout-cover="true"');
    expect(markup).toContain(`src="${pageCopy.cover.imageSrc}"`);
    expect(markup).toContain(`src="${pageCopy.cover.imageOriginalSrc}"`);
    expect(markup.match(/data-iridium-sprinkler-layout-case=/g) ?? []).toHaveLength(7);
    expect(markup.match(/download=""/g) ?? []).toHaveLength(7);
    expect(markup.match(/type="image\/avif"/g) ?? []).toHaveLength(8);

    let previousMarkerIndex = markup.indexOf(
      'id="iridium-sprinkler-layout-page-title"',
    );
    expect(previousMarkerIndex).toBeGreaterThanOrEqual(0);
    for (const sectionMarker of expectedPageSectionMarkers) {
      const sectionMarkerIndex = markup.indexOf(sectionMarker);
      expect(sectionMarkerIndex).toBeGreaterThan(previousMarkerIndex);
      previousMarkerIndex = sectionMarkerIndex;
    }

    let previousCaseIndex = markup.indexOf(
      'id="iridium-sprinkler-layout-cases"',
    );
    for (const [caseIndex, layoutCase] of pageCopy.cases.entries()) {
      const expectedCaseId = expectedIridiumSprinklerCaseIds[caseIndex];
      if (expectedCaseId === undefined) {
        throw new Error(
          `Unexpected Iridium layout case at index ${caseIndex}; received ${JSON.stringify(layoutCase.id)}.`,
        );
      }

      expect(layoutCase.id).toBe(expectedCaseId);
      const caseMarker = `data-iridium-sprinkler-layout-case="${layoutCase.id}"`;
      const caseMarkerIndex = markup.indexOf(caseMarker);
      expect(caseMarkerIndex).toBeGreaterThan(previousCaseIndex);
      previousCaseIndex = caseMarkerIndex;
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
    expect(markup).toContain(locale === "zh-CN" ? "/zh#planner" : "/#planner");
  },
);
