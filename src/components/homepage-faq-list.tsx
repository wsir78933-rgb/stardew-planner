"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";

type HomepageFaqListProps = Readonly<{
  items: HomepageCopy["faq"]["items"];
}>;

export function HomepageFaqList({ items }: HomepageFaqListProps) {
  return (
    <Accordion collapsible data-homepage-faq-list type="single">
      {items.map((faqItem, faqIndex) => (
        <AccordionItem key={`faq-${faqIndex}`} value={`faq-${faqIndex}`}>
          <AccordionTrigger>{faqItem.question}</AccordionTrigger>
          <AccordionContent forceMount>
            <p>{faqItem.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
