import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import { HomepageAnimatedTestimonials } from "./homepage-animated-testimonials";

type HomepageWhyChooseSectionProps = Readonly<{
  copy: HomepageCopy["whyChoose"];
}>;

export function HomepageWhyChooseSection({ copy }: HomepageWhyChooseSectionProps) {
  return (
    <section
      aria-labelledby="homepage-why-choose-heading"
      data-homepage-content-section
      data-homepage-why-choose
      id="why-choose"
    >
      <h2 id="homepage-why-choose-heading">{copy.heading}</h2>
      <HomepageAnimatedTestimonials
        nextLabel={copy.nextLabel}
        previousLabel={copy.previousLabel}
        testimonials={copy.testimonials}
      />
    </section>
  );
}
