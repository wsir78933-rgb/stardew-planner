export const PROCESSING_TOOL_IDS = [
  "basic-processing-profit",
  "machine-comparison",
  "keg-processing",
  "preserves-jar-processing",
  "dehydrator-processing",
  "keg-ingredient-ranking",
  "cask-aging",
] as const;

export type ProcessingToolId = (typeof PROCESSING_TOOL_IDS)[number];

export type ProcessingComparisonToolId = Extract<
  ProcessingToolId,
  | "basic-processing-profit"
  | "machine-comparison"
  | "keg-processing"
  | "preserves-jar-processing"
  | "dehydrator-processing"
>;

export type ProcessingToolFamily = "comparison" | "ranking" | "cask-aging";

export type ProcessingToolCanonicalPath = `/tools/${ProcessingToolId}`;

export type ProcessingToolDefinition = Readonly<{
  canonicalPath: ProcessingToolCanonicalPath;
  family: ProcessingToolFamily;
  id: ProcessingToolId;
}>;

export const PROCESSING_TOOL_DEFINITIONS: Readonly<
  Record<ProcessingToolId, ProcessingToolDefinition>
> = {
  "basic-processing-profit": {
    id: "basic-processing-profit",
    canonicalPath: "/tools/basic-processing-profit",
    family: "comparison",
  },
  "machine-comparison": {
    id: "machine-comparison",
    canonicalPath: "/tools/machine-comparison",
    family: "comparison",
  },
  "keg-processing": {
    id: "keg-processing",
    canonicalPath: "/tools/keg-processing",
    family: "comparison",
  },
  "preserves-jar-processing": {
    id: "preserves-jar-processing",
    canonicalPath: "/tools/preserves-jar-processing",
    family: "comparison",
  },
  "dehydrator-processing": {
    id: "dehydrator-processing",
    canonicalPath: "/tools/dehydrator-processing",
    family: "comparison",
  },
  "keg-ingredient-ranking": {
    id: "keg-ingredient-ranking",
    canonicalPath: "/tools/keg-ingredient-ranking",
    family: "ranking",
  },
  "cask-aging": {
    id: "cask-aging",
    canonicalPath: "/tools/cask-aging",
    family: "cask-aging",
  },
};

export const PROCESSING_TOOL_CANONICAL_PATHS: readonly ProcessingToolCanonicalPath[] =
  PROCESSING_TOOL_IDS.map((toolId) =>
    getProcessingToolDefinition(toolId).canonicalPath,
  );

export function getProcessingToolDefinition(
  toolId: string,
): ProcessingToolDefinition {
  if (!isProcessingToolId(toolId)) {
    throw new Error(
      `Unknown processing tool id. Received: ${JSON.stringify(toolId)}.`,
    );
  }

  return PROCESSING_TOOL_DEFINITIONS[toolId];
}

export function isProcessingToolId(
  toolId: string,
): toolId is ProcessingToolId {
  return PROCESSING_TOOL_IDS.includes(toolId as ProcessingToolId);
}

export function getProcessingToolHref(locale: string, toolId: string): string {
  const definition = getProcessingToolDefinition(toolId);
  const pathPrefix = readProcessingLocalePathPrefix(locale);
  return `${pathPrefix}${definition.canonicalPath}`;
}

export function isProcessingComparisonToolId(
  toolId: ProcessingToolId,
): toolId is ProcessingComparisonToolId {
  return (
    toolId === "basic-processing-profit" ||
    toolId === "machine-comparison" ||
    toolId === "keg-processing" ||
    toolId === "preserves-jar-processing" ||
    toolId === "dehydrator-processing"
  );
}

export function readProcessingToolIdFromPathname(
  locale: string,
  pathname: string,
): ProcessingToolId | null {
  const pathPrefix = readProcessingLocalePathPrefix(locale);
  for (const toolId of PROCESSING_TOOL_IDS) {
    const expectedPathname = `${pathPrefix}${getProcessingToolDefinition(toolId).canonicalPath}`;
    if (pathname === expectedPathname) {
      return toolId;
    }
  }

  return null;
}

function readProcessingLocalePathPrefix(locale: string): "" | "/zh" {
  if (locale === "en" || locale === "ja" || locale === "ru") {
    return "";
  }

  if (locale === "zh-CN") {
    return "/zh";
  }

  throw new Error(
    `Unsupported processing tool navigation locale. Received: ${JSON.stringify(locale)}.`,
  );
}
