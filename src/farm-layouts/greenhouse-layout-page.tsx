import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getFeaturedGreenhouseLayoutCase,
  getGreenhouseLayoutPageCopy,
  type GreenhouseLayoutCase,
  type GreenhouseLayoutPageCopy,
} from "./greenhouse-layout-content";
import styles from "./beach-farm-page.module.css";
import greenhouseStyles from "./greenhouse-layout-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedGreenhouseLayoutCaseCount = 7;

type GreenhouseLayoutPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSevenGreenhouseLayoutCases(
  cases: readonly GreenhouseLayoutCase[],
): void {
  if (cases.length !== expectedGreenhouseLayoutCaseCount) {
    throw new Error(
      `Greenhouse Layout page requires exactly ${expectedGreenhouseLayoutCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireFeaturedGreenhouseLayoutCaseVisible(
  featuredCase: GreenhouseLayoutCase,
  cases: readonly GreenhouseLayoutCase[],
): void {
  if (!cases.some((layoutCase) => layoutCase.id === featuredCase.id)) {
    throw new Error(
      `Greenhouse Layout featured case must appear in the visible case list. Received featured case ID ${JSON.stringify(featuredCase.id)} and case IDs ${JSON.stringify(cases.map((layoutCase) => layoutCase.id))}.`,
    );
  }
}

function getGreenhouseLayoutCaseAnchorId(caseId: string): string {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Greenhouse Layout case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }

  return caseId;
}

function renderGreenhouseLayoutCase(
  layoutCase: GreenhouseLayoutCase,
  pageCopy: GreenhouseLayoutPageCopy,
) {
  const anchorId = getGreenhouseLayoutCaseAnchorId(layoutCase.id);

  return (
    <article
      aria-labelledby={`${anchorId}-title`}
      className={styles.case}
      data-greenhouse-layout-case={layoutCase.id}
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

function renderGreenhouseLayoutHero(
  pageCopy: GreenhouseLayoutPageCopy,
  featuredCase: GreenhouseLayoutCase,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="greenhouse-layout-page-title"
      className={styles.hero}
      data-greenhouse-layout-hero="true"
    >
      <div className={styles.heroCopy}>
        <h1 id="greenhouse-layout-page-title">{pageCopy.heading}</h1>
        <p className={styles.intro}>{pageCopy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#greenhouse-layout-cases">
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

function renderGreenhouseLayoutWhatIs(pageCopy: GreenhouseLayoutPageCopy) {
  return (
    <section
      aria-labelledby="greenhouse-layout-what-is-heading"
      className={styles.whatIs}
      id="greenhouse-layout-what-is"
    >
      <h2 id="greenhouse-layout-what-is-heading">{pageCopy.whatIsHeading}</h2>
      <div className={styles.whatIsCopy}>
        {pageCopy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
          <p key={paragraphIndex}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function renderGreenhouseLayoutCases(pageCopy: GreenhouseLayoutPageCopy) {
  return (
    <section
      aria-labelledby="greenhouse-layout-cases-heading"
      className={styles.cases}
      id="greenhouse-layout-cases"
    >
      <div className={styles.sectionHeading}>
        <h2 id="greenhouse-layout-cases-heading">{pageCopy.casesHeading}</h2>
        <p className={styles.casesDescription}>{pageCopy.casesDescription}</p>
      </div>
      <div>
        {pageCopy.cases.map((layoutCase) =>
          renderGreenhouseLayoutCase(layoutCase, pageCopy),
        )}
      </div>
    </section>
  );
}

function renderGreenhouseLayoutPlannerCta(
  pageCopy: GreenhouseLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="greenhouse-layout-cta-heading"
      className={styles.ctaSection}
      id="greenhouse-layout-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="greenhouse-layout-cta-heading">{pageCopy.ctaHeading}</h2>
        <p>{pageCopy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {pageCopy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function GreenhouseLayoutPage({ locale }: GreenhouseLayoutPageProperties) {
  const pageCopy = getGreenhouseLayoutPageCopy(locale);
  const featuredCase = getFeaturedGreenhouseLayoutCase(locale);
  requireSevenGreenhouseLayoutCases(pageCopy.cases);
  requireFeaturedGreenhouseLayoutCaseVisible(featuredCase, pageCopy.cases);

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${greenhouseStyles.greenhousePage}`}
      data-greenhouse-layout-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderGreenhouseLayoutHero(pageCopy, featuredCase, plannerHref)}
      {renderGreenhouseLayoutWhatIs(pageCopy)}
      {renderGreenhouseLayoutCases(pageCopy)}
      <HowItWorks09
        cta={{ href: plannerHref, label: pageCopy.openPlannerLabel }}
        eyebrow={pageCopy.howToEyebrow}
        headingId="greenhouse-layout-how-to-heading"
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
      {renderGreenhouseLayoutPlannerCta(pageCopy, plannerHref)}
    </article>
  );
}
