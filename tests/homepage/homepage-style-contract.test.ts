import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "vitest";

const homepageBodyScope = "body:has(> [data-homepage-shell])";

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

test("limits header flex layout to the direct site navigation element", () => {
  const styles = readProjectFile("app/globals.css");

  expect(styles).toContain(
    "body:has(> [data-homepage-shell]) [data-homepage-header] > nav {",
  );
  expect(styles).toContain(
    "[data-public-page-shell] [data-public-page-header] > nav {",
  );
});

test("contains the hero value proposition and frames the product stage within the homepage scope", () => {
  const styles = readProjectFile("app/globals.css");
  const heroContentRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero-content\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const productStageRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-product-stage\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileProductStageRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-product-stage\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(heroContentRule).toBeDefined();
  expect(heroContentRule).toContain("display: grid;");
  expect(heroContentRule).toContain("justify-items: center;");
  expect(heroContentRule).toContain("max-width: 60rem;");
  expect(heroContentRule).toContain("width: 100%;");
  expect(productStageRule).toBeDefined();
  expect(productStageRule).toContain("background: var(--card);");
  expect(productStageRule).toContain("border: 1px solid rgb(36 42 34 / 72%);");
  expect(productStageRule).toContain("border-radius: var(--radius);");
  expect(productStageRule).toContain("overflow: hidden;");
  expect(mobileProductStageRule).toBeDefined();
  expect(mobileProductStageRule).toContain("border-radius: 0;");
});

const whyChooseImageSources = [
  "/homepage/why-choose/beach-decorative-machooo.webp",
  "/homepage/why-choose/beach-geometric-jennameeps.webp",
  "/homepage/why-choose/beach-organized-justkuwl.webp",
  "/homepage/why-choose/beach-processing-shady-kegyard.webp",
  "/homepage/why-choose/fourcorners-balanced-rp2-phobos.webp",
  "/homepage/why-choose/fourcorners-balanced-emerald.webp",
  "/homepage/why-choose/fourcorners-coop-hallofax.webp",
] as const;

const whyChooseImageReferencePaths = [
  "src/homepage/homepage-copy.ts",
  "src/components/homepage-why-choose-section.tsx",
  "src/components/homepage-animated-testimonials.tsx",
] as const;

function readExistingProjectFile(relativePath: string): string | null {
  const filePath = resolve(process.cwd(), relativePath);

  if (!existsSync(filePath)) {
    return null;
  }

  return readProjectFile(relativePath);
}

test("ships the homepage image-and-text section assets as public WebP files", () => {
  const homepageSectionImages = [
    {
      sourcePath: "src/components/homepage-features-section.tsx",
      imagePath: "public/homepage/features-pixel-farm.webp",
      imageSource: "/homepage/features-pixel-farm.webp",
    },
    {
      sourcePath: "src/homepage/homepage-copy.ts",
      imagePath: "public/homepage/hero/spring-crops.webp",
      imageSource: "/homepage/hero/spring-crops.webp",
    },
    {
      sourcePath: "src/homepage/homepage-copy.ts",
      imagePath: "public/homepage/hero/beach-farm.webp",
      imageSource: "/homepage/hero/beach-farm.webp",
    },
    {
      sourcePath: "src/homepage/homepage-copy.ts",
      imagePath: "public/homepage/hero/forest-farm.webp",
      imageSource: "/homepage/hero/forest-farm.webp",
    },
  ] as const;

  for (const homepageSectionImage of homepageSectionImages) {
    const imageFilePath = resolve(process.cwd(), homepageSectionImage.imagePath);
    const sectionMarkup = readProjectFile(homepageSectionImage.sourcePath);

    expect(existsSync(imageFilePath), `Expected ${homepageSectionImage.imagePath}`).toBe(true);
    expect(statSync(imageFilePath).size).toBeGreaterThan(0);
    expect(sectionMarkup).toContain(`"${homepageSectionImage.imageSource}"`);
  }

  expect(readProjectFile("src/components/homepage-how-to-section.tsx")).not.toContain(
    "/homepage/how-to-pixel-farm.webp",
  );

  const whyChooseImageReferenceMarkup = whyChooseImageReferencePaths
    .map((relativePath) => readExistingProjectFile(relativePath))
    .filter((fileContents): fileContents is string => fileContents !== null)
    .join("\n");

  for (const whyChooseImageSource of whyChooseImageSources) {
    const whyChooseImagePath = `public${whyChooseImageSource}`;
    const whyChooseImageFilePath = resolve(process.cwd(), whyChooseImagePath);

    expect(existsSync(whyChooseImageFilePath), `Expected ${whyChooseImagePath}`).toBe(
      true,
    );
    expect(statSync(whyChooseImageFilePath).size).toBeGreaterThan(0);
    expect(whyChooseImageReferenceMarkup).toContain(`"${whyChooseImageSource}"`);
  }
});

