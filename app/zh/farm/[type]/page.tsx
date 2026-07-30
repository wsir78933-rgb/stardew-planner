import { notFound } from "next/navigation";
import { FarmGuideContent } from "../../../../src/components/farm-guide-content";
import { JsonLdScript } from "../../../../src/components/json-ld-script";
import { PublicPageLayout } from "../../../../src/components/public-page-layout";
import {
  createFarmGuidePageMetadata,
} from "../../../../src/i18n/page-metadata";
import { createFarmGuideArticleStructuredData } from "../../../../src/i18n/page-structured-data";
import { getLocalizedOfficialFarmGuide } from "../../../../src/i18n/public-content";
import {
  isOfficialFarmType,
  officialFarmTypes,
  type OfficialFarmType,
} from "../../../../src/reference/official-farm-guides";

export { officialFarmTypes } from "../../../../src/reference/official-farm-guides";

type ChineseFarmGuidePageProperties = Readonly<{
  params: Promise<{
    type: string;
  }>;
}>;

export function generateStaticParams(): { type: OfficialFarmType }[] {
  return officialFarmTypes.map((type) => ({ type }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ChineseFarmGuidePageProperties) {
  const { type: farmType } = await params;

  if (!isOfficialFarmType(farmType)) {
    notFound();
  }

  const farmGuide = getLocalizedOfficialFarmGuide("zh-CN", farmType);

  return createFarmGuidePageMetadata(
    "zh-CN",
    `/farm/${farmType}`,
    farmGuide.title,
  );
}

export default async function ChineseFarmGuidePage({
  params,
}: ChineseFarmGuidePageProperties) {
  const { type: farmType } = await params;

  if (!isOfficialFarmType(farmType)) {
    notFound();
  }

  const farmGuide = getLocalizedOfficialFarmGuide("zh-CN", farmType);

  return (
    <PublicPageLayout canonicalPath={`/farm/${farmType}`} locale="zh-CN">
      <JsonLdScript
        structuredData={createFarmGuideArticleStructuredData({
          locale: "zh-CN",
          canonicalPath: `/farm/${farmType}`,
          farmName: farmGuide.title,
        })}
      />
      <FarmGuideContent farmType={farmType} locale="zh-CN" />
    </PublicPageLayout>
  );
}
