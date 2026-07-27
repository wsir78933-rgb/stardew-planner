import type { SiteLocale } from "../i18n/locales";
import { translate } from "../i18n/messages";

type LegalPage = "privacy" | "terms";

type LegalContentProperties = Readonly<{
  locale: SiteLocale;
  page: LegalPage;
}>;

type LegalSection = Readonly<{
  titleKey: string;
  bodyKey: string;
}>;

const legalSectionsByPage: Readonly<Record<LegalPage, readonly LegalSection[]>> = {
  privacy: [
    {
      titleKey: "public.legal.privacy.localDataTitle",
      bodyKey: "public.legal.privacy.localDataBody",
    },
    {
      titleKey: "public.legal.privacy.noAccountsTitle",
      bodyKey: "public.legal.privacy.noAccountsBody",
    },
    {
      titleKey: "public.legal.privacy.noPaymentsTitle",
      bodyKey: "public.legal.privacy.noPaymentsBody",
    },
    {
      titleKey: "public.legal.privacy.contactTitle",
      bodyKey: "public.legal.privacy.contactBody",
    },
  ],
  terms: [
    {
      titleKey: "public.legal.terms.localStorageTitle",
      bodyKey: "public.legal.terms.localStorageBody",
    },
    {
      titleKey: "public.legal.terms.serviceBoundaryTitle",
      bodyKey: "public.legal.terms.serviceBoundaryBody",
    },
    {
      titleKey: "public.legal.terms.gameRelationshipTitle",
      bodyKey: "public.legal.terms.gameRelationshipBody",
    },
    {
      titleKey: "public.legal.terms.changesTitle",
      bodyKey: "public.legal.terms.changesBody",
    },
  ],
};

export function LegalContent({ locale, page }: LegalContentProperties) {
  const messageKeyPrefix = `public.legal.${page}`;

  return (
    <article className="legal-content">
      <h1>{translate(locale, `${messageKeyPrefix}.title`)}</h1>
      <p>{translate(locale, `${messageKeyPrefix}.introduction`)}</p>
      {legalSectionsByPage[page].map((legalSection) => (
        <section key={legalSection.titleKey}>
          <h2>{translate(locale, legalSection.titleKey)}</h2>
          <p>{translate(locale, legalSection.bodyKey)}</p>
        </section>
      ))}
    </article>
  );
}
