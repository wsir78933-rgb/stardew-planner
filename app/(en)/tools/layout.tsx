import type { ReactNode } from "react";
import { PlantingToolsLayout } from "../../../src/tools-pages/planting-tools-layout";

export default function EnglishToolsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <PlantingToolsLayout locale="en">{children}</PlantingToolsLayout>;
}
