import { expect, it } from "vitest";
import { createWebPageStructuredData } from "../../src/seo/page-structured-data";

const privacyPathname = "/privacy";
const privacyDescription = "How this site handles privacy.";

it("builds WebPage structured data from a non-empty name and description", () => {
  const privacyName = "Privacy Policy";
  const webPage = createWebPageStructuredData({
    locale: "en",
    name: privacyName,
    description: privacyDescription,
    pathname: privacyPathname,
  });

  expect(webPage).toMatchObject({
    "@type": "WebPage",
    name: privacyName,
    url: expect.stringContaining(privacyPathname),
  });
});

it("rejects an empty web page name", () => {
  const emptyName = "";

  expect(() =>
    createWebPageStructuredData({
      locale: "en",
      name: emptyName,
      description: privacyDescription,
      pathname: privacyPathname,
    }),
  ).toThrow(`Received: ${JSON.stringify(emptyName)}`);
});
