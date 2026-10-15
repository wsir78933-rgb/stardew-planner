import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const reviewDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(reviewDirectory, "../../../../../../");
const implementationDirectory = path.join(reviewDirectory, "../implementation");
const beforeDirectory = path.join(implementationDirectory, "before");
const handoffDirectory = path.join(
  workspaceRoot,
  "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs",
);

const addedImportLines = [
  'import { BlogFaqList } from "../../components/blog/blog-faq-list";\n',
  'import { BlogSources } from "../../components/blog/blog-sources";\n',
];

const locales = [
  {
    id: "en",
    sourceName: "how-to-harvest-stardew-valley.en.tsx",
    beforeSourceName: "how-to-harvest-stardew-valley.en.tsx.txt",
    faqHeading: "How to Harvest Stardew Valley FAQ",
    sourcesHeading: "Sources",
    plannerHref: "/#planner",
    lockedBodyPath: "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/en-body.locked.md",
    handoffName: "public-blog-handoff-en.json",
  },
  {
    id: "zh-CN",
    sourceName: "how-to-harvest-stardew-valley.zh.tsx",
    beforeSourceName: "how-to-harvest-stardew-valley.zh.tsx.txt",
    faqHeading: "星露谷物语收作物常见问题",
    sourcesHeading: "来源",
    plannerHref: "/zh#planner",
    lockedBodyPath: "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/translation/zh-body.md",
    handoffName: "public-blog-handoff-zh.json",
  },
];

const provenanceQuotes = [
  {
    id: "en-hand-stand",
    locale: "en",
    quote: "stand beside a mature plant and [right-click it](https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411)",
  },
  {
    id: "en-hand-x",
    locale: "en",
    quote: "Stand next to the ripe crop and [right-click it](https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411). Keyboard [X is mapped to the same Check/Do Action](https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481) as right-click",
  },
  {
    id: "en-scythe-list",
    locale: "en",
    quote: "A standard [scythe](https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696) is required for certain other crops, such as amaranth, kale, and wheat. Right-clicking or pressing X does not harvest them.",
  },
  {
    id: "en-kale",
    locale: "en",
    quote: "[Kale is harvested with a scythe or better](https://stardewvalleywiki.com/index.php?title=Kale&oldid=192520)",
  },
  {
    id: "en-rice",
    locale: "en",
    quote: "[unmilled rice is harvested with a scythe](https://stardewvalleywiki.com/index.php?title=Unmilled_Rice&oldid=194130)",
  },
  {
    id: "en-fiber",
    locale: "en",
    quote: "[fiber seeds are harvested with the scythe](https://stardewvalleywiki.com/index.php?title=Fiber_Seeds&oldid=193587). Fiber seeds are a distinct exception: they do not require daily watering to grow, yet still require a scythe when fully grown.",
  },
  {
    id: "en-iridium",
    locale: "en",
    quote: "The [iridium scythe](https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836) is the 1.6 Farming Mastery scythe. Within its swing it harvests crops grown on tilled soil, including regular crops.",
  },
  {
    id: "en-giant",
    locale: "en",
    quote: "Harvest a giant crop with any axe. It takes three hits and drops [15 to 21 normal-quality items](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Giant_Crops).",
  },
  {
    id: "en-giant-button",
    locale: "en",
    quote: "Face the giant crop and strike it three times using your tool button (left-click or C on PC).",
  },
  {
    id: "en-water",
    locale: "en",
    quote: "[crops must be watered every day for maximum growth](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979). If unwatered for a day, a crop will not grow, though unwatered crops do not die.",
  },
  {
    id: "en-water-delay",
    locale: "en",
    quote: "Unwatered days pause growth without killing the plant, delaying maturity by one morning per dry day.",
  },
  {
    id: "en-trellis",
    locale: "en",
    quote: "[Green bean, hops, and grape](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Trellis_Crops) grow on a trellis. You cannot walk through a living trellis, so each plant needs a layout that lets you stand on a neighboring tile.",
  },
  {
    id: "en-trellis-block",
    locale: "en",
    quote: "Planting trellises in solid blocks leaves interior plants unreachable for watering and harvesting.",
  },
  {
    id: "zh-hand",
    locale: "zh-CN",
    quote: "站在成熟植株旁边[右键点它](https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411)",
  },
  {
    id: "zh-hand-x",
    locale: "zh-CN",
    quote: "站在成熟作物旁边，[右键点它](https://steamcommunity.com/app/413150/discussions/0/1849197902668085831/#c1849197902669410411)。键盘上[X 和右键映射成同一个 Check/Do Action](https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481)",
  },
  {
    id: "zh-scythe",
    locale: "zh-CN",
    quote: "另外一些作物必须用普通[镰刀](https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696)来收，例如苋菜、甘蓝菜和小麦。",
  },
  {
    id: "zh-iridium",
    locale: "zh-CN",
    quote: "[铱镰刀](https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836)是 1.6 耕种精通（Farming Mastery）给的那把镰刀。挥过的范围内，能收耕地上长出来的作物，普通作物也包括在内。",
  },
  {
    id: "zh-giant",
    locale: "zh-CN",
    quote: "要用任意一把斧头砍三下",
  },
  {
    id: "zh-tool-button",
    locale: "zh-CN",
    quote: "面向巨大作物，用使用工具的键砍三下（PC 上是左键或 C）",
  },
  {
    id: "zh-water",
    locale: "zh-CN",
    quote: "[作物必须每天浇水，才能按最快速度生长](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979)",
  },
  {
    id: "zh-water-delay",
    locale: "zh-CN",
    quote: "没浇水的日子会暂停生长，但不会把植株弄死；每干一天，成熟就晚一个早晨。",
  },
  {
    id: "zh-fiber",
    locale: "zh-CN",
    quote: "纤维种子是单独的例外：生长不需要每天浇水，但完全长成以后仍然要用镰刀收。",
  },
  {
    id: "zh-trellis",
    locale: "zh-CN",
    quote: "[青豆、啤酒花和葡萄](https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979#Trellis_Crops)（Green Bean、Hops、Grape）长在棚架上。活着的棚架走不穿，所以每株都要有一格能站在旁边。",
  },
  {
    id: "zh-trellis-block",
    locale: "zh-CN",
    quote: "棚架如果种成实心一块，里面的植株就浇不到，也收不到。",
  },
];

