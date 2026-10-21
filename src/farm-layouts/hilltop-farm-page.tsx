import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getFeaturedHilltopFarmCase,
  getHilltopFarmPageCopy,
  type HilltopFarmCase,
  type HilltopFarmPageCopy,
} from "./hilltop-farm-content";
import styles from "./beach-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedHilltopFarmCaseCount = 7;

type HilltopFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSevenHilltopFarmCases(cases: readonly HilltopFarmCase[]): void {
  if (cases.length !== expectedHilltopFarmCaseCount) {
    throw new Error(
      `Hilltop Farm page requires exactly ${expectedHilltopFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoWhatIsParagraphs(paragraphs: readonly string[]): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Hilltop Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function requireFeaturedHilltopFarmCaseVisible(
  featuredCase: HilltopFarmCase,
  cases: readonly HilltopFarmCase[],
): void {
  if (!cases.some((layoutCase) => layoutCase.id === featuredCase.id)) {
    throw new Error(
      `Hilltop Farm featured case must appear in the visible case list. Received featured case ID ${JSON.stringify(featuredCase.id)} and case IDs ${JSON.stringify(cases.map((layoutCase) => layoutCase.id))}.`,
    );
  }
}

function getHilltopFarmCaseAnchorId(caseId: string): string {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Hilltop Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }

  return caseId;
}

function renderHilltopFarmCase(
  layoutCase: HilltopFarmCase,
  pageCopy: HilltopFarmPageCopy,
) {
  const anchorId = getHilltopFarmCaseAnchorId(layoutCase.id);

  return (
    <article
      aria-labelledby={`${anchorId}-title`}
      className={styles.case}
      data-hilltop-farm-case={layoutCase.id}
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

function renderHilltopFarmHero(
  pageCopy: HilltopFarmPageCopy,
  featuredCase: HilltopFarmCase,
  plannerHref: string,
) {
  return (
    <section aria-labelledby="hilltop-farm-page-title" className={styles.hero}>
      <div className={styles.heroCopy}>
        <h1 id="hilltop-farm-page-title">{pageCopy.title}</h1>
        <p className={styles.intro}>{pageCopy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#hilltop-farm-layouts">
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

function renderHilltopFarmWhatIs(pageCopy: HilltopFarmPageCopy) {
  return (
    <section
      aria-labelledby="hilltop-farm-what-is-heading"
      className={styles.whatIs}
      id="hilltop-farm-what-is"
    >
      <h2 id="hilltop-farm-what-is-heading">{pageCopy.whatIsHeading}</h2>
      <div className={styles.whatIsCopy}>
        {pageCopy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
          <p key={paragraphIndex}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function renderHilltopFarmCases(pageCopy: HilltopFarmPageCopy) {
  return (
    <section
      aria-labelledby="hilltop-farm-layouts-heading"
      className={styles.cases}
      id="hilltop-farm-layouts"
    >
      <div className={styles.sectionHeading}>
        <h2 id="hilltop-farm-layouts-heading">{pageCopy.casesHeading}</h2>
        <p className={styles.casesDescription}>{pageCopy.casesDescription}</p>
      </div>
      <div>
        {pageCopy.cases.map((layoutCase) =>
          renderHilltopFarmCase(layoutCase, pageCopy),
        )}
      </div>
    </section>
  );
}

function renderHilltopFarmPlannerCta(
  pageCopy: HilltopFarmPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="hilltop-farm-cta-heading"
      className={styles.ctaSection}
      id="hilltop-farm-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="hilltop-farm-cta-heading">{pageCopy.ctaHeading}</h2>
        <p>{pageCopy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {pageCopy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function HilltopFarmPage({ locale }: HilltopFarmPageProperties) {
  const pageCopy = getHilltopFarmPageCopy(locale);
  const featuredCase = getFeaturedHilltopFarmCase(locale);
  requireSevenHilltopFarmCases(pageCopy.cases);
  requireTwoWhatIsParagraphs(pageCopy.whatIsParagraphs);
  requireFeaturedHilltopFarmCaseVisible(featuredCase, pageCopy.cases);

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={styles.page}
      data-hilltop-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderHilltopFarmHero(pageCopy, featuredCase, plannerHref)}
      {renderHilltopFarmWhatIs(pageCopy)}
      {renderHilltopFarmCases(pageCopy)}
      <HowItWorks09
        cta={{ href: plannerHref, label: pageCopy.openPlannerLabel }}
        eyebrow={pageCopy.howToEyebrow}
        headingId="hilltop-farm-how-to-heading"
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
      {renderHilltopFarmPlannerCta(pageCopy, plannerHref)}
    </article>
  );
}
