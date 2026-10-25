"use client";

import type { JSX, MouseEvent } from "react";

import { Faq1 } from "../../components/faq-1";
import {
  getKegCountPageCopy,
  type KegCountComparisonRow,
  type KegCountPageCopy,
} from "../../i18n/keg-count-page-copy";
import { getPlanningToolRouteCopy } from "../../i18n/planning-tool-route-copy";
import type { PublicLocale } from "../../i18n/public-locale";
import type { KegCapacityPlanHandoff } from "../../workshop-tools/keg-capacity";
import { HowItWorks09 } from "../how-it-works-09";
import { createKegCapacityProductionPlan } from "../planning-tool-handoff";
import { createProductionPlanIncomingHref } from "../production/production-plan-handoff";
import { SimpleHero } from "../simple-hero";
import { KegCapacityTool } from "../workshop/keg-capacity-tool";
import { getKegCountCaseImagePaths } from "./keg-count-case-media";
import styles from "./keg-count-page.module.css";

const FEATURE_COUNT = 3;
const STEP_COUNT = 3;
const COMPARISON_COLUMN_COUNT = 3;
const COMPARISON_ROW_COUNT = 4;
const FAQ_COUNT = 4;
const CASE_RESULT_COUNT = 5;
const CASE_IMAGE_WIDTH = 512;
const CASE_ROW_COUNT = 4;
const KEG_COUNT_CALCULATOR_ID = "keg-count-calculator";
const SOURCE_SEPARATOR = " · ";

export type KegCountPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireText(value: string, fieldPath: string): void {
  if (value.trim().length === 0) {
    throw new Error(
      `KegCountPage ${fieldPath} must be a non-empty string, received ${JSON.stringify(value)}.`,
    );
  }
}

function requireCount(actualCount: number, expectedCount: number, fieldPath: string): void {
  if (actualCount !== expectedCount) {
    throw new Error(
      `KegCountPage ${fieldPath} must contain ${expectedCount} items, received ${actualCount}.`,
    );
  }
}

function requireHttpsHref(href: string, fieldPath: string): void {
  if (!href.startsWith("https://")) {
    throw new Error(
      `KegCountPage ${fieldPath} must be an https URL, received ${JSON.stringify(href)}.`,
    );
  }
}

function assertComparisonRow(row: KegCountComparisonRow, rowIndex: number): void {
  requireText(row.label, `comparison.rows[${rowIndex}].label`);
  requireCount(row.values.length, COMPARISON_COLUMN_COUNT, `comparison.rows[${rowIndex}].values`);
  row.values.forEach((value, valueIndex) => {
    requireText(value, `comparison.rows[${rowIndex}].values[${valueIndex}]`);
  });

  if (row.mobileValues === undefined) {
    return;
  }

  requireCount(
    row.mobileValues.length,
    COMPARISON_COLUMN_COUNT,
    `comparison.rows[${rowIndex}].mobileValues`,
  );
  row.mobileValues.forEach((value, valueIndex) => {
    requireText(value, `comparison.rows[${rowIndex}].mobileValues[${valueIndex}]`);
  });
}

