import { pathToFileURL } from "node:url";

import {
  expectedNoindexBlogPathnames,
  expectedNoindexContactPathnames,
  expectedPublicHtmlPathContracts,
  expectedSitemapPathnames,
  missingPageProbePathname,
  requiredSecurityHeaderNames,
} from "./production-seo-smoke-contract.mjs";

function createArgumentError(message, argumentValues, options) {
  return new Error(
    `${message} Received argument values: ${JSON.stringify(argumentValues)}.`,
    options,
  );
}

function readUnnormalizedUrlPathname(urlValue) {
  const authorityStartIndex = urlValue.indexOf("://") + 3;
  const pathnameStartIndex = urlValue.indexOf("/", authorityStartIndex);

  if (pathnameStartIndex === -1) {
    return "";
  }

  const queryStartIndex = urlValue.indexOf("?", pathnameStartIndex);
  const fragmentStartIndex = urlValue.indexOf("#", pathnameStartIndex);
  const pathnameEndIndexes = [queryStartIndex, fragmentStartIndex].filter(
    (endIndex) => endIndex !== -1,
  );
  const pathnameEndIndex =
    pathnameEndIndexes.length === 0
      ? urlValue.length
      : Math.min(...pathnameEndIndexes);

  return urlValue.slice(pathnameStartIndex, pathnameEndIndex);
}

export function parseProductionSeoSmokeArguments(argumentValues) {
  if (
    !Array.isArray(argumentValues)
    || argumentValues.length !== 2
    || argumentValues[0] !== "--origin"
    || typeof argumentValues[1] !== "string"
    || argumentValues[1].length === 0
  ) {
    throw createArgumentError(
      "Expected exactly --origin followed by one HTTPS root origin.",
      argumentValues,
    );
  }

  const receivedOrigin = argumentValues[1];
  let parsedOrigin;

  try {
    parsedOrigin = new URL(receivedOrigin);
  } catch (urlParseError) {
    if (!(urlParseError instanceof TypeError)) {
      throw urlParseError;
    }

    throw createArgumentError(
      "Production SEO smoke origin must be an absolute HTTPS root origin.",
      argumentValues,
      { cause: urlParseError },
    );
  }

  if (
    parsedOrigin.protocol !== "https:"
    || parsedOrigin.username.length > 0
    || parsedOrigin.password.length > 0
    || parsedOrigin.pathname !== "/"
    || !["", "/"].includes(readUnnormalizedUrlPathname(receivedOrigin))
    || parsedOrigin.search.length > 0
    || parsedOrigin.hash.length > 0
  ) {
    throw createArgumentError(
      "Production SEO smoke origin must use HTTPS without credentials, path, query, or fragment.",
      argumentValues,
    );
  }

  return Object.freeze({ origin: parsedOrigin.origin });
}

function throwContractError(requestUrl, expectedCheck, actualValue) {
  throw new Error(
    `Production SEO smoke failed for request URL ${JSON.stringify(requestUrl)}. Expected ${expectedCheck}. Actual value: ${JSON.stringify(actualValue)}.`,
  );
}

function normalizeProductionSeoSmokeOrigin(origin) {
  if (typeof origin !== "string" || origin.length === 0) {
    throwContractError(
      origin,
      "an HTTPS root origin string",
      origin,
    );
  }

  let parsedOrigin;

  try {
    parsedOrigin = new URL(origin);
  } catch (urlParseError) {
    if (!(urlParseError instanceof TypeError)) {
      throw urlParseError;
    }

    throw new Error(
      `Production SEO smoke failed for request URL ${JSON.stringify(origin)}. Expected an absolute HTTPS root origin. Actual value: ${JSON.stringify(origin)}.`,
      { cause: urlParseError },
    );
  }

  if (
    parsedOrigin.protocol !== "https:"
    || parsedOrigin.username.length > 0
    || parsedOrigin.password.length > 0
    || parsedOrigin.pathname !== "/"
    || !["", "/"].includes(readUnnormalizedUrlPathname(origin))
    || parsedOrigin.search.length > 0
    || parsedOrigin.hash.length > 0
  ) {
    throwContractError(
      origin,
      "an HTTPS origin without credentials, path, query, or fragment",
      origin,
    );
  }

  return parsedOrigin.origin;
}

function createProductionUrl(origin, pathname) {
  return pathname === "/" ? origin : `${origin}${pathname}`;
}

