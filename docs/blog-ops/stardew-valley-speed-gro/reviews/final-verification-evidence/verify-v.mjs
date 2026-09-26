import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../../../..");
const packageRoot = path.join(repositoryRoot, "docs/blog-ops/stardew-valley-speed-gro");
const countScript = "/Users/wusir/Desktop/博客-V7修订版/脚本/正文计数.py";

const languageCases = [
  {
    key: "en",
    locale: "en",
    country: "US",
    qualifiedUnits: 2283,
    rawUnits: 2391,
    imageCount: 2,
    referenceCount: 13,
    quoteBindingCount: 17,
    finalBody: "final/en/body.md",
    draftBody: "drafts/body-en.md",
    finalSeo: "final/en/seo.json",
    finalReferences: "final/en/public-references.json",
    finalHandoff: "final/en/handoff.json",
    provisionalHandoff: "final/en/handoff.provisional.json",
    draftMedia: "drafts/media-en.json",
    sourceAssetDirectory: "assets/en",
    finalAssetDirectory: "final/assets/en",
    figureMode: "html",
    excludedCaptionPattern: null,
  },
  {
    key: "zh",
    locale: "zh-CN",
    country: "CN",
    qualifiedUnits: 2588,
    rawUnits: 2812,
    rawUnitsWithoutSources: 2728,
    imageCount: 3,
    referenceCount: 17,
    quoteBindingCount: 18,
    finalBody: "final/zh/body.md",
    draftBody: "drafts/body-zh.md",
    finalSeo: "final/zh/seo.json",
    finalReferences: "final/zh/public-references.json",
    finalHandoff: "final/zh/handoff.json",
    provisionalHandoff: "final/zh/handoff.provisional.json",
    draftMedia: "drafts/media-zh.json",
    sourceAssetDirectory: "assets/zh",
    finalAssetDirectory: "final/assets/zh",
    figureMode: "markdown",
    excludedCaptionPattern: /^\s*\*图\s*[123]：.*\*\s*$/u,
  },
];

const reviewFiles = [
  ["D-en-r1", "reviews/D-en-r1.md", ["PASS", "ResearchTrace", "ReaderValue", "Repetition"]],
  ["E-en-r1", "reviews/E-en-r1.md", ["PASS", "22 条鉴文"]],
  ["E-SEO-en-r1", "reviews/E-SEO-en-r1.md", ["PASS", "17", "bodyHash"]],
  ["D-zh-r2", "reviews/D-zh-r2.md", ["PASS", "ResearchTrace", "ReaderValue", "Repetition"]],
  ["E-zh-r2", "reviews/E-zh-r2.md", ["PASS"]],
  ["E-SEO-zh", "reviews/E-SEO-zh.md", ["PASS", "18", "bodyHash"]],
  ["media-en-r1", "reviews/media-en-r1.md", ["PASS"]],
  ["media-en-r1-binding", "reviews/media-en-r1-binding.md", ["ERRATA", "mismatch=0", "binding"]],
  ["media-zh-r1", "reviews/media-zh-r1.md", ["PASS"]],
  ["Ffreeze", "editorial/freeze.md", ["English", "中文", "content-only"]],
];

const checkResults = [];
const verifiedFiles = new Set();

function recordCheck(name, passed, details) {
  checkResults.push({ name, passed, details });
}

function failVerification(message) {
  throw new Error(message);
}

function absolutePath(relativePath) {
  return path.join(packageRoot, relativePath);
}

async function readRequiredBytes(relativePath) {
  const filePath = absolutePath(relativePath);
  const bytes = await readFile(filePath);
  verifiedFiles.add(relativePath);
  return bytes;
}

function decodeUtf8(bytes, label) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    failVerification(`${label} is not valid UTF-8: ${error.message}`);
  }
}

async function readRequiredText(relativePath) {
  return decodeUtf8(await readRequiredBytes(relativePath), relativePath);
}

