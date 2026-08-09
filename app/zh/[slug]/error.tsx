"use client";

import { BlogError } from "../../../src/components/blog/blog-error";

export default function ChineseBlogPostError() {
  return (
    <BlogError
      description="暂时无法加载这篇农场规划指南。"
      retryHref="/zh/blog"
      retryLabel="浏览规划指南"
      title="无法加载这篇指南"
    />
  );
}
