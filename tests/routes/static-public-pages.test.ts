import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DOMParser,
  type Document as XmlDocument,
  type Element as XmlElement,
} from "@xmldom/xmldom";
import { describe, expect, it } from "vitest";

const expectedSocialImageUrl =
  "https://stardewvalleyplanner.art/social-images/stardew-valley-farm-planner.png";

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type StaticPublicPageExpectation = readonly [
  pathname: string,
  staticPageFile: string,
  title: string,
  description: string,
  heading: string,
  documentLanguage: string,
  sectionHeadings?: readonly string[],
];

type StaticBlogPageExpectation = Readonly<{
  articleOnlySchema?: boolean;
  pathname: string;
  staticPageFile: string;
  heading: string;
  metadata?: Readonly<{
    title: string;
    description: string;
  }>;
  documentLanguage: "en" | "zh-CN";
  schemaType: "Article" | "CollectionPage";
  shouldIndex: boolean;
  coverImages: readonly Readonly<{ src: string; alt: string }>[];
  requiredBodyPhrases?: readonly string[];
  requiredHrefs?: readonly string[];
}>;

type StaticHomepageExpectation = Readonly<{
  staticPageFile: "index.html" | "zh.html";
  heroTitleBefore: string;
  heroEmphasis: string;
  heroTitleAfter: string;
  heroSupportingCopy: string;
  heroTrustedBy: string;
  featuresHeading: string;
  featuresDescriptions: readonly string[];
  whyChooseHeading: string;
  whyChooseDescriptions: readonly string[];
  howToHeading: string;
  howToDescriptions: readonly string[];
  closingCtaHeading: string;
  closingCtaSupportLine: string;
  sectionImageSources: readonly string[];
  faqHeading: string;
  faqAnswers: readonly string[];
  trustHeading: string;
  trustDescription: string;
  plannerHref: string;
  blogHref: string;
  blogLabel: string;
  homepageHref: string;
  jsonLdName: string;
  jsonLdDescription: string;
  jsonLdUrl: string;
  jsonLdLocale: "en" | "zh-CN";
}>;

const staticPublicPageExpectations: readonly StaticPublicPageExpectation[] = [
  [
    "/",
    "index.html",
    "Stardew Valley Planner – Free Online Farm Layout Tool",
    "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
    "Stardew Valley Planner for Every Farm Layout",
    "en",
  ],
  [
    "/privacy",
    "privacy.html",
    "Privacy Policy",
    "Learn how Stardew Valley Planner keeps projects in your browser without accounts, cloud sync, or tracking.",
    "Privacy Policy",
    "en",
    [
      "What we collect",
      "Farm data",
      "Online features",
      "Analytics",
      "Cookies",
      "Third parties",
      "Data deletion",
      "Local use",
      "Contact messages",
    ],
  ],
  [
    "/terms",
    "terms.html",
    "Terms of Service",
    "Read the browser-local terms for Stardew Valley Planner, including local projects, optional JSON import and export, and fan-made status.",
    "Terms of Service",
    "en",
    [
      "What this is",
      "Accounts",
      "Online features",
      "Your data",
      "Availability",
      "Game assets",
      "Contact messages",
    ],
  ],
  [
    "/contact",
    "contact.html",
    "Contact us | Stardew Valley Farm Planner",
    "Send a message to the Stardew Valley Farm Planner team.",
    "Contact us",
    "en",
  ],
  ["/zh", "zh.html", "星露谷农场规划器", "使用本地地图、物品和项目规划你的星露谷农场布局。", "适用于各种农场布局的星露谷物语规划器", "zh-CN"],
  [
    "/zh/privacy",
    "zh/privacy.html",
    "隐私政策",
    "了解星露谷农场规划器如何将项目保留在此浏览器中，不提供账户、云端同步或跟踪服务。",
    "隐私政策",
    "zh-CN",
    [
      "我们收集什么",
      "农场数据",
      "在线功能",
      "分析",
      "Cookie",
      "第三方",
      "数据删除",
      "本地使用",
      "联系消息",
    ],
  ],
  [
    "/zh/terms",
    "zh/terms.html",
    "服务条款",
    "阅读星露谷农场规划器的浏览器本地服务条款，包括本地项目、由你选择的 JSON 导入和导出，以及同人创作说明。",
    "服务条款",
    "zh-CN",
    [
      "这是什么",
      "账户",
      "在线功能",
      "你的数据",
      "可用性",
      "游戏素材",
      "联系消息",
    ],
  ],
  [
    "/zh/contact",
    "zh/contact.html",
    "联系我们 | 星露谷农场规划器",
    "向星露谷农场规划器团队发送消息。",
    "联系我们",
    "zh-CN",
  ],
] as const;

