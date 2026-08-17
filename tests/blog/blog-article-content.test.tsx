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
    requiredPhrases: ["carpenter stardew", "24 Mountain Road", "2026-08-16"],
    scheduleBoundaryPhrases: [
      "Tuesday is normally a closed-shop day, but rain keeps Robin at the counter.",
      "On Friday, treat 4:00 PM as the cutoff.",
    ],
    constructionClosurePhrase:
      "If Robin is working on a building at your farm, the shop is closed for that workday.",
    houseCounterDistinctionPhrase:
      "Being able to walk inside does not mean she can sell, build, or start an upgrade.",
    planningInformationGainPhrase: "The move is free, applies immediately, and carries the building contents with it.",
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
    requiredPhrases: ["星露谷木匠", "24 Mountain Road", "2026 年 8 月 16 日"],
    scheduleBoundaryPhrases: [
      "周二通常不营业，但下雨时罗宾会留在柜台。",
      "周五则以 16:00 为截止时间。",
    ],
    constructionClosurePhrase:
      "如果罗宾正在你的农场施工，木匠商店当天就会关闭。",
    houseCounterDistinctionPhrase: "能走进房子，不等于她能卖东西、接建筑订单或开始升级。",
    planningInformationGainPhrase: "移动免费、立即生效，建筑里的物品也会一起过去。",
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
  expect(englishArticle.markup.match(/class="blog-planner-link"/g) ?? []).toHaveLength(2);
  expect(chineseArticle.markup.match(/class="blog-planner-link"/g) ?? []).toHaveLength(2);
  expect(englishArticle.markup).toContain(
    '<a class="blog-planner-link" href="/">',
  );
  expect(englishArticle.markup).toContain(
    '<a class="blog-planner-link" href="/?farmType=meadowlands">',
  );
  expect(chineseArticle.markup).toContain(
    '<a class="blog-planner-link" href="/zh">',
  );
  expect(chineseArticle.markup).toContain(
    '<a class="blog-planner-link" href="/zh?farmType=meadowlands">',
  );
  expect(englishArticle.markup).not.toContain(
    '<a class="blog-planner-link" href="https://wiki.stardewvalley.net/',
  );
  expect(chineseArticle.markup).not.toContain(
    '<a class="blog-planner-link" href="https://wiki.stardewvalley.net/',
  );
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
    requiredPhrases: [
      "where is Robin in Stardew Valley",
      "24 Mountain Road",
      "2026-08-17",
      "1.6.15",
    ],
    scheduleBoundaryPhrases: [
      "Ordinary rain keeps her home and can open the counter on a Tuesday.",
      "Friday service ends at 4:00 PM.",
    ],
    constructionClosurePhrase:
      "If Robin is working at a construction site, she is there and the Carpenter&#x27;s Shop is closed.",
    houseCounterDistinctionPhrase:
      "Walking inside does not mean Robin can sell supplies, accept a building order, move a farm building, or begin a farmhouse upgrade.",
    planningInformationGainPhrase:
      "Use this order because a higher-priority schedule can replace the ordinary weekly routine:",
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
    requiredPhrases: [
      "星露谷物语罗宾在哪里",
      "24 Mountain Road",
      "2026 年 8 月 17 日",
      "1.6.15",
    ],
    scheduleBoundaryPhrases: [
      "普通雨天会让她留在家里，周二的柜台也可能因此营业。",
      "周五的服务在 16:00 结束。",
    ],
    constructionClosurePhrase:
      "如果罗宾正在你的农场工地施工，她就在农场，木匠商店也会关闭。",
    houseCounterDistinctionPhrase:
      "能走进房子，不代表罗宾能卖材料、接建筑订单、移动建筑或开始农舍升级。",
    planningInformationGainPhrase:
      "按这个顺序检查，因为优先级更高的行程会覆盖普通一周的安排：",
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
  expect(englishArticle.markup.match(/class="blog-planner-link"/g) ?? []).toHaveLength(2);
  expect(chineseArticle.markup.match(/class="blog-planner-link"/g) ?? []).toHaveLength(2);
  expect(englishArticle.markup).toContain(
    '<a class="blog-planner-link" href="/">',
  );
  expect(englishArticle.markup).toContain(
    '<a class="blog-planner-link" href="/?farmType=meadowlands">',
  );
  expect(chineseArticle.markup).toContain(
    '<a class="blog-planner-link" href="/zh">',
  );
  expect(chineseArticle.markup).toContain(
    '<a class="blog-planner-link" href="/zh?farmType=meadowlands">',
  );
  expect(englishArticle.markup).not.toContain(
    '<a class="blog-planner-link" href="https://wiki.stardewvalley.net/',
  );
  expect(chineseArticle.markup).not.toContain(
    '<a class="blog-planner-link" href="https://wiki.stardewvalley.net/',
  );
  expect(countSecondLevelSections(englishArticle.markup)).toBe(
    countSecondLevelSections(chineseArticle.markup),
  );
  expect(englishArticle.markup.length).toBeGreaterThan(5200);
  expect(chineseArticle.markup.length).toBeGreaterThan(2600);
  expect(getOpeningParagraph(englishArticle.markup)).toContain("24 Mountain Road");
  expect(getOpeningParagraph(englishArticle.markup)).toContain("9:00 AM to 5:00 PM");
  expect(getOpeningParagraph(chineseArticle.markup)).toContain("24 Mountain Road");
  expect(getOpeningParagraph(chineseArticle.markup)).toContain("09:00–17:00");
});
