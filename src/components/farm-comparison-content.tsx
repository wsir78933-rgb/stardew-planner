import {
  formatPublicMessage,
  getLocalizedOfficialFarmGuide,
} from "../i18n/public-content";
import { LocalizedLink } from "../i18n/localized-link";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";
import { officialFarmTypes, type OfficialFarmType } from "../reference/official-farm-guides";

function FarmStats({
  farmGuide,
  locale,
}: Readonly<{
  farmGuide: ReturnType<typeof getLocalizedOfficialFarmGuide>;
  locale: SiteLocale;
}>) {
  return (
    <dl className="public-farm-stats">
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

function FarmComparisonCard({
  farmType,
  locale,
}: Readonly<{
  farmType: OfficialFarmType;
  locale: SiteLocale;
}>) {
  const farmGuide = getLocalizedOfficialFarmGuide(locale, farmType);

  return (
    <article className="farm-comparison-card" id={farmGuide.id}>
      <img
        alt={formatPublicMessage(locale, "public.comparison.preview", {
          farmName: farmGuide.title,
        })}
        className="farm-comparison-card__preview"
        loading="lazy"
        src={farmGuide.previewSource}
      />
      <div className="farm-comparison-card__body">
        <h3>{farmGuide.title}</h3>
        <FarmStats farmGuide={farmGuide} locale={locale} />
        <p className="farm-comparison-card__best-for">
          <strong>{translate(locale, "public.comparison.bestFor")}</strong>{" "}
          {farmGuide.bestFor}
        </p>
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
        <LocalizedLink
          canonicalPath="/"
          className="public-primary-cta"
          locale={locale}
          search={`farmType=${farmGuide.id}`}
        >
          {formatPublicMessage(locale, "public.comparison.planFarm", {
            farmName: farmGuide.title,
          })}
        </LocalizedLink>
      </div>
    </article>
  );
}

function FarmQuickComparisonTable({ locale }: Readonly<{ locale: SiteLocale }>) {
  return (
    <section aria-labelledby="quick-comparison-heading">
      <h2 id="quick-comparison-heading">
        {translate(locale, "public.comparison.quickComparison")}
      </h2>
      <div className="farm-comparison-table-scroll">
        <table className="farm-comparison-table">
          <thead>
            <tr>
              <th scope="col">{translate(locale, "public.comparison.farm")}</th>
              <th scope="col">
                {translate(locale, "public.comparison.tillableTiles")}
              </th>
              <th scope="col">
                {translate(locale, "public.comparison.totalBuildable")}
              </th>
              <th scope="col">{translate(locale, "public.comparison.added")}</th>
              <th scope="col">{translate(locale, "public.comparison.knownFor")}</th>
            </tr>
          </thead>
          <tbody>
            {officialFarmTypes.map((farmType) => {
              const farmGuide = getLocalizedOfficialFarmGuide(locale, farmType);

              return (
                <tr key={farmGuide.id}>
                  <td>
                    <LocalizedLink
                      canonicalPath={`/farm/${farmGuide.id}`}
                      locale={locale}
                    >
                      {farmGuide.title}
                    </LocalizedLink>
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
  locale: SiteLocale;
}>;

export function FarmComparisonContent({ locale }: FarmComparisonContentProperties) {
  return (
    <>
      <FarmQuickComparisonTable locale={locale} />
      <section
        aria-label={translate(locale, "public.comparison.farmDetails")}
        className="farm-comparison-card-list"
      >
        {officialFarmTypes.map((farmType) => (
          <FarmComparisonCard farmType={farmType} key={farmType} locale={locale} />
        ))}
      </section>
    </>
  );
}