function assertKegCountPageCopy(copy: KegCountPageCopy, locale: PublicLocale): void {
  requireText(copy.hero.eyebrow, "hero.eyebrow");
  requireText(copy.hero.title, "hero.title");
  requireText(copy.hero.description, "hero.description");
  requireText(copy.hero.note, "hero.note");

  requireText(copy.caseStudy.eyebrow, "caseStudy.eyebrow");
  requireText(copy.caseStudy.title, "caseStudy.title");
  requireText(copy.caseStudy.description, "caseStudy.description");
  requireText(copy.caseStudy.desktopResultTitle, "caseStudy.desktopResultTitle");
  requireText(copy.caseStudy.mobileResultTitle, "caseStudy.mobileResultTitle");
  requireText(copy.caseStudy.disclaimer, "caseStudy.disclaimer");
  requireCount(copy.caseStudy.results.length, CASE_RESULT_COUNT, "caseStudy.results");
  copy.caseStudy.results.forEach((result, resultIndex) => {
    requireText(result, `caseStudy.results[${resultIndex}]`);
  });

  requireText(copy.features.eyebrow, "features.eyebrow");
  requireText(copy.features.title, "features.title");
  requireText(copy.features.description, "features.description");
  requireCount(copy.features.items.length, FEATURE_COUNT, "features.items");
  copy.features.items.forEach((item, itemIndex) => {
    requireText(item.title, `features.items[${itemIndex}].title`);
    requireText(item.body, `features.items[${itemIndex}].body`);
  });

  requireText(copy.steps.eyebrow, "steps.eyebrow");
  requireText(copy.steps.title, "steps.title");
  requireText(copy.steps.description, "steps.description");
  requireCount(copy.steps.items.length, STEP_COUNT, "steps.items");
  copy.steps.items.forEach((item, itemIndex) => {
    requireText(item.number, `steps.items[${itemIndex}].number`);
    requireText(item.title, `steps.items[${itemIndex}].title`);
    requireText(item.body, `steps.items[${itemIndex}].body`);
  });

  requireText(copy.comparison.eyebrow, "comparison.eyebrow");
  requireText(copy.comparison.title, "comparison.title");
  requireText(copy.comparison.desktopDescription, "comparison.desktopDescription");
  requireText(copy.comparison.mobileDescription, "comparison.mobileDescription");
  requireText(copy.comparison.cornerLabel, "comparison.cornerLabel");
  requireText(copy.comparison.mobileSources, "comparison.mobileSources");
  requireCount(copy.comparison.columns.length, COMPARISON_COLUMN_COUNT, "comparison.columns");
  requireCount(copy.comparison.rows.length, COMPARISON_ROW_COUNT, "comparison.rows");

  const expectedComparisonColumn = locale === "en" ? "Our keg count" : "本站小桶数量";
  if (copy.comparison.columns[0] !== expectedComparisonColumn) {
    throw new Error(
      `KegCountPage comparison.columns[0] must be ${JSON.stringify(expectedComparisonColumn)} for locale ${JSON.stringify(locale)}, received ${JSON.stringify(copy.comparison.columns[0])}.`,
    );
  }

  copy.comparison.columns.forEach((column, columnIndex) => {
    requireText(column, `comparison.columns[${columnIndex}]`);
  });
  copy.comparison.rows.forEach(assertComparisonRow);
  copy.comparison.desktopSources.forEach((source, sourceIndex) => {
    requireText(source.label, `comparison.desktopSources[${sourceIndex}].label`);
    requireHttpsHref(source.href, `comparison.desktopSources[${sourceIndex}].href`);
  });

  requireText(copy.faq.eyebrow, "faq.eyebrow");
  requireText(copy.faq.title, "faq.title");
  requireText(copy.faq.description, "faq.description");
  requireCount(copy.faq.items.length, FAQ_COUNT, "faq.items");
  copy.faq.items.forEach((item, itemIndex) => {
    requireText(item.question, `faq.items[${itemIndex}].question`);
    requireText(item.answer, `faq.items[${itemIndex}].answer`);
  });

  requireText(copy.cta.title, "cta.title");
  requireText(copy.cta.description, "cta.description");
  requireText(copy.cta.actionLabel, "cta.actionLabel");
}

function focusKegCountCalculator(calculatorId: string): void {
  const calculatorTarget = document.getElementById(calculatorId);
  if (calculatorTarget === null) {
    throw new Error(`KegCountPage could not find calculator target "#${calculatorId}".`);
  }

  const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

  calculatorTarget.focus({ preventScroll: true });
  calculatorTarget.scrollIntoView({ behavior: scrollBehavior, block: "start" });
}

