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
  planningInformationGainPhrase: string;
  plannerPath: string;
  selectedFarmPlannerPath: string;
  officialSource: string;
  mediaPaths: readonly string[];
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
  expect(article.markup).toContain(
    'href="' + article.selectedFarmPlannerPath + '"',
  );
  for (const removedPublicPath of [
    "/farm-comparison",
    "/mods",
    "/farm/",
    "/zh/farm-comparison",
    "/zh/mods",
    "/zh/farm/",
  ]) {
    expect(article.markup).not.toContain(`href="${removedPublicPath}`);
  }
  expect(article.markup).toContain('href="' + article.officialSource + '"');
  for (const mediaPath of article.mediaPaths) {
    expect(article.markup).toContain('src="' + mediaPath + '"');
  }
  expect(article.markup).toContain('loading="lazy"');
  expect(article.markup).not.toContain("<iframe");
  expect(article.markup).not.toContain("youtube.com");
  expect(article.markup).not.toContain("youtube-nocookie.com");
  expect(article.markup).toContain(article.constructionClosurePhrase);
  expect(article.markup).toContain(article.houseCounterDistinctionPhrase);
  expect(article.markup).toContain(article.planningInformationGainPhrase);
  expect(countSecondLevelSections(article.markup)).toBeGreaterThanOrEqual(4);

  for (const authorFacingOrAiPhrase of [
    "Search intent",
    "Target keyword",
    "Content brief",
    "This article will",
    "Let&apos;s dive",
    "In conclusion",
    "[confirm:",
    "搜索意图",
    "目标关键词",
    "内容简报",
    "本文将",
    "让我们深入",
    "总而言之",
    "[待确认：",
  ]) {
    expect(article.markup).not.toContain(authorFacingOrAiPhrase);
  }
}

function getOpeningParagraph(markup: string): string {
  const openingParagraph = markup.match(/^<article><p>(.*?)<\/p>/);

  if (openingParagraph === null) {
    throw new Error("Article markup must start with an opening paragraph.");
  }

  return openingParagraph[1];
}

it("does not render the AgentHunter friend link in either Robin-guide locale", () => {
  for (const articleMarkup of [
    renderArticle(WhereIsRobinEnglishArticle),
    renderArticle(WhereIsRobinChineseArticle),
  ]) {
    expect(articleMarkup).not.toContain("AgentHunter friend link");
    expect(articleMarkup).not.toContain("https://www.agenthunter.io");
    expect(articleMarkup).not.toContain("AgentHunter Badge");
  }
});

it("renders sourced English and Chinese carpenter guides with matching section counts", () => {
  const englishArticle: ArticleFixture = {
    markup: renderArticle(CarpenterStardewEnglishArticle),
    requiredPhrases: ["24 Mountain Road", "09:00", "1.6.15"],
    scheduleBoundaryPhrases: [
      "Friday service ends at 16:00.",
      "Tuesday is normally closed, while rain can change the schedule.",
    ],
    constructionClosurePhrase:
      "If Robin is constructing a new farm building, she is working at your farm and the shop is closed.",
    houseCounterDistinctionPhrase:
      "Entering the building is not proof that you can place an order.",
    planningInformationGainPhrase:
      "Moving a building is free, takes effect immediately, and keeps its contents inside.",
    plannerPath: "/",
    selectedFarmPlannerPath: "/?farmType=meadowlands",
    officialSource: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
    mediaPaths: [
      "/blog/illustrations/carpenter-building-layout.webp",
      "/blog/illustrations/carpenter-building-move.webp",
      "/blog/video-posters/carpenter-coop-guide.webp",
    ],
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
    planningInformationGainPhrase: "搬动建筑免费且立即生效，建筑内的物品会跟着一起移动。",
    plannerPath: "/zh",
    selectedFarmPlannerPath: "/zh?farmType=meadowlands",
    officialSource: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
    mediaPaths: [
      "/blog/illustrations/carpenter-building-layout.webp",
      "/blog/illustrations/carpenter-building-move.webp",
      "/blog/video-posters/carpenter-coop-guide.webp",
    ],
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
    planningInformationGainPhrase:
      "Finding Robin and reaching an open service counter are two different problems.",
    plannerPath: "/",
    selectedFarmPlannerPath: "/?farmType=meadowlands",
    officialSource: "https://wiki.stardewvalley.net/Robin",
    mediaPaths: [
      "/blog/illustrations/robin-location-routes.webp",
      "/blog/illustrations/robin-schedule-states.webp",
      "/blog/video-posters/robin-location-guide.webp",
    ],
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
    planningInformationGainPhrase: "找到罗宾和找到正在营业的柜台，是两个不同的问题。",
    plannerPath: "/zh",
    selectedFarmPlannerPath: "/zh?farmType=meadowlands",
    officialSource: "https://wiki.stardewvalley.net/Robin",
    mediaPaths: [
      "/blog/illustrations/robin-location-routes.webp",
      "/blog/illustrations/robin-schedule-states.webp",
      "/blog/video-posters/robin-location-guide.webp",
    ],
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
