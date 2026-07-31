import {
  getLocalizedModFarmCards,
  getPublicPageCopy,
} from "../i18n/public-page-content";
import type { PublicLocale } from "../i18n/public-locale";

type ModMapCardGridProperties = Readonly<{
  locale?: PublicLocale;
}>;

export function ModMapCardGrid({ locale = "en" }: ModMapCardGridProperties) {
  const pageCopy = getPublicPageCopy(locale);

  return (
    <section className="mod-farm-card-list" aria-label={pageCopy.availableCommunityFarmsLabel}>
      {getLocalizedModFarmCards(locale).map((modFarmCard) => (
        <article className="mod-farm-card" id={modFarmCard.id} key={modFarmCard.id}>
          <img
            alt={`${modFarmCard.displayName} ${pageCopy.previewLabel}`}
            className="mod-farm-card__preview"
            loading="lazy"
            src={modFarmCard.previewSource}
          />
          <div className="mod-farm-card__body">
            <h2>{modFarmCard.displayName}</h2>
            <p className="mod-farm-card__author">
              {pageCopy.byLabel} {modFarmCard.authorName}
            </p>
            <p>{modFarmCard.description}</p>
            <a
              className="public-primary-cta"
              href={`/?farmType=${modFarmCard.id}`}
            >
              {pageCopy.planThisFarmLabel}
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