async function requestProductionResponse(fetchResponse, requestUrl) {
  let response;

  try {
    response = await fetchResponse(requestUrl, { redirect: "manual" });
  } catch (networkError) {
    if (!(networkError instanceof TypeError)) {
      throw networkError;
    }

    throw new Error(
      `Production SEO smoke failed for request URL ${JSON.stringify(requestUrl)}. Expected a network response. Actual value: ${JSON.stringify(networkError.message)}.`,
      { cause: networkError },
    );
  }

  if (
    response === null
    || typeof response !== "object"
    || typeof response.status !== "number"
    || typeof response.headers?.get !== "function"
    || typeof response.text !== "function"
  ) {
    throwContractError(
      requestUrl,
      "fetchResponse to return a Response-compatible object",
      response,
    );
  }

  return response;
}

async function readResponseText(requestUrl, response, bodyDescription) {
  try {
    return await response.text();
  } catch (bodyReadError) {
    if (!(bodyReadError instanceof TypeError)) {
      throw bodyReadError;
    }

    throw new Error(
      `Production SEO smoke failed for request URL ${JSON.stringify(requestUrl)}. Expected a readable ${bodyDescription} response body. Actual value: ${JSON.stringify(bodyReadError.message)}.`,
      { cause: bodyReadError },
    );
  }
}

function assertExpectedStatus(requestUrl, response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throwContractError(
      requestUrl,
      `status ${String(expectedStatus)}`,
      response.status,
    );
  }
}

function assertExpectedRedirectStatus(requestUrl, response) {
  if (response.status !== 301 && response.status !== 308) {
    throwContractError(requestUrl, "redirect status 301 or 308", response.status);
  }
}

function readResponseMediaType(response) {
  const contentType = response.headers.get("content-type");

  if (contentType === null) {
    return null;
  }

  return contentType.split(";", 1)[0].trim().toLowerCase();
}

function assertExpectedContentType(requestUrl, response, expectedMediaType) {
  const receivedMediaType = readResponseMediaType(response);
  const acceptedMediaTypes = Array.isArray(expectedMediaType)
    ? expectedMediaType
    : [expectedMediaType];

  if (!acceptedMediaTypes.includes(receivedMediaType)) {
    const expectedMediaTypeDescription = acceptedMediaTypes.join(" or ");
    throwContractError(
      requestUrl,
      `content type ${expectedMediaTypeDescription}`,
      receivedMediaType,
    );
  }
}

