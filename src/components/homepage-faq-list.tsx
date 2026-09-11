import type { HomepageCopy } from "@/src/homepage/homepage-copy";

type HomepageFaqListProps = Readonly<{
  items: HomepageCopy["faq"]["items"];
}>;

function formatHomepageFaqIndex(faqIndex: number): string {
  return String(faqIndex + 1).padStart(2, "0");
}

export function HomepageFaqList({ items }: HomepageFaqListProps) {
  return (
    <ol data-homepage-faq-list>
      {items.map((faqItem, faqIndex) => (
        <li key={faqItem.question}>
          <span aria-hidden="true" data-homepage-section-index>
            {formatHomepageFaqIndex(faqIndex)}
          </span>
          <div>
            <h3>{faqItem.question}</h3>
            <p>{faqItem.answer}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
