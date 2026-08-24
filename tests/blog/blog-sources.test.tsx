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
