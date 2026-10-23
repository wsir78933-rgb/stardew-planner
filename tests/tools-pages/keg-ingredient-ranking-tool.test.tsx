import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { PublicLocale } from "../../src/i18n/public-locale";
import { readKegIngredientRanking } from "../../src/processing-tools/keg-ingredient-ranking";
import {
  KegIngredientRankingTool,
  readKegRankingDraft,
} from "../../src/tools-pages/processing/keg-ingredient-ranking-tool";

const kegRankingLocaleCases = [
  {
    locale: "en",
    heading: "Keg Ingredient Profit Ranking",
    rankingLabel: "Rank by",
    qualityFilterNote: "Only Keg recipes that support the selected quality appear here. Ingredients without quality tiers always use Normal quality.",
    inventoryHeading: "Check your inventory",
    qualityLabel: "Ingredient quality",
    professionLabel: "Profession",
    sortLabel: "Rank by",
    deadlineLabel: "Days available",
    planButton: "Add to production plan",
    disabledNote: "Production-plan transfer is not available yet.",
    sortHeader: "Added value per cycle",
    processingMinuteSort: "Per processing minute",
    processingMinuteUnit: "g / game min",
    processingMinuteHeader: "Added value per processing minute",
    processingMinuteExplanation: "Added value per processing minute divides one batch's value added by its in-game processing minutes. It excludes collection waiting time and is not a daily throughput estimate.",
    specialConditions: "Special conditions (optional)",
    bearsKnowledgeLabel: "Bear's Knowledge",
    coconutSourceLabel: "Coconut source",
    conditionSummary: "Bear's Knowledge off; Coconut source: Foraged.",
    collectionAssumption: "Capacity assumes you collect finished batches and refill each free Keg once every morning. Only batches finished by the deadline count as processed.",
  },
  {
    locale: "zh-CN",
    heading: "Keg 原料收益排行",
    rankingLabel: "排行口径",
    qualityFilterNote: "排行只显示支持所选品质的 Keg 原料。没有品质星级的原料始终按普通品质计算。",
    inventoryHeading: "用实际库存检查选中原料",
    qualityLabel: "原料品质",
    professionLabel: "职业",
    sortLabel: "排行口径",
    deadlineLabel: "可用天数",
    planButton: "转入生产计划",
    disabledNote: "生产计划转入功能尚未开放。",
    sortHeader: "每个机器周期增值",
    processingMinuteSort: "每个加工分钟",
    processingMinuteUnit: "金币 / 游戏分钟",
    processingMinuteHeader: "每个加工分钟增值",
    processingMinuteExplanation: "每加工分钟增值按单批增值除以游戏内加工分钟计算；不包含收取等待时间，也不代表每日收取产能估算。",
    specialConditions: "特殊条件（可选）",
    bearsKnowledgeLabel: "熊的知识",
    coconutSourceLabel: "椰子来源",
    conditionSummary: "熊的知识：未启用；椰子来源：采集获得。",
    collectionAssumption: "产能估算假设每天早晨收取已完成批次，并给每个空闲 Keg 补料一次；只计入截止期前完成的批次。",
  },
] as const satisfies readonly Readonly<{
  locale: PublicLocale;
  heading: string;
  rankingLabel: string;
  qualityFilterNote: string;
  inventoryHeading: string;
  qualityLabel: string;
  professionLabel: string;
  sortLabel: string;
  deadlineLabel: string;
  planButton: string;
  disabledNote: string;
  sortHeader: string;
  processingMinuteSort: string;
  processingMinuteUnit: string;
  processingMinuteHeader: string;
  processingMinuteExplanation: string;
  specialConditions: string;
  bearsKnowledgeLabel: string;
  coconutSourceLabel: string;
  conditionSummary: string;
  collectionAssumption: string;
}>[];

function countMatches(markup: string, expression: RegExp): number {
  return markup.match(expression)?.length ?? 0;
}

function readListMarkup(markup: string): string {
  const mobileListMatch = markup.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/);
  if (mobileListMatch === null) {
    throw new Error("Expected a complete ordered list for the mobile Keg ranking.");
  }

  return mobileListMatch[1];
}

function readTableBodyMarkup(markup: string): string {
  const tableBodyMatch = markup.match(/<tbody>([\s\S]*?)<\/tbody>/);
  if (tableBodyMatch === null) {
    throw new Error("Expected a complete table body for the desktop Keg ranking.");
  }

  return tableBodyMatch[1];
}

