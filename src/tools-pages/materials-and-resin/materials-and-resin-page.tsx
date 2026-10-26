"use client";

import type { JSX, MouseEvent } from "react";

import { Faq1 } from "../../components/faq-1";
import {
  getMaterialsAndResinPageCopy,
  type MaterialsAndResinComparisonRow,
  type MaterialsAndResinPageCopy,
} from "../../i18n/materials-and-resin-page-copy";
import { getPlanningToolRouteCopy } from "../../i18n/planning-tool-route-copy";
import type { PublicLocale } from "../../i18n/public-locale";
import { HowItWorks09 } from "../how-it-works-09";
import { SimpleHero } from "../simple-hero";
import { KegMaterialsTool } from "../workshop/keg-materials-tool";
import { getMaterialsAndResinCaseImagePath } from "./materials-and-resin-case-media";
import styles from "./materials-and-resin-page.module.css";

const FEATURE_COUNT = 3;
const STEP_COUNT = 3;
const COMPARISON_COLUMN_COUNT = 3;
const COMPARISON_ROW_COUNT = 4;
const FAQ_COUNT = 4;
const CASE_RESULT_COUNT = 2;
const MATERIALS_CALCULATOR_ID = "materials-and-resin-calculator";
const CASE_IMAGE_WIDTH = 512;
const CASE_IMAGE_HEIGHT = 652;

export type MaterialsAndResinPageProperties = Readonly<{
  locale: PublicLocale;
}>;

function requireText(value: string, fieldPath: string): void {
  if (value.trim().length === 0) {
    throw new Error(
      `MaterialsAndResinPage ${fieldPath} must be a non-empty string, received ${JSON.stringify(value)}.`,
    );
  }
}

function requireCount(actualCount: number, expectedCount: number, fieldPath: string): void {
  if (actualCount !== expectedCount) {
    throw new Error(
      `MaterialsAndResinPage ${fieldPath} must contain ${expectedCount} items, received ${actualCount}.`,
    );
  }
}

function assertComparisonRow(row: MaterialsAndResinComparisonRow, rowIndex: number): void {
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

function assertMaterialsAndResinPage(copy: MaterialsAndResinPageCopy, locale: PublicLocale): void {
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

  const expectedCurrentTool = locale === "en" ? "Our materials tool" : "本站材料与树脂";
  if (copy.comparison.columns[0] !== expectedCurrentTool) {
    throw new Error(
      `MaterialsAndResinPage comparison.columns[0] must be ${JSON.stringify(expectedCurrentTool)} for locale ${JSON.stringify(locale)}, received ${JSON.stringify(copy.comparison.columns[0])}.`,
    );
  }

  copy.comparison.columns.forEach((column, columnIndex) => {
    requireText(column, `comparison.columns[${columnIndex}]`);
  });
  copy.comparison.rows.forEach(assertComparisonRow);

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

function focusMaterialsCalculator(calculatorId: string): void {
  const calculatorTarget = document.getElementById(calculatorId);
  if (calculatorTarget === null) {
    throw new Error(
      `MaterialsAndResinPage could not find calculator target "#${calculatorId}".`,
    );
  }

  const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  calculatorTarget.focus({ preventScroll: true });
  calculatorTarget.scrollIntoView({ behavior: scrollBehavior, block: "start" });
}

function handleMaterialsCtaClick(event: MouseEvent<HTMLAnchorElement>): void {
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
  focusMaterialsCalculator(MATERIALS_CALCULATOR_ID);
}

function readComparisonValues(
  row: MaterialsAndResinComparisonRow,
  viewport: "desktop" | "mobile",
): readonly [string, string, string] {
  if (viewport === "mobile" && row.mobileValues !== undefined) {
    return row.mobileValues;
  }

  return row.values;
}

function HeroSection({ copy }: Readonly<{ copy: MaterialsAndResinPageCopy["hero"] }>): JSX.Element {
  const headingId = "materials-and-resin-hero-title";

  return (
    <section aria-labelledby={headingId} className={styles.hero}>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <h2 className={styles.heroTitle} id={headingId}>
        {copy.title}
      </h2>
      <p className={styles.lede}>{copy.description}</p>
      <p className={styles.note}>{copy.note}</p>
    </section>
  );
}

function readCaseImageSide(rowIndex: number): "left" | "right" {
  if (rowIndex % 2 === 0) {
    return "left";
  }

  return "right";
}

function CaseImage({ imagePath }: Readonly<{ imagePath: string }>): JSX.Element {
  return (
    <img
      alt=""
      className={styles.caseImage}
      height={CASE_IMAGE_HEIGHT}
      loading="lazy"
      src={imagePath}
      width={CASE_IMAGE_WIDTH}
    />
  );
}

function CaseRow({
  children,
  imagePath,
  imageSide,
}: Readonly<{
  children: JSX.Element;
  imagePath: string;
  imageSide: "left" | "right";
}>): JSX.Element {
  return (
    <div className={styles.caseRow} data-image-side={imageSide}>
      <div className={styles.caseRowImage}>
        <CaseImage imagePath={imagePath} />
      </div>
      <div className={styles.caseCopy}>{children}</div>
    </div>
  );
}

function CaseResultCopy({
  copy,
}: Readonly<{ copy: MaterialsAndResinPageCopy["caseStudy"] }>): JSX.Element {
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
}: Readonly<{
  item: MaterialsAndResinPageCopy["features"]["items"][number];
}>): JSX.Element {
  return (
    <>
      <h3 className={styles.resultTitle}>{item.title}</h3>
      <p className={styles.caseBody}>{item.body}</p>
    </>
  );
}

function CaseSection({
  copy,
  featureItems,
  imagePath,
}: Readonly<{
  copy: MaterialsAndResinPageCopy["caseStudy"];
  featureItems: MaterialsAndResinPageCopy["features"]["items"];
  imagePath: string;
}>): JSX.Element {
  const headingId = "materials-and-resin-case-title";

  return (
    <section aria-labelledby={headingId} className={styles.caseSection}>
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingId}>
          {copy.title}
        </h2>
      </div>
      <p className={styles.caseDescription}>{copy.description}</p>
      <div className={styles.caseRows}>
        <CaseRow imagePath={imagePath} imageSide={readCaseImageSide(0)}>
          <CaseResultCopy copy={copy} />
        </CaseRow>
        {featureItems.map((item, itemIndex) => (
          <CaseRow
            imagePath={imagePath}
            imageSide={readCaseImageSide(itemIndex + 1)}
            key={item.title}
          >
            <CaseFeatureCopy item={item} />
          </CaseRow>
        ))}
      </div>
    </section>
  );
}

