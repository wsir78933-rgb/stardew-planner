import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import EnglishProductionScheduleRoute from "../../app/(en)/tools/production-schedule/page";
import ChineseProductionScheduleRoute from "../../app/zh/tools/production-schedule/page";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { getProductionScheduleCaseMedia } from "../../src/tools-pages/production-schedule/production-schedule-case-media";
import { ProductionSchedulePage } from "../../src/tools-pages/production-schedule/production-schedule-page";

vi.mock("../../src/tools-pages/production/production-planner-tool", () => ({
  ProductionPlannerTool: ({
    locale,
    view,
  }: {
    locale: string;
    view: string;
  }) => {
    if (view !== "schedule") {
      throw new Error(
        `Production schedule page expected ProductionPlannerTool view "schedule", received ${JSON.stringify(view)}.`,
      );
    }

    return <div data-production-planner={`${locale}:${view}`} />;
  },
}));

const expectedHeadings = {
  en: {
    title: "Line up arrivals, machines, and daily work",
    caseTitle: "What fits in a 14-day plan?",
    caseResultTitle: "Example results",
    featuresTitle: "See the daily work and the full-window result",
    stepsTitle: "Build a production schedule in three steps",
    comparisonTitle: "Production Schedule: Our Tool vs. ValleyMath vs. Wiki / Community Sheets",
    faqTitle: "Common production-schedule questions",
    ctaTitle: "Plan the full processing window",
    ctaAction: "View the production schedule",
    mobileCaseLabel: "Example data · not a player save",
    mobileComparisonDescription: "Similar planners; compare language and daily flow",
    mobileSourceLine: "Sources: ValleyMath Full Planner · Wiki Keg/Jar/Dehydrator · Reddit sheet 17zomd4",
  },
  "zh-CN": {
    title: "把库存到货和机器时间排在一起",
    caseTitle: "14 天计划会怎样安排？",
    caseResultTitle: "案例结果 · 示例数据",
    featuresTitle: "同时看每天做什么和整段计划值多少",
    stepsTitle: "三步生成生产排程",
    comparisonTitle: "综合生产排程：本站 vs. ValleyMath vs. Wiki / 社区表格",
    faqTitle: "综合生产排程常见问题",
    ctaTitle: "把整段加工期限排清楚",
    ctaAction: "查看生产排程",
    mobileCaseLabel: "案例数据 · 不是玩家存档",
    mobileComparisonDescription: "双方功能接近；比较双语与今日清单衔接",
    mobileSourceLine: "来源：ValleyMath Full Planner · Wiki Keg/Jar/Dehydrator · Reddit 社区表格 17zomd4",
  },
} as const satisfies Readonly<Record<PublicLocale, Readonly<Record<string, string>>>>;

const comparisonRowLabels = {
  en: [
    "How can I add inventory?",
    "How do the three machine types share stock?",
    "What daily results can I review?",
    "Which schedule fits?",
  ],
  "zh-CN": [
    "如何录入库存？",
    "三类机器如何共享原料？",
    "能看到哪些逐日结果？",
    "哪种排程方式更适合？",
  ],
} as const satisfies Readonly<Record<PublicLocale, readonly string[]>>;

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

function expectHeading(markup: string, tagName: "h1" | "h2" | "h3", text: string): void {
  expect(markup).toMatch(
    new RegExp(`<${tagName}\\b[^>]*>${escapeRegExp(escapeHtmlText(text))}</${tagName}>`),
  );
}

function textIndex(markup: string, text: string): number {
  const index = markup.indexOf(escapeHtmlText(text));

  if (index < 0) {
    throw new Error(`Expected production schedule markup to contain ${JSON.stringify(text)}.`);
  }

  return index;
}

