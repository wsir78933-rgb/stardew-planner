import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getProductionToolCopy } from "../../src/i18n/production-tool-copy";
import {
  appendProductionInventory,
  createProductionPlanState,
  replaceProductionPlanInput,
  setProductionPlanCurrentDay,
  setProductionTaskCompleted,
  undoProductionPlanChange,
  updateProductionPlanInput,
} from "../../src/production-tools/production-plan-state";
import { ProductionPlannerTool } from "../../src/tools-pages/production/production-planner-tool";
import { PlantingSelect } from "../../src/tools-pages/planting-select";
import {
  calculateProductionPlan,
  createExampleProductionPlan,
  type ProductionPlanInput,
} from "../../src/production-tools/production-model";
import { createProductionPlanIncomingHref } from "../../src/tools-pages/production/production-plan-handoff";

describe.each([
  {
    locale: "en" as const,
    title: "Production plan",
    navToday: "Today’s tasks",
    navSchedule: "Full schedule",
    settings: "Processing window",
    collapseSummary: "Hide settings",
    importTitle: "Import a game save",
    folderTitle: "Or choose a save folder",
    oldPlanTitle: "Existing crop-profit plan found",
    reviewOldPlan: "Add from crop-profit plan",
    machineUtilization: "Machine utilization",
    copyToday: "Copy today’s list",
    undoPlanChange: "Undo last plan change",
    reviewIncoming: "Review pending shared plan",
    currentDay: "Current day",
  },
  {
    locale: "zh-CN" as const,
    title: "生产计划",
    navToday: "今日任务",
    navSchedule: "完整排程",
    settings: "加工期限",
    collapseSummary: "收起设置",
    importTitle: "导入游戏存档",
    folderTitle: "或选择存档文件夹",
    oldPlanTitle: "发现已有作物收益计划",
    reviewOldPlan: "从作物收益计划添加",
    machineUtilization: "机器利用率",
    copyToday: "复制今日清单",
    undoPlanChange: "撤销上次计划更改",
    reviewIncoming: "核对待确认的分享计划",
    currentDay: "当前日",
  },
])("production planner in $locale", (expected) => {
  it("renders the shared full-width workspace, localized navigation, and explicit import/review entry points", () => {
    const markup = renderToStaticMarkup(<ProductionPlannerTool locale={expected.locale} view="today" />);

    expect(getProductionToolCopy(expected.locale).schedule.machineUtilization).toBe(expected.machineUtilization);
    expect(markup).toContain('data-production-planner="true"');
    expect(markup.match(/<h1\b/g) ?? []).toHaveLength(0);
    expect(markup).toContain(`>${expected.title.replaceAll("'", "&#x27;")}</h2>`);
    expect(markup).not.toContain(`aria-label="${getProductionToolCopy(expected.locale).today.title}"`);
    expect(markup).toContain(expected.navToday);
    expect(markup).toContain(expected.navSchedule);
    expect(markup).toContain(expected.settings);
    expect(markup).toContain(expected.collapseSummary);
    expect(markup).toMatch(/<details\b[^>]*open=""/);
    expect(markup).toContain(expected.importTitle);
    expect(markup).toContain(expected.folderTitle);
    expect(markup).toContain('webkitdirectory=""');
    expect(markup).toContain('id="import-save"');
    expect(markup).toContain('id="crop-profit-review"');
    expect(markup).not.toContain(expected.oldPlanTitle);
    expect(markup).toContain(expected.reviewOldPlan);
    expect(markup).not.toContain(expected.reviewIncoming);
    expect(getProductionToolCopy(expected.locale).actions.undoPlanChange).toBe(expected.undoPlanChange);
    expect(markup).toContain('type="file"');
    expect(markup).toContain("aria-current=\"page\"");
    expect(markup.indexOf('id="import-save"')).toBeGreaterThan(markup.indexOf("</details>"));
    expect(markup).not.toContain(expected.copyToday);
    expect(markup).not.toContain('class="undefined"');
  });

  it("renders the schedule view without adding a second page heading", () => {
    const markup = renderToStaticMarkup(<ProductionPlannerTool locale={expected.locale} view="schedule" />);
    expect(markup).toContain('data-view="schedule"');
    expect(markup.match(/<h1\b/g) ?? []).toHaveLength(0);
    expect(markup).toContain(expected.navSchedule);
    expect(markup).toContain('id="import-save"');
    expect(markup).toContain('id="production-deadline-days"');
    expect(markup).toContain('id="production-inventory-title"');
    expect(markup).toContain('id="crop-profit-review"');
    expect(markup).toContain(expected.collapseSummary);
    expect(markup).toContain(expected.importTitle);
    expect(markup).toContain(expected.reviewOldPlan);
  });
});

