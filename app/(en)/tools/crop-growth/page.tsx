"use client";

import { useEffect } from "react";
import { createCropGrowthRedirectHref } from "../../../../src/tools-pages/crop-growth-redirect";

export default function CropGrowthPage() {
  useEffect(() => {
    const cropId = new URLSearchParams(window.location.search).get("crop");
    window.location.replace(createCropGrowthRedirectHref("en", cropId));
  }, []);

  return <p>Opening planting.</p>;
}
