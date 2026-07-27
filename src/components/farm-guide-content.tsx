import type { OfficialFarmGuide } from "../reference/official-farm-guides";

type FarmGuideContentProperties = Readonly<{
  farmGuide: OfficialFarmGuide;
  otherFarmGuides: readonly OfficialFarmGuide[];
}>;

function FarmGuideStats({
  farmGuide,
}: Readonly<{
  farmGuide: OfficialFarmGuide;
}>) {
  return (
    <dl className="farm-guide-stats">
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

export function FarmGuideContent({
  farmGuide,
  otherFarmGuides,
}: FarmGuideContentProperties) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="public-breadcrumbs">
        <a href="/">Stardew Planner</a>
        <span aria-hidden="true">/</span>
        <a href="/farm-comparison">Farm types</a>
        <span aria-hidden="true">/</span>
        <span>{farmGuide.title}</span>
      </nav>
      <header className="farm-guide-hero">
        <img
          alt={`${farmGuide.title} preview`}
          className="farm-guide-hero__preview"
          src={farmGuide.previewSource}
        />
        <div className="farm-guide-hero__copy">
          <h1>{farmGuide.title}</h1>
          <p>{farmGuide.introduction}</p>
          <FarmGuideStats farmGuide={farmGuide} />
          <div className="farm-guide-hero__actions">
            <a className="public-primary-cta" href={`/?farmType=${farmGuide.id}`}>
              Plan this farm →
            </a>
            <a className="public-secondary-cta" href="/farm-comparison">
              Compare all farms
            </a>
          </div>
        </div>
      </header>
      <section className="farm-guide-section" aria-labelledby="farm-guide-features">
        <h2 id="farm-guide-features">What makes it different</h2>
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
      </section>
      <section className="farm-guide-section" aria-labelledby="other-farms-heading">
        <h2 id="other-farms-heading">Other farms</h2>
        <div className="farm-guide-sibling-grid">
          {otherFarmGuides.map((otherFarmGuide) => (
            <a href={`/farm/${otherFarmGuide.id}`} key={otherFarmGuide.id}>
              {otherFarmGuide.title}
            </a>
          ))}
        </div>
        <p className="farm-guide-section__footnote">
          Want them side by side? See the{" "}
          <a href="/farm-comparison">full comparison</a>.
        </p>
      </section>
    </>
  );
}
