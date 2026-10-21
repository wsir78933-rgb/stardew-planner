import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getFourCornersFarmPageCopy,
  type FourCornersFarmCase,
  type FourCornersFarmPageCopy,
} from "./four-corners-farm-content";
import styles from "./beach-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedFourCornersFarmCaseCount = 7;
const expectedFourCornersMapWidth = 1600;
const expectedFourCornersMapHeight = 1600;

type FourCornersFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSevenFourCornersFarmCases(
  cases: readonly FourCornersFarmCase[],
): void {
  if (cases.length !== expectedFourCornersFarmCaseCount) {
    throw new Error(
      `Four Corners Farm page requires exactly ${expectedFourCornersFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoFourCornersWhatIsParagraphs(
  paragraphs: readonly string[],
): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Four Corners Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function requireSquareFourCornersMaps(
  cases: readonly FourCornersFarmCase[],
): void {
  for (const layoutCase of cases) {
    if (
      layoutCase.imageWidth !== expectedFourCornersMapWidth ||
      layoutCase.imageHeight !== expectedFourCornersMapHeight
    ) {
      throw new Error(
        `Four Corners Farm case ${JSON.stringify(layoutCase.id)} must use a ${expectedFourCornersMapWidth}x${expectedFourCornersMapHeight} square map. Received: ${JSON.stringify({ width: layoutCase.imageWidth, height: layoutCase.imageHeight })}.`,
      );
    }
  }
}

function requireFourCornersFarmCaseId(caseId: string): void {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Four Corners Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }
}

function renderFourCornersFarmCase(
  layoutCase: FourCornersFarmCase,
  copy: FourCornersFarmPageCopy,
) {
  requireFourCornersFarmCaseId(layoutCase.id);
  const caseHeadingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={styles.case}
      data-four-corners-farm-case={layoutCase.id}
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

export function FourCornersFarmPage({
  locale,
}: FourCornersFarmPageProperties) {
  const copy = getFourCornersFarmPageCopy(locale);
  requireSevenFourCornersFarmCases(copy.cases);
  requireTwoFourCornersWhatIsParagraphs(copy.whatIsParagraphs);
  requireSquareFourCornersMaps(copy.cases);

  const firstLayoutCase = copy.cases[0];
  if (firstLayoutCase === undefined) {
    throw new Error(
      "Four Corners Farm page is missing its first case after the seven-case check.",
    );
  }

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={styles.page}
      data-four-corners-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section
        aria-labelledby="four-corners-farm-page-title"
        className={styles.hero}
      >
        <div className={styles.heroCopy}>
          <h1
            id="four-corners-farm-page-title"
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
            <a className={styles.primaryAction} href="#four-corners-farm-layouts">
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
        aria-labelledby="four-corners-farm-what-is-heading"
        className={styles.whatIs}
        id="four-corners-farm-what-is"
      >
        <h2 id="four-corners-farm-what-is-heading">{copy.whatIsHeading}</h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="four-corners-farm-layouts-heading"
        className={styles.cases}
        id="four-corners-farm-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="four-corners-farm-layouts-heading">{copy.casesHeading}</h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>
          {copy.cases.map((layoutCase) =>
            renderFourCornersFarmCase(layoutCase, copy),
          )}
        </div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: copy.openPlannerLabel }}
        eyebrow={copy.howToEyebrow}
        headingId="four-corners-farm-how-to-heading"
        steps={copy.howToSteps}
        title={copy.howToHeading}
      />

      <section
        aria-label={copy.faqHeading}
        className={styles.faqSection}
        id="four-corners-farm-faq"
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
        aria-labelledby="four-corners-farm-cta-heading"
        className={styles.ctaSection}
        id="four-corners-farm-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="four-corners-farm-cta-heading">{copy.ctaHeading}</h2>
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
