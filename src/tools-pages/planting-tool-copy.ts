import type { PublicLocale } from "../i18n/public-locale";
import { getToolsPageCopy } from "../i18n/tools-page-copy";
import { getCropCatalogEntry } from "../crop-tools/catalog/crop-catalog";
import {
  readCropGrowthForm,
  type CropGrowthForm,
} from "./crop-growth-form";
import {
  readCropProfitForm,
  type CropProfitForm,
} from "./crop-profit-form";
import {
  listHarvestCalendarMonths,
  readCropHarvestProjection,
  type CropHarvestProjection,
  type HarvestCalendarDate,
  type HarvestCalendarMonth,
} from "./crop-harvest-calendar";
import {
  formatGoldAmount,
  type SeasonCropRanking,
} from "./season-crop-ranking";
import { formatHarvestDate, type HarvestDate } from "./planting-field-values";
import {
  readCropDisplayName,
  requirePurchasableFieldCrop,
  type PurchasableFieldCrop,
} from "./purchasable-field-crops";

export function createProfitTopFiveCopy(
  ranking: SeasonCropRanking,
  form: CropProfitForm,
  crops: readonly PurchasableFieldCrop[],
  locale: PublicLocale,
): string {
  const copy = getToolsPageCopy(locale);
  const validatedForm = readCropProfitForm(form);
  const rows = ranking.rows.slice(0, 5);
  if (rows.length === 0) {
    throw new Error(`No ranked crops to copy. Received: ${JSON.stringify(ranking.rows.length)}.`);
  }

  const lines = [
    copy.profit.settingsHeading,
    `${copy.profit.seasons[validatedForm.season]} ${validatedForm.plantingDay}, ${copy.profit.farmYear} ${validatedForm.farmYear}, ${copy.profit.tileCount} ${validatedForm.tileCount}`,
    `${copy.profit.seedSource}: ${copy.profit.seedShops[validatedForm.seedShop]}`,
    `${copy.profit.profession}: ${copy.profit.professions[validatedForm.profession]}`,
    `${copy.profit.speedGro}: ${copy.profit.speedGros[validatedForm.speedGro]}`,
    `${copy.profit.fertilizerCost}: ${formatGoldAmount(validatedForm.fertilizerCostPerTile)}`,
    `${copy.profit.processingHeading}: ${validatedForm.kegCount} ${copy.profit.kegCount}, ${validatedForm.jarCount} ${copy.profit.jarCount}, ${validatedForm.dehydratorCount} ${copy.profit.dehydratorCount}`,
    `${copy.profit.deadline}: ${copy.profit.deadlines[validatedForm.processingDeadline]}`,
    copy.profit.qualityNote,
    copy.profit.expectationNote,
    copy.profit.dailyAverageNote,
    copy.profit.currentSeasonCutoffNote,
    "",
    ...rows.map((row, index) => formatProfitRow(row, index, crops, locale)),
  ];

  return lines.join("\n");
}

function formatProfitRow(
  row: SeasonCropRanking["rows"][number],
  index: number,
  crops: readonly PurchasableFieldCrop[],
  locale: PublicLocale,
): string {
  const copy = getToolsPageCopy(locale);
  if (!row.hasHarvestDetail) {
    throw new Error(
      `Season crop ranking row is missing harvest cost detail. Received: ${JSON.stringify(row)}.`,
    );
  }
  const cropName = readCropDisplayName(requirePurchasableFieldCrop(crops, row.cropId), locale);
  const firstHarvest = row.firstHarvest === null
    ? copy.profit.noHarvestDate
    : formatHarvestDate(row.firstHarvest, copy.profit.seasons);
  const lastHarvest = row.lastHarvest === null
    ? copy.profit.noHarvestDate
    : formatHarvestDate(row.lastHarvest, copy.profit.seasons);

  return [
    `${index + 1}. ${cropName}`,
    `${copy.profit.columns.harvests}: ${formatGoldAmount(row.harvestCount)}`,
    `${copy.profit.columns.expectedUnits}: ${formatGoldAmount(row.expectedUnits)}`,
    `${copy.profit.columns.route}: ${copy.profit.routes[row.routeId]}`,
    `${copy.profit.firstHarvest}: ${firstHarvest}`,
    `${copy.profit.lastHarvest}: ${lastHarvest}`,
    `${copy.profit.seedCost}: ${formatGoldAmount(row.seedCost)}`,
    `${copy.profit.fertilizerSpent}: ${formatGoldAmount(row.fertilizerCost)}`,
    `${copy.profit.netGold}: ${formatGoldAmount(row.netGold)}`,
    `${copy.profit.processedUnits}: ${formatGoldAmount(row.processedUnits)}`,
    `${row.routeId === "sell-raw" ? copy.profit.rawSold : copy.profit.backlogUnits}: ${formatGoldAmount(row.backlogUnits)}`,
  ].join(" | ");
}

