import { expect, it } from "vitest";
import { publicLocales } from "../../src/i18n/public-locale";
import {
  canonicalPublicPaths,
  createHomepageLanguageAlternates,
  createPublicLanguageAlternates,
  getHomepageDisplayPath,
  getLocalizedPublicPath,
  getLocalizedIndexablePublicRouteEntries,
  getLocalizedPublicRouteEntries,
} from "../../src/i18n/public-route-registry";

it("maps public identities, including contact-only noindex routes, to Chinese paths", () => {
  expect(canonicalPublicPaths).toHaveLength(47);
  expect(canonicalPublicPaths).toContain("/privacy");
  expect(canonicalPublicPaths).toContain("/terms");
  expect(canonicalPublicPaths).toContain("/contact");
  expect(getLocalizedPublicPath("zh-CN", "/")).toBe("/zh");
  expect(getLocalizedPublicPath("en", "/privacy")).toBe("/privacy");
  expect(getLocalizedPublicPath("zh-CN", "/privacy")).toBe("/zh/privacy");
  expect(getLocalizedPublicPath("en", "/terms")).toBe("/terms");
  expect(getLocalizedPublicPath("zh-CN", "/terms")).toBe("/zh/terms");
  expect(getLocalizedPublicPath("en", "/contact")).toBe("/contact");
  expect(getLocalizedPublicPath("zh-CN", "/contact")).toBe("/zh/contact");
  expect(getLocalizedPublicPath("en", "/tools")).toBe("/tools");
  expect(getLocalizedPublicPath("zh-CN", "/tools")).toBe("/zh/tools");
  expect(getLocalizedPublicPath("en", "/tools/crop-profit")).toBe("/tools/crop-profit");
  expect(getLocalizedPublicPath("zh-CN", "/tools/crop-profit")).toBe("/zh/tools/crop-profit");
  expect(getLocalizedPublicPath("en", "/tools/crop-growth")).toBe("/tools/crop-growth");
  expect(getLocalizedPublicPath("zh-CN", "/tools/crop-growth")).toBe("/zh/tools/crop-growth");
  expect(getLocalizedPublicPath("en", "/stardew-valley-beach-farm-layout")).toBe(
    "/stardew-valley-beach-farm-layout",
  );
  expect(getLocalizedPublicPath("zh-CN", "/stardew-valley-beach-farm-layout")).toBe(
    "/zh/stardew-valley-beach-farm-layout",
  );
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-fish-farm-layout"),
  ).toBe("/stardew-valley-fish-farm-layout");
  expect(
    getLocalizedPublicPath("zh-CN", "/stardew-valley-fish-farm-layout"),
  ).toBe("/zh/stardew-valley-fish-farm-layout");
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-river-farm-layout"),
  ).toBe("/stardew-valley-river-farm-layout");
  expect(
    getLocalizedPublicPath("zh-CN", "/stardew-valley-river-farm-layout"),
  ).toBe("/zh/stardew-valley-river-farm-layout");
  expect(getLocalizedPublicPath("en", "/meadowlands-farm-layout")).toBe(
    "/meadowlands-farm-layout",
  );
  expect(getLocalizedPublicPath("zh-CN", "/meadowlands-farm-layout")).toBe(
    "/zh/meadowlands-farm-layout",
  );
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-forest-farm-layout"),
  ).toBe("/stardew-valley-forest-farm-layout");
  expect(
    getLocalizedPublicPath("zh-CN", "/stardew-valley-forest-farm-layout"),
  ).toBe("/zh/stardew-valley-forest-farm-layout");
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-four-corners-farm-layout"),
  ).toBe("/stardew-valley-four-corners-farm-layout");
  expect(
    getLocalizedPublicPath(
      "zh-CN",
      "/stardew-valley-four-corners-farm-layout",
    ),
  ).toBe("/zh/stardew-valley-four-corners-farm-layout");
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-frontier-farm-layout"),
  ).toBe("/stardew-valley-frontier-farm-layout");
  expect(
    getLocalizedPublicPath("zh-CN", "/stardew-valley-frontier-farm-layout"),
  ).toBe("/zh/stardew-valley-frontier-farm-layout");
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-expanded-farm-layout"),
  ).toBe("/stardew-valley-expanded-farm-layout");
  expect(
    getLocalizedPublicPath("zh-CN", "/stardew-valley-expanded-farm-layout"),
  ).toBe("/zh/stardew-valley-expanded-farm-layout");
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-hilltop-farm-layout"),
  ).toBe("/stardew-valley-hilltop-farm-layout");
  expect(
    getLocalizedPublicPath("zh-CN", "/stardew-valley-hilltop-farm-layout"),
  ).toBe("/zh/stardew-valley-hilltop-farm-layout");
  expect(getLocalizedPublicPath("en", "/stardew-valley-sprinkler-layout")).toBe(
    "/stardew-valley-sprinkler-layout",
  );
  expect(getLocalizedPublicPath("zh-CN", "/stardew-valley-sprinkler-layout")).toBe(
    "/zh/stardew-valley-sprinkler-layout",
  );
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-quality-sprinkler-layout"),
  ).toBe("/stardew-valley-quality-sprinkler-layout");
  expect(
    getLocalizedPublicPath("zh-CN", "/stardew-valley-quality-sprinkler-layout"),
  ).toBe("/zh/stardew-valley-quality-sprinkler-layout");
  expect(getLocalizedPublicPath("en", "/blog")).toBe("/blog");
  expect(getLocalizedPublicPath("zh-CN", "/blog")).toBe("/zh/blog");
  expect(getLocalizedPublicPath("en", "/blog/archive")).toBe("/blog/archive");
  expect(getLocalizedPublicPath("zh-CN", "/blog/archive")).toBe(
    "/zh/blog/archive",
  );
  expect(getLocalizedPublicPath("en", "/carpenter-stardew")).toBe(
    "/carpenter-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/where-is-robin-stardew-valley")).toBe(
    "/zh/where-is-robin-stardew-valley",
  );
  expect(getLocalizedPublicPath("en", "/stardew-valley-npc")).toBe(
    "/stardew-valley-npc",
  );
  expect(getLocalizedPublicPath("zh-CN", "/stardew-valley-npc")).toBe(
    "/zh/stardew-valley-npc",
  );
  expect(getLocalizedPublicPath("en", "/stardew-valley-town-map")).toBe(
    "/stardew-valley-town-map",
  );
  expect(getLocalizedPublicPath("zh-CN", "/stardew-valley-town-map")).toBe(
    "/zh/stardew-valley-town-map",
  );
  expect(getLocalizedPublicPath("en", "/where-is-stardew-valley-located")).toBe(
    "/where-is-stardew-valley-located",
  );
  expect(
    getLocalizedPublicPath("zh-CN", "/where-is-stardew-valley-located"),
  ).toBe("/zh/where-is-stardew-valley-located");
  expect(
    getLocalizedPublicPath("en", "/stardew-valley-expanded-bachelors-and-bachelorettes"),
  ).toBe("/stardew-valley-expanded-bachelors-and-bachelorettes");
  expect(
    getLocalizedPublicPath(
      "zh-CN",
      "/stardew-valley-expanded-bachelors-and-bachelorettes",
    ),
  ).toBe("/zh/stardew-valley-expanded-bachelors-and-bachelorettes");
  expect(getLocalizedPublicPath("en", "/sprinkler-stardew")).toBe(
    "/sprinkler-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/sprinkler-stardew")).toBe(
    "/zh/sprinkler-stardew",
  );
  expect(getLocalizedPublicPath("en", "/glasshouse-stardew-valley")).toBe(
    "/glasshouse-stardew-valley",
  );
  expect(getLocalizedPublicPath("zh-CN", "/glasshouse-stardew-valley")).toBe(
    "/zh/glasshouse-stardew-valley",
  );
  expect(getLocalizedPublicPath("en", "/oak-tree-stardew")).toBe(
    "/oak-tree-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/oak-tree-stardew")).toBe(
    "/zh/oak-tree-stardew",
  );
  expect(getLocalizedPublicPath("en", "/stardew-valley-trees")).toBe(
    "/stardew-valley-trees",
  );
  expect(getLocalizedPublicPath("zh-CN", "/stardew-valley-trees")).toBe(
    "/zh/stardew-valley-trees",
  );
  expect(getLocalizedPublicPath("en", "/maple-tree-stardew")).toBe(
    "/maple-tree-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/maple-tree-stardew")).toBe(
    "/zh/maple-tree-stardew",
  );
  expect(getLocalizedPublicPath("en", "/best-spring-crop-stardew")).toBe(
    "/best-spring-crop-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/best-spring-crop-stardew")).toBe(
    "/zh/best-spring-crop-stardew",
  );
  expect(getLocalizedPublicPath("en", "/how-to-earn-money-stardew")).toBe(
    "/how-to-earn-money-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/how-to-earn-money-stardew")).toBe(
    "/zh/how-to-earn-money-stardew",
  );
  expect(getLocalizedPublicPath("en", "/rancher-or-tiller-stardew")).toBe(
    "/rancher-or-tiller-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/rancher-or-tiller-stardew")).toBe(
    "/zh/rancher-or-tiller-stardew",
  );
  expect(getLocalizedPublicPath("en", "/summer-crops-stardew")).toBe(
    "/summer-crops-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/summer-crops-stardew")).toBe(
    "/zh/summer-crops-stardew",
  );
  expect(getLocalizedPublicPath("en", "/fall-crops-stardew")).toBe(
    "/fall-crops-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/fall-crops-stardew")).toBe(
    "/zh/fall-crops-stardew",
  );
  expect(getLocalizedPublicPath("en", "/do-you-have-to-water-trees-stardew")).toBe(
    "/do-you-have-to-water-trees-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/do-you-have-to-water-trees-stardew")).toBe(
    "/zh/do-you-have-to-water-trees-stardew",
  );
  expect(getLocalizedPublicPath("en", "/how-to-level-up-farming-stardew")).toBe(
    "/how-to-level-up-farming-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/how-to-level-up-farming-stardew")).toBe(
    "/zh/how-to-level-up-farming-stardew",
  );
  expect(getLocalizedPublicPath("en", "/last-day-to-plant-stardew")).toBe(
    "/last-day-to-plant-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/last-day-to-plant-stardew")).toBe(
    "/zh/last-day-to-plant-stardew",
  );
  expect(getLocalizedPublicPath("en", "/pine-tree-stardew")).toBe(
    "/pine-tree-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/pine-tree-stardew")).toBe(
    "/zh/pine-tree-stardew",
  );
  expect(getLocalizedPublicPath("en", "/profit-margin-stardew")).toBe(
    "/profit-margin-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/profit-margin-stardew")).toBe(
    "/zh/profit-margin-stardew",
  );
  expect(getLocalizedPublicPath("en", "/stardew-fruit")).toBe(
    "/stardew-fruit",
  );
  expect(getLocalizedPublicPath("zh-CN", "/stardew-fruit")).toBe(
    "/zh/stardew-fruit",
  );
  expect(getLocalizedPublicPath("en", "/oak-tree-vs-maple-stardew")).toBe(
    "/oak-tree-vs-maple-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/oak-tree-vs-maple-stardew")).toBe(
    "/zh/oak-tree-vs-maple-stardew",
  );
  expect(getLocalizedPublicPath("en", "/how-to-harvest-stardew-valley")).toBe(
    "/how-to-harvest-stardew-valley",
  );
  expect(getLocalizedPublicPath("zh-CN", "/how-to-harvest-stardew-valley")).toBe(
    "/zh/how-to-harvest-stardew-valley",
  );
  expect(
    getLocalizedPublicPath("en", "/how-to-get-gold-star-crops-stardew-valley"),
  ).toBe("/how-to-get-gold-star-crops-stardew-valley");
  expect(
    getLocalizedPublicPath("zh-CN", "/how-to-get-gold-star-crops-stardew-valley"),
  ).toBe("/zh/how-to-get-gold-star-crops-stardew-valley");
  expect(getLocalizedPublicPath("en", "/house-upgrade-stardew")).toBe(
    "/house-upgrade-stardew",
  );
  expect(getLocalizedPublicPath("zh-CN", "/house-upgrade-stardew")).toBe(
    "/zh/house-upgrade-stardew",
  );
  expect(getLocalizedPublicRouteEntries()).toHaveLength(94);
  expect(getLocalizedIndexablePublicRouteEntries()).toHaveLength(92);
  const indexablePathnames = getLocalizedIndexablePublicRouteEntries().map(
    ({ pathname }) => pathname,
  );
  expect(indexablePathnames).not.toContain("/contact");
  expect(indexablePathnames).not.toContain("/zh/contact");
  expect(indexablePathnames).toContain("/tools");
  expect(indexablePathnames).toContain("/zh/tools");
  expect(indexablePathnames).toContain("/tools/crop-profit");
  expect(indexablePathnames).toContain("/zh/tools/crop-profit");
  expect(indexablePathnames).toContain("/tools/crop-growth");
  expect(indexablePathnames).toContain("/zh/tools/crop-growth");
  expect(indexablePathnames).toContain("/stardew-valley-beach-farm-layout");
  expect(indexablePathnames).toContain("/zh/stardew-valley-beach-farm-layout");
  expect(indexablePathnames).toContain("/stardew-valley-fish-farm-layout");
  expect(indexablePathnames).toContain("/zh/stardew-valley-fish-farm-layout");
  expect(indexablePathnames).toContain("/stardew-valley-river-farm-layout");
  expect(indexablePathnames).toContain("/zh/stardew-valley-river-farm-layout");
  expect(indexablePathnames).toContain("/meadowlands-farm-layout");
  expect(indexablePathnames).toContain("/zh/meadowlands-farm-layout");
  expect(indexablePathnames).toContain("/stardew-valley-forest-farm-layout");
  expect(indexablePathnames).toContain("/zh/stardew-valley-forest-farm-layout");
  expect(indexablePathnames).toContain("/stardew-valley-four-corners-farm-layout");
  expect(indexablePathnames).toContain(
    "/zh/stardew-valley-four-corners-farm-layout",
  );
  expect(indexablePathnames).toContain("/stardew-valley-frontier-farm-layout");
  expect(indexablePathnames).toContain(
    "/zh/stardew-valley-frontier-farm-layout",
  );
  expect(indexablePathnames).toContain("/stardew-valley-expanded-farm-layout");
  expect(indexablePathnames).toContain("/zh/stardew-valley-expanded-farm-layout");
  expect(indexablePathnames).toContain("/stardew-valley-hilltop-farm-layout");
  expect(indexablePathnames).toContain("/zh/stardew-valley-hilltop-farm-layout");
  expect(indexablePathnames).toContain("/stardew-valley-sprinkler-layout");
  expect(indexablePathnames).toContain("/zh/stardew-valley-sprinkler-layout");
  expect(indexablePathnames).toContain(
    "/stardew-valley-quality-sprinkler-layout",
  );
  expect(indexablePathnames).toContain(
    "/zh/stardew-valley-quality-sprinkler-layout",
  );
  expect(indexablePathnames).toContain("/blog");
  expect(indexablePathnames).toContain("/zh/blog");
  expect(indexablePathnames).toContain("/carpenter-stardew");
  expect(indexablePathnames).toContain("/zh/carpenter-stardew");
  expect(indexablePathnames).toContain("/stardew-valley-npc");
  expect(indexablePathnames).toContain("/zh/stardew-valley-npc");
  expect(indexablePathnames).toContain("/stardew-valley-town-map");
  expect(indexablePathnames).toContain("/zh/stardew-valley-town-map");
  expect(indexablePathnames).toContain("/where-is-stardew-valley-located");
  expect(indexablePathnames).toContain("/zh/where-is-stardew-valley-located");
  expect(indexablePathnames).toContain(
    "/stardew-valley-expanded-bachelors-and-bachelorettes",
  );
  expect(indexablePathnames).toContain(
    "/zh/stardew-valley-expanded-bachelors-and-bachelorettes",
  );
  expect(indexablePathnames).toContain("/sprinkler-stardew");
  expect(indexablePathnames).toContain("/zh/sprinkler-stardew");
  expect(indexablePathnames).toContain("/glasshouse-stardew-valley");
  expect(indexablePathnames).toContain("/zh/glasshouse-stardew-valley");
  expect(indexablePathnames).toContain("/oak-tree-stardew");
  expect(indexablePathnames).toContain("/zh/oak-tree-stardew");
  expect(indexablePathnames).toContain("/stardew-valley-trees");
  expect(indexablePathnames).toContain("/zh/stardew-valley-trees");
  expect(indexablePathnames).toContain("/maple-tree-stardew");
  expect(indexablePathnames).toContain("/zh/maple-tree-stardew");
  expect(indexablePathnames).toContain("/best-spring-crop-stardew");
  expect(indexablePathnames).toContain("/zh/best-spring-crop-stardew");
  expect(indexablePathnames).toContain("/how-to-earn-money-stardew");
  expect(indexablePathnames).toContain("/zh/how-to-earn-money-stardew");
  expect(indexablePathnames).toContain("/rancher-or-tiller-stardew");
  expect(indexablePathnames).toContain("/zh/rancher-or-tiller-stardew");
  expect(indexablePathnames).toContain("/summer-crops-stardew");
  expect(indexablePathnames).toContain("/zh/summer-crops-stardew");
  expect(indexablePathnames).toContain("/fall-crops-stardew");
  expect(indexablePathnames).toContain("/zh/fall-crops-stardew");
  expect(indexablePathnames).toContain("/do-you-have-to-water-trees-stardew");
  expect(indexablePathnames).toContain("/zh/do-you-have-to-water-trees-stardew");
  expect(indexablePathnames).toContain("/how-to-level-up-farming-stardew");
  expect(indexablePathnames).toContain("/zh/how-to-level-up-farming-stardew");
  expect(indexablePathnames).toContain("/last-day-to-plant-stardew");
  expect(indexablePathnames).toContain("/zh/last-day-to-plant-stardew");
  expect(indexablePathnames).toContain("/pine-tree-stardew");
  expect(indexablePathnames).toContain("/zh/pine-tree-stardew");
  expect(indexablePathnames).toContain("/profit-margin-stardew");
  expect(indexablePathnames).toContain("/zh/profit-margin-stardew");
  expect(indexablePathnames).toContain("/stardew-fruit");
  expect(indexablePathnames).toContain("/zh/stardew-fruit");
  expect(indexablePathnames).toContain("/oak-tree-vs-maple-stardew");
  expect(indexablePathnames).toContain("/zh/oak-tree-vs-maple-stardew");
  expect(indexablePathnames).toContain("/how-to-harvest-stardew-valley");
  expect(indexablePathnames).toContain("/zh/how-to-harvest-stardew-valley");
  expect(indexablePathnames).toContain("/how-to-get-gold-star-crops-stardew-valley");
  expect(indexablePathnames).toContain(
    "/zh/how-to-get-gold-star-crops-stardew-valley",
  );
  expect(indexablePathnames).toContain("/house-upgrade-stardew");
  expect(indexablePathnames).toContain("/zh/house-upgrade-stardew");
});