it.each([
  {
    locale: "en" as const,
    label: "Current day",
    selectedDay: { value: "0", label: "Day 0 of 7" },
    nextDay: { value: "1", label: "Day 1 of 7" },
  },
  {
    locale: "zh-CN" as const,
    label: "当前日",
    selectedDay: { value: "0", label: "第 0 / 7 天" },
    nextDay: { value: "1", label: "第 1 / 7 天" },
  },
])("renders an accessible current-day picker for $locale", ({ label, selectedDay, nextDay }) => {
  const markup = renderToStaticMarkup(
    <PlantingSelect
      inputId="production-current-day"
      label={label}
      value={selectedDay.value}
      options={[selectedDay, nextDay]}
      onValueChange={() => undefined}
    />,
  );

  expect(markup).toContain('id="production-current-day"');
  expect(markup).toContain('id="production-current-day-label"');
  expect(markup).toContain('aria-labelledby="production-current-day-label"');
  expect(markup).toContain(selectedDay.label);
});

it.each([
  {
    locale: "en" as const,
    expected: "Added 5g · Final 20g · Raw 15g · 70% utilization",
  },
  {
    locale: "zh-CN" as const,
    expected: "增值 5g · 最终 20g · 直售 15g · 利用率 70%",
  },
])("keeps key values visible in the collapsed plan summary copy for $locale", ({ locale, expected }) => {
  expect(getProductionToolCopy(locale).today.summaryHighlights("5g", "20g", "15g", "70%")).toBe(expected);
});

it("localizes known save review messages while preserving values and unknown messages", () => {
  const chineseReviewMessage = getProductionToolCopy("zh-CN").import.formatReviewMessage;
  const englishReviewMessage = getProductionToolCopy("en").import.formatReviewMessage;
  const groupWarning = "3 supported inventory item group(s) need source or quality review before import.";
  const qualityWarning = "Saved quality 4 is unsupported for all candidate ingredient records; choose a valid quality manually.";
  const storedMachineWarning = "Keg, Preserves Jar, or Dehydrator items were detected as stored equipment; they are not included in placed free capacity.";
  const unknownWarning = "Future importer warning with value 908.";

  expect(chineseReviewMessage(groupWarning)).toBe("有 3 组受支持的库存物品需要核对来源或品质后才能导入。");
  expect(chineseReviewMessage(qualityWarning)).toBe("存档品质代码 4 不适用于任何候选原料记录；请手动选择有效品质。");
  expect(chineseReviewMessage(storedMachineWarning)).toContain("不计入已放置机器的可用容量");
  expect(chineseReviewMessage(unknownWarning)).toBe(unknownWarning);
  expect(englishReviewMessage(groupWarning)).toBe(groupWarning);
});

it("shares a validated plan in the matching locale route without applying it", () => {
  const input = createExampleProductionPlan();
  const englishHref = createProductionPlanIncomingHref("en", input);
  const chineseHref = createProductionPlanIncomingHref("zh-CN", input);

  expect(englishHref).toMatch(/^\/tools\/today-processing-list#production-plan=/);
  expect(chineseHref).toMatch(/^\/zh\/tools\/today-processing-list#production-plan=/);
  expect(englishHref).not.toContain("/production-schedule");
});

it("preserves checklist progress for settings and appended inventory, and resets it for replaced plans", () => {
  const exampleInput = createExampleProductionPlan();
  const firstTask = calculateProductionPlan(exampleInput).dailySchedule
    .flatMap((day) => [...day.collectTasks, ...day.loadTasks])[0];
  const firstInventoryLine = exampleInput.inventory[0];
  if (firstTask === undefined || firstInventoryLine === undefined) {
    throw new Error("The production example must include an inventory row and a scheduled task.");
  }

  const progressedState = setProductionTaskCompleted(
    setProductionPlanCurrentDay(createProductionPlanState(exampleInput), 3),
    firstTask.id,
    true,
  );
  const updatedInput: ProductionPlanInput = {
    ...exampleInput,
    deadlineDays: exampleInput.deadlineDays === 7 ? 14 : 7,
  };
  const settingsUpdatedState = updateProductionPlanInput(progressedState, updatedInput);
  const appendedState = appendProductionInventory(settingsUpdatedState, [{
    ...firstInventoryLine,
    id: `${firstInventoryLine.id}-appended`,
  }]);

  expect(settingsUpdatedState.current.currentDay).toBe(3);
  expect(settingsUpdatedState.current.completedTaskIds).toContain(firstTask.id);
  expect(settingsUpdatedState.current.taskChecklistNeedsReview).toBe(true);
  expect(appendedState.current.currentDay).toBe(3);
  expect(appendedState.current.completedTaskIds).toContain(firstTask.id);
  expect(appendedState.current.taskChecklistNeedsReview).toBe(true);

  const replacement = replaceProductionPlanInput(appendedState, { ...exampleInput, inventory: [] });
  expect(replacement.current.currentDay).toBe(0);
  expect(replacement.current.completedTaskIds).toEqual([]);
  expect(replacement.current.taskChecklistNeedsReview).toBe(false);
  const restored = undoProductionPlanChange(replacement);
  expect(restored.current.currentDay).toBe(3);
  expect(restored.current.completedTaskIds).toContain(firstTask.id);
  expect(restored.current.taskChecklistNeedsReview).toBe(true);
});
