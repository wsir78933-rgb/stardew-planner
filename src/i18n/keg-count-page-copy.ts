import { publicLocales, type PublicLocale } from "./public-locale";

export type KegCountComparisonRow = Readonly<{
  label: string;
  values: readonly [string, string, string];
  mobileValues?: readonly [string, string, string];
}>;

export type KegCountPageCopy = Readonly<{
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
    results: readonly [string, string, string, string, string];
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
    rows: readonly KegCountComparisonRow[];
    desktopSources: readonly Readonly<{ label: string; href: string }>[];
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

const kegCountPageCopyByLocale: Readonly<Record<PublicLocale, KegCountPageCopy>> = {
  "zh-CN": {
    hero: {
      eyebrow: "先看产能缺口",
      title: "这批收获需要多少个小桶？",
      description:
        "输入作物数量、加工期限与已有小桶，查看本轮能完成多少批、还会剩多少原料。再填重复收获间隔，判断平均产能是否会让积压持续增长。",
      note: "持续收获结果是平均产能估算；逐日装料请使用生产排程。",
    },
    caseStudy: {
      eyebrow: "案例展示",
      title: "10 个杨桃，7 天内要处理完？",
      description: "示例数据：每 7 天收获 10 个杨桃，手上已有 2 个小桶。",
      desktopResultTitle: "案例结果 · 示例数据",
      mobileResultTitle: "案例数据 · 不是玩家存档",
      results: [
        "需要 10 个小桶",
        "现有产能完成 2 批",
        "期限内有 8 个杨桃等待",
        "本轮还需 8 个小桶",
        "按每 7 天重复收获，现有产能每轮积压 8 个",
      ],
      disclaimer: "数字来自工具模型/测试场景；不是玩家存档。",
    },
    features: {
      eyebrow: "功能介绍",
      title: "把收获数量换算成可用产能",
      description: "从输入到下一步，先看最关键的计划结果。",
      items: [
        {
          title: "单批处理缺口",
          body: "按原料配方、加工期限和已有小桶，计算本轮能完成的批次与剩余数量。",
        },
        {
          title: "重复收获积压",
          body: "设置固定收获间隔，查看平均处理量和每轮积压变化。",
        },
        {
          title: "棚屋与材料衔接",
          body: "参考普通棚屋和大棚布局容量，再把小桶目标带入材料与树脂计算。",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: "三步估算小桶产能",
      description: "输入你手头的数据，再根据排程执行。",
      items: [
        {
          number: "01",
          title: "选择原料与数量",
          body: "选一种原料并输入这轮的收获数量。",
        },
        {
          number: "02",
          title: "填写期限与现有小桶",
          body: "设置可用天数、已拥有的小桶数和重复收获间隔。",
        },
        {
          number: "03",
          title: "查看缺口并继续规划",
          body: "对照本轮与长期估算，再检查棚屋空间或材料需求。",
        },
      ],
    },
    comparison: {
      eyebrow: "工具对比",
      title: "小桶需求：本站 vs. ValleyMath vs. Wiki / 社区表格",
      desktopDescription: "比的是截止日产能、重复收获，以及算完后怎么接着建。",
      mobileDescription: "看截止日产能、重复收获与建造衔接",
      cornerLabel: "功能",
      columns: ["本站小桶数量", "ValleyMath", "Wiki / 社区表格"],
      rows: [
        {
          label: "期限内能处理多少批？",
          values: ["看完工批次和未加工余量", "同样算期限产能，另有棚屋布局", "查配方和周期，自己比"],
        },
        {
          label: "重复收获会不会积压？",
          values: ["按固定间隔看吞吐和积压", "同样算持续产能，需及时重装", "查周期后自己比收获速度"],
        },
        {
          label: "算出台数后，怎么继续？",
          values: ["目标数带入材料页对库存", "容量页也能带入再算材料", "配方和缺口要手算"],
        },
        {
          label: "哪种方式更适合你？",
          values: ["中英双语，接着排材料和排程", "英文页面，含棚屋和材料", "只查规则或社区表格"],
        },
      ],
      desktopSources: [],
      mobileSources: "来源：ValleyMath 小桶容量 · Stardew Wiki Keg/Shed · Reddit 社区表格 17zomd4",
    },
    faq: {
      eyebrow: "FAQ",
      title: "小桶数量计算常见问题",
      description: "关于输入、结果和估算边界。",
      items: [
        {
          question: "这会列出每天要装什么吗？",
          answer: "不会。这里估算小桶容量与缺口；要查看每天的装料和收取，请打开综合生产排程。",
        },
        {
          question: "没赶上期限的原料会算成加工品吗？",
          answer: "不会。只有期限内完成的完整批次才计入处理量，未处理原料会单独显示。",
        },
        {
          question: "重复收获结果采用什么假设？",
          answer: "它假设同样数量按固定间隔反复收获，并及时收取、重新装料；这是平均产能估算。",
        },
        {
          question: "棚屋容量是实际摆放保证吗？",
          answer: "不是。工具参考常见布局数量；控制器通道、装饰和混合设备会减少实际空间。",
        },
      ],
    },
    cta: {
      title: "把小桶数量算清楚",
      description: "输入你这轮的收获和现有机台，查看小桶缺口与积压风险。",
      actionLabel: "计算所需小桶",
    },
  },
  en: {
    hero: {
      eyebrow: "Check the capacity gap",
      title: "How many Kegs does this harvest need?",
      description:
        "Enter the crop quantity, processing window, and Kegs you already own. See completed batches and what remains, then test whether repeating harvests will keep adding backlog.",
      note: "The repeating-harvest result is an average capacity estimate, not a day-by-day load plan.",
    },
    caseStudy: {
      eyebrow: "Case study",
      title: "Can 10 Starfruit clear in 7 days?",
      description: "Example: 10 Starfruit return every 7 days; 2 Kegs are already built.",
      desktopResultTitle: "Example results",
      mobileResultTitle: "Example data · not a player save",
      results: [
        "10 Kegs needed",
        "Current fleet finishes 2 batches",
        "8 Starfruit wait past the deadline",
        "8 more Kegs for this harvest",
        "At a 7-day repeat, the current fleet adds 8 backlog each cycle",
      ],
      disclaimer: "Values come from a calculator/test scenario, not a player save.",
    },
    features: {
      eyebrow: "Features",
      title: "Turn a harvest into a capacity target",
      description: "See the practical result first, then decide what to do next.",
      items: [
        {
          title: "One-harvest gap",
          body: "Use the recipe, deadline, and existing Kegs to count complete batches and leftovers.",
        },
        {
          title: "Repeating harvests",
          body: "Set the return interval and compare average throughput with backlog growth.",
        },
        {
          title: "Shed and material handoff",
          body: "Check common Shed layouts, then send the target to the materials and resin calculator.",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: "Estimate Keg capacity in three steps",
      description: "Start with the stock you have, then follow the schedule.",
      items: [
        {
          number: "01",
          title: "Choose the input and quantity",
          body: "Pick one crop or ingredient and enter this harvest stack.",
        },
        {
          number: "02",
          title: "Set the deadline and fleet",
          body: "Enter available days, Kegs on hand, and the repeating harvest interval.",
        },
        {
          number: "03",
          title: "Review the gap",
          body: "Compare one-harvest and long-run results, then check space or materials.",
        },
      ],
    },
    comparison: {
      eyebrow: "Tool comparison",
      title: "Keg Count: Our Tool vs. ValleyMath vs. Wiki / Community Sheets",
      desktopDescription:
        "Compare deadline capacity, repeat harvests, and what you do after the count.",
      mobileDescription: "Capacity, repeat harvests & build handoff",
      cornerLabel: "Feature",
      columns: ["Our keg count", "ValleyMath", "Wiki / community sheet"],
      rows: [
        {
          label: "How many batches finish by a deadline?",
          values: [
            "See finished batches and raw leftovers",
            "Also estimates deadline capacity and shed layouts",
            "Look up cycles, then compare mixes yourself",
          ],
        },
        {
          label: "Will recurring harvests fall behind?",
          values: [
            "Fixed interval shows throughput and backlog",
            "Also estimates backlog if you reload on time",
            "Look up cycles, then compare rates yourself",
          ],
        },
        {
          label: "What comes after the Keg target?",
          values: [
            "Send the target to our materials page",
            "Its capacity page can pass the target on",
            "Look up recipes; calculate the gap yourself",
          ],
        },
        {
          label: "Which option fits your workflow?",
          values: [
            "Bilingual, then continue to materials",
            "English capacity, shed, and materials",
            "Rules lookup or a community sheet",
          ],
        },
      ],
      desktopSources: [],
      mobileSources: "Sources: ValleyMath Keg capacity · Stardew Wiki Keg/Shed · Reddit sheet 17zomd4",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common Keg-capacity questions",
      description: "About inputs, results, and estimate limits.",
      items: [
        {
          question: "Does this list what to load each day?",
          answer:
            "No. It estimates machine capacity and the Keg gap. Use the Production Schedule for daily loads and collections.",
        },
        {
          question: "Are unfinished inputs counted as processed?",
          answer:
            "No. Only complete batches finished by the deadline count; the remaining inputs stay visible.",
        },
        {
          question: "What does the repeating-harvest estimate assume?",
          answer:
            "The same quantity returns at the selected interval, and finished Kegs are collected and reloaded promptly.",
        },
        {
          question: "Does Shed capacity guarantee this exact layout?",
          answer:
            "No. The tool references common layouts; controller access, decor, and mixed machines reduce practical space.",
        },
      ],
    },
    cta: {
      title: "Know your Keg target",
      description: "Enter this harvest and the machines you own to see the gap and backlog.",
      actionLabel: "Calculate Keg capacity",
    },
  },
};

export function getKegCountPageCopy(locale: PublicLocale): KegCountPageCopy {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported keg count page locale. Received: ${JSON.stringify(locale)}.`);
  }

  return kegCountPageCopyByLocale[locale];
}
