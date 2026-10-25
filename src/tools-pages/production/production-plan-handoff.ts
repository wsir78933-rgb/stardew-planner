import type { PublicLocale } from "@/src/i18n/public-locale";
import type { ProductionPlanInput } from "@/src/production-tools/production-model";
import { createProductionPlanShareFragment } from "@/src/production-tools/production-plan-state";

export function createProductionPlanIncomingHref(
  locale: PublicLocale,
  input: ProductionPlanInput,
): string {
  const routePrefix = getProductionTodayRoutePrefix(locale);
  return `${routePrefix}/tools/today-processing-list${createProductionPlanShareFragment(input)}`;
}

function getProductionTodayRoutePrefix(locale: PublicLocale): "" | "/zh" {
  if (locale === "en") return "";
  if (locale === "zh-CN") return "/zh";

  throw new Error(`Unsupported production plan locale. Received: ${JSON.stringify(locale)}.`);
}
