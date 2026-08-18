export const blogPostSlugs = [
  "carpenter-stardew",
  "where-is-robin-stardew-valley",
  "stardew-valley-npc",
] as const;

export type BlogPostSlug = (typeof blogPostSlugs)[number];

export const blogPostCanonicalPaths: readonly (
  | `/${BlogPostSlug}/`
  | `/zh/${BlogPostSlug}/`
)[] = [
  ...blogPostSlugs.map((slug) => `/${slug}/` as const),
  ...blogPostSlugs.map((slug) => `/zh/${slug}/` as const),
];

export function isBlogPostSlug(value: unknown): value is BlogPostSlug {
  return typeof value === "string" && blogPostSlugs.includes(value as BlogPostSlug);
}
