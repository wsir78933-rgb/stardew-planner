import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { expect, it } from "vitest";
import { CarpenterStardewEnglishArticle } from "../../src/blog/articles/carpenter-stardew.en";
import { CarpenterStardewChineseArticle } from "../../src/blog/articles/carpenter-stardew.zh";
import { StardewValleyNpcEnglishArticle } from "../../src/blog/articles/stardew-valley-npc.en";
import { StardewValleyNpcChineseArticle } from "../../src/blog/articles/stardew-valley-npc.zh";
import { StardewValleyTownMapEnglishArticle } from "../../src/blog/articles/stardew-valley-town-map.en";
import { StardewValleyTownMapChineseArticle } from "../../src/blog/articles/stardew-valley-town-map.zh";
import { WhereIsRobinEnglishArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.en";
import { WhereIsRobinChineseArticle } from "../../src/blog/articles/where-is-robin-stardew-valley.zh";
import { WhereIsStardewValleyLocatedEnglishArticle } from "../../src/blog/articles/where-is-stardew-valley-located.en";
import { WhereIsStardewValleyLocatedChineseArticle } from "../../src/blog/articles/where-is-stardew-valley-located.zh";
import { StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle } from "../../src/blog/articles/stardew-valley-expanded-bachelors-and-bachelorettes.en";
import { StardewValleyExpandedBachelorsAndBachelorettesChineseArticle } from "../../src/blog/articles/stardew-valley-expanded-bachelors-and-bachelorettes.zh";
import { SprinklerStardewEnglishArticle } from "../../src/blog/articles/sprinkler-stardew.en";
import { SprinklerStardewChineseArticle } from "../../src/blog/articles/sprinkler-stardew.zh";
import { BlogSources } from "../../src/components/blog/blog-sources";

type ExpectedSource = Readonly<{
  href: string;
  label: string;
  note?: string;
}>;

type ArticleSourceExpectation = Readonly<{
  Article: () => ReactNode;
  checkedLabel?: string;
  heading: string;
  name: string;
  sources: readonly ExpectedSource[];
}>;

const articleSourceExpectations: readonly ArticleSourceExpectation[] = [
  {
    Article: CarpenterStardewEnglishArticle,
    heading: "Sources",
    name: "English carpenter article",
    sources: [
      {
        href: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
        label: "Stardew Valley Wiki: Carpenter's Shop",
      },
      { href: "https://wiki.stardewvalley.net/Robin", label: "Stardew Valley Wiki: Robin" },
      {
        href: "https://wiki.stardewvalley.net/Telephone",
        label: "Stardew Valley Wiki: Telephone",
      },
    ],
  },
  {
    Article: CarpenterStardewChineseArticle,
    heading: "来源",
    name: "Chinese carpenter article",
    sources: [
      { href: "https://zh.stardewvalleywiki.com/木匠的商店", label: "星露谷 Wiki：木匠的商店" },
      { href: "https://zh.stardewvalleywiki.com/罗宾", label: "星露谷 Wiki：罗宾" },
      { href: "https://zh.stardewvalleywiki.com/电话", label: "星露谷 Wiki：电话" },
    ],
  },
  {
    Article: StardewValleyNpcEnglishArticle,
    heading: "Sources",
    name: "English NPC article",
    sources: [
      { href: "https://stardewvalleywiki.com/Villagers", label: "Stardew Valley Wiki: Villagers" },
      { href: "https://stardewvalleywiki.com/Friendship", label: "Stardew Valley Wiki: Friendship" },
      {
        href: "https://stardewvalleywiki.com/Carpenter%27s_Shop",
        label: "Stardew Valley Wiki: Carpenter's Shop",
      },
      {
        href: "https://stardewvalleywiki.com/Marnie%27s_Ranch",
        label: "Stardew Valley Wiki: Marnie's Ranch",
      },
      { href: "https://stardewvalleywiki.com/Fish_Shop", label: "Stardew Valley Wiki: Fish Shop" },
      {
        href: "https://stardewvalleywiki.com/Wizard%27s_Tower",
        label: "Stardew Valley Wiki: Wizard's Tower",
      },
      {
        href: "https://store.steampowered.com/news/app/413150/view/517448731263500640",
        label: "Steam: PC 1.6.15 patch notes",
      },
    ],
  },
  {
    Article: StardewValleyNpcChineseArticle,
    heading: "来源",
    name: "Chinese NPC article",
    sources: [
      { href: "https://zh.stardewvalleywiki.com/居民", label: "星露谷 Wiki：居民" },
      { href: "https://zh.stardewvalleywiki.com/友谊", label: "星露谷 Wiki：友谊" },
      { href: "https://zh.stardewvalleywiki.com/木匠的商店", label: "星露谷 Wiki：木匠的商店" },
      { href: "https://zh.stardewvalleywiki.com/玛妮的牧场", label: "星露谷 Wiki：玛妮的牧场" },
      { href: "https://zh.stardewvalleywiki.com/鱼店", label: "星露谷 Wiki：鱼店" },
      { href: "https://zh.stardewvalleywiki.com/法师塔", label: "星露谷 Wiki：法师塔" },
      {
        href: "https://store.steampowered.com/news/app/413150/view/517448731263500640",
        label: "Steam：PC 1.6.15 补丁说明",
      },
    ],
  },
  {
    Article: StardewValleyTownMapEnglishArticle,
    heading: "Sources",
    name: "English town map article",
    sources: [
      {
        href: "https://stardewvalleywiki.com/Pelican_Town",
        label: "Pelican Town — Stardew Valley Wiki",
        note: ", checked 2026-08-22.",
      },
      { href: "/stardew-valley-npc", label: "Stardew Valley NPC guide" },
      { href: "/carpenter-stardew", label: "Stardew Valley carpenter guide" },
      { href: "/where-is-robin-stardew-valley", label: "Robin location guide" },
    ],
  },
  {
    Article: StardewValleyTownMapChineseArticle,
    heading: "来源",
    name: "Chinese town map article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/%E9%B9%88%E9%B9%95%E9%95%87",
        label: "鹈鹕镇 — Stardew Valley Wiki",
        note: "，核对日期：2026-08-22。",
      },
      { href: "/zh/stardew-valley-npc", label: "星露谷 NPC 指南" },
      { href: "/zh/carpenter-stardew", label: "星露谷木匠指南" },
      { href: "/zh/where-is-robin-stardew-valley", label: "Robin 位置指南" },
    ],
  },
  {
    Article: WhereIsRobinEnglishArticle,
    heading: "Sources",
    name: "English Robin article",
    sources: [
      { href: "https://wiki.stardewvalley.net/Robin", label: "Stardew Valley Wiki: Robin" },
      {
        href: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
        label: "Stardew Valley Wiki: Carpenter's Shop",
      },
      {
        href: "https://wiki.stardewvalley.net/Shop_Schedules",
        label: "Stardew Valley Wiki: Shop Schedules",
      },
      { href: "https://wiki.stardewvalley.net/Telephone", label: "Stardew Valley Wiki: Telephone" },
    ],
  },
  {
    Article: WhereIsRobinChineseArticle,
    heading: "来源",
    name: "Chinese Robin article",
    sources: [
      { href: "https://zh.stardewvalleywiki.com/罗宾", label: "星露谷 Wiki：罗宾" },
      { href: "https://zh.stardewvalleywiki.com/木匠的商店", label: "星露谷 Wiki：木匠的商店" },
      { href: "https://zh.stardewvalleywiki.com/营业时间表", label: "星露谷 Wiki：营业时间表" },
      { href: "https://zh.stardewvalleywiki.com/电话", label: "星露谷 Wiki：电话" },
    ],
  },
  {
    Article: WhereIsStardewValleyLocatedEnglishArticle,
    checkedLabel: "Sources checked August 23, 2026.",
    heading: "Sources",
    name: "English location article",
    sources: [
      { href: "https://www.stardewvalley.net/about/", label: "Stardew Valley — About" },
      { href: "https://stardewvalleywiki.com/Setting", label: "Setting — Stardew Valley Wiki" },
      {
        href: "https://stardewvalleywiki.com/Pelican_Town",
        label: "Pelican Town — Stardew Valley Wiki",
      },
      { href: "https://stardewvalleywiki.com/The_Desert", label: "The Desert — Stardew Valley Wiki" },
      {
        href: "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
        label: "Eric Barone interview about Pacific Northwest interests — Portland Mercury",
      },
    ],
  },
  {
    Article: WhereIsStardewValleyLocatedChineseArticle,
    checkedLabel: "来源核对日期：2026-08-23。",
    heading: "来源",
    name: "Chinese location article",
    sources: [
      { href: "https://www.stardewvalley.net/about/", label: "《星露谷物语》— About" },
      { href: "https://stardewvalleywiki.com/Setting", label: "设定 — Stardew Valley Wiki" },
      { href: "https://stardewvalleywiki.com/Pelican_Town", label: "鹈鹕镇 — Stardew Valley Wiki" },
      { href: "https://stardewvalleywiki.com/The_Desert", label: "沙漠 — Stardew Valley Wiki" },
      {
        href: "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
        label: "Eric Barone 太平洋西北地区兴趣采访 — Portland Mercury",
      },
    ],
  },
  {
    Article: StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle,
    heading: "Sources",
    name: "English SVE bachelors article",
    sources: [
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Villagers",
        label: "SVE Wiki: Villagers",
        note: " — 7 marriage candidates. Checked 25 August 2026.",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Claire",
        label: "SVE Wiki: Claire",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Olivia",
        label: "SVE Wiki: Olivia",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Sophia",
        label: "SVE Wiki: Sophia",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Scarlett",
        label: "SVE Wiki: Scarlett",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Lance",
        label: "SVE Wiki: Lance",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Magnus",
        label: "SVE Wiki: Magnus",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Victor",
        label: "SVE Wiki: Victor",
      },
      {
        href: "https://www.nexusmods.com/stardewvalley/mods/3753",
        label: "SVE on Nexus",
        note: " — main file 1.15.11.",
      },
      {
        href: "https://stardewvalleywiki.com/Marriage",
        label: "Stardew Valley Wiki: Marriage",
      },
      {
        href: "https://stardewvalleywiki.com/Friendship",
        label: "Stardew Valley Wiki: Friendship",
      },
      {
        href: "https://stardewvalleyplanner.art/",
        label: "Stardew Valley Planner",
      },
    ],
  },
  {
    Article: StardewValleyExpandedBachelorsAndBachelorettesChineseArticle,
    heading: "来源",
    name: "Chinese SVE bachelors article",
    sources: [
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Villagers",
        label: "SVE Wiki：Villagers",
        note: " — 7 名结婚对象。核对于 2026-08-25。",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Claire",
        label: "SVE Wiki：克莱尔",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Olivia",
        label: "SVE Wiki：奥利维亚",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Sophia",
        label: "SVE Wiki：索菲娅",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Scarlett",
        label: "SVE Wiki：斯嘉丽",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Lance",
        label: "SVE Wiki：兰斯",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Magnus",
        label: "SVE Wiki：马格努斯",
      },
      {
        href: "https://stardewvalleyexpanded.wiki.gg/wiki/Victor",
        label: "SVE Wiki：维克多",
      },
      {
        href: "https://stardew-valley-expanded.fandom.com/zh/wiki/%E6%98%9F%E9%9C%B2%E8%B0%B7%E7%89%A9%E8%AF%AD%E6%89%A9%E5%B1%95_Wiki?variant=zh-cn",
        label: "星露谷物语扩展 Wiki 中文首页",
      },
      {
        href: "https://www.nexusmods.com/stardewvalley/mods/3753",
        label: "SVE on Nexus",
        note: " — 主文件 1.15.11。",
      },
      {
        href: "https://zh.stardewvalleywiki.com/婚姻",
        label: "星露谷 Wiki：婚姻",
      },
      {
        href: "https://zh.stardewvalleywiki.com/友谊",
        label: "星露谷 Wiki：友谊",
      },
      {
        href: "https://stardewvalleyplanner.art/zh",
        label: "星露谷农场规划器",
      },
    ],
  },
  {
    Article: SprinklerStardewEnglishArticle,
    checkedLabel:
      "Ranges, upgrades, and greenhouse occupancy checked against those pages on 2026-08-29 for PC 1.6.15. The planner overlay is a placement preview, not a watering simulation.",
    heading: "Sources",
    name: "English sprinkler article",
    sources: [
      {
        href: "https://wiki.stardewvalley.net/Sprinkler",
        label: "Stardew Valley Wiki: Sprinkler",
      },
      {
        href: "https://wiki.stardewvalley.net/Quality_Sprinkler",
        label: "Stardew Valley Wiki: Quality Sprinkler",
      },
      {
        href: "https://wiki.stardewvalley.net/Iridium_Sprinkler",
        label: "Stardew Valley Wiki: Iridium Sprinkler",
      },
      {
        href: "https://wiki.stardewvalley.net/Pressure_Nozzle",
        label: "Stardew Valley Wiki: Pressure Nozzle",
      },
      {
        href: "https://wiki.stardewvalley.net/Greenhouse#Sprinklers",
        label: "Stardew Valley Wiki: Greenhouse sprinklers",
      },
    ],
  },
  {
    Article: SprinklerStardewChineseArticle,
    heading: "资料来源",
    name: "Chinese sprinkler article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%B4%92%E6%B0%B4%E5%99%A8&amp;variant=zh-cn",
        label: "星露谷物语官方中文维基：洒水器",
      },
      {
        href: "https://stardewvalleyplanner.art/zh",
        label: "星露谷物语农场规划器",
      },
    ],
  },
];

