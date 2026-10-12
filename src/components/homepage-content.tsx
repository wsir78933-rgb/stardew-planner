import type { ReactNode } from "react";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import type { HomepageLocaleHrefByLocale } from "@/src/homepage/homepage-navigation-url";
import { createSiteFooterContent } from "@/src/site-footer/site-footer-content";
import { HomepageFaqList } from "./homepage-faq-list";
import { HomepageCaseStudySections } from "./homepage-case-study-sections";
import { HomepageClosingCta } from "./homepage-closing-cta";
import { HomepageFeatureIntroductionSection } from "./homepage-feature-introduction-section";
import { HomepageHeroSection } from "./homepage-hero-section";
import { HomepageHowToSection } from "./homepage-how-to-section";
import { HomepageNavigationDock } from "./homepage-navigation-dock";
import { HomepageWhatIsSection } from "./homepage-what-is-section";
import { SiteFooter } from "./site-footer";

type HomepageContentProps = {
  copy: HomepageCopy;
  currentLocale: HomepageLocale;
  localeHrefByLocale: HomepageLocaleHrefByLocale;
  localeSwitcher?: ReactNode;
  plannerHref: string;
  plannerWorkspace: ReactNode;
};

export function HomepageContent({
  copy,
  currentLocale,
  localeHrefByLocale,
  localeSwitcher,
  plannerHref,
  plannerWorkspace,
}: HomepageContentProps) {
  return (
    <>
      <header data-homepage-header>
        <HomepageNavigationDock
          copy={copy}
          currentLocale={currentLocale}
          localeHrefByLocale={localeHrefByLocale}
          localeSwitcher={localeSwitcher}
          plannerHref={plannerHref}
        />
      </header>
      <main>
        <HomepageHeroSection
          capabilitiesHref="#capabilities"
          capabilitiesLabel={copy.navigation.capabilitiesLabel}
          copy={copy.hero}
          plannerHref={plannerHref}
        />
        {plannerWorkspace}
        <HomepageWhatIsSection copy={copy.whatIs} />
        <HomepageCaseStudySections
          description={copy.caseStudiesDescription}
          groups={copy.caseStudies}
          heading={copy.caseStudiesHeading}
        />
        <HomepageFeatureIntroductionSection copy={copy.featureIntroduction} />
        <HomepageHowToSection copy={copy.howTo} />
        <section data-homepage-faq id="faq">
          <HomepageFaqList
            description={copy.faq.description}
            eyebrow={copy.faq.eyebrow}
            heading={copy.faq.heading}
            items={copy.faq.items}
          />
        </section>
        <HomepageClosingCta
          copy={copy.closingCta}
          plannerHref={plannerHref}
          primaryActionLabel={copy.hero.primaryActionLabel}
        />
      </main>
      <SiteFooter content={createSiteFooterContent(copy.footer, currentLocale)} />
    </>
  );
}
