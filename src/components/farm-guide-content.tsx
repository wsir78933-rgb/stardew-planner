import {
  formatPublicMessage,
  getLocalizedOfficialFarmGuide,
} from "../i18n/public-content";
import { LocalizedLink } from "../i18n/localized-link";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";
import { officialFarmTypes, type OfficialFarmType } from "../reference/official-farm-guides";

type FarmGuideContentProperties = Readonly<{
  locale: SiteLocale;
  farmType: OfficialFarmType;
}>;

function FarmGuideStats({
  farmGuide,
  locale,
}: Readonly<{
  farmGuide: ReturnType<typeof getLocalizedOfficialFarmGuide>;
  locale: SiteLocale;
}>) {
  return (
    <dl className="farm-guide-stats">
      <div>
        <dt>{translate(locale, "public.comparison.tillableTiles")}</dt>
        <dd>{farmGuide.tillableTiles}</dd>
      </div>
      <div>
        <dt>{translate(locale, "public.comparison.totalBuildable")}</dt>
        <dd>{farmGuide.totalBuildableTiles}</dd>
      </div>
      <div>
        <dt>{translate(locale, "public.comparison.addedIn")}</dt>
        <dd>{farmGuide.addedIn}</dd>
      </div>
    </dl>
  );
}

export function FarmGuideContent({
  locale,
  farmType,
}: FarmGuideContentProperties) {
  const farmGuide = getLocalizedOfficialFarmGuide(locale, farmType);
  const otherFarmGuides = officialFarmTypes
    .filter((otherFarmType) => otherFarmType !== farmType)
    .map((otherFarmType) => getLocalizedOfficialFarmGuide(locale, otherFarmType));

  return (
    <>
      <nav
        aria-label={translate(locale, "public.guide.breadcrumb")}
        className="public-breadcrumbs"
      >
        <LocalizedLink canonicalPath="/" locale={locale}>
          {translate(locale, "public.guide.planner")}
        </LocalizedLink>
        <span aria-hidden="true">/</span>
        <LocalizedLink canonicalPath="/farm-comparison" locale={locale}>
          {translate(locale, "public.guide.farmTypes")}
        </LocalizedLink>
        <span aria-hidden="true">/</span>
        <span>{farmGuide.title}</span>
      </nav>
      <header className="farm-guide-hero">
        <img
          alt={formatPublicMessage(locale, "public.guide.preview", {
            farmName: farmGuide.title,
          })}
          className="farm-guide-hero__preview"
          src={farmGuide.previewSource}
        />
        <div className="farm-guide-hero__copy">
          <h1>{farmGuide.title}</h1>
          <p>{farmGuide.introduction}</p>
          <FarmGuideStats farmGuide={farmGuide} locale={locale} />
          <div className="farm-guide-hero__actions">
            <LocalizedLink
              canonicalPath="/"
              className="public-primary-cta"
              locale={locale}
              search={`farmType=${farmGuide.id}`}
            >
              {translate(locale, "public.guide.planThisFarm")}
            </LocalizedLink>
            <LocalizedLink
              canonicalPath="/farm-comparison"
              className="public-secondary-cta"
              locale={locale}
            >
              {translate(locale, "public.guide.compareAllFarms")}
            </LocalizedLink>
          </div>
        </div>
      </header>
      <section className="farm-guide-section" aria-labelledby="farm-guide-features">
        <h2 id="farm-guide-features">
          {translate(locale, "public.guide.whatMakesItDifferent")}
        </h2>
        <ul className="public-feature-list">
          {farmGuide.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {farmGuide.note ? (
          <p className="public-note">
            <strong>{translate(locale, "public.comparison.note")}</strong>{" "}
            {farmGuide.note}
          </p>
        ) : null}
      </section>
      <section className="farm-guide-section" aria-labelledby="other-farms-heading">
        <h2 id="other-farms-heading">
          {translate(locale, "public.guide.otherFarms")}
        </h2>
        <div className="farm-guide-sibling-grid">
          {otherFarmGuides.map((otherFarmGuide) => (
            <LocalizedLink
              canonicalPath={`/farm/${otherFarmGuide.id}`}
              key={otherFarmGuide.id}
              locale={locale}
            >
              {otherFarmGuide.title}
            </LocalizedLink>
          ))}
        </div>
        <p className="farm-guide-section__footnote">
          {translate(locale, "public.guide.comparisonPrompt")}{" "}
          <LocalizedLink canonicalPath="/farm-comparison" locale={locale}>
            {translate(locale, "public.guide.fullComparison")}
          </LocalizedLink>
          {translate(locale, "public.guide.comparisonSentenceEnding")}
        </p>
      </section>
    </>
  );
}
