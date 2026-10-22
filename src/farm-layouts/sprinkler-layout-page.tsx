import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { getLocalizedPublicPath } from "@/src/i18n/public-route-registry";
import type { PublicLocale } from "@/src/i18n/public-locale";
import { Faq1 } from "../components/faq-1";
import { HowItWorks09 } from "../components/how-it-works-09";
import {
  getSprinklerLayoutPageCopy,
  type SprinklerLayoutCase,
  type SprinklerLayoutCover,
  type SprinklerLayoutPageCopy,
} from "./sprinkler-layout-content";
import styles from "./beach-farm-page.module.css";
import sprinklerStyles from "./sprinkler-layout-page.module.css";
import { LayoutImageViewer } from "./layout-image-viewer";

const sprinklerLayoutCaseCount = 6;
const sprinklerLayoutFaqCount = 5;
const sprinklerLayoutHowToStepCount = 3;
const sprinklerLayoutWhatIsParagraphCount = 2;
const sprinklerLayoutPreviewWidth = 1600;
const sprinklerLayoutPreviewHeight = 1300;
const sprinklerLayoutSourceWidth = 2560;
const sprinklerLayoutSourceHeight = 2080;
const sprinklerLayoutImageDirectory = "/farm-layouts/sprinkler/images";
const sprinklerLayoutProjectDirectory = "/farm-layouts/sprinkler/projects";
const sprinklerLayoutCoverStem = "07-iridium-farm-patches-paths-scarecrows";
const sprinklerLayoutCaseIds = [
  "01-basic-knights-move-staggered",
  "02-quality-3x3-grid",
  "03-iridium-5x5-grid",
  "04-scarecrow-radius-quality",
  "05-scarecrow-radius-iridium",
  "06-greenhouse-6-iridium-116",
] as const;

type SprinklerLayoutPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function receivedSprinklerLayoutValue(value: unknown): string {
  const serialized = JSON.stringify(value);
  if (typeof serialized === "string") {
    return serialized;
  }

  return String(value);
}

function requireSprinklerPreviewScale(): void {
  const scaledHeight =
    (sprinklerLayoutPreviewWidth * sprinklerLayoutSourceHeight) /
    sprinklerLayoutSourceWidth;

  if (scaledHeight !== sprinklerLayoutPreviewHeight) {
    throw new Error(
      `Sprinkler Layout preview ${sprinklerLayoutPreviewWidth}x${sprinklerLayoutPreviewHeight} does not preserve source ${sprinklerLayoutSourceWidth}x${sprinklerLayoutSourceHeight}. Computed height: ${scaledHeight}.`,
    );
  }
}

function requireSprinklerLayoutCaseId(caseId: string): void {
  if (typeof caseId !== "string" || !/^\d{2}-[a-z0-9-]+$/.test(caseId)) {
    throw new Error(
      `Sprinkler Layout case ID must start with two digits and contain only lowercase letters, numbers, and hyphens. Received: ${receivedSprinklerLayoutValue(caseId)}.`,
    );
  }

  if (caseId === sprinklerLayoutCoverStem) {
    throw new Error(
      `Sprinkler Layout cover ${sprinklerLayoutCoverStem} must not be a case. Received: ${JSON.stringify(caseId)}.`,
    );
  }
}

function requireSprinklerPreviewDimensions(
  imageWidth: number,
  imageHeight: number,
  imageLabel: string,
): void {
  if (
    !Number.isInteger(imageWidth) ||
    !Number.isInteger(imageHeight) ||
    imageWidth !== sprinklerLayoutPreviewWidth ||
    imageHeight !== sprinklerLayoutPreviewHeight
  ) {
    throw new Error(
      `Sprinkler Layout ${imageLabel} must use a ${sprinklerLayoutPreviewWidth}x${sprinklerLayoutPreviewHeight} preview scaled from ${sprinklerLayoutSourceWidth}x${sprinklerLayoutSourceHeight} without upscaling. Received: ${JSON.stringify({ height: imageHeight, width: imageWidth })}.`,
    );
  }
}

function expectedSprinklerLayoutPreviewSrc(stem: string): string {
  return `${sprinklerLayoutImageDirectory}/${stem}.webp`;
}

function expectedSprinklerLayoutFullSrc(stem: string): string {
  return `${sprinklerLayoutImageDirectory}/${stem}-full.webp`;
}