const expectedPublicSources = [
  {
    href: "https://stardewvalleywiki.com/index.php?title=Crops&oldid=193979",
    enLabel: "Crops on the Stardew Valley Wiki",
    zhLabel: "星露谷物语维基：作物",
  },
  {
    href: "https://stardewvalleywiki.com/index.php?title=Controls&oldid=192481",
    enLabel: "Controls on the Stardew Valley Wiki",
    zhLabel: "星露谷物语维基：操作",
  },
  {
    href: "https://stardewvalleywiki.com/index.php?title=Scythe&oldid=171696",
    enLabel: "Scythe on the Stardew Valley Wiki",
    zhLabel: "星露谷物语维基：镰刀",
  },
  {
    href: "https://stardewvalleywiki.com/index.php?title=Iridium_Scythe&oldid=186836",
    enLabel: "Iridium Scythe on the Stardew Valley Wiki",
    zhLabel: "星露谷物语维基：铱镰刀",
  },
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function readWorkspaceText(relativePath) {
  return readFileSync(path.join(workspaceRoot, relativePath), "utf8");
}

function stripAddedImports(source, sourceName) {
  let stripped = source;
  for (const importLine of addedImportLines) {
    const occurrenceCount = stripped.split(importLine).length - 1;
    if (occurrenceCount !== 1) {
      throw new Error(
        `${sourceName} import occurrence count is ${occurrenceCount}. Expected 1. Import: ${JSON.stringify(importLine)}.`,
      );
    }
    stripped = stripped.replace(importLine, "");
  }
  return stripped;
}

function stripSourceFooter(source, locale) {
  const strippedImports = stripAddedImports(source, locale.sourceName);
  const footerStart = `      <h2>${locale.faqHeading}</h2>\n`;
  const articleClose = "    </article>\n";
  const start = strippedImports.indexOf(footerStart);
  const end = strippedImports.lastIndexOf(articleClose);
  if (start < 0) {
    throw new Error(`${locale.id} source is missing FAQ heading ${JSON.stringify(locale.faqHeading)}.`);
  }
  if (end < start) {
    throw new Error(`${locale.id} article close is before the FAQ heading.`);
  }
  if (strippedImports.indexOf(footerStart, start + footerStart.length) !== -1) {
    throw new Error(`${locale.id} source has more than one FAQ heading.`);
  }
  return {
    stripped: strippedImports.slice(0, start) + strippedImports.slice(end),
    footer: strippedImports.slice(start, end),
  };
}

function extractFaqItems(source, locale) {
  const questions = [...source.matchAll(/question: "([^"]+)"/g)].map((match) => match[1]);
  const answers = [...source.matchAll(/<p>([^<]+)<\/p>/g)].map((match) => match[1]);
  const footerAnswers = answers.filter((answer) => {
    const answerIndex = source.indexOf(`<p>${answer}</p>`);
    const headingIndex = source.indexOf(`<h2>${locale.faqHeading}</h2>`);
    return answerIndex > headingIndex;
  });
  if (questions.length !== 5) {
    throw new Error(`${locale.id} FAQ question count is ${questions.length}. Expected 5.`);
  }
  if (footerAnswers.length !== 5) {
    throw new Error(`${locale.id} FAQ answer count is ${footerAnswers.length}. Expected 5.`);
  }
  return questions.map((question, index) => ({
    question,
    answer: footerAnswers[index],
  }));
}

function extractSourceRows(source) {
  const rows = [...source.matchAll(/href: "([^"]+)",\n\s+label: "([^"]+)",/g)];
  return rows.map((match) => ({ href: match[1], label: match[2] }));
}

function markdownUrls(markdown) {
  return [...markdown.matchAll(/\((https?:\/\/[^)\s]+)\)/g)].map((match) => match[1]);
}

