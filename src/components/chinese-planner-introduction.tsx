import { getPublicPageCopy } from "../i18n/public-page-content";

export function ChinesePlannerIntroduction() {
  const pageCopy = getPublicPageCopy("zh-CN");

  return (
    <article className="public-page-content">
      <header className="public-page-header">
        <h1>{pageCopy.plannerTitle}</h1>
        <p>{pageCopy.plannerIntroduction}</p>
      </header>
      <a className="public-primary-cta" href="/">
        {pageCopy.planFarmLabel}
      </a>
    </article>
  );
}