function expectedSprinklerLayoutProjectHref(stem: string): string {
  return `${sprinklerLayoutProjectDirectory}/${stem}.json`;
}

function requireSprinklerLayoutCaseAssets(layoutCase: SprinklerLayoutCase): void {
  requireSprinklerLayoutCaseId(layoutCase.id);
  requireSprinklerPreviewDimensions(
    layoutCase.imageWidth,
    layoutCase.imageHeight,
    `case ${JSON.stringify(layoutCase.id)}`,
  );

  const expectedPreviewSrc = expectedSprinklerLayoutPreviewSrc(layoutCase.id);
  const expectedFullSrc = expectedSprinklerLayoutFullSrc(layoutCase.id);
  const expectedProjectHref = expectedSprinklerLayoutProjectHref(layoutCase.id);

  if (layoutCase.imageSrc !== expectedPreviewSrc) {
    throw new Error(
      `Sprinkler Layout case ${JSON.stringify(layoutCase.id)} preview must be ${JSON.stringify(expectedPreviewSrc)}. Received: ${receivedSprinklerLayoutValue(layoutCase.imageSrc)}.`,
    );
  }

  if (layoutCase.imageOriginalSrc !== expectedFullSrc) {
    throw new Error(
      `Sprinkler Layout case ${JSON.stringify(layoutCase.id)} full image must be ${JSON.stringify(expectedFullSrc)}. Received: ${receivedSprinklerLayoutValue(layoutCase.imageOriginalSrc)}.`,
    );
  }

  if (layoutCase.projectHref !== expectedProjectHref) {
    throw new Error(
      `Sprinkler Layout case ${JSON.stringify(layoutCase.id)} project must be ${JSON.stringify(expectedProjectHref)}. Received: ${receivedSprinklerLayoutValue(layoutCase.projectHref)}.`,
    );
  }
}

function requireSprinklerLayoutCaseOrder(
  cases: readonly SprinklerLayoutCase[],
): void {
  if (!Array.isArray(cases) || cases.length !== sprinklerLayoutCaseCount) {
    throw new Error(
      `Sprinkler Layout page requires exactly ${sprinklerLayoutCaseCount} cases. Received: ${receivedSprinklerLayoutValue(cases)}.`,
    );
  }

  const receivedIds = cases.map((layoutCase) => {
    if (layoutCase === null || typeof layoutCase !== "object") {
      throw new Error(
        `Sprinkler Layout case must be an object. Received: ${receivedSprinklerLayoutValue(layoutCase)}.`,
      );
    }

    return layoutCase.id;
  });
  if (receivedIds.join(",") !== sprinklerLayoutCaseIds.join(",")) {
    throw new Error(
      `Sprinkler Layout cases must be ordered ${sprinklerLayoutCaseIds.join(", ")}. Received: ${JSON.stringify(receivedIds)}.`,
    );
  }
}

function requireSprinklerLayoutWhatIsParagraphs(
  paragraphs: readonly string[],
): void {
  if (
    !Array.isArray(paragraphs) ||
    paragraphs.length !== sprinklerLayoutWhatIsParagraphCount
  ) {
    throw new Error(
      `Sprinkler Layout page requires exactly ${sprinklerLayoutWhatIsParagraphCount} What is paragraphs. Received: ${receivedSprinklerLayoutValue(paragraphs)}.`,
    );
  }

  for (const paragraph of paragraphs) {
    if (typeof paragraph !== "string" || paragraph.trim().length === 0) {
      throw new Error(
        `Sprinkler Layout What is paragraphs must be non-empty. Received: ${receivedSprinklerLayoutValue(paragraphs)}.`,
      );
    }
  }
}

