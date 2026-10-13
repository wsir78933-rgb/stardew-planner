import type { HomepageCopy } from "@/src/homepage/homepage-copy";

export function HomepageToolComparisonSection({
  copy,
}: {
  copy: HomepageCopy["toolComparison"];
}) {
  return (
    <section
      aria-labelledby="homepage-tool-comparison-heading"
      data-homepage-tool-comparison="true"
      id="tool-comparison"
    >
      <header data-homepage-comparison-header="true">
        <h2 id="homepage-tool-comparison-heading">{copy.heading}</h2>
        <p>{copy.description}</p>
      </header>

      <div
        aria-label={copy.tableLabel}
        data-homepage-comparison-scroll="true"
        role="region"
        tabIndex={0}
      >
        <table data-homepage-comparison-table="true">
          <caption className="sr-only">{copy.heading}</caption>
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "26%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{copy.dimensionHeading}</th>
              {copy.columns.map((column, index) => {
                const isFeaturedColumn = index === 0;

                return (
                  <th
                    data-homepage-comparison-featured={
                      isFeaturedColumn ? "true" : undefined
                    }
                    key={column.href}
                    scope="col"
                  >
                    <div data-homepage-comparison-tool="true">
                      <span>{column.name}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row) => (
              <tr key={row.dimension}>
                <th scope="row">{row.dimension}</th>
                {row.cells.map((cell, index) => (
                  <td
                    data-homepage-comparison-featured={
                      index === 0 ? "true" : undefined
                    }
                    key={index}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
