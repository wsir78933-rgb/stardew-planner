import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import { Faq1 } from "./faq-1";

type HomepageFaqListProps = Readonly<{
  eyebrow: string;
  heading: string;
  description: string;
  items: HomepageCopy["faq"]["items"];
}>;

export function HomepageFaqList({
  eyebrow,
  heading,
  description,
  items,
}: HomepageFaqListProps) {
  return (
    <Faq1
      description={description}
      eyebrow={eyebrow}
      items={items}
      title={heading}
    />
  );
}
