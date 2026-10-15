import { Button } from "@/components/ui/button";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";
import { ArrowRightIcon } from "lucide-react";
import { getBlogCopy } from "../../blog/blog-copy";
import { publicLocales, type PublicLocale } from "../../i18n/public-locale";
import { getLocalizedPublicPath } from "../../i18n/public-route-registry";
import { PublicPicture } from "../public-picture";

const BLOG_PLANNER_CTA_IMAGE_SOURCE = "/homepage/cases/farm-case-01.webp";
const BLOG_PLANNER_CTA_IMAGE_WIDTH = 1280;
const BLOG_PLANNER_CTA_IMAGE_HEIGHT = 1040;

type BlogPlannerCtaProperties = Readonly<{
  locale: PublicLocale;
}>;

const blogSourcesHeadingLocaleByHeading: Readonly<Record<string, PublicLocale>> = {
  Sources: "en",
  来源: "zh-CN",
  资料来源: "zh-CN",
};

function requireNonEmptyBlogPlannerCtaString(value: string, fieldName: string): void {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `Blog planner CTA ${fieldName} must be a non-empty string. Received: ${JSON.stringify(value)}.`,
    );
  }
}

export function getBlogPlannerCtaLocaleFromSourcesHeading(heading: string): PublicLocale {
  requireNonEmptyBlogPlannerCtaString(heading, "sources heading");

  const locale = blogSourcesHeadingLocaleByHeading[heading];

  if (locale === undefined || !publicLocales.includes(locale)) {
    throw new Error(
      `Blog sources heading does not map to a public locale. Received: ${JSON.stringify(heading)}.`,
    );
  }

  return locale;
}

export function BlogPlannerCta({ locale }: BlogPlannerCtaProperties) {
  if (!publicLocales.includes(locale)) {
    throw new Error(`Unsupported blog planner CTA locale. Received: ${JSON.stringify(locale)}.`);
  }

  const blogCopy = getBlogCopy(locale);
  const heroCopy = homepageCopyByLocale[locale].hero;
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  requireNonEmptyBlogPlannerCtaString(heroCopy.headlineBefore, "headline before");
  requireNonEmptyBlogPlannerCtaString(heroCopy.headlineEmphasis, "headline emphasis");
  requireNonEmptyBlogPlannerCtaString(heroCopy.headlineAfter, "headline after");
  requireNonEmptyBlogPlannerCtaString(heroCopy.supportingCopy, "supporting copy");
  requireNonEmptyBlogPlannerCtaString(blogCopy.plannerCtaActionLabel, "action label");
  requireNonEmptyBlogPlannerCtaString(blogCopy.plannerCtaNote, "note");
  requireNonEmptyBlogPlannerCtaString(blogCopy.plannerCtaImageAlt, "image alt");
  requireNonEmptyBlogPlannerCtaString(plannerHref, "planner href");

  return (
    <section
      aria-labelledby="blog-planner-cta-heading"
      className="blog-planner-cta"
      data-blog-planner-cta="true"
    >
      <div className="blog-planner-cta__content">
        <div className="blog-planner-cta__copy">
          <p className="blog-planner-cta__heading" id="blog-planner-cta-heading">
            <span className="blog-planner-cta__heading-line">
              {heroCopy.headlineBefore}
              <em>{heroCopy.headlineEmphasis}</em>
            </span>
            <span className="blog-planner-cta__heading-line">
              {heroCopy.headlineAfter}
            </span>
          </p>
          <p className="blog-planner-cta__description">{heroCopy.supportingCopy}</p>
          <Button asChild data-blog-planner-cta-action="true" size="lg">
            <a href={plannerHref}>
              {blogCopy.plannerCtaActionLabel}
              <ArrowRightIcon aria-hidden="true" data-icon="inline-end" />
            </a>
          </Button>
          <p className="blog-planner-cta__note">{blogCopy.plannerCtaNote}</p>
        </div>
        <PublicPicture
          alt={blogCopy.plannerCtaImageAlt}
          className="blog-planner-cta__image"
          data-blog-planner-cta-image="true"
          decoding="async"
          height={BLOG_PLANNER_CTA_IMAGE_HEIGHT}
          loading="lazy"
          src={BLOG_PLANNER_CTA_IMAGE_SOURCE}
          width={BLOG_PLANNER_CTA_IMAGE_WIDTH}
        />
      </div>
    </section>
  );
}
