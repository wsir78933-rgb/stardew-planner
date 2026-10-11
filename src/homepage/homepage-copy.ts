import type { HomepageLocale } from "./homepage-locale";
import type { SiteFooterCopy } from "../site-footer/site-footer-content";

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

type HomepageWhatIsItem = Readonly<{
  title: string;
  description: string;
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
  whatIs: Readonly<{
    heading: string;
    imageAlt: string;
    description: string;
    items: readonly [HomepageWhatIsItem, HomepageWhatIsItem, HomepageWhatIsItem];
  }>;
  features: Readonly<{
    heading: string;
    previousLabel: string;
    nextLabel: string;
    testimonials: readonly [
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
      HomepageFarmLayoutSlide,
    ];
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
    eyebrow: string;
    heading: string;
    description: string;
    items: readonly [
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
      HomepageFaqItem,
    ];
  }>;
  footer: SiteFooterCopy;
}>;

export const homepageCopyByLocale: Readonly<Record<HomepageLocale, HomepageCopy>> = {
  en: {
    navigation: {
      productName: "Stardew Valley Farm Planner",
      capabilitiesLabel: "Farm examples",
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
          alt: "Pixel-art farm with purple houses, crop fields, trees, and a winding river",
        },
        {
          src: "/homepage/hero/beach-farm.webp",
          alt: "Pixel-art Standard Farm with a red farmhouse, crop fields, barns, trees, and ponds",
        },
        {
          src: "/homepage/hero/forest-farm.webp",
          alt: "Pixel-art island farm with red-roof buildings, crop fields, trees, and surrounding water",
        },
      ],
    },
    plannerPreview: {
      imageAlt:
        "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
    },
    whatIs: {
      heading: "What is Stardew Valley Planner?",
      imageAlt: "Stardew Valley farm layout with buildings, crop fields, paths, and ponds in autumn",
      description:
        "Stardew Valley Planner is a free online farm layout tool. Preview and adjust your layout on a map before building in-game, so you can decide how to use the space and work from a clear plan.",
      items: [
        {
          title: "Planning features",
          description:
            "Choose from all eight farm types, including Standard, Forest, Beach, and Meadowlands, plus Ginger Island. Place buildings, crops, trees, paths, and decorations; display sprinkler and scarecrow coverage; preview each season; save projects in this browser; and export layout screenshots.",
        },
        {
          title: "When it is useful",
          description:
            "Before starting a farm, decide where fields, barns, and paths will go. When expanding or rearranging, try positions for the greenhouse, coops, and processing areas while leaving routes between buildings. For a redesign, experiment with paths, trees, and garden spaces.",
        },
        {
          title: "Who can use it",
          description:
            "New players planning their first farm, experienced players expanding or reorganizing, and anyone who enjoys designing paths, gardens, and farm scenery.",
        },
      ],
    },
    features: {
      heading: "Meadowlands Farm Layout Examples",
      previousLabel: "Previous example",
      nextLabel: "Next example",
      testimonials: [
        {
          quote:
            "Autumn colors run through a dense mix of crop rows, paths, ponds, and farm buildings.",
          name: "Meadowlands Farm in Fall",
          designation: "Meadowlands · Fall",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-fall.jpg",
          imageAlt:
            "Pixel-art Meadowlands farm layout with prismatic seasonal styling in fall",
        },
        {
          quote:
            "Spring trees and decorations surround crop plots, ponds, paths, and farm buildings.",
          name: "Spring Colors Across Meadowlands",
          designation: "Meadowlands · Spring",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-spring.jpg",
          imageAlt:
            "Pixel-art Meadowlands farm layout with prismatic seasonal styling in spring",
        },
        {
          quote:
            "Fields, trees, ponds, and farm buildings share the map in a bright summer palette.",
          name: "Summer Fields Around the Ponds",
          designation: "Meadowlands · Summer",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-summer.jpg",
          imageAlt:
            "Pixel-art Meadowlands farm layout with prismatic seasonal styling in summer",
        },
        {
          quote:
            "A forested map brings paths, crop plots, ponds, buildings, and decorative areas together.",
          name: "Modded Meadowlands Overview",
          designation: "Modded Meadowlands",
          src: "/homepage/features/meadowlands-aesthetic-03-modded-overview.jpg",
          imageAlt: "Pixel-art modded Meadowlands farm overview layout",
        },
        {
          quote:
            "This vanilla Year 7 layout places crop plots, buildings, paths, and ponds across Meadowlands.",
          name: "Vanilla Meadowlands in Year 7",
          designation: "Vanilla Meadowlands · Year 7",
          src: "/homepage/features/meadowlands-aesthetic-05-vanilla-year7.png",
          imageAlt: "Pixel-art vanilla Meadowlands farm layout in year 7",
        },
      ],
    },
    whyChoose: {
      heading: "Beach & Four Corners Farm Layout Examples",
      previousLabel: "Previous example",
      nextLabel: "Next example",
      testimonials: [
        {
          quote:
            "Flowering trees, small garden plots, and paths give this coastal layout a garden-like feel.",
          name: "Decorative Beach Farm",
          designation: "machooo · Year 15",
          src: "/homepage/why-choose/beach-decorative-machooo.webp",
          imageAlt: "Decorative Beach farm layout by machooo, year 15",
        },
        {
          quote:
            "Paths and crop plots form a diamond pattern around the farm buildings.",
          name: "Diamond-Path Beach Farm",
          designation: "jennameeps · Beach Farm",
          src: "/homepage/why-choose/beach-geometric-jennameeps.webp",
          imageAlt: "Geometric diamond Beach farm layout by jennameeps",
        },
        {
          quote:
            "Stone paths connect the fields and buildings while tracing the coastal map.",
          name: "Beach Farm with Stone Paths",
          designation: "justkuwl · Beach Farm",
          src: "/homepage/why-choose/beach-organized-justkuwl.webp",
          imageAlt: "Organized Beach farm with stone paths by justkuwl",
        },
        {
          quote:
            "Rows of processing machines sit among paths, crop plots, and farm buildings.",
          name: "Beach Farm with a Processing Yard",
          designation: "shady kegyard · Beach Farm",
          src: "/homepage/why-choose/beach-processing-shady-kegyard.webp",
          imageAlt: "Processing-focused Beach farm layout by shady kegyard",
        },
        {
          quote:
            "Paths, crop plots, trees, and buildings occupy separate areas across the map.",
          name: "Balanced Four Corners Farm",
          designation: "rp2-phobos · Four Corners Farm",
          src: "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
          imageAlt: "Balanced Four Corners farm layout by rp2-phobos",
        },
        {
          quote:
            "Crop plots, farm buildings, paths, and water share this map in a balanced layout.",
          name: "Four Corners Farm with Balanced Zones",
          designation: "emerald · Four Corners Farm",
          src: "/homepage/why-choose/fourcorners-balanced-emerald.webp",
          imageAlt: "Balanced Four Corners farm layout by emerald",
        },
        {
          quote:
            "Rows of coops and crop fields fill the map alongside paths and work areas.",
          name: "Coops and Crops on Four Corners",
          designation: "hallofax · Year 5",
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
      eyebrow: "FAQ",
      heading: "Frequently Asked Questions",
      description:
        "Where your plan is stored, which farms you can use, and what you can export.",
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
        capabilities: "Farm examples",
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
      capabilitiesLabel: "案例展示",
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
          alt: "像素风农场：紫色房屋、作物田、树木和蜿蜒河道",
        },
        {
          src: "/homepage/hero/beach-farm.webp",
          alt: "像素风标准农场：红色农舍、作物田、畜棚、树木和水塘",
        },
        {
          src: "/homepage/hero/forest-farm.webp",
          alt: "像素风水上岛屿农场：红色屋顶建筑、作物田、树木和环绕水域",
        },
      ],
    },
    plannerPreview: {
      imageAlt: "像素风标准农场地图，中央是空地，含农舍、温室和两处水塘",
    },
    whatIs: {
      heading: "什么是星露谷物语农场规划器？",
      imageAlt: "星露谷物语秋季农场布局：建筑、农田、道路和水塘分布在地图上",
      description:
        "星露谷物语农场规划器是一款免费的在线布局设计工具，帮助你在游戏内动工前确定农场方案。通过俯视地图预览整体布局，调整各个区域的位置，让后续建造有清晰的参考。",
      items: [
        {
          title: "主要功能",
          description:
            "支持标准、森林、海滩、草原等 8 种农场和姜岛地图，可以摆放建筑、作物、树木、道路与装饰，查看洒水器和稻草人的覆盖范围。你也可以切换四季外观，将规划项目保存在当前浏览器，并导出布局截图。",
        },
        {
          title: "使用场景",
          description:
            "开新农场时，先决定农田、畜棚和道路的位置；扩建或重排现有农场时，试摆温室、鸡舍和加工区，给建筑之间的通路留出空间；准备重新装饰时，先尝试道路、树木和庭院的不同组合。",
        },
        {
          title: "适用人群",
          description:
            "适合第一次规划农场的新手、准备扩建或重新分区的老玩家，以及喜欢设计道路、庭院和农场景观的玩家。",
        },
      ],
    },
    features: {
      heading: "草原农场布局案例",
      previousLabel: "上一个案例",
      nextLabel: "下一个案例",
      testimonials: [
        {
          quote:
            "秋色铺满草原农场，田地、道路、水塘和建筑分布在各处。",
          name: "草原农场秋季布局",
          designation: "草原农场 · 秋季",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-fall.jpg",
          imageAlt: "像素风草原农场棱镜风格秋季布局",
        },
        {
          quote:
            "春色树木和装饰围绕着田地、水塘、道路与农场建筑。",
          name: "草原农场春日景色",
          designation: "草原农场 · 春季",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-spring.jpg",
          imageAlt: "像素风草原农场棱镜风格春季布局",
        },
        {
          quote:
            "田地、树木、水塘和农场建筑铺在明亮的夏日配色中。",
          name: "水塘边的夏日田地",
          designation: "草原农场 · 夏季",
          src: "/homepage/features/meadowlands-aesthetic-01-prismatic-summer.jpg",
          imageAlt: "像素风草原农场棱镜风格夏季布局",
        },
        {
          quote:
            "这张林木茂密的地图里，田地、水塘、建筑、道路和装饰区交错分布。",
          name: "模组草原农场总览",
          designation: "模组草原农场",
          src: "/homepage/features/meadowlands-aesthetic-03-modded-overview.jpg",
          imageAlt: "像素风模组草原农场总览布局",
        },
        {
          quote:
            "这张原版第 7 年农场把田地、建筑、道路和水塘分布在草原农场各处。",
          name: "原版草原农场：第 7 年",
          designation: "原版草原农场 · 第 7 年",
          src: "/homepage/features/meadowlands-aesthetic-05-vanilla-year7.png",
          imageAlt: "像素风原版草原农场第 7 年布局",
        },
      ],
    },
    whyChoose: {
      heading: "海滩与四角农场布局案例",
      previousLabel: "上一个案例",
      nextLabel: "下一个案例",
      testimonials: [
        {
          quote:
            "开花树木、小块花园和道路让这张海岸布局显得像一座花园。",
          name: "装饰风格的海滩农场",
          designation: "machooo · 第 15 年",
          src: "/homepage/why-choose/beach-decorative-machooo.webp",
          imageAlt: "machooo 的海滩农场装饰向布局，第 15 年",
        },
        {
          quote:
            "道路和田地围绕农场建筑排成菱形图案。",
          name: "菱形道路海滩农场",
          designation: "jennameeps · 海滩农场",
          src: "/homepage/why-choose/beach-geometric-jennameeps.webp",
          imageAlt: "jennameeps 的海滩农场几何菱形布局",
        },
        {
          quote:
            "石路把田地和建筑连在一起，并沿着海岸地图延伸。",
          name: "石路整理的海滩农场",
          designation: "justkuwl · 海滩农场",
          src: "/homepage/why-choose/beach-organized-justkuwl.webp",
          imageAlt: "justkuwl 用石路整理过的海滩农场",
        },
        {
          quote:
            "成排的加工设备位于农场中央，周围分布道路、田地和建筑。",
          name: "海滩农场加工区布局",
          designation: "shady kegyard · 海滩农场",
          src: "/homepage/why-choose/beach-processing-shady-kegyard.webp",
          imageAlt: "shady kegyard 以加工区为主的海滩农场布局",
        },
        {
          quote:
            "道路、田地、树木和建筑分布在地图的不同区域。",
          name: "分区均衡的四角农场",
          designation: "rp2-phobos · 四角农场",
          src: "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
          imageAlt: "rp2-phobos 的均衡四角农场布局",
        },
        {
          quote:
            "田地、农场建筑、道路和水塘构成一张分布均衡的农场布局。",
          name: "均衡布局的四角农场",
          designation: "emerald · 四角农场",
          src: "/homepage/why-choose/fourcorners-balanced-emerald.webp",
          imageAlt: "emerald 的均衡四角农场完美布局",
        },
        {
          quote:
            "多排鸡舍与作物田分布在地图各处，并由道路和工作区连接。",
          name: "四角农场的鸡舍与田地",
          designation: "hallofax · 第 5 年",
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
      eyebrow: "FAQ",
      heading: "常见问题",
      description: "方案存在哪、农场有哪些、能导出什么。",
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
        capabilities: "案例展示",
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
