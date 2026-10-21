import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import {
  getRiverFarmPageCopy,
  riverFarmCanonicalPath,
} from "../../src/farm-layouts/river-farm-content";
import { RiverFarmPage } from "../../src/farm-layouts/river-farm-page";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import type { PublicLocale } from "../../src/i18n/public-locale";

const projectRoot = resolve(import.meta.dirname, "../..");
const riverFarmLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const riverFarmCaseCount = 7;
const riverPreviewWidth = 1600;
const riverPreviewHeight = 1300;
const riverFarmStemPrefix = "stardew-valley-river-farm-layout-";
const expectedRiverFarmCaseIds = [
  "01-namsai-summer-island-specialization",
  "02-spring-perfection-island-zones",
  "03-y6-fall-perfection-pumpkin-hub",
  "04-stardewplan-beauty-trellis",
  "05-y6-fall-rustic-shed-village",
  "06-y12-summer-ranch-center",
  "07-y5-fall-purple-paint-town",
] as const;
const riverFarmSectionOrder = [
  'id="river-farm-page-title"',
  'id="river-farm-what-is"',
  'id="river-farm-layouts"',
  'id="river-farm-how-to-heading"',
  'id="river-farm-faq"',
  'id="river-farm-cta"',
] as const;

function riverFarmKeyword(locale: PublicLocale): string {
  if (locale === "en") {
    return "stardew valley river farm layout";
  }

  if (locale === "zh-CN") {
    return "星露谷物语河流农场布局";
  }

  throw new Error(`Unsupported River Farm test locale: ${JSON.stringify(locale)}.`);
}

function riverFarmPreviewPublicPath(caseId: string): string {
  return `/farm-layouts/river/images/${riverFarmStemPrefix}${caseId}.webp`;
}

function riverFarmFullPublicPath(caseId: string): string {
  return `/farm-layouts/river/images/${riverFarmStemPrefix}${caseId}-full.webp`;
}

function riverFarmAvifPublicPath(caseId: string): string {
  return `/farm-layouts/river/images/${riverFarmStemPrefix}${caseId}.avif`;
}

function riverFarmProjectPublicPath(caseId: string): string {
  return `/farm-layouts/river/projects/${riverFarmStemPrefix}${caseId}.json`;
}

