import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  expectedNoindexContactPathnames,
  expectedPublicHtmlPathContracts,
  expectedSitemapPathnames,
  missingPageProbePathname,
  requiredSecurityHeaderNames,
} from "../../scripts/production-seo-smoke-contract.mjs";
import {
  parseProductionSeoSmokeArguments,
  runProductionSeoSmoke,
} from "../../scripts/production-seo-smoke.mjs";

const productionOrigin = "https://stardewvalleyplanner.art";
const hashedStaticAssetPathname =
  "/_next/static/chunks/3qmc44cgx026x.js";

const expectedRequiredSecurityHeaderNamesForFixture = [
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
];

const enforcedHtmlSecurityHeaders = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "content-security-policy": "default-src 'self'; frame-ancestors 'none'",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

const expectedCanonicalPublicPathnames = [
  "/",
  "/privacy",
  "/terms",
  "/contact",
  "/blog",
  "/blog/archive",
  "/carpenter-stardew",
  "/where-is-robin-stardew-valley",
];

const expectedPublicHtmlPathnames = [
  ...expectedCanonicalPublicPathnames,
  ...expectedCanonicalPublicPathnames.map((canonicalPathname) =>
    canonicalPathname === "/" ? "/zh" : `/zh${canonicalPathname}`,
  ),
];

const expectedBlogPathnamesForFixture = [
  "/blog",
  "/blog/archive",
  "/carpenter-stardew",
  "/where-is-robin-stardew-valley",
  "/zh/blog",
  "/zh/blog/archive",
  "/zh/carpenter-stardew",
  "/zh/where-is-robin-stardew-valley",
];

const expectedNoindexContactPathnamesForFixture = [
  "/contact",
  "/zh/contact",
];

const expectedNoindexPathnamesForFixture = new Set(
  expectedNoindexContactPathnamesForFixture,
);

const expectedSitemapPathnamesForFixture = expectedPublicHtmlPathnames.filter(
  (pathname) => !expectedNoindexContactPathnamesForFixture.includes(pathname),
);

const bodyReadFailureCases = [
  {
    bodyDescription: "public HTML",
    expectedCheck: "a readable HTML response body",
    requestUrl: `${productionOrigin}/privacy`,
  },
  {
    bodyDescription: "robots.txt",
    expectedCheck: "a readable robots.txt response body",
    requestUrl: `${productionOrigin}/robots.txt`,
  },
  {
    bodyDescription: "sitemap XML",
    expectedCheck: "a readable sitemap XML response body",
    requestUrl: `${productionOrigin}/sitemap.xml`,
  },
  {
    bodyDescription: "missing-page HTML",
    expectedCheck: "a readable missing-page HTML response body",
    requestUrl:
      `${productionOrigin}/__production-seo-smoke-missing-page__`,
  },
];

function createExpectedAbsoluteUrl(pathname) {
  return pathname === "/" ? productionOrigin : `${productionOrigin}${pathname}`;
}

function getExpectedLocalizedPathContract(pathname) {
  const isChinesePathname = pathname === "/zh" || pathname.startsWith("/zh/");
  const canonicalPathname = isChinesePathname
    ? pathname === "/zh"
      ? "/"
      : pathname.slice(3)
    : pathname;
  const englishPathname = canonicalPathname;
  const chinesePathname =
    canonicalPathname === "/" ? "/zh" : `/zh${canonicalPathname}`;

  return {
    canonicalUrl: createExpectedAbsoluteUrl(pathname),
    languageAlternates: {
      en: createExpectedAbsoluteUrl(englishPathname),
      "zh-CN": createExpectedAbsoluteUrl(chinesePathname),
      "x-default": createExpectedAbsoluteUrl(englishPathname),
    },
  };
}

