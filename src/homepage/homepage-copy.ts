import type { HomepageLocale } from "./homepage-locale";

type HomepageCapabilityCopy = Readonly<{
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
    plannerLabel: string;
    plannerActionLabel: string;
    languageLabel: string;
  }>;
  hero: Readonly<{
    eyebrow: string;
    headlineBefore: string;
    headlineEmphasis: string;
    headlineAfter: string;
    supportingCopy: string;
    primaryActionLabel: string;
  }>;
  workspace: Readonly<{
    label: string;
    description: string;
  }>;
  capabilities: Readonly<{
    heading: string;
    items: readonly [HomepageCapabilityCopy, HomepageCapabilityCopy, HomepageCapabilityCopy];
  }>;
  faq: Readonly<{
    heading: string;
    items: readonly [HomepageFaqItem, HomepageFaqItem, HomepageFaqItem];
  }>;
  footer: Readonly<{
    copyright: string;
    farmComparisonLinkLabel: string;
    farmGuidesLinkLabel: string;
  }>;
}>;

export const homepageCopyByLocale: Readonly<Record<HomepageLocale, HomepageCopy>> = {
  en: {
    navigation: {
      productName: "Stardew Valley Farm Planner",
      capabilitiesLabel: "How it works",
      faqLabel: "FAQ",
      plannerLabel: "Planner",
      plannerActionLabel: "Open planner",
      languageLabel: "Language",
    },
    hero: {
      eyebrow: "Interactive farm planning",
      headlineBefore: "Plan a farm ",
      headlineEmphasis: "that feels like",
      headlineAfter: " yours.",
      supportingCopy:
        "Use an interactive farm map to explore layout ideas and refine the details as you go.",
      primaryActionLabel: "Start planning",
    },
    workspace: {
      label: "Your planning workspace",
      description: "Open the interactive planner below to work with your farm layout.",
    },
    capabilities: {
      heading: "Plan with the map in view",
      items: [
        {
          title: "Plan your layout",
          description: "Place elements on a farm map while you work through the available space.",
        },
        {
          title: "Explore farm maps",
          description: "Choose from the available farm maps to see how each layout begins.",
        },
        {
          title: "Adjust as you go",
          description: "Move, remove, and refine placements until the layout feels right.",
        },
      ],
    },
    faq: {
      heading: "Frequently asked questions",
      items: [
        {
          question: "Where is my planner data stored?",
          answer:
            "Projects created in the planner are stored locally in your browser. This homepage language preference is stored separately.",
        },
        {
          question: "What game assets does the planner display?",
          answer:
            "The interactive map reference displays Stardew Valley game assets as part of the planner experience.",
        },
        {
          question: "How do I start planning?",
          answer:
            "Choose a farm map, then use the planner controls to build and adjust your layout.",
        },
      ],
    },
    footer: {
      copyright: "© Stardew Valley Farm Planner",
      farmComparisonLinkLabel: "Farm comparison",
      farmGuidesLinkLabel: "Farm guides",
    },
  },
  "zh-CN": {
    navigation: {
      productName: "星露谷物语农场规划器",
      capabilitiesLabel: "使用方式",
      faqLabel: "常见问题",
      plannerLabel: "规划器",
      plannerActionLabel: "打开规划器",
      languageLabel: "语言",
    },
    hero: {
      eyebrow: "交互式农场规划",
      headlineBefore: "规划一座",
      headlineEmphasis: "真正属于",
      headlineAfter: "你的农场。",
      supportingCopy: "在交互式农场地图上探索布局想法，并随着规划逐步调整细节。",
      primaryActionLabel: "开始规划",
    },
    workspace: {
      label: "你的规划工作区",
      description: "在下方打开交互式规划器，开始整理你的农场布局。",
    },
    capabilities: {
      heading: "在地图中完成规划",
      items: [
        {
          title: "规划布局",
          description: "在农场地图上放置元素，同时查看可用空间。",
        },
        {
          title: "探索农场地图",
          description: "从可用农场地图中选择，了解每种布局的起点。",
        },
        {
          title: "随时调整",
          description: "移动、移除并完善摆放，直到布局符合你的想法。",
        },
      ],
    },
    faq: {
      heading: "常见问题",
      items: [
        {
          question: "我的规划数据存在哪里？",
          answer: "在规划器中创建的项目保存在你的浏览器本地。首页语言偏好会单独保存。",
        },
        {
          question: "规划器显示了哪些游戏素材？",
          answer: "交互式地图参考会显示《星露谷物语》游戏素材，作为规划器体验的一部分。",
        },
        {
          question: "怎样开始规划？",
          answer: "先选择农场地图，再使用规划器控件建立和调整你的布局。",
        },
      ],
    },
    footer: {
      copyright: "© 星露谷物语农场规划器",
      farmComparisonLinkLabel: "农场对比",
      farmGuidesLinkLabel: "农场指南",
    },
  },
};
