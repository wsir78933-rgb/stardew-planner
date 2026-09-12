import type { HomepageLocale } from "./homepage-locale";
import type { SiteFooterCopy } from "../site-footer/site-footer-content";

type HomepageFeatureItem = Readonly<{
  title: string;
  description: string;
}>;

type HomepageFarmLayoutSlide = Readonly<{
  quote: string;
  name: string;
  designation: string;
  src: string;
  imageAlt: string;
}>;

type HomepageHowToStep = Readonly<{
  title: string;
  description: string;
  benefits: readonly string[];
}>;

type HomepageFaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export type HomepageHeroFanImage = Readonly<{
  src: string;
  alt: string;
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
    trustedBy: string;
    fanImages: readonly [
      HomepageHeroFanImage,
      HomepageHeroFanImage,
      HomepageHeroFanImage,
    ];
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
    previousLabel: string;
    nextLabel: string;
    testimonials: readonly [
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
    ];
  }>;
  howTo: Readonly<{
    heading: string;
    description: string;
    steps: readonly [HomepageHowToStep, HomepageHowToStep, HomepageHowToStep];
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
      headlineAfter: "Free Online Farm Layout Tool",
      supportingCopy:
        "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
      primaryActionLabel: "Start planning",
      trustedBy: "Free fan-made planner. Projects stay in this browser.",
      fanImages: [
        {
          src: "/homepage/hero/spring-crops.webp",
          alt: "Watercolor spring farm with crop rows, a farmhouse, scarecrow, and greenhouse",
        },
        {
          src: "/homepage/hero/beach-farm.webp",
          alt: "Watercolor beach farm with a cabin, fenced plots, and a rocky shoreline",
        },
        {
          src: "/homepage/hero/forest-farm.webp",
          alt: "Watercolor forest farm clearing with a dirt path, fruit tree, and mossy cabin",
        },
      ],
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
      previousLabel: "Previous farm layout",
      nextLabel: "Next farm layout",
      testimonials: [
        {
          quote:
            "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands are in the picker, plus Ginger Island. Choose that map first, then place anything.",
          name: "Plan the map you actually play",
          designation: "Shown on a Beach farm",
          src: "/homepage/why-choose/beach-decorative-machooo.webp",
          imageAlt: "Decorative Beach farm layout by machooo, year 15",
        },
        {
          quote:
            "Arrange buildings, crops, placeables, and decor together. You can see a blocked path before you rebuild it in-game.",
          name: "Place buildings and crops on one grid",
          designation: "Shown on a Beach farm",
          src: "/homepage/why-choose/beach-geometric-jennameeps.webp",
          imageAlt: "Geometric diamond Beach farm layout by jennameeps",
        },
        {
          quote:
            "Paths look tidy, but they take crop tiles. Keep the farmhouse, chests, and shipping bin reachable on a normal day.",
          name: "Leave the walking route first",
          designation: "Shown on a Beach farm",
          src: "/homepage/why-choose/beach-organized-justkuwl.webp",
          imageAlt: "Organized Beach farm with stone paths by justkuwl",
        },
        {
          quote:
            "Turn on sprinkler, scarecrow, Bee House, and Junimo Hut coverage while you work. Put processing on a path you already walk.",
          name: "Check coverage as you place",
          designation: "Example: Beach farm",
          src: "/homepage/why-choose/beach-processing-shady-kegyard.webp",
          imageAlt: "Processing-focused Beach farm layout by shady kegyard",
        },
        {
          quote:
            "Each corner is its own farm. Decide what belongs in which quadrant before you drop barns and fields that are slow to move.",
          name: "Plan Four Corners by quadrant",
          designation: "Shown on a Four Corners farm",
          src: "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
          imageAlt: "Balanced Four Corners farm layout by rp2-phobos",
        },
        {
          quote:
            "Spring, summer, fall, and winter are available. When the layout holds, export a standard or high-quality screenshot and build from that.",
          name: "Switch seasons, then export a screenshot",
          designation: "Shown on a Four Corners farm",
          src: "/homepage/why-choose/fourcorners-balanced-emerald.webp",
          imageAlt: "Balanced Four Corners farm layout by emerald",
        },
        {
          quote:
            "There is no cloud sync. A different browser or a data wipe will lose them. Save import is experimental, and modded items may not map. This planner is free and fan-made.",
          name: "No account. Projects stay in this browser",
          designation: "Shown on a Four Corners farm",
          src: "/homepage/why-choose/fourcorners-coop-hallofax.webp",
          imageAlt: "Coop-focused Four Corners farm layout by hallofax, year 5",
        },
      ],
    },
    howTo: {
      heading: "Lay out the farm in three passes",
      description:
        "Pin the tiles that never move. Reserve work zones, then place barns, coops, sheds, and fields. Walk one ordinary day's route last, and fix blocked paths on this grid.",
      steps: [
        {
          title: "Pin the tiles that never move",
          description:
            "Pick the farm map you actually play. Water, cliffs, bridges, and exits stay put. Use the farmhouse and shipping bin as route anchors, and leave the ground around them open.",
          benefits: [
            "Ponds, rivers, and cliffs will not shift later.",
            "Bridges and exits stay put, so keep those paths open.",
            "The farmhouse and shipping bin pin the day's start and end.",
          ],
        },
        {
          title: "Zone the work, then drop the large pieces",
          description:
            "Give crops, animals, trees, storage, and processing their own areas. Draw wide boundaries first. Then place barns, coops, sheds, and fields. Decor comes last.",
          benefits: [
            "Crops, animals, trees, storage, and processing each get a block.",
            "Barns, coops, sheds, and fields set the scale of the map.",
            "Leave room at each entrance and in front of the buildings.",
          ],
        },
        {
          title: "Walk the day's chores on this grid",
          description:
            "Start at the farmhouse, then fields, animals, chests, and the shipping bin. If a path is blocked, change the plan here instead of rebuilding in-game.",
          benefits: [
            "Farmhouse → fields → animals → chests → shipping bin.",
            "A blocked tile is cheaper to move here than in-game.",
          ],
        },
      ],
    },
    closingCta: {
      heading: "Finish the layout on this page, then build in-game.",
      supportLine: "No sign-up. Projects stay in this browser.",
    },
    faq: {
      heading: "Check these before you start",
      items: [
        {
          question: "Will I lose my work?",
          answer:
            "Projects stay in this browser. No account, no cloud sync. A different device or a data wipe will lose them.",
        },
        {
          question: "Is my farm type here?",
          answer:
            "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, Meadowlands, plus Ginger Island.",
        },
        {
          question: "Can I see seasons and coverage?",
          answer:
            "Spring, summer, fall, and winter. Sprinkler, scarecrow, Bee House, and Junimo Hut coverage can be turned on.",
        },
        {
          question: "Can I import a save?",
          answer: "Yes, but it is experimental. Modded items may not map.",
        },
        {
          question: "Can I export a screenshot?",
          answer: "Yes. Standard and high-quality downloads.",
        },
      ],
    },
    trust: {
      heading: "About this planner",
      description:
        "Fan-made. Not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
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
      headlineAfter: "免费在线农场布局工具",
      supportingCopy:
        "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
      primaryActionLabel: "开始规划",
      trustedBy: "免费玩家规划器。项目保存在当前浏览器。",
      fanImages: [
        {
          src: "/homepage/hero/spring-crops.webp",
          alt: "水彩春日农场：菜畦、农舍、稻草人和温室",
        },
        {
          src: "/homepage/hero/beach-farm.webp",
          alt: "水彩海滩农场：木屋、围栏菜地和礁石海岸",
        },
        {
          src: "/homepage/hero/forest-farm.webp",
          alt: "水彩森林农场：土路、果树和长满青苔的小屋",
        },
      ],
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
      heading: "为什么用这个规划器",
      previousLabel: "上一张农场布局",
      nextLabel: "下一张农场布局",
      testimonials: [
        {
          quote:
            "标准、河流、森林、山顶、荒野、四角、海滩、草原都能开，地图选择器里还有姜岛。先选对地图，再摆东西。",
          name: "先选你正在玩的那张图",
          designation: "图例：海滩农场",
          src: "/homepage/why-choose/beach-decorative-machooo.webp",
          imageAlt: "machooo 的海滩农场装饰向布局，第 15 年",
        },
        {
          quote:
            "建筑、作物、可放置物和装饰都在同一格网上排。哪条路被堵住，进游戏前就能看出来。",
          name: "建筑和作物放在同一张图上",
          designation: "图例：海滩农场",
          src: "/homepage/why-choose/beach-geometric-jennameeps.webp",
          imageAlt: "jennameeps 的海滩农场几何菱形布局",
        },
        {
          quote:
            "路好看，但会占耕地。农舍、箱子、出货箱周围先留通路，一天的活才走得通。",
          name: "每天走的路要先留出来",
          designation: "图例：海滩农场",
          src: "/homepage/why-choose/beach-organized-justkuwl.webp",
          imageAlt: "justkuwl 用石路整理过的海滩农场",
        },
        {
          quote:
            "洒水器、稻草人、蜂房、祝尼魔小屋的覆盖可以随时打开。加工设备放在每天会走的路上，收的时候才不用绕。",
          name: "对着覆盖圈摆",
          designation: "示例：海滩农场",
          src: "/homepage/why-choose/beach-processing-shady-kegyard.webp",
          imageAlt: "shady kegyard 以加工区为主的海滩农场布局",
        },
        {
          quote:
            "四个角等于四块地。先定每块干什么，再放大件，避免畜棚和田地放完难挪。",
          name: "四角农场按四个象限来排",
          designation: "图例：四角农场",
          src: "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
          imageAlt: "rp2-phobos 的均衡四角农场布局",
        },
        {
          quote:
            "春、夏、秋、冬都能切。方案定了就导出普通或高清截图，照着进游戏建。",
          name: "切四季，再导出截图",
          designation: "图例：四角农场",
          src: "/homepage/why-choose/fourcorners-balanced-emerald.webp",
          imageAlt: "emerald 的均衡四角农场完美布局",
        },
        {
          quote:
            "没有云同步。换浏览器或清数据会丢。存档导入仍是实验性的，模组物品可能对不上。这是免费的玩家工具，和官方没有隶属或认可关系。",
          name: "不用账号，项目留在当前浏览器",
          designation: "图例：四角农场",
          src: "/homepage/why-choose/fourcorners-coop-hallofax.webp",
          imageAlt: "hallofax 以鸡舍为主的四角农场布局，第 5 年",
        },
      ],
    },
    howTo: {
      heading: "分三步排出农场",
      description:
        "先标不会动的地，再分区放大件，最后按一天的活走一遍。堵住了就改这张图，别等进游戏再建。",
      steps: [
        {
          title: "先标出不会动的地",
          description:
            "选你正在玩的那张农场。水、悬崖、桥和出口不会挪。农舍和出货箱当路线锚点，周围先别填满。",
          benefits: [
            "池塘、河流、悬崖后面改不了。",
            "桥和出口决定你每天怎么进出。",
            "农舍和出货箱钉死一天的起点和终点。",
          ],
        },
        {
          title: "先分区，再放大件",
          description:
            "作物、动物、树木、储存、加工先各留一块，边界画宽一点。再放畜棚、鸡舍、棚屋和田地。小装饰最后填。",
          benefits: [
            "作物、动物、树木、储存、加工各占一块。",
            "畜棚、鸡舍、棚屋、田地决定整张图的尺度。",
            "入口和建筑正前方先留出路。",
          ],
        },
        {
          title: "按一天的活把路走通",
          description:
            "从农舍出发，再到田地、动物区、箱子、出货箱。哪条路堵住了，就改这张图，别等游戏里拆。",
          benefits: [
            "农舍 → 田地 → 动物 → 箱子 → 出货箱。",
            "格子上挪一块，比进游戏拆重建便宜。",
          ],
        },
      ],
    },
    closingCta: {
      heading: "先在这页摆完，再进游戏建。",
      supportLine: "不用注册。方案留在这台浏览器。",
    },
    faq: {
      heading: "开始前先看这几件事",
      items: [
        {
          question: "会丢吗？",
          answer:
            "只存在你正在用的浏览器。没有账号，也没有云同步。换设备或清数据会丢。",
        },
        {
          question: "我玩的农场有吗？",
          answer: "标准、河流、森林、山顶、荒野、四角、海滩、草原，加上姜岛。",
        },
        {
          question: "四季和覆盖能看吗？",
          answer:
            "春夏秋冬都能切。洒水器、稻草人、蜂房、祝尼魔小屋的覆盖可以打开。",
        },
        {
          question: "能导存档吗？",
          answer: "能，但是实验功能。模组物品可能对不上。",
        },
        {
          question: "能导出图吗？",
          answer: "能。普通和高清截图都可以下。",
        },
      ],
    },
    trust: {
      heading: "玩家做的工具",
      description: "和 ConcernedApe、《星露谷物语》官方没有隶属或认可关系。",
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
