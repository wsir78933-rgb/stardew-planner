import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type {
  AnimationCatalog,
  AnimationControlDefinition,
} from "../../src/animations/animation-catalog";
import { PlacementAnimationControls } from "../../src/components/placement-animation-controls";
import {
  normalizeFishPondAnimationOptions,
  normalizePlacementAnimationOptions,
} from "../../src/components/planner-workspace";
import { PlannerChromeLocaleProvider } from "../../src/i18n/planner-chrome-locale";
import type { PlannerChromeLocale } from "../../src/homepage/homepage-locale";

const placementAnimationControls: readonly AnimationControlDefinition[] = [
  {
    kind: "select",
    key: "spriteState",
    choices: [
      { id: "idle", label: "Idle" },
      { id: "working", label: "Working" },
    ],
    disabledWhen: { field: "spriteState", value: "working" },
  },
  {
    kind: "select",
    key: "produce",
    choices: [{ id: "roe", label: "Roe", catalogItemId: "object_812" }],
  },
  { kind: "number", key: "population", minimum: 0, maximum: 10 },
  {
    kind: "multiSelect",
    key: "tankFish",
    choices: [{ id: "smelt", label: "Smelt" }],
  },
  {
    kind: "animalList",
    key: "animals",
    choices: [{ id: "cow", label: "Cow" }],
    maxCount: 4,
  },
  { kind: "checkbox", key: "fireplaceLit" },
  { kind: "checkbox", key: "millLoaded" },
  { kind: "checkbox", key: "millOutput" },
  {
    kind: "select",
    key: "millProduct",
    choices: [{ id: "246", label: "Flour" }],
  },
];