test("lays out homepage image-and-text sections with scoped responsive hooks", () => {
  const homepageStyles = readProjectFile("app/globals.css");
  const sectionLayoutRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-content-section\] \[data-homepage-section-layout\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const sectionMediaRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-content-section\] \[data-homepage-section-media\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const sectionImageRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-content-section\] \[data-homepage-section-media\] img\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const sectionListRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-content-section\] \[data-homepage-section-list\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const sectionItemRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-content-section\] \[data-homepage-section-list\] li\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileSectionLayoutRule = homepageStyles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-content-section\] \[data-homepage-section-layout\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(homepageStyles).not.toContain("data-homepage-planning-guide");
  expect(sectionLayoutRule).toBeDefined();
  expect(sectionLayoutRule).toContain("align-items: start;");
  expect(sectionLayoutRule).toContain("column-gap: clamp(2rem, 5vw, 5rem);");
  expect(sectionLayoutRule).toContain("display: grid;");
  expect(sectionLayoutRule).toContain(
    "grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);",
  );
  expect(sectionMediaRule).toBeDefined();
  expect(sectionMediaRule).toContain("background: var(--secondary);");
  expect(sectionMediaRule).toContain("border-radius: var(--radius);");
  expect(sectionMediaRule).toContain("grid-column: 2;");
  expect(sectionMediaRule).toContain("grid-row: 1;");
  expect(sectionMediaRule).toContain("overflow: hidden;");
  expect(sectionImageRule).toBeDefined();
  expect(sectionImageRule).toContain("aspect-ratio: 1672 / 941;");
  expect(sectionImageRule).toContain("display: block;");
  expect(sectionImageRule).toContain("height: auto;");
  expect(sectionImageRule).toContain("max-width: 100%;");
  expect(sectionImageRule).toContain("width: 100%;");
  expect(sectionListRule).toBeDefined();
  expect(sectionListRule).toContain("border-block: 1px solid rgb(36 42 34 / 72%);");
  expect(sectionListRule).toContain("display: grid;");
  expect(sectionListRule).toContain("grid-column: 1;");
  expect(sectionListRule).toContain("grid-row: 1;");
  expect(sectionListRule).toContain("list-style: none;");
  expect(sectionListRule).toContain("min-width: 0;");
  expect(sectionItemRule).toBeDefined();
  expect(sectionItemRule).toContain("gap: 1rem;");
  expect(sectionItemRule).toContain(
    "grid-template-columns: 2.25rem minmax(0, 1fr);",
  );
  expect(sectionItemRule).toContain("padding: 1.35rem 0;");
  expect(homepageStyles).toContain(
    "body:has(> [data-homepage-shell]) [data-homepage-why-choose] [data-homepage-animated-testimonials] {",
  );
  const whyChooseMediaRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-why-choose\] \[data-homepage-testimonial-media\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const whyChooseImageRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-why-choose\] \[data-homepage-testimonial-media\] img\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const whyChooseControlsRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-why-choose\] \[data-homepage-testimonial-controls\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  expect(whyChooseMediaRule).toBeDefined();
  expect(whyChooseMediaRule).toContain("aspect-ratio: 1 / 1;");
  expect(whyChooseMediaRule).toContain("overflow: hidden;");
  expect(whyChooseMediaRule).not.toContain("height: 20rem;");
  expect(whyChooseImageRule).toBeDefined();
  expect(whyChooseImageRule).toContain("object-fit: contain;");
  expect(whyChooseImageRule).not.toContain("object-fit: cover;");
  expect(whyChooseControlsRule).toBeDefined();
  expect(whyChooseControlsRule).toContain("position: absolute;");
  expect(whyChooseControlsRule).toContain("pointer-events: none;");
  const mobileWhyChooseAnimatedTestimonialsRule = homepageStyles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-why-choose\] \[data-homepage-animated-testimonials\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];
  expect(mobileWhyChooseAnimatedTestimonialsRule).toBeDefined();
  expect(mobileWhyChooseAnimatedTestimonialsRule).toMatch(
    /flex-direction:\s*column|grid-template-columns:\s*1fr/,
  );
  expect(mobileSectionLayoutRule).toBeDefined();
  expect(mobileSectionLayoutRule).toContain("gap: 1.5rem;");
  expect(mobileSectionLayoutRule).toContain("grid-template-columns: 1fr;");
});

