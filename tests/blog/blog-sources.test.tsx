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
import { GlasshouseStardewValleyEnglishArticle } from "../../src/blog/articles/glasshouse-stardew-valley.en";
import { GlasshouseStardewValleyChineseArticle } from "../../src/blog/articles/glasshouse-stardew-valley.zh";
import { OakTreeStardewEnglishArticle } from "../../src/blog/articles/oak-tree-stardew.en";
import { OakTreeStardewChineseArticle } from "../../src/blog/articles/oak-tree-stardew.zh";
import { StardewValleyTreesEnglishArticle } from "../../src/blog/articles/stardew-valley-trees.en";
import { StardewValleyTreesChineseArticle } from "../../src/blog/articles/stardew-valley-trees.zh";
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
        href: "https://wiki.stardewvalley.net/Shop_Schedules",
        label: "Stardew Valley Wiki: Shop Schedules",
      },
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
      { href: "https://wiki.stardewvalley.net/Carpenter%27s_Shop", label: "星露谷 Wiki：Carpenter Shop" },
      { href: "https://wiki.stardewvalley.net/Robin", label: "星露谷 Wiki：Robin" },
      { href: "https://wiki.stardewvalley.net/Shop_Schedules", label: "星露谷 Wiki：Shop Schedules" },
      { href: "https://wiki.stardewvalley.net/Telephone", label: "星露谷 Wiki：Telephone" },
    ],
  },
  {
    Article: StardewValleyNpcEnglishArticle,
    heading: "Sources",
    name: "English NPC article",
    sources: [
      { href: "https://wiki.stardewvalley.net/Villagers", label: "Stardew Valley Wiki: Villagers" },
      { href: "https://wiki.stardewvalley.net/Friendship", label: "Stardew Valley Wiki: Friendship" },
      { href: "https://wiki.stardewvalley.net/Robin", label: "Stardew Valley Wiki: Robin" },
      {
        href: "https://wiki.stardewvalley.net/Carpenter%27s_Shop",
        label: "Stardew Valley Wiki: Carpenter's Shop",
      },
      {
        href: "https://wiki.stardewvalley.net/Marnie%27s_Ranch",
        label: "Stardew Valley Wiki: Marnie's Ranch",
      },
      { href: "https://wiki.stardewvalley.net/Pierre%27s_General_Store", label: "Stardew Valley Wiki: Pierre's General Store" },
      { href: "https://wiki.stardewvalley.net/Blacksmith", label: "Stardew Valley Wiki: Blacksmith" },
      { href: "https://wiki.stardewvalley.net/Fish_Shop", label: "Stardew Valley Wiki: Fish Shop" },
    ],
  },
  {
    Article: StardewValleyNpcChineseArticle,
    heading: "来源",
    name: "Chinese NPC article",
    sources: [
      { href: "https://wiki.stardewvalley.net/Villagers", label: "星露谷 Wiki：Villagers" },
      { href: "https://wiki.stardewvalley.net/Friendship", label: "星露谷 Wiki：Friendship" },
      { href: "https://wiki.stardewvalley.net/Robin", label: "星露谷 Wiki：Robin" },
      { href: "https://wiki.stardewvalley.net/Carpenter%27s_Shop", label: "星露谷 Wiki：Carpenter Shop" },
      { href: "https://wiki.stardewvalley.net/Marnie%27s_Ranch", label: "星露谷 Wiki：Marnie's Ranch" },
      { href: "https://wiki.stardewvalley.net/Pierre%27s_General_Store", label: "星露谷 Wiki：Pierre's General Store" },
      { href: "https://wiki.stardewvalley.net/Blacksmith", label: "星露谷 Wiki：Blacksmith" },
      { href: "https://wiki.stardewvalley.net/Fish_Shop", label: "星露谷 Wiki：Fish Shop" },
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
        note: "，出口、主要地点、采集和钓鱼资料核对日期：2026-09-05。",
      },
      { href: "https://zh.stardewvalleywiki.com/%E5%B1%85%E6%B0%91", label: "居民 — Stardew Valley Wiki" },
      { href: "https://zh.stardewvalleywiki.com/%E5%86%9C%E5%9C%BA", label: "农场 — Stardew Valley Wiki" },
      { href: "/zh/stardew-valley-npc", label: "星露谷 NPC 指南" },
      { href: "/zh/carpenter-stardew", label: "星露谷木匠指南" },
      { href: "/zh/where-is-robin-stardew-valley", label: "Robin 位置指南" },
      { href: "https://stardewvalleyplanner.art/zh", label: "星露谷农场规划器" },
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
      { href: "https://wiki.stardewvalley.net/Robin", label: "星露谷 Wiki：Robin" },
      { href: "https://wiki.stardewvalley.net/Carpenter%27s_Shop", label: "星露谷 Wiki：Carpenter Shop" },
      { href: "https://wiki.stardewvalley.net/Shop_Schedules", label: "星露谷 Wiki：Shop Schedules" },
      { href: "https://wiki.stardewvalley.net/Telephone", label: "星露谷 Wiki：Telephone" },
    ],
  },
  {
    Article: WhereIsStardewValleyLocatedEnglishArticle,
    checkedLabel: "Sources checked September 5, 2026.",
    heading: "Sources",
    name: "English location article",
    sources: [
      { href: "https://www.stardewvalley.net/about/", label: "Stardew Valley — About" },
      { href: "https://stardewvalleywiki.com/Setting", label: "Setting — Stardew Valley Wiki" },
      {
        href: "https://stardewvalleywiki.com/Pelican_Town",
        label: "Pelican Town — Stardew Valley Wiki",
      },
      { href: "https://stardewvalleywiki.com/The_Desert", label: "Calico Desert — Stardew Valley Wiki" },
      {
        href: "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
        label: "Eric Barone interview about Pacific Northwest influences — Portland Mercury",
      },
    ],
  },
  {
    Article: WhereIsStardewValleyLocatedChineseArticle,
    checkedLabel: "来源核对日期：2026-09-05。",
    heading: "来源",
    name: "Chinese location article",
    sources: [
      { href: "https://www.stardewvalley.net/about/", label: "《星露谷物语》— About" },
      { href: "https://stardewvalleywiki.com/Setting", label: "设定 — Stardew Valley Wiki" },
      { href: "https://stardewvalleywiki.com/Pelican_Town", label: "鹈鹕镇 — Stardew Valley Wiki" },
      { href: "https://stardewvalleywiki.com/The_Desert", label: "卡利科沙漠 — Stardew Valley Wiki" },
      {
        href: "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
        label: "Eric Barone 太平洋西北地区影响采访 — Portland Mercury",
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
        note: " — marriage-candidate roster checked in ego-browser on September 5, 2026.",
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
        note: " — version 1.15.11 shown during the browser check.",
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
        note: " — 可结婚角色名单已于 2026-09-05 通过 ego-browser 核对。",
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
        href: "https://www.nexusmods.com/stardewvalley/mods/3753",
        label: "SVE on Nexus",
        note: " — 浏览器核对到版本 1.15.11。",
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
    heading: "Sources",
    name: "English sprinkler article",
    sources: [
      { href: "https://stardewvalleywiki.com/Sprinkler", label: "Sprinkler" },
      {
        href: "https://stardewvalleywiki.com/Quality_Sprinkler",
        label: "Quality Sprinkler",
      },
      {
        href: "https://stardewvalleywiki.com/Iridium_Sprinkler",
        label: "Iridium Sprinkler",
      },
      {
        href: "https://stardewvalleywiki.com/Crafting#Sprinklers",
        label: "Crafting: Sprinklers",
      },
      {
        href: "https://stardewvalleywiki.com/Pierre%27s_General_Store",
        label: "Pierre's General Store",
      },
      { href: "https://stardewvalleywiki.com/Oasis", label: "Oasis" },
      { href: "https://stardewvalleywiki.com/Dwarf", label: "Dwarf" },
      {
        href: "https://stardewvalleywiki.com/Pressure_Nozzle",
        label: "Pressure Nozzle",
      },
      { href: "https://stardewvalleywiki.com/Enricher", label: "Enricher" },
      { href: "https://stardewvalleywiki.com/Greenhouse", label: "Greenhouse" },
      { href: "https://stardewvalleywiki.com/Garden_Pot", label: "Garden Pot" },
      {
        href: "https://stardewvalleywiki.com/Watering_Cans",
        label: "Watering Cans",
      },
      {
        href: "https://stardewvalleywiki.com/Deluxe_Retaining_Soil",
        label: "Deluxe Retaining Soil",
      },
      { href: "https://stardewvalleywiki.com/Farm_Maps", label: "Farm Maps" },
      { href: "https://stardewvalleywiki.com/Krobus", label: "Krobus" },
      {
        href: "https://stardewvalleywiki.com/Qi%27s_Walnut_Room",
        label: "Qi's Walnut Room",
      },
      {
        href: "https://stardewvalleywiki.com/Ginger_Island",
        label: "Ginger Island",
      },
      {
        href: "https://stardewvalleywiki.com/Fruit_Trees",
        label: "Fruit Trees",
      },
      {
        href: "https://stardewvalleywiki.com/Fiber_Seeds",
        label: "Fiber Seeds",
      },
      {
        href: "https://stardewvalleywiki.com/Slime_Hutch",
        label: "Slime Hutch",
      },
      {
        href: "https://stardewvalleywiki.com/Traveling_Cart",
        label: "Traveling Cart",
      },
      {
        href: "https://www.stardewvalley.net/stardew-valley-1-5-update-full-changelog/",
        label: "Stardew Valley 1.5 changelog",
      },
      {
        href: "https://www.stardewvalley.net/stardew-valley-1-5-update-out-now-on-pc/",
        label: "Stardew Valley 1.5 out now (Beach Farm wording)",
      },
      {
        href: "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
        label: "Stardew Valley 1.6 changelog",
      },
      { href: "/", label: "Stardew Valley Planner" },
    ],
  },
  {
    Article: SprinklerStardewChineseArticle,
    heading: "来源",
    name: "Chinese sprinkler article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/洒水器",
        label: "洒水器 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/优质洒水器",
        label: "优质洒水器 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/铱制洒水器",
        label: "铱制洒水器 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/加压喷头",
        label: "加压喷头 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/施肥器",
        label: "施肥器 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/温室",
        label: "温室 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/科罗布斯",
        label: "科罗布斯 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/下水道",
        label: "下水道 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/齐先生的核桃房",
        label: "齐先生的核桃房 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/花盆",
        label: "花盆 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/农场地图",
        label: "农场地图 - 星露谷物语官方中文维基",
      },
      {
        href: "https://zh.stardewvalleywiki.com/史莱姆屋",
        label: "史莱姆屋 - 星露谷物语官方中文维基",
      },
      {
        href: "/zh",
        label: "星露谷物语规划器（简体中文首页）",
      },
    ],
  },
  {
    Article: GlasshouseStardewValleyEnglishArticle,
    checkedLabel:
      "Checked against the Stardew Valley Wiki Greenhouse on September 5, 2026.",
    heading: "Sources",
    name: "English glasshouse article",
    sources: [
      {
            href: "https://wiki.stardewvalley.net/Greenhouse",
        label: "Stardew Valley Wiki: Greenhouse",
      },
    ],
  },
  {
    Article: GlasshouseStardewValleyChineseArticle,
    checkedLabel:
      "来源已于 2026 年 9 月 5 日根据星露谷物语 Wiki 温室页面核对。",
    heading: "来源",
    name: "Chinese glasshouse article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/温室",
        label: "星露谷物语 Wiki：温室",
      },
    ],
  },
  {
    Article: OakTreeStardewEnglishArticle,
    checkedLabel:
      "Oak growth, tapping, chopping, spacing, and 1.6 Fall leaf-shed checked against Stardew Valley Wiki pages on September 11, 2026. Median 18-day and 24-day figures are recorded as a wiki conflict and are not averaged. The planner is a placement sketch, not a growth or tapping simulation.",
    heading: "Sources",
    name: "English oak tree article",
    sources: [
      {
        href: "https://wiki.stardewvalley.net/Oak_Tree",
        label: "Stardew Valley Wiki: Oak Tree",
      },
      {
        href: "https://wiki.stardewvalley.net/Trees",
        label: "Stardew Valley Wiki: Trees",
      },
      {
        href: "https://wiki.stardewvalley.net/Acorn",
        label: "Stardew Valley Wiki: Acorn",
      },
      {
        href: "https://wiki.stardewvalley.net/Oak_Resin",
        label: "Stardew Valley Wiki: Oak Resin",
      },
      {
        href: "https://wiki.stardewvalley.net/Tapper",
        label: "Stardew Valley Wiki: Tapper",
      },
      {
        href: "https://wiki.stardewvalley.net/Heavy_Tapper",
        label: "Stardew Valley Wiki: Heavy Tapper",
      },
      {
        href: "https://wiki.stardewvalley.net/Tree_Fertilizer",
        label: "Stardew Valley Wiki: Tree Fertilizer",
      },
      {
        href: "https://wiki.stardewvalley.net/Fruit_Trees",
        label: "Stardew Valley Wiki: Fruit Trees",
      },
      {
        href: "https://wiki.stardewvalley.net/Keg",
        label: "Stardew Valley Wiki: Keg",
      },
    ],
  },
  {
    Article: OakTreeStardewChineseArticle,
    checkedLabel:
      "橡树、橡子、树液采集器、橡树树脂及相关配方已于 2026 年 9 月 11 日根据星露谷物语官方中文维基核对；规划器仅作树位预排，不模拟生长或采集。",
    heading: "资料来源",
    name: "Chinese oak tree article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/%E6%A9%A1%E6%A0%91",
        label: "星露谷物语官方中文维基：橡树",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E6%A9%A1%E5%AD%90",
        label: "星露谷物语官方中文维基：橡子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E6%A0%91%E6%B6%B2%E9%87%87%E9%9B%86%E5%99%A8",
        label: "星露谷物语官方中文维基：树液采集器",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E9%87%8D%E5%9E%8B%E6%A0%91%E6%B6%B2%E9%87%87%E9%9B%86%E5%99%A8",
        label: "星露谷物语官方中文维基：重型树液采集器",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E6%A9%A1%E6%A0%91%E6%A0%91%E8%84%82",
        label: "星露谷物语官方中文维基：橡树树脂",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E6%A0%91",
        label: "星露谷物语官方中文维基：树",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E6%A0%91%E8%82%A5",
        label: "星露谷物语官方中文维基：树肥",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E6%9E%9C%E6%A0%91",
        label: "星露谷物语官方中文维基：果树",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E5%B0%8F%E6%A1%B6",
        label: "星露谷物语官方中文维基：小桶",
      },
      {
        href: "https://zh.stardewvalleywiki.com/%E9%AB%98%E7%BA%A7%E7%94%9F%E9%95%BF%E6%BF%80%E7%B4%A0",
        label: "星露谷物语官方中文维基：高级生长激素",
      },
    ],
  },
  {
    Article: StardewValleyTreesEnglishArticle,
    heading: "Sources",
    name: "English trees article",
    sources: [
      { href: "https://stardewvalleywiki.com/Trees", label: "Stardew Valley Wiki: Trees" },
      {
        href: "https://stardewvalleywiki.com/Fruit_Trees",
        label: "Stardew Valley Wiki: Fruit Trees",
      },
      {
        href: "https://stardewvalleywiki.com/Tree_Fertilizer",
        label: "Stardew Valley Wiki: Tree Fertilizer",
      },
      {
        href: "https://stardewvalleywiki.com/Version_History#1.6.9",
        label: "Stardew Valley Wiki: Version History 1.6.9",
        note: " — 1.6.9 patch note: fruit-tree growth is no longer blocked by grass and seed spots.",
      },
      {
        href: "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog",
        label: "Official Stardew Valley 1.6 full changelog",
        note: " — 1.6: cannot plant trees in town; cannot plant trees in the Beach farm tunnel.",
      },
      { href: "/#planner", label: "Stardew Valley Planner" },
      { href: "/", label: "Stardew Valley Planner homepage" },
      {
        href: "/glasshouse-stardew-valley",
        label: "Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers",
      },
      {
        href: "/sprinkler-stardew",
        label: "Stardew Valley Sprinkler Layout: 4, 8 & 24 Tiles",
      },
    ],
  },
  {
    Article: StardewValleyTreesChineseArticle,
    heading: "来源",
    name: "Chinese trees article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%A0%91&amp;variant=zh-cn",
        label: "官方中文维基：树",
      },
      {
        href: "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%9E%9C%E6%A0%91&amp;variant=zh-cn",
        label: "官方中文维基：果树",
      },
      {
        href: "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=%E6%A0%91%E8%82%A5&amp;variant=zh-cn",
        label: "官方中文维基：树肥",
      },
      {
        href: "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog",
        label: "Stardew Valley 1.6 完整更新说明",
        note: " — 1.6：不能再在镇上种树，也不能在海滩农场隧道里种树。",
      },
      { href: "/zh#planner", label: "星露谷农场规划器（中文页）" },
      { href: "/zh/glasshouse-stardew-valley", label: "本站中文温室布局" },
      { href: "/zh/sprinkler-stardew", label: "本站中文洒水器布局" },
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
