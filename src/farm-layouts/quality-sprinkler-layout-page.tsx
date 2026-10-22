import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getQualitySprinklerLayoutPageCopy,
  type QualitySprinklerLayoutCase,
  type QualitySprinklerLayoutPageCopy,
} from "./quality-sprinkler-layout-content";
import styles from "./beach-farm-page.module.css";
import qualitySprinklerStyles from "./quality-sprinkler-layout-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

type QualitySprinklerLayoutPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function receivedQualitySprinklerLayoutValue(value: unknown): string {
  return JSON.stringify(value) ?? String(value);
}

function requireQualitySprinklerLayoutPageCopy(
  copy: QualitySprinklerLayoutPageCopy,
): void {
  if (!Array.isArray(copy.cases) || copy.cases.length !== 6) {
    throw new Error(
      `Quality Sprinkler Layout page requires exactly 6 cases. Received: ${receivedQualitySprinklerLayoutValue(copy.cases)}.`,
    );
  }
}

function renderQualitySprinklerLayoutCase(
  layoutCase: QualitySprinklerLayoutCase,
  copy: QualitySprinklerLayoutPageCopy,
) {
  const caseHeadingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={`${styles.case} ${qualitySprinklerStyles.qualitySprinklerCase}`}
      data-quality-sprinkler-layout-case={layoutCase.id}
      id={layoutCase.id}
      key={layoutCase.id}
    >
      <figure
        className={`${styles.caseVisual} ${qualitySprinklerStyles.qualitySprinklerCaseVisual}`}
      >
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

      <div
        className={`${styles.caseDetails} ${qualitySprinklerStyles.qualitySprinklerCaseDetails}`}
      >
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

function renderQualitySprinklerLayoutHero(
  copy: QualitySprinklerLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="quality-sprinkler-layout-page-title"
      className={`${styles.hero} ${qualitySprinklerStyles.qualitySprinklerHero}`}
    >
      <div
        className={`${styles.heroCopy} ${qualitySprinklerStyles.qualitySprinklerHeroCopy}`}
      >
        <h1 id="quality-sprinkler-layout-page-title">{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#quality-sprinkler-layout-layouts">
            {copy.browseLabel}
            <ArrowDown aria-hidden="true" size={17} strokeWidth={1.9} />
          </a>
          <a className={styles.secondaryAction} href={plannerHref}>
            {copy.openPlannerLabel}
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.9} />
          </a>
        </div>
      </div>

      <figure
        className={`${styles.heroVisual} ${qualitySprinklerStyles.qualitySprinklerHeroVisual}`}
        data-quality-sprinkler-layout-cover="true"
      >
        <LayoutImageViewer
          closeLabel={copy.closeImageLabel}
          enlargeLabel={copy.enlargeImageLabel}
          imageAlt={copy.cover.imageAlt}
          imageHeight={copy.cover.imageHeight}
          imageOriginalSrc={copy.cover.imageOriginalSrc}
          imageSrc={copy.cover.imageSrc}
          imageWidth={copy.cover.imageWidth}
          isPriorityImage
        />
        <figcaption
          className={`${styles.heroCaption} ${qualitySprinklerStyles.qualitySprinklerHeroCaption}`}
        >
          <span>{copy.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{copy.cover.caption}</span>
        </figcaption>
      </figure>
    </section>
  );
}

function renderQualitySprinklerLayoutWhatIs(
  copy: QualitySprinklerLayoutPageCopy,
) {
  return (
    <section
      aria-labelledby="quality-sprinkler-layout-what-is-heading"
      className={styles.whatIs}
      id="quality-sprinkler-layout-what-is"
    >
      <h2 id="quality-sprinkler-layout-what-is-heading">
        {copy.whatIsHeading}
      </h2>
      <div className={styles.whatIsCopy}>
        {copy.whatIsParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function renderQualitySprinklerLayoutCases(
  copy: QualitySprinklerLayoutPageCopy,
) {
  return (
    <section
      aria-labelledby="quality-sprinkler-layout-layouts-heading"
      className={styles.cases}
      id="quality-sprinkler-layout-layouts"
    >
      <div className={styles.sectionHeading}>
        <h2 id="quality-sprinkler-layout-layouts-heading">
          {copy.casesHeading}
        </h2>
        <p className={styles.casesDescription}>{copy.casesDescription}</p>
      </div>
      <div>
        {copy.cases.map((layoutCase) =>
          renderQualitySprinklerLayoutCase(layoutCase, copy),
        )}
      </div>
    </section>
  );
}

function renderQualitySprinklerLayoutHowTo(
  copy: QualitySprinklerLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <HowItWorks09
      cta={{ href: plannerHref, label: copy.openPlannerLabel }}
      eyebrow={copy.howToEyebrow}
      headingId="quality-sprinkler-layout-how-to-heading"
      steps={copy.howToSteps}
      title={copy.howToHeading}
    />
  );
}

function renderQualitySprinklerLayoutFaq(
  copy: QualitySprinklerLayoutPageCopy,
) {
  return (
    <section
      aria-label={copy.faqHeading}
      className={styles.faqSection}
      id="quality-sprinkler-layout-faq"
    >
      <Faq1
        className={styles.faqComponent}
        description={copy.faqDescription}
        eyebrow={copy.faqEyebrow}
        items={copy.faqs}
        title={copy.faqHeading}
      />
    </section>
  );
}

function renderQualitySprinklerLayoutCta(
  copy: QualitySprinklerLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="quality-sprinkler-layout-cta-heading"
      className={styles.ctaSection}
      id="quality-sprinkler-layout-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="quality-sprinkler-layout-cta-heading">{copy.ctaHeading}</h2>
        <p>{copy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {copy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function QualitySprinklerLayoutPage({
  locale,
}: QualitySprinklerLayoutPageProperties) {
  const copy = getQualitySprinklerLayoutPageCopy(locale);
  requireQualitySprinklerLayoutPageCopy(copy);
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${qualitySprinklerStyles.qualitySprinklerLayoutPage}`}
      data-quality-sprinkler-layout-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderQualitySprinklerLayoutHero(copy, plannerHref)}
      {renderQualitySprinklerLayoutWhatIs(copy)}
      {renderQualitySprinklerLayoutCases(copy)}
      {renderQualitySprinklerLayoutHowTo(copy, plannerHref)}
      {renderQualitySprinklerLayoutFaq(copy)}
      {renderQualitySprinklerLayoutCta(copy, plannerHref)}
    </article>
  );
}
