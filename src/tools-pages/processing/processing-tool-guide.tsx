"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { Faq1 } from "../../components/faq-1";
import {
  getProcessingToolGuideCopy,
  type ProcessingToolGuideCopy,
} from "../../i18n/processing-tool-guide-copy";
import type { PublicLocale } from "../../i18n/public-locale";
import { HowItWorks09 } from "../how-it-works-09";
import {
  getProcessingToolGuideMedia,
  type ProcessingToolGuideMediaItem,
} from "./processing-tool-media";
import {
  getProcessingToolHref,
  type ProcessingToolId,
} from "./processing-tool-definition";
import styles from "./processing-tool-guide.module.css";

const OVERVIEW_PARAGRAPH_COUNT = 3;
const FEATURE_COUNT = 5;
const FEATURE_INTRO_ITEM_COUNT = 4;
const HOW_STEP_COUNT = 3;
const WHY_ITEM_COUNT = 5;
const COMPARISON_PRODUCT_COUNT = 3;
const COMPARISON_ROW_COUNT = 6;
const FAQ_ITEM_COUNT = 7;
const FEATURE_MEDIA_RATIO = 4 / 3;

type ProcessingGuideFeature = ProcessingToolGuideCopy["features"]["items"][number];
type ProcessingGuideComparison = ProcessingToolGuideCopy["comparison"];

export type ProcessingToolGuideProperties = Readonly<{
  currentTool: ProcessingToolId;
  locale: PublicLocale;
}>;

function receivedGuideValue(value: unknown): string {
  return JSON.stringify(value) ?? String(value);
}

function requireGuideText(value: unknown, fieldPath: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `ProcessingToolGuide ${fieldPath} must be a non-empty string, received ${receivedGuideValue(value)}.`,
    );
  }
}

function requireGuideCount(actualCount: number, expectedCount: number, fieldPath: string): void {
  if (actualCount !== expectedCount) {
    throw new Error(
      `ProcessingToolGuide ${fieldPath} must contain ${expectedCount} items, received ${actualCount}.`,
    );
  }
}

function assertMediaItem(
  mediaItem: ProcessingToolGuideMediaItem,
  featureIndex: number,
): void {
  const expectedSourceId = `features-${featureIndex + 1}`;
  if (mediaItem.sourceId !== expectedSourceId) {
    throw new Error(
      `ProcessingToolGuide media[${featureIndex}].sourceId must be ${JSON.stringify(expectedSourceId)}, received ${JSON.stringify(mediaItem.sourceId)}.`,
    );
  }

  requireGuideText(mediaItem.src, `media[${featureIndex}].src`);
  if (
    !Number.isInteger(mediaItem.width) ||
    !Number.isInteger(mediaItem.height) ||
    mediaItem.width <= 0 ||
    mediaItem.height <= 0 ||
    mediaItem.width / mediaItem.height !== FEATURE_MEDIA_RATIO
  ) {
    throw new Error(
      `ProcessingToolGuide media[${featureIndex}] must use positive integer 4:3 dimensions, received width=${JSON.stringify(mediaItem.width)} height=${JSON.stringify(mediaItem.height)}.`,
    );
  }
}

function assertComparisonRows(comparison: ProcessingGuideComparison): void {
  comparison.rows.forEach((row, rowIndex) => {
    if (row.values.length !== comparison.products.length) {
      throw new Error(
        `ProcessingToolGuide comparison.rows[${rowIndex}] ${JSON.stringify(row.label)} has ${row.values.length} values for ${comparison.products.length} products.`,
      );
    }
  });
}

