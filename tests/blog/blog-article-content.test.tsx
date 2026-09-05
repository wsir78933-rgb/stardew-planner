import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { CarpenterStardewEnglishArticle } from "../../src/blog/articles/carpenter-stardew.en";
import { CarpenterStardewChineseArticle } from "../../src/blog/articles/carpenter-stardew.zh";
import { WhereIsRobinEnglishArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.en";
import { WhereIsRobinChineseArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.zh";
import { StardewValleyNpcEnglishArticle } from "../../src/blog/articles/stardew-valley-npc.en";
import { StardewValleyNpcChineseArticle } from "../../src/blog/articles/stardew-valley-npc.zh";
import { StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle } from "../../src/blog/articles/stardew-valley-expanded-bachelors-and-bachelorettes.en";
import { StardewValleyExpandedBachelorsAndBachelorettesChineseArticle } from "../../src/blog/articles/stardew-valley-expanded-bachelors-and-bachelorettes.zh";

type ArticleFixture = Readonly<{
  markup: string;
  requiredPhrases: readonly string[];
  scheduleBoundaryPhrases: readonly (string | RegExp)[];
  plannerPath: string;
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
    expect(markup).toContain("46");
    expect(markup).toContain("34");
    expect(markup).toContain("12");
  }

  expect(englishMarkup).toContain("https://wiki.stardewvalley.net/Villagers");
  expect(englishMarkup).toContain("https://wiki.stardewvalley.net/Friendship");
  expect(chineseMarkup).toContain("https://wiki.stardewvalley.net/Villagers");
  expect(chineseMarkup).toContain("https://wiki.stardewvalley.net/Friendship");

  const englishOpeningParagraph = getOpeningParagraph(englishMarkup);
  const chineseOpeningParagraph = getOpeningParagraph(chineseMarkup);

  expect(englishOpeningParagraph).toContain(
    "The Stardew Valley NPC list is easiest to use",
  );
  expect(englishOpeningParagraph).not.toContain("current stable release");
  expect(englishOpeningParagraph).toContain("12 marriage candidates");
  expect(englishOpeningParagraph).toContain("22 other giftable");
  expect(englishOpeningParagraph).not.toContain("If your search was");
  expect(chineseOpeningParagraph).toContain("查找《星露谷物语》NPC 时");
  expect(chineseOpeningParagraph).toContain("46 名角色");
  expect(chineseOpeningParagraph).toContain("12 名可结婚");
  expect(chineseOpeningParagraph).toContain("22 名可送礼但不可结婚");

  expect(englishMarkup.toLowerCase()).toContain("stardew valley npc list");
  expect(englishMarkup).toContain("34 giftable villagers");
  expect(englishMarkup).toContain("12 non-giftable NPCs");
  expect(englishMarkup).toContain("The gift log records items you have already given");
  expect(englishMarkup).toContain("birthday gift remains allowed");
  expect(englishMarkup).toContain(
    '<a class="blog-planner-link" href="/">',
  );
  expect(englishMarkup).toContain('href="/carpenter-stardew"');
  expect(englishMarkup).toContain('href="/where-is-robin-stardew-valley"');
  expect(englishMarkup).toContain("farm planner");
  expect(englishMarkup).toContain("<h2>Sources</h2>");
  expect(englishMarkup).toContain("Stardew Valley Wiki: Villagers");
  expect(englishMarkup).not.toContain("update boundary");
  expect(englishMarkup).not.toContain("Sources and version notes");
  expect(englishMarkup).toContain('class="blog-faq-list"');
  expect(englishMarkup).toContain("How many NPCs are in the Stardew Valley roster?");
  expect(englishMarkup.match(/class="blog-faq-item"/g)).toHaveLength(5);

  expect(chineseMarkup).toContain("星露谷 NPC 名单");
  expect(chineseMarkup).toContain("34 名居民接受普通礼物");
  expect(chineseMarkup).toContain("12 名不可送礼 NPC");
  expect(chineseMarkup).toContain("生日礼物即使在两份普通礼物用完后仍然可以送");
  expect(chineseMarkup).toContain('href="/zh"');
  expect(chineseMarkup).toContain('href="/zh/where-is-robin-stardew-valley"');
  expect(chineseMarkup).not.toContain("PC 1.6.15");
  expect(chineseMarkup).toContain("<h2>来源</h2>");
  expect(chineseMarkup).toContain("星露谷 Wiki：Villagers");
  expect(chineseMarkup).not.toContain("更新边界");
  expect(chineseMarkup).not.toContain("参考与版本说明");
  expect(chineseMarkup).toContain('class="blog-faq-list"');
  expect(chineseMarkup).toContain("《星露谷物语》有多少 NPC？");
  expect(chineseMarkup.match(/class="blog-faq-item"/g)).toHaveLength(5);

  expect(countSecondLevelSections(englishMarkup)).toBeGreaterThanOrEqual(8);
  expect(countSecondLevelSections(chineseMarkup)).toBe(
    countSecondLevelSections(englishMarkup),
  );
  expect(englishMarkup.length).toBeGreaterThan(8500);
  expect(chineseMarkup.length).toBeGreaterThan(4200);
});