async function parseRequiredJson(relativePath) {
  const text = await readRequiredText(relativePath);
  try {
    return JSON.parse(text);
  } catch (error) {
    failVerification(`${relativePath} is not valid JSON: ${error.message}`);
  }
}

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function normalizeNfcLf(text) {
  return text.normalize("NFC").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function isSha256Hex(value) {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function canonicalizeJson(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalizeJson);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalizeJson(value[key])]),
    );
  }
  return value;
}

function canonicalJsonDigest(value) {
  const compactJson = JSON.stringify(canonicalizeJson(value));
  return sha256Hex(Buffer.from(compactJson, "utf8"));
}

function canonicalJsonEqual(left, right) {
  return JSON.stringify(canonicalizeJson(left)) === JSON.stringify(canonicalizeJson(right));
}

function countExactOccurrences(text, phrase) {
  if (!phrase) {
    return 0;
  }
  let cursor = 0;
  let occurrences = 0;
  while (true) {
    const foundAt = text.indexOf(phrase, cursor);
    if (foundAt === -1) {
      return occurrences;
    }
    occurrences += 1;
    cursor = foundAt + phrase.length;
  }
}

function inlineMarkdownText(line) {
  let visibleLine = line;
  visibleLine = visibleLine.replace(/!\[[^\]]*\]\([^\n]*?\)/gu, "");
  visibleLine = visibleLine.replace(/!\[[^\]]*\]\[[^\]]*\]/gu, "");
  visibleLine = visibleLine.replace(/\[([^\]]+)\]\((?:[^()\s]|\([^()]*\))*\)/gu, "$1");
  visibleLine = visibleLine.replace(/\[([^\]]+)\]\[[^\]]*\]/gu, "$1");
  visibleLine = visibleLine.replace(/\[\^[^\]]*\]/gu, "");
  visibleLine = visibleLine.replace(/https?:\/\/[^\s<>]+/giu, "");
  visibleLine = visibleLine.replace(/<[^>]+>/gu, "");
  visibleLine = visibleLine.replace(/^\s*(?:[-+*]|\d+[.)])\s+/u, "");
  return visibleLine.replace(/[`*_]/gu, "").replace(/\|/gu, " ");
}

function headingParts(line) {
  const match = line.match(/^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+\s*)?$/u);
  if (!match) {
    return null;
  }
  return {
    level: match[1].length,
    label: inlineMarkdownText(match[2]).trim().toLocaleLowerCase(),
  };
}

function removeHeadingSection(text, headingLabel) {
  const lines = text.split("\n");
  let excludedLevel = null;
  const retainedLines = [];
  for (const line of lines) {
    const heading = headingParts(line);
    if (heading) {
      if (excludedLevel !== null && heading.level <= excludedLevel) {
        excludedLevel = null;
      }
      if (heading.label === headingLabel.toLocaleLowerCase()) {
        excludedLevel = heading.level;
        continue;
      }
    }
    if (excludedLevel !== null) {
      continue;
    }
    retainedLines.push(line);
  }
  return retainedLines.join("\n");
}

function extractCountableBody(text, options = {}) {
  let normalizedText = normalizeNfcLf(text).replace(/<!--.*?-->/gsu, "");
  if (options.removeHtmlFigures) {
    normalizedText = normalizedText.replace(/<figure\b[\s\S]*?<\/figure>/giu, "");
  }
  if (options.excludeHeading) {
    normalizedText = removeHeadingSection(normalizedText, options.excludeHeading);
  }
  if (options.excludeCaptionPattern) {
    normalizedText = normalizedText
      .split("\n")
      .filter((line) => !options.excludeCaptionPattern.test(line))
      .join("\n");
  }

  const lines = normalizedText.split("\n");
  const outputLines = [];
  let fenceCharacter = null;
  let fenceLength = 0;
  let excludedLevel = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (fenceCharacter !== null) {
      const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/u);
      if (fence && fence[1][0] === fenceCharacter && fence[1].length >= fenceLength) {
        fenceCharacter = null;
      }
      continue;
    }
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/u);
    if (fence) {
      fenceCharacter = fence[1][0];
      fenceLength = fence[1].length;
      continue;
    }
    const heading = headingParts(line);
    if (heading) {
      if (excludedLevel !== null && heading.level <= excludedLevel) {
        excludedLevel = null;
      }
      if (options.excludeHeading && heading.label === options.excludeHeading.toLocaleLowerCase()) {
        excludedLevel = heading.level;
      }
      continue;
    }
    if (index + 1 < lines.length && line.trim() && /^\s{0,3}(?:=+|-+)\s*$/u.test(lines[index + 1])) {
      continue;
    }
    if (excludedLevel !== null) {
      continue;
    }
    if (
      !line.trim() ||
      /^\s*(?:[-*_]\s*){3,}$/u.test(line) ||
      /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)+\|?\s*$/u.test(line) ||
      /^\s*\[[^\]]+\]:/u.test(line) ||
      line.trimStart().startsWith(">")
    ) {
      continue;
    }
    outputLines.push(inlineMarkdownText(line));
  }
  return outputLines.join("\n");
}

function isHanCharacter(character) {
  const codePoint = character.codePointAt(0);
  return (
    (codePoint >= 0x3400 && codePoint <= 0x4dbf) ||
    (codePoint >= 0x4e00 && codePoint <= 0x9fff) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0x20000 && codePoint <= 0x323af)
  );
}

function countUnits(text, locale) {
  if (locale === "en") {
    return [...text.matchAll(/(?<![A-Za-z0-9])[A-Za-z0-9]*[A-Za-z][A-Za-z0-9]*(?:['’\-][A-Za-z0-9]+)*/gu)].length;
  }
  if (locale === "zh-CN" || locale === "zh-TW") {
    return [...text].filter(isHanCharacter).length;
  }
  failVerification(`Unsupported locale in verifier: ${locale}`);
}

function countQualifiedUnits(text, languageCase) {
  const countableBody = extractCountableBody(text, {
    removeHtmlFigures: languageCase.figureMode === "html",
    excludeHeading: languageCase.locale === "zh-CN" ? "参考来源" : null,
    excludeCaptionPattern: languageCase.excludedCaptionPattern,
  });
  return countUnits(countableBody, languageCase.locale);
}

function extractPublicUrls(text) {
  const urls = new Set();
  for (const match of text.matchAll(/https?:\/\/[^)\s<>"']+/giu)) {
    const cleanedUrl = match[0].replace(/[)\]）。，；：、.!?]+$/gu, "");
    try {
      urls.add(new URL(cleanedUrl).toString());
    } catch {
      // The URL contract check below reports malformed references from refs directly.
    }
  }
  return [...urls].sort();
}

function parseHtmlAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([A-Za-z_:][A-Za-z0-9_:\-]*)\s*=\s*["']([^"']*)["']/gu)) {
    attributes[match[1].toLocaleLowerCase()] = match[2];
  }
  return attributes;
}

function extractImageReferences(bodyText, mode) {
  if (mode === "html") {
    return [...bodyText.matchAll(/<img\b[^>]*>/giu)].map((match) => {
      const attributes = parseHtmlAttributes(match[0]);
      return { path: attributes.src ?? "", alt: attributes.alt ?? "" };
    });
  }
  return [...bodyText.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+[^)]*)?\)/gu)].map((match) => ({
    path: match[2],
    alt: match[1],
  }));
}

function extractFigureCaptions(bodyText, mode) {
  if (mode === "html") {
    return [...bodyText.matchAll(/<figure\b[\s\S]*?<img\b[^>]*>\s*<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/giu)].map((match) => {
      const imageTag = match[0].match(/<img\b[^>]*>/iu)?.[0] ?? "";
      const attributes = parseHtmlAttributes(imageTag);
      return { path: attributes.src ?? "", caption: match[1] };
    });
  }
  const lines = bodyText.split("\n");
  const figures = [];
  for (let index = 0; index < lines.length; index += 1) {
    const imageMatch = lines[index].match(/^!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)\s*$/u);
    if (!imageMatch) {
      continue;
    }
    let captionLine = "";
    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
      if (lines[nextIndex].trim()) {
        captionLine = lines[nextIndex].trim();
        break;
      }
    }
    const caption = captionLine.startsWith("*") && captionLine.endsWith("*")
      ? captionLine.slice(1, -1)
      : captionLine;
    figures.push({ path: imageMatch[1], caption });
  }
  return figures;
}

function resolvePublicAssetPath(relativePath, languageCase) {
  if (!relativePath.startsWith(`../assets/${languageCase.key}/`)) {
    return null;
  }
  const bodyDirectory = path.dirname(absolutePath(languageCase.finalBody));
  const resolvedPath = path.resolve(bodyDirectory, relativePath);
  const expectedDirectory = path.resolve(absolutePath(languageCase.finalAssetDirectory));
  const relativeToExpectedDirectory = path.relative(expectedDirectory, resolvedPath);
  if (relativeToExpectedDirectory.startsWith("..") || path.isAbsolute(relativeToExpectedDirectory)) {
    return null;
  }
  return resolvedPath;
}

function parseSvgDimensions(svgText) {
  const rootMatch = svgText.match(/<svg\b[^>]*>/iu);
  if (!rootMatch) {
    return null;
  }
  const attributes = parseHtmlAttributes(rootMatch[0]);
  const viewBox = attributes.viewbox?.split(/\s+/u).map(Number) ?? [];
  return {
    width: Number(attributes.width),
    height: Number(attributes.height),
    viewBox,
  };
}

function findSensitiveHitCounts(serializedHandoff) {
  const forbiddenPatterns = [
    ["absolute-private-path", /\/Users\/|\/private\/tmp\/|\/home\//giu],
    ["internal-file-path", /(?:docs\/blog-ops|research\/|reviews\/|editorial\/|operations\/|drafts\/|final\/)/giu],
    ["orchestration-residue", /TaskSpace|ego-browser|orchestration|worker_done|dispatch|canary|operation store/giu],
    ["credential-marker", /api[_-]?key|access[_-]?token|secret[_-]?key|password|private[_-]?key|authorization\s*:\s*bearer|sk-[A-Za-z0-9]{16,}/giu],
  ];
  return Object.fromEntries(
    forbiddenPatterns.map(([label, pattern]) => [label, [...serializedHandoff.matchAll(pattern)].length]),
  );
}

async function verifyReviewReports(bodyHashes) {
  for (const [label, relativePath, requiredTokens] of reviewFiles) {
    const text = await readRequiredText(relativePath);
    const missingTokens = requiredTokens.filter((token) => !text.includes(token));
    const expectedHash = label.startsWith("D-en") || label.startsWith("E-en") || label.startsWith("E-SEO-en")
      ? bodyHashes.en
      : label.startsWith("D-zh") || label.startsWith("E-zh") || label.startsWith("E-SEO-zh")
        ? bodyHashes.zh
        : null;
    const hashBound = expectedHash === null || text.includes(expectedHash);
    recordCheck(`review-${label}`, missingTokens.length === 0 && hashBound, {
      missingTokens,
      hashBound,
    });
  }
}

async function verifyReproducibilityScript() {
  const replayPath = "research/reproducibility/replay.mjs";
  const replayText = await readRequiredText(replayPath);
  const requiredReplayFields = [
    "SOURCE_URLS",
    "pageMatchesRequestedUrl",
    "readBingResult",
    "readOfficialChangelog",
    "readChineseSpeedGroPage",
    "executePageRead",
    "executeRepresentativeSamples",
    "taskSpace.finish",
    "regionBoundary",
    "requestedExitCode",
  ];
  const missingFields = requiredReplayFields.filter((field) => !replayText.includes(field));
  recordCheck("replay-script-contract", missingFields.length === 0, {
    missingFields,
    networkExecuted: false,
  });
}

async function verifyLanguageCase(languageCase) {
  const bodyBytes = await readRequiredBytes(languageCase.finalBody);
  const draftBodyBytes = await readRequiredBytes(languageCase.draftBody);
  const bodyText = decodeUtf8(bodyBytes, languageCase.finalBody);
  const draftBodyText = decodeUtf8(draftBodyBytes, languageCase.draftBody);
  const seo = await parseRequiredJson(languageCase.finalSeo);
  const references = await parseRequiredJson(languageCase.finalReferences);
  const handoff = await parseRequiredJson(languageCase.finalHandoff);
  const provisional = await parseRequiredJson(languageCase.provisionalHandoff);
  const draftMedia = await parseRequiredJson(languageCase.draftMedia);

  const bodyHash = sha256Hex(bodyBytes);
  const bodyHashIsValid = isSha256Hex(handoff.bodyHash);
  const normalizationStable = normalizeNfcLf(bodyText) === bodyText;
  const bodyLineEndingStable = !/\r/gu.test(bodyText) && bodyText.endsWith("\n");
  const bodyBytesInHandoff = typeof handoff.body === "string" && Buffer.from(handoff.body, "utf8");
  recordCheck(`${languageCase.key}-draft-final-body-cmp`, bodyBytes.equals(draftBodyBytes), {
    draft: languageCase.draftBody,
    final: languageCase.finalBody,
  });
  recordCheck(`${languageCase.key}-utf8-nfc-lf`, normalizationStable && bodyLineEndingStable, {
    validUtf8: true,
    nfcEqual: normalizationStable,
    hasCarriageReturn: /\r/gu.test(bodyText),
    endsWithLf: bodyText.endsWith("\n"),
  });
  recordCheck(`${languageCase.key}-body-hash-and-lock`, bodyHashIsValid && handoff.bodyHash === bodyHash && bodyBytesInHandoff && bodyBytes.equals(bodyBytesInHandoff) && handoff.bodyByteLength === bodyBytes.length, {
    bodyHash,
    declaredBodyHash: handoff.bodyHash,
    bodyByteLength: bodyBytes.length,
    declaredBodyByteLength: handoff.bodyByteLength,
    bodyIsText: typeof handoff.body === "string",
  });
  recordCheck(`${languageCase.key}-seo-contract`,
    ["title", "h1", "description", "slug"].every((field) => typeof seo[field] === "string" && seo[field].length > 0) &&
      canonicalJsonEqual(handoff.seo, seo) &&
      seo.locale === languageCase.locale &&
      seo.country === languageCase.country,
  {
    fields: ["title", "h1", "description", "slug"],
    handoffSeoMatchesFile: canonicalJsonEqual(handoff.seo, seo),
  });
  recordCheck(`${languageCase.key}-provisional-preserved`,
    provisional.bodyHash === bodyHash && typeof provisional.body === "string" && provisional.body === bodyText,
    { provisionalBodyHash: provisional.bodyHash },
  );

  const rawUnits = countUnits(extractCountableBody(bodyText), languageCase.locale);
  const qualifiedUnits = countQualifiedUnits(bodyText, languageCase);
  const rawUnitsWithoutSources = languageCase.locale === "zh-CN"
    ? countUnits(extractCountableBody(bodyText, { excludeHeading: "参考来源" }), languageCase.locale)
    : null;
  recordCheck(`${languageCase.key}-body-counts`, rawUnits === languageCase.rawUnits && qualifiedUnits === languageCase.qualifiedUnits && (languageCase.rawUnitsWithoutSources === undefined || rawUnitsWithoutSources === languageCase.rawUnitsWithoutSources) && qualifiedUnits >= 2000, {
    rawUnits,
    rawUnitsWithoutSources,
    qualifiedUnits,
    requiredFloor: 2000,
    excludedFigures: languageCase.figureMode === "html" ? 2 : 0,
    excludedSourceHeading: languageCase.locale === "zh-CN" ? "参考来源" : null,
    excludedCaptions: languageCase.locale === "zh-CN" ? 3 : 0,
    altCounted: false,
  });

  const referenceItems = Array.isArray(references.references) ? references.references : [];
  const handoffReferences = Array.isArray(handoff.publicReferences) ? handoff.publicReferences : [];
  const referenceShapeValid = referenceItems.length === languageCase.referenceCount && referenceItems.every((reference) => {
    if (!reference || typeof reference !== "object") return false;
    if (!["id", "label", "url", "appliesTo"].every((field) => field in reference)) return false;
    if (!/^https?:\/\//iu.test(reference.url)) return false;
    return Array.isArray(reference.appliesTo) && reference.appliesTo.length > 0;
  });
  const quoteResults = [];
  for (const reference of referenceItems) {
    for (const binding of reference.appliesTo ?? []) {
      const actualOccurrences = countExactOccurrences(bodyText, binding.quote);
      quoteResults.push({
        id: reference.id,
        expectedOccurrence: binding.occurrence,
        actualOccurrences,
        valid: typeof binding.quote === "string" && Number.isInteger(binding.occurrence) && binding.occurrence > 0 && actualOccurrences >= binding.occurrence,
      });
    }
  }
  recordCheck(`${languageCase.key}-public-reference-contract`, referenceShapeValid && references.bodyHash === bodyHash && canonicalJsonEqual(handoffReferences, referenceItems) && quoteResults.length === languageCase.quoteBindingCount && quoteResults.every((result) => result.valid), {
    referenceCount: referenceItems.length,
    quoteBindingCount: quoteResults.length,
    quoteBindingsValid: quoteResults.filter((result) => result.valid).length,
    bodyHashMatches: references.bodyHash === bodyHash,
    handoffReferencesMatch: canonicalJsonEqual(handoffReferences, referenceItems),
  });

  const bodyUrls = extractPublicUrls(bodyText);
  const referenceUrls = referenceItems.map((reference) => reference.url).sort();
  const everyReferenceUrlInBody = referenceUrls.every((url) => bodyText.includes(url));
  recordCheck(`${languageCase.key}-body-reference-url-set`, everyReferenceUrlInBody, {
    bodyUrlCount: bodyUrls.length,
    referenceUrlCount: referenceUrls.length,
    everyReferenceUrlInBody,
  });

  const bodyImages = extractImageReferences(bodyText, languageCase.figureMode);
  const figureCaptions = extractFigureCaptions(bodyText, languageCase.figureMode);
  const requirementAssets = Array.isArray(handoff.publicRequirements?.assets) ? handoff.publicRequirements.assets : [];
  const manifestAssets = Array.isArray(draftMedia.assets) ? draftMedia.assets : [];
  const imagePaths = bodyImages.map((image) => image.path);
  const requiredPaths = requirementAssets.map((asset) => asset.path);
  const manifestPaths = manifestAssets.map((asset) => asset.path);
  const imageIds = bodyImages.map((image) => path.basename(image.path));
  const requirementIds = requirementAssets.map((asset) => path.basename(asset.path));
  const imageShapeValid = bodyImages.length === languageCase.imageCount && bodyImages.every((image) => image.path && image.alt);
  const imagePathSetMatches = JSON.stringify([...imagePaths].sort()) === JSON.stringify([...requiredPaths].sort());
  const bodyNamesMatch = JSON.stringify([...imageIds].sort()) === JSON.stringify([...requirementIds].sort());
  const resolvedAssets = [];
  const captionResults = [];
  const assetHashResults = [];
  const mediaReferenceResults = [];
  for (const image of bodyImages) {
    const resolvedPath = resolvePublicAssetPath(image.path, languageCase);
    const requirement = requirementAssets.find((asset) => asset.path === image.path);
    const manifestAsset = manifestAssets.find((asset) => path.basename(asset.path) === path.basename(image.path));
    const captionRecord = figureCaptions.find((figure) => figure.path === image.path);
    const resolvedExists = resolvedPath !== null;
    if (resolvedExists) {
      const finalAssetBytes = await readFile(resolvedPath);
      const relativeFinalAsset = path.relative(packageRoot, resolvedPath);
      const sourceAssetRelative = path.join(languageCase.sourceAssetDirectory, path.basename(resolvedPath));
      const sourceAssetBytes = await readRequiredBytes(sourceAssetRelative);
      const actualHash = sha256Hex(finalAssetBytes);
      const expectedHash = handoff.integrity?.mediaHashes?.[requirement?.id];
      resolvedAssets.push({ path: image.path, relativeFinalAsset, bytes: finalAssetBytes.length });
      assetHashResults.push({ id: requirement?.id ?? "", actualHash, expectedHash, matches: actualHash === expectedHash });
      mediaReferenceResults.push({
        id: requirement?.id ?? "",
        manifestPath: manifestAsset?.path ?? null,
        sourcePath: sourceAssetRelative,
        manifestPathMatchesSource: manifestAsset?.path === `../${sourceAssetRelative}`,
        finalCopyMatchesSource: finalAssetBytes.equals(sourceAssetBytes),
      });
    }
    captionResults.push({
      id: requirement?.id ?? "",
      bodyCaptionMatchesHandoff: Boolean(requirement && captionRecord && requirement.caption === captionRecord.caption),
      altMatchesHandoff: Boolean(requirement && requirement.alt === image.alt),
    });
  }
  const assetDimensionsResults = [];
  for (const requirement of requirementAssets) {
    const resolvedPath = resolvePublicAssetPath(requirement.path, languageCase);
    const svgText = resolvedPath === null ? "" : decodeUtf8(await readFile(resolvedPath), requirement.path);
    const dimensions = parseSvgDimensions(svgText);
    assetDimensionsResults.push({
      id: requirement.id,
      declared: { width: requirement.width, height: requirement.height },
      actual: dimensions ? { width: dimensions.width, height: dimensions.height, viewBox: dimensions.viewBox } : null,
      matches: Boolean(dimensions && dimensions.width === requirement.width && dimensions.height === requirement.height && dimensions.viewBox[2] === requirement.width && dimensions.viewBox[3] === requirement.height),
    });
  }
  recordCheck(`${languageCase.key}-media-path-and-caption-contract`, imageShapeValid && imagePathSetMatches && bodyNamesMatch && captionResults.length === languageCase.imageCount && captionResults.every((result) => result.bodyCaptionMatchesHandoff && result.altMatchesHandoff), {
    bodyImageCount: bodyImages.length,
    requirementAssetCount: requirementAssets.length,
    imagePaths,
    captionChecks: captionResults.length,
    captionPassed: captionResults.filter((result) => result.bodyCaptionMatchesHandoff).length,
    altPassed: captionResults.filter((result) => result.altMatchesHandoff).length,
    chineseCaptionsHaveSourceUrls: languageCase.locale === "zh-CN" ? false : true,
  });
  recordCheck(`${languageCase.key}-media-hash-and-copy-contract`,
    manifestAssets.length === languageCase.imageCount &&
      manifestPaths.every((manifestPath) => manifestPath.startsWith(`../${languageCase.sourceAssetDirectory}/`)) &&
      assetHashResults.length === languageCase.imageCount &&
      assetHashResults.every((result) => result.matches) &&
      mediaReferenceResults.every((result) => result.manifestPathMatchesSource && result.finalCopyMatchesSource) &&
      assetDimensionsResults.every((result) => result.matches),
    {
      manifestAssetCount: manifestAssets.length,
      assetHashPassed: assetHashResults.filter((result) => result.matches).length,
      finalCopyPassed: mediaReferenceResults.filter((result) => result.finalCopyMatchesSource).length,
      dimensionsPassed: assetDimensionsResults.filter((result) => result.matches).length,
    },
  );

  const integrityWithoutMember = { ...handoff };
  delete integrityWithoutMember.integrity;
  const recalculatedIntegrityDigest = canonicalJsonDigest(integrityWithoutMember);
  const declaredIntegrityDigest = handoff.integrity?.publicFieldsDigest ?? handoff.integrity?.publicFieldsHash;
  const integrityMediaHashes = handoff.integrity?.mediaHashes ?? {};
  const integrityContractValid = handoff.integrity?.hashAlgorithm === "SHA-256" &&
    isSha256Hex(declaredIntegrityDigest) &&
    recalculatedIntegrityDigest === declaredIntegrityDigest &&
    Object.keys(integrityMediaHashes).length === languageCase.imageCount &&
    assetHashResults.every((result) => integrityMediaHashes[result.id] === result.actualHash);
  recordCheck(`${languageCase.key}-integrity-digest`, integrityContractValid, {
    algorithm: handoff.integrity?.hashAlgorithm ?? null,
    canonicalization: handoff.integrity?.canonicalization ?? null,
    declaredDigest: declaredIntegrityDigest,
    recalculatedDigest: recalculatedIntegrityDigest,
    mediaHashCount: Object.keys(integrityMediaHashes).length,
  });

  const serializedHandoff = JSON.stringify(handoff);
  const sensitiveHitCounts = findSensitiveHitCounts(serializedHandoff);
  const totalSensitiveHits = Object.values(sensitiveHitCounts).reduce((sum, count) => sum + count, 0);
  recordCheck(`${languageCase.key}-public-handoff-boundary`, totalSensitiveHits === 0 && !serializedHandoff.includes("AssemblyManifest") && handoff.status === "content-frozen" && handoff.integrity?.assembly === "not-applicable-content-only", {
    sensitiveHitCounts,
    assemblyManifestMentions: serializedHandoff.includes("AssemblyManifest") ? 1 : 0,
    status: handoff.status,
    assembly: handoff.integrity?.assembly ?? null,
  });

  return {
    bodyHash,
    bodyBytes: bodyBytes.length,
    rawUnits,
    rawUnitsWithoutSources,
    qualifiedUnits,
    bodyUrlCount: bodyUrls.length,
    referenceCount: referenceItems.length,
    quoteBindingCount: quoteResults.length,
    assetCount: resolvedAssets.length,
    assetHashes: Object.fromEntries(assetHashResults.map((result) => [result.id, result.actualHash])),
    publicUrls: referenceUrls,
    reportFilesRead: reviewFiles.filter(([label]) => label.startsWith(languageCase.key === "en" ? "D-en" : "D-zh") || label.startsWith(languageCase.key === "en" ? "E-en" : "E-zh") || label.startsWith(languageCase.key === "en" ? "E-SEO-en" : "E-SEO-zh")).map(([, relativePath]) => relativePath),
    draftBodyHash: sha256Hex(draftBodyBytes),
    draftMediaHash: sha256Hex(await readRequiredBytes(languageCase.draftMedia)),
  };
}

async function verifyRunArtifacts() {
  const bodyHashes = {
    en: sha256Hex(await readRequiredBytes("final/en/body.md")),
    zh: sha256Hex(await readRequiredBytes("final/zh/body.md")),
  };
  await verifyReviewReports(bodyHashes);
  await verifyReproducibilityScript();
  const languageResults = {};
  for (const languageCase of languageCases) {
    languageResults[languageCase.key] = await verifyLanguageCase(languageCase);
  }
  return languageResults;
}

async function main() {
  let languageResults;
  let fatalError = null;
  try {
    languageResults = await verifyRunArtifacts();
  } catch (error) {
    fatalError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }
  const passedChecks = checkResults.filter((check) => check.passed).length;
  const failedChecks = checkResults.length - passedChecks;
  const summary = {
    verifier: "V final independent delivery and contract verification",
    repositoryRoot,
    packageRoot,
    countScript,
    languageResults: languageResults ?? null,
    checkedFiles: [...verifiedFiles].sort(),
    checks: {
      total: checkResults.length,
      passed: passedChecks,
      failed: failedChecks,
    },
    checkResults,
    fatalError,
    exitCode: fatalError || failedChecks > 0 ? 1 : 0,
  };
  console.log(JSON.stringify(summary, null, 2));
  process.exitCode = summary.exitCode;
}

await main();
