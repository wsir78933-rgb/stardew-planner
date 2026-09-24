import { existsSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProfitMarginStardewEnglishArticle } from "../../src/blog/articles/profit-margin-stardew.en";
import { ProfitMarginStardewChineseArticle } from "../../src/blog/articles/profit-margin-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

const projectRoot = join(import.meta.dirname, "../..");
const requiredPaths = [
  "src/blog/articles/profit-margin-stardew.en.tsx",
  "src/blog/articles/profit-margin-stardew.zh.tsx",
  "public/blog/profit-margin-stardew-cover.webp",
  "public/blog/profit-margin-stardew-cover.avif",
  "public/blog/illustrations/profit-margin-stardew-price-boundary.webp",
  "public/blog/illustrations/profit-margin-stardew-price-boundary.avif",
  "public/blog/illustrations/profit-margin-stardew-advanced-options.webp",
  "public/blog/illustrations/profit-margin-stardew-advanced-options.avif",
] as const;

it("registers the paired profit-margin-stardew identity and required local files", () => {
  for (const relativePath of requiredPaths) {
    const absolutePath = join(projectRoot, relativePath);
    expect(existsSync(absolutePath), `Missing required path: ${absolutePath}`).toBe(true);
  }

  expect(isBlogPostSlug("profit-margin-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/profit-margin-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/profit-margin-stardew/");
});

it("renders independent reader bodies with no page-level H1 or figure token placeholders", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(ProfitMarginStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(ProfitMarginStardewChineseArticle),
  );

  for (const markup of [englishMarkup, chineseMarkup]) {
    expect(markup).not.toContain("<h1");
    expect(markup).not.toContain("fig-01-price-boundary");
    expect(markup).not.toContain("fig-02-advanced-options-path");
    expect(markup.match(/<img /g) ?? []).toHaveLength(2);
    expect(markup.match(/loading="lazy"/g) ?? []).toHaveLength(2);
    expect(markup).toContain("<h2");
  }

  expect(englishMarkup).toContain("<h2>Sources</h2>");
  expect(chineseMarkup).toContain("<h2>资料来源</h2>");

  expect(englishMarkup).toContain(
    "/blog/illustrations/profit-margin-stardew-price-boundary.webp",
  );
  expect(englishMarkup).toContain(
    "/blog/illustrations/profit-margin-stardew-advanced-options.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/profit-margin-stardew-price-boundary.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/profit-margin-stardew-advanced-options.webp",
  );
});

it("keeps the Chinese article free of editorial and audit narration", () => {
  const markup = renderToStaticMarkup(createElement(ProfitMarginStardewChineseArticle));
  const articleText = markup.replace(/<[^>]+>/g, "");
  const forbiddenPhrases = [
    "来源明确列出的",
    "来源列举",
    "页面点名",
    "页面列出",
    "页面示例",
    "公开资料给出的高层路径",
    "平台中立",
    "不承诺所有平台按钮位置完全相同",
    "如果平台或版本细节未知",
    "文档化路径",
    "待核验",
    "没有公开依据",
    "未经验证",
    "本页只",
    "逐平台截图实测",
    "不应被写成",
    "共同支持",
    "不能扩写",
    "Checked",
    "This review",
  ];

  for (const phrase of forbiddenPhrases) {
    expect(markup, `Unexpected editorial phrase: ${phrase}`).not.toContain(phrase);
  }

  expect(articleText).toContain("资料查阅于2026年9月22日。");
  const textWithoutGameLabelsOrGold = articleText.replace(
    /Profit Margin|New Game|Advanced Options|Host New Farm|[\d,.]+g/g,
    "",
  );
  expect(textWithoutGameLabelsOrGold).not.toMatch(/[A-Za-z]/);
});

it("explains the necessary game labels at their first Chinese appearance", () => {
  const markup = renderToStaticMarkup(createElement(ProfitMarginStardewChineseArticle));
  const articleText = markup.replace(/<[^>]+>/g, "");
  const labelExplanations = [
    ["Profit Margin", "Profit Margin（利润率）"],
    ["New Game", "New Game（新建游戏）"],
    ["Advanced Options", "Advanced Options（高级游戏设置）"],
    ["Host New Farm", "Host New Farm（创建由自己主持的新农场）"],
  ] as const;

  for (const [label, explanation] of labelExplanations) {
    const firstLabelPosition = articleText.indexOf(label);
    expect(firstLabelPosition, `Missing game label: ${label}`).toBeGreaterThanOrEqual(0);
    expect(articleText.slice(firstLabelPosition, firstLabelPosition + explanation.length)).toBe(explanation);
  }

  const codeLabels = [...markup.matchAll(/<code>([^<]+)<\/code>/g)].map((match) => match[1]);
  expect([...new Set(codeLabels)].sort()).toEqual(labelExplanations.map(([label]) => label).sort());
});

