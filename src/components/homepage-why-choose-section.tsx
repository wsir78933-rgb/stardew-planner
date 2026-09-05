import type { HomepageCopy } from "@/src/homepage/homepage-copy";

const whyChooseImageSource = "/homepage/why-choose-pixel-farm.webp";
const whyChooseImageWidth = 1672;
const whyChooseImageHeight = 941;

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
      <div data-homepage-section-layout>
        <figure data-homepage-section-media>
          <img
            alt={copy.imageAlt}
            decoding="async"
            height={whyChooseImageHeight}
            loading="lazy"
            src={whyChooseImageSource}
            width={whyChooseImageWidth}
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
