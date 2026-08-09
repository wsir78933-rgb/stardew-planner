import { buildBlogHomeHref } from "../../blog/blog-home-state";
import type { BlogCopy } from "../../blog/blog-copy";
import type { BlogHomeState } from "../../blog/blog-home-state";
import type { PublicLocale } from "../../i18n/public-locale";

type BlogDiscoveryControlsProperties = Readonly<{
  copy: BlogCopy;
  homeState: BlogHomeState;
  locale: PublicLocale;
}>;

export function BlogDiscoveryControls({
  copy,
  homeState,
  locale,
}: BlogDiscoveryControlsProperties) {
  const formAction = buildBlogHomeHref(locale, {});

  return (
    <section aria-labelledby="blog-discovery-heading" className="blog-discovery-controls">
      <h2 id="blog-discovery-heading">{copy.topicLabel}</h2>
      <nav aria-label={copy.topicLabel}>
        <a
          aria-current={homeState.topic.length === 0 ? "page" : undefined}
          href={buildBlogHomeHref(locale, { q: homeState.query })}
        >
          {copy.allTopicsLabel}
        </a>
        {homeState.topics.map((topic) => (
          <a
            aria-current={homeState.topic === topic ? "page" : undefined}
            href={buildBlogHomeHref(locale, { q: homeState.query, topic })}
            key={topic}
          >
            {topic}
          </a>
        ))}
      </nav>
      <form action={formAction} method="get">
        <label htmlFor="blog-title-search">{copy.searchLabel}</label>
        {homeState.topic.length > 0 ? (
          <input name="topic" type="hidden" value={homeState.topic} />
        ) : null}
        <input
          id="blog-title-search"
          name="q"
          placeholder={copy.searchPlaceholder}
          type="search"
          defaultValue={homeState.query}
        />
        <button type="submit">{copy.searchSubmitLabel}</button>
      </form>
    </section>
  );
}
