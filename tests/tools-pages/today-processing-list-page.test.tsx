import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import EnglishTodayProcessingListRoute from "../../app/(en)/tools/today-processing-list/page";
import ChineseTodayProcessingListRoute from "../../app/zh/tools/today-processing-list/page";
import {
  getTodayProcessingListPageCopy,
  type TodayProcessingListPageCopy,
} from "../../src/i18n/today-processing-list-page-copy";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { getTodayProcessingListCaseMedia } from "../../src/tools-pages/today-processing-list/today-processing-list-case-media";

const expectedHeadings = {
  en: {
    hero: "What should you collect, then load?",
    caseTitle: "What can one Keg load today?",
    caseResult: "Example results",
    features: "Follow tasks that fit the selected day",
    steps: "Build today's list in three steps",
    comparison: "Today\u2019s Processing List: Our Tool vs. ValleyMath vs. Wiki / Manual",
    faq: "Common daily-list questions",
    callToAction: "See today's processing tasks",
    actionLabel: "Build today's list",
  },
  "zh-CN": {
    hero: "今天先收什么，再装什么？",
    caseTitle: "一只小桶，今天装哪批？",
    caseResult: "案例结果 · 示例数据",
    features: "按日期查看能实际执行的任务",
    steps: "三步生成今日清单",
    comparison: "今日加工清单：本站 vs. ValleyMath vs. Wiki / 手动日历",
    faq: "今日加工清单常见问题",
    callToAction: "打开今天的加工清单",
    actionLabel: "生成今日清单",
  },
} as const satisfies Readonly<Record<PublicLocale, Readonly<Record<string, string>>>>;

const removedComparisonSourceTexts = [
  "https://valleymath.com/stardew/what-to-process-today",
  "https://valleymath.com/stardew/artisan-production-planner",
  "/artisan-production-planner",
  "https://stardewvalleywiki.com/Keg",
  "https://stardewvalleywiki.com/Preserves_Jar",
  "/Preserves_Jar",
  "https://stardewvalleywiki.com/Dehydrator",
  "/Dehydrator",
] as const;

const routePages = {
  en: EnglishTodayProcessingListRoute,
  "zh-CN": ChineseTodayProcessingListRoute,
} as const;

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

function assertHeading(markup: string, tagName: "h1" | "h2" | "h3", headingId: string, title: string): void {
  expect(markup).toMatch(
    new RegExp(
      `<${tagName}\\b(?=[^>]*\\bid="${escapeRegExp(headingId)}")[^>]*>${escapeRegExp(escapeHtmlText(title))}</${tagName}>`,
    ),
  );
}

function visibleCopyStrings(copy: TodayProcessingListPageCopy): readonly string[] {
  return [
    copy.hero.title,
    copy.hero.body,
    copy.hero.note,
    copy.caseStudy.eyebrow,
    copy.caseStudy.title,
    copy.caseStudy.example,
    copy.caseStudy.resultTitle,
    ...copy.caseStudy.results,
    copy.caseStudy.disclaimer,
    copy.caseStudy.mobileCaption,
    copy.features.eyebrow,
    copy.features.title,
    copy.features.description,
    ...copy.features.items.flatMap((feature) => [feature.title, feature.body]),
    copy.steps.eyebrow,
    copy.steps.title,
    copy.steps.description,
    ...copy.steps.items.flatMap((step) => [step.number, step.title, step.body]),
    copy.comparison.eyebrow,
    copy.comparison.title,
    copy.comparison.description,
    copy.comparison.cornerLabel,
    ...copy.comparison.products,
    ...copy.comparison.rows.flatMap((row) => [row.label, ...row.values]),
    copy.comparison.mobileDescription,
    copy.comparison.mobileSourceLine,
    copy.faq.eyebrow,
    copy.faq.title,
    copy.faq.description,
    ...copy.faq.items.flatMap((item) => [item.question, item.answer]),
    copy.callToAction.title,
    copy.callToAction.body,
    copy.callToAction.actionLabel,
  ];
}

