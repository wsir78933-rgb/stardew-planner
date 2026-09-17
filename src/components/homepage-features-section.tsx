import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import { CircularTestimonials } from "./circular-testimonials";

type HomepageFeaturesSectionProps = Readonly<{
  copy: HomepageCopy["features"];
}>;

export function HomepageFeaturesSection({ copy }: HomepageFeaturesSectionProps) {
  const testimonials = copy.testimonials.map((testimonial) => ({
    alt: testimonial.imageAlt,
    designation: testimonial.designation,
    name: testimonial.name,
    quote: testimonial.quote,
    src: testimonial.src,
  }));

  return (
    <section
      aria-labelledby="homepage-features-heading"
      data-homepage-content-section
      data-homepage-features
      id="capabilities"
    >
      <h2 id="homepage-features-heading">{copy.heading}</h2>
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
