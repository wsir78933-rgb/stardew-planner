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

const expectedComparisonDimensionsByLocale = {
  en: [
    "Pricing",
    "Ease of use",
    "Saving multiple plans",
    "English and Chinese interface",
    "Project file backup",
    "PNG export",
  ],
  "zh-CN": ["使用费用", "上手与操作", "多方案保存", "中英文操作", "方案文件备份", "PNG 导出"],
} as const;

const expectedComparisonHeadingByLocale = {
  en: "Stardew Valley Planner vs StardewPlan vs Stardew Planner V3",
  "zh-CN": "Stardew Valley Planner vs StardewPlan vs Stardew Planner V3",
} as const;

const expectedPlannerBenefitPatternsByLocale = {
  en: [
    [/all free/i, /no paid membership/i],
    [/Clear labels/i, /grouped controls/i, /browse or search/i, /one save window/i],
    [/multiple plans/i, /without fixed slots/i, /set plan limit/i, /browser storage/i],
    [/English/i, /Chinese/i],
    [/one project/i, /JSON/i, /all its maps/i],
    [/PNG/i, /1×/, /2×/],
  ],
  "zh-CN": [
    [/全部免费/, /无付费会员/],
    [/操作标签/, /分组/, /分类或搜索/, /同一保存窗口/],
    [/多个方案/, /不设固定槽位/, /数量配额/, /浏览器存储/],
    [/中英文/],
    [/单个项目/, /JSON/, /全部地图/],
    [/PNG/, /1×/, /2×/],
  ],
} as const;

test("ships every approved locale with the same top-level homepage sections", () => {
  expect(Object.keys(homepageCopyByLocale)).toEqual([...HOMEPAGE_LOCALES]);
  expect(Object.keys(homepageCopyByLocale.en)).toEqual(Object.keys(homepageCopyByLocale["zh-CN"]));

  expect(Object.keys(homepageCopyByLocale.en)).toEqual([
    "navigation",
    "hero",
    "plannerPreview",
    "whatIs",
    "caseStudiesHeading",
    "caseStudiesDescription",
    "caseStudies",
    "featureIntroduction",
    "features",
    "whyChoose",
    "howTo",
    "toolComparison",
    "closingCta",
    "faq",
    "footer",
  ]);
});