it("preserves the Chinese price examples, source links, and localized reading path", () => {
  const markup = renderToStaticMarkup(createElement(ProfitMarginStardewChineseArticle));
  const articleText = markup.replace(/<[^>]+>/g, "");

  for (const value of ["100%", "75%", "50%", "25%", "0.75", "25g", "6g", "6.25g", "1g", "1,500g"]) {
    expect(articleText, `Missing price or multiplier: ${value}`).toContain(value);
  }
  expect(articleText).toContain("草籽、糖、小麦粉和大米");
  expect(articleText).toContain("铁匠、鱼店、旅行货车里的商品、建筑、工具升级和任务金币奖励不受利润率影响");
  expect(articleText).toContain("房主随后可以单独游玩该存档");
  expect(articleText).toContain("按钮位置和名称请以你正在玩的平台和版本为准");
  expect(markup).toContain('href="/zh/how-to-earn-money-stardew"');
  expect(markup).toContain('href="/zh#planner"');

  const sourcesStart = markup.indexOf('<section class="blog-sources">');
  expect(sourcesStart, "Missing Chinese source section").toBeGreaterThanOrEqual(0);
  const sourceLinks = [...markup.slice(sourcesStart).matchAll(/<a href="([^"]+)"/g)].map((match) => match[1]);
  expect(sourceLinks).toEqual([
    "https://zh.stardewvalleywiki.com/选项",
    "https://stardewvalleywiki.com/Options",
    "https://stardewvalleywiki.com/Multiplayer#Profit_margins",
    "https://stardewvalleywiki.com/Getting_Started",
  ]);
});

it("keeps the English body, captions, and alt text free of editorial and audit narration", () => {
  const markup = renderToStaticMarkup(createElement(ProfitMarginStardewEnglishArticle));
  const sourcesStart = markup.indexOf('<section class="blog-sources">');
  expect(sourcesStart, "Missing English source section").toBeGreaterThanOrEqual(0);
  const readerMarkup = markup.slice(0, sourcesStart);
  const forbiddenPhrases = [
    "rounding rule belongs next to",
    "source-backed",
    "mark it unclassified",
    "without source support",
    "not supplied enough input",
    "not a measured pacing result",
    "does not establish a completion date",
    "does not establish an existing-farm procedure",
    "without claiming that",
    "measured promise",
    "The public",
    "documented",
    "unsupported procedure",
    "not a promise",
    "so the examples are not mistaken",
    "platform-neutral",
  ];

  for (const phrase of forbiddenPhrases) {
    expect(readerMarkup, `Unexpected editorial phrase: ${phrase}`).not.toContain(phrase);
  }
});

it("preserves the English price boundaries, setup caveats, and source transparency", () => {
  const markup = renderToStaticMarkup(createElement(ProfitMarginStardewEnglishArticle));
  const articleText = markup.replace(/<[^>]+>/g, "");

  for (const value of ["100%", "75%", "50%", "25%", "0.75", "25g", "6g", "6.25g", "1g", "1,500g"]) {
    expect(articleText, `Missing price or multiplier: ${value}`).toContain(value);
  }
  expect(articleText).toContain("selected Joja");
  expect(articleText).toContain("Grass Starter, Sugar, Wheat Flour, and Rice");
  expect(articleText).toContain("Blacksmith, Fish Shop, Traveling Cart, buildings, tool upgrades, and quest gold rewards");
  expect(articleText).toContain("Profit Margin has four settings: 100%, 75%, 50%, and 25%. Lower settings reduce the prices affected by Profit Margin.");
  expect(articleText).toContain("platform and version");
  expect(markup).toContain('href="/how-to-earn-money-stardew"');
  expect(markup).toContain("Checked 2026-09-22 against Stardew Valley Wiki: Options and Multiplayer.");

  const sourcesStart = markup.indexOf('<section class="blog-sources">');
  expect(sourcesStart, "Missing English source section").toBeGreaterThanOrEqual(0);
  const sourceLinks = [...markup.slice(sourcesStart).matchAll(/<a href="([^"]+)"/g)].map((match) => match[1]);
  expect(sourceLinks).toEqual([
    "https://stardewvalleywiki.com/Options",
    "https://stardewvalleywiki.com/Multiplayer",
  ]);
});
