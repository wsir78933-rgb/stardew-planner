import type { JSX } from "react";

import {
  getProductionSchedulePageCopy,
  type ProductionSchedulePageCopy,
} from "../../i18n/production-schedule-page-copy";
import { getPlanningToolRouteCopy } from "../../i18n/planning-tool-route-copy";
import type { PublicLocale } from "../../i18n/public-locale";
import { ProductionPlannerTool } from "../production/production-planner-tool";
import { SimpleHero } from "../simple-hero";
import {
  getProductionScheduleCaseMedia,
  type ProductionScheduleCaseImage,
  type ProductionScheduleCaseMedia,
} from "./production-schedule-case-media";
import styles from "./production-schedule-page.module.css";

const FEATURE_COUNT = 3;
const STEP_COUNT = 3;
const COMPARISON_PRODUCT_COUNT = 3;
const COMPARISON_ROW_COUNT = 4;
const FAQ_COUNT = 4;
const DESKTOP_CASE_IMAGE_WIDTH = 556;
const DESKTOP_CASE_IMAGE_HEIGHT = 417;
const MOBILE_CASE_IMAGE_WIDTH = 312;
const MOBILE_CASE_IMAGE_HEIGHT = 234;
const MOBILE_IMAGE_MEDIA = "(max-width: 700px)";
const CALCULATOR_ID = "production-schedule-calculator";
const TITLE_ID = "production-schedule-title";

export type ProductionSchedulePageProperties = Readonly<{
  locale: PublicLocale;
}>;

type ScheduleComparison = ProductionSchedulePageCopy["comparison"];

function requireNonEmpty(value: string, fieldPath: string): void {
  if (value.trim().length === 0) {
    throw new Error(
      `ProductionSchedulePage ${fieldPath} must be a non-empty string, received ${JSON.stringify(value)}.`,
    );
  }
}

function requireCount(actualCount: number, expectedCount: number, fieldPath: string): void {
  if (actualCount !== expectedCount) {
    throw new Error(
      `ProductionSchedulePage ${fieldPath} must contain ${expectedCount} items, received ${actualCount}.`,
    );
  }
}

function requireCaseImage(image: ProductionScheduleCaseImage, fieldPath: string): void {
  requireNonEmpty(image.src, `${fieldPath}.src`);

  if (!Number.isInteger(image.width) || image.width <= 0 || !Number.isInteger(image.height) || image.height <= 0) {
    throw new Error(
      `ProductionSchedulePage ${fieldPath} must have positive integer dimensions, received width ${JSON.stringify(image.width)} and height ${JSON.stringify(image.height)}.`,
    );
  }
}

function requireCaseImageSize(
  image: ProductionScheduleCaseImage,
  expectedWidth: number,
  expectedHeight: number,
  fieldPath: string,
): void {
  if (image.width !== expectedWidth || image.height !== expectedHeight) {
    throw new Error(
      `ProductionSchedulePage ${fieldPath} must be ${expectedWidth} by ${expectedHeight} pixels, received width ${image.width} and height ${image.height}.`,
    );
  }
}

function assertComparisonRowValues(
  row: ScheduleComparison["rows"][number],
  rowIndex: number,
  productCount: number,
  fieldName: "values" | "mobileValues",
): void {
  const rowValues = row[fieldName];

  if (rowValues === undefined) {
    return;
  }

  if (rowValues.length !== productCount) {
    throw new Error(
      `ProductionSchedulePage comparison.rows[${rowIndex}].${fieldName} for ${JSON.stringify(row.label)} has ${rowValues.length} values; expected ${productCount}.`,
    );
  }
}

function assertComparisonRows(comparison: ScheduleComparison): void {
  comparison.rows.forEach((row, rowIndex) => {
    assertComparisonRowValues(row, rowIndex, comparison.products.length, "values");
    assertComparisonRowValues(row, rowIndex, comparison.products.length, "mobileValues");
  });
}

