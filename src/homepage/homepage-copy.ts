import type { HomepageLocale } from "./homepage-locale";
import type { SiteFooterCopy } from "../site-footer/site-footer-content";

type HomepageFeatureItem = Readonly<{
  title: string;
  description: string;
}>;

type HomepageHowToStep = Readonly<{
  title: string;
  description: string;
}>;

type HomepageFaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export type HomepageCopy = Readonly<{
  navigation: Readonly<{
    productName: string;
    capabilitiesLabel: string;
    faqLabel: string;
    blogLabel: string;
    plannerActionLabel: string;
    languageLabel: string;
  }>;
  hero: Readonly<{
    headlineBefore: string;
    headlineEmphasis: string;
    headlineAfter: string;
    supportingCopy: string;
    primaryActionLabel: string;
  }>;
  plannerPreview: Readonly<{
    imageAlt: string;
  }>;
  features: Readonly<{
    heading: string;
    imageAlt: string;
    items: readonly [HomepageFeatureItem, HomepageFeatureItem, HomepageFeatureItem];
  }>;
  whyChoose: Readonly<{
    heading: string;
    imageAlt: string;
    items: readonly [HomepageFeatureItem, HomepageFeatureItem, HomepageFeatureItem];
  }>;
  howTo: Readonly<{
    heading: string;
    imageAlt: string;
    steps: readonly [
      HomepageHowToStep,
      HomepageHowToStep,
      HomepageHowToStep,
      HomepageHowToStep,
    ];
  }>;
  closingCta: Readonly<{
    heading: string;
    supportLine: string;
  }>;
  faq: Readonly<{
    heading: string;
    items: readonly [
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
    ];
  }>;
  trust: Readonly<{
    heading: string;
    description: string;
  }>;
  footer: SiteFooterCopy;
}>;

