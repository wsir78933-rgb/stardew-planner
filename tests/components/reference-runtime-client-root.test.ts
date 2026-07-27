import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  ensureReferenceRuntimeBootstrapModule,
  ReferenceRuntimeClientRoot,
} from "../../src/components/reference-runtime-client-root";

type FakeDomElement = Readonly<{
  tagName: string;
}>;

type FakeDomScriptElement = FakeDomElement & {
  id: string;
  type: string;
  src: string;
  getAttribute(attributeName: string): string | null;
};

type FakeRuntimeDocument = Document & {
  readonly appendedScriptElements: FakeDomScriptElement[];
};

function createFakeRuntimeDocument(
  existingBootstrapElement: FakeDomElement | null = null,
): FakeRuntimeDocument {
  const bootstrapElementsById = new Map<string, FakeDomElement>();
  const appendedScriptElements: FakeDomScriptElement[] = [];

  if (existingBootstrapElement !== null && "id" in existingBootstrapElement) {
    bootstrapElementsById.set(
      (existingBootstrapElement as FakeDomScriptElement).id,
      existingBootstrapElement,
    );
  }

  const fakeRuntimeDocument = {
    appendedScriptElements,
    createElement(tagName: string): FakeDomScriptElement {
      if (tagName !== "script") {
        throw new Error(`Expected a script element. Received tag name: ${tagName}.`);
      }

      return {
        id: "",
        tagName: "SCRIPT",
        type: "",
        src: "",
        getAttribute(attributeName: string): string | null {
          if (attributeName === "type") {
            return this.type === "" ? null : this.type;
          }

          if (attributeName === "src") {
            return this.src === "" ? null : this.src;
          }

          return null;
        },
      };
    },
    getElementById(elementId: string): FakeDomElement | null {
      return bootstrapElementsById.get(elementId) ?? null;
    },
    head: {
      appendChild(scriptElement: FakeDomScriptElement): FakeDomScriptElement {
        appendedScriptElements.push(scriptElement);
        bootstrapElementsById.set(scriptElement.id, scriptElement);
        return scriptElement;
      },
    },
  };

  return fakeRuntimeDocument as unknown as FakeRuntimeDocument;
}

function createExistingBootstrapScript(
  type: string,
  src: string,
): FakeDomScriptElement {
  return {
    id: "reference-runtime-bootstrap-module",
    tagName: "SCRIPT",
    type,
    src,
    getAttribute(attributeName: string): string | null {
      if (attributeName === "type") {
        return this.type;
      }

      if (attributeName === "src") {
        return this.src;
      }

      return null;
    },
  };
}

function withFakeRuntimeDocument(
  fakeRuntimeDocument: FakeRuntimeDocument,
  executeAssertion: () => void,
): void {
  const originalDocumentDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "document",
  );

  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: fakeRuntimeDocument,
  });

  try {
    executeAssertion();
  } finally {
    if (originalDocumentDescriptor === undefined) {
      Reflect.deleteProperty(globalThis, "document");
    } else {
      Object.defineProperty(globalThis, "document", originalDocumentDescriptor);
    }
  }
}

describe("reference runtime client root", () => {
  it("keeps the bootstrap module out of a direct static render", () => {
    const referenceRuntimeClientRootMarkup = renderToStaticMarkup(
      createElement(ReferenceRuntimeClientRoot),
    );

    expect(referenceRuntimeClientRootMarkup).toContain(
      'id="reference-runtime-root"',
    );
    expect(referenceRuntimeClientRootMarkup).not.toContain("<script");
    expect(referenceRuntimeClientRootMarkup).not.toContain(
      'src="/reference-runtime/bootstrap.mjs"',
    );
  });

  it("adds one module bootstrap script to document head", () => {
    const fakeRuntimeDocument = createFakeRuntimeDocument();

    withFakeRuntimeDocument(fakeRuntimeDocument, () => {
      ensureReferenceRuntimeBootstrapModule();
    });

    expect(fakeRuntimeDocument.appendedScriptElements).toEqual([
      expect.objectContaining({
        id: "reference-runtime-bootstrap-module",
        src: "/reference-runtime/bootstrap.mjs",
        tagName: "SCRIPT",
        type: "module",
      }),
    ]);
  });

  it("does not append a duplicate when a previous invocation created the required module bootstrap", () => {
    const fakeRuntimeDocument = createFakeRuntimeDocument();

    withFakeRuntimeDocument(fakeRuntimeDocument, () => {
      ensureReferenceRuntimeBootstrapModule();
      ensureReferenceRuntimeBootstrapModule();
    });

    expect(fakeRuntimeDocument.appendedScriptElements).toHaveLength(1);
  });

  it("rejects a non-script bootstrap element", () => {
    const fakeRuntimeDocument = createFakeRuntimeDocument({
      id: "reference-runtime-bootstrap-module",
      tagName: "DIV",
    } as FakeDomElement & { id: string });

    withFakeRuntimeDocument(fakeRuntimeDocument, () => {
      expect(ensureReferenceRuntimeBootstrapModule).toThrow(
        "Reference runtime bootstrap element must be a SCRIPT element. Received tag name: DIV.",
      );
    });
  });

  it("rejects an existing script with an unexpected type", () => {
    const fakeRuntimeDocument = createFakeRuntimeDocument(
      createExistingBootstrapScript(
        "text/javascript",
        "/reference-runtime/bootstrap.mjs",
      ),
    );

    withFakeRuntimeDocument(fakeRuntimeDocument, () => {
      expect(ensureReferenceRuntimeBootstrapModule).toThrow(
        'Reference runtime bootstrap script must have type "module". Received type: "text/javascript".',
      );
    });
  });

  it("rejects an existing script with an unexpected source", () => {
    const fakeRuntimeDocument = createFakeRuntimeDocument(
      createExistingBootstrapScript("module", "/unexpected-bootstrap.mjs"),
    );

    withFakeRuntimeDocument(fakeRuntimeDocument, () => {
      expect(ensureReferenceRuntimeBootstrapModule).toThrow(
        'Reference runtime bootstrap script must have source "/reference-runtime/bootstrap.mjs". Received source: "/unexpected-bootstrap.mjs".',
      );
    });
  });
});