test("provides a complete bilingual comparison for the same three planner sites", () => {
  const expectedPlannerSiteUrls = [
    "#planner",
    "https://stardewplan.com/",
    "https://v3.stardew.info/planner/",
  ] as const;

  for (const homepageLocale of HOMEPAGE_LOCALES) {
    const comparisonCopy = homepageCopyByLocale[homepageLocale].toolComparison;

    expect(comparisonCopy.heading).toBe(
      expectedComparisonHeadingByLocale[homepageLocale],
    );
    expect(comparisonCopy.description.trim()).not.toHaveLength(0);
    expect(comparisonCopy.tableLabel.trim()).not.toHaveLength(0);
    expect(comparisonCopy.dimensionHeading.trim()).not.toHaveLength(0);
    expect(comparisonCopy.columns).toHaveLength(3);
    expect(
      comparisonCopy.columns.map((plannerColumn) => plannerColumn.href),
    ).toEqual([...expectedPlannerSiteUrls]);
    expect(comparisonCopy.columns.every((plannerColumn) =>
      plannerColumn.name.trim().length > 0,
    )).toBe(true);
    expect(comparisonCopy.rows).toHaveLength(6);
    expect(
      comparisonCopy.rows.map((comparisonRow) => comparisonRow.dimension),
    ).toEqual([...expectedComparisonDimensionsByLocale[homepageLocale]]);

    for (const [comparisonRowIndex, comparisonRow] of comparisonCopy.rows.entries()) {
      expect(comparisonRow.dimension.trim()).not.toHaveLength(0);
      expect(comparisonRow.cells).toHaveLength(3);
      expect(comparisonRow.cells.every((cellDescription) =>
        cellDescription.trim().length > 0,
      )).toBe(true);

      const plannerBenefitCell = comparisonRow.cells[0];

      for (const expectedBenefitPattern of expectedPlannerBenefitPatternsByLocale[
        homepageLocale
      ][comparisonRowIndex]) {
        expect(plannerBenefitCell).toMatch(expectedBenefitPattern);
      }
    }
  }
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
      caseStudiesHeading: "Stardew Valley Planner Examples",
      caseStudiesDescription:
        "Explore 12 farm layouts across different maps. Get ideas for arranging fields, buildings, fish ponds, and paths when starting a farm, reorganizing its zones, or designing a garden.",
      caseStudies: [
        {
          id: "farm-cases",
          heading: "Standard Farm Layouts",
          imagePosition: "left",
          testimonialCount: 4,
        },
        {
          id: "farm-cases-2",
          heading: "Garden Zones Across Farm Maps",
          imagePosition: "right",
          testimonialCount: 4,
        },
        {
          id: "farm-cases-3",
          heading: "Layouts Shaped by Terrain",
          imagePosition: "left",
          testimonialCount: 4,
        },
      ],
      featureIntroduction: {
        heading: "Plan Your Farm Layout",
        description:
          "Try out your farm layout on the overhead map before building in-game. Compare seasonal views and coverage, then save a project or export an image to guide future changes.",
        items: [
          {
            icon: "map",
            title: "Choose a farm map",
            description:
              "Choose among eight farm maps—Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, or Meadowlands—or choose Ginger Island. Match the map to your game and shape the layout around its terrain.",
          },
          {
            icon: "layout",
            title: "Place and edit your layout",
            description:
              "Place buildings, crops, trees, paths, and decorations, then move selected items as plans change. Fill rectangular areas with supported items, erase an area, or undo and redo edits to refine each zone.",
          },
          {
            icon: "coverage",
            title: "Check coverage ranges",
            description:
              "Show sprinkler, scarecrow, Bee House, and Junimo Hut ranges on the map. Check how crop areas line up with nearby facilities as you plan where fields and farm areas should go.",
          },
          {
            icon: "seasons",
            title: "Preview four seasons",
            description:
              "Switch between spring, summer, fall, and winter to preview the map in each season. See the seasonal landscape while arranging paths, trees, and garden areas.",
          },
          {
            icon: "projects",
            title: "Save and transfer projects",
            description:
              "Projects are saved in this browser, so you can reopen a plan later. Export JSON to keep a separate project file, or import an existing JSON project to continue from it.",
          },
          {
            icon: "export",
            title: "Export layout screenshots",
            description:
              "Export the current layout as a PNG at 1× or 2× resolution. Keep the image with your design notes or use it as a visual reference while building in-game.",
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
        supportLine: "Plan without an account; sign in to sync projects you choose.",
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
      caseStudiesHeading: "星露谷物语农场规划案例",
      caseStudiesDescription:
        "浏览 12 个不同地图的农场布局，参考田地、建筑、鱼塘与道路的分区方式，为新农场规划、现有布局调整和庭院设计寻找灵感。",
      caseStudies: [
        {
          id: "farm-cases",
          heading: "标准农场布局",
          imagePosition: "left",
          testimonialCount: 4,
        },
        {
          id: "farm-cases-2",
          heading: "不同农场地图的庭院分区",
          imagePosition: "right",
          testimonialCount: 4,
        },
        {
          id: "farm-cases-3",
          heading: "顺应地形的农场布局",
          imagePosition: "left",
          testimonialCount: 4,
        },
      ],
      featureIntroduction: {
        heading: "规划你的农场布局",
        description:
          "进游戏建造前，先在俯视地图上试排整体布局。对比四季外观和设施覆盖，再保存项目或导出图片，方便后续调整。",
        items: [
          {
            icon: "map",
            title: "选择农场地图",
            description:
              "可从标准、河流、森林、山顶、荒野、四角、海滩和草原八种农场地图中选择，也可规划姜岛。选定正在游玩的地图后，可按地形安排各个区域。",
          },
          {
            icon: "layout",
            title: "摆放和调整布局",
            description:
              "在地图上摆放建筑、作物、树木、道路和装饰，选中后即可移动位置。支持填充的物品可以在矩形区域批量铺放，还可擦除区域、撤销或重做修改，逐步调整农场分区。",
          },
          {
            icon: "coverage",
            title: "查看覆盖范围",
            description:
              "可在地图上显示洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。布置田地与设施时，查看作物区域是否落在对应范围内，再据此调整位置。",
          },
          {
            icon: "seasons",
            title: "预览四季外观",
            description:
              "切换春、夏、秋、冬，预览地图在不同季节的外观。规划道路、树木和庭院时，可先查看季节变化下的场景，再决定布局是否合适。",
          },
          {
            icon: "projects",
            title: "保存和导入导出项目",
            description:
              "项目保存在当前浏览器，之后可以重新打开继续规划。需要留存或转移文件时，可导出 JSON；也可导入已有 JSON 项目，接着调整布局。",
          },
          {
            icon: "export",
            title: "导出布局截图",
            description:
              "可将当前布局导出为 PNG 图片，选择 1 倍或 2 倍分辨率。保存截图作为规划记录，也可在游戏内建造时对照布局。",
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
        supportLine: "不用登录也能规划；登录后可同步你选择的项目。",
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
    expect(homepageCopy.caseStudiesHeading).toBe(expected.caseStudiesHeading);
    expect(homepageCopy.caseStudiesDescription).toBe(
      expected.caseStudiesDescription,
    );
    expect(
      homepageCopy.caseStudies.map((caseStudyGroup) => ({
        id: caseStudyGroup.id,
        heading: caseStudyGroup.heading,
        imagePosition: caseStudyGroup.imagePosition,
        testimonialCount: caseStudyGroup.testimonials.length,
      })),
    ).toEqual(expected.caseStudies);
    expect(homepageCopy.caseStudies).toHaveLength(3);
    expect(
      homepageCopy.caseStudies.flatMap((caseStudyGroup) =>
        caseStudyGroup.testimonials.map((testimonial) => testimonial.src),
      ),
    ).toHaveLength(12);
    expect(homepageCopy.featureIntroduction).toEqual(
      expected.featureIntroduction,
    );
    expect(homepageCopy.featureIntroduction.items).toHaveLength(6);
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
    trustedBy: "Free fan-made planner. Save locally or sync selected projects.",
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
    trustedBy: "免费玩家规划器。可本地保存，也可同步所选项目。",
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
        "Projects stay in this browser unless you choose to sync them. Sign in to access synced layout data on another device; map preview images stay on this device.",
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
        "项目默认保存在当前浏览器；你可以登录后选择同步项目，在其他设备访问布局数据。地图预览图片仍保留在此设备上。",
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
      "A browser-based fan-made farm planner with local projects and optional cloud sync for selected layouts.",
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
    description: "用于规划《星露谷物语》农场布局的浏览器玩家工具，支持本地项目和可选的所选布局云端同步。",
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
