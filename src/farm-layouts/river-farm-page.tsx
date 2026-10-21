import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getRiverFarmPageCopy,
  type RiverFarmCase,
  type RiverFarmCover,
  type RiverFarmPageCopy,
} from "./river-farm-content";
import styles from "./beach-farm-page.module.css";
import riverStyles from "./river-farm-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const riverFarmCaseCount = 7;
const riverFarmPreviewWidth = 1600;
const riverFarmPreviewHeight = 1300;
const riverFarmWhatIsParagraphCount = 2;
const riverFarmStemPrefix = "stardew-valley-river-farm-layout-";
const riverFarmImageDirectory = "/farm-layouts/river/images";
const riverFarmProjectDirectory = "/farm-layouts/river/projects";
const riverFarmCaseNumberOrder = ["01", "02", "03", "04", "05", "06", "07"] as const;

type RiverFarmPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireRiverFarmCaseId(caseId: string): void {
  if (!/^\d{2}-[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `River Farm case ID must start with two digits and contain only lowercase letters, numbers, and hyphens. Received: ${JSON.stringify(caseId)}.`,
    );
  }
}

function requireRiverPreviewDimensions(
  imageWidth: number,
  imageHeight: number,
  imageLabel: string,
): void {
  if (
    imageWidth !== riverFarmPreviewWidth ||
    imageHeight !== riverFarmPreviewHeight
  ) {
    throw new Error(
      `River Farm ${imageLabel} must use a ${riverFarmPreviewWidth}x${riverFarmPreviewHeight} preview. Received: ${JSON.stringify({ height: imageHeight, width: imageWidth })}.`,
    );
  }
}

function expectedRiverFarmPreviewSrc(caseId: string): string {
  return `${riverFarmImageDirectory}/${riverFarmStemPrefix}${caseId}.webp`;
}

function expectedRiverFarmFullSrc(caseId: string): string {
  return `${riverFarmImageDirectory}/${riverFarmStemPrefix}${caseId}-full.webp`;
}

function expectedRiverFarmProjectHref(caseId: string): string {
  return `${riverFarmProjectDirectory}/${riverFarmStemPrefix}${caseId}.json`;
}

function requireRiverFarmCaseAssets(layoutCase: RiverFarmCase): void {
  requireRiverFarmCaseId(layoutCase.id);
  requireRiverPreviewDimensions(
    layoutCase.imageWidth,
    layoutCase.imageHeight,
    `case ${JSON.stringify(layoutCase.id)}`,
  );

  const expectedPreviewSrc = expectedRiverFarmPreviewSrc(layoutCase.id);
  const expectedFullSrc = expectedRiverFarmFullSrc(layoutCase.id);
  const expectedProjectHref = expectedRiverFarmProjectHref(layoutCase.id);

  if (layoutCase.imageSrc !== expectedPreviewSrc) {
    throw new Error(
      `River Farm case ${JSON.stringify(layoutCase.id)} preview must be ${JSON.stringify(expectedPreviewSrc)}. Received: ${JSON.stringify(layoutCase.imageSrc)}.`,
    );
  }

  if (layoutCase.imageOriginalSrc !== expectedFullSrc) {
    throw new Error(
      `River Farm case ${JSON.stringify(layoutCase.id)} full image must be ${JSON.stringify(expectedFullSrc)}. Received: ${JSON.stringify(layoutCase.imageOriginalSrc)}.`,
    );
  }

  if (layoutCase.projectHref !== expectedProjectHref) {
    throw new Error(
      `River Farm case ${JSON.stringify(layoutCase.id)} project must be ${JSON.stringify(expectedProjectHref)}. Received: ${JSON.stringify(layoutCase.projectHref)}.`,
    );
  }
}

function requireRiverFarmCaseOrder(cases: readonly RiverFarmCase[]): void {
  if (cases.length !== riverFarmCaseCount) {
    throw new Error(
      `River Farm page requires exactly ${riverFarmCaseCount} cases. Received: ${cases.length}.`,
    );
  }

  const receivedNumbers = cases.map((layoutCase) => layoutCase.id.slice(0, 2));
  if (receivedNumbers.join(",") !== riverFarmCaseNumberOrder.join(",")) {
    throw new Error(
      `River Farm cases must be ordered ${riverFarmCaseNumberOrder.join(", ")}. Received: ${JSON.stringify(receivedNumbers)}.`,
    );
  }
}

function requireRiverFarmWhatIsParagraphs(paragraphs: readonly string[]): void {
  if (paragraphs.length !== riverFarmWhatIsParagraphCount) {
    throw new Error(
      `River Farm page requires exactly ${riverFarmWhatIsParagraphCount} What is paragraphs. Received: ${JSON.stringify(paragraphs)}.`,
    );
  }

  for (const paragraph of paragraphs) {
    if (paragraph.trim().length === 0) {
      throw new Error(
        `River Farm What is paragraphs must be non-empty. Received: ${JSON.stringify(paragraphs)}.`,
      );
    }
  }
}

