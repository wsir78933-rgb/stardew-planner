import {
  createReferenceRuntimeSourceAsset,
  getCanonicalReferenceRuntimePublicOutputPath,
  getReferenceRuntimeSourceUrlForPublicOutputPath,
  validateReferenceRuntimeSourceAsset,
  validateReferenceRuntimePublicOutputPaths,
  type ReferenceRuntimeSourceAsset,
} from "./reference-runtime-source-asset";

const immutableRuntimePublicPathPrefix = "_app/immutable/";

export function collectReferenceRuntimeModulePaths(
  sourceModuleText: string,
  sourceModulePublicOutputPath: string,
): readonly string[] {
  if (typeof sourceModuleText !== "string") {
    throw new TypeError(
      `Reference runtime module source must be a string. Received: ${formatInvalidValue(sourceModuleText)}.`,
    );
  }

  const sourceModuleUrl = getReferenceRuntimeSourceUrlForPublicOutputPath(
    sourceModulePublicOutputPath,
  );
  const sourceModuleImports = collectSourceModuleImports(sourceModuleText);
  const publicOutputPaths: string[] = [];
  const publicOutputPathsByCanonicalPath = new Set<string>();

  for (const importPath of sourceModuleImports) {
    const importedModule = resolveReferenceRuntimeModule(
      importPath,
      sourceModuleUrl,
    );
    const canonicalPublicOutputPath =
      getCanonicalReferenceRuntimePublicOutputPath(
        importedModule.publicOutputPath,
      );

    if (publicOutputPathsByCanonicalPath.has(canonicalPublicOutputPath)) {
      continue;
    }

    publicOutputPathsByCanonicalPath.add(canonicalPublicOutputPath);
    publicOutputPaths.push(importedModule.publicOutputPath);
  }

  return publicOutputPaths;
}

export async function collectReferenceRuntimeSourceAssets(
  entryModule: ReferenceRuntimeSourceAsset,
): Promise<readonly ReferenceRuntimeSourceAsset[]> {
  validateReferenceRuntimeSourceAsset(entryModule);

  if (entryModule.mediaType !== "application/javascript") {
    throw new TypeError(
      `Reference runtime entry module must be JavaScript. Received media type: ${formatInvalidValue(entryModule.mediaType)}.`,
    );
  }

  const sourceAssets: ReferenceRuntimeSourceAsset[] = [];
  const pendingModules = [entryModule];
  const acceptedSourceAssetsByCanonicalOutputPath = new Map<
    string,
    ReferenceRuntimeSourceAsset
  >();

  while (pendingModules.length > 0) {
    const sourceModule = pendingModules.shift();

    if (sourceModule === undefined) {
      throw new Error("Reference runtime module queue unexpectedly became empty.");
    }

    const canonicalPublicOutputPath =
      getCanonicalReferenceRuntimePublicOutputPath(
        sourceModule.publicOutputPath,
      );
    const existingSourceAsset = acceptedSourceAssetsByCanonicalOutputPath.get(
      canonicalPublicOutputPath,
    );

    if (existingSourceAsset !== undefined) {
      if (existingSourceAsset.sourceUrl !== sourceModule.sourceUrl) {
        throw new TypeError(
          `Reference runtime source assets cannot map different source URLs to one public output path. Received public output path: ${formatInvalidValue(sourceModule.publicOutputPath)}.`,
        );
      }

      continue;
    }

    acceptedSourceAssetsByCanonicalOutputPath.set(
      canonicalPublicOutputPath,
      sourceModule,
    );
    sourceAssets.push(sourceModule);

    const sourceModuleText = await downloadReferenceRuntimeModule(sourceModule);
    const importedPublicOutputPaths = collectReferenceRuntimeModulePaths(
      sourceModuleText,
      sourceModule.publicOutputPath,
    );

    for (const importedPublicOutputPath of importedPublicOutputPaths) {
      const importedSourceAsset = createReferenceRuntimeSourceAsset(
        getReferenceRuntimeSourceUrlForPublicOutputPath(
          importedPublicOutputPath,
        ),
      );
      const importedCanonicalPublicOutputPath =
        getCanonicalReferenceRuntimePublicOutputPath(
          importedSourceAsset.publicOutputPath,
        );
      const existingImportedSourceAsset =
        acceptedSourceAssetsByCanonicalOutputPath.get(
          importedCanonicalPublicOutputPath,
        );

      if (
        existingImportedSourceAsset !== undefined &&
        existingImportedSourceAsset.sourceUrl !== importedSourceAsset.sourceUrl
      ) {
        throw new TypeError(
          `Reference runtime source assets cannot map different source URLs to one public output path. Received public output path: ${formatInvalidValue(importedSourceAsset.publicOutputPath)}.`,
        );
      }

      if (existingImportedSourceAsset === undefined) {
        pendingModules.push(importedSourceAsset);
      }
    }
  }

  validateReferenceRuntimePublicOutputPaths(sourceAssets);

  return sourceAssets;
}