describe.each(kegRankingLocaleCases)("Keg ingredient ranking in $locale", (testCase) => {
  it("renders one localized page heading, complete accessible rankings, and all four labelled selectors", () => {
    const renderedMarkup = renderToStaticMarkup(
      <KegIngredientRankingTool locale={testCase.locale} />,
    );
    const expectedRowCount = readKegIngredientRanking(
      { quality: "normal", profession: "none" },
      "per-machine-cycle",
    ).length;
    const mobileListMarkup = readListMarkup(renderedMarkup);
    const tableBodyMarkup = readTableBodyMarkup(renderedMarkup);
    const readableMarkup = renderedMarkup.replaceAll("&#x27;", "'");

    expect(countMatches(renderedMarkup, /<h1\b/g)).toBe(0);
    expect(renderedMarkup).toContain('<h2 id="keg-ingredient-ranking-title">' + testCase.heading + "</h2>");
    expect(renderedMarkup).toContain(testCase.inventoryHeading);
    expect(renderedMarkup).toContain(testCase.rankingLabel);
    expect(renderedMarkup).toContain(testCase.qualityFilterNote);
    expect(readableMarkup).toContain(testCase.processingMinuteExplanation);
    expect(renderedMarkup).toContain(testCase.processingMinuteUnit);
    expect(renderedMarkup).toContain(testCase.specialConditions);
    expect(readableMarkup).toContain(testCase.bearsKnowledgeLabel);
    expect(readableMarkup).toContain(testCase.coconutSourceLabel);
    expect(readableMarkup).toContain(testCase.conditionSummary);
    expect(renderedMarkup).toContain(testCase.collectionAssumption);
    expect(countMatches(mobileListMarkup, /<li\b/g)).toBe(expectedRowCount);
    expect(countMatches(tableBodyMarkup, /<tr\b/g)).toBe(expectedRowCount);
    expect(countMatches(mobileListMarkup, /<button\b[^>]*aria-pressed=/g)).toBe(expectedRowCount);

    assertLabelledCombobox(renderedMarkup, "keg-ranking-quality", testCase.qualityLabel);
    assertLabelledCombobox(renderedMarkup, "keg-ranking-profession", testCase.professionLabel);
    assertLabelledCombobox(renderedMarkup, "keg-ranking-sort", testCase.sortLabel);
    assertLabelledCombobox(renderedMarkup, "keg-ranking-coconut-source", testCase.coconutSourceLabel);
    assertLabelledCombobox(renderedMarkup, "keg-inventory-deadline", testCase.deadlineLabel);
    expect(renderedMarkup).toContain('for="keg-ranking-bears-knowledge"');
    expect(renderedMarkup).toContain('id="keg-ranking-bears-knowledge"');
    expect(renderedMarkup).toContain('type="checkbox"');
  });

  it("connects selected ingredient feedback, inventory inputs, sorting semantics, and the disabled plan action", () => {
    const renderedMarkup = renderToStaticMarkup(
      <KegIngredientRankingTool locale={testCase.locale} />,
    );
    const expectedRows = readKegIngredientRanking(
      { quality: "normal", profession: "none" },
      "per-machine-cycle",
    );

    expect(renderedMarkup).toContain('<th aria-sort="descending" scope="col">' + testCase.sortHeader + "</th>");
    expect(renderedMarkup).toContain('<th scope="col">' + testCase.processingMinuteHeader + "</th>");
    expect(renderedMarkup).toContain(
      testCase.locale === "en" ? "0.0002 g / game min" : "0.0002 金币 / 游戏分钟",
    );
    expect(renderedMarkup).toContain('aria-pressed="true"');
    expect(renderedMarkup).toContain('for="keg-inventory-quantity"');
    expect(renderedMarkup).toContain('for="keg-inventory-machine-count"');
    expect(renderedMarkup).toContain('id="keg-inventory-deadline-label"');
    expect(renderedMarkup).toContain(
      testCase.locale === "en" ? 'aria-label="Select rank 1:' : 'aria-label="选择第 1 名：',
    );
    expect(renderedMarkup).toMatch(
      /<button\b(?=[^>]*\bdisabled="")(?=[^>]*\baria-describedby="keg-plan-disabled-note")[^>]*>/,
    );
    expect(renderedMarkup).toContain(testCase.planButton);
    expect(renderedMarkup).toContain('id="keg-plan-disabled-note">' + testCase.disabledNote + "</p>");
    expect(expectedRows.length).toBeGreaterThan(5);
    const fifthIngredientName =
      testCase.locale === "en"
        ? expectedRows[4].ingredient.englishName
        : expectedRows[4].ingredient.chineseName;
    expect(readListMarkup(renderedMarkup)).toContain(fifthIngredientName);
  });
});

function assertLabelledCombobox(markup: string, inputId: string, label: string): void {
  expect(markup).toContain('for="' + inputId + '" id="' + inputId + '-label">' + label + "</label>");
  expect(markup).toMatch(
    new RegExp(
      "<button\\b(?=[^>]*\\bid=\"" +
        inputId +
        "\")(?=[^>]*\\brole=\"combobox\")(?=[^>]*\\baria-labelledby=\"" +
        inputId +
        "-label\")[^>]*>",
    ),
  );
}

it("fails fast with the received unsupported locale", () => {
  const invalidLocale = "ja" as PublicLocale;

  expect(() =>
    renderToStaticMarkup(<KegIngredientRankingTool locale={invalidLocale} />),
  ).toThrow("Received: " + JSON.stringify(invalidLocale));
});

describe.each(kegRankingLocaleCases)("saved Keg ranking draft in $locale", (testCase) => {
  it("restores earlier saved drafts with default optional conditions", () => {
    const earlierDraft = {
      quality: "normal",
      profession: "none",
      sortBy: "per-machine-cycle",
      selectedIngredientId: "",
      quantity: "20",
      kegCount: "1",
      deadlineDays: "28",
    };

    const restoredDraft = readKegRankingDraft(JSON.stringify(earlierDraft), testCase.locale);

    expect(restoredDraft.errorMessage).toBeNull();
    expect(restoredDraft.draft).toMatchObject({
      hasBearsKnowledge: false,
      coconutSource: "foraged",
    });
  });
});
