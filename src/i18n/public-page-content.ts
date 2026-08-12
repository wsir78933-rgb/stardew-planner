import {
  publicNavigation,
  type PublicNavigationPath,
} from "../reference/public-navigation";
import type { SiteFooterCopy } from "../site-footer/site-footer-content";
import { publicLocales, type PublicLocale } from "./public-locale";

export type PublicPageCopy = Readonly<{
  footer: SiteFooterCopy;
  navigationLabel: string;
  navigation: readonly Readonly<{ label: string; path: PublicNavigationPath }>[];
  brandLabel: string;
  counterpartLabel: string;
  plannerTitle: string;
  plannerDescription: string;
}>;

const publicPageCopy: Readonly<Record<PublicLocale, PublicPageCopy>> = {
  en: {
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
    navigationLabel: "Public navigation",
    navigation: publicNavigation,
    brandLabel: "Stardew Valley Farm Planner",
    counterpartLabel: "简体中文",
    plannerTitle: "Stardew Valley Farm Planner",
    plannerDescription:
      "Plan Stardew Valley farm layouts in your browser with an interactive map.",
  },
  "zh-CN": {
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
    navigationLabel: "公共导航",
    navigation: [{ label: "规划器", path: "/" }],
    brandLabel: "星露谷规划器",
    counterpartLabel: "English",
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
