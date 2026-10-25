"use client";

import type { JSX } from "react";

import type { TodayProcessingListPageCopy } from "../../i18n/today-processing-list-page-copy";
import { getTodayProcessingListPageCopy } from "../../i18n/today-processing-list-page-copy";
import { getPlanningToolRouteCopy } from "../../i18n/planning-tool-route-copy";
import type { PublicLocale } from "../../i18n/public-locale";
import { ProductionPlannerTool } from "../production/production-planner-tool";
import { SimpleHero } from "../simple-hero";
import {
  getTodayProcessingListCaseMedia,
  type TodayProcessingListCaseImage,
  type TodayProcessingListCaseMedia,
} from "./today-processing-list-case-media";
import styles from "./today-processing-list-page.module.css";

const CASE_RESULT_COUNT = 3;
const FEATURE_COUNT = 3;
const STEP_COUNT = 3;
const STEP_NUMBERS = ["01", "02", "03"] as const;
const COMPARISON_PRODUCT_COUNT = 3;
const COMPARISON_ROW_COUNT = 4;
const COMPARISON_SOURCE_COUNT = 5;
const FAQ_COUNT = 4;
const DESKTOP_CASE_IMAGE_WIDTH = 556;
const DESKTOP_CASE_IMAGE_HEIGHT = 417;
const MOBILE_CASE_IMAGE_WIDTH = 312;
const MOBILE_CASE_IMAGE_HEIGHT = 234;
const MOBILE_IMAGE_MEDIA = "(max-width: 700px)";
const TODAY_PROCESSING_LIST_CALCULATOR_ID = "today-processing-list-calculator";

const headingIds = {
  hero: "today-processing-list-hero-title",
  caseStudy: "today-processing-list-case-title",
  caseResult: "today-processing-list-case-result-title",
  features: "today-processing-list-features-title",
  steps: "today-processing-list-steps-title",
  comparison: "today-processing-list-comparison-title",
  faq: "today-processing-list-faq-title",
  callToAction: "today-processing-list-call-to-action-title",
} as const;

export type TodayProcessingListPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireNonEmpty(value: string, fieldPath: string): void {
  if (value.trim().length === 0) {
    throw new Error(
      `TodayProcessingListPage ${fieldPath} must be a non-empty string, received ${JSON.stringify(value)}.`,
    );
  }
}

function requireCount(actualCount: number, expectedCount: number, fieldPath: string): void {
  if (actualCount !== expectedCount) {
    throw new Error(
      `TodayProcessingListPage ${fieldPath} must contain ${expectedCount} items, received ${actualCount}.`,
    );
  }
}

function requireHttpsUrl(value: string, fieldPath: string): void {
  if (!value.startsWith("https://")) {
    throw new Error(
      `TodayProcessingListPage ${fieldPath} must be an https URL, received ${JSON.stringify(value)}.`,
    );
  }
}

function requireDifferentText(value: string, otherValue: string, fieldPath: string): void {
  if (value === otherValue) {
    throw new Error(
      `TodayProcessingListPage ${fieldPath} must differ from ${JSON.stringify(otherValue)}.`,
    );
  }
}

function requireImage(image: TodayProcessingListCaseImage, fieldPath: string): void {
  requireNonEmpty(image.src, `${fieldPath}.src`);

  if (!Number.isInteger(image.width) || image.width <= 0 || !Number.isInteger(image.height) || image.height <= 0) {
    throw new Error(
      `TodayProcessingListPage ${fieldPath} must have positive integer dimensions, received width ${JSON.stringify(image.width)} and height ${JSON.stringify(image.height)}.`,
    );
  }
}

function requireImageSize(
  image: TodayProcessingListCaseImage,
  width: number,
  height: number,
  fieldPath: string,
): void {
  if (image.width !== width || image.height !== height) {
    throw new Error(
      `TodayProcessingListPage ${fieldPath} must be ${width} by ${height}, received width ${JSON.stringify(image.width)} and height ${JSON.stringify(image.height)}.`,
    );
  }
}

function requireUniqueLabels(labels: readonly string[], fieldPath: string): void {
  const seenLabels = new Set<string>();

  labels.forEach((label) => {
    if (seenLabels.has(label)) {
      throw new Error(
        `TodayProcessingListPage ${fieldPath} contains duplicate ${JSON.stringify(label)}.`,
      );
    }

    seenLabels.add(label);
  });
}

