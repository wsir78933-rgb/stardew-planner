import type { HomepageCopy } from "@/src/homepage/homepage-copy";

const planningGuideImageSource = "/homepage/stardew-valley-planner-layout.webp";

type HomepagePlanningGuideProps = Readonly<{
  copy: HomepageCopy["planningGuide"];
}>;

export function HomepagePlanningGuide({ copy }: HomepagePlanningGuideProps) {
  return (
    <section
      aria-labelledby="planning-guide-heading"
      data-homepage-planning-guide
      id="planning-guide"
    >
      <h2 id="planning-guide-heading">{copy.heading}</h2>
      {copy.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <figure>
        <img
          alt={copy.imageAlt}
          decoding="async"
          height={941}
          loading="lazy"
          src={planningGuideImageSource}
          width={1672}
        />
        <figcaption>{copy.imageCaption}</figcaption>
      </figure>
      <section aria-labelledby="planning-guide-workflow-heading">
        <h3 id="planning-guide-workflow-heading">{copy.workflowHeading}</h3>
        <ol>
          {copy.steps.map((step) => (
            <li key={step.title}>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="planning-guide-play-styles-heading">
        <h3 id="planning-guide-play-styles-heading">{copy.playStylesHeading}</h3>
        {copy.playStyles.map((playStyle) => (
          <article key={playStyle.title}>
            <h4>{playStyle.title}</h4>
            <p>{playStyle.description}</p>
          </article>
        ))}
      </section>
      <section aria-labelledby="planning-guide-evolution-heading">
        <h3 id="planning-guide-evolution-heading">{copy.evolutionHeading}</h3>
        {copy.evolutionParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </section>
  );
}
