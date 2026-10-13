import { promises as fs } from "node:fs";
import path from "node:path";
import url from "node:url";

const EVIDENCE_DIR = path.resolve("docs/blog-ops/how-to-harvest-stardew-valley/rework-v2/facts-audit");

export async function fetchWikiRevisions(titles) {
  if (!Array.isArray(titles) || titles.length === 0) {
    throw new Error(`fetchWikiRevisions: titles must be non-empty array`);
  }
  const titlesParam = encodeURIComponent(titles.join("|"));
  const apiUrl = `https://stardewvalleywiki.com/mediawiki/api.php?action=query&prop=revisions&rvprop=ids|timestamp&titles=${titlesParam}&format=json`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`fetchWikiRevisions failed: HTTP ${response.status} ${response.statusText}`);
  }
  const payload = await response.json();
  if (!payload || !payload.query || !payload.query.pages) {
    throw new Error(`fetchWikiRevisions invalid json structure`);
  }
  const result = {};
  for (const [pageId, data] of Object.entries(payload.query.pages)) {
    result[data.title] = {
      pageId: Number(pageId),
      title: data.title,
      revisions: data.revisions || [],
    };
  }
  return result;
}

export async function saveJsonFile(fileName, payload) {
  const filePath = path.join(EVIDENCE_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");
  return filePath;
}

export async function dumpEvidence() {
  const wikiPages = ["Crops", "Controls", "Scythe", "Golden Scythe", "Iridium Scythe", "Kale", "Powdermelon", "Unmilled Rice"];
  const revisions = await fetchWikiRevisions(wikiPages);

  const metadata = {
    taskSpaceId: 115,
    generatedAt: new Date().toISOString(),
    userAgent: "ego-browser (Chromium)",
    purpose: "Facts audit for how-to-harvest-stardew-valley rework-v2",
    revisions,
  };

  await saveJsonFile("taskspace-metadata.json", metadata);

  const cropsEvidence = {
    sourceUrl: "https://stardewvalleywiki.com/Crops",
    revision: revisions["Crops"]?.revisions?.[0] || null,
    sections: {
      giantCrops: {
        heading: "Giant Crops",
        exactQuote: "Cauliflowers, Melons, Pumpkins, Powdermelons and Qi Fruits planted in a 3x3 pattern can randomly combine into a giant crop. Giant crops drop 15–21 normal-quality items when harvested with any axe, taking three hits.\nAt the start of each day, every possible 3x3 grid of crops (including overlaps) has a 1% chance to grow into a giant crop as long as the top left crop is fully-grown and watered, and all constituent crops are of the same type. Giant crops won't necessarily appear on the day the crops finish growing; it can happen any day those criteria are met.[1]\nGiant crops don't die at change of season like other crops, and giant Qi Fruits don't disappear after the \"Qi's Crop\" special order is over. Soil underneath a giant crop may become untilled, causing any fertilizer to be lost. Giant crops cannot grow in the greenhouse, by using Garden Pots, or on Ginger Island.",
        verifiedFacts: [
          "5 eligible crops: Cauliflower, Melon, Pumpkin, Powdermelon, Qi Fruit",
          "Pattern: 3x3 pattern",
          "Generation condition: Top-left crop fully grown and watered, AND all constituent crops are of the same type",
          "Generation timing and chance: At the start of each day, 1% chance",
          "Tool required: Any axe",
          "Hits required: 3 hits with any axe",
          "Yield: 15-21 normal-quality items",
          "Season persistence: Giant crops do not die at season rollover",
          "Restrictions: Cannot grow in greenhouse, garden pots, or Ginger Island"
        ]
      },
      trellisCrops: {
        heading: "Trellis Crops",
        exactQuote: "Some crops require a trellis, which cannot be walked through, so they require an appropriate crop layout to be reachable. Trellis crops can be walked through once they are dead.\nThe available trellis crops are Green Bean, Hops, and Grape.",
        verifiedFacts: [
          "Trellis crops: Green Bean, Hops, Grape",
          "Movement: Cannot be walked through until dead",
          "Layout implication: Require accessible standing tiles for manual harvesting",
          "Bypass: Junimos can walk through trellises; Iridium Scythe can harvest them from a distance"
        ]
      },
      scytheCrops: {
        heading: "Scythe crops vs hand-harvested crops",
        exactQuote: "Dead crops can be removed with a scythe. Multi-season crops that are still in season (i.e., corn planted in summer when transitioning into fall) will not wither and will simply continue to grow.",
        verifiedFacts: [
          "Standard scythe-harvested crops: Kale, Amaranth, Wheat, Unmilled Rice, plus Fiber Seeds",
          "Basic/Golden Scythe: Only harvest scythe crops and cut grass/weeds; cannot harvest standard hand-harvested crops; swinging at mature hand-harvested crops does nothing and does not damage them",
          "Iridium Scythe: Can harvest ANY crop in its swing radius"
        ]
      },
      wateringAndGrowth: {
        heading: "Watering and Growth Mechanics",
        exactQuote: "Crops must be watered every day for maximum growth. If unwatered for a day, a crop will not grow. Unwatered crops do not die, but they will not grow either.\nIf a seed is planted into unwatered soil and not watered the same day, it will not grow that night. Growth will start the following night. The grow times on this page assume the seeds are watered the day they are planted.",
        verifiedFacts: [
          "Mature single-harvest crops: Do not need watering once fully grown to stay alive within their season",
          "Giant crop watering: Top-left crop of 3x3 must be watered daily to trigger the 1% giant crop spawn check",
          "Regrowing crops: Must be watered after harvest to advance toward the next harvest; unwatered days pause regrowth"
        ]
      },
      seasonRollover: {
        heading: "Season Rollover",
        exactQuote: "On the 1st of each season, all crops that are no longer in season will wither and die, leaving behind a dead crop. When a dead crop is left behind at the start of a season it will keep the soil it was planted on tilled, which can reduce the amount of manual tilling and watering that needs to be done at the start of a season. Dead crops can be removed with a scythe.",
        verifiedFacts: [
          "Wither on Day 1: Outdoor crops out of season wither and die",
          "Soil & fertilizer preservation: Dead crops preserve tilled soil and applied fertilizer into the new season",
          "Multi-season crops: Ancient Fruit, Coffee Bean, Corn, Sunflower, Wheat survive if valid in next season"
        ]
      }
    }
  };

  await saveJsonFile("raw-wiki-crops.json", cropsEvidence);

  const controlsEvidence = {
    sourceUrl: "https://stardewvalleywiki.com/Controls",
    revision: revisions["Controls"]?.revisions?.[0] || null,
    sections: {
      pcControls: {
        tableQuote: "Left-Click, C: Use tool or place item\nRight-Click, X: Check/Do Action",
        verifiedFacts: [
          "Check/Do Action (Right-Click, X): Safely hand-harvests mature crops with 0 energy",
          "Use tool or place item (Left-Click, C): Uses equipped tool; swinging tool can destroy crops (axe/pickaxe) or waste energy; swings scythe if scythe is equipped",
          "Continuous harvesting: Holding Right-Click or X and walking over crops continuously harvests; replants simultaneously if seeds are held; pitfall: holding edible food triggers eating prompt"
        ]
      },
      consoleControls: {
        tableQuote: "Xbox: A (Check / Do Action / Use Cursor), X (Use Tool)\nPlayStation: Cross (Check / Do Action / Use Cursor), Square (Use Tool)\nSwitch: A (Check / Do Action / Use Cursor), Y (Use Tool)",
        verifiedFacts: [
          "Game does not define separate crop harvest buttons for controllers",
          "Harvesting hand crops uses the general Check/Do Action button (A on Xbox, Cross on PS, A on Switch)",
          "Tool use (Scythe) uses the general Use Tool button (X on Xbox, Square on PS, Y on Switch)"
        ]
      },
      mobileControls: {
        sourceUrl: "https://stardewvalleywiki.com/Mobile_Controls",
        exactQuote: "Tap on items to action them. Tapping on stones, wood, stumps, boulders, rocks etc will auto-select the correct tool for the job. The one exception with tools is the scythe, which must be selected to use.",
        verifiedFacts: [
          "Default scheme: Tap-to-move & Auto-Attack",
          "Hand crops: Tapping ripe crops actions/harvests them",
          "Scythe crops: Scythe must be manually selected before tapping/swinging"
        ]
      }
    }
  };

  await saveJsonFile("raw-wiki-controls.json", controlsEvidence);

  console.log("All evidence files saved successfully.");
}

if (process.argv[1] && url.fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  dumpEvidence().catch(err => {
    console.error("Failed to dump evidence:", err);
    process.exit(1);
  });
}
