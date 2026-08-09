import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  BlogYouTubeVideo,
  createYouTubeNoCookieEmbedUrl,
} from "../../src/components/blog/blog-youtube-video";

describe("BlogYouTubeVideo", () => {
  it("renders only a local lazy-loaded WebP poster before the visitor clicks play", () => {
    const markup = renderToStaticMarkup(
      createElement(BlogYouTubeVideo, {
        youtubeVideoId: "BY5C6xZCdDI",
        title: "How to build and place a coop",
        posterSrc: "/blog/video-posters/carpenter-coop-guide.webp",
        playLabel: "Play the building guide",
      }),
    );

    expect(markup).toContain('type="button"');
    expect(markup).toContain('src="/blog/video-posters/carpenter-coop-guide.webp"');
    expect(markup).toContain('loading="lazy"');
    expect(markup).toContain('aria-label="Play the building guide"');
    expect(markup).not.toContain("<iframe");
    expect(markup).not.toContain("youtube.com");
    expect(markup).not.toContain("youtube-nocookie.com");
  });

  it("builds a privacy-enhanced embed URL only for a valid YouTube video ID", () => {
    expect(createYouTubeNoCookieEmbedUrl("bFEEer6Cp3U")).toBe(
      "https://www.youtube-nocookie.com/embed/bFEEer6Cp3U?autoplay=1&rel=0",
    );
    expect(() => createYouTubeNoCookieEmbedUrl("not a video id")).toThrow(
      'Invalid YouTube video ID: "not a video id".',
    );
  });
});
