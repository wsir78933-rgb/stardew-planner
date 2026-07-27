import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRootPath = process.cwd();
const localOnlyOverridePath = path.join(
  projectRootPath,
  "public/reference-runtime/local-only-overrides.css",
);
const bootstrapModulePath = path.join(
  projectRootPath,
  "public/reference-runtime/bootstrap.mjs",
);
const frozenReferenceRuntimeChunkPath = path.join(
  projectRootPath,
  "public/_app/immutable/chunks/CUwsdp_r.js",
);

async function readLocalOnlyOverrideCss() {
  return readFile(localOnlyOverridePath, "utf8");
}

async function readReferenceRuntimeBootstrapModule() {
  return readFile(bootstrapModulePath, "utf8");
}

async function readFrozenReferenceRuntimeChunk() {
  return readFile(frozenReferenceRuntimeChunkPath, "utf8");
}

function getFrozenHelpSocialSection(frozenReferenceRuntimeChunk: string) {
  const socialSectionStart = frozenReferenceRuntimeChunk.indexOf(
    `TS=Ce('<div class="help-links`,
  );
  const socialSectionEnd = frozenReferenceRuntimeChunk.indexOf(
    `</div> <div class="help-divider`,
    socialSectionStart,
  );

  if (socialSectionStart < 0 || socialSectionEnd < 0) {
    throw new Error(
      `Frozen Help social section boundaries are missing. Received start: ${socialSectionStart}, end: ${socialSectionEnd}.`,
    );
  }

  return frozenReferenceRuntimeChunk.slice(socialSectionStart, socialSectionEnd);
}

describe("reference runtime local-only overrides", () => {
  it("removes excluded controls from layout without targeting retained planner controls", async () => {
    const localOnlyOverrideCss = await readLocalOnlyOverrideCss();

    for (const excludedSelector of [
      ".signin-overlay",
      ".support-overlay",
      ".feedback-overlay",
      ".share-overlay",
      ".pm-lock-overlay",
      ".account-info",
      ".account-detail",
      ".account-tier",
      ".kofi-link-row",
      ".kofi-btn",
      "button.support-btn",
      "button.donate-btn",
      'button[title="Support"]',
      'button[title="Save your plan and get a shareable link"]',
    ]) {
      expect(localOnlyOverrideCss).toContain(excludedSelector);
    }

    expect(localOnlyOverrideCss).toContain("display: none !important;");
    expect(localOnlyOverrideCss).not.toContain('button[title="Map"]');
    expect(localOnlyOverrideCss).not.toContain('button[title="View"]');
    expect(localOnlyOverrideCss).not.toContain('button[title="Settings"]');
    expect(localOnlyOverrideCss).not.toContain(".help-overlay {");
    expect(localOnlyOverrideCss).not.toContain(".pm-action-btn {");
    expect(localOnlyOverrideCss).not.toMatch(/https?:\/\//);
  });

  it("uses an exact local-only label manifest without matching project titles", async () => {
    const bootstrapModuleSource = await readReferenceRuntimeBootstrapModule();

    for (const exactExcludedLabel of [
      "Sign In",
      "Sign Out",
      "Change Ko-fi Email",
      "Save (as link)",
      "Feedback",
      "Support",
      "Save as Link · Generate a shareable URL containing your farm plan",
      "Supporters get access to projects that save all your maps.",
    ]) {
      expect(bootstrapModuleSource).toContain(`exactText: "${exactExcludedLabel}"`);
    }

    expect(bootstrapModuleSource).toContain("localOnlyTextControlManifest");
    expect(bootstrapModuleSource).toContain("localOnlySectionHeaderManifest");
    expect(bootstrapModuleSource).not.toContain("includes(exactText)");
    expect(bootstrapModuleSource).not.toContain(".panel-row { display");
  });

  it("rechecks the exact save-link cleanup when frozen menu content is added inside an existing panel", async () => {
    const bootstrapModuleSource = await readReferenceRuntimeBootstrapModule();

    expect(bootstrapModuleSource).toContain('scopeSelector: ".panel",\n    elementSelector: "button.panel-row",\n    exactText: "Save (as link)",');
    expect(bootstrapModuleSource).toContain('scopeSelector: ".panel",\n    headerSelector: ".panel-section-header",\n    exactText: "Save",');
    expect(bootstrapModuleSource).toContain('  ".panel",');
    expect(bootstrapModuleSource).toContain(
      "containsReferenceRuntimeLocalOnlyDynamicContent(mutationRecord.target)",
    );
  });

  it("removes only the import-popup author-contact paragraph after the popup is rendered", async () => {
    const bootstrapModuleSource = await readReferenceRuntimeBootstrapModule();

    expect(bootstrapModuleSource).toContain('scopeSelector: ".import-popup",\n    elementSelector: ".import-hint",\n    exactText: "If your save imported incorrectly, you can help me improve it by emailing your save file to bear@stardewplan.com.",');
    expect(bootstrapModuleSource).toContain("removePrecedingLineBreak: true");
    expect(bootstrapModuleSource).toContain(
      "candidateReferenceRuntimeElement.previousElementSibling",
    );
    expect(bootstrapModuleSource).toContain(
      "precedingReferenceRuntimeElement instanceof HTMLBRElement",
    );
    expect(bootstrapModuleSource).toContain(
      "Frozen local-only contact paragraph must follow an HTMLBRElement",
    );
    expect(bootstrapModuleSource).toContain('  ".import-popup",');
    expect(bootstrapModuleSource).not.toContain(
      'exactText: "Import Game Save"',
    );
  });

  it("removes the Help social-only container and divider without hiding retained Help content", async () => {
    const [localOnlyOverrideCss, frozenReferenceRuntimeChunk] = await Promise.all([
      readLocalOnlyOverrideCss(),
      readFrozenReferenceRuntimeChunk(),
    ]);
    const frozenHelpSocialSection = getFrozenHelpSocialSection(
      frozenReferenceRuntimeChunk,
    );

    expect(localOnlyOverrideCss).toContain(".help-modal .help-links,");
    expect(localOnlyOverrideCss).toContain(
      ".help-modal .help-links + .help-divider",
    );
    expect(localOnlyOverrideCss).not.toContain(".help-modal {\n  display: none");
    expect(frozenHelpSocialSection).toContain("Ko-fi");
    expect(frozenHelpSocialSection).toContain("Discord");
    expect(frozenHelpSocialSection).toContain("Contact");
    expect(frozenHelpSocialSection).not.toContain("Features");
  });
});
