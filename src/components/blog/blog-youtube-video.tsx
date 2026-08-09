"use client";

import { useState } from "react";

type BlogYouTubeVideoProps = Readonly<{
  youtubeVideoId: string;
  title: string;
  posterSrc: string;
  playLabel: string;
}>;

const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function createYouTubeNoCookieEmbedUrl(youtubeVideoId: string): string {
  if (!YOUTUBE_VIDEO_ID_PATTERN.test(youtubeVideoId)) {
    throw new Error(`Invalid YouTube video ID: ${JSON.stringify(youtubeVideoId)}.`);
  }

  return `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;
}

export function BlogYouTubeVideo({
  youtubeVideoId,
  title,
  posterSrc,
  playLabel,
}: BlogYouTubeVideoProps) {
  const embedUrl = createYouTubeNoCookieEmbedUrl(youtubeVideoId);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="blog-youtube-video">
      {isPlaying ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={embedUrl}
          title={title}
        />
      ) : (
        <button
          aria-label={playLabel}
          className="blog-youtube-video__poster"
          onClick={() => setIsPlaying(true)}
          type="button"
        >
          <img
            alt=""
            decoding="async"
            height="720"
            loading="lazy"
            src={posterSrc}
            width="1280"
          />
          <span aria-hidden="true" className="blog-youtube-video__play-icon">
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
