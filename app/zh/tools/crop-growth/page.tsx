"use client";

import { useEffect } from "react";
import { createCropGrowthRedirectHref } from "../../../../src/tools-pages/crop-growth-redirect";

export default function ChineseCropGrowthPage() {
  useEffect(() => {
    const cropId = new URLSearchParams(window.location.search).get("crop");
    window.location.replace(createCropGrowthRedirectHref("zh-CN", cropId));
  }, []);

  return <p>正在打开种植规划。</p>;
}