function createPublicHtml(pathname, htmlOverrides = {}) {
  const expectedPathContract = getExpectedLocalizedPathContract(pathname);
  const canonicalUrl = htmlOverrides.canonicalUrl
    ?? expectedPathContract.canonicalUrl;
  const languageAlternates = htmlOverrides.languageAlternates
    ?? expectedPathContract.languageAlternates;
  const robotsContent = htmlOverrides.robotsContent
    ?? (expectedNoindexPathnamesForFixture.has(pathname)
      ? "noindex, follow"
      : "index, follow");
  const staticAssetUrl = htmlOverrides.staticAssetUrl
    ?? hashedStaticAssetPathname;

  return [
    "<!doctype html><html><head>",
    `<link href="${canonicalUrl}" rel="canonical">`,
    `<link href="${languageAlternates.en}" hrefLang="en" rel="alternate">`,
    `<link rel="alternate" hreflang="zh-CN" href="${languageAlternates["zh-CN"]}">`,
    `<link hreflang="x-default" href="${languageAlternates["x-default"]}" rel="alternate">`,
    `<meta content="${robotsContent}" name="robots">`,
    `<script src="${staticAssetUrl}"></script>`,
    "</head><body>Production SEO fixture</body></html>",
  ].join("");
}

function createTextResponse(body, status, contentType, additionalHeaders = {}) {
  return new Response(body, {
    status,
    headers: {
      "content-type": contentType,
      ...additionalHeaders,
    },
  });
}

function createBodyReadFailureResponse(
  requestUrl,
  bodyReadError,
) {
  const isPublicHtml = requestUrl === `${productionOrigin}/privacy`;
  const isMissingPage = requestUrl.endsWith(
    "/__production-seo-smoke-missing-page__",
  );
  const responseHeaders = new Headers({
    "content-type": requestUrl.endsWith("/robots.txt")
      ? "text/plain"
      : requestUrl.endsWith("/sitemap.xml")
        ? "application/xml"
        : "text/html",
    ...(isPublicHtml || isMissingPage ? enforcedHtmlSecurityHeaders : {}),
  });

  return {
    headers: responseHeaders,
    status: isMissingPage ? 404 : 200,
    text: async () => {
      throw bodyReadError;
    },
  };
}

function createHtmlResponse(
  pathname,
  {
    htmlOverrides,
    securityHeaderOverrides = {},
    removedSecurityHeaderNames = [],
    status = 200,
  } = {},
) {
  const responseSecurityHeaders = {
    ...enforcedHtmlSecurityHeaders,
    ...securityHeaderOverrides,
  };

  for (const removedSecurityHeaderName of removedSecurityHeaderNames) {
    delete responseSecurityHeaders[removedSecurityHeaderName];
  }

  return createTextResponse(
    createPublicHtml(pathname, htmlOverrides),
    status,
    "text/html; charset=utf-8",
    responseSecurityHeaders,
  );
}

function createDeterministicFetch({
  htmlOverridesByPathname = new Map(),
  responseFactoriesByUrl = new Map(),
} = {}) {
  const requests = [];
  const redirectProbeUrl =
    "http://stardewvalleyplanner.art/privacy?seo_https_probe=1";
  const expectedRedirectLocation =
    "https://stardewvalleyplanner.art/privacy?seo_https_probe=1";

  async function fetchResponse(input, init) {
    const requestUrl = String(input);
    requests.push({ init, requestUrl });

    const responseFactory = responseFactoriesByUrl.get(requestUrl);
    if (responseFactory !== undefined) {
      return responseFactory();
    }

    if (requestUrl === redirectProbeUrl) {
      return new Response(null, {
        status: 308,
        headers: { location: expectedRedirectLocation },
      });
    }

    if (requestUrl === `${productionOrigin}/robots.txt`) {
      return createTextResponse(
        `User-Agent: *\nAllow: /\nSitemap: ${productionOrigin}/sitemap.xml\n`,
        200,
        "text/plain; charset=utf-8",
      );
    }

    if (requestUrl === `${productionOrigin}/sitemap.xml`) {
      const sitemapLocations = expectedSitemapPathnamesForFixture
        .map(
          (pathname) => `<url><loc>${createExpectedAbsoluteUrl(pathname)}</loc></url>`,
        )
        .join("");
      return createTextResponse(
        `<?xml version="1.0"?><urlset>${sitemapLocations}</urlset>`,
        200,
        "application/xml",
      );
    }

    if (requestUrl === `${productionOrigin}/__production-seo-smoke-missing-page__`) {
      return createTextResponse(
        '<!doctype html><meta name="robots" content="noindex, follow"><h1>Not found</h1>',
        404,
        "text/html; charset=utf-8",
        enforcedHtmlSecurityHeaders,
      );
    }

    if (requestUrl === `${productionOrigin}${hashedStaticAssetPathname}`) {
      return createTextResponse(
        "globalThis.productionSeoFixture = true;",
        200,
        "text/javascript; charset=utf-8",
        { "cache-control": "public, max-age=31536000, immutable" },
      );
    }

    const requestPathname = new URL(requestUrl).pathname;
    if (expectedPublicHtmlPathnames.includes(requestPathname)) {
      return createHtmlResponse(requestPathname, {
        htmlOverrides: htmlOverridesByPathname.get(requestPathname),
      });
    }

    throw new Error(`Unexpected deterministic fetch URL: ${requestUrl}`);
  }

  return { fetchResponse, requests };
}

