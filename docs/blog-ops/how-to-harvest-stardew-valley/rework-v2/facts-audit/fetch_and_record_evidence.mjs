import { promises as fs } from "node:fs";
import path from "node:path";

const EVIDENCE_DIR = path.resolve("docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-audit");

export async function fetchChineseWikiPageStatus(titles) {
  if (!Array.isArray(titles) || titles.length === 0) {
    throw new Error(`fetchChineseWikiPageStatus: titles must be non-empty array, received ${JSON.stringify(titles)}`);
  }
  const titlesParam = encodeURIComponent(titles.join("|"));
  const apiUrl = `https://zh.stardewvalleywiki.com/mediawiki/api.php?action=query&titles=${titlesParam}&format=json`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`fetchChineseWikiPageStatus failed: HTTP ${response.status} ${response.statusText} for ${apiUrl}`);
  }
  const payload = await response.json();
  if (!payload || !payload.query || !payload.query.pages) {
    throw new Error(`fetchChineseWikiPageStatus invalid json structure for ${apiUrl}`);
  }
  const resolved = {};
  for (const [pageId, pageData] of Object.entries(payload.query.pages)) {
    const isMissing = "missing" in pageData;
    resolved[pageData.title] = {
      pageId: Number(pageId),
      title: pageData.title,
      exists: !isMissing,
    };
  }
  return resolved;
}

export async function saveEvidenceRecord(fileName, recordPayload) {
  if (typeof fileName !== "string" || fileName.trim().length === 0) {
    throw new Error(`saveEvidenceRecord: invalid fileName: ${fileName}`);
  }
  if (!recordPayload) {
    throw new Error(`saveEvidenceRecord: recordPayload is required for ${fileName}`);
  }
  const destinationPath = path.join(EVIDENCE_DIR, fileName);
  const contentString = JSON.stringify(recordPayload, null, 2);
  await fs.writeFile(destinationPath, contentString, "utf-8");
  return destinationPath;
}

export async function executeEvidenceCollection() {
  const targetTerms = [
    "甘蓝菜", "羽衣甘蓝",
    "霜瓜", "霜花瓜",
    "稻苗", "米苗",
    "未碾米",
    "上古水果", "远古水果",
    "小桶", "酿造桶",
    "罐头瓶", "腌酱桶",
    "宝石复制机", "复制晶石机",
    "金色的镰刀", "金镰刀",
    "铱镰刀", "镰刀",
    "采石场矿井", "采石场矿洞",
    "防风草", "苋菜", "小麦", "青豆", "草莓", "咖啡豆",
    "玉米", "向日葵", "花椰菜", "甜瓜", "南瓜", "齐瓜", "齐果",
    "啤酒花", "葡萄", "大葱", "纤维种子"
  ];

  const termStatus = await fetchChineseWikiPageStatus(targetTerms);
  const zhEvidencePath = await saveEvidenceRecord("raw-zh-terms.json", {
    retrievedAt: new Date().toISOString(),
    apiEndpoint: "https://zh.stardewvalleywiki.com/mediawiki/api.php",
    totalTermsChecked: targetTerms.length,
    terms: termStatus,
  });

  return { zhEvidencePath };
}

import url from "node:url";

// Top level execution if run directly
if (process.argv[1] && url.fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  executeEvidenceCollection()
    .then((result) => console.log("Evidence collected successfully:", result))
    .catch((error) => {
      console.error("Evidence collection failed:", error);
      process.exit(1);
    });
}