function assertGuideContent(
  copy: ProcessingToolGuideCopy,
  media: readonly ProcessingToolGuideMediaItem[],
): void {
  requireGuideText(copy.toolName, "toolName");
  requireGuideText(copy.overview.eyebrow, "overview.eyebrow");
  requireGuideText(copy.overview.title, "overview.title");
  requireGuideText(copy.overview.aside, "overview.aside");
  requireGuideCount(copy.overview.paragraphs.length, OVERVIEW_PARAGRAPH_COUNT, "overview.paragraphs");
  copy.overview.paragraphs.forEach((paragraph, paragraphIndex) => {
    requireGuideText(paragraph, `overview.paragraphs[${paragraphIndex}]`);
  });

  requireGuideCount(copy.features.items.length, FEATURE_COUNT, "features.items");
  requireGuideCount(media.length, FEATURE_COUNT, "media");
  copy.features.items.forEach((feature, featureIndex) => {
    requireGuideText(feature.number, `features.items[${featureIndex}].number`);
    requireGuideText(feature.eyebrow, `features.items[${featureIndex}].eyebrow`);
    requireGuideText(feature.title, `features.items[${featureIndex}].title`);
    requireGuideText(feature.body, `features.items[${featureIndex}].body`);
    requireGuideText(feature.caseHint, `features.items[${featureIndex}].caseHint`);
    requireGuideText(feature.caption, `features.items[${featureIndex}].caption`);
    assertMediaItem(media[featureIndex], featureIndex);
  });

  requireGuideText(copy.featureIntro.eyebrow, "featureIntro.eyebrow");
  requireGuideText(copy.featureIntro.title, "featureIntro.title");
  requireGuideText(copy.featureIntro.description, "featureIntro.description");
  requireGuideCount(copy.featureIntro.items.length, FEATURE_INTRO_ITEM_COUNT, "featureIntro.items");
  copy.featureIntro.items.forEach((item, itemIndex) => {
    requireGuideText(item.title, `featureIntro.items[${itemIndex}].title`);
    requireGuideText(item.body, `featureIntro.items[${itemIndex}].body`);
  });

  requireGuideText(copy.howToUse.eyebrow, "howToUse.eyebrow");
  requireGuideText(copy.howToUse.title, "howToUse.title");
  requireGuideText(copy.howToUse.actionLabel, "howToUse.actionLabel");
  requireGuideCount(copy.howToUse.steps.length, HOW_STEP_COUNT, "howToUse.steps");
  copy.howToUse.steps.forEach((step, stepIndex) => {
    requireGuideText(step.number, `howToUse.steps[${stepIndex}].number`);
    requireGuideText(step.title, `howToUse.steps[${stepIndex}].title`);
    requireGuideText(step.body, `howToUse.steps[${stepIndex}].body`);
  });

  requireGuideText(copy.whyChoose.eyebrow, "whyChoose.eyebrow");
  requireGuideText(copy.whyChoose.title, "whyChoose.title");
  requireGuideText(copy.whyChoose.description, "whyChoose.description");
  requireGuideCount(copy.whyChoose.items.length, WHY_ITEM_COUNT, "whyChoose.items");
  copy.whyChoose.items.forEach((item, itemIndex) => {
    requireGuideText(item.number, `whyChoose.items[${itemIndex}].number`);
    requireGuideText(item.title, `whyChoose.items[${itemIndex}].title`);
    requireGuideText(item.body, `whyChoose.items[${itemIndex}].body`);
  });

  requireGuideText(copy.comparison.eyebrow, "comparison.eyebrow");
  requireGuideText(copy.comparison.title, "comparison.title");
  requireGuideText(copy.comparison.description, "comparison.description");
  requireGuideText(copy.comparison.cornerLabel, "comparison.cornerLabel");
  requireGuideCount(copy.comparison.products.length, COMPARISON_PRODUCT_COUNT, "comparison.products");
  requireGuideCount(copy.comparison.rows.length, COMPARISON_ROW_COUNT, "comparison.rows");
  copy.comparison.products.forEach((product, productIndex) => {
    requireGuideText(product.name, `comparison.products[${productIndex}].name`);
    requireGuideText(product.href, `comparison.products[${productIndex}].href`);
  });
  copy.comparison.rows.forEach((row, rowIndex) => {
    requireGuideText(row.label, `comparison.rows[${rowIndex}].label`);
    row.values.forEach((value, valueIndex) => {
      requireGuideText(value, `comparison.rows[${rowIndex}].values[${valueIndex}]`);
    });
  });
  assertComparisonRows(copy.comparison);

  requireGuideText(copy.faq.eyebrow, "faq.eyebrow");
  requireGuideText(copy.faq.title, "faq.title");
  requireGuideText(copy.faq.description, "faq.description");
  requireGuideCount(copy.faq.items.length, FAQ_ITEM_COUNT, "faq.items");
  copy.faq.items.forEach((item, itemIndex) => {
    requireGuideText(item.question, `faq.items[${itemIndex}].question`);
    requireGuideText(item.answer, `faq.items[${itemIndex}].answer`);
  });

  requireGuideText(copy.cta.title, "cta.title");
  requireGuideText(copy.cta.description, "cta.description");
  requireGuideText(copy.cta.label, "cta.label");
}

function focusProcessingCalculator(calculatorId: string): void {
  const calculatorTarget = document.getElementById(calculatorId);
  if (calculatorTarget === null) {
    throw new Error(
      `ProcessingToolGuide could not find calculator target ${JSON.stringify(`#${calculatorId}`)}.`,
    );
  }

  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  calculatorTarget.focus({ preventScroll: true });
  calculatorTarget.scrollIntoView({ behavior, block: "start" });
}

