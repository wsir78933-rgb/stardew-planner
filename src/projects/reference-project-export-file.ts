export type ReferenceProjectExportFile = Readonly<{
  filename: string;
  mimeType: "application/json;charset=utf-8";
  serializedProject: string;
}>;

export function createReferenceProjectExportFile(
  projectTitle: string,
  serializedProject: string,
): ReferenceProjectExportFile {
  assertProjectTitle(projectTitle);
  assertSerializedProject(serializedProject);

  const filenameStem = sanitizeProjectTitleForFilename(projectTitle);

  if (filenameStem.length === 0) {
    throw new Error(
      "Reference project export filename is empty after sanitizing project name " +
        `${describeValue(projectTitle)}.`,
    );
  }

  return {
    filename: `${filenameStem}.json`,
    mimeType: "application/json;charset=utf-8",
    serializedProject,
  };
}

function assertProjectTitle(
  projectTitle: unknown,
): asserts projectTitle is string {
  if (typeof projectTitle !== "string" || projectTitle.trim().length === 0) {
    throw new Error(
      "Reference project export requires a non-empty project name; received " +
        `${describeValue(projectTitle)}.`,
    );
  }
}

function assertSerializedProject(
  serializedProject: unknown,
): asserts serializedProject is string {
  if (typeof serializedProject !== "string") {
    throw new Error(
      "Reference project export requires a serialized JSON string; received " +
        `${describeValue(serializedProject)}.`,
    );
  }
}

function sanitizeProjectTitleForFilename(projectTitle: string): string {
  return projectTitle
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/[\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function describeValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value);
}
