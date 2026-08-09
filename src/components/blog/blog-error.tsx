type BlogErrorProperties = Readonly<{
  description: string;
  retryHref: string;
  retryLabel: string;
  title: string;
}>;

export function BlogError({
  description,
  retryHref,
  retryLabel,
  title,
}: BlogErrorProperties) {
  return (
    <section data-blog-page="true" role="alert">
      <h1>{title}</h1>
      <p>{description}</p>
      <a href={retryHref}>{retryLabel}</a>
    </section>
  );
}