describe("placement animation controls", () => {
  it("renders only supplied controls with accessible labels and selected values", () => {
    const markup = renderPlacementAnimationControls("en", {
      controls: placementAnimationControls,
      onChange: () => undefined,
      options: {
        spriteState: "idle",
        produce: "roe",
        fishId: "smelt",
        population: 4,
        tankFish: ["smelt"],
        animals: [{ animalId: "cow" }],
        millLoaded: true,
        millOutput: true,
        millProduct: "246",
      },
    });

    expect(markup).toContain("Animation options");
    expect(markup).toContain('aria-label="Machine state"');
    expect(markup).toContain('aria-label="Pond produce"');
    expect(markup).toContain('aria-label="Fish population"');
    expect(markup).toContain('aria-label="Tank fish"');
    expect(markup).toContain(">Farm animals</legend>");
    expect(markup).toContain('aria-label="Fireplace lit"');
    expect(markup).toMatch(/aria-label="Mill input loaded"[^>]*checked=""/);
    expect(markup).toMatch(/aria-label="Show mill output"[^>]*checked=""/);
    expect(markup).toContain('aria-label="Mill product"');
    expect(markup).toContain('value="246" selected=""');
    expect(markup).toContain('aria-label="Remove animal Cow 1"');
    expect(markup).toContain(">Add animal</button>");
    expect(markup).toContain('value="roe" selected=""');
    expect(markup).toContain('value="4"');
  });

  it("renders an empty fish pond as population zero", () => {
    const markup = renderPlacementAnimationControls("en", {
      controls: [{ kind: "number", key: "population", minimum: 0, maximum: 10 }],
      onChange: () => undefined,
      options: { fishId: "smelt" },
    });

    expect(markup).toMatch(/aria-label="Fish population"[^>]*min="0"/);
    expect(markup).toContain('value="0"');
  });

  it("keeps an unavailable saved choice visible so it can be cleared", () => {
    const markup = renderPlacementAnimationControls("en", {
      controls: placementAnimationControls,
      onChange: () => undefined,
      options: { produce: "removed-product" },
    });

    expect(markup).toContain("Unavailable (removed-product)");
  });

  it("disables the machine output while the selected machine state is working", () => {
    const markup = renderPlacementAnimationControls("en", {
      controls: [
        {
          kind: "select",
          key: "spriteState",
          choices: [{ id: "working", label: "Working" }],
        },
        {
          kind: "select",
          key: "readyProduct",
          choices: [{ id: "cheese", label: "Cheese" }],
          disabledWhen: { field: "spriteState", value: "working" },
        },
      ],
      onChange: () => undefined,
      options: { spriteState: "working", readyProduct: "cheese" },
    });

    expect(markup).toMatch(/aria-label="Output item"[^>]*disabled=""/);
  });

  it("clamps fish population to the selected species maximum and clears newly invalid produce", () => {
    const animationCatalog = {
      controlsByCatalogItemId: {
        "building:Fish Pond": [
          { kind: "number", key: "population", minimum: 0, maximum: 10 },
          { kind: "select", key: "produce", choices: [] },
        ],
      },
      pondFishById: {
        "128": {
          id: "128",
          label: "Pufferfish",
          maxPopulation: 10,
          produce: [{ id: "roe", label: "Roe", requiredPopulation: 2, maximumStackSize: 999 }],
        },
        "163": {
          id: "163",
          label: "Legend",
          maxPopulation: 1,
          produce: [{ id: "roe", label: "Roe", requiredPopulation: 2, maximumStackSize: 999 }],
        },
      },
    } as unknown as AnimationCatalog;

    const normalizedOptions = normalizeFishPondAnimationOptions({
      animationCatalog,
      animationOptions: {
        fishId: "163",
        population: 8,
        produce: "roe",
      },
      catalogItemId: "building:Fish Pond",
    });

    expect(normalizedOptions).toEqual({ fishId: "163", population: 1 });
  });

  it("preserves a restored zero population and serializes a clamped population of one", () => {
    const animationCatalog = {
      controlsByCatalogItemId: {
        "building:Fish Pond": [
          { kind: "number", key: "population", minimum: 0, maximum: 10 },
          { kind: "select", key: "produce", choices: [] },
        ],
      },
      pondFishById: {
        "163": {
          id: "163",
          label: "Legend",
          maxPopulation: 1,
          produce: [],
        },
      },
    } as unknown as AnimationCatalog;

    const restoredEmptyPondOptions = normalizeFishPondAnimationOptions({
      animationCatalog,
      animationOptions: { fishId: "163", population: 0 },
      catalogItemId: "building:Fish Pond",
    });
    const oneFishPondOptions = normalizeFishPondAnimationOptions({
      animationCatalog,
      animationOptions: { fishId: "163", population: 7 },
      catalogItemId: "building:Fish Pond",
    });

    expect(restoredEmptyPondOptions).toEqual({ fishId: "163", population: 0 });
    expect(oneFishPondOptions).toEqual({ fishId: "163", population: 1 });
  });

  it("clears the pond produce when the fish changes to one whose threshold exceeds the clamped population", () => {
    const animationCatalog = {
      controlsByCatalogItemId: {
        "building:Fish Pond": [
          { kind: "select", key: "fishId", choices: [] },
          { kind: "number", key: "population", minimum: 0, maximum: 10 },
          { kind: "select", key: "produce", choices: [] },
        ],
      },
      pondFishById: {
        "128": {
          id: "128",
          label: "Pufferfish",
          maxPopulation: 10,
          produce: [{ id: "roe", label: "Roe", requiredPopulation: 2, maximumStackSize: 999 }],
        },
        "163": {
          id: "163",
          label: "Legend",
          maxPopulation: 1,
          produce: [{ id: "roe", label: "Roe", requiredPopulation: 2, maximumStackSize: 999 }],
        },
      },
    } as unknown as AnimationCatalog;

    const changedFishOptions = normalizeFishPondAnimationOptions({
      animationCatalog,
      animationOptions: { fishId: "163", population: 8, produce: "roe" },
      catalogItemId: "building:Fish Pond",
    });

    expect(changedFishOptions).toEqual({ fishId: "163", population: 1 });
  });

  it("clears a pet hat when the selected pet has no hat control", () => {
    const animationCatalog = {
      controlsByCatalogItemId: {
        "building:Pet Bowl": [
          { kind: "select", key: "petId", choices: [] },
          { kind: "select", key: "hatId", choices: [] },
        ],
      },
      petsById: {
        "Cat:0": {
          id: "Cat:0",
          label: "Cat 0",
          species: "Cat",
          breedId: "0",
          textureLocalPath: "/game-assets/1.6.15/animals/cat.png",
        },
        "Turtle:0": {
          id: "Turtle:0",
          label: "Turtle 0",
          species: "Turtle",
          breedId: "0",
          textureLocalPath: "/game-assets/1.6.15/animals/turtle.png",
        },
      },
    } as unknown as AnimationCatalog;

    const normalizedTurtleOptions = normalizePlacementAnimationOptions({
      animationCatalog,
      animationOptions: { petId: "Turtle:0", hatId: "23" },
      catalogItemId: "building:Pet Bowl",
    });
    const normalizedCatOptions = normalizePlacementAnimationOptions({
      animationCatalog,
      animationOptions: { petId: "Cat:0", hatId: "23" },
      catalogItemId: "building:Pet Bowl",
    });

    expect(normalizedTurtleOptions).toEqual({ petId: "Turtle:0" });
    expect(normalizedCatOptions).toEqual({ petId: "Cat:0", hatId: "23" });
  });

  it("clears stable hats and mill products when their public controls are hidden", () => {
    const animationCatalog = {
      controlsByCatalogItemId: {
        "building:Stable": [
          { kind: "checkbox", key: "horse" },
          { kind: "select", key: "hatId", choices: [{ id: "23", label: "Hat" }] },
        ],
        "building:Mill": [
          { kind: "checkbox", key: "millOutput" },
          { kind: "select", key: "millProduct", choices: [{ id: "246", label: "Flour" }] },
        ],
      },
      petsById: {},
      pondFishById: {},
    } as unknown as AnimationCatalog;

    expect(normalizePlacementAnimationOptions({
      animationCatalog,
      animationOptions: { horse: false, hatId: "23" },
      catalogItemId: "building:Stable",
    })).toEqual({ horse: false });
    expect(normalizePlacementAnimationOptions({
      animationCatalog,
      animationOptions: { millOutput: false, millProduct: "246" },
      catalogItemId: "building:Mill",
    })).toEqual({ millOutput: false });
  });

  it("shows loading and load-error states, while empty controls render nothing", () => {
    const loadingMarkup = renderPlacementAnimationControls("zh", {
      controls: null,
      onChange: () => undefined,
      options: undefined,
    });
    const errorMarkup = renderPlacementAnimationControls("ru", {
      controls: null,
      loadError: "local-animation-catalog",
      onChange: () => undefined,
      options: undefined,
    });
    const emptyMarkup = renderPlacementAnimationControls("ja", {
      controls: [],
      onChange: () => undefined,
      options: undefined,
    });

    expect(loadingMarkup).toContain("正在加载动态效果设置");
    expect(errorMarkup).toContain('role="alert"');
    expect(errorMarkup).toContain("Не удалось загрузить настройки анимации");
    expect(emptyMarkup).toBe("");
  });

  it("provides the mill-loaded checkbox label in all planner locales", () => {
    const expectedMillLoadedLabels: readonly Readonly<{
      locale: PlannerChromeLocale;
      label: string;
    }>[] = [
      { locale: "en", label: "Mill input loaded" },
      { locale: "zh", label: "磨坊已装入原料" },
      { locale: "ja", label: "風車に原料を投入" },
      { locale: "ru", label: "В мельницу загружено сырьё" },
    ];

    for (const expectedLabel of expectedMillLoadedLabels) {
      const markup = renderPlacementAnimationControls(expectedLabel.locale, {
        controls: [{ kind: "checkbox", key: "millLoaded" }],
        onChange: () => undefined,
        options: undefined,
      });
      expect(markup).toContain(`aria-label="${expectedLabel.label}"`);
    }
  });

  it("provides mill output and product labels in all planner locales", () => {
    const localizedMillLabels: readonly Readonly<{
      locale: PlannerChromeLocale;
      outputLabel: string;
      productLabel: string;
    }>[] = [
      { locale: "en", outputLabel: "Show mill output", productLabel: "Mill product" },
      { locale: "zh", outputLabel: "显示磨坊产出", productLabel: "磨坊产物" },
      { locale: "ja", outputLabel: "風車の生産物を表示", productLabel: "風車の生産物" },
      { locale: "ru", outputLabel: "Показать продукцию мельницы", productLabel: "Продукт мельницы" },
    ];

    for (const localizedMillLabel of localizedMillLabels) {
      const markup = renderPlacementAnimationControls(localizedMillLabel.locale, {
        controls: [
          { kind: "checkbox", key: "millOutput" },
          { kind: "select", key: "millProduct", choices: [{ id: "246", label: "Flour" }] },
        ],
        onChange: () => undefined,
        options: { millOutput: true, millProduct: "246" },
      });
      expect(markup).toContain(`aria-label="${localizedMillLabel.outputLabel}"`);
      expect(markup).toContain(`aria-label="${localizedMillLabel.productLabel}"`);
    }
  });

  it("uses the existing Japanese display lookup when available and safely falls back for an unmapped game label", () => {
    const markup = renderPlacementAnimationControls("ja", {
      controls: [
        {
          kind: "select",
          key: "spriteState",
          choices: [
            { id: "working", label: "Auto-Petter" },
            { id: "idle", label: "Unmapped animal record" },
          ],
        },
      ],
      onChange: () => undefined,
      options: undefined,
    });

    expect(markup).toContain("自動ナデナデ装置");
    expect(markup).toContain("Unmapped animal record");
  });
});

function renderPlacementAnimationControls(
  locale: PlannerChromeLocale,
  properties: Parameters<typeof PlacementAnimationControls>[0],
): string {
  return renderToStaticMarkup(createElement(
    PlannerChromeLocaleProvider,
    {
      locale,
      children: createElement(PlacementAnimationControls, properties),
    },
  ));
}
