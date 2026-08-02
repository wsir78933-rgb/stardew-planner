import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomepageFarmGuideLinks } from "../../src/components/homepage-farm-guide-links";
import { homepageCopyByLocale } from "../../src/homepage/homepage-copy";
import { HOMEPAGE_LOCALES } from "../../src/homepage/homepage-locale";
import { getLocalizedOfficialFarmGuide } from "../../src/i18n/public-page-content";
import { getLocalizedPublicPath } from "../../src/i18n/public-route-registry";
import { officialFarmTypes } from "../../src/reference/official-farm-guides";

describe("homepage farm guide links", () => {
  it("renders localized comparison and official farm links from the public farm interfaces", () => {
    expect(officialFarmTypes).toHaveLength(8);

    for (const homepageLocale of HOMEPAGE_LOCALES) {
      const homepageMarkup = renderToStaticMarkup(
        createElement(HomepageFarmGuideLinks, {
          copy: homepageCopyByLocale[homepageLocale].farmGuides,
          currentLocale: homepageLocale,
        }),
      );

      expect(homepageMarkup.match(/data-homepage-farm-comparison-link=/g)).toHaveLength(1);
      expect(homepageMarkup).toContain(
        homepageCopyByLocale[homepageLocale].farmGuides.heading,
      );
      expect(homepageMarkup).toContain(
        homepageCopyByLocale[homepageLocale].farmGuides.description.replaceAll(
          "'",
          "&#x27;",
        ),
      );
      expect(homepageMarkup).toContain(
        homepageCopyByLocale[homepageLocale].farmGuides.comparisonLinkLabel,
      );
      expect(homepageMarkup).toContain(
        `href="${getLocalizedPublicPath(homepageLocale, "/farm-comparison")}"`,
      );
      expect(homepageMarkup.match(/data-homepage-farm-guide-link=/g)).toHaveLength(
        officialFarmTypes.length,
      );

      for (const farmType of officialFarmTypes) {
        const localizedFarmGuide = getLocalizedOfficialFarmGuide(
          homepageLocale,
          farmType,
        );

        expect(homepageMarkup).toContain(localizedFarmGuide.title);
        expect(homepageMarkup).toContain(
          `href="${getLocalizedPublicPath(homepageLocale, `/farm/${farmType}`)}"`,
        );
      }
    }
  });
});