function getSourceSectionMarkup(articleMarkup: string, articleName: string) {
  const sourceSectionStart = articleMarkup.indexOf('<section class="blog-sources">');
  if (sourceSectionStart === -1) {
    throw new Error(`Missing source section in ${articleName}.`);
  }

  const sourceSectionEnd = articleMarkup.indexOf("</section>", sourceSectionStart);
  if (sourceSectionEnd === -1) {
    throw new Error(`Unclosed source section in ${articleName}.`);
  }

  return articleMarkup.slice(sourceSectionStart, sourceSectionEnd + "</section>".length);
}

function renderExpectedText(text: string) {
  const wrapperMarkup = renderToStaticMarkup(<span>{text}</span>);
  return wrapperMarkup.slice("<span>".length, -"</span>".length);
}

it("renders source links in a grouped Item list with an optional checked label", () => {
  const markup = renderToStaticMarkup(
    <BlogSources
      checkedLabel="Sources checked August 23, 2026."
      heading="Sources"
      items={[
        {
          href: "https://example.com/about",
          label: "About",
          note: "Checked August 23, 2026.",
        },
        { href: "https://example.com/wiki", label: "Wiki" },
      ]}
    />,
  );

  expect(markup).toContain('<section class="blog-sources">');
  expect(markup).toContain('data-slot="card"');
  expect(markup).toContain('data-slot="card-header"');
  expect(markup).toContain('data-slot="card-content"');
  expect(markup).toContain('data-slot="card-footer"');
  expect(markup).toContain("<h2>Sources</h2>");
  expect(markup).toContain("blog-sources__title-icon");
  expect(markup).toContain('role="list"');
  expect(markup.match(/role="listitem"/g) ?? []).toHaveLength(2);
  expect(markup.match(/data-slot="item"/g) ?? []).toHaveLength(2);
  expect(markup.match(/data-variant="outline"/g) ?? []).toHaveLength(2);
  expect(markup).toContain("blog-sources__item-icon");
  expect(markup).toContain("blog-sources__item-chevron");
  expect(markup).toContain("blog-sources__item-note");
  expect(markup).toContain('href="https://example.com/about"');
  expect(markup).toContain('href="https://example.com/wiki"');
  expect(markup).toContain("Checked August 23, 2026.");
  expect(markup).toContain("Sources checked August 23, 2026.");
});