function collectSourceModuleImports(sourceModuleText: string): string[] {
  const moduleImportExpressions = [
    /\b(?:from|import)\s*\(?\s*["']([^"']+\.(?:js|css)(?:[?#][^"']*)?)["']/g,
    /@import\s+(?:url\(\s*)?["']([^"']+)["']/g,
    /["']([^"']+\.css)["']/g,
  ];
  const importPaths: string[] = [];

  for (const moduleImportExpression of moduleImportExpressions) {
    for (const importMatch of sourceModuleText.matchAll(moduleImportExpression)) {
      importPaths.push(importMatch[1]);
    }
  }

  return importPaths;
}

function resolveReferenceRuntimeModule(
  importPath: string,
  sourceModuleUrl: string,
): ReferenceRuntimeSourceAsset {
  let resolvedModuleUrl: URL;

  try {
    resolvedModuleUrl = new URL(importPath, sourceModuleUrl);
  } catch (urlParsingError) {
    throw new TypeError(
      `Reference runtime module import path must be a valid URL reference. Received import path: ${formatInvalidValue(importPath)}.`,
      { cause: urlParsingError },
    );
  }

  if (
    resolvedModuleUrl.origin !== "https://stardewplan.com" ||
    !resolvedModuleUrl.pathname.startsWith(`/${immutableRuntimePublicPathPrefix}`)
  ) {
    throw new TypeError(
      `Reference runtime module path must stay below "_app/immutable/". Received import path: ${formatInvalidValue(importPath)}.`,
    );
  }

  const resolvedModule = createReferenceRuntimeSourceAsset(
    resolvedModuleUrl.href,
  );

  if (
    resolvedModule.mediaType !== "application/javascript" &&
    resolvedModule.mediaType !== "text/css"
  ) {
    throw new TypeError(
      `Reference runtime module import must reference JavaScript or CSS. Received import path: ${formatInvalidValue(importPath)}.`,
    );
  }

  return resolvedModule;
}

async function downloadReferenceRuntimeModule(
  sourceModule: ReferenceRuntimeSourceAsset,
): Promise<string> {
  const response = await fetch(sourceModule.sourceUrl);

  if (!response.ok) {
    throw new Error(
      `Reference runtime module request must return a successful response. Received HTTP status ${response.status} for ${formatInvalidValue(sourceModule.sourceUrl)}.`,
    );
  }

  if (response.url !== sourceModule.sourceUrl) {
    throw new Error(
      `Reference runtime module request cannot redirect. Received final URL: ${formatInvalidValue(response.url)}. Requested URL: ${formatInvalidValue(sourceModule.sourceUrl)}.`,
    );
  }

  const receivedMediaType = response.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (receivedMediaType !== sourceModule.mediaType) {
    throw new TypeError(
      `Reference runtime module response content type must be ${sourceModule.mediaType}. Received: ${formatInvalidValue(receivedMediaType)} for ${formatInvalidValue(sourceModule.sourceUrl)}.`,
    );
  }

  return response.text();
}

function formatInvalidValue(invalidValue: unknown): string {
  if (typeof invalidValue === "string") {
    return JSON.stringify(invalidValue);
  }

  try {
    return JSON.stringify(invalidValue);
  } catch {
    return String(invalidValue);
  }
}
