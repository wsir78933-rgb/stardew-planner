import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { getMaterialsAndResinCaseImagePath } from "../../src/tools-pages/materials-and-resin/materials-and-resin-case-media";
import { MaterialsAndResinPage } from "../../src/tools-pages/materials-and-resin/materials-and-resin-page";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const pngSignature = "89504e470d0a1a0a";
const calculatorMarker = 'data-workshop-keg-materials="true"';

const expectedPages = [
  {
    locale: "zh-CN",
    h1: "还差哪些材料，树脂要等多久？",
    caseLabel: "案例结果 · 示例数据",
    mobileCaseLabel: "案例数据 · 不是玩家存档",
    caseTitle: "材料缺口与树脂周期分开看",
    featuresTitle: "同时核对建造缺口与树脂等待",
    featureTitles: ["计算目标配方", "找到当前瓶颈", "估算树脂周期"],
    stepsTitle: "三步核对制作与等待",
    stepTitles: ["填写目标数量", "盘点材料库存", "设置采集条件"],
    comparisonTitle: "材料与树脂：本站 vs. ValleyMath vs. Wiki / 手动清单",
    mobileComparisonDescription: "看库存缺口、树脂期限与工具衔接",
    rowLabels: [
      "当前库存能制作多少台？",
      "橡树树脂何时能补齐？",
      "如何接续小桶数量规划？",
      "哪种更适合当前需求？",
    ],
    mobileSources: "来源：ValleyMath Keg Cost · Stardew Wiki Keg/Oak Resin/Tapper",
    comparisonCells: [
      "比的是库存缺口、树脂期限，以及从小桶目标接着算。",
      "功能",
      "本站材料与树脂",
      "看可制作数、瓶颈和缺料",
      "同样扣已建数，列出瓶颈",
      "查配方，自己减库存",
      "按树、采集器和期限估产量",
      "同样按树和期限估产量",
      "查周期，自己换算",
      "容量页带入目标和已建数",
      "容量页也能带入再算材料",
      "不带入个人目标和库存",
      "中英双语，分开复制材料和树脂",
      "英文计算器，可复制清单",
      "只查配方和周期，自己盘点",
    ],
    faqTitle: "材料与树脂常见问题",
    ctaTitle: "先看清缺口，再安排树脂",
    ctaLabel: "计算材料与树脂时间",
  },
  {
    locale: "en",
    h1: "What is missing, and when will Resin be ready?",
    caseLabel: "Example results",
    mobileCaseLabel: "Example data · not a player save",
    caseTitle: "See material gaps and resin timing separately",
    featuresTitle: "Check the build gap and waiting time together",
    featureTitles: ["Count the recipe", "Find the bottleneck", "Estimate Resin cycles"],
    stepsTitle: "Check materials and timing in three steps",
    stepTitles: ["Enter the Keg target", "Count your materials", "Set the Tapper conditions"],
    comparisonTitle: "Keg Materials & Resin: Our Tool vs. ValleyMath vs. Wiki / Manual",
    mobileComparisonDescription: "Stock gaps, resin timing & workflow",
    rowLabels: [
      "How many can my stock craft?",
      "When will Oak Resin cover the gap?",
      "Can I carry a Keg target into this step?",
      "Which workflow fits?",
    ],
    mobileSources: "Sources: ValleyMath Keg Cost · Stardew Wiki Keg/Oak Resin/Tapper",
    comparisonCells: [
      "Compare stock gaps, resin timing, and the handoff from a Keg target.",
      "Feature",
      "Our materials tool",
      "See craftable count, bottleneck, and shortages",
      "Also shows the limiting material",
      "Look up the recipe and subtract stock",
      "Estimate output, days, or trees needed",
      "Also estimates output by tapper and deadline",
      "Look up cycles and calculate the deadline",
      "Capacity page fills the target and built count",
      "Its capacity page can pass the counts on",
      "No personal target or stock is carried in",
      "Bilingual, copy materials and resin separately",
      "English calculator with a checklist copy",
      "Recipe rules, then do the math yourself",
    ],
    faqTitle: "Common materials and resin questions",
    ctaTitle: "See the gap before you build",
    ctaLabel: "Calculate materials and Resin",
  },
] as const satisfies readonly Readonly<{
  locale: PublicLocale;
  h1: string;
  caseLabel: string;
  mobileCaseLabel: string;
  caseTitle: string;
  featuresTitle: string;
  featureTitles: readonly [string, string, string];
  stepsTitle: string;
  stepTitles: readonly [string, string, string];
  comparisonTitle: string;
  mobileComparisonDescription: string;
  rowLabels: readonly [string, string, string, string];
  mobileSources: string;
  comparisonCells: readonly string[];
  faqTitle: string;
  ctaTitle: string;
  ctaLabel: string;
}>[];

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

function expectHeading(markup: string, tagName: "h1" | "h2", headingId: string, title: string): void {
  const escapedTitle = escapeRegExp(escapeHtmlText(title));
  expect(markup).toMatch(
    new RegExp(`<${tagName}\\b[^>]*\\bid="${headingId}"[^>]*>${escapedTitle}</${tagName}>`),
  );
}

function expectHeadingText(markup: string, tagName: "h1" | "h2", title: string): void {
  const escapedTitle = escapeRegExp(escapeHtmlText(title));
  expect(markup).toMatch(
    new RegExp(`<${tagName}\\b[^>]*>\\s*${escapedTitle}\\s*</${tagName}>`),
  );
}

