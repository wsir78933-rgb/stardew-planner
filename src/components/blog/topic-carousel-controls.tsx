"use client";

type TopicCarouselControlsProperties = Readonly<{
  ariaLabel: string;
  hasItems?: boolean;
  nextLabel: string;
  previousLabel: string;
  trackId: string;
}>;

function scrollTopicTrack(trackId: string, direction: 1 | -1): void {
  const trackElement = document.getElementById(trackId);

  if (trackElement === null) {
    throw new Error(`Missing topic carousel track. Received: ${trackId}.`);
  }

  trackElement.scrollBy({ behavior: "smooth", left: trackElement.clientWidth * direction });
}

export function TopicCarouselControls({
  ariaLabel,
  hasItems = false,
  nextLabel,
  previousLabel,
  trackId,
}: TopicCarouselControlsProperties) {
  if (!hasItems) {
    return null;
  }

  return (
    <div aria-label={ariaLabel} className="blog-topic-carousel-controls">
      <button aria-controls={trackId} onClick={() => scrollTopicTrack(trackId, -1)} type="button">
        {previousLabel}
      </button>
      <button aria-controls={trackId} onClick={() => scrollTopicTrack(trackId, 1)} type="button">
        {nextLabel}
      </button>
    </div>
  );
}