function assertHeroCopy(hero: TodayProcessingListPageCopy["hero"]): void {
  requireNonEmpty(hero.title, "hero.title");
  requireNonEmpty(hero.body, "hero.body");
  requireNonEmpty(hero.note, "hero.note");
}

function assertCaseStudyCopy(caseStudy: TodayProcessingListPageCopy["caseStudy"]): void {
  requireNonEmpty(caseStudy.eyebrow, "caseStudy.eyebrow");
  requireNonEmpty(caseStudy.title, "caseStudy.title");
  requireNonEmpty(caseStudy.example, "caseStudy.example");
  requireNonEmpty(caseStudy.resultTitle, "caseStudy.resultTitle");
  requireNonEmpty(caseStudy.disclaimer, "caseStudy.disclaimer");
  requireNonEmpty(caseStudy.mobileCaption, "caseStudy.mobileCaption");
  requireDifferentText(caseStudy.mobileCaption, caseStudy.resultTitle, "caseStudy.mobileCaption");
  requireDifferentText(caseStudy.mobileCaption, caseStudy.disclaimer, "caseStudy.mobileCaption");
  requireCount(caseStudy.results.length, CASE_RESULT_COUNT, "caseStudy.results");
  caseStudy.results.forEach((result, resultIndex) => {
    requireNonEmpty(result, `caseStudy.results[${resultIndex}]`);
  });
  requireUniqueLabels(caseStudy.results, "caseStudy.results");
}

function assertFeatureCopy(features: TodayProcessingListPageCopy["features"]): void {
  requireNonEmpty(features.eyebrow, "features.eyebrow");
  requireNonEmpty(features.title, "features.title");
  requireNonEmpty(features.description, "features.description");
  requireCount(features.items.length, FEATURE_COUNT, "features.items");
  features.items.forEach((feature, featureIndex) => {
    requireNonEmpty(feature.title, `features.items[${featureIndex}].title`);
    requireNonEmpty(feature.body, `features.items[${featureIndex}].body`);
  });
  requireUniqueLabels(features.items.map((feature) => feature.title), "features.items.title");
}

function assertStepCopy(steps: TodayProcessingListPageCopy["steps"]): void {
  requireNonEmpty(steps.eyebrow, "steps.eyebrow");
  requireNonEmpty(steps.title, "steps.title");
  requireNonEmpty(steps.description, "steps.description");
  requireCount(steps.items.length, STEP_COUNT, "steps.items");
  steps.items.forEach((step, stepIndex) => {
    const expectedNumber = STEP_NUMBERS[stepIndex];
    requireNonEmpty(step.number, `steps.items[${stepIndex}].number`);
    requireNonEmpty(step.title, `steps.items[${stepIndex}].title`);
    requireNonEmpty(step.body, `steps.items[${stepIndex}].body`);

    if (step.number !== expectedNumber) {
      throw new Error(
        `TodayProcessingListPage steps.items[${stepIndex}].number must be ${JSON.stringify(expectedNumber)}, received ${JSON.stringify(step.number)}.`,
      );
    }
  });
  requireUniqueLabels(steps.items.map((step) => step.title), "steps.items.title");
}

function assertComparisonRowsMatchProducts(
  comparison: TodayProcessingListPageCopy["comparison"],
): void {
  comparison.rows.forEach((row, rowIndex) => {
    if (row.values.length !== comparison.products.length) {
      throw new Error(
        `TodayProcessingListPage comparison.rows[${rowIndex}] ${JSON.stringify(row.label)} has ${row.values.length} values; expected ${comparison.products.length} for products ${JSON.stringify(comparison.products)}.`,
      );
    }
  });
}

