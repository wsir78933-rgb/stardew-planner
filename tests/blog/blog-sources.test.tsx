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
import { MapleTreeStardewEnglishArticle } from "../../src/blog/articles/maple-tree-stardew.en";
import { MapleTreeStardewChineseArticle } from "../../src/blog/articles/maple-tree-stardew.zh";
import { BestSpringCropStardewEnglishArticle } from "../../src/blog/articles/best-spring-crop-stardew.en";
import { BestSpringCropStardewChineseArticle } from "../../src/blog/articles/best-spring-crop-stardew.zh";
import { HowToEarnMoneyStardewEnglishArticle } from "../../src/blog/articles/how-to-earn-money-stardew.en";
import { HowToEarnMoneyStardewChineseArticle } from "../../src/blog/articles/how-to-earn-money-stardew.zh";
import { RancherOrTillerStardewEnglishArticle } from "../../src/blog/articles/rancher-or-tiller-stardew.en";
import { RancherOrTillerStardewChineseArticle } from "../../src/blog/articles/rancher-or-tiller-stardew.zh";
import { SummerCropsStardewEnglishArticle } from "../../src/blog/articles/summer-crops-stardew.en";
import { SummerCropsStardewChineseArticle } from "../../src/blog/articles/summer-crops-stardew.zh";
import { FallCropsStardewEnglishArticle } from "../../src/blog/articles/fall-crops-stardew.en";
import { FallCropsStardewChineseArticle } from "../../src/blog/articles/fall-crops-stardew.zh";
import { HowToLevelUpFarmingStardewEnglishArticle } from "../../src/blog/articles/how-to-level-up-farming-stardew.en";
import { HowToLevelUpFarmingStardewChineseArticle } from "../../src/blog/articles/how-to-level-up-farming-stardew.zh";
import { LastDayToPlantStardewEnglishArticle } from "../../src/blog/articles/last-day-to-plant-stardew.en";
import { LastDayToPlantStardewChineseArticle } from "../../src/blog/articles/last-day-to-plant-stardew.zh";
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
  {
    Article: MapleTreeStardewEnglishArticle,
    checkedLabel:
      "Checked 2026-09-11 against Stardew Valley 1.6 wiki pages and the official 1.6 changelog. Median 24-day growth is taken from the Maple Tree and Trees pages; the Maple Seed page&#x27;s 18-day median is recorded as a conflict and is not adopted. Heavy Tapper Fall Green Rain transformation is cited as a wiki Bugs note. The planner is a placement sketch, not a growth or tapping simulation.",
    heading: "Sources",
    name: "English maple tree article",
    sources: [
      {
        href: "https://stardewvalleywiki.com/Maple_Tree",
        label: "Stardew Valley Wiki: Maple Tree",
      },
      {
        href: "https://stardewvalleywiki.com/Maple_Seed",
        label: "Stardew Valley Wiki: Maple Seed",
      },
      {
        href: "https://stardewvalleywiki.com/Maple_Syrup",
        label: "Stardew Valley Wiki: Maple Syrup",
      },
      {
        href: "https://stardewvalleywiki.com/Tapper",
        label: "Stardew Valley Wiki: Tapper",
      },
      {
        href: "https://stardewvalleywiki.com/Heavy_Tapper",
        label: "Stardew Valley Wiki: Heavy Tapper",
      },
      {
        href: "https://stardewvalleywiki.com/Trees",
        label: "Stardew Valley Wiki: Trees",
      },
      {
        href: "https://stardewvalleywiki.com/Tree_Fertilizer",
        label: "Stardew Valley Wiki: Tree Fertilizer",
      },
      {
        href: "https://stardewvalleywiki.com/Green_Rain_Trees",
        label: "Stardew Valley Wiki: Green Rain Trees",
      },
      {
        href: "https://stardewvalleywiki.com/Maple_Bar",
        label: "Stardew Valley Wiki: Maple Bar",
      },
      {
        href: "https://stardewvalleywiki.com/Fruit_Trees",
        label: "Stardew Valley Wiki: Fruit Trees",
      },
      {
        href: "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
        label: "Stardew Valley 1.6 Update Full Changelog",
      },
    ],
  },
  {
    Article: MapleTreeStardewChineseArticle,
    checkedLabel:
      "枫树、枫树种子、树液采集器、枫糖浆及相关配方已于 2026-09-11 按星露谷物语 1.6 与官方中文维基核对；树液采集器配方等级以官方 1.6 更新说明为准。规划器只预排树位，不产出枫糖浆。",
    heading: "资料来源",
    name: "Chinese maple tree article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/枫树",
        label: "星露谷物语官方中文维基：枫树",
      },
      {
        href: "https://zh.stardewvalleywiki.com/枫树种子",
        label: "星露谷物语官方中文维基：枫树种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/枫糖浆",
        label: "星露谷物语官方中文维基：枫糖浆",
      },
      {
        href: "https://zh.stardewvalleywiki.com/树液采集器",
        label: "星露谷物语官方中文维基：树液采集器",
      },
      {
        href: "https://zh.stardewvalleywiki.com/重型树液采集器",
        label: "星露谷物语官方中文维基：重型树液采集器",
      },
      {
        href: "https://zh.stardewvalleywiki.com/树肥",
        label: "星露谷物语官方中文维基：树肥",
      },
      {
        href: "https://zh.stardewvalleywiki.com/绿雨树",
        label: "星露谷物语官方中文维基：绿雨树",
      },
      {
        href: "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
        label: "ConcernedApe：Stardew Valley 1.6 完整更新说明",
      },
      {
        href: "https://stardewvalleywiki.com/Trees",
        label: "Stardew Valley Wiki: Trees",
        note: "（邻格、90%/38 日、镇内河东河西）",
      },
      {
        href: "https://stardewvalleywiki.com/Heavy_Tapper",
        label: "Stardew Valley Wiki: Heavy Tapper",
        note: "（Bugs：重型采集器秋季绿雨树）",
      },
      {
        href: "/zh#planner",
        label: "星露谷农场规划器",
      },
    ],
  },
  {
    Article: BestSpringCropStardewEnglishArticle,
    checkedLabel:
      "Checked 2026-09-12 against Stardew Valley 1.6.15 wiki pages and the official 1.6 changelog. Last-plant dates are derived as 28 minus grow days for a harvest on Spring 28, excluding the plant day, with no Speed-Gro and with watering on the plant day. Wiki gold/day figures are the Crops page values with no fertilizer and no Tiller. The planner is a placement sketch, not a gold calculator or crop simulator.",
    heading: "Sources",
    name: "English spring crop article",
    sources: [
      {
        href: "https://stardewvalleywiki.com/Crops",
        label: "Stardew Valley Wiki: Crops",
      },
      {
        href: "https://stardewvalleywiki.com/Egg_Festival",
        label: "Stardew Valley Wiki: Egg Festival",
      },
      {
        href: "https://stardewvalleywiki.com/Parsnip",
        label: "Stardew Valley Wiki: Parsnip",
      },
      {
        href: "https://stardewvalleywiki.com/Potato",
        label: "Stardew Valley Wiki: Potato",
      },
      {
        href: "https://stardewvalleywiki.com/Cauliflower",
        label: "Stardew Valley Wiki: Cauliflower",
      },
      {
        href: "https://stardewvalleywiki.com/Strawberry",
        label: "Stardew Valley Wiki: Strawberry",
      },
      {
        href: "https://stardewvalleywiki.com/Green_Bean",
        label: "Stardew Valley Wiki: Green Bean",
      },
      {
        href: "https://stardewvalleywiki.com/Rhubarb",
        label: "Stardew Valley Wiki: Rhubarb",
      },
      {
        href: "https://stardewvalleywiki.com/Garlic",
        label: "Stardew Valley Wiki: Garlic",
      },
      {
        href: "https://stardewvalleywiki.com/Coffee_Bean",
        label: "Stardew Valley Wiki: Coffee Bean",
      },
      {
        href: "https://stardewvalleywiki.com/Carrot",
        label: "Stardew Valley Wiki: Carrot",
      },
      {
        href: "https://stardewvalleywiki.com/Ancient_Fruit",
        label: "Stardew Valley Wiki: Ancient Fruit",
      },
      {
        href: "https://stardewvalleywiki.com/Speed-Gro",
        label: "Stardew Valley Wiki: Speed-Gro",
      },
      {
        href: "https://stardewvalleywiki.com/Scarecrow",
        label: "Stardew Valley Wiki: Scarecrow",
      },
      {
        href: "https://stardewvalleywiki.com/Sprinkler",
        label: "Stardew Valley Wiki: Sprinkler",
      },
      {
        href: "https://stardewvalleywiki.com/Farm_Maps",
        label: "Stardew Valley Wiki: Farm Maps",
      },
      {
        href: "https://stardewvalleywiki.com/Pierre%27s_General_Store",
        label: "Stardew Valley Wiki: Pierre's General Store",
      },
      {
        href: "https://www.stardewvalley.net/stardew-valley-1-6-update-full-changelog/",
        label: "Stardew Valley 1.6 Update Full Changelog",
      },
    ],
  },
  {
    Article: BestSpringCropStardewChineseArticle,
    checkedLabel:
      "复活节、防风草、土豆、花椰菜、草莓、农作物、大黄种子、蒜、咖啡豆、胡萝卜种子、青豆、生长激素与农场地图已于 2026-09-12 对照星露谷物语 1.6.15 中文维基；斧头敲 3 下以英文农作物页为准。最晚播种日由生长天数和 28 天季节推算，不是维基字段。规划器只是摆放草图，不浇水、不算金币、不买蛋节种子。",
    heading: "来源",
    name: "Chinese spring crop article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/复活节",
        label: "星露谷物语官方中文维基：复活节",
      },
      {
        href: "https://zh.stardewvalleywiki.com/防风草种子",
        label: "星露谷物语官方中文维基：防风草种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/土豆",
        label: "星露谷物语官方中文维基：土豆",
      },
      {
        href: "https://zh.stardewvalleywiki.com/花椰菜",
        label: "星露谷物语官方中文维基：花椰菜",
      },
      {
        href: "https://zh.stardewvalleywiki.com/草莓种子",
        label: "星露谷物语官方中文维基：草莓种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/农作物",
        label: "星露谷物语官方中文维基：农作物",
        note: "（生长天数、换季枯死、乌鸦、巨大作物、日均）",
      },
      {
        href: "https://stardewvalleywiki.com/Crops",
        label: "Stardew Valley Wiki: Crops",
        note: "（巨大作物斧头 3 下）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/大黄种子",
        label: "星露谷物语官方中文维基：大黄种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/蒜",
        label: "星露谷物语官方中文维基：蒜",
      },
      {
        href: "https://zh.stardewvalleywiki.com/咖啡豆",
        label: "星露谷物语官方中文维基：咖啡豆",
      },
      {
        href: "https://zh.stardewvalleywiki.com/胡萝卜种子",
        label: "星露谷物语官方中文维基：胡萝卜种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/青豆",
        label: "星露谷物语官方中文维基：青豆",
      },
      {
        href: "https://zh.stardewvalleywiki.com/生长激素",
        label: "星露谷物语官方中文维基：生长激素",
      },
      {
        href: "https://zh.stardewvalleywiki.com/农场地图",
        label: "星露谷物语官方中文维基：农场地图",
        note: "（草原农场开局干草）",
      },
      {
        href: "/zh#planner",
        label: "星露谷农场规划器",
      },
      {
        href: "/zh/sprinkler-stardew",
        label: "星露谷洒水器",
      },
      {
        href: "/zh/glasshouse-stardew-valley",
        label: "星露谷物语温室",
      },
    ],
  },
  {
    Article: HowToEarnMoneyStardewEnglishArticle,
    checkedLabel:
      "Checked 2026-09-13 against Stardew Valley wiki pages listed below (1.6 content including Fish Smoker). The planner is a placement sketch, not a gold calculator.",
    heading: "Sources",
    name: "English year 1 gold article",
    sources: [
      {
        href: "https://stardewvalleywiki.com/Gold",
        label: "Stardew Valley Wiki: Gold",
      },
      {
        href: "https://stardewvalleywiki.com/Day_Cycle",
        label: "Stardew Valley Wiki: Day Cycle",
      },
      {
        href: "https://stardewvalleywiki.com/Fishing",
        label: "Stardew Valley Wiki: Fishing",
      },
      {
        href: "https://stardewvalleywiki.com/Fish_Shop",
        label: "Stardew Valley Wiki: Fish Shop",
      },
      {
        href: "https://stardewvalleywiki.com/Fish_Smoker",
        label: "Stardew Valley Wiki: Fish Smoker",
      },
      {
        href: "https://stardewvalleywiki.com/Inventory",
        label: "Stardew Valley Wiki: Inventory",
      },
      {
        href: "https://stardewvalleywiki.com/Pierre%27s_General_Store",
        label: "Stardew Valley Wiki: Pierre's General Store",
      },
      {
        href: "https://stardewvalleywiki.com/Watering_Cans",
        label: "Stardew Valley Wiki: Watering Cans",
      },
      {
        href: "https://stardewvalleywiki.com/Energy",
        label: "Stardew Valley Wiki: Energy",
      },
      {
        href: "https://stardewvalleywiki.com/Potato",
        label: "Stardew Valley Wiki: Potato",
      },
      {
        href: "https://stardewvalleywiki.com/Strawberry",
        label: "Stardew Valley Wiki: Strawberry",
      },
      {
        href: "https://stardewvalleywiki.com/Egg_Festival",
        label: "Stardew Valley Wiki: Egg Festival",
      },
      {
        href: "https://stardewvalleywiki.com/Crops",
        label: "Stardew Valley Wiki: Crops",
      },
      {
        href: "https://stardewvalleywiki.com/Farming",
        label: "Stardew Valley Wiki: Farming",
      },
      {
        href: "https://stardewvalleywiki.com/Keg",
        label: "Stardew Valley Wiki: Keg",
      },
      {
        href: "https://stardewvalleywiki.com/Preserves_Jar",
        label: "Stardew Valley Wiki: Preserves Jar",
      },
      {
        href: "https://stardewvalleywiki.com/The_Mines",
        label: "Stardew Valley Wiki: The Mines",
      },
      {
        href: "https://stardewvalleywiki.com/Blacksmith",
        label: "Stardew Valley Wiki: Blacksmith",
      },
      {
        href: "https://stardewvalleywiki.com/Greenhouse",
        label: "Stardew Valley Wiki: Greenhouse",
      },
      {
        href: "https://stardewvalleywiki.com/Bundles",
        label: "Stardew Valley Wiki: Bundles",
      },
      {
        href: "https://stardewvalleywiki.com/Joja_Community_Development_Form",
        label: "Stardew Valley Wiki: Joja Community Development Form",
      },
      {
        href: "https://stardewvalleywiki.com/Skills",
        label: "Stardew Valley Wiki: Skills",
      },
    ],
  },
  {
    Article: HowToEarnMoneyStardewChineseArticle,
    checkedLabel:
      "2026-09-13 对照下方星露谷中文维基（含 1.6 熏鱼机）。规划器只是放置草图，不是金币计算器。",
    heading: "来源",
    name: "Chinese year 1 gold article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/金币",
        label: "星露谷物语官方中文维基：金币",
      },
      {
        href: "https://zh.stardewvalleywiki.com/钓鱼",
        label: "星露谷物语官方中文维基：钓鱼",
      },
      {
        href: "https://zh.stardewvalleywiki.com/鱼店",
        label: "星露谷物语官方中文维基：鱼店",
      },
      {
        href: "https://zh.stardewvalleywiki.com/熏鱼机",
        label: "星露谷物语官方中文维基：熏鱼机",
        note: "（1.6；威利不收熏鱼）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/物品栏",
        label: "星露谷物语官方中文维基：物品栏",
      },
      {
        href: "https://zh.stardewvalleywiki.com/喷壶",
        label: "星露谷物语官方中文维基：喷壶",
      },
      {
        href: "https://zh.stardewvalleywiki.com/土豆",
        label: "星露谷物语官方中文维基：土豆",
      },
      {
        href: "https://zh.stardewvalleywiki.com/草莓",
        label: "星露谷物语官方中文维基：草莓",
      },
      {
        href: "https://zh.stardewvalleywiki.com/复活节",
        label: "星露谷物语官方中文维基：复活节",
      },
      {
        href: "https://zh.stardewvalleywiki.com/农作物",
        label: "星露谷物语官方中文维基：农作物",
        note: "（生长天数不含种植当天、换季枯萎、缺水不停死）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/耕种",
        label: "星露谷物语官方中文维基：耕种",
      },
      {
        href: "https://zh.stardewvalleywiki.com/技能",
        label: "星露谷物语官方中文维基：技能",
        note: "（喷壶每次 2 点、抛竿 8 点、每级 −0.1）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/能量",
        label: "星露谷物语官方中文维基：能量",
      },
      {
        href: "https://zh.stardewvalleywiki.com/小桶",
        label: "星露谷物语官方中文维基：小桶",
      },
      {
        href: "https://zh.stardewvalleywiki.com/罐头瓶",
        label: "星露谷物语官方中文维基：罐头瓶",
      },
      {
        href: "https://zh.stardewvalleywiki.com/矿井",
        label: "星露谷物语官方中文维基：矿井",
      },
      {
        href: "https://zh.stardewvalleywiki.com/十字镐",
        label: "星露谷物语官方中文维基：十字镐",
      },
      {
        href: "https://zh.stardewvalleywiki.com/温室",
        label: "星露谷物语官方中文维基：温室",
      },
      {
        href: "https://zh.stardewvalleywiki.com/收集包",
        label: "星露谷物语官方中文维基：收集包",
        note: "（金库 42,500）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/Joja社区发展申请书",
        label: "星露谷物语官方中文维基：Joja社区发展申请书",
      },
      {
        href: "https://zh.stardewvalleywiki.com/皮埃尔的杂货店",
        label: "星露谷物语官方中文维基：皮埃尔的杂货店",
      },
      {
        href: "/zh#planner",
        label: "星露谷农场规划器",
      },
      {
        href: "/zh/best-spring-crop-stardew",
        label: "星露谷春天种什么",
      },
      {
        href: "/zh/sprinkler-stardew",
        label: "星露谷洒水器",
      },
      {
        href: "/zh/glasshouse-stardew-valley",
        label: "星露谷物语温室",
      },
      {
        href: "/zh/carpenter-stardew",
        label: "星露谷木匠商店",
      },
    ],
  },
  {
    Article: RancherOrTillerStardewEnglishArticle,
    checkedLabel:
      "Checked 2026-09-13 against Stardew Valley wiki pages listed below (1.6.15). The planner is a placement sketch, not a profession picker.",
    heading: "Sources",
    name: "English rancher or tiller article",
    sources: [
      { href: "https://stardewvalleywiki.com/Skills", label: "Stardew Valley Wiki: Skills" },
      { href: "https://stardewvalleywiki.com/Farming", label: "Stardew Valley Wiki: Farming" },
      {
        href: "https://stardewvalleywiki.com/Artisan_Goods",
        label: "Stardew Valley Wiki: Artisan Goods",
        note: "(Artisan +40%; oil and coffee excepted)",
      },
      {
        href: "https://stardewvalleywiki.com/Mayonnaise",
        label: "Stardew Valley Wiki: Mayonnaise",
        note: "(190g → Rancher 228g / Artisan 266g)",
      },
      { href: "https://stardewvalleywiki.com/Cheese", label: "Stardew Valley Wiki: Cheese" },
      { href: "https://stardewvalleywiki.com/Cloth", label: "Stardew Valley Wiki: Cloth" },
      { href: "https://stardewvalleywiki.com/Egg", label: "Stardew Valley Wiki: Egg" },
      { href: "https://stardewvalleywiki.com/Milk", label: "Stardew Valley Wiki: Milk" },
      {
        href: "https://stardewvalleywiki.com/Truffle",
        label: "Stardew Valley Wiki: Truffle",
        note: "(no Rancher)",
      },
      {
        href: "https://stardewvalleywiki.com/Truffle_Oil",
        label: "Stardew Valley Wiki: Truffle Oil",
        note: "(Artisan column only)",
      },
      { href: "https://stardewvalleywiki.com/Flowers", label: "Stardew Valley Wiki: Flowers" },
      { href: "https://stardewvalleywiki.com/Fruits", label: "Stardew Valley Wiki: Fruits" },
      {
        href: "https://stardewvalleywiki.com/Coffee_Bean",
        label: "Stardew Valley Wiki: Coffee Bean",
      },
      {
        href: "https://stardewvalleywiki.com/Sweet_Gem_Berry",
        label: "Stardew Valley Wiki: Sweet Gem Berry",
      },
      { href: "https://stardewvalleywiki.com/Oil", label: "Stardew Valley Wiki: Oil" },
      { href: "https://stardewvalleywiki.com/Honey", label: "Stardew Valley Wiki: Honey" },
      { href: "https://stardewvalleywiki.com/Wine", label: "Stardew Valley Wiki: Wine" },
      {
        href: "https://stardewvalleywiki.com/The_Sewers",
        label: "Stardew Valley Wiki: The Sewers",
        note: "(Statue of Uncertainty, 10,000g)",
      },
      {
        href: "https://stardewvalleywiki.com/Mastery_Cave",
        label: "Stardew Valley Wiki: Mastery Cave",
      },
      { href: "https://stardewvalleywiki.com/Farm_Maps", label: "Stardew Valley Wiki: Farm Maps" },
      { href: "https://stardewvalleywiki.com/Incubator", label: "Stardew Valley Wiki: Incubator" },
      { href: "/#planner", label: "Stardew Valley Planner" },
    ],
  },
  {
    Article: RancherOrTillerStardewChineseArticle,
    checkedLabel:
      "2026-09-13 对照下方星露谷中文维基（条目版本含 1.6.15 相关页）。规划器只是摆放草图，不能替你选职业。",
    heading: "来源",
    name: "Chinese rancher or tiller article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/技能",
        label: "星露谷物语官方中文维基：技能",
        note: "（农耕人 / 畜牧人、10 级分支、头衔、改职业）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/耕种",
        label: "星露谷物语官方中文维基：耕种",
        note: "（两列锁定、隐藏品质）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/工匠物品",
        label: "星露谷物语官方中文维基：工匠物品",
        note: "（工匠 +40%；醋、油、咖啡、树浆例外）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/蔬菜",
        label: "星露谷物语官方中文维基：蔬菜",
        note: "（农耕人 +10%）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/水果",
        label: "星露谷物语官方中文维基：水果",
        note: "（非采集水果加农耕人）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/花",
        label: "星露谷物语官方中文维基：花",
        note: "（甜豌豆、番红花不加农耕人）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/咖啡豆",
        label: "星露谷物语官方中文维基：咖啡豆",
        note: "（不加农耕人）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/松露",
        label: "星露谷物语官方中文维基：松露",
        note: "（不加畜牧人）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/松露油",
        label: "星露谷物语官方中文维基：松露油",
        note: "（工匠列，无畜牧人列）",
      },
      { href: "https://zh.stardewvalleywiki.com/蛋", label: "星露谷物语官方中文维基：蛋" },
      {
        href: "https://zh.stardewvalleywiki.com/蛋黄酱",
        label: "星露谷物语官方中文维基：蛋黄酱",
        note: "（190→畜牧人 228 / 工匠 266）",
      },
      { href: "https://zh.stardewvalleywiki.com/牛奶", label: "星露谷物语官方中文维基：牛奶" },
      { href: "https://zh.stardewvalleywiki.com/奶酪", label: "星露谷物语官方中文维基：奶酪" },
      { href: "https://zh.stardewvalleywiki.com/布料", label: "星露谷物语官方中文维基：布料" },
      { href: "https://zh.stardewvalleywiki.com/蜂蜜", label: "星露谷物语官方中文维基：蜂蜜" },
      { href: "https://zh.stardewvalleywiki.com/果酒", label: "星露谷物语官方中文维基：果酒" },
      { href: "https://zh.stardewvalleywiki.com/果酱", label: "星露谷物语官方中文维基：果酱" },
      {
        href: "https://zh.stardewvalleywiki.com/油",
        label: "星露谷物语官方中文维基：油",
        note: "（不加工匠）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/咖啡",
        label: "星露谷物语官方中文维基：咖啡",
        note: "（不加工匠）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/生长激素",
        label: "星露谷物语官方中文维基：生长激素",
        note: "（有农业学家共 20%）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/高级生长激素",
        label: "星露谷物语官方中文维基：高级生长激素",
        note: "（有农业学家共 35%）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/顶级生长激素",
        label: "星露谷物语官方中文维基：顶级生长激素",
        note: "（有农业学家共 43%）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/下水道",
        label: "星露谷物语官方中文维基：下水道",
        note: "（不确定雕像 10,000 金）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/精通山洞",
        label: "星露谷物语官方中文维基：精通山洞",
        note: "（耕种精通不是第二职业）",
      },
      {
        href: "https://zh.stardewvalleywiki.com/农场",
        label: "星露谷物语官方中文维基：农场",
        note: "（草原农场开局鸡舍不是必须畜牧人）",
      },
    ],
  },
  {
    Article: SummerCropsStardewEnglishArticle,
    checkedLabel:
      "Checked 2026-09-13 against Stardew Valley Wiki Summer, Crops, and the crop pages listed below. Last-plant dates are derived as 28 minus grow days for a harvest on Summer 28, excluding the plant day, with no Speed-Gro and with watering on the plant day. Wiki gold/day figures are the Crops page values with no fertilizer and no Tiller. The planner is a placement sketch; it does not compute gold/day, last-plant dates, or giant 1% rolls.",
    heading: "Sources",
    name: "English summer crops article",
    sources: [
      { href: "https://stardewvalleywiki.com/Summer", label: "Stardew Valley Wiki: Summer" },
      {
        href: "https://stardewvalleywiki.com/Crops",
        label: "Stardew Valley Wiki: Crops (gold per day)",
      },
      {
        href: "https://stardewvalleywiki.com/Pierre%27s_General_Store",
        label: "Stardew Valley Wiki: Pierre's General Store (Summer Stock)",
      },
      { href: "https://stardewvalleywiki.com/Starfruit", label: "Stardew Valley Wiki: Starfruit" },
      {
        href: "https://stardewvalleywiki.com/Starfruit_Seeds",
        label: "Stardew Valley Wiki: Starfruit Seeds",
      },
      { href: "https://stardewvalleywiki.com/Oasis", label: "Stardew Valley Wiki: Oasis" },
      { href: "https://stardewvalleywiki.com/The_Desert", label: "Stardew Valley Wiki: The Desert" },
      { href: "https://stardewvalleywiki.com/Bus_Stop", label: "Stardew Valley Wiki: Bus Stop" },
      { href: "https://stardewvalleywiki.com/Bundles", label: "Stardew Valley Wiki: Bundles (Vault)" },
      { href: "https://stardewvalleywiki.com/Blueberry", label: "Stardew Valley Wiki: Blueberry" },
      { href: "https://stardewvalleywiki.com/Melon", label: "Stardew Valley Wiki: Melon" },
      { href: "https://stardewvalleywiki.com/Hops", label: "Stardew Valley Wiki: Hops" },
      {
        href: "https://stardewvalleywiki.com/Red_Cabbage",
        label: "Stardew Valley Wiki: Red Cabbage",
      },
      { href: "https://stardewvalleywiki.com/Corn", label: "Stardew Valley Wiki: Corn" },
      { href: "https://stardewvalleywiki.com/Tomato", label: "Stardew Valley Wiki: Tomato" },
      { href: "https://stardewvalleywiki.com/Hot_Pepper", label: "Stardew Valley Wiki: Hot Pepper" },
      { href: "https://stardewvalleywiki.com/Radish", label: "Stardew Valley Wiki: Radish" },
      { href: "https://stardewvalleywiki.com/Wheat", label: "Stardew Valley Wiki: Wheat" },
      { href: "https://stardewvalleywiki.com/Poppy", label: "Stardew Valley Wiki: Poppy" },
      { href: "https://stardewvalleywiki.com/Sunflower", label: "Stardew Valley Wiki: Sunflower" },
      {
        href: "https://stardewvalleywiki.com/Summer_Squash",
        label: "Stardew Valley Wiki: Summer Squash",
      },
      {
        href: "https://stardewvalleywiki.com/Summer_Squash_Seeds",
        label: "Stardew Valley Wiki: Summer Squash Seeds",
      },
      {
        href: "https://stardewvalleywiki.com/Coffee_Bean",
        label: "Stardew Valley Wiki: Coffee Bean",
      },
      {
        href: "https://stardewvalleywiki.com/Ancient_Fruit",
        label: "Stardew Valley Wiki: Ancient Fruit",
      },
      {
        href: "https://stardewvalleywiki.com/Ancient_Seeds",
        label: "Stardew Valley Wiki: Ancient Seeds",
      },
      {
        href: "https://stardewvalleyplanner.art/",
        label: "Stardew Valley Planner (homepage)",
        note: "This site, not the wiki.",
      },
    ],
  },
  {
    Article: SummerCropsStardewChineseArticle,
    checkedLabel:
      "2026-09-13 对照下方星露谷中文维基农作物、夏季及各作物页。最晚播种由 28 减生长天数推算，不是维基字段。规划器只是摆放草图，不算金币、不浇水、不掷每天 1%。",
    heading: "来源",
    name: "Chinese summer crops article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/农作物",
        label: "星露谷物语官方中文维基：农作物",
      },
      {
        href: "https://zh.stardewvalleywiki.com/夏季",
        label: "星露谷物语官方中文维基：夏季",
      },
      {
        href: "https://zh.stardewvalleywiki.com/蓝莓",
        label: "星露谷物语官方中文维基：蓝莓",
      },
      {
        href: "https://zh.stardewvalleywiki.com/蓝莓种子",
        label: "星露谷物语官方中文维基：蓝莓种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/甜瓜",
        label: "星露谷物语官方中文维基：甜瓜",
      },
      {
        href: "https://zh.stardewvalleywiki.com/甜瓜种子",
        label: "星露谷物语官方中文维基：甜瓜种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/啤酒花",
        label: "星露谷物语官方中文维基：啤酒花",
      },
      {
        href: "https://zh.stardewvalleywiki.com/啤酒花种子",
        label: "星露谷物语官方中文维基：啤酒花种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/淡啤酒",
        label: "星露谷物语官方中文维基：淡啤酒",
      },
      {
        href: "https://zh.stardewvalleywiki.com/杨桃",
        label: "星露谷物语官方中文维基：杨桃",
      },
      {
        href: "https://zh.stardewvalleywiki.com/杨桃种子",
        label: "星露谷物语官方中文维基：杨桃种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/沙漠",
        label: "星露谷物语官方中文维基：沙漠",
      },
      {
        href: "https://zh.stardewvalleywiki.com/绿洲",
        label: "星露谷物语官方中文维基：绿洲",
      },
      {
        href: "https://zh.stardewvalleywiki.com/红叶卷心菜",
        label: "星露谷物语官方中文维基：红叶卷心菜",
      },
      {
        href: "https://zh.stardewvalleywiki.com/辣椒",
        label: "星露谷物语官方中文维基：辣椒",
      },
      {
        href: "https://zh.stardewvalleywiki.com/玉米",
        label: "星露谷物语官方中文维基：玉米",
      },
      {
        href: "https://zh.stardewvalleywiki.com/金皮西葫芦",
        label: "星露谷物语官方中文维基：金皮西葫芦",
      },
      {
        href: "https://zh.stardewvalleywiki.com/收集包",
        label: "星露谷物语官方中文维基：收集包",
      },
      {
        href: "https://stardewvalleyplanner.art/zh/how-to-earn-money-stardew",
        label: "本站：星露谷第一年怎么赚钱（夏天：只种你浇得完的格子）",
        note: "本站页面，不是维基。",
      },
      {
        href: "https://stardewvalleyplanner.art/zh",
        label: "本站中文规划器首页（目录语言）",
      },
    ],
  },
  {
    Article: FallCropsStardewEnglishArticle,
    checkedLabel:
      "Checked 2026-09-14 against Stardew Valley Wiki Fall, Crops (including Gold per Day and Giant Crops), and Pierre’s General Store Fall Stock. Wiki gold/day figures assume no fertilizer and no Tiller. Last-plant dates are derived as 28 minus grow days for a harvest on Fall 28, excluding the plant day, with watering on the plant day; the wiki does not name that field. The planner is a placement sketch; it does not compute gold/day, last-plant dates, or giant 1% rolls.",
    heading: "Sources",
    name: "English fall crops article",
    sources: [
      { href: "https://stardewvalleywiki.com/Fall", label: "Stardew Valley Wiki: Fall" },
      { href: "https://stardewvalleywiki.com/Crops", label: "Stardew Valley Wiki: Crops" },
      {
        href: "https://stardewvalleywiki.com/Crops#Gold_per_Day",
        label: "Stardew Valley Wiki: Crops (Gold per Day)",
      },
      {
        href: "https://stardewvalleywiki.com/Crops#Giant_Crops",
        label: "Stardew Valley Wiki: Crops (Giant Crops)",
      },
      {
        href: "https://stardewvalleywiki.com/Pierre%27s_General_Store",
        label: "Stardew Valley Wiki: Pierre's General Store",
      },
      {
        href: "https://stardewvalleywiki.com/Pierre%27s_General_Store#Fall_Stock",
        label: "Stardew Valley Wiki: Pierre's General Store (Fall Stock)",
      },
      {
        href: "https://stardewvalleyplanner.art/",
        label: "Stardew Valley Planner",
      },
      {
        href: "https://stardewvalleyplanner.art/best-spring-crop-stardew",
        label: "This site: spring crop ranking",
      },
      {
        href: "https://stardewvalleyplanner.art/summer-crops-stardew",
        label: "This site: summer crop ranking",
      },
      {
        href: "https://stardewvalleyplanner.art/how-to-earn-money-stardew",
        label: "This site: Year 1 gold",
      },
      {
        href: "https://stardewvalleyplanner.art/glasshouse-stardew-valley",
        label: "This site: greenhouse 10×12",
      },
    ],
  },
  {
    Article: FallCropsStardewChineseArticle,
    checkedLabel:
      "2026-09-14 对照下方星露谷中文维基。日均按农作物「每日收益」：普通品质，不计肥料、农耕人、农业学家。最晚播种由 28 减生长天数推算，不是维基字段。规划器不算金币、不浇水、不掷每天 1%。",
    heading: "来源",
    name: "Chinese fall crops article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/农作物",
        label: "星露谷物语官方中文维基：农作物",
      },
      {
        href: "https://zh.stardewvalleywiki.com/秋季",
        label: "星露谷物语官方中文维基：秋季",
      },
      {
        href: "https://zh.stardewvalleywiki.com/皮埃尔的杂货店",
        label: "星露谷物语官方中文维基：皮埃尔的杂货店",
      },
      {
        href: "https://zh.stardewvalleywiki.com/南瓜",
        label: "星露谷物语官方中文维基：南瓜",
      },
      {
        href: "https://zh.stardewvalleywiki.com/南瓜种子",
        label: "星露谷物语官方中文维基：南瓜种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/蔓越莓",
        label: "星露谷物语官方中文维基：蔓越莓",
      },
      {
        href: "https://zh.stardewvalleywiki.com/蔓越莓种子",
        label: "星露谷物语官方中文维基：蔓越莓种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/葡萄",
        label: "星露谷物语官方中文维基：葡萄",
      },
      {
        href: "https://zh.stardewvalleywiki.com/葡萄种子",
        label: "星露谷物语官方中文维基：葡萄种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/玫瑰仙子",
        label: "星露谷物语官方中文维基：玫瑰仙子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/洋蓟",
        label: "星露谷物语官方中文维基：洋蓟",
      },
      {
        href: "https://zh.stardewvalleywiki.com/甜菜",
        label: "星露谷物语官方中文维基：甜菜",
      },
      {
        href: "https://zh.stardewvalleywiki.com/绿洲",
        label: "星露谷物语官方中文维基：绿洲",
      },
      {
        href: "https://zh.stardewvalleywiki.com/沙漠",
        label: "星露谷物语官方中文维基：沙漠",
      },
      {
        href: "https://zh.stardewvalleywiki.com/西蓝花",
        label: "星露谷物语官方中文维基：西蓝花",
      },
      {
        href: "https://zh.stardewvalleywiki.com/西蓝花种子",
        label: "星露谷物语官方中文维基：西蓝花种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/稀有种子",
        label: "星露谷物语官方中文维基：稀有种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/宝石甜莓",
        label: "星露谷物语官方中文维基：宝石甜莓",
      },
      {
        href: "https://zh.stardewvalleywiki.com/上古水果",
        label: "星露谷物语官方中文维基：上古水果",
      },
      {
        href: "https://zh.stardewvalleywiki.com/上古种子",
        label: "星露谷物语官方中文维基：上古种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/玉米",
        label: "星露谷物语官方中文维基：玉米",
      },
      {
        href: "https://zh.stardewvalleywiki.com/向日葵",
        label: "星露谷物语官方中文维基：向日葵",
      },
      {
        href: "https://zh.stardewvalleywiki.com/向日葵种子",
        label: "星露谷物语官方中文维基：向日葵种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/旅行货车",
        label: "星露谷物语官方中文维基：旅行货车",
      },
      {
        href: "https://zh.stardewvalleywiki.com/星露谷展览会",
        label: "星露谷物语官方中文维基：星露谷展览会",
      },
      {
        href: "https://zh.stardewvalleywiki.com/收集包",
        label: "星露谷物语官方中文维基：收集包",
      },
      {
        href: "https://zh.stardewvalleywiki.com/秋季种子",
        label: "星露谷物语官方中文维基：秋季种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/苋菜",
        label: "星露谷物语官方中文维基：苋菜",
      },
      {
        href: "https://zh.stardewvalleywiki.com/茄子",
        label: "星露谷物语官方中文维基：茄子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/山药",
        label: "星露谷物语官方中文维基：山药",
      },
      {
        href: "https://zh.stardewvalleywiki.com/小白菜",
        label: "星露谷物语官方中文维基：小白菜",
      },
      {
        href: "https://zh.stardewvalleywiki.com/小麦",
        label: "星露谷物语官方中文维基：小麦",
      },
      {
        href: "/zh/best-spring-crop-stardew",
        label: "本站：春天种什么",
      },
      {
        href: "/zh/summer-crops-stardew",
        label: "本站：夏天种什么",
      },
      {
        href: "/zh/how-to-earn-money-stardew",
        label: "本站：第一年怎么赚钱",
      },
      {
        href: "/zh/glasshouse-stardew-valley",
        label: "本站：温室布局",
      },
      {
        href: "/zh/sprinkler-stardew",
        label: "本站：洒水器",
      },
      {
        href: "/zh#planner",
        label: "本站：农场规划器",
      },
    ],
  },
  {
    Article: HowToLevelUpFarmingStardewEnglishArticle,
    checkedLabel:
      "Checked 2026-09-20 against Stardew Valley Wiki Farming (including Experience Points), Skills, Stardew Valley Almanac, Book Of Stars, Keg, Sprinkler, Quality Sprinkler, Iridium Sprinkler, Seed Maker, Winter, and Winter Seeds. The wiki home names computer version 1.6.15. Winter Seeds Farming XP is not used: the Farming page and the Winter page disagree, and the Winter Seeds page does not print a number. No in-game harvest test was run. This site’s planner is a layout tool; it does not compute Farming XP or skill levels.",
    heading: "Sources",
    name: "English farming XP article",
    sources: [
      { href: "https://stardewvalleywiki.com/Stardew_Valley_Wiki", label: "Stardew Valley Wiki" },
      { href: "https://stardewvalleywiki.com/Farming", label: "Stardew Valley Wiki: Farming" },
      {
        href: "https://stardewvalleywiki.com/Farming#Experience_Points",
        label: "Stardew Valley Wiki: Farming (Experience Points)",
      },
      { href: "https://stardewvalleywiki.com/Skills", label: "Stardew Valley Wiki: Skills" },
      {
        href: "https://stardewvalleywiki.com/Stardew_Valley_Almanac",
        label: "Stardew Valley Wiki: Stardew Valley Almanac",
      },
      {
        href: "https://stardewvalleywiki.com/Book_Of_Stars",
        label: "Stardew Valley Wiki: Book Of Stars",
      },
      { href: "https://stardewvalleywiki.com/Keg", label: "Stardew Valley Wiki: Keg" },
      { href: "https://stardewvalleywiki.com/Sprinkler", label: "Stardew Valley Wiki: Sprinkler" },
      {
        href: "https://stardewvalleywiki.com/Quality_Sprinkler",
        label: "Stardew Valley Wiki: Quality Sprinkler",
      },
      {
        href: "https://stardewvalleywiki.com/Iridium_Sprinkler",
        label: "Stardew Valley Wiki: Iridium Sprinkler",
      },
      { href: "https://stardewvalleywiki.com/Seed_Maker", label: "Stardew Valley Wiki: Seed Maker" },
      { href: "https://stardewvalleywiki.com/Winter", label: "Stardew Valley Wiki: Winter" },
      {
        href: "https://stardewvalleywiki.com/Winter_Seeds",
        label: "Stardew Valley Wiki: Winter Seeds",
      },
      {
        href: "https://stardewvalleyplanner.art/rancher-or-tiller-stardew",
        label: "This site: Rancher or Tiller",
      },
      {
        href: "https://stardewvalleyplanner.art/sprinkler-stardew",
        label: "This site: sprinklers",
      },
      {
        href: "https://stardewvalleyplanner.art/how-to-earn-money-stardew",
        label: "This site: Year 1 gold",
      },
      {
        href: "https://stardewvalleyplanner.art/best-spring-crop-stardew",
        label: "This site: spring crops",
      },
      {
        href: "https://stardewvalleyplanner.art/summer-crops-stardew",
        label: "This site: summer crops",
      },
      {
        href: "https://stardewvalleyplanner.art/fall-crops-stardew",
        label: "This site: fall crops",
      },
      {
        href: "https://stardewvalleyplanner.art/glasshouse-stardew-valley",
        label: "This site: greenhouse",
      },
    ],
  },
  {
    Article: HowToLevelUpFarmingStardewChineseArticle,
    checkedLabel:
      "2026-09-20 对照下方星露谷官方中文维基。经验规则以官方中文维基为准；年历 250 来自年历页；规划器不算耕种经验。作物单次经验摘自耕种页表，不是某份存档实测。",
    heading: "来源",
    name: "Chinese farming XP article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=耕种&amp;variant=zh-cn",
        label: "星露谷物语官方中文维基：耕种",
      },
      {
        href: "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=技能&amp;variant=zh-cn",
        label: "星露谷物语官方中文维基：技能",
      },
      {
        href: "https://zh.stardewvalleywiki.com/mediawiki/index.php?title=星露谷年历&amp;variant=zh-cn",
        label: "星露谷物语官方中文维基：星露谷年历",
      },
      {
        href: "https://stardewvalleywiki.com/Farming",
        label: "星露谷物语英文维基：Farming",
      },
      {
        href: "https://stardewvalleywiki.com/Skills",
        label: "星露谷物语英文维基：Skills",
      },
      {
        href: "https://stardewvalleywiki.com/Stardew_Valley_Almanac",
        label: "星露谷物语英文维基：Stardew Valley Almanac",
      },
      {
        href: "/zh/rancher-or-tiller-stardew",
        label: "本站：农耕人还是畜牧人",
      },
      {
        href: "/zh/sprinkler-stardew",
        label: "本站：星露谷洒水器",
      },
      {
        href: "/zh/how-to-earn-money-stardew",
        label: "本站：第一年怎么赚钱",
      },
      {
        href: "/zh/best-spring-crop-stardew",
        label: "本站：春天种什么",
      },
      {
        href: "/zh/summer-crops-stardew",
        label: "本站：夏天种什么",
      },
      {
        href: "/zh/fall-crops-stardew",
        label: "本站：秋季作物",
      },
      {
        href: "/zh",
        label: "本站：农场规划器（简体中文首页）",
      },
    ],
  },
  {
    Article: LastDayToPlantStardewEnglishArticle,
    checkedLabel:
      "Checked 2026-09-21 against Stardew Valley Wiki pages. Last plant days are 28 minus grow time, for a first harvest on day 28. The plant day does not count, and you water that day. The tables leave Speed-Gro, Deluxe Speed-Gro, Hyper Speed-Gro, and Agriculturist off. This site’s farm planner switches seasons as a layout view; it does not compute last-plant days.",
    heading: "Sources",
    name: "English last-plant article",
    sources: [
      { href: "https://stardewvalleywiki.com/Crops", label: "Stardew Valley Wiki: Crops" },
      {
        href: "https://stardewvalleywiki.com/Crops#Grow_Times",
        label: "Stardew Valley Wiki: Crops (Grow Times)",
      },
      {
        href: "https://stardewvalleywiki.com/Crops#End_of_Season",
        label: "Stardew Valley Wiki: Crops (End of Season)",
      },
      { href: "https://stardewvalleywiki.com/Seasons", label: "Stardew Valley Wiki: Seasons" },
      { href: "https://stardewvalleywiki.com/Spring", label: "Stardew Valley Wiki: Spring" },
      { href: "https://stardewvalleywiki.com/Summer", label: "Stardew Valley Wiki: Summer" },
      { href: "https://stardewvalleywiki.com/Fall", label: "Stardew Valley Wiki: Fall" },
      { href: "https://stardewvalleywiki.com/Winter", label: "Stardew Valley Wiki: Winter" },
      { href: "https://stardewvalleywiki.com/Parsnip", label: "Stardew Valley Wiki: Parsnip" },
      {
        href: "https://stardewvalleywiki.com/Cauliflower",
        label: "Stardew Valley Wiki: Cauliflower",
      },
      {
        href: "https://stardewvalleywiki.com/Unmilled_Rice",
        label: "Stardew Valley Wiki: Unmilled Rice",
      },
      {
        href: "https://stardewvalleywiki.com/Coffee_Bean",
        label: "Stardew Valley Wiki: Coffee Bean",
      },
      {
        href: "https://stardewvalleywiki.com/Ancient_Fruit",
        label: "Stardew Valley Wiki: Ancient Fruit",
      },
      {
        href: "https://stardewvalleywiki.com/Spring_Seeds",
        label: "Stardew Valley Wiki: Spring Seeds",
      },
      {
        href: "https://stardewvalleywiki.com/Summer_Seeds",
        label: "Stardew Valley Wiki: Summer Seeds",
      },
      {
        href: "https://stardewvalleywiki.com/Fall_Seeds",
        label: "Stardew Valley Wiki: Fall Seeds",
      },
      {
        href: "https://stardewvalleywiki.com/Winter_Seeds",
        label: "Stardew Valley Wiki: Winter Seeds",
      },
      {
        href: "https://stardewvalleywiki.com/Fiber_Seeds",
        label: "Stardew Valley Wiki: Fiber Seeds",
      },
      { href: "https://stardewvalleywiki.com/Speed-Gro", label: "Stardew Valley Wiki: Speed-Gro" },
      {
        href: "https://stardewvalleywiki.com/Deluxe_Speed-Gro",
        label: "Stardew Valley Wiki: Deluxe Speed-Gro",
      },
      {
        href: "https://stardewvalleywiki.com/Hyper_Speed-Gro",
        label: "Stardew Valley Wiki: Hyper Speed-Gro",
      },
      { href: "https://stardewvalleywiki.com/Farming", label: "Stardew Valley Wiki: Farming" },
      {
        href: "https://stardewvalleywiki.com/Greenhouse",
        label: "Stardew Valley Wiki: Greenhouse",
      },
      {
        href: "https://stardewvalleywiki.com/Ginger_Island",
        label: "Stardew Valley Wiki: Ginger Island",
      },
      {
        href: "https://stardewvalleywiki.com/Fruit_Trees",
        label: "Stardew Valley Wiki: Fruit Trees",
      },
      {
        href: "https://stardewvalleywiki.com/Tea_Sapling",
        label: "Stardew Valley Wiki: Tea Sapling",
      },
      {
        href: "https://stardewvalleywiki.com/Cactus_Seeds",
        label: "Stardew Valley Wiki: Cactus Seeds",
      },
      { href: "https://stardewvalleywiki.com/Farm_Maps", label: "Stardew Valley Wiki: Farm Maps" },
      {
        href: "https://stardewvalleyplanner.art/best-spring-crop-stardew",
        label: "This site: spring crop ranking",
      },
      {
        href: "https://stardewvalleyplanner.art/summer-crops-stardew",
        label: "This site: summer crop ranking",
      },
      {
        href: "https://stardewvalleyplanner.art/fall-crops-stardew",
        label: "This site: fall crop ranking",
      },
      {
        href: "https://stardewvalleyplanner.art/glasshouse-stardew-valley",
        label: "This site: greenhouse layout",
      },
    ],
  },
  {
    Article: LastDayToPlantStardewChineseArticle,
    checkedLabel:
      "2026-09-21 对照下方星露谷中文维基（英文 Rare Seed、Crop Growth Calendars 仅作对照）。生长天数来自农作物各作物节。最晚播种日用 28 减去生长天数，种下去的那一天不算在内。作物生长日历是第 1 天种、收获当天再种的循环表。规划器可以摆作物、切四季，不算最晚播种日。",
    heading: "来源",
    name: "Chinese last-plant article",
    sources: [
      {
        href: "https://zh.stardewvalleywiki.com/农作物",
        label: "星露谷物语官方中文维基：农作物",
      },
      {
        href: "https://zh.stardewvalleywiki.com/作物生长日历",
        label: "星露谷物语官方中文维基：作物生长日历",
      },
      {
        href: "https://stardewvalleywiki.com/Crop_Growth_Calendars",
        label: "Stardew Valley Wiki: Crop Growth Calendars",
      },
      {
        href: "https://zh.stardewvalleywiki.com/季节",
        label: "星露谷物语官方中文维基：季节",
      },
      {
        href: "https://zh.stardewvalleywiki.com/生长激素",
        label: "星露谷物语官方中文维基：生长激素",
      },
      {
        href: "https://zh.stardewvalleywiki.com/高级生长激素",
        label: "星露谷物语官方中文维基：高级生长激素",
      },
      {
        href: "https://zh.stardewvalleywiki.com/顶级生长激素",
        label: "星露谷物语官方中文维基：顶级生长激素",
      },
      {
        href: "https://zh.stardewvalleywiki.com/耕种",
        label: "星露谷物语官方中文维基：耕种",
      },
      {
        href: "https://zh.stardewvalleywiki.com/稀有种子",
        label: "星露谷物语官方中文维基：稀有种子",
      },
      {
        href: "https://stardewvalleywiki.com/Rare_Seed",
        label: "Stardew Valley Wiki: Rare Seed",
      },
      {
        href: "https://zh.stardewvalleywiki.com/春季种子",
        label: "星露谷物语官方中文维基：春季种子",
      },
      {
        href: "https://zh.stardewvalleywiki.com/茶叶",
        label: "星露谷物语官方中文维基：茶叶",
      },
      {
        href: "https://zh.stardewvalleywiki.com/温室",
        label: "星露谷物语官方中文维基：温室",
      },
      {
        href: "https://zh.stardewvalleywiki.com/姜岛",
        label: "星露谷物语官方中文维基：姜岛",
      },
      {
        href: "/zh/best-spring-crop-stardew",
        label: "本站：春天种什么",
      },
      {
        href: "/zh/summer-crops-stardew",
        label: "本站：夏天种什么",
      },
      {
        href: "/zh/fall-crops-stardew",
        label: "本站：秋季作物",
      },
      {
        href: "/zh/glasshouse-stardew-valley",
        label: "本站：温室布局",
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


