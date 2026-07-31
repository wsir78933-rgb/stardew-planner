const configuredPublicSiteUrl = "https://stardewvalleyplanner.art";

export function createPublicSiteUrl(siteUrlValue: string): URL {
  let parsedSiteUrl: URL;

  try {
    parsedSiteUrl = new URL(siteUrlValue);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Public site URL must be a valid URL. Received: ${JSON.stringify(siteUrlValue)}.`,
        { cause: error },
      );
    }

    throw error;
  }

  if (parsedSiteUrl.protocol !== "https:") {
    throw new Error(
      `Public site URL must use HTTPS. Received: ${JSON.stringify(siteUrlValue)}.`,
    );
  }
  if (parsedSiteUrl.pathname !== "/") {
    throw new Error(
      `Public site URL must not include a pathname. Received: ${JSON.stringify(siteUrlValue)}.`,
    );
  }
  if (parsedSiteUrl.search !== "" || parsedSiteUrl.hash !== "") {
    throw new Error(
      `Public site URL must not include a query or fragment. Received: ${JSON.stringify(siteUrlValue)}.`,
    );
  }

  return parsedSiteUrl;
}

export const publicSiteUrl = createPublicSiteUrl(configuredPublicSiteUrl);

export function createCanonicalUrl(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.includes("?") || pathname.includes("#")) {
    throw new Error(
      `Canonical pathname must start with "/" and contain no query or fragment. Received: ${JSON.stringify(pathname)}.`,
    );
  }
  if (pathname.startsWith("//") || pathname.includes("\\")) {
    throw new Error(
      `Canonical pathname must stay on the public site origin. Received: ${JSON.stringify(pathname)}.`,
    );
  }
  if (pathname !== "/" && pathname.endsWith("/")) {
    throw new Error(
      `Canonical pathname must not end with a slash unless it is root. Received: ${JSON.stringify(pathname)}.`,
    );
  }

  const canonicalUrl = new URL(pathname, publicSiteUrl);

  if (canonicalUrl.origin !== publicSiteUrl.origin) {
    throw new Error(
      `Canonical pathname must stay on the public site origin. Received: ${JSON.stringify(pathname)}.`,
    );
  }

  return canonicalUrl.toString().replace(/\/$/, "");
}
