import { describe, expect, it } from "vitest";
import { createHomepageNavigationUrls } from "../../src/homepage/homepage-navigation-url";

describe("homepage navigation URLs", () => {
  it.each([
    ["forest", "/?farmType=forest#planner", "/zh?farmType=forest#planner"],
    [
      "modest-maps-standard",
      "/?farmType=modest-maps-standard#planner",
      "/zh?farmType=modest-maps-standard#planner",
    ],
  ] as const)(
    "keeps the supported %s farm type in planner CTAs and locale routes",
    (farmType, expectedEnglishHref, expectedChineseHref) => {
      const navigationUrls = createHomepageNavigationUrls({
        currentLocale: "en",
        hash: "#planner",
        search: `?farmType=${farmType}`,
      });

      expect(navigationUrls).toEqual({
        localeHrefByLocale: {
          en: expectedEnglishHref,
          "zh-CN": expectedChineseHref,
        },
        plannerHref: "#planner",
      });
    },
  );

  it.each(["react", "reference"] as const)(
    "keeps the current %s runtime through the relative planner CTA but not locale URLs",
    (plannerRuntime) => {
      expect(
        createHomepageNavigationUrls({
          currentLocale: "en",
          hash: "#planner",
          search: `?farmType=forest&plannerRuntime=${plannerRuntime}`,
        }),
      ).toEqual({
        localeHrefByLocale: {
          en: "/?farmType=forest#planner",
          "zh-CN": "/zh?farmType=forest#planner",
        },
        plannerHref: "#planner",
      });
    },
  );

  it.each([
    ["unknown", "?farmType=forest&plannerRuntime=unknown"],
    [
      "repeated",
      "?farmType=forest&plannerRuntime=react&plannerRuntime=reference",
    ],
  ] as const)(
    "does not forward a %s planner runtime",
    (_caseName, search) => {
      expect(
        createHomepageNavigationUrls({
          currentLocale: "en",
          hash: "#planner",
          search,
        }),
      ).toEqual({
        localeHrefByLocale: {
          en: "/?farmType=forest#planner",
          "zh-CN": "/zh?farmType=forest#planner",
        },
        plannerHref: "#planner",
      });
    },
  );

  it.each([
    ["unknown", "?farmType=unknown"],
    ["repeated", "?farmType=forest&farmType=standard"],
  ] as const)(
    "keeps %s farmType input on the Standard fallback instead of forwarding it",
    (_caseName, search) => {
      expect(
        createHomepageNavigationUrls({
          currentLocale: "zh-CN",
          hash: "#planner",
          search,
        }),
      ).toEqual({
        localeHrefByLocale: {
          en: "/#planner",
          "zh-CN": "/zh#planner",
        },
        plannerHref: "#planner",
      });
    },
  );

  it("uses a relative planner anchor when no browser query is available", () => {
    const navigationUrls = createHomepageNavigationUrls({
      currentLocale: "zh-CN",
      hash: "",
      search: "",
    });

    expect(navigationUrls).toEqual({
      localeHrefByLocale: {
        en: "/",
        "zh-CN": "/zh",
      },
      plannerHref: "#planner",
    });
    expect(
      new URL(
        navigationUrls.plannerHref,
        "https://stardewvalleyplanner.art/zh?farmType=forest&plannerRuntime=reference",
      ).href,
    ).toBe(
      "https://stardewvalleyplanner.art/zh?farmType=forest&plannerRuntime=reference#planner",
    );
  });

  it("preserves only the editor hash when switching locale", () => {
    expect(
      createHomepageNavigationUrls({
        currentLocale: "en",
        hash: "#faq",
        search: "?farmType=forest",
      }),
    ).toEqual({
      localeHrefByLocale: {
        en: "/?farmType=forest",
        "zh-CN": "/zh?farmType=forest",
      },
      plannerHref: "#planner",
    });
  });
});
