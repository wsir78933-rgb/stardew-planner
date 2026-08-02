import { start } from "/_app/immutable/entry/start.CLoByjli.js";
import * as referenceRuntimeApplication from "/_app/immutable/entry/app.DTzIUNnu.js";
import { installReferenceLocalProjectApi } from "/reference-runtime/local-project-api.mjs";
import { installReferenceRuntimeWheelZoomModeToggle } from "/reference-runtime/wheel-zoom-mode-toggle.mjs";

const referenceRuntimeRootId = "reference-runtime-root";
const referenceRuntimeInitializedAttribute = "data-reference-runtime-initialized";
const localOnlyStylesheetId = "reference-runtime-local-only-overrides";
const localOnlyStylesheetPath = "/reference-runtime/local-only-overrides.css";

const localOnlyTextControlManifest = Object.freeze([
  {
    scopeSelector: ".panel",
    elementSelector: "button.panel-row",
    exactText: "Sign In",
  },
  {
    scopeSelector: ".panel",
    elementSelector: "button.panel-row",
    exactText: "Sign Out",
  },
  {
    scopeSelector: ".panel",
    elementSelector: "button.panel-row",
    exactText: "Change Ko-fi Email",
  },
  {
    scopeSelector: ".panel",
    elementSelector: "button.panel-row",
    exactText: "Save (as link)",
  },
  {
    scopeSelector: ".panel-branding",
    elementSelector: "button.branding-btn",
    exactText: "Feedback",
  },
  {
    scopeSelector: ".panel-branding",
    elementSelector: "button.branding-btn",
    exactText: "Support",
  },
  {
    scopeSelector: ".help-bubble-menu",
    elementSelector: "button.help-bubble-btn",
    exactText: "Feedback",
  },
  {
    scopeSelector: ".help-bubble-menu",
    elementSelector: "button.help-bubble-btn",
    exactText: "Support",
  },
  {
    scopeSelector: ".help-modal",
    elementSelector: ".help-item",
    exactText: "Save as Link · Generate a shareable URL containing your farm plan",
  },
  {
    scopeSelector: ".map-switch-popup",
    elementSelector: ".map-switch-hint",
    exactText: "Supporters get access to projects that save all your maps.",
  },
  {
    scopeSelector: ".import-popup",
    elementSelector: ".import-hint",
    exactText: "If your save imported incorrectly, you can help me improve it by emailing your save file to bear@stardewplan.com.",
    removePrecedingLineBreak: true,
  },
]);

const localOnlySectionHeaderManifest = Object.freeze([
  {
    scopeSelector: ".panel",
    headerSelector: ".panel-section-header",
    exactText: "Account",
  },
  {
    scopeSelector: ".panel",
    headerSelector: ".panel-section-header",
    exactText: "Save",
  },
]);

const localOnlyObserverSelector = [
  ".panel",
  ".bottom-panel",
  ".help-bubble-menu",
  ".help-modal",
  ".map-switch-popup",
  ".import-popup",
].join(", ");

