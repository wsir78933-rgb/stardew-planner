import type { PublicLocale } from "./public-locale";

export type ProductionSchedulePageCopy = Readonly<{
  hero: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    note: string;
  }>;
  caseStudy: Readonly<{
    eyebrow: string;
    title: string;
    inputs: string;
    resultTitle: string;
    mobileResultTitle: string;
    resultLines: readonly string[];
    footnote: string;
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
    mobileDescription: string;
    cornerLabel: string;
    products: readonly string[];
    rows: readonly Readonly<{
      label: string;
      values: readonly string[];
      mobileValues?: readonly string[];
    }>[];
    sourceLine: string;
    mobileSourceLine: string;
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

const comparisonSourceLine =
  "https://valleymath.com/stardew/artisan-production-planner · https://stardewvalleywiki.com/Keg · /Preserves_Jar · /Dehydrator · https://www.reddit.com/r/StardewValley/comments/17zomd4/";

const productionSchedulePageCopyByLocale: Readonly<Record<PublicLocale, ProductionSchedulePageCopy>> = {
  en: {
    hero: {
      eyebrow: "See the full processing window",
      title: "Line up arrivals, machines, and daily work",
      description:
        "Plan a 7-, 14-, or 28-day window from inventory, reservations, arrival days, profession, and machine counts. Review daily loads and collections, added value, and raw leftovers.",
      note: "The schedule uses a morning-check assumption; it is not an exact in-game clock or save-file guarantee.",
    },
    caseStudy: {
      eyebrow: "Case study",
      title: "What fits in a 14-day plan?",
      inputs: "Inputs: normal-quality Cranberries x4 (keep 1), 8 arrive on day 2; 10 Coffee Beans.",
      resultTitle: "Example results",
      mobileResultTitle: "Example data · not a player save",
      resultLines: [
        "Machines: 1 Keg, 1 Jar, 1 Dehydrator; profession: Artisan.",
        "All normal-quality inputs; 8 batches finish.",
        "Raw baseline 1,052g + added value 1,586g = 2,638g.",
        "1 Cranberry (82g) remains; 1 reserved is excluded.",
      ],
      footnote: "Values come from a calculator/test scenario, not a player save.",
    },
    features: {
      eyebrow: "Features",
      title: "See the daily work and the full-window result",
      description: "See the practical result first, then decide what to do next.",
      items: [
        {
          title: "Respect stock timing",
          body: "Schedule each row by quantity, quality, reserved units, and available day.",
        },
        {
          title: "Plan several machines",
          body: "Include Keg, Preserves Jar, and Dehydrator capacity and processing cycles.",
        },
        {
          title: "Check value and leftovers",
          body: "Compare the raw-sale baseline, added value, final value, and unprocessed stock.",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: "Build a production schedule in three steps",
      description: "Start with the stock you have, then follow the schedule.",
      items: [
        {
          number: "01",
          title: "Add inventory rows",
          body: "Enter the input, quantity, quality, reserved amount, and arrival day.",
        },
        {
          number: "02",
          title: "Set processing conditions",
          body: "Choose machine counts, profession, and a 7-, 14-, or 28-day window.",
        },
        {
          number: "03",
          title: "Review and follow the plan",
          body: "See daily tasks and machine allocation, copy the summary, or switch to Today's list.",
        },
      ],
    },
    comparison: {
      eyebrow: "Tool comparison",
      title: "Production Schedule: Our Tool vs. ValleyMath vs. Wiki / Community Sheets",
      description:
        "Compare inputs, machine allocation, and daily results. The planners overlap; our pages add bilingual use and a Today-list handoff.",
      mobileDescription: "Similar planners; compare language and daily flow",
      cornerLabel: "User task",
      products: ["Our tool", "ValleyMath", "Wiki / community sheet"],
      rows: [
        {
          label: "How can I add inventory?",
          values: [
            "Enter multiple rows or import a local save; set quality, Keep, Ready day, and machines.",
            "Also supports local-save import or manual inventory and machine entry.",
            "Look up recipes and cycles; organize inventory yourself.",
          ],
          mobileValues: [
            "Enter rows or import a save; set quality, Keep, Ready day, and machine counts.",
            "Also supports local-save import or manual inventory and machine entry.",
            "Look up recipes and cycles; organize inventory yourself.",
          ],
        },
        {
          label: "How do the three machine types share stock?",
          values: [
            "Allocate Kegs, Jars, and Dehydrators from one pool without reusing inputs.",
            "Also shares stock across three machine types and recommends routes.",
            "Lists machine rules; does not allocate your inventory.",
          ],
        },
        {
          label: "What daily results can I review?",
          values: [
            "See 7/14/28-day loads, collections, value breakdown, leftovers, and utilization.",
            "Also shows daily tasks and value, plus backlog and processed count.",
            "Provides product/cycle references; plan dates and totals yourself.",
          ],
          mobileValues: [
            "Review 7/14/28-day loads, collections, value, leftovers, and machine utilization.",
            "Also shows daily tasks and value, plus backlog and processed count.",
            "Provides product/cycle references; plan dates and totals yourself.",
          ],
        },
        {
          label: "Which schedule fits?",
          values: [
            "Choose bilingual full-window planning linked to this plan’s Today view.",
            "Choose save import, sharing, and more metrics; it also is not proven optimal.",
            "Choose rule lookup or a community sheet for crop-route comparisons.",
          ],
          mobileValues: [
            "Choose bilingual full-window planning linked to this plan’s Today view.",
            "Use save import, sharing, and more metrics; no global optimum is proven.",
            "Choose rule lookup or a community sheet for crop-route comparisons.",
          ],
        },
      ],
      sourceLine: comparisonSourceLine,
      mobileSourceLine: "Sources: ValleyMath Full Planner · Wiki Keg/Jar/Dehydrator · Reddit sheet 17zomd4",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common production-schedule questions",
      description: "About inputs, results, and estimate limits.",
      items: [
        {
          question: "Which planning windows are available?",
          answer: "Choose 7, 14, or 28 days to review processing and collection tasks.",
        },
        {
          question: "How is this different from Today's processing list?",
          answer:
            "Production Schedule focuses on the full window and machine allocation; Today's list focuses on actions for the selected day.",
        },
        {
          question: "Are seed, fertilizer, or machine-building costs included?",
          answer:
            "No. This page plans processing for entered stock; planting costs and crafting machine materials are outside its scope.",
        },
        {
          question: "Does the schedule guarantee an exact save-file result?",
          answer:
            "No. It follows the model's processing cycles and morning-check assumptions; actual action times can differ.",
        },
      ],
    },
    cta: {
      title: "Plan the full processing window",
      description: "Add your stock and machines to review daily tasks, added value, and leftovers.",
      actionLabel: "View the production schedule",
    },
  },
  "zh-CN": {
    hero: {
      eyebrow: "看完整加工窗口",
      title: "把库存到货和机器时间排在一起",
      description:
        "在 7、14 或 28 天窗口内，结合库存、预留数量、到货日、职业和机器数量，查看每天的装料与收取安排，以及计划增值和未加工余量。",
      note: "这是按早晨检查与收取假设生成的计划；结果不是游戏内精确时钟或存档保证。",
    },
    caseStudy: {
      eyebrow: "案例展示",
      title: "14 天计划会怎样安排？",
      inputs: "输入：普通品质蔓越莓 4 个（预留 1 个），第 2 天到货 8 个；咖啡豆 10 个。",
      resultTitle: "案例结果 · 示例数据",
      mobileResultTitle: "案例数据 · 不是玩家存档",
      resultLines: [
        "机器：小桶、罐头瓶、烘干机各 1；职业：工匠。",
        "普通品质原料完成 8 批；原售基准 1,052 金，加工增值 1,586 金，最终价值 2,638 金。",
        "剩 1 个蔓越莓（82 金）；预留 1 个不加工。",
      ],
      footnote: "数字来自工具模型/测试场景；不是玩家存档。",
    },
    features: {
      eyebrow: "功能介绍",
      title: "同时看每天做什么和整段计划值多少",
      description: "从输入到下一步，先看最关键的计划结果。",
      items: [
        {
          title: "纳入库存时间",
          body: "按数量、品质、预留量和到货日安排每批可用原料。",
        },
        {
          title: "安排多种机器",
          body: "把小桶、罐头瓶与烘干机的容量和处理周期放入同一计划。",
        },
        {
          title: "核对价值与余量",
          body: "并列查看直接出售基准、加工增值、最终价值和未处理库存。",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: "三步生成生产排程",
      description: "输入你手头的数据，再根据排程执行。",
      items: [
        {
          number: "01",
          title: "添加库存行",
          body: "填写原料、数量、品质、预留量和到货日。",
        },
        {
          number: "02",
          title: "设置加工条件",
          body: "选择机器数量、职业和 7、14 或 28 天期限。",
        },
        {
          number: "03",
          title: "查看并执行计划",
          body: "按日查看任务与机器分配，复制摘要或切换到今日清单。",
        },
      ],
    },
    comparison: {
      eyebrow: "工具对比",
      title: "综合生产排程：本站 vs. ValleyMath vs. Wiki / 社区表格",
      description:
        "按输入、机器分配和逐日结果对照；双方排程能力接近，本站页面为中英双语并衔接今日清单。",
      mobileDescription: "双方功能接近；比较双语与今日清单衔接",
      cornerLabel: "用户任务",
      products: ["本站工具", "ValleyMath", "Wiki / 社区表格"],
      rows: [
        {
          label: "如何录入库存？",
          values: [
            "手动录入多行或导入本地存档；设置品质、预留、到货日和机器。",
            "同样支持本地存档导入或手动录入库存与机器。",
            "查配方与周期；库存需自行整理。",
          ],
        },
        {
          label: "三类机器如何共享原料？",
          values: [
            "在同一库存中安排 Keg/Jar/Dehydrator，避免原料重复分配。",
            "同样共享三类机器的库存，并给出推荐加工路线。",
            "列机器规则；不按个人库存分配原料。",
          ],
          mobileValues: [
            "Keg、罐头瓶和烘干机共用库存，每件原料只分配一次。",
            "同样共享三类机器的库存，并给出推荐加工路线。",
            "列机器规则；不按个人库存分配原料。",
          ],
        },
        {
          label: "能看到哪些逐日结果？",
          values: [
            "显示 7/14/28 天装收任务、收益拆分、余料和机器利用率。",
            "同样显示逐日装收与收益；另列积压和已加工数量。",
            "提供产品/周期资料；日期和收益汇总需自行规划。",
          ],
        },
        {
          label: "哪种排程方式更适合？",
          values: [
            "要双语全周期排程，并直接查看同一计划的今日任务。",
            "要存档导入、分享链接和更多指标；也不保证全局最优。",
            "只查规则，或用社区表格自行比较作物路线。",
          ],
        },
      ],
      sourceLine: comparisonSourceLine,
      mobileSourceLine: "来源：ValleyMath Full Planner · Wiki Keg/Jar/Dehydrator · Reddit 社区表格 17zomd4",
    },
    faq: {
      eyebrow: "FAQ",
      title: "综合生产排程常见问题",
      description: "关于输入、结果和估算边界。",
      items: [
        {
          question: "可以选多长的规划期限？",
          answer: "可选 7、14 或 28 天；计划按选定窗口显示加工与收取任务。",
        },
        {
          question: "它和今日加工清单有什么区别？",
          answer: "综合排程侧重完整窗口和机器分配；今日清单侧重当前选择日期的操作与勾选。",
        },
        {
          question: "会把种子、肥料或机器制作成本计入吗？",
          answer: "不会。这里计算已输入库存的加工安排与价值，不估算种植成本或制作机器材料。",
        },
        {
          question: "排程保证与存档里的结果完全相同吗？",
          answer: "不保证。它按模型中的加工周期和早晨检查假设计算，实际操作时点可能不同。",
        },
      ],
    },
    cta: {
      title: "把整段加工期限排清楚",
      description: "加入库存和机器数量，查看每天的任务、增值和剩余原料。",
      actionLabel: "查看生产排程",
    },
  },
};

export function getProductionSchedulePageCopy(locale: PublicLocale): ProductionSchedulePageCopy {
  if (locale !== "en" && locale !== "zh-CN") {
    throw new Error(`Unsupported production schedule page locale: ${JSON.stringify(locale)}.`);
  }

  return productionSchedulePageCopyByLocale[locale];
}
