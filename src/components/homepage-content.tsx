import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import type { HomepageLocale } from "@/src/homepage/homepage-locale";
import { HomepageLocaleSwitcher } from "./homepage-locale-switcher";

type HomepageContentProps = {
  copy: HomepageCopy;
  currentLocale: HomepageLocale;
  onLocaleChange: (homepageLocale: HomepageLocale) => void;
  plannerWorkspace: ReactNode;
};

export function HomepageContent({
  copy,
  currentLocale,
  onLocaleChange,
  plannerWorkspace,
}: HomepageContentProps) {
  return (
    <>
      <header data-homepage-header>
        <nav aria-label={copy.navigation.productName}>
          <a data-homepage-brand href="#planner">
            {copy.navigation.productName}
          </a>
          <div data-homepage-navigation-links>
            <a href="#capabilities">{copy.navigation.capabilitiesLabel}</a>
            <a href="#faq">{copy.navigation.faqLabel}</a>
            <a href="#planner">{copy.navigation.plannerLabel}</a>
          </div>
          <div data-homepage-header-actions>
            <HomepageLocaleSwitcher
              currentLocale={currentLocale}
              label={copy.navigation.languageLabel}
              onLocaleChange={onLocaleChange}
            />
            <Button asChild data-homepage-header-action size="lg">
              <a href="#planner">{copy.navigation.plannerActionLabel}</a>
            </Button>
          </div>
        </nav>
      </header>
      <main>
        <section data-homepage-hero>
          <p data-homepage-eyebrow>{copy.hero.eyebrow}</p>
          <h1>
            {copy.hero.headlineBefore}
            <em data-homepage-hero-emphasis>{copy.hero.headlineEmphasis}</em>
            {copy.hero.headlineAfter}
          </h1>
          <p>{copy.hero.supportingCopy}</p>
          <Button asChild data-homepage-primary-action size="lg">
            <a href="#planner">{copy.hero.primaryActionLabel}</a>
          </Button>
        </section>
        <section data-homepage-workspace-introduction>
          <p>{copy.workspace.label}</p>
          <p>{copy.workspace.description}</p>
        </section>
        {plannerWorkspace}
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
        <section id="faq">
          <h2>{copy.faq.heading}</h2>
          <Accordion collapsible type="single">
            {copy.faq.items.map((faqItem, faqIndex) => (
              <AccordionItem key={`faq-${faqIndex}`} value={`faq-${faqIndex}`}>
                <AccordionTrigger>{faqItem.question}</AccordionTrigger>
                <AccordionContent>{faqItem.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
      <footer>
        <p>{copy.footer.copyright}</p>
        <a href="/farm-comparison">{copy.footer.farmComparisonLinkLabel}</a>
        <a href="/mods">{copy.footer.farmGuidesLinkLabel}</a>
      </footer>
    </>
  );
}
