"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

export type BlogFaqItem = Readonly<{
  question: string;
  answer: ReactNode;
}>;

type BlogFaqListProperties = Readonly<{
  items: readonly BlogFaqItem[];
}>;

function formatReceivedValue(receivedValue: unknown): string {
  if (receivedValue === undefined) {
    return "undefined";
  }

  return JSON.stringify(receivedValue);
}

function isMissingBlogFaqAnswer(answer: ReactNode): boolean {
  if (answer === null || answer === undefined || answer === false) {
    return true;
  }

  return typeof answer === "string" && answer.trim() === "";
}

function assertBlogFaqItems(items: readonly BlogFaqItem[]): void {
  if (!Array.isArray(items) || items.length === 0) {
    const receivedListDescription = Array.isArray(items)
      ? `length ${items.length}`
      : typeof items;
    throw new Error(
      `Blog FAQ list requires at least one item. Received: ${receivedListDescription}.`,
    );
  }

  items.forEach((faqItem, faqIndex) => {
    if (faqItem === null || typeof faqItem !== "object" || Array.isArray(faqItem)) {
      throw new Error(
        `Blog FAQ item ${faqIndex} is not an object. Received: ${formatReceivedValue(faqItem)}.`,
      );
    }

    if (typeof faqItem.question !== "string" || faqItem.question.trim() === "") {
      throw new Error(
        `Blog FAQ item ${faqIndex} is missing a question. Received: ${formatReceivedValue(faqItem.question)}.`,
      );
    }

    if (isMissingBlogFaqAnswer(faqItem.answer)) {
      throw new Error(
        `Blog FAQ item ${faqIndex} is missing an answer. Question: ${faqItem.question}. Received: ${formatReceivedValue(faqItem.answer)}.`,
      );
    }
  });
}

export function BlogFaqList({ items }: BlogFaqListProperties) {
  assertBlogFaqItems(items);

  return (
    <AccordionPrimitive.Root className="blog-faq-list" collapsible type="single">
      {items.map((faqItem, faqIndex) => (
        <AccordionPrimitive.Item
          className="blog-faq-item"
          key={`faq-${faqIndex}`}
          value={`faq-${faqIndex}`}
        >
          <AccordionPrimitive.Header className="blog-faq-header">
            <AccordionPrimitive.Trigger className="blog-faq-trigger">
              {faqItem.question}
              <span aria-hidden="true" className="blog-faq-chevron">
                <ChevronDownIcon height={16} strokeWidth={2} width={16} />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="blog-faq-content" forceMount>
            <div className="blog-faq-answer">{faqItem.answer}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
