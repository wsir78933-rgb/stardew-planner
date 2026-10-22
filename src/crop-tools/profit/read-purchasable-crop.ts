import type { CropCatalogEntry } from "@/src/crop-tools/catalog/crop-catalog";
import type { SeedShop } from "./season-profit-input";

export type PricedMachineBatch = {
  readonly price: number;
  readonly processingMinutes: number;
  readonly batchSize: number;
};

export function selectSeedUnitPrice(
  crop: CropCatalogEntry,
  seedShop: SeedShop,
  farmYear: number,
  plantingDay: number,
): number | null {
  const pierrePrice = farmYear === 1 ? crop.pierreYear1SeedPrice : crop.pierreYear2SeedPrice;
  if (seedShop === "pierre") return pierrePrice;
  const alternateShopPrice =
    plantingDay >= crop.oasisOrFestivalSeedAvailableFromDay
      ? crop.oasisOrFestivalSeedPrice
      : null;
  if (pierrePrice === null) return alternateShopPrice;
  if (alternateShopPrice === null) return pierrePrice;
  return Math.min(pierrePrice, alternateShopPrice);
}

export function readKegBatch(crop: CropCatalogEntry): PricedMachineBatch | null {
  return readSingleItemBatch(crop.keg);
}

export function readJarBatch(crop: CropCatalogEntry): PricedMachineBatch | null {
  return readSingleItemBatch(crop.jar);
}

export function readDehydratorBatch(crop: CropCatalogEntry): PricedMachineBatch | null {
  if (crop.dehydrator === null) return null;
  return crop.dehydrator;
}

function readSingleItemBatch(
  output: CropCatalogEntry["keg"],
): PricedMachineBatch | null {
  if (output === null) return null;
  return {
    price: output.price,
    processingMinutes: output.processingMinutes,
    batchSize: 1,
  };
}
