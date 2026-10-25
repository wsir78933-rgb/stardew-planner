import { describe, expect, it } from "vitest";
import { getPlanningToolRouteCopy } from "../../src/i18n/planning-tool-route-copy";
import { createPublicLanguageAlternates, getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import { getToolsNavigationModel, readToolsNavigationTool } from "../../src/tools-navigation/tools-navigation-model";
import { getPlanningToolHref, getPlanningToolPath, PLANNING_TOOL_IDS, readPlanningToolIdFromPathname } from "../../src/tools-pages/planning-tool-definition";
import { createKegCapacityProductionPlan, createProcessingProductionPlan } from "../../src/tools-pages/planning-tool-handoff";
import { createProductionPlanIncomingHref } from "../../src/tools-pages/production/production-plan-handoff";
import { parseProductionPlanShareFragment } from "../../src/production-tools/production-plan-state";
import { createKegCapacityPlanHandoff } from "../../src/workshop-tools/keg-capacity";

describe("planning tool public integration", () => {
  it.each(["en", "zh-CN"] as const)("resolves the shared production views from their localized pathnames in %s", (locale) => {
    expect(readPlanningToolIdFromPathname(locale, getPlanningToolHref(locale, "today-processing-list")))
      .toBe("today-processing-list");
    expect(readPlanningToolIdFromPathname(locale, getPlanningToolHref(locale, "production-schedule")))
      .toBe("production-schedule");
    expect(readPlanningToolIdFromPathname(locale, getPlanningToolHref(locale, "keg-count")))
      .toBe("keg-count");
    expect(readPlanningToolIdFromPathname(locale, "/tools/unknown-production-view"))
      .toBeNull();
  });

  it.each(["en", "zh-CN"] as const)("registers all four working tool entries and bilingual metadata in %s", (locale) => {
    const navigation = getToolsNavigationModel(locale);
    for (const toolId of PLANNING_TOOL_IDS) {
      const path = getPlanningToolPath(toolId);
      expect(readToolsNavigationTool(navigation, toolId).href).toBe(getLocalizedPublicPath(locale, path));
      expect(Object.keys(createPublicLanguageAlternates(path))).toEqual(["en", "zh-CN", "x-default"]);
      const copy = getPlanningToolRouteCopy(locale, toolId);
      expect(copy.metaTitle.length).toBeLessThanOrEqual(60);
      expect(copy.metaDescription.length).toBeLessThanOrEqual(160);
      expect(copy.comparison.products).toHaveLength(3);
      expect(copy.comparison.rows.length).toBeGreaterThanOrEqual(4);
      expect(copy.comparison.rows.every((row) => row.values.length === 3)).toBe(true);
      expect(copy.comparison.sources.length).toBeGreaterThanOrEqual(2);
      expect(copy.comparison.sources.every((source) => source.href.startsWith("https://"))).toBe(true);
    }
  });

  it("preserves actual stock, quality, valuation and machine settings through an editable incoming link", () => {
    const input = createProcessingProductionPlan({ ingredientId: "blueberry", quantity: 17, quality: "gold", profession: "artisan", deadlineDays: 14, machineCounts: { keg: 2, jar: 3, dehydrator: 1 }, mode: "capacity" });
    const href = createProductionPlanIncomingHref("zh-CN", input);
    const url = new URL(href, "https://example.test");
    expect(url.pathname).toBe("/zh/tools/today-processing-list");
    const parsed = parseProductionPlanShareFragment(url.hash);
    expect(parsed).toEqual(input);
    expect(parsed.inventory[0]).toMatchObject({ quantity: 17, reservedQuantity: 0, availableDay: 0, quality: "gold" });
  });

  it("does not turn a repeating harvest estimate into already owned inventory", () => {
    const handoff = createKegCapacityPlanHandoff({ ingredientId: "starfruit", quantity: 12, deadlineDays: 28, existingKegCount: 3, harvestIntervalDays: 7 });
    const plan = createKegCapacityProductionPlan(handoff);
    expect(plan.inventory).toHaveLength(1);
    expect(plan.inventory[0]).toMatchObject({ quantity: 12, availableDay: 0 });
    expect(plan.machineCounts).toEqual({ keg: 3, jar: 0, dehydrator: 0 });
  });

  it.each(["keg", "jar", "dehydrator"] as const)("does not transfer hidden machine counts from a %s-only view", (machine) => {
    const plan = createProcessingProductionPlan({ ingredientId: "blueberry", quantity: 17, quality: "gold", profession: "artisan", deadlineDays: 14, machineCounts: { keg: 2, jar: 3, dehydrator: 1 }, mode: "capacity" }, machine);
    expect(plan.machineCounts).toEqual({ keg: machine === "keg" ? 2 : 0, jar: machine === "jar" ? 3 : 0, dehydrator: machine === "dehydrator" ? 1 : 0 });
    expect(plan.inventory[0]).toMatchObject({ quantity: 17, quality: "gold" });
    expect(plan.profession).toBe("artisan");
  });
});