function requireRiverFarmPublicAsset(publicPath: string): void {
  const absolutePath = resolve(projectRoot, "public", publicPath.slice(1));
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing River Farm public asset: ${absolutePath}.`);
  }
}

test("keeps the seven River Farm asset files for every case stem", () => {
  for (const caseId of expectedRiverFarmCaseIds) {
    requireRiverFarmPublicAsset(riverFarmPreviewPublicPath(caseId));
    requireRiverFarmPublicAsset(riverFarmFullPublicPath(caseId));
    requireRiverFarmPublicAsset(riverFarmAvifPublicPath(caseId));
    requireRiverFarmPublicAsset(riverFarmProjectPublicPath(caseId));
  }
});

test.each(riverFarmLocales)(
  "renders the River Farm hero, seven cases, and section order in %s",
  (locale) => {
    const copy = getRiverFarmPageCopy(locale);
    const markup = renderToStaticMarkup(<RiverFarmPage locale={locale} />);
    const keyword = riverFarmKeyword(locale);

    expect(riverFarmCanonicalPath).toBe("/stardew-valley-river-farm-layout");
    expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      expectedRiverFarmCaseIds,
    );
    expect(copy.title.toLowerCase()).toContain(keyword.toLowerCase());
    expect(markup.toLowerCase()).toContain(keyword.toLowerCase());
    expect(markup).toContain('data-river-farm-page="true"');
    expect(markup).toContain('data-river-farm-cover="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup.match(/data-river-farm-case=/g)).toHaveLength(
      riverFarmCaseCount,
    );
    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(markup).toContain(copy.title);
    expect(markup).toContain(copy.intro);
    expect(markup).toContain(copy.categoryLabel);
    expect(markup).toContain(copy.cover.caption);
    expect(markup).toContain(`src="${copy.cover.imageSrc}"`);
    expect(markup).toContain(`src="${copy.cover.imageOriginalSrc}"`);
    expect(markup).toContain(copy.cover.imageAlt);
    expect(copy.cover.imageWidth).toBe(riverPreviewWidth);
    expect(copy.cover.imageHeight).toBe(riverPreviewHeight);
    expect(copy.cover.imageSrc).toBe(copy.cases[0]?.imageSrc);
    expect(copy.cover.imageOriginalSrc).toBe(copy.cases[0]?.imageOriginalSrc);
    expect(copy.cases[0]?.id).toBe(expectedRiverFarmCaseIds[0]);
    expect(new Set(copy.cases.map((layoutCase) => layoutCase.imageSrc)).size).toBe(
      riverFarmCaseCount,
    );
    expect(markup).toContain(copy.whatIsHeading);
    expect(copy.whatIsParagraphs).toHaveLength(2);
    expect(markup).toContain(copy.casesHeading);
    expect(markup).toContain(copy.casesDescription);
    expect(markup).toContain(copy.ctaHeading);
    expect(markup).toContain(copy.ctaDescription);
    expect(markup).toContain(copy.ctaButtonLabel);
    expect(markup).toContain(copy.howToHeading);
    expect(markup.match(/data-how-it-works-step=/g)).toHaveLength(3);
    expect(markup).toContain(copy.howToEyebrow);
    expect(markup).toContain(copy.faqEyebrow);
    expect(markup).toContain(copy.faqDescription);
    expect(markup).not.toContain("<details");
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(copy.faqs.length);
    expect(markup.match(/data-layout-image-trigger="true"/g)).toHaveLength(
      riverFarmCaseCount + 1,
    );
    expect(markup.match(/data-layout-image-dialog="true"/g)).toHaveLength(
      riverFarmCaseCount + 1,
    );
    expect(
      markup.match(
        new RegExp(
          `aria-label="${copy.enlargeImageLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:`,
          "g",
        ),
      ),
    ).toHaveLength(riverFarmCaseCount + 1);
    expect(
      markup.match(new RegExp(`aria-label="${copy.closeImageLabel}"`, "g")),
    ).toHaveLength(riverFarmCaseCount + 1);
    expect(markup).not.toContain("data-layout-image-zoom");
    expect(markup.match(/width="1600"/g)).toHaveLength((riverFarmCaseCount + 1) * 2);
    expect(markup.match(/height="1300"/g)).toHaveLength((riverFarmCaseCount + 1) * 2);
    expect(markup.match(/type="image\/avif"/g)).toHaveLength(riverFarmCaseCount + 1);
    expect(markup).not.toContain("-full.avif");
    expect(markup.match(/download=""/g)).toHaveLength(riverFarmCaseCount);
    expect(markup).toContain(copy.downloadProjectLabel);
    expect(markup).not.toContain("river-farm-case-navigation");
    expect(markup).not.toContain("data-river-farm-quick-link");
    expect(markup).not.toContain('id="river-farm-sources"');
    expect(markup).not.toContain("data-public-page-shell");
    expect(markup).not.toContain("<main");
    expect(markup).not.toContain("<hr");

    const titleIndex = markup.indexOf('id="river-farm-page-title"');
    const coverIndex = markup.indexOf('data-river-farm-cover="true"');
    expect(titleIndex).toBeGreaterThan(-1);
    expect(coverIndex).toBeGreaterThan(titleIndex);

    let previousSectionIndex = -1;
    for (const sectionId of riverFarmSectionOrder) {
      const sectionIndex = markup.indexOf(sectionId);
      expect(sectionIndex).toBeGreaterThan(previousSectionIndex);
      previousSectionIndex = sectionIndex;
    }

    let previousCaseIndex = markup.indexOf('id="river-farm-layouts"');
    for (const layoutCase of copy.cases) {
      const caseIndex = markup.indexOf(`data-river-farm-case="${layoutCase.id}"`);
      expect(caseIndex).toBeGreaterThan(previousCaseIndex);
      previousCaseIndex = caseIndex;
      expect(layoutCase.imageWidth).toBe(riverPreviewWidth);
      expect(layoutCase.imageHeight).toBe(riverPreviewHeight);
      expect(markup).toContain(`id="${layoutCase.id}"`);
      expect(markup).toContain(`download="" href="${layoutCase.projectHref}"`);
      expect(layoutCase.imageSrc).toBe(riverFarmPreviewPublicPath(layoutCase.id));
      expect(layoutCase.imageOriginalSrc).toBe(
        riverFarmFullPublicPath(layoutCase.id),
      );
      expect(layoutCase.projectHref).toBe(
        riverFarmProjectPublicPath(layoutCase.id),
      );
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(markup).toContain(riverFarmAvifPublicPath(layoutCase.id));
      expect(markup).toContain(layoutCase.title);
      expect(markup).toContain(layoutCase.summary);
      expect(markup).toContain(layoutCase.imageAlt);

      const caseMarkup = markup.slice(
        caseIndex,
        markup.indexOf("</article>", caseIndex),
      );
      expect(caseMarkup.indexOf(layoutCase.imageSrc)).toBeLessThan(
        caseMarkup.indexOf(layoutCase.title),
      );
    }

    for (const whatIsParagraph of copy.whatIsParagraphs) {
      expect(markup).toContain(whatIsParagraph);
    }

    for (const faq of copy.faqs) {
      expect(markup).toContain(faq.question);
      expect(markup).toContain(faq.answer);
    }

    for (const step of copy.howToSteps) {
      expect(markup).toContain(step.number);
      expect(markup).toContain(step.title);
      expect(markup).toContain(step.body);
    }
  },
);

