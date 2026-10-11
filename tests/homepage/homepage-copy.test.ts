import { expect, test } from "vitest";
import { HOMEPAGE_LOCALES } from "@/src/homepage/homepage-locale";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";

const whyChooseImageSources = [
  "/homepage/why-choose/beach-decorative-machooo.webp",
  "/homepage/why-choose/beach-geometric-jennameeps.webp",
  "/homepage/why-choose/beach-organized-justkuwl.webp",
  "/homepage/why-choose/beach-processing-shady-kegyard.webp",
  "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
  "/homepage/why-choose/fourcorners-balanced-emerald.webp",
  "/homepage/why-choose/fourcorners-coop-hallofax.webp",
] as const;

test("ships every approved locale with the same top-level homepage sections", () => {
  expect(Object.keys(homepageCopyByLocale)).toEqual([...HOMEPAGE_LOCALES]);
  expect(Object.keys(homepageCopyByLocale.en)).toEqual(Object.keys(homepageCopyByLocale["zh-CN"]));

  expect(Object.keys(homepageCopyByLocale.en)).toEqual([
    "navigation",
    "hero",
    "plannerPreview",
    "whatIs",
    "features",
    "whyChoose",
    "howTo",
    "closingCta",
    "faq",
    "footer",
  ]);
});

