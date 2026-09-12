import { LayoutGrid, Mountain, Route } from "lucide-react";
import type { HomepageCopy } from "@/src/homepage/homepage-copy";
import { HowItWorks, type HowItWorksStep } from "./how-it-works";

type HomepageHowToSectionProps = Readonly<{
  copy: HomepageCopy["howTo"];
}>;

function createHowItWorksSteps(
  copySteps: HomepageCopy["howTo"]["steps"],
): readonly [HowItWorksStep, HowItWorksStep, HowItWorksStep] {
  return [
    {
      icon: <Mountain className="h-6 w-6" />,
      title: copySteps[0].title,
      description: copySteps[0].description,
      benefits: copySteps[0].benefits,
    },
    {
      icon: <LayoutGrid className="h-6 w-6" />,
      title: copySteps[1].title,
      description: copySteps[1].description,
      benefits: copySteps[1].benefits,
    },
    {
      icon: <Route className="h-6 w-6" />,
      title: copySteps[2].title,
      description: copySteps[2].description,
      benefits: copySteps[2].benefits,
    },
  ];
}

export function HomepageHowToSection({ copy }: HomepageHowToSectionProps) {
  return (
    <section
      aria-labelledby="homepage-how-to-heading"
      data-homepage-content-section
      data-homepage-how-to
      id="how-to"
    >
      <HowItWorks
        className="px-0 py-0 sm:py-0"
        description={copy.description}
        heading={copy.heading}
        headingId="homepage-how-to-heading"
        steps={createHowItWorksSteps(copy.steps)}
      />
    </section>
  );
}