const staticBlogPageExpectations: readonly StaticBlogPageExpectation[] = [
  {
    pathname: "/blog",
    staticPageFile: "blog.html",
    heading: "Stardew Valley Planning Guides",
    documentLanguage: "en",
    schemaType: "CollectionPage",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.webp",
        alt: "Illustration of Robin's mountain workshop with a farm-building plan",
      },
      {
        src: "/blog/where-is-robin-stardew-valley-cover.webp",
        alt: "Mountain path leading toward Robin's carpenter workshop",
      },
      {
        src: "/blog/stardew-valley-npc-cover.webp",
        alt: "Original illustration of Stardew Valley townspeople meeting in a mountain village square",
      },
      {
        src: "/blog/stardew-valley-town-map-cover.webp",
        alt: "Original illustrated map of a riverside town with roads, bridges, and landmarks",
      },
      {
        src: "/blog/where-is-stardew-valley-located-cover.webp",
        alt: "Original illustration of a quiet rural valley with a small town, mountains, and a farm road",
      },
      {
        src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
        alt: "Original illustration of seven villagers at a vineyard and town square, no copyrighted sprites",
      },
      {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "Top-down farm illustration of three sprinklers: a 4-tile plus/cross, an 8-tile ring, and a 24-tile square of watered crops.",
      },
      {
        src: "/blog/glasshouse-stardew-valley-cover.webp",
        alt: "Original illustration of a glass farm building interior with an empty 10-by-12 crop rectangle and a wood border",
      },
      {
        src: "/blog/oak-tree-stardew-cover.webp",
        alt: "Original illustration of spaced oak trees on a farm road, with a wooden bucket on one trunk and acorns on the soil",
      },
      {
        src: "/blog/stardew-valley-trees-cover.webp",
        alt: "Top-down farm illustration: a keep grove of trees with tapper buckets on the left, a fruit orchard with space between trunks in the middle, and empty cleared dirt on the right.",
      },
      {
        src: "/blog/maple-tree-stardew-cover.webp",
        alt: "Spaced maple trees with a wooden bucket on one trunk and winged maple seeds on the soil",
      },
    ],
  },
  {
    pathname: "/blog/archive",
    staticPageFile: "blog/archive.html",
    heading: "All articles",
    documentLanguage: "en",
    schemaType: "CollectionPage",
    shouldIndex: true,
    requiredBodyPhrases: [
      "This archive lists every published Stardew Valley planning guide. Use it to find Robin, Pelican Town, and farm layout articles in one place.",
    ],
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.webp",
        alt: "Illustration of Robin's mountain workshop with a farm-building plan",
      },
      {
        src: "/blog/where-is-robin-stardew-valley-cover.webp",
        alt: "Mountain path leading toward Robin's carpenter workshop",
      },
      {
        src: "/blog/stardew-valley-npc-cover.webp",
        alt: "Original illustration of Stardew Valley townspeople meeting in a mountain village square",
      },
      {
        src: "/blog/stardew-valley-town-map-cover.webp",
        alt: "Original illustrated map of a riverside town with roads, bridges, and landmarks",
      },
      {
        src: "/blog/where-is-stardew-valley-located-cover.webp",
        alt: "Original illustration of a quiet rural valley with a small town, mountains, and a farm road",
      },
      {
        src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
        alt: "Original illustration of seven villagers at a vineyard and town square, no copyrighted sprites",
      },
      {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "Top-down farm illustration of three sprinklers: a 4-tile plus/cross, an 8-tile ring, and a 24-tile square of watered crops.",
      },
      {
        src: "/blog/glasshouse-stardew-valley-cover.webp",
        alt: "Original illustration of a glass farm building interior with an empty 10-by-12 crop rectangle and a wood border",
      },
      {
        src: "/blog/oak-tree-stardew-cover.webp",
        alt: "Original illustration of spaced oak trees on a farm road, with a wooden bucket on one trunk and acorns on the soil",
      },
    ],
  },
  {
    pathname: "/carpenter-stardew",
    staticPageFile: "carpenter-stardew.html",
    heading: "Carpenter Stardew Valley: Robin’s Shop, Buildings, and Upgrades",
    documentLanguage: "en",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.webp",
        alt: "Illustration of Robin's mountain workshop with a farm-building plan",
      },
    ],
  },
  {
    pathname: "/where-is-robin-stardew-valley",
    staticPageFile: "where-is-robin-stardew-valley.html",
    heading: "Where Is Robin in Stardew Valley? Hours, Schedule, and Exceptions",
    documentLanguage: "en",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/where-is-robin-stardew-valley-cover.webp",
        alt: "Mountain path leading toward Robin's carpenter workshop",
      },
    ],
  },
  {
    pathname: "/stardew-valley-npc",
    staticPageFile: "stardew-valley-npc.html",
    heading: "Stardew Valley NPC List: Villagers, Marriage Candidates, and Services",
    metadata: {
      title: "Stardew Valley NPC List: Villagers, Marriage Candidates, and Services",
      description:
        "Sort the current Stardew Valley NPC list by marriage, giftable, and non-giftable roles, then plan gifts, schedules, and farm services.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/stardew-valley-npc-cover.webp",
        alt: "Original illustration of Stardew Valley townspeople meeting in a mountain village square",
      },
    ],
  },
  {
    pathname: "/stardew-valley-town-map",
    staticPageFile: "stardew-valley-town-map.html",
    heading: "Stardew Valley Town Map: Pelican Town Landmarks & Routes",
    metadata: {
      title: "Stardew Valley Town Map: Pelican Town Landmarks & Routes",
      description:
        "Use this Stardew Valley town map guide to find Pelican Town landmarks, exits, and a route back to your farm before you plan its layout.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/stardew-valley-town-map-cover.webp",
        alt: "Original illustrated map of a riverside town with roads, bridges, and landmarks",
      },
    ],
  },
  {
    pathname: "/where-is-stardew-valley-located",
    staticPageFile: "where-is-stardew-valley-located.html",
    heading: "Where Is Stardew Valley Located? Ferngill Republic, Pelican Town, and the Real-World Theory",
    metadata: {
      title: "Where Is Stardew Valley Located? Ferngill Republic, Pelican Town, and the Real-World Theory",
      description:
        "Find Stardew Valley on the in-game map: separate Pelican Town, the Farm, and the Ferngill Republic, then test what Harvey's coordinates and Pacific Northwest influences do—and do not—prove.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/where-is-stardew-valley-located-cover.webp",
        alt: "Original illustration of a quiet rural valley with a small town, mountains, and a farm road",
      },
    ],
    requiredBodyPhrases: [
      "Where is Stardew Valley located? The answer depends",
      "One coordinate joke cannot override the broader fictional geography.",
      "The planner helps test building footprints, crop areas, paths, seasons, and coverage on your farm.",
    ],
    requiredHrefs: [
      "/#planner",
      "/stardew-valley-town-map",
      "/stardew-valley-npc",
      "/where-is-robin-stardew-valley",
      "/carpenter-stardew",
      "https://www.stardewvalley.net/about/",
      "https://stardewvalleywiki.com/Setting",
      "https://stardewvalleywiki.com/Pelican_Town",
      "https://stardewvalleywiki.com/The_Desert",
      "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
    ],
  },
  {
    pathname: "/stardew-valley-expanded-bachelors-and-bachelorettes",
    staticPageFile: "stardew-valley-expanded-bachelors-and-bachelorettes.html",
    heading: "Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes",
    metadata: {
      title: "Stardew Valley Expanded Marriage Candidates: All 7 SVE Bachelors and Bachelorettes",
      description:
        "Meet all 7 Stardew Valley Expanded marriage candidates, check who is available early, unlock Scarlett and Lance, and plan gifts and marriage steps.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
        alt: "Original illustration of seven villagers at a vineyard and town square, no copyrighted sprites",
      },
    ],
    requiredBodyPhrases: [
      "Stardew Valley Expanded currently adds seven marriage candidates",
      "The planner is for testing placement and layout ideas.",
    ],
    requiredHrefs: [
      "/#planner",
      "/stardew-valley-npc",
      "/carpenter-stardew",
      "https://stardewvalleyexpanded.wiki.gg/wiki/Villagers",
      "https://www.nexusmods.com/stardewvalley/mods/3753",
    ],
  },
  {
    pathname: "/sprinkler-stardew",
    staticPageFile: "sprinkler-stardew.html",
    heading:
      "Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails",
    metadata: {
      title:
        "Stardew Valley sprinklers: unlock the right tier, place it, and know where it fails",
      description:
        "Craft Farming 2, 6, or 9 sprinklers, place them for 6am watering, and check pots, Beach Farm sand, greenhouse rain, and island weather.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "Top-down farm illustration of three sprinklers: a 4-tile plus/cross, an 8-tile ring, and a 24-tile square of watered crops.",
      },
    ],
    requiredBodyPhrases: [
      "waters the four tiles above, below, left, and right",
      "the crafting pages say they fire automatically every morning at 6am",
      "place sprinklers and turn on sprinkler radius",
    ],
    requiredHrefs: [
      "/",
      "/#planner",
      "https://stardewvalleywiki.com/Sprinkler",
      "https://stardewvalleywiki.com/Quality_Sprinkler",
      "https://stardewvalleywiki.com/Iridium_Sprinkler",
      "https://stardewvalleywiki.com/Pressure_Nozzle",
      "https://stardewvalleywiki.com/Greenhouse",
    ],
  },
  {
    pathname: "/glasshouse-stardew-valley",
    staticPageFile: "glasshouse-stardew-valley.html",
    heading: "Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers",
    metadata: {
      title: "Stardew Valley Greenhouse Layout: 120 Tiles & Sprinklers",
      description:
        "Repair the Stardew Valley Greenhouse, plan its 10×12 crop bed, save soil with border sprinklers, and place fruit trees without blocking growth.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/glasshouse-stardew-valley-cover.webp",
        alt: "Original illustration of a glass farm building interior with an empty 10-by-12 crop rectangle and a wood border",
      },
    ],
    requiredBodyPhrases: [
      "Plan the greenhouse around decisions, not a picture",
      "The planner is a placement check, not a game-state simulator",
    ],
    requiredHrefs: [
      "/carpenter-stardew",
      "/?farmType=greenhouse",
      "/sprinkler-stardew",
    ],
  },
  {
    pathname: "/oak-tree-stardew",
    staticPageFile: "oak-tree-stardew.html",
    heading: "Stardew Valley Oak Tree: Acorns, Tappers, and Oak Resin",
    metadata: {
      title: "Stardew Valley Oak Tree: Acorns, Tappers, and Oak Resin",
      description:
        "Identify an oak from an acorn, plant with wild-tree spacing, then tap Oak Resin every 7 nights or chop for wood after you sketch the trunks.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/oak-tree-stardew-cover.webp",
        alt: "Original illustration of spaced oak trees on a farm road, with a wooden bucket on one trunk and acorns on the soil",
      },
    ],
    requiredBodyPhrases: [
      "Identify an oak tree, not a fruit tree",
      "The planner is a placement sketch",
    ],
    requiredHrefs: [
      "/glasshouse-stardew-valley",
      "/?farmType=standard",
      "/carpenter-stardew",
    ],
  },
  {
    pathname: "/stardew-valley-trees",
    staticPageFile: "stardew-valley-trees.html",
    heading: "Mark keep, orchard, and clear tiles before you chop Stardew Valley trees",
    metadata: {
      title: "Mark keep, orchard, and clear tiles before you chop Stardew Valley trees",
      description:
        "Outdoor farm only. Mark keep, orchard, and clear tiles, then plant or cut. Fruit trees need a 3×3 until mature; a planner 1×1 icon is not a growth check.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/stardew-valley-trees-cover.webp",
        alt: "Top-down farm illustration: a keep grove of trees with tapper buckets on the left, a fruit orchard with space between trunks in the middle, and empty cleared dirt on the right.",
      },
    ],
    requiredBodyPhrases: [
      "Chopping the first unlabeled tree, or buying the first sapling, is a layout choice.",
      "A 1×1 icon that sits on a path or against another trunk is not proof the game will let a sapling grow there.",
    ],
    requiredHrefs: [
      "/#planner",
      "/glasshouse-stardew-valley",
      "/sprinkler-stardew",
    ],
  },
  {
    pathname: "/maple-tree-stardew",
    staticPageFile: "maple-tree-stardew.html",
    heading: "Plant a Maple Tree in Stardew With One-Tile Gaps, Then Tap Maple Syrup",
    metadata: {
      title: "Plant a Maple Tree in Stardew With One-Tile Gaps, Then Tap Maple Syrup",
      description:
        "Match Maple Seed, not leaf shape. Collect seeds, tap Maple Syrup every 9 nights at Foraging 4 or chop. Sketch Maple Tree (Normal); it does not make syrup.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/maple-tree-stardew-cover.webp",
        alt: "Spaced maple trees with a wooden bucket on one trunk and winged maple seeds on the soil",
      },
    ],
    requiredBodyPhrases: [
      "Identify a maple by seed and syrup, not by leaf adjectives",
      "The planner is a placement sketch",
    ],
    requiredHrefs: [
      "/#planner",
      "/?farmType=standard",
      "/oak-tree-stardew",
    ],
  },
  {
    pathname: "/zh/blog",
    staticPageFile: "zh/blog.html",
    heading: "星露谷农场规划指南",
    documentLanguage: "zh-CN",
    schemaType: "CollectionPage",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.webp",
        alt: "罗宾山间木匠工坊与农场建筑规划示意插画",
      },
      {
        src: "/blog/where-is-robin-stardew-valley-cover.webp",
        alt: "通往罗宾山间木匠工坊的暖色山路插画",
      },
      {
        src: "/blog/stardew-valley-npc-cover.webp",
        alt: "星露谷山间小镇中不同村民相遇交谈的原创插画",
      },
      {
        src: "/blog/stardew-valley-town-map-cover.webp",
        alt: "原创河畔小镇地图插画，标出道路、桥梁与主要地标",
      },
      {
        src: "/blog/where-is-stardew-valley-located-cover.webp",
        alt: "原创乡村山谷插画，可见小镇、远山与通往农场的道路",
      },
      {
        src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
        alt: "葡萄园与小镇广场上七位村民相聚的原创插画，未使用受版权保护的游戏立绘",
      },
      {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "俯视农田插画，三台洒水器并排：左侧洒水器浇上下左右 4 格十字，中间优质洒水器浇周围 8 格，右侧铱制洒水器浇 24 格。",
      },
      {
        src: "/blog/glasshouse-stardew-valley-cover.webp",
        alt: "玻璃墙温室内空耕地与一圈木框的原创插画",
      },
      {
        src: "/blog/oak-tree-stardew-cover.webp",
        alt: "农场土路上间隔种植的橡树原创插画，一棵树干挂着木桶，地面有橡子",
      },
      {
        src: "/blog/stardew-valley-trees-cover.webp",
        alt: "俯视农场插画：左侧是挂树液桶的保留树丛，中间是树干留空的果树区，右侧是已清空的空地。",
      },
      {
        src: "/blog/maple-tree-stardew-cover.webp",
        alt: "近处枫树树干挂着木桶，地面散落带翅种子，土路分叉通向农舍与风车的水彩插画",
      },
    ],
  },
  {
    pathname: "/zh/blog/archive",
    staticPageFile: "zh/blog/archive.html",
    heading: "全部文章",
    documentLanguage: "zh-CN",
    schemaType: "CollectionPage",
    shouldIndex: true,
    requiredBodyPhrases: [
      "这里列出目前已发布的全部星露谷农场规划指南。你可以在同一页查找罗宾、鹈鹕镇和农场布局相关文章。",
    ],
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.webp",
        alt: "罗宾山间木匠工坊与农场建筑规划示意插画",
      },
      {
        src: "/blog/where-is-robin-stardew-valley-cover.webp",
        alt: "通往罗宾山间木匠工坊的暖色山路插画",
      },
      {
        src: "/blog/stardew-valley-npc-cover.webp",
        alt: "星露谷山间小镇中不同村民相遇交谈的原创插画",
      },
      {
        src: "/blog/stardew-valley-town-map-cover.webp",
        alt: "原创河畔小镇地图插画，标出道路、桥梁与主要地标",
      },
      {
        src: "/blog/where-is-stardew-valley-located-cover.webp",
        alt: "原创乡村山谷插画，可见小镇、远山与通往农场的道路",
      },
      {
        src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
        alt: "葡萄园与小镇广场上七位村民相聚的原创插画，未使用受版权保护的游戏立绘",
      },
      {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "俯视农田插画，三台洒水器并排：左侧洒水器浇上下左右 4 格十字，中间优质洒水器浇周围 8 格，右侧铱制洒水器浇 24 格。",
      },
      {
        src: "/blog/glasshouse-stardew-valley-cover.webp",
        alt: "玻璃墙温室内空耕地与一圈木框的原创插画",
      },
      {
        src: "/blog/oak-tree-stardew-cover.webp",
        alt: "农场土路上间隔种植的橡树原创插画，一棵树干挂着木桶，地面有橡子",
      },
    ],
  },
  {
    pathname: "/zh/carpenter-stardew",
    staticPageFile: "zh/carpenter-stardew.html",
    heading: "星露谷物语木匠商店：罗宾位置、营业时间、建筑与升级",
    documentLanguage: "zh-CN",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/carpenter-stardew-cover.webp",
        alt: "罗宾山间木匠工坊与农场建筑规划示意插画",
      },
    ],
  },
  {
    pathname: "/zh/where-is-robin-stardew-valley",
    staticPageFile: "zh/where-is-robin-stardew-valley.html",
    heading: "罗宾在星露谷物语哪里？木匠商店位置、营业时间与行程",
    documentLanguage: "zh-CN",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/where-is-robin-stardew-valley-cover.webp",
        alt: "通往罗宾山间木匠工坊的暖色山路插画",
      },
    ],
  },
  {
    pathname: "/zh/stardew-valley-npc",
    staticPageFile: "zh/stardew-valley-npc.html",
    heading: "星露谷 NPC 名单：可结婚角色、可送礼村民与服务",
    metadata: {
      title: "星露谷 NPC 名单：可结婚角色、可送礼村民与服务",
      description:
        "按可结婚、可送礼和不可送礼分类整理星露谷 NPC，并核对送礼、好感度、商店服务与农场规划关系。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/stardew-valley-npc-cover.webp",
        alt: "星露谷山间小镇中不同村民相遇交谈的原创插画",
      },
    ],
  },
  {
    pathname: "/zh/stardew-valley-town-map",
    staticPageFile: "zh/stardew-valley-town-map.html",
    heading: "星露谷物语小镇地图：鹈鹕镇地点与路线",
    metadata: {
      title: "星露谷物语小镇地图：鹈鹕镇地点与路线",
      description:
        "用这份鹈鹕镇地点与出口指南，先找到商店、海滩、深山和回农场的路，再开始安排你的农场布局。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/stardew-valley-town-map-cover.webp",
        alt: "原创河畔小镇地图插画，标出道路、桥梁与主要地标",
      },
    ],
  },
  {
    pathname: "/zh/where-is-stardew-valley-located",
    staticPageFile: "zh/where-is-stardew-valley-located.html",
    heading: "星露谷物语位于哪里？芬吉尔共和国、鹈鹕镇与现实地点",
    metadata: {
      title: "星露谷物语位于哪里？芬吉尔共和国、鹈鹕镇与现实地点",
      description:
        "理清星露谷、鹈鹕镇、农场和芬吉尔共和国的关系，再看哈维坐标与太平洋西北地区影响能否证明现实地点。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/where-is-stardew-valley-located-cover.webp",
        alt: "原创乡村山谷插画，可见小镇、远山与通往农场的道路",
      },
    ],
    requiredBodyPhrases: [
      "星露谷物语位于哪里？如果问的是游戏设定",
      "一个坐标彩蛋不能推翻整套虚构地理。",
      "规划器适合测试农场上的建筑占地、作物区、道路、季节和覆盖范围",
    ],
    requiredHrefs: [
      "/zh#planner",
      "/zh/stardew-valley-town-map",
      "/zh/stardew-valley-npc",
      "/zh/where-is-robin-stardew-valley",
      "/zh/carpenter-stardew",
      "https://www.stardewvalley.net/about/",
      "https://stardewvalleywiki.com/Setting",
      "https://stardewvalleywiki.com/Pelican_Town",
      "https://stardewvalleywiki.com/The_Desert",
      "https://www.portlandmercury.com/games/the-ultimate-stardew-valley-creator-interview-about-pacific-northwest-interests-46567629/",
    ],
  },
  {
    pathname: "/zh/stardew-valley-expanded-bachelors-and-bachelorettes",
    staticPageFile: "zh/stardew-valley-expanded-bachelors-and-bachelorettes.html",
    heading:
      "星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物",
    metadata: {
      title:
        "星露谷 SVE 可结婚角色：7 位候选人、出现条件与礼物",
      description:
        "整理星露谷 SVE 当前 7 位可结婚角色，核对斯嘉丽与兰斯的出现条件、入门最爱礼物和原版结婚流程。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/stardew-valley-expanded-bachelors-and-bachelorettes-cover.webp",
        alt: "葡萄园与小镇广场上七位村民相聚的原创插画，未使用受版权保护的游戏立绘",
      },
    ],
    requiredBodyPhrases: [
      "星露谷物语扩展版（SVE）当前的可结婚新增角色是 7 人",
      "规划器适合测试摆放和道路",
    ],
    requiredHrefs: [
      "/zh#planner",
      "/zh/stardew-valley-npc",
      "/zh/carpenter-stardew",
      "https://stardewvalleyexpanded.wiki.gg/wiki/Villagers",
      "https://www.nexusmods.com/stardewvalley/mods/3753",
    ],
  },
  {
    pathname: "/zh/sprinkler-stardew",
    staticPageFile: "zh/sprinkler-stardew.html",
    heading: "星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地",
    metadata: {
      title: "星露谷洒水器怎么选、怎么摆：按耕种等级覆盖田地",
      description:
        "说明三种官方洒水器的早晨浇水格数、耕种解锁，以及花盆、沙地等浇不到的情况。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "俯视农田插画，三台洒水器并排：左侧洒水器浇上下左右 4 格十字，中间优质洒水器浇周围 8 格，右侧铱制洒水器浇 24 格。",
      },
    ],
    requiredBodyPhrases: [
      "洒水器只浇上下左右 4 格",
      "耕种 6 级解锁的是优质洒水器",
      "本站规划器只用来试摆覆盖范围，不能反过来证明游戏怎么浇水",
    ],
    requiredHrefs: [
      "/zh",
      "https://zh.stardewvalleywiki.com/洒水器",
      "https://zh.stardewvalleywiki.com/加压喷头",
      "https://zh.stardewvalleywiki.com/温室",
    ],
  },
  {
    pathname: "/zh/glasshouse-stardew-valley",
    staticPageFile: "zh/glasshouse-stardew-valley.html",
    heading: "星露谷物语温室布局：120格耕地与洒水器摆放指南",
    metadata: {
      title: "星露谷物语温室布局：120格耕地与洒水器摆放指南",
      description:
        "了解温室解锁、10×12耕地、洒水器占用和果树生长限制，再用温室地图检查布局后下种。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/glasshouse-stardew-valley-cover.webp",
        alt: "玻璃墙温室内空耕地与一圈木框的原创插画",
      },
    ],
    requiredBodyPhrases: [
      "先决定温室要服务哪种玩法",
      "规划器只检查摆放关系，不代替游戏状态",
    ],
    requiredHrefs: [
      "/zh?farmType=greenhouse",
      "/zh/sprinkler-stardew",
    ],
  },
  {
    pathname: "/zh/oak-tree-stardew",
    staticPageFile: "zh/oak-tree-stardew.html",
    heading: "星露谷物语橡树：橡子种植、间距与树脂采集",
    metadata: {
      title: "星露谷物语橡树：橡子种植、间距与树脂采集",
      description:
        "认清橡树和果树，按野树间距种下橡子，成熟后用树液采集器每 7 天收橡树树脂，或砍树取木材。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/oak-tree-stardew-cover.webp",
        alt: "农场土路上间隔种植的橡树原创插画，一棵树干挂着木桶，地面有橡子",
      },
    ],
    requiredBodyPhrases: [
      "先认星露谷物语橡树，别种成枫树",
      "规划器只显示摆放关系",
    ],
    requiredHrefs: [
      "/zh#planner",
    ],
  },
  {
    pathname: "/zh/stardew-valley-trees",
    staticPageFile: "zh/stardew-valley-trees.html",
    heading: "星露谷种树：先分普通树和果树，再在农场图上留间隔",
    metadata: {
      title: "星露谷种树：先分普通树和果树，再在农场图上留间隔",
      description:
        "温室里的果树不是这篇的任务。果树要未开垦的 3×3；打开「树木不可生长区」。规划器能摆外观，没有果树 3×3 检查。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/stardew-valley-trees-cover.webp",
        alt: "俯视农场插画：左侧是挂树液桶的保留树丛，中间是树干留空的果树区，右侧是已清空的空地。",
      },
    ],
    requiredBodyPhrases: [
      "先写下本季树的任务",
      "规划器没有果树 3×3 检查",
    ],
    requiredHrefs: [
      "/zh#planner",
      "/zh/glasshouse-stardew-valley",
      "/zh/sprinkler-stardew",
    ],
  },
  {
    pathname: "/zh/maple-tree-stardew",
    staticPageFile: "zh/maple-tree-stardew.html",
    heading: "星露谷物语枫树：别靠树冠认，采集器 9 天出枫糖浆",
    metadata: {
      title: "星露谷物语枫树：别靠树冠认，采集器 9 天出枫糖浆",
      description:
        "先确认是枫树种子，皮埃尔不卖。避开成年树邻格养成，采集 4 级挂采集器，普通 9 天出枫糖浆。规划器搜 Maple Tree。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/maple-tree-stardew-cover.webp",
        alt: "近处枫树树干挂着木桶，地面散落带翅种子，土路分叉通向农舍与风车的水彩插画",
      },
    ],
    requiredBodyPhrases: [
      "先认枫树，别种成橡树",
      "在规划器里标 Maple Tree",
    ],
    requiredHrefs: [
      "/zh#planner",
      "/zh/oak-tree-stardew",
    ],
  },
];

