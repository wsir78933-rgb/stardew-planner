import { FaDiscord, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { ReactElement } from "react";
import type { HomepageLocale } from "../homepage/homepage-locale";
import {
  discordInviteUrl,
  type SiteFooterContent,
  type SiteFooterGroup,
} from "../site-footer/site-footer-content";

type SiteFooterProps = Readonly<{
  content: SiteFooterContent;
  locale?: HomepageLocale;
}>;

function SiteFooterLinkGroup({
  title,
  links,
}: SiteFooterGroup): ReactElement {
  return (
    <section data-site-footer-group="true">
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SiteFooter({
  content,
  locale = "en",
}: SiteFooterProps): ReactElement {
  const socialLabels = readSiteFooterSocialLabels(locale);

  return (
    <footer data-site-footer="true">
      <div data-site-footer-identity="true">
        <strong>{content.identity.brandName}</strong>
        <p>{content.identity.description}</p>
      </div>
      <div data-site-footer-social-icons="true">
        <span aria-hidden="true"><FaInstagram /></span>
        <span aria-hidden="true"><FaFacebook /></span>
        <a
          aria-label={socialLabels.followOnX}
          href="https://x.com/wsir1139"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaXTwitter aria-hidden="true" focusable="false" />
        </a>
        <a
          aria-label={socialLabels.joinDiscord}
          href={discordInviteUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaDiscord aria-hidden="true" focusable="false" />
        </a>
        <span aria-hidden="true"><FaLinkedin /></span>
      </div>
      <div data-site-footer-sections="true">
        <SiteFooterLinkGroup {...content.planner} />
        <SiteFooterLinkGroup {...content.explore} />
        <SiteFooterLinkGroup {...content.legal} />
      </div>
      <p>{content.identity.copyright}</p>
    </footer>
  );
}

function readSiteFooterSocialLabels(locale: HomepageLocale): Readonly<{
  followOnX: string;
  joinDiscord: string;
}> {
  if (locale === "en" || locale === "zh-CN") {
    return {
      followOnX: "Follow @wsir1139 on X (Twitter)",
      joinDiscord: "Join the Stardew Valley Planner Discord",
    };
  }

  if (locale === "ja") {
    return {
      followOnX: "X（Twitter）で @wsir1139 をフォロー",
      joinDiscord: "Stardew Valley Planner の Discord に参加",
    };
  }

  const unsupportedLocale: never = locale;
  throw new Error(
    `Cannot read site footer social labels because locale is ${JSON.stringify(unsupportedLocale)}.`,
  );
}
