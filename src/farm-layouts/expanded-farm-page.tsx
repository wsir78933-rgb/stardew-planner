import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getExpandedFarmPageCopy,
  getFeaturedExpandedFarmCase,
  type ExpandedFarmCase,
  type ExpandedFarmPageCopy,
} from "./expanded-farm-content";
import styles from "./beach-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const expectedExpandedFarmCaseCount = 7;

type ExpandedFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireSevenExpandedFarmCases(cases: readonly ExpandedFarmCase[]): void {
  if (cases.length !== expectedExpandedFarmCaseCount) {
    throw new Error(
      `Expanded Farm page requires exactly ${expectedExpandedFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }
}

function requireTwoWhatIsParagraphs(paragraphs: readonly string[]): void {
  if (paragraphs.length !== 2) {
    throw new Error(
      `Expanded Farm page requires exactly 2 What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }
}

function requireFeaturedExpandedFarmCaseVisible(
  featuredCase: ExpandedFarmCase,
  cases: readonly ExpandedFarmCase[],
): void {
  if (!cases.some((layoutCase) => layoutCase.id === featuredCase.id)) {
    throw new Error(
      `Expanded Farm featured case must appear in the visible case list. Received featured case ID ${JSON.stringify(featuredCase.id)} and case IDs ${JSON.stringify(cases.map((layoutCase) => layoutCase.id))}.`,
    );
  }
}

function getExpandedFarmCaseAnchorId(caseId: string): string {
  if (typeof caseId !== "string" || !/^[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Expanded Farm case ID must contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }

  return caseId;
}

function renderExpandedFarmCase(
  layoutCase: ExpandedFarmCase,
  pageCopy: ExpandedFarmPageCopy,
) {
  const anchorId = getExpandedFarmCaseAnchorId(layoutCase.id);

  return (
    <article
      aria-labelledby={`${anchorId}-title`}
      className={styles.case}
      data-expanded-farm-case={layoutCase.id}
      id={anchorId}
      key={layoutCase.id}
    >
      <figure className={styles.caseVisual}>
        <LayoutImageViewer
          closeLabel={pageCopy.closeImageLabel}
          enlargeLabel={pageCopy.enlargeImageLabel}
          imageAlt={layoutCase.imageAlt}
          imageHeight={layoutCase.imageHeight}
          imageOriginalSrc={layoutCase.imageOriginalSrc}
          imageSrc={layoutCase.imageSrc}
          imageWidth={layoutCase.imageWidth}
        />
      </figure>

      <div className={styles.caseDetails}>
        <div className={styles.caseHeading}>
          <h3 id={`${anchorId}-title`}>{layoutCase.title}</h3>
          <p>{layoutCase.summary}</p>
        </div>

        <a className={styles.downloadLink} download href={layoutCase.projectHref}>
          <Download aria-hidden="true" size={17} strokeWidth={1.8} />
          {pageCopy.downloadProjectLabel}
        </a>
      </div>
    </article>
  );
}

export function ExpandedFarmPage({ locale }: ExpandedFarmPageProperties) {
  const pageCopy = getExpandedFarmPageCopy(locale);
  const featuredCase = getFeaturedExpandedFarmCase(locale);
  requireSevenExpandedFarmCases(pageCopy.cases);
  requireTwoWhatIsParagraphs(pageCopy.whatIsParagraphs);
  requireFeaturedExpandedFarmCaseVisible(featuredCase, pageCopy.cases);

  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={styles.page}
      data-expanded-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      <section aria-labelledby="expanded-farm-page-title" className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 id="expanded-farm-page-title">{pageCopy.title}</h1>
          <p className={styles.intro}>{pageCopy.intro}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#expanded-farm-layouts">
              {pageCopy.browseLabel}
              <ArrowDown aria-hidden="true" size={17} strokeWidth={1.9} />
            </a>
            <a className={styles.secondaryAction} href={plannerHref}>
              {pageCopy.openPlannerLabel}
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.9} />
            </a>
          </div>
        </div>

        <figure className={styles.heroVisual}>
          <LayoutImageViewer
            closeLabel={pageCopy.closeImageLabel}
            enlargeLabel={pageCopy.enlargeImageLabel}
            imageAlt={featuredCase.imageAlt}
            imageHeight={featuredCase.imageHeight}
            imageOriginalSrc={featuredCase.imageOriginalSrc}
            imageSrc={featuredCase.imageSrc}
            imageWidth={featuredCase.imageWidth}
            isPriorityImage
          />
          <figcaption className={styles.heroCaption}>
            <span>{pageCopy.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{featuredCase.title}</span>
          </figcaption>
        </figure>
      </section>

      <section
        aria-labelledby="expanded-farm-what-is-heading"
        className={styles.whatIs}
        id="expanded-farm-what-is"
      >
        <h2 id="expanded-farm-what-is-heading">{pageCopy.whatIsHeading}</h2>
        <div className={styles.whatIsCopy}>
          {pageCopy.whatIsParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="expanded-farm-layouts-heading"
        className={styles.cases}
        id="expanded-farm-layouts"
      >
        <div className={styles.sectionHeading}>
          <h2 id="expanded-farm-layouts-heading">{pageCopy.casesHeading}</h2>
          <p className={styles.casesDescription}>{pageCopy.casesDescription}</p>
        </div>
        <div>
          {pageCopy.cases.map((layoutCase) =>
            renderExpandedFarmCase(layoutCase, pageCopy),
          )}
        </div>
      </section>

      <HowItWorks09
        cta={{ href: plannerHref, label: pageCopy.openPlannerLabel }}
        eyebrow={pageCopy.howToEyebrow}
        headingId="expanded-farm-how-to-heading"
        steps={pageCopy.howToSteps}
        title={pageCopy.howToHeading}
      />

      <section aria-label={pageCopy.faqHeading} className={styles.faqSection}>
        <Faq1
          className={styles.faqComponent}
          description={pageCopy.faqDescription}
          eyebrow={pageCopy.faqEyebrow}
          items={pageCopy.faqs}
          title={pageCopy.faqHeading}
        />
      </section>

      <section
        aria-labelledby="expanded-farm-cta-heading"
        className={styles.ctaSection}
        id="expanded-farm-cta"
      >
        <div className={styles.ctaCopy}>
          <h2 id="expanded-farm-cta-heading">{pageCopy.ctaHeading}</h2>
          <p>{pageCopy.ctaDescription}</p>
          <a className={styles.primaryAction} href={plannerHref}>
            {pageCopy.ctaButtonLabel}
            <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
          </a>
        </div>
      </section>
    </article>
  );
}