const staticHomepageExpectations: readonly StaticHomepageExpectation[] = [
  {
    staticPageFile: "index.html",
    heroTitleBefore: "Stardew Valley ",
    heroEmphasis: "Planner",
    heroTitleAfter: "Free Online Farm Layout Tool",
    heroSupportingCopy:
      "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
    heroTrustedBy: "Free fan-made planner. Projects stay in this browser.",
    featuresHeading: "What the planner does",
    featuresDescriptions: [
      "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is in the map picker. Pick the map you actually play before you place anything.",
      "Arrange buildings, crops, placeables, and decor. Turn on sprinkler, scarecrow, Bee House, and Junimo Hut coverage while you work.",
      "Spring, summer, fall, and winter are available. Save import is experimental, and modded items may not map. Export a standard or high-quality screenshot.",
    ],
    whyChooseHeading: "Why use this planner",
    whyChooseDescriptions: [
      "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands are in the picker, plus Ginger Island. Choose that map first, then place anything.",
      "Arrange buildings, crops, placeables, and decor together. You can see a blocked path before you rebuild it in-game.",
      "Paths look tidy, but they take crop tiles. Keep the farmhouse, chests, and shipping bin reachable on a normal day.",
      "Turn on sprinkler, scarecrow, Bee House, and Junimo Hut coverage while you work. Put processing on a path you already walk.",
      "Each corner is its own farm. Decide what belongs in which quadrant before you drop barns and fields that are slow to move.",
      "Spring, summer, fall, and winter are available. When the layout holds, export a standard or high-quality screenshot and build from that.",
      "There is no cloud sync. A different browser or a data wipe will lose them. Save import is experimental, and modded items may not map. This planner is free and fan-made.",
    ],
    howToHeading: "Lay out the farm in three passes",
    howToDescriptions: [
      "Pin the tiles that never move. Reserve work zones, then place barns, coops, sheds, and fields. Walk one ordinary day's route last, and fix blocked paths on this grid.",
      "Pick the farm map you actually play. Water, cliffs, bridges, and exits stay put. Use the farmhouse and shipping bin as route anchors, and leave the ground around them open.",
      "Give crops, animals, trees, storage, and processing their own areas. Draw wide boundaries first. Then place barns, coops, sheds, and fields. Decor comes last.",
      "Start at the farmhouse, then fields, animals, chests, and the shipping bin. If a path is blocked, change the plan here instead of rebuilding in-game.",
    ],
    closingCtaHeading: "Finish the layout on this page, then build in-game.",
    closingCtaSupportLine: "No sign-up. Projects stay in this browser.",
    sectionImageSources: [
      "/homepage/hero/spring-crops.webp",
      "/homepage/hero/beach-farm.webp",
      "/homepage/hero/forest-farm.webp",
      "/homepage/features-pixel-farm.webp",
      "/homepage/why-choose/beach-decorative-machooo.webp",
      "/homepage/why-choose/beach-geometric-jennameeps.webp",
      "/homepage/why-choose/beach-organized-justkuwl.webp",
      "/homepage/why-choose/beach-processing-shady-kegyard.webp",
      "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
      "/homepage/why-choose/fourcorners-balanced-emerald.webp",
      "/homepage/why-choose/fourcorners-coop-hallofax.webp",
    ],
    faqHeading: "Check these before you start",
    faqAnswers: [
      "Projects stay in this browser. No account, no cloud sync. A different device or a data wipe will lose them.",
      "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, Meadowlands, plus Ginger Island.",
      "Spring, summer, fall, and winter. Sprinkler, scarecrow, Bee House, and Junimo Hut coverage can be turned on.",
      "Yes, but it is experimental. Modded items may not map.",
      "Yes. Standard and high-quality downloads.",
    ],
    trustHeading: "About this planner",
    trustDescription:
      "Fan-made. Not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
    plannerHref: "#planner",
    blogHref: "/blog",
    blogLabel: "Blog",
    homepageHref: "/",
    jsonLdName: "Stardew Valley Farm Planner",
    jsonLdDescription:
      "Plan Stardew Valley farm layouts in your browser with an interactive map.",
    jsonLdUrl: "https://stardewvalleyplanner.art",
    jsonLdLocale: "en",
  },
  {
    staticPageFile: "zh.html",
    heroTitleBefore: "星露谷物语",
    heroEmphasis: "规划器",
    heroTitleAfter: "免费在线农场布局工具",
    heroSupportingCopy:
      "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
    heroTrustedBy: "免费玩家规划器。项目保存在当前浏览器。",
    featuresHeading: "功能介绍",
    featuresDescriptions: [
      "标准、河流、森林、山顶、荒野、四角、海滩、草原都能开。地图选择器里还有姜岛。先选你正在玩的那张图，再摆东西。",
      "建筑、作物、可放置物和装饰都能放。洒水器、稻草人、蜂房、祝尼魔小屋的覆盖范围可以直接看。",
      "春、夏、秋、冬都能切。存档导入仍是实验性的，模组物品可能对不上。导出有普通和高清截图。",
    ],
    whyChooseHeading: "为什么用这个规划器",
    whyChooseDescriptions: [
      "标准、河流、森林、山顶、荒野、四角、海滩、草原都能开，地图选择器里还有姜岛。先选对地图，再摆东西。",
      "建筑、作物、可放置物和装饰都在同一格网上排。哪条路被堵住，进游戏前就能看出来。",
      "路好看，但会占耕地。农舍、箱子、出货箱周围先留通路，一天的活才走得通。",
      "洒水器、稻草人、蜂房、祝尼魔小屋的覆盖可以随时打开。加工设备放在每天会走的路上，收的时候才不用绕。",
      "四个角等于四块地。先定每块干什么，再放大件，避免畜棚和田地放完难挪。",
      "春、夏、秋、冬都能切。方案定了就导出普通或高清截图，照着进游戏建。",
      "没有云同步。换浏览器或清数据会丢。存档导入仍是实验性的，模组物品可能对不上。这是免费的玩家工具，和官方没有隶属或认可关系。",
    ],
    howToHeading: "分三步排出农场",
    howToDescriptions: [
      "先标不会动的地，再分区放大件，最后按一天的活走一遍。堵住了就改这张图，别等进游戏再建。",
      "选你正在玩的那张农场。水、悬崖、桥和出口不会挪。农舍和出货箱当路线锚点，周围先别填满。",
      "作物、动物、树木、储存、加工先各留一块，边界画宽一点。再放畜棚、鸡舍、棚屋和田地。小装饰最后填。",
      "从农舍出发，再到田地、动物区、箱子、出货箱。哪条路堵住了，就改这张图，别等游戏里拆。",
    ],
    closingCtaHeading: "先在这页摆完，再进游戏建。",
    closingCtaSupportLine: "不用注册。方案留在这台浏览器。",
    sectionImageSources: [
      "/homepage/hero/spring-crops.webp",
      "/homepage/hero/beach-farm.webp",
      "/homepage/hero/forest-farm.webp",
      "/homepage/features-pixel-farm.webp",
      "/homepage/why-choose/beach-decorative-machooo.webp",
      "/homepage/why-choose/beach-geometric-jennameeps.webp",
      "/homepage/why-choose/beach-organized-justkuwl.webp",
      "/homepage/why-choose/beach-processing-shady-kegyard.webp",
      "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
      "/homepage/why-choose/fourcorners-balanced-emerald.webp",
      "/homepage/why-choose/fourcorners-coop-hallofax.webp",
    ],
    faqHeading: "开始前先看这几件事",
    faqAnswers: [
      "只存在你正在用的浏览器。没有账号，也没有云同步。换设备或清数据会丢。",
      "标准、河流、森林、山顶、荒野、四角、海滩、草原，加上姜岛。",
      "春夏秋冬都能切。洒水器、稻草人、蜂房、祝尼魔小屋的覆盖可以打开。",
      "能，但是实验功能。模组物品可能对不上。",
      "能。普通和高清截图都可以下。",
    ],
    trustHeading: "玩家做的工具",
    trustDescription: "和 ConcernedApe、《星露谷物语》官方没有隶属或认可关系。",
    plannerHref: "#planner",
    blogHref: "/zh/blog",
    blogLabel: "博客",
    homepageHref: "/zh",
    jsonLdName: "星露谷农场规划器",
    jsonLdDescription: "使用本地地图、物品和项目规划你的星露谷农场布局。",
    jsonLdUrl: "https://stardewvalleyplanner.art/zh",
    jsonLdLocale: "zh-CN",
  },
];

