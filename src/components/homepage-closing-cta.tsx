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
      <div data-homepage-closing-cta-content>
        <h2 id="homepage-closing-cta-heading">{copy.heading}</h2>
        <Button asChild data-homepage-primary-action size="lg">
          <a href={plannerHref}>{primaryActionLabel}</a>
        </Button>
      </div>
    </section>
  );
}
