import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getMeadowlandsFarmPageCopy,
  type MeadowlandsFarmCase,
  type MeadowlandsFarmPageCopy,
} from "./meadowlands-farm-content";
import styles from "./beach-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedMeadowlandsFarmCaseCount = 10;
const expectedMeadowlandsImageWidth = 1600;
const expectedMeadowlandsImageHeight = 1200;

type MeadowlandsFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireTenMeadowlandsFarmCases(
  cases: readonly MeadowlandsFarmCase[],
): void {
  if (cases.length !== expectedMeadowlandsFarmCaseCount) {
    throw new Error(
      `Meadowlands Farm page requires exactly ${expectedMeadowlandsFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoMeadowlandsWhatIsParagraphs(
  paragraphs: readonly string[],
): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Meadowlands Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function requireMeadowlandsImageDimensions(
  cases: readonly MeadowlandsFarmCase[],
): void {
  for (const layoutCase of cases) {
    if (
      layoutCase.imageWidth !== expectedMeadowlandsImageWidth ||
      layoutCase.imageHeight !== expectedMeadowlandsImageHeight
    ) {
      throw new Error(
        `Meadowlands Farm case ${JSON.stringify(layoutCase.id)} must use a ${expectedMeadowlandsImageWidth}x${expectedMeadowlandsImageHeight} map. Received: ${JSON.stringify({ width: layoutCase.imageWidth, height: layoutCase.imageHeight })}.`,
      );
    }
  }
}

function requireMeadowlandsFarmCaseId(caseId: string): void {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Meadowlands Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }
}

function renderMeadowlandsFarmCase(
  layoutCase: MeadowlandsFarmCase,
  copy: MeadowlandsFarmPageCopy,
) {
  requireMeadowlandsFarmCaseId(layoutCase.id);
  const caseHeadingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={styles.case}
      data-meadowlands-farm-case={layoutCase.id}
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

export function MeadowlandsFarmPage({ locale }: MeadowlandsFarmPageProperties) {
  const copy = getMeadowlandsFarmPageCopy(locale);
  requireTenMeadowlandsFarmCases(copy.cases);
  requireTwoMeadowlandsWhatIsParagraphs(copy.whatIsParagraphs);
  requireMeadowlandsImageDimensions(copy.cases);

  const firstLayoutCase = copy.cases[0];
  if (firstLayoutCase === undefined) {
    throw new Error(
      "Meadowlands Farm page is missing its first case after the ten-case check.",
    );
  }

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={styles.page}
      data-meadowlands-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section
        aria-labelledby="meadowlands-farm-page-title"
        className={styles.hero}
      >
        <div className={styles.heroCopy}>
          <h1
            id="meadowlands-farm-page-title"
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
            <a className={styles.primaryAction} href="#meadowlands-farm-layouts">
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
        aria-labelledby="meadowlands-farm-what-is-heading"
        className={styles.whatIs}
        id="meadowlands-farm-what-is"
      >
        <h2 id="meadowlands-farm-what-is-heading">{copy.whatIsHeading}</h2>
        <div className={styles.whatIsCopy}>
          {copy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="meadowlands-farm-layouts-heading"
        className={styles.cases}
        id="meadowlands-farm-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="meadowlands-farm-layouts-heading">{copy.casesHeading}</h2>
          <p className={styles.casesDescription}>{copy.casesDescription}</p>
        </div>
        <div>
          {copy.cases.map((layoutCase) =>
            renderMeadowlandsFarmCase(layoutCase, copy),
          )}
        </div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: copy.openPlannerLabel }}
        eyebrow={copy.howToEyebrow}
        headingId="meadowlands-farm-how-to-heading"
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
        aria-labelledby="meadowlands-farm-cta-heading"
        className={styles.ctaSection}
        id="meadowlands-farm-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="meadowlands-farm-cta-heading">{copy.ctaHeading}</h2>
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
