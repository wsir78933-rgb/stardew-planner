import {
  formatPublicPageCopy,
  getLocalizedOfficialFarmComparisonCards,
  getPublicPageCopy,
} from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";
import {
  officialFarmComparisonSourceHref,
  type OfficialFarmComparisonCard,
} from "../reference/official-farm-comparison-content";

function FarmStats({
  comparisonCard,
  locale,
}: Readonly<{
  comparisonCard: OfficialFarmComparisonCard;
  locale: PublicLocale;
}>) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <dl className="public-farm-stats">
      <div>
        <dt>{pageCopy.tillableTilesLabel}</dt>
        <dd>{comparisonCard.tillableTiles}</dd>
      </div>
      <div>
        <dt>{pageCopy.totalBuildableLabel}</dt>
        <dd>{comparisonCard.totalBuildableTiles}</dd>
      </div>
      <div>
        <dt>{pageCopy.addedInLabel}</dt>
        <dd>{comparisonCard.addedIn}</dd>
      </div>
    </dl>
  );
}

function FarmComparisonCard({
  comparisonCard,
  locale,
}: Readonly<{
  comparisonCard: OfficialFarmComparisonCard;
  locale: PublicLocale;
}>) {
  const pageCopy = getPublicPageCopy(locale);
  const localizedPlannerHomepagePath = getLocalizedPublicPath(locale, "/");
  const localizedFarmGuidePath = getLocalizedPublicPath(
    locale,
    `/farm/${comparisonCard.id}`,
  );

  return (
    <article className="farm-comparison-card" id={comparisonCard.id}>
      <img
        alt={formatPublicPageCopy(pageCopy.previewTemplate, {
          farmName: comparisonCard.title,
        })}
        className="farm-comparison-card__preview"
        decoding="async"
        loading="lazy"
        src={comparisonCard.previewSource}
      />
      <div className="farm-comparison-card__body">
        <h3>{comparisonCard.title}</h3>
        <p className="farm-comparison-card__summary">{comparisonCard.summary}</p>
        <FarmStats comparisonCard={comparisonCard} locale={locale} />
        <p className="farm-comparison-card__detail">
          <strong>{pageCopy.farmComparisonBestForLabel}</strong>{" "}
          {comparisonCard.bestFor}
        </p>
        <p className="farm-comparison-card__detail">
          <strong>{pageCopy.farmComparisonTradeoffLabel}</strong>{" "}
          {comparisonCard.tradeoff}
        </p>
        <p className="farm-comparison-card__detail">
          <strong>{pageCopy.farmComparisonPlanningNoteLabel}</strong>{" "}
          {comparisonCard.planningNote}
        </p>
        <h4>{pageCopy.farmComparisonFactsLabel}</h4>
        <ul className="public-feature-list farm-comparison-card__facts">
          {comparisonCard.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <div className="farm-comparison-card__actions">
          <a className="public-secondary-cta" href={localizedFarmGuidePath}>
            {pageCopy.farmComparisonGuideLabel}
          </a>
          <a
            className="public-primary-cta"
            href={`${localizedPlannerHomepagePath}?farmType=${comparisonCard.id}`}
          >
            {formatPublicPageCopy(pageCopy.planFarmTemplate, {
              farmName: comparisonCard.title,
            })}
          </a>
        </div>
      </div>
    </article>
  );
}

function FarmRecommendations({ locale }: Readonly<{ locale: PublicLocale }>) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <section
      aria-labelledby="farm-recommendations-heading"
      className="farm-comparison-recommendations"
    >
      <h2 id="farm-recommendations-heading">
        {pageCopy.farmComparisonRecommendationsTitle}
      </h2>
      <div className="farm-comparison-recommendation-list">
        {pageCopy.farmComparisonRecommendations.map((recommendation) => (
          <a
            data-farm-recommendation=""
            href={`#${recommendation.farmType}`}
            key={recommendation.farmType}
          >
            <h3>{recommendation.heading}</h3>
            <p>{recommendation.description}</p>
          </a>
        ))}
      </div>
      <p className="farm-comparison-recommendations__note">
        {pageCopy.farmComparisonNoUniversalBest}
      </p>
    </section>
  );
}

function FarmQuickComparisonTable({
  comparisonCards,
  locale,
}: Readonly<{
  comparisonCards: readonly OfficialFarmComparisonCard[];
  locale: PublicLocale;
}>) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <section
      aria-labelledby="quick-comparison-heading"
      className="farm-comparison-quick-table"
    >
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
            {comparisonCards.map((comparisonCard) => (
                <tr key={comparisonCard.id}>
                  <td>
                    <a href={getLocalizedPublicPath(locale, `/farm/${comparisonCard.id}`)}>
                      {comparisonCard.title}
                    </a>
                  </td>
                  <td>{comparisonCard.tillableTiles}</td>
                  <td>{comparisonCard.totalBuildableTiles}</td>
                  <td>{comparisonCard.addedIn}</td>
                  <td>{comparisonCard.knownFor}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FarmComparisonMethod({ locale }: Readonly<{ locale: PublicLocale }>) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <section
      aria-labelledby="farm-comparison-method-heading"
      className="farm-comparison-method"
    >
      <h2 id="farm-comparison-method-heading">
        {pageCopy.farmComparisonMethodTitle}
      </h2>
      <p>{pageCopy.farmComparisonMethodDescription}</p>
      <a href={officialFarmComparisonSourceHref}>
        {pageCopy.farmComparisonSourceLabel}
      </a>
    </section>
  );
}

type FarmComparisonContentProperties = Readonly<{
  locale: PublicLocale;
}>;

export function FarmComparisonContent({ locale }: FarmComparisonContentProperties) {
  const pageCopy = getPublicPageCopy(locale);
  const comparisonCards = getLocalizedOfficialFarmComparisonCards(locale);

  return (
    <>
      <FarmRecommendations locale={locale} />
      <FarmQuickComparisonTable
        comparisonCards={comparisonCards}
        locale={locale}
      />
      <FarmComparisonMethod locale={locale} />
      <section
        aria-labelledby="farm-map-details-heading"
        className="farm-comparison-details"
      >
        <h2 id="farm-map-details-heading">{pageCopy.farmComparisonCardsTitle}</h2>
        <div className="farm-comparison-card-list" aria-label={pageCopy.farmDetailsLabel}>
          {comparisonCards.map((comparisonCard) => (
            <FarmComparisonCard
              comparisonCard={comparisonCard}
              key={comparisonCard.id}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </>
  );
}
