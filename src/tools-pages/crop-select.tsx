"use client";

import type { PublicLocale } from "../i18n/public-locale";
import { PlantingSelect } from "./planting-select";
import {
  readCropDisplayName,
  requirePurchasableFieldCrop,
  type PurchasableFieldCrop,
} from "./purchasable-field-crops";

type CropSelectProperties = Readonly<{
  crops: readonly PurchasableFieldCrop[];
  errorMessage: string | null;
  label: string;
  locale: PublicLocale;
  onCropChange: (cropId: string) => void;
  selectedCropId: string;
}>;

export function CropSelect({
  crops,
  errorMessage,
  label,
  locale,
  onCropChange,
  selectedCropId,
}: CropSelectProperties) {
  const selectedCrop = requirePurchasableFieldCrop(crops, selectedCropId);
  const options = crops.map((crop) => ({
    value: crop.id,
    label: readCropDisplayName(crop, locale),
  }));

  return (
    <PlantingSelect
      errorMessage={errorMessage}
      inputId="crop-growth-crop"
      label={label}
      onValueChange={onCropChange}
      options={options}
      value={selectedCrop.id}
    />
  );
}
