import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { HomepageToolComparisonSection } from "@/src/components/homepage-tool-comparison-section";
import { HOMEPAGE_LOCALES } from "@/src/homepage/homepage-locale";
import { homepageCopyByLocale } from "@/src/homepage/homepage-copy";

test("renders accessible plain-text planner labels for both locales", () => {
  for (const homepageLocale of HOMEPAGE_LOCALES) {
    const comparisonCopy = homepageCopyByLocale[homepageLocale].toolComparison;
    const comparisonMarkup = renderToStaticMarkup(
      createElement(HomepageToolComparisonSection, { copy: comparisonCopy }),
    );
    const comparisonRegionTag = comparisonMarkup.match(
      /<div\b[^>]*data-homepage-comparison-scroll="true"[^>]*>/,
    )?.[0];
    const comparisonTableMarkup = comparisonMarkup.match(
      /<table\b[\s\S]*?<\/table>/,
    )?.[0];

    expect(comparisonMarkup).toContain('id="tool-comparison"');
    expect(comparisonMarkup).toContain('data-homepage-tool-comparison="true"');
    expect(comparisonMarkup).toContain(
      'aria-labelledby="homepage-tool-comparison-heading"',
    );
    expect(comparisonMarkup).toContain(
      '<h2 id="homepage-tool-comparison-heading">',
    );
    expect(comparisonMarkup).toContain(comparisonCopy.heading);
    expect(comparisonMarkup).toContain(comparisonCopy.description);
    expect(comparisonMarkup.match(/<a\b/g)).toBeNull();
    expect(comparisonMarkup).not.toContain("data-homepage-comparison-site");
    expect(comparisonMarkup).not.toContain("data-homepage-comparison-note");
    expect(comparisonMarkup).not.toMatch(/<small\b/);
    expect(comparisonRegionTag).toContain(`aria-label="${comparisonCopy.tableLabel}"`);
    expect(comparisonRegionTag).toContain('role="region"');
    expect(comparisonRegionTag).toContain('tabindex="0"');
    expect(comparisonTableMarkup?.match(/<a\b/g)).toBeNull();
    expect(comparisonTableMarkup).toContain(
      `<caption class="sr-only">${comparisonCopy.heading}</caption>`,
    );
    expect(comparisonTableMarkup).toContain(comparisonCopy.dimensionHeading);
    for (const plannerColumn of comparisonCopy.columns) {
      expect(comparisonTableMarkup).toContain(plannerColumn.name);
    }

    const columnHeaderTags = Array.from(
      comparisonTableMarkup?.matchAll(/<th\b[^>]*scope="col"[^>]*>/g) ?? [],
      ([columnHeaderTag]) => columnHeaderTag,
    );
    const comparisonBodyMarkup = comparisonTableMarkup?.match(
      /<tbody\b[\s\S]*?<\/tbody>/,
    )?.[0];
    const comparisonRows = comparisonBodyMarkup?.match(
      /<tr\b[\s\S]*?<\/tr>/g,
    );

    expect(columnHeaderTags).toHaveLength(4);

    expect(comparisonRows).toHaveLength(6);
    for (const comparisonRow of comparisonRows ?? []) {
      expect(comparisonRow.match(/<th\b[^>]*scope="row"/g)).toHaveLength(1);
      expect(comparisonRow.match(/<td\b/g)).toHaveLength(3);
    }
    expect(
      comparisonTableMarkup?.match(/data-homepage-comparison-featured="true"/g),
    ).toHaveLength(7);
  }
});
