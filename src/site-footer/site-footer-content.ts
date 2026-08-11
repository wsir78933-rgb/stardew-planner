import type { PublicLocale } from "../i18n/public-locale";
import { getLocalizedPublicPath } from "../i18n/public-route-registry";

export type SiteFooterLink = Readonly<{
  label: string;
  href: string;
}>;

export type SiteFooterGroup = Readonly<{
  title: string;
  links: readonly SiteFooterLink[];
}>;

export type SiteFooterCopy = Readonly<{
  brandName: string;
  description: string;
  copyright: string;
  planner: Readonly<{
    title: string;
    home: string;
    farmComparison: string;
    moddedFarms: string;
  }>;
  explore: Readonly<{
    title: string;
    capabilities: string;
    faq: string;
    blog: string;
  }>;
  legal: Readonly<{
    title: string;
    privacy: string;
    terms: string;
    contact: string;
  }>;
}>;

export type SiteFooterContent = Readonly<{
  identity: Readonly<{
    brandName: string;
    description: string;
    copyright: string;
  }>;
  planner: SiteFooterGroup;
  explore: SiteFooterGroup;
  legal: SiteFooterGroup;
}>;

export function createSiteFooterContent(
  footerCopy: SiteFooterCopy,
  locale: PublicLocale,
): SiteFooterContent {
  const localizedHomepagePath = getLocalizedPublicPath(locale, "/");

  return {
    identity: {
      brandName: footerCopy.brandName,
      description: footerCopy.description,
      copyright: footerCopy.copyright,
    },
    planner: {
      title: footerCopy.planner.title,
      links: [
        { label: footerCopy.planner.home, href: localizedHomepagePath },
      ],
    },
    explore: {
      title: footerCopy.explore.title,
      links: [
        {
          label: footerCopy.explore.blog,
          href: getLocalizedPublicPath(locale, "/blog"),
        },
        {
          label: footerCopy.explore.capabilities,
          href: `${localizedHomepagePath}#capabilities`,
        },
        { label: footerCopy.explore.faq, href: `${localizedHomepagePath}#faq` },
      ],
    },
    legal: {
      title: footerCopy.legal.title,
      links: [
        {
          label: footerCopy.legal.privacy,
          href: getLocalizedPublicPath(locale, "/privacy"),
        },
        {
          label: footerCopy.legal.terms,
          href: getLocalizedPublicPath(locale, "/terms"),
        },
        {
          label: footerCopy.legal.contact,
          href: getLocalizedPublicPath(locale, "/contact"),
        },
      ],
    },
  };
}
