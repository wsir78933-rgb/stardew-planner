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
    expect(markup).not.toContain("sizes=");
    expect(markup).not.toContain(" 480w");
  });

  it("puts the same width candidates and sizes on the AVIF source and WebP img", () => {
    const markup = renderToStaticMarkup(
      createElement(PublicPicture, {
        alt: "A farm cover",
        avifSrcSet: "/blog/cover-480.avif 480w, /blog/cover.avif 1672w",
        decoding: "async",
        height: 941,
        sizes: "(max-width: 700px) 120px, 320px",
        src: "/blog/cover.webp",
        srcSet: "/blog/cover-480.webp 480w, /blog/cover.webp 1672w",
        width: 1672,
      }),
    );

    expect(markup).toContain(
      'srcSet="/blog/cover-480.avif 480w, /blog/cover.avif 1672w"',
    );
    expect(markup).toContain(
      'srcSet="/blog/cover-480.webp 480w, /blog/cover.webp 1672w"',
    );
    expect(markup).toContain('type="image/avif"');
    expect(markup).toContain('src="/blog/cover.webp"');
    expect(markup.match(/sizes="\(max-width: 700px\) 120px, 320px"/g)).toHaveLength(2);
    expect(markup).not.toContain('loading="lazy"');
  });

  it("rejects responsive props unless srcSet, avifSrcSet, and sizes arrive together", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(PublicPicture, {
          alt: "A farm cover",
          avifSrcSet: "/blog/cover.avif 1672w",
          src: "/blog/cover.webp",
          srcSet: "/blog/cover-480.webp 480w, /blog/cover.webp 1672w",
        }),
      ),
    ).toThrow(JSON.stringify({
      avifSrcSet: "/blog/cover.avif 1672w",
      sizes: null,
      srcSet: "/blog/cover-480.webp 480w, /blog/cover.webp 1672w",
    }));
  });

  it("rejects a blank sizes value", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(PublicPicture, {
          alt: "A farm cover",
          avifSrcSet: "/blog/cover-480.avif 480w, /blog/cover.avif 1672w",
          sizes: "   ",
          src: "/blog/cover.webp",
          srcSet: "/blog/cover-480.webp 480w, /blog/cover.webp 1672w",
        }),
      ),
    ).toThrow(JSON.stringify("   "));
  });

  it("rejects a width candidate that is not the expected image type", () => {
    expect(() =>
      renderToStaticMarkup(
        createElement(PublicPicture, {
          alt: "A farm cover",
          avifSrcSet: "/blog/cover-480.avif 480w, /blog/cover.png 1672w",
          sizes: "320px",
          src: "/blog/cover.webp",
          srcSet: "/blog/cover-480.webp 480w, /blog/cover.webp 1672w",
        }),
      ),
    ).toThrow(JSON.stringify("/blog/cover.png 1672w"));
  });
});
