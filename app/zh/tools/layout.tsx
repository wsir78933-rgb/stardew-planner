import type { ReactNode } from "react";
import { PlantingToolsLayout } from "../../../src/tools-pages/planting-tools-layout";
import { ProcessingToolsLayout } from "../../../src/tools-pages/processing/processing-tools-layout";

export default function ChineseToolsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <PlantingToolsLayout locale="zh-CN">
      <ProcessingToolsLayout locale="zh-CN">{children}</ProcessingToolsLayout>
    </PlantingToolsLayout>
  );
}