it("renders matching English and Chinese SVE bachelors guides without overwriting vanilla NPC copy", () => {
  const englishMarkup = renderArticle(
    StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle,
  );
  const chineseMarkup = renderArticle(
    StardewValleyExpandedBachelorsAndBachelorettesChineseArticle,
  );

  for (const markup of [englishMarkup, chineseMarkup]) {
    expect(markup).not.toContain("<h1");
    expect(markup).not.toContain("<iframe");
    expect(markup).not.toContain("[confirm:");
    expect(markup).not.toContain("[待确认：");
    expect(markup).not.toContain("tracks NPC");
    expect(markup).not.toContain("追踪 NPC");
    expect(markup).toContain("1.15.11");
    expect(markup).toContain("7");
    expect(markup).toContain('class="blog-faq-list"');
    expect(markup.match(/class="blog-faq-item"/g)).toHaveLength(5);
  }

  const englishOpeningParagraph = getOpeningParagraph(englishMarkup);
  const chineseOpeningParagraph = getOpeningParagraph(chineseMarkup);

  expect(englishOpeningParagraph).toContain(
    "Stardew Valley Expanded currently adds seven marriage candidates",
  );
  expect(englishOpeningParagraph).not.toContain("If your search was");
  expect(chineseOpeningParagraph).toContain(
    "星露谷物语扩展版（SVE）当前的可结婚新增角色是 7 人",
  );
  expect(chineseOpeningParagraph).not.toContain("本文将");

  expect(englishMarkup).toContain(
    '<a class="blog-planner-link" href="/#planner">',
  );
  expect(englishMarkup).toContain('href="/stardew-valley-npc"');
  expect(englishMarkup).toContain("<h2>Sources</h2>");
  expect(chineseMarkup).toContain(
    '<a class="blog-planner-link" href="/zh#planner">',
  );
  expect(chineseMarkup).toContain('href="/zh/stardew-valley-npc"');
  expect(chineseMarkup).toContain("<h2>来源</h2>");
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
        "Stardew Valley NPC groups",
        "Stardew Valley marriage candidates",
        "Stardew Valley NPC service planning",
      ],
      firstSectionNote: "Stardew Valley Wiki: Villagers",
      authorInstruction: "Review the roster and relationship groups again",
    },
    {
      markup: renderArticle(StardewValleyNpcChineseArticle),
      tableLabels: ["星露谷 NPC 分类", "星露谷可结婚角色", "星露谷 NPC 服务与农场规划"],
      firstSectionNote: "星露谷 Wiki：居民",
      authorInstruction: "应重新核对角色名单和关系分类",
    },
  ] as const;

  for (const article of localizedArticles) {
    expect(article.markup.match(/class="blog-table-scroll"/g)).toHaveLength(3);
    expect(article.markup.match(/class="blog-name-grid"/g)).toHaveLength(2);
    for (const tableLabel of article.tableLabels) {
      expect(article.markup).toContain(`aria-label="${tableLabel}" class="blog-table-scroll"`);
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
      "24 Mountain Road",
      "Carpenter",
    ],
    scheduleBoundaryPhrases: [
      "Tuesday is normally a closure",
      "Friday ends at 4:00 PM",
    ],
    plannerPath: "/",
    officialSource: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
    mediaPaths: [
      "/blog/illustrations/carpenter-building-layout.webp",
      "/blog/illustrations/carpenter-building-move.webp",
    ],
  };
  const chineseArticle: ArticleFixture = {
    markup: renderArticle(CarpenterStardewChineseArticle),
    requiredPhrases: [
      "24 Mountain Road",
      "木匠商店能处理哪些事情",
    ],
    scheduleBoundaryPhrases: [
      "周二不要直接当作普通营业日",
      "周五 16:00 提前结束",
    ],
    plannerPath: "/zh",
    officialSource: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
    mediaPaths: [
      "/blog/illustrations/carpenter-building-layout.webp",
      "/blog/illustrations/carpenter-building-move.webp",
    ],
  };

  assertArticleContract(englishArticle);
  assertArticleContract(chineseArticle);
  expect(englishArticle.markup.match(/class="blog-planner-link"/g) ?? []).toHaveLength(1);
  expect(chineseArticle.markup.match(/class="blog-planner-link"/g) ?? []).toHaveLength(1);
  expect(englishArticle.markup).toContain(
    '<a class="blog-planner-link" href="/">',
  );
  expect(chineseArticle.markup).toContain('<a class="blog-planner-link" href="/zh">');
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
  expect(englishArticle.markup).toContain("<h2>Sources</h2>");
  expect(chineseArticle.markup).toContain("<h2>来源</h2>");
  expect(englishArticle.markup).toContain('class="blog-faq-list"');
  expect(chineseArticle.markup).toContain('class="blog-faq-list"');
  expect(englishArticle.markup.match(/class="blog-faq-item"/g)).toHaveLength(5);
  expect(chineseArticle.markup.match(/class="blog-faq-item"/g)).toHaveLength(5);
  expect(englishArticle.markup).toContain("What does the Telephone do?");
  expect(englishArticle.markup).not.toContain("This guide uses");
});

