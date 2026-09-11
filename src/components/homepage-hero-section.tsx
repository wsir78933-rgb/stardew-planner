import { Button } from "@/components/ui/button";
import type { HomepageCopy, HomepageHeroFanImage } from "@/src/homepage/homepage-copy";

const HOMEPAGE_HERO_FAN_IMAGE_COUNT = 3;
const HOMEPAGE_HERO_FAN_IMAGE_WIDTH = 864;
const HOMEPAGE_HERO_FAN_IMAGE_HEIGHT = 1152;

type HomepageHeroSectionProps = Readonly<{
  copy: HomepageCopy["hero"];
  capabilitiesHref: string;
  capabilitiesLabel: string;
  plannerHref: string;
}>;

function requireHomepageHeroNonEmptyString(
  value: unknown,
  fieldPath: string,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Cannot render HomepageHeroSection: ${fieldPath}="${String(value)}" is empty`,
    );
  }

  return value;
}

function requireHomepageHeroFanImage(
  image: unknown,
  index: number,
): HomepageHeroFanImage {
  if (!image || typeof image !== "object") {
    throw new Error(
      `Cannot render HomepageHeroSection: fanImages[${index}]=${String(image)} is not a valid record`,
    );
  }

  const fanImageRecord = image as { src?: unknown; alt?: unknown };
  requireHomepageHeroNonEmptyString(fanImageRecord.src, `fanImages[${index}].src`);
  requireHomepageHeroNonEmptyString(fanImageRecord.alt, `fanImages[${index}].alt`);
  return fanImageRecord as HomepageHeroFanImage;
}

function requireHomepageHeroCopy(copy: HomepageCopy["hero"]): void {
  requireHomepageHeroNonEmptyString(copy.headlineBefore, "headlineBefore");
  requireHomepageHeroNonEmptyString(copy.headlineEmphasis, "headlineEmphasis");
  requireHomepageHeroNonEmptyString(copy.headlineAfter, "headlineAfter");
  requireHomepageHeroNonEmptyString(copy.supportingCopy, "supportingCopy");
  requireHomepageHeroNonEmptyString(copy.primaryActionLabel, "primaryActionLabel");
  requireHomepageHeroNonEmptyString(copy.trustedBy, "trustedBy");

  if (!Array.isArray(copy.fanImages)) {
    throw new Error(
      `Cannot render HomepageHeroSection: fanImages=${String(copy.fanImages)} is not an array`,
    );
  }

  if (copy.fanImages.length !== HOMEPAGE_HERO_FAN_IMAGE_COUNT) {
    throw new Error(
      `Cannot render HomepageHeroSection: fanImages.length=${copy.fanImages.length} expected ${HOMEPAGE_HERO_FAN_IMAGE_COUNT}`,
    );
  }

  copy.fanImages.forEach((fanImage, fanImageIndex) => {
    requireHomepageHeroFanImage(fanImage, fanImageIndex);
  });
}

function HomepageHeroImageFan({
  fanImages,
}: {
  fanImages: HomepageCopy["hero"]["fanImages"];
}) {
  return (
    <div data-homepage-hero-fan>
      {fanImages.map((fanImage) => (
        <div data-homepage-hero-fan-frame key={fanImage.src}>
          <img
            alt={fanImage.alt}
            decoding="async"
            height={HOMEPAGE_HERO_FAN_IMAGE_HEIGHT}
            src={fanImage.src}
            width={HOMEPAGE_HERO_FAN_IMAGE_WIDTH}
          />
        </div>
      ))}
    </div>
  );
}

export function HomepageHeroSection({
  copy,
  capabilitiesHref,
  capabilitiesLabel,
  plannerHref,
}: HomepageHeroSectionProps) {
  requireHomepageHeroCopy(copy);
  requireHomepageHeroNonEmptyString(capabilitiesHref, "capabilitiesHref");
  requireHomepageHeroNonEmptyString(capabilitiesLabel, "capabilitiesLabel");
  requireHomepageHeroNonEmptyString(plannerHref, "plannerHref");

  return (
    <section data-homepage-hero>
      <div data-homepage-hero-content>
        <h1>
          <span data-homepage-hero-title-line>
            {copy.headlineBefore}
            <em data-homepage-hero-emphasis>{copy.headlineEmphasis}</em>
          </span>
          <span data-homepage-hero-title-line>{copy.headlineAfter}</span>
        </h1>
        <p>{copy.supportingCopy}</p>
      </div>
      <div data-homepage-hero-actions>
        <div data-homepage-hero-cta-row>
          <Button asChild data-homepage-primary-action size="lg">
            <a href={plannerHref}>{copy.primaryActionLabel}</a>
          </Button>
          <Button asChild data-homepage-secondary-action size="lg" variant="outline">
            <a href={capabilitiesHref}>{capabilitiesLabel}</a>
          </Button>
        </div>
        <p data-homepage-hero-trusted-by>{copy.trustedBy}</p>
      </div>
      <HomepageHeroImageFan fanImages={copy.fanImages} />
    </section>
  );
}
