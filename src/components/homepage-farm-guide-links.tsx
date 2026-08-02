import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import { getLocalizedOfficialFarmGuide } from "@/src/i18n/public-page-content";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import { officialFarmTypes } from "@/src/reference/official-farm-guides";

type HomepageFarmGuideLinksProps = Readonly<{
  copy: HomepageCopy["farmGuides"];
  currentLocale: HomepageLocale;
}>;

export function HomepageFarmGuideLinks({
  copy,
  currentLocale,
}: HomepageFarmGuideLinksProps) {
  return (
    <section data-homepage-farm-guides id="farm-guides">
      <h2 id="homepage-farm-guides-heading">{copy.heading}</h2>
      <p>{copy.description}</p>
      <a
        data-homepage-farm-comparison-link
        href={getLocalizedPublicPath(currentLocale, "/farm-comparison")}
      >
        {copy.comparisonLinkLabel}
      </a>
      <div data-homepage-farm-guide-links>
        {officialFarmTypes.map((farmType) => {
          const farmGuide = getLocalizedOfficialFarmGuide(currentLocale, farmType);

          return (
            <a
              data-homepage-farm-guide-link
              href={getLocalizedPublicPath(currentLocale, `/farm/${farmType}`)}
              key={farmType}
            >
              {farmGuide.title}
            </a>
          );
        })}
      </div>
    </section>
  );
}
