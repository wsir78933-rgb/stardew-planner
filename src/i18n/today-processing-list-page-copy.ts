import { publicLocales, type PublicLocale } from "./public-locale";

export type TodayProcessingListPageCopy = Readonly<{
  hero: Readonly<{
    title: string;
    body: string;
    note: string;
  }>;
  caseStudy: Readonly<{
    eyebrow: string;
    title: string;
    example: string;
    resultTitle: string;
    results: readonly string[];
    disclaimer: string;
    mobileCaption: string;
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
    description: string;
    cornerLabel: string;
    products: readonly string[];
    rows: readonly Readonly<{ label: string; values: readonly string[] }>[];
    sourceSeparator: string;
    sources: readonly Readonly<{ label: string; href: string }>[];
    mobileDescription: string;
    mobileSourceLine: string;
  }>;
  faq: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    items: readonly Readonly<{ question: string; answer: string }>[];
  }>;
  callToAction: Readonly<{
    title: string;
    body: string;
    actionLabel: string;
  }>;
}>;

const comparisonSources = [
  {
    label: "https://valleymath.com/stardew/what-to-process-today",
    href: "https://valleymath.com/stardew/what-to-process-today",
  },
  {
    label: "/artisan-production-planner",
    href: "https://valleymath.com/stardew/artisan-production-planner",
  },
  {
    label: "https://stardewvalleywiki.com/Keg",
    href: "https://stardewvalleywiki.com/Keg",
  },
  {
    label: "/Preserves_Jar",
    href: "https://stardewvalleywiki.com/Preserves_Jar",
  },
  {
    label: "/Dehydrator",
    href: "https://stardewvalleywiki.com/Dehydrator",
  },
] as const;