function assertSchedulePage(copy: ProductionSchedulePageCopy, media: ProductionScheduleCaseMedia): void {
  requireNonEmpty(copy.hero.eyebrow, "hero.eyebrow");
  requireNonEmpty(copy.hero.title, "hero.title");
  requireNonEmpty(copy.hero.description, "hero.description");
  requireNonEmpty(copy.hero.note, "hero.note");

  requireNonEmpty(copy.caseStudy.eyebrow, "caseStudy.eyebrow");
  requireNonEmpty(copy.caseStudy.title, "caseStudy.title");
  requireNonEmpty(copy.caseStudy.inputs, "caseStudy.inputs");
  requireNonEmpty(copy.caseStudy.resultTitle, "caseStudy.resultTitle");
  requireNonEmpty(copy.caseStudy.mobileResultTitle, "caseStudy.mobileResultTitle");
  requireNonEmpty(copy.caseStudy.footnote, "caseStudy.footnote");
  if (copy.caseStudy.resultLines.length === 0) {
    throw new Error("ProductionSchedulePage caseStudy.resultLines must contain at least 1 line, received 0.");
  }
  copy.caseStudy.resultLines.forEach((line, lineIndex) => {
    requireNonEmpty(line, `caseStudy.resultLines[${lineIndex}]`);
  });
  requireCaseImage(media.desktop, "caseMedia.desktop");
  requireCaseImage(media.mobile, "caseMedia.mobile");
  requireCaseImageSize(media.desktop, DESKTOP_CASE_IMAGE_WIDTH, DESKTOP_CASE_IMAGE_HEIGHT, "caseMedia.desktop");
  requireCaseImageSize(media.mobile, MOBILE_CASE_IMAGE_WIDTH, MOBILE_CASE_IMAGE_HEIGHT, "caseMedia.mobile");
  if (media.desktop.src === media.mobile.src) {
    throw new Error(
      `ProductionSchedulePage case images must use separate desktop and mobile files, received ${JSON.stringify(media.desktop.src)}.`,
    );
  }

  requireNonEmpty(copy.features.eyebrow, "features.eyebrow");
  requireNonEmpty(copy.features.title, "features.title");
  requireNonEmpty(copy.features.description, "features.description");
  requireCount(copy.features.items.length, FEATURE_COUNT, "features.items");
  copy.features.items.forEach((item, itemIndex) => {
    requireNonEmpty(item.title, `features.items[${itemIndex}].title`);
    requireNonEmpty(item.body, `features.items[${itemIndex}].body`);
  });

  requireNonEmpty(copy.steps.eyebrow, "steps.eyebrow");
  requireNonEmpty(copy.steps.title, "steps.title");
  requireNonEmpty(copy.steps.description, "steps.description");
  requireCount(copy.steps.items.length, STEP_COUNT, "steps.items");
  copy.steps.items.forEach((step, stepIndex) => {
    requireNonEmpty(step.number, `steps.items[${stepIndex}].number`);
    requireNonEmpty(step.title, `steps.items[${stepIndex}].title`);
    requireNonEmpty(step.body, `steps.items[${stepIndex}].body`);
  });

  requireNonEmpty(copy.comparison.eyebrow, "comparison.eyebrow");
  requireNonEmpty(copy.comparison.title, "comparison.title");
  requireNonEmpty(copy.comparison.description, "comparison.description");
  requireNonEmpty(copy.comparison.mobileDescription, "comparison.mobileDescription");
  requireNonEmpty(copy.comparison.cornerLabel, "comparison.cornerLabel");
  requireNonEmpty(copy.comparison.sourceLine, "comparison.sourceLine");
  requireNonEmpty(copy.comparison.mobileSourceLine, "comparison.mobileSourceLine");
  requireCount(copy.comparison.products.length, COMPARISON_PRODUCT_COUNT, "comparison.products");
  requireCount(copy.comparison.rows.length, COMPARISON_ROW_COUNT, "comparison.rows");
  copy.comparison.products.forEach((product, productIndex) => {
    requireNonEmpty(product, `comparison.products[${productIndex}]`);
  });
  copy.comparison.rows.forEach((row, rowIndex) => {
    requireNonEmpty(row.label, `comparison.rows[${rowIndex}].label`);
    row.values.forEach((value, valueIndex) => {
      requireNonEmpty(value, `comparison.rows[${rowIndex}].values[${valueIndex}]`);
    });
    row.mobileValues?.forEach((value, valueIndex) => {
      requireNonEmpty(value, `comparison.rows[${rowIndex}].mobileValues[${valueIndex}]`);
    });
  });
  assertComparisonRows(copy.comparison);

  requireNonEmpty(copy.faq.eyebrow, "faq.eyebrow");
  requireNonEmpty(copy.faq.title, "faq.title");
  requireNonEmpty(copy.faq.description, "faq.description");
  requireCount(copy.faq.items.length, FAQ_COUNT, "faq.items");
  copy.faq.items.forEach((item, itemIndex) => {
    requireNonEmpty(item.question, `faq.items[${itemIndex}].question`);
    requireNonEmpty(item.answer, `faq.items[${itemIndex}].answer`);
  });

  requireNonEmpty(copy.cta.title, "cta.title");
  requireNonEmpty(copy.cta.description, "cta.description");
  requireNonEmpty(copy.cta.actionLabel, "cta.actionLabel");
}

