import type { PublicLocale } from "./public-locale";
import type { AfterHarvestOption, GrowthLocation } from "../tools-pages/crop-growth-form";
import type { FarmingProfession, ProcessingDeadline, SeedShop } from "../tools-pages/crop-profit-form";
import type { CropSeason, SpeedGroOption } from "../tools-pages/planting-field-values";
import type { ProfitRouteId } from "../tools-pages/profit-route";
import type { HarvestCalendarMark } from "../tools-pages/crop-harvest-calendar";
import type { ProcessingToolId } from "../tools-pages/processing/processing-tool-definition";

export type ToolsPageHeroCopy = Readonly<{
  titleBefore: string;
  accent: string;
  titleAfter: string;
  description: string;
  actionLabel: string;
}>;

export type ToolsPageCopy = Readonly<{
  home: Readonly<{
    metaTitle: string;
    metaDescription: string;
    heading: string;
    subhead: string;
    resumeHeading: string;
    currentPlanLabel: string;
    noCurrentPlan: string;
    resumeProfit: string;
    resumeProduction: string;
    importSave: string;
    scopeNote: string;
    versionLabel: string;
  }>;
  categories: Readonly<{
    planting: ToolsCategoryCopy;
    processing: ToolsProcessingCategoryCopy;
    production: ToolsCategoryCopy;
    workshop: ToolsCategoryCopy;
  }>;
  frame: Readonly<{
    breadcrumb: string;
    allTools: string;
    planting: string;
    processing: string;
    production: string;
    workshop: string;
    profitTab: string;
    growthTab: string;
    versionNote: string;
    saved: string;
    saveFailed: string;
  }>;
  profit: Readonly<{
    metaTitle: string;
    metaDescription: string;
    title: string;
    hero: ToolsPageHeroCopy;
    settingsHeading: string;
    plantingDay: string;
    farmYear: string;
    tileCount: string;
    seedSource: string;
    profession: string;
    speedGro: string;
    fertilizerCost: string;
    processingHeading: string;
    kegCount: string;
    jarCount: string;
    dehydratorCount: string;
    deadline: string;
    seasons: Readonly<Record<CropSeason, string>>;
    seedShops: Readonly<Record<SeedShop, string>>;
    professions: Readonly<Record<FarmingProfession, string>>;
    speedGros: Readonly<Record<SpeedGroOption, string>>;
    deadlines: Readonly<Record<ProcessingDeadline, string>>;
    routes: Readonly<Record<ProfitRouteId, string>>;
    firstPlace: string;
    netGold: string;
    goldPerTilePerDay: string;
    singleRouteNote: string;
    separateMachinesNote: string;
    dailyAverageNote: string;
    rankingHeading: string;
    columns: Readonly<{
      crop: string;
      harvests: string;
      expectedUnits: string;
      route: string;
      netGold: string;
    }>;
    mobileRankLabel: string;
    selectedHeading: string;
    firstHarvest: string;
    lastHarvest: string;
    seedCost: string;
    fertilizerSpent: string;
    processedUnits: string;
    backlogUnits: string;
    rawSold: string;
    noHarvestDate: string;
    viewGrowth: string;
    transferHarvest: string;
    copyTopFive: string;
    qualityNote: string;
    expectationNote: string;
    currentSeasonCutoffNote: string;
    invalidDraft: string;
    emptyRanking: string;
    copied: string;
    copyFailed: string;
    manualCopy: string;
  }>;
  planConfirm: Readonly<{
    title: string;
    lead: string;
    currentPlan: string;
    incoming: string;
    noCurrentPlan: string;
    append: string;
    appendDetail: string;
    replace: string;
    replaceDetail: string;
    keep: string;
    undo: string;
    applied: string;
    lineCount: string;
  }>;
  growth: Readonly<{
    metaTitle: string;
    metaDescription: string;
    title: string;
    hero: ToolsPageHeroCopy;
    crop: string;
    season: string;
    plantingDay: string;
    speedGro: string;
    profession: string;
    missedWatering: string;
    location: string;
    afterHarvest: string;
    seasons: Readonly<Record<CropSeason, string>>;
    speedGros: Readonly<Record<SpeedGroOption, string>>;
    professions: Readonly<{ agriculturist: string; none: string }>;
    locations: Readonly<Record<GrowthLocation, string>>;
    afterHarvestOptions: Readonly<Record<AfterHarvestOption, string>>;
    firstMature: string;
    harvestCount: string;
    lastSafePlanting: string;
    outdoorDeadlineDate: string;
    seasonCheckHarvestable: string;
    seasonCheckLate: string;
    growthDays: string;
    regrowInterval: string;
    outdoorDeadline: string;
    noneValue: string;
    calendarHeading: string;
    emptyHarvestCalendar: string;
    harvestDatesHeading: string;
    nextYear: string;
    yearsLater: string;
    marks: Readonly<Record<HarvestCalendarMark, string>>;
    shortMarks: Readonly<Record<HarvestCalendarMark, string>>;
    calendarMarkNames: Readonly<Record<HarvestCalendarMark, string>>;
    calendarEventLabel: string;
    legend: string;
    fullScheduleNote: string;
    invalidDraft: string;
    speedNote: string;
    compareProfit: string;
    copyCalendar: string;
    copied: string;
    copyFailed: string;
    manualCopy: string;
    calculationNote: string;
  }>;
}>;

