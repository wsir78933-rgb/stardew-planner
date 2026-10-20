import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getBeachFarmPageCopy,
  type BeachFarmCase,
  type BeachFarmPageCopy,
} from "./beach-farm-content";
import styles from "./beach-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedBeachFarmCaseCount = 9;

type BeachFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireNineBeachFarmCases(cases: readonly BeachFarmCase[]): void {
  if (cases.length !== expectedBeachFarmCaseCount) {
    throw new Error(
      `Beach Farm page requires exactly ${expectedBeachFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoWhatIsParagraphs(paragraphs: readonly string[]): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Beach Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function getBeachFarmCaseAnchorId(caseId: string): string {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Beach Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }

  return caseId;
}

function renderBeachFarmCase(
  layoutCase: BeachFarmCase,
  copy: BeachFarmPageCopy,
) {
  const anchorId = getBeachFarmCaseAnchorId(layoutCase.id);

  return (
    <article
      aria-labelledby={`${anchorId}-title`}
      className={styles.case}
      data-beach-farm-case={layoutCase.id}
      id={anchorId}
      key={layoutCase.id}
    >
      <figure className={styles.caseVisual}>
        <LayoutImageViewer
          closeLabel={copy.closeImageLabel}
          enlargeLabel={copy.enlargeImageLabel}
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
          {copy.downloadProjectLabel}
        </a>
      </div>
    </article>
  );
}

export function BeachFarmPage({ locale }: BeachFarmPageProperties) {
  const copy = getBeachFarmPageCopy(locale);
  requireNineBeachFarmCases(copy.cases);
  requireTwoWhatIsParagraphs(copy.whatIsParagraphs);

  const firstLayoutCase = copy.cases[0];
  if (firstLayoutCase === undefined) {
    throw new Error("Beach Farm page is missing its first case after the nine-case check.");
  }

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={styles.page}
      data-beach-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section aria-labelledby="beach-farm-page-title" className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 id="beach-farm-page-title">{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#beach-farm-layouts">
              {copy.browseLabel}
              <ArrowDown aria-hidden="true" size={17} strokeWidth={1.9} />
            </a>
            <a className={styles.secondaryAction} href={plannerHref}>
              {copy.openPlannerLabel}
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.9} />
            </a>
          </div>
        </div>

        <figure className={styles.heroVisual}>
          <LayoutImageViewer
            closeLabel={copy.closeImageLabel}
            enlargeLabel={copy.enlargeImageLabel}
            imageAlt={firstLayoutCase.imageAlt}
            imageHeight={firstLayoutCase.imageHeight}
            imageOriginalSrc={firstLayoutCase.imageOriginalSrc}
            imageSrc={firstLayoutCase.imageSrc}
            imageWidth={firstLayoutCase.imageWidth}
            isPriorityImage
          />
          <figcaption className={styles.heroCaption}>
            <span>{copy.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{firstLayoutCase.title}</span>
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="beach-farm-what-is-heading"
        className={styles.whatIs}
        id="beach-farm-what-is"
      >
        <h2 id="beach-farm-what-is-heading">{copy.whatIsHeading}</h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="beach-farm-layouts-heading"
        className={styles.cases}
        id="beach-farm-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="beach-farm-layouts-heading">{copy.casesHeading}</h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>
          {copy.cases.map((layoutCase) => renderBeachFarmCase(layoutCase, copy))}
        </div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: copy.openPlannerLabel }}
        eyebrow={copy.howToEyebrow}
        headingId="beach-farm-how-to-heading"
        steps={copy.howToSteps}
        title={copy.howToHeading}
      />

      <section aria-label={copy.faqHeading} className={styles.faqSection}>
        <Faq1
          className={styles.faqComponent}
          description={copy.faqDescription}
          eyebrow={copy.faqEyebrow}
          items={copy.faqs}
          title={copy.faqHeading}
        />
      </section>

      <section
        aria-labelledby="beach-farm-cta-heading"
        className={styles.ctaSection}
        id="beach-farm-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="beach-farm-cta-heading">{copy.ctaHeading}</h2>
          <p>{copy.ctaDescription}</p>
          <a className={styles.primaryAction} href={plannerHref}>
            {copy.ctaButtonLabel}
            <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
          </a>
        </div>
      </section>
    </article>
  );
}