function handleKegCountCtaClick(event: MouseEvent<HTMLAnchorElement>): void {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  focusKegCountCalculator(KEG_COUNT_CALCULATOR_ID);
}

function openKegCountProductionPlan(locale: PublicLocale, handoff: KegCapacityPlanHandoff): void {
  const productionPlan = createKegCapacityProductionPlan(handoff);
  window.location.assign(createProductionPlanIncomingHref(locale, productionPlan));
}

function ComparisonCellText({
  desktopValue,
  mobileValue,
}: Readonly<{
  desktopValue: string;
  mobileValue: string | undefined;
}>): JSX.Element {
  if (mobileValue === undefined || mobileValue === desktopValue) {
    return <>{desktopValue}</>;
  }

  return (
    <>
      <span className={styles.desktopText}>{desktopValue}</span>
      <span className={styles.mobileText}>{mobileValue}</span>
    </>
  );
}

function HeroSection({ copy }: Readonly<{ copy: KegCountPageCopy["hero"] }>): JSX.Element {
  const headingId = "keg-count-hero-title";

  return (
    <section aria-labelledby={headingId} className={styles.hero}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
      </div>
      <p className={styles.lede}>{copy.description}</p>
      <p className={styles.note}>{copy.note}</p>
    </section>
  );
}

function CaseImage({ src }: Readonly<{ src: string }>): JSX.Element {
  if (src.trim().length === 0) {
    throw new Error(
      `KegCountPage case image src must be a non-empty string, received ${JSON.stringify(src)}.`,
    );
  }

  return (
    <img alt="" className={styles.caseImage} loading="lazy" src={src} width={CASE_IMAGE_WIDTH} />
  );
}

function CaseResultCopy({ copy }: Readonly<{ copy: KegCountPageCopy["caseStudy"] }>): JSX.Element {
  return (
    <>
      <h3 className={styles.resultTitle}>
        <span className={styles.desktopText}>{copy.desktopResultTitle}</span>
        <span className={styles.mobileText}>{copy.mobileResultTitle}</span>
      </h3>
      <ul className={styles.resultList}>
        {copy.results.map((result) => (
          <li key={result}>{result}</li>
        ))}
      </ul>
      <p className={`${styles.disclaimer} ${styles.desktopText}`}>{copy.disclaimer}</p>
    </>
  );
}

function CaseFeatureCopy({
  item,
}: Readonly<{ item: KegCountPageCopy["features"]["items"][number] }>): JSX.Element {
  return (
    <>
      <h3 className={styles.caseFeatureTitle}>{item.title}</h3>
      <p className={styles.caseFeatureBody}>{item.body}</p>
    </>
  );
}

function CaseRow({
  children,
  imageOnRight,
  imageSrc,
}: Readonly<{
  children: JSX.Element;
  imageOnRight: boolean;
  imageSrc: string;
}>): JSX.Element {
  return (
    <div className={styles.caseRow} data-case-image={imageOnRight ? "end" : "start"}>
      <CaseImage src={imageSrc} />
      <div className={styles.caseCopy}>{children}</div>
    </div>
  );
}

function requireCaseImagePath(imagePath: string | undefined, rowNumber: number): string {
  if (typeof imagePath !== "string" || imagePath.trim().length === 0) {
    throw new Error(
      `KegCountPage case row ${rowNumber} image path must be a non-empty string, received ${JSON.stringify(imagePath)}.`,
    );
  }

  return imagePath;
}

function requireCaseFeatureItem(
  featureItems: KegCountPageCopy["features"]["items"],
  itemIndex: number,
): KegCountPageCopy["features"]["items"][number] {
  const featureItem = featureItems[itemIndex];
  if (featureItem === undefined) {
    throw new Error(
      `KegCountPage case feature item at index ${itemIndex} is missing, received ${featureItems.length} items.`,
    );
  }

  return featureItem;
}

