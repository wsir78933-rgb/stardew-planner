import type { PublicLocale } from "./public-locale";

export type ProductionToolCopy = Readonly<{
  title: Readonly<{ today: string; schedule: string }>;
  plannerTitle: string;
  description: string;
  navigation: Readonly<{ today: string; schedule: string; backToToday: string }>;
  settings: Readonly<{
    title: string;
    editSummary: string;
    collapseSummary: string;
    summary: (inventoryRows: number, deadline: string, profession: string, machines: string) => string;
    horizon: string;
    profession: string;
    machineCounts: string;
    machines: Readonly<{ keg: string; jar: string; dehydrator: string }>;
    professions: Readonly<{ none: string; tiller: string; artisan: string }>;
    deadlines: Readonly<{ 7: string; 14: string; 28: string }>;
  }>;
  inventory: Readonly<{
    title: string;
    add: string;
    remove: string;
    item: string;
    quantity: string;
    quality: string;
    qualities: Readonly<{ normal: string; silver: string; gold: string; iridium: string }>;
    reserved: string;
    reservedHelp: string;
    availableDay: string;
    availableDayHelp: string;
    bearsKnowledge: string;
    bearsKnowledgeHelp: string;
    coconutSource: string;
    coconutSources: Readonly<{ foraged: string; purchasedOrGifted: string }>;
  }>;
  actions: Readonly<{
    startEmpty: string;
    loadExample: string;
    importSave: string;
    copyToday: string;
    copySummary: string;
    copyPlanLink: string;
    previousDay: string;
    nextDay: string;
    showSchedule: string;
    reviewTasks: string;
    undoPlanChange: string;
    share: string;
    more: string;
  }>;
  status: Readonly<{
    saved: string;
    saving: string;
    saveFailed: string;
    copyFailed: string;
    copySucceeded: string;
    changedNeedsReview: string;
    reviewConfirmed: string;
    taskCompleted: string;
    taskIncomplete: string;
  }>;
  today: Readonly<{
    title: string;
    summaryTitle: string;
    summaryHighlights: (addedValue: string, finalValue: string, rawSaleBaseline: string, utilization: string) => string;
    currentDay: string;
    dayOfWindow: (day: number, horizon: number) => string;
    loadTitle: string;
    collectTitle: string;
    waitingTitle: string;
    noLoad: string;
    noCollect: string;
    allComplete: string;
    noInventory: string;
    noMachines: string;
    changedPrompt: string;
    taskReviewPrompt: string;
    checkTask: (task: string) => string;
    uncheckTask: (task: string) => string;
  }>;
  schedule: Readonly<{
    title: string;
    addedValue: string;
    finalValue: string;
    rawSaleBaseline: string;
    reservedStock: string;
    machineUtilization: string;
    allocationTitle: string;
    allocationColumns: Readonly<{
      inventory: string;
      machine: string;
      product: string;
      quantity: string;
      batches: string;
      addedValue: string;
      leftover: string;
    }>;
    dailyTitle: string;
    dailyColumns: Readonly<{
      day: string;
      action: string;
      machine: string;
      item: string;
      quantity: string;
      collectDay: string;
    }>;
    load: string;
    collect: string;
    planState: string;
    executable: string;
    assumptions: string;
    noInventory: string;
    noMachines: string;
    noCompleteBatch: string;
    noPositiveValue: string;
    noSchedule: string;
  }>;
  import: Readonly<{
    title: string;
    chooseFile: string;
    chooseFolder: string;
    farm: string;
    preview: string;
    inventoryRows: string;
    machines: string;
    profession: string;
    warnings: string;
    unsupportedItems: string;
    sourceName: string;
    append: string;
    replace: string;
    keep: string;
    cancel: string;
    fileRequired: string;
    previewFailure: string;
    confirmed: string;
    oldCropPlan: string;
    oldPlanDescription: string;
    reviewOldPlan: string;
    resetInvalidPlan: string;
    selectedFiles: string;
    farmName: string;
    farmDetails: string;
    selectMapping: string;
    noInventoryDetected: string;
    noSaveGameFiles: string;
    skippedNonSaveFiles: (fileNames: readonly string[]) => string;
    chooseFarm: string;
    unmappedItem: (item: string, objectId: string, quantity: number) => string;
    formatReviewMessage: (message: string) => string;
  }>;
  legacy: Readonly<{
    title: string;
    description: string;
    expectedQuantity: string;
    harvestWindow: string;
    actualQuantity: string;
    actualAvailableDay: string;
    addConfirmed: string;
    unsupportedCrop: string;
    noSavedPlan: string;
    reviewFailure: string;
  }>;
  share: Readonly<{
    title: string;
    linkIncludesInventory: string;
    copyLink: string;
    manualCopy: string;
    incomingTitle: string;
    incomingDescription: string;
    reviewIncoming: string;
    applyIncoming: string;
    appendIncoming: string;
    keepIncoming: string;
  }>;
  validation: Readonly<{
    invalidNumber: (field: string, received: string) => string;
    reservedExceedsQuantity: (received: string) => string;
    arrivalOutsideHorizon: (received: string, horizon: number) => string;
    invalidSelection: (field: string, received: string) => string;
    fixFields: string;
  }>;
}>;

