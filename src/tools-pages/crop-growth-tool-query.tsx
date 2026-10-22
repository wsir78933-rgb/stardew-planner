"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStaticLocationSearch } from "../components/blog/use-static-location-search";
import type { PublicLocale } from "../i18n/public-locale";
import { CropGrowthTool } from "./crop-growth-tool";
import { CropProfitTool } from "./crop-profit-tool";
import type { CropGrowthForm } from "./crop-growth-form";
import {
  createCropGrowthHref,
  createCropGrowthToolHref,
  createCropProfitHref,
} from "./planting-tool-href";
import type { PlantingToolId } from "./planting-tool-frame";

export type PlantingToolsWorkspaceProperties = Readonly<{
  locale: PublicLocale;
  currentTool: PlantingToolId;
}>;

function readLegacyToolFromSearch(locationSearch: string): PlantingToolId {
  const toolParameter = new URLSearchParams(locationSearch).get("tool");
  if (toolParameter === null || toolParameter === "profit") {
    return "crop-profit";
  }

  if (toolParameter === "growth") {
    return "crop-growth";
  }

  throw new Error(`Unknown planting tool. Received: ${JSON.stringify(toolParameter)}.`);
}

function readCropIdFromSearch(locationSearch: string): string | null {
  return new URLSearchParams(locationSearch).get("crop");
}

function createGrowthDestination(locale: PublicLocale, cropId: string | null): string {
  if (cropId === null || cropId === "") {
    return createCropGrowthToolHref(locale);
  }

  return createCropGrowthHref(locale, cropId);
}

export function PlantingToolsWorkspace({
  locale,
  currentTool,
}: PlantingToolsWorkspaceProperties) {
  const router = useRouter();
  const locationSearch = useStaticLocationSearch();
  const [requestedCropId, setRequestedCropId] = useState<string | null>(null);
  const [requestedGrowthForm, setRequestedGrowthForm] = useState<CropGrowthForm | null>(null);
  const [selectedToolOverride, setSelectedToolOverride] = useState<PlantingToolId | null>(null);
  const legacyTool = currentTool === "crop-profit"
    ? readLegacyToolFromSearch(locationSearch)
    : currentTool;
  const routeTool = currentTool === "crop-profit" && legacyTool === "crop-growth"
    ? "crop-growth"
    : currentTool;
  const activeTool = selectedToolOverride ?? routeTool;
  const cropIdFromSearch = readCropIdFromSearch(locationSearch);

  useEffect(() => {
    if (currentTool !== "crop-profit" || legacyTool !== "crop-growth") {
      return;
    }

    window.location.replace(createGrowthDestination(locale, cropIdFromSearch));
  }, [currentTool, cropIdFromSearch, legacyTool, locale, router]);

  useEffect(() => {
    setRequestedCropId(cropIdFromSearch);
  }, [cropIdFromSearch]);

  useEffect(() => {
    if (selectedToolOverride === currentTool) {
      setSelectedToolOverride(null);
    }
  }, [currentTool, selectedToolOverride]);

  function selectTool(tool: PlantingToolId, cropId?: string) {
    setSelectedToolOverride(tool);

    if (tool === "crop-growth") {
      if (cropId !== undefined && cropId !== "") {
        setRequestedCropId(cropId);
      } else {
        setRequestedCropId(null);
      }

      router.push(createGrowthDestination(locale, cropId ?? null), { scroll: false });
      return;
    }

    setRequestedCropId(null);
    router.push(createCropProfitHref(locale), { scroll: false });
  }

  function viewGrowthCalendar(form: CropGrowthForm) {
    setSelectedToolOverride("crop-growth");
    setRequestedGrowthForm(form);
    setRequestedCropId(null);
    router.push(createCropGrowthHref(locale, form.cropId), { scroll: false });
  }

  return (
    <>
      <div hidden={activeTool !== "crop-profit"}>
        <CropProfitTool
          locale={locale}
          onSelectTool={selectTool}
          onViewGrowth={viewGrowthCalendar}
        />
      </div>
      <div hidden={activeTool !== "crop-growth"}>
        <CropGrowthTool
          locale={locale}
          onSelectTool={selectTool}
          requestedCropId={requestedCropId}
          requestedGrowthForm={requestedGrowthForm}
        />
      </div>
    </>
  );
}