async function expectSmokeFailure(fetchResponse, expectedMessageParts) {
  let receivedError;

  try {
    await runProductionSeoSmoke({ fetchResponse, origin: productionOrigin });
  } catch (error) {
    receivedError = error;
  }

  expect(receivedError).toBeInstanceOf(Error);
  for (const expectedMessagePart of expectedMessageParts) {
    expect(receivedError.message).toContain(expectedMessagePart);
  }

  return receivedError;
}

function expectArgumentRejection(argumentValues) {
  let receivedError;

  try {
    parseProductionSeoSmokeArguments(argumentValues);
  } catch (error) {
    receivedError = error;
  }

  expect(receivedError).toBeInstanceOf(Error);
  expect(receivedError.message).toContain(JSON.stringify(argumentValues));
}

describe("production SEO smoke arguments", () => {
  it("accepts the required HTTPS root origin", () => {
    expect(
      parseProductionSeoSmokeArguments([
        "--origin",
        "https://stardewvalleyplanner.art",
      ]),
    ).toEqual({ origin: "https://stardewvalleyplanner.art" });
  });

  it.each([
    ["missing origin", []],
    [
      "duplicate origin",
      [
        "--origin",
        "https://stardewvalleyplanner.art",
        "--origin",
        "https://stardewvalleyplanner.art",
      ],
    ],
    ["unknown option", ["--unknown", "https://stardewvalleyplanner.art"]],
    ["HTTP origin", ["--origin", "http://stardewvalleyplanner.art"]],
    [
      "origin with query",
      ["--origin", "https://stardewvalleyplanner.art?source=smoke"],
    ],
    [
      "origin with fragment",
      ["--origin", "https://stardewvalleyplanner.art#smoke"],
    ],
    [
      "origin with credentials",
      ["--origin", "https://user:secret@stardewvalleyplanner.art"],
    ],
    [
      "non-root origin",
      ["--origin", "https://stardewvalleyplanner.art/privacy"],
    ],
    [
      "dot-segment non-root origin",
      ["--origin", "https://stardewvalleyplanner.art/farm/.."],
    ],
  ])("rejects %s and reports all received argument values", (_label, argumentValues) => {
    expectArgumentRejection(argumentValues);
  });
});

describe("production SEO smoke static contract", () => {
  it("declares all 16 localized public HTML paths", () => {
    expect(expectedPublicHtmlPathContracts).toHaveLength(16);
    expect(
      expectedPublicHtmlPathContracts.map(({ pathname }) => pathname),
    ).toEqual(expectedPublicHtmlPathnames);
    expect(Object.isFrozen(expectedPublicHtmlPathContracts)).toBe(true);
    expect(
      expectedPublicHtmlPathContracts.every((pathContract) =>
        Object.isFrozen(pathContract),
      ),
    ).toBe(true);
  });

  it("declares the exact 14 indexable sitemap pathnames", () => {
    expect(expectedSitemapPathnames).toHaveLength(14);
    expect(expectedSitemapPathnames).toEqual(
      expectedPublicHtmlPathnames.filter(
        (pathname) => !expectedNoindexContactPathnamesForFixture.includes(pathname),
      ),
    );
  });

  it("adds all eight blog pathnames to the indexable sitemap contract", () => {
    expect(expectedSitemapPathnames).toEqual(
      expect.arrayContaining(expectedBlogPathnamesForFixture),
    );
  });

  it("keeps every noindex path outside the sitemap", () => {
    expect(expectedNoindexContactPathnames).toEqual(
      expectedNoindexContactPathnamesForFixture,
    );
    for (const contactPathname of expectedNoindexContactPathnames) {
      expect(expectedSitemapPathnames).not.toContain(contactPathname);
    }
  });

  it("declares a missing-page probe and the mandatory fixed-name security headers", () => {
    expect(missingPageProbePathname).toBe(
      "/__production-seo-smoke-missing-page__",
    );
    expect(requiredSecurityHeaderNames).toEqual([
      ...expectedRequiredSecurityHeaderNamesForFixture,
    ]);
  });
});