test("keeps the desktop React editor frame at viewport height alongside its sidebar", () => {
  const styles = readProjectFile("app/globals.css");
  const plannerActiveBodyRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\)\.planner-active\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(styles).toContain(homepageBodyScope);
  expect(styles).toContain(`${homepageBodyScope}.planner-active`);
  expect(plannerActiveBodyRule).toBeDefined();
  expect(plannerActiveBodyRule).toContain("overflow-x: hidden !important;");
  expect(plannerActiveBodyRule).toContain("overflow-y: auto !important;");
  expect(styles).not.toContain("body.stardew-homepage");
  expect(styles).toMatch(
    /body:has\(> \[data-homepage-shell\]\)\.planner-active\s*\{[^}]*background:/s,
  );
  expect(styles).toMatch(
    /body:has\(> \[data-homepage-shell\]\)\.planner-active\s*\{[^}]*color:/s,
  );
  expect(styles).toMatch(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-workspace\]\s*\{[^}]*height:\s*100vh;/s,
  );
  expect(styles).not.toContain("height: clamp(51.25rem, 86vh, 56.25rem);");
  expect(styles).toContain("height: 45rem;");
  expect(styles).not.toMatch(/body\s*\{[^}]*overflow:\s*(auto|visible)/s);
});

test("adds desktop gutters while keeping the mobile workspace flush with the viewport", () => {
  const styles = readProjectFile("app/globals.css");
  const desktopWorkspaceRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-workspace\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileWorkspaceRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-workspace\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(desktopWorkspaceRule).toBeDefined();
  expect(mobileWorkspaceRule).toBeDefined();
  expect(desktopWorkspaceRule).toContain("margin: 0 0 clamp(5.5rem, 10vw, 9rem);");
  expect(desktopWorkspaceRule).toContain("padding-inline: 0;");
  expect(desktopWorkspaceRule).not.toContain("max-width:");
  expect(mobileWorkspaceRule).toContain("padding-inline: 0;");
  expect(mobileWorkspaceRule).not.toMatch(/margin(?:-inline)?:\s*auto/);
});

test("uses matching softly feathered side glows for homepage states", () => {
  const styles = readProjectFile("app/globals.css");
  const homepageBackground = styles.match(
    /body:has\(> \[data-homepage-shell\]\)\s*\{[\s\S]*?\n[ \t]+background:\s*([\s\S]*?);\n[ \t]+color:/,
  )?.[1];
  const plannerActiveBackground = styles.match(
    /body:has\(> \[data-homepage-shell\]\)\.planner-active\s*\{[\s\S]*?\n[ \t]+background:\s*([\s\S]*?);\n[ \t]+color:/,
  )?.[1];

  expect(homepageBackground).toBeDefined();
  expect(plannerActiveBackground).toBeDefined();

  const normalizedHomepageBackground = homepageBackground?.replace(/\s+/g, " ").trim();
  const normalizedPlannerActiveBackground = plannerActiveBackground
    ?.replace(/\s+/g, " ")
    .trim();

  expect(normalizedPlannerActiveBackground).toBe(normalizedHomepageBackground);
  expect(normalizedHomepageBackground).toContain("var(--background)");
  expect(normalizedHomepageBackground).not.toContain("linear-gradient");
  expect(normalizedHomepageBackground?.match(/radial-gradient\(/g)).toHaveLength(2);
  expect(normalizedHomepageBackground).toContain(
    "ellipse 80rem 52rem at -22rem -8rem",
  );
  expect(normalizedHomepageBackground).toContain(
    "ellipse 80rem 52rem at calc(100% + 22rem) -8rem",
  );
});

test("keeps the independent homepage hero glow at eight percent opacity", () => {
  const styles = readProjectFile("app/globals.css");
  const heroGlowRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero\]::after\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(heroGlowRule).toBeDefined();
  expect(heroGlowRule).toContain(
    "radial-gradient(circle, rgb(201 251 69 / 8%) 0%, rgb(201 251 69 / 0%) 69%)",
  );
});

test("centers the homepage hero as one vertical content stack", () => {
  const styles = readProjectFile("app/globals.css");
  const heroRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(heroRule).toBeDefined();
  expect(heroRule).toContain("align-items: center;");
  expect(heroRule).toContain("display: flex;");
  expect(heroRule).toContain("flex-direction: column;");
  expect(heroRule).toContain("text-align: center;");
});

test("lays out the homepage hero image fan with overlapping site-token frames", () => {
  const styles = readProjectFile("app/globals.css");
  const fanRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero-fan\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const fanFrameRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero-fan-frame\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(fanRule).toBeDefined();
  expect(fanRule).toContain("display: flex;");
  expect(fanRule).toContain("justify-content: center;");
  expect(fanFrameRule).toBeDefined();
  expect(fanFrameRule).toContain("aspect-ratio: 3 / 4;");
  expect(fanFrameRule).toContain("border-radius: var(--radius);");
  expect(fanFrameRule).toContain("border: 1px solid rgb(36 42 34 / 72%);");
  expect(styles).not.toContain("oklch(1 0 0)");
});

test("uses a compact wider hero headline without an eyebrow spacing rule", () => {
  const styles = readProjectFile("app/globals.css");
  const desktopHeadlineRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] h1\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileHeadlineRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] h1\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(desktopHeadlineRule).toBeDefined();
  expect(desktopHeadlineRule).toContain(
    "font-size: clamp(2.6rem, 4.4vw, 3.9rem);",
  );
  expect(desktopHeadlineRule).toContain("line-height: 0.94;");
  expect(desktopHeadlineRule).toContain("display: flex;");
  expect(desktopHeadlineRule).toContain("flex-direction: column;");
  expect(desktopHeadlineRule).toContain("max-width: 100%;");
  expect(mobileHeadlineRule).toBeDefined();
  expect(mobileHeadlineRule).toContain(
    "font-size: clamp(2.35rem, 10vw, 3.25rem);",
  );
  expect(mobileHeadlineRule).toContain("max-width: 100%;");
  expect(styles).not.toContain("[data-homepage-eyebrow]");
  expect(styles).not.toMatch(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-hero-title-line\]\s*\{[^}]*white-space:\s*nowrap/s,
  );
});

