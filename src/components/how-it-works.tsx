import { type JSX, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type HowItWorksStep = {
  icon: ReactNode;
  title: string;
  description: string;
  benefits: readonly string[];
};

export type HowItWorksProps = {
  heading: string;
  description: string;
  steps: readonly HowItWorksStep[];
  className?: string;
  headingId?: string;
};

const STEP_NUMBERS = [1, 2, 3] as const;

function requireNonEmptyString(value: unknown, fieldPath: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    const received =
      typeof value === "string" ? JSON.stringify(value) : String(value);
    throw new Error(
      `HowItWorks: ${fieldPath} must be a non-empty string, received: ${received}`,
    );
  }
  return value;
}

function requireHowItWorksStep(step: unknown, index: number): HowItWorksStep {
  if (step === null || typeof step !== "object" || Array.isArray(step)) {
    throw new Error(`HowItWorks: steps[${index}]=${String(step)}`);
  }

  const record = step as {
    icon?: unknown;
    title?: unknown;
    description?: unknown;
    benefits?: unknown;
  };

  if (record.icon === null || record.icon === undefined) {
    throw new Error(
      `HowItWorks: steps[${index}].icon is missing, received: ${String(record.icon)}`,
    );
  }

  requireNonEmptyString(record.title, `steps[${index}].title`);
  requireNonEmptyString(record.description, `steps[${index}].description`);

  if (!Array.isArray(record.benefits) || record.benefits.length === 0) {
    const received = Array.isArray(record.benefits)
      ? JSON.stringify(record.benefits)
      : String(record.benefits);
    throw new Error(
      `HowItWorks: steps[${index}].benefits must be a non-empty array, received: ${received}`,
    );
  }

  record.benefits.forEach((benefit, benefitIndex) => {
    if (typeof benefit !== "string" || benefit.trim().length === 0) {
      const received =
        typeof benefit === "string" ? JSON.stringify(benefit) : String(benefit);
      throw new Error(
        `HowItWorks: steps[${index}].benefits[${benefitIndex}]=${received}`,
      );
    }
  });

  return step as HowItWorksStep;
}

function assertHowItWorksProps(props: HowItWorksProps): void {
  requireNonEmptyString(props.heading, "heading");
  requireNonEmptyString(props.description, "description");
  if (props.headingId !== undefined) {
    requireNonEmptyString(props.headingId, "headingId");
  }

  const { steps } = props;
  if (!Array.isArray(steps) || steps.length !== 3) {
    throw new Error(
      `HowItWorks: steps.length must be 3, received: ${
        Array.isArray(steps) ? steps.length : String(steps)
      }`,
    );
  }

  steps.forEach((step, index) => {
    requireHowItWorksStep(step, index);
  });
}

function StepNumberTrack() {
  return (
    <div className="relative mx-auto mb-8 w-full max-w-4xl">
      <div
        aria-hidden="true"
        className="bg-border absolute top-1/2 left-[16.6667%] h-0.5 w-[66.6667%] -translate-y-1/2"
      />
      <div className="relative grid grid-cols-3">
        {STEP_NUMBERS.map((stepNumber) => (
          <div
            key={stepNumber}
            className="bg-muted text-foreground ring-background flex h-8 w-8 items-center justify-center justify-self-center rounded-full font-semibold ring-4"
          >
            {stepNumber}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step }: { step: HowItWorksStep }) {
  return (
    <div className="bg-card text-card-foreground hover:border-primary/50 hover:bg-muted relative rounded-2xl border p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <div className="bg-muted text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
        {step.icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
      <p className="text-muted-foreground mb-6">{step.description}</p>
      <ul className="space-y-3">
        {step.benefits.map((benefit, benefitIndex) => (
          <li
            key={`${benefit}-${benefitIndex}`}
            className="flex items-center gap-3"
          >
            <span className="bg-primary/20 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
              <span className="bg-primary h-2 w-2 rounded-full" />
            </span>
            <span className="text-muted-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HowItWorks(props: HowItWorksProps): JSX.Element {
  assertHowItWorksProps(props);

  const { heading, description, steps, className, headingId } = props;

  return (
    <div
      className={cn("bg-background w-full px-4 py-16 sm:py-24", className)}
      role="presentation"
    >
      <div className="mx-auto w-full">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2
            className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl"
            id={headingId}
          >
            {heading}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">{description}</p>
        </div>
        <StepNumberTrack />
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <StepCard key={step.title} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
}