const productionToolCopy: Readonly<Record<PublicLocale, ProductionToolCopy>> = {
  en: {
    title: { today: "Today's processing list", schedule: "Production schedule" },
    plannerTitle: "Daily tasks",
    description:
      "Plan what to load and collect from the inventory you have, with reserved stock and arrival days kept visible.",
    navigation: {
      today: "Today’s tasks",
      schedule: "Full schedule",
      backToToday: "Back to today’s tasks",
    },
    settings: {
      title: "Plan settings",
      editSummary: "Edit settings and inventory",
      collapseSummary: "Hide settings",
      summary: (inventoryRows, deadline, profession, machines) => `${inventoryRows} inventory rows · ${deadline} · ${profession} · ${machines}`,
      horizon: "Processing window",
      profession: "Profession",
      machineCounts: "Available machines",
      machines: { keg: "Keg", jar: "Preserves Jar", dehydrator: "Dehydrator" },
      professions: { none: "No profession bonus", tiller: "Tiller", artisan: "Artisan" },
      deadlines: { 7: "7 days", 14: "14 days", 28: "28 days" },
    },
    inventory: {
      title: "Inventory",
      add: "Add inventory row",
      remove: "Remove row",
      item: "Item",
      quantity: "Quantity",
      quality: "Quality",
      qualities: { normal: "Normal", silver: "Silver", gold: "Gold", iridium: "Iridium" },
      reserved: "Reserved",
      reservedHelp: "Reserved units stay out of processing and remain available to you.",
      availableDay: "Available day",
      availableDayHelp: "Day 0 means the stock is available now; later stock joins on that day.",
      bearsKnowledge: "Bear’s Knowledge",
      bearsKnowledgeHelp: "Apply this saved-file bonus only to eligible berries.",
      coconutSource: "Coconut source",
      coconutSources: { foraged: "Foraged", purchasedOrGifted: "Purchased or gifted" },
    },
    actions: {
      startEmpty: "Start with an empty plan",
      loadExample: "Load example",
      importSave: "Import a game save",
      copyToday: "Copy today’s list",
      copySummary: "Copy result summary",
      copyPlanLink: "Copy full plan link",
      previousDay: "Previous day",
      nextDay: "Next day",
      showSchedule: "View full schedule",
      reviewTasks: "Reviewed; continue this list",
      undoPlanChange: "Undo last plan change",
      share: "Share this plan",
      more: "More actions",
    },
    status: {
      saved: "Plan saved on this device.",
      saving: "Saving this plan…",
      saveFailed: "This plan could not be saved on this device. Your current calculation remains available.",
      copyFailed: "Copy failed. Select the text below and copy it manually.",
      copySucceeded: "Copied.",
      changedNeedsReview: "Plan inputs changed. Review the updated tasks before continuing the old checklist.",
      reviewConfirmed: "The updated task list is ready.",
      taskCompleted: "Mark task complete",
      taskIncomplete: "Mark task incomplete",
    },
    today: {
      title: "Today’s work",
      summaryTitle: "Plan summary",
      summaryHighlights: (addedValue, finalValue, rawSaleBaseline, utilization) => `Added ${addedValue} · Final ${finalValue} · Raw ${rawSaleBaseline} · ${utilization} utilization`,
      currentDay: "Current day",
      dayOfWindow: (day, horizon) => `Day ${day} of ${horizon}`,
      loadTitle: "Load machines",
      collectTitle: "Collect finished goods",
      waitingTitle: "Inventory still waiting",
      noLoad: "No machines need loading today.",
      noCollect: "Nothing is ready to collect today.",
      allComplete: "All planned processing is complete.",
      noInventory: "Add an inventory row or load the example plan to see today’s tasks.",
      noMachines: "No machines are available. Stock stays unprocessed and keeps its raw-sale value.",
      changedPrompt: "The plan changed after this list was created. Review the new tasks before continuing.",
      taskReviewPrompt: "Review the updated schedule to continue with its checklist.",
      checkTask: (task) => `Mark ${task} complete`,
      uncheckTask: (task) => `Mark ${task} incomplete`,
    },
    schedule: {
      title: "Recommended allocation and daily schedule",
      addedValue: "Processing added value",
      finalValue: "Final sale value",
      rawSaleBaseline: "Raw-sale baseline",
      reservedStock: "Reserved stock",
      machineUtilization: "Machine utilization",
      allocationTitle: "Recommended allocation",
      allocationColumns: {
        inventory: "Inventory item",
        machine: "Machine",
        product: "Product",
        quantity: "Units",
        batches: "Batches",
        addedValue: "Added value",
        leftover: "Raw left",
      },
      dailyTitle: "Daily schedule",
      dailyColumns: {
        day: "Day",
        action: "Action",
        machine: "Machine",
        item: "Item / product",
        quantity: "Quantity",
        collectDay: "Collect day",
      },
      load: "Load",
      collect: "Collect",
      planState: "Plan status",
      executable: "Executable plan",
      assumptions:
        "The plan uses one collection and machine reload opportunity each morning. It does not schedule exact in-game times or account for construction costs, seeds, or fertilizer.",
      noInventory: "Add inventory to build a schedule.",
      noMachines: "Add at least one available machine to schedule processing.",
      noCompleteBatch: "No complete batch can be processed within this window; affected stock remains raw.",
      noPositiveValue: "No available route adds value over selling the eligible stock raw.",
      noSchedule: "There are no processing or collection actions in this window.",
    },
    import: {
      title: "Review imported plan before applying",
      chooseFile: "Choose a Stardew Valley save file",
      chooseFolder: "Or choose a save folder",
      farm: "Farm in this save",
      preview: "Import preview",
      inventoryRows: "Inventory rows found",
      machines: "Machine counts found",
      profession: "Profession found",
      warnings: "Review notes",
      unsupportedItems: "Items that could not be mapped",
      sourceName: "Selected file",
      append: "Append inventory to current plan",
      replace: "Use as a new plan",
      keep: "Keep current plan",
      cancel: "Cancel",
      fileRequired: "Choose a save file to preview it.",
      previewFailure: "This save could not be previewed.",
      confirmed: "The imported plan was applied.",
      oldCropPlan: "Existing crop-profit plan found",
      oldPlanDescription: "Review each crop harvest before adding it as incoming inventory. Nothing is applied automatically.",
      reviewOldPlan: "Add from crop-profit plan",
      resetInvalidPlan: "Reset this saved production plan",
      selectedFiles: "Selected save files",
      farmName: "Farm",
      farmDetails: "Save details",
      selectMapping: "Choose an item mapping",
      noInventoryDetected: "No supported inventory items were found in this save.",
      noSaveGameFiles: "No SaveGame XML was found in the selected folder.",
      skippedNonSaveFiles: (fileNames) => `Skipped non-SaveGame files: ${fileNames.join(", ")}.`,
      chooseFarm: "Choose a farm save to preview",
      unmappedItem: (item, objectId, quantity) => `${item} (object ${objectId}) × ${quantity} could not be mapped to a processing item.`,
      formatReviewMessage: (message) => message,
    },
    legacy: {
      title: "Review the saved crop-profit estimate",
      description: "Projected crop yields are estimates, not measured stock. Enter the quantity you actually have and when it will be available; no row is added until you confirm it.",
      expectedQuantity: "Estimated yield",
      harvestWindow: "Projected harvest window",
      actualQuantity: "Actual quantity to add",
      actualAvailableDay: "Available day in this plan",
      addConfirmed: "Add confirmed inventory rows",
      unsupportedCrop: "This crop is not available as a processing ingredient and cannot be transferred.",
      noSavedPlan: "No saved crop-profit plan was found on this device.",
      reviewFailure: "The saved crop-profit plan could not be read.",
    },
    share: {
      title: "Share this plan",
      linkIncludesInventory: "The full link contains inventory and plan settings. Use the summary to share results only.",
      copyLink: "Copy plan link",
      manualCopy: "Select and copy this link manually.",
      incomingTitle: "Review shared plan before applying",
      incomingDescription: "This link contains inventory and plan settings. Review it, then choose whether to replace or append it.",
      reviewIncoming: "Review pending shared plan",
      applyIncoming: "Use shared plan",
      appendIncoming: "Append shared inventory",
      keepIncoming: "Keep my current plan",
    },
    validation: {
      invalidNumber: (field, received) => `${field} must be a whole number greater than or equal to 0. Received: ${JSON.stringify(received)}.`,
      reservedExceedsQuantity: (received) => `Reserved quantity cannot exceed inventory quantity. Received: ${JSON.stringify(received)}.`,
      arrivalOutsideHorizon: (received, horizon) => `Available day must be between 0 and ${horizon}. Received: ${JSON.stringify(received)}.`,
      invalidSelection: (field, received) => `${field} is not a supported selection. Received: ${JSON.stringify(received)}.`,
      fixFields: "Correct the highlighted fields to refresh this plan.",
    },
  },
  "zh-CN": {
    title: { today: "今日加工清单", schedule: "综合生产排程" },
    plannerTitle: "生产计划",
    description: "根据现有库存安排装机与收取，并清楚保留预留数量和未来到货日。",
    navigation: { today: "今日任务", schedule: "完整排程", backToToday: "返回今日任务" },
    settings: {
      title: "计划设置",
      editSummary: "编辑设置与库存",
      collapseSummary: "收起设置",
      summary: (inventoryRows, deadline, profession, machines) => `${inventoryRows} 条库存 · ${deadline} · ${profession} · ${machines}`,
      horizon: "加工期限",
      profession: "职业",
      machineCounts: "可用机器",
      machines: { keg: "Keg", jar: "罐头瓶", dehydrator: "烘干机" },
      professions: { none: "无职业加成", tiller: "耕种者", artisan: "工匠" },
      deadlines: { 7: "7 天", 14: "14 天", 28: "28 天" },
    },
    inventory: {
      title: "库存",
      add: "添加库存行",
      remove: "移除此行",
      item: "物品",
      quantity: "数量",
      quality: "品质",
      qualities: { normal: "普通", silver: "银星", gold: "金星", iridium: "铱星" },
      reserved: "预留数量",
      reservedHelp: "预留库存不会进入加工，仍可留作其他用途。",
      availableDay: "到货日",
      availableDayHelp: "第 0 天表示现在可用；未来库存会在对应天数加入。",
      bearsKnowledge: "熊的知识",
      bearsKnowledgeHelp: "此存档加成只应用于符合条件的莓果。",
      coconutSource: "椰子来源",
      coconutSources: { foraged: "采集获得", purchasedOrGifted: "购买或获赠" },
    },
    actions: {
      startEmpty: "从空计划开始",
      loadExample: "载入示例",
      importSave: "导入游戏存档",
      copyToday: "复制今日清单",
      copySummary: "复制结果摘要",
      copyPlanLink: "复制完整计划链接",
      previousDay: "前一天",
      nextDay: "下一天",
      showSchedule: "查看完整排程",
      reviewTasks: "已核对，继续当前清单",
      undoPlanChange: "撤销上次计划更改",
      share: "分享当前计划",
      more: "更多操作",
    },
    status: {
      saved: "计划已保存在本机。",
      saving: "正在保存计划…",
      saveFailed: "计划无法保存在本机；当前计算仍可查看。",
      copyFailed: "复制失败，请选择下方文本手动复制。",
      copySucceeded: "已复制。",
      changedNeedsReview: "计划输入已改变。继续旧清单前，请先核对更新后的任务。",
      reviewConfirmed: "更新后的任务清单已就绪。",
      taskCompleted: "标记任务已完成",
      taskIncomplete: "标记任务未完成",
    },
    today: {
      title: "今天要做什么",
      summaryTitle: "计划摘要",
      summaryHighlights: (addedValue, finalValue, rawSaleBaseline, utilization) => `增值 ${addedValue} · 最终 ${finalValue} · 直售 ${rawSaleBaseline} · 利用率 ${utilization}`,
      currentDay: "当前日",
      dayOfWindow: (day, horizon) => `第 ${day} / ${horizon} 天`,
      loadTitle: "装入机器",
      collectTitle: "收取成品",
      waitingTitle: "仍在等待的库存",
      noLoad: "今天没有需要装入的机器。",
      noCollect: "今天没有可收取的成品。",
      allComplete: "计划中的加工已全部完成。",
      noInventory: "添加库存行或载入示例计划，即可查看今日任务。",
      noMachines: "没有可用机器；库存保持未加工并按原售价计入。",
      changedPrompt: "清单生成后计划已有改变。请先核对新任务，再继续执行。",
      taskReviewPrompt: "核对更新后的排程后，才能继续勾选任务。",
      checkTask: (task) => `标记“${task}”已完成`,
      uncheckTask: (task) => `标记“${task}”未完成`,
    },
    schedule: {
      title: "推荐分配与每日排程",
      addedValue: "加工额外增值",
      finalValue: "最终出售价值",
      rawSaleBaseline: "直接出售基准",
      reservedStock: "预留库存",
      machineUtilization: "机器利用率",
      allocationTitle: "推荐分配",
      allocationColumns: {
        inventory: "库存物品",
        machine: "机器",
        product: "产品",
        quantity: "数量",
        batches: "批次",
        addedValue: "增值",
        leftover: "未加工余料",
      },
      dailyTitle: "按天展开排程",
      dailyColumns: {
        day: "日期",
        action: "动作",
        machine: "机器",
        item: "物品 / 产品",
        quantity: "数量",
        collectDay: "收取日",
      },
      load: "装入",
      collect: "收取",
      planState: "计划状态",
      executable: "可执行方案",
      assumptions: "假设每天早晨收取成品并有一次重新装机机会；不模拟游戏内精确时刻，也不计机器建造、种子或肥料成本。",
      noInventory: "添加库存后即可生成排程。",
      noMachines: "至少添加一台可用机器，才能安排加工。",
      noCompleteBatch: "所选期限内没有可完成的完整批次；相关库存仍按原售价计入。",
      noPositiveValue: "当前受支持路线都没有比直接出售相关库存更高的价值。",
      noSchedule: "此期限内没有装机或收取任务。",
    },
    import: {
      title: "应用前核对导入内容",
      chooseFile: "选择星露谷物语存档文件",
      chooseFolder: "或选择存档文件夹",
      farm: "此存档中的农场",
      preview: "导入预览",
      inventoryRows: "识别到的库存行",
      machines: "识别到的机器数量",
      profession: "识别到的职业",
      warnings: "需要核对的提示",
      unsupportedItems: "无法映射的物品",
      sourceName: "所选文件",
      append: "追加库存到当前计划",
      replace: "作为新计划使用",
      keep: "保留当前计划",
      cancel: "取消",
      fileRequired: "请选择存档文件后预览。",
      previewFailure: "无法预览此存档。",
      confirmed: "已应用导入的计划。",
      oldCropPlan: "发现已有作物收益计划",
      oldPlanDescription: "将每次收获核对后再作为待到货库存添加；不会自动应用。",
      reviewOldPlan: "从作物收益计划添加",
      resetInvalidPlan: "重置此本机生产计划",
      selectedFiles: "所选存档文件",
      farmName: "农场",
      farmDetails: "存档信息",
      selectMapping: "选择物品对应项",
      noInventoryDetected: "此存档中没有识别到受支持的库存物品。",
      noSaveGameFiles: "所选文件夹中没有找到 SaveGame 存档文件。",
      skippedNonSaveFiles: (fileNames) => `已跳过非 SaveGame 文件：${fileNames.join("、")}。`,
      chooseFarm: "选择一个农场存档进行预览",
      unmappedItem: (item, objectId, quantity) => `${item}（物品编号 ${objectId}）× ${quantity} 无法对应到可加工物品。`,
      formatReviewMessage: translateKnownSaveReviewMessageToChinese,
    },
    legacy: {
      title: "核对已保存的作物收益估算",
      description: "作物产量是预测值，不是实测库存。请输入你实际拥有的数量和可用日期；确认前不会添加任何一行。",
      expectedQuantity: "预计产量",
      harvestWindow: "预计收获区间",
      actualQuantity: "要添加的实际数量",
      actualAvailableDay: "此计划中的可用日期",
      addConfirmed: "添加已确认的库存行",
      unsupportedCrop: "此作物不是可加工物品，无法转入生产计划。",
      noSavedPlan: "此设备上没有已保存的作物收益计划。",
      reviewFailure: "无法读取已保存的作物收益计划。",
    },
    share: {
      title: "分享当前计划",
      linkIncludesInventory: "完整链接包含库存与计划设置；只分享结论时请使用结果摘要。",
      copyLink: "复制计划链接",
      manualCopy: "请选择并手动复制此链接。",
      incomingTitle: "应用前核对分享的计划",
      incomingDescription: "此链接包含库存与计划设置。请核对内容，再选择替换或追加。",
      reviewIncoming: "核对待确认的分享计划",
      applyIncoming: "使用分享的计划",
      appendIncoming: "追加分享的库存",
      keepIncoming: "保留当前计划",
    },
    validation: {
      invalidNumber: (field, received) => `${field}必须是大于或等于0的整数。收到：${JSON.stringify(received)}。`,
      reservedExceedsQuantity: (received) => `预留数量不能大于库存数量。收到：${JSON.stringify(received)}。`,
      arrivalOutsideHorizon: (received, horizon) => `到货日必须在第0至${horizon}天内。收到：${JSON.stringify(received)}。`,
      invalidSelection: (field, received) => `${field}不是支持的选项。收到：${JSON.stringify(received)}。`,
      fixFields: "请修正标记的字段后更新计划。",
    },
  },
};