test.each(riverFarmLocales)(
  "links the River Farm planner CTA to the localized homepage in %s",
  (locale) => {
    const copy = getRiverFarmPageCopy(locale);
    const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;
    const markup = renderToStaticMarkup(<RiverFarmPage locale={locale} />);

    expect(markup).toContain(`href="${plannerHref}"`);
    expect(markup).toContain('href="#river-farm-layouts"');
    const localizedCtaSection = markup.match(
      /<section(?=[^>]*id="river-farm-cta")[^>]*>([\s\S]*?)<\/section>/,
    );
    expect(localizedCtaSection?.[1]).toContain(`href="${plannerHref}"`);
    expect(localizedCtaSection?.[1]).toContain(copy.ctaButtonLabel);
    expect(markup).toContain(copy.openPlannerLabel);
    expect(markup).toContain(copy.browseLabel);
  },
);

test("sizes River Farm images in the half column and stacks them at 850px", () => {
  const css = readFileSync(
    resolve(projectRoot, "src/farm-layouts/river-farm-page.module.css"),
    "utf8",
  );
  const pageSource = readFileSync(
    resolve(projectRoot, "src/farm-layouts/river-farm-page.tsx"),
    "utf8",
  );
  const mobileQueryIndex = css.indexOf("@media (max-width: 850px)");
  if (mobileQueryIndex < 0) {
    throw new Error(
      "River Farm page CSS is missing the 850px stack breakpoint.",
    );
  }

  const desktopCss = css.slice(0, mobileQueryIndex);
  const mobileCss = css.slice(mobileQueryIndex);

  expect(css.match(/@media/g)).toHaveLength(1);
  expect(css).not.toContain("851px");
  expect(css).not.toContain("360px");
  expect(css).not.toContain("22.5rem");
  expect(css).not.toContain("object-fit: cover");
  expect(css).not.toContain("border-top");
  for (const selectorBlock of css.split("{").slice(0, -1)) {
    const selector = selectorBlock.slice(selectorBlock.lastIndexOf("}") + 1).trim();
    expect(
      selector.startsWith(".riverPage") ||
        selector.startsWith("@media (max-width: 850px)"),
    ).toBe(true);
  }
  expect(desktopCss).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
  expect(desktopCss).toContain("width: min(100%, 448px)");
  expect(desktopCss).toContain("max-width: min(100%, 448px)");
  expect(desktopCss).toContain("max-height: 364px");
  expect(desktopCss).toContain("aspect-ratio: 2560 / 2080");
  expect(desktopCss).toContain("object-fit: contain");
  expect(desktopCss).toContain(".riverPage .riverCase:nth-child(even) .riverCaseVisual");
  expect(desktopCss).toContain("grid-column: 2");
  expect(desktopCss).toContain("background: transparent");
  expect(desktopCss).toContain("max-height: 85dvh");
  expect(desktopCss).toContain("max-width: min(90vw, 72rem)");
  expect(desktopCss).toContain("border: 0");
  expect(mobileCss).toContain("grid-template-columns: minmax(0, 1fr)");
  expect(mobileCss).toContain(
    ".riverPage .riverCase:nth-child(even) .riverCaseVisual",
  );
  expect(mobileCss).toContain("grid-column: 1");
  expect(mobileCss).toContain("width: min(100%, 448px)");
  expect(pageSource).toContain("LayoutImageViewer");
  expect(pageSource).not.toContain("ZoomIn");
  expect(pageSource).not.toContain("<hr");
});
