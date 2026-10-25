import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getWorkshopToolCopy } from "../../src/i18n/workshop-tool-copy";
import { KegCapacityTool } from "../../src/tools-pages/workshop/keg-capacity-tool";
import { KegMaterialsTool } from "../../src/tools-pages/workshop/keg-materials-tool";
import type { PublicLocale } from "../../src/i18n/public-locale";

const locales = ["en", "zh-CN"] as const satisfies readonly PublicLocale[];

it("uses 小桶 consistently and identifies the source as the Keg count tool", () => {
  const copy = getWorkshopToolCopy("zh-CN");

  expect(JSON.stringify({ kegCapacity: copy.kegCapacity, kegMaterials: copy.kegMaterials }))
    .not.toContain("酒桶");
  expect(copy.kegMaterials.handoffApplied("长期")).toBe("已载入小桶数量工具传来的长期目标。");
});

describe.each(locales)("workshop tools SSR in %s", (locale) => {
  it("defaults to the current-stock scenario and keeps its result actions aligned", () => {
    const copy = getWorkshopToolCopy(locale).kegCapacity;
    const markup = renderToStaticMarkup(
      <KegCapacityTool locale={locale} onTestProductionPlan={() => undefined} />,
    );
    const localePrefix = locale === "en" ? "" : "/zh";

    expect(markup).toContain('data-workshop-keg-capacity="true"');
    expect(markup).toContain(copy.title);
    expect(markup).toContain(copy.scenarios.title);
    expect(markup).toContain(copy.scenarios.currentStock);
    expect(markup).toContain(copy.scenarios.ongoingProduction);
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain(copy.inputs.ingredient);
    expect(markup).toContain(copy.inputs.quantity);
    expect(markup).toContain(copy.inputs.deadline);
    expect(markup).toContain(copy.inputs.existingKegs);
    expect(markup).not.toContain(copy.inputs.harvestInterval);
    expect(markup).toContain(copy.currentStockPlan);
    expect(markup).not.toContain("<form");
    expect(markup).toContain('id="workshop-keg-capacity-deadline"');
    expect(markup).toContain('role="combobox"');
    expect(markup).toContain(`href="${localePrefix}/tools/keg-count"`);
    expect(markup).toContain(`href="${localePrefix}/tools/materials-and-resin"`);
    expect(markup.match(/aria-current="page"/g)).toHaveLength(1);
    expect(markup.indexOf(copy.currentStockPlan)).toBeLessThan(markup.indexOf(copy.resultsTitle));
    expect(markup).toContain(copy.scenarios.currentStockHelp);
    expect(markup).not.toContain(copy.inputHelp.harvestInterval);
  });

  it("renders the Keg materials controls, recipe statement, and tapper selector", () => {
    const pageCopy = getWorkshopToolCopy(locale);
    const copy = pageCopy.kegMaterials;
    const markup = renderToStaticMarkup(<KegMaterialsTool locale={locale} />);
    const localePrefix = locale === "en" ? "" : "/zh";
    const materialSectionOrder = [
      'id="workshop-keg-materials-target-kegs"',
      'id="workshop-keg-materials-inventory-title"',
      'id="workshop-keg-materials-inventory-wood"',
      'id="workshop-keg-materials-mature-oaks"',
      copy.copyMaterials,
      copy.reset,
    ].map((label) => markup.indexOf(label));

    expect(markup).toContain('data-workshop-keg-materials="true"');
    expect(markup).toContain(copy.title);
    expect(markup).toContain(copy.inputs.targetKegs);
    expect(markup).toContain(copy.inputs.existingKegs);
    expect(markup).toContain(copy.inputs.matureOakTappers);
    expect(markup).toContain(copy.inputs.waitingDays);
    expect(markup).toContain(copy.inputHelp.recipe);
    expect(markup).toContain(copy.inputHelp.exclusions);
    expect(markup).toContain('id="workshop-keg-materials-tapper-type"');
    expect(markup).toContain(`title="${copy.tapperTypes.regular}"`);
    expect(markup).not.toContain("<form");
    expect(markup).toContain(`href="${localePrefix}/tools/keg-count"`);
    expect(markup).toContain(`href="${localePrefix}/tools/materials-and-resin"`);
    expect(markup.match(/aria-current="page"/g)).toHaveLength(1);
    expect(materialSectionOrder.every((position) => position >= 0)).toBe(true);
    expect(materialSectionOrder).toEqual([...materialSectionOrder].sort((left, right) => left - right));
    expect(markup).not.toContain(pageCopy.resetConfirmation.prompt);
  });
});
