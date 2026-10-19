import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";

const panelHookState = vi.hoisted(() => ({
  values: [] as unknown[],
  cursor: 0,
  beginRender() {
    this.cursor = 0;
  },
  reset() {
    this.values = [];
    this.cursor = 0;
  },
}));

vi.mock("react", async (importOriginal) => {
  const reactExports = await importOriginal<typeof import("react")>();

  return {
    ...reactExports,
    useState: ((initialValue: unknown) => {
      const stateIndex = panelHookState.cursor++;
      if (panelHookState.values[stateIndex] === undefined) {
        panelHookState.values[stateIndex] = initialValue;
      }

      const setState = (nextValue: unknown) => {
        panelHookState.values[stateIndex] = nextValue;
      };
      return [panelHookState.values[stateIndex], setState];
    }) as typeof reactExports.useState,
  };
});

import * as React from "react";
import {
  createInitialEditorBehaviorOptions,
  type EditorBehaviorOptions,
} from "../../src/editor/editor-behavior-options";
import { createInitialEditorDisplayOptions } from "../../src/editor/editor-display-options";
import {
  createInitialPlannerAmbienceOptions,
  setPlannerAmbienceWeather,
} from "../../src/editor/planner-ambience-options";
import {
  createInitialMapRenderOptions,
  setFarmCaveChoice,
  setFarmSpouseId,
} from "../../src/maps/map-render-options";
import type { MapRenderOptions } from "../../src/maps/map-render-options";
import { getEditorModalCopy } from "../../src/i18n/editor-modal-copy";
import { getRussianFarmSpouseDisplayName } from "../../src/i18n/planner-russian-display-names";
import {
  AmbienceConfigPanel,
  SettingsConfigPanel,
  ViewConfigPanel,
} from "../../src/components/editor-config-panels";
import { FarmSettingsPanel } from "../../src/components/farm-settings-panel";

type RenderedElement = React.ReactElement<Record<string, unknown>>;
type SettingsPanelProperties = React.ComponentProps<typeof SettingsConfigPanel>;

function expandPanelComponents(panelNode: ReactNode): ReactNode {
  if (Array.isArray(panelNode)) {
    return panelNode.map(expandPanelComponents);
  }

  if (!React.isValidElement(panelNode)) return panelNode;

  const panelElement = panelNode as RenderedElement;
  if (typeof panelElement.type === "function") {
    const panelComponent = panelElement.type as unknown as (
      properties: Record<string, unknown>,
    ) => ReactNode;
    const componentOutput = panelComponent(panelElement.props);
    return expandPanelComponents(componentOutput);
  }

  return React.cloneElement(panelElement, {
    ...panelElement.props,
    children: expandPanelComponents(panelElement.props.children as ReactNode),
  });
}

function findElement(
  panelNode: ReactNode,
  elementType: string,
  matches: (properties: Record<string, unknown>) => boolean = () => true,
): RenderedElement | undefined {
  if (Array.isArray(panelNode)) {
    for (const childNode of panelNode) {
      const matchingElement = findElement(childNode, elementType, matches);
      if (matchingElement) return matchingElement;
    }
    return undefined;
  }

  if (!React.isValidElement(panelNode)) return undefined;

  const panelElement = panelNode as RenderedElement;
  if (
    panelElement.type === elementType &&
    matches(panelElement.props)
  ) {
    return panelElement;
  }

  return findElement(
    panelElement.props.children as ReactNode,
    elementType,
    matches,
  );
}

function requireElement(
  panelNode: ReactNode,
  elementType: string,
  matches?: (properties: Record<string, unknown>) => boolean,
): RenderedElement {
  const matchingElement = findElement(panelNode, elementType, matches);
  if (!matchingElement) {
    throw new Error(`Expected a ${elementType} element in the configuration panel.`);
  }
  return matchingElement;
}

