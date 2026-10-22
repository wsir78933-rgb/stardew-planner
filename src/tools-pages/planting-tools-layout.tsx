"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicPageShell } from "../components/public-page-shell";
import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath, type PublicCanonicalPath } from "../i18n/public-route-registry";
import { PlantingToolsWorkspace } from "./crop-growth-tool-query";
import type { PlantingToolId } from "./planting-tool-frame";

export type PlantingToolsLayoutProperties = Readonly<{
  locale: PublicLocale;
  children: ReactNode;
}>;

type PlantingToolRoute = Readonly<{
  currentTool: PlantingToolId;
  canonicalPath: PublicCanonicalPath;
}>;

function readPlantingToolRoute(pathname: string, locale: PublicLocale): PlantingToolRoute | null {
  const profitPathname = getLocalizedPublicPath(locale, "/tools/crop-profit");
  if (pathname === profitPathname) {
    return { currentTool: "crop-profit", canonicalPath: "/tools/crop-profit" };
  }

  const growthPathname = getLocalizedPublicPath(locale, "/tools/crop-growth");
  if (pathname === growthPathname) {
    return { currentTool: "crop-growth", canonicalPath: "/tools/crop-growth" };
  }

  return null;
}

export function PlantingToolsLayout({ locale, children }: PlantingToolsLayoutProperties) {
  const pathname = usePathname();
  const plantingToolRoute = readPlantingToolRoute(pathname, locale);

  if (plantingToolRoute === null) {
    return <>{children}</>;
  }

  // Keep the workspace in this shared layout so sibling tool routes retain both form drafts.
  return (
    <PublicPageShell canonicalPath={plantingToolRoute.canonicalPath} locale={locale}>
      <PlantingToolsWorkspace locale={locale} currentTool={plantingToolRoute.currentTool} />
      {children}
    </PublicPageShell>
  );
}
