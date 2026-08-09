"use client";

import { BlogError } from "../../../src/components/blog/blog-error";

export default function BlogPostError() {
  return (
    <BlogError
      description="This planning guide could not be loaded."
      retryHref="/blog"
      retryLabel="Browse planning guides"
      title="Unable to load this guide"
    />
  );
}
