import { describe, expect, it } from "vitest";

const navigationGuardModuleUrl = new URL(
  "../../public/reference-runtime/public-link-navigation-guard.mjs",
  import.meta.url,
);

type FakeAnchor = {
  href: string;
  target: string;
  rel: string;
  hasAttribute(name: string): boolean;
  closest(selector: string): FakeAnchor | null;
};

type FakeClickEvent = {
  altKey: boolean;
  button: number;
  ctrlKey: boolean;
  defaultPrevented: boolean;
  metaKey: boolean;
  propagationStopped: boolean;
  shiftKey: boolean;
  composedPath(): readonly unknown[];
  stopPropagation(): void;
};

type FakeCapturedClickListener = (clickEvent: FakeClickEvent) => void;

type FakeDocument = {
  addDocumentElementCaptureListener(listener: FakeCapturedClickListener): void;
  addEventListener(
    eventType: string,
    listener: FakeCapturedClickListener,
    options: Readonly<{ capture?: boolean }>,
  ): void;
  dispatchClick(clickEvent: FakeClickEvent): void;
  recordedListeners: ReadonlyArray<
    Readonly<{
      capture: boolean;
      eventType: string;
      listener: FakeCapturedClickListener;
    }>
  >;
};

function createFakeDocument(): FakeDocument {
  const recordedListeners: Array<{
    capture: boolean;
    eventType: string;
    listener: FakeCapturedClickListener;
  }> = [];
  const documentElementCaptureListeners: FakeCapturedClickListener[] = [];

  return {
    addDocumentElementCaptureListener(listener) {
      documentElementCaptureListeners.push(listener);
    },
    addEventListener(eventType, listener, options) {
      recordedListeners.push({
        capture: options.capture === true,
        eventType,
        listener,
      });
    },
    dispatchClick(clickEvent) {
      for (const recordedListener of recordedListeners) {
        if (recordedListener.eventType === "click" && recordedListener.capture) {
          recordedListener.listener(clickEvent);
        }
      }

      if (clickEvent.propagationStopped) {
        return;
      }

      for (const documentElementCaptureListener of documentElementCaptureListeners) {
        documentElementCaptureListener(clickEvent);
      }
    },
    recordedListeners,
  };
}

function createFakeAnchor({
  href,
  target = "",
  rel = "",
  attributes = [],
}: Readonly<{
  attributes?: readonly string[];
  href: string;
  rel?: string;
  target?: string;
}>): FakeAnchor {
  const attributeNames = new Set(attributes);
  const fakeAnchor: FakeAnchor = {
    href,
    target,
    rel,
    hasAttribute(name) {
      return attributeNames.has(name);
    },
    closest(selector) {
      return selector === "a" ? fakeAnchor : null;
    },
  };

  return fakeAnchor;
}

function createNestedFakeLinkTarget(fakeAnchor: FakeAnchor): {
  closest(selector: string): FakeAnchor | null;
} {
  return {
    closest(selector) {
      return selector === "a" ? fakeAnchor : null;
    },
  };
}

function createFakeNonAnchorTarget(): {
  closest(selector: string): FakeAnchor | null;
} {
  return {
    closest() {
      return null;
    },
  };
}

function createFakeClickEvent(
  clickPath: readonly unknown[],
  overrides: Partial<
    Pick<
      FakeClickEvent,
      | "altKey"
      | "button"
      | "ctrlKey"
      | "defaultPrevented"
      | "metaKey"
      | "shiftKey"
    >
  > = {},
): FakeClickEvent {
  return {
    altKey: false,
    button: 0,
    ctrlKey: false,
    defaultPrevented: false,
    metaKey: false,
    propagationStopped: false,
    shiftKey: false,
    ...overrides,
    composedPath() {
      return clickPath;
    },
    stopPropagation() {
      this.propagationStopped = true;
    },
  };
}

function createFakeRuntimeRoot(initialOwnedNodes: readonly unknown[] = []): {
  contains(candidateNode: unknown): boolean;
} {
  const ownedNodes = new Set(initialOwnedNodes);

  return {
    contains(candidateNode) {
      return ownedNodes.has(candidateNode);
    },
  };
}