function textContent(panelNode: ReactNode): string {
  if (
    panelNode === null ||
    panelNode === undefined ||
    typeof panelNode === "boolean"
  ) {
    return "";
  }
  if (typeof panelNode === "string" || typeof panelNode === "number") {
    return String(panelNode);
  }
  if (Array.isArray(panelNode)) return panelNode.map(textContent).join("");
  if (React.isValidElement(panelNode)) {
    return textContent((panelNode as RenderedElement).props.children as ReactNode);
  }
  return "";
}

function requireButton(
  panelNode: ReactNode,
  label: string,
): RenderedElement {
  return requireElement(
    panelNode,
    "button",
    (properties) => textContent(properties.children as ReactNode).trim().startsWith(label),
  );
}

function clickButton(button: RenderedElement): void {
  if (button.props.disabled === true) {
    throw new Error("A disabled configuration button cannot be activated.");
  }

  const onClick = button.props.onClick;
  if (typeof onClick !== "function") {
    throw new Error("The configuration button does not expose an onClick handler.");
  }
  onClick();
}

function renderSettingsPanel(properties: SettingsPanelProperties): ReactNode {
  panelHookState.beginRender();
  const componentNode = SettingsConfigPanel(properties);
  return expandPanelComponents(componentNode);
}

afterEach(() => {
  panelHookState.reset();
  vi.restoreAllMocks();
});

it("routes weather, season, and night controls through their public callbacks", () => {
  const ambienceOptions = createInitialPlannerAmbienceOptions();
  const onAmbienceChange = vi.fn();
  const onSeasonChange = vi.fn();
  const onNightModeToggle = vi.fn();
  const ambiencePanel = expandPanelComponents(
    AmbienceConfigPanel({
      locale: "en",
      season: "spring",
      ambienceOptions,
      nightMode: false,
      onSeasonChange,
      onAmbienceChange,
      onNightModeToggle,
    }),
  );

  clickButton(requireButton(ambiencePanel, "Rain"));
  expect(onAmbienceChange).toHaveBeenCalledExactlyOnceWith(
    setPlannerAmbienceWeather(ambienceOptions, "rain"),
  );

  const seasonButton = requireElement(
    ambiencePanel,
    "button",
    (properties) => properties["aria-label"] === "Summer",
  );
  clickButton(seasonButton);
  expect(onSeasonChange).toHaveBeenCalledExactlyOnceWith("summer");

  clickButton(requireButton(ambiencePanel, "Night mode"));
  expect(onNightModeToggle).toHaveBeenCalledOnce();
});

it("toggles range and resource-clump options and disables NPC paths on unsupported maps", () => {
  const displayOptions = createInitialEditorDisplayOptions();
  const behaviorOptions = createInitialEditorBehaviorOptions();
  const onDisplayToggle = vi.fn();
  const onBehaviorChange = vi.fn();
  const viewPanel = expandPanelComponents(
    ViewConfigPanel({
      locale: "en",
      behaviorOptions,
      displayOptions,
      selectedMapId: "standard",
      panelPosition: "left",
      onBehaviorChange,
      onDisplayToggle,
      onPanelPositionChange: vi.fn(),
    }),
  );

  expect(textContent(viewPanel)).not.toContain("Wheel zoom");

  clickButton(requireButton(viewPanel, "Sprinkler"));
  expect(onDisplayToggle).toHaveBeenCalledExactlyOnceWith("showSprinklerRadius");

  clickButton(requireButton(viewPanel, "Resource clumps"));
  expect(onBehaviorChange).toHaveBeenCalledExactlyOnceWith(
    "autoShowResourceClumps",
    true,
  );

  const unsupportedNpcPathButton = requireButton(viewPanel, "NPC paths");
  expect(unsupportedNpcPathButton.props.disabled).toBe(true);
  expect(unsupportedNpcPathButton.props.title).toBe(
    "NPC paths are unavailable on this map",
  );
  expect(onDisplayToggle).toHaveBeenCalledTimes(1);

  const supportedNpcPathChange = vi.fn();
  const busStopPanel = expandPanelComponents(
    ViewConfigPanel({
      locale: "en",
      behaviorOptions,
      displayOptions,
      selectedMapId: "bus-stop",
      panelPosition: "left",
      onBehaviorChange: vi.fn(),
      onDisplayToggle: supportedNpcPathChange,
      onPanelPositionChange: vi.fn(),
    }),
  );

  expect(textContent(busStopPanel)).not.toContain("Wheel zoom");
  const supportedNpcPathButton = requireButton(busStopPanel, "NPC paths");
  expect(supportedNpcPathButton.props.disabled).toBe(false);
  clickButton(supportedNpcPathButton);
  expect(supportedNpcPathChange).toHaveBeenCalledExactlyOnceWith("showNpcPaths");
});

