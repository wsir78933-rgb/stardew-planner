import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import { CircularTestimonials } from "./circular-testimonials";

type HomepageWhyChooseSectionProps = Readonly<{
  copy: HomepageCopy["whyChoose"];
}>;

export function HomepageWhyChooseSection({ copy }: HomepageWhyChooseSectionProps) {
  const testimonials = copy.testimonials.map((testimonial) => ({
    alt: testimonial.imageAlt,
    designation: testimonial.designation,
    name: testimonial.name,
    quote: testimonial.quote,
    src: testimonial.src,
  }));

  return (
    <section
      data-homepage-content-section
      data-homepage-why-choose
      id="why-choose"
    >
      <CircularTestimonials
        colors={{
          arrowBackground: "var(--foreground)",
          arrowForeground: "var(--background)",
          arrowHoverBackground: "var(--primary)",
          designation: "var(--muted-foreground)",
          name: "var(--foreground)",
          testimony: "var(--muted-foreground)",
        }}
        nextLabel={copy.nextLabel}
        previousLabel={copy.previousLabel}
        testimonials={testimonials}
      />
    </section>
  );
}
