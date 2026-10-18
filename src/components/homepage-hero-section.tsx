import { Button } from "@/components/ui/button";
import type { HomepageCopy, HomepageHeroFanImage } from "@/src/homepage/homepage-copy";
import { createPublicAvifSource, PublicPicture } from "./public-picture";

const HOMEPAGE_HERO_FAN_IMAGE_COUNT = 3;
const HOMEPAGE_HERO_FAN_IMAGE_WIDTH = 864;
const HOMEPAGE_HERO_FAN_IMAGE_HEIGHT = 1152;
const HOMEPAGE_HERO_MOBILE_IMAGE_WIDTH = 480;
const HOMEPAGE_HERO_WEBP_SUFFIX = ".webp";

// Fan slot from globals.css. <=700px caps the fan at 22rem; wider viewports cap it at 48rem.
// Section content is min(100vw, 1280px) minus clamp(1.25rem, 3vw, 3rem) on each side.
// Side frames are 34% then 38%. The center frame stays 42%. The image fills that frame inside a 1px border.
const HOMEPAGE_HERO_FAN_MOBILE_SLOT = "min(22rem, 100vw - 2 * clamp(1.25rem, 3vw, 3rem))";
const HOMEPAGE_HERO_FAN_DESKTOP_SLOT = "min(48rem, min(100vw, 1280px) - 2 * clamp(1.25rem, 3vw, 3rem))";
const HOMEPAGE_HERO_SIDE_IMAGE_SIZES = `(max-width: 700px) calc(0.34 * ${HOMEPAGE_HERO_FAN_MOBILE_SLOT} - 2px), calc(0.38 * ${HOMEPAGE_HERO_FAN_DESKTOP_SLOT} - 2px)`;
const HOMEPAGE_HERO_CENTER_IMAGE_SIZES = `(max-width: 700px) calc(0.42 * ${HOMEPAGE_HERO_FAN_MOBILE_SLOT} - 2px), calc(0.42 * ${HOMEPAGE_HERO_FAN_DESKTOP_SLOT} - 2px)`;

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

function createHomepageHeroCandidateSource(
  webpSource: string,
  candidateWidth: number,
  extension: "avif" | "webp",
): string {
  const originalAvifSource = createPublicAvifSource(webpSource);
  if (candidateWidth === HOMEPAGE_HERO_FAN_IMAGE_WIDTH) {
    return extension === "webp" ? webpSource : originalAvifSource;
  }
  if (candidateWidth !== HOMEPAGE_HERO_MOBILE_IMAGE_WIDTH) {
    throw new Error(
      `Cannot render HomepageHeroSection: candidateWidth=${candidateWidth} is not ${HOMEPAGE_HERO_MOBILE_IMAGE_WIDTH} or ${HOMEPAGE_HERO_FAN_IMAGE_WIDTH}`,
    );
  }

  const webpPathWithoutSuffix = webpSource.slice(0, -HOMEPAGE_HERO_WEBP_SUFFIX.length);
  return `${webpPathWithoutSuffix}-${HOMEPAGE_HERO_MOBILE_IMAGE_WIDTH}.${extension}`;
}

function createHomepageHeroSrcSet(webpSource: string, extension: "avif" | "webp"): string {
  const mobileSource = createHomepageHeroCandidateSource(
    webpSource,
    HOMEPAGE_HERO_MOBILE_IMAGE_WIDTH,
    extension,
  );
  const originalSource = createHomepageHeroCandidateSource(
    webpSource,
    HOMEPAGE_HERO_FAN_IMAGE_WIDTH,
    extension,
  );
  return `${mobileSource} ${HOMEPAGE_HERO_MOBILE_IMAGE_WIDTH}w, ${originalSource} ${HOMEPAGE_HERO_FAN_IMAGE_WIDTH}w`;
}

function homepageHeroFanImageSizes(fanImageIndex: number): string {
  if (fanImageIndex === 1) {
    return HOMEPAGE_HERO_CENTER_IMAGE_SIZES;
  }
  if (fanImageIndex === 0 || fanImageIndex === 2) {
    return HOMEPAGE_HERO_SIDE_IMAGE_SIZES;
  }

  throw new Error(
    `Cannot render HomepageHeroSection: fanImageIndex=${fanImageIndex} is outside 0..2`,
  );
}

function HomepageHeroImageFan({
  fanImages,
}: {
  fanImages: HomepageCopy["hero"]["fanImages"];
}) {
  return (
    <div data-homepage-hero-fan>
      {fanImages.map((fanImage, fanImageIndex) => (
        <div data-homepage-hero-fan-frame key={fanImage.src}>
          <PublicPicture
            alt={fanImage.alt}
            avifSrcSet={createHomepageHeroSrcSet(fanImage.src, "avif")}
            decoding="async"
            height={HOMEPAGE_HERO_FAN_IMAGE_HEIGHT}
            sizes={homepageHeroFanImageSizes(fanImageIndex)}
            src={fanImage.src}
            srcSet={createHomepageHeroSrcSet(fanImage.src, "webp")}
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
