import type { ReactNode } from "react";
import { PlantingToolsLayout } from "../../../src/tools-pages/planting-tools-layout";
import { ProcessingToolsLayout } from "../../../src/tools-pages/processing/processing-tools-layout";

export default function EnglishToolsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <PlantingToolsLayout locale="en">
      <ProcessingToolsLayout locale="en">{children}</ProcessingToolsLayout>
    </PlantingToolsLayout>
  );
}
