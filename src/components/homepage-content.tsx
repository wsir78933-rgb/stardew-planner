import type { ReactNode } from "react";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import type { HomepageLocaleHrefByLocale } from "@/src/homepage/homepage-navigation-url";
import { createSiteFooterContent } from "@/src/site-footer/site-footer-content";
import { HomepageFaqList } from "./homepage-faq-list";
import { HomepageClosingCta } from "./homepage-closing-cta";
import { HomepageFeaturesSection } from "./homepage-features-section";
import { HomepageHeroSection } from "./homepage-hero-section";
import { HomepageHowToSection } from "./homepage-how-to-section";
import { HomepageNavigationDock } from "./homepage-navigation-dock";
import { HomepageWhyChooseSection } from "./homepage-why-choose-section";
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
        <HomepageFeaturesSection copy={copy.features} />
        <HomepageWhyChooseSection copy={copy.whyChoose} />
        <HomepageHowToSection copy={copy.howTo} />
        <HomepageClosingCta
          copy={copy.closingCta}
          plannerHref={plannerHref}
          primaryActionLabel={copy.hero.primaryActionLabel}
        />
        <section data-homepage-faq id="faq">
          <h2>{copy.faq.heading}</h2>
          <HomepageFaqList items={copy.faq.items} />
        </section>
        <section aria-label={copy.trust.heading} data-homepage-trust>
          <p>{copy.trust.description}</p>
        </section>
      </main>
      <SiteFooter content={createSiteFooterContent(copy.footer, currentLocale)} />
    </>
  );
}