function CasePicture({ media }: Readonly<{ media: ProductionScheduleCaseMedia }>): JSX.Element {
  return (
    <picture>
      <source
        height={media.mobile.height}
        media={MOBILE_IMAGE_MEDIA}
        srcSet={media.mobile.src}
        width={media.mobile.width}
      />
      <img
        alt=""
        className={styles.caseImage}
        height={media.desktop.height}
        loading="lazy"
        src={media.desktop.src}
        width={media.desktop.width}
      />
    </picture>
  );
}

function HeroSection({ copy }: Readonly<{ copy: ProductionSchedulePageCopy["hero"] }>): JSX.Element {
  return (
    <section aria-labelledby={TITLE_ID} className={styles.hero}>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h2 className={styles.heroTitle} id={TITLE_ID}>
        {copy.title}
      </h2>
      <p className={styles.lede}>{copy.description}</p>
      <p className={styles.note}>{copy.note}</p>
    </section>
  );
}

function CaseSection({
  copy,
  media,
}: Readonly<{
  copy: ProductionSchedulePageCopy["caseStudy"];
  media: ProductionScheduleCaseMedia;
}>): JSX.Element {
  const headingId = "production-schedule-case-title";

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingId}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.inputs}</p>
      </div>
      <div className={styles.caseLayout}>
        <CasePicture media={media} />
        <div className={styles.caseResult}>
          <h3 className={`${styles.caseResultTitle} ${styles.desktopOnly}`}>{copy.resultTitle}</h3>
          <h3 className={`${styles.caseResultTitle} ${styles.mobileOnly}`}>{copy.mobileResultTitle}</h3>
          {copy.resultLines.map((line) => (
            <p className={styles.caseResultLine} key={line}>
              {line}
            </p>
          ))}
          <p className={`${styles.note} ${styles.desktopOnly}`}>{copy.footnote}</p>
        </div>
      </div>
    </section>
  );
}

