import { getModFarmCards } from "../reference/mod-farm-cards";

export function ModMapCardGrid() {
  return (
    <section className="mod-farm-card-list" aria-label="Available community farms">
      {getModFarmCards().map((modFarmCard) => (
        <article className="mod-farm-card" id={modFarmCard.id} key={modFarmCard.id}>
          <img
            alt={`${modFarmCard.displayName} preview`}
            className="mod-farm-card__preview"
            loading="lazy"
            src={modFarmCard.previewSource}
          />
          <div className="mod-farm-card__body">
            <h2>{modFarmCard.displayName}</h2>
            <p className="mod-farm-card__author">by {modFarmCard.authorName}</p>
            <p>{modFarmCard.description}</p>
            <a
              className="public-primary-cta"
              href={`/?farmType=${modFarmCard.id}`}
            >
              Plan this farm →
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
