import type { BlogCopy } from "../../blog/blog-copy";
import type { BlogPostMeta } from "../../blog/blog-post-registry";
import type { PublicLocale } from "../../i18n/public-locale";
import { ArticleGrid } from "./article-grid";

export type BlogHeroJumpTarget = Readonly<{
  href: "#latest-articles" | "#topic-carousel";
  label: string;
}>;

type BlogLandingHeroProperties = Readonly<{
  copy: BlogCopy;
  jumpTargets: readonly BlogHeroJumpTarget[];
  locale: PublicLocale;
  spotlightPosts: readonly BlogPostMeta[];
}>;

export function BlogLandingHero({
  copy,
  jumpTargets,
  locale,
  spotlightPosts,
}: BlogLandingHeroProperties) {
  return (
    <header className="blog-landing-hero">
      <div>
        <h1>{copy.blogTitle}</h1>
        <p>{copy.blogDescription}</p>
        {jumpTargets.length > 0 ? (
          <nav aria-label={copy.jumpToLabel} className="blog-landing-hero__jump-links">
            <span>{copy.jumpToLabel}</span>
            {jumpTargets.map((jumpTarget) => (
              <a href={jumpTarget.href} key={jumpTarget.href}>
                {jumpTarget.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
      {spotlightPosts.length > 0 ? (
        <section aria-label={copy.latestArticlesLabel}>
          <ArticleGrid copy={copy} locale={locale} posts={spotlightPosts.slice(0, 2)} />
        </section>
      ) : null}
    </header>
  );
}
