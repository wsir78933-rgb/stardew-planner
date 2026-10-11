import Image from "next/image";
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
          <Image
            alt={copy.imageAlt}
            height={788}
            src="/homepage/what-is/farm-layout-overview.png"
            unoptimized
            width={1076}
          />
        </figure>
      </div>
    </section>
  );
}