test("provides the replacement sections with exact bilingual headings and item counts", () => {
  const expectedSections = {
    en: {
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
        testimonialCount: 5,
        quotes: [
          "Autumn colors run through a dense mix of crop rows, paths, ponds, and farm buildings.",
          "Spring trees and decorations surround crop plots, ponds, paths, and farm buildings.",
          "Fields, trees, ponds, and farm buildings share the map in a bright summer palette.",
          "A forested map brings paths, crop plots, ponds, buildings, and decorative areas together.",
          "This vanilla Year 7 layout places crop plots, buildings, paths, and ponds across Meadowlands.",
        ],
        names: [
          "Meadowlands Farm in Fall",
          "Spring Colors Across Meadowlands",
          "Summer Fields Around the Ponds",
          "Modded Meadowlands Overview",
          "Vanilla Meadowlands in Year 7",
        ],
        designations: [
          "Meadowlands · Fall",
          "Meadowlands · Spring",
          "Meadowlands · Summer",
          "Modded Meadowlands",
          "Vanilla Meadowlands · Year 7",
        ],
        sources: [
          "/homepage/features/meadowlands-aesthetic-01-prismatic-fall.jpg",
          "/homepage/features/meadowlands-aesthetic-01-prismatic-spring.jpg",
          "/homepage/features/meadowlands-aesthetic-01-prismatic-summer.jpg",
          "/homepage/features/meadowlands-aesthetic-03-modded-overview.jpg",
          "/homepage/features/meadowlands-aesthetic-05-vanilla-year7.png",
        ],
      },
      whyChoose: {
        heading: "Beach & Four Corners Farm Layout Examples",
        previousLabel: "Previous example",
        nextLabel: "Next example",
        testimonialCount: 7,
        quotes: [
          "Flowering trees, small garden plots, and paths give this coastal layout a garden-like feel.",
          "Paths and crop plots form a diamond pattern around the farm buildings.",
          "Stone paths connect the fields and buildings while tracing the coastal map.",
          "Rows of processing machines sit among paths, crop plots, and farm buildings.",
          "Paths, crop plots, trees, and buildings occupy separate areas across the map.",
          "Crop plots, farm buildings, paths, and water share this map in a balanced layout.",
          "Rows of coops and crop fields fill the map alongside paths and work areas.",
        ],
        names: [
          "Decorative Beach Farm",
          "Diamond-Path Beach Farm",
          "Beach Farm with Stone Paths",
          "Beach Farm with a Processing Yard",
          "Balanced Four Corners Farm",
          "Four Corners Farm with Balanced Zones",
          "Coops and Crops on Four Corners",
        ],
        designations: [
          "machooo · Year 15",
          "jennameeps · Beach Farm",
          "justkuwl · Beach Farm",
          "shady kegyard · Beach Farm",
          "rp2-phobos · Four Corners Farm",
          "emerald · Four Corners Farm",
          "hallofax · Year 5",
        ],
      },
      howTo: {
        heading: "Lay out the farm in three passes",
        description:
          "Pin the tiles that never move. Reserve work zones, then place barns, coops, sheds, and fields. Walk one ordinary day's route last, and fix blocked paths on this grid.",
        itemCount: 3,
        stepTitles: [
          "Pin the tiles that never move",
          "Zone the work, then drop the large pieces",
          "Walk the day's chores on this grid",
        ],
      },
      closingCta: {
        heading: "Finish the layout on this page, then build in-game.",
        supportLine: "No sign-up. Projects stay in this browser.",
      },
    },
    "zh-CN": {
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
        testimonialCount: 5,
        quotes: [
          "秋色铺满草原农场，田地、道路、水塘和建筑分布在各处。",
          "春色树木和装饰围绕着田地、水塘、道路与农场建筑。",
          "田地、树木、水塘和农场建筑铺在明亮的夏日配色中。",
          "这张林木茂密的地图里，田地、水塘、建筑、道路和装饰区交错分布。",
          "这张原版第 7 年农场把田地、建筑、道路和水塘分布在草原农场各处。",
        ],
        names: [
          "草原农场秋季布局",
          "草原农场春日景色",
          "水塘边的夏日田地",
          "模组草原农场总览",
          "原版草原农场：第 7 年",
        ],
        designations: [
          "草原农场 · 秋季",
          "草原农场 · 春季",
          "草原农场 · 夏季",
          "模组草原农场",
          "原版草原农场 · 第 7 年",
        ],
        sources: [
          "/homepage/features/meadowlands-aesthetic-01-prismatic-fall.jpg",
          "/homepage/features/meadowlands-aesthetic-01-prismatic-spring.jpg",
          "/homepage/features/meadowlands-aesthetic-01-prismatic-summer.jpg",
          "/homepage/features/meadowlands-aesthetic-03-modded-overview.jpg",
          "/homepage/features/meadowlands-aesthetic-05-vanilla-year7.png",
        ],
      },
      whyChoose: {
        heading: "海滩与四角农场布局案例",
        previousLabel: "上一个案例",
        nextLabel: "下一个案例",
        testimonialCount: 7,
        quotes: [
          "开花树木、小块花园和道路让这张海岸布局显得像一座花园。",
          "道路和田地围绕农场建筑排成菱形图案。",
          "石路把田地和建筑连在一起，并沿着海岸地图延伸。",
          "成排的加工设备位于农场中央，周围分布道路、田地和建筑。",
          "道路、田地、树木和建筑分布在地图的不同区域。",
          "田地、农场建筑、道路和水塘构成一张分布均衡的农场布局。",
          "多排鸡舍与作物田分布在地图各处，并由道路和工作区连接。",
        ],
        names: [
          "装饰风格的海滩农场",
          "菱形道路海滩农场",
          "石路整理的海滩农场",
          "海滩农场加工区布局",
          "分区均衡的四角农场",
          "均衡布局的四角农场",
          "四角农场的鸡舍与田地",
        ],
        designations: [
          "machooo · 第 15 年",
          "jennameeps · 海滩农场",
          "justkuwl · 海滩农场",
          "shady kegyard · 海滩农场",
          "rp2-phobos · 四角农场",
          "emerald · 四角农场",
          "hallofax · 第 5 年",
        ],
      },
      howTo: {
        heading: "分三步排出农场",
        description:
          "先标不会动的地，再分区放大件，最后按一天的活走一遍。堵住了就改这张图，别等进游戏再建。",
        itemCount: 3,
        stepTitles: [
          "先标出不会动的地",
          "先分区，再放大件",
          "按一天的活把路走通",
        ],
      },
      closingCta: {
        heading: "先在这页摆完，再进游戏建。",
        supportLine: "不用注册。方案留在这台浏览器。",
      },
    },
  } as const;

  for (const homepageLocale of HOMEPAGE_LOCALES) {
    const homepageCopy = homepageCopyByLocale[homepageLocale];
    const expected = expectedSections[homepageLocale];

    expect(homepageCopy).not.toHaveProperty("planningGuide");
    expect(homepageCopy).not.toHaveProperty("capabilities");
    expect(homepageCopy.whatIs).toEqual(expected.whatIs);
    expect(homepageCopy.whatIs.items).toHaveLength(3);
    expect(homepageCopy.features).toMatchObject({
      heading: expected.features.heading,
      previousLabel: expected.features.previousLabel,
      nextLabel: expected.features.nextLabel,
    });
    expect(homepageCopy.features).not.toHaveProperty("items");
    expect(homepageCopy.features).not.toHaveProperty("imageAlt");
    expect(homepageCopy.features.testimonials).toHaveLength(
      expected.features.testimonialCount,
    );
    expect(
      homepageCopy.features.testimonials.map(
        (featureSlide) => featureSlide.src,
      ),
    ).toEqual([...expected.features.sources]);
    expect(
      homepageCopy.features.testimonials.map(
        (featureSlide) => featureSlide.quote,
      ),
    ).toEqual([...expected.features.quotes]);
    expect(
      homepageCopy.features.testimonials.map(
        (featureSlide) => featureSlide.name,
      ),
    ).toEqual([...expected.features.names]);
    expect(
      homepageCopy.features.testimonials.map(
        (featureSlide) => featureSlide.designation,
      ),
    ).toEqual([...expected.features.designations]);
    expect(homepageCopy.whyChoose).toMatchObject({
      heading: expected.whyChoose.heading,
      previousLabel: expected.whyChoose.previousLabel,
      nextLabel: expected.whyChoose.nextLabel,
    });
    expect(homepageCopy.whyChoose).not.toHaveProperty("items");
    expect(homepageCopy.whyChoose).not.toHaveProperty("imageAlt");
    expect(homepageCopy.whyChoose.testimonials).toHaveLength(
      expected.whyChoose.testimonialCount,
    );
    expect(
      homepageCopy.whyChoose.testimonials.map(
        (farmLayoutSlide) => farmLayoutSlide.src,
      ),
    ).toEqual([...whyChooseImageSources]);
    expect(
      homepageCopy.whyChoose.testimonials.map(
        (farmLayoutSlide) => farmLayoutSlide.quote,
      ),
    ).toEqual([...expected.whyChoose.quotes]);
    expect(
      homepageCopy.whyChoose.testimonials.map(
        (farmLayoutSlide) => farmLayoutSlide.name,
      ),
    ).toEqual([...expected.whyChoose.names]);
    expect(
      homepageCopy.whyChoose.testimonials.map(
        (farmLayoutSlide) => farmLayoutSlide.designation,
      ),
    ).toEqual([...expected.whyChoose.designations]);
    expect(homepageCopy.howTo).toMatchObject({
      heading: expected.howTo.heading,
      description: expected.howTo.description,
    });
    expect(homepageCopy.howTo).not.toHaveProperty("imageAlt");
    expect(homepageCopy.howTo.steps).toHaveLength(expected.howTo.itemCount);
    expect(homepageCopy.howTo.steps.map((howToStep) => howToStep.title)).toEqual(
      [...expected.howTo.stepTitles],
    );
    expect(homepageCopy.closingCta).toEqual(expected.closingCta);
    expect(homepageCopy.closingCta).not.toHaveProperty("primaryActionLabel");
  }
});

