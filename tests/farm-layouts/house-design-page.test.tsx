import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import type { PublicLocale } from "../../src/i18n/public-locale";
import { getHouseDesignPageCopy } from "../../src/farm-layouts/house-design-content";
import { HouseDesignPage } from "../../src/farm-layouts/house-design-page";

const houseDesignLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const houseDesignSectionIds = [
  'id="house-design-page-title"',
  'id="house-design-what-is"',
  'id="house-design-cases"',
  'id="house-design-how-to"',
  'id="house-design-how-to-heading"',
  'id="house-design-faq"',
  'id="house-design-cta"',
] as const;

function decodeHouseDesignMarkup(markup: string): string {
  return markup
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;|&#34;|&#x22;/gi, '"')
    .replace(/&#x2F;|&#47;/gi, "/")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

test.each(houseDesignLocales)(
  "renders the House Design cover, six cases, and shared sections in %s",
  (locale) => {
    const copy = getHouseDesignPageCopy(locale);
    const markup = renderToStaticMarkup(<HouseDesignPage locale={locale} />);
    const visibleMarkup = decodeHouseDesignMarkup(markup);

    expect(markup).toContain('data-house-design-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(markup.match(/data-house-design-cover="true"/g)).toHaveLength(1);
    expect(markup.match(/data-house-design-case=/g)).toHaveLength(6);
    expect(markup.match(/data-layout-image-trigger="true"/g)).toHaveLength(7);
    expect(markup.match(/data-layout-image-dialog="true"/g)).toHaveLength(7);
    expect(markup.match(/download=""/g)).toHaveLength(6);
    expect(markup.match(/data-how-it-works-step=/g)).toHaveLength(3);
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(
      copy.faqs.length,
    );
    expect(markup).not.toContain("data-layout-image-zoom");
    expect(markup).not.toContain("<hr");

    expect(visibleMarkup).toContain(copy.title);
    expect(visibleMarkup).toContain(copy.intro);
    expect(visibleMarkup).toContain(copy.categoryLabel);
    expect(visibleMarkup).toContain(copy.cover.caption);
    expect(visibleMarkup).toContain(copy.cover.imageAlt);
    expect(copy.cover.imageWidth * 23).toBe(copy.cover.imageHeight * 35);
    expect(copy.cover.imageWidth).toBe(2240);
    expect(copy.cover.imageHeight).toBe(1472);
    expect(markup).toContain(`src="${copy.cover.imageSrc}"`);
    expect(markup).toContain(`src="${copy.cover.imageOriginalSrc}"`);
    expect(copy.cases).toHaveLength(6);

    for (const paragraph of copy.whatIsParagraphs) {
      expect(visibleMarkup).toContain(paragraph);
    }

    for (const layoutCase of copy.cases) {
      expect(markup).toContain(
        `data-house-design-case="${layoutCase.id}"`,
      );
      expect(markup).toContain(`id="house-design-${layoutCase.id}"`);
      expect(markup).toContain(
        `download="" href="${layoutCase.projectHref}"`,
      );
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(visibleMarkup).toContain(layoutCase.imageAlt);
      expect(visibleMarkup).toContain(layoutCase.title);
      expect(visibleMarkup).toContain(layoutCase.summary);
      expect(layoutCase.imageWidth).toBe(2240);
      expect(layoutCase.imageHeight).toBe(1472);
      expect(layoutCase.imageWidth * 23).toBe(layoutCase.imageHeight * 35);
    }

    const plannerHref = locale === "zh-CN" ? "/zh#planner" : "/#planner";
    expect(markup.split(`href="${plannerHref}"`)).toHaveLength(4);

    let previousSectionIndex = -1;
    for (const sectionId of houseDesignSectionIds) {
      const sectionIndex = markup.indexOf(sectionId);
      expect(sectionIndex).toBeGreaterThan(previousSectionIndex);
      previousSectionIndex = sectionIndex;
    }
  },
);
