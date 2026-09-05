import type { HomepageCopy } from "@/src/homepage/homepage-copy";

const howToImageSource = "/homepage/how-to-pixel-farm.webp";
const howToImageWidth = 1672;
const howToImageHeight = 941;

type HomepageHowToSectionProps = Readonly<{
  copy: HomepageCopy["howTo"];
}>;

export function HomepageHowToSection({ copy }: HomepageHowToSectionProps) {
  return (
    <section
      aria-labelledby="homepage-how-to-heading"
      data-homepage-content-section
      data-homepage-how-to
      id="how-to"
    >
      <h2 id="homepage-how-to-heading">{copy.heading}</h2>
      <div data-homepage-section-layout>
        <figure data-homepage-section-media>
          <img
            alt={copy.imageAlt}
            decoding="async"
            height={howToImageHeight}
            loading="lazy"
            src={howToImageSource}
            width={howToImageWidth}
          />
        </figure>
        <ol data-homepage-section-list>
          {copy.steps.map((step, stepIndex) => (
            <li key={step.title}>
              <span aria-hidden="true" data-homepage-section-index>
                {String(stepIndex + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