function FeatureSection({
  copy,
}: Readonly<{ copy: MaterialsAndResinPageCopy["features"] }>): JSX.Element {
  const headingId = "materials-and-resin-features-title";

  return (
    <section aria-labelledby={headingId} className={styles.featureSection}>
      <div className={styles.centeredBlock}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingId}>
          {copy.title}
        </h2>
        <p className={styles.description}>{copy.description}</p>
      </div>
      <ul className={styles.featureGrid}>
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

function StepsSection({
  actionLabel,
  copy,
}: Readonly<{
  actionLabel: string;
  copy: MaterialsAndResinPageCopy["steps"];
}>): JSX.Element {
  return (
    <div className={styles.stepsSection}>
      <p className={styles.stepsDescription}>{copy.description}</p>
      <HowItWorks09
        cta={{
          label: actionLabel,
          onClick: () => {
            focusMaterialsCalculator(MATERIALS_CALCULATOR_ID);
          },
        }}
        eyebrow={copy.eyebrow}
        steps={copy.items.map((item) => ({
          number: item.number,
          title: item.title,
          body: item.body,
        }))}
        title={copy.title}
      />
    </div>
  );
}

function ComparisonTable({
  comparison,
}: Readonly<{ comparison: MaterialsAndResinPageCopy["comparison"] }>): JSX.Element {
  const headingId = "materials-and-resin-comparison-title";

  return (
    <div aria-labelledby={headingId} className={styles.tableScroller} role="region" tabIndex={0}>
      <table className={styles.comparisonTable}>
        <colgroup>
          <col className={styles.comparisonLabelColumn} />
          {comparison.columns.map((column) => (
            <col className={styles.comparisonValueColumn} key={column} />
          ))}
        </colgroup>
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
              {readComparisonValues(row, "desktop").map((desktopValue, valueIndex) => {
                const mobileValue = readComparisonValues(row, "mobile")[valueIndex];
                if (mobileValue === undefined) {
                  throw new Error(
                    `MaterialsAndResinPage comparison row ${JSON.stringify(row.label)} is missing a value at index ${valueIndex}.`,
                  );
                }

                return (
                  <td key={`${row.label}-${valueIndex}`}>
                    {desktopValue === mobileValue ? (
                      desktopValue
                    ) : (
                      <>
                        <span className={styles.desktopText}>{desktopValue}</span>
                        <span className={styles.mobileText}>{mobileValue}</span>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonCards({
  comparison,
}: Readonly<{ comparison: MaterialsAndResinPageCopy["comparison"] }>): JSX.Element {
  return (
    <div className={styles.comparisonCards}>
      {comparison.rows.map((row) => (
        <article className={styles.comparisonCard} key={row.label}>
          <h3 className={styles.comparisonCardTitle}>{row.label}</h3>
          {readComparisonValues(row, "mobile").map((value, valueIndex) => (
            <p className={styles.fact} key={`${row.label}-${comparison.columns[valueIndex]}`}>
              <span className={styles.factLabel}>{comparison.columns[valueIndex]}</span>
              <span className={styles.factBody}>{value}</span>
            </p>
          ))}
        </article>
      ))}
    </div>
  );
}

function ComparisonSources({
  comparison,
}: Readonly<{ comparison: MaterialsAndResinPageCopy["comparison"] }>): JSX.Element {
  return <p className={`${styles.sources} ${styles.mobileText}`}>{comparison.mobileSources}</p>;
}

function ComparisonSection({
  copy,
}: Readonly<{ copy: MaterialsAndResinPageCopy["comparison"] }>): JSX.Element {
  const headingId = "materials-and-resin-comparison-title";

  return (
    <section aria-labelledby={headingId} className={styles.comparisonSection}>
      <div className={`${styles.centeredBlock} ${styles.narrowBlock}`}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.sectionTitle} id={headingId}>
          {copy.title}
        </h2>
        <p className={`${styles.description} ${styles.desktopText}`}>{copy.desktopDescription}</p>
        <p className={`${styles.description} ${styles.mobileText}`}>{copy.mobileDescription}</p>
      </div>
      <ComparisonTable comparison={copy} />
      <ComparisonCards comparison={copy} />
      <ComparisonSources comparison={copy} />
    </section>
  );
}

function FaqSection({ copy }: Readonly<{ copy: MaterialsAndResinPageCopy["faq"] }>): JSX.Element {
  return (
    <div className={styles.faqSlot}>
      <Faq1
        className={styles.faq}
        description={copy.description}
        eyebrow={copy.eyebrow}
        items={copy.items}
        title={copy.title}
      />
    </div>
  );
}

function CtaSection({ copy }: Readonly<{ copy: MaterialsAndResinPageCopy["cta"] }>): JSX.Element {
  const headingId = "materials-and-resin-cta-title";

  return (
    <section aria-labelledby={headingId} className={styles.finalCallToAction}>
      <div className={styles.ctaCopy}>
        <h2 className={styles.ctaTitle} id={headingId}>
          {copy.title}
        </h2>
        <p className={styles.description}>{copy.description}</p>
      </div>
      <a
        className={styles.ctaAction}
        href={`#${MATERIALS_CALCULATOR_ID}`}
        onClick={handleMaterialsCtaClick}
      >
        {copy.actionLabel}
      </a>
    </section>
  );
}

export function MaterialsAndResinPage({ locale }: MaterialsAndResinPageProperties): JSX.Element {
  const copy = getMaterialsAndResinPageCopy(locale);
  const routeCopy = getPlanningToolRouteCopy(locale, "materials-and-resin");
  const caseImagePath = getMaterialsAndResinCaseImagePath(locale);
  assertMaterialsAndResinPage(copy, locale);

  return (
    <article className={styles.page}>
      <SimpleHero
        actionHref={`#${MATERIALS_CALCULATOR_ID}`}
        copy={routeCopy.hero}
        locale={locale}
        titleId="materials-and-resin-page-hero"
      />
      <div className={styles.calculator} id={MATERIALS_CALCULATOR_ID} tabIndex={-1}>
        <KegMaterialsTool locale={locale} />
      </div>
      <div className={styles.guide}>
        <HeroSection copy={copy.hero} />
        <CaseSection
          copy={copy.caseStudy}
          featureItems={copy.features.items}
          imagePath={caseImagePath}
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