function handoffUrls(handoff) {
  const referenceUrls = Array.isArray(handoff.publicReferences)
    ? handoff.publicReferences.map((reference) => reference.url)
    : [];
  return {
    referenceUrls,
    bodyUrls: markdownUrls(typeof handoff.body === "string" ? handoff.body : ""),
  };
}

function commandRecord(name) {
  const stdoutPath = path.join(implementationDirectory, `${name}.stdout.txt`);
  const stderrPath = path.join(implementationDirectory, `${name}.stderr.txt`);
  const exitPath = path.join(implementationDirectory, `${name}.exit.txt`);
  const stdout = readFileSync(stdoutPath, "utf8");
  const stderr = readFileSync(stderrPath, "utf8");
  const exitText = readFileSync(exitPath, "utf8").trim();
  const exitCode = Number(exitText);
  if (!Number.isInteger(exitCode)) {
    throw new Error(`${name} exit file is not an integer. Received: ${JSON.stringify(exitText)}.`);
  }
  return {
    name,
    exitCode,
    stdoutPath: path.relative(workspaceRoot, stdoutPath),
    stderrPath: path.relative(workspaceRoot, stderrPath),
    stdoutSha256: sha256(stdout),
    stderrSha256: sha256(stderr),
    stderrEmpty: stderr.length === 0,
    stdoutExcerpt: stdout.trim().split("\n").slice(0, 8).join("\n"),
    stdoutTail: stdout.trim().split("\n").slice(-8).join("\n"),
  };
}

