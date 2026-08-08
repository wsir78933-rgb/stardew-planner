import { expect, test } from "vitest";
import { HOMEPAGE_LOCALES } from "@/src/homepage/homepage-locale";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";

test("ships every approved locale with the same top-level homepage sections", () => {
  expect(Object.keys(homepageCopyByLocale)).toEqual([...HOMEPAGE_LOCALES]);
  expect(Object.keys(homepageCopyByLocale.en)).toEqual(Object.keys(homepageCopyByLocale["zh-CN"]));
});

test("provides the Brainfish-style hero fragments and localized language label", () => {
  for (const homepageLocale of HOMEPAGE_LOCALES) {
    const homepageCopy = homepageCopyByLocale[homepageLocale];

    expect(homepageCopy.navigation.languageLabel).not.toHaveLength(0);
    expect(homepageCopy.hero).not.toHaveProperty("eyebrow");
    expect(homepageCopy.hero.headlineBefore).not.toHaveLength(0);
    expect(homepageCopy.hero.headlineEmphasis).not.toHaveLength(0);
    expect(homepageCopy.hero.headlineAfter).not.toHaveLength(0);
  }
});

test("provides the approved bilingual planner content and capability limits", () => {
  expect(homepageCopyByLocale.en.hero).toMatchObject({
    headlineBefore: "Stardew Valley ",
    headlineEmphasis: "Planner",
    headlineAfter: " for Every Farm Layout",
    supportingCopy:
      "Design your farm directly in the browser. Choose from eight official farm types, place buildings, crops and decor, switch between seasons, and visualize important coverage ranges.",
  });
  expect(homepageCopyByLocale["zh-CN"].hero).toMatchObject({
    headlineBefore: "适用于各种农场布局的",
    headlineEmphasis: "星露谷物语",
    headlineAfter: "规划器",
    supportingCopy:
      "直接在浏览器中设计农场。选择八种官方农场类型，放置建筑、作物和装饰，切换季节，并查看重要设施的覆盖范围。",
  });

  expect(homepageCopyByLocale.en.capabilities.items).toEqual([
    {
      title: "Plan every official farm type",
      description:
        "Start with Standard, Riverland, Forest, Hill-top, Wilderness, Four Corners, Beach or Meadowlands. Ginger Island is also available in the map picker.",
    },
    {
      title: "Place and evaluate your layout",
      description:
        "Arrange buildings, crops, placeables and decor while checking sprinkler, scarecrow, Bee House and Junimo Hut coverage.",
    },
    {
      title: "Keep projects in this browser",
      description:
        "Create and save local projects without an account or cloud sync.",
    },
  ]);
  expect(homepageCopyByLocale["zh-CN"].capabilities.items).toEqual([
    {
      title: "规划每一种官方农场类型",
      description:
        "从标准、河流、森林、山顶、荒野、四角、海滩或草原农场开始规划。地图选择器中还提供姜岛。",
    },
    {
      title: "摆放并检查农场布局",
      description:
        "放置建筑、作物、可放置物和装饰，同时查看洒水器、稻草人、蜂房和祝尼魔小屋的覆盖范围。",
    },
    {
      title: "将项目保存在当前浏览器中",
      description:
        "无需账号或云同步，直接在当前浏览器中创建并保存本地项目。",
    },
  ]);
});

test("keeps localized farm discovery, trust, import, and screenshot claims synchronized", () => {
  expect(homepageCopyByLocale.en.farmGuides).toEqual({
    heading: "Choose a farm type before you plan",
    description:
      "Compare each official farm's space, constraints, and strengths, then open the guide that matches your layout.",
    comparisonLinkLabel: "Compare all farm types",
  });
  expect(homepageCopyByLocale["zh-CN"].farmGuides).toEqual({
    heading: "规划前先选择农场类型",
    description: "比较每种官方农场的空间、限制和优势，再打开适合你布局的指南。",
    comparisonLinkLabel: "对比全部农场类型",
  });
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
      farmComparison: "Farm comparison",
      moddedFarms: "Modded farms",
    },
    explore: {
      title: "Explore",
      capabilities: "How it works",
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
      farmComparison: "农场对比",
      moddedFarms: "模组农场",
    },
    explore: {
      title: "探索",
      capabilities: "使用方式",
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
