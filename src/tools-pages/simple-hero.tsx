import type { PublicLocale } from "../i18n/public-locale";
import type { ToolsPageHeroCopy } from "../i18n/tools-page-copy";
import styles from "./simple-hero.module.css";

const SIMPLE_HERO_ANCHOR_PATTERN = /^#[A-Za-z][A-Za-z0-9_-]*$/;
const SIMPLE_HERO_ID_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;

export type SimpleHeroProperties = Readonly<{
  copy: ToolsPageHeroCopy;
  locale: PublicLocale;
  actionHref: string;
  titleId: string;
}>;

function requireNonEmptySimpleHeroText(value: unknown, fieldPath: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Cannot render SimpleHero: ${fieldPath}=${JSON.stringify(value)} must be a non-empty string.`,
    );
  }

  return value;
}

function requireSimpleHeroCopy(copy: unknown): ToolsPageHeroCopy {
  if (copy === null || typeof copy !== "object" || Array.isArray(copy)) {
    throw new Error(
      `Cannot render SimpleHero: copy=${JSON.stringify(copy)} must be an object.`,
    );
  }

  const copyRecord = copy as Record<string, unknown>;
  const titleBefore = requireNonEmptySimpleHeroText(copyRecord.titleBefore, "copy.titleBefore");
  const accent = requireNonEmptySimpleHeroText(copyRecord.accent, "copy.accent");
  const titleAfter = requireNonEmptySimpleHeroText(copyRecord.titleAfter, "copy.titleAfter");
  const description = requireNonEmptySimpleHeroText(copyRecord.description, "copy.description");
  const actionLabel = requireNonEmptySimpleHeroText(copyRecord.actionLabel, "copy.actionLabel");

  return { titleBefore, accent, titleAfter, description, actionLabel };
}

function requireSimpleHeroAnchorHref(actionHref: unknown): string {
  if (typeof actionHref !== "string" || !SIMPLE_HERO_ANCHOR_PATTERN.test(actionHref)) {
    throw new Error(
      `Cannot render SimpleHero: actionHref=${JSON.stringify(actionHref)} must be a same-page "#id" anchor.`,
    );
  }

  return actionHref;
}

function requireSimpleHeroTitleId(titleId: unknown): string {
  if (typeof titleId !== "string" || !SIMPLE_HERO_ID_PATTERN.test(titleId)) {
    throw new Error(
      `Cannot render SimpleHero: titleId=${JSON.stringify(titleId)} must be a valid HTML id.`,
    );
  }

  return titleId;
}

export function SimpleHero({ copy, locale, actionHref, titleId }: SimpleHeroProperties) {
  const heroCopy = requireSimpleHeroCopy(copy);
  const heroActionHref = requireSimpleHeroAnchorHref(actionHref);
  const heroTitleId = requireSimpleHeroTitleId(titleId);

  if (locale !== "en" && locale !== "zh-CN") {
    throw new Error(`Cannot render SimpleHero: locale=${JSON.stringify(locale)} is unsupported.`);
  }

  const wordSeparator = locale === "en" ? " " : "";

  return (
    <section aria-labelledby={heroTitleId} className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.heading} id={heroTitleId}>
          {heroCopy.titleBefore}
          {wordSeparator}
          <br />
          <em className={styles.accent}>
            {heroCopy.accent}
            <svg
              aria-hidden="true"
              className={styles.underline}
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 170 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 9C32.8203 5.34032 108.769 -0.881146 166 3.51047"
                fill="none"
                opacity="0.9"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="6"
              />
            </svg>
          </em>
          {wordSeparator}
          {heroCopy.titleAfter}
        </h1>
        <p className={styles.description}>{heroCopy.description}</p>
        <a className={styles.action} href={heroActionHref}>
          {heroCopy.actionLabel}
        </a>
      </div>
    </section>
  );
}