function assertComparisonCopy(comparison: TodayProcessingListPageCopy["comparison"]): void {
  requireNonEmpty(comparison.eyebrow, "comparison.eyebrow");
  requireNonEmpty(comparison.title, "comparison.title");
  requireNonEmpty(comparison.description, "comparison.description");
  requireNonEmpty(comparison.mobileDescription, "comparison.mobileDescription");
  requireDifferentText(comparison.mobileDescription, comparison.description, "comparison.mobileDescription");
  requireNonEmpty(comparison.cornerLabel, "comparison.cornerLabel");
  requireNonEmpty(comparison.sourceSeparator, "comparison.sourceSeparator");
  requireNonEmpty(comparison.mobileSourceLine, "comparison.mobileSourceLine");
  requireCount(comparison.products.length, COMPARISON_PRODUCT_COUNT, "comparison.products");
  requireCount(comparison.rows.length, COMPARISON_ROW_COUNT, "comparison.rows");
  requireCount(comparison.sources.length, COMPARISON_SOURCE_COUNT, "comparison.sources");
  comparison.products.forEach((product, productIndex) => {
    requireNonEmpty(product, `comparison.products[${productIndex}]`);
  });
  comparison.rows.forEach((row, rowIndex) => {
    requireNonEmpty(row.label, `comparison.rows[${rowIndex}].label`);
    row.values.forEach((value, valueIndex) => {
      requireNonEmpty(value, `comparison.rows[${rowIndex}].values[${valueIndex}]`);
    });
  });
  comparison.sources.forEach((source, sourceIndex) => {
    requireNonEmpty(source.label, `comparison.sources[${sourceIndex}].label`);
    requireHttpsUrl(source.href, `comparison.sources[${sourceIndex}].href`);
  });
  requireUniqueLabels(comparison.products, "comparison.products");
  requireUniqueLabels(comparison.rows.map((row) => row.label), "comparison.rows.label");
  requireUniqueLabels(comparison.sources.map((source) => source.href), "comparison.sources.href");
  assertComparisonRowsMatchProducts(comparison);
}

function assertFaqCopy(faq: TodayProcessingListPageCopy["faq"]): void {
  requireNonEmpty(faq.eyebrow, "faq.eyebrow");
  requireNonEmpty(faq.title, "faq.title");
  requireNonEmpty(faq.description, "faq.description");
  requireCount(faq.items.length, FAQ_COUNT, "faq.items");
  faq.items.forEach((item, itemIndex) => {
    requireNonEmpty(item.question, `faq.items[${itemIndex}].question`);
    requireNonEmpty(item.answer, `faq.items[${itemIndex}].answer`);
  });
  requireUniqueLabels(faq.items.map((item) => item.question), "faq.items.question");
}

function assertCallToActionCopy(callToAction: TodayProcessingListPageCopy["callToAction"]): void {
  requireNonEmpty(callToAction.title, "callToAction.title");
  requireNonEmpty(callToAction.body, "callToAction.body");
  requireNonEmpty(callToAction.actionLabel, "callToAction.actionLabel");
}

function assertCaseMedia(caseMedia: TodayProcessingListCaseMedia): void {
  requireImage(caseMedia.desktop, "caseMedia.desktop");
  requireImage(caseMedia.mobile, "caseMedia.mobile");
  requireImageSize(caseMedia.desktop, DESKTOP_CASE_IMAGE_WIDTH, DESKTOP_CASE_IMAGE_HEIGHT, "caseMedia.desktop");
  requireImageSize(caseMedia.mobile, MOBILE_CASE_IMAGE_WIDTH, MOBILE_CASE_IMAGE_HEIGHT, "caseMedia.mobile");

  if (caseMedia.desktop.src === caseMedia.mobile.src) {
    throw new Error(
      `TodayProcessingListPage case media must use separate desktop and mobile paths, received ${JSON.stringify(caseMedia.desktop.src)}.`,
    );
  }
}

function assertTodayProcessingListPageContent(
  copy: TodayProcessingListPageCopy,
  caseMedia: TodayProcessingListCaseMedia,
): void {
  assertHeroCopy(copy.hero);
  assertCaseStudyCopy(copy.caseStudy);
  assertFeatureCopy(copy.features);
  assertStepCopy(copy.steps);
  assertComparisonCopy(copy.comparison);
  assertFaqCopy(copy.faq);
  assertCallToActionCopy(copy.callToAction);
  assertCaseMedia(caseMedia);
}