function FeatureSection({ copy }: Readonly<{ copy: ProductionSchedulePageCopy["features"] }>): JSX.Element {
  const headingId = "production-schedule-features-title";

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingId}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.description}</p>
      </div>
      <ul className={styles.cardGrid}>
        {copy.items.map((item) => (
          <li className={styles.card} key={item.title}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardBody}>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StepsSection({ copy }: Readonly<{ copy: ProductionSchedulePageCopy["steps"] }>): JSX.Element {
  const headingId = "production-schedule-steps-title";

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingId}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.description}</p>
      </div>
      <ol className={styles.stepList}>
        {copy.items.map((step) => (
          <li className={styles.step} key={step.number}>
            <p className={styles.stepNumber}>{step.number}</p>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardBody}>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ComparisonTable({
  comparison,
  headingId,
}: Readonly<{ comparison: ScheduleComparison; headingId: string }>): JSX.Element {
  return (
    <div aria-labelledby={headingId} className={styles.tableScroller} role="region" tabIndex={0}>
      <table className={styles.comparisonTable}>
        <colgroup>
          <col className={styles.comparisonLabelColumn} />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">{comparison.cornerLabel}</th>
            {comparison.products.map((product) => (
              <th key={product} scope="col">
                {product}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.values.map((value, valueIndex) => (
                <td key={`${row.label}-${valueIndex}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonCards({ comparison }: Readonly<{ comparison: ScheduleComparison }>): JSX.Element {
  return (
    <div className={styles.comparisonCards}>
      {comparison.rows.map((row) => (
        <article className={styles.comparisonCard} key={row.label}>
          <h3 className={styles.cardTitle}>{row.label}</h3>
          <dl className={styles.comparisonValues}>
            {comparison.products.map((product, productIndex) => {
              const rowValues = row.mobileValues ?? row.values;
              const cellValue = rowValues[productIndex];

              if (cellValue === undefined) {
                throw new Error(
                  `ProductionSchedulePage comparison card ${JSON.stringify(row.label)} is missing a value for ${JSON.stringify(product)}.`,
                );
              }

              return (
                <div className={styles.comparisonValue} key={`${row.label}-${product}`}>
                  <dt>{product}</dt>
                  <dd>{cellValue}</dd>
                </div>
              );
            })}
          </dl>
        </article>
      ))}
    </div>
  );
}

function ComparisonSection({ comparison }: Readonly<{ comparison: ScheduleComparison }>): JSX.Element {
  const headingId = "production-schedule-comparison-title";

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{comparison.eyebrow}</p>
        <h2 className={styles.comparisonTitle} id={headingId}>
          {comparison.title}
        </h2>
        <p className={`${styles.sectionDescription} ${styles.desktopOnly}`}>{comparison.description}</p>
        <p className={`${styles.sectionDescription} ${styles.mobileOnly}`}>{comparison.mobileDescription}</p>
      </div>
      <ComparisonTable comparison={comparison} headingId={headingId} />
      <ComparisonCards comparison={comparison} />
      <p className={`${styles.sources} ${styles.desktopOnly}`}>{comparison.sourceLine}</p>
      <p className={`${styles.sources} ${styles.mobileOnly}`}>{comparison.mobileSourceLine}</p>
    </section>
  );
}

function FaqSection({ copy }: Readonly<{ copy: ProductionSchedulePageCopy["faq"] }>): JSX.Element {
  const headingId = "production-schedule-faq-title";

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingId}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.description}</p>
      </div>
      <ul className={styles.faqList}>
        {copy.items.map((item) => (
          <li className={styles.faqItem} key={item.question}>
            <h3 className={styles.cardTitle}>{item.question}</h3>
            <p className={styles.cardBody}>{item.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CtaSection({ copy }: Readonly<{ copy: ProductionSchedulePageCopy["cta"] }>): JSX.Element {
  const headingId = "production-schedule-cta-title";

  return (
    <section aria-labelledby={headingId} className={styles.cta}>
      <div className={styles.ctaCopy}>
        <h2 className={styles.sectionTitle} id={headingId}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.description}</p>
      </div>
      <a className={styles.ctaAction} href={`#${CALCULATOR_ID}`}>
        {copy.actionLabel}
      </a>
    </section>
  );
}

export function ProductionSchedulePage({ locale }: ProductionSchedulePageProperties): JSX.Element {
  if (locale !== "en" && locale !== "zh-CN") {
    throw new Error(`Unsupported production schedule page locale: ${JSON.stringify(locale)}.`);
  }

  const copy = getProductionSchedulePageCopy(locale);
  const media = getProductionScheduleCaseMedia(locale);
  assertSchedulePage(copy, media);

  const routeCopy = getPlanningToolRouteCopy(locale, "production-schedule");

  return (
    <article className={styles.page} data-production-schedule-page={locale}>
      <SimpleHero
        actionHref={`#${CALCULATOR_ID}`}
        copy={routeCopy.hero}
        locale={locale}
        titleId="production-schedule-page-hero"
      />
      <section className={styles.calculator} id={CALCULATOR_ID} tabIndex={-1}>
        <ProductionPlannerTool locale={locale} view="schedule" />
      </section>
      <HeroSection copy={copy.hero} />
      <CaseSection copy={copy.caseStudy} media={media} />
      <FeatureSection copy={copy.features} />
      <StepsSection copy={copy.steps} />
      <ComparisonSection comparison={copy.comparison} />
      <FaqSection copy={copy.faq} />
      <CtaSection copy={copy.cta} />
    </article>
  );
}
