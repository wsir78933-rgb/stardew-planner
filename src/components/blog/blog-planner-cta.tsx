import { Button } from "@/components/ui/button";
import { getBlogCopy } from "../../blog/blog-copy";
import { getPublicPageCopy } from "../../i18n/public-page-content";
import { publicLocales, type PublicLocale } from "../../i18n/public-locale";
import { getLocalizedPublicPath } from "../../i18n/public-route-registry";

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

  const heading = getBlogCopy(locale).plannerCtaHeading;
  const actionLabel = getPublicPageCopy(locale).navigation.plannerActionLabel;
  const plannerHref = `${getLocalizedPublicPath(locale, "/")}#planner`;

  requireNonEmptyBlogPlannerCtaString(heading, "heading");
  requireNonEmptyBlogPlannerCtaString(actionLabel, "action label");
  requireNonEmptyBlogPlannerCtaString(plannerHref, "planner href");

  return (
    <section
      aria-labelledby="blog-planner-cta-heading"
      className="blog-planner-cta"
      data-blog-planner-cta="true"
    >
      <div className="blog-planner-cta__content">
        <p className="blog-planner-cta__heading" id="blog-planner-cta-heading">
          {heading}
        </p>
        <Button asChild data-blog-planner-cta-action="true" size="lg">
          <a href={plannerHref}>{actionLabel}</a>
        </Button>
      </div>
    </section>
  );
}
