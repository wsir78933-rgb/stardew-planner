import {
  getLocalizedOfficialFarmGuide,
  getPublicPageCopy,
} from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import {
  officialFarmTypes,
  type OfficialFarmGuide,
  type OfficialFarmType,
} from "../reference/official-farm-guides";

function FarmStats({
  farmGuide,
  locale,
}: Readonly<{
  farmGuide: OfficialFarmGuide;
  locale: PublicLocale;
}>) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <dl className="public-farm-stats">
      <div>
        <dt>{pageCopy.tillableTilesLabel}</dt>
        <dd>{farmGuide.tillableTiles}</dd>
      </div>
      <div>
        <dt>{pageCopy.totalBuildableLabel}</dt>
        <dd>{farmGuide.totalBuildableTiles}</dd>
      </div>
      <div>
        <dt>{pageCopy.addedInLabel}</dt>
        <dd>{farmGuide.addedIn}</dd>
      </div>
    </dl>
  );
}

function FarmComparisonCard({
  farmType,
  locale,
}: Readonly<{
  farmType: OfficialFarmType;
  locale: PublicLocale;
}>) {
  const farmGuide = getLocalizedOfficialFarmGuide(locale, farmType);
  const pageCopy = getPublicPageCopy(locale);

  return (
    <article className="farm-comparison-card" id={farmGuide.id}>
      <img
        alt={`${farmGuide.title} ${pageCopy.previewLabel}`}
        className="farm-comparison-card__preview"
        loading="lazy"
        src={farmGuide.previewSource}
      />
      <div className="farm-comparison-card__body">
        <h3>{farmGuide.title}</h3>
        <FarmStats farmGuide={farmGuide} locale={locale} />
        <p className="farm-comparison-card__best-for">
          <strong>{pageCopy.bestForLabel}</strong> {farmGuide.bestFor}
        </p>
        <ul className="public-feature-list">
          {farmGuide.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {farmGuide.note ? (
          <p className="public-note">
            <strong>{pageCopy.noteLabel}</strong> {farmGuide.note}
          </p>
        ) : null}
        <a className="public-primary-cta" href={`/?farmType=${farmGuide.id}`}>
          {pageCopy.planThisFarmLabel}
        </a>
      </div>
    </article>
  );
}

function FarmQuickComparisonTable({ locale }: Readonly<{ locale: PublicLocale }>) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <section aria-labelledby="quick-comparison-heading">
      <h2 id="quick-comparison-heading">{pageCopy.quickComparisonLabel}</h2>
      <div className="farm-comparison-table-scroll">
        <table className="farm-comparison-table">
          <thead>
            <tr>
              <th scope="col">{pageCopy.farmTypesLabel}</th>
              <th scope="col">{pageCopy.tillableTilesLabel}</th>
              <th scope="col">{pageCopy.totalBuildableLabel}</th>
              <th scope="col">{pageCopy.addedInLabel}</th>
              <th scope="col">{pageCopy.knownForLabel}</th>
            </tr>
          </thead>
          <tbody>
            {officialFarmTypes.map((farmType) => {
              const farmGuide = getLocalizedOfficialFarmGuide(locale, farmType);

              return (
                <tr key={farmGuide.id}>
                  <td>
                    <a href={getLocalizedPublicPath(locale, `/farm/${farmGuide.id}`)}>
                      {farmGuide.title}
                    </a>
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

type FarmComparisonContentProperties = Readonly<{
  locale?: PublicLocale;
}>;

export function FarmComparisonContent({
  locale = "en",
}: FarmComparisonContentProperties) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <>
      <FarmQuickComparisonTable locale={locale} />
      <section className="farm-comparison-card-list" aria-label={pageCopy.farmDetailsLabel}>
        {officialFarmTypes.map((farmType) => (
          <FarmComparisonCard farmType={farmType} key={farmType} locale={locale} />
        ))}
      </section>
    </>
  );
}