function expectTextFollows(markup: string, earlierText: string, laterText: string): void {
  const earlierIndex = markup.indexOf(escapeHtmlText(earlierText));
  const laterIndex = markup.indexOf(escapeHtmlText(laterText));

  if (earlierIndex < 0) {
    throw new Error(`Expected materials and resin markup to contain ${JSON.stringify(earlierText)}.`);
  }

  if (laterIndex < 0) {
    throw new Error(`Expected materials and resin markup to contain ${JSON.stringify(laterText)}.`);
  }

  expect(laterIndex).toBeGreaterThan(earlierIndex);
}

function expectCasePng(locale: PublicLocale, variant: "desktop" | "mobile"): string {
  const relativePath = `public/images/planning-tool-guides/materials-and-resin/${locale}/${variant}/case.png`;
  const bytes = readFileSync(join(projectRoot, relativePath));
  const signature = bytes.subarray(0, 8).toString("hex");

  if (signature !== pngSignature) {
    throw new Error(
      `Expected ${relativePath} to start with PNG signature ${pngSignature}, received ${signature}.`,
    );
  }

  return `/images/planning-tool-guides/materials-and-resin/${locale}/${variant}/case.png`;
}

it.each(expectedPages)(
  "renders the materials and resin wireframe headings for $locale",
  (expected) => {
    expectCasePng(expected.locale, "desktop");
    expectCasePng(expected.locale, "mobile");
    const imagePath = getMaterialsAndResinCaseImagePath(expected.locale);
    const markup = renderToStaticMarkup(<MaterialsAndResinPage locale={expected.locale} />);
    const calculatorIndex = markup.indexOf(calculatorMarker);
    const simpleHeroIndex = markup.indexOf('id="materials-and-resin-page-hero"');
    const heroIndex = markup.indexOf(`id="materials-and-resin-hero-title"`);
    const ctaIndex = markup.indexOf(`id="materials-and-resin-cta-title"`);

    expect(markup.match(/<h1\b/g) ?? []).toHaveLength(1);
    expect(simpleHeroIndex).toBeGreaterThanOrEqual(0);
    expect(calculatorIndex).toBeGreaterThan(simpleHeroIndex);
    expect(heroIndex).toBeGreaterThan(calculatorIndex);
    expect(ctaIndex).toBeGreaterThan(heroIndex);
    expectHeading(markup, "h2", "materials-and-resin-hero-title", expected.h1);
    expectHeading(markup, "h2", "materials-and-resin-case-title", expected.caseTitle);
    expectHeading(markup, "h2", "materials-and-resin-features-title", expected.featuresTitle);
    expectHeadingText(markup, "h2", expected.stepsTitle);
    expectHeading(markup, "h2", "materials-and-resin-comparison-title", expected.comparisonTitle);
    expectHeadingText(markup, "h2", expected.faqTitle);
    expectHeading(markup, "h2", "materials-and-resin-cta-title", expected.ctaTitle);
    expect(markup).toContain(escapeHtmlText(expected.caseLabel));
    expect(markup).toContain(escapeHtmlText(expected.mobileCaseLabel));
    expect(markup).toContain(escapeHtmlText(expected.mobileComparisonDescription));
    expect(markup).toContain(escapeHtmlText(expected.mobileSources));
    expect(markup).toContain(escapeHtmlText(expected.ctaLabel));
    expect(markup).toContain('href="#materials-and-resin-calculator"');
    expected.featureTitles.forEach((title) => {
      expect(markup).toContain(`>${escapeHtmlText(title)}</h3>`);
    });
    expected.stepTitles.forEach((title) => {
      expect(markup).toContain(`>${escapeHtmlText(title)}</h3>`);
    });
    expected.rowLabels.forEach((label) => {
      expect(markup).toContain(`<th scope="row">${escapeHtmlText(label)}</th>`);
      expect(markup).toContain(`>${escapeHtmlText(label)}</h3>`);
    });
    expected.comparisonCells.forEach((cell) => {
      expect(markup).toContain(escapeHtmlText(cell));
    });
    expect(markup).not.toContain("https://valleymath.com/stardew/keg-cost-calculator");
    expect(markup).not.toContain("https://stardewvalleywiki.com/Keg");
    expect(markup).not.toContain("https://stardewvalleywiki.com/Oak_Resin");
    expect(markup).not.toContain("https://stardewvalleywiki.com/Tapper");
    expect(markup).toContain('alt=""');
    expect(markup.match(new RegExp(escapeRegExp(imagePath), "g")) ?? []).toHaveLength(4);
    expect(markup).toContain('width="512"');
    expect(markup).toContain('height="652"');
    expect(markup.match(/data-image-side="(left|right)"/g)).toEqual([
      'data-image-side="left"',
      'data-image-side="right"',
      'data-image-side="left"',
      'data-image-side="right"',
    ]);
    expectTextFollows(markup, expected.h1, expected.caseTitle);
    expectTextFollows(markup, expected.caseTitle, expected.caseLabel);
    expectTextFollows(markup, expected.caseLabel, expected.featuresTitle);
    expectTextFollows(markup, expected.featuresTitle, expected.stepsTitle);
    expectTextFollows(markup, expected.stepsTitle, expected.comparisonTitle);
    expectTextFollows(markup, expected.comparisonTitle, expected.faqTitle);
    expectTextFollows(markup, expected.faqTitle, expected.ctaTitle);
    expect(markup.indexOf(escapeHtmlText(expected.ctaTitle))).toBeGreaterThan(calculatorIndex);
  },
);

it("throws when the materials case image locale is not en or zh-CN", () => {
  const locale = "ja";
  expect(() => getMaterialsAndResinCaseImagePath(locale as PublicLocale)).toThrow(locale);
});