function requireSprinklerCoverStaysOutOfCases(
  cover: SprinklerLayoutCover,
  cases: readonly SprinklerLayoutCase[],
): void {
  if (cover === null || typeof cover !== "object" || Array.isArray(cover)) {
    throw new Error(
      `Sprinkler Layout cover must be an object. Received: ${receivedSprinklerLayoutValue(cover)}.`,
    );
  }

  requireSprinklerPreviewDimensions(cover.imageWidth, cover.imageHeight, "cover");

  const expectedPreviewSrc = expectedSprinklerLayoutPreviewSrc(
    sprinklerLayoutCoverStem,
  );
  const expectedFullSrc = expectedSprinklerLayoutFullSrc(sprinklerLayoutCoverStem);

  if (cover.imageSrc !== expectedPreviewSrc) {
    throw new Error(
      `Sprinkler Layout cover preview must be ${JSON.stringify(expectedPreviewSrc)}. Received: ${receivedSprinklerLayoutValue(cover.imageSrc)}.`,
    );
  }

  if (cover.imageOriginalSrc !== expectedFullSrc) {
    throw new Error(
      `Sprinkler Layout cover full image must be ${JSON.stringify(expectedFullSrc)}. Received: ${receivedSprinklerLayoutValue(cover.imageOriginalSrc)}.`,
    );
  }

  const caseIds = cases.map((layoutCase) => layoutCase.id);
  if (caseIds.includes(sprinklerLayoutCoverStem)) {
    throw new Error(
      `Sprinkler Layout cover ${sprinklerLayoutCoverStem} must stay out of the case list. Received: ${JSON.stringify(caseIds)}.`,
    );
  }

  for (const layoutCase of cases) {
    if (
      layoutCase.imageSrc === cover.imageSrc ||
      layoutCase.imageOriginalSrc === cover.imageOriginalSrc ||
      layoutCase.projectHref.includes(sprinklerLayoutCoverStem)
    ) {
      throw new Error(
        `Sprinkler Layout case ${JSON.stringify(layoutCase.id)} must not reuse cover ${sprinklerLayoutCoverStem}. Received: ${JSON.stringify({ imageOriginalSrc: layoutCase.imageOriginalSrc, imageSrc: layoutCase.imageSrc, projectHref: layoutCase.projectHref })}.`,
      );
    }
  }
}

function requireSprinklerLayoutFaqs(
  faqs: SprinklerLayoutPageCopy["faqs"],
): void {
  if (!Array.isArray(faqs) || faqs.length !== sprinklerLayoutFaqCount) {
    throw new Error(
      `Sprinkler Layout page requires exactly ${sprinklerLayoutFaqCount} FAQ items. Received: ${receivedSprinklerLayoutValue(faqs)}.`,
    );
  }

  for (const faq of faqs) {
    if (
      faq === null ||
      typeof faq !== "object" ||
      typeof faq.question !== "string" ||
      typeof faq.answer !== "string" ||
      faq.question.trim().length === 0 ||
      faq.answer.trim().length === 0
    ) {
      throw new Error(
        `Sprinkler Layout FAQ items must be non-empty. Received: ${receivedSprinklerLayoutValue(faq)}.`,
      );
    }
  }
}

function requireSprinklerLayoutHowToSteps(
  steps: SprinklerLayoutPageCopy["howToSteps"],
): void {
  if (!Array.isArray(steps) || steps.length !== sprinklerLayoutHowToStepCount) {
    throw new Error(
      `Sprinkler Layout page requires exactly ${sprinklerLayoutHowToStepCount} How to use steps. Received: ${receivedSprinklerLayoutValue(steps)}.`,
    );
  }

  for (const step of steps) {
    if (
      step === null ||
      typeof step !== "object" ||
      typeof step.number !== "string" ||
      typeof step.title !== "string" ||
      typeof step.body !== "string" ||
      step.number.trim().length === 0 ||
      step.title.trim().length === 0 ||
      step.body.trim().length === 0
    ) {
      throw new Error(
        `Sprinkler Layout How to use steps must be non-empty. Received: ${receivedSprinklerLayoutValue(step)}.`,
      );
    }
  }
}

function requireSprinklerLayoutPageCopy(copy: SprinklerLayoutPageCopy): void {
  if (copy === null || typeof copy !== "object" || Array.isArray(copy)) {
    throw new Error(
      `Sprinkler Layout page copy must be an object. Received: ${receivedSprinklerLayoutValue(copy)}.`,
    );
  }

  requireSprinklerPreviewScale();
  requireSprinklerLayoutWhatIsParagraphs(copy.whatIsParagraphs);
  requireSprinklerLayoutCaseOrder(copy.cases);
  requireSprinklerCoverStaysOutOfCases(copy.cover, copy.cases);
  requireSprinklerLayoutFaqs(copy.faqs);
  requireSprinklerLayoutHowToSteps(copy.howToSteps);

  for (const layoutCase of copy.cases) {
    requireSprinklerLayoutCaseAssets(layoutCase);
  }
}

