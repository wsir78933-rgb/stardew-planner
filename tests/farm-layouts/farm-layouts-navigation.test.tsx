import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { SiteNavigationDock } from "@/src/components/site-navigation-dock";
import { FarmLayoutsNavigation } from "@/src/farm-layouts/farm-layouts-navigation";
import {
  closeFarmLayoutsNavigationOnEscape,
  createClosedFarmLayoutsNavigationInteraction,
  moveFarmLayoutsNavigationFocus,
  openFarmLayoutsNavigationFromPointerHover,
  toggleFarmLayoutsNavigation,
} from "@/src/farm-layouts/farm-layouts-navigation-interaction";
import { getFarmLayoutsNavigationModel } from "@/src/farm-layouts/farm-layouts-navigation-model";

function renderFarmLayoutsNavigation(locale: "en" | "zh-CN" | "ja" | "ru") {
  return renderToStaticMarkup(<FarmLayoutsNavigation locale={locale} />);
}

test("localizes only the Chinese menu and uses the English page for ja and ru", () => {
  const englishMarkup = renderFarmLayoutsNavigation("en");
  const japaneseMarkup = renderFarmLayoutsNavigation("ja");
  const russianMarkup = renderFarmLayoutsNavigation("ru");
  const chineseMarkup = renderFarmLayoutsNavigation("zh-CN");

  expect(englishMarkup).toContain('href="/stardew-valley-beach-farm-layout"');
  expect(englishMarkup).toContain("Layout categories");
  expect(englishMarkup).toContain("Farm maps");
  expect(englishMarkup).toContain("Beach Farm Layouts");
  expect(japaneseMarkup).toContain("Layout categories");
  expect(japaneseMarkup).toContain('href="/stardew-valley-beach-farm-layout"');
  expect(russianMarkup).toContain("Layout categories");
  expect(russianMarkup).toContain('href="/stardew-valley-beach-farm-layout"');
  expect(chineseMarkup).toContain('href="/zh/stardew-valley-beach-farm-layout"');
  expect(chineseMarkup).toContain("布局分类");
  expect(chineseMarkup).toContain("农场地图");
  expect(chineseMarkup).toContain("海滩农场布局");
  expect(chineseMarkup).toContain("Farm Layouts");
});

test("keeps Farm Layouts immediately before the language control in the dock", () => {
  const markup = renderToStaticMarkup(
    <SiteNavigationDock
      blogHref="/blog"
      blogLabel="Blog"
      brandHref="/"
      brandLabel="Stardew Valley Farm Planner"
      currentLocale="en"
      languageLabel="Language"
      languageMode="browser"
      languageSwitcher={<span data-language-control="">Language</span>}
      plannerHref="/#planner"
      plannerLabel="Open planner"
      surface="homepage"
    />,
  );
  const farmLayoutsIndex = markup.indexOf("data-farm-layouts-navigation-trigger");
  const languageControlIndex = markup.indexOf("data-language-control");

  expect(farmLayoutsIndex).toBeGreaterThan(-1);
  expect(languageControlIndex).toBeGreaterThan(farmLayoutsIndex);
});

test("fails fast when the farm layouts navigation locale is unsupported", () => {
  expect(() => getFarmLayoutsNavigationModel("fr")).toThrow(
    'Farm layouts navigation locale must be "en", "zh-CN", "ja", or "ru"; received "fr".',
  );
});

test("moves keyboard focus through both panels and returns focus on Escape", () => {
  const closed = createClosedFarmLayoutsNavigationInteraction();
  const categories = moveFarmLayoutsNavigationFocus({
    compact: false,
    currentFocusKey: "trigger",
    interaction: closed,
    key: "ArrowDown",
  });
  const page = moveFarmLayoutsNavigationFocus({
    compact: false,
    currentFocusKey: "farm-maps",
    interaction: categories,
    key: "ArrowRight",
  });
  const returnedToCategories = moveFarmLayoutsNavigationFocus({
    compact: false,
    currentFocusKey: "beach-farm",
    interaction: page,
    key: "ArrowLeft",
  });
  const escaped = closeFarmLayoutsNavigationOnEscape();

  expect(categories).toMatchObject({ panel: "categories", focusKey: "farm-maps" });
  expect(page).toMatchObject({ panel: "beach-farm", focusKey: "beach-farm" });
  expect(returnedToCategories).toMatchObject({
    panel: "categories",
    focusKey: "farm-maps",
  });
  expect(escaped).toMatchObject({ panel: "closed", focusKey: "trigger" });
});

test("uses a back-button step on compact screens and suppresses hover after Escape", () => {
  const compactPage = moveFarmLayoutsNavigationFocus({
    compact: true,
    currentFocusKey: "farm-maps",
    interaction: toggleFarmLayoutsNavigation(
      createClosedFarmLayoutsNavigationInteraction(),
    ),
    key: "ArrowRight",
  });
  const escaped = closeFarmLayoutsNavigationOnEscape();

  expect(compactPage).toMatchObject({ panel: "beach-farm", focusKey: "back" });
  expect(openFarmLayoutsNavigationFromPointerHover(escaped)).toBe(escaped);
});
