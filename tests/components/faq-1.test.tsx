import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { Faq1, type Faq1Item } from "@/src/components/faq-1";

const validFaq1Items: readonly [Faq1Item, Faq1Item] = [
  {
    question: "Can I move a barn after I place it?",
    answer: "Yes. Change it on this grid first, then move it in-game.",
  },
  {
    question: "Does this planner need a game save?",
    answer: "No. You can start from a blank map and import a save later.",
  },
];

const validFaq1Props = {
  description: "Common questions about planning a farm layout.",
  eyebrow: "FAQ",
  items: validFaq1Items,
  title: "Looking for an answer?",
};

test("renders eyebrow, h2 title, description, button questions, answers, and closed chevrons", () => {
  const markup = renderToStaticMarkup(createElement(Faq1, validFaq1Props));

  expect(markup).toContain("FAQ");
  expect(markup).toMatch(/<h2[^>]*>Looking for an answer\?<\/h2>/);
  expect(markup).toContain("Common questions about planning a farm layout.");
  expect(markup.match(/<button\b/g)).toHaveLength(2);
  expect(markup.match(/type="button"/g)).toHaveLength(2);
  expect(markup.match(/aria-expanded="false"/g)).toHaveLength(2);
  expect(markup.match(/<svg\b/g)).toHaveLength(2);
  expect(markup).toContain(
    'd="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"',
  );

  for (const faq1Item of validFaq1Items) {
    expect(markup).toContain(faq1Item.question);
    expect(markup).toContain(faq1Item.answer);
    expect(markup).toMatch(
      new RegExp(
        `<button[^>]*>[\\s\\S]*?${faq1Item.question.replaceAll("?", "\\?")}`,
      ),
    );
  }
});

test("throws when eyebrow is blank, naming the field path and received JSON value", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(Faq1, {
        ...validFaq1Props,
        eyebrow: "   ",
      }),
    ),
  ).toThrow('Faq1: eyebrow must be a non-empty string, received: "   "');
});

test("throws when items is an empty array, naming the received value", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(Faq1, {
        ...validFaq1Props,
        items: [],
      }),
    ),
  ).toThrow("Faq1: items must be a non-empty array, received: []");
});

test("throws when items[0] is not an object", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(Faq1, {
        ...validFaq1Props,
        items: [null] as never,
      }),
    ),
  ).toThrow("Faq1: items[0] must be an object, received: null");
});

test("throws when a question is blank, naming the field path and received JSON value", () => {
  expect(() =>
    renderToStaticMarkup(
      createElement(Faq1, {
        ...validFaq1Props,
        items: [
          {
            question: "   ",
            answer: "Yes. Change it on this grid first, then move it in-game.",
          },
        ],
      }),
    ),
  ).toThrow(
    'Faq1: items[0].question must be a non-empty string, received: "   "',
  );
});

test("does not render h1, details, lucide, accordion slots, Poppins, or Google Fonts", () => {
  const markup = renderToStaticMarkup(createElement(Faq1, validFaq1Props));

  expect(markup).not.toContain("<h1");
  expect(markup).not.toContain("<details");
  expect(markup).not.toContain("lucide");
  expect(markup).not.toContain('data-slot="accordion"');
  expect(markup).not.toContain("Poppins");
  expect(markup).not.toContain("fonts.googleapis");
});
