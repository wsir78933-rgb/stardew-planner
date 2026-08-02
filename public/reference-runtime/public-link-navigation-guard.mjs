const navigationGuardInstallationByDocument = new WeakMap();

function requireNavigationGuardBoundary(
  referenceRuntimeDocument,
  referenceRuntimeLocation,
  referenceRuntimeRoot,
) {
  if (typeof referenceRuntimeDocument?.addEventListener !== "function") {
    throw new TypeError(
      `Reference runtime public-link navigation guard requires document addEventListener to be callable. Received document addEventListener: ${String(referenceRuntimeDocument?.addEventListener)}.`,
    );
  }

  if (
    typeof referenceRuntimeLocation?.href !== "string" ||
    referenceRuntimeLocation.href.length === 0
  ) {
    throw new TypeError(
      `Reference runtime public-link navigation guard requires location href to be a non-empty string. Received location href: ${String(referenceRuntimeLocation?.href)}.`,
    );
  }

  if (typeof referenceRuntimeRoot?.contains !== "function") {
    throw new TypeError(
      `Reference runtime public-link navigation guard requires runtime root contains to be callable. Received runtime root contains: ${String(referenceRuntimeRoot?.contains)}.`,
    );
  }
}

function findClickedAnchor(clickEvent) {
  for (const candidateNode of clickEvent.composedPath()) {
    if (typeof candidateNode?.closest !== "function") {
      continue;
    }

    const clickedAnchor = candidateNode.closest("a");

    if (clickedAnchor !== null) {
      return clickedAnchor;
    }
  }

  return null;
}

function isNativePublicDocumentNavigation(
  clickedAnchor,
  clickEvent,
  referenceRuntimeLocation,
) {
  if (
    clickEvent.defaultPrevented ||
    clickEvent.button !== 0 ||
    clickEvent.metaKey ||
    clickEvent.ctrlKey ||
    clickEvent.shiftKey ||
    clickEvent.altKey ||
    clickedAnchor.hasAttribute("download")
  ) {
    return false;
  }

  if (
    clickedAnchor.rel
      .split(/\s+/)
      .some((relationToken) => relationToken.toLowerCase() === "external")
  ) {
    return false;
  }

  if (
    clickedAnchor.target !== "" &&
    clickedAnchor.target.toLowerCase() !== "_self"
  ) {
    return false;
  }

  const clickedNavigationUrl = new URL(
    clickedAnchor.href,
    referenceRuntimeLocation.href,
  );
  const currentNavigationUrl = new URL(referenceRuntimeLocation.href);

  if (
    clickedNavigationUrl.protocol !== "http:" &&
    clickedNavigationUrl.protocol !== "https:"
  ) {
    return false;
  }

  if (clickedNavigationUrl.origin !== currentNavigationUrl.origin) {
    return false;
  }

  const isSameDocumentPath =
    clickedNavigationUrl.pathname === currentNavigationUrl.pathname &&
    clickedNavigationUrl.search === currentNavigationUrl.search;
  const hasFragment =
    clickedNavigationUrl.hash !== "" || clickedNavigationUrl.href.endsWith("#");

  return !(isSameDocumentPath && hasFragment);
}

function handleCapturedPublicLinkClick(
  clickEvent,
  referenceRuntimeLocation,
  referenceRuntimeRoot,
) {
  const clickedAnchor = findClickedAnchor(clickEvent);

  if (
    clickedAnchor === null ||
    referenceRuntimeRoot.contains(clickedAnchor) ||
    !isNativePublicDocumentNavigation(
      clickedAnchor,
      clickEvent,
      referenceRuntimeLocation,
    )
  ) {
    return;
  }

  clickEvent.stopPropagation();
}

export function installReferenceRuntimePublicLinkNavigationGuard(
  referenceRuntimeDocument,
  referenceRuntimeLocation,
  referenceRuntimeRoot,
) {
  requireNavigationGuardBoundary(
    referenceRuntimeDocument,
    referenceRuntimeLocation,
    referenceRuntimeRoot,
  );

  const existingInstallation = navigationGuardInstallationByDocument.get(
    referenceRuntimeDocument,
  );

  if (existingInstallation !== undefined) {
    if (existingInstallation.referenceRuntimeLocation !== referenceRuntimeLocation) {
      throw new Error(
        `Reference runtime public-link navigation guard is already installed with a different location. Received location href: ${referenceRuntimeLocation.href}.`,
      );
    }

    if (existingInstallation.referenceRuntimeRoot !== referenceRuntimeRoot) {
      throw new Error(
        `Reference runtime public-link navigation guard is already installed with a different root. Received runtime root: ${String(referenceRuntimeRoot)}.`,
      );
    }

    return existingInstallation.installation;
  }

  const installation = Object.freeze({});

  referenceRuntimeDocument.addEventListener(
    "click",
    (clickEvent) => {
      handleCapturedPublicLinkClick(
        clickEvent,
        referenceRuntimeLocation,
        referenceRuntimeRoot,
      );
    },
    { capture: true },
  );
  navigationGuardInstallationByDocument.set(referenceRuntimeDocument, {
    installation,
    referenceRuntimeLocation,
    referenceRuntimeRoot,
  });

  return installation;
}
