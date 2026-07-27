import {
  formatPublicMessage,
  getLocalizedModFarmCards,
} from "../i18n/public-content";
import { LocalizedLink } from "../i18n/localized-link";
import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

type ModMapCardGridProperties = Readonly<{
  locale: SiteLocale;
}>;

export function ModMapCardGrid({ locale }: ModMapCardGridProperties) {
  return (
    <section
      aria-label={translate(locale, "public.mods.availableCommunityFarms")}
      className="mod-farm-card-list"
    >
      {getLocalizedModFarmCards(locale).map((modFarmCard) => (
        <article className="mod-farm-card" id={modFarmCard.id} key={modFarmCard.id}>
          <img
            alt={formatPublicMessage(locale, "public.mods.preview", {
              farmName: modFarmCard.displayName,
            })}
            className="mod-farm-card__preview"
            loading="lazy"
            src={modFarmCard.previewSource}
          />
          <div className="mod-farm-card__body">
            <h2>{modFarmCard.displayName}</h2>
            <p className="mod-farm-card__author">
              {formatPublicMessage(locale, "public.mods.by", {
                authorName: modFarmCard.authorName,
              })}
            </p>
            <p>{modFarmCard.description}</p>
            <LocalizedLink
              canonicalPath="/"
              className="public-primary-cta"
              locale={locale}
              search={`farmType=${modFarmCard.id}`}
            >
              {translate(locale, "public.mods.planThisFarm")}
            </LocalizedLink>
          </div>
        </article>
      ))}
    </section>
  );
}
