import { Button } from "@/components/ui/button";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";

type HomepageClosingCtaProps = Readonly<{
  copy: HomepageCopy["closingCta"];
  plannerHref: string;
  primaryActionLabel: string;
}>;

export function HomepageClosingCta({
  copy,
  plannerHref,
  primaryActionLabel,
}: HomepageClosingCtaProps) {
  return (
    <section
      aria-labelledby="homepage-closing-cta-heading"
      data-homepage-closing-cta
    >
      <h2 id="homepage-closing-cta-heading">{copy.heading}</h2>
      <div data-homepage-closing-cta-content>
        <Button asChild data-homepage-primary-action size="lg">
          <a href={plannerHref}>{primaryActionLabel}</a>
        </Button>
        <p>{copy.supportLine}</p>
      </div>
    </section>
  );
}
