import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getBedroomDesignPageCopy,
  getFeaturedBedroomDesignCase,
  type BedroomDesignCase,
  type BedroomDesignPageCopy,
} from "./bedroom-design-content";
import styles from "./beach-farm-page.module.css";
import bedroomDesignStyles from "./bedroom-design-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedBedroomDesignCaseCount = 6;

type BedroomDesignPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSixBedroomDesignCases(
  cases: readonly BedroomDesignCase[],
  locale: PublicLocale,
): void {
  if (cases.length !== expectedBedroomDesignCaseCount) {
    throw new Error(
      `Bedroom Design page requires exactly ${expectedBedroomDesignCaseCount} cases for locale ${JSON.stringify(locale)}. Received: ${cases.length}.`,
    );
  }
}

function requireFeaturedBedroomDesignCaseExcludedFromCases(
  featuredCase: BedroomDesignCase,
  cases: readonly BedroomDesignCase[],
): void {
  if (cases.some((bedroomCase) => bedroomCase.id === featuredCase.id)) {
    throw new Error(
      `Bedroom Design cover case must not appear in the six-case list. Received featured case ID ${JSON.stringify(featuredCase.id)} and case IDs ${JSON.stringify(cases.map((bedroomCase) => bedroomCase.id))}.`,
    );
  }
}

function getBedroomDesignCaseAnchorId(caseId: string): string {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Bedroom Design case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }

  return caseId;
}

function renderBedroomDesignCase(
  bedroomCase: BedroomDesignCase,
  pageCopy: BedroomDesignPageCopy,
) {
  const anchorId = getBedroomDesignCaseAnchorId(bedroomCase.id);

  return (
    <article
      aria-labelledby={`${anchorId}-title`}
      className={styles.case}
      data-bedroom-design-case={bedroomCase.id}
      id={anchorId}
      key={bedroomCase.id}
    >
      <figure className={styles.caseVisual}>
        <LayoutImageViewer
          closeLabel={pageCopy.closeImageLabel}
          enlargeLabel={pageCopy.enlargeImageLabel}
          imageAlt={bedroomCase.imageAlt}
          imageHeight={bedroomCase.imageHeight}
          imageOriginalSrc={bedroomCase.imageOriginalSrc}
          imageSrc={bedroomCase.imageSrc}
          imageWidth={bedroomCase.imageWidth}
        />
      </figure>

      <div className={styles.caseDetails}>
        <div className={styles.caseHeading}>
          <h3 id={`${anchorId}-title`}>{bedroomCase.title}</h3>
          <p>{bedroomCase.summary}</p>
        </div>

        <a className={styles.downloadLink} download href={bedroomCase.projectHref}>
          <Download aria-hidden="true" size={17} strokeWidth={1.8} />
          {pageCopy.downloadProjectLabel}
        </a>
      </div>
    </article>
  );
}

function renderBedroomDesignHero(
  pageCopy: BedroomDesignPageCopy,
  featuredCase: BedroomDesignCase,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="bedroom-design-page-title"
      className={styles.hero}
      data-bedroom-design-hero="true"
    >
      <div className={styles.heroCopy}>
        <h1 id="bedroom-design-page-title">{pageCopy.heading}</h1>
        <p className={styles.intro}>{pageCopy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#bedroom-design-cases">
            {pageCopy.browseLabel}
            <ArrowDown aria-hidden="true" size={17} strokeWidth={1.9} />
          </a>
          <a className={styles.secondaryAction} href={plannerHref}>
            {pageCopy.openPlannerLabel}
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.9} />
          </a>
        </div>
      </div>

      <figure
        className={styles.heroVisual}
        data-bedroom-design-featured-case={featuredCase.id}
      >
        <LayoutImageViewer
          closeLabel={pageCopy.closeImageLabel}
          enlargeLabel={pageCopy.enlargeImageLabel}
          imageAlt={featuredCase.imageAlt}
          imageHeight={featuredCase.imageHeight}
          imageOriginalSrc={featuredCase.imageOriginalSrc}
          imageSrc={featuredCase.imageSrc}
          imageWidth={featuredCase.imageWidth}
          isPriorityImage
        />
        <figcaption className={styles.heroCaption}>
          <span>{pageCopy.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{featuredCase.title}</span>
        </figcaption>
      </figure>
    </section>
  );
}

function renderBedroomDesignIntroduction(pageCopy: BedroomDesignPageCopy) {
  return (
    <section
      aria-labelledby="bedroom-design-what-is-heading"
      className={styles.whatIs}
      id="bedroom-design-what-is"
    >
      <h2 id="bedroom-design-what-is-heading">{pageCopy.whatIsHeading}</h2>
      <div className={styles.whatIsCopy}>
        {pageCopy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
          <p key={paragraphIndex}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function renderBedroomDesignCases(pageCopy: BedroomDesignPageCopy) {
  return (
    <section
      aria-labelledby="bedroom-design-cases-heading"
      className={styles.cases}
      id="bedroom-design-cases"
    >
      <div className={styles.sectionHeading}>
        <h2 id="bedroom-design-cases-heading">{pageCopy.casesHeading}</h2>
        <p className={styles.casesDescription}>{pageCopy.casesDescription}</p>
      </div>
      <div className={bedroomDesignStyles.caseList}>
        {pageCopy.cases.map((bedroomCase) =>
          renderBedroomDesignCase(bedroomCase, pageCopy),
        )}
      </div>
    </section>
  );
}

function renderBedroomDesignPlannerCta(
  pageCopy: BedroomDesignPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="bedroom-design-cta-heading"
      className={styles.ctaSection}
      id="bedroom-design-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="bedroom-design-cta-heading">{pageCopy.ctaHeading}</h2>
        <p>{pageCopy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {pageCopy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function BedroomDesignPage({ locale }: BedroomDesignPageProperties) {
  const pageCopy = getBedroomDesignPageCopy(locale);
  const featuredCase = getFeaturedBedroomDesignCase(locale);
  requireSixBedroomDesignCases(pageCopy.cases, locale);
  requireFeaturedBedroomDesignCaseExcludedFromCases(
    featuredCase,
    pageCopy.cases,
  );

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${bedroomDesignStyles.bedroomDesignPage}`}
      data-bedroom-design-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderBedroomDesignHero(pageCopy, featuredCase, plannerHref)}
      {renderBedroomDesignIntroduction(pageCopy)}
      {renderBedroomDesignCases(pageCopy)}
      <HowItWorks09
        cta={{ href: plannerHref, label: pageCopy.openPlannerLabel }}
        eyebrow={pageCopy.howToEyebrow}
        headingId="bedroom-design-how-to-heading"
        steps={pageCopy.howToSteps}
        title={pageCopy.howToHeading}
      />
      <section aria-label={pageCopy.faqHeading} className={styles.faqSection}>
        <Faq1
          className={styles.faqComponent}
          description={pageCopy.faqDescription}
          eyebrow={pageCopy.faqEyebrow}
          items={pageCopy.faqs}
          title={pageCopy.faqHeading}
        />
      </section>
      {renderBedroomDesignPlannerCta(pageCopy, plannerHref)}
    </article>
  );
}
