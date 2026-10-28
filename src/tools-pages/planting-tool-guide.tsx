"use client";

import type { JSX } from "react";

import { Faq1 } from "../components/faq-1";
import {
  getPlantingToolGuideCopy,
  type PlantingToolGuideCopy,
} from "../i18n/planting-tool-guide-copy";
import type { PublicLocale } from "../i18n/public-locale";
import { HowItWorks09 } from "./how-it-works-09";
import { getPlantingToolGuideImageAlt } from "./planting-tool-guide-alt";
import type { PlantingToolId } from "./planting-tool-frame";
import { createCropGrowthToolHref, createCropProfitHref } from "./planting-tool-href";
import {
  getPlantingToolGuideCaseImage,
  getPlantingToolGuideMedia,
  type PlantingToolGuideFeatureMedia,
  type PlantingToolGuideFeatureMediaList,
  type PlantingToolGuideImage,
} from "./planting-tool-media";
import styles from "./planting-tool-guide.module.css";

const OVERVIEW_PARAGRAPH_COUNT = 3;
const CASE_FOCUS_COUNT = 5;
const FEATURE_COUNT = 5;
const INTRO_CARD_COUNT = 4;
const WHY_CARD_COUNT = 5;
const COMPARISON_PRODUCT_COUNT = 3;
const COMPARISON_ROW_COUNT = 6;
const FAQ_COUNT = 7;
const HOW_STEP_COUNT = 3;
const MOBILE_IMAGE_MEDIA = "(max-width: 700px)";

export type PlantingToolGuideProperties = Readonly<{
  locale: PublicLocale;
  currentTool: PlantingToolId;
}>;

type GuideComparison = PlantingToolGuideCopy["comparison"];
type GuideFeature = PlantingToolGuideCopy["features"]["items"][number];

function requireCount(actualCount: number, expectedCount: number, fieldPath: string): void {
  if (actualCount !== expectedCount) {
    throw new Error(
      `PlantingToolGuide ${fieldPath} must contain ${expectedCount} items, received ${actualCount}.`,
    );
  }
}

function requireNonEmpty(value: string, fieldPath: string): void {
  if (value.trim().length === 0) {
    throw new Error(
      `PlantingToolGuide ${fieldPath} must be a non-empty string, received ${JSON.stringify(value)}.`,
    );
  }
}

function requireImage(image: PlantingToolGuideImage, fieldPath: string): void {
  requireNonEmpty(image.src, `${fieldPath}.src`);

  if (!Number.isInteger(image.width) || image.width <= 0 || !Number.isInteger(image.height) || image.height <= 0) {
    throw new Error(
      `PlantingToolGuide ${fieldPath} must have positive integer dimensions, received width ${JSON.stringify(image.width)} and height ${JSON.stringify(image.height)}.`,
    );
  }
}

function assertComparisonRowsMatchProducts(comparison: GuideComparison): void {
  comparison.rows.forEach((row, rowIndex) => {
    const actualValueCount = Array.isArray(row.values) ? row.values.length : null;

    if (actualValueCount !== comparison.products.length) {
      throw new Error(
        `PlantingToolGuide comparison.rows[${rowIndex}] ${JSON.stringify(row.label)} has ${actualValueCount} values; expected ${comparison.products.length} for products ${JSON.stringify(comparison.products.map((product) => product.name))}.`,
      );
    }
  });
}