function readStaticPageHtml(staticPageFile: string): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);

  if (!existsSync(staticPagePath)) {
    throw new Error(`Expected prebuilt static page file: ${staticPagePath}`);
  }

  return readFileSync(staticPagePath, "utf8");
}

function parseStaticPageDocument(
  staticPageHtml: string,
  staticPageFile: string,
): XmlDocument {
  return new DOMParser({
    onError(errorLevel, errorMessage) {
      throw new Error(
        `Could not parse static page ${staticPageFile}: ${errorLevel}: ${errorMessage}`,
      );
    },
  }).parseFromString(staticPageHtml, "text/html");
}

function findMatchingCoverImageElements(
  staticPageDocument: XmlDocument,
  expectedCoverImage: Readonly<{ src: string; alt: string }>,
): XmlElement[] {
  return Array.from(staticPageDocument.getElementsByTagName("img")).filter(
    (imageElement) =>
      imageElement.getAttribute("src") === expectedCoverImage.src &&
      imageElement.getAttribute("alt") === expectedCoverImage.alt,
  );
}

function readInitialDocumentLanguage(
  staticPageHtml: string,
  pathname: string,
  staticPageFile: string,
): string {
  const staticPagePath = join(process.cwd(), "out", staticPageFile);
  const firstHtmlTag = staticPageHtml.match(/<html\b[^>]*>/i)?.[0];

  if (!firstHtmlTag) {
    throw new Error(
      `Expected ${pathname} static artifact ${staticPagePath} to contain a generated <html ...> tag.`,
    );
  }

  const documentLanguage = firstHtmlTag.match(/\slang\s*=\s*(["'])([^"']*)\1/i)?.[2];

  if (!documentLanguage) {
    throw new Error(
      `Expected ${pathname} static artifact ${staticPagePath} first <html ...> tag to include a lang attribute.`,
    );
  }

  return documentLanguage;
}

function expectedCanonicalUrl(pathname: string): string {
  return `https://stardewvalleyplanner.art${pathname === "/" ? "" : pathname}`;
}

function escapeHtmlAttributeValue(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function readJsonLdStructuredData(
  staticPageHtml: string,
  staticPageFile: string,
): readonly Record<string, unknown>[] {
  const staticPageDocument = parseStaticPageDocument(
    staticPageHtml,
    staticPageFile,
  );
  const jsonLdScriptElements = Array.from(
    staticPageDocument.getElementsByTagName("script"),
  ).filter(
    (scriptElement) =>
      scriptElement.getAttribute("type") === "application/ld+json",
  );

  if (jsonLdScriptElements.length === 0) {
    throw new Error(
      `Expected ${staticPageFile} to contain at least one JSON-LD script.`,
    );
  }

  return jsonLdScriptElements.map((scriptElement, index) => {
    const serializedStructuredData = scriptElement.textContent ?? "";
    let structuredData: unknown;

    try {
      structuredData = JSON.parse(serializedStructuredData);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `Expected ${staticPageFile} JSON-LD script ${index + 1} to contain valid JSON. Received: ${JSON.stringify(serializedStructuredData)}.`,
        );
      }

      throw error;
    }

    if (typeof structuredData !== "object" || structuredData === null) {
      throw new Error(
        `Expected ${staticPageFile} JSON-LD script ${index + 1} to be an object. Received: ${JSON.stringify(structuredData)}.`,
      );
    }

    return structuredData as Record<string, unknown>;
  });
}

function findStructuredDataByType(
  structuredDataEntries: readonly Record<string, unknown>[],
  schemaType: string,
): readonly Record<string, unknown>[] {
  return structuredDataEntries.filter(
    (structuredData) => structuredData["@type"] === schemaType,
  );
}

function expectStaticHomepageContent(
  staticPageHtml: string,
  expectedHomepage: StaticHomepageExpectation,
): void {
  expect(staticPageHtml).toContain('data-homepage-shell="true"');
  expect(staticPageHtml).toContain(expectedHomepage.heroTitleBefore);
  expect(staticPageHtml).toContain(
    `<em data-homepage-hero-emphasis="true">${expectedHomepage.heroEmphasis}</em>`,
  );
  expect(staticPageHtml).toContain(expectedHomepage.heroTitleAfter);
  expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
  expect(staticPageHtml).toContain(expectedHomepage.heroSupportingCopy);
  expect(staticPageHtml).toContain(expectedHomepage.heroTrustedBy);
  expect(staticPageHtml).toContain(`>${expectedHomepage.featuresHeading}</h2>`);
  for (const featuresDescription of expectedHomepage.featuresDescriptions) {
    expect(staticPageHtml).toContain(featuresDescription);
  }
  expect(staticPageHtml).toContain(`>${expectedHomepage.whyChooseHeading}</h2>`);
  for (const whyChooseDescription of expectedHomepage.whyChooseDescriptions) {
    expect(staticPageHtml).toContain(whyChooseDescription);
  }
  expect(staticPageHtml).toContain(`>${expectedHomepage.howToHeading}</h2>`);
  for (const howToDescription of expectedHomepage.howToDescriptions) {
    expect(staticPageHtml).toContain(howToDescription);
  }
  expect(staticPageHtml).toContain(expectedHomepage.closingCtaHeading);
  expect(staticPageHtml).not.toContain(expectedHomepage.closingCtaSupportLine);
  for (const sectionImageSource of expectedHomepage.sectionImageSources) {
    expect(staticPageHtml).toContain(`src="${sectionImageSource}"`);
  }
  expect(staticPageHtml).not.toContain("/homepage/how-to-pixel-farm.webp");
  expect(staticPageHtml).not.toContain("data-homepage-farm-guides");
  expect(staticPageHtml).not.toContain("data-homepage-farm-guide-links");
  expect(staticPageHtml).not.toContain("data-homepage-planning-guide");
  expect(staticPageHtml).not.toContain("stardew-valley-planner-layout");
  expect(staticPageHtml).toContain(`>${expectedHomepage.faqHeading}</h2>`);
  for (const faqAnswer of expectedHomepage.faqAnswers) {
    expect(staticPageHtml).toContain(faqAnswer);
  }
  expect(staticPageHtml).toContain(
    `aria-label="${expectedHomepage.trustHeading}"`,
  );
  expect(staticPageHtml).toContain(expectedHomepage.trustDescription);
  expect(staticPageHtml).toContain('data-homepage-workspace="true"');
  expect(staticPageHtml).toContain("data-homepage-planner-preview");
  expect(staticPageHtml).toContain(
    'src="/public-previews/1.6.15/maps/previews/Farm.webp"',
  );
  expect(staticPageHtml).not.toContain("Loading planner…");
  const homepageSectionMarkers = [
    'data-homepage-workspace="true"',
    'id="capabilities"',
    'id="why-choose"',
    'id="how-to"',
    'data-homepage-closing-cta="true"',
    'id="faq"',
  ] as const;
  let previousHomepageSectionPosition = staticPageHtml.indexOf(
    homepageSectionMarkers[0],
  );
  expect(previousHomepageSectionPosition).toBeGreaterThanOrEqual(0);
  for (const homepageSectionMarker of homepageSectionMarkers.slice(1)) {
    const homepageSectionPosition = staticPageHtml.indexOf(
      homepageSectionMarker,
    );
    expect(homepageSectionPosition).toBeGreaterThan(
      previousHomepageSectionPosition,
    );
    previousHomepageSectionPosition = homepageSectionPosition;
  }
  expect(
    staticPageHtml.match(
      new RegExp(`href="${expectedHomepage.plannerHref}"`, "g"),
    ),
  ).toHaveLength(4);
  expect(staticPageHtml).toContain(
    `<a href="${expectedHomepage.blogHref}">${expectedHomepage.blogLabel}</a>`,
  );
  expect(staticPageHtml).not.toContain('href="/farm-comparison"');
  expect(staticPageHtml).not.toContain('href="/mods"');
  expect(staticPageHtml).not.toContain('href="/zh/farm-comparison"');
  expect(staticPageHtml).not.toContain('href="/zh/mods"');
  expect(staticPageHtml).toContain(`href="${expectedHomepage.homepageHref}"`);
  const structuredDataEntries = readJsonLdStructuredData(
    staticPageHtml,
    expectedHomepage.staticPageFile,
  );
  const webApplications = findStructuredDataByType(
    structuredDataEntries,
    "WebApplication",
  );
  const websites = findStructuredDataByType(structuredDataEntries, "WebSite");

  expect(webApplications).toHaveLength(1);
  expect(webApplications[0]).toMatchObject({
    "@type": "WebApplication",
    name: expectedHomepage.jsonLdName,
    description: expectedHomepage.jsonLdDescription,
    url: expectedHomepage.jsonLdUrl,
    inLanguage: expectedHomepage.jsonLdLocale,
    isPartOf: { "@id": "https://stardewvalleyplanner.art/#website" },
  });

  if (expectedHomepage.jsonLdLocale === "en") {
    expect(websites).toHaveLength(1);
    expect(websites[0]).toMatchObject({
      "@type": "WebSite",
      "@id": "https://stardewvalleyplanner.art/#website",
      name: "Stardew Valley Planner",
      url: "https://stardewvalleyplanner.art",
      inLanguage: ["en", "zh-CN"],
    });
  } else {
    expect(websites).toHaveLength(0);
  }
  expect(staticPageHtml).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
  expect(staticPageHtml).not.toContain("reference-runtime-root");
  expect(staticPageHtml).not.toContain("/reference-runtime/bootstrap.mjs");
  expect(staticPageHtml).not.toContain("/_app/immutable/");
  expect(staticPageHtml).not.toContain("data-sveltekit-");
}

describe("static public pages", () => {
  it("requires a whitespace-delimited lang attribute on the first document html tag", () => {
    for (const nonLanguageAttributeHtml of [
      '<html data-lang="en">',
      '<html aria-lang="en">',
      '<html xml:lang="en">',
    ]) {
      expect(() =>
        readInitialDocumentLanguage(
          nonLanguageAttributeHtml,
          "/parser-fixture",
          "parser-fixture.html",
        ),
      ).toThrow(/first <html \.\.\.> tag to include a lang attribute/);
    }
  });

  it("reads real JSON-LD script elements while ignoring commented markup", () => {
    const fixtureStructuredData = readJsonLdStructuredData(
      `<!doctype html>
      <html><head>
        <!-- <script type="application/ld+json">{"@type":"Ignored"}</script> -->
        <script data-test="website" type="application/ld+json">{"@type":"WebSite"}</script>
        <script nonce="fixture" type="application/ld+json">{"@type":"WebApplication"}</script>
      </head><body></body></html>`,
      "json-ld-parser-fixture.html",
    );

    expect(fixtureStructuredData).toHaveLength(2);
    expect(fixtureStructuredData.map((entry) => entry["@type"])).toEqual([
      "WebSite",
      "WebApplication",
    ]);
  });

  it("exports crawler-discovery files alongside the public pages", () => {
    expect(existsSync(join(process.cwd(), "out", "robots.txt"))).toBe(true);
    expect(existsSync(join(process.cwd(), "out", "sitemap.xml"))).toBe(true);
  });

  it("exports all bilingual blog pages with article discovery metadata and original covers", () => {
    for (const {
      articleOnlySchema,
      pathname,
      staticPageFile,
      heading,
      metadata,
      documentLanguage,
      schemaType,
      shouldIndex,
      coverImages,
      requiredBodyPhrases,
      requiredHrefs,
    } of staticBlogPageExpectations) {
      const staticPageHtml = readStaticPageHtml(staticPageFile);
      const staticPageDocument = parseStaticPageDocument(
        staticPageHtml,
        staticPageFile,
      );
      const englishPathname = pathname.startsWith("/zh")
        ? pathname.replace(/^\/zh/, "") || "/"
        : pathname;
      const chinesePathname = `/zh${englishPathname === "/" ? "" : englishPathname}`;

      expect(
        readInitialDocumentLanguage(staticPageHtml, pathname, staticPageFile),
      ).toBe(documentLanguage);
      expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      expect(staticPageHtml).toContain(
        `<h1>${escapeHtmlAttributeValue(heading)}</h1>`,
      );
      if (metadata !== undefined) {
        expect(staticPageHtml).toContain(
          `<title>${escapeHtmlAttributeValue(metadata.title)}</title>`,
        );
        expect(staticPageHtml).toContain(
          `<meta name="description" content="${escapeHtmlAttributeValue(metadata.description)}"`,
        );

        const structuredDataEntries = readJsonLdStructuredData(
          staticPageHtml,
          staticPageFile,
        );
        const matchingStructuredData = findStructuredDataByType(
          structuredDataEntries,
          schemaType,
        );
        expect(matchingStructuredData).toHaveLength(1);
        expect(matchingStructuredData[0]).toMatchObject({
          headline: metadata.title,
          description: metadata.description,
        });

        if (articleOnlySchema) {
          expect(
            structuredDataEntries.map((structuredData) => structuredData["@type"]),
          ).toEqual(["Article"]);
          for (const forbiddenSchemaType of [
            "BlogPosting",
            "FAQPage",
            "QAPage",
          ]) {
            expect(staticPageHtml).not.toContain(
              `\"@type\":\"${forbiddenSchemaType}\"`,
            );
          }
        }
      }
      expect(staticPageHtml).toContain(
        `<link rel="canonical" href="${expectedCanonicalUrl(pathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="en" href="${expectedCanonicalUrl(englishPathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="zh-CN" href="${expectedCanonicalUrl(chinesePathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="x-default" href="${expectedCanonicalUrl(englishPathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `<meta name="robots" content="${shouldIndex ? "index" : "noindex"}, follow"`,
      );
      expect(staticPageHtml).toContain(`\"@type\":\"${schemaType}\"`);
      expect(staticPageHtml).not.toContain('id="reference-runtime-root"');
      expect(staticPageHtml).not.toContain(
        'src="/reference-runtime/bootstrap.mjs"',
      );
      expect(staticPageHtml).not.toContain("/_app/immutable/");
      expect(staticPageHtml).not.toContain("data-sveltekit-");

      for (const requiredBodyPhrase of requiredBodyPhrases ?? []) {
        expect(staticPageHtml).toContain(requiredBodyPhrase);
      }
      for (const requiredHref of requiredHrefs ?? []) {
        expect(staticPageHtml).toContain(
          `href="${escapeHtmlAttributeValue(requiredHref)}"`,
        );
      }

      for (const coverImage of coverImages) {
        const matchingCoverImageElements = findMatchingCoverImageElements(
          staticPageDocument,
          coverImage,
        );

        expect(
          matchingCoverImageElements,
          `Expected ${pathname} to contain a cover image with src=${coverImage.src} and alt=${coverImage.alt}.`,
        ).not.toHaveLength(0);

        for (const matchingCoverImageElement of matchingCoverImageElements) {
          expect(matchingCoverImageElement.getAttribute("width")).toBe("1672");
          expect(matchingCoverImageElement.getAttribute("height")).toBe("941");

          if (schemaType === "CollectionPage") {
            expect(matchingCoverImageElement.getAttribute("loading")).toBe(
              "lazy",
            );
          } else {
            expect(matchingCoverImageElement.getAttribute("loading")).not.toBe(
              "lazy",
            );
          }
        }
      }
    }
  });

  it("exports all bilingual public pages with static metadata and paired language alternates", () => {
    for (const [
      pathname,
      staticPageFile,
      expectedTitle,
      expectedDescription,
      expectedHeading,
      expectedDocumentLanguage,
      expectedSectionHeadings,
    ] of staticPublicPageExpectations) {
      const staticPageHtml = readStaticPageHtml(staticPageFile);
      const englishPathname = pathname.startsWith("/zh")
        ? pathname.replace(/^\/zh/, "") || "/"
        : pathname;
      const chinesePathname = `/zh${englishPathname === "/" ? "" : englishPathname}`;
      const expectedNavigationLabel = pathname.startsWith("/zh")
        ? "星露谷物语农场规划器"
        : "Stardew Valley Farm Planner";

      expect(
        readInitialDocumentLanguage(
          staticPageHtml,
          pathname,
          staticPageFile,
        ),
        `Expected ${pathname} static artifact ${join(process.cwd(), "out", staticPageFile)} to emit lang=${expectedDocumentLanguage} from its first <html ...> tag.`,
      ).toBe(expectedDocumentLanguage);

      expect(staticPageHtml).toContain(`<title>${expectedTitle}</title>`);
      expect(staticPageHtml).toContain(
        `<meta name="description" content="${escapeHtmlAttributeValue(expectedDescription)}"/>`,
      );
      expect(staticPageHtml).toContain(
        `<meta property="og:image" content="${expectedSocialImageUrl}"/>`,
      );
      expect(staticPageHtml).toContain(
        `<meta name="twitter:image" content="${expectedSocialImageUrl}"/>`,
      );
      expect(staticPageHtml).toContain(
        `<link rel="canonical" href="${expectedCanonicalUrl(pathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="en" href="${expectedCanonicalUrl(englishPathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="zh-CN" href="${expectedCanonicalUrl(chinesePathname)}"`,
      );
      expect(staticPageHtml).toContain(
        `hrefLang="x-default" href="${expectedCanonicalUrl(englishPathname)}"`,
      );

      expect(staticPageHtml).toContain('href="https://discord.gg/GGfUJZsMN"');

      if (pathname === "/contact" || pathname === "/zh/contact") {
        expect(staticPageHtml).toContain(
          '<meta name="robots" content="noindex, follow"/>',
        );
        expect(staticPageHtml).toContain('data-contact-discord="true"');
        expect(staticPageHtml).toContain(
          pathname === "/zh/contact" ? "加入 Discord" : "Join Discord",
        );
      }

      const expectedHomepage = staticHomepageExpectations.find(
        (homepageExpectation) =>
          homepageExpectation.staticPageFile === staticPageFile,
      );

      if (expectedHomepage !== undefined) {
        expectStaticHomepageContent(staticPageHtml, expectedHomepage);
        continue;
      }

      expect(staticPageHtml).toMatch(
        new RegExp(`<h1(?:\\s[^>]*)?>${expectedHeading}`),
      );
      expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
      for (const expectedSectionHeading of expectedSectionHeadings ?? []) {
        expect(staticPageHtml).toMatch(
          new RegExp(
            `<h2(?:\\s[^>]*)?>${escapeRegularExpression(expectedSectionHeading)}</h2>`,
          ),
        );
      }
      expect(staticPageHtml).toContain(`aria-label="${expectedNavigationLabel}"`);
      expect(staticPageHtml).not.toContain("data-homepage-farm-guides");
      expect(staticPageHtml).not.toContain("data-homepage-farm-guide-links");
      expect(staticPageHtml).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
      expect(staticPageHtml).not.toContain("reference-runtime-root");
      expect(staticPageHtml).not.toContain(
        "/reference-runtime/bootstrap.mjs",
      );
      expect(staticPageHtml).not.toContain("/_app/immutable/");
      expect(staticPageHtml).not.toContain("data-sveltekit-");
    }

    expect(
      staticPublicPageExpectations.filter(
        ([pathname, , , , , expectedDocumentLanguage]) =>
          !pathname.startsWith("/zh") && expectedDocumentLanguage === "en",
      ),
    ).toHaveLength(4);
    expect(
      staticPublicPageExpectations.filter(
        ([pathname, , , , , expectedDocumentLanguage]) =>
          pathname.startsWith("/zh") && expectedDocumentLanguage === "zh-CN",
      ),
    ).toHaveLength(4);
    expect(
      existsSync(
        join(
          process.cwd(),
          "out",
          "social-images",
          "stardew-valley-farm-planner.png",
        ),
      ),
    ).toBe(true);
  });

  it("exports all English and Chinese legal artifacts", () => {
    for (const staticPageFile of [
      "privacy.html",
      "terms.html",
      "zh/privacy.html",
      "zh/terms.html",
    ]) {
      expect(existsSync(join(process.cwd(), "out", staticPageFile))).toBe(true);
    }
  });

  it("exports global 404 artifacts with the English root document shell", () => {
    for (const staticPageFile of ["404.html", "_not-found.html"]) {
      const staticPageHtml = readStaticPageHtml(staticPageFile);

      expect(
        readInitialDocumentLanguage(
          staticPageHtml,
          "/unknown-path",
          staticPageFile,
        ),
      ).toBe("en");
      expect(staticPageHtml).toMatch(
        /<link rel="stylesheet" href="\/_next\/static\/chunks\/[^"/]+\.css"/,
      );
      expect(staticPageHtml).toContain('<link rel="icon" href="/favicon.ico"/>');
      expect(staticPageHtml).not.toContain("data-sveltekit-");
      expect(staticPageHtml).toContain(
        "<title>404: This page could not be found.</title>",
      );
      expect(staticPageHtml).toContain("This page could not be found.");
      expect(staticPageHtml).toContain('<meta name="robots" content="noindex"/>');
    }
  });
});