test("keeps section headings readable without a poster measure", () => {
  const styles = readProjectFile("app/globals.css");
  const sectionHeadingRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] > main > section\[id\] > h2\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(sectionHeadingRule).toBeDefined();
  expect(sectionHeadingRule).toContain("font-size: clamp(1.75rem, 3vw, 2.5rem);");
  expect(sectionHeadingRule).toContain("line-height: 1.15;");
  expect(sectionHeadingRule).toContain("margin-bottom: 1.5rem;");
  expect(sectionHeadingRule).toContain("text-wrap: balance;");
  expect(sectionHeadingRule).not.toContain("max-width: 11ch");
  expect(sectionHeadingRule).not.toContain("line-height: 0.94;");
  expect(sectionHeadingRule).not.toContain("clamp(2.7rem, 5vw, 5.4rem)");
  expect(styles).not.toContain("max-width: 11ch");
  expect(styles).not.toContain("max-width: 15ch");
  expect(styles).not.toContain("clamp(2.7rem, 5vw, 5.4rem)");
});

test("renders the closing CTA as one lime action slab", () => {
  const styles = readProjectFile("app/globals.css");
  const closingCtaRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-closing-cta\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const closingCtaHeadingRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-closing-cta\] h2\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const closingCtaContentRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-closing-cta-content\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const mobileClosingCtaContentRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-closing-cta-content\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];
  const mobileClosingCtaHeadingRule = styles.match(
    /@media \(max-width: 700px\)\s*\{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-homepage-closing-cta\] h2\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(closingCtaRule).toBeDefined();
  expect(closingCtaRule).toContain("max-width: 1280px;");
  expect(closingCtaRule).not.toContain("border-block:");
  expect(closingCtaHeadingRule).toBeDefined();
  expect(closingCtaHeadingRule).toContain(
    "font-size: clamp(1.75rem, 3vw, 2.5rem);",
  );
  expect(closingCtaHeadingRule).toContain("line-height: 1.15;");
  expect(closingCtaHeadingRule).toContain("text-wrap: balance;");
  expect(closingCtaHeadingRule).not.toContain("max-width: 15ch");
  expect(closingCtaHeadingRule).not.toContain("clamp(2.4rem, 4.8vw, 5rem)");
  expect(closingCtaContentRule).toBeDefined();
  expect(closingCtaContentRule).toContain("align-items: center;");
  expect(closingCtaContentRule).toContain("background: var(--primary);");
  expect(closingCtaContentRule).toContain("border: 1px solid rgb(36 42 34 / 72%);");
  expect(closingCtaContentRule).toContain("display: flex;");
  expect(closingCtaContentRule).toContain("justify-content: space-between;");
  expect(styles).not.toContain(
    "body:has(> [data-homepage-shell]) [data-homepage-closing-cta-content] p",
  );
  expect(mobileClosingCtaContentRule).toBeDefined();
  expect(mobileClosingCtaContentRule).toContain("flex-direction: column;");
  expect(mobileClosingCtaHeadingRule).toBeDefined();
  expect(mobileClosingCtaHeadingRule).toContain("min-width: 0;");
});

