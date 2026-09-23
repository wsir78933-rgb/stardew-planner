import { existsSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { PineTreeStardewEnglishArticle } from "../../src/blog/articles/pine-tree-stardew.en";
import { PineTreeStardewChineseArticle } from "../../src/blog/articles/pine-tree-stardew.zh";
import {
  blogPostCanonicalPaths,
  isBlogPostSlug,
} from "../../src/blog/blog-post-identities";

const projectRoot = join(import.meta.dirname, "../..");
const requiredPineTreePaths = [
  "src/blog/articles/pine-tree-stardew.en.tsx",
  "src/blog/articles/pine-tree-stardew.zh.tsx",
  "public/blog/pine-tree-stardew-cover.webp",
  "public/blog/illustrations/pine-tree-seed-to-tar.webp",
  "public/blog/illustrations/pine-tree-stage-four-neighbor.webp",
] as const;

function assertRequiredPineTreePathExists(relativePath: string): void {
  const absolutePath = join(projectRoot, relativePath);

  if (!existsSync(absolutePath)) {
    throw new Error(
      `Missing required pine-tree-stardew path. Received: ${absolutePath}.`,
    );
  }
}

it("registers the shared Pine Tree article identity for both locales", () => {
  for (const relativePath of requiredPineTreePaths) {
    assertRequiredPineTreePathExists(relativePath);
  }

  expect(isBlogPostSlug("pine-tree-stardew")).toBe(true);
  expect(blogPostCanonicalPaths).toContain("/pine-tree-stardew/");
  expect(blogPostCanonicalPaths).toContain("/zh/pine-tree-stardew/");
});

it("exposes the locked Pine Cone, stage-four, and Pine Tar angle in both bodies", () => {
  const englishMarkup = renderToStaticMarkup(
    createElement(PineTreeStardewEnglishArticle),
  );
  const chineseMarkup = renderToStaticMarkup(
    createElement(PineTreeStardewChineseArticle),
  );

  expect(englishMarkup).toContain("Pine Cone → Pine Tree → Pine Tar");
  expect(englishMarkup).toContain("all eight adjacent tiles");
  expect(englishMarkup).toContain("Pine Tapper production continues in Winter.");
  expect(englishMarkup).toContain(
    "A Pine Tar price alone cannot rank trees under a shared time horizon.",
  );
  expect(englishMarkup).toContain(
    "/blog/illustrations/pine-tree-seed-to-tar.webp",
  );
  expect(englishMarkup).toContain(
    "/blog/illustrations/pine-tree-stage-four-neighbor.webp",
  );

  expect(chineseMarkup).toContain(
    "松果 → 种出普通松树 → 等树成熟 → 在成熟松树上挂采集器 → 得到松焦油。",
  );
  expect(chineseMarkup).toContain("八个相邻格");
  expect(chineseMarkup).toContain("本文不发布阶段数字");
  expect(chineseMarkup).toContain("普通采集器按 5 天、重型采集器按 2 天规划");
  expect(chineseMarkup).toContain(
    "/blog/illustrations/pine-tree-seed-to-tar.webp",
  );
  expect(chineseMarkup).toContain(
    "/blog/illustrations/pine-tree-stage-four-neighbor.webp",
  );
});
