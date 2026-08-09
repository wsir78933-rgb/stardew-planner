import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { CarpenterStardewEnglishArticle } from "../../src/blog/articles/carpenter-stardew.en";
import { CarpenterStardewChineseArticle } from "../../src/blog/articles/carpenter-stardew.zh";
import { WhereIsRobinEnglishArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.en";
import { WhereIsRobinChineseArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.zh";

type ArticleFixture = Readonly<{
  markup: string;
  requiredPhrases: readonly string[];
  scheduleBoundaryPhrases: readonly (string | RegExp)[];
  constructionClosurePhrase: string;
  houseCounterDistinctionPhrase: string;
  plannerPath: string;
  comparisonPath: string;
  meadowlandsPath: string;
  officialSource: string;
}>;

function renderArticle(Component: () => ReactNode): string {
  return renderToStaticMarkup(createElement(Component));
}

function countSecondLevelSections(markup: string): number {
  return (markup.match(/<h2/g) ?? []).length;
}

function assertArticleContract(article: ArticleFixture): void {
  for (const requiredPhrase of article.requiredPhrases) {
    expect(article.markup).toContain(requiredPhrase);
  }

  for (const scheduleBoundaryPhrase of article.scheduleBoundaryPhrases) {
    if (typeof scheduleBoundaryPhrase === "string") {
      expect(article.markup).toContain(scheduleBoundaryPhrase);
      continue;
    }

    expect(article.markup).toMatch(scheduleBoundaryPhrase);
  }

  expect(article.markup).not.toContain("<h1");
  expect(article.markup).not.toContain("robin locati0n stardew");
  expect(article.markup).toContain('href="' + article.plannerPath + '"');
  expect(article.markup).toContain('href="' + article.comparisonPath + '"');
  expect(article.markup).toContain('href="' + article.meadowlandsPath + '"');
  expect(article.markup).toContain('href="' + article.officialSource + '"');
  expect(article.markup).toContain(article.constructionClosurePhrase);
  expect(article.markup).toContain(article.houseCounterDistinctionPhrase);
  expect(countSecondLevelSections(article.markup)).toBeGreaterThanOrEqual(4);
}

function getOpeningParagraph(markup: string): string {
  const openingParagraph = markup.match(/^<article><p>(.*?)<\/p>/);

  if (openingParagraph === null) {
    throw new Error("Article markup must start with an opening paragraph.");
  }

  return openingParagraph[1];
}

it("renders sourced English and Chinese carpenter guides with matching section counts", () => {
  const englishArticle: ArticleFixture = {
    markup: renderArticle(CarpenterStardewEnglishArticle),
    requiredPhrases: ["24 Mountain Road", "09:00", "1.6.15"],
    scheduleBoundaryPhrases: [
      "Friday service ends at 16:00.",
      "Tuesday is normally closed, while rain can change the schedule.",
    ],
    constructionClosurePhrase:
      "if Robin is constructing a new farm building, she is working at your farm and the shop is closed.",
    houseCounterDistinctionPhrase:
      "entering the building is not proof that you can place an order.",
    plannerPath: "/",
    comparisonPath: "/farm-comparison",
    meadowlandsPath: "/farm/meadowlands",
    officialSource: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
  };
  const chineseArticle: ArticleFixture = {
    markup: renderArticle(CarpenterStardewChineseArticle),
    requiredPhrases: ["24 Mountain Road", "09:00", "1.6.15"],
    scheduleBoundaryPhrases: [
      "周五会在 16:00 结束服务。",
      /周二通常\s*不营业，但下雨会改变罗宾的日程/,
    ],
    constructionClosurePhrase:
      "如果罗宾正在建造新的农场建筑，她会在你的农场工作，商店也会关闭。",
    houseCounterDistinctionPhrase: "房子能进入，不等于柜台一定提供服务；",
    plannerPath: "/zh",
    comparisonPath: "/zh/farm-comparison",
    meadowlandsPath: "/zh/farm/meadowlands",
    officialSource: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
  };

  assertArticleContract(englishArticle);
  assertArticleContract(chineseArticle);
  expect(countSecondLevelSections(englishArticle.markup)).toBe(
    countSecondLevelSections(chineseArticle.markup),
  );
  expect(englishArticle.markup.length).toBeGreaterThan(2800);
  expect(chineseArticle.markup.length).toBeGreaterThan(1200);
  expect(englishArticle.markup).not.toContain("or upgrade may affect access");
  expect(chineseArticle.markup).not.toContain("或升级项目开始后");
});

it("renders sourced English and Chinese Robin-location guides with matching section counts", () => {
  const englishArticle: ArticleFixture = {
    markup: renderArticle(WhereIsRobinEnglishArticle),
    requiredPhrases: ["24 Mountain Road", "Friday", "1.6.15"],
    scheduleBoundaryPhrases: [
      "Tuesday is normally a closed-shop day, while rain can change that routine.",
      "Friday, a visit after 16:00 is simply too late for regular service.",
    ],
    constructionClosurePhrase:
      "When Robin is constructing a new farm building, she is at the farm and the shop is closed.",
    houseCounterDistinctionPhrase:
      "seeing the building open does not guarantee that Robin can sell or start an order.",
    plannerPath: "/",
    comparisonPath: "/farm-comparison",
    meadowlandsPath: "/farm/meadowlands",
    officialSource: "https://wiki.stardewvalley.net/Robin",
  };
  const chineseArticle: ArticleFixture = {
    markup: renderArticle(WhereIsRobinChineseArticle),
    requiredPhrases: ["24 Mountain Road", "周五", "1.6.15"],
    scheduleBoundaryPhrases: [
      "周二通常是商店关闭日，但下雨也可能改变这套日程",
      "周五 16:00 之后则已经超过正常服务时间。",
    ],
    constructionClosurePhrase:
      "罗宾正在建造新的农场建筑时，会在玩家农场施工，木匠商店也会关闭。",
    houseCounterDistinctionPhrase: "房子开着，不代表罗宾可以出售物品或开始订单。",
    plannerPath: "/zh",
    comparisonPath: "/zh/farm-comparison",
    meadowlandsPath: "/zh/farm/meadowlands",
    officialSource: "https://wiki.stardewvalley.net/Robin",
  };

  assertArticleContract(englishArticle);
  assertArticleContract(chineseArticle);
  expect(countSecondLevelSections(englishArticle.markup)).toBe(
    countSecondLevelSections(chineseArticle.markup),
  );
  expect(englishArticle.markup.length).toBeGreaterThan(2800);
  expect(chineseArticle.markup.length).toBeGreaterThan(1200);
  expect(getOpeningParagraph(englishArticle.markup)).toContain("24 Mountain Road");
  expect(getOpeningParagraph(englishArticle.markup)).toContain("09:00–17:00");
  expect(getOpeningParagraph(chineseArticle.markup)).toContain("24 Mountain Road");
  expect(getOpeningParagraph(chineseArticle.markup)).toContain("09:00–17:00");
});