function assertGuideContent(
  copy: PlantingToolGuideCopy,
  media: PlantingToolGuideFeatureMediaList,
): void {
  requireNonEmpty(copy.overview.eyebrow, "overview.eyebrow");
  requireNonEmpty(copy.overview.title, "overview.title");
  requireNonEmpty(copy.overview.aside, "overview.aside");
  requireCount(copy.overview.paragraphs.length, OVERVIEW_PARAGRAPH_COUNT, "overview.paragraphs");
  copy.overview.paragraphs.forEach((paragraph, paragraphIndex) => {
    requireNonEmpty(paragraph, `overview.paragraphs[${paragraphIndex}]`);
  });

  requireNonEmpty(copy.caseStudy.eyebrow, "caseStudy.eyebrow");
  requireNonEmpty(copy.caseStudy.title, "caseStudy.title");
  requireNonEmpty(copy.caseStudy.description, "caseStudy.description");
  requireNonEmpty(copy.caseStudy.focusTitle, "caseStudy.focusTitle");
  requireNonEmpty(copy.caseStudy.caption, "caseStudy.caption");
  requireCount(copy.caseStudy.focusItems.length, CASE_FOCUS_COUNT, "caseStudy.focusItems");
  copy.caseStudy.focusItems.forEach((item, itemIndex) => {
    requireNonEmpty(item, `caseStudy.focusItems[${itemIndex}]`);
  });

  requireCount(copy.features.items.length, FEATURE_COUNT, "features.items");
  requireCount(media.length, FEATURE_COUNT, "media");
  copy.features.items.forEach((feature, featureIndex) => {
    requireNonEmpty(feature.eyebrow, `features.items[${featureIndex}].eyebrow`);
    requireNonEmpty(feature.number, `features.items[${featureIndex}].number`);
    requireNonEmpty(feature.title, `features.items[${featureIndex}].title`);
    requireNonEmpty(feature.body, `features.items[${featureIndex}].body`);

    const featureMedia = media[featureIndex];
    const expectedSourceId = `features-${featureIndex + 1}`;
    if (featureMedia.sourceId !== expectedSourceId) {
      throw new Error(
        `PlantingToolGuide media[${featureIndex}].sourceId must be ${JSON.stringify(expectedSourceId)}, received ${JSON.stringify(featureMedia.sourceId)}.`,
      );
    }

    requireImage(featureMedia.desktop, `media[${featureIndex}].desktop`);
    requireImage(featureMedia.mobile, `media[${featureIndex}].mobile`);
  });

  requireNonEmpty(copy.featureIntro.eyebrow, "featureIntro.eyebrow");
  requireNonEmpty(copy.featureIntro.title, "featureIntro.title");
  requireNonEmpty(copy.featureIntro.description, "featureIntro.description");
  requireCount(copy.featureIntro.items.length, INTRO_CARD_COUNT, "featureIntro.items");
  copy.featureIntro.items.forEach((item, itemIndex) => {
    requireNonEmpty(item.title, `featureIntro.items[${itemIndex}].title`);
    requireNonEmpty(item.body, `featureIntro.items[${itemIndex}].body`);
  });

  requireNonEmpty(copy.howToUse.eyebrow, "howToUse.eyebrow");
  requireNonEmpty(copy.howToUse.title, "howToUse.title");
  requireNonEmpty(copy.howToUse.actionLabel, "howToUse.actionLabel");
  requireCount(copy.howToUse.steps.length, HOW_STEP_COUNT, "howToUse.steps");

  requireNonEmpty(copy.whyChoose.eyebrow, "whyChoose.eyebrow");
  requireNonEmpty(copy.whyChoose.title, "whyChoose.title");
  requireNonEmpty(copy.whyChoose.description, "whyChoose.description");
  requireCount(copy.whyChoose.items.length, WHY_CARD_COUNT, "whyChoose.items");
  copy.whyChoose.items.forEach((item, itemIndex) => {
    requireNonEmpty(item.number, `whyChoose.items[${itemIndex}].number`);
    requireNonEmpty(item.title, `whyChoose.items[${itemIndex}].title`);
    requireNonEmpty(item.body, `whyChoose.items[${itemIndex}].body`);
  });

  requireNonEmpty(copy.comparison.eyebrow, "comparison.eyebrow");
  requireNonEmpty(copy.comparison.title, "comparison.title");
  requireNonEmpty(copy.comparison.description, "comparison.description");
  requireNonEmpty(copy.comparison.cornerLabel, "comparison.cornerLabel");
  requireCount(copy.comparison.products.length, COMPARISON_PRODUCT_COUNT, "comparison.products");
  requireCount(copy.comparison.rows.length, COMPARISON_ROW_COUNT, "comparison.rows");
  copy.comparison.products.forEach((product, productIndex) => {
    requireNonEmpty(product.name, `comparison.products[${productIndex}].name`);
    requireNonEmpty(product.href, `comparison.products[${productIndex}].href`);
  });
  copy.comparison.rows.forEach((row, rowIndex) => {
    requireNonEmpty(row.label, `comparison.rows[${rowIndex}].label`);
    row.values.forEach((value, valueIndex) => {
      requireNonEmpty(value, `comparison.rows[${rowIndex}].values[${valueIndex}]`);
    });
  });
  assertComparisonRowsMatchProducts(copy.comparison);

  requireNonEmpty(copy.faq.eyebrow, "faq.eyebrow");
  requireNonEmpty(copy.faq.title, "faq.title");
  requireNonEmpty(copy.faq.description, "faq.description");
  requireCount(copy.faq.items.length, FAQ_COUNT, "faq.items");
  requireNonEmpty(copy.closing.title, "closing.title");
  requireNonEmpty(copy.closing.description, "closing.description");
  requireNonEmpty(copy.closing.actionLabel, "closing.actionLabel");
}

