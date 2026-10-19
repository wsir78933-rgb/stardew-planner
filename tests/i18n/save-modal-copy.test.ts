import { describe, expect, it } from "vitest";
import type { HomepageLocale } from "../../src/homepage/homepage-locale";
import {
  getSaveModalCopy,
  type CloudProjectSyncStatus,
  type FarmSummarySeason,
  type SaveModalBranch,
} from "../../src/i18n/save-modal-copy";

describe("save modal copy", () => {
  it.each([
    ["en", "Save tools", "Loading Local projects…", 'Cannot load save tool branch "projects": import failed'],
    ["zh-CN", "保存工具", "正在加载本地项目…", '无法加载保存工具分支 "projects"：import failed'],
  ] as const)(
    "preserves branch identifiers and raw loader errors in %s",
    (locale, saveToolsLabel, loadingMessage, failureMessage) => {
      const copy = getSaveModalCopy(locale);

      expect(copy.saveTools.label).toBe(saveToolsLabel);
      expect(copy.saveTools.loadingBranch("projects")).toBe(loadingMessage);
      expect(copy.saveTools.branchLoadFailure("projects", "import failed")).toBe(
        failureMessage,
      );
    },
  );

  it("formats every dynamic Chinese save-flow value without changing raw project, file, or farm values", () => {
    const copy = getSaveModalCopy("zh-CN");

    expect(copy.localProjects.defaultProjectName).toBe("未命名项目");
    expect(copy.localProjects.myPlansFolder).toBe("我的方案");
    expect(copy.localProjects.newFolder).toBe("+ 新建文件夹");
    expect(copy.localProjects.newProjectName).toBe("新方案名称");
    expect(copy.localProjects.open).toBe("打开");
    expect(copy.localProjects.duplicate).toBe("创建副本");
    expect(copy.localProjects.delete).toBe("删除");
    expect(copy.localProjects.dateTimeLocale).toBe("zh-CN");
    expect(copy.localProjects.currentMapCount(2)).toBe("2 张地图");
    expect(copy.localProjects.openedProject("River / 夏季")).toBe('已打开“River / 夏季”。');
    expect(copy.localProjects.exportedProject("River / 夏季")).toBe('已导出“River / 夏季”。');
    expect(copy.localProjects.importedProject("farm.JSON")).toBe('已导入“farm.JSON”。');
    expect(copy.localProjects.actionFailure("disk full")).toBe("本地项目操作失败：disk full");
    expect(copy.cloudProjects.extras).toBe("更多功能");
    expect(copy.cloudProjects.signInGoogle).toBe("使用 Google 继续");
    expect(copy.localProjects.deviceTools).toBe("设备工具");
    expect(copy.cloudProjects.cloudStatusErrorSummary).toBe("云同步暂不可用。");
    expect(copy.cloudProjects.signedOut).toBe(
      "尚未登录。本地项目仍保留在此设备上。",
    );
    expect(copy.cloudProjects.cloudProjectsEmpty).toBe(
      "还没有云端副本。保存当前项目时会自动同步。",
    );
    expect(copy.cloudProjects.syncThisProject).toBe("同步到云端");
    expect(copy.cloudProjects.localSaveRetirementCountdown(1, 2, 3)).toBe(
      "本地保存将在 1天 2小时 3分钟后结束。需要保留到云端的项目请先同步；云端副本会一直保留，直到你主动删除。",
    );
    expect(copy.cloudProjects.localSaveRetirementNotConfigured).toBe(
      "7 天本地保存过渡期尚未启动，截止日期待定。",
    );
    expect(copy.cloudProjects.localSaveRetirementEnded).toContain("没有自动删除");
    expect(copy.cloudProjects.syncAllLocalProjects).toBe("同步全部本地项目");
    expect(copy.cloudProjects.syncAllSignedOut).toBe("登录后同步全部本地项目");
    expect(copy.cloudProjects.syncAllSignInDescription).toContain("登录不会自动上传项目");
    expect(copy.cloudProjects.syncAllProgress(1, 2, "Forest Farm")).toContain("正在同步“Forest Farm”");
    expect(copy.cloudProjects.syncAllCompleted(2)).toBe("已同步全部 2 个本地项目。");
    expect(
      copy.cloudProjects.syncAllFailed(1, 2, ["Forest Farm"], "revision conflict"),
    ).toContain("Forest Farm");
    expect(
      copy.cloudProjects.syncAllFailed(1, 2, ["Forest Farm"], "revision conflict"),
    ).toContain("revision conflict");
    expect(copy.cloudProjects.localProjectStatus("synced")).toBe("已同步");
    expect(copy.cloudProjects.localProjectStatus("conflict")).toBe("需要选择版本");
    expect(copy.cloudProjects.mapCount(2)).toBe("2 张地图");
    expect(copy.cloudProjects.signedInAs("Farm Planner")).toBe("当前登录账户：Farm Planner。");
    expect(copy.cloudProjects.deleteProject.descriptionSuffix).toContain("本地项目会保留");
    expect(copy.saveTools.retryBranch("projects")).toBe("重试加载本地项目");
    expect(copy.deleteProject.descriptionPrefix).toBe("要从此浏览器删除“");
    expect(copy.deleteProject.descriptionSuffix).toBe("”吗？此操作无法撤销。");
    expect(copy.imageExport.exportFailure("canvas failed")).toBe("截图导出失败：canvas failed");
    expect(copy.thumbnail.saveFailure("quota exceeded")).toBe(
      "缩略图保存失败：quota exceeded",
    );
    expect(copy.gameSave.importing("SaveGameInfo")).toBe("正在导入 SaveGameInfo…");
    expect(copy.gameSave.importFailure("bad XML")).toBe("游戏存档导入失败：bad XML");
    expect(copy.gameSave.resultTitle("Bluebell")).toBe("“Bluebell农场”");
    expect(copy.gameSave.unmappedItems(3)).toBe("3 个物品无法匹配（可能来自模组）。");
    expect(copy.gameSaveResultLoader.loadFailure("chunk failed")).toBe(
      "无法加载游戏存档导入结果：chunk failed",
    );
    expect(copy.farmSummaryPreview.itemsPlaced(4)).toBe("4 个物品已放置");
    expect(copy.farmSummaryPreview.season("winter")).toBe("冬季");
    expect(copy.farmSummaryDetail.exportFailure("download failed")).toBe(
      "农场摘要导出失败：download failed",
    );
    expect(copy.farmSummaryDetail.itemsPlaced(4)).toBe("4 个物品已放置");
    expect(copy.farmSummaryDetail.season("spring")).toBe("春季");
  });

  it("formats every dynamic English save-flow value without changing raw project, file, or farm values", () => {
    const copy = getSaveModalCopy("en");

    expect(copy.localProjects.defaultProjectName).toBe("Untitled Project");
    expect(copy.localProjects.myPlansFolder).toBe("My Plans");
    expect(copy.localProjects.newFolder).toBe("+ New folder");
    expect(copy.localProjects.newProjectName).toBe("New plan name");
    expect(copy.localProjects.open).toBe("Open");
    expect(copy.localProjects.duplicate).toBe("Duplicate");
    expect(copy.localProjects.delete).toBe("Delete");
    expect(copy.localProjects.dateTimeLocale).toBe("en");
    expect(copy.localProjects.projectMapCount(1)).toBe("1 map");
    expect(copy.localProjects.projectMapCount(2)).toBe("2 maps");
    expect(copy.localProjects.currentMapCount(1)).toBe("1 maps");
    expect(copy.localProjects.currentMapCount(2)).toBe("2 maps");
    expect(copy.localProjects.openedProject("River Farm")).toBe("Opened River Farm.");
    expect(copy.localProjects.exportedProject("River Farm")).toBe("Exported River Farm.");
    expect(copy.localProjects.importedProject("farm.JSON")).toBe("Imported farm.JSON.");
    expect(copy.localProjects.actionFailure("disk full")).toBe("Local project action failed: disk full");
    expect(copy.cloudProjects.extras).toBe("Extras");
    expect(copy.cloudProjects.signInGoogle).toBe("Continue with Google");
    expect(copy.localProjects.deviceTools).toBe("Device tools");
    expect(copy.cloudProjects.cloudStatusErrorSummary).toBe("Cloud sync is unavailable.");
    expect(copy.cloudProjects.cloudStatusError("HTTP 404")).toBe("Cloud sync error: HTTP 404");
    expect(copy.cloudProjects.signedOut).toBe(
      "Not signed in. Local projects stay on this device.",
    );
    expect(copy.cloudProjects.cloudProjectsEmpty).toBe(
      "No cloud copies yet. Saving the current project syncs it automatically.",
    );
    expect(copy.cloudProjects.syncThisProject).toBe("Sync to cloud");
    expect(copy.cloudProjects.localSaveRetirementCountdown(1, 2, 3)).toBe(
      "Local saving transitions out in 1d 2h 3m. Sync projects you want to keep in the cloud. Cloud copies remain until you delete them.",
    );
    expect(copy.cloudProjects.localSaveRetirementNotConfigured).toBe(
      "The 7-day local-save transition has not started. Its cutoff date is pending.",
    );
    expect(copy.cloudProjects.localSaveRetirementEnded).toContain("no data was deleted");
    expect(copy.cloudProjects.syncAllLocalProjects).toBe("Sync all local projects");
    expect(copy.cloudProjects.syncAllSignedOut).toBe("Sign in to sync all local projects");
    expect(copy.cloudProjects.syncAllSignInDescription).toContain("will not upload projects");
    expect(copy.cloudProjects.syncAllProgress(1, 2, "Forest Farm")).toContain("Syncing Forest Farm");
    expect(copy.cloudProjects.syncAllCompleted(2)).toBe("All 2 local projects synced.");
    expect(
      copy.cloudProjects.syncAllFailed(1, 2, ["Forest Farm"], "revision conflict"),
    ).toContain("Forest Farm");
    expect(
      copy.cloudProjects.syncAllFailed(1, 2, ["Forest Farm"], "revision conflict"),
    ).toContain("revision conflict");
    expect(copy.cloudProjects.localProjectStatus("synced")).toBe("Synced");
    expect(copy.cloudProjects.localProjectStatus("pending")).toBe("Waiting to sync");
    expect(copy.cloudProjects.mapCount(2)).toBe("2 maps");
    expect(copy.cloudProjects.signedInAs("Farm Planner")).toBe("Signed in as Farm Planner.");
    expect(copy.cloudProjects.deleteProject.descriptionSuffix).toContain(
      "local project will stay on this device",
    );
    expect(copy.saveTools.loadingBranch("projects")).toBe("Loading Local projects…");
    expect(copy.saveTools.retryBranch("projects")).toBe("Retry Local projects");
    expect(copy.saveTools.branchLoadFailure("projects", "import failed")).toBe(
      'Cannot load save tool branch "projects": import failed',
    );
    expect(copy.deleteProject.descriptionPrefix).toBe("Delete ");
    expect(copy.deleteProject.descriptionSuffix).toBe(
      " from this browser? This cannot be undone.",
    );
    expect(copy.imageExport.exportFailure("canvas failed")).toBe(
      "Screenshot export failed: canvas failed",
    );
    expect(copy.imageExport.screenshotTitle).toBe(
      "1x resolution, compact file size",
    );
    expect(copy.imageExport.screenshotHighQualityTitle).toBe(
      "2x resolution, higher quality",
    );
    expect(copy.thumbnail.saveFailure("quota exceeded")).toBe(
      "Thumbnail save failed: quota exceeded",
    );
    expect(copy.gameSave.importing("SaveGameInfo")).toBe("Importing SaveGameInfo…");
    expect(copy.gameSave.ariaLabel).toBe("Import Game Save");
    expect(copy.gameSave.chooseFile).toBe("Choose save file");
    expect(copy.gameSave.close).toBe("Close");
    expect(copy.gameSave.description).toBe(
      "Choose a Stardew Valley save file to preview the farm in this planner.",
    );
    expect(copy.gameSave.tooltip).toBe(
      "Import a Stardew Valley save file to view your farm layout",
    );
    expect(copy.gameSave.importFailure("bad XML")).toBe("Game save import failed: bad XML");
    expect(copy.gameSave.resultTitle("Bluebell")).toBe('"Bluebell Farm"');
    expect(copy.gameSave.resultCloseLabel).toBe("Close game save import result");
    expect(copy.gameSave.unmappedItems(3)).toBe(
      "3 items couldn't be mapped (likely from mods).",
    );
    expect(copy.gameSave.unmappedItems(1)).toBe(
      "1 items couldn't be mapped (likely from mods).",
    );
    expect(copy.gameSave.resultImportedAll).toBe("All recognized map placements were imported.");
    expect(copy.gameSave.experimentalNotice).toBe(
      "Game save import is experimental. Unsupported items are not placed on the map.",
    );
    expect(copy.gameSave.localOnlyNotice).toBe(
      "The imported map is only in this browser until you save it to this device.",
    );
    expect(copy.gameSaveResultLoader.loadFailure("chunk failed")).toBe(
      "Cannot load imported game-save result: chunk failed",
    );
    expect(copy.gameSaveResultLoader.loading).toBe("Loading imported game-save result…");
    expect(copy.gameSaveResultLoader.retry).toBe("Retry result loading");
    expect(copy.farmSummaryPreview.ariaLabel).toBe("Farm Summary");
    expect(copy.farmSummaryPreview.map).toBe("Map");
    expect(copy.farmSummaryPreview.seasonLabel).toBe("Season");
    expect(copy.farmSummaryPreview.itemsPlaced(4)).toBe("4 items placed");
    expect(copy.farmSummaryPreview.season("spring")).toBe("Spring");
    expect(copy.farmSummaryPreview.season("summer")).toBe("Summer");
    expect(copy.farmSummaryPreview.season("fall")).toBe("Fall");
    expect(copy.farmSummaryPreview.season("winter")).toBe("Winter");
    expect(copy.farmSummaryPreview.viewDetails).toBe("View detailed summary");
    expect(copy.farmSummaryDetail.closeLabel).toBe("Close Farm Summary");
    expect(copy.farmSummaryDetail.empty).toBe("No items have been placed yet.");
    expect(copy.farmSummaryDetail.exportCsv).toBe("Export CSV");
    expect(copy.farmSummaryDetail.exportFailure("download failed")).toBe(
      "Farm summary export failed: download failed",
    );
    expect(copy.farmSummaryDetail.itemsPlaced(4)).toBe("4 items placed");
    expect(copy.farmSummaryDetail.map).toBe("Map");
    expect(copy.farmSummaryDetail.seasonLabel).toBe("Season");
    expect(copy.farmSummaryDetail.season("winter")).toBe("Winter");
    expect(copy.farmSummaryDetail.season("spring")).toBe("Spring");
    expect(copy.farmSummaryDetail.season("summer")).toBe("Summer");
    expect(copy.farmSummaryDetail.season("fall")).toBe("Fall");
    expect(copy.farmSummaryDetail.title).toBe("Farm Summary");
  });

  it("fails fast with the unsupported runtime locale value", () => {
    expect(() => getSaveModalCopy("fr" as never)).toThrow(
      'Unsupported save-modal locale. Received: "fr".',
    );
  });

  it("formats every dynamic Japanese save-flow value without changing raw project, file, or farm values", () => {
    const copy = getSaveModalCopy("ja" as HomepageLocale);
    const englishCopy = getSaveModalCopy("en");

    expect(collectCopyKeyPaths(copy)).toEqual(collectCopyKeyPaths(englishCopy));
    expect(copy.localProjects.defaultProjectName).toBe("無題のプロジェクト");
    expect(copy.localProjects.myPlansFolder).toBe("マイプラン");
    expect(copy.localProjects.dateTimeLocale).toBe("ja");
    expect(copy.cloudProjects.dateTimeLocale).toBe("ja");
    expect(copy.localProjects.currentMapCount(1)).toBe("1枚の地図");
    expect(copy.localProjects.projectMapCount(2)).toBe("2枚の地図");
    expect(copy.localProjects.openedProject("River / 夏季")).toBe(
      "「River / 夏季」を開きました。",
    );
    expect(copy.localProjects.exportedProject("River / 夏季")).toBe(
      "「River / 夏季」をエクスポートしました。",
    );
    expect(copy.localProjects.importedProject("farm.JSON")).toBe(
      "「farm.JSON」をインポートしました。",
    );
    expect(copy.localProjects.downloadImage("farm.JSON")).toBe(
      "画像をダウンロード：farm.JSON",
    );
    expect(copy.localProjects.downloadedImage("River / 夏季")).toContain("River / 夏季");
    expect(copy.localProjects.folderMoved("Summer Plans")).toContain("Summer Plans");
    expect(copy.localProjects.actionFailure("disk full")).toBe(
      "ローカルプロジェクトの操作に失敗しました：disk full",
    );
    expect(copy.cloudProjects.signInGoogle).toBe("Googleで続行");
    expect(copy.cloudProjects.cloudStatusError("HTTP 404")).toBe(
      "クラウド同期エラー：HTTP 404",
    );
    expect(copy.cloudProjects.localSaveRetirementCountdown(1, 2, 3)).toBe(
      "ローカル保存は残り1日2時間3分で終了します。クラウドに残したいプロジェクトは先に同期してください。クラウド上のコピーは、削除するまで残ります。",
    );
    expect(copy.cloudProjects.localSaveRetirementNotConfigured).toContain("7日間");
    expect(copy.cloudProjects.localSaveRetirementEnded).toContain("自動削除されていません");
    expect(copy.cloudProjects.syncAllProgress(1, 2, "Forest Farm")).toContain(
      "「Forest Farm」を同期しています…",
    );
    expect(copy.cloudProjects.syncAllProgress(1, 2, null)).toBe(
      "2件中1件のローカルプロジェクトを処理しました…",
    );
    expect(copy.cloudProjects.syncAllCompleted(2)).toBe(
      "2件のローカルプロジェクトをすべて同期しました。",
    );
    expect(copy.cloudProjects.syncAllFailed(1, 2, ["Forest Farm"], "revision conflict")).toBe(
      "2件中1件のローカルプロジェクトを処理したところで停止しました。確認が必要なプロジェクトは1件です：Forest Farm。revision conflict",
    );
    expect(copy.cloudProjects.syncAllFailed(0, 1, [], "HTTP 503")).toBe(
      "1件中0件のローカルプロジェクトを処理したところで停止しました。個別の失敗プロジェクトは記録されていません。HTTP 503",
    );
    expect(copy.cloudProjects.signedInAs("Farm Planner")).toBe(
      "ログイン中のアカウント：Farm Planner。",
    );
    expect(copy.cloudProjects.localProjectStatus("none")).toBe("この端末のみ");
    expect(copy.cloudProjects.localProjectStatus("pending")).toBe("同期待ち");
    expect(copy.cloudProjects.localProjectStatus("synced")).toBe("同期済み");
    expect(copy.cloudProjects.localProjectStatus("conflict")).toBe("選択が必要");
    expect(copy.cloudProjects.localProjectStatus("error")).toBe("同期失敗");
    expect(copy.cloudProjects.mapCount(2)).toBe("2枚の地図");
    expect(copy.cloudProjects.deleteProject.descriptionPrefix).toBe("クラウドアカウントから「");
    expect(copy.cloudProjects.deleteProject.descriptionSuffix).toContain("この端末に残ります");
    expect(copy.deleteProject.descriptionPrefix).toBe("このブラウザから「");
    expect(copy.deleteProject.descriptionSuffix).toBe(
      "」を削除しますか？この操作は元に戻せません。",
    );
    expect(copy.saveTools.branchLoadFailure("projects", "import failed")).toBe(
      '保存ツールの分岐 "projects" を読み込めません：import failed',
    );
    expect(copy.saveTools.loadingBranch("projects")).toBe(
      "「ローカルプロジェクト」を読み込んでいます…",
    );
    expect(copy.saveTools.loadingBranch("game-save")).toBe(
      "「ゲームセーブのインポート」を読み込んでいます…",
    );
    expect(copy.saveTools.loadingBranch("farm-summary")).toBe(
      "「牧場の概要」を読み込んでいます…",
    );
    expect(copy.saveTools.retryBranch("tools")).toBe("「ツール」を再読み込み");
    expect(copy.imageExport.exportFailure("canvas failed")).toBe(
      "スクリーンショットをエクスポートできませんでした：canvas failed",
    );
    expect(copy.imageExport.screenshotTitle).toBe("1倍解像度、ファイルサイズは小さめ");
    expect(copy.imageExport.screenshotHighQualityTitle).toBe("2倍解像度、より高い画質");
    expect(copy.thumbnail.saveFailure("quota exceeded")).toBe(
      "サムネイルを保存できませんでした：quota exceeded",
    );
    expect(copy.gameSave.importing("SaveGameInfo")).toBe(
      "「SaveGameInfo」をインポートしています…",
    );
    expect(copy.gameSave.importFailure("bad XML")).toBe(
      "ゲームセーブをインポートできませんでした：bad XML",
    );
    expect(copy.gameSave.description).toContain("スターデューバレー");
    expect(copy.gameSave.resultTitle("Bluebell")).toBe("「Bluebell牧場」");
    expect(copy.gameSave.unmappedItems(1)).toBe(
      "1件のアイテムを対応付けできませんでした（Mod由来の可能性があります）。",
    );
    expect(copy.gameSaveResultLoader.loadFailure("chunk failed")).toBe(
      "インポートしたゲームセーブの結果を読み込めませんでした：chunk failed",
    );
    expect(copy.farmSummaryPreview.itemsPlaced(4)).toBe("4個のアイテムを配置済み");
    expect(copy.farmSummaryPreview.season("spring")).toBe("春");
    expect(copy.farmSummaryPreview.season("summer")).toBe("夏");
    expect(copy.farmSummaryPreview.season("fall")).toBe("秋");
    expect(copy.farmSummaryPreview.season("winter")).toBe("冬");
    expect(copy.farmSummaryDetail.season("winter")).toBe("冬");
    expect(copy.farmSummaryDetail.exportFailure("download failed")).toBe(
      "牧場の概要をエクスポートできませんでした：download failed",
    );
    expect(copy.farmSummaryDetail.exportCsv).toBe("CSVをエクスポート");
    expect(() => copy.saveTools.loadingBranch("later" as SaveModalBranch)).toThrow(
      'Unsupported save-modal branch "later".',
    );
    expect(() => copy.farmSummaryPreview.season("monsoon" as FarmSummarySeason)).toThrow(
      'Unsupported farm summary season. Received: "monsoon".',
    );
    expect(() =>
      copy.cloudProjects.localProjectStatus("later" as CloudProjectSyncStatus),
    ).toThrow('Unsupported cloud project sync status. Received: "later".');
  });
});

function collectCopyKeyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const keyPaths: string[] = [];
  for (const key of Object.keys(value).sort()) {
    const keyPath = prefix.length === 0 ? key : `${prefix}.${key}`;
    keyPaths.push(keyPath);
    const child = (value as Record<string, unknown>)[key];
    if (typeof child === "object" && child !== null) {
      keyPaths.push(...collectCopyKeyPaths(child, keyPath));
    }
  }
  return keyPaths;
}