function gitText(args) {
  return execFileSync("git", args, {
    cwd: workspaceRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function fileFact(relativePath) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  const text = readFileSync(absolutePath);
  const stat = statSync(absolutePath);
  return {
    path: relativePath,
    sha256: sha256(text),
    bytes: stat.size,
    mtimeMs: stat.mtimeMs,
  };
}

const checks = [];

function recordCheck(id, pass, detail) {
  checks.push({ id, pass, detail });
  if (pass !== true) {
    console.error(`CHECK FAIL ${id}: ${detail}`);
  }
}

const localeFacts = [];
for (const locale of locales) {
  const relativeSource = `src/blog/articles/${locale.sourceName}`;
  const currentSource = readWorkspaceText(relativeSource);
  const beforeSource = readFileSync(path.join(beforeDirectory, locale.beforeSourceName), "utf8");
  const { stripped, footer } = stripSourceFooter(currentSource, locale);
  const sourceMatchesBefore = stripped === beforeSource;
  recordCheck(
    `${locale.id}-body-unchanged-after-footer-removal`,
    sourceMatchesBefore,
    sourceMatchesBefore
      ? `stripped source sha256 ${sha256(stripped)}`
      : `stripped sha256 ${sha256(stripped)} before sha256 ${sha256(beforeSource)}`,
  );
  recordCheck(
    `${locale.id}-before-has-no-footer-components`,
    !beforeSource.includes("BlogFaqList") && !beforeSource.includes("BlogSources"),
    "before snapshot has neither BlogFaqList nor BlogSources",
  );
  const faqHeadingIndex = currentSource.indexOf(`<h2>${locale.faqHeading}</h2>`);
  const faqListIndex = currentSource.indexOf("<BlogFaqList");
  const sourcesIndex = currentSource.indexOf("<BlogSources");
  const directCtaCount = currentSource.split("BlogPlannerCta").length - 1;
  recordCheck(
    `${locale.id}-order-faq-then-sources-component`,
    faqHeadingIndex >= 0 && faqHeadingIndex < faqListIndex && faqListIndex < sourcesIndex && directCtaCount === 0,
    `heading ${faqHeadingIndex}, faq ${faqListIndex}, sources ${sourcesIndex}, direct BlogPlannerCta count ${directCtaCount}`,
  );
  const sourceRows = extractSourceRows(footer);
  const expectedRows = expectedPublicSources.map((source) => ({
    href: source.href,
    label: locale.id === "en" ? source.enLabel : source.zhLabel,
  }));
  recordCheck(
    `${locale.id}-public-sources-exact`,
    JSON.stringify(sourceRows) === JSON.stringify(expectedRows),
    JSON.stringify(sourceRows),
  );
  const faqItems = extractFaqItems(currentSource, locale);
  const lockedBody = readWorkspaceText(locale.lockedBodyPath);
  const quoteResults = provenanceQuotes
    .filter((quote) => quote.locale === locale.id)
    .map((quote) => ({
      id: quote.id,
      present: lockedBody.includes(quote.quote),
      quote: quote.quote,
    }));
  for (const quoteResult of quoteResults) {
    recordCheck(`${quoteResult.id}-present-in-locked-body`, quoteResult.present, quoteResult.quote);
  }
  const handoff = JSON.parse(readWorkspaceText(path.join(
    "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs",
    locale.handoffName,
  )));
  const urls = handoffUrls(handoff);
  const uniqueHandoffUrls = [...new Set([...urls.referenceUrls, ...urls.bodyUrls])];
  const missingFromHandoff = sourceRows
    .map((row) => row.href)
    .filter((href) => !uniqueHandoffUrls.includes(href));
  recordCheck(
    `${locale.id}-source-hrefs-subset-of-frozen-handoff`,
    missingFromHandoff.length === 0,
    missingFromHandoff.length === 0
      ? `${sourceRows.length} public rows; handoff unique URL count ${uniqueHandoffUrls.length}`
      : `missing ${missingFromHandoff.join(", ")}`,
  );
  localeFacts.push({
    locale: locale.id,
    currentSha256: sha256(currentSource),
    beforeSha256: sha256(beforeSource),
    strippedEqualsBefore: sourceMatchesBefore,
    faqItems,
    sourceRows,
    handoffBodyHash: handoff.bodyHash ?? null,
    handoffFile: fileFact(path.join(
      "docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/handoffs",
      locale.handoffName,
    )),
    uniqueHandoffUrlCount: uniqueHandoffUrls.length,
    quoteResults,
    footerHasDropCount: /15 to 21|15–21|15 到 21/.test(footer),
    footerHasPlannerCtaComponent: footer.includes("BlogPlannerCta"),
  });
}

const sourcesComponent = readWorkspaceText("src/components/blog/blog-sources.tsx");
const ctaIndex = sourcesComponent.indexOf("<BlogPlannerCta");
const sourcesSectionIndex = sourcesComponent.indexOf('className="blog-sources"');
recordCheck(
  "blog-sources-renders-one-cta-before-sources",
  sourcesComponent.split("<BlogPlannerCta").length - 1 === 1 && ctaIndex >= 0 && ctaIndex < sourcesSectionIndex,
  `cta index ${ctaIndex}, sources section index ${sourcesSectionIndex}`,
);

const articleContent = readWorkspaceText("src/components/blog/blog-article-content.tsx");
recordCheck(
  "cover-caption-still-absent",
  !articleContent.includes("figcaption") && articleContent.includes("post.coverImage.alt"),
  "BlogArticleContent renders cover alt and no figcaption",
);

const englishPage = readWorkspaceText("app/(en)/[slug]/page.tsx");
const chinesePage = readWorkspaceText("app/zh/[slug]/page.tsx");
recordCheck(
  "jsonld-call-omits-image-author-date",
  !englishPage.includes("imagePathname") &&
    !chinesePage.includes("imagePathname") &&
    !englishPage.includes("author:") &&
    !chinesePage.includes("datePublished"),
  "both article pages call createArticleStructuredData without imagePathname",
);

const registryText = readWorkspaceText("src/blog/blog-post-registry.tsx");
const registryHash = sha256(registryText);
const seoBaselineRegistryHash = "d038157140b517bd2e694909d55ec1eaa6809e1ed1db292c9ce7408aa87a8608";
recordCheck(
  "registry-hash-matches-seo-baseline-snapshot",
  registryHash === seoBaselineRegistryHash,
  registryHash,
);

const nextEnv = fileFact("next-env.d.ts");
recordCheck(
  "next-env-restored-hash",
  nextEnv.sha256 === "0f70629890b72a0a82e91972cc032c04b658b26c265373cb711cf576bfbf8fcc",
  nextEnv.sha256,
);

const testSource = readWorkspaceText("tests/blog/blog-sources.test.tsx");
const nameMatches = [...testSource.matchAll(/name: "([^"]+)"/g)];
const checkedLabels = nameMatches.map((match, index) => {
  const blockEnd = index + 1 < nameMatches.length ? nameMatches[index + 1].index : testSource.length;
  const block = testSource.slice(match.index, blockEnd);
  const checked = block.match(/checkedLabel:\s*(?:\n\s*)?"([^"]+)"/);
  return {
    name: match[1],
    checkedLabel: checked === null ? null : checked[1],
  };
});
const pineBlockStart = testSource.indexOf("Article: PineTreeStardewEnglishArticle");
const pineBlockEnd = testSource.indexOf("\n  {", pineBlockStart + 1);
const pineBlock = testSource.slice(pineBlockStart, pineBlockEnd);
const pineExpectedMatch = pineBlock.match(/checkedLabel:\s*\n\s*"([^"]+)"/);
const pineSourceLabelMatch = readWorkspaceText("src/blog/articles/pine-tree-stardew.en.tsx").match(
  /checkedLabel="([^"]+)"/,
);
if (pineExpectedMatch === null || pineSourceLabelMatch === null) {
  throw new Error(
    `Pine checked label could not be read. Test match: ${pineExpectedMatch === null}. Source match: ${pineSourceLabelMatch === null}.`,
  );
}
const pineCheckedLabel = {
  expectedByTest: pineExpectedMatch[1],
  renderedByArticle: pineSourceLabelMatch[1],
};
recordCheck(
  "pine-checked-label-mismatch-is-outside-harvest",
  pineCheckedLabel.expectedByTest.startsWith("The following public pages") &&
    pineCheckedLabel.renderedByArticle.startsWith("The public pages below") &&
    pineCheckedLabel.expectedByTest !== pineCheckedLabel.renderedByArticle,
  "English pine test expectation and article label differ; harvest expectations have no checked label.",
);
const harvestExpectations = checkedLabels.filter((item) => item.name.includes("how-to-harvest-stardew-valley"));
recordCheck(
  "harvest-source-expectation-has-no-checked-label",
  harvestExpectations.length === 2 && harvestExpectations.every((item) => item.checkedLabel === null),
  JSON.stringify(harvestExpectations),
);

