import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import type { PublicLocale } from "../../src/i18n/public-locale";
import { getKegCountCaseImagePaths } from "../../src/tools-pages/keg-count/keg-count-case-media";
import { KegCountPage } from "../../src/tools-pages/keg-count/keg-count-page";

const PNG_SIGNATURE = "89504e470d0a1a0a";
const REMOVED_SOURCE_URLS = [
  "https://valleymath.com/stardew/how-many-kegs-do-i-need",
  "https://stardewvalleywiki.com/Keg",
  "https://stardewvalleywiki.com/Shed",
  "https://www.reddit.com/r/StardewValley/comments/17zomd4/",
] as const;

const kegCountPageCases = [
  {
    locale: "zh-CN",
    h1: "这批收获需要多少个小桶？",
    caseTitle: "10 个杨桃，7 天内要处理完？",
    featureTitle: "把收获数量换算成可用产能",
    stepsTitle: "三步估算小桶产能",
    comparisonTitle: "小桶需求：本站 vs. ValleyMath vs. Wiki / 社区表格",
    faqTitle: "小桶数量计算常见问题",
    ctaTitle: "把小桶数量算清楚",
    ctaLabel: "计算所需小桶",
    desktopResultTitle: "案例结果 · 示例数据",
    mobileResultTitle: "案例数据 · 不是玩家存档",
    caseDescription: "示例数据：每 7 天收获 10 个杨桃，手上已有 2 个小桶。",
    disclaimer: "数字来自工具模型/测试场景；不是玩家存档。",
    featureItems: ["单批处理缺口", "重复收获积压", "棚屋与材料衔接"] as const,
    cornerLabel: "功能",
    firstColumn: "本站小桶数量",
    desktopDescription: "比的是截止日产能、重复收获，以及算完后怎么接着建。",
    mobileSources: "来源：ValleyMath 小桶容量 · Stardew Wiki Keg/Shed · Reddit 社区表格 17zomd4",
    mobileDescription: "看截止日产能、重复收获与建造衔接",
    comparisonCells: [
      "看完工批次和未加工余量",
      "同样算期限产能，另有棚屋布局",
      "查配方和周期，自己比",
      "按固定间隔看吞吐和积压",
      "同样算持续产能，需及时重装",
      "查周期后自己比收获速度",
      "目标数带入材料页对库存",
      "容量页也能带入再算材料",
      "配方和缺口要手算",
      "中英双语，接着排材料和排程",
      "英文页面，含棚屋和材料",
      "只查规则或社区表格",
    ] as const,
  },
  {
    locale: "en",
    h1: "How many Kegs does this harvest need?",
    caseTitle: "Can 10 Starfruit clear in 7 days?",
    featureTitle: "Turn a harvest into a capacity target",
    stepsTitle: "Estimate Keg capacity in three steps",
    comparisonTitle: "Keg Count: Our Tool vs. ValleyMath vs. Wiki / Community Sheets",
    faqTitle: "Common Keg-capacity questions",
    ctaTitle: "Know your Keg target",
    ctaLabel: "Calculate Keg capacity",
    desktopResultTitle: "Example results",
    mobileResultTitle: "Example data · not a player save",
    caseDescription: "Example: 10 Starfruit return every 7 days; 2 Kegs are already built.",
    disclaimer: "Values come from a calculator/test scenario, not a player save.",
    featureItems: ["One-harvest gap", "Repeating harvests", "Shed and material handoff"] as const,
    cornerLabel: "Feature",
    firstColumn: "Our keg count",
    desktopDescription: "Compare deadline capacity, repeat harvests, and what you do after the count.",
    mobileSources: "Sources: ValleyMath Keg capacity · Stardew Wiki Keg/Shed · Reddit sheet 17zomd4",
    mobileDescription: "Capacity, repeat harvests & build handoff",
    comparisonCells: [
      "See finished batches and raw leftovers",
      "Also estimates deadline capacity and shed layouts",
      "Look up cycles, then compare mixes yourself",
      "Fixed interval shows throughput and backlog",
      "Also estimates backlog if you reload on time",
      "Look up cycles, then compare rates yourself",
      "Send the target to our materials page",
      "Its capacity page can pass the target on",
      "Look up recipes; calculate the gap yourself",
      "Bilingual, then continue to materials",
      "English capacity, shed, and materials",
      "Rules lookup or a community sheet",
    ] as const,
  },
] as const satisfies readonly Readonly<{
  locale: PublicLocale;
  h1: string;
  caseTitle: string;
  featureTitle: string;
  stepsTitle: string;
  comparisonTitle: string;
  faqTitle: string;
  ctaTitle: string;
  ctaLabel: string;
  desktopResultTitle: string;
  mobileResultTitle: string;
  caseDescription: string;
  disclaimer: string;
  featureItems: readonly [string, string, string];
  cornerLabel: string;
  firstColumn: string;
  desktopDescription: string;
  mobileSources: string;
  mobileDescription: string;
  comparisonCells: readonly string[];
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

function assertHeading(markup: string, tagName: "h1" | "h2", title: string): void {
  expect(markup).toMatch(
    new RegExp(`<${tagName}\\b[^>]*>${escapeRegExp(escapeHtmlText(title))}</${tagName}>`),
  );
}

function assertTextFollows(markup: string, earlierText: string, laterText: string): void {
  const earlierIndex = markup.indexOf(escapeHtmlText(earlierText));
  const laterIndex = markup.indexOf(escapeHtmlText(laterText));

  if (earlierIndex < 0) {
    throw new Error(`Expected keg count page markup to contain ${JSON.stringify(earlierText)}.`);
  }

  if (laterIndex < 0) {
    throw new Error(`Expected keg count page markup to contain ${JSON.stringify(laterText)}.`);
  }

  expect(laterIndex).toBeGreaterThan(earlierIndex);
}

it.each(kegCountPageCases)(
  "renders the keg count wireframe headings for $locale",
  (expected) => {
    const markup = renderToStaticMarkup(<KegCountPage locale={expected.locale} />);
    const localeFolder = expected.locale === "zh-CN" ? "zh-CN" : "en";
    const currentStockPath = `/images/planning-tool-guides/keg-count/${localeFolder}/desktop/case-current-stock.png`;
    const repeatingHarvestPath = `/images/planning-tool-guides/keg-count/${localeFolder}/desktop/case-repeating-harvest.png`;
    const caseImagePaths = [currentStockPath, repeatingHarvestPath, currentStockPath, repeatingHarvestPath];
    const desktopCasePath = `public/images/planning-tool-guides/keg-count/${localeFolder}/desktop/case.png`;
    const mobileCasePath = `public/images/planning-tool-guides/keg-count/${localeFolder}/mobile/case.png`;
    const currentStockFile = readFileSync(`public${currentStockPath}`);
    const repeatingHarvestFile = readFileSync(`public${repeatingHarvestPath}`);
    const desktopCaseFile = readFileSync(desktopCasePath);
    const mobileCaseFile = readFileSync(mobileCasePath);

    expect(getKegCountCaseImagePaths(expected.locale)).toEqual(caseImagePaths);
    expect(markup.match(/<h1\b/g) ?? []).toHaveLength(1);
    assertHeading(markup, "h2", expected.h1);
    assertHeading(markup, "h2", expected.caseTitle);
    assertHeading(markup, "h2", expected.featureTitle);
    assertHeading(markup, "h2", expected.stepsTitle);
    assertHeading(markup, "h2", expected.comparisonTitle);
    assertHeading(markup, "h2", expected.faqTitle);
    assertHeading(markup, "h2", expected.ctaTitle);
    expect(markup).toContain(escapeHtmlText(expected.ctaLabel));
    expect(markup).toContain(escapeHtmlText(expected.caseDescription));
    expect(markup).toContain(escapeHtmlText(expected.disclaimer));
    expect(markup).toContain(escapeHtmlText(expected.desktopResultTitle));
    expect(markup).toContain(escapeHtmlText(expected.mobileResultTitle));
    expect(markup).toContain(`>${escapeHtmlText(expected.cornerLabel)}</th>`);
    expect(markup).toContain(escapeHtmlText(expected.firstColumn));
    expect(markup).toContain(escapeHtmlText(expected.desktopDescription));
    expect(markup).toContain(escapeHtmlText(expected.mobileSources));
    expect(markup).toContain(escapeHtmlText(expected.mobileDescription));
    for (const comparisonCell of expected.comparisonCells) {
      expect(markup).toContain(escapeHtmlText(comparisonCell));
    }
    for (const featureItem of expected.featureItems) {
      expect(markup).toContain(escapeHtmlText(featureItem));
    }
    for (const removedSourceUrl of REMOVED_SOURCE_URLS) {
      expect(markup).not.toContain(removedSourceUrl);
    }
    expect(markup).toContain('data-workshop-keg-capacity="true"');
    expect(markup).toContain('href="#keg-count-calculator"');
    expect(markup).not.toContain('srcSet=');
    expect(markup.match(/width="512"/g) ?? []).toHaveLength(4);
    expect([...markup.matchAll(/data-case-image="(start|end)"/g)].map((match) => match[1])).toEqual([
      "start",
      "end",
      "start",
      "end",
    ]);
    expect(markup.split(currentStockPath).length - 1).toBe(2);
    expect(markup.split(repeatingHarvestPath).length - 1).toBe(2);
    expect(currentStockFile.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(repeatingHarvestFile.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(desktopCaseFile.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(mobileCaseFile.subarray(0, 8).toString("hex")).toBe(PNG_SIGNATURE);
    expect(desktopCaseFile.equals(mobileCaseFile)).toBe(true);
    expect(desktopCaseFile.equals(currentStockFile)).toBe(true);

    assertTextFollows(markup, "keg-count-page-hero", "data-workshop-keg-capacity");
    assertTextFollows(markup, "data-workshop-keg-capacity", "keg-count-hero-title");
    assertTextFollows(markup, expected.caseDescription, currentStockPath);
    assertTextFollows(markup, currentStockPath, expected.desktopResultTitle);
    assertTextFollows(markup, expected.desktopResultTitle, expected.featureItems[0]);
    assertTextFollows(markup, repeatingHarvestPath, expected.featureItems[0]);
    assertTextFollows(markup, expected.featureItems[0], expected.featureItems[1]);
    assertTextFollows(markup, expected.featureItems[1], expected.featureItems[2]);
    assertTextFollows(markup, expected.featureItems[2], expected.featureTitle);
    assertTextFollows(markup, expected.h1, expected.caseTitle);
    assertTextFollows(markup, expected.caseTitle, expected.featureTitle);
    assertTextFollows(markup, expected.featureTitle, expected.stepsTitle);
    assertTextFollows(markup, expected.stepsTitle, expected.comparisonTitle);
    assertTextFollows(markup, expected.comparisonTitle, expected.faqTitle);
    assertTextFollows(markup, expected.faqTitle, expected.ctaTitle);
  },
);

it("rejects a keg count case image locale that is not en or zh-CN", () => {
  expect(() => getKegCountCaseImagePaths("fr")).toThrow(
    'Unsupported keg count case image locale. Received: "fr".',
  );
});