function focusCalculator(calculatorId: string): void {
  const calculatorTarget = document.getElementById(calculatorId);
  if (calculatorTarget === null) {
    throw new Error(`PlantingToolGuide could not find calculator target "#${calculatorId}".`);
  }

  const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  calculatorTarget.focus({ preventScroll: true });
  calculatorTarget.scrollIntoView({ behavior: scrollBehavior, block: "start" });
}

function OverviewSection({
  copy,
  headingId,
}: Readonly<{
  copy: PlantingToolGuideCopy["overview"];
  headingId: string;
}>): JSX.Element {
  return (
    <section aria-labelledby={headingId}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
      </div>
      <div className={styles.overviewLayout}>
        <div className={styles.overviewCopy}>
          {copy.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={`overview-paragraph-${paragraphIndex}`}>{paragraph}</p>
          ))}
        </div>
        <aside className={styles.overviewAside}>{copy.aside}</aside>
      </div>
    </section>
  );
}

function CaseStudySection({
  copy,
  currentTool,
  locale,
}: Readonly<{
  copy: PlantingToolGuideCopy["caseStudy"];
  currentTool: PlantingToolId;
  locale: PublicLocale;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-case`;
  const caseImage = getPlantingToolGuideCaseImage(locale, currentTool);

  return (
    <section aria-labelledby={headingId} className={styles.caseStudy}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
      </div>
      <p className={styles.caseDescription}>{copy.description}</p>
      <div className={styles.caseLayout}>
        <img
          alt={getPlantingToolGuideImageAlt(locale, currentTool, "case")}
          className={styles.caseImage}
          height={caseImage.height}
          loading="lazy"
          src={caseImage.src}
          width={caseImage.width}
        />
        <div className={styles.caseFocus}>
          <h3 className={styles.caseFocusTitle}>{copy.focusTitle}</h3>
          <ul className={styles.caseFocusList}>
            {copy.focusItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.caseCaption}>{copy.caption}</p>
        </div>
      </div>
    </section>
  );
}

function FeaturePicture({
  alt,
  featureMedia,
}: Readonly<{
  alt: string;
  featureMedia: PlantingToolGuideFeatureMedia;
}>): JSX.Element {
  return (
    <picture>
      <source
        height={featureMedia.mobile.height}
        media={MOBILE_IMAGE_MEDIA}
        srcSet={featureMedia.mobile.src}
        width={featureMedia.mobile.width}
      />
      <img
        alt={alt}
        className={styles.featureImage}
        height={featureMedia.desktop.height}
        loading="lazy"
        src={featureMedia.desktop.src}
        width={featureMedia.desktop.width}
      />
    </picture>
  );
}

function FeatureArticle({
  currentTool,
  feature,
  featureIndex,
  featureMedia,
  locale,
}: Readonly<{
  currentTool: PlantingToolId;
  feature: GuideFeature;
  featureIndex: number;
  featureMedia: PlantingToolGuideFeatureMedia;
  locale: PublicLocale;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-feature-${featureIndex + 1}`;
  const mediaSide = featureIndex % 2 === 0 ? "end" : "start";

  return (
    <article aria-labelledby={headingId} className={styles.feature} data-feature-media={mediaSide}>
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
      <div className={styles.featureMedia}>
        <FeaturePicture
          alt={getPlantingToolGuideImageAlt(locale, currentTool, featureMedia.sourceId)}
          featureMedia={featureMedia}
        />
      </div>
    </article>
  );
}

function FeatureList({
  currentTool,
  features,
  locale,
  media,
}: Readonly<{
  currentTool: PlantingToolId;
  features: PlantingToolGuideCopy["features"]["items"];
  locale: PublicLocale;
  media: PlantingToolGuideFeatureMediaList;
}>): JSX.Element {
  return (
    <div className={styles.featureList}>
      {features.map((feature, featureIndex) => (
        <FeatureArticle
          currentTool={currentTool}
          feature={feature}
          featureIndex={featureIndex}
          featureMedia={media[featureIndex]}
          key={media[featureIndex].sourceId}
          locale={locale}
        />
      ))}
    </div>
  );
}

function FeatureIntroSection({
  copy,
  currentTool,
}: Readonly<{
  copy: PlantingToolGuideCopy["featureIntro"];
  currentTool: PlantingToolId;
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

function WhySection({
  copy,
  currentTool,
}: Readonly<{
  copy: PlantingToolGuideCopy["whyChoose"];
  currentTool: PlantingToolId;
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
  currentToolHref,
}: Readonly<{
  comparison: GuideComparison;
  currentTool: PlantingToolId;
  currentToolHref: string;
}>): JSX.Element {
  const headingId = `${currentTool}-guide-comparison`;

  return (
    <section aria-labelledby={headingId} className={styles.comparison}>
      <div className={`${styles.centeredBlock} ${styles.narrowBlock}`}>
        <p className={styles.eyebrow}>{comparison.eyebrow}</p>
        <h2 id={headingId}>{comparison.title}</h2>
        <p className={styles.comparisonDescription}>{comparison.description}</p>
      </div>
      <div
        aria-labelledby={headingId}
        className={styles.tableScroller}
        role="region"
        tabIndex={0}
      >
        <table className={styles.comparisonTable}>
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
    </section>
  );
}

export function PlantingToolGuide({
  locale,
  currentTool,
}: PlantingToolGuideProperties): JSX.Element {
  const copy = getPlantingToolGuideCopy(locale, currentTool);
  const media = getPlantingToolGuideMedia(locale, currentTool);
  const calculatorId = `${currentTool}-calculator`;
  const currentToolHref = currentTool === "crop-profit"
    ? createCropProfitHref(locale)
    : createCropGrowthToolHref(locale);

  assertGuideContent(copy, media);

  return (
    <div className={styles.guide}>
      <OverviewSection copy={copy.overview} headingId={`${currentTool}-guide-overview`} />
      <CaseStudySection copy={copy.caseStudy} currentTool={currentTool} locale={locale} />
      <FeatureList
        currentTool={currentTool}
        features={copy.features.items}
        locale={locale}
        media={media}
      />
      <FeatureIntroSection copy={copy.featureIntro} currentTool={currentTool} />
      <HowItWorks09
        cta={{
          label: copy.howToUse.actionLabel,
          onClick: () => focusCalculator(calculatorId),
        }}
        eyebrow={copy.howToUse.eyebrow}
        steps={copy.howToUse.steps}
        title={copy.howToUse.title}
      />
      <WhySection copy={copy.whyChoose} currentTool={currentTool} />
      <ComparisonSection
        comparison={copy.comparison}
        currentTool={currentTool}
        currentToolHref={currentToolHref}
      />
      <div className={styles.faqSlot}>
        <Faq1 {...copy.faq} className={styles.faq} />
      </div>
      <section aria-labelledby={`${currentTool}-guide-closing`} className={styles.closing}>
        <div className={styles.closingCopy}>
          <h2 className={styles.closingTitle} id={`${currentTool}-guide-closing`}>
            {copy.closing.title}
          </h2>
          <p className={styles.closingDescription}>{copy.closing.description}</p>
        </div>
        <button
          className={styles.closingAction}
          onClick={() => focusCalculator(calculatorId)}
          type="button"
        >
          {copy.closing.actionLabel}
        </button>
      </section>
    </div>
  );
}