const gitStatus = gitText([
  "status",
  "--short",
  "--",
  "src",
  "tests",
  "app",
  "next-env.d.ts",
  "public/llms.txt",
  "next.config.ts",
  "package.json",
]);
const testDiff = gitText(["diff", "--numstat", "--", "tests/blog/blog-sources.test.tsx"]);
const testDiffBody = gitText(["diff", "--unified=3", "--", "tests/blog/blog-sources.test.tsx"]);
const testRemovedLines = testDiffBody
  .split("\n")
  .filter((line) => line.startsWith("-") && !line.startsWith("---"))
  .length;
recordCheck(
  "blog-sources-test-diff-is-additions-only",
  testRemovedLines === 0 && testDiff.startsWith("48"),
  `numstat ${testDiff.trim()} removed lines ${testRemovedLines}`,
);

const outEnglish = path.join(workspaceRoot, "out/how-to-harvest-stardew-valley.html");
const outChinese = path.join(workspaceRoot, "out/zh/how-to-harvest-stardew-valley.html");
const sitemap = readWorkspaceText("out/sitemap.xml");
recordCheck(
  "local-sitemap-has-both-urls",
  sitemap.includes("https://stardewvalleyplanner.art/how-to-harvest-stardew-valley</loc>") &&
    sitemap.includes("https://stardewvalleyplanner.art/zh/how-to-harvest-stardew-valley</loc>"),
  "out/sitemap.xml contains both localized locs",
);

