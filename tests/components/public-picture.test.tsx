import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  createPublicAvifSource,
  PublicPicture,
} from "../../src/components/public-picture";

describe("createPublicAvifSource", () => {
  it("replaces a public WebP suffix with AVIF", () => {
    expect(createPublicAvifSource("/blog/cover.webp")).toBe("/blog/cover.avif");
  });

  it.each(["", "/blog/cover.png", "/blog/.webp"])(
    "rejects an invalid public image source %j",
    (receivedSource) => {
      expect(() => createPublicAvifSource(receivedSource)).toThrow(
        JSON.stringify(receivedSource),
      );
    },
  );
});

describe("PublicPicture", () => {
  it("renders AVIF first and preserves the WebP img fallback attributes", () => {
    const markup = renderToStaticMarkup(
      createElement(PublicPicture, {
        alt: "A farm cover",
        "data-test-image": "public",
        decoding: "async",
        height: 941,
        loading: "lazy",
        src: "/blog/cover.webp",
        width: 1672,
      }),
    );

    expect(markup).toContain('<picture class="public-picture" data-public-picture="true">');
    expect(markup).toContain('srcSet="/blog/cover.avif"');
    expect(markup).toContain('type="image/avif"');
    expect(markup).toContain('alt="A farm cover"');
    expect(markup).toContain('data-test-image="public"');
    expect(markup).toContain('src="/blog/cover.webp"');
    expect(markup).toContain('width="1672"');
    expect(markup).toContain('height="941"');
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('decoding="async"');
  });
});
