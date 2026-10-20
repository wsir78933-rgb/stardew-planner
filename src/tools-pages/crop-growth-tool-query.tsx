"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStaticLocationSearch } from "../components/blog/use-static-location-search";
import type { PublicLocale } from "../i18n/public-locale";
import { CropGrowthTool } from "./crop-growth-tool";
import { CropProfitTool } from "./crop-profit-tool";
import type { PlantingToolId } from "./planting-tool-frame";

type CropGrowthToolQueryProperties = Readonly<{
  locale: PublicLocale;
  requestedCropId?: string | null;
  onSelectTool?: (tool: PlantingToolId) => void;
}>;

export function CropGrowthToolQuery({
  locale,
  requestedCropId,
  onSelectTool,
}: CropGrowthToolQueryProperties) {
  const searchParams = useSearchParams();
  const cropParameter = requestedCropId === undefined ? searchParams.get("crop") : requestedCropId;

  return (
    <CropGrowthTool
      locale={locale}
      onSelectTool={onSelectTool}
      requestedCropId={cropParameter}
    />
  );
}

function readPlantingToolFromSearch(locationSearch: string): PlantingToolId {
  const toolParameter = new URLSearchParams(locationSearch).get("tool");
  if (toolParameter === null || toolParameter === "profit") {
    return "crop-profit";
  }

  if (toolParameter === "growth") {
    return "crop-growth";
  }

  throw new Error(`Unknown planting tool. Received: ${JSON.stringify(toolParameter)}.`);
}

export function CropProfitPathTool({ locale }: CropGrowthToolQueryProperties) {
  const locationSearch = useStaticLocationSearch();
  const [selectedTool, setSelectedTool] = useState<PlantingToolId | null>(null);
  const [requestedCropId, setRequestedCropId] = useState<string | null>(null);
  const visibleTool = selectedTool ?? readPlantingToolFromSearch(locationSearch);

  useEffect(() => {
    function clearSelectedToolAfterPopState() {
      setSelectedTool(null);
    }

    window.addEventListener("popstate", clearSelectedToolAfterPopState);
    return () => window.removeEventListener("popstate", clearSelectedToolAfterPopState);
  }, []);

  function selectTool(tool: PlantingToolId, cropId?: string) {
    const pathname = window.location.pathname;
    if (tool === "crop-growth") {
      const nextSearch = new URLSearchParams();
      nextSearch.set("tool", "growth");
      if (cropId !== undefined && cropId !== "") {
        nextSearch.set("crop", cropId);
        setRequestedCropId(cropId);
      }
      window.history.replaceState(null, "", `${pathname}?${nextSearch.toString()}`);
    } else {
      window.history.replaceState(null, "", pathname);
    }

    setSelectedTool(tool);
  }

  return (
    <>
      <div hidden={visibleTool !== "crop-profit"}>
        <CropProfitTool locale={locale} onSelectTool={selectTool} />
      </div>
      <div hidden={visibleTool !== "crop-growth"}>
        <CropGrowthTool
          locale={locale}
          onSelectTool={selectTool}
          requestedCropId={requestedCropId}
        />
      </div>
    </>
  );
}
