import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { CarpenterStardewEnglishArticle } from "../../src/blog/articles/carpenter-stardew.en";
import { CarpenterStardewChineseArticle } from "../../src/blog/articles/carpenter-stardew.zh";
import { WhereIsRobinEnglishArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.en";
import { WhereIsRobinChineseArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.zh";
import { StardewValleyNpcEnglishArticle } from "../../src/blog/articles/stardew-valley-npc.en";
import { StardewValleyNpcChineseArticle } from "../../src/blog/articles/stardew-valley-npc.zh";

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

it("renders matching English and Chinese Stardew Valley NPC guides with sourced roster boundaries", () => {
  const englishMarkup = renderArticle(StardewValleyNpcEnglishArticle);
  const chineseMarkup = renderArticle(StardewValleyNpcChineseArticle);

  for (const markup of [englishMarkup, chineseMarkup]) {
    expect(markup).not.toContain("<h1");
    expect(markup).not.toContain("<iframe");
    expect(markup).not.toContain("[confirm:");
    expect(markup).not.toContain("[待确认：");
    expect(markup).not.toContain("tracks NPC");
    expect(markup).not.toContain("追踪 NPC");
    expect(markup).toContain("1.6.15");
    expect(markup).toContain("PC 1.6.15");
    expect(markup).toContain("46");
    expect(markup).toContain("34");
    expect(markup).toContain("12");
    expect(markup).toContain(
      'href="https://store.steampowered.com/news/app/413150/view/517448731263500640"',
    );
  }

  expect(englishMarkup).toContain("https://stardewvalleywiki.com/Villagers");
  expect(englishMarkup).toContain("https://stardewvalleywiki.com/Friendship");
  expect(chineseMarkup).toContain("https://zh.stardewvalleywiki.com/居民");
  expect(chineseMarkup).toContain("https://zh.stardewvalleywiki.com/友谊");

  const englishOpeningParagraph = getOpeningParagraph(englishMarkup);
  const chineseOpeningParagraph = getOpeningParagraph(chineseMarkup);

  expect(englishOpeningParagraph).toContain("uses the PC 1.6.15 roster");
  expect(englishOpeningParagraph).not.toContain("current stable release");
  expect(englishOpeningParagraph).toContain("12 marriage candidates");
  expect(englishOpeningParagraph).toContain("22 giftable characters");
  expect(englishOpeningParagraph).not.toContain("If your search was");
  expect(chineseOpeningParagraph).toContain("按 PC 1.6.15 整理");
  expect(chineseOpeningParagraph).not.toContain("当前最新正式版");
  expect(chineseOpeningParagraph).toContain("12 名可结婚角色");
  expect(chineseOpeningParagraph).toContain("22 名可送礼但不可结婚的角色");
  expect(chineseOpeningParagraph).not.toContain("如果你搜的是");
  expect(chineseOpeningParagraph).not.toContain("按这套明确口径计算");

  expect(englishMarkup.toLowerCase()).toContain("stardew valley npc list");
  expect(englishMarkup).toContain("34 giftable villagers");
  expect(englishMarkup).toContain("12 non-giftable NPCs");
  expect(englishMarkup).toContain("The player&#x27;s children, monsters, Junimos");
  expect(englishMarkup).not.toContain("Children, monsters, Junimos");
  expect(englishMarkup).toContain("birthday event multiplier is eight");
  expect(englishMarkup).toContain(
    '<a class="blog-planner-link" href="/#planner">',
  );
  expect(englishMarkup).toContain('href="/carpenter-stardew"');
  expect(englishMarkup).toContain('href="/where-is-robin-stardew-valley"');
  expect(englishMarkup).toContain(
    "The planner handles the farm layout; it does not track either NPC&#x27;s live schedule.",
  );
  expect(englishMarkup).toContain("<h2>Source</h2>");
  expect(englishMarkup).toContain("Stardew Valley Wiki: Villagers");
  expect(englishMarkup).not.toContain("update boundary");
  expect(englishMarkup).not.toContain("Sources and version notes");
  expect(englishMarkup).toContain('class="blog-faq-list"');
  expect(englishMarkup).toContain("How many NPCs are in Stardew Valley?");
  expect(englishMarkup.match(/class="blog-faq-item"/g)).toHaveLength(5);

  expect(chineseMarkup).toContain("星露谷 NPC 列表");
  expect(chineseMarkup).toContain("34 位可送礼村民");
  expect(chineseMarkup).toContain("12 位不可送礼 NPC");
  expect(chineseMarkup).toContain("玩家的孩子、怪物、祝尼魔");
  expect(chineseMarkup).not.toContain(
    "数字才有意义。孩子、怪物、祝尼魔、农场动物和玩家角色",
  );
  expect(chineseMarkup).toContain("生日倍率是 8 倍");
  expect(chineseMarkup).toContain(
    '<a class="blog-planner-link" href="/zh#planner">',
  );
  expect(chineseMarkup).toContain('href="/zh/carpenter-stardew"');
  expect(chineseMarkup).toContain('href="/zh/where-is-robin-stardew-valley"');
  expect(chineseMarkup).toContain("规划器只处理农场布局，不会追踪两位 NPC 的实时行程。");
  expect(chineseMarkup).toContain("<h2>来源</h2>");
  expect(chineseMarkup).toContain("星露谷 Wiki：居民");
  expect(chineseMarkup).not.toContain("更新边界");
  expect(chineseMarkup).not.toContain("参考与版本说明");
  expect(chineseMarkup).toContain('class="blog-faq-list"');
  expect(chineseMarkup).toContain("《星露谷物语》一共有多少 NPC？");
  expect(chineseMarkup.match(/class="blog-faq-item"/g)).toHaveLength(5);

  expect(countSecondLevelSections(englishMarkup)).toBeGreaterThanOrEqual(8);
  expect(countSecondLevelSections(chineseMarkup)).toBe(
    countSecondLevelSections(englishMarkup),
  );
  expect(englishMarkup.length).toBeGreaterThan(8500);
  expect(chineseMarkup.length).toBeGreaterThan(4200);
});

it("renders NPC tables and name rosters as readable, labelled content in both locales", () => {
  const localizedArticles = [
    {
      markup: renderArticle(StardewValleyNpcEnglishArticle),
      tableLabels: [
        "Stardew Valley NPC categories",
        "Stardew Valley marriage candidates",
        "Stardew Valley NPC services",
      ],
      firstSectionNote: "Stardew Valley Wiki: Villagers",
      authorInstruction: "Review the roster and relationship groups again",
    },
    {
      markup: renderArticle(StardewValleyNpcChineseArticle),
      tableLabels: ["星露谷 NPC 分类", "星露谷可结婚角色", "星露谷 NPC 服务"],
      firstSectionNote: "星露谷 Wiki：居民",
      authorInstruction: "应重新核对角色名单和关系分类",
    },
  ] as const;

  for (const article of localizedArticles) {
    expect(article.markup.match(/class="blog-table-scroll"/g)).toHaveLength(3);
    expect(article.markup.match(/class="blog-name-grid"/g)).toHaveLength(2);
    for (const tableLabel of article.tableLabels) {
      expect(article.markup).toContain(`role="region" aria-label="${tableLabel}"`);
    }
    expect(article.markup).toContain("<li>Caroline</li>");
    expect(article.markup).toContain("<li>Professor Snail</li>");

    const firstSectionStart = article.markup.indexOf("<h2");
    const secondSectionStart = article.markup.indexOf("<h2", firstSectionStart + 1);
    const firstSectionMarkup = article.markup.slice(firstSectionStart, secondSectionStart);
    expect(firstSectionMarkup).not.toContain(article.firstSectionNote);
    expect(article.markup).not.toContain(article.authorInstruction);
  }
});

it("renders sourced English and Chinese carpenter guides with matching section counts", () => {
  const englishArticle: ArticleFixture = {
    markup: renderArticle(CarpenterStardewEnglishArticle),
    requiredPhrases: [
      "carpenter stardew",
      "24 Mountain Road",
      "PC 1.6.15",
      "Stardew Valley Wiki: Carpenter",
    ],
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
    requiredPhrases: [
      "星露谷木匠",
      "24 Mountain Road",
      "PC 1.6.15",
      "星露谷 Wiki：木匠的商店",
    ],
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
    officialSource: "https://zh.stardewvalleywiki.com/木匠的商店",
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
  expect(englishArticle.markup).toContain("<h2>Source</h2>");
  expect(chineseArticle.markup).toContain("<h2>来源</h2>");
  expect(englishArticle.markup).toContain('class="blog-faq-list"');
  expect(chineseArticle.markup).toContain('class="blog-faq-list"');
  expect(englishArticle.markup.match(/class="blog-faq-item"/g)).toHaveLength(3);
  expect(chineseArticle.markup.match(/class="blog-faq-item"/g)).toHaveLength(3);
  expect(englishArticle.markup).toContain("Why can I enter Robin");
  expect(englishArticle.markup).toContain("house but not place an order?");
  expect(englishArticle.markup).not.toContain("Robin&amp;apos;");
  expect(englishArticle.markup).not.toContain("Robin&apos;s");
});

it("renders sourced English and Chinese Robin-location guides with matching section counts", () => {
  const englishArticle: ArticleFixture = {
    markup: renderArticle(WhereIsRobinEnglishArticle),
    requiredPhrases: [
      "where is Robin in Stardew Valley",
      "24 Mountain Road",
      "1.6.15",
      "Stardew Valley Wiki: Robin",
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
      "1.6.15",
      "星露谷 Wiki：罗宾",
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
    officialSource: "https://zh.stardewvalleywiki.com/罗宾",
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
  expect(englishArticle.markup).toContain("<h2>Source</h2>");
  expect(chineseArticle.markup).toContain("<h2>来源</h2>");
  expect(englishArticle.markup).not.toContain('class="blog-faq-list"');
  expect(chineseArticle.markup).not.toContain('class="blog-faq-list"');
});
