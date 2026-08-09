import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ContactForm } from "../../src/contact/contact-form";
import { getContactPageCopy } from "../../src/contact/contact-page-copy";

it("renders the accessible English contact fields and submit action", () => {
  const contactCopy = getContactPageCopy("en");
  const markup = renderToStaticMarkup(
    <ContactForm contactCopy={contactCopy} turnstileSiteKey="" />,
  );

  expect(markup).toContain('data-contact-form="true"');
  expect(markup).toContain('<label for="contact-name">Name</label>');
  expect(markup).toContain('id="contact-name"');
  expect(markup).toContain('name="name"');
  expect(markup).toContain('<label for="contact-email">Email</label>');
  expect(markup).toContain('type="email"');
  expect(markup).toContain('<label for="contact-message">Message</label>');
  expect(markup).toContain('id="contact-message"');
  expect(markup).toContain('name="message"');
  expect(markup).toContain('rows="6"');
  expect(markup).toContain('<button class="contact-form-submit"');
  expect(markup).toContain("Send message");
  expect(markup).toContain('aria-live="polite"');
  expect(markup).toContain('class="contact-form-submit" disabled="" type="submit"');
  expect(markup).toContain('class="contact-form-turnstile cf-turnstile"');
  expect(markup).toContain('data-action="turnstile-spin-v2"');
});

it("renders an enabled submit button when a public Turnstile site key is supplied", () => {
  const contactCopy = getContactPageCopy("en");
  const markup = renderToStaticMarkup(
    <ContactForm contactCopy={contactCopy} turnstileSiteKey="public-test-key" />,
  );

  expect(markup).toContain('data-sitekey="public-test-key"');
  expect(markup).toContain(
    '<button class="contact-form-submit" type="submit">',
  );
});
