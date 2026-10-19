import { PublicPicture } from "./public-picture";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";

type HomepageWhatIsSectionProps = Readonly<{
  copy: HomepageCopy["whatIs"];
}>;

export function HomepageWhatIsSection({ copy }: HomepageWhatIsSectionProps) {
  return (
    <section
      aria-labelledby="homepage-what-is-heading"
      data-homepage-content-section
      data-homepage-what-is
      id="what-is"
    >
      <h2 id="homepage-what-is-heading">{copy.heading}</h2>
      <div data-homepage-what-is-layout>
        <div data-homepage-what-is-copy>
          <p data-homepage-what-is-description>{copy.description}</p>
          {copy.items.map((item) => (
            <p key={item.title}>{item.description}</p>
          ))}
        </div>
        <figure data-homepage-what-is-media>
          <PublicPicture
            alt={copy.imageAlt}
            decoding="async"
            height={788}
            loading="lazy"
            src="/homepage/what-is/farm-layout-overview.webp"
            width={1076}
          />
        </figure>
      </div>
    </section>
  );
}