it("opens the Chinese carpenter article with a reader-facing definition", () => {
  const chineseMarkup = renderArticle(CarpenterStardewChineseArticle);
  const openingParagraph = getOpeningParagraph(chineseMarkup);

  expect(openingParagraph).toContain("在《星露谷物语》中，木匠商店是罗宾管理农场建筑和农舍改造的地方");
  expect(openingParagraph).toContain("24 Mountain Road");
  expect(openingParagraph).not.toContain("本文");
});

it("renders sourced English and Chinese Robin-location guides with matching section counts", () => {
  const englishArticle: ArticleFixture = {
    markup: renderArticle(WhereIsRobinEnglishArticle),
    requiredPhrases: [
      "24 Mountain Road",
      "Carpenter",
    ],
    scheduleBoundaryPhrases: [
      "Ordinary rain keeps Robin home",
      "ends at 4:00 PM",
    ],
    plannerPath: "/",
    officialSource: "https://wiki.stardewvalley.net/Robin",
    mediaPaths: [
      "/blog/illustrations/robin-location-routes.webp",
    ],
  };
  const chineseArticle: ArticleFixture = {
    markup: renderArticle(WhereIsRobinChineseArticle),
    requiredPhrases: [
      "罗宾住在",
      "24 Mountain Road",
      "木匠商店",
    ],
    scheduleBoundaryPhrases: [
      "雨天可能让周二恢复柜台服务",
      "周五 16:00 提前结束",
    ],
    plannerPath: "/zh",
    officialSource: "https://wiki.stardewvalley.net/Robin",
    mediaPaths: [
      "/blog/illustrations/robin-location-routes.webp",
    ],
  };

  assertArticleContract(englishArticle);
  assertArticleContract(chineseArticle);
  expect(englishArticle.markup.match(/class="blog-planner-link"/g) ?? []).toHaveLength(1);
  expect(chineseArticle.markup.match(/class="blog-planner-link"/g) ?? []).toHaveLength(1);
  expect(englishArticle.markup).toContain(
    '<a class="blog-planner-link" href="/">',
  );
  expect(chineseArticle.markup).toContain('<a class="blog-planner-link" href="/zh">');
  expect(englishArticle.markup).not.toContain(
    '<a class="blog-planner-link" href="https://wiki.stardewvalley.net/',
  );
  expect(chineseArticle.markup).not.toContain(
    '<a class="blog-planner-link" href="https://wiki.stardewvalley.net/',
  );
  expect(countSecondLevelSections(englishArticle.markup)).toBe(
    countSecondLevelSections(chineseArticle.markup),
  );
  expect(englishArticle.markup.length).toBeGreaterThan(8000);
  expect(chineseArticle.markup.length).toBeGreaterThan(5000);
  expect(getOpeningParagraph(englishArticle.markup)).toContain("24 Mountain Road");
  expect(getOpeningParagraph(englishArticle.markup)).toContain("9:00 AM to 5:00 PM");
  expect(getOpeningParagraph(chineseArticle.markup)).toContain("24 Mountain Road");
  expect(getOpeningParagraph(chineseArticle.markup)).toContain("09:00–17:00");
  expect(englishArticle.markup).toContain("<h2>Sources</h2>");
  expect(chineseArticle.markup).toContain("<h2>来源</h2>");
  expect(englishArticle.markup).toContain('class="blog-faq-list"');
  expect(chineseArticle.markup).toContain('class="blog-faq-list"');
  expect(englishArticle.markup.match(/class="blog-faq-item"/g)).toHaveLength(5);
  expect(chineseArticle.markup.match(/class="blog-faq-item"/g)).toHaveLength(5);
});
