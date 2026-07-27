"use client";

import { useEffect } from "react";

const referenceRuntimeBootstrapElementId =
  "reference-runtime-bootstrap-module";
const referenceRuntimeBootstrapSource = "/reference-runtime/bootstrap.mjs";
const referenceRuntimeBootstrapType = "module";

export function ensureReferenceRuntimeBootstrapModule(): void {
  const existingBootstrapElement = document.getElementById(
    referenceRuntimeBootstrapElementId,
  );

  if (existingBootstrapElement !== null) {
    if (existingBootstrapElement.tagName !== "SCRIPT") {
      throw new TypeError(
        `Reference runtime bootstrap element must be a SCRIPT element. Received tag name: ${existingBootstrapElement.tagName}.`,
      );
    }

    const existingBootstrapScript = existingBootstrapElement as HTMLScriptElement;
    const existingBootstrapType = existingBootstrapScript.getAttribute("type");

    if (existingBootstrapType !== referenceRuntimeBootstrapType) {
      throw new TypeError(
        `Reference runtime bootstrap script must have type "${referenceRuntimeBootstrapType}". Received type: ${JSON.stringify(existingBootstrapType)}.`,
      );
    }

    const existingBootstrapSource = existingBootstrapScript.getAttribute("src");

    if (existingBootstrapSource !== referenceRuntimeBootstrapSource) {
      throw new TypeError(
        `Reference runtime bootstrap script must have source "${referenceRuntimeBootstrapSource}". Received source: ${JSON.stringify(existingBootstrapSource)}.`,
      );
    }

    return;
  }

  const bootstrapScript = document.createElement("script");
  bootstrapScript.id = referenceRuntimeBootstrapElementId;
  bootstrapScript.type = referenceRuntimeBootstrapType;
  bootstrapScript.src = referenceRuntimeBootstrapSource;
  document.head.appendChild(bootstrapScript);
}

export function ReferenceRuntimeClientRoot() {
  useEffect(() => {
    ensureReferenceRuntimeBootstrapModule();
  }, []);

  return <div id="reference-runtime-root" />;
}
