import type { HomepageCaseStudyGroup } from "@/src/homepage/homepage-copy";
import { CircularTestimonials } from "./circular-testimonials";

type HomepageCaseStudySectionsProps = Readonly<{
  description: string;
  heading: string;
  groups: ReadonlyArray<HomepageCaseStudyGroup>;
}>;

export function HomepageCaseStudySections({
  description,
  heading,
  groups,
}: HomepageCaseStudySectionsProps) {
  return (
    <>
      {groups.map((group, groupIndex) => {
        const isFirstGroup = groupIndex === 0;
        const sectionHeadingId = "farm-cases-heading";

        return (
          <section
            aria-label={isFirstGroup ? undefined : group.heading}
            aria-describedby={
              isFirstGroup ? "farm-cases-description" : undefined
            }
            aria-labelledby={isFirstGroup ? sectionHeadingId : undefined}
            data-homepage-content-section
            data-homepage-case-study-group={group.id}
            data-image-position={group.imagePosition}
            id={group.id}
            key={group.id}
          >
            {isFirstGroup ? (
              <header data-homepage-case-study-header>
                <h2 id={sectionHeadingId}>{heading}</h2>
                <p
                  id="farm-cases-description"
                  data-homepage-case-study-description
                >
                  {description}
                </p>
              </header>
            ) : null}
            <CircularTestimonials
              colors={{
                arrowBackground: "var(--foreground)",
                arrowForeground: "var(--background)",
                arrowHoverBackground: "var(--primary)",
                designation: "var(--muted-foreground)",
                name: "var(--foreground)",
                testimony: "var(--muted-foreground)",
              }}
              nextLabel={group.nextLabel}
              previousLabel={group.previousLabel}
              testimonials={group.testimonials}
            />
          </section>
        );
      })}
    </>
  );
}