describe("installReferenceRuntimePublicLinkNavigationGuard", () => {
  it("exports the public-link navigation guard installer", async () => {
    const navigationGuardModule = await import(navigationGuardModuleUrl.href);

    expect(
      navigationGuardModule.installReferenceRuntimePublicLinkNavigationGuard,
    ).toBeTypeOf("function");
  });

  it("stops an ordinary nested public-route click during document capture", async () => {
    const {
      installReferenceRuntimePublicLinkNavigationGuard,
    } = await import(navigationGuardModuleUrl.href);
    const fakeDocument = createFakeDocument();
    const fakeLocation = { href: "http://localhost:3001/" };
    const fakeRuntimeRoot = createFakeRuntimeRoot();
    const publicRouteAnchor = createFakeAnchor({
      href: "http://localhost:3001/farm/four-corners",
    });
    const clickEvent = createFakeClickEvent([
      createNestedFakeLinkTarget(publicRouteAnchor),
    ]);
    let otherDocumentCaptureListenerWasCalled = false;
    let frozenRouterCaptureListenerCallCount = 0;

    installReferenceRuntimePublicLinkNavigationGuard(
      fakeDocument,
      fakeLocation,
      fakeRuntimeRoot,
    );
    fakeDocument.addEventListener(
      "click",
      () => {
        otherDocumentCaptureListenerWasCalled = true;
      },
      { capture: true },
    );
    fakeDocument.addDocumentElementCaptureListener(() => {
      frozenRouterCaptureListenerCallCount += 1;
    });

    fakeDocument.dispatchClick(clickEvent);

    expect(clickEvent.propagationStopped).toBe(true);
    expect(clickEvent.defaultPrevented).toBe(false);
    expect(fakeDocument.recordedListeners[0]?.capture).toBe(true);
    expect(otherDocumentCaptureListenerWasCalled).toBe(true);
    expect(frozenRouterCaptureListenerCallCount).toBe(0);
  });

  it.each([
    {
      anchorHref: "http://localhost:3001/zh/farm/four-corners",
      clickPathKind: "nested",
      locationHref: "http://localhost:3001/",
      name: "a Chinese public route",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard?season=spring",
      clickPathKind: "nested",
      locationHref: "http://localhost:3001/",
      name: "a public route with a query string",
    },
    {
      anchorHref: "http://localhost:3001/",
      clickPathKind: "nested",
      locationHref: "http://localhost:3001/",
      name: "the current document URL",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard?season=spring",
      clickPathKind: "nested",
      locationHref: "http://localhost:3001/farm/standard?season=spring",
      name: "the current path and query URL",
    },
    {
      anchorHref: "http://localhost:3001/farm/four-corners",
      clickPathKind: "direct",
      locationHref: "http://localhost:3001/",
      name: "an anchor that is the direct click target",
    },
  ] as const)("stops $name", async ({ anchorHref, clickPathKind, locationHref }) => {
    const {
      installReferenceRuntimePublicLinkNavigationGuard,
    } = await import(navigationGuardModuleUrl.href);
    const fakeDocument = createFakeDocument();
    const publicRouteAnchor = createFakeAnchor({ href: anchorHref });
    const clickEvent = createFakeClickEvent([
      clickPathKind === "direct"
        ? publicRouteAnchor
        : createNestedFakeLinkTarget(publicRouteAnchor),
    ]);

    installReferenceRuntimePublicLinkNavigationGuard(
      fakeDocument,
      { href: locationHref },
      createFakeRuntimeRoot(),
    );
    fakeDocument.dispatchClick(clickEvent);

    expect(clickEvent.propagationStopped).toBe(true);
    expect(clickEvent.defaultPrevented).toBe(false);
  });

  it.each([
    {
      anchorHref: "http://localhost:3001/farm/four-corners",
      name: "a runtime-owned link",
      runtimeOwnsAnchor: true,
    },
    { anchorHref: "#", name: "an empty same-document fragment" },
    { anchorHref: "/#", name: "a root empty same-document fragment" },
    { anchorHref: "/#planner", name: "a same-document hash route" },
    {
      anchorHref: "https://example.com/farm/standard",
      name: "an external origin",
    },
    { anchorHref: "mailto:test@example.com", name: "a non-HTTP protocol" },
    {
      anchorAttributes: ["download"],
      anchorHref: "http://localhost:3001/farm/standard",
      name: "a download",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      anchorRel: "external",
      name: "an external relation",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      anchorRel: "nofollow external noreferrer",
      name: "an external relation token",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      anchorRel: "nofollow EXTERNAL noreferrer",
      name: "a case-insensitive external relation token",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      anchorTarget: "_blank",
      name: "a new browsing context",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      anchorTarget: "_parent",
      name: "a parent browsing context",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      anchorTarget: "_top",
      name: "a top browsing context",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      anchorTarget: "farm-guide",
      name: "a named browsing context",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      clickEventOverrides: { metaKey: true },
      name: "a meta-key click",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      clickEventOverrides: { ctrlKey: true },
      name: "a control-key click",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      clickEventOverrides: { shiftKey: true },
      name: "a shift-key click",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      clickEventOverrides: { altKey: true },
      name: "an alt-key click",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      clickEventOverrides: { button: 1 },
      name: "a non-primary click",
    },
    {
      anchorHref: "http://localhost:3001/farm/standard",
      clickEventOverrides: { defaultPrevented: true },
      expectedDefaultPrevented: true,
      name: "an already prevented click",
    },
    { name: "a click with no anchor" },
  ] as const)(
    "does not stop $name",
    async ({
      anchorAttributes,
      anchorHref,
      anchorRel,
      anchorTarget,
      clickEventOverrides,
      expectedDefaultPrevented = false,
      runtimeOwnsAnchor,
    }) => {
      const {
        installReferenceRuntimePublicLinkNavigationGuard,
      } = await import(navigationGuardModuleUrl.href);
      const fakeDocument = createFakeDocument();
      const clickedAnchor = anchorHref
        ? createFakeAnchor({
            attributes: anchorAttributes,
            href: anchorHref,
            rel: anchorRel,
            target: anchorTarget,
          })
        : null;
      const clickEvent = createFakeClickEvent(
        clickedAnchor
          ? [createNestedFakeLinkTarget(clickedAnchor)]
          : [createFakeNonAnchorTarget()],
        clickEventOverrides,
      );

      installReferenceRuntimePublicLinkNavigationGuard(
        fakeDocument,
        { href: "http://localhost:3001/" },
        createFakeRuntimeRoot(
          runtimeOwnsAnchor && clickedAnchor ? [clickedAnchor] : [],
        ),
      );
      fakeDocument.dispatchClick(clickEvent);

      expect(clickEvent.propagationStopped).toBe(false);
      expect(clickEvent.defaultPrevented).toBe(expectedDefaultPrevented);
    },
  );

  it("returns the same frozen installation for the same boundaries", async () => {
    const {
      installReferenceRuntimePublicLinkNavigationGuard,
    } = await import(navigationGuardModuleUrl.href);
    const fakeDocument = createFakeDocument();
    const fakeLocation = { href: "http://localhost:3001/" };
    const fakeRuntimeRoot = createFakeRuntimeRoot();

    const firstInstallation = installReferenceRuntimePublicLinkNavigationGuard(
      fakeDocument,
      fakeLocation,
      fakeRuntimeRoot,
    );
    const repeatedInstallation = installReferenceRuntimePublicLinkNavigationGuard(
      fakeDocument,
      fakeLocation,
      fakeRuntimeRoot,
    );

    expect(firstInstallation).toBe(repeatedInstallation);
    expect(Object.isFrozen(firstInstallation)).toBe(true);
    expect(fakeDocument.recordedListeners).toHaveLength(1);
  });

  it("rejects a repeated installation with a different location", async () => {
    const {
      installReferenceRuntimePublicLinkNavigationGuard,
    } = await import(navigationGuardModuleUrl.href);
    const fakeDocument = createFakeDocument();
    const fakeRuntimeRoot = createFakeRuntimeRoot();

    installReferenceRuntimePublicLinkNavigationGuard(
      fakeDocument,
      { href: "http://localhost:3001/" },
      fakeRuntimeRoot,
    );

    expect(() =>
      installReferenceRuntimePublicLinkNavigationGuard(
        fakeDocument,
        { href: "http://localhost:3001/zh/" },
        fakeRuntimeRoot,
      ),
    ).toThrow("Received location href: http://localhost:3001/zh/");
  });

  it("rejects a repeated installation with a different root", async () => {
    const {
      installReferenceRuntimePublicLinkNavigationGuard,
    } = await import(navigationGuardModuleUrl.href);
    const fakeDocument = createFakeDocument();
    const fakeLocation = { href: "http://localhost:3001/" };
    const firstRuntimeRoot = createFakeRuntimeRoot();
    const conflictingRuntimeRoot = {
      contains() {
        return false;
      },
      toString() {
        return "conflicting runtime root";
      },
    };

    installReferenceRuntimePublicLinkNavigationGuard(
      fakeDocument,
      fakeLocation,
      firstRuntimeRoot,
    );

    expect(() =>
      installReferenceRuntimePublicLinkNavigationGuard(
        fakeDocument,
        fakeLocation,
        conflictingRuntimeRoot,
      ),
    ).toThrow("Received runtime root: conflicting runtime root");
  });

  it.each([
    {
      boundaryLabel: "document addEventListener",
      referenceRuntimeDocument: {},
      referenceRuntimeLocation: { href: "http://localhost:3001/" },
      referenceRuntimeRoot: createFakeRuntimeRoot(),
    },
    {
      boundaryLabel: "location href",
      referenceRuntimeDocument: createFakeDocument(),
      referenceRuntimeLocation: { href: "" },
      referenceRuntimeRoot: createFakeRuntimeRoot(),
    },
    {
      boundaryLabel: "runtime root contains",
      referenceRuntimeDocument: createFakeDocument(),
      referenceRuntimeLocation: { href: "http://localhost:3001/" },
      referenceRuntimeRoot: {},
    },
  ])(
    "rejects an invalid $boundaryLabel boundary",
    async ({
      boundaryLabel,
      referenceRuntimeDocument,
      referenceRuntimeLocation,
      referenceRuntimeRoot,
    }) => {
      const {
        installReferenceRuntimePublicLinkNavigationGuard,
      } = await import(navigationGuardModuleUrl.href);

      expect(() =>
        installReferenceRuntimePublicLinkNavigationGuard(
          referenceRuntimeDocument,
          referenceRuntimeLocation,
          referenceRuntimeRoot,
        ),
      ).toThrow(boundaryLabel);
    },
  );
});