function assertTextFollows(markup: string, earlierText: string, laterText: string): void {
  const earlierIndex = markup.indexOf(escapeHtmlText(earlierText));
  const laterIndex = markup.indexOf(escapeHtmlText(laterText));

  if (earlierIndex < 0) {
    throw new Error(`Expected today processing list markup to contain ${JSON.stringify(earlierText)}.`);
  }

  if (laterIndex < 0) {
    throw new Error(`Expected today processing list markup to contain ${JSON.stringify(laterText)}.`);
  }

  expect(laterIndex).toBeGreaterThan(earlierIndex);
}

it.each(["en", "zh-CN"] as const)("renders the today processing list guide in %s", (locale) => {
  const expected = expectedHeadings[locale];
  const copy = getTodayProcessingListPageCopy(locale);
  const caseMedia = getTodayProcessingListCaseMedia(locale);
  const RoutePage = routePages[locale];
  const markup = renderToStaticMarkup(<RoutePage />);

  expect(copy.hero.title).toBe(expected.hero);
  expect(copy.caseStudy.title).toBe(expected.caseTitle);
  expect(copy.caseStudy.resultTitle).toBe(expected.caseResult);
  expect(copy.features.title).toBe(expected.features);
  expect(copy.steps.title).toBe(expected.steps);
  expect(copy.comparison.title).toBe(expected.comparison);
  expect(copy.faq.title).toBe(expected.faq);
  expect(copy.callToAction.title).toBe(expected.callToAction);
  expect(copy.callToAction.actionLabel).toBe(expected.actionLabel);

  assertHeading(markup, "h2", "today-processing-list-hero-title", expected.hero);
  assertHeading(markup, "h2", "today-processing-list-case-title", expected.caseTitle);
  assertHeading(markup, "h3", "today-processing-list-case-result-title", expected.caseResult);
  assertHeading(markup, "h2", "today-processing-list-features-title", expected.features);
  assertHeading(markup, "h2", "today-processing-list-steps-title", expected.steps);
  assertHeading(markup, "h2", "today-processing-list-comparison-title", expected.comparison);
  assertHeading(markup, "h2", "today-processing-list-faq-title", expected.faq);
  assertHeading(markup, "h2", "today-processing-list-call-to-action-title", expected.callToAction);

  assertTextFollows(markup, expected.hero, expected.caseTitle);
  assertTextFollows(markup, expected.caseTitle, expected.caseResult);
  assertTextFollows(markup, expected.caseResult, expected.features);
  assertTextFollows(markup, expected.features, expected.steps);
  assertTextFollows(markup, expected.steps, expected.comparison);
  assertTextFollows(markup, expected.comparison, expected.faq);
  assertTextFollows(markup, expected.faq, expected.callToAction);

  const heroIndex = markup.indexOf('id="today-processing-list-hero-title"');
  const calculatorIndex = markup.indexOf('data-view="today"');
  const callToActionIndex = markup.indexOf('id="today-processing-list-call-to-action-title"');
  const caseImageIndex = markup.indexOf(`src="${caseMedia.desktop.src}"`);
  const caseResultIndex = markup.indexOf('id="today-processing-list-case-result-title"');
  expect(heroIndex).toBeGreaterThan(calculatorIndex);
  expect(callToActionIndex).toBeGreaterThan(heroIndex);
  expect(caseResultIndex).toBeGreaterThan(caseImageIndex);
  expect(markup).toContain('data-production-planner');
  expect(markup).not.toContain('data-view="schedule"');

  for (const row of copy.comparison.rows) {
    const rowLabel = escapeHtmlText(row.label);
    const tableLabelIndex = markup.indexOf(`<th scope="row">${rowLabel}</th>`);
    const repeatedLabelIndex = markup.indexOf(rowLabel, tableLabelIndex + rowLabel.length);
    expect(tableLabelIndex).toBeGreaterThanOrEqual(0);
    expect(repeatedLabelIndex).toBeGreaterThan(tableLabelIndex);
  }

  expect(markup).toContain(`media="(max-width: 700px)"`);
  expect(markup).toContain(`srcSet="${caseMedia.mobile.src}"`);
  expect(markup).toContain(`src="${caseMedia.desktop.src}"`);
  expect(markup).toContain(`width="${caseMedia.desktop.width}"`);
  expect(markup).toContain(`height="${caseMedia.desktop.height}"`);
  expect(markup).toContain(`width="${caseMedia.mobile.width}"`);
  expect(markup).toContain(`height="${caseMedia.mobile.height}"`);
  expect(markup).toContain('alt=""');
  expect(markup).toContain('loading="lazy"');
  expect(markup).toContain(`id="today-processing-list-calculator"`);

  for (const visibleText of visibleCopyStrings(copy)) {
    expect(markup).toContain(escapeHtmlText(visibleText));
  }

  const markupWithoutMobileSourceLine = markup.replaceAll(
    escapeHtmlText(copy.comparison.mobileSourceLine),
    "",
  );

  for (const removedComparisonSourceText of removedComparisonSourceTexts) {
    expect(markupWithoutMobileSourceLine).not.toContain(removedComparisonSourceText);
  }

  expect(markup).toContain(escapeHtmlText(copy.comparison.mobileSourceLine));

  expect(markup).toMatch(
    new RegExp(
      `<button\\b(?=[^>]*type="button")[^>]*>${escapeRegExp(escapeHtmlText(expected.actionLabel))}</button>`,
    ),
  );
});