type ToolsCategoryCopy = Readonly<{
  title: string;
  description: string;
  tools: readonly string[];
  enter: string;
}>;

type ToolsProcessingCategoryCopy = Readonly<{
  title: string;
  description: string;
  tools: Readonly<Record<ProcessingToolId, string>>;
  enter: string;
}>;

const toolsPageCopyByLocale: Readonly<Record<PublicLocale, ToolsPageCopy>> = {
  en: {
    home: {
      metaTitle: "Stardew Valley tools",
      metaDescription: "Start from the decision in front of you and open the planting profit or growth calendar.",
      heading: "Stardew Valley tools",
      subhead: "Start from the decision in front of you",
      resumeHeading: "Continue last settings",
      currentPlanLabel: "Current production plan",
      noCurrentPlan: "No production plan is saved on this device.",
      resumeProfit: "Continue planting settings",
      resumeProduction: "Continue production plan",
      importSave: "Import a save",
      scopeNote: "Crop profit deducts seed and fertilizer. Processing value is compared with selling the same crop raw.",
      versionLabel: "Game version 1.6.x",
    },
    categories: {
      planting: {
        title: "Planting",
        description: "Compare crop profit and harvest timing",
        tools: ["Season profit", "Growth calendar"],
        enter: "Open planting tools",
      },
      processing: {
        title: "Processing",
        description: "Compare processing profit and plan cellar aging",
        tools: {
          "basic-processing-profit": "Basic processing profit",
          "machine-comparison": "Three-machine comparison",
          "keg-processing": "Keg processing",
          "preserves-jar-processing": "Preserves jar processing",
          "dehydrator-processing": "Dehydrator processing",
          "keg-ingredient-ranking": "Keg ingredient ranking",
          "cask-aging": "Cask aging",
        },
        enter: "Open processing tools",
      },
      production: {
        title: "Production plan",
        description: "Turn inventory into a task for each day",
        tools: ["Today's processing list", "Full production schedule"],
        enter: "Open production plan",
      },
      workshop: {
        title: "Workshop",
        description: "Set the machine target, then check materials",
        tools: ["How many kegs", "Materials and resin time"],
        enter: "Open workshop tools",
      },
    },
    frame: {
      breadcrumb: "Stardew Valley tools / Planting",
      allTools: "All tools",
      planting: "Planting",
      processing: "Processing",
      production: "Production plan",
      workshop: "Workshop",
      profitTab: "Season profit",
      growthTab: "Growth calendar",
      versionNote: "1.6.x",
      saved: "Saved on this device",
      saveFailed: "Settings could not be saved on this device",
    },
    profit: {
      metaTitle: "Stardew Valley Crop Profit Calculator",
      metaDescription: "Compare Stardew Valley crop profits after seed and fertilizer costs. Adjust planting day, profession, and machine capacity to plan what to grow.",
      title: "Stardew Valley Crop Profit Calculator",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Crop Profit",
        titleAfter: "Calculator",
        description: "Compare Stardew Valley crop profits after seed and fertilizer costs. Adjust planting day, profession, and machine capacity to plan what to grow.",
        actionLabel: "Calculate crop profit",
      },
      settingsHeading: "Planting settings",
      plantingDay: "Planting day",
      farmYear: "Farm year",
      tileCount: "Tile count",
      seedSource: "Seed source",
      profession: "Profession",
      speedGro: "Speed-Gro",
      fertilizerCost: "Fertilizer cost per tile",
      processingHeading: "Processing capacity",
      kegCount: "Keg",
      jarCount: "Preserves jar",
      dehydratorCount: "Dehydrator",
      deadline: "Processing deadline",
      seasons: { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter" },
      seedShops: {
        pierre: "Pierre",
        "pierre-oasis-festival": "Include Oasis and festivals",
      },
      professions: {
        none: "No profession",
        tiller: "Tiller",
        artisan: "Artisan",
        agriculturist: "Agriculturist",
      },
      speedGros: {
        none: "None",
        "speed-gro": "Speed-Gro",
        deluxe: "Deluxe Speed-Gro",
        hyper: "Hyper Speed-Gro",
      },
      deadlines: {
        "season-end": "Season end",
        "plus-14": "Plus 14 days",
        "plus-28": "Plus 28 days",
      },
      routes: {
        "sell-raw": "Sell raw",
        keg: "Keg",
        jar: "Preserves jar",
        dehydrator: "Dehydrator",
      },
      firstPlace: "Current first place",
      netGold: "Net gold",
      goldPerTilePerDay: "Gold per tile per day",
      singleRouteNote: "This is the best single route.",
      separateMachinesNote: "Machines are calculated separately.",
      dailyAverageNote: "Daily gold per tile is averaged over the remaining days through day 28.",
      rankingHeading: "Crop ranking",
      columns: {
        crop: "Crop / seed",
        harvests: "Harvests",
        expectedUnits: "Expected units",
        route: "Route",
        netGold: "Net gold",
      },
      mobileRankLabel: "Gold per tile per day",
      selectedHeading: "Selected crop harvest",
      firstHarvest: "First harvest",
      lastHarvest: "Last harvest",
      seedCost: "Seed cost",
      fertilizerSpent: "Fertilizer cost",
      processedUnits: "Processed units",
      backlogUnits: "Remaining raw",
      rawSold: "Sold raw",
      noHarvestDate: "No harvest date",
      viewGrowth: "View growth calendar",
      transferHarvest: "Send harvest to the production plan",
      copyTopFive: "Copy top five",
      qualityNote: "Normal quality. Seed and fertilizer are already deducted.",
      expectationNote: "Random yields use the expected amount.",
      currentSeasonCutoffNote: "The profit ranking counts this season's harvests; processing can continue to the selected deadline, and the growth calendar shows later legal harvests.",
      invalidDraft: "Fix the highlighted fields to refresh this ranking.",
      emptyRanking: "No crops can be ranked with this seed source and these planting settings.",
      copied: "Copied the top five.",
      copyFailed: "Automatic copy was blocked. Select the text and copy it manually.",
      manualCopy: "Text to copy",
    },
    planConfirm: {
      title: "Send this result to the production plan",
      lead: "The current plan stays as it is until you choose how to apply this harvest.",
      currentPlan: "Current plan",
      incoming: "Incoming harvest",
      noCurrentPlan: "No plan is saved yet.",
      append: "Append to the current plan",
      appendDetail: "Keep the current machines, profession, and deadline. Add this harvest.",
      replace: "Start a new plan",
      replaceDetail: "Use these settings. The previous plan can be restored.",
      keep: "Keep the original plan",
      undo: "Undo the last import",
      applied: "Saved to this device.",
      lineCount: "lines",
    },
    growth: {
      metaTitle: "Stardew Valley Crop Growth Calculator",
      metaDescription: "Find Stardew Valley crop harvest dates with Speed-Gro and Agriculturist. Check repeat harvests and the last safe day to plant.",
      title: "Stardew Valley Crop Growth Calculator",
      hero: {
        titleBefore: "Stardew Valley",
        accent: "Crop Growth",
        titleAfter: "Calculator",
        description: "Find Stardew Valley crop harvest dates with Speed-Gro and Agriculturist. Check repeat harvests and the last safe day to plant.",
        actionLabel: "Plan crop growth",
      },
      crop: "Crop",
      season: "Season",
      plantingDay: "Planting day",
      speedGro: "Speed-Gro",
      profession: "Profession",
      missedWatering: "Missed watering days",
      location: "Location",
      afterHarvest: "After harvest",
      seasons: { spring: "Spring", summer: "Summer", fall: "Fall", winter: "Winter" },
      speedGros: {
        none: "None",
        "speed-gro": "Speed-Gro",
        deluxe: "Deluxe Speed-Gro",
        hyper: "Hyper Speed-Gro",
      },
      professions: { agriculturist: "Agriculturist", none: "None" },
      locations: {
        outdoor: "Outdoors",
        greenhouse: "Greenhouse",
        "ginger-island": "Ginger Island",
      },
      afterHarvestOptions: {
        regrow: "Regrow",
        "replant-same-day": "Replant the same day",
        "no-replant": "Don't replant",
      },
      firstMature: "First mature date",
      harvestCount: "Harvest count",
      lastSafePlanting: "Last safe planting day",
      outdoorDeadlineDate: "Outdoor harvest deadline",
      seasonCheckHarvestable: "This planting can be harvested.",
      seasonCheckLate: "This planting is past the season deadline.",
      growthDays: "Growth days",
      regrowInterval: "Regrow interval",
      outdoorDeadline: "Outdoor season deadline",
      noneValue: "None",
      calendarHeading: "Season-by-season harvest calendar",
      emptyHarvestCalendar: "No legal harvest dates in this schedule.",
      harvestDatesHeading: "Harvest dates",
      nextYear: "next year",
      yearsLater: "{count} years later",
      marks: {
        plant: "Plant",
        harvest: "Harvest",
        replant: "Harvest + replant",
        "plant-and-harvest": "Plant / harvest",
        "plant-and-replant": "Plant / harvest / replant",
      },
      shortMarks: {
        plant: "P",
        harvest: "H",
        replant: "R",
        "plant-and-harvest": "P+H",
        "plant-and-replant": "P+R",
      },
      calendarMarkNames: {
        plant: "Planting",
        harvest: "Harvest",
        replant: "Harvest and replanting",
        "plant-and-harvest": "Planting and harvest",
        "plant-and-replant": "Planting, harvest, and replanting",
      },
      calendarEventLabel: "{date}: {event}",
      legend: "P = plant · H = harvest · R = harvest + replant · P+H = plant + harvest · P+R = plant + harvest + replant.",
      fullScheduleNote: "This calendar follows legal harvests across seasons; the profit ranking counts harvests only through the selected season's end.",
      invalidDraft: "Fix the highlighted fields to refresh this calendar.",
      speedNote: "Speed changes the first maturity only. The regrow interval is separate.",
      compareProfit: "Compare planting profit",
      copyCalendar: "Copy harvest calendar",
      copied: "Copied the harvest calendar.",
      copyFailed: "Automatic copy was blocked. Select the text and copy it manually.",
      manualCopy: "Text to copy",
      calculationNote: "Calculation notes",
    },
  },
  "zh-CN": {
    home: {
      metaTitle: "Stardew Valley tools",
      metaDescription: "从你当前要做的决定开始，打开季节作物收益或生长与收获日历。",
      heading: "Stardew Valley tools",
      subhead: "从你当前要做的决定开始",
      resumeHeading: "继续上次设置",
      currentPlanLabel: "当前生产计划",
      noCurrentPlan: "本机还没有生产计划。",
      resumeProfit: "继续种植设置",
      resumeProduction: "继续生产计划",
      importSave: "导入游戏存档",
      scopeNote: "种植收益扣除种子和肥料；加工增值与直接出售同一批原料比较。",
      versionLabel: "游戏版本 1.6.x",
    },
    categories: {
      planting: {
        title: "种植规划",
        description: "比较作物收益与收获时间",
        tools: ["季节作物收益", "生长与收获日历"],
        enter: "进入种植规划",
      },
      processing: {
        title: "加工计算",
        description: "比较加工收益，安排酒窖陈酿",
        tools: {
          "basic-processing-profit": "基础加工收益",
          "machine-comparison": "三种机器比较",
          "keg-processing": "Keg 加工",
          "preserves-jar-processing": "罐头瓶加工",
          "dehydrator-processing": "烘干机加工",
          "keg-ingredient-ranking": "Keg 原料排行",
          "cask-aging": "酒窖陈酿",
        },
        enter: "进入加工计算",
      },
      production: {
        title: "生产计划",
        description: "把库存变成每天可执行的任务",
        tools: ["今日加工清单", "综合生产排程"],
        enter: "进入生产计划",
      },
      workshop: {
        title: "工坊建设",
        description: "先算机器目标，再核对材料",
        tools: ["需要多少 Keg", "材料与树脂时间"],
        enter: "进入工坊建设",
      },
    },
    frame: {
      breadcrumb: "Stardew Valley tools / 种植规划",
      allTools: "全部工具",
      planting: "种植规划",
      processing: "加工计算",
      production: "生产计划",
      workshop: "工坊建设",
      profitTab: "季节收益",
      growthTab: "生长日历",
      versionNote: "1.6.x · 计算说明",
      saved: "本机已保存",
      saveFailed: "设置未能保存在本机",
    },
    profit: {
      metaTitle: "星露谷物语作物收益计算器",
      metaDescription: "比较不同季节作物扣除种子和肥料后的净收益，结合播种日期、职业与加工机器数量，选择适合你的种植方案。",
      title: "星露谷物语作物收益计算器",
      hero: {
        titleBefore: "星露谷物语",
        accent: "作物收益",
        titleAfter: "计算器",
        description: "比较不同季节作物扣除种子和肥料后的净收益，结合播种日期、职业与加工机器数量，选择适合你的种植方案。",
        actionLabel: "计算作物收益",
      },
      settingsHeading: "种植设置",
      plantingDay: "种植日",
      farmYear: "农场年份",
      tileCount: "种植格数",
      seedSource: "种子来源",
      profession: "职业路线",
      speedGro: "生长激素",
      fertilizerCost: "每格肥料成本",
      processingHeading: "加工能力",
      kegCount: "Keg",
      jarCount: "罐头瓶",
      dehydratorCount: "烘干机",
      deadline: "加工截止",
      seasons: { spring: "春", summer: "夏", fall: "秋", winter: "冬" },
      seedShops: {
        pierre: "皮埃尔",
        "pierre-oasis-festival": "含绿洲与节日",
      },
      professions: {
        none: "无",
        tiller: "耕种",
        artisan: "工匠",
        agriculturist: "农业学家",
      },
      speedGros: {
        none: "无",
        "speed-gro": "生长激素",
        deluxe: "高级生长激素",
        hyper: "顶级生长激素",
      },
      deadlines: {
        "season-end": "季末",
        "plus-14": "再加 14 天",
        "plus-28": "再加 28 天",
      },
      routes: {
        "sell-raw": "直接出售",
        keg: "Keg",
        jar: "罐头瓶",
        dehydrator: "烘干机",
      },
      firstPlace: "当前第一名",
      netGold: "种植净收益",
      goldPerTilePerDay: "每格 / 每日",
      singleRouteNote: "此处比较最佳单一路线。",
      separateMachinesNote: "机器分别计算；混合分配可进入生产计划。",
      dailyAverageNote: "每格每日收益按剩余种植季天数平均，统计到第 28 天。",
      rankingHeading: "可种植作物排名",
      columns: {
        crop: "作物 / 种子",
        harvests: "收获",
        expectedUnits: "预期数量",
        route: "路线",
        netGold: "净收益",
      },
      mobileRankLabel: "每格每日",
      selectedHeading: "选中作物的收获安排",
      firstHarvest: "首收日期",
      lastHarvest: "末收日期",
      seedCost: "种子支出",
      fertilizerSpent: "肥料支出",
      processedUnits: "已加工数量",
      backlogUnits: "剩余原料",
      rawSold: "直接出售原料",
      noHarvestDate: "没有收获日",
      viewGrowth: "查看生长日历",
      transferHarvest: "把收获转入生产计划",
      copyTopFive: "复制前五名",
      qualityNote: "原料按普通品质；种子与肥料已扣除。",
      expectationNote: "随机产量使用期望值。",
      currentSeasonCutoffNote: "收益排名只统计本季收获；加工可按所选截止日继续，生长日历会显示之后合法的收获。",
      invalidDraft: "请修正标出的输入，再查看更新后的排名。",
      emptyRanking: "当前种子来源和种植条件下，没有可参与排名的作物。",
      copied: "已复制前五名。",
      copyFailed: "自动复制未获允许。请选中下面的文本手动复制。",
      manualCopy: "可手动复制的文本",
    },
    planConfirm: {
      title: "把这组结果转入生产计划",
      lead: "当前计划先保留，选择处理方式后再应用。",
      currentPlan: "当前计划",
      incoming: "即将转入",
      noCurrentPlan: "还没有已保存的计划。",
      append: "追加到当前计划",
      appendDetail: "保留当前机器、职业和期限，只加入这次收获。",
      replace: "作为新计划",
      replaceDetail: "采用来源设置。上一计划可以撤销恢复。",
      keep: "保留原计划",
      undo: "撤销上次导入",
      applied: "已写入本机。",
      lineCount: "行",
    },
    growth: {
      metaTitle: "星露谷物语作物生长计算器与收获日历",
      metaDescription: "根据播种日期、生长激素、职业和种植地点，计算作物成熟日期、重复收获时间与最晚安全播种日，安排你的种植日历。",
      title: "星露谷物语作物生长计算器与收获日历",
      hero: {
        titleBefore: "星露谷物语",
        accent: "作物生长",
        titleAfter: "计算器与收获日历",
        description: "根据播种日期、生长激素、职业和种植地点，计算作物成熟日期、重复收获时间与最晚安全播种日，安排你的种植日历。",
        actionLabel: "规划作物生长",
      },
      crop: "作物",
      season: "种植季节",
      plantingDay: "种植日",
      speedGro: "生长激素",
      profession: "职业",
      missedWatering: "每次种植漏浇水",
      location: "种植地点",
      afterHarvest: "收获后",
      seasons: { spring: "春", summer: "夏", fall: "秋", winter: "冬" },
      speedGros: {
        none: "无",
        "speed-gro": "生长激素",
        deluxe: "高级生长激素",
        hyper: "顶级生长激素",
      },
      professions: { agriculturist: "农业学家", none: "无" },
      locations: {
        outdoor: "室外",
        greenhouse: "温室",
        "ginger-island": "姜岛",
      },
      afterHarvestOptions: {
        regrow: "自然再生",
        "replant-same-day": "当天补种",
        "no-replant": "不补种",
      },
      firstMature: "首次成熟",
      harvestCount: "收获次数",
      lastSafePlanting: "最晚安全播种",
      outdoorDeadlineDate: "室外收获截止日",
      seasonCheckHarvestable: "当前种植安排可收获。",
      seasonCheckLate: "晚于截止日。可以改种植日，或改到温室、姜岛。",
      growthDays: "生长天数",
      regrowInterval: "再生间隔",
      outdoorDeadline: "室外季节截止日",
      noneValue: "无",
      calendarHeading: "按季节排列的收获日历",
      emptyHarvestCalendar: "此安排下没有合法的收获日期。",
      harvestDatesHeading: "收获日期",
      nextYear: "次年",
      yearsLater: "{count} 年后",
      marks: {
        plant: "种",
        harvest: "收",
        replant: "收获并补种",
        "plant-and-harvest": "种 收",
        "plant-and-replant": "种 收获并补种",
      },
      shortMarks: {
        plant: "种",
        harvest: "收",
        replant: "补",
        "plant-and-harvest": "种收",
        "plant-and-replant": "种补",
      },
      calendarMarkNames: {
        plant: "播种",
        harvest: "收获",
        replant: "收获并补种",
        "plant-and-harvest": "播种并收获",
        "plant-and-replant": "播种、收获并补种",
      },
      calendarEventLabel: "{date}：{event}",
      legend: "种 = 播种 · 收 = 收获 · 补 = 收获并补种；种收 = 同日播种并收获，种补 = 同日播种、收获并补种。",
      fullScheduleNote: "此日历会跨季节显示仍能合法收获的日期；收益排名的收获数量只统计到所选季节结束。",
      invalidDraft: "请修正标出的输入，再查看更新后的日历。",
      speedNote: "生长加速影响首次成熟；再生间隔单独显示。",
      compareProfit: "比较种植收益",
      copyCalendar: "复制收获日历",
      copied: "已复制收获日历。",
      copyFailed: "自动复制未获允许。请选中下面的文本手动复制。",
      manualCopy: "可手动复制的文本",
      calculationNote: "计算说明",
    },
  },
};

export function getToolsPageCopy(locale: PublicLocale): ToolsPageCopy {
  const copy = toolsPageCopyByLocale[locale];
  if (copy === undefined) {
    throw new Error(`Unsupported tools page locale. Received: ${JSON.stringify(locale)}.`);
  }

  return copy;
}