function CaseSection({
  copy,
  featureItems,
  imagePaths,
}: Readonly<{
  copy: KegCountPageCopy["caseStudy"];
  featureItems: KegCountPageCopy["features"]["items"];
  imagePaths: readonly string[];
}>): JSX.Element {
  if (imagePaths.length !== CASE_ROW_COUNT) {
    throw new Error(
      `KegCountPage case image paths must contain ${CASE_ROW_COUNT} items, received ${imagePaths.length}.`,
    );
  }

  const headingId = "keg-count-case-title";
  const firstFeature = requireCaseFeatureItem(featureItems, 0);
  const secondFeature = requireCaseFeatureItem(featureItems, 1);
  const thirdFeature = requireCaseFeatureItem(featureItems, 2);

  return (
    <section aria-labelledby={headingId} className={styles.caseStudy}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
      </div>
      <p className={styles.caseDescription}>{copy.description}</p>
      <div className={styles.caseRows}>
        <CaseRow imageOnRight={false} imageSrc={requireCaseImagePath(imagePaths[0], 1)}>
          <CaseResultCopy copy={copy} />
        </CaseRow>
        <CaseRow imageOnRight imageSrc={requireCaseImagePath(imagePaths[1], 2)}>
          <CaseFeatureCopy item={firstFeature} />
        </CaseRow>
        <CaseRow imageOnRight={false} imageSrc={requireCaseImagePath(imagePaths[2], 3)}>
          <CaseFeatureCopy item={secondFeature} />
        </CaseRow>
        <CaseRow imageOnRight imageSrc={requireCaseImagePath(imagePaths[3], 4)}>
          <CaseFeatureCopy item={thirdFeature} />
        </CaseRow>
      </div>
    </section>
  );
}

