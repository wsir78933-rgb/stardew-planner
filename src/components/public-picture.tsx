import type { ImgHTMLAttributes } from "react";

const publicWebpFileSuffix = ".webp";
type PublicPictureDataAttributes = Readonly<{
  [attributeName: `data-${string}`]: string | number | boolean | undefined;
}>;

export type PublicPictureProperties = Readonly<
  Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src" | "srcSet">
    & PublicPictureDataAttributes
    & {
    alt: string;
    src: string;
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

export function PublicPicture({
  alt,
  src,
  ...imageProperties
}: PublicPictureProperties) {
  const avifSource = createPublicAvifSource(src);

  return (
    <picture className="public-picture" data-public-picture>
      <source srcSet={avifSource} type="image/avif" />
      <img alt={alt} {...imageProperties} src={src} />
    </picture>
  );
}