it("sends spouse and cave values through public setters only on eligible farm maps", () => {
  let selectedMapRenderOptions = createInitialMapRenderOptions();
  const onMapRenderOptionsChange = vi.fn((nextOptions: MapRenderOptions) => {
    selectedMapRenderOptions = nextOptions;
  });
  const renderFarmPanel = (selectedMapId: string) =>
    expandPanelComponents(
      FarmSettingsPanel({
        locale: "en",
        selectedMapId,
        mapRenderOptions: selectedMapRenderOptions,
        onMapRenderOptionsChange,
      }),
    );

  const standardFarmPanel = renderFarmPanel("standard");
  clickButton(requireButton(standardFarmPanel, "Abigail"));
  expect(onMapRenderOptionsChange).toHaveBeenLastCalledWith(
    setFarmSpouseId(createInitialMapRenderOptions(), "Abigail"),
  );

  const farmPanelAfterSpouseSelection = renderFarmPanel("standard");
  clickButton(requireButton(farmPanelAfterSpouseSelection, "Bats"));
  expect(onMapRenderOptionsChange).toHaveBeenLastCalledWith(
    setFarmCaveChoice(selectedMapRenderOptions, "bats"),
  );
  expect(selectedMapRenderOptions.farm).toEqual({
    spouseId: "Abigail",
    caveChoice: "bats",
  });

  const gingerIslandPanel = renderFarmPanel("ginger-island");
  expect(findElement(gingerIslandPanel, "button", (properties) =>
    textContent(properties.children as ReactNode).trim() === "Abigail",
  )).toBeUndefined();
  expect(findElement(gingerIslandPanel, "button", (properties) =>
    textContent(properties.children as ReactNode).trim() === "Bats",
  )).toBeUndefined();
  expect(onMapRenderOptionsChange).toHaveBeenCalledTimes(2);
});

it("keeps English and Chinese spouse and cave labels with the selected state", () => {
  const mapRenderOptions = setFarmCaveChoice(
    setFarmSpouseId(createInitialMapRenderOptions(), "Abigail"),
    "bats",
  );
  const onMapRenderOptionsChange = vi.fn();
  const englishPanel = expandPanelComponents(
    FarmSettingsPanel({
      locale: "en",
      selectedMapId: "standard",
      mapRenderOptions,
      onMapRenderOptionsChange,
    }),
  );

  expect(textContent(englishPanel)).toContain("Spouse");
  expect(textContent(englishPanel)).toContain("Cave");
  expect(requireButton(englishPanel, "None").props["aria-pressed"]).toBe(false);
  expect(requireButton(englishPanel, "Abigail").props["aria-pressed"]).toBe(true);
  expect(requireButton(englishPanel, "Not chosen").props["aria-pressed"]).toBe(false);
  expect(requireButton(englishPanel, "Bats").props["aria-pressed"]).toBe(true);
  expect(findElement(englishPanel, "input")).toBeUndefined();
  expect(findElement(englishPanel, "select")).toBeUndefined();

  const chinesePanel = expandPanelComponents(
    FarmSettingsPanel({
      locale: "zh",
      selectedMapId: "standard",
      mapRenderOptions,
      onMapRenderOptionsChange,
    }),
  );

  expect(textContent(chinesePanel)).toContain("配偶");
  expect(textContent(chinesePanel)).toContain("洞穴");
  expect(requireButton(chinesePanel, "无").props["aria-pressed"]).toBe(false);
  expect(requireButton(chinesePanel, "Abigail").props["aria-pressed"]).toBe(true);
  expect(requireButton(chinesePanel, "未选择").props["aria-pressed"]).toBe(false);
  expect(requireButton(chinesePanel, "蘑菇").props["aria-pressed"]).toBe(false);
  expect(requireButton(chinesePanel, "蝙蝠").props["aria-pressed"]).toBe(true);
});