function FeatureSection({ copy }: Readonly<{ copy: KegCountPageCopy["features"] }>): JSX.Element {
  const headingId = "keg-count-features-title";

  return (
    <section aria-labelledby={headingId} className={styles.featureSection}>
      <div className={styles.centeredBlock}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
        <p className={styles.centeredDescription}>{copy.description}</p>
      </div>
      <ul className={styles.featureGrid}>
        {copy.items.map((item) => (
          <li className={styles.introCard} key={item.title}>
            <h3>{item.title}</h3>
            <p className={styles.cardBody}>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StepsSection({
  actionLabel,
  copy,
}: Readonly<{
  actionLabel: string;
  copy: KegCountPageCopy["steps"];
}>): JSX.Element {
  return (
    <div className={styles.stepsBlock}>
      <p className={styles.stepsDescription}>{copy.description}</p>
      <HowItWorks09
        cta={{
          label: actionLabel,
          onClick: () => {
            focusKegCountCalculator(KEG_COUNT_CALCULATOR_ID);
          },
        }}
        eyebrow={copy.eyebrow}
        steps={copy.items}
        title={copy.title}
      />
    </div>
  );
}

function ComparisonTable({
  comparison,
}: Readonly<{ comparison: KegCountPageCopy["comparison"] }>): JSX.Element {
  const headingId = "keg-count-comparison-title";

  return (
    <div aria-labelledby={headingId} className={styles.tableScroller} role="region" tabIndex={0}>
      <table className={styles.comparisonTable}>
        <thead>
          <tr>
            <th scope="col">{comparison.cornerLabel}</th>
            {comparison.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.values.map((value, valueIndex) => (
                <td key={`${row.label}-${valueIndex}`}>
                  <ComparisonCellText
                    desktopValue={value}
                    mobileValue={row.mobileValues?.[valueIndex]}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonSourceLinks({
  sources,
}: Readonly<{ sources: KegCountPageCopy["comparison"]["desktopSources"] }>): JSX.Element | null {
  if (sources.length === 0) {
    return null;
  }

  return (
    <p className={`${styles.sources} ${styles.desktopText}`}>
      {sources.map((source, sourceIndex) => (
        <span key={source.href}>
          {sourceIndex === 0 ? null : SOURCE_SEPARATOR}
          <a href={source.href} rel="noreferrer noopener" target="_blank">
            {source.label}
          </a>
        </span>
      ))}
    </p>
  );
}

function ComparisonMobileSourceLine({
  mobileSources,
}: Readonly<{ mobileSources: string }>): JSX.Element | null {
  if (mobileSources.trim().length === 0) {
    return null;
  }

  return <p className={`${styles.sources} ${styles.mobileText}`}>{mobileSources}</p>;
}

function ComparisonSources({
  comparison,
}: Readonly<{ comparison: KegCountPageCopy["comparison"] }>): JSX.Element {
  return (
    <>
      <ComparisonSourceLinks sources={comparison.desktopSources} />
      <ComparisonMobileSourceLine mobileSources={comparison.mobileSources} />
    </>
  );
}

function ComparisonSection({
  copy,
}: Readonly<{ copy: KegCountPageCopy["comparison"] }>): JSX.Element {
  const headingId = "keg-count-comparison-title";

  return (
    <section aria-labelledby={headingId} className={styles.comparison}>
      <div className={`${styles.centeredBlock} ${styles.narrowBlock}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 id={headingId}>{copy.title}</h2>
        <p className={`${styles.comparisonDescription} ${styles.desktopText}`}>
          {copy.desktopDescription}
        </p>
        <p className={`${styles.comparisonDescription} ${styles.mobileText}`}>
          {copy.mobileDescription}
        </p>
      </div>
      <ComparisonTable comparison={copy} />
      <ComparisonSources comparison={copy} />
    </section>
  );
}

function FaqSection({ copy }: Readonly<{ copy: KegCountPageCopy["faq"] }>): JSX.Element {
  return (
    <div className={styles.faqSlot}>
      <Faq1 {...copy} className={styles.faq} />
    </div>
  );
}

function CtaSection({ copy }: Readonly<{ copy: KegCountPageCopy["cta"] }>): JSX.Element {
  const headingId = "keg-count-cta-title";

  return (
    <section aria-labelledby={headingId} className={styles.finalCallToAction}>
      <div className={styles.ctaCopy}>
        <h2 id={headingId}>{copy.title}</h2>
        <p className={styles.ctaDescription}>{copy.description}</p>
      </div>
      <a
        className={styles.ctaAction}
        href={`#${KEG_COUNT_CALCULATOR_ID}`}
        onClick={handleKegCountCtaClick}
      >
        {copy.actionLabel}
      </a>
    </section>
  );
}

export function KegCountPage({ locale }: KegCountPageProperties): JSX.Element {
  const copy = getKegCountPageCopy(locale);
  const routeCopy = getPlanningToolRouteCopy(locale, "keg-count");
  const caseImagePaths = getKegCountCaseImagePaths(locale);

  assertKegCountPageCopy(copy, locale);

  return (
    <article className={styles.page} data-keg-count-page={locale}>
      <SimpleHero
        actionHref={`#${KEG_COUNT_CALCULATOR_ID}`}
        copy={routeCopy.hero}
        locale={locale}
        titleId="keg-count-page-hero"
      />
      <div className={styles.calculator} id={KEG_COUNT_CALCULATOR_ID} tabIndex={-1}>
        <KegCapacityTool
          locale={locale}
          onTestProductionPlan={(handoff) => openKegCountProductionPlan(locale, handoff)}
        />
      </div>
      <div className={styles.guide}>
        <HeroSection copy={copy.hero} />
        <CaseSection
          copy={copy.caseStudy}
          featureItems={copy.features.items}
          imagePaths={caseImagePaths}
        />
        <FeatureSection copy={copy.features} />
        <StepsSection actionLabel={copy.cta.actionLabel} copy={copy.steps} />
        <ComparisonSection copy={copy.comparison} />
        <FaqSection copy={copy.faq} />
        <CtaSection copy={copy.cta} />
      </div>
    </article>
  );
}
