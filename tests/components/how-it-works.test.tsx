import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import {
  HowItWorks,
  type HowItWorksStep,
} from "@/src/components/how-it-works";

const validHowItWorksSteps: readonly [
  HowItWorksStep,
  HowItWorksStep,
  HowItWorksStep,
] = [
  {
    icon: createElement("span"),
    title: "Pin the tiles that never move",
    description: "Water, cliffs, bridges, and exits stay put.",
    benefits: ["Ponds, rivers, and cliffs will not shift later."],
  },
  {
    icon: createElement("span"),
    title: "Zone the work, then drop the large pieces",
    description: "Give crops and animals their own areas.",
    benefits: ["Barns, coops, sheds, and fields set the scale of the map."],
  },
  {
    icon: createElement("span"),
    title: "Walk the day's chores on this grid",
    description: "If a path is blocked, change the plan here.",
    benefits: ["A blocked tile is cheaper to move here than in-game."],
  },
];

test("renders three step cards with heading, description, and no farm image", () => {
  const markup = renderToStaticMarkup(
    createElement(HowItWorks, {
      description: "Pin the tiles that never move. Reserve work zones.",
      heading: "Lay out the farm in three passes",
      headingId: "homepage-how-to-heading",
      steps: validHowItWorksSteps,
    }),
  );

  expect(markup).toContain('id="homepage-how-to-heading"');
  expect(markup).toContain("Lay out the farm in three passes");
  expect(markup).toContain("Pin the tiles that never move. Reserve work zones.");
  expect(markup.match(/<h3 class="mb-2 text-xl font-semibold">/g)).toHaveLength(
    3,
  );
  for (const howItWorksStep of validHowItWorksSteps) {
    expect(markup).toContain(howItWorksStep.title.replaceAll("'", "&#x27;"));
    expect(markup).toContain(howItWorksStep.description);
    expect(markup).toContain(howItWorksStep.benefits[0]);
  }
  expect(markup).not.toContain("/homepage/how-to-pixel-farm.webp");
});

test("throws when steps.length is not 3, naming the received length", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(HowItWorks, {
        description: "Reserve work zones, then walk one ordinary day.",
        heading: "Lay out the farm in three passes",
        steps: validHowItWorksSteps.slice(0, 2),
      }),
    ),
  ).toThrow("HowItWorks: steps.length must be 3, received: 2");
});

test("throws when heading is blank, naming the received value", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(HowItWorks, {
        description: "Reserve work zones, then walk one ordinary day.",
        heading: "   ",
        steps: validHowItWorksSteps,
      }),
    ),
  ).toThrow('HowItWorks: heading must be a non-empty string, received: "   "');
});

test("throws when a step has no benefits, naming the received value", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(HowItWorks, {
        description: "Reserve work zones, then walk one ordinary day.",
        heading: "Lay out the farm in three passes",
        steps: [
          validHowItWorksSteps[0],
          { ...validHowItWorksSteps[1], benefits: [] },
          validHowItWorksSteps[2],
        ],
      }),
    ),
  ).toThrow(
    "HowItWorks: steps[1].benefits must be a non-empty array, received: []",
  );
});
