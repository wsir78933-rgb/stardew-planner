"use client";

import { BlogError } from "../../../src/components/blog/blog-error";

export default function ChineseBlogIndexError() {
  return (
    <BlogError
      description="暂时无法加载农场规划指南。"
      retryHref="/zh/blog"
      retryLabel="返回规划指南"
      title="无法加载规划指南"
    />
  );
}
