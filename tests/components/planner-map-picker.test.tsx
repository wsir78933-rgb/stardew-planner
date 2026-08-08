import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  getInitialPlannerMapPickerState,
  getNextPlannerMapCommunityTab,
  getNextPlannerMapTab,
  getPlannerMapPickerStateForCategory,
  PlannerMapPicker,
} from "../../src/components/planner-map-picker";
import {
  plannerMaps,
  type PlannerMapCategory,
} from "../../src/maps/map-catalog";

function ignoreMapSelection(): void {}

describe("planner map picker", () => {
  it.each([
    ["standard", { activeCommunityTab: "farms", activeTopLevelTab: "farm" }],
    ["farmhouse-2", { activeCommunityTab: "farms", activeTopLevelTab: "interiors" }],
    ["bus-stop", { activeCommunityTab: "farms", activeTopLevelTab: "exteriors" }],
    [
      "sve-winery",
      { activeCommunityTab: "interiors", activeTopLevelTab: "community" },
    ],
    [
      "sve-grandpas-shed-2",
      { activeCommunityTab: "interiors", activeTopLevelTab: "community" },
    ],
  ] as const)("initializes the matching categories for %s", (selectedMapId, expectedState) => {
    expect(getInitialPlannerMapPickerState(selectedMapId)).toEqual(expectedState);
  });

  it("defaults null to Farm and rejects an unknown map id", () => {
    expect(getInitialPlannerMapPickerState(null)).toEqual({
      activeCommunityTab: "farms",
      activeTopLevelTab: "farm",
    });
    expect(() => getInitialPlannerMapPickerState("missing-map")).toThrow(
      "missing-map",
    );
  });

  it("handles Community/Interiors explicitly", () => {
    expect(getPlannerMapPickerStateForCategory("community-interior")).toEqual({
      activeCommunityTab: "interiors",
      activeTopLevelTab: "community",
    });
  });

  it("rejects an impossible map category with its value", () => {
    expect(() =>
      getPlannerMapPickerStateForCategory(
        "legacy-community" as PlannerMapCategory,
      ),
    ).toThrow("legacy-community");
  });

  it("renders only the nine Farm cards under ordered top-level tabs by default", () => {
    const pickerMarkup = renderMapPicker(null, "data-picker-map-id");

    expect(pickerMarkup.match(/role="tab"/g)).toHaveLength(4);
    expect(pickerMarkup.match(/role="tabpanel"/g)).toHaveLength(1);
    expect(pickerMarkup.match(/data-picker-map-id=/g)).toHaveLength(9);
    expect(pickerMarkup).toContain('aria-selected="true"');
    expectTextInOrder(pickerMarkup, ["Farm", "Interiors", "Exteriors", "Community"]);
    expect(pickerMarkup).toContain('data-picker-map-id="standard"');
    expect(pickerMarkup).not.toContain('data-picker-map-id="farmhouse-2"');
  });

  it("renders the selected Community/Farms cards and both community tabs", () => {
    const pickerMarkup = renderMapPicker("if2r", "data-picker-map-id");
    const communityTablistMarkup = getCommunityTablistMarkup(pickerMarkup);
    const farmsTabMarkup = getButtonMarkupByText(communityTablistMarkup, "Farms");
    const interiorsTabMarkup = getButtonMarkupByText(
      communityTablistMarkup,
      "Interiors",
    );
    const selectedMapButtonMarkup = getButtonMarkupByAttribute(
      pickerMarkup,
      'data-picker-map-id="if2r"',
    );

    expect(pickerMarkup.match(/role="tab"/g)).toHaveLength(6);
    expect(pickerMarkup.match(/data-picker-map-id=/g)).toHaveLength(18);
    expect(communityTablistMarkup.match(/role="tab"/g)).toHaveLength(2);
    expect(farmsTabMarkup).toContain('aria-selected="true"');
    expect(farmsTabMarkup).toContain('tabindex="0"');
    expect(farmsTabMarkup).toMatch(/id="[^"]+-community-tab-farms"/);
    expect(interiorsTabMarkup).toContain('aria-selected="false"');
    expect(interiorsTabMarkup).toContain('tabindex="-1"');
    expect(interiorsTabMarkup).toMatch(/id="[^"]+-community-tab-interiors"/);
    expect(pickerMarkup).toContain('data-picker-map-id="if2r"');
    expect(pickerMarkup).not.toContain('data-picker-map-id="sve-winery"');
    expect(selectedMapButtonMarkup).toContain('aria-pressed="true"');
  });

  it("renders Winery as the selected card in Community/Interiors with exact tab ARIA", () => {
    const pickerMarkup = renderMapPicker("sve-winery", "data-picker-map-id");
    const communityTablistMarkup = getCommunityTablistMarkup(pickerMarkup);
    const farmsTabMarkup = getButtonMarkupByText(communityTablistMarkup, "Farms");
    const interiorsTabMarkup = getButtonMarkupByText(
      communityTablistMarkup,
      "Interiors",
    );
    const activeTabPanelMarkup = getActiveTabPanelStartTag(pickerMarkup);
    const wineryButtonMarkup = getButtonMarkupByAttribute(
      pickerMarkup,
      'data-picker-map-id="sve-winery"',
    );

    expect(pickerMarkup.match(/data-picker-map-id=/g)).toHaveLength(3);
    expect(pickerMarkup).toContain('data-picker-map-id="sve-winery"');
    expect(pickerMarkup).toContain('data-picker-map-id="sve-grandpas-shed-2"');
    expect(pickerMarkup).not.toContain('data-picker-map-id="if2r"');
    expect(farmsTabMarkup).toContain('aria-selected="false"');
    expect(farmsTabMarkup).toContain('tabindex="-1"');
    expect(interiorsTabMarkup).toContain('aria-selected="true"');
    expect(interiorsTabMarkup).toContain('tabindex="0"');
    expect(activeTabPanelMarkup).toMatch(
      /aria-labelledby="([^"]+)-tab-community \1-community-tab-interiors"/,
    );
    expect(wineryButtonMarkup).toContain('aria-pressed="true"');
    expect(wineryButtonMarkup).toContain("Winery (SVE)");
  });

  it("uses the caller supplied data attribute name on every map card", () => {
    const pickerMarkup = renderMapPicker(null, "data-editor-map-id");

    expect(pickerMarkup.match(/data-editor-map-id=/g)).toHaveLength(9);
  });

  it.each([
    ["farm", "ArrowLeft", "community"],
    ["farm", "ArrowRight", "interiors"],
    ["exteriors", "Home", "farm"],
    ["interiors", "End", "community"],
    ["community", "Enter", null],
  ] as const)("moves %s with %s to %s", (currentTab, pressedKey, expectedTab) => {
    expect(getNextPlannerMapTab(currentTab, pressedKey)).toBe(expectedTab);
  });

  it.each([
    ["farms", "ArrowLeft", "interiors"],
    ["farms", "ArrowRight", "interiors"],
    ["interiors", "ArrowLeft", "farms"],
    ["interiors", "ArrowRight", "farms"],
    ["interiors", "Home", "farms"],
    ["farms", "End", "interiors"],
    ["farms", "Enter", null],
  ] as const)(
    "moves Community subtab %s with %s to %s",
    (currentTab, pressedKey, expectedTab) => {
      expect(getNextPlannerMapCommunityTab(currentTab, pressedKey)).toBe(
        expectedTab,
      );
    },
  );
});

