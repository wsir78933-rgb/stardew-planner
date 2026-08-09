"use client";

import { BlogError } from "../../../src/components/blog/blog-error";

export default function BlogIndexError() {
  return (
    <BlogError
      description="The planning guides could not be loaded."
      retryHref="/blog"
      retryLabel="Return to planning guides"
      title="Unable to load planning guides"
    />
  );
}
