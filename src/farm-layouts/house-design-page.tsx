import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import type { JSX } from "react";

import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import { LayoutImageViewer } from "./layout-image-viewer";
import {
  getHouseDesignPageCopy,
  type HouseDesignCase,
  type HouseDesignPageCopy,
} from "./house-design-content";
import styles from "./beach-farm-page.module.css";
import houseDesignStyles from "./house-design-page.module.css";

type HouseDesignPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function receivedHouseDesignValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === null || typeof value !== "object") {
    return String(value);
  }

  return JSON.stringify(value) ?? String(value);
}

function assertHouseDesignPageCopy(copy: HouseDesignPageCopy): void {
  if (!Array.isArray(copy.cases) || copy.cases.length !== 6) {
    throw new Error(
      `House design page requires exactly 6 cases; received ${receivedHouseDesignValue(copy.cases)}.`,
    );
  }

  const caseIds = copy.cases.map((layoutCase) => layoutCase.id);
  const hasInvalidCaseId = caseIds.some(
    (caseId) => typeof caseId !== "string" || caseId.trim().length === 0,
  );
  const hasDuplicateCaseIds = new Set(caseIds).size !== caseIds.length;

  if (hasInvalidCaseId || hasDuplicateCaseIds) {
    const receivedCaseIds = caseIds
      .map(receivedHouseDesignValue)
      .join(", ");
    throw new Error(
      `House design page requires six unique, non-empty case IDs; received [${receivedCaseIds}].`,
    );
  }
}

function renderHouseDesignCase(
  layoutCase: HouseDesignCase,
  copy: HouseDesignPageCopy,
): JSX.Element {
  const caseAnchorId = `house-design-${layoutCase.id}`;
  const caseHeadingId = `${caseAnchorId}-heading`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={`${styles.case} ${houseDesignStyles.houseDesignCase}`}
      data-house-design-case={layoutCase.id}
      id={caseAnchorId}
      key={layoutCase.id}
    >
      <figure
        className={`${styles.caseVisual} ${houseDesignStyles.houseDesignCaseVisual}`}
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
        className={`${styles.caseDetails} ${houseDesignStyles.houseDesignCaseDetails}`}
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

export function HouseDesignPage({ locale }: HouseDesignPageProperties): JSX.Element {
  const copy = getHouseDesignPageCopy(locale);
  assertHouseDesignPageCopy(copy);

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${houseDesignStyles.houseDesignPage}`}
      data-house-design-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section
        aria-labelledby="house-design-page-title"
        className={`${styles.hero} ${houseDesignStyles.houseDesignHero}`}
      >
        <div
          className={`${styles.heroCopy} ${houseDesignStyles.houseDesignHeroCopy}`}
        >
          <h1 id="house-design-page-title">{copy.title}</h1>
          <p className={styles.intro}>{copy.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#house-design-cases">
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
          className={`${styles.heroVisual} ${houseDesignStyles.houseDesignHeroVisual}`}
          data-house-design-cover="true"
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
            className={`${styles.heroCaption} ${houseDesignStyles.houseDesignHeroCaption}`}
          >
            <span>{copy.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{copy.cover.caption}</span>
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="house-design-what-is-heading"
        className={styles.whatIs}
        id="house-design-what-is"
      >
        <h2 id="house-design-what-is-heading">{copy.whatIsHeading}</h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="house-design-cases-heading"
        className={styles.cases}
        id="house-design-cases"
      >
        <div className={styles.sectionHeading}>
          <h2 id="house-design-cases-heading">{copy.casesHeading}</h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>
          {copy.cases.map((layoutCase) =>
            renderHouseDesignCase(layoutCase, copy),
          )}
        </div>
      </section>

      <div id="house-design-how-to">
        <HowItWorks09
          cta={{ href: plannerHref, label: copy.openPlannerLabel }}
          eyebrow={copy.howToEyebrow}
          headingId="house-design-how-to-heading"
          steps={copy.howToSteps}
          title={copy.howToHeading}
        />
      </div>

      <section
        aria-label={copy.faqHeading}
        className={styles.faqSection}
        id="house-design-faq"
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
        aria-labelledby="house-design-cta-heading"
        className={styles.ctaSection}
        id="house-design-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="house-design-cta-heading">{copy.ctaHeading}</h2>
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
