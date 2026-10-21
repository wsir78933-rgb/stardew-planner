import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getForestFarmPageCopy,
  type ForestFarmCase,
  type ForestFarmPageCopy,
} from "./forest-farm-content";
import styles from "./beach-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedForestFarmCaseCount = 6;
const expectedForestMapWidth = 1600;
const expectedForestMapHeight = 1300;

type ForestFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSixForestFarmCases(cases: readonly ForestFarmCase[]): void {
  if (cases.length !== expectedForestFarmCaseCount) {
    throw new Error(
      `Forest Farm page requires exactly ${expectedForestFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoForestWhatIsParagraphs(
  paragraphs: readonly string[],
): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Forest Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function requireForestMapDimensions(cases: readonly ForestFarmCase[]): void {
  for (const layoutCase of cases) {
    if (
      layoutCase.imageWidth !== expectedForestMapWidth ||
      layoutCase.imageHeight !== expectedForestMapHeight
    ) {
      throw new Error(
        `Forest Farm case ${JSON.stringify(layoutCase.id)} must use a ${expectedForestMapWidth}x${expectedForestMapHeight} map. Received: ${JSON.stringify({ width: layoutCase.imageWidth, height: layoutCase.imageHeight })}.`,
      );
    }
  }
}

function requireForestFarmCaseId(caseId: string): void {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Forest Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }
}

function renderForestFarmCase(
  layoutCase: ForestFarmCase,
  copy: ForestFarmPageCopy,
) {
  requireForestFarmCaseId(layoutCase.id);
  const caseHeadingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={styles.case}
      data-forest-farm-case={layoutCase.id}
      id={layoutCase.id}
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
          <h3 id={caseHeadingId}>{layoutCase.title}</h3>
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

export function ForestFarmPage({ locale }: ForestFarmPageProperties) {
  const copy = getForestFarmPageCopy(locale);
  requireSixForestFarmCases(copy.cases);
  requireTwoForestWhatIsParagraphs(copy.whatIsParagraphs);
  requireForestMapDimensions(copy.cases);

  const firstLayoutCase = copy.cases[0];
  if (firstLayoutCase === undefined) {
    throw new Error(
      "Forest Farm page is missing its first case after the six-case check.",
    );
  }

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={styles.page}
      data-forest-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section aria-labelledby="forest-farm-page-title" className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1
            id="forest-farm-page-title"
            style={{
              fontSize: "clamp(2.15rem, 4.2vw, 3.75rem)",
              maxWidth: "100%",
              overflowWrap: "normal",
            }}
          >
            {copy.title}
          </h1>
          <p className={styles.intro}>{copy.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#forest-farm-layouts">
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
        aria-labelledby="forest-farm-what-is-heading"
        className={styles.whatIs}
        id="forest-farm-what-is"
      >
        <h2 id="forest-farm-what-is-heading">{copy.whatIsHeading}</h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="forest-farm-layouts-heading"
        className={styles.cases}
        id="forest-farm-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="forest-farm-layouts-heading">{copy.casesHeading}</h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>
          {copy.cases.map((layoutCase) =>
            renderForestFarmCase(layoutCase, copy),
          )}
        </div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: copy.openPlannerLabel }}
        eyebrow={copy.howToEyebrow}
        headingId="forest-farm-how-to-heading"
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
        aria-labelledby="forest-farm-cta-heading"
        className={styles.ctaSection}
        id="forest-farm-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="forest-farm-cta-heading">{copy.ctaHeading}</h2>
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