it("registers the direct-entry blog routes", () => {
  expect(canonicalPublicPaths).toEqual(
    expect.arrayContaining([
      "/blog",
      "/blog/archive",
      "/carpenter-stardew",
      "/where-is-robin-stardew-valley",
      "/stardew-valley-npc",
      "/stardew-valley-town-map",
      "/where-is-stardew-valley-located",
      "/stardew-valley-expanded-bachelors-and-bachelorettes",
      "/sprinkler-stardew",
      "/glasshouse-stardew-valley",
      "/oak-tree-stardew",
      "/stardew-valley-trees",
      "/maple-tree-stardew",
      "/best-spring-crop-stardew",
      "/how-to-earn-money-stardew",
      "/rancher-or-tiller-stardew",
      "/summer-crops-stardew",
      "/fall-crops-stardew",
      "/do-you-have-to-water-trees-stardew",
      "/how-to-level-up-farming-stardew",
      "/last-day-to-plant-stardew",
      "/pine-tree-stardew",
      "/profit-margin-stardew",
      "/stardew-fruit",
      "/oak-tree-vs-maple-stardew",
      "/how-to-harvest-stardew-valley",
      "/how-to-get-gold-star-crops-stardew-valley",
      "/house-upgrade-stardew",
      "/tools",
      "/tools/crop-profit",
      "/tools/crop-growth",
    ]),
  );
});

