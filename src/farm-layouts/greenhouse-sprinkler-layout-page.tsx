import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import type { JSX } from "react";

import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import { LayoutImageViewer } from "./layout-image-viewer";
import {
  getGreenhouseSprinklerLayoutPageCopy,
  type GreenhouseSprinklerLayoutCase,
  type GreenhouseSprinklerLayoutPageCopy,
} from "./greenhouse-sprinkler-layout-content";
import styles from "./beach-farm-page.module.css";
import greenhouseSprinklerStyles from "./greenhouse-sprinkler-layout-page.module.css";

type GreenhouseSprinklerLayoutPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function renderGreenhouseSprinklerLayoutCase(
  layoutCase: GreenhouseSprinklerLayoutCase,
  copy: GreenhouseSprinklerLayoutPageCopy,
): JSX.Element {
  const caseHeadingId = `greenhouse-sprinkler-layout-${layoutCase.id}-heading`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={`${styles.case} ${greenhouseSprinklerStyles.greenhouseSprinklerLayoutCase}`}
      data-greenhouse-sprinkler-layout-case={layoutCase.id}
      id={`greenhouse-sprinkler-layout-${layoutCase.id}`}
      key={layoutCase.id}
    >
      <figure
        className={`${styles.caseVisual} ${greenhouseSprinklerStyles.greenhouseSprinklerLayoutCaseVisual}`}
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
        className={`${styles.caseDetails} ${greenhouseSprinklerStyles.greenhouseSprinklerLayoutCaseDetails}`}
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

export function GreenhouseSprinklerLayoutPage({
  locale,
}: GreenhouseSprinklerLayoutPageProperties): JSX.Element {
  const copy = getGreenhouseSprinklerLayoutPageCopy(locale);
  if (!Array.isArray(copy.cases) || copy.cases.length !== 6) {
    throw new Error(
      `Greenhouse Sprinkler Layout page requires exactly 6 cases; received ${JSON.stringify(copy.cases)}.`,
    );
  }

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${greenhouseSprinklerStyles.greenhouseSprinklerLayoutPage}`}
      data-greenhouse-sprinkler-layout-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section
        aria-labelledby="greenhouse-sprinkler-layout-page-title"
        className={`${styles.hero} ${greenhouseSprinklerStyles.greenhouseSprinklerLayoutHero}`}
      >
        <div
          className={`${styles.heroCopy} ${greenhouseSprinklerStyles.greenhouseSprinklerLayoutHeroCopy}`}
        >
          <h1 id="greenhouse-sprinkler-layout-page-title">{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#greenhouse-sprinkler-layout-layouts">
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
          className={`${styles.heroVisual} ${greenhouseSprinklerStyles.greenhouseSprinklerLayoutHeroVisual}`}
          data-greenhouse-sprinkler-layout-cover="true"
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
            className={`${styles.heroCaption} ${greenhouseSprinklerStyles.greenhouseSprinklerLayoutHeroCaption}`}
          >
            <span>{copy.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{copy.cover.caption}</span>
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="greenhouse-sprinkler-layout-what-is-heading"
        className={styles.whatIs}
        id="greenhouse-sprinkler-layout-what-is"
      >
        <h2 id="greenhouse-sprinkler-layout-what-is-heading">
          {copy.whatIsHeading}
        </h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="greenhouse-sprinkler-layout-layouts-heading"
        className={styles.cases}
        id="greenhouse-sprinkler-layout-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="greenhouse-sprinkler-layout-layouts-heading">
            {copy.casesHeading}
          </h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>
          {copy.cases.map((layoutCase) =>
            renderGreenhouseSprinklerLayoutCase(layoutCase, copy),
          )}
        </div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: copy.openPlannerLabel }}
        eyebrow={copy.howToEyebrow}
        headingId="greenhouse-sprinkler-layout-how-to-heading"
        steps={copy.howToSteps}
        title={copy.howToHeading}
      />

      <section
        aria-label={copy.faqHeading}
        className={styles.faqSection}
        id="greenhouse-sprinkler-layout-faq"
      >
        <Faq1
          className={styles.faqComponent}
          description={copy.faqDescription}
          eyebrow={copy.faqEyebrow}
          items={copy.faqs}
          title={copy.faqHeading}
        />
      </section>

      <section
        aria-labelledby="greenhouse-sprinkler-layout-cta-heading"
        className={styles.ctaSection}
        id="greenhouse-sprinkler-layout-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="greenhouse-sprinkler-layout-cta-heading">{copy.ctaHeading}</h2>
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
