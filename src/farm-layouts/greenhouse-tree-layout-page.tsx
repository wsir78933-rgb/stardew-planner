import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import type { JSX } from "react";

import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import { LayoutImageViewer } from "./layout-image-viewer";
import {
  getGreenhouseTreeLayoutPageCopy,
  type GreenhouseTreeLayoutCase,
  type GreenhouseTreeLayoutPageCopy,
} from "./greenhouse-tree-layout-content";
import styles from "./beach-farm-page.module.css";
import greenhouseTreeStyles from "./greenhouse-tree-layout-page.module.css";

type GreenhouseTreeLayoutPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function renderGreenhouseTreeLayoutCase(
  layoutCase: GreenhouseTreeLayoutCase,
  copy: GreenhouseTreeLayoutPageCopy,
): JSX.Element {
  const caseHeadingId = `greenhouse-tree-layout-${layoutCase.id}-heading`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={`${styles.case} ${greenhouseTreeStyles.greenhouseTreeLayoutCase}`}
      data-greenhouse-tree-layout-case={layoutCase.id}
      id={layoutCase.id}
      key={layoutCase.id}
    >
      <figure
        className={`${styles.caseVisual} ${greenhouseTreeStyles.greenhouseTreeLayoutCaseVisual}`}
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
        className={`${styles.caseDetails} ${greenhouseTreeStyles.greenhouseTreeLayoutCaseDetails}`}
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

export function GreenhouseTreeLayoutPage({
  locale,
}: GreenhouseTreeLayoutPageProperties): JSX.Element {
  const copy = getGreenhouseTreeLayoutPageCopy(locale);
  if (!Array.isArray(copy.cases) || copy.cases.length !== 6) {
    throw new Error(
      `Greenhouse Tree Layout page requires exactly 6 cases; received ${JSON.stringify(copy.cases)}.`,
    );
  }

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${greenhouseTreeStyles.greenhouseTreeLayoutPage}`}
      data-greenhouse-tree-layout-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section
        aria-labelledby="greenhouse-tree-layout-page-title"
        className={`${styles.hero} ${greenhouseTreeStyles.greenhouseTreeLayoutHero}`}
      >
        <div
          className={`${styles.heroCopy} ${greenhouseTreeStyles.greenhouseTreeLayoutHeroCopy}`}
        >
          <h1 id="greenhouse-tree-layout-page-title">{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#greenhouse-tree-layout-layouts">
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
          className={`${styles.heroVisual} ${greenhouseTreeStyles.greenhouseTreeLayoutHeroVisual}`}
          data-greenhouse-tree-layout-cover="true"
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
            className={`${styles.heroCaption} ${greenhouseTreeStyles.greenhouseTreeLayoutHeroCaption}`}
          >
            <span>{copy.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{copy.cover.caption}</span>
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="greenhouse-tree-layout-what-is-heading"
        className={styles.whatIs}
        id="greenhouse-tree-layout-what-is"
      >
        <h2 id="greenhouse-tree-layout-what-is-heading">
          {copy.whatIsHeading}
        </h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="greenhouse-tree-layout-layouts-heading"
        className={styles.cases}
        id="greenhouse-tree-layout-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="greenhouse-tree-layout-layouts-heading">
            {copy.casesHeading}
          </h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>
          {copy.cases.map((layoutCase) =>
            renderGreenhouseTreeLayoutCase(layoutCase, copy),
          )}
        </div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: copy.openPlannerLabel }}
        eyebrow={copy.howToEyebrow}
        headingId="greenhouse-tree-layout-how-to-heading"
        steps={copy.howToSteps}
        title={copy.howToHeading}
      />

      <section
        aria-label={copy.faqHeading}
        className={styles.faqSection}
        id="greenhouse-tree-layout-faq"
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
        aria-labelledby="greenhouse-tree-layout-cta-heading"
        className={styles.ctaSection}
        id="greenhouse-tree-layout-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="greenhouse-tree-layout-cta-heading">{copy.ctaHeading}</h2>
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
