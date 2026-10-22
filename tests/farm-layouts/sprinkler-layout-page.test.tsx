import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import type { PublicLocale } from "../../src/i18n/public-locale";

type SprinklerLayoutCaseText = Readonly<{
  id: string;
  title: string;
  summary: string;
  imageAlt: string;
}>;

async function loadSprinklerLayoutPageModules() {
  const contentModule = await import("../../src/farm-layouts/sprinkler-layout-content");
  const pageModule = await import("../../src/farm-layouts/sprinkler-layout-page");
  return { contentModule, pageModule };
}

const projectRoot = resolve(import.meta.dirname, "../..");
const sprinklerLayoutLocales: readonly PublicLocale[] = ["en", "zh-CN"];
const sprinklerLayoutCaseCount = 6;
const sprinklerLayoutImageCount = sprinklerLayoutCaseCount + 1;
const sprinklerPreviewWidth = 1600;
const sprinklerPreviewHeight = 1300;
const sprinklerLayoutImageDirectory = "/farm-layouts/sprinkler/images";
const sprinklerLayoutProjectDirectory = "/farm-layouts/sprinkler/projects";
const sprinklerLayoutCoverStem = "07-iridium-farm-patches-paths-scarecrows";
const expectedSprinklerLayoutCaseIds = [
  "01-basic-knights-move-staggered",
  "02-quality-3x3-grid",
  "03-iridium-5x5-grid",
  "04-scarecrow-radius-quality",
  "05-scarecrow-radius-iridium",
  "06-greenhouse-6-iridium-116",
] as const;
const sprinklerLayoutSectionOrder = [
  'id="sprinkler-layout-page-title"',
  'id="sprinkler-layout-what-is"',
  'id="sprinkler-layout-layouts"',
  'id="sprinkler-layout-how-to-heading"',
  'id="sprinkler-layout-faq"',
  'id="sprinkler-layout-cta"',
] as const;

