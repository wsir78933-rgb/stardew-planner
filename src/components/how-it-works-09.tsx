import { ArrowRight } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";

const expectedHowItWorks09Numbers = ["01", "02", "03"] as const;

export type HowItWorks09Step = Readonly<{
  number: string;
  title: string;
  body: string;
}>;

export type HowItWorks09Props = Readonly<{
  eyebrow: string;
  title: string;
  steps: readonly HowItWorks09Step[];
  cta: Readonly<{
    label: string;
    href: string;
  }>;
  headingId?: string;
}>;

function receivedHowItWorks09Value(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (value === null || typeof value !== "object") {
    return String(value);
  }

  return JSON.stringify(value) ?? String(value);
}

function requireHowItWorks09NonEmptyString(
  value: unknown,
  fieldPath: string,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `HowItWorks09: ${fieldPath} must be a non-empty string, received: ${receivedHowItWorks09Value(value)}`,
    );
  }

  return value;
}

function requireHowItWorks09Step(
  step: unknown,
  stepIndex: number,
): HowItWorks09Step {
  if (step === null || typeof step !== "object" || Array.isArray(step)) {
    throw new Error(
      `HowItWorks09: steps[${stepIndex}] must be an object, received: ${receivedHowItWorks09Value(step)}`,
    );
  }

  const stepRecord = step as {
    body?: unknown;
    number?: unknown;
    title?: unknown;
  };
  const expectedNumber = expectedHowItWorks09Numbers[stepIndex];
  const stepNumber = requireHowItWorks09NonEmptyString(
    stepRecord.number,
    `steps[${stepIndex}].number`,
  );

  if (stepNumber !== expectedNumber) {
    throw new Error(
      `HowItWorks09: steps[${stepIndex}].number must be ${JSON.stringify(expectedNumber)}, received: ${JSON.stringify(stepNumber)}`,
    );
  }

  requireHowItWorks09NonEmptyString(
    stepRecord.title,
    `steps[${stepIndex}].title`,
  );
  requireHowItWorks09NonEmptyString(stepRecord.body, `steps[${stepIndex}].body`);

  return step as HowItWorks09Step;
}

function requireHowItWorks09Cta(cta: unknown): void {
  if (cta === null || typeof cta !== "object" || Array.isArray(cta)) {
    throw new Error(
      `HowItWorks09: cta must be an object, received: ${receivedHowItWorks09Value(cta)}`,
    );
  }

  const ctaRecord = cta as { href?: unknown; label?: unknown };
  requireHowItWorks09NonEmptyString(ctaRecord.label, "cta.label");
  requireHowItWorks09NonEmptyString(ctaRecord.href, "cta.href");
}

function assertHowItWorks09Props(props: HowItWorks09Props): void {
  if (props === null || typeof props !== "object" || Array.isArray(props)) {
    throw new Error(
      `HowItWorks09: props must be an object, received: ${receivedHowItWorks09Value(props)}`,
    );
  }

  requireHowItWorks09NonEmptyString(props.eyebrow, "eyebrow");
  requireHowItWorks09NonEmptyString(props.title, "title");
  if (props.headingId !== undefined) {
    requireHowItWorks09NonEmptyString(props.headingId, "headingId");
  }

  if (!Array.isArray(props.steps) || props.steps.length !== 3) {
    throw new Error(
      `HowItWorks09: steps must contain exactly 3 items, received: ${receivedHowItWorks09Value(props.steps)}`,
    );
  }

  props.steps.forEach((step, stepIndex) => {
    requireHowItWorks09Step(step, stepIndex);
  });
  requireHowItWorks09Cta(props.cta);
}

export function HowItWorks09(props: HowItWorks09Props): JSX.Element {
  assertHowItWorks09Props(props);

  const { cta, eyebrow, headingId, steps, title } = props;

  return (
    <section
      aria-labelledby={headingId}
      className="bg-background py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <span className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase">
            {eyebrow}
          </span>
          <h2
            className="text-foreground text-balance font-semibold tracking-tight"
            id={headingId}
            style={{ fontSize: "clamp(1.85rem, 4vw, 2.75rem)", letterSpacing: "-0.03em" }}
          >
            {title}
          </h2>
        </div>
        <div className="relative">
          <div
            aria-hidden="true"
            className="bg-border absolute inset-x-0 top-6 hidden h-px md:block"
          />
          <ol className="relative m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
            {steps.map((step, stepIndex) => (
              <li
                className="relative flex flex-col items-center gap-4 text-center"
                data-how-it-works-step={step.number}
                key={step.number}
              >
                <div className="bg-background border-border relative z-10 flex size-12 items-center justify-center rounded-full border">
                  <span className="text-muted-foreground text-xs font-semibold tabular-nums">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-foreground font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
                {stepIndex < steps.length - 1 ? (
                  <ArrowRight
                    aria-hidden="true"
                    className="text-muted-foreground/40 mt-2 size-4 md:hidden"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-14 flex justify-center">
          <Button asChild className="rounded-full px-8" size="lg">
            <a href={cta.href}>
              {cta.label}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
