import { listPurchasableFieldCrops } from "@/src/crop-tools/catalog/crop-catalog";
import type { PublicLocale } from "../i18n/public-locale";

export type PurchasableFieldCrop = Readonly<{
  id: string;
  englishName: string;
  chineseName: string;
}>;

function readCropName(record: Record<string, unknown>, fieldName: "englishName" | "chineseName"): string {
  const cropName = record[fieldName];
  if (typeof cropName !== "string" || cropName.trim().length === 0) {
    throw new Error(
      `Purchasable field crop ${fieldName} must be a non-empty string. Received: ${JSON.stringify(cropName)}.`,
    );
  }

  return cropName;
}

export function readPurchasableFieldCrop(rawValue: unknown): PurchasableFieldCrop {
  if (typeof rawValue !== "object" || rawValue === null) {
    throw new Error(
      `Purchasable field crop must be an object. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  const record = rawValue as Record<string, unknown>;
  const id = record.id;
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new Error(
      `Purchasable field crop id must be a non-empty string. Received: ${JSON.stringify(id)}.`,
    );
  }

  return {
    id,
    englishName: readCropName(record, "englishName"),
    chineseName: readCropName(record, "chineseName"),
  };
}

export function readPurchasableFieldCrops(rawValue: unknown): readonly PurchasableFieldCrop[] {
  if (!Array.isArray(rawValue)) {
    throw new Error(
      `Purchasable field crops must be an array. Received: ${JSON.stringify(rawValue)}.`,
    );
  }

  if (rawValue.length === 0) {
    throw new Error("Purchasable field crop list is empty. Received: [].");
  }

  return rawValue.map((entry) => readPurchasableFieldCrop(entry));
}

export function loadPurchasableFieldCrops(): readonly PurchasableFieldCrop[] {
  return readPurchasableFieldCrops(listPurchasableFieldCrops());
}

export function requirePurchasableFieldCrop(
  crops: readonly PurchasableFieldCrop[],
  cropId: string,
): PurchasableFieldCrop {
  const crop = crops.find((entry) => entry.id === cropId);
  if (crop === undefined) {
    throw new Error(`Unknown crop id. Received: ${JSON.stringify(cropId)}.`);
  }

  return crop;
}

export function readCropDisplayName(crop: PurchasableFieldCrop, locale: PublicLocale): string {
  if (locale === "zh-CN") {
    return crop.chineseName;
  }

  if (locale === "en") {
    return crop.englishName;
  }

  throw new Error(`Unsupported tools page locale. Received: ${JSON.stringify(locale)}.`);
}

export function chooseDefaultGrowthCropId(crops: readonly PurchasableFieldCrop[]): string {
  const parsnip = crops.find((crop) => crop.id === "parsnip");
  if (parsnip !== undefined) {
    return parsnip.id;
  }

  const firstCrop = crops[0];
  if (firstCrop === undefined) {
    throw new Error("Purchasable field crop list is empty. Received: [].");
  }

  return firstCrop.id;
}
