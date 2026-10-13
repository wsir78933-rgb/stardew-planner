import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const implementationDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(implementationDirectory, "../../../../../../");
const beforeDirectory = path.join(implementationDirectory, "before");

const englishModule = await import(
  pathToFileURL(
    path.join(workspaceRoot, "src/blog/articles/how-to-harvest-stardew-valley.en.tsx"),
  ).href
);
const chineseModule = await import(
  pathToFileURL(
    path.join(workspaceRoot, "src/blog/articles/how-to-harvest-stardew-valley.zh.tsx"),
  ).href
);

const englishArticle = englishModule.HowToHarvestStardewValleyEnglishArticle;
const chineseArticle = chineseModule.HowToHarvestStardewValleyChineseArticle;
if (typeof englishArticle !== "function") {
  throw new Error(
    `English article export is missing. Received keys: ${Object.keys(englishModule).join(", ")}.`,
  );
}
if (typeof chineseArticle !== "function") {
  throw new Error(
    `Chinese article export is missing. Received keys: ${Object.keys(chineseModule).join(", ")}.`,
  );
}

const englishMarkup = renderToStaticMarkup(createElement(englishArticle));
const chineseMarkup = renderToStaticMarkup(createElement(chineseArticle));

if (!englishMarkup.startsWith("<article>") || !englishMarkup.endsWith("</article>")) {
  throw new Error("English before SSR is not a single article element.");
}
if (!chineseMarkup.startsWith("<article>") || !chineseMarkup.endsWith("</article>")) {
  throw new Error("Chinese before SSR is not a single article element.");
}
if (englishMarkup.includes("blog-faq-list") || englishMarkup.includes("blog-sources")) {
  throw new Error("English before SSR already contains a FAQ list or Sources section.");
}
if (chineseMarkup.includes("blog-faq-list") || chineseMarkup.includes("blog-sources")) {
  throw new Error("Chinese before SSR already contains a FAQ list or Sources section.");
}

writeFileSync(path.join(beforeDirectory, "en-ssr.html"), englishMarkup);
writeFileSync(path.join(beforeDirectory, "zh-ssr.html"), chineseMarkup);
console.log(`en bytes ${Buffer.byteLength(englishMarkup)}`);
console.log(`zh bytes ${Buffer.byteLength(chineseMarkup)}`);
