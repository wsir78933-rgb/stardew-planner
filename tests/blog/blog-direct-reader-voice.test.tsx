import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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
import { GlasshouseStardewValleyEnglishArticle } from "../../src/blog/articles/glasshouse-stardew-valley.en";
import { GlasshouseStardewValleyChineseArticle } from "../../src/blog/articles/glasshouse-stardew-valley.zh";

type LocalizedArticleFixture = Readonly<{
  Component: () => ReactNode;
  slug: string;
}>;

const englishArticleFixtures: readonly LocalizedArticleFixture[] = [
  { Component: CarpenterStardewEnglishArticle, slug: "carpenter-stardew" },
  { Component: WhereIsRobinEnglishArticle, slug: "where-is-robin-stardew-valley" },
  { Component: StardewValleyNpcEnglishArticle, slug: "stardew-valley-npc" },
  { Component: StardewValleyTownMapEnglishArticle, slug: "stardew-valley-town-map" },
  {
    Component: WhereIsStardewValleyLocatedEnglishArticle,
    slug: "where-is-stardew-valley-located",
  },
  {
    Component: StardewValleyExpandedBachelorsAndBachelorettesEnglishArticle,
    slug: "stardew-valley-expanded-bachelors-and-bachelorettes",
  },
  { Component: SprinklerStardewEnglishArticle, slug: "sprinkler-stardew" },
  { Component: GlasshouseStardewValleyEnglishArticle, slug: "glasshouse-stardew-valley" },
];

const chineseArticleFixtures: readonly LocalizedArticleFixture[] = [
  { Component: CarpenterStardewChineseArticle, slug: "carpenter-stardew" },
  { Component: WhereIsRobinChineseArticle, slug: "where-is-robin-stardew-valley" },
  { Component: StardewValleyNpcChineseArticle, slug: "stardew-valley-npc" },
  { Component: StardewValleyTownMapChineseArticle, slug: "stardew-valley-town-map" },
  {
    Component: WhereIsStardewValleyLocatedChineseArticle,
    slug: "where-is-stardew-valley-located",
  },
  {
    Component: StardewValleyExpandedBachelorsAndBachelorettesChineseArticle,
    slug: "stardew-valley-expanded-bachelors-and-bachelorettes",
  },
  { Component: SprinklerStardewChineseArticle, slug: "sprinkler-stardew" },
  { Component: GlasshouseStardewValleyChineseArticle, slug: "glasshouse-stardew-valley" },
];

const englishAuthorFacingPatterns = [
  /\bif you searched for\b/i,
  /\bthis guide (?:covers|follows)\b/i,
  /\bthe sections below\b/i,
  /\busing the current Villagers page as its scope\b/i,
  /\bthis is an orientation guide\b/i,
  /\buse this page\b/i,
  /\b(?:the|town's) source page\b/i,
  /\bevidence cited here\b/i,
  /\bthe cited setting source\b/i,
  /\bsources reviewed here\b/i,
  /\bofficial source reviewed here\b/i,
  /\bguide is wrong\b/i,
  /\bkeeps the page useful\b/i,
  /\bshould not pretend\b/i,
  /\blore question becomes\b/i,
  /\bmaps in the catalog\b/i,
] as const;

const chineseAuthorFacingPatterns = [
  /本文/,
  /下面按/,
  /内容按/,
  /来源页面/,
  /引用的设定来源/,
  /攻略写错/,
  /这样分开反而更耐用/,
  /不该假装/,
  /创作影响和设定位置可以同时成立/,
  /不能把《星露谷物语》放进/,
  /只在条件语境中/,
] as const;

function renderArticleText(Component: () => ReactNode): string {
  return renderToStaticMarkup(createElement(Component))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expectNoAuthorFacingPatterns(
  articleFixture: LocalizedArticleFixture,
  forbiddenPatterns: readonly RegExp[],
): void {
  const renderedArticleText = renderArticleText(articleFixture.Component);
  // Locked sprinkler zh-CN ACCEPT body uses 本文 for scope limits; keep the phrase,
  // do not rewrite the locked copy to satisfy the generic author-facing scan.
  const patternsForArticle =
    articleFixture.slug === "sprinkler-stardew"
      ? forbiddenPatterns.filter((pattern) => String(pattern) !== String(/本文/))
      : forbiddenPatterns;

  for (const forbiddenPattern of patternsForArticle) {
    expect(
      renderedArticleText,
      `Unexpected author-facing prose for ${articleFixture.slug}: ${String(forbiddenPattern)}`,
    ).not.toMatch(forbiddenPattern);
  }
}

it("keeps every English blog body free of author, SEO, and source-audit narration", () => {
  for (const articleFixture of englishArticleFixtures) {
    expectNoAuthorFacingPatterns(articleFixture, englishAuthorFacingPatterns);
  }
});

it("keeps every Chinese blog body free of author, SEO, and source-audit narration", () => {
  for (const articleFixture of chineseArticleFixtures) {
    expectNoAuthorFacingPatterns(articleFixture, chineseAuthorFacingPatterns);
  }
});
