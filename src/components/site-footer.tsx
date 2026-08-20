import { FaDiscord, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import type { ReactElement } from "react";
import {
  discordInviteUrl,
  type SiteFooterContent,
  type SiteFooterGroup,
} from "../site-footer/site-footer-content";

type SiteFooterProps = Readonly<{
  content: SiteFooterContent;
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

export function SiteFooter({ content }: SiteFooterProps): ReactElement {
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
          aria-label="Follow @wsir1139 on X (Twitter)"
          href="https://x.com/wsir1139"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FaTwitter aria-hidden="true" focusable="false" />
        </a>
        <a
          aria-label="Join the Stardew Valley Planner Discord"
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