export function createGrowthCalendarCopy(
  form: CropGrowthForm,
  projection: CropHarvestProjection,
  crops: readonly PurchasableFieldCrop[],
  locale: PublicLocale,
): string {
  const copy = getToolsPageCopy(locale);
  const validatedForm = readCropGrowthForm(form);
  const validatedProjection = readCropHarvestProjection(projection);
  const crop = getCropCatalogEntry(validatedForm.cropId);
  const cropName = readCropDisplayName(
    requirePurchasableFieldCrop(crops, validatedForm.cropId),
    locale,
  );
  const months = listHarvestCalendarMonths(validatedForm, validatedProjection);
  const harvestDates = validatedProjection.harvests.map((harvest) => {
    const dateText = formatProjectedHarvestDate(harvest, months, copy.growth);
    return harvest.replantedSameDay
      ? `${dateText} (${copy.growth.marks.replant})`
      : dateText;
  });
  const lines = [
    `${cropName} — ${copy.growth.season} ${copy.growth.seasons[validatedForm.season]} ${validatedForm.plantingDay}`,
    `${copy.growth.speedGro}: ${copy.growth.speedGros[validatedForm.speedGro]} | ${copy.growth.profession}: ${validatedForm.agriculturist ? copy.growth.professions.agriculturist : copy.growth.professions.none} | ${copy.growth.location}: ${copy.growth.locations[validatedForm.location]}`,
    `${copy.growth.missedWatering}: ${validatedForm.missedWateringDays}`,
    `${copy.growth.afterHarvest}: ${copy.growth.afterHarvestOptions[validatedForm.afterHarvest]}`,
    `${copy.growth.firstMature}: ${formatProjectedHarvestDate(validatedProjection.firstHarvest, months, copy.growth)}`,
    `${copy.growth.lastSafePlanting}: ${formatGrowthCalendarDate(validatedProjection.lastSafePlanting, copy.growth.seasons, copy.growth)}`,
    `${copy.growth.outdoorDeadlineDate}: ${formatGrowthCalendarDate(validatedProjection.outdoorDeadline, copy.growth.seasons, copy.growth)}`,
    `${copy.growth.harvestCount}: ${formatGoldAmount(validatedProjection.harvestCount)}`,
    `${copy.growth.harvestDatesHeading}: ${harvestDates.length === 0 ? copy.growth.noneValue : harvestDates.join(", ")}`,
    "",
    copy.growth.calendarHeading,
    ...months.map((month) => formatCalendarMonth(month, copy.growth.seasons, copy.growth)),
    "",
    copy.growth.fullScheduleNote,
  ];

  if (crop.regrowDays !== null && validatedForm.afterHarvest !== "regrow") {
    throw new Error(
      `Repeat crop calendar must use natural regrowth. Received: ${JSON.stringify({ cropId: crop.id, afterHarvest: validatedForm.afterHarvest })}.`,
    );
  }

  return lines.join("\n");
}

function formatCalendarMonth(
  month: HarvestCalendarMonth,
  seasons: Readonly<Record<HarvestCalendarDate["season"], string>>,
  growthCopy: ReturnType<typeof getToolsPageCopy>["growth"],
): string {
  const heading = formatGrowthMonthLabel(month, seasons, growthCopy);
  const eventDays = month.marks.flatMap((mark, index) =>
    mark === null ? [] : [`${index + 1} ${growthCopy.marks[mark]}`],
  );
  return `${heading}: ${eventDays.length === 0 ? growthCopy.noneValue : eventDays.join(", ")}`;
}

export function formatProjectedHarvestDate(
  date: HarvestDate | null,
  months: readonly HarvestCalendarMonth[],
  growthCopy: ReturnType<typeof getToolsPageCopy>["growth"],
): string {
  if (date === null) {
    return growthCopy.noneValue;
  }

  const month = requireCalendarMonth(months, date.season);
  return formatGrowthCalendarDate({ ...date, yearOffset: month.yearOffset }, growthCopy.seasons, growthCopy);
}

function requireCalendarMonth(
  months: readonly HarvestCalendarMonth[],
  season: HarvestCalendarDate["season"],
): HarvestCalendarMonth {
  const month = months.find((entry) => entry.season === season);
  if (month === undefined) {
    throw new Error(
      `Calendar month for harvest season is missing. Received: ${JSON.stringify({ season, months })}.`,
    );
  }

  return month;
}

export function formatGrowthCalendarDate(
  date: HarvestCalendarDate | null,
  seasons: Readonly<Record<HarvestCalendarDate["season"], string>>,
  growthCopy: ReturnType<typeof getToolsPageCopy>["growth"],
): string {
  if (date === null) {
    return growthCopy.noneValue;
  }
  if (!Number.isInteger(date.yearOffset) || date.yearOffset < 0) {
    throw new Error(
      `Harvest date yearOffset must be a non-negative integer. Received: ${JSON.stringify(date.yearOffset)}.`,
    );
  }

  const dateLabel = `${seasons[date.season]} ${date.day}`;
  return date.yearOffset === 0
    ? dateLabel
    : `${dateLabel} (${formatGrowthYearOffset(date.yearOffset, growthCopy)})`;
}

export function formatGrowthYearOffset(
  yearOffset: number,
  growthCopy: ReturnType<typeof getToolsPageCopy>["growth"],
): string {
  if (yearOffset === 1) {
    return growthCopy.nextYear;
  }
  if (!Number.isInteger(yearOffset) || yearOffset < 0) {
    throw new Error(
      `Harvest date yearOffset must be a non-negative integer. Received: ${JSON.stringify(yearOffset)}.`,
    );
  }

  return growthCopy.yearsLater.replace("{count}", String(yearOffset));
}

export function formatGrowthMonthLabel(
  month: Pick<HarvestCalendarMonth, "season" | "yearOffset">,
  seasons: Readonly<Record<HarvestCalendarDate["season"], string>>,
  growthCopy: ReturnType<typeof getToolsPageCopy>["growth"],
): string {
  const monthLabel = seasons[month.season];
  return month.yearOffset === 0
    ? monthLabel
    : `${monthLabel} (${formatGrowthYearOffset(month.yearOffset, growthCopy)})`;
}
