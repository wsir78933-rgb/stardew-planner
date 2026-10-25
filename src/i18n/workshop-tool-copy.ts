import type { PublicLocale } from "./public-locale";

export type WorkshopToolCopy = Readonly<{
  navigation: Readonly<{
    label: string;
    kegCapacity: string;
    kegMaterials: string;
  }>;
  resetConfirmation: Readonly<{
    prompt: string;
    confirm: string;
    cancel: string;
  }>;
  kegCapacity: Readonly<{
    title: string;
    description: string;
    settingsTitle: string;
    scenarios: Readonly<{
      title: string;
      currentStock: string;
      ongoingProduction: string;
      currentStockHelp: string;
      ongoingProductionHelp: string;
      hiddenOngoingDraft: string;
    }>;
    inputs: Readonly<{
      ingredient: string;
      quantity: string;
      quantityPerHarvest: string;
      deadline: string;
      existingKegs: string;
      harvestInterval: string;
    }>;
    inputHelp: Readonly<{
      quantity: string;
      quantityPerHarvest: string;
      deadline: string;
      harvestInterval: string;
    }>;
    resultsTitle: string;
    recipeSummary: (units: string, mornings: string, days: string) => string;
    singleHarvestTitle: string;
    kegsRequired: string;
    additionalKegs: string;
    oneKegCapacity: string;
    currentKegCapacity: string;
    rawUnitsLeft: (units: string) => string;
    oneHarvestCannotFinish: (days: string) => string;
    noCompleteBatch: (units: string, batchSize: string) => string;
    longTermTitle: string;
    longTermDescription: string;
    shedSpaceTitle: string;
    shedSpaceTarget: string;
    standardShed: string;
    largeShed: string;
    shedSpaceSummary: (shedCount: string, emptySpaces: string) => string;
    shedSpaceNote: string;
    steadyKegsRequired: string;
    averageCapacity: string;
    averageBacklogGrowth: string;
    completeBatchesUnit: string;
    rawUnitsUnit: string;
    additionalCount: (count: string) => string;
    quantityBreakdown: (batches: string, remainder: string) => string;
    currentStockPlan: string;
    oneHarvestMaterials: string;
    steadyStateMaterials: string;
    copyResult: string;
    copied: string;
    copyFailed: string;
    manualCopy: string;
    saveEmpty: string;
    saveSuccess: string;
    saveFailed: string;
    invalidSavedSettings: string;
    reset: string;
    numericError: (field: string, value: string) => string;
    invalidCalculation: string;
  }>;
  kegMaterials: Readonly<{
    title: string;
    description: string;
    settingsTitle: string;
    inventoryTitle: string;
    inputs: Readonly<{
      targetKegs: string;
      existingKegs: string;
      wood: string;
      copperBars: string;
      ironBars: string;
      oakResin: string;
      matureOakTappers: string;
      tapperType: string;
      waitingDays: string;
    }>;
    tapperTypes: Readonly<{ regular: string; heavy: string }>;
    inputHelp: Readonly<{
      recipe: string;
      resin: string;
      exclusions: string;
    }>;
    resultsTitle: string;
    shortagesTitle: string;
    noShortages: string;
    detailsTitle: string;
    kegsToBuild: string;
    buildableNow: string;
    remainingKegs: string;
    bottleneck: string;
    noBottleneck: string;
    material: string;
    perKeg: string;
    targetNeed: string;
    currentInventory: string;
    mobileNeedAndInventory: string;
    shortage: string;
    remainder: string;
    materialNames: Readonly<Record<"wood" | "copperBar" | "ironBar" | "oakResin", string>>;
    resinTitle: string;
    resinCycle: (days: string, cycles: string) => string;
    resinProduced: string;
    resinShortageAtDeadline: string;
    daysUntilEnough: string;
    tappersNeededByDeadline: string;
    cannotMeetDeadline: string;
    noResinNeeded: string;
    noCurrentTappers: string;
    handoffApplied: (source: string) => string;
    sourceNames: Readonly<{ singleHarvest: string; steadyState: string }>;
    copyMaterials: string;
    copyResult: string;
    copied: string;
    copyFailed: string;
    manualCopy: string;
    saveEmpty: string;
    saveSuccess: string;
    saveFailed: string;
    invalidSavedSettings: string;
    invalidUrl: string;
    reset: string;
    numericError: (field: string, value: string) => string;
    invalidCalculation: string;
  }>;
}>;

