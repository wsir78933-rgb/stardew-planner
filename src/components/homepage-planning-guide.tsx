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
      <div data-homepage-planning-guide-summary>
        <h2 id="planning-guide-heading">{copy.heading}</h2>
        <details data-homepage-planning-guide-intro>
          <summary>{copy.detailsLabel}</summary>
          <div>
            {copy.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      </div>
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
      <section
        aria-labelledby="planning-guide-workflow-heading"
        data-homepage-planning-guide-workflow
      >
        <h3 id="planning-guide-workflow-heading">{copy.workflowHeading}</h3>
        <ol>
          {copy.steps.map((step, index) => (
            <li key={step.title}>
              <details data-homepage-planning-guide-step>
                <summary>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span data-homepage-planning-guide-step-title>{step.title}</span>
                </summary>
                <p>{step.description}</p>
              </details>
            </li>
          ))}
        </ol>
      </section>
      <section
        aria-labelledby="planning-guide-play-styles-heading"
        data-homepage-planning-guide-details
        data-homepage-planning-guide-play-styles
      >
        <h3 id="planning-guide-play-styles-heading">{copy.playStylesHeading}</h3>
        <div
          aria-labelledby="planning-guide-play-styles-heading"
          data-homepage-planning-guide-play-style-options
          role="radiogroup"
        >
          {copy.playStyles.map((playStyle, index) => {
            const optionId = `planning-guide-play-style-${index}`;
            const panelId = `${optionId}-panel`;

            return (
              <div data-homepage-planning-guide-play-style-option key={playStyle.title}>
                <input
                  aria-controls={panelId}
                  id={optionId}
                  name="planning-guide-play-style"
                  type="radio"
                  value={index}
                />
                <label htmlFor={optionId}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span>{playStyle.title}</span>
                </label>
              </div>
            );
          })}
        </div>
        <div data-homepage-planning-guide-play-style-panels>
          {copy.playStyles.map((playStyle, index) => (
            <div
              data-homepage-planning-guide-play-style-panel
              data-play-style-index={index}
              id={`planning-guide-play-style-${index}-panel`}
              key={playStyle.title}
            >
              <p>{playStyle.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        aria-labelledby="planning-guide-evolution-heading"
        data-homepage-planning-guide-details
        data-homepage-planning-guide-growth-tip
      >
        <h3 id="planning-guide-evolution-heading">{copy.evolutionHeading}</h3>
        <details>
          <summary>{copy.detailsLabel}</summary>
          <div>
            {copy.evolutionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </details>
      </section>
    </section>
  );
}
