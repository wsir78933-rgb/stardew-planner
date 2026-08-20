"use client";

import { handleFaqSummaryKeyDown } from "@/src/homepage/faq-disclosure-keyboard";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";

type HomepageFaqListProps = Readonly<{
  items: HomepageCopy["faq"]["items"];
}>;

export function HomepageFaqList({ items }: HomepageFaqListProps) {
  return (
    <div data-homepage-faq-list>
      {items.map((faqItem, faqIndex) => (
        <details key={`faq-${faqIndex}`}>
          <summary onKeyDown={handleFaqSummaryKeyDown}>
            {faqItem.question}
          </summary>
          <p>{faqItem.answer}</p>
        </details>
      ))}
    </div>
  );
}