it("returns absolute paired language alternates", () => {
  expect(createPublicLanguageAlternates("/privacy")).toEqual({
    en: "https://stardewvalleyplanner.art/privacy",
    "zh-CN": "https://stardewvalleyplanner.art/zh/privacy",
    "x-default": "https://stardewvalleyplanner.art/privacy",
  });
  expect(createPublicLanguageAlternates("/privacy")).not.toHaveProperty("ja");
  expect(createPublicLanguageAlternates("/blog")).not.toHaveProperty("ja");
});

it("adds Japanese and Russian only to the homepage language alternates", () => {
  expect(createPublicLanguageAlternates("/")).toEqual({
    en: "https://stardewvalleyplanner.art",
    "zh-CN": "https://stardewvalleyplanner.art/zh",
    ja: "https://stardewvalleyplanner.art/ja",
    ru: "https://stardewvalleyplanner.art/ru",
    "x-default": "https://stardewvalleyplanner.art",
  });
  expect(createPublicLanguageAlternates("/privacy")).not.toHaveProperty("ru");
  expect(createPublicLanguageAlternates("/blog")).not.toHaveProperty("ru");
});

it("rejects locale and canonical path values outside the public registry", () => {
  expect(() => getLocalizedPublicPath("fr" as never, "/privacy")).toThrow(
    'Received: "fr"',
  );
  expect(() => getLocalizedPublicPath("ru" as never, "/")).toThrow(
    'Received: "ru"',
  );
  expect(() => getLocalizedPublicPath("ru" as never, "/blog")).toThrow(
    'Received: "ru"',
  );
  expect(() => getLocalizedPublicPath("ru" as never, "/privacy")).toThrow(
    'Received: "ru"',
  );
  expect(() => getLocalizedPublicPath("en", "/missing" as never)).toThrow(
    'Received: "/missing"',
  );
});

it("keeps site locales bilingual and limits Russian alternates to the homepage", () => {
  expect(publicLocales).toEqual(["en", "zh-CN"]);
  expect(getHomepageDisplayPath("en")).toBe("/");
  expect(getHomepageDisplayPath("zh-CN")).toBe("/zh");
  expect(getHomepageDisplayPath("ja")).toBe("/ja");
  expect(getHomepageDisplayPath("ru")).toBe("/ru");
  expect(createHomepageLanguageAlternates()).toEqual({
    en: "https://stardewvalleyplanner.art",
    "zh-CN": "https://stardewvalleyplanner.art/zh",
    ja: "https://stardewvalleyplanner.art/ja",
    ru: "https://stardewvalleyplanner.art/ru",
    "x-default": "https://stardewvalleyplanner.art",
  });
  expect(createPublicLanguageAlternates("/")).toEqual(createHomepageLanguageAlternates());
  expect(createPublicLanguageAlternates("/blog")).not.toHaveProperty("ja");
  expect(createPublicLanguageAlternates("/blog")).not.toHaveProperty("ru");
  expect(() => getHomepageDisplayPath("fr" as never)).toThrow(
    'Received: "fr"',
  );
});