describe("production SEO smoke HTTP and HTML checks", () => {
  it("reports the request URL, network check, and built-in fetch TypeError", async () => {
    const redirectProbeUrl =
      "http://stardewvalleyplanner.art/privacy?seo_https_probe=1";
    const fetchResponse = async () => {
      throw new TypeError("fixture network unavailable");
    };

    await expectSmokeFailure(fetchResponse, [
      redirectProbeUrl,
      "network response",
      "fixture network unavailable",
    ]);
  });

  it("checks the HTTPS redirect, all public HTML, robots, exact sitemap, and HTML 404", async () => {
    const { fetchResponse, requests } = createDeterministicFetch();

    const summary = await runProductionSeoSmoke({
      fetchResponse,
      origin: productionOrigin,
    });

    expect(summary).toMatchObject({
      publicHtmlPageCount: 16,
      sitemapUrlCount: 14,
      noindexContactPageCount: 2,
      missingPageCount: 1,
    });
    expect(requests).toHaveLength(22);
    expect(requests[0]).toEqual({
      requestUrl:
        "http://stardewvalleyplanner.art/privacy?seo_https_probe=1",
      init: { redirect: "manual" },
    });
    expect(requests[1]).toEqual({
      requestUrl:
        "https://stardewvalleyplanner.art/privacy?seo_https_probe=1",
      init: { redirect: "manual" },
    });
    expect(
      requests
        .slice(2, 18)
        .map(({ requestUrl }) => new URL(requestUrl).pathname),
    ).toEqual(expectedPublicHtmlPathnames);
  });

  it("rejects a second redirect from the query-preserving HTTPS target", async () => {
    const httpsRedirectTargetUrl =
      `${productionOrigin}/privacy?seo_https_probe=1`;
    const { fetchResponse, requests } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          httpsRedirectTargetUrl,
          () =>
            new Response(null, {
              status: 302,
              headers: { location: `${productionOrigin}/privacy` },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      httpsRedirectTargetUrl,
      "status 200",
      "302",
    ]);
    expect(requests).toHaveLength(2);
  });

  it("fails immediately when the HTTPS redirect does not preserve path and query", async () => {
    const redirectProbeUrl =
      "http://stardewvalleyplanner.art/privacy?seo_https_probe=1";
    const { fetchResponse, requests } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          redirectProbeUrl,
          () =>
            new Response(null, {
              status: 301,
              headers: { location: `${productionOrigin}/` },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      redirectProbeUrl,
      "redirect location",
      `${productionOrigin}/`,
    ]);
    expect(requests).toHaveLength(1);
  });

  it("reports the public URL, status check, and actual status", async () => {
    const failedUrl = `${productionOrigin}/privacy`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [failedUrl, () => createTextResponse("Unavailable", 503, "text/html")],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [failedUrl, "status 200", "503"]);
  });

  it("reports the public URL, content-type check, and actual media type", async () => {
    const failedUrl = `${productionOrigin}/privacy`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [failedUrl, () => createTextResponse("{}", 200, "application/json")],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      failedUrl,
      "content type text/html",
      "application/json",
    ]);
  });

  it("requires literal canonical and language-alternate URLs", async () => {
    const failedPathname = "/zh/privacy";
    const failedUrl = `${productionOrigin}${failedPathname}`;
    const { fetchResponse } = createDeterministicFetch({
      htmlOverridesByPathname: new Map([
        [
          failedPathname,
          {
            canonicalUrl: `${productionOrigin}/privacy`,
          },
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      failedUrl,
      "canonical URL",
      `${productionOrigin}/privacy`,
    ]);

    const wrongAlternatePathname = "/terms";
    const wrongAlternateUrl = `${productionOrigin}${wrongAlternatePathname}`;
    const { fetchResponse: fetchWrongAlternate } = createDeterministicFetch({
      htmlOverridesByPathname: new Map([
        [
          wrongAlternatePathname,
          {
            languageAlternates: {
              en: wrongAlternateUrl,
              "zh-CN": `${productionOrigin}/zh/privacy`,
              "x-default": wrongAlternateUrl,
            },
          },
        ],
      ]),
    });

    await expectSmokeFailure(fetchWrongAlternate, [
      wrongAlternateUrl,
      "zh-CN hreflang URL",
      `${productionOrigin}/zh/privacy`,
    ]);
  });

  it("rejects blog metadata that exists only inside an HTML comment", async () => {
    const blogPathname = "/blog";
    const blogUrl = `${productionOrigin}${blogPathname}`;
    const expectedPathContract = getExpectedLocalizedPathContract(blogPathname);
    const commentedMetadata = [
      `<link href="${expectedPathContract.canonicalUrl}" rel="canonical">`,
      `<link href="${expectedPathContract.languageAlternates.en}" hreflang="en" rel="alternate">`,
      `<link href="${expectedPathContract.languageAlternates["zh-CN"]}" hreflang="zh-CN" rel="alternate">`,
      `<link href="${expectedPathContract.languageAlternates["x-default"]}" hreflang="x-default" rel="alternate">`,
      '<meta name="robots" content="index, follow">',
    ].join("");
    const commentOnlyMetadataHtml =
      `<!doctype html><html><head><!--${commentedMetadata}--></head><body>Blog</body></html>`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          blogUrl,
          () =>
            createTextResponse(
              commentOnlyMetadataHtml,
              200,
              "text/html",
              enforcedHtmlSecurityHeaders,
            ),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      blogUrl,
      "exactly one HTML element",
      "0",
    ]);
  });

  it("requires noindex, follow on every Contact page", async () => {
    for (const failedPathname of ["/contact", "/zh/contact"]) {
      const failedUrl = `${productionOrigin}${failedPathname}`;
      const { fetchResponse } = createDeterministicFetch({
        htmlOverridesByPathname: new Map([
          [failedPathname, { robotsContent: "index, follow" }],
        ]),
      });

      await expectSmokeFailure(fetchResponse, [
        failedUrl,
        "robots noindex, follow",
        "index, follow",
      ]);
    }
  });

  it("requires index, follow on every indexable public page", async () => {
    const failedPathname = "/blog/archive";
    const failedUrl = `${productionOrigin}${failedPathname}`;
    const { fetchResponse } = createDeterministicFetch({
      htmlOverridesByPathname: new Map([
        [failedPathname, { robotsContent: "noindex, follow" }],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      failedUrl,
      "robots index, follow without noindex",
      "noindex, follow",
    ]);
  });

  it("rejects conflicting index and noindex directives on noindex pages", async () => {
    const failedPathname = "/zh/contact";
    const failedUrl = `${productionOrigin}${failedPathname}`;
    const { fetchResponse } = createDeterministicFetch({
      htmlOverridesByPathname: new Map([
        [failedPathname, { robotsContent: "index, noindex, follow" }],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      failedUrl,
      "robots noindex, follow without index",
      "index, noindex, follow",
    ]);
  });

  it("requires robots.txt to declare the absolute sitemap URL", async () => {
    const robotsUrl = `${productionOrigin}/robots.txt`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          robotsUrl,
          () => createTextResponse("User-Agent: *\nAllow: /\n", 200, "text/plain"),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      robotsUrl,
      "absolute sitemap declaration",
      "User-Agent",
    ]);
  });

  it("requires the unique sitemap location set to exactly match all 14 URLs", async () => {
    const sitemapUrl = `${productionOrigin}/sitemap.xml`;
    const incompleteSitemapPathnames = expectedSitemapPathnamesForFixture.slice(1);
    const incompleteSitemapXml = `<urlset>${incompleteSitemapPathnames
      .map(
        (pathname) => `<url><loc>${createExpectedAbsoluteUrl(pathname)}</loc></url>`,
      )
      .join("")}</urlset>`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          sitemapUrl,
          () => createTextResponse(incompleteSitemapXml, 200, "application/xml"),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      sitemapUrl,
      "14 unique sitemap URLs",
      "13",
    ]);
  });

  it("rejects sitemap locations under a non-urlset root element", async () => {
    const sitemapUrl = `${productionOrigin}/sitemap.xml`;
    const sitemapLocations = expectedSitemapPathnamesForFixture
      .map(
        (pathname) => `<loc>${createExpectedAbsoluteUrl(pathname)}</loc>`,
      )
      .join("");
    const nonSitemapXml = `<feed>${sitemapLocations}</feed>`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          sitemapUrl,
          () => createTextResponse(nonSitemapXml, 200, "application/xml"),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      sitemapUrl,
      "urlset root element",
      "feed",
    ]);
  });

  it("rejects sitemap locations that exist only inside an XML comment", async () => {
    const sitemapUrl = `${productionOrigin}/sitemap.xml`;
    const sitemapLocations = expectedSitemapPathnamesForFixture
      .map(
        (pathname) => `<loc>${createExpectedAbsoluteUrl(pathname)}</loc>`,
      )
      .join("");
    const commentOnlySitemapXml = `<urlset><!--${sitemapLocations}--></urlset>`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          sitemapUrl,
          () =>
            createTextResponse(
              commentOnlySitemapXml,
              200,
              "application/xml",
            ),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      sitemapUrl,
      "14 unique sitemap URLs",
      "0",
    ]);
  });

  it("requires the missing-page probe to be 404 noindex HTML", async () => {
    const missingUrl = `${productionOrigin}/__production-seo-smoke-missing-page__`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          missingUrl,
          () => createTextResponse('{"error":"missing"}', 404, "application/json"),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      missingUrl,
      "content type text/html",
      "application/json",
    ]);
  });

  it.each(bodyReadFailureCases)(
    "wraps $bodyDescription body-read TypeError with URL, check, actual, and cause",
    async ({ expectedCheck, requestUrl }) => {
      const bodyReadError = new TypeError(
        `fixture body stream failed for ${requestUrl}`,
      );
      const { fetchResponse } = createDeterministicFetch({
        responseFactoriesByUrl: new Map([
          [
            requestUrl,
            () => createBodyReadFailureResponse(requestUrl, bodyReadError),
          ],
        ]),
      });

      const receivedError = await expectSmokeFailure(fetchResponse, [
        requestUrl,
        expectedCheck,
        bodyReadError.message,
      ]);
      expect(receivedError.cause).toBe(bodyReadError);
    },
  );

  it.each(bodyReadFailureCases)(
    "preserves an unknown $bodyDescription body-read exception unchanged",
    async ({ requestUrl }) => {
      const unknownBodyReadError = new Error(
        `unknown fixture body failure for ${requestUrl}`,
      );
      const { fetchResponse } = createDeterministicFetch({
        responseFactoriesByUrl: new Map([
          [
            requestUrl,
            () =>
              createBodyReadFailureResponse(requestUrl, unknownBodyReadError),
          ],
        ]),
      });

      await expect(
        runProductionSeoSmoke({ fetchResponse, origin: productionOrigin }),
      ).rejects.toBe(unknownBodyReadError);
    },
  );
});

