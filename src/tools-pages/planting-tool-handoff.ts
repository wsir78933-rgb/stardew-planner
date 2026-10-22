import { readCropProfitForm, type CropProfitForm } from "./crop-profit-form";
import {
  normalizeCropGrowthForm,
  parseCropId,
  type CropGrowthForm,
} from "./crop-growth-form";

export function createProfitGrowthForm(
  form: CropProfitForm,
  cropId: string,
): CropGrowthForm {
  const profitForm = readCropProfitForm(form);

  return normalizeCropGrowthForm({
    cropId: parseCropId(cropId),
    season: profitForm.season,
    plantingDay: profitForm.plantingDay,
    speedGro: profitForm.speedGro,
    agriculturist: profitForm.profession === "agriculturist",
    missedWateringDays: 0,
    location: "outdoor",
    afterHarvest: "replant-same-day",
  });
}
