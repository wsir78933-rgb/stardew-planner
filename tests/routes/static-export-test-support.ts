import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type StaticPageLocale = "en" | "zh-CN";

export type LocalizedStaticPage = Readonly<{
  locale: StaticPageLocale;
  outputPath: string;
}>;

export const staticExportDirectoryPath = join(process.cwd(), "out");

export const localizedStaticPages: readonly LocalizedStaticPage[] = [
  { locale: "en", outputPath: "index.html" },
  { locale: "en", outputPath: "farm-comparison.html" },
  { locale: "en", outputPath: "farm/standard.html" },
  { locale: "en", outputPath: "farm/riverland.html" },
  { locale: "en", outputPath: "farm/forest.html" },
  { locale: "en", outputPath: "farm/hilltop.html" },
  { locale: "en", outputPath: "farm/wilderness.html" },
  { locale: "en", outputPath: "farm/four-corners.html" },
  { locale: "en", outputPath: "farm/beach.html" },
  { locale: "en", outputPath: "farm/meadowlands.html" },
  { locale: "en", outputPath: "mods.html" },
  { locale: "zh-CN", outputPath: "zh.html" },
  { locale: "zh-CN", outputPath: "zh/farm-comparison.html" },
  { locale: "zh-CN", outputPath: "zh/farm/standard.html" },
  { locale: "zh-CN", outputPath: "zh/farm/riverland.html" },
  { locale: "zh-CN", outputPath: "zh/farm/forest.html" },
  { locale: "zh-CN", outputPath: "zh/farm/hilltop.html" },
  { locale: "zh-CN", outputPath: "zh/farm/wilderness.html" },
  { locale: "zh-CN", outputPath: "zh/farm/four-corners.html" },
  { locale: "zh-CN", outputPath: "zh/farm/beach.html" },
  { locale: "zh-CN", outputPath: "zh/farm/meadowlands.html" },
  { locale: "zh-CN", outputPath: "zh/mods.html" },
] as const;

export function readStaticPageHtml(staticPageOutputPath: string): string {
  const staticPagePath = join(staticExportDirectoryPath, staticPageOutputPath);

  if (!existsSync(staticPagePath)) {
    throw new Error(
      `Static export is missing ${JSON.stringify(staticPageOutputPath)} at ${staticPagePath}.`,
    );
  }

  return readFileSync(staticPagePath, "utf8");
}