it("explains maps without a spouse patio or farm cave and omits island and renovation controls", () => {
  const mapRenderOptions = createInitialMapRenderOptions();
  const onMapRenderOptionsChange = vi.fn();
  const unsupportedFarmSettingsMessage =
    "This map has no spouse patio or farm cave. 这张地图没有配偶庭院或农场洞穴。";
  const renderFarmSettings = (selectedMapId: string, locale: "en" | "zh") =>
    expandPanelComponents(
      FarmSettingsPanel({
        locale,
        selectedMapId,
        mapRenderOptions,
        onMapRenderOptionsChange,
      }),
    );

  for (const locale of ["en", "zh"] as const) {
    const gingerIslandPanel = renderFarmSettings("ginger-island", locale);
    expect(textContent(gingerIslandPanel)).toBe(unsupportedFarmSettingsMessage);
    expect(textContent(gingerIslandPanel)).not.toContain("Ginger Island");
    expect(findElement(gingerIslandPanel, "button")).toBeUndefined();
    expect(findElement(gingerIslandPanel, "input")).toBeUndefined();
    expect(findElement(gingerIslandPanel, "select")).toBeUndefined();

    const farmhousePanel = renderFarmSettings("farmhouse-2", locale);
    expect(textContent(farmhousePanel)).toBe(unsupportedFarmSettingsMessage);
    expect(textContent(farmhousePanel)).not.toContain("Farmhouse (Upgrade 2)");
    expect(textContent(farmhousePanel)).not.toContain("Married layout");
    expect(textContent(farmhousePanel)).not.toContain("Renovations");
    expect(findElement(farmhousePanel, "input")).toBeUndefined();
  }

  const farmCavePanel = renderFarmSettings("farm-cave", "en");
  expect(textContent(farmCavePanel)).not.toContain(unsupportedFarmSettingsMessage);
  expect(textContent(farmCavePanel)).not.toContain("Spouse");
  expect(findElement(farmCavePanel, "button", (properties) =>
    textContent(properties.children as ReactNode).trim() === "Abigail",
  )).toBeUndefined();
  expect(requireButton(farmCavePanel, "Bats").props["aria-pressed"]).toBe(false);
  expect(onMapRenderOptionsChange).not.toHaveBeenCalled();
});

it("renders Russian spouse names from the public getter and Russian cave labels", () => {
  const mapRenderOptions = setFarmCaveChoice(
    setFarmSpouseId(createInitialMapRenderOptions(), "Abigail"),
    "bats",
  );
  const russianAbigailName = getRussianFarmSpouseDisplayName("Abigail");
  const russianPanel = expandPanelComponents(
    FarmSettingsPanel({
      locale: "ru",
      selectedMapId: "standard",
      mapRenderOptions,
      onMapRenderOptionsChange: vi.fn(),
    }),
  );
  const unsupportedMapPanel = expandPanelComponents(
    FarmSettingsPanel({
      locale: "ru",
      selectedMapId: "ginger-island",
      mapRenderOptions: createInitialMapRenderOptions(),
      onMapRenderOptionsChange: vi.fn(),
    }),
  );

  if (russianAbigailName === "Abigail") {
    throw new Error(
      'Russian farm spouse name for "Abigail" is still the English label.',
    );
  }

  expect(textContent(russianPanel)).toContain("Супруг");
  expect(textContent(russianPanel)).toContain("Пещера");
  expect(requireButton(russianPanel, "Нет").props["aria-pressed"]).toBe(false);
  expect(requireButton(russianPanel, russianAbigailName).props["aria-pressed"]).toBe(true);
  expect(requireButton(russianPanel, "Не выбрано").props["aria-pressed"]).toBe(false);
  expect(requireButton(russianPanel, "Летучие мыши").props["aria-pressed"]).toBe(true);
  expect(requireButton(russianPanel, "Грибы").props["aria-pressed"]).toBe(false);
  expect(textContent(russianPanel)).not.toContain("Spouse");
  expect(textContent(russianPanel)).not.toContain("配偶");
  expect(textContent(unsupportedMapPanel)).toBe(
    "На этой карте нет дворика супруга и фермерской пещеры.",
  );
  expect(textContent(unsupportedMapPanel)).not.toContain(
    "This map has no spouse patio or farm cave.",
  );
});

