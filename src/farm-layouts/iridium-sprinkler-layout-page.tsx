import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getIridiumSprinklerLayoutPageCopy,
  type IridiumSprinklerLayoutCase,
  type IridiumSprinklerLayoutPageCopy,
} from "./iridium-sprinkler-layout-content";
import styles from "./beach-farm-page.module.css";
import sprinklerStyles from "./sprinkler-layout-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

type IridiumSprinklerLayoutPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function renderIridiumSprinklerLayoutCase(
  layoutCase: IridiumSprinklerLayoutCase,
  copy: IridiumSprinklerLayoutPageCopy,
) {
  const headingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className={`${styles.case} ${sprinklerStyles.sprinklerCase}`}
      data-iridium-sprinkler-layout-case={layoutCase.id}
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

function renderIridiumSprinklerLayoutHero(
  copy: IridiumSprinklerLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="iridium-sprinkler-layout-page-title"
      className={`${styles.hero} ${sprinklerStyles.sprinklerHero}`}
    >
      <div className={`${styles.heroCopy} ${sprinklerStyles.sprinklerHeroCopy}`}>
        <h1 id="iridium-sprinkler-layout-page-title">{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#iridium-sprinkler-layout-cases">
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
        data-iridium-sprinkler-layout-cover="true"
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

function renderIridiumSprinklerLayoutWhatIs(
  copy: IridiumSprinklerLayoutPageCopy,
) {
  return (
    <section
      aria-labelledby="iridium-sprinkler-layout-what-is-heading"
      className={styles.whatIs}
      id="iridium-sprinkler-layout-what-is"
    >
      <h2 id="iridium-sprinkler-layout-what-is-heading">
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

function renderIridiumSprinklerLayoutCases(
  copy: IridiumSprinklerLayoutPageCopy,
) {
  return (
    <section
      aria-labelledby="iridium-sprinkler-layout-cases-heading"
      className={styles.cases}
      id="iridium-sprinkler-layout-cases"
    >
      <div className={styles.sectionHeading}>
        <h2 id="iridium-sprinkler-layout-cases-heading">{copy.casesHeading}</h2>
        <p className={styles.casesDescription}>{copy.casesDescription}</p>
      </div>
      <div>
        {copy.cases.map((layoutCase) =>
          renderIridiumSprinklerLayoutCase(layoutCase, copy),
        )}
      </div>
    </section>
  );
}

function renderIridiumSprinklerLayoutHowTo(
  copy: IridiumSprinklerLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <HowItWorks09
      cta={{ href: plannerHref, label: copy.openPlannerLabel }}
      eyebrow={copy.howToEyebrow}
      headingId="iridium-sprinkler-layout-how-to-heading"
      steps={copy.howToSteps}
      title={copy.howToHeading}
    />
  );
}

function renderIridiumSprinklerLayoutFaq(
  copy: IridiumSprinklerLayoutPageCopy,
) {
  return (
    <section
      aria-label={copy.faqHeading}
      className={styles.faqSection}
      id="iridium-sprinkler-layout-faq"
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

function renderIridiumSprinklerLayoutCta(
  copy: IridiumSprinklerLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <section
      aria-labelledby="iridium-sprinkler-layout-cta-heading"
      className={styles.ctaSection}
      id="iridium-sprinkler-layout-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="iridium-sprinkler-layout-cta-heading">{copy.ctaHeading}</h2>
        <p>{copy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {copy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function IridiumSprinklerLayoutPage({
  locale,
}: IridiumSprinklerLayoutPageProperties) {
  const copy = getIridiumSprinklerLayoutPageCopy(locale);
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${sprinklerStyles.sprinklerPage}`}
      data-iridium-sprinkler-layout-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderIridiumSprinklerLayoutHero(copy, plannerHref)}
      {renderIridiumSprinklerLayoutWhatIs(copy)}
      {renderIridiumSprinklerLayoutCases(copy)}
      {renderIridiumSprinklerLayoutHowTo(copy, plannerHref)}
      {renderIridiumSprinklerLayoutFaq(copy)}
      {renderIridiumSprinklerLayoutCta(copy, plannerHref)}
    </article>
  );
}
