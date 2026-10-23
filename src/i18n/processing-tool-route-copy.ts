import type { PublicLocale } from "./public-locale";
import type { ToolsPageHeroCopy } from "./tools-page-copy";
import {
  getProcessingToolDefinition,
  type ProcessingToolId,
} from "../tools-pages/processing/processing-tool-definition";

export type ProcessingToolRouteCopy = Readonly<{
  title: string;
  metaTitle: string;
  metaDescription: string;
  hero: ToolsPageHeroCopy;
}>;

export type ProcessingToolFrameCopy = Readonly<{
  allToolsLabel: string;
  categoryLabels: Readonly<Record<string, string>>;
  toolLabels: Readonly<Record<string, string>>;
  kegRankingLinkLabel: string;
}>;

const processingToolFrameCopyByLocale: Readonly<
  Record<PublicLocale, ProcessingToolFrameCopy>
> = {
  en: {
    allToolsLabel: "All tools",
    categoryLabels: {
      planting: "Crop planning",
      processing: "Processing",
      production: "Production plan",
      workshop: "Workshop",
    },
    toolLabels: {
      "crop-profit": "Season crop profit",
      "crop-growth": "Growth and harvest calendar",
      "basic-processing-profit": "Basic processing profit",
      "machine-comparison": "Three-machine comparison",
      "keg-processing": "Keg processing",
      "preserves-jar-processing": "Preserves Jar processing",
      "dehydrator-processing": "Dehydrator processing",
      "keg-ingredient-ranking": "Keg ingredient ranking",
      "cask-aging": "Cask aging",
      "today-processing-list": "Today's processing list",
      "production-schedule": "Production schedule",
      "keg-count": "How many Kegs?",
      "materials-and-resin": "Materials and resin timing",
    },
    kegRankingLinkLabel: "View Keg ingredient ranking",
  },
  "zh-CN": {
    allToolsLabel: "全部工具",
    categoryLabels: {
      planting: "种植规划",
      processing: "加工计算",
      production: "生产计划",
      workshop: "工坊建设",
    },
    toolLabels: {
      "crop-profit": "季节作物收益",
      "crop-growth": "生长与收获日历",
      "basic-processing-profit": "基础加工收益",
      "machine-comparison": "三种机器比较",
      "keg-processing": "Keg 加工",
      "preserves-jar-processing": "罐头瓶加工",
      "dehydrator-processing": "烘干机加工",
      "keg-ingredient-ranking": "Keg 原料排行",
      "cask-aging": "酒窖陈酿",
      "today-processing-list": "今日加工清单",
      "production-schedule": "综合生产排程",
      "keg-count": "需要多少 Keg",
      "materials-and-resin": "材料与树脂时间",
    },
    kegRankingLinkLabel: "查看 Keg 原料排行",
  },
};

const processingToolRouteCopyByLocale: Readonly<
  Record<PublicLocale, Readonly<Record<ProcessingToolId, ProcessingToolRouteCopy>>>
