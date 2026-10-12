import {
  FolderOpen,
  ImageDown,
  Leaf,
  Map,
  MousePointer2,
  Scan,
  type LucideIcon,
} from "lucide-react";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";

type HomepageFeatureIntroductionSectionProperties = Readonly<{
  copy: HomepageCopy["featureIntroduction"];
}>;

const featureIntroductionIconByName: Record<
  HomepageCopy["featureIntroduction"]["items"][number]["icon"],
  LucideIcon
> = {
  map: Map,
  layout: MousePointer2,
  coverage: Scan,
  seasons: Leaf,
  projects: FolderOpen,
  export: ImageDown,
};

export function HomepageFeatureIntroductionSection({
  copy,
}: HomepageFeatureIntroductionSectionProperties) {
  return (
    <section
      aria-labelledby="homepage-feature-introduction-heading"
      data-homepage-content-section
      data-homepage-feature-introduction
      id="capabilities"
    >
      <header data-homepage-feature-introduction-header>
        <h2 id="homepage-feature-introduction-heading">{copy.heading}</h2>
        <p data-homepage-feature-introduction-overview>{copy.description}</p>
      </header>
      <ul data-homepage-feature-introduction-list role="list">
        {copy.items.map((item) => {
          const FeatureIcon = featureIntroductionIconByName[item.icon];

          return (
            <li data-homepage-feature-introduction-item key={item.icon}>
              <article data-homepage-feature-introduction-card>
                <div data-homepage-feature-introduction-icon>
                  <FeatureIcon
                    aria-hidden="true"
                    focusable="false"
                    size={20}
                    strokeWidth={2}
                  />
                </div>
                <h3 data-homepage-feature-introduction-title>{item.title}</h3>
                <p data-homepage-feature-introduction-description>
                  {item.description}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
