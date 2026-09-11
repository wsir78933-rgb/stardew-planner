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
  heroMarkup: string;
  heroSupportingCopy: string;
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
        alt: "Original illustration of a farm field with three empty sprinkler footprints: a four-tile plus, an eight-tile ring, and a twenty-four-tile square",
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
        alt: "Original illustration of a farm field with three empty sprinkler footprints: a four-tile plus, an eight-tile ring, and a twenty-four-tile square",
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
    heading: "Stardew Valley Sprinkler Layout: 4, 8 & 24 Tiles",
    metadata: {
      title: "Stardew Valley Sprinkler Layout: 4, 8 & 24 Tiles",
      description:
        "Compare 4, 8, and 24-tile sprinklers, choose a grid for your farm, and check coverage before planting with the Stardew Valley Planner.",
    },
    documentLanguage: "en",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "Original illustration of a farm field with three empty sprinkler footprints: a four-tile plus, an eight-tile ring, and a twenty-four-tile square",
      },
    ],
    requiredBodyPhrases: [
      "Treat every sprinkler as a shape before you treat it as a farm plan.",
      "Pressure Nozzle grows the radius to 3×3, 5×5, or 7×7.",
      "The planner shows placement geometry, not tomorrow morning.",
    ],
    requiredHrefs: [
      "/",
      "/?farmType=beach",
      "/?farmType=greenhouse",
      "/?farmType=meadowlands",
      "/carpenter-stardew",
      "https://wiki.stardewvalley.net/Sprinkler",
      "https://wiki.stardewvalley.net/Quality_Sprinkler",
      "https://wiki.stardewvalley.net/Iridium_Sprinkler",
      "https://wiki.stardewvalley.net/Pressure_Nozzle",
      "https://wiki.stardewvalley.net/Greenhouse#Sprinklers",
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
        alt: "俯视农田网格中对比优质与铱制洒水器覆盖范围的星露谷洒水器布局示意",
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
        alt: "俯视农田网格中对比优质与铱制洒水器覆盖范围的星露谷洒水器布局示意",
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
    heading: "星露谷洒水器布局：4、8、24格覆盖与摆放",
    metadata: {
      title: "星露谷洒水器布局：4、8、24格覆盖与摆放",
      description:
        "分清普通、优质和铱制洒水器的4/8/24格范围，再用规划器检查田块、边界和通道，避免漏浇。",
    },
    documentLanguage: "zh-CN",
    schemaType: "Article",
    articleOnlySchema: true,
    shouldIndex: true,
    coverImages: [
      {
        src: "/blog/sprinkler-stardew-cover.webp",
        alt: "俯视农田网格中对比优质与铱制洒水器覆盖范围的星露谷洒水器布局示意",
      },
    ],
    requiredBodyPhrases: [
      "先把洒水器当成覆盖形状，再把它放进农场路线",
      "名义覆盖不是有效作物格",
      "把洒水器先摆进真实农场地图",
      "规划器只显示摆放关系，不代替第二天早晨的浇水",
    ],
    requiredHrefs: [
      "/zh#planner",
      "https://zh.stardewvalleywiki.com/%E6%B4%92%E6%B0%B4%E5%99%A8",
      "https://zh.stardewvalleywiki.com/%E5%8A%A0%E5%8E%8B%E5%96%B7%E5%A4%B4",
      "https://zh.stardewvalleywiki.com/%E6%B8%A9%E5%AE%A4",
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
];

const staticHomepageExpectations: readonly StaticHomepageExpectation[] = [
  {
    staticPageFile: "index.html",
    heroMarkup:
      '<h1>Stardew Valley <em data-homepage-hero-emphasis="true">Planner</em> – Free Online Farm Layout Tool</h1>',
    heroSupportingCopy:
      "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
    featuresHeading: "What the planner does",
    featuresDescriptions: [
      "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is in the map picker. Pick the map you actually play before you place anything.",
      "Arrange buildings, crops, placeables, and decor. Turn on sprinkler, scarecrow, Bee House, and Junimo Hut coverage while you work.",
      "Spring, summer, fall, and winter are available. Save import is experimental, and modded items may not map. Export a standard or high-quality screenshot.",
    ],
    whyChooseHeading: "Why use this planner",
    whyChooseDescriptions: [
      "A barn in the wrong spot, or a field blocking the door, takes a long time to undo. Test a few placements here, then build from the plan.",
      "There is no cloud sync. A different browser or a data wipe will lose them, so reopen the plan on the same device and browser.",
      "No payment. This planner is fan-made and is not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
    ],
    howToHeading: "How to use it",
    howToDescriptions: [
      "Ponds, rivers, cliffs, bridges, and exits stay put. Use the farmhouse and shipping bin as route anchors, and leave the ground around them open for now.",
      "Give crops, animals, trees, storage, and processing their own areas. Draw wide boundaries. Do not lock in every row yet.",
      "Barns, coops, sheds, and fields set the scale. Leave room at the entrance and in front. Decor comes last.",
      "Farmhouse to fields, animals, chests, then the shipping bin. If a path is blocked, change the plan here instead of rebuilding in-game.",
    ],
    closingCtaHeading: "The map is already on this page. Start placing.",
    closingCtaSupportLine: "No sign-up. Projects stay in this browser.",
    sectionImageSources: [
      "/homepage/features-pixel-farm.webp",
      "/homepage/why-choose-pixel-farm.webp",
      "/homepage/how-to-pixel-farm.webp",
    ],
    faqHeading: "Frequently asked questions",
    faqAnswers: [
      "Projects are saved locally in this browser. There is no account or cloud sync, so use the same browser and device to reopen them.",
      "The planner includes Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is also available in the map picker.",
      "You can switch between spring, summer, fall, and winter and show sprinkler, scarecrow, Bee House, and Junimo Hut coverage.",
      "Yes. Game-save import is experimental, and unsupported or modded items may not be mapped.",
      "Yes. The planner provides standard and high-quality screenshot downloads.",
    ],
    trustHeading: "About this planner",
    trustDescription:
      "Fan-made Stardew Valley planning tool. Not affiliated with or endorsed by ConcernedApe or Stardew Valley. Projects stay in this browser.",
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
    heroMarkup:
      '<h1>星露谷物语<em data-homepage-hero-emphasis="true">规划器</em>——免费在线农场布局工具</h1>',
    heroSupportingCopy:
      "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
    featuresHeading: "功能介绍",
    featuresDescriptions: [
      "标准、河流、森林、山顶、荒野、四角、海滩、草原都能开。地图选择器里还有姜岛。先选你正在玩的那张图，再摆东西。",
      "建筑、作物、可放置物和装饰都能放。洒水器、稻草人、蜂房、祝尼魔小屋的覆盖范围可以直接看。",
      "春、夏、秋、冬都能切。存档导入仍是实验性的，模组物品可能对不上。导出有普通和高清截图。",
    ],
    whyChooseHeading: "为什么选择我们",
    whyChooseDescriptions: [
      "畜棚放错、田地挡住出门，在游戏里拆了再建很慢。先在浏览器里试几个位置，再照着方案去建。",
      "没有云同步。换浏览器或清数据会丢，所以用同一台设备、同一个浏览器打开即可。",
      "不收费。这是玩家做的规划器，和 ConcernedApe 或《星露谷物语》官方没有隶属或认可关系。",
    ],
    howToHeading: "如何使用",
    howToDescriptions: [
      "池塘、河流、悬崖、桥和出口不会动。农舍和出货箱先当路线锚点，周围先别填满。",
      "作物、动物、树木、储存、加工各留一块。先画宽边界，别急着摆每一行。",
      "这些决定整张图的尺度。入口和正前方留出路。小装饰最后再填。",
      "从农舍走到田地、动物区、箱子、出货箱。堵住了就改这张图，别等游戏里再建。",
    ],
    closingCtaHeading: "地图看好了，就在上面开始摆。",
    closingCtaSupportLine: "不用注册。项目保存在当前浏览器。",
    sectionImageSources: [
      "/homepage/features-pixel-farm.webp",
      "/homepage/why-choose-pixel-farm.webp",
      "/homepage/how-to-pixel-farm.webp",
    ],
    faqHeading: "常见问题",
    faqAnswers: [
      "项目保存在当前浏览器本地。这里没有账号或云同步功能，因此请使用同一浏览器和设备重新打开项目。",
      "规划器包含标准、河流、森林、山顶、荒野、四角、海滩和草原农场。地图选择器中还提供姜岛。",
      "你可以在春、夏、秋、冬之间切换，并显示洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。",
      "可以。存档导入仍是实验性功能，不受支持或来自模组的物品可能无法映射。",
      "可以。规划器提供标准画质和高画质的截图下载。",
    ],
    trustHeading: "关于这个规划器",
    trustDescription:
      "这是一个玩家制作的《星露谷物语》规划工具，与 ConcernedApe 或《星露谷物语》官方无隶属或认可关系。项目只保存在当前浏览器中。",
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
  expect(staticPageHtml).toContain(expectedHomepage.heroMarkup);
  expect(staticPageHtml.match(/<h1(?:\s|>)/g)).toHaveLength(1);
  expect(staticPageHtml).toContain(expectedHomepage.heroSupportingCopy);
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
  expect(staticPageHtml).toContain(expectedHomepage.closingCtaSupportLine);
  for (const sectionImageSource of expectedHomepage.sectionImageSources) {
    expect(staticPageHtml).toContain(`src="${sectionImageSource}"`);
  }
  expect(staticPageHtml).not.toContain("data-homepage-farm-guides");
  expect(staticPageHtml).not.toContain("data-homepage-farm-guide-links");
  expect(staticPageHtml).not.toContain("data-homepage-planning-guide");
  expect(staticPageHtml).not.toContain("stardew-valley-planner-layout");
  expect(staticPageHtml).toContain(`>${expectedHomepage.faqHeading}</h2>`);
  for (const faqAnswer of expectedHomepage.faqAnswers) {
    expect(staticPageHtml).toContain(faqAnswer);
  }
  expect(staticPageHtml).toContain(`>${expectedHomepage.trustHeading}</h2>`);
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
  ).toHaveLength(3);
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
