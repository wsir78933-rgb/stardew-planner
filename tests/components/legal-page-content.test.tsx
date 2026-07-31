import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { LegalPageContent } from "../../src/components/legal-page-content";
import { privacyDocument, termsDocument } from "../../src/reference/legal-pages";

it("renders both browser-local legal pages without obsolete online service references", () => {
  const legalPageMarkup = [privacyDocument, termsDocument].map((document) =>
    renderToStaticMarkup(<LegalPageContent document={document} />),
  );

  expect(legalPageMarkup[0]).toContain("There is no account or sign-in.");
  expect(legalPageMarkup[0]).toContain("Projects stay in this browser.");
  expect(legalPageMarkup[1]).toContain("Terms of Service");
  expect(legalPageMarkup[1]).toContain("There is no cloud sync, share links, payments, memberships, or supporter features.");

  for (const markup of legalPageMarkup) {
    expect(markup).not.toMatch(/Ko-fi|Cloudflare|Plausible|Google Analytics|PayPal|Stripe/i);
  }
});
