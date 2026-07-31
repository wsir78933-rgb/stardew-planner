import { notFound } from "next/navigation";
import { FarmGuideContent } from "../../../../src/components/farm-guide-content";
import { JsonLdScript } from "../../../../src/components/json-ld-script";
import { PublicPageShell } from "../../../../src/components/public-page-shell";
import {
  formatPublicPageCopy,
  getLocalizedOfficialFarmGuide,
  getPublicPageCopy,
} from "../../../../src/i18n/public-page-content";
import { getLocalizedPublicPath } from "../../../../src/i18n/public-route-registry";
import {
  getOfficialFarmGuide,
  isOfficialFarmType,
  officialFarmGuides,
  officialFarmTypes,
  type OfficialFarmGuide,
  type OfficialFarmType,
} from "../../../../src/reference/official-farm-guides";
import { createPublicPageMetadata } from "../../../../src/seo/page-metadata";
import {
  createArticleStructuredData,
  createBreadcrumbListStructuredData,
} from "../../../../src/seo/page-structured-data";

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

function getChineseFarmMetadataCopy(farmGuide: OfficialFarmGuide) {
  const localizedFarmGuide = getLocalizedOfficialFarmGuide("zh-CN", farmGuide.id);
  const pageCopy = getPublicPageCopy("zh-CN");

  return {
    localizedFarmGuide,
    title: formatPublicPageCopy(pageCopy.farmGuideTitleTemplate, {
      farmName: localizedFarmGuide.title,
    }),
    description: formatPublicPageCopy(pageCopy.farmGuideDescriptionTemplate, {
      farmName: localizedFarmGuide.title,
    }),
  };
}

export async function generateMetadata({
  params,
}: ChineseFarmGuidePageProperties) {
  const { type: farmType } = await params;
  const farmGuide = resolveFarmGuide(farmType);
  const chineseFarmMetadataCopy = getChineseFarmMetadataCopy(farmGuide);
  const canonicalPath: `/farm/${OfficialFarmType}` = `/farm/${farmGuide.id}`;

  return createPublicPageMetadata({
    locale: "zh-CN",
    pathname: canonicalPath,
    title: chineseFarmMetadataCopy.title,
    description: chineseFarmMetadataCopy.description,
    openGraphType: "article",
  });
}

export default async function ChineseFarmGuidePage({
  params,
}: ChineseFarmGuidePageProperties) {
  const { type: farmType } = await params;
  const farmGuide = resolveFarmGuide(farmType);
  const chineseFarmMetadataCopy = getChineseFarmMetadataCopy(farmGuide);
  const pageCopy = getPublicPageCopy("zh-CN");
  const canonicalPath: `/farm/${OfficialFarmType}` = `/farm/${farmGuide.id}`;
  const localizedPathname = getLocalizedPublicPath("zh-CN", canonicalPath);
  const otherFarmGuides = officialFarmTypes
    .filter((otherFarmType) => otherFarmType !== farmGuide.id)
    .map((otherFarmType) => officialFarmGuides[otherFarmType]);

  return (
    <PublicPageShell canonicalPath={canonicalPath} locale="zh-CN">
      <FarmGuideContent
        farmGuide={farmGuide}
        locale="zh-CN"
        otherFarmGuides={otherFarmGuides}
      />
      <JsonLdScript
        structuredData={createArticleStructuredData({
          headline: chineseFarmMetadataCopy.localizedFarmGuide.title,
          description: chineseFarmMetadataCopy.description,
          pathname: localizedPathname,
        })}
      />
      <JsonLdScript
        structuredData={createBreadcrumbListStructuredData({
          items: [
            {
              name: pageCopy.brandLabel,
              pathname: getLocalizedPublicPath("zh-CN", "/"),
            },
            {
              name: pageCopy.farmTypesLabel,
              pathname: getLocalizedPublicPath("zh-CN", "/farm-comparison"),
            },
            {
              name: chineseFarmMetadataCopy.localizedFarmGuide.title,
              pathname: localizedPathname,
            },
          ],
        })}
      />
    </PublicPageShell>
  );
}
