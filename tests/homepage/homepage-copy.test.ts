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
    "features",
    "whyChoose",
    "howTo",
    "closingCta",
    "faq",
    "trust",
    "footer",
  ]);
});

test("provides the replacement sections with exact bilingual headings and item counts", () => {
  const expectedSections = {
    en: {
      features: {
        heading: "What the planner does",
        imageAlt: "Pixel-art farm map with eight terrain patches and an island plot",
        itemCount: 3,
      },
      whyChoose: {
        heading: "Why use this planner",
        previousLabel: "Previous farm layout",
        nextLabel: "Next farm layout",
        testimonialCount: 7,
        quotes: [
          "Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach, and Meadowlands are in the picker, plus Ginger Island. Choose that map first, then place anything.",
          "Arrange buildings, crops, placeables, and decor together. You can see a blocked path before you rebuild it in-game.",
          "Paths look tidy, but they take crop tiles. Keep the farmhouse, chests, and shipping bin reachable on a normal day.",
          "Turn on sprinkler, scarecrow, Bee House, and Junimo Hut coverage as you work. Processing only pays off on a route you already walk.",
          "Each corner is its own farm. Decide what belongs in which quadrant before you drop barns and fields that are slow to move.",
          "Spring, summer, fall, and winter are available. When the layout holds, export a standard or high-quality screenshot and build from that.",
          "There is no cloud sync. A different browser or a data wipe will lose them. Save import is experimental, and modded items may not map. This planner is free and fan-made.",
        ],
        names: [
          "Plan the map you actually play",
          "Place buildings and crops on one grid",
          "Leave the walking route first",
          "Check coverage while you place",
          "Plan Four Corners by quadrant",
          "Switch seasons, then export a screenshot",
          "No account. Projects stay in this browser",
        ],
      },
      howTo: {
        heading: "How to use it",
        imageAlt: "Pixel-art farm map with crop, animal, and path zones",
        itemCount: 4,
      },
      closingCta: {
        heading: "The map is already on this page. Start placing.",
        supportLine: "No sign-up. Projects stay in this browser.",
      },
    },
    "zh-CN": {
      features: {
        heading: "功能介绍",
        imageAlt: "像素风农场地图，含八块不同地形和一处岛状地块",
        itemCount: 3,
      },
      whyChoose: {
        heading: "为什么选择我们",
        previousLabel: "上一张农场布局",
        nextLabel: "下一张农场布局",
        testimonialCount: 7,
        quotes: [
          "标准、河流、森林、山顶、荒野、四角、海滩、草原都能开，地图选择器里还有姜岛。先选对地图，再摆东西。",
          "建筑、作物、可放置物和装饰都在同一格网上排。哪条路被堵住，进游戏前就能看出来。",
          "路好看，但会占耕地。农舍、箱子、出货箱周围先留通路，一天的活才走得通。",
          "洒水器、稻草人、蜂房、祝尼魔小屋的覆盖可以打开对着摆。加工区放在每天会路过的地方才划算。",
          "四个角等于四块地。先定每块干什么，再放大件，避免畜棚和田地放完难挪。",
          "春、夏、秋、冬都能切。方案定了就导出普通或高清截图，照着进游戏建。",
          "没有云同步。换浏览器或清数据会丢。存档导入仍是实验性的，模组物品可能对不上。这是免费的玩家工具，和官方没有隶属或认可关系。",
        ],
        names: [
          "先选你正在玩的那张图",
          "建筑和作物放在同一张图上",
          "每天走的路要先留出来",
          "边摆边看覆盖范围",
          "四角农场按四个象限来排",
          "切四季，再导出截图",
          "不用账号，项目留在当前浏览器",
        ],
      },
      howTo: {
        heading: "如何使用",
        imageAlt: "像素风农场地图，标出作物区、动物区和道路",
        itemCount: 4,
      },
      closingCta: {
        heading: "地图看好了，就在上面开始摆。",
        supportLine: "不用注册。项目保存在当前浏览器。",
      },
    },
  } as const;

  for (const homepageLocale of HOMEPAGE_LOCALES) {
    const homepageCopy = homepageCopyByLocale[homepageLocale];
    const expected = expectedSections[homepageLocale];

    expect(homepageCopy).not.toHaveProperty("planningGuide");
    expect(homepageCopy).not.toHaveProperty("capabilities");
    expect(homepageCopy.features).toMatchObject({
      heading: expected.features.heading,
      imageAlt: expected.features.imageAlt,
    });
    expect(homepageCopy.features.items).toHaveLength(expected.features.itemCount);
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
    expect(homepageCopy.howTo).toMatchObject({
      heading: expected.howTo.heading,
      imageAlt: expected.howTo.imageAlt,
    });
    expect(homepageCopy.howTo.steps).toHaveLength(expected.howTo.itemCount);
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
    headlineAfter: " – Free Online Farm Layout Tool",
    supportingCopy:
      "Plan your Stardew Valley farm before building in-game. Choose from 8 farm types, place buildings and crops, switch seasons, check coverage, and import saves.",
    primaryActionLabel: "Start planning",
  });
  expect(homepageCopyByLocale["zh-CN"].hero).toMatchObject({
    headlineBefore: "星露谷物语",
    headlineEmphasis: "规划器",
    headlineAfter: "——免费在线农场布局工具",
    supportingCopy:
      "别等建筑落地后才发现布局不顺。先在浏览器中试排 8 种农场，摆放建筑和作物、检查四季与覆盖范围，再照着方案进游戏建造。",
    primaryActionLabel: "开始规划",
  });
});

test("keeps localized trust, import, and screenshot claims synchronized", () => {
  expect(homepageCopyByLocale.en.navigation.capabilitiesLabel).toBe("Features");
  expect(homepageCopyByLocale["zh-CN"].navigation.capabilitiesLabel).toBe("功能介绍");
  expect(homepageCopyByLocale.en.trust).toEqual({
    heading: "About this planner",
    description:
      "Fan-made Stardew Valley planning tool. Not affiliated with or endorsed by ConcernedApe or Stardew Valley. Projects stay in this browser.",
  });
  expect(homepageCopyByLocale["zh-CN"].trust).toEqual({
    heading: "关于这个规划器",
    description:
      "这是一个玩家制作的《星露谷物语》规划工具，与 ConcernedApe 或《星露谷物语》官方无隶属或认可关系。项目只保存在当前浏览器中。",
  });

  expect(homepageCopyByLocale.en.faq.items).toEqual([
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
      answer: "Yes. The planner provides standard and high-quality screenshot downloads.",
    },
  ]);
  expect(homepageCopyByLocale["zh-CN"].faq.items).toEqual([
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
      answer: "可以。存档导入仍是实验性功能，不受支持或来自模组的物品可能无法映射。",
    },
    {
      question: "可以导出农场布局吗？",
      answer: "可以。规划器提供标准画质和高画质的截图下载。",
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
      capabilities: "Features",
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
      capabilities: "功能介绍",
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