it("preserves each localized article's source links, labels, notes, and order", () => {
  for (const expectation of articleSourceExpectations) {
    const articleMarkup = renderToStaticMarkup(<expectation.Article />);
    const sourceSectionMarkup = getSourceSectionMarkup(articleMarkup, expectation.name);

    expect(sourceSectionMarkup).toContain(`<h2>${expectation.heading}</h2>`);
    expect(sourceSectionMarkup.match(/<a href=/g) ?? []).toHaveLength(expectation.sources.length);

    let previousSourcePosition = -1;
    for (const source of expectation.sources) {
      const sourcePosition = sourceSectionMarkup.indexOf(`href="${source.href}"`);

      expect(sourcePosition, `Missing source "${source.href}" in ${expectation.name}.`).toBeGreaterThan(-1);
      expect(sourcePosition, `Source order changed in ${expectation.name}.`).toBeGreaterThan(
        previousSourcePosition,
      );
      const sourceLinkEnd = sourceSectionMarkup.indexOf("</a>", sourcePosition);
      const sourceLinkMarkup = sourceSectionMarkup.slice(sourcePosition, sourceLinkEnd);

      expect(sourceLinkMarkup).toContain(renderExpectedText(source.label));
      if (source.note) {
        expect(sourceLinkMarkup).toContain(renderExpectedText(source.note));
      }

      previousSourcePosition = sourcePosition;
    }

    if (expectation.checkedLabel) {
      expect(sourceSectionMarkup).toContain(
        `<p class="blog-sources__checked">${expectation.checkedLabel}</p>`,
      );
    } else {
      expect(sourceSectionMarkup).not.toContain('class="blog-sources__checked"');
    }
  }
});
