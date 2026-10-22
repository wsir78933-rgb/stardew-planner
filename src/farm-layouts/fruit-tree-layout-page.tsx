import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getFruitTreeLayoutPageCopy,
  type FruitTreeLayoutCase,
  type FruitTreeLayoutPageCopy,
} from "./fruit-tree-layout-content";
import styles from "./beach-farm-page.module.css";
import sprinklerStyles from "./sprinkler-layout-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

type FruitTreeLayoutPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function renderFruitTreeLayoutCase(
  layoutCase: FruitTreeLayoutCase,
  copy: FruitTreeLayoutPageCopy,
) {
  const headingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className={`${styles.case} ${sprinklerStyles.sprinklerCase}`}
      data-fruit-tree-layout-case={layoutCase.id}
      id={layoutCase.id}
      key={layoutCase.id}
    >
      <figure
        className={`${styles.caseVisual} ${sprinklerStyles.sprinklerCaseVisual}`}
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
        className={`${styles.caseDetails} ${sprinklerStyles.sprinklerCaseDetails}`}
      >
        <div className={styles.caseHeading}>
          <h3 id={headingId}>{layoutCase.title}</h3>
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

function renderFruitTreeLayoutHero(
  copy: FruitTreeLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="fruit-tree-layout-page-title"
      className={`${styles.hero} ${sprinklerStyles.sprinklerHero}`}
    >
      <div className={`${styles.heroCopy} ${sprinklerStyles.sprinklerHeroCopy}`}>
        <h1 id="fruit-tree-layout-page-title">{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#fruit-tree-layout-cases">
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
        className={`${styles.heroVisual} ${sprinklerStyles.sprinklerHeroVisual}`}
        data-fruit-tree-layout-cover="true"
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
          className={`${styles.heroCaption} ${sprinklerStyles.sprinklerHeroCaption}`}
        >
          <span>{copy.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{copy.cover.caption}</span>
        </figcaption>
      </figure>
    </section>
  );
}

function renderFruitTreeLayoutWhatIs(copy: FruitTreeLayoutPageCopy) {
  return (
    <section
      aria-labelledby="fruit-tree-layout-what-is-heading"
      className={styles.whatIs}
      id="fruit-tree-layout-what-is"
    >
      <h2 id="fruit-tree-layout-what-is-heading">{copy.whatIsHeading}</h2>
      <div className={styles.whatIsCopy}>
        {copy.whatIsParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function renderFruitTreeLayoutCases(copy: FruitTreeLayoutPageCopy) {
  return (
    <section
      aria-labelledby="fruit-tree-layout-cases-heading"
      className={styles.cases}
      id="fruit-tree-layout-cases"
    >
      <div className={styles.sectionHeading}>
        <h2 id="fruit-tree-layout-cases-heading">{copy.casesHeading}</h2>
        <p className={styles.casesDescription}>{copy.casesDescription}</p>
      </div>
      <div>
        {copy.cases.map((layoutCase) =>
          renderFruitTreeLayoutCase(layoutCase, copy),
        )}
      </div>
    </section>
  );
}

function renderFruitTreeLayoutHowTo(
  copy: FruitTreeLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <HowItWorks09
      cta={{ href: plannerHref, label: copy.openPlannerLabel }}
      eyebrow={copy.howToEyebrow}
      headingId="fruit-tree-layout-how-to-heading"
      steps={copy.howToSteps}
      title={copy.howToHeading}
    />
  );
}

function renderFruitTreeLayoutFaq(copy: FruitTreeLayoutPageCopy) {
  return (
    <section
      aria-label={copy.faqHeading}
      className={styles.faqSection}
      id="fruit-tree-layout-faq"
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

function renderFruitTreeLayoutCta(
  copy: FruitTreeLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="fruit-tree-layout-cta-heading"
      className={styles.ctaSection}
      id="fruit-tree-layout-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="fruit-tree-layout-cta-heading">{copy.ctaHeading}</h2>
        <p>{copy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {copy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function FruitTreeLayoutPage({ locale }: FruitTreeLayoutPageProperties) {
  const copy = getFruitTreeLayoutPageCopy(locale);
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${sprinklerStyles.sprinklerPage}`}
      data-fruit-tree-layout-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderFruitTreeLayoutHero(copy, plannerHref)}
      {renderFruitTreeLayoutWhatIs(copy)}
      {renderFruitTreeLayoutCases(copy)}
      {renderFruitTreeLayoutHowTo(copy, plannerHref)}
      {renderFruitTreeLayoutFaq(copy)}
      {renderFruitTreeLayoutCta(copy, plannerHref)}
    </article>
  );
}
