import { describe, expect, it } from "vitest";
import {
  createCanonicalUrl,
  createPublicSiteUrl,
  publicSiteUrl,
} from "../../src/seo/public-site-url";

describe("public site URL", () => {
  it("uses the confirmed HTTPS origin without a path suffix", () => {
    expect(publicSiteUrl.href).toBe("https://stardewvalleyplanner.art/");
    expect(createCanonicalUrl("/")).toBe("https://stardewvalleyplanner.art");
    expect(createCanonicalUrl("/privacy")).toBe(
      "https://stardewvalleyplanner.art/privacy",
    );
  });

  it("rejects a site URL with a path, query, fragment, or non-HTTPS protocol", () => {
    expect(() => createPublicSiteUrl("https://stardewvalleyplanner.art/site"))
      .toThrow(/site URL must not include a pathname/i);
    expect(() => createPublicSiteUrl("https://stardewvalleyplanner.art?source=test"))
      .toThrow(/site URL must not include a query or fragment/i);
    expect(() => createPublicSiteUrl("https://stardewvalleyplanner.art#section"))
      .toThrow(/site URL must not include a query or fragment/i);
    expect(() => createPublicSiteUrl("http://stardewvalleyplanner.art"))
      .toThrow(/site URL must use HTTPS/i);
  });

  it("reports the received value when the site URL cannot be parsed", () => {
    expect(() => createPublicSiteUrl("not a URL")).toThrow(
      'Received: "not a URL".',
    );
  });

  it("rejects a canonical pathname that is not a query-free absolute path", () => {
    expect(() => createCanonicalUrl("privacy")).toThrow(
      "Canonical pathname must start with",
    );
    expect(() => createCanonicalUrl("/?farmType=standard")).toThrow(
      "Canonical pathname must start with",
    );
    expect(() => createCanonicalUrl("/#maps")).toThrow(
      "Canonical pathname must start with",
    );
  });

  it("rejects canonical pathnames that URL parsing could resolve to another origin", () => {
    expect(() => createCanonicalUrl("//example.invalid/escaped")).toThrow(
      "Canonical pathname must stay on the public site origin",
    );
    expect(() => createCanonicalUrl("/\\example.invalid/escaped")).toThrow(
      "Canonical pathname must stay on the public site origin",
    );
  });

  it("rejects non-root canonical paths with trailing slashes", () => {
    expect(() => createCanonicalUrl("/zh/")).toThrow('Received: "/zh/"');
  });
});
