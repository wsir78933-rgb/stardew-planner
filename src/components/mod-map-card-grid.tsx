import {
  formatPublicPageCopy,
  getLocalizedModFarmCards,
  getPublicPageCopy,
} from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";

type ModMapCardGridProperties = Readonly<{
  locale: PublicLocale;
}>;

export function ModMapCardGrid({ locale }: ModMapCardGridProperties) {
  const pageCopy = getPublicPageCopy(locale);
  const localizedPlannerHomepagePath = getLocalizedPublicPath(locale, "/");
  const localizedModFarmCards = getLocalizedModFarmCards(locale);
  const modMapGroups = [
    {
      mapKind: "farm" as const,
      title: pageCopy.modsFarmMapsTitle,
      description: pageCopy.modsFarmMapsDescription,
    },
    {
      mapKind: "interior" as const,
      title: pageCopy.modsInteriorsTitle,
      description: pageCopy.modsInteriorsDescription,
    },
  ];

  return (
    <div className="mod-map-groups" aria-label={pageCopy.availableCommunityFarmsLabel}>
      {modMapGroups.map((modMapGroup) => (
        <section
          className="mod-map-group"
          data-mod-map-kind={modMapGroup.mapKind}
          key={modMapGroup.mapKind}
        >
          <header className="mod-map-group__header">
            <h2>{modMapGroup.title}</h2>
            <p>{modMapGroup.description}</p>
          </header>
          <div className="mod-farm-card-list">
            {localizedModFarmCards
              .filter((modFarmCard) => modFarmCard.mapKind === modMapGroup.mapKind)
              .map((modFarmCard) => (
                <article className="mod-farm-card" id={modFarmCard.id} key={modFarmCard.id}>
                  <img
                    alt={formatPublicPageCopy(pageCopy.previewTemplate, {
                      farmName: modFarmCard.displayName,
                    })}
                    className="mod-farm-card__preview"
                    loading="lazy"
                    src={modFarmCard.previewSource}
                  />
                  <div className="mod-farm-card__body">
                    <h3>{modFarmCard.displayName}</h3>
                    <p className="mod-farm-card__author">
                      {formatPublicPageCopy(pageCopy.byTemplate, {
                        authorName: modFarmCard.authorName,
                      })}
                    </p>
                    <p>{modFarmCard.description}</p>
                    <p className="mod-farm-card__detail">
                      <strong>{pageCopy.modBestForLabel}</strong> {modFarmCard.bestFor}
                    </p>
                    <p className="mod-farm-card__detail">
                      <strong>{pageCopy.modPlanningNoteLabel}</strong> {modFarmCard.planningNote}
                    </p>
                    <div className="mod-farm-card__actions">
                      <a
                        className="public-primary-cta"
                        href={`${localizedPlannerHomepagePath}?farmType=${modFarmCard.id}`}
                      >
                        {pageCopy.planThisFarmLabel}
                      </a>
                      <a
                        className="mod-farm-card__source"
                        href={modFarmCard.sourceHref}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {pageCopy.modSourceLabel}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