test("keeps the trust statement as one muted line under the FAQ", () => {
  const styles = readProjectFile("app/globals.css");
  const trustRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] > main > section\[data-homepage-trust\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const trustParagraphRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-trust\] p\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(trustRule).toBeDefined();
  expect(trustRule).toContain("padding-top: 0;");
  expect(trustRule).not.toContain("border-block:");
  expect(trustRule).not.toContain("max-width: 48rem");
  expect(trustRule).not.toContain("text-align: center");
  expect(trustRule).not.toContain(
    "width: calc(100% - clamp(2.5rem, 6vw, 6rem));",
  );
  expect(styles).not.toContain(
    "body:has(> [data-homepage-shell]) [data-homepage-trust] h2",
  );
  expect(trustParagraphRule).toBeDefined();
  expect(trustParagraphRule).not.toContain("margin-inline: auto");
  expect(trustParagraphRule).not.toContain("max-width: 44rem");
  expect(trustParagraphRule).toContain("text-wrap: pretty;");
});

test("lays out the FAQ as an always-visible numbered list", () => {
  const styles = readProjectFile("app/globals.css");
  const faqSectionRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] > main > section#faq\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const faqHeadingRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] > main > section#faq > h2\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const faqListRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] > main > section#faq \[data-homepage-faq-list\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const faqItemRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] > main > section#faq \[data-homepage-faq-list\] li\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const faqAnswerRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-shell\] > main > section#faq \[data-homepage-faq-list\] p\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(styles).toContain(
    "body:has(> [data-homepage-shell]) [data-homepage-shell] > main > section#faq p,",
  );
  expect(faqSectionRule).toBeDefined();
  expect(faqSectionRule).toContain("padding-bottom: 1.25rem;");
  expect(faqHeadingRule).toBeDefined();
  expect(faqHeadingRule).toContain("margin-bottom: 1.5rem;");
  expect(faqHeadingRule).not.toContain("max-width: 11ch");
  expect(faqListRule).toBeDefined();
  expect(faqListRule).toContain("border-block: 1px solid rgb(36 42 34 / 72%);");
  expect(faqListRule).toContain("color: var(--foreground);");
  expect(faqListRule).toContain("display: grid;");
  expect(faqListRule).toContain("list-style: none;");
  expect(faqItemRule).toBeDefined();
  expect(faqItemRule).toContain("gap: 1rem;");
  expect(faqItemRule).toContain(
    "grid-template-columns: 2.25rem minmax(0, 1fr);",
  );
  expect(faqItemRule).toContain("padding: 1.35rem 0;");
  expect(faqAnswerRule).toBeDefined();
  expect(faqAnswerRule).toContain("color: var(--muted-foreground);");
  expect(faqAnswerRule).toContain("text-wrap: pretty;");
  expect(styles).not.toContain(
    '[data-homepage-faq-list] button',
  );
  expect(styles).not.toContain(
    '[data-homepage-faq-list] [role="region"]',
  );
  expect(styles).not.toContain('[data-slot="accordion"]');
  expect(styles).not.toContain('[data-slot="accordion-item"]');
  expect(styles).not.toContain('[data-slot="accordion-trigger"]');
  expect(styles).not.toContain('[data-slot="accordion-content"]');
  expect(styles).not.toContain('[data-slot="accordion-trigger-icon"]');
  expect(styles).not.toContain(
    "body:has(> [data-homepage-shell]) [data-homepage-shell] > main > section#faq details",
  );
  expect(styles).not.toContain(
    "body:has(> [data-homepage-shell]) [data-homepage-shell] > main > section#faq summary",
  );
});

