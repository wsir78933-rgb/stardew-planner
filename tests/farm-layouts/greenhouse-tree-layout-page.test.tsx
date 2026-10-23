import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import type { PublicLocale } from "../../src/i18n/public-locale";
import { getGreenhouseTreeLayoutPageCopy } from "../../src/farm-layouts/greenhouse-tree-layout-content";
import { GreenhouseTreeLayoutPage } from "../../src/farm-layouts/greenhouse-tree-layout-page";

const greenhouseTreeLayoutLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const greenhouseTreeLayoutCaseStems = [
  "02-fruit-tree-layout-greenhouse-stardew",
  "03-stardew-greenhouse-tree-layout-seasonal",
  "04-stardew-greenhouse-tree-layout-mature-ring",
  "05-stardew-greenhouse-tree-layout-planting-order",
  "06-stardew-greenhouse-tree-layout-spring",
  "07-fruit-tree-layout-greenhouse-stardew-fall",
] as const;
const greenhouseTreeLayoutSectionIds = [
  'id="greenhouse-tree-layout-page-title"',
  'id="greenhouse-tree-layout-what-is"',
  'id="greenhouse-tree-layout-layouts"',
  'id="greenhouse-tree-layout-how-to-heading"',
  'id="greenhouse-tree-layout-faq"',
  'id="greenhouse-tree-layout-cta"',
] as const;

function decodeGreenhouseTreeLayoutMarkup(markup: string): string {
  return markup
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;|&#34;|&#x22;/gi, '"')
    .replace(/&#x2F;|&#47;/gi, "/")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

test.each(greenhouseTreeLayoutLocales)(
  "renders the greenhouse tree cover, six cases, and shared sections in %s",
  (locale) => {
    const copy = getGreenhouseTreeLayoutPageCopy(locale);
    const markup = renderToStaticMarkup(
      <GreenhouseTreeLayoutPage locale={locale} />,
    );
    const visibleMarkup = decodeGreenhouseTreeLayoutMarkup(markup);

    expect(markup).toContain('data-greenhouse-tree-layout-page="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(
      markup.match(/data-greenhouse-tree-layout-cover="true"/g),
    ).toHaveLength(1);
    expect(markup.match(/data-greenhouse-tree-layout-case=/g)).toHaveLength(6);
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
    expect(copy.cover.imageWidth).toBe(640);
    expect(copy.cover.imageHeight).toBe(768);
    expect(copy.cover.imageSrc).toBe(copy.cover.imageOriginalSrc);
    expect(copy.cover.imageSrc).toMatch(/\.webp$/);
    expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      greenhouseTreeLayoutCaseStems,
    );
    for (const paragraph of copy.whatIsParagraphs) {
      expect(visibleMarkup).toContain(paragraph);
    }

    for (const layoutCase of copy.cases) {
      expect(markup).toContain(
        `data-greenhouse-tree-layout-case="${layoutCase.id}"`,
      );
      expect(markup).toContain(
        `download="" href="${layoutCase.projectHref}"`,
      );
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(visibleMarkup).toContain(layoutCase.imageAlt);
      expect(visibleMarkup).toContain(layoutCase.title);
      expect(visibleMarkup).toContain(layoutCase.summary);
      expect(layoutCase.imageWidth).toBe(640);
      expect(layoutCase.imageHeight).toBe(768);
      expect(layoutCase.imageSrc).toBe(layoutCase.imageOriginalSrc);
      expect(layoutCase.imageSrc).toMatch(/\.webp$/);
    }

    const plannerHref = locale === "zh-CN" ? "/zh#planner" : "/#planner";
    expect(markup.split(`href="${plannerHref}"`)).toHaveLength(4);

    let previousSectionIndex = -1;
    for (const sectionId of greenhouseTreeLayoutSectionIds) {
      const sectionIndex = markup.indexOf(sectionId);
      expect(sectionIndex).toBeGreaterThan(previousSectionIndex);
      previousSectionIndex = sectionIndex;
    }
  },
);
