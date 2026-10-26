import { publicLocales, type PublicLocale } from "./public-locale";

export type MaterialsAndResinComparisonRow = Readonly<{
  label: string;
  values: readonly [string, string, string];
  mobileValues?: readonly [string, string, string];
}>;

export type MaterialsAndResinPageCopy = Readonly<{
  hero: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    note: string;
  }>;
  caseStudy: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    desktopResultTitle: string;
    mobileResultTitle: string;
    results: readonly [string, string];
    disclaimer: string;
  }>;
  features: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ title: string; body: string }>[];
  }>;
  steps: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ number: string; title: string; body: string }>[];
  }>;
  comparison: Readonly<{
    eyebrow: string;
    title: string;
    desktopDescription: string;
    mobileDescription: string;
    cornerLabel: string;
    columns: readonly [string, string, string];
    rows: readonly MaterialsAndResinComparisonRow[];
    mobileSources: string;
  }>;
  faq: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ question: string; answer: string }>[];
  }>;
  cta: Readonly<{
    title: string;
    description: string;
    actionLabel: string;
  }>;
}>;

const materialsAndResinPageCopyByLocale: Readonly<Record<PublicLocale, MaterialsAndResinPageCopy>> = {
  "zh-CN": {
    hero: {
      eyebrow: "从目标到材料清单",
      title: "还差哪些材料，树脂要等多久？",
      description:
        "输入目标小桶数、已有小桶和材料库存，查看现在能制作多少、缺口由什么材料卡住。再按已成熟且装有采集器的橡树，估算树脂周期和期限内产量。",
      note: "不模拟橡树生长、树液采集器制作、熔矿或煤炭消耗。树脂从当前成熟橡树开始估算。",
    },
    caseStudy: {
      eyebrow: "案例展示",
      title: "材料缺口与树脂周期分开看",
      description: "下面两组是独立示例，不代表同一份库存。",
      desktopResultTitle: "案例结果 · 示例数据",
      mobileResultTitle: "案例数据 · 不是玩家存档",
      results: [
        "材料示例：目标 4 个、已有 1 个；木材 75、铜锭 1、铁锭 2、树脂 2。当前可建 1 个，瓶颈是铜锭。",
        "树脂示例：目标 4 个、已有 0 个；2 棵成熟橡树装普通采集器，等待 7 天。产出 2 个，期限末仍缺 2 个；预计 14 天补足。",
      ],
      disclaimer: "数字来自工具模型/测试场景；不是玩家存档。",
    },
    features: {
      eyebrow: "功能介绍",
      title: "同时核对建造缺口与树脂等待",
      description: "从输入到下一步，先看最关键的计划结果。",
      items: [
        {
          title: "计算目标配方",
          body: "扣除已拥有的小桶，按每个小桶的木材、铜锭、铁锭和橡树树脂配方汇总。",
        },
        {
          title: "找到当前瓶颈",
          body: "查看现有库存可制作数量、总缺口和最先限制建造的材料。",
        },
        {
          title: "估算树脂周期",
          body: "按成熟橡树数、普通或重型采集器与等待天数计算完整周期产量。",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: "三步核对制作与等待",
      description: "输入你手头的数据，再根据排程执行。",
      items: [
        {
          number: "01",
          title: "填写目标数量",
          body: "输入想拥有的小桶数和当前已经建好的数量。",
        },
        {
          number: "02",
          title: "盘点材料库存",
          body: "填写木材、铜锭、铁锭和橡树树脂。",
        },
        {
          number: "03",
          title: "设置采集条件",
          body: "输入成熟橡树数量、采集器类型和等待天数，查看树脂缺口。",
        },
      ],
    },
    comparison: {
      eyebrow: "工具对比",
      title: "材料与树脂：本站 vs. ValleyMath vs. Wiki / 手动清单",
      desktopDescription: "比的是库存缺口、树脂期限，以及从小桶目标接着算。",
      mobileDescription: "看库存缺口、树脂期限与工具衔接",
      cornerLabel: "功能",
      columns: ["本站材料与树脂", "ValleyMath", "Wiki / 手动清单"],
      rows: [
        {
          label: "当前库存能制作多少台？",
          values: ["看可制作数、瓶颈和缺料", "同样扣已建数，列出瓶颈", "查配方，自己减库存"],
        },
        {
          label: "橡树树脂何时能补齐？",
          values: ["按树、采集器和期限估产量", "同样按树和期限估产量", "查周期，自己换算"],
        },
        {
          label: "如何接续小桶数量规划？",
          values: ["容量页带入目标和已建数", "容量页也能带入再算材料", "不带入个人目标和库存"],
        },
        {
          label: "哪种更适合当前需求？",
          values: ["中英双语，分开复制材料和树脂", "英文计算器，可复制清单", "只查配方和周期，自己盘点"],
        },
      ],
      mobileSources: "来源：ValleyMath Keg Cost · Stardew Wiki Keg/Oak Resin/Tapper",
    },
    faq: {
      eyebrow: "FAQ",
      title: "材料与树脂常见问题",
      description: "关于输入、结果和估算边界。",
      items: [
        {
          question: "制作一个小桶需要什么？",
          answer: "30 个木材、1 个铜锭、1 个铁锭和 1 个橡树树脂。",
        },
        {
          question: "树脂等待会包含橡树生长吗？",
          answer: "不会。估算从已成熟且装好采集器的橡树开始，不计算长树和制作采集器的时间。",
        },
        {
          question: "重型采集器如何影响估算？",
          answer: "模型按普通采集器 7 天、重型采集器 3 天计算完整树脂周期。",
        },
        {
          question: "会把矿石和熔炉时间算进去吗？",
          answer: "不会。材料栏填写已准备好的铜锭和铁锭；矿石、煤炭与熔炼过程不在此工具范围内。",
        },
      ],
    },
    cta: {
      title: "先看清缺口，再安排树脂",
      description: "填写目标小桶与现有库存，查看现在能做多少、还要等多久。",
      actionLabel: "计算材料与树脂时间",
    },
  },
  en: {
    hero: {
      eyebrow: "From target to materials",
      title: "What is missing, and when will Resin be ready?",
      description:
        "Enter your Keg target, machines already built, and material stock. See what you can craft now and which resource is the bottleneck, then estimate Oak Resin cycles from mature tapped trees.",
      note: "The estimate starts with mature Oaks that already have Tappers. It does not model tree growth, Tapper crafting, smelting, or Coal.",
    },
    caseStudy: {
      eyebrow: "Case study",
      title: "See material gaps and resin timing separately",
      description: "These are two independent examples, not one shared inventory.",
      desktopResultTitle: "Example results",
      mobileResultTitle: "Example data · not a player save",
      results: [
        "Materials: target 4, built 1; Wood 75, Copper 1, Iron 2, Resin 2. Build 1 now; Copper is the bottleneck.",
        "Resin: target 4, built 0; 2 mature Oaks with regular Tappers, 7 days. Produce 2 Resin, still short 2; estimated 14 days to fill.",
      ],
      disclaimer: "Values come from a calculator/test scenario, not a player save.",
    },
    features: {
      eyebrow: "Features",
      title: "Check the build gap and waiting time together",
      description: "See the practical result first, then decide what to do next.",
      items: [
        {
          title: "Count the recipe",
          body: "Subtract Kegs already built, then total the Wood, Copper Bars, Iron Bars, and Oak Resin needed.",
        },
        {
          title: "Find the bottleneck",
          body: "See how many you can craft now, the remaining shortages, and the limiting material.",
        },
        {
          title: "Estimate Resin cycles",
          body: "Use mature tapped Oaks, regular or Heavy Tappers, and the waiting window to count full cycles.",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: "Check materials and timing in three steps",
      description: "Start with the stock you have, then follow the schedule.",
      items: [
        {
          number: "01",
          title: "Enter the Keg target",
          body: "Set the number you want and how many are already built.",
        },
        {
          number: "02",
          title: "Count your materials",
          body: "Add Wood, Copper Bars, Iron Bars, and Oak Resin in stock.",
        },
        {
          number: "03",
          title: "Set the Tapper conditions",
          body: "Enter mature tapped Oaks, Tapper type, and waiting days to review the remaining Resin gap.",
        },
      ],
    },
    comparison: {
      eyebrow: "Tool comparison",
      title: "Keg Materials & Resin: Our Tool vs. ValleyMath vs. Wiki / Manual",
      desktopDescription: "Compare stock gaps, resin timing, and the handoff from a Keg target.",
      mobileDescription: "Stock gaps, resin timing & workflow",
      cornerLabel: "Feature",
      columns: ["Our materials tool", "ValleyMath", "Wiki / manual list"],
      rows: [
        {
          label: "How many can my stock craft?",
          values: [
            "See craftable count, bottleneck, and shortages",
            "Also shows the limiting material",
            "Look up the recipe and subtract stock",
          ],
        },
        {
          label: "When will Oak Resin cover the gap?",
          values: [
            "Estimate output, days, or trees needed",
            "Also estimates output by tapper and deadline",
            "Look up cycles and calculate the deadline",
          ],
        },
        {
          label: "Can I carry a Keg target into this step?",
          values: [
            "Capacity page fills the target and built count",
            "Its capacity page can pass the counts on",
            "No personal target or stock is carried in",
          ],
        },
        {
          label: "Which workflow fits?",
          values: [
            "Bilingual, copy materials and resin separately",
            "English calculator with a checklist copy",
            "Recipe rules, then do the math yourself",
          ],
        },
      ],
      mobileSources: "Sources: ValleyMath Keg Cost · Stardew Wiki Keg/Oak Resin/Tapper",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common materials and resin questions",
      description: "About inputs, results, and estimate limits.",
      items: [
        {
          question: "What does one Keg require?",
          answer: "30 Wood, 1 Copper Bar, 1 Iron Bar, and 1 Oak Resin.",
        },
        {
          question: "Does the wait include growing an Oak?",
          answer:
            "No. The estimate starts with mature Oaks that already have Tappers; tree growth and Tapper crafting are excluded.",
        },
        {
          question: "How does a Heavy Tapper change the estimate?",
          answer: "The model uses full cycles of 7 days for a regular Tapper and 3 days for a Heavy Tapper.",
        },
        {
          question: "Does it include ore and furnace time?",
          answer:
            "No. Enter finished Copper and Iron Bars; ore, Coal, and smelting are outside this calculator.",
        },
      ],
    },
    cta: {
      title: "See the gap before you build",
      description: "Enter your Keg target and stock to check what you can craft now and when Resin may catch up.",
      actionLabel: "Calculate materials and Resin",
    },
  },
};

export function getMaterialsAndResinPageCopy(locale: PublicLocale): MaterialsAndResinPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported materials and resin page locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  return materialsAndResinPageCopyByLocale[locale];
}