function escapeRegularExpression(literalValue) {
  return literalValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeMarkupComments(markup) {
  return markup.replace(/<!--[\s\S]*?-->/g, "");
}

function createElementWithAttributePattern(
  elementName,
  requiredAttributeValues,
) {
  const attributeLookaheads = Object.entries(requiredAttributeValues)
    .map(([attributeName, attributeValue]) => {
      const escapedAttributeName = escapeRegularExpression(attributeName);
      const escapedAttributeValue = escapeRegularExpression(attributeValue);
      return `(?=[^>]*\\b${escapedAttributeName}\\s*=\\s*(?:"${escapedAttributeValue}"|'${escapedAttributeValue}'))`;
    })
    .join("");

  return new RegExp(`<${elementName}\\b${attributeLookaheads}[^>]*>`, "gi");
}

function readSingleHtmlAttribute(
  requestUrl,
  html,
  elementPattern,
  attributeName,
) {
  const uncommentedHtml = removeMarkupComments(html);
  const matchingElements = uncommentedHtml.match(elementPattern) ?? [];

  if (matchingElements.length !== 1) {
    throwContractError(
      requestUrl,
      `exactly one HTML element matching ${String(elementPattern)}`,
      matchingElements.length,
    );
  }

  const escapedAttributeName = escapeRegularExpression(attributeName);
  const attributeMatch = matchingElements[0].match(
    new RegExp(
      `(?:^|\\s)${escapedAttributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`,
      "i",
    ),
  );
  const attributeValue = attributeMatch?.[1] ?? attributeMatch?.[2];

  if (attributeValue === undefined) {
    throwContractError(
      requestUrl,
      `HTML attribute ${attributeName}`,
      matchingElements[0],
    );
  }

  return attributeValue;
}

function assertExpectedCanonical(requestUrl, html, expectedCanonicalUrl) {
  const canonicalUrl = readSingleHtmlAttribute(
    requestUrl,
    html,
    createElementWithAttributePattern("link", { rel: "canonical" }),
    "href",
  );

  if (canonicalUrl !== expectedCanonicalUrl) {
    throwContractError(requestUrl, "canonical URL", canonicalUrl);
  }
}

function assertExpectedLanguageAlternates(
  requestUrl,
  html,
  expectedAlternates,
) {
  for (const [language, expectedAlternateUrl] of Object.entries(
    expectedAlternates,
  )) {
    const alternateUrl = readSingleHtmlAttribute(
      requestUrl,
      html,
      createElementWithAttributePattern("link", {
        rel: "alternate",
        hreflang: language,
      }),
      "href",
    );

    if (alternateUrl !== expectedAlternateUrl) {
      throwContractError(
        requestUrl,
        `${language} hreflang URL ${JSON.stringify(expectedAlternateUrl)}`,
        alternateUrl,
      );
    }
  }
}

function readRobotsDirectives(requestUrl, html) {
  const robotsContent = readSingleHtmlAttribute(
    requestUrl,
    html,
    createElementWithAttributePattern("meta", { name: "robots" }),
    "content",
  );
  const robotsDirectives = robotsContent
    .toLowerCase()
    .split(",")
    .map((directive) => directive.trim())
    .filter((directive) => directive.length > 0);

  return { robotsContent, robotsDirectives };
}

function assertNoindexFollowHtml(requestUrl, html) {
  const { robotsContent, robotsDirectives } = readRobotsDirectives(
    requestUrl,
    html,
  );

  if (
    !robotsDirectives.includes("noindex")
    || !robotsDirectives.includes("follow")
    || robotsDirectives.includes("index")
  ) {
    throwContractError(
      requestUrl,
      "robots noindex, follow without index",
      robotsContent,
    );
  }
}

function assertIndexFollowHtml(requestUrl, html) {
  const { robotsContent, robotsDirectives } = readRobotsDirectives(
    requestUrl,
    html,
  );

  if (
    !robotsDirectives.includes("index")
    || !robotsDirectives.includes("follow")
    || robotsDirectives.includes("noindex")
  ) {
    throwContractError(
      requestUrl,
      "robots index, follow without noindex",
      robotsContent,
    );
  }
}

function assertExpectedRedirectLocation(
  requestUrl,
  response,
  expectedRedirectLocation,
) {
  const redirectLocation = response.headers.get("location");

  if (redirectLocation !== expectedRedirectLocation) {
    throwContractError(
      requestUrl,
      `redirect location ${JSON.stringify(expectedRedirectLocation)}`,
      redirectLocation,
    );
  }
}

function assertRobotsSitemapDeclaration(
  robotsUrl,
  robotsText,
  expectedSitemapUrl,
) {
  const sitemapDeclarationPattern = new RegExp(
    `^\\s*Sitemap:\\s*${escapeRegularExpression(expectedSitemapUrl)}\\s*$`,
    "im",
  );

  if (!sitemapDeclarationPattern.test(robotsText)) {
    throwContractError(
      robotsUrl,
      `absolute sitemap declaration ${JSON.stringify(expectedSitemapUrl)}`,
      robotsText,
    );
  }
}

function readSitemapLocationValues(sitemapUrl, sitemapXml) {
  const uncommentedSitemapXml = removeMarkupComments(sitemapXml);
  const urlsetRootMatch = uncommentedSitemapXml.match(
    /^\uFEFF?\s*(?:<\?xml\b[\s\S]*?\?>\s*)?<urlset\b[^>]*>([\s\S]*)<\/urlset>\s*$/i,
  );

  if (urlsetRootMatch === null) {
    throwContractError(
      sitemapUrl,
      "a sitemap XML document with a urlset root element",
      uncommentedSitemapXml,
    );
  }

  const sitemapLocationValues = Array.from(
    urlsetRootMatch[1].matchAll(/<loc(?:\s[^>]*)?>([^<]*)<\/loc>/gi),
    ([, locationValue]) => locationValue.trim(),
  );

  if (sitemapLocationValues.some((locationValue) => locationValue.length === 0)) {
    throwContractError(
      sitemapUrl,
      "every sitemap loc element to contain a URL",
      sitemapLocationValues,
    );
  }

  return sitemapLocationValues;
}

function assertExpectedSitemapLocations(
  sitemapUrl,
  sitemapLocationValues,
  expectedSitemapUrls,
) {
  const uniqueSitemapLocationValues = new Set(sitemapLocationValues);
  const expectedSitemapUrlSet = new Set(expectedSitemapUrls);
  const hasExactExpectedUrls =
    uniqueSitemapLocationValues.size === expectedSitemapUrlSet.size
    && [...expectedSitemapUrlSet].every((expectedUrl) =>
      uniqueSitemapLocationValues.has(expectedUrl),
    );

  if (
    sitemapLocationValues.length !== expectedSitemapUrls.length
    || uniqueSitemapLocationValues.size !== expectedSitemapUrls.length
    || !hasExactExpectedUrls
  ) {
    throwContractError(
      sitemapUrl,
      `${String(expectedSitemapUrls.length)} unique sitemap URLs exactly equal the production contract`,
      {
        locationCount: sitemapLocationValues.length,
        uniqueLocationCount: uniqueSitemapLocationValues.size,
        sitemapLocationValues,
      },
    );
  }
}

function createExpectedLanguageAlternateUrls(origin, pathContract) {
  return Object.fromEntries(
    Object.entries(pathContract.languageAlternatePathnames).map(
      ([language, pathname]) => [language, createProductionUrl(origin, pathname)],
    ),
  );
}

function assertRequiredSecurityHeaders(requestUrl, response) {
  for (const requiredHeaderName of requiredSecurityHeaderNames) {
    const requiredHeaderValue = response.headers.get(requiredHeaderName);

    if (requiredHeaderValue === null || requiredHeaderValue.trim().length === 0) {
      throwContractError(
        requestUrl,
        `security header ${requiredHeaderName}`,
        requiredHeaderValue,
      );
    }
  }

  const strictTransportSecurity = response.headers.get(
    "strict-transport-security",
  );
  const hstsMaxAgeMatch = strictTransportSecurity.match(
    /(?:^|;)\s*max-age\s*=\s*(?:"(\d+)"|(\d+))\s*(?:;|$)/i,
  );
  const hstsMaxAgeText = hstsMaxAgeMatch?.[1] ?? hstsMaxAgeMatch?.[2];
  const hstsMaxAgeSeconds =
    hstsMaxAgeText === undefined
      ? null
      : Number.parseInt(hstsMaxAgeText, 10);

  if (hstsMaxAgeSeconds === null || hstsMaxAgeSeconds <= 0) {
    throwContractError(
      requestUrl,
      "a positive HSTS max-age",
      strictTransportSecurity,
    );
  }

  const contentTypeOptions = response.headers.get("x-content-type-options");
  if (contentTypeOptions.trim().toLowerCase() !== "nosniff") {
    throwContractError(
      requestUrl,
      "X-Content-Type-Options nosniff",
      contentTypeOptions,
    );
  }

  const contentSecurityPolicy = response.headers.get(
    "content-security-policy",
  );
  const reportOnlyContentSecurityPolicy = response.headers.get(
    "content-security-policy-report-only",
  );
  const hasContentSecurityPolicy =
    contentSecurityPolicy !== null
    && contentSecurityPolicy.trim().length > 0;
  const hasReportOnlyContentSecurityPolicy =
    reportOnlyContentSecurityPolicy !== null
    && reportOnlyContentSecurityPolicy.trim().length > 0;

  if (!hasContentSecurityPolicy && !hasReportOnlyContentSecurityPolicy) {
    throwContractError(
      requestUrl,
      "CSP or CSP Report-Only header",
      {
        "content-security-policy": contentSecurityPolicy,
        "content-security-policy-report-only": reportOnlyContentSecurityPolicy,
      },
    );
  }

  const xFrameOptions = response.headers.get("x-frame-options");
  const normalizedXFrameOptions = xFrameOptions?.trim().toUpperCase() ?? "";
  const hasXFrameOptionsProtection =
    normalizedXFrameOptions === "DENY"
    || normalizedXFrameOptions === "SAMEORIGIN";
  const frameAncestorSourceLists = Array.from(
    contentSecurityPolicy?.matchAll(
      /(?:^|[;,])\s*frame-ancestors(?:\s+([^;,]*?))?\s*(?=;|,|$)/gi,
    ) ?? [],
    (frameAncestorsMatch) => {
      const frameAncestorsValue = frameAncestorsMatch[1]?.trim() ?? "";
      return frameAncestorsValue.length === 0
        ? []
        : frameAncestorsValue.split(/\s+/);
    },
  );
  const hasFrameAncestorsDirective = frameAncestorSourceLists.length > 0;
  const hasEnforcedFrameAncestors = frameAncestorSourceLists.some(
    (frameAncestorSources) =>
      frameAncestorSources.length > 0
      && !frameAncestorSources.includes("*"),
  );
  const hasEnforcedFrameProtection = hasFrameAncestorsDirective
    ? hasEnforcedFrameAncestors
    : hasXFrameOptionsProtection;

  if (!hasEnforcedFrameProtection) {
    throwContractError(
      requestUrl,
      "frame protection from X-Frame-Options or enforced CSP frame-ancestors",
      {
        "content-security-policy": contentSecurityPolicy,
        "x-frame-options": xFrameOptions,
      },
    );
  }
}

function readHashedNextStaticAssetUrl(homepageUrl, homepageHtml, origin) {
  const uncommentedHomepageHtml = removeMarkupComments(homepageHtml);
  const assetAttributeValues = Array.from(
    uncommentedHomepageHtml.matchAll(
      /\b(?:src|href)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi,
    ),
    (attributeMatch) => attributeMatch[1] ?? attributeMatch[2],
  );

  for (const assetAttributeValue of assetAttributeValues) {
    if (!URL.canParse(assetAttributeValue, homepageUrl)) {
      continue;
    }

    const assetUrl = new URL(assetAttributeValue, homepageUrl);
    const assetFileName = assetUrl.pathname.split("/").at(-1) ?? "";
    const assetFileStem = assetFileName.replace(/\.(?:css|js)$/i, "");
    const hasHashToken = assetFileStem
      .split(/[-_.]/)
      .some(
        (fileNameToken) =>
          fileNameToken.length >= 8
          && /^[a-z0-9]+$/i.test(fileNameToken)
          && /[a-z]/i.test(fileNameToken)
          && /\d/.test(fileNameToken),
      );

    if (
      assetUrl.origin === origin
      && assetUrl.pathname.startsWith("/_next/static/")
      && /\.(?:css|js)$/i.test(assetUrl.pathname)
      && hasHashToken
    ) {
      return assetUrl.href;
    }
  }

  throwContractError(
    homepageUrl,
    "a same-origin hashed /_next/static/ CSS or JS URL",
    assetAttributeValues,
  );
}

function assertPositiveCacheMaxAge(requestUrl, response) {
  const cacheControl = response.headers.get("cache-control");
  const maxAgeMatch = cacheControl?.match(
    /(?:^|,)\s*max-age\s*=\s*(\d+)\s*(?:,|$)/i,
  );
  const maxAgeSeconds =
    maxAgeMatch?.[1] === undefined
      ? null
      : Number.parseInt(maxAgeMatch[1], 10);

  if (maxAgeSeconds === null || maxAgeSeconds <= 0) {
    throwContractError(requestUrl, "a positive cache max-age", cacheControl);
  }
}

export async function runProductionSeoSmoke({ fetchResponse, origin }) {
  const normalizedOrigin = normalizeProductionSeoSmokeOrigin(origin);

  if (typeof fetchResponse !== "function") {
    throwContractError(
      normalizedOrigin,
      "fetchResponse to be a function compatible with built-in fetch",
      fetchResponse,
    );
  }

  const redirectProbeUrl = `${normalizedOrigin.replace(/^https:/, "http:")}/privacy?seo_https_probe=1`;
  const expectedRedirectLocation = `${normalizedOrigin}/privacy?seo_https_probe=1`;
  const redirectResponse = await requestProductionResponse(
    fetchResponse,
    redirectProbeUrl,
  );
  assertExpectedRedirectStatus(redirectProbeUrl, redirectResponse);
  assertExpectedRedirectLocation(
    redirectProbeUrl,
    redirectResponse,
    expectedRedirectLocation,
  );
  const redirectTargetResponse = await requestProductionResponse(
    fetchResponse,
    expectedRedirectLocation,
  );
  assertExpectedStatus(
    expectedRedirectLocation,
    redirectTargetResponse,
    200,
  );

  const noindexPathnames = new Set([
    ...expectedNoindexBlogPathnames,
    ...expectedNoindexContactPathnames,
  ]);
  let homepageHtml;

  for (const pathContract of expectedPublicHtmlPathContracts) {
    const requestUrl = createProductionUrl(
      normalizedOrigin,
      pathContract.pathname,
    );
    const response = await requestProductionResponse(fetchResponse, requestUrl);
    assertExpectedStatus(requestUrl, response, 200);
    assertExpectedContentType(requestUrl, response, "text/html");
    assertRequiredSecurityHeaders(requestUrl, response);

    const html = await readResponseText(requestUrl, response, "HTML");
    assertExpectedCanonical(requestUrl, html, requestUrl);
    assertExpectedLanguageAlternates(
      requestUrl,
      html,
      createExpectedLanguageAlternateUrls(normalizedOrigin, pathContract),
    );

    if (noindexPathnames.has(pathContract.pathname)) {
      assertNoindexFollowHtml(requestUrl, html);
    } else {
      assertIndexFollowHtml(requestUrl, html);
    }

    if (pathContract.pathname === "/") {
      homepageHtml = html;
    }
  }

  const robotsUrl = `${normalizedOrigin}/robots.txt`;
  const robotsResponse = await requestProductionResponse(fetchResponse, robotsUrl);
  assertExpectedStatus(robotsUrl, robotsResponse, 200);
  assertExpectedContentType(robotsUrl, robotsResponse, "text/plain");
  const robotsText = await readResponseText(
    robotsUrl,
    robotsResponse,
    "robots.txt",
  );
  assertRobotsSitemapDeclaration(
    robotsUrl,
    robotsText,
    `${normalizedOrigin}/sitemap.xml`,
  );

  const sitemapUrl = `${normalizedOrigin}/sitemap.xml`;
  const sitemapResponse = await requestProductionResponse(fetchResponse, sitemapUrl);
  assertExpectedStatus(sitemapUrl, sitemapResponse, 200);
  assertExpectedContentType(sitemapUrl, sitemapResponse, [
    "application/xml",
    "text/xml",
  ]);
  const sitemapXml = await readResponseText(
    sitemapUrl,
    sitemapResponse,
    "sitemap XML",
  );
  const sitemapLocationValues = readSitemapLocationValues(sitemapUrl, sitemapXml);
  const expectedSitemapUrls = expectedSitemapPathnames.map((pathname) =>
    createProductionUrl(normalizedOrigin, pathname),
  );
  assertExpectedSitemapLocations(
    sitemapUrl,
    sitemapLocationValues,
    expectedSitemapUrls,
  );

  const missingPageUrl = `${normalizedOrigin}${missingPageProbePathname}`;
  const missingPageResponse = await requestProductionResponse(
    fetchResponse,
    missingPageUrl,
  );
  assertExpectedStatus(missingPageUrl, missingPageResponse, 404);
  assertExpectedContentType(missingPageUrl, missingPageResponse, "text/html");
  assertRequiredSecurityHeaders(missingPageUrl, missingPageResponse);
  const missingPageHtml = await readResponseText(
    missingPageUrl,
    missingPageResponse,
    "missing-page HTML",
  );
  assertNoindexFollowHtml(missingPageUrl, missingPageHtml);

  if (homepageHtml === undefined) {
    throwContractError(
      normalizedOrigin,
      "the homepage HTML to be checked before static asset caching",
      homepageHtml,
    );
  }

  const hashedStaticAssetUrl = readHashedNextStaticAssetUrl(
    normalizedOrigin,
    homepageHtml,
    normalizedOrigin,
  );
  const hashedStaticAssetResponse = await requestProductionResponse(
    fetchResponse,
    hashedStaticAssetUrl,
  );
  assertExpectedStatus(hashedStaticAssetUrl, hashedStaticAssetResponse, 200);
  assertPositiveCacheMaxAge(hashedStaticAssetUrl, hashedStaticAssetResponse);

  return Object.freeze({
    publicHtmlPageCount: expectedPublicHtmlPathContracts.length,
    sitemapUrlCount: sitemapLocationValues.length,
    noindexBlogPageCount: expectedNoindexBlogPathnames.length,
    noindexContactPageCount: expectedNoindexContactPathnames.length,
    missingPageCount: 1,
    securityHeaderResponseCount: expectedPublicHtmlPathContracts.length + 1,
    cachedStaticAssetCount: 1,
    totalRequestCount: expectedPublicHtmlPathContracts.length + 6,
  });
}

function isExecutedDirectly() {
  return process.argv[1] !== undefined
    && pathToFileURL(process.argv[1]).href === import.meta.url;
}

if (isExecutedDirectly()) {
  const { origin } = parseProductionSeoSmokeArguments(process.argv.slice(2));
  const summary = await runProductionSeoSmoke({
    fetchResponse: (input, init) => fetch(input, init),
    origin,
  });
  process.stdout.write(`${JSON.stringify(summary)}\n`);
}
