import {
  parseCropSeason,
  parseSpeedGroOption,
  type CropSeason,
  type SpeedGroOption,
} from "./planting-field-values";
import {
  getFieldCrop,
  listPurchasableFieldCrops,
} from "@/src/crop-tools/catalog/field-crops";

export const cropGrowthStorageKey = "stardew-tools:crop-growth";

export const growthLocations = ["outdoor", "greenhouse", "ginger-island"] as const;

export type GrowthLocation = (typeof growthLocations)[number];

export const afterHarvestOptions = ["regrow", "replant-same-day", "no-replant"] as const;

export type AfterHarvestOption = (typeof afterHarvestOptions)[number];

export type CropGrowthForm = Readonly<{
  cropId: string;
  season: CropSeason;
  plantingDay: number;
  speedGro: SpeedGroOption;
  agriculturist: boolean;
  missedWateringDays: number;
  location: GrowthLocation;
  afterHarvest: AfterHarvestOption;
}>;

export function parseGrowthLocation(rawValue: unknown): GrowthLocation {
  if (growthLocations.includes(rawValue as GrowthLocation)) {
    return rawValue as GrowthLocation;
  }

  throw new Error(
    `Location must be outdoor, greenhouse, or ginger-island. Received: ${JSON.stringify(rawValue)}.`,
  );
}

export function parseAfterHarvestOption(rawValue: unknown): AfterHarvestOption {
  if (afterHarvestOptions.includes(rawValue as AfterHarvestOption)) {
    return rawValue as AfterHarvestOption;
  }

  throw new Error(
    `After harvest must be regrow, replant-same-day, or no-replant. Received: ${JSON.stringify(rawValue)}.`,
  );
}

export function parseCropId(rawValue: unknown): string {
  if (typeof rawValue !== "string" || rawValue.trim().length === 0) {
    throw new Error(`Crop id must be a non-empty string. Received: ${JSON.stringify(rawValue)}.`);
  }

  return rawValue;
}

export function createDefaultCropGrowthForm(cropId = "parsnip"): CropGrowthForm {
  return normalizeCropGrowthForm({
    cropId: parseCropId(cropId),
    season: "spring",
    plantingDay: 1,
    speedGro: "none",
    agriculturist: false,
    missedWateringDays: 0,
    location: "outdoor",
    afterHarvest: "no-replant",
  });
}

function readCropGrowthFormFields(rawValue: unknown): CropGrowthForm {
  if (typeof rawValue !== "object" || rawValue === null || Array.isArray(rawValue)) {
    throw new Error(
      `Crop growth settings must be an object. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const record = rawValue as Record<string, unknown>;
  const plantingDay = readRequiredField(record, "plantingDay");
  const missedWateringDays = readRequiredField(record, "missedWateringDays");
  const agriculturist = readRequiredField(record, "agriculturist");

  if (typeof plantingDay !== "number" || !Number.isInteger(plantingDay)) {
    throw new Error(
      `Planting day must be an integer from 1 to 28. Received: ${JSON.stringify(plantingDay)}.`,
    );
  }
  if (plantingDay < 1 || plantingDay > 28) {
    throw new Error(
      `Planting day must be an integer from 1 to 28. Received: ${JSON.stringify(plantingDay)}.`,
    );
  }
  if (typeof missedWateringDays !== "number" || !Number.isInteger(missedWateringDays)) {
    throw new Error(
      `Missed watering days must be an integer from 0 to 14. Received: ${JSON.stringify(missedWateringDays)}.`,
    );
  }
  if (missedWateringDays < 0 || missedWateringDays > 14) {
    throw new Error(
      `Missed watering days must be an integer from 0 to 14. Received: ${JSON.stringify(missedWateringDays)}.`,
    );
  }
  if (typeof agriculturist !== "boolean") {
    throw new Error(
      `Agriculturist must be true or false. Received: ${JSON.stringify(agriculturist)}.`,
    );
  }

  return {
    cropId: parseCropId(readRequiredField(record, "cropId")),
    season: parseCropSeason(readRequiredField(record, "season")),
    plantingDay,
    speedGro: parseSpeedGroOption(readRequiredField(record, "speedGro")),
    agriculturist,
    missedWateringDays,
    location: parseGrowthLocation(readRequiredField(record, "location")),
    afterHarvest: parseAfterHarvestOption(readRequiredField(record, "afterHarvest")),
  };
}

export function normalizeCropGrowthForm(form: CropGrowthForm): CropGrowthForm {
  const validatedForm = readCropGrowthFormFields(form);
  const crop = getFieldCrop(validatedForm.cropId);

  if (crop.regrowIntervalDays !== null) {
    if (validatedForm.afterHarvest !== "regrow") {
      return { ...validatedForm, afterHarvest: "regrow" };
    }
    return validatedForm;
  }

  if (validatedForm.afterHarvest === "regrow") {
    return { ...validatedForm, afterHarvest: "no-replant" };
  }
  return validatedForm;
}

function readRequiredField(record: Record<string, unknown>, fieldName: string): unknown {
  if (!Object.hasOwn(record, fieldName)) {
    throw new Error(
      `Crop growth settings are missing ${fieldName}. Received: ${JSON.stringify(record)}.`,
    );
  }

  return record[fieldName];
}

export function readCropGrowthForm(rawValue: unknown): CropGrowthForm {
  return normalizeCropGrowthForm(readCropGrowthFormFields(rawValue));
}

function normalizeStoredCropGrowthForm(form: CropGrowthForm): CropGrowthForm {
  const isKnownCrop = listPurchasableFieldCrops().some((crop) => crop.cropId === form.cropId);
  return isKnownCrop ? normalizeCropGrowthForm(form) : form;
}

export function parseCropGrowthForm(storageText: string): CropGrowthForm {
  let parsed: unknown;
  try {
    parsed = JSON.parse(storageText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Crop growth settings must be JSON. Received: ${JSON.stringify(storageText)}.`,
        { cause: error },
      );
    }

    throw error;
  }

  return normalizeStoredCropGrowthForm(readCropGrowthFormFields(parsed));
}

export function loadCropGrowthForm(storageText: string | null, fallbackCropId: string): CropGrowthForm {
  if (storageText === null) {
    return createDefaultCropGrowthForm(fallbackCropId);
  }

  try {
    return parseCropGrowthForm(storageText);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Received:")) {
      return createDefaultCropGrowthForm(fallbackCropId);
    }

    throw error;
  }
}

export function serializeCropGrowthForm(form: CropGrowthForm): string {
  return JSON.stringify(readCropGrowthForm(form));
}
