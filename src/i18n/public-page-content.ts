import type { SiteFooterCopy } from "../site-footer/site-footer-content";
import { publicLocales, type PublicLocale } from "./public-locale";

export type PublicPageCopy = Readonly<{
  footer: SiteFooterCopy;
  navigation: Readonly<{
    productName: string;
    capabilitiesLabel: string;
    faqLabel: string;
    blogLabel: string;
    plannerActionLabel: string;
    languageLabel: string;
  }>;
  plannerTitle: string;
  plannerDescription: string;
}>;

const publicPageCopy: Readonly<Record<PublicLocale, PublicPageCopy>> = {
  en: {
    footer: {
      brandName: "Stardew Valley Farm Planner",
      description:
        "A fan-made farm planner. Projects stay in this browser. This project is not affiliated with or endorsed by ConcernedApe or Stardew Valley.",
      copyright: "© Stardew Valley Farm Planner",
      planner: {
        title: "Planner",
        home: "Planner",
      },
      explore: {
        title: "Explore",
        capabilities: "How it works",
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
    navigation: {
      productName: "Stardew Valley Farm Planner",
      capabilitiesLabel: "How it works",
      faqLabel: "FAQ",
      blogLabel: "Blog",
      plannerActionLabel: "Open planner",
      languageLabel: "Language",
    },
    plannerTitle: "Stardew Valley Farm Planner",
    plannerDescription:
      "Plan Stardew Valley farm layouts in your browser with an interactive map.",
  },
  "zh-CN": {
    footer: {
      brandName: "星露谷物语农场规划器",
      description: "玩家自制农场规划器，项目仅保存在当前浏览器。本项目与 ConcernedApe 或《星露谷物语》无关联，也未获其认可。",
      copyright: "© 星露谷物语农场规划器",
      planner: {
        title: "规划器",
        home: "规划器",
      },
      explore: {
        title: "探索",
        capabilities: "使用方式",
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
    navigation: {
      productName: "星露谷物语农场规划器",
      capabilitiesLabel: "使用方式",
      faqLabel: "常见问题",
      blogLabel: "博客",
      plannerActionLabel: "打开规划器",
      languageLabel: "语言",
    },
    plannerTitle: "星露谷农场规划器",
    plannerDescription: "使用本地地图、物品和项目规划你的星露谷农场布局。",
  },
};

function assertPublicLocale(locale: unknown): asserts locale is PublicLocale {
  if (!publicLocales.includes(locale as PublicLocale)) {
    throw new Error(`Unsupported public locale. Received: ${JSON.stringify(locale)}.`);
  }
}

export function getPublicPageCopy(locale: PublicLocale): PublicPageCopy {
  assertPublicLocale(locale);

  return publicPageCopy[locale];
}