function getNormalizedReferenceRuntimeText(referenceRuntimeElement) {
  return referenceRuntimeElement.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function removeReferenceRuntimeExpectedPrecedingLineBreak(
  localOnlyControl,
  candidateReferenceRuntimeElement,
) {
  if (!localOnlyControl.removePrecedingLineBreak) {
    return;
  }

  const precedingReferenceRuntimeElement =
    candidateReferenceRuntimeElement.previousElementSibling;

  if (!(precedingReferenceRuntimeElement instanceof HTMLBRElement)) {
    throw new Error(
      `Frozen local-only contact paragraph must follow an HTMLBRElement in "${localOnlyControl.scopeSelector}". Received preceding element: ${precedingReferenceRuntimeElement?.tagName ?? "null"}.`,
    );
  }

  precedingReferenceRuntimeElement.remove();
}

function removeReferenceRuntimeExactTextControls(referenceRuntimeDocument) {
  for (const localOnlyControl of localOnlyTextControlManifest) {
    const scopedReferenceRuntimeElements = referenceRuntimeDocument.querySelectorAll(
      localOnlyControl.scopeSelector,
    );

    for (const scopedReferenceRuntimeElement of scopedReferenceRuntimeElements) {
      const candidateReferenceRuntimeElements =
        scopedReferenceRuntimeElement.querySelectorAll(
          localOnlyControl.elementSelector,
        );

      for (const candidateReferenceRuntimeElement of candidateReferenceRuntimeElements) {
        if (
          getNormalizedReferenceRuntimeText(candidateReferenceRuntimeElement) ===
          localOnlyControl.exactText
        ) {
          removeReferenceRuntimeExpectedPrecedingLineBreak(
            localOnlyControl,
            candidateReferenceRuntimeElement,
          );
          candidateReferenceRuntimeElement.remove();
        }
      }
    }
  }
}

function removeReferenceRuntimeLocalOnlySections(referenceRuntimeDocument) {
  for (const localOnlySectionHeader of localOnlySectionHeaderManifest) {
    const scopedReferenceRuntimeElements = referenceRuntimeDocument.querySelectorAll(
      localOnlySectionHeader.scopeSelector,
    );

    for (const scopedReferenceRuntimeElement of scopedReferenceRuntimeElements) {
      const candidateSectionHeaders = scopedReferenceRuntimeElement.querySelectorAll(
        localOnlySectionHeader.headerSelector,
      );

      for (const candidateSectionHeader of candidateSectionHeaders) {
        if (
          getNormalizedReferenceRuntimeText(candidateSectionHeader) !==
          localOnlySectionHeader.exactText
        ) {
          continue;
        }

        const sectionPanelItems = candidateSectionHeader.nextElementSibling;

        if (
          sectionPanelItems === null ||
          !sectionPanelItems.classList.contains("panel-items")
        ) {
          throw new Error(
            `Frozen local-only section "${localOnlySectionHeader.exactText}" must be followed by ".panel-items". Received next element: ${sectionPanelItems?.className ?? "null"}.`,
          );
        }

        sectionPanelItems.remove();
        candidateSectionHeader.remove();
      }
    }
  }
}

function removeReferenceRuntimeLocalOnlyControls(referenceRuntimeDocument) {
  removeReferenceRuntimeExactTextControls(referenceRuntimeDocument);
  removeReferenceRuntimeLocalOnlySections(referenceRuntimeDocument);
}

function containsReferenceRuntimeLocalOnlyDynamicContent(candidateNode) {
  if (!(candidateNode instanceof Element)) {
    return false;
  }

  return (
    candidateNode.matches(localOnlyObserverSelector) ||
    candidateNode.querySelector(localOnlyObserverSelector) !== null
  );
}

function observeReferenceRuntimeLocalOnlyControls() {
  if (document.body === null) {
    throw new Error("Frozen reference runtime cannot observe local-only controls because document.body is null.");
  }

  const referenceRuntimeControlObserver = new MutationObserver(
    (mutationRecords) => {
      const hasLocalOnlyDynamicContent = mutationRecords.some(
        (mutationRecord) =>
          containsReferenceRuntimeLocalOnlyDynamicContent(mutationRecord.target) ||
          [...mutationRecord.addedNodes].some(
            containsReferenceRuntimeLocalOnlyDynamicContent,
          ),
      );

      if (hasLocalOnlyDynamicContent) {
        removeReferenceRuntimeLocalOnlyControls(document);
      }
    },
  );

  referenceRuntimeControlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function loadReferenceRuntimeLocalOnlyStylesheet() {
  const existingLocalOnlyStylesheet = document.getElementById(
    localOnlyStylesheetId,
  );

  if (existingLocalOnlyStylesheet !== null) {
    if (!(existingLocalOnlyStylesheet instanceof HTMLLinkElement)) {
      throw new Error(
        `Frozen local-only stylesheet id "${localOnlyStylesheetId}" must belong to a link element. Received: ${existingLocalOnlyStylesheet.tagName}.`,
      );
    }

    return Promise.resolve();
  }

  const localOnlyStylesheetLink = document.createElement("link");
  localOnlyStylesheetLink.id = localOnlyStylesheetId;
  localOnlyStylesheetLink.rel = "stylesheet";
  localOnlyStylesheetLink.href = localOnlyStylesheetPath;

  return new Promise((resolve, reject) => {
    localOnlyStylesheetLink.addEventListener("load", resolve, { once: true });
    localOnlyStylesheetLink.addEventListener(
      "error",
      () =>
        reject(
          new Error(
            `Frozen local-only stylesheet failed to load. Expected path: ${localOnlyStylesheetPath}.`,
          ),
        ),
      { once: true },
    );
    document.head.appendChild(localOnlyStylesheetLink);
  });
}

function getReferenceRuntimeRoot() {
  const referenceRuntimeRoot = document.getElementById(referenceRuntimeRootId);

  if (referenceRuntimeRoot === null) {
    throw new Error(
      `Frozen reference runtime mount is missing. Expected element id: ${referenceRuntimeRootId}.`,
    );
  }

  return referenceRuntimeRoot;
}

async function startReferenceRuntime() {
  const referenceRuntimeRoot = getReferenceRuntimeRoot();

  if (referenceRuntimeRoot.hasAttribute(referenceRuntimeInitializedAttribute)) {
    throw new Error(
      `Frozen reference runtime mount is already initialized. Element id: ${referenceRuntimeRootId}.`,
    );
  }

  referenceRuntimeRoot.setAttribute(referenceRuntimeInitializedAttribute, "true");
  await start(referenceRuntimeApplication, referenceRuntimeRoot);
  installReferenceRuntimeWheelZoomModeToggle(document);
  removeReferenceRuntimeLocalOnlyControls(document);
  observeReferenceRuntimeLocalOnlyControls();
}

async function startReferenceRuntimeWithLocalOnlyOverrides() {
  await loadReferenceRuntimeLocalOnlyStylesheet();
  await startReferenceRuntime();
}

function startReferenceRuntimeWhenDocumentIsReady() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startReferenceRuntimeWithLocalOnlyOverrides, {
      once: true,
    });
    return;
  }

  startReferenceRuntimeWithLocalOnlyOverrides();
}

installReferenceLocalProjectApi();
startReferenceRuntimeWhenDocumentIsReady();