function renderMapPicker(
  selectedMapId: string | null,
  mapIdDataAttribute: `data-${string}`,
): string {
  return renderToStaticMarkup(
    createElement(PlannerMapPicker, {
      mapIdDataAttribute,
      maps: plannerMaps,
      onMapSelect: ignoreMapSelection,
      selectedMapId,
    }),
  );
}

function expectTextInOrder(markup: string, expectedTexts: readonly string[]): void {
  let previousTextPosition = -1;

  for (const expectedText of expectedTexts) {
    const textPosition = markup.indexOf(`>${expectedText}<`);
    expect(textPosition).toBeGreaterThan(previousTextPosition);
    previousTextPosition = textPosition;
  }
}

function getCommunityTablistMarkup(pickerMarkup: string): string {
  const communityTablistMarkup = pickerMarkup.match(
    /<div aria-label="Community map categories"[^>]*>[\s\S]*?<\/div>/,
  )?.[0];

  if (!communityTablistMarkup) {
    throw new Error("Expected the Community map category tablist to be rendered.");
  }

  return communityTablistMarkup;
}

function getButtonMarkupByText(containerMarkup: string, buttonText: string): string {
  const buttonTextEnd = `>${buttonText}</button>`;
  const buttonTextEndPosition = containerMarkup.indexOf(buttonTextEnd);
  const buttonStartPosition = containerMarkup.lastIndexOf(
    "<button",
    buttonTextEndPosition,
  );

  if (buttonStartPosition === -1 || buttonTextEndPosition === -1) {
    throw new Error(`Expected a button with text ${buttonText}.`);
  }

  return containerMarkup.slice(
    buttonStartPosition,
    buttonTextEndPosition + buttonTextEnd.length,
  );
}

function getButtonMarkupByAttribute(
  containerMarkup: string,
  requiredAttribute: string,
): string {
  const attributePosition = containerMarkup.indexOf(requiredAttribute);
  const buttonStartPosition = containerMarkup.lastIndexOf(
    "<button",
    attributePosition,
  );
  const buttonEndPosition = containerMarkup.indexOf(
    "</button>",
    attributePosition,
  );

  if (
    attributePosition === -1 ||
    buttonStartPosition === -1 ||
    buttonEndPosition === -1
  ) {
    throw new Error(`Expected a button with attribute ${requiredAttribute}.`);
  }

  return containerMarkup.slice(buttonStartPosition, buttonEndPosition + 9);
}

function getActiveTabPanelStartTag(pickerMarkup: string): string {
  const activeTabPanelStartTag = pickerMarkup.match(
    /<div aria-labelledby="[^"]*" class="planner-map-picker__tabpanel"[^>]*>/,
  )?.[0];

  if (!activeTabPanelStartTag) {
    throw new Error("Expected the active map category tabpanel to be rendered.");
  }

  return activeTabPanelStartTag;
}
