import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getFeaturedWildernessFarmCase,
  getWildernessFarmPageCopy,
  type WildernessFarmCase,
  type WildernessFarmPageCopy,
} from "./wilderness-farm-content";
import styles from "./beach-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedWildernessFarmCaseCount = 7;

type WildernessFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSevenWildernessFarmCases(
  cases: readonly WildernessFarmCase[],
): void {
  if (cases.length !== expectedWildernessFarmCaseCount) {
    throw new Error(
      `Wilderness Farm page requires exactly ${expectedWildernessFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoWildernessFarmWhatIsParagraphs(
  paragraphs: readonly string[],
): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Wilderness Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function requireFeaturedWildernessFarmCaseVisible(
  featuredCase: WildernessFarmCase,
  cases: readonly WildernessFarmCase[],
): void {
  if (!cases.some((layoutCase) => layoutCase.id === featuredCase.id)) {
    throw new Error(
      `Wilderness Farm featured case must appear in the visible case list. Received featured case ID ${JSON.stringify(featuredCase.id)} and case IDs ${JSON.stringify(cases.map((layoutCase) => layoutCase.id))}.`,
    );
  }
}

function getWildernessFarmCaseAnchorId(caseId: string): string {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Wilderness Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }

  return caseId;
}

function renderWildernessFarmCase(
  layoutCase: WildernessFarmCase,
  pageCopy: WildernessFarmPageCopy,
) {
  const anchorId = getWildernessFarmCaseAnchorId(layoutCase.id);

  return (
    <article
      aria-labelledby={`${anchorId}-title`}
      className={styles.case}
      data-wilderness-farm-case={layoutCase.id}
      id={anchorId}
      key={layoutCase.id}
    >
      <figure className={styles.caseVisual}>
        <LayoutImageViewer
          closeLabel={pageCopy.closeImageLabel}
          enlargeLabel={pageCopy.enlargeImageLabel}
          imageAlt={layoutCase.imageAlt}
          imageHeight={layoutCase.imageHeight}
          imageOriginalSrc={layoutCase.imageOriginalSrc}
          imageSrc={layoutCase.imageSrc}
          imageWidth={layoutCase.imageWidth}
        />
      </figure>

      <div className={styles.caseDetails}>
        <div className={styles.caseHeading}>
          <h3 id={`${anchorId}-title`}>{layoutCase.title}</h3>
          <p>{layoutCase.summary}</p>
        </div>

        <a className={styles.downloadLink} download href={layoutCase.projectHref}>
          <Download aria-hidden="true" size={17} strokeWidth={1.8} />
          {pageCopy.downloadProjectLabel}
        </a>
      </div>
    </article>
  );
}

function renderWildernessFarmHero(
  pageCopy: WildernessFarmPageCopy,
  featuredCase: WildernessFarmCase,
  plannerHref: string,
) {
  return (
    <section aria-labelledby="wilderness-farm-page-title" className={styles.hero}>
      <div className={styles.heroCopy}>
        <h1 id="wilderness-farm-page-title">{pageCopy.heading}</h1>
        <p className={styles.intro}>{pageCopy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#wilderness-farm-layouts">
            {pageCopy.browseLabel}
            <ArrowDown aria-hidden="true" size={17} strokeWidth={1.9} />
          </a>
          <a className={styles.secondaryAction} href={plannerHref}>
            {pageCopy.openPlannerLabel}
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.9} />
          </a>
        </div>
      </div>

      <figure className={styles.heroVisual}>
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

function renderWildernessFarmWhatIs(pageCopy: WildernessFarmPageCopy) {
  return (
    <section
      aria-labelledby="wilderness-farm-what-is-heading"
      className={styles.whatIs}
      id="wilderness-farm-what-is"
    >
      <h2 id="wilderness-farm-what-is-heading">{pageCopy.whatIsHeading}</h2>
      <div className={styles.whatIsCopy}>
        {pageCopy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
          <p key={paragraphIndex}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function renderWildernessFarmCases(pageCopy: WildernessFarmPageCopy) {
  return (
    <section
      aria-labelledby="wilderness-farm-layouts-heading"
      className={styles.cases}
      id="wilderness-farm-layouts"
    >
      <div className={styles.sectionHeading}>
        <h2 id="wilderness-farm-layouts-heading">{pageCopy.casesHeading}</h2>
        <p className={styles.casesDescription}>{pageCopy.casesDescription}</p>
      </div>
      <div>
        {pageCopy.cases.map((layoutCase) =>
          renderWildernessFarmCase(layoutCase, pageCopy),
        )}
      </div>
    </section>
  );
}

function renderWildernessFarmPlannerCta(
  pageCopy: WildernessFarmPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="wilderness-farm-cta-heading"
      className={styles.ctaSection}
      id="wilderness-farm-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="wilderness-farm-cta-heading">{pageCopy.ctaHeading}</h2>
        <p>{pageCopy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {pageCopy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function WildernessFarmPage({ locale }: WildernessFarmPageProperties) {
  const pageCopy = getWildernessFarmPageCopy(locale);
  const featuredCase = getFeaturedWildernessFarmCase(locale);
  requireSevenWildernessFarmCases(pageCopy.cases);
  requireTwoWildernessFarmWhatIsParagraphs(pageCopy.whatIsParagraphs);
  requireFeaturedWildernessFarmCaseVisible(featuredCase, pageCopy.cases);

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={styles.page}
      data-wilderness-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderWildernessFarmHero(pageCopy, featuredCase, plannerHref)}
      {renderWildernessFarmWhatIs(pageCopy)}
      {renderWildernessFarmCases(pageCopy)}
      <HowItWorks09
        cta={{ href: plannerHref, label: pageCopy.openPlannerLabel }}
        eyebrow={pageCopy.howToEyebrow}
        headingId="wilderness-farm-how-to-heading"
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
      {renderWildernessFarmPlannerCta(pageCopy, plannerHref)}
    </article>
  );
}
