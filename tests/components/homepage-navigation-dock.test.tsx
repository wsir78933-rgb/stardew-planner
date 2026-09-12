import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { Languages } from "lucide-react";
import { HomepageContent } from "@/src/components/homepage-content";
import { HomepageLocaleSwitcher } from "@/src/components/homepage-locale-switcher";
import { HomepageNavigationDock } from "@/src/components/homepage-navigation-dock";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";

const englishLocaleHrefByLocale = {
  en: "/",
  "zh-CN": "/zh",
} as const;

function readHomepageHeaderMarkup(markup: string): string {
  const homepageHeaderMarkup = markup.match(
    /<header[^>]*data-homepage-header[^>]*>[\s\S]*?<\/header>/,
  )?.[0];

  if (homepageHeaderMarkup === undefined) {
    throw new Error(
      `Homepage header markup was not found. Received: ${markup}`,
    );
  }

  return homepageHeaderMarkup;
}

function renderHomepageNavigationDockMarkup(input: Readonly<{
  currentLocale: "en" | "zh-CN";
  plannerHref: string;
}>): string {
  return renderToStaticMarkup(
    <HomepageNavigationDock
      copy={homepageCopyByLocale[input.currentLocale]}
      currentLocale={input.currentLocale}
      localeHrefByLocale={englishLocaleHrefByLocale}
      localeSwitcher={
        <HomepageLocaleSwitcher
          key="homepage-dock-language"
          icon={Languages}
          label={homepageCopyByLocale[input.currentLocale].navigation.languageLabel}
          localeHrefByLocale={englishLocaleHrefByLocale}
        />
      }
      plannerHref={input.plannerHref}
    />,
  );
}

function renderHomepageContentMarkup(input: Readonly<{
  currentLocale: "en" | "zh-CN";
  plannerHref: string;
}>): string {
  return renderToStaticMarkup(
    createElement(HomepageContent, {
      copy: homepageCopyByLocale[input.currentLocale],
      currentLocale: input.currentLocale,
      localeHrefByLocale: englishLocaleHrefByLocale,
      plannerHref: input.plannerHref,
      plannerWorkspace: createElement("div", {
        "data-test-planner-workspace": true,
      }),
    }),
  );
}

test("renders homepage dock brand, section, blog, and planner anchors without a NavigationMenu", () => {
  const markup = renderHomepageNavigationDockMarkup({
    currentLocale: "en",
    plannerHref: "#planner",
  });

  expect(markup).toContain('aria-label="Stardew Valley Farm Planner"');
  expect(markup).toMatch(
    /<a[^>]*data-homepage-brand[^>]*href="\/"|<a[^>]*href="\/"[^>]*data-homepage-brand/,
  );
  expect(markup).toContain("data-homepage-navigation-links");
  expect(markup).not.toMatch(/<a[^>]*href="#capabilities"/);
  expect(markup).not.toMatch(/<a[^>]*href="#faq"/);
  expect(markup).toMatch(/<a[^>]*href="\/blog"/);
  expect(markup).toContain("data-homepage-header-actions");
  expect(markup).toMatch(
    /<a[^>]*data-homepage-header-action[^>]*href="#planner"|<a[^>]*href="#planner"[^>]*data-homepage-header-action/,
  );
  expect(markup).toContain("Stardew Valley Farm Planner");
  expect(markup).not.toContain("Features");
  expect(markup).not.toContain("FAQ");
  expect(markup).toContain("Blog");
  expect(markup).toContain("Open planner");
  expect(markup).not.toContain('data-slot="navigation-menu"');
});

test("HomepageContent keeps the header contract and drops NavigationMenu from the header", () => {
  const markup = renderHomepageContentMarkup({
    currentLocale: "en",
    plannerHref: "#planner",
  });
  const headerMarkup = readHomepageHeaderMarkup(markup);

  expect(headerMarkup).toContain("data-homepage-header");
  expect(headerMarkup).toMatch(
    /<a[^>]*data-homepage-brand[^>]*href="\/"|<a[^>]*href="\/"[^>]*data-homepage-brand/,
  );
  expect(headerMarkup).not.toMatch(/<a[^>]*href="#capabilities"/);
  expect(headerMarkup).not.toMatch(/<a[^>]*href="#faq"/);
  expect(headerMarkup).toMatch(/<a[^>]*href="\/blog"/);
  expect(headerMarkup).toMatch(
    /<a[^>]*data-homepage-header-action[^>]*href="#planner"|<a[^>]*href="#planner"[^>]*data-homepage-header-action/,
  );
  expect(headerMarkup).toContain("Stardew Valley Farm Planner");
  expect(headerMarkup).not.toContain("Features");
  expect(headerMarkup).not.toContain("FAQ");
  expect(headerMarkup).toContain("Blog");
  expect(headerMarkup).toContain("Open planner");
  expect(headerMarkup).not.toContain('data-slot="navigation-menu"');
});

test("uses localized blog and planner labels for zh-CN", () => {
  const markup = renderHomepageContentMarkup({
    currentLocale: "zh-CN",
    plannerHref: "#planner",
  });
  const headerMarkup = readHomepageHeaderMarkup(markup);

  expect(headerMarkup).toMatch(/<a[^>]*href="\/zh\/blog"/);
  expect(headerMarkup).toContain("博客");
  expect(headerMarkup).toContain("打开规划器");
});

test("throws when plannerHref is empty", () => {
  expect(() =>
    renderHomepageNavigationDockMarkup({
      currentLocale: "en",
      plannerHref: "",
    }),
  ).toThrow('received ""');
  expect(() =>
    renderHomepageContentMarkup({
      currentLocale: "en",
      plannerHref: "",
    }),
  ).toThrow('received ""');
});
