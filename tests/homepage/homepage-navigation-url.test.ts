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
          ja: `/ja?farmType=${farmType}#planner`,
          ru: expectedEnglishHref.replace(/^\//, "/ru"),
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
          ja: "/ja#planner",
          ru: "/ru#planner",
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
        ja: "/ja",
        ru: "/ru",
      },
      plannerHref: "#planner",
    });
    expect(
      new URL(
        navigationUrls.plannerHref,
        "https://stardewvalleyplanner.art/zh?farmType=forest",
      ).href,
    ).toBe(
      "https://stardewvalleyplanner.art/zh?farmType=forest#planner",
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
        ja: "/ja?farmType=forest",
        ru: "/ru?farmType=forest",
      },
      plannerHref: "#planner",
    });
  });

  it("keeps a supported farm type on the Russian homepage path", () => {
    expect(
      createHomepageNavigationUrls({
        currentLocale: "ru",
        hash: "#planner",
        search: "?farmType=forest",
      }),
    ).toEqual({
      localeHrefByLocale: {
        en: "/?farmType=forest#planner",
        "zh-CN": "/zh?farmType=forest#planner",
        ja: "/ja?farmType=forest#planner",
        ru: "/ru?farmType=forest#planner",
      },
      plannerHref: "#planner",
    });
  });

  it("drops an unknown farm type from the Russian homepage instead of forwarding it", () => {
    expect(
      createHomepageNavigationUrls({
        currentLocale: "ru",
        hash: "#planner",
        search: "?farmType=unknown",
      }),
    ).toEqual({
      localeHrefByLocale: {
        en: "/#planner",
        "zh-CN": "/zh#planner",
        ja: "/ja#planner",
        ru: "/ru#planner",
      },
      plannerHref: "#planner",
    });
  });

  it("rejects a display locale outside English, Chinese, and Russian", () => {
    expect(() =>
      createHomepageNavigationUrls({
        currentLocale: "fr" as never,
        hash: "",
        search: "",
      }),
    ).toThrow('Received: "fr"');
  });
});