function OverviewSection({
  copy,
  currentTool,
}: Readonly<{
  copy: ProcessingToolGuideCopy["overview"];
  currentTool: ProcessingToolId;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-overview`;

  return (
    <section aria-labelledby={headingId}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
      </div>
      <div className={styles.overviewLayout}>
        <div className={styles.overviewCopy}>
          {copy.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`${currentTool}-overview-paragraph-${paragraphIndex}`}>{paragraph}</p>
          ))}
        </div>
        <aside className={styles.overviewAside}>{copy.aside}</aside>
      </div>
    </section>
  );
}

function FeatureFigure({
  feature,
  mediaItem,
}: Readonly<{
  feature: ProcessingGuideFeature;
  mediaItem: ProcessingToolGuideMediaItem;
}>): JSX.Element {
  return (
    <figure className={styles.featureFigure}>
      <div className={styles.featureMedia}>
        <img
          alt={`${feature.title}: ${feature.caseHint}`}
          className={styles.featureImage}
          decoding="async"
          height={mediaItem.height}
          loading="lazy"
          src={mediaItem.src}
          width={mediaItem.width}
        />
      </div>
      <figcaption className={styles.featureCaption}>
        <p className={styles.caseHint}>{feature.caseHint}</p>
        <p className={styles.caseCaption}>{feature.caption}</p>
      </figcaption>
    </figure>
  );
}

function FeatureArticle({
  currentTool,
  feature,
  featureIndex,
  mediaItem,
}: Readonly<{
  currentTool: ProcessingToolId;
  feature: ProcessingGuideFeature;
  featureIndex: number;
  mediaItem: ProcessingToolGuideMediaItem;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-feature-${featureIndex + 1}`;
  const mediaSide = featureIndex % 2 === 0 ? "end" : "start";

  return (
    <article
      aria-labelledby={headingId}
      className={styles.feature}
      data-feature-media={mediaSide}
    >
      <div className={styles.featureCopy}>
        <p className={styles.featureMeta}>
          <span className={styles.featureNumber}>{feature.number}</span>
          <span>{feature.eyebrow}</span>
        </p>
        <h2 className={styles.featureTitle} id={headingId}>
          {feature.title}
        </h2>
        <p className={styles.featureBody}>{feature.body}</p>
      </div>
      <FeatureFigure feature={feature} mediaItem={mediaItem} />
    </article>
  );
}

function FeatureList({
  currentTool,
  features,
  media,
}: Readonly<{
  currentTool: ProcessingToolId;
  features: ProcessingToolGuideCopy["features"]["items"];
  media: readonly ProcessingToolGuideMediaItem[];
}>): JSX.Element {
  return (
    <div className={styles.featureList}>
      {features.map((feature, featureIndex) => (
        <FeatureArticle
          currentTool={currentTool}
          feature={feature}
          featureIndex={featureIndex}
          key={media[featureIndex].sourceId}
          mediaItem={media[featureIndex]}
        />
      ))}
    </div>
  );
}

function FeatureIntroSection({
  copy,
  currentTool,
}: Readonly<{
  copy: ProcessingToolGuideCopy["featureIntro"];
  currentTool: ProcessingToolId;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-feature-intro`;

  return (
    <section aria-labelledby={headingId}>
      <div className={styles.centeredBlock}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
        <p className={styles.centeredDescription}>{copy.description}</p>
      </div>
      <ul className={styles.introGrid}>
        {copy.items.map((item, itemIndex) => (
          <li className={styles.introCard} key={`${currentTool}-intro-${itemIndex}`}>
            <h3>{item.title}</h3>
            <p className={styles.cardBody}>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HowToUseSection({
  calculatorId,
  copy,
}: Readonly<{
  calculatorId: string;
  copy: ProcessingToolGuideCopy["howToUse"];
}>): JSX.Element {
  return (
    <HowItWorks09
      cta={{
        label: copy.actionLabel,
        onClick: () => focusProcessingCalculator(calculatorId),
      }}
      eyebrow={copy.eyebrow}
      steps={copy.steps}
      title={copy.title}
    />
  );
}

function WhyChooseSection({
  copy,
  currentTool,
}: Readonly<{
  copy: ProcessingToolGuideCopy["whyChoose"];
  currentTool: ProcessingToolId;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-why-choose`;

  return (
    <section aria-labelledby={headingId}>
      <div className={`${styles.centeredBlock} ${styles.narrowBlock}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
        <p className={styles.whyDescription}>{copy.description}</p>
      </div>
      <ul className={styles.whyGrid}>
        {copy.items.map((item, itemIndex) => (
          <li className={styles.whyCard} key={`${currentTool}-why-${itemIndex}`}>
            <p className={styles.cardNumber}>{item.number}</p>
            <h3>{item.title}</h3>
            <p className={styles.cardBody}>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ComparisonSection({
  comparison,
  currentTool,
  locale,
}: Readonly<{
  comparison: ProcessingGuideComparison;
  currentTool: ProcessingToolId;
  locale: PublicLocale;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-comparison`;
  const currentToolHref = getProcessingToolHref(locale, currentTool);
  const scrollHint = locale === "en"
    ? "Swipe to compare all tools →"
    : "左右滑动查看完整对比 →";
  const scrollInstructions = locale === "en"
    ? "Use the horizontal scrollbar to read the full comparison."
    : "可使用横向滚动条查看完整对比。";

  return (
    <section aria-labelledby={headingId}>
      <div className={`${styles.centeredBlock} ${styles.narrowBlock}`}>
        <p className={styles.eyebrow}>{comparison.eyebrow}</p>
        <h2 id={headingId}>{comparison.title}</h2>
        <p className={styles.comparisonDescription}>{comparison.description}</p>
      </div>
      <div
        aria-description={scrollInstructions}
        aria-labelledby={headingId}
        className={styles.tableScroller}
        role="region"
        tabIndex={0}
      >
        <table className={styles.comparisonTable}>
          <caption className={styles.visuallyHidden}>{comparison.title}</caption>
          <colgroup>
            <col className={styles.comparisonLabelColumn} />
            {comparison.products.map((product) => (
              <col className={styles.comparisonProductColumn} key={product.href} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{comparison.cornerLabel}</th>
              {comparison.products.map((product) => {
                const isCurrentTool = product.href === currentToolHref;

                return (
                  <th
                    className={isCurrentTool ? styles.currentToolHeader : undefined}
                    key={product.href}
                    scope="col"
                  >
                    <a aria-current={isCurrentTool ? "page" : undefined} href={product.href}>
                      {product.name}
                    </a>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row, rowIndex) => (
              <tr key={`${currentTool}-comparison-row-${rowIndex}`}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, valueIndex) => {
                  const isCurrentTool = comparison.products[valueIndex]?.href === currentToolHref;

                  return (
                    <td
                      className={isCurrentTool ? styles.currentToolValue : undefined}
                      key={`${currentTool}-comparison-value-${rowIndex}-${valueIndex}`}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.tableHint}>
        {scrollHint}
      </p>
    </section>
  );
}

function FinalCallToAction({
  calculatorId,
  copy,
  currentTool,
}: Readonly<{
  calculatorId: string;
  copy: ProcessingToolGuideCopy["cta"];
  currentTool: ProcessingToolId;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-final-cta`;

  return (
    <section aria-labelledby={headingId} className={styles.finalCallToAction}>
      <div className={styles.centeredBlock}>
        <h2 id={headingId}>{copy.title}</h2>
        <p className={styles.centeredDescription}>{copy.description}</p>
      </div>
      <Button
        className={styles.finalCallToActionButton}
        onClick={() => focusProcessingCalculator(calculatorId)}
        size="lg"
        type="button"
      >
        {copy.label}
      </Button>
    </section>
  );
}

export function ProcessingToolGuide({
  currentTool,
  locale,
}: ProcessingToolGuideProperties): JSX.Element {
  const copy = getProcessingToolGuideCopy(locale, currentTool);
  const media = getProcessingToolGuideMedia(locale, currentTool);
  const calculatorId = `${currentTool}-calculator`;

  assertGuideContent(copy, media);

  return (
    <div className={styles.guide} data-processing-tool-guide={currentTool}>
      <OverviewSection copy={copy.overview} currentTool={currentTool} />
      <FeatureList currentTool={currentTool} features={copy.features.items} media={media} />
      <FeatureIntroSection copy={copy.featureIntro} currentTool={currentTool} />
      <HowToUseSection calculatorId={calculatorId} copy={copy.howToUse} />
      <WhyChooseSection copy={copy.whyChoose} currentTool={currentTool} />
      <ComparisonSection
        comparison={copy.comparison}
        currentTool={currentTool}
        locale={locale}
      />
      <section aria-label={copy.faq.title} className={styles.faqSlot}>
        <Faq1 {...copy.faq} className={styles.faq} />
      </section>
      <FinalCallToAction
        calculatorId={calculatorId}
        copy={copy.cta}
        currentTool={currentTool}
      />
    </div>
  );
}
