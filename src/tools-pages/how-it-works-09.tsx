"use client";

import { useId, type JSX } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import styles from "./how-it-works-09.module.css";

export type HowItWorks09Step = Readonly<{
  number: string;
  title: string;
  body: string;
}>;

export type HowItWorks09Cta = Readonly<{
  label: string;
  onClick: () => void;
}>;

export type HowItWorks09Props = Readonly<{
  eyebrow: string;
  title: string;
  steps: readonly HowItWorks09Step[];
  cta: HowItWorks09Cta;
}>;

type HowItWorks09StepItemProperties = Readonly<{
  index: number;
  step: HowItWorks09Step;
}>;

function receivedValue(value: unknown): string {
  return JSON.stringify(value) ?? String(value);
}

function requireNonEmptyString(value: unknown, fieldPath: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `HowItWorks09: ${fieldPath} must be a non-empty string, received: ${receivedValue(value)}`,
    );
  }
}

function requireHowItWorks09Step(step: unknown, stepIndex: number): void {
  if (step === null || typeof step !== "object" || Array.isArray(step)) {
    throw new Error(
      `HowItWorks09: steps[${stepIndex}] must be an object, received: ${receivedValue(step)}`,
    );
  }

  const stepRecord = step as Readonly<{
    number?: unknown;
    title?: unknown;
    body?: unknown;
  }>;

  requireNonEmptyString(stepRecord.number, `steps[${stepIndex}].number`);
  requireNonEmptyString(stepRecord.title, `steps[${stepIndex}].title`);
  requireNonEmptyString(stepRecord.body, `steps[${stepIndex}].body`);
}

function assertHowItWorks09Props(props: unknown): asserts props is HowItWorks09Props {
  if (props === null || typeof props !== "object" || Array.isArray(props)) {
    throw new Error(
      `HowItWorks09: props must be an object, received: ${receivedValue(props)}`,
    );
  }

  const propsRecord = props as Readonly<{
    eyebrow?: unknown;
    title?: unknown;
    steps?: unknown;
    cta?: unknown;
  }>;

  requireNonEmptyString(propsRecord.eyebrow, "eyebrow");
  requireNonEmptyString(propsRecord.title, "title");

  if (!Array.isArray(propsRecord.steps)) {
    throw new Error(
      `HowItWorks09: steps must be an array of exactly 3 items, received: ${receivedValue(propsRecord.steps)}`,
    );
  }

  if (propsRecord.steps.length !== 3) {
    throw new Error(
      `HowItWorks09: steps must contain exactly 3 items, received length ${propsRecord.steps.length}: ${receivedValue(propsRecord.steps)}`,
    );
  }

  propsRecord.steps.forEach(requireHowItWorks09Step);

  const cta = propsRecord.cta;
  if (cta === null || typeof cta !== "object" || Array.isArray(cta)) {
    throw new Error(
      `HowItWorks09: cta must be an object, received: ${receivedValue(cta)}`,
    );
  }

  const ctaRecord = cta as Readonly<{
    label?: unknown;
    onClick?: unknown;
  }>;

  requireNonEmptyString(ctaRecord.label, "cta.label");
  if (typeof ctaRecord.onClick !== "function") {
    throw new Error(
      `HowItWorks09: cta.onClick must be a function, received: ${receivedValue(ctaRecord.onClick)}`,
    );
  }
}

function HowItWorks09StepItem({
  index,
  step,
}: HowItWorks09StepItemProperties): JSX.Element {
  const hasFollowingStep = index < 2;

  return (
    <li className={styles.step}>
      <div aria-hidden="true" className={styles.numberCircle}>
        <span className={styles.stepNumber}>{step.number}</span>
      </div>
      <div className={styles.stepCopy}>
        <h3 className={styles.stepTitle}>{step.title}</h3>
        <p className={styles.stepBody}>{step.body}</p>
      </div>
      {hasFollowingStep ? (
        <ArrowRight aria-hidden="true" className={styles.mobileArrow} />
      ) : null}
    </li>
  );
}

export function HowItWorks09(props: HowItWorks09Props): JSX.Element {
  assertHowItWorks09Props(props);

  const headingId = useId();
  const { eyebrow, title, steps, cta } = props;

  return (
    <section aria-labelledby={headingId} className={styles.section}>
      <div className={styles.container}>
        <header className={styles.headingBlock}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 className={styles.heading} id={headingId}>
            {title}
          </h2>
        </header>

        <div className={styles.stepsTrack}>
          <div aria-hidden="true" className={styles.desktopConnector} />
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <HowItWorks09StepItem
                index={index}
                key={`${step.number}-${index}`}
                step={step}
              />
            ))}
          </ol>
        </div>

        <div className={styles.ctaRow}>
          <Button
            className={styles.ctaButton}
            onClick={cta.onClick}
            size="lg"
            type="button"
          >
            {cta.label}
            <ArrowRight aria-hidden="true" className={styles.ctaArrow} />
          </Button>
        </div>
      </div>
    </section>
  );
}