test("styles the homepage language dropdown through dedicated data attributes", () => {
  const styles = readProjectFile("app/globals.css");
  const switcherRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-switcher\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const triggerRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-trigger\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const menuRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-menu\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const optionRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-option\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const optionFocusRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-language-option\]:focus-visible\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(styles).toContain("[data-homepage-language-switcher]");
  expect(styles).toContain("[data-homepage-language-trigger]");
  expect(styles).toContain("[data-homepage-language-menu]");
  expect(styles).toContain("[data-homepage-language-option]");
  expect(styles).not.toContain(
    '[data-homepage-header-actions] [role="group"]',
  );
  expect(switcherRule).toContain("position: relative;");
  expect(triggerRule).toBeDefined();
  expect(triggerRule).toContain("background: transparent;");
  expect(triggerRule).toContain("border: 0;");
  expect(triggerRule).not.toContain("border: 1px solid rgb(36 42 34 / 22%);");
  expect(triggerRule).not.toContain("min-height: 2rem;");
  expect(triggerRule).not.toContain("padding-inline: 0.6rem;");
  expect(menuRule).toContain("background: var(--background);");
  expect(menuRule).toContain("border: 1px solid rgb(36 42 34 / 22%);");
  expect(menuRule).toContain("border-radius: 0.45rem;");
  expect(menuRule).toContain("box-shadow:");
  expect(menuRule).toContain("list-style: none;");
  expect(menuRule).toContain("position: absolute;");
  expect(menuRule).toContain("right: 0;");
  expect(menuRule).toContain("top: calc(100% + 0.4rem);");
  expect(menuRule).toContain("z-index: 10;");
  expect(optionRule).toContain("cursor: pointer;");
  expect(optionRule).toContain("min-height: 2.5rem;");
  expect(optionRule).toContain("width: 100%;");
  expect(optionFocusRule).toContain("outline: 2px solid var(--ring);");
});

test("uses the shared footer contract for a bounded desktop layout and a single mobile column", () => {
  const styles = readProjectFile("app/globals.css");
  const desktopFooterRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-site-footer\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];
  const desktopSectionsRule = styles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-site-footer-sections\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(styles).toContain("[data-site-footer]");
  expect(styles).toContain("[data-site-footer-identity]");
  expect(styles).toContain("[data-site-footer-social-icons]");
  expect(styles).toContain("[data-site-footer-sections]");
  expect(desktopFooterRule).toBeDefined();
  expect(desktopFooterRule).toContain("display: grid;");
  expect(desktopFooterRule).toContain(
    "grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.6fr);",
  );
  expect(desktopFooterRule).toContain("width: 100%;");
  expect(desktopSectionsRule).toBeDefined();
  expect(desktopSectionsRule).toContain("grid-column: 2;");
  expect(desktopSectionsRule).toContain(
    "grid-template-columns: repeat(3, minmax(0, 1fr));",
  );
  expect(styles).toContain(
    "body:has(> [data-homepage-shell]) [data-site-footer-social-icons] :is(span, a) {",
  );

  const mobileFooterRule = styles.match(
    /@media \(max-width: 700px\) \{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-site-footer\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];
  const mobileSectionsRule = styles.match(
    /@media \(max-width: 700px\) \{[\s\S]*?body:has\(> \[data-homepage-shell\]\) \[data-site-footer-sections\]\s*\{([\s\S]*?)\n  \}/,
  )?.[1];

  expect(mobileFooterRule).toBeDefined();
  expect(mobileFooterRule).toContain("grid-template-columns: minmax(0, 1fr);");
  expect(mobileSectionsRule).toBeDefined();
  expect(mobileSectionsRule).toContain("grid-column: auto;");
  expect(mobileSectionsRule).toContain("grid-row: auto;");
  expect(mobileSectionsRule).toContain("grid-template-columns: 1fr;");
});

test("keeps the planner preview at its intrinsic size behind the live canvas", () => {
  const homepageStyles = readProjectFile("app/globals.css");
  const plannerPreviewRule = homepageStyles.match(
    /body:has\(> \[data-homepage-shell\]\) \[data-homepage-planner-preview\]\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  expect(plannerPreviewRule).toBeDefined();
  expect(plannerPreviewRule).toContain("height: 260px;");
  expect(plannerPreviewRule).toContain("width: 320px;");
  expect(plannerPreviewRule).toContain("max-height: 260px;");
  expect(plannerPreviewRule).toContain("max-width: 320px;");
  expect(plannerPreviewRule).toContain("z-index: 0;");
  expect(plannerPreviewRule).not.toContain("width: 100%;");
  expect(plannerPreviewRule).not.toContain("height: 100%;");
  expect(plannerPreviewRule).not.toContain("z-index: 41;");
  expect(plannerPreviewRule).not.toContain("inset: 0;");
});
