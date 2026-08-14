// The React project repository uses this typed facade so persisted projects and
// the browser-executable compatibility API share one format implementation.
// @ts-expect-error The static public module has no TypeScript declaration file.
import * as browserReferenceProjectApi from "../../public/reference-runtime/local-project-api.mjs";

export type ReferenceJsonValue =
  | null
  | boolean
  | number
  | string
  | ReferenceJsonValue[]
  | { [propertyName: string]: ReferenceJsonValue };

export type ReferenceProjectMap = {
  id: string;
  mapFile: string;
  label: string;
  season: "spring" | "summer" | "fall" | "winter";
  state: Record<string, ReferenceJsonValue>;
  decor: {
    wallpapers: Record<string, ReferenceJsonValue>;
    floors: Record<string, ReferenceJsonValue>;
  };
  renovations: ReferenceJsonValue[];
  thumbnail: string;
};

export type ReferenceProject = {
  version: 4;
  gameVersion: "1.6.15";
  projectName: string;
  season: "spring" | "summer" | "fall" | "winter";
  activeMapId: string | null;
  maps: ReferenceProjectMap[];
};

export type ReferenceStoredProject = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  project: ReferenceProject;
  thumbnailsByMapId?: Record<string, string>;
};

export type ReferenceLocalProjectDocument = {
  version: 1;
  projects: ReferenceStoredProject[];
};

export type ReferenceApiRequest = {
  method: string;
  pathname: string;
  jsonBody?: unknown;
  contentType?: string;
  binaryBody?: Uint8Array;
};

export type ReferenceApiResponse = {
  status: number;
  headers: Record<string, string>;
  jsonBody?: unknown;
  binaryBody?: Uint8Array;
  projectDocument: ReferenceLocalProjectDocument;
  didMutateProjectDocument: boolean;
};

type BrowserReferenceProjectApi = {
  createEmptyReferenceProjectDocument(): ReferenceLocalProjectDocument;
  parseReferenceProjectDocument(
    serializedProjectDocument: string | null,
  ): ReferenceLocalProjectDocument;
  serializeReferenceProjectDocument(
    projectDocument: ReferenceLocalProjectDocument,
  ): string;
  validateReferenceProjectDocument(
    projectDocument: unknown,
  ): ReferenceLocalProjectDocument;
  handleReferenceProjectRequest(
    request: ReferenceApiRequest,
    projectDocument: unknown,
  ): ReferenceApiResponse;
  installReferenceLocalProjectApi(): void;
};

const typedBrowserReferenceProjectApi =
  browserReferenceProjectApi as BrowserReferenceProjectApi;

export function createEmptyReferenceProjectDocument(): ReferenceLocalProjectDocument {
  return typedBrowserReferenceProjectApi.createEmptyReferenceProjectDocument();
}

export function parseReferenceProjectDocument(
  serializedProjectDocument: string | null,
): ReferenceLocalProjectDocument {
  return typedBrowserReferenceProjectApi.parseReferenceProjectDocument(
    serializedProjectDocument,
  );
}

export function serializeReferenceProjectDocument(
  projectDocument: ReferenceLocalProjectDocument,
): string {
  return typedBrowserReferenceProjectApi.serializeReferenceProjectDocument(
    projectDocument,
  );
}

export function validateReferenceProjectDocument(
  projectDocument: unknown,
): ReferenceLocalProjectDocument {
  return typedBrowserReferenceProjectApi.validateReferenceProjectDocument(
    projectDocument,
  );
}

export function handleReferenceProjectRequest(
  request: ReferenceApiRequest,
  storedProjectDocument: unknown,
): ReferenceApiResponse {
  return typedBrowserReferenceProjectApi.handleReferenceProjectRequest(
    request,
    storedProjectDocument,
  );
}

export function installReferenceLocalProjectApi(): void {
  typedBrowserReferenceProjectApi.installReferenceLocalProjectApi();
}
