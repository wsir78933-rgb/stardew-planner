import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { getToolsPageCopy } from "../../src/i18n/tools-page-copy";
import { seasonProfitRankingHasRows } from "../../src/tools-pages/crop-profit-tool";
import { ToolsHomePage } from "../../src/tools-pages/tools-home-page";

it("links the Chinese tools homepage planting card to both planting tools", () => {
  const markup = renderToStaticMarkup(<ToolsHomePage locale="zh-CN" />);

  expect(markup).toContain('href="/zh/tools/crop-profit"');
  expect(markup).toContain('href="/zh/tools/crop-profit?tool=growth"');
  expect(markup).toMatch(/<a\b[^>]*>\s*季节作物收益\s*<\/a>/);
  expect(markup).toMatch(/<a\b[^>]*>\s*生长与收获日历\s*<\/a>/);
  expect(markup).toContain("进入种植规划");
  expect(markup).not.toContain('href="/zh/tools/crop-growth"');
  expect(markup).not.toContain('href="/zh/tools/processing"');
});

it("renders the Chinese season-profit form labels", async () => {
  const { default: ChineseCropProfitPage } = await import(
    "../../app/zh/tools/crop-profit/page"
  );
  const copy = getToolsPageCopy("zh-CN");
  const markup = renderToStaticMarkup(<ChineseCropProfitPage />);

  expect(markup).toContain(copy.profit.plantingDay);
  expect(markup).toContain(copy.profit.farmYear);
  expect(markup).toContain(copy.profit.tileCount);
  expect(markup).toContain(copy.profit.seedSource);
  expect(markup).toContain(copy.profit.profession);
  expect(markup).toContain(copy.profit.speedGro);
  expect(markup).toContain(copy.profit.fertilizerCost);
  expect(markup).toContain(copy.profit.kegCount);
  expect(markup).toContain(copy.profit.jarCount);
  expect(markup).toContain(copy.profit.dehydratorCount);
  expect(markup).toContain(copy.profit.deadline);
  expect(markup).toContain("春");
  expect(markup).toContain("夏");
  expect(markup).toContain("秋");
  expect(markup).toContain("冬");
});

it("treats a season-profit row count of zero as no ranking rows", () => {
  expect(seasonProfitRankingHasRows(0)).toBe(false);
  expect(seasonProfitRankingHasRows(1)).toBe(true);
  expect(() => seasonProfitRankingHasRows(-1)).toThrow("Received: -1");
});
