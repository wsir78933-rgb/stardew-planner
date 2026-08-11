import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import { handleFaqSummaryKeyDown } from "@/src/homepage/faq-disclosure-keyboard";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import type { HomepageLocaleHrefByLocale } from "@/src/homepage/homepage-navigation-url";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import { createSiteFooterContent } from "@/src/site-footer/site-footer-content";
import { HomepageFarmGuideLinks } from "./homepage-farm-guide-links";
import { HomepageLocaleSwitcher } from "./homepage-locale-switcher";
import { HomepagePlanningGuide } from "./homepage-planning-guide";
import { SiteFooter } from "./site-footer";

type HomepageContentProps = {
  copy: HomepageCopy;
  currentLocale: HomepageLocale;
  localeHrefByLocale: HomepageLocaleHrefByLocale;
  plannerHref: string;
  plannerWorkspace: ReactNode;
};

export function HomepageContent({
  copy,
  currentLocale,
  localeHrefByLocale,
  plannerHref,
  plannerWorkspace,
}: HomepageContentProps) {
  return (
    <>
      <header data-homepage-header>
        <nav aria-label={copy.navigation.productName}>
          <a data-homepage-brand href={plannerHref}>
            {copy.navigation.productName}
          </a>
          <div data-homepage-navigation-links>
            <a href="#capabilities">{copy.navigation.capabilitiesLabel}</a>
            <a href="#faq">{copy.navigation.faqLabel}</a>
            <a href={getLocalizedPublicPath(currentLocale, "/blog")}>
              {copy.navigation.blogLabel}
            </a>
          </div>
          <div data-homepage-header-actions>
            <HomepageLocaleSwitcher
              label={copy.navigation.languageLabel}
              localeHrefByLocale={localeHrefByLocale}
            />
            <Button asChild data-homepage-header-action size="lg">
              <a href={plannerHref}>{copy.navigation.plannerActionLabel}</a>
            </Button>
          </div>
        </nav>
      </header>
      <main>
        <section data-homepage-hero>
          <div data-homepage-hero-content>
            <h1>
              {copy.hero.headlineBefore}
              <em data-homepage-hero-emphasis>{copy.hero.headlineEmphasis}</em>
              {copy.hero.headlineAfter}
            </h1>
            <p>{copy.hero.supportingCopy}</p>
            <Button asChild data-homepage-primary-action size="lg">
              <a href={plannerHref}>{copy.hero.primaryActionLabel}</a>
            </Button>
          </div>
        </section>
        {plannerWorkspace}
        <HomepagePlanningGuide copy={copy.planningGuide} />
        <section id="capabilities">
          <h2>{copy.capabilities.heading}</h2>
          <div>
            {copy.capabilities.items.map((capability, capabilityIndex) => (
              <article key={`capability-${capabilityIndex}`}>
                <span aria-hidden="true" data-homepage-capability-number>
                  {String(capabilityIndex + 1).padStart(2, "0")}
                </span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>
        </section>
        <HomepageFarmGuideLinks copy={copy.farmGuides} currentLocale={currentLocale} />
        <section id="faq">
          <h2>{copy.faq.heading}</h2>
          <div data-homepage-faq-list>
            {copy.faq.items.map((faqItem, faqIndex) => (
              <details key={`faq-${faqIndex}`}>
                <summary onKeyDown={handleFaqSummaryKeyDown}>
                  {faqItem.question}
                </summary>
                <p>{faqItem.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section data-homepage-trust>
          <h2>{copy.trust.heading}</h2>
          <p>{copy.trust.description}</p>
        </section>
      </main>
      <SiteFooter content={createSiteFooterContent(copy.footer, currentLocale)} />
    </>
  );
}
