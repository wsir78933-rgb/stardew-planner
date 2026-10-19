import {
  isHomepageDisplayLocale,
  type HomepageDisplayLocale,
} from "../homepage/homepage-locale";
import type { PublicLocale } from "../i18n/public-locale";
import {
  getHomepageDisplayPath,
  getLocalizedPublicPath,
} from "../i18n/public-route-registry";

export const discordInviteUrl = "https://discord.gg/GGfUJZsMN";

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

function readFooterSubpageLocale(locale: HomepageDisplayLocale): PublicLocale {
  if (locale === "ru") {
    return "en";
  }
  if (locale === "en" || locale === "zh-CN") {
    return locale;
  }

  throw new Error(
    `Unsupported footer locale. Received: ${JSON.stringify(locale)}.`,
  );
}

export function createSiteFooterContent(
  footerCopy: SiteFooterCopy,
  locale: HomepageDisplayLocale,
): SiteFooterContent {
  if (!isHomepageDisplayLocale(locale)) {
    throw new Error(
      `Unsupported footer locale. Received: ${JSON.stringify(locale)}.`,
    );
  }

  const localizedHomepagePath = getHomepageDisplayPath(locale);
  const subpageLocale = readFooterSubpageLocale(locale);

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
          href: getLocalizedPublicPath(subpageLocale, "/blog"),
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
          href: getLocalizedPublicPath(subpageLocale, "/privacy"),
        },
        {
          label: footerCopy.legal.terms,
          href: getLocalizedPublicPath(subpageLocale, "/terms"),
        },
        {
          label: footerCopy.legal.contact,
          href: getLocalizedPublicPath(subpageLocale, "/contact"),
        },
      ],
    },
  };
}
