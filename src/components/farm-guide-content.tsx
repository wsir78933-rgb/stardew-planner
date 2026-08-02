import type { OfficialFarmGuide } from "../reference/official-farm-guides";
import {
  formatPublicPageCopy,
  getLocalizedOfficialFarmGuide,
  getPublicPageCopy,
} from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";

type FarmGuideContentProperties = Readonly<{
  farmGuide: OfficialFarmGuide;
  otherFarmGuides: readonly OfficialFarmGuide[];
  locale: PublicLocale;
}>;

function FarmGuideStats({
  farmGuide,
  locale,
}: Readonly<{
  farmGuide: OfficialFarmGuide;
  locale: PublicLocale;
}>) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <dl className="farm-guide-stats">
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

export function FarmGuideContent({
  farmGuide,
  otherFarmGuides,
  locale,
}: FarmGuideContentProperties) {
  const localizedFarmGuide = getLocalizedOfficialFarmGuide(locale, farmGuide.id);
  const localizedOtherFarmGuides = otherFarmGuides.map((otherFarmGuide) =>
    getLocalizedOfficialFarmGuide(locale, otherFarmGuide.id),
  );
  const pageCopy = getPublicPageCopy(locale);

  return (
    <>
      <nav aria-label={pageCopy.breadcrumbLabel} className="public-breadcrumbs">
        <a href="/">{pageCopy.brandLabel}</a>
        <span aria-hidden="true">/</span>
        <a href={getLocalizedPublicPath(locale, "/farm-comparison")}>
          {pageCopy.farmTypesLabel}
        </a>
        <span aria-hidden="true">/</span>
        <span>{localizedFarmGuide.title}</span>
      </nav>
      <header className="farm-guide-hero">
        <img
          alt={formatPublicPageCopy(pageCopy.previewTemplate, {
            farmName: localizedFarmGuide.title,
          })}
          className="farm-guide-hero__preview"
          src={localizedFarmGuide.previewSource}
        />
        <div className="farm-guide-hero__copy">
          <h1>{localizedFarmGuide.title}</h1>
          <p>{localizedFarmGuide.introduction}</p>
          <FarmGuideStats farmGuide={localizedFarmGuide} locale={locale} />
          <div className="farm-guide-hero__actions">
            <a className="public-primary-cta" href={`/?farmType=${localizedFarmGuide.id}`}>
              {pageCopy.planThisFarmLabel}
            </a>
            <a
              className="public-secondary-cta"
              href={getLocalizedPublicPath(locale, "/farm-comparison")}
            >
              {pageCopy.compareAllFarmsLabel}
            </a>
          </div>
        </div>
      </header>
      <section className="farm-guide-section" aria-labelledby="farm-guide-features">
        <h2 id="farm-guide-features">{pageCopy.whatMakesItDifferentLabel}</h2>
        <ul className="public-feature-list">
          {localizedFarmGuide.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {localizedFarmGuide.note ? (
          <p className="public-note">
            <strong>{pageCopy.noteLabel}</strong> {localizedFarmGuide.note}
          </p>
        ) : null}
      </section>
      <section className="farm-guide-section" aria-labelledby="other-farms-heading">
        <h2 id="other-farms-heading">{pageCopy.otherFarmsLabel}</h2>
        <div className="farm-guide-sibling-grid">
          {localizedOtherFarmGuides.map((otherFarmGuide) => (
            <a
              href={getLocalizedPublicPath(locale, `/farm/${otherFarmGuide.id}`)}
              key={otherFarmGuide.id}
            >
              {otherFarmGuide.title}
            </a>
          ))}
        </div>
        <p className="farm-guide-section__footnote">
          {pageCopy.comparisonPrompt}{" "}
          <a href={getLocalizedPublicPath(locale, "/farm-comparison")}>
            {pageCopy.fullComparisonLabel}
          </a>
          {pageCopy.comparisonSentenceEnding}
        </p>
      </section>
    </>
  );
}