function exportFooterFact(relativePath, faqHeading) {
  const absolutePath = path.join(workspaceRoot, relativePath);
  const html = readFileSync(absolutePath, "utf8");
  return {
    ...fileFact(relativePath),
    faqHeadingCount: html.split(faqHeading).length - 1,
    faqTriggerCount: html.split("blog-faq-trigger").length - 1,
    ctaCount: html.split('data-blog-planner-cta="true"').length - 1,
    faqPageCount: (html.match(/FAQPage/g) ?? []).length,
    qaPageCount: (html.match(/QAPage/g) ?? []).length,
    articleCount: (html.match(/"@type":"Article"/g) ?? []).length,
  };
}

const implementationCommands = [
  "typecheck",
  "typecheck-r2",
  "build-webpack",
  "vitest-related",
  "vitest-sources-r2",
  "vitest-cta",
  "vitest-footer",
].map(commandRecord);

const liveStatuses = [];
for (const route of ["/how-to-harvest-stardew-valley", "/zh/how-to-harvest-stardew-valley"]) {
  const response = await fetch(`http://127.0.0.1:3004${route}`, { redirect: "manual" });
  liveStatuses.push({
    route,
    status: response.status,
    contentType: response.headers.get("content-type"),
  });
  recordCheck(`${route}-dev-http-200`, response.status === 200, `status ${response.status}`);
}

const report = {
  generatedBy: "collect-source-facts.mjs",
  taskId: "task_2c42f9a0d7b3",
  dispatchId: "ctx_5880fb1f8d85",
  note: "Reads implementation logs and current source. Does not rebuild.",
  checks,
  passCount: checks.filter((check) => check.pass).length,
  failCount: checks.filter((check) => !check.pass).length,
  localeFacts,
  files: {
    registry: fileFact("src/blog/blog-post-registry.tsx"),
    seoBaselineRegistryHash,
    nextEnv,
    englishPage: fileFact("app/(en)/[slug]/page.tsx"),
    chinesePage: fileFact("app/zh/[slug]/page.tsx"),
    blogSources: fileFact("src/components/blog/blog-sources.tsx"),
    blogFaqList: fileFact("src/components/blog/blog-faq-list.tsx"),
    blogPlannerCta: fileFact("src/components/blog/blog-planner-cta.tsx"),
    blogArticleContent: fileFact("src/components/blog/blog-article-content.tsx"),
    pageMetadata: fileFact("src/seo/page-metadata.ts"),
    pageStructuredData: fileFact("src/seo/page-structured-data.ts"),
  },
  gitStatusProduct: gitStatus.trim().split("\n"),
  blogSourcesTestDiff: {
    numstat: testDiff.trim(),
    removedLineCount: testRemovedLines,
    additionIsHarvestExpectationOnly: testDiffBody.includes("how-to-harvest-stardew-valley") && testRemovedLines === 0,
  },
  pineCheckedLabel,
  implementationCommands,
  staticExport: {
    en: exportFooterFact("out/how-to-harvest-stardew-valley.html", "How to Harvest Stardew Valley FAQ"),
    zh: exportFooterFact("out/zh/how-to-harvest-stardew-valley.html", "星露谷物语收作物常见问题"),
    sitemap: fileFact("out/sitemap.xml"),
  },
  liveDevStatuses: liveStatuses,
  handoffDirectory: path.relative(workspaceRoot, handoffDirectory),
};

const reportPath = path.join(reviewDirectory, "source-facts.json");
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`wrote ${reportPath}`);
console.log(`pass ${report.passCount} fail ${report.failCount}`);
if (report.failCount > 0) {
  throw new Error(`source fact checks failed: ${report.failCount}. See ${reportPath}.`);
}