const todayProcessingListPageCopy = {
  en: {
    hero: {
      title: "What should you collect, then load?",
      body: "Use the same inventory and production plan to list collection and loading tasks for the selected day. Reserved stock and future arrivals stay separate; check off each task and copy the day's list.",
      note: "Plan day 0 is the start of the window for stock available now, not a season date or in-game clock time.",
    },
    caseStudy: {
      eyebrow: "Case study",
      title: "What can one Keg load today?",
      example: "Example: 4 normal Cranberries, keep 2; 1 Keg and a 7-day window.",
      resultTitle: "Example results",
      results: [
        "Plan day 0: load 1 Cranberry.",
        "Plan day 7 morning: collect 1 batch of Cranberry Wine.",
        "1 unprocessed Cranberry remains; 2 stay reserved. Added value is 150g; reserved value is separate.",
      ],
      disclaimer: "Values come from a calculator/test scenario, not a player save.",
      mobileCaption: "Example data · not a player save",
    },
    features: {
      eyebrow: "Features",
      title: "Follow tasks that fit the selected day",
      description: "See the practical result first, then decide what to do next.",
      items: [
        {
          title: "Separate collect and load",
          body: "See due collections first, then stock that can be loaded into available machines.",
        },
        {
          title: "Keep inventory boundaries",
          body: "Reserved units stay out of processing; future stock joins only on its available day.",
        },
        {
          title: "Check off and copy",
          body: "Track completed collections or loads, then copy the selected day's checklist.",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: "Build today's list in three steps",
      description: "Start with the stock you have, then follow the schedule.",
      items: [
        {
          number: "01",
          title: "Enter stock and arrival days",
          body: "Add quantity, quality, reserved units, and when each row becomes available.",
        },
        {
          number: "02",
          title: "Set machines and deadline",
          body: "Enter Kegs, Jars, Dehydrators, profession, and planning window.",
        },
        {
          number: "03",
          title: "Work through the day",
          body: "Review collections and loads, check off tasks, and copy the list.",
        },
      ],
    },
    comparison: {
      eyebrow: "Tool comparison",
      title: "Today\u2019s Processing List: Our Tool vs. ValleyMath vs. Wiki / Manual",
      description: "Compare daily loads, stock rules, and planning range. Our Today view uses the same plan as the full schedule.",
      cornerLabel: "User task",
      products: ["Our tool", "ValleyMath", "Wiki / manual calendar"],
      rows: [
        {
          label: "What should I load or collect today?",
          values: [
            "Review selected-day loads and collections; check off or copy tasks.",
            "Quick check uses up to 3 stacks and lists morning loads/collection days.",
            "Look up cycles and write today\u2019s tasks yourself.",
          ],
        },
        {
          label: "What about Keep amounts or future stock?",
          values: [
            "Reserved units stay out; each row enters only on its Ready day.",
            "Quick check is small; Full Planner supports Keep and Ready days.",
            "Track your own reserved and arriving stock.",
          ],
        },
        {
          label: "How far ahead can I look?",
          values: [
            "Switch dates in a 7/14/28-day window and focus on that day\u2019s work.",
            "Quick check: 7 days; Full Planner: 7/14/28-day daily schedules.",
            "Lists cycle times; calculate collection dates yourself.",
          ],
        },
        {
          label: "Which daily flow fits?",
          values: [
            "Use bilingual day tasks and return to the full schedule from one plan.",
            "Use a three-stack quick check or open the full planner.",
            "Use rules with your own calendar or spreadsheet.",
          ],
        },
      ],
      sourceSeparator: " \u00b7 ",
      sources: comparisonSources,
      mobileDescription: "Daily tasks, stock limits & schedule length",
      mobileSourceLine: "Sources: ValleyMath Today / Full Planner \u00b7 Stardew Wiki Keg/Jar/Dehydrator",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common daily-list questions",
      description: "About inputs, results, and estimate limits.",
      items: [
        {
          question: "What does plan day 0 mean?",
          answer: "It is the start of this planning window for stock available now, not a Spring or Fall date.",
        },
        {
          question: "Will reserved items be processed?",
          answer: "No. Reserved quantities stay outside the processing plan.",
        },
        {
          question: "Can future deliveries appear today?",
          answer: "No. A stock row becomes available only on its selected arrival day.",
        },
        {
          question: "Does the list simulate exact in-game clock times?",
          answer: "No. It uses a morning-check and reload assumption, not exact clock-time actions.",
        },
      ],
    },
    callToAction: {
      title: "See today's processing tasks",
      body: "Check what to collect and load on this day, then track each action.",
      actionLabel: "Build today's list",
    },
  },
  "zh-CN": {
    hero: {
      title: "今天先收什么，再装什么？",
      body: "从同一份库存和生产计划中，列出所选日期的收取与装料任务。预留数量和未来到货保持分开；完成后勾选任务，还能复制当天清单。",
      note: "计划第 0 天表示当前可用库存开始的窗口日，不是季节日期或游戏内时钟。",
    },
    caseStudy: {
      eyebrow: "案例展示",
      title: "一只小桶，今天装哪批？",
      example: "示例：4 个普通蔓越莓，预留 2 个；1 个小桶，7 天计划窗口。",
      resultTitle: "案例结果 · 示例数据",
      results: [
        "计划第 0 天：装入 1 个蔓越莓。",
        "计划第 7 天早晨：收取 1 批蔓越莓酒。",
        "结束时剩 1 个未加工，另有 2 个预留。加工增值 150 金；预留价值单列。",
      ],
      disclaimer: "数字来自工具模型/测试场景；不是玩家存档。",
      mobileCaption: "案例数据 · 不是玩家存档",
    },
    features: {
      eyebrow: "功能介绍",
      title: "按日期查看能实际执行的任务",
      description: "从输入到下一步，先看最关键的计划结果。",
      items: [
        {
          title: "分开收取与装料",
          body: "先看所选日期到期的收取任务，再检查可装入空闲机器的原料。",
        },
        {
          title: "保留库存边界",
          body: "预留物品不进入加工；尚未到货的库存只会从可用日期开始参与计划。",
        },
        {
          title: "勾选并复制",
          body: "逐项记录已完成的收取或装料，也可复制所选日期的操作清单。",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: "三步生成今日清单",
      description: "输入你手头的数据，再根据排程执行。",
      items: [
        {
          number: "01",
          title: "填写库存与到货日",
          body: "添加数量、品质、预留份数和计划可用日。",
        },
        {
          number: "02",
          title: "设置机器与期限",
          body: "填入小桶、罐头瓶、烘干机、职业和规划天数。",
        },
        {
          number: "03",
          title: "按日期完成任务",
          body: "查看收取与装料，做完后勾选并复制清单。",
        },
      ],
    },
    comparison: {
      eyebrow: "工具对比",
      title: "今日加工清单：本站 vs. ValleyMath vs. Wiki / 手动日历",
      description: "比较今日装收、库存条件和计划跨度；本站今日视图可与完整排程共用同一份计划。",
      cornerLabel: "用户任务",
      products: ["本站工具", "ValleyMath", "Wiki / 手动日历"],
      rows: [
        {
          label: "今天该装什么、收什么？",
          values: [
            "按选定日期列出装料/收取任务，可勾选完成并复制清单。",
            "快查最多 3 组库存，返回晨间装料清单与收取日期。",
            "查加工周期，再自行列今天的操作。",
          ],
        },
        {
          label: "预留库存和未来到货怎么算？",
          values: [
            "预留量不参与；每行库存到达设定日期才排进计划。",
            "快查较简单；完整排程支持 Keep 与 Ready day。",
            "规则不读取个人预留量或到货日期。",
          ],
        },
        {
          label: "能提前排几天？",
          values: [
            "在 7/14/28 天计划中切换日期，专注当天任务。",
            "快查 7 天；完整排程支持 7/14/28 天逐日计划。",
            "给出加工周期；收取日期需自行计算。",
          ],
        },
        {
          label: "哪种日常流程更合适？",
          values: [
            "要双语当天清单，并从同一计划查看完整排程。",
            "要三组快速选择，或打开独立的完整排程器。",
            "只查规则，自己维护日历或表格。",
          ],
        },
      ],
      sourceSeparator: " \u00b7 ",
      sources: comparisonSources,
      mobileDescription: "看装收任务、库存条件与计划跨度",
      mobileSourceLine: "来源：ValleyMath What to Process Today / Full Planner \u00b7 Wiki Keg/Jar/Dehydrator",
    },
    faq: {
      eyebrow: "FAQ",
      title: "今日加工清单常见问题",
      description: "关于输入、结果和估算边界。",
      items: [
        {
          question: "计划第 0 天是什么意思？",
          answer: "表示本计划窗口从当前可用库存开始；不是春夏秋冬中的日期。",
        },
        {
          question: "预留的物品会进入加工吗？",
          answer: "不会。预留数量会留在计划之外，不会被安排装机。",
        },
        {
          question: "未来到货会提前排入今天吗？",
          answer: "不会。每行库存只有到达填写的可用日后才能进入任务清单。",
        },
        {
          question: "它会模拟游戏内具体时刻吗？",
          answer: "不会。模型按早晨检查、收取并重新装料的计划假设计算，不给出精确时钟时间。",
        },
      ],
    },
    callToAction: {
      title: "打开今天的加工清单",
      body: "查看这一天该收取和装入什么，并逐项记录完成情况。",
      actionLabel: "生成今日清单",
    },
  },
} as const satisfies Readonly<Record<PublicLocale, TodayProcessingListPageCopy>>;

export function getTodayProcessingListPageCopy(locale: PublicLocale): TodayProcessingListPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported today processing list page locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  return todayProcessingListPageCopy[locale];
}
