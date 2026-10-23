import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { CaskAgingTool } from "../../src/tools-pages/processing/cask-aging-tool";

function assertLabelledCombobox(markup: string, controlId: string, label: string): void {
  const escapedControlId = controlId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  expect(markup).toMatch(
    new RegExp(
      `<label\\b(?=[^>]*for="${escapedControlId}")(?=[^>]*id="${escapedControlId}-label")[^>]*>\\s*${escapedLabel}\\s*</label>`,
    ),
  );
  expect(markup).toMatch(
    new RegExp(
      `<button\\b(?=[^>]*id="${escapedControlId}")(?=[^>]*role="combobox")(?=[^>]*aria-labelledby="${escapedControlId}-label")[^>]*>`,
    ),
  );
}

it.each([
  {
    locale: "en" as const,
    title: "Wine Cask Aging Calculator",
    settings: "Wine and cellar settings",
    fruit: "Fruit used for this wine",
    currentQuality: "Current wine quality",
    targetQuality: "Quality to age to",
    season: "Season loaded into Casks",
    targetTable: "Compare aging targets",
    profession: "Sale profession",
    kegHref: "/tools/keg-processing",
  },
  {
    locale: "zh-CN" as const,
    title: "酒窖陈酿计算器",
    settings: "葡萄酒与酒窖设置",
    fruit: "酿酒水果",
    currentQuality: "当前葡萄酒品质",
    targetQuality: "目标品质",
    season: "装桶季节",
    targetTable: "对比陈酿目标",
    profession: "出售职业",
    kegHref: "/zh/tools/keg-processing",
  },
])("renders the $locale wine cask tool with labelled controls and result tables", (expected) => {
  const markup = renderToStaticMarkup(<CaskAgingTool locale={expected.locale} />);

  expect(markup).not.toMatch(/<main\b/);
  expect(markup).toContain('<section aria-labelledby="cask-aging-title"');
  expect(markup.match(/<h1\b/g) ?? []).toHaveLength(0);
  expect(markup).toContain(`<h2 id="cask-aging-title">${expected.title}</h2>`);
  expect(markup).toContain(expected.settings);
  expect(markup).toContain(expected.currentQuality);
  expect(markup).toContain(expected.targetQuality);
  expect(markup).toContain(expected.profession);
  expect(markup).toContain(expected.season);
  expect(markup).toContain('id="cask-aging-day"');
  expect(markup).toContain('id="cask-aging-year"');
  expect(markup).toContain('id="cask-aging-bottle-count"');
  expect(markup).toContain('id="cask-aging-empty-cask-count"');
  expect(markup).toContain(expected.targetTable);
  expect(markup).toContain('scope="col"');
  expect(markup).toContain('scope="row"');
  expect(markup).toContain('href="' + expected.kegHref + '"');

  assertLabelledCombobox(markup, "cask-aging-ingredient", expected.fruit);
  assertLabelledCombobox(markup, "cask-aging-current-quality", expected.currentQuality);
  assertLabelledCombobox(markup, "cask-aging-target-quality", expected.targetQuality);
  assertLabelledCombobox(markup, "cask-aging-season", expected.season);
  assertLabelledCombobox(markup, "cask-aging-profession", expected.profession);
  expect(markup.match(/role="combobox"/g) ?? []).toHaveLength(5);
});

it("shows Cask capacity and craft-material reference values", () => {
  const markup = renderToStaticMarkup(<CaskAgingTool locale="en" />);

  for (const referenceCount of [33, 118, 125, 189]) {
    expect(markup).toContain(`<strong>${referenceCount}</strong>`);
  }
  expect(markup).toContain("Reachable by mouse and keyboard");
  expect(markup).toContain("Fully packed; move a Cask to collect");
  expect(markup).toContain(
    "This tool currently models Wine aging in the cellar; Keg brewing time is separate. Each Cask needs 20 Wood and 1 Hardwood.",
  );
  expect(markup).toContain("112 days");
  expect(markup).toContain("assumes steady supply plus immediate Cask reloads");
  expect(markup).not.toContain("do not age cheese");
});

it("keeps Chinese control labels and capacity references localized", () => {
  const markup = renderToStaticMarkup(<CaskAgingTool locale="zh-CN" />);

  expect(markup).toContain("等待空桶的瓶数");
  expect(markup).toContain("所需木材");
  expect(markup).toContain("所需硬木");
  expect(markup).toContain("酒窖容量参考");
  expect(markup).toContain("扩建酒窖（移动端）");
  expect(markup).toContain("键鼠可达");
  expect(markup).toContain("全铺后需拆放木桶才能收取");
  expect(markup).toContain(
    "本工具目前计算果酒的酒窖陈酿；Keg 酿造时间另计。每只桶需20木材和1硬木。",
  );
  expect(markup).toContain("假设酒源持续供应，并在每桶完成后立即重新装桶");
  expect(markup).not.toContain("不处理奶酪");
});
