import { publicLocales, type PublicLocale } from "../i18n/public-locale";
import type { PlantingToolId } from "./planting-tool-frame";

export type PlantingToolGuideFeatureSourceId =
  | "features-1"
  | "features-2"
  | "features-3"
  | "features-4"
  | "features-5";

export type PlantingToolGuideImage = Readonly<{
  src: string;
  width: number;
  height: number;
}>;

export type PlantingToolGuideFeatureMedia = Readonly<{
  sourceId: PlantingToolGuideFeatureSourceId;
  desktop: PlantingToolGuideImage;
  mobile: PlantingToolGuideImage;
}>;

export type PlantingToolGuideFeatureMediaList = readonly [
  PlantingToolGuideFeatureMedia,
  PlantingToolGuideFeatureMedia,
  PlantingToolGuideFeatureMedia,
  PlantingToolGuideFeatureMedia,
  PlantingToolGuideFeatureMedia,
];

const plantingToolGuideMediaByLocale: Readonly<
  Record<PublicLocale, Readonly<Record<PlantingToolId, PlantingToolGuideFeatureMediaList>>>
> = {
  en: {
    "crop-profit": [
      {
        sourceId: "features-1",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/en/desktop/features-1.png",
          width: 1248,
          height: 936,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/en/mobile/features-1.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-2",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/en/desktop/features-2.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/en/mobile/features-2.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-3",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/en/desktop/features-3.png",
          width: 800,
          height: 600,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/en/mobile/features-3.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-4",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/en/desktop/features-4.png",
          width: 1056,
          height: 792,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/en/mobile/features-4.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-5",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/en/desktop/features-5.png",
          width: 1200,
          height: 900,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/en/mobile/features-5.png",
          width: 784,
          height: 588,
        },
      },
    ],
    "crop-growth": [
      {
        sourceId: "features-1",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/en/desktop/features-1.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/en/mobile/features-1.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-2",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/en/desktop/features-2.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/en/mobile/features-2.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-3",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/en/desktop/features-3.png",
          width: 608,
          height: 456,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/en/mobile/features-3.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-4",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/en/desktop/features-4.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/en/mobile/features-4.png",
          width: 872,
          height: 654,
        },
      },
      {
        sourceId: "features-5",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/en/desktop/features-5.png",
          width: 800,
          height: 600,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/en/mobile/features-5.png",
          width: 784,
          height: 588,
        },
      },
    ],
  },
  "zh-CN": {
    "crop-profit": [
      {
        sourceId: "features-1",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/desktop/features-1.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/mobile/features-1.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-2",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/desktop/features-2.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/mobile/features-2.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-3",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/desktop/features-3.png",
          width: 800,
          height: 600,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/mobile/features-3.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-4",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/desktop/features-4.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/mobile/features-4.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-5",
        desktop: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/desktop/features-5.png",
          width: 1008,
          height: 756,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-profit/zh-CN/mobile/features-5.png",
          width: 784,
          height: 588,
        },
      },
    ],
    "crop-growth": [
      {
        sourceId: "features-1",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/desktop/features-1.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/mobile/features-1.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-2",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/desktop/features-2.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/mobile/features-2.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-3",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/desktop/features-3.png",
          width: 608,
          height: 456,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/mobile/features-3.png",
          width: 784,
          height: 588,
        },
      },
      {
        sourceId: "features-4",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/desktop/features-4.png",
          width: 896,
          height: 672,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/mobile/features-4.png",
          width: 872,
          height: 654,
        },
      },
      {
        sourceId: "features-5",
        desktop: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/desktop/features-5.png",
          width: 800,
          height: 600,
        },
        mobile: {
          src: "/images/planting-tool-guides/crop-growth/zh-CN/mobile/features-5.png",
          width: 784,
          height: 588,
        },
      },
    ],
  },
};

export function getPlantingToolGuideMedia(
  locale: PublicLocale,
  tool: PlantingToolId,
): PlantingToolGuideFeatureMediaList {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unsupported planting tool guide media locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  if (tool !== "crop-profit" && tool !== "crop-growth") {
    throw new Error(
      `Unsupported planting tool guide media tool. Received: ${JSON.stringify(tool)}.`,
    );
  }

  return plantingToolGuideMediaByLocale[locale][tool];
}