> = {
  en: {
    "basic-processing-profit": {
      title: "Basic processing profit",
      metaTitle: "Stardew Valley Profit Calculator — Raw vs Artisan Goods",
      metaDescription:
        "Use this Stardew Valley profit calculator to compare artisan goods profit across Kegs, Jars and Dehydrators against selling the same ingredients raw.",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Profit",
        titleAfter: "Calculator",
        description:
          "Use this Stardew Valley profit calculator to compare artisan goods profit across Kegs, Jars and Dehydrators against selling the same ingredients raw.",
        actionLabel: "Compare processing profit",
      },
    },
    "machine-comparison": {
      title: "Three-machine comparison",
      metaTitle: "Stardew Valley Keg vs Jar vs Dehydrator Calculator",
      metaDescription:
        "Compare your crop stack with this Stardew Valley Keg vs Jar vs Dehydrator calculator. Check added profit, processing time, capacity and leftovers.",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Keg vs Jar vs Dehydrator",
        titleAfter: "Calculator",
        description:
          "Compare your crop stack with this Stardew Valley Keg vs Jar vs Dehydrator calculator. Check added profit, processing time, capacity and leftovers.",
        actionLabel: "Compare machine routes",
      },
    },
    "keg-processing": {
      title: "Keg processing",
      metaTitle: "Stardew Valley Keg Calculator — Profit, Time & Capacity",
      metaDescription:
        "Use the Stardew Valley Keg calculator to compare keg profit, processing time and keg capacity. Check finished batches and raw leftovers by your deadline.",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Keg",
        titleAfter: "Calculator",
        description:
          "Use the Stardew Valley Keg calculator to compare keg profit, processing time and keg capacity. Check finished batches and raw leftovers by your deadline.",
        actionLabel: "Calculate Keg profit",
      },
    },
    "preserves-jar-processing": {
      title: "Preserves jar processing",
      metaTitle: "Stardew Valley Preserves Jar Calculator: What to Put in Jars",
      metaDescription:
        "Use the Stardew Valley preserves jar calculator to decide what to put in jars. Compare jelly and pickles profit, batch times and remaining ingredients.",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Preserves Jar",
        titleAfter: "Calculator",
        description:
          "Use the Stardew Valley preserves jar calculator to decide what to put in jars. Compare jelly and pickles profit, batch times and remaining ingredients.",
        actionLabel: "Calculate jar profit",
      },
    },
    "dehydrator-processing": {
      title: "Dehydrator processing",
      metaTitle: "Stardew Valley Dehydrator Calculator — Batch Profit",
      metaDescription:
        "Use the Stardew Valley dehydrator calculator to compare batch profit for dried fruit, dried mushrooms and raisins, including capacity and five-item remainders.",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Dehydrator",
        titleAfter: "Calculator",
        description:
          "Use the Stardew Valley dehydrator calculator to compare batch profit for dried fruit, dried mushrooms and raisins, including capacity and five-item remainders.",
        actionLabel: "Calculate batch profit",
      },
    },
    "keg-ingredient-ranking": {
      title: "Keg ingredient ranking",
      metaTitle: "Stardew Valley Keg Price List — What to Put in Kegs",
      metaDescription:
        "Browse the Stardew Valley keg price list to choose what to put in kegs. Use the keg input calculator to check added value, batch times and your actual stock.",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Keg Price",
        titleAfter: "List",
        description:
          "Browse the Stardew Valley keg price list to choose what to put in kegs. Use the keg input calculator to check added value, batch times and your actual stock.",
        actionLabel: "View the Keg price list",
      },
    },
    "cask-aging": {
      title: "Cellar aging",
      metaTitle: "Stardew Valley Wine Aging Time Calculator — Finish Dates",
      metaDescription:
        "How long does wine take to age? Use the wine aging calculator to compare silver, gold and iridium targets, collection dates, added value and Cask capacity.",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Wine Aging Time",
        titleAfter: "Calculator",
        description:
          "How long does wine take to age? Use the wine aging calculator to compare silver, gold and iridium targets, collection dates, added value and Cask capacity.",
        actionLabel: "Calculate wine aging time",
      },
    },
  },
  "zh-CN": {
    "basic-processing-profit": {
      title: "基础加工收益",
      metaTitle: "星露谷物语加工收益计算器",
      metaDescription:
        "比较同一批作物直接出售、Keg、罐头瓶和烘干机加工后的收益。",
      hero: {
        titleBefore: "星露谷物语",
        accent: "加工收益",
        titleAfter: "计算器",
        description: "比较同一批作物直接出售、Keg、罐头瓶和烘干机加工后的收益。",
        actionLabel: "比较加工收益",
      },
    },
    "machine-comparison": {
      title: "三种机器比较",
      metaTitle: "星露谷物语加工机器比较计算器",
      metaDescription:
        "比较 Keg、罐头瓶和烘干机的加工结果、周期与未加工原料。",
      hero: {
        titleBefore: "星露谷物语",
        accent: "三机加工",
        titleAfter: "对比计算器",
        description: "比较 Keg、罐头瓶和烘干机的加工结果、周期与未加工原料。",
        actionLabel: "比较三种机器",
      },
    },
    "keg-processing": {
      title: "Keg 加工",
      metaTitle: "星露谷物语 Keg 加工计算器",
      metaDescription:
        "估算星露谷作物经 Keg 加工后的结果、周期和加工增值。",
      hero: {
        titleBefore: "星露谷物语",
        accent: "Keg 加工",
        titleAfter: "计算器",
        description: "估算星露谷作物经 Keg 加工后的结果、周期和加工增值。",
        actionLabel: "计算 Keg 加工收益",
      },
    },
    "preserves-jar-processing": {
      title: "罐头瓶加工",
      metaTitle: "星露谷物语罐头瓶加工计算器",
      metaDescription:
        "估算同一批作物经罐头瓶加工后的结果、周期和加工增值。",
      hero: {
        titleBefore: "星露谷物语",
        accent: "罐头瓶加工",
        titleAfter: "计算器",
        description: "估算同一批作物经罐头瓶加工后的结果、周期和加工增值。",
        actionLabel: "计算罐头瓶加工收益",
      },
    },
    "dehydrator-processing": {
      title: "烘干机加工",
      metaTitle: "星露谷物语烘干机加工计算器",
      metaDescription:
        "估算星露谷作物使用烘干机后的产出、批次数量和加工增值。",
      hero: {
        titleBefore: "星露谷物语",
        accent: "烘干机加工",
        titleAfter: "计算器",
        description: "估算星露谷作物使用烘干机后的产出、批次数量和加工增值。",
        actionLabel: "计算烘干批次收益",
      },
    },
    "keg-ingredient-ranking": {
      title: "Keg 原料排行",
      metaTitle: "星露谷物语 Keg 原料收益排行",
      metaDescription:
        "按单件增值或机器周期增值比较适合 Keg 加工的原料。",
      hero: {
        titleBefore: "星露谷物语",
        accent: "Keg 原料价格",
        titleAfter: "清单",
        description: "按单件增值或机器周期增值比较适合 Keg 加工的原料。",
        actionLabel: "查看 Keg 原料价格",
      },
    },
    "cask-aging": {
      title: "酒窖陈酿",
      metaTitle: "星露谷物语酒窖陈酿计算器",
      metaDescription:
        "估算成品酒的剩余陈酿时间、收取日期和本轮陈酿增值。",
      hero: {
        titleBefore: "星露谷物语",
        accent: "葡萄酒陈酿时间",
        titleAfter: "计算器",
        description: "估算成品酒的剩余陈酿时间、收取日期和本轮陈酿增值。",
        actionLabel: "计算葡萄酒陈酿时间",
      },
    },
  },
};

export function getProcessingToolRouteCopy(
  locale: PublicLocale,
  toolId: ProcessingToolId,
): ProcessingToolRouteCopy {
  getProcessingToolDefinition(toolId);
  const routeCopy = processingToolRouteCopyByLocale[locale]?.[toolId];
  if (routeCopy === undefined) {
    throw new Error(
      `Processing route copy is missing for locale ${JSON.stringify(locale)} and tool ${JSON.stringify(toolId)}.`,
    );
  }

  return routeCopy;
}

export function getProcessingToolFrameCopy(
  locale: PublicLocale,
): ProcessingToolFrameCopy {
  const frameCopy = processingToolFrameCopyByLocale[locale];
  if (frameCopy === undefined) {
    throw new Error(
      `Processing frame copy is missing for locale ${JSON.stringify(locale)}.`,
    );
  }

  return frameCopy;
}