it("rejects a farm settings locale outside en, zh, and ru", () => {
  expect(() =>
    FarmSettingsPanel({
      locale: "zh-CN" as "en",
      selectedMapId: "standard",
      mapRenderOptions: createInitialMapRenderOptions(),
      onMapRenderOptionsChange: vi.fn(),
    }),
  ).toThrow('Farm settings locale must be "en", "zh", or "ru"; received "zh-CN".');
});

it("dispatches free placement only after confirmation and supports cancellation", () => {
  const settingsBaseProperties: SettingsPanelProperties = {
    locale: "en",
    behaviorOptions: createInitialEditorBehaviorOptions(),
    copy: getEditorModalCopy("en").settings,
    onBehaviorChange: vi.fn(),
  };
  const onBehaviorChange = settingsBaseProperties.onBehaviorChange as ReturnType<typeof vi.fn>;
  let settingsPanel = renderSettingsPanel(settingsBaseProperties);

  clickButton(requireButton(settingsPanel, "Free Placement"));
  settingsPanel = renderSettingsPanel(settingsBaseProperties);
  expect(requireElement(settingsPanel, "div", (properties) => properties.role === "alert"))
    .toBeDefined();
  expect(onBehaviorChange).not.toHaveBeenCalled();

  clickButton(requireButton(settingsPanel, "Enable Free Placement"));
  expect(onBehaviorChange).toHaveBeenCalledExactlyOnceWith("freePlacement", true);
  settingsPanel = renderSettingsPanel(settingsBaseProperties);
  expect(findElement(settingsPanel, "div", (properties) => properties.role === "alert"))
    .toBeUndefined();

  const cancelBehaviorChange = vi.fn();
  const cancelProperties = {
    ...settingsBaseProperties,
    onBehaviorChange: cancelBehaviorChange,
  };
  settingsPanel = renderSettingsPanel(cancelProperties);
  clickButton(requireButton(settingsPanel, "Free Placement"));
  settingsPanel = renderSettingsPanel(cancelProperties);
  clickButton(requireButton(settingsPanel, "Cancel"));
  expect(cancelBehaviorChange).not.toHaveBeenCalled();
  settingsPanel = renderSettingsPanel(cancelProperties);
  expect(findElement(settingsPanel, "div", (properties) => properties.role === "alert"))
    .toBeUndefined();
});

it("updates the cursor mode through the behavior callback", () => {
  const behaviorOptions: EditorBehaviorOptions = {
    ...createInitialEditorBehaviorOptions(),
    gameCursors: true,
  };
  const onBehaviorChange = vi.fn();
  const settingsPanel = renderSettingsPanel({
    locale: "en",
    behaviorOptions,
    copy: getEditorModalCopy("en").settings,
    onBehaviorChange,
  });

  expect(requireButton(settingsPanel, "Game").props["aria-pressed"]).toBe(true);
  expect(requireButton(settingsPanel, "System").props["aria-pressed"]).toBe(false);
  clickButton(requireButton(settingsPanel, "System"));
  expect(onBehaviorChange).toHaveBeenCalledExactlyOnceWith("gameCursors", false);
});