export const homepageCopyByLocale: Readonly<Record<HomepageLocale, HomepageCopy>> = {
  en: {
    navigation: {
      productName: "Stardew Valley Farm Planner",
      capabilitiesLabel: "Features",
      faqLabel: "FAQ",
      blogLabel: "Blog",
      plannerActionLabel: "Open planner",
      languageLabel: "Language",
    },
    hero: {
      headlineBefore: "Stardew Valley ",
      headlineEmphasis: "Planner",
      headlineAfter: " – Free Online Farm Layout Tool",
      supportingCopy:
        "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
      primaryActionLabel: "Start planning",
    },
    plannerPreview: {
      imageAlt:
        "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
    },
    features: {
      heading: "What the planner does",
      imageAlt: "Pixel-art farm map with eight terrain patches and an island plot",
      items: [
        {
          title: "Plan all 8 official farms, plus Ginger Island",
          description:
            "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is in the map picker. Pick the map you actually play before you place anything.",
        },
        {
          title: "Place buildings and crops, then check coverage",
          description:
            "Arrange buildings, crops, placeables, and decor. Turn on sprinkler, scarecrow, Bee House, and Junimo Hut coverage while you work.",
        },
        {
          title: "Switch seasons, import a save, export a screenshot",
          description:
            "Spring, summer, fall, and winter are available. Save import is experimental, and modded items may not map. Export a standard or high-quality screenshot.",
        },
      ],
    },
    whyChoose: {
      heading: "Why use this planner",
      imageAlt: "Pixel-art planning board next to an unbuilt farm",
      items: [
        {
          title: "Try the layout before you build in-game",
          description:
            "A barn in the wrong spot, or a field blocking the door, takes a long time to undo. Test a few placements here, then build from the plan.",
        },
        {
          title: "No account. Projects stay in this browser.",
          description:
            "There is no cloud sync. A different browser or a data wipe will lose them, so reopen the plan on the same device and browser.",
        },
        {
          title: "A free fan-made tool",
          description:
            "No payment. This planner is fan-made and is not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
        },
      ],
    },
    howTo: {
      heading: "How to use it",
      imageAlt: "Pixel-art farm map with crop, animal, and path zones",
      steps: [
        {
          title: "Pick the farm map and mark what does not move",
          description:
            "Ponds, rivers, cliffs, bridges, and exits stay put. Use the farmhouse and shipping bin as route anchors, and leave the ground around them open for now.",
        },
        {
          title: "Reserve work zones first",
          description:
            "Give crops, animals, trees, storage, and processing their own areas. Draw wide boundaries. Do not lock in every row yet.",
        },
        {
          title: "Place the large pieces next",
          description:
            "Barns, coops, sheds, and fields set the scale. Leave room at the entrance and in front. Decor comes last.",
        },
        {
          title: "Walk a normal day’s route",
          description:
            "Farmhouse to fields, animals, chests, then the shipping bin. If a path is blocked, change the plan here instead of rebuilding in-game.",
        },
      ],
    },
    closingCta: {
      heading: "The map is already on this page. Start placing.",
      supportLine: "No sign-up. Projects stay in this browser.",
    },
    faq: {
      heading: "Frequently asked questions",
      items: [
        {
          question: "Where are my projects stored?",
          answer:
            "Projects are saved locally in this browser. There is no account or cloud sync, so use the same browser and device to reopen them.",
        },
        {
          question: "Which Stardew Valley farm types can I plan?",
          answer:
            "The planner includes Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands. Ginger Island is also available in the map picker.",
        },
        {
          question: "Which seasons and coverage views are available?",
          answer:
            "You can switch between spring, summer, fall, and winter and show sprinkler, scarecrow, Bee House, and Junimo Hut coverage.",
        },
        {
          question: "Can I import a Stardew Valley save?",
          answer:
            "Yes. Game-save import is experimental, and unsupported or modded items may not be mapped.",
        },
        {
          question: "Can I export my farm layout?",
          answer:
            "Yes. The planner provides standard and high-quality screenshot downloads.",
        },
      ],
    },
    trust: {
      heading: "About this planner",
      description:
        "Fan-made Stardew Valley planning tool. Not affiliated with or endorsed by ConcernedApe or Stardew Valley. Projects stay in this browser.",
    },
    footer: {
      brandName: "Stardew Valley Farm Planner",
      description:
        "A browser-local fan-made tool for planning Stardew Valley farm layouts.",
      copyright: "© Stardew Valley Farm Planner",
      planner: {
        title: "Planner",
        home: "Planner",
      },
      explore: {
        title: "Explore",
        capabilities: "Features",
        faq: "FAQ",
        blog: "Blog",
      },
      legal: {
        title: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact us",
      },
    },
  },
  "zh-CN": {
    navigation: {
      productName: "星露谷物语农场规划器",
      capabilitiesLabel: "功能介绍",
      faqLabel: "常见问题",
      blogLabel: "博客",
      plannerActionLabel: "打开规划器",
      languageLabel: "语言",
    },
    hero: {
      headlineBefore: "星露谷物语",
      headlineEmphasis: "规划器",
      headlineAfter: "——免费在线农场布局工具",
      supportingCopy:
        "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
      primaryActionLabel: "开始规划",
    },
    plannerPreview: {
      imageAlt: "像素风标准农场地图，中央是空地，含农舍、温室和两处水塘",
    },
    features: {
      heading: "功能介绍",
      imageAlt: "像素风农场地图，含八块不同地形和一处岛状地块",
      items: [
        {
          title: "规划 8 种官方农场和姜岛",
          description:
            "标准、河流、森林、山顶、荒野、四角、海滩、草原都能开。地图选择器里还有姜岛。先选你正在玩的那张图，再摆东西。",
        },
        {
          title: "摆放建筑和作物，并检查覆盖",
          description:
            "建筑、作物、可放置物和装饰都能放。洒水器、稻草人、蜂房、祝尼魔小屋的覆盖范围可以直接看。",
        },
        {
          title: "切换四季，导入存档，导出截图",
          description:
            "春、夏、秋、冬都能切。存档导入仍是实验性的，模组物品可能对不上。导出有普通和高清截图。",
        },
      ],
    },
    whyChoose: {
      heading: "为什么选择我们",
      imageAlt: "像素风规划板放在尚未建造的农场旁",
      items: [
        {
          title: "进游戏前先试排",
          description:
            "畜棚放错、田地挡住出门，在游戏里拆了再建很慢。先在浏览器里试几个位置，再照着方案去建。",
        },
        {
          title: "不用账号，项目留在当前浏览器",
          description:
            "没有云同步。换浏览器或清数据会丢，所以用同一台设备、同一个浏览器打开即可。",
        },
        {
          title: "免费的玩家工具",
          description:
            "不收费。这是玩家做的规划器，和 ConcernedApe 或《星露谷物语》官方没有隶属或认可关系。",
        },
      ],
    },
    howTo: {
      heading: "如何使用",
      imageAlt: "像素风农场地图，标出作物区、动物区和道路",
      steps: [
        {
          title: "选对农场地图，标出固定地形",
          description:
            "池塘、河流、悬崖、桥和出口不会动。农舍和出货箱先当路线锚点，周围先别填满。",
        },
        {
          title: "先画出功能分区",
          description:
            "作物、动物、树木、储存、加工各留一块。先画宽边界，别急着摆每一行。",
        },
        {
          title: "先放大件：畜棚、鸡舍、棚屋、田地",
          description:
            "这些决定整张图的尺度。入口和正前方留出路。小装饰最后再填。",
        },
        {
          title: "按一天的活走一遍路线",
          description:
            "从农舍走到田地、动物区、箱子、出货箱。堵住了就改这张图，别等游戏里再建。",
        },
      ],
    },
    closingCta: {
      heading: "地图看好了，就在上面开始摆。",
      supportLine: "不用注册。项目保存在当前浏览器。",
    },
    faq: {
      heading: "常见问题",
      items: [
        {
          question: "项目保存在哪里？",
          answer:
            "项目保存在当前浏览器本地。这里没有账号或云同步功能，因此请使用同一浏览器和设备重新打开项目。",
        },
        {
          question: "支持规划哪些星露谷物语农场类型？",
          answer:
            "规划器包含标准、河流、森林、山顶、荒野、四角、海滩和草原农场。地图选择器中还提供姜岛。",
        },
        {
          question: "可以查看哪些季节和覆盖范围？",
          answer:
            "你可以在春、夏、秋、冬之间切换，并显示洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。",
        },
        {
          question: "可以导入星露谷物语存档吗？",
          answer:
            "可以。存档导入仍是实验性功能，不受支持或来自模组的物品可能无法映射。",
        },
        {
          question: "可以导出农场布局吗？",
          answer: "可以。规划器提供标准画质和高画质的截图下载。",
        },
      ],
    },
    trust: {
      heading: "关于这个规划器",
      description:
        "这是一个玩家制作的《星露谷物语》规划工具，与 ConcernedApe 或《星露谷物语》官方无隶属或认可关系。项目只保存在当前浏览器中。",
    },
    footer: {
      brandName: "星露谷物语农场规划器",
      description: "在浏览器中本地规划《星露谷物语》农场布局的玩家工具。",
      copyright: "© 星露谷物语农场规划器",
      planner: {
        title: "规划器",
        home: "规划器",
      },
      explore: {
        title: "探索",
        capabilities: "功能介绍",
        faq: "常见问题",
        blog: "博客",
      },
      legal: {
        title: "法律",
        privacy: "隐私政策",
        terms: "服务条款",
        contact: "联系我们",
      },
    },
  },
};