function renderSprinklerLayoutCase(
  layoutCase: SprinklerLayoutCase,
  copy: SprinklerLayoutPageCopy,
) {
  const caseHeadingId = `${layoutCase.id}-title`;

  return (
    <article
      aria-labelledby={caseHeadingId}
      className={`${styles.case} ${sprinklerStyles.sprinklerCase}`}
      data-sprinkler-layout-case={layoutCase.id}
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

function renderSprinklerLayoutHero(copy: SprinklerLayoutPageCopy, plannerHref: string) {
  return (
    <section
      aria-labelledby="sprinkler-layout-page-title"
      className={`${styles.hero} ${sprinklerStyles.sprinklerHero}`}
    >
      <div className={`${styles.heroCopy} ${sprinklerStyles.sprinklerHeroCopy}`}>
        <h1 id="sprinkler-layout-page-title">{copy.title}</h1>
        <p className={styles.intro}>{copy.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryAction} href="#sprinkler-layout-layouts">
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
        data-sprinkler-layout-cover="true"
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

function renderSprinklerLayoutWhatIs(copy: SprinklerLayoutPageCopy) {
  return (
    <section
      aria-labelledby="sprinkler-layout-what-is-heading"
      className={styles.whatIs}
      id="sprinkler-layout-what-is"
    >
      <h2 id="sprinkler-layout-what-is-heading">{copy.whatIsHeading}</h2>
      <div className={styles.whatIsCopy}>
        {copy.whatIsParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function renderSprinklerLayoutCases(copy: SprinklerLayoutPageCopy) {
  return (
    <section
      aria-labelledby="sprinkler-layout-layouts-heading"
      className={styles.cases}
      id="sprinkler-layout-layouts"
    >
      <div className={styles.sectionHeading}>
        <h2 id="sprinkler-layout-layouts-heading">{copy.casesHeading}</h2>
        <p className={styles.casesDescription}>{copy.casesDescription}</p>
      </div>
      <div>
        {copy.cases.map((layoutCase) =>
          renderSprinklerLayoutCase(layoutCase, copy),
        )}
      </div>
    </section>
  );
}

function renderSprinklerLayoutHowTo(
  copy: SprinklerLayoutPageCopy,
  plannerHref: string,
) {
  return (
    <HowItWorks09
      cta={{ href: plannerHref, label: copy.openPlannerLabel }}
      eyebrow={copy.howToEyebrow}
      headingId="sprinkler-layout-how-to-heading"
      steps={copy.howToSteps}
      title={copy.howToHeading}
    />
  );
}

function renderSprinklerLayoutFaq(copy: SprinklerLayoutPageCopy) {
  return (
    <section
      aria-label={copy.faqHeading}
      className={styles.faqSection}
      id="sprinkler-layout-faq"
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

function renderSprinklerLayoutCta(copy: SprinklerLayoutPageCopy, plannerHref: string) {
  return (
    <section
      aria-labelledby="sprinkler-layout-cta-heading"
      className={styles.ctaSection}
      id="sprinkler-layout-cta"
    >
      <div className={styles.ctaCopy}>
        <h2 id="sprinkler-layout-cta-heading">{copy.ctaHeading}</h2>
        <p>{copy.ctaDescription}</p>
        <a className={styles.primaryAction} href={plannerHref}>
          {copy.ctaButtonLabel}
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
        </a>
      </div>
    </section>
  );
}

export function SprinklerLayoutPage({ locale }: SprinklerLayoutPageProperties) {
  const copy = getSprinklerLayoutPageCopy(locale);
  requireSprinklerLayoutPageCopy(copy);
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  return (
    <article
      className={`${styles.page} ${sprinklerStyles.sprinklerPage}`}
      data-sprinkler-layout-page="true"
      lang={locale === "zh-CN" ? "zh-CN" : "en"}
    >
      {renderSprinklerLayoutHero(copy, plannerHref)}
      {renderSprinklerLayoutWhatIs(copy)}
      {renderSprinklerLayoutCases(copy)}
      {renderSprinklerLayoutHowTo(copy, plannerHref)}
      {renderSprinklerLayoutFaq(copy)}
      {renderSprinklerLayoutCta(copy, plannerHref)}
    </article>
  );
}
