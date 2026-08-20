import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ContactPageContent } from "../../src/contact/contact-page-content";
import { getContactPageCopy } from "../../src/contact/contact-page-copy";
import { discordInviteUrl } from "../../src/site-footer/site-footer-content";

it("renders the English Discord invite next to the contact form", () => {
  const contactCopy = getContactPageCopy("en");
  const markup = renderToStaticMarkup(
    <ContactPageContent contactCopy={contactCopy} />,
  );

  expect(markup).toContain('data-contact-discord="true"');
  expect(markup).toContain(contactCopy.discordInviteLead);
  expect(markup).toContain(`href="${discordInviteUrl}"`);
  expect(markup).toContain('target="_blank"');
  expect(markup).toContain('rel="noopener noreferrer"');
  expect(markup).toContain(">Join Discord</a>");
});

it("renders the Chinese Discord invite next to the contact form", () => {
  const contactCopy = getContactPageCopy("zh-CN");
  const markup = renderToStaticMarkup(
    <ContactPageContent contactCopy={contactCopy} />,
  );

  expect(markup).toContain(contactCopy.discordInviteLead);
  expect(markup).toContain(`href="${discordInviteUrl}"`);
  expect(markup).toContain(">加入 Discord</a>");
});
