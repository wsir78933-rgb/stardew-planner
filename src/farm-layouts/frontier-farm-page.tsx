import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getFrontierFarmPageCopy,
  type FrontierFarmCase,
  type FrontierFarmCover,
  type FrontierFarmPageCopy,
} from "./frontier-farm-content";
import styles from "./beach-farm-page.module.css";
import frontierStyles from "./frontier-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedFrontierFarmCaseCount = 6;
const expectedFrontierMapWidth = 1920;
const expectedFrontierMapHeight = 800;

type FrontierFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSixFrontierFarmCases(
  cases: readonly FrontierFarmCase[],
): void {
  if (cases.length !== expectedFrontierFarmCaseCount) {
    throw new Error(
      `Frontier Farm page requires exactly ${expectedFrontierFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoFrontierWhatIsParagraphs(
  paragraphs: readonly string[],
): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Frontier Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function requireFrontierCoverDimensions(cover: FrontierFarmCover): void {
  if (
    cover.imageWidth !== expectedFrontierMapWidth ||
    cover.imageHeight !== expectedFrontierMapHeight
  ) {
    throw new Error(
      `Frontier Farm cover must use a ${expectedFrontierMapWidth}x${expectedFrontierMapHeight} image. Received: ${JSON.stringify({ width: cover.imageWidth, height: cover.imageHeight })}.`,
    );
  }
}

function requireFrontierCaseDimensions(
  cases: readonly FrontierFarmCase[],
): void {
  for (const layoutCase of cases) {
    if (
      layoutCase.imageWidth !== expectedFrontierMapWidth ||
      layoutCase.imageHeight !== expectedFrontierMapHeight
    ) {
      throw new Error(
        `Frontier Farm case ${JSON.stringify(layoutCase.id)} must use a ${expectedFrontierMapWidth}x${expectedFrontierMapHeight} image. Received: ${JSON.stringify({ width: layoutCase.imageWidth, height: layoutCase.imageHeight })}.`,
      );
    }
  }
}

function requireFrontierFarmCaseId(caseId: string): void {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Frontier Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }
}

function renderFrontierFarmCase(
  layoutCase: FrontierFarmCase,
  copy: FrontierFarmPageCopy,
) {
  requireFrontierFarmCaseId(layoutCase.id);
  const caseHeadingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={`${styles.case} ${frontierStyles.frontierCase}`}
      data-frontier-farm-case={layoutCase.id}
      id={layoutCase.id}
      key={layoutCase.id}
    >
      <figure
        className={`${styles.caseVisual} ${frontierStyles.frontierCaseVisual}`}
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
        className={`${styles.caseDetails} ${frontierStyles.frontierCaseDetails}`}
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

export function FrontierFarmPage({ locale }: FrontierFarmPageProperties) {
  const copy = getFrontierFarmPageCopy(locale);
  requireSixFrontierFarmCases(copy.cases);
  requireTwoFrontierWhatIsParagraphs(copy.whatIsParagraphs);
  requireFrontierCoverDimensions(copy.cover);
  requireFrontierCaseDimensions(copy.cases);

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${frontierStyles.frontierPage}`}
      data-frontier-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section
        aria-labelledby="frontier-farm-page-title"
        className={`${styles.hero} ${frontierStyles.frontierHero}`}
      >
        <div className={`${styles.heroCopy} ${frontierStyles.frontierHeroCopy}`}>
          <h1
            id="frontier-farm-page-title"
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
            <a className={styles.primaryAction} href="#frontier-farm-layouts">
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
          className={`${styles.heroVisual} ${frontierStyles.frontierHeroVisual}`}
          data-frontier-farm-cover="true"
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
          <figcaption className={styles.heroCaption}>
            <span>{copy.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{copy.cover.caption}</span>
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="frontier-farm-what-is-heading"
        className={styles.whatIs}
        id="frontier-farm-what-is"
      >
        <h2 id="frontier-farm-what-is-heading">{copy.whatIsHeading}</h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="frontier-farm-layouts-heading"
        className={styles.cases}
        id="frontier-farm-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="frontier-farm-layouts-heading">{copy.casesHeading}</h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>
          {copy.cases.map((layoutCase) =>
            renderFrontierFarmCase(layoutCase, copy),
          )}
        </div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: copy.openPlannerLabel }}
        eyebrow={copy.howToEyebrow}
        headingId="frontier-farm-how-to-heading"
        steps={copy.howToSteps}
        title={copy.howToHeading}
      />

      <section
        aria-label={copy.faqHeading}
        className={styles.faqSection}
        id="frontier-farm-faq"
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
        aria-labelledby="frontier-farm-cta-heading"
        className={styles.ctaSection}
        id="frontier-farm-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="frontier-farm-cta-heading">{copy.ctaHeading}</h2>
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