test("does not retain retired farm-guide copy", () => {
  for (const homepageLocale of HOMEPAGE_LOCALES) {
    expect(homepageCopyByLocale[homepageLocale]).not.toHaveProperty("farmGuides");
  }
});

test("provides bilingual planner preview image alt text", () => {
  expect(homepageCopyByLocale.en.plannerPreview.imageAlt).toBe(
    "Pixel-art Standard Farm map with a central dirt field, farmhouse, greenhouse, and two ponds",
  );
  expect(homepageCopyByLocale["zh-CN"].plannerPreview.imageAlt).toBe(
    "像素风标准农场地图，中央是空地，含农舍、温室和两处水塘",
  );
});

test("provides the Brainfish-style hero fragments and localized language label", () => {
  for (const homepageLocale of HOMEPAGE_LOCALES) {
    const homepageCopy = homepageCopyByLocale[homepageLocale];

    expect(homepageCopy.navigation.languageLabel).not.toHaveLength(0);
    expect(homepageCopy.hero).not.toHaveProperty("eyebrow");
    expect(homepageCopy.hero.headlineEmphasis).not.toHaveLength(0);
    expect(
      `${homepageCopy.hero.headlineBefore}${homepageCopy.hero.headlineEmphasis}${homepageCopy.hero.headlineAfter}`,
    ).not.toHaveLength(0);
  }
});

test("provides the approved bilingual planner hero content", () => {
  expect(homepageCopyByLocale.en.hero).toMatchObject({
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
  });
  expect(homepageCopyByLocale["zh-CN"].hero).toMatchObject({
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
  });
});

test("keeps localized import and screenshot claims synchronized", () => {
  expect(homepageCopyByLocale.en.navigation.capabilitiesLabel).toBe("Farm examples");
  expect(homepageCopyByLocale["zh-CN"].navigation.capabilitiesLabel).toBe("案例展示");

  expect(homepageCopyByLocale.en.faq.eyebrow).toBe("FAQ");
  expect(homepageCopyByLocale["zh-CN"].faq.eyebrow).toBe("FAQ");
  expect(homepageCopyByLocale.en.faq.heading).toBe("Frequently Asked Questions");
  expect(homepageCopyByLocale["zh-CN"].faq.heading).toBe("常见问题");
  expect(homepageCopyByLocale.en.faq.description).toBe(
    "Where your plan is stored, which farms you can use, and what you can export.",
  );
  expect(homepageCopyByLocale["zh-CN"].faq.description).toBe(
    "方案存在哪、农场有哪些、能导出什么。",
  );
  expect(homepageCopyByLocale.en.faq.items).toEqual([
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
  ]);
  expect(homepageCopyByLocale["zh-CN"].faq.items).toEqual([
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
  ]);
  expect(homepageCopyByLocale.en.footer).toMatchObject({
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
    },
    legal: {
      title: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact us",
    },
  });
  expect(homepageCopyByLocale["zh-CN"].footer).toMatchObject({
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
    },
    legal: {
      title: "法律",
      privacy: "隐私政策",
      terms: "服务条款",
      contact: "联系我们",
    },
  });
});