it("writes both locale case screenshots from the wireframe", () => {
  const imagePaths = [
    "../../public/images/planning-tool-guides/today-processing-list/zh-CN/desktop/case.png",
    "../../public/images/planning-tool-guides/today-processing-list/zh-CN/mobile/case.png",
    "../../public/images/planning-tool-guides/today-processing-list/en/desktop/case.png",
    "../../public/images/planning-tool-guides/today-processing-list/en/mobile/case.png",
  ] as const;
  const pngs = imagePaths.map((imagePath) => readFileSync(new URL(imagePath, import.meta.url)));

  for (const png of pngs) {
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(png.readUInt32BE(16)).toBe(556);
    expect(png.readUInt32BE(20)).toBe(417);
  }

  expect(Buffer.compare(pngs[0], pngs[1])).toBe(0);
  expect(Buffer.compare(pngs[2], pngs[3])).toBe(0);
  expect(Buffer.compare(pngs[0], pngs[2])).not.toBe(0);
});

it("stacks the guide at the mobile breakpoint", () => {
  const pageCss = readFileSync(
    new URL("../../src/tools-pages/today-processing-list/today-processing-list-page.module.css", import.meta.url),
    "utf8",
  );
  const mobileCss = pageCss.slice(pageCss.indexOf("@media (max-width: 700px)"));
  const desktopCss = pageCss.slice(pageCss.indexOf("@media (min-width: 701px)"));

  expect(pageCss).toContain("@media (max-width: 700px)");
  expect(mobileCss).toContain("display: none");
  expect(mobileCss).toContain("display: block");
  expect(mobileCss).toContain("width: 312px");
  expect(desktopCss).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
  expect(desktopCss).toContain("grid-template-columns: minmax(0, 556px) minmax(0, 1fr)");
  expect(desktopCss).toContain("column-gap: 40px");
  expect(desktopCss).toContain("min-height: 180px");
  expect(desktopCss).toContain("width: 48px");
  expect(desktopCss).toContain("height: 48px");
  expect(desktopCss).toContain("min-height: 96px");
  expect(desktopCss).toContain("height: 422px");
  expect(pageCss).not.toContain("font-family");
  expect(pageCss).not.toContain("thead {\n    display: none");
});

it("fails fast with the received unsupported locale", () => {
  const unsupportedLocale = "ru" as PublicLocale;

  expect(() => getTodayProcessingListPageCopy(unsupportedLocale)).toThrow(JSON.stringify(unsupportedLocale));
  expect(() => getTodayProcessingListCaseMedia(unsupportedLocale)).toThrow(JSON.stringify(unsupportedLocale));
});
