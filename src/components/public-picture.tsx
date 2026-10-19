import type { ImgHTMLAttributes } from "react";

const publicWebpFileSuffix = ".webp";
type PublicPictureDataAttributes = Readonly<{
  [attributeName: `data-${string}`]: string | number | boolean | undefined;
}>;

export type PublicPictureProperties = Readonly<
  Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "sizes" | "src" | "srcSet">
    & PublicPictureDataAttributes
    & {
    alt: string;
    avifSrcSet?: string;
    sizes?: string;
    src: string;
    srcSet?: string;
  }
>;

export function createPublicAvifSource(webpSource: string): string {
  if (typeof webpSource !== "string" || !webpSource.endsWith(publicWebpFileSuffix)) {
    throw new TypeError(
      `PublicPicture WebP source must be a non-empty path ending in ".webp"; received ${JSON.stringify(webpSource)}.`,
    );
  }

  const webpPathWithoutSuffix = webpSource.slice(0, -publicWebpFileSuffix.length);
  if (webpPathWithoutSuffix.length === 0 || webpPathWithoutSuffix.endsWith("/")) {
    throw new TypeError(
      `PublicPicture WebP source must include a filename before ".webp"; received ${JSON.stringify(webpSource)}.`,
    );
  }

  return `${webpSource.slice(0, -publicWebpFileSuffix.length)}.avif`;
}

const widthCandidatePattern = /^(\S+)\s+(\d+)w$/;

type ResolvedPublicPictureSources =
  | { avifSrcSet: string }
  | { avifSrcSet: string; sizes: string; srcSet: string };

function requirePublicPictureOptionalString(
  value: unknown,
  fieldName: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(
      `PublicPicture ${fieldName} must be a non-empty string when provided; received ${JSON.stringify(value)}.`,
    );
  }

  return value;
}

function requirePublicPictureWidthCandidateList(
  sourceSet: string,
  fieldName: string,
  fileSuffix: string,
): void {
  const candidates = sourceSet.split(",");
  if (candidates.length < 2) {
    throw new TypeError(
      `PublicPicture ${fieldName} must list at least two width candidates; received ${JSON.stringify(sourceSet)}.`,
    );
  }

  for (const candidate of candidates) {
    const trimmedCandidate = candidate.trim();
    const match = widthCandidatePattern.exec(trimmedCandidate);
    const candidateWidth = match ? Number(match[2]) : Number.NaN;
    if (
      !match ||
      !match[1].endsWith(fileSuffix) ||
      !Number.isInteger(candidateWidth) ||
      candidateWidth <= 0
    ) {
      throw new TypeError(
        `PublicPicture ${fieldName} candidate must be a ${fileSuffix} URL followed by a positive width; received ${JSON.stringify(trimmedCandidate)}.`,
      );
    }
  }
}

function resolvePublicPictureSources(
  src: string,
  srcSet: unknown,
  avifSrcSet: unknown,
  sizes: unknown,
): ResolvedPublicPictureSources {
  const singleAvifSource = createPublicAvifSource(src);
  const resolvedSrcSet = requirePublicPictureOptionalString(srcSet, "srcSet");
  const resolvedAvifSrcSet = requirePublicPictureOptionalString(avifSrcSet, "avifSrcSet");
  const resolvedSizes = requirePublicPictureOptionalString(sizes, "sizes");
  const providedResponsiveValueCount = [resolvedSrcSet, resolvedAvifSrcSet, resolvedSizes]
    .filter((value) => value !== undefined)
    .length;

  if (providedResponsiveValueCount === 0) {
    return { avifSrcSet: singleAvifSource };
  }

  if (!resolvedSrcSet || !resolvedAvifSrcSet || !resolvedSizes) {
    throw new TypeError(
      `PublicPicture responsive images require srcSet, avifSrcSet, and sizes together; received ${JSON.stringify({ avifSrcSet: avifSrcSet ?? null, sizes: sizes ?? null, srcSet: srcSet ?? null })}.`,
    );
  }

  requirePublicPictureWidthCandidateList(resolvedSrcSet, "srcSet", publicWebpFileSuffix);
  requirePublicPictureWidthCandidateList(resolvedAvifSrcSet, "avifSrcSet", ".avif");
  return {
    avifSrcSet: resolvedAvifSrcSet,
    sizes: resolvedSizes,
    srcSet: resolvedSrcSet,
  };
}

export function PublicPicture({
  alt,
  avifSrcSet,
  sizes,
  src,
  srcSet,
  ...imageProperties
}: PublicPictureProperties) {
  const sources = resolvePublicPictureSources(src, srcSet, avifSrcSet, sizes);

  return (
    <picture className="public-picture" data-public-picture>
      {"sizes" in sources ? (
        <source sizes={sources.sizes} srcSet={sources.avifSrcSet} type="image/avif" />
      ) : (
        <source srcSet={sources.avifSrcSet} type="image/avif" />
      )}
      <img
        alt={alt}
        {...imageProperties}
        {...("sizes" in sources ? { sizes: sources.sizes, srcSet: sources.srcSet } : {})}
        src={src}
      />
    </picture>
  );
}
