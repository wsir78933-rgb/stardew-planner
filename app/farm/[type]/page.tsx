import { notFound } from "next/navigation";
import { ReferenceRuntimeHost } from "../../../src/components/reference-runtime-host";
import {
  officialFarmTypes,
  type OfficialFarmType,
} from "../../../src/reference/official-farm-guides";

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

function isOfficialFarmType(farmType: string): farmType is OfficialFarmType {
  return officialFarmTypes.includes(farmType as OfficialFarmType);
}

export default async function FarmGuidePage({
  params,
}: FarmGuidePageProperties) {
  const { type: farmType } = await params;

  if (!isOfficialFarmType(farmType)) {
    notFound();
  }

  return <ReferenceRuntimeHost />;
}
