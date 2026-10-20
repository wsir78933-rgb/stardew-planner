import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getFeaturedFishFarmCase,
  getFishFarmPageCopy,
  type FishFarmCase,
  type FishFarmPageCopy,
} from "./fish-farm-content";
import styles from "./beach-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedFishFarmCaseCount = 6;

type FishFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSixFishFarmCases(cases: readonly FishFarmCase[]): void {
  if (cases.length !== expectedFishFarmCaseCount) {
    throw new Error(
      `Fish Farm page requires exactly ${expectedFishFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoWhatIsParagraphs(paragraphs: readonly string[]): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Fish Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function requireFeaturedFishFarmCaseVisible(
  featuredCase: FishFarmCase,
  cases: readonly FishFarmCase[],
): void {
  if (!cases.some((layoutCase) => layoutCase.id === featuredCase.id)) {
    throw new Error(
      `Fish Farm featured case must also appear in the visible case list. Received featured case ID ${JSON.stringify(featuredCase.id)} and case IDs ${JSON.stringify(cases.map((layoutCase) => layoutCase.id))}.`,
    );
  }
}

function getFishFarmCaseAnchorId(caseId: string): string {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Fish Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }

  return caseId;
}

function renderFishFarmCase(
  layoutCase: FishFarmCase,
  copy: FishFarmPageCopy,
) {
  const anchorId = getFishFarmCaseAnchorId(layoutCase.id);

  return (
    <article
      aria-labelledby={`${anchorId}-title`}
      className={styles.case}
      data-fish-farm-case={layoutCase.id}
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

export function FishFarmPage({ locale }: FishFarmPageProperties) {
  const copy = getFishFarmPageCopy(locale);
  const featuredCase = getFeaturedFishFarmCase(locale);
  requireSixFishFarmCases(copy.cases);
  requireTwoWhatIsParagraphs(copy.whatIsParagraphs);
  requireFeaturedFishFarmCaseVisible(featuredCase, copy.cases);

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={styles.page}
      data-fish-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section aria-labelledby="fish-farm-page-title" className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 id="fish-farm-page-title">{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#fish-farm-layouts">
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
            imageAlt={featuredCase.imageAlt}
            imageHeight={featuredCase.imageHeight}
            imageOriginalSrc={featuredCase.imageOriginalSrc}
            imageSrc={featuredCase.imageSrc}
            imageWidth={featuredCase.imageWidth}
            isPriorityImage
          />
          <figcaption className={styles.heroCaption}>
            <span>{copy.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{featuredCase.title}</span>
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="fish-farm-what-is-heading"
        className={styles.whatIs}
        id="fish-farm-what-is"
      >
        <h2 id="fish-farm-what-is-heading">{copy.whatIsHeading}</h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="fish-farm-layouts-heading"
        className={styles.cases}
        id="fish-farm-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="fish-farm-layouts-heading">{copy.casesHeading}</h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>{copy.cases.map((layoutCase) => renderFishFarmCase(layoutCase, copy))}</div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: copy.openPlannerLabel }}
        eyebrow={copy.howToEyebrow}
        headingId="fish-farm-how-to-heading"
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
        aria-labelledby="fish-farm-cta-heading"
        className={styles.ctaSection}
        id="fish-farm-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="fish-farm-cta-heading">{copy.ctaHeading}</h2>
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