const workshopToolCopy: Readonly<Record<PublicLocale, WorkshopToolCopy>> = {
  en: {
    navigation: {
      label: "Workshop tools",
      kegCapacity: "Keg capacity",
      kegMaterials: "Materials and resin",
    },
    resetConfirmation: {
      prompt: "Replace this device's saved settings with the starting values?",
      confirm: "Reset now",
      cancel: "Keep settings",
    },
    kegCapacity: {
      title: "How many Kegs do I need?",
      description:
        "Estimate Kegs for the stock you have now, or compare capacity when the same harvest returns on a regular interval. Recipe remainders stay raw.",
      settingsTitle: "Harvest and processing settings",
      scenarios: {
        title: "What are you planning?",
        currentStock: "Process current stock",
        ongoingProduction: "Ongoing production",
        currentStockHelp: "Use the inventory on hand and a processing window. This estimates one delivery only.",
        ongoingProductionHelp: "Use the same quantity at each harvest to compare long-run average throughput. This is not a day-by-day schedule.",
        hiddenOngoingDraft: "Your harvest-interval draft is kept while this scenario is selected. It does not affect the current-stock estimate; switch to Ongoing production to review it.",
      },
      inputs: {
        ingredient: "Ingredient",
        quantity: "Current stock quantity",
        quantityPerHarvest: "Quantity per harvest",
        deadline: "Processing window",
        existingKegs: "Kegs already available",
        harvestInterval: "Days between repeated harvests",
      },
      inputHelp: {
        quantity: "The amount available for this one stock delivery.",
        quantityPerHarvest: "The estimate assumes the same amount is available at each harvest.",
        deadline: "Elapsed days from stock arriving; a batch finishing on the last day counts.",
        harvestInterval: "Used for long-run average throughput only. The machine test uses current stock on day 0.",
      },
      resultsTitle: "Keg capacity estimate",
      recipeSummary: (units, mornings, days) =>
        `One recipe batch uses ${units} ingredient units and takes ${mornings} morning${mornings === "1" ? "" : "s"} (${days} game minutes).`,
      singleHarvestTitle: "One stock delivery",
      kegsRequired: "Kegs needed to finish all complete batches",
      additionalKegs: "Additional Kegs needed",
      oneKegCapacity: "One Keg completes by the deadline",
      currentKegCapacity: "Your current Kegs complete by the deadline",
      rawUnitsLeft: (units) => `${units} raw units left`,
      oneHarvestCannotFinish: (days) =>
        `The processing cycle takes longer than this ${days}-day window. More Kegs cannot shorten one batch; choose a longer window.`,
      noCompleteBatch: (units, batchSize) =>
        `${units} units do not fill one ${batchSize}-unit recipe batch, so they remain raw. No Keg is needed for this stock.`,
      longTermTitle: "Long-run steady throughput",
      longTermDescription:
        "Average capacity is shown per harvest interval. It smooths output across repeated cycles; it is not a day-by-day loading schedule.",
      shedSpaceTitle: "Shed space reference",
      shedSpaceTarget: "Keg target",
      standardShed: "Standard Shed (67 Kegs)",
      largeShed: "Big Shed (137 Kegs)",
      shedSpaceSummary: (shedCount, emptySpaces) =>
        `${shedCount} shed${shedCount === "1" ? "" : "s"}; ${emptySpaces} empty space${emptySpaces === "1" ? "" : "s"}`,
      shedSpaceNote:
        "Counts assume optimized mouse-and-keyboard layouts. Corner spots may be hard to reach with a controller; walkways or mixing other machines reduce usable Keg spaces.",
      steadyKegsRequired: "Kegs needed for long-run throughput",
      averageCapacity: "Long-run average recipe batches per harvest interval",
      averageBacklogGrowth: "Average raw backlog growth per harvest interval",
      completeBatchesUnit: "complete batches",
      rawUnitsUnit: "raw units",
      additionalCount: (count) => `${count} additional`,
      quantityBreakdown: (batches, remainder) =>
        `${batches} complete recipe batches; ${remainder} unit${remainder === "1" ? "" : "s"} below a full batch.`,
      currentStockPlan: "Test current stock with existing machines",
      oneHarvestMaterials: "Materials for this one-time Keg target",
      steadyStateMaterials: "Materials for the long-run Keg target",
      copyResult: "Copy estimate",
      copied: "Estimate copied.",
      copyFailed: "Copy failed. Select the result text below and copy it manually.",
      manualCopy: "Copy result manually",
      saveEmpty: "Settings are stored on this device when you change them.",
      saveSuccess: "Settings saved on this device.",
      saveFailed: "Settings could not be saved on this device.",
      invalidSavedSettings: "Saved settings could not be read. Defaults are shown; reset to replace the saved values.",
      reset: "Reset settings",
      numericError: (field, value) => `${field} must be a whole number in the allowed range. Received: ${value}.`,
      invalidCalculation: "This input combination cannot be calculated. Check the highlighted values.",
    },
    kegMaterials: {
      title: "Keg materials and Oak Resin timing",
      description:
        "See what is missing for your Keg target and whether mature tapped Oak trees can supply the remaining Oak Resin by your waiting deadline.",
      settingsTitle: "Keg target and current resources",
      inventoryTitle: "Materials currently on hand",
      inputs: {
        targetKegs: "Target Keg count",
        existingKegs: "Kegs already built",
        wood: "Wood in inventory",
        copperBars: "Copper Bars in inventory",
        ironBars: "Iron Bars in inventory",
        oakResin: "Oak Resin in inventory",
        matureOakTappers: "Mature Oak trees with Tappers",
        tapperType: "Tapper type",
        waitingDays: "Days to wait for Oak Resin",
      },
      tapperTypes: { regular: "Regular Tapper", heavy: "Heavy Tapper" },
      inputHelp: {
        recipe: "Each Keg needs 30 Wood, 1 Copper Bar, 1 Iron Bar, and 1 Oak Resin.",
        resin: "A new cycle starts now. Only complete Tapper cycles by the deadline are counted.",
        exclusions: "Ore smelting, crafting Tappers, and growing Oak trees are not simulated.",
      },
      resultsTitle: "Materials and resin estimate",
      shortagesTitle: "Material shortfalls in current inventory",
      noShortages: "Your current inventory covers the materials for this Keg target.",
      detailsTitle: "Material breakdown",
      kegsToBuild: "Kegs still to build",
      buildableNow: "Kegs buildable from current inventory",
      remainingKegs: "Target Kegs still missing after building now",
      bottleneck: "Current material bottleneck",
      noBottleneck: "No materials are short for this target",
      material: "Material",
      perKeg: "Per Keg",
      targetNeed: "Needed for target",
      currentInventory: "In inventory",
      mobileNeedAndInventory: "Needed / on hand",
      shortage: "Short now",
      remainder: "Left after building now",
      materialNames: {
        wood: "Wood",
        copperBar: "Copper Bar",
        ironBar: "Iron Bar",
        oakResin: "Oak Resin",
      },
      resinTitle: "Oak Resin by the deadline",
      resinCycle: (days, cycles) => `${cycles} complete ${days}-day Tapper cycle${cycles === "1" ? "" : "s"}.`,
      resinProduced: "Oak Resin produced by deadline",
      resinShortageAtDeadline: "Oak Resin still missing at deadline",
      daysUntilEnough: "Days until enough resin",
      tappersNeededByDeadline: "Mature tapped Oaks needed by this deadline",
      cannotMeetDeadline: "No complete resin cycle fits before this deadline.",
      noResinNeeded: "No additional Oak Resin is needed for this target.",
      noCurrentTappers: "No mature Oak trees with Tappers are available; the resin wait cannot be estimated.",
      handoffApplied: (source) => `Loaded the ${source} Keg target from the capacity calculator.`,
      sourceNames: { singleHarvest: "one-time", steadyState: "long-run" },
      copyMaterials: "Copy materials list",
      copyResult: "Copy resin estimate",
      copied: "Result copied.",
      copyFailed: "Copy failed. Select the result text below and copy it manually.",
      manualCopy: "Copy result manually",
      saveEmpty: "Settings are stored on this device when you change them.",
      saveSuccess: "Settings saved on this device.",
      saveFailed: "Settings could not be saved on this device.",
      invalidSavedSettings: "Saved settings could not be read. Defaults are shown; reset to replace the saved values.",
      invalidUrl: "The Keg-target link is invalid. Review the settings below or return to the calculator.",
      reset: "Reset settings",
      numericError: (field, value) => `${field} must be a whole number of 0 or more. Received: ${value}.`,
      invalidCalculation: "This input combination cannot be calculated. Check the highlighted values.",
    },
  },
  "zh-CN": {
    navigation: {
      label: "工坊工具",
      kegCapacity: "小桶数量",
      kegMaterials: "材料与树脂",
    },
    resetConfirmation: {
      prompt: "要将此设备保存的设置替换为初始值吗？",
      confirm: "确认重置",
      cancel: "保留设置",
    },
    kegCapacity: {
      title: "需要多少个小桶？",
      description:
        "可以按当前库存估算所需小桶，也可以按固定收获间隔比较长期产能。凑不满完整配方的余料会保留为原料。",
      settingsTitle: "收获与加工设置",
      scenarios: {
        title: "你要估算哪种情况？",
        currentStock: "处理当前库存",
        ongoingProduction: "持续生产",
        currentStockHelp: "按手头库存和加工期限估算，只计算这一次到货。",
        ongoingProductionHelp: "假设每次收获数量相同，用于比较长期平均产能；不是逐日装桶计划。",
        hiddenOngoingDraft: "已保留你填写的收获间隔草稿。它不影响当前库存估算；切换到“持续生产”可继续检查。",
      },
      inputs: {
        ingredient: "加工原料",
        quantity: "当前库存数量",
        quantityPerHarvest: "每次收获数量",
        deadline: "加工期限",
        existingKegs: "现有小桶数",
        harvestInterval: "重复收获间隔天数",
      },
      inputHelp: {
        quantity: "这次到货可用于加工的库存数量。",
        quantityPerHarvest: "估算会假设每次收获都提供相同数量。",
        deadline: "从库存到货起计算；恰好在最后一天完成的批次也计入。",
        harvestInterval: "仅用于长期平均产能。机器测试只把当前库存作为第0天到货。",
      },
      resultsTitle: "小桶数量估算",
      recipeSummary: (units, mornings, days) => `每批配方需要${units}个原料单位，耗时${mornings}个清晨（游戏内${days}分钟）。`,
      singleHarvestTitle: "单次库存",
      kegsRequired: "按期完成全部完整批次所需小桶",
      additionalKegs: "还需增加小桶",
      oneKegCapacity: "单个小桶在期限内可完成",
      currentKegCapacity: "现有小桶在期限内可完成",
      rawUnitsLeft: (units) => `余下${units}个原料单位`,
      oneHarvestCannotFinish: (days) =>
        `加工周期长于${days}天期限。增加小桶不会缩短单批加工时间，请延长期限。`,
      noCompleteBatch: (units, batchSize) =>
        `${units}个原料凑不满${batchSize}个一批的配方，会保留为原料；这批库存不需要小桶。`,
      longTermTitle: "长期稳定产能",
      longTermDescription:
        "按每个收获间隔显示平均产能，用来比较长期吞吐；这不是逐日装桶计划。",
      shedSpaceTitle: "棚屋空间参考",
      shedSpaceTarget: "小桶目标",
      standardShed: "普通棚屋（67个小桶位）",
      largeShed: "大型棚屋（137个小桶位）",
      shedSpaceSummary: (shedCount, emptySpaces) => `${shedCount}栋棚屋；空余${emptySpaces}个小桶位`,
      shedSpaceNote:
        "按鼠标键盘优化布局估算。手柄操作时角落位置可能难以到达；保留通道或混放其他机器会减少可用小桶位。",
      steadyKegsRequired: "满足长期产能所需小桶",
      averageCapacity: "每个收获间隔的长期平均配方批次产能",
      averageBacklogGrowth: "每个收获间隔平均新增的原料积压",
      completeBatchesUnit: "个完整批次",
      rawUnitsUnit: "个原料单位",
      additionalCount: (count) => `还需${count}个`,
      quantityBreakdown: (batches, remainder) => `${batches}个完整配方批次；另有${remainder}个单位凑不满一批。`,
      currentStockPlan: "用现有机器测试当前库存",
      oneHarvestMaterials: "查看本次目标所需材料",
      steadyStateMaterials: "查看长期目标所需材料",
      copyResult: "复制估算结果",
      copied: "已复制估算结果。",
      copyFailed: "复制失败。请选中下方结果文本并手动复制。",
      manualCopy: "手动复制结果",
      saveEmpty: "更改设置后会保存在此设备。",
      saveSuccess: "设置已保存在此设备。",
      saveFailed: "设置无法保存在此设备。",
      invalidSavedSettings: "无法读取已保存的设置，当前显示默认值；重置后会替换保存内容。",
      reset: "重置设置",
      numericError: (field, value) => `${field}必须是范围内的整数。收到：${value}。`,
      invalidCalculation: "当前组合无法计算，请检查标出的数值。",
    },
    kegMaterials: {
      title: "小桶材料与橡树树脂时间",
      description:
        "查看目标小桶数量还缺哪些材料，以及已成熟且装有采集器的橡树能否在等待期限内补足树脂。",
      settingsTitle: "小桶目标与当前资源",
      inventoryTitle: "已有材料库存",
      inputs: {
        targetKegs: "目标小桶数",
        existingKegs: "已建成小桶数",
        wood: "背包木材",
        copperBars: "背包铜锭",
        ironBars: "背包铁锭",
        oakResin: "背包橡树树脂",
        matureOakTappers: "已成熟且装有采集器的橡树",
        tapperType: "采集器类型",
        waitingDays: "等待树脂的天数",
      },
      tapperTypes: { regular: "普通采集器", heavy: "重型采集器" },
      inputHelp: {
        recipe: "每个小桶需要30木材、1铜锭、1铁锭和1橡树树脂。",
        resin: "从现在开始新一轮采集，只计算截止日前完成的整轮周期。",
        exclusions: "不模拟矿石冶炼、采集器制作或橡树生长。",
      },
      resultsTitle: "材料与树脂估算",
      shortagesTitle: "当前库存中的材料缺口",
      noShortages: "当前库存已备齐此小桶目标所需的材料。",
      detailsTitle: "材料明细",
      kegsToBuild: "还需建造的小桶",
      buildableNow: "按当前库存可立即建造",
      remainingKegs: "立即建造后仍缺小桶",
      bottleneck: "当前材料瓶颈",
      noBottleneck: "当前目标没有材料缺口",
      material: "材料",
      perKeg: "每个小桶",
      targetNeed: "目标所需",
      currentInventory: "当前库存",
      mobileNeedAndInventory: "需要 / 已有",
      shortage: "当前缺少",
      remainder: "立即建造后剩余",
      materialNames: {
        wood: "木材",
        copperBar: "铜锭",
        ironBar: "铁锭",
        oakResin: "橡树树脂",
      },
      resinTitle: "截止日前的橡树树脂",
      resinCycle: (days, cycles) => `可完成${cycles}轮${days}天采集周期。`,
      resinProduced: "截止日前可采集树脂",
      resinShortageAtDeadline: "截止时仍缺树脂",
      daysUntilEnough: "集齐所需树脂还要几天",
      tappersNeededByDeadline: "期限内所需成熟采集橡树数",
      cannotMeetDeadline: "截止日前无法完成一轮树脂采集周期。",
      noResinNeeded: "此目标不再需要橡树树脂。",
      noCurrentTappers: "没有已成熟且装有采集器的橡树，无法估算树脂等待时间。",
      handoffApplied: (source) => `已载入小桶数量工具传来的${source}目标。`,
      sourceNames: { singleHarvest: "单次", steadyState: "长期" },
      copyMaterials: "复制材料清单",
      copyResult: "复制树脂估算",
      copied: "已复制结果。",
      copyFailed: "复制失败。请选中下方结果文本并手动复制。",
      manualCopy: "手动复制结果",
      saveEmpty: "更改设置后会保存在此设备。",
      saveSuccess: "设置已保存在此设备。",
      saveFailed: "设置无法保存在此设备。",
      invalidSavedSettings: "无法读取已保存的设置，当前显示默认值；重置后会替换保存内容。",
      invalidUrl: "小桶目标链接无效。请检查下方设置，或返回数量计算器。",
      reset: "重置设置",
      numericError: (field, value) => `${field}必须是大于或等于0的整数。收到：${value}。`,
      invalidCalculation: "当前组合无法计算，请检查标出的数值。",
    },
  },
};

export function getWorkshopToolCopy(locale: PublicLocale): WorkshopToolCopy {
  const copy = workshopToolCopy[locale];
  if (copy === undefined) {
    throw new Error(`Workshop tool copy is not available. Received locale=${JSON.stringify(locale)}.`);
  }
  return copy;
}
