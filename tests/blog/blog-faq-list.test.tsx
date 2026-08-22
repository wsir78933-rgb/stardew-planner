import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlogFaqList } from "../../src/components/blog/blog-faq-list";

describe("BlogFaqList", () => {
  it("renders closed accordion items with every question and answer", () => {
    const markup = renderToStaticMarkup(
      createElement(BlogFaqList, {
        items: [
          {
            question: "Where is the carpenter?",
            answer: createElement(
              "p",
              null,
              "Robin is at 24 Mountain Road. See ",
              createElement("a", { href: "/where-is-robin-stardew-valley" }, "the Robin guide"),
              ".",
            ),
          },
          {
            question: "Can I move a building?",
            answer: createElement("p", null, "Yes. The move is free."),
          },
        ],
      }),
    );

    expect(markup).toContain('class="blog-faq-list"');
    expect(markup).toContain("Where is the carpenter?");
    expect(markup).toContain("Can I move a building?");
    expect(markup).toContain("Robin is at 24 Mountain Road.");
    expect(markup).toContain("Yes. The move is free.");
    expect(markup).toContain('href="/where-is-robin-stardew-valley"');
    expect(markup).toContain('data-state="closed"');
    expect(markup).not.toContain('data-state="open"');
    expect(markup.match(/class="blog-faq-item"/g)).toHaveLength(2);
  });

  it("rejects an empty FAQ list", () => {
    expect(() =>
      renderToStaticMarkup(createElement(BlogFaqList, { items: [] })),
    ).toThrow("Blog FAQ list requires at least one item. Received: length 0.");
  });

  it("rejects a FAQ item without a question", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(BlogFaqList, {
          items: [{ question: "   ", answer: createElement("p", null, "Answer") }],
        }),
      ),
    ).toThrow('Blog FAQ item 0 is missing a question. Received: "   ".');
  });

  it("rejects a FAQ item without an answer", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(BlogFaqList, {
          items: [{ question: "Where is Robin?", answer: null }],
        }),
      ),
    ).toThrow(
      "Blog FAQ item 0 is missing an answer. Question: Where is Robin?. Received: null.",
    );
  });

  it("rejects a FAQ item that is not an object", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(BlogFaqList, {
          items: [undefined] as never,
        }),
      ),
    ).toThrow("Blog FAQ item 0 is not an object. Received: undefined.");
  });

  it("rejects a FAQ answer that is only whitespace", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(BlogFaqList, {
          items: [{ question: "Where is Robin?", answer: "   " }],
        }),
      ),
    ).toThrow(
      'Blog FAQ item 0 is missing an answer. Question: Where is Robin?. Received: "   ".',
    );
  });
});
