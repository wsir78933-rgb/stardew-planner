import type { HomepageCopy } from "@/src/homepage/homepage-copy";

const featuresImageSource = "/homepage/features-pixel-farm.webp";
const featuresImageWidth = 1672;
const featuresImageHeight = 941;

type HomepageFeaturesSectionProps = Readonly<{
  copy: HomepageCopy["features"];
}>;

export function HomepageFeaturesSection({ copy }: HomepageFeaturesSectionProps) {
  return (
    <section
      aria-labelledby="homepage-features-heading"
      data-homepage-content-section
      data-homepage-features
      id="capabilities"
    >
      <h2 id="homepage-features-heading">{copy.heading}</h2>
      <div data-homepage-section-layout>
        <figure data-homepage-section-media>
          <img
            alt={copy.imageAlt}
            decoding="async"
            height={featuresImageHeight}
            loading="lazy"
            src={featuresImageSource}
            width={featuresImageWidth}
          />
        </figure>
        <ol data-homepage-section-list>
          {copy.items.map((item, itemIndex) => (
            <li key={item.title}>
              <span aria-hidden="true" data-homepage-section-index>
                {String(itemIndex + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
