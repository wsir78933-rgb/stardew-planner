import { describe, expect, it } from "vitest";
import {
  createReferenceProjectExportFile,
} from "../../src/projects/reference-project-export-file";

describe("reference project export file", () => {
  it("creates a JSON descriptor from repository serialized content without parsing it", () => {
    const serializedProject = '{"version":1,"projects":[]}';

    expect(
      createReferenceProjectExportFile(" Forest / Spring ", serializedProject),
    ).toEqual({
      filename: "Forest - Spring.json",
      mimeType: "application/json;charset=utf-8",
      serializedProject,
    });
  });

  it("rejects a non-string repository export with its received value", () => {
    expect(() =>
      createReferenceProjectExportFile("Forest Farm", null as unknown as string),
    ).toThrow(/serialized JSON string; received null/);
  });

  it("rejects a non-string project title with its received value", () => {
    expect(() =>
      createReferenceProjectExportFile(null as unknown as string, "{}"),
    ).toThrow(/non-empty project name; received null/);
  });

  it("rejects a blank project title with its received value", () => {
    expect(() => createReferenceProjectExportFile("  ", "{}")).toThrow(
      /non-empty project name; received "  "/,
    );
  });

  it("replaces every unsafe filename character while retaining serialized text verbatim", () => {
    const serializedProject = '{"project":"verbatim"}';

    expect(
      createReferenceProjectExportFile('A\\/:*?"<>|B', serializedProject),
    ).toEqual({
      filename: "A---------B.json",
      mimeType: "application/json;charset=utf-8",
      serializedProject,
    });
  });

  it("rejects a project name that becomes empty after filename sanitization", () => {
    expect(() =>
      createReferenceProjectExportFile("\u0000", "{}"),
    ).toThrow(/empty after sanitizing project name "\\u0000"/);
  });
});
