"use client";

import { useEffect, useState } from "react";
import { createUniqueHeadingAnchors } from "../../blog/table-of-contents-state";

type TableOfContentsEntry = Readonly<{
  anchor: string;
  level: 2 | 3;
  text: string;
}>;

type TableOfContentsProperties = Readonly<{
  articleId: string;
  label: string;
}>;

function collectTableOfContentsEntries(articleElement: HTMLElement): readonly TableOfContentsEntry[] {
  const headingElements = Array.from(articleElement.querySelectorAll("h2, h3"));
  const anchors = createUniqueHeadingAnchors(
    headingElements.map((headingElement) => headingElement.textContent?.trim() ?? ""),
  );

  return headingElements.map((headingElement, index) => {
    const anchor = anchors[index];
    headingElement.id = anchor;

    return {
      anchor,
      level: headingElement.tagName === "H2" ? 2 : 3,
      text: headingElement.textContent?.trim() ?? "",
    };
  });
}

function observeCurrentHeading(
  articleElement: HTMLElement,
  setCurrentAnchor: (anchor: string) => void,
): () => void {
  const headingElements = Array.from(articleElement.querySelectorAll<HTMLElement>("h2, h3"));

  if (headingElements.length === 0) {
    return () => undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      const latestVisibleEntry = visibleEntries.at(-1);

      if (latestVisibleEntry instanceof IntersectionObserverEntry) {
        setCurrentAnchor(latestVisibleEntry.target.id);
      }
    },
    { rootMargin: "0px 0px -70% 0px" },
  );

  headingElements.forEach((headingElement) => observer.observe(headingElement));

  return () => observer.disconnect();
}

export function TableOfContents({ articleId, label }: TableOfContentsProperties) {
  const [entries, setEntries] = useState<readonly TableOfContentsEntry[]>([]);
  const [currentAnchor, setCurrentAnchor] = useState("");

  useEffect(() => {
    const articleElement = document.getElementById(articleId);

    if (!(articleElement instanceof HTMLElement)) {
      throw new Error(`Missing blog article element. Received: ${articleId}.`);
    }

    const collectedEntries = collectTableOfContentsEntries(articleElement);
    setEntries(collectedEntries);
    setCurrentAnchor(collectedEntries[0]?.anchor ?? "");

    return observeCurrentHeading(articleElement, setCurrentAnchor);
  }, [articleId]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label} className="blog-table-of-contents">
      <p>{label}</p>
      <ol>
        {entries.map((entry) => (
          <li className={entry.level === 3 ? "blog-table-of-contents__subsection" : undefined} key={entry.anchor}>
            <a aria-current={entry.anchor === currentAnchor ? "location" : undefined} href={`#${entry.anchor}`}>
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
