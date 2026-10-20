import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import {
  HowItWorks09,
  type HowItWorks09Step,
} from "@/src/components/how-it-works-09";

const beachFarmSteps: readonly [
  HowItWorks09Step,
  HowItWorks09Step,
  HowItWorks09Step,
] = [
  {
    number: "01",
    title: "Download a layout",
    body: "Choose one case and download its project file.",
  },
  {
    number: "02",
    title: "Import it in the planner",
    body: "Open the planner and import the JSON project.",
  },
  {
    number: "03",
    title: "Make it your own",
    body: "Adjust the layout to match your save.",
  },
];

const validHowItWorks09Props = {
  cta: { href: "/#planner", label: "Open the planner" },
  eyebrow: "HOW TO USE",
  headingId: "beach-farm-how-to-heading",
  steps: beachFarmSteps,
  title: "Use a Beach Farm layout",
};

test("renders the accessible three-step flow and a planner link", () => {
  const markup = renderToStaticMarkup(
    createElement(HowItWorks09, validHowItWorks09Props),
  );

  expect(markup).toContain('aria-labelledby="beach-farm-how-to-heading"');
  expect(markup).toMatch(
    /<h2[^>]*id="beach-farm-how-to-heading"[^>]*>Use a Beach Farm layout<\/h2>/,
  );
  expect(markup.match(/<li\b/g)).toHaveLength(3);
  expect(markup.match(/data-how-it-works-step="0[123]"/g)).toHaveLength(3);
  expect(markup).toContain('href="/#planner"');
  expect(markup).toContain("Open the planner");
  expect(markup).not.toContain("<button");

  for (const beachFarmStep of beachFarmSteps) {
    expect(markup).toContain(beachFarmStep.number);
    expect(markup).toContain(beachFarmStep.title);
    expect(markup).toContain(beachFarmStep.body);
  }
});

test("rejects any step count other than three with the received value", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(HowItWorks09, {
        ...validHowItWorks09Props,
        steps: beachFarmSteps.slice(0, 2),
      }),
    ),
  ).toThrow(
    'HowItWorks09: steps must contain exactly 3 items, received: [{"number":"01","title":"Download a layout","body":"Choose one case and download its project file."},{"number":"02","title":"Import it in the planner","body":"Open the planner and import the JSON project."}]',
  );
});

test("rejects a step number that does not match its position", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(HowItWorks09, {
        ...validHowItWorks09Props,
        steps: [
          beachFarmSteps[0],
          { ...beachFarmSteps[1], number: "03" },
          beachFarmSteps[2],
        ],
      }),
    ),
  ).toThrow(
    'HowItWorks09: steps[1].number must be "02", received: "03"',
  );
});

test("rejects an empty CTA href with the received value", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(HowItWorks09, {
        ...validHowItWorks09Props,
        cta: { ...validHowItWorks09Props.cta, href: "" },
      }),
    ),
  ).toThrow('HowItWorks09: cta.href must be a non-empty string, received: ""');
});
