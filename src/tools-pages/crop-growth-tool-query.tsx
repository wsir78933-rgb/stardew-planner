"use client";

import { useSearchParams } from "next/navigation";
import type { PublicLocale } from "../i18n/public-locale";
import { CropGrowthTool } from "./crop-growth-tool";

type CropGrowthToolQueryProperties = Readonly<{
  locale: PublicLocale;
}>;

export function CropGrowthToolQuery({ locale }: CropGrowthToolQueryProperties) {
  const searchParams = useSearchParams();
  const cropParameter = searchParams.get("crop");

  return <CropGrowthTool locale={locale} requestedCropId={cropParameter} />;
}