function translateKnownSaveReviewMessageToChinese(message: string): string {
  const exactTranslations: readonly (readonly [string, string])[] = [
    ["The save has no readable farm name.", "存档中没有可读取的农场名称。"],
    ["The save has no readable farm type.", "存档中没有可读取的农场类型。"],
    ["The save farm date is incomplete; verify the planning context before importing.", "存档中的日期信息不完整；导入前请核对计划时间范围。"],
    ["The save has no readable player profession list; choose a processing profession before planning.", "存档中没有可读取的玩家职业列表；规划前请手动选择加工职业。"],
    ["Bear's Knowledge cannot be confirmed from this save parser; choose its value before importing eligible berries.", "此存档解析器无法确认“熊的知识”是否生效；导入符合条件的莓果前请手动选择。"],
    ["Keg, Preserves Jar, or Dehydrator items were detected as stored equipment; they are not included in placed free capacity.", "检测到存档库存中有 Keg、罐头瓶或烘干机物品；这些存放的设备不计入已放置机器的可用容量。"],
    ["No placed processing machines were found in the save's locations or building interiors.", "存档地点或建筑内部未发现已放置的加工机器。"],
    ["The save item ID has multiple source-specific ingredient records; select its source.", "此存档物品编号对应多个来源不同的原料记录；请核对并选择来源。"],
    ["The save does not reveal whether this coconut was foraged or purchased/gifted; select its source.", "存档无法确认此椰子是采集获得还是购买/获赠；请选择来源。"],
    ["The save does not reveal whether Bear's Knowledge is active for this berry; select its value.", "存档无法确认此莓果是否受“熊的知识”影响；请选择该加成是否生效。"],
  ];
  let translatedMessage = message;

  for (const [englishMessage, chineseMessage] of exactTranslations) {
    translatedMessage = translatedMessage.replaceAll(englishMessage, chineseMessage);
  }

  translatedMessage = translatedMessage.replace(
    /(\d+) supported inventory item group\(s\) need source or quality review before import\./g,
    (_match, groupCount: string) => `有 ${groupCount} 组受支持的库存物品需要核对来源或品质后才能导入。`,
  );
  translatedMessage = translatedMessage.replace(
    /Saved quality (\d+) is unsupported for all candidate ingredient records; choose a valid quality manually\./g,
    (_match, qualityCode: string) => `存档品质代码 ${qualityCode} 不适用于任何候选原料记录；请手动选择有效品质。`,
  );

  return translatedMessage;
}

export function getProductionToolCopy(locale: PublicLocale): ProductionToolCopy {
  const copy = productionToolCopy[locale];
  if (copy === undefined) {
    throw new Error(`Unsupported production tool locale. Received: ${JSON.stringify(locale)}.`);
  }
  return copy;
}
