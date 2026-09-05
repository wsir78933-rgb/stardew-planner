import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle } from "../../src/blog/articles/stardew-valley-expanded-bachelors-and-bachelorettes.en";
import { StardewValleyExpandedBachelorsAndBachelorettesChineseArticle } from "../../src/blog/articles/stardew-valley-expanded-bachelors-and-bachelorettes.zh";
import { getBlogPostBySlug } from "../../src/blog/blog-post-registry";

const slug = "stardew-valley-expanded-bachelors-and-bachelorettes";
const englishTitle =
  "Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes";
const englishDescription =
  "Meet all 7 Stardew Valley Expanded marriage candidates, check who is available early, unlock Scarlett and Lance, and plan gifts and marriage steps.";
const chineseTitle = "星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物";
const chineseDescription =
  "整理星露谷 SVE 当前 7 位可结婚角色，核对斯嘉丽与兰斯的出现条件、入门最爱礼物和原版结婚流程。";

function renderArticle(
  Component:
    | typeof StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle
    | typeof StardewValleyExpandedBachelorsAndBachelorettesChineseArticle,
): string {
  return renderToStaticMarkup(createElement(Component));
}

function countSecondLevelSections(markup: string): number {
  return (markup.match(/<h2/g) ?? []).length;
}

it("locks paired registry metadata for the SVE bachelors article", () => {
  expect(getBlogPostBySlug("en", slug)).toMatchObject({
    title: englishTitle,
    description: englishDescription,
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      alt: "Original illustration of seven villagers at a vineyard and town square, no copyrighted sprites",
    },
  });
  expect(getBlogPostBySlug("zh-CN", slug)).toMatchObject({
    title: chineseTitle,
    description: chineseDescription,
    readTimeMinutes: 12,
    coverImage: {
      src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
      alt: "葡萄园与小镇广场上七位村民相聚的原创插画，未使用受版权保护的游戏立绘",
    },
  });
});

it("renders sourced English and Chinese SVE marriage bodies with matching section counts", () => {
  const englishMarkup = renderArticle(
    StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle,
  );
  const chineseMarkup = renderArticle(
    StardewValleyExpandedBachelorsAndBachelorettesChineseArticle,
  );

  for (const markup of [englishMarkup, chineseMarkup]) {
    expect(markup).not.toContain("<h1");
    expect(markup).not.toContain("<iframe");
    expect(markup).not.toContain("youtube.com");
    expect(markup).not.toContain("youtube-nocookie.com");
    expect(markup).not.toContain("[confirm:");
    expect(markup).not.toContain("[待确认：");
    expect(markup).not.toContain("tracks NPC");
    expect(markup).not.toContain("追踪 NPC");
    expect(markup).not.toContain('href="/mods"');
    expect(markup).not.toContain('href="/zh/mods"');
    expect(markup).toContain("1.15.11");
    expect(markup.match(/class="blog-faq-item"/g)).toHaveLength(5);
    expect(markup.match(/class="blog-table-scroll"/g)).toHaveLength(3);
  }

  expect(englishMarkup).toMatch(/^<article><p>/);
  expect(chineseMarkup).toMatch(/^<article><p>/);
  expect(englishMarkup).toContain(
    '<a class="blog-planner-link" href="/#planner">',
  );
  expect(chineseMarkup).toContain(
    '<a class="blog-planner-link" href="/zh#planner">',
  );
  expect(englishMarkup).toContain('href="/stardew-valley-npc"');
  expect(englishMarkup).toContain('href="/carpenter-stardew"');
  expect(chineseMarkup).toContain('href="/zh/stardew-valley-npc"');
  expect(chineseMarkup).toContain('href="/zh/carpenter-stardew"');
  expect(englishMarkup).toContain("Claire");
  expect(englishMarkup).toContain("How many Stardew Valley Expanded marriage candidates");
  expect(chineseMarkup).toContain("克莱尔");
  expect(chineseMarkup).toContain("星露谷 SVE 当前有几位可结婚角色？");
  expect(englishMarkup).toContain("<h2>Sources</h2>");
  expect(chineseMarkup).toContain("来源");
    expect(englishMarkup).toContain("Scarlett");
    expect(englishMarkup).toContain("Monster Mushroom");
    expect(englishMarkup).toContain("Mermaid");
    expect(chineseMarkup).toContain("斯嘉丽");
    expect(chineseMarkup).toContain("美人鱼吊坠");
    expect(chineseMarkup).toContain("怪兽菇");
    expect(englishMarkup).not.toContain("Alesia, Isaac, and Camilla are planned");
    expect(englishMarkup).not.toContain("Friday, Saturday, and Sunday");
    expect(chineseMarkup).not.toContain("兔脚");
    expect(chineseMarkup).not.toContain("周五、周六、周日");
    expect(countSecondLevelSections(englishMarkup)).toBeGreaterThanOrEqual(8);
  expect(countSecondLevelSections(chineseMarkup)).toBe(
    countSecondLevelSections(englishMarkup),
  );
  expect(englishMarkup.length).toBeGreaterThan(7000);
  expect(chineseMarkup.length).toBeGreaterThan(3500);
});