function decodeSprinklerLayoutMarkup(markup: string): string {
  return markup
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/&quot;|&#34;|&#x22;/gi, '"')
    .replace(/&#x2F;|&#47;/gi, "/")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function sprinklerLayoutPreviewPublicPath(stem: string): string {
  return `${sprinklerLayoutImageDirectory}/${stem}.webp`;
}

function sprinklerLayoutFullPublicPath(stem: string): string {
  return `${sprinklerLayoutImageDirectory}/${stem}-full.webp`;
}

function sprinklerLayoutAvifPublicPath(stem: string): string {
  return `${sprinklerLayoutImageDirectory}/${stem}.avif`;
}

function sprinklerLayoutProjectPublicPath(stem: string): string {
  return `${sprinklerLayoutProjectDirectory}/${stem}.json`;
}

function requireSprinklerLayoutPublicAsset(publicPath: string): void {
  const absolutePath = resolve(projectRoot, "public", publicPath.slice(1));
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing Sprinkler Layout public asset: ${absolutePath}.`);
  }
}

function requireSprinklerLayoutSection(
  markup: string,
  sectionId: string,
): string {
  const sectionMatch = markup.match(
    new RegExp(
      `<section(?=[^>]*id="${sectionId}")[^>]*>([\\s\\S]*?)<\\/section>`,
    ),
  );
  if (sectionMatch?.[1] === undefined) {
    throw new Error(
      `Missing Sprinkler Layout section ${sectionId}. Received markup length: ${markup.length}.`,
    );
  }

  return sectionMatch[1];
}

function requireSprinklerGreenhouseReference(
  locale: PublicLocale,
  layoutCase: SprinklerLayoutCaseText,
  caseMarkup: string,
): void {
  const copyText = [
    layoutCase.title,
    layoutCase.summary,
    layoutCase.imageAlt,
  ].join("\n");
  const renderedText = decodeSprinklerLayoutMarkup(caseMarkup);

  if (locale === "en") {
    const greenhouseReference =
      "greenhouse reference drawn on the Standard Farm";
    if (
      !copyText.includes(greenhouseReference) ||
      !copyText.includes("not the greenhouse interior") ||
      !renderedText.includes(greenhouseReference) ||
      !renderedText.includes("not the greenhouse interior")
    ) {
      throw new Error(
        `Sprinkler Layout case ${JSON.stringify(layoutCase.id)} in en must state a greenhouse reference drawn on the Standard Farm, not the greenhouse interior. Received copy: ${JSON.stringify(copyText)}. Received article: ${JSON.stringify(renderedText)}.`,
      );
    }
    return;
  }

  if (locale === "zh-CN") {
    if (
      !copyText.includes("标准农场上的温室参考示意") ||
      !renderedText.includes("标准农场上的温室参考示意")
    ) {
      throw new Error(
        `Sprinkler Layout case ${JSON.stringify(layoutCase.id)} in zh-CN must state 标准农场上的温室参考示意. Received copy: ${JSON.stringify(copyText)}. Received article: ${JSON.stringify(renderedText)}.`,
      );
    }
    return;
  }

  throw new Error(
    `Unsupported Sprinkler Layout test locale: ${JSON.stringify(locale)}.`,
  );
}

test("keeps seven Sprinkler Layout images and six case project files", () => {
  const imageStems = [
    ...expectedSprinklerLayoutCaseIds,
    sprinklerLayoutCoverStem,
  ];

  for (const stem of imageStems) {
    requireSprinklerLayoutPublicAsset(sprinklerLayoutPreviewPublicPath(stem));
    requireSprinklerLayoutPublicAsset(sprinklerLayoutFullPublicPath(stem));
    requireSprinklerLayoutPublicAsset(sprinklerLayoutAvifPublicPath(stem));
  }

  for (const caseId of expectedSprinklerLayoutCaseIds) {
    requireSprinklerLayoutPublicAsset(sprinklerLayoutProjectPublicPath(caseId));
  }

  const coverProjectPath = resolve(
    projectRoot,
    "public",
    sprinklerLayoutProjectPublicPath(sprinklerLayoutCoverStem).slice(1),
  );
  if (existsSync(coverProjectPath)) {
    throw new Error(
      `Sprinkler Layout cover must not have a project JSON. Found: ${coverProjectPath}.`,
    );
  }
});

test.each(sprinklerLayoutLocales)(
  "renders one Sprinkler Layout cover, six cases, and the section order in %s",
  async (locale) => {
    const { contentModule, pageModule } = await loadSprinklerLayoutPageModules();
    const copy = contentModule.getSprinklerLayoutPageCopy(locale);
    const { SprinklerLayoutPage } = pageModule;
    const markup = renderToStaticMarkup(
      <SprinklerLayoutPage locale={locale} />,
    );
    const visibleMarkup = decodeSprinklerLayoutMarkup(markup);
    const casesSection = requireSprinklerLayoutSection(
      markup,
      "sprinkler-layout-layouts",
    );

    expect(contentModule.sprinklerLayoutCanonicalPath).toBe(
      "/stardew-valley-sprinkler-layout",
    );
    expect(copy.cases.map((layoutCase) => layoutCase.id)).toEqual(
      expectedSprinklerLayoutCaseIds,
    );
    expect(copy.title.trim().length).toBeGreaterThan(0);
    expect(visibleMarkup).toContain(copy.title);
    expect(visibleMarkup).toContain(copy.intro);
    expect(markup).toContain('data-sprinkler-layout-page="true"');
    expect(markup).toContain('data-sprinkler-layout-cover="true"');
    expect(markup).toContain(`lang="${locale}"`);
    expect(markup.match(/data-sprinkler-layout-case=/g)).toHaveLength(
      sprinklerLayoutCaseCount,
    );
    expect(markup.match(/<article\b/g)).toHaveLength(sprinklerLayoutImageCount);
    expect(markup.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    expect(visibleMarkup).toContain(copy.categoryLabel);
    expect(visibleMarkup).toContain(copy.cover.caption);
    expect(markup).toContain(`src="${copy.cover.imageSrc}"`);
    expect(markup).toContain(`src="${copy.cover.imageOriginalSrc}"`);
    expect(visibleMarkup).toContain(copy.cover.imageAlt);
    expect(copy.cover.imageSrc).toBe(
      sprinklerLayoutPreviewPublicPath(sprinklerLayoutCoverStem),
    );
    expect(copy.cover.imageOriginalSrc).toBe(
      sprinklerLayoutFullPublicPath(sprinklerLayoutCoverStem),
    );
    expect(copy.cover.imageWidth).toBe(sprinklerPreviewWidth);
    expect(copy.cover.imageHeight).toBe(sprinklerPreviewHeight);
    expect(copy.cases.map((layoutCase) => layoutCase.id)).not.toContain(
      sprinklerLayoutCoverStem,
    );
    expect(casesSection).not.toContain(sprinklerLayoutCoverStem);
    expect(markup).not.toContain(
      `data-sprinkler-layout-case="${sprinklerLayoutCoverStem}"`,
    );
    expect(markup).not.toContain(
      sprinklerLayoutProjectPublicPath(sprinklerLayoutCoverStem),
    );
    expect(visibleMarkup).toContain(copy.whatIsHeading);
    expect(copy.whatIsParagraphs).toHaveLength(2);
    expect(visibleMarkup).toContain(copy.casesHeading);
    expect(visibleMarkup).toContain(copy.casesDescription);
    expect(visibleMarkup).toContain(copy.ctaHeading);
    expect(visibleMarkup).toContain(copy.ctaDescription);
    expect(visibleMarkup).toContain(copy.ctaButtonLabel);
    expect(visibleMarkup).toContain(copy.howToHeading);
    expect(markup.match(/data-how-it-works-step=/g)).toHaveLength(3);
    expect(visibleMarkup).toContain(copy.howToEyebrow);
    expect(visibleMarkup).toContain(copy.faqEyebrow);
    expect(visibleMarkup).toContain(copy.faqDescription);
    expect(copy.faqs).toHaveLength(5);
    expect(markup).not.toContain("<details");
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(copy.faqs.length);
    expect(markup.match(/data-layout-image-trigger="true"/g)).toHaveLength(
      sprinklerLayoutImageCount,
    );
    expect(markup.match(/data-layout-image-dialog="true"/g)).toHaveLength(
      sprinklerLayoutImageCount,
    );
    expect(markup).not.toContain("data-layout-image-zoom");
    expect(markup.match(/width="1600"/g)).toHaveLength(sprinklerLayoutImageCount * 2);
    expect(markup.match(/height="1300"/g)).toHaveLength(sprinklerLayoutImageCount * 2);
    expect(markup.match(/type="image\/avif"/g)).toHaveLength(sprinklerLayoutImageCount);
    expect(markup).not.toContain("-full.avif");
    expect(markup.match(/download=""/g)).toHaveLength(sprinklerLayoutCaseCount);
    expect(visibleMarkup).toContain(copy.downloadProjectLabel);
    expect(markup).not.toContain("sprinkler-layout-case-navigation");
    expect(markup).not.toContain("data-sprinkler-layout-quick-link");
    expect(markup).not.toContain('id="sprinkler-layout-sources"');
    expect(markup).not.toContain("data-public-page-shell");
    expect(markup).not.toContain("<main");
    expect(markup).not.toContain("<hr");

    const titleIndex = markup.indexOf('id="sprinkler-layout-page-title"');
    const coverIndex = markup.indexOf('data-sprinkler-layout-cover="true"');
    expect(titleIndex).toBeGreaterThan(-1);
    expect(coverIndex).toBeGreaterThan(titleIndex);

    let previousSectionIndex = -1;
    for (const sectionId of sprinklerLayoutSectionOrder) {
      const sectionIndex = markup.indexOf(sectionId);
      expect(sectionIndex).toBeGreaterThan(previousSectionIndex);
      previousSectionIndex = sectionIndex;
    }

    let previousCaseIndex = markup.indexOf('id="sprinkler-layout-layouts"');
    for (const layoutCase of copy.cases) {
      const caseIndex = markup.indexOf(
        `data-sprinkler-layout-case="${layoutCase.id}"`,
      );
      expect(caseIndex).toBeGreaterThan(previousCaseIndex);
      previousCaseIndex = caseIndex;
      expect(layoutCase.imageWidth).toBe(sprinklerPreviewWidth);
      expect(layoutCase.imageHeight).toBe(sprinklerPreviewHeight);
      expect(markup).toContain(`id="${layoutCase.id}"`);
      expect(markup).toContain(`download="" href="${layoutCase.projectHref}"`);
      expect(layoutCase.imageSrc).toBe(
        sprinklerLayoutPreviewPublicPath(layoutCase.id),
      );
      expect(layoutCase.imageOriginalSrc).toBe(
        sprinklerLayoutFullPublicPath(layoutCase.id),
      );
      expect(layoutCase.projectHref).toBe(
        sprinklerLayoutProjectPublicPath(layoutCase.id),
      );
      expect(markup).toContain(`src="${layoutCase.imageSrc}"`);
      expect(markup).toContain(`src="${layoutCase.imageOriginalSrc}"`);
      expect(markup).toContain(sprinklerLayoutAvifPublicPath(layoutCase.id));
      expect(visibleMarkup).toContain(layoutCase.title);
      expect(visibleMarkup).toContain(layoutCase.summary);
      expect(visibleMarkup).toContain(layoutCase.imageAlt);

      const caseMarkup = markup.slice(
        caseIndex,
        markup.indexOf("</article>", caseIndex),
      );
      const caseTitleTag = `<h3 id="${layoutCase.id}-title">`;
      if (
        caseMarkup.indexOf(layoutCase.imageSrc) < 0 ||
        caseMarkup.indexOf(caseTitleTag) < 0
      ) {
        throw new Error(
          `Sprinkler Layout case ${JSON.stringify(layoutCase.id)} is missing its preview or title element. Received: ${JSON.stringify(caseMarkup)}.`,
        );
      }
      expect(caseMarkup.indexOf(layoutCase.imageSrc)).toBeLessThan(
        caseMarkup.indexOf(caseTitleTag),
      );

      if (layoutCase.id === "06-greenhouse-6-iridium-116") {
        requireSprinklerGreenhouseReference(locale, layoutCase, caseMarkup);
      }
    }

    for (const whatIsParagraph of copy.whatIsParagraphs) {
      expect(visibleMarkup).toContain(whatIsParagraph);
    }

    for (const faq of copy.faqs) {
      expect(visibleMarkup).toContain(faq.question);
      expect(visibleMarkup).toContain(faq.answer);
    }

    for (const step of copy.howToSteps) {
      expect(visibleMarkup).toContain(step.number);
      expect(visibleMarkup).toContain(step.title);
      expect(visibleMarkup).toContain(step.body);
    }
  },
);

test.each(sprinklerLayoutLocales)(
  "links the Sprinkler Layout planner CTA to the localized homepage in %s",
  async (locale) => {
    const { contentModule, pageModule } = await loadSprinklerLayoutPageModules();
    const copy = contentModule.getSprinklerLayoutPageCopy(locale);
    const plannerHref = locale === "zh-CN" ? "/zh#planner" : "/#planner";
    const { SprinklerLayoutPage } = pageModule;
    const markup = renderToStaticMarkup(
      <SprinklerLayoutPage locale={locale} />,
    );
    const ctaSection = requireSprinklerLayoutSection(markup, "sprinkler-layout-cta");
    const visibleCta = decodeSprinklerLayoutMarkup(ctaSection);

    expect(plannerHref).toBe(locale === "zh-CN" ? "/zh#planner" : "/#planner");
    expect(markup).toContain(`href="${plannerHref}"`);
    expect(markup).toContain('href="#sprinkler-layout-layouts"');
    expect(ctaSection).toContain(`href="${plannerHref}"`);
    expect(visibleCta).toContain(copy.ctaButtonLabel);
    expect(decodeSprinklerLayoutMarkup(markup)).toContain(copy.openPlannerLabel);
    expect(decodeSprinklerLayoutMarkup(markup)).toContain(copy.browseLabel);
  },
);

test("sizes Sprinkler Layout images in the same 448px frame and stacks them at 850px", () => {
  const css = readFileSync(
    resolve(projectRoot, "src/farm-layouts/sprinkler-layout-page.module.css"),
    "utf8",
  );
  const pageSource = readFileSync(
    resolve(projectRoot, "src/farm-layouts/sprinkler-layout-page.tsx"),
    "utf8",
  );
  const viewerSource = readFileSync(
    resolve(projectRoot, "src/farm-layouts/layout-image-viewer.tsx"),
    "utf8",
  );
  const beachCss = readFileSync(
    resolve(projectRoot, "src/farm-layouts/beach-farm-page.module.css"),
    "utf8",
  );
  const howItWorksSource = readFileSync(
    resolve(projectRoot, "src/components/how-it-works-09.tsx"),
    "utf8",
  );
  const mobileQueryIndex = css.indexOf("@media (max-width: 850px)");
  if (mobileQueryIndex < 0) {
    throw new Error(
      "Sprinkler Layout page CSS is missing the 850px stack breakpoint.",
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
      selector.startsWith(".sprinklerPage") ||
        selector.startsWith("@media (max-width: 850px)"),
    ).toBe(true);
  }
  expect(desktopCss).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
  expect(desktopCss).toContain("width: min(100%, 448px)");
  expect(desktopCss).toContain("max-width: min(100%, 448px)");
  expect(desktopCss).toContain("max-height: 364px");
  expect(desktopCss).toContain("aspect-ratio: 2560 / 2080");
  expect(desktopCss).toContain("object-fit: contain");
  expect(desktopCss).toContain(
    ".sprinklerPage .sprinklerCase:nth-child(even) .sprinklerCaseVisual",
  );
  expect(desktopCss).toContain("grid-column: 2");
  expect(desktopCss).toContain("background: transparent");
  expect(desktopCss).toContain("padding: 0");
  expect(desktopCss).toContain("border: 0");
  expect(desktopCss).toContain("max-height: 85dvh");
  expect(desktopCss).toContain("max-width: min(90vw, 72rem)");
  expect(mobileCss).toContain("grid-template-columns: minmax(0, 1fr)");
  expect(mobileCss).toContain(
    ".sprinklerPage .sprinklerCase:nth-child(even) .sprinklerCaseVisual",
  );
  expect(mobileCss).toContain("grid-column: 1");
  expect(mobileCss).toContain("width: min(100%, 448px)");
  expect(pageSource).toContain("LayoutImageViewer");
  expect(pageSource).toContain('from "../components/faq-1"');
  expect(pageSource).toContain('from "../components/how-it-works-09"');
  expect(pageSource).toContain("getSprinklerLayoutPageCopy");
  expect(pageSource).not.toContain("function Faq1");
  expect(pageSource).not.toContain("function HowItWorks09");
  expect(pageSource).not.toContain("function LayoutImageViewer");
  expect(pageSource).not.toContain("use client");
  expect(pageSource).not.toContain("ZoomIn");
  expect(pageSource).not.toContain("<hr");
  expect(pageSource).toContain('data-sprinkler-layout-page="true"');
  expect(pageSource).toContain("data-sprinkler-layout-case={layoutCase.id}");
  expect(viewerSource).toContain('type="button"');
  expect(viewerSource).toContain("showModal()");
  expect(viewerSource).toContain("dialog.close()");
  expect(beachCss).toContain(".imageTrigger:focus-visible");
  expect(beachCss).toContain(".dialogCloseButton:focus-visible");
  expect(beachCss).toContain(".downloadLink:focus-visible");
  expect(howItWorksSource).toContain("hidden h-px md:block");
});

test.each(sprinklerLayoutLocales)(
  "keeps Sprinkler Layout image triggers focusable and dialogs closable in %s",
  async (locale) => {
    const viewerSource = readFileSync(
      resolve(projectRoot, "src/farm-layouts/layout-image-viewer.tsx"),
      "utf8",
    );
    const beachCss = readFileSync(
      resolve(projectRoot, "src/farm-layouts/beach-farm-page.module.css"),
      "utf8",
    );
    const { contentModule, pageModule } = await loadSprinklerLayoutPageModules();
    const copy = contentModule.getSprinklerLayoutPageCopy(locale);
    const { SprinklerLayoutPage } = pageModule;
    const markup = renderToStaticMarkup(
      <SprinklerLayoutPage locale={locale} />,
    );
    const triggers = markup.match(
      /<button\b(?=[^>]*data-layout-image-trigger="true")[^>]*>/g,
    );
    const dialogs = markup.match(
      /<dialog\b(?=[^>]*data-layout-image-dialog="true")[^>]*>[\s\S]*?<\/dialog>/g,
    );

    expect(viewerSource).toContain('type="button"');
    expect(viewerSource).toContain("showModal()");
    expect(viewerSource).toContain("dialog.close()");
    expect(beachCss).toContain(".imageTrigger:focus-visible");
    expect(beachCss).toContain(".dialogCloseButton:focus-visible");
    expect(beachCss).toContain(".downloadLink:focus-visible");
    if (triggers === null || triggers.length !== sprinklerLayoutImageCount) {
      throw new Error(
        `Sprinkler Layout page in ${JSON.stringify(locale)} must render ${sprinklerLayoutImageCount} image trigger buttons. Received: ${triggers?.length ?? 0}.`,
      );
    }
    if (dialogs === null || dialogs.length !== sprinklerLayoutImageCount) {
      throw new Error(
        `Sprinkler Layout page in ${JSON.stringify(locale)} must render ${sprinklerLayoutImageCount} image dialogs. Received: ${dialogs?.length ?? 0}.`,
      );
    }

    for (const trigger of triggers) {
      expect(trigger).toContain('type="button"');
      expect(trigger).not.toContain("disabled");
    }

    for (const dialog of dialogs) {
      expect(dialog).toContain('type="button"');
      expect(dialog).not.toContain("data-layout-image-zoom");
    }

    expect(markup.match(/data-layout-image-trigger="true"/g)).toHaveLength(
      sprinklerLayoutImageCount,
    );
    expect(decodeSprinklerLayoutMarkup(markup)).toContain(copy.enlargeImageLabel);
    expect(decodeSprinklerLayoutMarkup(markup)).toContain(copy.closeImageLabel);
  },
);
