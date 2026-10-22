import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { getQualitySprinklerLayoutPageCopy } from "../../src/farm-layouts/quality-sprinkler-layout-content";
import { QualitySprinklerLayoutPage } from "../../src/farm-layouts/quality-sprinkler-layout-page";

const qualitySprinklerLayoutLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const qualitySprinklerLayoutCaseIds = [
  "02-quality-clean-patchwork",
  "03-scarecrow-radius-quality",
  "04-quality-simple-grid-edge-scarecrows",
  "05-quality-lines-scarecrow-gaps",
  "06-quality-pressure-5x5-outdoor",
  "07-greenhouse-16-quality-108",
] as const;
const qualitySprinklerLayoutSectionIds = [
  'id="quality-sprinkler-layout-page-title"',
  'id="quality-sprinkler-layout-what-is"',
  'id="quality-sprinkler-layout-layouts"',
  'id="quality-sprinkler-layout-how-to-heading"',
  'id="quality-sprinkler-layout-faq"',
  'id="quality-sprinkler-layout-cta"',
] as const;

function decodeQualitySprinklerLayoutMarkup(markup: string): string {
  return markup
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;|&#34;|&#x22;/gi, '"')
    .replace(/&#x2F;|&#47;/gi, "/")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

test.each(qualitySprinklerLayoutLocales)(
  "renders the Quality Sprinkler cover, six cases, and page sections in %s",
  (locale) => {
    const copy = getQualitySprinklerLayoutPageCopy(locale);
    const markup = renderToStaticMarkup(
      <QualitySprinklerLayoutPage locale={locale} />,
    );
    const visibleMarkup = decodeQualitySprinklerLayoutMarkup(markup);

    expect(markup).toContain('data-quality-sprinkler-layout-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(markup.match(/data-quality-sprinkler-layout-cover="true"/g)).toHaveLength(1);
    expect(markup.match(/data-quality-sprinkler-layout-case=/g)).toHaveLength(6);
    expect(markup.match(/data-layout-image-trigger="true"/g)).toHaveLength(7);
    expect(markup.match(/data-layout-image-dialog="true"/g)).toHaveLength(7);
    expect(markup.match(/download=""/g)).toHaveLength(6);
    expect(markup.match(/data-how-it-works-step=/g)).toHaveLength(3);
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(5);
    expect(markup).not.toContain("data-layout-image-zoom");
    expect(markup).not.toContain("<hr");

    expect(visibleMarkup).toContain(copy.title);
    expect(visibleMarkup).toContain(copy.intro);
    expect(visibleMarkup).toContain(copy.categoryLabel);
    expect(visibleMarkup).toContain(copy.cover.caption);
    expect(visibleMarkup).toContain(copy.cover.imageAlt);
    expect(markup).toContain(`src="${copy.cover.imageSrc}"`);
    expect(markup).toContain(`src="${copy.cover.imageOriginalSrc}"`);
    expect(copy.cover.imageWidth).toBe(1600);
    expect(copy.cover.imageHeight).toBe(1300);
    expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      qualitySprinklerLayoutCaseIds,
    );
    expect(copy.whatIsParagraphs).toHaveLength(2);
    expect(copy.faqs).toHaveLength(5);

    for (const layoutCase of copy.cases) {
      expect(markup).toContain(
        `data-quality-sprinkler-layout-case="${layoutCase.id}"`,
      );
      expect(markup).toContain(`download="" href="${layoutCase.projectHref}"`);
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(visibleMarkup).toContain(layoutCase.title);
      expect(visibleMarkup).toContain(layoutCase.summary);
      expect(visibleMarkup).toContain(layoutCase.imageAlt);
      expect(layoutCase.imageWidth).toBe(1600);
      expect(layoutCase.imageHeight).toBe(1300);
    }

    const expectedPlannerHref = locale === "zh-CN" ? "/zh#planner" : "/#planner";
    expect(markup).toContain(`href="${expectedPlannerHref}"`);

    let previousSectionIndex = -1;
    for (const sectionId of qualitySprinklerLayoutSectionIds) {
      const sectionIndex = markup.indexOf(sectionId);
      expect(sectionIndex).toBeGreaterThan(previousSectionIndex);
      previousSectionIndex = sectionIndex;
    }
  },
);
