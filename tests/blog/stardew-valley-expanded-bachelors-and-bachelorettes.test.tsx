import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle } from "../../src/blog/articles/stardew-valley-expanded-bachelors-and-bachelorettes.en";
import { StardewValleyExpandedBachelorsAndBachelorettesChineseArticle } from "../../src/blog/articles/stardew-valley-expanded-bachelors-and-bachelorettes.zh";
import { getBlogPostBySlug } from "../../src/blog/blog-post-registry";

const slug = "stardew-valley-expanded-bachelors-and-bachelorettes";
const englishTitle = "7 Stardew Valley Expanded Bachelors and Bachelorettes";
const englishDescription =
  "See all 7 current SVE bachelors and bachelorettes, who is event-gated, starter loved gifts, and how to plan the farm after you choose.";
const chineseTitle =
  "当前星露谷SVE 可结婚角色完整名单是7人：克莱尔、兰斯、马格努斯、奥利维亚、斯嘉丽、索菲娅、维克多";
const chineseDescription =
  "先对照当前7位星露谷SVE可结婚角色名单，分清4位女性和3位男性，再核对克莱尔、斯嘉丽、兰斯的出现闸门和入门最爱礼物。选定对象后打开星露谷农场规划器，给农舍、配偶房和出货箱道路留空；规划器只做布局，不追踪红心或NPC行程。来源核对于2026年8月25日SVE Wiki村民页。";

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
  expect(englishMarkup).toContain("How many Stardew Valley Expanded bachelors");
  expect(chineseMarkup).toContain("克莱尔");
  expect(chineseMarkup).toContain("星露谷SVE 可结婚角色现在有几人？");
  expect(englishMarkup).toContain("<h2>Sources</h2>");
  expect(chineseMarkup).toContain("来源");
  expect(englishMarkup).toContain("Rabbit");
  expect(englishMarkup).toContain("tea saplings");
  expect(englishMarkup).toContain("Friday, Saturday, and Sunday");
  expect(chineseMarkup).toContain("兔脚");
  expect(chineseMarkup).toContain("茶树苗");
  expect(chineseMarkup).toContain("周五、周六、周日");
  expect(englishMarkup).toContain("Alesia, Isaac, and Camilla are planned");
  expect(countSecondLevelSections(englishMarkup)).toBeGreaterThanOrEqual(8);
  expect(countSecondLevelSections(chineseMarkup)).toBe(
    countSecondLevelSections(englishMarkup),
  );
  expect(englishMarkup.length).toBeGreaterThan(8500);
  expect(chineseMarkup.length).toBeGreaterThan(4200);
});
