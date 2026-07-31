import { notFound } from "next/navigation";
import { FarmGuideContent } from "../../../src/components/farm-guide-content";
import { JsonLdScript } from "../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../src/components/public-page-shell";
import {
  getOfficialFarmGuide,
  isOfficialFarmType,
  officialFarmGuides,
  officialFarmTypes,
  type OfficialFarmType,
} from "../../../src/reference/official-farm-guides";
import { createPublicPageMetadata } from "../../../src/seo/page-metadata";
import {
  createArticleStructuredData,
  createBreadcrumbListStructuredData,
} from "../../../src/seo/page-structured-data";

export { officialFarmTypes } from "../../../src/reference/official-farm-guides";

type FarmGuidePageProperties = Readonly<{
  params: Promise<{
    type: string;
  }>;
}>;

export function generateStaticParams(): { type: OfficialFarmType }[] {
  return officialFarmTypes.map((type) => ({ type }));
}

export const dynamicParams = false;

function resolveFarmGuide(farmType: string) {
  if (!isOfficialFarmType(farmType)) {
    notFound();
  }

  const farmGuide = getOfficialFarmGuide(farmType);

  if (!farmGuide) {
    notFound();
  }

  return farmGuide;
}

export async function generateMetadata({
  params,
}: FarmGuidePageProperties) {
  const { type: farmType } = await params;
  const farmGuide = resolveFarmGuide(farmType);
  const pathname = `/farm/${farmGuide.id}`;

  return createPublicPageMetadata({
    pathname,
    title: `${farmGuide.title} | Stardew Valley Farm Planner`,
    description: `${farmGuide.title} farm guide. ${farmGuide.bestFor}`,
    openGraphType: "article",
  });
}

export default async function FarmGuidePage({
  params,
}: FarmGuidePageProperties) {
  const { type: farmType } = await params;
  const farmGuide = resolveFarmGuide(farmType);
  const pathname = `/farm/${farmGuide.id}`;
  const description = `${farmGuide.title} farm guide. ${farmGuide.bestFor}`;
  const otherFarmGuides = officialFarmTypes
    .filter((otherFarmType) => otherFarmType !== farmGuide.id)
    .map((otherFarmType) => officialFarmGuides[otherFarmType]);

  return (
    <PublicPageShell>
      <FarmGuideContent
        farmGuide={farmGuide}
        otherFarmGuides={otherFarmGuides}
      />
      <JsonLdScript
        structuredData={createArticleStructuredData({
          headline: farmGuide.title,
          description,
          pathname,
        })}
      />
      <JsonLdScript
        structuredData={createBreadcrumbListStructuredData({
          items: [
            { name: "Stardew Planner", pathname: "/" },
            { name: "Farm types", pathname: "/farm-comparison" },
            { name: farmGuide.title, pathname },
          ],
        })}
      />
    </PublicPageShell>
  );
}
