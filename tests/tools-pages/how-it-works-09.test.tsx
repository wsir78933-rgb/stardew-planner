import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import {
  HowItWorks09,
  type HowItWorks09Props,
} from "../../src/tools-pages/how-it-works-09";

const renderedCta = vi.hoisted(() => ({
  onClick: null as null | (() => void),
  type: null as null | "button" | "submit" | "reset",
}));

vi.mock("@/components/ui/button", () => ({
  Button: (properties: {
    children: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
  }) => {
    renderedCta.onClick = properties.onClick ?? null;
    renderedCta.type = properties.type ?? null;

    return (
      <button onClick={properties.onClick} type={properties.type}>
        {properties.children}
      </button>
    );
  },
}));

const validHowItWorksProps: HowItWorks09Props = {
  eyebrow: "How to use the planner",
  title: "Plan a crop in three steps",
  steps: [
    { number: "1", title: "Choose a crop", body: "Pick the crop and planting date." },
    { number: "2", title: "Set the conditions", body: "Choose growth settings and location." },
    { number: "3", title: "Review the calendar", body: "Check maturity and harvest dates." },
  ],
  cta: {
    label: "Open the calculator",
    onClick: () => undefined,
  },
};

beforeEach(() => {
  renderedCta.onClick = null;
  renderedCta.type = null;
});

it("renders one labelled heading, exactly three ordered steps, and the CTA", () => {
  const markup = renderToStaticMarkup(<HowItWorks09 {...validHowItWorksProps} />);
  const orderedStepsMatch = markup.match(/<ol\b[^>]*>([\s\S]*?)<\/ol>/);

  if (orderedStepsMatch === null) {
    throw new Error("Expected HowItWorks09 to render an ordered step list.");
  }

  expect(markup.match(/<h1\b/g) ?? []).toHaveLength(0);
  expect(markup.match(/<h2\b/g) ?? []).toHaveLength(1);
  expect(markup).toMatch(/<section\b(?=[^>]*aria-labelledby="[^"]+")[^>]*>/);
  expect(markup).toContain(validHowItWorksProps.eyebrow);
  expect(markup).toContain(validHowItWorksProps.title);
  expect(orderedStepsMatch[1].match(/<li\b/g) ?? []).toHaveLength(3);

  for (const step of validHowItWorksProps.steps) {
    expect(markup).toContain(step.number);
    expect(markup).toContain(step.title);
    expect(markup).toContain(step.body);
  }

  expect(markup).toMatch(
    new RegExp(`<button\\b(?=[^>]*type="button")[^>]*>[\\s\\S]*?${validHowItWorksProps.cta.label}[\\s\\S]*?<\\/button>`),
  );
});

it("passes the CTA callback to its button", () => {
  const onClick = vi.fn();

  renderToStaticMarkup(
    <HowItWorks09
      {...validHowItWorksProps}
      cta={{ ...validHowItWorksProps.cta, onClick }}
    />,
  );

  expect(renderedCta.type).toBe("button");
  expect(renderedCta.onClick).toBe(onClick);
  renderedCta.onClick?.();
  expect(onClick).toHaveBeenCalledOnce();
});

it("fails fast with the received step count", () => {
  const invalidProps = {
    ...validHowItWorksProps,
    steps: validHowItWorksProps.steps.slice(0, 2),
  } as HowItWorks09Props;

  expect(() => renderToStaticMarkup(<HowItWorks09 {...invalidProps} />)).toThrow(
    "received length 2",
  );
});

it("fails fast with the received invalid step title", () => {
  const invalidProps = {
    ...validHowItWorksProps,
    steps: [
      { ...validHowItWorksProps.steps[0], title: "" },
      ...validHowItWorksProps.steps.slice(1),
    ],
  } as HowItWorks09Props;

  expect(() => renderToStaticMarkup(<HowItWorks09 {...invalidProps} />)).toThrow(
    'steps[0].title must be a non-empty string, received: ""',
  );
});