function requireRiverCoverReusesCase01(
  cover: RiverFarmCover,
  cases: readonly RiverFarmCase[],
): void {
  const case01 = cases[0];
  if (case01 === undefined || !case01.id.startsWith("01-")) {
    throw new Error(
      `River Farm cover reuses case 01, which must be the first case. Received: ${JSON.stringify(case01?.id)}.`,
    );
  }

  requireRiverPreviewDimensions(cover.imageWidth, cover.imageHeight, "cover");

  if (
    cover.imageSrc !== case01.imageSrc ||
    cover.imageOriginalSrc !== case01.imageOriginalSrc
  ) {
    throw new Error(
      `River Farm cover must reuse case ${JSON.stringify(case01.id)} images. Received cover ${JSON.stringify({ imageOriginalSrc: cover.imageOriginalSrc, imageSrc: cover.imageSrc })}.`,
    );
  }
}

function requireRiverFarmPageCopy(copy: RiverFarmPageCopy): void {
  requireRiverFarmWhatIsParagraphs(copy.whatIsParagraphs);
  requireRiverFarmCaseOrder(copy.cases);
  requireRiverCoverReusesCase01(copy.cover, copy.cases);

  for (const layoutCase of copy.cases) {
    requireRiverFarmCaseAssets(layoutCase);
  }
}

function renderRiverFarmCase(
  layoutCase: RiverFarmCase,
  copy: RiverFarmPageCopy,
) {
  const caseHeadingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={`${styles.case} ${riverStyles.riverCase}`}
      data-river-farm-case={layoutCase.id}
      id={layoutCase.id}
      key={layoutCase.id}
    >
      <figure className={`${styles.caseVisual} ${riverStyles.riverCaseVisual}`}>
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

      <div className={`${styles.caseDetails} ${riverStyles.riverCaseDetails}`}>
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

function renderRiverFarmHero(copy: RiverFarmPageCopy, plannerHref: string) {
  return (
    <section
      aria-labelledby="river-farm-page-title"
      className={`${styles.hero} ${riverStyles.riverHero}`}
    >
      <div className={`${styles.heroCopy} ${riverStyles.riverHeroCopy}`}>
        <h1 id="river-farm-page-title">{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#river-farm-layouts">
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
        className={`${styles.heroVisual} ${riverStyles.riverHeroVisual}`}
        data-river-farm-cover="true"
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
        <figcaption className={`${styles.heroCaption} ${riverStyles.riverHeroCaption}`}>
          <span>{copy.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{copy.cover.caption}</span>
        </figcaption>
      </figure>
    </section>
  );
}

function renderRiverFarmWhatIs(copy: RiverFarmPageCopy) {
  return (
    <section
      aria-labelledby="river-farm-what-is-heading"
      className={styles.whatIs}
      id="river-farm-what-is"
    >
      <h2 id="river-farm-what-is-heading">{copy.whatIsHeading}</h2>
      <div className={styles.whatIsCopy}>
        {copy.whatIsParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function renderRiverFarmCases(copy: RiverFarmPageCopy) {
  return (
    <section
      aria-labelledby="river-farm-layouts-heading"
      className={styles.cases}
      id="river-farm-layouts"
    >
      <div className={styles.sectionHeading}>
        <h2 id="river-farm-layouts-heading">{copy.casesHeading}</h2>
        <p className={styles.casesDescription}>{copy.casesDescription}</p>
      </div>
      <div>
        {copy.cases.map((layoutCase) => renderRiverFarmCase(layoutCase, copy))}
      </div>
    </section>
  );
}

function renderRiverFarmHowTo(copy: RiverFarmPageCopy, plannerHref: string) {
  return (
    <HowItWorks09
      cta={{ href: plannerHref, label: copy.openPlannerLabel }}
      eyebrow={copy.howToEyebrow}
      headingId="river-farm-how-to-heading"
      steps={copy.howToSteps}
      title={copy.howToHeading}
    />
  );
}

function renderRiverFarmFaq(copy: RiverFarmPageCopy) {
  return (
    <section
      aria-label={copy.faqHeading}
      className={styles.faqSection}
      id="river-farm-faq"
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

function renderRiverFarmCta(copy: RiverFarmPageCopy, plannerHref: string) {
  return (
    <section
      aria-labelledby="river-farm-cta-heading"
      className={styles.ctaSection}
      id="river-farm-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="river-farm-cta-heading">{copy.ctaHeading}</h2>
        <p>{copy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {copy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function RiverFarmPage({ locale }: RiverFarmPageProperties) {
  const copy = getRiverFarmPageCopy(locale);
  requireRiverFarmPageCopy(copy);
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${riverStyles.riverPage}`}
      data-river-farm-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderRiverFarmHero(copy, plannerHref)}
      {renderRiverFarmWhatIs(copy)}
      {renderRiverFarmCases(copy)}
      {renderRiverFarmHowTo(copy, plannerHref)}
      {renderRiverFarmFaq(copy)}
      {renderRiverFarmCta(copy, plannerHref)}
    </article>
  );
}