it.each([
  { locale: "en" },
  { locale: "zh-CN" },
] as const)("renders the production schedule wireframe headings for $locale", ({ locale }) => {
  const headings = expectedHeadings[locale];
  const media = getProductionScheduleCaseMedia(locale);
  const markup = renderToStaticMarkup(<ProductionSchedulePage locale={locale} />);

  expect(markup).toContain(`data-production-planner="${locale}:schedule"`);
  expectHeading(markup, "h2", headings.title);
  expectHeading(markup, "h2", headings.caseTitle);
  expectHeading(markup, "h3", headings.caseResultTitle);
  expectHeading(markup, "h2", headings.featuresTitle);
  expectHeading(markup, "h2", headings.stepsTitle);
  expectHeading(markup, "h2", headings.comparisonTitle);
  expectHeading(markup, "h2", headings.faqTitle);
  expectHeading(markup, "h2", headings.ctaTitle);
  expect(markup).toContain(escapeHtmlText(headings.ctaAction));
  expect(markup).toContain(escapeHtmlText(headings.mobileCaseLabel));
  expect(markup).toContain(escapeHtmlText(headings.mobileComparisonDescription));
  expect(markup).toContain(escapeHtmlText(headings.mobileSourceLine));
  expect(markup).toContain('href="#production-schedule-calculator"');
  expect(markup).toContain('media="(max-width: 700px)"');
  expect(markup).toContain(`srcSet="${media.mobile.src}"`);
  expect(markup).toContain(`src="${media.desktop.src}"`);
  expect(markup).toContain('alt=""');
  expect(markup).toContain('width="556"');
  expect(markup).toContain('height="417"');
  expect(markup).toContain('width="312"');
  expect(markup).toContain('height="234"');
  for (const rowLabel of comparisonRowLabels[locale]) {
    expect(markup).toContain(`<th scope="row">${escapeHtmlText(rowLabel)}</th>`);
  }

  const titleIndex = textIndex(markup, headings.title);
  const caseIndex = textIndex(markup, headings.caseTitle);
  const featuresIndex = textIndex(markup, headings.featuresTitle);
  const stepsIndex = textIndex(markup, headings.stepsTitle);
  const comparisonIndex = textIndex(markup, headings.comparisonTitle);
  const faqIndex = textIndex(markup, headings.faqTitle);
  const ctaIndex = textIndex(markup, headings.ctaTitle);
  const calculatorIndex = markup.indexOf(`data-production-planner="${locale}:schedule"`);

  expect(calculatorIndex).toBeGreaterThan(markup.indexOf("<h1"));
  expect(ctaIndex).toBeGreaterThan(markup.indexOf("<h1"));
  expect(caseIndex).toBeGreaterThan(titleIndex);
  expect(featuresIndex).toBeGreaterThan(caseIndex);
  expect(stepsIndex).toBeGreaterThan(featuresIndex);
  expect(comparisonIndex).toBeGreaterThan(stepsIndex);
  expect(faqIndex).toBeGreaterThan(comparisonIndex);
  expect(ctaIndex).toBeGreaterThan(faqIndex);
});

it("renders both locale routes instead of an empty page", () => {
  const englishMarkup = renderToStaticMarkup(<EnglishProductionScheduleRoute />);
  const chineseMarkup = renderToStaticMarkup(<ChineseProductionScheduleRoute />);

  expect(englishMarkup).toContain(escapeHtmlText(expectedHeadings.en.title));
  expect(englishMarkup).toContain(escapeHtmlText(expectedHeadings.en.caseTitle));
  expect(englishMarkup).toContain(escapeHtmlText(expectedHeadings.en.stepsTitle));
  expect(englishMarkup).toContain(escapeHtmlText(expectedHeadings.en.comparisonTitle));
  expect(englishMarkup).toContain(escapeHtmlText(expectedHeadings.en.faqTitle));
  expect(englishMarkup).toContain(escapeHtmlText(expectedHeadings.en.ctaTitle));
  expect(chineseMarkup).toContain(escapeHtmlText(expectedHeadings["zh-CN"].title));
  expect(chineseMarkup).toContain(escapeHtmlText(expectedHeadings["zh-CN"].caseTitle));
  expect(chineseMarkup).toContain(escapeHtmlText(expectedHeadings["zh-CN"].stepsTitle));
  expect(chineseMarkup).toContain(escapeHtmlText(expectedHeadings["zh-CN"].comparisonTitle));
  expect(chineseMarkup).toContain(escapeHtmlText(expectedHeadings["zh-CN"].faqTitle));
  expect(chineseMarkup).toContain(escapeHtmlText(expectedHeadings["zh-CN"].ctaTitle));
});