function readCalculatorScrollBehavior(): ScrollBehavior {
  if (typeof window.matchMedia !== "function") {
    throw new Error(
      "TodayProcessingListPage cannot scroll to the calculator because window.matchMedia is unavailable.",
    );
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function focusTodayProcessingListCalculator(): void {
  const calculatorTarget = document.getElementById(TODAY_PROCESSING_LIST_CALCULATOR_ID);
  if (calculatorTarget === null) {
    throw new Error(
      `TodayProcessingListPage could not find calculator target "#${TODAY_PROCESSING_LIST_CALCULATOR_ID}".`,
    );
  }

  calculatorTarget.focus({ preventScroll: true });
  calculatorTarget.scrollIntoView({
    behavior: readCalculatorScrollBehavior(),
    block: "start",
  });
}

function HeroSection({
  copy,
}: Readonly<{ copy: TodayProcessingListPageCopy["hero"] }>): JSX.Element {
  return (
    <header className={styles.hero}>
      <h2 className={styles.heroTitle} id={headingIds.hero}>
        {copy.title}
      </h2>
      <p className={styles.heroBody}>{copy.body}</p>
      <p className={styles.heroNote}>{copy.note}</p>
    </header>
  );
}

function CalculatorSection({ locale }: Readonly<{ locale: PublicLocale }>): JSX.Element {
  return (
    <div className={styles.calculator} id={TODAY_PROCESSING_LIST_CALCULATOR_ID} tabIndex={-1}>
      <ProductionPlannerTool locale={locale} view="today" />
    </div>
  );
}

function CaseScreenshot({
  caseMedia,
}: Readonly<{ caseMedia: TodayProcessingListCaseMedia }>): JSX.Element {
  return (
    <div className={styles.caseMedia}>
      <picture>
        <source
          height={caseMedia.mobile.height}
          media={MOBILE_IMAGE_MEDIA}
          srcSet={caseMedia.mobile.src}
          width={caseMedia.mobile.width}
        />
        <img
          alt=""
          className={styles.caseImage}
          height={caseMedia.desktop.height}
          loading="lazy"
          src={caseMedia.desktop.src}
          width={caseMedia.desktop.width}
        />
      </picture>
    </div>
  );
}

function CaseSection({
  caseMedia,
  copy,
}: Readonly<{
  caseMedia: TodayProcessingListCaseMedia;
  copy: TodayProcessingListPageCopy["caseStudy"];
}>): JSX.Element {
  return (
    <section aria-labelledby={headingIds.caseStudy} className={styles.caseStudy}>
      <div className={`${styles.sectionIntro} ${styles.caseIntro}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingIds.caseStudy}>
          {copy.title}
        </h2>
        <p className={styles.caseExample}>{copy.example}</p>
      </div>
      <div className={styles.caseLayout}>
        <CaseScreenshot caseMedia={caseMedia} />
        <div className={styles.caseResult}>
          <p className={`${styles.caseCaption} ${styles.mobileOnly}`}>{copy.mobileCaption}</p>
          <h3 className={`${styles.caseResultTitle} ${styles.desktopOnly}`} id={headingIds.caseResult}>
            {copy.resultTitle}
          </h3>
          <ul className={styles.caseResults}>
            {copy.results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
          <p className={`${styles.caseDisclaimer} ${styles.desktopOnly}`}>{copy.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

function FeatureSection({
  copy,
}: Readonly<{ copy: TodayProcessingListPageCopy["features"] }>): JSX.Element {
  return (
    <section aria-labelledby={headingIds.features} className={styles.features}>
      <div className={`${styles.sectionIntro} ${styles.featureIntro}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingIds.features}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.description}</p>
      </div>
      <ul className={styles.featureGrid}>
        {copy.items.map((feature) => (
          <li className={styles.featureCard} key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StepsSection({
  copy,
}: Readonly<{ copy: TodayProcessingListPageCopy["steps"] }>): JSX.Element {
  return (
    <section aria-labelledby={headingIds.steps} className={styles.steps}>
      <div className={`${styles.sectionIntro} ${styles.stepIntro}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingIds.steps}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.description}</p>
      </div>
      <div className={styles.stepBoard}>
        <div aria-hidden="true" className={styles.stepConnector} />
        <ol className={styles.stepList}>
          {copy.items.map((step) => (
            <li className={styles.step} key={step.number}>
              <p className={styles.stepNumber}>{step.number}</p>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ComparisonSources({
  separator,
  sources,
}: Readonly<{
  separator: string;
  sources: TodayProcessingListPageCopy["comparison"]["sources"];
}>): JSX.Element {
  return (
    <p className={`${styles.comparisonSources} ${styles.desktopOnly}`}>
      {sources.map((source, sourceIndex) => (
        <span key={source.href}>
          {sourceIndex > 0 ? separator : null}
          <a href={source.href} rel="noreferrer noopener" target="_blank">
            {source.label}
          </a>
        </span>
      ))}
    </p>
  );
}

function ComparisonTable({
  copy,
}: Readonly<{ copy: TodayProcessingListPageCopy["comparison"] }>): JSX.Element {
  return (
    <div
      aria-labelledby={headingIds.comparison}
      className={styles.comparisonTableRegion}
      role="region"
      tabIndex={0}
    >
      <table className={styles.comparisonTable}>
        <colgroup>
          <col className={styles.comparisonTaskColumn} />
          <col className={styles.comparisonOurColumn} />
          <col className={styles.comparisonValleyColumn} />
          <col className={styles.comparisonManualColumn} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">{copy.cornerLabel}</th>
            {copy.products.map((product) => (
              <th key={product} scope="col">
                {product}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {copy.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.values.map((value, valueIndex) => (
                <td key={`${row.label}-${copy.products[valueIndex]}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonCards({
  copy,
}: Readonly<{ copy: TodayProcessingListPageCopy["comparison"] }>): JSX.Element {
  return (
    <ul className={styles.comparisonCards}>
      {copy.rows.map((row) => (
        <li className={styles.comparisonCard} key={row.label}>
          <p className={styles.comparisonRowLabel}>{row.label}</p>
          <dl className={styles.comparisonFacts}>
            {row.values.map((value, valueIndex) => (
              <div className={styles.comparisonFact} key={`${row.label}-${copy.products[valueIndex]}`}>
                <dt>{copy.products[valueIndex]}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  );
}

function ComparisonSection({
  copy,
}: Readonly<{ copy: TodayProcessingListPageCopy["comparison"] }>): JSX.Element {
  return (
    <section aria-labelledby={headingIds.comparison} className={styles.comparison}>
      <div className={`${styles.sectionIntro} ${styles.comparisonIntro}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingIds.comparison}>
          {copy.title}
        </h2>
        <p className={`${styles.sectionDescription} ${styles.desktopOnly}`}>{copy.description}</p>
        <p className={`${styles.sectionDescription} ${styles.mobileOnly}`}>{copy.mobileDescription}</p>
      </div>
      <ComparisonTable copy={copy} />
      <ComparisonCards copy={copy} />
      <ComparisonSources separator={copy.sourceSeparator} sources={copy.sources} />
      <p className={`${styles.comparisonSources} ${styles.mobileOnly}`}>{copy.mobileSourceLine}</p>
    </section>
  );
}

function FaqSection({
  copy,
}: Readonly<{ copy: TodayProcessingListPageCopy["faq"] }>): JSX.Element {
  return (
    <section aria-labelledby={headingIds.faq} className={styles.faq}>
      <div className={`${styles.sectionIntro} ${styles.faqIntro}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingIds.faq}>
          {copy.title}
        </h2>
        <p className={styles.sectionDescription}>{copy.description}</p>
      </div>
      <ul className={styles.faqList}>
        {copy.items.map((item) => (
          <li className={styles.faqItem} key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CallToActionSection({
  copy,
}: Readonly<{ copy: TodayProcessingListPageCopy["callToAction"] }>): JSX.Element {
  return (
    <section aria-labelledby={headingIds.callToAction} className={styles.callToAction}>
      <div className={styles.callToActionCopy}>
        <h2 className={styles.callToActionTitle} id={headingIds.callToAction}>
          {copy.title}
        </h2>
        <p className={styles.callToActionBody}>{copy.body}</p>
      </div>
      <button
        className={styles.callToActionButton}
        onClick={focusTodayProcessingListCalculator}
        type="button"
      >
        {copy.actionLabel}
      </button>
    </section>
  );
}

export function TodayProcessingListPage({
  locale,
}: TodayProcessingListPageProperties): JSX.Element {
  const copy = getTodayProcessingListPageCopy(locale);
  const caseMedia = getTodayProcessingListCaseMedia(locale);
  assertTodayProcessingListPageContent(copy, caseMedia);

  const routeCopy = getPlanningToolRouteCopy(locale, "today-processing-list");

  return (
    <article className={styles.page} lang={locale}>
      <SimpleHero
        actionHref={`#${TODAY_PROCESSING_LIST_CALCULATOR_ID}`}
        copy={routeCopy.hero}
        locale={locale}
        titleId="today-processing-list-page-hero"
      />
      <CalculatorSection locale={locale} />
      <div className={styles.guide}>
        <HeroSection copy={copy.hero} />
        <CaseSection caseMedia={caseMedia} copy={copy.caseStudy} />
        <FeatureSection copy={copy.features} />
        <StepsSection copy={copy.steps} />
        <ComparisonSection copy={copy.comparison} />
        <FaqSection copy={copy.faq} />
        <CallToActionSection copy={copy.callToAction} />
      </div>
    </article>
  );
}