describe("production SEO smoke security headers and static caching", () => {
  it("checks security headers on every HTTPS HTML response and one hashed static asset", async () => {
    const { fetchResponse, requests } = createDeterministicFetch();

    const summary = await runProductionSeoSmoke({
      fetchResponse,
      origin: productionOrigin,
    });

    expect(summary).toEqual({
      publicHtmlPageCount: 16,
      sitemapUrlCount: 14,
      noindexContactPageCount: 2,
      missingPageCount: 1,
      securityHeaderResponseCount: 17,
      cachedStaticAssetCount: 1,
      totalRequestCount: 22,
    });
    expect(Object.isFrozen(summary)).toBe(true);
    expect(requests.at(-1)).toEqual({
      requestUrl: `${productionOrigin}${hashedStaticAssetPathname}`,
      init: { redirect: "manual" },
    });
  });

  it.each(expectedRequiredSecurityHeaderNamesForFixture)(
    "fails when an HTTPS HTML response omits %s",
    async (missingHeaderName) => {
      const homepageUrl = productionOrigin;
      const { fetchResponse } = createDeterministicFetch({
        responseFactoriesByUrl: new Map([
          [
            homepageUrl,
            () =>
              createHtmlResponse("/", {
                removedSecurityHeaderNames: [missingHeaderName],
              }),
          ],
        ]),
      });

      await expectSmokeFailure(fetchResponse, [
        homepageUrl,
        `security header ${missingHeaderName}`,
        "null",
      ]);
    },
  );

  it("accepts CSP Report-Only with X-Frame-Options as enforced frame protection", async () => {
    const homepageUrl = productionOrigin;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          homepageUrl,
          () =>
            createHtmlResponse("/", {
              removedSecurityHeaderNames: ["content-security-policy"],
              securityHeaderOverrides: {
                "content-security-policy-report-only": "default-src 'self'",
                "x-frame-options": "DENY",
              },
            }),
        ],
      ]),
    });

    await expect(
      runProductionSeoSmoke({ fetchResponse, origin: productionOrigin }),
    ).resolves.toMatchObject({ securityHeaderResponseCount: 17 });
  });

  it("rejects missing CSP and missing enforced frame protection", async () => {
    const homepageUrl = productionOrigin;
    const { fetchResponse: fetchMissingCsp } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          homepageUrl,
          () =>
            createHtmlResponse("/", {
              removedSecurityHeaderNames: ["content-security-policy"],
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchMissingCsp, [
      homepageUrl,
      "CSP or CSP Report-Only header",
      "null",
    ]);

    const { fetchResponse: fetchMissingFrameProtection } =
      createDeterministicFetch({
        responseFactoriesByUrl: new Map([
          [
            homepageUrl,
            () =>
              createHtmlResponse("/", {
                securityHeaderOverrides: {
                  "content-security-policy": "default-src 'self'",
                },
              }),
          ],
        ]),
      });

    await expectSmokeFailure(fetchMissingFrameProtection, [
      homepageUrl,
      "frame protection",
      "default-src",
    ]);
  });

  it("requires X-Content-Type-Options to equal nosniff", async () => {
    const homepageUrl = productionOrigin;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          homepageUrl,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "x-content-type-options": "invalid",
              },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      homepageUrl,
      "X-Content-Type-Options nosniff",
      "invalid",
    ]);
  });

  it("requires HSTS to declare a positive max-age", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "strict-transport-security": "max-age=0",
              },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "positive HSTS max-age",
      "max-age=0",
    ]);
  });

  it("accepts a quoted positive HSTS max-age", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "strict-transport-security":
                  'max-age="31536000"; includeSubDomains',
              },
            }),
        ],
      ]),
    });

    await expect(
      runProductionSeoSmoke({ fetchResponse, origin: productionOrigin }),
    ).resolves.toMatchObject({ securityHeaderResponseCount: 17 });
  });

  it("rejects a quoted zero HSTS max-age", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "strict-transport-security": 'max-age="0"',
              },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "positive HSTS max-age",
      'max-age=\\"0\\"',
    ]);
  });

  it("rejects wildcard-only CSP frame ancestors without X-Frame-Options", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "content-security-policy":
                  "default-src 'self'; frame-ancestors *",
              },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "frame protection",
      "frame-ancestors *",
    ]);
  });

  it("rejects wildcard enforced CSP frame ancestors even with X-Frame-Options DENY", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "content-security-policy":
                  "default-src 'self'; frame-ancestors *",
                "x-frame-options": "DENY",
              },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "frame protection",
      "frame-ancestors *",
      "DENY",
    ]);
  });

  it("rejects empty enforced CSP frame ancestors even with X-Frame-Options DENY", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "content-security-policy":
                  "default-src 'self'; frame-ancestors   ; script-src 'self'",
                "x-frame-options": "DENY",
              },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "frame protection",
      "frame-ancestors   ;",
      "DENY",
    ]);
  });

  it("rejects wildcard frame ancestors in a comma-separated policy despite X-Frame-Options DENY", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "content-security-policy":
                  "default-src https:, frame-ancestors *",
                "x-frame-options": "DENY",
              },
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "frame protection",
      "default-src https:, frame-ancestors *",
      "DENY",
    ]);
  });

  it("accepts restrictive frame ancestors in a comma-separated policy without X-Frame-Options", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "content-security-policy":
                  "default-src https:, frame-ancestors https://trusted.example",
              },
            }),
        ],
      ]),
    });

    await expect(
      runProductionSeoSmoke({ fetchResponse, origin: productionOrigin }),
    ).resolves.toMatchObject({ securityHeaderResponseCount: 17 });
  });

  it("accepts multiple declared policies when their combined frame ancestors are restrictive", async () => {
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createHtmlResponse("/", {
              securityHeaderOverrides: {
                "content-security-policy":
                  "frame-ancestors * , frame-ancestors https://trusted.example",
              },
            }),
        ],
      ]),
    });

    await expect(
      runProductionSeoSmoke({ fetchResponse, origin: productionOrigin }),
    ).resolves.toMatchObject({ securityHeaderResponseCount: 17 });
  });

  it("checks security headers on the missing-page HTML response", async () => {
    const missingPageUrl =
      `${productionOrigin}/__production-seo-smoke-missing-page__`;
    const missingPageHeaders = { ...enforcedHtmlSecurityHeaders };
    delete missingPageHeaders["strict-transport-security"];
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          missingPageUrl,
          () =>
            createTextResponse(
              '<meta name="robots" content="noindex, follow">',
              404,
              "text/html",
              missingPageHeaders,
            ),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      missingPageUrl,
      "security header strict-transport-security",
      "null",
    ]);
  });

  it("requires a same-origin hashed Next static CSS or JS URL on the homepage", async () => {
    const { fetchResponse } = createDeterministicFetch({
      htmlOverridesByPathname: new Map([
        [
          "/",
          {
            staticAssetUrl:
              "https://cdn.example.com/_next/static/chunks/app-0123456789abcdef.js",
          },
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "same-origin hashed /_next/static/ CSS or JS URL",
      "cdn.example.com",
    ]);
  });

  it("rejects a hashed Next static asset that exists only inside an HTML comment", async () => {
    const homepageHtml = createPublicHtml("/").replace(
      `<script src="${hashedStaticAssetPathname}"></script>`,
      `<!--<script src="${hashedStaticAssetPathname}"></script>-->`,
    );
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createTextResponse(
              homepageHtml,
              200,
              "text/html",
              enforcedHtmlSecurityHeaders,
            ),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "same-origin hashed /_next/static/ CSS or JS URL",
      "Actual value",
    ]);
  });

  it("rejects an unhashed named Next static asset", async () => {
    const frameworkAssetPathname = "/_next/static/chunks/framework.js";
    const frameworkAssetUrl = `${productionOrigin}${frameworkAssetPathname}`;
    const homepageHtml = createPublicHtml("/", {
      staticAssetUrl: frameworkAssetPathname,
    });
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          productionOrigin,
          () =>
            createTextResponse(
              homepageHtml,
              200,
              "text/html",
              enforcedHtmlSecurityHeaders,
            ),
        ],
        [
          frameworkAssetUrl,
          () =>
            createTextResponse("framework", 200, "text/javascript", {
              "cache-control": "public, max-age=31536000, immutable",
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      productionOrigin,
      "same-origin hashed /_next/static/ CSS or JS URL",
      "framework.js",
    ]);
  });

  it("requires the hashed static asset response to have a positive max-age", async () => {
    const assetUrl = `${productionOrigin}${hashedStaticAssetPathname}`;
    const { fetchResponse } = createDeterministicFetch({
      responseFactoriesByUrl: new Map([
        [
          assetUrl,
          () =>
            createTextResponse("asset", 200, "text/javascript", {
              "cache-control": "public, max-age=0",
            }),
        ],
      ]),
    });

    await expectSmokeFailure(fetchResponse, [
      assetUrl,
      "positive cache max-age",
      "max-age=0",
    ]);
  });
});

describe("production SEO smoke CLI", () => {
  it("fails with a nonzero exit before network access when --origin is missing", () => {
    const smokeScriptPath = fileURLToPath(
      new URL("../../scripts/production-seo-smoke.mjs", import.meta.url),
    );
    const cliResult = spawnSync(process.execPath, [smokeScriptPath], {
      encoding: "utf8",
    });

    expect(cliResult.status).not.toBe(0);
    expect(cliResult.stdout).toBe("");
    expect(cliResult.stderr).toContain("Received argument values: []");
  });
});
