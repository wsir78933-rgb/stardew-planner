import { officialFarmTypes, officialFarmGuides } from "../reference/official-farm-guides";

function FarmStats({
  farmGuide,
}: Readonly<{
  farmGuide: (typeof officialFarmGuides)[(typeof officialFarmTypes)[number]];
}>) {
  return (
    <dl className="public-farm-stats">
      <div>
        <dt>Tillable tiles</dt>
        <dd>{farmGuide.tillableTiles}</dd>
      </div>
      <div>
        <dt>Total buildable</dt>
        <dd>{farmGuide.totalBuildableTiles}</dd>
      </div>
      <div>
        <dt>Added in</dt>
        <dd>{farmGuide.addedIn}</dd>
      </div>
    </dl>
  );
}

function FarmComparisonCard({
  farmType,
}: Readonly<{
  farmType: (typeof officialFarmTypes)[number];
}>) {
  const farmGuide = officialFarmGuides[farmType];

  return (
    <article className="farm-comparison-card" id={farmGuide.id}>
      <img
        alt={`${farmGuide.title} preview`}
        className="farm-comparison-card__preview"
        loading="lazy"
        src={farmGuide.previewSource}
      />
      <div className="farm-comparison-card__body">
        <h3>{farmGuide.title}</h3>
        <FarmStats farmGuide={farmGuide} />
        <p className="farm-comparison-card__best-for">
          <strong>Best for:</strong> {farmGuide.bestFor}
        </p>
        <ul className="public-feature-list">
          {farmGuide.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {farmGuide.note ? (
          <p className="public-note">
            <strong>Note:</strong> {farmGuide.note}
          </p>
        ) : null}
        <a className="public-primary-cta" href={`/?farmType=${farmGuide.id}`}>
          Plan a {farmGuide.title} →
        </a>
      </div>
    </article>
  );
}

function FarmQuickComparisonTable() {
  return (
    <section aria-labelledby="quick-comparison-heading">
      <h2 id="quick-comparison-heading">Quick comparison</h2>
      <div className="farm-comparison-table-scroll">
        <table className="farm-comparison-table">
          <thead>
            <tr>
              <th scope="col">Farm</th>
              <th scope="col">Tillable tiles</th>
              <th scope="col">Total buildable</th>
              <th scope="col">Added</th>
              <th scope="col">Known for</th>
            </tr>
          </thead>
          <tbody>
            {officialFarmTypes.map((farmType) => {
              const farmGuide = officialFarmGuides[farmType];

              return (
                <tr key={farmGuide.id}>
                  <td>
                    <a href={`/farm/${farmGuide.id}`}>{farmGuide.title}</a>
                  </td>
                  <td>{farmGuide.tillableTiles}</td>
                  <td>{farmGuide.totalBuildableTiles}</td>
                  <td>{farmGuide.addedIn}</td>
                  <td>{farmGuide.features[0]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function FarmComparisonContent() {
  return (
    <>
      <FarmQuickComparisonTable />
      <section className="farm-comparison-card-list" aria-label="Farm details">
        {officialFarmTypes.map((farmType) => (
          <FarmComparisonCard farmType={farmType} key={farmType} />
        ))}
      </section>
    </>
  );
}
