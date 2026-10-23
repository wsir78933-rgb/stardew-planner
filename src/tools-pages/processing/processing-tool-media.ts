import { publicLocales, type PublicLocale } from "../../i18n/public-locale";
import {
  isProcessingToolId,
  type ProcessingToolId,
} from "./processing-tool-definition";

export type ProcessingToolGuideMediaSourceId = `features-${1 | 2 | 3 | 4 | 5}`;

export type ProcessingToolGuideMediaItem = Readonly<{
  sourceId: ProcessingToolGuideMediaSourceId;
  src: string;
  width: 512;
  height: 384;
}>;

const PROCESSING_TOOL_GUIDE_CASE_NUMBERS = [1, 2, 3, 4, 5] as const;

export function getProcessingToolGuideMedia(
  locale: PublicLocale,
  currentTool: ProcessingToolId,
): readonly ProcessingToolGuideMediaItem[] {
  if (!publicLocales.includes(locale)) {
    throw new Error(
      `Unknown processing guide media locale: ${JSON.stringify(locale)}.`,
    );
  }

  if (!isProcessingToolId(currentTool)) {
    throw new Error(
      `Unknown processing guide tool id: ${JSON.stringify(currentTool)}.`,
    );
  }

  return PROCESSING_TOOL_GUIDE_CASE_NUMBERS.map(
    (caseNumber): ProcessingToolGuideMediaItem => ({
      sourceId: `features-${caseNumber}` as ProcessingToolGuideMediaSourceId,
      src: `/tool-guides/processing/${currentTool}/${locale}/case-${caseNumber}.png`,
      width: 512,
      height: 384,
    }),
  );
}
