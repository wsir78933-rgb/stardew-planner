import type { ReactNode } from "react";
import { PlantingToolsLayout } from "../../../src/tools-pages/planting-tools-layout";

export default function ChineseToolsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <PlantingToolsLayout locale="zh-CN">{children}</PlantingToolsLayout>;
}
